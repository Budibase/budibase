import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class TranscribeService extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: TranscribeService.Types.ClientConfiguration)
  config: Config & TranscribeService.Types.ClientConfiguration;
  /**
   * Creates a new Call Analytics category. All categories are automatically applied to your Call Analytics transcriptions. Note that in order to apply categories to your transcriptions, you must create them before submitting your transcription request, as categories cannot be applied retroactively. When creating a new category, you can use the InputType parameter to label the category as a POST_CALL or a REAL_TIME category. POST_CALL categories can only be applied to post-call transcriptions and REAL_TIME categories can only be applied to real-time transcriptions. If you do not include InputType, your category is created as a POST_CALL category by default. Call Analytics categories are composed of rules. For each category, you must create between 1 and 20 rules. Rules can include these parameters: , , , and . To update an existing category, see . To learn more about Call Analytics categories, see Creating categories for post-call transcriptions and Creating categories for real-time transcriptions.
   */
  createCallAnalyticsCategory(params: TranscribeService.Types.CreateCallAnalyticsCategoryRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.CreateCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Creates a new Call Analytics category. All categories are automatically applied to your Call Analytics transcriptions. Note that in order to apply categories to your transcriptions, you must create them before submitting your transcription request, as categories cannot be applied retroactively. When creating a new category, you can use the InputType parameter to label the category as a POST_CALL or a REAL_TIME category. POST_CALL categories can only be applied to post-call transcriptions and REAL_TIME categories can only be applied to real-time transcriptions. If you do not include InputType, your category is created as a POST_CALL category by default. Call Analytics categories are composed of rules. For each category, you must create between 1 and 20 rules. Rules can include these parameters: , , , and . To update an existing category, see . To learn more about Call Analytics categories, see Creating categories for post-call transcriptions and Creating categories for real-time transcriptions.
   */
  createCallAnalyticsCategory(callback?: (err: AWSError, data: TranscribeService.Types.CreateCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.CreateCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Creates a new custom language model. When creating a new custom language model, you must specify:   If you want a Wideband (audio sample rates over 16,000 Hz) or Narrowband (audio sample rates under 16,000 Hz) base model   The location of your training and tuning files (this must be an Amazon S3 URI)   The language of your model   A unique name for your model  
   */
  createLanguageModel(params: TranscribeService.Types.CreateLanguageModelRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateLanguageModelResponse) => void): Request<TranscribeService.Types.CreateLanguageModelResponse, AWSError>;
  /**
   * Creates a new custom language model. When creating a new custom language model, you must specify:   If you want a Wideband (audio sample rates over 16,000 Hz) or Narrowband (audio sample rates under 16,000 Hz) base model   The location of your training and tuning files (this must be an Amazon S3 URI)   The language of your model   A unique name for your model  
   */
  createLanguageModel(callback?: (err: AWSError, data: TranscribeService.Types.CreateLanguageModelResponse) => void): Request<TranscribeService.Types.CreateLanguageModelResponse, AWSError>;
  /**
   * Creates a new custom medical vocabulary. Before creating a new custom medical vocabulary, you must first upload a text file that contains your vocabulary table into an Amazon S3 bucket. Note that this differs from , where you can include a list of terms within your request using the Phrases flag; CreateMedicalVocabulary does not support the Phrases flag and only accepts vocabularies in table format. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language. For more information, see Custom vocabularies.
   */
  createMedicalVocabulary(params: TranscribeService.Types.CreateMedicalVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateMedicalVocabularyResponse) => void): Request<TranscribeService.Types.CreateMedicalVocabularyResponse, AWSError>;
  /**
   * Creates a new custom medical vocabulary. Before creating a new custom medical vocabulary, you must first upload a text file that contains your vocabulary table into an Amazon S3 bucket. Note that this differs from , where you can include a list of terms within your request using the Phrases flag; CreateMedicalVocabulary does not support the Phrases flag and only accepts vocabularies in table format. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language. For more information, see Custom vocabularies.
   */
  createMedicalVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.CreateMedicalVocabularyResponse) => void): Request<TranscribeService.Types.CreateMedicalVocabularyResponse, AWSError>;
  /**
   * Creates a new custom vocabulary. When creating a new custom vocabulary, you can either upload a text file that contains your new entries, phrases, and terms into an Amazon S3 bucket and include the URI in your request. Or you can include a list of terms directly in your request using the Phrases flag. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language. For more information, see Custom vocabularies.
   */
  createVocabulary(params: TranscribeService.Types.CreateVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateVocabularyResponse) => void): Request<TranscribeService.Types.CreateVocabularyResponse, AWSError>;
  /**
   * Creates a new custom vocabulary. When creating a new custom vocabulary, you can either upload a text file that contains your new entries, phrases, and terms into an Amazon S3 bucket and include the URI in your request. Or you can include a list of terms directly in your request using the Phrases flag. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language. For more information, see Custom vocabularies.
   */
  createVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.CreateVocabularyResponse) => void): Request<TranscribeService.Types.CreateVocabularyResponse, AWSError>;
  /**
   * Creates a new custom vocabulary filter. You can use custom vocabulary filters to mask, delete, or flag specific words from your transcript. Custom vocabulary filters are commonly used to mask profanity in transcripts. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary filter request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language. For more information, see Vocabulary filtering.
   */
  createVocabularyFilter(params: TranscribeService.Types.CreateVocabularyFilterRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateVocabularyFilterResponse) => void): Request<TranscribeService.Types.CreateVocabularyFilterResponse, AWSError>;
  /**
   * Creates a new custom vocabulary filter. You can use custom vocabulary filters to mask, delete, or flag specific words from your transcript. Custom vocabulary filters are commonly used to mask profanity in transcripts. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary filter request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language. For more information, see Vocabulary filtering.
   */
  createVocabularyFilter(callback?: (err: AWSError, data: TranscribeService.Types.CreateVocabularyFilterResponse) => void): Request<TranscribeService.Types.CreateVocabularyFilterResponse, AWSError>;
  /**
   * Deletes a Call Analytics category. To use this operation, specify the name of the category you want to delete using CategoryName. Category names are case sensitive.
   */
  deleteCallAnalyticsCategory(params: TranscribeService.Types.DeleteCallAnalyticsCategoryRequest, callback?: (err: AWSError, data: TranscribeService.Types.DeleteCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.DeleteCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Deletes a Call Analytics category. To use this operation, specify the name of the category you want to delete using CategoryName. Category names are case sensitive.
   */
  deleteCallAnalyticsCategory(callback?: (err: AWSError, data: TranscribeService.Types.DeleteCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.DeleteCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Deletes a Call Analytics job. To use this operation, specify the name of the job you want to delete using CallAnalyticsJobName. Job names are case sensitive.
   */
  deleteCallAnalyticsJob(params: TranscribeService.Types.DeleteCallAnalyticsJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.DeleteCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.DeleteCallAnalyticsJobResponse, AWSError>;
  /**
   * Deletes a Call Analytics job. To use this operation, specify the name of the job you want to delete using CallAnalyticsJobName. Job names are case sensitive.
   */
  deleteCallAnalyticsJob(callback?: (err: AWSError, data: TranscribeService.Types.DeleteCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.DeleteCallAnalyticsJobResponse, AWSError>;
  /**
   * Deletes a custom language model. To use this operation, specify the name of the language model you want to delete using ModelName. custom language model names are case sensitive.
   */
  deleteLanguageModel(params: TranscribeService.Types.DeleteLanguageModelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom language model. To use this operation, specify the name of the language model you want to delete using ModelName. custom language model names are case sensitive.
   */
  deleteLanguageModel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a medical transcription job. To use this operation, specify the name of the job you want to delete using MedicalTranscriptionJobName. Job names are case sensitive.
   */
  deleteMedicalTranscriptionJob(params: TranscribeService.Types.DeleteMedicalTranscriptionJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a medical transcription job. To use this operation, specify the name of the job you want to delete using MedicalTranscriptionJobName. Job names are case sensitive.
   */
  deleteMedicalTranscriptionJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom medical vocabulary. To use this operation, specify the name of the custom vocabulary you want to delete using VocabularyName. Custom vocabulary names are case sensitive.
   */
  deleteMedicalVocabulary(params: TranscribeService.Types.DeleteMedicalVocabularyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom medical vocabulary. To use this operation, specify the name of the custom vocabulary you want to delete using VocabularyName. Custom vocabulary names are case sensitive.
   */
  deleteMedicalVocabulary(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a transcription job. To use this operation, specify the name of the job you want to delete using TranscriptionJobName. Job names are case sensitive.
   */
  deleteTranscriptionJob(params: TranscribeService.Types.DeleteTranscriptionJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a transcription job. To use this operation, specify the name of the job you want to delete using TranscriptionJobName. Job names are case sensitive.
   */
  deleteTranscriptionJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom vocabulary. To use this operation, specify the name of the custom vocabulary you want to delete using VocabularyName. Custom vocabulary names are case sensitive.
   */
  deleteVocabulary(params: TranscribeService.Types.DeleteVocabularyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom vocabulary. To use this operation, specify the name of the custom vocabulary you want to delete using VocabularyName. Custom vocabulary names are case sensitive.
   */
  deleteVocabulary(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom vocabulary filter. To use this operation, specify the name of the custom vocabulary filter you want to delete using VocabularyFilterName. Custom vocabulary filter names are case sensitive.
   */
  deleteVocabularyFilter(params: TranscribeService.Types.DeleteVocabularyFilterRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom vocabulary filter. To use this operation, specify the name of the custom vocabulary filter you want to delete using VocabularyFilterName. Custom vocabulary filter names are case sensitive.
   */
  deleteVocabularyFilter(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Provides information about the specified custom language model. This operation also shows if the base language model that you used to create your custom language model has been updated. If Amazon Transcribe has updated the base model, you can create a new custom language model using the updated base model. If you tried to create a new custom language model and the request wasn't successful, you can use DescribeLanguageModel to help identify the reason for this failure.
   */
  describeLanguageModel(params: TranscribeService.Types.DescribeLanguageModelRequest, callback?: (err: AWSError, data: TranscribeService.Types.DescribeLanguageModelResponse) => void): Request<TranscribeService.Types.DescribeLanguageModelResponse, AWSError>;
  /**
   * Provides information about the specified custom language model. This operation also shows if the base language model that you used to create your custom language model has been updated. If Amazon Transcribe has updated the base model, you can create a new custom language model using the updated base model. If you tried to create a new custom language model and the request wasn't successful, you can use DescribeLanguageModel to help identify the reason for this failure.
   */
  describeLanguageModel(callback?: (err: AWSError, data: TranscribeService.Types.DescribeLanguageModelResponse) => void): Request<TranscribeService.Types.DescribeLanguageModelResponse, AWSError>;
  /**
   * Provides information about the specified Call Analytics category. To get a list of your Call Analytics categories, use the operation.
   */
  getCallAnalyticsCategory(params: TranscribeService.Types.GetCallAnalyticsCategoryRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.GetCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Provides information about the specified Call Analytics category. To get a list of your Call Analytics categories, use the operation.
   */
  getCallAnalyticsCategory(callback?: (err: AWSError, data: TranscribeService.Types.GetCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.GetCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Provides information about the specified Call Analytics job. To view the job's status, refer to CallAnalyticsJobStatus. If the status is COMPLETED, the job is finished. You can find your completed transcript at the URI specified in TranscriptFileUri. If the status is FAILED, FailureReason provides details on why your transcription job failed. If you enabled personally identifiable information (PII) redaction, the redacted transcript appears at the location specified in RedactedTranscriptFileUri. If you chose to redact the audio in your media file, you can find your redacted media file at the location specified in RedactedMediaFileUri. To get a list of your Call Analytics jobs, use the operation.
   */
  getCallAnalyticsJob(params: TranscribeService.Types.GetCallAnalyticsJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.GetCallAnalyticsJobResponse, AWSError>;
  /**
   * Provides information about the specified Call Analytics job. To view the job's status, refer to CallAnalyticsJobStatus. If the status is COMPLETED, the job is finished. You can find your completed transcript at the URI specified in TranscriptFileUri. If the status is FAILED, FailureReason provides details on why your transcription job failed. If you enabled personally identifiable information (PII) redaction, the redacted transcript appears at the location specified in RedactedTranscriptFileUri. If you chose to redact the audio in your media file, you can find your redacted media file at the location specified in RedactedMediaFileUri. To get a list of your Call Analytics jobs, use the operation.
   */
  getCallAnalyticsJob(callback?: (err: AWSError, data: TranscribeService.Types.GetCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.GetCallAnalyticsJobResponse, AWSError>;
  /**
   * Provides information about the specified medical transcription job. To view the status of the specified medical transcription job, check the TranscriptionJobStatus field. If the status is COMPLETED, the job is finished. You can find the results at the location specified in TranscriptFileUri. If the status is FAILED, FailureReason provides details on why your transcription job failed. To get a list of your medical transcription jobs, use the operation.
   */
  getMedicalTranscriptionJob(params: TranscribeService.Types.GetMedicalTranscriptionJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetMedicalTranscriptionJobResponse) => void): Request<TranscribeService.Types.GetMedicalTranscriptionJobResponse, AWSError>;
  /**
   * Provides information about the specified medical transcription job. To view the status of the specified medical transcription job, check the TranscriptionJobStatus field. If the status is COMPLETED, the job is finished. You can find the results at the location specified in TranscriptFileUri. If the status is FAILED, FailureReason provides details on why your transcription job failed. To get a list of your medical transcription jobs, use the operation.
   */
  getMedicalTranscriptionJob(callback?: (err: AWSError, data: TranscribeService.Types.GetMedicalTranscriptionJobResponse) => void): Request<TranscribeService.Types.GetMedicalTranscriptionJobResponse, AWSError>;
  /**
   * Provides information about the specified custom medical vocabulary. To view the status of the specified custom medical vocabulary, check the VocabularyState field. If the status is READY, your custom vocabulary is available to use. If the status is FAILED, FailureReason provides details on why your vocabulary failed. To get a list of your custom medical vocabularies, use the operation.
   */
  getMedicalVocabulary(params: TranscribeService.Types.GetMedicalVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetMedicalVocabularyResponse) => void): Request<TranscribeService.Types.GetMedicalVocabularyResponse, AWSError>;
  /**
   * Provides information about the specified custom medical vocabulary. To view the status of the specified custom medical vocabulary, check the VocabularyState field. If the status is READY, your custom vocabulary is available to use. If the status is FAILED, FailureReason provides details on why your vocabulary failed. To get a list of your custom medical vocabularies, use the operation.
   */
  getMedicalVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.GetMedicalVocabularyResponse) => void): Request<TranscribeService.Types.GetMedicalVocabularyResponse, AWSError>;
  /**
   * Provides information about the specified transcription job. To view the status of the specified transcription job, check the TranscriptionJobStatus field. If the status is COMPLETED, the job is finished. You can find the results at the location specified in TranscriptFileUri. If the status is FAILED, FailureReason provides details on why your transcription job failed. If you enabled content redaction, the redacted transcript can be found at the location specified in RedactedTranscriptFileUri. To get a list of your transcription jobs, use the operation.
   */
  getTranscriptionJob(params: TranscribeService.Types.GetTranscriptionJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetTranscriptionJobResponse) => void): Request<TranscribeService.Types.GetTranscriptionJobResponse, AWSError>;
  /**
   * Provides information about the specified transcription job. To view the status of the specified transcription job, check the TranscriptionJobStatus field. If the status is COMPLETED, the job is finished. You can find the results at the location specified in TranscriptFileUri. If the status is FAILED, FailureReason provides details on why your transcription job failed. If you enabled content redaction, the redacted transcript can be found at the location specified in RedactedTranscriptFileUri. To get a list of your transcription jobs, use the operation.
   */
  getTranscriptionJob(callback?: (err: AWSError, data: TranscribeService.Types.GetTranscriptionJobResponse) => void): Request<TranscribeService.Types.GetTranscriptionJobResponse, AWSError>;
  /**
   * Provides information about the specified custom vocabulary. To view the status of the specified custom vocabulary, check the VocabularyState field. If the status is READY, your custom vocabulary is available to use. If the status is FAILED, FailureReason provides details on why your custom vocabulary failed. To get a list of your custom vocabularies, use the operation.
   */
  getVocabulary(params: TranscribeService.Types.GetVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetVocabularyResponse) => void): Request<TranscribeService.Types.GetVocabularyResponse, AWSError>;
  /**
   * Provides information about the specified custom vocabulary. To view the status of the specified custom vocabulary, check the VocabularyState field. If the status is READY, your custom vocabulary is available to use. If the status is FAILED, FailureReason provides details on why your custom vocabulary failed. To get a list of your custom vocabularies, use the operation.
   */
  getVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.GetVocabularyResponse) => void): Request<TranscribeService.Types.GetVocabularyResponse, AWSError>;
  /**
   * Provides information about the specified custom vocabulary filter. To get a list of your custom vocabulary filters, use the operation.
   */
  getVocabularyFilter(params: TranscribeService.Types.GetVocabularyFilterRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetVocabularyFilterResponse) => void): Request<TranscribeService.Types.GetVocabularyFilterResponse, AWSError>;
  /**
   * Provides information about the specified custom vocabulary filter. To get a list of your custom vocabulary filters, use the operation.
   */
  getVocabularyFilter(callback?: (err: AWSError, data: TranscribeService.Types.GetVocabularyFilterResponse) => void): Request<TranscribeService.Types.GetVocabularyFilterResponse, AWSError>;
  /**
   * Provides a list of Call Analytics categories, including all rules that make up each category. To get detailed information about a specific Call Analytics category, use the operation.
   */
  listCallAnalyticsCategories(params: TranscribeService.Types.ListCallAnalyticsCategoriesRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListCallAnalyticsCategoriesResponse) => void): Request<TranscribeService.Types.ListCallAnalyticsCategoriesResponse, AWSError>;
  /**
   * Provides a list of Call Analytics categories, including all rules that make up each category. To get detailed information about a specific Call Analytics category, use the operation.
   */
  listCallAnalyticsCategories(callback?: (err: AWSError, data: TranscribeService.Types.ListCallAnalyticsCategoriesResponse) => void): Request<TranscribeService.Types.ListCallAnalyticsCategoriesResponse, AWSError>;
  /**
   * Provides a list of Call Analytics jobs that match the specified criteria. If no criteria are specified, all Call Analytics jobs are returned. To get detailed information about a specific Call Analytics job, use the operation.
   */
  listCallAnalyticsJobs(params: TranscribeService.Types.ListCallAnalyticsJobsRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListCallAnalyticsJobsResponse) => void): Request<TranscribeService.Types.ListCallAnalyticsJobsResponse, AWSError>;
  /**
   * Provides a list of Call Analytics jobs that match the specified criteria. If no criteria are specified, all Call Analytics jobs are returned. To get detailed information about a specific Call Analytics job, use the operation.
   */
  listCallAnalyticsJobs(callback?: (err: AWSError, data: TranscribeService.Types.ListCallAnalyticsJobsResponse) => void): Request<TranscribeService.Types.ListCallAnalyticsJobsResponse, AWSError>;
  /**
   * Provides a list of custom language models that match the specified criteria. If no criteria are specified, all custom language models are returned. To get detailed information about a specific custom language model, use the operation.
   */
  listLanguageModels(params: TranscribeService.Types.ListLanguageModelsRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListLanguageModelsResponse) => void): Request<TranscribeService.Types.ListLanguageModelsResponse, AWSError>;
  /**
   * Provides a list of custom language models that match the specified criteria. If no criteria are specified, all custom language models are returned. To get detailed information about a specific custom language model, use the operation.
   */
  listLanguageModels(callback?: (err: AWSError, data: TranscribeService.Types.ListLanguageModelsResponse) => void): Request<TranscribeService.Types.ListLanguageModelsResponse, AWSError>;
  /**
   * Provides a list of medical transcription jobs that match the specified criteria. If no criteria are specified, all medical transcription jobs are returned. To get detailed information about a specific medical transcription job, use the operation.
   */
  listMedicalTranscriptionJobs(params: TranscribeService.Types.ListMedicalTranscriptionJobsRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListMedicalTranscriptionJobsResponse) => void): Request<TranscribeService.Types.ListMedicalTranscriptionJobsResponse, AWSError>;
  /**
   * Provides a list of medical transcription jobs that match the specified criteria. If no criteria are specified, all medical transcription jobs are returned. To get detailed information about a specific medical transcription job, use the operation.
   */
  listMedicalTranscriptionJobs(callback?: (err: AWSError, data: TranscribeService.Types.ListMedicalTranscriptionJobsResponse) => void): Request<TranscribeService.Types.ListMedicalTranscriptionJobsResponse, AWSError>;
  /**
   * Provides a list of custom medical vocabularies that match the specified criteria. If no criteria are specified, all custom medical vocabularies are returned. To get detailed information about a specific custom medical vocabulary, use the operation.
   */
  listMedicalVocabularies(params: TranscribeService.Types.ListMedicalVocabulariesRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListMedicalVocabulariesResponse) => void): Request<TranscribeService.Types.ListMedicalVocabulariesResponse, AWSError>;
  /**
   * Provides a list of custom medical vocabularies that match the specified criteria. If no criteria are specified, all custom medical vocabularies are returned. To get detailed information about a specific custom medical vocabulary, use the operation.
   */
  listMedicalVocabularies(callback?: (err: AWSError, data: TranscribeService.Types.ListMedicalVocabulariesResponse) => void): Request<TranscribeService.Types.ListMedicalVocabulariesResponse, AWSError>;
  /**
   * Lists all tags associated with the specified transcription job, vocabulary, model, or resource. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
   */
  listTagsForResource(params: TranscribeService.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListTagsForResourceResponse) => void): Request<TranscribeService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags associated with the specified transcription job, vocabulary, model, or resource. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
   */
  listTagsForResource(callback?: (err: AWSError, data: TranscribeService.Types.ListTagsForResourceResponse) => void): Request<TranscribeService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Provides a list of transcription jobs that match the specified criteria. If no criteria are specified, all transcription jobs are returned. To get detailed information about a specific transcription job, use the operation.
   */
  listTranscriptionJobs(params: TranscribeService.Types.ListTranscriptionJobsRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListTranscriptionJobsResponse) => void): Request<TranscribeService.Types.ListTranscriptionJobsResponse, AWSError>;
  /**
   * Provides a list of transcription jobs that match the specified criteria. If no criteria are specified, all transcription jobs are returned. To get detailed information about a specific transcription job, use the operation.
   */
  listTranscriptionJobs(callback?: (err: AWSError, data: TranscribeService.Types.ListTranscriptionJobsResponse) => void): Request<TranscribeService.Types.ListTranscriptionJobsResponse, AWSError>;
  /**
   * Provides a list of custom vocabularies that match the specified criteria. If no criteria are specified, all custom vocabularies are returned. To get detailed information about a specific custom vocabulary, use the operation.
   */
  listVocabularies(params: TranscribeService.Types.ListVocabulariesRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListVocabulariesResponse) => void): Request<TranscribeService.Types.ListVocabulariesResponse, AWSError>;
  /**
   * Provides a list of custom vocabularies that match the specified criteria. If no criteria are specified, all custom vocabularies are returned. To get detailed information about a specific custom vocabulary, use the operation.
   */
  listVocabularies(callback?: (err: AWSError, data: TranscribeService.Types.ListVocabulariesResponse) => void): Request<TranscribeService.Types.ListVocabulariesResponse, AWSError>;
  /**
   * Provides a list of custom vocabulary filters that match the specified criteria. If no criteria are specified, all custom vocabularies are returned. To get detailed information about a specific custom vocabulary filter, use the operation.
   */
  listVocabularyFilters(params: TranscribeService.Types.ListVocabularyFiltersRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListVocabularyFiltersResponse) => void): Request<TranscribeService.Types.ListVocabularyFiltersResponse, AWSError>;
  /**
   * Provides a list of custom vocabulary filters that match the specified criteria. If no criteria are specified, all custom vocabularies are returned. To get detailed information about a specific custom vocabulary filter, use the operation.
   */
  listVocabularyFilters(callback?: (err: AWSError, data: TranscribeService.Types.ListVocabularyFiltersResponse) => void): Request<TranscribeService.Types.ListVocabularyFiltersResponse, AWSError>;
  /**
   * Transcribes the audio from a customer service call and applies any additional Request Parameters you choose to include in your request. In addition to many standard transcription features, Call Analytics provides you with call characteristics, call summarization, speaker sentiment, and optional redaction of your text transcript and your audio file. You can also apply custom categories to flag specified conditions. To learn more about these features and insights, refer to Analyzing call center audio with Call Analytics. If you want to apply categories to your Call Analytics job, you must create them before submitting your job request. Categories cannot be retroactively applied to a job. To create a new category, use the operation. To learn more about Call Analytics categories, see Creating categories for post-call transcriptions and Creating categories for real-time transcriptions. To make a StartCallAnalyticsJob request, you must first upload your media file into an Amazon S3 bucket; you can then specify the Amazon S3 location of the file using the Media parameter. Note that job queuing is enabled by default for Call Analytics jobs. You must include the following parameters in your StartCallAnalyticsJob request:    region: The Amazon Web Services Region where you are making your request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and quotas.    CallAnalyticsJobName: A custom name that you create for your transcription job that's unique within your Amazon Web Services account.    DataAccessRoleArn: The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files.    Media (MediaFileUri or RedactedMediaFileUri): The Amazon S3 location of your media file.    With Call Analytics, you can redact the audio contained in your media file by including RedactedMediaFileUri, instead of MediaFileUri, to specify the location of your input audio. If you choose to redact your audio, you can find your redacted media at the location specified in the RedactedMediaFileUri field of your response. 
   */
  startCallAnalyticsJob(params: TranscribeService.Types.StartCallAnalyticsJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.StartCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.StartCallAnalyticsJobResponse, AWSError>;
  /**
   * Transcribes the audio from a customer service call and applies any additional Request Parameters you choose to include in your request. In addition to many standard transcription features, Call Analytics provides you with call characteristics, call summarization, speaker sentiment, and optional redaction of your text transcript and your audio file. You can also apply custom categories to flag specified conditions. To learn more about these features and insights, refer to Analyzing call center audio with Call Analytics. If you want to apply categories to your Call Analytics job, you must create them before submitting your job request. Categories cannot be retroactively applied to a job. To create a new category, use the operation. To learn more about Call Analytics categories, see Creating categories for post-call transcriptions and Creating categories for real-time transcriptions. To make a StartCallAnalyticsJob request, you must first upload your media file into an Amazon S3 bucket; you can then specify the Amazon S3 location of the file using the Media parameter. Note that job queuing is enabled by default for Call Analytics jobs. You must include the following parameters in your StartCallAnalyticsJob request:    region: The Amazon Web Services Region where you are making your request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and quotas.    CallAnalyticsJobName: A custom name that you create for your transcription job that's unique within your Amazon Web Services account.    DataAccessRoleArn: The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files.    Media (MediaFileUri or RedactedMediaFileUri): The Amazon S3 location of your media file.    With Call Analytics, you can redact the audio contained in your media file by including RedactedMediaFileUri, instead of MediaFileUri, to specify the location of your input audio. If you choose to redact your audio, you can find your redacted media at the location specified in the RedactedMediaFileUri field of your response. 
   */
  startCallAnalyticsJob(callback?: (err: AWSError, data: TranscribeService.Types.StartCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.StartCallAnalyticsJobResponse, AWSError>;
  /**
   * Transcribes the audio from a medical dictation or conversation and applies any additional Request Parameters you choose to include in your request. In addition to many standard transcription features, Amazon Transcribe Medical provides you with a robust medical vocabulary and, optionally, content identification, which adds flags to personal health information (PHI). To learn more about these features, refer to How Amazon Transcribe Medical works. To make a StartMedicalTranscriptionJob request, you must first upload your media file into an Amazon S3 bucket; you can then specify the S3 location of the file using the Media parameter. You must include the following parameters in your StartMedicalTranscriptionJob request:    region: The Amazon Web Services Region where you are making your request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and quotas.    MedicalTranscriptionJobName: A custom name you create for your transcription job that is unique within your Amazon Web Services account.    Media (MediaFileUri): The Amazon S3 location of your media file.    LanguageCode: This must be en-US.    OutputBucketName: The Amazon S3 bucket where you want your transcript stored. If you want your output stored in a sub-folder of this bucket, you must also include OutputKey.    Specialty: This must be PRIMARYCARE.    Type: Choose whether your audio is a conversation or a dictation.  
   */
  startMedicalTranscriptionJob(params: TranscribeService.Types.StartMedicalTranscriptionJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.StartMedicalTranscriptionJobResponse) => void): Request<TranscribeService.Types.StartMedicalTranscriptionJobResponse, AWSError>;
  /**
   * Transcribes the audio from a medical dictation or conversation and applies any additional Request Parameters you choose to include in your request. In addition to many standard transcription features, Amazon Transcribe Medical provides you with a robust medical vocabulary and, optionally, content identification, which adds flags to personal health information (PHI). To learn more about these features, refer to How Amazon Transcribe Medical works. To make a StartMedicalTranscriptionJob request, you must first upload your media file into an Amazon S3 bucket; you can then specify the S3 location of the file using the Media parameter. You must include the following parameters in your StartMedicalTranscriptionJob request:    region: The Amazon Web Services Region where you are making your request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and quotas.    MedicalTranscriptionJobName: A custom name you create for your transcription job that is unique within your Amazon Web Services account.    Media (MediaFileUri): The Amazon S3 location of your media file.    LanguageCode: This must be en-US.    OutputBucketName: The Amazon S3 bucket where you want your transcript stored. If you want your output stored in a sub-folder of this bucket, you must also include OutputKey.    Specialty: This must be PRIMARYCARE.    Type: Choose whether your audio is a conversation or a dictation.  
   */
  startMedicalTranscriptionJob(callback?: (err: AWSError, data: TranscribeService.Types.StartMedicalTranscriptionJobResponse) => void): Request<TranscribeService.Types.StartMedicalTranscriptionJobResponse, AWSError>;
  /**
   * Transcribes the audio from a media file and applies any additional Request Parameters you choose to include in your request. To make a StartTranscriptionJob request, you must first upload your media file into an Amazon S3 bucket; you can then specify the Amazon S3 location of the file using the Media parameter. You must include the following parameters in your StartTranscriptionJob request:    region: The Amazon Web Services Region where you are making your request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and quotas.    TranscriptionJobName: A custom name you create for your transcription job that is unique within your Amazon Web Services account.    Media (MediaFileUri): The Amazon S3 location of your media file.   One of LanguageCode, IdentifyLanguage, or IdentifyMultipleLanguages: If you know the language of your media file, specify it using the LanguageCode parameter; you can find all valid language codes in the Supported languages table. If you don't know the languages spoken in your media, use either IdentifyLanguage or IdentifyMultipleLanguages and let Amazon Transcribe identify the languages for you.  
   */
  startTranscriptionJob(params: TranscribeService.Types.StartTranscriptionJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.StartTranscriptionJobResponse) => void): Request<TranscribeService.Types.StartTranscriptionJobResponse, AWSError>;
  /**
   * Transcribes the audio from a media file and applies any additional Request Parameters you choose to include in your request. To make a StartTranscriptionJob request, you must first upload your media file into an Amazon S3 bucket; you can then specify the Amazon S3 location of the file using the Media parameter. You must include the following parameters in your StartTranscriptionJob request:    region: The Amazon Web Services Region where you are making your request. For a list of Amazon Web Services Regions supported with Amazon Transcribe, refer to Amazon Transcribe endpoints and quotas.    TranscriptionJobName: A custom name you create for your transcription job that is unique within your Amazon Web Services account.    Media (MediaFileUri): The Amazon S3 location of your media file.   One of LanguageCode, IdentifyLanguage, or IdentifyMultipleLanguages: If you know the language of your media file, specify it using the LanguageCode parameter; you can find all valid language codes in the Supported languages table. If you don't know the languages spoken in your media, use either IdentifyLanguage or IdentifyMultipleLanguages and let Amazon Transcribe identify the languages for you.  
   */
  startTranscriptionJob(callback?: (err: AWSError, data: TranscribeService.Types.StartTranscriptionJobResponse) => void): Request<TranscribeService.Types.StartTranscriptionJobResponse, AWSError>;
  /**
   * Adds one or more custom tags, each in the form of a key:value pair, to the specified resource. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
   */
  tagResource(params: TranscribeService.Types.TagResourceRequest, callback?: (err: AWSError, data: TranscribeService.Types.TagResourceResponse) => void): Request<TranscribeService.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more custom tags, each in the form of a key:value pair, to the specified resource. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
   */
  tagResource(callback?: (err: AWSError, data: TranscribeService.Types.TagResourceResponse) => void): Request<TranscribeService.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified Amazon Transcribe resource. If you include UntagResource in your request, you must also include ResourceArn and TagKeys.
   */
  untagResource(params: TranscribeService.Types.UntagResourceRequest, callback?: (err: AWSError, data: TranscribeService.Types.UntagResourceResponse) => void): Request<TranscribeService.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified Amazon Transcribe resource. If you include UntagResource in your request, you must also include ResourceArn and TagKeys.
   */
  untagResource(callback?: (err: AWSError, data: TranscribeService.Types.UntagResourceResponse) => void): Request<TranscribeService.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified Call Analytics category with new rules. Note that the UpdateCallAnalyticsCategory operation overwrites all existing rules contained in the specified category. You cannot append additional rules onto an existing category. To create a new category, see .
   */
  updateCallAnalyticsCategory(params: TranscribeService.Types.UpdateCallAnalyticsCategoryRequest, callback?: (err: AWSError, data: TranscribeService.Types.UpdateCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.UpdateCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Updates the specified Call Analytics category with new rules. Note that the UpdateCallAnalyticsCategory operation overwrites all existing rules contained in the specified category. You cannot append additional rules onto an existing category. To create a new category, see .
   */
  updateCallAnalyticsCategory(callback?: (err: AWSError, data: TranscribeService.Types.UpdateCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.UpdateCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Updates an existing custom medical vocabulary with new values. This operation overwrites all existing information with your new values; you cannot append new terms onto an existing custom vocabulary.
   */
  updateMedicalVocabulary(params: TranscribeService.Types.UpdateMedicalVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.UpdateMedicalVocabularyResponse) => void): Request<TranscribeService.Types.UpdateMedicalVocabularyResponse, AWSError>;
  /**
   * Updates an existing custom medical vocabulary with new values. This operation overwrites all existing information with your new values; you cannot append new terms onto an existing custom vocabulary.
   */
  updateMedicalVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.UpdateMedicalVocabularyResponse) => void): Request<TranscribeService.Types.UpdateMedicalVocabularyResponse, AWSError>;
  /**
   * Updates an existing custom vocabulary with new values. This operation overwrites all existing information with your new values; you cannot append new terms onto an existing custom vocabulary.
   */
  updateVocabulary(params: TranscribeService.Types.UpdateVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.UpdateVocabularyResponse) => void): Request<TranscribeService.Types.UpdateVocabularyResponse, AWSError>;
  /**
   * Updates an existing custom vocabulary with new values. This operation overwrites all existing information with your new values; you cannot append new terms onto an existing custom vocabulary.
   */
  updateVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.UpdateVocabularyResponse) => void): Request<TranscribeService.Types.UpdateVocabularyResponse, AWSError>;
  /**
   * Updates an existing custom vocabulary filter with a new list of words. The new list you provide overwrites all previous entries; you cannot append new terms onto an existing custom vocabulary filter.
   */
  updateVocabularyFilter(params: TranscribeService.Types.UpdateVocabularyFilterRequest, callback?: (err: AWSError, data: TranscribeService.Types.UpdateVocabularyFilterResponse) => void): Request<TranscribeService.Types.UpdateVocabularyFilterResponse, AWSError>;
  /**
   * Updates an existing custom vocabulary filter with a new list of words. The new list you provide overwrites all previous entries; you cannot append new terms onto an existing custom vocabulary filter.
   */
  updateVocabularyFilter(callback?: (err: AWSError, data: TranscribeService.Types.UpdateVocabularyFilterResponse) => void): Request<TranscribeService.Types.UpdateVocabularyFilterResponse, AWSError>;
}
declare namespace TranscribeService {
  export interface AbsoluteTimeRange {
    /**
     * The time, in milliseconds, when Amazon Transcribe starts searching for the specified criteria in your audio. If you include StartTime in your request, you must also include EndTime.
     */
    StartTime?: TimestampMilliseconds;
    /**
     * The time, in milliseconds, when Amazon Transcribe stops searching for the specified criteria in your audio. If you include EndTime in your request, you must also include StartTime.
     */
    EndTime?: TimestampMilliseconds;
    /**
     * The time, in milliseconds, from the start of your media file until the specified value. Amazon Transcribe searches for your specified criteria in this time segment.
     */
    First?: TimestampMilliseconds;
    /**
     * The time, in milliseconds, from the specified value until the end of your media file. Amazon Transcribe searches for your specified criteria in this time segment.
     */
    Last?: TimestampMilliseconds;
  }
  export type BaseModelName = "NarrowBand"|"WideBand"|string;
  export type Boolean = boolean;
  export type CLMLanguageCode = "en-US"|"hi-IN"|"es-US"|"en-GB"|"en-AU"|"de-DE"|"ja-JP"|string;
  export interface CallAnalyticsJob {
    /**
     * The name of the Call Analytics job. Job names are case sensitive and must be unique within an Amazon Web Services account.
     */
    CallAnalyticsJobName?: CallAnalyticsJobName;
    /**
     * Provides the status of the specified Call Analytics job. If the status is COMPLETED, the job is finished and you can find the results at the location specified in TranscriptFileUri (or RedactedTranscriptFileUri, if you requested transcript redaction). If the status is FAILED, FailureReason provides details on why your transcription job failed.
     */
    CallAnalyticsJobStatus?: CallAnalyticsJobStatus;
    /**
     * The language code used to create your Call Analytics job. For a list of supported languages and their associated language codes, refer to the Supported languages table. If you don't know the language spoken in your media file, you can omit this field and let Amazon Transcribe automatically identify the language of your media. To improve the accuracy of language identification, you can include several language codes and Amazon Transcribe chooses the closest match for your transcription.
     */
    LanguageCode?: LanguageCode;
    /**
     * The sample rate, in hertz, of the audio track in your input media file.
     */
    MediaSampleRateHertz?: MediaSampleRateHertz;
    /**
     * The format of the input media file.
     */
    MediaFormat?: MediaFormat;
    /**
     * Provides the Amazon S3 location of the media file you used in your Call Analytics request.
     */
    Media?: Media;
    Transcript?: Transcript;
    /**
     * The date and time the specified Call Analytics job began processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.789000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    StartTime?: DateTime;
    /**
     * The date and time the specified Call Analytics job request was made. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    CreationTime?: DateTime;
    /**
     * The date and time the specified Call Analytics job finished processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:33:13.922000-07:00 represents a transcription job that started processing at 12:33 PM UTC-7 on May 4, 2022.
     */
    CompletionTime?: DateTime;
    /**
     * If CallAnalyticsJobStatus is FAILED, FailureReason contains information about why the Call Analytics job request failed. The FailureReason field contains one of the following values:    Unsupported media format. The media format specified in MediaFormat isn't valid. Refer to MediaFormat for a list of supported formats.    The media format provided does not match the detected media format. The media format specified in MediaFormat doesn't match the format of the input file. Check the media format of your media file and correct the specified value.    Invalid sample rate for audio file. The sample rate specified in MediaSampleRateHertz isn't valid. The sample rate must be between 8,000 and 48,000 hertz.    The sample rate provided does not match the detected sample rate. The sample rate specified in MediaSampleRateHertz doesn't match the sample rate detected in your input media file. Check the sample rate of your media file and correct the specified value.    Invalid file size: file size too large. The size of your media file is larger than what Amazon Transcribe can process. For more information, refer to Guidelines and quotas.    Invalid number of channels: number of channels too large. Your audio contains more channels than Amazon Transcribe is able to process. For more information, refer to Guidelines and quotas.  
     */
    FailureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) you included in your request.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
    /**
     * The confidence score associated with the language identified in your media file. Confidence scores are values between 0 and 1; a larger value indicates a higher probability that the identified language correctly matches the language spoken in your media.
     */
    IdentifiedLanguageScore?: IdentifiedLanguageScore;
    /**
     * Provides information on any additional settings that were included in your request. Additional settings include content redaction and language identification settings.
     */
    Settings?: CallAnalyticsJobSettings;
    /**
     * Indicates which speaker is on which channel.
     */
    ChannelDefinitions?: ChannelDefinitions;
  }
  export type CallAnalyticsJobName = string;
  export interface CallAnalyticsJobSettings {
    /**
     * The name of the custom vocabulary you want to include in your Call Analytics transcription request. Custom vocabulary names are case sensitive.
     */
    VocabularyName?: VocabularyName;
    /**
     * The name of the custom vocabulary filter you want to include in your Call Analytics transcription request. Custom vocabulary filter names are case sensitive. Note that if you include VocabularyFilterName in your request, you must also include VocabularyFilterMethod.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * Specify how you want your custom vocabulary filter applied to your transcript. To replace words with ***, choose mask. To delete words, choose remove. To flag words without changing them, choose tag.
     */
    VocabularyFilterMethod?: VocabularyFilterMethod;
    /**
     * The name of the custom language model you want to use when processing your Call Analytics job. Note that custom language model names are case sensitive. The language of the specified custom language model must match the language code that you specify in your transcription request. If the languages don't match, the custom language model isn't applied. There are no errors or warnings associated with a language mismatch.
     */
    LanguageModelName?: ModelName;
    ContentRedaction?: ContentRedaction;
    /**
     * You can specify two or more language codes that represent the languages you think may be present in your media. Including more than five is not recommended. If you're unsure what languages are present, do not include this parameter. Including language options can improve the accuracy of language identification. For a list of languages supported with Call Analytics, refer to the Supported languages table. To transcribe speech in Modern Standard Arabic (ar-SA), your media file must be encoded at a sample rate of 16,000 Hz or higher.
     */
    LanguageOptions?: LanguageOptions;
    /**
     * If using automatic language identification in your request and you want to apply a custom language model, a custom vocabulary, or a custom vocabulary filter, include LanguageIdSettings with the relevant sub-parameters (VocabularyName, LanguageModelName, and VocabularyFilterName).  LanguageIdSettings supports two to five language codes. Each language code you include can have an associated custom language model, custom vocabulary, and custom vocabulary filter. The language codes that you specify must match the languages of the associated custom language models, custom vocabularies, and custom vocabulary filters. It's recommended that you include LanguageOptions when using LanguageIdSettings to ensure that the correct language dialect is identified. For example, if you specify a custom vocabulary that is in en-US but Amazon Transcribe determines that the language spoken in your media is en-AU, your custom vocabulary is not applied to your transcription. If you include LanguageOptions and include en-US as the only English language dialect, your custom vocabulary is applied to your transcription. If you want to include a custom language model, custom vocabulary, or custom vocabulary filter with your request but do not want to use automatic language identification, use instead the  parameter with the LanguageModelName, VocabularyName, or VocabularyFilterName sub-parameters. For a list of languages supported with Call Analytics, refer to Supported languages and language-specific features.
     */
    LanguageIdSettings?: LanguageIdSettingsMap;
  }
  export type CallAnalyticsJobStatus = "QUEUED"|"IN_PROGRESS"|"FAILED"|"COMPLETED"|string;
  export type CallAnalyticsJobSummaries = CallAnalyticsJobSummary[];
  export interface CallAnalyticsJobSummary {
    /**
     * The name of the Call Analytics job. Job names are case sensitive and must be unique within an Amazon Web Services account.
     */
    CallAnalyticsJobName?: CallAnalyticsJobName;
    /**
     * The date and time the specified Call Analytics job request was made. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    CreationTime?: DateTime;
    /**
     * The date and time your Call Analytics job began processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.789000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    StartTime?: DateTime;
    /**
     * The date and time the specified Call Analytics job finished processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:33:13.922000-07:00 represents a transcription job that started processing at 12:33 PM UTC-7 on May 4, 2022.
     */
    CompletionTime?: DateTime;
    /**
     * The language code used to create your Call Analytics transcription.
     */
    LanguageCode?: LanguageCode;
    /**
     * Provides the status of your Call Analytics job. If the status is COMPLETED, the job is finished and you can find the results at the location specified in TranscriptFileUri (or RedactedTranscriptFileUri, if you requested transcript redaction). If the status is FAILED, FailureReason provides details on why your transcription job failed.
     */
    CallAnalyticsJobStatus?: CallAnalyticsJobStatus;
    /**
     * If CallAnalyticsJobStatus is FAILED, FailureReason contains information about why the Call Analytics job failed. See also: Common Errors.
     */
    FailureReason?: FailureReason;
  }
  export type CategoryName = string;
  export interface CategoryProperties {
    /**
     * The name of the Call Analytics category. Category names are case sensitive and must be unique within an Amazon Web Services account.
     */
    CategoryName?: CategoryName;
    /**
     * The rules used to define a Call Analytics category. Each category can have between 1 and 20 rules.
     */
    Rules?: RuleList;
    /**
     * The date and time the specified Call Analytics category was created. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    CreateTime?: DateTime;
    /**
     * The date and time the specified Call Analytics category was last updated. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-05T12:45:32.691000-07:00 represents 12:45 PM UTC-7 on May 5, 2022.
     */
    LastUpdateTime?: DateTime;
    /**
     * The input type associated with the specified category. POST_CALL refers to a category that is applied to batch transcriptions; REAL_TIME refers to a category that is applied to streaming transcriptions.
     */
    InputType?: InputType;
  }
  export type CategoryPropertiesList = CategoryProperties[];
  export interface ChannelDefinition {
    /**
     * Specify the audio channel you want to define.
     */
    ChannelId?: ChannelId;
    /**
     * Specify the speaker you want to define. Omitting this parameter is equivalent to specifying both participants.
     */
    ParticipantRole?: ParticipantRole;
  }
  export type ChannelDefinitions = ChannelDefinition[];
  export type ChannelId = number;
  export interface ContentRedaction {
    /**
     * Specify the category of information you want to redact; PII (personally identifiable information) is the only valid value. You can use PiiEntityTypes to choose which types of PII you want to redact.
     */
    RedactionType: RedactionType;
    /**
     * Specify if you want only a redacted transcript, or if you want a redacted and an unredacted transcript. When you choose redacted Amazon Transcribe creates only a redacted transcript. When you choose redacted_and_unredacted Amazon Transcribe creates a redacted and an unredacted transcript (as two separate files).
     */
    RedactionOutput: RedactionOutput;
    /**
     * Specify which types of personally identifiable information (PII) you want to redact in your transcript. You can include as many types as you'd like, or you can select ALL.
     */
    PiiEntityTypes?: PiiEntityTypes;
  }
  export interface CreateCallAnalyticsCategoryRequest {
    /**
     * A unique name, chosen by you, for your Call Analytics category. It's helpful to use a detailed naming system that will make sense to you in the future. For example, it's better to use sentiment-positive-last30seconds for a category over a generic name like test-category. Category names are case sensitive.
     */
    CategoryName: CategoryName;
    /**
     * Rules define a Call Analytics category. When creating a new category, you must create between 1 and 20 rules for that category. For each rule, you specify a filter you want applied to the attributes of a call. For example, you can choose a sentiment filter that detects if a customer's sentiment was positive during the last 30 seconds of the call.
     */
    Rules: RuleList;
    /**
     * Choose whether you want to create a real-time or a post-call category for your Call Analytics transcription. Specifying POST_CALL assigns your category to post-call transcriptions; categories with this input type cannot be applied to streaming (real-time) transcriptions. Specifying REAL_TIME assigns your category to streaming transcriptions; categories with this input type cannot be applied to post-call transcriptions. If you do not include InputType, your category is created as a post-call category by default.
     */
    InputType?: InputType;
  }
  export interface CreateCallAnalyticsCategoryResponse {
    /**
     * Provides you with the properties of your new category, including its associated rules.
     */
    CategoryProperties?: CategoryProperties;
  }
  export interface CreateLanguageModelRequest {
    /**
     * The language code that represents the language of your model. Each custom language model must contain terms in only one language, and the language you select for your custom language model must match the language of your training and tuning data. For a list of supported languages and their associated language codes, refer to the Supported languages table. Note that US English (en-US) is the only language supported with Amazon Transcribe Medical. A custom language model can only be used to transcribe files in the same language as the model. For example, if you create a custom language model using US English (en-US), you can only apply this model to files that contain English audio.
     */
    LanguageCode: CLMLanguageCode;
    /**
     * The Amazon Transcribe standard language model, or base model, used to create your custom language model. Amazon Transcribe offers two options for base models: Wideband and Narrowband. If the audio you want to transcribe has a sample rate of 16,000 Hz or greater, choose WideBand. To transcribe audio with a sample rate less than 16,000 Hz, choose NarrowBand.
     */
    BaseModelName: BaseModelName;
    /**
     * A unique name, chosen by you, for your custom language model. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account. If you try to create a new custom language model with the same name as an existing custom language model, you get a ConflictException error.
     */
    ModelName: ModelName;
    /**
     * Contains the Amazon S3 location of the training data you want to use to create a new custom language model, and permissions to access this location. When using InputDataConfig, you must include these sub-parameters: S3Uri, which is the Amazon S3 location of your training data, and DataAccessRoleArn, which is the Amazon Resource Name (ARN) of the role that has permission to access your specified Amazon S3 location. You can optionally include TuningDataS3Uri, which is the Amazon S3 location of your tuning data. If you specify different Amazon S3 locations for training and tuning data, the ARN you use must have permissions to access both locations.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Adds one or more custom tags, each in the form of a key:value pair, to a new custom language model at the time you create this new model. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
     */
    Tags?: TagList;
  }
  export interface CreateLanguageModelResponse {
    /**
     * The language code you selected for your custom language model.
     */
    LanguageCode?: CLMLanguageCode;
    /**
     * The Amazon Transcribe standard language model, or base model, you specified when creating your custom language model.
     */
    BaseModelName?: BaseModelName;
    /**
     * The name of your custom language model.
     */
    ModelName?: ModelName;
    /**
     * Lists your data access role ARN (Amazon Resource Name) and the Amazon S3 locations you provided for your training (S3Uri) and tuning (TuningDataS3Uri) data.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The status of your custom language model. When the status displays as COMPLETED, your model is ready to use.
     */
    ModelStatus?: ModelStatus;
  }
  export interface CreateMedicalVocabularyRequest {
    /**
     * A unique name, chosen by you, for your new custom medical vocabulary. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account. If you try to create a new custom medical vocabulary with the same name as an existing custom medical vocabulary, you get a ConflictException error.
     */
    VocabularyName: VocabularyName;
    /**
     * The language code that represents the language of the entries in your custom vocabulary. US English (en-US) is the only language supported with Amazon Transcribe Medical.
     */
    LanguageCode: LanguageCode;
    /**
     * The Amazon S3 location (URI) of the text file that contains your custom medical vocabulary. The URI must be in the same Amazon Web Services Region as the resource you're calling. Here's an example URI path: s3://DOC-EXAMPLE-BUCKET/my-vocab-file.txt 
     */
    VocabularyFileUri: Uri;
    /**
     * Adds one or more custom tags, each in the form of a key:value pair, to a new custom medical vocabulary at the time you create this new custom vocabulary. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
     */
    Tags?: TagList;
  }
  export interface CreateMedicalVocabularyResponse {
    /**
     * The name you chose for your custom medical vocabulary.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code you selected for your custom medical vocabulary. US English (en-US) is the only language supported with Amazon Transcribe Medical.
     */
    LanguageCode?: LanguageCode;
    /**
     * The processing state of your custom medical vocabulary. If the state is READY, you can use the custom vocabulary in a StartMedicalTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
    /**
     * The date and time you created your custom medical vocabulary. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * If VocabularyState is FAILED, FailureReason contains information about why the medical transcription job request failed. See also: Common Errors.
     */
    FailureReason?: FailureReason;
  }
  export interface CreateVocabularyFilterRequest {
    /**
     * A unique name, chosen by you, for your new custom vocabulary filter. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account. If you try to create a new custom vocabulary filter with the same name as an existing custom vocabulary filter, you get a ConflictException error.
     */
    VocabularyFilterName: VocabularyFilterName;
    /**
     * The language code that represents the language of the entries in your vocabulary filter. Each custom vocabulary filter must contain terms in only one language. A custom vocabulary filter can only be used to transcribe files in the same language as the filter. For example, if you create a custom vocabulary filter using US English (en-US), you can only apply this filter to files that contain English audio. For a list of supported languages and their associated language codes, refer to the Supported languages table.
     */
    LanguageCode: LanguageCode;
    /**
     * Use this parameter if you want to create your custom vocabulary filter by including all desired terms, as comma-separated values, within your request. The other option for creating your vocabulary filter is to save your entries in a text file and upload them to an Amazon S3 bucket, then specify the location of your file using the VocabularyFilterFileUri parameter. Note that if you include Words in your request, you cannot use VocabularyFilterFileUri; you must choose one or the other. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary filter request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language.
     */
    Words?: Words;
    /**
     * The Amazon S3 location of the text file that contains your custom vocabulary filter terms. The URI must be located in the same Amazon Web Services Region as the resource you're calling. Here's an example URI path: s3://DOC-EXAMPLE-BUCKET/my-vocab-filter-file.txt  Note that if you include VocabularyFilterFileUri in your request, you cannot use Words; you must choose one or the other.
     */
    VocabularyFilterFileUri?: Uri;
    /**
     * Adds one or more custom tags, each in the form of a key:value pair, to a new custom vocabulary filter at the time you create this new vocabulary filter. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
     */
    Tags?: TagList;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files (in this case, your custom vocabulary filter). If the role that you specify doesn’t have the appropriate permissions to access the specified Amazon S3 location, your request fails. IAM role ARNs have the format arn:partition:iam::account:role/role-name-with-path. For example: arn:aws:iam::111122223333:role/Admin. For more information, see IAM ARNs.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
  }
  export interface CreateVocabularyFilterResponse {
    /**
     * The name you chose for your custom vocabulary filter.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The language code you selected for your custom vocabulary filter.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time you created your custom vocabulary filter. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
  }
  export interface CreateVocabularyRequest {
    /**
     * A unique name, chosen by you, for your new custom vocabulary. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account. If you try to create a new custom vocabulary with the same name as an existing custom vocabulary, you get a ConflictException error.
     */
    VocabularyName: VocabularyName;
    /**
     * The language code that represents the language of the entries in your custom vocabulary. Each custom vocabulary must contain terms in only one language. A custom vocabulary can only be used to transcribe files in the same language as the custom vocabulary. For example, if you create a custom vocabulary using US English (en-US), you can only apply this custom vocabulary to files that contain English audio. For a list of supported languages and their associated language codes, refer to the Supported languages table.
     */
    LanguageCode: LanguageCode;
    /**
     * Use this parameter if you want to create your custom vocabulary by including all desired terms, as comma-separated values, within your request. The other option for creating your custom vocabulary is to save your entries in a text file and upload them to an Amazon S3 bucket, then specify the location of your file using the VocabularyFileUri parameter. Note that if you include Phrases in your request, you cannot use VocabularyFileUri; you must choose one or the other. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary filter request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language.
     */
    Phrases?: Phrases;
    /**
     * The Amazon S3 location of the text file that contains your custom vocabulary. The URI must be located in the same Amazon Web Services Region as the resource you're calling. Here's an example URI path: s3://DOC-EXAMPLE-BUCKET/my-vocab-file.txt  Note that if you include VocabularyFileUri in your request, you cannot use the Phrases flag; you must choose one or the other.
     */
    VocabularyFileUri?: Uri;
    /**
     * Adds one or more custom tags, each in the form of a key:value pair, to a new custom vocabulary at the time you create this new custom vocabulary. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
     */
    Tags?: TagList;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files (in this case, your custom vocabulary). If the role that you specify doesn’t have the appropriate permissions to access the specified Amazon S3 location, your request fails. IAM role ARNs have the format arn:partition:iam::account:role/role-name-with-path. For example: arn:aws:iam::111122223333:role/Admin. For more information, see IAM ARNs.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
  }
  export interface CreateVocabularyResponse {
    /**
     * The name you chose for your custom vocabulary.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code you selected for your custom vocabulary.
     */
    LanguageCode?: LanguageCode;
    /**
     * The processing state of your custom vocabulary. If the state is READY, you can use the custom vocabulary in a StartTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
    /**
     * The date and time you created your custom vocabulary. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * If VocabularyState is FAILED, FailureReason contains information about why the custom vocabulary request failed. See also: Common Errors.
     */
    FailureReason?: FailureReason;
  }
  export type DataAccessRoleArn = string;
  export type DateTime = Date;
  export interface DeleteCallAnalyticsCategoryRequest {
    /**
     * The name of the Call Analytics category you want to delete. Category names are case sensitive.
     */
    CategoryName: CategoryName;
  }
  export interface DeleteCallAnalyticsCategoryResponse {
  }
  export interface DeleteCallAnalyticsJobRequest {
    /**
     * The name of the Call Analytics job you want to delete. Job names are case sensitive.
     */
    CallAnalyticsJobName: CallAnalyticsJobName;
  }
  export interface DeleteCallAnalyticsJobResponse {
  }
  export interface DeleteLanguageModelRequest {
    /**
     * The name of the custom language model you want to delete. Model names are case sensitive.
     */
    ModelName: ModelName;
  }
  export interface DeleteMedicalTranscriptionJobRequest {
    /**
     * The name of the medical transcription job you want to delete. Job names are case sensitive.
     */
    MedicalTranscriptionJobName: TranscriptionJobName;
  }
  export interface DeleteMedicalVocabularyRequest {
    /**
     * The name of the custom medical vocabulary you want to delete. Custom medical vocabulary names are case sensitive.
     */
    VocabularyName: VocabularyName;
  }
  export interface DeleteTranscriptionJobRequest {
    /**
     * The name of the transcription job you want to delete. Job names are case sensitive.
     */
    TranscriptionJobName: TranscriptionJobName;
  }
  export interface DeleteVocabularyFilterRequest {
    /**
     * The name of the custom vocabulary filter you want to delete. Custom vocabulary filter names are case sensitive.
     */
    VocabularyFilterName: VocabularyFilterName;
  }
  export interface DeleteVocabularyRequest {
    /**
     * The name of the custom vocabulary you want to delete. Custom vocabulary names are case sensitive.
     */
    VocabularyName: VocabularyName;
  }
  export interface DescribeLanguageModelRequest {
    /**
     * The name of the custom language model you want information about. Model names are case sensitive.
     */
    ModelName: ModelName;
  }
  export interface DescribeLanguageModelResponse {
    /**
     * Provides information about the specified custom language model. This parameter also shows if the base language model you used to create your custom language model has been updated. If Amazon Transcribe has updated the base model, you can create a new custom language model using the updated base model. If you tried to create a new custom language model and the request wasn't successful, you can use this DescribeLanguageModel to help identify the reason for this failure.
     */
    LanguageModel?: LanguageModel;
  }
  export type DurationInSeconds = number;
  export type FailureReason = string;
  export interface GetCallAnalyticsCategoryRequest {
    /**
     * The name of the Call Analytics category you want information about. Category names are case sensitive.
     */
    CategoryName: CategoryName;
  }
  export interface GetCallAnalyticsCategoryResponse {
    /**
     * Provides you with the properties of the Call Analytics category you specified in your GetCallAnalyticsCategory request.
     */
    CategoryProperties?: CategoryProperties;
  }
  export interface GetCallAnalyticsJobRequest {
    /**
     * The name of the Call Analytics job you want information about. Job names are case sensitive.
     */
    CallAnalyticsJobName: CallAnalyticsJobName;
  }
  export interface GetCallAnalyticsJobResponse {
    /**
     * Provides detailed information about the specified Call Analytics job, including job status and, if applicable, failure reason.
     */
    CallAnalyticsJob?: CallAnalyticsJob;
  }
  export interface GetMedicalTranscriptionJobRequest {
    /**
     * The name of the medical transcription job you want information about. Job names are case sensitive.
     */
    MedicalTranscriptionJobName: TranscriptionJobName;
  }
  export interface GetMedicalTranscriptionJobResponse {
    /**
     * Provides detailed information about the specified medical transcription job, including job status and, if applicable, failure reason.
     */
    MedicalTranscriptionJob?: MedicalTranscriptionJob;
  }
  export interface GetMedicalVocabularyRequest {
    /**
     * The name of the custom medical vocabulary you want information about. Custom medical vocabulary names are case sensitive.
     */
    VocabularyName: VocabularyName;
  }
  export interface GetMedicalVocabularyResponse {
    /**
     * The name of the custom medical vocabulary you requested information about.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code you selected for your custom medical vocabulary. US English (en-US) is the only language supported with Amazon Transcribe Medical.
     */
    LanguageCode?: LanguageCode;
    /**
     * The processing state of your custom medical vocabulary. If the state is READY, you can use the custom vocabulary in a StartMedicalTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
    /**
     * The date and time the specified custom medical vocabulary was last modified. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * If VocabularyState is FAILED, FailureReason contains information about why the custom medical vocabulary request failed. See also: Common Errors.
     */
    FailureReason?: FailureReason;
    /**
     * The S3 location where the specified custom medical vocabulary is stored; use this URI to view or download the custom vocabulary.
     */
    DownloadUri?: Uri;
  }
  export interface GetTranscriptionJobRequest {
    /**
     * The name of the transcription job you want information about. Job names are case sensitive.
     */
    TranscriptionJobName: TranscriptionJobName;
  }
  export interface GetTranscriptionJobResponse {
    /**
     * Provides detailed information about the specified transcription job, including job status and, if applicable, failure reason.
     */
    TranscriptionJob?: TranscriptionJob;
  }
  export interface GetVocabularyFilterRequest {
    /**
     * The name of the custom vocabulary filter you want information about. Custom vocabulary filter names are case sensitive.
     */
    VocabularyFilterName: VocabularyFilterName;
  }
  export interface GetVocabularyFilterResponse {
    /**
     * The name of the custom vocabulary filter you requested information about.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The language code you selected for your custom vocabulary filter.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time the specified custom vocabulary filter was last modified. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * The Amazon S3 location where the custom vocabulary filter is stored; use this URI to view or download the custom vocabulary filter.
     */
    DownloadUri?: Uri;
  }
  export interface GetVocabularyRequest {
    /**
     * The name of the custom vocabulary you want information about. Custom vocabulary names are case sensitive.
     */
    VocabularyName: VocabularyName;
  }
  export interface GetVocabularyResponse {
    /**
     * The name of the custom vocabulary you requested information about.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code you selected for your custom vocabulary.
     */
    LanguageCode?: LanguageCode;
    /**
     * The processing state of your custom vocabulary. If the state is READY, you can use the custom vocabulary in a StartTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
    /**
     * The date and time the specified custom vocabulary was last modified. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * If VocabularyState is FAILED, FailureReason contains information about why the custom vocabulary request failed. See also: Common Errors.
     */
    FailureReason?: FailureReason;
    /**
     * The S3 location where the custom vocabulary is stored; use this URI to view or download the custom vocabulary.
     */
    DownloadUri?: Uri;
  }
  export type IdentifiedLanguageScore = number;
  export interface InputDataConfig {
    /**
     * The Amazon S3 location (URI) of the text files you want to use to train your custom language model. Here's an example URI path: s3://DOC-EXAMPLE-BUCKET/my-model-training-data/ 
     */
    S3Uri: Uri;
    /**
     * The Amazon S3 location (URI) of the text files you want to use to tune your custom language model. Here's an example URI path: s3://DOC-EXAMPLE-BUCKET/my-model-tuning-data/ 
     */
    TuningDataS3Uri?: Uri;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files. If the role that you specify doesn’t have the appropriate permissions to access the specified Amazon S3 location, your request fails. IAM role ARNs have the format arn:partition:iam::account:role/role-name-with-path. For example: arn:aws:iam::111122223333:role/Admin. For more information, see IAM ARNs.
     */
    DataAccessRoleArn: DataAccessRoleArn;
  }
  export type InputType = "REAL_TIME"|"POST_CALL"|string;
  export interface InterruptionFilter {
    /**
     * Specify the duration of the interruptions in milliseconds. For example, you can flag speech that contains more than 10,000 milliseconds of interruptions.
     */
    Threshold?: TimestampMilliseconds;
    /**
     * Specify the interrupter that you want to flag. Omitting this parameter is equivalent to specifying both participants.
     */
    ParticipantRole?: ParticipantRole;
    /**
     * Makes it possible to specify a time range (in milliseconds) in your audio, during which you want to search for an interruption. See for more detail.
     */
    AbsoluteTimeRange?: AbsoluteTimeRange;
    /**
     * Makes it possible to specify a time range (in percentage) in your media file, during which you want to search for an interruption. See for more detail.
     */
    RelativeTimeRange?: RelativeTimeRange;
    /**
     * Set to TRUE to flag speech that does not contain interruptions. Set to FALSE to flag speech that contains interruptions.
     */
    Negate?: Boolean;
  }
  export interface JobExecutionSettings {
    /**
     * Makes it possible to enable job queuing when your concurrent request limit is exceeded. When AllowDeferredExecution is set to true, transcription job requests are placed in a queue until the number of jobs falls below the concurrent request limit. If AllowDeferredExecution is set to false and the number of transcription job requests exceed the concurrent request limit, you get a LimitExceededException error. If you include AllowDeferredExecution in your request, you must also include DataAccessRoleArn.
     */
    AllowDeferredExecution?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files. If the role that you specify doesn’t have the appropriate permissions to access the specified Amazon S3 location, your request fails. IAM role ARNs have the format arn:partition:iam::account:role/role-name-with-path. For example: arn:aws:iam::111122223333:role/Admin. For more information, see IAM ARNs. Note that if you include DataAccessRoleArn in your request, you must also include AllowDeferredExecution.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
  }
  export type KMSEncryptionContextMap = {[key: string]: NonEmptyString};
  export type KMSKeyId = string;
  export type LanguageCode = "af-ZA"|"ar-AE"|"ar-SA"|"da-DK"|"de-CH"|"de-DE"|"en-AB"|"en-AU"|"en-GB"|"en-IE"|"en-IN"|"en-US"|"en-WL"|"es-ES"|"es-US"|"fa-IR"|"fr-CA"|"fr-FR"|"he-IL"|"hi-IN"|"id-ID"|"it-IT"|"ja-JP"|"ko-KR"|"ms-MY"|"nl-NL"|"pt-BR"|"pt-PT"|"ru-RU"|"ta-IN"|"te-IN"|"tr-TR"|"zh-CN"|"zh-TW"|"th-TH"|"en-ZA"|"en-NZ"|"vi-VN"|"sv-SE"|string;
  export interface LanguageCodeItem {
    /**
     * Provides the language code for each language identified in your media.
     */
    LanguageCode?: LanguageCode;
    /**
     * Provides the total time, in seconds, each identified language is spoken in your media.
     */
    DurationInSeconds?: DurationInSeconds;
  }
  export type LanguageCodeList = LanguageCodeItem[];
  export interface LanguageIdSettings {
    /**
     * The name of the custom vocabulary you want to use when processing your transcription job. Custom vocabulary names are case sensitive. The language of the specified custom vocabulary must match the language code that you specify in your transcription request. If the languages don't match, the custom vocabulary isn't applied. There are no errors or warnings associated with a language mismatch.
     */
    VocabularyName?: VocabularyName;
    /**
     * The name of the custom vocabulary filter you want to use when processing your transcription job. Custom vocabulary filter names are case sensitive. The language of the specified custom vocabulary filter must match the language code that you specify in your transcription request. If the languages don't match, the custom vocabulary filter isn't applied. There are no errors or warnings associated with a language mismatch. Note that if you include VocabularyFilterName in your request, you must also include VocabularyFilterMethod.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The name of the custom language model you want to use when processing your transcription job. Note that custom language model names are case sensitive. The language of the specified custom language model must match the language code that you specify in your transcription request. If the languages don't match, the custom language model isn't applied. There are no errors or warnings associated with a language mismatch.
     */
    LanguageModelName?: ModelName;
  }
  export type LanguageIdSettingsMap = {[key: string]: LanguageIdSettings};
  export interface LanguageModel {
    /**
     * A unique name, chosen by you, for your custom language model. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account.
     */
    ModelName?: ModelName;
    /**
     * The date and time the specified custom language model was created. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    CreateTime?: DateTime;
    /**
     * The date and time the specified custom language model was last modified. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * The language code used to create your custom language model. Each custom language model must contain terms in only one language, and the language you select for your custom language model must match the language of your training and tuning data. For a list of supported languages and their associated language codes, refer to the Supported languages table. Note that U.S. English (en-US) is the only language supported with Amazon Transcribe Medical.
     */
    LanguageCode?: CLMLanguageCode;
    /**
     * The Amazon Transcribe standard language model, or base model, used to create your custom language model.
     */
    BaseModelName?: BaseModelName;
    /**
     * The status of the specified custom language model. When the status displays as COMPLETED the model is ready for use.
     */
    ModelStatus?: ModelStatus;
    /**
     * Shows if a more current base model is available for use with the specified custom language model. If false, your custom language model is using the most up-to-date base model. If true, there is a newer base model available than the one your language model is using. Note that to update a base model, you must recreate the custom language model using the new base model. Base model upgrades for existing custom language models are not supported.
     */
    UpgradeAvailability?: Boolean;
    /**
     * If ModelStatus is FAILED, FailureReason contains information about why the custom language model request failed. See also: Common Errors.
     */
    FailureReason?: FailureReason;
    /**
     * The Amazon S3 location of the input files used to train and tune your custom language model, in addition to the data access role ARN (Amazon Resource Name) that has permissions to access these data.
     */
    InputDataConfig?: InputDataConfig;
  }
  export type LanguageOptions = LanguageCode[];
  export interface ListCallAnalyticsCategoriesRequest {
    /**
     * If your ListCallAnalyticsCategories request returns more results than can be displayed, NextToken is displayed in the response with an associated string. To get the next page of results, copy this string and repeat your request, including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of Call Analytics categories to return in each page of results. If there are fewer results than the value that you specify, only the actual results are returned. If you don't specify a value, a default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListCallAnalyticsCategoriesResponse {
    /**
     * If NextToken is present in your response, it indicates that not all results are displayed. To view the next set of results, copy the string associated with the NextToken parameter in your results output, then run your request again including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * Provides detailed information about your Call Analytics categories, including all the rules associated with each category.
     */
    Categories?: CategoryPropertiesList;
  }
  export interface ListCallAnalyticsJobsRequest {
    /**
     * Returns only Call Analytics jobs with the specified status. Jobs are ordered by creation date, with the newest job first. If you don't include Status, all Call Analytics jobs are returned.
     */
    Status?: CallAnalyticsJobStatus;
    /**
     * Returns only the Call Analytics jobs that contain the specified string. The search is not case sensitive.
     */
    JobNameContains?: CallAnalyticsJobName;
    /**
     * If your ListCallAnalyticsJobs request returns more results than can be displayed, NextToken is displayed in the response with an associated string. To get the next page of results, copy this string and repeat your request, including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of Call Analytics jobs to return in each page of results. If there are fewer results than the value that you specify, only the actual results are returned. If you don't specify a value, a default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListCallAnalyticsJobsResponse {
    /**
     * Lists all Call Analytics jobs that have the status specified in your request. Jobs are ordered by creation date, with the newest job first.
     */
    Status?: CallAnalyticsJobStatus;
    /**
     * If NextToken is present in your response, it indicates that not all results are displayed. To view the next set of results, copy the string associated with the NextToken parameter in your results output, then run your request again including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * Provides a summary of information about each result.
     */
    CallAnalyticsJobSummaries?: CallAnalyticsJobSummaries;
  }
  export interface ListLanguageModelsRequest {
    /**
     * Returns only custom language models with the specified status. Language models are ordered by creation date, with the newest model first. If you don't include StatusEquals, all custom language models are returned.
     */
    StatusEquals?: ModelStatus;
    /**
     * Returns only the custom language models that contain the specified string. The search is not case sensitive.
     */
    NameContains?: ModelName;
    /**
     * If your ListLanguageModels request returns more results than can be displayed, NextToken is displayed in the response with an associated string. To get the next page of results, copy this string and repeat your request, including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of custom language models to return in each page of results. If there are fewer results than the value that you specify, only the actual results are returned. If you don't specify a value, a default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListLanguageModelsResponse {
    /**
     * If NextToken is present in your response, it indicates that not all results are displayed. To view the next set of results, copy the string associated with the NextToken parameter in your results output, then run your request again including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * Provides information about the custom language models that match the criteria specified in your request.
     */
    Models?: Models;
  }
  export interface ListMedicalTranscriptionJobsRequest {
    /**
     * Returns only medical transcription jobs with the specified status. Jobs are ordered by creation date, with the newest job first. If you don't include Status, all medical transcription jobs are returned.
     */
    Status?: TranscriptionJobStatus;
    /**
     * Returns only the medical transcription jobs that contain the specified string. The search is not case sensitive.
     */
    JobNameContains?: TranscriptionJobName;
    /**
     * If your ListMedicalTranscriptionJobs request returns more results than can be displayed, NextToken is displayed in the response with an associated string. To get the next page of results, copy this string and repeat your request, including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of medical transcription jobs to return in each page of results. If there are fewer results than the value that you specify, only the actual results are returned. If you don't specify a value, a default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListMedicalTranscriptionJobsResponse {
    /**
     * Lists all medical transcription jobs that have the status specified in your request. Jobs are ordered by creation date, with the newest job first.
     */
    Status?: TranscriptionJobStatus;
    /**
     * If NextToken is present in your response, it indicates that not all results are displayed. To view the next set of results, copy the string associated with the NextToken parameter in your results output, then run your request again including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * Provides a summary of information about each result.
     */
    MedicalTranscriptionJobSummaries?: MedicalTranscriptionJobSummaries;
  }
  export interface ListMedicalVocabulariesRequest {
    /**
     * If your ListMedicalVocabularies request returns more results than can be displayed, NextToken is displayed in the response with an associated string. To get the next page of results, copy this string and repeat your request, including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of custom medical vocabularies to return in each page of results. If there are fewer results than the value that you specify, only the actual results are returned. If you don't specify a value, a default of 5 is used.
     */
    MaxResults?: MaxResults;
    /**
     * Returns only custom medical vocabularies with the specified state. Custom vocabularies are ordered by creation date, with the newest vocabulary first. If you don't include StateEquals, all custom medical vocabularies are returned.
     */
    StateEquals?: VocabularyState;
    /**
     * Returns only the custom medical vocabularies that contain the specified string. The search is not case sensitive.
     */
    NameContains?: VocabularyName;
  }
  export interface ListMedicalVocabulariesResponse {
    /**
     * Lists all custom medical vocabularies that have the status specified in your request. Custom vocabularies are ordered by creation date, with the newest vocabulary first.
     */
    Status?: VocabularyState;
    /**
     * If NextToken is present in your response, it indicates that not all results are displayed. To view the next set of results, copy the string associated with the NextToken parameter in your results output, then run your request again including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * Provides information about the custom medical vocabularies that match the criteria specified in your request.
     */
    Vocabularies?: Vocabularies;
  }
  export interface ListTagsForResourceRequest {
    /**
     * Returns a list of all tags associated with the specified Amazon Resource Name (ARN). ARNs have the format arn:partition:service:region:account-id:resource-type/resource-id. For example, arn:aws:transcribe:us-west-2:111122223333:transcription-job/transcription-job-name. Valid values for resource-type are: transcription-job, medical-transcription-job, vocabulary, medical-vocabulary, vocabulary-filter, and language-model.
     */
    ResourceArn: TranscribeArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The Amazon Resource Name (ARN) specified in your request.
     */
    ResourceArn?: TranscribeArn;
    /**
     * Lists all tags associated with the given transcription job, vocabulary, model, or resource.
     */
    Tags?: TagList;
  }
  export interface ListTranscriptionJobsRequest {
    /**
     * Returns only transcription jobs with the specified status. Jobs are ordered by creation date, with the newest job first. If you don't include Status, all transcription jobs are returned.
     */
    Status?: TranscriptionJobStatus;
    /**
     * Returns only the transcription jobs that contain the specified string. The search is not case sensitive.
     */
    JobNameContains?: TranscriptionJobName;
    /**
     * If your ListTranscriptionJobs request returns more results than can be displayed, NextToken is displayed in the response with an associated string. To get the next page of results, copy this string and repeat your request, including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of transcription jobs to return in each page of results. If there are fewer results than the value that you specify, only the actual results are returned. If you don't specify a value, a default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTranscriptionJobsResponse {
    /**
     * Lists all transcription jobs that have the status specified in your request. Jobs are ordered by creation date, with the newest job first.
     */
    Status?: TranscriptionJobStatus;
    /**
     * If NextToken is present in your response, it indicates that not all results are displayed. To view the next set of results, copy the string associated with the NextToken parameter in your results output, then run your request again including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * Provides a summary of information about each result.
     */
    TranscriptionJobSummaries?: TranscriptionJobSummaries;
  }
  export interface ListVocabulariesRequest {
    /**
     * If your ListVocabularies request returns more results than can be displayed, NextToken is displayed in the response with an associated string. To get the next page of results, copy this string and repeat your request, including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of custom vocabularies to return in each page of results. If there are fewer results than the value that you specify, only the actual results are returned. If you don't specify a value, a default of 5 is used.
     */
    MaxResults?: MaxResults;
    /**
     * Returns only custom vocabularies with the specified state. Vocabularies are ordered by creation date, with the newest vocabulary first. If you don't include StateEquals, all custom medical vocabularies are returned.
     */
    StateEquals?: VocabularyState;
    /**
     * Returns only the custom vocabularies that contain the specified string. The search is not case sensitive.
     */
    NameContains?: VocabularyName;
  }
  export interface ListVocabulariesResponse {
    /**
     * Lists all custom vocabularies that have the status specified in your request. Vocabularies are ordered by creation date, with the newest vocabulary first.
     */
    Status?: VocabularyState;
    /**
     * If NextToken is present in your response, it indicates that not all results are displayed. To view the next set of results, copy the string associated with the NextToken parameter in your results output, then run your request again including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * Provides information about the custom vocabularies that match the criteria specified in your request.
     */
    Vocabularies?: Vocabularies;
  }
  export interface ListVocabularyFiltersRequest {
    /**
     * If your ListVocabularyFilters request returns more results than can be displayed, NextToken is displayed in the response with an associated string. To get the next page of results, copy this string and repeat your request, including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of custom vocabulary filters to return in each page of results. If there are fewer results than the value that you specify, only the actual results are returned. If you don't specify a value, a default of 5 is used.
     */
    MaxResults?: MaxResults;
    /**
     * Returns only the custom vocabulary filters that contain the specified string. The search is not case sensitive.
     */
    NameContains?: VocabularyFilterName;
  }
  export interface ListVocabularyFiltersResponse {
    /**
     * If NextToken is present in your response, it indicates that not all results are displayed. To view the next set of results, copy the string associated with the NextToken parameter in your results output, then run your request again including NextToken with the value of the copied string. Repeat as needed to view all your results.
     */
    NextToken?: NextToken;
    /**
     * Provides information about the custom vocabulary filters that match the criteria specified in your request.
     */
    VocabularyFilters?: VocabularyFilters;
  }
  export type MaxAlternatives = number;
  export type MaxResults = number;
  export type MaxSpeakers = number;
  export interface Media {
    /**
     * The Amazon S3 location of the media file you want to transcribe. For example:    s3://DOC-EXAMPLE-BUCKET/my-media-file.flac     s3://DOC-EXAMPLE-BUCKET/media-files/my-media-file.flac    Note that the Amazon S3 bucket that contains your input media must be located in the same Amazon Web Services Region where you're making your transcription request.
     */
    MediaFileUri?: Uri;
    /**
     * The Amazon S3 location of the media file you want to redact. For example:    s3://DOC-EXAMPLE-BUCKET/my-media-file.flac     s3://DOC-EXAMPLE-BUCKET/media-files/my-media-file.flac    Note that the Amazon S3 bucket that contains your input media must be located in the same Amazon Web Services Region where you're making your transcription request.   RedactedMediaFileUri produces a redacted audio file in addition to a redacted transcript. It is only supported for Call Analytics (StartCallAnalyticsJob) transcription requests. 
     */
    RedactedMediaFileUri?: Uri;
  }
  export type MediaFormat = "mp3"|"mp4"|"wav"|"flac"|"ogg"|"amr"|"webm"|"m4a"|string;
  export type MediaSampleRateHertz = number;
  export type MedicalContentIdentificationType = "PHI"|string;
  export type MedicalMediaSampleRateHertz = number;
  export interface MedicalTranscript {
    /**
     * The Amazon S3 location of your transcript. You can use this URI to access or download your transcript. Note that this is the Amazon S3 location you specified in your request using the OutputBucketName parameter.
     */
    TranscriptFileUri?: Uri;
  }
  export interface MedicalTranscriptionJob {
    /**
     * The name of the medical transcription job. Job names are case sensitive and must be unique within an Amazon Web Services account.
     */
    MedicalTranscriptionJobName?: TranscriptionJobName;
    /**
     * Provides the status of the specified medical transcription job. If the status is COMPLETED, the job is finished and you can find the results at the location specified in TranscriptFileUri. If the status is FAILED, FailureReason provides details on why your transcription job failed.
     */
    TranscriptionJobStatus?: TranscriptionJobStatus;
    /**
     * The language code used to create your medical transcription job. US English (en-US) is the only supported language for medical transcriptions.
     */
    LanguageCode?: LanguageCode;
    /**
     * The sample rate, in hertz, of the audio track in your input media file.
     */
    MediaSampleRateHertz?: MedicalMediaSampleRateHertz;
    /**
     * The format of the input media file.
     */
    MediaFormat?: MediaFormat;
    Media?: Media;
    /**
     * Provides you with the Amazon S3 URI you can use to access your transcript.
     */
    Transcript?: MedicalTranscript;
    /**
     * The date and time the specified medical transcription job began processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.789000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    StartTime?: DateTime;
    /**
     * The date and time the specified medical transcription job request was made. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    CreationTime?: DateTime;
    /**
     * The date and time the specified medical transcription job finished processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:33:13.922000-07:00 represents a transcription job that started processing at 12:33 PM UTC-7 on May 4, 2022.
     */
    CompletionTime?: DateTime;
    /**
     * If TranscriptionJobStatus is FAILED, FailureReason contains information about why the transcription job request failed. The FailureReason field contains one of the following values:    Unsupported media format. The media format specified in MediaFormat isn't valid. Refer to MediaFormat for a list of supported formats.    The media format provided does not match the detected media format. The media format specified in MediaFormat doesn't match the format of the input file. Check the media format of your media file and correct the specified value.    Invalid sample rate for audio file. The sample rate specified in MediaSampleRateHertz isn't valid. The sample rate must be between 16,000 and 48,000 hertz.    The sample rate provided does not match the detected sample rate. The sample rate specified in MediaSampleRateHertz doesn't match the sample rate detected in your input media file. Check the sample rate of your media file and correct the specified value.    Invalid file size: file size too large. The size of your media file is larger than what Amazon Transcribe can process. For more information, refer to Guidelines and quotas.    Invalid number of channels: number of channels too large. Your audio contains more channels than Amazon Transcribe is able to process. For more information, refer to Guidelines and quotas.  
     */
    FailureReason?: FailureReason;
    /**
     * Provides information on any additional settings that were included in your request. Additional settings include channel identification, alternative transcriptions, speaker partitioning, custom vocabularies, and custom vocabulary filters.
     */
    Settings?: MedicalTranscriptionSetting;
    /**
     * Indicates whether content identification was enabled for your transcription request.
     */
    ContentIdentificationType?: MedicalContentIdentificationType;
    /**
     * Describes the medical specialty represented in your media.
     */
    Specialty?: Specialty;
    /**
     * Indicates whether the input media is a dictation or a conversation, as specified in the StartMedicalTranscriptionJob request.
     */
    Type?: Type;
    /**
     * The tags, each in the form of a key:value pair, assigned to the specified medical transcription job.
     */
    Tags?: TagList;
  }
  export type MedicalTranscriptionJobSummaries = MedicalTranscriptionJobSummary[];
  export interface MedicalTranscriptionJobSummary {
    /**
     * The name of the medical transcription job. Job names are case sensitive and must be unique within an Amazon Web Services account.
     */
    MedicalTranscriptionJobName?: TranscriptionJobName;
    /**
     * The date and time the specified medical transcription job request was made. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    CreationTime?: DateTime;
    /**
     * The date and time your medical transcription job began processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.789000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    StartTime?: DateTime;
    /**
     * The date and time the specified medical transcription job finished processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:33:13.922000-07:00 represents a transcription job that started processing at 12:33 PM UTC-7 on May 4, 2022.
     */
    CompletionTime?: DateTime;
    /**
     * The language code used to create your medical transcription. US English (en-US) is the only supported language for medical transcriptions.
     */
    LanguageCode?: LanguageCode;
    /**
     * Provides the status of your medical transcription job. If the status is COMPLETED, the job is finished and you can find the results at the location specified in TranscriptFileUri. If the status is FAILED, FailureReason provides details on why your transcription job failed.
     */
    TranscriptionJobStatus?: TranscriptionJobStatus;
    /**
     * If TranscriptionJobStatus is FAILED, FailureReason contains information about why the transcription job failed. See also: Common Errors.
     */
    FailureReason?: FailureReason;
    /**
     * Indicates where the specified medical transcription output is stored. If the value is CUSTOMER_BUCKET, the location is the Amazon S3 bucket you specified using the OutputBucketName parameter in your request. If you also included OutputKey in your request, your output is located in the path you specified in your request. If the value is SERVICE_BUCKET, the location is a service-managed Amazon S3 bucket. To access a transcript stored in a service-managed bucket, use the URI shown in the TranscriptFileUri field.
     */
    OutputLocationType?: OutputLocationType;
    /**
     * Provides the medical specialty represented in your media.
     */
    Specialty?: Specialty;
    /**
     * Labels all personal health information (PHI) identified in your transcript. For more information, see Identifying personal health information (PHI) in a transcription.
     */
    ContentIdentificationType?: MedicalContentIdentificationType;
    /**
     * Indicates whether the input media is a dictation or a conversation, as specified in the StartMedicalTranscriptionJob request.
     */
    Type?: Type;
  }
  export interface MedicalTranscriptionSetting {
    /**
     * Enables speaker partitioning (diarization) in your transcription output. Speaker partitioning labels the speech from individual speakers in your media file. If you enable ShowSpeakerLabels in your request, you must also include MaxSpeakerLabels. You can't include ShowSpeakerLabels and ChannelIdentification in the same request. Including both parameters returns a BadRequestException. For more information, see Partitioning speakers (diarization).
     */
    ShowSpeakerLabels?: Boolean;
    /**
     * Specify the maximum number of speakers you want to partition in your media. Note that if your media contains more speakers than the specified number, multiple speakers are treated as a single speaker. If you specify the MaxSpeakerLabels field, you must set the ShowSpeakerLabels field to true.
     */
    MaxSpeakerLabels?: MaxSpeakers;
    /**
     * Enables channel identification in multi-channel audio. Channel identification transcribes the audio on each channel independently, then appends the output for each channel into one transcript. If you have multi-channel audio and do not enable channel identification, your audio is transcribed in a continuous manner and your transcript does not separate the speech by channel. You can't include both ShowSpeakerLabels and ChannelIdentification in the same request. Including both parameters returns a BadRequestException. For more information, see Transcribing multi-channel audio.
     */
    ChannelIdentification?: Boolean;
    /**
     * To include alternative transcriptions within your transcription output, include ShowAlternatives in your transcription request. If you include ShowAlternatives, you must also include MaxAlternatives, which is the maximum number of alternative transcriptions you want Amazon Transcribe Medical to generate. For more information, see Alternative transcriptions.
     */
    ShowAlternatives?: Boolean;
    /**
     * Indicate the maximum number of alternative transcriptions you want Amazon Transcribe Medical to include in your transcript. If you select a number greater than the number of alternative transcriptions generated by Amazon Transcribe Medical, only the actual number of alternative transcriptions are included. If you include MaxAlternatives in your request, you must also include ShowAlternatives with a value of true. For more information, see Alternative transcriptions.
     */
    MaxAlternatives?: MaxAlternatives;
    /**
     * The name of the custom vocabulary you want to use when processing your medical transcription job. Custom vocabulary names are case sensitive. The language of the specified custom vocabulary must match the language code that you specify in your transcription request. If the languages don't match, the custom vocabulary isn't applied. There are no errors or warnings associated with a language mismatch. US English (en-US) is the only valid language for Amazon Transcribe Medical.
     */
    VocabularyName?: VocabularyName;
  }
  export type ModelName = string;
  export interface ModelSettings {
    /**
     * The name of the custom language model you want to use when processing your transcription job. Note that custom language model names are case sensitive. The language of the specified custom language model must match the language code that you specify in your transcription request. If the languages don't match, the custom language model isn't applied. There are no errors or warnings associated with a language mismatch.
     */
    LanguageModelName?: ModelName;
  }
  export type ModelStatus = "IN_PROGRESS"|"FAILED"|"COMPLETED"|string;
  export type Models = LanguageModel[];
  export type NextToken = string;
  export type NonEmptyString = string;
  export interface NonTalkTimeFilter {
    /**
     * Specify the duration, in milliseconds, of the period of silence that you want to flag. For example, you can flag a silent period that lasts 30,000 milliseconds.
     */
    Threshold?: TimestampMilliseconds;
    /**
     * Makes it possible to specify a time range (in milliseconds) in your audio, during which you want to search for a period of silence. See for more detail.
     */
    AbsoluteTimeRange?: AbsoluteTimeRange;
    /**
     * Makes it possible to specify a time range (in percentage) in your media file, during which you want to search for a period of silence. See for more detail.
     */
    RelativeTimeRange?: RelativeTimeRange;
    /**
     * Set to TRUE to flag periods of speech. Set to FALSE to flag periods of silence
     */
    Negate?: Boolean;
  }
  export type OutputBucketName = string;
  export type OutputKey = string;
  export type OutputLocationType = "CUSTOMER_BUCKET"|"SERVICE_BUCKET"|string;
  export type ParticipantRole = "AGENT"|"CUSTOMER"|string;
  export type Percentage = number;
  export type Phrase = string;
  export type Phrases = Phrase[];
  export type PiiEntityType = "BANK_ACCOUNT_NUMBER"|"BANK_ROUTING"|"CREDIT_DEBIT_NUMBER"|"CREDIT_DEBIT_CVV"|"CREDIT_DEBIT_EXPIRY"|"PIN"|"EMAIL"|"ADDRESS"|"NAME"|"PHONE"|"SSN"|"ALL"|string;
  export type PiiEntityTypes = PiiEntityType[];
  export type RedactionOutput = "redacted"|"redacted_and_unredacted"|string;
  export type RedactionType = "PII"|string;
  export interface RelativeTimeRange {
    /**
     * The time, in percentage, when Amazon Transcribe starts searching for the specified criteria in your media file. If you include StartPercentage in your request, you must also include EndPercentage.
     */
    StartPercentage?: Percentage;
    /**
     * The time, in percentage, when Amazon Transcribe stops searching for the specified criteria in your media file. If you include EndPercentage in your request, you must also include StartPercentage.
     */
    EndPercentage?: Percentage;
    /**
     * The time, in percentage, from the start of your media file until the specified value. Amazon Transcribe searches for your specified criteria in this time segment.
     */
    First?: Percentage;
    /**
     * The time, in percentage, from the specified value until the end of your media file. Amazon Transcribe searches for your specified criteria in this time segment.
     */
    Last?: Percentage;
  }
  export interface Rule {
    /**
     * Flag the presence or absence of periods of silence in your Call Analytics transcription output. Refer to for more detail.
     */
    NonTalkTimeFilter?: NonTalkTimeFilter;
    /**
     * Flag the presence or absence of interruptions in your Call Analytics transcription output. Refer to for more detail.
     */
    InterruptionFilter?: InterruptionFilter;
    /**
     * Flag the presence or absence of specific words or phrases in your Call Analytics transcription output. Refer to for more detail.
     */
    TranscriptFilter?: TranscriptFilter;
    /**
     * Flag the presence or absence of specific sentiments in your Call Analytics transcription output. Refer to for more detail.
     */
    SentimentFilter?: SentimentFilter;
  }
  export type RuleList = Rule[];
  export interface SentimentFilter {
    /**
     * Specify the sentiments that you want to flag.
     */
    Sentiments: SentimentValueList;
    /**
     * Makes it possible to specify a time range (in milliseconds) in your audio, during which you want to search for the specified sentiments. See for more detail.
     */
    AbsoluteTimeRange?: AbsoluteTimeRange;
    /**
     * Makes it possible to specify a time range (in percentage) in your media file, during which you want to search for the specified sentiments. See for more detail.
     */
    RelativeTimeRange?: RelativeTimeRange;
    /**
     * Specify the participant that you want to flag. Omitting this parameter is equivalent to specifying both participants.
     */
    ParticipantRole?: ParticipantRole;
    /**
     * Set to TRUE to flag the sentiments that you didn't include in your request. Set to FALSE to flag the sentiments that you specified in your request.
     */
    Negate?: Boolean;
  }
  export type SentimentValue = "POSITIVE"|"NEGATIVE"|"NEUTRAL"|"MIXED"|string;
  export type SentimentValueList = SentimentValue[];
  export interface Settings {
    /**
     * The name of the custom vocabulary you want to use in your transcription job request. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account.
     */
    VocabularyName?: VocabularyName;
    /**
     * Enables speaker partitioning (diarization) in your transcription output. Speaker partitioning labels the speech from individual speakers in your media file. If you enable ShowSpeakerLabels in your request, you must also include MaxSpeakerLabels. You can't include both ShowSpeakerLabels and ChannelIdentification in the same request. Including both parameters returns a BadRequestException. For more information, see Partitioning speakers (diarization).
     */
    ShowSpeakerLabels?: Boolean;
    /**
     * Specify the maximum number of speakers you want to partition in your media. Note that if your media contains more speakers than the specified number, multiple speakers are treated as a single speaker. If you specify the MaxSpeakerLabels field, you must set the ShowSpeakerLabels field to true.
     */
    MaxSpeakerLabels?: MaxSpeakers;
    /**
     * Enables channel identification in multi-channel audio. Channel identification transcribes the audio on each channel independently, then appends the output for each channel into one transcript. You can't include both ShowSpeakerLabels and ChannelIdentification in the same request. Including both parameters returns a BadRequestException. For more information, see Transcribing multi-channel audio.
     */
    ChannelIdentification?: Boolean;
    /**
     * To include alternative transcriptions within your transcription output, include ShowAlternatives in your transcription request. If you have multi-channel audio and do not enable channel identification, your audio is transcribed in a continuous manner and your transcript does not separate the speech by channel. If you include ShowAlternatives, you must also include MaxAlternatives, which is the maximum number of alternative transcriptions you want Amazon Transcribe to generate. For more information, see Alternative transcriptions.
     */
    ShowAlternatives?: Boolean;
    /**
     * Indicate the maximum number of alternative transcriptions you want Amazon Transcribe to include in your transcript. If you select a number greater than the number of alternative transcriptions generated by Amazon Transcribe, only the actual number of alternative transcriptions are included. If you include MaxAlternatives in your request, you must also include ShowAlternatives with a value of true. For more information, see Alternative transcriptions.
     */
    MaxAlternatives?: MaxAlternatives;
    /**
     * The name of the custom vocabulary filter you want to use in your transcription job request. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account. Note that if you include VocabularyFilterName in your request, you must also include VocabularyFilterMethod.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * Specify how you want your custom vocabulary filter applied to your transcript. To replace words with ***, choose mask. To delete words, choose remove. To flag words without changing them, choose tag.
     */
    VocabularyFilterMethod?: VocabularyFilterMethod;
  }
  export type Specialty = "PRIMARYCARE"|string;
  export interface StartCallAnalyticsJobRequest {
    /**
     * A unique name, chosen by you, for your Call Analytics job. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account. If you try to create a new job with the same name as an existing job, you get a ConflictException error.
     */
    CallAnalyticsJobName: CallAnalyticsJobName;
    /**
     * Describes the Amazon S3 location of the media file you want to use in your Call Analytics request.
     */
    Media: Media;
    /**
     * The Amazon S3 location where you want your Call Analytics transcription output stored. You can use any of the following formats to specify the output location:   s3://DOC-EXAMPLE-BUCKET   s3://DOC-EXAMPLE-BUCKET/my-output-folder/   s3://DOC-EXAMPLE-BUCKET/my-output-folder/my-call-analytics-job.json   Unless you specify a file name (option 3), the name of your output file has a default value that matches the name you specified for your transcription job using the CallAnalyticsJobName parameter. You can specify a KMS key to encrypt your output using the OutputEncryptionKMSKeyId parameter. If you don't specify a KMS key, Amazon Transcribe uses the default Amazon S3 key for server-side encryption. If you don't specify OutputLocation, your transcript is placed in a service-managed Amazon S3 bucket and you are provided with a URI to access your transcript.
     */
    OutputLocation?: Uri;
    /**
     * The KMS key you want to use to encrypt your Call Analytics output. If using a key located in the current Amazon Web Services account, you can specify your KMS key in one of four ways:   Use the KMS key ID itself. For example, 1234abcd-12ab-34cd-56ef-1234567890ab.   Use an alias for the KMS key ID. For example, alias/ExampleAlias.   Use the Amazon Resource Name (ARN) for the KMS key ID. For example, arn:aws:kms:region:account-ID:key/1234abcd-12ab-34cd-56ef-1234567890ab.   Use the ARN for the KMS key alias. For example, arn:aws:kms:region:account-ID:alias/ExampleAlias.   If using a key located in a different Amazon Web Services account than the current Amazon Web Services account, you can specify your KMS key in one of two ways:   Use the ARN for the KMS key ID. For example, arn:aws:kms:region:account-ID:key/1234abcd-12ab-34cd-56ef-1234567890ab.   Use the ARN for the KMS key alias. For example, arn:aws:kms:region:account-ID:alias/ExampleAlias.   If you don't specify an encryption key, your output is encrypted with the default Amazon S3 key (SSE-S3). If you specify a KMS key to encrypt your output, you must also specify an output location using the OutputLocation parameter. Note that the role making the request must have permission to use the specified KMS key.
     */
    OutputEncryptionKMSKeyId?: KMSKeyId;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files. If the role that you specify doesn’t have the appropriate permissions to access the specified Amazon S3 location, your request fails. IAM role ARNs have the format arn:partition:iam::account:role/role-name-with-path. For example: arn:aws:iam::111122223333:role/Admin. For more information, see IAM ARNs.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
    /**
     * Specify additional optional settings in your request, including content redaction; allows you to apply custom language models, vocabulary filters, and custom vocabularies to your Call Analytics job.
     */
    Settings?: CallAnalyticsJobSettings;
    /**
     * Makes it possible to specify which speaker is on which channel. For example, if your agent is the first participant to speak, you would set ChannelId to 0 (to indicate the first channel) and ParticipantRole to AGENT (to indicate that it's the agent speaking).
     */
    ChannelDefinitions?: ChannelDefinitions;
  }
  export interface StartCallAnalyticsJobResponse {
    /**
     * Provides detailed information about the current Call Analytics job, including job status and, if applicable, failure reason.
     */
    CallAnalyticsJob?: CallAnalyticsJob;
  }
  export interface StartMedicalTranscriptionJobRequest {
    /**
     * A unique name, chosen by you, for your medical transcription job. The name that you specify is also used as the default name of your transcription output file. If you want to specify a different name for your transcription output, use the OutputKey parameter. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account. If you try to create a new job with the same name as an existing job, you get a ConflictException error.
     */
    MedicalTranscriptionJobName: TranscriptionJobName;
    /**
     * The language code that represents the language spoken in the input media file. US English (en-US) is the only valid value for medical transcription jobs. Any other value you enter for language code results in a BadRequestException error.
     */
    LanguageCode: LanguageCode;
    /**
     * The sample rate, in hertz, of the audio track in your input media file. If you don't specify the media sample rate, Amazon Transcribe Medical determines it for you. If you specify the sample rate, it must match the rate detected by Amazon Transcribe Medical; if there's a mismatch between the value that you specify and the value detected, your job fails. Therefore, in most cases, it's advised to omit MediaSampleRateHertz and let Amazon Transcribe Medical determine the sample rate.
     */
    MediaSampleRateHertz?: MedicalMediaSampleRateHertz;
    /**
     * Specify the format of your input media file.
     */
    MediaFormat?: MediaFormat;
    Media: Media;
    /**
     * The name of the Amazon S3 bucket where you want your medical transcription output stored. Do not include the S3:// prefix of the specified bucket. If you want your output to go to a sub-folder of this bucket, specify it using the OutputKey parameter; OutputBucketName only accepts the name of a bucket. For example, if you want your output stored in S3://DOC-EXAMPLE-BUCKET, set OutputBucketName to DOC-EXAMPLE-BUCKET. However, if you want your output stored in S3://DOC-EXAMPLE-BUCKET/test-files/, set OutputBucketName to DOC-EXAMPLE-BUCKET and OutputKey to test-files/. Note that Amazon Transcribe must have permission to use the specified location. You can change Amazon S3 permissions using the Amazon Web Services Management Console. See also Permissions Required for IAM User Roles.
     */
    OutputBucketName: OutputBucketName;
    /**
     * Use in combination with OutputBucketName to specify the output location of your transcript and, optionally, a unique name for your output file. The default name for your transcription output is the same as the name you specified for your medical transcription job (MedicalTranscriptionJobName). Here are some examples of how you can use OutputKey:   If you specify 'DOC-EXAMPLE-BUCKET' as the OutputBucketName and 'my-transcript.json' as the OutputKey, your transcription output path is s3://DOC-EXAMPLE-BUCKET/my-transcript.json.   If you specify 'my-first-transcription' as the MedicalTranscriptionJobName, 'DOC-EXAMPLE-BUCKET' as the OutputBucketName, and 'my-transcript' as the OutputKey, your transcription output path is s3://DOC-EXAMPLE-BUCKET/my-transcript/my-first-transcription.json.   If you specify 'DOC-EXAMPLE-BUCKET' as the OutputBucketName and 'test-files/my-transcript.json' as the OutputKey, your transcription output path is s3://DOC-EXAMPLE-BUCKET/test-files/my-transcript.json.   If you specify 'my-first-transcription' as the MedicalTranscriptionJobName, 'DOC-EXAMPLE-BUCKET' as the OutputBucketName, and 'test-files/my-transcript' as the OutputKey, your transcription output path is s3://DOC-EXAMPLE-BUCKET/test-files/my-transcript/my-first-transcription.json.   If you specify the name of an Amazon S3 bucket sub-folder that doesn't exist, one is created for you.
     */
    OutputKey?: OutputKey;
    /**
     * The KMS key you want to use to encrypt your medical transcription output. If using a key located in the current Amazon Web Services account, you can specify your KMS key in one of four ways:   Use the KMS key ID itself. For example, 1234abcd-12ab-34cd-56ef-1234567890ab.   Use an alias for the KMS key ID. For example, alias/ExampleAlias.   Use the Amazon Resource Name (ARN) for the KMS key ID. For example, arn:aws:kms:region:account-ID:key/1234abcd-12ab-34cd-56ef-1234567890ab.   Use the ARN for the KMS key alias. For example, arn:aws:kms:region:account-ID:alias/ExampleAlias.   If using a key located in a different Amazon Web Services account than the current Amazon Web Services account, you can specify your KMS key in one of two ways:   Use the ARN for the KMS key ID. For example, arn:aws:kms:region:account-ID:key/1234abcd-12ab-34cd-56ef-1234567890ab.   Use the ARN for the KMS key alias. For example, arn:aws:kms:region:account-ID:alias/ExampleAlias.   If you don't specify an encryption key, your output is encrypted with the default Amazon S3 key (SSE-S3). If you specify a KMS key to encrypt your output, you must also specify an output location using the OutputLocation parameter. Note that the role making the request must have permission to use the specified KMS key.
     */
    OutputEncryptionKMSKeyId?: KMSKeyId;
    /**
     * A map of plain text, non-secret key:value pairs, known as encryption context pairs, that provide an added layer of security for your data. For more information, see KMS encryption context and Asymmetric keys in KMS.
     */
    KMSEncryptionContext?: KMSEncryptionContextMap;
    /**
     * Specify additional optional settings in your request, including channel identification, alternative transcriptions, and speaker partitioning. You can use that to apply custom vocabularies to your transcription job.
     */
    Settings?: MedicalTranscriptionSetting;
    /**
     * Labels all personal health information (PHI) identified in your transcript. For more information, see Identifying personal health information (PHI) in a transcription.
     */
    ContentIdentificationType?: MedicalContentIdentificationType;
    /**
     * Specify the predominant medical specialty represented in your media. For batch transcriptions, PRIMARYCARE is the only valid value. If you require additional specialties, refer to .
     */
    Specialty: Specialty;
    /**
     * Specify whether your input media contains only one person (DICTATION) or contains a conversation between two people (CONVERSATION). For example, DICTATION could be used for a medical professional wanting to transcribe voice memos; CONVERSATION could be used for transcribing the doctor-patient dialogue during the patient's office visit.
     */
    Type: Type;
    /**
     * Adds one or more custom tags, each in the form of a key:value pair, to a new medical transcription job at the time you start this new job. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
     */
    Tags?: TagList;
  }
  export interface StartMedicalTranscriptionJobResponse {
    /**
     * Provides detailed information about the current medical transcription job, including job status and, if applicable, failure reason.
     */
    MedicalTranscriptionJob?: MedicalTranscriptionJob;
  }
  export interface StartTranscriptionJobRequest {
    /**
     * A unique name, chosen by you, for your transcription job. The name that you specify is also used as the default name of your transcription output file. If you want to specify a different name for your transcription output, use the OutputKey parameter. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account. If you try to create a new job with the same name as an existing job, you get a ConflictException error.
     */
    TranscriptionJobName: TranscriptionJobName;
    /**
     * The language code that represents the language spoken in the input media file. If you're unsure of the language spoken in your media file, consider using IdentifyLanguage or IdentifyMultipleLanguages to enable automatic language identification. Note that you must include one of LanguageCode, IdentifyLanguage, or IdentifyMultipleLanguages in your request. If you include more than one of these parameters, your transcription job fails. For a list of supported languages and their associated language codes, refer to the Supported languages table.  To transcribe speech in Modern Standard Arabic (ar-SA), your media file must be encoded at a sample rate of 16,000 Hz or higher. 
     */
    LanguageCode?: LanguageCode;
    /**
     * The sample rate, in hertz, of the audio track in your input media file. If you don't specify the media sample rate, Amazon Transcribe determines it for you. If you specify the sample rate, it must match the rate detected by Amazon Transcribe. If there's a mismatch between the value that you specify and the value detected, your job fails. In most cases, you can omit MediaSampleRateHertz and let Amazon Transcribe determine the sample rate.
     */
    MediaSampleRateHertz?: MediaSampleRateHertz;
    /**
     * Specify the format of your input media file.
     */
    MediaFormat?: MediaFormat;
    /**
     * Describes the Amazon S3 location of the media file you want to use in your request.
     */
    Media: Media;
    /**
     * The name of the Amazon S3 bucket where you want your transcription output stored. Do not include the S3:// prefix of the specified bucket. If you want your output to go to a sub-folder of this bucket, specify it using the OutputKey parameter; OutputBucketName only accepts the name of a bucket. For example, if you want your output stored in S3://DOC-EXAMPLE-BUCKET, set OutputBucketName to DOC-EXAMPLE-BUCKET. However, if you want your output stored in S3://DOC-EXAMPLE-BUCKET/test-files/, set OutputBucketName to DOC-EXAMPLE-BUCKET and OutputKey to test-files/. Note that Amazon Transcribe must have permission to use the specified location. You can change Amazon S3 permissions using the Amazon Web Services Management Console. See also Permissions Required for IAM User Roles. If you don't specify OutputBucketName, your transcript is placed in a service-managed Amazon S3 bucket and you are provided with a URI to access your transcript.
     */
    OutputBucketName?: OutputBucketName;
    /**
     * Use in combination with OutputBucketName to specify the output location of your transcript and, optionally, a unique name for your output file. The default name for your transcription output is the same as the name you specified for your transcription job (TranscriptionJobName). Here are some examples of how you can use OutputKey:   If you specify 'DOC-EXAMPLE-BUCKET' as the OutputBucketName and 'my-transcript.json' as the OutputKey, your transcription output path is s3://DOC-EXAMPLE-BUCKET/my-transcript.json.   If you specify 'my-first-transcription' as the TranscriptionJobName, 'DOC-EXAMPLE-BUCKET' as the OutputBucketName, and 'my-transcript' as the OutputKey, your transcription output path is s3://DOC-EXAMPLE-BUCKET/my-transcript/my-first-transcription.json.   If you specify 'DOC-EXAMPLE-BUCKET' as the OutputBucketName and 'test-files/my-transcript.json' as the OutputKey, your transcription output path is s3://DOC-EXAMPLE-BUCKET/test-files/my-transcript.json.   If you specify 'my-first-transcription' as the TranscriptionJobName, 'DOC-EXAMPLE-BUCKET' as the OutputBucketName, and 'test-files/my-transcript' as the OutputKey, your transcription output path is s3://DOC-EXAMPLE-BUCKET/test-files/my-transcript/my-first-transcription.json.   If you specify the name of an Amazon S3 bucket sub-folder that doesn't exist, one is created for you.
     */
    OutputKey?: OutputKey;
    /**
     * The KMS key you want to use to encrypt your transcription output. If using a key located in the current Amazon Web Services account, you can specify your KMS key in one of four ways:   Use the KMS key ID itself. For example, 1234abcd-12ab-34cd-56ef-1234567890ab.   Use an alias for the KMS key ID. For example, alias/ExampleAlias.   Use the Amazon Resource Name (ARN) for the KMS key ID. For example, arn:aws:kms:region:account-ID:key/1234abcd-12ab-34cd-56ef-1234567890ab.   Use the ARN for the KMS key alias. For example, arn:aws:kms:region:account-ID:alias/ExampleAlias.   If using a key located in a different Amazon Web Services account than the current Amazon Web Services account, you can specify your KMS key in one of two ways:   Use the ARN for the KMS key ID. For example, arn:aws:kms:region:account-ID:key/1234abcd-12ab-34cd-56ef-1234567890ab.   Use the ARN for the KMS key alias. For example, arn:aws:kms:region:account-ID:alias/ExampleAlias.   If you don't specify an encryption key, your output is encrypted with the default Amazon S3 key (SSE-S3). If you specify a KMS key to encrypt your output, you must also specify an output location using the OutputLocation parameter. Note that the role making the request must have permission to use the specified KMS key.
     */
    OutputEncryptionKMSKeyId?: KMSKeyId;
    /**
     * A map of plain text, non-secret key:value pairs, known as encryption context pairs, that provide an added layer of security for your data. For more information, see KMS encryption context and Asymmetric keys in KMS.
     */
    KMSEncryptionContext?: KMSEncryptionContextMap;
    /**
     * Specify additional optional settings in your request, including channel identification, alternative transcriptions, speaker partitioning. You can use that to apply custom vocabularies and vocabulary filters. If you want to include a custom vocabulary or a custom vocabulary filter (or both) with your request but do not want to use automatic language identification, use Settings with the VocabularyName or VocabularyFilterName (or both) sub-parameter. If you're using automatic language identification with your request and want to include a custom language model, a custom vocabulary, or a custom vocabulary filter, use instead the  parameter with the LanguageModelName, VocabularyName or VocabularyFilterName sub-parameters.
     */
    Settings?: Settings;
    /**
     * Specify the custom language model you want to include with your transcription job. If you include ModelSettings in your request, you must include the LanguageModelName sub-parameter. For more information, see Custom language models.
     */
    ModelSettings?: ModelSettings;
    /**
     * Makes it possible to control how your transcription job is processed. Currently, the only JobExecutionSettings modification you can choose is enabling job queueing using the AllowDeferredExecution sub-parameter. If you include JobExecutionSettings in your request, you must also include the sub-parameters: AllowDeferredExecution and DataAccessRoleArn.
     */
    JobExecutionSettings?: JobExecutionSettings;
    /**
     * Makes it possible to redact or flag specified personally identifiable information (PII) in your transcript. If you use ContentRedaction, you must also include the sub-parameters: PiiEntityTypes, RedactionOutput, and RedactionType.
     */
    ContentRedaction?: ContentRedaction;
    /**
     * Enables automatic language identification in your transcription job request. Use this parameter if your media file contains only one language. If your media contains multiple languages, use IdentifyMultipleLanguages instead. If you include IdentifyLanguage, you can optionally include a list of language codes, using LanguageOptions, that you think may be present in your media file. Including LanguageOptions restricts IdentifyLanguage to only the language options that you specify, which can improve transcription accuracy. If you want to apply a custom language model, a custom vocabulary, or a custom vocabulary filter to your automatic language identification request, include LanguageIdSettings with the relevant sub-parameters (VocabularyName, LanguageModelName, and VocabularyFilterName). If you include LanguageIdSettings, also include LanguageOptions. Note that you must include one of LanguageCode, IdentifyLanguage, or IdentifyMultipleLanguages in your request. If you include more than one of these parameters, your transcription job fails.
     */
    IdentifyLanguage?: Boolean;
    /**
     * Enables automatic multi-language identification in your transcription job request. Use this parameter if your media file contains more than one language. If your media contains only one language, use IdentifyLanguage instead. If you include IdentifyMultipleLanguages, you can optionally include a list of language codes, using LanguageOptions, that you think may be present in your media file. Including LanguageOptions restricts IdentifyLanguage to only the language options that you specify, which can improve transcription accuracy. If you want to apply a custom vocabulary or a custom vocabulary filter to your automatic language identification request, include LanguageIdSettings with the relevant sub-parameters (VocabularyName and VocabularyFilterName). If you include LanguageIdSettings, also include LanguageOptions. Note that you must include one of LanguageCode, IdentifyLanguage, or IdentifyMultipleLanguages in your request. If you include more than one of these parameters, your transcription job fails.
     */
    IdentifyMultipleLanguages?: Boolean;
    /**
     * You can specify two or more language codes that represent the languages you think may be present in your media. Including more than five is not recommended. If you're unsure what languages are present, do not include this parameter. If you include LanguageOptions in your request, you must also include IdentifyLanguage. For more information, refer to Supported languages. To transcribe speech in Modern Standard Arabic (ar-SA), your media file must be encoded at a sample rate of 16,000 Hz or higher.
     */
    LanguageOptions?: LanguageOptions;
    /**
     * Produces subtitle files for your input media. You can specify WebVTT (*.vtt) and SubRip (*.srt) formats.
     */
    Subtitles?: Subtitles;
    /**
     * Adds one or more custom tags, each in the form of a key:value pair, to a new transcription job at the time you start this new job. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
     */
    Tags?: TagList;
    /**
     * If using automatic language identification in your request and you want to apply a custom language model, a custom vocabulary, or a custom vocabulary filter, include LanguageIdSettings with the relevant sub-parameters (VocabularyName, LanguageModelName, and VocabularyFilterName). Note that multi-language identification (IdentifyMultipleLanguages) doesn't support custom language models.  LanguageIdSettings supports two to five language codes. Each language code you include can have an associated custom language model, custom vocabulary, and custom vocabulary filter. The language codes that you specify must match the languages of the associated custom language models, custom vocabularies, and custom vocabulary filters. It's recommended that you include LanguageOptions when using LanguageIdSettings to ensure that the correct language dialect is identified. For example, if you specify a custom vocabulary that is in en-US but Amazon Transcribe determines that the language spoken in your media is en-AU, your custom vocabulary is not applied to your transcription. If you include LanguageOptions and include en-US as the only English language dialect, your custom vocabulary is applied to your transcription. If you want to include a custom language model with your request but do not want to use automatic language identification, use instead the  parameter with the LanguageModelName sub-parameter. If you want to include a custom vocabulary or a custom vocabulary filter (or both) with your request but do not want to use automatic language identification, use instead the  parameter with the VocabularyName or VocabularyFilterName (or both) sub-parameter.
     */
    LanguageIdSettings?: LanguageIdSettingsMap;
    /**
     * Enables toxic speech detection in your transcript. If you include ToxicityDetection in your request, you must also include ToxicityCategories. For information on the types of toxic speech Amazon Transcribe can detect, see Detecting toxic speech.
     */
    ToxicityDetection?: ToxicityDetection;
  }
  export interface StartTranscriptionJobResponse {
    /**
     * Provides detailed information about the current transcription job, including job status and, if applicable, failure reason.
     */
    TranscriptionJob?: TranscriptionJob;
  }
  export type StringTargetList = NonEmptyString[];
  export type SubtitleFileUris = Uri[];
  export type SubtitleFormat = "vtt"|"srt"|string;
  export type SubtitleFormats = SubtitleFormat[];
  export type SubtitleOutputStartIndex = number;
  export interface Subtitles {
    /**
     * Specify the output format for your subtitle file; if you select both WebVTT (vtt) and SubRip (srt) formats, two output files are generated.
     */
    Formats?: SubtitleFormats;
    /**
     * Specify the starting value that is assigned to the first subtitle segment. The default start index for Amazon Transcribe is 0, which differs from the more widely used standard of 1. If you're uncertain which value to use, we recommend choosing 1, as this may improve compatibility with other services.
     */
    OutputStartIndex?: SubtitleOutputStartIndex;
  }
  export interface SubtitlesOutput {
    /**
     * Provides the format of your subtitle files. If your request included both WebVTT (vtt) and SubRip (srt) formats, both formats are shown.
     */
    Formats?: SubtitleFormats;
    /**
     * The Amazon S3 location of your transcript. You can use this URI to access or download your subtitle file. Your subtitle file is stored in the same location as your transcript. If you specified both WebVTT and SubRip subtitle formats, two URIs are provided. If you included OutputBucketName in your transcription job request, this is the URI of that bucket. If you also included OutputKey in your request, your output is located in the path you specified in your request. If you didn't include OutputBucketName in your transcription job request, your subtitle file is stored in a service-managed bucket, and TranscriptFileUri provides you with a temporary URI you can use for secure access to your subtitle file.  Temporary URIs for service-managed Amazon S3 buckets are only valid for 15 minutes. If you get an AccesDenied error, you can get a new temporary URI by running a GetTranscriptionJob or ListTranscriptionJob request. 
     */
    SubtitleFileUris?: SubtitleFileUris;
    /**
     * Provides the start index value for your subtitle files. If you did not specify a value in your request, the default value of 0 is used.
     */
    OutputStartIndex?: SubtitleOutputStartIndex;
  }
  export interface Tag {
    /**
     * The first part of a key:value pair that forms a tag associated with a given resource. For example, in the tag Department:Sales, the key is 'Department'.
     */
    Key: TagKey;
    /**
     * The second part of a key:value pair that forms a tag associated with a given resource. For example, in the tag Department:Sales, the value is 'Sales'. Note that you can set the value of a tag to an empty string, but you can't set the value of a tag to null. Omitting the tag value is the same as using an empty string.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource you want to tag. ARNs have the format arn:partition:service:region:account-id:resource-type/resource-id. For example, arn:aws:transcribe:us-west-2:111122223333:transcription-job/transcription-job-name. Valid values for resource-type are: transcription-job, medical-transcription-job, vocabulary, medical-vocabulary, vocabulary-filter, and language-model.
     */
    ResourceArn: TranscribeArn;
    /**
     * Adds one or more custom tags, each in the form of a key:value pair, to the specified resource. To learn more about using tags with Amazon Transcribe, refer to Tagging resources.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TimestampMilliseconds = number;
  export type ToxicityCategories = ToxicityCategory[];
  export type ToxicityCategory = "ALL"|string;
  export type ToxicityDetection = ToxicityDetectionSettings[];
  export interface ToxicityDetectionSettings {
    /**
     *  If you include ToxicityDetection in your transcription request, you must also include ToxicityCategories. The only accepted value for this parameter is ALL.
     */
    ToxicityCategories: ToxicityCategories;
  }
  export type TranscribeArn = string;
  export interface Transcript {
    /**
     * The Amazon S3 location of your transcript. You can use this URI to access or download your transcript. If you included OutputBucketName in your transcription job request, this is the URI of that bucket. If you also included OutputKey in your request, your output is located in the path you specified in your request. If you didn't include OutputBucketName in your transcription job request, your transcript is stored in a service-managed bucket, and TranscriptFileUri provides you with a temporary URI you can use for secure access to your transcript.  Temporary URIs for service-managed Amazon S3 buckets are only valid for 15 minutes. If you get an AccesDenied error, you can get a new temporary URI by running a GetTranscriptionJob or ListTranscriptionJob request. 
     */
    TranscriptFileUri?: Uri;
    /**
     * The Amazon S3 location of your redacted transcript. You can use this URI to access or download your transcript. If you included OutputBucketName in your transcription job request, this is the URI of that bucket. If you also included OutputKey in your request, your output is located in the path you specified in your request. If you didn't include OutputBucketName in your transcription job request, your transcript is stored in a service-managed bucket, and RedactedTranscriptFileUri provides you with a temporary URI you can use for secure access to your transcript.  Temporary URIs for service-managed Amazon S3 buckets are only valid for 15 minutes. If you get an AccesDenied error, you can get a new temporary URI by running a GetTranscriptionJob or ListTranscriptionJob request. 
     */
    RedactedTranscriptFileUri?: Uri;
  }
  export interface TranscriptFilter {
    /**
     * Flag the presence or absence of an exact match to the phrases that you specify. For example, if you specify the phrase "speak to a manager" as your Targets value, only that exact phrase is flagged. Note that semantic matching is not supported. For example, if your customer says "speak to the manager", instead of "speak to a manager", your content is not flagged.
     */
    TranscriptFilterType: TranscriptFilterType;
    /**
     * Makes it possible to specify a time range (in milliseconds) in your audio, during which you want to search for the specified key words or phrases. See for more detail.
     */
    AbsoluteTimeRange?: AbsoluteTimeRange;
    /**
     * Makes it possible to specify a time range (in percentage) in your media file, during which you want to search for the specified key words or phrases. See for more detail.
     */
    RelativeTimeRange?: RelativeTimeRange;
    /**
     * Specify the participant that you want to flag. Omitting this parameter is equivalent to specifying both participants.
     */
    ParticipantRole?: ParticipantRole;
    /**
     * Set to TRUE to flag the absence of the phrase that you specified in your request. Set to FALSE to flag the presence of the phrase that you specified in your request.
     */
    Negate?: Boolean;
    /**
     * Specify the phrases that you want to flag.
     */
    Targets: StringTargetList;
  }
  export type TranscriptFilterType = "EXACT"|string;
  export interface TranscriptionJob {
    /**
     * The name of the transcription job. Job names are case sensitive and must be unique within an Amazon Web Services account.
     */
    TranscriptionJobName?: TranscriptionJobName;
    /**
     * Provides the status of the specified transcription job. If the status is COMPLETED, the job is finished and you can find the results at the location specified in TranscriptFileUri (or RedactedTranscriptFileUri, if you requested transcript redaction). If the status is FAILED, FailureReason provides details on why your transcription job failed.
     */
    TranscriptionJobStatus?: TranscriptionJobStatus;
    /**
     * The language code used to create your transcription job. This parameter is used with single-language identification. For multi-language identification requests, refer to the plural version of this parameter, LanguageCodes.
     */
    LanguageCode?: LanguageCode;
    /**
     * The sample rate, in hertz, of the audio track in your input media file.
     */
    MediaSampleRateHertz?: MediaSampleRateHertz;
    /**
     * The format of the input media file.
     */
    MediaFormat?: MediaFormat;
    /**
     * Provides the Amazon S3 location of the media file you used in your request.
     */
    Media?: Media;
    /**
     * Provides you with the Amazon S3 URI you can use to access your transcript.
     */
    Transcript?: Transcript;
    /**
     * The date and time the specified transcription job began processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.789000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    StartTime?: DateTime;
    /**
     * The date and time the specified transcription job request was made. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    CreationTime?: DateTime;
    /**
     * The date and time the specified transcription job finished processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:33:13.922000-07:00 represents a transcription job that started processing at 12:33 PM UTC-7 on May 4, 2022.
     */
    CompletionTime?: DateTime;
    /**
     * If TranscriptionJobStatus is FAILED, FailureReason contains information about why the transcription job request failed. The FailureReason field contains one of the following values:    Unsupported media format. The media format specified in MediaFormat isn't valid. Refer to MediaFormat for a list of supported formats.    The media format provided does not match the detected media format. The media format specified in MediaFormat doesn't match the format of the input file. Check the media format of your media file and correct the specified value.    Invalid sample rate for audio file. The sample rate specified in MediaSampleRateHertz isn't valid. The sample rate must be between 8,000 and 48,000 hertz.    The sample rate provided does not match the detected sample rate. The sample rate specified in MediaSampleRateHertz doesn't match the sample rate detected in your input media file. Check the sample rate of your media file and correct the specified value.    Invalid file size: file size too large. The size of your media file is larger than what Amazon Transcribe can process. For more information, refer to Guidelines and quotas.    Invalid number of channels: number of channels too large. Your audio contains more channels than Amazon Transcribe is able to process. For more information, refer to Guidelines and quotas.  
     */
    FailureReason?: FailureReason;
    /**
     * Provides information on any additional settings that were included in your request. Additional settings include channel identification, alternative transcriptions, speaker partitioning, custom vocabularies, and custom vocabulary filters.
     */
    Settings?: Settings;
    /**
     * Provides information on the custom language model you included in your request.
     */
    ModelSettings?: ModelSettings;
    /**
     * Provides information about how your transcription job was processed. This parameter shows if your request was queued and what data access role was used.
     */
    JobExecutionSettings?: JobExecutionSettings;
    /**
     * Indicates whether redaction was enabled in your transcript.
     */
    ContentRedaction?: ContentRedaction;
    /**
     * Indicates whether automatic language identification was enabled (TRUE) for the specified transcription job.
     */
    IdentifyLanguage?: Boolean;
    /**
     * Indicates whether automatic multi-language identification was enabled (TRUE) for the specified transcription job.
     */
    IdentifyMultipleLanguages?: Boolean;
    /**
     * Provides the language codes you specified in your request.
     */
    LanguageOptions?: LanguageOptions;
    /**
     * The confidence score associated with the language identified in your media file. Confidence scores are values between 0 and 1; a larger value indicates a higher probability that the identified language correctly matches the language spoken in your media.
     */
    IdentifiedLanguageScore?: IdentifiedLanguageScore;
    /**
     * The language codes used to create your transcription job. This parameter is used with multi-language identification. For single-language identification requests, refer to the singular version of this parameter, LanguageCode.
     */
    LanguageCodes?: LanguageCodeList;
    /**
     * The tags, each in the form of a key:value pair, assigned to the specified transcription job.
     */
    Tags?: TagList;
    /**
     * Indicates whether subtitles were generated with your transcription.
     */
    Subtitles?: SubtitlesOutput;
    /**
     * Provides the name and language of all custom language models, custom vocabularies, and custom vocabulary filters that you included in your request.
     */
    LanguageIdSettings?: LanguageIdSettingsMap;
    /**
     * Provides information about the toxicity detection settings applied to your transcription.
     */
    ToxicityDetection?: ToxicityDetection;
  }
  export type TranscriptionJobName = string;
  export type TranscriptionJobStatus = "QUEUED"|"IN_PROGRESS"|"FAILED"|"COMPLETED"|string;
  export type TranscriptionJobSummaries = TranscriptionJobSummary[];
  export interface TranscriptionJobSummary {
    /**
     * The name of the transcription job. Job names are case sensitive and must be unique within an Amazon Web Services account.
     */
    TranscriptionJobName?: TranscriptionJobName;
    /**
     * The date and time the specified transcription job request was made. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    CreationTime?: DateTime;
    /**
     * The date and time your transcription job began processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.789000-07:00 represents a transcription job that started processing at 12:32 PM UTC-7 on May 4, 2022.
     */
    StartTime?: DateTime;
    /**
     * The date and time the specified transcription job finished processing. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:33:13.922000-07:00 represents a transcription job that started processing at 12:33 PM UTC-7 on May 4, 2022.
     */
    CompletionTime?: DateTime;
    /**
     * The language code used to create your transcription.
     */
    LanguageCode?: LanguageCode;
    /**
     * Provides the status of your transcription job. If the status is COMPLETED, the job is finished and you can find the results at the location specified in TranscriptFileUri (or RedactedTranscriptFileUri, if you requested transcript redaction). If the status is FAILED, FailureReason provides details on why your transcription job failed.
     */
    TranscriptionJobStatus?: TranscriptionJobStatus;
    /**
     * If TranscriptionJobStatus is FAILED, FailureReason contains information about why the transcription job failed. See also: Common Errors.
     */
    FailureReason?: FailureReason;
    /**
     * Indicates where the specified transcription output is stored. If the value is CUSTOMER_BUCKET, the location is the Amazon S3 bucket you specified using the OutputBucketName parameter in your request. If you also included OutputKey in your request, your output is located in the path you specified in your request. If the value is SERVICE_BUCKET, the location is a service-managed Amazon S3 bucket. To access a transcript stored in a service-managed bucket, use the URI shown in the TranscriptFileUri or RedactedTranscriptFileUri field.
     */
    OutputLocationType?: OutputLocationType;
    /**
     * The content redaction settings of the transcription job.
     */
    ContentRedaction?: ContentRedaction;
    ModelSettings?: ModelSettings;
    /**
     * Indicates whether automatic language identification was enabled (TRUE) for the specified transcription job.
     */
    IdentifyLanguage?: Boolean;
    /**
     * Indicates whether automatic multi-language identification was enabled (TRUE) for the specified transcription job.
     */
    IdentifyMultipleLanguages?: Boolean;
    /**
     * The confidence score associated with the language identified in your media file. Confidence scores are values between 0 and 1; a larger value indicates a higher probability that the identified language correctly matches the language spoken in your media.
     */
    IdentifiedLanguageScore?: IdentifiedLanguageScore;
    /**
     * The language codes used to create your transcription job. This parameter is used with multi-language identification. For single-language identification, the singular version of this parameter, LanguageCode, is present.
     */
    LanguageCodes?: LanguageCodeList;
    /**
     * Indicates whether toxicity detection was enabled for the specified transcription job.
     */
    ToxicityDetection?: ToxicityDetection;
  }
  export type Type = "CONVERSATION"|"DICTATION"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Transcribe resource you want to remove tags from. ARNs have the format arn:partition:service:region:account-id:resource-type/resource-id. For example, arn:aws:transcribe:us-west-2:111122223333:transcription-job/transcription-job-name. Valid values for resource-type are: transcription-job, medical-transcription-job, vocabulary, medical-vocabulary, vocabulary-filter, and language-model.
     */
    ResourceArn: TranscribeArn;
    /**
     * Removes the specified tag keys from the specified Amazon Transcribe resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateCallAnalyticsCategoryRequest {
    /**
     * The name of the Call Analytics category you want to update. Category names are case sensitive.
     */
    CategoryName: CategoryName;
    /**
     * The rules used for the updated Call Analytics category. The rules you provide in this field replace the ones that are currently being used in the specified category.
     */
    Rules: RuleList;
    /**
     * Choose whether you want to update a real-time or a post-call category. The input type you specify must match the input type specified when the category was created. For example, if you created a category with the POST_CALL input type, you must use POST_CALL as the input type when updating this category.
     */
    InputType?: InputType;
  }
  export interface UpdateCallAnalyticsCategoryResponse {
    /**
     * Provides you with the properties of the Call Analytics category you specified in your UpdateCallAnalyticsCategory request.
     */
    CategoryProperties?: CategoryProperties;
  }
  export interface UpdateMedicalVocabularyRequest {
    /**
     * The name of the custom medical vocabulary you want to update. Custom medical vocabulary names are case sensitive.
     */
    VocabularyName: VocabularyName;
    /**
     * The language code that represents the language of the entries in the custom vocabulary you want to update. US English (en-US) is the only language supported with Amazon Transcribe Medical.
     */
    LanguageCode: LanguageCode;
    /**
     * The Amazon S3 location of the text file that contains your custom medical vocabulary. The URI must be located in the same Amazon Web Services Region as the resource you're calling. Here's an example URI path: s3://DOC-EXAMPLE-BUCKET/my-vocab-file.txt 
     */
    VocabularyFileUri: Uri;
  }
  export interface UpdateMedicalVocabularyResponse {
    /**
     * The name of the updated custom medical vocabulary.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code you selected for your custom medical vocabulary. US English (en-US) is the only language supported with Amazon Transcribe Medical.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time the specified custom medical vocabulary was last updated. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * The processing state of your custom medical vocabulary. If the state is READY, you can use the custom vocabulary in a StartMedicalTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
  }
  export interface UpdateVocabularyFilterRequest {
    /**
     * The name of the custom vocabulary filter you want to update. Custom vocabulary filter names are case sensitive.
     */
    VocabularyFilterName: VocabularyFilterName;
    /**
     * Use this parameter if you want to update your custom vocabulary filter by including all desired terms, as comma-separated values, within your request. The other option for updating your vocabulary filter is to save your entries in a text file and upload them to an Amazon S3 bucket, then specify the location of your file using the VocabularyFilterFileUri parameter. Note that if you include Words in your request, you cannot use VocabularyFilterFileUri; you must choose one or the other. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary filter request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language.
     */
    Words?: Words;
    /**
     * The Amazon S3 location of the text file that contains your custom vocabulary filter terms. The URI must be located in the same Amazon Web Services Region as the resource you're calling. Here's an example URI path: s3://DOC-EXAMPLE-BUCKET/my-vocab-filter-file.txt  Note that if you include VocabularyFilterFileUri in your request, you cannot use Words; you must choose one or the other.
     */
    VocabularyFilterFileUri?: Uri;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files (in this case, your custom vocabulary filter). If the role that you specify doesn’t have the appropriate permissions to access the specified Amazon S3 location, your request fails. IAM role ARNs have the format arn:partition:iam::account:role/role-name-with-path. For example: arn:aws:iam::111122223333:role/Admin. For more information, see IAM ARNs.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
  }
  export interface UpdateVocabularyFilterResponse {
    /**
     * The name of the updated custom vocabulary filter.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The language code you selected for your custom vocabulary filter.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time the specified custom vocabulary filter was last updated. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
  }
  export interface UpdateVocabularyRequest {
    /**
     * The name of the custom vocabulary you want to update. Custom vocabulary names are case sensitive.
     */
    VocabularyName: VocabularyName;
    /**
     * The language code that represents the language of the entries in the custom vocabulary you want to update. Each custom vocabulary must contain terms in only one language. A custom vocabulary can only be used to transcribe files in the same language as the custom vocabulary. For example, if you create a custom vocabulary using US English (en-US), you can only apply this custom vocabulary to files that contain English audio. For a list of supported languages and their associated language codes, refer to the Supported languages table.
     */
    LanguageCode: LanguageCode;
    /**
     * Use this parameter if you want to update your custom vocabulary by including all desired terms, as comma-separated values, within your request. The other option for updating your custom vocabulary is to save your entries in a text file and upload them to an Amazon S3 bucket, then specify the location of your file using the VocabularyFileUri parameter. Note that if you include Phrases in your request, you cannot use VocabularyFileUri; you must choose one or the other. Each language has a character set that contains all allowed characters for that specific language. If you use unsupported characters, your custom vocabulary filter request fails. Refer to Character Sets for Custom Vocabularies to get the character set for your language.
     */
    Phrases?: Phrases;
    /**
     * The Amazon S3 location of the text file that contains your custom vocabulary. The URI must be located in the same Amazon Web Services Region as the resource you're calling. Here's an example URI path: s3://DOC-EXAMPLE-BUCKET/my-vocab-file.txt  Note that if you include VocabularyFileUri in your request, you cannot use the Phrases flag; you must choose one or the other.
     */
    VocabularyFileUri?: Uri;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permissions to access the Amazon S3 bucket that contains your input files (in this case, your custom vocabulary). If the role that you specify doesn’t have the appropriate permissions to access the specified Amazon S3 location, your request fails. IAM role ARNs have the format arn:partition:iam::account:role/role-name-with-path. For example: arn:aws:iam::111122223333:role/Admin. For more information, see IAM ARNs.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
  }
  export interface UpdateVocabularyResponse {
    /**
     * The name of the updated custom vocabulary.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code you selected for your custom vocabulary.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time the specified custom vocabulary was last updated. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * The processing state of your custom vocabulary. If the state is READY, you can use the custom vocabulary in a StartTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
  }
  export type Uri = string;
  export type Vocabularies = VocabularyInfo[];
  export interface VocabularyFilterInfo {
    /**
     * A unique name, chosen by you, for your custom vocabulary filter. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The language code that represents the language of the entries in your vocabulary filter. Each custom vocabulary filter must contain terms in only one language. A custom vocabulary filter can only be used to transcribe files in the same language as the filter. For example, if you create a custom vocabulary filter using US English (en-US), you can only apply this filter to files that contain English audio. For a list of supported languages and their associated language codes, refer to the Supported languages table.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time the specified custom vocabulary filter was last modified. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
  }
  export type VocabularyFilterMethod = "remove"|"mask"|"tag"|string;
  export type VocabularyFilterName = string;
  export type VocabularyFilters = VocabularyFilterInfo[];
  export interface VocabularyInfo {
    /**
     * A unique name, chosen by you, for your custom vocabulary. This name is case sensitive, cannot contain spaces, and must be unique within an Amazon Web Services account.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code used to create your custom vocabulary. Each custom vocabulary must contain terms in only one language. A custom vocabulary can only be used to transcribe files in the same language as the custom vocabulary. For example, if you create a custom vocabulary using US English (en-US), you can only apply this custom vocabulary to files that contain English audio.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time the specified custom vocabulary was last modified. Timestamps are in the format YYYY-MM-DD'T'HH:MM:SS.SSSSSS-UTC. For example, 2022-05-04T12:32:58.761000-07:00 represents 12:32 PM UTC-7 on May 4, 2022.
     */
    LastModifiedTime?: DateTime;
    /**
     * The processing state of your custom vocabulary. If the state is READY, you can use the custom vocabulary in a StartTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
  }
  export type VocabularyName = string;
  export type VocabularyState = "PENDING"|"READY"|"FAILED"|string;
  export type Word = string;
  export type Words = Word[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-10-26"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the TranscribeService client.
   */
  export import Types = TranscribeService;
}
export = TranscribeService;
