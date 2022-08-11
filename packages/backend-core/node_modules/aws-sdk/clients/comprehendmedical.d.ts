import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ComprehendMedical extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ComprehendMedical.Types.ClientConfiguration)
  config: Config & ComprehendMedical.Types.ClientConfiguration;
  /**
   * Gets the properties associated with a medical entities detection job. Use this operation to get the status of a detection job.
   */
  describeEntitiesDetectionV2Job(params: ComprehendMedical.Types.DescribeEntitiesDetectionV2JobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.DescribeEntitiesDetectionV2JobResponse) => void): Request<ComprehendMedical.Types.DescribeEntitiesDetectionV2JobResponse, AWSError>;
  /**
   * Gets the properties associated with a medical entities detection job. Use this operation to get the status of a detection job.
   */
  describeEntitiesDetectionV2Job(callback?: (err: AWSError, data: ComprehendMedical.Types.DescribeEntitiesDetectionV2JobResponse) => void): Request<ComprehendMedical.Types.DescribeEntitiesDetectionV2JobResponse, AWSError>;
  /**
   * Gets the properties associated with an InferICD10CM job. Use this operation to get the status of an inference job.
   */
  describeICD10CMInferenceJob(params: ComprehendMedical.Types.DescribeICD10CMInferenceJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.DescribeICD10CMInferenceJobResponse) => void): Request<ComprehendMedical.Types.DescribeICD10CMInferenceJobResponse, AWSError>;
  /**
   * Gets the properties associated with an InferICD10CM job. Use this operation to get the status of an inference job.
   */
  describeICD10CMInferenceJob(callback?: (err: AWSError, data: ComprehendMedical.Types.DescribeICD10CMInferenceJobResponse) => void): Request<ComprehendMedical.Types.DescribeICD10CMInferenceJobResponse, AWSError>;
  /**
   * Gets the properties associated with a protected health information (PHI) detection job. Use this operation to get the status of a detection job.
   */
  describePHIDetectionJob(params: ComprehendMedical.Types.DescribePHIDetectionJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.DescribePHIDetectionJobResponse) => void): Request<ComprehendMedical.Types.DescribePHIDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a protected health information (PHI) detection job. Use this operation to get the status of a detection job.
   */
  describePHIDetectionJob(callback?: (err: AWSError, data: ComprehendMedical.Types.DescribePHIDetectionJobResponse) => void): Request<ComprehendMedical.Types.DescribePHIDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with an InferRxNorm job. Use this operation to get the status of an inference job.
   */
  describeRxNormInferenceJob(params: ComprehendMedical.Types.DescribeRxNormInferenceJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.DescribeRxNormInferenceJobResponse) => void): Request<ComprehendMedical.Types.DescribeRxNormInferenceJobResponse, AWSError>;
  /**
   * Gets the properties associated with an InferRxNorm job. Use this operation to get the status of an inference job.
   */
  describeRxNormInferenceJob(callback?: (err: AWSError, data: ComprehendMedical.Types.DescribeRxNormInferenceJobResponse) => void): Request<ComprehendMedical.Types.DescribeRxNormInferenceJobResponse, AWSError>;
  /**
   * The DetectEntities operation is deprecated. You should use the DetectEntitiesV2 operation instead.  Inspects the clinical text for a variety of medical entities and returns specific information about them such as entity category, location, and confidence score on that information .
   */
  detectEntities(params: ComprehendMedical.Types.DetectEntitiesRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.DetectEntitiesResponse) => void): Request<ComprehendMedical.Types.DetectEntitiesResponse, AWSError>;
  /**
   * The DetectEntities operation is deprecated. You should use the DetectEntitiesV2 operation instead.  Inspects the clinical text for a variety of medical entities and returns specific information about them such as entity category, location, and confidence score on that information .
   */
  detectEntities(callback?: (err: AWSError, data: ComprehendMedical.Types.DetectEntitiesResponse) => void): Request<ComprehendMedical.Types.DetectEntitiesResponse, AWSError>;
  /**
   * Inspects the clinical text for a variety of medical entities and returns specific information about them such as entity category, location, and confidence score on that information. Amazon Comprehend Medical only detects medical entities in English language texts. The DetectEntitiesV2 operation replaces the DetectEntities operation. This new action uses a different model for determining the entities in your medical text and changes the way that some entities are returned in the output. You should use the DetectEntitiesV2 operation in all new applications. The DetectEntitiesV2 operation returns the Acuity and Direction entities as attributes instead of types. 
   */
  detectEntitiesV2(params: ComprehendMedical.Types.DetectEntitiesV2Request, callback?: (err: AWSError, data: ComprehendMedical.Types.DetectEntitiesV2Response) => void): Request<ComprehendMedical.Types.DetectEntitiesV2Response, AWSError>;
  /**
   * Inspects the clinical text for a variety of medical entities and returns specific information about them such as entity category, location, and confidence score on that information. Amazon Comprehend Medical only detects medical entities in English language texts. The DetectEntitiesV2 operation replaces the DetectEntities operation. This new action uses a different model for determining the entities in your medical text and changes the way that some entities are returned in the output. You should use the DetectEntitiesV2 operation in all new applications. The DetectEntitiesV2 operation returns the Acuity and Direction entities as attributes instead of types. 
   */
  detectEntitiesV2(callback?: (err: AWSError, data: ComprehendMedical.Types.DetectEntitiesV2Response) => void): Request<ComprehendMedical.Types.DetectEntitiesV2Response, AWSError>;
  /**
   *  Inspects the clinical text for protected health information (PHI) entities and returns the entity category, location, and confidence score for each entity. Amazon Comprehend Medical only detects entities in English language texts.
   */
  detectPHI(params: ComprehendMedical.Types.DetectPHIRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.DetectPHIResponse) => void): Request<ComprehendMedical.Types.DetectPHIResponse, AWSError>;
  /**
   *  Inspects the clinical text for protected health information (PHI) entities and returns the entity category, location, and confidence score for each entity. Amazon Comprehend Medical only detects entities in English language texts.
   */
  detectPHI(callback?: (err: AWSError, data: ComprehendMedical.Types.DetectPHIResponse) => void): Request<ComprehendMedical.Types.DetectPHIResponse, AWSError>;
  /**
   * InferICD10CM detects medical conditions as entities listed in a patient record and links those entities to normalized concept identifiers in the ICD-10-CM knowledge base from the Centers for Disease Control. Amazon Comprehend Medical only detects medical entities in English language texts. 
   */
  inferICD10CM(params: ComprehendMedical.Types.InferICD10CMRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.InferICD10CMResponse) => void): Request<ComprehendMedical.Types.InferICD10CMResponse, AWSError>;
  /**
   * InferICD10CM detects medical conditions as entities listed in a patient record and links those entities to normalized concept identifiers in the ICD-10-CM knowledge base from the Centers for Disease Control. Amazon Comprehend Medical only detects medical entities in English language texts. 
   */
  inferICD10CM(callback?: (err: AWSError, data: ComprehendMedical.Types.InferICD10CMResponse) => void): Request<ComprehendMedical.Types.InferICD10CMResponse, AWSError>;
  /**
   * InferRxNorm detects medications as entities listed in a patient record and links to the normalized concept identifiers in the RxNorm database from the National Library of Medicine. Amazon Comprehend Medical only detects medical entities in English language texts. 
   */
  inferRxNorm(params: ComprehendMedical.Types.InferRxNormRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.InferRxNormResponse) => void): Request<ComprehendMedical.Types.InferRxNormResponse, AWSError>;
  /**
   * InferRxNorm detects medications as entities listed in a patient record and links to the normalized concept identifiers in the RxNorm database from the National Library of Medicine. Amazon Comprehend Medical only detects medical entities in English language texts. 
   */
  inferRxNorm(callback?: (err: AWSError, data: ComprehendMedical.Types.InferRxNormResponse) => void): Request<ComprehendMedical.Types.InferRxNormResponse, AWSError>;
  /**
   * Gets a list of medical entity detection jobs that you have submitted.
   */
  listEntitiesDetectionV2Jobs(params: ComprehendMedical.Types.ListEntitiesDetectionV2JobsRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.ListEntitiesDetectionV2JobsResponse) => void): Request<ComprehendMedical.Types.ListEntitiesDetectionV2JobsResponse, AWSError>;
  /**
   * Gets a list of medical entity detection jobs that you have submitted.
   */
  listEntitiesDetectionV2Jobs(callback?: (err: AWSError, data: ComprehendMedical.Types.ListEntitiesDetectionV2JobsResponse) => void): Request<ComprehendMedical.Types.ListEntitiesDetectionV2JobsResponse, AWSError>;
  /**
   * Gets a list of InferICD10CM jobs that you have submitted.
   */
  listICD10CMInferenceJobs(params: ComprehendMedical.Types.ListICD10CMInferenceJobsRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.ListICD10CMInferenceJobsResponse) => void): Request<ComprehendMedical.Types.ListICD10CMInferenceJobsResponse, AWSError>;
  /**
   * Gets a list of InferICD10CM jobs that you have submitted.
   */
  listICD10CMInferenceJobs(callback?: (err: AWSError, data: ComprehendMedical.Types.ListICD10CMInferenceJobsResponse) => void): Request<ComprehendMedical.Types.ListICD10CMInferenceJobsResponse, AWSError>;
  /**
   * Gets a list of protected health information (PHI) detection jobs that you have submitted.
   */
  listPHIDetectionJobs(params: ComprehendMedical.Types.ListPHIDetectionJobsRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.ListPHIDetectionJobsResponse) => void): Request<ComprehendMedical.Types.ListPHIDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of protected health information (PHI) detection jobs that you have submitted.
   */
  listPHIDetectionJobs(callback?: (err: AWSError, data: ComprehendMedical.Types.ListPHIDetectionJobsResponse) => void): Request<ComprehendMedical.Types.ListPHIDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of InferRxNorm jobs that you have submitted.
   */
  listRxNormInferenceJobs(params: ComprehendMedical.Types.ListRxNormInferenceJobsRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.ListRxNormInferenceJobsResponse) => void): Request<ComprehendMedical.Types.ListRxNormInferenceJobsResponse, AWSError>;
  /**
   * Gets a list of InferRxNorm jobs that you have submitted.
   */
  listRxNormInferenceJobs(callback?: (err: AWSError, data: ComprehendMedical.Types.ListRxNormInferenceJobsResponse) => void): Request<ComprehendMedical.Types.ListRxNormInferenceJobsResponse, AWSError>;
  /**
   * Starts an asynchronous medical entity detection job for a collection of documents. Use the DescribeEntitiesDetectionV2Job operation to track the status of a job.
   */
  startEntitiesDetectionV2Job(params: ComprehendMedical.Types.StartEntitiesDetectionV2JobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.StartEntitiesDetectionV2JobResponse) => void): Request<ComprehendMedical.Types.StartEntitiesDetectionV2JobResponse, AWSError>;
  /**
   * Starts an asynchronous medical entity detection job for a collection of documents. Use the DescribeEntitiesDetectionV2Job operation to track the status of a job.
   */
  startEntitiesDetectionV2Job(callback?: (err: AWSError, data: ComprehendMedical.Types.StartEntitiesDetectionV2JobResponse) => void): Request<ComprehendMedical.Types.StartEntitiesDetectionV2JobResponse, AWSError>;
  /**
   * Starts an asynchronous job to detect medical conditions and link them to the ICD-10-CM ontology. Use the DescribeICD10CMInferenceJob operation to track the status of a job.
   */
  startICD10CMInferenceJob(params: ComprehendMedical.Types.StartICD10CMInferenceJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.StartICD10CMInferenceJobResponse) => void): Request<ComprehendMedical.Types.StartICD10CMInferenceJobResponse, AWSError>;
  /**
   * Starts an asynchronous job to detect medical conditions and link them to the ICD-10-CM ontology. Use the DescribeICD10CMInferenceJob operation to track the status of a job.
   */
  startICD10CMInferenceJob(callback?: (err: AWSError, data: ComprehendMedical.Types.StartICD10CMInferenceJobResponse) => void): Request<ComprehendMedical.Types.StartICD10CMInferenceJobResponse, AWSError>;
  /**
   * Starts an asynchronous job to detect protected health information (PHI). Use the DescribePHIDetectionJob operation to track the status of a job.
   */
  startPHIDetectionJob(params: ComprehendMedical.Types.StartPHIDetectionJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.StartPHIDetectionJobResponse) => void): Request<ComprehendMedical.Types.StartPHIDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous job to detect protected health information (PHI). Use the DescribePHIDetectionJob operation to track the status of a job.
   */
  startPHIDetectionJob(callback?: (err: AWSError, data: ComprehendMedical.Types.StartPHIDetectionJobResponse) => void): Request<ComprehendMedical.Types.StartPHIDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous job to detect medication entities and link them to the RxNorm ontology. Use the DescribeRxNormInferenceJob operation to track the status of a job.
   */
  startRxNormInferenceJob(params: ComprehendMedical.Types.StartRxNormInferenceJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.StartRxNormInferenceJobResponse) => void): Request<ComprehendMedical.Types.StartRxNormInferenceJobResponse, AWSError>;
  /**
   * Starts an asynchronous job to detect medication entities and link them to the RxNorm ontology. Use the DescribeRxNormInferenceJob operation to track the status of a job.
   */
  startRxNormInferenceJob(callback?: (err: AWSError, data: ComprehendMedical.Types.StartRxNormInferenceJobResponse) => void): Request<ComprehendMedical.Types.StartRxNormInferenceJobResponse, AWSError>;
  /**
   * Stops a medical entities detection job in progress.
   */
  stopEntitiesDetectionV2Job(params: ComprehendMedical.Types.StopEntitiesDetectionV2JobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.StopEntitiesDetectionV2JobResponse) => void): Request<ComprehendMedical.Types.StopEntitiesDetectionV2JobResponse, AWSError>;
  /**
   * Stops a medical entities detection job in progress.
   */
  stopEntitiesDetectionV2Job(callback?: (err: AWSError, data: ComprehendMedical.Types.StopEntitiesDetectionV2JobResponse) => void): Request<ComprehendMedical.Types.StopEntitiesDetectionV2JobResponse, AWSError>;
  /**
   * Stops an InferICD10CM inference job in progress.
   */
  stopICD10CMInferenceJob(params: ComprehendMedical.Types.StopICD10CMInferenceJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.StopICD10CMInferenceJobResponse) => void): Request<ComprehendMedical.Types.StopICD10CMInferenceJobResponse, AWSError>;
  /**
   * Stops an InferICD10CM inference job in progress.
   */
  stopICD10CMInferenceJob(callback?: (err: AWSError, data: ComprehendMedical.Types.StopICD10CMInferenceJobResponse) => void): Request<ComprehendMedical.Types.StopICD10CMInferenceJobResponse, AWSError>;
  /**
   * Stops a protected health information (PHI) detection job in progress.
   */
  stopPHIDetectionJob(params: ComprehendMedical.Types.StopPHIDetectionJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.StopPHIDetectionJobResponse) => void): Request<ComprehendMedical.Types.StopPHIDetectionJobResponse, AWSError>;
  /**
   * Stops a protected health information (PHI) detection job in progress.
   */
  stopPHIDetectionJob(callback?: (err: AWSError, data: ComprehendMedical.Types.StopPHIDetectionJobResponse) => void): Request<ComprehendMedical.Types.StopPHIDetectionJobResponse, AWSError>;
  /**
   * Stops an InferRxNorm inference job in progress.
   */
  stopRxNormInferenceJob(params: ComprehendMedical.Types.StopRxNormInferenceJobRequest, callback?: (err: AWSError, data: ComprehendMedical.Types.StopRxNormInferenceJobResponse) => void): Request<ComprehendMedical.Types.StopRxNormInferenceJobResponse, AWSError>;
  /**
   * Stops an InferRxNorm inference job in progress.
   */
  stopRxNormInferenceJob(callback?: (err: AWSError, data: ComprehendMedical.Types.StopRxNormInferenceJobResponse) => void): Request<ComprehendMedical.Types.StopRxNormInferenceJobResponse, AWSError>;
}
declare namespace ComprehendMedical {
  export type AnyLengthString = string;
  export interface Attribute {
    /**
     *  The type of attribute. 
     */
    Type?: EntitySubType;
    /**
     *  The level of confidence that Amazon Comprehend Medical has that the segment of text is correctly recognized as an attribute. 
     */
    Score?: Float;
    /**
     *  The level of confidence that Amazon Comprehend Medical has that this attribute is correctly related to this entity. 
     */
    RelationshipScore?: Float;
    /**
     * The type of relationship between the entity and attribute. Type for the relationship is OVERLAP, indicating that the entity occurred at the same time as the Date_Expression. 
     */
    RelationshipType?: RelationshipType;
    /**
     *  The numeric identifier for this attribute. This is a monotonically increasing id unique within this response rather than a global unique identifier. 
     */
    Id?: Integer;
    /**
     *  The 0-based character offset in the input text that shows where the attribute begins. The offset returns the UTF-8 code point in the string. 
     */
    BeginOffset?: Integer;
    /**
     *  The 0-based character offset in the input text that shows where the attribute ends. The offset returns the UTF-8 code point in the string.
     */
    EndOffset?: Integer;
    /**
     *  The segment of input text extracted as this attribute.
     */
    Text?: String;
    /**
     *  The category of attribute. 
     */
    Category?: EntityType;
    /**
     *  Contextual information for this attribute. 
     */
    Traits?: TraitList;
  }
  export type AttributeList = Attribute[];
  export type AttributeName = "SIGN"|"SYMPTOM"|"DIAGNOSIS"|"NEGATION"|string;
  export type BoundedLengthString = string;
  export type ClientRequestTokenString = string;
  export interface ComprehendMedicalAsyncJobFilter {
    /**
     * Filters on the name of the job.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface ComprehendMedicalAsyncJobProperties {
    /**
     * The identifier assigned to the detection job.
     */
    JobId?: JobId;
    /**
     * The name that you assigned to the detection job.
     */
    JobName?: JobName;
    /**
     * The current status of the detection job. If the status is FAILED, the Message field shows the reason for the failure.
     */
    JobStatus?: JobStatus;
    /**
     * A description of the status of a job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the detection job completed.
     */
    EndTime?: Timestamp;
    /**
     * The date and time that job metadata is deleted from the server. Output files in your S3 bucket will not be deleted. After the metadata is deleted, the job will no longer appear in the results of the ListEntitiesDetectionV2Job or the ListPHIDetectionJobs operation.
     */
    ExpirationTime?: Timestamp;
    /**
     * The input data configuration that you supplied when you created the detection job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration that you supplied when you created the detection job.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The language code of the input documents.
     */
    LanguageCode?: LanguageCode;
    /**
     * The Amazon Resource Name (ARN) that gives Amazon Comprehend Medical read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * The path to the file that describes the results of a batch job.
     */
    ManifestFilePath?: ManifestFilePath;
    /**
     * The AWS Key Management Service key, if any, used to encrypt the output files. 
     */
    KMSKey?: KMSKey;
    /**
     * The version of the model used to analyze the documents. The version number looks like X.X.X. You can use this information to track the model used for a particular batch of documents.
     */
    ModelVersion?: ModelVersion;
  }
  export type ComprehendMedicalAsyncJobPropertiesList = ComprehendMedicalAsyncJobProperties[];
  export interface DescribeEntitiesDetectionV2JobRequest {
    /**
     * The identifier that Amazon Comprehend Medical generated for the job. The StartEntitiesDetectionV2Job operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeEntitiesDetectionV2JobResponse {
    /**
     * An object that contains the properties associated with a detection job.
     */
    ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
  }
  export interface DescribeICD10CMInferenceJobRequest {
    /**
     * The identifier that Amazon Comprehend Medical generated for the job. The StartICD10CMInferenceJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeICD10CMInferenceJobResponse {
    /**
     * An object that contains the properties associated with a detection job.
     */
    ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
  }
  export interface DescribePHIDetectionJobRequest {
    /**
     * The identifier that Amazon Comprehend Medical generated for the job. The StartPHIDetectionJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribePHIDetectionJobResponse {
    /**
     * An object that contains the properties associated with a detection job.
     */
    ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
  }
  export interface DescribeRxNormInferenceJobRequest {
    /**
     * The identifier that Amazon Comprehend Medical generated for the job. The StartRxNormInferenceJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeRxNormInferenceJobResponse {
    /**
     * An object that contains the properties associated with a detection job.
     */
    ComprehendMedicalAsyncJobProperties?: ComprehendMedicalAsyncJobProperties;
  }
  export interface DetectEntitiesRequest {
    /**
     *  A UTF-8 text string containing the clinical content being examined for entities. Each string must contain fewer than 20,000 bytes of characters.
     */
    Text: BoundedLengthString;
  }
  export interface DetectEntitiesResponse {
    /**
     *  The collection of medical entities extracted from the input text and their associated information. For each entity, the response provides the entity text, the entity category, where the entity text begins and ends, and the level of confidence that Amazon Comprehend Medical has in the detection and analysis. Attributes and traits of the entity are also returned.
     */
    Entities: EntityList;
    /**
     *  Attributes extracted from the input text that we were unable to relate to an entity.
     */
    UnmappedAttributes?: UnmappedAttributeList;
    /**
     *  If the result of the previous request to DetectEntities was truncated, include the PaginationToken to fetch the next page of entities.
     */
    PaginationToken?: String;
    /**
     * The version of the model used to analyze the documents. The version number looks like X.X.X. You can use this information to track the model used for a particular batch of documents.
     */
    ModelVersion: String;
  }
  export interface DetectEntitiesV2Request {
    /**
     * A UTF-8 string containing the clinical content being examined for entities. Each string must contain fewer than 20,000 bytes of characters.
     */
    Text: BoundedLengthString;
  }
  export interface DetectEntitiesV2Response {
    /**
     * The collection of medical entities extracted from the input text and their associated information. For each entity, the response provides the entity text, the entity category, where the entity text begins and ends, and the level of confidence in the detection and analysis. Attributes and traits of the entity are also returned.
     */
    Entities: EntityList;
    /**
     * Attributes extracted from the input text that couldn't be related to an entity.
     */
    UnmappedAttributes?: UnmappedAttributeList;
    /**
     * If the result to the DetectEntitiesV2 operation was truncated, include the PaginationToken to fetch the next page of entities.
     */
    PaginationToken?: String;
    /**
     * The version of the model used to analyze the documents. The version number looks like X.X.X. You can use this information to track the model used for a particular batch of documents.
     */
    ModelVersion: String;
  }
  export interface DetectPHIRequest {
    /**
     *  A UTF-8 text string containing the clinical content being examined for PHI entities. Each string must contain fewer than 20,000 bytes of characters.
     */
    Text: BoundedLengthString;
  }
  export interface DetectPHIResponse {
    /**
     *  The collection of PHI entities extracted from the input text and their associated information. For each entity, the response provides the entity text, the entity category, where the entity text begins and ends, and the level of confidence that Amazon Comprehend Medical has in its detection. 
     */
    Entities: EntityList;
    /**
     *  If the result of the previous request to DetectPHI was truncated, include the PaginationToken to fetch the next page of PHI entities. 
     */
    PaginationToken?: String;
    /**
     * The version of the model used to analyze the documents. The version number looks like X.X.X. You can use this information to track the model used for a particular batch of documents.
     */
    ModelVersion: String;
  }
  export interface Entity {
    /**
     *  The numeric identifier for the entity. This is a monotonically increasing id unique within this response rather than a global unique identifier. 
     */
    Id?: Integer;
    /**
     *  The 0-based character offset in the input text that shows where the entity begins. The offset returns the UTF-8 code point in the string. 
     */
    BeginOffset?: Integer;
    /**
     *  The 0-based character offset in the input text that shows where the entity ends. The offset returns the UTF-8 code point in the string. 
     */
    EndOffset?: Integer;
    /**
     * The level of confidence that Amazon Comprehend Medical has in the accuracy of the detection.
     */
    Score?: Float;
    /**
     *  The segment of input text extracted as this entity.
     */
    Text?: String;
    /**
     *  The category of the entity.
     */
    Category?: EntityType;
    /**
     *  Describes the specific type of entity with category of entities.
     */
    Type?: EntitySubType;
    /**
     * Contextual information for the entity.
     */
    Traits?: TraitList;
    /**
     *  The extracted attributes that relate to this entity.
     */
    Attributes?: AttributeList;
  }
  export type EntityList = Entity[];
  export type EntitySubType = "NAME"|"DOSAGE"|"ROUTE_OR_MODE"|"FORM"|"FREQUENCY"|"DURATION"|"GENERIC_NAME"|"BRAND_NAME"|"STRENGTH"|"RATE"|"ACUITY"|"TEST_NAME"|"TEST_VALUE"|"TEST_UNITS"|"PROCEDURE_NAME"|"TREATMENT_NAME"|"DATE"|"AGE"|"CONTACT_POINT"|"EMAIL"|"IDENTIFIER"|"URL"|"ADDRESS"|"PROFESSION"|"SYSTEM_ORGAN_SITE"|"DIRECTION"|"QUALITY"|"QUANTITY"|"TIME_EXPRESSION"|"TIME_TO_MEDICATION_NAME"|"TIME_TO_DX_NAME"|"TIME_TO_TEST_NAME"|"TIME_TO_PROCEDURE_NAME"|"TIME_TO_TREATMENT_NAME"|string;
  export type EntityType = "MEDICATION"|"MEDICAL_CONDITION"|"PROTECTED_HEALTH_INFORMATION"|"TEST_TREATMENT_PROCEDURE"|"ANATOMY"|"TIME_EXPRESSION"|string;
  export type Float = number;
  export interface ICD10CMAttribute {
    /**
     * The type of attribute. InferICD10CM detects entities of the type DX_NAME. 
     */
    Type?: ICD10CMAttributeType;
    /**
     * The level of confidence that Amazon Comprehend Medical has that the segment of text is correctly recognized as an attribute.
     */
    Score?: Float;
    /**
     * The level of confidence that Amazon Comprehend Medical has that this attribute is correctly related to this entity.
     */
    RelationshipScore?: Float;
    /**
     * The numeric identifier for this attribute. This is a monotonically increasing id unique within this response rather than a global unique identifier.
     */
    Id?: Integer;
    /**
     * The 0-based character offset in the input text that shows where the attribute begins. The offset returns the UTF-8 code point in the string.
     */
    BeginOffset?: Integer;
    /**
     * The 0-based character offset in the input text that shows where the attribute ends. The offset returns the UTF-8 code point in the string.
     */
    EndOffset?: Integer;
    /**
     * The segment of input text which contains the detected attribute.
     */
    Text?: String;
    /**
     * The contextual information for the attribute. The traits recognized by InferICD10CM are DIAGNOSIS, SIGN, SYMPTOM, and NEGATION.
     */
    Traits?: ICD10CMTraitList;
    /**
     * The category of attribute. Can be either of DX_NAME or TIME_EXPRESSION.
     */
    Category?: ICD10CMEntityType;
    /**
     * The type of relationship between the entity and attribute. Type for the relationship can be either of OVERLAP or SYSTEM_ORGAN_SITE.
     */
    RelationshipType?: ICD10CMRelationshipType;
  }
  export type ICD10CMAttributeList = ICD10CMAttribute[];
  export type ICD10CMAttributeType = "ACUITY"|"DIRECTION"|"SYSTEM_ORGAN_SITE"|"QUALITY"|"QUANTITY"|"TIME_TO_DX_NAME"|"TIME_EXPRESSION"|string;
  export interface ICD10CMConcept {
    /**
     * The long description of the ICD-10-CM code in the ontology.
     */
    Description?: String;
    /**
     * The ICD-10-CM code that identifies the concept found in the knowledge base from the Centers for Disease Control.
     */
    Code?: String;
    /**
     * The level of confidence that Amazon Comprehend Medical has that the entity is accurately linked to an ICD-10-CM concept.
     */
    Score?: Float;
  }
  export type ICD10CMConceptList = ICD10CMConcept[];
  export interface ICD10CMEntity {
    /**
     * The numeric identifier for the entity. This is a monotonically increasing id unique within this response rather than a global unique identifier.
     */
    Id?: Integer;
    /**
     * The segment of input text that is matched to the detected entity.
     */
    Text?: OntologyLinkingBoundedLengthString;
    /**
     *  The category of the entity. InferICD10CM detects entities in the MEDICAL_CONDITION category. 
     */
    Category?: ICD10CMEntityCategory;
    /**
     * Describes the specific type of entity with category of entities. InferICD10CM detects entities of the type DX_NAME and TIME_EXPRESSION.
     */
    Type?: ICD10CMEntityType;
    /**
     * The level of confidence that Amazon Comprehend Medical has in the accuracy of the detection.
     */
    Score?: Float;
    /**
     * The 0-based character offset in the input text that shows where the entity begins. The offset returns the UTF-8 code point in the string.
     */
    BeginOffset?: Integer;
    /**
     * The 0-based character offset in the input text that shows where the entity ends. The offset returns the UTF-8 code point in the string.
     */
    EndOffset?: Integer;
    /**
     * The detected attributes that relate to the entity. An extracted segment of the text that is an attribute of an entity, or otherwise related to an entity, such as the nature of a medical condition.
     */
    Attributes?: ICD10CMAttributeList;
    /**
     * Provides Contextual information for the entity. The traits recognized by InferICD10CM are DIAGNOSIS, SIGN, SYMPTOM, and NEGATION. 
     */
    Traits?: ICD10CMTraitList;
    /**
     * The ICD-10-CM concepts that the entity could refer to, along with a score indicating the likelihood of the match.
     */
    ICD10CMConcepts?: ICD10CMConceptList;
  }
  export type ICD10CMEntityCategory = "MEDICAL_CONDITION"|string;
  export type ICD10CMEntityList = ICD10CMEntity[];
  export type ICD10CMEntityType = "DX_NAME"|"TIME_EXPRESSION"|string;
  export type ICD10CMRelationshipType = "OVERLAP"|"SYSTEM_ORGAN_SITE"|string;
  export interface ICD10CMTrait {
    /**
     * Provides a name or contextual description about the trait.
     */
    Name?: ICD10CMTraitName;
    /**
     * The level of confidence that Amazon Comprehend Medical has that the segment of text is correctly recognized as a trait.
     */
    Score?: Float;
  }
  export type ICD10CMTraitList = ICD10CMTrait[];
  export type ICD10CMTraitName = "NEGATION"|"DIAGNOSIS"|"SIGN"|"SYMPTOM"|string;
  export type IamRoleArn = string;
  export interface InferICD10CMRequest {
    /**
     * The input text used for analysis. The input for InferICD10CM is a string from 1 to 10000 characters.
     */
    Text: OntologyLinkingBoundedLengthString;
  }
  export interface InferICD10CMResponse {
    /**
     * The medical conditions detected in the text linked to ICD-10-CM concepts. If the action is successful, the service sends back an HTTP 200 response, as well as the entities detected.
     */
    Entities: ICD10CMEntityList;
    /**
     * If the result of the previous request to InferICD10CM was truncated, include the PaginationToken to fetch the next page of medical condition entities. 
     */
    PaginationToken?: String;
    /**
     * The version of the model used to analyze the documents, in the format n.n.n You can use this information to track the model used for a particular batch of documents.
     */
    ModelVersion?: String;
  }
  export interface InferRxNormRequest {
    /**
     * The input text used for analysis. The input for InferRxNorm is a string from 1 to 10000 characters.
     */
    Text: OntologyLinkingBoundedLengthString;
  }
  export interface InferRxNormResponse {
    /**
     * The medication entities detected in the text linked to RxNorm concepts. If the action is successful, the service sends back an HTTP 200 response, as well as the entities detected.
     */
    Entities: RxNormEntityList;
    /**
     * If the result of the previous request to InferRxNorm was truncated, include the PaginationToken to fetch the next page of medication entities.
     */
    PaginationToken?: String;
    /**
     * The version of the model used to analyze the documents, in the format n.n.n You can use this information to track the model used for a particular batch of documents.
     */
    ModelVersion?: String;
  }
  export interface InputDataConfig {
    /**
     * The URI of the S3 bucket that contains the input data. The bucket must be in the same region as the API endpoint that you are calling. Each file in the document collection must be less than 40 KB. You can store a maximum of 30 GB in the bucket.
     */
    S3Bucket: S3Bucket;
    /**
     * The path to the input data files in the S3 bucket.
     */
    S3Key?: S3Key;
  }
  export type Integer = number;
  export type JobId = string;
  export type JobName = string;
  export type JobStatus = "SUBMITTED"|"IN_PROGRESS"|"COMPLETED"|"PARTIAL_SUCCESS"|"FAILED"|"STOP_REQUESTED"|"STOPPED"|string;
  export type KMSKey = string;
  export type LanguageCode = "en"|string;
  export interface ListEntitiesDetectionV2JobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs based on their names, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: ComprehendMedicalAsyncJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListEntitiesDetectionV2JobsResponse {
    /**
     * A list containing the properties of each job returned.
     */
    ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListICD10CMInferenceJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs based on their names, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: ComprehendMedicalAsyncJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListICD10CMInferenceJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListPHIDetectionJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs based on their names, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: ComprehendMedicalAsyncJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListPHIDetectionJobsResponse {
    /**
     * A list containing the properties of each job returned.
     */
    ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListRxNormInferenceJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs based on their names, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: ComprehendMedicalAsyncJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * Identifies the next page of results to return.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListRxNormInferenceJobsResponse {
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    ComprehendMedicalAsyncJobPropertiesList?: ComprehendMedicalAsyncJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export type ManifestFilePath = string;
  export type MaxResultsInteger = number;
  export type ModelVersion = string;
  export type OntologyLinkingBoundedLengthString = string;
  export interface OutputDataConfig {
    /**
     * When you use the OutputDataConfig object with asynchronous operations, you specify the Amazon S3 location where you want to write the output data. The URI must be in the same region as the API endpoint that you are calling. The location is used as the prefix for the actual location of the output.
     */
    S3Bucket: S3Bucket;
    /**
     * The path to the output data files in the S3 bucket. Amazon Comprehend Medical creates an output directory using the job ID so that the output from one job does not overwrite the output of another.
     */
    S3Key?: S3Key;
  }
  export type RelationshipType = "EVERY"|"WITH_DOSAGE"|"ADMINISTERED_VIA"|"FOR"|"NEGATIVE"|"OVERLAP"|"DOSAGE"|"ROUTE_OR_MODE"|"FORM"|"FREQUENCY"|"DURATION"|"STRENGTH"|"RATE"|"ACUITY"|"TEST_VALUE"|"TEST_UNITS"|"DIRECTION"|"SYSTEM_ORGAN_SITE"|string;
  export interface RxNormAttribute {
    /**
     * The type of attribute. The types of attributes recognized by InferRxNorm are BRAND_NAME and GENERIC_NAME.
     */
    Type?: RxNormAttributeType;
    /**
     * The level of confidence that Comprehend Medical has that the segment of text is correctly recognized as an attribute.
     */
    Score?: Float;
    /**
     * The level of confidence that Amazon Comprehend Medical has that the attribute is accurately linked to an entity.
     */
    RelationshipScore?: Float;
    /**
     * The numeric identifier for this attribute. This is a monotonically increasing id unique within this response rather than a global unique identifier.
     */
    Id?: Integer;
    /**
     * The 0-based character offset in the input text that shows where the attribute begins. The offset returns the UTF-8 code point in the string.
     */
    BeginOffset?: Integer;
    /**
     * The 0-based character offset in the input text that shows where the attribute ends. The offset returns the UTF-8 code point in the string.
     */
    EndOffset?: Integer;
    /**
     * The segment of input text which corresponds to the detected attribute.
     */
    Text?: String;
    /**
     * Contextual information for the attribute. InferRxNorm recognizes the trait NEGATION for attributes, i.e. that the patient is not taking a specific dose or form of a medication.
     */
    Traits?: RxNormTraitList;
  }
  export type RxNormAttributeList = RxNormAttribute[];
  export type RxNormAttributeType = "DOSAGE"|"DURATION"|"FORM"|"FREQUENCY"|"RATE"|"ROUTE_OR_MODE"|"STRENGTH"|string;
  export interface RxNormConcept {
    /**
     * The description of the RxNorm concept.
     */
    Description?: String;
    /**
     * RxNorm concept ID, also known as the RxCUI.
     */
    Code?: String;
    /**
     * The level of confidence that Amazon Comprehend Medical has that the entity is accurately linked to the reported RxNorm concept.
     */
    Score?: Float;
  }
  export type RxNormConceptList = RxNormConcept[];
  export interface RxNormEntity {
    /**
     * The numeric identifier for the entity. This is a monotonically increasing id unique within this response rather than a global unique identifier.
     */
    Id?: Integer;
    /**
     * The segment of input text extracted from which the entity was detected.
     */
    Text?: OntologyLinkingBoundedLengthString;
    /**
     * The category of the entity. The recognized categories are GENERIC or BRAND_NAME.
     */
    Category?: RxNormEntityCategory;
    /**
     *  Describes the specific type of entity. For InferRxNorm, the recognized entity type is MEDICATION.
     */
    Type?: RxNormEntityType;
    /**
     * The level of confidence that Amazon Comprehend Medical has in the accuracy of the detected entity.
     */
    Score?: Float;
    /**
     * The 0-based character offset in the input text that shows where the entity begins. The offset returns the UTF-8 code point in the string.
     */
    BeginOffset?: Integer;
    /**
     * The 0-based character offset in the input text that shows where the entity ends. The offset returns the UTF-8 code point in the string.
     */
    EndOffset?: Integer;
    /**
     * The extracted attributes that relate to the entity. The attributes recognized by InferRxNorm are DOSAGE, DURATION, FORM, FREQUENCY, RATE, ROUTE_OR_MODE, and STRENGTH.
     */
    Attributes?: RxNormAttributeList;
    /**
     *  Contextual information for the entity.
     */
    Traits?: RxNormTraitList;
    /**
     *  The RxNorm concepts that the entity could refer to, along with a score indicating the likelihood of the match.
     */
    RxNormConcepts?: RxNormConceptList;
  }
  export type RxNormEntityCategory = "MEDICATION"|string;
  export type RxNormEntityList = RxNormEntity[];
  export type RxNormEntityType = "BRAND_NAME"|"GENERIC_NAME"|string;
  export interface RxNormTrait {
    /**
     * Provides a name or contextual description about the trait.
     */
    Name?: RxNormTraitName;
    /**
     * The level of confidence that Amazon Comprehend Medical has in the accuracy of the detected trait.
     */
    Score?: Float;
  }
  export type RxNormTraitList = RxNormTrait[];
  export type RxNormTraitName = "NEGATION"|string;
  export type S3Bucket = string;
  export type S3Key = string;
  export interface StartEntitiesDetectionV2JobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that grants Amazon Comprehend Medical read access to your input data. For more information, see  Role-Based Permissions Required for Asynchronous Operations.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend Medical generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * An AWS Key Management Service key to encrypt your output files. If you do not specify a key, the files are written in plain text.
     */
    KMSKey?: KMSKey;
    /**
     * The language of the input documents. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface StartEntitiesDetectionV2JobResponse {
    /**
     * The identifier generated for the job. To get the status of a job, use this identifier with the DescribeEntitiesDetectionV2Job operation.
     */
    JobId?: JobId;
  }
  export interface StartICD10CMInferenceJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that grants Amazon Comprehend Medical read access to your input data. For more information, see  Role-Based Permissions Required for Asynchronous Operations.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend Medical generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * An AWS Key Management Service key to encrypt your output files. If you do not specify a key, the files are written in plain text.
     */
    KMSKey?: KMSKey;
    /**
     * The language of the input documents. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface StartICD10CMInferenceJobResponse {
    /**
     * The identifier generated for the job. To get the status of a job, use this identifier with the StartICD10CMInferenceJob operation.
     */
    JobId?: JobId;
  }
  export interface StartPHIDetectionJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that grants Amazon Comprehend Medical read access to your input data. For more information, see  Role-Based Permissions Required for Asynchronous Operations.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend Medical generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * An AWS Key Management Service key to encrypt your output files. If you do not specify a key, the files are written in plain text.
     */
    KMSKey?: KMSKey;
    /**
     * The language of the input documents. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface StartPHIDetectionJobResponse {
    /**
     * The identifier generated for the job. To get the status of a job, use this identifier with the DescribePHIDetectionJob operation.
     */
    JobId?: JobId;
  }
  export interface StartRxNormInferenceJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that grants Amazon Comprehend Medical read access to your input data. For more information, see  Role-Based Permissions Required for Asynchronous Operations.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend Medical generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * An AWS Key Management Service key to encrypt your output files. If you do not specify a key, the files are written in plain text.
     */
    KMSKey?: KMSKey;
    /**
     * The language of the input documents. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface StartRxNormInferenceJobResponse {
    /**
     * The identifier of the job.
     */
    JobId?: JobId;
  }
  export interface StopEntitiesDetectionV2JobRequest {
    /**
     * The identifier of the medical entities job to stop.
     */
    JobId: JobId;
  }
  export interface StopEntitiesDetectionV2JobResponse {
    /**
     * The identifier of the medical entities detection job that was stopped.
     */
    JobId?: JobId;
  }
  export interface StopICD10CMInferenceJobRequest {
    /**
     * The identifier of the job.
     */
    JobId: JobId;
  }
  export interface StopICD10CMInferenceJobResponse {
    /**
     * The identifier generated for the job. To get the status of job, use this identifier with the DescribeICD10CMInferenceJob operation.
     */
    JobId?: JobId;
  }
  export interface StopPHIDetectionJobRequest {
    /**
     * The identifier of the PHI detection job to stop.
     */
    JobId: JobId;
  }
  export interface StopPHIDetectionJobResponse {
    /**
     * The identifier of the PHI detection job that was stopped.
     */
    JobId?: JobId;
  }
  export interface StopRxNormInferenceJobRequest {
    /**
     * The identifier of the job.
     */
    JobId: JobId;
  }
  export interface StopRxNormInferenceJobResponse {
    /**
     * The identifier generated for the job. To get the status of job, use this identifier with the DescribeRxNormInferenceJob operation.
     */
    JobId?: JobId;
  }
  export type String = string;
  export type Timestamp = Date;
  export interface Trait {
    /**
     *  Provides a name or contextual description about the trait. 
     */
    Name?: AttributeName;
    /**
     *  The level of confidence that Amazon Comprehend Medical has in the accuracy of this trait.
     */
    Score?: Float;
  }
  export type TraitList = Trait[];
  export interface UnmappedAttribute {
    /**
     *  The type of the attribute, could be one of the following values: "MEDICATION", "MEDICAL_CONDITION", "ANATOMY", "TEST_AND_TREATMENT_PROCEDURE" or "PROTECTED_HEALTH_INFORMATION". 
     */
    Type?: EntityType;
    /**
     *  The specific attribute that has been extracted but not mapped to an entity. 
     */
    Attribute?: Attribute;
  }
  export type UnmappedAttributeList = UnmappedAttribute[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-10-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ComprehendMedical client.
   */
  export import Types = ComprehendMedical;
}
export = ComprehendMedical;
