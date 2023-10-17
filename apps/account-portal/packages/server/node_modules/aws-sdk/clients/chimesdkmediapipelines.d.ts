import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ChimeSDKMediaPipelines extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ChimeSDKMediaPipelines.Types.ClientConfiguration)
  config: Config & ChimeSDKMediaPipelines.Types.ClientConfiguration;
  /**
   * Creates a media pipeline.
   */
  createMediaCapturePipeline(params: ChimeSDKMediaPipelines.Types.CreateMediaCapturePipelineRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaCapturePipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaCapturePipelineResponse, AWSError>;
  /**
   * Creates a media pipeline.
   */
  createMediaCapturePipeline(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaCapturePipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaCapturePipelineResponse, AWSError>;
  /**
   * Creates a media concatenation pipeline.
   */
  createMediaConcatenationPipeline(params: ChimeSDKMediaPipelines.Types.CreateMediaConcatenationPipelineRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaConcatenationPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaConcatenationPipelineResponse, AWSError>;
  /**
   * Creates a media concatenation pipeline.
   */
  createMediaConcatenationPipeline(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaConcatenationPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaConcatenationPipelineResponse, AWSError>;
  /**
   * Creates a media insights pipeline.
   */
  createMediaInsightsPipeline(params: ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineResponse, AWSError>;
  /**
   * Creates a media insights pipeline.
   */
  createMediaInsightsPipeline(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineResponse, AWSError>;
  /**
   * A structure that contains the static configurations for a media insights pipeline.
   */
  createMediaInsightsPipelineConfiguration(params: ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineConfigurationResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineConfigurationResponse, AWSError>;
  /**
   * A structure that contains the static configurations for a media insights pipeline.
   */
  createMediaInsightsPipelineConfiguration(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineConfigurationResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaInsightsPipelineConfigurationResponse, AWSError>;
  /**
   * Creates a media live connector pipeline in an Amazon Chime SDK meeting.
   */
  createMediaLiveConnectorPipeline(params: ChimeSDKMediaPipelines.Types.CreateMediaLiveConnectorPipelineRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaLiveConnectorPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaLiveConnectorPipelineResponse, AWSError>;
  /**
   * Creates a media live connector pipeline in an Amazon Chime SDK meeting.
   */
  createMediaLiveConnectorPipeline(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaLiveConnectorPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaLiveConnectorPipelineResponse, AWSError>;
  /**
   * Creates an Kinesis video stream pool for the media pipeline.
   */
  createMediaPipelineKinesisVideoStreamPool(params: ChimeSDKMediaPipelines.Types.CreateMediaPipelineKinesisVideoStreamPoolRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaPipelineKinesisVideoStreamPoolResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaPipelineKinesisVideoStreamPoolResponse, AWSError>;
  /**
   * Creates an Kinesis video stream pool for the media pipeline.
   */
  createMediaPipelineKinesisVideoStreamPool(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaPipelineKinesisVideoStreamPoolResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaPipelineKinesisVideoStreamPoolResponse, AWSError>;
  /**
   * Creates a streaming media pipeline.
   */
  createMediaStreamPipeline(params: ChimeSDKMediaPipelines.Types.CreateMediaStreamPipelineRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaStreamPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaStreamPipelineResponse, AWSError>;
  /**
   * Creates a streaming media pipeline.
   */
  createMediaStreamPipeline(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.CreateMediaStreamPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.CreateMediaStreamPipelineResponse, AWSError>;
  /**
   * Deletes the media pipeline.
   */
  deleteMediaCapturePipeline(params: ChimeSDKMediaPipelines.Types.DeleteMediaCapturePipelineRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the media pipeline.
   */
  deleteMediaCapturePipeline(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified configuration settings.
   */
  deleteMediaInsightsPipelineConfiguration(params: ChimeSDKMediaPipelines.Types.DeleteMediaInsightsPipelineConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified configuration settings.
   */
  deleteMediaInsightsPipelineConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the media pipeline.
   */
  deleteMediaPipeline(params: ChimeSDKMediaPipelines.Types.DeleteMediaPipelineRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the media pipeline.
   */
  deleteMediaPipeline(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Kinesis video stream pool.
   */
  deleteMediaPipelineKinesisVideoStreamPool(params: ChimeSDKMediaPipelines.Types.DeleteMediaPipelineKinesisVideoStreamPoolRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Kinesis video stream pool.
   */
  deleteMediaPipelineKinesisVideoStreamPool(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets an existing media pipeline.
   */
  getMediaCapturePipeline(params: ChimeSDKMediaPipelines.Types.GetMediaCapturePipelineRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetMediaCapturePipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetMediaCapturePipelineResponse, AWSError>;
  /**
   * Gets an existing media pipeline.
   */
  getMediaCapturePipeline(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetMediaCapturePipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetMediaCapturePipelineResponse, AWSError>;
  /**
   * Gets the configuration settings for a media insights pipeline.
   */
  getMediaInsightsPipelineConfiguration(params: ChimeSDKMediaPipelines.Types.GetMediaInsightsPipelineConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetMediaInsightsPipelineConfigurationResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetMediaInsightsPipelineConfigurationResponse, AWSError>;
  /**
   * Gets the configuration settings for a media insights pipeline.
   */
  getMediaInsightsPipelineConfiguration(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetMediaInsightsPipelineConfigurationResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetMediaInsightsPipelineConfigurationResponse, AWSError>;
  /**
   * Gets an existing media pipeline.
   */
  getMediaPipeline(params: ChimeSDKMediaPipelines.Types.GetMediaPipelineRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetMediaPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetMediaPipelineResponse, AWSError>;
  /**
   * Gets an existing media pipeline.
   */
  getMediaPipeline(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetMediaPipelineResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetMediaPipelineResponse, AWSError>;
  /**
   * Gets an Kinesis video stream pool.
   */
  getMediaPipelineKinesisVideoStreamPool(params: ChimeSDKMediaPipelines.Types.GetMediaPipelineKinesisVideoStreamPoolRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetMediaPipelineKinesisVideoStreamPoolResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetMediaPipelineKinesisVideoStreamPoolResponse, AWSError>;
  /**
   * Gets an Kinesis video stream pool.
   */
  getMediaPipelineKinesisVideoStreamPool(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetMediaPipelineKinesisVideoStreamPoolResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetMediaPipelineKinesisVideoStreamPoolResponse, AWSError>;
  /**
   * Retrieves the details of the specified speaker search task.
   */
  getSpeakerSearchTask(params: ChimeSDKMediaPipelines.Types.GetSpeakerSearchTaskRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetSpeakerSearchTaskResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetSpeakerSearchTaskResponse, AWSError>;
  /**
   * Retrieves the details of the specified speaker search task.
   */
  getSpeakerSearchTask(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetSpeakerSearchTaskResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetSpeakerSearchTaskResponse, AWSError>;
  /**
   * Retrieves the details of a voice tone analysis task.
   */
  getVoiceToneAnalysisTask(params: ChimeSDKMediaPipelines.Types.GetVoiceToneAnalysisTaskRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetVoiceToneAnalysisTaskResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetVoiceToneAnalysisTaskResponse, AWSError>;
  /**
   * Retrieves the details of a voice tone analysis task.
   */
  getVoiceToneAnalysisTask(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.GetVoiceToneAnalysisTaskResponse) => void): Request<ChimeSDKMediaPipelines.Types.GetVoiceToneAnalysisTaskResponse, AWSError>;
  /**
   * Returns a list of media pipelines.
   */
  listMediaCapturePipelines(params: ChimeSDKMediaPipelines.Types.ListMediaCapturePipelinesRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListMediaCapturePipelinesResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListMediaCapturePipelinesResponse, AWSError>;
  /**
   * Returns a list of media pipelines.
   */
  listMediaCapturePipelines(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListMediaCapturePipelinesResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListMediaCapturePipelinesResponse, AWSError>;
  /**
   * Lists the available media insights pipeline configurations.
   */
  listMediaInsightsPipelineConfigurations(params: ChimeSDKMediaPipelines.Types.ListMediaInsightsPipelineConfigurationsRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListMediaInsightsPipelineConfigurationsResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListMediaInsightsPipelineConfigurationsResponse, AWSError>;
  /**
   * Lists the available media insights pipeline configurations.
   */
  listMediaInsightsPipelineConfigurations(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListMediaInsightsPipelineConfigurationsResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListMediaInsightsPipelineConfigurationsResponse, AWSError>;
  /**
   * Lists the video stream pools in the media pipeline.
   */
  listMediaPipelineKinesisVideoStreamPools(params: ChimeSDKMediaPipelines.Types.ListMediaPipelineKinesisVideoStreamPoolsRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListMediaPipelineKinesisVideoStreamPoolsResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListMediaPipelineKinesisVideoStreamPoolsResponse, AWSError>;
  /**
   * Lists the video stream pools in the media pipeline.
   */
  listMediaPipelineKinesisVideoStreamPools(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListMediaPipelineKinesisVideoStreamPoolsResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListMediaPipelineKinesisVideoStreamPoolsResponse, AWSError>;
  /**
   * Returns a list of media pipelines.
   */
  listMediaPipelines(params: ChimeSDKMediaPipelines.Types.ListMediaPipelinesRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListMediaPipelinesResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListMediaPipelinesResponse, AWSError>;
  /**
   * Returns a list of media pipelines.
   */
  listMediaPipelines(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListMediaPipelinesResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListMediaPipelinesResponse, AWSError>;
  /**
   * Lists the tags available for a media pipeline.
   */
  listTagsForResource(params: ChimeSDKMediaPipelines.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags available for a media pipeline.
   */
  listTagsForResource(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKMediaPipelines.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts a speaker search task.  Before starting any speaker search tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK. 
   */
  startSpeakerSearchTask(params: ChimeSDKMediaPipelines.Types.StartSpeakerSearchTaskRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.StartSpeakerSearchTaskResponse) => void): Request<ChimeSDKMediaPipelines.Types.StartSpeakerSearchTaskResponse, AWSError>;
  /**
   * Starts a speaker search task.  Before starting any speaker search tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK. 
   */
  startSpeakerSearchTask(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.StartSpeakerSearchTaskResponse) => void): Request<ChimeSDKMediaPipelines.Types.StartSpeakerSearchTaskResponse, AWSError>;
  /**
   * Starts a voice tone analysis task. For more information about voice tone analysis, see Using Amazon Chime SDK voice analytics in the Amazon Chime SDK Developer Guide.  Before starting any voice tone analysis tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK. 
   */
  startVoiceToneAnalysisTask(params: ChimeSDKMediaPipelines.Types.StartVoiceToneAnalysisTaskRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.StartVoiceToneAnalysisTaskResponse) => void): Request<ChimeSDKMediaPipelines.Types.StartVoiceToneAnalysisTaskResponse, AWSError>;
  /**
   * Starts a voice tone analysis task. For more information about voice tone analysis, see Using Amazon Chime SDK voice analytics in the Amazon Chime SDK Developer Guide.  Before starting any voice tone analysis tasks, you must provide all notices and obtain all consents from the speaker as required under applicable privacy and biometrics laws, and as required under the AWS service terms for the Amazon Chime SDK. 
   */
  startVoiceToneAnalysisTask(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.StartVoiceToneAnalysisTaskResponse) => void): Request<ChimeSDKMediaPipelines.Types.StartVoiceToneAnalysisTaskResponse, AWSError>;
  /**
   * Stops a speaker search task.
   */
  stopSpeakerSearchTask(params: ChimeSDKMediaPipelines.Types.StopSpeakerSearchTaskRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a speaker search task.
   */
  stopSpeakerSearchTask(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a voice tone analysis task.
   */
  stopVoiceToneAnalysisTask(params: ChimeSDKMediaPipelines.Types.StopVoiceToneAnalysisTaskRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a voice tone analysis task.
   */
  stopVoiceToneAnalysisTask(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The ARN of the media pipeline that you want to tag. Consists of the pipeline's endpoint region, resource ID, and pipeline ID.
   */
  tagResource(params: ChimeSDKMediaPipelines.Types.TagResourceRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.TagResourceResponse) => void): Request<ChimeSDKMediaPipelines.Types.TagResourceResponse, AWSError>;
  /**
   * The ARN of the media pipeline that you want to tag. Consists of the pipeline's endpoint region, resource ID, and pipeline ID.
   */
  tagResource(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.TagResourceResponse) => void): Request<ChimeSDKMediaPipelines.Types.TagResourceResponse, AWSError>;
  /**
   * Removes any tags from a media pipeline.
   */
  untagResource(params: ChimeSDKMediaPipelines.Types.UntagResourceRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.UntagResourceResponse) => void): Request<ChimeSDKMediaPipelines.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes any tags from a media pipeline.
   */
  untagResource(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.UntagResourceResponse) => void): Request<ChimeSDKMediaPipelines.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the media insights pipeline's configuration settings.
   */
  updateMediaInsightsPipelineConfiguration(params: ChimeSDKMediaPipelines.Types.UpdateMediaInsightsPipelineConfigurationRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.UpdateMediaInsightsPipelineConfigurationResponse) => void): Request<ChimeSDKMediaPipelines.Types.UpdateMediaInsightsPipelineConfigurationResponse, AWSError>;
  /**
   * Updates the media insights pipeline's configuration settings.
   */
  updateMediaInsightsPipelineConfiguration(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.UpdateMediaInsightsPipelineConfigurationResponse) => void): Request<ChimeSDKMediaPipelines.Types.UpdateMediaInsightsPipelineConfigurationResponse, AWSError>;
  /**
   * Updates the status of a media insights pipeline.
   */
  updateMediaInsightsPipelineStatus(params: ChimeSDKMediaPipelines.Types.UpdateMediaInsightsPipelineStatusRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the status of a media insights pipeline.
   */
  updateMediaInsightsPipelineStatus(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an Kinesis video stream pool in a media pipeline.
   */
  updateMediaPipelineKinesisVideoStreamPool(params: ChimeSDKMediaPipelines.Types.UpdateMediaPipelineKinesisVideoStreamPoolRequest, callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.UpdateMediaPipelineKinesisVideoStreamPoolResponse) => void): Request<ChimeSDKMediaPipelines.Types.UpdateMediaPipelineKinesisVideoStreamPoolResponse, AWSError>;
  /**
   * Updates an Kinesis video stream pool in a media pipeline.
   */
  updateMediaPipelineKinesisVideoStreamPool(callback?: (err: AWSError, data: ChimeSDKMediaPipelines.Types.UpdateMediaPipelineKinesisVideoStreamPoolResponse) => void): Request<ChimeSDKMediaPipelines.Types.UpdateMediaPipelineKinesisVideoStreamPoolResponse, AWSError>;
}
declare namespace ChimeSDKMediaPipelines {
  export interface ActiveSpeakerOnlyConfiguration {
    /**
     * The position of the ActiveSpeakerOnly video tile.
     */
    ActiveSpeakerPosition?: ActiveSpeakerPosition;
  }
  export type ActiveSpeakerPosition = "TopLeft"|"TopRight"|"BottomLeft"|"BottomRight"|string;
  export type AmazonResourceName = string;
  export interface AmazonTranscribeCallAnalyticsProcessorConfiguration {
    /**
     * The language code in the configuration.
     */
    LanguageCode: CallAnalyticsLanguageCode;
    /**
     * Specifies the name of the custom vocabulary to use when processing a transcription. Note that vocabulary names are case sensitive. If the language of the specified custom vocabulary doesn't match the language identified in your media, the custom vocabulary is not applied to your transcription. For more information, see Custom vocabularies in the Amazon Transcribe Developer Guide. Length Constraints: Minimum length of 1. Maximum length of 200. 
     */
    VocabularyName?: VocabularyName;
    /**
     * Specifies the name of the custom vocabulary filter to use when processing a transcription. Note that vocabulary filter names are case sensitive. If the language of the specified custom vocabulary filter doesn't match the language identified in your media, the vocabulary filter is not applied to your transcription. For more information, see Using vocabulary filtering with unwanted words in the Amazon Transcribe Developer Guide. Length Constraints: Minimum length of 1. Maximum length of 200. 
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * Specifies how to apply a vocabulary filter to a transcript. To replace words with ***, choose mask. To delete words, choose remove. To flag words without changing them, choose tag. 
     */
    VocabularyFilterMethod?: VocabularyFilterMethod;
    /**
     * Specifies the name of the custom language model to use when processing a transcription. Note that language model names are case sensitive. The language of the specified language model must match the language code specified in the transcription request. If the languages don't match, the custom language model isn't applied. Language mismatches don't generate errors or warnings. For more information, see Custom language models in the Amazon Transcribe Developer Guide.
     */
    LanguageModelName?: ModelName;
    /**
     * Enables partial result stabilization for your transcription. Partial result stabilization can reduce latency in your output, but may impact accuracy. For more information, see Partial-result stabilization in the Amazon Transcribe Developer Guide.
     */
    EnablePartialResultsStabilization?: Boolean;
    /**
     * Specifies the level of stability to use when you enable partial results stabilization (EnablePartialResultsStabilization). Low stability provides the highest accuracy. High stability transcribes faster, but with slightly lower accuracy. For more information, see Partial-result stabilization in the Amazon Transcribe Developer Guide.
     */
    PartialResultsStability?: PartialResultsStability;
    /**
     * Labels all personally identifiable information (PII) identified in your transcript. Content identification is performed at the segment level; PII specified in PiiEntityTypes is flagged upon complete transcription of an audio segment. You can’t set ContentIdentificationType and ContentRedactionType in the same request. If you do, your request returns a BadRequestException. For more information, see Redacting or identifying personally identifiable information in the Amazon Transcribe Developer Guide.
     */
    ContentIdentificationType?: ContentType;
    /**
     * Redacts all personally identifiable information (PII) identified in your transcript. Content redaction is performed at the segment level; PII specified in PiiEntityTypes is redacted upon complete transcription of an audio segment. You can’t set ContentRedactionType and ContentIdentificationType in the same request. If you do, your request returns a BadRequestException. For more information, see Redacting or identifying personally identifiable information in the Amazon Transcribe Developer Guide.
     */
    ContentRedactionType?: ContentType;
    /**
     * Specifies the types of personally identifiable information (PII) to redact from a transcript. You can include as many types as you'd like, or you can select ALL. To include PiiEntityTypes in your Call Analytics request, you must also include ContentIdentificationType or ContentRedactionType, but you can't include both.  Values must be comma-separated and can include: ADDRESS, BANK_ACCOUNT_NUMBER, BANK_ROUTING, CREDIT_DEBIT_CVV, CREDIT_DEBIT_EXPIRY, CREDIT_DEBIT_NUMBER, EMAIL, NAME, PHONE, PIN, SSN, or ALL. Length Constraints: Minimum length of 1. Maximum length of 300.
     */
    PiiEntityTypes?: PiiEntityTypes;
    /**
     * If true, UtteranceEvents with IsPartial: true are filtered out of the insights target.
     */
    FilterPartialResults?: Boolean;
    /**
     * The settings for a post-call analysis task in an analytics configuration.
     */
    PostCallAnalyticsSettings?: PostCallAnalyticsSettings;
    /**
     * By default, all CategoryEvents are sent to the insights target. If this parameter is specified, only included categories are sent to the insights target. 
     */
    CallAnalyticsStreamCategories?: CategoryNameList;
  }
  export interface AmazonTranscribeProcessorConfiguration {
    /**
     * The language code that represents the language spoken in your audio. If you're unsure of the language spoken in your audio, consider using IdentifyLanguage to enable automatic language identification. For a list of languages that real-time Call Analytics supports, see the Supported languages table in the Amazon Transcribe Developer Guide.
     */
    LanguageCode?: CallAnalyticsLanguageCode;
    /**
     * The name of the custom vocabulary that you specified in your Call Analytics request. Length Constraints: Minimum length of 1. Maximum length of 200.
     */
    VocabularyName?: VocabularyName;
    /**
     * The name of the custom vocabulary filter that you specified in your Call Analytics request. Length Constraints: Minimum length of 1. Maximum length of 200.
     */
    VocabularyFilterName?: VocabularyFilterName;
    /**
     * The vocabulary filtering method used in your Call Analytics transcription.
     */
    VocabularyFilterMethod?: VocabularyFilterMethod;
    /**
     * Enables speaker partitioning (diarization) in your transcription output. Speaker partitioning labels the speech from individual speakers in your media file. For more information, see Partitioning speakers (diarization) in the Amazon Transcribe Developer Guide.
     */
    ShowSpeakerLabel?: Boolean;
    /**
     * Enables partial result stabilization for your transcription. Partial result stabilization can reduce latency in your output, but may impact accuracy. For more information, see Partial-result stabilization in the Amazon Transcribe Developer Guide.
     */
    EnablePartialResultsStabilization?: Boolean;
    /**
     * The level of stability to use when you enable partial results stabilization (EnablePartialResultsStabilization). Low stability provides the highest accuracy. High stability transcribes faster, but with slightly lower accuracy. For more information, see Partial-result stabilization in the Amazon Transcribe Developer Guide.
     */
    PartialResultsStability?: PartialResultsStability;
    /**
     * Labels all personally identifiable information (PII) identified in your transcript. Content identification is performed at the segment level; PII specified in PiiEntityTypes is flagged upon complete transcription of an audio segment. You can’t set ContentIdentificationType and ContentRedactionType in the same request. If you set both, your request returns a BadRequestException. For more information, see Redacting or identifying personally identifiable information in the Amazon Transcribe Developer Guide.
     */
    ContentIdentificationType?: ContentType;
    /**
     * Redacts all personally identifiable information (PII) identified in your transcript. Content redaction is performed at the segment level; PII specified in PiiEntityTypes is redacted upon complete transcription of an audio segment. You can’t set ContentRedactionType and ContentIdentificationType in the same request. If you set both, your request returns a BadRequestException. For more information, see Redacting or identifying personally identifiable information in the Amazon Transcribe Developer Guide.
     */
    ContentRedactionType?: ContentType;
    /**
     * The types of personally identifiable information (PII) to redact from a transcript. You can include as many types as you'd like, or you can select ALL. To include PiiEntityTypes in your Call Analytics request, you must also include ContentIdentificationType or ContentRedactionType, but you can't include both. Values must be comma-separated and can include: ADDRESS, BANK_ACCOUNT_NUMBER, BANK_ROUTING, CREDIT_DEBIT_CVV, CREDIT_DEBIT_EXPIRY, CREDIT_DEBIT_NUMBER, EMAIL, NAME, PHONE, PIN, SSN, or ALL. If you leave this parameter empty, the default behavior is equivalent to ALL.
     */
    PiiEntityTypes?: PiiEntityTypes;
    /**
     * The name of the custom language model that you want to use when processing your transcription. Note that language model names are case sensitive. The language of the specified language model must match the language code you specify in your transcription request. If the languages don't match, the custom language model isn't applied. There are no errors or warnings associated with a language mismatch. For more information, see Custom language models in the Amazon Transcribe Developer Guide.
     */
    LanguageModelName?: ModelName;
    /**
     * If true, TranscriptEvents with IsPartial: true are filtered out of the insights target.
     */
    FilterPartialResults?: Boolean;
    /**
     * Turns language identification on or off.
     */
    IdentifyLanguage?: Boolean;
    /**
     * The language options for the transcription, such as automatic language detection.
     */
    LanguageOptions?: LanguageOptions;
    /**
     * The preferred language for the transcription.
     */
    PreferredLanguage?: CallAnalyticsLanguageCode;
    /**
     * The names of the custom vocabulary or vocabularies used during transcription.
     */
    VocabularyNames?: VocabularyNames;
    /**
     * The names of the custom vocabulary filter or filters using during transcription.
     */
    VocabularyFilterNames?: VocabularyFilterNames;
  }
  export type Arn = string;
  export interface ArtifactsConcatenationConfiguration {
    /**
     * The configuration for the audio artifacts concatenation.
     */
    Audio: AudioConcatenationConfiguration;
    /**
     * The configuration for the video artifacts concatenation.
     */
    Video: VideoConcatenationConfiguration;
    /**
     * The configuration for the content artifacts concatenation.
     */
    Content: ContentConcatenationConfiguration;
    /**
     * The configuration for the data channel artifacts concatenation.
     */
    DataChannel: DataChannelConcatenationConfiguration;
    /**
     * The configuration for the transcription messages artifacts concatenation.
     */
    TranscriptionMessages: TranscriptionMessagesConcatenationConfiguration;
    /**
     * The configuration for the meeting events artifacts concatenation.
     */
    MeetingEvents: MeetingEventsConcatenationConfiguration;
    /**
     * The configuration for the composited video artifacts concatenation.
     */
    CompositedVideo: CompositedVideoConcatenationConfiguration;
  }
  export type ArtifactsConcatenationState = "Enabled"|"Disabled"|string;
  export interface ArtifactsConfiguration {
    /**
     * The configuration for the audio artifacts.
     */
    Audio: AudioArtifactsConfiguration;
    /**
     * The configuration for the video artifacts.
     */
    Video: VideoArtifactsConfiguration;
    /**
     * The configuration for the content artifacts.
     */
    Content: ContentArtifactsConfiguration;
    /**
     * Enables video compositing.
     */
    CompositedVideo?: CompositedVideoArtifactsConfiguration;
  }
  export type ArtifactsState = "Enabled"|"Disabled"|string;
  export type AttendeeIdList = GuidString[];
  export type AudioArtifactsConcatenationState = "Enabled"|string;
  export interface AudioArtifactsConfiguration {
    /**
     * The MUX type of the audio artifact configuration object.
     */
    MuxType: AudioMuxType;
  }
  export type AudioChannelsOption = "Stereo"|"Mono"|string;
  export interface AudioConcatenationConfiguration {
    /**
     * Enables or disables the configuration object.
     */
    State: AudioArtifactsConcatenationState;
  }
  export type AudioMuxType = "AudioOnly"|"AudioWithActiveSpeakerVideo"|"AudioWithCompositedVideo"|string;
  export type AudioSampleRateOption = string;
  export type AwsRegion = string;
  export type Boolean = boolean;
  export type BorderColor = "Black"|"Blue"|"Red"|"Green"|"White"|"Yellow"|string;
  export type BorderThickness = number;
  export type CallAnalyticsLanguageCode = "en-US"|"en-GB"|"es-US"|"fr-CA"|"fr-FR"|"en-AU"|"it-IT"|"de-DE"|"pt-BR"|string;
  export type CanvasOrientation = "Landscape"|"Portrait"|string;
  export type CategoryName = string;
  export type CategoryNameList = CategoryName[];
  export interface ChannelDefinition {
    /**
     * The channel ID.
     */
    ChannelId: ChannelId;
    /**
     * Specifies whether the audio in a channel belongs to the AGENT or CUSTOMER.
     */
    ParticipantRole?: ParticipantRole;
  }
  export type ChannelDefinitions = ChannelDefinition[];
  export type ChannelId = number;
  export interface ChimeSdkMeetingConcatenationConfiguration {
    /**
     * The configuration for the artifacts in an Amazon Chime SDK meeting concatenation.
     */
    ArtifactsConfiguration: ArtifactsConcatenationConfiguration;
  }
  export interface ChimeSdkMeetingConfiguration {
    /**
     * The source configuration for a specified media pipeline.
     */
    SourceConfiguration?: SourceConfiguration;
    /**
     * The configuration for the artifacts in an Amazon Chime SDK meeting.
     */
    ArtifactsConfiguration?: ArtifactsConfiguration;
  }
  export interface ChimeSdkMeetingLiveConnectorConfiguration {
    /**
     * The configuration object's Chime SDK meeting ARN.
     */
    Arn: Arn;
    /**
     * The configuration object's multiplex type.
     */
    MuxType: LiveConnectorMuxType;
    /**
     * The media pipeline's composited video.
     */
    CompositedVideo?: CompositedVideoArtifactsConfiguration;
    /**
     * The source configuration settings of the media pipeline's configuration object.
     */
    SourceConfiguration?: SourceConfiguration;
  }
  export type ClientRequestToken = string;
  export interface CompositedVideoArtifactsConfiguration {
    /**
     * The layout setting, such as GridView in the configuration object.
     */
    Layout?: LayoutOption;
    /**
     * The video resolution setting in the configuration object. Default: HD at 1280 x 720. FHD resolution: 1920 x 1080.
     */
    Resolution?: ResolutionOption;
    /**
     * The GridView configuration setting.
     */
    GridViewConfiguration: GridViewConfiguration;
  }
  export interface CompositedVideoConcatenationConfiguration {
    /**
     * Enables or disables the configuration object.
     */
    State: ArtifactsConcatenationState;
  }
  export interface ConcatenationSink {
    /**
     * The type of data sink in the configuration object.
     */
    Type: ConcatenationSinkType;
    /**
     * The configuration settings for an Amazon S3 bucket sink.
     */
    S3BucketSinkConfiguration: S3BucketSinkConfiguration;
  }
  export type ConcatenationSinkList = ConcatenationSink[];
  export type ConcatenationSinkType = "S3Bucket"|string;
  export interface ConcatenationSource {
    /**
     * The type of concatenation source in a configuration object.
     */
    Type: ConcatenationSourceType;
    /**
     * The concatenation settings for the media pipeline in a configuration object.
     */
    MediaCapturePipelineSourceConfiguration: MediaCapturePipelineSourceConfiguration;
  }
  export type ConcatenationSourceList = ConcatenationSource[];
  export type ConcatenationSourceType = "MediaCapturePipeline"|string;
  export interface ContentArtifactsConfiguration {
    /**
     * Indicates whether the content artifact is enabled or disabled.
     */
    State: ArtifactsState;
    /**
     * The MUX type of the artifact configuration.
     */
    MuxType?: ContentMuxType;
  }
  export interface ContentConcatenationConfiguration {
    /**
     * Enables or disables the configuration object.
     */
    State: ArtifactsConcatenationState;
  }
  export type ContentMuxType = "ContentOnly"|string;
  export type ContentRedactionOutput = "redacted"|"redacted_and_unredacted"|string;
  export type ContentShareLayoutOption = "PresenterOnly"|"Horizontal"|"Vertical"|"ActiveSpeakerOnly"|string;
  export type ContentType = "PII"|string;
  export type CornerRadius = number;
  export interface CreateMediaCapturePipelineRequest {
    /**
     * Source type from which the media artifacts are captured. A Chime SDK Meeting is the only supported source.
     */
    SourceType: MediaPipelineSourceType;
    /**
     * ARN of the source from which the media artifacts are captured.
     */
    SourceArn: Arn;
    /**
     * Destination type to which the media artifacts are saved. You must use an S3 bucket.
     */
    SinkType: MediaPipelineSinkType;
    /**
     * The ARN of the sink type.
     */
    SinkArn: Arn;
    /**
     * The unique identifier for the client request. The token makes the API request idempotent. Use a unique token for each media pipeline request.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The configuration for a specified media pipeline. SourceType must be ChimeSdkMeeting.
     */
    ChimeSdkMeetingConfiguration?: ChimeSdkMeetingConfiguration;
    /**
     * The tag key-value pairs.
     */
    Tags?: TagList;
  }
  export interface CreateMediaCapturePipelineResponse {
    /**
     * A media pipeline object, the ID, source type, source ARN, sink type, and sink ARN of a media pipeline object.
     */
    MediaCapturePipeline?: MediaCapturePipeline;
  }
  export interface CreateMediaConcatenationPipelineRequest {
    /**
     * An object that specifies the sources for the media concatenation pipeline.
     */
    Sources: ConcatenationSourceList;
    /**
     * An object that specifies the data sinks for the media concatenation pipeline.
     */
    Sinks: ConcatenationSinkList;
    /**
     * The unique identifier for the client request. The token makes the API request idempotent. Use a unique token for each media concatenation pipeline request.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags associated with the media concatenation pipeline.
     */
    Tags?: TagList;
  }
  export interface CreateMediaConcatenationPipelineResponse {
    /**
     * A media concatenation pipeline object, the ID, source type, MediaPipelineARN, and sink of a media concatenation pipeline object.
     */
    MediaConcatenationPipeline?: MediaConcatenationPipeline;
  }
  export interface CreateMediaInsightsPipelineConfigurationRequest {
    /**
     * The name of the media insights pipeline configuration.
     */
    MediaInsightsPipelineConfigurationName: MediaInsightsPipelineConfigurationNameString;
    /**
     * The ARN of the role used by the service to access Amazon Web Services resources, including Transcribe and Transcribe Call Analytics, on the caller’s behalf.
     */
    ResourceAccessRoleArn: Arn;
    /**
     * The configuration settings for the real-time alerts in a media insights pipeline configuration.
     */
    RealTimeAlertConfiguration?: RealTimeAlertConfiguration;
    /**
     * The elements in the request, such as a processor for Amazon Transcribe or a sink for a Kinesis Data Stream.
     */
    Elements: MediaInsightsPipelineConfigurationElements;
    /**
     * The tags assigned to the media insights pipeline configuration.
     */
    Tags?: TagList;
    /**
     * The unique identifier for the media insights pipeline configuration request.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateMediaInsightsPipelineConfigurationResponse {
    /**
     * The configuration settings for the media insights pipeline.
     */
    MediaInsightsPipelineConfiguration?: MediaInsightsPipelineConfiguration;
  }
  export interface CreateMediaInsightsPipelineRequest {
    /**
     * The ARN of the pipeline's configuration.
     */
    MediaInsightsPipelineConfigurationArn: Arn;
    /**
     * The runtime configuration for the Kinesis video stream source of the media insights pipeline.
     */
    KinesisVideoStreamSourceRuntimeConfiguration?: KinesisVideoStreamSourceRuntimeConfiguration;
    /**
     * The runtime metadata for the media insights pipeline. Consists of a key-value map of strings.
     */
    MediaInsightsRuntimeMetadata?: MediaInsightsRuntimeMetadata;
    /**
     * The runtime configuration for the Kinesis video recording stream source.
     */
    KinesisVideoStreamRecordingSourceRuntimeConfiguration?: KinesisVideoStreamRecordingSourceRuntimeConfiguration;
    /**
     * The runtime configuration for the S3 recording sink. If specified, the settings in this structure override any settings in S3RecordingSinkConfiguration.
     */
    S3RecordingSinkRuntimeConfiguration?: S3RecordingSinkRuntimeConfiguration;
    /**
     * The tags assigned to the media insights pipeline.
     */
    Tags?: TagList;
    /**
     * The unique identifier for the media insights pipeline request.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateMediaInsightsPipelineResponse {
    /**
     * The media insights pipeline object.
     */
    MediaInsightsPipeline: MediaInsightsPipeline;
  }
  export interface CreateMediaLiveConnectorPipelineRequest {
    /**
     * The media live connector pipeline's data sources.
     */
    Sources: LiveConnectorSourceList;
    /**
     * The media live connector pipeline's data sinks.
     */
    Sinks: LiveConnectorSinkList;
    /**
     * The token assigned to the client making the request.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags associated with the media live connector pipeline.
     */
    Tags?: TagList;
  }
  export interface CreateMediaLiveConnectorPipelineResponse {
    /**
     * The new media live connector pipeline.
     */
    MediaLiveConnectorPipeline?: MediaLiveConnectorPipeline;
  }
  export interface CreateMediaPipelineKinesisVideoStreamPoolRequest {
    /**
     * The configuration settings for the video stream.
     */
    StreamConfiguration: KinesisVideoStreamConfiguration;
    /**
     * The name of the video stream pool.
     */
    PoolName: KinesisVideoStreamPoolName;
    /**
     * The token assigned to the client making the request.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags assigned to the video stream pool.
     */
    Tags?: TagList;
  }
  export interface CreateMediaPipelineKinesisVideoStreamPoolResponse {
    /**
     * The configuration for the Kinesis video stream pool.
     */
    KinesisVideoStreamPoolConfiguration?: KinesisVideoStreamPoolConfiguration;
  }
  export interface CreateMediaStreamPipelineRequest {
    /**
     * The data sources for the media pipeline.
     */
    Sources: MediaStreamSourceList;
    /**
     * The data sink for the media pipeline.
     */
    Sinks: MediaStreamSinkList;
    /**
     * The token assigned to the client making the request.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The tags assigned to the media pipeline.
     */
    Tags?: TagList;
  }
  export interface CreateMediaStreamPipelineResponse {
    /**
     * The requested media pipeline.
     */
    MediaStreamPipeline?: MediaStreamPipeline;
  }
  export interface DataChannelConcatenationConfiguration {
    /**
     * Enables or disables the configuration object.
     */
    State: ArtifactsConcatenationState;
  }
  export type DataRetentionChangeInHours = number;
  export type DataRetentionInHours = number;
  export interface DeleteMediaCapturePipelineRequest {
    /**
     * The ID of the media pipeline being deleted. 
     */
    MediaPipelineId: GuidString;
  }
  export interface DeleteMediaInsightsPipelineConfigurationRequest {
    /**
     * The unique identifier of the resource to be deleted. Valid values include the name and ARN of the media insights pipeline configuration.
     */
    Identifier: NonEmptyString;
  }
  export interface DeleteMediaPipelineKinesisVideoStreamPoolRequest {
    /**
     * The ID of the pool being deleted.
     */
    Identifier: NonEmptyString;
  }
  export interface DeleteMediaPipelineRequest {
    /**
     * The ID of the media pipeline to delete.
     */
    MediaPipelineId: GuidString;
  }
  export type ExternalUserIdList = ExternalUserIdType[];
  export type ExternalUserIdType = string;
  export type FragmentNumberString = string;
  export interface FragmentSelector {
    /**
     * The origin of the timestamps to use, Server or Producer. For more information, see StartSelectorType in the Amazon Kinesis Video Streams Developer Guide.
     */
    FragmentSelectorType: FragmentSelectorType;
    /**
     * The range of timestamps to return.
     */
    TimestampRange: TimestampRange;
  }
  export type FragmentSelectorType = "ProducerTimestamp"|"ServerTimestamp"|string;
  export interface GetMediaCapturePipelineRequest {
    /**
     * The ID of the pipeline that you want to get.
     */
    MediaPipelineId: GuidString;
  }
  export interface GetMediaCapturePipelineResponse {
    /**
     * The media pipeline object.
     */
    MediaCapturePipeline?: MediaCapturePipeline;
  }
  export interface GetMediaInsightsPipelineConfigurationRequest {
    /**
     * The unique identifier of the requested resource. Valid values include the name and ARN of the media insights pipeline configuration.
     */
    Identifier: NonEmptyString;
  }
  export interface GetMediaInsightsPipelineConfigurationResponse {
    /**
     * The requested media insights pipeline configuration.
     */
    MediaInsightsPipelineConfiguration?: MediaInsightsPipelineConfiguration;
  }
  export interface GetMediaPipelineKinesisVideoStreamPoolRequest {
    /**
     * The ID of the video stream pool.
     */
    Identifier: NonEmptyString;
  }
  export interface GetMediaPipelineKinesisVideoStreamPoolResponse {
    /**
     * The video stream pool configuration object.
     */
    KinesisVideoStreamPoolConfiguration?: KinesisVideoStreamPoolConfiguration;
  }
  export interface GetMediaPipelineRequest {
    /**
     * The ID of the pipeline that you want to get.
     */
    MediaPipelineId: GuidString;
  }
  export interface GetMediaPipelineResponse {
    /**
     * The media pipeline object.
     */
    MediaPipeline?: MediaPipeline;
  }
  export interface GetSpeakerSearchTaskRequest {
    /**
     * The unique identifier of the resource to be updated. Valid values include the ID and ARN of the media insights pipeline.
     */
    Identifier: NonEmptyString;
    /**
     * The ID of the speaker search task.
     */
    SpeakerSearchTaskId: GuidString;
  }
  export interface GetSpeakerSearchTaskResponse {
    /**
     * The details of the speaker search task.
     */
    SpeakerSearchTask?: SpeakerSearchTask;
  }
  export interface GetVoiceToneAnalysisTaskRequest {
    /**
     * The unique identifier of the resource to be updated. Valid values include the ID and ARN of the media insights pipeline.
     */
    Identifier: NonEmptyString;
    /**
     * The ID of the voice tone analysis task.
     */
    VoiceToneAnalysisTaskId: GuidString;
  }
  export interface GetVoiceToneAnalysisTaskResponse {
    /**
     * The details of the voice tone analysis task.
     */
    VoiceToneAnalysisTask?: VoiceToneAnalysisTask;
  }
  export interface GridViewConfiguration {
    /**
     * Defines the layout of the video tiles when content sharing is enabled.
     */
    ContentShareLayout: ContentShareLayoutOption;
    /**
     * Defines the configuration options for a presenter only video tile.
     */
    PresenterOnlyConfiguration?: PresenterOnlyConfiguration;
    /**
     * The configuration settings for an ActiveSpeakerOnly video tile.
     */
    ActiveSpeakerOnlyConfiguration?: ActiveSpeakerOnlyConfiguration;
    /**
     * The configuration settings for a horizontal layout.
     */
    HorizontalLayoutConfiguration?: HorizontalLayoutConfiguration;
    /**
     * The configuration settings for a vertical layout.
     */
    VerticalLayoutConfiguration?: VerticalLayoutConfiguration;
    /**
     * The attribute settings for the video tiles.
     */
    VideoAttribute?: VideoAttribute;
    /**
     * The orientation setting, horizontal or vertical.
     */
    CanvasOrientation?: CanvasOrientation;
  }
  export type GuidString = string;
  export type HighlightColor = "Black"|"Blue"|"Red"|"Green"|"White"|"Yellow"|string;
  export interface HorizontalLayoutConfiguration {
    /**
     * Sets the automatic ordering of the video tiles.
     */
    TileOrder?: TileOrder;
    /**
     * Sets the position of horizontal tiles.
     */
    TilePosition?: HorizontalTilePosition;
    /**
     * The maximum number of video tiles to display.
     */
    TileCount?: TileCount;
    /**
     * Specifies the aspect ratio of all video tiles.
     */
    TileAspectRatio?: TileAspectRatio;
  }
  export type HorizontalTilePosition = "Top"|"Bottom"|string;
  export type Iso8601Timestamp = Date;
  export interface IssueDetectionConfiguration {
    /**
     * The name of the issue detection rule.
     */
    RuleName: RuleName;
  }
  export type Keyword = string;
  export interface KeywordMatchConfiguration {
    /**
     * The name of the keyword match rule.
     */
    RuleName: RuleName;
    /**
     * The keywords or phrases that you want to match.
     */
    Keywords: KeywordMatchWordList;
    /**
     * Matches keywords or phrases on their presence or absence. If set to TRUE, the rule matches when all the specified keywords or phrases are absent. Default: FALSE.
     */
    Negate?: Boolean;
  }
  export type KeywordMatchWordList = Keyword[];
  export interface KinesisDataStreamSinkConfiguration {
    /**
     * The ARN of the sink.
     */
    InsightsTarget?: Arn;
  }
  export type KinesisVideoStreamArn = string;
  export interface KinesisVideoStreamConfiguration {
    /**
     * The Amazon Web Services Region of the video stream.
     */
    Region: AwsRegion;
    /**
     * The amount of time that data is retained.
     */
    DataRetentionInHours?: DataRetentionInHours;
  }
  export interface KinesisVideoStreamConfigurationUpdate {
    /**
     * The updated time that data is retained.
     */
    DataRetentionInHours?: DataRetentionChangeInHours;
  }
  export interface KinesisVideoStreamPoolConfiguration {
    /**
     * The ARN of the video stream pool configuration.
     */
    PoolArn?: Arn;
    /**
     * The name of the video stream pool configuration.
     */
    PoolName?: KinesisVideoStreamPoolName;
    /**
     * The ID of the video stream pool in the configuration.
     */
    PoolId?: KinesisVideoStreamPoolId;
    /**
     * The status of the video stream pool in the configuration. 
     */
    PoolStatus?: KinesisVideoStreamPoolStatus;
    /**
     * The size of the video stream pool in the configuration.
     */
    PoolSize?: KinesisVideoStreamPoolSize;
    /**
     * The Kinesis video stream pool configuration object.
     */
    StreamConfiguration?: KinesisVideoStreamConfiguration;
    /**
     * The time at which the configuration was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the configuration was updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export type KinesisVideoStreamPoolId = string;
  export type KinesisVideoStreamPoolName = string;
  export type KinesisVideoStreamPoolSize = number;
  export type KinesisVideoStreamPoolStatus = "CREATING"|"ACTIVE"|"UPDATING"|"DELETING"|"FAILED"|string;
  export interface KinesisVideoStreamPoolSummary {
    /**
     * The name of the video stream pool.
     */
    PoolName?: KinesisVideoStreamPoolName;
    /**
     * The ID of the video stream pool.
     */
    PoolId?: KinesisVideoStreamPoolId;
    /**
     * The ARN of the video stream pool.
     */
    PoolArn?: Arn;
  }
  export type KinesisVideoStreamPoolSummaryList = KinesisVideoStreamPoolSummary[];
  export interface KinesisVideoStreamRecordingSourceRuntimeConfiguration {
    /**
     * The stream or streams to be recorded.
     */
    Streams: RecordingStreamList;
    /**
     * Describes the timestamp range and timestamp origin of a range of fragments in the Kinesis video stream.
     */
    FragmentSelector: FragmentSelector;
  }
  export interface KinesisVideoStreamSourceRuntimeConfiguration {
    /**
     * The streams in the source runtime configuration of a Kinesis video stream.
     */
    Streams: Streams;
    /**
     * Specifies the encoding of your input audio. Supported format: PCM (only signed 16-bit little-endian audio formats, which does not include WAV) For more information, see Media formats in the Amazon Transcribe Developer Guide.
     */
    MediaEncoding: MediaEncoding;
    /**
     * The sample rate of the input audio (in hertz). Low-quality audio, such as telephone audio, is typically around 8,000 Hz. High-quality audio typically ranges from 16,000 Hz to 48,000 Hz. Note that the sample rate you specify must match that of your audio. Valid Range: Minimum value of 8000. Maximum value of 48000.
     */
    MediaSampleRate: MediaSampleRateHertz;
  }
  export interface KinesisVideoStreamSourceTaskConfiguration {
    /**
     * The ARN of the stream.
     */
    StreamArn: KinesisVideoStreamArn;
    /**
     * The channel ID.
     */
    ChannelId: ChannelId;
    /**
     * The unique identifier of the fragment to begin processing.
     */
    FragmentNumber?: FragmentNumberString;
  }
  export interface LambdaFunctionSinkConfiguration {
    /**
     * The ARN of the sink.
     */
    InsightsTarget?: Arn;
  }
  export type LanguageOptions = string;
  export type LayoutOption = "GridView"|string;
  export interface ListMediaCapturePipelinesRequest {
    /**
     * The token used to retrieve the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call. Valid Range: 1 - 99.
     */
    MaxResults?: ResultMax;
  }
  export interface ListMediaCapturePipelinesResponse {
    /**
     * The media pipeline objects in the list.
     */
    MediaCapturePipelines?: MediaCapturePipelineSummaryList;
    /**
     * The token used to retrieve the next page of results. 
     */
    NextToken?: String;
  }
  export interface ListMediaInsightsPipelineConfigurationsRequest {
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call.
     */
    MaxResults?: ResultMax;
  }
  export interface ListMediaInsightsPipelineConfigurationsResponse {
    /**
     * The requested list of media insights pipeline configurations.
     */
    MediaInsightsPipelineConfigurations?: MediaInsightsPipelineConfigurationSummaryList;
    /**
     * The token used to return the next page of results. 
     */
    NextToken?: String;
  }
  export interface ListMediaPipelineKinesisVideoStreamPoolsRequest {
    /**
     * The token used to return the next page of results. 
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call.
     */
    MaxResults?: ResultMax;
  }
  export interface ListMediaPipelineKinesisVideoStreamPoolsResponse {
    /**
     * The list of video stream pools.
     */
    KinesisVideoStreamPools?: KinesisVideoStreamPoolSummaryList;
    /**
     * The token used to return the next page of results.
     */
    NextToken?: String;
  }
  export interface ListMediaPipelinesRequest {
    /**
     * The token used to retrieve the next page of results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in a single call. Valid Range: 1 - 99.
     */
    MaxResults?: ResultMax;
  }
  export interface ListMediaPipelinesResponse {
    /**
     * The media pipeline objects in the list.
     */
    MediaPipelines?: MediaPipelineList;
    /**
     * The token used to retrieve the next page of results. 
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the media pipeline associated with any tags. The ARN consists of the pipeline's region, resource ID, and pipeline ID.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with the specified media pipeline.
     */
    Tags?: TagList;
  }
  export type LiveConnectorMuxType = "AudioWithCompositedVideo"|"AudioWithActiveSpeakerVideo"|string;
  export interface LiveConnectorRTMPConfiguration {
    /**
     * The URL of the RTMP configuration.
     */
    Url: SensitiveString;
    /**
     * The audio channels set for the RTMP configuration
     */
    AudioChannels?: AudioChannelsOption;
    /**
     * The audio sample rate set for the RTMP configuration. Default: 48000.
     */
    AudioSampleRate?: AudioSampleRateOption;
  }
  export interface LiveConnectorSinkConfiguration {
    /**
     * The sink configuration's sink type.
     */
    SinkType: LiveConnectorSinkType;
    /**
     * The sink configuration's RTMP configuration settings.
     */
    RTMPConfiguration: LiveConnectorRTMPConfiguration;
  }
  export type LiveConnectorSinkList = LiveConnectorSinkConfiguration[];
  export type LiveConnectorSinkType = "RTMP"|string;
  export interface LiveConnectorSourceConfiguration {
    /**
     * The source configuration's media source type.
     */
    SourceType: LiveConnectorSourceType;
    /**
     * The configuration settings of the connector pipeline.
     */
    ChimeSdkMeetingLiveConnectorConfiguration: ChimeSdkMeetingLiveConnectorConfiguration;
  }
  export type LiveConnectorSourceList = LiveConnectorSourceConfiguration[];
  export type LiveConnectorSourceType = "ChimeSdkMeeting"|string;
  export interface MediaCapturePipeline {
    /**
     * The ID of a media pipeline.
     */
    MediaPipelineId?: GuidString;
    /**
     * The ARN of the media capture pipeline
     */
    MediaPipelineArn?: AmazonResourceName;
    /**
     * Source type from which media artifacts are saved. You must use ChimeMeeting.
     */
    SourceType?: MediaPipelineSourceType;
    /**
     * ARN of the source from which the media artifacts are saved.
     */
    SourceArn?: Arn;
    /**
     * The status of the media pipeline.
     */
    Status?: MediaPipelineStatus;
    /**
     * Destination type to which the media artifacts are saved. You must use an S3 Bucket.
     */
    SinkType?: MediaPipelineSinkType;
    /**
     * ARN of the destination to which the media artifacts are saved.
     */
    SinkArn?: Arn;
    /**
     * The time at which the pipeline was created, in ISO 8601 format.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the pipeline was updated, in ISO 8601 format.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The configuration for a specified media pipeline. SourceType must be ChimeSdkMeeting.
     */
    ChimeSdkMeetingConfiguration?: ChimeSdkMeetingConfiguration;
  }
  export interface MediaCapturePipelineSourceConfiguration {
    /**
     * The media pipeline ARN in the configuration object of a media capture pipeline.
     */
    MediaPipelineArn: Arn;
    /**
     * The meeting configuration settings in a media capture pipeline configuration object. 
     */
    ChimeSdkMeetingConfiguration: ChimeSdkMeetingConcatenationConfiguration;
  }
  export interface MediaCapturePipelineSummary {
    /**
     * The ID of the media pipeline in the summary.
     */
    MediaPipelineId?: GuidString;
    /**
     * The ARN of the media pipeline in the summary.
     */
    MediaPipelineArn?: AmazonResourceName;
  }
  export type MediaCapturePipelineSummaryList = MediaCapturePipelineSummary[];
  export interface MediaConcatenationPipeline {
    /**
     * The ID of the media pipeline being concatenated.
     */
    MediaPipelineId?: GuidString;
    /**
     * The ARN of the media pipeline that you specify in the SourceConfiguration object.
     */
    MediaPipelineArn?: AmazonResourceName;
    /**
     * The data sources being concatenated.
     */
    Sources?: ConcatenationSourceList;
    /**
     * The data sinks of the concatenation pipeline.
     */
    Sinks?: ConcatenationSinkList;
    /**
     * The status of the concatenation pipeline.
     */
    Status?: MediaPipelineStatus;
    /**
     * The time at which the concatenation pipeline was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the concatenation pipeline was last updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export type MediaEncoding = "pcm"|string;
  export interface MediaInsightsPipeline {
    /**
     * The ID of a media insights pipeline.
     */
    MediaPipelineId?: GuidString;
    /**
     * The ARN of a media insights pipeline.
     */
    MediaPipelineArn?: Arn;
    /**
     * The ARN of a media insight pipeline's configuration settings.
     */
    MediaInsightsPipelineConfigurationArn?: Arn;
    /**
     * The status of a media insights pipeline.
     */
    Status?: MediaPipelineStatus;
    /**
     * The configuration settings for a Kinesis runtime video stream in a media insights pipeline.
     */
    KinesisVideoStreamSourceRuntimeConfiguration?: KinesisVideoStreamSourceRuntimeConfiguration;
    /**
     * The runtime metadata of a media insights pipeline.
     */
    MediaInsightsRuntimeMetadata?: MediaInsightsRuntimeMetadata;
    /**
     * The runtime configuration settings for a Kinesis recording video stream in a media insights pipeline.
     */
    KinesisVideoStreamRecordingSourceRuntimeConfiguration?: KinesisVideoStreamRecordingSourceRuntimeConfiguration;
    /**
     * The runtime configuration of the Amazon S3 bucket that stores recordings in a media insights pipeline.
     */
    S3RecordingSinkRuntimeConfiguration?: S3RecordingSinkRuntimeConfiguration;
    /**
     * The time at which the media insights pipeline was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The statuses that the elements in a media insights pipeline can have during data processing.
     */
    ElementStatuses?: MediaInsightsPipelineElementStatuses;
  }
  export interface MediaInsightsPipelineConfiguration {
    /**
     * The name of the configuration.
     */
    MediaInsightsPipelineConfigurationName?: MediaInsightsPipelineConfigurationNameString;
    /**
     * The ARN of the configuration.
     */
    MediaInsightsPipelineConfigurationArn?: Arn;
    /**
     * The ARN of the role used by the service to access Amazon Web Services resources.
     */
    ResourceAccessRoleArn?: Arn;
    /**
     * Lists the rules that trigger a real-time alert.
     */
    RealTimeAlertConfiguration?: RealTimeAlertConfiguration;
    /**
     * The elements in the configuration.
     */
    Elements?: MediaInsightsPipelineConfigurationElements;
    /**
     * The ID of the configuration.
     */
    MediaInsightsPipelineConfigurationId?: GuidString;
    /**
     * The time at which the configuration was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the configuration was last updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export interface MediaInsightsPipelineConfigurationElement {
    /**
     * The element type.
     */
    Type: MediaInsightsPipelineConfigurationElementType;
    /**
     * The analytics configuration settings for transcribing audio in a media insights pipeline configuration element.
     */
    AmazonTranscribeCallAnalyticsProcessorConfiguration?: AmazonTranscribeCallAnalyticsProcessorConfiguration;
    /**
     * The transcription processor configuration settings in a media insights pipeline configuration element.
     */
    AmazonTranscribeProcessorConfiguration?: AmazonTranscribeProcessorConfiguration;
    /**
     * The configuration settings for the Kinesis Data Stream Sink in a media insights pipeline configuration element.
     */
    KinesisDataStreamSinkConfiguration?: KinesisDataStreamSinkConfiguration;
    /**
     * The configuration settings for the Amazon S3 recording bucket in a media insights pipeline configuration element.
     */
    S3RecordingSinkConfiguration?: S3RecordingSinkConfiguration;
    /**
     * The voice analytics configuration settings in a media insights pipeline configuration element.
     */
    VoiceAnalyticsProcessorConfiguration?: VoiceAnalyticsProcessorConfiguration;
    /**
     * The configuration settings for the Amazon Web Services Lambda sink in a media insights pipeline configuration element.
     */
    LambdaFunctionSinkConfiguration?: LambdaFunctionSinkConfiguration;
    /**
     * The configuration settings for an SQS queue sink in a media insights pipeline configuration element.
     */
    SqsQueueSinkConfiguration?: SqsQueueSinkConfiguration;
    /**
     * The configuration settings for an SNS topic sink in a media insights pipeline configuration element.
     */
    SnsTopicSinkConfiguration?: SnsTopicSinkConfiguration;
    /**
     * The configuration settings for voice enhancement sink in a media insights pipeline configuration element.
     */
    VoiceEnhancementSinkConfiguration?: VoiceEnhancementSinkConfiguration;
  }
  export type MediaInsightsPipelineConfigurationElementType = "AmazonTranscribeCallAnalyticsProcessor"|"VoiceAnalyticsProcessor"|"AmazonTranscribeProcessor"|"KinesisDataStreamSink"|"LambdaFunctionSink"|"SqsQueueSink"|"SnsTopicSink"|"S3RecordingSink"|"VoiceEnhancementSink"|string;
  export type MediaInsightsPipelineConfigurationElements = MediaInsightsPipelineConfigurationElement[];
  export type MediaInsightsPipelineConfigurationNameString = string;
  export interface MediaInsightsPipelineConfigurationSummary {
    /**
     * The name of the media insights pipeline configuration.
     */
    MediaInsightsPipelineConfigurationName?: MediaInsightsPipelineConfigurationNameString;
    /**
     * The ID of the media insights pipeline configuration.
     */
    MediaInsightsPipelineConfigurationId?: GuidString;
    /**
     * The ARN of the media insights pipeline configuration.
     */
    MediaInsightsPipelineConfigurationArn?: Arn;
  }
  export type MediaInsightsPipelineConfigurationSummaryList = MediaInsightsPipelineConfigurationSummary[];
  export interface MediaInsightsPipelineElementStatus {
    /**
     * The type of status.
     */
    Type?: MediaInsightsPipelineConfigurationElementType;
    /**
     * The element's status.
     */
    Status?: MediaPipelineElementStatus;
  }
  export type MediaInsightsPipelineElementStatuses = MediaInsightsPipelineElementStatus[];
  export type MediaInsightsRuntimeMetadata = {[key: string]: String};
  export interface MediaLiveConnectorPipeline {
    /**
     * The connector pipeline's data sources.
     */
    Sources?: LiveConnectorSourceList;
    /**
     * The connector pipeline's data sinks.
     */
    Sinks?: LiveConnectorSinkList;
    /**
     * The connector pipeline's ID.
     */
    MediaPipelineId?: GuidString;
    /**
     * The connector pipeline's ARN.
     */
    MediaPipelineArn?: AmazonResourceName;
    /**
     * The connector pipeline's status.
     */
    Status?: MediaPipelineStatus;
    /**
     * The time at which the connector pipeline was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the connector pipeline was last updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export interface MediaPipeline {
    /**
     * A pipeline that enables users to capture audio and video.
     */
    MediaCapturePipeline?: MediaCapturePipeline;
    /**
     * The connector pipeline of the media pipeline.
     */
    MediaLiveConnectorPipeline?: MediaLiveConnectorPipeline;
    /**
     * The media concatenation pipeline in a media pipeline.
     */
    MediaConcatenationPipeline?: MediaConcatenationPipeline;
    /**
     * The media insights pipeline of a media pipeline.
     */
    MediaInsightsPipeline?: MediaInsightsPipeline;
    /**
     * Designates a media pipeline as a media stream pipeline.
     */
    MediaStreamPipeline?: MediaStreamPipeline;
  }
  export type MediaPipelineElementStatus = "NotStarted"|"NotSupported"|"Initializing"|"InProgress"|"Failed"|"Stopping"|"Stopped"|"Paused"|string;
  export type MediaPipelineList = MediaPipelineSummary[];
  export type MediaPipelineSinkType = "S3Bucket"|string;
  export type MediaPipelineSourceType = "ChimeSdkMeeting"|string;
  export type MediaPipelineStatus = "Initializing"|"InProgress"|"Failed"|"Stopping"|"Stopped"|"Paused"|"NotStarted"|string;
  export type MediaPipelineStatusUpdate = "Pause"|"Resume"|string;
  export interface MediaPipelineSummary {
    /**
     * The ID of the media pipeline in the summary.
     */
    MediaPipelineId?: GuidString;
    /**
     * The ARN of the media pipeline in the summary.
     */
    MediaPipelineArn?: AmazonResourceName;
  }
  export type MediaPipelineTaskStatus = "NotStarted"|"Initializing"|"InProgress"|"Failed"|"Stopping"|"Stopped"|string;
  export type MediaSampleRateHertz = number;
  export interface MediaStreamPipeline {
    /**
     * The ID of the media stream pipeline
     */
    MediaPipelineId?: GuidString;
    /**
     * The ARN of the media stream pipeline.
     */
    MediaPipelineArn?: AmazonResourceName;
    /**
     * The time at which the media stream pipeline was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which the media stream pipeline was updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
    /**
     * The status of the media stream pipeline.
     */
    Status?: MediaPipelineStatus;
    /**
     * The media stream pipeline's data sources.
     */
    Sources?: MediaStreamSourceList;
    /**
     * The media stream pipeline's data sinks.
     */
    Sinks?: MediaStreamSinkList;
  }
  export type MediaStreamPipelineSinkType = "KinesisVideoStreamPool"|string;
  export interface MediaStreamSink {
    /**
     * The ARN of the media stream sink.
     */
    SinkArn: Arn;
    /**
     * The media stream sink's type.
     */
    SinkType: MediaStreamPipelineSinkType;
    /**
     * Specifies the number of streams that the sink can accept.
     */
    ReservedStreamCapacity: ReservedStreamCapacity;
    /**
     * The media stream sink's media stream type.
     */
    MediaStreamType: MediaStreamType;
  }
  export type MediaStreamSinkList = MediaStreamSink[];
  export interface MediaStreamSource {
    /**
     * The type of media stream source.
     */
    SourceType: MediaPipelineSourceType;
    /**
     * The ARN of the media stream source. 
     */
    SourceArn: Arn;
  }
  export type MediaStreamSourceList = MediaStreamSource[];
  export type MediaStreamType = "MixedAudio"|"IndividualAudio"|string;
  export interface MeetingEventsConcatenationConfiguration {
    /**
     * Enables or disables the configuration object.
     */
    State: ArtifactsConcatenationState;
  }
  export type ModelName = string;
  export type NonEmptyString = string;
  export type NumberOfChannels = number;
  export type PartialResultsStability = "high"|"medium"|"low"|string;
  export type ParticipantRole = "AGENT"|"CUSTOMER"|string;
  export type PiiEntityTypes = string;
  export interface PostCallAnalyticsSettings {
    /**
     * The URL of the Amazon S3 bucket that contains the post-call data.
     */
    OutputLocation: String;
    /**
     * The ARN of the role used by Amazon Web Services Transcribe to upload your post call analysis. For more information, see Post-call analytics with real-time transcriptions in the Amazon Transcribe Developer Guide.
     */
    DataAccessRoleArn: String;
    /**
     * The content redaction output settings for a post-call analysis task.
     */
    ContentRedactionOutput?: ContentRedactionOutput;
    /**
     * The ID of the KMS (Key Management Service) key used to encrypt the output.
     */
    OutputEncryptionKMSKeyId?: String;
  }
  export interface PresenterOnlyConfiguration {
    /**
     * Defines the position of the presenter video tile. Default: TopRight.
     */
    PresenterPosition?: PresenterPosition;
  }
  export type PresenterPosition = "TopLeft"|"TopRight"|"BottomLeft"|"BottomRight"|string;
  export interface RealTimeAlertConfiguration {
    /**
     * Turns off real-time alerts.
     */
    Disabled?: Boolean;
    /**
     * The rules in the alert. Rules specify the words or phrases that you want to be notified about.
     */
    Rules?: RealTimeAlertRuleList;
  }
  export interface RealTimeAlertRule {
    /**
     * The type of alert rule.
     */
    Type: RealTimeAlertRuleType;
    /**
     * Specifies the settings for matching the keywords in a real-time alert rule.
     */
    KeywordMatchConfiguration?: KeywordMatchConfiguration;
    /**
     * Specifies the settings for predicting sentiment in a real-time alert rule.
     */
    SentimentConfiguration?: SentimentConfiguration;
    /**
     * Specifies the issue detection settings for a real-time alert rule.
     */
    IssueDetectionConfiguration?: IssueDetectionConfiguration;
  }
  export type RealTimeAlertRuleList = RealTimeAlertRule[];
  export type RealTimeAlertRuleType = "KeywordMatch"|"Sentiment"|"IssueDetection"|string;
  export type RecordingFileFormat = "Wav"|"Opus"|string;
  export interface RecordingStreamConfiguration {
    /**
     * The ARN of the recording stream.
     */
    StreamArn?: KinesisVideoStreamArn;
  }
  export type RecordingStreamList = RecordingStreamConfiguration[];
  export type ReservedStreamCapacity = number;
  export type ResolutionOption = "HD"|"FHD"|string;
  export type ResultMax = number;
  export type RuleName = string;
  export interface S3BucketSinkConfiguration {
    /**
     * The destination URL of the S3 bucket.
     */
    Destination: Arn;
  }
  export interface S3RecordingSinkConfiguration {
    /**
     * The default URI of the Amazon S3 bucket used as the recording sink.
     */
    Destination?: Arn;
    /**
     * The default file format for the media files sent to the Amazon S3 bucket.
     */
    RecordingFileFormat?: RecordingFileFormat;
  }
  export interface S3RecordingSinkRuntimeConfiguration {
    /**
     * The URI of the S3 bucket used as the sink.
     */
    Destination: Arn;
    /**
     * The file format for the media files sent to the Amazon S3 bucket.
     */
    RecordingFileFormat: RecordingFileFormat;
  }
  export interface SelectedVideoStreams {
    /**
     * The attendee IDs of the streams selected for a media pipeline. 
     */
    AttendeeIds?: AttendeeIdList;
    /**
     * The external user IDs of the streams selected for a media pipeline.
     */
    ExternalUserIds?: ExternalUserIdList;
  }
  export type SensitiveString = string;
  export interface SentimentConfiguration {
    /**
     * The name of the rule in the sentiment configuration.
     */
    RuleName: RuleName;
    /**
     * The type of sentiment, POSITIVE, NEGATIVE, or NEUTRAL.
     */
    SentimentType: SentimentType;
    /**
     * Specifies the analysis interval.
     */
    TimePeriod: SentimentTimePeriodInSeconds;
  }
  export type SentimentTimePeriodInSeconds = number;
  export type SentimentType = "NEGATIVE"|string;
  export interface SnsTopicSinkConfiguration {
    /**
     * The ARN of the SNS sink.
     */
    InsightsTarget?: Arn;
  }
  export interface SourceConfiguration {
    /**
     * The selected video streams for a specified media pipeline. The number of video streams can't exceed 25.
     */
    SelectedVideoStreams?: SelectedVideoStreams;
  }
  export interface SpeakerSearchTask {
    /**
     * The speaker search task ID.
     */
    SpeakerSearchTaskId?: GuidString;
    /**
     * The status of the speaker search task.
     */
    SpeakerSearchTaskStatus?: MediaPipelineTaskStatus;
    /**
     * The time at which a speaker search task was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which a speaker search task was updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  export interface SqsQueueSinkConfiguration {
    /**
     * The ARN of the SQS sink.
     */
    InsightsTarget?: Arn;
  }
  export interface StartSpeakerSearchTaskRequest {
    /**
     * The unique identifier of the resource to be updated. Valid values include the ID and ARN of the media insights pipeline.
     */
    Identifier: NonEmptyString;
    /**
     * The ARN of the voice profile domain that will store the voice profile.
     */
    VoiceProfileDomainArn: Arn;
    /**
     * The task configuration for the Kinesis video stream source of the media insights pipeline.
     */
    KinesisVideoStreamSourceTaskConfiguration?: KinesisVideoStreamSourceTaskConfiguration;
    /**
     * The unique identifier for the client request. Use a different token for different speaker search tasks.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface StartSpeakerSearchTaskResponse {
    /**
     * The details of the speaker search task.
     */
    SpeakerSearchTask?: SpeakerSearchTask;
  }
  export interface StartVoiceToneAnalysisTaskRequest {
    /**
     * The unique identifier of the resource to be updated. Valid values include the ID and ARN of the media insights pipeline.
     */
    Identifier: NonEmptyString;
    /**
     * The language code.
     */
    LanguageCode: VoiceAnalyticsLanguageCode;
    /**
     * The task configuration for the Kinesis video stream source of the media insights pipeline.
     */
    KinesisVideoStreamSourceTaskConfiguration?: KinesisVideoStreamSourceTaskConfiguration;
    /**
     * The unique identifier for the client request. Use a different token for different voice tone analysis tasks.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface StartVoiceToneAnalysisTaskResponse {
    /**
     * The details of the voice tone analysis task.
     */
    VoiceToneAnalysisTask?: VoiceToneAnalysisTask;
  }
  export interface StopSpeakerSearchTaskRequest {
    /**
     * The unique identifier of the resource to be updated. Valid values include the ID and ARN of the media insights pipeline.
     */
    Identifier: NonEmptyString;
    /**
     * The speaker search task ID.
     */
    SpeakerSearchTaskId: GuidString;
  }
  export interface StopVoiceToneAnalysisTaskRequest {
    /**
     * The unique identifier of the resource to be updated. Valid values include the ID and ARN of the media insights pipeline.
     */
    Identifier: NonEmptyString;
    /**
     * The ID of the voice tone analysis task.
     */
    VoiceToneAnalysisTaskId: GuidString;
  }
  export interface StreamChannelDefinition {
    /**
     * The number of channels in a streaming channel.
     */
    NumberOfChannels: NumberOfChannels;
    /**
     * The definitions of the channels in a streaming channel.
     */
    ChannelDefinitions?: ChannelDefinitions;
  }
  export interface StreamConfiguration {
    /**
     * The ARN of the stream.
     */
    StreamArn: KinesisVideoStreamArn;
    /**
     * The unique identifier of the fragment to begin processing.
     */
    FragmentNumber?: FragmentNumberString;
    /**
     * The streaming channel definition in the stream configuration.
     */
    StreamChannelDefinition: StreamChannelDefinition;
  }
  export type Streams = StreamConfiguration[];
  export type String = string;
  export interface Tag {
    /**
     * The key half of a tag.
     */
    Key: TagKey;
    /**
     * The value half of a tag.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the media pipeline associated with any tags. The ARN consists of the pipeline's endpoint region, resource ID, and pipeline ID.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The tags associated with the specified media pipeline.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TileAspectRatio = string;
  export type TileCount = number;
  export type TileOrder = "JoinSequence"|"SpeakerSequence"|string;
  export type Timestamp = Date;
  export interface TimestampRange {
    /**
     * The starting timestamp for the specified range.
     */
    StartTimestamp: Timestamp;
    /**
     * The ending timestamp for the specified range.
     */
    EndTimestamp: Timestamp;
  }
  export interface TranscriptionMessagesConcatenationConfiguration {
    /**
     * Enables or disables the configuration object.
     */
    State: ArtifactsConcatenationState;
  }
  export interface UntagResourceRequest {
    /**
     * The ARN of the pipeline that you want to untag.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The key/value pairs in the tag that you want to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateMediaInsightsPipelineConfigurationRequest {
    /**
     * The unique identifier for the resource to be updated. Valid values include the name and ARN of the media insights pipeline configuration.
     */
    Identifier: NonEmptyString;
    /**
     * The ARN of the role used by the service to access Amazon Web Services resources.
     */
    ResourceAccessRoleArn: Arn;
    /**
     * The configuration settings for real-time alerts for the media insights pipeline.
     */
    RealTimeAlertConfiguration?: RealTimeAlertConfiguration;
    /**
     * The elements in the request, such as a processor for Amazon Transcribe or a sink for a Kinesis Data Stream..
     */
    Elements: MediaInsightsPipelineConfigurationElements;
  }
  export interface UpdateMediaInsightsPipelineConfigurationResponse {
    /**
     * The updated configuration settings.
     */
    MediaInsightsPipelineConfiguration?: MediaInsightsPipelineConfiguration;
  }
  export interface UpdateMediaInsightsPipelineStatusRequest {
    /**
     * The unique identifier of the resource to be updated. Valid values include the ID and ARN of the media insights pipeline.
     */
    Identifier: NonEmptyString;
    /**
     * The requested status of the media insights pipeline.
     */
    UpdateStatus: MediaPipelineStatusUpdate;
  }
  export interface UpdateMediaPipelineKinesisVideoStreamPoolRequest {
    /**
     * The ID of the video stream pool.
     */
    Identifier: NonEmptyString;
    /**
     * The configuration settings for the video stream.
     */
    StreamConfiguration?: KinesisVideoStreamConfigurationUpdate;
  }
  export interface UpdateMediaPipelineKinesisVideoStreamPoolResponse {
    /**
     * The video stream pool configuration object.
     */
    KinesisVideoStreamPoolConfiguration?: KinesisVideoStreamPoolConfiguration;
  }
  export interface VerticalLayoutConfiguration {
    /**
     * Sets the automatic ordering of the video tiles.
     */
    TileOrder?: TileOrder;
    /**
     * Sets the position of vertical tiles.
     */
    TilePosition?: VerticalTilePosition;
    /**
     * The maximum number of tiles to display.
     */
    TileCount?: TileCount;
    /**
     * Sets the aspect ratio of the video tiles, such as 16:9.
     */
    TileAspectRatio?: TileAspectRatio;
  }
  export type VerticalTilePosition = "Left"|"Right"|string;
  export interface VideoArtifactsConfiguration {
    /**
     * Indicates whether the video artifact is enabled or disabled.
     */
    State: ArtifactsState;
    /**
     * The MUX type of the video artifact configuration object.
     */
    MuxType?: VideoMuxType;
  }
  export interface VideoAttribute {
    /**
     * Sets the corner radius of all video tiles.
     */
    CornerRadius?: CornerRadius;
    /**
     * Defines the border color of all video tiles.
     */
    BorderColor?: BorderColor;
    /**
     * Defines the highlight color for the active video tile.
     */
    HighlightColor?: HighlightColor;
    /**
     * Defines the border thickness for all video tiles.
     */
    BorderThickness?: BorderThickness;
  }
  export interface VideoConcatenationConfiguration {
    /**
     * Enables or disables the configuration object.
     */
    State: ArtifactsConcatenationState;
  }
  export type VideoMuxType = "VideoOnly"|string;
  export type VocabularyFilterMethod = "remove"|"mask"|"tag"|string;
  export type VocabularyFilterName = string;
  export type VocabularyFilterNames = string;
  export type VocabularyName = string;
  export type VocabularyNames = string;
  export type VoiceAnalyticsConfigurationStatus = "Enabled"|"Disabled"|string;
  export type VoiceAnalyticsLanguageCode = "en-US"|string;
  export interface VoiceAnalyticsProcessorConfiguration {
    /**
     * The status of the speaker search task.
     */
    SpeakerSearchStatus?: VoiceAnalyticsConfigurationStatus;
    /**
     * The status of the voice tone analysis task.
     */
    VoiceToneAnalysisStatus?: VoiceAnalyticsConfigurationStatus;
  }
  export interface VoiceEnhancementSinkConfiguration {
    /**
     * Disables the VoiceEnhancementSinkConfiguration element.
     */
    Disabled?: Boolean;
  }
  export interface VoiceToneAnalysisTask {
    /**
     * The ID of the voice tone analysis task.
     */
    VoiceToneAnalysisTaskId?: GuidString;
    /**
     * The status of a voice tone analysis task.
     */
    VoiceToneAnalysisTaskStatus?: MediaPipelineTaskStatus;
    /**
     * The time at which a voice tone analysis task was created.
     */
    CreatedTimestamp?: Iso8601Timestamp;
    /**
     * The time at which a voice tone analysis task was updated.
     */
    UpdatedTimestamp?: Iso8601Timestamp;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-07-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ChimeSDKMediaPipelines client.
   */
  export import Types = ChimeSDKMediaPipelines;
}
export = ChimeSDKMediaPipelines;
