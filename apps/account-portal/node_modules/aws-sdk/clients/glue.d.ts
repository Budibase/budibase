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
   * Cancels (stops) a task run. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can cancel a machine learning task run at any time by calling CancelMLTaskRun with a task run's parent transform's TransformID and the task run's TaskRunId. 
   */
  cancelMLTaskRun(params: Glue.Types.CancelMLTaskRunRequest, callback?: (err: AWSError, data: Glue.Types.CancelMLTaskRunResponse) => void): Request<Glue.Types.CancelMLTaskRunResponse, AWSError>;
  /**
   * Cancels (stops) a task run. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can cancel a machine learning task run at any time by calling CancelMLTaskRun with a task run's parent transform's TransformID and the task run's TaskRunId. 
   */
  cancelMLTaskRun(callback?: (err: AWSError, data: Glue.Types.CancelMLTaskRunResponse) => void): Request<Glue.Types.CancelMLTaskRunResponse, AWSError>;
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
   * Retrieves the security configuration for a specified catalog.
   */
  getDataCatalogEncryptionSettings(params: Glue.Types.GetDataCatalogEncryptionSettingsRequest, callback?: (err: AWSError, data: Glue.Types.GetDataCatalogEncryptionSettingsResponse) => void): Request<Glue.Types.GetDataCatalogEncryptionSettingsResponse, AWSError>;
  /**
   * Retrieves the security configuration for a specified catalog.
   */
  getDataCatalogEncryptionSettings(callback?: (err: AWSError, data: Glue.Types.GetDataCatalogEncryptionSettingsResponse) => void): Request<Glue.Types.GetDataCatalogEncryptionSettingsResponse, AWSError>;
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
   * Retrieves all the development endpoints in this AWS account.  When you create a development endpoint in a virtual private cloud (VPC), Glue returns only a private IP address and the public IP address field is not populated. When you create a non-VPC development endpoint, Glue returns only a public IP address. 
   */
  getDevEndpoints(params: Glue.Types.GetDevEndpointsRequest, callback?: (err: AWSError, data: Glue.Types.GetDevEndpointsResponse) => void): Request<Glue.Types.GetDevEndpointsResponse, AWSError>;
  /**
   * Retrieves all the development endpoints in this AWS account.  When you create a development endpoint in a virtual private cloud (VPC), Glue returns only a private IP address and the public IP address field is not populated. When you create a non-VPC development endpoint, Glue returns only a public IP address. 
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
   * Returns information on a job bookmark entry.
   */
  getJobBookmark(params: Glue.Types.GetJobBookmarkRequest, callback?: (err: AWSError, data: Glue.Types.GetJobBookmarkResponse) => void): Request<Glue.Types.GetJobBookmarkResponse, AWSError>;
  /**
   * Returns information on a job bookmark entry.
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
   * Resets a bookmark entry.
   */
  resetJobBookmark(params: Glue.Types.ResetJobBookmarkRequest, callback?: (err: AWSError, data: Glue.Types.ResetJobBookmarkResponse) => void): Request<Glue.Types.ResetJobBookmarkResponse, AWSError>;
  /**
   * Resets a bookmark entry.
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
   * Updates an existing job definition.
   */
  updateJob(params: Glue.Types.UpdateJobRequest, callback?: (err: AWSError, data: Glue.Types.UpdateJobResponse) => void): Request<Glue.Types.UpdateJobResponse, AWSError>;
  /**
   * Updates an existing job definition.
   */
  updateJob(callback?: (err: AWSError, data: Glue.Types.UpdateJobResponse) => void): Request<Glue.Types.UpdateJobResponse, AWSError>;
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
  export type AdditionalPlanOptionsMap = {[key: string]: GenericString};
  export type AttemptCount = number;
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
  }
  export type CatalogTargetList = CatalogTarget[];
  export interface CheckSchemaVersionValidityInput {
    /**
     * The data format of the schema definition. Currently AVRO and JSON are supported.
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
     * Decimal column statistics data.
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
  export type Comparator = "EQUALS"|"GREATER_THAN"|"LESS_THAN"|"GREATER_THAN_EQUALS"|"LESS_THAN_EQUALS"|string;
  export type Compatibility = "NONE"|"DISABLED"|"BACKWARD"|"BACKWARD_ALL"|"FORWARD"|"FORWARD_ALL"|"FULL"|"FULL_ALL"|string;
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
     * These key-value pairs define parameters for the connection:    HOST - The host URI: either the fully qualified domain name (FQDN) or the IPv4 address of the database host.    PORT - The port number, between 1024 and 65535, of the port on which the database host is listening for database connections.    USER_NAME - The name under which to log in to the database. The value string for USER_NAME is "USERNAME".    PASSWORD - A password, if one is used, for the user name.    ENCRYPTED_PASSWORD - When you enable connection password protection by setting ConnectionPasswordEncryption in the Data Catalog encryption settings, this field stores the encrypted password.    JDBC_DRIVER_JAR_URI - The Amazon Simple Storage Service (Amazon S3) path of the JAR file that contains the JDBC driver to use.    JDBC_DRIVER_CLASS_NAME - The class name of the JDBC driver to use.    JDBC_ENGINE - The name of the JDBC engine to use.    JDBC_ENGINE_VERSION - The version of the JDBC engine to use.    CONFIG_FILES - (Reserved for future use.)    INSTANCE_ID - The instance ID to use.    JDBC_CONNECTION_URL - The URL for connecting to a JDBC data source.    JDBC_ENFORCE_SSL - A Boolean string (true, false) specifying whether Secure Sockets Layer (SSL) with hostname matching is enforced for the JDBC connection on the client. The default is false.    CUSTOM_JDBC_CERT - An Amazon S3 location specifying the customer's root certificate. Glue uses this root certificate to validate the customer’s certificate when connecting to the customer database. Glue only handles X.509 certificates. The certificate provided must be DER-encoded and supplied in Base64 encoding PEM format.    SKIP_CUSTOM_JDBC_CERT_VALIDATION - By default, this is false. Glue validates the Signature algorithm and Subject Public Key Algorithm for the customer certificate. The only permitted algorithms for the Signature algorithm are SHA256withRSA, SHA384withRSA or SHA512withRSA. For the Subject Public Key Algorithm, the key length must be at least 2048. You can set the value of this property to true to skip Glue’s validation of the customer certificate.    CUSTOM_JDBC_CERT_STRING - A custom JDBC certificate string which is used for domain match or distinguished name match to prevent a man-in-the-middle attack. In Oracle database, this is used as the SSL_SERVER_CERT_DN; in Microsoft SQL Server, this is used as the hostNameInCertificate.    CONNECTION_URL - The URL for connecting to a general (non-JDBC) data source.    KAFKA_BOOTSTRAP_SERVERS - A comma-separated list of host and port pairs that are the addresses of the Apache Kafka brokers in a Kafka cluster to which a Kafka client will connect to and bootstrap itself.    KAFKA_SSL_ENABLED - Whether to enable or disable SSL on an Apache Kafka connection. Default value is "true".    KAFKA_CUSTOM_CERT - The Amazon S3 URL for the private CA cert file (.pem format). The default is an empty string.    KAFKA_SKIP_CUSTOM_CERT_VALIDATION - Whether to skip the validation of the CA cert file or not. Glue validates for three algorithms: SHA256withRSA, SHA384withRSA and SHA512withRSA. Default value is "false".    SECRET_ID - The secret ID used for the secret manager of credentials.    CONNECTOR_URL - The connector URL for a MARKETPLACE or CUSTOM connection.    CONNECTOR_TYPE - The connector type for a MARKETPLACE or CUSTOM connection.    CONNECTOR_CLASS_NAME - The connector class name for a MARKETPLACE or CUSTOM connection.    KAFKA_CLIENT_KEYSTORE - The Amazon S3 location of the client keystore file for Kafka client side authentication (Optional).    KAFKA_CLIENT_KEYSTORE_PASSWORD - The password to access the provided keystore (Optional).    KAFKA_CLIENT_KEY_PASSWORD - A keystore can consist of multiple keys, so this is the password to access the client key to be used with the Kafka server side key (Optional).    ENCRYPTED_KAFKA_CLIENT_KEYSTORE_PASSWORD - The encrypted version of the Kafka client keystore password (if the user has the Glue encrypt passwords setting selected).    ENCRYPTED_KAFKA_CLIENT_KEY_PASSWORD - The encrypted version of the Kafka client key password (if the user has the Glue encrypt passwords setting selected).  
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
     * The name of the connection.
     */
    Name: NameString;
    /**
     * The description of the connection.
     */
    Description?: DescriptionString;
    /**
     * The type of the connection. Currently, these types are supported:    JDBC - Designates a connection to a database through Java Database Connectivity (JDBC).    KAFKA - Designates a connection to an Apache Kafka streaming platform.    MONGODB - Designates a connection to a MongoDB document database.    NETWORK - Designates a network connection to a data source within an Amazon Virtual Private Cloud environment (Amazon VPC).    MARKETPLACE - Uses configuration settings contained in a connector purchased from Amazon Web Services Marketplace to read from and write to data stores that are not natively supported by Glue.    CUSTOM - Uses configuration settings contained in a custom connector to read from and write to data stores that are not natively supported by Glue.   SFTP is not supported.
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
  export type ConnectionPropertyKey = "HOST"|"PORT"|"USERNAME"|"PASSWORD"|"ENCRYPTED_PASSWORD"|"JDBC_DRIVER_JAR_URI"|"JDBC_DRIVER_CLASS_NAME"|"JDBC_ENGINE"|"JDBC_ENGINE_VERSION"|"CONFIG_FILES"|"INSTANCE_ID"|"JDBC_CONNECTION_URL"|"JDBC_ENFORCE_SSL"|"CUSTOM_JDBC_CERT"|"SKIP_CUSTOM_JDBC_CERT_VALIDATION"|"CUSTOM_JDBC_CERT_STRING"|"CONNECTION_URL"|"KAFKA_BOOTSTRAP_SERVERS"|"KAFKA_SSL_ENABLED"|"KAFKA_CUSTOM_CERT"|"KAFKA_SKIP_CUSTOM_CERT_VALIDATION"|"KAFKA_CLIENT_KEYSTORE"|"KAFKA_CLIENT_KEYSTORE_PASSWORD"|"KAFKA_CLIENT_KEY_PASSWORD"|"ENCRYPTED_KAFKA_CLIENT_KEYSTORE_PASSWORD"|"ENCRYPTED_KAFKA_CLIENT_KEY_PASSWORD"|"SECRET_ID"|"CONNECTOR_URL"|"CONNECTOR_TYPE"|"CONNECTOR_CLASS_NAME"|string;
  export type ConnectionType = "JDBC"|"SFTP"|"MONGODB"|"KAFKA"|"NETWORK"|"MARKETPLACE"|"CUSTOM"|string;
  export interface ConnectionsList {
    /**
     * A list of connections used by the job.
     */
    Connections?: OrchestrationStringList;
  }
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
  export type CrawlList = Crawl[];
  export type CrawlState = "RUNNING"|"CANCELLING"|"CANCELLED"|"SUCCEEDED"|"FAILED"|string;
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
     * Crawler configuration information. This versioned JSON string allows users to specify aspects of a crawler's behavior. For more information, see Include and Exclude Patterns.
     */
    Configuration?: CrawlerConfiguration;
    /**
     * The name of the SecurityConfiguration structure to be used by this crawler.
     */
    CrawlerSecurityConfiguration?: CrawlerSecurityConfiguration;
  }
  export type CrawlerConfiguration = string;
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
  }
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
     * Crawler configuration information. This versioned JSON string allows users to specify aspects of a crawler's behavior. For more information, see Configuring a Crawler.
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
     * The AWS Availability Zone where this DevEndpoint is located.
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
     * The default arguments for this job. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the key-value pairs that Glue consumes to set up your job, see the Special Parameters Used by Glue topic in the developer guide.
     */
    DefaultArguments?: GenericMap;
    /**
     * Non-overridable arguments for this job, specified as name-value pairs.
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
     * This parameter is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) to allocate to this Job. You can allocate from 2 to 100 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The job timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * For Glue version 1.0 or earlier jobs, using the standard worker type, the number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page. Do not set Max Capacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job or an Apache Spark ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl") or Apache Spark streaming ETL job (JobCommand.Name="gluestreaming"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.   For Glue version 2.0 jobs, you cannot instead specify a Maximum capacity. Instead, you should specify a Worker type and the Number of workers.
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
     * Glue version determines the versions of Apache Spark and Python that Glue supports. The Python version indicates the version supported for jobs of type Spark.  For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Jobs that are created without specifying a Glue version default to Glue 0.9.
     */
    GlueVersion?: GlueVersionString;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs. The maximum number of workers you can define are 299 for G.1X, and 149 for G.2X. 
     */
    NumberOfWorkers?: NullableInteger;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.  
     */
    WorkerType?: WorkerType;
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
     * The data format of the schema definition. Currently AVRO and JSON are supported.
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
     * The data format of the schema definition. Currently AVRO and JSON are supported.
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
  }
  export type CsvColumnDelimiter = string;
  export type CsvHeader = NameString[];
  export type CsvHeaderOption = "UNKNOWN"|"PRESENT"|"ABSENT"|string;
  export type CsvQuoteSymbol = string;
  export type CustomPatterns = string;
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
  export type DataFormat = "AVRO"|"JSON"|string;
  export interface DataLakePrincipal {
    /**
     * An identifier for the Lake Formation principal.
     */
    DataLakePrincipalIdentifier?: DataLakePrincipalString;
  }
  export type DataLakePrincipalString = string;
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
     * Creates a set of default permissions on the table for principals. 
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
     * Creates a set of default permissions on the table for principals. 
     */
    CreateTableDefaultPermissions?: PrincipalPermissionsList;
    /**
     * A DatabaseIdentifier structure that describes a target database for resource linking.
     */
    TargetDatabase?: DatabaseIdentifier;
  }
  export type DatabaseList = Database[];
  export type DatabaseName = string;
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
     * The AWS Availability Zone where this DevEndpoint is located.
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
  export type EnableHybridValues = "TRUE"|"FALSE"|string;
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
  export type FieldType = string;
  export type FilterString = string;
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
     * List of ColumnStatistics that failed to be retrieved.
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
     * Allows you to retrieve the connection metadata without returning the password. For instance, the AWS Glue console uses this flag to retrieve the connection, and does not display the password. Set this parameter when the caller might not have permission to use the KMS key to decrypt the password, but it does have permission to access the rest of the connection properties.
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
     * Allows you to retrieve the connection metadata without returning the password. For instance, the AWS Glue console uses this flag to retrieve the connection, and does not display the password. Set this parameter when the caller might not have permission to use the KMS key to decrypt the password, but it does have permission to access the rest of the connection properties.
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
     * Allows you to specify that you want to list the databases shared with your account. The allowable values are FOREIGN or ALL.    If set to FOREIGN, will list the databases shared with your account.    If set to ALL, will list the databases shared with your account, as well as the databases in yor local account.   
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
     * The data format of the schema definition. Currently only AVRO and JSON are supported.
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
     * The data format of the schema definition. Currently AVRO and JSON are supported.
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
     * The data format of the schema definition. Currently AVRO and JSON are supported.
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
  export type GlueResourceArn = string;
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
  }
  export type GlueTables = GlueTable[];
  export type GlueVersionString = string;
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
  export type IdString = string;
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
     * The default arguments for this job, specified as name-value pairs. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the key-value pairs that Glue consumes to set up your job, see the Special Parameters Used by Glue topic in the developer guide.
     */
    DefaultArguments?: GenericMap;
    /**
     * Non-overridable arguments for this job, specified as name-value pairs.
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
     * This field is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) allocated to runs of this job. You can allocate from 2 to 100 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page. 
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The job timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * For Glue version 1.0 or earlier jobs, using the standard worker type, the number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page. Do not set Max Capacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job, an Apache Spark ETL job, or an Apache Spark streaming ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl") or Apache Spark streaming ETL job (JobCommand.Name="gluestreaming"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.   For Glue version 2.0 jobs, you cannot instead specify a Maximum capacity. Instead, you should specify a Worker type and the Number of workers.
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs. The maximum number of workers you can define are 299 for G.1X, and 149 for G.2X. 
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
     * Glue version determines the versions of Apache Spark and Python that Glue supports. The Python version indicates the version supported for jobs of type Spark.  For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Jobs that are created without specifying a Glue version default to Glue 0.9.
     */
    GlueVersion?: GlueVersionString;
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
     * The name of the job command. For an Apache Spark ETL job, this must be glueetl. For a Python shell job, it must be pythonshell. For an Apache Spark streaming ETL job, this must be gluestreaming.
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
     * The job arguments associated with this run. For this job run, they replace the default arguments set in the job definition itself. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. For information about how to specify and consume your own job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the key-value pairs that Glue consumes to set up your job, see the Special Parameters Used by Glue topic in the developer guide.
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
     * The JobRun timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours). This overrides the timeout value set in the parent job.
     */
    Timeout?: Timeout;
    /**
     * The number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page. Do not set Max Capacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job or an Apache Spark ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.  
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker provides 4 vCPU, 16 GB of memory and a 64GB disk, and 1 executor per worker.   For the G.2X worker type, each worker provides 8 vCPU, 32 GB of memory and a 128GB disk, and 1 executor per worker.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs. The maximum number of workers you can define are 299 for G.1X, and 149 for G.2X. 
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
     * Glue version determines the versions of Apache Spark and Python that Glue supports. The Python version indicates the version supported for jobs of type Spark.  For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide. Jobs that are created without specifying a Glue version default to Glue 0.9.
     */
    GlueVersion?: GlueVersionString;
  }
  export type JobRunList = JobRun[];
  export type JobRunState = "STARTING"|"RUNNING"|"STOPPING"|"STOPPED"|"SUCCEEDED"|"FAILED"|"TIMEOUT"|string;
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
     * The default arguments for this job. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the key-value pairs that Glue consumes to set up your job, see the Special Parameters Used by Glue topic in the developer guide.
     */
    DefaultArguments?: GenericMap;
    /**
     * Non-overridable arguments for this job, specified as name-value pairs.
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
     * This field is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) to allocate to this job. You can allocate from 2 to 100 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The job timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
     */
    Timeout?: Timeout;
    /**
     * For Glue version 1.0 or earlier jobs, using the standard worker type, the number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page. Do not set Max Capacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job or an Apache Spark ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl") or Apache Spark streaming ETL job (JobCommand.Name="gluestreaming"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.   For Glue version 2.0 jobs, you cannot instead specify a Maximum capacity. Instead, you should specify a Worker type and the Number of workers.
     */
    MaxCapacity?: NullableDouble;
    /**
     * The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.   For the G.2X worker type, each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs. The maximum number of workers you can define are 299 for G.1X, and 149 for G.2X. 
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
     * Glue version determines the versions of Apache Spark and Python that Glue supports. The Python version indicates the version supported for jobs of type Spark.  For more information about the available Glue versions and corresponding Spark and Python versions, see Glue version in the developer guide.
     */
    GlueVersion?: GlueVersionString;
  }
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
  export type KmsKeyArn = string;
  export type LabelCount = number;
  export interface LabelingSetGenerationTaskRunProperties {
    /**
     * The Amazon Simple Storage Service (Amazon S3) path where you will generate the labeling set.
     */
    OutputS3Path?: UriString;
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
  export type MapValue = {[key: string]: GenericString};
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
  export type MatchCriteria = NameString[];
  export type MaxConcurrentRuns = number;
  export type MaxResultsNumber = number;
  export type MaxRetries = number;
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
  export type MetadataValueString = string;
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
  export type NodeIdList = NameString[];
  export type NodeList = Node[];
  export type NodeType = "CRAWLER"|"JOB"|"TRIGGER"|string;
  export type NonNegativeDouble = number;
  export type NonNegativeInteger = number;
  export type NonNegativeLong = number;
  export interface NotificationProperty {
    /**
     * After a job run starts, the number of minutes to wait before sending a job run delay notification.
     */
    NotifyDelayAfter?: NotifyDelayAfter;
  }
  export type NotifyDelayAfter = number;
  export type NullableBoolean = boolean;
  export type NullableDouble = number;
  export type NullableInteger = number;
  export type OrchestrationIAMRoleArn = string;
  export type OrchestrationNameString = string;
  export type OrchestrationS3Location = string;
  export type OrchestrationStringList = GenericString[];
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
  export type PageSize = number;
  export type PaginationToken = string;
  export type ParametersMap = {[key: string]: ParametersMapValue};
  export type ParametersMapValue = string;
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
  export type PolicyJsonString = string;
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
  export type RecordsCount = number;
  export type RecrawlBehavior = "CRAWL_EVERYTHING"|"CRAWL_NEW_FOLDERS_ONLY"|"CRAWL_EVENT_MODE"|string;
  export interface RecrawlPolicy {
    /**
     * Specifies whether to crawl the entire dataset again or to crawl only folders that were added since the last crawler run. A value of CRAWL_EVERYTHING specifies crawling the entire dataset again. A value of CRAWL_NEW_FOLDERS_ONLY specifies crawling only folders that were added since the last crawler run. A value of CRAWL_EVENT_MODE specifies crawling only the changes identified by Amazon S3 events.
     */
    RecrawlBehavior?: RecrawlBehavior;
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
  export type ResourceShareType = "FOREIGN"|"ALL"|string;
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
  export type RunId = string;
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
     * The job arguments specifically for this run. For this job run, they replace the default arguments set in the job definition itself. You can specify arguments here that your own job-execution script consumes, as well as arguments that Glue itself consumes. For information about how to specify and consume your own Job arguments, see the Calling Glue APIs in Python topic in the developer guide. For information about the key-value pairs that Glue consumes to set up your job, see the Special Parameters Used by Glue topic in the developer guide.
     */
    Arguments?: GenericMap;
    /**
     * This field is deprecated. Use MaxCapacity instead. The number of Glue data processing units (DPUs) to allocate to this JobRun. From 2 to 100 DPUs can be allocated; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page.
     */
    AllocatedCapacity?: IntegerValue;
    /**
     * The JobRun timeout in minutes. This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours). This overrides the timeout value set in the parent job.
     */
    Timeout?: Timeout;
    /**
     * The number of Glue data processing units (DPUs) that can be allocated when this job runs. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the Glue pricing page. Do not set Max Capacity if using WorkerType and NumberOfWorkers. The value that can be allocated for MaxCapacity depends on whether you are running a Python shell job, or an Apache Spark ETL job:   When you specify a Python shell job (JobCommand.Name="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.   When you specify an Apache Spark ETL job (JobCommand.Name="glueetl"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.  
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
     * The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.   For the Standard worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.   For the G.1X worker type, each worker provides 4 vCPU, 16 GB of memory and a 64GB disk, and 1 executor per worker.   For the G.2X worker type, each worker provides 8 vCPU, 32 GB of memory and a 128GB disk, and 1 executor per worker.  
     */
    WorkerType?: WorkerType;
    /**
     * The number of workers of a defined workerType that are allocated when a job runs. The maximum number of workers you can define are 299 for G.1X, and 149 for G.2X. 
     */
    NumberOfWorkers?: NullableInteger;
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
     * If the table is a view, the original text of the view; otherwise null.
     */
    ViewOriginalText?: ViewTextString;
    /**
     * If the table is a view, the expanded text of the view; otherwise null.
     */
    ViewExpandedText?: ViewTextString;
    /**
     * The type of this table (EXTERNAL_TABLE, VIRTUAL_VIEW, etc.).
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
     * The table owner.
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
     * If the table is a view, the original text of the view; otherwise null.
     */
    ViewOriginalText?: ViewTextString;
    /**
     * If the table is a view, the expanded text of the view; otherwise null.
     */
    ViewExpandedText?: ViewTextString;
    /**
     * The type of this table (EXTERNAL_TABLE, VIRTUAL_VIEW, etc.).
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
  export type TotalSegmentsInteger = number;
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
  export type TypeString = string;
  export type URI = string;
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
     * Crawler configuration information. This versioned JSON string allows users to specify aspects of a crawler's behavior. For more information, see Configuring a Crawler.
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
  export interface UpdateJobRequest {
    /**
     * The name of the job definition to update.
     */
    JobName: NameString;
    /**
     * Specifies the values with which to update the job definition.
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
  export type WorkerType = "Standard"|"G.1X"|"G.2X"|string;
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
