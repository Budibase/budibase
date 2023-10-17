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
   * Returns the details of a single query execution or a list of up to 50 query executions, which you provide as an array of query execution ID strings. Requires you to have access to the workgroup in which the queries ran. To get a list of query execution IDs, use ListQueryExecutionsInput$WorkGroup. Query executions differ from named (saved) queries. Use BatchGetNamedQueryInput to get details about named queries.
   */
  batchGetQueryExecution(params: Athena.Types.BatchGetQueryExecutionInput, callback?: (err: AWSError, data: Athena.Types.BatchGetQueryExecutionOutput) => void): Request<Athena.Types.BatchGetQueryExecutionOutput, AWSError>;
  /**
   * Returns the details of a single query execution or a list of up to 50 query executions, which you provide as an array of query execution ID strings. Requires you to have access to the workgroup in which the queries ran. To get a list of query execution IDs, use ListQueryExecutionsInput$WorkGroup. Query executions differ from named (saved) queries. Use BatchGetNamedQueryInput to get details about named queries.
   */
  batchGetQueryExecution(callback?: (err: AWSError, data: Athena.Types.BatchGetQueryExecutionOutput) => void): Request<Athena.Types.BatchGetQueryExecutionOutput, AWSError>;
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
   * Creates a prepared statement for use with SQL queries in Athena.
   */
  createPreparedStatement(params: Athena.Types.CreatePreparedStatementInput, callback?: (err: AWSError, data: Athena.Types.CreatePreparedStatementOutput) => void): Request<Athena.Types.CreatePreparedStatementOutput, AWSError>;
  /**
   * Creates a prepared statement for use with SQL queries in Athena.
   */
  createPreparedStatement(callback?: (err: AWSError, data: Athena.Types.CreatePreparedStatementOutput) => void): Request<Athena.Types.CreatePreparedStatementOutput, AWSError>;
  /**
   * Creates a workgroup with the specified name.
   */
  createWorkGroup(params: Athena.Types.CreateWorkGroupInput, callback?: (err: AWSError, data: Athena.Types.CreateWorkGroupOutput) => void): Request<Athena.Types.CreateWorkGroupOutput, AWSError>;
  /**
   * Creates a workgroup with the specified name.
   */
  createWorkGroup(callback?: (err: AWSError, data: Athena.Types.CreateWorkGroupOutput) => void): Request<Athena.Types.CreateWorkGroupOutput, AWSError>;
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
   * Streams the results of a single query execution specified by QueryExecutionId from the Athena query results location in Amazon S3. For more information, see Query Results in the Amazon Athena User Guide. This request does not execute the query but returns results. Use StartQueryExecution to run a query. To stream query results successfully, the IAM principal with permission to call GetQueryResults also must have permissions to the Amazon S3 GetObject action for the Athena query results location.  IAM principals with permission to the Amazon S3 GetObject action for the query results location are able to retrieve query results from Amazon S3 even if permission to the GetQueryResults action is denied. To restrict user or role access, ensure that Amazon S3 permissions to the Athena query location are denied. 
   */
  getQueryResults(params: Athena.Types.GetQueryResultsInput, callback?: (err: AWSError, data: Athena.Types.GetQueryResultsOutput) => void): Request<Athena.Types.GetQueryResultsOutput, AWSError>;
  /**
   * Streams the results of a single query execution specified by QueryExecutionId from the Athena query results location in Amazon S3. For more information, see Query Results in the Amazon Athena User Guide. This request does not execute the query but returns results. Use StartQueryExecution to run a query. To stream query results successfully, the IAM principal with permission to call GetQueryResults also must have permissions to the Amazon S3 GetObject action for the Athena query results location.  IAM principals with permission to the Amazon S3 GetObject action for the query results location are able to retrieve query results from Amazon S3 even if permission to the GetQueryResults action is denied. To restrict user or role access, ensure that Amazon S3 permissions to the Athena query location are denied. 
   */
  getQueryResults(callback?: (err: AWSError, data: Athena.Types.GetQueryResultsOutput) => void): Request<Athena.Types.GetQueryResultsOutput, AWSError>;
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
   * Lists the data catalogs in the current Amazon Web Services account.
   */
  listDataCatalogs(params: Athena.Types.ListDataCatalogsInput, callback?: (err: AWSError, data: Athena.Types.ListDataCatalogsOutput) => void): Request<Athena.Types.ListDataCatalogsOutput, AWSError>;
  /**
   * Lists the data catalogs in the current Amazon Web Services account.
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
   * Provides a list of available query IDs only for queries saved in the specified workgroup. Requires that you have access to the specified workgroup. If a workgroup is not specified, lists the saved queries for the primary workgroup. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  listNamedQueries(params: Athena.Types.ListNamedQueriesInput, callback?: (err: AWSError, data: Athena.Types.ListNamedQueriesOutput) => void): Request<Athena.Types.ListNamedQueriesOutput, AWSError>;
  /**
   * Provides a list of available query IDs only for queries saved in the specified workgroup. Requires that you have access to the specified workgroup. If a workgroup is not specified, lists the saved queries for the primary workgroup. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  listNamedQueries(callback?: (err: AWSError, data: Athena.Types.ListNamedQueriesOutput) => void): Request<Athena.Types.ListNamedQueriesOutput, AWSError>;
  /**
   * Lists the prepared statements in the specfied workgroup.
   */
  listPreparedStatements(params: Athena.Types.ListPreparedStatementsInput, callback?: (err: AWSError, data: Athena.Types.ListPreparedStatementsOutput) => void): Request<Athena.Types.ListPreparedStatementsOutput, AWSError>;
  /**
   * Lists the prepared statements in the specfied workgroup.
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
   * Lists the metadata for the tables in the specified data catalog database.
   */
  listTableMetadata(params: Athena.Types.ListTableMetadataInput, callback?: (err: AWSError, data: Athena.Types.ListTableMetadataOutput) => void): Request<Athena.Types.ListTableMetadataOutput, AWSError>;
  /**
   * Lists the metadata for the tables in the specified data catalog database.
   */
  listTableMetadata(callback?: (err: AWSError, data: Athena.Types.ListTableMetadataOutput) => void): Request<Athena.Types.ListTableMetadataOutput, AWSError>;
  /**
   * Lists the tags associated with an Athena workgroup or data catalog resource.
   */
  listTagsForResource(params: Athena.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: Athena.Types.ListTagsForResourceOutput) => void): Request<Athena.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the tags associated with an Athena workgroup or data catalog resource.
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
   * Runs the SQL query statements contained in the Query. Requires you to have access to the workgroup in which the query ran. Running queries against an external catalog requires GetDataCatalog permission to the catalog. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  startQueryExecution(params: Athena.Types.StartQueryExecutionInput, callback?: (err: AWSError, data: Athena.Types.StartQueryExecutionOutput) => void): Request<Athena.Types.StartQueryExecutionOutput, AWSError>;
  /**
   * Runs the SQL query statements contained in the Query. Requires you to have access to the workgroup in which the query ran. Running queries against an external catalog requires GetDataCatalog permission to the catalog. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  startQueryExecution(callback?: (err: AWSError, data: Athena.Types.StartQueryExecutionOutput) => void): Request<Athena.Types.StartQueryExecutionOutput, AWSError>;
  /**
   * Stops a query execution. Requires you to have access to the workgroup in which the query ran. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  stopQueryExecution(params: Athena.Types.StopQueryExecutionInput, callback?: (err: AWSError, data: Athena.Types.StopQueryExecutionOutput) => void): Request<Athena.Types.StopQueryExecutionOutput, AWSError>;
  /**
   * Stops a query execution. Requires you to have access to the workgroup in which the query ran. For code samples using the Amazon Web Services SDK for Java, see Examples and Code Samples in the Amazon Athena User Guide.
   */
  stopQueryExecution(callback?: (err: AWSError, data: Athena.Types.StopQueryExecutionOutput) => void): Request<Athena.Types.StopQueryExecutionOutput, AWSError>;
  /**
   * Adds one or more tags to an Athena resource. A tag is a label that you assign to a resource. In Athena, a resource can be a workgroup or data catalog. Each tag consists of a key and an optional value, both of which you define. For example, you can use tags to categorize Athena workgroups or data catalogs by purpose, owner, or environment. Use a consistent set of tag keys to make it easier to search and filter workgroups or data catalogs in your account. For best practices, see Tagging Best Practices. Tag keys can be from 1 to 128 UTF-8 Unicode characters, and tag values can be from 0 to 256 UTF-8 Unicode characters. Tags can use letters and numbers representable in UTF-8, and the following characters: + - = . _ : / @. Tag keys and values are case-sensitive. Tag keys must be unique per resource. If you specify more than one tag, separate them by commas.
   */
  tagResource(params: Athena.Types.TagResourceInput, callback?: (err: AWSError, data: Athena.Types.TagResourceOutput) => void): Request<Athena.Types.TagResourceOutput, AWSError>;
  /**
   * Adds one or more tags to an Athena resource. A tag is a label that you assign to a resource. In Athena, a resource can be a workgroup or data catalog. Each tag consists of a key and an optional value, both of which you define. For example, you can use tags to categorize Athena workgroups or data catalogs by purpose, owner, or environment. Use a consistent set of tag keys to make it easier to search and filter workgroups or data catalogs in your account. For best practices, see Tagging Best Practices. Tag keys can be from 1 to 128 UTF-8 Unicode characters, and tag values can be from 0 to 256 UTF-8 Unicode characters. Tags can use letters and numbers representable in UTF-8, and the following characters: + - = . _ : / @. Tag keys and values are case-sensitive. Tag keys must be unique per resource. If you specify more than one tag, separate them by commas.
   */
  tagResource(callback?: (err: AWSError, data: Athena.Types.TagResourceOutput) => void): Request<Athena.Types.TagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from a data catalog or workgroup resource.
   */
  untagResource(params: Athena.Types.UntagResourceInput, callback?: (err: AWSError, data: Athena.Types.UntagResourceOutput) => void): Request<Athena.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes one or more tags from a data catalog or workgroup resource.
   */
  untagResource(callback?: (err: AWSError, data: Athena.Types.UntagResourceOutput) => void): Request<Athena.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates the data catalog that has the specified name.
   */
  updateDataCatalog(params: Athena.Types.UpdateDataCatalogInput, callback?: (err: AWSError, data: Athena.Types.UpdateDataCatalogOutput) => void): Request<Athena.Types.UpdateDataCatalogOutput, AWSError>;
  /**
   * Updates the data catalog that has the specified name.
   */
  updateDataCatalog(callback?: (err: AWSError, data: Athena.Types.UpdateDataCatalogOutput) => void): Request<Athena.Types.UpdateDataCatalogOutput, AWSError>;
  /**
   * Updates a prepared statement.
   */
  updatePreparedStatement(params: Athena.Types.UpdatePreparedStatementInput, callback?: (err: AWSError, data: Athena.Types.UpdatePreparedStatementOutput) => void): Request<Athena.Types.UpdatePreparedStatementOutput, AWSError>;
  /**
   * Updates a prepared statement.
   */
  updatePreparedStatement(callback?: (err: AWSError, data: Athena.Types.UpdatePreparedStatementOutput) => void): Request<Athena.Types.UpdatePreparedStatementOutput, AWSError>;
  /**
   * Updates the workgroup with the specified name. The workgroup's name cannot be changed.
   */
  updateWorkGroup(params: Athena.Types.UpdateWorkGroupInput, callback?: (err: AWSError, data: Athena.Types.UpdateWorkGroupOutput) => void): Request<Athena.Types.UpdateWorkGroupOutput, AWSError>;
  /**
   * Updates the workgroup with the specified name. The workgroup's name cannot be changed.
   */
  updateWorkGroup(callback?: (err: AWSError, data: Athena.Types.UpdateWorkGroupOutput) => void): Request<Athena.Types.UpdateWorkGroupOutput, AWSError>;
}
declare namespace Athena {
  export type AmazonResourceName = string;
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
  export type CatalogNameString = string;
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
  export interface CreateDataCatalogInput {
    /**
     * The name of the data catalog to create. The catalog name must be unique for the Amazon Web Services account and can use a maximum of 128 alphanumeric, underscore, at sign, or hyphen characters.
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
  export interface CreateWorkGroupInput {
    /**
     * The workgroup name.
     */
    Name: WorkGroupName;
    /**
     * The configuration for the workgroup, which includes the location in Amazon S3 where query results are stored, the encryption configuration, if any, used for encrypting query results, whether the Amazon CloudWatch Metrics are enabled for the workgroup, the limit for the amount of bytes scanned (cutoff) per query, if it is specified, and whether workgroup's settings (specified with EnforceWorkGroupConfiguration) in the WorkGroupConfiguration override client-side settings. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
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
  export interface DataCatalog {
    /**
     * The name of the data catalog. The catalog name must be unique for the Amazon Web Services account and can use a maximum of 128 alphanumeric, underscore, at sign, or hyphen characters.
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
     * The name of the data catalog.
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
     * The option to delete the workgroup and its contents even if the workgroup contains any named queries or query executions.
     */
    RecursiveDeleteOption?: BoxedBoolean;
  }
  export interface DeleteWorkGroupOutput {
  }
  export type DescriptionString = string;
  export interface EncryptionConfiguration {
    /**
     * Indicates whether Amazon S3 server-side encryption with Amazon S3-managed keys (SSE-S3), server-side encryption with KMS-managed keys (SSE-KMS), or client-side encryption with KMS-managed keys (CSE-KMS) is used. If a query runs in a workgroup and the workgroup overrides client-side settings, then the workgroup's setting for encryption is used. It specifies whether query results must be encrypted, for all queries that run in this workgroup. 
     */
    EncryptionOption: EncryptionOption;
    /**
     * For SSE-KMS and CSE-KMS, this is the KMS key ARN or ID.
     */
    KmsKey?: String;
  }
  export type EncryptionOption = "SSE_S3"|"SSE_KMS"|"CSE_KMS"|string;
  export interface EngineVersion {
    /**
     * The engine version requested by the user. Possible values are determined by the output of ListEngineVersions, including Auto. The default is Auto.
     */
    SelectedEngineVersion?: NameString;
    /**
     * Read only. The engine version on which the query runs. If the user requests a valid engine version other than Auto, the effective engine version is the same as the engine version that the user requested. If the user requests Auto, the effective engine version is chosen by Athena. When a request to update the engine version is made by a CreateWorkGroup or UpdateWorkGroup operation, the EffectiveEngineVersion field is ignored.
     */
    EffectiveEngineVersion?: NameString;
  }
  export type EngineVersionsList = EngineVersion[];
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export type ExpressionString = string;
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
  export type Integer = number;
  export type KeyString = string;
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
  export type MaxDataCatalogsCount = number;
  export type MaxDatabasesCount = number;
  export type MaxEngineVersionsCount = number;
  export type MaxNamedQueriesCount = number;
  export type MaxPreparedStatementsCount = number;
  export type MaxQueryExecutionsCount = number;
  export type MaxQueryResults = number;
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
     * The SQL query statements that comprise the query.
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
  export type NamedQueryId = string;
  export type NamedQueryIdList = NamedQueryId[];
  export type NamedQueryList = NamedQuery[];
  export type ParametersMap = {[key: string]: ParametersMapValue};
  export type ParametersMapValue = string;
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
     * The location in Amazon S3 where query results were stored and the encryption option, if any, used for query results. These are known as "client-side settings". If workgroup settings override client-side settings, then the query uses the location for the query results and the encryption configuration that are specified for the workgroup.
     */
    ResultConfiguration?: ResultConfiguration;
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
  }
  export type QueryString = string;
  export interface ResultConfiguration {
    /**
     * The location in Amazon S3 where your query results are stored, such as s3://path/to/query/bucket/. To run the query, you must specify the query results location using one of the ways: either for individual queries using either this setting (client-side), or in the workgroup, using WorkGroupConfiguration. If none of them is set, Athena issues an error that no output location is provided. For more information, see Query Results. If workgroup settings override client-side settings, then the query uses the settings specified for the workgroup. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
     */
    OutputLocation?: String;
    /**
     * If query results are encrypted in Amazon S3, indicates the encryption option used (for example, SSE-KMS or CSE-KMS) and key information. This is a client-side setting. If workgroup settings override client-side settings, then the query uses the encryption configuration that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See WorkGroupConfiguration$EnforceWorkGroupConfiguration and Workgroup Settings Override Client-Side Settings.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
  }
  export interface ResultConfigurationUpdates {
    /**
     * The location in Amazon S3 where your query results are stored, such as s3://path/to/query/bucket/. For more information, see Query Results If workgroup settings override client-side settings, then the query uses the location for the query results and the encryption configuration that are specified for the workgroup. The "workgroup settings override" is specified in EnforceWorkGroupConfiguration (true/false) in the WorkGroupConfiguration. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
     */
    OutputLocation?: String;
    /**
     * If set to "true", indicates that the previously-specified query results location (also known as a client-side setting) for queries in this workgroup should be ignored and set to null. If set to "false" or not set, and a value is present in the OutputLocation in ResultConfigurationUpdates (the client-side setting), the OutputLocation in the workgroup's ResultConfiguration will be updated with the new value. For more information, see Workgroup Settings Override Client-Side Settings.
     */
    RemoveOutputLocation?: BoxedBoolean;
    /**
     * The encryption configuration for the query results.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
    /**
     * If set to "true", indicates that the previously-specified encryption configuration (also known as the client-side setting) for queries in this workgroup should be ignored and set to null. If set to "false" or not set, and a value is present in the EncryptionConfiguration in ResultConfigurationUpdates (the client-side setting), the EncryptionConfiguration in the workgroup's ResultConfiguration will be updated with the new value. For more information, see Workgroup Settings Override Client-Side Settings.
     */
    RemoveEncryptionConfiguration?: BoxedBoolean;
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
  export interface Row {
    /**
     * The data that populates a row in a query result table.
     */
    Data?: datumList;
  }
  export type RowList = Row[];
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
  }
  export interface StartQueryExecutionOutput {
    /**
     * The unique ID of the query that ran as a result of this request.
     */
    QueryExecutionId?: QueryExecutionId;
  }
  export type StatementName = string;
  export type StatementType = "DDL"|"DML"|"UTILITY"|string;
  export interface StopQueryExecutionInput {
    /**
     * The unique ID of the query execution to stop.
     */
    QueryExecutionId: QueryExecutionId;
  }
  export interface StopQueryExecutionOutput {
  }
  export type String = string;
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
     * Specifies the ARN of the Athena resource (workgroup or data catalog) to which tags are to be added.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A collection of one or more tags, separated by commas, to be added to an Athena workgroup or data catalog resource.
     */
    Tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
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
  export interface UpdateDataCatalogInput {
    /**
     * The name of the data catalog to update. The catalog name must be unique for the Amazon Web Services account and can use a maximum of 128 alphanumeric, underscore, at sign, or hyphen characters.
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
     * The workgroup configuration that will be updated for the given workgroup.
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
     * The configuration of the workgroup, which includes the location in Amazon S3 where query results are stored, the encryption configuration, if any, used for query results; whether the Amazon CloudWatch Metrics are enabled for the workgroup; whether workgroup settings override client-side settings; and the data usage limits for the amount of data scanned per query or per workgroup. The workgroup settings override is specified in EnforceWorkGroupConfiguration (true/false) in the WorkGroupConfiguration. See WorkGroupConfiguration$EnforceWorkGroupConfiguration.
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
     * The configuration for the workgroup, which includes the location in Amazon S3 where query results are stored and the encryption option, if any, used for query results. To run the query, you must specify the query results location using one of the ways: either in the workgroup using this setting, or for individual queries (client-side), using ResultConfiguration$OutputLocation. If none of them is set, Athena issues an error that no output location is provided. For more information, see Query Results.
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
  }
  export type WorkGroupDescriptionString = string;
  export type WorkGroupName = string;
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
