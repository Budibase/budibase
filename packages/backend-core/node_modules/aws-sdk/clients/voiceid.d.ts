import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class VoiceID extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: VoiceID.Types.ClientConfiguration)
  config: Config & VoiceID.Types.ClientConfiguration;
  /**
   * Creates a domain that contains all Amazon Connect Voice ID data, such as speakers, fraudsters, customer audio, and voiceprints. 
   */
  createDomain(params: VoiceID.Types.CreateDomainRequest, callback?: (err: AWSError, data: VoiceID.Types.CreateDomainResponse) => void): Request<VoiceID.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a domain that contains all Amazon Connect Voice ID data, such as speakers, fraudsters, customer audio, and voiceprints. 
   */
  createDomain(callback?: (err: AWSError, data: VoiceID.Types.CreateDomainResponse) => void): Request<VoiceID.Types.CreateDomainResponse, AWSError>;
  /**
   * Deletes the specified domain from the Amazon Connect Voice ID system.
   */
  deleteDomain(params: VoiceID.Types.DeleteDomainRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified domain from the Amazon Connect Voice ID system.
   */
  deleteDomain(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified fraudster from the Amazon Connect Voice ID system.
   */
  deleteFraudster(params: VoiceID.Types.DeleteFraudsterRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified fraudster from the Amazon Connect Voice ID system.
   */
  deleteFraudster(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified speaker from the Amazon Connect Voice ID system.
   */
  deleteSpeaker(params: VoiceID.Types.DeleteSpeakerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified speaker from the Amazon Connect Voice ID system.
   */
  deleteSpeaker(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes the specified domain.
   */
  describeDomain(params: VoiceID.Types.DescribeDomainRequest, callback?: (err: AWSError, data: VoiceID.Types.DescribeDomainResponse) => void): Request<VoiceID.Types.DescribeDomainResponse, AWSError>;
  /**
   * Describes the specified domain.
   */
  describeDomain(callback?: (err: AWSError, data: VoiceID.Types.DescribeDomainResponse) => void): Request<VoiceID.Types.DescribeDomainResponse, AWSError>;
  /**
   * Describes the specified fraudster.
   */
  describeFraudster(params: VoiceID.Types.DescribeFraudsterRequest, callback?: (err: AWSError, data: VoiceID.Types.DescribeFraudsterResponse) => void): Request<VoiceID.Types.DescribeFraudsterResponse, AWSError>;
  /**
   * Describes the specified fraudster.
   */
  describeFraudster(callback?: (err: AWSError, data: VoiceID.Types.DescribeFraudsterResponse) => void): Request<VoiceID.Types.DescribeFraudsterResponse, AWSError>;
  /**
   * Describes the specified fraudster registration job.
   */
  describeFraudsterRegistrationJob(params: VoiceID.Types.DescribeFraudsterRegistrationJobRequest, callback?: (err: AWSError, data: VoiceID.Types.DescribeFraudsterRegistrationJobResponse) => void): Request<VoiceID.Types.DescribeFraudsterRegistrationJobResponse, AWSError>;
  /**
   * Describes the specified fraudster registration job.
   */
  describeFraudsterRegistrationJob(callback?: (err: AWSError, data: VoiceID.Types.DescribeFraudsterRegistrationJobResponse) => void): Request<VoiceID.Types.DescribeFraudsterRegistrationJobResponse, AWSError>;
  /**
   * Describes the specified speaker.
   */
  describeSpeaker(params: VoiceID.Types.DescribeSpeakerRequest, callback?: (err: AWSError, data: VoiceID.Types.DescribeSpeakerResponse) => void): Request<VoiceID.Types.DescribeSpeakerResponse, AWSError>;
  /**
   * Describes the specified speaker.
   */
  describeSpeaker(callback?: (err: AWSError, data: VoiceID.Types.DescribeSpeakerResponse) => void): Request<VoiceID.Types.DescribeSpeakerResponse, AWSError>;
  /**
   * Describes the specified speaker enrollment job.
   */
  describeSpeakerEnrollmentJob(params: VoiceID.Types.DescribeSpeakerEnrollmentJobRequest, callback?: (err: AWSError, data: VoiceID.Types.DescribeSpeakerEnrollmentJobResponse) => void): Request<VoiceID.Types.DescribeSpeakerEnrollmentJobResponse, AWSError>;
  /**
   * Describes the specified speaker enrollment job.
   */
  describeSpeakerEnrollmentJob(callback?: (err: AWSError, data: VoiceID.Types.DescribeSpeakerEnrollmentJobResponse) => void): Request<VoiceID.Types.DescribeSpeakerEnrollmentJobResponse, AWSError>;
  /**
   * Evaluates a specified session based on audio data accumulated during a streaming Amazon Connect Voice ID call.
   */
  evaluateSession(params: VoiceID.Types.EvaluateSessionRequest, callback?: (err: AWSError, data: VoiceID.Types.EvaluateSessionResponse) => void): Request<VoiceID.Types.EvaluateSessionResponse, AWSError>;
  /**
   * Evaluates a specified session based on audio data accumulated during a streaming Amazon Connect Voice ID call.
   */
  evaluateSession(callback?: (err: AWSError, data: VoiceID.Types.EvaluateSessionResponse) => void): Request<VoiceID.Types.EvaluateSessionResponse, AWSError>;
  /**
   * Lists all the domains in the Amazon Web Services account. 
   */
  listDomains(params: VoiceID.Types.ListDomainsRequest, callback?: (err: AWSError, data: VoiceID.Types.ListDomainsResponse) => void): Request<VoiceID.Types.ListDomainsResponse, AWSError>;
  /**
   * Lists all the domains in the Amazon Web Services account. 
   */
  listDomains(callback?: (err: AWSError, data: VoiceID.Types.ListDomainsResponse) => void): Request<VoiceID.Types.ListDomainsResponse, AWSError>;
  /**
   * Lists all the fraudster registration jobs in the domain with the given JobStatus. If JobStatus is not provided, this lists all fraudster registration jobs in the given domain. 
   */
  listFraudsterRegistrationJobs(params: VoiceID.Types.ListFraudsterRegistrationJobsRequest, callback?: (err: AWSError, data: VoiceID.Types.ListFraudsterRegistrationJobsResponse) => void): Request<VoiceID.Types.ListFraudsterRegistrationJobsResponse, AWSError>;
  /**
   * Lists all the fraudster registration jobs in the domain with the given JobStatus. If JobStatus is not provided, this lists all fraudster registration jobs in the given domain. 
   */
  listFraudsterRegistrationJobs(callback?: (err: AWSError, data: VoiceID.Types.ListFraudsterRegistrationJobsResponse) => void): Request<VoiceID.Types.ListFraudsterRegistrationJobsResponse, AWSError>;
  /**
   * Lists all the speaker enrollment jobs in the domain with the specified JobStatus. If JobStatus is not provided, this lists all jobs with all possible speaker enrollment job statuses.
   */
  listSpeakerEnrollmentJobs(params: VoiceID.Types.ListSpeakerEnrollmentJobsRequest, callback?: (err: AWSError, data: VoiceID.Types.ListSpeakerEnrollmentJobsResponse) => void): Request<VoiceID.Types.ListSpeakerEnrollmentJobsResponse, AWSError>;
  /**
   * Lists all the speaker enrollment jobs in the domain with the specified JobStatus. If JobStatus is not provided, this lists all jobs with all possible speaker enrollment job statuses.
   */
  listSpeakerEnrollmentJobs(callback?: (err: AWSError, data: VoiceID.Types.ListSpeakerEnrollmentJobsResponse) => void): Request<VoiceID.Types.ListSpeakerEnrollmentJobsResponse, AWSError>;
  /**
   * Lists all speakers in a specified domain.
   */
  listSpeakers(params: VoiceID.Types.ListSpeakersRequest, callback?: (err: AWSError, data: VoiceID.Types.ListSpeakersResponse) => void): Request<VoiceID.Types.ListSpeakersResponse, AWSError>;
  /**
   * Lists all speakers in a specified domain.
   */
  listSpeakers(callback?: (err: AWSError, data: VoiceID.Types.ListSpeakersResponse) => void): Request<VoiceID.Types.ListSpeakersResponse, AWSError>;
  /**
   * Lists all tags associated with a specified Voice ID resource.
   */
  listTagsForResource(params: VoiceID.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: VoiceID.Types.ListTagsForResourceResponse) => void): Request<VoiceID.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags associated with a specified Voice ID resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: VoiceID.Types.ListTagsForResourceResponse) => void): Request<VoiceID.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Opts out a speaker from Voice ID system. A speaker can be opted out regardless of whether or not they already exist in the system. If they don't yet exist, a new speaker is created in an opted out state. If they already exist, their existing status is overridden and they are opted out. Enrollment and evaluation authentication requests are rejected for opted out speakers, and opted out speakers have no voice embeddings stored in the system.
   */
  optOutSpeaker(params: VoiceID.Types.OptOutSpeakerRequest, callback?: (err: AWSError, data: VoiceID.Types.OptOutSpeakerResponse) => void): Request<VoiceID.Types.OptOutSpeakerResponse, AWSError>;
  /**
   * Opts out a speaker from Voice ID system. A speaker can be opted out regardless of whether or not they already exist in the system. If they don't yet exist, a new speaker is created in an opted out state. If they already exist, their existing status is overridden and they are opted out. Enrollment and evaluation authentication requests are rejected for opted out speakers, and opted out speakers have no voice embeddings stored in the system.
   */
  optOutSpeaker(callback?: (err: AWSError, data: VoiceID.Types.OptOutSpeakerResponse) => void): Request<VoiceID.Types.OptOutSpeakerResponse, AWSError>;
  /**
   * Starts a new batch fraudster registration job using provided details.
   */
  startFraudsterRegistrationJob(params: VoiceID.Types.StartFraudsterRegistrationJobRequest, callback?: (err: AWSError, data: VoiceID.Types.StartFraudsterRegistrationJobResponse) => void): Request<VoiceID.Types.StartFraudsterRegistrationJobResponse, AWSError>;
  /**
   * Starts a new batch fraudster registration job using provided details.
   */
  startFraudsterRegistrationJob(callback?: (err: AWSError, data: VoiceID.Types.StartFraudsterRegistrationJobResponse) => void): Request<VoiceID.Types.StartFraudsterRegistrationJobResponse, AWSError>;
  /**
   * Starts a new batch speaker enrollment job using specified details.
   */
  startSpeakerEnrollmentJob(params: VoiceID.Types.StartSpeakerEnrollmentJobRequest, callback?: (err: AWSError, data: VoiceID.Types.StartSpeakerEnrollmentJobResponse) => void): Request<VoiceID.Types.StartSpeakerEnrollmentJobResponse, AWSError>;
  /**
   * Starts a new batch speaker enrollment job using specified details.
   */
  startSpeakerEnrollmentJob(callback?: (err: AWSError, data: VoiceID.Types.StartSpeakerEnrollmentJobResponse) => void): Request<VoiceID.Types.StartSpeakerEnrollmentJobResponse, AWSError>;
  /**
   * Tags an Amazon Connect Voice ID resource with the provided list of tags.
   */
  tagResource(params: VoiceID.Types.TagResourceRequest, callback?: (err: AWSError, data: VoiceID.Types.TagResourceResponse) => void): Request<VoiceID.Types.TagResourceResponse, AWSError>;
  /**
   * Tags an Amazon Connect Voice ID resource with the provided list of tags.
   */
  tagResource(callback?: (err: AWSError, data: VoiceID.Types.TagResourceResponse) => void): Request<VoiceID.Types.TagResourceResponse, AWSError>;
  /**
   * Removes specified tags from a specified Amazon Connect Voice ID resource.
   */
  untagResource(params: VoiceID.Types.UntagResourceRequest, callback?: (err: AWSError, data: VoiceID.Types.UntagResourceResponse) => void): Request<VoiceID.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes specified tags from a specified Amazon Connect Voice ID resource.
   */
  untagResource(callback?: (err: AWSError, data: VoiceID.Types.UntagResourceResponse) => void): Request<VoiceID.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified domain. This API has clobber behavior, and clears and replaces all attributes. If an optional field, such as 'Description' is not provided, it is removed from the domain.
   */
  updateDomain(params: VoiceID.Types.UpdateDomainRequest, callback?: (err: AWSError, data: VoiceID.Types.UpdateDomainResponse) => void): Request<VoiceID.Types.UpdateDomainResponse, AWSError>;
  /**
   * Updates the specified domain. This API has clobber behavior, and clears and replaces all attributes. If an optional field, such as 'Description' is not provided, it is removed from the domain.
   */
  updateDomain(callback?: (err: AWSError, data: VoiceID.Types.UpdateDomainResponse) => void): Request<VoiceID.Types.UpdateDomainResponse, AWSError>;
}
declare namespace VoiceID {
  export type AmazonResourceName = string;
  export type Arn = string;
  export interface AuthenticationConfiguration {
    /**
     * The minimum threshold needed to successfully authenticate a speaker.
     */
    AcceptanceThreshold: Score;
  }
  export type AuthenticationDecision = "ACCEPT"|"REJECT"|"NOT_ENOUGH_SPEECH"|"SPEAKER_NOT_ENROLLED"|"SPEAKER_OPTED_OUT"|"SPEAKER_ID_NOT_PROVIDED"|string;
  export interface AuthenticationResult {
    /**
     * A timestamp indicating when audio aggregation ended for this authentication result.
     */
    AudioAggregationEndedAt?: Timestamp;
    /**
     * A timestamp indicating when audio aggregation started for this authentication result.
     */
    AudioAggregationStartedAt?: Timestamp;
    /**
     * The unique identifier for this authentication result. Because there can be multiple authentications for a given session, this field helps to identify if the returned result is from a previous streaming activity or a new result. Note that in absence of any new streaming activity, AcceptanceThreshold changes, or SpeakerId changes, Voice ID always returns cached Authentication Result for this API.
     */
    AuthenticationResultId?: UniqueIdLarge;
    /**
     * The AuthenticationConfiguration used to generate this authentication result.
     */
    Configuration?: AuthenticationConfiguration;
    /**
     * The client-provided identifier for the speaker whose authentication result is produced. Only present if a SpeakerId is provided for the session.
     */
    CustomerSpeakerId?: CustomerSpeakerId;
    /**
     * The authentication decision produced by Voice ID, processed against the current session state and streamed audio of the speaker.
     */
    Decision?: AuthenticationDecision;
    /**
     * The service-generated identifier for the speaker whose authentication result is produced.
     */
    GeneratedSpeakerId?: GeneratedSpeakerId;
    /**
     * The authentication score for the speaker whose authentication result is produced. This value is only present if the authentication decision is either ACCEPT or REJECT.
     */
    Score?: Score;
  }
  export type ClientTokenString = string;
  export interface CreateDomainRequest {
    /**
     * The idempotency token for creating a new domain. If not provided, Amazon Web Services SDK populates this field.
     */
    ClientToken?: ClientTokenString;
    /**
     * A brief description of this domain.
     */
    Description?: Description;
    /**
     * The name of the domain.
     */
    Name: DomainName;
    /**
     * The configuration, containing the KMS Key Identifier, to be used by Voice ID for the server-side encryption of your data. Refer to  Amazon Connect VoiceID encryption at rest for more details on how the KMS Key is used. 
     */
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration;
    /**
     * A list of tags you want added to the domain.
     */
    Tags?: TagList;
  }
  export interface CreateDomainResponse {
    /**
     * Information about the newly created domain.
     */
    Domain?: Domain;
  }
  export type CustomerSpeakerId = string;
  export interface DeleteDomainRequest {
    /**
     * The identifier of the domain you want to delete.
     */
    DomainId: DomainId;
  }
  export interface DeleteFraudsterRequest {
    /**
     * The identifier of the domain containing the fraudster.
     */
    DomainId: DomainId;
    /**
     * The identifier of the fraudster you want to delete.
     */
    FraudsterId: FraudsterId;
  }
  export interface DeleteSpeakerRequest {
    /**
     * The identifier of the domain containing the speaker.
     */
    DomainId: DomainId;
    /**
     * The identifier of the speaker you want to delete.
     */
    SpeakerId: SpeakerId;
  }
  export interface DescribeDomainRequest {
    /**
     * The identifier of the domain you are describing.
     */
    DomainId: DomainId;
  }
  export interface DescribeDomainResponse {
    /**
     * Information about the specified domain.
     */
    Domain?: Domain;
  }
  export interface DescribeFraudsterRegistrationJobRequest {
    /**
     * The identifier for the domain containing the fraudster registration job.
     */
    DomainId: DomainId;
    /**
     * The identifier for the fraudster registration job you are describing.
     */
    JobId: JobId;
  }
  export interface DescribeFraudsterRegistrationJobResponse {
    /**
     * Contains details about the specified fraudster registration job.
     */
    Job?: FraudsterRegistrationJob;
  }
  export interface DescribeFraudsterRequest {
    /**
     * The identifier of the domain containing the fraudster.
     */
    DomainId: DomainId;
    /**
     * The identifier of the fraudster you are describing.
     */
    FraudsterId: FraudsterId;
  }
  export interface DescribeFraudsterResponse {
    /**
     * Information about the specified fraudster.
     */
    Fraudster?: Fraudster;
  }
  export interface DescribeSpeakerEnrollmentJobRequest {
    /**
     * The identifier of the domain containing the speaker enrollment job.
     */
    DomainId: DomainId;
    /**
     * The identifier of the speaker enrollment job you are describing.
     */
    JobId: JobId;
  }
  export interface DescribeSpeakerEnrollmentJobResponse {
    /**
     * Contains details about the specified speaker enrollment job.
     */
    Job?: SpeakerEnrollmentJob;
  }
  export interface DescribeSpeakerRequest {
    /**
     * The identifier of the domain that contains the speaker.
     */
    DomainId: DomainId;
    /**
     * The identifier of the speaker you are describing.
     */
    SpeakerId: SpeakerId;
  }
  export interface DescribeSpeakerResponse {
    /**
     * Information about the specified speaker.
     */
    Speaker?: Speaker;
  }
  export type Description = string;
  export interface Domain {
    /**
     * The Amazon Resource Name (ARN) for the domain.
     */
    Arn?: Arn;
    /**
     * The timestamp at which the domain is created.
     */
    CreatedAt?: Timestamp;
    /**
     * The client-provided description of the domain.
     */
    Description?: Description;
    /**
     * The service-generated identifier for the domain.
     */
    DomainId?: DomainId;
    /**
     * The current status of the domain.
     */
    DomainStatus?: DomainStatus;
    /**
     * The client-provided name for the domain.
     */
    Name?: DomainName;
    /**
     * The server-side encryption configuration containing the KMS Key Identifier you want Voice ID to use to encrypt your data.
     */
    ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * The timestamp showing the domain's last update.
     */
    UpdatedAt?: Timestamp;
  }
  export type DomainId = string;
  export type DomainName = string;
  export type DomainStatus = "ACTIVE"|"PENDING"|"SUSPENDED"|string;
  export type DomainSummaries = DomainSummary[];
  export interface DomainSummary {
    /**
     * The Amazon Resource Name (ARN) for the domain.
     */
    Arn?: Arn;
    /**
     * The timestamp showing when the domain is created.
     */
    CreatedAt?: Timestamp;
    /**
     * The client-provided description of the domain.
     */
    Description?: Description;
    /**
     * The service-generated identifier for the domain.
     */
    DomainId?: DomainId;
    /**
     * The current status of the domain.
     */
    DomainStatus?: DomainStatus;
    /**
     * The client-provided name for the domain.
     */
    Name?: DomainName;
    /**
     * The server-side encryption configuration containing the KMS Key Identifier you want Voice ID to use to encrypt your data..
     */
    ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * The timestamp showing the domain's last update.
     */
    UpdatedAt?: Timestamp;
  }
  export type DuplicateRegistrationAction = "SKIP"|"REGISTER_AS_NEW"|string;
  export interface EnrollmentConfig {
    /**
     *  The action to take when the specified speaker is already enrolled in the specified domain. The default value is SKIP, which skips the enrollment for the existing speaker. Setting the value to OVERWRITE replaces the existing voice prints and enrollment audio stored for that speaker with new data generated from the latest audio.
     */
    ExistingEnrollmentAction?: ExistingEnrollmentAction;
    /**
     * The fraud detection configuration to use for the speaker enrollment job.
     */
    FraudDetectionConfig?: EnrollmentJobFraudDetectionConfig;
  }
  export interface EnrollmentJobFraudDetectionConfig {
    /**
     * The action to take when the given speaker is flagged by the fraud detection system. The default value is FAIL, which fails the speaker enrollment. Changing this value to IGNORE results in the speaker being enrolled even if they are flagged by the fraud detection system.
     */
    FraudDetectionAction?: FraudDetectionAction;
    /**
     * Threshold value for determining whether the speaker is a high risk to be fraudulent. If the detected risk score calculated by Voice ID is greater than or equal to the threshold, the speaker is considered a fraudster.
     */
    RiskThreshold?: Score;
  }
  export interface EvaluateSessionRequest {
    /**
     * The identifier of the domain where the session started.
     */
    DomainId: DomainId;
    /**
     * The session identifier, or name of the session, that you want to evaluate. In Voice ID integration, this is the Contact-Id.
     */
    SessionNameOrId: SessionNameOrId;
  }
  export interface EvaluateSessionResponse {
    /**
     * Details resulting from the authentication process, such as authentication decision and authentication score.
     */
    AuthenticationResult?: AuthenticationResult;
    /**
     * The identifier of the domain containing the session.
     */
    DomainId?: DomainId;
    /**
     * Details resulting from the fraud detection process, such as fraud detection decision and risk score.
     */
    FraudDetectionResult?: FraudDetectionResult;
    /**
     * The service-generated identifier of the session.
     */
    SessionId?: SessionId;
    /**
     * The client-provided name of the session.
     */
    SessionName?: SessionName;
    /**
     * The current status of audio streaming for this session. This field is useful to infer next steps when the Authentication or Fraud Detection results are empty or the decision is NOT_ENOUGH_SPEECH. In this situation, if the StreamingStatus is ONGOING/PENDING_CONFIGURATION, it can mean that the client should call the API again later, once Voice ID has enough audio to produce a result. If the decision remains NOT_ENOUGH_SPEECH even after StreamingStatus is ENDED, it means that the previously streamed session did not have enough speech to perform evaluation, and a new streaming session is needed to try again.
     */
    StreamingStatus?: StreamingStatus;
  }
  export type ExistingEnrollmentAction = "SKIP"|"OVERWRITE"|string;
  export interface FailureDetails {
    /**
     * A description of the error that caused the batch job failure.
     */
    Message?: String;
    /**
     * An HTTP status code representing the nature of the error.
     */
    StatusCode?: Integer;
  }
  export type FraudDetectionAction = "IGNORE"|"FAIL"|string;
  export interface FraudDetectionConfiguration {
    /**
     * Threshold value for determining whether the speaker is a fraudster. If the detected risk score calculated by Voice ID is higher than the threshold, the speaker is considered a fraudster.
     */
    RiskThreshold: Score;
  }
  export type FraudDetectionDecision = "HIGH_RISK"|"LOW_RISK"|"NOT_ENOUGH_SPEECH"|string;
  export type FraudDetectionReason = "KNOWN_FRAUDSTER"|string;
  export type FraudDetectionReasons = FraudDetectionReason[];
  export interface FraudDetectionResult {
    /**
     * A timestamp indicating when audio aggregation ended for this fraud detection result.
     */
    AudioAggregationEndedAt?: Timestamp;
    /**
     * A timestamp indicating when audio aggregation started for this fraud detection result.
     */
    AudioAggregationStartedAt?: Timestamp;
    /**
     * The FraudDetectionConfiguration used to generate this fraud detection result.
     */
    Configuration?: FraudDetectionConfiguration;
    /**
     * The fraud detection decision produced by Voice ID, processed against the current session state and streamed audio of the speaker.
     */
    Decision?: FraudDetectionDecision;
    /**
     * The unique identifier for this fraud detection result. Given there can be multiple fraud detections for a given session, this field helps in identifying if the returned result is from previous streaming activity or a new result. Note that in the absence of any new streaming activity or risk threshold changes, Voice ID always returns cached Fraud Detection result for this API.
     */
    FraudDetectionResultId?: UniqueIdLarge;
    /**
     * The reason speaker was flagged by the fraud detection system. This is only be populated if fraud detection Decision is HIGH_RISK, and only has one possible value: KNOWN_FRAUDSTER.
     */
    Reasons?: FraudDetectionReasons;
    /**
     * Details about each risk analyzed for this speaker.
     */
    RiskDetails?: FraudRiskDetails;
  }
  export interface FraudRiskDetails {
    /**
     * The details resulting from 'Known Fraudster Risk' analysis of the speaker.
     */
    KnownFraudsterRisk: KnownFraudsterRisk;
  }
  export interface Fraudster {
    /**
     * The timestamp when Voice ID identified the fraudster.
     */
    CreatedAt?: Timestamp;
    /**
     * The identifier for the domain containing the fraudster.
     */
    DomainId?: DomainId;
    /**
     * The service-generated identifier for the fraudster.
     */
    GeneratedFraudsterId?: GeneratedFraudsterId;
  }
  export type FraudsterId = string;
  export interface FraudsterRegistrationJob {
    /**
     * A timestamp showing the creation time of the fraudster registration job.
     */
    CreatedAt?: Timestamp;
    /**
     * The IAM role Amazon Resource Name (ARN) that grants Voice ID permissions to access customer's buckets to read the input manifest file and write the job output file.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * The identifier of the domain containing the fraudster registration job.
     */
    DomainId?: DomainId;
    /**
     * A timestamp showing when the fraudster registration job ended.
     */
    EndedAt?: Timestamp;
    /**
     * Contains details that are populated when an entire batch job fails. In cases of individual registration job failures, the batch job as a whole doesn't fail; it is completed with a JobStatus of COMPLETED_WITH_ERRORS. You can use the job output file to identify the individual registration requests that failed.
     */
    FailureDetails?: FailureDetails;
    /**
     * The input data config containing an S3 URI for the input manifest file that contains the list of fraudster registration job requests.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The service-generated identifier for the fraudster registration job.
     */
    JobId?: JobId;
    /**
     * The client-provied name for the fraudster registration job.
     */
    JobName?: JobName;
    /**
     * Shows the completed percentage of registration requests listed in the input file.
     */
    JobProgress?: JobProgress;
    /**
     * The current status of the fraudster registration job.
     */
    JobStatus?: FraudsterRegistrationJobStatus;
    /**
     * The output data config containing the S3 location where you want Voice ID to write your job output file; you must also include a KMS Key ID in order to encrypt the file.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The registration config containing details such as the action to take when a duplicate fraudster is detected, and the similarity threshold to use for detecting a duplicate fraudster.
     */
    RegistrationConfig?: RegistrationConfig;
  }
  export type FraudsterRegistrationJobStatus = "SUBMITTED"|"IN_PROGRESS"|"COMPLETED"|"COMPLETED_WITH_ERRORS"|"FAILED"|string;
  export type FraudsterRegistrationJobSummaries = FraudsterRegistrationJobSummary[];
  export interface FraudsterRegistrationJobSummary {
    /**
     * A timestamp showing when the fraudster registration job is created. 
     */
    CreatedAt?: Timestamp;
    /**
     * The identifier of the domain containing the fraudster registration job.
     */
    DomainId?: DomainId;
    /**
     * A timestamp showing when the fraudster registration job ended.
     */
    EndedAt?: Timestamp;
    /**
     * Contains details that are populated when an entire batch job fails. In cases of individual registration job failures, the batch job as a whole doesn't fail; it is completed with a JobStatus of COMPLETED_WITH_ERRORS. You can use the job output file to identify the individual registration requests that failed.
     */
    FailureDetails?: FailureDetails;
    /**
     * The service-generated identifier for the fraudster registration job.
     */
    JobId?: JobId;
    /**
     * The client-provied name for the fraudster registration job.
     */
    JobName?: JobName;
    /**
     * Shows the completed percentage of registration requests listed in the input file.
     */
    JobProgress?: JobProgress;
    /**
     * The current status of the fraudster registration job.
     */
    JobStatus?: FraudsterRegistrationJobStatus;
  }
  export type GeneratedFraudsterId = string;
  export type GeneratedSpeakerId = string;
  export type IamRoleArn = string;
  export interface InputDataConfig {
    /**
     * The S3 location for the input manifest file that contains the list of individual enrollment or registration job requests.
     */
    S3Uri: S3Uri;
  }
  export type Integer = number;
  export type JobId = string;
  export type JobName = string;
  export interface JobProgress {
    /**
     * Shows the completed percentage of enrollment or registration requests listed in the input file.
     */
    PercentComplete?: Score;
  }
  export type KmsKeyId = string;
  export interface KnownFraudsterRisk {
    /**
     * The identifier of the fraudster that is the closest match to the speaker. If there are no fraudsters registered in a given domain, or if there are no fraudsters with a non-zero RiskScore, this value is null.
     */
    GeneratedFraudsterId?: GeneratedFraudsterId;
    /**
     * The score indicating the likelihood the speaker is a known fraudster.
     */
    RiskScore: Score;
  }
  export interface ListDomainsRequest {
    /**
     * The maximum number of results that are returned per call. You can use NextToken to obtain further pages of results. The default is 100; the maximum allowed page size is also 100. 
     */
    MaxResults?: MaxResultsForListDomainFe;
    /**
     * If NextToken is returned, there are more results available. The value of NextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. 
     */
    NextToken?: NextToken;
  }
  export interface ListDomainsResponse {
    /**
     * A list containing details about each domain in the Amazon Web Services account.
     */
    DomainSummaries?: DomainSummaries;
    /**
     * If NextToken is returned, there are more results available. The value of NextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. 
     */
    NextToken?: String;
  }
  export interface ListFraudsterRegistrationJobsRequest {
    /**
     * The identifier of the domain containing the fraudster registration Jobs.
     */
    DomainId: DomainId;
    /**
     * Provides the status of your fraudster registration job.
     */
    JobStatus?: FraudsterRegistrationJobStatus;
    /**
     * The maximum number of results that are returned per call. You can use NextToken to obtain further pages of results. The default is 100; the maximum allowed page size is also 100. 
     */
    MaxResults?: MaxResultsForList;
    /**
     * If NextToken is returned, there are more results available. The value of NextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. 
     */
    NextToken?: NextToken;
  }
  export interface ListFraudsterRegistrationJobsResponse {
    /**
     * A list containing details about each specified fraudster registration job.
     */
    JobSummaries?: FraudsterRegistrationJobSummaries;
    /**
     * If NextToken is returned, there are more results available. The value of NextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. 
     */
    NextToken?: String;
  }
  export interface ListSpeakerEnrollmentJobsRequest {
    /**
     * The identifier of the domain containing the speaker enrollment jobs.
     */
    DomainId: DomainId;
    /**
     * Provides the status of your speaker enrollment Job.
     */
    JobStatus?: SpeakerEnrollmentJobStatus;
    /**
     * The maximum number of results that are returned per call. You can use NextToken to obtain further pages of results. The default is 100; the maximum allowed page size is also 100. 
     */
    MaxResults?: MaxResultsForList;
    /**
     * If NextToken is returned, there are more results available. The value of NextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. 
     */
    NextToken?: NextToken;
  }
  export interface ListSpeakerEnrollmentJobsResponse {
    /**
     * A list containing details about each specified speaker enrollment job.
     */
    JobSummaries?: SpeakerEnrollmentJobSummaries;
    /**
     * If NextToken is returned, there are more results available. The value of NextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. 
     */
    NextToken?: String;
  }
  export interface ListSpeakersRequest {
    /**
     * The identifier of the domain.
     */
    DomainId: DomainId;
    /**
     * The maximum number of results that are returned per call. You can use NextToken to obtain further pages of results. The default is 100; the maximum allowed page size is also 100. 
     */
    MaxResults?: MaxResultsForList;
    /**
     * If NextToken is returned, there are more results available. The value of NextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. 
     */
    NextToken?: NextToken;
  }
  export interface ListSpeakersResponse {
    /**
     * If NextToken is returned, there are more results available. The value of NextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. 
     */
    NextToken?: String;
    /**
     * A list containing details about each speaker in the Amazon Web Services account. 
     */
    SpeakerSummaries?: SpeakerSummaries;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Voice ID resource for which you want to list the tags.
     */
    ResourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags associated with the specified resource.
     */
    Tags?: TagList;
  }
  export type MaxResultsForList = number;
  export type MaxResultsForListDomainFe = number;
  export type NextToken = string;
  export interface OptOutSpeakerRequest {
    /**
     * The identifier of the domain containing the speaker.
     */
    DomainId: DomainId;
    /**
     * The identifier of the speaker you want opted-out.
     */
    SpeakerId: SpeakerId;
  }
  export interface OptOutSpeakerResponse {
    /**
     * Details about the opted-out speaker.
     */
    Speaker?: Speaker;
  }
  export interface OutputDataConfig {
    /**
     * the identifier of the KMS key you want Voice ID to use to encrypt the output file of the fraudster registration job.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The S3 path of the folder to which Voice ID writes the job output file, which has a *.out extension. For example, if the input file name is input-file.json and the output folder path is s3://output-bucket/output-folder, the full output file path is s3://output-bucket/output-folder/job-Id/input-file.json.out.
     */
    S3Uri: S3Uri;
  }
  export interface RegistrationConfig {
    /**
     * The action to take when a fraudster is identified as a duplicate. The default action is SKIP, which skips registering the duplicate fraudster. Setting the value to REGISTER_AS_NEW always registers a new fraudster into the specified domain.
     */
    DuplicateRegistrationAction?: DuplicateRegistrationAction;
    /**
     * The minimum similarity score between the new and old fraudsters in order to consider the new fraudster a duplicate.
     */
    FraudsterSimilarityThreshold?: Score;
  }
  export type S3Uri = string;
  export type Score = number;
  export interface ServerSideEncryptionConfiguration {
    /**
     * The identifier of the KMS Key you want Voice ID to use to encrypt your data.
     */
    KmsKeyId: KmsKeyId;
  }
  export type SessionId = string;
  export type SessionName = string;
  export type SessionNameOrId = string;
  export interface Speaker {
    /**
     * A timestamp showing when the speaker is created. 
     */
    CreatedAt?: Timestamp;
    /**
     * The client-provided identifier for the speaker.
     */
    CustomerSpeakerId?: CustomerSpeakerId;
    /**
     * The identifier of the domain that contains the speaker.
     */
    DomainId?: DomainId;
    /**
     * The service-generated identifier for the speaker.
     */
    GeneratedSpeakerId?: GeneratedSpeakerId;
    /**
     * The current status of the speaker.
     */
    Status?: SpeakerStatus;
    /**
     * A timestamp showing the speaker's last update.
     */
    UpdatedAt?: Timestamp;
  }
  export interface SpeakerEnrollmentJob {
    /**
     * A timestamp showing the creation of the speaker enrollment job.
     */
    CreatedAt?: Timestamp;
    /**
     * The IAM role Amazon Resource Name (ARN) that grants Voice ID permissions to access customer's buckets to read the input manifest file and write the job output file.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * The identifier of the domain that contains the speaker enrollment job.
     */
    DomainId?: DomainId;
    /**
     * A timestamp showing when the speaker enrollment job ended. 
     */
    EndedAt?: Timestamp;
    /**
     * The configuration that defines the action to take when the speaker is already enrolled in Voice ID, and the FraudDetectionConfig to use.
     */
    EnrollmentConfig?: EnrollmentConfig;
    /**
     * Contains details that are populated when an entire batch job fails. In cases of individual registration job failures, the batch job as a whole doesn't fail; it is completed with a JobStatus of COMPLETED_WITH_ERRORS. You can use the job output file to identify the individual registration requests that failed.
     */
    FailureDetails?: FailureDetails;
    /**
     * The input data config containing an S3 URI for the input manifest file that contains the list of speaker enrollment job requests.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The service-generated identifier for the speaker enrollment job.
     */
    JobId?: JobId;
    /**
     * The client-provided name for the speaker enrollment job.
     */
    JobName?: JobName;
    /**
     * Provides details on job progress. This field shows the completed percentage of registration requests listed in the input file.
     */
    JobProgress?: JobProgress;
    /**
     * The current status of the speaker enrollment job.
     */
    JobStatus?: SpeakerEnrollmentJobStatus;
    /**
     * The output data config containing the S3 location where Voice ID writes the job output file; you must also include a KMS Key ID to encrypt the file.
     */
    OutputDataConfig?: OutputDataConfig;
  }
  export type SpeakerEnrollmentJobStatus = "SUBMITTED"|"IN_PROGRESS"|"COMPLETED"|"COMPLETED_WITH_ERRORS"|"FAILED"|string;
  export type SpeakerEnrollmentJobSummaries = SpeakerEnrollmentJobSummary[];
  export interface SpeakerEnrollmentJobSummary {
    /**
     * A timestamp showing the creation time of the speaker enrollment job.
     */
    CreatedAt?: Timestamp;
    /**
     * The identifier of the domain that contains the speaker enrollment job.
     */
    DomainId?: DomainId;
    /**
     * A timestamp showing when the speaker enrollment job ended.
     */
    EndedAt?: Timestamp;
    /**
     * Contains details that are populated when an entire batch job fails. In cases of individual registration job failures, the batch job as a whole doesn't fail; it is completed with a JobStatus of COMPLETED_WITH_ERRORS. You can use the job output file to identify the individual registration requests that failed.
     */
    FailureDetails?: FailureDetails;
    /**
     * The service-generated identifier for the speaker enrollment job.
     */
    JobId?: JobId;
    /**
     * The client-provided name for the speaker enrollment job.
     */
    JobName?: JobName;
    /**
     * Provides details regarding job progress. This field shows the completed percentage of enrollment requests listed in the input file.
     */
    JobProgress?: JobProgress;
    /**
     * The current status of the speaker enrollment job.
     */
    JobStatus?: SpeakerEnrollmentJobStatus;
  }
  export type SpeakerId = string;
  export type SpeakerStatus = "ENROLLED"|"EXPIRED"|"OPTED_OUT"|"PENDING"|string;
  export type SpeakerSummaries = SpeakerSummary[];
  export interface SpeakerSummary {
    /**
     * A timestamp showing the speaker's creation time. 
     */
    CreatedAt?: Timestamp;
    /**
     * The client-provided identifier for the speaker.
     */
    CustomerSpeakerId?: CustomerSpeakerId;
    /**
     * The identifier of the domain that contains the speaker.
     */
    DomainId?: DomainId;
    /**
     * The service-generated identifier for the speaker. 
     */
    GeneratedSpeakerId?: GeneratedSpeakerId;
    /**
     * The current status of the speaker.
     */
    Status?: SpeakerStatus;
    /**
     * A timestamp showing the speaker's last update.
     */
    UpdatedAt?: Timestamp;
  }
  export interface StartFraudsterRegistrationJobRequest {
    /**
     * The idempotency token for starting a new fraudster registration job. If not provided, Amazon Web Services SDK populates this field.
     */
    ClientToken?: ClientTokenString;
    /**
     * The IAM role Amazon Resource Name (ARN) that grants Voice ID permissions to access customer's buckets to read the input manifest file and write the Job output file. Refer to the Create and edit a fraudster watchlist documentation for the permissions needed in this role.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the domain containing the fraudster registration job and in which the fraudsters are registered.
     */
    DomainId: DomainId;
    /**
     * The input data config containing an S3 URI for the input manifest file that contains the list of fraudster registration requests.
     */
    InputDataConfig: InputDataConfig;
    /**
     * The name of the new fraudster registration job.
     */
    JobName?: JobName;
    /**
     * The output data config containing the S3 location where Voice ID writes the job output file; you must also include a KMS Key ID to encrypt the file.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The registration config containing details such as the action to take when a duplicate fraudster is detected, and the similarity threshold to use for detecting a duplicate fraudster.
     */
    RegistrationConfig?: RegistrationConfig;
  }
  export interface StartFraudsterRegistrationJobResponse {
    /**
     * Details about the started fraudster registration job.
     */
    Job?: FraudsterRegistrationJob;
  }
  export interface StartSpeakerEnrollmentJobRequest {
    /**
     * The idempotency token for starting a new speaker enrollment Job. If not provided, Amazon Web Services SDK populates this field.
     */
    ClientToken?: ClientTokenString;
    /**
     * The IAM role Amazon Resource Name (ARN) that grants Voice ID permissions to access customer's buckets to read the input manifest file and write the job output file. Refer to Batch enrollment using audio data from prior calls documentation for the permissions needed in this role.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the domain that contains the speaker enrollment job and in which the speakers are enrolled. 
     */
    DomainId: DomainId;
    /**
     * The enrollment config that contains details such as the action to take when a speaker is already enrolled in the Voice ID system or when a speaker is identified as a fraudster.
     */
    EnrollmentConfig?: EnrollmentConfig;
    /**
     * The input data config containing the S3 location for the input manifest file that contains the list of speaker enrollment requests.
     */
    InputDataConfig: InputDataConfig;
    /**
     * A name for your speaker enrollment job.
     */
    JobName?: JobName;
    /**
     * The output data config containing the S3 location where Voice ID writes the job output file; you must also include a KMS Key ID to encrypt the file.
     */
    OutputDataConfig: OutputDataConfig;
  }
  export interface StartSpeakerEnrollmentJobResponse {
    /**
     * Details about the started speaker enrollment job.
     */
    Job?: SpeakerEnrollmentJob;
  }
  export type StreamingStatus = "PENDING_CONFIGURATION"|"ONGOING"|"ENDED"|string;
  export type String = string;
  export interface Tag {
    /**
     * The first part of a key:value pair that forms a tag associated with a given resource. For example, in the tag ‘Department’:’Sales’, the key is 'Department'. 
     */
    Key: TagKey;
    /**
     * The second part of a key:value pair that forms a tag associated with a given resource. For example, in the tag ‘Department’:’Sales’, the value is 'Sales'. 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Voice ID resource you want to tag.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The list of tags to assign to the specified resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type UniqueIdLarge = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Voice ID resource you want to remove tags from.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The list of tag keys you want to remove from the specified resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDomainRequest {
    /**
     * A brief description about this domain.
     */
    Description?: Description;
    /**
     * The identifier of the domain to be updated.
     */
    DomainId: DomainId;
    /**
     * The name of the domain.
     */
    Name: DomainName;
    /**
     * The configuration, containing the KMS Key Identifier, to be used by Voice ID for the server-side encryption of your data. Note that all the existing data in the domain are still encrypted using the existing key, only the data added to domain after updating the key is encrypted using the new key. 
     */
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration;
  }
  export interface UpdateDomainResponse {
    /**
     * Details about the updated domain
     */
    Domain?: Domain;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-09-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the VoiceID client.
   */
  export import Types = VoiceID;
}
export = VoiceID;
