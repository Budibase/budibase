import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class RedshiftData extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: RedshiftData.Types.ClientConfiguration)
  config: Config & RedshiftData.Types.ClientConfiguration;
  /**
   * Runs one or more SQL statements, which can be data manipulation language (DML) or data definition language (DDL). Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  batchExecuteStatement(params: RedshiftData.Types.BatchExecuteStatementInput, callback?: (err: AWSError, data: RedshiftData.Types.BatchExecuteStatementOutput) => void): Request<RedshiftData.Types.BatchExecuteStatementOutput, AWSError>;
  /**
   * Runs one or more SQL statements, which can be data manipulation language (DML) or data definition language (DDL). Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  batchExecuteStatement(callback?: (err: AWSError, data: RedshiftData.Types.BatchExecuteStatementOutput) => void): Request<RedshiftData.Types.BatchExecuteStatementOutput, AWSError>;
  /**
   * Cancels a running query. To be canceled, a query must be running. 
   */
  cancelStatement(params: RedshiftData.Types.CancelStatementRequest, callback?: (err: AWSError, data: RedshiftData.Types.CancelStatementResponse) => void): Request<RedshiftData.Types.CancelStatementResponse, AWSError>;
  /**
   * Cancels a running query. To be canceled, a query must be running. 
   */
  cancelStatement(callback?: (err: AWSError, data: RedshiftData.Types.CancelStatementResponse) => void): Request<RedshiftData.Types.CancelStatementResponse, AWSError>;
  /**
   * Describes the details about a specific instance when a query was run by the Amazon Redshift Data API. The information includes when the query started, when it finished, the query status, the number of rows returned, and the SQL statement. 
   */
  describeStatement(params: RedshiftData.Types.DescribeStatementRequest, callback?: (err: AWSError, data: RedshiftData.Types.DescribeStatementResponse) => void): Request<RedshiftData.Types.DescribeStatementResponse, AWSError>;
  /**
   * Describes the details about a specific instance when a query was run by the Amazon Redshift Data API. The information includes when the query started, when it finished, the query status, the number of rows returned, and the SQL statement. 
   */
  describeStatement(callback?: (err: AWSError, data: RedshiftData.Types.DescribeStatementResponse) => void): Request<RedshiftData.Types.DescribeStatementResponse, AWSError>;
  /**
   * Describes the detailed information about a table from metadata in the cluster. The information includes its columns. A token is returned to page through the column list. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  describeTable(params: RedshiftData.Types.DescribeTableRequest, callback?: (err: AWSError, data: RedshiftData.Types.DescribeTableResponse) => void): Request<RedshiftData.Types.DescribeTableResponse, AWSError>;
  /**
   * Describes the detailed information about a table from metadata in the cluster. The information includes its columns. A token is returned to page through the column list. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  describeTable(callback?: (err: AWSError, data: RedshiftData.Types.DescribeTableResponse) => void): Request<RedshiftData.Types.DescribeTableResponse, AWSError>;
  /**
   * Runs an SQL statement, which can be data manipulation language (DML) or data definition language (DDL). This statement must be a single SQL statement. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  executeStatement(params: RedshiftData.Types.ExecuteStatementInput, callback?: (err: AWSError, data: RedshiftData.Types.ExecuteStatementOutput) => void): Request<RedshiftData.Types.ExecuteStatementOutput, AWSError>;
  /**
   * Runs an SQL statement, which can be data manipulation language (DML) or data definition language (DDL). This statement must be a single SQL statement. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  executeStatement(callback?: (err: AWSError, data: RedshiftData.Types.ExecuteStatementOutput) => void): Request<RedshiftData.Types.ExecuteStatementOutput, AWSError>;
  /**
   * Fetches the temporarily cached result of an SQL statement. A token is returned to page through the statement results. 
   */
  getStatementResult(params: RedshiftData.Types.GetStatementResultRequest, callback?: (err: AWSError, data: RedshiftData.Types.GetStatementResultResponse) => void): Request<RedshiftData.Types.GetStatementResultResponse, AWSError>;
  /**
   * Fetches the temporarily cached result of an SQL statement. A token is returned to page through the statement results. 
   */
  getStatementResult(callback?: (err: AWSError, data: RedshiftData.Types.GetStatementResultResponse) => void): Request<RedshiftData.Types.GetStatementResultResponse, AWSError>;
  /**
   * List the databases in a cluster. A token is returned to page through the database list. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  listDatabases(params: RedshiftData.Types.ListDatabasesRequest, callback?: (err: AWSError, data: RedshiftData.Types.ListDatabasesResponse) => void): Request<RedshiftData.Types.ListDatabasesResponse, AWSError>;
  /**
   * List the databases in a cluster. A token is returned to page through the database list. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  listDatabases(callback?: (err: AWSError, data: RedshiftData.Types.ListDatabasesResponse) => void): Request<RedshiftData.Types.ListDatabasesResponse, AWSError>;
  /**
   * Lists the schemas in a database. A token is returned to page through the schema list. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  listSchemas(params: RedshiftData.Types.ListSchemasRequest, callback?: (err: AWSError, data: RedshiftData.Types.ListSchemasResponse) => void): Request<RedshiftData.Types.ListSchemasResponse, AWSError>;
  /**
   * Lists the schemas in a database. A token is returned to page through the schema list. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  listSchemas(callback?: (err: AWSError, data: RedshiftData.Types.ListSchemasResponse) => void): Request<RedshiftData.Types.ListSchemasResponse, AWSError>;
  /**
   * List of SQL statements. By default, only finished statements are shown. A token is returned to page through the statement list. 
   */
  listStatements(params: RedshiftData.Types.ListStatementsRequest, callback?: (err: AWSError, data: RedshiftData.Types.ListStatementsResponse) => void): Request<RedshiftData.Types.ListStatementsResponse, AWSError>;
  /**
   * List of SQL statements. By default, only finished statements are shown. A token is returned to page through the statement list. 
   */
  listStatements(callback?: (err: AWSError, data: RedshiftData.Types.ListStatementsResponse) => void): Request<RedshiftData.Types.ListStatementsResponse, AWSError>;
  /**
   * List the tables in a database. If neither SchemaPattern nor TablePattern are specified, then all tables in the database are returned. A token is returned to page through the table list. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  listTables(params: RedshiftData.Types.ListTablesRequest, callback?: (err: AWSError, data: RedshiftData.Types.ListTablesResponse) => void): Request<RedshiftData.Types.ListTablesResponse, AWSError>;
  /**
   * List the tables in a database. If neither SchemaPattern nor TablePattern are specified, then all tables in the database are returned. A token is returned to page through the table list. Depending on the authorization method, use one of the following combinations of request parameters:    Secrets Manager - specify the Amazon Resource Name (ARN) of the secret, the database name, and the cluster identifier that matches the cluster in the secret.    Temporary credentials - specify the cluster identifier, the database name, and the database user name. Permission to call the redshift:GetClusterCredentials operation is required to use this method.   
   */
  listTables(callback?: (err: AWSError, data: RedshiftData.Types.ListTablesResponse) => void): Request<RedshiftData.Types.ListTablesResponse, AWSError>;
}
declare namespace RedshiftData {
  export interface BatchExecuteStatementInput {
    /**
     * The cluster identifier. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    ClusterIdentifier: Location;
    /**
     * The name of the database. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    Database: String;
    /**
     * The database user name. This parameter is required when authenticating using temporary credentials. 
     */
    DbUser?: String;
    /**
     * The name or ARN of the secret that enables access to the database. This parameter is required when authenticating using Secrets Manager. 
     */
    SecretArn?: SecretArn;
    /**
     * One or more SQL statements to run. 
     */
    Sqls: SqlList;
    /**
     * The name of the SQL statements. You can name the SQL statements when you create them to identify the query. 
     */
    StatementName?: StatementNameString;
    /**
     * A value that indicates whether to send an event to the Amazon EventBridge event bus after the SQL statements run. 
     */
    WithEvent?: Boolean;
  }
  export interface BatchExecuteStatementOutput {
    /**
     * The cluster identifier. 
     */
    ClusterIdentifier?: Location;
    /**
     * The date and time (UTC) the statement was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * The name of the database.
     */
    Database?: String;
    /**
     * The database user name.
     */
    DbUser?: String;
    /**
     * The identifier of the SQL statement whose results are to be fetched. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. This identifier is returned by BatchExecuteStatment. 
     */
    Id?: StatementId;
    /**
     * The name or ARN of the secret that enables access to the database. 
     */
    SecretArn?: SecretArn;
  }
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export type BoxedBoolean = boolean;
  export type BoxedDouble = number;
  export type BoxedLong = number;
  export interface CancelStatementRequest {
    /**
     * The identifier of the SQL statement to cancel. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. This identifier is returned by BatchExecuteStatment, ExecuteStatment, and ListStatements. 
     */
    Id: StatementId;
  }
  export interface CancelStatementResponse {
    /**
     * A value that indicates whether the cancel statement succeeded (true). 
     */
    Status?: Boolean;
  }
  export type ColumnList = ColumnMetadata[];
  export interface ColumnMetadata {
    /**
     * The default value of the column. 
     */
    columnDefault?: String;
    /**
     * A value that indicates whether the column is case-sensitive. 
     */
    isCaseSensitive?: bool;
    /**
     * A value that indicates whether the column contains currency values.
     */
    isCurrency?: bool;
    /**
     * A value that indicates whether an integer column is signed.
     */
    isSigned?: bool;
    /**
     * The label for the column. 
     */
    label?: String;
    /**
     * The length of the column.
     */
    length?: Integer;
    /**
     * The name of the column. 
     */
    name?: String;
    /**
     * A value that indicates whether the column is nullable. 
     */
    nullable?: Integer;
    /**
     * The precision value of a decimal number column. 
     */
    precision?: Integer;
    /**
     * The scale value of a decimal number column. 
     */
    scale?: Integer;
    /**
     * The name of the schema that contains the table that includes the column.
     */
    schemaName?: String;
    /**
     * The name of the table that includes the column. 
     */
    tableName?: String;
    /**
     * The database-specific data type of the column. 
     */
    typeName?: String;
  }
  export type ColumnMetadataList = ColumnMetadata[];
  export type DatabaseList = String[];
  export interface DescribeStatementRequest {
    /**
     * The identifier of the SQL statement to describe. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. A suffix indicates the number of the SQL statement. For example, d9b6c0c9-0747-4bf4-b142-e8883122f766:2 has a suffix of :2 that indicates the second SQL statement of a batch query. This identifier is returned by BatchExecuteStatment, ExecuteStatement, and ListStatements. 
     */
    Id: StatementId;
  }
  export interface DescribeStatementResponse {
    /**
     * The cluster identifier. 
     */
    ClusterIdentifier?: String;
    /**
     * The date and time (UTC) when the SQL statement was submitted to run. 
     */
    CreatedAt?: Timestamp;
    /**
     * The name of the database. 
     */
    Database?: String;
    /**
     * The database user name. 
     */
    DbUser?: String;
    /**
     * The amount of time in nanoseconds that the statement ran. 
     */
    Duration?: Long;
    /**
     * The error message from the cluster if the SQL statement encountered an error while running. 
     */
    Error?: String;
    /**
     * A value that indicates whether the statement has a result set. The result set can be empty. 
     */
    HasResultSet?: Boolean;
    /**
     * The identifier of the SQL statement described. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. 
     */
    Id: StatementId;
    /**
     * The parameters for the SQL statement.
     */
    QueryParameters?: SqlParametersList;
    /**
     * The SQL statement text. 
     */
    QueryString?: StatementString;
    /**
     * The process identifier from Amazon Redshift. 
     */
    RedshiftPid?: Long;
    /**
     * The identifier of the query generated by Amazon Redshift. These identifiers are also available in the query column of the STL_QUERY system view. 
     */
    RedshiftQueryId?: Long;
    /**
     * Either the number of rows returned from the SQL statement or the number of rows affected. If result size is greater than zero, the result rows can be the number of rows affected by SQL statements such as INSERT, UPDATE, DELETE, COPY, and others. A -1 indicates the value is null.
     */
    ResultRows?: Long;
    /**
     * The size in bytes of the returned results. A -1 indicates the value is null.
     */
    ResultSize?: Long;
    /**
     * The name or Amazon Resource Name (ARN) of the secret that enables access to the database. 
     */
    SecretArn?: SecretArn;
    /**
     * The status of the SQL statement being described. Status values are defined as follows:    ABORTED - The query run was stopped by the user.    ALL - A status value that includes all query statuses. This value can be used to filter results.    FAILED - The query run failed.    FINISHED - The query has finished running.    PICKED - The query has been chosen to be run.    STARTED - The query run has started.    SUBMITTED - The query was submitted, but not yet processed.   
     */
    Status?: StatusString;
    /**
     * The SQL statements from a multiple statement run.
     */
    SubStatements?: SubStatementList;
    /**
     * The date and time (UTC) that the metadata for the SQL statement was last updated. An example is the time the status last changed. 
     */
    UpdatedAt?: Timestamp;
  }
  export interface DescribeTableRequest {
    /**
     * The cluster identifier. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    ClusterIdentifier: Location;
    /**
     * A database name. The connected database is specified when you connect with your authentication credentials. 
     */
    ConnectedDatabase?: String;
    /**
     * The name of the database that contains the tables to be described. If ConnectedDatabase is not specified, this is also the database to connect to with your authentication credentials.
     */
    Database: String;
    /**
     * The database user name. This parameter is required when authenticating using temporary credentials. 
     */
    DbUser?: String;
    /**
     * The maximum number of tables to return in the response. If more tables exist than fit in one response, then NextToken is returned to page through the results. 
     */
    MaxResults?: PageSize;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * The schema that contains the table. If no schema is specified, then matching tables for all schemas are returned. 
     */
    Schema?: String;
    /**
     * The name or ARN of the secret that enables access to the database. This parameter is required when authenticating using Secrets Manager. 
     */
    SecretArn?: SecretArn;
    /**
     * The table name. If no table is specified, then all tables for all matching schemas are returned. If no table and no schema is specified, then all tables for all schemas in the database are returned
     */
    Table?: String;
  }
  export interface DescribeTableResponse {
    /**
     * A list of columns in the table. 
     */
    ColumnList?: ColumnList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * The table name. 
     */
    TableName?: String;
  }
  export interface ExecuteStatementInput {
    /**
     * The cluster identifier. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    ClusterIdentifier: Location;
    /**
     * The name of the database. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    Database: String;
    /**
     * The database user name. This parameter is required when authenticating using temporary credentials. 
     */
    DbUser?: String;
    /**
     * The parameters for the SQL statement.
     */
    Parameters?: SqlParametersList;
    /**
     * The name or ARN of the secret that enables access to the database. This parameter is required when authenticating using Secrets Manager. 
     */
    SecretArn?: SecretArn;
    /**
     * The SQL statement text to run. 
     */
    Sql: StatementString;
    /**
     * The name of the SQL statement. You can name the SQL statement when you create it to identify the query. 
     */
    StatementName?: StatementNameString;
    /**
     * A value that indicates whether to send an event to the Amazon EventBridge event bus after the SQL statement runs. 
     */
    WithEvent?: Boolean;
  }
  export interface ExecuteStatementOutput {
    /**
     * The cluster identifier. 
     */
    ClusterIdentifier?: Location;
    /**
     * The date and time (UTC) the statement was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * The name of the database.
     */
    Database?: String;
    /**
     * The database user name.
     */
    DbUser?: String;
    /**
     * The identifier of the SQL statement whose results are to be fetched. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. 
     */
    Id?: StatementId;
    /**
     * The name or ARN of the secret that enables access to the database. 
     */
    SecretArn?: SecretArn;
  }
  export interface Field {
    /**
     * A value of the BLOB data type. 
     */
    blobValue?: _Blob;
    /**
     * A value of the Boolean data type. 
     */
    booleanValue?: BoxedBoolean;
    /**
     * A value of the double data type. 
     */
    doubleValue?: BoxedDouble;
    /**
     * A value that indicates whether the data is NULL. 
     */
    isNull?: BoxedBoolean;
    /**
     * A value of the long data type. 
     */
    longValue?: BoxedLong;
    /**
     * A value of the string data type. 
     */
    stringValue?: String;
  }
  export type FieldList = Field[];
  export interface GetStatementResultRequest {
    /**
     * The identifier of the SQL statement whose results are to be fetched. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. A suffix indicates then number of the SQL statement. For example, d9b6c0c9-0747-4bf4-b142-e8883122f766:2 has a suffix of :2 that indicates the second SQL statement of a batch query. This identifier is returned by BatchExecuteStatment, ExecuteStatment, and ListStatements. 
     */
    Id: StatementId;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
  }
  export interface GetStatementResultResponse {
    /**
     * The properties (metadata) of a column. 
     */
    ColumnMetadata?: ColumnMetadataList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * The results of the SQL statement.
     */
    Records: SqlRecords;
    /**
     * The total number of rows in the result set returned from a query. You can use this number to estimate the number of calls to the GetStatementResult operation needed to page through the results. 
     */
    TotalNumRows?: Long;
  }
  export type Integer = number;
  export interface ListDatabasesRequest {
    /**
     * The cluster identifier. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    ClusterIdentifier: Location;
    /**
     * The name of the database. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    Database: String;
    /**
     * The database user name. This parameter is required when authenticating using temporary credentials. 
     */
    DbUser?: String;
    /**
     * The maximum number of databases to return in the response. If more databases exist than fit in one response, then NextToken is returned to page through the results. 
     */
    MaxResults?: PageSize;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * The name or ARN of the secret that enables access to the database. This parameter is required when authenticating using Secrets Manager. 
     */
    SecretArn?: SecretArn;
  }
  export interface ListDatabasesResponse {
    /**
     * The names of databases. 
     */
    Databases?: DatabaseList;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
  }
  export interface ListSchemasRequest {
    /**
     * The cluster identifier. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    ClusterIdentifier: Location;
    /**
     * A database name. The connected database is specified when you connect with your authentication credentials. 
     */
    ConnectedDatabase?: String;
    /**
     * The name of the database that contains the schemas to list. If ConnectedDatabase is not specified, this is also the database to connect to with your authentication credentials.
     */
    Database: String;
    /**
     * The database user name. This parameter is required when authenticating using temporary credentials. 
     */
    DbUser?: String;
    /**
     * The maximum number of schemas to return in the response. If more schemas exist than fit in one response, then NextToken is returned to page through the results. 
     */
    MaxResults?: PageSize;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * A pattern to filter results by schema name. Within a schema pattern, "%" means match any substring of 0 or more characters and "_" means match any one character. Only schema name entries matching the search pattern are returned. 
     */
    SchemaPattern?: String;
    /**
     * The name or ARN of the secret that enables access to the database. This parameter is required when authenticating using Secrets Manager. 
     */
    SecretArn?: SecretArn;
  }
  export interface ListSchemasResponse {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * The schemas that match the request pattern. 
     */
    Schemas?: SchemaList;
  }
  export type ListStatementsLimit = number;
  export interface ListStatementsRequest {
    /**
     * The maximum number of SQL statements to return in the response. If more SQL statements exist than fit in one response, then NextToken is returned to page through the results. 
     */
    MaxResults?: ListStatementsLimit;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * A value that filters which statements to return in the response. If true, all statements run by the caller's IAM role are returned. If false, only statements run by the caller's IAM role in the current IAM session are returned. The default is true. 
     */
    RoleLevel?: Boolean;
    /**
     * The name of the SQL statement specified as input to BatchExecuteStatement or ExecuteStatement to identify the query. You can list multiple statements by providing a prefix that matches the beginning of the statement name. For example, to list myStatement1, myStatement2, myStatement3, and so on, then provide the a value of myStatement. Data API does a case-sensitive match of SQL statement names to the prefix value you provide. 
     */
    StatementName?: StatementNameString;
    /**
     * The status of the SQL statement to list. Status values are defined as follows:    ABORTED - The query run was stopped by the user.    ALL - A status value that includes all query statuses. This value can be used to filter results.    FAILED - The query run failed.    FINISHED - The query has finished running.    PICKED - The query has been chosen to be run.    STARTED - The query run has started.    SUBMITTED - The query was submitted, but not yet processed.   
     */
    Status?: StatusString;
  }
  export interface ListStatementsResponse {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * The SQL statements. 
     */
    Statements: StatementList;
  }
  export interface ListTablesRequest {
    /**
     * The cluster identifier. This parameter is required when authenticating using either Secrets Manager or temporary credentials. 
     */
    ClusterIdentifier: Location;
    /**
     * A database name. The connected database is specified when you connect with your authentication credentials. 
     */
    ConnectedDatabase?: String;
    /**
     * The name of the database that contains the tables to list. If ConnectedDatabase is not specified, this is also the database to connect to with your authentication credentials.
     */
    Database: String;
    /**
     * The database user name. This parameter is required when authenticating using temporary credentials. 
     */
    DbUser?: String;
    /**
     * The maximum number of tables to return in the response. If more tables exist than fit in one response, then NextToken is returned to page through the results. 
     */
    MaxResults?: PageSize;
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * A pattern to filter results by schema name. Within a schema pattern, "%" means match any substring of 0 or more characters and "_" means match any one character. Only schema name entries matching the search pattern are returned. If SchemaPattern is not specified, then all tables that match TablePattern are returned. If neither SchemaPattern or TablePattern are specified, then all tables are returned. 
     */
    SchemaPattern?: String;
    /**
     * The name or ARN of the secret that enables access to the database. This parameter is required when authenticating using Secrets Manager. 
     */
    SecretArn?: SecretArn;
    /**
     * A pattern to filter results by table name. Within a table pattern, "%" means match any substring of 0 or more characters and "_" means match any one character. Only table name entries matching the search pattern are returned. If TablePattern is not specified, then all tables that match SchemaPatternare returned. If neither SchemaPattern or TablePattern are specified, then all tables are returned. 
     */
    TablePattern?: String;
  }
  export interface ListTablesResponse {
    /**
     * A value that indicates the starting point for the next set of response records in a subsequent request. If a value is returned in a response, you can retrieve the next set of records by providing this returned NextToken value in the next NextToken parameter and retrying the command. If the NextToken field is empty, all response records have been retrieved for the request. 
     */
    NextToken?: String;
    /**
     * The tables that match the request pattern. 
     */
    Tables?: TableList;
  }
  export type Location = string;
  export type Long = number;
  export type PageSize = number;
  export type ParameterName = string;
  export type ParameterValue = string;
  export type SchemaList = String[];
  export type SecretArn = string;
  export type SqlList = StatementString[];
  export interface SqlParameter {
    /**
     * The name of the parameter.
     */
    name: ParameterName;
    /**
     * The value of the parameter. Amazon Redshift implicitly converts to the proper data type. For more inforation, see Data types in the Amazon Redshift Database Developer Guide. 
     */
    value: ParameterValue;
  }
  export type SqlParametersList = SqlParameter[];
  export type SqlRecords = FieldList[];
  export interface StatementData {
    /**
     * The date and time (UTC) the statement was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * The SQL statement identifier. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. 
     */
    Id: StatementId;
    /**
     * A value that indicates whether the statement is a batch query request.
     */
    IsBatchStatement?: Boolean;
    /**
     * The parameters used in a SQL statement.
     */
    QueryParameters?: SqlParametersList;
    /**
     * The SQL statement.
     */
    QueryString?: StatementString;
    /**
     * One or more SQL statements. Each query string in the array corresponds to one of the queries in a batch query request.
     */
    QueryStrings?: StatementStringList;
    /**
     * The name or Amazon Resource Name (ARN) of the secret that enables access to the database. 
     */
    SecretArn?: SecretArn;
    /**
     * The name of the SQL statement. 
     */
    StatementName?: StatementNameString;
    /**
     * The status of the SQL statement. An example is the that the SQL statement finished. 
     */
    Status?: StatusString;
    /**
     * The date and time (UTC) that the statement metadata was last updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type StatementId = string;
  export type StatementList = StatementData[];
  export type StatementNameString = string;
  export type StatementStatusString = "SUBMITTED"|"PICKED"|"STARTED"|"FINISHED"|"ABORTED"|"FAILED"|string;
  export type StatementString = string;
  export type StatementStringList = StatementString[];
  export type StatusString = "SUBMITTED"|"PICKED"|"STARTED"|"FINISHED"|"ABORTED"|"FAILED"|"ALL"|string;
  export type String = string;
  export interface SubStatementData {
    /**
     * The date and time (UTC) the statement was created. 
     */
    CreatedAt?: Timestamp;
    /**
     * The amount of time in nanoseconds that the statement ran.
     */
    Duration?: Long;
    /**
     * The error message from the cluster if the SQL statement encountered an error while running.
     */
    Error?: String;
    /**
     * A value that indicates whether the statement has a result set. The result set can be empty.
     */
    HasResultSet?: Boolean;
    /**
     * The identifier of the SQL statement. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. A suffix indicates the number of the SQL statement. For example, d9b6c0c9-0747-4bf4-b142-e8883122f766:2 has a suffix of :2 that indicates the second SQL statement of a batch query.
     */
    Id: StatementId;
    /**
     * The SQL statement text.
     */
    QueryString?: StatementString;
    /**
     * The SQL statement identifier. This value is a universally unique identifier (UUID) generated by Amazon Redshift Data API. 
     */
    RedshiftQueryId?: Long;
    /**
     * Either the number of rows returned from the SQL statement or the number of rows affected. If result size is greater than zero, the result rows can be the number of rows affected by SQL statements such as INSERT, UPDATE, DELETE, COPY, and others. A -1 indicates the value is null.
     */
    ResultRows?: Long;
    /**
     * The size in bytes of the returned results. A -1 indicates the value is null.
     */
    ResultSize?: Long;
    /**
     * The status of the SQL statement. An example is the that the SQL statement finished. 
     */
    Status?: StatementStatusString;
    /**
     * The date and time (UTC) that the statement metadata was last updated.
     */
    UpdatedAt?: Timestamp;
  }
  export type SubStatementList = SubStatementData[];
  export type TableList = TableMember[];
  export interface TableMember {
    /**
     * The name of the table. 
     */
    name?: String;
    /**
     * The schema containing the table. 
     */
    schema?: String;
    /**
     * The type of the table. Possible values include TABLE, VIEW, SYSTEM TABLE, GLOBAL TEMPORARY, LOCAL TEMPORARY, ALIAS, and SYNONYM. 
     */
    type?: String;
  }
  export type Timestamp = Date;
  export type bool = boolean;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-12-20"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the RedshiftData client.
   */
  export import Types = RedshiftData;
}
export = RedshiftData;
