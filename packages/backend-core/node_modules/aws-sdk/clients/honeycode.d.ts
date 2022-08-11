import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Honeycode extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Honeycode.Types.ClientConfiguration)
  config: Config & Honeycode.Types.ClientConfiguration;
  /**
   *  The BatchCreateTableRows API allows you to create one or more rows at the end of a table in a workbook. The API allows you to specify the values to set in some or all of the columns in the new rows.   If a column is not explicitly set in a specific row, then the column level formula specified in the table will be applied to the new row. If there is no column level formula but the last row of the table has a formula, then that formula will be copied down to the new row. If there is no column level formula and no formula in the last row of the table, then that column will be left blank for the new rows. 
   */
  batchCreateTableRows(params: Honeycode.Types.BatchCreateTableRowsRequest, callback?: (err: AWSError, data: Honeycode.Types.BatchCreateTableRowsResult) => void): Request<Honeycode.Types.BatchCreateTableRowsResult, AWSError>;
  /**
   *  The BatchCreateTableRows API allows you to create one or more rows at the end of a table in a workbook. The API allows you to specify the values to set in some or all of the columns in the new rows.   If a column is not explicitly set in a specific row, then the column level formula specified in the table will be applied to the new row. If there is no column level formula but the last row of the table has a formula, then that formula will be copied down to the new row. If there is no column level formula and no formula in the last row of the table, then that column will be left blank for the new rows. 
   */
  batchCreateTableRows(callback?: (err: AWSError, data: Honeycode.Types.BatchCreateTableRowsResult) => void): Request<Honeycode.Types.BatchCreateTableRowsResult, AWSError>;
  /**
   *  The BatchDeleteTableRows API allows you to delete one or more rows from a table in a workbook. You need to specify the ids of the rows that you want to delete from the table. 
   */
  batchDeleteTableRows(params: Honeycode.Types.BatchDeleteTableRowsRequest, callback?: (err: AWSError, data: Honeycode.Types.BatchDeleteTableRowsResult) => void): Request<Honeycode.Types.BatchDeleteTableRowsResult, AWSError>;
  /**
   *  The BatchDeleteTableRows API allows you to delete one or more rows from a table in a workbook. You need to specify the ids of the rows that you want to delete from the table. 
   */
  batchDeleteTableRows(callback?: (err: AWSError, data: Honeycode.Types.BatchDeleteTableRowsResult) => void): Request<Honeycode.Types.BatchDeleteTableRowsResult, AWSError>;
  /**
   *  The BatchUpdateTableRows API allows you to update one or more rows in a table in a workbook.   You can specify the values to set in some or all of the columns in the table for the specified rows. If a column is not explicitly specified in a particular row, then that column will not be updated for that row. To clear out the data in a specific cell, you need to set the value as an empty string (""). 
   */
  batchUpdateTableRows(params: Honeycode.Types.BatchUpdateTableRowsRequest, callback?: (err: AWSError, data: Honeycode.Types.BatchUpdateTableRowsResult) => void): Request<Honeycode.Types.BatchUpdateTableRowsResult, AWSError>;
  /**
   *  The BatchUpdateTableRows API allows you to update one or more rows in a table in a workbook.   You can specify the values to set in some or all of the columns in the table for the specified rows. If a column is not explicitly specified in a particular row, then that column will not be updated for that row. To clear out the data in a specific cell, you need to set the value as an empty string (""). 
   */
  batchUpdateTableRows(callback?: (err: AWSError, data: Honeycode.Types.BatchUpdateTableRowsResult) => void): Request<Honeycode.Types.BatchUpdateTableRowsResult, AWSError>;
  /**
   *  The BatchUpsertTableRows API allows you to upsert one or more rows in a table. The upsert operation takes a filter expression as input and evaluates it to find matching rows on the destination table. If matching rows are found, it will update the cells in the matching rows to new values specified in the request. If no matching rows are found, a new row is added at the end of the table and the cells in that row are set to the new values specified in the request.   You can specify the values to set in some or all of the columns in the table for the matching or newly appended rows. If a column is not explicitly specified for a particular row, then that column will not be updated for that row. To clear out the data in a specific cell, you need to set the value as an empty string (""). 
   */
  batchUpsertTableRows(params: Honeycode.Types.BatchUpsertTableRowsRequest, callback?: (err: AWSError, data: Honeycode.Types.BatchUpsertTableRowsResult) => void): Request<Honeycode.Types.BatchUpsertTableRowsResult, AWSError>;
  /**
   *  The BatchUpsertTableRows API allows you to upsert one or more rows in a table. The upsert operation takes a filter expression as input and evaluates it to find matching rows on the destination table. If matching rows are found, it will update the cells in the matching rows to new values specified in the request. If no matching rows are found, a new row is added at the end of the table and the cells in that row are set to the new values specified in the request.   You can specify the values to set in some or all of the columns in the table for the matching or newly appended rows. If a column is not explicitly specified for a particular row, then that column will not be updated for that row. To clear out the data in a specific cell, you need to set the value as an empty string (""). 
   */
  batchUpsertTableRows(callback?: (err: AWSError, data: Honeycode.Types.BatchUpsertTableRowsResult) => void): Request<Honeycode.Types.BatchUpsertTableRowsResult, AWSError>;
  /**
   *  The DescribeTableDataImportJob API allows you to retrieve the status and details of a table data import job. 
   */
  describeTableDataImportJob(params: Honeycode.Types.DescribeTableDataImportJobRequest, callback?: (err: AWSError, data: Honeycode.Types.DescribeTableDataImportJobResult) => void): Request<Honeycode.Types.DescribeTableDataImportJobResult, AWSError>;
  /**
   *  The DescribeTableDataImportJob API allows you to retrieve the status and details of a table data import job. 
   */
  describeTableDataImportJob(callback?: (err: AWSError, data: Honeycode.Types.DescribeTableDataImportJobResult) => void): Request<Honeycode.Types.DescribeTableDataImportJobResult, AWSError>;
  /**
   *  The GetScreenData API allows retrieval of data from a screen in a Honeycode app. The API allows setting local variables in the screen to filter, sort or otherwise affect what will be displayed on the screen. 
   */
  getScreenData(params: Honeycode.Types.GetScreenDataRequest, callback?: (err: AWSError, data: Honeycode.Types.GetScreenDataResult) => void): Request<Honeycode.Types.GetScreenDataResult, AWSError>;
  /**
   *  The GetScreenData API allows retrieval of data from a screen in a Honeycode app. The API allows setting local variables in the screen to filter, sort or otherwise affect what will be displayed on the screen. 
   */
  getScreenData(callback?: (err: AWSError, data: Honeycode.Types.GetScreenDataResult) => void): Request<Honeycode.Types.GetScreenDataResult, AWSError>;
  /**
   *  The InvokeScreenAutomation API allows invoking an action defined in a screen in a Honeycode app. The API allows setting local variables, which can then be used in the automation being invoked. This allows automating the Honeycode app interactions to write, update or delete data in the workbook. 
   */
  invokeScreenAutomation(params: Honeycode.Types.InvokeScreenAutomationRequest, callback?: (err: AWSError, data: Honeycode.Types.InvokeScreenAutomationResult) => void): Request<Honeycode.Types.InvokeScreenAutomationResult, AWSError>;
  /**
   *  The InvokeScreenAutomation API allows invoking an action defined in a screen in a Honeycode app. The API allows setting local variables, which can then be used in the automation being invoked. This allows automating the Honeycode app interactions to write, update or delete data in the workbook. 
   */
  invokeScreenAutomation(callback?: (err: AWSError, data: Honeycode.Types.InvokeScreenAutomationResult) => void): Request<Honeycode.Types.InvokeScreenAutomationResult, AWSError>;
  /**
   *  The ListTableColumns API allows you to retrieve a list of all the columns in a table in a workbook. 
   */
  listTableColumns(params: Honeycode.Types.ListTableColumnsRequest, callback?: (err: AWSError, data: Honeycode.Types.ListTableColumnsResult) => void): Request<Honeycode.Types.ListTableColumnsResult, AWSError>;
  /**
   *  The ListTableColumns API allows you to retrieve a list of all the columns in a table in a workbook. 
   */
  listTableColumns(callback?: (err: AWSError, data: Honeycode.Types.ListTableColumnsResult) => void): Request<Honeycode.Types.ListTableColumnsResult, AWSError>;
  /**
   *  The ListTableRows API allows you to retrieve a list of all the rows in a table in a workbook. 
   */
  listTableRows(params: Honeycode.Types.ListTableRowsRequest, callback?: (err: AWSError, data: Honeycode.Types.ListTableRowsResult) => void): Request<Honeycode.Types.ListTableRowsResult, AWSError>;
  /**
   *  The ListTableRows API allows you to retrieve a list of all the rows in a table in a workbook. 
   */
  listTableRows(callback?: (err: AWSError, data: Honeycode.Types.ListTableRowsResult) => void): Request<Honeycode.Types.ListTableRowsResult, AWSError>;
  /**
   *  The ListTables API allows you to retrieve a list of all the tables in a workbook. 
   */
  listTables(params: Honeycode.Types.ListTablesRequest, callback?: (err: AWSError, data: Honeycode.Types.ListTablesResult) => void): Request<Honeycode.Types.ListTablesResult, AWSError>;
  /**
   *  The ListTables API allows you to retrieve a list of all the tables in a workbook. 
   */
  listTables(callback?: (err: AWSError, data: Honeycode.Types.ListTablesResult) => void): Request<Honeycode.Types.ListTablesResult, AWSError>;
  /**
   *  The QueryTableRows API allows you to use a filter formula to query for specific rows in a table. 
   */
  queryTableRows(params: Honeycode.Types.QueryTableRowsRequest, callback?: (err: AWSError, data: Honeycode.Types.QueryTableRowsResult) => void): Request<Honeycode.Types.QueryTableRowsResult, AWSError>;
  /**
   *  The QueryTableRows API allows you to use a filter formula to query for specific rows in a table. 
   */
  queryTableRows(callback?: (err: AWSError, data: Honeycode.Types.QueryTableRowsResult) => void): Request<Honeycode.Types.QueryTableRowsResult, AWSError>;
  /**
   *  The StartTableDataImportJob API allows you to start an import job on a table. This API will only return the id of the job that was started. To find out the status of the import request, you need to call the DescribeTableDataImportJob API. 
   */
  startTableDataImportJob(params: Honeycode.Types.StartTableDataImportJobRequest, callback?: (err: AWSError, data: Honeycode.Types.StartTableDataImportJobResult) => void): Request<Honeycode.Types.StartTableDataImportJobResult, AWSError>;
  /**
   *  The StartTableDataImportJob API allows you to start an import job on a table. This API will only return the id of the job that was started. To find out the status of the import request, you need to call the DescribeTableDataImportJob API. 
   */
  startTableDataImportJob(callback?: (err: AWSError, data: Honeycode.Types.StartTableDataImportJobResult) => void): Request<Honeycode.Types.StartTableDataImportJobResult, AWSError>;
}
declare namespace Honeycode {
  export type AwsUserArn = string;
  export interface BatchCreateTableRowsRequest {
    /**
     * The ID of the workbook where the new rows are being added.  If a workbook with the specified ID could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The ID of the table where the new rows are being added.  If a table with the specified ID could not be found, this API throws ResourceNotFoundException. 
     */
    tableId: ResourceId;
    /**
     *  The list of rows to create at the end of the table. Each item in this list needs to have a batch item id to uniquely identify the element in the request and the cells to create for that row. You need to specify at least one item in this list.   Note that if one of the column ids in any of the rows in the request does not exist in the table, then the request fails and no updates are made to the table. 
     */
    rowsToCreate: CreateRowDataList;
    /**
     *  The request token for performing the batch create operation. Request tokens help to identify duplicate requests. If a call times out or fails due to a transient error like a failed network connection, you can retry the call with the same request token. The service ensures that if the first call using that request token is successfully performed, the second call will not perform the operation again.   Note that request tokens are valid only for a few minutes. You cannot use request tokens to dedupe requests spanning hours or days. 
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface BatchCreateTableRowsResult {
    /**
     * The updated workbook cursor after adding the new rows at the end of the table.
     */
    workbookCursor: WorkbookCursor;
    /**
     * The map of batch item id to the row id that was created for that item.
     */
    createdRows: CreatedRowsMap;
    /**
     *  The list of batch items in the request that could not be added to the table. Each element in this list contains one item from the request that could not be added to the table along with the reason why that item could not be added. 
     */
    failedBatchItems?: FailedBatchItems;
  }
  export interface BatchDeleteTableRowsRequest {
    /**
     * The ID of the workbook where the rows are being deleted.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The ID of the table where the rows are being deleted.  If a table with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    tableId: ResourceId;
    /**
     *  The list of row ids to delete from the table. You need to specify at least one row id in this list.   Note that if one of the row ids provided in the request does not exist in the table, then the request fails and no rows are deleted from the table. 
     */
    rowIds: RowIdList;
    /**
     *  The request token for performing the delete action. Request tokens help to identify duplicate requests. If a call times out or fails due to a transient error like a failed network connection, you can retry the call with the same request token. The service ensures that if the first call using that request token is successfully performed, the second call will not perform the action again.   Note that request tokens are valid only for a few minutes. You cannot use request tokens to dedupe requests spanning hours or days. 
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface BatchDeleteTableRowsResult {
    /**
     * The updated workbook cursor after deleting the rows from the table.
     */
    workbookCursor: WorkbookCursor;
    /**
     *  The list of row ids in the request that could not be deleted from the table. Each element in this list contains one row id from the request that could not be deleted along with the reason why that item could not be deleted. 
     */
    failedBatchItems?: FailedBatchItems;
  }
  export type BatchErrorMessage = string;
  export type BatchItemId = string;
  export interface BatchUpdateTableRowsRequest {
    /**
     * The ID of the workbook where the rows are being updated.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The ID of the table where the rows are being updated.  If a table with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    tableId: ResourceId;
    /**
     *  The list of rows to update in the table. Each item in this list needs to contain the row id to update along with the map of column id to cell values for each column in that row that needs to be updated. You need to specify at least one row in this list, and for each row, you need to specify at least one column to update.   Note that if one of the row or column ids in the request does not exist in the table, then the request fails and no updates are made to the table. 
     */
    rowsToUpdate: UpdateRowDataList;
    /**
     *  The request token for performing the update action. Request tokens help to identify duplicate requests. If a call times out or fails due to a transient error like a failed network connection, you can retry the call with the same request token. The service ensures that if the first call using that request token is successfully performed, the second call will not perform the action again.   Note that request tokens are valid only for a few minutes. You cannot use request tokens to dedupe requests spanning hours or days. 
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface BatchUpdateTableRowsResult {
    /**
     * The updated workbook cursor after adding the new rows at the end of the table.
     */
    workbookCursor: WorkbookCursor;
    /**
     *  The list of batch items in the request that could not be updated in the table. Each element in this list contains one item from the request that could not be updated in the table along with the reason why that item could not be updated. 
     */
    failedBatchItems?: FailedBatchItems;
  }
  export interface BatchUpsertTableRowsRequest {
    /**
     * The ID of the workbook where the rows are being upserted.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The ID of the table where the rows are being upserted.  If a table with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    tableId: ResourceId;
    /**
     *  The list of rows to upsert in the table. Each item in this list needs to have a batch item id to uniquely identify the element in the request, a filter expression to find the rows to update for that element and the cell values to set for each column in the upserted rows. You need to specify at least one item in this list.   Note that if one of the filter formulas in the request fails to evaluate because of an error or one of the column ids in any of the rows does not exist in the table, then the request fails and no updates are made to the table. 
     */
    rowsToUpsert: UpsertRowDataList;
    /**
     *  The request token for performing the update action. Request tokens help to identify duplicate requests. If a call times out or fails due to a transient error like a failed network connection, you can retry the call with the same request token. The service ensures that if the first call using that request token is successfully performed, the second call will not perform the action again.   Note that request tokens are valid only for a few minutes. You cannot use request tokens to dedupe requests spanning hours or days. 
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface BatchUpsertTableRowsResult {
    /**
     *  A map with the batch item id as the key and the result of the upsert operation as the value. The result of the upsert operation specifies whether existing rows were updated or a new row was appended, along with the list of row ids that were affected. 
     */
    rows: UpsertRowsResultMap;
    /**
     * The updated workbook cursor after updating or appending rows in the table.
     */
    workbookCursor: WorkbookCursor;
    /**
     *  The list of batch items in the request that could not be updated or appended in the table. Each element in this list contains one item from the request that could not be updated in the table along with the reason why that item could not be updated or appended. 
     */
    failedBatchItems?: FailedBatchItems;
  }
  export interface Cell {
    /**
     *  The formula contained in the cell. This field is empty if a cell does not have a formula. 
     */
    formula?: Formula;
    /**
     * The format of the cell. If this field is empty, then the format is either not specified in the workbook or the format is set to AUTO.
     */
    format?: Format;
    /**
     *  The raw value of the data contained in the cell. The raw value depends on the format of the data in the cell. However the attribute in the API return value is always a string containing the raw value.   Cells with format DATE, DATE_TIME or TIME have the raw value as a floating point number where the whole number represents the number of days since 1/1/1900 and the fractional part represents the fraction of the day since midnight. For example, a cell with date 11/3/2020 has the raw value "44138". A cell with the time 9:00 AM has the raw value "0.375" and a cell with date/time value of 11/3/2020 9:00 AM has the raw value "44138.375". Notice that even though the raw value is a number in all three cases, it is still represented as a string.   Cells with format NUMBER, CURRENCY, PERCENTAGE and ACCOUNTING have the raw value of the data as the number representing the data being displayed. For example, the number 1.325 with two decimal places in the format will have it's raw value as "1.325" and formatted value as "1.33". A currency value for $10 will have the raw value as "10" and formatted value as "$10.00". A value representing 20% with two decimal places in the format will have its raw value as "0.2" and the formatted value as "20.00%". An accounting value of -$25 will have "-25" as the raw value and "$ (25.00)" as the formatted value.   Cells with format TEXT will have the raw text as the raw value. For example, a cell with text "John Smith" will have "John Smith" as both the raw value and the formatted value.   Cells with format CONTACT will have the name of the contact as a formatted value and the email address of the contact as the raw value. For example, a contact for John Smith will have "John Smith" as the formatted value and "john.smith@example.com" as the raw value.   Cells with format ROWLINK (aka picklist) will have the first column of the linked row as the formatted value and the row id of the linked row as the raw value. For example, a cell containing a picklist to a table that displays task status might have "Completed" as the formatted value and "row:dfcefaee-5b37-4355-8f28-40c3e4ff5dd4/ca432b2f-b8eb-431d-9fb5-cbe0342f9f03" as the raw value.   Cells with format AUTO or cells without any format that are auto-detected as one of the formats above will contain the raw and formatted values as mentioned above, based on the auto-detected formats. If there is no auto-detected format, the raw and formatted values will be the same as the data in the cell. 
     */
    rawValue?: RawValue;
    /**
     *  The formatted value of the cell. This is the value that you see displayed in the cell in the UI.   Note that the formatted value of a cell is always represented as a string irrespective of the data that is stored in the cell. For example, if a cell contains a date, the formatted value of the cell is the string representation of the formatted date being shown in the cell in the UI. See details in the rawValue field below for how cells of different formats will have different raw and formatted values. 
     */
    formattedValue?: FormattedValue;
  }
  export interface CellInput {
    /**
     *  Fact represents the data that is entered into a cell. This data can be free text or a formula. Formulas need to start with the equals (=) sign. 
     */
    fact?: Fact;
  }
  export type Cells = Cell[];
  export type ClientRequestToken = string;
  export interface ColumnMetadata {
    /**
     * The name of the column.
     */
    name: Name;
    /**
     * The format of the column.
     */
    format: Format;
  }
  export interface CreateRowData {
    /**
     *  An external identifier that represents the single row that is being created as part of the BatchCreateTableRows request. This can be any string that you can use to identify the row in the request. The BatchCreateTableRows API puts the batch item id in the results to allow you to link data in the request to data in the results. 
     */
    batchItemId: BatchItemId;
    /**
     *  A map representing the cells to create in the new row. The key is the column id of the cell and the value is the CellInput object that represents the data to set in that cell. 
     */
    cellsToCreate: RowDataInput;
  }
  export type CreateRowDataList = CreateRowData[];
  export type CreatedRowsMap = {[key: string]: RowId};
  export interface DataItem {
    /**
     *  The overrideFormat is optional and is specified only if a particular row of data has a different format for the data than the default format defined on the screen or the table. 
     */
    overrideFormat?: Format;
    /**
     * The raw value of the data. e.g. jsmith@example.com
     */
    rawValue?: RawValue;
    /**
     * The formatted value of the data. e.g. John Smith.
     */
    formattedValue?: FormattedValue;
  }
  export type DataItems = DataItem[];
  export type DelimitedTextDelimiter = string;
  export interface DelimitedTextImportOptions {
    /**
     * The delimiter to use for separating columns in a single row of the input.
     */
    delimiter: DelimitedTextDelimiter;
    /**
     * Indicates whether the input file has a header row at the top containing the column names.
     */
    hasHeaderRow?: HasHeaderRow;
    /**
     * A parameter to indicate whether empty rows should be ignored or be included in the import.
     */
    ignoreEmptyRows?: IgnoreEmptyRows;
    /**
     * The encoding of the data in the input file.
     */
    dataCharacterEncoding?: ImportDataCharacterEncoding;
  }
  export interface DescribeTableDataImportJobRequest {
    /**
     * The ID of the workbook into which data was imported.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The ID of the table into which data was imported.  If a table with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    tableId: ResourceId;
    /**
     * The ID of the job that was returned by the StartTableDataImportJob request.  If a job with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    jobId: JobId;
  }
  export interface DescribeTableDataImportJobResult {
    /**
     *  The current status of the import job. 
     */
    jobStatus: TableDataImportJobStatus;
    /**
     *  A message providing more details about the current status of the import job. 
     */
    message: TableDataImportJobMessage;
    /**
     *  The metadata about the job that was submitted for import. 
     */
    jobMetadata: TableDataImportJobMetadata;
  }
  export interface DestinationOptions {
    /**
     * A map of the column id to the import properties for each column.
     */
    columnMap?: ImportColumnMap;
  }
  export type Email = string;
  export type Fact = string;
  export interface FailedBatchItem {
    /**
     *  The id of the batch item that failed. This is the batch item id for the BatchCreateTableRows and BatchUpsertTableRows operations and the row id for the BatchUpdateTableRows and BatchDeleteTableRows operations. 
     */
    id: BatchItemId;
    /**
     *  The error message that indicates why the batch item failed. 
     */
    errorMessage: BatchErrorMessage;
  }
  export type FailedBatchItems = FailedBatchItem[];
  export interface Filter {
    /**
     *  A formula representing a filter function that returns zero or more matching rows from a table. Valid formulas in this field return a list of rows from a table. The most common ways of writing a formula to return a list of rows are to use the FindRow() or Filter() functions. Any other formula that returns zero or more rows is also acceptable. For example, you can use a formula that points to a cell that contains a filter function. 
     */
    formula: Formula;
    /**
     *  The optional contextRowId attribute can be used to specify the row id of the context row if the filter formula contains unqualified references to table columns and needs a context row to evaluate them successfully. 
     */
    contextRowId?: RowId;
  }
  export type Format = "AUTO"|"NUMBER"|"CURRENCY"|"DATE"|"TIME"|"DATE_TIME"|"PERCENTAGE"|"TEXT"|"ACCOUNTING"|"CONTACT"|"ROWLINK"|string;
  export type FormattedValue = string;
  export type Formula = string;
  export interface GetScreenDataRequest {
    /**
     * The ID of the workbook that contains the screen.
     */
    workbookId: ResourceId;
    /**
     * The ID of the app that contains the screem.
     */
    appId: ResourceId;
    /**
     * The ID of the screen.
     */
    screenId: ResourceId;
    /**
     *  Variables are optional and are needed only if the screen requires them to render correctly. Variables are specified as a map where the key is the name of the variable as defined on the screen. The value is an object which currently has only one property, rawValue, which holds the value of the variable to be passed to the screen. 
     */
    variables?: VariableValueMap;
    /**
     *  The number of results to be returned on a single page. Specify a number between 1 and 100. The maximum value is 100.   This parameter is optional. If you don't specify this parameter, the default page size is 100. 
     */
    maxResults?: MaxResults;
    /**
     *  This parameter is optional. If a nextToken is not specified, the API returns the first page of data.   Pagination tokens expire after 1 hour. If you use a token that was returned more than an hour back, the API will throw ValidationException. 
     */
    nextToken?: PaginationToken;
  }
  export interface GetScreenDataResult {
    /**
     * A map of all the rows on the screen keyed by block name.
     */
    results: ResultSetMap;
    /**
     *  Indicates the cursor of the workbook at which the data returned by this workbook is read. Workbook cursor keeps increasing with every update and the increments are not sequential. 
     */
    workbookCursor: WorkbookCursor;
    /**
     *  Provides the pagination token to load the next page if there are more results matching the request. If a pagination token is not present in the response, it means that all data matching the query has been loaded. 
     */
    nextToken?: PaginationToken;
  }
  export type HasHeaderRow = boolean;
  export type IgnoreEmptyRows = boolean;
  export type ImportColumnMap = {[key: string]: SourceDataColumnProperties};
  export type ImportDataCharacterEncoding = "UTF-8"|"US-ASCII"|"ISO-8859-1"|"UTF-16BE"|"UTF-16LE"|"UTF-16"|string;
  export interface ImportDataSource {
    /**
     * The configuration parameters for the data source of the import
     */
    dataSourceConfig: ImportDataSourceConfig;
  }
  export interface ImportDataSourceConfig {
    /**
     *  The URL from which source data will be downloaded for the import request. 
     */
    dataSourceUrl?: SecureURL;
  }
  export interface ImportJobSubmitter {
    /**
     * The email id of the submitter of the import job, if available.
     */
    email?: Email;
    /**
     * The AWS user ARN of the submitter of the import job, if available.
     */
    userArn?: AwsUserArn;
  }
  export interface ImportOptions {
    /**
     * Options relating to the destination of the import request.
     */
    destinationOptions?: DestinationOptions;
    /**
     * Options relating to parsing delimited text. Required if dataFormat is DELIMITED_TEXT.
     */
    delimitedTextOptions?: DelimitedTextImportOptions;
  }
  export type ImportSourceDataFormat = "DELIMITED_TEXT"|string;
  export interface InvokeScreenAutomationRequest {
    /**
     * The ID of the workbook that contains the screen automation.
     */
    workbookId: ResourceId;
    /**
     * The ID of the app that contains the screen automation.
     */
    appId: ResourceId;
    /**
     * The ID of the screen that contains the screen automation.
     */
    screenId: ResourceId;
    /**
     * The ID of the automation action to be performed.
     */
    screenAutomationId: ResourceId;
    /**
     *  Variables are specified as a map where the key is the name of the variable as defined on the screen. The value is an object which currently has only one property, rawValue, which holds the value of the variable to be passed to the screen. Any variables defined in a screen are required to be passed in the call. 
     */
    variables?: VariableValueMap;
    /**
     *  The row ID for the automation if the automation is defined inside a block with source or list. 
     */
    rowId?: RowId;
    /**
     *  The request token for performing the automation action. Request tokens help to identify duplicate requests. If a call times out or fails due to a transient error like a failed network connection, you can retry the call with the same request token. The service ensures that if the first call using that request token is successfully performed, the second call will return the response of the previous call rather than performing the action again.   Note that request tokens are valid only for a few minutes. You cannot use request tokens to dedupe requests spanning hours or days. 
     */
    clientRequestToken?: ClientRequestToken;
  }
  export interface InvokeScreenAutomationResult {
    /**
     * The updated workbook cursor after performing the automation action.
     */
    workbookCursor: WorkbookCursor;
  }
  export type JobId = string;
  export interface ListTableColumnsRequest {
    /**
     * The ID of the workbook that contains the table whose columns are being retrieved.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The ID of the table whose columns are being retrieved.  If a table with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    tableId: ResourceId;
    /**
     *  This parameter is optional. If a nextToken is not specified, the API returns the first page of data.   Pagination tokens expire after 1 hour. If you use a token that was returned more than an hour back, the API will throw ValidationException. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListTableColumnsResult {
    /**
     *  The list of columns in the table. 
     */
    tableColumns: TableColumns;
    /**
     *  Provides the pagination token to load the next page if there are more results matching the request. If a pagination token is not present in the response, it means that all data matching the request has been loaded. 
     */
    nextToken?: PaginationToken;
    /**
     *  Indicates the cursor of the workbook at which the data returned by this request is read. Workbook cursor keeps increasing with every update and the increments are not sequential. 
     */
    workbookCursor?: WorkbookCursor;
  }
  export interface ListTableRowsRequest {
    /**
     * The ID of the workbook that contains the table whose rows are being retrieved.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The ID of the table whose rows are being retrieved.  If a table with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    tableId: ResourceId;
    /**
     *  This parameter is optional. If one or more row ids are specified in this list, then only the specified row ids are returned in the result. If no row ids are specified here, then all the rows in the table are returned. 
     */
    rowIds?: RowIdList;
    /**
     * The maximum number of rows to return in each page of the results.
     */
    maxResults?: MaxResults;
    /**
     *  This parameter is optional. If a nextToken is not specified, the API returns the first page of data.   Pagination tokens expire after 1 hour. If you use a token that was returned more than an hour back, the API will throw ValidationException. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListTableRowsResult {
    /**
     *  The list of columns in the table whose row data is returned in the result. 
     */
    columnIds: ResourceIds;
    /**
     *  The list of rows in the table. Note that this result is paginated, so this list contains a maximum of 100 rows. 
     */
    rows: TableRows;
    /**
     *  The list of row ids included in the request that were not found in the table. 
     */
    rowIdsNotFound?: RowIdList;
    /**
     *  Provides the pagination token to load the next page if there are more results matching the request. If a pagination token is not present in the response, it means that all data matching the request has been loaded. 
     */
    nextToken?: PaginationToken;
    /**
     *  Indicates the cursor of the workbook at which the data returned by this request is read. Workbook cursor keeps increasing with every update and the increments are not sequential. 
     */
    workbookCursor: WorkbookCursor;
  }
  export interface ListTablesRequest {
    /**
     * The ID of the workbook whose tables are being retrieved.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The maximum number of tables to return in each page of the results.
     */
    maxResults?: MaxResults;
    /**
     *  This parameter is optional. If a nextToken is not specified, the API returns the first page of data.   Pagination tokens expire after 1 hour. If you use a token that was returned more than an hour back, the API will throw ValidationException. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListTablesResult {
    /**
     *  The list of tables in the workbook. 
     */
    tables: Tables;
    /**
     *  Provides the pagination token to load the next page if there are more results matching the request. If a pagination token is not present in the response, it means that all data matching the request has been loaded. 
     */
    nextToken?: PaginationToken;
    /**
     *  Indicates the cursor of the workbook at which the data returned by this request is read. Workbook cursor keeps increasing with every update and the increments are not sequential. 
     */
    workbookCursor?: WorkbookCursor;
  }
  export type MaxResults = number;
  export type Name = string;
  export type PaginationToken = string;
  export interface QueryTableRowsRequest {
    /**
     * The ID of the workbook whose table rows are being queried.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     * The ID of the table whose rows are being queried.  If a table with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    tableId: ResourceId;
    /**
     * An object that represents a filter formula along with the id of the context row under which the filter function needs to evaluate.
     */
    filterFormula: Filter;
    /**
     * The maximum number of rows to return in each page of the results.
     */
    maxResults?: MaxResults;
    /**
     *  This parameter is optional. If a nextToken is not specified, the API returns the first page of data.   Pagination tokens expire after 1 hour. If you use a token that was returned more than an hour back, the API will throw ValidationException. 
     */
    nextToken?: PaginationToken;
  }
  export interface QueryTableRowsResult {
    /**
     *  The list of columns in the table whose row data is returned in the result. 
     */
    columnIds: ResourceIds;
    /**
     *  The list of rows in the table that match the query filter. 
     */
    rows: TableRows;
    /**
     *  Provides the pagination token to load the next page if there are more results matching the request. If a pagination token is not present in the response, it means that all data matching the request has been loaded. 
     */
    nextToken?: PaginationToken;
    /**
     *  Indicates the cursor of the workbook at which the data returned by this request is read. Workbook cursor keeps increasing with every update and the increments are not sequential. 
     */
    workbookCursor: WorkbookCursor;
  }
  export type RawValue = string;
  export type ResourceId = string;
  export type ResourceIds = ResourceId[];
  export type ResultHeader = ColumnMetadata[];
  export interface ResultRow {
    /**
     * The ID for a particular row.
     */
    rowId?: RowId;
    /**
     * List of all the data cells in a row.
     */
    dataItems: DataItems;
  }
  export type ResultRows = ResultRow[];
  export interface ResultSet {
    /**
     *  List of headers for all the data cells in the block. The header identifies the name and default format of the data cell. Data cells appear in the same order in all rows as defined in the header. The names and formats are not repeated in the rows. If a particular row does not have a value for a data cell, a blank value is used.   For example, a task list that displays the task name, due date and assigned person might have headers [ { "name": "Task Name"}, {"name": "Due Date", "format": "DATE"}, {"name": "Assigned", "format": "CONTACT"} ]. Every row in the result will have the task name as the first item, due date as the second item and assigned person as the third item. If a particular task does not have a due date, that row will still have a blank value in the second element and the assigned person will still be in the third element. 
     */
    headers: ResultHeader;
    /**
     *  List of rows returned by the request. Each row has a row Id and a list of data cells in that row. The data cells will be present in the same order as they are defined in the header. 
     */
    rows: ResultRows;
  }
  export type ResultSetMap = {[key: string]: ResultSet};
  export type RowDataInput = {[key: string]: CellInput};
  export type RowId = string;
  export type RowIdList = RowId[];
  export type SecureURL = string;
  export type SourceDataColumnIndex = number;
  export interface SourceDataColumnProperties {
    /**
     * The index of the column in the input file.
     */
    columnIndex?: SourceDataColumnIndex;
  }
  export interface StartTableDataImportJobRequest {
    /**
     * The ID of the workbook where the rows are being imported.  If a workbook with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    workbookId: ResourceId;
    /**
     *  The source of the data that is being imported. The size of source must be no larger than 100 MB. Source must have no more than 100,000 cells and no more than 1,000 rows. 
     */
    dataSource: ImportDataSource;
    /**
     *  The format of the data that is being imported. Currently the only option supported is "DELIMITED_TEXT". 
     */
    dataFormat: ImportSourceDataFormat;
    /**
     * The ID of the table where the rows are being imported.  If a table with the specified id could not be found, this API throws ResourceNotFoundException. 
     */
    destinationTableId: ResourceId;
    /**
     *  The options for customizing this import request. 
     */
    importOptions: ImportOptions;
    /**
     *  The request token for performing the update action. Request tokens help to identify duplicate requests. If a call times out or fails due to a transient error like a failed network connection, you can retry the call with the same request token. The service ensures that if the first call using that request token is successfully performed, the second call will not perform the action again.   Note that request tokens are valid only for a few minutes. You cannot use request tokens to dedupe requests spanning hours or days. 
     */
    clientRequestToken: ClientRequestToken;
  }
  export interface StartTableDataImportJobResult {
    /**
     *  The id that is assigned to this import job. Future requests to find out the status of this import job need to send this id in the appropriate parameter in the request. 
     */
    jobId: JobId;
    /**
     *  The status of the import job immediately after submitting the request. 
     */
    jobStatus: TableDataImportJobStatus;
  }
  export interface Table {
    /**
     * The id of the table.
     */
    tableId?: ResourceId;
    /**
     * The name of the table.
     */
    tableName?: TableName;
  }
  export interface TableColumn {
    /**
     * The id of the column in the table.
     */
    tableColumnId?: ResourceId;
    /**
     * The name of the column in the table.
     */
    tableColumnName?: TableColumnName;
    /**
     *  The column level format that is applied in the table. An empty value in this field means that the column format is the default value 'AUTO'. 
     */
    format?: Format;
  }
  export type TableColumnName = string;
  export type TableColumns = TableColumn[];
  export type TableDataImportJobMessage = string;
  export interface TableDataImportJobMetadata {
    /**
     * Details about the submitter of the import request.
     */
    submitter: ImportJobSubmitter;
    /**
     * The timestamp when the job was submitted for import.
     */
    submitTime: TimestampInMillis;
    /**
     * The options that was specified at the time of submitting the import request.
     */
    importOptions: ImportOptions;
    /**
     * The source of the data that was submitted for import.
     */
    dataSource: ImportDataSource;
  }
  export type TableDataImportJobStatus = "SUBMITTED"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|string;
  export type TableName = string;
  export interface TableRow {
    /**
     * The id of the row in the table.
     */
    rowId: RowId;
    /**
     * A list of cells in the table row. The cells appear in the same order as the columns of the table. 
     */
    cells: Cells;
  }
  export type TableRows = TableRow[];
  export type Tables = Table[];
  export type TimestampInMillis = Date;
  export interface UpdateRowData {
    /**
     *  The id of the row that needs to be updated. 
     */
    rowId: RowId;
    /**
     *  A map representing the cells to update in the given row. The key is the column id of the cell and the value is the CellInput object that represents the data to set in that cell. 
     */
    cellsToUpdate: RowDataInput;
  }
  export type UpdateRowDataList = UpdateRowData[];
  export type UpsertAction = "UPDATED"|"APPENDED"|string;
  export interface UpsertRowData {
    /**
     *  An external identifier that represents a single item in the request that is being upserted as part of the BatchUpsertTableRows request. This can be any string that you can use to identify the item in the request. The BatchUpsertTableRows API puts the batch item id in the results to allow you to link data in the request to data in the results. 
     */
    batchItemId: BatchItemId;
    /**
     *  The filter formula to use to find existing matching rows to update. The formula needs to return zero or more rows. If the formula returns 0 rows, then a new row will be appended in the target table. If the formula returns one or more rows, then the returned rows will be updated.   Note that the filter formula needs to return rows from the target table for the upsert operation to succeed. If the filter formula has a syntax error or it doesn't evaluate to zero or more rows in the target table for any one item in the input list, then the entire BatchUpsertTableRows request fails and no updates are made to the table. 
     */
    filter: Filter;
    /**
     *  A map representing the cells to update for the matching rows or an appended row. The key is the column id of the cell and the value is the CellInput object that represents the data to set in that cell. 
     */
    cellsToUpdate: RowDataInput;
  }
  export type UpsertRowDataList = UpsertRowData[];
  export interface UpsertRowsResult {
    /**
     *  The list of row ids that were changed as part of an upsert row operation. If the upsert resulted in an update, this list could potentially contain multiple rows that matched the filter and hence got updated. If the upsert resulted in an append, this list would only have the single row that was appended. 
     */
    rowIds: RowIdList;
    /**
     *  The result of the upsert action. 
     */
    upsertAction: UpsertAction;
  }
  export type UpsertRowsResultMap = {[key: string]: UpsertRowsResult};
  export type VariableName = string;
  export interface VariableValue {
    /**
     * Raw value of the variable.
     */
    rawValue: RawValue;
  }
  export type VariableValueMap = {[key: string]: VariableValue};
  export type WorkbookCursor = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-03-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Honeycode client.
   */
  export import Types = Honeycode;
}
export = Honeycode;
