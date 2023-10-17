import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Translate extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Translate.Types.ClientConfiguration)
  config: Config & Translate.Types.ClientConfiguration;
  /**
   * Creates a parallel data resource in Amazon Translate by importing an input file from Amazon S3. Parallel data files contain examples that show how you want segments of text to be translated. By adding parallel data, you can influence the style, tone, and word choice in your translation output.
   */
  createParallelData(params: Translate.Types.CreateParallelDataRequest, callback?: (err: AWSError, data: Translate.Types.CreateParallelDataResponse) => void): Request<Translate.Types.CreateParallelDataResponse, AWSError>;
  /**
   * Creates a parallel data resource in Amazon Translate by importing an input file from Amazon S3. Parallel data files contain examples that show how you want segments of text to be translated. By adding parallel data, you can influence the style, tone, and word choice in your translation output.
   */
  createParallelData(callback?: (err: AWSError, data: Translate.Types.CreateParallelDataResponse) => void): Request<Translate.Types.CreateParallelDataResponse, AWSError>;
  /**
   * Deletes a parallel data resource in Amazon Translate.
   */
  deleteParallelData(params: Translate.Types.DeleteParallelDataRequest, callback?: (err: AWSError, data: Translate.Types.DeleteParallelDataResponse) => void): Request<Translate.Types.DeleteParallelDataResponse, AWSError>;
  /**
   * Deletes a parallel data resource in Amazon Translate.
   */
  deleteParallelData(callback?: (err: AWSError, data: Translate.Types.DeleteParallelDataResponse) => void): Request<Translate.Types.DeleteParallelDataResponse, AWSError>;
  /**
   * A synchronous action that deletes a custom terminology.
   */
  deleteTerminology(params: Translate.Types.DeleteTerminologyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * A synchronous action that deletes a custom terminology.
   */
  deleteTerminology(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets the properties associated with an asynchronous batch translation job including name, ID, status, source and target languages, input/output S3 buckets, and so on.
   */
  describeTextTranslationJob(params: Translate.Types.DescribeTextTranslationJobRequest, callback?: (err: AWSError, data: Translate.Types.DescribeTextTranslationJobResponse) => void): Request<Translate.Types.DescribeTextTranslationJobResponse, AWSError>;
  /**
   * Gets the properties associated with an asynchronous batch translation job including name, ID, status, source and target languages, input/output S3 buckets, and so on.
   */
  describeTextTranslationJob(callback?: (err: AWSError, data: Translate.Types.DescribeTextTranslationJobResponse) => void): Request<Translate.Types.DescribeTextTranslationJobResponse, AWSError>;
  /**
   * Provides information about a parallel data resource.
   */
  getParallelData(params: Translate.Types.GetParallelDataRequest, callback?: (err: AWSError, data: Translate.Types.GetParallelDataResponse) => void): Request<Translate.Types.GetParallelDataResponse, AWSError>;
  /**
   * Provides information about a parallel data resource.
   */
  getParallelData(callback?: (err: AWSError, data: Translate.Types.GetParallelDataResponse) => void): Request<Translate.Types.GetParallelDataResponse, AWSError>;
  /**
   * Retrieves a custom terminology.
   */
  getTerminology(params: Translate.Types.GetTerminologyRequest, callback?: (err: AWSError, data: Translate.Types.GetTerminologyResponse) => void): Request<Translate.Types.GetTerminologyResponse, AWSError>;
  /**
   * Retrieves a custom terminology.
   */
  getTerminology(callback?: (err: AWSError, data: Translate.Types.GetTerminologyResponse) => void): Request<Translate.Types.GetTerminologyResponse, AWSError>;
  /**
   * Creates or updates a custom terminology, depending on whether one already exists for the given terminology name. Importing a terminology with the same name as an existing one will merge the terminologies based on the chosen merge strategy. The only supported merge strategy is OVERWRITE, where the imported terminology overwrites the existing terminology of the same name. If you import a terminology that overwrites an existing one, the new terminology takes up to 10 minutes to fully propagate. After that, translations have access to the new terminology.
   */
  importTerminology(params: Translate.Types.ImportTerminologyRequest, callback?: (err: AWSError, data: Translate.Types.ImportTerminologyResponse) => void): Request<Translate.Types.ImportTerminologyResponse, AWSError>;
  /**
   * Creates or updates a custom terminology, depending on whether one already exists for the given terminology name. Importing a terminology with the same name as an existing one will merge the terminologies based on the chosen merge strategy. The only supported merge strategy is OVERWRITE, where the imported terminology overwrites the existing terminology of the same name. If you import a terminology that overwrites an existing one, the new terminology takes up to 10 minutes to fully propagate. After that, translations have access to the new terminology.
   */
  importTerminology(callback?: (err: AWSError, data: Translate.Types.ImportTerminologyResponse) => void): Request<Translate.Types.ImportTerminologyResponse, AWSError>;
  /**
   * Provides a list of languages (RFC-5646 codes and names) that Amazon Translate supports.
   */
  listLanguages(params: Translate.Types.ListLanguagesRequest, callback?: (err: AWSError, data: Translate.Types.ListLanguagesResponse) => void): Request<Translate.Types.ListLanguagesResponse, AWSError>;
  /**
   * Provides a list of languages (RFC-5646 codes and names) that Amazon Translate supports.
   */
  listLanguages(callback?: (err: AWSError, data: Translate.Types.ListLanguagesResponse) => void): Request<Translate.Types.ListLanguagesResponse, AWSError>;
  /**
   * Provides a list of your parallel data resources in Amazon Translate.
   */
  listParallelData(params: Translate.Types.ListParallelDataRequest, callback?: (err: AWSError, data: Translate.Types.ListParallelDataResponse) => void): Request<Translate.Types.ListParallelDataResponse, AWSError>;
  /**
   * Provides a list of your parallel data resources in Amazon Translate.
   */
  listParallelData(callback?: (err: AWSError, data: Translate.Types.ListParallelDataResponse) => void): Request<Translate.Types.ListParallelDataResponse, AWSError>;
  /**
   * Lists all tags associated with a given Amazon Translate resource. For more information, see  Tagging your resources.
   */
  listTagsForResource(params: Translate.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Translate.Types.ListTagsForResourceResponse) => void): Request<Translate.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags associated with a given Amazon Translate resource. For more information, see  Tagging your resources.
   */
  listTagsForResource(callback?: (err: AWSError, data: Translate.Types.ListTagsForResourceResponse) => void): Request<Translate.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Provides a list of custom terminologies associated with your account.
   */
  listTerminologies(params: Translate.Types.ListTerminologiesRequest, callback?: (err: AWSError, data: Translate.Types.ListTerminologiesResponse) => void): Request<Translate.Types.ListTerminologiesResponse, AWSError>;
  /**
   * Provides a list of custom terminologies associated with your account.
   */
  listTerminologies(callback?: (err: AWSError, data: Translate.Types.ListTerminologiesResponse) => void): Request<Translate.Types.ListTerminologiesResponse, AWSError>;
  /**
   * Gets a list of the batch translation jobs that you have submitted.
   */
  listTextTranslationJobs(params: Translate.Types.ListTextTranslationJobsRequest, callback?: (err: AWSError, data: Translate.Types.ListTextTranslationJobsResponse) => void): Request<Translate.Types.ListTextTranslationJobsResponse, AWSError>;
  /**
   * Gets a list of the batch translation jobs that you have submitted.
   */
  listTextTranslationJobs(callback?: (err: AWSError, data: Translate.Types.ListTextTranslationJobsResponse) => void): Request<Translate.Types.ListTextTranslationJobsResponse, AWSError>;
  /**
   * Starts an asynchronous batch translation job. Use batch translation jobs to translate large volumes of text across multiple documents at once. For batch translation, you can input documents with different source languages (specify auto as the source language). You can specify one or more target languages. Batch translation translates each input document into each of the target languages. For more information, see Asynchronous batch processing. Batch translation jobs can be described with the DescribeTextTranslationJob operation, listed with the ListTextTranslationJobs operation, and stopped with the StopTextTranslationJob operation.
   */
  startTextTranslationJob(params: Translate.Types.StartTextTranslationJobRequest, callback?: (err: AWSError, data: Translate.Types.StartTextTranslationJobResponse) => void): Request<Translate.Types.StartTextTranslationJobResponse, AWSError>;
  /**
   * Starts an asynchronous batch translation job. Use batch translation jobs to translate large volumes of text across multiple documents at once. For batch translation, you can input documents with different source languages (specify auto as the source language). You can specify one or more target languages. Batch translation translates each input document into each of the target languages. For more information, see Asynchronous batch processing. Batch translation jobs can be described with the DescribeTextTranslationJob operation, listed with the ListTextTranslationJobs operation, and stopped with the StopTextTranslationJob operation.
   */
  startTextTranslationJob(callback?: (err: AWSError, data: Translate.Types.StartTextTranslationJobResponse) => void): Request<Translate.Types.StartTextTranslationJobResponse, AWSError>;
  /**
   * Stops an asynchronous batch translation job that is in progress. If the job's state is IN_PROGRESS, the job will be marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state. Otherwise, the job is put into the STOPPED state. Asynchronous batch translation jobs are started with the StartTextTranslationJob operation. You can use the DescribeTextTranslationJob or ListTextTranslationJobs operations to get a batch translation job's JobId.
   */
  stopTextTranslationJob(params: Translate.Types.StopTextTranslationJobRequest, callback?: (err: AWSError, data: Translate.Types.StopTextTranslationJobResponse) => void): Request<Translate.Types.StopTextTranslationJobResponse, AWSError>;
  /**
   * Stops an asynchronous batch translation job that is in progress. If the job's state is IN_PROGRESS, the job will be marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state. Otherwise, the job is put into the STOPPED state. Asynchronous batch translation jobs are started with the StartTextTranslationJob operation. You can use the DescribeTextTranslationJob or ListTextTranslationJobs operations to get a batch translation job's JobId.
   */
  stopTextTranslationJob(callback?: (err: AWSError, data: Translate.Types.StopTextTranslationJobResponse) => void): Request<Translate.Types.StopTextTranslationJobResponse, AWSError>;
  /**
   * Associates a specific tag with a resource. A tag is a key-value pair that adds as a metadata to a resource. For more information, see  Tagging your resources.
   */
  tagResource(params: Translate.Types.TagResourceRequest, callback?: (err: AWSError, data: Translate.Types.TagResourceResponse) => void): Request<Translate.Types.TagResourceResponse, AWSError>;
  /**
   * Associates a specific tag with a resource. A tag is a key-value pair that adds as a metadata to a resource. For more information, see  Tagging your resources.
   */
  tagResource(callback?: (err: AWSError, data: Translate.Types.TagResourceResponse) => void): Request<Translate.Types.TagResourceResponse, AWSError>;
  /**
   * Translates the input document from the source language to the target language. This synchronous operation supports plain text or HTML for the input document. TranslateDocument supports translations from English to any supported language, and from any supported language to English. Therefore, specify either the source language code or the target language code as “en” (English).   TranslateDocument does not support language auto-detection.   If you set the Formality parameter, the request will fail if the target language does not support formality. For a list of target languages that support formality, see Setting formality. 
   */
  translateDocument(params: Translate.Types.TranslateDocumentRequest, callback?: (err: AWSError, data: Translate.Types.TranslateDocumentResponse) => void): Request<Translate.Types.TranslateDocumentResponse, AWSError>;
  /**
   * Translates the input document from the source language to the target language. This synchronous operation supports plain text or HTML for the input document. TranslateDocument supports translations from English to any supported language, and from any supported language to English. Therefore, specify either the source language code or the target language code as “en” (English).   TranslateDocument does not support language auto-detection.   If you set the Formality parameter, the request will fail if the target language does not support formality. For a list of target languages that support formality, see Setting formality. 
   */
  translateDocument(callback?: (err: AWSError, data: Translate.Types.TranslateDocumentResponse) => void): Request<Translate.Types.TranslateDocumentResponse, AWSError>;
  /**
   * Translates input text from the source language to the target language. For a list of available languages and language codes, see Supported languages.
   */
  translateText(params: Translate.Types.TranslateTextRequest, callback?: (err: AWSError, data: Translate.Types.TranslateTextResponse) => void): Request<Translate.Types.TranslateTextResponse, AWSError>;
  /**
   * Translates input text from the source language to the target language. For a list of available languages and language codes, see Supported languages.
   */
  translateText(callback?: (err: AWSError, data: Translate.Types.TranslateTextResponse) => void): Request<Translate.Types.TranslateTextResponse, AWSError>;
  /**
   * Removes a specific tag associated with an Amazon Translate resource. For more information, see  Tagging your resources.
   */
  untagResource(params: Translate.Types.UntagResourceRequest, callback?: (err: AWSError, data: Translate.Types.UntagResourceResponse) => void): Request<Translate.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a specific tag associated with an Amazon Translate resource. For more information, see  Tagging your resources.
   */
  untagResource(callback?: (err: AWSError, data: Translate.Types.UntagResourceResponse) => void): Request<Translate.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a previously created parallel data resource by importing a new input file from Amazon S3.
   */
  updateParallelData(params: Translate.Types.UpdateParallelDataRequest, callback?: (err: AWSError, data: Translate.Types.UpdateParallelDataResponse) => void): Request<Translate.Types.UpdateParallelDataResponse, AWSError>;
  /**
   * Updates a previously created parallel data resource by importing a new input file from Amazon S3.
   */
  updateParallelData(callback?: (err: AWSError, data: Translate.Types.UpdateParallelDataResponse) => void): Request<Translate.Types.UpdateParallelDataResponse, AWSError>;
}
declare namespace Translate {
  export interface AppliedTerminology {
    /**
     * The name of the custom terminology applied to the input text by Amazon Translate for the translated text response.
     */
    Name?: ResourceName;
    /**
     * The specific terms of the custom terminology applied to the input text by Amazon Translate for the translated text response. A maximum of 250 terms will be returned, and the specific terms applied will be the first 250 terms in the source text. 
     */
    Terms?: TermList;
  }
  export type AppliedTerminologyList = AppliedTerminology[];
  export type BoundedLengthString = string;
  export type ClientTokenString = string;
  export type ContentType = string;
  export interface CreateParallelDataRequest {
    /**
     * A custom name for the parallel data resource in Amazon Translate. You must assign a name that is unique in the account and region.
     */
    Name: ResourceName;
    /**
     * A custom description for the parallel data resource in Amazon Translate.
     */
    Description?: Description;
    /**
     * Specifies the format and S3 location of the parallel data input file.
     */
    ParallelDataConfig: ParallelDataConfig;
    EncryptionKey?: EncryptionKey;
    /**
     * A unique identifier for the request. This token is automatically generated when you use Amazon Translate through an AWS SDK.
     */
    ClientToken: ClientTokenString;
    /**
     * Tags to be associated with this resource. A tag is a key-value pair that adds metadata to a resource. Each tag key for the resource must be unique. For more information, see  Tagging your resources.
     */
    Tags?: TagList;
  }
  export interface CreateParallelDataResponse {
    /**
     * The custom name that you assigned to the parallel data resource.
     */
    Name?: ResourceName;
    /**
     * The status of the parallel data resource. When the resource is ready for you to use, the status is ACTIVE.
     */
    Status?: ParallelDataStatus;
  }
  export interface DeleteParallelDataRequest {
    /**
     * The name of the parallel data resource that is being deleted.
     */
    Name: ResourceName;
  }
  export interface DeleteParallelDataResponse {
    /**
     * The name of the parallel data resource that is being deleted.
     */
    Name?: ResourceName;
    /**
     * The status of the parallel data deletion.
     */
    Status?: ParallelDataStatus;
  }
  export interface DeleteTerminologyRequest {
    /**
     * The name of the custom terminology being deleted. 
     */
    Name: ResourceName;
  }
  export interface DescribeTextTranslationJobRequest {
    /**
     * The identifier that Amazon Translate generated for the job. The StartTextTranslationJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeTextTranslationJobResponse {
    /**
     * An object that contains the properties associated with an asynchronous batch translation job.
     */
    TextTranslationJobProperties?: TextTranslationJobProperties;
  }
  export type Description = string;
  export type Directionality = "UNI"|"MULTI"|string;
  export type DisplayLanguageCode = "de"|"en"|"es"|"fr"|"it"|"ja"|"ko"|"pt"|"zh"|"zh-TW"|string;
  export interface Document {
    /**
     * The Contentfield type is Binary large object (blob). This object contains the document content converted into base64-encoded binary data. If you use one of the AWS SDKs, the SDK performs the Base64-encoding on this field before sending the request. 
     */
    Content: DocumentContent;
    /**
     * Describes the format of the document. You can specify one of the following:    text/html - The input data consists of HTML content. Amazon Translate translates only the text in the HTML element.    text/plain - The input data consists of unformatted text. Amazon Translate translates every character in the content.     application/vnd.openxmlformats-officedocument.wordprocessingml.document - The input data consists of a Word document (.docx).  
     */
    ContentType: ContentType;
  }
  export type DocumentContent = Buffer|Uint8Array|Blob|string;
  export interface EncryptionKey {
    /**
     * The type of encryption key used by Amazon Translate to encrypt this object.
     */
    Type: EncryptionKeyType;
    /**
     * The Amazon Resource Name (ARN) of the encryption key being used to encrypt this object.
     */
    Id: EncryptionKeyID;
  }
  export type EncryptionKeyID = string;
  export type EncryptionKeyType = "KMS"|string;
  export type Formality = "FORMAL"|"INFORMAL"|string;
  export interface GetParallelDataRequest {
    /**
     * The name of the parallel data resource that is being retrieved.
     */
    Name: ResourceName;
  }
  export interface GetParallelDataResponse {
    /**
     * The properties of the parallel data resource that is being retrieved.
     */
    ParallelDataProperties?: ParallelDataProperties;
    /**
     * The Amazon S3 location of the most recent parallel data input file that was successfully imported into Amazon Translate. The location is returned as a presigned URL that has a 30-minute expiration.  Amazon Translate doesn't scan all input files for the risk of CSV injection attacks.  CSV injection occurs when a .csv or .tsv file is altered so that a record contains malicious code. The record begins with a special character, such as =, +, -, or @. When the file is opened in a spreadsheet program, the program might interpret the record as a formula and run the code within it. Before you download an input file from Amazon S3, ensure that you recognize the file and trust its creator. 
     */
    DataLocation?: ParallelDataDataLocation;
    /**
     * The Amazon S3 location of a file that provides any errors or warnings that were produced by your input file. This file was created when Amazon Translate attempted to create a parallel data resource. The location is returned as a presigned URL to that has a 30-minute expiration.
     */
    AuxiliaryDataLocation?: ParallelDataDataLocation;
    /**
     * The Amazon S3 location of a file that provides any errors or warnings that were produced by your input file. This file was created when Amazon Translate attempted to update a parallel data resource. The location is returned as a presigned URL to that has a 30-minute expiration.
     */
    LatestUpdateAttemptAuxiliaryDataLocation?: ParallelDataDataLocation;
  }
  export interface GetTerminologyRequest {
    /**
     * The name of the custom terminology being retrieved.
     */
    Name: ResourceName;
    /**
     * The data format of the custom terminology being retrieved. If you don't specify this parameter, Amazon Translate returns a file with the same format as the file that was imported to create the terminology.  If you specify this parameter when you retrieve a multi-directional terminology resource, you must specify the same format as the input file that was imported to create it. Otherwise, Amazon Translate throws an error.
     */
    TerminologyDataFormat?: TerminologyDataFormat;
  }
  export interface GetTerminologyResponse {
    /**
     * The properties of the custom terminology being retrieved.
     */
    TerminologyProperties?: TerminologyProperties;
    /**
     * The Amazon S3 location of the most recent custom terminology input file that was successfully imported into Amazon Translate. The location is returned as a presigned URL that has a 30-minute expiration.  Amazon Translate doesn't scan all input files for the risk of CSV injection attacks.  CSV injection occurs when a .csv or .tsv file is altered so that a record contains malicious code. The record begins with a special character, such as =, +, -, or @. When the file is opened in a spreadsheet program, the program might interpret the record as a formula and run the code within it. Before you download an input file from Amazon S3, ensure that you recognize the file and trust its creator. 
     */
    TerminologyDataLocation?: TerminologyDataLocation;
    /**
     * The Amazon S3 location of a file that provides any errors or warnings that were produced by your input file. This file was created when Amazon Translate attempted to create a terminology resource. The location is returned as a presigned URL to that has a 30-minute expiration.
     */
    AuxiliaryDataLocation?: TerminologyDataLocation;
  }
  export type IamRoleArn = string;
  export interface ImportTerminologyRequest {
    /**
     * The name of the custom terminology being imported.
     */
    Name: ResourceName;
    /**
     * The merge strategy of the custom terminology being imported. Currently, only the OVERWRITE merge strategy is supported. In this case, the imported terminology will overwrite an existing terminology of the same name.
     */
    MergeStrategy: MergeStrategy;
    /**
     * The description of the custom terminology being imported.
     */
    Description?: Description;
    /**
     * The terminology data for the custom terminology being imported.
     */
    TerminologyData: TerminologyData;
    /**
     * The encryption key for the custom terminology being imported.
     */
    EncryptionKey?: EncryptionKey;
    /**
     * Tags to be associated with this resource. A tag is a key-value pair that adds metadata to a resource. Each tag key for the resource must be unique. For more information, see  Tagging your resources.
     */
    Tags?: TagList;
  }
  export interface ImportTerminologyResponse {
    /**
     * The properties of the custom terminology being imported.
     */
    TerminologyProperties?: TerminologyProperties;
    /**
     * The Amazon S3 location of a file that provides any errors or warnings that were produced by your input file. This file was created when Amazon Translate attempted to create a terminology resource. The location is returned as a presigned URL to that has a 30 minute expiration.
     */
    AuxiliaryDataLocation?: TerminologyDataLocation;
  }
  export interface InputDataConfig {
    /**
     * The URI of the AWS S3 folder that contains the input files. Amazon Translate translates all the files in the folder and all its sub-folders. The folder must be in the same Region as the API endpoint you are calling.
     */
    S3Uri: S3Uri;
    /**
     * Describes the format of the data that you submit to Amazon Translate as input. You can specify one of the following multipurpose internet mail extension (MIME) types:    text/html: The input data consists of one or more HTML files. Amazon Translate translates only the text that resides in the html element in each file.    text/plain: The input data consists of one or more unformatted text files. Amazon Translate translates every character in this type of input.    application/vnd.openxmlformats-officedocument.wordprocessingml.document: The input data consists of one or more Word documents (.docx).    application/vnd.openxmlformats-officedocument.presentationml.presentation: The input data consists of one or more PowerPoint Presentation files (.pptx).    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet: The input data consists of one or more Excel Workbook files (.xlsx).    application/x-xliff+xml: The input data consists of one or more XML Localization Interchange File Format (XLIFF) files (.xlf). Amazon Translate supports only XLIFF version 1.2.    If you structure your input data as HTML, ensure that you set this parameter to text/html. By doing so, you cut costs by limiting the translation to the contents of the html element in each file. Otherwise, if you set this parameter to text/plain, your costs will cover the translation of every character. 
     */
    ContentType: ContentType;
  }
  export type Integer = number;
  export interface JobDetails {
    /**
     * The number of documents successfully processed during a translation job.
     */
    TranslatedDocumentsCount?: Integer;
    /**
     * The number of documents that could not be processed during a translation job.
     */
    DocumentsWithErrorsCount?: Integer;
    /**
     * The number of documents used as input in a translation job.
     */
    InputDocumentsCount?: Integer;
  }
  export type JobId = string;
  export type JobName = string;
  export type JobStatus = "SUBMITTED"|"IN_PROGRESS"|"COMPLETED"|"COMPLETED_WITH_ERROR"|"FAILED"|"STOP_REQUESTED"|"STOPPED"|string;
  export interface Language {
    /**
     * Language name of the supported language.
     */
    LanguageName: LocalizedNameString;
    /**
     * Language code for the supported language.
     */
    LanguageCode: LanguageCodeString;
  }
  export type LanguageCodeString = string;
  export type LanguageCodeStringList = LanguageCodeString[];
  export type LanguagesList = Language[];
  export interface ListLanguagesRequest {
    /**
     * The language code for the language to use to display the language names in the response. The language code is en by default. 
     */
    DisplayLanguageCode?: DisplayLanguageCode;
    /**
     * Include the NextToken value to fetch the next group of supported languages. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in each response.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListLanguagesResponse {
    /**
     * The list of supported languages.
     */
    Languages?: LanguagesList;
    /**
     * The language code passed in with the request.
     */
    DisplayLanguageCode?: DisplayLanguageCode;
    /**
     *  If the response does not include all remaining results, use the NextToken in the next request to fetch the next group of supported languages.
     */
    NextToken?: NextToken;
  }
  export interface ListParallelDataRequest {
    /**
     * A string that specifies the next page of results to return in a paginated response.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of parallel data resources returned for each request.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListParallelDataResponse {
    /**
     * The properties of the parallel data resources returned by this request.
     */
    ParallelDataPropertiesList?: ParallelDataPropertiesList;
    /**
     * The string to use in a subsequent request to get the next page of results in a paginated response. This value is null if there are no additional pages.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the given Amazon Translate resource you are querying. 
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Tags associated with the Amazon Translate resource being queried. A tag is a key-value pair that adds as a metadata to a resource used by Amazon Translate. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department. 
     */
    Tags?: TagList;
  }
  export interface ListTerminologiesRequest {
    /**
     * If the result of the request to ListTerminologies was truncated, include the NextToken to fetch the next group of custom terminologies. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of custom terminologies returned per list request.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListTerminologiesResponse {
    /**
     * The properties list of the custom terminologies returned on the list request.
     */
    TerminologyPropertiesList?: TerminologyPropertiesList;
    /**
     *  If the response to the ListTerminologies was truncated, the NextToken fetches the next group of custom terminologies.
     */
    NextToken?: NextToken;
  }
  export interface ListTextTranslationJobsRequest {
    /**
     * The parameters that specify which batch translation jobs to retrieve. Filters include job name, job status, and submission time. You can only set one filter at a time.
     */
    Filter?: TextTranslationJobFilter;
    /**
     * The token to request the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in each page. The default value is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListTextTranslationJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    TextTranslationJobPropertiesList?: TextTranslationJobPropertiesList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export type LocalizedNameString = string;
  export type Long = number;
  export type MaxResultsInteger = number;
  export type MergeStrategy = "OVERWRITE"|string;
  export type NextToken = string;
  export interface OutputDataConfig {
    /**
     * The URI of the S3 folder that contains a translation job's output file. The folder must be in the same Region as the API endpoint that you are calling.
     */
    S3Uri: S3Uri;
    EncryptionKey?: EncryptionKey;
  }
  export type ParallelDataArn = string;
  export interface ParallelDataConfig {
    /**
     * The URI of the Amazon S3 folder that contains the parallel data input file. The folder must be in the same Region as the API endpoint you are calling.
     */
    S3Uri: S3Uri;
    /**
     * The format of the parallel data input file.
     */
    Format: ParallelDataFormat;
  }
  export interface ParallelDataDataLocation {
    /**
     * Describes the repository that contains the parallel data input file.
     */
    RepositoryType: String;
    /**
     * The Amazon S3 location of the parallel data input file. The location is returned as a presigned URL to that has a 30-minute expiration.  Amazon Translate doesn't scan all input files for the risk of CSV injection attacks.  CSV injection occurs when a .csv or .tsv file is altered so that a record contains malicious code. The record begins with a special character, such as =, +, -, or @. When the file is opened in a spreadsheet program, the program might interpret the record as a formula and run the code within it. Before you download an input file from Amazon S3, ensure that you recognize the file and trust its creator. 
     */
    Location: String;
  }
  export type ParallelDataFormat = "TSV"|"CSV"|"TMX"|string;
  export interface ParallelDataProperties {
    /**
     * The custom name assigned to the parallel data resource.
     */
    Name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the parallel data resource.
     */
    Arn?: ParallelDataArn;
    /**
     * The description assigned to the parallel data resource.
     */
    Description?: Description;
    /**
     * The status of the parallel data resource. When the parallel data is ready for you to use, the status is ACTIVE.
     */
    Status?: ParallelDataStatus;
    /**
     * The source language of the translations in the parallel data file.
     */
    SourceLanguageCode?: LanguageCodeString;
    /**
     * The language codes for the target languages available in the parallel data file. All possible target languages are returned as an array.
     */
    TargetLanguageCodes?: LanguageCodeStringList;
    /**
     * Specifies the format and S3 location of the parallel data input file.
     */
    ParallelDataConfig?: ParallelDataConfig;
    /**
     * Additional information from Amazon Translate about the parallel data resource. 
     */
    Message?: UnboundedLengthString;
    /**
     * The number of UTF-8 characters that Amazon Translate imported from the parallel data input file. This number includes only the characters in your translation examples. It does not include characters that are used to format your file. For example, if you provided a Translation Memory Exchange (.tmx) file, this number does not include the tags.
     */
    ImportedDataSize?: Long;
    /**
     * The number of records successfully imported from the parallel data input file.
     */
    ImportedRecordCount?: Long;
    /**
     * The number of records unsuccessfully imported from the parallel data input file.
     */
    FailedRecordCount?: Long;
    /**
     * The number of items in the input file that Amazon Translate skipped when you created or updated the parallel data resource. For example, Amazon Translate skips empty records, empty target texts, and empty lines.
     */
    SkippedRecordCount?: Long;
    EncryptionKey?: EncryptionKey;
    /**
     * The time at which the parallel data resource was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The time at which the parallel data resource was last updated.
     */
    LastUpdatedAt?: Timestamp;
    /**
     * The status of the most recent update attempt for the parallel data resource.
     */
    LatestUpdateAttemptStatus?: ParallelDataStatus;
    /**
     * The time that the most recent update was attempted.
     */
    LatestUpdateAttemptAt?: Timestamp;
  }
  export type ParallelDataPropertiesList = ParallelDataProperties[];
  export type ParallelDataStatus = "CREATING"|"UPDATING"|"ACTIVE"|"DELETING"|"FAILED"|string;
  export type Profanity = "MASK"|string;
  export type ResourceArn = string;
  export type ResourceName = string;
  export type ResourceNameList = ResourceName[];
  export type S3Uri = string;
  export interface StartTextTranslationJobRequest {
    /**
     * The name of the batch translation job to be performed.
     */
    JobName?: JobName;
    /**
     * Specifies the format and location of the input documents for the translation job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies the S3 folder to which your job output will be saved. 
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of an AWS Identity Access and Management (IAM) role that grants Amazon Translate read access to your input data. For more information, see Identity and access management .
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The language code of the input language. Specify the language if all input documents share the same language. If you don't know the language of the source files, or your input documents contains different source languages, select auto. Amazon Translate auto detects the source language for each input document. For a list of supported language codes, see Supported languages.
     */
    SourceLanguageCode: LanguageCodeString;
    /**
     * The target languages of the translation job. Enter up to 10 language codes. Each input file is translated into each target language. Each language code is 2 or 5 characters long. For a list of language codes, see Supported languages.
     */
    TargetLanguageCodes: TargetLanguageCodeStringList;
    /**
     * The name of a custom terminology resource to add to the translation job. This resource lists examples source terms and the desired translation for each term. This parameter accepts only one custom terminology resource. If you specify multiple target languages for the job, translate uses the designated terminology for each requested target language that has an entry for the source term in the terminology file. For a list of available custom terminology resources, use the ListTerminologies operation. For more information, see Custom terminology.
     */
    TerminologyNames?: ResourceNameList;
    /**
     * The name of a parallel data resource to add to the translation job. This resource consists of examples that show how you want segments of text to be translated. If you specify multiple target languages for the job, the parallel data file must include translations for all the target languages. When you add parallel data to a translation job, you create an Active Custom Translation job.  This parameter accepts only one parallel data resource.  Active Custom Translation jobs are priced at a higher rate than other jobs that don't use parallel data. For more information, see Amazon Translate pricing.  For a list of available parallel data resources, use the ListParallelData operation. For more information, see  Customizing your translations with parallel data.
     */
    ParallelDataNames?: ResourceNameList;
    /**
     * A unique identifier for the request. This token is generated for you when using the Amazon Translate SDK.
     */
    ClientToken: ClientTokenString;
    /**
     * Settings to configure your translation output, including the option to set the formality level of the output text and the option to mask profane words and phrases.
     */
    Settings?: TranslationSettings;
  }
  export interface StartTextTranslationJobResponse {
    /**
     * The identifier generated for the job. To get the status of a job, use this ID with the DescribeTextTranslationJob operation.
     */
    JobId?: JobId;
    /**
     * The status of the job. Possible values include:    SUBMITTED - The job has been received and is queued for processing.    IN_PROGRESS - Amazon Translate is processing the job.    COMPLETED - The job was successfully completed and the output is available.    COMPLETED_WITH_ERROR - The job was completed with errors. The errors can be analyzed in the job's output.    FAILED - The job did not complete. To get details, use the DescribeTextTranslationJob operation.    STOP_REQUESTED - The user who started the job has requested that it be stopped.    STOPPED - The job has been stopped.  
     */
    JobStatus?: JobStatus;
  }
  export interface StopTextTranslationJobRequest {
    /**
     * The job ID of the job to be stopped.
     */
    JobId: JobId;
  }
  export interface StopTextTranslationJobResponse {
    /**
     * The job ID of the stopped batch translation job.
     */
    JobId?: JobId;
    /**
     * The status of the designated job. Upon successful completion, the job's status will be STOPPED.
     */
    JobStatus?: JobStatus;
  }
  export type String = string;
  export interface Tag {
    /**
     * The initial part of a key-value pair that forms a tag associated with a given resource. 
     */
    Key: TagKey;
    /**
     *  The second part of a key-value pair that forms a tag associated with a given resource.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the given Amazon Translate resource to which you want to associate the tags. 
     */
    ResourceArn: ResourceArn;
    /**
     * Tags being associated with a specific Amazon Translate resource. There can be a maximum of 50 tags (both existing and pending) associated with a specific resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetLanguageCodeStringList = LanguageCodeString[];
  export interface Term {
    /**
     * The source text of the term being translated by the custom terminology.
     */
    SourceText?: String;
    /**
     * The target text of the term being translated by the custom terminology.
     */
    TargetText?: String;
  }
  export type TermList = Term[];
  export type TerminologyArn = string;
  export interface TerminologyData {
    /**
     * The file containing the custom terminology data. Your version of the AWS SDK performs a Base64-encoding on this field before sending a request to the AWS service. Users of the SDK should not perform Base64-encoding themselves.
     */
    File: TerminologyFile;
    /**
     * The data format of the custom terminology.
     */
    Format: TerminologyDataFormat;
    /**
     * The directionality of your terminology resource indicates whether it has one source language (uni-directional) or multiple (multi-directional).  UNI  The terminology resource has one source language (for example, the first column in a CSV file), and all of its other languages are target languages.   MULTI  Any language in the terminology resource can be the source language or a target language. A single multi-directional terminology resource can be used for jobs that translate different language pairs. For example, if the terminology contains English and Spanish terms, it can be used for jobs that translate English to Spanish and Spanish to English.   When you create a custom terminology resource without specifying the directionality, it behaves as uni-directional terminology, although this parameter will have a null value.
     */
    Directionality?: Directionality;
  }
  export type TerminologyDataFormat = "CSV"|"TMX"|"TSV"|string;
  export interface TerminologyDataLocation {
    /**
     * The repository type for the custom terminology data.
     */
    RepositoryType: String;
    /**
     * The Amazon S3 location of the most recent custom terminology input file that was successfully imported into Amazon Translate. The location is returned as a presigned URL that has a 30-minute expiration .  Amazon Translate doesn't scan all input files for the risk of CSV injection attacks.  CSV injection occurs when a .csv or .tsv file is altered so that a record contains malicious code. The record begins with a special character, such as =, +, -, or @. When the file is opened in a spreadsheet program, the program might interpret the record as a formula and run the code within it. Before you download an input file from Amazon S3, ensure that you recognize the file and trust its creator. 
     */
    Location: String;
  }
  export type TerminologyFile = Buffer|Uint8Array|Blob|string;
  export interface TerminologyProperties {
    /**
     * The name of the custom terminology.
     */
    Name?: ResourceName;
    /**
     * The description of the custom terminology properties.
     */
    Description?: Description;
    /**
     *  The Amazon Resource Name (ARN) of the custom terminology. 
     */
    Arn?: TerminologyArn;
    /**
     * The language code for the source text of the translation request for which the custom terminology is being used.
     */
    SourceLanguageCode?: LanguageCodeString;
    /**
     * The language codes for the target languages available with the custom terminology resource. All possible target languages are returned in array.
     */
    TargetLanguageCodes?: LanguageCodeStringList;
    /**
     * The encryption key for the custom terminology.
     */
    EncryptionKey?: EncryptionKey;
    /**
     * The size of the file used when importing a custom terminology.
     */
    SizeBytes?: Integer;
    /**
     * The number of terms included in the custom terminology.
     */
    TermCount?: Integer;
    /**
     * The time at which the custom terminology was created, based on the timestamp.
     */
    CreatedAt?: Timestamp;
    /**
     * The time at which the custom terminology was last update, based on the timestamp.
     */
    LastUpdatedAt?: Timestamp;
    /**
     * The directionality of your terminology resource indicates whether it has one source language (uni-directional) or multiple (multi-directional).   UNI  The terminology resource has one source language (the first column in a CSV file), and all of its other languages are target languages.  MULTI  Any language in the terminology resource can be the source language.  
     */
    Directionality?: Directionality;
    /**
     * Additional information from Amazon Translate about the terminology resource.
     */
    Message?: UnboundedLengthString;
    /**
     * The number of terms in the input file that Amazon Translate skipped when you created or updated the terminology resource.
     */
    SkippedTermCount?: Integer;
    /**
     * The format of the custom terminology input file.
     */
    Format?: TerminologyDataFormat;
  }
  export type TerminologyPropertiesList = TerminologyProperties[];
  export interface TextTranslationJobFilter {
    /**
     * Filters the list of jobs by name.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based by job status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing and returns only the jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmittedBeforeTime?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing and returns only the jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmittedAfterTime?: Timestamp;
  }
  export interface TextTranslationJobProperties {
    /**
     * The ID of the translation job.
     */
    JobId?: JobId;
    /**
     * The user-defined name of the translation job.
     */
    JobName?: JobName;
    /**
     * The status of the translation job.
     */
    JobStatus?: JobStatus;
    /**
     * The number of documents successfully and unsuccessfully processed during the translation job.
     */
    JobDetails?: JobDetails;
    /**
     * The language code of the language of the source text. The language must be a language supported by Amazon Translate.
     */
    SourceLanguageCode?: LanguageCodeString;
    /**
     * The language code of the language of the target text. The language must be a language supported by Amazon Translate.
     */
    TargetLanguageCodes?: TargetLanguageCodeStringList;
    /**
     * A list containing the names of the terminologies applied to a translation job. Only one terminology can be applied per StartTextTranslationJob request at this time.
     */
    TerminologyNames?: ResourceNameList;
    /**
     * A list containing the names of the parallel data resources applied to the translation job.
     */
    ParallelDataNames?: ResourceNameList;
    /**
     * An explanation of any errors that may have occurred during the translation job.
     */
    Message?: UnboundedLengthString;
    /**
     * The time at which the translation job was submitted.
     */
    SubmittedTime?: Timestamp;
    /**
     * The time at which the translation job ended.
     */
    EndTime?: Timestamp;
    /**
     * The input configuration properties that were specified when the job was requested.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output configuration properties that were specified when the job was requested.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of an AWS Identity Access and Management (IAM) role that granted Amazon Translate read access to the job's input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * Settings that modify the translation output.
     */
    Settings?: TranslationSettings;
  }
  export type TextTranslationJobPropertiesList = TextTranslationJobProperties[];
  export type Timestamp = Date;
  export interface TranslateDocumentRequest {
    /**
     * The content and content type for the document to be translated. The document size must not exceed 100 KB.
     */
    Document: Document;
    /**
     * The name of a terminology list file to add to the translation job. This file provides source terms and the desired translation for each term. A terminology list can contain a maximum of 256 terms. You can use one custom terminology resource in your translation request. Use the ListTerminologies operation to get the available terminology lists. For more information about custom terminology lists, see Custom terminology.
     */
    TerminologyNames?: ResourceNameList;
    /**
     * The language code for the language of the source text. Do not use auto, because TranslateDocument does not support language auto-detection. For a list of supported language codes, see Supported languages.
     */
    SourceLanguageCode: LanguageCodeString;
    /**
     * The language code requested for the translated document. For a list of supported language codes, see Supported languages.
     */
    TargetLanguageCode: LanguageCodeString;
    Settings?: TranslationSettings;
  }
  export interface TranslateDocumentResponse {
    /**
     * The document containing the translated content. The document format matches the source document format.
     */
    TranslatedDocument: TranslatedDocument;
    /**
     * The language code of the source document.
     */
    SourceLanguageCode: LanguageCodeString;
    /**
     * The language code of the translated document. 
     */
    TargetLanguageCode: LanguageCodeString;
    /**
     * The names of the custom terminologies applied to the input text by Amazon Translate to produce the translated text document.
     */
    AppliedTerminologies?: AppliedTerminologyList;
    AppliedSettings?: TranslationSettings;
  }
  export interface TranslateTextRequest {
    /**
     * The text to translate. The text string can be a maximum of 10,000 bytes long. Depending on your character set, this may be fewer than 10,000 characters.
     */
    Text: BoundedLengthString;
    /**
     * The name of a terminology list file to add to the translation job. This file provides source terms and the desired translation for each term. A terminology list can contain a maximum of 256 terms. You can use one custom terminology resource in your translation request. Use the ListTerminologies operation to get the available terminology lists. For more information about custom terminology lists, see Custom terminology.
     */
    TerminologyNames?: ResourceNameList;
    /**
     * The language code for the language of the source text. For a list of language codes, see Supported languages. To have Amazon Translate determine the source language of your text, you can specify auto in the SourceLanguageCode field. If you specify auto, Amazon Translate will call Amazon Comprehend to determine the source language.  If you specify auto, you must send the TranslateText request in a region that supports Amazon Comprehend. Otherwise, the request returns an error indicating that autodetect is not supported.  
     */
    SourceLanguageCode: LanguageCodeString;
    /**
     * The language code requested for the language of the target text. For a list of language codes, see Supported languages.
     */
    TargetLanguageCode: LanguageCodeString;
    /**
     * Settings to configure your translation output, including the option to set the formality level of the output text and the option to mask profane words and phrases.
     */
    Settings?: TranslationSettings;
  }
  export interface TranslateTextResponse {
    /**
     * The translated text.
     */
    TranslatedText: TranslatedTextString;
    /**
     * The language code for the language of the source text.
     */
    SourceLanguageCode: LanguageCodeString;
    /**
     * The language code for the language of the target text. 
     */
    TargetLanguageCode: LanguageCodeString;
    /**
     * The names of the custom terminologies applied to the input text by Amazon Translate for the translated text response.
     */
    AppliedTerminologies?: AppliedTerminologyList;
    /**
     * Optional settings that modify the translation output.
     */
    AppliedSettings?: TranslationSettings;
  }
  export interface TranslatedDocument {
    /**
     * The document containing the translated content.
     */
    Content: TranslatedDocumentContent;
  }
  export type TranslatedDocumentContent = Buffer|Uint8Array|Blob|string;
  export type TranslatedTextString = string;
  export interface TranslationSettings {
    /**
     * You can optionally specify the desired level of formality for translations to supported target languages. The formality setting controls the level of formal language usage (also known as register) in the translation output. You can set the value to informal or formal. If you don't specify a value for formality, or if the target language doesn't support formality, the translation will ignore the formality setting.  If you specify multiple target languages for the job, translate ignores the formality setting for any unsupported target language. For a list of target languages that support formality, see Supported languages in the Amazon Translate Developer Guide.
     */
    Formality?: Formality;
    /**
     * Enable the profanity setting if you want Amazon Translate to mask profane words and phrases in your translation output. To mask profane words and phrases, Amazon Translate replaces them with the grawlix string “?$#@$“. This 5-character sequence is used for each profane word or phrase, regardless of the length or number of words. Amazon Translate doesn't detect profanity in all of its supported languages. For languages that don't support profanity detection, see Unsupported languages in the Amazon Translate Developer Guide. If you specify multiple target languages for the job, all the target languages must support profanity masking. If any of the target languages don't support profanity masking, the translation job won't mask profanity for any target language.
     */
    Profanity?: Profanity;
  }
  export type UnboundedLengthString = string;
  export interface UntagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the given Amazon Translate resource from which you want to remove the tags. 
     */
    ResourceArn: ResourceArn;
    /**
     * The initial part of a key-value pair that forms a tag being removed from a given resource. Keys must be unique and cannot be duplicated for a particular resource. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateParallelDataRequest {
    /**
     * The name of the parallel data resource being updated.
     */
    Name: ResourceName;
    /**
     * A custom description for the parallel data resource in Amazon Translate.
     */
    Description?: Description;
    /**
     * Specifies the format and S3 location of the parallel data input file.
     */
    ParallelDataConfig: ParallelDataConfig;
    /**
     * A unique identifier for the request. This token is automatically generated when you use Amazon Translate through an AWS SDK.
     */
    ClientToken: ClientTokenString;
  }
  export interface UpdateParallelDataResponse {
    /**
     * The name of the parallel data resource being updated.
     */
    Name?: ResourceName;
    /**
     * The status of the parallel data resource that you are attempting to update. Your update request is accepted only if this status is either ACTIVE or FAILED.
     */
    Status?: ParallelDataStatus;
    /**
     * The status of the parallel data update attempt. When the updated parallel data resource is ready for you to use, the status is ACTIVE.
     */
    LatestUpdateAttemptStatus?: ParallelDataStatus;
    /**
     * The time that the most recent update was attempted.
     */
    LatestUpdateAttemptAt?: Timestamp;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Translate client.
   */
  export import Types = Translate;
}
export = Translate;
