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
   * Creates an analytics category. Amazon Transcribe applies the conditions specified by your analytics categories to your call analytics jobs. For each analytics category, you specify one or more rules. For example, you can specify a rule that the customer sentiment was neutral or negative within that category. If you start a call analytics job, Amazon Transcribe applies the category to the analytics job that you've specified.
   */
  createCallAnalyticsCategory(params: TranscribeService.Types.CreateCallAnalyticsCategoryRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.CreateCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Creates an analytics category. Amazon Transcribe applies the conditions specified by your analytics categories to your call analytics jobs. For each analytics category, you specify one or more rules. For example, you can specify a rule that the customer sentiment was neutral or negative within that category. If you start a call analytics job, Amazon Transcribe applies the category to the analytics job that you've specified.
   */
  createCallAnalyticsCategory(callback?: (err: AWSError, data: TranscribeService.Types.CreateCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.CreateCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Creates a new custom language model. Use Amazon S3 prefixes to provide the location of your input files. The time it takes to create your model depends on the size of your training data.
   */
  createLanguageModel(params: TranscribeService.Types.CreateLanguageModelRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateLanguageModelResponse) => void): Request<TranscribeService.Types.CreateLanguageModelResponse, AWSError>;
  /**
   * Creates a new custom language model. Use Amazon S3 prefixes to provide the location of your input files. The time it takes to create your model depends on the size of your training data.
   */
  createLanguageModel(callback?: (err: AWSError, data: TranscribeService.Types.CreateLanguageModelResponse) => void): Request<TranscribeService.Types.CreateLanguageModelResponse, AWSError>;
  /**
   * Creates a new custom vocabulary that you can use to modify how Amazon Transcribe Medical transcribes your audio file.
   */
  createMedicalVocabulary(params: TranscribeService.Types.CreateMedicalVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateMedicalVocabularyResponse) => void): Request<TranscribeService.Types.CreateMedicalVocabularyResponse, AWSError>;
  /**
   * Creates a new custom vocabulary that you can use to modify how Amazon Transcribe Medical transcribes your audio file.
   */
  createMedicalVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.CreateMedicalVocabularyResponse) => void): Request<TranscribeService.Types.CreateMedicalVocabularyResponse, AWSError>;
  /**
   * Creates a new custom vocabulary that you can use to change the way Amazon Transcribe handles transcription of an audio file.
   */
  createVocabulary(params: TranscribeService.Types.CreateVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateVocabularyResponse) => void): Request<TranscribeService.Types.CreateVocabularyResponse, AWSError>;
  /**
   * Creates a new custom vocabulary that you can use to change the way Amazon Transcribe handles transcription of an audio file.
   */
  createVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.CreateVocabularyResponse) => void): Request<TranscribeService.Types.CreateVocabularyResponse, AWSError>;
  /**
   * Creates a new vocabulary filter that you can use to filter words, such as profane words, from the output of a transcription job.
   */
  createVocabularyFilter(params: TranscribeService.Types.CreateVocabularyFilterRequest, callback?: (err: AWSError, data: TranscribeService.Types.CreateVocabularyFilterResponse) => void): Request<TranscribeService.Types.CreateVocabularyFilterResponse, AWSError>;
  /**
   * Creates a new vocabulary filter that you can use to filter words, such as profane words, from the output of a transcription job.
   */
  createVocabularyFilter(callback?: (err: AWSError, data: TranscribeService.Types.CreateVocabularyFilterResponse) => void): Request<TranscribeService.Types.CreateVocabularyFilterResponse, AWSError>;
  /**
   * Deletes a call analytics category using its name.
   */
  deleteCallAnalyticsCategory(params: TranscribeService.Types.DeleteCallAnalyticsCategoryRequest, callback?: (err: AWSError, data: TranscribeService.Types.DeleteCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.DeleteCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Deletes a call analytics category using its name.
   */
  deleteCallAnalyticsCategory(callback?: (err: AWSError, data: TranscribeService.Types.DeleteCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.DeleteCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Deletes a call analytics job using its name.
   */
  deleteCallAnalyticsJob(params: TranscribeService.Types.DeleteCallAnalyticsJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.DeleteCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.DeleteCallAnalyticsJobResponse, AWSError>;
  /**
   * Deletes a call analytics job using its name.
   */
  deleteCallAnalyticsJob(callback?: (err: AWSError, data: TranscribeService.Types.DeleteCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.DeleteCallAnalyticsJobResponse, AWSError>;
  /**
   * Deletes a custom language model using its name.
   */
  deleteLanguageModel(params: TranscribeService.Types.DeleteLanguageModelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a custom language model using its name.
   */
  deleteLanguageModel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a transcription job generated by Amazon Transcribe Medical and any related information.
   */
  deleteMedicalTranscriptionJob(params: TranscribeService.Types.DeleteMedicalTranscriptionJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a transcription job generated by Amazon Transcribe Medical and any related information.
   */
  deleteMedicalTranscriptionJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a vocabulary from Amazon Transcribe Medical.
   */
  deleteMedicalVocabulary(params: TranscribeService.Types.DeleteMedicalVocabularyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a vocabulary from Amazon Transcribe Medical.
   */
  deleteMedicalVocabulary(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a previously submitted transcription job along with any other generated results such as the transcription, models, and so on.
   */
  deleteTranscriptionJob(params: TranscribeService.Types.DeleteTranscriptionJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a previously submitted transcription job along with any other generated results such as the transcription, models, and so on.
   */
  deleteTranscriptionJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a vocabulary from Amazon Transcribe. 
   */
  deleteVocabulary(params: TranscribeService.Types.DeleteVocabularyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a vocabulary from Amazon Transcribe. 
   */
  deleteVocabulary(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a vocabulary filter.
   */
  deleteVocabularyFilter(params: TranscribeService.Types.DeleteVocabularyFilterRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a vocabulary filter.
   */
  deleteVocabularyFilter(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets information about a single custom language model. Use this information to see details about the language model in your Amazon Web Services account. You can also see whether the base language model used to create your custom language model has been updated. If Amazon Transcribe has updated the base model, you can create a new custom language model using the updated base model. If the language model wasn't created, you can use this operation to understand why Amazon Transcribe couldn't create it. 
   */
  describeLanguageModel(params: TranscribeService.Types.DescribeLanguageModelRequest, callback?: (err: AWSError, data: TranscribeService.Types.DescribeLanguageModelResponse) => void): Request<TranscribeService.Types.DescribeLanguageModelResponse, AWSError>;
  /**
   * Gets information about a single custom language model. Use this information to see details about the language model in your Amazon Web Services account. You can also see whether the base language model used to create your custom language model has been updated. If Amazon Transcribe has updated the base model, you can create a new custom language model using the updated base model. If the language model wasn't created, you can use this operation to understand why Amazon Transcribe couldn't create it. 
   */
  describeLanguageModel(callback?: (err: AWSError, data: TranscribeService.Types.DescribeLanguageModelResponse) => void): Request<TranscribeService.Types.DescribeLanguageModelResponse, AWSError>;
  /**
   * Retrieves information about a call analytics category.
   */
  getCallAnalyticsCategory(params: TranscribeService.Types.GetCallAnalyticsCategoryRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.GetCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Retrieves information about a call analytics category.
   */
  getCallAnalyticsCategory(callback?: (err: AWSError, data: TranscribeService.Types.GetCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.GetCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Returns information about a call analytics job. To see the status of the job, check the CallAnalyticsJobStatus field. If the status is COMPLETED, the job is finished and you can find the results at the location specified in the TranscriptFileUri field. If you enable personally identifiable information (PII) redaction, the redacted transcript appears in the RedactedTranscriptFileUri field.
   */
  getCallAnalyticsJob(params: TranscribeService.Types.GetCallAnalyticsJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.GetCallAnalyticsJobResponse, AWSError>;
  /**
   * Returns information about a call analytics job. To see the status of the job, check the CallAnalyticsJobStatus field. If the status is COMPLETED, the job is finished and you can find the results at the location specified in the TranscriptFileUri field. If you enable personally identifiable information (PII) redaction, the redacted transcript appears in the RedactedTranscriptFileUri field.
   */
  getCallAnalyticsJob(callback?: (err: AWSError, data: TranscribeService.Types.GetCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.GetCallAnalyticsJobResponse, AWSError>;
  /**
   * Returns information about a transcription job from Amazon Transcribe Medical. To see the status of the job, check the TranscriptionJobStatus field. If the status is COMPLETED, the job is finished. You find the results of the completed job in the TranscriptFileUri field.
   */
  getMedicalTranscriptionJob(params: TranscribeService.Types.GetMedicalTranscriptionJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetMedicalTranscriptionJobResponse) => void): Request<TranscribeService.Types.GetMedicalTranscriptionJobResponse, AWSError>;
  /**
   * Returns information about a transcription job from Amazon Transcribe Medical. To see the status of the job, check the TranscriptionJobStatus field. If the status is COMPLETED, the job is finished. You find the results of the completed job in the TranscriptFileUri field.
   */
  getMedicalTranscriptionJob(callback?: (err: AWSError, data: TranscribeService.Types.GetMedicalTranscriptionJobResponse) => void): Request<TranscribeService.Types.GetMedicalTranscriptionJobResponse, AWSError>;
  /**
   * Retrieves information about a medical vocabulary.
   */
  getMedicalVocabulary(params: TranscribeService.Types.GetMedicalVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetMedicalVocabularyResponse) => void): Request<TranscribeService.Types.GetMedicalVocabularyResponse, AWSError>;
  /**
   * Retrieves information about a medical vocabulary.
   */
  getMedicalVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.GetMedicalVocabularyResponse) => void): Request<TranscribeService.Types.GetMedicalVocabularyResponse, AWSError>;
  /**
   * Returns information about a transcription job. To see the status of the job, check the TranscriptionJobStatus field. If the status is COMPLETED, the job is finished and you can find the results at the location specified in the TranscriptFileUri field. If you enable content redaction, the redacted transcript appears in RedactedTranscriptFileUri.
   */
  getTranscriptionJob(params: TranscribeService.Types.GetTranscriptionJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetTranscriptionJobResponse) => void): Request<TranscribeService.Types.GetTranscriptionJobResponse, AWSError>;
  /**
   * Returns information about a transcription job. To see the status of the job, check the TranscriptionJobStatus field. If the status is COMPLETED, the job is finished and you can find the results at the location specified in the TranscriptFileUri field. If you enable content redaction, the redacted transcript appears in RedactedTranscriptFileUri.
   */
  getTranscriptionJob(callback?: (err: AWSError, data: TranscribeService.Types.GetTranscriptionJobResponse) => void): Request<TranscribeService.Types.GetTranscriptionJobResponse, AWSError>;
  /**
   * Gets information about a vocabulary. 
   */
  getVocabulary(params: TranscribeService.Types.GetVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetVocabularyResponse) => void): Request<TranscribeService.Types.GetVocabularyResponse, AWSError>;
  /**
   * Gets information about a vocabulary. 
   */
  getVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.GetVocabularyResponse) => void): Request<TranscribeService.Types.GetVocabularyResponse, AWSError>;
  /**
   * Returns information about a vocabulary filter.
   */
  getVocabularyFilter(params: TranscribeService.Types.GetVocabularyFilterRequest, callback?: (err: AWSError, data: TranscribeService.Types.GetVocabularyFilterResponse) => void): Request<TranscribeService.Types.GetVocabularyFilterResponse, AWSError>;
  /**
   * Returns information about a vocabulary filter.
   */
  getVocabularyFilter(callback?: (err: AWSError, data: TranscribeService.Types.GetVocabularyFilterResponse) => void): Request<TranscribeService.Types.GetVocabularyFilterResponse, AWSError>;
  /**
   * Provides more information about the call analytics categories that you've created. You can use the information in this list to find a specific category. You can then use the operation to get more information about it.
   */
  listCallAnalyticsCategories(params: TranscribeService.Types.ListCallAnalyticsCategoriesRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListCallAnalyticsCategoriesResponse) => void): Request<TranscribeService.Types.ListCallAnalyticsCategoriesResponse, AWSError>;
  /**
   * Provides more information about the call analytics categories that you've created. You can use the information in this list to find a specific category. You can then use the operation to get more information about it.
   */
  listCallAnalyticsCategories(callback?: (err: AWSError, data: TranscribeService.Types.ListCallAnalyticsCategoriesResponse) => void): Request<TranscribeService.Types.ListCallAnalyticsCategoriesResponse, AWSError>;
  /**
   * List call analytics jobs with a specified status or substring that matches their names.
   */
  listCallAnalyticsJobs(params: TranscribeService.Types.ListCallAnalyticsJobsRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListCallAnalyticsJobsResponse) => void): Request<TranscribeService.Types.ListCallAnalyticsJobsResponse, AWSError>;
  /**
   * List call analytics jobs with a specified status or substring that matches their names.
   */
  listCallAnalyticsJobs(callback?: (err: AWSError, data: TranscribeService.Types.ListCallAnalyticsJobsResponse) => void): Request<TranscribeService.Types.ListCallAnalyticsJobsResponse, AWSError>;
  /**
   * Provides more information about the custom language models you've created. You can use the information in this list to find a specific custom language model. You can then use the operation to get more information about it.
   */
  listLanguageModels(params: TranscribeService.Types.ListLanguageModelsRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListLanguageModelsResponse) => void): Request<TranscribeService.Types.ListLanguageModelsResponse, AWSError>;
  /**
   * Provides more information about the custom language models you've created. You can use the information in this list to find a specific custom language model. You can then use the operation to get more information about it.
   */
  listLanguageModels(callback?: (err: AWSError, data: TranscribeService.Types.ListLanguageModelsResponse) => void): Request<TranscribeService.Types.ListLanguageModelsResponse, AWSError>;
  /**
   * Lists medical transcription jobs with a specified status or substring that matches their names.
   */
  listMedicalTranscriptionJobs(params: TranscribeService.Types.ListMedicalTranscriptionJobsRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListMedicalTranscriptionJobsResponse) => void): Request<TranscribeService.Types.ListMedicalTranscriptionJobsResponse, AWSError>;
  /**
   * Lists medical transcription jobs with a specified status or substring that matches their names.
   */
  listMedicalTranscriptionJobs(callback?: (err: AWSError, data: TranscribeService.Types.ListMedicalTranscriptionJobsResponse) => void): Request<TranscribeService.Types.ListMedicalTranscriptionJobsResponse, AWSError>;
  /**
   * Returns a list of vocabularies that match the specified criteria. If you don't enter a value in any of the request parameters, returns the entire list of vocabularies.
   */
  listMedicalVocabularies(params: TranscribeService.Types.ListMedicalVocabulariesRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListMedicalVocabulariesResponse) => void): Request<TranscribeService.Types.ListMedicalVocabulariesResponse, AWSError>;
  /**
   * Returns a list of vocabularies that match the specified criteria. If you don't enter a value in any of the request parameters, returns the entire list of vocabularies.
   */
  listMedicalVocabularies(callback?: (err: AWSError, data: TranscribeService.Types.ListMedicalVocabulariesResponse) => void): Request<TranscribeService.Types.ListMedicalVocabulariesResponse, AWSError>;
  /**
   * Lists all tags associated with a given transcription job, vocabulary, or resource.
   */
  listTagsForResource(params: TranscribeService.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListTagsForResourceResponse) => void): Request<TranscribeService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags associated with a given transcription job, vocabulary, or resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: TranscribeService.Types.ListTagsForResourceResponse) => void): Request<TranscribeService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists transcription jobs with the specified status.
   */
  listTranscriptionJobs(params: TranscribeService.Types.ListTranscriptionJobsRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListTranscriptionJobsResponse) => void): Request<TranscribeService.Types.ListTranscriptionJobsResponse, AWSError>;
  /**
   * Lists transcription jobs with the specified status.
   */
  listTranscriptionJobs(callback?: (err: AWSError, data: TranscribeService.Types.ListTranscriptionJobsResponse) => void): Request<TranscribeService.Types.ListTranscriptionJobsResponse, AWSError>;
  /**
   * Returns a list of vocabularies that match the specified criteria. If no criteria are specified, returns the entire list of vocabularies.
   */
  listVocabularies(params: TranscribeService.Types.ListVocabulariesRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListVocabulariesResponse) => void): Request<TranscribeService.Types.ListVocabulariesResponse, AWSError>;
  /**
   * Returns a list of vocabularies that match the specified criteria. If no criteria are specified, returns the entire list of vocabularies.
   */
  listVocabularies(callback?: (err: AWSError, data: TranscribeService.Types.ListVocabulariesResponse) => void): Request<TranscribeService.Types.ListVocabulariesResponse, AWSError>;
  /**
   * Gets information about vocabulary filters.
   */
  listVocabularyFilters(params: TranscribeService.Types.ListVocabularyFiltersRequest, callback?: (err: AWSError, data: TranscribeService.Types.ListVocabularyFiltersResponse) => void): Request<TranscribeService.Types.ListVocabularyFiltersResponse, AWSError>;
  /**
   * Gets information about vocabulary filters.
   */
  listVocabularyFilters(callback?: (err: AWSError, data: TranscribeService.Types.ListVocabularyFiltersResponse) => void): Request<TranscribeService.Types.ListVocabularyFiltersResponse, AWSError>;
  /**
   * Starts an asynchronous analytics job that not only transcribes the audio recording of a caller and agent, but also returns additional insights. These insights include how quickly or loudly the caller or agent was speaking. To retrieve additional insights with your analytics jobs, create categories. A category is a way to classify analytics jobs based on attributes, such as a customer's sentiment or a particular phrase being used during the call. For more information, see the operation. 
   */
  startCallAnalyticsJob(params: TranscribeService.Types.StartCallAnalyticsJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.StartCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.StartCallAnalyticsJobResponse, AWSError>;
  /**
   * Starts an asynchronous analytics job that not only transcribes the audio recording of a caller and agent, but also returns additional insights. These insights include how quickly or loudly the caller or agent was speaking. To retrieve additional insights with your analytics jobs, create categories. A category is a way to classify analytics jobs based on attributes, such as a customer's sentiment or a particular phrase being used during the call. For more information, see the operation. 
   */
  startCallAnalyticsJob(callback?: (err: AWSError, data: TranscribeService.Types.StartCallAnalyticsJobResponse) => void): Request<TranscribeService.Types.StartCallAnalyticsJobResponse, AWSError>;
  /**
   * Starts a batch job to transcribe medical speech to text.
   */
  startMedicalTranscriptionJob(params: TranscribeService.Types.StartMedicalTranscriptionJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.StartMedicalTranscriptionJobResponse) => void): Request<TranscribeService.Types.StartMedicalTranscriptionJobResponse, AWSError>;
  /**
   * Starts a batch job to transcribe medical speech to text.
   */
  startMedicalTranscriptionJob(callback?: (err: AWSError, data: TranscribeService.Types.StartMedicalTranscriptionJobResponse) => void): Request<TranscribeService.Types.StartMedicalTranscriptionJobResponse, AWSError>;
  /**
   * Starts an asynchronous job to transcribe speech to text.
   */
  startTranscriptionJob(params: TranscribeService.Types.StartTranscriptionJobRequest, callback?: (err: AWSError, data: TranscribeService.Types.StartTranscriptionJobResponse) => void): Request<TranscribeService.Types.StartTranscriptionJobResponse, AWSError>;
  /**
   * Starts an asynchronous job to transcribe speech to text.
   */
  startTranscriptionJob(callback?: (err: AWSError, data: TranscribeService.Types.StartTranscriptionJobResponse) => void): Request<TranscribeService.Types.StartTranscriptionJobResponse, AWSError>;
  /**
   * Tags a Amazon Transcribe resource with the given list of tags.
   */
  tagResource(params: TranscribeService.Types.TagResourceRequest, callback?: (err: AWSError, data: TranscribeService.Types.TagResourceResponse) => void): Request<TranscribeService.Types.TagResourceResponse, AWSError>;
  /**
   * Tags a Amazon Transcribe resource with the given list of tags.
   */
  tagResource(callback?: (err: AWSError, data: TranscribeService.Types.TagResourceResponse) => void): Request<TranscribeService.Types.TagResourceResponse, AWSError>;
  /**
   * Removes specified tags from a specified Amazon Transcribe resource.
   */
  untagResource(params: TranscribeService.Types.UntagResourceRequest, callback?: (err: AWSError, data: TranscribeService.Types.UntagResourceResponse) => void): Request<TranscribeService.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes specified tags from a specified Amazon Transcribe resource.
   */
  untagResource(callback?: (err: AWSError, data: TranscribeService.Types.UntagResourceResponse) => void): Request<TranscribeService.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the call analytics category with new values. The UpdateCallAnalyticsCategory operation overwrites all of the existing information with the values that you provide in the request. 
   */
  updateCallAnalyticsCategory(params: TranscribeService.Types.UpdateCallAnalyticsCategoryRequest, callback?: (err: AWSError, data: TranscribeService.Types.UpdateCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.UpdateCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Updates the call analytics category with new values. The UpdateCallAnalyticsCategory operation overwrites all of the existing information with the values that you provide in the request. 
   */
  updateCallAnalyticsCategory(callback?: (err: AWSError, data: TranscribeService.Types.UpdateCallAnalyticsCategoryResponse) => void): Request<TranscribeService.Types.UpdateCallAnalyticsCategoryResponse, AWSError>;
  /**
   * Updates a vocabulary with new values that you provide in a different text file from the one you used to create the vocabulary. The UpdateMedicalVocabulary operation overwrites all of the existing information with the values that you provide in the request.
   */
  updateMedicalVocabulary(params: TranscribeService.Types.UpdateMedicalVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.UpdateMedicalVocabularyResponse) => void): Request<TranscribeService.Types.UpdateMedicalVocabularyResponse, AWSError>;
  /**
   * Updates a vocabulary with new values that you provide in a different text file from the one you used to create the vocabulary. The UpdateMedicalVocabulary operation overwrites all of the existing information with the values that you provide in the request.
   */
  updateMedicalVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.UpdateMedicalVocabularyResponse) => void): Request<TranscribeService.Types.UpdateMedicalVocabularyResponse, AWSError>;
  /**
   * Updates an existing vocabulary with new values. The UpdateVocabulary operation overwrites all of the existing information with the values that you provide in the request. 
   */
  updateVocabulary(params: TranscribeService.Types.UpdateVocabularyRequest, callback?: (err: AWSError, data: TranscribeService.Types.UpdateVocabularyResponse) => void): Request<TranscribeService.Types.UpdateVocabularyResponse, AWSError>;
  /**
   * Updates an existing vocabulary with new values. The UpdateVocabulary operation overwrites all of the existing information with the values that you provide in the request. 
   */
  updateVocabulary(callback?: (err: AWSError, data: TranscribeService.Types.UpdateVocabularyResponse) => void): Request<TranscribeService.Types.UpdateVocabularyResponse, AWSError>;
  /**
   * Updates a vocabulary filter with a new list of filtered words.
   */
  updateVocabularyFilter(params: TranscribeService.Types.UpdateVocabularyFilterRequest, callback?: (err: AWSError, data: TranscribeService.Types.UpdateVocabularyFilterResponse) => void): Request<TranscribeService.Types.UpdateVocabularyFilterResponse, AWSError>;
  /**
   * Updates a vocabulary filter with a new list of filtered words.
   */
  updateVocabularyFilter(callback?: (err: AWSError, data: TranscribeService.Types.UpdateVocabularyFilterResponse) => void): Request<TranscribeService.Types.UpdateVocabularyFilterResponse, AWSError>;
}
declare namespace TranscribeService {
  export interface AbsoluteTimeRange {
    /**
     * A value that indicates the beginning of the time range in seconds. To set absolute time range, you must specify a start time and an end time. For example, if you specify the following values:   StartTime - 10000   Endtime - 50000   The time range is set between 10,000 milliseconds and 50,000 milliseconds into the call.
     */
    StartTime?: TimestampMilliseconds;
    /**
     * A value that indicates the end of the time range in milliseconds. To set absolute time range, you must specify a start time and an end time. For example, if you specify the following values:   StartTime - 10000   Endtime - 50000   The time range is set between 10,000 milliseconds and 50,000 milliseconds into the call. 
     */
    EndTime?: TimestampMilliseconds;
    /**
     * A time range from the beginning of the call to the value that you've specified. For example, if you specify 100000, the time range is set to the first 100,000 milliseconds of the call.
     */
    First?: TimestampMilliseconds;
    /**
     * A time range from the value that you've specified to the end of the call. For example, if you specify 100000, the time range is set to the last 100,000 milliseconds of the call.
     */
    Last?: TimestampMilliseconds;
  }
  export type BaseModelName = "NarrowBand"|"WideBand"|string;
  export type Boolean = boolean;
  export type CLMLanguageCode = "en-US"|"hi-IN"|"es-US"|"en-GB"|"en-AU"|string;
  export interface CallAnalyticsJob {
    /**
     * The name of the call analytics job.
     */
    CallAnalyticsJobName?: CallAnalyticsJobName;
    /**
     * The status of the analytics job.
     */
    CallAnalyticsJobStatus?: CallAnalyticsJobStatus;
    /**
     * If you know the language spoken between the customer and the agent, specify a language code for this field. If you don't know the language, you can leave this field blank, and Amazon Transcribe will use machine learning to automatically identify the language. To improve the accuracy of language identification, you can provide an array containing the possible language codes for the language spoken in your audio. Refer to Supported languages and language-specific features for additional information.
     */
    LanguageCode?: LanguageCode;
    /**
     * The sample rate, in Hertz, of the audio.
     */
    MediaSampleRateHertz?: MediaSampleRateHertz;
    /**
     * The format of the input audio file. Note: for call analytics jobs, only the following media formats are supported: MP3, MP4, WAV, FLAC, OGG, and WebM. 
     */
    MediaFormat?: MediaFormat;
    Media?: Media;
    Transcript?: Transcript;
    /**
     * A timestamp that shows when the analytics job started processing.
     */
    StartTime?: DateTime;
    /**
     * A timestamp that shows when the analytics job was created.
     */
    CreationTime?: DateTime;
    /**
     * A timestamp that shows when the analytics job was completed.
     */
    CompletionTime?: DateTime;
    /**
     * If the AnalyticsJobStatus is FAILED, this field contains information about why the job failed. The FailureReason field can contain one of the following values:    Unsupported media format: The media format specified in the MediaFormat field of the request isn't valid. See the description of the MediaFormat field for a list of valid values.    The media format provided does not match the detected media format: The media format of the audio file doesn't match the format specified in the MediaFormat field in the request. Check the media format of your media file and make sure the two values match.    Invalid sample rate for audio file: The sample rate specified in the MediaSampleRateHertz of the request isn't valid. The sample rate must be between 8,000 and 48,000 Hertz.    The sample rate provided does not match the detected sample rate: The sample rate in the audio file doesn't match the sample rate specified in the MediaSampleRateHertz field in the request. Check the sample rate of your media file and make sure that the two values match.    Invalid file size: file size too large: The size of your audio file is larger than what Amazon Transcribe Medical can process. For more information, see Guidelines and Quotas in the Amazon Transcribe Medical Guide.    Invalid number of channels: number of channels too large: Your audio contains more channels than Amazon Transcribe Medical is configured to process. To request additional channels, see Amazon Transcribe Medical Endpoints and Quotas in the Amazon Web Services General Reference.  
     */
    FailureReason?: FailureReason;
    /**
     * The Amazon Resource Number (ARN) that you use to get access to the analytics job.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
    /**
     * A value between zero and one that Amazon Transcribe assigned to the language that it identified in the source audio. This value appears only when you don't provide a single language code. Larger values indicate that Amazon Transcribe has higher confidence in the language that it identified
     */
    IdentifiedLanguageScore?: IdentifiedLanguageScore;
    /**
     * Provides information about the settings used to run a transcription job.
     */
    Settings?: CallAnalyticsJobSettings;
    /**
     * Shows numeric values to indicate the channel assigned to the agent's audio and the channel assigned to the customer's audio. 
     */
    ChannelDefinitions?: ChannelDefinitions;
  }
  export type CallAnalyticsJobName = string;
  export interface CallAnalyticsJobSettings {
    /**
     * The name of a vocabulary to use when processing the call analytics job.
     */
    VocabularyName?: VocabularyName;
    /**
     * The name of the vocabulary filter to use when running a call analytics job. The filter that you specify must have the same language code as the analytics job.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * Set to mask to remove filtered text from the transcript and replace it with three asterisks ("***") as placeholder text. Set to remove to remove filtered text from the transcript without using placeholder text. Set to tag to mark the word in the transcription output that matches the vocabulary filter. When you set the filter method to tag, the words matching your vocabulary filter are not masked or removed.
     */
    VocabularyFilterMethod?: VocabularyFilterMethod;
    /**
     * The structure used to describe a custom language model.
     */
    LanguageModelName?: ModelName;
    ContentRedaction?: ContentRedaction;
    /**
     * When you run a call analytics job, you can specify the language spoken in the audio, or you can have Amazon Transcribe identify the language for you. To specify a language, specify an array with one language code. If you don't know the language, you can leave this field blank and Amazon Transcribe will use machine learning to identify the language for you. To improve the ability of Amazon Transcribe to correctly identify the language, you can provide an array of the languages that can be present in the audio. Refer to Supported languages and language-specific features for additional information.
     */
    LanguageOptions?: LanguageOptions;
  }
  export type CallAnalyticsJobStatus = "QUEUED"|"IN_PROGRESS"|"FAILED"|"COMPLETED"|string;
  export type CallAnalyticsJobSummaries = CallAnalyticsJobSummary[];
  export interface CallAnalyticsJobSummary {
    /**
     * The name of the call analytics job.
     */
    CallAnalyticsJobName?: CallAnalyticsJobName;
    /**
     * A timestamp that shows when the call analytics job was created.
     */
    CreationTime?: DateTime;
    /**
     * A timestamp that shows when the job began processing.
     */
    StartTime?: DateTime;
    /**
     * A timestamp that shows when the job was completed.
     */
    CompletionTime?: DateTime;
    /**
     * The language of the transcript in the source audio file.
     */
    LanguageCode?: LanguageCode;
    /**
     * The status of the call analytics job.
     */
    CallAnalyticsJobStatus?: CallAnalyticsJobStatus;
    /**
     * If the CallAnalyticsJobStatus is FAILED, a description of the error.
     */
    FailureReason?: FailureReason;
  }
  export type CategoryName = string;
  export interface CategoryProperties {
    /**
     * The name of the call analytics category.
     */
    CategoryName?: CategoryName;
    /**
     * The rules used to create a call analytics category.
     */
    Rules?: RuleList;
    /**
     * A timestamp that shows when the call analytics category was created.
     */
    CreateTime?: DateTime;
    /**
     * A timestamp that shows when the call analytics category was most recently updated.
     */
    LastUpdateTime?: DateTime;
  }
  export type CategoryPropertiesList = CategoryProperties[];
  export interface ChannelDefinition {
    /**
     * A value that indicates the audio channel.
     */
    ChannelId?: ChannelId;
    /**
     * Indicates whether the person speaking on the audio channel is the agent or customer.
     */
    ParticipantRole?: ParticipantRole;
  }
  export type ChannelDefinitions = ChannelDefinition[];
  export type ChannelId = number;
  export interface ContentRedaction {
    /**
     * Request parameter that defines the entities to be redacted. The only accepted value is PII.
     */
    RedactionType: RedactionType;
    /**
     * The output transcript file stored in either the default S3 bucket or in a bucket you specify. When you choose redacted Amazon Transcribe outputs only the redacted transcript. When you choose redacted_and_unredacted Amazon Transcribe outputs both the redacted and unredacted transcripts.
     */
    RedactionOutput: RedactionOutput;
  }
  export interface CreateCallAnalyticsCategoryRequest {
    /**
     * The name that you choose for your category when you create it. 
     */
    CategoryName: CategoryName;
    /**
     * To create a category, you must specify between 1 and 20 rules. For each rule, you specify a filter to be applied to the attributes of the call. For example, you can specify a sentiment filter to detect if the customer's sentiment was negative or neutral. 
     */
    Rules: RuleList;
  }
  export interface CreateCallAnalyticsCategoryResponse {
    /**
     * The rules and associated metadata used to create a category.
     */
    CategoryProperties?: CategoryProperties;
  }
  export interface CreateLanguageModelRequest {
    /**
     * The language of the input text you're using to train your custom language model.
     */
    LanguageCode: CLMLanguageCode;
    /**
     * The Amazon Transcribe standard language model, or base model used to create your custom language model. If you want to use your custom language model to transcribe audio with a sample rate of 16,000 Hz or greater, choose Wideband. If you want to use your custom language model to transcribe audio with a sample rate that is less than 16,000 Hz, choose Narrowband.
     */
    BaseModelName: BaseModelName;
    /**
     * The name you choose for your custom language model when you create it.
     */
    ModelName: ModelName;
    /**
     * Contains the data access role and the Amazon S3 prefixes to read the required input files to create a custom language model.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Adds one or more tags, each in the form of a key:value pair, to a new language model at the time you create this new model.
     */
    Tags?: TagList;
  }
  export interface CreateLanguageModelResponse {
    /**
     * The language code of the text you've used to create a custom language model.
     */
    LanguageCode?: CLMLanguageCode;
    /**
     * The Amazon Transcribe standard language model, or base model you've used to create a custom language model.
     */
    BaseModelName?: BaseModelName;
    /**
     * The name you've chosen for your custom language model.
     */
    ModelName?: ModelName;
    /**
     * The data access role and Amazon S3 prefixes you've chosen to create your custom language model.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The status of the custom language model. When the status is COMPLETED the model is ready to use.
     */
    ModelStatus?: ModelStatus;
  }
  export interface CreateMedicalVocabularyRequest {
    /**
     * The name of the custom vocabulary. This case-sensitive name must be unique within an Amazon Web Services account. If you try to create a vocabulary with the same name as a previous vocabulary, you get a ConflictException error.
     */
    VocabularyName: VocabularyName;
    /**
     * The language code for the language used for the entries in your custom vocabulary. The language code of your custom vocabulary must match the language code of your transcription job. US English (en-US) is the only language code available for Amazon Transcribe Medical.
     */
    LanguageCode: LanguageCode;
    /**
     * The location in Amazon S3 of the text file you use to define your custom vocabulary. The URI must be in the same Amazon Web Services Region as the resource that you're calling. Enter information about your VocabularyFileUri in the following format:   https://s3.&lt;aws-region&gt;.amazonaws.com/&lt;bucket-name&gt;/&lt;keyprefix&gt;/&lt;objectkey&gt;   The following is an example URI for a vocabulary file that is stored in Amazon S3:  https://s3.us-east-1.amazonaws.com/AWSDOC-EXAMPLE-BUCKET/vocab.txt  For more information about Amazon S3 object names, see Object Keys in the Amazon S3 Developer Guide. For more information about custom vocabularies, see Medical Custom Vocabularies.
     */
    VocabularyFileUri: Uri;
    /**
     * Adds one or more tags, each in the form of a key:value pair, to a new medical vocabulary at the time you create this new vocabulary.
     */
    Tags?: TagList;
  }
  export interface CreateMedicalVocabularyResponse {
    /**
     * The name of the vocabulary. The name must be unique within an Amazon Web Services account and is case sensitive.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code for the entries in your custom vocabulary. US English (en-US) is the only valid language code for Amazon Transcribe Medical.
     */
    LanguageCode?: LanguageCode;
    /**
     * The processing state of your custom vocabulary in Amazon Transcribe Medical. If the state is READY, you can use the vocabulary in a StartMedicalTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
    /**
     * The date and time that you created the vocabulary.
     */
    LastModifiedTime?: DateTime;
    /**
     * If the VocabularyState field is FAILED, this field contains information about why the job failed.
     */
    FailureReason?: FailureReason;
  }
  export interface CreateVocabularyFilterRequest {
    /**
     * The vocabulary filter name. The name must be unique within the account that contains it. If you try to create a vocabulary filter with the same name as another vocabulary filter, you get a ConflictException error.
     */
    VocabularyFilterName: VocabularyFilterName;
    /**
     * The language code of the words in the vocabulary filter. All words in the filter must be in the same language. The vocabulary filter can only be used with transcription jobs in the specified language.
     */
    LanguageCode: LanguageCode;
    /**
     * The words to use in the vocabulary filter. Only use characters from the character set defined for custom vocabularies. For a list of character sets, see Character Sets for Custom Vocabularies. If you provide a list of words in the Words parameter, you can't use the VocabularyFilterFileUri parameter.
     */
    Words?: Words;
    /**
     * The Amazon S3 location of a text file used as input to create the vocabulary filter. Only use characters from the character set defined for custom vocabularies. For a list of character sets, see Character Sets for Custom Vocabularies. The specified file must be less than 50 KB of UTF-8 characters. If you provide the location of a list of words in the VocabularyFilterFileUri parameter, you can't use the Words parameter.
     */
    VocabularyFilterFileUri?: Uri;
    /**
     * Adds one or more tags, each in the form of a key:value pair, to a new Amazon Transcribe vocabulary filter at the time you create this new vocabulary filter.
     */
    Tags?: TagList;
  }
  export interface CreateVocabularyFilterResponse {
    /**
     * The name of the vocabulary filter.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The language code of the words in the collection.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time that the vocabulary filter was modified.
     */
    LastModifiedTime?: DateTime;
  }
  export interface CreateVocabularyRequest {
    /**
     * The name of the vocabulary. The name must be unique within an Amazon Web Services account. The name is case sensitive. If you try to create a vocabulary with the same name as a previous vocabulary you will receive a ConflictException error.
     */
    VocabularyName: VocabularyName;
    /**
     * The language code of the vocabulary entries. For a list of languages and their corresponding language codes, see transcribe-whatis.
     */
    LanguageCode: LanguageCode;
    /**
     * An array of strings that contains the vocabulary entries. 
     */
    Phrases?: Phrases;
    /**
     * The S3 location of the text file that contains the definition of the custom vocabulary. The URI must be in the same region as the API endpoint that you are calling. The general form is: For more information about S3 object names, see Object Keys in the Amazon S3 Developer Guide. For more information about custom vocabularies, see Custom vocabularies.
     */
    VocabularyFileUri?: Uri;
    /**
     * Adds one or more tags, each in the form of a key:value pair, to a new Amazon Transcribe vocabulary at the time you create this new vocabulary.
     */
    Tags?: TagList;
  }
  export interface CreateVocabularyResponse {
    /**
     * The name of the vocabulary.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code of the vocabulary entries.
     */
    LanguageCode?: LanguageCode;
    /**
     * The processing state of the vocabulary. When the VocabularyState field contains READY the vocabulary is ready to be used in a StartTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
    /**
     * The date and time that the vocabulary was created.
     */
    LastModifiedTime?: DateTime;
    /**
     * If the VocabularyState field is FAILED, this field contains information about why the job failed.
     */
    FailureReason?: FailureReason;
  }
  export type DataAccessRoleArn = string;
  export type DateTime = Date;
  export interface DeleteCallAnalyticsCategoryRequest {
    /**
     * The name of the call analytics category that you're choosing to delete. The value is case sensitive. 
     */
    CategoryName: CategoryName;
  }
  export interface DeleteCallAnalyticsCategoryResponse {
  }
  export interface DeleteCallAnalyticsJobRequest {
    /**
     * The name of the call analytics job you want to delete.
     */
    CallAnalyticsJobName: CallAnalyticsJobName;
  }
  export interface DeleteCallAnalyticsJobResponse {
  }
  export interface DeleteLanguageModelRequest {
    /**
     * The name of the model you're choosing to delete.
     */
    ModelName: ModelName;
  }
  export interface DeleteMedicalTranscriptionJobRequest {
    /**
     * The name you provide to the DeleteMedicalTranscriptionJob object to delete a transcription job.
     */
    MedicalTranscriptionJobName: TranscriptionJobName;
  }
  export interface DeleteMedicalVocabularyRequest {
    /**
     * The name of the vocabulary that you want to delete.
     */
    VocabularyName: VocabularyName;
  }
  export interface DeleteTranscriptionJobRequest {
    /**
     * The name of the transcription job to be deleted.
     */
    TranscriptionJobName: TranscriptionJobName;
  }
  export interface DeleteVocabularyFilterRequest {
    /**
     * The name of the vocabulary filter to remove.
     */
    VocabularyFilterName: VocabularyFilterName;
  }
  export interface DeleteVocabularyRequest {
    /**
     * The name of the vocabulary to delete. 
     */
    VocabularyName: VocabularyName;
  }
  export interface DescribeLanguageModelRequest {
    /**
     * The name of the custom language model you submit to get more information.
     */
    ModelName: ModelName;
  }
  export interface DescribeLanguageModelResponse {
    /**
     * The name of the custom language model you requested more information about.
     */
    LanguageModel?: LanguageModel;
  }
  export type FailureReason = string;
  export interface GetCallAnalyticsCategoryRequest {
    /**
     * The name of the category you want information about. This value is case sensitive.
     */
    CategoryName: CategoryName;
  }
  export interface GetCallAnalyticsCategoryResponse {
    /**
     * The rules you've defined for a category.
     */
    CategoryProperties?: CategoryProperties;
  }
  export interface GetCallAnalyticsJobRequest {
    /**
     * The name of the analytics job you want information about. This value is case sensitive. 
     */
    CallAnalyticsJobName: CallAnalyticsJobName;
  }
  export interface GetCallAnalyticsJobResponse {
    /**
     * An object that contains the results of your call analytics job.
     */
    CallAnalyticsJob?: CallAnalyticsJob;
  }
  export interface GetMedicalTranscriptionJobRequest {
    /**
     * The name of the medical transcription job.
     */
    MedicalTranscriptionJobName: TranscriptionJobName;
  }
  export interface GetMedicalTranscriptionJobResponse {
    /**
     * An object that contains the results of the medical transcription job.
     */
    MedicalTranscriptionJob?: MedicalTranscriptionJob;
  }
  export interface GetMedicalVocabularyRequest {
    /**
     * The name of the vocabulary that you want information about. The value is case sensitive. 
     */
    VocabularyName: VocabularyName;
  }
  export interface GetMedicalVocabularyResponse {
    /**
     * The name of the vocabulary returned by Amazon Transcribe Medical.
     */
    VocabularyName?: VocabularyName;
    /**
     * The valid language code for your vocabulary entries.
     */
    LanguageCode?: LanguageCode;
    /**
     * The processing state of the vocabulary. If the VocabularyState is READY then you can use it in the StartMedicalTranscriptionJob operation.
     */
    VocabularyState?: VocabularyState;
    /**
     * The date and time that the vocabulary was last modified with a text file different from the one that was previously used.
     */
    LastModifiedTime?: DateTime;
    /**
     * If the VocabularyState is FAILED, this field contains information about why the job failed.
     */
    FailureReason?: FailureReason;
    /**
     * The location in Amazon S3 where the vocabulary is stored. Use this URI to get the contents of the vocabulary. You can download your vocabulary from the URI for a limited time.
     */
    DownloadUri?: Uri;
  }
  export interface GetTranscriptionJobRequest {
    /**
     * The name of the job.
     */
    TranscriptionJobName: TranscriptionJobName;
  }
  export interface GetTranscriptionJobResponse {
    /**
     * An object that contains the results of the transcription job.
     */
    TranscriptionJob?: TranscriptionJob;
  }
  export interface GetVocabularyFilterRequest {
    /**
     * The name of the vocabulary filter for which to return information.
     */
    VocabularyFilterName: VocabularyFilterName;
  }
  export interface GetVocabularyFilterResponse {
    /**
     * The name of the vocabulary filter.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The language code of the words in the vocabulary filter.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time that the contents of the vocabulary filter were updated.
     */
    LastModifiedTime?: DateTime;
    /**
     * The URI of the list of words in the vocabulary filter. You can use this URI to get the list of words.
     */
    DownloadUri?: Uri;
  }
  export interface GetVocabularyRequest {
    /**
     * The name of the vocabulary to return information about. The name is case sensitive.
     */
    VocabularyName: VocabularyName;
  }
  export interface GetVocabularyResponse {
    /**
     * The name of the vocabulary to return.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code of the vocabulary entries.
     */
    LanguageCode?: LanguageCode;
    /**
     * The processing state of the vocabulary.
     */
    VocabularyState?: VocabularyState;
    /**
     * The date and time that the vocabulary was last modified.
     */
    LastModifiedTime?: DateTime;
    /**
     * If the VocabularyState field is FAILED, this field contains information about why the job failed.
     */
    FailureReason?: FailureReason;
    /**
     * The S3 location where the vocabulary is stored. Use this URI to get the contents of the vocabulary. The URI is available for a limited time.
     */
    DownloadUri?: Uri;
  }
  export type IdentifiedLanguageScore = number;
  export interface InputDataConfig {
    /**
     * The Amazon S3 prefix you specify to access the plain text files that you use to train your custom language model.
     */
    S3Uri: Uri;
    /**
     * The Amazon S3 prefix you specify to access the plain text files that you use to tune your custom language model.
     */
    TuningDataS3Uri?: Uri;
    /**
     * The Amazon Resource Name (ARN) that uniquely identifies the permissions you've given Amazon Transcribe to access your Amazon S3 buckets containing your media files or text data.
     */
    DataAccessRoleArn: DataAccessRoleArn;
  }
  export interface InterruptionFilter {
    /**
     * The duration of the interruption.
     */
    Threshold?: TimestampMilliseconds;
    /**
     * Indicates whether the caller or customer was interrupting.
     */
    ParticipantRole?: ParticipantRole;
    /**
     * An object you can use to specify a time range (in milliseconds) for when you'd want to find the interruption. For example, you could search for an interruption between the 30,000 millisecond mark and the 45,000 millisecond mark. You could also specify the time period as the first 15,000 milliseconds or the last 15,000 milliseconds. 
     */
    AbsoluteTimeRange?: AbsoluteTimeRange;
    /**
     * An object that allows percentages to specify the proportion of the call where there was a interruption. For example, you can specify the first half of the call. You can also specify the period of time between halfway through to three-quarters of the way through the call. Because the length of conversation can vary between calls, you can apply relative time ranges across all calls.
     */
    RelativeTimeRange?: RelativeTimeRange;
    /**
     * Set to TRUE to look for a time period where there was no interruption.
     */
    Negate?: Boolean;
  }
  export interface JobExecutionSettings {
    /**
     * Indicates whether a job should be queued by Amazon Transcribe when the concurrent execution limit is exceeded. When the AllowDeferredExecution field is true, jobs are queued and executed when the number of executing jobs falls below the concurrent execution limit. If the field is false, Amazon Transcribe returns a LimitExceededException exception. Note that job queuing is enabled by default for call analytics jobs. If you specify the AllowDeferredExecution field, you must specify the DataAccessRoleArn field.
     */
    AllowDeferredExecution?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a role that has access to the S3 bucket that contains the input files. Amazon Transcribe assumes this role to read queued media files. If you have specified an output S3 bucket for the transcription results, this role should have access to the output bucket as well. If you specify the AllowDeferredExecution field, you must specify the DataAccessRoleArn field.
     */
    DataAccessRoleArn?: DataAccessRoleArn;
  }
  export type KMSEncryptionContextMap = {[key: string]: NonEmptyString};
  export type KMSKeyId = string;
  export type LanguageCode = "af-ZA"|"ar-AE"|"ar-SA"|"cy-GB"|"da-DK"|"de-CH"|"de-DE"|"en-AB"|"en-AU"|"en-GB"|"en-IE"|"en-IN"|"en-US"|"en-WL"|"es-ES"|"es-US"|"fa-IR"|"fr-CA"|"fr-FR"|"ga-IE"|"gd-GB"|"he-IL"|"hi-IN"|"id-ID"|"it-IT"|"ja-JP"|"ko-KR"|"ms-MY"|"nl-NL"|"pt-BR"|"pt-PT"|"ru-RU"|"ta-IN"|"te-IN"|"tr-TR"|"zh-CN"|"zh-TW"|"th-TH"|"en-ZA"|"en-NZ"|string;
  export interface LanguageModel {
    /**
     * The name of the custom language model.
     */
    ModelName?: ModelName;
    /**
     * The time the custom language model was created.
     */
    CreateTime?: DateTime;
    /**
     * The most recent time the custom language model was modified.
     */
    LastModifiedTime?: DateTime;
    /**
     * The language code you used to create your custom language model.
     */
    LanguageCode?: CLMLanguageCode;
    /**
     * The Amazon Transcribe standard language model, or base model used to create the custom language model.
     */
    BaseModelName?: BaseModelName;
    /**
     * The creation status of a custom language model. When the status is COMPLETED the model is ready for use.
     */
    ModelStatus?: ModelStatus;
    /**
     * Whether the base model used for the custom language model is up to date. If this field is true then you are running the most up-to-date version of the base model in your custom language model.
     */
    UpgradeAvailability?: Boolean;
    /**
     * The reason why the custom language model couldn't be created.
     */
    FailureReason?: FailureReason;
    /**
     * The data access role and Amazon S3 prefixes for the input files used to train the custom language model.
     */
    InputDataConfig?: InputDataConfig;
  }
  export type LanguageOptions = LanguageCode[];
  export interface ListCallAnalyticsCategoriesRequest {
    /**
     * When included, NextTokenfetches the next set of categories if the result of the previous request was truncated.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of categories to return in each page of results. If there are fewer results than the value you specify, only the actual results are returned. If you do not specify a value, the default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListCallAnalyticsCategoriesResponse {
    /**
     * The operation returns a page of jobs at a time. The maximum size of the list is set by the MaxResults parameter. If there are more categories in the list than the page size, Amazon Transcribe returns the NextPage token. Include the token in the next request to the operation to return the next page of analytics categories.
     */
    NextToken?: NextToken;
    /**
     * A list of objects containing information about analytics categories.
     */
    Categories?: CategoryPropertiesList;
  }
  export interface ListCallAnalyticsJobsRequest {
    /**
     * When specified, returns only call analytics jobs with the specified status. Jobs are ordered by creation date, with the most recent jobs returned first. If you don't specify a status, Amazon Transcribe returns all analytics jobs ordered by creation date.
     */
    Status?: CallAnalyticsJobStatus;
    /**
     * When specified, the jobs returned in the list are limited to jobs whose name contains the specified string.
     */
    JobNameContains?: CallAnalyticsJobName;
    /**
     * If you receive a truncated result in the previous request of , include NextToken to fetch the next set of jobs.
     */
    NextToken?: NextToken;
    /**
     *  The maximum number of call analytics jobs to return in each page of results. If there are fewer results than the value you specify, only the actual results are returned. If you do not specify a value, the default of 5 is used. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListCallAnalyticsJobsResponse {
    /**
     * When specified, returns only call analytics jobs with that status. Jobs are ordered by creation date, with the most recent jobs returned first. If you don't specify a status, Amazon Transcribe returns all transcription jobs ordered by creation date.
     */
    Status?: CallAnalyticsJobStatus;
    /**
     * The operation returns a page of jobs at a time. The maximum size of the page is set by the MaxResults parameter. If there are more jobs in the list than the page size, Amazon Transcribe returns the NextPage token. Include the token in your next request to the operation to return next page of jobs.
     */
    NextToken?: NextToken;
    /**
     * A list of objects containing summary information for a transcription job.
     */
    CallAnalyticsJobSummaries?: CallAnalyticsJobSummaries;
  }
  export interface ListLanguageModelsRequest {
    /**
     * When specified, returns only custom language models with the specified status. Language models are ordered by creation date, with the newest models first. If you don't specify a status, Amazon Transcribe returns all custom language models ordered by date.
     */
    StatusEquals?: ModelStatus;
    /**
     * When specified, the custom language model names returned contain the substring you've specified.
     */
    NameContains?: ModelName;
    /**
     * When included, fetches the next set of jobs if the result of the previous request was truncated.
     */
    NextToken?: NextToken;
    /**
     *  The maximum number of language models to return in each page of results. If there are fewer results than the value you specify, only the actual results are returned. If you do not specify a value, the default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListLanguageModelsResponse {
    /**
     * The operation returns a page of jobs at a time. The maximum size of the list is set by the MaxResults parameter. If there are more language models in the list than the page size, Amazon Transcribe returns the NextPage token. Include the token in the next request to the operation to return the next page of language models.
     */
    NextToken?: NextToken;
    /**
     * A list of objects containing information about custom language models.
     */
    Models?: Models;
  }
  export interface ListMedicalTranscriptionJobsRequest {
    /**
     * When specified, returns only medical transcription jobs with the specified status. Jobs are ordered by creation date, with the newest jobs returned first. If you don't specify a status, Amazon Transcribe Medical returns all transcription jobs ordered by creation date.
     */
    Status?: TranscriptionJobStatus;
    /**
     * When specified, the jobs returned in the list are limited to jobs whose name contains the specified string.
     */
    JobNameContains?: TranscriptionJobName;
    /**
     * If you a receive a truncated result in the previous request of ListMedicalTranscriptionJobs, include NextToken to fetch the next set of jobs.
     */
    NextToken?: NextToken;
    /**
     *  The maximum number of medical transcription jobs to return in each page of results. If there are fewer results than the value you specify, only the actual results are returned. If you do not specify a value, the default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListMedicalTranscriptionJobsResponse {
    /**
     * The requested status of the medical transcription jobs returned.
     */
    Status?: TranscriptionJobStatus;
    /**
     * The ListMedicalTranscriptionJobs operation returns a page of jobs at a time. The maximum size of the page is set by the MaxResults parameter. If the number of jobs exceeds what can fit on a page, Amazon Transcribe Medical returns the NextPage token. Include the token in the next request to the ListMedicalTranscriptionJobs operation to return in the next page of jobs.
     */
    NextToken?: NextToken;
    /**
     * A list of objects containing summary information for a transcription job.
     */
    MedicalTranscriptionJobSummaries?: MedicalTranscriptionJobSummaries;
  }
  export interface ListMedicalVocabulariesRequest {
    /**
     * If the result of your previous request to ListMedicalVocabularies was truncated, include the NextToken to fetch the next set of vocabularies.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of vocabularies to return in each page of results. If there are fewer results than the value you specify, only the actual results are returned. If you do not specify a value, the default of 5 is used.
     */
    MaxResults?: MaxResults;
    /**
     * When specified, returns only vocabularies with the VocabularyState equal to the specified vocabulary state. Use this field to see which vocabularies are ready for your medical transcription jobs.
     */
    StateEquals?: VocabularyState;
    /**
     * Returns vocabularies whose names contain the specified string. The search is not case sensitive. ListMedicalVocabularies returns both "vocabularyname" and "VocabularyName".
     */
    NameContains?: VocabularyName;
  }
  export interface ListMedicalVocabulariesResponse {
    /**
     * The requested vocabulary state.
     */
    Status?: VocabularyState;
    /**
     * The ListMedicalVocabularies operation returns a page of vocabularies at a time. You set the maximum number of vocabularies to return on a page with the MaxResults parameter. If there are more jobs in the list will fit on a page, Amazon Transcribe Medical returns the NextPage token. To return the next page of vocabularies, include the token in the next request to the ListMedicalVocabularies operation .
     */
    NextToken?: NextToken;
    /**
     * A list of objects that describe the vocabularies that match your search criteria.
     */
    Vocabularies?: Vocabularies;
  }
  export interface ListTagsForResourceRequest {
    /**
     * Lists all tags associated with a given Amazon Resource Name (ARN).
     */
    ResourceArn: TranscribeArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Lists all tags associated with the given Amazon Resource Name (ARN).
     */
    ResourceArn?: TranscribeArn;
    /**
     * Lists all tags associated with the given transcription job, vocabulary, or resource.
     */
    Tags?: TagList;
  }
  export interface ListTranscriptionJobsRequest {
    /**
     * When specified, returns only transcription jobs with the specified status. Jobs are ordered by creation date, with the newest jobs returned first. If you don’t specify a status, Amazon Transcribe returns all transcription jobs ordered by creation date.
     */
    Status?: TranscriptionJobStatus;
    /**
     * When specified, the jobs returned in the list are limited to jobs whose name contains the specified string.
     */
    JobNameContains?: TranscriptionJobName;
    /**
     * If the result of the previous request to ListTranscriptionJobs is truncated, include the NextToken to fetch the next set of jobs.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of jobs to return in each page of results. If there are fewer results than the value you specify, only the actual results are returned. If you do not specify a value, the default of 5 is used.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTranscriptionJobsResponse {
    /**
     * The requested status of the jobs returned.
     */
    Status?: TranscriptionJobStatus;
    /**
     * The ListTranscriptionJobs operation returns a page of jobs at a time. The maximum size of the page is set by the MaxResults parameter. If there are more jobs in the list than the page size, Amazon Transcribe returns the NextPage token. Include the token in the next request to the ListTranscriptionJobs operation to return in the next page of jobs.
     */
    NextToken?: NextToken;
    /**
     * A list of objects containing summary information for a transcription job.
     */
    TranscriptionJobSummaries?: TranscriptionJobSummaries;
  }
  export interface ListVocabulariesRequest {
    /**
     * If the result of the previous request to ListVocabularies was truncated, include the NextToken to fetch the next set of jobs.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of vocabularies to return in each page of results. If there are fewer results than the value you specify, only the actual results are returned. If you do not specify a value, the default of 5 is used.
     */
    MaxResults?: MaxResults;
    /**
     * When specified, only returns vocabularies with the VocabularyState field equal to the specified state.
     */
    StateEquals?: VocabularyState;
    /**
     * When specified, the vocabularies returned in the list are limited to vocabularies whose name contains the specified string. The search is not case sensitive, ListVocabularies returns both "vocabularyname" and "VocabularyName" in the response list.
     */
    NameContains?: VocabularyName;
  }
  export interface ListVocabulariesResponse {
    /**
     * The requested vocabulary state.
     */
    Status?: VocabularyState;
    /**
     * The ListVocabularies operation returns a page of vocabularies at a time. The maximum size of the page is set in the MaxResults parameter. If there are more jobs in the list than will fit on the page, Amazon Transcribe returns the NextPage token. To return in the next page of jobs, include the token in the next request to the ListVocabularies operation.
     */
    NextToken?: NextToken;
    /**
     * A list of objects that describe the vocabularies that match the search criteria in the request.
     */
    Vocabularies?: Vocabularies;
  }
  export interface ListVocabularyFiltersRequest {
    /**
     * If the result of the previous request to ListVocabularyFilters was truncated, include the NextToken to fetch the next set of collections.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of filters to return in each page of results. If there are fewer results than the value you specify, only the actual results are returned. If you do not specify a value, the default of 5 is used.
     */
    MaxResults?: MaxResults;
    /**
     * Filters the response so that it only contains vocabulary filters whose name contains the specified string.
     */
    NameContains?: VocabularyFilterName;
  }
  export interface ListVocabularyFiltersResponse {
    /**
     * The ListVocabularyFilters operation returns a page of collections at a time. The maximum size of the page is set by the MaxResults parameter. If there are more jobs in the list than the page size, Amazon Transcribe returns the NextPage token. Include the token in the next request to the ListVocabularyFilters operation to return in the next page of jobs.
     */
    NextToken?: NextToken;
    /**
     * The list of vocabulary filters. It contains at most MaxResults number of filters. If there are more filters, call the ListVocabularyFilters operation again with the NextToken parameter in the request set to the value of the NextToken field in the response.
     */
    VocabularyFilters?: VocabularyFilters;
  }
  export type MaxAlternatives = number;
  export type MaxResults = number;
  export type MaxSpeakers = number;
  export interface Media {
    /**
     * The S3 object location of the input media file. The URI must be in the same region as the API endpoint that you are calling. The general form is: For example: For more information about S3 object names, see Object Keys in the Amazon S3 Developer Guide.
     */
    MediaFileUri?: Uri;
    /**
     *  The S3 object location for your redacted output media file. This is only supported for call analytics jobs.
     */
    RedactedMediaFileUri?: Uri;
  }
  export type MediaFormat = "mp3"|"mp4"|"wav"|"flac"|"ogg"|"amr"|"webm"|string;
  export type MediaSampleRateHertz = number;
  export type MedicalContentIdentificationType = "PHI"|string;
  export interface MedicalTranscript {
    /**
     * The S3 object location of the medical transcript. Use this URI to access the medical transcript. This URI points to the S3 bucket you created to store the medical transcript.
     */
    TranscriptFileUri?: Uri;
  }
  export interface MedicalTranscriptionJob {
    /**
     * The name for a given medical transcription job.
     */
    MedicalTranscriptionJobName?: TranscriptionJobName;
    /**
     * The completion status of a medical transcription job.
     */
    TranscriptionJobStatus?: TranscriptionJobStatus;
    /**
     * The language code for the language spoken in the source audio file. US English (en-US) is the only supported language for medical transcriptions. Any other value you enter for language code results in a BadRequestException error.
     */
    LanguageCode?: LanguageCode;
    /**
     * The sample rate, in Hertz, of the source audio containing medical information. If you don't specify the sample rate, Amazon Transcribe Medical determines it for you. If you choose to specify the sample rate, it must match the rate detected by Amazon Transcribe Medical. In most cases, you should leave the MedicalMediaSampleHertz blank and let Amazon Transcribe Medical determine the sample rate.
     */
    MediaSampleRateHertz?: MediaSampleRateHertz;
    /**
     * The format of the input media file.
     */
    MediaFormat?: MediaFormat;
    Media?: Media;
    /**
     * An object that contains the MedicalTranscript. The MedicalTranscript contains the TranscriptFileUri.
     */
    Transcript?: MedicalTranscript;
    /**
     * A timestamp that shows when the job started processing.
     */
    StartTime?: DateTime;
    /**
     * A timestamp that shows when the job was created.
     */
    CreationTime?: DateTime;
    /**
     * A timestamp that shows when the job was completed.
     */
    CompletionTime?: DateTime;
    /**
     * If the TranscriptionJobStatus field is FAILED, this field contains information about why the job failed. The FailureReason field contains one of the following values:    Unsupported media format- The media format specified in the MediaFormat field of the request isn't valid. See the description of the MediaFormat field for a list of valid values.    The media format provided does not match the detected media format- The media format of the audio file doesn't match the format specified in the MediaFormat field in the request. Check the media format of your media file and make sure the two values match.    Invalid sample rate for audio file- The sample rate specified in the MediaSampleRateHertz of the request isn't valid. The sample rate must be between 8,000 and 48,000 Hertz.    The sample rate provided does not match the detected sample rate- The sample rate in the audio file doesn't match the sample rate specified in the MediaSampleRateHertz field in the request. Check the sample rate of your media file and make sure that the two values match.    Invalid file size: file size too large- The size of your audio file is larger than what Amazon Transcribe Medical can process. For more information, see Guidelines and Quotas in the Amazon Transcribe Medical Guide     Invalid number of channels: number of channels too large- Your audio contains more channels than Amazon Transcribe Medical is configured to process. To request additional channels, see Amazon Transcribe Medical Endpoints and Quotas in the Amazon Web Services General Reference   
     */
    FailureReason?: FailureReason;
    /**
     * Object that contains object.
     */
    Settings?: MedicalTranscriptionSetting;
    /**
     * Shows the type of content that you've configured Amazon Transcribe Medical to identify in a transcription job. If the value is PHI, you've configured the job to identify personal health information (PHI) in the transcription output.
     */
    ContentIdentificationType?: MedicalContentIdentificationType;
    /**
     * The medical specialty of any clinicians providing a dictation or having a conversation. Refer to Transcribing a medical conversationfor a list of supported specialties.
     */
    Specialty?: Specialty;
    /**
     * The type of speech in the transcription job. CONVERSATION is generally used for patient-physician dialogues. DICTATION is the setting for physicians speaking their notes after seeing a patient. For more information, see What is Amazon Transcribe Medical?.
     */
    Type?: Type;
    /**
     * A key:value pair assigned to a given medical transcription job.
     */
    Tags?: TagList;
  }
  export type MedicalTranscriptionJobSummaries = MedicalTranscriptionJobSummary[];
  export interface MedicalTranscriptionJobSummary {
    /**
     * The name of a medical transcription job.
     */
    MedicalTranscriptionJobName?: TranscriptionJobName;
    /**
     * A timestamp that shows when the medical transcription job was created.
     */
    CreationTime?: DateTime;
    /**
     * A timestamp that shows when the job began processing.
     */
    StartTime?: DateTime;
    /**
     * A timestamp that shows when the job was completed.
     */
    CompletionTime?: DateTime;
    /**
     * The language of the transcript in the source audio file.
     */
    LanguageCode?: LanguageCode;
    /**
     * The status of the medical transcription job.
     */
    TranscriptionJobStatus?: TranscriptionJobStatus;
    /**
     * If the TranscriptionJobStatus field is FAILED, a description of the error.
     */
    FailureReason?: FailureReason;
    /**
     * Indicates the location of the transcription job's output. This field must be the path of an S3 bucket; if you don't already have an S3 bucket, one is created based on the path you add.
     */
    OutputLocationType?: OutputLocationType;
    /**
     * The medical specialty of the transcription job. Refer to Transcribing a medical conversationfor a list of supported specialties.
     */
    Specialty?: Specialty;
    /**
     * Shows the type of information you've configured Amazon Transcribe Medical to identify in a transcription job. If the value is PHI, you've configured the transcription job to identify personal health information (PHI).
     */
    ContentIdentificationType?: MedicalContentIdentificationType;
    /**
     * The speech of the clinician in the input audio.
     */
    Type?: Type;
  }
  export interface MedicalTranscriptionSetting {
    /**
     * Determines whether the transcription job uses speaker recognition to identify different speakers in the input audio. Speaker recognition labels individual speakers in the audio file. If you set the ShowSpeakerLabels field to true, you must also set the maximum number of speaker labels in the MaxSpeakerLabels field. You can't set both ShowSpeakerLabels and ChannelIdentification in the same request. If you set both, your request returns a BadRequestException.
     */
    ShowSpeakerLabels?: Boolean;
    /**
     * The maximum number of speakers to identify in the input audio. If there are more speakers in the audio than this number, multiple speakers are identified as a single speaker. If you specify the MaxSpeakerLabels field, you must set the ShowSpeakerLabels field to true.
     */
    MaxSpeakerLabels?: MaxSpeakers;
    /**
     * Instructs Amazon Transcribe Medical to process each audio channel separately and then merge the transcription output of each channel into a single transcription. Amazon Transcribe Medical also produces a transcription of each item detected on an audio channel, including the start time and end time of the item and alternative transcriptions of item. The alternative transcriptions also come with confidence scores provided by Amazon Transcribe Medical. You can't set both ShowSpeakerLabels and ChannelIdentification in the same request. If you set both, your request returns a BadRequestException 
     */
    ChannelIdentification?: Boolean;
    /**
     * Determines whether alternative transcripts are generated along with the transcript that has the highest confidence. If you set ShowAlternatives field to true, you must also set the maximum number of alternatives to return in the MaxAlternatives field.
     */
    ShowAlternatives?: Boolean;
    /**
     * The maximum number of alternatives that you tell the service to return. If you specify the MaxAlternatives field, you must set the ShowAlternatives field to true.
     */
    MaxAlternatives?: MaxAlternatives;
    /**
     * The name of the vocabulary to use when processing a medical transcription job.
     */
    VocabularyName?: VocabularyName;
  }
  export type ModelName = string;
  export interface ModelSettings {
    /**
     * The name of your custom language model.
     */
    LanguageModelName?: ModelName;
  }
  export type ModelStatus = "IN_PROGRESS"|"FAILED"|"COMPLETED"|string;
  export type Models = LanguageModel[];
  export type NextToken = string;
  export type NonEmptyString = string;
  export interface NonTalkTimeFilter {
    /**
     * The duration of the period when neither the customer nor agent was talking.
     */
    Threshold?: TimestampMilliseconds;
    /**
     * An object you can use to specify a time range (in milliseconds) for when no one is talking. For example, you could specify a time period between the 30,000 millisecond mark and the 45,000 millisecond mark. You could also specify the time period as the first 15,000 milliseconds or the last 15,000 milliseconds.
     */
    AbsoluteTimeRange?: AbsoluteTimeRange;
    /**
     * An object that allows percentages to specify the proportion of the call where there was silence. For example, you can specify the first half of the call. You can also specify the period of time between halfway through to three-quarters of the way through the call. Because the length of conversation can vary between calls, you can apply relative time ranges across all calls.
     */
    RelativeTimeRange?: RelativeTimeRange;
    /**
     * Set to TRUE to look for a time period when people were talking.
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
  export type RedactionOutput = "redacted"|"redacted_and_unredacted"|string;
  export type RedactionType = "PII"|string;
  export interface RelativeTimeRange {
    /**
     * A value that indicates the percentage of the beginning of the time range. To set a relative time range, you must specify a start percentage and an end percentage. For example, if you specify the following values:   StartPercentage - 10   EndPercentage - 50   This looks at the time range starting from 10% of the way into the call to 50% of the way through the call. For a call that lasts 100,000 milliseconds, this example range would apply from the 10,000 millisecond mark to the 50,000 millisecond mark.
     */
    StartPercentage?: Percentage;
    /**
     * A value that indicates the percentage of the end of the time range. To set a relative time range, you must specify a start percentage and an end percentage. For example, if you specify the following values:   StartPercentage - 10   EndPercentage - 50   This looks at the time range starting from 10% of the way into the call to 50% of the way through the call. For a call that lasts 100,000 milliseconds, this example range would apply from the 10,000 millisecond mark to the 50,000 millisecond mark.
     */
    EndPercentage?: Percentage;
    /**
     * A range that takes the portion of the call up to the time in milliseconds set by the value that you've specified. For example, if you specify 120000, the time range is set for the first 120,000 milliseconds of the call.
     */
    First?: Percentage;
    /**
     * A range that takes the portion of the call from the time in milliseconds set by the value that you've specified to the end of the call. For example, if you specify 120000, the time range is set for the last 120,000 milliseconds of the call.
     */
    Last?: Percentage;
  }
  export interface Rule {
    /**
     * A condition for a time period when neither the customer nor the agent was talking.
     */
    NonTalkTimeFilter?: NonTalkTimeFilter;
    /**
     * A condition for a time period when either the customer or agent was interrupting the other person. 
     */
    InterruptionFilter?: InterruptionFilter;
    /**
     * A condition that catches particular words or phrases based on a exact match. For example, if you set the phrase "I want to speak to the manager", only that exact phrase will be returned.
     */
    TranscriptFilter?: TranscriptFilter;
    /**
     * A condition that is applied to a particular customer sentiment.
     */
    SentimentFilter?: SentimentFilter;
  }
  export type RuleList = Rule[];
  export interface SentimentFilter {
    /**
     * An array that enables you to specify sentiments for the customer or agent. You can specify one or more values.
     */
    Sentiments: SentimentValueList;
    /**
     * The time range, measured in seconds, of the sentiment.
     */
    AbsoluteTimeRange?: AbsoluteTimeRange;
    /**
     * The time range, set in percentages, that correspond to proportion of the call.
     */
    RelativeTimeRange?: RelativeTimeRange;
    /**
     * A value that determines whether the sentiment belongs to the customer or the agent.
     */
    ParticipantRole?: ParticipantRole;
    /**
     * Set to TRUE to look for sentiments that weren't specified in the request. 
     */
    Negate?: Boolean;
  }
  export type SentimentValue = "POSITIVE"|"NEGATIVE"|"NEUTRAL"|"MIXED"|string;
  export type SentimentValueList = SentimentValue[];
  export interface Settings {
    /**
     * The name of a vocabulary to use when processing the transcription job.
     */
    VocabularyName?: VocabularyName;
    /**
     * Determines whether the transcription job uses speaker recognition to identify different speakers in the input audio. Speaker recognition labels individual speakers in the audio file. If you set the ShowSpeakerLabels field to true, you must also set the maximum number of speaker labels MaxSpeakerLabels field. You can't set both ShowSpeakerLabels and ChannelIdentification in the same request. If you set both, your request returns a BadRequestException.
     */
    ShowSpeakerLabels?: Boolean;
    /**
     * The maximum number of speakers to identify in the input audio. If there are more speakers in the audio than this number, multiple speakers are identified as a single speaker. If you specify the MaxSpeakerLabels field, you must set the ShowSpeakerLabels field to true.
     */
    MaxSpeakerLabels?: MaxSpeakers;
    /**
     * Instructs Amazon Transcribe to process each audio channel separately and then merge the transcription output of each channel into a single transcription.  Amazon Transcribe also produces a transcription of each item detected on an audio channel, including the start time and end time of the item and alternative transcriptions of the item including the confidence that Amazon Transcribe has in the transcription. You can't set both ShowSpeakerLabels and ChannelIdentification in the same request. If you set both, your request returns a BadRequestException.
     */
    ChannelIdentification?: Boolean;
    /**
     * Determines whether the transcription contains alternative transcriptions. If you set the ShowAlternatives field to true, you must also set the maximum number of alternatives to return in the MaxAlternatives field.
     */
    ShowAlternatives?: Boolean;
    /**
     * The number of alternative transcriptions that the service should return. If you specify the MaxAlternatives field, you must set the ShowAlternatives field to true.
     */
    MaxAlternatives?: MaxAlternatives;
    /**
     * The name of the vocabulary filter to use when transcribing the audio. The filter that you specify must have the same language code as the transcription job.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * Set to mask to remove filtered text from the transcript and replace it with three asterisks ("***") as placeholder text. Set to remove to remove filtered text from the transcript without using placeholder text. Set to tag to mark the word in the transcription output that matches the vocabulary filter. When you set the filter method to tag, the words matching your vocabulary filter are not masked or removed.
     */
    VocabularyFilterMethod?: VocabularyFilterMethod;
  }
  export type Specialty = "PRIMARYCARE"|string;
  export interface StartCallAnalyticsJobRequest {
    /**
     * The name of the call analytics job. You can't use the string "." or ".." by themselves as the job name. The name must also be unique within an Amazon Web Services account. If you try to create a call analytics job with the same name as a previous call analytics job, you get a ConflictException error.
     */
    CallAnalyticsJobName: CallAnalyticsJobName;
    Media: Media;
    /**
     * The Amazon S3 location where the output of the call analytics job is stored. You can provide the following location types to store the output of call analytics job:   s3://DOC-EXAMPLE-BUCKET1  If you specify a bucket, Amazon Transcribe saves the output of the analytics job as a JSON file at the root level of the bucket.   s3://DOC-EXAMPLE-BUCKET1/folder/ f you specify a path, Amazon Transcribe saves the output of the analytics job as s3://DOC-EXAMPLE-BUCKET1/folder/your-transcription-job-name.json If you specify a folder, you must provide a trailing slash.   s3://DOC-EXAMPLE-BUCKET1/folder/filename.json  If you provide a path that has the filename specified, Amazon Transcribe saves the output of the analytics job as s3://DOC-EXAMPLEBUCKET1/folder/filename.json   You can specify an Amazon Web Services Key Management Service (KMS) key to encrypt the output of our analytics job using the OutputEncryptionKMSKeyId parameter. If you don't specify a KMS key, Amazon Transcribe uses the default Amazon S3 key for server-side encryption of the analytics job output that is placed in your S3 bucket.
     */
    OutputLocation?: Uri;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Key Management Service key used to encrypt the output of the call analytics job. The user calling the operation must have permission to use the specified KMS key. You use either of the following to identify an Amazon Web Services KMS key in the current account:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"   KMS Key Alias: "alias/ExampleAlias"    You can use either of the following to identify a KMS key in the current account or another account:   Amazon Resource Name (ARN) of a KMS key in the current account or another account: "arn:aws:kms:region:account ID:key/1234abcd-12ab-34cd-56ef1234567890ab"   ARN of a KMS Key Alias: "arn:aws:kms:region:account ID:alias/ExampleAlias"   If you don't specify an encryption key, the output of the call analytics job is encrypted with the default Amazon S3 key (SSE-S3). If you specify a KMS key to encrypt your output, you must also specify an output location in the OutputLocation parameter. 
     */
    OutputEncryptionKMSKeyId?: KMSKeyId;
    /**
     * The Amazon Resource Name (ARN) of a role that has access to the S3 bucket that contains your input files. Amazon Transcribe assumes this role to read queued audio files. If you have specified an output S3 bucket for your transcription results, this role should have access to the output bucket as well.
     */
    DataAccessRoleArn: DataAccessRoleArn;
    /**
     * A Settings object that provides optional settings for a call analytics job. 
     */
    Settings?: CallAnalyticsJobSettings;
    /**
     * When you start a call analytics job, you must pass an array that maps the agent and the customer to specific audio channels. The values you can assign to a channel are 0 and 1. The agent and the customer must each have their own channel. You can't assign more than one channel to an agent or customer. 
     */
    ChannelDefinitions?: ChannelDefinitions;
  }
  export interface StartCallAnalyticsJobResponse {
    /**
     * An object containing the details of the asynchronous call analytics job.
     */
    CallAnalyticsJob?: CallAnalyticsJob;
  }
  export interface StartMedicalTranscriptionJobRequest {
    /**
     * The name of the medical transcription job. You can't use the strings "." or ".." by themselves as the job name. The name must also be unique within an Amazon Web Services account. If you try to create a medical transcription job with the same name as a previous medical transcription job, you get a ConflictException error.
     */
    MedicalTranscriptionJobName: TranscriptionJobName;
    /**
     * The language code for the language spoken in the input media file. US English (en-US) is the valid value for medical transcription jobs. Any other value you enter for language code results in a BadRequestException error.
     */
    LanguageCode: LanguageCode;
    /**
     * The sample rate, in Hertz, of the audio track in the input media file. If you do not specify the media sample rate, Amazon Transcribe Medical determines the sample rate. If you specify the sample rate, it must match the rate detected by Amazon Transcribe Medical. In most cases, you should leave the MediaSampleRateHertz field blank and let Amazon Transcribe Medical determine the sample rate.
     */
    MediaSampleRateHertz?: MediaSampleRateHertz;
    /**
     * The audio format of the input media file.
     */
    MediaFormat?: MediaFormat;
    Media: Media;
    /**
     * The Amazon S3 location where the transcription is stored. You must set OutputBucketName for Amazon Transcribe Medical to store the transcription results. Your transcript appears in the S3 location you specify. When you call the GetMedicalTranscriptionJob, the operation returns this location in the TranscriptFileUri field. The S3 bucket must have permissions that allow Amazon Transcribe Medical to put files in the bucket. For more information, see Permissions Required for IAM User Roles. You can specify an Amazon Web Services Key Management Service (KMS) key to encrypt the output of your transcription using the OutputEncryptionKMSKeyId parameter. If you don't specify a KMS key, Amazon Transcribe Medical uses the default Amazon S3 key for server-side encryption of transcripts that are placed in your S3 bucket.
     */
    OutputBucketName: OutputBucketName;
    /**
     * You can specify a location in an Amazon S3 bucket to store the output of your medical transcription job. If you don't specify an output key, Amazon Transcribe Medical stores the output of your transcription job in the Amazon S3 bucket you specified. By default, the object key is "your-transcription-job-name.json". You can use output keys to specify the Amazon S3 prefix and file name of the transcription output. For example, specifying the Amazon S3 prefix, "folder1/folder2/", as an output key would lead to the output being stored as "folder1/folder2/your-transcription-job-name.json". If you specify "my-other-job-name.json" as the output key, the object key is changed to "my-other-job-name.json". You can use an output key to change both the prefix and the file name, for example "folder/my-other-job-name.json". If you specify an output key, you must also specify an S3 bucket in the OutputBucketName parameter.
     */
    OutputKey?: OutputKey;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Key Management Service (KMS) key used to encrypt the output of the transcription job. The user calling the StartMedicalTranscriptionJob operation must have permission to use the specified KMS key. You use either of the following to identify a KMS key in the current account:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"   KMS Key Alias: "alias/ExampleAlias"   You can use either of the following to identify a KMS key in the current account or another account:   Amazon Resource Name (ARN) of a KMS key in the current account or another account: "arn:aws:kms:region:account ID:key/1234abcd-12ab-34cd-56ef-1234567890ab"   ARN of a KMS Key Alias: "arn:aws:kms:region:account ID:alias/ExampleAlias"   If you don't specify an encryption key, the output of the medical transcription job is encrypted with the default Amazon S3 key (SSE-S3). If you specify a KMS key to encrypt your output, you must also specify an output location in the OutputBucketName parameter.
     */
    OutputEncryptionKMSKeyId?: KMSKeyId;
    /**
     * A map of plain text, non-secret key:value pairs, known as encryption context pairs, that provide an added layer of security for your data.
     */
    KMSEncryptionContext?: KMSEncryptionContextMap;
    /**
     * Optional settings for the medical transcription job.
     */
    Settings?: MedicalTranscriptionSetting;
    /**
     * You can configure Amazon Transcribe Medical to label content in the transcription output. If you specify PHI, Amazon Transcribe Medical labels the personal health information (PHI) that it identifies in the transcription output.
     */
    ContentIdentificationType?: MedicalContentIdentificationType;
    /**
     * The medical specialty of any clinician speaking in the input media.
     */
    Specialty: Specialty;
    /**
     * The type of speech in the input audio. CONVERSATION refers to conversations between two or more speakers, e.g., a conversations between doctors and patients. DICTATION refers to single-speaker dictated speech, such as clinical notes.
     */
    Type: Type;
    /**
     * Add tags to an Amazon Transcribe medical transcription job.
     */
    Tags?: TagList;
  }
  export interface StartMedicalTranscriptionJobResponse {
    /**
     * A batch job submitted to transcribe medical speech to text.
     */
    MedicalTranscriptionJob?: MedicalTranscriptionJob;
  }
  export interface StartTranscriptionJobRequest {
    /**
     * The name of the job. You can't use the strings "." or ".." by themselves as the job name. The name must also be unique within an Amazon Web Services account. If you try to create a transcription job with the same name as a previous transcription job, you get a ConflictException error.
     */
    TranscriptionJobName: TranscriptionJobName;
    /**
     * The language code for the language used in the input media file. To transcribe speech in Modern Standard Arabic (ar-SA), your audio or video file must be encoded at a sample rate of 16,000 Hz or higher.
     */
    LanguageCode?: LanguageCode;
    /**
     * The sample rate, in Hertz, of the audio track in the input media file.  If you do not specify the media sample rate, Amazon Transcribe determines the sample rate. If you specify the sample rate, it must match the sample rate detected by Amazon Transcribe. In most cases, you should leave the MediaSampleRateHertz field blank and let Amazon Transcribe determine the sample rate.
     */
    MediaSampleRateHertz?: MediaSampleRateHertz;
    /**
     * The format of the input media file.
     */
    MediaFormat?: MediaFormat;
    /**
     * An object that describes the input media for a transcription job.
     */
    Media: Media;
    /**
     * The location where the transcription is stored. If you set the OutputBucketName, Amazon Transcribe puts the transcript in the specified S3 bucket. When you call the GetTranscriptionJob operation, the operation returns this location in the TranscriptFileUri field. If you enable content redaction, the redacted transcript appears in RedactedTranscriptFileUri. If you enable content redaction and choose to output an unredacted transcript, that transcript's location still appears in the TranscriptFileUri. The S3 bucket must have permissions that allow Amazon Transcribe to put files in the bucket. For more information, see Permissions Required for IAM User Roles. You can specify an Amazon Web Services Key Management Service (KMS) key to encrypt the output of your transcription using the OutputEncryptionKMSKeyId parameter. If you don't specify a KMS key, Amazon Transcribe uses the default Amazon S3 key for server-side encryption of transcripts that are placed in your S3 bucket. If you don't set the OutputBucketName, Amazon Transcribe generates a pre-signed URL, a shareable URL that provides secure access to your transcription, and returns it in the TranscriptFileUri field. Use this URL to download the transcription.
     */
    OutputBucketName?: OutputBucketName;
    /**
     * You can specify a location in an Amazon S3 bucket to store the output of your transcription job. If you don't specify an output key, Amazon Transcribe stores the output of your transcription job in the Amazon S3 bucket you specified. By default, the object key is "your-transcription-job-name.json". You can use output keys to specify the Amazon S3 prefix and file name of the transcription output. For example, specifying the Amazon S3 prefix, "folder1/folder2/", as an output key would lead to the output being stored as "folder1/folder2/your-transcription-job-name.json". If you specify "my-other-job-name.json" as the output key, the object key is changed to "my-other-job-name.json". You can use an output key to change both the prefix and the file name, for example "folder/my-other-job-name.json". If you specify an output key, you must also specify an S3 bucket in the OutputBucketName parameter.
     */
    OutputKey?: OutputKey;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Key Management Service (KMS) key used to encrypt the output of the transcription job. The user calling the StartTranscriptionJob operation must have permission to use the specified KMS key. You can use either of the following to identify a KMS key in the current account:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"   KMS Key Alias: "alias/ExampleAlias"   You can use either of the following to identify a KMS key in the current account or another account:   Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:region:account ID:key/1234abcd-12ab-34cd-56ef-1234567890ab"   ARN of a KMS Key Alias: "arn:aws:kms:region:account ID:alias/ExampleAlias"   If you don't specify an encryption key, the output of the transcription job is encrypted with the default Amazon S3 key (SSE-S3). If you specify a KMS key to encrypt your output, you must also specify an output location in the OutputBucketName parameter.
     */
    OutputEncryptionKMSKeyId?: KMSKeyId;
    /**
     * A map of plain text, non-secret key:value pairs, known as encryption context pairs, that provide an added layer of security for your data.
     */
    KMSEncryptionContext?: KMSEncryptionContextMap;
    /**
     * A Settings object that provides optional settings for a transcription job.
     */
    Settings?: Settings;
    /**
     * Choose the custom language model you use for your transcription job in this parameter.
     */
    ModelSettings?: ModelSettings;
    /**
     * Provides information about how a transcription job is executed. Use this field to indicate that the job can be queued for deferred execution if the concurrency limit is reached and there are no slots available to immediately run the job.
     */
    JobExecutionSettings?: JobExecutionSettings;
    /**
     * An object that contains the request parameters for content redaction.
     */
    ContentRedaction?: ContentRedaction;
    /**
     * Set this field to true to enable automatic language identification. Automatic language identification is disabled by default. You receive a BadRequestException error if you enter a value for a LanguageCode.
     */
    IdentifyLanguage?: Boolean;
    /**
     * An object containing a list of languages that might be present in your collection of audio files. Automatic language identification chooses a language that best matches the source audio from that list. To transcribe speech in Modern Standard Arabic (ar-SA), your audio or video file must be encoded at a sample rate of 16,000 Hz or higher.
     */
    LanguageOptions?: LanguageOptions;
    /**
     * Add subtitles to your batch transcription job.
     */
    Subtitles?: Subtitles;
    /**
     * Add tags to an Amazon Transcribe transcription job.
     */
    Tags?: TagList;
  }
  export interface StartTranscriptionJobResponse {
    /**
     * An object containing details of the asynchronous transcription job.
     */
    TranscriptionJob?: TranscriptionJob;
  }
  export type StringTargetList = NonEmptyString[];
  export type SubtitleFileUris = Uri[];
  export type SubtitleFormat = "vtt"|"srt"|string;
  export type SubtitleFormats = SubtitleFormat[];
  export interface Subtitles {
    /**
     * Specify the output format for your subtitle file.
     */
    Formats?: SubtitleFormats;
  }
  export interface SubtitlesOutput {
    /**
     * Specify the output format for your subtitle file; if you select both SRT and VTT formats, two output files are genereated.
     */
    Formats?: SubtitleFormats;
    /**
     * Choose the output location for your subtitle file. This location must be an S3 bucket.
     */
    SubtitleFileUris?: SubtitleFileUris;
  }
  export interface Tag {
    /**
     * The first part of a key:value pair that forms a tag associated with a given resource. For example, in the tag ‘Department’:’Sales’, the key is 'Department'.
     */
    Key: TagKey;
    /**
     * The second part of a key:value pair that forms a tag associated with a given resource. For example, in the tag ‘Department’:’Sales’, the value is 'Sales'.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Transcribe resource you want to tag.
     */
    ResourceArn: TranscribeArn;
    /**
     * The tags you are assigning to a given Amazon Transcribe resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TimestampMilliseconds = number;
  export type TranscribeArn = string;
  export interface Transcript {
    /**
     * The S3 object location of the transcript. Use this URI to access the transcript. If you specified an S3 bucket in the OutputBucketName field when you created the job, this is the URI of that bucket. If you chose to store the transcript in Amazon Transcribe, this is a shareable URL that provides secure access to that location.
     */
    TranscriptFileUri?: Uri;
    /**
     * The S3 object location of the redacted transcript. Use this URI to access the redacted transcript. If you specified an S3 bucket in the OutputBucketName field when you created the job, this is the URI of that bucket. If you chose to store the transcript in Amazon Transcribe, this is a shareable URL that provides secure access to that location.
     */
    RedactedTranscriptFileUri?: Uri;
  }
  export interface TranscriptFilter {
    /**
     * Matches the phrase to the transcription output in a word for word fashion. For example, if you specify the phrase "I want to speak to the manager." Amazon Transcribe attempts to match that specific phrase to the transcription.
     */
    TranscriptFilterType: TranscriptFilterType;
    /**
     * A time range, set in seconds, between two points in the call.
     */
    AbsoluteTimeRange?: AbsoluteTimeRange;
    /**
     * An object that allows percentages to specify the proportion of the call where you would like to apply a filter. For example, you can specify the first half of the call. You can also specify the period of time between halfway through to three-quarters of the way through the call. Because the length of conversation can vary between calls, you can apply relative time ranges across all calls.
     */
    RelativeTimeRange?: RelativeTimeRange;
    /**
     * Determines whether the customer or the agent is speaking the phrases that you've specified.
     */
    ParticipantRole?: ParticipantRole;
    /**
     * If TRUE, the rule that you specify is applied to everything except for the phrases that you specify.
     */
    Negate?: Boolean;
    /**
     * The phrases that you're specifying for the transcript filter to match.
     */
    Targets: StringTargetList;
  }
  export type TranscriptFilterType = "EXACT"|string;
  export interface TranscriptionJob {
    /**
     * The name of the transcription job.
     */
    TranscriptionJobName?: TranscriptionJobName;
    /**
     * The status of the transcription job.
     */
    TranscriptionJobStatus?: TranscriptionJobStatus;
    /**
     * The language code for the input speech.
     */
    LanguageCode?: LanguageCode;
    /**
     * The sample rate, in Hertz, of the audio track in the input media file. 
     */
    MediaSampleRateHertz?: MediaSampleRateHertz;
    /**
     * The format of the input media file.
     */
    MediaFormat?: MediaFormat;
    /**
     * An object that describes the input media for the transcription job.
     */
    Media?: Media;
    /**
     * An object that describes the output of the transcription job.
     */
    Transcript?: Transcript;
    /**
     * A timestamp that shows when the job started processing.
     */
    StartTime?: DateTime;
    /**
     * A timestamp that shows when the job was created.
     */
    CreationTime?: DateTime;
    /**
     * A timestamp that shows when the job completed.
     */
    CompletionTime?: DateTime;
    /**
     * If the TranscriptionJobStatus field is FAILED, this field contains information about why the job failed. The FailureReason field can contain one of the following values:    Unsupported media format - The media format specified in the MediaFormat field of the request isn't valid. See the description of the MediaFormat field for a list of valid values.    The media format provided does not match the detected media format - The media format of the audio file doesn't match the format specified in the MediaFormat field in the request. Check the media format of your media file and make sure that the two values match.    Invalid sample rate for audio file - The sample rate specified in the MediaSampleRateHertz of the request isn't valid. The sample rate must be between 8,000 and 48,000 Hertz.    The sample rate provided does not match the detected sample rate - The sample rate in the audio file doesn't match the sample rate specified in the MediaSampleRateHertz field in the request. Check the sample rate of your media file and make sure that the two values match.    Invalid file size: file size too large - The size of your audio file is larger than Amazon Transcribe can process. For more information, see Limits in the Amazon Transcribe Developer Guide.    Invalid number of channels: number of channels too large - Your audio contains more channels than Amazon Transcribe is configured to process. To request additional channels, see Amazon Transcribe Limits in the Amazon Web Services General Reference.  
     */
    FailureReason?: FailureReason;
    /**
     * Optional settings for the transcription job. Use these settings to turn on speaker recognition, to set the maximum number of speakers that should be identified and to specify a custom vocabulary to use when processing the transcription job.
     */
    Settings?: Settings;
    /**
     * An object containing the details of your custom language model.
     */
    ModelSettings?: ModelSettings;
    /**
     * Provides information about how a transcription job is executed.
     */
    JobExecutionSettings?: JobExecutionSettings;
    /**
     * An object that describes content redaction settings for the transcription job.
     */
    ContentRedaction?: ContentRedaction;
    /**
     * A value that shows if automatic language identification was enabled for a transcription job.
     */
    IdentifyLanguage?: Boolean;
    /**
     * An object that shows the optional array of languages inputted for transcription jobs with automatic language identification enabled.
     */
    LanguageOptions?: LanguageOptions;
    /**
     * A value between zero and one that Amazon Transcribe assigned to the language that it identified in the source audio. Larger values indicate that Amazon Transcribe has higher confidence in the language it identified.
     */
    IdentifiedLanguageScore?: IdentifiedLanguageScore;
    /**
     * A key:value pair assigned to a given transcription job.
     */
    Tags?: TagList;
    /**
     * Generate subtitles for your batch transcription job.
     */
    Subtitles?: SubtitlesOutput;
  }
  export type TranscriptionJobName = string;
  export type TranscriptionJobStatus = "QUEUED"|"IN_PROGRESS"|"FAILED"|"COMPLETED"|string;
  export type TranscriptionJobSummaries = TranscriptionJobSummary[];
  export interface TranscriptionJobSummary {
    /**
     * The name of the transcription job.
     */
    TranscriptionJobName?: TranscriptionJobName;
    /**
     * A timestamp that shows when the job was created.
     */
    CreationTime?: DateTime;
    /**
     * A timestamp that shows when the job started processing.
     */
    StartTime?: DateTime;
    /**
     * A timestamp that shows when the job was completed.
     */
    CompletionTime?: DateTime;
    /**
     * The language code for the input speech.
     */
    LanguageCode?: LanguageCode;
    /**
     * The status of the transcription job. When the status is COMPLETED, use the GetTranscriptionJob operation to get the results of the transcription.
     */
    TranscriptionJobStatus?: TranscriptionJobStatus;
    /**
     * If the TranscriptionJobStatus field is FAILED, a description of the error.
     */
    FailureReason?: FailureReason;
    /**
     * Indicates the location of the output of the transcription job. If the value is CUSTOMER_BUCKET then the location is the S3 bucket specified in the outputBucketName field when the transcription job was started with the StartTranscriptionJob operation. If the value is SERVICE_BUCKET then the output is stored by Amazon Transcribe and can be retrieved using the URI in the GetTranscriptionJob response's TranscriptFileUri field.
     */
    OutputLocationType?: OutputLocationType;
    /**
     * The content redaction settings of the transcription job.
     */
    ContentRedaction?: ContentRedaction;
    ModelSettings?: ModelSettings;
    /**
     * Whether automatic language identification was enabled for a transcription job.
     */
    IdentifyLanguage?: Boolean;
    /**
     * A value between zero and one that Amazon Transcribe assigned to the language it identified in the source audio. A higher score indicates that Amazon Transcribe is more confident in the language it identified.
     */
    IdentifiedLanguageScore?: IdentifiedLanguageScore;
  }
  export type Type = "CONVERSATION"|"DICTATION"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Transcribe resource you want to remove tags from.
     */
    ResourceArn: TranscribeArn;
    /**
     * A list of tag keys you want to remove from a specified Amazon Transcribe resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateCallAnalyticsCategoryRequest {
    /**
     * The name of the analytics category to update. The name is case sensitive. If you try to update a call analytics category with the same name as a previous category you will receive a ConflictException error.
     */
    CategoryName: CategoryName;
    /**
     * The rules used for the updated analytics category. The rules that you provide in this field replace the ones that are currently being used. 
     */
    Rules: RuleList;
  }
  export interface UpdateCallAnalyticsCategoryResponse {
    /**
     * The attributes describing the analytics category. You can see information such as the rules that you've used to update the category and when the category was originally created. 
     */
    CategoryProperties?: CategoryProperties;
  }
  export interface UpdateMedicalVocabularyRequest {
    /**
     * The name of the vocabulary to update. The name is case sensitive. If you try to update a vocabulary with the same name as a vocabulary you've already made, you get a ConflictException error.
     */
    VocabularyName: VocabularyName;
    /**
     * The language code of the language used for the entries in the updated vocabulary. US English (en-US) is the only valid language code in Amazon Transcribe Medical.
     */
    LanguageCode: LanguageCode;
    /**
     * The location in Amazon S3 of the text file that contains your custom vocabulary. The URI must be in the same Amazon Web Services Region as the resource that you are calling. The following is the format for a URI:   https://s3.&lt;aws-region&gt;.amazonaws.com/&lt;bucket-name&gt;/&lt;keyprefix&gt;/&lt;objectkey&gt;   For example:  https://s3.us-east-1.amazonaws.com/AWSDOC-EXAMPLE-BUCKET/vocab.txt  For more information about Amazon S3 object names, see Object Keys in the Amazon S3 Developer Guide. For more information about custom vocabularies in Amazon Transcribe Medical, see Medical Custom Vocabularies.
     */
    VocabularyFileUri?: Uri;
  }
  export interface UpdateMedicalVocabularyResponse {
    /**
     * The name of the updated vocabulary.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code for the language of the text file used to update the custom vocabulary. US English (en-US) is the only language supported in Amazon Transcribe Medical.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time that the vocabulary was updated.
     */
    LastModifiedTime?: DateTime;
    /**
     * The processing state of the update to the vocabulary. When the VocabularyState field is READY, the vocabulary is ready to be used in a StartMedicalTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
  }
  export interface UpdateVocabularyFilterRequest {
    /**
     * The name of the vocabulary filter to update. If you try to update a vocabulary filter with the same name as another vocabulary filter, you get a ConflictException error.
     */
    VocabularyFilterName: VocabularyFilterName;
    /**
     * The words to use in the vocabulary filter. Only use characters from the character set defined for custom vocabularies. For a list of character sets, see Character Sets for Custom Vocabularies. If you provide a list of words in the Words parameter, you can't use the VocabularyFilterFileUri parameter.
     */
    Words?: Words;
    /**
     * The Amazon S3 location of a text file used as input to create the vocabulary filter. Only use characters from the character set defined for custom vocabularies. For a list of character sets, see Character Sets for Custom Vocabularies. The specified file must be less than 50 KB of UTF-8 characters. If you provide the location of a list of words in the VocabularyFilterFileUri parameter, you can't use the Words parameter.
     */
    VocabularyFilterFileUri?: Uri;
  }
  export interface UpdateVocabularyFilterResponse {
    /**
     * The name of the updated vocabulary filter.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The language code of the words in the vocabulary filter.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time that the vocabulary filter was updated.
     */
    LastModifiedTime?: DateTime;
  }
  export interface UpdateVocabularyRequest {
    /**
     * The name of the vocabulary to update. The name is case sensitive. If you try to update a vocabulary with the same name as a previous vocabulary you will receive a ConflictException error.
     */
    VocabularyName: VocabularyName;
    /**
     * The language code of the vocabulary entries. For a list of languages and their corresponding language codes, see transcribe-whatis.
     */
    LanguageCode: LanguageCode;
    /**
     * An array of strings containing the vocabulary entries.
     */
    Phrases?: Phrases;
    /**
     * The S3 location of the text file that contains the definition of the custom vocabulary. The URI must be in the same region as the API endpoint that you are calling. The general form is  For example: For more information about S3 object names, see Object Keys in the Amazon S3 Developer Guide. For more information about custom vocabularies, see Custom Vocabularies.
     */
    VocabularyFileUri?: Uri;
  }
  export interface UpdateVocabularyResponse {
    /**
     * The name of the vocabulary that was updated.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code of the vocabulary entries.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time that the vocabulary was updated.
     */
    LastModifiedTime?: DateTime;
    /**
     * The processing state of the vocabulary. When the VocabularyState field contains READY the vocabulary is ready to be used in a StartTranscriptionJob request.
     */
    VocabularyState?: VocabularyState;
  }
  export type Uri = string;
  export type Vocabularies = VocabularyInfo[];
  export interface VocabularyFilterInfo {
    /**
     * The name of the vocabulary filter. The name must be unique in the account that holds the filter.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The language code of the words in the vocabulary filter.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time that the vocabulary was last updated.
     */
    LastModifiedTime?: DateTime;
  }
  export type VocabularyFilterMethod = "remove"|"mask"|"tag"|string;
  export type VocabularyFilterName = string;
  export type VocabularyFilters = VocabularyFilterInfo[];
  export interface VocabularyInfo {
    /**
     * The name of the vocabulary.
     */
    VocabularyName?: VocabularyName;
    /**
     * The language code of the vocabulary entries.
     */
    LanguageCode?: LanguageCode;
    /**
     * The date and time that the vocabulary was last modified.
     */
    LastModifiedTime?: DateTime;
    /**
     * The processing state of the vocabulary. If the state is READY you can use the vocabulary in a StartTranscriptionJob request.
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
