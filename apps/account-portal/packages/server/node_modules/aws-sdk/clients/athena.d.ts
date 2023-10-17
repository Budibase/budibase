import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Athena extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Athena.Types.ClientConfiguration)
  config: Config & Athena.Types.ClientConfiguration;
  /**
   * Returns the details of a single named query or a list of up to 50 queries, which you provide as an array of query ID strings. Requires you to have access to the workgroup in which the queries were saved. Use ListNamedQueriesInput to get the list of named query IDs in the specified workgroup. If information could not be retrieved for a submitted query ID, information about the query ID submitted is listed under UnprocessedNamedQueryId. Named queries differ from executed queries. Use BatchGetQueryExecutionInput to get details about each unique query execution, and ListQueryExecutionsInput to get a list of query execution IDs.
   */
  batchGetNamedQuery(params: Athena.Types.BatchGetNamedQueryInput, callback?: (err: AWSError, data: Athena.Types.BatchGetNamedQueryOutput) => void): Request<Athena.Types.BatchGetNamedQueryOutput, AWSError>;
  /**
   * Returns the details of a single named query or a list of up to 50 queries, which you provide as an array of query ID strings. Requires you to have access to the workgroup in which the queries were saved. Use ListNamedQueriesInput to get the list of named query IDs in the specified workgroup. If information could not be retrieved for a submitted query ID, information about the query ID submitted is listed under UnprocessedNamedQueryId. Named queries differ from executed queries. Use BatchGetQueryExecutionInput to get details about each unique query execution, and ListQueryExecutionsInput to get a list of query execution IDs.
   */
  batchGetNamedQuery(callback?: (err: AWSError, data: Athena.Types.BatchGetNamedQueryOutput) => void): Request<Athena.Types.BatchGetNamedQueryOutput, AWSError>;
  /**
   * Returns the details of a single prepared statement or a list of up to 256 prepared statements for the array of prepared statement names that you provide. Requires you to have access to the workgroup to which the prepared statements belong. If a prepared statement cannot be retrieved for the name specified, the statement is listed in UnprocessedPreparedStatementNames.
   */
  batchGetPreparedStatement(params: Athena.Types.BatchGetPreparedStatementInput, callback?: (err: AWSError, data: Athena.Types.BatchGetPreparedStatementOutput) => void): Request<Athena.Types.BatchGetPreparedStatementOutput, AWSError>;
  /**
   * Returns the details of a single prepared statement or a list of up to 256 prepared statements for the array of prepared statement names that you provide. Requires you to have access to the workgroup to which the prepared statements belong. If a prepared statement cannot be retrieved for the name specified, the statement is listed in UnprocessedPreparedStatementNames.
   */
  batchGetPreparedStatement(callback?: (err: AWSError, data: Athena.Types.BatchGetPreparedStatementOutput) => void): Request<Athena.Types.BatchGetPreparedStatementOutput, AWSError>;
  /**
   * Returns the details of a single query execution or a list of up to 50 query executions, which you provide as an array of query execution ID strings. Requires you to have access to the workgroup in which the queries ran. To get a list of query execution IDs, use ListQueryExecutionsInput$WorkGroup. Query executions differ from named (saved) queries. Use BatchGetNamedQueryInput to get details about named queries.
   */
  batchGetQueryExecution(params: Athena.Types.BatchGetQueryExecutionInput, callback?: (err: AWSError, data: Athena.Types.BatchGetQueryExecutionOutput) => void): Request<Athena.Types.BatchGetQueryExecutionOutput, AWSError>;
  /**
   * Returns the details of a single query execution or a list of up to 50 query executions, which you provide as an array of query execution ID strings. Requires you to have access to the workgroup in which the queries ran. To get a list of query execution IDs, use ListQueryExecutionsInput$WorkGroup. Query executions differ from named (saved) queries. Use BatchGetNamedQueryInput to get details about named queries.
   */
  batchGetQueryExecution(callback?: (err: AWSError, data: Athena.Types.BatchGetQueryExecutionOutput) => void): Request<Athena.Types.BatchGetQueryExecutionOutput, AWSError>;
  /**
   * Cancels the capacity reservation with the specified name. Cancelled reservations remain in your account and will be deleted 45 days after cancellation. During the 45 days, you cannot re-purpose or reuse a reservation that has been cancelled, but you can refer to its tags and view it for historical reference. 
   */
  cancelCapacityReservation(params: Athena.Types.CancelCapacityReservationInput, callback?: (err: AWSError, data: Athena.Types.CancelCapacityReservationOutput) => void): Request<Athena.Types.CancelCapacityReservationOutput, AWSError>;
  /**
   * Cancels the capacity reservation with the specified name. Cancelled reservations remain in your account and will be deleted 45 days after cancellation. During the 45 days, you cannot re-purpose or reuse a reservation that has been cancelled, but you can refer to its tags and view it for historical reference. 
   */
  cancelCapacityReservation(callback?: (err: AWSError, data: Athena.Types.CancelCapacityReservationOutput) => void): Request<Athena.Types.CancelCapacityReservationOutput, AWSError>;
  /**
   * Creates a capacity reservation with the specified name and number of requested data processing units.
   */
  createCapacityReservation(params: Athena.Types.CreateCapacityReservationInput, callback?: (err: AWSError, data: Athena.Types.CreateCapacityReservationOutput) => void): Request<Athena.Types.CreateCapacityReservationOutput, AWSError>;
  /**
   * Creates a capacity reservation with the specified name and number of requested data processing units.
   */
  createCapacityReservation(callback?: (err: AWSError, data: Athena.Types.CreateCapacityReservationOutput) => void): Request<Athena.Types.CreateCapacityReservationOutput, AWSError>;
  /**
   * Creates (registers) a data catalog with the specified name and properties. Catalogs created are visible to all users of the same Amazon Web Services account.
   */
  createDataCatalog(params: Athena.Types.CreateDataCatalogInput, callback?: (err: AWSError, data: Athena.Types.CreateDataCatalogOutput) => void): Request<Athena.Types.CreateDataCatalogOutput, AWSError>;
  /**
   * Creates (registers) a data catalog with the specified name and properties. Catalogs created are visible to all users of the same Amazon Web Services account.
   */
  createDataCatalog(callback?: (err: AWSError, data: Athena.Types.CreateDataCatalogOutput) => void): Request<Athena.Types.CreateDataCatalogOutput, AWSError>;
  /**
   * Creates a named query in the specified workgroup. Requires that you have access to the workgroup. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  createNamedQuery(params: Athena.Types.CreateNamedQueryInput, callback?: (err: AWSError, data: Athena.Types.CreateNamedQueryOutput) => void): Request<Athena.Types.CreateNamedQueryOutput, AWSError>;
  /**
   * Creates a named query in the specified workgroup. Requires that you have access to the workgroup. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  createNamedQuery(callback?: (err: AWSError, data: Athena.Types.CreateNamedQueryOutput) => void): Request<Athena.Types.CreateNamedQueryOutput, AWSError>;
  /**
   * Creates an empty ipynb file in the specified Apache Spark enabled workgroup. Throws an error if a file in the workgroup with the same name already exists.
   */
  createNotebook(params: Athena.Types.CreateNotebookInput, callback?: (err: AWSError, data: Athena.Types.CreateNotebookOutput) => void): Request<Athena.Types.CreateNotebookOutput, AWSError>;
  /**
   * Creates an empty ipynb file in the specified Apache Spark enabled workgroup. Throws an error if a file in the workgroup with the same name already exists.
   */
  createNotebook(callback?: (err: AWSError, data: Athena.Types.CreateNotebookOutput) => void): Request<Athena.Types.CreateNotebookOutput, AWSError>;
  /**
   * Creates a prepared statement for use with SQL queries in Athena.
   */
  createPreparedStatement(params: Athena.Types.CreatePreparedStatementInput, callback?: (err: AWSError, data: Athena.Types.CreatePreparedStatementOutput) => void): Request<Athena.Types.CreatePreparedStatementOutput, AWSError>;
  /**
   * Creates a prepared statement for use with SQL queries in Athena.
   */
  createPreparedStatement(callback?: (err: AWSError, data: Athena.Types.CreatePreparedStatementOutput) => void): Request<Athena.Types.CreatePreparedStatementOutput, AWSError>;
  /**
   * Gets an authentication token and the URL at which the notebook can be accessed. During programmatic access, CreatePresignedNotebookUrl must be called every 10 minutes to refresh the authentication token. For information about granting programmatic access, see Grant programmatic access.
   */
  createPresignedNotebookUrl(params: Athena.Types.CreatePresignedNotebookUrlRequest, callback?: (err: AWSError, data: Athena.Types.CreatePresignedNotebookUrlResponse) => void): Request<Athena.Types.CreatePresignedNotebookUrlResponse, AWSError>;
  /**
   * Gets an authentication token and the URL at which the notebook can be accessed. During programmatic access, CreatePresignedNotebookUrl must be called every 10 minutes to refresh the authentication token. For information about granting programmatic access, see Grant programmatic access.
   */
  createPresignedNotebookUrl(callback?: (err: AWSError, data: Athena.Types.CreatePresignedNotebookUrlResponse) => void): Request<Athena.Types.CreatePresignedNotebookUrlResponse, AWSError>;
  /**
   * Creates a workgroup with the specified name. A workgroup can be an Apache Spark enabled workgroup or an Athena SQL workgroup.
   */
  createWorkGroup(params: Athena.Types.CreateWorkGroupInput, callback?: (err: AWSError, data: Athena.Types.CreateWorkGroupOutput) => void): Request<Athena.Types.CreateWorkGroupOutput, AWSError>;
  /**
   * Creates a workgroup with the specified name. A workgroup can be an Apache Spark enabled workgroup or an Athena SQL workgroup.
   */
  createWorkGroup(callback?: (err: AWSError, data: Athena.Types.CreateWorkGroupOutput) => void): Request<Athena.Types.CreateWorkGroupOutput, AWSError>;
  /**
   * Deletes a cancelled capacity reservation. A reservation must be cancelled before it can be deleted. A deleted reservation is immediately removed from your account and can no longer be referenced, including by its ARN. A deleted reservation cannot be called by GetCapacityReservation, and deleted reservations do not appear in the output of ListCapacityReservations.
   */
  deleteCapacityReservation(params: Athena.Types.DeleteCapacityReservationInput, callback?: (err: AWSError, data: Athena.Types.DeleteCapacityReservationOutput) => void): Request<Athena.Types.DeleteCapacityReservationOutput, AWSError>;
  /**
   * Deletes a cancelled capacity reservation. A reservation must be cancelled before it can be deleted. A deleted reservation is immediately removed from your account and can no longer be referenced, including by its ARN. A deleted reservation cannot be called by GetCapacityReservation, and deleted reservations do not appear in the output of ListCapacityReservations.
   */
  deleteCapacityReservation(callback?: (err: AWSError, data: Athena.Types.DeleteCapacityReservationOutput) => void): Request<Athena.Types.DeleteCapacityReservationOutput, AWSError>;
  /**
   * Deletes a data catalog.
   */
  deleteDataCatalog(params: Athena.Types.DeleteDataCatalogInput, callback?: (err: AWSError, data: Athena.Types.DeleteDataCatalogOutput) => void): Request<Athena.Types.DeleteDataCatalogOutput, AWSError>;
  /**
   * Deletes a data catalog.
   */
  deleteDataCatalog(callback?: (err: AWSError, data: Athena.Types.DeleteDataCatalogOutput) => void): Request<Athena.Types.DeleteDataCatalogOutput, AWSError>;
  /**
   * Deletes the named query if you have access to the workgroup in which the query was saved. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  deleteNamedQuery(params: Athena.Types.DeleteNamedQueryInput, callback?: (err: AWSError, data: Athena.Types.DeleteNamedQueryOutput) => void): Request<Athena.Types.DeleteNamedQueryOutput, AWSError>;
  /**
   * Deletes the named query if you have access to the workgroup in which the query was saved. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  deleteNamedQuery(callback?: (err: AWSError, data: Athena.Types.DeleteNamedQueryOutput) => void): Request<Athena.Types.DeleteNamedQueryOutput, AWSError>;
  /**
   * Deletes the specified notebook.
   */
  deleteNotebook(params: Athena.Types.DeleteNotebookInput, callback?: (err: AWSError, data: Athena.Types.DeleteNotebookOutput) => void): Request<Athena.Types.DeleteNotebookOutput, AWSError>;
  /**
   * Deletes the specified notebook.
   */
  deleteNotebook(callback?: (err: AWSError, data: Athena.Types.DeleteNotebookOutput) => void): Request<Athena.Types.DeleteNotebookOutput, AWSError>;
  /**
   * Deletes the prepared statement with the specified name from the specified workgroup.
   */
  deletePreparedStatement(params: Athena.Types.DeletePreparedStatementInput, callback?: (err: AWSError, data: Athena.Types.DeletePreparedStatementOutput) => void): Request<Athena.Types.DeletePreparedStatementOutput, AWSError>;
  /**
   * Deletes the prepared statement with the specified name from the specified workgroup.
   */
  deletePreparedStatement(callback?: (err: AWSError, data: Athena.Types.DeletePreparedStatementOutput) => void): Request<Athena.Types.DeletePreparedStatementOutput, AWSError>;
  /**
   * Deletes the workgroup with the specified name. The primary workgroup cannot be deleted.
   */
  deleteWorkGroup(params: Athena.Types.DeleteWorkGroupInput, callback?: (err: AWSError, data: Athena.Types.DeleteWorkGroupOutput) => void): Request<Athena.Types.DeleteWorkGroupOutput, AWSError>;
  /**
   * Deletes the workgroup with the specified name. The primary workgroup cannot be deleted.
   */
  deleteWorkGroup(callback?: (err: AWSError, data: Athena.Types.DeleteWorkGroupOutput) => void): Request<Athena.Types.DeleteWorkGroupOutput, AWSError>;
  /**
   * Exports the specified notebook and its metadata.
   */
  exportNotebook(params: Athena.Types.ExportNotebookInput, callback?: (err: AWSError, data: Athena.Types.ExportNotebookOutput) => void): Request<Athena.Types.ExportNotebookOutput, AWSError>;
  /**
   * Exports the specified notebook and its metadata.
   */
  exportNotebook(callback?: (err: AWSError, data: Athena.Types.ExportNotebookOutput) => void): Request<Athena.Types.ExportNotebookOutput, AWSError>;
  /**
   * Describes a previously submitted calculation execution.
   */
  getCalculationExecution(params: Athena.Types.GetCalculationExecutionRequest, callback?: (err: AWSError, data: Athena.Types.GetCalculationExecutionResponse) => void): Request<Athena.Types.GetCalculationExecutionResponse, AWSError>;
  /**
   * Describes a previously submitted calculation execution.
   */
  getCalculationExecution(callback?: (err: AWSError, data: Athena.Types.GetCalculationExecutionResponse) => void): Request<Athena.Types.GetCalculationExecutionResponse, AWSError>;
  /**
   * Retrieves the unencrypted code that was executed for the calculation.
   */
  getCalculationExecutionCode(params: Athena.Types.GetCalculationExecutionCodeRequest, callback?: (err: AWSError, data: Athena.Types.GetCalculationExecutionCodeResponse) => void): Request<Athena.Types.GetCalculationExecutionCodeResponse, AWSError>;
  /**
   * Retrieves the unencrypted code that was executed for the calculation.
   */
  getCalculationExecutionCode(callback?: (err: AWSError, data: Athena.Types.GetCalculationExecutionCodeResponse) => void): Request<Athena.Types.GetCalculationExecutionCodeResponse, AWSError>;
  /**
   * Gets the status of a current calculation.
   */
  getCalculationExecutionStatus(params: Athena.Types.GetCalculationExecutionStatusRequest, callback?: (err: AWSError, data: Athena.Types.GetCalculationExecutionStatusResponse) => void): Request<Athena.Types.GetCalculationExecutionStatusResponse, AWSError>;
  /**
   * Gets the status of a current calculation.
   */
  getCalculationExecutionStatus(callback?: (err: AWSError, data: Athena.Types.GetCalculationExecutionStatusResponse) => void): Request<Athena.Types.GetCalculationExecutionStatusResponse, AWSError>;
  /**
   * Gets the capacity assignment configuration for a capacity reservation, if one exists.
   */
  getCapacityAssignmentConfiguration(params: Athena.Types.GetCapacityAssignmentConfigurationInput, callback?: (err: AWSError, data: Athena.Types.GetCapacityAssignmentConfigurationOutput) => void): Request<Athena.Types.GetCapacityAssignmentConfigurationOutput, AWSError>;
  /**
   * Gets the capacity assignment configuration for a capacity reservation, if one exists.
   */
  getCapacityAssignmentConfiguration(callback?: (err: AWSError, data: Athena.Types.GetCapacityAssignmentConfigurationOutput) => void): Request<Athena.Types.GetCapacityAssignmentConfigurationOutput, AWSError>;
  /**
   * Returns information about the capacity reservation with the specified name.
   */
  getCapacityReservation(params: Athena.Types.GetCapacityReservationInput, callback?: (err: AWSError, data: Athena.Types.GetCapacityReservationOutput) => void): Request<Athena.Types.GetCapacityReservationOutput, AWSError>;
  /**
   * Returns information about the capacity reservation with the specified name.
   */
  getCapacityReservation(callback?: (err: AWSError, data: Athena.Types.GetCapacityReservationOutput) => void): Request<Athena.Types.GetCapacityReservationOutput, AWSError>;
  /**
   * Returns the specified data catalog.
   */
  getDataCatalog(params: Athena.Types.GetDataCatalogInput, callback?: (err: AWSError, data: Athena.Types.GetDataCatalogOutput) => void): Request<Athena.Types.GetDataCatalogOutput, AWSError>;
  /**
   * Returns the specified data catalog.
   */
  getDataCatalog(callback?: (err: AWSError, data: Athena.Types.GetDataCatalogOutput) => void): Request<Athena.Types.GetDataCatalogOutput, AWSError>;
  /**
   * Returns a database object for the specified database and data catalog.
   */
  getDatabase(params: Athena.Types.GetDatabaseInput, callback?: (err: AWSError, data: Athena.Types.GetDatabaseOutput) => void): Request<Athena.Types.GetDatabaseOutput, AWSError>;
  /**
   * Returns a database object for the specified database and data catalog.
   */
  getDatabase(callback?: (err: AWSError, data: Athena.Types.GetDatabaseOutput) => void): Request<Athena.Types.GetDatabaseOutput, AWSError>;
  /**
   * Returns information about a single query. Requires that you have access to the workgroup in which the query was saved.
   */
  getNamedQuery(params: Athena.Types.GetNamedQueryInput, callback?: (err: AWSError, data: Athena.Types.GetNamedQueryOutput) => void): Request<Athena.Types.GetNamedQueryOutput, AWSError>;
  /**
   * Returns information about a single query. Requires that you have access to the workgroup in which the query was saved.
   */
  getNamedQuery(callback?: (err: AWSError, data: Athena.Types.GetNamedQueryOutput) => void): Request<Athena.Types.GetNamedQueryOutput, AWSError>;
  /**
   * Retrieves notebook metadata for the specified notebook ID.
   */
  getNotebookMetadata(params: Athena.Types.GetNotebookMetadataInput, callback?: (err: AWSError, data: Athena.Types.GetNotebookMetadataOutput) => void): Request<Athena.Types.GetNotebookMetadataOutput, AWSError>;
  /**
   * Retrieves notebook metadata for the specified notebook ID.
   */
  getNotebookMetadata(callback?: (err: AWSError, data: Athena.Types.GetNotebookMetadataOutput) => void): Request<Athena.Types.GetNotebookMetadataOutput, AWSError>;
  /**
   * Retrieves the prepared statement with the specified name from the specified workgroup.
   */
  getPreparedStatement(params: Athena.Types.GetPreparedStatementInput, callback?: (err: AWSError, data: Athena.Types.GetPreparedStatementOutput) => void): Request<Athena.Types.GetPreparedStatementOutput, AWSError>;
  /**
   * Retrieves the prepared statement with the specified name from the specified workgroup.
   */
  getPreparedStatement(callback?: (err: AWSError, data: Athena.Types.GetPreparedStatementOutput) => void): Request<Athena.Types.GetPreparedStatementOutput, AWSError>;
  /**
   * Returns information about a single execution of a query if you have access to the workgroup in which the query ran. Each time a query executes, information about the query execution is saved with a unique ID.
   */
  getQueryExecution(params: Athena.Types.GetQueryExecutionInput, callback?: (err: AWSError, data: Athena.Types.GetQueryExecutionOutput) => void): Request<Athena.Types.GetQueryExecutionOutput, AWSError>;
  /**
   * Returns information about a single execution of a query if you have access to the workgroup in which the query ran. Each time a query executes, information about the query execution is saved with a unique ID.
   */
  getQueryExecution(callback?: (err: AWSError, data: Athena.Types.GetQueryExecutionOutput) => void): Request<Athena.Types.GetQueryExecutionOutput, AWSError>;
  /**
   * Streams the results of a single query execution specified by QueryExecutionId from the Athena query results location in Amazon S3. For more information, see Working with query results, recent queries, and output files in the Amazon Athena User Guide. This request does not execute the query but returns results. Use StartQueryExecution to run a query. To stream query results successfully, the IAM principal with permission to call GetQueryResults also must have permissions to the Amazon S3 GetObject action for the Athena query results location.  IAM principals with permission to the Amazon S3 GetObject action for the query results location are able to retrieve query results from Amazon S3 even if permission to the GetQueryResults action is denied. To restrict user or role access, ensure that Amazon S3 permissions to the Athena query location are denied. 
   */
  getQueryResults(params: Athena.Types.GetQueryResultsInput, callback?: (err: AWSError, data: Athena.Types.GetQueryResultsOutput) => void): Request<Athena.Types.GetQueryResultsOutput, AWSError>;
  /**
   * Streams the results of a single query execution specified by QueryExecutionId from the Athena query results location in Amazon S3. For more information, see Working with query results, recent queries, and output files in the Amazon Athena User Guide. This request does not execute the query but returns results. Use StartQueryExecution to run a query. To stream query results successfully, the IAM principal with permission to call GetQueryResults also must have permissions to the Amazon S3 GetObject action for the Athena query results location.  IAM principals with permission to the Amazon S3 GetObject action for the query results location are able to retrieve query results from Amazon S3 even if permission to the GetQueryResults action is denied. To restrict user or role access, ensure that Amazon S3 permissions to the Athena query location are denied. 
   */
  getQueryResults(callback?: (err: AWSError, data: Athena.Types.GetQueryResultsOutput) => void): Request<Athena.Types.GetQueryResultsOutput, AWSError>;
  /**
   * Returns query execution runtime statistics related to a single execution of a query if you have access to the workgroup in which the query ran. Query execution runtime statistics are returned only when QueryExecutionStatus$State is in a SUCCEEDED or FAILED state. Stage-level input and output row count and data size statistics are not shown when a query has row-level filters defined in Lake Formation.
   */
  getQueryRuntimeStatistics(params: Athena.Types.GetQueryRuntimeStatisticsInput, callback?: (err: AWSError, data: Athena.Types.GetQueryRuntimeStatisticsOutput) => void): Request<Athena.Types.GetQueryRuntimeStatisticsOutput, AWSError>;
  /**
   * Returns query execution runtime statistics related to a single execution of a query if you have access to the workgroup in which the query ran. Query execution runtime statistics are returned only when QueryExecutionStatus$State is in a SUCCEEDED or FAILED state. Stage-level input and output row count and data size statistics are not shown when a query has row-level filters defined in Lake Formation.
   */
  getQueryRuntimeStatistics(callback?: (err: AWSError, data: Athena.Types.GetQueryRuntimeStatisticsOutput) => void): Request<Athena.Types.GetQueryRuntimeStatisticsOutput, AWSError>;
  /**
   * Gets the full details of a previously created session, including the session status and configuration.
   */
  getSession(params: Athena.Types.GetSessionRequest, callback?: (err: AWSError, data: Athena.Types.GetSessionResponse) => void): Request<Athena.Types.GetSessionResponse, AWSError>;
  /**
   * Gets the full details of a previously created session, including the session status and configuration.
   */
  getSession(callback?: (err: AWSError, data: Athena.Types.GetSessionResponse) => void): Request<Athena.Types.GetSessionResponse, AWSError>;
  /**
   * Gets the current status of a session.
   */
  getSessionStatus(params: Athena.Types.GetSessionStatusRequest, callback?: (err: AWSError, data: Athena.Types.GetSessionStatusResponse) => void): Request<Athena.Types.GetSessionStatusResponse, AWSError>;
  /**
   * Gets the current status of a session.
   */
  getSessionStatus(callback?: (err: AWSError, data: Athena.Types.GetSessionStatusResponse) => void): Request<Athena.Types.GetSessionStatusResponse, AWSError>;
  /**
   * Returns table metadata for the specified catalog, database, and table.
   */
  getTableMetadata(params: Athena.Types.GetTableMetadataInput, callback?: (err: AWSError, data: Athena.Types.GetTableMetadataOutput) => void): Request<Athena.Types.GetTableMetadataOutput, AWSError>;
  /**
   * Returns table metadata for the specified catalog, database, and table.
   */
  getTableMetadata(callback?: (err: AWSError, data: Athena.Types.GetTableMetadataOutput) => void): Request<Athena.Types.GetTableMetadataOutput, AWSError>;
  /**
   * Returns information about the workgroup with the specified name.
   */
  getWorkGroup(params: Athena.Types.GetWorkGroupInput, callback?: (err: AWSError, data: Athena.Types.GetWorkGroupOutput) => void): Request<Athena.Types.GetWorkGroupOutput, AWSError>;
  /**
   * Returns information about the workgroup with the specified name.
   */
  getWorkGroup(callback?: (err: AWSError, data: Athena.Types.GetWorkGroupOutput) => void): Request<Athena.Types.GetWorkGroupOutput, AWSError>;
  /**
   * Imports a single ipynb file to a Spark enabled workgroup. The maximum file size that can be imported is 10 megabytes. If an ipynb file with the same name already exists in the workgroup, throws an error.
   */
  importNotebook(params: Athena.Types.ImportNotebookInput, callback?: (err: AWSError, data: Athena.Types.ImportNotebookOutput) => void): Request<Athena.Types.ImportNotebookOutput, AWSError>;
  /**
   * Imports a single ipynb file to a Spark enabled workgroup. The maximum file size that can be imported is 10 megabytes. If an ipynb file with the same name already exists in the workgroup, throws an error.
   */
  importNotebook(callback?: (err: AWSError, data: Athena.Types.ImportNotebookOutput) => void): Request<Athena.Types.ImportNotebookOutput, AWSError>;
  /**
   * Returns the supported DPU sizes for the supported application runtimes (for example, Athena notebook version 1). 
   */
  listApplicationDPUSizes(params: Athena.Types.ListApplicationDPUSizesInput, callback?: (err: AWSError, data: Athena.Types.ListApplicationDPUSizesOutput) => void): Request<Athena.Types.ListApplicationDPUSizesOutput, AWSError>;
  /**
   * Returns the supported DPU sizes for the supported application runtimes (for example, Athena notebook version 1). 
   */
  listApplicationDPUSizes(callback?: (err: AWSError, data: Athena.Types.ListApplicationDPUSizesOutput) => void): Request<Athena.Types.ListApplicationDPUSizesOutput, AWSError>;
  /**
   * Lists the calculations that have been submitted to a session in descending order. Newer calculations are listed first; older calculations are listed later.
   */
  listCalculationExecutions(params: Athena.Types.ListCalculationExecutionsRequest, callback?: (err: AWSError, data: Athena.Types.ListCalculationExecutionsResponse) => void): Request<Athena.Types.ListCalculationExecutionsResponse, AWSError>;
  /**
   * Lists the calculations that have been submitted to a session in descending order. Newer calculations are listed first; older calculations are listed later.
   */
  listCalculationExecutions(callback?: (err: AWSError, data: Athena.Types.ListCalculationExecutionsResponse) => void): Request<Athena.Types.ListCalculationExecutionsResponse, AWSError>;
  /**
   * Lists the capacity reservations for the current account.
   */
  listCapacityReservations(params: Athena.Types.ListCapacityReservationsInput, callback?: (err: AWSError, data: Athena.Types.ListCapacityReservationsOutput) => void): Request<Athena.Types.ListCapacityReservationsOutput, AWSError>;
  /**
   * Lists the capacity reservations for the current account.
   */
  listCapacityReservations(callback?: (err: AWSError, data: Athena.Types.ListCapacityReservationsOutput) => void): Request<Athena.Types.ListCapacityReservationsOutput, AWSError>;
  /**
   * Lists the data catalogs in the current Amazon Web Services account.  In the Athena console, data catalogs are listed as "data sources" on the Data sources page under the Data source name column. 
   */
  listDataCatalogs(params: Athena.Types.ListDataCatalogsInput, callback?: (err: AWSError, data: Athena.Types.ListDataCatalogsOutput) => void): Request<Athena.Types.ListDataCatalogsOutput, AWSError>;
  /**
   * Lists the data catalogs in the current Amazon Web Services account.  In the Athena console, data catalogs are listed as "data sources" on the Data sources page under the Data source name column. 
   */
  listDataCatalogs(callback?: (err: AWSError, data: Athena.Types.ListDataCatalogsOutput) => void): Request<Athena.Types.ListDataCatalogsOutput, AWSError>;
  /**
   * Lists the databases in the specified data catalog.
   */
  listDatabases(params: Athena.Types.ListDatabasesInput, callback?: (err: AWSError, data: Athena.Types.ListDatabasesOutput) => void): Request<Athena.Types.ListDatabasesOutput, AWSError>;
  /**
   * Lists the databases in the specified data catalog.
   */
  listDatabases(callback?: (err: AWSError, data: Athena.Types.ListDatabasesOutput) => void): Request<Athena.Types.ListDatabasesOutput, AWSError>;
  /**
   * Returns a list of engine versions that are available to choose from, including the Auto option.
   */
  listEngineVersions(params: Athena.Types.ListEngineVersionsInput, callback?: (err: AWSError, data: Athena.Types.ListEngineVersionsOutput) => void): Request<Athena.Types.ListEngineVersionsOutput, AWSError>;
  /**
   * Returns a list of engine versions that are available to choose from, including the Auto option.
   */
  listEngineVersions(callback?: (err: AWSError, data: Athena.Types.ListEngineVersionsOutput) => void): Request<Athena.Types.ListEngineVersionsOutput, AWSError>;
  /**
   * Lists, in descending order, the executors that joined a session. Newer executors are listed first; older executors are listed later. The result can be optionally filtered by state.
   */
  listExecutors(params: Athena.Types.ListExecutorsRequest, callback?: (err: AWSError, data: Athena.Types.ListExecutorsResponse) => void): Request<Athena.Types.ListExecutorsResponse, AWSError>;
  /**
   * Lists, in descending order, the executors that joined a session. Newer executors are listed first; older executors are listed later. The result can be optionally filtered by state.
   */
  listExecutors(callback?: (err: AWSError, data: Athena.Types.ListExecutorsResponse) => void): Request<Athena.Types.ListExecutorsResponse, AWSError>;
  /**
   * Provides a list of available query IDs only for queries saved in the specified workgroup. Requires that you have access to the specified workgroup. If a workgroup is not specified, lists the saved queries for the primary workgroup. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  listNamedQueries(params: Athena.Types.ListNamedQueriesInput, callback?: (err: AWSError, data: Athena.Types.ListNamedQueriesOutput) => void): Request<Athena.Types.ListNamedQueriesOutput, AWSError>;
  /**
   * Provides a list of available query IDs only for queries saved in the specified workgroup. Requires that you have access to the specified workgroup. If a workgroup is not specified, lists the saved queries for the primary workgroup. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  listNamedQueries(callback?: (err: AWSError, data: Athena.Types.ListNamedQueriesOutput) => void): Request<Athena.Types.ListNamedQueriesOutput, AWSError>;
  /**
   * Displays the notebook files for the specified workgroup in paginated format.
   */
  listNotebookMetadata(params: Athena.Types.ListNotebookMetadataInput, callback?: (err: AWSError, data: Athena.Types.ListNotebookMetadataOutput) => void): Request<Athena.Types.ListNotebookMetadataOutput, AWSError>;
  /**
   * Displays the notebook files for the specified workgroup in paginated format.
   */
  listNotebookMetadata(callback?: (err: AWSError, data: Athena.Types.ListNotebookMetadataOutput) => void): Request<Athena.Types.ListNotebookMetadataOutput, AWSError>;
  /**
   * Lists, in descending order, the sessions that have been created in a notebook that are in an active state like CREATING, CREATED, IDLE or BUSY. Newer sessions are listed first; older sessions are listed later.
   */
  listNotebookSessions(params: Athena.Types.ListNotebookSessionsRequest, callback?: (err: AWSError, data: Athena.Types.ListNotebookSessionsResponse) => void): Request<Athena.Types.ListNotebookSessionsResponse, AWSError>;
  /**
   * Lists, in descending order, the sessions that have been created in a notebook that are in an active state like CREATING, CREATED, IDLE or BUSY. Newer sessions are listed first; older sessions are listed later.
   */
  listNotebookSessions(callback?: (err: AWSError, data: Athena.Types.ListNotebookSessionsResponse) => void): Request<Athena.Types.ListNotebookSessionsResponse, AWSError>;
  /**
   * Lists the prepared statements in the specified workgroup.
   */
  listPreparedStatements(params: Athena.Types.ListPreparedStatementsInput, callback?: (err: AWSError, data: Athena.Types.ListPreparedStatementsOutput) => void): Request<Athena.Types.ListPreparedStatementsOutput, AWSError>;
  /**
   * Lists the prepared statements in the specified workgroup.
   */
  listPreparedStatements(callback?: (err: AWSError, data: Athena.Types.ListPreparedStatementsOutput) => void): Request<Athena.Types.ListPreparedStatementsOutput, AWSError>;
  /**
   * Provides a list of available query execution IDs for the queries in the specified workgroup. If a workgroup is not specified, returns a list of query execution IDs for the primary workgroup. Requires you to have access to the workgroup in which the queries ran. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  listQueryExecutions(params: Athena.Types.ListQueryExecutionsInput, callback?: (err: AWSError, data: Athena.Types.ListQueryExecutionsOutput) => void): Request<Athena.Types.ListQueryExecutionsOutput, AWSError>;
  /**
   * Provides a list of available query execution IDs for the queries in the specified workgroup. If a workgroup is not specified, returns a list of query execution IDs for the primary workgroup. Requires you to have access to the workgroup in which the queries ran. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  listQueryExecutions(callback?: (err: AWSError, data: Athena.Types.ListQueryExecutionsOutput) => void): Request<Athena.Types.ListQueryExecutionsOutput, AWSError>;
  /**
   * Lists the sessions in a workgroup that are in an active state like CREATING, CREATED, IDLE, or BUSY. Newer sessions are listed first; older sessions are listed later.
   */
  listSessions(params: Athena.Types.ListSessionsRequest, callback?: (err: AWSError, data: Athena.Types.ListSessionsResponse) => void): Request<Athena.Types.ListSessionsResponse, AWSError>;
  /**
   * Lists the sessions in a workgroup that are in an active state like CREATING, CREATED, IDLE, or BUSY. Newer sessions are listed first; older sessions are listed later.
   */
  listSessions(callback?: (err: AWSError, data: Athena.Types.ListSessionsResponse) => void): Request<Athena.Types.ListSessionsResponse, AWSError>;
  /**
   * Lists the metadata for the tables in the specified data catalog database.
   */
  listTableMetadata(params: Athena.Types.ListTableMetadataInput, callback?: (err: AWSError, data: Athena.Types.ListTableMetadataOutput) => void): Request<Athena.Types.ListTableMetadataOutput, AWSError>;
  /**
   * Lists the metadata for the tables in the specified data catalog database.
   */
  listTableMetadata(callback?: (err: AWSError, data: Athena.Types.ListTableMetadataOutput) => void): Request<Athena.Types.ListTableMetadataOutput, AWSError>;
  /**
   * Lists the tags associated with an Athena resource.
   */
  listTagsForResource(params: Athena.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: Athena.Types.ListTagsForResourceOutput) => void): Request<Athena.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the tags associated with an Athena resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Athena.Types.ListTagsForResourceOutput) => void): Request<Athena.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists available workgroups for the account.
   */
  listWorkGroups(params: Athena.Types.ListWorkGroupsInput, callback?: (err: AWSError, data: Athena.Types.ListWorkGroupsOutput) => void): Request<Athena.Types.ListWorkGroupsOutput, AWSError>;
  /**
   * Lists available workgroups for the account.
   */
  listWorkGroups(callback?: (err: AWSError, data: Athena.Types.ListWorkGroupsOutput) => void): Request<Athena.Types.ListWorkGroupsOutput, AWSError>;
  /**
   * Puts a new capacity assignment configuration for a specified capacity reservation. If a capacity assignment configuration already exists for the capacity reservation, replaces the existing capacity assignment configuration.
   */
  putCapacityAssignmentConfiguration(params: Athena.Types.PutCapacityAssignmentConfigurationInput, callback?: (err: AWSError, data: Athena.Types.PutCapacityAssignmentConfigurationOutput) => void): Request<Athena.Types.PutCapacityAssignmentConfigurationOutput, AWSError>;
  /**
   * Puts a new capacity assignment configuration for a specified capacity reservation. If a capacity assignment configuration already exists for the capacity reservation, replaces the existing capacity assignment configuration.
   */
  putCapacityAssignmentConfiguration(callback?: (err: AWSError, data: Athena.Types.PutCapacityAssignmentConfigurationOutput) => void): Request<Athena.Types.PutCapacityAssignmentConfigurationOutput, AWSError>;
  /**
   * Submits calculations for execution within a session. You can supply the code to run as an inline code block within the request.
   */
  startCalculationExecution(params: Athena.Types.StartCalculationExecutionRequest, callback?: (err: AWSError, data: Athena.Types.StartCalculationExecutionResponse) => void): Request<Athena.Types.StartCalculationExecutionResponse, AWSError>;
  /**
   * Submits calculations for execution within a session. You can supply the code to run as an inline code block within the request.
   */
  startCalculationExecution(callback?: (err: AWSError, data: Athena.Types.StartCalculationExecutionResponse) => void): Request<Athena.Types.StartCalculationExecutionResponse, AWSError>;
  /**
   * Runs the SQL query statements contained in the Query. Requires you to have access to the workgroup in which the query ran. Running queries against an external catalog requires GetDataCatalog permission to the catalog. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  startQueryExecution(params: Athena.Types.StartQueryExecutionInput, callback?: (err: AWSError, data: Athena.Types.StartQueryExecutionOutput) => void): Request<Athena.Types.StartQueryExecutionOutput, AWSError>;
  /**
   * Runs the SQL query statements contained in the Query. Requires you to have access to the workgroup in which the query ran. Running queries against an external catalog requires GetDataCatalog permission to the catalog. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  startQueryExecution(callback?: (err: AWSError, data: Athena.Types.StartQueryExecutionOutput) => void): Request<Athena.Types.StartQueryExecutionOutput, AWSError>;
  /**
   * Creates a session for running calculations within a workgroup. The session is ready when it reaches an IDLE state.
   */
  startSession(params: Athena.Types.StartSessionRequest, callback?: (err: AWSError, data: Athena.Types.StartSessionResponse) => void): Request<Athena.Types.StartSessionResponse, AWSError>;
  /**
   * Creates a session for running calculations within a workgroup. The session is ready when it reaches an IDLE state.
   */
  startSession(callback?: (err: AWSError, data: Athena.Types.StartSessionResponse) => void): Request<Athena.Types.StartSessionResponse, AWSError>;
  /**
   * Requests the cancellation of a calculation. A StopCalculationExecution call on a calculation that is already in a terminal state (for example, STOPPED, FAILED, or COMPLETED) succeeds but has no effect.  Cancelling a calculation is done on a best effort basis. If a calculation cannot be cancelled, you can be charged for its completion. If you are concerned about being charged for a calculation that cannot be cancelled, consider terminating the session in which the calculation is running. 
   */
  stopCalculationExecution(params: Athena.Types.StopCalculationExecutionRequest, callback?: (err: AWSError, data: Athena.Types.StopCalculationExecutionResponse) => void): Request<Athena.Types.StopCalculationExecutionResponse, AWSError>;
  /**
   * Requests the cancellation of a calculation. A StopCalculationExecution call on a calculation that is already in a terminal state (for example, STOPPED, FAILED, or COMPLETED) succeeds but has no effect.  Cancelling a calculation is done on a best effort basis. If a calculation cannot be cancelled, you can be charged for its completion. If you are concerned about being charged for a calculation that cannot be cancelled, consider terminating the session in which the calculation is running. 
   */
  stopCalculationExecution(callback?: (err: AWSError, data: Athena.Types.StopCalculationExecutionResponse) => void): Request<Athena.Types.StopCalculationExecutionResponse, AWSError>;
  /**
   * Stops a query execution. Requires you to have access to the workgroup in which the query ran. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  stopQueryExecution(params: Athena.Types.StopQueryExecutionInput, callback?: (err: AWSError, data: Athena.Types.StopQueryExecutionOutput) => void): Request<Athena.Types.StopQueryExecutionOutput, AWSError>;
  /**
   * Stops a query execution. Requires you to have access to the workgroup in which the query ran. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  stopQueryExecution(callback?: (err: AWSError, data: Athena.Types.StopQueryExecutionOutput) => void): Request<Athena.Types.StopQueryExecutionOutput, AWSError>;
  /**
   * Adds one or more tags to an Athena resource. A tag is a label that you assign to a resource. Each tag consists of a key and an optional value, both of which you define. For example, you can use tags to categorize Athena workgroups, data catalogs, or capacity reservations by purpose, owner, or environment. Use a consistent set of tag keys to make it easier to search and filter the resources in your account. For best practices, see Tagging Best Practices. Tag keys can be from 1 to 128 UTF-8 Unicode characters, and tag values can be from 0 to 256 UTF-8 Unicode characters. Tags can use letters and numbers representable in UTF-8, and the following characters: + - = . _ : / @. Tag keys and values are case-sensitive. Tag keys must be unique per resource. If you specify more than one tag, separate them by commas.
   */
  tagResource(params: Athena.Types.TagResourceInput, callback?: (err: AWSError, data: Athena.Types.TagResourceOutput) => void): Request<Athena.Types.TagResourceOutput, AWSError>;
  /**
   * Adds one or more tags to an Athena resource. A tag is a label that you assign to a resource. Each tag consists of a key and an optional value, both of which you define. For example, you can use tags to categorize Athena workgroups, data catalogs, or capacity reservations by purpose, owner, or environment. Use a consistent set of tag keys to make it easier to search and filter the resources in your account. For best practices, see Tagging Best Practices. Tag keys can be from 1 to 128 UTF-8 Unicode characters, and tag values can be from 0 to 256 UTF-8 Unicode characters. Tags can use letters and numbers representable in UTF-8, and the following characters: + - = . _ : / @. Tag keys and values are case-sensitive. Tag keys must be unique per resource. If you specify more than one tag, separate them by commas.
   */
  tagResource(callback?: (err: AWSError, data: Athena.Types.TagResourceOutput) => void): Request<Athena.Types.TagResourceOutput, AWSError>;
  /**
   * Terminates an active session. A TerminateSession call on a session that is already inactive (for example, in a FAILED, TERMINATED or TERMINATING state) succeeds but has no effect. Calculations running in the session when TerminateSession is called are forcefully stopped, but may display as FAILED instead of STOPPED.
   */
  terminateSession(params: Athena.Types.TerminateSessionRequest, callback?: (err: AWSError, data: Athena.Types.TerminateSessionResponse) => void): Request<Athena.Types.TerminateSessionResponse, AWSError>;
  /**
   * Terminates an active session. A TerminateSession call on a session that is already inactive (for example, in a FAILED, TERMINATED or TERMINATING state) succeeds but has no effect. Calculations running in the session when TerminateSession is called are forcefully stopped, but may display as FAILED instead of STOPPED.
   */
  terminateSession(callback?: (err: AWSError, data: Athena.Types.TerminateSessionResponse) => void): Request<Athena.Types.TerminateSessionResponse, AWSError>;
  /**
   * Removes one or more tags from an Athena resource.
   */
  untagResource(params: Athena.Types.UntagResourceInput, callback?: (err: AWSError, data: Athena.Types.UntagResourceOutput) => void): Request<Athena.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from an Athena resource.
   */
  untagResource(callback?: (err: AWSError, data: Athena.Types.UntagResourceOutput) => void): Request<Athena.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates the number of requested data processing units for the capacity reservation with the specified name.
   */
  updateCapacityReservation(params: Athena.Types.UpdateCapacityReservationInput, callback?: (err: AWSError, data: Athena.Types.UpdateCapacityReservationOutput) => void): Request<Athena.Types.UpdateCapacityReservationOutput, AWSError>;
  /**
   * Updates the number of requested data processing units for the capacity reservation with the specified name.
   */
  updateCapacityReservation(callback?: (err: AWSError, data: Athena.Types.UpdateCapacityReservationOutput) => void): Request<Athena.Types.UpdateCapacityReservationOutput, AWSError>;
  /**
   * Updates the data catalog that has the specified name.
   */
  updateDataCatalog(params: Athena.Types.UpdateDataCatalogInput, callback?: (err: AWSError, data: Athena.Types.UpdateDataCatalogOutput) => void): Request<Athena.Types.UpdateDataCatalogOutput, AWSError>;
  /**
   * Updates the data catalog that has the specified name.
   */
  updateDataCatalog(callback?: (err: AWSError, data: Athena.Types.UpdateDataCatalogOutput) => void): Request<Athena.Types.UpdateDataCatalogOutput, AWSError>;
  /**
   * Updates a NamedQuery object. The database or workgroup cannot be updated.
   */
  updateNamedQuery(params: Athena.Types.UpdateNamedQueryInput, callback?: (err: AWSError, data: Athena.Types.UpdateNamedQueryOutput) => void): Request<Athena.Types.UpdateNamedQueryOutput, AWSError>;
  /**
   * Updates a NamedQuery object. The database or workgroup cannot be updated.
   */
  updateNamedQuery(callback?: (err: AWSError, data: Athena.Types.UpdateNamedQueryOutput) => void): Request<Athena.Types.UpdateNamedQueryOutput, AWSError>;
  /**
   * Updates the contents of a Spark notebook.
   */
  updateNotebook(params: Athena.Types.UpdateNotebookInput, callback?: (err: AWSError, data: Athena.Types.UpdateNotebookOutput) => void): Request<Athena.Types.UpdateNotebookOutput, AWSError>;
  /**
   * Updates the contents of a Spark notebook.
   */
  updateNotebook(callback?: (err: AWSError, data: Athena.Types.UpdateNotebookOutput) => void): Request<Athena.Types.UpdateNotebookOutput, AWSError>;
  /**
   * Updates the metadata for a notebook.
   */
  updateNotebookMetadata(params: Athena.Types.UpdateNotebookMetadataInput, callback?: (err: AWSError, data: Athena.Types.UpdateNotebookMetadataOutput) => void): Request<Athena.Types.UpdateNotebookMetadataOutput, AWSError>;
  /**
   * Updates the metadata for a notebook.
   */
  updateNotebookMetadata(callback?: (err: AWSError, data: Athena.Types.UpdateNotebookMetadataOutput) => void): Request<Athena.Types.UpdateNotebookMetadataOutput, AWSError>;
  /**
   * Updates a prepared statement.
   */
  updatePreparedStatement(params: Athena.Types.UpdatePreparedStatementInput, callback?: (err: AWSError, data: Athena.Types.UpdatePreparedStatementOutput) => void): Request<Athena.Types.UpdatePreparedStatementOutput, AWSError>;
  /**
   * Updates a prepared statement.
   */
  updatePreparedStatement(callback?: (err: AWSError, data: Athena.Types.UpdatePreparedStatementOutput) => void): Request<Athena.Types.UpdatePreparedStatementOutput, AWSError>;
  /**
   * Updates the workgroup with the specified name. The workgroup's name cannot be changed. Only ConfigurationUpdates can be specified.
   */
  updateWorkGroup(params: Athena.Types.UpdateWorkGroupInput, callback?: (err: AWSError, data: Athena.Types.UpdateWorkGroupOutput) => void): Request<Athena.Types.UpdateWorkGroupOutput, AWSError>;
  /**
   * Updates the workgroup with the specified name. The workgroup's name cannot be changed. Only ConfigurationUpdates can be specified.
   */
  updateWorkGroup(callback?: (err: AWSError, data: Athena.Types.UpdateWorkGroupOutput) => void): Request<Athena.Types.UpdateWorkGroupOutput, AWSError>;
}
declare namespace Athena {
  export interface AclConfiguration {
    /**
     * The Amazon S3 canned ACL that Athena should specify when storing query results. Currently the only supported canned ACL is BUCKET_OWNER_FULL_CONTROL. If a query runs in a workgroup and the workgroup overrides client-side settings, then the Amazon S3 canned ACL specified in the workgroup's settings is used for all queries that run in the workgroup. For more information about Amazon S3 canned ACLs, see Canned ACL in the Amazon S3 User Guide.
     */
    S3AclOption: S3AclOption;
  }
  export type Age = number;
  export type AllocatedDpusInteger = number;
  export type AmazonResourceName = string;
  export interface ApplicationDPUSizes {
    /**
     * The name of the supported application runtime (for example, Athena notebook version 1).
     */
    ApplicationRuntimeId?: NameString;
    /**
     * A list of the supported DPU sizes that the application runtime supports.
     */
    SupportedDPUSizes?: SupportedDPUSizeList;
  }
  export type ApplicationDPUSizesList = ApplicationDPUSizes[];
  export interface AthenaError {
    /**
     * An integer value that specifies the category of a query failure error. The following list shows the category for each integer value.  1 - System  2 - User  3 - Other
     */
    ErrorCategory?: ErrorCategory;
    /**
     * An integer value that provides specific information about an Athena query error. For the meaning of specific values, see the Error Type Reference in the Amazon Athena User Guide.
     */
    ErrorType?: ErrorType;
    /**
     * True if the query might succeed if resubmitted.
     */
    Retryable?: Boolean;
    /**
     * Contains a short description of the error that occurred.
     */
    ErrorMessage?: String;
  }
  export type AuthToken = string;
  export type AwsAccountId = string;
  export interface BatchGetNamedQueryInput {
    /**
     * An array of query IDs.
     */
    NamedQueryIds: NamedQueryIdList;
  }
  export interface BatchGetNamedQueryOutput {
    /**
     * Information about the named query IDs submitted.
     */
    NamedQueries?: NamedQueryList;
    /**
     * Information about provided query IDs.
     */
    UnprocessedNamedQueryIds?: UnprocessedNamedQueryIdList;
  }
  export interface BatchGetPreparedStatementInput {
    /**
     * A list of prepared statement names to return.
     */
    PreparedStatementNames: PreparedStatementNameList;
    /**
     * The name of the workgroup to which the prepared statements belong.
     */
    WorkGroup: WorkGroupName;
  }
  export interface BatchGetPreparedStatementOutput {
    /**
     * The list of prepared statements returned.
     */
    PreparedStatements?: PreparedStatementDetailsList;
    /**
     * A list of one or more prepared statements that were requested but could not be returned.
     */
    UnprocessedPreparedStatementNames?: UnprocessedPreparedStatementNameList;
  }
  export interface BatchGetQueryExecutionInput {
    /**
     * An array of query execution IDs.
     */
    QueryExecutionIds: QueryExecutionIdList;
  }
  export interface BatchGetQueryExecutionOutput {
    /**
     * Information about a query execution.
     */
    QueryExecutions?: QueryExecutionList;
    /**
     * Information about the query executions that failed to run.
     */
    UnprocessedQueryExecutionIds?: UnprocessedQueryExecutionIdList;
  }
  export type Boolean = boolean;
  export type BoxedBoolean = boolean;
  export type BytesScannedCutoffValue = number;
  export interface CalculationConfiguration {
    /**
     * A string that contains the code for the calculation.
     */
    CodeBlock?: CodeBlock;
  }
  export type CalculationExecutionId = string;
  export type CalculationExecutionState = "CREATING"|"CREATED"|"QUEUED"|"RUNNING"|"CANCELING"|"CANCELED"|"COMPLETED"|"FAILED"|string;
  export interface CalculationResult {
    /**
     * The Amazon S3 location of the stdout file for the calculation.
     */
    StdOutS3Uri?: S3Uri;
    /**
     * The Amazon S3 location of the stderr error messages file for the calculation.
     */
    StdErrorS3Uri?: S3Uri;
    /**
     * The Amazon S3 location of the folder for the calculation results.
     */
    ResultS3Uri?: S3Uri;
    /**
     * The data format of the calculation result.
     */
    ResultType?: CalculationResultType;
  }
  export type CalculationResultType = string;
  export interface CalculationStatistics {
    /**
     * The data processing unit execution time in milliseconds for the calculation.
     */
    DpuExecutionInMillis?: Long;
    /**
     * The progress of the calculation.
     */
    Progress?: DescriptionString;
  }
  export interface CalculationStatus {
    /**
     * The date and time the calculation was submitted for processing.
     */
    SubmissionDateTime?: _Date;
    /**
     * The date and time the calculation completed processing.
     */
    CompletionDateTime?: _Date;
    /**
     * The state of the calculation execution. A description of each state follows.  CREATING - The calculation is in the process of being created.  CREATED - The calculation has been created and is ready to run.  QUEUED - The calculation has been queued for processing.  RUNNING - The calculation is running.  CANCELING - A request to cancel the calculation has been received and the system is working to stop it.  CANCELED - The calculation is no longer running as the result of a cancel request.  COMPLETED - The calculation has completed without error.  FAILED - The calculation failed and is no longer running.
     */
    State?: CalculationExecutionState;
    /**
     * The reason for the calculation state change (for example, the calculation was canceled because the session was terminated).
     */
    StateChangeReason?: DescriptionString;
  }
  export interface CalculationSummary {
    /**
     * The calculation execution UUID.
     */
    CalculationExecutionId?: CalculationExecutionId;
    /**
     * A description of the calculation.
     */
    Description?: DescriptionString;
    /**
     * Contains information about the status of the calculation.
     */
    Status?: CalculationStatus;
  }
  export type CalculationsList = CalculationSummary[];
  export interface CancelCapacityReservationInput {
    /**
     * The name of the capacity reservation to cancel.
     */
    Name: CapacityReservationName;
  }
  export interface CancelCapacityReservationOutput {
  }
  export interface CapacityAllocation {
    /**
     * The status of the capacity allocation.
     */
    Status: CapacityAllocationStatus;
    /**
     * The status message of the capacity allocation.
     */
    StatusMessage?: String;
    /**
     * The time when the capacity allocation was requested.
     */
    RequestTime: Timestamp;
    /**
     * The time when the capacity allocation request was completed.
     */
    RequestCompletionTime?: Timestamp;
  }
  export type CapacityAllocationStatus = "PENDING"|"SUCCEEDED"|"FAILED"|string;
  export interface CapacityAssignment {
    /**
     * The list of workgroup names for the capacity assignment.
     */
    WorkGroupNames?: WorkGroupNamesList;
  }
  export interface CapacityAssignmentConfiguration {
    /**
     * The name of the reservation that the capacity assignment configuration is for.
     */
    CapacityReservationName?: CapacityReservationName;
    /**
     * The list of assignments that make up the capacity assignment configuration.
     */
    CapacityAssignments?: CapacityAssignmentsList;
  }
  export type CapacityAssignmentsList = CapacityAssignment[];
  export interface CapacityReservation {
    /**
     * The name of the capacity reservation.
     */
    Name: CapacityReservationName;
    /**
     * The status of the capacity reservation.
     */
    Status: CapacityReservationStatus;
    /**
     * The number of data processing units requested.
     */
    TargetDpus: TargetDpusInteger;
    /**
     * The number of data processing units currently allocated.
     */
    AllocatedDpus: AllocatedDpusInteger;
    LastAllocation?: CapacityAllocation;
    /**
     * The time of the most recent capacity allocation that succeeded.
     */
    LastSuccessfulAllocationTime?: Timestamp;
    /**
     * The time in UTC epoch millis when the capacity reservation was created.
     */
    CreationTime: Timestamp;
  }
  export type CapacityReservationName = string;
  export type CapacityReservationStatus = "PENDING"|"ACTIVE"|"CANCELLING"|"CANCELLED"|"FAILED"|"UPDATE_PENDING"|string;
  export type CapacityReservationsList = CapacityReservation[];
  export type CatalogNameString = string;
  export type ClientRequestToken = string;
  export type CodeBlock = string;
  export interface Column {
    /**
     * The name of the column.
     */
    Name: NameString;
    /**
     * The data type of the column.
     */
    Type?: TypeString;
    /**
     * Optional information about the column.
     */
    Comment?: CommentString;
  }
  export interface ColumnInfo {
    /**
     * The catalog to which the query results belong.
     */
    CatalogName?: String;
    /**
     * The schema name (database name) to which the query results belong.
     */
    SchemaName?: String;
    /**
     * The table name for the query results.
     */
    TableName?: String;
    /**
     * The name of the column.
     */
    Name: String;
    /**
     * A column label.
     */
    Label?: String;
    /**
     * The data type of the column.
     */
    Type: String;
    /**
     * For DECIMAL data types, specifies the total number of digits, up to 38. For performance reasons, we recommend up to 18 digits.
     */
    Precision?: Integer;
    /**
     * For DECIMAL data types, specifies the total number of digits in the fractional part of the value. Defaults to 0.
     */
    Scale?: Integer;
    /**
     * Indicates the column's nullable status.
     */
    Nullable?: ColumnNullable;
    /**
     * Indicates whether values in the column are case-sensitive.
     */
    CaseSensitive?: Boolean;
  }
  export type ColumnInfoList = ColumnInfo[];
  export type ColumnList = Column[];
  export type ColumnNullable = "NOT_NULL"|"NULLABLE"|"UNKNOWN"|string;
  export type CommentString = string;
  export type CoordinatorDpuSize = number;
  export interface CreateCapacityReservationInput {
    /**
     * The number of requested data processing units.
     */
    TargetDpus: TargetDpusInteger;
    /**
     * The name of the capacity reservation to create.
     */
    Name: CapacityReservationName;
    /**
     * The tags for the capacity reservation.
     */
    Tags?: TagList;
  }
  export interface CreateCapacityReservationOutput {
  }
  export interface CreateDataCatalogInput {
    /**
     * The name of the data catalog to create. The catalog name must be unique for the Amazon Web Services account and can use a maximum of 127 alphanumeric, underscore, at sign, or hyphen characters. The remainder of the length constraint of 256 is reserved for use by Athena.
     */
    Name: CatalogNameString;
    /**
     * The type of data catalog to create: LAMBDA for a federated catalog, HIVE for an external hive metastore, or GLUE for an Glue Data Catalog.
     */
    Type: DataCatalogType;
    /**
     * A description of the data catalog to be created.
     */
    Description?: DescriptionString;
    /**
     * Specifies the Lambda function or functions to use for creating the data catalog. This is a mapping whose values depend on the catalog type.    For the HIVE data catalog type, use the following syntax. The metadata-function parameter is required. The sdk-version parameter is optional and defaults to the currently supported version.  metadata-function=lambda_arn, sdk-version=version_number     For the LAMBDA data catalog type, use one of the following sets of required parameters, but not both.   If you have one Lambda function that processes metadata and another for reading the actual data, use the following syntax. Both parameters are required.  metadata-function=lambda_arn, record-function=lambda_arn      If you have a composite Lambda function that processes both metadata and data, use the following syntax to specify your Lambda function.  function=lambda_arn       The GLUE type takes a catalog ID parameter and is required. The  catalog_id  is the account ID of the Amazon Web Services account to which the Glue Data Catalog belongs.  catalog-id=catalog_id     The GLUE data catalog type also applies to the default AwsDataCatalog that already exists in your account, of which you can have only one and cannot modify.   Queries that specify a Glue Data Catalog other than the default AwsDataCatalog must be run on Athena engine version 2.   In Regions where Athena engine version 2 is not available, creating new Glue data catalogs results in an INVALID_INPUT error.    
     */
    Parameters?: ParametersMap;
    /**
     * A list of comma separated tags to add to the data catalog that is created.
     */
    Tags?: TagList;
  }
  export interface CreateDataCatalogOutput {
  }
  export interface CreateNamedQueryInput {
    /**
     * The query name.
     */
    Name: NameString;
    /**
     * The query description.
     */
    Description?: DescriptionString;
    /**
     * The database to which the query belongs.
     */
    Database: DatabaseString;
    /**
     * The contents of the query with all query statements.
     */
    QueryString: QueryString;
    /**
     * A unique case-sensitive string used to ensure the request to create the query is idempotent (executes only once). If another CreateNamedQuery request is received, the same response is returned and another query is not created. If a parameter has changed, for example, the QueryString, an error is returned.  This token is listed as not required because Amazon Web Services SDKs (for example the Amazon Web Services SDK for Java) auto-generate the token for users. If you are not using the Amazon Web Services SDK or the Amazon Web Services CLI, you must provide this token or the action will fail. 
     */
    ClientRequestToken?: IdempotencyToken;
    /**
     * The name of the workgroup in which the named query is being created.
     */
    WorkGroup?: WorkGroupName;
  }
  export interface CreateNamedQueryOutput {
    /**
     * The unique ID of the query.
     */
    NamedQueryId?: NamedQueryId;
  }
  export interface CreateNotebookInput {
    /**
     * The name of the Spark enabled workgroup in which the notebook will be created.
     */
    WorkGroup: WorkGroupName;
    /**
     * The name of the ipynb file to be created in the Spark workgroup, without the .ipynb extension.
     */
    Name: NotebookName;
    /**
     * A unique case-sensitive string used to ensure the request to create the notebook is idempotent (executes only once).  This token is listed as not required because Amazon Web Services SDKs (for example the Amazon Web Services SDK for Java) auto-generate the token for you. If you are not using the Amazon Web Services SDK or the Amazon Web Services CLI, you must provide this token or the action will fail. 
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateNotebookOutput {
    /**
     * A unique identifier for the notebook.
     */
    NotebookId?: NotebookId;
  }
  export interface CreatePreparedStatementInput {
    /**
     * The name of the prepared statement.
     */
    StatementName: StatementName;
    /**
     * The name of the workgroup to which the prepared statement belongs.
     */
    WorkGroup: WorkGroupName;
    /**
     * The query string for the prepared statement.
     */
    QueryStatement: QueryString;
    /**
     * The description of the prepared statement.
     */
    Description?: DescriptionString;
  }
  export interface CreatePreparedStatementOutput {
  }
  export interface CreatePresignedNotebookUrlRequest {
    /**
     * The session ID.
     */
    SessionId: SessionId;
  }
  export interface CreatePresignedNotebookUrlResponse {
    /**
     * The URL of the notebook. The URL includes the authentication token and notebook file name and points directly to the opened notebook.
     */
    NotebookUrl: String;
    /**
     * The authentication token for the notebook.
     */
    AuthToken: AuthToken;
    /**
     * The UTC epoch time when the authentication token expires.
     */
    AuthTokenExpirationTime: Long;
  }
  export interface CreateWorkGroupInput {
    /**
     * The workgroup name.
     */
    Name: WorkGroupName;
    /**
     * Contains configuration information for creating an Athena SQL workgroup or Spark enabled Athena workgroup. Athena SQL workgroup configuration includes the location in Amazon S3 where query and calculation results are stored, the encryption configuration, if any, used for encrypting query results, whether the Amazon CloudWatch Metrics are enabled for the workgroup, the limit for the amount of bytes scanned (cutoff) per query, if it is specified, and whether workgroup's settings (specified with EnforceWorkGroupConfiguration) in the WorkGroupConfiguration override client-side settings. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
     */
    Configuration?: WorkGroupConfiguration;
    /**
     * The workgroup description.
     */
    Description?: WorkGroupDescriptionString;
    /**
     * A list of comma separated tags to add to the workgroup that is created.
     */
    Tags?: TagList;
  }
  export interface CreateWorkGroupOutput {
  }
  export interface CustomerContentEncryptionConfiguration {
    /**
     * The KMS key that is used to encrypt the user's data stores in Athena.
     */
    KmsKey: KmsKey;
  }
  export interface DataCatalog {
    /**
     * The name of the data catalog. The catalog name must be unique for the Amazon Web Services account and can use a maximum of 127 alphanumeric, underscore, at sign, or hyphen characters. The remainder of the length constraint of 256 is reserved for use by Athena.
     */
    Name: CatalogNameString;
    /**
     * An optional description of the data catalog.
     */
    Description?: DescriptionString;
    /**
     * The type of data catalog to create: LAMBDA for a federated catalog, HIVE for an external hive metastore, or GLUE for an Glue Data Catalog.
     */
    Type: DataCatalogType;
    /**
     * Specifies the Lambda function or functions to use for the data catalog. This is a mapping whose values depend on the catalog type.    For the HIVE data catalog type, use the following syntax. The metadata-function parameter is required. The sdk-version parameter is optional and defaults to the currently supported version.  metadata-function=lambda_arn, sdk-version=version_number     For the LAMBDA data catalog type, use one of the following sets of required parameters, but not both.   If you have one Lambda function that processes metadata and another for reading the actual data, use the following syntax. Both parameters are required.  metadata-function=lambda_arn, record-function=lambda_arn      If you have a composite Lambda function that processes both metadata and data, use the following syntax to specify your Lambda function.  function=lambda_arn       The GLUE type takes a catalog ID parameter and is required. The  catalog_id  is the account ID of the Amazon Web Services account to which the Glue catalog belongs.  catalog-id=catalog_id     The GLUE data catalog type also applies to the default AwsDataCatalog that already exists in your account, of which you can have only one and cannot modify.   Queries that specify a Glue Data Catalog other than the default AwsDataCatalog must be run on Athena engine version 2.    
     */
    Parameters?: ParametersMap;
  }
  export interface DataCatalogSummary {
    /**
     * The name of the data catalog. The catalog name is unique for the Amazon Web Services account and can use a maximum of 127 alphanumeric, underscore, at sign, or hyphen characters. The remainder of the length constraint of 256 is reserved for use by Athena.
     */
    CatalogName?: CatalogNameString;
    /**
     * The data catalog type.
     */
    Type?: DataCatalogType;
  }
  export type DataCatalogSummaryList = DataCatalogSummary[];
  export type DataCatalogType = "LAMBDA"|"GLUE"|"HIVE"|string;
  export interface Database {
    /**
     * The name of the database.
     */
    Name: NameString;
    /**
     * An optional description of the database.
     */
    Description?: DescriptionString;
    /**
     * A set of custom key/value pairs.
     */
    Parameters?: ParametersMap;
  }
  export type DatabaseList = Database[];
  export type DatabaseString = string;
  export type _Date = Date;
  export interface Datum {
    /**
     * The value of the datum.
     */
    VarCharValue?: datumString;
  }
  export type DefaultExecutorDpuSize = number;
  export interface DeleteCapacityReservationInput {
    /**
     * The name of the capacity reservation to delete.
     */
    Name: CapacityReservationName;
  }
  export interface DeleteCapacityReservationOutput {
  }
  export interface DeleteDataCatalogInput {
    /**
     * The name of the data catalog to delete.
     */
    Name: CatalogNameString;
  }
  export interface DeleteDataCatalogOutput {
  }
  export interface DeleteNamedQueryInput {
    /**
     * The unique ID of the query to delete.
     */
    NamedQueryId: NamedQueryId;
  }
  export interface DeleteNamedQueryOutput {
  }
  export interface DeleteNotebookInput {
    /**
     * The ID of the notebook to delete.
     */
    NotebookId: NotebookId;
  }
  export interface DeleteNotebookOutput {
  }
  export interface DeletePreparedStatementInput {
    /**
     * The name of the prepared statement to delete.
     */
    StatementName: StatementName;
    /**
     * The workgroup to which the statement to be deleted belongs.
     */
    WorkGroup: WorkGroupName;
  }
  export interface DeletePreparedStatementOutput {
  }
  export interface DeleteWorkGroupInput {
    /**
     * The unique name of the workgroup to delete.
     */
    WorkGroup: WorkGroupName;
    /**
     * The option to delete the workgroup and its contents even if the workgroup contains any named queries, query executions, or notebooks.
     */
    RecursiveDeleteOption?: BoxedBoolean;
  }
  export interface DeleteWorkGroupOutput {
  }
  export type DescriptionString = string;
  export interface EncryptionConfiguration {
    /**
     * Indicates whether Amazon S3 server-side encryption with Amazon S3-managed keys (SSE_S3), server-side encryption with KMS-managed keys (SSE_KMS), or client-side encryption with KMS-managed keys (CSE_KMS) is used. If a query runs in a workgroup and the workgroup overrides client-side settings, then the workgroup's setting for encryption is used. It specifies whether query results must be encrypted, for all queries that run in this workgroup. 
     */
    EncryptionOption: EncryptionOption;
    /**
     * For SSE_KMS and CSE_KMS, this is the KMS key ARN or ID.
     */
    KmsKey?: String;
  }
  export type EncryptionOption = "SSE_S3"|"SSE_KMS"|"CSE_KMS"|string;
  export interface EngineConfiguration {
    /**
     * The number of DPUs to use for the coordinator. A coordinator is a special executor that orchestrates processing work and manages other executors in a notebook session. The default is 1.
     */
    CoordinatorDpuSize?: CoordinatorDpuSize;
    /**
     * The maximum number of DPUs that can run concurrently.
     */
    MaxConcurrentDpus: MaxConcurrentDpus;
    /**
     * The default number of DPUs to use for executors. An executor is the smallest unit of compute that a notebook session can request from Athena. The default is 1.
     */
    DefaultExecutorDpuSize?: DefaultExecutorDpuSize;
    /**
     * Contains additional notebook engine MAP&lt;string, string&gt; parameter mappings in the form of key-value pairs. To specify an Athena notebook that the Jupyter server will download and serve, specify a value for the StartSessionRequest$NotebookVersion field, and then add a key named NotebookId to AdditionalConfigs that has the value of the Athena notebook ID.
     */
    AdditionalConfigs?: ParametersMap;
    /**
     * Specifies custom jar files and Spark properties for use cases like cluster encryption, table formats, and general Spark tuning.
     */
    SparkProperties?: ParametersMap;
  }
  export interface EngineVersion {
    /**
     * The engine version requested by the user. Possible values are determined by the output of ListEngineVersions, including AUTO. The default is AUTO.
     */
    SelectedEngineVersion?: NameString;
    /**
     * Read only. The engine version on which the query runs. If the user requests a valid engine version other than Auto, the effective engine version is the same as the engine version that the user requested. If the user requests Auto, the effective engine version is chosen by Athena. When a request to update the engine version is made by a CreateWorkGroup or UpdateWorkGroup operation, the EffectiveEngineVersion field is ignored.
     */
    EffectiveEngineVersion?: NameString;
  }
  export type EngineVersionsList = EngineVersion[];
  export type ErrorCategory = number;
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export type ErrorType = number;
  export type ExecutionParameter = string;
  export type ExecutionParameters = ExecutionParameter[];
  export type ExecutorId = string;
  export type ExecutorState = "CREATING"|"CREATED"|"REGISTERED"|"TERMINATING"|"TERMINATED"|"FAILED"|string;
  export type ExecutorType = "COORDINATOR"|"GATEWAY"|"WORKER"|string;
  export interface ExecutorsSummary {
    /**
     * The UUID of the executor.
     */
    ExecutorId: ExecutorId;
    /**
     * The type of executor used for the application (COORDINATOR, GATEWAY, or WORKER).
     */
    ExecutorType?: ExecutorType;
    /**
     * The date and time that the executor started.
     */
    StartDateTime?: Long;
    /**
     * The date and time that the executor was terminated.
     */
    TerminationDateTime?: Long;
    /**
     * The processing state of the executor. A description of each state follows.  CREATING - The executor is being started, including acquiring resources.  CREATED - The executor has been started.  REGISTERED - The executor has been registered.  TERMINATING - The executor is in the process of shutting down.  TERMINATED - The executor is no longer running.  FAILED - Due to a failure, the executor is no longer running.
     */
    ExecutorState?: ExecutorState;
    /**
     * The smallest unit of compute that a session can request from Athena. Size is measured in data processing unit (DPU) values, a relative measure of processing power.
     */
    ExecutorSize?: Long;
  }
  export type ExecutorsSummaryList = ExecutorsSummary[];
  export interface ExportNotebookInput {
    /**
     * The ID of the notebook to export.
     */
    NotebookId: NotebookId;
  }
  export interface ExportNotebookOutput {
    /**
     * The notebook metadata, including notebook ID, notebook name, and workgroup name.
     */
    NotebookMetadata?: NotebookMetadata;
    /**
     * The content of the exported notebook.
     */
    Payload?: Payload;
  }
  export type ExpressionString = string;
  export interface FilterDefinition {
    /**
     * The name of the notebook to search for.
     */
    Name?: NotebookName;
  }
  export interface GetCalculationExecutionCodeRequest {
    /**
     * The calculation execution UUID.
     */
    CalculationExecutionId: CalculationExecutionId;
  }
  export interface GetCalculationExecutionCodeResponse {
    /**
     * The unencrypted code that was executed for the calculation.
     */
    CodeBlock?: CodeBlock;
  }
  export interface GetCalculationExecutionRequest {
    /**
     * The calculation execution UUID.
     */
    CalculationExecutionId: CalculationExecutionId;
  }
  export interface GetCalculationExecutionResponse {
    /**
     * The calculation execution UUID.
     */
    CalculationExecutionId?: CalculationExecutionId;
    /**
     * The session ID that the calculation ran in.
     */
    SessionId?: SessionId;
    /**
     * The description of the calculation execution.
     */
    Description?: DescriptionString;
    /**
     * The Amazon S3 location in which calculation results are stored.
     */
    WorkingDirectory?: S3Uri;
    /**
     * Contains information about the status of the calculation.
     */
    Status?: CalculationStatus;
    /**
     * Contains information about the data processing unit (DPU) execution time and progress. This field is populated only when statistics are available.
     */
    Statistics?: CalculationStatistics;
    /**
     * Contains result information. This field is populated only if the calculation is completed.
     */
    Result?: CalculationResult;
  }
  export interface GetCalculationExecutionStatusRequest {
    /**
     * The calculation execution UUID.
     */
    CalculationExecutionId: CalculationExecutionId;
  }
  export interface GetCalculationExecutionStatusResponse {
    /**
     * Contains information about the calculation execution status.
     */
    Status?: CalculationStatus;
    /**
     * Contains information about the DPU execution time and progress.
     */
    Statistics?: CalculationStatistics;
  }
  export interface GetCapacityAssignmentConfigurationInput {
    /**
     * The name of the capacity reservation to retrieve the capacity assignment configuration for.
     */
    CapacityReservationName: CapacityReservationName;
  }
  export interface GetCapacityAssignmentConfigurationOutput {
    /**
     * The requested capacity assignment configuration for the specified capacity reservation.
     */
    CapacityAssignmentConfiguration: CapacityAssignmentConfiguration;
  }
  export interface GetCapacityReservationInput {
    /**
     * The name of the capacity reservation.
     */
    Name: CapacityReservationName;
  }
  export interface GetCapacityReservationOutput {
    /**
     * The requested capacity reservation structure.
     */
    CapacityReservation: CapacityReservation;
  }
  export interface GetDataCatalogInput {
    /**
     * The name of the data catalog to return.
     */
    Name: CatalogNameString;
  }
  export interface GetDataCatalogOutput {
    /**
     * The data catalog returned.
     */
    DataCatalog?: DataCatalog;
  }
  export interface GetDatabaseInput {
    /**
     * The name of the data catalog that contains the database to return.
     */
    CatalogName: CatalogNameString;
    /**
     * The name of the database to return.
     */
    DatabaseName: NameString;
  }
  export interface GetDatabaseOutput {
    /**
     * The database returned.
     */
    Database?: Database;
  }
  export interface GetNamedQueryInput {
    /**
     * The unique ID of the query. Use ListNamedQueries to get query IDs.
     */
    NamedQueryId: NamedQueryId;
  }
  export interface GetNamedQueryOutput {
    /**
     * Information about the query.
     */
    NamedQuery?: NamedQuery;
  }
  export interface GetNotebookMetadataInput {
    /**
     * The ID of the notebook whose metadata is to be retrieved.
     */
    NotebookId: NotebookId;
  }
  export interface GetNotebookMetadataOutput {
    /**
     * The metadata that is returned for the specified notebook ID.
     */
    NotebookMetadata?: NotebookMetadata;
  }
  export interface GetPreparedStatementInput {
    /**
     * The name of the prepared statement to retrieve.
     */
    StatementName: StatementName;
    /**
     * The workgroup to which the statement to be retrieved belongs.
     */
    WorkGroup: WorkGroupName;
  }
  export interface GetPreparedStatementOutput {
    /**
     * The name of the prepared statement that was retrieved.
     */
    PreparedStatement?: PreparedStatement;
  }
  export interface GetQueryExecutionInput {
    /**
     * The unique ID of the query execution.
     */
    QueryExecutionId: QueryExecutionId;
  }
  export interface GetQueryExecutionOutput {
    /**
     * Information about the query execution.
     */
    QueryExecution?: QueryExecution;
  }
  export interface GetQueryResultsInput {
    /**
     * The unique ID of the query execution.
     */
    QueryExecutionId: QueryExecutionId;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * The maximum number of results (rows) to return in this request.
     */
    MaxResults?: MaxQueryResults;
  }
  export interface GetQueryResultsOutput {
    /**
     * The number of rows inserted with a CREATE TABLE AS SELECT statement. 
     */
    UpdateCount?: Long;
    /**
     * The results of the query execution.
     */
    ResultSet?: ResultSet;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface GetQueryRuntimeStatisticsInput {
    /**
     * The unique ID of the query execution.
     */
    QueryExecutionId: QueryExecutionId;
  }
  export interface GetQueryRuntimeStatisticsOutput {
    /**
     * Runtime statistics about the query execution.
     */
    QueryRuntimeStatistics?: QueryRuntimeStatistics;
  }
  export interface GetSessionRequest {
    /**
     * The session ID.
     */
    SessionId: SessionId;
  }
  export interface GetSessionResponse {
    /**
     * The session ID.
     */
    SessionId?: SessionId;
    /**
     * The session description.
     */
    Description?: DescriptionString;
    /**
     * The workgroup to which the session belongs.
     */
    WorkGroup?: WorkGroupName;
    /**
     * The engine version used by the session (for example, PySpark engine version 3). You can get a list of engine versions by calling ListEngineVersions.
     */
    EngineVersion?: NameString;
    /**
     * Contains engine configuration information like DPU usage.
     */
    EngineConfiguration?: EngineConfiguration;
    /**
     * The notebook version.
     */
    NotebookVersion?: NameString;
    /**
     * Contains the workgroup configuration information used by the session.
     */
    SessionConfiguration?: SessionConfiguration;
    /**
     * Contains information about the status of the session.
     */
    Status?: SessionStatus;
    /**
     * Contains the DPU execution time.
     */
    Statistics?: SessionStatistics;
  }
  export interface GetSessionStatusRequest {
    /**
     * The session ID.
     */
    SessionId: SessionId;
  }
  export interface GetSessionStatusResponse {
    /**
     * The session ID.
     */
    SessionId?: SessionId;
    /**
     * Contains information about the status of the session.
     */
    Status?: SessionStatus;
  }
  export interface GetTableMetadataInput {
    /**
     * The name of the data catalog that contains the database and table metadata to return.
     */
    CatalogName: CatalogNameString;
    /**
     * The name of the database that contains the table metadata to return.
     */
    DatabaseName: NameString;
    /**
     * The name of the table for which metadata is returned.
     */
    TableName: NameString;
  }
  export interface GetTableMetadataOutput {
    /**
     * An object that contains table metadata.
     */
    TableMetadata?: TableMetadata;
  }
  export interface GetWorkGroupInput {
    /**
     * The name of the workgroup.
     */
    WorkGroup: WorkGroupName;
  }
  export interface GetWorkGroupOutput {
    /**
     * Information about the workgroup.
     */
    WorkGroup?: WorkGroup;
  }
  export type IdempotencyToken = string;
  export interface ImportNotebookInput {
    /**
     * The name of the Spark enabled workgroup to import the notebook to.
     */
    WorkGroup: WorkGroupName;
    /**
     * The name of the notebook to import.
     */
    Name: NotebookName;
    /**
     * The notebook content to be imported.
     */
    Payload: Payload;
    /**
     * The notebook content type. Currently, the only valid type is IPYNB.
     */
    Type: NotebookType;
    /**
     * A unique case-sensitive string used to ensure the request to import the notebook is idempotent (executes only once).  This token is listed as not required because Amazon Web Services SDKs (for example the Amazon Web Services SDK for Java) auto-generate the token for you. If you are not using the Amazon Web Services SDK or the Amazon Web Services CLI, you must provide this token or the action will fail. 
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface ImportNotebookOutput {
    /**
     * The ID assigned to the imported notebook.
     */
    NotebookId?: NotebookId;
  }
  export type Integer = number;
  export type KeyString = string;
  export type KmsKey = string;
  export interface ListApplicationDPUSizesInput {
    /**
     * Specifies the maximum number of results to return.
     */
    MaxResults?: MaxApplicationDPUSizesCount;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated.
     */
    NextToken?: Token;
  }
  export interface ListApplicationDPUSizesOutput {
    /**
     * A list of the supported DPU sizes that the application runtime supports.
     */
    ApplicationDPUSizes?: ApplicationDPUSizesList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListCalculationExecutionsRequest {
    /**
     * The session ID.
     */
    SessionId: SessionId;
    /**
     * A filter for a specific calculation execution state. A description of each state follows.  CREATING - The calculation is in the process of being created.  CREATED - The calculation has been created and is ready to run.  QUEUED - The calculation has been queued for processing.  RUNNING - The calculation is running.  CANCELING - A request to cancel the calculation has been received and the system is working to stop it.  CANCELED - The calculation is no longer running as the result of a cancel request.  COMPLETED - The calculation has completed without error.  FAILED - The calculation failed and is no longer running.
     */
    StateFilter?: CalculationExecutionState;
    /**
     * The maximum number of calculation executions to return.
     */
    MaxResults?: MaxCalculationsCount;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: SessionManagerToken;
  }
  export interface ListCalculationExecutionsResponse {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: SessionManagerToken;
    /**
     * A list of CalculationSummary objects.
     */
    Calculations?: CalculationsList;
  }
  export interface ListCapacityReservationsInput {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated.
     */
    NextToken?: Token;
    /**
     * Specifies the maximum number of results to return.
     */
    MaxResults?: MaxCapacityReservationsCount;
  }
  export interface ListCapacityReservationsOutput {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * The capacity reservations for the current account.
     */
    CapacityReservations: CapacityReservationsList;
  }
  export interface ListDataCatalogsInput {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * Specifies the maximum number of data catalogs to return.
     */
    MaxResults?: MaxDataCatalogsCount;
  }
  export interface ListDataCatalogsOutput {
    /**
     * A summary list of data catalogs.
     */
    DataCatalogsSummary?: DataCatalogSummaryList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListDatabasesInput {
    /**
     * The name of the data catalog that contains the databases to return.
     */
    CatalogName: CatalogNameString;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * Specifies the maximum number of results to return.
     */
    MaxResults?: MaxDatabasesCount;
  }
  export interface ListDatabasesOutput {
    /**
     * A list of databases from a data catalog.
     */
    DatabaseList?: DatabaseList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListEngineVersionsInput {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * The maximum number of engine versions to return in this request.
     */
    MaxResults?: MaxEngineVersionsCount;
  }
  export interface ListEngineVersionsOutput {
    /**
     * A list of engine versions that are available to choose from.
     */
    EngineVersions?: EngineVersionsList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListExecutorsRequest {
    /**
     * The session ID.
     */
    SessionId: SessionId;
    /**
     * A filter for a specific executor state. A description of each state follows.  CREATING - The executor is being started, including acquiring resources.  CREATED - The executor has been started.  REGISTERED - The executor has been registered.  TERMINATING - The executor is in the process of shutting down.  TERMINATED - The executor is no longer running.  FAILED - Due to a failure, the executor is no longer running.
     */
    ExecutorStateFilter?: ExecutorState;
    /**
     * The maximum number of executors to return.
     */
    MaxResults?: MaxListExecutorsCount;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: SessionManagerToken;
  }
  export interface ListExecutorsResponse {
    /**
     * The session ID.
     */
    SessionId: SessionId;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: SessionManagerToken;
    /**
     * Contains summary information about the executor.
     */
    ExecutorsSummary?: ExecutorsSummaryList;
  }
  export interface ListNamedQueriesInput {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * The maximum number of queries to return in this request.
     */
    MaxResults?: MaxNamedQueriesCount;
    /**
     * The name of the workgroup from which the named queries are being returned. If a workgroup is not specified, the saved queries for the primary workgroup are returned.
     */
    WorkGroup?: WorkGroupName;
  }
  export interface ListNamedQueriesOutput {
    /**
     * The list of unique query IDs.
     */
    NamedQueryIds?: NamedQueryIdList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListNotebookMetadataInput {
    /**
     * Search filter string.
     */
    Filters?: FilterDefinition;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated.
     */
    NextToken?: Token;
    /**
     * Specifies the maximum number of results to return.
     */
    MaxResults?: MaxNotebooksCount;
    /**
     * The name of the Spark enabled workgroup to retrieve notebook metadata for.
     */
    WorkGroup: WorkGroupName;
  }
  export interface ListNotebookMetadataOutput {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * The list of notebook metadata for the specified workgroup.
     */
    NotebookMetadataList?: NotebookMetadataArray;
  }
  export interface ListNotebookSessionsRequest {
    /**
     * The ID of the notebook to list sessions for.
     */
    NotebookId: NotebookId;
    /**
     * The maximum number of notebook sessions to return.
     */
    MaxResults?: MaxSessionsCount;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListNotebookSessionsResponse {
    /**
     * A list of the sessions belonging to the notebook.
     */
    NotebookSessionsList: NotebookSessionsList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListPreparedStatementsInput {
    /**
     * The workgroup to list the prepared statements for.
     */
    WorkGroup: WorkGroupName;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * The maximum number of results to return in this request.
     */
    MaxResults?: MaxPreparedStatementsCount;
  }
  export interface ListPreparedStatementsOutput {
    /**
     * The list of prepared statements for the workgroup.
     */
    PreparedStatements?: PreparedStatementsList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListQueryExecutionsInput {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * The maximum number of query executions to return in this request.
     */
    MaxResults?: MaxQueryExecutionsCount;
    /**
     * The name of the workgroup from which queries are being returned. If a workgroup is not specified, a list of available query execution IDs for the queries in the primary workgroup is returned.
     */
    WorkGroup?: WorkGroupName;
  }
  export interface ListQueryExecutionsOutput {
    /**
     * The unique IDs of each query execution as an array of strings.
     */
    QueryExecutionIds?: QueryExecutionIdList;
    /**
     * A token to be used by the next request if this request is truncated.
     */
    NextToken?: Token;
  }
  export interface ListSessionsRequest {
    /**
     * The workgroup to which the session belongs.
     */
    WorkGroup: WorkGroupName;
    /**
     * A filter for a specific session state. A description of each state follows.  CREATING - The session is being started, including acquiring resources.  CREATED - The session has been started.  IDLE - The session is able to accept a calculation.  BUSY - The session is processing another task and is unable to accept a calculation.  TERMINATING - The session is in the process of shutting down.  TERMINATED - The session and its resources are no longer running.  DEGRADED - The session has no healthy coordinators.  FAILED - Due to a failure, the session and its resources are no longer running.
     */
    StateFilter?: SessionState;
    /**
     * The maximum number of sessions to return.
     */
    MaxResults?: MaxSessionsCount;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: SessionManagerToken;
  }
  export interface ListSessionsResponse {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: SessionManagerToken;
    /**
     * A list of sessions.
     */
    Sessions?: SessionsList;
  }
  export interface ListTableMetadataInput {
    /**
     * The name of the data catalog for which table metadata should be returned.
     */
    CatalogName: CatalogNameString;
    /**
     * The name of the database for which table metadata should be returned.
     */
    DatabaseName: NameString;
    /**
     * A regex filter that pattern-matches table names. If no expression is supplied, metadata for all tables are listed.
     */
    Expression?: ExpressionString;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * Specifies the maximum number of results to return.
     */
    MaxResults?: MaxTableMetadataCount;
  }
  export interface ListTableMetadataOutput {
    /**
     * A list of table metadata.
     */
    TableMetadataList?: TableMetadataList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export interface ListTagsForResourceInput {
    /**
     * Lists the tags for the resource with the specified ARN.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The token for the next set of results, or null if there are no additional results for this request, where the request lists the tags for the resource with the specified ARN.
     */
    NextToken?: Token;
    /**
     * The maximum number of results to be returned per request that lists the tags for the resource.
     */
    MaxResults?: MaxTagsCount;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The list of tags associated with the specified resource.
     */
    Tags?: TagList;
    /**
     * A token to be used by the next request if this request is truncated.
     */
    NextToken?: Token;
  }
  export interface ListWorkGroupsInput {
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
    /**
     * The maximum number of workgroups to return in this request.
     */
    MaxResults?: MaxWorkGroupsCount;
  }
  export interface ListWorkGroupsOutput {
    /**
     * A list of WorkGroupSummary objects that include the names, descriptions, creation times, and states for each workgroup.
     */
    WorkGroups?: WorkGroupsList;
    /**
     * A token generated by the Athena service that specifies where to continue pagination if a previous request was truncated. To obtain the next set of pages, pass in the NextToken from the response object of the previous page call.
     */
    NextToken?: Token;
  }
  export type Long = number;
  export type MaxApplicationDPUSizesCount = number;
  export type MaxCalculationsCount = number;
  export type MaxCapacityReservationsCount = number;
  export type MaxConcurrentDpus = number;
  export type MaxDataCatalogsCount = number;
  export type MaxDatabasesCount = number;
  export type MaxEngineVersionsCount = number;
  export type MaxListExecutorsCount = number;
  export type MaxNamedQueriesCount = number;
  export type MaxNotebooksCount = number;
  export type MaxPreparedStatementsCount = number;
  export type MaxQueryExecutionsCount = number;
  export type MaxQueryResults = number;
  export type MaxSessionsCount = number;
  export type MaxTableMetadataCount = number;
  export type MaxTagsCount = number;
  export type MaxWorkGroupsCount = number;
  export type NameString = string;
  export interface NamedQuery {
    /**
     * The query name.
     */
    Name: NameString;
    /**
     * The query description.
     */
    Description?: DescriptionString;
    /**
     * The database to which the query belongs.
     */
    Database: DatabaseString;
    /**
     * The SQL statements that make up the query.
     */
    QueryString: QueryString;
    /**
     * The unique identifier of the query.
     */
    NamedQueryId?: NamedQueryId;
    /**
     * The name of the workgroup that contains the named query.
     */
    WorkGroup?: WorkGroupName;
  }
  export type NamedQueryDescriptionString = string;
  export type NamedQueryId = string;
  export type NamedQueryIdList = NamedQueryId[];
  export type NamedQueryList = NamedQuery[];
  export type NotebookId = string;
  export interface NotebookMetadata {
    /**
     * The notebook ID.
     */
    NotebookId?: NotebookId;
    /**
     * The name of the notebook.
     */
    Name?: NotebookName;
    /**
     * The name of the Spark enabled workgroup to which the notebook belongs.
     */
    WorkGroup?: WorkGroupName;
    /**
     * The time when the notebook was created.
     */
    CreationTime?: _Date;
    /**
     * The type of notebook. Currently, the only valid type is IPYNB.
     */
    Type?: NotebookType;
    /**
     * The time when the notebook was last modified.
     */
    LastModifiedTime?: _Date;
  }
  export type NotebookMetadataArray = NotebookMetadata[];
  export type NotebookName = string;
  export interface NotebookSessionSummary {
    /**
     * The notebook session ID.
     */
    SessionId?: SessionId;
    /**
     * The time when the notebook session was created.
     */
    CreationTime?: _Date;
  }
  export type NotebookSessionsList = NotebookSessionSummary[];
  export type NotebookType = "IPYNB"|string;
  export type ParametersMap = {[key: string]: ParametersMapValue};
  export type ParametersMapValue = string;
  export type Payload = string;
  export interface PreparedStatement {
    /**
     * The name of the prepared statement.
     */
    StatementName?: StatementName;
    /**
     * The query string for the prepared statement.
     */
    QueryStatement?: QueryString;
    /**
     * The name of the workgroup to which the prepared statement belongs.
     */
    WorkGroupName?: WorkGroupName;
    /**
     * The description of the prepared statement.
     */
    Description?: DescriptionString;
    /**
     * The last modified time of the prepared statement.
     */
    LastModifiedTime?: _Date;
  }
  export type PreparedStatementDetailsList = PreparedStatement[];
  export type PreparedStatementNameList = StatementName[];
  export interface PreparedStatementSummary {
    /**
     * The name of the prepared statement.
     */
    StatementName?: StatementName;
    /**
     * The last modified time of the prepared statement.
     */
    LastModifiedTime?: _Date;
  }
  export type PreparedStatementsList = PreparedStatementSummary[];
  export interface PutCapacityAssignmentConfigurationInput {
    /**
     * The name of the capacity reservation to put a capacity assignment configuration for.
     */
    CapacityReservationName: CapacityReservationName;
    /**
     * The list of assignments for the capacity assignment configuration.
     */
    CapacityAssignments: CapacityAssignmentsList;
  }
  export interface PutCapacityAssignmentConfigurationOutput {
  }
  export interface QueryExecution {
    /**
     * The unique identifier for each query execution.
     */
    QueryExecutionId?: QueryExecutionId;
    /**
     * The SQL query statements which the query execution ran.
     */
    Query?: QueryString;
    /**
     * The type of query statement that was run. DDL indicates DDL query statements. DML indicates DML (Data Manipulation Language) query statements, such as CREATE TABLE AS SELECT. UTILITY indicates query statements other than DDL and DML, such as SHOW CREATE TABLE, or DESCRIBE TABLE.
     */
    StatementType?: StatementType;
    /**
     * The location in Amazon S3 where query and calculation results are stored and the encryption option, if any, used for query results. These are known as "client-side settings". If workgroup settings override client-side settings, then the query uses the location for the query results and the encryption configuration that are specified for the workgroup.
     */
    ResultConfiguration?: ResultConfiguration;
    /**
     * Specifies the query result reuse behavior that was used for the query.
     */
    ResultReuseConfiguration?: ResultReuseConfiguration;
    /**
     * The database in which the query execution occurred.
     */
    QueryExecutionContext?: QueryExecutionContext;
    /**
     * The completion date, current state, submission time, and state change reason (if applicable) for the query execution.
     */
    Status?: QueryExecutionStatus;
    /**
     * Query execution statistics, such as the amount of data scanned, the amount of time that the query took to process, and the type of statement that was run.
     */
    Statistics?: QueryExecutionStatistics;
    /**
     * The name of the workgroup in which the query ran.
     */
    WorkGroup?: WorkGroupName;
    /**
     * The engine version that executed the query.
     */
    EngineVersion?: EngineVersion;
    /**
     * A list of values for the parameters in a query. The values are applied sequentially to the parameters in the query in the order in which the parameters occur. The list of parameters is not returned in the response.
     */
    ExecutionParameters?: ExecutionParameters;
    /**
     * The kind of query statement that was run.
     */
    SubstatementType?: String;
  }
  export interface QueryExecutionContext {
    /**
     * The name of the database used in the query execution. The database must exist in the catalog.
     */
    Database?: DatabaseString;
    /**
     * The name of the data catalog used in the query execution.
     */
    Catalog?: CatalogNameString;
  }
  export type QueryExecutionId = string;
  export type QueryExecutionIdList = QueryExecutionId[];
  export type QueryExecutionList = QueryExecution[];
  export type QueryExecutionState = "QUEUED"|"RUNNING"|"SUCCEEDED"|"FAILED"|"CANCELLED"|string;
  export interface QueryExecutionStatistics {
    /**
     * The number of milliseconds that the query took to execute.
     */
    EngineExecutionTimeInMillis?: Long;
    /**
     * The number of bytes in the data that was queried.
     */
    DataScannedInBytes?: Long;
    /**
     * The location and file name of a data manifest file. The manifest file is saved to the Athena query results location in Amazon S3. The manifest file tracks files that the query wrote to Amazon S3. If the query fails, the manifest file also tracks files that the query intended to write. The manifest is useful for identifying orphaned files resulting from a failed query. For more information, see Working with Query Results, Output Files, and Query History in the Amazon Athena User Guide.
     */
    DataManifestLocation?: String;
    /**
     * The number of milliseconds that Athena took to run the query.
     */
    TotalExecutionTimeInMillis?: Long;
    /**
     * The number of milliseconds that the query was in your query queue waiting for resources. Note that if transient errors occur, Athena might automatically add the query back to the queue.
     */
    QueryQueueTimeInMillis?: Long;
    /**
     * The number of milliseconds that Athena took to plan the query processing flow. This includes the time spent retrieving table partitions from the data source. Note that because the query engine performs the query planning, query planning time is a subset of engine processing time.
     */
    QueryPlanningTimeInMillis?: Long;
    /**
     * The number of milliseconds that Athena took to finalize and publish the query results after the query engine finished running the query.
     */
    ServiceProcessingTimeInMillis?: Long;
    /**
     * Contains information about whether previous query results were reused for the query.
     */
    ResultReuseInformation?: ResultReuseInformation;
  }
  export interface QueryExecutionStatus {
    /**
     * The state of query execution. QUEUED indicates that the query has been submitted to the service, and Athena will execute the query as soon as resources are available. RUNNING indicates that the query is in execution phase. SUCCEEDED indicates that the query completed without errors. FAILED indicates that the query experienced an error and did not complete processing. CANCELLED indicates that a user input interrupted query execution.  Athena automatically retries your queries in cases of certain transient errors. As a result, you may see the query state transition from RUNNING or FAILED to QUEUED.  
     */
    State?: QueryExecutionState;
    /**
     * Further detail about the status of the query.
     */
    StateChangeReason?: String;
    /**
     * The date and time that the query was submitted.
     */
    SubmissionDateTime?: _Date;
    /**
     * The date and time that the query completed.
     */
    CompletionDateTime?: _Date;
    /**
     * Provides information about an Athena query error.
     */
    AthenaError?: AthenaError;
  }
  export interface QueryRuntimeStatistics {
    Timeline?: QueryRuntimeStatisticsTimeline;
    Rows?: QueryRuntimeStatisticsRows;
    /**
     * Stage statistics such as input and output rows and bytes, execution time, and stage state. This information also includes substages and the query stage plan.
     */
    OutputStage?: QueryStage;
  }
  export interface QueryRuntimeStatisticsRows {
    /**
     * The number of rows read to execute the query.
     */
    InputRows?: Long;
    /**
     * The number of bytes read to execute the query.
     */
    InputBytes?: Long;
    /**
     * The number of bytes returned by the query.
     */
    OutputBytes?: Long;
    /**
     * The number of rows returned by the query.
     */
    OutputRows?: Long;
  }
  export interface QueryRuntimeStatisticsTimeline {
    /**
     * The number of milliseconds that the query was in your query queue waiting for resources. Note that if transient errors occur, Athena might automatically add the query back to the queue.
     */
    QueryQueueTimeInMillis?: Long;
    /**
     * The number of milliseconds that Athena took to plan the query processing flow. This includes the time spent retrieving table partitions from the data source. Note that because the query engine performs the query planning, query planning time is a subset of engine processing time.
     */
    QueryPlanningTimeInMillis?: Long;
    /**
     * The number of milliseconds that the query took to execute.
     */
    EngineExecutionTimeInMillis?: Long;
    /**
     * The number of milliseconds that Athena took to finalize and publish the query results after the query engine finished running the query.
     */
    ServiceProcessingTimeInMillis?: Long;
    /**
     * The number of milliseconds that Athena took to run the query.
     */
    TotalExecutionTimeInMillis?: Long;
  }
  export interface QueryStage {
    /**
     * The identifier for a stage.
     */
    StageId?: Long;
    /**
     * State of the stage after query execution.
     */
    State?: String;
    /**
     * The number of bytes output from the stage after execution.
     */
    OutputBytes?: Long;
    /**
     * The number of rows output from the stage after execution.
     */
    OutputRows?: Long;
    /**
     * The number of bytes input into the stage for execution.
     */
    InputBytes?: Long;
    /**
     * The number of rows input into the stage for execution.
     */
    InputRows?: Long;
    /**
     * Time taken to execute this stage.
     */
    ExecutionTime?: Long;
    /**
     * Stage plan information such as name, identifier, sub plans, and source stages.
     */
    QueryStagePlan?: QueryStagePlanNode;
    /**
     * List of sub query stages that form this stage execution plan.
     */
    SubStages?: QueryStages;
  }
  export interface QueryStagePlanNode {
    /**
     * Name of the query stage plan that describes the operation this stage is performing as part of query execution.
     */
    Name?: String;
    /**
     * Information about the operation this query stage plan node is performing.
     */
    Identifier?: String;
    /**
     * Stage plan information such as name, identifier, sub plans, and remote sources of child plan nodes/
     */
    Children?: QueryStagePlanNodes;
    /**
     * Source plan node IDs.
     */
    RemoteSources?: StringList;
  }
  export type QueryStagePlanNodes = QueryStagePlanNode[];
  export type QueryStages = QueryStage[];
  export type QueryString = string;
  export interface ResultConfiguration {
    /**
     * The location in Amazon S3 where your query and calculation results are stored, such as s3://path/to/query/bucket/. To run the query, you must specify the query results location using one of the ways: either for individual queries using either this setting (client-side), or in the workgroup, using WorkGroupConfiguration. If none of them is set, Athena issues an error that no output location is provided. For more information, see Working with query results, recent queries, and output files. If workgroup settings override client-side settings, then the query uses the settings specified for the workgroup. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
     */
    OutputLocation?: ResultOutputLocation;
    /**
     * If query and calculation results are encrypted in Amazon S3, indicates the encryption option used (for example, SSE_KMS or CSE_KMS) and key information. This is a client-side setting. If workgroup settings override client-side settings, then the query uses the encryption configuration that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See WorkGroupConfiguration$EnforceWorkGroupConfiguration and Workgroup Settings Override Client-Side Settings.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
    /**
     * The Amazon Web Services account ID that you expect to be the owner of the Amazon S3 bucket specified by ResultConfiguration$OutputLocation. If set, Athena uses the value for ExpectedBucketOwner when it makes Amazon S3 calls to your specified output location. If the ExpectedBucketOwner Amazon Web Services account ID does not match the actual owner of the Amazon S3 bucket, the call fails with a permissions error. This is a client-side setting. If workgroup settings override client-side settings, then the query uses the ExpectedBucketOwner setting that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See WorkGroupConfiguration$EnforceWorkGroupConfiguration and Workgroup Settings Override Client-Side Settings.
     */
    ExpectedBucketOwner?: AwsAccountId;
    /**
     * Indicates that an Amazon S3 canned ACL should be set to control ownership of stored query results. Currently the only supported canned ACL is BUCKET_OWNER_FULL_CONTROL. This is a client-side setting. If workgroup settings override client-side settings, then the query uses the ACL configuration that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. For more information, see WorkGroupConfiguration$EnforceWorkGroupConfiguration and Workgroup Settings Override Client-Side Settings.
     */
    AclConfiguration?: AclConfiguration;
  }
  export interface ResultConfigurationUpdates {
    /**
     * The location in Amazon S3 where your query and calculation results are stored, such as s3://path/to/query/bucket/. For more information, see Working with query results, recent queries, and output files. If workgroup settings override client-side settings, then the query uses the location for the query results and the encryption configuration that are specified for the workgroup. The "workgroup settings override" is specified in EnforceWorkGroupConfiguration (true/false) in the WorkGroupConfiguration. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
     */
    OutputLocation?: ResultOutputLocation;
    /**
     * If set to "true", indicates that the previously-specified query results location (also known as a client-side setting) for queries in this workgroup should be ignored and set to null. If set to "false" or not set, and a value is present in the OutputLocation in ResultConfigurationUpdates (the client-side setting), the OutputLocation in the workgroup's ResultConfiguration will be updated with the new value. For more information, see Workgroup Settings Override Client-Side Settings.
     */
    RemoveOutputLocation?: BoxedBoolean;
    /**
     * The encryption configuration for query and calculation results.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
    /**
     * If set to "true", indicates that the previously-specified encryption configuration (also known as the client-side setting) for queries in this workgroup should be ignored and set to null. If set to "false" or not set, and a value is present in the EncryptionConfiguration in ResultConfigurationUpdates (the client-side setting), the EncryptionConfiguration in the workgroup's ResultConfiguration will be updated with the new value. For more information, see Workgroup Settings Override Client-Side Settings.
     */
    RemoveEncryptionConfiguration?: BoxedBoolean;
    /**
     * The Amazon Web Services account ID that you expect to be the owner of the Amazon S3 bucket specified by ResultConfiguration$OutputLocation. If set, Athena uses the value for ExpectedBucketOwner when it makes Amazon S3 calls to your specified output location. If the ExpectedBucketOwner Amazon Web Services account ID does not match the actual owner of the Amazon S3 bucket, the call fails with a permissions error. If workgroup settings override client-side settings, then the query uses the ExpectedBucketOwner setting that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See WorkGroupConfiguration$EnforceWorkGroupConfiguration and Workgroup Settings Override Client-Side Settings.
     */
    ExpectedBucketOwner?: AwsAccountId;
    /**
     * If set to "true", removes the Amazon Web Services account ID previously specified for ResultConfiguration$ExpectedBucketOwner. If set to "false" or not set, and a value is present in the ExpectedBucketOwner in ResultConfigurationUpdates (the client-side setting), the ExpectedBucketOwner in the workgroup's ResultConfiguration is updated with the new value. For more information, see Workgroup Settings Override Client-Side Settings.
     */
    RemoveExpectedBucketOwner?: BoxedBoolean;
    /**
     * The ACL configuration for the query results.
     */
    AclConfiguration?: AclConfiguration;
    /**
     * If set to true, indicates that the previously-specified ACL configuration for queries in this workgroup should be ignored and set to null. If set to false or not set, and a value is present in the AclConfiguration of ResultConfigurationUpdates, the AclConfiguration in the workgroup's ResultConfiguration is updated with the new value. For more information, see Workgroup Settings Override Client-Side Settings.
     */
    RemoveAclConfiguration?: BoxedBoolean;
  }
  export type ResultOutputLocation = string;
  export interface ResultReuseByAgeConfiguration {
    /**
     * True if previous query results can be reused when the query is run; otherwise, false. The default is false.
     */
    Enabled: Boolean;
    /**
     * Specifies, in minutes, the maximum age of a previous query result that Athena should consider for reuse. The default is 60.
     */
    MaxAgeInMinutes?: Age;
  }
  export interface ResultReuseConfiguration {
    /**
     * Specifies whether previous query results are reused, and if so, their maximum age.
     */
    ResultReuseByAgeConfiguration?: ResultReuseByAgeConfiguration;
  }
  export interface ResultReuseInformation {
    /**
     * True if a previous query result was reused; false if the result was generated from a new run of the query.
     */
    ReusedPreviousResult: Boolean;
  }
  export interface ResultSet {
    /**
     * The rows in the table.
     */
    Rows?: RowList;
    /**
     * The metadata that describes the column structure and data types of a table of query results.
     */
    ResultSetMetadata?: ResultSetMetadata;
  }
  export interface ResultSetMetadata {
    /**
     * Information about the columns returned in a query result metadata.
     */
    ColumnInfo?: ColumnInfoList;
  }
  export type RoleArn = string;
  export interface Row {
    /**
     * The data that populates a row in a query result table.
     */
    Data?: datumList;
  }
  export type RowList = Row[];
  export type S3AclOption = "BUCKET_OWNER_FULL_CONTROL"|string;
  export type S3Uri = string;
  export interface SessionConfiguration {
    /**
     * The ARN of the execution role used for the session.
     */
    ExecutionRole?: RoleArn;
    /**
     * The Amazon S3 location that stores information for the notebook.
     */
    WorkingDirectory?: ResultOutputLocation;
    /**
     * The idle timeout in seconds for the session.
     */
    IdleTimeoutSeconds?: Long;
    EncryptionConfiguration?: EncryptionConfiguration;
  }
  export type SessionId = string;
  export type SessionIdleTimeoutInMinutes = number;
  export type SessionManagerToken = string;
  export type SessionState = "CREATING"|"CREATED"|"IDLE"|"BUSY"|"TERMINATING"|"TERMINATED"|"DEGRADED"|"FAILED"|string;
  export interface SessionStatistics {
    /**
     * The data processing unit execution time for a session in milliseconds.
     */
    DpuExecutionInMillis?: Long;
  }
  export interface SessionStatus {
    /**
     * The date and time that the session started.
     */
    StartDateTime?: _Date;
    /**
     * The most recent date and time that the session was modified.
     */
    LastModifiedDateTime?: _Date;
    /**
     * The date and time that the session ended.
     */
    EndDateTime?: _Date;
    /**
     * The date and time starting at which the session became idle. Can be empty if the session is not currently idle.
     */
    IdleSinceDateTime?: _Date;
    /**
     * The state of the session. A description of each state follows.  CREATING - The session is being started, including acquiring resources.  CREATED - The session has been started.  IDLE - The session is able to accept a calculation.  BUSY - The session is processing another task and is unable to accept a calculation.  TERMINATING - The session is in the process of shutting down.  TERMINATED - The session and its resources are no longer running.  DEGRADED - The session has no healthy coordinators.  FAILED - Due to a failure, the session and its resources are no longer running.
     */
    State?: SessionState;
    /**
     * The reason for the session state change (for example, canceled because the session was terminated).
     */
    StateChangeReason?: DescriptionString;
  }
  export interface SessionSummary {
    /**
     * The session ID.
     */
    SessionId?: SessionId;
    /**
     * The session description.
     */
    Description?: DescriptionString;
    /**
     * The engine version used by the session (for example, PySpark engine version 3).
     */
    EngineVersion?: EngineVersion;
    /**
     * The notebook version.
     */
    NotebookVersion?: NameString;
    /**
     * Contains information about the session status.
     */
    Status?: SessionStatus;
  }
  export type SessionsList = SessionSummary[];
  export interface StartCalculationExecutionRequest {
    /**
     * The session ID.
     */
    SessionId: SessionId;
    /**
     * A description of the calculation.
     */
    Description?: DescriptionString;
    /**
     * Contains configuration information for the calculation.
     */
    CalculationConfiguration?: CalculationConfiguration;
    /**
     * A string that contains the code of the calculation.
     */
    CodeBlock?: CodeBlock;
    /**
     * A unique case-sensitive string used to ensure the request to create the calculation is idempotent (executes only once). If another StartCalculationExecutionRequest is received, the same response is returned and another calculation is not created. If a parameter has changed, an error is returned.  This token is listed as not required because Amazon Web Services SDKs (for example the Amazon Web Services SDK for Java) auto-generate the token for users. If you are not using the Amazon Web Services SDK or the Amazon Web Services CLI, you must provide this token or the action will fail. 
     */
    ClientRequestToken?: IdempotencyToken;
  }
  export interface StartCalculationExecutionResponse {
    /**
     * The calculation execution UUID.
     */
    CalculationExecutionId?: CalculationExecutionId;
    /**
     *  CREATING - The calculation is in the process of being created.  CREATED - The calculation has been created and is ready to run.  QUEUED - The calculation has been queued for processing.  RUNNING - The calculation is running.  CANCELING - A request to cancel the calculation has been received and the system is working to stop it.  CANCELED - The calculation is no longer running as the result of a cancel request.  COMPLETED - The calculation has completed without error.  FAILED - The calculation failed and is no longer running.
     */
    State?: CalculationExecutionState;
  }
  export interface StartQueryExecutionInput {
    /**
     * The SQL query statements to be executed.
     */
    QueryString: QueryString;
    /**
     * A unique case-sensitive string used to ensure the request to create the query is idempotent (executes only once). If another StartQueryExecution request is received, the same response is returned and another query is not created. If a parameter has changed, for example, the QueryString, an error is returned.  This token is listed as not required because Amazon Web Services SDKs (for example the Amazon Web Services SDK for Java) auto-generate the token for users. If you are not using the Amazon Web Services SDK or the Amazon Web Services CLI, you must provide this token or the action will fail. 
     */
    ClientRequestToken?: IdempotencyToken;
    /**
     * The database within which the query executes.
     */
    QueryExecutionContext?: QueryExecutionContext;
    /**
     * Specifies information about where and how to save the results of the query execution. If the query runs in a workgroup, then workgroup's settings may override query settings. This affects the query results location. The workgroup settings override is specified in EnforceWorkGroupConfiguration (true/false) in the WorkGroupConfiguration. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
     */
    ResultConfiguration?: ResultConfiguration;
    /**
     * The name of the workgroup in which the query is being started.
     */
    WorkGroup?: WorkGroupName;
    /**
     * A list of values for the parameters in a query. The values are applied sequentially to the parameters in the query in the order in which the parameters occur.
     */
    ExecutionParameters?: ExecutionParameters;
    /**
     * Specifies the query result reuse behavior for the query.
     */
    ResultReuseConfiguration?: ResultReuseConfiguration;
  }
  export interface StartQueryExecutionOutput {
    /**
     * The unique ID of the query that ran as a result of this request.
     */
    QueryExecutionId?: QueryExecutionId;
  }
  export interface StartSessionRequest {
    /**
     * The session description.
     */
    Description?: DescriptionString;
    /**
     * The workgroup to which the session belongs.
     */
    WorkGroup: WorkGroupName;
    /**
     * Contains engine data processing unit (DPU) configuration settings and parameter mappings.
     */
    EngineConfiguration: EngineConfiguration;
    /**
     * The notebook version. This value is supplied automatically for notebook sessions in the Athena console and is not required for programmatic session access. The only valid notebook version is Athena notebook version 1. If you specify a value for NotebookVersion, you must also specify a value for NotebookId. See EngineConfiguration$AdditionalConfigs.
     */
    NotebookVersion?: NameString;
    /**
     * The idle timeout in minutes for the session.
     */
    SessionIdleTimeoutInMinutes?: SessionIdleTimeoutInMinutes;
    /**
     * A unique case-sensitive string used to ensure the request to create the session is idempotent (executes only once). If another StartSessionRequest is received, the same response is returned and another session is not created. If a parameter has changed, an error is returned.  This token is listed as not required because Amazon Web Services SDKs (for example the Amazon Web Services SDK for Java) auto-generate the token for users. If you are not using the Amazon Web Services SDK or the Amazon Web Services CLI, you must provide this token or the action will fail. 
     */
    ClientRequestToken?: IdempotencyToken;
  }
  export interface StartSessionResponse {
    /**
     * The session ID.
     */
    SessionId?: SessionId;
    /**
     * The state of the session. A description of each state follows.  CREATING - The session is being started, including acquiring resources.  CREATED - The session has been started.  IDLE - The session is able to accept a calculation.  BUSY - The session is processing another task and is unable to accept a calculation.  TERMINATING - The session is in the process of shutting down.  TERMINATED - The session and its resources are no longer running.  DEGRADED - The session has no healthy coordinators.  FAILED - Due to a failure, the session and its resources are no longer running.
     */
    State?: SessionState;
  }
  export type StatementName = string;
  export type StatementType = "DDL"|"DML"|"UTILITY"|string;
  export interface StopCalculationExecutionRequest {
    /**
     * The calculation execution UUID.
     */
    CalculationExecutionId: CalculationExecutionId;
  }
  export interface StopCalculationExecutionResponse {
    /**
     *  CREATING - The calculation is in the process of being created.  CREATED - The calculation has been created and is ready to run.  QUEUED - The calculation has been queued for processing.  RUNNING - The calculation is running.  CANCELING - A request to cancel the calculation has been received and the system is working to stop it.  CANCELED - The calculation is no longer running as the result of a cancel request.  COMPLETED - The calculation has completed without error.  FAILED - The calculation failed and is no longer running.
     */
    State?: CalculationExecutionState;
  }
  export interface StopQueryExecutionInput {
    /**
     * The unique ID of the query execution to stop.
     */
    QueryExecutionId: QueryExecutionId;
  }
  export interface StopQueryExecutionOutput {
  }
  export type String = string;
  export type StringList = String[];
  export type SupportedDPUSizeList = Integer[];
  export interface TableMetadata {
    /**
     * The name of the table.
     */
    Name: NameString;
    /**
     * The time that the table was created.
     */
    CreateTime?: Timestamp;
    /**
     * The last time the table was accessed.
     */
    LastAccessTime?: Timestamp;
    /**
     * The type of table. In Athena, only EXTERNAL_TABLE is supported.
     */
    TableType?: TableTypeString;
    /**
     * A list of the columns in the table.
     */
    Columns?: ColumnList;
    /**
     * A list of the partition keys in the table.
     */
    PartitionKeys?: ColumnList;
    /**
     * A set of custom key/value pairs for table properties.
     */
    Parameters?: ParametersMap;
  }
  export type TableMetadataList = TableMetadata[];
  export type TableTypeString = string;
  export interface Tag {
    /**
     * A tag key. The tag key length is from 1 to 128 Unicode characters in UTF-8. You can use letters and numbers representable in UTF-8, and the following characters: + - = . _ : / @. Tag keys are case-sensitive and must be unique per resource. 
     */
    Key?: TagKey;
    /**
     * A tag value. The tag value length is from 0 to 256 Unicode characters in UTF-8. You can use letters and numbers representable in UTF-8, and the following characters: + - = . _ : / @. Tag values are case-sensitive. 
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceInput {
    /**
     * Specifies the ARN of the Athena resource to which tags are to be added.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A collection of one or more tags, separated by commas, to be added to an Athena resource.
     */
    Tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type TargetDpusInteger = number;
  export interface TerminateSessionRequest {
    /**
     * The session ID.
     */
    SessionId: SessionId;
  }
  export interface TerminateSessionResponse {
    /**
     * The state of the session. A description of each state follows.  CREATING - The session is being started, including acquiring resources.  CREATED - The session has been started.  IDLE - The session is able to accept a calculation.  BUSY - The session is processing another task and is unable to accept a calculation.  TERMINATING - The session is in the process of shutting down.  TERMINATED - The session and its resources are no longer running.  DEGRADED - The session has no healthy coordinators.  FAILED - Due to a failure, the session and its resources are no longer running.
     */
    State?: SessionState;
  }
  export type Timestamp = Date;
  export type Token = string;
  export type TypeString = string;
  export interface UnprocessedNamedQueryId {
    /**
     * The unique identifier of the named query.
     */
    NamedQueryId?: NamedQueryId;
    /**
     * The error code returned when the processing request for the named query failed, if applicable.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message returned when the processing request for the named query failed, if applicable.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type UnprocessedNamedQueryIdList = UnprocessedNamedQueryId[];
  export interface UnprocessedPreparedStatementName {
    /**
     * The name of a prepared statement that could not be returned due to an error.
     */
    StatementName?: StatementName;
    /**
     * The error code returned when the request for the prepared statement failed.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message containing the reason why the prepared statement could not be returned. The following error messages are possible:    INVALID_INPUT - The name of the prepared statement that was provided is not valid (for example, the name is too long).    STATEMENT_NOT_FOUND - A prepared statement with the name provided could not be found.    UNAUTHORIZED - The requester does not have permission to access the workgroup that contains the prepared statement.  
     */
    ErrorMessage?: ErrorMessage;
  }
  export type UnprocessedPreparedStatementNameList = UnprocessedPreparedStatementName[];
  export interface UnprocessedQueryExecutionId {
    /**
     * The unique identifier of the query execution.
     */
    QueryExecutionId?: QueryExecutionId;
    /**
     * The error code returned when the query execution failed to process, if applicable.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message returned when the query execution failed to process, if applicable.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type UnprocessedQueryExecutionIdList = UnprocessedQueryExecutionId[];
  export interface UntagResourceInput {
    /**
     * Specifies the ARN of the resource from which tags are to be removed.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A comma-separated list of one or more tag keys whose tags are to be removed from the specified resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateCapacityReservationInput {
    /**
     * The new number of requested data processing units.
     */
    TargetDpus: TargetDpusInteger;
    /**
     * The name of the capacity reservation.
     */
    Name: CapacityReservationName;
  }
  export interface UpdateCapacityReservationOutput {
  }
  export interface UpdateDataCatalogInput {
    /**
     * The name of the data catalog to update. The catalog name must be unique for the Amazon Web Services account and can use a maximum of 127 alphanumeric, underscore, at sign, or hyphen characters. The remainder of the length constraint of 256 is reserved for use by Athena.
     */
    Name: CatalogNameString;
    /**
     * Specifies the type of data catalog to update. Specify LAMBDA for a federated catalog, HIVE for an external hive metastore, or GLUE for an Glue Data Catalog.
     */
    Type: DataCatalogType;
    /**
     * New or modified text that describes the data catalog.
     */
    Description?: DescriptionString;
    /**
     * Specifies the Lambda function or functions to use for updating the data catalog. This is a mapping whose values depend on the catalog type.    For the HIVE data catalog type, use the following syntax. The metadata-function parameter is required. The sdk-version parameter is optional and defaults to the currently supported version.  metadata-function=lambda_arn, sdk-version=version_number     For the LAMBDA data catalog type, use one of the following sets of required parameters, but not both.   If you have one Lambda function that processes metadata and another for reading the actual data, use the following syntax. Both parameters are required.  metadata-function=lambda_arn, record-function=lambda_arn      If you have a composite Lambda function that processes both metadata and data, use the following syntax to specify your Lambda function.  function=lambda_arn      
     */
    Parameters?: ParametersMap;
  }
  export interface UpdateDataCatalogOutput {
  }
  export interface UpdateNamedQueryInput {
    /**
     * The unique identifier (UUID) of the query.
     */
    NamedQueryId: NamedQueryId;
    /**
     * The name of the query.
     */
    Name: NameString;
    /**
     * The query description.
     */
    Description?: NamedQueryDescriptionString;
    /**
     * The contents of the query with all query statements.
     */
    QueryString: QueryString;
  }
  export interface UpdateNamedQueryOutput {
  }
  export interface UpdateNotebookInput {
    /**
     * The ID of the notebook to update.
     */
    NotebookId: NotebookId;
    /**
     * The updated content for the notebook.
     */
    Payload: Payload;
    /**
     * The notebook content type. Currently, the only valid type is IPYNB.
     */
    Type: NotebookType;
    /**
     * The active notebook session ID. Required if the notebook has an active session.
     */
    SessionId?: SessionId;
    /**
     * A unique case-sensitive string used to ensure the request to create the notebook is idempotent (executes only once).  This token is listed as not required because Amazon Web Services SDKs (for example the Amazon Web Services SDK for Java) auto-generate the token for you. If you are not using the Amazon Web Services SDK or the Amazon Web Services CLI, you must provide this token or the action will fail. 
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface UpdateNotebookMetadataInput {
    /**
     * The ID of the notebook to update the metadata for.
     */
    NotebookId: NotebookId;
    /**
     * A unique case-sensitive string used to ensure the request to create the notebook is idempotent (executes only once).  This token is listed as not required because Amazon Web Services SDKs (for example the Amazon Web Services SDK for Java) auto-generate the token for you. If you are not using the Amazon Web Services SDK or the Amazon Web Services CLI, you must provide this token or the action will fail. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The name to update the notebook to.
     */
    Name: NotebookName;
  }
  export interface UpdateNotebookMetadataOutput {
  }
  export interface UpdateNotebookOutput {
  }
  export interface UpdatePreparedStatementInput {
    /**
     * The name of the prepared statement.
     */
    StatementName: StatementName;
    /**
     * The workgroup for the prepared statement.
     */
    WorkGroup: WorkGroupName;
    /**
     * The query string for the prepared statement.
     */
    QueryStatement: QueryString;
    /**
     * The description of the prepared statement.
     */
    Description?: DescriptionString;
  }
  export interface UpdatePreparedStatementOutput {
  }
  export interface UpdateWorkGroupInput {
    /**
     * The specified workgroup that will be updated.
     */
    WorkGroup: WorkGroupName;
    /**
     * The workgroup description.
     */
    Description?: WorkGroupDescriptionString;
    /**
     * Contains configuration updates for an Athena SQL workgroup.
     */
    ConfigurationUpdates?: WorkGroupConfigurationUpdates;
    /**
     * The workgroup state that will be updated for the given workgroup.
     */
    State?: WorkGroupState;
  }
  export interface UpdateWorkGroupOutput {
  }
  export interface WorkGroup {
    /**
     * The workgroup name.
     */
    Name: WorkGroupName;
    /**
     * The state of the workgroup: ENABLED or DISABLED.
     */
    State?: WorkGroupState;
    /**
     * The configuration of the workgroup, which includes the location in Amazon S3 where query and calculation results are stored, the encryption configuration, if any, used for query and calculation results; whether the Amazon CloudWatch Metrics are enabled for the workgroup; whether workgroup settings override client-side settings; and the data usage limits for the amount of data scanned per query or per workgroup. The workgroup settings override is specified in EnforceWorkGroupConfiguration (true/false) in the WorkGroupConfiguration. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
     */
    Configuration?: WorkGroupConfiguration;
    /**
     * The workgroup description.
     */
    Description?: WorkGroupDescriptionString;
    /**
     * The date and time the workgroup was created.
     */
    CreationTime?: _Date;
  }
  export interface WorkGroupConfiguration {
    /**
     * The configuration for the workgroup, which includes the location in Amazon S3 where query and calculation results are stored and the encryption option, if any, used for query and calculation results. To run the query, you must specify the query results location using one of the ways: either in the workgroup using this setting, or for individual queries (client-side), using ResultConfiguration$OutputLocation. If none of them is set, Athena issues an error that no output location is provided. For more information, see Working with query results, recent queries, and output files.
     */
    ResultConfiguration?: ResultConfiguration;
    /**
     * If set to "true", the settings for the workgroup override client-side settings. If set to "false", client-side settings are used. For more information, see Workgroup Settings Override Client-Side Settings.
     */
    EnforceWorkGroupConfiguration?: BoxedBoolean;
    /**
     * Indicates that the Amazon CloudWatch metrics are enabled for the workgroup.
     */
    PublishCloudWatchMetricsEnabled?: BoxedBoolean;
    /**
     * The upper data usage limit (cutoff) for the amount of bytes a single query in a workgroup is allowed to scan.
     */
    BytesScannedCutoffPerQuery?: BytesScannedCutoffValue;
    /**
     * If set to true, allows members assigned to a workgroup to reference Amazon S3 Requester Pays buckets in queries. If set to false, workgroup members cannot query data from Requester Pays buckets, and queries that retrieve data from Requester Pays buckets cause an error. The default is false. For more information about Requester Pays buckets, see Requester Pays Buckets in the Amazon Simple Storage Service Developer Guide.
     */
    RequesterPaysEnabled?: BoxedBoolean;
    /**
     * The engine version that all queries running on the workgroup use. Queries on the AmazonAthenaPreviewFunctionality workgroup run on the preview engine regardless of this setting.
     */
    EngineVersion?: EngineVersion;
    /**
     * Specifies a user defined JSON string that is passed to the notebook engine.
     */
    AdditionalConfiguration?: NameString;
    /**
     * Role used in a session for accessing the user's resources.
     */
    ExecutionRole?: RoleArn;
    /**
     * Specifies the KMS key that is used to encrypt the user's data stores in Athena. This setting does not apply to Athena SQL workgroups.
     */
    CustomerContentEncryptionConfiguration?: CustomerContentEncryptionConfiguration;
    /**
     * Enforces a minimal level of encryption for the workgroup for query and calculation results that are written to Amazon S3. When enabled, workgroup users can set encryption only to the minimum level set by the administrator or higher when they submit queries. The EnforceWorkGroupConfiguration setting takes precedence over the EnableMinimumEncryptionConfiguration flag. This means that if EnforceWorkGroupConfiguration is true, the EnableMinimumEncryptionConfiguration flag is ignored, and the workgroup configuration for encryption is used.
     */
    EnableMinimumEncryptionConfiguration?: BoxedBoolean;
  }
  export interface WorkGroupConfigurationUpdates {
    /**
     * If set to "true", the settings for the workgroup override client-side settings. If set to "false" client-side settings are used. For more information, see Workgroup Settings Override Client-Side Settings.
     */
    EnforceWorkGroupConfiguration?: BoxedBoolean;
    /**
     * The result configuration information about the queries in this workgroup that will be updated. Includes the updated results location and an updated option for encrypting query results.
     */
    ResultConfigurationUpdates?: ResultConfigurationUpdates;
    /**
     * Indicates whether this workgroup enables publishing metrics to Amazon CloudWatch.
     */
    PublishCloudWatchMetricsEnabled?: BoxedBoolean;
    /**
     * The upper limit (cutoff) for the amount of bytes a single query in a workgroup is allowed to scan.
     */
    BytesScannedCutoffPerQuery?: BytesScannedCutoffValue;
    /**
     * Indicates that the data usage control limit per query is removed. WorkGroupConfiguration$BytesScannedCutoffPerQuery 
     */
    RemoveBytesScannedCutoffPerQuery?: BoxedBoolean;
    /**
     * If set to true, allows members assigned to a workgroup to specify Amazon S3 Requester Pays buckets in queries. If set to false, workgroup members cannot query data from Requester Pays buckets, and queries that retrieve data from Requester Pays buckets cause an error. The default is false. For more information about Requester Pays buckets, see Requester Pays Buckets in the Amazon Simple Storage Service Developer Guide.
     */
    RequesterPaysEnabled?: BoxedBoolean;
    /**
     * The engine version requested when a workgroup is updated. After the update, all queries on the workgroup run on the requested engine version. If no value was previously set, the default is Auto. Queries on the AmazonAthenaPreviewFunctionality workgroup run on the preview engine regardless of this setting.
     */
    EngineVersion?: EngineVersion;
    /**
     * Removes content encryption configuration from an Apache Spark-enabled Athena workgroup.
     */
    RemoveCustomerContentEncryptionConfiguration?: BoxedBoolean;
    /**
     * Contains a user defined string in JSON format for a Spark-enabled workgroup.
     */
    AdditionalConfiguration?: NameString;
    /**
     * Contains the ARN of the execution role for the workgroup
     */
    ExecutionRole?: RoleArn;
    CustomerContentEncryptionConfiguration?: CustomerContentEncryptionConfiguration;
    /**
     * Enforces a minimal level of encryption for the workgroup for query and calculation results that are written to Amazon S3. When enabled, workgroup users can set encryption only to the minimum level set by the administrator or higher when they submit queries. This setting does not apply to Spark-enabled workgroups. The EnforceWorkGroupConfiguration setting takes precedence over the EnableMinimumEncryptionConfiguration flag. This means that if EnforceWorkGroupConfiguration is true, the EnableMinimumEncryptionConfiguration flag is ignored, and the workgroup configuration for encryption is used.
     */
    EnableMinimumEncryptionConfiguration?: BoxedBoolean;
  }
  export type WorkGroupDescriptionString = string;
  export type WorkGroupName = string;
  export type WorkGroupNamesList = WorkGroupName[];
  export type WorkGroupState = "ENABLED"|"DISABLED"|string;
  export interface WorkGroupSummary {
    /**
     * The name of the workgroup.
     */
    Name?: WorkGroupName;
    /**
     * The state of the workgroup.
     */
    State?: WorkGroupState;
    /**
     * The workgroup description.
     */
    Description?: WorkGroupDescriptionString;
    /**
     * The workgroup creation date and time.
     */
    CreationTime?: _Date;
    /**
     * The engine version setting for all queries on the workgroup. Queries on the AmazonAthenaPreviewFunctionality workgroup run on the preview engine regardless of this setting.
     */
    EngineVersion?: EngineVersion;
  }
  export type WorkGroupsList = WorkGroupSummary[];
  export type datumList = Datum[];
  export type datumString = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-05-18"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Athena client.
   */
  export import Types = Athena;
}
export = Athena;
