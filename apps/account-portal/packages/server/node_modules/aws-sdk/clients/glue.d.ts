import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Glue extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Glue.Types.ClientConfiguration)
  config: Config & Glue.Types.ClientConfiguration;
  /**
   * Creates one or more partitions in a batch operation.
   */
  batchCreatePartition(params: Glue.Types.BatchCreatePartitionRequest, callback?: (err: AWSError, data: Glue.Types.BatchCreatePartitionResponse) => void): Request<Glue.Types.BatchCreatePartitionResponse, AWSError>;
  /**
   * Creates one or more partitions in a batch operation.
   */
  batchCreatePartition(callback?: (err: AWSError, data: Glue.Types.BatchCreatePartitionResponse) => void): Request<Glue.Types.BatchCreatePartitionResponse, AWSError>;
  /**
   * Deletes a list of connection definitions from the Data Catalog.
   */
  batchDeleteConnection(params: Glue.Types.BatchDeleteConnectionRequest, callback?: (err: AWSError, data: Glue.Types.BatchDeleteConnectionResponse) => void): Request<Glue.Types.BatchDeleteConnectionResponse, AWSError>;
  /**
   * Deletes a list of connection definitions from the Data Catalog.
   */
  batchDeleteConnection(callback?: (err: AWSError, data: Glue.Types.BatchDeleteConnectionResponse) => void): Request<Glue.Types.BatchDeleteConnectionResponse, AWSError>;
  /**
   * Deletes one or more partitions in a batch operation.
   */
  batchDeletePartition(params: Glue.Types.BatchDeletePartitionRequest, callback?: (err: AWSError, data: Glue.Types.BatchDeletePartitionResponse) => void): Request<Glue.Types.BatchDeletePartitionResponse, AWSError>;
  /**
   * Deletes one or more partitions in a batch operation.
   */
  batchDeletePartition(callback?: (err: AWSError, data: Glue.Types.BatchDeletePartitionResponse) => void): Request<Glue.Types.BatchDeletePartitionResponse, AWSError>;
  /**
   * Deletes multiple tables at once.  After completing this operation, you no longer have access to the table versions and partitions that belong to the deleted table. Glue deletes these "orphaned" resources asynchronously in a timely manner, at the discretion of the service. To ensure the immediate deletion of all related resources, before calling BatchDeleteTable, use DeleteTableVersion or BatchDeleteTableVersion, and DeletePartition or BatchDeletePartition, to delete any resources that belong to the table. 
   */
  batchDeleteTable(params: Glue.Types.BatchDeleteTableRequest, callback?: (err: AWSError, data: Glue.Types.BatchDeleteTableResponse) => void): Request<Glue.Types.BatchDeleteTableResponse, AWSError>;
  /**
   * Deletes multiple tables at once.  After completing this operation, you no longer have access to the table versions and partitions that belong to the deleted table. Glue deletes these "orphaned" resources asynchronously in a timely manner, at the discretion of the service. To ensure the immediate deletion of all related resources, before calling BatchDeleteTable, use DeleteTableVersion or BatchDeleteTableVersion, and DeletePartition or BatchDeletePartition, to delete any resources that belong to the table. 
   */
  batchDeleteTable(callback?: (err: AWSError, data: Glue.Types.BatchDeleteTableResponse) => void): Request<Glue.Types.BatchDeleteTableResponse, AWSError>;
  /**
   * Deletes a specified batch of versions of a table.
   */
  batchDeleteTableVersion(params: Glue.Types.BatchDeleteTableVersionRequest, callback?: (err: AWSError, data: Glue.Types.BatchDeleteTableVersionResponse) => void): Request<Glue.Types.BatchDeleteTableVersionResponse, AWSError>;
  /**
   * Deletes a specified batch of versions of a table.
   */
  batchDeleteTableVersion(callback?: (err: AWSError, data: Glue.Types.BatchDeleteTableVersionResponse) => void): Request<Glue.Types.BatchDeleteTableVersionResponse, AWSError>;
  /**
   * Retrieves information about a list of blueprints.
   */
  batchGetBlueprints(params: Glue.Types.BatchGetBlueprintsRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetBlueprintsResponse) => void): Request<Glue.Types.BatchGetBlueprintsResponse, AWSError>;
  /**
   * Retrieves information about a list of blueprints.
   */
  batchGetBlueprints(callback?: (err: AWSError, data: Glue.Types.BatchGetBlueprintsResponse) => void): Request<Glue.Types.BatchGetBlueprintsResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of crawler names. After calling the ListCrawlers operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
   */
  batchGetCrawlers(params: Glue.Types.BatchGetCrawlersRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetCrawlersResponse) => void): Request<Glue.Types.BatchGetCrawlersResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of crawler names. After calling the ListCrawlers operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
   */
  batchGetCrawlers(callback?: (err: AWSError, data: Glue.Types.BatchGetCrawlersResponse) => void): Request<Glue.Types.BatchGetCrawlersResponse, AWSError>;
  /**
   * Retrieves the details for the custom patterns specified by a list of names.
   */
  batchGetCustomEntityTypes(params: Glue.Types.BatchGetCustomEntityTypesRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetCustomEntityTypesResponse) => void): Request<Glue.Types.BatchGetCustomEntityTypesResponse, AWSError>;
  /**
   * Retrieves the details for the custom patterns specified by a list of names.
   */
  batchGetCustomEntityTypes(callback?: (err: AWSError, data: Glue.Types.BatchGetCustomEntityTypesResponse) => void): Request<Glue.Types.BatchGetCustomEntityTypesResponse, AWSError>;
  /**
   * Retrieves a list of data quality results for the specified result IDs.
   */
  batchGetDataQualityResult(params: Glue.Types.BatchGetDataQualityResultRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetDataQualityResultResponse) => void): Request<Glue.Types.BatchGetDataQualityResultResponse, AWSError>;
  /**
   * Retrieves a list of data quality results for the specified result IDs.
   */
  batchGetDataQualityResult(callback?: (err: AWSError, data: Glue.Types.BatchGetDataQualityResultResponse) => void): Request<Glue.Types.BatchGetDataQualityResultResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of development endpoint names. After calling the ListDevEndpoints operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
   */
  batchGetDevEndpoints(params: Glue.Types.BatchGetDevEndpointsRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetDevEndpointsResponse) => void): Request<Glue.Types.BatchGetDevEndpointsResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of development endpoint names. After calling the ListDevEndpoints operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
   */
  batchGetDevEndpoints(callback?: (err: AWSError, data: Glue.Types.BatchGetDevEndpointsResponse) => void): Request<Glue.Types.BatchGetDevEndpointsResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of job names. After calling the ListJobs operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags. 
   */
  batchGetJobs(params: Glue.Types.BatchGetJobsRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetJobsResponse) => void): Request<Glue.Types.BatchGetJobsResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of job names. After calling the ListJobs operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags. 
   */
  batchGetJobs(callback?: (err: AWSError, data: Glue.Types.BatchGetJobsResponse) => void): Request<Glue.Types.BatchGetJobsResponse, AWSError>;
  /**
   * Retrieves partitions in a batch request.
   */
  batchGetPartition(params: Glue.Types.BatchGetPartitionRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetPartitionResponse) => void): Request<Glue.Types.BatchGetPartitionResponse, AWSError>;
  /**
   * Retrieves partitions in a batch request.
   */
  batchGetPartition(callback?: (err: AWSError, data: Glue.Types.BatchGetPartitionResponse) => void): Request<Glue.Types.BatchGetPartitionResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of trigger names. After calling the ListTriggers operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
   */
  batchGetTriggers(params: Glue.Types.BatchGetTriggersRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetTriggersResponse) => void): Request<Glue.Types.BatchGetTriggersResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of trigger names. After calling the ListTriggers operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
   */
  batchGetTriggers(callback?: (err: AWSError, data: Glue.Types.BatchGetTriggersResponse) => void): Request<Glue.Types.BatchGetTriggersResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of workflow names. After calling the ListWorkflows operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
   */
  batchGetWorkflows(params: Glue.Types.BatchGetWorkflowsRequest, callback?: (err: AWSError, data: Glue.Types.BatchGetWorkflowsResponse) => void): Request<Glue.Types.BatchGetWorkflowsResponse, AWSError>;
  /**
   * Returns a list of resource metadata for a given list of workflow names. After calling the ListWorkflows operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
   */
  batchGetWorkflows(callback?: (err: AWSError, data: Glue.Types.BatchGetWorkflowsResponse) => void): Request<Glue.Types.BatchGetWorkflowsResponse, AWSError>;
  /**
   * Stops one or more job runs for a specified job definition.
   */
  batchStopJobRun(params: Glue.Types.BatchStopJobRunRequest, callback?: (err: AWSError, data: Glue.Types.BatchStopJobRunResponse) => void): Request<Glue.Types.BatchStopJobRunResponse, AWSError>;
  /**
   * Stops one or more job runs for a specified job definition.
   */
  batchStopJobRun(callback?: (err: AWSError, data: Glue.Types.BatchStopJobRunResponse) => void): Request<Glue.Types.BatchStopJobRunResponse, AWSError>;
  /**
   * Updates one or more partitions in a batch operation.
   */
  batchUpdatePartition(params: Glue.Types.BatchUpdatePartitionRequest, callback?: (err: AWSError, data: Glue.Types.BatchUpdatePartitionResponse) => void): Request<Glue.Types.BatchUpdatePartitionResponse, AWSError>;
  /**
   * Updates one or more partitions in a batch operation.
   */
  batchUpdatePartition(callback?: (err: AWSError, data: Glue.Types.BatchUpdatePartitionResponse) => void): Request<Glue.Types.BatchUpdatePartitionResponse, AWSError>;
  /**
   * Cancels the specified recommendation run that was being used to generate rules.
   */
  cancelDataQualityRuleRecommendationRun(params: Glue.Types.CancelDataQualityRuleRecommendationRunRequest, callback?: (err: AWSError, data: Glue.Types.CancelDataQualityRuleRecommendationRunResponse) => void): Request<Glue.Types.CancelDataQualityRuleRecommendationRunResponse, AWSError>;
  /**
   * Cancels the specified recommendation run that was being used to generate rules.
   */
  cancelDataQualityRuleRecommendationRun(callback?: (err: AWSError, data: Glue.Types.CancelDataQualityRuleRecommendationRunResponse) => void): Request<Glue.Types.CancelDataQualityRuleRecommendationRunResponse, AWSError>;
  /**
   * Cancels a run where a ruleset is being evaluated against a data source.
   */
  cancelDataQualityRulesetEvaluationRun(params: Glue.Types.CancelDataQualityRulesetEvaluationRunRequest, callback?: (err: AWSError, data: Glue.Types.CancelDataQualityRulesetEvaluationRunResponse) => void): Request<Glue.Types.CancelDataQualityRulesetEvaluationRunResponse, AWSError>;
  /**
   * Cancels a run where a ruleset is being evaluated against a data source.
   */
  cancelDataQualityRulesetEvaluationRun(callback?: (err: AWSError, data: Glue.Types.CancelDataQualityRulesetEvaluationRunResponse) => void): Request<Glue.Types.CancelDataQualityRulesetEvaluationRunResponse, AWSError>;
  /**
   * Cancels (stops) a task run. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can cancel a machine learning task run at any time by calling CancelMLTaskRun with a task run's parent transform's TransformID and the task run's TaskRunId. 
   */
  cancelMLTaskRun(params: Glue.Types.CancelMLTaskRunRequest, callback?: (err: AWSError, data: Glue.Types.CancelMLTaskRunResponse) => void): Request<Glue.Types.CancelMLTaskRunResponse, AWSError>;
  /**
   * Cancels (stops) a task run. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can cancel a machine learning task run at any time by calling CancelMLTaskRun with a task run's parent transform's TransformID and the task run's TaskRunId. 
   */
  cancelMLTaskRun(callback?: (err: AWSError, data: Glue.Types.CancelMLTaskRunResponse) => void): Request<Glue.Types.CancelMLTaskRunResponse, AWSError>;
  /**
   * Cancels the statement.
   */
  cancelStatement(params: Glue.Types.CancelStatementRequest, callback?: (err: AWSError, data: Glue.Types.CancelStatementResponse) => void): Request<Glue.Types.CancelStatementResponse, AWSError>;
  /**
   * Cancels the statement.
   */
  cancelStatement(callback?: (err: AWSError, data: Glue.Types.CancelStatementResponse) => void): Request<Glue.Types.CancelStatementResponse, AWSError>;
  /**
   * Validates the supplied schema. This call has no side effects, it simply validates using the supplied schema using DataFormat as the format. Since it does not take a schema set name, no compatibility checks are performed.
   */
  checkSchemaVersionValidity(params: Glue.Types.CheckSchemaVersionValidityInput, callback?: (err: AWSError, data: Glue.Types.CheckSchemaVersionValidityResponse) => void): Request<Glue.Types.CheckSchemaVersionValidityResponse, AWSError>;
  /**
   * Validates the supplied schema. This call has no side effects, it simply validates using the supplied schema using DataFormat as the format. Since it does not take a schema set name, no compatibility checks are performed.
   */
  checkSchemaVersionValidity(callback?: (err: AWSError, data: Glue.Types.CheckSchemaVersionValidityResponse) => void): Request<Glue.Types.CheckSchemaVersionValidityResponse, AWSError>;
  /**
   * Registers a blueprint with Glue.
   */
  createBlueprint(params: Glue.Types.CreateBlueprintRequest, callback?: (err: AWSError, data: Glue.Types.CreateBlueprintResponse) => void): Request<Glue.Types.CreateBlueprintResponse, AWSError>;
  /**
   * Registers a blueprint with Glue.
   */
  createBlueprint(callback?: (err: AWSError, data: Glue.Types.CreateBlueprintResponse) => void): Request<Glue.Types.CreateBlueprintResponse, AWSError>;
  /**
   * Creates a classifier in the user's account. This can be a GrokClassifier, an XMLClassifier, a JsonClassifier, or a CsvClassifier, depending on which field of the request is present.
   */
  createClassifier(params: Glue.Types.CreateClassifierRequest, callback?: (err: AWSError, data: Glue.Types.CreateClassifierResponse) => void): Request<Glue.Types.CreateClassifierResponse, AWSError>;
  /**
   * Creates a classifier in the user's account. This can be a GrokClassifier, an XMLClassifier, a JsonClassifier, or a CsvClassifier, depending on which field of the request is present.
   */
  createClassifier(callback?: (err: AWSError, data: Glue.Types.CreateClassifierResponse) => void): Request<Glue.Types.CreateClassifierResponse, AWSError>;
  /**
   * Creates a connection definition in the Data Catalog.
   */
  createConnection(params: Glue.Types.CreateConnectionRequest, callback?: (err: AWSError, data: Glue.Types.CreateConnectionResponse) => void): Request<Glue.Types.CreateConnectionResponse, AWSError>;
  /**
   * Creates a connection definition in the Data Catalog.
   */
  createConnection(callback?: (err: AWSError, data: Glue.Types.CreateConnectionResponse) => void): Request<Glue.Types.CreateConnectionResponse, AWSError>;
  /**
   * Creates a new crawler with specified targets, role, configuration, and optional schedule. At least one crawl target must be specified, in the s3Targets field, the jdbcTargets field, or the DynamoDBTargets field.
   */
  createCrawler(params: Glue.Types.CreateCrawlerRequest, callback?: (err: AWSError, data: Glue.Types.CreateCrawlerResponse) => void): Request<Glue.Types.CreateCrawlerResponse, AWSError>;
  /**
   * Creates a new crawler with specified targets, role, configuration, and optional schedule. At least one crawl target must be specified, in the s3Targets field, the jdbcTargets field, or the DynamoDBTargets field.
   */
  createCrawler(callback?: (err: AWSError, data: Glue.Types.CreateCrawlerResponse) => void): Request<Glue.Types.CreateCrawlerResponse, AWSError>;
  /**
   * Creates a custom pattern that is used to detect sensitive data across the columns and rows of your structured data. Each custom pattern you create specifies a regular expression and an optional list of context words. If no context words are passed only a regular expression is checked.
   */
  createCustomEntityType(params: Glue.Types.CreateCustomEntityTypeRequest, callback?: (err: AWSError, data: Glue.Types.CreateCustomEntityTypeResponse) => void): Request<Glue.Types.CreateCustomEntityTypeResponse, AWSError>;
  /**
   * Creates a custom pattern that is used to detect sensitive data across the columns and rows of your structured data. Each custom pattern you create specifies a regular expression and an optional list of context words. If no context words are passed only a regular expression is checked.
   */
  createCustomEntityType(callback?: (err: AWSError, data: Glue.Types.CreateCustomEntityTypeResponse) => void): Request<Glue.Types.CreateCustomEntityTypeResponse, AWSError>;
  /**
   * Creates a data quality ruleset with DQDL rules applied to a specified Glue table. You create the ruleset using the Data Quality Definition Language (DQDL). For more information, see the Glue developer guide.
   */
  createDataQualityRuleset(params: Glue.Types.CreateDataQualityRulesetRequest, callback?: (err: AWSError, data: Glue.Types.CreateDataQualityRulesetResponse) => void): Request<Glue.Types.CreateDataQualityRulesetResponse, AWSError>;
  /**
   * Creates a data quality ruleset with DQDL rules applied to a specified Glue table. You create the ruleset using the Data Quality Definition Language (DQDL). For more information, see the Glue developer guide.
   */
  createDataQualityRuleset(callback?: (err: AWSError, data: Glue.Types.CreateDataQualityRulesetResponse) => void): Request<Glue.Types.CreateDataQualityRulesetResponse, AWSError>;
  /**
   * Creates a new database in a Data Catalog.
   */
  createDatabase(params: Glue.Types.CreateDatabaseRequest, callback?: (err: AWSError, data: Glue.Types.CreateDatabaseResponse) => void): Request<Glue.Types.CreateDatabaseResponse, AWSError>;
  /**
   * Creates a new database in a Data Catalog.
   */
  createDatabase(callback?: (err: AWSError, data: Glue.Types.CreateDatabaseResponse) => void): Request<Glue.Types.CreateDatabaseResponse, AWSError>;
  /**
   * Creates a new development endpoint.
   */
  createDevEndpoint(params: Glue.Types.CreateDevEndpointRequest, callback?: (err: AWSError, data: Glue.Types.CreateDevEndpointResponse) => void): Request<Glue.Types.CreateDevEndpointResponse, AWSError>;
  /**
   * Creates a new development endpoint.
   */
  createDevEndpoint(callback?: (err: AWSError, data: Glue.Types.CreateDevEndpointResponse) => void): Request<Glue.Types.CreateDevEndpointResponse, AWSError>;
  /**
   * Creates a new job definition.
   */
  createJob(params: Glue.Types.CreateJobRequest, callback?: (err: AWSError, data: Glue.Types.CreateJobResponse) => void): Request<Glue.Types.CreateJobResponse, AWSError>;
  /**
   * Creates a new job definition.
   */
  createJob(callback?: (err: AWSError, data: Glue.Types.CreateJobResponse) => void): Request<Glue.Types.CreateJobResponse, AWSError>;
  /**
   * Creates an Glue machine learning transform. This operation creates the transform and all the necessary parameters to train it. Call this operation as the first step in the process of using a machine learning transform (such as the FindMatches transform) for deduplicating data. You can provide an optional Description, in addition to the parameters that you want to use for your algorithm. You must also specify certain parameters for the tasks that Glue runs on your behalf as part of learning from your data and creating a high-quality machine learning transform. These parameters include Role, and optionally, AllocatedCapacity, Timeout, and MaxRetries. For more information, see Jobs.
   */
  createMLTransform(params: Glue.Types.CreateMLTransformRequest, callback?: (err: AWSError, data: Glue.Types.CreateMLTransformResponse) => void): Request<Glue.Types.CreateMLTransformResponse, AWSError>;
  /**
   * Creates an Glue machine learning transform. This operation creates the transform and all the necessary parameters to train it. Call this operation as the first step in the process of using a machine learning transform (such as the FindMatches transform) for deduplicating data. You can provide an optional Description, in addition to the parameters that you want to use for your algorithm. You must also specify certain parameters for the tasks that Glue runs on your behalf as part of learning from your data and creating a high-quality machine learning transform. These parameters include Role, and optionally, AllocatedCapacity, Timeout, and MaxRetries. For more information, see Jobs.
   */
  createMLTransform(callback?: (err: AWSError, data: Glue.Types.CreateMLTransformResponse) => void): Request<Glue.Types.CreateMLTransformResponse, AWSError>;
  /**
   * Creates a new partition.
   */
  createPartition(params: Glue.Types.CreatePartitionRequest, callback?: (err: AWSError, data: Glue.Types.CreatePartitionResponse) => void): Request<Glue.Types.CreatePartitionResponse, AWSError>;
  /**
   * Creates a new partition.
   */
  createPartition(callback?: (err: AWSError, data: Glue.Types.CreatePartitionResponse) => void): Request<Glue.Types.CreatePartitionResponse, AWSError>;
  /**
   * Creates a specified partition index in an existing table.
   */
  createPartitionIndex(params: Glue.Types.CreatePartitionIndexRequest, callback?: (err: AWSError, data: Glue.Types.CreatePartitionIndexResponse) => void): Request<Glue.Types.CreatePartitionIndexResponse, AWSError>;
  /**
   * Creates a specified partition index in an existing table.
   */
  createPartitionIndex(callback?: (err: AWSError, data: Glue.Types.CreatePartitionIndexResponse) => void): Request<Glue.Types.CreatePartitionIndexResponse, AWSError>;
  /**
   * Creates a new registry which may be used to hold a collection of schemas.
   */
  createRegistry(params: Glue.Types.CreateRegistryInput, callback?: (err: AWSError, data: Glue.Types.CreateRegistryResponse) => void): Request<Glue.Types.CreateRegistryResponse, AWSError>;
  /**
   * Creates a new registry which may be used to hold a collection of schemas.
   */
  createRegistry(callback?: (err: AWSError, data: Glue.Types.CreateRegistryResponse) => void): Request<Glue.Types.CreateRegistryResponse, AWSError>;
  /**
   * Creates a new schema set and registers the schema definition. Returns an error if the schema set already exists without actually registering the version. When the schema set is created, a version checkpoint will be set to the first version. Compatibility mode "DISABLED" restricts any additional schema versions from being added after the first schema version. For all other compatibility modes, validation of compatibility settings will be applied only from the second version onwards when the RegisterSchemaVersion API is used. When this API is called without a RegistryId, this will create an entry for a "default-registry" in the registry database tables, if it is not already present.
   */
  createSchema(params: Glue.Types.CreateSchemaInput, callback?: (err: AWSError, data: Glue.Types.CreateSchemaResponse) => void): Request<Glue.Types.CreateSchemaResponse, AWSError>;
  /**
   * Creates a new schema set and registers the schema definition. Returns an error if the schema set already exists without actually registering the version. When the schema set is created, a version checkpoint will be set to the first version. Compatibility mode "DISABLED" restricts any additional schema versions from being added after the first schema version. For all other compatibility modes, validation of compatibility settings will be applied only from the second version onwards when the RegisterSchemaVersion API is used. When this API is called without a RegistryId, this will create an entry for a "default-registry" in the registry database tables, if it is not already present.
   */
  createSchema(callback?: (err: AWSError, data: Glue.Types.CreateSchemaResponse) => void): Request<Glue.Types.CreateSchemaResponse, AWSError>;
  /**
   * Transforms a directed acyclic graph (DAG) into code.
   */
  createScript(params: Glue.Types.CreateScriptRequest, callback?: (err: AWSError, data: Glue.Types.CreateScriptResponse) => void): Request<Glue.Types.CreateScriptResponse, AWSError>;
  /**
   * Transforms a directed acyclic graph (DAG) into code.
   */
  createScript(callback?: (err: AWSError, data: Glue.Types.CreateScriptResponse) => void): Request<Glue.Types.CreateScriptResponse, AWSError>;
  /**
   * Creates a new security configuration. A security configuration is a set of security properties that can be used by Glue. You can use a security configuration to encrypt data at rest. For information about using security configurations in Glue, see Encrypting Data Written by Crawlers, Jobs, and Development Endpoints.
   */
  createSecurityConfiguration(params: Glue.Types.CreateSecurityConfigurationRequest, callback?: (err: AWSError, data: Glue.Types.CreateSecurityConfigurationResponse) => void): Request<Glue.Types.CreateSecurityConfigurationResponse, AWSError>;
  /**
   * Creates a new security configuration. A security configuration is a set of security properties that can be used by Glue. You can use a security configuration to encrypt data at rest. For information about using security configurations in Glue, see Encrypting Data Written by Crawlers, Jobs, and Development Endpoints.
   */
  createSecurityConfiguration(callback?: (err: AWSError, data: Glue.Types.CreateSecurityConfigurationResponse) => void): Request<Glue.Types.CreateSecurityConfigurationResponse, AWSError>;
  /**
   * Creates a new session.
   */
  createSession(params: Glue.Types.CreateSessionRequest, callback?: (err: AWSError, data: Glue.Types.CreateSessionResponse) => void): Request<Glue.Types.CreateSessionResponse, AWSError>;
  /**
   * Creates a new session.
   */
  createSession(callback?: (err: AWSError, data: Glue.Types.CreateSessionResponse) => void): Request<Glue.Types.CreateSessionResponse, AWSError>;
  /**
   * Creates a new table definition in the Data Catalog.
   */
  createTable(params: Glue.Types.CreateTableRequest, callback?: (err: AWSError, data: Glue.Types.CreateTableResponse) => void): Request<Glue.Types.CreateTableResponse, AWSError>;
  /**
   * Creates a new table definition in the Data Catalog.
   */
  createTable(callback?: (err: AWSError, data: Glue.Types.CreateTableResponse) => void): Request<Glue.Types.CreateTableResponse, AWSError>;
  /**
   * Creates a new trigger.
   */
  createTrigger(params: Glue.Types.CreateTriggerRequest, callback?: (err: AWSError, data: Glue.Types.CreateTriggerResponse) => void): Request<Glue.Types.CreateTriggerResponse, AWSError>;
  /**
   * Creates a new trigger.
   */
  createTrigger(callback?: (err: AWSError, data: Glue.Types.CreateTriggerResponse) => void): Request<Glue.Types.CreateTriggerResponse, AWSError>;
  /**
   * Creates a new function definition in the Data Catalog.
   */
  createUserDefinedFunction(params: Glue.Types.CreateUserDefinedFunctionRequest, callback?: (err: AWSError, data: Glue.Types.CreateUserDefinedFunctionResponse) => void): Request<Glue.Types.CreateUserDefinedFunctionResponse, AWSError>;
  /**
   * Creates a new function definition in the Data Catalog.
   */
  createUserDefinedFunction(callback?: (err: AWSError, data: Glue.Types.CreateUserDefinedFunctionResponse) => void): Request<Glue.Types.CreateUserDefinedFunctionResponse, AWSError>;
  /**
   * Creates a new workflow.
   */
  createWorkflow(params: Glue.Types.CreateWorkflowRequest, callback?: (err: AWSError, data: Glue.Types.CreateWorkflowResponse) => void): Request<Glue.Types.CreateWorkflowResponse, AWSError>;
  /**
   * Creates a new workflow.
   */
  createWorkflow(callback?: (err: AWSError, data: Glue.Types.CreateWorkflowResponse) => void): Request<Glue.Types.CreateWorkflowResponse, AWSError>;
  /**
   * Deletes an existing blueprint.
   */
  deleteBlueprint(params: Glue.Types.DeleteBlueprintRequest, callback?: (err: AWSError, data: Glue.Types.DeleteBlueprintResponse) => void): Request<Glue.Types.DeleteBlueprintResponse, AWSError>;
  /**
   * Deletes an existing blueprint.
   */
  deleteBlueprint(callback?: (err: AWSError, data: Glue.Types.DeleteBlueprintResponse) => void): Request<Glue.Types.DeleteBlueprintResponse, AWSError>;
  /**
   * Removes a classifier from the Data Catalog.
   */
  deleteClassifier(params: Glue.Types.DeleteClassifierRequest, callback?: (err: AWSError, data: Glue.Types.DeleteClassifierResponse) => void): Request<Glue.Types.DeleteClassifierResponse, AWSError>;
  /**
   * Removes a classifier from the Data Catalog.
   */
  deleteClassifier(callback?: (err: AWSError, data: Glue.Types.DeleteClassifierResponse) => void): Request<Glue.Types.DeleteClassifierResponse, AWSError>;
  /**
   * Delete the partition column statistics of a column. The Identity and Access Management (IAM) permission required for this operation is DeletePartition.
   */
  deleteColumnStatisticsForPartition(params: Glue.Types.DeleteColumnStatisticsForPartitionRequest, callback?: (err: AWSError, data: Glue.Types.DeleteColumnStatisticsForPartitionResponse) => void): Request<Glue.Types.DeleteColumnStatisticsForPartitionResponse, AWSError>;
  /**
   * Delete the partition column statistics of a column. The Identity and Access Management (IAM) permission required for this operation is DeletePartition.
   */
  deleteColumnStatisticsForPartition(callback?: (err: AWSError, data: Glue.Types.DeleteColumnStatisticsForPartitionResponse) => void): Request<Glue.Types.DeleteColumnStatisticsForPartitionResponse, AWSError>;
  /**
   * Retrieves table statistics of columns. The Identity and Access Management (IAM) permission required for this operation is DeleteTable.
   */
  deleteColumnStatisticsForTable(params: Glue.Types.DeleteColumnStatisticsForTableRequest, callback?: (err: AWSError, data: Glue.Types.DeleteColumnStatisticsForTableResponse) => void): Request<Glue.Types.DeleteColumnStatisticsForTableResponse, AWSError>;
  /**
   * Retrieves table statistics of columns. The Identity and Access Management (IAM) permission required for this operation is DeleteTable.
   */
  deleteColumnStatisticsForTable(callback?: (err: AWSError, data: Glue.Types.DeleteColumnStatisticsForTableResponse) => void): Request<Glue.Types.DeleteColumnStatisticsForTableResponse, AWSError>;
  /**
   * Deletes a connection from the Data Catalog.
   */
  deleteConnection(params: Glue.Types.DeleteConnectionRequest, callback?: (err: AWSError, data: Glue.Types.DeleteConnectionResponse) => void): Request<Glue.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Deletes a connection from the Data Catalog.
   */
  deleteConnection(callback?: (err: AWSError, data: Glue.Types.DeleteConnectionResponse) => void): Request<Glue.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Removes a specified crawler from the Glue Data Catalog, unless the crawler state is RUNNING.
   */
  deleteCrawler(params: Glue.Types.DeleteCrawlerRequest, callback?: (err: AWSError, data: Glue.Types.DeleteCrawlerResponse) => void): Request<Glue.Types.DeleteCrawlerResponse, AWSError>;
  /**
   * Removes a specified crawler from the Glue Data Catalog, unless the crawler state is RUNNING.
   */
  deleteCrawler(callback?: (err: AWSError, data: Glue.Types.DeleteCrawlerResponse) => void): Request<Glue.Types.DeleteCrawlerResponse, AWSError>;
  /**
   * Deletes a custom pattern by specifying its name.
   */
  deleteCustomEntityType(params: Glue.Types.DeleteCustomEntityTypeRequest, callback?: (err: AWSError, data: Glue.Types.DeleteCustomEntityTypeResponse) => void): Request<Glue.Types.DeleteCustomEntityTypeResponse, AWSError>;
  /**
   * Deletes a custom pattern by specifying its name.
   */
  deleteCustomEntityType(callback?: (err: AWSError, data: Glue.Types.DeleteCustomEntityTypeResponse) => void): Request<Glue.Types.DeleteCustomEntityTypeResponse, AWSError>;
  /**
   * Deletes a data quality ruleset.
   */
  deleteDataQualityRuleset(params: Glue.Types.DeleteDataQualityRulesetRequest, callback?: (err: AWSError, data: Glue.Types.DeleteDataQualityRulesetResponse) => void): Request<Glue.Types.DeleteDataQualityRulesetResponse, AWSError>;
  /**
   * Deletes a data quality ruleset.
   */
  deleteDataQualityRuleset(callback?: (err: AWSError, data: Glue.Types.DeleteDataQualityRulesetResponse) => void): Request<Glue.Types.DeleteDataQualityRulesetResponse, AWSError>;
  /**
   * Removes a specified database from a Data Catalog.  After completing this operation, you no longer have access to the tables (and all table versions and partitions that might belong to the tables) and the user-defined functions in the deleted database. Glue deletes these "orphaned" resources asynchronously in a timely manner, at the discretion of the service. To ensure the immediate deletion of all related resources, before calling DeleteDatabase, use DeleteTableVersion or BatchDeleteTableVersion, DeletePartition or BatchDeletePartition, DeleteUserDefinedFunction, and DeleteTable or BatchDeleteTable, to delete any resources that belong to the database. 
   */
  deleteDatabase(params: Glue.Types.DeleteDatabaseRequest, callback?: (err: AWSError, data: Glue.Types.DeleteDatabaseResponse) => void): Request<Glue.Types.DeleteDatabaseResponse, AWSError>;
  /**
   * Removes a specified database from a Data Catalog.  After completing this operation, you no longer have access to the tables (and all table versions and partitions that might belong to the tables) and the user-defined functions in the deleted database. Glue deletes these "orphaned" resources asynchronously in a timely manner, at the discretion of the service. To ensure the immediate deletion of all related resources, before calling DeleteDatabase, use DeleteTableVersion or BatchDeleteTableVersion, DeletePartition or BatchDeletePartition, DeleteUserDefinedFunction, and DeleteTable or BatchDeleteTable, to delete any resources that belong to the database. 
   */
  deleteDatabase(callback?: (err: AWSError, data: Glue.Types.DeleteDatabaseResponse) => void): Request<Glue.Types.DeleteDatabaseResponse, AWSError>;
  /**
   * Deletes a specified development endpoint.
   */
  deleteDevEndpoint(params: Glue.Types.DeleteDevEndpointRequest, callback?: (err: AWSError, data: Glue.Types.DeleteDevEndpointResponse) => void): Request<Glue.Types.DeleteDevEndpointResponse, AWSError>;
  /**
   * Deletes a specified development endpoint.
   */
  deleteDevEndpoint(callback?: (err: AWSError, data: Glue.Types.DeleteDevEndpointResponse) => void): Request<Glue.Types.DeleteDevEndpointResponse, AWSError>;
  /**
   * Deletes a specified job definition. If the job definition is not found, no exception is thrown.
   */
  deleteJob(params: Glue.Types.DeleteJobRequest, callback?: (err: AWSError, data: Glue.Types.DeleteJobResponse) => void): Request<Glue.Types.DeleteJobResponse, AWSError>;
  /**
   * Deletes a specified job definition. If the job definition is not found, no exception is thrown.
   */
  deleteJob(callback?: (err: AWSError, data: Glue.Types.DeleteJobResponse) => void): Request<Glue.Types.DeleteJobResponse, AWSError>;
  /**
   * Deletes an Glue machine learning transform. Machine learning transforms are a special type of transform that use machine learning to learn the details of the transformation to be performed by learning from examples provided by humans. These transformations are then saved by Glue. If you no longer need a transform, you can delete it by calling DeleteMLTransforms. However, any Glue jobs that still reference the deleted transform will no longer succeed.
   */
  deleteMLTransform(params: Glue.Types.DeleteMLTransformRequest, callback?: (err: AWSError, data: Glue.Types.DeleteMLTransformResponse) => void): Request<Glue.Types.DeleteMLTransformResponse, AWSError>;
  /**
   * Deletes an Glue machine learning transform. Machine learning transforms are a special type of transform that use machine learning to learn the details of the transformation to be performed by learning from examples provided by humans. These transformations are then saved by Glue. If you no longer need a transform, you can delete it by calling DeleteMLTransforms. However, any Glue jobs that still reference the deleted transform will no longer succeed.
   */
  deleteMLTransform(callback?: (err: AWSError, data: Glue.Types.DeleteMLTransformResponse) => void): Request<Glue.Types.DeleteMLTransformResponse, AWSError>;
  /**
   * Deletes a specified partition.
   */
  deletePartition(params: Glue.Types.DeletePartitionRequest, callback?: (err: AWSError, data: Glue.Types.DeletePartitionResponse) => void): Request<Glue.Types.DeletePartitionResponse, AWSError>;
  /**
   * Deletes a specified partition.
   */
  deletePartition(callback?: (err: AWSError, data: Glue.Types.DeletePartitionResponse) => void): Request<Glue.Types.DeletePartitionResponse, AWSError>;
  /**
   * Deletes a specified partition index from an existing table.
   */
  deletePartitionIndex(params: Glue.Types.DeletePartitionIndexRequest, callback?: (err: AWSError, data: Glue.Types.DeletePartitionIndexResponse) => void): Request<Glue.Types.DeletePartitionIndexResponse, AWSError>;
  /**
   * Deletes a specified partition index from an existing table.
   */
  deletePartitionIndex(callback?: (err: AWSError, data: Glue.Types.DeletePartitionIndexResponse) => void): Request<Glue.Types.DeletePartitionIndexResponse, AWSError>;
  /**
   * Delete the entire registry including schema and all of its versions. To get the status of the delete operation, you can call the GetRegistry API after the asynchronous call. Deleting a registry will deactivate all online operations for the registry such as the UpdateRegistry, CreateSchema, UpdateSchema, and RegisterSchemaVersion APIs. 
   */
  deleteRegistry(params: Glue.Types.DeleteRegistryInput, callback?: (err: AWSError, data: Glue.Types.DeleteRegistryResponse) => void): Request<Glue.Types.DeleteRegistryResponse, AWSError>;
  /**
   * Delete the entire registry including schema and all of its versions. To get the status of the delete operation, you can call the GetRegistry API after the asynchronous call. Deleting a registry will deactivate all online operations for the registry such as the UpdateRegistry, CreateSchema, UpdateSchema, and RegisterSchemaVersion APIs. 
   */
  deleteRegistry(callback?: (err: AWSError, data: Glue.Types.DeleteRegistryResponse) => void): Request<Glue.Types.DeleteRegistryResponse, AWSError>;
  /**
   * Deletes a specified policy.
   */
  deleteResourcePolicy(params: Glue.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: Glue.Types.DeleteResourcePolicyResponse) => void): Request<Glue.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a specified policy.
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: Glue.Types.DeleteResourcePolicyResponse) => void): Request<Glue.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes the entire schema set, including the schema set and all of its versions. To get the status of the delete operation, you can call GetSchema API after the asynchronous call. Deleting a registry will deactivate all online operations for the schema, such as the GetSchemaByDefinition, and RegisterSchemaVersion APIs.
   */
  deleteSchema(params: Glue.Types.DeleteSchemaInput, callback?: (err: AWSError, data: Glue.Types.DeleteSchemaResponse) => void): Request<Glue.Types.DeleteSchemaResponse, AWSError>;
  /**
   * Deletes the entire schema set, including the schema set and all of its versions. To get the status of the delete operation, you can call GetSchema API after the asynchronous call. Deleting a registry will deactivate all online operations for the schema, such as the GetSchemaByDefinition, and RegisterSchemaVersion APIs.
   */
  deleteSchema(callback?: (err: AWSError, data: Glue.Types.DeleteSchemaResponse) => void): Request<Glue.Types.DeleteSchemaResponse, AWSError>;
  /**
   * Remove versions from the specified schema. A version number or range may be supplied. If the compatibility mode forbids deleting of a version that is necessary, such as BACKWARDS_FULL, an error is returned. Calling the GetSchemaVersions API after this call will list the status of the deleted versions. When the range of version numbers contain check pointed version, the API will return a 409 conflict and will not proceed with the deletion. You have to remove the checkpoint first using the DeleteSchemaCheckpoint API before using this API. You cannot use the DeleteSchemaVersions API to delete the first schema version in the schema set. The first schema version can only be deleted by the DeleteSchema API. This operation will also delete the attached SchemaVersionMetadata under the schema versions. Hard deletes will be enforced on the database. If the compatibility mode forbids deleting of a version that is necessary, such as BACKWARDS_FULL, an error is returned.
   */
  deleteSchemaVersions(params: Glue.Types.DeleteSchemaVersionsInput, callback?: (err: AWSError, data: Glue.Types.DeleteSchemaVersionsResponse) => void): Request<Glue.Types.DeleteSchemaVersionsResponse, AWSError>;
  /**
   * Remove versions from the specified schema. A version number or range may be supplied. If the compatibility mode forbids deleting of a version that is necessary, such as BACKWARDS_FULL, an error is returned. Calling the GetSchemaVersions API after this call will list the status of the deleted versions. When the range of version numbers contain check pointed version, the API will return a 409 conflict and will not proceed with the deletion. You have to remove the checkpoint first using the DeleteSchemaCheckpoint API before using this API. You cannot use the DeleteSchemaVersions API to delete the first schema version in the schema set. The first schema version can only be deleted by the DeleteSchema API. This operation will also delete the attached SchemaVersionMetadata under the schema versions. Hard deletes will be enforced on the database. If the compatibility mode forbids deleting of a version that is necessary, such as BACKWARDS_FULL, an error is returned.
   */
  deleteSchemaVersions(callback?: (err: AWSError, data: Glue.Types.DeleteSchemaVersionsResponse) => void): Request<Glue.Types.DeleteSchemaVersionsResponse, AWSError>;
  /**
   * Deletes a specified security configuration.
   */
  deleteSecurityConfiguration(params: Glue.Types.DeleteSecurityConfigurationRequest, callback?: (err: AWSError, data: Glue.Types.DeleteSecurityConfigurationResponse) => void): Request<Glue.Types.DeleteSecurityConfigurationResponse, AWSError>;
  /**
   * Deletes a specified security configuration.
   */
  deleteSecurityConfiguration(callback?: (err: AWSError, data: Glue.Types.DeleteSecurityConfigurationResponse) => void): Request<Glue.Types.DeleteSecurityConfigurationResponse, AWSError>;
  /**
   * Deletes the session.
   */
  deleteSession(params: Glue.Types.DeleteSessionRequest, callback?: (err: AWSError, data: Glue.Types.DeleteSessionResponse) => void): Request<Glue.Types.DeleteSessionResponse, AWSError>;
  /**
   * Deletes the session.
   */
  deleteSession(callback?: (err: AWSError, data: Glue.Types.DeleteSessionResponse) => void): Request<Glue.Types.DeleteSessionResponse, AWSError>;
  /**
   * Removes a table definition from the Data Catalog.  After completing this operation, you no longer have access to the table versions and partitions that belong to the deleted table. Glue deletes these "orphaned" resources asynchronously in a timely manner, at the discretion of the service. To ensure the immediate deletion of all related resources, before calling DeleteTable, use DeleteTableVersion or BatchDeleteTableVersion, and DeletePartition or BatchDeletePartition, to delete any resources that belong to the table. 
   */
  deleteTable(params: Glue.Types.DeleteTableRequest, callback?: (err: AWSError, data: Glue.Types.DeleteTableResponse) => void): Request<Glue.Types.DeleteTableResponse, AWSError>;
  /**
   * Removes a table definition from the Data Catalog.  After completing this operation, you no longer have access to the table versions and partitions that belong to the deleted table. Glue deletes these "orphaned" resources asynchronously in a timely manner, at the discretion of the service. To ensure the immediate deletion of all related resources, before calling DeleteTable, use DeleteTableVersion or BatchDeleteTableVersion, and DeletePartition or BatchDeletePartition, to delete any resources that belong to the table. 
   */
  deleteTable(callback?: (err: AWSError, data: Glue.Types.DeleteTableResponse) => void): Request<Glue.Types.DeleteTableResponse, AWSError>;
  /**
   * Deletes a specified version of a table.
   */
  deleteTableVersion(params: Glue.Types.DeleteTableVersionRequest, callback?: (err: AWSError, data: Glue.Types.DeleteTableVersionResponse) => void): Request<Glue.Types.DeleteTableVersionResponse, AWSError>;
  /**
   * Deletes a specified version of a table.
   */
  deleteTableVersion(callback?: (err: AWSError, data: Glue.Types.DeleteTableVersionResponse) => void): Request<Glue.Types.DeleteTableVersionResponse, AWSError>;
  /**
   * Deletes a specified trigger. If the trigger is not found, no exception is thrown.
   */
  deleteTrigger(params: Glue.Types.DeleteTriggerRequest, callback?: (err: AWSError, data: Glue.Types.DeleteTriggerResponse) => void): Request<Glue.Types.DeleteTriggerResponse, AWSError>;
  /**
   * Deletes a specified trigger. If the trigger is not found, no exception is thrown.
   */
  deleteTrigger(callback?: (err: AWSError, data: Glue.Types.DeleteTriggerResponse) => void): Request<Glue.Types.DeleteTriggerResponse, AWSError>;
  /**
   * Deletes an existing function definition from the Data Catalog.
   */
  deleteUserDefinedFunction(params: Glue.Types.DeleteUserDefinedFunctionRequest, callback?: (err: AWSError, data: Glue.Types.DeleteUserDefinedFunctionResponse) => void): Request<Glue.Types.DeleteUserDefinedFunctionResponse, AWSError>;
  /**
   * Deletes an existing function definition from the Data Catalog.
   */
  deleteUserDefinedFunction(callback?: (err: AWSError, data: Glue.Types.DeleteUserDefinedFunctionResponse) => void): Request<Glue.Types.DeleteUserDefinedFunctionResponse, AWSError>;
  /**
   * Deletes a workflow.
   */
  deleteWorkflow(params: Glue.Types.DeleteWorkflowRequest, callback?: (err: AWSError, data: Glue.Types.DeleteWorkflowResponse) => void): Request<Glue.Types.DeleteWorkflowResponse, AWSError>;
  /**
   * Deletes a workflow.
   */
  deleteWorkflow(callback?: (err: AWSError, data: Glue.Types.DeleteWorkflowResponse) => void): Request<Glue.Types.DeleteWorkflowResponse, AWSError>;
  /**
   * Retrieves the details of a blueprint.
   */
  getBlueprint(params: Glue.Types.GetBlueprintRequest, callback?: (err: AWSError, data: Glue.Types.GetBlueprintResponse) => void): Request<Glue.Types.GetBlueprintResponse, AWSError>;
  /**
   * Retrieves the details of a blueprint.
   */
  getBlueprint(callback?: (err: AWSError, data: Glue.Types.GetBlueprintResponse) => void): Request<Glue.Types.GetBlueprintResponse, AWSError>;
  /**
   * Retrieves the details of a blueprint run.
   */
  getBlueprintRun(params: Glue.Types.GetBlueprintRunRequest, callback?: (err: AWSError, data: Glue.Types.GetBlueprintRunResponse) => void): Request<Glue.Types.GetBlueprintRunResponse, AWSError>;
  /**
   * Retrieves the details of a blueprint run.
   */
  getBlueprintRun(callback?: (err: AWSError, data: Glue.Types.GetBlueprintRunResponse) => void): Request<Glue.Types.GetBlueprintRunResponse, AWSError>;
  /**
   * Retrieves the details of blueprint runs for a specified blueprint.
   */
  getBlueprintRuns(params: Glue.Types.GetBlueprintRunsRequest, callback?: (err: AWSError, data: Glue.Types.GetBlueprintRunsResponse) => void): Request<Glue.Types.GetBlueprintRunsResponse, AWSError>;
  /**
   * Retrieves the details of blueprint runs for a specified blueprint.
   */
  getBlueprintRuns(callback?: (err: AWSError, data: Glue.Types.GetBlueprintRunsResponse) => void): Request<Glue.Types.GetBlueprintRunsResponse, AWSError>;
  /**
   * Retrieves the status of a migration operation.
   */
  getCatalogImportStatus(params: Glue.Types.GetCatalogImportStatusRequest, callback?: (err: AWSError, data: Glue.Types.GetCatalogImportStatusResponse) => void): Request<Glue.Types.GetCatalogImportStatusResponse, AWSError>;
  /**
   * Retrieves the status of a migration operation.
   */
  getCatalogImportStatus(callback?: (err: AWSError, data: Glue.Types.GetCatalogImportStatusResponse) => void): Request<Glue.Types.GetCatalogImportStatusResponse, AWSError>;
  /**
   * Retrieve a classifier by name.
   */
  getClassifier(params: Glue.Types.GetClassifierRequest, callback?: (err: AWSError, data: Glue.Types.GetClassifierResponse) => void): Request<Glue.Types.GetClassifierResponse, AWSError>;
  /**
   * Retrieve a classifier by name.
   */
  getClassifier(callback?: (err: AWSError, data: Glue.Types.GetClassifierResponse) => void): Request<Glue.Types.GetClassifierResponse, AWSError>;
  /**
   * Lists all classifier objects in the Data Catalog.
   */
  getClassifiers(params: Glue.Types.GetClassifiersRequest, callback?: (err: AWSError, data: Glue.Types.GetClassifiersResponse) => void): Request<Glue.Types.GetClassifiersResponse, AWSError>;
  /**
   * Lists all classifier objects in the Data Catalog.
   */
  getClassifiers(callback?: (err: AWSError, data: Glue.Types.GetClassifiersResponse) => void): Request<Glue.Types.GetClassifiersResponse, AWSError>;
  /**
   * Retrieves partition statistics of columns. The Identity and Access Management (IAM) permission required for this operation is GetPartition.
   */
  getColumnStatisticsForPartition(params: Glue.Types.GetColumnStatisticsForPartitionRequest, callback?: (err: AWSError, data: Glue.Types.GetColumnStatisticsForPartitionResponse) => void): Request<Glue.Types.GetColumnStatisticsForPartitionResponse, AWSError>;
  /**
   * Retrieves partition statistics of columns. The Identity and Access Management (IAM) permission required for this operation is GetPartition.
   */
  getColumnStatisticsForPartition(callback?: (err: AWSError, data: Glue.Types.GetColumnStatisticsForPartitionResponse) => void): Request<Glue.Types.GetColumnStatisticsForPartitionResponse, AWSError>;
  /**
   * Retrieves table statistics of columns. The Identity and Access Management (IAM) permission required for this operation is GetTable.
   */
  getColumnStatisticsForTable(params: Glue.Types.GetColumnStatisticsForTableRequest, callback?: (err: AWSError, data: Glue.Types.GetColumnStatisticsForTableResponse) => void): Request<Glue.Types.GetColumnStatisticsForTableResponse, AWSError>;
  /**
   * Retrieves table statistics of columns. The Identity and Access Management (IAM) permission required for this operation is GetTable.
   */
  getColumnStatisticsForTable(callback?: (err: AWSError, data: Glue.Types.GetColumnStatisticsForTableResponse) => void): Request<Glue.Types.GetColumnStatisticsForTableResponse, AWSError>;
  /**
   * Retrieves a connection definition from the Data Catalog.
   */
  getConnection(params: Glue.Types.GetConnectionRequest, callback?: (err: AWSError, data: Glue.Types.GetConnectionResponse) => void): Request<Glue.Types.GetConnectionResponse, AWSError>;
  /**
   * Retrieves a connection definition from the Data Catalog.
   */
  getConnection(callback?: (err: AWSError, data: Glue.Types.GetConnectionResponse) => void): Request<Glue.Types.GetConnectionResponse, AWSError>;
  /**
   * Retrieves a list of connection definitions from the Data Catalog.
   */
  getConnections(params: Glue.Types.GetConnectionsRequest, callback?: (err: AWSError, data: Glue.Types.GetConnectionsResponse) => void): Request<Glue.Types.GetConnectionsResponse, AWSError>;
  /**
   * Retrieves a list of connection definitions from the Data Catalog.
   */
  getConnections(callback?: (err: AWSError, data: Glue.Types.GetConnectionsResponse) => void): Request<Glue.Types.GetConnectionsResponse, AWSError>;
  /**
   * Retrieves metadata for a specified crawler.
   */
  getCrawler(params: Glue.Types.GetCrawlerRequest, callback?: (err: AWSError, data: Glue.Types.GetCrawlerResponse) => void): Request<Glue.Types.GetCrawlerResponse, AWSError>;
  /**
   * Retrieves metadata for a specified crawler.
   */
  getCrawler(callback?: (err: AWSError, data: Glue.Types.GetCrawlerResponse) => void): Request<Glue.Types.GetCrawlerResponse, AWSError>;
  /**
   * Retrieves metrics about specified crawlers.
   */
  getCrawlerMetrics(params: Glue.Types.GetCrawlerMetricsRequest, callback?: (err: AWSError, data: Glue.Types.GetCrawlerMetricsResponse) => void): Request<Glue.Types.GetCrawlerMetricsResponse, AWSError>;
  /**
   * Retrieves metrics about specified crawlers.
   */
  getCrawlerMetrics(callback?: (err: AWSError, data: Glue.Types.GetCrawlerMetricsResponse) => void): Request<Glue.Types.GetCrawlerMetricsResponse, AWSError>;
  /**
   * Retrieves metadata for all crawlers defined in the customer account.
   */
  getCrawlers(params: Glue.Types.GetCrawlersRequest, callback?: (err: AWSError, data: Glue.Types.GetCrawlersResponse) => void): Request<Glue.Types.GetCrawlersResponse, AWSError>;
  /**
   * Retrieves metadata for all crawlers defined in the customer account.
   */
  getCrawlers(callback?: (err: AWSError, data: Glue.Types.GetCrawlersResponse) => void): Request<Glue.Types.GetCrawlersResponse, AWSError>;
  /**
   * Retrieves the details of a custom pattern by specifying its name.
   */
  getCustomEntityType(params: Glue.Types.GetCustomEntityTypeRequest, callback?: (err: AWSError, data: Glue.Types.GetCustomEntityTypeResponse) => void): Request<Glue.Types.GetCustomEntityTypeResponse, AWSError>;
  /**
   * Retrieves the details of a custom pattern by specifying its name.
   */
  getCustomEntityType(callback?: (err: AWSError, data: Glue.Types.GetCustomEntityTypeResponse) => void): Request<Glue.Types.GetCustomEntityTypeResponse, AWSError>;
  /**
   * Retrieves the security configuration for a specified catalog.
   */
  getDataCatalogEncryptionSettings(params: Glue.Types.GetDataCatalogEncryptionSettingsRequest, callback?: (err: AWSError, data: Glue.Types.GetDataCatalogEncryptionSettingsResponse) => void): Request<Glue.Types.GetDataCatalogEncryptionSettingsResponse, AWSError>;
  /**
   * Retrieves the security configuration for a specified catalog.
   */
  getDataCatalogEncryptionSettings(callback?: (err: AWSError, data: Glue.Types.GetDataCatalogEncryptionSettingsResponse) => void): Request<Glue.Types.GetDataCatalogEncryptionSettingsResponse, AWSError>;
  /**
   * Retrieves the result of a data quality rule evaluation.
   */
  getDataQualityResult(params: Glue.Types.GetDataQualityResultRequest, callback?: (err: AWSError, data: Glue.Types.GetDataQualityResultResponse) => void): Request<Glue.Types.GetDataQualityResultResponse, AWSError>;
  /**
   * Retrieves the result of a data quality rule evaluation.
   */
  getDataQualityResult(callback?: (err: AWSError, data: Glue.Types.GetDataQualityResultResponse) => void): Request<Glue.Types.GetDataQualityResultResponse, AWSError>;
  /**
   * Gets the specified recommendation run that was used to generate rules.
   */
  getDataQualityRuleRecommendationRun(params: Glue.Types.GetDataQualityRuleRecommendationRunRequest, callback?: (err: AWSError, data: Glue.Types.GetDataQualityRuleRecommendationRunResponse) => void): Request<Glue.Types.GetDataQualityRuleRecommendationRunResponse, AWSError>;
  /**
   * Gets the specified recommendation run that was used to generate rules.
   */
  getDataQualityRuleRecommendationRun(callback?: (err: AWSError, data: Glue.Types.GetDataQualityRuleRecommendationRunResponse) => void): Request<Glue.Types.GetDataQualityRuleRecommendationRunResponse, AWSError>;
  /**
   * Returns an existing ruleset by identifier or name.
   */
  getDataQualityRuleset(params: Glue.Types.GetDataQualityRulesetRequest, callback?: (err: AWSError, data: Glue.Types.GetDataQualityRulesetResponse) => void): Request<Glue.Types.GetDataQualityRulesetResponse, AWSError>;
  /**
   * Returns an existing ruleset by identifier or name.
   */
  getDataQualityRuleset(callback?: (err: AWSError, data: Glue.Types.GetDataQualityRulesetResponse) => void): Request<Glue.Types.GetDataQualityRulesetResponse, AWSError>;
  /**
   * Retrieves a specific run where a ruleset is evaluated against a data source.
   */
  getDataQualityRulesetEvaluationRun(params: Glue.Types.GetDataQualityRulesetEvaluationRunRequest, callback?: (err: AWSError, data: Glue.Types.GetDataQualityRulesetEvaluationRunResponse) => void): Request<Glue.Types.GetDataQualityRulesetEvaluationRunResponse, AWSError>;
  /**
   * Retrieves a specific run where a ruleset is evaluated against a data source.
   */
  getDataQualityRulesetEvaluationRun(callback?: (err: AWSError, data: Glue.Types.GetDataQualityRulesetEvaluationRunResponse) => void): Request<Glue.Types.GetDataQualityRulesetEvaluationRunResponse, AWSError>;
  /**
   * Retrieves the definition of a specified database.
   */
  getDatabase(params: Glue.Types.GetDatabaseRequest, callback?: (err: AWSError, data: Glue.Types.GetDatabaseResponse) => void): Request<Glue.Types.GetDatabaseResponse, AWSError>;
  /**
   * Retrieves the definition of a specified database.
   */
  getDatabase(callback?: (err: AWSError, data: Glue.Types.GetDatabaseResponse) => void): Request<Glue.Types.GetDatabaseResponse, AWSError>;
  /**
   * Retrieves all databases defined in a given Data Catalog.
   */
  getDatabases(params: Glue.Types.GetDatabasesRequest, callback?: (err: AWSError, data: Glue.Types.GetDatabasesResponse) => void): Request<Glue.Types.GetDatabasesResponse, AWSError>;
  /**
   * Retrieves all databases defined in a given Data Catalog.
   */
  getDatabases(callback?: (err: AWSError, data: Glue.Types.GetDatabasesResponse) => void): Request<Glue.Types.GetDatabasesResponse, AWSError>;
  /**
   * Transforms a Python script into a directed acyclic graph (DAG). 
   */
  getDataflowGraph(params: Glue.Types.GetDataflowGraphRequest, callback?: (err: AWSError, data: Glue.Types.GetDataflowGraphResponse) => void): Request<Glue.Types.GetDataflowGraphResponse, AWSError>;
  /**
   * Transforms a Python script into a directed acyclic graph (DAG). 
   */
  getDataflowGraph(callback?: (err: AWSError, data: Glue.Types.GetDataflowGraphResponse) => void): Request<Glue.Types.GetDataflowGraphResponse, AWSError>;
  /**
   * Retrieves information about a specified development endpoint.  When you create a development endpoint in a virtual private cloud (VPC), Glue returns only a private IP address, and the public IP address field is not populated. When you create a non-VPC development endpoint, Glue returns only a public IP address. 
   */
  getDevEndpoint(params: Glue.Types.GetDevEndpointRequest, callback?: (err: AWSError, data: Glue.Types.GetDevEndpointResponse) => void): Request<Glue.Types.GetDevEndpointResponse, AWSError>;
  /**
   * Retrieves information about a specified development endpoint.  When you create a development endpoint in a virtual private cloud (VPC), Glue returns only a private IP address, and the public IP address field is not populated. When you create a non-VPC development endpoint, Glue returns only a public IP address. 
   */
  getDevEndpoint(callback?: (err: AWSError, data: Glue.Types.GetDevEndpointResponse) => void): Request<Glue.Types.GetDevEndpointResponse, AWSError>;
  /**
   * Retrieves all the development endpoints in this Amazon Web Services account.  When you create a development endpoint in a virtual private cloud (VPC), Glue returns only a private IP address and the public IP address field is not populated. When you create a non-VPC development endpoint, Glue returns only a public IP address. 
   */
  getDevEndpoints(params: Glue.Types.GetDevEndpointsRequest, callback?: (err: AWSError, data: Glue.Types.GetDevEndpointsResponse) => void): Request<Glue.Types.GetDevEndpointsResponse, AWSError>;
  /**
   * Retrieves all the development endpoints in this Amazon Web Services account.  When you create a development endpoint in a virtual private cloud (VPC), Glue returns only a private IP address and the public IP address field is not populated. When you create a non-VPC development endpoint, Glue returns only a public IP address. 
   */
  getDevEndpoints(callback?: (err: AWSError, data: Glue.Types.GetDevEndpointsResponse) => void): Request<Glue.Types.GetDevEndpointsResponse, AWSError>;
  /**
   * Retrieves an existing job definition.
   */
  getJob(params: Glue.Types.GetJobRequest, callback?: (err: AWSError, data: Glue.Types.GetJobResponse) => void): Request<Glue.Types.GetJobResponse, AWSError>;
  /**
   * Retrieves an existing job definition.
   */
  getJob(callback?: (err: AWSError, data: Glue.Types.GetJobResponse) => void): Request<Glue.Types.GetJobResponse, AWSError>;
  /**
   * Returns information on a job bookmark entry. For more information about enabling and using job bookmarks, see:    Tracking processed data using job bookmarks     Job parameters used by Glue     Job structure   
   */
  getJobBookmark(params: Glue.Types.GetJobBookmarkRequest, callback?: (err: AWSError, data: Glue.Types.GetJobBookmarkResponse) => void): Request<Glue.Types.GetJobBookmarkResponse, AWSError>;
  /**
   * Returns information on a job bookmark entry. For more information about enabling and using job bookmarks, see:    Tracking processed data using job bookmarks     Job parameters used by Glue     Job structure   
   */
  getJobBookmark(callback?: (err: AWSError, data: Glue.Types.GetJobBookmarkResponse) => void): Request<Glue.Types.GetJobBookmarkResponse, AWSError>;
  /**
   * Retrieves the metadata for a given job run.
   */
  getJobRun(params: Glue.Types.GetJobRunRequest, callback?: (err: AWSError, data: Glue.Types.GetJobRunResponse) => void): Request<Glue.Types.GetJobRunResponse, AWSError>;
  /**
   * Retrieves the metadata for a given job run.
   */
  getJobRun(callback?: (err: AWSError, data: Glue.Types.GetJobRunResponse) => void): Request<Glue.Types.GetJobRunResponse, AWSError>;
  /**
   * Retrieves metadata for all runs of a given job definition.
   */
  getJobRuns(params: Glue.Types.GetJobRunsRequest, callback?: (err: AWSError, data: Glue.Types.GetJobRunsResponse) => void): Request<Glue.Types.GetJobRunsResponse, AWSError>;
  /**
   * Retrieves metadata for all runs of a given job definition.
   */
  getJobRuns(callback?: (err: AWSError, data: Glue.Types.GetJobRunsResponse) => void): Request<Glue.Types.GetJobRunsResponse, AWSError>;
  /**
   * Retrieves all current job definitions.
   */
  getJobs(params: Glue.Types.GetJobsRequest, callback?: (err: AWSError, data: Glue.Types.GetJobsResponse) => void): Request<Glue.Types.GetJobsResponse, AWSError>;
  /**
   * Retrieves all current job definitions.
   */
  getJobs(callback?: (err: AWSError, data: Glue.Types.GetJobsResponse) => void): Request<Glue.Types.GetJobsResponse, AWSError>;
  /**
   * Gets details for a specific task run on a machine learning transform. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can check the stats of any task run by calling GetMLTaskRun with the TaskRunID and its parent transform's TransformID.
   */
  getMLTaskRun(params: Glue.Types.GetMLTaskRunRequest, callback?: (err: AWSError, data: Glue.Types.GetMLTaskRunResponse) => void): Request<Glue.Types.GetMLTaskRunResponse, AWSError>;
  /**
   * Gets details for a specific task run on a machine learning transform. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can check the stats of any task run by calling GetMLTaskRun with the TaskRunID and its parent transform's TransformID.
   */
  getMLTaskRun(callback?: (err: AWSError, data: Glue.Types.GetMLTaskRunResponse) => void): Request<Glue.Types.GetMLTaskRunResponse, AWSError>;
  /**
   * Gets a list of runs for a machine learning transform. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can get a sortable, filterable list of machine learning task runs by calling GetMLTaskRuns with their parent transform's TransformID and other optional parameters as documented in this section. This operation returns a list of historic runs and must be paginated.
   */
  getMLTaskRuns(params: Glue.Types.GetMLTaskRunsRequest, callback?: (err: AWSError, data: Glue.Types.GetMLTaskRunsResponse) => void): Request<Glue.Types.GetMLTaskRunsResponse, AWSError>;
  /**
   * Gets a list of runs for a machine learning transform. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can get a sortable, filterable list of machine learning task runs by calling GetMLTaskRuns with their parent transform's TransformID and other optional parameters as documented in this section. This operation returns a list of historic runs and must be paginated.
   */
  getMLTaskRuns(callback?: (err: AWSError, data: Glue.Types.GetMLTaskRunsResponse) => void): Request<Glue.Types.GetMLTaskRunsResponse, AWSError>;
  /**
   * Gets an Glue machine learning transform artifact and all its corresponding metadata. Machine learning transforms are a special type of transform that use machine learning to learn the details of the transformation to be performed by learning from examples provided by humans. These transformations are then saved by Glue. You can retrieve their metadata by calling GetMLTransform.
   */
  getMLTransform(params: Glue.Types.GetMLTransformRequest, callback?: (err: AWSError, data: Glue.Types.GetMLTransformResponse) => void): Request<Glue.Types.GetMLTransformResponse, AWSError>;
  /**
   * Gets an Glue machine learning transform artifact and all its corresponding metadata. Machine learning transforms are a special type of transform that use machine learning to learn the details of the transformation to be performed by learning from examples provided by humans. These transformations are then saved by Glue. You can retrieve their metadata by calling GetMLTransform.
   */
  getMLTransform(callback?: (err: AWSError, data: Glue.Types.GetMLTransformResponse) => void): Request<Glue.Types.GetMLTransformResponse, AWSError>;
  /**
   * Gets a sortable, filterable list of existing Glue machine learning transforms. Machine learning transforms are a special type of transform that use machine learning to learn the details of the transformation to be performed by learning from examples provided by humans. These transformations are then saved by Glue, and you can retrieve their metadata by calling GetMLTransforms.
   */
  getMLTransforms(params: Glue.Types.GetMLTransformsRequest, callback?: (err: AWSError, data: Glue.Types.GetMLTransformsResponse) => void): Request<Glue.Types.GetMLTransformsResponse, AWSError>;
  /**
   * Gets a sortable, filterable list of existing Glue machine learning transforms. Machine learning transforms are a special type of transform that use machine learning to learn the details of the transformation to be performed by learning from examples provided by humans. These transformations are then saved by Glue, and you can retrieve their metadata by calling GetMLTransforms.
   */
  getMLTransforms(callback?: (err: AWSError, data: Glue.Types.GetMLTransformsResponse) => void): Request<Glue.Types.GetMLTransformsResponse, AWSError>;
  /**
   * Creates mappings.
   */
  getMapping(params: Glue.Types.GetMappingRequest, callback?: (err: AWSError, data: Glue.Types.GetMappingResponse) => void): Request<Glue.Types.GetMappingResponse, AWSError>;
  /**
   * Creates mappings.
   */
  getMapping(callback?: (err: AWSError, data: Glue.Types.GetMappingResponse) => void): Request<Glue.Types.GetMappingResponse, AWSError>;
  /**
   * Retrieves information about a specified partition.
   */
  getPartition(params: Glue.Types.GetPartitionRequest, callback?: (err: AWSError, data: Glue.Types.GetPartitionResponse) => void): Request<Glue.Types.GetPartitionResponse, AWSError>;
  /**
   * Retrieves information about a specified partition.
   */
  getPartition(callback?: (err: AWSError, data: Glue.Types.GetPartitionResponse) => void): Request<Glue.Types.GetPartitionResponse, AWSError>;
  /**
   * Retrieves the partition indexes associated with a table.
   */
  getPartitionIndexes(params: Glue.Types.GetPartitionIndexesRequest, callback?: (err: AWSError, data: Glue.Types.GetPartitionIndexesResponse) => void): Request<Glue.Types.GetPartitionIndexesResponse, AWSError>;
  /**
   * Retrieves the partition indexes associated with a table.
   */
  getPartitionIndexes(callback?: (err: AWSError, data: Glue.Types.GetPartitionIndexesResponse) => void): Request<Glue.Types.GetPartitionIndexesResponse, AWSError>;
  /**
   * Retrieves information about the partitions in a table.
   */
  getPartitions(params: Glue.Types.GetPartitionsRequest, callback?: (err: AWSError, data: Glue.Types.GetPartitionsResponse) => void): Request<Glue.Types.GetPartitionsResponse, AWSError>;
  /**
   * Retrieves information about the partitions in a table.
   */
  getPartitions(callback?: (err: AWSError, data: Glue.Types.GetPartitionsResponse) => void): Request<Glue.Types.GetPartitionsResponse, AWSError>;
  /**
   * Gets code to perform a specified mapping.
   */
  getPlan(params: Glue.Types.GetPlanRequest, callback?: (err: AWSError, data: Glue.Types.GetPlanResponse) => void): Request<Glue.Types.GetPlanResponse, AWSError>;
  /**
   * Gets code to perform a specified mapping.
   */
  getPlan(callback?: (err: AWSError, data: Glue.Types.GetPlanResponse) => void): Request<Glue.Types.GetPlanResponse, AWSError>;
  /**
   * Describes the specified registry in detail.
   */
  getRegistry(params: Glue.Types.GetRegistryInput, callback?: (err: AWSError, data: Glue.Types.GetRegistryResponse) => void): Request<Glue.Types.GetRegistryResponse, AWSError>;
  /**
   * Describes the specified registry in detail.
   */
  getRegistry(callback?: (err: AWSError, data: Glue.Types.GetRegistryResponse) => void): Request<Glue.Types.GetRegistryResponse, AWSError>;
  /**
   * Retrieves the resource policies set on individual resources by Resource Access Manager during cross-account permission grants. Also retrieves the Data Catalog resource policy. If you enabled metadata encryption in Data Catalog settings, and you do not have permission on the KMS key, the operation can't return the Data Catalog resource policy.
   */
  getResourcePolicies(params: Glue.Types.GetResourcePoliciesRequest, callback?: (err: AWSError, data: Glue.Types.GetResourcePoliciesResponse) => void): Request<Glue.Types.GetResourcePoliciesResponse, AWSError>;
  /**
   * Retrieves the resource policies set on individual resources by Resource Access Manager during cross-account permission grants. Also retrieves the Data Catalog resource policy. If you enabled metadata encryption in Data Catalog settings, and you do not have permission on the KMS key, the operation can't return the Data Catalog resource policy.
   */
  getResourcePolicies(callback?: (err: AWSError, data: Glue.Types.GetResourcePoliciesResponse) => void): Request<Glue.Types.GetResourcePoliciesResponse, AWSError>;
  /**
   * Retrieves a specified resource policy.
   */
  getResourcePolicy(params: Glue.Types.GetResourcePolicyRequest, callback?: (err: AWSError, data: Glue.Types.GetResourcePolicyResponse) => void): Request<Glue.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Retrieves a specified resource policy.
   */
  getResourcePolicy(callback?: (err: AWSError, data: Glue.Types.GetResourcePolicyResponse) => void): Request<Glue.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Describes the specified schema in detail.
   */
  getSchema(params: Glue.Types.GetSchemaInput, callback?: (err: AWSError, data: Glue.Types.GetSchemaResponse) => void): Request<Glue.Types.GetSchemaResponse, AWSError>;
  /**
   * Describes the specified schema in detail.
   */
  getSchema(callback?: (err: AWSError, data: Glue.Types.GetSchemaResponse) => void): Request<Glue.Types.GetSchemaResponse, AWSError>;
  /**
   * Retrieves a schema by the SchemaDefinition. The schema definition is sent to the Schema Registry, canonicalized, and hashed. If the hash is matched within the scope of the SchemaName or ARN (or the default registry, if none is supplied), that schema’s metadata is returned. Otherwise, a 404 or NotFound error is returned. Schema versions in Deleted statuses will not be included in the results.
   */
  getSchemaByDefinition(params: Glue.Types.GetSchemaByDefinitionInput, callback?: (err: AWSError, data: Glue.Types.GetSchemaByDefinitionResponse) => void): Request<Glue.Types.GetSchemaByDefinitionResponse, AWSError>;
  /**
   * Retrieves a schema by the SchemaDefinition. The schema definition is sent to the Schema Registry, canonicalized, and hashed. If the hash is matched within the scope of the SchemaName or ARN (or the default registry, if none is supplied), that schema’s metadata is returned. Otherwise, a 404 or NotFound error is returned. Schema versions in Deleted statuses will not be included in the results.
   */
  getSchemaByDefinition(callback?: (err: AWSError, data: Glue.Types.GetSchemaByDefinitionResponse) => void): Request<Glue.Types.GetSchemaByDefinitionResponse, AWSError>;
  /**
   * Get the specified schema by its unique ID assigned when a version of the schema is created or registered. Schema versions in Deleted status will not be included in the results.
   */
  getSchemaVersion(params: Glue.Types.GetSchemaVersionInput, callback?: (err: AWSError, data: Glue.Types.GetSchemaVersionResponse) => void): Request<Glue.Types.GetSchemaVersionResponse, AWSError>;
  /**
   * Get the specified schema by its unique ID assigned when a version of the schema is created or registered. Schema versions in Deleted status will not be included in the results.
   */
  getSchemaVersion(callback?: (err: AWSError, data: Glue.Types.GetSchemaVersionResponse) => void): Request<Glue.Types.GetSchemaVersionResponse, AWSError>;
  /**
   * Fetches the schema version difference in the specified difference type between two stored schema versions in the Schema Registry. This API allows you to compare two schema versions between two schema definitions under the same schema.
   */
  getSchemaVersionsDiff(params: Glue.Types.GetSchemaVersionsDiffInput, callback?: (err: AWSError, data: Glue.Types.GetSchemaVersionsDiffResponse) => void): Request<Glue.Types.GetSchemaVersionsDiffResponse, AWSError>;
  /**
   * Fetches the schema version difference in the specified difference type between two stored schema versions in the Schema Registry. This API allows you to compare two schema versions between two schema definitions under the same schema.
   */
  getSchemaVersionsDiff(callback?: (err: AWSError, data: Glue.Types.GetSchemaVersionsDiffResponse) => void): Request<Glue.Types.GetSchemaVersionsDiffResponse, AWSError>;
  /**
   * Retrieves a specified security configuration.
   */
  getSecurityConfiguration(params: Glue.Types.GetSecurityConfigurationRequest, callback?: (err: AWSError, data: Glue.Types.GetSecurityConfigurationResponse) => void): Request<Glue.Types.GetSecurityConfigurationResponse, AWSError>;
  /**
   * Retrieves a specified security configuration.
   */
  getSecurityConfiguration(callback?: (err: AWSError, data: Glue.Types.GetSecurityConfigurationResponse) => void): Request<Glue.Types.GetSecurityConfigurationResponse, AWSError>;
  /**
   * Retrieves a list of all security configurations.
   */
  getSecurityConfigurations(params: Glue.Types.GetSecurityConfigurationsRequest, callback?: (err: AWSError, data: Glue.Types.GetSecurityConfigurationsResponse) => void): Request<Glue.Types.GetSecurityConfigurationsResponse, AWSError>;
  /**
   * Retrieves a list of all security configurations.
   */
  getSecurityConfigurations(callback?: (err: AWSError, data: Glue.Types.GetSecurityConfigurationsResponse) => void): Request<Glue.Types.GetSecurityConfigurationsResponse, AWSError>;
  /**
   * Retrieves the session.
   */
  getSession(params: Glue.Types.GetSessionRequest, callback?: (err: AWSError, data: Glue.Types.GetSessionResponse) => void): Request<Glue.Types.GetSessionResponse, AWSError>;
  /**
   * Retrieves the session.
   */
  getSession(callback?: (err: AWSError, data: Glue.Types.GetSessionResponse) => void): Request<Glue.Types.GetSessionResponse, AWSError>;
  /**
   * Retrieves the statement.
   */
  getStatement(params: Glue.Types.GetStatementRequest, callback?: (err: AWSError, data: Glue.Types.GetStatementResponse) => void): Request<Glue.Types.GetStatementResponse, AWSError>;
  /**
   * Retrieves the statement.
   */
  getStatement(callback?: (err: AWSError, data: Glue.Types.GetStatementResponse) => void): Request<Glue.Types.GetStatementResponse, AWSError>;
  /**
   * Retrieves the Table definition in a Data Catalog for a specified table.
   */
  getTable(params: Glue.Types.GetTableRequest, callback?: (err: AWSError, data: Glue.Types.GetTableResponse) => void): Request<Glue.Types.GetTableResponse, AWSError>;
  /**
   * Retrieves the Table definition in a Data Catalog for a specified table.
   */
  getTable(callback?: (err: AWSError, data: Glue.Types.GetTableResponse) => void): Request<Glue.Types.GetTableResponse, AWSError>;
  /**
   * Retrieves a specified version of a table.
   */
  getTableVersion(params: Glue.Types.GetTableVersionRequest, callback?: (err: AWSError, data: Glue.Types.GetTableVersionResponse) => void): Request<Glue.Types.GetTableVersionResponse, AWSError>;
  /**
   * Retrieves a specified version of a table.
   */
  getTableVersion(callback?: (err: AWSError, data: Glue.Types.GetTableVersionResponse) => void): Request<Glue.Types.GetTableVersionResponse, AWSError>;
  /**
   * Retrieves a list of strings that identify available versions of a specified table.
   */
  getTableVersions(params: Glue.Types.GetTableVersionsRequest, callback?: (err: AWSError, data: Glue.Types.GetTableVersionsResponse) => void): Request<Glue.Types.GetTableVersionsResponse, AWSError>;
  /**
   * Retrieves a list of strings that identify available versions of a specified table.
   */
  getTableVersions(callback?: (err: AWSError, data: Glue.Types.GetTableVersionsResponse) => void): Request<Glue.Types.GetTableVersionsResponse, AWSError>;
  /**
   * Retrieves the definitions of some or all of the tables in a given Database.
   */
  getTables(params: Glue.Types.GetTablesRequest, callback?: (err: AWSError, data: Glue.Types.GetTablesResponse) => void): Request<Glue.Types.GetTablesResponse, AWSError>;
  /**
   * Retrieves the definitions of some or all of the tables in a given Database.
   */
  getTables(callback?: (err: AWSError, data: Glue.Types.GetTablesResponse) => void): Request<Glue.Types.GetTablesResponse, AWSError>;
  /**
   * Retrieves a list of tags associated with a resource.
   */
  getTags(params: Glue.Types.GetTagsRequest, callback?: (err: AWSError, data: Glue.Types.GetTagsResponse) => void): Request<Glue.Types.GetTagsResponse, AWSError>;
  /**
   * Retrieves a list of tags associated with a resource.
   */
  getTags(callback?: (err: AWSError, data: Glue.Types.GetTagsResponse) => void): Request<Glue.Types.GetTagsResponse, AWSError>;
  /**
   * Retrieves the definition of a trigger.
   */
  getTrigger(params: Glue.Types.GetTriggerRequest, callback?: (err: AWSError, data: Glue.Types.GetTriggerResponse) => void): Request<Glue.Types.GetTriggerResponse, AWSError>;
  /**
   * Retrieves the definition of a trigger.
   */
  getTrigger(callback?: (err: AWSError, data: Glue.Types.GetTriggerResponse) => void): Request<Glue.Types.GetTriggerResponse, AWSError>;
  /**
   * Gets all the triggers associated with a job.
   */
  getTriggers(params: Glue.Types.GetTriggersRequest, callback?: (err: AWSError, data: Glue.Types.GetTriggersResponse) => void): Request<Glue.Types.GetTriggersResponse, AWSError>;
  /**
   * Gets all the triggers associated with a job.
   */
  getTriggers(callback?: (err: AWSError, data: Glue.Types.GetTriggersResponse) => void): Request<Glue.Types.GetTriggersResponse, AWSError>;
  /**
   * Retrieves partition metadata from the Data Catalog that contains unfiltered metadata. For IAM authorization, the public IAM action associated with this API is glue:GetPartition.
   */
  getUnfilteredPartitionMetadata(params: Glue.Types.GetUnfilteredPartitionMetadataRequest, callback?: (err: AWSError, data: Glue.Types.GetUnfilteredPartitionMetadataResponse) => void): Request<Glue.Types.GetUnfilteredPartitionMetadataResponse, AWSError>;
  /**
   * Retrieves partition metadata from the Data Catalog that contains unfiltered metadata. For IAM authorization, the public IAM action associated with this API is glue:GetPartition.
   */
  getUnfilteredPartitionMetadata(callback?: (err: AWSError, data: Glue.Types.GetUnfilteredPartitionMetadataResponse) => void): Request<Glue.Types.GetUnfilteredPartitionMetadataResponse, AWSError>;
  /**
   * Retrieves partition metadata from the Data Catalog that contains unfiltered metadata. For IAM authorization, the public IAM action associated with this API is glue:GetPartitions.
   */
  getUnfilteredPartitionsMetadata(params: Glue.Types.GetUnfilteredPartitionsMetadataRequest, callback?: (err: AWSError, data: Glue.Types.GetUnfilteredPartitionsMetadataResponse) => void): Request<Glue.Types.GetUnfilteredPartitionsMetadataResponse, AWSError>;
  /**
   * Retrieves partition metadata from the Data Catalog that contains unfiltered metadata. For IAM authorization, the public IAM action associated with this API is glue:GetPartitions.
   */
  getUnfilteredPartitionsMetadata(callback?: (err: AWSError, data: Glue.Types.GetUnfilteredPartitionsMetadataResponse) => void): Request<Glue.Types.GetUnfilteredPartitionsMetadataResponse, AWSError>;
  /**
   * Retrieves table metadata from the Data Catalog that contains unfiltered metadata. For IAM authorization, the public IAM action associated with this API is glue:GetTable.
   */
  getUnfilteredTableMetadata(params: Glue.Types.GetUnfilteredTableMetadataRequest, callback?: (err: AWSError, data: Glue.Types.GetUnfilteredTableMetadataResponse) => void): Request<Glue.Types.GetUnfilteredTableMetadataResponse, AWSError>;
  /**
   * Retrieves table metadata from the Data Catalog that contains unfiltered metadata. For IAM authorization, the public IAM action associated with this API is glue:GetTable.
   */
  getUnfilteredTableMetadata(callback?: (err: AWSError, data: Glue.Types.GetUnfilteredTableMetadataResponse) => void): Request<Glue.Types.GetUnfilteredTableMetadataResponse, AWSError>;
  /**
   * Retrieves a specified function definition from the Data Catalog.
   */
  getUserDefinedFunction(params: Glue.Types.GetUserDefinedFunctionRequest, callback?: (err: AWSError, data: Glue.Types.GetUserDefinedFunctionResponse) => void): Request<Glue.Types.GetUserDefinedFunctionResponse, AWSError>;
  /**
   * Retrieves a specified function definition from the Data Catalog.
   */
  getUserDefinedFunction(callback?: (err: AWSError, data: Glue.Types.GetUserDefinedFunctionResponse) => void): Request<Glue.Types.GetUserDefinedFunctionResponse, AWSError>;
  /**
   * Retrieves multiple function definitions from the Data Catalog.
   */
  getUserDefinedFunctions(params: Glue.Types.GetUserDefinedFunctionsRequest, callback?: (err: AWSError, data: Glue.Types.GetUserDefinedFunctionsResponse) => void): Request<Glue.Types.GetUserDefinedFunctionsResponse, AWSError>;
  /**
   * Retrieves multiple function definitions from the Data Catalog.
   */
  getUserDefinedFunctions(callback?: (err: AWSError, data: Glue.Types.GetUserDefinedFunctionsResponse) => void): Request<Glue.Types.GetUserDefinedFunctionsResponse, AWSError>;
  /**
   * Retrieves resource metadata for a workflow.
   */
  getWorkflow(params: Glue.Types.GetWorkflowRequest, callback?: (err: AWSError, data: Glue.Types.GetWorkflowResponse) => void): Request<Glue.Types.GetWorkflowResponse, AWSError>;
  /**
   * Retrieves resource metadata for a workflow.
   */
  getWorkflow(callback?: (err: AWSError, data: Glue.Types.GetWorkflowResponse) => void): Request<Glue.Types.GetWorkflowResponse, AWSError>;
  /**
   * Retrieves the metadata for a given workflow run. 
   */
  getWorkflowRun(params: Glue.Types.GetWorkflowRunRequest, callback?: (err: AWSError, data: Glue.Types.GetWorkflowRunResponse) => void): Request<Glue.Types.GetWorkflowRunResponse, AWSError>;
  /**
   * Retrieves the metadata for a given workflow run. 
   */
  getWorkflowRun(callback?: (err: AWSError, data: Glue.Types.GetWorkflowRunResponse) => void): Request<Glue.Types.GetWorkflowRunResponse, AWSError>;
  /**
   * Retrieves the workflow run properties which were set during the run.
   */
  getWorkflowRunProperties(params: Glue.Types.GetWorkflowRunPropertiesRequest, callback?: (err: AWSError, data: Glue.Types.GetWorkflowRunPropertiesResponse) => void): Request<Glue.Types.GetWorkflowRunPropertiesResponse, AWSError>;
  /**
   * Retrieves the workflow run properties which were set during the run.
   */
  getWorkflowRunProperties(callback?: (err: AWSError, data: Glue.Types.GetWorkflowRunPropertiesResponse) => void): Request<Glue.Types.GetWorkflowRunPropertiesResponse, AWSError>;
  /**
   * Retrieves metadata for all runs of a given workflow.
   */
  getWorkflowRuns(params: Glue.Types.GetWorkflowRunsRequest, callback?: (err: AWSError, data: Glue.Types.GetWorkflowRunsResponse) => void): Request<Glue.Types.GetWorkflowRunsResponse, AWSError>;
  /**
   * Retrieves metadata for all runs of a given workflow.
   */
  getWorkflowRuns(callback?: (err: AWSError, data: Glue.Types.GetWorkflowRunsResponse) => void): Request<Glue.Types.GetWorkflowRunsResponse, AWSError>;
  /**
   * Imports an existing Amazon Athena Data Catalog to Glue.
   */
  importCatalogToGlue(params: Glue.Types.ImportCatalogToGlueRequest, callback?: (err: AWSError, data: Glue.Types.ImportCatalogToGlueResponse) => void): Request<Glue.Types.ImportCatalogToGlueResponse, AWSError>;
  /**
   * Imports an existing Amazon Athena Data Catalog to Glue.
   */
  importCatalogToGlue(callback?: (err: AWSError, data: Glue.Types.ImportCatalogToGlueResponse) => void): Request<Glue.Types.ImportCatalogToGlueResponse, AWSError>;
  /**
   * Lists all the blueprint names in an account.
   */
  listBlueprints(params: Glue.Types.ListBlueprintsRequest, callback?: (err: AWSError, data: Glue.Types.ListBlueprintsResponse) => void): Request<Glue.Types.ListBlueprintsResponse, AWSError>;
  /**
   * Lists all the blueprint names in an account.
   */
  listBlueprints(callback?: (err: AWSError, data: Glue.Types.ListBlueprintsResponse) => void): Request<Glue.Types.ListBlueprintsResponse, AWSError>;
  /**
   * Retrieves the names of all crawler resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names. This operation takes the optional Tags field, which you can use as a filter on the response so that tagged resources can be retrieved as a group. If you choose to use tags filtering, only resources with the tag are retrieved.
   */
  listCrawlers(params: Glue.Types.ListCrawlersRequest, callback?: (err: AWSError, data: Glue.Types.ListCrawlersResponse) => void): Request<Glue.Types.ListCrawlersResponse, AWSError>;
  /**
   * Retrieves the names of all crawler resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names. This operation takes the optional Tags field, which you can use as a filter on the response so that tagged resources can be retrieved as a group. If you choose to use tags filtering, only resources with the tag are retrieved.
   */
  listCrawlers(callback?: (err: AWSError, data: Glue.Types.ListCrawlersResponse) => void): Request<Glue.Types.ListCrawlersResponse, AWSError>;
  /**
   * Returns all the crawls of a specified crawler. Returns only the crawls that have occurred since the launch date of the crawler history feature, and only retains up to 12 months of crawls. Older crawls will not be returned. You may use this API to:   Retrive all the crawls of a specified crawler.   Retrieve all the crawls of a specified crawler within a limited count.   Retrieve all the crawls of a specified crawler in a specific time range.   Retrieve all the crawls of a specified crawler with a particular state, crawl ID, or DPU hour value.  
   */
  listCrawls(params: Glue.Types.ListCrawlsRequest, callback?: (err: AWSError, data: Glue.Types.ListCrawlsResponse) => void): Request<Glue.Types.ListCrawlsResponse, AWSError>;
  /**
   * Returns all the crawls of a specified crawler. Returns only the crawls that have occurred since the launch date of the crawler history feature, and only retains up to 12 months of crawls. Older crawls will not be returned. You may use this API to:   Retrive all the crawls of a specified crawler.   Retrieve all the crawls of a specified crawler within a limited count.   Retrieve all the crawls of a specified crawler in a specific time range.   Retrieve all the crawls of a specified crawler with a particular state, crawl ID, or DPU hour value.  
   */
  listCrawls(callback?: (err: AWSError, data: Glue.Types.ListCrawlsResponse) => void): Request<Glue.Types.ListCrawlsResponse, AWSError>;
  /**
   * Lists all the custom patterns that have been created.
   */
  listCustomEntityTypes(params: Glue.Types.ListCustomEntityTypesRequest, callback?: (err: AWSError, data: Glue.Types.ListCustomEntityTypesResponse) => void): Request<Glue.Types.ListCustomEntityTypesResponse, AWSError>;
  /**
   * Lists all the custom patterns that have been created.
   */
  listCustomEntityTypes(callback?: (err: AWSError, data: Glue.Types.ListCustomEntityTypesResponse) => void): Request<Glue.Types.ListCustomEntityTypesResponse, AWSError>;
  /**
   * Returns all data quality execution results for your account.
   */
  listDataQualityResults(params: Glue.Types.ListDataQualityResultsRequest, callback?: (err: AWSError, data: Glue.Types.ListDataQualityResultsResponse) => void): Request<Glue.Types.ListDataQualityResultsResponse, AWSError>;
  /**
   * Returns all data quality execution results for your account.
   */
  listDataQualityResults(callback?: (err: AWSError, data: Glue.Types.ListDataQualityResultsResponse) => void): Request<Glue.Types.ListDataQualityResultsResponse, AWSError>;
  /**
   * Lists the recommendation runs meeting the filter criteria.
   */
  listDataQualityRuleRecommendationRuns(params: Glue.Types.ListDataQualityRuleRecommendationRunsRequest, callback?: (err: AWSError, data: Glue.Types.ListDataQualityRuleRecommendationRunsResponse) => void): Request<Glue.Types.ListDataQualityRuleRecommendationRunsResponse, AWSError>;
  /**
   * Lists the recommendation runs meeting the filter criteria.
   */
  listDataQualityRuleRecommendationRuns(callback?: (err: AWSError, data: Glue.Types.ListDataQualityRuleRecommendationRunsResponse) => void): Request<Glue.Types.ListDataQualityRuleRecommendationRunsResponse, AWSError>;
  /**
   * Lists all the runs meeting the filter criteria, where a ruleset is evaluated against a data source.
   */
  listDataQualityRulesetEvaluationRuns(params: Glue.Types.ListDataQualityRulesetEvaluationRunsRequest, callback?: (err: AWSError, data: Glue.Types.ListDataQualityRulesetEvaluationRunsResponse) => void): Request<Glue.Types.ListDataQualityRulesetEvaluationRunsResponse, AWSError>;
  /**
   * Lists all the runs meeting the filter criteria, where a ruleset is evaluated against a data source.
   */
  listDataQualityRulesetEvaluationRuns(callback?: (err: AWSError, data: Glue.Types.ListDataQualityRulesetEvaluationRunsResponse) => void): Request<Glue.Types.ListDataQualityRulesetEvaluationRunsResponse, AWSError>;
  /**
   * Returns a paginated list of rulesets for the specified list of Glue tables.
   */
  listDataQualityRulesets(params: Glue.Types.ListDataQualityRulesetsRequest, callback?: (err: AWSError, data: Glue.Types.ListDataQualityRulesetsResponse) => void): Request<Glue.Types.ListDataQualityRulesetsResponse, AWSError>;
  /**
   * Returns a paginated list of rulesets for the specified list of Glue tables.
   */
  listDataQualityRulesets(callback?: (err: AWSError, data: Glue.Types.ListDataQualityRulesetsResponse) => void): Request<Glue.Types.ListDataQualityRulesetsResponse, AWSError>;
  /**
   * Retrieves the names of all DevEndpoint resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names. This operation takes the optional Tags field, which you can use as a filter on the response so that tagged resources can be retrieved as a group. If you choose to use tags filtering, only resources with the tag are retrieved.
   */
  listDevEndpoints(params: Glue.Types.ListDevEndpointsRequest, callback?: (err: AWSError, data: Glue.Types.ListDevEndpointsResponse) => void): Request<Glue.Types.ListDevEndpointsResponse, AWSError>;
  /**
   * Retrieves the names of all DevEndpoint resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names. This operation takes the optional Tags field, which you can use as a filter on the response so that tagged resources can be retrieved as a group. If you choose to use tags filtering, only resources with the tag are retrieved.
   */
  listDevEndpoints(callback?: (err: AWSError, data: Glue.Types.ListDevEndpointsResponse) => void): Request<Glue.Types.ListDevEndpointsResponse, AWSError>;
  /**
   * Retrieves the names of all job resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names. This operation takes the optional Tags field, which you can use as a filter on the response so that tagged resources can be retrieved as a group. If you choose to use tags filtering, only resources with the tag are retrieved.
   */
  listJobs(params: Glue.Types.ListJobsRequest, callback?: (err: AWSError, data: Glue.Types.ListJobsResponse) => void): Request<Glue.Types.ListJobsResponse, AWSError>;
  /**
   * Retrieves the names of all job resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names. This operation takes the optional Tags field, which you can use as a filter on the response so that tagged resources can be retrieved as a group. If you choose to use tags filtering, only resources with the tag are retrieved.
   */
  listJobs(callback?: (err: AWSError, data: Glue.Types.ListJobsResponse) => void): Request<Glue.Types.ListJobsResponse, AWSError>;
  /**
   *  Retrieves a sortable, filterable list of existing Glue machine learning transforms in this Amazon Web Services account, or the resources with the specified tag. This operation takes the optional Tags field, which you can use as a filter of the responses so that tagged resources can be retrieved as a group. If you choose to use tag filtering, only resources with the tags are retrieved. 
   */
  listMLTransforms(params: Glue.Types.ListMLTransformsRequest, callback?: (err: AWSError, data: Glue.Types.ListMLTransformsResponse) => void): Request<Glue.Types.ListMLTransformsResponse, AWSError>;
  /**
   *  Retrieves a sortable, filterable list of existing Glue machine learning transforms in this Amazon Web Services account, or the resources with the specified tag. This operation takes the optional Tags field, which you can use as a filter of the responses so that tagged resources can be retrieved as a group. If you choose to use tag filtering, only resources with the tags are retrieved. 
   */
  listMLTransforms(callback?: (err: AWSError, data: Glue.Types.ListMLTransformsResponse) => void): Request<Glue.Types.ListMLTransformsResponse, AWSError>;
  /**
   * Returns a list of registries that you have created, with minimal registry information. Registries in the Deleting status will not be included in the results. Empty results will be returned if there are no registries available.
   */
  listRegistries(params: Glue.Types.ListRegistriesInput, callback?: (err: AWSError, data: Glue.Types.ListRegistriesResponse) => void): Request<Glue.Types.ListRegistriesResponse, AWSError>;
  /**
   * Returns a list of registries that you have created, with minimal registry information. Registries in the Deleting status will not be included in the results. Empty results will be returned if there are no registries available.
   */
  listRegistries(callback?: (err: AWSError, data: Glue.Types.ListRegistriesResponse) => void): Request<Glue.Types.ListRegistriesResponse, AWSError>;
  /**
   * Returns a list of schema versions that you have created, with minimal information. Schema versions in Deleted status will not be included in the results. Empty results will be returned if there are no schema versions available.
   */
  listSchemaVersions(params: Glue.Types.ListSchemaVersionsInput, callback?: (err: AWSError, data: Glue.Types.ListSchemaVersionsResponse) => void): Request<Glue.Types.ListSchemaVersionsResponse, AWSError>;
  /**
   * Returns a list of schema versions that you have created, with minimal information. Schema versions in Deleted status will not be included in the results. Empty results will be returned if there are no schema versions available.
   */
  listSchemaVersions(callback?: (err: AWSError, data: Glue.Types.ListSchemaVersionsResponse) => void): Request<Glue.Types.ListSchemaVersionsResponse, AWSError>;
  /**
   * Returns a list of schemas with minimal details. Schemas in Deleting status will not be included in the results. Empty results will be returned if there are no schemas available. When the RegistryId is not provided, all the schemas across registries will be part of the API response.
   */
  listSchemas(params: Glue.Types.ListSchemasInput, callback?: (err: AWSError, data: Glue.Types.ListSchemasResponse) => void): Request<Glue.Types.ListSchemasResponse, AWSError>;
  /**
   * Returns a list of schemas with minimal details. Schemas in Deleting status will not be included in the results. Empty results will be returned if there are no schemas available. When the RegistryId is not provided, all the schemas across registries will be part of the API response.
   */
  listSchemas(callback?: (err: AWSError, data: Glue.Types.ListSchemasResponse) => void): Request<Glue.Types.ListSchemasResponse, AWSError>;
  /**
   * Retrieve a list of sessions.
   */
  listSessions(params: Glue.Types.ListSessionsRequest, callback?: (err: AWSError, data: Glue.Types.ListSessionsResponse) => void): Request<Glue.Types.ListSessionsResponse, AWSError>;
  /**
   * Retrieve a list of sessions.
   */
  listSessions(callback?: (err: AWSError, data: Glue.Types.ListSessionsResponse) => void): Request<Glue.Types.ListSessionsResponse, AWSError>;
  /**
   * Lists statements for the session.
   */
  listStatements(params: Glue.Types.ListStatementsRequest, callback?: (err: AWSError, data: Glue.Types.ListStatementsResponse) => void): Request<Glue.Types.ListStatementsResponse, AWSError>;
  /**
   * Lists statements for the session.
   */
  listStatements(callback?: (err: AWSError, data: Glue.Types.ListStatementsResponse) => void): Request<Glue.Types.ListStatementsResponse, AWSError>;
  /**
   * Retrieves the names of all trigger resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names. This operation takes the optional Tags field, which you can use as a filter on the response so that tagged resources can be retrieved as a group. If you choose to use tags filtering, only resources with the tag are retrieved.
   */
  listTriggers(params: Glue.Types.ListTriggersRequest, callback?: (err: AWSError, data: Glue.Types.ListTriggersResponse) => void): Request<Glue.Types.ListTriggersResponse, AWSError>;
  /**
   * Retrieves the names of all trigger resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names. This operation takes the optional Tags field, which you can use as a filter on the response so that tagged resources can be retrieved as a group. If you choose to use tags filtering, only resources with the tag are retrieved.
   */
  listTriggers(callback?: (err: AWSError, data: Glue.Types.ListTriggersResponse) => void): Request<Glue.Types.ListTriggersResponse, AWSError>;
  /**
   * Lists names of workflows created in the account.
   */
  listWorkflows(params: Glue.Types.ListWorkflowsRequest, callback?: (err: AWSError, data: Glue.Types.ListWorkflowsResponse) => void): Request<Glue.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Lists names of workflows created in the account.
   */
  listWorkflows(callback?: (err: AWSError, data: Glue.Types.ListWorkflowsResponse) => void): Request<Glue.Types.ListWorkflowsResponse, AWSError>;
  /**
   * Sets the security configuration for a specified catalog. After the configuration has been set, the specified encryption is applied to every catalog write thereafter.
   */
  putDataCatalogEncryptionSettings(params: Glue.Types.PutDataCatalogEncryptionSettingsRequest, callback?: (err: AWSError, data: Glue.Types.PutDataCatalogEncryptionSettingsResponse) => void): Request<Glue.Types.PutDataCatalogEncryptionSettingsResponse, AWSError>;
  /**
   * Sets the security configuration for a specified catalog. After the configuration has been set, the specified encryption is applied to every catalog write thereafter.
   */
  putDataCatalogEncryptionSettings(callback?: (err: AWSError, data: Glue.Types.PutDataCatalogEncryptionSettingsResponse) => void): Request<Glue.Types.PutDataCatalogEncryptionSettingsResponse, AWSError>;
  /**
   * Sets the Data Catalog resource policy for access control.
   */
  putResourcePolicy(params: Glue.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: Glue.Types.PutResourcePolicyResponse) => void): Request<Glue.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Sets the Data Catalog resource policy for access control.
   */
  putResourcePolicy(callback?: (err: AWSError, data: Glue.Types.PutResourcePolicyResponse) => void): Request<Glue.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Puts the metadata key value pair for a specified schema version ID. A maximum of 10 key value pairs will be allowed per schema version. They can be added over one or more calls.
   */
  putSchemaVersionMetadata(params: Glue.Types.PutSchemaVersionMetadataInput, callback?: (err: AWSError, data: Glue.Types.PutSchemaVersionMetadataResponse) => void): Request<Glue.Types.PutSchemaVersionMetadataResponse, AWSError>;
  /**
   * Puts the metadata key value pair for a specified schema version ID. A maximum of 10 key value pairs will be allowed per schema version. They can be added over one or more calls.
   */
  putSchemaVersionMetadata(callback?: (err: AWSError, data: Glue.Types.PutSchemaVersionMetadataResponse) => void): Request<Glue.Types.PutSchemaVersionMetadataResponse, AWSError>;
  /**
   * Puts the specified workflow run properties for the given workflow run. If a property already exists for the specified run, then it overrides the value otherwise adds the property to existing properties.
   */
  putWorkflowRunProperties(params: Glue.Types.PutWorkflowRunPropertiesRequest, callback?: (err: AWSError, data: Glue.Types.PutWorkflowRunPropertiesResponse) => void): Request<Glue.Types.PutWorkflowRunPropertiesResponse, AWSError>;
  /**
   * Puts the specified workflow run properties for the given workflow run. If a property already exists for the specified run, then it overrides the value otherwise adds the property to existing properties.
   */
  putWorkflowRunProperties(callback?: (err: AWSError, data: Glue.Types.PutWorkflowRunPropertiesResponse) => void): Request<Glue.Types.PutWorkflowRunPropertiesResponse, AWSError>;
  /**
   * Queries for the schema version metadata information. 
   */
  querySchemaVersionMetadata(params: Glue.Types.QuerySchemaVersionMetadataInput, callback?: (err: AWSError, data: Glue.Types.QuerySchemaVersionMetadataResponse) => void): Request<Glue.Types.QuerySchemaVersionMetadataResponse, AWSError>;
  /**
   * Queries for the schema version metadata information. 
   */
  querySchemaVersionMetadata(callback?: (err: AWSError, data: Glue.Types.QuerySchemaVersionMetadataResponse) => void): Request<Glue.Types.QuerySchemaVersionMetadataResponse, AWSError>;
  /**
   * Adds a new version to the existing schema. Returns an error if new version of schema does not meet the compatibility requirements of the schema set. This API will not create a new schema set and will return a 404 error if the schema set is not already present in the Schema Registry. If this is the first schema definition to be registered in the Schema Registry, this API will store the schema version and return immediately. Otherwise, this call has the potential to run longer than other operations due to compatibility modes. You can call the GetSchemaVersion API with the SchemaVersionId to check compatibility modes. If the same schema definition is already stored in Schema Registry as a version, the schema ID of the existing schema is returned to the caller.
   */
  registerSchemaVersion(params: Glue.Types.RegisterSchemaVersionInput, callback?: (err: AWSError, data: Glue.Types.RegisterSchemaVersionResponse) => void): Request<Glue.Types.RegisterSchemaVersionResponse, AWSError>;
  /**
   * Adds a new version to the existing schema. Returns an error if new version of schema does not meet the compatibility requirements of the schema set. This API will not create a new schema set and will return a 404 error if the schema set is not already present in the Schema Registry. If this is the first schema definition to be registered in the Schema Registry, this API will store the schema version and return immediately. Otherwise, this call has the potential to run longer than other operations due to compatibility modes. You can call the GetSchemaVersion API with the SchemaVersionId to check compatibility modes. If the same schema definition is already stored in Schema Registry as a version, the schema ID of the existing schema is returned to the caller.
   */
  registerSchemaVersion(callback?: (err: AWSError, data: Glue.Types.RegisterSchemaVersionResponse) => void): Request<Glue.Types.RegisterSchemaVersionResponse, AWSError>;
  /**
   * Removes a key value pair from the schema version metadata for the specified schema version ID.
   */
  removeSchemaVersionMetadata(params: Glue.Types.RemoveSchemaVersionMetadataInput, callback?: (err: AWSError, data: Glue.Types.RemoveSchemaVersionMetadataResponse) => void): Request<Glue.Types.RemoveSchemaVersionMetadataResponse, AWSError>;
  /**
   * Removes a key value pair from the schema version metadata for the specified schema version ID.
   */
  removeSchemaVersionMetadata(callback?: (err: AWSError, data: Glue.Types.RemoveSchemaVersionMetadataResponse) => void): Request<Glue.Types.RemoveSchemaVersionMetadataResponse, AWSError>;
  /**
   * Resets a bookmark entry. For more information about enabling and using job bookmarks, see:    Tracking processed data using job bookmarks     Job parameters used by Glue     Job structure   
   */
  resetJobBookmark(params: Glue.Types.ResetJobBookmarkRequest, callback?: (err: AWSError, data: Glue.Types.ResetJobBookmarkResponse) => void): Request<Glue.Types.ResetJobBookmarkResponse, AWSError>;
  /**
   * Resets a bookmark entry. For more information about enabling and using job bookmarks, see:    Tracking processed data using job bookmarks     Job parameters used by Glue     Job structure   
   */
  resetJobBookmark(callback?: (err: AWSError, data: Glue.Types.ResetJobBookmarkResponse) => void): Request<Glue.Types.ResetJobBookmarkResponse, AWSError>;
  /**
   * Restarts selected nodes of a previous partially completed workflow run and resumes the workflow run. The selected nodes and all nodes that are downstream from the selected nodes are run.
   */
  resumeWorkflowRun(params: Glue.Types.ResumeWorkflowRunRequest, callback?: (err: AWSError, data: Glue.Types.ResumeWorkflowRunResponse) => void): Request<Glue.Types.ResumeWorkflowRunResponse, AWSError>;
  /**
   * Restarts selected nodes of a previous partially completed workflow run and resumes the workflow run. The selected nodes and all nodes that are downstream from the selected nodes are run.
   */
  resumeWorkflowRun(callback?: (err: AWSError, data: Glue.Types.ResumeWorkflowRunResponse) => void): Request<Glue.Types.ResumeWorkflowRunResponse, AWSError>;
  /**
   * Executes the statement.
   */
  runStatement(params: Glue.Types.RunStatementRequest, callback?: (err: AWSError, data: Glue.Types.RunStatementResponse) => void): Request<Glue.Types.RunStatementResponse, AWSError>;
  /**
   * Executes the statement.
   */
  runStatement(callback?: (err: AWSError, data: Glue.Types.RunStatementResponse) => void): Request<Glue.Types.RunStatementResponse, AWSError>;
  /**
   * Searches a set of tables based on properties in the table metadata as well as on the parent database. You can search against text or filter conditions.  You can only get tables that you have access to based on the security policies defined in Lake Formation. You need at least a read-only access to the table for it to be returned. If you do not have access to all the columns in the table, these columns will not be searched against when returning the list of tables back to you. If you have access to the columns but not the data in the columns, those columns and the associated metadata for those columns will be included in the search. 
   */
  searchTables(params: Glue.Types.SearchTablesRequest, callback?: (err: AWSError, data: Glue.Types.SearchTablesResponse) => void): Request<Glue.Types.SearchTablesResponse, AWSError>;
  /**
   * Searches a set of tables based on properties in the table metadata as well as on the parent database. You can search against text or filter conditions.  You can only get tables that you have access to based on the security policies defined in Lake Formation. You need at least a read-only access to the table for it to be returned. If you do not have access to all the columns in the table, these columns will not be searched against when returning the list of tables back to you. If you have access to the columns but not the data in the columns, those columns and the associated metadata for those columns will be included in the search. 
   */
  searchTables(callback?: (err: AWSError, data: Glue.Types.SearchTablesResponse) => void): Request<Glue.Types.SearchTablesResponse, AWSError>;
  /**
   * Starts a new run of the specified blueprint.
   */
  startBlueprintRun(params: Glue.Types.StartBlueprintRunRequest, callback?: (err: AWSError, data: Glue.Types.StartBlueprintRunResponse) => void): Request<Glue.Types.StartBlueprintRunResponse, AWSError>;
  /**
   * Starts a new run of the specified blueprint.
   */
  startBlueprintRun(callback?: (err: AWSError, data: Glue.Types.StartBlueprintRunResponse) => void): Request<Glue.Types.StartBlueprintRunResponse, AWSError>;
  /**
   * Starts a crawl using the specified crawler, regardless of what is scheduled. If the crawler is already running, returns a CrawlerRunningException.
   */
  startCrawler(params: Glue.Types.StartCrawlerRequest, callback?: (err: AWSError, data: Glue.Types.StartCrawlerResponse) => void): Request<Glue.Types.StartCrawlerResponse, AWSError>;
  /**
   * Starts a crawl using the specified crawler, regardless of what is scheduled. If the crawler is already running, returns a CrawlerRunningException.
   */
  startCrawler(callback?: (err: AWSError, data: Glue.Types.StartCrawlerResponse) => void): Request<Glue.Types.StartCrawlerResponse, AWSError>;
  /**
   * Changes the schedule state of the specified crawler to SCHEDULED, unless the crawler is already running or the schedule state is already SCHEDULED.
   */
  startCrawlerSchedule(params: Glue.Types.StartCrawlerScheduleRequest, callback?: (err: AWSError, data: Glue.Types.StartCrawlerScheduleResponse) => void): Request<Glue.Types.StartCrawlerScheduleResponse, AWSError>;
  /**
   * Changes the schedule state of the specified crawler to SCHEDULED, unless the crawler is already running or the schedule state is already SCHEDULED.
   */
  startCrawlerSchedule(callback?: (err: AWSError, data: Glue.Types.StartCrawlerScheduleResponse) => void): Request<Glue.Types.StartCrawlerScheduleResponse, AWSError>;
  /**
   * Starts a recommendation run that is used to generate rules when you don't know what rules to write. Glue Data Quality analyzes the data and comes up with recommendations for a potential ruleset. You can then triage the ruleset and modify the generated ruleset to your liking.
   */
  startDataQualityRuleRecommendationRun(params: Glue.Types.StartDataQualityRuleRecommendationRunRequest, callback?: (err: AWSError, data: Glue.Types.StartDataQualityRuleRecommendationRunResponse) => void): Request<Glue.Types.StartDataQualityRuleRecommendationRunResponse, AWSError>;
  /**
   * Starts a recommendation run that is used to generate rules when you don't know what rules to write. Glue Data Quality analyzes the data and comes up with recommendations for a potential ruleset. You can then triage the ruleset and modify the generated ruleset to your liking.
   */
  startDataQualityRuleRecommendationRun(callback?: (err: AWSError, data: Glue.Types.StartDataQualityRuleRecommendationRunResponse) => void): Request<Glue.Types.StartDataQualityRuleRecommendationRunResponse, AWSError>;
  /**
   * Once you have a ruleset definition (either recommended or your own), you call this operation to evaluate the ruleset against a data source (Glue table). The evaluation computes results which you can retrieve with the GetDataQualityResult API.
   */
  startDataQualityRulesetEvaluationRun(params: Glue.Types.StartDataQualityRulesetEvaluationRunRequest, callback?: (err: AWSError, data: Glue.Types.StartDataQualityRulesetEvaluationRunResponse) => void): Request<Glue.Types.StartDataQualityRulesetEvaluationRunResponse, AWSError>;
  /**
   * Once you have a ruleset definition (either recommended or your own), you call this operation to evaluate the ruleset against a data source (Glue table). The evaluation computes results which you can retrieve with the GetDataQualityResult API.
   */
  startDataQualityRulesetEvaluationRun(callback?: (err: AWSError, data: Glue.Types.StartDataQualityRulesetEvaluationRunResponse) => void): Request<Glue.Types.StartDataQualityRulesetEvaluationRunResponse, AWSError>;
  /**
   * Begins an asynchronous task to export all labeled data for a particular transform. This task is the only label-related API call that is not part of the typical active learning workflow. You typically use StartExportLabelsTaskRun when you want to work with all of your existing labels at the same time, such as when you want to remove or change labels that were previously submitted as truth. This API operation accepts the TransformId whose labels you want to export and an Amazon Simple Storage Service (Amazon S3) path to export the labels to. The operation returns a TaskRunId. You can check on the status of your task run by calling the GetMLTaskRun API.
   */
  startExportLabelsTaskRun(params: Glue.Types.StartExportLabelsTaskRunRequest, callback?: (err: AWSError, data: Glue.Types.StartExportLabelsTaskRunResponse) => void): Request<Glue.Types.StartExportLabelsTaskRunResponse, AWSError>;
  /**
   * Begins an asynchronous task to export all labeled data for a particular transform. This task is the only label-related API call that is not part of the typical active learning workflow. You typically use StartExportLabelsTaskRun when you want to work with all of your existing labels at the same time, such as when you want to remove or change labels that were previously submitted as truth. This API operation accepts the TransformId whose labels you want to export and an Amazon Simple Storage Service (Amazon S3) path to export the labels to. The operation returns a TaskRunId. You can check on the status of your task run by calling the GetMLTaskRun API.
   */
  startExportLabelsTaskRun(callback?: (err: AWSError, data: Glue.Types.StartExportLabelsTaskRunResponse) => void): Request<Glue.Types.StartExportLabelsTaskRunResponse, AWSError>;
  /**
   * Enables you to provide additional labels (examples of truth) to be used to teach the machine learning transform and improve its quality. This API operation is generally used as part of the active learning workflow that starts with the StartMLLabelingSetGenerationTaskRun call and that ultimately results in improving the quality of your machine learning transform.  After the StartMLLabelingSetGenerationTaskRun finishes, Glue machine learning will have generated a series of questions for humans to answer. (Answering these questions is often called 'labeling' in the machine learning workflows). In the case of the FindMatches transform, these questions are of the form, “What is the correct way to group these rows together into groups composed entirely of matching records?” After the labeling process is finished, users upload their answers/labels with a call to StartImportLabelsTaskRun. After StartImportLabelsTaskRun finishes, all future runs of the machine learning transform use the new and improved labels and perform a higher-quality transformation. By default, StartMLLabelingSetGenerationTaskRun continually learns from and combines all labels that you upload unless you set Replace to true. If you set Replace to true, StartImportLabelsTaskRun deletes and forgets all previously uploaded labels and learns only from the exact set that you upload. Replacing labels can be helpful if you realize that you previously uploaded incorrect labels, and you believe that they are having a negative effect on your transform quality. You can check on the status of your task run by calling the GetMLTaskRun operation. 
   */
  startImportLabelsTaskRun(params: Glue.Types.StartImportLabelsTaskRunRequest, callback?: (err: AWSError, data: Glue.Types.StartImportLabelsTaskRunResponse) => void): Request<Glue.Types.StartImportLabelsTaskRunResponse, AWSError>;
  /**
   * Enables you to provide additional labels (examples of truth) to be used to teach the machine learning transform and improve its quality. This API operation is generally used as part of the active learning workflow that starts with the StartMLLabelingSetGenerationTaskRun call and that ultimately results in improving the quality of your machine learning transform.  After the StartMLLabelingSetGenerationTaskRun finishes, Glue machine learning will have generated a series of questions for humans to answer. (Answering these questions is often called 'labeling' in the machine learning workflows). In the case of the FindMatches transform, these questions are of the form, “What is the correct way to group these rows together into groups composed entirely of matching records?” After the labeling process is finished, users upload their answers/labels with a call to StartImportLabelsTaskRun. After StartImportLabelsTaskRun finishes, all future runs of the machine learning transform use the new and improved labels and perform a higher-quality transformation. By default, StartMLLabelingSetGenerationTaskRun continually learns from and combines all labels that you upload unless you set Replace to true. If you set Replace to true, StartImportLabelsTaskRun deletes and forgets all previously uploaded labels and learns only from the exact set that you upload. Replacing labels can be helpful if you realize that you previously uploaded incorrect labels, and you believe that they are having a negative effect on your transform quality. You can check on the status of your task run by calling the GetMLTaskRun operation. 
   */
  startImportLabelsTaskRun(callback?: (err: AWSError, data: Glue.Types.StartImportLabelsTaskRunResponse) => void): Request<Glue.Types.StartImportLabelsTaskRunResponse, AWSError>;
  /**
   * Starts a job run using a job definition.
   */
  startJobRun(params: Glue.Types.StartJobRunRequest, callback?: (err: AWSError, data: Glue.Types.StartJobRunResponse) => void): Request<Glue.Types.StartJobRunResponse, AWSError>;
  /**
   * Starts a job run using a job definition.
   */
  startJobRun(callback?: (err: AWSError, data: Glue.Types.StartJobRunResponse) => void): Request<Glue.Types.StartJobRunResponse, AWSError>;
  /**
   * Starts a task to estimate the quality of the transform.  When you provide label sets as examples of truth, Glue machine learning uses some of those examples to learn from them. The rest of the labels are used as a test to estimate quality. Returns a unique identifier for the run. You can call GetMLTaskRun to get more information about the stats of the EvaluationTaskRun.
   */
  startMLEvaluationTaskRun(params: Glue.Types.StartMLEvaluationTaskRunRequest, callback?: (err: AWSError, data: Glue.Types.StartMLEvaluationTaskRunResponse) => void): Request<Glue.Types.StartMLEvaluationTaskRunResponse, AWSError>;
  /**
   * Starts a task to estimate the quality of the transform.  When you provide label sets as examples of truth, Glue machine learning uses some of those examples to learn from them. The rest of the labels are used as a test to estimate quality. Returns a unique identifier for the run. You can call GetMLTaskRun to get more information about the stats of the EvaluationTaskRun.
   */
  startMLEvaluationTaskRun(callback?: (err: AWSError, data: Glue.Types.StartMLEvaluationTaskRunResponse) => void): Request<Glue.Types.StartMLEvaluationTaskRunResponse, AWSError>;
  /**
   * Starts the active learning workflow for your machine learning transform to improve the transform's quality by generating label sets and adding labels. When the StartMLLabelingSetGenerationTaskRun finishes, Glue will have generated a "labeling set" or a set of questions for humans to answer. In the case of the FindMatches transform, these questions are of the form, “What is the correct way to group these rows together into groups composed entirely of matching records?”  After the labeling process is finished, you can upload your labels with a call to StartImportLabelsTaskRun. After StartImportLabelsTaskRun finishes, all future runs of the machine learning transform will use the new and improved labels and perform a higher-quality transformation.
   */
  startMLLabelingSetGenerationTaskRun(params: Glue.Types.StartMLLabelingSetGenerationTaskRunRequest, callback?: (err: AWSError, data: Glue.Types.StartMLLabelingSetGenerationTaskRunResponse) => void): Request<Glue.Types.StartMLLabelingSetGenerationTaskRunResponse, AWSError>;
  /**
   * Starts the active learning workflow for your machine learning transform to improve the transform's quality by generating label sets and adding labels. When the StartMLLabelingSetGenerationTaskRun finishes, Glue will have generated a "labeling set" or a set of questions for humans to answer. In the case of the FindMatches transform, these questions are of the form, “What is the correct way to group these rows together into groups composed entirely of matching records?”  After the labeling process is finished, you can upload your labels with a call to StartImportLabelsTaskRun. After StartImportLabelsTaskRun finishes, all future runs of the machine learning transform will use the new and improved labels and perform a higher-quality transformation.
   */
  startMLLabelingSetGenerationTaskRun(callback?: (err: AWSError, data: Glue.Types.StartMLLabelingSetGenerationTaskRunResponse) => void): Request<Glue.Types.StartMLLabelingSetGenerationTaskRunResponse, AWSError>;
  /**
   * Starts an existing trigger. See Triggering Jobs for information about how different types of trigger are started.
   */
  startTrigger(params: Glue.Types.StartTriggerRequest, callback?: (err: AWSError, data: Glue.Types.StartTriggerResponse) => void): Request<Glue.Types.StartTriggerResponse, AWSError>;
  /**
   * Starts an existing trigger. See Triggering Jobs for information about how different types of trigger are started.
   */
  startTrigger(callback?: (err: AWSError, data: Glue.Types.StartTriggerResponse) => void): Request<Glue.Types.StartTriggerResponse, AWSError>;
  /**
   * Starts a new run of the specified workflow.
   */
  startWorkflowRun(params: Glue.Types.StartWorkflowRunRequest, callback?: (err: AWSError, data: Glue.Types.StartWorkflowRunResponse) => void): Request<Glue.Types.StartWorkflowRunResponse, AWSError>;
  /**
   * Starts a new run of the specified workflow.
   */
  startWorkflowRun(callback?: (err: AWSError, data: Glue.Types.StartWorkflowRunResponse) => void): Request<Glue.Types.StartWorkflowRunResponse, AWSError>;
  /**
   * If the specified crawler is running, stops the crawl.
   */
  stopCrawler(params: Glue.Types.StopCrawlerRequest, callback?: (err: AWSError, data: Glue.Types.StopCrawlerResponse) => void): Request<Glue.Types.StopCrawlerResponse, AWSError>;
  /**
   * If the specified crawler is running, stops the crawl.
   */
  stopCrawler(callback?: (err: AWSError, data: Glue.Types.StopCrawlerResponse) => void): Request<Glue.Types.StopCrawlerResponse, AWSError>;
  /**
   * Sets the schedule state of the specified crawler to NOT_SCHEDULED, but does not stop the crawler if it is already running.
   */
  stopCrawlerSchedule(params: Glue.Types.StopCrawlerScheduleRequest, callback?: (err: AWSError, data: Glue.Types.StopCrawlerScheduleResponse) => void): Request<Glue.Types.StopCrawlerScheduleResponse, AWSError>;
  /**
   * Sets the schedule state of the specified crawler to NOT_SCHEDULED, but does not stop the crawler if it is already running.
   */
  stopCrawlerSchedule(callback?: (err: AWSError, data: Glue.Types.StopCrawlerScheduleResponse) => void): Request<Glue.Types.StopCrawlerScheduleResponse, AWSError>;
  /**
   * Stops the session.
   */
  stopSession(params: Glue.Types.StopSessionRequest, callback?: (err: AWSError, data: Glue.Types.StopSessionResponse) => void): Request<Glue.Types.StopSessionResponse, AWSError>;
  /**
   * Stops the session.
   */
  stopSession(callback?: (err: AWSError, data: Glue.Types.StopSessionResponse) => void): Request<Glue.Types.StopSessionResponse, AWSError>;
  /**
   * Stops a specified trigger.
   */
  stopTrigger(params: Glue.Types.StopTriggerRequest, callback?: (err: AWSError, data: Glue.Types.StopTriggerResponse) => void): Request<Glue.Types.StopTriggerResponse, AWSError>;
  /**
   * Stops a specified trigger.
   */
  stopTrigger(callback?: (err: AWSError, data: Glue.Types.StopTriggerResponse) => void): Request<Glue.Types.StopTriggerResponse, AWSError>;
  /**
   * Stops the execution of the specified workflow run.
   */
  stopWorkflowRun(params: Glue.Types.StopWorkflowRunRequest, callback?: (err: AWSError, data: Glue.Types.StopWorkflowRunResponse) => void): Request<Glue.Types.StopWorkflowRunResponse, AWSError>;
  /**
   * Stops the execution of the specified workflow run.
   */
  stopWorkflowRun(callback?: (err: AWSError, data: Glue.Types.StopWorkflowRunResponse) => void): Request<Glue.Types.StopWorkflowRunResponse, AWSError>;
  /**
   * Adds tags to a resource. A tag is a label you can assign to an Amazon Web Services resource. In Glue, you can tag only certain resources. For information about what resources you can tag, see Amazon Web Services Tags in Glue.
   */
  tagResource(params: Glue.Types.TagResourceRequest, callback?: (err: AWSError, data: Glue.Types.TagResourceResponse) => void): Request<Glue.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to a resource. A tag is a label you can assign to an Amazon Web Services resource. In Glue, you can tag only certain resources. For information about what resources you can tag, see Amazon Web Services Tags in Glue.
   */
  tagResource(callback?: (err: AWSError, data: Glue.Types.TagResourceResponse) => void): Request<Glue.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(params: Glue.Types.UntagResourceRequest, callback?: (err: AWSError, data: Glue.Types.UntagResourceResponse) => void): Request<Glue.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: Glue.Types.UntagResourceResponse) => void): Request<Glue.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a registered blueprint.
   */
  updateBlueprint(params: Glue.Types.UpdateBlueprintRequest, callback?: (err: AWSError, data: Glue.Types.UpdateBlueprintResponse) => void): Request<Glue.Types.UpdateBlueprintResponse, AWSError>;
  /**
   * Updates a registered blueprint.
   */
  updateBlueprint(callback?: (err: AWSError, data: Glue.Types.UpdateBlueprintResponse) => void): Request<Glue.Types.UpdateBlueprintResponse, AWSError>;
  /**
   * Modifies an existing classifier (a GrokClassifier, an XMLClassifier, a JsonClassifier, or a CsvClassifier, depending on which field is present).
   */
  updateClassifier(params: Glue.Types.UpdateClassifierRequest, callback?: (err: AWSError, data: Glue.Types.UpdateClassifierResponse) => void): Request<Glue.Types.UpdateClassifierResponse, AWSError>;
  /**
   * Modifies an existing classifier (a GrokClassifier, an XMLClassifier, a JsonClassifier, or a CsvClassifier, depending on which field is present).
   */
  updateClassifier(callback?: (err: AWSError, data: Glue.Types.UpdateClassifierResponse) => void): Request<Glue.Types.UpdateClassifierResponse, AWSError>;
  /**
   * Creates or updates partition statistics of columns. The Identity and Access Management (IAM) permission required for this operation is UpdatePartition.
   */
  updateColumnStatisticsForPartition(params: Glue.Types.UpdateColumnStatisticsForPartitionRequest, callback?: (err: AWSError, data: Glue.Types.UpdateColumnStatisticsForPartitionResponse) => void): Request<Glue.Types.UpdateColumnStatisticsForPartitionResponse, AWSError>;
  /**
   * Creates or updates partition statistics of columns. The Identity and Access Management (IAM) permission required for this operation is UpdatePartition.
   */
  updateColumnStatisticsForPartition(callback?: (err: AWSError, data: Glue.Types.UpdateColumnStatisticsForPartitionResponse) => void): Request<Glue.Types.UpdateColumnStatisticsForPartitionResponse, AWSError>;
  /**
   * Creates or updates table statistics of columns. The Identity and Access Management (IAM) permission required for this operation is UpdateTable.
   */
  updateColumnStatisticsForTable(params: Glue.Types.UpdateColumnStatisticsForTableRequest, callback?: (err: AWSError, data: Glue.Types.UpdateColumnStatisticsForTableResponse) => void): Request<Glue.Types.UpdateColumnStatisticsForTableResponse, AWSError>;
  /**
   * Creates or updates table statistics of columns. The Identity and Access Management (IAM) permission required for this operation is UpdateTable.
   */
  updateColumnStatisticsForTable(callback?: (err: AWSError, data: Glue.Types.UpdateColumnStatisticsForTableResponse) => void): Request<Glue.Types.UpdateColumnStatisticsForTableResponse, AWSError>;
  /**
   * Updates a connection definition in the Data Catalog.
   */
  updateConnection(params: Glue.Types.UpdateConnectionRequest, callback?: (err: AWSError, data: Glue.Types.UpdateConnectionResponse) => void): Request<Glue.Types.UpdateConnectionResponse, AWSError>;
  /**
   * Updates a connection definition in the Data Catalog.
   */
  updateConnection(callback?: (err: AWSError, data: Glue.Types.UpdateConnectionResponse) => void): Request<Glue.Types.UpdateConnectionResponse, AWSError>;
  /**
   * Updates a crawler. If a crawler is running, you must stop it using StopCrawler before updating it.
   */
  updateCrawler(params: Glue.Types.UpdateCrawlerRequest, callback?: (err: AWSError, data: Glue.Types.UpdateCrawlerResponse) => void): Request<Glue.Types.UpdateCrawlerResponse, AWSError>;
  /**
   * Updates a crawler. If a crawler is running, you must stop it using StopCrawler before updating it.
   */
  updateCrawler(callback?: (err: AWSError, data: Glue.Types.UpdateCrawlerResponse) => void): Request<Glue.Types.UpdateCrawlerResponse, AWSError>;
  /**
   * Updates the schedule of a crawler using a cron expression. 
   */
  updateCrawlerSchedule(params: Glue.Types.UpdateCrawlerScheduleRequest, callback?: (err: AWSError, data: Glue.Types.UpdateCrawlerScheduleResponse) => void): Request<Glue.Types.UpdateCrawlerScheduleResponse, AWSError>;
  /**
   * Updates the schedule of a crawler using a cron expression. 
   */
  updateCrawlerSchedule(callback?: (err: AWSError, data: Glue.Types.UpdateCrawlerScheduleResponse) => void): Request<Glue.Types.UpdateCrawlerScheduleResponse, AWSError>;
  /**
   * Updates the specified data quality ruleset.
   */
  updateDataQualityRuleset(params: Glue.Types.UpdateDataQualityRulesetRequest, callback?: (err: AWSError, data: Glue.Types.UpdateDataQualityRulesetResponse) => void): Request<Glue.Types.UpdateDataQualityRulesetResponse, AWSError>;
  /**
   * Updates the specified data quality ruleset.
   */
  updateDataQualityRuleset(callback?: (err: AWSError, data: Glue.Types.UpdateDataQualityRulesetResponse) => void): Request<Glue.Types.UpdateDataQualityRulesetResponse, AWSError>;
  /**
   * Updates an existing database definition in a Data Catalog.
   */
  updateDatabase(params: Glue.Types.UpdateDatabaseRequest, callback?: (err: AWSError, data: Glue.Types.UpdateDatabaseResponse) => void): Request<Glue.Types.UpdateDatabaseResponse, AWSError>;
  /**
   * Updates an existing database definition in a Data Catalog.
   */
  updateDatabase(callback?: (err: AWSError, data: Glue.Types.UpdateDatabaseResponse) => void): Request<Glue.Types.UpdateDatabaseResponse, AWSError>;
  /**
   * Updates a specified development endpoint.
   */
  updateDevEndpoint(params: Glue.Types.UpdateDevEndpointRequest, callback?: (err: AWSError, data: Glue.Types.UpdateDevEndpointResponse) => void): Request<Glue.Types.UpdateDevEndpointResponse, AWSError>;
  /**
   * Updates a specified development endpoint.
   */
  updateDevEndpoint(callback?: (err: AWSError, data: Glue.Types.UpdateDevEndpointResponse) => void): Request<Glue.Types.UpdateDevEndpointResponse, AWSError>;
  /**
   * Updates an existing job definition. The previous job definition is completely overwritten by this information.
   */
  updateJob(params: Glue.Types.UpdateJobRequest, callback?: (err: AWSError, data: Glue.Types.UpdateJobResponse) => void): Request<Glue.Types.UpdateJobResponse, AWSError>;
  /**
   * Updates an existing job definition. The previous job definition is completely overwritten by this information.
   */
  updateJob(callback?: (err: AWSError, data: Glue.Types.UpdateJobResponse) => void): Request<Glue.Types.UpdateJobResponse, AWSError>;
  /**
   * Synchronizes a job from the source control repository. This operation takes the job artifacts that are located in the remote repository and updates the Glue internal stores with these artifacts. This API supports optional parameters which take in the repository information.
   */
  updateJobFromSourceControl(params: Glue.Types.UpdateJobFromSourceControlRequest, callback?: (err: AWSError, data: Glue.Types.UpdateJobFromSourceControlResponse) => void): Request<Glue.Types.UpdateJobFromSourceControlResponse, AWSError>;
  /**
   * Synchronizes a job from the source control repository. This operation takes the job artifacts that are located in the remote repository and updates the Glue internal stores with these artifacts. This API supports optional parameters which take in the repository information.
   */
  updateJobFromSourceControl(callback?: (err: AWSError, data: Glue.Types.UpdateJobFromSourceControlResponse) => void): Request<Glue.Types.UpdateJobFromSourceControlResponse, AWSError>;
  /**
   * Updates an existing machine learning transform. Call this operation to tune the algorithm parameters to achieve better results. After calling this operation, you can call the StartMLEvaluationTaskRun operation to assess how well your new parameters achieved your goals (such as improving the quality of your machine learning transform, or making it more cost-effective).
   */
  updateMLTransform(params: Glue.Types.UpdateMLTransformRequest, callback?: (err: AWSError, data: Glue.Types.UpdateMLTransformResponse) => void): Request<Glue.Types.UpdateMLTransformResponse, AWSError>;
  /**
   * Updates an existing machine learning transform. Call this operation to tune the algorithm parameters to achieve better results. After calling this operation, you can call the StartMLEvaluationTaskRun operation to assess how well your new parameters achieved your goals (such as improving the quality of your machine learning transform, or making it more cost-effective).
   */
  updateMLTransform(callback?: (err: AWSError, data: Glue.Types.UpdateMLTransformResponse) => void): Request<Glue.Types.UpdateMLTransformResponse, AWSError>;
  /**
   * Updates a partition.
   */
  updatePartition(params: Glue.Types.UpdatePartitionRequest, callback?: (err: AWSError, data: Glue.Types.UpdatePartitionResponse) => void): Request<Glue.Types.UpdatePartitionResponse, AWSError>;
  /**
   * Updates a partition.
   */
  updatePartition(callback?: (err: AWSError, data: Glue.Types.UpdatePartitionResponse) => void): Request<Glue.Types.UpdatePartitionResponse, AWSError>;
  /**
   * Updates an existing registry which is used to hold a collection of schemas. The updated properties relate to the registry, and do not modify any of the schemas within the registry. 
   */
  updateRegistry(params: Glue.Types.UpdateRegistryInput, callback?: (err: AWSError, data: Glue.Types.UpdateRegistryResponse) => void): Request<Glue.Types.UpdateRegistryResponse, AWSError>;
  /**
   * Updates an existing registry which is used to hold a collection of schemas. The updated properties relate to the registry, and do not modify any of the schemas within the registry. 
   */
  updateRegistry(callback?: (err: AWSError, data: Glue.Types.UpdateRegistryResponse) => void): Request<Glue.Types.UpdateRegistryResponse, AWSError>;
  /**
   * Updates the description, compatibility setting, or version checkpoint for a schema set. For updating the compatibility setting, the call will not validate compatibility for the entire set of schema versions with the new compatibility setting. If the value for Compatibility is provided, the VersionNumber (a checkpoint) is also required. The API will validate the checkpoint version number for consistency. If the value for the VersionNumber (checkpoint) is provided, Compatibility is optional and this can be used to set/reset a checkpoint for the schema. This update will happen only if the schema is in the AVAILABLE state.
   */
  updateSchema(params: Glue.Types.UpdateSchemaInput, callback?: (err: AWSError, data: Glue.Types.UpdateSchemaResponse) => void): Request<Glue.Types.UpdateSchemaResponse, AWSError>;
  /**
   * Updates the description, compatibility setting, or version checkpoint for a schema set. For updating the compatibility setting, the call will not validate compatibility for the entire set of schema versions with the new compatibility setting. If the value for Compatibility is provided, the VersionNumber (a checkpoint) is also required. The API will validate the checkpoint version number for consistency. If the value for the VersionNumber (checkpoint) is provided, Compatibility is optional and this can be used to set/reset a checkpoint for the schema. This update will happen only if the schema is in the AVAILABLE state.
   */
  updateSchema(callback?: (err: AWSError, data: Glue.Types.UpdateSchemaResponse) => void): Request<Glue.Types.UpdateSchemaResponse, AWSError>;
  /**
   * Synchronizes a job to the source control repository. This operation takes the job artifacts from the Glue internal stores and makes a commit to the remote repository that is configured on the job. This API supports optional parameters which take in the repository information.
   */
  updateSourceControlFromJob(params: Glue.Types.UpdateSourceControlFromJobRequest, callback?: (err: AWSError, data: Glue.Types.UpdateSourceControlFromJobResponse) => void): Request<Glue.Types.UpdateSourceControlFromJobResponse, AWSError>;
  /**
   * Synchronizes a job to the source control repository. This operation takes the job artifacts from the Glue internal stores and makes a commit to the remote repository that is configured on the job. This API supports optional parameters which take in the repository information.
   */
  updateSourceControlFromJob(callback?: (err: AWSError, data: Glue.Types.UpdateSourceControlFromJobResponse) => void): Request<Glue.Types.UpdateSourceControlFromJobResponse, AWSError>;
  /**
   * Updates a metadata table in the Data Catalog.
   */
  updateTable(params: Glue.Types.UpdateTableRequest, callback?: (err: AWSError, data: Glue.Types.UpdateTableResponse) => void): Request<Glue.Types.UpdateTableResponse, AWSError>;
  /**
   * Updates a metadata table in the Data Catalog.
   */
  updateTable(callback?: (err: AWSError, data: Glue.Types.UpdateTableResponse) => void): Request<Glue.Types.UpdateTableResponse, AWSError>;
  /**
   * Updates a trigger definition.
   */
  updateTrigger(params: Glue.Types.UpdateTriggerRequest, callback?: (err: AWSError, data: Glue.Types.UpdateTriggerResponse) => void): Request<Glue.Types.UpdateTriggerResponse, AWSError>;
  /**
   * Updates a trigger definition.
   */
  updateTrigger(callback?: (err: AWSError, data: Glue.Types.UpdateTriggerResponse) => void): Request<Glue.Types.UpdateTriggerResponse, AWSError>;
  /**
   * Updates an existing function definition in the Data Catalog.
   */
  updateUserDefinedFunction(params: Glue.Types.UpdateUserDefinedFunctionRequest, callback?: (err: AWSError, data: Glue.Types.UpdateUserDefinedFunctionResponse) => void): Request<Glue.Types.UpdateUserDefinedFunctionResponse, AWSError>;
  /**
   * Updates an existing function definition in the Data Catalog.
   */
  updateUserDefinedFunction(callback?: (err: AWSError, data: Glue.Types.UpdateUserDefinedFunctionResponse) => void): Request<Glue.Types.UpdateUserDefinedFunctionResponse, AWSError>;
  /**
   * Updates an existing workflow.
   */
  updateWorkflow(params: Glue.Types.UpdateWorkflowRequest, callback?: (err: AWSError, data: Glue.Types.UpdateWorkflowResponse) => void): Request<Glue.Types.UpdateWorkflowResponse, AWSError>;
  /**
   * Updates an existing workflow.
   */
  updateWorkflow(callback?: (err: AWSError, data: Glue.Types.UpdateWorkflowResponse) => void): Request<Glue.Types.UpdateWorkflowResponse, AWSError>;
}
declare namespace Glue {
  export type AccountId = string;
  export interface Action {
    /**
     * The name of a job to be run.
     */
    JobName?: NameString;
    /**
     * The job arguments used when this trigger fires. For this job run, they replace the default arguments set in the job definition itself. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the key-value pairs that Glue consumes to set up your job, see the Special Parameters Used by Glue topic in the developer guide.
     */
    Arguments?: GenericMap;
    /**
     * The JobRun timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours). This overrides the timeout value set in the parent job.
     */
    Timeout?: Timeout;
    /**
     * The name of the SecurityConfiguration structure to be used with this action.
     */
    SecurityConfiguration?: NameString;
    /**
     * Specifies configuration properties of a job run notification.
     */
    NotificationProperty?: NotificationProperty;
    /**
     * The name of the crawler to be used with this action.
     */
    CrawlerName?: NameString;
  }
  export type ActionList = Action[];
  export type AdditionalOptionKeys = "performanceTuning.caching"|string;
  export type AdditionalOptions = {[key: string]: EnclosedInStringProperty};
  export type AdditionalPlanOptionsMap = {[key: string]: GenericString};
  export type AggFunction = "avg"|"countDistinct"|"count"|"first"|"last"|"kurtosis"|"max"|"min"|"skewness"|"stddev_samp"|"stddev_pop"|"sum"|"sumDistinct"|"var_samp"|"var_pop"|string;
  export interface Aggregate {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * Specifies the fields and rows to use as inputs for the aggregate transform.
     */
    Inputs: OneInput;
    /**
     * Specifies the fields to group by.
     */
    Groups: GlueStudioPathList;
    /**
     * Specifies the aggregate functions to be performed on specified fields. 
     */
    Aggs: AggregateOperations;
  }
  export interface AggregateOperation {
    /**
     * Specifies the column on the data set on which the aggregation function will be applied.
     */
    Column: EnclosedInStringProperties;
    /**
     * Specifies the aggregation function to apply. Possible aggregation functions include: avg countDistinct, count, first, last, kurtosis, max, min, skewness, stddev_samp, stddev_pop, sum, sumDistinct, var_samp, var_pop
     */
    AggFunc: AggFunction;
  }
  export type AggregateOperations = AggregateOperation[];
  export interface AmazonRedshiftAdvancedOption {
    /**
     * The key for the additional connection option.
     */
    Key?: GenericString;
    /**
     * The value for the additional connection option.
     */
    Value?: GenericString;
  }
  export type AmazonRedshiftAdvancedOptions = AmazonRedshiftAdvancedOption[];
  export interface AmazonRedshiftNodeData {
    /**
     * The access type for the Redshift connection. Can be a direct connection or catalog connections.
     */
    AccessType?: GenericLimitedString;
    /**
     * The source type to specify whether a specific table is the source or a custom query.
     */
    SourceType?: GenericLimitedString;
    /**
     * The Glue connection to the Redshift cluster.
     */
    Connection?: Option;
    /**
     * The Redshift schema name when working with a direct connection.
     */
    Schema?: Option;
    /**
     * The Redshift table name when working with a direct connection.
     */
    Table?: Option;
    /**
     * The name of the Glue Data Catalog database when working with a data catalog.
     */
    CatalogDatabase?: Option;
    /**
     * The Glue Data Catalog table name when working with a data catalog.
     */
    CatalogTable?: Option;
    /**
     * The Redshift schema name when working with a data catalog.
     */
    CatalogRedshiftSchema?: GenericString;
    /**
     * The database table to read from.
     */
    CatalogRedshiftTable?: GenericString;
    /**
     * The Amazon S3 path where temporary data can be staged when copying out of the database.
     */
    TempDir?: EnclosedInStringProperty;
    /**
     * Optional. The role name use when connection to S3. The IAM role ill default to the role on the job when left blank.
     */
    IamRole?: Option;
    /**
     * Optional values when connecting to the Redshift cluster.
     */
    AdvancedOptions?: AmazonRedshiftAdvancedOptions;
    /**
     * The SQL used to fetch the data from a Redshift sources when the SourceType is 'query'.
     */
    SampleQuery?: GenericString;
    /**
     * The SQL used before a MERGE or APPEND with upsert is run.
     */
    PreAction?: GenericString;
    /**
     * The SQL used before a MERGE or APPEND with upsert is run.
     */
    PostAction?: GenericString;
    /**
     * Specifies how writing to a Redshift cluser will occur.
     */
    Action?: GenericString;
    /**
     * Specifies the prefix to a table.
     */
    TablePrefix?: GenericLimitedString;
    /**
     * The action used on Redshift sinks when doing an APPEND.
     */
    Upsert?: BooleanValue;
    /**
     * The action used when to detemine how a MERGE in a Redshift sink will be handled.
     */
    MergeAction?: GenericLimitedString;
    /**
     * The action used when to detemine how a MERGE in a Redshift sink will be handled when an existing record matches a new record.
     */
    MergeWhenMatched?: GenericLimitedString;
    /**
     * The action used when to detemine how a MERGE in a Redshift sink will be handled when an existing record doesn't match a new record.
     */
    MergeWhenNotMatched?: GenericLimitedString;
    /**
     * The SQL used in a custom merge to deal with matching records.
     */
    MergeClause?: GenericString;
    /**
     * Specifies the name of the connection that is associated with the catalog table used.
     */
    CrawlerConnection?: GenericString;
    /**
     * The array of schema output for a given node.
     */
    TableSchema?: OptionList;
    /**
     * The name of the temporary staging table that is used when doing a MERGE or APPEND with upsert.
     */
    StagingTable?: GenericString;
    /**
     * The list of column names used to determine a matching record when doing a MERGE or APPEND with upsert.
     */
    SelectedColumns?: OptionList;
  }
  export interface AmazonRedshiftSource {
    /**
     * The name of the Amazon Redshift source.
     */
    Name?: NodeName;
    /**
     * Specifies the data of the Amazon Reshift source node.
     */
    Data?: AmazonRedshiftNodeData;
  }
  export interface AmazonRedshiftTarget {
    /**
     * The name of the Amazon Redshift target.
     */
    Name?: NodeName;
    /**
     * Specifies the data of the Amazon Redshift target node.
     */
    Data?: AmazonRedshiftNodeData;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs?: OneInput;
  }
  export interface ApplyMapping {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * Specifies the mapping of data property keys in the data source to data property keys in the data target.
     */
    Mapping: Mappings;
  }
  export interface AthenaConnectorSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the connection that is associated with the connector.
     */
    ConnectionName: EnclosedInStringProperty;
    /**
     * The name of a connector that assists with accessing the data store in Glue Studio.
     */
    ConnectorName: EnclosedInStringProperty;
    /**
     * The type of connection, such as marketplace.athena or custom.athena, designating a connection to an Amazon Athena data store.
     */
    ConnectionType: EnclosedInStringProperty;
    /**
     * The name of the table in the data source.
     */
    ConnectionTable?: EnclosedInStringPropertyWithQuote;
    /**
     * The name of the Cloudwatch log group to read from. For example, /aws-glue/jobs/output.
     */
    SchemaName: EnclosedInStringProperty;
    /**
     * Specifies the data schema for the custom Athena source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export type AttemptCount = number;
  export type AuditColumnNamesList = ColumnNameString[];
  export interface AuditContext {
    /**
     * A string containing the additional audit context information.
     */
    AdditionalAuditContext?: AuditContextString;
    /**
     * The requested columns for audit.
     */
    RequestedColumns?: AuditColumnNamesList;
    /**
     * All columns request for audit.
     */
    AllColumnsRequested?: NullableBoolean;
  }
  export type AuditContextString = string;
  export type AuthTokenString = string;
  export interface BackfillError {
    /**
     * The error code for an error that occurred when registering partition indexes for an existing table.
     */
    Code?: BackfillErrorCode;
    /**
     * A list of a limited number of partitions in the response.
     */
    Partitions?: BackfillErroredPartitionsList;
  }
  export type BackfillErrorCode = "ENCRYPTED_PARTITION_ERROR"|"INTERNAL_ERROR"|"INVALID_PARTITION_TYPE_DATA_ERROR"|"MISSING_PARTITION_VALUE_ERROR"|"UNSUPPORTED_PARTITION_CHARACTER_ERROR"|string;
  export type BackfillErroredPartitionsList = PartitionValueList[];
  export type BackfillErrors = BackfillError[];
  export interface BasicCatalogTarget {
    /**
     * The name of your data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The database that contains the table you want to use as the target. This database must already exist in the Data Catalog.
     */
    Database: EnclosedInStringProperty;
    /**
     * The table that defines the schema of your output data. This table must already exist in the Data Catalog.
     */
    Table: EnclosedInStringProperty;
  }
  export interface BatchCreatePartitionRequest {
    /**
     * The ID of the catalog in which the partition is to be created. Currently, this should be the Amazon Web Services account ID.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the metadata database in which the partition is to be created.
     */
    DatabaseName: NameString;
    /**
     * The name of the metadata table in which the partition is to be created.
     */
    TableName: NameString;
    /**
     * A list of PartitionInput structures that define the partitions to be created.
     */
    PartitionInputList: PartitionInputList;
  }
  export interface BatchCreatePartitionResponse {
    /**
     * The errors encountered when trying to create the requested partitions.
     */
    Errors?: PartitionErrors;
  }
  export interface BatchDeleteConnectionRequest {
    /**
     * The ID of the Data Catalog in which the connections reside. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * A list of names of the connections to delete.
     */
    ConnectionNameList: DeleteConnectionNameList;
  }
  export interface BatchDeleteConnectionResponse {
    /**
     * A list of names of the connection definitions that were successfully deleted.
     */
    Succeeded?: NameStringList;
    /**
     * A map of the names of connections that were not successfully deleted to error details.
     */
    Errors?: ErrorByName;
  }
  export interface BatchDeletePartitionRequest {
    /**
     * The ID of the Data Catalog where the partition to be deleted resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database in which the table in question resides.
     */
    DatabaseName: NameString;
    /**
     * The name of the table that contains the partitions to be deleted.
     */
    TableName: NameString;
    /**
     * A list of PartitionInput structures that define the partitions to be deleted.
     */
    PartitionsToDelete: BatchDeletePartitionValueList;
  }
  export interface BatchDeletePartitionResponse {
    /**
     * The errors encountered when trying to delete the requested partitions.
     */
    Errors?: PartitionErrors;
  }
  export type BatchDeletePartitionValueList = PartitionValueList[];
  export type BatchDeleteTableNameList = NameString[];
  export interface BatchDeleteTableRequest {
    /**
     * The ID of the Data Catalog where the table resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database in which the tables to delete reside. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * A list of the table to delete.
     */
    TablesToDelete: BatchDeleteTableNameList;
    /**
     * The transaction ID at which to delete the table contents.
     */
    TransactionId?: TransactionIdString;
  }
  export interface BatchDeleteTableResponse {
    /**
     * A list of errors encountered in attempting to delete the specified tables.
     */
    Errors?: TableErrors;
  }
  export type BatchDeleteTableVersionList = VersionString[];
  export interface BatchDeleteTableVersionRequest {
    /**
     * The ID of the Data Catalog where the tables reside. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database in the catalog in which the table resides. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * The name of the table. For Hive compatibility, this name is entirely lowercase.
     */
    TableName: NameString;
    /**
     * A list of the IDs of versions to be deleted. A VersionId is a string representation of an integer. Each version is incremented by 1.
     */
    VersionIds: BatchDeleteTableVersionList;
  }
  export interface BatchDeleteTableVersionResponse {
    /**
     * A list of errors encountered while trying to delete the specified table versions.
     */
    Errors?: TableVersionErrors;
  }
  export type BatchGetBlueprintNames = OrchestrationNameString[];
  export interface BatchGetBlueprintsRequest {
    /**
     * A list of blueprint names.
     */
    Names: BatchGetBlueprintNames;
    /**
     * Specifies whether or not to include the blueprint in the response.
     */
    IncludeBlueprint?: NullableBoolean;
    /**
     * Specifies whether or not to include the parameters, as a JSON string, for the blueprint in the response.
     */
    IncludeParameterSpec?: NullableBoolean;
  }
  export interface BatchGetBlueprintsResponse {
    /**
     * Returns a list of blueprint as a Blueprints object.
     */
    Blueprints?: Blueprints;
    /**
     * Returns a list of BlueprintNames that were not found.
     */
    MissingBlueprints?: BlueprintNames;
  }
  export interface BatchGetCrawlersRequest {
    /**
     * A list of crawler names, which might be the names returned from the ListCrawlers operation.
     */
    CrawlerNames: CrawlerNameList;
  }
  export interface BatchGetCrawlersResponse {
    /**
     * A list of crawler definitions.
     */
    Crawlers?: CrawlerList;
    /**
     * A list of names of crawlers that were not found.
     */
    CrawlersNotFound?: CrawlerNameList;
  }
  export interface BatchGetCustomEntityTypesRequest {
    /**
     * A list of names of the custom patterns that you want to retrieve.
     */
    Names: CustomEntityTypeNames;
  }
  export interface BatchGetCustomEntityTypesResponse {
    /**
     * A list of CustomEntityType objects representing the custom patterns that have been created.
     */
    CustomEntityTypes?: CustomEntityTypes;
    /**
     * A list of the names of custom patterns that were not found.
     */
    CustomEntityTypesNotFound?: CustomEntityTypeNames;
  }
  export interface BatchGetDataQualityResultRequest {
    /**
     * A list of unique result IDs for the data quality results.
     */
    ResultIds: DataQualityResultIds;
  }
  export interface BatchGetDataQualityResultResponse {
    /**
     * A list of DataQualityResult objects representing the data quality results.
     */
    Results: DataQualityResultsList;
    /**
     * A list of result IDs for which results were not found.
     */
    ResultsNotFound?: DataQualityResultIds;
  }
  export interface BatchGetDevEndpointsRequest {
    /**
     * The list of DevEndpoint names, which might be the names returned from the ListDevEndpoint operation.
     */
    DevEndpointNames: DevEndpointNames;
  }
  export interface BatchGetDevEndpointsResponse {
    /**
     * A list of DevEndpoint definitions.
     */
    DevEndpoints?: DevEndpointList;
    /**
     * A list of DevEndpoints not found.
     */
    DevEndpointsNotFound?: DevEndpointNames;
  }
  export interface BatchGetJobsRequest {
    /**
     * A list of job names, which might be the names returned from the ListJobs operation.
     */
    JobNames: JobNameList;
  }
  export interface BatchGetJobsResponse {
    /**
     * A list of job definitions.
     */
    Jobs?: JobList;
    /**
     * A list of names of jobs not found.
     */
    JobsNotFound?: JobNameList;
  }
  export interface BatchGetPartitionRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the partitions' table.
     */
    TableName: NameString;
    /**
     * A list of partition values identifying the partitions to retrieve.
     */
    PartitionsToGet: BatchGetPartitionValueList;
  }
  export interface BatchGetPartitionResponse {
    /**
     * A list of the requested partitions.
     */
    Partitions?: PartitionList;
    /**
     * A list of the partition values in the request for which partitions were not returned.
     */
    UnprocessedKeys?: BatchGetPartitionValueList;
  }
  export type BatchGetPartitionValueList = PartitionValueList[];
  export interface BatchGetTriggersRequest {
    /**
     * A list of trigger names, which may be the names returned from the ListTriggers operation.
     */
    TriggerNames: TriggerNameList;
  }
  export interface BatchGetTriggersResponse {
    /**
     * A list of trigger definitions.
     */
    Triggers?: TriggerList;
    /**
     * A list of names of triggers not found.
     */
    TriggersNotFound?: TriggerNameList;
  }
  export interface BatchGetWorkflowsRequest {
    /**
     * A list of workflow names, which may be the names returned from the ListWorkflows operation.
     */
    Names: WorkflowNames;
    /**
     * Specifies whether to include a graph when returning the workflow resource metadata.
     */
    IncludeGraph?: NullableBoolean;
  }
  export interface BatchGetWorkflowsResponse {
    /**
     * A list of workflow resource metadata.
     */
    Workflows?: Workflows;
    /**
     * A list of names of workflows not found.
     */
    MissingWorkflows?: WorkflowNames;
  }
  export type BatchSize = number;
  export interface BatchStopJobRunError {
    /**
     * The name of the job definition that is used in the job run in question.
     */
    JobName?: NameString;
    /**
     * The JobRunId of the job run in question.
     */
    JobRunId?: IdString;
    /**
     * Specifies details about the error that was encountered.
     */
    ErrorDetail?: ErrorDetail;
  }
  export type BatchStopJobRunErrorList = BatchStopJobRunError[];
  export type BatchStopJobRunJobRunIdList = IdString[];
  export interface BatchStopJobRunRequest {
    /**
     * The name of the job definition for which to stop job runs.
     */
    JobName: NameString;
    /**
     * A list of the JobRunIds that should be stopped for that job definition.
     */
    JobRunIds: BatchStopJobRunJobRunIdList;
  }
  export interface BatchStopJobRunResponse {
    /**
     * A list of the JobRuns that were successfully submitted for stopping.
     */
    SuccessfulSubmissions?: BatchStopJobRunSuccessfulSubmissionList;
    /**
     * A list of the errors that were encountered in trying to stop JobRuns, including the JobRunId for which each error was encountered and details about the error.
     */
    Errors?: BatchStopJobRunErrorList;
  }
  export interface BatchStopJobRunSuccessfulSubmission {
    /**
     * The name of the job definition used in the job run that was stopped.
     */
    JobName?: NameString;
    /**
     * The JobRunId of the job run that was stopped.
     */
    JobRunId?: IdString;
  }
  export type BatchStopJobRunSuccessfulSubmissionList = BatchStopJobRunSuccessfulSubmission[];
  export interface BatchUpdatePartitionFailureEntry {
    /**
     * A list of values defining the partitions.
     */
    PartitionValueList?: BoundedPartitionValueList;
    /**
     * The details about the batch update partition error.
     */
    ErrorDetail?: ErrorDetail;
  }
  export type BatchUpdatePartitionFailureList = BatchUpdatePartitionFailureEntry[];
  export interface BatchUpdatePartitionRequest {
    /**
     * The ID of the catalog in which the partition is to be updated. Currently, this should be the Amazon Web Services account ID.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the metadata database in which the partition is to be updated.
     */
    DatabaseName: NameString;
    /**
     * The name of the metadata table in which the partition is to be updated.
     */
    TableName: NameString;
    /**
     * A list of up to 100 BatchUpdatePartitionRequestEntry objects to update.
     */
    Entries: BatchUpdatePartitionRequestEntryList;
  }
  export interface BatchUpdatePartitionRequestEntry {
    /**
     * A list of values defining the partitions.
     */
    PartitionValueList: BoundedPartitionValueList;
    /**
     * The structure used to update a partition.
     */
    PartitionInput: PartitionInput;
  }
  export type BatchUpdatePartitionRequestEntryList = BatchUpdatePartitionRequestEntry[];
  export interface BatchUpdatePartitionResponse {
    /**
     * The errors encountered when trying to update the requested partitions. A list of BatchUpdatePartitionFailureEntry objects.
     */
    Errors?: BatchUpdatePartitionFailureList;
  }
  export type BatchWindow = number;
  export interface BinaryColumnStatisticsData {
    /**
     * The size of the longest bit sequence in the column.
     */
    MaximumLength: NonNegativeLong;
    /**
     * The average bit sequence length in the column.
     */
    AverageLength: NonNegativeDouble;
    /**
     * The number of null values in the column.
     */
    NumberOfNulls: NonNegativeLong;
  }
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export interface Blueprint {
    /**
     * The name of the blueprint.
     */
    Name?: OrchestrationNameString;
    /**
     * The description of the blueprint.
     */
    Description?: Generic512CharString;
    /**
     * The date and time the blueprint was registered.
     */
    CreatedOn?: TimestampValue;
    /**
     * The date and time the blueprint was last modified.
     */
    LastModifiedOn?: TimestampValue;
    /**
     * A JSON string that indicates the list of parameter specifications for the blueprint.
     */
    ParameterSpec?: BlueprintParameterSpec;
    /**
     * Specifies the path in Amazon S3 where the blueprint is published.
     */
    BlueprintLocation?: GenericString;
    /**
     * Specifies a path in Amazon S3 where the blueprint is copied when you call CreateBlueprint/UpdateBlueprint to register the blueprint in Glue.
     */
    BlueprintServiceLocation?: GenericString;
    /**
     * The status of the blueprint registration.   Creating — The blueprint registration is in progress.   Active — The blueprint has been successfully registered.   Updating — An update to the blueprint registration is in progress.   Failed — The blueprint registration failed.  
     */
    Status?: BlueprintStatus;
    /**
     * An error message.
     */
    ErrorMessage?: ErrorString;
    /**
     * When there are multiple versions of a blueprint and the latest version has some errors, this attribute indicates the last successful blueprint definition that is available with the service.
     */
    LastActiveDefinition?: LastActiveDefinition;
  }
  export interface BlueprintDetails {
    /**
     * The name of the blueprint.
     */
    BlueprintName?: OrchestrationNameString;
    /**
     * The run ID for this blueprint.
     */
    RunId?: IdString;
  }
  export type BlueprintNames = OrchestrationNameString[];
  export type BlueprintParameterSpec = string;
  export type BlueprintParameters = string;
  export interface BlueprintRun {
    /**
     * The name of the blueprint.
     */
    BlueprintName?: OrchestrationNameString;
    /**
     * The run ID for this blueprint run.
     */
    RunId?: IdString;
    /**
     * The name of a workflow that is created as a result of a successful blueprint run. If a blueprint run has an error, there will not be a workflow created.
     */
    WorkflowName?: NameString;
    /**
     * The state of the blueprint run. Possible values are:   Running — The blueprint run is in progress.   Succeeded — The blueprint run completed successfully.   Failed — The blueprint run failed and rollback is complete.   Rolling Back — The blueprint run failed and rollback is in progress.  
     */
    State?: BlueprintRunState;
    /**
     * The date and time that the blueprint run started.
     */
    StartedOn?: TimestampValue;
    /**
     * The date and time that the blueprint run completed.
     */
    CompletedOn?: TimestampValue;
    /**
     * Indicates any errors that are seen while running the blueprint.
     */
    ErrorMessage?: MessageString;
    /**
     * If there are any errors while creating the entities of a workflow, we try to roll back the created entities until that point and delete them. This attribute indicates the errors seen while trying to delete the entities that are created.
     */
    RollbackErrorMessage?: MessageString;
    /**
     * The blueprint parameters as a string. You will have to provide a value for each key that is required from the parameter spec that is defined in the Blueprint$ParameterSpec.
     */
    Parameters?: BlueprintParameters;
    /**
     * The role ARN. This role will be assumed by the Glue service and will be used to create the workflow and other entities of a workflow.
     */
    RoleArn?: OrchestrationIAMRoleArn;
  }
  export type BlueprintRunState = "RUNNING"|"SUCCEEDED"|"FAILED"|"ROLLING_BACK"|string;
  export type BlueprintRuns = BlueprintRun[];
  export type BlueprintStatus = "CREATING"|"ACTIVE"|"UPDATING"|"FAILED"|string;
  export type Blueprints = Blueprint[];
  export type Boolean = boolean;
  export interface BooleanColumnStatisticsData {
    /**
     * The number of true values in the column.
     */
    NumberOfTrues: NonNegativeLong;
    /**
     * The number of false values in the column.
     */
    NumberOfFalses: NonNegativeLong;
    /**
     * The number of null values in the column.
     */
    NumberOfNulls: NonNegativeLong;
  }
  export type BooleanNullable = boolean;
  export type BooleanValue = boolean;
  export type BoundedPartitionValueList = ValueString[];
  export type BoxedBoolean = boolean;
  export type BoxedDoubleFraction = number;
  export type BoxedLong = number;
  export type BoxedNonNegativeInt = number;
  export type BoxedNonNegativeLong = number;
  export type BoxedPositiveInt = number;
  export interface CancelDataQualityRuleRecommendationRunRequest {
    /**
     * The unique run identifier associated with this run.
     */
    RunId: HashString;
  }
  export interface CancelDataQualityRuleRecommendationRunResponse {
  }
  export interface CancelDataQualityRulesetEvaluationRunRequest {
    /**
     * The unique run identifier associated with this run.
     */
    RunId: HashString;
  }
  export interface CancelDataQualityRulesetEvaluationRunResponse {
  }
  export interface CancelMLTaskRunRequest {
    /**
     * The unique identifier of the machine learning transform.
     */
    TransformId: HashString;
    /**
     * A unique identifier for the task run.
     */
    TaskRunId: HashString;
  }
  export interface CancelMLTaskRunResponse {
    /**
     * The unique identifier of the machine learning transform.
     */
    TransformId?: HashString;
    /**
     * The unique identifier for the task run.
     */
    TaskRunId?: HashString;
    /**
     * The status for this run.
     */
    Status?: TaskStatusType;
  }
  export interface CancelStatementRequest {
    /**
     * The Session ID of the statement to be cancelled.
     */
    SessionId: NameString;
    /**
     * The ID of the statement to be cancelled.
     */
    Id: IntegerValue;
    /**
     * The origin of the request to cancel the statement.
     */
    RequestOrigin?: OrchestrationNameString;
  }
  export interface CancelStatementResponse {
  }
  export interface CatalogDeltaSource {
    /**
     * The name of the Delta Lake data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * Specifies additional connection options.
     */
    AdditionalDeltaOptions?: AdditionalOptions;
    /**
     * Specifies the data schema for the Delta Lake source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export type CatalogEncryptionMode = "DISABLED"|"SSE-KMS"|string;
  export type CatalogEntries = CatalogEntry[];
  export interface CatalogEntry {
    /**
     * The database in which the table metadata resides.
     */
    DatabaseName: NameString;
    /**
     * The name of the table in question.
     */
    TableName: NameString;
  }
  export type CatalogGetterPageSize = number;
  export interface CatalogHudiSource {
    /**
     * The name of the Hudi data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * Specifies additional connection options.
     */
    AdditionalHudiOptions?: AdditionalOptions;
    /**
     * Specifies the data schema for the Hudi source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export type CatalogIdString = string;
  export interface CatalogImportStatus {
    /**
     *  True if the migration has completed, or False otherwise.
     */
    ImportCompleted?: Boolean;
    /**
     * The time that the migration was started.
     */
    ImportTime?: Timestamp;
    /**
     * The name of the person who initiated the migration.
     */
    ImportedBy?: NameString;
  }
  export interface CatalogKafkaSource {
    /**
     * The name of the data store.
     */
    Name: NodeName;
    /**
     * The amount of time to spend processing each micro batch.
     */
    WindowSize?: BoxedPositiveInt;
    /**
     * Whether to automatically determine the schema from the incoming data.
     */
    DetectSchema?: BoxedBoolean;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * Specifies the streaming options.
     */
    StreamingOptions?: KafkaStreamingSourceOptions;
    /**
     * Specifies options related to data preview for viewing a sample of your data.
     */
    DataPreviewOptions?: StreamingDataPreviewOptions;
  }
  export interface CatalogKinesisSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The amount of time to spend processing each micro batch.
     */
    WindowSize?: BoxedPositiveInt;
    /**
     * Whether to automatically determine the schema from the incoming data.
     */
    DetectSchema?: BoxedBoolean;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * Additional options for the Kinesis streaming data source.
     */
    StreamingOptions?: KinesisStreamingSourceOptions;
    /**
     * Additional options for data preview.
     */
    DataPreviewOptions?: StreamingDataPreviewOptions;
  }
  export interface CatalogSchemaChangePolicy {
    /**
     * Whether to use the specified update behavior when the crawler finds a changed schema.
     */
    EnableUpdateCatalog?: BoxedBoolean;
    /**
     * The update behavior when the crawler finds a changed schema.
     */
    UpdateBehavior?: UpdateCatalogBehavior;
  }
  export interface CatalogSource {
    /**
     * The name of the data store.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
  }
  export type CatalogTablesList = NameString[];
  export interface CatalogTarget {
    /**
     * The name of the database to be synchronized.
     */
    DatabaseName: NameString;
    /**
     * A list of the tables to be synchronized.
     */
    Tables: CatalogTablesList;
    /**
     * The name of the connection for an Amazon S3-backed Data Catalog table to be a target of the crawl when using a Catalog connection type paired with a NETWORK Connection type.
     */
    ConnectionName?: ConnectionName;
    /**
     * A valid Amazon SQS ARN. For example, arn:aws:sqs:region:account:sqs.
     */
    EventQueueArn?: EventQueueArn;
    /**
     * A valid Amazon dead-letter SQS ARN. For example, arn:aws:sqs:region:account:deadLetterQueue.
     */
    DlqEventQueueArn?: EventQueueArn;
  }
  export type CatalogTargetList = CatalogTarget[];
  export interface CheckSchemaVersionValidityInput {
    /**
     * The data format of the schema definition. Currently AVRO, JSON and PROTOBUF are supported.
     */
    DataFormat: DataFormat;
    /**
     * The definition of the schema that has to be validated.
     */
    SchemaDefinition: SchemaDefinitionString;
  }
  export interface CheckSchemaVersionValidityResponse {
    /**
     * Return true, if the schema is valid and false otherwise.
     */
    Valid?: IsVersionValid;
    /**
     * A validation failure error message.
     */
    Error?: SchemaValidationError;
  }
  export type Classification = string;
  export interface Classifier {
    /**
     * A classifier that uses grok.
     */
    GrokClassifier?: GrokClassifier;
    /**
     * A classifier for XML content.
     */
    XMLClassifier?: XMLClassifier;
    /**
     * A classifier for JSON content.
     */
    JsonClassifier?: JsonClassifier;
    /**
     * A classifier for comma-separated values (CSV).
     */
    CsvClassifier?: CsvClassifier;
  }
  export type ClassifierList = Classifier[];
  export type ClassifierNameList = NameString[];
  export interface CloudWatchEncryption {
    /**
     * The encryption mode to use for CloudWatch data.
     */
    CloudWatchEncryptionMode?: CloudWatchEncryptionMode;
    /**
     * The Amazon Resource Name (ARN) of the KMS key to be used to encrypt the data.
     */
    KmsKeyArn?: KmsKeyArn;
  }
  export type CloudWatchEncryptionMode = "DISABLED"|"SSE-KMS"|string;
  export type CodeGenArgName = string;
  export type CodeGenArgValue = string;
  export interface CodeGenConfigurationNode {
    /**
     * Specifies a connector to an Amazon Athena data source.
     */
    AthenaConnectorSource?: AthenaConnectorSource;
    /**
     * Specifies a connector to a JDBC data source.
     */
    JDBCConnectorSource?: JDBCConnectorSource;
    /**
     * Specifies a connector to an Apache Spark data source.
     */
    SparkConnectorSource?: SparkConnectorSource;
    /**
     * Specifies a data store in the Glue Data Catalog.
     */
    CatalogSource?: CatalogSource;
    /**
     * Specifies an Amazon Redshift data store.
     */
    RedshiftSource?: RedshiftSource;
    /**
     * Specifies an Amazon S3 data store in the Glue Data Catalog.
     */
    S3CatalogSource?: S3CatalogSource;
    /**
     * Specifies a command-separated value (CSV) data store stored in Amazon S3.
     */
    S3CsvSource?: S3CsvSource;
    /**
     * Specifies a JSON data store stored in Amazon S3.
     */
    S3JsonSource?: S3JsonSource;
    /**
     * Specifies an Apache Parquet data store stored in Amazon S3.
     */
    S3ParquetSource?: S3ParquetSource;
    /**
     * Specifies a relational catalog data store in the Glue Data Catalog.
     */
    RelationalCatalogSource?: RelationalCatalogSource;
    /**
     * Specifies a DynamoDBC Catalog data store in the Glue Data Catalog.
     */
    DynamoDBCatalogSource?: DynamoDBCatalogSource;
    /**
     * Specifies a data target that writes to Amazon S3 in Apache Parquet columnar storage.
     */
    JDBCConnectorTarget?: JDBCConnectorTarget;
    /**
     * Specifies a target that uses an Apache Spark connector.
     */
    SparkConnectorTarget?: SparkConnectorTarget;
    /**
     * Specifies a target that uses a Glue Data Catalog table.
     */
    CatalogTarget?: BasicCatalogTarget;
    /**
     * Specifies a target that uses Amazon Redshift.
     */
    RedshiftTarget?: RedshiftTarget;
    /**
     * Specifies a data target that writes to Amazon S3 using the Glue Data Catalog.
     */
    S3CatalogTarget?: S3CatalogTarget;
    /**
     * Specifies a data target that writes to Amazon S3 in Apache Parquet columnar storage.
     */
    S3GlueParquetTarget?: S3GlueParquetTarget;
    /**
     * Specifies a data target that writes to Amazon S3.
     */
    S3DirectTarget?: S3DirectTarget;
    /**
     * Specifies a transform that maps data property keys in the data source to data property keys in the data target. You can rename keys, modify the data types for keys, and choose which keys to drop from the dataset.
     */
    ApplyMapping?: ApplyMapping;
    /**
     * Specifies a transform that chooses the data property keys that you want to keep.
     */
    SelectFields?: SelectFields;
    /**
     * Specifies a transform that chooses the data property keys that you want to drop.
     */
    DropFields?: DropFields;
    /**
     * Specifies a transform that renames a single data property key.
     */
    RenameField?: RenameField;
    /**
     * Specifies a transform that writes samples of the data to an Amazon S3 bucket.
     */
    Spigot?: Spigot;
    /**
     * Specifies a transform that joins two datasets into one dataset using a comparison phrase on the specified data property keys. You can use inner, outer, left, right, left semi, and left anti joins.
     */
    Join?: Join;
    /**
     * Specifies a transform that splits data property keys into two DynamicFrames. The output is a collection of DynamicFrames: one with selected data property keys, and one with the remaining data property keys.
     */
    SplitFields?: SplitFields;
    /**
     * Specifies a transform that chooses one DynamicFrame from a collection of DynamicFrames. The output is the selected DynamicFrame 
     */
    SelectFromCollection?: SelectFromCollection;
    /**
     * Specifies a transform that locates records in the dataset that have missing values and adds a new field with a value determined by imputation. The input data set is used to train the machine learning model that determines what the missing value should be.
     */
    FillMissingValues?: FillMissingValues;
    /**
     * Specifies a transform that splits a dataset into two, based on a filter condition.
     */
    Filter?: Filter;
    /**
     * Specifies a transform that uses custom code you provide to perform the data transformation. The output is a collection of DynamicFrames.
     */
    CustomCode?: CustomCode;
    /**
     * Specifies a transform where you enter a SQL query using Spark SQL syntax to transform the data. The output is a single DynamicFrame.
     */
    SparkSQL?: SparkSQL;
    /**
     * Specifies a direct Amazon Kinesis data source.
     */
    DirectKinesisSource?: DirectKinesisSource;
    /**
     * Specifies an Apache Kafka data store.
     */
    DirectKafkaSource?: DirectKafkaSource;
    /**
     * Specifies a Kinesis data source in the Glue Data Catalog.
     */
    CatalogKinesisSource?: CatalogKinesisSource;
    /**
     * Specifies an Apache Kafka data store in the Data Catalog.
     */
    CatalogKafkaSource?: CatalogKafkaSource;
    /**
     * Specifies a transform that removes columns from the dataset if all values in the column are 'null'. By default, Glue Studio will recognize null objects, but some values such as empty strings, strings that are "null", -1 integers or other placeholders such as zeros, are not automatically recognized as nulls.
     */
    DropNullFields?: DropNullFields;
    /**
     * Specifies a transform that merges a DynamicFrame with a staging DynamicFrame based on the specified primary keys to identify records. Duplicate records (records with the same primary keys) are not de-duplicated. 
     */
    Merge?: Merge;
    /**
     * Specifies a transform that combines the rows from two or more datasets into a single result.
     */
    Union?: Union;
    /**
     * Specifies a transform that identifies, removes or masks PII data.
     */
    PIIDetection?: PIIDetection;
    /**
     * Specifies a transform that groups rows by chosen fields and computes the aggregated value by specified function.
     */
    Aggregate?: Aggregate;
    /**
     * Specifies a transform that removes rows of repeating data from a data set.
     */
    DropDuplicates?: DropDuplicates;
    /**
     * Specifies a data target that writes to a goverened catalog.
     */
    GovernedCatalogTarget?: GovernedCatalogTarget;
    /**
     * Specifies a data source in a goverened Data Catalog.
     */
    GovernedCatalogSource?: GovernedCatalogSource;
    /**
     * Specifies a Microsoft SQL server data source in the Glue Data Catalog.
     */
    MicrosoftSQLServerCatalogSource?: MicrosoftSQLServerCatalogSource;
    /**
     * Specifies a MySQL data source in the Glue Data Catalog.
     */
    MySQLCatalogSource?: MySQLCatalogSource;
    /**
     * Specifies an Oracle data source in the Glue Data Catalog.
     */
    OracleSQLCatalogSource?: OracleSQLCatalogSource;
    /**
     * Specifies a PostgresSQL data source in the Glue Data Catalog.
     */
    PostgreSQLCatalogSource?: PostgreSQLCatalogSource;
    /**
     * Specifies a target that uses Microsoft SQL.
     */
    MicrosoftSQLServerCatalogTarget?: MicrosoftSQLServerCatalogTarget;
    /**
     * Specifies a target that uses MySQL.
     */
    MySQLCatalogTarget?: MySQLCatalogTarget;
    /**
     * Specifies a target that uses Oracle SQL.
     */
    OracleSQLCatalogTarget?: OracleSQLCatalogTarget;
    /**
     * Specifies a target that uses Postgres SQL.
     */
    PostgreSQLCatalogTarget?: PostgreSQLCatalogTarget;
    /**
     * Specifies a custom visual transform created by a user.
     */
    DynamicTransform?: DynamicTransform;
    /**
     * Specifies your data quality evaluation criteria.
     */
    EvaluateDataQuality?: EvaluateDataQuality;
    /**
     * Specifies a Hudi data source that is registered in the Glue Data Catalog. The data source must be stored in Amazon S3.
     */
    S3CatalogHudiSource?: S3CatalogHudiSource;
    /**
     * Specifies a Hudi data source that is registered in the Glue Data Catalog.
     */
    CatalogHudiSource?: CatalogHudiSource;
    /**
     * Specifies a Hudi data source stored in Amazon S3.
     */
    S3HudiSource?: S3HudiSource;
    /**
     * Specifies a target that writes to a Hudi data source in the Glue Data Catalog.
     */
    S3HudiCatalogTarget?: S3HudiCatalogTarget;
    /**
     * Specifies a target that writes to a Hudi data source in Amazon S3.
     */
    S3HudiDirectTarget?: S3HudiDirectTarget;
    DirectJDBCSource?: DirectJDBCSource;
    /**
     * Specifies a Delta Lake data source that is registered in the Glue Data Catalog. The data source must be stored in Amazon S3.
     */
    S3CatalogDeltaSource?: S3CatalogDeltaSource;
    /**
     * Specifies a Delta Lake data source that is registered in the Glue Data Catalog.
     */
    CatalogDeltaSource?: CatalogDeltaSource;
    /**
     * Specifies a Delta Lake data source stored in Amazon S3.
     */
    S3DeltaSource?: S3DeltaSource;
    /**
     * Specifies a target that writes to a Delta Lake data source in the Glue Data Catalog.
     */
    S3DeltaCatalogTarget?: S3DeltaCatalogTarget;
    /**
     * Specifies a target that writes to a Delta Lake data source in Amazon S3.
     */
    S3DeltaDirectTarget?: S3DeltaDirectTarget;
    /**
     * Specifies a target that writes to a data source in Amazon Redshift.
     */
    AmazonRedshiftSource?: AmazonRedshiftSource;
    /**
     * Specifies a target that writes to a data target in Amazon Redshift.
     */
    AmazonRedshiftTarget?: AmazonRedshiftTarget;
    /**
     * Specifies your data quality evaluation criteria. Allows multiple input data and returns a collection of Dynamic Frames.
     */
    EvaluateDataQualityMultiFrame?: EvaluateDataQualityMultiFrame;
    /**
     * Specifies a Glue DataBrew recipe node.
     */
    Recipe?: Recipe;
    /**
     * Specifies a Snowflake data source.
     */
    SnowflakeSource?: SnowflakeSource;
    /**
     * Specifies a target that writes to a Snowflake data source.
     */
    SnowflakeTarget?: SnowflakeTarget;
  }
  export type CodeGenConfigurationNodes = {[key: string]: CodeGenConfigurationNode};
  export interface CodeGenEdge {
    /**
     * The ID of the node at which the edge starts.
     */
    Source: CodeGenIdentifier;
    /**
     * The ID of the node at which the edge ends.
     */
    Target: CodeGenIdentifier;
    /**
     * The target of the edge.
     */
    TargetParameter?: CodeGenArgName;
  }
  export type CodeGenIdentifier = string;
  export interface CodeGenNode {
    /**
     * A node identifier that is unique within the node's graph.
     */
    Id: CodeGenIdentifier;
    /**
     * The type of node that this is.
     */
    NodeType: CodeGenNodeType;
    /**
     * Properties of the node, in the form of name-value pairs.
     */
    Args: CodeGenNodeArgs;
    /**
     * The line number of the node.
     */
    LineNumber?: Integer;
  }
  export interface CodeGenNodeArg {
    /**
     * The name of the argument or property.
     */
    Name: CodeGenArgName;
    /**
     * The value of the argument or property.
     */
    Value: CodeGenArgValue;
    /**
     * True if the value is used as a parameter.
     */
    Param?: Boolean;
  }
  export type CodeGenNodeArgs = CodeGenNodeArg[];
  export type CodeGenNodeType = string;
  export interface Column {
    /**
     * The name of the Column.
     */
    Name: NameString;
    /**
     * The data type of the Column.
     */
    Type?: ColumnTypeString;
    /**
     * A free-form text comment.
     */
    Comment?: CommentString;
    /**
     * These key-value pairs define properties associated with the column.
     */
    Parameters?: ParametersMap;
  }
  export interface ColumnError {
    /**
     * The name of the column that failed.
     */
    ColumnName?: NameString;
    /**
     * An error message with the reason for the failure of an operation.
     */
    Error?: ErrorDetail;
  }
  export type ColumnErrors = ColumnError[];
  export interface ColumnImportance {
    /**
     * The name of a column.
     */
    ColumnName?: NameString;
    /**
     * The column importance score for the column, as a decimal.
     */
    Importance?: GenericBoundedDouble;
  }
  export type ColumnImportanceList = ColumnImportance[];
  export type ColumnList = Column[];
  export type ColumnNameString = string;
  export interface ColumnRowFilter {
    /**
     * A string containing the name of the column.
     */
    ColumnName?: NameString;
    /**
     * A string containing the row-level filter expression.
     */
    RowFilterExpression?: PredicateString;
  }
  export type ColumnRowFilterList = ColumnRowFilter[];
  export interface ColumnStatistics {
    /**
     * Name of column which statistics belong to.
     */
    ColumnName: NameString;
    /**
     * The data type of the column.
     */
    ColumnType: TypeString;
    /**
     * The timestamp of when column statistics were generated.
     */
    AnalyzedTime: Timestamp;
    /**
     * A ColumnStatisticData object that contains the statistics data values.
     */
    StatisticsData: ColumnStatisticsData;
  }
  export interface ColumnStatisticsData {
    /**
     * The type of column statistics data.
     */
    Type: ColumnStatisticsType;
    /**
     * Boolean column statistics data.
     */
    BooleanColumnStatisticsData?: BooleanColumnStatisticsData;
    /**
     * Date column statistics data.
     */
    DateColumnStatisticsData?: DateColumnStatisticsData;
    /**
     *  Decimal column statistics data. UnscaledValues within are Base64-encoded binary objects storing big-endian, two's complement representations of the decimal's unscaled value. 
     */
    DecimalColumnStatisticsData?: DecimalColumnStatisticsData;
    /**
     * Double column statistics data.
     */
    DoubleColumnStatisticsData?: DoubleColumnStatisticsData;
    /**
     * Long column statistics data.
     */
    LongColumnStatisticsData?: LongColumnStatisticsData;
    /**
     * String column statistics data.
     */
    StringColumnStatisticsData?: StringColumnStatisticsData;
    /**
     * Binary column statistics data.
     */
    BinaryColumnStatisticsData?: BinaryColumnStatisticsData;
  }
  export interface ColumnStatisticsError {
    /**
     * The ColumnStatistics of the column.
     */
    ColumnStatistics?: ColumnStatistics;
    /**
     * An error message with the reason for the failure of an operation.
     */
    Error?: ErrorDetail;
  }
  export type ColumnStatisticsErrors = ColumnStatisticsError[];
  export type ColumnStatisticsList = ColumnStatistics[];
  export type ColumnStatisticsType = "BOOLEAN"|"DATE"|"DECIMAL"|"DOUBLE"|"LONG"|"STRING"|"BINARY"|string;
  export type ColumnTypeString = string;
  export type ColumnValueStringList = ColumnValuesString[];
  export type ColumnValuesString = string;
  export type CommentString = string;
  export type CommitIdString = string;
  export type Comparator = "EQUALS"|"GREATER_THAN"|"LESS_THAN"|"GREATER_THAN_EQUALS"|"LESS_THAN_EQUALS"|string;
  export type Compatibility = "NONE"|"DISABLED"|"BACKWARD"|"BACKWARD_ALL"|"FORWARD"|"FORWARD_ALL"|"FULL"|"FULL_ALL"|string;
  export type CompressionType = "gzip"|"bzip2"|string;
  export interface Condition {
    /**
     * A logical operator.
     */
    LogicalOperator?: LogicalOperator;
    /**
     * The name of the job whose JobRuns this condition applies to, and on which this trigger waits.
     */
    JobName?: NameString;
    /**
     * The condition state. Currently, the only job states that a trigger can listen for are SUCCEEDED, STOPPED, FAILED, and TIMEOUT. The only crawler states that a trigger can listen for are SUCCEEDED, FAILED, and CANCELLED.
     */
    State?: JobRunState;
    /**
     * The name of the crawler to which this condition applies.
     */
    CrawlerName?: NameString;
    /**
     * The state of the crawler to which this condition applies.
     */
    CrawlState?: CrawlState;
  }
  export type ConditionList = Condition[];
  export interface ConfusionMatrix {
    /**
     * The number of matches in the data that the transform correctly found, in the confusion matrix for your transform.
     */
    NumTruePositives?: RecordsCount;
    /**
     * The number of nonmatches in the data that the transform incorrectly classified as a match, in the confusion matrix for your transform.
     */
    NumFalsePositives?: RecordsCount;
    /**
     * The number of nonmatches in the data that the transform correctly rejected, in the confusion matrix for your transform.
     */
    NumTrueNegatives?: RecordsCount;
    /**
     * The number of matches in the data that the transform didn't find, in the confusion matrix for your transform.
     */
    NumFalseNegatives?: RecordsCount;
  }
  export interface Connection {
    /**
     * The name of the connection definition.
     */
    Name?: NameString;
    /**
     * The description of the connection.
     */
    Description?: DescriptionString;
    /**
     * The type of the connection. Currently, SFTP is not supported.
     */
    ConnectionType?: ConnectionType;
    /**
     * A list of criteria that can be used in selecting this connection.
     */
    MatchCriteria?: MatchCriteria;
    /**
     * These key-value pairs define parameters for the connection:    HOST - The host URI: either the fully qualified domain name (FQDN) or the IPv4 address of the database host.    PORT - The port number, between 1024 and 65535, of the port on which the database host is listening for database connections.    USER_NAME - The name under which to log in to the database. The value string for USER_NAME is "USERNAME".    PASSWORD - A password, if one is used, for the user name.    ENCRYPTED_PASSWORD - When you enable connection password protection by setting ConnectionPasswordEncryption in the Data Catalog encryption settings, this field stores the encrypted password.    JDBC_DRIVER_JAR_URI - The Amazon Simple Storage Service (Amazon S3) path of the JAR file that contains the JDBC driver to use.    JDBC_DRIVER_CLASS_NAME - The class name of the JDBC driver to use.    JDBC_ENGINE - The name of the JDBC engine to use.    JDBC_ENGINE_VERSION - The version of the JDBC engine to use.    CONFIG_FILES - (Reserved for future use.)    INSTANCE_ID - The instance ID to use.    JDBC_CONNECTION_URL - The URL for connecting to a JDBC data source.    JDBC_ENFORCE_SSL - A Boolean string (true, false) specifying whether Secure Sockets Layer (SSL) with hostname matching is enforced for the JDBC connection on the client. The default is false.    CUSTOM_JDBC_CERT - An Amazon S3 location specifying the customer's root certificate. Glue uses this root certificate to validate the customer’s certificate when connecting to the customer database. Glue only handles X.509 certificates. The certificate provided must be DER-encoded and supplied in Base64 encoding PEM format.    SKIP_CUSTOM_JDBC_CERT_VALIDATION - By default, this is false. Glue validates the Signature algorithm and Subject Public Key Algorithm for the customer certificate. The only permitted algorithms for the Signature algorithm are SHA256withRSA, SHA384withRSA or SHA512withRSA. For the Subject Public Key Algorithm, the key length must be at least 2048. You can set the value of this property to true to skip Glue’s validation of the customer certificate.    CUSTOM_JDBC_CERT_STRING - A custom JDBC certificate string which is used for domain match or distinguished name match to prevent a man-in-the-middle attack. In Oracle database, this is used as the SSL_SERVER_CERT_DN; in Microsoft SQL Server, this is used as the hostNameInCertificate.    CONNECTION_URL - The URL for connecting to a general (non-JDBC) data source.    SECRET_ID - The secret ID used for the secret manager of credentials.    CONNECTOR_URL - The connector URL for a MARKETPLACE or CUSTOM connection.    CONNECTOR_TYPE - The connector type for a MARKETPLACE or CUSTOM connection.    CONNECTOR_CLASS_NAME - The connector class name for a MARKETPLACE or CUSTOM connection.    KAFKA_BOOTSTRAP_SERVERS - A comma-separated list of host and port pairs that are the addresses of the Apache Kafka brokers in a Kafka cluster to which a Kafka client will connect to and bootstrap itself.    KAFKA_SSL_ENABLED - Whether to enable or disable SSL on an Apache Kafka connection. Default value is "true".    KAFKA_CUSTOM_CERT - The Amazon S3 URL for the private CA cert file (.pem format). The default is an empty string.    KAFKA_SKIP_CUSTOM_CERT_VALIDATION - Whether to skip the validation of the CA cert file or not. Glue validates for three algorithms: SHA256withRSA, SHA384withRSA and SHA512withRSA. Default value is "false".    KAFKA_CLIENT_KEYSTORE - The Amazon S3 location of the client keystore file for Kafka client side authentication (Optional).    KAFKA_CLIENT_KEYSTORE_PASSWORD - The password to access the provided keystore (Optional).    KAFKA_CLIENT_KEY_PASSWORD - A keystore can consist of multiple keys, so this is the password to access the client key to be used with the Kafka server side key (Optional).    ENCRYPTED_KAFKA_CLIENT_KEYSTORE_PASSWORD - The encrypted version of the Kafka client keystore password (if the user has the Glue encrypt passwords setting selected).    ENCRYPTED_KAFKA_CLIENT_KEY_PASSWORD - The encrypted version of the Kafka client key password (if the user has the Glue encrypt passwords setting selected).    KAFKA_SASL_MECHANISM - "SCRAM-SHA-512", "GSSAPI", or "AWS_MSK_IAM". These are the supported SASL Mechanisms.    KAFKA_SASL_SCRAM_USERNAME - A plaintext username used to authenticate with the "SCRAM-SHA-512" mechanism.    KAFKA_SASL_SCRAM_PASSWORD - A plaintext password used to authenticate with the "SCRAM-SHA-512" mechanism.    ENCRYPTED_KAFKA_SASL_SCRAM_PASSWORD - The encrypted version of the Kafka SASL SCRAM password (if the user has the Glue encrypt passwords setting selected).    KAFKA_SASL_SCRAM_SECRETS_ARN - The Amazon Resource Name of a secret in Amazon Web Services Secrets Manager.    KAFKA_SASL_GSSAPI_KEYTAB - The S3 location of a Kerberos keytab file. A keytab stores long-term keys for one or more principals. For more information, see MIT Kerberos Documentation: Keytab.    KAFKA_SASL_GSSAPI_KRB5_CONF - The S3 location of a Kerberos krb5.conf file. A krb5.conf stores Kerberos configuration information, such as the location of the KDC server. For more information, see MIT Kerberos Documentation: krb5.conf.    KAFKA_SASL_GSSAPI_SERVICE - The Kerberos service name, as set with sasl.kerberos.service.name in your Kafka Configuration.    KAFKA_SASL_GSSAPI_PRINCIPAL - The name of the Kerberos princial used by Glue. For more information, see Kafka Documentation: Configuring Kafka Brokers.  
     */
    ConnectionProperties?: ConnectionProperties;
    /**
     * A map of physical connection requirements, such as virtual private cloud (VPC) and SecurityGroup, that are needed to make this connection successfully.
     */
    PhysicalConnectionRequirements?: PhysicalConnectionRequirements;
    /**
     * The time that this connection definition was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time that this connection definition was updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The user, group, or role that last updated this connection definition.
     */
    LastUpdatedBy?: NameString;
  }
  export interface ConnectionInput {
    /**
     * The name of the connection. Connection will not function as expected without a name.
     */
    Name: NameString;
    /**
     * The description of the connection.
     */
    Description?: DescriptionString;
    /**
     * The type of the connection. Currently, these types are supported:    JDBC - Designates a connection to a database through Java Database Connectivity (JDBC).  JDBC Connections use the following ConnectionParameters.   Required: All of (HOST, PORT, JDBC_ENGINE) or JDBC_CONNECTION_URL.   Required: All of (USERNAME, PASSWORD) or SECRET_ID.   Optional: JDBC_ENFORCE_SSL, CUSTOM_JDBC_CERT, CUSTOM_JDBC_CERT_STRING, SKIP_CUSTOM_JDBC_CERT_VALIDATION. These parameters are used to configure SSL with JDBC.      KAFKA - Designates a connection to an Apache Kafka streaming platform.  KAFKA Connections use the following ConnectionParameters.   Required: KAFKA_BOOTSTRAP_SERVERS.   Optional: KAFKA_SSL_ENABLED, KAFKA_CUSTOM_CERT, KAFKA_SKIP_CUSTOM_CERT_VALIDATION. These parameters are used to configure SSL with KAFKA.   Optional: KAFKA_CLIENT_KEYSTORE, KAFKA_CLIENT_KEYSTORE_PASSWORD, KAFKA_CLIENT_KEY_PASSWORD, ENCRYPTED_KAFKA_CLIENT_KEYSTORE_PASSWORD, ENCRYPTED_KAFKA_CLIENT_KEY_PASSWORD. These parameters are used to configure TLS client configuration with SSL in KAFKA.   Optional: KAFKA_SASL_MECHANISM. Can be specified as SCRAM-SHA-512, GSSAPI, or AWS_MSK_IAM.   Optional: KAFKA_SASL_SCRAM_USERNAME, KAFKA_SASL_SCRAM_PASSWORD, ENCRYPTED_KAFKA_SASL_SCRAM_PASSWORD. These parameters are used to configure SASL/SCRAM-SHA-512 authentication with KAFKA.   Optional: KAFKA_SASL_GSSAPI_KEYTAB, KAFKA_SASL_GSSAPI_KRB5_CONF, KAFKA_SASL_GSSAPI_SERVICE, KAFKA_SASL_GSSAPI_PRINCIPAL. These parameters are used to configure SASL/GSSAPI authentication with KAFKA.      MONGODB - Designates a connection to a MongoDB document database.  MONGODB Connections use the following ConnectionParameters.   Required: CONNECTION_URL.   Required: All of (USERNAME, PASSWORD) or SECRET_ID.      NETWORK - Designates a network connection to a data source within an Amazon Virtual Private Cloud environment (Amazon VPC).  NETWORK Connections do not require ConnectionParameters. Instead, provide a PhysicalConnectionRequirements.    MARKETPLACE - Uses configuration settings contained in a connector purchased from Amazon Web Services Marketplace to read from and write to data stores that are not natively supported by Glue.  MARKETPLACE Connections use the following ConnectionParameters.   Required: CONNECTOR_TYPE, CONNECTOR_URL, CONNECTOR_CLASS_NAME, CONNECTION_URL.   Required for JDBC CONNECTOR_TYPE connections: All of (USERNAME, PASSWORD) or SECRET_ID.      CUSTOM - Uses configuration settings contained in a custom connector to read from and write to data stores that are not natively supported by Glue.    SFTP is not supported. For more information about how optional ConnectionProperties are used to configure features in Glue, consult Glue connection properties. For more information about how optional ConnectionProperties are used to configure features in Glue Studio, consult Using connectors and connections.
     */
    ConnectionType: ConnectionType;
    /**
     * A list of criteria that can be used in selecting this connection.
     */
    MatchCriteria?: MatchCriteria;
    /**
     * These key-value pairs define parameters for the connection.
     */
    ConnectionProperties: ConnectionProperties;
    /**
     * A map of physical connection requirements, such as virtual private cloud (VPC) and SecurityGroup, that are needed to successfully make this connection.
     */
    PhysicalConnectionRequirements?: PhysicalConnectionRequirements;
  }
  export type ConnectionList = Connection[];
  export type ConnectionName = string;
  export interface ConnectionPasswordEncryption {
    /**
     * When the ReturnConnectionPasswordEncrypted flag is set to "true", passwords remain encrypted in the responses of GetConnection and GetConnections. This encryption takes effect independently from catalog encryption. 
     */
    ReturnConnectionPasswordEncrypted: Boolean;
    /**
     * An KMS key that is used to encrypt the connection password.  If connection password protection is enabled, the caller of CreateConnection and UpdateConnection needs at least kms:Encrypt permission on the specified KMS key, to encrypt passwords before storing them in the Data Catalog.  You can set the decrypt permission to enable or restrict access on the password key according to your security requirements.
     */
    AwsKmsKeyId?: NameString;
  }
  export type ConnectionProperties = {[key: string]: ValueString};
  export type ConnectionPropertyKey = "HOST"|"PORT"|"USERNAME"|"PASSWORD"|"ENCRYPTED_PASSWORD"|"JDBC_DRIVER_JAR_URI"|"JDBC_DRIVER_CLASS_NAME"|"JDBC_ENGINE"|"JDBC_ENGINE_VERSION"|"CONFIG_FILES"|"INSTANCE_ID"|"JDBC_CONNECTION_URL"|"JDBC_ENFORCE_SSL"|"CUSTOM_JDBC_CERT"|"SKIP_CUSTOM_JDBC_CERT_VALIDATION"|"CUSTOM_JDBC_CERT_STRING"|"CONNECTION_URL"|"KAFKA_BOOTSTRAP_SERVERS"|"KAFKA_SSL_ENABLED"|"KAFKA_CUSTOM_CERT"|"KAFKA_SKIP_CUSTOM_CERT_VALIDATION"|"KAFKA_CLIENT_KEYSTORE"|"KAFKA_CLIENT_KEYSTORE_PASSWORD"|"KAFKA_CLIENT_KEY_PASSWORD"|"ENCRYPTED_KAFKA_CLIENT_KEYSTORE_PASSWORD"|"ENCRYPTED_KAFKA_CLIENT_KEY_PASSWORD"|"SECRET_ID"|"CONNECTOR_URL"|"CONNECTOR_TYPE"|"CONNECTOR_CLASS_NAME"|"KAFKA_SASL_MECHANISM"|"KAFKA_SASL_SCRAM_USERNAME"|"KAFKA_SASL_SCRAM_PASSWORD"|"KAFKA_SASL_SCRAM_SECRETS_ARN"|"ENCRYPTED_KAFKA_SASL_SCRAM_PASSWORD"|"KAFKA_SASL_GSSAPI_KEYTAB"|"KAFKA_SASL_GSSAPI_KRB5_CONF"|"KAFKA_SASL_GSSAPI_SERVICE"|"KAFKA_SASL_GSSAPI_PRINCIPAL"|string;
  export type ConnectionType = "JDBC"|"SFTP"|"MONGODB"|"KAFKA"|"NETWORK"|"MARKETPLACE"|"CUSTOM"|string;
  export interface ConnectionsList {
    /**
     * A list of connections used by the job.
     */
    Connections?: OrchestrationStringList;
  }
  export type ContextWords = NameString[];
  export interface Crawl {
    /**
     * The state of the crawler.
     */
    State?: CrawlState;
    /**
     * The date and time on which the crawl started.
     */
    StartedOn?: TimestampValue;
    /**
     * The date and time on which the crawl completed.
     */
    CompletedOn?: TimestampValue;
    /**
     * The error message associated with the crawl.
     */
    ErrorMessage?: DescriptionString;
    /**
     * The log group associated with the crawl.
     */
    LogGroup?: LogGroup;
    /**
     * The log stream associated with the crawl.
     */
    LogStream?: LogStream;
  }
  export type CrawlId = string;
  export type CrawlList = Crawl[];
  export type CrawlState = "RUNNING"|"CANCELLING"|"CANCELLED"|"SUCCEEDED"|"FAILED"|"ERROR"|string;
  export interface Crawler {
    /**
     * The name of the crawler.
     */
    Name?: NameString;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that's used to access customer resources, such as Amazon Simple Storage Service (Amazon S3) data.
     */
    Role?: Role;
    /**
     * A collection of targets to crawl.
     */
    Targets?: CrawlerTargets;
    /**
     * The name of the database in which the crawler's output is stored.
     */
    DatabaseName?: DatabaseName;
    /**
     * A description of the crawler.
     */
    Description?: DescriptionString;
    /**
     * A list of UTF-8 strings that specify the custom classifiers that are associated with the crawler.
     */
    Classifiers?: ClassifierNameList;
    /**
     * A policy that specifies whether to crawl the entire dataset again, or to crawl only folders that were added since the last crawler run.
     */
    RecrawlPolicy?: RecrawlPolicy;
    /**
     * The policy that specifies update and delete behaviors for the crawler.
     */
    SchemaChangePolicy?: SchemaChangePolicy;
    /**
     * A configuration that specifies whether data lineage is enabled for the crawler.
     */
    LineageConfiguration?: LineageConfiguration;
    /**
     * Indicates whether the crawler is running, or whether a run is pending.
     */
    State?: CrawlerState;
    /**
     * The prefix added to the names of tables that are created.
     */
    TablePrefix?: TablePrefix;
    /**
     * For scheduled crawlers, the schedule when the crawler runs.
     */
    Schedule?: Schedule;
    /**
     * If the crawler is running, contains the total time elapsed since the last crawl began.
     */
    CrawlElapsedTime?: MillisecondsCount;
    /**
     * The time that the crawler was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time that the crawler was last updated.
     */
    LastUpdated?: Timestamp;
    /**
     * The status of the last crawl, and potentially error information if an error occurred.
     */
    LastCrawl?: LastCrawlInfo;
    /**
     * The version of the crawler.
     */
    Version?: VersionId;
    /**
     * Crawler configuration information. This versioned JSON string allows users to specify aspects of a crawler's behavior. For more information, see Setting crawler configuration options.
     */
    Configuration?: CrawlerConfiguration;
    /**
     * The name of the SecurityConfiguration structure to be used by this crawler.
     */
    CrawlerSecurityConfiguration?: CrawlerSecurityConfiguration;
    /**
     * Specifies whether the crawler should use Lake Formation credentials for the crawler instead of the IAM role credentials.
     */
    LakeFormationConfiguration?: LakeFormationConfiguration;
  }
  export type CrawlerConfiguration = string;
  export interface CrawlerHistory {
    /**
     * A UUID identifier for each crawl.
     */
    CrawlId?: CrawlId;
    /**
     * The state of the crawl.
     */
    State?: CrawlerHistoryState;
    /**
     * The date and time on which the crawl started.
     */
    StartTime?: Timestamp;
    /**
     * The date and time on which the crawl ended.
     */
    EndTime?: Timestamp;
    /**
     * A run summary for the specific crawl in JSON. Contains the catalog tables and partitions that were added, updated, or deleted.
     */
    Summary?: NameString;
    /**
     * If an error occurred, the error message associated with the crawl.
     */
    ErrorMessage?: DescriptionString;
    /**
     * The log group associated with the crawl.
     */
    LogGroup?: LogGroup;
    /**
     * The log stream associated with the crawl.
     */
    LogStream?: LogStream;
    /**
     * The prefix for a CloudWatch message about this crawl.
     */
    MessagePrefix?: MessagePrefix;
    /**
     * The number of data processing units (DPU) used in hours for the crawl.
     */
    DPUHour?: NonNegativeDouble;
  }
  export type CrawlerHistoryList = CrawlerHistory[];
  export type CrawlerHistoryState = "RUNNING"|"COMPLETED"|"FAILED"|"STOPPED"|string;
  export type CrawlerLineageSettings = "ENABLE"|"DISABLE"|string;
  export type CrawlerList = Crawler[];
  export interface CrawlerMetrics {
    /**
     * The name of the crawler.
     */
    CrawlerName?: NameString;
    /**
     * The estimated time left to complete a running crawl.
     */
    TimeLeftSeconds?: NonNegativeDouble;
    /**
     * True if the crawler is still estimating how long it will take to complete this run.
     */
    StillEstimating?: Boolean;
    /**
     * The duration of the crawler's most recent run, in seconds.
     */
    LastRuntimeSeconds?: NonNegativeDouble;
    /**
     * The median duration of this crawler's runs, in seconds.
     */
    MedianRuntimeSeconds?: NonNegativeDouble;
    /**
     * The number of tables created by this crawler.
     */
    TablesCreated?: NonNegativeInteger;
    /**
     * The number of tables updated by this crawler.
     */
    TablesUpdated?: NonNegativeInteger;
    /**
     * The number of tables deleted by this crawler.
     */
    TablesDeleted?: NonNegativeInteger;
  }
  export type CrawlerMetricsList = CrawlerMetrics[];
  export type CrawlerNameList = NameString[];
  export interface CrawlerNodeDetails {
    /**
     * A list of crawls represented by the crawl node.
     */
    Crawls?: CrawlList;
  }
  export type CrawlerSecurityConfiguration = string;
  export type CrawlerState = "READY"|"RUNNING"|"STOPPING"|string;
  export interface CrawlerTargets {
    /**
     * Specifies Amazon Simple Storage Service (Amazon S3) targets.
     */
    S3Targets?: S3TargetList;
    /**
     * Specifies JDBC targets.
     */
    JdbcTargets?: JdbcTargetList;
    /**
     * Specifies Amazon DocumentDB or MongoDB targets.
     */
    MongoDBTargets?: MongoDBTargetList;
    /**
     * Specifies Amazon DynamoDB targets.
     */
    DynamoDBTargets?: DynamoDBTargetList;
    /**
     * Specifies Glue Data Catalog targets.
     */
    CatalogTargets?: CatalogTargetList;
    /**
     * Specifies Delta data store targets.
     */
    DeltaTargets?: DeltaTargetList;
    /**
     * Specifies Apache Iceberg data store targets.
     */
    IcebergTargets?: IcebergTargetList;
    /**
     * Specifies Apache Hudi data store targets.
     */
    HudiTargets?: HudiTargetList;
  }
  export interface CrawlsFilter {
    /**
     * A key used to filter the crawler runs for a specified crawler. Valid values for each of the field names are:    CRAWL_ID: A string representing the UUID identifier for a crawl.    STATE: A string representing the state of the crawl.    START_TIME and END_TIME: The epoch timestamp in milliseconds.    DPU_HOUR: The number of data processing unit (DPU) hours used for the crawl.  
     */
    FieldName?: FieldName;
    /**
     * A defined comparator that operates on the value. The available operators are:    GT: Greater than.    GE: Greater than or equal to.    LT: Less than.    LE: Less than or equal to.    EQ: Equal to.    NE: Not equal to.  
     */
    FilterOperator?: FilterOperator;
    /**
     * The value provided for comparison on the crawl field. 
     */
    FieldValue?: GenericString;
  }
  export type CrawlsFilterList = CrawlsFilter[];
  export interface CreateBlueprintRequest {
    /**
     * The name of the blueprint.
     */
    Name: OrchestrationNameString;
    /**
     * A description of the blueprint.
     */
    Description?: Generic512CharString;
    /**
     * Specifies a path in Amazon S3 where the blueprint is published.
     */
    BlueprintLocation: OrchestrationS3Location;
    /**
     * The tags to be applied to this blueprint.
     */
    Tags?: TagsMap;
  }
  export interface CreateBlueprintResponse {
    /**
     * Returns the name of the blueprint that was registered.
     */
    Name?: NameString;
  }
  export interface CreateClassifierRequest {
    /**
     * A GrokClassifier object specifying the classifier to create.
     */
    GrokClassifier?: CreateGrokClassifierRequest;
    /**
     * An XMLClassifier object specifying the classifier to create.
     */
    XMLClassifier?: CreateXMLClassifierRequest;
    /**
     * A JsonClassifier object specifying the classifier to create.
     */
    JsonClassifier?: CreateJsonClassifierRequest;
    /**
     * A CsvClassifier object specifying the classifier to create.
     */
    CsvClassifier?: CreateCsvClassifierRequest;
  }
  export interface CreateClassifierResponse {
  }
  export interface CreateConnectionRequest {
    /**
     * The ID of the Data Catalog in which to create the connection. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * A ConnectionInput object defining the connection to create.
     */
    ConnectionInput: ConnectionInput;
    /**
     * The tags you assign to the connection.
     */
    Tags?: TagsMap;
  }
  export interface CreateConnectionResponse {
  }
  export interface CreateCrawlerRequest {
    /**
     * Name of the new crawler.
     */
    Name: NameString;
    /**
     * The IAM role or Amazon Resource Name (ARN) of an IAM role used by the new crawler to access customer resources.
     */
    Role: Role;
    /**
     * The Glue database where results are written, such as: arn:aws:daylight:us-east-1::database/sometable/*.
     */
    DatabaseName?: DatabaseName;
    /**
     * A description of the new crawler.
     */
    Description?: DescriptionString;
    /**
     * A list of collection of targets to crawl.
     */
    Targets: CrawlerTargets;
    /**
     * A cron expression used to specify the schedule (see Time-Based Schedules for Jobs and Crawlers. For example, to run something every day at 12:15 UTC, you would specify: cron(15 12 * * ? *).
     */
    Schedule?: CronExpression;
    /**
     * A list of custom classifiers that the user has registered. By default, all built-in classifiers are included in a crawl, but these custom classifiers always override the default classifiers for a given classification.
     */
    Classifiers?: ClassifierNameList;
    /**
     * The table prefix used for catalog tables that are created.
     */
    TablePrefix?: TablePrefix;
    /**
     * The policy for the crawler's update and deletion behavior.
     */
    SchemaChangePolicy?: SchemaChangePolicy;
    /**
     * A policy that specifies whether to crawl the entire dataset again, or to crawl only folders that were added since the last crawler run.
     */
    RecrawlPolicy?: RecrawlPolicy;
    /**
     * Specifies data lineage configuration settings for the crawler.
     */
    LineageConfiguration?: LineageConfiguration;
    /**
     * Specifies Lake Formation configuration settings for the crawler.
     */
    LakeFormationConfiguration?: LakeFormationConfiguration;
    /**
     * Crawler configuration information. This versioned JSON string allows users to specify aspects of a crawler's behavior. For more information, see Setting crawler configuration options.
     */
    Configuration?: CrawlerConfiguration;
    /**
     * The name of the SecurityConfiguration structure to be used by this crawler.
     */
    CrawlerSecurityConfiguration?: CrawlerSecurityConfiguration;
    /**
     * The tags to use with this crawler request. You may use tags to limit access to the crawler. For more information about tags in Glue, see Amazon Web Services Tags in Glue in the developer guide.
     */
    Tags?: TagsMap;
  }
  export interface CreateCrawlerResponse {
  }
  export interface CreateCsvClassifierRequest {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * A custom symbol to denote what separates each column entry in the row.
     */
    Delimiter?: CsvColumnDelimiter;
    /**
     * A custom symbol to denote what combines content into a single column value. Must be different from the column delimiter.
     */
    QuoteSymbol?: CsvQuoteSymbol;
    /**
     * Indicates whether the CSV file contains a header.
     */
    ContainsHeader?: CsvHeaderOption;
    /**
     * A list of strings representing column names.
     */
    Header?: CsvHeader;
    /**
     * Specifies not to trim values before identifying the type of column values. The default value is true.
     */
    DisableValueTrimming?: NullableBoolean;
    /**
     * Enables the processing of files that contain only one column.
     */
    AllowSingleColumn?: NullableBoolean;
    /**
     * Enables the configuration of custom datatypes.
     */
    CustomDatatypeConfigured?: NullableBoolean;
    /**
     * Creates a list of supported custom datatypes.
     */
    CustomDatatypes?: CustomDatatypes;
    /**
     * Sets the SerDe for processing CSV in the classifier, which will be applied in the Data Catalog. Valid values are OpenCSVSerDe, LazySimpleSerDe, and None. You can specify the None value when you want the crawler to do the detection.
     */
    Serde?: CsvSerdeOption;
  }
  export interface CreateCustomEntityTypeRequest {
    /**
     * A name for the custom pattern that allows it to be retrieved or deleted later. This name must be unique per Amazon Web Services account.
     */
    Name: NameString;
    /**
     * A regular expression string that is used for detecting sensitive data in a custom pattern.
     */
    RegexString: NameString;
    /**
     * A list of context words. If none of these context words are found within the vicinity of the regular expression the data will not be detected as sensitive data. If no context words are passed only a regular expression is checked.
     */
    ContextWords?: ContextWords;
    /**
     * A list of tags applied to the custom entity type.
     */
    Tags?: TagsMap;
  }
  export interface CreateCustomEntityTypeResponse {
    /**
     * The name of the custom pattern you created.
     */
    Name?: NameString;
  }
  export interface CreateDataQualityRulesetRequest {
    /**
     * A unique name for the data quality ruleset.
     */
    Name: NameString;
    /**
     * A description of the data quality ruleset.
     */
    Description?: DescriptionString;
    /**
     * A Data Quality Definition Language (DQDL) ruleset. For more information, see the Glue developer guide.
     */
    Ruleset: DataQualityRulesetString;
    /**
     * A list of tags applied to the data quality ruleset.
     */
    Tags?: TagsMap;
    /**
     * A target table associated with the data quality ruleset.
     */
    TargetTable?: DataQualityTargetTable;
    /**
     * Used for idempotency and is recommended to be set to a random ID (such as a UUID) to avoid creating or starting multiple instances of the same resource.
     */
    ClientToken?: HashString;
  }
  export interface CreateDataQualityRulesetResponse {
    /**
     * A unique name for the data quality ruleset.
     */
    Name?: NameString;
  }
  export interface CreateDatabaseRequest {
    /**
     * The ID of the Data Catalog in which to create the database. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The metadata for the database.
     */
    DatabaseInput: DatabaseInput;
    /**
     * The tags you assign to the database.
     */
    Tags?: TagsMap;
  }
  export interface CreateDatabaseResponse {
  }
  export interface CreateDevEndpointRequest {
    /**
     * The name to be assigned to the new DevEndpoint.
     */
    EndpointName: GenericString;
    /**
     * The IAM role for the DevEndpoint.
     */
    RoleArn: RoleArn;
    /**
     * Security group IDs for the security groups to be used by the new DevEndpoint.
     */
    SecurityGroupIds?: StringList;
    /**
     * The subnet ID for the new DevEndpoint to use.
     */
    SubnetId?: GenericString;
    /**
     * The public key to be used by this DevEndpoint for authentication. This attribute is provided for backward compatibility because the recommended attribute to use is public keys.
     */
    PublicKey?: GenericString;
    /**
     * A list of public keys to be used by the development endpoints for authentication. The use of this attribute is preferred over a single public key because the public keys allow you to have a different private key per client.  If you previously created an endpoint with a public key, you must remove that key to be able to set a list of public keys. Call the UpdateDevEndpoint API with the public key content in the deletePublicKeys attribute, and the list of new keys in the addPublicKeys attribute. 
     */
    PublicKeys?: PublicKeysList;
    /**
     * The number of Glue Data Processing Units (DPUs) to allocate to this DevEndpoint.
     */
    NumberOfNodes?: IntegerValue;
    /**
     * The type of predefined worker that is allocated to the development endpoint. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.   Known issue: when a development endpoint is created with the G.2X WorkerType configuration, the Spark drivers for the development endpoint will run on 4 vCPU, 16 GB of memory, and a 64 GB disk. 
     */
    WorkerType?: WorkerType;
    /**
     * Glue version determines the versions of Apache Spark and Python that Glue supports. The Python version indicates the version supported for running your ETL scripts on development endpoints.  For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Development endpoints that are created without specifying a Glue version default to Glue 0.9. You can specify a version of Python support for development endpoints by using the Arguments parameter in the CreateDevEndpoint or UpdateDevEndpoint APIs. If no arguments are provided, the version defaults to Python 2.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of workers of a defined workerType that are allocated to the development endpoint. The maximum number of workers you can define are 299 for G.1X, and 149 for G.2X. 
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The paths to one or more Python libraries in an Amazon S3 bucket that should be loaded in your DevEndpoint. Multiple values must be complete paths separated by a comma.  You can only use pure Python libraries with a DevEndpoint. Libraries that rely on C extensions, such as the pandas Python data analysis library, are not yet supported. 
     */
    ExtraPythonLibsS3Path?: GenericString;
    /**
     * The path to one or more Java .jar files in an S3 bucket that should be loaded in your DevEndpoint.
     */
    ExtraJarsS3Path?: GenericString;
    /**
     * The name of the SecurityConfiguration structure to be used with this DevEndpoint.
     */
    SecurityConfiguration?: NameString;
    /**
     * The tags to use with this DevEndpoint. You may use tags to limit access to the DevEndpoint. For more information about tags in Glue, see Amazon Web Services Tags in Glue in the developer guide.
     */
    Tags?: TagsMap;
    /**
     * A map of arguments used to configure the DevEndpoint.
     */
    Arguments?: MapValue;
  }
  export interface CreateDevEndpointResponse {
    /**
     * The name assigned to the new DevEndpoint.
     */
    EndpointName?: GenericString;
    /**
     * The current status of the new DevEndpoint.
     */
    Status?: GenericString;
    /**
     * The security groups assigned to the new DevEndpoint.
     */
    SecurityGroupIds?: StringList;
    /**
     * The subnet ID assigned to the new DevEndpoint.
     */
    SubnetId?: GenericString;
    /**
     * The Amazon Resource Name (ARN) of the role assigned to the new DevEndpoint.
     */
    RoleArn?: RoleArn;
    /**
     * The address of the YARN endpoint used by this DevEndpoint.
     */
    YarnEndpointAddress?: GenericString;
    /**
     * The Apache Zeppelin port for the remote Apache Spark interpreter.
     */
    ZeppelinRemoteSparkInterpreterPort?: IntegerValue;
    /**
     * The number of Glue Data Processing Units (DPUs) allocated to this DevEndpoint.
     */
    NumberOfNodes?: IntegerValue;
    /**
     * The type of predefined worker that is allocated to the development endpoint. May be a value of Standard, G.1X, or G.2X.
     */
    WorkerType?: WorkerType;
    /**
     * Glue version determines the versions of Apache Spark and Python that Glue supports. The Python version indicates the version supported for running your ETL scripts on development endpoints.  For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of workers of a defined workerType that are allocated to the development endpoint.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The Amazon Web Services Availability Zone where this DevEndpoint is located.
     */
    AvailabilityZone?: GenericString;
    /**
     * The ID of the virtual private cloud (VPC) used by this DevEndpoint.
     */
    VpcId?: GenericString;
    /**
     * The paths to one or more Python libraries in an S3 bucket that will be loaded in your DevEndpoint.
     */
    ExtraPythonLibsS3Path?: GenericString;
    /**
     * Path to one or more Java .jar files in an S3 bucket that will be loaded in your DevEndpoint.
     */
    ExtraJarsS3Path?: GenericString;
    /**
     * The reason for a current failure in this DevEndpoint.
     */
    FailureReason?: GenericString;
    /**
     * The name of the SecurityConfiguration structure being used with this DevEndpoint.
     */
    SecurityConfiguration?: NameString;
    /**
     * The point in time at which this DevEndpoint was created.
     */
    CreatedTimestamp?: TimestampValue;
    /**
     * The map of arguments used to configure this DevEndpoint. Valid arguments are:    "--enable-glue-datacatalog": ""    You can specify a version of Python support for development endpoints by using the Arguments parameter in the CreateDevEndpoint or UpdateDevEndpoint APIs. If no arguments are provided, the version defaults to Python 2.
     */
    Arguments?: MapValue;
  }
  export interface CreateGrokClassifierRequest {
    /**
     * An identifier of the data format that the classifier matches, such as Twitter, JSON, Omniture logs, Amazon CloudWatch Logs, and so on.
     */
    Classification: Classification;
    /**
     * The name of the new classifier.
     */
    Name: NameString;
    /**
     * The grok pattern used by this classifier.
     */
    GrokPattern: GrokPattern;
    /**
     * Optional custom grok patterns used by this classifier.
     */
    CustomPatterns?: CustomPatterns;
  }
  export interface CreateJobRequest {
    /**
     * The name you assign to this job definition. It must be unique in your account.
     */
    Name: NameString;
    /**
     * Description of the job being defined.
     */
    Description?: DescriptionString;
    /**
     * This field is reserved for future use.
     */
    LogUri?: UriString;
    /**
     * The name or Amazon Resource Name (ARN) of the IAM role associated with this job.
     */
    Role: RoleString;
    /**
     * An ExecutionProperty specifying the maximum number of concurrent runs allowed for this job.
     */
    ExecutionProperty?: ExecutionProperty;
    /**
     * The JobCommand that runs this job.
     */
    Command: JobCommand;
    /**
     * The default arguments for every run of this job, specified as name-value pairs. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. Job arguments may be logged. Do not pass plaintext secrets as arguments. Retrieve secrets from a Glue Connection, Secrets Manager or other secret management mechanism if you intend to keep them within the Job.  For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the arguments you can provide to this field when configuring Spark jobs, see the Special Parameters Used by Glue topic in the developer guide. For information about the arguments you can provide to this field when configuring Ray jobs, see Using job parameters in Ray jobs in the developer guide.
     */
    DefaultArguments?: GenericMap;
    /**
     * Arguments for this job that are not overridden when providing job arguments in a job run, specified as name-value pairs.
     */
    NonOverridableArguments?: GenericMap;
    /**
     * The connections used for this job.
     */
    Connections?: ConnectionsList;
    /**
     * The maximum number of times to retry this job if it fails.
     */
    MaxRetries?: MaxRetries;
    /**
     * This parameter is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) to allocate to this Job. You can allocate a minimum of 2 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The job timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * For Glue version 1.0 or earlier jobs, using the standard worker type, the number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the  Glue pricing page. For Glue version 2.0+ jobs, you cannot specify a Maximum capacity. Instead, you should specify a Worker type and the Number of workers. Do not set MaxCapacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job, an Apache Spark ETL job, or an Apache Spark streaming ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl") or Apache Spark streaming ETL job (JobCommand.Name="gluestreaming"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.  
     */
    MaxCapacity?: NullableDouble;
    /**
     * The name of the SecurityConfiguration structure to be used with this job.
     */
    SecurityConfiguration?: NameString;
    /**
     * The tags to use with this job. You may use tags to limit access to the job. For more information about tags in Glue, see Amazon Web Services Tags in Glue in the developer guide.
     */
    Tags?: TagsMap;
    /**
     * Specifies configuration properties of a job notification.
     */
    NotificationProperty?: NotificationProperty;
    /**
     * In Spark jobs, GlueVersion determines the versions of Apache Spark and Python that Glue available in a job. The Python version indicates the version supported for jobs of type Spark.  Ray jobs should set GlueVersion to 4.0 or greater. However, the versions of Ray, Python and additional libraries available in your Ray job are determined by the Runtime parameter of the Job command. For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Jobs that are created without specifying a Glue version default to Glue 0.9.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of G.1X, G.2X, G.4X, G.8X or G.025X for Spark jobs. Accepts the value Z.2X for Ray jobs.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPUs, 16 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPUs, 32 GB of memory) with 128GB disk (approximately 77GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.4X worker type, each worker maps to 4 DPU (16 vCPUs, 64 GB of memory) with 256GB disk (approximately 235GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs in the following Amazon Web Services Regions: US East (Ohio), US East (N. Virginia), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Canada (Central), Europe (Frankfurt), Europe (Ireland), and Europe (Stockholm).   For the G.8X worker type, each worker maps to 8 DPU (32 vCPUs, 128 GB of memory) with 512GB disk (approximately 487GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs, in the same Amazon Web Services Regions as supported for the G.4X worker type.   For the G.025X worker type, each worker maps to 0.25 DPU (2 vCPUs, 4 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for low volume streaming jobs. This worker type is only available for Glue version 3.0 streaming jobs.   For the Z.2X worker type, each worker maps to 2 M-DPU (8vCPUs, 64 GB of memory) with 128 GB disk (approximately 120GB free), and provides up to 8 Ray workers based on the autoscaler.  
     */
    WorkerType?: WorkerType;
    /**
     * The representation of a directed acyclic graph on which both the Glue Studio visual component and Glue Studio code generation is based.
     */
    CodeGenConfigurationNodes?: CodeGenConfigurationNodes;
    /**
     * Indicates whether the job is run with a standard or flexible execution class. The standard execution-class is ideal for time-sensitive workloads that require fast job startup and dedicated resources. The flexible execution class is appropriate for time-insensitive jobs whose start and completion times may vary.  Only jobs with Glue version 3.0 and above and command type glueetl will be allowed to set ExecutionClass to FLEX. The flexible execution class is available for Spark jobs.
     */
    ExecutionClass?: ExecutionClass;
    /**
     * The details for a source control configuration for a job, allowing synchronization of job artifacts to or from a remote repository.
     */
    SourceControlDetails?: SourceControlDetails;
  }
  export interface CreateJobResponse {
    /**
     * The unique name that was provided for this job definition.
     */
    Name?: NameString;
  }
  export interface CreateJsonClassifierRequest {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * A JsonPath string defining the JSON data for the classifier to classify. Glue supports a subset of JsonPath, as described in Writing JsonPath Custom Classifiers.
     */
    JsonPath: JsonPath;
  }
  export interface CreateMLTransformRequest {
    /**
     * The unique name that you give the transform when you create it.
     */
    Name: NameString;
    /**
     * A description of the machine learning transform that is being defined. The default is an empty string.
     */
    Description?: DescriptionString;
    /**
     * A list of Glue table definitions used by the transform.
     */
    InputRecordTables: GlueTables;
    /**
     * The algorithmic parameters that are specific to the transform type used. Conditionally dependent on the transform type.
     */
    Parameters: TransformParameters;
    /**
     * The name or Amazon Resource Name (ARN) of the IAM role with the required permissions. The required permissions include both Glue service role permissions to Glue resources, and Amazon S3 permissions required by the transform.    This role needs Glue service role permissions to allow access to resources in Glue. See Attach a Policy to IAM Users That Access Glue.   This role needs permission to your Amazon Simple Storage Service (Amazon S3) sources, targets, temporary directory, scripts, and any libraries used by the task run for this transform.  
     */
    Role: RoleString;
    /**
     * This value determines which version of Glue this machine learning transform is compatible with. Glue 1.0 is recommended for most customers. If the value is not set, the Glue compatibility defaults to Glue 0.9. For more information, see Glue Versions in the developer guide.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of Glue data processing units (DPUs) that are allocated to task runs for this transform. You can allocate from 2 to 100 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.   MaxCapacity is a mutually exclusive option with NumberOfWorkers and WorkerType.   If either NumberOfWorkers or WorkerType is set, then MaxCapacity cannot be set.   If MaxCapacity is set then neither NumberOfWorkers or WorkerType can be set.   If WorkerType is set, then NumberOfWorkers is required (and vice versa).    MaxCapacity and NumberOfWorkers must both be at least 1.   When the WorkerType field is set to a value other than Standard, the MaxCapacity field is set automatically and becomes read-only. When the WorkerType field is set to a value other than Standard, the MaxCapacity field is set automatically and becomes read-only.
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when this task runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker provides 4 vCPU, 16 GB of memory and a 64GB disk, and 1 executor per worker.   For the G.2X worker type, each worker provides 8 vCPU, 32 GB of memory and a 128GB disk, and 1 executor per worker.    MaxCapacity is a mutually exclusive option with NumberOfWorkers and WorkerType.   If either NumberOfWorkers or WorkerType is set, then MaxCapacity cannot be set.   If MaxCapacity is set then neither NumberOfWorkers or WorkerType can be set.   If WorkerType is set, then NumberOfWorkers is required (and vice versa).    MaxCapacity and NumberOfWorkers must both be at least 1.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when this task runs. If WorkerType is set, then NumberOfWorkers is required (and vice versa).
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The timeout of the task run for this transform in minutes. This is the maximum time that a task run for this transform can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * The maximum number of times to retry a task for this transform after a task run fails.
     */
    MaxRetries?: NullableInteger;
    /**
     * The tags to use with this machine learning transform. You may use tags to limit access to the machine learning transform. For more information about tags in Glue, see Amazon Web Services Tags in Glue in the developer guide.
     */
    Tags?: TagsMap;
    /**
     * The encryption-at-rest settings of the transform that apply to accessing user data. Machine learning transforms can access user data encrypted in Amazon S3 using KMS.
     */
    TransformEncryption?: TransformEncryption;
  }
  export interface CreateMLTransformResponse {
    /**
     * A unique identifier that is generated for the transform.
     */
    TransformId?: HashString;
  }
  export interface CreatePartitionIndexRequest {
    /**
     * The catalog ID where the table resides.
     */
    CatalogId?: CatalogIdString;
    /**
     * Specifies the name of a database in which you want to create a partition index.
     */
    DatabaseName: NameString;
    /**
     * Specifies the name of a table in which you want to create a partition index.
     */
    TableName: NameString;
    /**
     * Specifies a PartitionIndex structure to create a partition index in an existing table.
     */
    PartitionIndex: PartitionIndex;
  }
  export interface CreatePartitionIndexResponse {
  }
  export interface CreatePartitionRequest {
    /**
     * The Amazon Web Services account ID of the catalog in which the partition is to be created.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the metadata database in which the partition is to be created.
     */
    DatabaseName: NameString;
    /**
     * The name of the metadata table in which the partition is to be created.
     */
    TableName: NameString;
    /**
     * A PartitionInput structure defining the partition to be created.
     */
    PartitionInput: PartitionInput;
  }
  export interface CreatePartitionResponse {
  }
  export interface CreateRegistryInput {
    /**
     * Name of the registry to be created of max length of 255, and may only contain letters, numbers, hyphen, underscore, dollar sign, or hash mark. No whitespace.
     */
    RegistryName: SchemaRegistryNameString;
    /**
     * A description of the registry. If description is not provided, there will not be any default value for this.
     */
    Description?: DescriptionString;
    /**
     * Amazon Web Services tags that contain a key value pair and may be searched by console, command line, or API.
     */
    Tags?: TagsMap;
  }
  export interface CreateRegistryResponse {
    /**
     * The Amazon Resource Name (ARN) of the newly created registry.
     */
    RegistryArn?: GlueResourceArn;
    /**
     * The name of the registry.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * A description of the registry.
     */
    Description?: DescriptionString;
    /**
     * The tags for the registry.
     */
    Tags?: TagsMap;
  }
  export interface CreateSchemaInput {
    /**
     *  This is a wrapper shape to contain the registry identity fields. If this is not provided, the default registry will be used. The ARN format for the same will be: arn:aws:glue:us-east-2:&lt;customer id&gt;:registry/default-registry:random-5-letter-id.
     */
    RegistryId?: RegistryId;
    /**
     * Name of the schema to be created of max length of 255, and may only contain letters, numbers, hyphen, underscore, dollar sign, or hash mark. No whitespace.
     */
    SchemaName: SchemaRegistryNameString;
    /**
     * The data format of the schema definition. Currently AVRO, JSON and PROTOBUF are supported.
     */
    DataFormat: DataFormat;
    /**
     * The compatibility mode of the schema. The possible values are:    NONE: No compatibility mode applies. You can use this choice in development scenarios or if you do not know the compatibility mode that you want to apply to schemas. Any new version added will be accepted without undergoing a compatibility check.    DISABLED: This compatibility choice prevents versioning for a particular schema. You can use this choice to prevent future versioning of a schema.    BACKWARD: This compatibility choice is recommended as it allows data receivers to read both the current and one previous schema version. This means that for instance, a new schema version cannot drop data fields or change the type of these fields, so they can't be read by readers using the previous version.    BACKWARD_ALL: This compatibility choice allows data receivers to read both the current and all previous schema versions. You can use this choice when you need to delete fields or add optional fields, and check compatibility against all previous schema versions.     FORWARD: This compatibility choice allows data receivers to read both the current and one next schema version, but not necessarily later versions. You can use this choice when you need to add fields or delete optional fields, but only check compatibility against the last schema version.    FORWARD_ALL: This compatibility choice allows data receivers to read written by producers of any new registered schema. You can use this choice when you need to add fields or delete optional fields, and check compatibility against all previous schema versions.    FULL: This compatibility choice allows data receivers to read data written by producers using the previous or next version of the schema, but not necessarily earlier or later versions. You can use this choice when you need to add or remove optional fields, but only check compatibility against the last schema version.    FULL_ALL: This compatibility choice allows data receivers to read data written by producers using all previous schema versions. You can use this choice when you need to add or remove optional fields, and check compatibility against all previous schema versions.  
     */
    Compatibility?: Compatibility;
    /**
     * An optional description of the schema. If description is not provided, there will not be any automatic default value for this.
     */
    Description?: DescriptionString;
    /**
     * Amazon Web Services tags that contain a key value pair and may be searched by console, command line, or API. If specified, follows the Amazon Web Services tags-on-create pattern.
     */
    Tags?: TagsMap;
    /**
     * The schema definition using the DataFormat setting for SchemaName.
     */
    SchemaDefinition?: SchemaDefinitionString;
  }
  export interface CreateSchemaResponse {
    /**
     * The name of the registry.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource Name (ARN) of the registry.
     */
    RegistryArn?: GlueResourceArn;
    /**
     * The name of the schema.
     */
    SchemaName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * A description of the schema if specified when created.
     */
    Description?: DescriptionString;
    /**
     * The data format of the schema definition. Currently AVRO, JSON and PROTOBUF are supported.
     */
    DataFormat?: DataFormat;
    /**
     * The schema compatibility mode.
     */
    Compatibility?: Compatibility;
    /**
     * The version number of the checkpoint (the last time the compatibility mode was changed).
     */
    SchemaCheckpoint?: SchemaCheckpointNumber;
    /**
     * The latest version of the schema associated with the returned schema definition.
     */
    LatestSchemaVersion?: VersionLongNumber;
    /**
     * The next version of the schema associated with the returned schema definition.
     */
    NextSchemaVersion?: VersionLongNumber;
    /**
     * The status of the schema. 
     */
    SchemaStatus?: SchemaStatus;
    /**
     * The tags for the schema.
     */
    Tags?: TagsMap;
    /**
     * The unique identifier of the first schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The status of the first schema version created.
     */
    SchemaVersionStatus?: SchemaVersionStatus;
  }
  export interface CreateScriptRequest {
    /**
     * A list of the nodes in the DAG.
     */
    DagNodes?: DagNodes;
    /**
     * A list of the edges in the DAG.
     */
    DagEdges?: DagEdges;
    /**
     * The programming language of the resulting code from the DAG.
     */
    Language?: Language;
  }
  export interface CreateScriptResponse {
    /**
     * The Python script generated from the DAG.
     */
    PythonScript?: PythonScript;
    /**
     * The Scala code generated from the DAG.
     */
    ScalaCode?: ScalaCode;
  }
  export interface CreateSecurityConfigurationRequest {
    /**
     * The name for the new security configuration.
     */
    Name: NameString;
    /**
     * The encryption configuration for the new security configuration.
     */
    EncryptionConfiguration: EncryptionConfiguration;
  }
  export interface CreateSecurityConfigurationResponse {
    /**
     * The name assigned to the new security configuration.
     */
    Name?: NameString;
    /**
     * The time at which the new security configuration was created.
     */
    CreatedTimestamp?: TimestampValue;
  }
  export interface CreateSessionRequest {
    /**
     * The ID of the session request. 
     */
    Id: NameString;
    /**
     * The description of the session. 
     */
    Description?: DescriptionString;
    /**
     * The IAM Role ARN 
     */
    Role: OrchestrationRoleArn;
    /**
     * The SessionCommand that runs the job. 
     */
    Command: SessionCommand;
    /**
     *  The number of minutes before session times out. Default for Spark ETL jobs is 48 hours (2880 minutes), the maximum session lifetime for this job type. Consult the documentation for other job types. 
     */
    Timeout?: Timeout;
    /**
     *  The number of minutes when idle before session times out. Default for Spark ETL jobs is value of Timeout. Consult the documentation for other job types. 
     */
    IdleTimeout?: Timeout;
    /**
     * A map array of key-value pairs. Max is 75 pairs. 
     */
    DefaultArguments?: OrchestrationArgumentsMap;
    /**
     * The number of connections to use for the session. 
     */
    Connections?: ConnectionsList;
    /**
     * The number of Glue data processing units (DPUs) that can be allocated when the job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB memory. 
     */
    MaxCapacity?: NullableDouble;
    /**
     * The number of workers of a defined WorkerType to use for the session. 
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of G.1X, G.2X, G.4X, or G.8X for Spark jobs. Accepts the value Z.2X for Ray notebooks.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPUs, 16 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPUs, 32 GB of memory) with 128GB disk (approximately 77GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.4X worker type, each worker maps to 4 DPU (16 vCPUs, 64 GB of memory) with 256GB disk (approximately 235GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs in the following Amazon Web Services Regions: US East (Ohio), US East (N. Virginia), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Canada (Central), Europe (Frankfurt), Europe (Ireland), and Europe (Stockholm).   For the G.8X worker type, each worker maps to 8 DPU (32 vCPUs, 128 GB of memory) with 512GB disk (approximately 487GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs, in the same Amazon Web Services Regions as supported for the G.4X worker type.   For the Z.2X worker type, each worker maps to 2 M-DPU (8vCPUs, 64 GB of memory) with 128 GB disk (approximately 120GB free), and provides up to 8 Ray workers based on the autoscaler.  
     */
    WorkerType?: WorkerType;
    /**
     * The name of the SecurityConfiguration structure to be used with the session 
     */
    SecurityConfiguration?: NameString;
    /**
     * The Glue version determines the versions of Apache Spark and Python that Glue supports. The GlueVersion must be greater than 2.0. 
     */
    GlueVersion?: GlueVersionString;
    /**
     * The map of key value pairs (tags) belonging to the session.
     */
    Tags?: TagsMap;
    /**
     * The origin of the request. 
     */
    RequestOrigin?: OrchestrationNameString;
  }
  export interface CreateSessionResponse {
    /**
     * Returns the session object in the response.
     */
    Session?: Session;
  }
  export interface CreateTableRequest {
    /**
     * The ID of the Data Catalog in which to create the Table. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The catalog database in which to create the new table. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * The TableInput object that defines the metadata table to create in the catalog.
     */
    TableInput: TableInput;
    /**
     * A list of partition indexes, PartitionIndex structures, to create in the table.
     */
    PartitionIndexes?: PartitionIndexList;
    /**
     * The ID of the transaction.
     */
    TransactionId?: TransactionIdString;
    /**
     * Specifies an OpenTableFormatInput structure when creating an open format table.
     */
    OpenTableFormatInput?: OpenTableFormatInput;
  }
  export interface CreateTableResponse {
  }
  export interface CreateTriggerRequest {
    /**
     * The name of the trigger.
     */
    Name: NameString;
    /**
     * The name of the workflow associated with the trigger.
     */
    WorkflowName?: NameString;
    /**
     * The type of the new trigger.
     */
    Type: TriggerType;
    /**
     * A cron expression used to specify the schedule (see Time-Based Schedules for Jobs and Crawlers. For example, to run something every day at 12:15 UTC, you would specify: cron(15 12 * * ? *). This field is required when the trigger type is SCHEDULED.
     */
    Schedule?: GenericString;
    /**
     * A predicate to specify when the new trigger should fire. This field is required when the trigger type is CONDITIONAL.
     */
    Predicate?: Predicate;
    /**
     * The actions initiated by this trigger when it fires.
     */
    Actions: ActionList;
    /**
     * A description of the new trigger.
     */
    Description?: DescriptionString;
    /**
     * Set to true to start SCHEDULED and CONDITIONAL triggers when created. True is not supported for ON_DEMAND triggers.
     */
    StartOnCreation?: BooleanValue;
    /**
     * The tags to use with this trigger. You may use tags to limit access to the trigger. For more information about tags in Glue, see Amazon Web Services Tags in Glue in the developer guide. 
     */
    Tags?: TagsMap;
    /**
     * Batch condition that must be met (specified number of events received or batch time window expired) before EventBridge event trigger fires.
     */
    EventBatchingCondition?: EventBatchingCondition;
  }
  export interface CreateTriggerResponse {
    /**
     * The name of the trigger.
     */
    Name?: NameString;
  }
  export interface CreateUserDefinedFunctionRequest {
    /**
     * The ID of the Data Catalog in which to create the function. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database in which to create the function.
     */
    DatabaseName: NameString;
    /**
     * A FunctionInput object that defines the function to create in the Data Catalog.
     */
    FunctionInput: UserDefinedFunctionInput;
  }
  export interface CreateUserDefinedFunctionResponse {
  }
  export interface CreateWorkflowRequest {
    /**
     * The name to be assigned to the workflow. It should be unique within your account.
     */
    Name: NameString;
    /**
     * A description of the workflow.
     */
    Description?: GenericString;
    /**
     * A collection of properties to be used as part of each execution of the workflow.
     */
    DefaultRunProperties?: WorkflowRunProperties;
    /**
     * The tags to be used with this workflow.
     */
    Tags?: TagsMap;
    /**
     * You can use this parameter to prevent unwanted multiple updates to data, to control costs, or in some cases, to prevent exceeding the maximum number of concurrent runs of any of the component jobs. If you leave this parameter blank, there is no limit to the number of concurrent workflow runs.
     */
    MaxConcurrentRuns?: NullableInteger;
  }
  export interface CreateWorkflowResponse {
    /**
     * The name of the workflow which was provided as part of the request.
     */
    Name?: NameString;
  }
  export interface CreateXMLClassifierRequest {
    /**
     * An identifier of the data format that the classifier matches.
     */
    Classification: Classification;
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * The XML tag designating the element that contains each record in an XML document being parsed. This can't identify a self-closing element (closed by /&gt;). An empty row element that contains only attributes can be parsed as long as it ends with a closing tag (for example, &lt;row item_a="A" item_b="B"&gt;&lt;/row&gt; is okay, but &lt;row item_a="A" item_b="B" /&gt; is not).
     */
    RowTag?: RowTag;
  }
  export type CreatedTimestamp = string;
  export type CronExpression = string;
  export interface CsvClassifier {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * The time that this classifier was registered.
     */
    CreationTime?: Timestamp;
    /**
     * The time that this classifier was last updated.
     */
    LastUpdated?: Timestamp;
    /**
     * The version of this classifier.
     */
    Version?: VersionId;
    /**
     * A custom symbol to denote what separates each column entry in the row.
     */
    Delimiter?: CsvColumnDelimiter;
    /**
     * A custom symbol to denote what combines content into a single column value. It must be different from the column delimiter.
     */
    QuoteSymbol?: CsvQuoteSymbol;
    /**
     * Indicates whether the CSV file contains a header.
     */
    ContainsHeader?: CsvHeaderOption;
    /**
     * A list of strings representing column names.
     */
    Header?: CsvHeader;
    /**
     * Specifies not to trim values before identifying the type of column values. The default value is true.
     */
    DisableValueTrimming?: NullableBoolean;
    /**
     * Enables the processing of files that contain only one column.
     */
    AllowSingleColumn?: NullableBoolean;
    /**
     * Enables the custom datatype to be configured.
     */
    CustomDatatypeConfigured?: NullableBoolean;
    /**
     * A list of custom datatypes including "BINARY", "BOOLEAN", "DATE", "DECIMAL", "DOUBLE", "FLOAT", "INT", "LONG", "SHORT", "STRING", "TIMESTAMP".
     */
    CustomDatatypes?: CustomDatatypes;
    /**
     * Sets the SerDe for processing CSV in the classifier, which will be applied in the Data Catalog. Valid values are OpenCSVSerDe, LazySimpleSerDe, and None. You can specify the None value when you want the crawler to do the detection.
     */
    Serde?: CsvSerdeOption;
  }
  export type CsvColumnDelimiter = string;
  export type CsvHeader = NameString[];
  export type CsvHeaderOption = "UNKNOWN"|"PRESENT"|"ABSENT"|string;
  export type CsvQuoteSymbol = string;
  export type CsvSerdeOption = "OpenCSVSerDe"|"LazySimpleSerDe"|"None"|string;
  export interface CustomCode {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: ManyInputs;
    /**
     * The custom code that is used to perform the data transformation.
     */
    Code: ExtendedString;
    /**
     * The name defined for the custom code node class.
     */
    ClassName: EnclosedInStringProperty;
    /**
     * Specifies the data schema for the custom code transform.
     */
    OutputSchemas?: GlueSchemas;
  }
  export type CustomDatatypes = NameString[];
  export interface CustomEntityType {
    /**
     * A name for the custom pattern that allows it to be retrieved or deleted later. This name must be unique per Amazon Web Services account.
     */
    Name: NameString;
    /**
     * A regular expression string that is used for detecting sensitive data in a custom pattern.
     */
    RegexString: NameString;
    /**
     * A list of context words. If none of these context words are found within the vicinity of the regular expression the data will not be detected as sensitive data. If no context words are passed only a regular expression is checked.
     */
    ContextWords?: ContextWords;
  }
  export type CustomEntityTypeNames = NameString[];
  export type CustomEntityTypes = CustomEntityType[];
  export type CustomPatterns = string;
  export type DQAdditionalOptions = {[key: string]: GenericString};
  export type DQDLAliases = {[key: string]: EnclosedInStringProperty};
  export type DQDLString = string;
  export interface DQResultsPublishingOptions {
    /**
     * The context of the evaluation.
     */
    EvaluationContext?: GenericLimitedString;
    /**
     * The Amazon S3 prefix prepended to the results.
     */
    ResultsS3Prefix?: EnclosedInStringProperty;
    /**
     * Enable metrics for your data quality results.
     */
    CloudWatchMetricsEnabled?: BoxedBoolean;
    /**
     * Enable publishing for your data quality results.
     */
    ResultsPublishingEnabled?: BoxedBoolean;
  }
  export interface DQStopJobOnFailureOptions {
    /**
     * When to stop job if your data quality evaluation fails. Options are Immediate or AfterDataLoad.
     */
    StopJobOnFailureTiming?: DQStopJobOnFailureTiming;
  }
  export type DQStopJobOnFailureTiming = "Immediate"|"AfterDataLoad"|string;
  export type DQTransformOutput = "PrimaryInput"|"EvaluationResults"|string;
  export type DagEdges = CodeGenEdge[];
  export type DagNodes = CodeGenNode[];
  export interface DataCatalogEncryptionSettings {
    /**
     * Specifies the encryption-at-rest configuration for the Data Catalog.
     */
    EncryptionAtRest?: EncryptionAtRest;
    /**
     * When connection password protection is enabled, the Data Catalog uses a customer-provided key to encrypt the password as part of CreateConnection or UpdateConnection and store it in the ENCRYPTED_PASSWORD field in the connection properties. You can enable catalog encryption or only password encryption.
     */
    ConnectionPasswordEncryption?: ConnectionPasswordEncryption;
  }
  export type DataFormat = "AVRO"|"JSON"|"PROTOBUF"|string;
  export interface DataLakePrincipal {
    /**
     * An identifier for the Lake Formation principal.
     */
    DataLakePrincipalIdentifier?: DataLakePrincipalString;
  }
  export type DataLakePrincipalString = string;
  export interface DataQualityEvaluationRunAdditionalRunOptions {
    /**
     * Whether or not to enable CloudWatch metrics.
     */
    CloudWatchMetricsEnabled?: NullableBoolean;
    /**
     * Prefix for Amazon S3 to store results.
     */
    ResultsS3Prefix?: UriString;
  }
  export interface DataQualityResult {
    /**
     * A unique result ID for the data quality result.
     */
    ResultId?: HashString;
    /**
     * An aggregate data quality score. Represents the ratio of rules that passed to the total number of rules.
     */
    Score?: GenericBoundedDouble;
    /**
     * The table associated with the data quality result, if any.
     */
    DataSource?: DataSource;
    /**
     * The name of the ruleset associated with the data quality result.
     */
    RulesetName?: NameString;
    /**
     * In the context of a job in Glue Studio, each node in the canvas is typically assigned some sort of name and data quality nodes will have names. In the case of multiple nodes, the evaluationContext can differentiate the nodes.
     */
    EvaluationContext?: GenericString;
    /**
     * The date and time when this data quality run started.
     */
    StartedOn?: Timestamp;
    /**
     * The date and time when this data quality run completed.
     */
    CompletedOn?: Timestamp;
    /**
     * The job name associated with the data quality result, if any.
     */
    JobName?: NameString;
    /**
     * The job run ID associated with the data quality result, if any.
     */
    JobRunId?: HashString;
    /**
     * The unique run ID for the ruleset evaluation for this data quality result.
     */
    RulesetEvaluationRunId?: HashString;
    /**
     * A list of DataQualityRuleResult objects representing the results for each rule. 
     */
    RuleResults?: DataQualityRuleResults;
  }
  export interface DataQualityResultDescription {
    /**
     * The unique result ID for this data quality result.
     */
    ResultId?: HashString;
    /**
     * The table name associated with the data quality result.
     */
    DataSource?: DataSource;
    /**
     * The job name associated with the data quality result.
     */
    JobName?: NameString;
    /**
     * The job run ID associated with the data quality result.
     */
    JobRunId?: HashString;
    /**
     * The time that the run started for this data quality result.
     */
    StartedOn?: Timestamp;
  }
  export type DataQualityResultDescriptionList = DataQualityResultDescription[];
  export interface DataQualityResultFilterCriteria {
    /**
     * Filter results by the specified data source. For example, retrieving all results for an Glue table.
     */
    DataSource?: DataSource;
    /**
     * Filter results by the specified job name.
     */
    JobName?: NameString;
    /**
     * Filter results by the specified job run ID.
     */
    JobRunId?: HashString;
    /**
     * Filter results by runs that started after this time.
     */
    StartedAfter?: Timestamp;
    /**
     * Filter results by runs that started before this time.
     */
    StartedBefore?: Timestamp;
  }
  export type DataQualityResultIdList = HashString[];
  export type DataQualityResultIds = HashString[];
  export type DataQualityResultsList = DataQualityResult[];
  export interface DataQualityRuleRecommendationRunDescription {
    /**
     * The unique run identifier associated with this run.
     */
    RunId?: HashString;
    /**
     * The status for this run.
     */
    Status?: TaskStatusType;
    /**
     * The date and time when this run started.
     */
    StartedOn?: Timestamp;
    /**
     * The data source (Glue table) associated with the recommendation run.
     */
    DataSource?: DataSource;
  }
  export interface DataQualityRuleRecommendationRunFilter {
    /**
     * Filter based on a specified data source (Glue table).
     */
    DataSource: DataSource;
    /**
     * Filter based on time for results started before provided time.
     */
    StartedBefore?: Timestamp;
    /**
     * Filter based on time for results started after provided time.
     */
    StartedAfter?: Timestamp;
  }
  export type DataQualityRuleRecommendationRunList = DataQualityRuleRecommendationRunDescription[];
  export interface DataQualityRuleResult {
    /**
     * The name of the data quality rule.
     */
    Name?: NameString;
    /**
     * A description of the data quality rule.
     */
    Description?: DescriptionString;
    /**
     * An evaluation message.
     */
    EvaluationMessage?: DescriptionString;
    /**
     * A pass or fail status for the rule.
     */
    Result?: DataQualityRuleResultStatus;
    /**
     * A map of metrics associated with the evaluation of the rule.
     */
    EvaluatedMetrics?: EvaluatedMetricsMap;
  }
  export type DataQualityRuleResultStatus = "PASS"|"FAIL"|"ERROR"|string;
  export type DataQualityRuleResults = DataQualityRuleResult[];
  export interface DataQualityRulesetEvaluationRunDescription {
    /**
     * The unique run identifier associated with this run.
     */
    RunId?: HashString;
    /**
     * The status for this run.
     */
    Status?: TaskStatusType;
    /**
     * The date and time when the run started.
     */
    StartedOn?: Timestamp;
    /**
     * The data source (an Glue table) associated with the run.
     */
    DataSource?: DataSource;
  }
  export interface DataQualityRulesetEvaluationRunFilter {
    /**
     * Filter based on a data source (an Glue table) associated with the run.
     */
    DataSource: DataSource;
    /**
     * Filter results by runs that started before this time.
     */
    StartedBefore?: Timestamp;
    /**
     * Filter results by runs that started after this time.
     */
    StartedAfter?: Timestamp;
  }
  export type DataQualityRulesetEvaluationRunList = DataQualityRulesetEvaluationRunDescription[];
  export interface DataQualityRulesetFilterCriteria {
    /**
     * The name of the ruleset filter criteria.
     */
    Name?: NameString;
    /**
     * The description of the ruleset filter criteria.
     */
    Description?: DescriptionString;
    /**
     * Filter on rulesets created before this date.
     */
    CreatedBefore?: Timestamp;
    /**
     * Filter on rulesets created after this date.
     */
    CreatedAfter?: Timestamp;
    /**
     * Filter on rulesets last modified before this date.
     */
    LastModifiedBefore?: Timestamp;
    /**
     * Filter on rulesets last modified after this date.
     */
    LastModifiedAfter?: Timestamp;
    /**
     * The name and database name of the target table.
     */
    TargetTable?: DataQualityTargetTable;
  }
  export type DataQualityRulesetList = DataQualityRulesetListDetails[];
  export interface DataQualityRulesetListDetails {
    /**
     * The name of the data quality ruleset.
     */
    Name?: NameString;
    /**
     * A description of the data quality ruleset.
     */
    Description?: DescriptionString;
    /**
     * The date and time the data quality ruleset was created.
     */
    CreatedOn?: Timestamp;
    /**
     * The date and time the data quality ruleset was last modified.
     */
    LastModifiedOn?: Timestamp;
    /**
     * An object representing an Glue table.
     */
    TargetTable?: DataQualityTargetTable;
    /**
     * When a ruleset was created from a recommendation run, this run ID is generated to link the two together.
     */
    RecommendationRunId?: HashString;
    /**
     * The number of rules in the ruleset.
     */
    RuleCount?: NullableInteger;
  }
  export type DataQualityRulesetString = string;
  export interface DataQualityTargetTable {
    /**
     * The name of the Glue table.
     */
    TableName: NameString;
    /**
     * The name of the database where the Glue table exists.
     */
    DatabaseName: NameString;
    /**
     * The catalog id where the Glue table exists.
     */
    CatalogId?: NameString;
  }
  export interface DataSource {
    /**
     * An Glue table.
     */
    GlueTable: GlueTable;
  }
  export type DataSourceMap = {[key: string]: DataSource};
  export interface Database {
    /**
     * The name of the database. For Hive compatibility, this is folded to lowercase when it is stored.
     */
    Name: NameString;
    /**
     * A description of the database.
     */
    Description?: DescriptionString;
    /**
     * The location of the database (for example, an HDFS path).
     */
    LocationUri?: URI;
    /**
     * These key-value pairs define parameters and properties of the database.
     */
    Parameters?: ParametersMap;
    /**
     * The time at which the metadata database was created in the catalog.
     */
    CreateTime?: Timestamp;
    /**
     * Creates a set of default permissions on the table for principals. Used by Lake Formation. Not used in the normal course of Glue operations.
     */
    CreateTableDefaultPermissions?: PrincipalPermissionsList;
    /**
     * A DatabaseIdentifier structure that describes a target database for resource linking.
     */
    TargetDatabase?: DatabaseIdentifier;
    /**
     * The ID of the Data Catalog in which the database resides.
     */
    CatalogId?: CatalogIdString;
    /**
     * A FederatedDatabase structure that references an entity outside the Glue Data Catalog.
     */
    FederatedDatabase?: FederatedDatabase;
  }
  export interface DatabaseIdentifier {
    /**
     * The ID of the Data Catalog in which the database resides.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database.
     */
    DatabaseName?: NameString;
    /**
     * Region of the target database.
     */
    Region?: NameString;
  }
  export interface DatabaseInput {
    /**
     * The name of the database. For Hive compatibility, this is folded to lowercase when it is stored.
     */
    Name: NameString;
    /**
     * A description of the database.
     */
    Description?: DescriptionString;
    /**
     * The location of the database (for example, an HDFS path). 
     */
    LocationUri?: URI;
    /**
     * These key-value pairs define parameters and properties of the database. These key-value pairs define parameters and properties of the database.
     */
    Parameters?: ParametersMap;
    /**
     * Creates a set of default permissions on the table for principals. Used by Lake Formation. Not used in the normal course of Glue operations.
     */
    CreateTableDefaultPermissions?: PrincipalPermissionsList;
    /**
     * A DatabaseIdentifier structure that describes a target database for resource linking.
     */
    TargetDatabase?: DatabaseIdentifier;
    /**
     * A FederatedDatabase structure that references an entity outside the Glue Data Catalog.
     */
    FederatedDatabase?: FederatedDatabase;
  }
  export type DatabaseList = Database[];
  export type DatabaseName = string;
  export interface Datatype {
    /**
     * The datatype of the value.
     */
    Id: GenericLimitedString;
    /**
     * A label assigned to the datatype.
     */
    Label: GenericLimitedString;
  }
  export interface DateColumnStatisticsData {
    /**
     * The lowest value in the column.
     */
    MinimumValue?: Timestamp;
    /**
     * The highest value in the column.
     */
    MaximumValue?: Timestamp;
    /**
     * The number of null values in the column.
     */
    NumberOfNulls: NonNegativeLong;
    /**
     * The number of distinct values in a column.
     */
    NumberOfDistinctValues: NonNegativeLong;
  }
  export interface DecimalColumnStatisticsData {
    /**
     * The lowest value in the column.
     */
    MinimumValue?: DecimalNumber;
    /**
     * The highest value in the column.
     */
    MaximumValue?: DecimalNumber;
    /**
     * The number of null values in the column.
     */
    NumberOfNulls: NonNegativeLong;
    /**
     * The number of distinct values in a column.
     */
    NumberOfDistinctValues: NonNegativeLong;
  }
  export interface DecimalNumber {
    /**
     * The unscaled numeric value.
     */
    UnscaledValue: _Blob;
    /**
     * The scale that determines where the decimal point falls in the unscaled value.
     */
    Scale: Integer;
  }
  export type DeleteBehavior = "LOG"|"DELETE_FROM_DATABASE"|"DEPRECATE_IN_DATABASE"|string;
  export interface DeleteBlueprintRequest {
    /**
     * The name of the blueprint to delete.
     */
    Name: NameString;
  }
  export interface DeleteBlueprintResponse {
    /**
     * Returns the name of the blueprint that was deleted.
     */
    Name?: NameString;
  }
  export interface DeleteClassifierRequest {
    /**
     * Name of the classifier to remove.
     */
    Name: NameString;
  }
  export interface DeleteClassifierResponse {
  }
  export interface DeleteColumnStatisticsForPartitionRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the partitions' table.
     */
    TableName: NameString;
    /**
     * A list of partition values identifying the partition.
     */
    PartitionValues: ValueStringList;
    /**
     * Name of the column.
     */
    ColumnName: NameString;
  }
  export interface DeleteColumnStatisticsForPartitionResponse {
  }
  export interface DeleteColumnStatisticsForTableRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the partitions' table.
     */
    TableName: NameString;
    /**
     * The name of the column.
     */
    ColumnName: NameString;
  }
  export interface DeleteColumnStatisticsForTableResponse {
  }
  export type DeleteConnectionNameList = NameString[];
  export interface DeleteConnectionRequest {
    /**
     * The ID of the Data Catalog in which the connection resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the connection to delete.
     */
    ConnectionName: NameString;
  }
  export interface DeleteConnectionResponse {
  }
  export interface DeleteCrawlerRequest {
    /**
     * The name of the crawler to remove.
     */
    Name: NameString;
  }
  export interface DeleteCrawlerResponse {
  }
  export interface DeleteCustomEntityTypeRequest {
    /**
     * The name of the custom pattern that you want to delete.
     */
    Name: NameString;
  }
  export interface DeleteCustomEntityTypeResponse {
    /**
     * The name of the custom pattern you deleted.
     */
    Name?: NameString;
  }
  export interface DeleteDataQualityRulesetRequest {
    /**
     * A name for the data quality ruleset.
     */
    Name: NameString;
  }
  export interface DeleteDataQualityRulesetResponse {
  }
  export interface DeleteDatabaseRequest {
    /**
     * The ID of the Data Catalog in which the database resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the database to delete. For Hive compatibility, this must be all lowercase.
     */
    Name: NameString;
  }
  export interface DeleteDatabaseResponse {
  }
  export interface DeleteDevEndpointRequest {
    /**
     * The name of the DevEndpoint.
     */
    EndpointName: GenericString;
  }
  export interface DeleteDevEndpointResponse {
  }
  export interface DeleteJobRequest {
    /**
     * The name of the job definition to delete.
     */
    JobName: NameString;
  }
  export interface DeleteJobResponse {
    /**
     * The name of the job definition that was deleted.
     */
    JobName?: NameString;
  }
  export interface DeleteMLTransformRequest {
    /**
     * The unique identifier of the transform to delete.
     */
    TransformId: HashString;
  }
  export interface DeleteMLTransformResponse {
    /**
     * The unique identifier of the transform that was deleted.
     */
    TransformId?: HashString;
  }
  export interface DeletePartitionIndexRequest {
    /**
     * The catalog ID where the table resides.
     */
    CatalogId?: CatalogIdString;
    /**
     * Specifies the name of a database from which you want to delete a partition index.
     */
    DatabaseName: NameString;
    /**
     * Specifies the name of a table from which you want to delete a partition index.
     */
    TableName: NameString;
    /**
     * The name of the partition index to be deleted.
     */
    IndexName: NameString;
  }
  export interface DeletePartitionIndexResponse {
  }
  export interface DeletePartitionRequest {
    /**
     * The ID of the Data Catalog where the partition to be deleted resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database in which the table in question resides.
     */
    DatabaseName: NameString;
    /**
     * The name of the table that contains the partition to be deleted.
     */
    TableName: NameString;
    /**
     * The values that define the partition.
     */
    PartitionValues: ValueStringList;
  }
  export interface DeletePartitionResponse {
  }
  export interface DeleteRegistryInput {
    /**
     * This is a wrapper structure that may contain the registry name and Amazon Resource Name (ARN).
     */
    RegistryId: RegistryId;
  }
  export interface DeleteRegistryResponse {
    /**
     * The name of the registry being deleted.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource Name (ARN) of the registry being deleted.
     */
    RegistryArn?: GlueResourceArn;
    /**
     * The status of the registry. A successful operation will return the Deleting status.
     */
    Status?: RegistryStatus;
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * The hash value returned when this policy was set.
     */
    PolicyHashCondition?: HashString;
    /**
     * The ARN of the Glue resource for the resource policy to be deleted.
     */
    ResourceArn?: GlueResourceArn;
  }
  export interface DeleteResourcePolicyResponse {
  }
  export interface DeleteSchemaInput {
    /**
     * This is a wrapper structure that may contain the schema name and Amazon Resource Name (ARN).
     */
    SchemaId: SchemaId;
  }
  export interface DeleteSchemaResponse {
    /**
     * The Amazon Resource Name (ARN) of the schema being deleted.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * The name of the schema being deleted.
     */
    SchemaName?: SchemaRegistryNameString;
    /**
     * The status of the schema.
     */
    Status?: SchemaStatus;
  }
  export interface DeleteSchemaVersionsInput {
    /**
     * This is a wrapper structure that may contain the schema name and Amazon Resource Name (ARN).
     */
    SchemaId: SchemaId;
    /**
     * A version range may be supplied which may be of the format:   a single version number, 5   a range, 5-8 : deletes versions 5, 6, 7, 8  
     */
    Versions: VersionsString;
  }
  export interface DeleteSchemaVersionsResponse {
    /**
     * A list of SchemaVersionErrorItem objects, each containing an error and schema version.
     */
    SchemaVersionErrors?: SchemaVersionErrorList;
  }
  export interface DeleteSecurityConfigurationRequest {
    /**
     * The name of the security configuration to delete.
     */
    Name: NameString;
  }
  export interface DeleteSecurityConfigurationResponse {
  }
  export interface DeleteSessionRequest {
    /**
     * The ID of the session to be deleted.
     */
    Id: NameString;
    /**
     * The name of the origin of the delete session request.
     */
    RequestOrigin?: OrchestrationNameString;
  }
  export interface DeleteSessionResponse {
    /**
     * Returns the ID of the deleted session.
     */
    Id?: NameString;
  }
  export interface DeleteTableRequest {
    /**
     * The ID of the Data Catalog where the table resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database in which the table resides. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * The name of the table to be deleted. For Hive compatibility, this name is entirely lowercase.
     */
    Name: NameString;
    /**
     * The transaction ID at which to delete the table contents.
     */
    TransactionId?: TransactionIdString;
  }
  export interface DeleteTableResponse {
  }
  export interface DeleteTableVersionRequest {
    /**
     * The ID of the Data Catalog where the tables reside. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database in the catalog in which the table resides. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * The name of the table. For Hive compatibility, this name is entirely lowercase.
     */
    TableName: NameString;
    /**
     * The ID of the table version to be deleted. A VersionID is a string representation of an integer. Each version is incremented by 1.
     */
    VersionId: VersionString;
  }
  export interface DeleteTableVersionResponse {
  }
  export interface DeleteTriggerRequest {
    /**
     * The name of the trigger to delete.
     */
    Name: NameString;
  }
  export interface DeleteTriggerResponse {
    /**
     * The name of the trigger that was deleted.
     */
    Name?: NameString;
  }
  export interface DeleteUserDefinedFunctionRequest {
    /**
     * The ID of the Data Catalog where the function to be deleted is located. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the function is located.
     */
    DatabaseName: NameString;
    /**
     * The name of the function definition to be deleted.
     */
    FunctionName: NameString;
  }
  export interface DeleteUserDefinedFunctionResponse {
  }
  export interface DeleteWorkflowRequest {
    /**
     * Name of the workflow to be deleted.
     */
    Name: NameString;
  }
  export interface DeleteWorkflowResponse {
    /**
     * Name of the workflow specified in input.
     */
    Name?: NameString;
  }
  export interface DeltaTarget {
    /**
     * A list of the Amazon S3 paths to the Delta tables.
     */
    DeltaTables?: PathList;
    /**
     * The name of the connection to use to connect to the Delta table target.
     */
    ConnectionName?: ConnectionName;
    /**
     * Specifies whether to write the manifest files to the Delta table path.
     */
    WriteManifest?: NullableBoolean;
    /**
     * Specifies whether the crawler will create native tables, to allow integration with query engines that support querying of the Delta transaction log directly.
     */
    CreateNativeDeltaTable?: NullableBoolean;
  }
  export type DeltaTargetCompressionType = "uncompressed"|"snappy"|string;
  export type DeltaTargetList = DeltaTarget[];
  export type DescriptionString = string;
  export type DescriptionStringRemovable = string;
  export interface DevEndpoint {
    /**
     * The name of the DevEndpoint.
     */
    EndpointName?: GenericString;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used in this DevEndpoint.
     */
    RoleArn?: RoleArn;
    /**
     * A list of security group identifiers used in this DevEndpoint.
     */
    SecurityGroupIds?: StringList;
    /**
     * The subnet ID for this DevEndpoint.
     */
    SubnetId?: GenericString;
    /**
     * The YARN endpoint address used by this DevEndpoint.
     */
    YarnEndpointAddress?: GenericString;
    /**
     * A private IP address to access the DevEndpoint within a VPC if the DevEndpoint is created within one. The PrivateAddress field is present only when you create the DevEndpoint within your VPC.
     */
    PrivateAddress?: GenericString;
    /**
     * The Apache Zeppelin port for the remote Apache Spark interpreter.
     */
    ZeppelinRemoteSparkInterpreterPort?: IntegerValue;
    /**
     * The public IP address used by this DevEndpoint. The PublicAddress field is present only when you create a non-virtual private cloud (VPC) DevEndpoint.
     */
    PublicAddress?: GenericString;
    /**
     * The current status of this DevEndpoint.
     */
    Status?: GenericString;
    /**
     * The type of predefined worker that is allocated to the development endpoint. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.   Known issue: when a development endpoint is created with the G.2X WorkerType configuration, the Spark drivers for the development endpoint will run on 4 vCPU, 16 GB of memory, and a 64 GB disk. 
     */
    WorkerType?: WorkerType;
    /**
     * Glue version determines the versions of Apache Spark and Python that Glue supports. The Python version indicates the version supported for running your ETL scripts on development endpoints.  For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Development endpoints that are created without specifying a Glue version default to Glue 0.9. You can specify a version of Python support for development endpoints by using the Arguments parameter in the CreateDevEndpoint or UpdateDevEndpoint APIs. If no arguments are provided, the version defaults to Python 2.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of workers of a defined workerType that are allocated to the development endpoint. The maximum number of workers you can define are 299 for G.1X, and 149 for G.2X. 
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The number of Glue Data Processing Units (DPUs) allocated to this DevEndpoint.
     */
    NumberOfNodes?: IntegerValue;
    /**
     * The Amazon Web Services Availability Zone where this DevEndpoint is located.
     */
    AvailabilityZone?: GenericString;
    /**
     * The ID of the virtual private cloud (VPC) used by this DevEndpoint.
     */
    VpcId?: GenericString;
    /**
     * The paths to one or more Python libraries in an Amazon S3 bucket that should be loaded in your DevEndpoint. Multiple values must be complete paths separated by a comma.  You can only use pure Python libraries with a DevEndpoint. Libraries that rely on C extensions, such as the pandas Python data analysis library, are not currently supported. 
     */
    ExtraPythonLibsS3Path?: GenericString;
    /**
     * The path to one or more Java .jar files in an S3 bucket that should be loaded in your DevEndpoint.  You can only use pure Java/Scala libraries with a DevEndpoint. 
     */
    ExtraJarsS3Path?: GenericString;
    /**
     * The reason for a current failure in this DevEndpoint.
     */
    FailureReason?: GenericString;
    /**
     * The status of the last update.
     */
    LastUpdateStatus?: GenericString;
    /**
     * The point in time at which this DevEndpoint was created.
     */
    CreatedTimestamp?: TimestampValue;
    /**
     * The point in time at which this DevEndpoint was last modified.
     */
    LastModifiedTimestamp?: TimestampValue;
    /**
     * The public key to be used by this DevEndpoint for authentication. This attribute is provided for backward compatibility because the recommended attribute to use is public keys.
     */
    PublicKey?: GenericString;
    /**
     * A list of public keys to be used by the DevEndpoints for authentication. Using this attribute is preferred over a single public key because the public keys allow you to have a different private key per client.  If you previously created an endpoint with a public key, you must remove that key to be able to set a list of public keys. Call the UpdateDevEndpoint API operation with the public key content in the deletePublicKeys attribute, and the list of new keys in the addPublicKeys attribute. 
     */
    PublicKeys?: PublicKeysList;
    /**
     * The name of the SecurityConfiguration structure to be used with this DevEndpoint.
     */
    SecurityConfiguration?: NameString;
    /**
     * A map of arguments used to configure the DevEndpoint. Valid arguments are:    "--enable-glue-datacatalog": ""    You can specify a version of Python support for development endpoints by using the Arguments parameter in the CreateDevEndpoint or UpdateDevEndpoint APIs. If no arguments are provided, the version defaults to Python 2.
     */
    Arguments?: MapValue;
  }
  export interface DevEndpointCustomLibraries {
    /**
     * The paths to one or more Python libraries in an Amazon Simple Storage Service (Amazon S3) bucket that should be loaded in your DevEndpoint. Multiple values must be complete paths separated by a comma.  You can only use pure Python libraries with a DevEndpoint. Libraries that rely on C extensions, such as the pandas Python data analysis library, are not currently supported. 
     */
    ExtraPythonLibsS3Path?: GenericString;
    /**
     * The path to one or more Java .jar files in an S3 bucket that should be loaded in your DevEndpoint.  You can only use pure Java/Scala libraries with a DevEndpoint. 
     */
    ExtraJarsS3Path?: GenericString;
  }
  export type DevEndpointList = DevEndpoint[];
  export type DevEndpointNameList = NameString[];
  export type DevEndpointNames = GenericString[];
  export interface DirectJDBCSource {
    /**
     * The name of the JDBC source connection.
     */
    Name: NodeName;
    /**
     * The database of the JDBC source connection.
     */
    Database: EnclosedInStringProperty;
    /**
     * The table of the JDBC source connection.
     */
    Table: EnclosedInStringProperty;
    /**
     * The connection name of the JDBC source.
     */
    ConnectionName: EnclosedInStringProperty;
    /**
     * The connection type of the JDBC source.
     */
    ConnectionType: JDBCConnectionType;
    /**
     * The temp directory of the JDBC Redshift source.
     */
    RedshiftTmpDir?: EnclosedInStringProperty;
  }
  export interface DirectKafkaSource {
    /**
     * The name of the data store.
     */
    Name: NodeName;
    /**
     * Specifies the streaming options.
     */
    StreamingOptions?: KafkaStreamingSourceOptions;
    /**
     * The amount of time to spend processing each micro batch.
     */
    WindowSize?: BoxedPositiveInt;
    /**
     * Whether to automatically determine the schema from the incoming data.
     */
    DetectSchema?: BoxedBoolean;
    /**
     * Specifies options related to data preview for viewing a sample of your data.
     */
    DataPreviewOptions?: StreamingDataPreviewOptions;
  }
  export interface DirectKinesisSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The amount of time to spend processing each micro batch.
     */
    WindowSize?: BoxedPositiveInt;
    /**
     * Whether to automatically determine the schema from the incoming data.
     */
    DetectSchema?: BoxedBoolean;
    /**
     * Additional options for the Kinesis streaming data source.
     */
    StreamingOptions?: KinesisStreamingSourceOptions;
    /**
     * Additional options for data preview.
     */
    DataPreviewOptions?: StreamingDataPreviewOptions;
  }
  export interface DirectSchemaChangePolicy {
    /**
     * Whether to use the specified update behavior when the crawler finds a changed schema.
     */
    EnableUpdateCatalog?: BoxedBoolean;
    /**
     * The update behavior when the crawler finds a changed schema.
     */
    UpdateBehavior?: UpdateCatalogBehavior;
    /**
     * Specifies the table in the database that the schema change policy applies to.
     */
    Table?: EnclosedInStringProperty;
    /**
     * Specifies the database that the schema change policy applies to.
     */
    Database?: EnclosedInStringProperty;
  }
  export type Double = number;
  export interface DoubleColumnStatisticsData {
    /**
     * The lowest value in the column.
     */
    MinimumValue?: Double;
    /**
     * The highest value in the column.
     */
    MaximumValue?: Double;
    /**
     * The number of null values in the column.
     */
    NumberOfNulls: NonNegativeLong;
    /**
     * The number of distinct values in a column.
     */
    NumberOfDistinctValues: NonNegativeLong;
  }
  export type DoubleValue = number;
  export interface DropDuplicates {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * The name of the columns to be merged or removed if repeating.
     */
    Columns?: LimitedPathList;
  }
  export interface DropFields {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * A JSON path to a variable in the data structure.
     */
    Paths: GlueStudioPathList;
  }
  export interface DropNullFields {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * A structure that represents whether certain values are recognized as null values for removal.
     */
    NullCheckBoxList?: NullCheckBoxList;
    /**
     * A structure that specifies a list of NullValueField structures that represent a custom null value such as zero or other value being used as a null placeholder unique to the dataset. The DropNullFields transform removes custom null values only if both the value of the null placeholder and the datatype match the data.
     */
    NullTextList?: NullValueFields;
  }
  export interface DynamicTransform {
    /**
     * Specifies the name of the dynamic transform.
     */
    Name: EnclosedInStringProperty;
    /**
     * Specifies the name of the dynamic transform as it appears in the Glue Studio visual editor.
     */
    TransformName: EnclosedInStringProperty;
    /**
     * Specifies the inputs for the dynamic transform that are required.
     */
    Inputs: OneInput;
    /**
     * Specifies the parameters of the dynamic transform.
     */
    Parameters?: TransformConfigParameterList;
    /**
     * Specifies the name of the function of the dynamic transform.
     */
    FunctionName: EnclosedInStringProperty;
    /**
     * Specifies the path of the dynamic transform source and config files.
     */
    Path: EnclosedInStringProperty;
    /**
     * This field is not used and will be deprecated in future release.
     */
    Version?: EnclosedInStringProperty;
    /**
     * Specifies the data schema for the dynamic transform.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface DynamoDBCatalogSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
  }
  export interface DynamoDBTarget {
    /**
     * The name of the DynamoDB table to crawl.
     */
    Path?: Path;
    /**
     * Indicates whether to scan all the records, or to sample rows from the table. Scanning all the records can take a long time when the table is not a high throughput table. A value of true means to scan all records, while a value of false means to sample the records. If no value is specified, the value defaults to true.
     */
    scanAll?: NullableBoolean;
    /**
     * The percentage of the configured read capacity units to use by the Glue crawler. Read capacity units is a term defined by DynamoDB, and is a numeric value that acts as rate limiter for the number of reads that can be performed on that table per second. The valid values are null or a value between 0.1 to 1.5. A null value is used when user does not provide a value, and defaults to 0.5 of the configured Read Capacity Unit (for provisioned tables), or 0.25 of the max configured Read Capacity Unit (for tables using on-demand mode).
     */
    scanRate?: NullableDouble;
  }
  export type DynamoDBTargetList = DynamoDBTarget[];
  export interface Edge {
    /**
     * The unique of the node within the workflow where the edge starts.
     */
    SourceId?: NameString;
    /**
     * The unique of the node within the workflow where the edge ends.
     */
    DestinationId?: NameString;
  }
  export type EdgeList = Edge[];
  export type EnableAdditionalMetadata = JdbcMetadataEntry[];
  export type EnableHybridValues = "TRUE"|"FALSE"|string;
  export type EnclosedInStringProperties = EnclosedInStringProperty[];
  export type EnclosedInStringPropertiesMinOne = EnclosedInStringProperty[];
  export type EnclosedInStringProperty = string;
  export type EnclosedInStringPropertyWithQuote = string;
  export interface EncryptionAtRest {
    /**
     * The encryption-at-rest mode for encrypting Data Catalog data.
     */
    CatalogEncryptionMode: CatalogEncryptionMode;
    /**
     * The ID of the KMS key to use for encryption at rest.
     */
    SseAwsKmsKeyId?: NameString;
  }
  export interface EncryptionConfiguration {
    /**
     * The encryption configuration for Amazon Simple Storage Service (Amazon S3) data.
     */
    S3Encryption?: S3EncryptionList;
    /**
     * The encryption configuration for Amazon CloudWatch.
     */
    CloudWatchEncryption?: CloudWatchEncryption;
    /**
     * The encryption configuration for job bookmarks.
     */
    JobBookmarksEncryption?: JobBookmarksEncryption;
  }
  export type ErrorByName = {[key: string]: ErrorDetail};
  export type ErrorCodeString = string;
  export interface ErrorDetail {
    /**
     * The code associated with this error.
     */
    ErrorCode?: NameString;
    /**
     * A message describing the error.
     */
    ErrorMessage?: DescriptionString;
  }
  export interface ErrorDetails {
    /**
     * The error code for an error.
     */
    ErrorCode?: ErrorCodeString;
    /**
     * The error message for an error.
     */
    ErrorMessage?: ErrorMessageString;
  }
  export type ErrorMessageString = string;
  export type ErrorString = string;
  export interface EvaluateDataQuality {
    /**
     * The name of the data quality evaluation.
     */
    Name: NodeName;
    /**
     * The inputs of your data quality evaluation.
     */
    Inputs: OneInput;
    /**
     * The ruleset for your data quality evaluation.
     */
    Ruleset: DQDLString;
    /**
     * The output of your data quality evaluation.
     */
    Output?: DQTransformOutput;
    /**
     * Options to configure how your results are published.
     */
    PublishingOptions?: DQResultsPublishingOptions;
    /**
     * Options to configure how your job will stop if your data quality evaluation fails.
     */
    StopJobOnFailureOptions?: DQStopJobOnFailureOptions;
  }
  export interface EvaluateDataQualityMultiFrame {
    /**
     * The name of the data quality evaluation.
     */
    Name: NodeName;
    /**
     * The inputs of your data quality evaluation. The first input in this list is the primary data source.
     */
    Inputs: ManyInputs;
    /**
     * The aliases of all data sources except primary.
     */
    AdditionalDataSources?: DQDLAliases;
    /**
     * The ruleset for your data quality evaluation.
     */
    Ruleset: DQDLString;
    /**
     * Options to configure how your results are published.
     */
    PublishingOptions?: DQResultsPublishingOptions;
    /**
     * Options to configure runtime behavior of the transform.
     */
    AdditionalOptions?: DQAdditionalOptions;
    /**
     * Options to configure how your job will stop if your data quality evaluation fails.
     */
    StopJobOnFailureOptions?: DQStopJobOnFailureOptions;
  }
  export type EvaluatedMetricsMap = {[key: string]: NullableDouble};
  export interface EvaluationMetrics {
    /**
     * The type of machine learning transform.
     */
    TransformType: TransformType;
    /**
     * The evaluation metrics for the find matches algorithm.
     */
    FindMatchesMetrics?: FindMatchesMetrics;
  }
  export interface EventBatchingCondition {
    /**
     * Number of events that must be received from Amazon EventBridge before EventBridge event trigger fires.
     */
    BatchSize: BatchSize;
    /**
     * Window of time in seconds after which EventBridge event trigger fires. Window starts when first event is received.
     */
    BatchWindow?: BatchWindow;
  }
  export type EventQueueArn = string;
  export type ExecutionClass = "FLEX"|"STANDARD"|string;
  export interface ExecutionProperty {
    /**
     * The maximum number of concurrent runs allowed for the job. The default is 1. An error is returned when this threshold is reached. The maximum value you can specify is controlled by a service limit.
     */
    MaxConcurrentRuns?: MaxConcurrentRuns;
  }
  export type ExecutionTime = number;
  export type ExistCondition = "MUST_EXIST"|"NOT_EXIST"|"NONE"|string;
  export interface ExportLabelsTaskRunProperties {
    /**
     * The Amazon Simple Storage Service (Amazon S3) path where you will export the labels.
     */
    OutputS3Path?: UriString;
  }
  export type ExtendedString = string;
  export interface FederatedDatabase {
    /**
     * A unique identifier for the federated database.
     */
    Identifier?: FederationIdentifier;
    /**
     * The name of the connection to the external metastore.
     */
    ConnectionName?: NameString;
  }
  export interface FederatedTable {
    /**
     * A unique identifier for the federated table.
     */
    Identifier?: FederationIdentifier;
    /**
     * A unique identifier for the federated database.
     */
    DatabaseIdentifier?: FederationIdentifier;
    /**
     * The name of the connection to the external metastore.
     */
    ConnectionName?: NameString;
  }
  export type FederationIdentifier = string;
  export type FieldName = "CRAWL_ID"|"STATE"|"START_TIME"|"END_TIME"|"DPU_HOUR"|string;
  export type FieldType = string;
  export interface FillMissingValues {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * A JSON path to a variable in the data structure for the dataset that is imputed.
     */
    ImputedPath: EnclosedInStringProperty;
    /**
     * A JSON path to a variable in the data structure for the dataset that is filled.
     */
    FilledPath?: EnclosedInStringProperty;
  }
  export interface Filter {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * The operator used to filter rows by comparing the key value to a specified value.
     */
    LogicalOperator: FilterLogicalOperator;
    /**
     * Specifies a filter expression.
     */
    Filters: FilterExpressions;
  }
  export interface FilterExpression {
    /**
     * The type of operation to perform in the expression.
     */
    Operation: FilterOperation;
    /**
     * Whether the expression is to be negated.
     */
    Negated?: BoxedBoolean;
    /**
     * A list of filter values.
     */
    Values: FilterValues;
  }
  export type FilterExpressions = FilterExpression[];
  export type FilterLogicalOperator = "AND"|"OR"|string;
  export type FilterOperation = "EQ"|"LT"|"GT"|"LTE"|"GTE"|"REGEX"|"ISNULL"|string;
  export type FilterOperator = "GT"|"GE"|"LT"|"LE"|"EQ"|"NE"|string;
  export type FilterString = string;
  export interface FilterValue {
    /**
     * The type of filter value.
     */
    Type: FilterValueType;
    /**
     * The value to be associated.
     */
    Value: EnclosedInStringProperties;
  }
  export type FilterValueType = "COLUMNEXTRACTED"|"CONSTANT"|string;
  export type FilterValues = FilterValue[];
  export interface FindMatchesMetrics {
    /**
     * The area under the precision/recall curve (AUPRC) is a single number measuring the overall quality of the transform, that is independent of the choice made for precision vs. recall. Higher values indicate that you have a more attractive precision vs. recall tradeoff. For more information, see Precision and recall in Wikipedia.
     */
    AreaUnderPRCurve?: GenericBoundedDouble;
    /**
     * The precision metric indicates when often your transform is correct when it predicts a match. Specifically, it measures how well the transform finds true positives from the total true positives possible. For more information, see Precision and recall in Wikipedia.
     */
    Precision?: GenericBoundedDouble;
    /**
     * The recall metric indicates that for an actual match, how often your transform predicts the match. Specifically, it measures how well the transform finds true positives from the total records in the source data. For more information, see Precision and recall in Wikipedia.
     */
    Recall?: GenericBoundedDouble;
    /**
     * The maximum F1 metric indicates the transform's accuracy between 0 and 1, where 1 is the best accuracy. For more information, see F1 score in Wikipedia.
     */
    F1?: GenericBoundedDouble;
    /**
     * The confusion matrix shows you what your transform is predicting accurately and what types of errors it is making. For more information, see Confusion matrix in Wikipedia.
     */
    ConfusionMatrix?: ConfusionMatrix;
    /**
     * A list of ColumnImportance structures containing column importance metrics, sorted in order of descending importance.
     */
    ColumnImportances?: ColumnImportanceList;
  }
  export interface FindMatchesParameters {
    /**
     * The name of a column that uniquely identifies rows in the source table. Used to help identify matching records.
     */
    PrimaryKeyColumnName?: ColumnNameString;
    /**
     * The value selected when tuning your transform for a balance between precision and recall. A value of 0.5 means no preference; a value of 1.0 means a bias purely for precision, and a value of 0.0 means a bias for recall. Because this is a tradeoff, choosing values close to 1.0 means very low recall, and choosing values close to 0.0 results in very low precision. The precision metric indicates how often your model is correct when it predicts a match.  The recall metric indicates that for an actual match, how often your model predicts the match.
     */
    PrecisionRecallTradeoff?: GenericBoundedDouble;
    /**
     * The value that is selected when tuning your transform for a balance between accuracy and cost. A value of 0.5 means that the system balances accuracy and cost concerns. A value of 1.0 means a bias purely for accuracy, which typically results in a higher cost, sometimes substantially higher. A value of 0.0 means a bias purely for cost, which results in a less accurate FindMatches transform, sometimes with unacceptable accuracy. Accuracy measures how well the transform finds true positives and true negatives. Increasing accuracy requires more machine resources and cost. But it also results in increased recall.  Cost measures how many compute resources, and thus money, are consumed to run the transform.
     */
    AccuracyCostTradeoff?: GenericBoundedDouble;
    /**
     * The value to switch on or off to force the output to match the provided labels from users. If the value is True, the find matches transform forces the output to match the provided labels. The results override the normal conflation results. If the value is False, the find matches transform does not ensure all the labels provided are respected, and the results rely on the trained model. Note that setting this value to true may increase the conflation execution time.
     */
    EnforceProvidedLabels?: NullableBoolean;
  }
  export interface FindMatchesTaskRunProperties {
    /**
     * The job ID for the Find Matches task run.
     */
    JobId?: HashString;
    /**
     * The name assigned to the job for the Find Matches task run.
     */
    JobName?: NameString;
    /**
     * The job run ID for the Find Matches task run.
     */
    JobRunId?: HashString;
  }
  export type FormatString = string;
  export type Generic512CharString = string;
  export type GenericBoundedDouble = number;
  export type GenericLimitedString = string;
  export type GenericMap = {[key: string]: GenericString};
  export type GenericString = string;
  export interface GetBlueprintRequest {
    /**
     * The name of the blueprint.
     */
    Name: NameString;
    /**
     * Specifies whether or not to include the blueprint in the response.
     */
    IncludeBlueprint?: NullableBoolean;
    /**
     * Specifies whether or not to include the parameter specification.
     */
    IncludeParameterSpec?: NullableBoolean;
  }
  export interface GetBlueprintResponse {
    /**
     * Returns a Blueprint object.
     */
    Blueprint?: Blueprint;
  }
  export interface GetBlueprintRunRequest {
    /**
     * The name of the blueprint.
     */
    BlueprintName: OrchestrationNameString;
    /**
     * The run ID for the blueprint run you want to retrieve.
     */
    RunId: IdString;
  }
  export interface GetBlueprintRunResponse {
    /**
     * Returns a BlueprintRun object.
     */
    BlueprintRun?: BlueprintRun;
  }
  export interface GetBlueprintRunsRequest {
    /**
     * The name of the blueprint.
     */
    BlueprintName: NameString;
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: GenericString;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
  }
  export interface GetBlueprintRunsResponse {
    /**
     * Returns a list of BlueprintRun objects.
     */
    BlueprintRuns?: BlueprintRuns;
    /**
     * A continuation token, if not all blueprint runs have been returned.
     */
    NextToken?: GenericString;
  }
  export interface GetCatalogImportStatusRequest {
    /**
     * The ID of the catalog to migrate. Currently, this should be the Amazon Web Services account ID.
     */
    CatalogId?: CatalogIdString;
  }
  export interface GetCatalogImportStatusResponse {
    /**
     * The status of the specified catalog migration.
     */
    ImportStatus?: CatalogImportStatus;
  }
  export interface GetClassifierRequest {
    /**
     * Name of the classifier to retrieve.
     */
    Name: NameString;
  }
  export interface GetClassifierResponse {
    /**
     * The requested classifier.
     */
    Classifier?: Classifier;
  }
  export interface GetClassifiersRequest {
    /**
     * The size of the list to return (optional).
     */
    MaxResults?: PageSize;
    /**
     * An optional continuation token.
     */
    NextToken?: Token;
  }
  export interface GetClassifiersResponse {
    /**
     * The requested list of classifier objects.
     */
    Classifiers?: ClassifierList;
    /**
     * A continuation token.
     */
    NextToken?: Token;
  }
  export type GetColumnNamesList = NameString[];
  export interface GetColumnStatisticsForPartitionRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the partitions' table.
     */
    TableName: NameString;
    /**
     * A list of partition values identifying the partition.
     */
    PartitionValues: ValueStringList;
    /**
     * A list of the column names.
     */
    ColumnNames: GetColumnNamesList;
  }
  export interface GetColumnStatisticsForPartitionResponse {
    /**
     * List of ColumnStatistics that failed to be retrieved.
     */
    ColumnStatisticsList?: ColumnStatisticsList;
    /**
     * Error occurred during retrieving column statistics data.
     */
    Errors?: ColumnErrors;
  }
  export interface GetColumnStatisticsForTableRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the partitions' table.
     */
    TableName: NameString;
    /**
     * A list of the column names.
     */
    ColumnNames: GetColumnNamesList;
  }
  export interface GetColumnStatisticsForTableResponse {
    /**
     * List of ColumnStatistics.
     */
    ColumnStatisticsList?: ColumnStatisticsList;
    /**
     * List of ColumnStatistics that failed to be retrieved.
     */
    Errors?: ColumnErrors;
  }
  export interface GetConnectionRequest {
    /**
     * The ID of the Data Catalog in which the connection resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the connection definition to retrieve.
     */
    Name: NameString;
    /**
     * Allows you to retrieve the connection metadata without returning the password. For instance, the Glue console uses this flag to retrieve the connection, and does not display the password. Set this parameter when the caller might not have permission to use the KMS key to decrypt the password, but it does have permission to access the rest of the connection properties.
     */
    HidePassword?: Boolean;
  }
  export interface GetConnectionResponse {
    /**
     * The requested connection definition.
     */
    Connection?: Connection;
  }
  export interface GetConnectionsFilter {
    /**
     * A criteria string that must match the criteria recorded in the connection definition for that connection definition to be returned.
     */
    MatchCriteria?: MatchCriteria;
    /**
     * The type of connections to return. Currently, SFTP is not supported.
     */
    ConnectionType?: ConnectionType;
  }
  export interface GetConnectionsRequest {
    /**
     * The ID of the Data Catalog in which the connections reside. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * A filter that controls which connections are returned.
     */
    Filter?: GetConnectionsFilter;
    /**
     * Allows you to retrieve the connection metadata without returning the password. For instance, the Glue console uses this flag to retrieve the connection, and does not display the password. Set this parameter when the caller might not have permission to use the KMS key to decrypt the password, but it does have permission to access the rest of the connection properties.
     */
    HidePassword?: Boolean;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: Token;
    /**
     * The maximum number of connections to return in one response.
     */
    MaxResults?: PageSize;
  }
  export interface GetConnectionsResponse {
    /**
     * A list of requested connection definitions.
     */
    ConnectionList?: ConnectionList;
    /**
     * A continuation token, if the list of connections returned does not include the last of the filtered connections.
     */
    NextToken?: Token;
  }
  export interface GetCrawlerMetricsRequest {
    /**
     * A list of the names of crawlers about which to retrieve metrics.
     */
    CrawlerNameList?: CrawlerNameList;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: Token;
  }
  export interface GetCrawlerMetricsResponse {
    /**
     * A list of metrics for the specified crawler.
     */
    CrawlerMetricsList?: CrawlerMetricsList;
    /**
     * A continuation token, if the returned list does not contain the last metric available.
     */
    NextToken?: Token;
  }
  export interface GetCrawlerRequest {
    /**
     * The name of the crawler to retrieve metadata for.
     */
    Name: NameString;
  }
  export interface GetCrawlerResponse {
    /**
     * The metadata for the specified crawler.
     */
    Crawler?: Crawler;
  }
  export interface GetCrawlersRequest {
    /**
     * The number of crawlers to return on each call.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: Token;
  }
  export interface GetCrawlersResponse {
    /**
     * A list of crawler metadata.
     */
    Crawlers?: CrawlerList;
    /**
     * A continuation token, if the returned list has not reached the end of those defined in this customer account.
     */
    NextToken?: Token;
  }
  export interface GetCustomEntityTypeRequest {
    /**
     * The name of the custom pattern that you want to retrieve.
     */
    Name: NameString;
  }
  export interface GetCustomEntityTypeResponse {
    /**
     * The name of the custom pattern that you retrieved.
     */
    Name?: NameString;
    /**
     * A regular expression string that is used for detecting sensitive data in a custom pattern.
     */
    RegexString?: NameString;
    /**
     * A list of context words if specified when you created the custom pattern. If none of these context words are found within the vicinity of the regular expression the data will not be detected as sensitive data.
     */
    ContextWords?: ContextWords;
  }
  export interface GetDataCatalogEncryptionSettingsRequest {
    /**
     * The ID of the Data Catalog to retrieve the security configuration for. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
  }
  export interface GetDataCatalogEncryptionSettingsResponse {
    /**
     * The requested security configuration.
     */
    DataCatalogEncryptionSettings?: DataCatalogEncryptionSettings;
  }
  export interface GetDataQualityResultRequest {
    /**
     * A unique result ID for the data quality result.
     */
    ResultId: HashString;
  }
  export interface GetDataQualityResultResponse {
    /**
     * A unique result ID for the data quality result.
     */
    ResultId?: HashString;
    /**
     * An aggregate data quality score. Represents the ratio of rules that passed to the total number of rules.
     */
    Score?: GenericBoundedDouble;
    /**
     * The table associated with the data quality result, if any.
     */
    DataSource?: DataSource;
    /**
     * The name of the ruleset associated with the data quality result.
     */
    RulesetName?: NameString;
    /**
     * In the context of a job in Glue Studio, each node in the canvas is typically assigned some sort of name and data quality nodes will have names. In the case of multiple nodes, the evaluationContext can differentiate the nodes.
     */
    EvaluationContext?: GenericString;
    /**
     * The date and time when the run for this data quality result started.
     */
    StartedOn?: Timestamp;
    /**
     * The date and time when the run for this data quality result was completed.
     */
    CompletedOn?: Timestamp;
    /**
     * The job name associated with the data quality result, if any.
     */
    JobName?: NameString;
    /**
     * The job run ID associated with the data quality result, if any.
     */
    JobRunId?: HashString;
    /**
     * The unique run ID associated with the ruleset evaluation.
     */
    RulesetEvaluationRunId?: HashString;
    /**
     * A list of DataQualityRuleResult objects representing the results for each rule. 
     */
    RuleResults?: DataQualityRuleResults;
  }
  export interface GetDataQualityRuleRecommendationRunRequest {
    /**
     * The unique run identifier associated with this run.
     */
    RunId: HashString;
  }
  export interface GetDataQualityRuleRecommendationRunResponse {
    /**
     * The unique run identifier associated with this run.
     */
    RunId?: HashString;
    /**
     * The data source (an Glue table) associated with this run.
     */
    DataSource?: DataSource;
    /**
     * An IAM role supplied to encrypt the results of the run.
     */
    Role?: RoleString;
    /**
     * The number of G.1X workers to be used in the run. The default is 5.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The timeout for a run in minutes. This is the maximum time that a run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * The status for this run.
     */
    Status?: TaskStatusType;
    /**
     * The error strings that are associated with the run.
     */
    ErrorString?: GenericString;
    /**
     * The date and time when this run started.
     */
    StartedOn?: Timestamp;
    /**
     * A timestamp. The last point in time when this data quality rule recommendation run was modified.
     */
    LastModifiedOn?: Timestamp;
    /**
     * The date and time when this run was completed.
     */
    CompletedOn?: Timestamp;
    /**
     * The amount of time (in seconds) that the run consumed resources.
     */
    ExecutionTime?: ExecutionTime;
    /**
     * When a start rule recommendation run completes, it creates a recommended ruleset (a set of rules). This member has those rules in Data Quality Definition Language (DQDL) format.
     */
    RecommendedRuleset?: DataQualityRulesetString;
    /**
     * The name of the ruleset that was created by the run.
     */
    CreatedRulesetName?: NameString;
  }
  export interface GetDataQualityRulesetEvaluationRunRequest {
    /**
     * The unique run identifier associated with this run.
     */
    RunId: HashString;
  }
  export interface GetDataQualityRulesetEvaluationRunResponse {
    /**
     * The unique run identifier associated with this run.
     */
    RunId?: HashString;
    /**
     * The data source (an Glue table) associated with this evaluation run.
     */
    DataSource?: DataSource;
    /**
     * An IAM role supplied to encrypt the results of the run.
     */
    Role?: RoleString;
    /**
     * The number of G.1X workers to be used in the run. The default is 5.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The timeout for a run in minutes. This is the maximum time that a run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * Additional run options you can specify for an evaluation run.
     */
    AdditionalRunOptions?: DataQualityEvaluationRunAdditionalRunOptions;
    /**
     * The status for this run.
     */
    Status?: TaskStatusType;
    /**
     * The error strings that are associated with the run.
     */
    ErrorString?: GenericString;
    /**
     * The date and time when this run started.
     */
    StartedOn?: Timestamp;
    /**
     * A timestamp. The last point in time when this data quality rule recommendation run was modified.
     */
    LastModifiedOn?: Timestamp;
    /**
     * The date and time when this run was completed.
     */
    CompletedOn?: Timestamp;
    /**
     * The amount of time (in seconds) that the run consumed resources.
     */
    ExecutionTime?: ExecutionTime;
    /**
     * A list of ruleset names for the run.
     */
    RulesetNames?: RulesetNames;
    /**
     * A list of result IDs for the data quality results for the run.
     */
    ResultIds?: DataQualityResultIdList;
    /**
     * A map of reference strings to additional data sources you can specify for an evaluation run.
     */
    AdditionalDataSources?: DataSourceMap;
  }
  export interface GetDataQualityRulesetRequest {
    /**
     * The name of the ruleset.
     */
    Name: NameString;
  }
  export interface GetDataQualityRulesetResponse {
    /**
     * The name of the ruleset.
     */
    Name?: NameString;
    /**
     * A description of the ruleset.
     */
    Description?: DescriptionString;
    /**
     * A Data Quality Definition Language (DQDL) ruleset. For more information, see the Glue developer guide.
     */
    Ruleset?: DataQualityRulesetString;
    /**
     * The name and database name of the target table.
     */
    TargetTable?: DataQualityTargetTable;
    /**
     * A timestamp. The time and date that this data quality ruleset was created.
     */
    CreatedOn?: Timestamp;
    /**
     * A timestamp. The last point in time when this data quality ruleset was modified.
     */
    LastModifiedOn?: Timestamp;
    /**
     * When a ruleset was created from a recommendation run, this run ID is generated to link the two together.
     */
    RecommendationRunId?: HashString;
  }
  export interface GetDatabaseRequest {
    /**
     * The ID of the Data Catalog in which the database resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the database to retrieve. For Hive compatibility, this should be all lowercase.
     */
    Name: NameString;
  }
  export interface GetDatabaseResponse {
    /**
     * The definition of the specified database in the Data Catalog.
     */
    Database?: Database;
  }
  export interface GetDatabasesRequest {
    /**
     * The ID of the Data Catalog from which to retrieve Databases. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: Token;
    /**
     * The maximum number of databases to return in one response.
     */
    MaxResults?: CatalogGetterPageSize;
    /**
     * Allows you to specify that you want to list the databases shared with your account. The allowable values are FEDERATED, FOREIGN or ALL.    If set to FEDERATED, will list the federated databases (referencing an external entity) shared with your account.   If set to FOREIGN, will list the databases shared with your account.    If set to ALL, will list the databases shared with your account, as well as the databases in yor local account.   
     */
    ResourceShareType?: ResourceShareType;
  }
  export interface GetDatabasesResponse {
    /**
     * A list of Database objects from the specified catalog.
     */
    DatabaseList: DatabaseList;
    /**
     * A continuation token for paginating the returned list of tokens, returned if the current segment of the list is not the last.
     */
    NextToken?: Token;
  }
  export interface GetDataflowGraphRequest {
    /**
     * The Python script to transform.
     */
    PythonScript?: PythonScript;
  }
  export interface GetDataflowGraphResponse {
    /**
     * A list of the nodes in the resulting DAG.
     */
    DagNodes?: DagNodes;
    /**
     * A list of the edges in the resulting DAG.
     */
    DagEdges?: DagEdges;
  }
  export interface GetDevEndpointRequest {
    /**
     * Name of the DevEndpoint to retrieve information for.
     */
    EndpointName: GenericString;
  }
  export interface GetDevEndpointResponse {
    /**
     * A DevEndpoint definition.
     */
    DevEndpoint?: DevEndpoint;
  }
  export interface GetDevEndpointsRequest {
    /**
     * The maximum size of information to return.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: GenericString;
  }
  export interface GetDevEndpointsResponse {
    /**
     * A list of DevEndpoint definitions.
     */
    DevEndpoints?: DevEndpointList;
    /**
     * A continuation token, if not all DevEndpoint definitions have yet been returned.
     */
    NextToken?: GenericString;
  }
  export interface GetJobBookmarkRequest {
    /**
     * The name of the job in question.
     */
    JobName: JobName;
    /**
     * The unique run identifier associated with this job run.
     */
    RunId?: RunId;
  }
  export interface GetJobBookmarkResponse {
    /**
     * A structure that defines a point that a job can resume processing.
     */
    JobBookmarkEntry?: JobBookmarkEntry;
  }
  export interface GetJobRequest {
    /**
     * The name of the job definition to retrieve.
     */
    JobName: NameString;
  }
  export interface GetJobResponse {
    /**
     * The requested job definition.
     */
    Job?: Job;
  }
  export interface GetJobRunRequest {
    /**
     * Name of the job definition being run.
     */
    JobName: NameString;
    /**
     * The ID of the job run.
     */
    RunId: IdString;
    /**
     * True if a list of predecessor runs should be returned.
     */
    PredecessorsIncluded?: BooleanValue;
  }
  export interface GetJobRunResponse {
    /**
     * The requested job-run metadata.
     */
    JobRun?: JobRun;
  }
  export interface GetJobRunsRequest {
    /**
     * The name of the job definition for which to retrieve all job runs.
     */
    JobName: NameString;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: GenericString;
    /**
     * The maximum size of the response.
     */
    MaxResults?: PageSize;
  }
  export interface GetJobRunsResponse {
    /**
     * A list of job-run metadata objects.
     */
    JobRuns?: JobRunList;
    /**
     * A continuation token, if not all requested job runs have been returned.
     */
    NextToken?: GenericString;
  }
  export interface GetJobsRequest {
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: GenericString;
    /**
     * The maximum size of the response.
     */
    MaxResults?: PageSize;
  }
  export interface GetJobsResponse {
    /**
     * A list of job definitions.
     */
    Jobs?: JobList;
    /**
     * A continuation token, if not all job definitions have yet been returned.
     */
    NextToken?: GenericString;
  }
  export interface GetMLTaskRunRequest {
    /**
     * The unique identifier of the machine learning transform.
     */
    TransformId: HashString;
    /**
     * The unique identifier of the task run.
     */
    TaskRunId: HashString;
  }
  export interface GetMLTaskRunResponse {
    /**
     * The unique identifier of the task run.
     */
    TransformId?: HashString;
    /**
     * The unique run identifier associated with this run.
     */
    TaskRunId?: HashString;
    /**
     * The status for this task run.
     */
    Status?: TaskStatusType;
    /**
     * The names of the log groups that are associated with the task run.
     */
    LogGroupName?: GenericString;
    /**
     * The list of properties that are associated with the task run.
     */
    Properties?: TaskRunProperties;
    /**
     * The error strings that are associated with the task run.
     */
    ErrorString?: GenericString;
    /**
     * The date and time when this task run started.
     */
    StartedOn?: Timestamp;
    /**
     * The date and time when this task run was last modified.
     */
    LastModifiedOn?: Timestamp;
    /**
     * The date and time when this task run was completed.
     */
    CompletedOn?: Timestamp;
    /**
     * The amount of time (in seconds) that the task run consumed resources.
     */
    ExecutionTime?: ExecutionTime;
  }
  export interface GetMLTaskRunsRequest {
    /**
     * The unique identifier of the machine learning transform.
     */
    TransformId: HashString;
    /**
     * A token for pagination of the results. The default is empty.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return. 
     */
    MaxResults?: PageSize;
    /**
     * The filter criteria, in the TaskRunFilterCriteria structure, for the task run.
     */
    Filter?: TaskRunFilterCriteria;
    /**
     * The sorting criteria, in the TaskRunSortCriteria structure, for the task run.
     */
    Sort?: TaskRunSortCriteria;
  }
  export interface GetMLTaskRunsResponse {
    /**
     * A list of task runs that are associated with the transform.
     */
    TaskRuns?: TaskRunList;
    /**
     * A pagination token, if more results are available.
     */
    NextToken?: PaginationToken;
  }
  export interface GetMLTransformRequest {
    /**
     * The unique identifier of the transform, generated at the time that the transform was created.
     */
    TransformId: HashString;
  }
  export interface GetMLTransformResponse {
    /**
     * The unique identifier of the transform, generated at the time that the transform was created.
     */
    TransformId?: HashString;
    /**
     * The unique name given to the transform when it was created.
     */
    Name?: NameString;
    /**
     * A description of the transform.
     */
    Description?: DescriptionString;
    /**
     * The last known status of the transform (to indicate whether it can be used or not). One of "NOT_READY", "READY", or "DELETING".
     */
    Status?: TransformStatusType;
    /**
     * The date and time when the transform was created.
     */
    CreatedOn?: Timestamp;
    /**
     * The date and time when the transform was last modified.
     */
    LastModifiedOn?: Timestamp;
    /**
     * A list of Glue table definitions used by the transform.
     */
    InputRecordTables?: GlueTables;
    /**
     * The configuration parameters that are specific to the algorithm used.
     */
    Parameters?: TransformParameters;
    /**
     * The latest evaluation metrics.
     */
    EvaluationMetrics?: EvaluationMetrics;
    /**
     * The number of labels available for this transform.
     */
    LabelCount?: LabelCount;
    /**
     * The Map&lt;Column, Type&gt; object that represents the schema that this transform accepts. Has an upper bound of 100 columns.
     */
    Schema?: TransformSchema;
    /**
     * The name or Amazon Resource Name (ARN) of the IAM role with the required permissions.
     */
    Role?: RoleString;
    /**
     * This value determines which version of Glue this machine learning transform is compatible with. Glue 1.0 is recommended for most customers. If the value is not set, the Glue compatibility defaults to Glue 0.9. For more information, see Glue Versions in the developer guide.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of Glue data processing units (DPUs) that are allocated to task runs for this transform. You can allocate from 2 to 100 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.  When the WorkerType field is set to a value other than Standard, the MaxCapacity field is set automatically and becomes read-only.
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when this task runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker provides 4 vCPU, 16 GB of memory and a 64GB disk, and 1 executor per worker.   For the G.2X worker type, each worker provides 8 vCPU, 32 GB of memory and a 128GB disk, and 1 executor per worker.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when this task runs.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The timeout for a task run for this transform in minutes. This is the maximum time that a task run for this transform can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * The maximum number of times to retry a task for this transform after a task run fails.
     */
    MaxRetries?: NullableInteger;
    /**
     * The encryption-at-rest settings of the transform that apply to accessing user data. Machine learning transforms can access user data encrypted in Amazon S3 using KMS.
     */
    TransformEncryption?: TransformEncryption;
  }
  export interface GetMLTransformsRequest {
    /**
     * A paginated token to offset the results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
    /**
     * The filter transformation criteria.
     */
    Filter?: TransformFilterCriteria;
    /**
     * The sorting criteria.
     */
    Sort?: TransformSortCriteria;
  }
  export interface GetMLTransformsResponse {
    /**
     * A list of machine learning transforms.
     */
    Transforms: TransformList;
    /**
     * A pagination token, if more results are available.
     */
    NextToken?: PaginationToken;
  }
  export interface GetMappingRequest {
    /**
     * Specifies the source table.
     */
    Source: CatalogEntry;
    /**
     * A list of target tables.
     */
    Sinks?: CatalogEntries;
    /**
     * Parameters for the mapping.
     */
    Location?: Location;
  }
  export interface GetMappingResponse {
    /**
     * A list of mappings to the specified targets.
     */
    Mapping: MappingList;
  }
  export interface GetPartitionIndexesRequest {
    /**
     * The catalog ID where the table resides.
     */
    CatalogId?: CatalogIdString;
    /**
     * Specifies the name of a database from which you want to retrieve partition indexes.
     */
    DatabaseName: NameString;
    /**
     * Specifies the name of a table for which you want to retrieve the partition indexes.
     */
    TableName: NameString;
    /**
     * A continuation token, included if this is a continuation call.
     */
    NextToken?: Token;
  }
  export interface GetPartitionIndexesResponse {
    /**
     * A list of index descriptors.
     */
    PartitionIndexDescriptorList?: PartitionIndexDescriptorList;
    /**
     * A continuation token, present if the current list segment is not the last.
     */
    NextToken?: Token;
  }
  export interface GetPartitionRequest {
    /**
     * The ID of the Data Catalog where the partition in question resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partition resides.
     */
    DatabaseName: NameString;
    /**
     * The name of the partition's table.
     */
    TableName: NameString;
    /**
     * The values that define the partition.
     */
    PartitionValues: ValueStringList;
  }
  export interface GetPartitionResponse {
    /**
     * The requested information, in the form of a Partition object.
     */
    Partition?: Partition;
  }
  export interface GetPartitionsRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the partitions' table.
     */
    TableName: NameString;
    /**
     * An expression that filters the partitions to be returned. The expression uses SQL syntax similar to the SQL WHERE filter clause. The SQL statement parser JSQLParser parses the expression.   Operators: The following are the operators that you can use in the Expression API call:  =  Checks whether the values of the two operands are equal; if yes, then the condition becomes true. Example: Assume 'variable a' holds 10 and 'variable b' holds 20.  (a = b) is not true.  &lt; &gt;  Checks whether the values of two operands are equal; if the values are not equal, then the condition becomes true. Example: (a &lt; &gt; b) is true.  &gt;  Checks whether the value of the left operand is greater than the value of the right operand; if yes, then the condition becomes true. Example: (a &gt; b) is not true.  &lt;  Checks whether the value of the left operand is less than the value of the right operand; if yes, then the condition becomes true. Example: (a &lt; b) is true.  &gt;=  Checks whether the value of the left operand is greater than or equal to the value of the right operand; if yes, then the condition becomes true. Example: (a &gt;= b) is not true.  &lt;=  Checks whether the value of the left operand is less than or equal to the value of the right operand; if yes, then the condition becomes true. Example: (a &lt;= b) is true.  AND, OR, IN, BETWEEN, LIKE, NOT, IS NULL  Logical operators.    Supported Partition Key Types: The following are the supported partition keys.    string     date     timestamp     int     bigint     long     tinyint     smallint     decimal    If an type is encountered that is not valid, an exception is thrown.  The following list shows the valid operators on each type. When you define a crawler, the partitionKey type is created as a STRING, to be compatible with the catalog partitions.   Sample API Call: 
     */
    Expression?: PredicateString;
    /**
     * A continuation token, if this is not the first call to retrieve these partitions.
     */
    NextToken?: Token;
    /**
     * The segment of the table's partitions to scan in this request.
     */
    Segment?: Segment;
    /**
     * The maximum number of partitions to return in a single response.
     */
    MaxResults?: PageSize;
    /**
     * When true, specifies not returning the partition column schema. Useful when you are interested only in other partition attributes such as partition values or location. This approach avoids the problem of a large response by not returning duplicate data.
     */
    ExcludeColumnSchema?: BooleanNullable;
    /**
     * The transaction ID at which to read the partition contents.
     */
    TransactionId?: TransactionIdString;
    /**
     * The time as of when to read the partition contents. If not set, the most recent transaction commit time will be used. Cannot be specified along with TransactionId.
     */
    QueryAsOfTime?: Timestamp;
  }
  export interface GetPartitionsResponse {
    /**
     * A list of requested partitions.
     */
    Partitions?: PartitionList;
    /**
     * A continuation token, if the returned list of partitions does not include the last one.
     */
    NextToken?: Token;
  }
  export interface GetPlanRequest {
    /**
     * The list of mappings from a source table to target tables.
     */
    Mapping: MappingList;
    /**
     * The source table.
     */
    Source: CatalogEntry;
    /**
     * The target tables.
     */
    Sinks?: CatalogEntries;
    /**
     * The parameters for the mapping.
     */
    Location?: Location;
    /**
     * The programming language of the code to perform the mapping.
     */
    Language?: Language;
    /**
     * A map to hold additional optional key-value parameters. Currently, these key-value pairs are supported:    inferSchema  —  Specifies whether to set inferSchema to true or false for the default script generated by an Glue job. For example, to set inferSchema to true, pass the following key value pair:  --additional-plan-options-map '{"inferSchema":"true"}'   
     */
    AdditionalPlanOptionsMap?: AdditionalPlanOptionsMap;
  }
  export interface GetPlanResponse {
    /**
     * A Python script to perform the mapping.
     */
    PythonScript?: PythonScript;
    /**
     * The Scala code to perform the mapping.
     */
    ScalaCode?: ScalaCode;
  }
  export interface GetRegistryInput {
    /**
     * This is a wrapper structure that may contain the registry name and Amazon Resource Name (ARN).
     */
    RegistryId: RegistryId;
  }
  export interface GetRegistryResponse {
    /**
     * The name of the registry.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource Name (ARN) of the registry.
     */
    RegistryArn?: GlueResourceArn;
    /**
     * A description of the registry.
     */
    Description?: DescriptionString;
    /**
     * The status of the registry.
     */
    Status?: RegistryStatus;
    /**
     * The date and time the registry was created.
     */
    CreatedTime?: CreatedTimestamp;
    /**
     * The date and time the registry was updated.
     */
    UpdatedTime?: UpdatedTimestamp;
  }
  export interface GetResourcePoliciesRequest {
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: Token;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
  }
  export interface GetResourcePoliciesResponse {
    /**
     * A list of the individual resource policies and the account-level resource policy.
     */
    GetResourcePoliciesResponseList?: GetResourcePoliciesResponseList;
    /**
     * A continuation token, if the returned list does not contain the last resource policy available.
     */
    NextToken?: Token;
  }
  export type GetResourcePoliciesResponseList = GluePolicy[];
  export interface GetResourcePolicyRequest {
    /**
     * The ARN of the Glue resource for which to retrieve the resource policy. If not supplied, the Data Catalog resource policy is returned. Use GetResourcePolicies to view all existing resource policies. For more information see Specifying Glue Resource ARNs. 
     */
    ResourceArn?: GlueResourceArn;
  }
  export interface GetResourcePolicyResponse {
    /**
     * Contains the requested policy document, in JSON format.
     */
    PolicyInJson?: PolicyJsonString;
    /**
     * Contains the hash value associated with this policy.
     */
    PolicyHash?: HashString;
    /**
     * The date and time at which the policy was created.
     */
    CreateTime?: Timestamp;
    /**
     * The date and time at which the policy was last updated.
     */
    UpdateTime?: Timestamp;
  }
  export interface GetSchemaByDefinitionInput {
    /**
     * This is a wrapper structure to contain schema identity fields. The structure contains:   SchemaId$SchemaArn: The Amazon Resource Name (ARN) of the schema. One of SchemaArn or SchemaName has to be provided.   SchemaId$SchemaName: The name of the schema. One of SchemaArn or SchemaName has to be provided.  
     */
    SchemaId: SchemaId;
    /**
     * The definition of the schema for which schema details are required.
     */
    SchemaDefinition: SchemaDefinitionString;
  }
  export interface GetSchemaByDefinitionResponse {
    /**
     * The schema ID of the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * The data format of the schema definition. Currently AVRO, JSON and PROTOBUF are supported.
     */
    DataFormat?: DataFormat;
    /**
     * The status of the schema version.
     */
    Status?: SchemaVersionStatus;
    /**
     * The date and time the schema was created.
     */
    CreatedTime?: CreatedTimestamp;
  }
  export interface GetSchemaInput {
    /**
     * This is a wrapper structure to contain schema identity fields. The structure contains:   SchemaId$SchemaArn: The Amazon Resource Name (ARN) of the schema. Either SchemaArn or SchemaName and RegistryName has to be provided.   SchemaId$SchemaName: The name of the schema. Either SchemaArn or SchemaName and RegistryName has to be provided.  
     */
    SchemaId: SchemaId;
  }
  export interface GetSchemaResponse {
    /**
     * The name of the registry.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource Name (ARN) of the registry.
     */
    RegistryArn?: GlueResourceArn;
    /**
     * The name of the schema.
     */
    SchemaName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * A description of schema if specified when created
     */
    Description?: DescriptionString;
    /**
     * The data format of the schema definition. Currently AVRO, JSON and PROTOBUF are supported.
     */
    DataFormat?: DataFormat;
    /**
     * The compatibility mode of the schema.
     */
    Compatibility?: Compatibility;
    /**
     * The version number of the checkpoint (the last time the compatibility mode was changed).
     */
    SchemaCheckpoint?: SchemaCheckpointNumber;
    /**
     * The latest version of the schema associated with the returned schema definition.
     */
    LatestSchemaVersion?: VersionLongNumber;
    /**
     * The next version of the schema associated with the returned schema definition.
     */
    NextSchemaVersion?: VersionLongNumber;
    /**
     * The status of the schema.
     */
    SchemaStatus?: SchemaStatus;
    /**
     * The date and time the schema was created.
     */
    CreatedTime?: CreatedTimestamp;
    /**
     * The date and time the schema was updated.
     */
    UpdatedTime?: UpdatedTimestamp;
  }
  export interface GetSchemaVersionInput {
    /**
     * This is a wrapper structure to contain schema identity fields. The structure contains:   SchemaId$SchemaArn: The Amazon Resource Name (ARN) of the schema. Either SchemaArn or SchemaName and RegistryName has to be provided.   SchemaId$SchemaName: The name of the schema. Either SchemaArn or SchemaName and RegistryName has to be provided.  
     */
    SchemaId?: SchemaId;
    /**
     * The SchemaVersionId of the schema version. This field is required for fetching by schema ID. Either this or the SchemaId wrapper has to be provided.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The version number of the schema.
     */
    SchemaVersionNumber?: SchemaVersionNumber;
  }
  export interface GetSchemaVersionResponse {
    /**
     * The SchemaVersionId of the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The schema definition for the schema ID.
     */
    SchemaDefinition?: SchemaDefinitionString;
    /**
     * The data format of the schema definition. Currently AVRO, JSON and PROTOBUF are supported.
     */
    DataFormat?: DataFormat;
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * The version number of the schema.
     */
    VersionNumber?: VersionLongNumber;
    /**
     * The status of the schema version. 
     */
    Status?: SchemaVersionStatus;
    /**
     * The date and time the schema version was created.
     */
    CreatedTime?: CreatedTimestamp;
  }
  export interface GetSchemaVersionsDiffInput {
    /**
     * This is a wrapper structure to contain schema identity fields. The structure contains:   SchemaId$SchemaArn: The Amazon Resource Name (ARN) of the schema. One of SchemaArn or SchemaName has to be provided.   SchemaId$SchemaName: The name of the schema. One of SchemaArn or SchemaName has to be provided.  
     */
    SchemaId: SchemaId;
    /**
     * The first of the two schema versions to be compared.
     */
    FirstSchemaVersionNumber: SchemaVersionNumber;
    /**
     * The second of the two schema versions to be compared.
     */
    SecondSchemaVersionNumber: SchemaVersionNumber;
    /**
     * Refers to SYNTAX_DIFF, which is the currently supported diff type.
     */
    SchemaDiffType: SchemaDiffType;
  }
  export interface GetSchemaVersionsDiffResponse {
    /**
     * The difference between schemas as a string in JsonPatch format.
     */
    Diff?: SchemaDefinitionDiff;
  }
  export interface GetSecurityConfigurationRequest {
    /**
     * The name of the security configuration to retrieve.
     */
    Name: NameString;
  }
  export interface GetSecurityConfigurationResponse {
    /**
     * The requested security configuration.
     */
    SecurityConfiguration?: SecurityConfiguration;
  }
  export interface GetSecurityConfigurationsRequest {
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: GenericString;
  }
  export interface GetSecurityConfigurationsResponse {
    /**
     * A list of security configurations.
     */
    SecurityConfigurations?: SecurityConfigurationList;
    /**
     * A continuation token, if there are more security configurations to return.
     */
    NextToken?: GenericString;
  }
  export interface GetSessionRequest {
    /**
     * The ID of the session. 
     */
    Id: NameString;
    /**
     * The origin of the request. 
     */
    RequestOrigin?: OrchestrationNameString;
  }
  export interface GetSessionResponse {
    /**
     * The session object is returned in the response.
     */
    Session?: Session;
  }
  export interface GetStatementRequest {
    /**
     * The Session ID of the statement.
     */
    SessionId: NameString;
    /**
     * The Id of the statement.
     */
    Id: IntegerValue;
    /**
     * The origin of the request.
     */
    RequestOrigin?: OrchestrationNameString;
  }
  export interface GetStatementResponse {
    /**
     * Returns the statement.
     */
    Statement?: Statement;
  }
  export interface GetTableRequest {
    /**
     * The ID of the Data Catalog where the table resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the database in the catalog in which the table resides. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * The name of the table for which to retrieve the definition. For Hive compatibility, this name is entirely lowercase.
     */
    Name: NameString;
    /**
     * The transaction ID at which to read the table contents. 
     */
    TransactionId?: TransactionIdString;
    /**
     * The time as of when to read the table contents. If not set, the most recent transaction commit time will be used. Cannot be specified along with TransactionId.
     */
    QueryAsOfTime?: Timestamp;
  }
  export interface GetTableResponse {
    /**
     * The Table object that defines the specified table.
     */
    Table?: Table;
  }
  export interface GetTableVersionRequest {
    /**
     * The ID of the Data Catalog where the tables reside. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database in the catalog in which the table resides. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * The name of the table. For Hive compatibility, this name is entirely lowercase.
     */
    TableName: NameString;
    /**
     * The ID value of the table version to be retrieved. A VersionID is a string representation of an integer. Each version is incremented by 1. 
     */
    VersionId?: VersionString;
  }
  export interface GetTableVersionResponse {
    /**
     * The requested table version.
     */
    TableVersion?: TableVersion;
  }
  export type GetTableVersionsList = TableVersion[];
  export interface GetTableVersionsRequest {
    /**
     * The ID of the Data Catalog where the tables reside. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database in the catalog in which the table resides. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * The name of the table. For Hive compatibility, this name is entirely lowercase.
     */
    TableName: NameString;
    /**
     * A continuation token, if this is not the first call.
     */
    NextToken?: Token;
    /**
     * The maximum number of table versions to return in one response.
     */
    MaxResults?: CatalogGetterPageSize;
  }
  export interface GetTableVersionsResponse {
    /**
     * A list of strings identifying available versions of the specified table.
     */
    TableVersions?: GetTableVersionsList;
    /**
     * A continuation token, if the list of available versions does not include the last one.
     */
    NextToken?: Token;
  }
  export interface GetTablesRequest {
    /**
     * The ID of the Data Catalog where the tables reside. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The database in the catalog whose tables to list. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * A regular expression pattern. If present, only those tables whose names match the pattern are returned.
     */
    Expression?: FilterString;
    /**
     * A continuation token, included if this is a continuation call.
     */
    NextToken?: Token;
    /**
     * The maximum number of tables to return in a single response.
     */
    MaxResults?: CatalogGetterPageSize;
    /**
     * The transaction ID at which to read the table contents.
     */
    TransactionId?: TransactionIdString;
    /**
     * The time as of when to read the table contents. If not set, the most recent transaction commit time will be used. Cannot be specified along with TransactionId.
     */
    QueryAsOfTime?: Timestamp;
  }
  export interface GetTablesResponse {
    /**
     * A list of the requested Table objects.
     */
    TableList?: TableList;
    /**
     * A continuation token, present if the current list segment is not the last.
     */
    NextToken?: Token;
  }
  export interface GetTagsRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource for which to retrieve tags.
     */
    ResourceArn: GlueResourceArn;
  }
  export interface GetTagsResponse {
    /**
     * The requested tags.
     */
    Tags?: TagsMap;
  }
  export interface GetTriggerRequest {
    /**
     * The name of the trigger to retrieve.
     */
    Name: NameString;
  }
  export interface GetTriggerResponse {
    /**
     * The requested trigger definition.
     */
    Trigger?: Trigger;
  }
  export interface GetTriggersRequest {
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: GenericString;
    /**
     * The name of the job to retrieve triggers for. The trigger that can start this job is returned, and if there is no such trigger, all triggers are returned.
     */
    DependentJobName?: NameString;
    /**
     * The maximum size of the response.
     */
    MaxResults?: PageSize;
  }
  export interface GetTriggersResponse {
    /**
     * A list of triggers for the specified job.
     */
    Triggers?: TriggerList;
    /**
     * A continuation token, if not all the requested triggers have yet been returned.
     */
    NextToken?: GenericString;
  }
  export interface GetUnfilteredPartitionMetadataRequest {
    /**
     * The catalog ID where the partition resides.
     */
    CatalogId: CatalogIdString;
    /**
     * (Required) Specifies the name of a database that contains the partition.
     */
    DatabaseName: NameString;
    /**
     * (Required) Specifies the name of a table that contains the partition.
     */
    TableName: NameString;
    /**
     * (Required) A list of partition key values.
     */
    PartitionValues: ValueStringList;
    /**
     * A structure containing Lake Formation audit context information.
     */
    AuditContext?: AuditContext;
    /**
     * (Required) A list of supported permission types. 
     */
    SupportedPermissionTypes: PermissionTypeList;
  }
  export interface GetUnfilteredPartitionMetadataResponse {
    /**
     * A Partition object containing the partition metadata.
     */
    Partition?: Partition;
    /**
     * A list of column names that the user has been granted access to.
     */
    AuthorizedColumns?: NameStringList;
    /**
     * A Boolean value that indicates whether the partition location is registered with Lake Formation.
     */
    IsRegisteredWithLakeFormation?: Boolean;
  }
  export interface GetUnfilteredPartitionsMetadataRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is provided, the AWS account ID is used by default. 
     */
    CatalogId: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the table that contains the partition.
     */
    TableName: NameString;
    /**
     * An expression that filters the partitions to be returned. The expression uses SQL syntax similar to the SQL WHERE filter clause. The SQL statement parser JSQLParser parses the expression.   Operators: The following are the operators that you can use in the Expression API call:  =  Checks whether the values of the two operands are equal; if yes, then the condition becomes true. Example: Assume 'variable a' holds 10 and 'variable b' holds 20.  (a = b) is not true.  &lt; &gt;  Checks whether the values of two operands are equal; if the values are not equal, then the condition becomes true. Example: (a &lt; &gt; b) is true.  &gt;  Checks whether the value of the left operand is greater than the value of the right operand; if yes, then the condition becomes true. Example: (a &gt; b) is not true.  &lt;  Checks whether the value of the left operand is less than the value of the right operand; if yes, then the condition becomes true. Example: (a &lt; b) is true.  &gt;=  Checks whether the value of the left operand is greater than or equal to the value of the right operand; if yes, then the condition becomes true. Example: (a &gt;= b) is not true.  &lt;=  Checks whether the value of the left operand is less than or equal to the value of the right operand; if yes, then the condition becomes true. Example: (a &lt;= b) is true.  AND, OR, IN, BETWEEN, LIKE, NOT, IS NULL  Logical operators.    Supported Partition Key Types: The following are the supported partition keys.    string     date     timestamp     int     bigint     long     tinyint     smallint     decimal    If an type is encountered that is not valid, an exception is thrown. 
     */
    Expression?: PredicateString;
    /**
     * A structure containing Lake Formation audit context information.
     */
    AuditContext?: AuditContext;
    /**
     * A list of supported permission types. 
     */
    SupportedPermissionTypes: PermissionTypeList;
    /**
     * A continuation token, if this is not the first call to retrieve these partitions.
     */
    NextToken?: Token;
    /**
     * The segment of the table's partitions to scan in this request.
     */
    Segment?: Segment;
    /**
     * The maximum number of partitions to return in a single response.
     */
    MaxResults?: PageSize;
  }
  export interface GetUnfilteredPartitionsMetadataResponse {
    /**
     * A list of requested partitions.
     */
    UnfilteredPartitions?: UnfilteredPartitionList;
    /**
     * A continuation token, if the returned list of partitions does not include the last one.
     */
    NextToken?: Token;
  }
  export interface GetUnfilteredTableMetadataRequest {
    /**
     * The catalog ID where the table resides.
     */
    CatalogId: CatalogIdString;
    /**
     * (Required) Specifies the name of a database that contains the table.
     */
    DatabaseName: NameString;
    /**
     * (Required) Specifies the name of a table for which you are requesting metadata.
     */
    Name: NameString;
    /**
     * A structure containing Lake Formation audit context information.
     */
    AuditContext?: AuditContext;
    /**
     * (Required) A list of supported permission types. 
     */
    SupportedPermissionTypes: PermissionTypeList;
  }
  export interface GetUnfilteredTableMetadataResponse {
    /**
     * A Table object containing the table metadata.
     */
    Table?: Table;
    /**
     * A list of column names that the user has been granted access to.
     */
    AuthorizedColumns?: NameStringList;
    /**
     * A Boolean value that indicates whether the partition location is registered with Lake Formation.
     */
    IsRegisteredWithLakeFormation?: Boolean;
    /**
     * A list of column row filters.
     */
    CellFilters?: ColumnRowFilterList;
  }
  export interface GetUserDefinedFunctionRequest {
    /**
     * The ID of the Data Catalog where the function to be retrieved is located. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the function is located.
     */
    DatabaseName: NameString;
    /**
     * The name of the function.
     */
    FunctionName: NameString;
  }
  export interface GetUserDefinedFunctionResponse {
    /**
     * The requested function definition.
     */
    UserDefinedFunction?: UserDefinedFunction;
  }
  export interface GetUserDefinedFunctionsRequest {
    /**
     * The ID of the Data Catalog where the functions to be retrieved are located. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the functions are located. If none is provided, functions from all the databases across the catalog will be returned.
     */
    DatabaseName?: NameString;
    /**
     * An optional function-name pattern string that filters the function definitions returned.
     */
    Pattern: NameString;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: Token;
    /**
     * The maximum number of functions to return in one response.
     */
    MaxResults?: CatalogGetterPageSize;
  }
  export interface GetUserDefinedFunctionsResponse {
    /**
     * A list of requested function definitions.
     */
    UserDefinedFunctions?: UserDefinedFunctionList;
    /**
     * A continuation token, if the list of functions returned does not include the last requested function.
     */
    NextToken?: Token;
  }
  export interface GetWorkflowRequest {
    /**
     * The name of the workflow to retrieve.
     */
    Name: NameString;
    /**
     * Specifies whether to include a graph when returning the workflow resource metadata.
     */
    IncludeGraph?: NullableBoolean;
  }
  export interface GetWorkflowResponse {
    /**
     * The resource metadata for the workflow.
     */
    Workflow?: Workflow;
  }
  export interface GetWorkflowRunPropertiesRequest {
    /**
     * Name of the workflow which was run.
     */
    Name: NameString;
    /**
     * The ID of the workflow run whose run properties should be returned.
     */
    RunId: IdString;
  }
  export interface GetWorkflowRunPropertiesResponse {
    /**
     * The workflow run properties which were set during the specified run.
     */
    RunProperties?: WorkflowRunProperties;
  }
  export interface GetWorkflowRunRequest {
    /**
     * Name of the workflow being run.
     */
    Name: NameString;
    /**
     * The ID of the workflow run.
     */
    RunId: IdString;
    /**
     * Specifies whether to include the workflow graph in response or not.
     */
    IncludeGraph?: NullableBoolean;
  }
  export interface GetWorkflowRunResponse {
    /**
     * The requested workflow run metadata.
     */
    Run?: WorkflowRun;
  }
  export interface GetWorkflowRunsRequest {
    /**
     * Name of the workflow whose metadata of runs should be returned.
     */
    Name: NameString;
    /**
     * Specifies whether to include the workflow graph in response or not.
     */
    IncludeGraph?: NullableBoolean;
    /**
     * The maximum size of the response.
     */
    NextToken?: GenericString;
    /**
     * The maximum number of workflow runs to be included in the response.
     */
    MaxResults?: PageSize;
  }
  export interface GetWorkflowRunsResponse {
    /**
     * A list of workflow run metadata objects.
     */
    Runs?: WorkflowRuns;
    /**
     * A continuation token, if not all requested workflow runs have been returned.
     */
    NextToken?: GenericString;
  }
  export interface GluePolicy {
    /**
     * Contains the requested policy document, in JSON format.
     */
    PolicyInJson?: PolicyJsonString;
    /**
     * Contains the hash value associated with this policy.
     */
    PolicyHash?: HashString;
    /**
     * The date and time at which the policy was created.
     */
    CreateTime?: Timestamp;
    /**
     * The date and time at which the policy was last updated.
     */
    UpdateTime?: Timestamp;
  }
  export type GlueRecordType = "DATE"|"STRING"|"TIMESTAMP"|"INT"|"FLOAT"|"LONG"|"BIGDECIMAL"|"BYTE"|"SHORT"|"DOUBLE"|string;
  export type GlueResourceArn = string;
  export interface GlueSchema {
    /**
     * Specifies the column definitions that make up a Glue schema.
     */
    Columns?: GlueStudioSchemaColumnList;
  }
  export type GlueSchemas = GlueSchema[];
  export type GlueStudioColumnNameString = string;
  export type GlueStudioPathList = EnclosedInStringProperties[];
  export interface GlueStudioSchemaColumn {
    /**
     * The name of the column in the Glue Studio schema.
     */
    Name: GlueStudioColumnNameString;
    /**
     * The hive type for this column in the Glue Studio schema.
     */
    Type?: ColumnTypeString;
  }
  export type GlueStudioSchemaColumnList = GlueStudioSchemaColumn[];
  export interface GlueTable {
    /**
     * A database name in the Glue Data Catalog.
     */
    DatabaseName: NameString;
    /**
     * A table name in the Glue Data Catalog.
     */
    TableName: NameString;
    /**
     * A unique identifier for the Glue Data Catalog.
     */
    CatalogId?: NameString;
    /**
     * The name of the connection to the Glue Data Catalog.
     */
    ConnectionName?: NameString;
    /**
     * Additional options for the table. Currently there are two keys supported:    pushDownPredicate: to filter on partitions without having to list and read all the files in your dataset.    catalogPartitionPredicate: to use server-side partition pruning using partition indexes in the Glue Data Catalog.  
     */
    AdditionalOptions?: GlueTableAdditionalOptions;
  }
  export type GlueTableAdditionalOptions = {[key: string]: DescriptionString};
  export type GlueTables = GlueTable[];
  export type GlueVersionString = string;
  export interface GovernedCatalogSource {
    /**
     * The name of the data store.
     */
    Name: NodeName;
    /**
     * The database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The database table to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * Partitions satisfying this predicate are deleted. Files within the retention period in these partitions are not deleted. Set to "" – empty by default.
     */
    PartitionPredicate?: EnclosedInStringProperty;
    /**
     * Specifies additional connection options.
     */
    AdditionalOptions?: S3SourceAdditionalOptions;
  }
  export interface GovernedCatalogTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * Specifies native partitioning using a sequence of keys.
     */
    PartitionKeys?: GlueStudioPathList;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * A policy that specifies update behavior for the governed catalog.
     */
    SchemaChangePolicy?: CatalogSchemaChangePolicy;
  }
  export interface GrokClassifier {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * An identifier of the data format that the classifier matches, such as Twitter, JSON, Omniture logs, and so on.
     */
    Classification: Classification;
    /**
     * The time that this classifier was registered.
     */
    CreationTime?: Timestamp;
    /**
     * The time that this classifier was last updated.
     */
    LastUpdated?: Timestamp;
    /**
     * The version of this classifier.
     */
    Version?: VersionId;
    /**
     * The grok pattern applied to a data store by this classifier. For more information, see built-in patterns in Writing Custom Classifiers.
     */
    GrokPattern: GrokPattern;
    /**
     * Optional custom grok patterns defined by this classifier. For more information, see custom patterns in Writing Custom Classifiers.
     */
    CustomPatterns?: CustomPatterns;
  }
  export type GrokPattern = string;
  export type HashString = string;
  export interface HudiTarget {
    /**
     * An array of Amazon S3 location strings for Hudi, each indicating the root folder with which the metadata files for a Hudi table resides. The Hudi folder may be located in a child folder of the root folder. The crawler will scan all folders underneath a path for a Hudi folder.
     */
    Paths?: PathList;
    /**
     * The name of the connection to use to connect to the Hudi target. If your Hudi files are stored in buckets that require VPC authorization, you can set their connection properties here.
     */
    ConnectionName?: ConnectionName;
    /**
     * A list of glob patterns used to exclude from the crawl. For more information, see Catalog Tables with a Crawler.
     */
    Exclusions?: PathList;
    /**
     * The maximum depth of Amazon S3 paths that the crawler can traverse to discover the Hudi metadata folder in your Amazon S3 path. Used to limit the crawler run time.
     */
    MaximumTraversalDepth?: NullableInteger;
  }
  export type HudiTargetCompressionType = "gzip"|"lzo"|"uncompressed"|"snappy"|string;
  export type HudiTargetList = HudiTarget[];
  export interface IcebergInput {
    /**
     * A required metadata operation. Can only be set to CREATE.
     */
    MetadataOperation: MetadataOperation;
    /**
     * The table version for the Iceberg table. Defaults to 2.
     */
    Version?: VersionString;
  }
  export interface IcebergTarget {
    /**
     * One or more Amazon S3 paths that contains Iceberg metadata folders as s3://bucket/prefix.
     */
    Paths?: PathList;
    /**
     * The name of the connection to use to connect to the Iceberg target.
     */
    ConnectionName?: ConnectionName;
    /**
     * A list of glob patterns used to exclude from the crawl. For more information, see Catalog Tables with a Crawler.
     */
    Exclusions?: PathList;
    /**
     * The maximum depth of Amazon S3 paths that the crawler can traverse to discover the Iceberg metadata folder in your Amazon S3 path. Used to limit the crawler run time.
     */
    MaximumTraversalDepth?: NullableInteger;
  }
  export type IcebergTargetList = IcebergTarget[];
  export type IdString = string;
  export type IdleTimeout = number;
  export interface ImportCatalogToGlueRequest {
    /**
     * The ID of the catalog to import. Currently, this should be the Amazon Web Services account ID.
     */
    CatalogId?: CatalogIdString;
  }
  export interface ImportCatalogToGlueResponse {
  }
  export interface ImportLabelsTaskRunProperties {
    /**
     * The Amazon Simple Storage Service (Amazon S3) path from where you will import the labels.
     */
    InputS3Path?: UriString;
    /**
     * Indicates whether to overwrite your existing labels.
     */
    Replace?: ReplaceBoolean;
  }
  export type Integer = number;
  export type IntegerFlag = number;
  export type IntegerValue = number;
  export type IsVersionValid = boolean;
  export type Iso8601DateTime = Date;
  export type JDBCConnectionType = "sqlserver"|"mysql"|"oracle"|"postgresql"|"redshift"|string;
  export interface JDBCConnectorOptions {
    /**
     * Extra condition clause to filter data from source. For example:  BillingCity='Mountain View'  When using a query instead of a table name, you should validate that the query works with the specified filterPredicate.
     */
    FilterPredicate?: EnclosedInStringProperty;
    /**
     * The name of an integer column that is used for partitioning. This option works only when it's included with lowerBound, upperBound, and numPartitions. This option works the same way as in the Spark SQL JDBC reader.
     */
    PartitionColumn?: EnclosedInStringProperty;
    /**
     * The minimum value of partitionColumn that is used to decide partition stride.
     */
    LowerBound?: BoxedNonNegativeLong;
    /**
     * The maximum value of partitionColumn that is used to decide partition stride.
     */
    UpperBound?: BoxedNonNegativeLong;
    /**
     * The number of partitions. This value, along with lowerBound (inclusive) and upperBound (exclusive), form partition strides for generated WHERE clause expressions that are used to split the partitionColumn.
     */
    NumPartitions?: BoxedNonNegativeLong;
    /**
     * The name of the job bookmark keys on which to sort.
     */
    JobBookmarkKeys?: EnclosedInStringProperties;
    /**
     * Specifies an ascending or descending sort order.
     */
    JobBookmarkKeysSortOrder?: EnclosedInStringProperty;
    /**
     * Custom data type mapping that builds a mapping from a JDBC data type to an Glue data type. For example, the option "dataTypeMapping":{"FLOAT":"STRING"} maps data fields of JDBC type FLOAT into the Java String type by calling the ResultSet.getString() method of the driver, and uses it to build the Glue record. The ResultSet object is implemented by each driver, so the behavior is specific to the driver you use. Refer to the documentation for your JDBC driver to understand how the driver performs the conversions.
     */
    DataTypeMapping?: JDBCDataTypeMapping;
  }
  export interface JDBCConnectorSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the connection that is associated with the connector.
     */
    ConnectionName: EnclosedInStringProperty;
    /**
     * The name of a connector that assists with accessing the data store in Glue Studio.
     */
    ConnectorName: EnclosedInStringProperty;
    /**
     * The type of connection, such as marketplace.jdbc or custom.jdbc, designating a connection to a JDBC data store.
     */
    ConnectionType: EnclosedInStringProperty;
    /**
     * Additional connection options for the connector.
     */
    AdditionalOptions?: JDBCConnectorOptions;
    /**
     * The name of the table in the data source.
     */
    ConnectionTable?: EnclosedInStringPropertyWithQuote;
    /**
     * The table or SQL query to get the data from. You can specify either ConnectionTable or query, but not both.
     */
    Query?: SqlQuery;
    /**
     * Specifies the data schema for the custom JDBC source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface JDBCConnectorTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The name of the connection that is associated with the connector.
     */
    ConnectionName: EnclosedInStringProperty;
    /**
     * The name of the table in the data target.
     */
    ConnectionTable: EnclosedInStringPropertyWithQuote;
    /**
     * The name of a connector that will be used.
     */
    ConnectorName: EnclosedInStringProperty;
    /**
     * The type of connection, such as marketplace.jdbc or custom.jdbc, designating a connection to a JDBC data target.
     */
    ConnectionType: EnclosedInStringProperty;
    /**
     * Additional connection options for the connector.
     */
    AdditionalOptions?: AdditionalOptions;
    /**
     * Specifies the data schema for the JDBC target.
     */
    OutputSchemas?: GlueSchemas;
  }
  export type JDBCDataType = "ARRAY"|"BIGINT"|"BINARY"|"BIT"|"BLOB"|"BOOLEAN"|"CHAR"|"CLOB"|"DATALINK"|"DATE"|"DECIMAL"|"DISTINCT"|"DOUBLE"|"FLOAT"|"INTEGER"|"JAVA_OBJECT"|"LONGNVARCHAR"|"LONGVARBINARY"|"LONGVARCHAR"|"NCHAR"|"NCLOB"|"NULL"|"NUMERIC"|"NVARCHAR"|"OTHER"|"REAL"|"REF"|"REF_CURSOR"|"ROWID"|"SMALLINT"|"SQLXML"|"STRUCT"|"TIME"|"TIME_WITH_TIMEZONE"|"TIMESTAMP"|"TIMESTAMP_WITH_TIMEZONE"|"TINYINT"|"VARBINARY"|"VARCHAR"|string;
  export type JDBCDataTypeMapping = {[key: string]: GlueRecordType};
  export type JdbcMetadataEntry = "COMMENTS"|"RAWTYPES"|string;
  export interface JdbcTarget {
    /**
     * The name of the connection to use to connect to the JDBC target.
     */
    ConnectionName?: ConnectionName;
    /**
     * The path of the JDBC target.
     */
    Path?: Path;
    /**
     * A list of glob patterns used to exclude from the crawl. For more information, see Catalog Tables with a Crawler.
     */
    Exclusions?: PathList;
    /**
     * Specify a value of RAWTYPES or COMMENTS to enable additional metadata in table responses. RAWTYPES provides the native-level datatype. COMMENTS provides comments associated with a column or table in the database. If you do not need additional metadata, keep the field empty.
     */
    EnableAdditionalMetadata?: EnableAdditionalMetadata;
  }
  export type JdbcTargetList = JdbcTarget[];
  export interface Job {
    /**
     * The name you assign to this job definition.
     */
    Name?: NameString;
    /**
     * A description of the job.
     */
    Description?: DescriptionString;
    /**
     * This field is reserved for future use.
     */
    LogUri?: UriString;
    /**
     * The name or Amazon Resource Name (ARN) of the IAM role associated with this job.
     */
    Role?: RoleString;
    /**
     * The time and date that this job definition was created.
     */
    CreatedOn?: TimestampValue;
    /**
     * The last point in time when this job definition was modified.
     */
    LastModifiedOn?: TimestampValue;
    /**
     * An ExecutionProperty specifying the maximum number of concurrent runs allowed for this job.
     */
    ExecutionProperty?: ExecutionProperty;
    /**
     * The JobCommand that runs this job.
     */
    Command?: JobCommand;
    /**
     * The default arguments for every run of this job, specified as name-value pairs. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. Job arguments may be logged. Do not pass plaintext secrets as arguments. Retrieve secrets from a Glue Connection, Secrets Manager or other secret management mechanism if you intend to keep them within the Job.  For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the arguments you can provide to this field when configuring Spark jobs, see the Special Parameters Used by Glue topic in the developer guide. For information about the arguments you can provide to this field when configuring Ray jobs, see Using job parameters in Ray jobs in the developer guide.
     */
    DefaultArguments?: GenericMap;
    /**
     * Arguments for this job that are not overridden when providing job arguments in a job run, specified as name-value pairs.
     */
    NonOverridableArguments?: GenericMap;
    /**
     * The connections used for this job.
     */
    Connections?: ConnectionsList;
    /**
     * The maximum number of times to retry this job after a JobRun fails.
     */
    MaxRetries?: MaxRetries;
    /**
     * This field is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) allocated to runs of this job. You can allocate a minimum of 2 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page. 
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The job timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * For Glue version 1.0 or earlier jobs, using the standard worker type, the number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the  Glue pricing page. For Glue version 2.0 or later jobs, you cannot specify a Maximum capacity. Instead, you should specify a Worker type and the Number of workers. Do not set MaxCapacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job, an Apache Spark ETL job, or an Apache Spark streaming ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl") or Apache Spark streaming ETL job (JobCommand.Name="gluestreaming"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.  
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of G.1X, G.2X, G.4X, G.8X or G.025X for Spark jobs. Accepts the value Z.2X for Ray jobs.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPUs, 16 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPUs, 32 GB of memory) with 128GB disk (approximately 77GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.4X worker type, each worker maps to 4 DPU (16 vCPUs, 64 GB of memory) with 256GB disk (approximately 235GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs in the following Amazon Web Services Regions: US East (Ohio), US East (N. Virginia), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Canada (Central), Europe (Frankfurt), Europe (Ireland), and Europe (Stockholm).   For the G.8X worker type, each worker maps to 8 DPU (32 vCPUs, 128 GB of memory) with 512GB disk (approximately 487GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs, in the same Amazon Web Services Regions as supported for the G.4X worker type.   For the G.025X worker type, each worker maps to 0.25 DPU (2 vCPUs, 4 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for low volume streaming jobs. This worker type is only available for Glue version 3.0 streaming jobs.   For the Z.2X worker type, each worker maps to 2 M-DPU (8vCPUs, 64 GB of memory) with 128 GB disk (approximately 120GB free), and provides up to 8 Ray workers based on the autoscaler.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The name of the SecurityConfiguration structure to be used with this job.
     */
    SecurityConfiguration?: NameString;
    /**
     * Specifies configuration properties of a job notification.
     */
    NotificationProperty?: NotificationProperty;
    /**
     * In Spark jobs, GlueVersion determines the versions of Apache Spark and Python that Glue available in a job. The Python version indicates the version supported for jobs of type Spark.  Ray jobs should set GlueVersion to 4.0 or greater. However, the versions of Ray, Python and additional libraries available in your Ray job are determined by the Runtime parameter of the Job command. For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Jobs that are created without specifying a Glue version default to Glue 0.9.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The representation of a directed acyclic graph on which both the Glue Studio visual component and Glue Studio code generation is based.
     */
    CodeGenConfigurationNodes?: CodeGenConfigurationNodes;
    /**
     * Indicates whether the job is run with a standard or flexible execution class. The standard execution class is ideal for time-sensitive workloads that require fast job startup and dedicated resources. The flexible execution class is appropriate for time-insensitive jobs whose start and completion times may vary.  Only jobs with Glue version 3.0 and above and command type glueetl will be allowed to set ExecutionClass to FLEX. The flexible execution class is available for Spark jobs.
     */
    ExecutionClass?: ExecutionClass;
    /**
     * The details for a source control configuration for a job, allowing synchronization of job artifacts to or from a remote repository.
     */
    SourceControlDetails?: SourceControlDetails;
  }
  export interface JobBookmarkEntry {
    /**
     * The name of the job in question.
     */
    JobName?: JobName;
    /**
     * The version of the job.
     */
    Version?: IntegerValue;
    /**
     * The run ID number.
     */
    Run?: IntegerValue;
    /**
     * The attempt ID number.
     */
    Attempt?: IntegerValue;
    /**
     * The unique run identifier associated with the previous job run.
     */
    PreviousRunId?: RunId;
    /**
     * The run ID number.
     */
    RunId?: RunId;
    /**
     * The bookmark itself.
     */
    JobBookmark?: JsonValue;
  }
  export interface JobBookmarksEncryption {
    /**
     * The encryption mode to use for job bookmarks data.
     */
    JobBookmarksEncryptionMode?: JobBookmarksEncryptionMode;
    /**
     * The Amazon Resource Name (ARN) of the KMS key to be used to encrypt the data.
     */
    KmsKeyArn?: KmsKeyArn;
  }
  export type JobBookmarksEncryptionMode = "DISABLED"|"CSE-KMS"|string;
  export interface JobCommand {
    /**
     * The name of the job command. For an Apache Spark ETL job, this must be glueetl. For a Python shell job, it must be pythonshell. For an Apache Spark streaming ETL job, this must be gluestreaming. For a Ray job, this must be glueray.
     */
    Name?: GenericString;
    /**
     * Specifies the Amazon Simple Storage Service (Amazon S3) path to a script that runs a job.
     */
    ScriptLocation?: ScriptLocationString;
    /**
     * The Python version being used to run a Python shell job. Allowed values are 2 or 3.
     */
    PythonVersion?: PythonVersionString;
    /**
     * In Ray jobs, Runtime is used to specify the versions of Ray, Python and additional libraries available in your environment. This field is not used in other job types. For supported runtime environment values, see Working with Ray jobs in the Glue Developer Guide.
     */
    Runtime?: RuntimeNameString;
  }
  export type JobList = Job[];
  export type JobName = string;
  export type JobNameList = NameString[];
  export interface JobNodeDetails {
    /**
     * The information for the job runs represented by the job node.
     */
    JobRuns?: JobRunList;
  }
  export interface JobRun {
    /**
     * The ID of this job run.
     */
    Id?: IdString;
    /**
     * The number of the attempt to run this job.
     */
    Attempt?: AttemptCount;
    /**
     * The ID of the previous run of this job. For example, the JobRunId specified in the StartJobRun action.
     */
    PreviousRunId?: IdString;
    /**
     * The name of the trigger that started this job run.
     */
    TriggerName?: NameString;
    /**
     * The name of the job definition being used in this run.
     */
    JobName?: NameString;
    /**
     * The date and time at which this job run was started.
     */
    StartedOn?: TimestampValue;
    /**
     * The last time that this job run was modified.
     */
    LastModifiedOn?: TimestampValue;
    /**
     * The date and time that this job run completed.
     */
    CompletedOn?: TimestampValue;
    /**
     * The current state of the job run. For more information about the statuses of jobs that have terminated abnormally, see Glue Job Run Statuses.
     */
    JobRunState?: JobRunState;
    /**
     * The job arguments associated with this run. For this job run, they replace the default arguments set in the job definition itself. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. Job arguments may be logged. Do not pass plaintext secrets as arguments. Retrieve secrets from a Glue Connection, Secrets Manager or other secret management mechanism if you intend to keep them within the Job.  For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the arguments you can provide to this field when configuring Spark jobs, see the Special Parameters Used by Glue topic in the developer guide. For information about the arguments you can provide to this field when configuring Ray jobs, see Using job parameters in Ray jobs in the developer guide.
     */
    Arguments?: GenericMap;
    /**
     * An error message associated with this job run.
     */
    ErrorMessage?: ErrorString;
    /**
     * A list of predecessors to this job run.
     */
    PredecessorRuns?: PredecessorList;
    /**
     * This field is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) allocated to this JobRun. From 2 to 100 DPUs can be allocated; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The amount of time (in seconds) that the job run consumed resources.
     */
    ExecutionTime?: ExecutionTime;
    /**
     * The JobRun timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. This value overrides the timeout value set in the parent job. Streaming jobs do not have a timeout. The default for non-streaming jobs is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * For Glue version 1.0 or earlier jobs, using the standard worker type, the number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the  Glue pricing page. For Glue version 2.0+ jobs, you cannot specify a Maximum capacity. Instead, you should specify a Worker type and the Number of workers. Do not set MaxCapacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job, an Apache Spark ETL job, or an Apache Spark streaming ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl") or Apache Spark streaming ETL job (JobCommand.Name="gluestreaming"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.  
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of G.1X, G.2X, G.4X, G.8X or G.025X for Spark jobs. Accepts the value Z.2X for Ray jobs.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPUs, 16 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPUs, 32 GB of memory) with 128GB disk (approximately 77GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.4X worker type, each worker maps to 4 DPU (16 vCPUs, 64 GB of memory) with 256GB disk (approximately 235GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs in the following Amazon Web Services Regions: US East (Ohio), US East (N. Virginia), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Canada (Central), Europe (Frankfurt), Europe (Ireland), and Europe (Stockholm).   For the G.8X worker type, each worker maps to 8 DPU (32 vCPUs, 128 GB of memory) with 512GB disk (approximately 487GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs, in the same Amazon Web Services Regions as supported for the G.4X worker type.   For the G.025X worker type, each worker maps to 0.25 DPU (2 vCPUs, 4 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for low volume streaming jobs. This worker type is only available for Glue version 3.0 streaming jobs.   For the Z.2X worker type, each worker maps to 2 M-DPU (8vCPUs, 64 GB of memory) with 128 GB disk (approximately 120GB free), and provides up to 8 Ray workers based on the autoscaler.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The name of the SecurityConfiguration structure to be used with this job run.
     */
    SecurityConfiguration?: NameString;
    /**
     * The name of the log group for secure logging that can be server-side encrypted in Amazon CloudWatch using KMS. This name can be /aws-glue/jobs/, in which case the default encryption is NONE. If you add a role name and SecurityConfiguration name (in other words, /aws-glue/jobs-yourRoleName-yourSecurityConfigurationName/), then that security configuration is used to encrypt the log group.
     */
    LogGroupName?: GenericString;
    /**
     * Specifies configuration properties of a job run notification.
     */
    NotificationProperty?: NotificationProperty;
    /**
     * In Spark jobs, GlueVersion determines the versions of Apache Spark and Python that Glue available in a job. The Python version indicates the version supported for jobs of type Spark.  Ray jobs should set GlueVersion to 4.0 or greater. However, the versions of Ray, Python and additional libraries available in your Ray job are determined by the Runtime parameter of the Job command. For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Jobs that are created without specifying a Glue version default to Glue 0.9.
     */
    GlueVersion?: GlueVersionString;
    /**
     * This field populates only for Auto Scaling job runs, and represents the total time each executor ran during the lifecycle of a job run in seconds, multiplied by a DPU factor (1 for G.1X, 2 for G.2X, or 0.25 for G.025X workers). This value may be different than the executionEngineRuntime * MaxCapacity as in the case of Auto Scaling jobs, as the number of executors running at a given time may be less than the MaxCapacity. Therefore, it is possible that the value of DPUSeconds is less than executionEngineRuntime * MaxCapacity.
     */
    DPUSeconds?: NullableDouble;
    /**
     * Indicates whether the job is run with a standard or flexible execution class. The standard execution-class is ideal for time-sensitive workloads that require fast job startup and dedicated resources. The flexible execution class is appropriate for time-insensitive jobs whose start and completion times may vary.  Only jobs with Glue version 3.0 and above and command type glueetl will be allowed to set ExecutionClass to FLEX. The flexible execution class is available for Spark jobs.
     */
    ExecutionClass?: ExecutionClass;
  }
  export type JobRunList = JobRun[];
  export type JobRunState = "STARTING"|"RUNNING"|"STOPPING"|"STOPPED"|"SUCCEEDED"|"FAILED"|"TIMEOUT"|"ERROR"|"WAITING"|string;
  export interface JobUpdate {
    /**
     * Description of the job being defined.
     */
    Description?: DescriptionString;
    /**
     * This field is reserved for future use.
     */
    LogUri?: UriString;
    /**
     * The name or Amazon Resource Name (ARN) of the IAM role associated with this job (required).
     */
    Role?: RoleString;
    /**
     * An ExecutionProperty specifying the maximum number of concurrent runs allowed for this job.
     */
    ExecutionProperty?: ExecutionProperty;
    /**
     * The JobCommand that runs this job (required).
     */
    Command?: JobCommand;
    /**
     * The default arguments for every run of this job, specified as name-value pairs. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. Job arguments may be logged. Do not pass plaintext secrets as arguments. Retrieve secrets from a Glue Connection, Secrets Manager or other secret management mechanism if you intend to keep them within the Job.  For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the arguments you can provide to this field when configuring Spark jobs, see the Special Parameters Used by Glue topic in the developer guide. For information about the arguments you can provide to this field when configuring Ray jobs, see Using job parameters in Ray jobs in the developer guide.
     */
    DefaultArguments?: GenericMap;
    /**
     * Arguments for this job that are not overridden when providing job arguments in a job run, specified as name-value pairs.
     */
    NonOverridableArguments?: GenericMap;
    /**
     * The connections used for this job.
     */
    Connections?: ConnectionsList;
    /**
     * The maximum number of times to retry this job if it fails.
     */
    MaxRetries?: MaxRetries;
    /**
     * This field is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) to allocate to this job. You can allocate a minimum of 2 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The job timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * For Glue version 1.0 or earlier jobs, using the standard worker type, the number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the  Glue pricing page. For Glue version 2.0+ jobs, you cannot specify a Maximum capacity. Instead, you should specify a Worker type and the Number of workers. Do not set MaxCapacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job, an Apache Spark ETL job, or an Apache Spark streaming ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl") or Apache Spark streaming ETL job (JobCommand.Name="gluestreaming"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.  
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of G.1X, G.2X, G.4X, G.8X or G.025X for Spark jobs. Accepts the value Z.2X for Ray jobs.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPUs, 16 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPUs, 32 GB of memory) with 128GB disk (approximately 77GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.4X worker type, each worker maps to 4 DPU (16 vCPUs, 64 GB of memory) with 256GB disk (approximately 235GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs in the following Amazon Web Services Regions: US East (Ohio), US East (N. Virginia), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Canada (Central), Europe (Frankfurt), Europe (Ireland), and Europe (Stockholm).   For the G.8X worker type, each worker maps to 8 DPU (32 vCPUs, 128 GB of memory) with 512GB disk (approximately 487GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs, in the same Amazon Web Services Regions as supported for the G.4X worker type.   For the G.025X worker type, each worker maps to 0.25 DPU (2 vCPUs, 4 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for low volume streaming jobs. This worker type is only available for Glue version 3.0 streaming jobs.   For the Z.2X worker type, each worker maps to 2 M-DPU (8vCPUs, 64 GB of memory) with 128 GB disk (approximately 120GB free), and provides up to 8 Ray workers based on the autoscaler.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The name of the SecurityConfiguration structure to be used with this job.
     */
    SecurityConfiguration?: NameString;
    /**
     * Specifies the configuration properties of a job notification.
     */
    NotificationProperty?: NotificationProperty;
    /**
     * In Spark jobs, GlueVersion determines the versions of Apache Spark and Python that Glue available in a job. The Python version indicates the version supported for jobs of type Spark.  Ray jobs should set GlueVersion to 4.0 or greater. However, the versions of Ray, Python and additional libraries available in your Ray job are determined by the Runtime parameter of the Job command. For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Jobs that are created without specifying a Glue version default to Glue 0.9.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The representation of a directed acyclic graph on which both the Glue Studio visual component and Glue Studio code generation is based.
     */
    CodeGenConfigurationNodes?: CodeGenConfigurationNodes;
    /**
     * Indicates whether the job is run with a standard or flexible execution class. The standard execution-class is ideal for time-sensitive workloads that require fast job startup and dedicated resources. The flexible execution class is appropriate for time-insensitive jobs whose start and completion times may vary.  Only jobs with Glue version 3.0 and above and command type glueetl will be allowed to set ExecutionClass to FLEX. The flexible execution class is available for Spark jobs.
     */
    ExecutionClass?: ExecutionClass;
    /**
     * The details for a source control configuration for a job, allowing synchronization of job artifacts to or from a remote repository.
     */
    SourceControlDetails?: SourceControlDetails;
  }
  export interface Join {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: TwoInputs;
    /**
     * Specifies the type of join to be performed on the datasets.
     */
    JoinType: JoinType;
    /**
     * A list of the two columns to be joined.
     */
    Columns: JoinColumns;
  }
  export interface JoinColumn {
    /**
     * The column to be joined.
     */
    From: EnclosedInStringProperty;
    /**
     * The key of the column to be joined.
     */
    Keys: GlueStudioPathList;
  }
  export type JoinColumns = JoinColumn[];
  export type JoinType = "equijoin"|"left"|"right"|"outer"|"leftsemi"|"leftanti"|string;
  export interface JsonClassifier {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * The time that this classifier was registered.
     */
    CreationTime?: Timestamp;
    /**
     * The time that this classifier was last updated.
     */
    LastUpdated?: Timestamp;
    /**
     * The version of this classifier.
     */
    Version?: VersionId;
    /**
     * A JsonPath string defining the JSON data for the classifier to classify. Glue supports a subset of JsonPath, as described in Writing JsonPath Custom Classifiers.
     */
    JsonPath: JsonPath;
  }
  export type JsonPath = string;
  export type JsonValue = string;
  export interface KafkaStreamingSourceOptions {
    /**
     * A list of bootstrap server URLs, for example, as b-1.vpc-test-2.o4q88o.c6.kafka.us-east-1.amazonaws.com:9094. This option must be specified in the API call or defined in the table metadata in the Data Catalog.
     */
    BootstrapServers?: EnclosedInStringProperty;
    /**
     * The protocol used to communicate with brokers. The possible values are "SSL" or "PLAINTEXT".
     */
    SecurityProtocol?: EnclosedInStringProperty;
    /**
     * The name of the connection.
     */
    ConnectionName?: EnclosedInStringProperty;
    /**
     * The topic name as specified in Apache Kafka. You must specify at least one of "topicName", "assign" or "subscribePattern".
     */
    TopicName?: EnclosedInStringProperty;
    /**
     * The specific TopicPartitions to consume. You must specify at least one of "topicName", "assign" or "subscribePattern".
     */
    Assign?: EnclosedInStringProperty;
    /**
     * A Java regex string that identifies the topic list to subscribe to. You must specify at least one of "topicName", "assign" or "subscribePattern".
     */
    SubscribePattern?: EnclosedInStringProperty;
    /**
     * An optional classification.
     */
    Classification?: EnclosedInStringProperty;
    /**
     * Specifies the delimiter character.
     */
    Delimiter?: EnclosedInStringProperty;
    /**
     * The starting position in the Kafka topic to read data from. The possible values are "earliest" or "latest". The default value is "latest".
     */
    StartingOffsets?: EnclosedInStringProperty;
    /**
     * The end point when a batch query is ended. Possible values are either "latest" or a JSON string that specifies an ending offset for each TopicPartition.
     */
    EndingOffsets?: EnclosedInStringProperty;
    /**
     * The timeout in milliseconds to poll data from Kafka in Spark job executors. The default value is 512.
     */
    PollTimeoutMs?: BoxedNonNegativeLong;
    /**
     * The number of times to retry before failing to fetch Kafka offsets. The default value is 3.
     */
    NumRetries?: BoxedNonNegativeInt;
    /**
     * The time in milliseconds to wait before retrying to fetch Kafka offsets. The default value is 10.
     */
    RetryIntervalMs?: BoxedNonNegativeLong;
    /**
     * The rate limit on the maximum number of offsets that are processed per trigger interval. The specified total number of offsets is proportionally split across topicPartitions of different volumes. The default value is null, which means that the consumer reads all offsets until the known latest offset.
     */
    MaxOffsetsPerTrigger?: BoxedNonNegativeLong;
    /**
     * The desired minimum number of partitions to read from Kafka. The default value is null, which means that the number of spark partitions is equal to the number of Kafka partitions.
     */
    MinPartitions?: BoxedNonNegativeInt;
    /**
     * Whether to include the Kafka headers. When the option is set to "true", the data output will contain an additional column named "glue_streaming_kafka_headers" with type Array[Struct(key: String, value: String)]. The default value is "false". This option is available in Glue version 3.0 or later only.
     */
    IncludeHeaders?: BoxedBoolean;
    /**
     * When this option is set to 'true', the data output will contain an additional column named "__src_timestamp" that indicates the time when the corresponding record received by the topic. The default value is 'false'. This option is supported in Glue version 4.0 or later.
     */
    AddRecordTimestamp?: EnclosedInStringProperty;
    /**
     * When this option is set to 'true', for each batch, it will emit the metrics for the duration between the oldest record received by the topic and the time it arrives in Glue to CloudWatch. The metric's name is "glue.driver.streaming.maxConsumerLagInMs". The default value is 'false'. This option is supported in Glue version 4.0 or later.
     */
    EmitConsumerLagMetrics?: EnclosedInStringProperty;
    /**
     * The timestamp of the record in the Kafka topic to start reading data from. The possible values are a timestamp string in UTC format of the pattern yyyy-mm-ddTHH:MM:SSZ (where Z represents a UTC timezone offset with a +/-. For example: "2023-04-04T08:00:00+08:00").  Only one of StartingTimestamp or StartingOffsets must be set.
     */
    StartingTimestamp?: Iso8601DateTime;
  }
  export type KeyList = NameString[];
  export interface KeySchemaElement {
    /**
     * The name of a partition key.
     */
    Name: NameString;
    /**
     * The type of a partition key.
     */
    Type: ColumnTypeString;
  }
  export type KeySchemaElementList = KeySchemaElement[];
  export type KeyString = string;
  export interface KinesisStreamingSourceOptions {
    /**
     * The URL of the Kinesis endpoint.
     */
    EndpointUrl?: EnclosedInStringProperty;
    /**
     * The name of the Kinesis data stream.
     */
    StreamName?: EnclosedInStringProperty;
    /**
     * An optional classification.
     */
    Classification?: EnclosedInStringProperty;
    /**
     * Specifies the delimiter character.
     */
    Delimiter?: EnclosedInStringProperty;
    /**
     * The starting position in the Kinesis data stream to read data from. The possible values are "latest", "trim_horizon", "earliest", or a timestamp string in UTC format in the pattern yyyy-mm-ddTHH:MM:SSZ (where Z represents a UTC timezone offset with a +/-. For example: "2023-04-04T08:00:00-04:00"). The default value is "latest". Note: Using a value that is a timestamp string in UTC format for "startingPosition" is supported only for Glue version 4.0 or later.
     */
    StartingPosition?: StartingPosition;
    /**
     * The maximum time spent in the job executor to fetch a record from the Kinesis data stream per shard, specified in milliseconds (ms). The default value is 1000.
     */
    MaxFetchTimeInMs?: BoxedNonNegativeLong;
    /**
     * The maximum number of records to fetch per shard in the Kinesis data stream. The default value is 100000.
     */
    MaxFetchRecordsPerShard?: BoxedNonNegativeLong;
    /**
     * The maximum number of records to fetch from the Kinesis data stream in each getRecords operation. The default value is 10000.
     */
    MaxRecordPerRead?: BoxedNonNegativeLong;
    /**
     * Adds a time delay between two consecutive getRecords operations. The default value is "False". This option is only configurable for Glue version 2.0 and above.
     */
    AddIdleTimeBetweenReads?: BoxedBoolean;
    /**
     * The minimum time delay between two consecutive getRecords operations, specified in ms. The default value is 1000. This option is only configurable for Glue version 2.0 and above.
     */
    IdleTimeBetweenReadsInMs?: BoxedNonNegativeLong;
    /**
     * The minimum time interval between two ListShards API calls for your script to consider resharding. The default value is 1s.
     */
    DescribeShardInterval?: BoxedNonNegativeLong;
    /**
     * The maximum number of retries for Kinesis Data Streams API requests. The default value is 3.
     */
    NumRetries?: BoxedNonNegativeInt;
    /**
     * The cool-off time period (specified in ms) before retrying the Kinesis Data Streams API call. The default value is 1000.
     */
    RetryIntervalMs?: BoxedNonNegativeLong;
    /**
     * The maximum cool-off time period (specified in ms) between two retries of a Kinesis Data Streams API call. The default value is 10000.
     */
    MaxRetryIntervalMs?: BoxedNonNegativeLong;
    /**
     * Avoids creating an empty microbatch job by checking for unread data in the Kinesis data stream before the batch is started. The default value is "False".
     */
    AvoidEmptyBatches?: BoxedBoolean;
    /**
     * The Amazon Resource Name (ARN) of the Kinesis data stream.
     */
    StreamArn?: EnclosedInStringProperty;
    /**
     * The Amazon Resource Name (ARN) of the role to assume using AWS Security Token Service (AWS STS). This role must have permissions for describe or read record operations for the Kinesis data stream. You must use this parameter when accessing a data stream in a different account. Used in conjunction with "awsSTSSessionName".
     */
    RoleArn?: EnclosedInStringProperty;
    /**
     * An identifier for the session assuming the role using AWS STS. You must use this parameter when accessing a data stream in a different account. Used in conjunction with "awsSTSRoleARN".
     */
    RoleSessionName?: EnclosedInStringProperty;
    /**
     * When this option is set to 'true', the data output will contain an additional column named "__src_timestamp" that indicates the time when the corresponding record received by the stream. The default value is 'false'. This option is supported in Glue version 4.0 or later.
     */
    AddRecordTimestamp?: EnclosedInStringProperty;
    /**
     * When this option is set to 'true', for each batch, it will emit the metrics for the duration between the oldest record received by the stream and the time it arrives in Glue to CloudWatch. The metric's name is "glue.driver.streaming.maxConsumerLagInMs". The default value is 'false'. This option is supported in Glue version 4.0 or later.
     */
    EmitConsumerLagMetrics?: EnclosedInStringProperty;
    /**
     * The timestamp of the record in the Kinesis data stream to start reading data from. The possible values are a timestamp string in UTC format of the pattern yyyy-mm-ddTHH:MM:SSZ (where Z represents a UTC timezone offset with a +/-. For example: "2023-04-04T08:00:00+08:00"). 
     */
    StartingTimestamp?: Iso8601DateTime;
  }
  export type KmsKeyArn = string;
  export type LabelCount = number;
  export interface LabelingSetGenerationTaskRunProperties {
    /**
     * The Amazon Simple Storage Service (Amazon S3) path where you will generate the labeling set.
     */
    OutputS3Path?: UriString;
  }
  export interface LakeFormationConfiguration {
    /**
     * Specifies whether to use Lake Formation credentials for the crawler instead of the IAM role credentials.
     */
    UseLakeFormationCredentials?: NullableBoolean;
    /**
     * Required for cross account crawls. For same account crawls as the target data, this can be left as null.
     */
    AccountId?: AccountId;
  }
  export type Language = "PYTHON"|"SCALA"|string;
  export interface LastActiveDefinition {
    /**
     * The description of the blueprint.
     */
    Description?: Generic512CharString;
    /**
     * The date and time the blueprint was last modified.
     */
    LastModifiedOn?: TimestampValue;
    /**
     * A JSON string specifying the parameters for the blueprint.
     */
    ParameterSpec?: BlueprintParameterSpec;
    /**
     * Specifies a path in Amazon S3 where the blueprint is published by the Glue developer.
     */
    BlueprintLocation?: GenericString;
    /**
     * Specifies a path in Amazon S3 where the blueprint is copied when you create or update the blueprint.
     */
    BlueprintServiceLocation?: GenericString;
  }
  export interface LastCrawlInfo {
    /**
     * Status of the last crawl.
     */
    Status?: LastCrawlStatus;
    /**
     * If an error occurred, the error information about the last crawl.
     */
    ErrorMessage?: DescriptionString;
    /**
     * The log group for the last crawl.
     */
    LogGroup?: LogGroup;
    /**
     * The log stream for the last crawl.
     */
    LogStream?: LogStream;
    /**
     * The prefix for a message about this crawl.
     */
    MessagePrefix?: MessagePrefix;
    /**
     * The time at which the crawl started.
     */
    StartTime?: Timestamp;
  }
  export type LastCrawlStatus = "SUCCEEDED"|"CANCELLED"|"FAILED"|string;
  export type LatestSchemaVersionBoolean = boolean;
  export type LimitedPathList = LimitedStringList[];
  export type LimitedStringList = GenericLimitedString[];
  export interface LineageConfiguration {
    /**
     * Specifies whether data lineage is enabled for the crawler. Valid values are:   ENABLE: enables data lineage for the crawler   DISABLE: disables data lineage for the crawler  
     */
    CrawlerLineageSettings?: CrawlerLineageSettings;
  }
  export interface ListBlueprintsRequest {
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: GenericString;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
    /**
     * Filters the list by an Amazon Web Services resource tag.
     */
    Tags?: TagsMap;
  }
  export interface ListBlueprintsResponse {
    /**
     * List of names of blueprints in the account.
     */
    Blueprints?: BlueprintNames;
    /**
     * A continuation token, if not all blueprint names have been returned.
     */
    NextToken?: GenericString;
  }
  export interface ListCrawlersRequest {
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: Token;
    /**
     * Specifies to return only these tagged resources.
     */
    Tags?: TagsMap;
  }
  export interface ListCrawlersResponse {
    /**
     * The names of all crawlers in the account, or the crawlers with the specified tags.
     */
    CrawlerNames?: CrawlerNameList;
    /**
     * A continuation token, if the returned list does not contain the last metric available.
     */
    NextToken?: Token;
  }
  export interface ListCrawlsRequest {
    /**
     * The name of the crawler whose runs you want to retrieve.
     */
    CrawlerName: NameString;
    /**
     * The maximum number of results to return. The default is 20, and maximum is 100.
     */
    MaxResults?: PageSize;
    /**
     * Filters the crawls by the criteria you specify in a list of CrawlsFilter objects.
     */
    Filters?: CrawlsFilterList;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: Token;
  }
  export interface ListCrawlsResponse {
    /**
     * A list of CrawlerHistory objects representing the crawl runs that meet your criteria.
     */
    Crawls?: CrawlerHistoryList;
    /**
     * A continuation token for paginating the returned list of tokens, returned if the current segment of the list is not the last.
     */
    NextToken?: Token;
  }
  export interface ListCustomEntityTypesRequest {
    /**
     * A paginated token to offset the results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
    /**
     * A list of key-value pair tags.
     */
    Tags?: TagsMap;
  }
  export interface ListCustomEntityTypesResponse {
    /**
     * A list of CustomEntityType objects representing custom patterns.
     */
    CustomEntityTypes?: CustomEntityTypes;
    /**
     * A pagination token, if more results are available.
     */
    NextToken?: PaginationToken;
  }
  export interface ListDataQualityResultsRequest {
    /**
     * The filter criteria.
     */
    Filter?: DataQualityResultFilterCriteria;
    /**
     * A paginated token to offset the results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
  }
  export interface ListDataQualityResultsResponse {
    /**
     * A list of DataQualityResultDescription objects.
     */
    Results: DataQualityResultDescriptionList;
    /**
     * A pagination token, if more results are available.
     */
    NextToken?: PaginationToken;
  }
  export interface ListDataQualityRuleRecommendationRunsRequest {
    /**
     * The filter criteria.
     */
    Filter?: DataQualityRuleRecommendationRunFilter;
    /**
     * A paginated token to offset the results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
  }
  export interface ListDataQualityRuleRecommendationRunsResponse {
    /**
     * A list of DataQualityRuleRecommendationRunDescription objects.
     */
    Runs?: DataQualityRuleRecommendationRunList;
    /**
     * A pagination token, if more results are available.
     */
    NextToken?: PaginationToken;
  }
  export interface ListDataQualityRulesetEvaluationRunsRequest {
    /**
     * The filter criteria.
     */
    Filter?: DataQualityRulesetEvaluationRunFilter;
    /**
     * A paginated token to offset the results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
  }
  export interface ListDataQualityRulesetEvaluationRunsResponse {
    /**
     * A list of DataQualityRulesetEvaluationRunDescription objects representing data quality ruleset runs.
     */
    Runs?: DataQualityRulesetEvaluationRunList;
    /**
     * A pagination token, if more results are available.
     */
    NextToken?: PaginationToken;
  }
  export interface ListDataQualityRulesetsRequest {
    /**
     * A paginated token to offset the results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: PageSize;
    /**
     * The filter criteria. 
     */
    Filter?: DataQualityRulesetFilterCriteria;
    /**
     * A list of key-value pair tags.
     */
    Tags?: TagsMap;
  }
  export interface ListDataQualityRulesetsResponse {
    /**
     * A paginated list of rulesets for the specified list of Glue tables.
     */
    Rulesets?: DataQualityRulesetList;
    /**
     * A pagination token, if more results are available.
     */
    NextToken?: PaginationToken;
  }
  export interface ListDevEndpointsRequest {
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: GenericString;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
    /**
     * Specifies to return only these tagged resources.
     */
    Tags?: TagsMap;
  }
  export interface ListDevEndpointsResponse {
    /**
     * The names of all the DevEndpoints in the account, or the DevEndpoints with the specified tags.
     */
    DevEndpointNames?: DevEndpointNameList;
    /**
     * A continuation token, if the returned list does not contain the last metric available.
     */
    NextToken?: GenericString;
  }
  export interface ListJobsRequest {
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: GenericString;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
    /**
     * Specifies to return only these tagged resources.
     */
    Tags?: TagsMap;
  }
  export interface ListJobsResponse {
    /**
     * The names of all jobs in the account, or the jobs with the specified tags.
     */
    JobNames?: JobNameList;
    /**
     * A continuation token, if the returned list does not contain the last metric available.
     */
    NextToken?: GenericString;
  }
  export interface ListMLTransformsRequest {
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
    /**
     * A TransformFilterCriteria used to filter the machine learning transforms.
     */
    Filter?: TransformFilterCriteria;
    /**
     * A TransformSortCriteria used to sort the machine learning transforms.
     */
    Sort?: TransformSortCriteria;
    /**
     * Specifies to return only these tagged resources.
     */
    Tags?: TagsMap;
  }
  export interface ListMLTransformsResponse {
    /**
     * The identifiers of all the machine learning transforms in the account, or the machine learning transforms with the specified tags.
     */
    TransformIds: TransformIdList;
    /**
     * A continuation token, if the returned list does not contain the last metric available.
     */
    NextToken?: PaginationToken;
  }
  export interface ListRegistriesInput {
    /**
     * Maximum number of results required per page. If the value is not supplied, this will be defaulted to 25 per page.
     */
    MaxResults?: MaxResultsNumber;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: SchemaRegistryTokenString;
  }
  export interface ListRegistriesResponse {
    /**
     * An array of RegistryDetailedListItem objects containing minimal details of each registry.
     */
    Registries?: RegistryListDefinition;
    /**
     * A continuation token for paginating the returned list of tokens, returned if the current segment of the list is not the last.
     */
    NextToken?: SchemaRegistryTokenString;
  }
  export interface ListSchemaVersionsInput {
    /**
     * This is a wrapper structure to contain schema identity fields. The structure contains:   SchemaId$SchemaArn: The Amazon Resource Name (ARN) of the schema. Either SchemaArn or SchemaName and RegistryName has to be provided.   SchemaId$SchemaName: The name of the schema. Either SchemaArn or SchemaName and RegistryName has to be provided.  
     */
    SchemaId: SchemaId;
    /**
     * Maximum number of results required per page. If the value is not supplied, this will be defaulted to 25 per page.
     */
    MaxResults?: MaxResultsNumber;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: SchemaRegistryTokenString;
  }
  export interface ListSchemaVersionsResponse {
    /**
     * An array of SchemaVersionList objects containing details of each schema version.
     */
    Schemas?: SchemaVersionList;
    /**
     * A continuation token for paginating the returned list of tokens, returned if the current segment of the list is not the last.
     */
    NextToken?: SchemaRegistryTokenString;
  }
  export interface ListSchemasInput {
    /**
     * A wrapper structure that may contain the registry name and Amazon Resource Name (ARN).
     */
    RegistryId?: RegistryId;
    /**
     * Maximum number of results required per page. If the value is not supplied, this will be defaulted to 25 per page.
     */
    MaxResults?: MaxResultsNumber;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: SchemaRegistryTokenString;
  }
  export interface ListSchemasResponse {
    /**
     * An array of SchemaListItem objects containing details of each schema.
     */
    Schemas?: SchemaListDefinition;
    /**
     * A continuation token for paginating the returned list of tokens, returned if the current segment of the list is not the last.
     */
    NextToken?: SchemaRegistryTokenString;
  }
  export interface ListSessionsRequest {
    /**
     * The token for the next set of results, or null if there are no more result. 
     */
    NextToken?: OrchestrationToken;
    /**
     * The maximum number of results. 
     */
    MaxResults?: PageSize;
    /**
     * Tags belonging to the session. 
     */
    Tags?: TagsMap;
    /**
     * The origin of the request. 
     */
    RequestOrigin?: OrchestrationNameString;
  }
  export interface ListSessionsResponse {
    /**
     * Returns the ID of the session. 
     */
    Ids?: SessionIdList;
    /**
     * Returns the session object. 
     */
    Sessions?: SessionList;
    /**
     * The token for the next set of results, or null if there are no more result. 
     */
    NextToken?: OrchestrationToken;
  }
  export interface ListStatementsRequest {
    /**
     * The Session ID of the statements.
     */
    SessionId: NameString;
    /**
     * The origin of the request to list statements.
     */
    RequestOrigin?: OrchestrationNameString;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: OrchestrationToken;
  }
  export interface ListStatementsResponse {
    /**
     * Returns the list of statements.
     */
    Statements?: StatementList;
    /**
     * A continuation token, if not all statements have yet been returned.
     */
    NextToken?: OrchestrationToken;
  }
  export interface ListTriggersRequest {
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: GenericString;
    /**
     *  The name of the job for which to retrieve triggers. The trigger that can start this job is returned. If there is no such trigger, all triggers are returned.
     */
    DependentJobName?: NameString;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
    /**
     * Specifies to return only these tagged resources.
     */
    Tags?: TagsMap;
  }
  export interface ListTriggersResponse {
    /**
     * The names of all triggers in the account, or the triggers with the specified tags.
     */
    TriggerNames?: TriggerNameList;
    /**
     * A continuation token, if the returned list does not contain the last metric available.
     */
    NextToken?: GenericString;
  }
  export interface ListWorkflowsRequest {
    /**
     * A continuation token, if this is a continuation request.
     */
    NextToken?: GenericString;
    /**
     * The maximum size of a list to return.
     */
    MaxResults?: PageSize;
  }
  export interface ListWorkflowsResponse {
    /**
     * List of names of workflows in the account.
     */
    Workflows?: WorkflowNames;
    /**
     * A continuation token, if not all workflow names have been returned.
     */
    NextToken?: GenericString;
  }
  export interface Location {
    /**
     * A JDBC location.
     */
    Jdbc?: CodeGenNodeArgs;
    /**
     * An Amazon Simple Storage Service (Amazon S3) location.
     */
    S3?: CodeGenNodeArgs;
    /**
     * An Amazon DynamoDB table location.
     */
    DynamoDB?: CodeGenNodeArgs;
  }
  export type LocationMap = {[key: string]: ColumnValuesString};
  export type LocationString = string;
  export type LocationStringList = LocationString[];
  export type LogGroup = string;
  export type LogStream = string;
  export type Logical = "AND"|"ANY"|string;
  export type LogicalOperator = "EQUALS"|string;
  export type Long = number;
  export interface LongColumnStatisticsData {
    /**
     * The lowest value in the column.
     */
    MinimumValue?: Long;
    /**
     * The highest value in the column.
     */
    MaximumValue?: Long;
    /**
     * The number of null values in the column.
     */
    NumberOfNulls: NonNegativeLong;
    /**
     * The number of distinct values in a column.
     */
    NumberOfDistinctValues: NonNegativeLong;
  }
  export type LongValue = number;
  export interface MLTransform {
    /**
     * The unique transform ID that is generated for the machine learning transform. The ID is guaranteed to be unique and does not change.
     */
    TransformId?: HashString;
    /**
     * A user-defined name for the machine learning transform. Names are not guaranteed unique and can be changed at any time.
     */
    Name?: NameString;
    /**
     * A user-defined, long-form description text for the machine learning transform. Descriptions are not guaranteed to be unique and can be changed at any time.
     */
    Description?: DescriptionString;
    /**
     * The current status of the machine learning transform.
     */
    Status?: TransformStatusType;
    /**
     * A timestamp. The time and date that this machine learning transform was created.
     */
    CreatedOn?: Timestamp;
    /**
     * A timestamp. The last point in time when this machine learning transform was modified.
     */
    LastModifiedOn?: Timestamp;
    /**
     * A list of Glue table definitions used by the transform.
     */
    InputRecordTables?: GlueTables;
    /**
     * A TransformParameters object. You can use parameters to tune (customize) the behavior of the machine learning transform by specifying what data it learns from and your preference on various tradeoffs (such as precious vs. recall, or accuracy vs. cost).
     */
    Parameters?: TransformParameters;
    /**
     * An EvaluationMetrics object. Evaluation metrics provide an estimate of the quality of your machine learning transform.
     */
    EvaluationMetrics?: EvaluationMetrics;
    /**
     * A count identifier for the labeling files generated by Glue for this transform. As you create a better transform, you can iteratively download, label, and upload the labeling file.
     */
    LabelCount?: LabelCount;
    /**
     * A map of key-value pairs representing the columns and data types that this transform can run against. Has an upper bound of 100 columns.
     */
    Schema?: TransformSchema;
    /**
     * The name or Amazon Resource Name (ARN) of the IAM role with the required permissions. The required permissions include both Glue service role permissions to Glue resources, and Amazon S3 permissions required by the transform.    This role needs Glue service role permissions to allow access to resources in Glue. See Attach a Policy to IAM Users That Access Glue.   This role needs permission to your Amazon Simple Storage Service (Amazon S3) sources, targets, temporary directory, scripts, and any libraries used by the task run for this transform.  
     */
    Role?: RoleString;
    /**
     * This value determines which version of Glue this machine learning transform is compatible with. Glue 1.0 is recommended for most customers. If the value is not set, the Glue compatibility defaults to Glue 0.9. For more information, see Glue Versions in the developer guide.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of Glue data processing units (DPUs) that are allocated to task runs for this transform. You can allocate from 2 to 100 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.   MaxCapacity is a mutually exclusive option with NumberOfWorkers and WorkerType.   If either NumberOfWorkers or WorkerType is set, then MaxCapacity cannot be set.   If MaxCapacity is set then neither NumberOfWorkers or WorkerType can be set.   If WorkerType is set, then NumberOfWorkers is required (and vice versa).    MaxCapacity and NumberOfWorkers must both be at least 1.   When the WorkerType field is set to a value other than Standard, the MaxCapacity field is set automatically and becomes read-only.
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when a task of this transform runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker provides 4 vCPU, 16 GB of memory and a 64GB disk, and 1 executor per worker.   For the G.2X worker type, each worker provides 8 vCPU, 32 GB of memory and a 128GB disk, and 1 executor per worker.    MaxCapacity is a mutually exclusive option with NumberOfWorkers and WorkerType.   If either NumberOfWorkers or WorkerType is set, then MaxCapacity cannot be set.   If MaxCapacity is set then neither NumberOfWorkers or WorkerType can be set.   If WorkerType is set, then NumberOfWorkers is required (and vice versa).    MaxCapacity and NumberOfWorkers must both be at least 1.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a task of the transform runs. If WorkerType is set, then NumberOfWorkers is required (and vice versa).
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The timeout in minutes of the machine learning transform.
     */
    Timeout?: Timeout;
    /**
     * The maximum number of times to retry after an MLTaskRun of the machine learning transform fails.
     */
    MaxRetries?: NullableInteger;
    /**
     * The encryption-at-rest settings of the transform that apply to accessing user data. Machine learning transforms can access user data encrypted in Amazon S3 using KMS.
     */
    TransformEncryption?: TransformEncryption;
  }
  export interface MLUserDataEncryption {
    /**
     * The encryption mode applied to user data. Valid values are:   DISABLED: encryption is disabled   SSEKMS: use of server-side encryption with Key Management Service (SSE-KMS) for user data stored in Amazon S3.  
     */
    MlUserDataEncryptionMode: MLUserDataEncryptionModeString;
    /**
     * The ID for the customer-provided KMS key.
     */
    KmsKeyId?: NameString;
  }
  export type MLUserDataEncryptionModeString = "DISABLED"|"SSE-KMS"|string;
  export type ManyInputs = NodeId[];
  export type MapValue = {[key: string]: GenericString};
  export interface Mapping {
    /**
     * After the apply mapping, what the name of the column should be. Can be the same as FromPath.
     */
    ToKey?: EnclosedInStringProperty;
    /**
     * The table or column to be modified.
     */
    FromPath?: EnclosedInStringProperties;
    /**
     * The type of the data to be modified.
     */
    FromType?: EnclosedInStringProperty;
    /**
     * The data type that the data is to be modified to.
     */
    ToType?: EnclosedInStringProperty;
    /**
     * If true, then the column is removed.
     */
    Dropped?: BoxedBoolean;
    /**
     * Only applicable to nested data structures. If you want to change the parent structure, but also one of its children, you can fill out this data strucutre. It is also Mapping, but its FromPath will be the parent's FromPath plus the FromPath from this structure. For the children part, suppose you have the structure:  { "FromPath": "OuterStructure", "ToKey": "OuterStructure", "ToType": "Struct", "Dropped": false, "Chidlren": [{ "FromPath": "inner", "ToKey": "inner", "ToType": "Double", "Dropped": false, }] }  You can specify a Mapping that looks like:  { "FromPath": "OuterStructure", "ToKey": "OuterStructure", "ToType": "Struct", "Dropped": false, "Chidlren": [{ "FromPath": "inner", "ToKey": "inner", "ToType": "Double", "Dropped": false, }] } 
     */
    Children?: Mappings;
  }
  export interface MappingEntry {
    /**
     * The name of the source table.
     */
    SourceTable?: TableName;
    /**
     * The source path.
     */
    SourcePath?: SchemaPathString;
    /**
     * The source type.
     */
    SourceType?: FieldType;
    /**
     * The target table.
     */
    TargetTable?: TableName;
    /**
     * The target path.
     */
    TargetPath?: SchemaPathString;
    /**
     * The target type.
     */
    TargetType?: FieldType;
  }
  export type MappingList = MappingEntry[];
  export type Mappings = Mapping[];
  export type MaskValue = string;
  export type MatchCriteria = NameString[];
  export type MaxConcurrentRuns = number;
  export type MaxResultsNumber = number;
  export type MaxRetries = number;
  export interface Merge {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: TwoInputs;
    /**
     * The source DynamicFrame that will be merged with a staging DynamicFrame.
     */
    Source: NodeId;
    /**
     * The list of primary key fields to match records from the source and staging dynamic frames.
     */
    PrimaryKeys: GlueStudioPathList;
  }
  export type MessagePrefix = string;
  export type MessageString = string;
  export interface MetadataInfo {
    /**
     * The metadata key’s corresponding value.
     */
    MetadataValue?: MetadataValueString;
    /**
     * The time at which the entry was created.
     */
    CreatedTime?: CreatedTimestamp;
    /**
     * Other metadata belonging to the same metadata key.
     */
    OtherMetadataValueList?: OtherMetadataValueList;
  }
  export type MetadataInfoMap = {[key: string]: MetadataInfo};
  export type MetadataKeyString = string;
  export interface MetadataKeyValuePair {
    /**
     * A metadata key.
     */
    MetadataKey?: MetadataKeyString;
    /**
     * A metadata key’s corresponding value.
     */
    MetadataValue?: MetadataValueString;
  }
  export type MetadataList = MetadataKeyValuePair[];
  export type MetadataOperation = "CREATE"|string;
  export type MetadataValueString = string;
  export interface MicrosoftSQLServerCatalogSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
  }
  export interface MicrosoftSQLServerCatalogTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
  }
  export type MillisecondsCount = number;
  export interface MongoDBTarget {
    /**
     * The name of the connection to use to connect to the Amazon DocumentDB or MongoDB target.
     */
    ConnectionName?: ConnectionName;
    /**
     * The path of the Amazon DocumentDB or MongoDB target (database/collection).
     */
    Path?: Path;
    /**
     * Indicates whether to scan all the records, or to sample rows from the table. Scanning all the records can take a long time when the table is not a high throughput table. A value of true means to scan all records, while a value of false means to sample the records. If no value is specified, the value defaults to true.
     */
    ScanAll?: NullableBoolean;
  }
  export type MongoDBTargetList = MongoDBTarget[];
  export interface MySQLCatalogSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
  }
  export interface MySQLCatalogTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
  }
  export type NameString = string;
  export type NameStringList = NameString[];
  export interface Node {
    /**
     * The type of Glue component represented by the node.
     */
    Type?: NodeType;
    /**
     * The name of the Glue component represented by the node.
     */
    Name?: NameString;
    /**
     * The unique Id assigned to the node within the workflow.
     */
    UniqueId?: NameString;
    /**
     * Details of the Trigger when the node represents a Trigger.
     */
    TriggerDetails?: TriggerNodeDetails;
    /**
     * Details of the Job when the node represents a Job.
     */
    JobDetails?: JobNodeDetails;
    /**
     * Details of the crawler when the node represents a crawler.
     */
    CrawlerDetails?: CrawlerNodeDetails;
  }
  export type NodeId = string;
  export type NodeIdList = NameString[];
  export type NodeList = Node[];
  export type NodeName = string;
  export type NodeType = "CRAWLER"|"JOB"|"TRIGGER"|string;
  export type NonNegativeDouble = number;
  export type NonNegativeInt = number;
  export type NonNegativeInteger = number;
  export type NonNegativeLong = number;
  export interface NotificationProperty {
    /**
     * After a job run starts, the number of minutes to wait before sending a job run delay notification.
     */
    NotifyDelayAfter?: NotifyDelayAfter;
  }
  export type NotifyDelayAfter = number;
  export interface NullCheckBoxList {
    /**
     * Specifies that an empty string is considered as a null value.
     */
    IsEmpty?: BoxedBoolean;
    /**
     * Specifies that a value spelling out the word 'null' is considered as a null value.
     */
    IsNullString?: BoxedBoolean;
    /**
     * Specifies that an integer value of -1 is considered as a null value.
     */
    IsNegOne?: BoxedBoolean;
  }
  export interface NullValueField {
    /**
     * The value of the null placeholder.
     */
    Value: EnclosedInStringProperty;
    /**
     * The datatype of the value.
     */
    Datatype: Datatype;
  }
  export type NullValueFields = NullValueField[];
  export type NullableBoolean = boolean;
  export type NullableDouble = number;
  export type NullableInteger = number;
  export type OneInput = NodeId[];
  export interface OpenTableFormatInput {
    /**
     * Specifies an IcebergInput structure that defines an Apache Iceberg metadata table.
     */
    IcebergInput?: IcebergInput;
  }
  export interface Option {
    /**
     * Specifies the value of the option.
     */
    Value?: EnclosedInStringProperty;
    /**
     * Specifies the label of the option.
     */
    Label?: EnclosedInStringProperty;
    /**
     * Specifies the description of the option.
     */
    Description?: EnclosedInStringProperty;
  }
  export type OptionList = Option[];
  export interface OracleSQLCatalogSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
  }
  export interface OracleSQLCatalogTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
  }
  export type OrchestrationArgumentsMap = {[key: string]: OrchestrationArgumentsValue};
  export type OrchestrationArgumentsValue = string;
  export type OrchestrationIAMRoleArn = string;
  export type OrchestrationNameString = string;
  export type OrchestrationRoleArn = string;
  export type OrchestrationS3Location = string;
  export type OrchestrationStatementCodeString = string;
  export type OrchestrationStringList = GenericString[];
  export type OrchestrationToken = string;
  export interface Order {
    /**
     * The name of the column.
     */
    Column: NameString;
    /**
     * Indicates that the column is sorted in ascending order (== 1), or in descending order (==0).
     */
    SortOrder: IntegerFlag;
  }
  export type OrderList = Order[];
  export type OtherMetadataValueList = OtherMetadataValueListItem[];
  export interface OtherMetadataValueListItem {
    /**
     * The metadata key’s corresponding value for the other metadata belonging to the same metadata key.
     */
    MetadataValue?: MetadataValueString;
    /**
     * The time at which the entry was created.
     */
    CreatedTime?: CreatedTimestamp;
  }
  export interface PIIDetection {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The node ID inputs to the transform.
     */
    Inputs: OneInput;
    /**
     * Indicates the type of PIIDetection transform. 
     */
    PiiType: PiiType;
    /**
     * Indicates the types of entities the PIIDetection transform will identify as PII data.   PII type entities include: PERSON_NAME, DATE, USA_SNN, EMAIL, USA_ITIN, USA_PASSPORT_NUMBER, PHONE_NUMBER, BANK_ACCOUNT, IP_ADDRESS, MAC_ADDRESS, USA_CPT_CODE, USA_HCPCS_CODE, USA_NATIONAL_DRUG_CODE, USA_MEDICARE_BENEFICIARY_IDENTIFIER, USA_HEALTH_INSURANCE_CLAIM_NUMBER,CREDIT_CARD,USA_NATIONAL_PROVIDER_IDENTIFIER,USA_DEA_NUMBER,USA_DRIVING_LICENSE 
     */
    EntityTypesToDetect: EnclosedInStringProperties;
    /**
     * Indicates the output column name that will contain any entity type detected in that row. 
     */
    OutputColumnName?: EnclosedInStringProperty;
    /**
     * Indicates the fraction of the data to sample when scanning for PII entities. 
     */
    SampleFraction?: BoxedDoubleFraction;
    /**
     * Indicates the fraction of the data that must be met in order for a column to be identified as PII data. 
     */
    ThresholdFraction?: BoxedDoubleFraction;
    /**
     * Indicates the value that will replace the detected entity. 
     */
    MaskValue?: MaskValue;
  }
  export type PageSize = number;
  export type PaginationToken = string;
  export type ParamType = "str"|"int"|"float"|"complex"|"bool"|"list"|"null"|string;
  export type ParametersMap = {[key: string]: ParametersMapValue};
  export type ParametersMapValue = string;
  export type ParquetCompressionType = "snappy"|"lzo"|"gzip"|"uncompressed"|"none"|string;
  export interface Partition {
    /**
     * The values of the partition.
     */
    Values?: ValueStringList;
    /**
     * The name of the catalog database in which to create the partition.
     */
    DatabaseName?: NameString;
    /**
     * The name of the database table in which to create the partition.
     */
    TableName?: NameString;
    /**
     * The time at which the partition was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time at which the partition was accessed.
     */
    LastAccessTime?: Timestamp;
    /**
     * Provides information about the physical location where the partition is stored.
     */
    StorageDescriptor?: StorageDescriptor;
    /**
     * These key-value pairs define partition parameters.
     */
    Parameters?: ParametersMap;
    /**
     * The last time at which column statistics were computed for this partition.
     */
    LastAnalyzedTime?: Timestamp;
    /**
     * The ID of the Data Catalog in which the partition resides.
     */
    CatalogId?: CatalogIdString;
  }
  export interface PartitionError {
    /**
     * The values that define the partition.
     */
    PartitionValues?: ValueStringList;
    /**
     * The details about the partition error.
     */
    ErrorDetail?: ErrorDetail;
  }
  export type PartitionErrors = PartitionError[];
  export interface PartitionIndex {
    /**
     * The keys for the partition index.
     */
    Keys: KeyList;
    /**
     * The name of the partition index.
     */
    IndexName: NameString;
  }
  export interface PartitionIndexDescriptor {
    /**
     * The name of the partition index.
     */
    IndexName: NameString;
    /**
     * A list of one or more keys, as KeySchemaElement structures, for the partition index.
     */
    Keys: KeySchemaElementList;
    /**
     * The status of the partition index.  The possible statuses are:   CREATING: The index is being created. When an index is in a CREATING state, the index or its table cannot be deleted.   ACTIVE: The index creation succeeds.   FAILED: The index creation fails.    DELETING: The index is deleted from the list of indexes.  
     */
    IndexStatus: PartitionIndexStatus;
    /**
     * A list of errors that can occur when registering partition indexes for an existing table.
     */
    BackfillErrors?: BackfillErrors;
  }
  export type PartitionIndexDescriptorList = PartitionIndexDescriptor[];
  export type PartitionIndexList = PartitionIndex[];
  export type PartitionIndexStatus = "CREATING"|"ACTIVE"|"DELETING"|"FAILED"|string;
  export interface PartitionInput {
    /**
     * The values of the partition. Although this parameter is not required by the SDK, you must specify this parameter for a valid input. The values for the keys for the new partition must be passed as an array of String objects that must be ordered in the same order as the partition keys appearing in the Amazon S3 prefix. Otherwise Glue will add the values to the wrong keys.
     */
    Values?: ValueStringList;
    /**
     * The last time at which the partition was accessed.
     */
    LastAccessTime?: Timestamp;
    /**
     * Provides information about the physical location where the partition is stored.
     */
    StorageDescriptor?: StorageDescriptor;
    /**
     * These key-value pairs define partition parameters.
     */
    Parameters?: ParametersMap;
    /**
     * The last time at which column statistics were computed for this partition.
     */
    LastAnalyzedTime?: Timestamp;
  }
  export type PartitionInputList = PartitionInput[];
  export type PartitionList = Partition[];
  export interface PartitionValueList {
    /**
     * The list of values.
     */
    Values: ValueStringList;
  }
  export type Path = string;
  export type PathList = Path[];
  export type Permission = "ALL"|"SELECT"|"ALTER"|"DROP"|"DELETE"|"INSERT"|"CREATE_DATABASE"|"CREATE_TABLE"|"DATA_LOCATION_ACCESS"|string;
  export type PermissionList = Permission[];
  export type PermissionType = "COLUMN_PERMISSION"|"CELL_FILTER_PERMISSION"|"NESTED_PERMISSION"|"NESTED_CELL_PERMISSION"|string;
  export type PermissionTypeList = PermissionType[];
  export interface PhysicalConnectionRequirements {
    /**
     * The subnet ID used by the connection.
     */
    SubnetId?: NameString;
    /**
     * The security group ID list used by the connection.
     */
    SecurityGroupIdList?: SecurityGroupIdList;
    /**
     * The connection's Availability Zone. This field is redundant because the specified subnet implies the Availability Zone to be used. Currently the field must be populated, but it will be deprecated in the future.
     */
    AvailabilityZone?: NameString;
  }
  export type PiiType = "RowAudit"|"RowMasking"|"ColumnAudit"|"ColumnMasking"|string;
  export type PolicyJsonString = string;
  export type PollingTime = number;
  export type PositiveLong = number;
  export interface PostgreSQLCatalogSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
  }
  export interface PostgreSQLCatalogTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
  }
  export interface Predecessor {
    /**
     * The name of the job definition used by the predecessor job run.
     */
    JobName?: NameString;
    /**
     * The job-run ID of the predecessor job run.
     */
    RunId?: IdString;
  }
  export type PredecessorList = Predecessor[];
  export interface Predicate {
    /**
     * An optional field if only one condition is listed. If multiple conditions are listed, then this field is required.
     */
    Logical?: Logical;
    /**
     * A list of the conditions that determine when the trigger will fire.
     */
    Conditions?: ConditionList;
  }
  export type PredicateString = string;
  export interface PrincipalPermissions {
    /**
     * The principal who is granted permissions.
     */
    Principal?: DataLakePrincipal;
    /**
     * The permissions that are granted to the principal.
     */
    Permissions?: PermissionList;
  }
  export type PrincipalPermissionsList = PrincipalPermissions[];
  export type PrincipalType = "USER"|"ROLE"|"GROUP"|string;
  export type Prob = number;
  export interface PropertyPredicate {
    /**
     * The key of the property.
     */
    Key?: ValueString;
    /**
     * The value of the property.
     */
    Value?: ValueString;
    /**
     * The comparator used to compare this property to others.
     */
    Comparator?: Comparator;
  }
  export type PublicKeysList = GenericString[];
  export interface PutDataCatalogEncryptionSettingsRequest {
    /**
     * The ID of the Data Catalog to set the security configuration for. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The security configuration to set.
     */
    DataCatalogEncryptionSettings: DataCatalogEncryptionSettings;
  }
  export interface PutDataCatalogEncryptionSettingsResponse {
  }
  export interface PutResourcePolicyRequest {
    /**
     * Contains the policy document to set, in JSON format.
     */
    PolicyInJson: PolicyJsonString;
    /**
     * Do not use. For internal use only.
     */
    ResourceArn?: GlueResourceArn;
    /**
     * The hash value returned when the previous policy was set using PutResourcePolicy. Its purpose is to prevent concurrent modifications of a policy. Do not use this parameter if no previous policy has been set.
     */
    PolicyHashCondition?: HashString;
    /**
     * A value of MUST_EXIST is used to update a policy. A value of NOT_EXIST is used to create a new policy. If a value of NONE or a null value is used, the call does not depend on the existence of a policy.
     */
    PolicyExistsCondition?: ExistCondition;
    /**
     * If 'TRUE', indicates that you are using both methods to grant cross-account access to Data Catalog resources:   By directly updating the resource policy with PutResourePolicy    By using the Grant permissions command on the Amazon Web Services Management Console.   Must be set to 'TRUE' if you have already used the Management Console to grant cross-account access, otherwise the call fails. Default is 'FALSE'.
     */
    EnableHybrid?: EnableHybridValues;
  }
  export interface PutResourcePolicyResponse {
    /**
     * A hash of the policy that has just been set. This must be included in a subsequent call that overwrites or updates this policy.
     */
    PolicyHash?: HashString;
  }
  export interface PutSchemaVersionMetadataInput {
    /**
     * The unique ID for the schema.
     */
    SchemaId?: SchemaId;
    /**
     * The version number of the schema.
     */
    SchemaVersionNumber?: SchemaVersionNumber;
    /**
     * The unique version ID of the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The metadata key's corresponding value.
     */
    MetadataKeyValue: MetadataKeyValuePair;
  }
  export interface PutSchemaVersionMetadataResponse {
    /**
     * The Amazon Resource Name (ARN) for the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * The name for the schema.
     */
    SchemaName?: SchemaRegistryNameString;
    /**
     * The name for the registry.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The latest version of the schema.
     */
    LatestVersion?: LatestSchemaVersionBoolean;
    /**
     * The version number of the schema.
     */
    VersionNumber?: VersionLongNumber;
    /**
     * The unique version ID of the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The metadata key.
     */
    MetadataKey?: MetadataKeyString;
    /**
     * The value of the metadata key.
     */
    MetadataValue?: MetadataValueString;
  }
  export interface PutWorkflowRunPropertiesRequest {
    /**
     * Name of the workflow which was run.
     */
    Name: NameString;
    /**
     * The ID of the workflow run for which the run properties should be updated.
     */
    RunId: IdString;
    /**
     * The properties to put for the specified run.
     */
    RunProperties: WorkflowRunProperties;
  }
  export interface PutWorkflowRunPropertiesResponse {
  }
  export type PythonScript = string;
  export type PythonVersionString = string;
  export interface QuerySchemaVersionMetadataInput {
    /**
     * A wrapper structure that may contain the schema name and Amazon Resource Name (ARN).
     */
    SchemaId?: SchemaId;
    /**
     * The version number of the schema.
     */
    SchemaVersionNumber?: SchemaVersionNumber;
    /**
     * The unique version ID of the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * Search key-value pairs for metadata, if they are not provided all the metadata information will be fetched.
     */
    MetadataList?: MetadataList;
    /**
     * Maximum number of results required per page. If the value is not supplied, this will be defaulted to 25 per page.
     */
    MaxResults?: QuerySchemaVersionMetadataMaxResults;
    /**
     * A continuation token, if this is a continuation call.
     */
    NextToken?: SchemaRegistryTokenString;
  }
  export type QuerySchemaVersionMetadataMaxResults = number;
  export interface QuerySchemaVersionMetadataResponse {
    /**
     * A map of a metadata key and associated values.
     */
    MetadataInfoMap?: MetadataInfoMap;
    /**
     * The unique version ID of the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * A continuation token for paginating the returned list of tokens, returned if the current segment of the list is not the last.
     */
    NextToken?: SchemaRegistryTokenString;
  }
  export type QuoteChar = "quote"|"quillemet"|"single_quote"|"disabled"|string;
  export interface Recipe {
    /**
     * The name of the Glue Studio node.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the recipe node, identified by id.
     */
    Inputs: OneInput;
    /**
     * A reference to the DataBrew recipe used by the node.
     */
    RecipeReference: RecipeReference;
  }
  export interface RecipeReference {
    /**
     * The ARN of the DataBrew recipe.
     */
    RecipeArn: EnclosedInStringProperty;
    /**
     * The RecipeVersion of the DataBrew recipe.
     */
    RecipeVersion: RecipeVersion;
  }
  export type RecipeVersion = string;
  export type RecordsCount = number;
  export type RecrawlBehavior = "CRAWL_EVERYTHING"|"CRAWL_NEW_FOLDERS_ONLY"|"CRAWL_EVENT_MODE"|string;
  export interface RecrawlPolicy {
    /**
     * Specifies whether to crawl the entire dataset again or to crawl only folders that were added since the last crawler run. A value of CRAWL_EVERYTHING specifies crawling the entire dataset again. A value of CRAWL_NEW_FOLDERS_ONLY specifies crawling only folders that were added since the last crawler run. A value of CRAWL_EVENT_MODE specifies crawling only the changes identified by Amazon S3 events.
     */
    RecrawlBehavior?: RecrawlBehavior;
  }
  export interface RedshiftSource {
    /**
     * The name of the Amazon Redshift data store.
     */
    Name: NodeName;
    /**
     * The database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The database table to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * The Amazon S3 path where temporary data can be staged when copying out of the database.
     */
    RedshiftTmpDir?: EnclosedInStringProperty;
    /**
     * The IAM role with permissions.
     */
    TmpDirIAMRole?: EnclosedInStringProperty;
  }
  export interface RedshiftTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
    /**
     * The Amazon S3 path where temporary data can be staged when copying out of the database.
     */
    RedshiftTmpDir?: EnclosedInStringProperty;
    /**
     * The IAM role with permissions.
     */
    TmpDirIAMRole?: EnclosedInStringProperty;
    /**
     * The set of options to configure an upsert operation when writing to a Redshift target.
     */
    UpsertRedshiftOptions?: UpsertRedshiftTargetOptions;
  }
  export interface RegisterSchemaVersionInput {
    /**
     * This is a wrapper structure to contain schema identity fields. The structure contains:   SchemaId$SchemaArn: The Amazon Resource Name (ARN) of the schema. Either SchemaArn or SchemaName and RegistryName has to be provided.   SchemaId$SchemaName: The name of the schema. Either SchemaArn or SchemaName and RegistryName has to be provided.  
     */
    SchemaId: SchemaId;
    /**
     * The schema definition using the DataFormat setting for the SchemaName.
     */
    SchemaDefinition: SchemaDefinitionString;
  }
  export interface RegisterSchemaVersionResponse {
    /**
     * The unique ID that represents the version of this schema.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The version of this schema (for sync flow only, in case this is the first version).
     */
    VersionNumber?: VersionLongNumber;
    /**
     * The status of the schema version.
     */
    Status?: SchemaVersionStatus;
  }
  export interface RegistryId {
    /**
     * Name of the registry. Used only for lookup. One of RegistryArn or RegistryName has to be provided. 
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * Arn of the registry to be updated. One of RegistryArn or RegistryName has to be provided.
     */
    RegistryArn?: GlueResourceArn;
  }
  export type RegistryListDefinition = RegistryListItem[];
  export interface RegistryListItem {
    /**
     * The name of the registry.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource Name (ARN) of the registry.
     */
    RegistryArn?: GlueResourceArn;
    /**
     * A description of the registry.
     */
    Description?: DescriptionString;
    /**
     * The status of the registry.
     */
    Status?: RegistryStatus;
    /**
     * The data the registry was created.
     */
    CreatedTime?: CreatedTimestamp;
    /**
     * The date the registry was updated.
     */
    UpdatedTime?: UpdatedTimestamp;
  }
  export type RegistryStatus = "AVAILABLE"|"DELETING"|string;
  export interface RelationalCatalogSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
  }
  export interface RemoveSchemaVersionMetadataInput {
    /**
     * A wrapper structure that may contain the schema name and Amazon Resource Name (ARN).
     */
    SchemaId?: SchemaId;
    /**
     * The version number of the schema.
     */
    SchemaVersionNumber?: SchemaVersionNumber;
    /**
     * The unique version ID of the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The value of the metadata key.
     */
    MetadataKeyValue: MetadataKeyValuePair;
  }
  export interface RemoveSchemaVersionMetadataResponse {
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * The name of the schema.
     */
    SchemaName?: SchemaRegistryNameString;
    /**
     * The name of the registry.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The latest version of the schema.
     */
    LatestVersion?: LatestSchemaVersionBoolean;
    /**
     * The version number of the schema.
     */
    VersionNumber?: VersionLongNumber;
    /**
     * The version ID for the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The metadata key.
     */
    MetadataKey?: MetadataKeyString;
    /**
     * The value of the metadata key.
     */
    MetadataValue?: MetadataValueString;
  }
  export interface RenameField {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * A JSON path to a variable in the data structure for the source data.
     */
    SourcePath: EnclosedInStringProperties;
    /**
     * A JSON path to a variable in the data structure for the target data.
     */
    TargetPath: EnclosedInStringProperties;
  }
  export type ReplaceBoolean = boolean;
  export interface ResetJobBookmarkRequest {
    /**
     * The name of the job in question.
     */
    JobName: JobName;
    /**
     * The unique run identifier associated with this job run.
     */
    RunId?: RunId;
  }
  export interface ResetJobBookmarkResponse {
    /**
     * The reset bookmark entry.
     */
    JobBookmarkEntry?: JobBookmarkEntry;
  }
  export type ResourceShareType = "FOREIGN"|"ALL"|"FEDERATED"|string;
  export type ResourceType = "JAR"|"FILE"|"ARCHIVE"|string;
  export interface ResourceUri {
    /**
     * The type of the resource.
     */
    ResourceType?: ResourceType;
    /**
     * The URI for accessing the resource.
     */
    Uri?: URI;
  }
  export type ResourceUriList = ResourceUri[];
  export interface ResumeWorkflowRunRequest {
    /**
     * The name of the workflow to resume.
     */
    Name: NameString;
    /**
     * The ID of the workflow run to resume.
     */
    RunId: IdString;
    /**
     * A list of the node IDs for the nodes you want to restart. The nodes that are to be restarted must have a run attempt in the original run.
     */
    NodeIds: NodeIdList;
  }
  export interface ResumeWorkflowRunResponse {
    /**
     * The new ID assigned to the resumed workflow run. Each resume of a workflow run will have a new run ID.
     */
    RunId?: IdString;
    /**
     * A list of the node IDs for the nodes that were actually restarted.
     */
    NodeIds?: NodeIdList;
  }
  export type Role = string;
  export type RoleArn = string;
  export type RoleString = string;
  export type RowTag = string;
  export type RulesetNames = NameString[];
  export type RunId = string;
  export interface RunStatementRequest {
    /**
     * The Session Id of the statement to be run.
     */
    SessionId: NameString;
    /**
     * The statement code to be run.
     */
    Code: OrchestrationStatementCodeString;
    /**
     * The origin of the request.
     */
    RequestOrigin?: OrchestrationNameString;
  }
  export interface RunStatementResponse {
    /**
     * Returns the Id of the statement that was run.
     */
    Id?: IntegerValue;
  }
  export type RuntimeNameString = string;
  export interface S3CatalogDeltaSource {
    /**
     * The name of the Delta Lake data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * Specifies additional connection options.
     */
    AdditionalDeltaOptions?: AdditionalOptions;
    /**
     * Specifies the data schema for the Delta Lake source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface S3CatalogHudiSource {
    /**
     * The name of the Hudi data source.
     */
    Name: NodeName;
    /**
     * The name of the database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The name of the table in the database to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * Specifies additional connection options.
     */
    AdditionalHudiOptions?: AdditionalOptions;
    /**
     * Specifies the data schema for the Hudi source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface S3CatalogSource {
    /**
     * The name of the data store.
     */
    Name: NodeName;
    /**
     * The database to read from.
     */
    Database: EnclosedInStringProperty;
    /**
     * The database table to read from.
     */
    Table: EnclosedInStringProperty;
    /**
     * Partitions satisfying this predicate are deleted. Files within the retention period in these partitions are not deleted. Set to "" – empty by default.
     */
    PartitionPredicate?: EnclosedInStringProperty;
    /**
     * Specifies additional connection options.
     */
    AdditionalOptions?: S3SourceAdditionalOptions;
  }
  export interface S3CatalogTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * Specifies native partitioning using a sequence of keys.
     */
    PartitionKeys?: GlueStudioPathList;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * A policy that specifies update behavior for the crawler.
     */
    SchemaChangePolicy?: CatalogSchemaChangePolicy;
  }
  export interface S3CsvSource {
    /**
     * The name of the data store.
     */
    Name: NodeName;
    /**
     * A list of the Amazon S3 paths to read from.
     */
    Paths: EnclosedInStringProperties;
    /**
     * Specifies how the data is compressed. This is generally not necessary if the data has a standard file extension. Possible values are "gzip" and "bzip").
     */
    CompressionType?: CompressionType;
    /**
     * A string containing a JSON list of Unix-style glob patterns to exclude. For example, "[\"**.pdf\"]" excludes all PDF files. 
     */
    Exclusions?: EnclosedInStringProperties;
    /**
     * The target group size in bytes. The default is computed based on the input data size and the size of your cluster. When there are fewer than 50,000 input files, "groupFiles" must be set to "inPartition" for this to take effect.
     */
    GroupSize?: EnclosedInStringProperty;
    /**
     * Grouping files is turned on by default when the input contains more than 50,000 files. To turn on grouping with fewer than 50,000 files, set this parameter to "inPartition". To disable grouping when there are more than 50,000 files, set this parameter to "none".
     */
    GroupFiles?: EnclosedInStringProperty;
    /**
     * If set to true, recursively reads files in all subdirectories under the specified paths.
     */
    Recurse?: BoxedBoolean;
    /**
     * This option controls the duration in milliseconds after which the s3 listing is likely to be consistent. Files with modification timestamps falling within the last maxBand milliseconds are tracked specially when using JobBookmarks to account for Amazon S3 eventual consistency. Most users don't need to set this option. The default is 900000 milliseconds, or 15 minutes.
     */
    MaxBand?: BoxedNonNegativeInt;
    /**
     * This option specifies the maximum number of files to save from the last maxBand seconds. If this number is exceeded, extra files are skipped and only processed in the next job run.
     */
    MaxFilesInBand?: BoxedNonNegativeInt;
    /**
     * Specifies additional connection options.
     */
    AdditionalOptions?: S3DirectSourceAdditionalOptions;
    /**
     * Specifies the delimiter character. The default is a comma: ",", but any other character can be specified.
     */
    Separator: Separator;
    /**
     * Specifies a character to use for escaping. This option is used only when reading CSV files. The default value is none. If enabled, the character which immediately follows is used as-is, except for a small set of well-known escapes (\n, \r, \t, and \0).
     */
    Escaper?: EnclosedInStringPropertyWithQuote;
    /**
     * Specifies the character to use for quoting. The default is a double quote: '"'. Set this to -1 to turn off quoting entirely.
     */
    QuoteChar: QuoteChar;
    /**
     * A Boolean value that specifies whether a single record can span multiple lines. This can occur when a field contains a quoted new-line character. You must set this option to True if any record spans multiple lines. The default value is False, which allows for more aggressive file-splitting during parsing.
     */
    Multiline?: BoxedBoolean;
    /**
     * A Boolean value that specifies whether to treat the first line as a header. The default value is False.
     */
    WithHeader?: BoxedBoolean;
    /**
     * A Boolean value that specifies whether to write the header to output. The default value is True. 
     */
    WriteHeader?: BoxedBoolean;
    /**
     * A Boolean value that specifies whether to skip the first data line. The default value is False.
     */
    SkipFirst?: BoxedBoolean;
    /**
     * A Boolean value that specifies whether to use the advanced SIMD CSV reader along with Apache Arrow based columnar memory formats. Only available in Glue version 3.0.
     */
    OptimizePerformance?: BooleanValue;
    /**
     * Specifies the data schema for the S3 CSV source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface S3DeltaCatalogTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * Specifies native partitioning using a sequence of keys.
     */
    PartitionKeys?: GlueStudioPathList;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * Specifies additional connection options for the connector.
     */
    AdditionalOptions?: AdditionalOptions;
    /**
     * A policy that specifies update behavior for the crawler.
     */
    SchemaChangePolicy?: CatalogSchemaChangePolicy;
  }
  export interface S3DeltaDirectTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * Specifies native partitioning using a sequence of keys.
     */
    PartitionKeys?: GlueStudioPathList;
    /**
     * The Amazon S3 path of your Delta Lake data source to write to.
     */
    Path: EnclosedInStringProperty;
    /**
     * Specifies how the data is compressed. This is generally not necessary if the data has a standard file extension. Possible values are "gzip" and "bzip").
     */
    Compression: DeltaTargetCompressionType;
    /**
     * Specifies the data output format for the target.
     */
    Format: TargetFormat;
    /**
     * Specifies additional connection options for the connector.
     */
    AdditionalOptions?: AdditionalOptions;
    /**
     * A policy that specifies update behavior for the crawler.
     */
    SchemaChangePolicy?: DirectSchemaChangePolicy;
  }
  export interface S3DeltaSource {
    /**
     * The name of the Delta Lake source.
     */
    Name: NodeName;
    /**
     * A list of the Amazon S3 paths to read from.
     */
    Paths: EnclosedInStringProperties;
    /**
     * Specifies additional connection options.
     */
    AdditionalDeltaOptions?: AdditionalOptions;
    /**
     * Specifies additional options for the connector.
     */
    AdditionalOptions?: S3DirectSourceAdditionalOptions;
    /**
     * Specifies the data schema for the Delta Lake source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface S3DirectSourceAdditionalOptions {
    /**
     * Sets the upper limit for the target size of the dataset in bytes that will be processed.
     */
    BoundedSize?: BoxedLong;
    /**
     * Sets the upper limit for the target number of files that will be processed.
     */
    BoundedFiles?: BoxedLong;
    /**
     * Sets option to enable a sample path.
     */
    EnableSamplePath?: BoxedBoolean;
    /**
     * If enabled, specifies the sample path.
     */
    SamplePath?: EnclosedInStringProperty;
  }
  export interface S3DirectTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * Specifies native partitioning using a sequence of keys.
     */
    PartitionKeys?: GlueStudioPathList;
    /**
     * A single Amazon S3 path to write to.
     */
    Path: EnclosedInStringProperty;
    /**
     * Specifies how the data is compressed. This is generally not necessary if the data has a standard file extension. Possible values are "gzip" and "bzip").
     */
    Compression?: EnclosedInStringProperty;
    /**
     * Specifies the data output format for the target.
     */
    Format: TargetFormat;
    /**
     * A policy that specifies update behavior for the crawler.
     */
    SchemaChangePolicy?: DirectSchemaChangePolicy;
  }
  export interface S3Encryption {
    /**
     * The encryption mode to use for Amazon S3 data.
     */
    S3EncryptionMode?: S3EncryptionMode;
    /**
     * The Amazon Resource Name (ARN) of the KMS key to be used to encrypt the data.
     */
    KmsKeyArn?: KmsKeyArn;
  }
  export type S3EncryptionList = S3Encryption[];
  export type S3EncryptionMode = "DISABLED"|"SSE-KMS"|"SSE-S3"|string;
  export interface S3GlueParquetTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * Specifies native partitioning using a sequence of keys.
     */
    PartitionKeys?: GlueStudioPathList;
    /**
     * A single Amazon S3 path to write to.
     */
    Path: EnclosedInStringProperty;
    /**
     * Specifies how the data is compressed. This is generally not necessary if the data has a standard file extension. Possible values are "gzip" and "bzip").
     */
    Compression?: ParquetCompressionType;
    /**
     * A policy that specifies update behavior for the crawler.
     */
    SchemaChangePolicy?: DirectSchemaChangePolicy;
  }
  export interface S3HudiCatalogTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * Specifies native partitioning using a sequence of keys.
     */
    PartitionKeys?: GlueStudioPathList;
    /**
     * The name of the table in the database to write to.
     */
    Table: EnclosedInStringProperty;
    /**
     * The name of the database to write to.
     */
    Database: EnclosedInStringProperty;
    /**
     * Specifies additional connection options for the connector.
     */
    AdditionalOptions: AdditionalOptions;
    /**
     * A policy that specifies update behavior for the crawler.
     */
    SchemaChangePolicy?: CatalogSchemaChangePolicy;
  }
  export interface S3HudiDirectTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The Amazon S3 path of your Hudi data source to write to.
     */
    Path: EnclosedInStringProperty;
    /**
     * Specifies how the data is compressed. This is generally not necessary if the data has a standard file extension. Possible values are "gzip" and "bzip").
     */
    Compression: HudiTargetCompressionType;
    /**
     * Specifies native partitioning using a sequence of keys.
     */
    PartitionKeys?: GlueStudioPathList;
    /**
     * Specifies the data output format for the target.
     */
    Format: TargetFormat;
    /**
     * Specifies additional connection options for the connector.
     */
    AdditionalOptions: AdditionalOptions;
    /**
     * A policy that specifies update behavior for the crawler.
     */
    SchemaChangePolicy?: DirectSchemaChangePolicy;
  }
  export interface S3HudiSource {
    /**
     * The name of the Hudi source.
     */
    Name: NodeName;
    /**
     * A list of the Amazon S3 paths to read from.
     */
    Paths: EnclosedInStringProperties;
    /**
     * Specifies additional connection options.
     */
    AdditionalHudiOptions?: AdditionalOptions;
    /**
     * Specifies additional options for the connector.
     */
    AdditionalOptions?: S3DirectSourceAdditionalOptions;
    /**
     * Specifies the data schema for the Hudi source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface S3JsonSource {
    /**
     * The name of the data store.
     */
    Name: NodeName;
    /**
     * A list of the Amazon S3 paths to read from.
     */
    Paths: EnclosedInStringProperties;
    /**
     * Specifies how the data is compressed. This is generally not necessary if the data has a standard file extension. Possible values are "gzip" and "bzip").
     */
    CompressionType?: CompressionType;
    /**
     * A string containing a JSON list of Unix-style glob patterns to exclude. For example, "[\"**.pdf\"]" excludes all PDF files. 
     */
    Exclusions?: EnclosedInStringProperties;
    /**
     * The target group size in bytes. The default is computed based on the input data size and the size of your cluster. When there are fewer than 50,000 input files, "groupFiles" must be set to "inPartition" for this to take effect.
     */
    GroupSize?: EnclosedInStringProperty;
    /**
     * Grouping files is turned on by default when the input contains more than 50,000 files. To turn on grouping with fewer than 50,000 files, set this parameter to "inPartition". To disable grouping when there are more than 50,000 files, set this parameter to "none".
     */
    GroupFiles?: EnclosedInStringProperty;
    /**
     * If set to true, recursively reads files in all subdirectories under the specified paths.
     */
    Recurse?: BoxedBoolean;
    /**
     * This option controls the duration in milliseconds after which the s3 listing is likely to be consistent. Files with modification timestamps falling within the last maxBand milliseconds are tracked specially when using JobBookmarks to account for Amazon S3 eventual consistency. Most users don't need to set this option. The default is 900000 milliseconds, or 15 minutes.
     */
    MaxBand?: BoxedNonNegativeInt;
    /**
     * This option specifies the maximum number of files to save from the last maxBand seconds. If this number is exceeded, extra files are skipped and only processed in the next job run.
     */
    MaxFilesInBand?: BoxedNonNegativeInt;
    /**
     * Specifies additional connection options.
     */
    AdditionalOptions?: S3DirectSourceAdditionalOptions;
    /**
     * A JsonPath string defining the JSON data.
     */
    JsonPath?: EnclosedInStringProperty;
    /**
     * A Boolean value that specifies whether a single record can span multiple lines. This can occur when a field contains a quoted new-line character. You must set this option to True if any record spans multiple lines. The default value is False, which allows for more aggressive file-splitting during parsing.
     */
    Multiline?: BoxedBoolean;
    /**
     * Specifies the data schema for the S3 JSON source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface S3ParquetSource {
    /**
     * The name of the data store.
     */
    Name: NodeName;
    /**
     * A list of the Amazon S3 paths to read from.
     */
    Paths: EnclosedInStringProperties;
    /**
     * Specifies how the data is compressed. This is generally not necessary if the data has a standard file extension. Possible values are "gzip" and "bzip").
     */
    CompressionType?: ParquetCompressionType;
    /**
     * A string containing a JSON list of Unix-style glob patterns to exclude. For example, "[\"**.pdf\"]" excludes all PDF files. 
     */
    Exclusions?: EnclosedInStringProperties;
    /**
     * The target group size in bytes. The default is computed based on the input data size and the size of your cluster. When there are fewer than 50,000 input files, "groupFiles" must be set to "inPartition" for this to take effect.
     */
    GroupSize?: EnclosedInStringProperty;
    /**
     * Grouping files is turned on by default when the input contains more than 50,000 files. To turn on grouping with fewer than 50,000 files, set this parameter to "inPartition". To disable grouping when there are more than 50,000 files, set this parameter to "none".
     */
    GroupFiles?: EnclosedInStringProperty;
    /**
     * If set to true, recursively reads files in all subdirectories under the specified paths.
     */
    Recurse?: BoxedBoolean;
    /**
     * This option controls the duration in milliseconds after which the s3 listing is likely to be consistent. Files with modification timestamps falling within the last maxBand milliseconds are tracked specially when using JobBookmarks to account for Amazon S3 eventual consistency. Most users don't need to set this option. The default is 900000 milliseconds, or 15 minutes.
     */
    MaxBand?: BoxedNonNegativeInt;
    /**
     * This option specifies the maximum number of files to save from the last maxBand seconds. If this number is exceeded, extra files are skipped and only processed in the next job run.
     */
    MaxFilesInBand?: BoxedNonNegativeInt;
    /**
     * Specifies additional connection options.
     */
    AdditionalOptions?: S3DirectSourceAdditionalOptions;
    /**
     * Specifies the data schema for the S3 Parquet source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface S3SourceAdditionalOptions {
    /**
     * Sets the upper limit for the target size of the dataset in bytes that will be processed.
     */
    BoundedSize?: BoxedLong;
    /**
     * Sets the upper limit for the target number of files that will be processed.
     */
    BoundedFiles?: BoxedLong;
  }
  export interface S3Target {
    /**
     * The path to the Amazon S3 target.
     */
    Path?: Path;
    /**
     * A list of glob patterns used to exclude from the crawl. For more information, see Catalog Tables with a Crawler.
     */
    Exclusions?: PathList;
    /**
     * The name of a connection which allows a job or crawler to access data in Amazon S3 within an Amazon Virtual Private Cloud environment (Amazon VPC).
     */
    ConnectionName?: ConnectionName;
    /**
     * Sets the number of files in each leaf folder to be crawled when crawling sample files in a dataset. If not set, all the files are crawled. A valid value is an integer between 1 and 249.
     */
    SampleSize?: NullableInteger;
    /**
     * A valid Amazon SQS ARN. For example, arn:aws:sqs:region:account:sqs.
     */
    EventQueueArn?: EventQueueArn;
    /**
     * A valid Amazon dead-letter SQS ARN. For example, arn:aws:sqs:region:account:deadLetterQueue.
     */
    DlqEventQueueArn?: EventQueueArn;
  }
  export type S3TargetList = S3Target[];
  export type ScalaCode = string;
  export interface Schedule {
    /**
     * A cron expression used to specify the schedule (see Time-Based Schedules for Jobs and Crawlers. For example, to run something every day at 12:15 UTC, you would specify: cron(15 12 * * ? *).
     */
    ScheduleExpression?: CronExpression;
    /**
     * The state of the schedule.
     */
    State?: ScheduleState;
  }
  export type ScheduleState = "SCHEDULED"|"NOT_SCHEDULED"|"TRANSITIONING"|string;
  export interface SchemaChangePolicy {
    /**
     * The update behavior when the crawler finds a changed schema.
     */
    UpdateBehavior?: UpdateBehavior;
    /**
     * The deletion behavior when the crawler finds a deleted object.
     */
    DeleteBehavior?: DeleteBehavior;
  }
  export type SchemaCheckpointNumber = number;
  export interface SchemaColumn {
    /**
     * The name of the column.
     */
    Name?: ColumnNameString;
    /**
     * The type of data in the column.
     */
    DataType?: ColumnTypeString;
  }
  export type SchemaDefinitionDiff = string;
  export type SchemaDefinitionString = string;
  export type SchemaDiffType = "SYNTAX_DIFF"|string;
  export interface SchemaId {
    /**
     * The Amazon Resource Name (ARN) of the schema. One of SchemaArn or SchemaName has to be provided.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * The name of the schema. One of SchemaArn or SchemaName has to be provided.
     */
    SchemaName?: SchemaRegistryNameString;
    /**
     * The name of the schema registry that contains the schema.
     */
    RegistryName?: SchemaRegistryNameString;
  }
  export type SchemaListDefinition = SchemaListItem[];
  export interface SchemaListItem {
    /**
     * the name of the registry where the schema resides.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The name of the schema.
     */
    SchemaName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource Name (ARN) for the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * A description for the schema.
     */
    Description?: DescriptionString;
    /**
     * The status of the schema.
     */
    SchemaStatus?: SchemaStatus;
    /**
     * The date and time that a schema was created.
     */
    CreatedTime?: CreatedTimestamp;
    /**
     * The date and time that a schema was updated.
     */
    UpdatedTime?: UpdatedTimestamp;
  }
  export type SchemaPathString = string;
  export interface SchemaReference {
    /**
     * A structure that contains schema identity fields. Either this or the SchemaVersionId has to be provided.
     */
    SchemaId?: SchemaId;
    /**
     * The unique ID assigned to a version of the schema. Either this or the SchemaId has to be provided.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The version number of the schema.
     */
    SchemaVersionNumber?: VersionLongNumber;
  }
  export type SchemaRegistryNameString = string;
  export type SchemaRegistryTokenString = string;
  export type SchemaStatus = "AVAILABLE"|"PENDING"|"DELETING"|string;
  export type SchemaValidationError = string;
  export interface SchemaVersionErrorItem {
    /**
     * The version number of the schema.
     */
    VersionNumber?: VersionLongNumber;
    /**
     * The details of the error for the schema version.
     */
    ErrorDetails?: ErrorDetails;
  }
  export type SchemaVersionErrorList = SchemaVersionErrorItem[];
  export type SchemaVersionIdString = string;
  export type SchemaVersionList = SchemaVersionListItem[];
  export interface SchemaVersionListItem {
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * The unique identifier of the schema version.
     */
    SchemaVersionId?: SchemaVersionIdString;
    /**
     * The version number of the schema.
     */
    VersionNumber?: VersionLongNumber;
    /**
     * The status of the schema version.
     */
    Status?: SchemaVersionStatus;
    /**
     * The date and time the schema version was created.
     */
    CreatedTime?: CreatedTimestamp;
  }
  export interface SchemaVersionNumber {
    /**
     * The latest version available for the schema.
     */
    LatestVersion?: LatestSchemaVersionBoolean;
    /**
     * The version number of the schema.
     */
    VersionNumber?: VersionLongNumber;
  }
  export type SchemaVersionStatus = "AVAILABLE"|"PENDING"|"FAILURE"|"DELETING"|string;
  export type ScriptLocationString = string;
  export type SearchPropertyPredicates = PropertyPredicate[];
  export interface SearchTablesRequest {
    /**
     * A unique identifier, consisting of  account_id .
     */
    CatalogId?: CatalogIdString;
    /**
     * A continuation token, included if this is a continuation call.
     */
    NextToken?: Token;
    /**
     * A list of key-value pairs, and a comparator used to filter the search results. Returns all entities matching the predicate. The Comparator member of the PropertyPredicate struct is used only for time fields, and can be omitted for other field types. Also, when comparing string values, such as when Key=Name, a fuzzy match algorithm is used. The Key field (for example, the value of the Name field) is split on certain punctuation characters, for example, -, :, #, etc. into tokens. Then each token is exact-match compared with the Value member of PropertyPredicate. For example, if Key=Name and Value=link, tables named customer-link and xx-link-yy are returned, but xxlinkyy is not returned.
     */
    Filters?: SearchPropertyPredicates;
    /**
     * A string used for a text search. Specifying a value in quotes filters based on an exact match to the value.
     */
    SearchText?: ValueString;
    /**
     * A list of criteria for sorting the results by a field name, in an ascending or descending order.
     */
    SortCriteria?: SortCriteria;
    /**
     * The maximum number of tables to return in a single response.
     */
    MaxResults?: PageSize;
    /**
     * Allows you to specify that you want to search the tables shared with your account. The allowable values are FOREIGN or ALL.    If set to FOREIGN, will search the tables shared with your account.    If set to ALL, will search the tables shared with your account, as well as the tables in yor local account.   
     */
    ResourceShareType?: ResourceShareType;
  }
  export interface SearchTablesResponse {
    /**
     * A continuation token, present if the current list segment is not the last.
     */
    NextToken?: Token;
    /**
     * A list of the requested Table objects. The SearchTables response returns only the tables that you have access to.
     */
    TableList?: TableList;
  }
  export interface SecurityConfiguration {
    /**
     * The name of the security configuration.
     */
    Name?: NameString;
    /**
     * The time at which this security configuration was created.
     */
    CreatedTimeStamp?: TimestampValue;
    /**
     * The encryption configuration associated with this security configuration.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
  }
  export type SecurityConfigurationList = SecurityConfiguration[];
  export type SecurityGroupIdList = NameString[];
  export interface Segment {
    /**
     * The zero-based index number of the segment. For example, if the total number of segments is 4, SegmentNumber values range from 0 through 3.
     */
    SegmentNumber: NonNegativeInteger;
    /**
     * The total number of segments.
     */
    TotalSegments: TotalSegmentsInteger;
  }
  export interface SelectFields {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * A JSON path to a variable in the data structure.
     */
    Paths: GlueStudioPathList;
  }
  export interface SelectFromCollection {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * The index for the DynamicFrame to be selected.
     */
    Index: NonNegativeInt;
  }
  export type Separator = "comma"|"ctrla"|"pipe"|"semicolon"|"tab"|string;
  export interface SerDeInfo {
    /**
     * Name of the SerDe.
     */
    Name?: NameString;
    /**
     * Usually the class that implements the SerDe. An example is org.apache.hadoop.hive.serde2.columnar.ColumnarSerDe.
     */
    SerializationLibrary?: NameString;
    /**
     * These key-value pairs define initialization parameters for the SerDe.
     */
    Parameters?: ParametersMap;
  }
  export interface Session {
    /**
     * The ID of the session.
     */
    Id?: NameString;
    /**
     * The time and date when the session was created.
     */
    CreatedOn?: TimestampValue;
    /**
     * The session status. 
     */
    Status?: SessionStatus;
    /**
     * The error message displayed during the session.
     */
    ErrorMessage?: DescriptionString;
    /**
     * The description of the session.
     */
    Description?: DescriptionString;
    /**
     * The name or Amazon Resource Name (ARN) of the IAM role associated with the Session.
     */
    Role?: OrchestrationRoleArn;
    /**
     * The command object.See SessionCommand.
     */
    Command?: SessionCommand;
    /**
     * A map array of key-value pairs. Max is 75 pairs. 
     */
    DefaultArguments?: OrchestrationArgumentsMap;
    /**
     * The number of connections used for the session.
     */
    Connections?: ConnectionsList;
    /**
     * The code execution progress of the session.
     */
    Progress?: DoubleValue;
    /**
     * The number of Glue data processing units (DPUs) that can be allocated when the job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB memory. 
     */
    MaxCapacity?: NullableDouble;
    /**
     * The name of the SecurityConfiguration structure to be used with the session.
     */
    SecurityConfiguration?: NameString;
    /**
     * The Glue version determines the versions of Apache Spark and Python that Glue supports. The GlueVersion must be greater than 2.0.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of workers of a defined WorkerType to use for the session.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The type of predefined worker that is allocated when a session runs. Accepts a value of G.1X, G.2X, G.4X, or G.8X for Spark sessions. Accepts the value Z.2X for Ray sessions.
     */
    WorkerType?: WorkerType;
    /**
     * The date and time that this session is completed.
     */
    CompletedOn?: TimestampValue;
    /**
     * The total time the session ran for.
     */
    ExecutionTime?: NullableDouble;
    /**
     * The DPUs consumed by the session (formula: ExecutionTime * MaxCapacity).
     */
    DPUSeconds?: NullableDouble;
    /**
     * The number of minutes when idle before the session times out.
     */
    IdleTimeout?: IdleTimeout;
  }
  export interface SessionCommand {
    /**
     * Specifies the name of the SessionCommand. Can be 'glueetl' or 'gluestreaming'.
     */
    Name?: NameString;
    /**
     * Specifies the Python version. The Python version indicates the version supported for jobs of type Spark.
     */
    PythonVersion?: PythonVersionString;
  }
  export type SessionIdList = NameString[];
  export type SessionList = Session[];
  export type SessionStatus = "PROVISIONING"|"READY"|"FAILED"|"TIMEOUT"|"STOPPING"|"STOPPED"|string;
  export interface SkewedInfo {
    /**
     * A list of names of columns that contain skewed values.
     */
    SkewedColumnNames?: NameStringList;
    /**
     * A list of values that appear so frequently as to be considered skewed.
     */
    SkewedColumnValues?: ColumnValueStringList;
    /**
     * A mapping of skewed values to the columns that contain them.
     */
    SkewedColumnValueLocationMaps?: LocationMap;
  }
  export interface SnowflakeNodeData {
    /**
     * Specifies how retrieved data is specified. Valid values: "table",  "query".
     */
    SourceType?: GenericLimitedString;
    /**
     * Specifies a Glue Data Catalog Connection to a Snowflake endpoint.
     */
    Connection?: Option;
    /**
     * Specifies a Snowflake database schema for your node to use.
     */
    Schema?: GenericString;
    /**
     * Specifies a Snowflake table for your node to use.
     */
    Table?: GenericString;
    /**
     * Specifies a Snowflake database for your node to use.
     */
    Database?: GenericString;
    /**
     * Not currently used.
     */
    TempDir?: EnclosedInStringProperty;
    /**
     * Not currently used.
     */
    IamRole?: Option;
    /**
     * Specifies additional options passed to the Snowflake connector. If options are specified elsewhere in this node, this will take precedence.
     */
    AdditionalOptions?: AdditionalOptions;
    /**
     * A SQL string used to retrieve data with the query sourcetype.
     */
    SampleQuery?: GenericString;
    /**
     * A SQL string run before the Snowflake connector performs its standard actions.
     */
    PreAction?: GenericString;
    /**
     * A SQL string run after the Snowflake connector performs its standard actions.
     */
    PostAction?: GenericString;
    /**
     * Specifies what action to take when writing to a table with preexisting data. Valid values:  append, merge, truncate, drop.
     */
    Action?: GenericString;
    /**
     * Used when Action is append. Specifies the resolution behavior when a row already exists. If true, preexisting rows will be updated. If false, those rows will be inserted.
     */
    Upsert?: BooleanValue;
    /**
     * Specifies a merge action. Valid values: simple, custom. If simple, merge behavior is defined by MergeWhenMatched and  MergeWhenNotMatched. If custom, defined by MergeClause.
     */
    MergeAction?: GenericLimitedString;
    /**
     * Specifies how to resolve records that match preexisting data when merging. Valid values:  update, delete.
     */
    MergeWhenMatched?: GenericLimitedString;
    /**
     * Specifies how to process records that do not match preexisting data when merging. Valid values: insert, none.
     */
    MergeWhenNotMatched?: GenericLimitedString;
    /**
     * A SQL statement that specifies a custom merge behavior.
     */
    MergeClause?: GenericString;
    /**
     * The name of a staging table used when performing merge or upsert append actions. Data is written to this table, then moved to table by a generated postaction.
     */
    StagingTable?: GenericString;
    /**
     * Specifies the columns combined to identify a record when detecting matches for merges and upserts. A list of structures with value, label and  description keys. Each structure describes a column.
     */
    SelectedColumns?: OptionList;
    /**
     * Specifies whether automatic query pushdown is enabled. If pushdown is enabled, then when a query is run on Spark, if part of the query can be "pushed down" to the Snowflake server, it is pushed down. This improves performance of some queries.
     */
    AutoPushdown?: BooleanValue;
    /**
     * Manually defines the target schema for the node. A list of structures with value , label and description keys. Each structure defines a column.
     */
    TableSchema?: OptionList;
  }
  export interface SnowflakeSource {
    /**
     * The name of the Snowflake data source.
     */
    Name: NodeName;
    /**
     * Configuration for the Snowflake data source.
     */
    Data: SnowflakeNodeData;
    /**
     * Specifies user-defined schemas for your output data.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface SnowflakeTarget {
    /**
     * The name of the Snowflake target.
     */
    Name: NodeName;
    /**
     * Specifies the data of the Snowflake target node.
     */
    Data: SnowflakeNodeData;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs?: OneInput;
  }
  export type Sort = "ASC"|"DESC"|string;
  export type SortCriteria = SortCriterion[];
  export interface SortCriterion {
    /**
     * The name of the field on which to sort.
     */
    FieldName?: ValueString;
    /**
     * An ascending or descending sort.
     */
    Sort?: Sort;
  }
  export type SortDirectionType = "DESCENDING"|"ASCENDING"|string;
  export type SourceControlAuthStrategy = "PERSONAL_ACCESS_TOKEN"|"AWS_SECRETS_MANAGER"|string;
  export interface SourceControlDetails {
    /**
     * The provider for the remote repository.
     */
    Provider?: SourceControlProvider;
    /**
     * The name of the remote repository that contains the job artifacts.
     */
    Repository?: Generic512CharString;
    /**
     * The owner of the remote repository that contains the job artifacts.
     */
    Owner?: Generic512CharString;
    /**
     * An optional branch in the remote repository.
     */
    Branch?: Generic512CharString;
    /**
     * An optional folder in the remote repository.
     */
    Folder?: Generic512CharString;
    /**
     * The last commit ID for a commit in the remote repository.
     */
    LastCommitId?: Generic512CharString;
    /**
     * The type of authentication, which can be an authentication token stored in Amazon Web Services Secrets Manager, or a personal access token.
     */
    AuthStrategy?: SourceControlAuthStrategy;
    /**
     * The value of an authorization token.
     */
    AuthToken?: Generic512CharString;
  }
  export type SourceControlProvider = "GITHUB"|"GITLAB"|"BITBUCKET"|"AWS_CODE_COMMIT"|string;
  export interface SparkConnectorSource {
    /**
     * The name of the data source.
     */
    Name: NodeName;
    /**
     * The name of the connection that is associated with the connector.
     */
    ConnectionName: EnclosedInStringProperty;
    /**
     * The name of a connector that assists with accessing the data store in Glue Studio.
     */
    ConnectorName: EnclosedInStringProperty;
    /**
     * The type of connection, such as marketplace.spark or custom.spark, designating a connection to an Apache Spark data store.
     */
    ConnectionType: EnclosedInStringProperty;
    /**
     * Additional connection options for the connector.
     */
    AdditionalOptions?: AdditionalOptions;
    /**
     * Specifies data schema for the custom spark source.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface SparkConnectorTarget {
    /**
     * The name of the data target.
     */
    Name: NodeName;
    /**
     * The nodes that are inputs to the data target.
     */
    Inputs: OneInput;
    /**
     * The name of a connection for an Apache Spark connector.
     */
    ConnectionName: EnclosedInStringProperty;
    /**
     * The name of an Apache Spark connector.
     */
    ConnectorName: EnclosedInStringProperty;
    /**
     * The type of connection, such as marketplace.spark or custom.spark, designating a connection to an Apache Spark data store.
     */
    ConnectionType: EnclosedInStringProperty;
    /**
     * Additional connection options for the connector.
     */
    AdditionalOptions?: AdditionalOptions;
    /**
     * Specifies the data schema for the custom spark target.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface SparkSQL {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names. You can associate a table name with each input node to use in the SQL query. The name you choose must meet the Spark SQL naming restrictions.
     */
    Inputs: ManyInputs;
    /**
     * A SQL query that must use Spark SQL syntax and return a single data set.
     */
    SqlQuery: SqlQuery;
    /**
     * A list of aliases. An alias allows you to specify what name to use in the SQL for a given input. For example, you have a datasource named "MyDataSource". If you specify From as MyDataSource, and Alias as SqlName, then in your SQL you can do:  select * from SqlName  and that gets data from MyDataSource.
     */
    SqlAliases: SqlAliases;
    /**
     * Specifies the data schema for the SparkSQL transform.
     */
    OutputSchemas?: GlueSchemas;
  }
  export interface Spigot {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * A path in Amazon S3 where the transform will write a subset of records from the dataset to a JSON file in an Amazon S3 bucket.
     */
    Path: EnclosedInStringProperty;
    /**
     * Specifies a number of records to write starting from the beginning of the dataset.
     */
    Topk?: Topk;
    /**
     * The probability (a decimal value with a maximum value of 1) of picking any given record. A value of 1 indicates that each row read from the dataset should be included in the sample output.
     */
    Prob?: Prob;
  }
  export interface SplitFields {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The data inputs identified by their node names.
     */
    Inputs: OneInput;
    /**
     * A JSON path to a variable in the data structure.
     */
    Paths: GlueStudioPathList;
  }
  export interface SqlAlias {
    /**
     * A table, or a column in a table.
     */
    From: NodeId;
    /**
     * A temporary name given to a table, or a column in a table.
     */
    Alias: EnclosedInStringPropertyWithQuote;
  }
  export type SqlAliases = SqlAlias[];
  export type SqlQuery = string;
  export interface StartBlueprintRunRequest {
    /**
     * The name of the blueprint.
     */
    BlueprintName: OrchestrationNameString;
    /**
     * Specifies the parameters as a BlueprintParameters object.
     */
    Parameters?: BlueprintParameters;
    /**
     * Specifies the IAM role used to create the workflow.
     */
    RoleArn: OrchestrationIAMRoleArn;
  }
  export interface StartBlueprintRunResponse {
    /**
     * The run ID for this blueprint run.
     */
    RunId?: IdString;
  }
  export interface StartCrawlerRequest {
    /**
     * Name of the crawler to start.
     */
    Name: NameString;
  }
  export interface StartCrawlerResponse {
  }
  export interface StartCrawlerScheduleRequest {
    /**
     * Name of the crawler to schedule.
     */
    CrawlerName: NameString;
  }
  export interface StartCrawlerScheduleResponse {
  }
  export interface StartDataQualityRuleRecommendationRunRequest {
    /**
     * The data source (Glue table) associated with this run.
     */
    DataSource: DataSource;
    /**
     * An IAM role supplied to encrypt the results of the run.
     */
    Role: RoleString;
    /**
     * The number of G.1X workers to be used in the run. The default is 5.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The timeout for a run in minutes. This is the maximum time that a run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * A name for the ruleset.
     */
    CreatedRulesetName?: NameString;
    /**
     * Used for idempotency and is recommended to be set to a random ID (such as a UUID) to avoid creating or starting multiple instances of the same resource.
     */
    ClientToken?: HashString;
  }
  export interface StartDataQualityRuleRecommendationRunResponse {
    /**
     * The unique run identifier associated with this run.
     */
    RunId?: HashString;
  }
  export interface StartDataQualityRulesetEvaluationRunRequest {
    /**
     * The data source (Glue table) associated with this run.
     */
    DataSource: DataSource;
    /**
     * An IAM role supplied to encrypt the results of the run.
     */
    Role: RoleString;
    /**
     * The number of G.1X workers to be used in the run. The default is 5.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The timeout for a run in minutes. This is the maximum time that a run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * Used for idempotency and is recommended to be set to a random ID (such as a UUID) to avoid creating or starting multiple instances of the same resource.
     */
    ClientToken?: HashString;
    /**
     * Additional run options you can specify for an evaluation run.
     */
    AdditionalRunOptions?: DataQualityEvaluationRunAdditionalRunOptions;
    /**
     * A list of ruleset names.
     */
    RulesetNames: RulesetNames;
    /**
     * A map of reference strings to additional data sources you can specify for an evaluation run.
     */
    AdditionalDataSources?: DataSourceMap;
  }
  export interface StartDataQualityRulesetEvaluationRunResponse {
    /**
     * The unique run identifier associated with this run.
     */
    RunId?: HashString;
  }
  export interface StartExportLabelsTaskRunRequest {
    /**
     * The unique identifier of the machine learning transform.
     */
    TransformId: HashString;
    /**
     * The Amazon S3 path where you export the labels.
     */
    OutputS3Path: UriString;
  }
  export interface StartExportLabelsTaskRunResponse {
    /**
     * The unique identifier for the task run.
     */
    TaskRunId?: HashString;
  }
  export interface StartImportLabelsTaskRunRequest {
    /**
     * The unique identifier of the machine learning transform.
     */
    TransformId: HashString;
    /**
     * The Amazon Simple Storage Service (Amazon S3) path from where you import the labels.
     */
    InputS3Path: UriString;
    /**
     * Indicates whether to overwrite your existing labels.
     */
    ReplaceAllLabels?: ReplaceBoolean;
  }
  export interface StartImportLabelsTaskRunResponse {
    /**
     * The unique identifier for the task run.
     */
    TaskRunId?: HashString;
  }
  export interface StartJobRunRequest {
    /**
     * The name of the job definition to use.
     */
    JobName: NameString;
    /**
     * The ID of a previous JobRun to retry.
     */
    JobRunId?: IdString;
    /**
     * The job arguments associated with this run. For this job run, they replace the default arguments set in the job definition itself. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. Job arguments may be logged. Do not pass plaintext secrets as arguments. Retrieve secrets from a Glue Connection, Secrets Manager or other secret management mechanism if you intend to keep them within the Job.  For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the arguments you can provide to this field when configuring Spark jobs, see the Special Parameters Used by Glue topic in the developer guide. For information about the arguments you can provide to this field when configuring Ray jobs, see Using job parameters in Ray jobs in the developer guide.
     */
    Arguments?: GenericMap;
    /**
     * This field is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) to allocate to this JobRun. You can allocate a minimum of 2 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The JobRun timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. This value overrides the timeout value set in the parent job. Streaming jobs do not have a timeout. The default for non-streaming jobs is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * For Glue version 1.0 or earlier jobs, using the standard worker type, the number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the  Glue pricing page. For Glue version 2.0+ jobs, you cannot specify a Maximum capacity. Instead, you should specify a Worker type and the Number of workers. Do not set MaxCapacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job, an Apache Spark ETL job, or an Apache Spark streaming ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl") or Apache Spark streaming ETL job (JobCommand.Name="gluestreaming"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.  
     */
    MaxCapacity?: NullableDouble;
    /**
     * The name of the SecurityConfiguration structure to be used with this job run.
     */
    SecurityConfiguration?: NameString;
    /**
     * Specifies configuration properties of a job run notification.
     */
    NotificationProperty?: NotificationProperty;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of G.1X, G.2X, G.4X, G.8X or G.025X for Spark jobs. Accepts the value Z.2X for Ray jobs.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPUs, 16 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPUs, 32 GB of memory) with 128GB disk (approximately 77GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.   For the G.4X worker type, each worker maps to 4 DPU (16 vCPUs, 64 GB of memory) with 256GB disk (approximately 235GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs in the following Amazon Web Services Regions: US East (Ohio), US East (N. Virginia), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Canada (Central), Europe (Frankfurt), Europe (Ireland), and Europe (Stockholm).   For the G.8X worker type, each worker maps to 8 DPU (32 vCPUs, 128 GB of memory) with 512GB disk (approximately 487GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for Glue version 3.0 or later Spark ETL jobs, in the same Amazon Web Services Regions as supported for the G.4X worker type.   For the G.025X worker type, each worker maps to 0.25 DPU (2 vCPUs, 4 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for low volume streaming jobs. This worker type is only available for Glue version 3.0 streaming jobs.   For the Z.2X worker type, each worker maps to 2 M-DPU (8vCPUs, 64 GB of memory) with 128 GB disk (approximately 120GB free), and provides up to 8 Ray workers based on the autoscaler.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * Indicates whether the job is run with a standard or flexible execution class. The standard execution-class is ideal for time-sensitive workloads that require fast job startup and dedicated resources. The flexible execution class is appropriate for time-insensitive jobs whose start and completion times may vary.  Only jobs with Glue version 3.0 and above and command type glueetl will be allowed to set ExecutionClass to FLEX. The flexible execution class is available for Spark jobs.
     */
    ExecutionClass?: ExecutionClass;
  }
  export interface StartJobRunResponse {
    /**
     * The ID assigned to this job run.
     */
    JobRunId?: IdString;
  }
  export interface StartMLEvaluationTaskRunRequest {
    /**
     * The unique identifier of the machine learning transform.
     */
    TransformId: HashString;
  }
  export interface StartMLEvaluationTaskRunResponse {
    /**
     * The unique identifier associated with this run.
     */
    TaskRunId?: HashString;
  }
  export interface StartMLLabelingSetGenerationTaskRunRequest {
    /**
     * The unique identifier of the machine learning transform.
     */
    TransformId: HashString;
    /**
     * The Amazon Simple Storage Service (Amazon S3) path where you generate the labeling set.
     */
    OutputS3Path: UriString;
  }
  export interface StartMLLabelingSetGenerationTaskRunResponse {
    /**
     * The unique run identifier that is associated with this task run.
     */
    TaskRunId?: HashString;
  }
  export interface StartTriggerRequest {
    /**
     * The name of the trigger to start.
     */
    Name: NameString;
  }
  export interface StartTriggerResponse {
    /**
     * The name of the trigger that was started.
     */
    Name?: NameString;
  }
  export interface StartWorkflowRunRequest {
    /**
     * The name of the workflow to start.
     */
    Name: NameString;
    /**
     * The workflow run properties for the new workflow run.
     */
    RunProperties?: WorkflowRunProperties;
  }
  export interface StartWorkflowRunResponse {
    /**
     * An Id for the new run.
     */
    RunId?: IdString;
  }
  export interface StartingEventBatchCondition {
    /**
     * Number of events in the batch.
     */
    BatchSize?: NullableInteger;
    /**
     * Duration of the batch window in seconds.
     */
    BatchWindow?: NullableInteger;
  }
  export type StartingPosition = "latest"|"trim_horizon"|"earliest"|"timestamp"|string;
  export interface Statement {
    /**
     * The ID of the statement.
     */
    Id?: IntegerValue;
    /**
     * The execution code of the statement.
     */
    Code?: GenericString;
    /**
     * The state while request is actioned.
     */
    State?: StatementState;
    /**
     * The output in JSON.
     */
    Output?: StatementOutput;
    /**
     * The code execution progress.
     */
    Progress?: DoubleValue;
    /**
     * The unix time and date that the job definition was started.
     */
    StartedOn?: LongValue;
    /**
     * The unix time and date that the job definition was completed.
     */
    CompletedOn?: LongValue;
  }
  export type StatementList = Statement[];
  export interface StatementOutput {
    /**
     * The code execution output.
     */
    Data?: StatementOutputData;
    /**
     * The execution count of the output.
     */
    ExecutionCount?: IntegerValue;
    /**
     * The status of the code execution output.
     */
    Status?: StatementState;
    /**
     * The name of the error in the output.
     */
    ErrorName?: GenericString;
    /**
     * The error value of the output.
     */
    ErrorValue?: GenericString;
    /**
     * The traceback of the output.
     */
    Traceback?: OrchestrationStringList;
  }
  export interface StatementOutputData {
    /**
     * The code execution output in text format.
     */
    TextPlain?: GenericString;
  }
  export type StatementState = "WAITING"|"RUNNING"|"AVAILABLE"|"CANCELLING"|"CANCELLED"|"ERROR"|string;
  export interface StopCrawlerRequest {
    /**
     * Name of the crawler to stop.
     */
    Name: NameString;
  }
  export interface StopCrawlerResponse {
  }
  export interface StopCrawlerScheduleRequest {
    /**
     * Name of the crawler whose schedule state to set.
     */
    CrawlerName: NameString;
  }
  export interface StopCrawlerScheduleResponse {
  }
  export interface StopSessionRequest {
    /**
     * The ID of the session to be stopped.
     */
    Id: NameString;
    /**
     * The origin of the request.
     */
    RequestOrigin?: OrchestrationNameString;
  }
  export interface StopSessionResponse {
    /**
     * Returns the Id of the stopped session.
     */
    Id?: NameString;
  }
  export interface StopTriggerRequest {
    /**
     * The name of the trigger to stop.
     */
    Name: NameString;
  }
  export interface StopTriggerResponse {
    /**
     * The name of the trigger that was stopped.
     */
    Name?: NameString;
  }
  export interface StopWorkflowRunRequest {
    /**
     * The name of the workflow to stop.
     */
    Name: NameString;
    /**
     * The ID of the workflow run to stop.
     */
    RunId: IdString;
  }
  export interface StopWorkflowRunResponse {
  }
  export interface StorageDescriptor {
    /**
     * A list of the Columns in the table.
     */
    Columns?: ColumnList;
    /**
     * The physical location of the table. By default, this takes the form of the warehouse location, followed by the database location in the warehouse, followed by the table name.
     */
    Location?: LocationString;
    /**
     * A list of locations that point to the path where a Delta table is located.
     */
    AdditionalLocations?: LocationStringList;
    /**
     * The input format: SequenceFileInputFormat (binary), or TextInputFormat, or a custom format.
     */
    InputFormat?: FormatString;
    /**
     * The output format: SequenceFileOutputFormat (binary), or IgnoreKeyTextOutputFormat, or a custom format.
     */
    OutputFormat?: FormatString;
    /**
     *  True if the data in the table is compressed, or False if not.
     */
    Compressed?: Boolean;
    /**
     * Must be specified if the table contains any dimension columns.
     */
    NumberOfBuckets?: Integer;
    /**
     * The serialization/deserialization (SerDe) information.
     */
    SerdeInfo?: SerDeInfo;
    /**
     * A list of reducer grouping columns, clustering columns, and bucketing columns in the table.
     */
    BucketColumns?: NameStringList;
    /**
     * A list specifying the sort order of each bucket in the table.
     */
    SortColumns?: OrderList;
    /**
     * The user-supplied properties in key-value form.
     */
    Parameters?: ParametersMap;
    /**
     * The information about values that appear frequently in a column (skewed values).
     */
    SkewedInfo?: SkewedInfo;
    /**
     *  True if the table data is stored in subdirectories, or False if not.
     */
    StoredAsSubDirectories?: Boolean;
    /**
     * An object that references a schema stored in the Glue Schema Registry. When creating a table, you can pass an empty list of columns for the schema, and instead use a schema reference.
     */
    SchemaReference?: SchemaReference;
  }
  export interface StreamingDataPreviewOptions {
    /**
     * The polling time in milliseconds.
     */
    PollingTime?: PollingTime;
    /**
     * The limit to the number of records polled.
     */
    RecordPollingLimit?: PositiveLong;
  }
  export interface StringColumnStatisticsData {
    /**
     * The size of the longest string in the column.
     */
    MaximumLength: NonNegativeLong;
    /**
     * The average string length in the column.
     */
    AverageLength: NonNegativeDouble;
    /**
     * The number of null values in the column.
     */
    NumberOfNulls: NonNegativeLong;
    /**
     * The number of distinct values in a column.
     */
    NumberOfDistinctValues: NonNegativeLong;
  }
  export type StringList = GenericString[];
  export interface Table {
    /**
     * The table name. For Hive compatibility, this must be entirely lowercase.
     */
    Name: NameString;
    /**
     * The name of the database where the table metadata resides. For Hive compatibility, this must be all lowercase.
     */
    DatabaseName?: NameString;
    /**
     * A description of the table.
     */
    Description?: DescriptionString;
    /**
     * The owner of the table.
     */
    Owner?: NameString;
    /**
     * The time when the table definition was created in the Data Catalog.
     */
    CreateTime?: Timestamp;
    /**
     * The last time that the table was updated.
     */
    UpdateTime?: Timestamp;
    /**
     * The last time that the table was accessed. This is usually taken from HDFS, and might not be reliable.
     */
    LastAccessTime?: Timestamp;
    /**
     * The last time that column statistics were computed for this table.
     */
    LastAnalyzedTime?: Timestamp;
    /**
     * The retention time for this table.
     */
    Retention?: NonNegativeInteger;
    /**
     * A storage descriptor containing information about the physical storage of this table.
     */
    StorageDescriptor?: StorageDescriptor;
    /**
     * A list of columns by which the table is partitioned. Only primitive types are supported as partition keys. When you create a table used by Amazon Athena, and you do not specify any partitionKeys, you must at least set the value of partitionKeys to an empty list. For example:  "PartitionKeys": [] 
     */
    PartitionKeys?: ColumnList;
    /**
     * Included for Apache Hive compatibility. Not used in the normal course of Glue operations. If the table is a VIRTUAL_VIEW, certain Athena configuration encoded in base64.
     */
    ViewOriginalText?: ViewTextString;
    /**
     * Included for Apache Hive compatibility. Not used in the normal course of Glue operations.
     */
    ViewExpandedText?: ViewTextString;
    /**
     * The type of this table. Glue will create tables with the EXTERNAL_TABLE type. Other services, such as Athena, may create tables with additional table types.  Glue related table types:  EXTERNAL_TABLE  Hive compatible attribute - indicates a non-Hive managed table.  GOVERNED  Used by Lake Formation. The Glue Data Catalog understands GOVERNED.  
     */
    TableType?: TableTypeString;
    /**
     * These key-value pairs define properties associated with the table.
     */
    Parameters?: ParametersMap;
    /**
     * The person or entity who created the table.
     */
    CreatedBy?: NameString;
    /**
     * Indicates whether the table has been registered with Lake Formation.
     */
    IsRegisteredWithLakeFormation?: Boolean;
    /**
     * A TableIdentifier structure that describes a target table for resource linking.
     */
    TargetTable?: TableIdentifier;
    /**
     * The ID of the Data Catalog in which the table resides.
     */
    CatalogId?: CatalogIdString;
    /**
     * The ID of the table version.
     */
    VersionId?: VersionString;
    /**
     * A FederatedTable structure that references an entity outside the Glue Data Catalog.
     */
    FederatedTable?: FederatedTable;
  }
  export interface TableError {
    /**
     * The name of the table. For Hive compatibility, this must be entirely lowercase.
     */
    TableName?: NameString;
    /**
     * The details about the error.
     */
    ErrorDetail?: ErrorDetail;
  }
  export type TableErrors = TableError[];
  export interface TableIdentifier {
    /**
     * The ID of the Data Catalog in which the table resides.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database that contains the target table.
     */
    DatabaseName?: NameString;
    /**
     * The name of the target table.
     */
    Name?: NameString;
    /**
     * Region of the target table.
     */
    Region?: NameString;
  }
  export interface TableInput {
    /**
     * The table name. For Hive compatibility, this is folded to lowercase when it is stored.
     */
    Name: NameString;
    /**
     * A description of the table.
     */
    Description?: DescriptionString;
    /**
     * The table owner. Included for Apache Hive compatibility. Not used in the normal course of Glue operations.
     */
    Owner?: NameString;
    /**
     * The last time that the table was accessed.
     */
    LastAccessTime?: Timestamp;
    /**
     * The last time that column statistics were computed for this table.
     */
    LastAnalyzedTime?: Timestamp;
    /**
     * The retention time for this table.
     */
    Retention?: NonNegativeInteger;
    /**
     * A storage descriptor containing information about the physical storage of this table.
     */
    StorageDescriptor?: StorageDescriptor;
    /**
     * A list of columns by which the table is partitioned. Only primitive types are supported as partition keys. When you create a table used by Amazon Athena, and you do not specify any partitionKeys, you must at least set the value of partitionKeys to an empty list. For example:  "PartitionKeys": [] 
     */
    PartitionKeys?: ColumnList;
    /**
     * Included for Apache Hive compatibility. Not used in the normal course of Glue operations. If the table is a VIRTUAL_VIEW, certain Athena configuration encoded in base64.
     */
    ViewOriginalText?: ViewTextString;
    /**
     * Included for Apache Hive compatibility. Not used in the normal course of Glue operations.
     */
    ViewExpandedText?: ViewTextString;
    /**
     * The type of this table. Glue will create tables with the EXTERNAL_TABLE type. Other services, such as Athena, may create tables with additional table types.  Glue related table types:  EXTERNAL_TABLE  Hive compatible attribute - indicates a non-Hive managed table.  GOVERNED  Used by Lake Formation. The Glue Data Catalog understands GOVERNED.  
     */
    TableType?: TableTypeString;
    /**
     * These key-value pairs define properties associated with the table.
     */
    Parameters?: ParametersMap;
    /**
     * A TableIdentifier structure that describes a target table for resource linking.
     */
    TargetTable?: TableIdentifier;
  }
  export type TableList = Table[];
  export type TableName = string;
  export type TablePrefix = string;
  export type TableTypeString = string;
  export interface TableVersion {
    /**
     * The table in question.
     */
    Table?: Table;
    /**
     * The ID value that identifies this table version. A VersionId is a string representation of an integer. Each version is incremented by 1.
     */
    VersionId?: VersionString;
  }
  export interface TableVersionError {
    /**
     * The name of the table in question.
     */
    TableName?: NameString;
    /**
     * The ID value of the version in question. A VersionID is a string representation of an integer. Each version is incremented by 1.
     */
    VersionId?: VersionString;
    /**
     * The details about the error.
     */
    ErrorDetail?: ErrorDetail;
  }
  export type TableVersionErrors = TableVersionError[];
  export type TagKey = string;
  export type TagKeysList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The ARN of the Glue resource to which to add the tags. For more information about Glue resource ARNs, see the Glue ARN string pattern.
     */
    ResourceArn: GlueResourceArn;
    /**
     * Tags to add to this resource.
     */
    TagsToAdd: TagsMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TagsMap = {[key: string]: TagValue};
  export type TargetFormat = "json"|"csv"|"avro"|"orc"|"parquet"|"hudi"|"delta"|string;
  export interface TaskRun {
    /**
     * The unique identifier for the transform.
     */
    TransformId?: HashString;
    /**
     * The unique identifier for this task run.
     */
    TaskRunId?: HashString;
    /**
     * The current status of the requested task run.
     */
    Status?: TaskStatusType;
    /**
     * The names of the log group for secure logging, associated with this task run.
     */
    LogGroupName?: GenericString;
    /**
     * Specifies configuration properties associated with this task run.
     */
    Properties?: TaskRunProperties;
    /**
     * The list of error strings associated with this task run.
     */
    ErrorString?: GenericString;
    /**
     * The date and time that this task run started.
     */
    StartedOn?: Timestamp;
    /**
     * The last point in time that the requested task run was updated.
     */
    LastModifiedOn?: Timestamp;
    /**
     * The last point in time that the requested task run was completed.
     */
    CompletedOn?: Timestamp;
    /**
     * The amount of time (in seconds) that the task run consumed resources.
     */
    ExecutionTime?: ExecutionTime;
  }
  export interface TaskRunFilterCriteria {
    /**
     * The type of task run.
     */
    TaskRunType?: TaskType;
    /**
     * The current status of the task run.
     */
    Status?: TaskStatusType;
    /**
     * Filter on task runs started before this date.
     */
    StartedBefore?: Timestamp;
    /**
     * Filter on task runs started after this date.
     */
    StartedAfter?: Timestamp;
  }
  export type TaskRunList = TaskRun[];
  export interface TaskRunProperties {
    /**
     * The type of task run.
     */
    TaskType?: TaskType;
    /**
     * The configuration properties for an importing labels task run.
     */
    ImportLabelsTaskRunProperties?: ImportLabelsTaskRunProperties;
    /**
     * The configuration properties for an exporting labels task run.
     */
    ExportLabelsTaskRunProperties?: ExportLabelsTaskRunProperties;
    /**
     * The configuration properties for a labeling set generation task run.
     */
    LabelingSetGenerationTaskRunProperties?: LabelingSetGenerationTaskRunProperties;
    /**
     * The configuration properties for a find matches task run.
     */
    FindMatchesTaskRunProperties?: FindMatchesTaskRunProperties;
  }
  export type TaskRunSortColumnType = "TASK_RUN_TYPE"|"STATUS"|"STARTED"|string;
  export interface TaskRunSortCriteria {
    /**
     * The column to be used to sort the list of task runs for the machine learning transform.
     */
    Column: TaskRunSortColumnType;
    /**
     * The sort direction to be used to sort the list of task runs for the machine learning transform.
     */
    SortDirection: SortDirectionType;
  }
  export type TaskStatusType = "STARTING"|"RUNNING"|"STOPPING"|"STOPPED"|"SUCCEEDED"|"FAILED"|"TIMEOUT"|string;
  export type TaskType = "EVALUATION"|"LABELING_SET_GENERATION"|"IMPORT_LABELS"|"EXPORT_LABELS"|"FIND_MATCHES"|string;
  export type Timeout = number;
  export type Timestamp = Date;
  export type TimestampValue = Date;
  export type Token = string;
  export type Topk = number;
  export type TotalSegmentsInteger = number;
  export type TransactionIdString = string;
  export interface TransformConfigParameter {
    /**
     * Specifies the name of the parameter in the config file of the dynamic transform.
     */
    Name: EnclosedInStringProperty;
    /**
     * Specifies the parameter type in the config file of the dynamic transform.
     */
    Type: ParamType;
    /**
     * Specifies the validation rule in the config file of the dynamic transform.
     */
    ValidationRule?: EnclosedInStringProperty;
    /**
     * Specifies the validation message in the config file of the dynamic transform.
     */
    ValidationMessage?: EnclosedInStringProperty;
    /**
     * Specifies the value of the parameter in the config file of the dynamic transform.
     */
    Value?: EnclosedInStringProperties;
    /**
     * Specifies the list type of the parameter in the config file of the dynamic transform.
     */
    ListType?: ParamType;
    /**
     * Specifies whether the parameter is optional or not in the config file of the dynamic transform.
     */
    IsOptional?: BoxedBoolean;
  }
  export type TransformConfigParameterList = TransformConfigParameter[];
  export interface TransformEncryption {
    /**
     * An MLUserDataEncryption object containing the encryption mode and customer-provided KMS key ID.
     */
    MlUserDataEncryption?: MLUserDataEncryption;
    /**
     * The name of the security configuration.
     */
    TaskRunSecurityConfigurationName?: NameString;
  }
  export interface TransformFilterCriteria {
    /**
     * A unique transform name that is used to filter the machine learning transforms.
     */
    Name?: NameString;
    /**
     * The type of machine learning transform that is used to filter the machine learning transforms.
     */
    TransformType?: TransformType;
    /**
     * Filters the list of machine learning transforms by the last known status of the transforms (to indicate whether a transform can be used or not). One of "NOT_READY", "READY", or "DELETING".
     */
    Status?: TransformStatusType;
    /**
     * This value determines which version of Glue this machine learning transform is compatible with. Glue 1.0 is recommended for most customers. If the value is not set, the Glue compatibility defaults to Glue 0.9. For more information, see Glue Versions in the developer guide.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The time and date before which the transforms were created.
     */
    CreatedBefore?: Timestamp;
    /**
     * The time and date after which the transforms were created.
     */
    CreatedAfter?: Timestamp;
    /**
     * Filter on transforms last modified before this date.
     */
    LastModifiedBefore?: Timestamp;
    /**
     * Filter on transforms last modified after this date.
     */
    LastModifiedAfter?: Timestamp;
    /**
     * Filters on datasets with a specific schema. The Map&lt;Column, Type&gt; object is an array of key-value pairs representing the schema this transform accepts, where Column is the name of a column, and Type is the type of the data such as an integer or string. Has an upper bound of 100 columns.
     */
    Schema?: TransformSchema;
  }
  export type TransformIdList = HashString[];
  export type TransformList = MLTransform[];
  export interface TransformParameters {
    /**
     * The type of machine learning transform. For information about the types of machine learning transforms, see Creating Machine Learning Transforms.
     */
    TransformType: TransformType;
    /**
     * The parameters for the find matches algorithm.
     */
    FindMatchesParameters?: FindMatchesParameters;
  }
  export type TransformSchema = SchemaColumn[];
  export type TransformSortColumnType = "NAME"|"TRANSFORM_TYPE"|"STATUS"|"CREATED"|"LAST_MODIFIED"|string;
  export interface TransformSortCriteria {
    /**
     * The column to be used in the sorting criteria that are associated with the machine learning transform.
     */
    Column: TransformSortColumnType;
    /**
     * The sort direction to be used in the sorting criteria that are associated with the machine learning transform.
     */
    SortDirection: SortDirectionType;
  }
  export type TransformStatusType = "NOT_READY"|"READY"|"DELETING"|string;
  export type TransformType = "FIND_MATCHES"|string;
  export interface Trigger {
    /**
     * The name of the trigger.
     */
    Name?: NameString;
    /**
     * The name of the workflow associated with the trigger.
     */
    WorkflowName?: NameString;
    /**
     * Reserved for future use.
     */
    Id?: IdString;
    /**
     * The type of trigger that this is.
     */
    Type?: TriggerType;
    /**
     * The current state of the trigger.
     */
    State?: TriggerState;
    /**
     * A description of this trigger.
     */
    Description?: DescriptionString;
    /**
     * A cron expression used to specify the schedule (see Time-Based Schedules for Jobs and Crawlers. For example, to run something every day at 12:15 UTC, you would specify: cron(15 12 * * ? *).
     */
    Schedule?: GenericString;
    /**
     * The actions initiated by this trigger.
     */
    Actions?: ActionList;
    /**
     * The predicate of this trigger, which defines when it will fire.
     */
    Predicate?: Predicate;
    /**
     * Batch condition that must be met (specified number of events received or batch time window expired) before EventBridge event trigger fires.
     */
    EventBatchingCondition?: EventBatchingCondition;
  }
  export type TriggerList = Trigger[];
  export type TriggerNameList = NameString[];
  export interface TriggerNodeDetails {
    /**
     * The information of the trigger represented by the trigger node.
     */
    Trigger?: Trigger;
  }
  export type TriggerState = "CREATING"|"CREATED"|"ACTIVATING"|"ACTIVATED"|"DEACTIVATING"|"DEACTIVATED"|"DELETING"|"UPDATING"|string;
  export type TriggerType = "SCHEDULED"|"CONDITIONAL"|"ON_DEMAND"|"EVENT"|string;
  export interface TriggerUpdate {
    /**
     * Reserved for future use.
     */
    Name?: NameString;
    /**
     * A description of this trigger.
     */
    Description?: DescriptionString;
    /**
     * A cron expression used to specify the schedule (see Time-Based Schedules for Jobs and Crawlers. For example, to run something every day at 12:15 UTC, you would specify: cron(15 12 * * ? *).
     */
    Schedule?: GenericString;
    /**
     * The actions initiated by this trigger.
     */
    Actions?: ActionList;
    /**
     * The predicate of this trigger, which defines when it will fire.
     */
    Predicate?: Predicate;
    /**
     * Batch condition that must be met (specified number of events received or batch time window expired) before EventBridge event trigger fires.
     */
    EventBatchingCondition?: EventBatchingCondition;
  }
  export type TwoInputs = NodeId[];
  export type TypeString = string;
  export type URI = string;
  export interface UnfilteredPartition {
    /**
     * The partition object.
     */
    Partition?: Partition;
    /**
     * The list of columns the user has permissions to access.
     */
    AuthorizedColumns?: NameStringList;
    /**
     * A Boolean value indicating that the partition location is registered with Lake Formation.
     */
    IsRegisteredWithLakeFormation?: Boolean;
  }
  export type UnfilteredPartitionList = UnfilteredPartition[];
  export interface Union {
    /**
     * The name of the transform node.
     */
    Name: NodeName;
    /**
     * The node ID inputs to the transform.
     */
    Inputs: TwoInputs;
    /**
     * Indicates the type of Union transform.  Specify ALL to join all rows from data sources to the resulting DynamicFrame. The resulting union does not remove duplicate rows. Specify DISTINCT to remove duplicate rows in the resulting DynamicFrame.
     */
    UnionType: UnionType;
  }
  export type UnionType = "ALL"|"DISTINCT"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource from which to remove the tags.
     */
    ResourceArn: GlueResourceArn;
    /**
     * Tags to remove from this resource.
     */
    TagsToRemove: TagKeysList;
  }
  export interface UntagResourceResponse {
  }
  export type UpdateBehavior = "LOG"|"UPDATE_IN_DATABASE"|string;
  export interface UpdateBlueprintRequest {
    /**
     * The name of the blueprint.
     */
    Name: OrchestrationNameString;
    /**
     * A description of the blueprint.
     */
    Description?: Generic512CharString;
    /**
     * Specifies a path in Amazon S3 where the blueprint is published.
     */
    BlueprintLocation: OrchestrationS3Location;
  }
  export interface UpdateBlueprintResponse {
    /**
     * Returns the name of the blueprint that was updated.
     */
    Name?: NameString;
  }
  export type UpdateCatalogBehavior = "UPDATE_IN_DATABASE"|"LOG"|string;
  export interface UpdateClassifierRequest {
    /**
     * A GrokClassifier object with updated fields.
     */
    GrokClassifier?: UpdateGrokClassifierRequest;
    /**
     * An XMLClassifier object with updated fields.
     */
    XMLClassifier?: UpdateXMLClassifierRequest;
    /**
     * A JsonClassifier object with updated fields.
     */
    JsonClassifier?: UpdateJsonClassifierRequest;
    /**
     * A CsvClassifier object with updated fields.
     */
    CsvClassifier?: UpdateCsvClassifierRequest;
  }
  export interface UpdateClassifierResponse {
  }
  export interface UpdateColumnStatisticsForPartitionRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the partitions' table.
     */
    TableName: NameString;
    /**
     * A list of partition values identifying the partition.
     */
    PartitionValues: ValueStringList;
    /**
     * A list of the column statistics.
     */
    ColumnStatisticsList: UpdateColumnStatisticsList;
  }
  export interface UpdateColumnStatisticsForPartitionResponse {
    /**
     * Error occurred during updating column statistics data.
     */
    Errors?: ColumnStatisticsErrors;
  }
  export interface UpdateColumnStatisticsForTableRequest {
    /**
     * The ID of the Data Catalog where the partitions in question reside. If none is supplied, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the partitions reside.
     */
    DatabaseName: NameString;
    /**
     * The name of the partitions' table.
     */
    TableName: NameString;
    /**
     * A list of the column statistics.
     */
    ColumnStatisticsList: UpdateColumnStatisticsList;
  }
  export interface UpdateColumnStatisticsForTableResponse {
    /**
     * List of ColumnStatisticsErrors.
     */
    Errors?: ColumnStatisticsErrors;
  }
  export type UpdateColumnStatisticsList = ColumnStatistics[];
  export interface UpdateConnectionRequest {
    /**
     * The ID of the Data Catalog in which the connection resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the connection definition to update.
     */
    Name: NameString;
    /**
     * A ConnectionInput object that redefines the connection in question.
     */
    ConnectionInput: ConnectionInput;
  }
  export interface UpdateConnectionResponse {
  }
  export interface UpdateCrawlerRequest {
    /**
     * Name of the new crawler.
     */
    Name: NameString;
    /**
     * The IAM role or Amazon Resource Name (ARN) of an IAM role that is used by the new crawler to access customer resources.
     */
    Role?: Role;
    /**
     * The Glue database where results are stored, such as: arn:aws:daylight:us-east-1::database/sometable/*.
     */
    DatabaseName?: DatabaseName;
    /**
     * A description of the new crawler.
     */
    Description?: DescriptionStringRemovable;
    /**
     * A list of targets to crawl.
     */
    Targets?: CrawlerTargets;
    /**
     * A cron expression used to specify the schedule (see Time-Based Schedules for Jobs and Crawlers. For example, to run something every day at 12:15 UTC, you would specify: cron(15 12 * * ? *).
     */
    Schedule?: CronExpression;
    /**
     * A list of custom classifiers that the user has registered. By default, all built-in classifiers are included in a crawl, but these custom classifiers always override the default classifiers for a given classification.
     */
    Classifiers?: ClassifierNameList;
    /**
     * The table prefix used for catalog tables that are created.
     */
    TablePrefix?: TablePrefix;
    /**
     * The policy for the crawler's update and deletion behavior.
     */
    SchemaChangePolicy?: SchemaChangePolicy;
    /**
     * A policy that specifies whether to crawl the entire dataset again, or to crawl only folders that were added since the last crawler run.
     */
    RecrawlPolicy?: RecrawlPolicy;
    /**
     * Specifies data lineage configuration settings for the crawler.
     */
    LineageConfiguration?: LineageConfiguration;
    /**
     * Specifies Lake Formation configuration settings for the crawler.
     */
    LakeFormationConfiguration?: LakeFormationConfiguration;
    /**
     * Crawler configuration information. This versioned JSON string allows users to specify aspects of a crawler's behavior. For more information, see Setting crawler configuration options.
     */
    Configuration?: CrawlerConfiguration;
    /**
     * The name of the SecurityConfiguration structure to be used by this crawler.
     */
    CrawlerSecurityConfiguration?: CrawlerSecurityConfiguration;
  }
  export interface UpdateCrawlerResponse {
  }
  export interface UpdateCrawlerScheduleRequest {
    /**
     * The name of the crawler whose schedule to update.
     */
    CrawlerName: NameString;
    /**
     * The updated cron expression used to specify the schedule (see Time-Based Schedules for Jobs and Crawlers. For example, to run something every day at 12:15 UTC, you would specify: cron(15 12 * * ? *).
     */
    Schedule?: CronExpression;
  }
  export interface UpdateCrawlerScheduleResponse {
  }
  export interface UpdateCsvClassifierRequest {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * A custom symbol to denote what separates each column entry in the row.
     */
    Delimiter?: CsvColumnDelimiter;
    /**
     * A custom symbol to denote what combines content into a single column value. It must be different from the column delimiter.
     */
    QuoteSymbol?: CsvQuoteSymbol;
    /**
     * Indicates whether the CSV file contains a header.
     */
    ContainsHeader?: CsvHeaderOption;
    /**
     * A list of strings representing column names.
     */
    Header?: CsvHeader;
    /**
     * Specifies not to trim values before identifying the type of column values. The default value is true.
     */
    DisableValueTrimming?: NullableBoolean;
    /**
     * Enables the processing of files that contain only one column.
     */
    AllowSingleColumn?: NullableBoolean;
    /**
     * Specifies the configuration of custom datatypes.
     */
    CustomDatatypeConfigured?: NullableBoolean;
    /**
     * Specifies a list of supported custom datatypes.
     */
    CustomDatatypes?: CustomDatatypes;
    /**
     * Sets the SerDe for processing CSV in the classifier, which will be applied in the Data Catalog. Valid values are OpenCSVSerDe, LazySimpleSerDe, and None. You can specify the None value when you want the crawler to do the detection.
     */
    Serde?: CsvSerdeOption;
  }
  export interface UpdateDataQualityRulesetRequest {
    /**
     * The name of the data quality ruleset.
     */
    Name: NameString;
    /**
     * A description of the ruleset.
     */
    Description?: DescriptionString;
    /**
     * A Data Quality Definition Language (DQDL) ruleset. For more information, see the Glue developer guide.
     */
    Ruleset?: DataQualityRulesetString;
  }
  export interface UpdateDataQualityRulesetResponse {
    /**
     * The name of the data quality ruleset.
     */
    Name?: NameString;
    /**
     * A description of the ruleset.
     */
    Description?: DescriptionString;
    /**
     * A Data Quality Definition Language (DQDL) ruleset. For more information, see the Glue developer guide.
     */
    Ruleset?: DataQualityRulesetString;
  }
  export interface UpdateDatabaseRequest {
    /**
     * The ID of the Data Catalog in which the metadata database resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the database to update in the catalog. For Hive compatibility, this is folded to lowercase.
     */
    Name: NameString;
    /**
     * A DatabaseInput object specifying the new definition of the metadata database in the catalog.
     */
    DatabaseInput: DatabaseInput;
  }
  export interface UpdateDatabaseResponse {
  }
  export interface UpdateDevEndpointRequest {
    /**
     * The name of the DevEndpoint to be updated.
     */
    EndpointName: GenericString;
    /**
     * The public key for the DevEndpoint to use.
     */
    PublicKey?: GenericString;
    /**
     * The list of public keys for the DevEndpoint to use.
     */
    AddPublicKeys?: PublicKeysList;
    /**
     * The list of public keys to be deleted from the DevEndpoint.
     */
    DeletePublicKeys?: PublicKeysList;
    /**
     * Custom Python or Java libraries to be loaded in the DevEndpoint.
     */
    CustomLibraries?: DevEndpointCustomLibraries;
    /**
     *  True if the list of custom libraries to be loaded in the development endpoint needs to be updated, or False if otherwise.
     */
    UpdateEtlLibraries?: BooleanValue;
    /**
     * The list of argument keys to be deleted from the map of arguments used to configure the DevEndpoint.
     */
    DeleteArguments?: StringList;
    /**
     * The map of arguments to add the map of arguments used to configure the DevEndpoint. Valid arguments are:    "--enable-glue-datacatalog": ""    You can specify a version of Python support for development endpoints by using the Arguments parameter in the CreateDevEndpoint or UpdateDevEndpoint APIs. If no arguments are provided, the version defaults to Python 2.
     */
    AddArguments?: MapValue;
  }
  export interface UpdateDevEndpointResponse {
  }
  export interface UpdateGrokClassifierRequest {
    /**
     * The name of the GrokClassifier.
     */
    Name: NameString;
    /**
     * An identifier of the data format that the classifier matches, such as Twitter, JSON, Omniture logs, Amazon CloudWatch Logs, and so on.
     */
    Classification?: Classification;
    /**
     * The grok pattern used by this classifier.
     */
    GrokPattern?: GrokPattern;
    /**
     * Optional custom grok patterns used by this classifier.
     */
    CustomPatterns?: CustomPatterns;
  }
  export interface UpdateJobFromSourceControlRequest {
    /**
     * The name of the Glue job to be synchronized to or from the remote repository.
     */
    JobName?: NameString;
    /**
     *  The provider for the remote repository. Possible values: GITHUB, AWS_CODE_COMMIT, GITLAB, BITBUCKET. 
     */
    Provider?: SourceControlProvider;
    /**
     * The name of the remote repository that contains the job artifacts. For BitBucket providers, RepositoryName should include WorkspaceName. Use the format &lt;WorkspaceName&gt;/&lt;RepositoryName&gt;. 
     */
    RepositoryName?: NameString;
    /**
     * The owner of the remote repository that contains the job artifacts.
     */
    RepositoryOwner?: NameString;
    /**
     * An optional branch in the remote repository.
     */
    BranchName?: NameString;
    /**
     * An optional folder in the remote repository.
     */
    Folder?: NameString;
    /**
     * A commit ID for a commit in the remote repository.
     */
    CommitId?: CommitIdString;
    /**
     * The type of authentication, which can be an authentication token stored in Amazon Web Services Secrets Manager, or a personal access token.
     */
    AuthStrategy?: SourceControlAuthStrategy;
    /**
     * The value of the authorization token.
     */
    AuthToken?: AuthTokenString;
  }
  export interface UpdateJobFromSourceControlResponse {
    /**
     * The name of the Glue job.
     */
    JobName?: NameString;
  }
  export interface UpdateJobRequest {
    /**
     * The name of the job definition to update.
     */
    JobName: NameString;
    /**
     * Specifies the values with which to update the job definition. Unspecified configuration is removed or reset to default values.
     */
    JobUpdate: JobUpdate;
  }
  export interface UpdateJobResponse {
    /**
     * Returns the name of the updated job definition.
     */
    JobName?: NameString;
  }
  export interface UpdateJsonClassifierRequest {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * A JsonPath string defining the JSON data for the classifier to classify. Glue supports a subset of JsonPath, as described in Writing JsonPath Custom Classifiers.
     */
    JsonPath?: JsonPath;
  }
  export interface UpdateMLTransformRequest {
    /**
     * A unique identifier that was generated when the transform was created.
     */
    TransformId: HashString;
    /**
     * The unique name that you gave the transform when you created it.
     */
    Name?: NameString;
    /**
     * A description of the transform. The default is an empty string.
     */
    Description?: DescriptionString;
    /**
     * The configuration parameters that are specific to the transform type (algorithm) used. Conditionally dependent on the transform type.
     */
    Parameters?: TransformParameters;
    /**
     * The name or Amazon Resource Name (ARN) of the IAM role with the required permissions.
     */
    Role?: RoleString;
    /**
     * This value determines which version of Glue this machine learning transform is compatible with. Glue 1.0 is recommended for most customers. If the value is not set, the Glue compatibility defaults to Glue 0.9. For more information, see Glue Versions in the developer guide.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of Glue data processing units (DPUs) that are allocated to task runs for this transform. You can allocate from 2 to 100 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.  When the WorkerType field is set to a value other than Standard, the MaxCapacity field is set automatically and becomes read-only.
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when this task runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker provides 4 vCPU, 16 GB of memory and a 64GB disk, and 1 executor per worker.   For the G.2X worker type, each worker provides 8 vCPU, 32 GB of memory and a 128GB disk, and 1 executor per worker.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when this task runs.
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The timeout for a task run for this transform in minutes. This is the maximum time that a task run for this transform can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * The maximum number of times to retry a task for this transform after a task run fails.
     */
    MaxRetries?: NullableInteger;
  }
  export interface UpdateMLTransformResponse {
    /**
     * The unique identifier for the transform that was updated.
     */
    TransformId?: HashString;
  }
  export interface UpdatePartitionRequest {
    /**
     * The ID of the Data Catalog where the partition to be updated resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database in which the table in question resides.
     */
    DatabaseName: NameString;
    /**
     * The name of the table in which the partition to be updated is located.
     */
    TableName: NameString;
    /**
     * List of partition key values that define the partition to update.
     */
    PartitionValueList: BoundedPartitionValueList;
    /**
     * The new partition object to update the partition to. The Values property can't be changed. If you want to change the partition key values for a partition, delete and recreate the partition.
     */
    PartitionInput: PartitionInput;
  }
  export interface UpdatePartitionResponse {
  }
  export interface UpdateRegistryInput {
    /**
     * This is a wrapper structure that may contain the registry name and Amazon Resource Name (ARN).
     */
    RegistryId: RegistryId;
    /**
     * A description of the registry. If description is not provided, this field will not be updated.
     */
    Description: DescriptionString;
  }
  export interface UpdateRegistryResponse {
    /**
     * The name of the updated registry.
     */
    RegistryName?: SchemaRegistryNameString;
    /**
     * The Amazon Resource name (ARN) of the updated registry.
     */
    RegistryArn?: GlueResourceArn;
  }
  export interface UpdateSchemaInput {
    /**
     * This is a wrapper structure to contain schema identity fields. The structure contains:   SchemaId$SchemaArn: The Amazon Resource Name (ARN) of the schema. One of SchemaArn or SchemaName has to be provided.   SchemaId$SchemaName: The name of the schema. One of SchemaArn or SchemaName has to be provided.  
     */
    SchemaId: SchemaId;
    /**
     * Version number required for check pointing. One of VersionNumber or Compatibility has to be provided.
     */
    SchemaVersionNumber?: SchemaVersionNumber;
    /**
     * The new compatibility setting for the schema.
     */
    Compatibility?: Compatibility;
    /**
     * The new description for the schema.
     */
    Description?: DescriptionString;
  }
  export interface UpdateSchemaResponse {
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    SchemaArn?: GlueResourceArn;
    /**
     * The name of the schema.
     */
    SchemaName?: SchemaRegistryNameString;
    /**
     * The name of the registry that contains the schema.
     */
    RegistryName?: SchemaRegistryNameString;
  }
  export interface UpdateSourceControlFromJobRequest {
    /**
     * The name of the Glue job to be synchronized to or from the remote repository.
     */
    JobName?: NameString;
    /**
     *  The provider for the remote repository. Possible values: GITHUB, AWS_CODE_COMMIT, GITLAB, BITBUCKET. 
     */
    Provider?: SourceControlProvider;
    /**
     * The name of the remote repository that contains the job artifacts. For BitBucket providers, RepositoryName should include WorkspaceName. Use the format &lt;WorkspaceName&gt;/&lt;RepositoryName&gt;. 
     */
    RepositoryName?: NameString;
    /**
     * The owner of the remote repository that contains the job artifacts.
     */
    RepositoryOwner?: NameString;
    /**
     * An optional branch in the remote repository.
     */
    BranchName?: NameString;
    /**
     * An optional folder in the remote repository.
     */
    Folder?: NameString;
    /**
     * A commit ID for a commit in the remote repository.
     */
    CommitId?: CommitIdString;
    /**
     * The type of authentication, which can be an authentication token stored in Amazon Web Services Secrets Manager, or a personal access token.
     */
    AuthStrategy?: SourceControlAuthStrategy;
    /**
     * The value of the authorization token.
     */
    AuthToken?: AuthTokenString;
  }
  export interface UpdateSourceControlFromJobResponse {
    /**
     * The name of the Glue job.
     */
    JobName?: NameString;
  }
  export interface UpdateTableRequest {
    /**
     * The ID of the Data Catalog where the table resides. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database in which the table resides. For Hive compatibility, this name is entirely lowercase.
     */
    DatabaseName: NameString;
    /**
     * An updated TableInput object to define the metadata table in the catalog.
     */
    TableInput: TableInput;
    /**
     * By default, UpdateTable always creates an archived version of the table before updating it. However, if skipArchive is set to true, UpdateTable does not create the archived version.
     */
    SkipArchive?: BooleanNullable;
    /**
     * The transaction ID at which to update the table contents. 
     */
    TransactionId?: TransactionIdString;
    /**
     * The version ID at which to update the table contents. 
     */
    VersionId?: VersionString;
  }
  export interface UpdateTableResponse {
  }
  export interface UpdateTriggerRequest {
    /**
     * The name of the trigger to update.
     */
    Name: NameString;
    /**
     * The new values with which to update the trigger.
     */
    TriggerUpdate: TriggerUpdate;
  }
  export interface UpdateTriggerResponse {
    /**
     * The resulting trigger definition.
     */
    Trigger?: Trigger;
  }
  export interface UpdateUserDefinedFunctionRequest {
    /**
     * The ID of the Data Catalog where the function to be updated is located. If none is provided, the Amazon Web Services account ID is used by default.
     */
    CatalogId?: CatalogIdString;
    /**
     * The name of the catalog database where the function to be updated is located.
     */
    DatabaseName: NameString;
    /**
     * The name of the function.
     */
    FunctionName: NameString;
    /**
     * A FunctionInput object that redefines the function in the Data Catalog.
     */
    FunctionInput: UserDefinedFunctionInput;
  }
  export interface UpdateUserDefinedFunctionResponse {
  }
  export interface UpdateWorkflowRequest {
    /**
     * Name of the workflow to be updated.
     */
    Name: NameString;
    /**
     * The description of the workflow.
     */
    Description?: GenericString;
    /**
     * A collection of properties to be used as part of each execution of the workflow.
     */
    DefaultRunProperties?: WorkflowRunProperties;
    /**
     * You can use this parameter to prevent unwanted multiple updates to data, to control costs, or in some cases, to prevent exceeding the maximum number of concurrent runs of any of the component jobs. If you leave this parameter blank, there is no limit to the number of concurrent workflow runs.
     */
    MaxConcurrentRuns?: NullableInteger;
  }
  export interface UpdateWorkflowResponse {
    /**
     * The name of the workflow which was specified in input.
     */
    Name?: NameString;
  }
  export interface UpdateXMLClassifierRequest {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * An identifier of the data format that the classifier matches.
     */
    Classification?: Classification;
    /**
     * The XML tag designating the element that contains each record in an XML document being parsed. This cannot identify a self-closing element (closed by /&gt;). An empty row element that contains only attributes can be parsed as long as it ends with a closing tag (for example, &lt;row item_a="A" item_b="B"&gt;&lt;/row&gt; is okay, but &lt;row item_a="A" item_b="B" /&gt; is not).
     */
    RowTag?: RowTag;
  }
  export type UpdatedTimestamp = string;
  export interface UpsertRedshiftTargetOptions {
    /**
     * The physical location of the Redshift table.
     */
    TableLocation?: EnclosedInStringProperty;
    /**
     * The name of the connection to use to write to Redshift.
     */
    ConnectionName?: EnclosedInStringProperty;
    /**
     * The keys used to determine whether to perform an update or insert.
     */
    UpsertKeys?: EnclosedInStringPropertiesMinOne;
  }
  export type UriString = string;
  export interface UserDefinedFunction {
    /**
     * The name of the function.
     */
    FunctionName?: NameString;
    /**
     * The name of the catalog database that contains the function.
     */
    DatabaseName?: NameString;
    /**
     * The Java class that contains the function code.
     */
    ClassName?: NameString;
    /**
     * The owner of the function.
     */
    OwnerName?: NameString;
    /**
     * The owner type.
     */
    OwnerType?: PrincipalType;
    /**
     * The time at which the function was created.
     */
    CreateTime?: Timestamp;
    /**
     * The resource URIs for the function.
     */
    ResourceUris?: ResourceUriList;
    /**
     * The ID of the Data Catalog in which the function resides.
     */
    CatalogId?: CatalogIdString;
  }
  export interface UserDefinedFunctionInput {
    /**
     * The name of the function.
     */
    FunctionName?: NameString;
    /**
     * The Java class that contains the function code.
     */
    ClassName?: NameString;
    /**
     * The owner of the function.
     */
    OwnerName?: NameString;
    /**
     * The owner type.
     */
    OwnerType?: PrincipalType;
    /**
     * The resource URIs for the function.
     */
    ResourceUris?: ResourceUriList;
  }
  export type UserDefinedFunctionList = UserDefinedFunction[];
  export type ValueString = string;
  export type ValueStringList = ValueString[];
  export type VersionId = number;
  export type VersionLongNumber = number;
  export type VersionString = string;
  export type VersionsString = string;
  export type ViewTextString = string;
  export type WorkerType = "Standard"|"G.1X"|"G.2X"|"G.025X"|"G.4X"|"G.8X"|"Z.2X"|string;
  export interface Workflow {
    /**
     * The name of the workflow.
     */
    Name?: NameString;
    /**
     * A description of the workflow.
     */
    Description?: GenericString;
    /**
     * A collection of properties to be used as part of each execution of the workflow. The run properties are made available to each job in the workflow. A job can modify the properties for the next jobs in the flow.
     */
    DefaultRunProperties?: WorkflowRunProperties;
    /**
     * The date and time when the workflow was created.
     */
    CreatedOn?: TimestampValue;
    /**
     * The date and time when the workflow was last modified.
     */
    LastModifiedOn?: TimestampValue;
    /**
     * The information about the last execution of the workflow.
     */
    LastRun?: WorkflowRun;
    /**
     * The graph representing all the Glue components that belong to the workflow as nodes and directed connections between them as edges.
     */
    Graph?: WorkflowGraph;
    /**
     * You can use this parameter to prevent unwanted multiple updates to data, to control costs, or in some cases, to prevent exceeding the maximum number of concurrent runs of any of the component jobs. If you leave this parameter blank, there is no limit to the number of concurrent workflow runs.
     */
    MaxConcurrentRuns?: NullableInteger;
    /**
     * This structure indicates the details of the blueprint that this particular workflow is created from.
     */
    BlueprintDetails?: BlueprintDetails;
  }
  export interface WorkflowGraph {
    /**
     * A list of the the Glue components belong to the workflow represented as nodes.
     */
    Nodes?: NodeList;
    /**
     * A list of all the directed connections between the nodes belonging to the workflow.
     */
    Edges?: EdgeList;
  }
  export type WorkflowNames = NameString[];
  export interface WorkflowRun {
    /**
     * Name of the workflow that was run.
     */
    Name?: NameString;
    /**
     * The ID of this workflow run.
     */
    WorkflowRunId?: IdString;
    /**
     * The ID of the previous workflow run.
     */
    PreviousRunId?: IdString;
    /**
     * The workflow run properties which were set during the run.
     */
    WorkflowRunProperties?: WorkflowRunProperties;
    /**
     * The date and time when the workflow run was started.
     */
    StartedOn?: TimestampValue;
    /**
     * The date and time when the workflow run completed.
     */
    CompletedOn?: TimestampValue;
    /**
     * The status of the workflow run.
     */
    Status?: WorkflowRunStatus;
    /**
     * This error message describes any error that may have occurred in starting the workflow run. Currently the only error message is "Concurrent runs exceeded for workflow: foo."
     */
    ErrorMessage?: ErrorString;
    /**
     * The statistics of the run.
     */
    Statistics?: WorkflowRunStatistics;
    /**
     * The graph representing all the Glue components that belong to the workflow as nodes and directed connections between them as edges.
     */
    Graph?: WorkflowGraph;
    /**
     * The batch condition that started the workflow run.
     */
    StartingEventBatchCondition?: StartingEventBatchCondition;
  }
  export type WorkflowRunProperties = {[key: string]: GenericString};
  export interface WorkflowRunStatistics {
    /**
     * Total number of Actions in the workflow run.
     */
    TotalActions?: IntegerValue;
    /**
     * Total number of Actions that timed out.
     */
    TimeoutActions?: IntegerValue;
    /**
     * Total number of Actions that have failed.
     */
    FailedActions?: IntegerValue;
    /**
     * Total number of Actions that have stopped.
     */
    StoppedActions?: IntegerValue;
    /**
     * Total number of Actions that have succeeded.
     */
    SucceededActions?: IntegerValue;
    /**
     * Total number Actions in running state.
     */
    RunningActions?: IntegerValue;
    /**
     * Indicates the count of job runs in the ERROR state in the workflow run.
     */
    ErroredActions?: IntegerValue;
    /**
     * Indicates the count of job runs in WAITING state in the workflow run.
     */
    WaitingActions?: IntegerValue;
  }
  export type WorkflowRunStatus = "RUNNING"|"COMPLETED"|"STOPPING"|"STOPPED"|"ERROR"|string;
  export type WorkflowRuns = WorkflowRun[];
  export type Workflows = Workflow[];
  export interface XMLClassifier {
    /**
     * The name of the classifier.
     */
    Name: NameString;
    /**
     * An identifier of the data format that the classifier matches.
     */
    Classification: Classification;
    /**
     * The time that this classifier was registered.
     */
    CreationTime?: Timestamp;
    /**
     * The time that this classifier was last updated.
     */
    LastUpdated?: Timestamp;
    /**
     * The version of this classifier.
     */
    Version?: VersionId;
    /**
     * The XML tag designating the element that contains each record in an XML document being parsed. This can't identify a self-closing element (closed by /&gt;). An empty row element that contains only attributes can be parsed as long as it ends with a closing tag (for example, &lt;row item_a="A" item_b="B"&gt;&lt;/row&gt; is okay, but &lt;row item_a="A" item_b="B" /&gt; is not).
     */
    RowTag?: RowTag;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-03-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Glue client.
   */
  export import Types = Glue;
}
export = Glue;
