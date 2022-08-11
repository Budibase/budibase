import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Textract extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Textract.Types.ClientConfiguration)
  config: Config & Textract.Types.ClientConfiguration;
  /**
   * Analyzes an input document for relationships between detected items.  The types of information returned are as follows:    Form data (key-value pairs). The related information is returned in two Block objects, each of type KEY_VALUE_SET: a KEY Block object and a VALUE Block object. For example, Name: Ana Silva Carolina contains a key and value. Name: is the key. Ana Silva Carolina is the value.   Table and table cell data. A TABLE Block object contains information about a detected table. A CELL Block object is returned for each cell in a table.   Lines and words of text. A LINE Block object contains one or more WORD Block objects. All lines and words that are detected in the document are returned (including text that doesn't have a relationship with the value of FeatureTypes).    Selection elements such as check boxes and option buttons (radio buttons) can be detected in form data and in tables. A SELECTION_ELEMENT Block object contains information about a selection element, including the selection status. You can choose which type of analysis to perform by specifying the FeatureTypes list.  The output is returned in a list of Block objects.  AnalyzeDocument is a synchronous operation. To analyze documents asynchronously, use StartDocumentAnalysis. For more information, see Document Text Analysis.
   */
  analyzeDocument(params: Textract.Types.AnalyzeDocumentRequest, callback?: (err: AWSError, data: Textract.Types.AnalyzeDocumentResponse) => void): Request<Textract.Types.AnalyzeDocumentResponse, AWSError>;
  /**
   * Analyzes an input document for relationships between detected items.  The types of information returned are as follows:    Form data (key-value pairs). The related information is returned in two Block objects, each of type KEY_VALUE_SET: a KEY Block object and a VALUE Block object. For example, Name: Ana Silva Carolina contains a key and value. Name: is the key. Ana Silva Carolina is the value.   Table and table cell data. A TABLE Block object contains information about a detected table. A CELL Block object is returned for each cell in a table.   Lines and words of text. A LINE Block object contains one or more WORD Block objects. All lines and words that are detected in the document are returned (including text that doesn't have a relationship with the value of FeatureTypes).    Selection elements such as check boxes and option buttons (radio buttons) can be detected in form data and in tables. A SELECTION_ELEMENT Block object contains information about a selection element, including the selection status. You can choose which type of analysis to perform by specifying the FeatureTypes list.  The output is returned in a list of Block objects.  AnalyzeDocument is a synchronous operation. To analyze documents asynchronously, use StartDocumentAnalysis. For more information, see Document Text Analysis.
   */
  analyzeDocument(callback?: (err: AWSError, data: Textract.Types.AnalyzeDocumentResponse) => void): Request<Textract.Types.AnalyzeDocumentResponse, AWSError>;
  /**
   * Analyzes an input document for financially related relationships between text. Information is returned as ExpenseDocuments and seperated as follows.    LineItemGroups- A data set containing LineItems which store information about the lines of text, such as an item purchased and its price on a receipt.    SummaryFields- Contains all other information a receipt, such as header information or the vendors name.  
   */
  analyzeExpense(params: Textract.Types.AnalyzeExpenseRequest, callback?: (err: AWSError, data: Textract.Types.AnalyzeExpenseResponse) => void): Request<Textract.Types.AnalyzeExpenseResponse, AWSError>;
  /**
   * Analyzes an input document for financially related relationships between text. Information is returned as ExpenseDocuments and seperated as follows.    LineItemGroups- A data set containing LineItems which store information about the lines of text, such as an item purchased and its price on a receipt.    SummaryFields- Contains all other information a receipt, such as header information or the vendors name.  
   */
  analyzeExpense(callback?: (err: AWSError, data: Textract.Types.AnalyzeExpenseResponse) => void): Request<Textract.Types.AnalyzeExpenseResponse, AWSError>;
  /**
   * Detects text in the input document. Amazon Textract can detect lines of text and the words that make up a line of text. The input document must be an image in JPEG or PNG format. DetectDocumentText returns the detected text in an array of Block objects.  Each document page has as an associated Block of type PAGE. Each PAGE Block object is the parent of LINE Block objects that represent the lines of detected text on a page. A LINE Block object is a parent for each word that makes up the line. Words are represented by Block objects of type WORD.  DetectDocumentText is a synchronous operation. To analyze documents asynchronously, use StartDocumentTextDetection. For more information, see Document Text Detection.
   */
  detectDocumentText(params: Textract.Types.DetectDocumentTextRequest, callback?: (err: AWSError, data: Textract.Types.DetectDocumentTextResponse) => void): Request<Textract.Types.DetectDocumentTextResponse, AWSError>;
  /**
   * Detects text in the input document. Amazon Textract can detect lines of text and the words that make up a line of text. The input document must be an image in JPEG or PNG format. DetectDocumentText returns the detected text in an array of Block objects.  Each document page has as an associated Block of type PAGE. Each PAGE Block object is the parent of LINE Block objects that represent the lines of detected text on a page. A LINE Block object is a parent for each word that makes up the line. Words are represented by Block objects of type WORD.  DetectDocumentText is a synchronous operation. To analyze documents asynchronously, use StartDocumentTextDetection. For more information, see Document Text Detection.
   */
  detectDocumentText(callback?: (err: AWSError, data: Textract.Types.DetectDocumentTextResponse) => void): Request<Textract.Types.DetectDocumentTextResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that analyzes text in a document. You start asynchronous text analysis by calling StartDocumentAnalysis, which returns a job identifier (JobId). When the text analysis operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartDocumentAnalysis. To get the results of the text-detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentAnalysis, and pass the job identifier (JobId) from the initial call to StartDocumentAnalysis.  GetDocumentAnalysis returns an array of Block objects. The following types of information are returned:    Form data (key-value pairs). The related information is returned in two Block objects, each of type KEY_VALUE_SET: a KEY Block object and a VALUE Block object. For example, Name: Ana Silva Carolina contains a key and value. Name: is the key. Ana Silva Carolina is the value.   Table and table cell data. A TABLE Block object contains information about a detected table. A CELL Block object is returned for each cell in a table.   Lines and words of text. A LINE Block object contains one or more WORD Block objects. All lines and words that are detected in the document are returned (including text that doesn't have a relationship with the value of the StartDocumentAnalysis FeatureTypes input parameter).    Selection elements such as check boxes and option buttons (radio buttons) can be detected in form data and in tables. A SELECTION_ELEMENT Block object contains information about a selection element, including the selection status. Use the MaxResults parameter to limit the number of blocks that are returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetDocumentAnalysis, and populate the NextToken request parameter with the token value that's returned from the previous call to GetDocumentAnalysis. For more information, see Document Text Analysis.
   */
  getDocumentAnalysis(params: Textract.Types.GetDocumentAnalysisRequest, callback?: (err: AWSError, data: Textract.Types.GetDocumentAnalysisResponse) => void): Request<Textract.Types.GetDocumentAnalysisResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that analyzes text in a document. You start asynchronous text analysis by calling StartDocumentAnalysis, which returns a job identifier (JobId). When the text analysis operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartDocumentAnalysis. To get the results of the text-detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentAnalysis, and pass the job identifier (JobId) from the initial call to StartDocumentAnalysis.  GetDocumentAnalysis returns an array of Block objects. The following types of information are returned:    Form data (key-value pairs). The related information is returned in two Block objects, each of type KEY_VALUE_SET: a KEY Block object and a VALUE Block object. For example, Name: Ana Silva Carolina contains a key and value. Name: is the key. Ana Silva Carolina is the value.   Table and table cell data. A TABLE Block object contains information about a detected table. A CELL Block object is returned for each cell in a table.   Lines and words of text. A LINE Block object contains one or more WORD Block objects. All lines and words that are detected in the document are returned (including text that doesn't have a relationship with the value of the StartDocumentAnalysis FeatureTypes input parameter).    Selection elements such as check boxes and option buttons (radio buttons) can be detected in form data and in tables. A SELECTION_ELEMENT Block object contains information about a selection element, including the selection status. Use the MaxResults parameter to limit the number of blocks that are returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetDocumentAnalysis, and populate the NextToken request parameter with the token value that's returned from the previous call to GetDocumentAnalysis. For more information, see Document Text Analysis.
   */
  getDocumentAnalysis(callback?: (err: AWSError, data: Textract.Types.GetDocumentAnalysisResponse) => void): Request<Textract.Types.GetDocumentAnalysisResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that detects text in a document. Amazon Textract can detect lines of text and the words that make up a line of text. You start asynchronous text detection by calling StartDocumentTextDetection, which returns a job identifier (JobId). When the text detection operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartDocumentTextDetection. To get the results of the text-detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentTextDetection, and pass the job identifier (JobId) from the initial call to StartDocumentTextDetection.  GetDocumentTextDetection returns an array of Block objects.  Each document page has as an associated Block of type PAGE. Each PAGE Block object is the parent of LINE Block objects that represent the lines of detected text on a page. A LINE Block object is a parent for each word that makes up the line. Words are represented by Block objects of type WORD. Use the MaxResults parameter to limit the number of blocks that are returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetDocumentTextDetection, and populate the NextToken request parameter with the token value that's returned from the previous call to GetDocumentTextDetection. For more information, see Document Text Detection.
   */
  getDocumentTextDetection(params: Textract.Types.GetDocumentTextDetectionRequest, callback?: (err: AWSError, data: Textract.Types.GetDocumentTextDetectionResponse) => void): Request<Textract.Types.GetDocumentTextDetectionResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that detects text in a document. Amazon Textract can detect lines of text and the words that make up a line of text. You start asynchronous text detection by calling StartDocumentTextDetection, which returns a job identifier (JobId). When the text detection operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartDocumentTextDetection. To get the results of the text-detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentTextDetection, and pass the job identifier (JobId) from the initial call to StartDocumentTextDetection.  GetDocumentTextDetection returns an array of Block objects.  Each document page has as an associated Block of type PAGE. Each PAGE Block object is the parent of LINE Block objects that represent the lines of detected text on a page. A LINE Block object is a parent for each word that makes up the line. Words are represented by Block objects of type WORD. Use the MaxResults parameter to limit the number of blocks that are returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetDocumentTextDetection, and populate the NextToken request parameter with the token value that's returned from the previous call to GetDocumentTextDetection. For more information, see Document Text Detection.
   */
  getDocumentTextDetection(callback?: (err: AWSError, data: Textract.Types.GetDocumentTextDetectionResponse) => void): Request<Textract.Types.GetDocumentTextDetectionResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that analyzes invoices and receipts. Amazon Textract finds contact information, items purchased, and vendor name, from input invoices and receipts. You start asynchronous invoice/receipt analysis by calling StartExpenseAnalysis, which returns a job identifier (JobId). Upon completion of the invoice/receipt analysis, Amazon Textract publishes the completion status to the Amazon Simple Notification Service (Amazon SNS) topic. This topic must be registered in the initial call to StartExpenseAnalysis. To get the results of the invoice/receipt analysis operation, first ensure that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetExpenseAnalysis, and pass the job identifier (JobId) from the initial call to StartExpenseAnalysis. Use the MaxResults parameter to limit the number of blocks that are returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetExpenseAnalysis, and populate the NextToken request parameter with the token value that's returned from the previous call to GetExpenseAnalysis. For more information, see Analyzing Invoices and Receipts.
   */
  getExpenseAnalysis(params: Textract.Types.GetExpenseAnalysisRequest, callback?: (err: AWSError, data: Textract.Types.GetExpenseAnalysisResponse) => void): Request<Textract.Types.GetExpenseAnalysisResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that analyzes invoices and receipts. Amazon Textract finds contact information, items purchased, and vendor name, from input invoices and receipts. You start asynchronous invoice/receipt analysis by calling StartExpenseAnalysis, which returns a job identifier (JobId). Upon completion of the invoice/receipt analysis, Amazon Textract publishes the completion status to the Amazon Simple Notification Service (Amazon SNS) topic. This topic must be registered in the initial call to StartExpenseAnalysis. To get the results of the invoice/receipt analysis operation, first ensure that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetExpenseAnalysis, and pass the job identifier (JobId) from the initial call to StartExpenseAnalysis. Use the MaxResults parameter to limit the number of blocks that are returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetExpenseAnalysis, and populate the NextToken request parameter with the token value that's returned from the previous call to GetExpenseAnalysis. For more information, see Analyzing Invoices and Receipts.
   */
  getExpenseAnalysis(callback?: (err: AWSError, data: Textract.Types.GetExpenseAnalysisResponse) => void): Request<Textract.Types.GetExpenseAnalysisResponse, AWSError>;
  /**
   * Starts the asynchronous analysis of an input document for relationships between detected items such as key-value pairs, tables, and selection elements.  StartDocumentAnalysis can analyze text in documents that are in JPEG, PNG, TIFF, and PDF format. The documents are stored in an Amazon S3 bucket. Use DocumentLocation to specify the bucket name and file name of the document.   StartDocumentAnalysis returns a job identifier (JobId) that you use to get the results of the operation. When text analysis is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that you specify in NotificationChannel. To get the results of the text analysis operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentAnalysis, and pass the job identifier (JobId) from the initial call to StartDocumentAnalysis. For more information, see Document Text Analysis.
   */
  startDocumentAnalysis(params: Textract.Types.StartDocumentAnalysisRequest, callback?: (err: AWSError, data: Textract.Types.StartDocumentAnalysisResponse) => void): Request<Textract.Types.StartDocumentAnalysisResponse, AWSError>;
  /**
   * Starts the asynchronous analysis of an input document for relationships between detected items such as key-value pairs, tables, and selection elements.  StartDocumentAnalysis can analyze text in documents that are in JPEG, PNG, TIFF, and PDF format. The documents are stored in an Amazon S3 bucket. Use DocumentLocation to specify the bucket name and file name of the document.   StartDocumentAnalysis returns a job identifier (JobId) that you use to get the results of the operation. When text analysis is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that you specify in NotificationChannel. To get the results of the text analysis operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentAnalysis, and pass the job identifier (JobId) from the initial call to StartDocumentAnalysis. For more information, see Document Text Analysis.
   */
  startDocumentAnalysis(callback?: (err: AWSError, data: Textract.Types.StartDocumentAnalysisResponse) => void): Request<Textract.Types.StartDocumentAnalysisResponse, AWSError>;
  /**
   * Starts the asynchronous detection of text in a document. Amazon Textract can detect lines of text and the words that make up a line of text.  StartDocumentTextDetection can analyze text in documents that are in JPEG, PNG, TIFF, and PDF format. The documents are stored in an Amazon S3 bucket. Use DocumentLocation to specify the bucket name and file name of the document.   StartTextDetection returns a job identifier (JobId) that you use to get the results of the operation. When text detection is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that you specify in NotificationChannel. To get the results of the text detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentTextDetection, and pass the job identifier (JobId) from the initial call to StartDocumentTextDetection. For more information, see Document Text Detection.
   */
  startDocumentTextDetection(params: Textract.Types.StartDocumentTextDetectionRequest, callback?: (err: AWSError, data: Textract.Types.StartDocumentTextDetectionResponse) => void): Request<Textract.Types.StartDocumentTextDetectionResponse, AWSError>;
  /**
   * Starts the asynchronous detection of text in a document. Amazon Textract can detect lines of text and the words that make up a line of text.  StartDocumentTextDetection can analyze text in documents that are in JPEG, PNG, TIFF, and PDF format. The documents are stored in an Amazon S3 bucket. Use DocumentLocation to specify the bucket name and file name of the document.   StartTextDetection returns a job identifier (JobId) that you use to get the results of the operation. When text detection is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that you specify in NotificationChannel. To get the results of the text detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentTextDetection, and pass the job identifier (JobId) from the initial call to StartDocumentTextDetection. For more information, see Document Text Detection.
   */
  startDocumentTextDetection(callback?: (err: AWSError, data: Textract.Types.StartDocumentTextDetectionResponse) => void): Request<Textract.Types.StartDocumentTextDetectionResponse, AWSError>;
  /**
   * Starts the asynchronous analysis of invoices or receipts for data like contact information, items purchased, and vendor names.  StartExpenseAnalysis can analyze text in documents that are in JPEG, PNG, and PDF format. The documents must be stored in an Amazon S3 bucket. Use the DocumentLocation parameter to specify the name of your S3 bucket and the name of the document in that bucket.   StartExpenseAnalysis returns a job identifier (JobId) that you will provide to GetExpenseAnalysis to retrieve the results of the operation. When the analysis of the input invoices/receipts is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that you provide to the NotificationChannel. To obtain the results of the invoice and receipt analysis operation, ensure that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetExpenseAnalysis, and pass the job identifier (JobId) that was returned by your call to StartExpenseAnalysis. For more information, see Analyzing Invoices and Receipts.
   */
  startExpenseAnalysis(params: Textract.Types.StartExpenseAnalysisRequest, callback?: (err: AWSError, data: Textract.Types.StartExpenseAnalysisResponse) => void): Request<Textract.Types.StartExpenseAnalysisResponse, AWSError>;
  /**
   * Starts the asynchronous analysis of invoices or receipts for data like contact information, items purchased, and vendor names.  StartExpenseAnalysis can analyze text in documents that are in JPEG, PNG, and PDF format. The documents must be stored in an Amazon S3 bucket. Use the DocumentLocation parameter to specify the name of your S3 bucket and the name of the document in that bucket.   StartExpenseAnalysis returns a job identifier (JobId) that you will provide to GetExpenseAnalysis to retrieve the results of the operation. When the analysis of the input invoices/receipts is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that you provide to the NotificationChannel. To obtain the results of the invoice and receipt analysis operation, ensure that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetExpenseAnalysis, and pass the job identifier (JobId) that was returned by your call to StartExpenseAnalysis. For more information, see Analyzing Invoices and Receipts.
   */
  startExpenseAnalysis(callback?: (err: AWSError, data: Textract.Types.StartExpenseAnalysisResponse) => void): Request<Textract.Types.StartExpenseAnalysisResponse, AWSError>;
}
declare namespace Textract {
  export interface AnalyzeDocumentRequest {
    /**
     * The input document as base64-encoded bytes or an Amazon S3 object. If you use the AWS CLI to call Amazon Textract operations, you can't pass image bytes. The document must be an image in JPEG or PNG format. If you're using an AWS SDK to call Amazon Textract, you might not need to base64-encode image bytes that are passed using the Bytes field. 
     */
    Document: Document;
    /**
     * A list of the types of analysis to perform. Add TABLES to the list to return information about the tables that are detected in the input document. Add FORMS to return detected form data. To perform both types of analysis, add TABLES and FORMS to FeatureTypes. All lines and words detected in the document are included in the response (including text that isn't related to the value of FeatureTypes). 
     */
    FeatureTypes: FeatureTypes;
    /**
     * Sets the configuration for the human in the loop workflow for analyzing documents.
     */
    HumanLoopConfig?: HumanLoopConfig;
  }
  export interface AnalyzeDocumentResponse {
    /**
     * Metadata about the analyzed document. An example is the number of pages.
     */
    DocumentMetadata?: DocumentMetadata;
    /**
     * The items that are detected and analyzed by AnalyzeDocument.
     */
    Blocks?: BlockList;
    /**
     * Shows the results of the human in the loop evaluation.
     */
    HumanLoopActivationOutput?: HumanLoopActivationOutput;
    /**
     * The version of the model used to analyze the document.
     */
    AnalyzeDocumentModelVersion?: String;
  }
  export interface AnalyzeExpenseRequest {
    Document: Document;
  }
  export interface AnalyzeExpenseResponse {
    DocumentMetadata?: DocumentMetadata;
    /**
     * The expenses detected by Amazon Textract.
     */
    ExpenseDocuments?: ExpenseDocumentList;
  }
  export interface Block {
    /**
     * The type of text item that's recognized. In operations for text detection, the following types are returned:    PAGE - Contains a list of the LINE Block objects that are detected on a document page.    WORD - A word detected on a document page. A word is one or more ISO basic Latin script characters that aren't separated by spaces.    LINE - A string of tab-delimited, contiguous words that are detected on a document page.   In text analysis operations, the following types are returned:    PAGE - Contains a list of child Block objects that are detected on a document page.    KEY_VALUE_SET - Stores the KEY and VALUE Block objects for linked text that's detected on a document page. Use the EntityType field to determine if a KEY_VALUE_SET object is a KEY Block object or a VALUE Block object.     WORD - A word that's detected on a document page. A word is one or more ISO basic Latin script characters that aren't separated by spaces.    LINE - A string of tab-delimited, contiguous words that are detected on a document page.    TABLE - A table that's detected on a document page. A table is grid-based information with two or more rows or columns, with a cell span of one row and one column each.     CELL - A cell within a detected table. The cell is the parent of the block that contains the text in the cell.    SELECTION_ELEMENT - A selection element such as an option button (radio button) or a check box that's detected on a document page. Use the value of SelectionStatus to determine the status of the selection element.  
     */
    BlockType?: BlockType;
    /**
     * The confidence score that Amazon Textract has in the accuracy of the recognized text and the accuracy of the geometry points around the recognized text.
     */
    Confidence?: Percent;
    /**
     * The word or line of text that's recognized by Amazon Textract. 
     */
    Text?: String;
    /**
     * The kind of text that Amazon Textract has detected. Can check for handwritten text and printed text.
     */
    TextType?: TextType;
    /**
     * The row in which a table cell is located. The first row position is 1. RowIndex isn't returned by DetectDocumentText and GetDocumentTextDetection.
     */
    RowIndex?: UInteger;
    /**
     * The column in which a table cell appears. The first column position is 1. ColumnIndex isn't returned by DetectDocumentText and GetDocumentTextDetection.
     */
    ColumnIndex?: UInteger;
    /**
     * The number of rows that a table cell spans. Currently this value is always 1, even if the number of rows spanned is greater than 1. RowSpan isn't returned by DetectDocumentText and GetDocumentTextDetection.
     */
    RowSpan?: UInteger;
    /**
     * The number of columns that a table cell spans. Currently this value is always 1, even if the number of columns spanned is greater than 1. ColumnSpan isn't returned by DetectDocumentText and GetDocumentTextDetection. 
     */
    ColumnSpan?: UInteger;
    /**
     * The location of the recognized text on the image. It includes an axis-aligned, coarse bounding box that surrounds the text, and a finer-grain polygon for more accurate spatial information. 
     */
    Geometry?: Geometry;
    /**
     * The identifier for the recognized text. The identifier is only unique for a single operation. 
     */
    Id?: NonEmptyString;
    /**
     * A list of child blocks of the current block. For example, a LINE object has child blocks for each WORD block that's part of the line of text. There aren't Relationship objects in the list for relationships that don't exist, such as when the current block has no child blocks. The list size can be the following:   0 - The block has no child blocks.   1 - The block has child blocks.  
     */
    Relationships?: RelationshipList;
    /**
     * The type of entity. The following can be returned:    KEY - An identifier for a field on the document.    VALUE - The field text.    EntityTypes isn't returned by DetectDocumentText and GetDocumentTextDetection.
     */
    EntityTypes?: EntityTypes;
    /**
     * The selection status of a selection element, such as an option button or check box. 
     */
    SelectionStatus?: SelectionStatus;
    /**
     * The page on which a block was detected. Page is returned by asynchronous operations. Page values greater than 1 are only returned for multipage documents that are in PDF or TIFF format. A scanned image (JPEG/PNG), even if it contains multiple document pages, is considered to be a single-page document. The value of Page is always 1. Synchronous operations don't return Page because every input document is considered to be a single-page document.
     */
    Page?: UInteger;
  }
  export type BlockList = Block[];
  export type BlockType = "KEY_VALUE_SET"|"PAGE"|"LINE"|"WORD"|"TABLE"|"CELL"|"SELECTION_ELEMENT"|string;
  export interface BoundingBox {
    /**
     * The width of the bounding box as a ratio of the overall document page width.
     */
    Width?: Float;
    /**
     * The height of the bounding box as a ratio of the overall document page height.
     */
    Height?: Float;
    /**
     * The left coordinate of the bounding box as a ratio of overall document page width.
     */
    Left?: Float;
    /**
     * The top coordinate of the bounding box as a ratio of overall document page height.
     */
    Top?: Float;
  }
  export type ClientRequestToken = string;
  export type ContentClassifier = "FreeOfPersonallyIdentifiableInformation"|"FreeOfAdultContent"|string;
  export type ContentClassifiers = ContentClassifier[];
  export interface DetectDocumentTextRequest {
    /**
     * The input document as base64-encoded bytes or an Amazon S3 object. If you use the AWS CLI to call Amazon Textract operations, you can't pass image bytes. The document must be an image in JPEG or PNG format. If you're using an AWS SDK to call Amazon Textract, you might not need to base64-encode image bytes that are passed using the Bytes field. 
     */
    Document: Document;
  }
  export interface DetectDocumentTextResponse {
    /**
     * Metadata about the document. It contains the number of pages that are detected in the document.
     */
    DocumentMetadata?: DocumentMetadata;
    /**
     * An array of Block objects that contain the text that's detected in the document.
     */
    Blocks?: BlockList;
    /**
     * 
     */
    DetectDocumentTextModelVersion?: String;
  }
  export interface Document {
    /**
     * A blob of base64-encoded document bytes. The maximum size of a document that's provided in a blob of bytes is 5 MB. The document bytes must be in PNG or JPEG format. If you're using an AWS SDK to call Amazon Textract, you might not need to base64-encode image bytes passed using the Bytes field. 
     */
    Bytes?: ImageBlob;
    /**
     * Identifies an S3 object as the document source. The maximum size of a document that's stored in an S3 bucket is 5 MB.
     */
    S3Object?: S3Object;
  }
  export interface DocumentLocation {
    /**
     * The Amazon S3 bucket that contains the input document.
     */
    S3Object?: S3Object;
  }
  export interface DocumentMetadata {
    /**
     * The number of pages that are detected in the document.
     */
    Pages?: UInteger;
  }
  export type EntityType = "KEY"|"VALUE"|string;
  export type EntityTypes = EntityType[];
  export type ErrorCode = string;
  export interface ExpenseDetection {
    /**
     * The word or line of text recognized by Amazon Textract
     */
    Text?: String;
    Geometry?: Geometry;
    /**
     * The confidence in detection, as a percentage
     */
    Confidence?: Percent;
  }
  export interface ExpenseDocument {
    /**
     * Denotes which invoice or receipt in the document the information is coming from. First document will be 1, the second 2, and so on.
     */
    ExpenseIndex?: UInteger;
    /**
     * Any information found outside of a table by Amazon Textract.
     */
    SummaryFields?: ExpenseFieldList;
    /**
     * Information detected on each table of a document, seperated into LineItems.
     */
    LineItemGroups?: LineItemGroupList;
  }
  export type ExpenseDocumentList = ExpenseDocument[];
  export interface ExpenseField {
    /**
     * The implied label of a detected element. Present alongside LabelDetection for explicit elements.
     */
    Type?: ExpenseType;
    /**
     * The explicitly stated label of a detected element.
     */
    LabelDetection?: ExpenseDetection;
    /**
     * The value of a detected element. Present in explicit and implicit elements.
     */
    ValueDetection?: ExpenseDetection;
    /**
     * The page number the value was detected on.
     */
    PageNumber?: UInteger;
  }
  export type ExpenseFieldList = ExpenseField[];
  export interface ExpenseType {
    /**
     * The word or line of text detected by Amazon Textract.
     */
    Text?: String;
    /**
     * The confidence of accuracy, as a percentage.
     */
    Confidence?: Percent;
  }
  export type FeatureType = "TABLES"|"FORMS"|string;
  export type FeatureTypes = FeatureType[];
  export type Float = number;
  export type FlowDefinitionArn = string;
  export interface Geometry {
    /**
     * An axis-aligned coarse representation of the location of the recognized item on the document page.
     */
    BoundingBox?: BoundingBox;
    /**
     * Within the bounding box, a fine-grained polygon around the recognized item.
     */
    Polygon?: Polygon;
  }
  export interface GetDocumentAnalysisRequest {
    /**
     * A unique identifier for the text-detection job. The JobId is returned from StartDocumentAnalysis. A JobId value is only valid for 7 days.
     */
    JobId: JobId;
    /**
     * The maximum number of results to return per paginated call. The largest value that you can specify is 1,000. If you specify a value greater than 1,000, a maximum of 1,000 results is returned. The default value is 1,000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there are more blocks to retrieve), Amazon Textract returns a pagination token in the response. You can use this pagination token to retrieve the next set of blocks.
     */
    NextToken?: PaginationToken;
  }
  export interface GetDocumentAnalysisResponse {
    /**
     * Information about a document that Amazon Textract processed. DocumentMetadata is returned in every page of paginated responses from an Amazon Textract video operation.
     */
    DocumentMetadata?: DocumentMetadata;
    /**
     * The current status of the text detection job.
     */
    JobStatus?: JobStatus;
    /**
     * If the response is truncated, Amazon Textract returns this token. You can use this token in the subsequent request to retrieve the next set of text detection results.
     */
    NextToken?: PaginationToken;
    /**
     * The results of the text-analysis operation.
     */
    Blocks?: BlockList;
    /**
     * A list of warnings that occurred during the document-analysis operation.
     */
    Warnings?: Warnings;
    /**
     * Returns if the detection job could not be completed. Contains explanation for what error occured.
     */
    StatusMessage?: StatusMessage;
    /**
     * 
     */
    AnalyzeDocumentModelVersion?: String;
  }
  export interface GetDocumentTextDetectionRequest {
    /**
     * A unique identifier for the text detection job. The JobId is returned from StartDocumentTextDetection. A JobId value is only valid for 7 days.
     */
    JobId: JobId;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 1,000. If you specify a value greater than 1,000, a maximum of 1,000 results is returned. The default value is 1,000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there are more blocks to retrieve), Amazon Textract returns a pagination token in the response. You can use this pagination token to retrieve the next set of blocks.
     */
    NextToken?: PaginationToken;
  }
  export interface GetDocumentTextDetectionResponse {
    /**
     * Information about a document that Amazon Textract processed. DocumentMetadata is returned in every page of paginated responses from an Amazon Textract video operation.
     */
    DocumentMetadata?: DocumentMetadata;
    /**
     * The current status of the text detection job.
     */
    JobStatus?: JobStatus;
    /**
     * If the response is truncated, Amazon Textract returns this token. You can use this token in the subsequent request to retrieve the next set of text-detection results.
     */
    NextToken?: PaginationToken;
    /**
     * The results of the text-detection operation.
     */
    Blocks?: BlockList;
    /**
     * A list of warnings that occurred during the text-detection operation for the document.
     */
    Warnings?: Warnings;
    /**
     * Returns if the detection job could not be completed. Contains explanation for what error occured. 
     */
    StatusMessage?: StatusMessage;
    /**
     * 
     */
    DetectDocumentTextModelVersion?: String;
  }
  export interface GetExpenseAnalysisRequest {
    /**
     * A unique identifier for the text detection job. The JobId is returned from StartExpenseAnalysis. A JobId value is only valid for 7 days.
     */
    JobId: JobId;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 20. If you specify a value greater than 20, a maximum of 20 results is returned. The default value is 20.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there are more blocks to retrieve), Amazon Textract returns a pagination token in the response. You can use this pagination token to retrieve the next set of blocks.
     */
    NextToken?: PaginationToken;
  }
  export interface GetExpenseAnalysisResponse {
    /**
     * Information about a document that Amazon Textract processed. DocumentMetadata is returned in every page of paginated responses from an Amazon Textract operation.
     */
    DocumentMetadata?: DocumentMetadata;
    /**
     * The current status of the text detection job.
     */
    JobStatus?: JobStatus;
    /**
     * If the response is truncated, Amazon Textract returns this token. You can use this token in the subsequent request to retrieve the next set of text-detection results.
     */
    NextToken?: PaginationToken;
    /**
     * The expenses detected by Amazon Textract.
     */
    ExpenseDocuments?: ExpenseDocumentList;
    /**
     * A list of warnings that occurred during the text-detection operation for the document.
     */
    Warnings?: Warnings;
    /**
     * Returns if the detection job could not be completed. Contains explanation for what error occured. 
     */
    StatusMessage?: StatusMessage;
    /**
     * The current model version of AnalyzeExpense.
     */
    AnalyzeExpenseModelVersion?: String;
  }
  export type HumanLoopActivationConditionsEvaluationResults = string;
  export interface HumanLoopActivationOutput {
    /**
     * The Amazon Resource Name (ARN) of the HumanLoop created.
     */
    HumanLoopArn?: HumanLoopArn;
    /**
     * Shows if and why human review was needed.
     */
    HumanLoopActivationReasons?: HumanLoopActivationReasons;
    /**
     * Shows the result of condition evaluations, including those conditions which activated a human review.
     */
    HumanLoopActivationConditionsEvaluationResults?: HumanLoopActivationConditionsEvaluationResults;
  }
  export type HumanLoopActivationReason = string;
  export type HumanLoopActivationReasons = HumanLoopActivationReason[];
  export type HumanLoopArn = string;
  export interface HumanLoopConfig {
    /**
     * The name of the human workflow used for this image. This should be kept unique within a region.
     */
    HumanLoopName: HumanLoopName;
    /**
     * The Amazon Resource Name (ARN) of the flow definition.
     */
    FlowDefinitionArn: FlowDefinitionArn;
    /**
     * Sets attributes of the input data.
     */
    DataAttributes?: HumanLoopDataAttributes;
  }
  export interface HumanLoopDataAttributes {
    /**
     * Sets whether the input image is free of personally identifiable information or adult content.
     */
    ContentClassifiers?: ContentClassifiers;
  }
  export type HumanLoopName = string;
  export type IdList = NonEmptyString[];
  export type ImageBlob = Buffer|Uint8Array|Blob|string;
  export type JobId = string;
  export type JobStatus = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|"PARTIAL_SUCCESS"|string;
  export type JobTag = string;
  export type KMSKeyId = string;
  export interface LineItemFields {
    /**
     * ExpenseFields used to show information from detected lines on a table.
     */
    LineItemExpenseFields?: ExpenseFieldList;
  }
  export interface LineItemGroup {
    /**
     * The number used to identify a specific table in a document. The first table encountered will have a LineItemGroupIndex of 1, the second 2, etc.
     */
    LineItemGroupIndex?: UInteger;
    /**
     * The breakdown of information on a particular line of a table. 
     */
    LineItems?: LineItemList;
  }
  export type LineItemGroupList = LineItemGroup[];
  export type LineItemList = LineItemFields[];
  export type MaxResults = number;
  export type NonEmptyString = string;
  export interface NotificationChannel {
    /**
     * The Amazon SNS topic that Amazon Textract posts the completion status to.
     */
    SNSTopicArn: SNSTopicArn;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that gives Amazon Textract publishing permissions to the Amazon SNS topic. 
     */
    RoleArn: RoleArn;
  }
  export interface OutputConfig {
    /**
     * The name of the bucket your output will go to.
     */
    S3Bucket: S3Bucket;
    /**
     * The prefix of the object key that the output will be saved to. When not enabled, the prefix will be “textract_output".
     */
    S3Prefix?: S3ObjectName;
  }
  export type Pages = UInteger[];
  export type PaginationToken = string;
  export type Percent = number;
  export interface Point {
    /**
     * The value of the X coordinate for a point on a Polygon.
     */
    X?: Float;
    /**
     * The value of the Y coordinate for a point on a Polygon.
     */
    Y?: Float;
  }
  export type Polygon = Point[];
  export interface Relationship {
    /**
     * The type of relationship that the blocks in the IDs array have with the current block. The relationship can be VALUE or CHILD. A relationship of type VALUE is a list that contains the ID of the VALUE block that's associated with the KEY of a key-value pair. A relationship of type CHILD is a list of IDs that identify WORD blocks in the case of lines Cell blocks in the case of Tables, and WORD blocks in the case of Selection Elements.
     */
    Type?: RelationshipType;
    /**
     * An array of IDs for related blocks. You can get the type of the relationship from the Type element.
     */
    Ids?: IdList;
  }
  export type RelationshipList = Relationship[];
  export type RelationshipType = "VALUE"|"CHILD"|"COMPLEX_FEATURES"|string;
  export type RoleArn = string;
  export type S3Bucket = string;
  export interface S3Object {
    /**
     * The name of the S3 bucket. Note that the # character is not valid in the file name.
     */
    Bucket?: S3Bucket;
    /**
     * The file name of the input document. Synchronous operations can use image files that are in JPEG or PNG format. Asynchronous operations also support PDF and TIFF format files.
     */
    Name?: S3ObjectName;
    /**
     * If the bucket has versioning enabled, you can specify the object version. 
     */
    Version?: S3ObjectVersion;
  }
  export type S3ObjectName = string;
  export type S3ObjectVersion = string;
  export type SNSTopicArn = string;
  export type SelectionStatus = "SELECTED"|"NOT_SELECTED"|string;
  export interface StartDocumentAnalysisRequest {
    /**
     * The location of the document to be processed.
     */
    DocumentLocation: DocumentLocation;
    /**
     * A list of the types of analysis to perform. Add TABLES to the list to return information about the tables that are detected in the input document. Add FORMS to return detected form data. To perform both types of analysis, add TABLES and FORMS to FeatureTypes. All lines and words detected in the document are included in the response (including text that isn't related to the value of FeatureTypes). 
     */
    FeatureTypes: FeatureTypes;
    /**
     * The idempotent token that you use to identify the start request. If you use the same token with multiple StartDocumentAnalysis requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidentally started more than once. For more information, see Calling Amazon Textract Asynchronous Operations.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * An identifier that you specify that's included in the completion notification published to the Amazon SNS topic. For example, you can use JobTag to identify the type of document that the completion notification corresponds to (such as a tax form or a receipt).
     */
    JobTag?: JobTag;
    /**
     * The Amazon SNS topic ARN that you want Amazon Textract to publish the completion status of the operation to. 
     */
    NotificationChannel?: NotificationChannel;
    /**
     * Sets if the output will go to a customer defined bucket. By default, Amazon Textract will save the results internally to be accessed by the GetDocumentAnalysis operation.
     */
    OutputConfig?: OutputConfig;
    /**
     * The KMS key used to encrypt the inference results. This can be in either Key ID or Key Alias format. When a KMS key is provided, the KMS key will be used for server-side encryption of the objects in the customer bucket. When this parameter is not enabled, the result will be encrypted server side,using SSE-S3.
     */
    KMSKeyId?: KMSKeyId;
  }
  export interface StartDocumentAnalysisResponse {
    /**
     * The identifier for the document text detection job. Use JobId to identify the job in a subsequent call to GetDocumentAnalysis. A JobId value is only valid for 7 days.
     */
    JobId?: JobId;
  }
  export interface StartDocumentTextDetectionRequest {
    /**
     * The location of the document to be processed.
     */
    DocumentLocation: DocumentLocation;
    /**
     * The idempotent token that's used to identify the start request. If you use the same token with multiple StartDocumentTextDetection requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidentally started more than once. For more information, see Calling Amazon Textract Asynchronous Operations.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * An identifier that you specify that's included in the completion notification published to the Amazon SNS topic. For example, you can use JobTag to identify the type of document that the completion notification corresponds to (such as a tax form or a receipt).
     */
    JobTag?: JobTag;
    /**
     * The Amazon SNS topic ARN that you want Amazon Textract to publish the completion status of the operation to. 
     */
    NotificationChannel?: NotificationChannel;
    /**
     * Sets if the output will go to a customer defined bucket. By default Amazon Textract will save the results internally to be accessed with the GetDocumentTextDetection operation.
     */
    OutputConfig?: OutputConfig;
    /**
     * The KMS key used to encrypt the inference results. This can be in either Key ID or Key Alias format. When a KMS key is provided, the KMS key will be used for server-side encryption of the objects in the customer bucket. When this parameter is not enabled, the result will be encrypted server side,using SSE-S3.
     */
    KMSKeyId?: KMSKeyId;
  }
  export interface StartDocumentTextDetectionResponse {
    /**
     * The identifier of the text detection job for the document. Use JobId to identify the job in a subsequent call to GetDocumentTextDetection. A JobId value is only valid for 7 days.
     */
    JobId?: JobId;
  }
  export interface StartExpenseAnalysisRequest {
    /**
     * The location of the document to be processed.
     */
    DocumentLocation: DocumentLocation;
    /**
     * The idempotent token that's used to identify the start request. If you use the same token with multiple StartDocumentTextDetection requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidentally started more than once. For more information, see Calling Amazon Textract Asynchronous Operations 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * An identifier you specify that's included in the completion notification published to the Amazon SNS topic. For example, you can use JobTag to identify the type of document that the completion notification corresponds to (such as a tax form or a receipt).
     */
    JobTag?: JobTag;
    /**
     * The Amazon SNS topic ARN that you want Amazon Textract to publish the completion status of the operation to. 
     */
    NotificationChannel?: NotificationChannel;
    /**
     * Sets if the output will go to a customer defined bucket. By default, Amazon Textract will save the results internally to be accessed by the GetExpenseAnalysis operation.
     */
    OutputConfig?: OutputConfig;
    /**
     * The KMS key used to encrypt the inference results. This can be in either Key ID or Key Alias format. When a KMS key is provided, the KMS key will be used for server-side encryption of the objects in the customer bucket. When this parameter is not enabled, the result will be encrypted server side,using SSE-S3.
     */
    KMSKeyId?: KMSKeyId;
  }
  export interface StartExpenseAnalysisResponse {
    /**
     * A unique identifier for the text detection job. The JobId is returned from StartExpenseAnalysis. A JobId value is only valid for 7 days.
     */
    JobId?: JobId;
  }
  export type StatusMessage = string;
  export type String = string;
  export type TextType = "HANDWRITING"|"PRINTED"|string;
  export type UInteger = number;
  export interface Warning {
    /**
     * The error code for the warning.
     */
    ErrorCode?: ErrorCode;
    /**
     * A list of the pages that the warning applies to.
     */
    Pages?: Pages;
  }
  export type Warnings = Warning[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-06-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Textract client.
   */
  export import Types = Textract;
}
export = Textract;
