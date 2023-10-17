import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class EntityResolution extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: EntityResolution.Types.ClientConfiguration)
  config: Config & EntityResolution.Types.ClientConfiguration;
  /**
   * Creates a MatchingWorkflow object which stores the configuration of the data processing job to be run. It is important to note that there should not be a pre-existing MatchingWorkflow with the same name. To modify an existing workflow, utilize the UpdateMatchingWorkflow API.
   */
  createMatchingWorkflow(params: EntityResolution.Types.CreateMatchingWorkflowInput, callback?: (err: AWSError, data: EntityResolution.Types.CreateMatchingWorkflowOutput) => void): Request<EntityResolution.Types.CreateMatchingWorkflowOutput, AWSError>;
  /**
   * Creates a MatchingWorkflow object which stores the configuration of the data processing job to be run. It is important to note that there should not be a pre-existing MatchingWorkflow with the same name. To modify an existing workflow, utilize the UpdateMatchingWorkflow API.
   */
  createMatchingWorkflow(callback?: (err: AWSError, data: EntityResolution.Types.CreateMatchingWorkflowOutput) => void): Request<EntityResolution.Types.CreateMatchingWorkflowOutput, AWSError>;
  /**
   * Creates a schema mapping, which defines the schema of the input customer records table. The SchemaMapping also provides Entity Resolution with some metadata about the table, such as the attribute types of the columns and which columns to match on.
   */
  createSchemaMapping(params: EntityResolution.Types.CreateSchemaMappingInput, callback?: (err: AWSError, data: EntityResolution.Types.CreateSchemaMappingOutput) => void): Request<EntityResolution.Types.CreateSchemaMappingOutput, AWSError>;
  /**
   * Creates a schema mapping, which defines the schema of the input customer records table. The SchemaMapping also provides Entity Resolution with some metadata about the table, such as the attribute types of the columns and which columns to match on.
   */
  createSchemaMapping(callback?: (err: AWSError, data: EntityResolution.Types.CreateSchemaMappingOutput) => void): Request<EntityResolution.Types.CreateSchemaMappingOutput, AWSError>;
  /**
   * Deletes the MatchingWorkflow with a given name. This operation will succeed even if a workflow with the given name does not exist.
   */
  deleteMatchingWorkflow(params: EntityResolution.Types.DeleteMatchingWorkflowInput, callback?: (err: AWSError, data: EntityResolution.Types.DeleteMatchingWorkflowOutput) => void): Request<EntityResolution.Types.DeleteMatchingWorkflowOutput, AWSError>;
  /**
   * Deletes the MatchingWorkflow with a given name. This operation will succeed even if a workflow with the given name does not exist.
   */
  deleteMatchingWorkflow(callback?: (err: AWSError, data: EntityResolution.Types.DeleteMatchingWorkflowOutput) => void): Request<EntityResolution.Types.DeleteMatchingWorkflowOutput, AWSError>;
  /**
   * Deletes the SchemaMapping with a given name. This operation will succeed even if a schema with the given name does not exist. This operation will fail if there is a DataIntegrationWorkflow object that references the SchemaMapping in the workflow's InputSourceConfig.
   */
  deleteSchemaMapping(params: EntityResolution.Types.DeleteSchemaMappingInput, callback?: (err: AWSError, data: EntityResolution.Types.DeleteSchemaMappingOutput) => void): Request<EntityResolution.Types.DeleteSchemaMappingOutput, AWSError>;
  /**
   * Deletes the SchemaMapping with a given name. This operation will succeed even if a schema with the given name does not exist. This operation will fail if there is a DataIntegrationWorkflow object that references the SchemaMapping in the workflow's InputSourceConfig.
   */
  deleteSchemaMapping(callback?: (err: AWSError, data: EntityResolution.Types.DeleteSchemaMappingOutput) => void): Request<EntityResolution.Types.DeleteSchemaMappingOutput, AWSError>;
  /**
   * Returns the corresponding Match ID of a customer record if the record has been processed.
   */
  getMatchId(params: EntityResolution.Types.GetMatchIdInput, callback?: (err: AWSError, data: EntityResolution.Types.GetMatchIdOutput) => void): Request<EntityResolution.Types.GetMatchIdOutput, AWSError>;
  /**
   * Returns the corresponding Match ID of a customer record if the record has been processed.
   */
  getMatchId(callback?: (err: AWSError, data: EntityResolution.Types.GetMatchIdOutput) => void): Request<EntityResolution.Types.GetMatchIdOutput, AWSError>;
  /**
   * Gets the status, metrics, and errors (if there are any) that are associated with a job.
   */
  getMatchingJob(params: EntityResolution.Types.GetMatchingJobInput, callback?: (err: AWSError, data: EntityResolution.Types.GetMatchingJobOutput) => void): Request<EntityResolution.Types.GetMatchingJobOutput, AWSError>;
  /**
   * Gets the status, metrics, and errors (if there are any) that are associated with a job.
   */
  getMatchingJob(callback?: (err: AWSError, data: EntityResolution.Types.GetMatchingJobOutput) => void): Request<EntityResolution.Types.GetMatchingJobOutput, AWSError>;
  /**
   * Returns the MatchingWorkflow with a given name, if it exists.
   */
  getMatchingWorkflow(params: EntityResolution.Types.GetMatchingWorkflowInput, callback?: (err: AWSError, data: EntityResolution.Types.GetMatchingWorkflowOutput) => void): Request<EntityResolution.Types.GetMatchingWorkflowOutput, AWSError>;
  /**
   * Returns the MatchingWorkflow with a given name, if it exists.
   */
  getMatchingWorkflow(callback?: (err: AWSError, data: EntityResolution.Types.GetMatchingWorkflowOutput) => void): Request<EntityResolution.Types.GetMatchingWorkflowOutput, AWSError>;
  /**
   * Returns the SchemaMapping of a given name.
   */
  getSchemaMapping(params: EntityResolution.Types.GetSchemaMappingInput, callback?: (err: AWSError, data: EntityResolution.Types.GetSchemaMappingOutput) => void): Request<EntityResolution.Types.GetSchemaMappingOutput, AWSError>;
  /**
   * Returns the SchemaMapping of a given name.
   */
  getSchemaMapping(callback?: (err: AWSError, data: EntityResolution.Types.GetSchemaMappingOutput) => void): Request<EntityResolution.Types.GetSchemaMappingOutput, AWSError>;
  /**
   * Lists all jobs for a given workflow.
   */
  listMatchingJobs(params: EntityResolution.Types.ListMatchingJobsInput, callback?: (err: AWSError, data: EntityResolution.Types.ListMatchingJobsOutput) => void): Request<EntityResolution.Types.ListMatchingJobsOutput, AWSError>;
  /**
   * Lists all jobs for a given workflow.
   */
  listMatchingJobs(callback?: (err: AWSError, data: EntityResolution.Types.ListMatchingJobsOutput) => void): Request<EntityResolution.Types.ListMatchingJobsOutput, AWSError>;
  /**
   * Returns a list of all the MatchingWorkflows that have been created for an Amazon Web Services account.
   */
  listMatchingWorkflows(params: EntityResolution.Types.ListMatchingWorkflowsInput, callback?: (err: AWSError, data: EntityResolution.Types.ListMatchingWorkflowsOutput) => void): Request<EntityResolution.Types.ListMatchingWorkflowsOutput, AWSError>;
  /**
   * Returns a list of all the MatchingWorkflows that have been created for an Amazon Web Services account.
   */
  listMatchingWorkflows(callback?: (err: AWSError, data: EntityResolution.Types.ListMatchingWorkflowsOutput) => void): Request<EntityResolution.Types.ListMatchingWorkflowsOutput, AWSError>;
  /**
   * Returns a list of all the SchemaMappings that have been created for an Amazon Web Services account.
   */
  listSchemaMappings(params: EntityResolution.Types.ListSchemaMappingsInput, callback?: (err: AWSError, data: EntityResolution.Types.ListSchemaMappingsOutput) => void): Request<EntityResolution.Types.ListSchemaMappingsOutput, AWSError>;
  /**
   * Returns a list of all the SchemaMappings that have been created for an Amazon Web Services account.
   */
  listSchemaMappings(callback?: (err: AWSError, data: EntityResolution.Types.ListSchemaMappingsOutput) => void): Request<EntityResolution.Types.ListSchemaMappingsOutput, AWSError>;
  /**
   * Displays the tags associated with an Entity Resolution resource. In Entity Resolution, SchemaMapping, and MatchingWorkflow can be tagged.
   */
  listTagsForResource(params: EntityResolution.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: EntityResolution.Types.ListTagsForResourceOutput) => void): Request<EntityResolution.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Displays the tags associated with an Entity Resolution resource. In Entity Resolution, SchemaMapping, and MatchingWorkflow can be tagged.
   */
  listTagsForResource(callback?: (err: AWSError, data: EntityResolution.Types.ListTagsForResourceOutput) => void): Request<EntityResolution.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Starts the MatchingJob of a workflow. The workflow must have previously been created using the CreateMatchingWorkflow endpoint.
   */
  startMatchingJob(params: EntityResolution.Types.StartMatchingJobInput, callback?: (err: AWSError, data: EntityResolution.Types.StartMatchingJobOutput) => void): Request<EntityResolution.Types.StartMatchingJobOutput, AWSError>;
  /**
   * Starts the MatchingJob of a workflow. The workflow must have previously been created using the CreateMatchingWorkflow endpoint.
   */
  startMatchingJob(callback?: (err: AWSError, data: EntityResolution.Types.StartMatchingJobOutput) => void): Request<EntityResolution.Types.StartMatchingJobOutput, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Entity Resolution resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In Entity Resolution, SchemaMapping and MatchingWorkflow can be tagged. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
   */
  tagResource(params: EntityResolution.Types.TagResourceInput, callback?: (err: AWSError, data: EntityResolution.Types.TagResourceOutput) => void): Request<EntityResolution.Types.TagResourceOutput, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Entity Resolution resource. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. In Entity Resolution, SchemaMapping and MatchingWorkflow can be tagged. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
   */
  tagResource(callback?: (err: AWSError, data: EntityResolution.Types.TagResourceOutput) => void): Request<EntityResolution.Types.TagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from the specified Entity Resolution resource. In Entity Resolution, SchemaMapping, and MatchingWorkflow can be tagged.
   */
  untagResource(params: EntityResolution.Types.UntagResourceInput, callback?: (err: AWSError, data: EntityResolution.Types.UntagResourceOutput) => void): Request<EntityResolution.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from the specified Entity Resolution resource. In Entity Resolution, SchemaMapping, and MatchingWorkflow can be tagged.
   */
  untagResource(callback?: (err: AWSError, data: EntityResolution.Types.UntagResourceOutput) => void): Request<EntityResolution.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates an existing MatchingWorkflow. This method is identical to CreateMatchingWorkflow, except it uses an HTTP PUT request instead of a POST request, and the MatchingWorkflow must already exist for the method to succeed.
   */
  updateMatchingWorkflow(params: EntityResolution.Types.UpdateMatchingWorkflowInput, callback?: (err: AWSError, data: EntityResolution.Types.UpdateMatchingWorkflowOutput) => void): Request<EntityResolution.Types.UpdateMatchingWorkflowOutput, AWSError>;
  /**
   * Updates an existing MatchingWorkflow. This method is identical to CreateMatchingWorkflow, except it uses an HTTP PUT request instead of a POST request, and the MatchingWorkflow must already exist for the method to succeed.
   */
  updateMatchingWorkflow(callback?: (err: AWSError, data: EntityResolution.Types.UpdateMatchingWorkflowOutput) => void): Request<EntityResolution.Types.UpdateMatchingWorkflowOutput, AWSError>;
}
declare namespace EntityResolution {
  export type AttributeMatchingModel = "ONE_TO_ONE"|"MANY_TO_MANY"|string;
  export type AttributeName = string;
  export type Boolean = boolean;
  export interface CreateMatchingWorkflowInput {
    /**
     * A description of the workflow.
     */
    description?: Description;
    /**
     * An object which defines an incremental run type and has only incrementalRunType as a field.
     */
    incrementalRunConfig?: IncrementalRunConfig;
    /**
     * A list of InputSource objects, which have the fields InputSourceARN and SchemaName.
     */
    inputSourceConfig: InputSourceConfig;
    /**
     * A list of OutputSource objects, each of which contains fields OutputS3Path, ApplyNormalization, and Output.
     */
    outputSourceConfig: OutputSourceConfig;
    /**
     * An object which defines the resolutionType and the ruleBasedProperties.
     */
    resolutionTechniques: ResolutionTechniques;
    /**
     * The Amazon Resource Name (ARN) of the IAM role. Entity Resolution assumes this role to create resources on your behalf as part of workflow execution.
     */
    roleArn: String;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: TagMap;
    /**
     * The name of the workflow. There cannot be multiple DataIntegrationWorkflows with the same name.
     */
    workflowName: EntityName;
  }
  export interface CreateMatchingWorkflowOutput {
    /**
     * A description of the workflow.
     */
    description?: Description;
    /**
     * An object which defines an incremental run type and has only incrementalRunType as a field.
     */
    incrementalRunConfig?: IncrementalRunConfig;
    /**
     * A list of InputSource objects, which have the fields InputSourceARN and SchemaName.
     */
    inputSourceConfig: InputSourceConfig;
    /**
     * A list of OutputSource objects, each of which contains fields OutputS3Path, ApplyNormalization, and Output.
     */
    outputSourceConfig: OutputSourceConfig;
    /**
     * An object which defines the resolutionType and the ruleBasedProperties.
     */
    resolutionTechniques: ResolutionTechniques;
    /**
     * The Amazon Resource Name (ARN) of the IAM role. Entity Resolution assumes this role to create resources on your behalf as part of workflow execution.
     */
    roleArn: String;
    /**
     * The ARN (Amazon Resource Name) that Entity Resolution generated for the MatchingWorkflow.
     */
    workflowArn: MatchingWorkflowArn;
    /**
     * The name of the workflow.
     */
    workflowName: EntityName;
  }
  export interface CreateSchemaMappingInput {
    /**
     * A description of the schema.
     */
    description?: Description;
    /**
     * A list of MappedInputFields. Each MappedInputField corresponds to a column the source data table, and contains column name plus additional information that Entity Resolution uses for matching.
     */
    mappedInputFields: SchemaInputAttributes;
    /**
     * The name of the schema. There cannot be multiple SchemaMappings with the same name.
     */
    schemaName: EntityName;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: TagMap;
  }
  export interface CreateSchemaMappingOutput {
    /**
     * A description of the schema.
     */
    description: Description;
    /**
     * A list of MappedInputFields. Each MappedInputField corresponds to a column the source data table, and contains column name plus additional information that Entity Resolution uses for matching.
     */
    mappedInputFields: SchemaInputAttributes;
    /**
     * The ARN (Amazon Resource Name) that Entity Resolution generated for the SchemaMapping.
     */
    schemaArn: SchemaMappingArn;
    /**
     * The name of the schema.
     */
    schemaName: EntityName;
  }
  export interface DeleteMatchingWorkflowInput {
    /**
     * The name of the workflow to be retrieved.
     */
    workflowName: EntityName;
  }
  export interface DeleteMatchingWorkflowOutput {
    /**
     * A successful operation message.
     */
    message: String;
  }
  export interface DeleteSchemaMappingInput {
    /**
     * The name of the schema to delete.
     */
    schemaName: EntityName;
  }
  export interface DeleteSchemaMappingOutput {
    /**
     * A successful operation message.
     */
    message: String;
  }
  export type Description = string;
  export type EntityName = string;
  export interface ErrorDetails {
    /**
     * The error message from the job, if there is one.
     */
    errorMessage?: ErrorMessage;
  }
  export type ErrorMessage = string;
  export interface GetMatchIdInput {
    /**
     * The record to fetch the Match ID for.
     */
    record: RecordAttributeMap;
    /**
     * The name of the workflow.
     */
    workflowName: EntityName;
  }
  export interface GetMatchIdOutput {
    /**
     * The unique identifiers for this group of match records.
     */
    matchId?: String;
  }
  export interface GetMatchingJobInput {
    /**
     * The ID of the job.
     */
    jobId: JobId;
    /**
     * The name of the workflow.
     */
    workflowName: EntityName;
  }
  export interface GetMatchingJobOutput {
    /**
     * The time at which the job has finished.
     */
    endTime?: Timestamp;
    /**
     * An object containing an error message, if there was an error.
     */
    errorDetails?: ErrorDetails;
    /**
     * The ID of the job.
     */
    jobId: JobId;
    /**
     * Metrics associated with the execution, specifically total records processed, unique IDs generated, and records the execution skipped.
     */
    metrics?: JobMetrics;
    /**
     * The time at which the job was started.
     */
    startTime: Timestamp;
    /**
     * The current status of the job.
     */
    status: JobStatus;
  }
  export interface GetMatchingWorkflowInput {
    /**
     * The name of the workflow.
     */
    workflowName: EntityName;
  }
  export interface GetMatchingWorkflowOutput {
    /**
     * The timestamp of when the workflow was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the workflow.
     */
    description?: Description;
    /**
     * An object which defines an incremental run type and has only incrementalRunType as a field.
     */
    incrementalRunConfig?: IncrementalRunConfig;
    /**
     * A list of InputSource objects, which have the fields InputSourceARN and SchemaName.
     */
    inputSourceConfig: InputSourceConfig;
    /**
     * A list of OutputSource objects, each of which contains fields OutputS3Path, ApplyNormalization, and Output.
     */
    outputSourceConfig: OutputSourceConfig;
    /**
     * An object which defines the resolutionType and the ruleBasedProperties.
     */
    resolutionTechniques: ResolutionTechniques;
    /**
     * The Amazon Resource Name (ARN) of the IAM role. Entity Resolution assumes this role to access resources on your behalf.
     */
    roleArn: String;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: TagMap;
    /**
     * The timestamp of when the workflow was last updated.
     */
    updatedAt: Timestamp;
    /**
     * The ARN (Amazon Resource Name) that Entity Resolution generated for the MatchingWorkflow.
     */
    workflowArn: MatchingWorkflowArn;
    /**
     * The name of the workflow.
     */
    workflowName: EntityName;
  }
  export interface GetSchemaMappingInput {
    /**
     * The name of the schema to be retrieved.
     */
    schemaName: EntityName;
  }
  export interface GetSchemaMappingOutput {
    /**
     * The timestamp of when the SchemaMapping was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the schema.
     */
    description?: Description;
    /**
     * A list of MappedInputFields. Each MappedInputField corresponds to a column the source data table, and contains column name plus additional information Venice uses for matching.
     */
    mappedInputFields: SchemaInputAttributes;
    /**
     * The ARN (Amazon Resource Name) that Entity Resolution generated for the SchemaMapping.
     */
    schemaArn: SchemaMappingArn;
    /**
     * The name of the schema.
     */
    schemaName: EntityName;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: TagMap;
    /**
     * The timestamp of when the SchemaMapping was last updated.
     */
    updatedAt: Timestamp;
  }
  export interface IncrementalRunConfig {
    /**
     * The type of incremental run. It takes only one value: IMMEDIATE.
     */
    incrementalRunType?: IncrementalRunType;
  }
  export type IncrementalRunType = "IMMEDIATE"|string;
  export interface InputSource {
    /**
     * Normalizes the attributes defined in the schema in the input data. For example, if an attribute has an AttributeType of PHONE_NUMBER, and the data in the input table is in a format of 1234567890, Entity Resolution will normalize this field in the output to (123)-456-7890.
     */
    applyNormalization?: Boolean;
    /**
     * An Glue table ARN for the input source table.
     */
    inputSourceARN: InputSourceInputSourceARNString;
    /**
     * The name of the schema to be retrieved.
     */
    schemaName: EntityName;
  }
  export type InputSourceConfig = InputSource[];
  export type InputSourceInputSourceARNString = string;
  export type Integer = number;
  export type JobId = string;
  export type JobList = JobSummary[];
  export interface JobMetrics {
    /**
     * The total number of input records.
     */
    inputRecords?: Integer;
    /**
     * The total number of matchIDs generated.
     */
    matchIDs?: Integer;
    /**
     * The total number of records that did not get processed.
     */
    recordsNotProcessed?: Integer;
    /**
     * The total number of records processed.
     */
    totalRecordsProcessed?: Integer;
  }
  export type JobStatus = "RUNNING"|"SUCCEEDED"|"FAILED"|"QUEUED"|string;
  export interface JobSummary {
    /**
     * The time at which the job has finished.
     */
    endTime?: Timestamp;
    /**
     * The ID of the job.
     */
    jobId: JobId;
    /**
     * The time at which the job was started.
     */
    startTime: Timestamp;
    /**
     * The current status of the job.
     */
    status: JobStatus;
  }
  export type KMSArn = string;
  export interface ListMatchingJobsInput {
    /**
     * The maximum number of objects returned per page.
     */
    maxResults?: ListMatchingJobsInputMaxResultsInteger;
    /**
     * The pagination token from the previous ListSchemaMappings API call.
     */
    nextToken?: NextToken;
    /**
     * The name of the workflow to be retrieved.
     */
    workflowName: EntityName;
  }
  export type ListMatchingJobsInputMaxResultsInteger = number;
  export interface ListMatchingJobsOutput {
    /**
     * A list of JobSummary objects, each of which contain the ID, status, start time, and end time of a job.
     */
    jobs?: JobList;
    /**
     * The pagination token from the previous ListSchemaMappings API call.
     */
    nextToken?: NextToken;
  }
  export interface ListMatchingWorkflowsInput {
    /**
     * The maximum number of objects returned per page.
     */
    maxResults?: ListMatchingWorkflowsInputMaxResultsInteger;
    /**
     * The pagination token from the previous ListSchemaMappings API call.
     */
    nextToken?: NextToken;
  }
  export type ListMatchingWorkflowsInputMaxResultsInteger = number;
  export interface ListMatchingWorkflowsOutput {
    /**
     * The pagination token from the previous ListSchemaMappings API call.
     */
    nextToken?: NextToken;
    /**
     * A list of MatchingWorkflowSummary objects, each of which contain the fields WorkflowName, WorkflowArn, CreatedAt, and UpdatedAt.
     */
    workflowSummaries?: MatchingWorkflowList;
  }
  export interface ListSchemaMappingsInput {
    /**
     * The maximum number of objects returned per page.
     */
    maxResults?: ListSchemaMappingsInputMaxResultsInteger;
    /**
     * The pagination token from the previous ListSchemaMappings API call.
     */
    nextToken?: NextToken;
  }
  export type ListSchemaMappingsInputMaxResultsInteger = number;
  export interface ListSchemaMappingsOutput {
    /**
     * The pagination token from the previous ListDomains API call.
     */
    nextToken?: NextToken;
    /**
     * A list of SchemaMappingSummary objects, each of which contain the fields SchemaName, SchemaArn, CreatedAt, UpdatedAt.
     */
    schemaList?: SchemaMappingList;
  }
  export interface ListTagsForResourceInput {
    /**
     * The ARN of the resource for which you want to view tags.
     */
    resourceArn: VeniceGlobalArn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags: TagMap;
  }
  export type MatchingWorkflowArn = string;
  export type MatchingWorkflowList = MatchingWorkflowSummary[];
  export interface MatchingWorkflowSummary {
    /**
     * The timestamp of when the workflow was created.
     */
    createdAt: Timestamp;
    /**
     * The timestamp of when the workflow was last updated.
     */
    updatedAt: Timestamp;
    /**
     * The ARN (Amazon Resource Name) that Entity Resolution generated for the MatchingWorkflow.
     */
    workflowArn: MatchingWorkflowArn;
    /**
     * The name of the workflow.
     */
    workflowName: EntityName;
  }
  export type NextToken = string;
  export interface OutputAttribute {
    /**
     * Enables the ability to hash the column values in the output.
     */
    hashed?: Boolean;
    /**
     * A name of a column to be written to the output. This must be an InputField name in the schema mapping.
     */
    name: AttributeName;
  }
  export interface OutputSource {
    /**
     * Customer KMS ARN for encryption at rest. If not provided, system will use an Entity Resolution managed KMS key.
     */
    KMSArn?: KMSArn;
    /**
     * Normalizes the attributes defined in the schema in the input data. For example, if an attribute has an AttributeType of PHONE_NUMBER, and the data in the input table is in a format of 1234567890, Entity Resolution will normalize this field in the output to (123)-456-7890.
     */
    applyNormalization?: Boolean;
    /**
     * A list of OutputAttribute objects, each of which have the fields Name and Hashed. Each of these objects selects a column to be included in the output table, and whether the values of the column should be hashed.
     */
    output: OutputSourceOutputList;
    /**
     * The S3 path to which Entity Resolution will write the output table.
     */
    outputS3Path: S3Path;
  }
  export type OutputSourceConfig = OutputSource[];
  export type OutputSourceOutputList = OutputAttribute[];
  export type RecordAttributeMap = {[key: string]: RecordAttributeMapValueString};
  export type RecordAttributeMapKeyString = string;
  export type RecordAttributeMapValueString = string;
  export interface ResolutionTechniques {
    /**
     * The type of matching. There are two types of matching: RULE_MATCHING and ML_MATCHING.
     */
    resolutionType: ResolutionType;
    /**
     * An object which defines the list of matching rules to run and has a field Rules, which is a list of rule objects.
     */
    ruleBasedProperties?: RuleBasedProperties;
  }
  export type ResolutionType = "RULE_MATCHING"|"ML_MATCHING"|string;
  export interface Rule {
    /**
     * A list of MatchingKeys. The MatchingKeys must have been defined in the SchemaMapping. Two records are considered to match according to this rule if all of the MatchingKeys match.
     */
    matchingKeys: RuleMatchingKeysList;
    /**
     * A name for the matching rule.
     */
    ruleName: RuleRuleNameString;
  }
  export interface RuleBasedProperties {
    /**
     * The comparison type. You can either choose ONE_TO_ONE or MANY_TO_MANY as the AttributeMatchingModel. When choosing MANY_TO_MANY, the system can match attributes across the sub-types of an attribute type. For example, if the value of the Email field of Profile A and the value of BusinessEmail field of Profile B matches, the two profiles are matched on the Email type. When choosing ONE_TO_ONE ,the system can only match if the sub-types are exact matches. For example, only when the value of the Email field of Profile A and the value of the Email field of Profile B matches, the two profiles are matched on the Email type.
     */
    attributeMatchingModel: AttributeMatchingModel;
    /**
     * A list of Rule objects, each of which have fields RuleName and MatchingKeys.
     */
    rules: RuleBasedPropertiesRulesList;
  }
  export type RuleBasedPropertiesRulesList = Rule[];
  export type RuleMatchingKeysList = AttributeName[];
  export type RuleRuleNameString = string;
  export type S3Path = string;
  export type SchemaAttributeType = "NAME"|"NAME_FIRST"|"NAME_MIDDLE"|"NAME_LAST"|"ADDRESS"|"ADDRESS_STREET1"|"ADDRESS_STREET2"|"ADDRESS_STREET3"|"ADDRESS_CITY"|"ADDRESS_STATE"|"ADDRESS_COUNTRY"|"ADDRESS_POSTALCODE"|"PHONE"|"PHONE_NUMBER"|"PHONE_COUNTRYCODE"|"EMAIL_ADDRESS"|"UNIQUE_ID"|"DATE"|"STRING"|string;
  export interface SchemaInputAttribute {
    /**
     * A string containing the field name.
     */
    fieldName: AttributeName;
    /**
     * Instruct Entity Resolution to combine several columns into a unified column with the identical attribute type. For example, when working with columns such as first_name, middle_name, and last_name, assigning them a common GroupName will prompt Entity Resolution to concatenate them into a single value.
     */
    groupName?: AttributeName;
    /**
     * A key that allows grouping of multiple input attributes into a unified matching group. For example, let's consider a scenario where the source table contains various addresses, such as business_address and shipping_address. By assigning the MatchKey Address to both attributes, Entity Resolution will match records across these fields to create a consolidated matching group. If no MatchKey is specified for a column, it won't be utilized for matching purposes but will still be included in the output table.
     */
    matchKey?: AttributeName;
    /**
     * The type of the attribute, selected from a list of values.
     */
    type: SchemaAttributeType;
  }
  export type SchemaInputAttributes = SchemaInputAttribute[];
  export type SchemaMappingArn = string;
  export type SchemaMappingList = SchemaMappingSummary[];
  export interface SchemaMappingSummary {
    /**
     * The timestamp of when the SchemaMapping was created.
     */
    createdAt: Timestamp;
    /**
     * The ARN (Amazon Resource Name) that Entity Resolution generated for the SchemaMapping.
     */
    schemaArn: SchemaMappingArn;
    /**
     * The name of the schema.
     */
    schemaName: EntityName;
    /**
     * The timestamp of when the SchemaMapping was last updated.
     */
    updatedAt: Timestamp;
  }
  export interface StartMatchingJobInput {
    /**
     * The name of the matching job to be retrieved.
     */
    workflowName: EntityName;
  }
  export interface StartMatchingJobOutput {
    /**
     * The ID of the job.
     */
    jobId: JobId;
  }
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceInput {
    /**
     * The ARN of the resource for which you want to view tags.
     */
    resourceArn: VeniceGlobalArn;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags: TagMap;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceInput {
    /**
     * The ARN of the resource for which you want to untag.
     */
    resourceArn: VeniceGlobalArn;
    /**
     * The list of tag keys to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateMatchingWorkflowInput {
    /**
     * A description of the workflow.
     */
    description?: Description;
    /**
     * An object which defines an incremental run type and has only incrementalRunType as a field.
     */
    incrementalRunConfig?: IncrementalRunConfig;
    /**
     * A list of InputSource objects, which have the fields InputSourceARN and SchemaName.
     */
    inputSourceConfig: InputSourceConfig;
    /**
     * A list of OutputSource objects, each of which contains fields OutputS3Path, ApplyNormalization, and Output.
     */
    outputSourceConfig: OutputSourceConfig;
    /**
     * An object which defines the resolutionType and the ruleBasedProperties.
     */
    resolutionTechniques: ResolutionTechniques;
    /**
     * The Amazon Resource Name (ARN) of the IAM role. Entity Resolution assumes this role to create resources on your behalf as part of workflow execution.
     */
    roleArn: String;
    /**
     * The name of the workflow to be retrieved.
     */
    workflowName: EntityName;
  }
  export interface UpdateMatchingWorkflowOutput {
    /**
     * A description of the workflow.
     */
    description?: Description;
    /**
     * An object which defines an incremental run type and has only incrementalRunType as a field.
     */
    incrementalRunConfig?: IncrementalRunConfig;
    /**
     * A list of InputSource objects, which have the fields InputSourceARN and SchemaName.
     */
    inputSourceConfig: InputSourceConfig;
    /**
     * A list of OutputSource objects, each of which contains fields OutputS3Path, ApplyNormalization, and Output.
     */
    outputSourceConfig: OutputSourceConfig;
    /**
     * An object which defines the resolutionType and the ruleBasedProperties 
     */
    resolutionTechniques: ResolutionTechniques;
    /**
     * The Amazon Resource Name (ARN) of the IAM role. Entity Resolution assumes this role to create resources on your behalf as part of workflow execution.
     */
    roleArn: String;
    /**
     * The name of the workflow.
     */
    workflowName: EntityName;
  }
  export type VeniceGlobalArn = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the EntityResolution client.
   */
  export import Types = EntityResolution;
}
export = EntityResolution;
