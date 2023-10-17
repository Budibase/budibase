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
   * Analyzes an input document for relationships between detected items.  The types of information returned are as follows:    Form data (key-value pairs). The related information is returned in two Block objects, each of type KEY_VALUE_SET: a KEY Block object and a VALUE Block object. For example, Name: Ana Silva Carolina contains a key and value. Name: is the key. Ana Silva Carolina is the value.   Table and table cell data. A TABLE Block object contains information about a detected table. A CELL Block object is returned for each cell in a table.   Lines and words of text. A LINE Block object contains one or more WORD Block objects. All lines and words that are detected in the document are returned (including text that doesn't have a relationship with the value of FeatureTypes).    Signatures. A SIGNATURE Block object contains the location information of a signature in a document. If used in conjunction with forms or tables, a signature can be given a Key-Value pairing or be detected in the cell of a table.   Query. A QUERY Block object contains the query text, alias and link to the associated Query results block object.   Query Result. A QUERY_RESULT Block object contains the answer to the query and an ID that connects it to the query asked. This Block also contains a confidence score.   Selection elements such as check boxes and option buttons (radio buttons) can be detected in form data and in tables. A SELECTION_ELEMENT Block object contains information about a selection element, including the selection status. You can choose which type of analysis to perform by specifying the FeatureTypes list.  The output is returned in a list of Block objects.  AnalyzeDocument is a synchronous operation. To analyze documents asynchronously, use StartDocumentAnalysis. For more information, see Document Text Analysis.
   */
  analyzeDocument(params: Textract.Types.AnalyzeDocumentRequest, callback?: (err: AWSError, data: Textract.Types.AnalyzeDocumentResponse) => void): Request<Textract.Types.AnalyzeDocumentResponse, AWSError>;
  /**
   * Analyzes an input document for relationships between detected items.  The types of information returned are as follows:    Form data (key-value pairs). The related information is returned in two Block objects, each of type KEY_VALUE_SET: a KEY Block object and a VALUE Block object. For example, Name: Ana Silva Carolina contains a key and value. Name: is the key. Ana Silva Carolina is the value.   Table and table cell data. A TABLE Block object contains information about a detected table. A CELL Block object is returned for each cell in a table.   Lines and words of text. A LINE Block object contains one or more WORD Block objects. All lines and words that are detected in the document are returned (including text that doesn't have a relationship with the value of FeatureTypes).    Signatures. A SIGNATURE Block object contains the location information of a signature in a document. If used in conjunction with forms or tables, a signature can be given a Key-Value pairing or be detected in the cell of a table.   Query. A QUERY Block object contains the query text, alias and link to the associated Query results block object.   Query Result. A QUERY_RESULT Block object contains the answer to the query and an ID that connects it to the query asked. This Block also contains a confidence score.   Selection elements such as check boxes and option buttons (radio buttons) can be detected in form data and in tables. A SELECTION_ELEMENT Block object contains information about a selection element, including the selection status. You can choose which type of analysis to perform by specifying the FeatureTypes list.  The output is returned in a list of Block objects.  AnalyzeDocument is a synchronous operation. To analyze documents asynchronously, use StartDocumentAnalysis. For more information, see Document Text Analysis.
   */
  analyzeDocument(callback?: (err: AWSError, data: Textract.Types.AnalyzeDocumentResponse) => void): Request<Textract.Types.AnalyzeDocumentResponse, AWSError>;
  /**
   *  AnalyzeExpense synchronously analyzes an input document for financially related relationships between text. Information is returned as ExpenseDocuments and seperated as follows:    LineItemGroups- A data set containing LineItems which store information about the lines of text, such as an item purchased and its price on a receipt.    SummaryFields- Contains all other information a receipt, such as header information or the vendors name.  
   */
  analyzeExpense(params: Textract.Types.AnalyzeExpenseRequest, callback?: (err: AWSError, data: Textract.Types.AnalyzeExpenseResponse) => void): Request<Textract.Types.AnalyzeExpenseResponse, AWSError>;
  /**
   *  AnalyzeExpense synchronously analyzes an input document for financially related relationships between text. Information is returned as ExpenseDocuments and seperated as follows:    LineItemGroups- A data set containing LineItems which store information about the lines of text, such as an item purchased and its price on a receipt.    SummaryFields- Contains all other information a receipt, such as header information or the vendors name.  
   */
  analyzeExpense(callback?: (err: AWSError, data: Textract.Types.AnalyzeExpenseResponse) => void): Request<Textract.Types.AnalyzeExpenseResponse, AWSError>;
  /**
   * Analyzes identity documents for relevant information. This information is extracted and returned as IdentityDocumentFields, which records both the normalized field and value of the extracted text. Unlike other Amazon Textract operations, AnalyzeID doesn't return any Geometry data.
   */
  analyzeID(params: Textract.Types.AnalyzeIDRequest, callback?: (err: AWSError, data: Textract.Types.AnalyzeIDResponse) => void): Request<Textract.Types.AnalyzeIDResponse, AWSError>;
  /**
   * Analyzes identity documents for relevant information. This information is extracted and returned as IdentityDocumentFields, which records both the normalized field and value of the extracted text. Unlike other Amazon Textract operations, AnalyzeID doesn't return any Geometry data.
   */
  analyzeID(callback?: (err: AWSError, data: Textract.Types.AnalyzeIDResponse) => void): Request<Textract.Types.AnalyzeIDResponse, AWSError>;
  /**
   * Creates an adapter, which can be fine-tuned for enhanced performance on user provided documents. Takes an AdapterName and FeatureType. Currently the only supported feature type is QUERIES. You can also provide a Description, Tags, and a ClientRequestToken. You can choose whether or not the adapter should be AutoUpdated with the AutoUpdate argument. By default, AutoUpdate is set to DISABLED.
   */
  createAdapter(params: Textract.Types.CreateAdapterRequest, callback?: (err: AWSError, data: Textract.Types.CreateAdapterResponse) => void): Request<Textract.Types.CreateAdapterResponse, AWSError>;
  /**
   * Creates an adapter, which can be fine-tuned for enhanced performance on user provided documents. Takes an AdapterName and FeatureType. Currently the only supported feature type is QUERIES. You can also provide a Description, Tags, and a ClientRequestToken. You can choose whether or not the adapter should be AutoUpdated with the AutoUpdate argument. By default, AutoUpdate is set to DISABLED.
   */
  createAdapter(callback?: (err: AWSError, data: Textract.Types.CreateAdapterResponse) => void): Request<Textract.Types.CreateAdapterResponse, AWSError>;
  /**
   * Creates a new version of an adapter. Operates on a provided AdapterId and a specified dataset provided via the DatasetConfig argument. Requires that you specify an Amazon S3 bucket with the OutputConfig argument. You can provide an optional KMSKeyId, an optional ClientRequestToken, and optional tags.
   */
  createAdapterVersion(params: Textract.Types.CreateAdapterVersionRequest, callback?: (err: AWSError, data: Textract.Types.CreateAdapterVersionResponse) => void): Request<Textract.Types.CreateAdapterVersionResponse, AWSError>;
  /**
   * Creates a new version of an adapter. Operates on a provided AdapterId and a specified dataset provided via the DatasetConfig argument. Requires that you specify an Amazon S3 bucket with the OutputConfig argument. You can provide an optional KMSKeyId, an optional ClientRequestToken, and optional tags.
   */
  createAdapterVersion(callback?: (err: AWSError, data: Textract.Types.CreateAdapterVersionResponse) => void): Request<Textract.Types.CreateAdapterVersionResponse, AWSError>;
  /**
   * Deletes an Amazon Textract adapter. Takes an AdapterId and deletes the adapter specified by the ID.
   */
  deleteAdapter(params: Textract.Types.DeleteAdapterRequest, callback?: (err: AWSError, data: Textract.Types.DeleteAdapterResponse) => void): Request<Textract.Types.DeleteAdapterResponse, AWSError>;
  /**
   * Deletes an Amazon Textract adapter. Takes an AdapterId and deletes the adapter specified by the ID.
   */
  deleteAdapter(callback?: (err: AWSError, data: Textract.Types.DeleteAdapterResponse) => void): Request<Textract.Types.DeleteAdapterResponse, AWSError>;
  /**
   * Deletes an Amazon Textract adapter version. Requires that you specify both an AdapterId and a AdapterVersion. Deletes the adapter version specified by the AdapterId and the AdapterVersion.
   */
  deleteAdapterVersion(params: Textract.Types.DeleteAdapterVersionRequest, callback?: (err: AWSError, data: Textract.Types.DeleteAdapterVersionResponse) => void): Request<Textract.Types.DeleteAdapterVersionResponse, AWSError>;
  /**
   * Deletes an Amazon Textract adapter version. Requires that you specify both an AdapterId and a AdapterVersion. Deletes the adapter version specified by the AdapterId and the AdapterVersion.
   */
  deleteAdapterVersion(callback?: (err: AWSError, data: Textract.Types.DeleteAdapterVersionResponse) => void): Request<Textract.Types.DeleteAdapterVersionResponse, AWSError>;
  /**
   * Detects text in the input document. Amazon Textract can detect lines of text and the words that make up a line of text. The input document must be in one of the following image formats: JPEG, PNG, PDF, or TIFF. DetectDocumentText returns the detected text in an array of Block objects.  Each document page has as an associated Block of type PAGE. Each PAGE Block object is the parent of LINE Block objects that represent the lines of detected text on a page. A LINE Block object is a parent for each word that makes up the line. Words are represented by Block objects of type WORD.  DetectDocumentText is a synchronous operation. To analyze documents asynchronously, use StartDocumentTextDetection. For more information, see Document Text Detection.
   */
  detectDocumentText(params: Textract.Types.DetectDocumentTextRequest, callback?: (err: AWSError, data: Textract.Types.DetectDocumentTextResponse) => void): Request<Textract.Types.DetectDocumentTextResponse, AWSError>;
  /**
   * Detects text in the input document. Amazon Textract can detect lines of text and the words that make up a line of text. The input document must be in one of the following image formats: JPEG, PNG, PDF, or TIFF. DetectDocumentText returns the detected text in an array of Block objects.  Each document page has as an associated Block of type PAGE. Each PAGE Block object is the parent of LINE Block objects that represent the lines of detected text on a page. A LINE Block object is a parent for each word that makes up the line. Words are represented by Block objects of type WORD.  DetectDocumentText is a synchronous operation. To analyze documents asynchronously, use StartDocumentTextDetection. For more information, see Document Text Detection.
   */
  detectDocumentText(callback?: (err: AWSError, data: Textract.Types.DetectDocumentTextResponse) => void): Request<Textract.Types.DetectDocumentTextResponse, AWSError>;
  /**
   * Gets configuration information for an adapter specified by an AdapterId, returning information on AdapterName, Description, CreationTime, AutoUpdate status, and FeatureTypes.
   */
  getAdapter(params: Textract.Types.GetAdapterRequest, callback?: (err: AWSError, data: Textract.Types.GetAdapterResponse) => void): Request<Textract.Types.GetAdapterResponse, AWSError>;
  /**
   * Gets configuration information for an adapter specified by an AdapterId, returning information on AdapterName, Description, CreationTime, AutoUpdate status, and FeatureTypes.
   */
  getAdapter(callback?: (err: AWSError, data: Textract.Types.GetAdapterResponse) => void): Request<Textract.Types.GetAdapterResponse, AWSError>;
  /**
   * Gets configuration information for the specified adapter version, including: AdapterId, AdapterVersion, FeatureTypes, Status, StatusMessage, DatasetConfig, KMSKeyId, OutputConfig, Tags and EvaluationMetrics.
   */
  getAdapterVersion(params: Textract.Types.GetAdapterVersionRequest, callback?: (err: AWSError, data: Textract.Types.GetAdapterVersionResponse) => void): Request<Textract.Types.GetAdapterVersionResponse, AWSError>;
  /**
   * Gets configuration information for the specified adapter version, including: AdapterId, AdapterVersion, FeatureTypes, Status, StatusMessage, DatasetConfig, KMSKeyId, OutputConfig, Tags and EvaluationMetrics.
   */
  getAdapterVersion(callback?: (err: AWSError, data: Textract.Types.GetAdapterVersionResponse) => void): Request<Textract.Types.GetAdapterVersionResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that analyzes text in a document. You start asynchronous text analysis by calling StartDocumentAnalysis, which returns a job identifier (JobId). When the text analysis operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartDocumentAnalysis. To get the results of the text-detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentAnalysis, and pass the job identifier (JobId) from the initial call to StartDocumentAnalysis.  GetDocumentAnalysis returns an array of Block objects. The following types of information are returned:    Form data (key-value pairs). The related information is returned in two Block objects, each of type KEY_VALUE_SET: a KEY Block object and a VALUE Block object. For example, Name: Ana Silva Carolina contains a key and value. Name: is the key. Ana Silva Carolina is the value.   Table and table cell data. A TABLE Block object contains information about a detected table. A CELL Block object is returned for each cell in a table.   Lines and words of text. A LINE Block object contains one or more WORD Block objects. All lines and words that are detected in the document are returned (including text that doesn't have a relationship with the value of the StartDocumentAnalysis FeatureTypes input parameter).    Query. A QUERY Block object contains the query text, alias and link to the associated Query results block object.   Query Results. A QUERY_RESULT Block object contains the answer to the query and an ID that connects it to the query asked. This Block also contains a confidence score.    While processing a document with queries, look out for INVALID_REQUEST_PARAMETERS output. This indicates that either the per page query limit has been exceeded or that the operation is trying to query a page in the document which doesn’t exist.   Selection elements such as check boxes and option buttons (radio buttons) can be detected in form data and in tables. A SELECTION_ELEMENT Block object contains information about a selection element, including the selection status. Use the MaxResults parameter to limit the number of blocks that are returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetDocumentAnalysis, and populate the NextToken request parameter with the token value that's returned from the previous call to GetDocumentAnalysis. For more information, see Document Text Analysis.
   */
  getDocumentAnalysis(params: Textract.Types.GetDocumentAnalysisRequest, callback?: (err: AWSError, data: Textract.Types.GetDocumentAnalysisResponse) => void): Request<Textract.Types.GetDocumentAnalysisResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that analyzes text in a document. You start asynchronous text analysis by calling StartDocumentAnalysis, which returns a job identifier (JobId). When the text analysis operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartDocumentAnalysis. To get the results of the text-detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetDocumentAnalysis, and pass the job identifier (JobId) from the initial call to StartDocumentAnalysis.  GetDocumentAnalysis returns an array of Block objects. The following types of information are returned:    Form data (key-value pairs). The related information is returned in two Block objects, each of type KEY_VALUE_SET: a KEY Block object and a VALUE Block object. For example, Name: Ana Silva Carolina contains a key and value. Name: is the key. Ana Silva Carolina is the value.   Table and table cell data. A TABLE Block object contains information about a detected table. A CELL Block object is returned for each cell in a table.   Lines and words of text. A LINE Block object contains one or more WORD Block objects. All lines and words that are detected in the document are returned (including text that doesn't have a relationship with the value of the StartDocumentAnalysis FeatureTypes input parameter).    Query. A QUERY Block object contains the query text, alias and link to the associated Query results block object.   Query Results. A QUERY_RESULT Block object contains the answer to the query and an ID that connects it to the query asked. This Block also contains a confidence score.    While processing a document with queries, look out for INVALID_REQUEST_PARAMETERS output. This indicates that either the per page query limit has been exceeded or that the operation is trying to query a page in the document which doesn’t exist.   Selection elements such as check boxes and option buttons (radio buttons) can be detected in form data and in tables. A SELECTION_ELEMENT Block object contains information about a selection element, including the selection status. Use the MaxResults parameter to limit the number of blocks that are returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetDocumentAnalysis, and populate the NextToken request parameter with the token value that's returned from the previous call to GetDocumentAnalysis. For more information, see Document Text Analysis.
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
   * Gets the results for an Amazon Textract asynchronous operation that analyzes text in a lending document.  You start asynchronous text analysis by calling StartLendingAnalysis, which returns a job identifier (JobId). When the text analysis operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartLendingAnalysis.  To get the results of the text analysis operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetLendingAnalysis, and pass the job identifier (JobId) from the initial call to StartLendingAnalysis.
   */
  getLendingAnalysis(params: Textract.Types.GetLendingAnalysisRequest, callback?: (err: AWSError, data: Textract.Types.GetLendingAnalysisResponse) => void): Request<Textract.Types.GetLendingAnalysisResponse, AWSError>;
  /**
   * Gets the results for an Amazon Textract asynchronous operation that analyzes text in a lending document.  You start asynchronous text analysis by calling StartLendingAnalysis, which returns a job identifier (JobId). When the text analysis operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartLendingAnalysis.  To get the results of the text analysis operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetLendingAnalysis, and pass the job identifier (JobId) from the initial call to StartLendingAnalysis.
   */
  getLendingAnalysis(callback?: (err: AWSError, data: Textract.Types.GetLendingAnalysisResponse) => void): Request<Textract.Types.GetLendingAnalysisResponse, AWSError>;
  /**
   * Gets summarized results for the StartLendingAnalysis operation, which analyzes text in a lending document. The returned summary consists of information about documents grouped together by a common document type. Information like detected signatures, page numbers, and split documents is returned with respect to the type of grouped document.  You start asynchronous text analysis by calling StartLendingAnalysis, which returns a job identifier (JobId). When the text analysis operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartLendingAnalysis.  To get the results of the text analysis operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetLendingAnalysisSummary, and pass the job identifier (JobId) from the initial call to StartLendingAnalysis.
   */
  getLendingAnalysisSummary(params: Textract.Types.GetLendingAnalysisSummaryRequest, callback?: (err: AWSError, data: Textract.Types.GetLendingAnalysisSummaryResponse) => void): Request<Textract.Types.GetLendingAnalysisSummaryResponse, AWSError>;
  /**
   * Gets summarized results for the StartLendingAnalysis operation, which analyzes text in a lending document. The returned summary consists of information about documents grouped together by a common document type. Information like detected signatures, page numbers, and split documents is returned with respect to the type of grouped document.  You start asynchronous text analysis by calling StartLendingAnalysis, which returns a job identifier (JobId). When the text analysis operation finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to StartLendingAnalysis.  To get the results of the text analysis operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetLendingAnalysisSummary, and pass the job identifier (JobId) from the initial call to StartLendingAnalysis.
   */
  getLendingAnalysisSummary(callback?: (err: AWSError, data: Textract.Types.GetLendingAnalysisSummaryResponse) => void): Request<Textract.Types.GetLendingAnalysisSummaryResponse, AWSError>;
  /**
   * List all version of an adapter that meet the specified filtration criteria.
   */
  listAdapterVersions(params: Textract.Types.ListAdapterVersionsRequest, callback?: (err: AWSError, data: Textract.Types.ListAdapterVersionsResponse) => void): Request<Textract.Types.ListAdapterVersionsResponse, AWSError>;
  /**
   * List all version of an adapter that meet the specified filtration criteria.
   */
  listAdapterVersions(callback?: (err: AWSError, data: Textract.Types.ListAdapterVersionsResponse) => void): Request<Textract.Types.ListAdapterVersionsResponse, AWSError>;
  /**
   * Lists all adapters that match the specified filtration criteria.
   */
  listAdapters(params: Textract.Types.ListAdaptersRequest, callback?: (err: AWSError, data: Textract.Types.ListAdaptersResponse) => void): Request<Textract.Types.ListAdaptersResponse, AWSError>;
  /**
   * Lists all adapters that match the specified filtration criteria.
   */
  listAdapters(callback?: (err: AWSError, data: Textract.Types.ListAdaptersResponse) => void): Request<Textract.Types.ListAdaptersResponse, AWSError>;
  /**
   * Lists all tags for an Amazon Textract resource.
   */
  listTagsForResource(params: Textract.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Textract.Types.ListTagsForResourceResponse) => void): Request<Textract.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags for an Amazon Textract resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Textract.Types.ListTagsForResourceResponse) => void): Request<Textract.Types.ListTagsForResourceResponse, AWSError>;
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
  /**
   * Starts the classification and analysis of an input document. StartLendingAnalysis initiates the classification and analysis of a packet of lending documents. StartLendingAnalysis operates on a document file located in an Amazon S3 bucket.  StartLendingAnalysis can analyze text in documents that are in one of the following formats: JPEG, PNG, TIFF, PDF. Use DocumentLocation to specify the bucket name and the file name of the document.   StartLendingAnalysis returns a job identifier (JobId) that you use to get the results of the operation. When the text analysis is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that you specify in NotificationChannel. To get the results of the text analysis operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If the status is SUCCEEDED you can call either GetLendingAnalysis or GetLendingAnalysisSummary and provide the JobId to obtain the results of the analysis. If using OutputConfig to specify an Amazon S3 bucket, the output will be contained within the specified prefix in a directory labeled with the job-id. In the directory there are 3 sub-directories:    detailedResponse (contains the GetLendingAnalysis response)   summaryResponse (for the GetLendingAnalysisSummary response)   splitDocuments (documents split across logical boundaries)  
   */
  startLendingAnalysis(params: Textract.Types.StartLendingAnalysisRequest, callback?: (err: AWSError, data: Textract.Types.StartLendingAnalysisResponse) => void): Request<Textract.Types.StartLendingAnalysisResponse, AWSError>;
  /**
   * Starts the classification and analysis of an input document. StartLendingAnalysis initiates the classification and analysis of a packet of lending documents. StartLendingAnalysis operates on a document file located in an Amazon S3 bucket.  StartLendingAnalysis can analyze text in documents that are in one of the following formats: JPEG, PNG, TIFF, PDF. Use DocumentLocation to specify the bucket name and the file name of the document.   StartLendingAnalysis returns a job identifier (JobId) that you use to get the results of the operation. When the text analysis is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that you specify in NotificationChannel. To get the results of the text analysis operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If the status is SUCCEEDED you can call either GetLendingAnalysis or GetLendingAnalysisSummary and provide the JobId to obtain the results of the analysis. If using OutputConfig to specify an Amazon S3 bucket, the output will be contained within the specified prefix in a directory labeled with the job-id. In the directory there are 3 sub-directories:    detailedResponse (contains the GetLendingAnalysis response)   summaryResponse (for the GetLendingAnalysisSummary response)   splitDocuments (documents split across logical boundaries)  
   */
  startLendingAnalysis(callback?: (err: AWSError, data: Textract.Types.StartLendingAnalysisResponse) => void): Request<Textract.Types.StartLendingAnalysisResponse, AWSError>;
  /**
   * Adds one or more tags to the specified resource.
   */
  tagResource(params: Textract.Types.TagResourceRequest, callback?: (err: AWSError, data: Textract.Types.TagResourceResponse) => void): Request<Textract.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: Textract.Types.TagResourceResponse) => void): Request<Textract.Types.TagResourceResponse, AWSError>;
  /**
   * Removes any tags with the specified keys from the specified resource.
   */
  untagResource(params: Textract.Types.UntagResourceRequest, callback?: (err: AWSError, data: Textract.Types.UntagResourceResponse) => void): Request<Textract.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes any tags with the specified keys from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: Textract.Types.UntagResourceResponse) => void): Request<Textract.Types.UntagResourceResponse, AWSError>;
  /**
   * Update the configuration for an adapter. FeatureTypes configurations cannot be updated. At least one new parameter must be specified as an argument.
   */
  updateAdapter(params: Textract.Types.UpdateAdapterRequest, callback?: (err: AWSError, data: Textract.Types.UpdateAdapterResponse) => void): Request<Textract.Types.UpdateAdapterResponse, AWSError>;
  /**
   * Update the configuration for an adapter. FeatureTypes configurations cannot be updated. At least one new parameter must be specified as an argument.
   */
  updateAdapter(callback?: (err: AWSError, data: Textract.Types.UpdateAdapterResponse) => void): Request<Textract.Types.UpdateAdapterResponse, AWSError>;
}
declare namespace Textract {
  export interface Adapter {
    /**
     * A unique identifier for the adapter resource.
     */
    AdapterId: AdapterId;
    /**
     * Pages is a parameter that the user inputs to specify which pages to apply an adapter to. The following is a list of rules for using this parameter.   If a page is not specified, it is set to ["1"] by default.   The following characters are allowed in the parameter's string: 0 1 2 3 4 5 6 7 8 9 - *. No whitespace is allowed.   When using * to indicate all pages, it must be the only element in the list.   You can use page intervals, such as ["1-3", "1-1", "4-*"]. Where * indicates last page of document.   Specified pages must be greater than 0 and less than or equal to the number of pages in the document.  
     */
    Pages?: AdapterPages;
    /**
     * A string that identifies the version of the adapter.
     */
    Version: AdapterVersion;
  }
  export type AdapterDescription = string;
  export type AdapterId = string;
  export type AdapterList = AdapterOverview[];
  export type AdapterName = string;
  export interface AdapterOverview {
    /**
     * A unique identifier for the adapter resource.
     */
    AdapterId?: AdapterId;
    /**
     * A string naming the adapter resource.
     */
    AdapterName?: AdapterName;
    /**
     * The date and time that the adapter was created.
     */
    CreationTime?: DateTime;
    /**
     * The feature types that the adapter is operating on.
     */
    FeatureTypes?: FeatureTypes;
  }
  export type AdapterPage = string;
  export type AdapterPages = AdapterPage[];
  export type AdapterVersion = string;
  export interface AdapterVersionDatasetConfig {
    ManifestS3Object?: S3Object;
  }
  export interface AdapterVersionEvaluationMetric {
    /**
     * The F1 score, precision, and recall metrics for the baseline model.
     */
    Baseline?: EvaluationMetric;
    /**
     * The F1 score, precision, and recall metrics for the baseline model.
     */
    AdapterVersion?: EvaluationMetric;
    /**
     * Indicates the feature type being analyzed by a given adapter version.
     */
    FeatureType?: FeatureType;
  }
  export type AdapterVersionEvaluationMetrics = AdapterVersionEvaluationMetric[];
  export type AdapterVersionList = AdapterVersionOverview[];
  export interface AdapterVersionOverview {
    /**
     * A unique identifier for the adapter associated with a given adapter version.
     */
    AdapterId?: AdapterId;
    /**
     * An identified for a given adapter version.
     */
    AdapterVersion?: AdapterVersion;
    /**
     * The date and time that a given adapter version was created.
     */
    CreationTime?: DateTime;
    /**
     * The feature types that the adapter version is operating on.
     */
    FeatureTypes?: FeatureTypes;
    /**
     * Contains information on the status of a given adapter version.
     */
    Status?: AdapterVersionStatus;
    /**
     * A message explaining the status of a given adapter vesion.
     */
    StatusMessage?: AdapterVersionStatusMessage;
  }
  export type AdapterVersionStatus = "ACTIVE"|"AT_RISK"|"DEPRECATED"|"CREATION_ERROR"|"CREATION_IN_PROGRESS"|string;
  export type AdapterVersionStatusMessage = string;
  export type Adapters = Adapter[];
  export interface AdaptersConfig {
    /**
     * A list of adapters to be used when analyzing the specified document.
     */
    Adapters: Adapters;
  }
  export type AmazonResourceName = string;
  export interface AnalyzeDocumentRequest {
    /**
     * The input document as base64-encoded bytes or an Amazon S3 object. If you use the AWS CLI to call Amazon Textract operations, you can't pass image bytes. The document must be an image in JPEG, PNG, PDF, or TIFF format. If you're using an AWS SDK to call Amazon Textract, you might not need to base64-encode image bytes that are passed using the Bytes field. 
     */
    Document: Document;
    /**
     * A list of the types of analysis to perform. Add TABLES to the list to return information about the tables that are detected in the input document. Add FORMS to return detected form data. Add SIGNATURES to return the locations of detected signatures. Add LAYOUT to the list to return information about the layout of the document. All lines and words detected in the document are included in the response (including text that isn't related to the value of FeatureTypes). 
     */
    FeatureTypes: FeatureTypes;
    /**
     * Sets the configuration for the human in the loop workflow for analyzing documents.
     */
    HumanLoopConfig?: HumanLoopConfig;
    /**
     * Contains Queries and the alias for those Queries, as determined by the input. 
     */
    QueriesConfig?: QueriesConfig;
    /**
     * Specifies the adapter to be used when analyzing a document.
     */
    AdaptersConfig?: AdaptersConfig;
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
  export interface AnalyzeIDDetections {
    /**
     * Text of either the normalized field or value associated with it.
     */
    Text: String;
    /**
     * Only returned for dates, returns the type of value detected and the date written in a more machine readable way.
     */
    NormalizedValue?: NormalizedValue;
    /**
     * The confidence score of the detected text.
     */
    Confidence?: Percent;
  }
  export interface AnalyzeIDRequest {
    /**
     * The document being passed to AnalyzeID.
     */
    DocumentPages: DocumentPages;
  }
  export interface AnalyzeIDResponse {
    /**
     * The list of documents processed by AnalyzeID. Includes a number denoting their place in the list and the response structure for the document.
     */
    IdentityDocuments?: IdentityDocumentList;
    DocumentMetadata?: DocumentMetadata;
    /**
     * The version of the AnalyzeIdentity API being used to process documents.
     */
    AnalyzeIDModelVersion?: String;
  }
  export type AutoUpdate = "ENABLED"|"DISABLED"|string;
  export interface Block {
    /**
     * The type of text item that's recognized. In operations for text detection, the following types are returned:    PAGE - Contains a list of the LINE Block objects that are detected on a document page.    WORD - A word detected on a document page. A word is one or more ISO basic Latin script characters that aren't separated by spaces.    LINE - A string of tab-delimited, contiguous words that are detected on a document page.   In text analysis operations, the following types are returned:    PAGE - Contains a list of child Block objects that are detected on a document page.    KEY_VALUE_SET - Stores the KEY and VALUE Block objects for linked text that's detected on a document page. Use the EntityType field to determine if a KEY_VALUE_SET object is a KEY Block object or a VALUE Block object.     WORD - A word that's detected on a document page. A word is one or more ISO basic Latin script characters that aren't separated by spaces.    LINE - A string of tab-delimited, contiguous words that are detected on a document page.    TABLE - A table that's detected on a document page. A table is grid-based information with two or more rows or columns, with a cell span of one row and one column each.     TABLE_TITLE - The title of a table. A title is typically a line of text above or below a table, or embedded as the first row of a table.     TABLE_FOOTER - The footer associated with a table. A footer is typically a line or lines of text below a table or embedded as the last row of a table.     CELL - A cell within a detected table. The cell is the parent of the block that contains the text in the cell.    MERGED_CELL - A cell in a table whose content spans more than one row or column. The Relationships array for this cell contain data from individual cells.    SELECTION_ELEMENT - A selection element such as an option button (radio button) or a check box that's detected on a document page. Use the value of SelectionStatus to determine the status of the selection element.    SIGNATURE - The location and confidence score of a signature detected on a document page. Can be returned as part of a Key-Value pair or a detected cell.    QUERY - A question asked during the call of AnalyzeDocument. Contains an alias and an ID that attaches it to its answer.    QUERY_RESULT - A response to a question asked during the call of analyze document. Comes with an alias and ID for ease of locating in a response. Also contains location and confidence score.   The following BlockTypes are only returned for Amazon Textract Layout.    LAYOUT_TITLE - The main title of the document.    LAYOUT_HEADER - Text located in the top margin of the document.    LAYOUT_FOOTER - Text located in the bottom margin of the document.    LAYOUT_SECTION_HEADER - The titles of sections within a document.    LAYOUT_PAGE_NUMBER - The page number of the documents.    LAYOUT_LIST - Any information grouped together in list form.     LAYOUT_FIGURE - Indicates the location of an image in a document.    LAYOUT_TABLE - Indicates the location of a table in the document.    LAYOUT_KEY_VALUE - Indicates the location of form key-values in a document.    LAYOUT_TEXT - Text that is present typically as a part of paragraphs in documents.  
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
     * The number of rows that a table cell spans. RowSpan isn't returned by DetectDocumentText and GetDocumentTextDetection.
     */
    RowSpan?: UInteger;
    /**
     * The number of columns that a table cell spans. ColumnSpan isn't returned by DetectDocumentText and GetDocumentTextDetection. 
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
     * A list of relationship objects that describe how blocks are related to each other. For example, a LINE block object contains a CHILD relationship type with the WORD blocks that make up the line of text. There aren't Relationship objects in the list for relationships that don't exist, such as when the current block has no child blocks.
     */
    Relationships?: RelationshipList;
    /**
     * The type of entity.  The following entity types can be returned by FORMS analysis:    KEY - An identifier for a field on the document.    VALUE - The field text.   The following entity types can be returned by TABLES analysis:    COLUMN_HEADER - Identifies a cell that is a header of a column.     TABLE_TITLE - Identifies a cell that is a title within the table.     TABLE_SECTION_TITLE - Identifies a cell that is a title of a section within a table. A section title is a cell that typically spans an entire row above a section.     TABLE_FOOTER - Identifies a cell that is a footer of a table.     TABLE_SUMMARY - Identifies a summary cell of a table. A summary cell can be a row of a table or an additional, smaller table that contains summary information for another table.     STRUCTURED_TABLE  - Identifies a table with column headers where the content of each row corresponds to the headers.     SEMI_STRUCTURED_TABLE - Identifies a non-structured table.     EntityTypes isn't returned by DetectDocumentText and GetDocumentTextDetection.
     */
    EntityTypes?: EntityTypes;
    /**
     * The selection status of a selection element, such as an option button or check box. 
     */
    SelectionStatus?: SelectionStatus;
    /**
     * The page on which a block was detected. Page is returned by synchronous and asynchronous operations. Page values greater than 1 are only returned for multipage documents that are in PDF or TIFF format. A scanned image (JPEG/PNG) provided to an asynchronous operation, even if it contains multiple document pages, is considered a single-page document. This means that for scanned images the value of Page is always 1. 
     */
    Page?: UInteger;
    /**
     * 
     */
    Query?: Query;
  }
  export type BlockList = Block[];
  export type BlockType = "KEY_VALUE_SET"|"PAGE"|"LINE"|"WORD"|"TABLE"|"CELL"|"SELECTION_ELEMENT"|"MERGED_CELL"|"TITLE"|"QUERY"|"QUERY_RESULT"|"SIGNATURE"|"TABLE_TITLE"|"TABLE_FOOTER"|"LAYOUT_TEXT"|"LAYOUT_TITLE"|"LAYOUT_HEADER"|"LAYOUT_FOOTER"|"LAYOUT_SECTION_HEADER"|"LAYOUT_PAGE_NUMBER"|"LAYOUT_LIST"|"LAYOUT_FIGURE"|"LAYOUT_TABLE"|"LAYOUT_KEY_VALUE"|string;
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
  export interface CreateAdapterRequest {
    /**
     * The name to be assigned to the adapter being created.
     */
    AdapterName: AdapterName;
    /**
     * Idempotent token is used to recognize the request. If the same token is used with multiple CreateAdapter requests, the same session is returned. This token is employed to avoid unintentionally creating the same session multiple times.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The description to be assigned to the adapter being created.
     */
    Description?: AdapterDescription;
    /**
     * The type of feature that the adapter is being trained on. Currrenly, supported feature types are: QUERIES 
     */
    FeatureTypes: FeatureTypes;
    /**
     * Controls whether or not the adapter should automatically update.
     */
    AutoUpdate?: AutoUpdate;
    /**
     * A list of tags to be added to the adapter.
     */
    Tags?: TagMap;
  }
  export interface CreateAdapterResponse {
    /**
     * A string containing the unique ID for the adapter that has been created.
     */
    AdapterId?: AdapterId;
  }
  export interface CreateAdapterVersionRequest {
    /**
     * A string containing a unique ID for the adapter that will receive a new version.
     */
    AdapterId: AdapterId;
    /**
     * Idempotent token is used to recognize the request. If the same token is used with multiple CreateAdapterVersion requests, the same session is returned. This token is employed to avoid unintentionally creating the same session multiple times.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * Specifies a dataset used to train a new adapter version. Takes a ManifestS3Object as the value.
     */
    DatasetConfig: AdapterVersionDatasetConfig;
    /**
     * The identifier for your AWS Key Management Service key (AWS KMS key). Used to encrypt your documents.
     */
    KMSKeyId?: KMSKeyId;
    OutputConfig: OutputConfig;
    /**
     * A set of tags (key-value pairs) that you want to attach to the adapter version. 
     */
    Tags?: TagMap;
  }
  export interface CreateAdapterVersionResponse {
    /**
     * A string containing the unique ID for the adapter that has received a new version.
     */
    AdapterId?: AdapterId;
    /**
     * A string describing the new version of the adapter.
     */
    AdapterVersion?: AdapterVersion;
  }
  export type DateTime = Date;
  export interface DeleteAdapterRequest {
    /**
     * A string containing a unique ID for the adapter to be deleted.
     */
    AdapterId: AdapterId;
  }
  export interface DeleteAdapterResponse {
  }
  export interface DeleteAdapterVersionRequest {
    /**
     * A string containing a unique ID for the adapter version that will be deleted.
     */
    AdapterId: AdapterId;
    /**
     * Specifies the adapter version to be deleted.
     */
    AdapterVersion: AdapterVersion;
  }
  export interface DeleteAdapterVersionResponse {
  }
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
  export interface DetectedSignature {
    /**
     * The page a detected signature was found on.
     */
    Page?: UInteger;
  }
  export type DetectedSignatureList = DetectedSignature[];
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
  export interface DocumentGroup {
    /**
     * The type of document that Amazon Textract has detected. See Analyze Lending Response Objects for a list of all types returned by Textract.
     */
    Type?: NonEmptyString;
    /**
     * An array that contains information about the pages of a document, defined by logical boundary.
     */
    SplitDocuments?: SplitDocumentList;
    /**
     * A list of the detected signatures found in a document group.
     */
    DetectedSignatures?: DetectedSignatureList;
    /**
     * A list of any expected signatures not found in a document group.
     */
    UndetectedSignatures?: UndetectedSignatureList;
  }
  export type DocumentGroupList = DocumentGroup[];
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
  export type DocumentPages = Document[];
  export type EntityType = "KEY"|"VALUE"|"COLUMN_HEADER"|"TABLE_TITLE"|"TABLE_FOOTER"|"TABLE_SECTION_TITLE"|"TABLE_SUMMARY"|"STRUCTURED_TABLE"|"SEMI_STRUCTURED_TABLE"|string;
  export type EntityTypes = EntityType[];
  export type ErrorCode = string;
  export interface EvaluationMetric {
    /**
     * The F1 score for an adapter version.
     */
    F1Score?: Float;
    /**
     * The Precision score for an adapter version.
     */
    Precision?: Float;
    /**
     * The Recall score for an adapter version.
     */
    Recall?: Float;
  }
  export interface ExpenseCurrency {
    /**
     * Currency code for detected currency. the current supported codes are:   USD   EUR   GBP   CAD   INR   JPY   CHF   AUD   CNY   BZR   SEK   HKD  
     */
    Code?: String;
    /**
     * Percentage confideence in the detected currency.
     */
    Confidence?: Percent;
  }
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
    /**
     * This is a block object, the same as reported when DetectDocumentText is run on a document. It provides word level recognition of text.
     */
    Blocks?: BlockList;
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
    /**
     * Shows the kind of currency, both the code and confidence associated with any monatary value detected.
     */
    Currency?: ExpenseCurrency;
    /**
     * Shows which group a response object belongs to, such as whether an address line belongs to the vendor's address or the recipent's address.
     */
    GroupProperties?: ExpenseGroupPropertyList;
  }
  export type ExpenseFieldList = ExpenseField[];
  export interface ExpenseGroupProperty {
    /**
     * Informs you on whether the expense group is a name or an address.
     */
    Types?: StringList;
    /**
     * Provides a group Id number, which will be the same for each in the group.
     */
    Id?: String;
  }
  export type ExpenseGroupPropertyList = ExpenseGroupProperty[];
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
  export interface Extraction {
    /**
     * Holds the structured data returned by AnalyzeDocument for lending documents.
     */
    LendingDocument?: LendingDocument;
    ExpenseDocument?: ExpenseDocument;
    IdentityDocument?: IdentityDocument;
  }
  export type ExtractionList = Extraction[];
  export type FeatureType = "TABLES"|"FORMS"|"QUERIES"|"SIGNATURES"|"LAYOUT"|string;
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
  export interface GetAdapterRequest {
    /**
     * A string containing a unique ID for the adapter.
     */
    AdapterId: AdapterId;
  }
  export interface GetAdapterResponse {
    /**
     * A string identifying the adapter that information has been retrieved for.
     */
    AdapterId?: AdapterId;
    /**
     * The name of the requested adapter.
     */
    AdapterName?: AdapterName;
    /**
     * The date and time the requested adapter was created at.
     */
    CreationTime?: DateTime;
    /**
     * The description for the requested adapter.
     */
    Description?: AdapterDescription;
    /**
     * List of the targeted feature types for the requested adapter.
     */
    FeatureTypes?: FeatureTypes;
    /**
     * Binary value indicating if the adapter is being automatically updated or not.
     */
    AutoUpdate?: AutoUpdate;
    /**
     * A set of tags (key-value pairs) associated with the adapter that has been retrieved.
     */
    Tags?: TagMap;
  }
  export interface GetAdapterVersionRequest {
    /**
     * A string specifying a unique ID for the adapter version you want to retrieve information for.
     */
    AdapterId: AdapterId;
    /**
     * A string specifying the adapter version you want to retrieve information for.
     */
    AdapterVersion: AdapterVersion;
  }
  export interface GetAdapterVersionResponse {
    /**
     * A string containing a unique ID for the adapter version being retrieved.
     */
    AdapterId?: AdapterId;
    /**
     * A string containing the adapter version that has been retrieved.
     */
    AdapterVersion?: AdapterVersion;
    /**
     * The time that the adapter version was created.
     */
    CreationTime?: DateTime;
    /**
     * List of the targeted feature types for the requested adapter version.
     */
    FeatureTypes?: FeatureTypes;
    /**
     * The status of the adapter version that has been requested.
     */
    Status?: AdapterVersionStatus;
    /**
     * A message that describes the status of the requested adapter version.
     */
    StatusMessage?: AdapterVersionStatusMessage;
    /**
     * Specifies a dataset used to train a new adapter version. Takes a ManifestS3Objec as the value.
     */
    DatasetConfig?: AdapterVersionDatasetConfig;
    /**
     * The identifier for your AWS Key Management Service key (AWS KMS key). Used to encrypt your documents.
     */
    KMSKeyId?: KMSKeyId;
    OutputConfig?: OutputConfig;
    /**
     * The evaluation metrics (F1 score, Precision, and Recall) for the requested version, grouped by baseline metrics and adapter version.
     */
    EvaluationMetrics?: AdapterVersionEvaluationMetrics;
    /**
     * A set of tags (key-value pairs) that are associated with the adapter version.
     */
    Tags?: TagMap;
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
  export interface GetLendingAnalysisRequest {
    /**
     * A unique identifier for the lending or text-detection job. The JobId is returned from StartLendingAnalysis. A JobId value is only valid for 7 days.
     */
    JobId: JobId;
    /**
     * The maximum number of results to return per paginated call. The largest value that you can specify is 30. If you specify a value greater than 30, a maximum of 30 results is returned. The default value is 30.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete, Amazon Textract returns a pagination token in the response. You can use this pagination token to retrieve the next set of lending results.
     */
    NextToken?: PaginationToken;
  }
  export interface GetLendingAnalysisResponse {
    DocumentMetadata?: DocumentMetadata;
    /**
     *  The current status of the lending analysis job.
     */
    JobStatus?: JobStatus;
    /**
     * If the response is truncated, Amazon Textract returns this token. You can use this token in the subsequent request to retrieve the next set of lending results.
     */
    NextToken?: PaginationToken;
    /**
     *  Holds the information returned by one of AmazonTextract's document analysis operations for the pinstripe.
     */
    Results?: LendingResultList;
    /**
     *  A list of warnings that occurred during the lending analysis operation. 
     */
    Warnings?: Warnings;
    /**
     *  Returns if the lending analysis job could not be completed. Contains explanation for what error occurred. 
     */
    StatusMessage?: StatusMessage;
    /**
     *  The current model version of the Analyze Lending API.
     */
    AnalyzeLendingModelVersion?: String;
  }
  export interface GetLendingAnalysisSummaryRequest {
    /**
     *  A unique identifier for the lending or text-detection job. The JobId is returned from StartLendingAnalysis. A JobId value is only valid for 7 days.
     */
    JobId: JobId;
  }
  export interface GetLendingAnalysisSummaryResponse {
    DocumentMetadata?: DocumentMetadata;
    /**
     *  The current status of the lending analysis job. 
     */
    JobStatus?: JobStatus;
    /**
     *  Contains summary information for documents grouped by type.
     */
    Summary?: LendingSummary;
    /**
     * A list of warnings that occurred during the lending analysis operation.
     */
    Warnings?: Warnings;
    /**
     * Returns if the lending analysis could not be completed. Contains explanation for what error occurred.
     */
    StatusMessage?: StatusMessage;
    /**
     * The current model version of the Analyze Lending API.
     */
    AnalyzeLendingModelVersion?: String;
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
  export interface IdentityDocument {
    /**
     * Denotes the placement of a document in the IdentityDocument list. The first document is marked 1, the second 2 and so on.
     */
    DocumentIndex?: UInteger;
    /**
     * The structure used to record information extracted from identity documents. Contains both normalized field and value of the extracted text.
     */
    IdentityDocumentFields?: IdentityDocumentFieldList;
    /**
     * Individual word recognition, as returned by document detection.
     */
    Blocks?: BlockList;
  }
  export interface IdentityDocumentField {
    Type?: AnalyzeIDDetections;
    ValueDetection?: AnalyzeIDDetections;
  }
  export type IdentityDocumentFieldList = IdentityDocumentField[];
  export type IdentityDocumentList = IdentityDocument[];
  export type ImageBlob = Buffer|Uint8Array|Blob|string;
  export type JobId = string;
  export type JobStatus = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|"PARTIAL_SUCCESS"|string;
  export type JobTag = string;
  export type KMSKeyId = string;
  export interface LendingDetection {
    /**
     * The text extracted for a detected value in a lending document.
     */
    Text?: String;
    /**
     * The selection status of a selection element, such as an option button or check box.
     */
    SelectionStatus?: SelectionStatus;
    Geometry?: Geometry;
    /**
     * The confidence level for the text of a detected value in a lending document.
     */
    Confidence?: Percent;
  }
  export type LendingDetectionList = LendingDetection[];
  export interface LendingDocument {
    /**
     * An array of LendingField objects.
     */
    LendingFields?: LendingFieldList;
    /**
     * A list of signatures detected in a lending document.
     */
    SignatureDetections?: SignatureDetectionList;
  }
  export interface LendingField {
    /**
     * The type of the lending document.
     */
    Type?: String;
    KeyDetection?: LendingDetection;
    /**
     * An array of LendingDetection objects.
     */
    ValueDetections?: LendingDetectionList;
  }
  export type LendingFieldList = LendingField[];
  export interface LendingResult {
    /**
     * The page number for a page, with regard to whole submission.
     */
    Page?: UInteger;
    /**
     * The classifier result for a given page.
     */
    PageClassification?: PageClassification;
    /**
     * An array of Extraction to hold structured data. e.g. normalized key value pairs instead of raw OCR detections .
     */
    Extractions?: ExtractionList;
  }
  export type LendingResultList = LendingResult[];
  export interface LendingSummary {
    /**
     * Contains an array of all DocumentGroup objects.
     */
    DocumentGroups?: DocumentGroupList;
    /**
     * UndetectedDocumentTypes.
     */
    UndetectedDocumentTypes?: UndetectedDocumentTypeList;
  }
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
  export interface ListAdapterVersionsRequest {
    /**
     * A string containing a unique ID for the adapter to match for when listing adapter versions.
     */
    AdapterId?: AdapterId;
    /**
     * Specifies the lower bound for the ListAdapterVersions operation. Ensures ListAdapterVersions returns only adapter versions created after the specified creation time.
     */
    AfterCreationTime?: DateTime;
    /**
     * Specifies the upper bound for the ListAdapterVersions operation. Ensures ListAdapterVersions returns only adapter versions created after the specified creation time.
     */
    BeforeCreationTime?: DateTime;
    /**
     * The maximum number of results to return when listing adapter versions.
     */
    MaxResults?: MaxResults;
    /**
     * Identifies the next page of results to return when listing adapter versions.
     */
    NextToken?: PaginationToken;
  }
  export interface ListAdapterVersionsResponse {
    /**
     * Adapter versions that match the filtering criteria specified when calling ListAdapters.
     */
    AdapterVersions?: AdapterVersionList;
    /**
     * Identifies the next page of results to return when listing adapter versions.
     */
    NextToken?: PaginationToken;
  }
  export interface ListAdaptersRequest {
    /**
     * Specifies the lower bound for the ListAdapters operation. Ensures ListAdapters returns only adapters created after the specified creation time.
     */
    AfterCreationTime?: DateTime;
    /**
     * Specifies the upper bound for the ListAdapters operation. Ensures ListAdapters returns only adapters created before the specified creation time.
     */
    BeforeCreationTime?: DateTime;
    /**
     * The maximum number of results to return when listing adapters.
     */
    MaxResults?: MaxResults;
    /**
     * Identifies the next page of results to return when listing adapters.
     */
    NextToken?: PaginationToken;
  }
  export interface ListAdaptersResponse {
    /**
     * A list of adapters that matches the filtering criteria specified when calling ListAdapters.
     */
    Adapters?: AdapterList;
    /**
     * Identifies the next page of results to return when listing adapters.
     */
    NextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that specifies the resource to list tags for.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A set of tags (key-value pairs) that are part of the requested resource.
     */
    Tags?: TagMap;
  }
  export type MaxResults = number;
  export type NonEmptyString = string;
  export interface NormalizedValue {
    /**
     * The value of the date, written as Year-Month-DayTHour:Minute:Second.
     */
    Value?: String;
    /**
     * The normalized type of the value detected. In this case, DATE.
     */
    ValueType?: ValueType;
  }
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
  export interface PageClassification {
    /**
     * The class, or document type, assigned to a detected Page object. The class, or document type, assigned to a detected Page object.
     */
    PageType: PredictionList;
    /**
     *  The page number the value was detected on, relative to Amazon Textract's starting position.
     */
    PageNumber: PredictionList;
  }
  export type PageList = UInteger[];
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
  export interface Prediction {
    /**
     * The predicted value of a detected object.
     */
    Value?: NonEmptyString;
    /**
     * Amazon Textract's confidence in its predicted value.
     */
    Confidence?: Percent;
  }
  export type PredictionList = Prediction[];
  export type Queries = Query[];
  export interface QueriesConfig {
    /**
     * 
     */
    Queries: Queries;
  }
  export interface Query {
    /**
     * Question that Amazon Textract will apply to the document. An example would be "What is the customer's SSN?"
     */
    Text: QueryInput;
    /**
     * Alias attached to the query, for ease of location.
     */
    Alias?: QueryInput;
    /**
     * Pages is a parameter that the user inputs to specify which pages to apply a query to. The following is a list of rules for using this parameter.   If a page is not specified, it is set to ["1"] by default.   The following characters are allowed in the parameter's string: 0 1 2 3 4 5 6 7 8 9 - *. No whitespace is allowed.   When using * to indicate all pages, it must be the only element in the list.   You can use page intervals, such as [“1-3”, “1-1”, “4-*”]. Where * indicates last page of document.   Specified pages must be greater than 0 and less than or equal to the number of pages in the document.  
     */
    Pages?: QueryPages;
  }
  export type QueryInput = string;
  export type QueryPage = string;
  export type QueryPages = QueryPage[];
  export interface Relationship {
    /**
     * The type of relationship between the blocks in the IDs array and the current block. The following list describes the relationship types that can be returned.     VALUE - A list that contains the ID of the VALUE block that's associated with the KEY of a key-value pair.    CHILD - A list of IDs that identify blocks found within the current block object. For example, WORD blocks have a CHILD relationship to the LINE block type.    MERGED_CELL - A list of IDs that identify each of the MERGED_CELL block types in a table.    ANSWER - A list that contains the ID of the QUERY_RESULT block that’s associated with the corresponding QUERY block.     TABLE - A list of IDs that identify associated TABLE block types.     TABLE_TITLE - A list that contains the ID for the TABLE_TITLE block type in a table.     TABLE_FOOTER - A list of IDs that identify the TABLE_FOOTER block types in a table.   
     */
    Type?: RelationshipType;
    /**
     * An array of IDs for related blocks. You can get the type of the relationship from the Type element.
     */
    Ids?: IdList;
  }
  export type RelationshipList = Relationship[];
  export type RelationshipType = "VALUE"|"CHILD"|"COMPLEX_FEATURES"|"MERGED_CELL"|"TITLE"|"ANSWER"|"TABLE"|"TABLE_TITLE"|"TABLE_FOOTER"|string;
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
  export interface SignatureDetection {
    /**
     * The confidence, from 0 to 100, in the predicted values for a detected signature.
     */
    Confidence?: Percent;
    Geometry?: Geometry;
  }
  export type SignatureDetectionList = SignatureDetection[];
  export interface SplitDocument {
    /**
     * The index for a given document in a DocumentGroup of a specific Type.
     */
    Index?: UInteger;
    /**
     * An array of page numbers for a for a given document, ordered by logical boundary.
     */
    Pages?: PageList;
  }
  export type SplitDocumentList = SplitDocument[];
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
    QueriesConfig?: QueriesConfig;
    /**
     * Specifies the adapter to be used when analyzing a document.
     */
    AdaptersConfig?: AdaptersConfig;
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
  export interface StartLendingAnalysisRequest {
    DocumentLocation: DocumentLocation;
    /**
     * The idempotent token that you use to identify the start request. If you use the same token with multiple StartLendingAnalysis requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidentally started more than once. For more information, see Calling Amazon Textract Asynchronous Operations.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * An identifier that you specify to be included in the completion notification published to the Amazon SNS topic. For example, you can use JobTag to identify the type of document that the completion notification corresponds to (such as a tax form or a receipt).
     */
    JobTag?: JobTag;
    NotificationChannel?: NotificationChannel;
    OutputConfig?: OutputConfig;
    /**
     * The KMS key used to encrypt the inference results. This can be in either Key ID or Key Alias format. When a KMS key is provided, the KMS key will be used for server-side encryption of the objects in the customer bucket. When this parameter is not enabled, the result will be encrypted server side, using SSE-S3. 
     */
    KMSKeyId?: KMSKeyId;
  }
  export interface StartLendingAnalysisResponse {
    /**
     * A unique identifier for the lending or text-detection job. The JobId is returned from StartLendingAnalysis. A JobId value is only valid for 7 days.
     */
    JobId?: JobId;
  }
  export type StatusMessage = string;
  export type String = string;
  export type StringList = String[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that specifies the resource to be tagged.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A set of tags (key-value pairs) that you want to assign to the resource.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TextType = "HANDWRITING"|"PRINTED"|string;
  export type UInteger = number;
  export type UndetectedDocumentTypeList = NonEmptyString[];
  export interface UndetectedSignature {
    /**
     * The page where a signature was expected but not found.
     */
    Page?: UInteger;
  }
  export type UndetectedSignatureList = UndetectedSignature[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that specifies the resource to be untagged.
     */
    ResourceARN: AmazonResourceName;
    /**
     * Specifies the tags to be removed from the resource specified by the ResourceARN.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAdapterRequest {
    /**
     * A string containing a unique ID for the adapter that will be updated.
     */
    AdapterId: AdapterId;
    /**
     * The new description to be applied to the adapter.
     */
    Description?: AdapterDescription;
    /**
     * The new name to be applied to the adapter.
     */
    AdapterName?: AdapterName;
    /**
     * The new auto-update status to be applied to the adapter.
     */
    AutoUpdate?: AutoUpdate;
  }
  export interface UpdateAdapterResponse {
    /**
     * A string containing a unique ID for the adapter that has been updated.
     */
    AdapterId?: AdapterId;
    /**
     * A string containing the name of the adapter that has been updated.
     */
    AdapterName?: AdapterName;
    /**
     * An object specifying the creation time of the the adapter that has been updated.
     */
    CreationTime?: DateTime;
    /**
     * A string containing the description of the adapter that has been updated.
     */
    Description?: AdapterDescription;
    /**
     * List of the targeted feature types for the updated adapter.
     */
    FeatureTypes?: FeatureTypes;
    /**
     * The auto-update status of the adapter that has been updated.
     */
    AutoUpdate?: AutoUpdate;
  }
  export type ValueType = "DATE"|string;
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
