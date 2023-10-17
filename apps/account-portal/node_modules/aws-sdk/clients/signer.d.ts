import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Signer extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Signer.Types.ClientConfiguration)
  config: Config & Signer.Types.ClientConfiguration;
  /**
   * Adds cross-account permissions to a signing profile.
   */
  addProfilePermission(params: Signer.Types.AddProfilePermissionRequest, callback?: (err: AWSError, data: Signer.Types.AddProfilePermissionResponse) => void): Request<Signer.Types.AddProfilePermissionResponse, AWSError>;
  /**
   * Adds cross-account permissions to a signing profile.
   */
  addProfilePermission(callback?: (err: AWSError, data: Signer.Types.AddProfilePermissionResponse) => void): Request<Signer.Types.AddProfilePermissionResponse, AWSError>;
  /**
   * Changes the state of an ACTIVE signing profile to CANCELED. A canceled profile is still viewable with the ListSigningProfiles operation, but it cannot perform new signing jobs, and is deleted two years after cancelation.
   */
  cancelSigningProfile(params: Signer.Types.CancelSigningProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of an ACTIVE signing profile to CANCELED. A canceled profile is still viewable with the ListSigningProfiles operation, but it cannot perform new signing jobs, and is deleted two years after cancelation.
   */
  cancelSigningProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns information about a specific code signing job. You specify the job by using the jobId value that is returned by the StartSigningJob operation. 
   */
  describeSigningJob(params: Signer.Types.DescribeSigningJobRequest, callback?: (err: AWSError, data: Signer.Types.DescribeSigningJobResponse) => void): Request<Signer.Types.DescribeSigningJobResponse, AWSError>;
  /**
   * Returns information about a specific code signing job. You specify the job by using the jobId value that is returned by the StartSigningJob operation. 
   */
  describeSigningJob(callback?: (err: AWSError, data: Signer.Types.DescribeSigningJobResponse) => void): Request<Signer.Types.DescribeSigningJobResponse, AWSError>;
  /**
   * Returns information on a specific signing platform.
   */
  getSigningPlatform(params: Signer.Types.GetSigningPlatformRequest, callback?: (err: AWSError, data: Signer.Types.GetSigningPlatformResponse) => void): Request<Signer.Types.GetSigningPlatformResponse, AWSError>;
  /**
   * Returns information on a specific signing platform.
   */
  getSigningPlatform(callback?: (err: AWSError, data: Signer.Types.GetSigningPlatformResponse) => void): Request<Signer.Types.GetSigningPlatformResponse, AWSError>;
  /**
   * Returns information on a specific signing profile.
   */
  getSigningProfile(params: Signer.Types.GetSigningProfileRequest, callback?: (err: AWSError, data: Signer.Types.GetSigningProfileResponse) => void): Request<Signer.Types.GetSigningProfileResponse, AWSError>;
  /**
   * Returns information on a specific signing profile.
   */
  getSigningProfile(callback?: (err: AWSError, data: Signer.Types.GetSigningProfileResponse) => void): Request<Signer.Types.GetSigningProfileResponse, AWSError>;
  /**
   * Lists the cross-account permissions associated with a signing profile.
   */
  listProfilePermissions(params: Signer.Types.ListProfilePermissionsRequest, callback?: (err: AWSError, data: Signer.Types.ListProfilePermissionsResponse) => void): Request<Signer.Types.ListProfilePermissionsResponse, AWSError>;
  /**
   * Lists the cross-account permissions associated with a signing profile.
   */
  listProfilePermissions(callback?: (err: AWSError, data: Signer.Types.ListProfilePermissionsResponse) => void): Request<Signer.Types.ListProfilePermissionsResponse, AWSError>;
  /**
   * Lists all your signing jobs. You can use the maxResults parameter to limit the number of signing jobs that are returned in the response. If additional jobs remain to be listed, code signing returns a nextToken value. Use this value in subsequent calls to ListSigningJobs to fetch the remaining values. You can continue calling ListSigningJobs with your maxResults parameter and with new values that code signing returns in the nextToken parameter until all of your signing jobs have been returned. 
   */
  listSigningJobs(params: Signer.Types.ListSigningJobsRequest, callback?: (err: AWSError, data: Signer.Types.ListSigningJobsResponse) => void): Request<Signer.Types.ListSigningJobsResponse, AWSError>;
  /**
   * Lists all your signing jobs. You can use the maxResults parameter to limit the number of signing jobs that are returned in the response. If additional jobs remain to be listed, code signing returns a nextToken value. Use this value in subsequent calls to ListSigningJobs to fetch the remaining values. You can continue calling ListSigningJobs with your maxResults parameter and with new values that code signing returns in the nextToken parameter until all of your signing jobs have been returned. 
   */
  listSigningJobs(callback?: (err: AWSError, data: Signer.Types.ListSigningJobsResponse) => void): Request<Signer.Types.ListSigningJobsResponse, AWSError>;
  /**
   * Lists all signing platforms available in code signing that match the request parameters. If additional jobs remain to be listed, code signing returns a nextToken value. Use this value in subsequent calls to ListSigningJobs to fetch the remaining values. You can continue calling ListSigningJobs with your maxResults parameter and with new values that code signing returns in the nextToken parameter until all of your signing jobs have been returned.
   */
  listSigningPlatforms(params: Signer.Types.ListSigningPlatformsRequest, callback?: (err: AWSError, data: Signer.Types.ListSigningPlatformsResponse) => void): Request<Signer.Types.ListSigningPlatformsResponse, AWSError>;
  /**
   * Lists all signing platforms available in code signing that match the request parameters. If additional jobs remain to be listed, code signing returns a nextToken value. Use this value in subsequent calls to ListSigningJobs to fetch the remaining values. You can continue calling ListSigningJobs with your maxResults parameter and with new values that code signing returns in the nextToken parameter until all of your signing jobs have been returned.
   */
  listSigningPlatforms(callback?: (err: AWSError, data: Signer.Types.ListSigningPlatformsResponse) => void): Request<Signer.Types.ListSigningPlatformsResponse, AWSError>;
  /**
   * Lists all available signing profiles in your AWS account. Returns only profiles with an ACTIVE status unless the includeCanceled request field is set to true. If additional jobs remain to be listed, code signing returns a nextToken value. Use this value in subsequent calls to ListSigningJobs to fetch the remaining values. You can continue calling ListSigningJobs with your maxResults parameter and with new values that code signing returns in the nextToken parameter until all of your signing jobs have been returned.
   */
  listSigningProfiles(params: Signer.Types.ListSigningProfilesRequest, callback?: (err: AWSError, data: Signer.Types.ListSigningProfilesResponse) => void): Request<Signer.Types.ListSigningProfilesResponse, AWSError>;
  /**
   * Lists all available signing profiles in your AWS account. Returns only profiles with an ACTIVE status unless the includeCanceled request field is set to true. If additional jobs remain to be listed, code signing returns a nextToken value. Use this value in subsequent calls to ListSigningJobs to fetch the remaining values. You can continue calling ListSigningJobs with your maxResults parameter and with new values that code signing returns in the nextToken parameter until all of your signing jobs have been returned.
   */
  listSigningProfiles(callback?: (err: AWSError, data: Signer.Types.ListSigningProfilesResponse) => void): Request<Signer.Types.ListSigningProfilesResponse, AWSError>;
  /**
   * Returns a list of the tags associated with a signing profile resource.
   */
  listTagsForResource(params: Signer.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Signer.Types.ListTagsForResourceResponse) => void): Request<Signer.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of the tags associated with a signing profile resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Signer.Types.ListTagsForResourceResponse) => void): Request<Signer.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates a signing profile. A signing profile is a code signing template that can be used to carry out a pre-defined signing job. For more information, see http://docs.aws.amazon.com/signer/latest/developerguide/gs-profile.html 
   */
  putSigningProfile(params: Signer.Types.PutSigningProfileRequest, callback?: (err: AWSError, data: Signer.Types.PutSigningProfileResponse) => void): Request<Signer.Types.PutSigningProfileResponse, AWSError>;
  /**
   * Creates a signing profile. A signing profile is a code signing template that can be used to carry out a pre-defined signing job. For more information, see http://docs.aws.amazon.com/signer/latest/developerguide/gs-profile.html 
   */
  putSigningProfile(callback?: (err: AWSError, data: Signer.Types.PutSigningProfileResponse) => void): Request<Signer.Types.PutSigningProfileResponse, AWSError>;
  /**
   * Removes cross-account permissions from a signing profile.
   */
  removeProfilePermission(params: Signer.Types.RemoveProfilePermissionRequest, callback?: (err: AWSError, data: Signer.Types.RemoveProfilePermissionResponse) => void): Request<Signer.Types.RemoveProfilePermissionResponse, AWSError>;
  /**
   * Removes cross-account permissions from a signing profile.
   */
  removeProfilePermission(callback?: (err: AWSError, data: Signer.Types.RemoveProfilePermissionResponse) => void): Request<Signer.Types.RemoveProfilePermissionResponse, AWSError>;
  /**
   * Changes the state of a signing job to REVOKED. This indicates that the signature is no longer valid.
   */
  revokeSignature(params: Signer.Types.RevokeSignatureRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a signing job to REVOKED. This indicates that the signature is no longer valid.
   */
  revokeSignature(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a signing profile to REVOKED. This indicates that signatures generated using the signing profile after an effective start date are no longer valid.
   */
  revokeSigningProfile(params: Signer.Types.RevokeSigningProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the state of a signing profile to REVOKED. This indicates that signatures generated using the signing profile after an effective start date are no longer valid.
   */
  revokeSigningProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Initiates a signing job to be performed on the code provided. Signing jobs are viewable by the ListSigningJobs operation for two years after they are performed. Note the following requirements:     You must create an Amazon S3 source bucket. For more information, see Create a Bucket in the Amazon S3 Getting Started Guide.    Your S3 source bucket must be version enabled.   You must create an S3 destination bucket. Code signing uses your S3 destination bucket to write your signed code.   You specify the name of the source and destination buckets when calling the StartSigningJob operation.   You must also specify a request token that identifies your request to code signing.   You can call the DescribeSigningJob and the ListSigningJobs actions after you call StartSigningJob. For a Java example that shows how to use this action, see http://docs.aws.amazon.com/acm/latest/userguide/ 
   */
  startSigningJob(params: Signer.Types.StartSigningJobRequest, callback?: (err: AWSError, data: Signer.Types.StartSigningJobResponse) => void): Request<Signer.Types.StartSigningJobResponse, AWSError>;
  /**
   * Initiates a signing job to be performed on the code provided. Signing jobs are viewable by the ListSigningJobs operation for two years after they are performed. Note the following requirements:     You must create an Amazon S3 source bucket. For more information, see Create a Bucket in the Amazon S3 Getting Started Guide.    Your S3 source bucket must be version enabled.   You must create an S3 destination bucket. Code signing uses your S3 destination bucket to write your signed code.   You specify the name of the source and destination buckets when calling the StartSigningJob operation.   You must also specify a request token that identifies your request to code signing.   You can call the DescribeSigningJob and the ListSigningJobs actions after you call StartSigningJob. For a Java example that shows how to use this action, see http://docs.aws.amazon.com/acm/latest/userguide/ 
   */
  startSigningJob(callback?: (err: AWSError, data: Signer.Types.StartSigningJobResponse) => void): Request<Signer.Types.StartSigningJobResponse, AWSError>;
  /**
   * Adds one or more tags to a signing profile. Tags are labels that you can use to identify and organize your AWS resources. Each tag consists of a key and an optional value. To specify the signing profile, use its Amazon Resource Name (ARN). To specify the tag, use a key-value pair.
   */
  tagResource(params: Signer.Types.TagResourceRequest, callback?: (err: AWSError, data: Signer.Types.TagResourceResponse) => void): Request<Signer.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to a signing profile. Tags are labels that you can use to identify and organize your AWS resources. Each tag consists of a key and an optional value. To specify the signing profile, use its Amazon Resource Name (ARN). To specify the tag, use a key-value pair.
   */
  tagResource(callback?: (err: AWSError, data: Signer.Types.TagResourceResponse) => void): Request<Signer.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a signing profile. To remove the tags, specify a list of tag keys.
   */
  untagResource(params: Signer.Types.UntagResourceRequest, callback?: (err: AWSError, data: Signer.Types.UntagResourceResponse) => void): Request<Signer.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a signing profile. To remove the tags, specify a list of tag keys.
   */
  untagResource(callback?: (err: AWSError, data: Signer.Types.UntagResourceResponse) => void): Request<Signer.Types.UntagResourceResponse, AWSError>;
  /**
   * Waits for the successfulSigningJob state by periodically calling the underlying Signer.describeSigningJoboperation every 20 seconds (at most 25 times).
   */
  waitFor(state: "successfulSigningJob", params: Signer.Types.DescribeSigningJobRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Signer.Types.DescribeSigningJobResponse) => void): Request<Signer.Types.DescribeSigningJobResponse, AWSError>;
  /**
   * Waits for the successfulSigningJob state by periodically calling the underlying Signer.describeSigningJoboperation every 20 seconds (at most 25 times).
   */
  waitFor(state: "successfulSigningJob", callback?: (err: AWSError, data: Signer.Types.DescribeSigningJobResponse) => void): Request<Signer.Types.DescribeSigningJobResponse, AWSError>;
}
declare namespace Signer {
  export type AccountId = string;
  export interface AddProfilePermissionRequest {
    /**
     * The human-readable name of the signing profile.
     */
    profileName: ProfileName;
    /**
     * The version of the signing profile.
     */
    profileVersion?: ProfileVersion;
    /**
     * The AWS Signer action permitted as part of cross-account permissions.
     */
    action: String;
    /**
     * The AWS principal receiving cross-account permissions. This may be an IAM role or another AWS account ID.
     */
    principal: String;
    /**
     * A unique identifier for the current profile revision.
     */
    revisionId?: String;
    /**
     * A unique identifier for the cross-account permission statement.
     */
    statementId: String;
  }
  export interface AddProfilePermissionResponse {
    /**
     * A unique identifier for the current profile revision.
     */
    revisionId?: String;
  }
  export type Arn = string;
  export type BucketName = string;
  export interface CancelSigningProfileRequest {
    /**
     * The name of the signing profile to be canceled.
     */
    profileName: ProfileName;
  }
  export type Category = "AWSIoT"|string;
  export type CertificateArn = string;
  export type ClientRequestToken = string;
  export interface DescribeSigningJobRequest {
    /**
     * The ID of the signing job on input.
     */
    jobId: JobId;
  }
  export interface DescribeSigningJobResponse {
    /**
     * The ID of the signing job on output.
     */
    jobId?: JobId;
    /**
     * The object that contains the name of your S3 bucket or your raw code.
     */
    source?: Source;
    /**
     * The Amazon Resource Name (ARN) of your code signing certificate.
     */
    signingMaterial?: SigningMaterial;
    /**
     * The microcontroller platform to which your signed code image will be distributed.
     */
    platformId?: PlatformId;
    /**
     * A human-readable name for the signing platform associated with the signing job.
     */
    platformDisplayName?: DisplayName;
    /**
     * The name of the profile that initiated the signing operation.
     */
    profileName?: ProfileName;
    /**
     * The version of the signing profile used to initiate the signing job.
     */
    profileVersion?: ProfileVersion;
    /**
     * A list of any overrides that were applied to the signing operation.
     */
    overrides?: SigningPlatformOverrides;
    /**
     * Map of user-assigned key-value pairs used during signing. These values contain any information that you specified for use in your signing job. 
     */
    signingParameters?: SigningParameters;
    /**
     * Date and time that the signing job was created.
     */
    createdAt?: Timestamp;
    /**
     * Date and time that the signing job was completed.
     */
    completedAt?: Timestamp;
    /**
     * Thr expiration timestamp for the signature generated by the signing job.
     */
    signatureExpiresAt?: Timestamp;
    /**
     * The IAM principal that requested the signing job.
     */
    requestedBy?: RequestedBy;
    /**
     * Status of the signing job.
     */
    status?: SigningStatus;
    /**
     * String value that contains the status reason.
     */
    statusReason?: StatusReason;
    /**
     * A revocation record if the signature generated by the signing job has been revoked. Contains a timestamp and the ID of the IAM entity that revoked the signature.
     */
    revocationRecord?: SigningJobRevocationRecord;
    /**
     * Name of the S3 bucket where the signed code image is saved by code signing.
     */
    signedObject?: SignedObject;
    /**
     * The AWS account ID of the job owner.
     */
    jobOwner?: AccountId;
    /**
     * The IAM entity that initiated the signing job.
     */
    jobInvoker?: AccountId;
  }
  export interface Destination {
    /**
     * The S3Destination object.
     */
    s3?: S3Destination;
  }
  export type DisplayName = string;
  export type EncryptionAlgorithm = "RSA"|"ECDSA"|string;
  export interface EncryptionAlgorithmOptions {
    /**
     * The set of accepted encryption algorithms that are allowed in a code signing job.
     */
    allowedValues: EncryptionAlgorithms;
    /**
     * The default encryption algorithm that is used by a code signing job.
     */
    defaultValue: EncryptionAlgorithm;
  }
  export type EncryptionAlgorithms = EncryptionAlgorithm[];
  export interface GetSigningPlatformRequest {
    /**
     * The ID of the target signing platform.
     */
    platformId: PlatformId;
  }
  export interface GetSigningPlatformResponse {
    /**
     * The ID of the target signing platform.
     */
    platformId?: PlatformId;
    /**
     * The display name of the target signing platform.
     */
    displayName?: DisplayName;
    /**
     * A list of partner entities that use the target signing platform.
     */
    partner?: String;
    /**
     * The validation template that is used by the target signing platform.
     */
    target?: String;
    /**
     * The category type of the target signing platform.
     */
    category?: Category;
    /**
     * A list of configurations applied to the target platform at signing.
     */
    signingConfiguration?: SigningConfiguration;
    /**
     * The format of the target platform's signing image.
     */
    signingImageFormat?: SigningImageFormat;
    /**
     * The maximum size (in MB) of the payload that can be signed by the target platform.
     */
    maxSizeInMB?: MaxSizeInMB;
    /**
     * A flag indicating whether signatures generated for the signing platform can be revoked.
     */
    revocationSupported?: bool;
  }
  export interface GetSigningProfileRequest {
    /**
     * The name of the target signing profile.
     */
    profileName: ProfileName;
    /**
     * The AWS account ID of the profile owner.
     */
    profileOwner?: AccountId;
  }
  export interface GetSigningProfileResponse {
    /**
     * The name of the target signing profile.
     */
    profileName?: ProfileName;
    /**
     * The current version of the signing profile.
     */
    profileVersion?: ProfileVersion;
    /**
     * The signing profile ARN, including the profile version.
     */
    profileVersionArn?: Arn;
    revocationRecord?: SigningProfileRevocationRecord;
    /**
     * The ARN of the certificate that the target profile uses for signing operations.
     */
    signingMaterial?: SigningMaterial;
    /**
     * The ID of the platform that is used by the target signing profile.
     */
    platformId?: PlatformId;
    /**
     * A human-readable name for the signing platform associated with the signing profile.
     */
    platformDisplayName?: DisplayName;
    signatureValidityPeriod?: SignatureValidityPeriod;
    /**
     * A list of overrides applied by the target signing profile for signing operations.
     */
    overrides?: SigningPlatformOverrides;
    /**
     * A map of key-value pairs for signing operations that is attached to the target signing profile.
     */
    signingParameters?: SigningParameters;
    /**
     * The status of the target signing profile.
     */
    status?: SigningProfileStatus;
    /**
     * Reason for the status of the target signing profile.
     */
    statusReason?: String;
    /**
     * The Amazon Resource Name (ARN) for the signing profile.
     */
    arn?: string;
    /**
     * A list of tags associated with the signing profile.
     */
    tags?: TagMap;
  }
  export type HashAlgorithm = "SHA1"|"SHA256"|string;
  export interface HashAlgorithmOptions {
    /**
     * The set of accepted hash algorithms allowed in a code signing job.
     */
    allowedValues: HashAlgorithms;
    /**
     * The default hash algorithm that is used in a code signing job.
     */
    defaultValue: HashAlgorithm;
  }
  export type HashAlgorithms = HashAlgorithm[];
  export type ImageFormat = "JSON"|"JSONEmbedded"|"JSONDetached"|string;
  export type ImageFormats = ImageFormat[];
  export type Integer = number;
  export type JobId = string;
  export type Key = string;
  export interface ListProfilePermissionsRequest {
    /**
     * Name of the signing profile containing the cross-account permissions.
     */
    profileName: ProfileName;
    /**
     * String for specifying the next set of paginated results.
     */
    nextToken?: String;
  }
  export interface ListProfilePermissionsResponse {
    /**
     * The identifier for the current revision of profile permissions.
     */
    revisionId?: String;
    /**
     * Total size of the policy associated with the Signing Profile in bytes.
     */
    policySizeBytes?: PolicySizeBytes;
    /**
     * List of permissions associated with the Signing Profile.
     */
    permissions?: Permissions;
    /**
     * String for specifying the next set of paginated results.
     */
    nextToken?: String;
  }
  export interface ListSigningJobsRequest {
    /**
     * A status value with which to filter your results.
     */
    status?: SigningStatus;
    /**
     * The ID of microcontroller platform that you specified for the distribution of your code image.
     */
    platformId?: PlatformId;
    /**
     * The IAM principal that requested the signing job.
     */
    requestedBy?: RequestedBy;
    /**
     * Specifies the maximum number of items to return in the response. Use this parameter when paginating results. If additional items exist beyond the number you specify, the nextToken element is set in the response. Use the nextToken value in a subsequent request to retrieve additional items. 
     */
    maxResults?: MaxResults;
    /**
     * String for specifying the next set of paginated results to return. After you receive a response with truncated results, use this parameter in a subsequent request. Set it to the value of nextToken from the response that you just received.
     */
    nextToken?: NextToken;
    /**
     * Filters results to return only signing jobs with revoked signatures.
     */
    isRevoked?: bool;
    /**
     * Filters results to return only signing jobs with signatures expiring before a specified timestamp.
     */
    signatureExpiresBefore?: Timestamp;
    /**
     * Filters results to return only signing jobs with signatures expiring after a specified timestamp.
     */
    signatureExpiresAfter?: Timestamp;
    /**
     * Filters results to return only signing jobs initiated by a specified IAM entity.
     */
    jobInvoker?: AccountId;
  }
  export interface ListSigningJobsResponse {
    /**
     * A list of your signing jobs.
     */
    jobs?: SigningJobs;
    /**
     * String for specifying the next set of paginated results.
     */
    nextToken?: NextToken;
  }
  export interface ListSigningPlatformsRequest {
    /**
     * The category type of a signing platform.
     */
    category?: String;
    /**
     * Any partner entities connected to a signing platform.
     */
    partner?: String;
    /**
     * The validation template that is used by the target signing platform.
     */
    target?: String;
    /**
     * The maximum number of results to be returned by this operation.
     */
    maxResults?: MaxResults;
    /**
     * Value for specifying the next set of paginated results to return. After you receive a response with truncated results, use this parameter in a subsequent request. Set it to the value of nextToken from the response that you just received.
     */
    nextToken?: String;
  }
  export interface ListSigningPlatformsResponse {
    /**
     * A list of all platforms that match the request parameters.
     */
    platforms?: SigningPlatforms;
    /**
     * Value for specifying the next set of paginated results to return.
     */
    nextToken?: String;
  }
  export interface ListSigningProfilesRequest {
    /**
     * Designates whether to include profiles with the status of CANCELED.
     */
    includeCanceled?: bool;
    /**
     * The maximum number of profiles to be returned.
     */
    maxResults?: MaxResults;
    /**
     * Value for specifying the next set of paginated results to return. After you receive a response with truncated results, use this parameter in a subsequent request. Set it to the value of nextToken from the response that you just received.
     */
    nextToken?: NextToken;
    /**
     * Filters results to return only signing jobs initiated for a specified signing platform.
     */
    platformId?: PlatformId;
    /**
     * Filters results to return only signing jobs with statuses in the specified list.
     */
    statuses?: Statuses;
  }
  export interface ListSigningProfilesResponse {
    /**
     * A list of profiles that are available in the AWS account. This includes profiles with the status of CANCELED if the includeCanceled parameter is set to true.
     */
    profiles?: SigningProfiles;
    /**
     * Value for specifying the next set of paginated results to return.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the signing profile.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tags associated with the signing profile.
     */
    tags?: TagMap;
  }
  export type MaxResults = number;
  export type MaxSizeInMB = number;
  export type NextToken = string;
  export interface Permission {
    /**
     * An AWS Signer action permitted as part of cross-account permissions.
     */
    action?: String;
    /**
     * The AWS principal that has been granted a cross-account permission.
     */
    principal?: String;
    /**
     * A unique identifier for a cross-account permission statement.
     */
    statementId?: String;
    /**
     * The signing profile version that a permission applies to.
     */
    profileVersion?: ProfileVersion;
  }
  export type Permissions = Permission[];
  export type PlatformId = string;
  export type PolicySizeBytes = number;
  export type Prefix = string;
  export type ProfileName = string;
  export type ProfileVersion = string;
  export interface PutSigningProfileRequest {
    /**
     * The name of the signing profile to be created.
     */
    profileName: ProfileName;
    /**
     * The AWS Certificate Manager certificate that will be used to sign code with the new signing profile.
     */
    signingMaterial?: SigningMaterial;
    /**
     * The default validity period override for any signature generated using this signing profile. If unspecified, the default is 135 months.
     */
    signatureValidityPeriod?: SignatureValidityPeriod;
    /**
     * The ID of the signing platform to be created.
     */
    platformId: PlatformId;
    /**
     * A subfield of platform. This specifies any different configuration options that you want to apply to the chosen platform (such as a different hash-algorithm or signing-algorithm).
     */
    overrides?: SigningPlatformOverrides;
    /**
     * Map of key-value pairs for signing. These can include any information that you want to use during signing.
     */
    signingParameters?: SigningParameters;
    /**
     * Tags to be associated with the signing profile that is being created.
     */
    tags?: TagMap;
  }
  export interface PutSigningProfileResponse {
    /**
     * The Amazon Resource Name (ARN) of the signing profile created.
     */
    arn?: string;
    /**
     * The version of the signing profile being created.
     */
    profileVersion?: ProfileVersion;
    /**
     * The signing profile ARN, including the profile version.
     */
    profileVersionArn?: Arn;
  }
  export interface RemoveProfilePermissionRequest {
    /**
     * A human-readable name for the signing profile with permissions to be removed.
     */
    profileName: ProfileName;
    /**
     * An identifier for the current revision of the signing profile permissions.
     */
    revisionId: String;
    /**
     * A unique identifier for the cross-account permissions statement.
     */
    statementId: String;
  }
  export interface RemoveProfilePermissionResponse {
    /**
     * An identifier for the current revision of the profile permissions.
     */
    revisionId?: String;
  }
  export type RequestedBy = string;
  export type RevocationReasonString = string;
  export interface RevokeSignatureRequest {
    /**
     * ID of the signing job to be revoked.
     */
    jobId: JobId;
    /**
     * AWS account ID of the job owner.
     */
    jobOwner?: AccountId;
    /**
     * The reason for revoking the signing job.
     */
    reason: RevocationReasonString;
  }
  export interface RevokeSigningProfileRequest {
    /**
     * The name of the signing profile to be revoked.
     */
    profileName: ProfileName;
    /**
     * The version of the signing profile to be revoked.
     */
    profileVersion: ProfileVersion;
    /**
     * The reason for revoking a signing profile.
     */
    reason: RevocationReasonString;
    /**
     * A timestamp for when revocation of a Signing Profile should become effective. Signatures generated using the signing profile after this timestamp are not trusted.
     */
    effectiveTime: Timestamp;
  }
  export interface S3Destination {
    /**
     * Name of the S3 bucket.
     */
    bucketName?: BucketName;
    /**
     * An Amazon S3 prefix that you can use to limit responses to those that begin with the specified prefix.
     */
    prefix?: Prefix;
  }
  export interface S3SignedObject {
    /**
     * Name of the S3 bucket.
     */
    bucketName?: BucketName;
    /**
     * Key name that uniquely identifies a signed code image in your bucket.
     */
    key?: Key;
  }
  export interface S3Source {
    /**
     * Name of the S3 bucket.
     */
    bucketName: BucketName;
    /**
     * Key name of the bucket object that contains your unsigned code.
     */
    key: Key;
    /**
     * Version of your source image in your version enabled S3 bucket.
     */
    version: Version;
  }
  export interface SignatureValidityPeriod {
    /**
     * The numerical value of the time unit for signature validity.
     */
    value?: Integer;
    /**
     * The time unit for signature validity.
     */
    type?: ValidityType;
  }
  export interface SignedObject {
    /**
     * The S3SignedObject.
     */
    s3?: S3SignedObject;
  }
  export interface SigningConfiguration {
    /**
     * The encryption algorithm options that are available for a code signing job.
     */
    encryptionAlgorithmOptions: EncryptionAlgorithmOptions;
    /**
     * The hash algorithm options that are available for a code signing job.
     */
    hashAlgorithmOptions: HashAlgorithmOptions;
  }
  export interface SigningConfigurationOverrides {
    /**
     * A specified override of the default encryption algorithm that is used in a code signing job.
     */
    encryptionAlgorithm?: EncryptionAlgorithm;
    /**
     * A specified override of the default hash algorithm that is used in a code signing job.
     */
    hashAlgorithm?: HashAlgorithm;
  }
  export interface SigningImageFormat {
    /**
     * The supported formats of a code signing image.
     */
    supportedFormats: ImageFormats;
    /**
     * The default format of a code signing image.
     */
    defaultFormat: ImageFormat;
  }
  export interface SigningJob {
    /**
     * The ID of the signing job.
     */
    jobId?: JobId;
    /**
     * A Source that contains information about a signing job's code image source.
     */
    source?: Source;
    /**
     * A SignedObject structure that contains information about a signing job's signed code image.
     */
    signedObject?: SignedObject;
    /**
     * A SigningMaterial object that contains the Amazon Resource Name (ARN) of the certificate used for the signing job.
     */
    signingMaterial?: SigningMaterial;
    /**
     * The date and time that the signing job was created.
     */
    createdAt?: Timestamp;
    /**
     * The status of the signing job.
     */
    status?: SigningStatus;
    /**
     * Indicates whether the signing job is revoked.
     */
    isRevoked?: bool;
    /**
     * The name of the signing profile that created a signing job.
     */
    profileName?: ProfileName;
    /**
     * The version of the signing profile that created a signing job.
     */
    profileVersion?: ProfileVersion;
    /**
     * The unique identifier for a signing platform.
     */
    platformId?: PlatformId;
    /**
     * The name of a signing platform.
     */
    platformDisplayName?: DisplayName;
    /**
     * The time when the signature of a signing job expires.
     */
    signatureExpiresAt?: Timestamp;
    /**
     * The AWS account ID of the job owner.
     */
    jobOwner?: AccountId;
    /**
     * The AWS account ID of the job invoker.
     */
    jobInvoker?: AccountId;
  }
  export interface SigningJobRevocationRecord {
    /**
     * A caller-supplied reason for revocation.
     */
    reason?: String;
    /**
     * The time of revocation.
     */
    revokedAt?: Timestamp;
    /**
     * The identity of the revoker.
     */
    revokedBy?: String;
  }
  export type SigningJobs = SigningJob[];
  export interface SigningMaterial {
    /**
     * The Amazon Resource Name (ARN) of the certificates that is used to sign your code.
     */
    certificateArn: CertificateArn;
  }
  export type SigningParameterKey = string;
  export type SigningParameterValue = string;
  export type SigningParameters = {[key: string]: SigningParameterValue};
  export interface SigningPlatform {
    /**
     * The ID of a code signing; platform.
     */
    platformId?: String;
    /**
     * The display name of a code signing platform.
     */
    displayName?: String;
    /**
     * Any partner entities linked to a code signing platform.
     */
    partner?: String;
    /**
     * The types of targets that can be signed by a code signing platform.
     */
    target?: String;
    /**
     * The category of a code signing platform.
     */
    category?: Category;
    /**
     * The configuration of a code signing platform. This includes the designated hash algorithm and encryption algorithm of a signing platform.
     */
    signingConfiguration?: SigningConfiguration;
    signingImageFormat?: SigningImageFormat;
    /**
     * The maximum size (in MB) of code that can be signed by a code signing platform.
     */
    maxSizeInMB?: MaxSizeInMB;
    /**
     * Indicates whether revocation is supported for the platform.
     */
    revocationSupported?: bool;
  }
  export interface SigningPlatformOverrides {
    /**
     * A signing configuration that overrides the default encryption or hash algorithm of a signing job.
     */
    signingConfiguration?: SigningConfigurationOverrides;
    /**
     * A signed image is a JSON object. When overriding the default signing platform configuration, a customer can select either of two signing formats, JSONEmbedded or JSONDetached. (A third format value, JSON, is reserved for future use.) With JSONEmbedded, the signing image has the payload embedded in it. With JSONDetached, the payload is not be embedded in the signing image.
     */
    signingImageFormat?: ImageFormat;
  }
  export type SigningPlatforms = SigningPlatform[];
  export interface SigningProfile {
    /**
     * The name of the signing profile.
     */
    profileName?: ProfileName;
    /**
     * The version of a signing profile.
     */
    profileVersion?: ProfileVersion;
    /**
     * The ARN of a signing profile, including the profile version.
     */
    profileVersionArn?: Arn;
    /**
     * The ACM certificate that is available for use by a signing profile.
     */
    signingMaterial?: SigningMaterial;
    /**
     * The validity period for a signing job created using this signing profile.
     */
    signatureValidityPeriod?: SignatureValidityPeriod;
    /**
     * The ID of a platform that is available for use by a signing profile.
     */
    platformId?: PlatformId;
    /**
     * The name of the signing platform.
     */
    platformDisplayName?: DisplayName;
    /**
     * The parameters that are available for use by a code signing user.
     */
    signingParameters?: SigningParameters;
    /**
     * The status of a code signing profile.
     */
    status?: SigningProfileStatus;
    /**
     * The Amazon Resource Name (ARN) for the signing profile.
     */
    arn?: string;
    /**
     * A list of tags associated with the signing profile.
     */
    tags?: TagMap;
  }
  export interface SigningProfileRevocationRecord {
    /**
     * The time when revocation becomes effective.
     */
    revocationEffectiveFrom?: Timestamp;
    /**
     * The time when the signing profile was revoked.
     */
    revokedAt?: Timestamp;
    /**
     * The identity of the revoker.
     */
    revokedBy?: String;
  }
  export type SigningProfileStatus = "Active"|"Canceled"|"Revoked"|string;
  export type SigningProfiles = SigningProfile[];
  export type SigningStatus = "InProgress"|"Failed"|"Succeeded"|string;
  export interface Source {
    /**
     * The S3Source object.
     */
    s3?: S3Source;
  }
  export interface StartSigningJobRequest {
    /**
     * The S3 bucket that contains the object to sign or a BLOB that contains your raw code.
     */
    source: Source;
    /**
     * The S3 bucket in which to save your signed object. The destination contains the name of your bucket and an optional prefix.
     */
    destination: Destination;
    /**
     * The name of the signing profile.
     */
    profileName: ProfileName;
    /**
     * String that identifies the signing request. All calls after the first that use this token return the same response as the first call.
     */
    clientRequestToken: ClientRequestToken;
    /**
     * The AWS account ID of the signing profile owner.
     */
    profileOwner?: AccountId;
  }
  export interface StartSigningJobResponse {
    /**
     * The ID of your signing job.
     */
    jobId?: JobId;
    /**
     * The AWS account ID of the signing job owner.
     */
    jobOwner?: AccountId;
  }
  export type StatusReason = string;
  export type Statuses = SigningProfileStatus[];
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the signing profile.
     */
    resourceArn: String;
    /**
     * One or more tags to be associated with the signing profile.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the signing profile.
     */
    resourceArn: String;
    /**
     * A list of tag keys to be removed from the signing profile.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type ValidityType = "DAYS"|"MONTHS"|"YEARS"|string;
  export type Version = string;
  export type bool = boolean;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-08-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Signer client.
   */
  export import Types = Signer;
}
export = Signer;
