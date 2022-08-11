import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MediaConvert extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MediaConvert.Types.ClientConfiguration)
  config: Config & MediaConvert.Types.ClientConfiguration;
  /**
   * Associates an AWS Certificate Manager (ACM) Amazon Resource Name (ARN) with AWS Elemental MediaConvert.
   */
  associateCertificate(params: MediaConvert.Types.AssociateCertificateRequest, callback?: (err: AWSError, data: MediaConvert.Types.AssociateCertificateResponse) => void): Request<MediaConvert.Types.AssociateCertificateResponse, AWSError>;
  /**
   * Associates an AWS Certificate Manager (ACM) Amazon Resource Name (ARN) with AWS Elemental MediaConvert.
   */
  associateCertificate(callback?: (err: AWSError, data: MediaConvert.Types.AssociateCertificateResponse) => void): Request<MediaConvert.Types.AssociateCertificateResponse, AWSError>;
  /**
   * Permanently cancel a job. Once you have canceled a job, you can't start it again.
   */
  cancelJob(params: MediaConvert.Types.CancelJobRequest, callback?: (err: AWSError, data: MediaConvert.Types.CancelJobResponse) => void): Request<MediaConvert.Types.CancelJobResponse, AWSError>;
  /**
   * Permanently cancel a job. Once you have canceled a job, you can't start it again.
   */
  cancelJob(callback?: (err: AWSError, data: MediaConvert.Types.CancelJobResponse) => void): Request<MediaConvert.Types.CancelJobResponse, AWSError>;
  /**
   * Create a new transcoding job. For information about jobs and job settings, see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
   */
  createJob(params: MediaConvert.Types.CreateJobRequest, callback?: (err: AWSError, data: MediaConvert.Types.CreateJobResponse) => void): Request<MediaConvert.Types.CreateJobResponse, AWSError>;
  /**
   * Create a new transcoding job. For information about jobs and job settings, see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
   */
  createJob(callback?: (err: AWSError, data: MediaConvert.Types.CreateJobResponse) => void): Request<MediaConvert.Types.CreateJobResponse, AWSError>;
  /**
   * Create a new job template. For information about job templates see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
   */
  createJobTemplate(params: MediaConvert.Types.CreateJobTemplateRequest, callback?: (err: AWSError, data: MediaConvert.Types.CreateJobTemplateResponse) => void): Request<MediaConvert.Types.CreateJobTemplateResponse, AWSError>;
  /**
   * Create a new job template. For information about job templates see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
   */
  createJobTemplate(callback?: (err: AWSError, data: MediaConvert.Types.CreateJobTemplateResponse) => void): Request<MediaConvert.Types.CreateJobTemplateResponse, AWSError>;
  /**
   * Create a new preset. For information about job templates see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
   */
  createPreset(params: MediaConvert.Types.CreatePresetRequest, callback?: (err: AWSError, data: MediaConvert.Types.CreatePresetResponse) => void): Request<MediaConvert.Types.CreatePresetResponse, AWSError>;
  /**
   * Create a new preset. For information about job templates see the User Guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
   */
  createPreset(callback?: (err: AWSError, data: MediaConvert.Types.CreatePresetResponse) => void): Request<MediaConvert.Types.CreatePresetResponse, AWSError>;
  /**
   * Create a new transcoding queue. For information about queues, see Working With Queues in the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-queues.html
   */
  createQueue(params: MediaConvert.Types.CreateQueueRequest, callback?: (err: AWSError, data: MediaConvert.Types.CreateQueueResponse) => void): Request<MediaConvert.Types.CreateQueueResponse, AWSError>;
  /**
   * Create a new transcoding queue. For information about queues, see Working With Queues in the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-queues.html
   */
  createQueue(callback?: (err: AWSError, data: MediaConvert.Types.CreateQueueResponse) => void): Request<MediaConvert.Types.CreateQueueResponse, AWSError>;
  /**
   * Permanently delete a job template you have created.
   */
  deleteJobTemplate(params: MediaConvert.Types.DeleteJobTemplateRequest, callback?: (err: AWSError, data: MediaConvert.Types.DeleteJobTemplateResponse) => void): Request<MediaConvert.Types.DeleteJobTemplateResponse, AWSError>;
  /**
   * Permanently delete a job template you have created.
   */
  deleteJobTemplate(callback?: (err: AWSError, data: MediaConvert.Types.DeleteJobTemplateResponse) => void): Request<MediaConvert.Types.DeleteJobTemplateResponse, AWSError>;
  /**
   * Permanently delete a policy that you created.
   */
  deletePolicy(params: MediaConvert.Types.DeletePolicyRequest, callback?: (err: AWSError, data: MediaConvert.Types.DeletePolicyResponse) => void): Request<MediaConvert.Types.DeletePolicyResponse, AWSError>;
  /**
   * Permanently delete a policy that you created.
   */
  deletePolicy(callback?: (err: AWSError, data: MediaConvert.Types.DeletePolicyResponse) => void): Request<MediaConvert.Types.DeletePolicyResponse, AWSError>;
  /**
   * Permanently delete a preset you have created.
   */
  deletePreset(params: MediaConvert.Types.DeletePresetRequest, callback?: (err: AWSError, data: MediaConvert.Types.DeletePresetResponse) => void): Request<MediaConvert.Types.DeletePresetResponse, AWSError>;
  /**
   * Permanently delete a preset you have created.
   */
  deletePreset(callback?: (err: AWSError, data: MediaConvert.Types.DeletePresetResponse) => void): Request<MediaConvert.Types.DeletePresetResponse, AWSError>;
  /**
   * Permanently delete a queue you have created.
   */
  deleteQueue(params: MediaConvert.Types.DeleteQueueRequest, callback?: (err: AWSError, data: MediaConvert.Types.DeleteQueueResponse) => void): Request<MediaConvert.Types.DeleteQueueResponse, AWSError>;
  /**
   * Permanently delete a queue you have created.
   */
  deleteQueue(callback?: (err: AWSError, data: MediaConvert.Types.DeleteQueueResponse) => void): Request<MediaConvert.Types.DeleteQueueResponse, AWSError>;
  /**
   * Send an request with an empty body to the regional API endpoint to get your account API endpoint.
   */
  describeEndpoints(params: MediaConvert.Types.DescribeEndpointsRequest, callback?: (err: AWSError, data: MediaConvert.Types.DescribeEndpointsResponse) => void): Request<MediaConvert.Types.DescribeEndpointsResponse, AWSError>;
  /**
   * Send an request with an empty body to the regional API endpoint to get your account API endpoint.
   */
  describeEndpoints(callback?: (err: AWSError, data: MediaConvert.Types.DescribeEndpointsResponse) => void): Request<MediaConvert.Types.DescribeEndpointsResponse, AWSError>;
  /**
   * Removes an association between the Amazon Resource Name (ARN) of an AWS Certificate Manager (ACM) certificate and an AWS Elemental MediaConvert resource.
   */
  disassociateCertificate(params: MediaConvert.Types.DisassociateCertificateRequest, callback?: (err: AWSError, data: MediaConvert.Types.DisassociateCertificateResponse) => void): Request<MediaConvert.Types.DisassociateCertificateResponse, AWSError>;
  /**
   * Removes an association between the Amazon Resource Name (ARN) of an AWS Certificate Manager (ACM) certificate and an AWS Elemental MediaConvert resource.
   */
  disassociateCertificate(callback?: (err: AWSError, data: MediaConvert.Types.DisassociateCertificateResponse) => void): Request<MediaConvert.Types.DisassociateCertificateResponse, AWSError>;
  /**
   * Retrieve the JSON for a specific completed transcoding job.
   */
  getJob(params: MediaConvert.Types.GetJobRequest, callback?: (err: AWSError, data: MediaConvert.Types.GetJobResponse) => void): Request<MediaConvert.Types.GetJobResponse, AWSError>;
  /**
   * Retrieve the JSON for a specific completed transcoding job.
   */
  getJob(callback?: (err: AWSError, data: MediaConvert.Types.GetJobResponse) => void): Request<MediaConvert.Types.GetJobResponse, AWSError>;
  /**
   * Retrieve the JSON for a specific job template.
   */
  getJobTemplate(params: MediaConvert.Types.GetJobTemplateRequest, callback?: (err: AWSError, data: MediaConvert.Types.GetJobTemplateResponse) => void): Request<MediaConvert.Types.GetJobTemplateResponse, AWSError>;
  /**
   * Retrieve the JSON for a specific job template.
   */
  getJobTemplate(callback?: (err: AWSError, data: MediaConvert.Types.GetJobTemplateResponse) => void): Request<MediaConvert.Types.GetJobTemplateResponse, AWSError>;
  /**
   * Retrieve the JSON for your policy.
   */
  getPolicy(params: MediaConvert.Types.GetPolicyRequest, callback?: (err: AWSError, data: MediaConvert.Types.GetPolicyResponse) => void): Request<MediaConvert.Types.GetPolicyResponse, AWSError>;
  /**
   * Retrieve the JSON for your policy.
   */
  getPolicy(callback?: (err: AWSError, data: MediaConvert.Types.GetPolicyResponse) => void): Request<MediaConvert.Types.GetPolicyResponse, AWSError>;
  /**
   * Retrieve the JSON for a specific preset.
   */
  getPreset(params: MediaConvert.Types.GetPresetRequest, callback?: (err: AWSError, data: MediaConvert.Types.GetPresetResponse) => void): Request<MediaConvert.Types.GetPresetResponse, AWSError>;
  /**
   * Retrieve the JSON for a specific preset.
   */
  getPreset(callback?: (err: AWSError, data: MediaConvert.Types.GetPresetResponse) => void): Request<MediaConvert.Types.GetPresetResponse, AWSError>;
  /**
   * Retrieve the JSON for a specific queue.
   */
  getQueue(params: MediaConvert.Types.GetQueueRequest, callback?: (err: AWSError, data: MediaConvert.Types.GetQueueResponse) => void): Request<MediaConvert.Types.GetQueueResponse, AWSError>;
  /**
   * Retrieve the JSON for a specific queue.
   */
  getQueue(callback?: (err: AWSError, data: MediaConvert.Types.GetQueueResponse) => void): Request<MediaConvert.Types.GetQueueResponse, AWSError>;
  /**
   * Retrieve a JSON array of up to twenty of your job templates. This will return the templates themselves, not just a list of them. To retrieve the next twenty templates, use the nextToken string returned with the array
   */
  listJobTemplates(params: MediaConvert.Types.ListJobTemplatesRequest, callback?: (err: AWSError, data: MediaConvert.Types.ListJobTemplatesResponse) => void): Request<MediaConvert.Types.ListJobTemplatesResponse, AWSError>;
  /**
   * Retrieve a JSON array of up to twenty of your job templates. This will return the templates themselves, not just a list of them. To retrieve the next twenty templates, use the nextToken string returned with the array
   */
  listJobTemplates(callback?: (err: AWSError, data: MediaConvert.Types.ListJobTemplatesResponse) => void): Request<MediaConvert.Types.ListJobTemplatesResponse, AWSError>;
  /**
   * Retrieve a JSON array of up to twenty of your most recently created jobs. This array includes in-process, completed, and errored jobs. This will return the jobs themselves, not just a list of the jobs. To retrieve the twenty next most recent jobs, use the nextToken string returned with the array.
   */
  listJobs(params: MediaConvert.Types.ListJobsRequest, callback?: (err: AWSError, data: MediaConvert.Types.ListJobsResponse) => void): Request<MediaConvert.Types.ListJobsResponse, AWSError>;
  /**
   * Retrieve a JSON array of up to twenty of your most recently created jobs. This array includes in-process, completed, and errored jobs. This will return the jobs themselves, not just a list of the jobs. To retrieve the twenty next most recent jobs, use the nextToken string returned with the array.
   */
  listJobs(callback?: (err: AWSError, data: MediaConvert.Types.ListJobsResponse) => void): Request<MediaConvert.Types.ListJobsResponse, AWSError>;
  /**
   * Retrieve a JSON array of up to twenty of your presets. This will return the presets themselves, not just a list of them. To retrieve the next twenty presets, use the nextToken string returned with the array.
   */
  listPresets(params: MediaConvert.Types.ListPresetsRequest, callback?: (err: AWSError, data: MediaConvert.Types.ListPresetsResponse) => void): Request<MediaConvert.Types.ListPresetsResponse, AWSError>;
  /**
   * Retrieve a JSON array of up to twenty of your presets. This will return the presets themselves, not just a list of them. To retrieve the next twenty presets, use the nextToken string returned with the array.
   */
  listPresets(callback?: (err: AWSError, data: MediaConvert.Types.ListPresetsResponse) => void): Request<MediaConvert.Types.ListPresetsResponse, AWSError>;
  /**
   * Retrieve a JSON array of up to twenty of your queues. This will return the queues themselves, not just a list of them. To retrieve the next twenty queues, use the nextToken string returned with the array.
   */
  listQueues(params: MediaConvert.Types.ListQueuesRequest, callback?: (err: AWSError, data: MediaConvert.Types.ListQueuesResponse) => void): Request<MediaConvert.Types.ListQueuesResponse, AWSError>;
  /**
   * Retrieve a JSON array of up to twenty of your queues. This will return the queues themselves, not just a list of them. To retrieve the next twenty queues, use the nextToken string returned with the array.
   */
  listQueues(callback?: (err: AWSError, data: MediaConvert.Types.ListQueuesResponse) => void): Request<MediaConvert.Types.ListQueuesResponse, AWSError>;
  /**
   * Retrieve the tags for a MediaConvert resource.
   */
  listTagsForResource(params: MediaConvert.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MediaConvert.Types.ListTagsForResourceResponse) => void): Request<MediaConvert.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieve the tags for a MediaConvert resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: MediaConvert.Types.ListTagsForResourceResponse) => void): Request<MediaConvert.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Create or change your policy. For more information about policies, see the user guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
   */
  putPolicy(params: MediaConvert.Types.PutPolicyRequest, callback?: (err: AWSError, data: MediaConvert.Types.PutPolicyResponse) => void): Request<MediaConvert.Types.PutPolicyResponse, AWSError>;
  /**
   * Create or change your policy. For more information about policies, see the user guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
   */
  putPolicy(callback?: (err: AWSError, data: MediaConvert.Types.PutPolicyResponse) => void): Request<MediaConvert.Types.PutPolicyResponse, AWSError>;
  /**
   * Add tags to a MediaConvert queue, preset, or job template. For information about tagging, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/tagging-resources.html
   */
  tagResource(params: MediaConvert.Types.TagResourceRequest, callback?: (err: AWSError, data: MediaConvert.Types.TagResourceResponse) => void): Request<MediaConvert.Types.TagResourceResponse, AWSError>;
  /**
   * Add tags to a MediaConvert queue, preset, or job template. For information about tagging, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/tagging-resources.html
   */
  tagResource(callback?: (err: AWSError, data: MediaConvert.Types.TagResourceResponse) => void): Request<MediaConvert.Types.TagResourceResponse, AWSError>;
  /**
   * Remove tags from a MediaConvert queue, preset, or job template. For information about tagging, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/tagging-resources.html
   */
  untagResource(params: MediaConvert.Types.UntagResourceRequest, callback?: (err: AWSError, data: MediaConvert.Types.UntagResourceResponse) => void): Request<MediaConvert.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove tags from a MediaConvert queue, preset, or job template. For information about tagging, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/tagging-resources.html
   */
  untagResource(callback?: (err: AWSError, data: MediaConvert.Types.UntagResourceResponse) => void): Request<MediaConvert.Types.UntagResourceResponse, AWSError>;
  /**
   * Modify one of your existing job templates.
   */
  updateJobTemplate(params: MediaConvert.Types.UpdateJobTemplateRequest, callback?: (err: AWSError, data: MediaConvert.Types.UpdateJobTemplateResponse) => void): Request<MediaConvert.Types.UpdateJobTemplateResponse, AWSError>;
  /**
   * Modify one of your existing job templates.
   */
  updateJobTemplate(callback?: (err: AWSError, data: MediaConvert.Types.UpdateJobTemplateResponse) => void): Request<MediaConvert.Types.UpdateJobTemplateResponse, AWSError>;
  /**
   * Modify one of your existing presets.
   */
  updatePreset(params: MediaConvert.Types.UpdatePresetRequest, callback?: (err: AWSError, data: MediaConvert.Types.UpdatePresetResponse) => void): Request<MediaConvert.Types.UpdatePresetResponse, AWSError>;
  /**
   * Modify one of your existing presets.
   */
  updatePreset(callback?: (err: AWSError, data: MediaConvert.Types.UpdatePresetResponse) => void): Request<MediaConvert.Types.UpdatePresetResponse, AWSError>;
  /**
   * Modify one of your existing queues.
   */
  updateQueue(params: MediaConvert.Types.UpdateQueueRequest, callback?: (err: AWSError, data: MediaConvert.Types.UpdateQueueResponse) => void): Request<MediaConvert.Types.UpdateQueueResponse, AWSError>;
  /**
   * Modify one of your existing queues.
   */
  updateQueue(callback?: (err: AWSError, data: MediaConvert.Types.UpdateQueueResponse) => void): Request<MediaConvert.Types.UpdateQueueResponse, AWSError>;
}
declare namespace MediaConvert {
  export type AacAudioDescriptionBroadcasterMix = "BROADCASTER_MIXED_AD"|"NORMAL"|string;
  export type AacCodecProfile = "LC"|"HEV1"|"HEV2"|string;
  export type AacCodingMode = "AD_RECEIVER_MIX"|"CODING_MODE_1_0"|"CODING_MODE_1_1"|"CODING_MODE_2_0"|"CODING_MODE_5_1"|string;
  export type AacRateControlMode = "CBR"|"VBR"|string;
  export type AacRawFormat = "LATM_LOAS"|"NONE"|string;
  export interface AacSettings {
    /**
     * Choose BROADCASTER_MIXED_AD when the input contains pre-mixed main audio + audio description (AD) as a stereo pair. The value for AudioType will be set to 3, which signals to downstream systems that this stream contains "broadcaster mixed AD". Note that the input received by the encoder must contain pre-mixed audio; the encoder does not perform the mixing. When you choose BROADCASTER_MIXED_AD, the encoder ignores any values you provide in AudioType and  FollowInputAudioType. Choose NORMAL when the input does not contain pre-mixed audio + audio description (AD). In this case, the encoder will use any values you provide for AudioType and FollowInputAudioType.
     */
    AudioDescriptionBroadcasterMix?: AacAudioDescriptionBroadcasterMix;
    /**
     * Specify the average bitrate in bits per second. The set of valid values for this setting is: 6000, 8000, 10000, 12000, 14000, 16000, 20000, 24000, 28000, 32000, 40000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 160000, 192000, 224000, 256000, 288000, 320000, 384000, 448000, 512000, 576000, 640000, 768000, 896000, 1024000. The value you set is also constrained by the values that you choose for Profile (codecProfile), Bitrate control mode (codingMode), and Sample rate (sampleRate). Default values depend on Bitrate control mode and Profile.
     */
    Bitrate?: __integerMin6000Max1024000;
    /**
     * AAC Profile.
     */
    CodecProfile?: AacCodecProfile;
    /**
     * Mono (Audio Description), Mono, Stereo, or 5.1 channel layout. Valid values depend on rate control mode and profile. "1.0 - Audio Description (Receiver Mix)" setting receives a stereo description plus control track and emits a mono AAC encode of the description track, with control data emitted in the PES header as per ETSI TS 101 154 Annex E.
     */
    CodingMode?: AacCodingMode;
    /**
     * Rate Control Mode.
     */
    RateControlMode?: AacRateControlMode;
    /**
     * Enables LATM/LOAS AAC output. Note that if you use LATM/LOAS AAC in an output, you must choose "No container" for the output container.
     */
    RawFormat?: AacRawFormat;
    /**
     * Sample rate in Hz. Valid values depend on rate control mode and profile.
     */
    SampleRate?: __integerMin8000Max96000;
    /**
     * Use MPEG-2 AAC instead of MPEG-4 AAC audio for raw or MPEG-2 Transport Stream containers.
     */
    Specification?: AacSpecification;
    /**
     * VBR Quality Level - Only used if rate_control_mode is VBR.
     */
    VbrQuality?: AacVbrQuality;
  }
  export type AacSpecification = "MPEG2"|"MPEG4"|string;
  export type AacVbrQuality = "LOW"|"MEDIUM_LOW"|"MEDIUM_HIGH"|"HIGH"|string;
  export type Ac3BitstreamMode = "COMPLETE_MAIN"|"COMMENTARY"|"DIALOGUE"|"EMERGENCY"|"HEARING_IMPAIRED"|"MUSIC_AND_EFFECTS"|"VISUALLY_IMPAIRED"|"VOICE_OVER"|string;
  export type Ac3CodingMode = "CODING_MODE_1_0"|"CODING_MODE_1_1"|"CODING_MODE_2_0"|"CODING_MODE_3_2_LFE"|string;
  export type Ac3DynamicRangeCompressionLine = "FILM_STANDARD"|"FILM_LIGHT"|"MUSIC_STANDARD"|"MUSIC_LIGHT"|"SPEECH"|"NONE"|string;
  export type Ac3DynamicRangeCompressionProfile = "FILM_STANDARD"|"NONE"|string;
  export type Ac3DynamicRangeCompressionRf = "FILM_STANDARD"|"FILM_LIGHT"|"MUSIC_STANDARD"|"MUSIC_LIGHT"|"SPEECH"|"NONE"|string;
  export type Ac3LfeFilter = "ENABLED"|"DISABLED"|string;
  export type Ac3MetadataControl = "FOLLOW_INPUT"|"USE_CONFIGURED"|string;
  export interface Ac3Settings {
    /**
     * Specify the average bitrate in bits per second. Valid bitrates depend on the coding mode.
     */
    Bitrate?: __integerMin64000Max640000;
    /**
     * Specify the bitstream mode for the AC-3 stream that the encoder emits. For more information about the AC3 bitstream mode, see ATSC A/52-2012 (Annex E).
     */
    BitstreamMode?: Ac3BitstreamMode;
    /**
     * Dolby Digital coding mode. Determines number of channels.
     */
    CodingMode?: Ac3CodingMode;
    /**
     * Sets the dialnorm for the output. If blank and input audio is Dolby Digital, dialnorm will be passed through.
     */
    Dialnorm?: __integerMin1Max31;
    /**
     * Choose the Dolby Digital dynamic range control (DRC) profile that MediaConvert uses when encoding the metadata in the Dolby Digital stream for the line operating mode. Related setting: When you use this setting, MediaConvert ignores any value you provide for Dynamic range compression profile (DynamicRangeCompressionProfile). For information about the Dolby Digital DRC operating modes and profiles, see the Dynamic Range Control chapter of the Dolby Metadata Guide at https://developer.dolby.com/globalassets/professional/documents/dolby-metadata-guide.pdf.
     */
    DynamicRangeCompressionLine?: Ac3DynamicRangeCompressionLine;
    /**
     * When you want to add Dolby dynamic range compression (DRC) signaling to your output stream, we recommend that you use the mode-specific settings instead of Dynamic range compression profile (DynamicRangeCompressionProfile). The mode-specific settings are Dynamic range compression profile, line mode (dynamicRangeCompressionLine) and Dynamic range compression profile, RF mode (dynamicRangeCompressionRf). Note that when you specify values for all three settings, MediaConvert ignores the value of this setting in favor of the mode-specific settings. If you do use this setting instead of the mode-specific settings, choose None (NONE) to leave out DRC signaling. Keep the default Film standard (FILM_STANDARD) to set the profile to Dolby's film standard profile for all operating modes.
     */
    DynamicRangeCompressionProfile?: Ac3DynamicRangeCompressionProfile;
    /**
     * Choose the Dolby Digital dynamic range control (DRC) profile that MediaConvert uses when encoding the metadata in the Dolby Digital stream for the RF operating mode. Related setting: When you use this setting, MediaConvert ignores any value you provide for Dynamic range compression profile (DynamicRangeCompressionProfile). For information about the Dolby Digital DRC operating modes and profiles, see the Dynamic Range Control chapter of the Dolby Metadata Guide at https://developer.dolby.com/globalassets/professional/documents/dolby-metadata-guide.pdf.
     */
    DynamicRangeCompressionRf?: Ac3DynamicRangeCompressionRf;
    /**
     * Applies a 120Hz lowpass filter to the LFE channel prior to encoding. Only valid with 3_2_LFE coding mode.
     */
    LfeFilter?: Ac3LfeFilter;
    /**
     * When set to FOLLOW_INPUT, encoder metadata will be sourced from the DD, DD+, or DolbyE decoder that supplied this audio data. If audio was not supplied from one of these streams, then the static metadata settings will be used.
     */
    MetadataControl?: Ac3MetadataControl;
    /**
     * This value is always 48000. It represents the sample rate in Hz.
     */
    SampleRate?: __integerMin48000Max48000;
  }
  export type AccelerationMode = "DISABLED"|"ENABLED"|"PREFERRED"|string;
  export interface AccelerationSettings {
    /**
     * Specify the conditions when the service will run your job with accelerated transcoding.
     */
    Mode: AccelerationMode;
  }
  export type AccelerationStatus = "NOT_APPLICABLE"|"IN_PROGRESS"|"ACCELERATED"|"NOT_ACCELERATED"|string;
  export type AfdSignaling = "NONE"|"AUTO"|"FIXED"|string;
  export interface AiffSettings {
    /**
     * Specify Bit depth (BitDepth), in bits per sample, to choose the encoding quality for this audio track.
     */
    BitDepth?: __integerMin16Max24;
    /**
     * Specify the number of channels in this output audio track. Valid values are 1 and even numbers up to 64. For example, 1, 2, 4, 6, and so on, up to 64.
     */
    Channels?: __integerMin1Max64;
    /**
     * Sample rate in hz.
     */
    SampleRate?: __integerMin8000Max192000;
  }
  export type AlphaBehavior = "DISCARD"|"REMAP_TO_LUMA"|string;
  export type AncillaryConvert608To708 = "UPCONVERT"|"DISABLED"|string;
  export interface AncillarySourceSettings {
    /**
     * Specify whether this set of input captions appears in your outputs in both 608 and 708 format. If you choose Upconvert (UPCONVERT), MediaConvert includes the captions data in two ways: it passes the 608 data through using the 608 compatibility bytes fields of the 708 wrapper, and it also translates the 608 data into 708.
     */
    Convert608To708?: AncillaryConvert608To708;
    /**
     * Specifies the 608 channel number in the ancillary data track from which to extract captions. Unused for passthrough.
     */
    SourceAncillaryChannelNumber?: __integerMin1Max4;
    /**
     * By default, the service terminates any unterminated captions at the end of each input. If you want the caption to continue onto your next input, disable this setting.
     */
    TerminateCaptions?: AncillaryTerminateCaptions;
  }
  export type AncillaryTerminateCaptions = "END_OF_INPUT"|"DISABLED"|string;
  export type AntiAlias = "DISABLED"|"ENABLED"|string;
  export interface AssociateCertificateRequest {
    /**
     * The ARN of the ACM certificate that you want to associate with your MediaConvert resource.
     */
    Arn: __string;
  }
  export interface AssociateCertificateResponse {
  }
  export type AudioChannelTag = "L"|"R"|"C"|"LFE"|"LS"|"RS"|"LC"|"RC"|"CS"|"LSD"|"RSD"|"TCS"|"VHL"|"VHC"|"VHR"|string;
  export interface AudioChannelTaggingSettings {
    /**
     * You can add a tag for this mono-channel audio track to mimic its placement in a multi-channel layout.  For example, if this track is the left surround channel, choose Left surround (LS).
     */
    ChannelTag?: AudioChannelTag;
  }
  export type AudioCodec = "AAC"|"MP2"|"MP3"|"WAV"|"AIFF"|"AC3"|"EAC3"|"EAC3_ATMOS"|"VORBIS"|"OPUS"|"PASSTHROUGH"|string;
  export interface AudioCodecSettings {
    /**
     * Required when you set (Codec) under (AudioDescriptions)>(CodecSettings) to the value AAC. The service accepts one of two mutually exclusive groups of AAC settings--VBR and CBR. To select one of these modes, set the value of Bitrate control mode (rateControlMode) to "VBR" or "CBR".  In VBR mode, you control the audio quality with the setting VBR quality (vbrQuality). In CBR mode, you use the setting Bitrate (bitrate). Defaults and valid values depend on the rate control mode.
     */
    AacSettings?: AacSettings;
    /**
     * Required when you set (Codec) under (AudioDescriptions)>(CodecSettings) to the value AC3.
     */
    Ac3Settings?: Ac3Settings;
    /**
     * Required when you set (Codec) under (AudioDescriptions)>(CodecSettings) to the value AIFF.
     */
    AiffSettings?: AiffSettings;
    /**
     * Choose the audio codec for this output. Note that the option Dolby Digital passthrough (PASSTHROUGH) applies only to Dolby Digital and Dolby Digital Plus audio inputs. Make sure that you choose a codec that's supported with your output container: https://docs.aws.amazon.com/mediaconvert/latest/ug/reference-codecs-containers.html#reference-codecs-containers-output-audio For audio-only outputs, make sure that both your input audio codec and your output audio codec are supported for audio-only workflows. For more information, see: https://docs.aws.amazon.com/mediaconvert/latest/ug/reference-codecs-containers-input.html#reference-codecs-containers-input-audio-only and https://docs.aws.amazon.com/mediaconvert/latest/ug/reference-codecs-containers.html#audio-only-output
     */
    Codec?: AudioCodec;
    /**
     * Required when you set (Codec) under (AudioDescriptions)>(CodecSettings) to the value EAC3_ATMOS.
     */
    Eac3AtmosSettings?: Eac3AtmosSettings;
    /**
     * Required when you set (Codec) under (AudioDescriptions)>(CodecSettings) to the value EAC3.
     */
    Eac3Settings?: Eac3Settings;
    /**
     * Required when you set (Codec) under (AudioDescriptions)>(CodecSettings) to the value MP2.
     */
    Mp2Settings?: Mp2Settings;
    /**
     * Required when you set Codec, under AudioDescriptions>CodecSettings, to the value MP3.
     */
    Mp3Settings?: Mp3Settings;
    /**
     * Required when you set Codec, under AudioDescriptions>CodecSettings, to the value OPUS.
     */
    OpusSettings?: OpusSettings;
    /**
     * Required when you set Codec, under AudioDescriptions>CodecSettings, to the value Vorbis.
     */
    VorbisSettings?: VorbisSettings;
    /**
     * Required when you set (Codec) under (AudioDescriptions)>(CodecSettings) to the value WAV.
     */
    WavSettings?: WavSettings;
  }
  export type AudioDefaultSelection = "DEFAULT"|"NOT_DEFAULT"|string;
  export interface AudioDescription {
    /**
     * When you mimic a multi-channel audio layout with multiple mono-channel tracks, you can tag each channel layout manually. For example, you would tag the tracks that contain your left, right, and center audio with Left (L), Right (R), and Center (C), respectively. When you don't specify a value, MediaConvert labels your track as Center (C) by default. To use audio layout tagging, your output must be in a QuickTime (.mov) container; your audio codec must be AAC, WAV, or AIFF; and you must set up your audio track to have only one channel.
     */
    AudioChannelTaggingSettings?: AudioChannelTaggingSettings;
    /**
     * Advanced audio normalization settings. Ignore these settings unless you need to comply with a loudness standard.
     */
    AudioNormalizationSettings?: AudioNormalizationSettings;
    /**
     * Specifies which audio data to use from each input. In the simplest case, specify an "Audio Selector":#inputs-audio_selector by name based on its order within each input. For example if you specify "Audio Selector 3", then the third audio selector will be used from each input. If an input does not have an "Audio Selector 3", then the audio selector marked as "default" in that input will be used. If there is no audio selector marked as "default", silence will be inserted for the duration of that input. Alternatively, an "Audio Selector Group":#inputs-audio_selector_group name may be specified, with similar default/silence behavior. If no audio_source_name is specified, then "Audio Selector 1" will be chosen automatically.
     */
    AudioSourceName?: __string;
    /**
     * Applies only if Follow Input Audio Type is unchecked (false). A number between 0 and 255. The following are defined in ISO-IEC 13818-1: 0 = Undefined, 1 = Clean Effects, 2 = Hearing Impaired, 3 = Visually Impaired Commentary, 4-255 = Reserved.
     */
    AudioType?: __integerMin0Max255;
    /**
     * When set to FOLLOW_INPUT, if the input contains an ISO 639 audio_type, then that value is passed through to the output. If the input contains no ISO 639 audio_type, the value in Audio Type is included in the output. Otherwise the value in Audio Type is included in the output. Note that this field and audioType are both ignored if audioDescriptionBroadcasterMix is set to BROADCASTER_MIXED_AD.
     */
    AudioTypeControl?: AudioTypeControl;
    /**
     * Settings related to audio encoding. The settings in this group vary depending on the value that you choose for your audio codec.
     */
    CodecSettings?: AudioCodecSettings;
    /**
     * Specify the language for this audio output track. The service puts this language code into your output audio track when you set Language code control (AudioLanguageCodeControl) to Use configured (USE_CONFIGURED). The service also uses your specified custom language code when you set Language code control (AudioLanguageCodeControl) to Follow input (FOLLOW_INPUT), but your input file doesn't specify a language code. For all outputs, you can use an ISO 639-2 or ISO 639-3 code. For streaming outputs, you can also use any other code in the full RFC-5646 specification. Streaming outputs are those that are in one of the following output groups: CMAF, DASH ISO, Apple HLS, or Microsoft Smooth Streaming.
     */
    CustomLanguageCode?: __stringPatternAZaZ23AZaZ;
    /**
     * Indicates the language of the audio output track. The ISO 639 language specified in the 'Language Code' drop down will be used when 'Follow Input Language Code' is not selected or when 'Follow Input Language Code' is selected but there is no ISO 639 language code specified by the input.
     */
    LanguageCode?: LanguageCode;
    /**
     * Specify which source for language code takes precedence for this audio track. When you choose Follow input (FOLLOW_INPUT), the service uses the language code from the input track if it's present. If there's no languge code on the input track, the service uses the code that you specify in the setting Language code (languageCode or customLanguageCode). When you choose Use configured (USE_CONFIGURED), the service uses the language code that you specify.
     */
    LanguageCodeControl?: AudioLanguageCodeControl;
    /**
     * Advanced audio remixing settings.
     */
    RemixSettings?: RemixSettings;
    /**
     * Specify a label for this output audio stream. For example, "English", "Director commentary", or "track_2". For streaming outputs, MediaConvert passes this information into destination manifests for display on the end-viewer's player device. For outputs in other output groups, the service ignores this setting.
     */
    StreamName?: __stringPatternWS;
  }
  export type AudioLanguageCodeControl = "FOLLOW_INPUT"|"USE_CONFIGURED"|string;
  export type AudioNormalizationAlgorithm = "ITU_BS_1770_1"|"ITU_BS_1770_2"|"ITU_BS_1770_3"|"ITU_BS_1770_4"|string;
  export type AudioNormalizationAlgorithmControl = "CORRECT_AUDIO"|"MEASURE_ONLY"|string;
  export type AudioNormalizationLoudnessLogging = "LOG"|"DONT_LOG"|string;
  export type AudioNormalizationPeakCalculation = "TRUE_PEAK"|"NONE"|string;
  export interface AudioNormalizationSettings {
    /**
     * Choose one of the following audio normalization algorithms: ITU-R BS.1770-1: Ungated loudness. A measurement of ungated average loudness for an entire piece of content, suitable for measurement of short-form content under ATSC recommendation A/85. Supports up to 5.1 audio channels. ITU-R BS.1770-2: Gated loudness. A measurement of gated average loudness compliant with the requirements of EBU-R128. Supports up to 5.1 audio channels. ITU-R BS.1770-3: Modified peak. The same loudness measurement algorithm as 1770-2, with an updated true peak measurement. ITU-R BS.1770-4: Higher channel count. Allows for more audio channels than the other algorithms, including configurations such as 7.1.
     */
    Algorithm?: AudioNormalizationAlgorithm;
    /**
     * When enabled the output audio is corrected using the chosen algorithm. If disabled, the audio will be measured but not adjusted.
     */
    AlgorithmControl?: AudioNormalizationAlgorithmControl;
    /**
     * Content measuring above this level will be corrected to the target level. Content measuring below this level will not be corrected.
     */
    CorrectionGateLevel?: __integerMinNegative70Max0;
    /**
     * If set to LOG, log each output's audio track loudness to a CSV file.
     */
    LoudnessLogging?: AudioNormalizationLoudnessLogging;
    /**
     * If set to TRUE_PEAK, calculate and log the TruePeak for each output's audio track loudness.
     */
    PeakCalculation?: AudioNormalizationPeakCalculation;
    /**
     * When you use Audio normalization (AudioNormalizationSettings), optionally use this setting to specify a target loudness. If you don't specify a value here, the encoder chooses a value for you, based on the algorithm that you choose for Algorithm (algorithm). If you choose algorithm 1770-1, the encoder will choose -24 LKFS; otherwise, the encoder will choose -23 LKFS.
     */
    TargetLkfs?: __doubleMinNegative59Max0;
  }
  export interface AudioSelector {
    /**
     * Selects a specific language code from within an audio source, using the ISO 639-2 or ISO 639-3 three-letter language code
     */
    CustomLanguageCode?: __stringMin3Max3PatternAZaZ3;
    /**
     * Enable this setting on one audio selector to set it as the default for the job. The service uses this default for outputs where it can't find the specified input audio. If you don't set a default, those outputs have no audio.
     */
    DefaultSelection?: AudioDefaultSelection;
    /**
     * Specifies audio data from an external file source.
     */
    ExternalAudioFileInput?: __stringPatternS3MM2PPWWEEBBMMMM2VVMMPPEEGGMMPP3AAVVIIMMPP4FFLLVVMMPPTTMMPPGGMM4VVTTRRPPFF4VVMM2TTSSTTSS264HH264MMKKVVMMKKAAMMOOVVMMTTSSMM2TTWWMMVVaAAASSFFVVOOBB3GGPP3GGPPPPMMXXFFDDIIVVXXXXVVIIDDRRAAWWDDVVGGXXFFMM1VV3GG2VVMMFFMM3UU8LLCCHHGGXXFFMMPPEEGG2MMXXFFMMPPEEGG2MMXXFFHHDDWWAAVVYY4MMAAAACCAAIIFFFFMMPP2AACC3EECC3DDTTSSEEAATTMMOOSSHttpsMM2VVMMPPEEGGMMPP3AAVVIIMMPP4FFLLVVMMPPTTMMPPGGMM4VVTTRRPPFF4VVMM2TTSSTTSS264HH264MMKKVVMMKKAAMMOOVVMMTTSSMM2TTWWMMVVaAAASSFFVVOOBB3GGPP3GGPPPPMMXXFFDDIIVVXXXXVVIIDDRRAAWWDDVVGGXXFFMM1VV3GG2VVMMFFMM3UU8LLCCHHGGXXFFMMPPEEGG2MMXXFFMMPPEEGG2MMXXFFHHDDWWAAVVYY4MMAAAACCAAIIFFFFMMPP2AACC3EECC3DDTTSSEEAATTMMOOSS;
    /**
     * Settings specific to audio sources in an HLS alternate rendition group. Specify the properties (renditionGroupId, renditionName or renditionLanguageCode) to identify the unique audio track among the alternative rendition groups present in the HLS manifest. If no unique track is found, or multiple tracks match the properties provided, the job fails. If no properties in hlsRenditionGroupSettings are specified, the default audio track within the video segment is chosen. If there is no audio within video segment, the alternative audio with DEFAULT=YES is chosen instead.
     */
    HlsRenditionGroupSettings?: HlsRenditionGroupSettings;
    /**
     * Selects a specific language code from within an audio source.
     */
    LanguageCode?: LanguageCode;
    /**
     * Specifies a time delta in milliseconds to offset the audio from the input video.
     */
    Offset?: __integerMinNegative2147483648Max2147483647;
    /**
     * Selects a specific PID from within an audio source (e.g. 257 selects PID 0x101).
     */
    Pids?: __listOf__integerMin1Max2147483647;
    /**
     * Use this setting for input streams that contain Dolby E, to have the service extract specific program data from the track. To select multiple programs, create multiple selectors with the same Track and different Program numbers. In the console, this setting is visible when you set Selector type to Track. Choose the program number from the dropdown list. If you are sending a JSON file, provide the program ID, which is part of the audio metadata. If your input file has incorrect metadata, you can choose All channels instead of a program number to have the service ignore the program IDs and include all the programs in the track.
     */
    ProgramSelection?: __integerMin0Max8;
    /**
     * Use these settings to reorder the audio channels of one input to match those of another input. This allows you to combine the two files into a single output, one after the other.
     */
    RemixSettings?: RemixSettings;
    /**
     * Specifies the type of the audio selector.
     */
    SelectorType?: AudioSelectorType;
    /**
     * Identify a track from the input audio to include in this selector by entering the track index number. To include several tracks in a single audio selector, specify multiple tracks as follows. Using the console, enter a comma-separated list. For examle, type "1,2,3" to include tracks 1 through 3. Specifying directly in your JSON job file, provide the track numbers in an array. For example, "tracks": [1,2,3].
     */
    Tracks?: __listOf__integerMin1Max2147483647;
  }
  export interface AudioSelectorGroup {
    /**
     * Name of an Audio Selector within the same input to include in the group.  Audio selector names are standardized, based on their order within the input (e.g., "Audio Selector 1"). The audio selector name parameter can be repeated to add any number of audio selectors to the group.
     */
    AudioSelectorNames?: __listOf__stringMin1;
  }
  export type AudioSelectorType = "PID"|"TRACK"|"LANGUAGE_CODE"|"HLS_RENDITION_GROUP"|string;
  export type AudioTypeControl = "FOLLOW_INPUT"|"USE_CONFIGURED"|string;
  export interface AutomatedAbrSettings {
    /**
     * Optional. The maximum target bit rate used in your automated ABR stack. Use this value to set an upper limit on the bandwidth consumed by the highest-quality rendition. This is the rendition that is delivered to viewers with the fastest internet connections. If you don't specify a value, MediaConvert uses 8,000,000 (8 mb/s) by default.
     */
    MaxAbrBitrate?: __integerMin100000Max100000000;
    /**
     * Optional. The maximum number of renditions that MediaConvert will create in your automated ABR stack. The number of renditions is determined automatically, based on analysis of each job, but will never exceed this limit. When you set this to Auto in the console, which is equivalent to excluding it from your JSON job specification, MediaConvert defaults to a limit of 15.
     */
    MaxRenditions?: __integerMin3Max15;
    /**
     * Optional. The minimum target bitrate used in your automated ABR stack. Use this value to set a lower limit on the bitrate of video delivered to viewers with slow internet connections. If you don't specify a value, MediaConvert uses 600,000 (600 kb/s) by default.
     */
    MinAbrBitrate?: __integerMin100000Max100000000;
  }
  export interface AutomatedEncodingSettings {
    /**
     * Use automated ABR to have MediaConvert set up the renditions in your ABR package for you automatically, based on characteristics of your input video. This feature optimizes video quality while minimizing the overall size of your ABR package.
     */
    AbrSettings?: AutomatedAbrSettings;
  }
  export type Av1AdaptiveQuantization = "OFF"|"LOW"|"MEDIUM"|"HIGH"|"HIGHER"|"MAX"|string;
  export type Av1FramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type Av1FramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export interface Av1QvbrSettings {
    /**
     * Use this setting only when you set Rate control mode (RateControlMode) to QVBR. Specify the target quality level for this output. MediaConvert determines the right number of bits to use for each part of the video to maintain the video quality that you specify. When you keep the default value, AUTO, MediaConvert picks a quality level for you, based on characteristics of your input video. If you prefer to specify a quality level, specify a number from 1 through 10. Use higher numbers for greater quality. Level 10 results in nearly lossless compression. The quality level for most broadcast-quality transcodes is between 6 and 9. Optionally, to specify a value between whole numbers, also provide a value for the setting qvbrQualityLevelFineTune. For example, if you want your QVBR quality level to be 7.33, set qvbrQualityLevel to 7 and set qvbrQualityLevelFineTune to .33.
     */
    QvbrQualityLevel?: __integerMin1Max10;
    /**
     * Optional. Specify a value here to set the QVBR quality to a level that is between whole numbers. For example, if you want your QVBR quality level to be 7.33, set qvbrQualityLevel to 7 and set qvbrQualityLevelFineTune to .33. MediaConvert rounds your QVBR quality level to the nearest third of a whole number. For example, if you set qvbrQualityLevel to 7 and you set qvbrQualityLevelFineTune to .25, your actual QVBR quality level is 7.33.
     */
    QvbrQualityLevelFineTune?: __doubleMin0Max1;
  }
  export type Av1RateControlMode = "QVBR"|string;
  export interface Av1Settings {
    /**
     * Specify the strength of any adaptive quantization filters that you enable. The value that you choose here applies to Spatial adaptive quantization (spatialAdaptiveQuantization).
     */
    AdaptiveQuantization?: Av1AdaptiveQuantization;
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: Av1FramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: Av1FramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max2147483647;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin1Max2147483647;
    /**
     * Specify the GOP length (keyframe interval) in frames. With AV1, MediaConvert doesn't support GOP length in seconds. This value must be greater than zero and preferably equal to 1 + ((numberBFrames + 1) * x), where x is an integer value.
     */
    GopSize?: __doubleMin0;
    /**
     * Maximum bitrate in bits/second. For example, enter five megabits per second as 5000000. Required when Rate control mode is QVBR.
     */
    MaxBitrate?: __integerMin1000Max1152000000;
    /**
     * Specify from the number of B-frames, in the range of 0-15. For AV1 encoding, we recommend using 7 or 15. Choose a larger number for a lower bitrate and smaller file size; choose a smaller number for better video quality.
     */
    NumberBFramesBetweenReferenceFrames?: __integerMin0Max15;
    /**
     * Settings for quality-defined variable bitrate encoding with the H.265 codec. Use these settings only when you set QVBR for Rate control mode (RateControlMode).
     */
    QvbrSettings?: Av1QvbrSettings;
    /**
     * 'With AV1 outputs, for rate control mode, MediaConvert supports only quality-defined variable bitrate (QVBR). You can''t use CBR or VBR.'
     */
    RateControlMode?: Av1RateControlMode;
    /**
     * Specify the number of slices per picture. This value must be 1, 2, 4, 8, 16, or 32. For progressive pictures, this value must be less than or equal to the number of macroblock rows. For interlaced pictures, this value must be less than or equal to half the number of macroblock rows.
     */
    Slices?: __integerMin1Max32;
    /**
     * Keep the default value, Enabled (ENABLED), to adjust quantization within each frame based on spatial variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas that can sustain more distortion with no noticeable visual degradation and uses more bits on areas where any small distortion will be noticeable. For example, complex textured blocks are encoded with fewer bits and smooth textured blocks are encoded with more bits. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen with a lot of complex texture, you might choose to disable this feature. Related setting: When you enable spatial adaptive quantization, set the value for Adaptive quantization (adaptiveQuantization) depending on your content. For homogeneous content, such as cartoons and video games, set it to Low. For content with a wider variety of textures, set it to High or Higher.
     */
    SpatialAdaptiveQuantization?: Av1SpatialAdaptiveQuantization;
  }
  export type Av1SpatialAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export interface AvailBlanking {
    /**
     * Blanking image to be used. Leave empty for solid black. Only bmp and png images are supported.
     */
    AvailBlankingImage?: __stringMin14PatternS3BmpBMPPngPNGHttpsBmpBMPPngPNG;
  }
  export type AvcIntraClass = "CLASS_50"|"CLASS_100"|"CLASS_200"|"CLASS_4K_2K"|string;
  export type AvcIntraFramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type AvcIntraFramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type AvcIntraInterlaceMode = "PROGRESSIVE"|"TOP_FIELD"|"BOTTOM_FIELD"|"FOLLOW_TOP_FIELD"|"FOLLOW_BOTTOM_FIELD"|string;
  export type AvcIntraScanTypeConversionMode = "INTERLACED"|"INTERLACED_OPTIMIZE"|string;
  export interface AvcIntraSettings {
    /**
     * Specify the AVC-Intra class of your output. The AVC-Intra class selection determines the output video bit rate depending on the frame rate of the output. Outputs with higher class values have higher bitrates and improved image quality. Note that for Class 4K/2K, MediaConvert supports only 4:2:2 chroma subsampling.
     */
    AvcIntraClass?: AvcIntraClass;
    /**
     * Optional when you set AVC-Intra class (avcIntraClass) to Class 4K/2K (CLASS_4K_2K). When you set AVC-Intra class to a different value, this object isn't allowed.
     */
    AvcIntraUhdSettings?: AvcIntraUhdSettings;
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: AvcIntraFramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: AvcIntraFramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max1001;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin24Max60000;
    /**
     * Choose the scan line type for the output. Keep the default value, Progressive (PROGRESSIVE) to create a progressive output, regardless of the scan type of your input. Use Top field first (TOP_FIELD) or Bottom field first (BOTTOM_FIELD) to create an output that's interlaced with the same field polarity throughout. Use Follow, default top (FOLLOW_TOP_FIELD) or Follow, default bottom (FOLLOW_BOTTOM_FIELD) to produce outputs with the same field polarity as the source. For jobs that have multiple inputs, the output field polarity might change over the course of the output. Follow behavior depends on the input scan type. If the source is interlaced, the output will be interlaced with the same polarity as the source. If the source is progressive, the output will be interlaced with top field bottom field first, depending on which of the Follow options you choose.
     */
    InterlaceMode?: AvcIntraInterlaceMode;
    /**
     * Use this setting for interlaced outputs, when your output frame rate is half of your input frame rate. In this situation, choose Optimized interlacing (INTERLACED_OPTIMIZE) to create a better quality interlaced output. In this case, each progressive frame from the input corresponds to an interlaced field in the output. Keep the default value, Basic interlacing (INTERLACED), for all other output frame rates. With basic interlacing, MediaConvert performs any frame rate conversion first and then interlaces the frames. When you choose Optimized interlacing and you set your output frame rate to a value that isn't suitable for optimized interlacing, MediaConvert automatically falls back to basic interlacing. Required settings: To use optimized interlacing, you must set Telecine (telecine) to None (NONE) or Soft (SOFT). You can't use optimized interlacing for hard telecine outputs. You must also set Interlace mode (interlaceMode) to a value other than Progressive (PROGRESSIVE).
     */
    ScanTypeConversionMode?: AvcIntraScanTypeConversionMode;
    /**
     * Ignore this setting unless your input frame rate is 23.976 or 24 frames per second (fps). Enable slow PAL to create a 25 fps output. When you enable slow PAL, MediaConvert relabels the video frames to 25 fps and resamples your audio to keep it synchronized with the video. Note that enabling this setting will slightly reduce the duration of your video. Required settings: You must also set Framerate to 25. In your JSON job specification, set (framerateControl) to (SPECIFIED), (framerateNumerator) to 25 and (framerateDenominator) to 1.
     */
    SlowPal?: AvcIntraSlowPal;
    /**
     * When you do frame rate conversion from 23.976 frames per second (fps) to 29.97 fps, and your output scan type is interlaced, you can optionally enable hard telecine (HARD) to create a smoother picture. When you keep the default value, None (NONE), MediaConvert does a standard frame rate conversion to 29.97 without doing anything with the field polarity to create a smoother picture.
     */
    Telecine?: AvcIntraTelecine;
  }
  export type AvcIntraSlowPal = "DISABLED"|"ENABLED"|string;
  export type AvcIntraTelecine = "NONE"|"HARD"|string;
  export type AvcIntraUhdQualityTuningLevel = "SINGLE_PASS"|"MULTI_PASS"|string;
  export interface AvcIntraUhdSettings {
    /**
     * Optional. Use Quality tuning level (qualityTuningLevel) to choose how many transcoding passes MediaConvert does with your video. When you choose Multi-pass (MULTI_PASS), your video quality is better and your output bitrate is more accurate. That is, the actual bitrate of your output is closer to the target bitrate defined in the specification. When you choose Single-pass (SINGLE_PASS), your encoding time is faster. The default behavior is Single-pass (SINGLE_PASS).
     */
    QualityTuningLevel?: AvcIntraUhdQualityTuningLevel;
  }
  export type BillingTagsSource = "QUEUE"|"PRESET"|"JOB_TEMPLATE"|"JOB"|string;
  export type BurnInSubtitleStylePassthrough = "ENABLED"|"DISABLED"|string;
  export interface BurninDestinationSettings {
    /**
     * Specify the alignment of your captions. If no explicit x_position is provided, setting alignment to centered will placethe captions at the bottom center of the output. Similarly, setting a left alignment willalign captions to the bottom left of the output. If x and y positions are given in conjunction with the alignment parameter, the font will be justified (either left or centered) relative to those coordinates.
     */
    Alignment?: BurninSubtitleAlignment;
    /**
     * Ignore this setting unless Style passthrough (StylePassthrough) is set to Enabled and Font color (FontColor) set to Black, Yellow, Red, Green, Blue, or Hex. Use Apply font color (ApplyFontColor) for additional font color controls. When you choose White text only (WHITE_TEXT_ONLY), or leave blank, your font color setting only applies to white text in your input captions. For example, if your font color setting is Yellow, and your input captions have red and white text, your output captions will have red and yellow text. When you choose ALL_TEXT, your font color setting applies to all of your output captions text.
     */
    ApplyFontColor?: BurninSubtitleApplyFontColor;
    /**
     * Specify the color of the rectangle behind the captions. Leave background color (BackgroundColor) blank and set Style passthrough (StylePassthrough) to enabled to use the background color data from your input captions, if present.
     */
    BackgroundColor?: BurninSubtitleBackgroundColor;
    /**
     * Specify the opacity of the background rectangle. Enter a value from 0 to 255, where 0 is transparent and 255 is opaque. If Style passthrough (StylePassthrough) is set to enabled, leave blank to pass through the background style information in your input captions to your output captions. If Style passthrough is set to disabled, leave blank to use a value of 0 and remove all backgrounds from your output captions.
     */
    BackgroundOpacity?: __integerMin0Max255;
    /**
     * Specify the font that you want the service to use for your burn in captions when your input captions specify a font that MediaConvert doesn't support. When you set Fallback font (FallbackFont) to best match (BEST_MATCH), or leave blank, MediaConvert uses a supported font that most closely matches the font that your input captions specify. When there are multiple unsupported fonts in your input captions, MediaConvert matches each font with the supported font that matches best. When you explicitly choose a replacement font, MediaConvert uses that font to replace all unsupported fonts from your input.
     */
    FallbackFont?: BurninSubtitleFallbackFont;
    /**
     * Specify the color of the burned-in captions text. Leave Font color (FontColor) blank and set Style passthrough (StylePassthrough) to enabled to use the font color data from your input captions, if present.
     */
    FontColor?: BurninSubtitleFontColor;
    /**
     * Specify the opacity of the burned-in captions. 255 is opaque; 0 is transparent.
     */
    FontOpacity?: __integerMin0Max255;
    /**
     * Specify the Font resolution (FontResolution) in DPI (dots per inch).
     */
    FontResolution?: __integerMin96Max600;
    /**
     * Set Font script (FontScript) to Automatically determined (AUTOMATIC), or leave blank, to automatically determine the font script in your input captions. Otherwise, set to Simplified Chinese (HANS) or Traditional Chinese (HANT) if your input font script uses Simplified or Traditional Chinese.
     */
    FontScript?: FontScript;
    /**
     * Specify the Font size (FontSize) in pixels. Must be a positive integer. Set to 0, or leave blank, for automatic font size.
     */
    FontSize?: __integerMin0Max96;
    /**
     * Ignore this setting unless your Font color is set to Hex. Enter either six or eight hexidecimal digits, representing red, green, and blue, with two optional extra digits for alpha. For example a value of 1122AABB is a red value of 0x11, a green value of 0x22, a blue value of 0xAA, and an alpha value of 0xBB.
     */
    HexFontColor?: __stringMin6Max8Pattern09aFAF609aFAF2;
    /**
     * Specify font outline color. Leave Outline color (OutlineColor) blank and set Style passthrough (StylePassthrough) to enabled to use the font outline color data from your input captions, if present.
     */
    OutlineColor?: BurninSubtitleOutlineColor;
    /**
     * Specify the Outline size (OutlineSize) of the caption text, in pixels. Leave Outline size blank and set Style passthrough (StylePassthrough) to enabled to use the outline size data from your input captions, if present.
     */
    OutlineSize?: __integerMin0Max10;
    /**
     * Specify the color of the shadow cast by the captions. Leave Shadow color (ShadowColor) blank and set Style passthrough (StylePassthrough) to enabled to use the shadow color data from your input captions, if present.
     */
    ShadowColor?: BurninSubtitleShadowColor;
    /**
     * Specify the opacity of the shadow. Enter a value from 0 to 255, where 0 is transparent and 255 is opaque. If Style passthrough (StylePassthrough) is set to Enabled, leave Shadow opacity (ShadowOpacity) blank to pass through the shadow style information in your input captions to your output captions. If Style passthrough is set to disabled, leave blank to use a value of 0 and remove all shadows from your output captions.
     */
    ShadowOpacity?: __integerMin0Max255;
    /**
     * Specify the horizontal offset of the shadow, relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels to the left.
     */
    ShadowXOffset?: __integerMinNegative2147483648Max2147483647;
    /**
     * Specify the vertical offset of the shadow relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels above the text. Leave Shadow y-offset (ShadowYOffset) blank and set Style passthrough (StylePassthrough) to enabled to use the shadow y-offset data from your input captions, if present.
     */
    ShadowYOffset?: __integerMinNegative2147483648Max2147483647;
    /**
     * Set Style passthrough (StylePassthrough) to ENABLED to use the available style, color, and position information from your input captions. MediaConvert uses default settings for any missing style and position information in your input captions. Set Style passthrough to DISABLED, or leave blank, to ignore the style and position information from your input captions and use default settings: white text with black outlining, bottom-center positioning, and automatic sizing. Whether you set Style passthrough to enabled or not, you can also choose to manually override any of the individual style and position settings.
     */
    StylePassthrough?: BurnInSubtitleStylePassthrough;
    /**
     * Specify whether the text spacing (TeletextSpacing) in your captions is set by the captions grid, or varies depending on letter width. Choose fixed grid (FIXED_GRID) to conform to the spacing specified in the captions file more accurately. Choose proportional (PROPORTIONAL) to make the text easier to read for closed captions.
     */
    TeletextSpacing?: BurninSubtitleTeletextSpacing;
    /**
     * Specify the horizontal position (XPosition) of the captions, relative to the left side of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the left of the output. If no explicit x_position is provided, the horizontal caption position will be determined by the alignment parameter.
     */
    XPosition?: __integerMin0Max2147483647;
    /**
     * Specify the vertical position (YPosition) of the captions, relative to the top of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the top of the output. If no explicit y_position is provided, the caption will be positioned towards the bottom of the output.
     */
    YPosition?: __integerMin0Max2147483647;
  }
  export type BurninSubtitleAlignment = "CENTERED"|"LEFT"|"AUTO"|string;
  export type BurninSubtitleApplyFontColor = "WHITE_TEXT_ONLY"|"ALL_TEXT"|string;
  export type BurninSubtitleBackgroundColor = "NONE"|"BLACK"|"WHITE"|"AUTO"|string;
  export type BurninSubtitleFallbackFont = "BEST_MATCH"|"MONOSPACED_SANSSERIF"|"MONOSPACED_SERIF"|"PROPORTIONAL_SANSSERIF"|"PROPORTIONAL_SERIF"|string;
  export type BurninSubtitleFontColor = "WHITE"|"BLACK"|"YELLOW"|"RED"|"GREEN"|"BLUE"|"HEX"|"AUTO"|string;
  export type BurninSubtitleOutlineColor = "BLACK"|"WHITE"|"YELLOW"|"RED"|"GREEN"|"BLUE"|"AUTO"|string;
  export type BurninSubtitleShadowColor = "NONE"|"BLACK"|"WHITE"|"AUTO"|string;
  export type BurninSubtitleTeletextSpacing = "FIXED_GRID"|"PROPORTIONAL"|"AUTO"|string;
  export interface CancelJobRequest {
    /**
     * The Job ID of the job to be cancelled.
     */
    Id: __string;
  }
  export interface CancelJobResponse {
  }
  export interface CaptionDescription {
    /**
     * Specifies which "Caption Selector":#inputs-caption_selector to use from each input when generating captions. The name should be of the format "Caption Selector ", which denotes that the Nth Caption Selector will be used from each input.
     */
    CaptionSelectorName?: __stringMin1;
    /**
     * Specify the language for this captions output track. For most captions output formats, the encoder puts this language information in the output captions metadata. If your output captions format is DVB-Sub or Burn in, the encoder uses this language information when automatically selecting the font script for rendering the captions text. For all outputs, you can use an ISO 639-2 or ISO 639-3 code. For streaming outputs, you can also use any other code in the full RFC-5646 specification. Streaming outputs are those that are in one of the following output groups: CMAF, DASH ISO, Apple HLS, or Microsoft Smooth Streaming.
     */
    CustomLanguageCode?: __stringPatternAZaZ23AZaZ;
    /**
     * Settings related to one captions tab on the MediaConvert console. In your job JSON, an instance of captions DestinationSettings is equivalent to one captions tab in the console. Usually, one captions tab corresponds to one output captions track. Depending on your output captions format, one tab might correspond to a set of output captions tracks. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/including-captions.html.
     */
    DestinationSettings?: CaptionDestinationSettings;
    /**
     * Specify the language of this captions output track. For most captions output formats, the encoder puts this language information in the output captions metadata. If your output captions format is DVB-Sub or Burn in, the encoder uses this language information to choose the font language for rendering the captions text.
     */
    LanguageCode?: LanguageCode;
    /**
     * Specify a label for this set of output captions. For example, "English", "Director commentary", or "track_2". For streaming outputs, MediaConvert passes this information into destination manifests for display on the end-viewer's player device. For outputs in other output groups, the service ignores this setting.
     */
    LanguageDescription?: __string;
  }
  export interface CaptionDescriptionPreset {
    /**
     * Specify the language for this captions output track. For most captions output formats, the encoder puts this language information in the output captions metadata. If your output captions format is DVB-Sub or Burn in, the encoder uses this language information when automatically selecting the font script for rendering the captions text. For all outputs, you can use an ISO 639-2 or ISO 639-3 code. For streaming outputs, you can also use any other code in the full RFC-5646 specification. Streaming outputs are those that are in one of the following output groups: CMAF, DASH ISO, Apple HLS, or Microsoft Smooth Streaming.
     */
    CustomLanguageCode?: __stringPatternAZaZ23AZaZ;
    /**
     * Settings related to one captions tab on the MediaConvert console. In your job JSON, an instance of captions DestinationSettings is equivalent to one captions tab in the console. Usually, one captions tab corresponds to one output captions track. Depending on your output captions format, one tab might correspond to a set of output captions tracks. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/including-captions.html.
     */
    DestinationSettings?: CaptionDestinationSettings;
    /**
     * Specify the language of this captions output track. For most captions output formats, the encoder puts this language information in the output captions metadata. If your output captions format is DVB-Sub or Burn in, the encoder uses this language information to choose the font language for rendering the captions text.
     */
    LanguageCode?: LanguageCode;
    /**
     * Specify a label for this set of output captions. For example, "English", "Director commentary", or "track_2". For streaming outputs, MediaConvert passes this information into destination manifests for display on the end-viewer's player device. For outputs in other output groups, the service ignores this setting.
     */
    LanguageDescription?: __string;
  }
  export interface CaptionDestinationSettings {
    /**
     * Burn-in is a captions delivery method, rather than a captions format. Burn-in writes the captions directly on your video frames, replacing pixels of video content with the captions. Set up burn-in captions in the same output as your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/burn-in-output-captions.html. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to BURN_IN.
     */
    BurninDestinationSettings?: BurninDestinationSettings;
    /**
     * Specify the format for this set of captions on this output. The default format is embedded without SCTE-20. Note that your choice of video output container constrains your choice of output captions format. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/captions-support-tables.html. If you are using SCTE-20 and you want to create an output that complies with the SCTE-43 spec, choose SCTE-20 plus embedded (SCTE20_PLUS_EMBEDDED). To create a non-compliant output where the embedded captions come first, choose Embedded plus SCTE-20 (EMBEDDED_PLUS_SCTE20).
     */
    DestinationType?: CaptionDestinationType;
    /**
     * Settings related to DVB-Sub captions. Set up DVB-Sub captions in the same output as your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/dvb-sub-output-captions.html. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to DVB_SUB.
     */
    DvbSubDestinationSettings?: DvbSubDestinationSettings;
    /**
     * Settings related to CEA/EIA-608 and CEA/EIA-708 (also called embedded or ancillary) captions. Set up embedded captions in the same output as your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/embedded-output-captions.html. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to EMBEDDED, EMBEDDED_PLUS_SCTE20, or SCTE20_PLUS_EMBEDDED.
     */
    EmbeddedDestinationSettings?: EmbeddedDestinationSettings;
    /**
     * Settings related to IMSC captions. IMSC is a sidecar format that holds captions in a file that is separate from the video container. Set up sidecar captions in the same output group, but different output from your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/ttml-and-webvtt-output-captions.html. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to IMSC.
     */
    ImscDestinationSettings?: ImscDestinationSettings;
    /**
     * Settings related to SCC captions. SCC is a sidecar format that holds captions in a file that is separate from the video container. Set up sidecar captions in the same output group, but different output from your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/scc-srt-output-captions.html. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to SCC.
     */
    SccDestinationSettings?: SccDestinationSettings;
    /**
     * Settings related to SRT captions. SRT is a sidecar format that holds captions in a file that is separate from the video container. Set up sidecar captions in the same output group, but different output from your video. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to SRT.
     */
    SrtDestinationSettings?: SrtDestinationSettings;
    /**
     * Settings related to teletext captions. Set up teletext captions in the same output as your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/teletext-output-captions.html. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to TELETEXT.
     */
    TeletextDestinationSettings?: TeletextDestinationSettings;
    /**
     * Settings related to TTML captions. TTML is a sidecar format that holds captions in a file that is separate from the video container. Set up sidecar captions in the same output group, but different output from your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/ttml-and-webvtt-output-captions.html. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to TTML.
     */
    TtmlDestinationSettings?: TtmlDestinationSettings;
    /**
     * Settings related to WebVTT captions. WebVTT is a sidecar format that holds captions in a file that is separate from the video container. Set up sidecar captions in the same output group, but different output from your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/ttml-and-webvtt-output-captions.html. When you work directly in your JSON job specification, include this object and any required children when you set destinationType to WebVTT.
     */
    WebvttDestinationSettings?: WebvttDestinationSettings;
  }
  export type CaptionDestinationType = "BURN_IN"|"DVB_SUB"|"EMBEDDED"|"EMBEDDED_PLUS_SCTE20"|"IMSC"|"SCTE20_PLUS_EMBEDDED"|"SCC"|"SRT"|"SMI"|"TELETEXT"|"TTML"|"WEBVTT"|string;
  export interface CaptionSelector {
    /**
     * The specific language to extract from source, using the ISO 639-2 or ISO 639-3 three-letter language code. If input is SCTE-27, complete this field and/or PID to select the caption language to extract. If input is DVB-Sub and output is Burn-in or SMPTE-TT, complete this field and/or PID to select the caption language to extract. If input is DVB-Sub that is being passed through, omit this field (and PID field); there is no way to extract a specific language with pass-through captions.
     */
    CustomLanguageCode?: __stringMin3Max3PatternAZaZ3;
    /**
     * The specific language to extract from source. If input is SCTE-27, complete this field and/or PID to select the caption language to extract. If input is DVB-Sub and output is Burn-in or SMPTE-TT, complete this field and/or PID to select the caption language to extract. If input is DVB-Sub that is being passed through, omit this field (and PID field); there is no way to extract a specific language with pass-through captions.
     */
    LanguageCode?: LanguageCode;
    /**
     * If your input captions are SCC, TTML, STL, SMI, SRT, or IMSC in an xml file, specify the URI of the input captions source file. If your input captions are IMSC in an IMF package, use TrackSourceSettings instead of FileSoureSettings.
     */
    SourceSettings?: CaptionSourceSettings;
  }
  export interface CaptionSourceFramerate {
    /**
     * Specify the denominator of the fraction that represents the frame rate for the setting Caption source frame rate (CaptionSourceFramerate). Use this setting along with the setting Framerate numerator (framerateNumerator).
     */
    FramerateDenominator?: __integerMin1Max1001;
    /**
     * Specify the numerator of the fraction that represents the frame rate for the setting Caption source frame rate (CaptionSourceFramerate). Use this setting along with the setting Framerate denominator (framerateDenominator).
     */
    FramerateNumerator?: __integerMin1Max60000;
  }
  export interface CaptionSourceSettings {
    /**
     * Settings for ancillary captions source.
     */
    AncillarySourceSettings?: AncillarySourceSettings;
    /**
     * DVB Sub Source Settings
     */
    DvbSubSourceSettings?: DvbSubSourceSettings;
    /**
     * Settings for embedded captions Source
     */
    EmbeddedSourceSettings?: EmbeddedSourceSettings;
    /**
     * If your input captions are SCC, SMI, SRT, STL, TTML, WebVTT, or IMSC 1.1 in an xml file, specify the URI of the input caption source file. If your caption source is IMSC in an IMF package, use TrackSourceSettings instead of FileSoureSettings.
     */
    FileSourceSettings?: FileSourceSettings;
    /**
     * Use Source (SourceType) to identify the format of your input captions.  The service cannot auto-detect caption format.
     */
    SourceType?: CaptionSourceType;
    /**
     * Settings specific to Teletext caption sources, including Page number.
     */
    TeletextSourceSettings?: TeletextSourceSettings;
    /**
     * Settings specific to caption sources that are specified by track number. Currently, this is only IMSC captions in an IMF package. If your caption source is IMSC 1.1 in a separate xml file, use FileSourceSettings instead of TrackSourceSettings.
     */
    TrackSourceSettings?: TrackSourceSettings;
    /**
     * Settings specific to WebVTT sources in HLS alternative rendition group. Specify the properties (renditionGroupId, renditionName or renditionLanguageCode) to identify the unique subtitle track among the alternative rendition groups present in the HLS manifest. If no unique track is found, or multiple tracks match the specified properties, the job fails. If there is only one subtitle track in the rendition group, the settings can be left empty and the default subtitle track will be chosen. If your caption source is a sidecar file, use FileSourceSettings instead of WebvttHlsSourceSettings.
     */
    WebvttHlsSourceSettings?: WebvttHlsSourceSettings;
  }
  export type CaptionSourceType = "ANCILLARY"|"DVB_SUB"|"EMBEDDED"|"SCTE20"|"SCC"|"TTML"|"STL"|"SRT"|"SMI"|"SMPTE_TT"|"TELETEXT"|"NULL_SOURCE"|"IMSC"|"WEBVTT"|string;
  export interface ChannelMapping {
    /**
     * In your JSON job specification, include one child of OutputChannels for each audio channel that you want in your output. Each child should contain one instance of InputChannels or InputChannelsFineTune.
     */
    OutputChannels?: __listOfOutputChannelMapping;
  }
  export interface CmafAdditionalManifest {
    /**
     * Specify a name modifier that the service adds to the name of this manifest to make it different from the file names of the other main manifests in the output group. For example, say that the default main manifest for your HLS group is film-name.m3u8. If you enter "-no-premium" for this setting, then the file name the service generates for this top-level manifest is film-name-no-premium.m3u8. For HLS output groups, specify a manifestNameModifier that is different from the nameModifier of the output. The service uses the output name modifier to create unique names for the individual variant manifests.
     */
    ManifestNameModifier?: __stringMin1;
    /**
     * Specify the outputs that you want this additional top-level manifest to reference.
     */
    SelectedOutputs?: __listOf__stringMin1;
  }
  export type CmafClientCache = "DISABLED"|"ENABLED"|string;
  export type CmafCodecSpecification = "RFC_6381"|"RFC_4281"|string;
  export interface CmafEncryptionSettings {
    /**
     * This is a 128-bit, 16-byte hex value represented by a 32-character text string. If this parameter is not set then the Initialization Vector will follow the segment number by default.
     */
    ConstantInitializationVector?: __stringMin32Max32Pattern09aFAF32;
    /**
     * Specify the encryption scheme that you want the service to use when encrypting your CMAF segments. Choose AES-CBC subsample (SAMPLE-AES) or AES_CTR (AES-CTR).
     */
    EncryptionMethod?: CmafEncryptionType;
    /**
     * When you use DRM with CMAF outputs, choose whether the service writes the 128-bit encryption initialization vector in the HLS and DASH manifests.
     */
    InitializationVectorInManifest?: CmafInitializationVectorInManifest;
    /**
     * If your output group type is CMAF, use these settings when doing DRM encryption with a SPEKE-compliant key provider. If your output group type is HLS, DASH, or Microsoft Smooth, use the SpekeKeyProvider settings instead.
     */
    SpekeKeyProvider?: SpekeKeyProviderCmaf;
    /**
     * Use these settings to set up encryption with a static key provider.
     */
    StaticKeyProvider?: StaticKeyProvider;
    /**
     * Specify whether your DRM encryption key is static or from a key provider that follows the SPEKE standard. For more information about SPEKE, see https://docs.aws.amazon.com/speke/latest/documentation/what-is-speke.html.
     */
    Type?: CmafKeyProviderType;
  }
  export type CmafEncryptionType = "SAMPLE_AES"|"AES_CTR"|string;
  export interface CmafGroupSettings {
    /**
     * By default, the service creates one top-level .m3u8 HLS manifest and one top -level .mpd DASH manifest for each CMAF output group in your job. These default manifests reference every output in the output group. To create additional top-level manifests that reference a subset of the outputs in the output group, specify a list of them here. For each additional manifest that you specify, the service creates one HLS manifest and one DASH manifest.
     */
    AdditionalManifests?: __listOfCmafAdditionalManifest;
    /**
     * A partial URI prefix that will be put in the manifest file at the top level BaseURL element. Can be used if streams are delivered from a different URL than the manifest file.
     */
    BaseUrl?: __string;
    /**
     * Disable this setting only when your workflow requires the #EXT-X-ALLOW-CACHE:no tag. Otherwise, keep the default value Enabled (ENABLED) and control caching in your video distribution set up. For example, use the Cache-Control http header.
     */
    ClientCache?: CmafClientCache;
    /**
     * Specification to use (RFC-6381 or the default RFC-4281) during m3u8 playlist generation.
     */
    CodecSpecification?: CmafCodecSpecification;
    /**
     * Use Destination (Destination) to specify the S3 output location and the output filename base. Destination accepts format identifiers. If you do not specify the base filename in the URI, the service will use the filename of the input file. If your job has multiple inputs, the service uses the filename of the first input file.
     */
    Destination?: __stringPatternS3;
    /**
     * Settings associated with the destination. Will vary based on the type of destination
     */
    DestinationSettings?: DestinationSettings;
    /**
     * DRM settings.
     */
    Encryption?: CmafEncryptionSettings;
    /**
     * Specify the length, in whole seconds, of the mp4 fragments. When you don't specify a value, MediaConvert defaults to 2. Related setting: Use Fragment length control (FragmentLengthControl) to specify whether the encoder enforces this value strictly.
     */
    FragmentLength?: __integerMin1Max2147483647;
    /**
     * Specify whether MediaConvert generates images for trick play. Keep the default value, None (NONE), to not generate any images. Choose Thumbnail (THUMBNAIL) to generate tiled thumbnails. Choose Thumbnail and full frame (THUMBNAIL_AND_FULLFRAME) to generate tiled thumbnails and full-resolution images of single frames. When you enable Write HLS manifest (WriteHlsManifest), MediaConvert creates a child manifest for each set of images that you generate and adds corresponding entries to the parent manifest. When you enable Write DASH manifest (WriteDashManifest), MediaConvert adds an entry in the .mpd manifest for each set of images that you generate. A common application for these images is Roku trick mode. The thumbnails and full-frame images that MediaConvert creates with this feature are compatible with this Roku specification: https://developer.roku.com/docs/developer-program/media-playback/trick-mode/hls-and-dash.md
     */
    ImageBasedTrickPlay?: CmafImageBasedTrickPlay;
    /**
     * Tile and thumbnail settings applicable when imageBasedTrickPlay is ADVANCED
     */
    ImageBasedTrickPlaySettings?: CmafImageBasedTrickPlaySettings;
    /**
     * When set to GZIP, compresses HLS playlist.
     */
    ManifestCompression?: CmafManifestCompression;
    /**
     * Indicates whether the output manifest should use floating point values for segment duration.
     */
    ManifestDurationFormat?: CmafManifestDurationFormat;
    /**
     * Minimum time of initially buffered media that is needed to ensure smooth playout.
     */
    MinBufferTime?: __integerMin0Max2147483647;
    /**
     * Keep this setting at the default value of 0, unless you are troubleshooting a problem with how devices play back the end of your video asset. If you know that player devices are hanging on the final segment of your video because the length of your final segment is too short, use this setting to specify a minimum final segment length, in seconds. Choose a value that is greater than or equal to 1 and less than your segment length. When you specify a value for this setting, the encoder will combine any final segment that is shorter than the length that you specify with the previous segment. For example, your segment length is 3 seconds and your final segment is .5 seconds without a minimum final segment length; when you set the minimum final segment length to 1, your final segment is 3.5 seconds.
     */
    MinFinalSegmentLength?: __doubleMin0Max2147483647;
    /**
     * Specify whether your DASH profile is on-demand or main. When you choose Main profile (MAIN_PROFILE), the service signals  urn:mpeg:dash:profile:isoff-main:2011 in your .mpd DASH manifest. When you choose On-demand (ON_DEMAND_PROFILE), the service signals urn:mpeg:dash:profile:isoff-on-demand:2011 in your .mpd. When you choose On-demand, you must also set the output group setting Segment control (SegmentControl) to Single file (SINGLE_FILE).
     */
    MpdProfile?: CmafMpdProfile;
    /**
     * Use this setting only when your output video stream has B-frames, which causes the initial presentation time stamp (PTS) to be offset from the initial decode time stamp (DTS). Specify how MediaConvert handles PTS when writing time stamps in output DASH manifests. Choose Match initial PTS (MATCH_INITIAL_PTS) when you want MediaConvert to use the initial PTS as the first time stamp in the manifest. Choose Zero-based (ZERO_BASED) to have MediaConvert ignore the initial PTS in the video stream and instead write the initial time stamp as zero in the manifest. For outputs that don't have B-frames, the time stamps in your DASH manifests start at zero regardless of your choice here.
     */
    PtsOffsetHandlingForBFrames?: CmafPtsOffsetHandlingForBFrames;
    /**
     * When set to SINGLE_FILE, a single output file is generated, which is internally segmented using the Fragment Length and Segment Length. When set to SEGMENTED_FILES, separate segment files will be created.
     */
    SegmentControl?: CmafSegmentControl;
    /**
     * Specify the length, in whole seconds, of each segment. When you don't specify a value, MediaConvert defaults to 10. Related settings: Use Segment length control (SegmentLengthControl) to specify whether the encoder enforces this value strictly. Use Segment control (CmafSegmentControl) to specify whether MediaConvert creates separate segment files or one content file that has metadata to mark the segment boundaries.
     */
    SegmentLength?: __integerMin1Max2147483647;
    /**
     * Specify how you want MediaConvert to determine the segment length. Choose Exact (EXACT) to have the encoder use the exact length that you specify with the setting Segment length (SegmentLength). This might result in extra I-frames. Choose Multiple of GOP (GOP_MULTIPLE) to have the encoder round up the segment lengths to match the next GOP boundary.
     */
    SegmentLengthControl?: CmafSegmentLengthControl;
    /**
     * Include or exclude RESOLUTION attribute for video in EXT-X-STREAM-INF tag of variant manifest.
     */
    StreamInfResolution?: CmafStreamInfResolution;
    /**
     * When set to LEGACY, the segment target duration is always rounded up to the nearest integer value above its current value in seconds. When set to SPEC\\_COMPLIANT, the segment target duration is rounded up to the nearest integer value if fraction seconds are greater than or equal to 0.5 (>= 0.5) and rounded down if less than 0.5 (< 0.5). You may need to use LEGACY if your client needs to ensure that the target duration is always longer than the actual duration of the segment. Some older players may experience interrupted playback when the actual duration of a track in a segment is longer than the target duration.
     */
    TargetDurationCompatibilityMode?: CmafTargetDurationCompatibilityMode;
    /**
     * When set to ENABLED, a DASH MPD manifest will be generated for this output.
     */
    WriteDashManifest?: CmafWriteDASHManifest;
    /**
     * When set to ENABLED, an Apple HLS manifest will be generated for this output.
     */
    WriteHlsManifest?: CmafWriteHLSManifest;
    /**
     * When you enable Precise segment duration in DASH manifests (writeSegmentTimelineInRepresentation), your DASH manifest shows precise segment durations. The segment duration information appears inside the SegmentTimeline element, inside SegmentTemplate at the Representation level. When this feature isn't enabled, the segment durations in your DASH manifest are approximate. The segment duration information appears in the duration attribute of the SegmentTemplate element.
     */
    WriteSegmentTimelineInRepresentation?: CmafWriteSegmentTimelineInRepresentation;
  }
  export type CmafImageBasedTrickPlay = "NONE"|"THUMBNAIL"|"THUMBNAIL_AND_FULLFRAME"|"ADVANCED"|string;
  export interface CmafImageBasedTrickPlaySettings {
    /**
     * The cadence MediaConvert follows for generating thumbnails.  If set to FOLLOW_IFRAME, MediaConvert generates thumbnails for each IDR frame in the output (matching the GOP cadence).  If set to FOLLOW_CUSTOM, MediaConvert generates thumbnails according to the interval you specify in thumbnailInterval.
     */
    IntervalCadence?: CmafIntervalCadence;
    /**
     * Height of each thumbnail within each tile image, in pixels.  Leave blank to maintain aspect ratio with thumbnail width.  If following the aspect ratio would lead to a total tile height greater than 4096, then the job will be rejected.  Must be divisible by 2.
     */
    ThumbnailHeight?: __integerMin2Max4096;
    /**
     * Enter the interval, in seconds, that MediaConvert uses to generate thumbnails.  If the interval you enter doesn't align with the output frame rate, MediaConvert automatically rounds the interval to align with the output frame rate.  For example, if the output frame rate is 29.97 frames per second and you enter 5, MediaConvert uses a 150 frame interval to generate thumbnails.
     */
    ThumbnailInterval?: __doubleMin0Max2147483647;
    /**
     * Width of each thumbnail within each tile image, in pixels.  Default is 312.  Must be divisible by 8.
     */
    ThumbnailWidth?: __integerMin8Max4096;
    /**
     * Number of thumbnails in each column of a tile image. Set a value between 2 and 2048. Must be divisible by 2.
     */
    TileHeight?: __integerMin1Max2048;
    /**
     * Number of thumbnails in each row of a tile image.  Set a value between 1 and 512.
     */
    TileWidth?: __integerMin1Max512;
  }
  export type CmafInitializationVectorInManifest = "INCLUDE"|"EXCLUDE"|string;
  export type CmafIntervalCadence = "FOLLOW_IFRAME"|"FOLLOW_CUSTOM"|string;
  export type CmafKeyProviderType = "SPEKE"|"STATIC_KEY"|string;
  export type CmafManifestCompression = "GZIP"|"NONE"|string;
  export type CmafManifestDurationFormat = "FLOATING_POINT"|"INTEGER"|string;
  export type CmafMpdProfile = "MAIN_PROFILE"|"ON_DEMAND_PROFILE"|string;
  export type CmafPtsOffsetHandlingForBFrames = "ZERO_BASED"|"MATCH_INITIAL_PTS"|string;
  export type CmafSegmentControl = "SINGLE_FILE"|"SEGMENTED_FILES"|string;
  export type CmafSegmentLengthControl = "EXACT"|"GOP_MULTIPLE"|string;
  export type CmafStreamInfResolution = "INCLUDE"|"EXCLUDE"|string;
  export type CmafTargetDurationCompatibilityMode = "LEGACY"|"SPEC_COMPLIANT"|string;
  export type CmafWriteDASHManifest = "DISABLED"|"ENABLED"|string;
  export type CmafWriteHLSManifest = "DISABLED"|"ENABLED"|string;
  export type CmafWriteSegmentTimelineInRepresentation = "ENABLED"|"DISABLED"|string;
  export type CmfcAudioDuration = "DEFAULT_CODEC_DURATION"|"MATCH_VIDEO_DURATION"|string;
  export type CmfcAudioTrackType = "ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT"|"ALTERNATE_AUDIO_AUTO_SELECT"|"ALTERNATE_AUDIO_NOT_AUTO_SELECT"|string;
  export type CmfcDescriptiveVideoServiceFlag = "DONT_FLAG"|"FLAG"|string;
  export type CmfcIFrameOnlyManifest = "INCLUDE"|"EXCLUDE"|string;
  export type CmfcScte35Esam = "INSERT"|"NONE"|string;
  export type CmfcScte35Source = "PASSTHROUGH"|"NONE"|string;
  export interface CmfcSettings {
    /**
     * Specify this setting only when your output will be consumed by a downstream repackaging workflow that is sensitive to very small duration differences between video and audio. For this situation, choose Match video duration (MATCH_VIDEO_DURATION). In all other cases, keep the default value, Default codec duration (DEFAULT_CODEC_DURATION). When you choose Match video duration, MediaConvert pads the output audio streams with silence or trims them to ensure that the total duration of each audio stream is at least as long as the total duration of the video stream. After padding or trimming, the audio stream duration is no more than one frame longer than the video stream. MediaConvert applies audio padding or trimming only to the end of the last segment of the output. For unsegmented outputs, MediaConvert adds padding only to the end of the file. When you keep the default value, any minor discrepancies between audio and video duration will depend on your output audio codec.
     */
    AudioDuration?: CmfcAudioDuration;
    /**
     * Specify the audio rendition group for this audio rendition. Specify up to one value for each audio output in your output group. This value appears in your HLS parent manifest in the EXT-X-MEDIA tag of TYPE=AUDIO, as the value for the GROUP-ID attribute. For example, if you specify "audio_aac_1" for Audio group ID, it appears in your manifest like this: #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio_aac_1". Related setting: To associate the rendition group that this audio track belongs to with a video rendition, include the same value that you provide here for that video output's setting Audio rendition sets (audioRenditionSets).
     */
    AudioGroupId?: __string;
    /**
     * List the audio rendition groups that you want included with this video rendition. Use a comma-separated list. For example, say you want to include the audio rendition groups that have the audio group IDs "audio_aac_1" and "audio_dolby". Then you would specify this value: "audio_aac_1,audio_dolby". Related setting: The rendition groups that you include in your comma-separated list should all match values that you specify in the setting Audio group ID (AudioGroupId) for audio renditions in the same output group as this video rendition. Default behavior: If you don't specify anything here and for Audio group ID, MediaConvert puts each audio variant in its own audio rendition group and associates it with every video variant. Each value in your list appears in your HLS parent manifest in the EXT-X-STREAM-INF tag as the value for the AUDIO attribute. To continue the previous example, say that the file name for the child manifest for your video rendition is "amazing_video_1.m3u8". Then, in your parent manifest, each value will appear on separate lines, like this: #EXT-X-STREAM-INF:AUDIO="audio_aac_1"... amazing_video_1.m3u8 #EXT-X-STREAM-INF:AUDIO="audio_dolby"... amazing_video_1.m3u8
     */
    AudioRenditionSets?: __string;
    /**
     * Use this setting to control the values that MediaConvert puts in your HLS parent playlist to control how the client player selects which audio track to play. The other options for this setting determine the values that MediaConvert writes for the DEFAULT and AUTOSELECT attributes of the EXT-X-MEDIA entry for the audio variant. For more information about these attributes, see the Apple documentation article https://developer.apple.com/documentation/http_live_streaming/example_playlists_for_http_live_streaming/adding_alternate_media_to_a_playlist. Choose Alternate audio, auto select, default (ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT) to set DEFAULT=YES and AUTOSELECT=YES. Choose this value for only one variant in your output group. Choose Alternate audio, auto select, not default (ALTERNATE_AUDIO_AUTO_SELECT) to set DEFAULT=NO and AUTOSELECT=YES. Choose Alternate Audio, Not Auto Select to set DEFAULT=NO and AUTOSELECT=NO. When you don't specify a value for this setting, MediaConvert defaults to Alternate audio, auto select, default. When there is more than one variant in your output group, you must explicitly choose a value for this setting.
     */
    AudioTrackType?: CmfcAudioTrackType;
    /**
     * Specify whether to flag this audio track as descriptive video service (DVS) in your HLS parent manifest. When you choose Flag (FLAG), MediaConvert includes the parameter CHARACTERISTICS="public.accessibility.describes-video" in the EXT-X-MEDIA entry for this track. When you keep the default choice, Don't flag (DONT_FLAG), MediaConvert leaves this parameter out. The DVS flag can help with accessibility on Apple devices. For more information, see the Apple documentation.
     */
    DescriptiveVideoServiceFlag?: CmfcDescriptiveVideoServiceFlag;
    /**
     * Choose Include (INCLUDE) to have MediaConvert generate an HLS child manifest that lists only the I-frames for this rendition, in addition to your regular manifest for this rendition. You might use this manifest as part of a workflow that creates preview functions for your video. MediaConvert adds both the I-frame only child manifest and the regular child manifest to the parent manifest. When you don't need the I-frame only child manifest, keep the default value Exclude (EXCLUDE).
     */
    IFrameOnlyManifest?: CmfcIFrameOnlyManifest;
    /**
     * Use this setting only when you specify SCTE-35 markers from ESAM. Choose INSERT to put SCTE-35 markers in this output at the insertion points that you specify in an ESAM XML document. Provide the document in the setting SCC XML (sccXml).
     */
    Scte35Esam?: CmfcScte35Esam;
    /**
     * Ignore this setting unless you have SCTE-35 markers in your input video file. Choose Passthrough (PASSTHROUGH) if you want SCTE-35 markers that appear in your input to also appear in this output. Choose None (NONE) if you don't want those SCTE-35 markers in this output.
     */
    Scte35Source?: CmfcScte35Source;
  }
  export interface ColorCorrector {
    /**
     * Brightness level.
     */
    Brightness?: __integerMin1Max100;
    /**
     * Specify the color space you want for this output. The service supports conversion between HDR formats, between SDR formats, from SDR to HDR, and from HDR to SDR. SDR to HDR conversion doesn't upgrade the dynamic range. The converted video has an HDR format, but visually appears the same as an unconverted output. HDR to SDR conversion uses Elemental tone mapping technology to approximate the outcome of manually regrading from HDR to SDR.
     */
    ColorSpaceConversion?: ColorSpaceConversion;
    /**
     * Contrast level.
     */
    Contrast?: __integerMin1Max100;
    /**
     * Use these settings when you convert to the HDR 10 color space. Specify the SMPTE ST 2086 Mastering Display Color Volume static metadata that you want signaled in the output. These values don't affect the pixel values that are encoded in the video stream. They are intended to help the downstream video player display content in a way that reflects the intentions of the the content creator. When you set Color space conversion (ColorSpaceConversion) to HDR 10 (FORCE_HDR10), these settings are required. You must set values for Max frame average light level (maxFrameAverageLightLevel) and Max content light level (maxContentLightLevel); these settings don't have a default value. The default values for the other HDR 10 metadata settings are defined by the P3D65 color space. For more information about MediaConvert HDR jobs, see https://docs.aws.amazon.com/console/mediaconvert/hdr.
     */
    Hdr10Metadata?: Hdr10Metadata;
    /**
     * Hue in degrees.
     */
    Hue?: __integerMinNegative180Max180;
    /**
     * Specify the video color sample range for this output. To create a full range output, you must start with a full range YUV input and keep the default value, None (NONE). To create a limited range output from a full range input, choose Limited range (LIMITED_RANGE_SQUEEZE). With RGB inputs, your output is always limited range, regardless of your choice here. When you create a limited range output from a full range input, MediaConvert limits the active pixel values in a way that depends on the output's bit depth: 8-bit outputs contain only values from 16 through 235 and 10-bit outputs contain only values from 64 through 940. With this conversion, MediaConvert also changes the output metadata to note the limited range.
     */
    SampleRangeConversion?: SampleRangeConversion;
    /**
     * Saturation level.
     */
    Saturation?: __integerMin1Max100;
  }
  export type ColorMetadata = "IGNORE"|"INSERT"|string;
  export type ColorSpace = "FOLLOW"|"REC_601"|"REC_709"|"HDR10"|"HLG_2020"|string;
  export type ColorSpaceConversion = "NONE"|"FORCE_601"|"FORCE_709"|"FORCE_HDR10"|"FORCE_HLG_2020"|string;
  export type ColorSpaceUsage = "FORCE"|"FALLBACK"|string;
  export type Commitment = "ONE_YEAR"|string;
  export interface ContainerSettings {
    /**
     * These settings relate to the fragmented MP4 container for the segments in your CMAF outputs.
     */
    CmfcSettings?: CmfcSettings;
    /**
     * Container for this output. Some containers require a container settings object. If not specified, the default object will be created.
     */
    Container?: ContainerType;
    /**
     * Settings for F4v container
     */
    F4vSettings?: F4vSettings;
    /**
     * MPEG-2 TS container settings. These apply to outputs in a File output group when the output's container (ContainerType) is MPEG-2 Transport Stream (M2TS). In these assets, data is organized by the program map table (PMT). Each transport stream program contains subsets of data, including audio, video, and metadata. Each of these subsets of data has a numerical label called a packet identifier (PID). Each transport stream program corresponds to one MediaConvert output. The PMT lists the types of data in a program along with their PID. Downstream systems and players use the program map table to look up the PID for each type of data it accesses and then uses the PIDs to locate specific data within the asset.
     */
    M2tsSettings?: M2tsSettings;
    /**
     * These settings relate to the MPEG-2 transport stream (MPEG2-TS) container for the MPEG2-TS segments in your HLS outputs.
     */
    M3u8Settings?: M3u8Settings;
    /**
     * These settings relate to your QuickTime MOV output container.
     */
    MovSettings?: MovSettings;
    /**
     * These settings relate to your MP4 output container. You can create audio only outputs with this container. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/supported-codecs-containers-audio-only.html#output-codecs-and-containers-supported-for-audio-only.
     */
    Mp4Settings?: Mp4Settings;
    /**
     * These settings relate to the fragmented MP4 container for the segments in your DASH outputs.
     */
    MpdSettings?: MpdSettings;
    /**
     * These settings relate to your MXF output container.
     */
    MxfSettings?: MxfSettings;
  }
  export type ContainerType = "F4V"|"ISMV"|"M2TS"|"M3U8"|"CMFC"|"MOV"|"MP4"|"MPD"|"MXF"|"WEBM"|"RAW"|string;
  export type CopyProtectionAction = "PASSTHROUGH"|"STRIP"|string;
  export interface CreateJobRequest {
    /**
     * Optional. Accelerated transcoding can significantly speed up jobs with long, visually complex content. Outputs that use this feature incur pro-tier pricing. For information about feature limitations, see the AWS Elemental MediaConvert User Guide.
     */
    AccelerationSettings?: AccelerationSettings;
    /**
     * Optional. Choose a tag type that AWS Billing and Cost Management will use to sort your AWS Elemental MediaConvert costs on any billing report that you set up. Any transcoding outputs that don't have an associated tag will appear in your billing report unsorted. If you don't choose a valid value for this field, your job outputs will appear on the billing report unsorted.
     */
    BillingTagsSource?: BillingTagsSource;
    /**
     * Optional. Idempotency token for CreateJob operation.
     */
    ClientRequestToken?: __string;
    /**
     * Optional. Use queue hopping to avoid overly long waits in the backlog of the queue that you submit your job to. Specify an alternate queue and the maximum time that your job will wait in the initial queue before hopping. For more information about this feature, see the AWS Elemental MediaConvert User Guide.
     */
    HopDestinations?: __listOfHopDestination;
    /**
     * Optional. When you create a job, you can either specify a job template or specify the transcoding settings individually.
     */
    JobTemplate?: __string;
    /**
     * Optional. Specify the relative priority for this job. In any given queue, the service begins processing the job with the highest value first. When more than one job has the same priority, the service begins processing the job that you submitted first. If you don't specify a priority, the service uses the default value 0.
     */
    Priority?: __integerMinNegative50Max50;
    /**
     * Optional. When you create a job, you can specify a queue to send it to. If you don't specify, the job will go to the default queue. For more about queues, see the User Guide topic at https://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html.
     */
    Queue?: __string;
    /**
     * Required. The IAM role you use for creating this job. For details about permissions, see the User Guide topic at the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/iam-role.html.
     */
    Role: __string;
    /**
     * JobSettings contains all the transcode settings for a job.
     */
    Settings: JobSettings;
    /**
     * Optional. Enable this setting when you run a test job to estimate how many reserved transcoding slots (RTS) you need. When this is enabled, MediaConvert runs your job from an on-demand queue with similar performance to what you will see with one RTS in a reserved queue. This setting is disabled by default.
     */
    SimulateReservedQueue?: SimulateReservedQueue;
    /**
     * Optional. Specify how often MediaConvert sends STATUS_UPDATE events to Amazon CloudWatch Events. Set the interval, in seconds, between status updates. MediaConvert sends an update at this interval from the time the service begins processing your job to the time it completes the transcode or encounters an error.
     */
    StatusUpdateInterval?: StatusUpdateInterval;
    /**
     * Optional. The tags that you want to add to the resource. You can tag resources with a key-value pair or with only a key.  Use standard AWS tags on your job for automatic integration with AWS services and for custom integrations and workflows.
     */
    Tags?: __mapOf__string;
    /**
     * Optional. User-defined metadata that you want to associate with an MediaConvert job. You specify metadata in key/value pairs.  Use only for existing integrations or workflows that rely on job metadata tags. Otherwise, we recommend that you use standard AWS tags.
     */
    UserMetadata?: __mapOf__string;
  }
  export interface CreateJobResponse {
    /**
     * Each job converts an input file into an output file or files. For more information, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
     */
    Job?: Job;
  }
  export interface CreateJobTemplateRequest {
    /**
     * Accelerated transcoding can significantly speed up jobs with long, visually complex content. Outputs that use this feature incur pro-tier pricing. For information about feature limitations, see the AWS Elemental MediaConvert User Guide.
     */
    AccelerationSettings?: AccelerationSettings;
    /**
     * Optional. A category for the job template you are creating
     */
    Category?: __string;
    /**
     * Optional. A description of the job template you are creating.
     */
    Description?: __string;
    /**
     * Optional. Use queue hopping to avoid overly long waits in the backlog of the queue that you submit your job to. Specify an alternate queue and the maximum time that your job will wait in the initial queue before hopping. For more information about this feature, see the AWS Elemental MediaConvert User Guide.
     */
    HopDestinations?: __listOfHopDestination;
    /**
     * The name of the job template you are creating.
     */
    Name: __string;
    /**
     * Specify the relative priority for this job. In any given queue, the service begins processing the job with the highest value first. When more than one job has the same priority, the service begins processing the job that you submitted first. If you don't specify a priority, the service uses the default value 0.
     */
    Priority?: __integerMinNegative50Max50;
    /**
     * Optional. The queue that jobs created from this template are assigned to. If you don't specify this, jobs will go to the default queue.
     */
    Queue?: __string;
    /**
     * JobTemplateSettings contains all the transcode settings saved in the template that will be applied to jobs created from it.
     */
    Settings: JobTemplateSettings;
    /**
     * Specify how often MediaConvert sends STATUS_UPDATE events to Amazon CloudWatch Events. Set the interval, in seconds, between status updates. MediaConvert sends an update at this interval from the time the service begins processing your job to the time it completes the transcode or encounters an error.
     */
    StatusUpdateInterval?: StatusUpdateInterval;
    /**
     * The tags that you want to add to the resource. You can tag resources with a key-value pair or with only a key.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateJobTemplateResponse {
    /**
     * A job template is a pre-made set of encoding instructions that you can use to quickly create a job.
     */
    JobTemplate?: JobTemplate;
  }
  export interface CreatePresetRequest {
    /**
     * Optional. A category for the preset you are creating.
     */
    Category?: __string;
    /**
     * Optional. A description of the preset you are creating.
     */
    Description?: __string;
    /**
     * The name of the preset you are creating.
     */
    Name: __string;
    /**
     * Settings for preset
     */
    Settings: PresetSettings;
    /**
     * The tags that you want to add to the resource. You can tag resources with a key-value pair or with only a key.
     */
    Tags?: __mapOf__string;
  }
  export interface CreatePresetResponse {
    /**
     * A preset is a collection of preconfigured media conversion settings that you want MediaConvert to apply to the output during the conversion process.
     */
    Preset?: Preset;
  }
  export interface CreateQueueRequest {
    /**
     * Optional. A description of the queue that you are creating.
     */
    Description?: __string;
    /**
     * The name of the queue that you are creating.
     */
    Name: __string;
    /**
     * Specifies whether the pricing plan for the queue is on-demand or reserved. For on-demand, you pay per minute, billed in increments of .01 minute. For reserved, you pay for the transcoding capacity of the entire queue, regardless of how much or how little you use it. Reserved pricing requires a 12-month commitment. When you use the API to create a queue, the default is on-demand.
     */
    PricingPlan?: PricingPlan;
    /**
     * Details about the pricing plan for your reserved queue. Required for reserved queues and not applicable to on-demand queues.
     */
    ReservationPlanSettings?: ReservationPlanSettings;
    /**
     * Initial state of the queue. If you create a paused queue, then jobs in that queue won't begin.
     */
    Status?: QueueStatus;
    /**
     * The tags that you want to add to the resource. You can tag resources with a key-value pair or with only a key.
     */
    Tags?: __mapOf__string;
  }
  export interface CreateQueueResponse {
    /**
     * You can use queues to manage the resources that are available to your AWS account for running multiple transcoding jobs at the same time. If you don't specify a queue, the service sends all jobs through the default queue. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-queues.html.
     */
    Queue?: Queue;
  }
  export interface DashAdditionalManifest {
    /**
     * Specify a name modifier that the service adds to the name of this manifest to make it different from the file names of the other main manifests in the output group. For example, say that the default main manifest for your DASH group is film-name.mpd. If you enter "-no-premium" for this setting, then the file name the service generates for this top-level manifest is film-name-no-premium.mpd.
     */
    ManifestNameModifier?: __stringMin1;
    /**
     * Specify the outputs that you want this additional top-level manifest to reference.
     */
    SelectedOutputs?: __listOf__stringMin1;
  }
  export interface DashIsoEncryptionSettings {
    /**
     * This setting can improve the compatibility of your output with video players on obsolete devices. It applies only to DASH H.264 outputs with DRM encryption. Choose Unencrypted SEI (UNENCRYPTED_SEI) only to correct problems with playback on older devices. Otherwise, keep the default setting CENC v1 (CENC_V1). If you choose Unencrypted SEI, for that output, the service will exclude the access unit delimiter and will leave the SEI NAL units unencrypted.
     */
    PlaybackDeviceCompatibility?: DashIsoPlaybackDeviceCompatibility;
    /**
     * If your output group type is HLS, DASH, or Microsoft Smooth, use these settings when doing DRM encryption with a SPEKE-compliant key provider.  If your output group type is CMAF, use the SpekeKeyProviderCmaf settings instead.
     */
    SpekeKeyProvider?: SpekeKeyProvider;
  }
  export type DashIsoGroupAudioChannelConfigSchemeIdUri = "MPEG_CHANNEL_CONFIGURATION"|"DOLBY_CHANNEL_CONFIGURATION"|string;
  export interface DashIsoGroupSettings {
    /**
     * By default, the service creates one .mpd DASH manifest for each DASH ISO output group in your job. This default manifest references every output in the output group. To create additional DASH manifests that reference a subset of the outputs in the output group, specify a list of them here.
     */
    AdditionalManifests?: __listOfDashAdditionalManifest;
    /**
     * Use this setting only when your audio codec is a Dolby one (AC3, EAC3, or Atmos) and your downstream workflow requires that your DASH manifest use the Dolby channel configuration tag, rather than the MPEG one. For example, you might need to use this to make dynamic ad insertion work. Specify which audio channel configuration scheme ID URI MediaConvert writes in your DASH manifest. Keep the default value, MPEG channel configuration (MPEG_CHANNEL_CONFIGURATION), to have MediaConvert write this: urn:mpeg:mpegB:cicp:ChannelConfiguration. Choose Dolby channel configuration (DOLBY_CHANNEL_CONFIGURATION) to have MediaConvert write this instead: tag:dolby.com,2014:dash:audio_channel_configuration:2011.
     */
    AudioChannelConfigSchemeIdUri?: DashIsoGroupAudioChannelConfigSchemeIdUri;
    /**
     * A partial URI prefix that will be put in the manifest (.mpd) file at the top level BaseURL element. Can be used if streams are delivered from a different URL than the manifest file.
     */
    BaseUrl?: __string;
    /**
     * Use Destination (Destination) to specify the S3 output location and the output filename base. Destination accepts format identifiers. If you do not specify the base filename in the URI, the service will use the filename of the input file. If your job has multiple inputs, the service uses the filename of the first input file.
     */
    Destination?: __stringPatternS3;
    /**
     * Settings associated with the destination. Will vary based on the type of destination
     */
    DestinationSettings?: DestinationSettings;
    /**
     * DRM settings.
     */
    Encryption?: DashIsoEncryptionSettings;
    /**
     * Length of fragments to generate (in seconds). Fragment length must be compatible with GOP size and Framerate. Note that fragments will end on the next keyframe after this number of seconds, so actual fragment length may be longer. When Emit Single File is checked, the fragmentation is internal to a single output file and it does not cause the creation of many output files as in other output types.
     */
    FragmentLength?: __integerMin1Max2147483647;
    /**
     * Supports HbbTV specification as indicated
     */
    HbbtvCompliance?: DashIsoHbbtvCompliance;
    /**
     * Specify whether MediaConvert generates images for trick play. Keep the default value, None (NONE), to not generate any images. Choose Thumbnail (THUMBNAIL) to generate tiled thumbnails. Choose Thumbnail and full frame (THUMBNAIL_AND_FULLFRAME) to generate tiled thumbnails and full-resolution images of single frames. MediaConvert adds an entry in the .mpd manifest for each set of images that you generate. A common application for these images is Roku trick mode. The thumbnails and full-frame images that MediaConvert creates with this feature are compatible with this Roku specification: https://developer.roku.com/docs/developer-program/media-playback/trick-mode/hls-and-dash.md
     */
    ImageBasedTrickPlay?: DashIsoImageBasedTrickPlay;
    /**
     * Tile and thumbnail settings applicable when imageBasedTrickPlay is ADVANCED
     */
    ImageBasedTrickPlaySettings?: DashIsoImageBasedTrickPlaySettings;
    /**
     * Minimum time of initially buffered media that is needed to ensure smooth playout.
     */
    MinBufferTime?: __integerMin0Max2147483647;
    /**
     * Keep this setting at the default value of 0, unless you are troubleshooting a problem with how devices play back the end of your video asset. If you know that player devices are hanging on the final segment of your video because the length of your final segment is too short, use this setting to specify a minimum final segment length, in seconds. Choose a value that is greater than or equal to 1 and less than your segment length. When you specify a value for this setting, the encoder will combine any final segment that is shorter than the length that you specify with the previous segment. For example, your segment length is 3 seconds and your final segment is .5 seconds without a minimum final segment length; when you set the minimum final segment length to 1, your final segment is 3.5 seconds.
     */
    MinFinalSegmentLength?: __doubleMin0Max2147483647;
    /**
     * Specify whether your DASH profile is on-demand or main. When you choose Main profile (MAIN_PROFILE), the service signals  urn:mpeg:dash:profile:isoff-main:2011 in your .mpd DASH manifest. When you choose On-demand (ON_DEMAND_PROFILE), the service signals urn:mpeg:dash:profile:isoff-on-demand:2011 in your .mpd. When you choose On-demand, you must also set the output group setting Segment control (SegmentControl) to Single file (SINGLE_FILE).
     */
    MpdProfile?: DashIsoMpdProfile;
    /**
     * Use this setting only when your output video stream has B-frames, which causes the initial presentation time stamp (PTS) to be offset from the initial decode time stamp (DTS). Specify how MediaConvert handles PTS when writing time stamps in output DASH manifests. Choose Match initial PTS (MATCH_INITIAL_PTS) when you want MediaConvert to use the initial PTS as the first time stamp in the manifest. Choose Zero-based (ZERO_BASED) to have MediaConvert ignore the initial PTS in the video stream and instead write the initial time stamp as zero in the manifest. For outputs that don't have B-frames, the time stamps in your DASH manifests start at zero regardless of your choice here.
     */
    PtsOffsetHandlingForBFrames?: DashIsoPtsOffsetHandlingForBFrames;
    /**
     * When set to SINGLE_FILE, a single output file is generated, which is internally segmented using the Fragment Length and Segment Length. When set to SEGMENTED_FILES, separate segment files will be created.
     */
    SegmentControl?: DashIsoSegmentControl;
    /**
     * Specify the length, in whole seconds, of each segment. When you don't specify a value, MediaConvert defaults to 30. Related settings: Use Segment length control (SegmentLengthControl) to specify whether the encoder enforces this value strictly. Use Segment control (DashIsoSegmentControl) to specify whether MediaConvert creates separate segment files or one content file that has metadata to mark the segment boundaries.
     */
    SegmentLength?: __integerMin1Max2147483647;
    /**
     * Specify how you want MediaConvert to determine the segment length. Choose Exact (EXACT) to have the encoder use the exact length that you specify with the setting Segment length (SegmentLength). This might result in extra I-frames. Choose Multiple of GOP (GOP_MULTIPLE) to have the encoder round up the segment lengths to match the next GOP boundary.
     */
    SegmentLengthControl?: DashIsoSegmentLengthControl;
    /**
     * If you get an HTTP error in the 400 range when you play back your DASH output, enable this setting and run your transcoding job again. When you enable this setting, the service writes precise segment durations in the DASH manifest. The segment duration information appears inside the SegmentTimeline element, inside SegmentTemplate at the Representation level. When you don't enable this setting, the service writes approximate segment durations in your DASH manifest.
     */
    WriteSegmentTimelineInRepresentation?: DashIsoWriteSegmentTimelineInRepresentation;
  }
  export type DashIsoHbbtvCompliance = "HBBTV_1_5"|"NONE"|string;
  export type DashIsoImageBasedTrickPlay = "NONE"|"THUMBNAIL"|"THUMBNAIL_AND_FULLFRAME"|"ADVANCED"|string;
  export interface DashIsoImageBasedTrickPlaySettings {
    /**
     * The cadence MediaConvert follows for generating thumbnails.  If set to FOLLOW_IFRAME, MediaConvert generates thumbnails for each IDR frame in the output (matching the GOP cadence).  If set to FOLLOW_CUSTOM, MediaConvert generates thumbnails according to the interval you specify in thumbnailInterval.
     */
    IntervalCadence?: DashIsoIntervalCadence;
    /**
     * Height of each thumbnail within each tile image, in pixels.  Leave blank to maintain aspect ratio with thumbnail width.  If following the aspect ratio would lead to a total tile height greater than 4096, then the job will be rejected.  Must be divisible by 2.
     */
    ThumbnailHeight?: __integerMin1Max4096;
    /**
     * Enter the interval, in seconds, that MediaConvert uses to generate thumbnails.  If the interval you enter doesn't align with the output frame rate, MediaConvert automatically rounds the interval to align with the output frame rate.  For example, if the output frame rate is 29.97 frames per second and you enter 5, MediaConvert uses a 150 frame interval to generate thumbnails.
     */
    ThumbnailInterval?: __doubleMin0Max2147483647;
    /**
     * Width of each thumbnail within each tile image, in pixels.  Default is 312.  Must be divisible by 8.
     */
    ThumbnailWidth?: __integerMin8Max4096;
    /**
     * Number of thumbnails in each column of a tile image. Set a value between 2 and 2048. Must be divisible by 2.
     */
    TileHeight?: __integerMin1Max2048;
    /**
     * Number of thumbnails in each row of a tile image.  Set a value between 1 and 512.
     */
    TileWidth?: __integerMin1Max512;
  }
  export type DashIsoIntervalCadence = "FOLLOW_IFRAME"|"FOLLOW_CUSTOM"|string;
  export type DashIsoMpdProfile = "MAIN_PROFILE"|"ON_DEMAND_PROFILE"|string;
  export type DashIsoPlaybackDeviceCompatibility = "CENC_V1"|"UNENCRYPTED_SEI"|string;
  export type DashIsoPtsOffsetHandlingForBFrames = "ZERO_BASED"|"MATCH_INITIAL_PTS"|string;
  export type DashIsoSegmentControl = "SINGLE_FILE"|"SEGMENTED_FILES"|string;
  export type DashIsoSegmentLengthControl = "EXACT"|"GOP_MULTIPLE"|string;
  export type DashIsoWriteSegmentTimelineInRepresentation = "ENABLED"|"DISABLED"|string;
  export type DecryptionMode = "AES_CTR"|"AES_CBC"|"AES_GCM"|string;
  export type DeinterlaceAlgorithm = "INTERPOLATE"|"INTERPOLATE_TICKER"|"BLEND"|"BLEND_TICKER"|string;
  export interface Deinterlacer {
    /**
     * Only applies when you set Deinterlacer (DeinterlaceMode) to Deinterlace (DEINTERLACE) or Adaptive (ADAPTIVE). Motion adaptive interpolate (INTERPOLATE) produces sharper pictures, while blend (BLEND) produces smoother motion. Use (INTERPOLATE_TICKER) OR (BLEND_TICKER) if your source file includes a ticker, such as a scrolling headline at the bottom of the frame.
     */
    Algorithm?: DeinterlaceAlgorithm;
    /**
     * - When set to NORMAL (default), the deinterlacer does not convert frames that are tagged  in metadata as progressive. It will only convert those that are tagged as some other type. - When set to FORCE_ALL_FRAMES, the deinterlacer converts every frame to progressive - even those that are already tagged as progressive. Turn Force mode on only if there is  a good chance that the metadata has tagged frames as progressive when they are not  progressive. Do not turn on otherwise; processing frames that are already progressive  into progressive will probably result in lower quality video.
     */
    Control?: DeinterlacerControl;
    /**
     * Use Deinterlacer (DeinterlaceMode) to choose how the service will do deinterlacing. Default is Deinterlace. - Deinterlace converts interlaced to progressive. - Inverse telecine converts Hard Telecine 29.97i to progressive 23.976p. - Adaptive auto-detects and converts to progressive.
     */
    Mode?: DeinterlacerMode;
  }
  export type DeinterlacerControl = "FORCE_ALL_FRAMES"|"NORMAL"|string;
  export type DeinterlacerMode = "DEINTERLACE"|"INVERSE_TELECINE"|"ADAPTIVE"|string;
  export interface DeleteJobTemplateRequest {
    /**
     * The name of the job template to be deleted.
     */
    Name: __string;
  }
  export interface DeleteJobTemplateResponse {
  }
  export interface DeletePolicyRequest {
  }
  export interface DeletePolicyResponse {
  }
  export interface DeletePresetRequest {
    /**
     * The name of the preset to be deleted.
     */
    Name: __string;
  }
  export interface DeletePresetResponse {
  }
  export interface DeleteQueueRequest {
    /**
     * The name of the queue that you want to delete.
     */
    Name: __string;
  }
  export interface DeleteQueueResponse {
  }
  export type DescribeEndpointsMode = "DEFAULT"|"GET_ONLY"|string;
  export interface DescribeEndpointsRequest {
    /**
     * Optional. Max number of endpoints, up to twenty, that will be returned at one time.
     */
    MaxResults?: __integer;
    /**
     * Optional field, defaults to DEFAULT. Specify DEFAULT for this operation to return your endpoints if any exist, or to create an endpoint for you and return it if one doesn't already exist. Specify GET_ONLY to return your endpoints if any exist, or an empty list if none exist.
     */
    Mode?: DescribeEndpointsMode;
    /**
     * Use this string, provided with the response to a previous request, to request the next batch of endpoints.
     */
    NextToken?: __string;
  }
  export interface DescribeEndpointsResponse {
    /**
     * List of endpoints
     */
    Endpoints?: __listOfEndpoint;
    /**
     * Use this string to request the next batch of endpoints.
     */
    NextToken?: __string;
  }
  export interface DestinationSettings {
    /**
     * Settings associated with S3 destination
     */
    S3Settings?: S3DestinationSettings;
  }
  export interface DisassociateCertificateRequest {
    /**
     * The ARN of the ACM certificate that you want to disassociate from your MediaConvert resource.
     */
    Arn: __string;
  }
  export interface DisassociateCertificateResponse {
  }
  export interface DolbyVision {
    /**
     * Use these settings when you set DolbyVisionLevel6Mode to SPECIFY to override the MaxCLL and MaxFALL values in your input with new values.
     */
    L6Metadata?: DolbyVisionLevel6Metadata;
    /**
     * Use Dolby Vision Mode to choose how the service will handle Dolby Vision MaxCLL and MaxFALL properies.
     */
    L6Mode?: DolbyVisionLevel6Mode;
    /**
     * In the current MediaConvert implementation, the Dolby Vision profile is always 5 (PROFILE_5). Therefore, all of your inputs must contain Dolby Vision frame interleaved data.
     */
    Profile?: DolbyVisionProfile;
  }
  export interface DolbyVisionLevel6Metadata {
    /**
     * Maximum Content Light Level. Static HDR metadata that corresponds to the brightest pixel in the entire stream. Measured in nits.
     */
    MaxCll?: __integerMin0Max65535;
    /**
     * Maximum Frame-Average Light Level. Static HDR metadata that corresponds to the highest frame-average brightness in the entire stream. Measured in nits.
     */
    MaxFall?: __integerMin0Max65535;
  }
  export type DolbyVisionLevel6Mode = "PASSTHROUGH"|"RECALCULATE"|"SPECIFY"|string;
  export type DolbyVisionProfile = "PROFILE_5"|string;
  export type DropFrameTimecode = "DISABLED"|"ENABLED"|string;
  export interface DvbNitSettings {
    /**
     * The numeric value placed in the Network Information Table (NIT).
     */
    NetworkId?: __integerMin0Max65535;
    /**
     * The network name text placed in the network_name_descriptor inside the Network Information Table. Maximum length is 256 characters.
     */
    NetworkName?: __stringMin1Max256;
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    NitInterval?: __integerMin25Max10000;
  }
  export interface DvbSdtSettings {
    /**
     * Selects method of inserting SDT information into output stream.  "Follow input SDT" copies SDT information from input stream to  output stream. "Follow input SDT if present" copies SDT information from  input stream to output stream if SDT information is present in the input, otherwise it will fall back on the user-defined values. Enter "SDT  Manually" means user will enter the SDT information. "No SDT" means output  stream will not contain SDT information.
     */
    OutputSdt?: OutputSdt;
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    SdtInterval?: __integerMin25Max2000;
    /**
     * The service name placed in the service_descriptor in the Service Description Table. Maximum length is 256 characters.
     */
    ServiceName?: __stringMin1Max256;
    /**
     * The service provider name placed in the service_descriptor in the Service Description Table. Maximum length is 256 characters.
     */
    ServiceProviderName?: __stringMin1Max256;
  }
  export interface DvbSubDestinationSettings {
    /**
     * Specify the alignment of your captions. If no explicit x_position is provided, setting alignment to centered will placethe captions at the bottom center of the output. Similarly, setting a left alignment willalign captions to the bottom left of the output. If x and y positions are given in conjunction with the alignment parameter, the font will be justified (either left or centered) relative to those coordinates. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    Alignment?: DvbSubtitleAlignment;
    /**
     * Ignore this setting unless Style Passthrough (StylePassthrough) is set to Enabled and Font color (FontColor) set to Black, Yellow, Red, Green, Blue, or Hex. Use Apply font color (ApplyFontColor) for additional font color controls. When you choose White text only (WHITE_TEXT_ONLY), or leave blank, your font color setting only applies to white text in your input captions. For example, if your font color setting is Yellow, and your input captions have red and white text, your output captions will have red and yellow text. When you choose ALL_TEXT, your font color setting applies to all of your output captions text.
     */
    ApplyFontColor?: DvbSubtitleApplyFontColor;
    /**
     * Specify the color of the rectangle behind the captions. Leave background color (BackgroundColor) blank and set Style passthrough (StylePassthrough) to enabled to use the background color data from your input captions, if present.
     */
    BackgroundColor?: DvbSubtitleBackgroundColor;
    /**
     * Specify the opacity of the background rectangle. Enter a value from 0 to 255, where 0 is transparent and 255 is opaque. If Style passthrough (StylePassthrough) is set to enabled, leave blank to pass through the background style information in your input captions to your output captions. If Style passthrough is set to disabled, leave blank to use a value of 0 and remove all backgrounds from your output captions. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    BackgroundOpacity?: __integerMin0Max255;
    /**
     * Specify how MediaConvert handles the display definition segment (DDS). Keep the default, None (NONE), to exclude the DDS from this set of captions. Choose No display window (NO_DISPLAY_WINDOW) to have MediaConvert include the DDS but not include display window data. In this case, MediaConvert writes that information to the page composition segment (PCS) instead. Choose Specify (SPECIFIED) to have MediaConvert set up the display window based on the values that you specify in related job settings. For video resolutions that are 576 pixels or smaller in height, MediaConvert doesn't include the DDS, regardless of the value you choose for DDS handling (ddsHandling). In this case, it doesn't write the display window data to the PCS either. Related settings: Use the settings DDS x-coordinate (ddsXCoordinate) and DDS y-coordinate (ddsYCoordinate) to specify the offset between the top left corner of the display window and the top left corner of the video frame. All burn-in and DVB-Sub font settings must match.
     */
    DdsHandling?: DvbddsHandling;
    /**
     * Use this setting, along with DDS y-coordinate (ddsYCoordinate), to specify the upper left corner of the display definition segment (DDS) display window. With this setting, specify the distance, in pixels, between the left side of the frame and the left side of the DDS display window. Keep the default value, 0, to have MediaConvert automatically choose this offset. Related setting: When you use this setting, you must set DDS handling (ddsHandling) to a value other than None (NONE). MediaConvert uses these values to determine whether to write page position data to the DDS or to the page composition segment (PCS). All burn-in and DVB-Sub font settings must match.
     */
    DdsXCoordinate?: __integerMin0Max2147483647;
    /**
     * Use this setting, along with DDS x-coordinate (ddsXCoordinate), to specify the upper left corner of the display definition segment (DDS) display window. With this setting, specify the distance, in pixels, between the top of the frame and the top of the DDS display window. Keep the default value, 0, to have MediaConvert automatically choose this offset. Related setting: When you use this setting, you must set DDS handling (ddsHandling) to a value other than None (NONE). MediaConvert uses these values to determine whether to write page position data to the DDS or to the page composition segment (PCS). All burn-in and DVB-Sub font settings must match.
     */
    DdsYCoordinate?: __integerMin0Max2147483647;
    /**
     * Specify the font that you want the service to use for your burn in captions when your input captions specify a font that MediaConvert doesn't support. When you set Fallback font (FallbackFont) to best match (BEST_MATCH), or leave blank, MediaConvert uses a supported font that most closely matches the font that your input captions specify. When there are multiple unsupported fonts in your input captions, MediaConvert matches each font with the supported font that matches best. When you explicitly choose a replacement font, MediaConvert uses that font to replace all unsupported fonts from your input.
     */
    FallbackFont?: DvbSubSubtitleFallbackFont;
    /**
     * Specify the color of the captions text. Leave Font color (FontColor) blank and set Style passthrough (StylePassthrough) to enabled to use the font color data from your input captions, if present. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    FontColor?: DvbSubtitleFontColor;
    /**
     * Specify the opacity of the burned-in captions. 255 is opaque; 0 is transparent.
Within your job settings, all of your DVB-Sub settings must be identical.
     */
    FontOpacity?: __integerMin0Max255;
    /**
     * Specify the Font resolution (FontResolution) in DPI (dots per inch).
Within your job settings, all of your DVB-Sub settings must be identical.
     */
    FontResolution?: __integerMin96Max600;
    /**
     * Set Font script (FontScript) to Automatically determined (AUTOMATIC), or leave blank, to automatically determine the font script in your input captions. Otherwise, set to Simplified Chinese (HANS) or Traditional Chinese (HANT) if your input font script uses Simplified or Traditional Chinese. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    FontScript?: FontScript;
    /**
     * Specify the Font size (FontSize) in pixels. Must be a positive integer. Set to 0, or leave blank, for automatic font size. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    FontSize?: __integerMin0Max96;
    /**
     * Specify the height, in pixels, of this set of DVB-Sub captions. The default value is 576 pixels. Related setting: When you use this setting, you must set DDS handling (ddsHandling) to a value other than None (NONE). All burn-in and DVB-Sub font settings must match.
     */
    Height?: __integerMin1Max2147483647;
    /**
     * Ignore this setting unless your Font color is set to Hex. Enter either six or eight hexidecimal digits, representing red, green, and blue, with two optional extra digits for alpha. For example a value of 1122AABB is a red value of 0x11, a green value of 0x22, a blue value of 0xAA, and an alpha value of 0xBB.
     */
    HexFontColor?: __stringMin6Max8Pattern09aFAF609aFAF2;
    /**
     * Specify font outline color. Leave Outline color (OutlineColor) blank and set Style passthrough (StylePassthrough) to enabled to use the font outline color data from your input captions, if present. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    OutlineColor?: DvbSubtitleOutlineColor;
    /**
     * Specify the Outline size (OutlineSize) of the caption text, in pixels. Leave Outline size blank and set Style passthrough (StylePassthrough) to enabled to use the outline size data from your input captions, if present. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    OutlineSize?: __integerMin0Max10;
    /**
     * Specify the color of the shadow cast by the captions. Leave Shadow color (ShadowColor) blank and set Style passthrough (StylePassthrough) to enabled to use the shadow color data from your input captions, if present. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    ShadowColor?: DvbSubtitleShadowColor;
    /**
     * Specify the opacity of the shadow. Enter a value from 0 to 255, where 0 is transparent and 255 is opaque. If Style passthrough (StylePassthrough) is set to Enabled, leave Shadow opacity (ShadowOpacity) blank to pass through the shadow style information in your input captions to your output captions. If Style passthrough is set to disabled, leave blank to use a value of 0 and remove all shadows from your output captions. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    ShadowOpacity?: __integerMin0Max255;
    /**
     * Specify the horizontal offset of the shadow, relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels to the left. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    ShadowXOffset?: __integerMinNegative2147483648Max2147483647;
    /**
     * Specify the vertical offset of the shadow relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels above the text. Leave Shadow y-offset (ShadowYOffset) blank and set Style passthrough (StylePassthrough) to enabled to use the shadow y-offset data from your input captions, if present. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    ShadowYOffset?: __integerMinNegative2147483648Max2147483647;
    /**
     * Set Style passthrough (StylePassthrough) to ENABLED to use the available style, color, and position information from your input captions. MediaConvert uses default settings for any missing style and position information in your input captions. Set Style passthrough to DISABLED, or leave blank, to ignore the style and position information from your input captions and use default settings: white text with black outlining, bottom-center positioning, and automatic sizing. Whether you set Style passthrough to enabled or not, you can also choose to manually override any of the individual style and position settings.
     */
    StylePassthrough?: DvbSubtitleStylePassthrough;
    /**
     * Specify whether your DVB subtitles are standard or for hearing impaired. Choose hearing impaired if your subtitles include audio descriptions and dialogue. Choose standard if your subtitles include only dialogue.
     */
    SubtitlingType?: DvbSubtitlingType;
    /**
     * Specify whether the Text spacing (TeletextSpacing) in your captions is set by the captions grid, or varies depending on letter width. Choose fixed grid (FIXED_GRID) to conform to the spacing specified in the captions file more accurately. Choose proportional (PROPORTIONAL) to make the text easier to read for closed captions. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    TeletextSpacing?: DvbSubtitleTeletextSpacing;
    /**
     * Specify the width, in pixels, of this set of DVB-Sub captions. The default value is 720 pixels. Related setting: When you use this setting, you must set DDS handling (ddsHandling) to a value other than None (NONE). All burn-in and DVB-Sub font settings must match.
     */
    Width?: __integerMin1Max2147483647;
    /**
     * Specify the horizontal position (XPosition) of the captions, relative to the left side of the outputin pixels. A value of 10 would result in the captions starting 10 pixels from the left ofthe output. If no explicit x_position is provided, the horizontal caption position will bedetermined by the alignment parameter. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    XPosition?: __integerMin0Max2147483647;
    /**
     * Specify the vertical position (YPosition) of the captions, relative to the top of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the top of the output. If no explicit y_position is provided, the caption will be positioned towards the bottom of the output. Within your job settings, all of your DVB-Sub settings must be identical.
     */
    YPosition?: __integerMin0Max2147483647;
  }
  export interface DvbSubSourceSettings {
    /**
     * When using DVB-Sub with Burn-In or SMPTE-TT, use this PID for the source content. Unused for DVB-Sub passthrough. All DVB-Sub content is passed through, regardless of selectors.
     */
    Pid?: __integerMin1Max2147483647;
  }
  export type DvbSubSubtitleFallbackFont = "BEST_MATCH"|"MONOSPACED_SANSSERIF"|"MONOSPACED_SERIF"|"PROPORTIONAL_SANSSERIF"|"PROPORTIONAL_SERIF"|string;
  export type DvbSubtitleAlignment = "CENTERED"|"LEFT"|"AUTO"|string;
  export type DvbSubtitleApplyFontColor = "WHITE_TEXT_ONLY"|"ALL_TEXT"|string;
  export type DvbSubtitleBackgroundColor = "NONE"|"BLACK"|"WHITE"|"AUTO"|string;
  export type DvbSubtitleFontColor = "WHITE"|"BLACK"|"YELLOW"|"RED"|"GREEN"|"BLUE"|"HEX"|"AUTO"|string;
  export type DvbSubtitleOutlineColor = "BLACK"|"WHITE"|"YELLOW"|"RED"|"GREEN"|"BLUE"|"AUTO"|string;
  export type DvbSubtitleShadowColor = "NONE"|"BLACK"|"WHITE"|"AUTO"|string;
  export type DvbSubtitleStylePassthrough = "ENABLED"|"DISABLED"|string;
  export type DvbSubtitleTeletextSpacing = "FIXED_GRID"|"PROPORTIONAL"|"AUTO"|string;
  export type DvbSubtitlingType = "HEARING_IMPAIRED"|"STANDARD"|string;
  export interface DvbTdtSettings {
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    TdtInterval?: __integerMin1000Max30000;
  }
  export type DvbddsHandling = "NONE"|"SPECIFIED"|"NO_DISPLAY_WINDOW"|string;
  export type Eac3AtmosBitstreamMode = "COMPLETE_MAIN"|string;
  export type Eac3AtmosCodingMode = "CODING_MODE_AUTO"|"CODING_MODE_5_1_4"|"CODING_MODE_7_1_4"|"CODING_MODE_9_1_6"|string;
  export type Eac3AtmosDialogueIntelligence = "ENABLED"|"DISABLED"|string;
  export type Eac3AtmosDownmixControl = "SPECIFIED"|"INITIALIZE_FROM_SOURCE"|string;
  export type Eac3AtmosDynamicRangeCompressionLine = "NONE"|"FILM_STANDARD"|"FILM_LIGHT"|"MUSIC_STANDARD"|"MUSIC_LIGHT"|"SPEECH"|string;
  export type Eac3AtmosDynamicRangeCompressionRf = "NONE"|"FILM_STANDARD"|"FILM_LIGHT"|"MUSIC_STANDARD"|"MUSIC_LIGHT"|"SPEECH"|string;
  export type Eac3AtmosDynamicRangeControl = "SPECIFIED"|"INITIALIZE_FROM_SOURCE"|string;
  export type Eac3AtmosMeteringMode = "LEQ_A"|"ITU_BS_1770_1"|"ITU_BS_1770_2"|"ITU_BS_1770_3"|"ITU_BS_1770_4"|string;
  export interface Eac3AtmosSettings {
    /**
     * Specify the average bitrate for this output in bits per second. Valid values: 384k, 448k, 576k, 640k, 768k, 1024k Default value: 448k Note that MediaConvert supports 384k only with channel-based immersive (CBI) 7.1.4 and 5.1.4 inputs. For CBI 9.1.6 and other input types, MediaConvert automatically increases your output bitrate to 448k.
     */
    Bitrate?: __integerMin384000Max1024000;
    /**
     * Specify the bitstream mode for the E-AC-3 stream that the encoder emits. For more information about the EAC3 bitstream mode, see ATSC A/52-2012 (Annex E).
     */
    BitstreamMode?: Eac3AtmosBitstreamMode;
    /**
     * The coding mode for Dolby Digital Plus JOC (Atmos).
     */
    CodingMode?: Eac3AtmosCodingMode;
    /**
     * Enable Dolby Dialogue Intelligence to adjust loudness based on dialogue analysis.
     */
    DialogueIntelligence?: Eac3AtmosDialogueIntelligence;
    /**
     * Specify whether MediaConvert should use any downmix metadata from your input file. Keep the default value, Custom (SPECIFIED) to provide downmix values in your job settings. Choose Follow source (INITIALIZE_FROM_SOURCE) to use the metadata from your input. Related settings--Use these settings to specify your downmix values: Left only/Right only surround (LoRoSurroundMixLevel), Left total/Right total surround (LtRtSurroundMixLevel), Left total/Right total center (LtRtCenterMixLevel), Left only/Right only center (LoRoCenterMixLevel),  and Stereo downmix (StereoDownmix). When you keep Custom (SPECIFIED) for Downmix control (DownmixControl) and you don't specify values for the related settings, MediaConvert uses default values for those settings.
     */
    DownmixControl?: Eac3AtmosDownmixControl;
    /**
     * Choose the Dolby dynamic range control (DRC) profile that MediaConvert uses when encoding the metadata in the Dolby stream for the line operating mode. Default value: Film light (ATMOS_STORAGE_DDP_COMPR_FILM_LIGHT) Related setting: To have MediaConvert use the value you specify here, keep the default value, Custom (SPECIFIED) for the setting Dynamic range control (DynamicRangeControl). Otherwise, MediaConvert ignores Dynamic range compression line (DynamicRangeCompressionLine). For information about the Dolby DRC operating modes and profiles, see the Dynamic Range Control chapter of the Dolby Metadata Guide at https://developer.dolby.com/globalassets/professional/documents/dolby-metadata-guide.pdf.
     */
    DynamicRangeCompressionLine?: Eac3AtmosDynamicRangeCompressionLine;
    /**
     * Choose the Dolby dynamic range control (DRC) profile that MediaConvert uses when encoding the metadata in the Dolby stream for the RF operating mode. Default value: Film light (ATMOS_STORAGE_DDP_COMPR_FILM_LIGHT) Related setting: To have MediaConvert use the value you specify here, keep the default value, Custom (SPECIFIED) for the setting Dynamic range control (DynamicRangeControl). Otherwise, MediaConvert ignores Dynamic range compression RF (DynamicRangeCompressionRf). For information about the Dolby DRC operating modes and profiles, see the Dynamic Range Control chapter of the Dolby Metadata Guide at https://developer.dolby.com/globalassets/professional/documents/dolby-metadata-guide.pdf.
     */
    DynamicRangeCompressionRf?: Eac3AtmosDynamicRangeCompressionRf;
    /**
     * Specify whether MediaConvert should use any dynamic range control metadata from your input file. Keep the default value, Custom (SPECIFIED), to provide dynamic range control values in your job settings. Choose Follow source (INITIALIZE_FROM_SOURCE) to use the metadata from your input. Related settings--Use these settings to specify your dynamic range control values: Dynamic range compression line (DynamicRangeCompressionLine) and Dynamic range compression RF (DynamicRangeCompressionRf). When you keep the value Custom (SPECIFIED) for Dynamic range control (DynamicRangeControl) and you don't specify values for the related settings, MediaConvert uses default values for those settings.
     */
    DynamicRangeControl?: Eac3AtmosDynamicRangeControl;
    /**
     * Specify a value for the following Dolby Atmos setting: Left only/Right only center mix (Lo/Ro center). MediaConvert uses this value for downmixing. Default value: -3 dB (ATMOS_STORAGE_DDP_MIXLEV_MINUS_3_DB). Valid values: 3.0, 1.5, 0.0, -1.5, -3.0, -4.5, and -6.0. Related setting: How the service uses this value depends on the value that you choose for Stereo downmix (Eac3AtmosStereoDownmix). Related setting: To have MediaConvert use this value, keep the default value, Custom (SPECIFIED) for the setting Downmix control (DownmixControl). Otherwise, MediaConvert ignores Left only/Right only center (LoRoCenterMixLevel).
     */
    LoRoCenterMixLevel?: __doubleMinNegative6Max3;
    /**
     * Specify a value for the following Dolby Atmos setting: Left only/Right only (Lo/Ro surround). MediaConvert uses this value for downmixing. Default value: -3 dB (ATMOS_STORAGE_DDP_MIXLEV_MINUS_3_DB). Valid values: -1.5, -3.0, -4.5, -6.0, and -60. The value -60 mutes the channel. Related setting: How the service uses this value depends on the value that you choose for Stereo downmix (Eac3AtmosStereoDownmix). Related setting: To have MediaConvert use this value, keep the default value, Custom (SPECIFIED) for the setting Downmix control (DownmixControl). Otherwise, MediaConvert ignores Left only/Right only surround (LoRoSurroundMixLevel).
     */
    LoRoSurroundMixLevel?: __doubleMinNegative60MaxNegative1;
    /**
     * Specify a value for the following Dolby Atmos setting: Left total/Right total center mix (Lt/Rt center). MediaConvert uses this value for downmixing. Default value: -3 dB (ATMOS_STORAGE_DDP_MIXLEV_MINUS_3_DB) Valid values: 3.0, 1.5, 0.0, -1.5, -3.0, -4.5, and -6.0. Related setting: How the service uses this value depends on the value that you choose for Stereo downmix (Eac3AtmosStereoDownmix). Related setting: To have MediaConvert use this value, keep the default value, Custom (SPECIFIED) for the setting Downmix control (DownmixControl). Otherwise, MediaConvert ignores Left total/Right total center (LtRtCenterMixLevel).
     */
    LtRtCenterMixLevel?: __doubleMinNegative6Max3;
    /**
     * Specify a value for the following Dolby Atmos setting: Left total/Right total surround mix (Lt/Rt surround). MediaConvert uses this value for downmixing. Default value: -3 dB (ATMOS_STORAGE_DDP_MIXLEV_MINUS_3_DB) Valid values: -1.5, -3.0, -4.5, -6.0, and -60. The value -60 mutes the channel. Related setting: How the service uses this value depends on the value that you choose for Stereo downmix (Eac3AtmosStereoDownmix). Related setting: To have MediaConvert use this value, keep the default value, Custom (SPECIFIED) for the setting Downmix control (DownmixControl). Otherwise, the service ignores Left total/Right total surround (LtRtSurroundMixLevel).
     */
    LtRtSurroundMixLevel?: __doubleMinNegative60MaxNegative1;
    /**
     * Choose how the service meters the loudness of your audio.
     */
    MeteringMode?: Eac3AtmosMeteringMode;
    /**
     * This value is always 48000. It represents the sample rate in Hz.
     */
    SampleRate?: __integerMin48000Max48000;
    /**
     * Specify the percentage of audio content, from 0% to 100%, that must be speech in order for the encoder to use the measured speech loudness as the overall program loudness. Default value: 15%
     */
    SpeechThreshold?: __integerMin0Max100;
    /**
     * Choose how the service does stereo downmixing. Default value: Not indicated (ATMOS_STORAGE_DDP_DMIXMOD_NOT_INDICATED) Related setting: To have MediaConvert use this value, keep the default value, Custom (SPECIFIED) for the setting Downmix control (DownmixControl). Otherwise, MediaConvert ignores Stereo downmix (StereoDownmix).
     */
    StereoDownmix?: Eac3AtmosStereoDownmix;
    /**
     * Specify whether your input audio has an additional center rear surround channel matrix encoded into your left and right surround channels.
     */
    SurroundExMode?: Eac3AtmosSurroundExMode;
  }
  export type Eac3AtmosStereoDownmix = "NOT_INDICATED"|"STEREO"|"SURROUND"|"DPL2"|string;
  export type Eac3AtmosSurroundExMode = "NOT_INDICATED"|"ENABLED"|"DISABLED"|string;
  export type Eac3AttenuationControl = "ATTENUATE_3_DB"|"NONE"|string;
  export type Eac3BitstreamMode = "COMPLETE_MAIN"|"COMMENTARY"|"EMERGENCY"|"HEARING_IMPAIRED"|"VISUALLY_IMPAIRED"|string;
  export type Eac3CodingMode = "CODING_MODE_1_0"|"CODING_MODE_2_0"|"CODING_MODE_3_2"|string;
  export type Eac3DcFilter = "ENABLED"|"DISABLED"|string;
  export type Eac3DynamicRangeCompressionLine = "NONE"|"FILM_STANDARD"|"FILM_LIGHT"|"MUSIC_STANDARD"|"MUSIC_LIGHT"|"SPEECH"|string;
  export type Eac3DynamicRangeCompressionRf = "NONE"|"FILM_STANDARD"|"FILM_LIGHT"|"MUSIC_STANDARD"|"MUSIC_LIGHT"|"SPEECH"|string;
  export type Eac3LfeControl = "LFE"|"NO_LFE"|string;
  export type Eac3LfeFilter = "ENABLED"|"DISABLED"|string;
  export type Eac3MetadataControl = "FOLLOW_INPUT"|"USE_CONFIGURED"|string;
  export type Eac3PassthroughControl = "WHEN_POSSIBLE"|"NO_PASSTHROUGH"|string;
  export type Eac3PhaseControl = "SHIFT_90_DEGREES"|"NO_SHIFT"|string;
  export interface Eac3Settings {
    /**
     * If set to ATTENUATE_3_DB, applies a 3 dB attenuation to the surround channels. Only used for 3/2 coding mode.
     */
    AttenuationControl?: Eac3AttenuationControl;
    /**
     * Specify the average bitrate in bits per second. Valid bitrates depend on the coding mode.
     */
    Bitrate?: __integerMin64000Max640000;
    /**
     * Specify the bitstream mode for the E-AC-3 stream that the encoder emits. For more information about the EAC3 bitstream mode, see ATSC A/52-2012 (Annex E).
     */
    BitstreamMode?: Eac3BitstreamMode;
    /**
     * Dolby Digital Plus coding mode. Determines number of channels.
     */
    CodingMode?: Eac3CodingMode;
    /**
     * Activates a DC highpass filter for all input channels.
     */
    DcFilter?: Eac3DcFilter;
    /**
     * Sets the dialnorm for the output. If blank and input audio is Dolby Digital Plus, dialnorm will be passed through.
     */
    Dialnorm?: __integerMin1Max31;
    /**
     * Choose the Dolby Digital dynamic range control (DRC) profile that MediaConvert uses when encoding the metadata in the Dolby Digital stream for the line operating mode. Related setting: When you use this setting, MediaConvert ignores any value you provide for Dynamic range compression profile (DynamicRangeCompressionProfile). For information about the Dolby Digital DRC operating modes and profiles, see the Dynamic Range Control chapter of the Dolby Metadata Guide at https://developer.dolby.com/globalassets/professional/documents/dolby-metadata-guide.pdf.
     */
    DynamicRangeCompressionLine?: Eac3DynamicRangeCompressionLine;
    /**
     * Choose the Dolby Digital dynamic range control (DRC) profile that MediaConvert uses when encoding the metadata in the Dolby Digital stream for the RF operating mode. Related setting: When you use this setting, MediaConvert ignores any value you provide for Dynamic range compression profile (DynamicRangeCompressionProfile). For information about the Dolby Digital DRC operating modes and profiles, see the Dynamic Range Control chapter of the Dolby Metadata Guide at https://developer.dolby.com/globalassets/professional/documents/dolby-metadata-guide.pdf.
     */
    DynamicRangeCompressionRf?: Eac3DynamicRangeCompressionRf;
    /**
     * When encoding 3/2 audio, controls whether the LFE channel is enabled
     */
    LfeControl?: Eac3LfeControl;
    /**
     * Applies a 120Hz lowpass filter to the LFE channel prior to encoding. Only valid with 3_2_LFE coding mode.
     */
    LfeFilter?: Eac3LfeFilter;
    /**
     * Specify a value for the following Dolby Digital Plus setting: Left only/Right only center mix (Lo/Ro center). MediaConvert uses this value for downmixing. How the service uses this value depends on the value that you choose for Stereo downmix (Eac3StereoDownmix). Valid values: 3.0, 1.5, 0.0, -1.5, -3.0, -4.5, -6.0, and -60. The value -60 mutes the channel. This setting applies only if you keep the default value of 3/2 - L, R, C, Ls, Rs (CODING_MODE_3_2) for the setting Coding mode (Eac3CodingMode). If you choose a different value for Coding mode, the service ignores Left only/Right only center (loRoCenterMixLevel).
     */
    LoRoCenterMixLevel?: __doubleMinNegative60Max3;
    /**
     * Specify a value for the following Dolby Digital Plus setting: Left only/Right only (Lo/Ro surround). MediaConvert uses this value for downmixing. How the service uses this value depends on the value that you choose for Stereo downmix (Eac3StereoDownmix). Valid values: -1.5, -3.0, -4.5, -6.0, and -60. The value -60 mutes the channel. This setting applies only if you keep the default value of 3/2 - L, R, C, Ls, Rs (CODING_MODE_3_2) for the setting Coding mode (Eac3CodingMode). If you choose a different value for Coding mode, the service ignores Left only/Right only surround (loRoSurroundMixLevel).
     */
    LoRoSurroundMixLevel?: __doubleMinNegative60MaxNegative1;
    /**
     * Specify a value for the following Dolby Digital Plus setting: Left total/Right total center mix (Lt/Rt center). MediaConvert uses this value for downmixing. How the service uses this value depends on the value that you choose for Stereo downmix (Eac3StereoDownmix). Valid values: 3.0, 1.5, 0.0, -1.5, -3.0, -4.5, -6.0, and -60. The value -60 mutes the channel. This setting applies only if you keep the default value of 3/2 - L, R, C, Ls, Rs (CODING_MODE_3_2) for the setting Coding mode (Eac3CodingMode). If you choose a different value for Coding mode, the service ignores Left total/Right total center (ltRtCenterMixLevel).
     */
    LtRtCenterMixLevel?: __doubleMinNegative60Max3;
    /**
     * Specify a value for the following Dolby Digital Plus setting: Left total/Right total surround mix (Lt/Rt surround). MediaConvert uses this value for downmixing. How the service uses this value depends on the value that you choose for Stereo downmix (Eac3StereoDownmix). Valid values: -1.5, -3.0, -4.5, -6.0, and -60. The value -60 mutes the channel. This setting applies only if you keep the default value of 3/2 - L, R, C, Ls, Rs (CODING_MODE_3_2) for the setting Coding mode (Eac3CodingMode). If you choose a different value for Coding mode, the service ignores Left total/Right total surround (ltRtSurroundMixLevel).
     */
    LtRtSurroundMixLevel?: __doubleMinNegative60MaxNegative1;
    /**
     * When set to FOLLOW_INPUT, encoder metadata will be sourced from the DD, DD+, or DolbyE decoder that supplied this audio data. If audio was not supplied from one of these streams, then the static metadata settings will be used.
     */
    MetadataControl?: Eac3MetadataControl;
    /**
     * When set to WHEN_POSSIBLE, input DD+ audio will be passed through if it is present on the input. this detection is dynamic over the life of the transcode. Inputs that alternate between DD+ and non-DD+ content will have a consistent DD+ output as the system alternates between passthrough and encoding.
     */
    PassthroughControl?: Eac3PassthroughControl;
    /**
     * Controls the amount of phase-shift applied to the surround channels. Only used for 3/2 coding mode.
     */
    PhaseControl?: Eac3PhaseControl;
    /**
     * This value is always 48000. It represents the sample rate in Hz.
     */
    SampleRate?: __integerMin48000Max48000;
    /**
     * Choose how the service does stereo downmixing. This setting only applies if you keep the default value of 3/2 - L, R, C, Ls, Rs (CODING_MODE_3_2) for the setting Coding mode (Eac3CodingMode). If you choose a different value for Coding mode, the service ignores Stereo downmix (Eac3StereoDownmix).
     */
    StereoDownmix?: Eac3StereoDownmix;
    /**
     * When encoding 3/2 audio, sets whether an extra center back surround channel is matrix encoded into the left and right surround channels.
     */
    SurroundExMode?: Eac3SurroundExMode;
    /**
     * When encoding 2/0 audio, sets whether Dolby Surround is matrix encoded into the two channels.
     */
    SurroundMode?: Eac3SurroundMode;
  }
  export type Eac3StereoDownmix = "NOT_INDICATED"|"LO_RO"|"LT_RT"|"DPL2"|string;
  export type Eac3SurroundExMode = "NOT_INDICATED"|"ENABLED"|"DISABLED"|string;
  export type Eac3SurroundMode = "NOT_INDICATED"|"ENABLED"|"DISABLED"|string;
  export type EmbeddedConvert608To708 = "UPCONVERT"|"DISABLED"|string;
  export interface EmbeddedDestinationSettings {
    /**
     * Ignore this setting unless your input captions are SCC format and your output captions are embedded in the video stream. Specify a CC number for each captions channel in this output. If you have two channels, choose CC numbers that aren't in the same field. For example, choose 1 and 3. For more information, see https://docs.aws.amazon.com/console/mediaconvert/dual-scc-to-embedded.
     */
    Destination608ChannelNumber?: __integerMin1Max4;
    /**
     * Ignore this setting unless your input captions are SCC format and you want both 608 and 708 captions embedded in your output stream. Optionally, specify the 708 service number for each output captions channel. Choose a different number for each channel. To use this setting, also set Force 608 to 708 upconvert (Convert608To708) to Upconvert (UPCONVERT) in your input captions selector settings. If you choose to upconvert but don't specify a 708 service number, MediaConvert uses the number that you specify for CC channel number (destination608ChannelNumber) for the 708 service number. For more information, see https://docs.aws.amazon.com/console/mediaconvert/dual-scc-to-embedded.
     */
    Destination708ServiceNumber?: __integerMin1Max6;
  }
  export interface EmbeddedSourceSettings {
    /**
     * Specify whether this set of input captions appears in your outputs in both 608 and 708 format. If you choose Upconvert (UPCONVERT), MediaConvert includes the captions data in two ways: it passes the 608 data through using the 608 compatibility bytes fields of the 708 wrapper, and it also translates the 608 data into 708.
     */
    Convert608To708?: EmbeddedConvert608To708;
    /**
     * Specifies the 608/708 channel number within the video track from which to extract captions. Unused for passthrough.
     */
    Source608ChannelNumber?: __integerMin1Max4;
    /**
     * Specifies the video track index used for extracting captions. The system only supports one input video track, so this should always be set to '1'.
     */
    Source608TrackNumber?: __integerMin1Max1;
    /**
     * By default, the service terminates any unterminated captions at the end of each input. If you want the caption to continue onto your next input, disable this setting.
     */
    TerminateCaptions?: EmbeddedTerminateCaptions;
  }
  export type EmbeddedTerminateCaptions = "END_OF_INPUT"|"DISABLED"|string;
  export interface Endpoint {
    /**
     * URL of endpoint
     */
    Url?: __string;
  }
  export interface EsamManifestConfirmConditionNotification {
    /**
     * Provide your ESAM ManifestConfirmConditionNotification XML document inside your JSON job settings. Form the XML document as per OC-SP-ESAM-API-I03-131025. The transcoder will use the Manifest Conditioning instructions in the message that you supply.
     */
    MccXml?: __stringPatternSNManifestConfirmConditionNotificationNS;
  }
  export interface EsamSettings {
    /**
     * Specifies an ESAM ManifestConfirmConditionNotification XML as per OC-SP-ESAM-API-I03-131025. The transcoder uses the manifest conditioning instructions that you provide in the setting MCC XML (mccXml).
     */
    ManifestConfirmConditionNotification?: EsamManifestConfirmConditionNotification;
    /**
     * Specifies the stream distance, in milliseconds, between the SCTE 35 messages that the transcoder places and the splice points that they refer to. If the time between the start of the asset and the SCTE-35 message is less than this value, then the transcoder places the SCTE-35 marker at the beginning of the stream.
     */
    ResponseSignalPreroll?: __integerMin0Max30000;
    /**
     * Specifies an ESAM SignalProcessingNotification XML as per OC-SP-ESAM-API-I03-131025. The transcoder uses the signal processing instructions that you provide in the setting SCC XML (sccXml).
     */
    SignalProcessingNotification?: EsamSignalProcessingNotification;
  }
  export interface EsamSignalProcessingNotification {
    /**
     * Provide your ESAM SignalProcessingNotification XML document inside your JSON job settings. Form the XML document as per OC-SP-ESAM-API-I03-131025. The transcoder will use the signal processing instructions in the message that you supply. Provide your ESAM SignalProcessingNotification XML document inside your JSON job settings. For your MPEG2-TS file outputs, if you want the service to place SCTE-35 markers at the insertion points you specify in the XML document, you must also enable SCTE-35 ESAM (scte35Esam). Note that you can either specify an ESAM XML document or enable SCTE-35 passthrough. You can't do both.
     */
    SccXml?: __stringPatternSNSignalProcessingNotificationNS;
  }
  export interface ExtendedDataServices {
    /**
     * The action to take on copy and redistribution control XDS packets.  If you select PASSTHROUGH, packets will not be changed. If you select STRIP, any packets will be removed in output captions.
     */
    CopyProtectionAction?: CopyProtectionAction;
    /**
     * The action to take on content advisory XDS packets.  If you select PASSTHROUGH, packets will not be changed. If you select STRIP, any packets will be removed in output captions.
     */
    VchipAction?: VchipAction;
  }
  export type F4vMoovPlacement = "PROGRESSIVE_DOWNLOAD"|"NORMAL"|string;
  export interface F4vSettings {
    /**
     * If set to PROGRESSIVE_DOWNLOAD, the MOOV atom is relocated to the beginning of the archive as required for progressive downloading. Otherwise it is placed normally at the end.
     */
    MoovPlacement?: F4vMoovPlacement;
  }
  export interface FileGroupSettings {
    /**
     * Use Destination (Destination) to specify the S3 output location and the output filename base. Destination accepts format identifiers. If you do not specify the base filename in the URI, the service will use the filename of the input file. If your job has multiple inputs, the service uses the filename of the first input file.
     */
    Destination?: __stringPatternS3;
    /**
     * Settings associated with the destination. Will vary based on the type of destination
     */
    DestinationSettings?: DestinationSettings;
  }
  export type FileSourceConvert608To708 = "UPCONVERT"|"DISABLED"|string;
  export interface FileSourceSettings {
    /**
     * Specify whether this set of input captions appears in your outputs in both 608 and 708 format. If you choose Upconvert (UPCONVERT), MediaConvert includes the captions data in two ways: it passes the 608 data through using the 608 compatibility bytes fields of the 708 wrapper, and it also translates the 608 data into 708.
     */
    Convert608To708?: FileSourceConvert608To708;
    /**
     * Ignore this setting unless your input captions format is SCC. To have the service compensate for differing frame rates between your input captions and input video, specify the frame rate of the captions file. Specify this value as a fraction. When you work directly in your JSON job specification, use the settings framerateNumerator and framerateDenominator. For example, you might specify 24 / 1 for 24 fps, 25 / 1 for 25 fps, 24000 / 1001 for 23.976 fps, or 30000 / 1001 for 29.97 fps.
     */
    Framerate?: CaptionSourceFramerate;
    /**
     * External caption file used for loading captions. Accepted file extensions are 'scc', 'ttml', 'dfxp', 'stl', 'srt', 'xml', 'smi', 'webvtt', and 'vtt'.
     */
    SourceFile?: __stringMin14PatternS3SccSCCTtmlTTMLDfxpDFXPStlSTLSrtSRTXmlXMLSmiSMIVttVTTWebvttWEBVTTHttpsSccSCCTtmlTTMLDfxpDFXPStlSTLSrtSRTXmlXMLSmiSMIVttVTTWebvttWEBVTT;
    /**
     * Optional. Use this setting when you need to adjust the sync between your sidecar captions and your video. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/time-delta-use-cases.html. Enter a positive or negative number to modify the times in the captions file. For example, type 15 to add 15 seconds to all the times in the captions file. Type -5 to subtract 5 seconds from the times in the captions file. You can optionally specify your time delta in milliseconds instead of seconds. When you do so, set the related setting, Time delta units (TimeDeltaUnits) to Milliseconds (MILLISECONDS). Note that, when you specify a time delta for timecode-based caption sources, such as SCC and STL, and your time delta isn't a multiple of the input frame rate, MediaConvert snaps the captions to the nearest frame. For example, when your input video frame rate is 25 fps and you specify 1010ms for time delta, MediaConvert delays your captions by 1000 ms.
     */
    TimeDelta?: __integerMinNegative2147483648Max2147483647;
    /**
     * When you use the setting Time delta (TimeDelta) to adjust the sync between your sidecar captions and your video, use this setting to specify the units for the delta that you specify. When you don't specify a value for Time delta units (TimeDeltaUnits), MediaConvert uses seconds by default.
     */
    TimeDeltaUnits?: FileSourceTimeDeltaUnits;
  }
  export type FileSourceTimeDeltaUnits = "SECONDS"|"MILLISECONDS"|string;
  export type FontScript = "AUTOMATIC"|"HANS"|"HANT"|string;
  export interface FrameCaptureSettings {
    /**
     * Frame capture will encode the first frame of the output stream, then one frame every framerateDenominator/framerateNumerator seconds. For example, settings of framerateNumerator = 1 and framerateDenominator = 3 (a rate of 1/3 frame per second) will capture the first frame, then 1 frame every 3s. Files will be named as filename.n.jpg where n is the 0-based sequence number of each Capture.
     */
    FramerateDenominator?: __integerMin1Max2147483647;
    /**
     * Frame capture will encode the first frame of the output stream, then one frame every framerateDenominator/framerateNumerator seconds. For example, settings of framerateNumerator = 1 and framerateDenominator = 3 (a rate of 1/3 frame per second) will capture the first frame, then 1 frame every 3s. Files will be named as filename.NNNNNNN.jpg where N is the 0-based frame sequence number zero padded to 7 decimal places.
     */
    FramerateNumerator?: __integerMin1Max2147483647;
    /**
     * Maximum number of captures (encoded jpg output files).
     */
    MaxCaptures?: __integerMin1Max10000000;
    /**
     * JPEG Quality - a higher value equals higher quality.
     */
    Quality?: __integerMin1Max100;
  }
  export interface GetJobRequest {
    /**
     * the job ID of the job.
     */
    Id: __string;
  }
  export interface GetJobResponse {
    /**
     * Each job converts an input file into an output file or files. For more information, see the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
     */
    Job?: Job;
  }
  export interface GetJobTemplateRequest {
    /**
     * The name of the job template.
     */
    Name: __string;
  }
  export interface GetJobTemplateResponse {
    /**
     * A job template is a pre-made set of encoding instructions that you can use to quickly create a job.
     */
    JobTemplate?: JobTemplate;
  }
  export interface GetPolicyRequest {
  }
  export interface GetPolicyResponse {
    /**
     * A policy configures behavior that you allow or disallow for your account. For information about MediaConvert policies, see the user guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
     */
    Policy?: Policy;
  }
  export interface GetPresetRequest {
    /**
     * The name of the preset.
     */
    Name: __string;
  }
  export interface GetPresetResponse {
    /**
     * A preset is a collection of preconfigured media conversion settings that you want MediaConvert to apply to the output during the conversion process.
     */
    Preset?: Preset;
  }
  export interface GetQueueRequest {
    /**
     * The name of the queue that you want information about.
     */
    Name: __string;
  }
  export interface GetQueueResponse {
    /**
     * You can use queues to manage the resources that are available to your AWS account for running multiple transcoding jobs at the same time. If you don't specify a queue, the service sends all jobs through the default queue. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-queues.html.
     */
    Queue?: Queue;
  }
  export type H264AdaptiveQuantization = "OFF"|"AUTO"|"LOW"|"MEDIUM"|"HIGH"|"HIGHER"|"MAX"|string;
  export type H264CodecLevel = "AUTO"|"LEVEL_1"|"LEVEL_1_1"|"LEVEL_1_2"|"LEVEL_1_3"|"LEVEL_2"|"LEVEL_2_1"|"LEVEL_2_2"|"LEVEL_3"|"LEVEL_3_1"|"LEVEL_3_2"|"LEVEL_4"|"LEVEL_4_1"|"LEVEL_4_2"|"LEVEL_5"|"LEVEL_5_1"|"LEVEL_5_2"|string;
  export type H264CodecProfile = "BASELINE"|"HIGH"|"HIGH_10BIT"|"HIGH_422"|"HIGH_422_10BIT"|"MAIN"|string;
  export type H264DynamicSubGop = "ADAPTIVE"|"STATIC"|string;
  export type H264EntropyEncoding = "CABAC"|"CAVLC"|string;
  export type H264FieldEncoding = "PAFF"|"FORCE_FIELD"|"MBAFF"|string;
  export type H264FlickerAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type H264FramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type H264FramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type H264GopBReference = "DISABLED"|"ENABLED"|string;
  export type H264GopSizeUnits = "FRAMES"|"SECONDS"|"AUTO"|string;
  export type H264InterlaceMode = "PROGRESSIVE"|"TOP_FIELD"|"BOTTOM_FIELD"|"FOLLOW_TOP_FIELD"|"FOLLOW_BOTTOM_FIELD"|string;
  export type H264ParControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type H264QualityTuningLevel = "SINGLE_PASS"|"SINGLE_PASS_HQ"|"MULTI_PASS_HQ"|string;
  export interface H264QvbrSettings {
    /**
     * Use this setting only when Rate control mode is QVBR and Quality tuning level is Multi-pass HQ. For Max average bitrate values suited to the complexity of your input video, the service limits the average bitrate of the video part of this output to the value that you choose. That is, the total size of the video element is less than or equal to the value you set multiplied by the number of seconds of encoded output.
     */
    MaxAverageBitrate?: __integerMin1000Max1152000000;
    /**
     * Use this setting only when you set Rate control mode (RateControlMode) to QVBR. Specify the target quality level for this output. MediaConvert determines the right number of bits to use for each part of the video to maintain the video quality that you specify. When you keep the default value, AUTO, MediaConvert picks a quality level for you, based on characteristics of your input video. If you prefer to specify a quality level, specify a number from 1 through 10. Use higher numbers for greater quality. Level 10 results in nearly lossless compression. The quality level for most broadcast-quality transcodes is between 6 and 9. Optionally, to specify a value between whole numbers, also provide a value for the setting qvbrQualityLevelFineTune. For example, if you want your QVBR quality level to be 7.33, set qvbrQualityLevel to 7 and set qvbrQualityLevelFineTune to .33.
     */
    QvbrQualityLevel?: __integerMin1Max10;
    /**
     * Optional. Specify a value here to set the QVBR quality to a level that is between whole numbers. For example, if you want your QVBR quality level to be 7.33, set qvbrQualityLevel to 7 and set qvbrQualityLevelFineTune to .33. MediaConvert rounds your QVBR quality level to the nearest third of a whole number. For example, if you set qvbrQualityLevel to 7 and you set qvbrQualityLevelFineTune to .25, your actual QVBR quality level is 7.33.
     */
    QvbrQualityLevelFineTune?: __doubleMin0Max1;
  }
  export type H264RateControlMode = "VBR"|"CBR"|"QVBR"|string;
  export type H264RepeatPps = "DISABLED"|"ENABLED"|string;
  export type H264ScanTypeConversionMode = "INTERLACED"|"INTERLACED_OPTIMIZE"|string;
  export type H264SceneChangeDetect = "DISABLED"|"ENABLED"|"TRANSITION_DETECTION"|string;
  export interface H264Settings {
    /**
     * Keep the default value, Auto (AUTO), for this setting to have MediaConvert automatically apply the best types of quantization for your video content. When you want to apply your quantization settings manually, you must set H264AdaptiveQuantization to a value other than Auto (AUTO). Use this setting to specify the strength of any adaptive quantization filters that you enable. If you don't want MediaConvert to do any adaptive quantization in this transcode, set Adaptive quantization (H264AdaptiveQuantization) to Off (OFF). Related settings: The value that you choose here applies to the following settings: H264FlickerAdaptiveQuantization, H264SpatialAdaptiveQuantization, and H264TemporalAdaptiveQuantization.
     */
    AdaptiveQuantization?: H264AdaptiveQuantization;
    /**
     * Specify the average bitrate in bits per second. Required for VBR and CBR. For MS Smooth outputs, bitrates must be unique when rounded down to the nearest multiple of 1000.
     */
    Bitrate?: __integerMin1000Max1152000000;
    /**
     * Specify an H.264 level that is consistent with your output video settings. If you aren't sure what level to specify, choose Auto (AUTO).
     */
    CodecLevel?: H264CodecLevel;
    /**
     * H.264 Profile. High 4:2:2 and 10-bit profiles are only available with the AVC-I License.
     */
    CodecProfile?: H264CodecProfile;
    /**
     * Choose Adaptive to improve subjective video quality for high-motion content. This will cause the service to use fewer B-frames (which infer information based on other frames) for high-motion portions of the video and more B-frames for low-motion portions. The maximum number of B-frames is limited by the value you provide for the setting B frames between reference frames (numberBFramesBetweenReferenceFrames).
     */
    DynamicSubGop?: H264DynamicSubGop;
    /**
     * Entropy encoding mode. Use CABAC (must be in Main or High profile) or CAVLC.
     */
    EntropyEncoding?: H264EntropyEncoding;
    /**
     * The video encoding method for your MPEG-4 AVC output. Keep the default value, PAFF, to have MediaConvert use PAFF encoding for interlaced outputs. Choose Force field (FORCE_FIELD) to disable PAFF encoding and create separate interlaced fields. Choose MBAFF to disable PAFF and have MediaConvert use MBAFF encoding for interlaced outputs.
     */
    FieldEncoding?: H264FieldEncoding;
    /**
     * Only use this setting when you change the default value, AUTO, for the setting H264AdaptiveQuantization. When you keep all defaults, excluding H264AdaptiveQuantization and all other adaptive quantization from your JSON job specification, MediaConvert automatically applies the best types of quantization for your video content. When you set H264AdaptiveQuantization to a value other than AUTO, the default value for H264FlickerAdaptiveQuantization is Disabled (DISABLED). Change this value to Enabled (ENABLED) to reduce I-frame pop. I-frame pop appears as a visual flicker that can arise when the encoder saves bits by copying some macroblocks many times from frame to frame, and then refreshes them at the I-frame. When you enable this setting, the encoder updates these macroblocks slightly more often to smooth out the flicker. To manually enable or disable H264FlickerAdaptiveQuantization, you must set Adaptive quantization (H264AdaptiveQuantization) to a value other than AUTO.
     */
    FlickerAdaptiveQuantization?: H264FlickerAdaptiveQuantization;
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: H264FramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: H264FramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max2147483647;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin1Max2147483647;
    /**
     * If enable, use reference B frames for GOP structures that have B frames > 1.
     */
    GopBReference?: H264GopBReference;
    /**
     * Specify the relative frequency of open to closed GOPs in this output. For example, if you want to allow four open GOPs and then require a closed GOP, set this value to 5. We recommend that you have the transcoder automatically choose this value for you based on characteristics of your input video. To enable this automatic behavior, keep the default value by leaving this setting out of your JSON job specification. In the console, do this by keeping the default empty value. If you do explicitly specify a value, for segmented outputs, don't set this value to 0.
     */
    GopClosedCadence?: __integerMin0Max2147483647;
    /**
     * Use this setting only when you set GOP mode control (GopSizeUnits) to Specified, frames (FRAMES) or Specified, seconds (SECONDS). Specify the GOP length using a whole number of frames or a decimal value of seconds. MediaConvert will interpret this value as frames or seconds depending on the value you choose for GOP mode control (GopSizeUnits). If you want to allow MediaConvert to automatically determine GOP size, leave GOP size blank and set GOP mode control to Auto (AUTO). If your output group specifies HLS, DASH, or CMAF, leave GOP size blank and set GOP mode control to Auto in each output in your output group.
     */
    GopSize?: __doubleMin0;
    /**
     * Specify how the transcoder determines GOP size for this output. We recommend that you have the transcoder automatically choose this value for you based on characteristics of your input video. To enable this automatic behavior, choose Auto (AUTO) and and leave GOP size (GopSize) blank. By default, if you don't specify GOP mode control (GopSizeUnits), MediaConvert will use automatic behavior. If your output group specifies HLS, DASH, or CMAF, set GOP mode control to Auto and leave GOP size blank in each output in your output group. To explicitly specify the GOP length, choose Specified, frames (FRAMES) or Specified, seconds (SECONDS) and then provide the GOP length in the related setting GOP size (GopSize).
     */
    GopSizeUnits?: H264GopSizeUnits;
    /**
     * Percentage of the buffer that should initially be filled (HRD buffer model).
     */
    HrdBufferInitialFillPercentage?: __integerMin0Max100;
    /**
     * Size of buffer (HRD buffer model) in bits. For example, enter five megabits as 5000000.
     */
    HrdBufferSize?: __integerMin0Max1152000000;
    /**
     * Choose the scan line type for the output. Keep the default value, Progressive (PROGRESSIVE) to create a progressive output, regardless of the scan type of your input. Use Top field first (TOP_FIELD) or Bottom field first (BOTTOM_FIELD) to create an output that's interlaced with the same field polarity throughout. Use Follow, default top (FOLLOW_TOP_FIELD) or Follow, default bottom (FOLLOW_BOTTOM_FIELD) to produce outputs with the same field polarity as the source. For jobs that have multiple inputs, the output field polarity might change over the course of the output. Follow behavior depends on the input scan type. If the source is interlaced, the output will be interlaced with the same polarity as the source. If the source is progressive, the output will be interlaced with top field bottom field first, depending on which of the Follow options you choose.
     */
    InterlaceMode?: H264InterlaceMode;
    /**
     * Maximum bitrate in bits/second. For example, enter five megabits per second as 5000000. Required when Rate control mode is QVBR.
     */
    MaxBitrate?: __integerMin1000Max1152000000;
    /**
     * Use this setting only when you also enable Scene change detection (SceneChangeDetect). This setting determines how the encoder manages the spacing between I-frames that it inserts as part of the I-frame cadence and the I-frames that it inserts for Scene change detection. We recommend that you have the transcoder automatically choose this value for you based on characteristics of your input video. To enable this automatic behavior, keep the default value by leaving this setting out of your JSON job specification. In the console, do this by keeping the default empty value. When you explicitly specify a value for this setting, the encoder determines whether to skip a cadence-driven I-frame by the value you set. For example, if you set Min I interval (minIInterval) to 5 and a cadence-driven I-frame would fall within 5 frames of a scene-change I-frame, then the encoder skips the cadence-driven I-frame. In this way, one GOP is shrunk slightly and one GOP is stretched slightly. When the cadence-driven I-frames are farther from the scene-change I-frame than the value you set, then the encoder leaves all I-frames in place and the GOPs surrounding the scene change are smaller than the usual cadence GOPs.
     */
    MinIInterval?: __integerMin0Max30;
    /**
     * This setting to determines the number of B-frames that MediaConvert puts between reference frames in this output. We recommend that you use automatic behavior to allow the transcoder to choose the best value based on characteristics of your input video. In the console, choose AUTO to select this automatic behavior. When you manually edit your JSON job specification, leave this setting out to choose automatic behavior. When you want to specify this number explicitly, choose a whole number from 0 through 7.
     */
    NumberBFramesBetweenReferenceFrames?: __integerMin0Max7;
    /**
     * Number of reference frames to use. The encoder may use more than requested if using B-frames and/or interlaced encoding.
     */
    NumberReferenceFrames?: __integerMin1Max6;
    /**
     * Optional. Specify how the service determines the pixel aspect ratio (PAR) for this output. The default behavior, Follow source (INITIALIZE_FROM_SOURCE), uses the PAR from your input video for your output. To specify a different PAR in the console, choose any value other than Follow source. To specify a different PAR by editing the JSON job specification, choose SPECIFIED. When you choose SPECIFIED for this setting, you must also specify values for the parNumerator and parDenominator settings.
     */
    ParControl?: H264ParControl;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parDenominator is 33.
     */
    ParDenominator?: __integerMin1Max2147483647;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parNumerator is 40.
     */
    ParNumerator?: __integerMin1Max2147483647;
    /**
     * Optional. Use Quality tuning level (qualityTuningLevel) to choose how you want to trade off encoding speed for output video quality. The default behavior is faster, lower quality, single-pass encoding.
     */
    QualityTuningLevel?: H264QualityTuningLevel;
    /**
     * Settings for quality-defined variable bitrate encoding with the H.265 codec. Use these settings only when you set QVBR for Rate control mode (RateControlMode).
     */
    QvbrSettings?: H264QvbrSettings;
    /**
     * Use this setting to specify whether this output has a variable bitrate (VBR), constant bitrate (CBR) or quality-defined variable bitrate (QVBR).
     */
    RateControlMode?: H264RateControlMode;
    /**
     * Places a PPS header on each encoded picture, even if repeated.
     */
    RepeatPps?: H264RepeatPps;
    /**
     * Use this setting for interlaced outputs, when your output frame rate is half of your input frame rate. In this situation, choose Optimized interlacing (INTERLACED_OPTIMIZE) to create a better quality interlaced output. In this case, each progressive frame from the input corresponds to an interlaced field in the output. Keep the default value, Basic interlacing (INTERLACED), for all other output frame rates. With basic interlacing, MediaConvert performs any frame rate conversion first and then interlaces the frames. When you choose Optimized interlacing and you set your output frame rate to a value that isn't suitable for optimized interlacing, MediaConvert automatically falls back to basic interlacing. Required settings: To use optimized interlacing, you must set Telecine (telecine) to None (NONE) or Soft (SOFT). You can't use optimized interlacing for hard telecine outputs. You must also set Interlace mode (interlaceMode) to a value other than Progressive (PROGRESSIVE).
     */
    ScanTypeConversionMode?: H264ScanTypeConversionMode;
    /**
     * Enable this setting to insert I-frames at scene changes that the service automatically detects. This improves video quality and is enabled by default. If this output uses QVBR, choose Transition detection (TRANSITION_DETECTION) for further video quality improvement. For more information about QVBR, see https://docs.aws.amazon.com/console/mediaconvert/cbr-vbr-qvbr.
     */
    SceneChangeDetect?: H264SceneChangeDetect;
    /**
     * Number of slices per picture. Must be less than or equal to the number of macroblock rows for progressive pictures, and less than or equal to half the number of macroblock rows for interlaced pictures.
     */
    Slices?: __integerMin1Max32;
    /**
     * Ignore this setting unless your input frame rate is 23.976 or 24 frames per second (fps). Enable slow PAL to create a 25 fps output. When you enable slow PAL, MediaConvert relabels the video frames to 25 fps and resamples your audio to keep it synchronized with the video. Note that enabling this setting will slightly reduce the duration of your video. Required settings: You must also set Framerate to 25. In your JSON job specification, set (framerateControl) to (SPECIFIED), (framerateNumerator) to 25 and (framerateDenominator) to 1.
     */
    SlowPal?: H264SlowPal;
    /**
     * Ignore this setting unless you need to comply with a specification that requires a specific value. If you don't have a specification requirement, we recommend that you adjust the softness of your output by using a lower value for the setting Sharpness (sharpness) or by enabling a noise reducer filter (noiseReducerFilter). The Softness (softness) setting specifies the quantization matrices that the encoder uses. Keep the default value, 0, for flat quantization. Choose the value 1 or 16 to use the default JVT softening quantization matricies from the H.264 specification. Choose a value from 17 to 128 to use planar interpolation. Increasing values from 17 to 128 result in increasing reduction of high-frequency data. The value 128 results in the softest video.
     */
    Softness?: __integerMin0Max128;
    /**
     * Only use this setting when you change the default value, Auto (AUTO), for the setting H264AdaptiveQuantization. When you keep all defaults, excluding H264AdaptiveQuantization and all other adaptive quantization from your JSON job specification, MediaConvert automatically applies the best types of quantization for your video content. When you set H264AdaptiveQuantization to a value other than AUTO, the default value for H264SpatialAdaptiveQuantization is Enabled (ENABLED). Keep this default value to adjust quantization within each frame based on spatial variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas that can sustain more distortion with no noticeable visual degradation and uses more bits on areas where any small distortion will be noticeable. For example, complex textured blocks are encoded with fewer bits and smooth textured blocks are encoded with more bits. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen with a lot of complex texture, you might choose to set H264SpatialAdaptiveQuantization to Disabled (DISABLED). Related setting: When you enable spatial adaptive quantization, set the value for Adaptive quantization (H264AdaptiveQuantization) depending on your content. For homogeneous content, such as cartoons and video games, set it to Low. For content with a wider variety of textures, set it to High or Higher. To manually enable or disable H264SpatialAdaptiveQuantization, you must set Adaptive quantization (H264AdaptiveQuantization) to a value other than AUTO.
     */
    SpatialAdaptiveQuantization?: H264SpatialAdaptiveQuantization;
    /**
     * Produces a bitstream compliant with SMPTE RP-2027.
     */
    Syntax?: H264Syntax;
    /**
     * When you do frame rate conversion from 23.976 frames per second (fps) to 29.97 fps, and your output scan type is interlaced, you can optionally enable hard or soft telecine to create a smoother picture. Hard telecine (HARD) produces a 29.97i output. Soft telecine (SOFT) produces an output with a 23.976 output that signals to the video player device to do the conversion during play back. When you keep the default value, None (NONE), MediaConvert does a standard frame rate conversion to 29.97 without doing anything with the field polarity to create a smoother picture.
     */
    Telecine?: H264Telecine;
    /**
     * Only use this setting when you change the default value, AUTO, for the setting H264AdaptiveQuantization. When you keep all defaults, excluding H264AdaptiveQuantization and all other adaptive quantization from your JSON job specification, MediaConvert automatically applies the best types of quantization for your video content. When you set H264AdaptiveQuantization to a value other than AUTO, the default value for H264TemporalAdaptiveQuantization is Enabled (ENABLED). Keep this default value to adjust quantization within each frame based on temporal variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas of the frame that aren't moving and uses more bits on complex objects with sharp edges that move a lot. For example, this feature improves the readability of text tickers on newscasts and scoreboards on sports matches. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen that doesn't have moving objects with sharp edges, such as sports athletes' faces, you might choose to set H264TemporalAdaptiveQuantization to Disabled (DISABLED). Related setting: When you enable temporal quantization, adjust the strength of the filter with the setting Adaptive quantization (adaptiveQuantization). To manually enable or disable H264TemporalAdaptiveQuantization, you must set Adaptive quantization (H264AdaptiveQuantization) to a value other than AUTO.
     */
    TemporalAdaptiveQuantization?: H264TemporalAdaptiveQuantization;
    /**
     * Inserts timecode for each frame as 4 bytes of an unregistered SEI message.
     */
    UnregisteredSeiTimecode?: H264UnregisteredSeiTimecode;
  }
  export type H264SlowPal = "DISABLED"|"ENABLED"|string;
  export type H264SpatialAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type H264Syntax = "DEFAULT"|"RP2027"|string;
  export type H264Telecine = "NONE"|"SOFT"|"HARD"|string;
  export type H264TemporalAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type H264UnregisteredSeiTimecode = "DISABLED"|"ENABLED"|string;
  export type H265AdaptiveQuantization = "OFF"|"LOW"|"MEDIUM"|"HIGH"|"HIGHER"|"MAX"|string;
  export type H265AlternateTransferFunctionSei = "DISABLED"|"ENABLED"|string;
  export type H265CodecLevel = "AUTO"|"LEVEL_1"|"LEVEL_2"|"LEVEL_2_1"|"LEVEL_3"|"LEVEL_3_1"|"LEVEL_4"|"LEVEL_4_1"|"LEVEL_5"|"LEVEL_5_1"|"LEVEL_5_2"|"LEVEL_6"|"LEVEL_6_1"|"LEVEL_6_2"|string;
  export type H265CodecProfile = "MAIN_MAIN"|"MAIN_HIGH"|"MAIN10_MAIN"|"MAIN10_HIGH"|"MAIN_422_8BIT_MAIN"|"MAIN_422_8BIT_HIGH"|"MAIN_422_10BIT_MAIN"|"MAIN_422_10BIT_HIGH"|string;
  export type H265DynamicSubGop = "ADAPTIVE"|"STATIC"|string;
  export type H265FlickerAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type H265FramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type H265FramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type H265GopBReference = "DISABLED"|"ENABLED"|string;
  export type H265GopSizeUnits = "FRAMES"|"SECONDS"|"AUTO"|string;
  export type H265InterlaceMode = "PROGRESSIVE"|"TOP_FIELD"|"BOTTOM_FIELD"|"FOLLOW_TOP_FIELD"|"FOLLOW_BOTTOM_FIELD"|string;
  export type H265ParControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type H265QualityTuningLevel = "SINGLE_PASS"|"SINGLE_PASS_HQ"|"MULTI_PASS_HQ"|string;
  export interface H265QvbrSettings {
    /**
     * Use this setting only when Rate control mode is QVBR and Quality tuning level is Multi-pass HQ. For Max average bitrate values suited to the complexity of your input video, the service limits the average bitrate of the video part of this output to the value that you choose. That is, the total size of the video element is less than or equal to the value you set multiplied by the number of seconds of encoded output.
     */
    MaxAverageBitrate?: __integerMin1000Max1466400000;
    /**
     * Use this setting only when you set Rate control mode (RateControlMode) to QVBR. Specify the target quality level for this output. MediaConvert determines the right number of bits to use for each part of the video to maintain the video quality that you specify. When you keep the default value, AUTO, MediaConvert picks a quality level for you, based on characteristics of your input video. If you prefer to specify a quality level, specify a number from 1 through 10. Use higher numbers for greater quality. Level 10 results in nearly lossless compression. The quality level for most broadcast-quality transcodes is between 6 and 9. Optionally, to specify a value between whole numbers, also provide a value for the setting qvbrQualityLevelFineTune. For example, if you want your QVBR quality level to be 7.33, set qvbrQualityLevel to 7 and set qvbrQualityLevelFineTune to .33.
     */
    QvbrQualityLevel?: __integerMin1Max10;
    /**
     * Optional. Specify a value here to set the QVBR quality to a level that is between whole numbers. For example, if you want your QVBR quality level to be 7.33, set qvbrQualityLevel to 7 and set qvbrQualityLevelFineTune to .33. MediaConvert rounds your QVBR quality level to the nearest third of a whole number. For example, if you set qvbrQualityLevel to 7 and you set qvbrQualityLevelFineTune to .25, your actual QVBR quality level is 7.33.
     */
    QvbrQualityLevelFineTune?: __doubleMin0Max1;
  }
  export type H265RateControlMode = "VBR"|"CBR"|"QVBR"|string;
  export type H265SampleAdaptiveOffsetFilterMode = "DEFAULT"|"ADAPTIVE"|"OFF"|string;
  export type H265ScanTypeConversionMode = "INTERLACED"|"INTERLACED_OPTIMIZE"|string;
  export type H265SceneChangeDetect = "DISABLED"|"ENABLED"|"TRANSITION_DETECTION"|string;
  export interface H265Settings {
    /**
     * Specify the strength of any adaptive quantization filters that you enable. The value that you choose here applies to the following settings: Flicker adaptive quantization (flickerAdaptiveQuantization), Spatial adaptive quantization (spatialAdaptiveQuantization), and Temporal adaptive quantization (temporalAdaptiveQuantization).
     */
    AdaptiveQuantization?: H265AdaptiveQuantization;
    /**
     * Enables Alternate Transfer Function SEI message for outputs using Hybrid Log Gamma (HLG) Electro-Optical Transfer Function (EOTF).
     */
    AlternateTransferFunctionSei?: H265AlternateTransferFunctionSei;
    /**
     * Specify the average bitrate in bits per second. Required for VBR and CBR. For MS Smooth outputs, bitrates must be unique when rounded down to the nearest multiple of 1000.
     */
    Bitrate?: __integerMin1000Max1466400000;
    /**
     * H.265 Level.
     */
    CodecLevel?: H265CodecLevel;
    /**
     * Represents the Profile and Tier, per the HEVC (H.265) specification. Selections are grouped as [Profile] / [Tier], so "Main/High" represents Main Profile with High Tier. 4:2:2 profiles are only available with the HEVC 4:2:2 License.
     */
    CodecProfile?: H265CodecProfile;
    /**
     * Choose Adaptive to improve subjective video quality for high-motion content. This will cause the service to use fewer B-frames (which infer information based on other frames) for high-motion portions of the video and more B-frames for low-motion portions. The maximum number of B-frames is limited by the value you provide for the setting B frames between reference frames (numberBFramesBetweenReferenceFrames).
     */
    DynamicSubGop?: H265DynamicSubGop;
    /**
     * Enable this setting to have the encoder reduce I-frame pop. I-frame pop appears as a visual flicker that can arise when the encoder saves bits by copying some macroblocks many times from frame to frame, and then refreshes them at the I-frame. When you enable this setting, the encoder updates these macroblocks slightly more often to smooth out the flicker. This setting is disabled by default. Related setting: In addition to enabling this setting, you must also set adaptiveQuantization to a value other than Off (OFF).
     */
    FlickerAdaptiveQuantization?: H265FlickerAdaptiveQuantization;
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: H265FramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: H265FramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max2147483647;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin1Max2147483647;
    /**
     * If enable, use reference B frames for GOP structures that have B frames > 1.
     */
    GopBReference?: H265GopBReference;
    /**
     * Specify the relative frequency of open to closed GOPs in this output. For example, if you want to allow four open GOPs and then require a closed GOP, set this value to 5. We recommend that you have the transcoder automatically choose this value for you based on characteristics of your input video. To enable this automatic behavior, keep the default value by leaving this setting out of your JSON job specification. In the console, do this by keeping the default empty value. If you do explicitly specify a value, for segmented outputs, don't set this value to 0.
     */
    GopClosedCadence?: __integerMin0Max2147483647;
    /**
     * Use this setting only when you set GOP mode control (GopSizeUnits) to Specified, frames (FRAMES) or Specified, seconds (SECONDS). Specify the GOP length using a whole number of frames or a decimal value of seconds. MediaConvert will interpret this value as frames or seconds depending on the value you choose for GOP mode control (GopSizeUnits). If you want to allow MediaConvert to automatically determine GOP size, leave GOP size blank and set GOP mode control to Auto (AUTO). If your output group specifies HLS, DASH, or CMAF, leave GOP size blank and set GOP mode control to Auto in each output in your output group.
     */
    GopSize?: __doubleMin0;
    /**
     * Specify how the transcoder determines GOP size for this output. We recommend that you have the transcoder automatically choose this value for you based on characteristics of your input video. To enable this automatic behavior, choose Auto (AUTO) and and leave GOP size (GopSize) blank. By default, if you don't specify GOP mode control (GopSizeUnits), MediaConvert will use automatic behavior. If your output group specifies HLS, DASH, or CMAF, set GOP mode control to Auto and leave GOP size blank in each output in your output group. To explicitly specify the GOP length, choose Specified, frames (FRAMES) or Specified, seconds (SECONDS) and then provide the GOP length in the related setting GOP size (GopSize).
     */
    GopSizeUnits?: H265GopSizeUnits;
    /**
     * Percentage of the buffer that should initially be filled (HRD buffer model).
     */
    HrdBufferInitialFillPercentage?: __integerMin0Max100;
    /**
     * Size of buffer (HRD buffer model) in bits. For example, enter five megabits as 5000000.
     */
    HrdBufferSize?: __integerMin0Max1466400000;
    /**
     * Choose the scan line type for the output. Keep the default value, Progressive (PROGRESSIVE) to create a progressive output, regardless of the scan type of your input. Use Top field first (TOP_FIELD) or Bottom field first (BOTTOM_FIELD) to create an output that's interlaced with the same field polarity throughout. Use Follow, default top (FOLLOW_TOP_FIELD) or Follow, default bottom (FOLLOW_BOTTOM_FIELD) to produce outputs with the same field polarity as the source. For jobs that have multiple inputs, the output field polarity might change over the course of the output. Follow behavior depends on the input scan type. If the source is interlaced, the output will be interlaced with the same polarity as the source. If the source is progressive, the output will be interlaced with top field bottom field first, depending on which of the Follow options you choose.
     */
    InterlaceMode?: H265InterlaceMode;
    /**
     * Maximum bitrate in bits/second. For example, enter five megabits per second as 5000000. Required when Rate control mode is QVBR.
     */
    MaxBitrate?: __integerMin1000Max1466400000;
    /**
     * Use this setting only when you also enable Scene change detection (SceneChangeDetect). This setting determines how the encoder manages the spacing between I-frames that it inserts as part of the I-frame cadence and the I-frames that it inserts for Scene change detection. We recommend that you have the transcoder automatically choose this value for you based on characteristics of your input video. To enable this automatic behavior, keep the default value by leaving this setting out of your JSON job specification. In the console, do this by keeping the default empty value. When you explicitly specify a value for this setting, the encoder determines whether to skip a cadence-driven I-frame by the value you set. For example, if you set Min I interval (minIInterval) to 5 and a cadence-driven I-frame would fall within 5 frames of a scene-change I-frame, then the encoder skips the cadence-driven I-frame. In this way, one GOP is shrunk slightly and one GOP is stretched slightly. When the cadence-driven I-frames are farther from the scene-change I-frame than the value you set, then the encoder leaves all I-frames in place and the GOPs surrounding the scene change are smaller than the usual cadence GOPs.
     */
    MinIInterval?: __integerMin0Max30;
    /**
     * Specify the number of B-frames that MediaConvert puts between reference frames in this output. Valid values are whole numbers from 0 through 7. When you don't specify a value, MediaConvert defaults to 2.
     */
    NumberBFramesBetweenReferenceFrames?: __integerMin0Max7;
    /**
     * Number of reference frames to use. The encoder may use more than requested if using B-frames and/or interlaced encoding.
     */
    NumberReferenceFrames?: __integerMin1Max6;
    /**
     * Optional. Specify how the service determines the pixel aspect ratio (PAR) for this output. The default behavior, Follow source (INITIALIZE_FROM_SOURCE), uses the PAR from your input video for your output. To specify a different PAR in the console, choose any value other than Follow source. To specify a different PAR by editing the JSON job specification, choose SPECIFIED. When you choose SPECIFIED for this setting, you must also specify values for the parNumerator and parDenominator settings.
     */
    ParControl?: H265ParControl;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parDenominator is 33.
     */
    ParDenominator?: __integerMin1Max2147483647;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parNumerator is 40.
     */
    ParNumerator?: __integerMin1Max2147483647;
    /**
     * Optional. Use Quality tuning level (qualityTuningLevel) to choose how you want to trade off encoding speed for output video quality. The default behavior is faster, lower quality, single-pass encoding.
     */
    QualityTuningLevel?: H265QualityTuningLevel;
    /**
     * Settings for quality-defined variable bitrate encoding with the H.265 codec. Use these settings only when you set QVBR for Rate control mode (RateControlMode).
     */
    QvbrSettings?: H265QvbrSettings;
    /**
     * Use this setting to specify whether this output has a variable bitrate (VBR), constant bitrate (CBR) or quality-defined variable bitrate (QVBR).
     */
    RateControlMode?: H265RateControlMode;
    /**
     * Specify Sample Adaptive Offset (SAO) filter strength.  Adaptive mode dynamically selects best strength based on content
     */
    SampleAdaptiveOffsetFilterMode?: H265SampleAdaptiveOffsetFilterMode;
    /**
     * Use this setting for interlaced outputs, when your output frame rate is half of your input frame rate. In this situation, choose Optimized interlacing (INTERLACED_OPTIMIZE) to create a better quality interlaced output. In this case, each progressive frame from the input corresponds to an interlaced field in the output. Keep the default value, Basic interlacing (INTERLACED), for all other output frame rates. With basic interlacing, MediaConvert performs any frame rate conversion first and then interlaces the frames. When you choose Optimized interlacing and you set your output frame rate to a value that isn't suitable for optimized interlacing, MediaConvert automatically falls back to basic interlacing. Required settings: To use optimized interlacing, you must set Telecine (telecine) to None (NONE) or Soft (SOFT). You can't use optimized interlacing for hard telecine outputs. You must also set Interlace mode (interlaceMode) to a value other than Progressive (PROGRESSIVE).
     */
    ScanTypeConversionMode?: H265ScanTypeConversionMode;
    /**
     * Enable this setting to insert I-frames at scene changes that the service automatically detects. This improves video quality and is enabled by default. If this output uses QVBR, choose Transition detection (TRANSITION_DETECTION) for further video quality improvement. For more information about QVBR, see https://docs.aws.amazon.com/console/mediaconvert/cbr-vbr-qvbr.
     */
    SceneChangeDetect?: H265SceneChangeDetect;
    /**
     * Number of slices per picture. Must be less than or equal to the number of macroblock rows for progressive pictures, and less than or equal to half the number of macroblock rows for interlaced pictures.
     */
    Slices?: __integerMin1Max32;
    /**
     * Ignore this setting unless your input frame rate is 23.976 or 24 frames per second (fps). Enable slow PAL to create a 25 fps output. When you enable slow PAL, MediaConvert relabels the video frames to 25 fps and resamples your audio to keep it synchronized with the video. Note that enabling this setting will slightly reduce the duration of your video. Required settings: You must also set Framerate to 25. In your JSON job specification, set (framerateControl) to (SPECIFIED), (framerateNumerator) to 25 and (framerateDenominator) to 1.
     */
    SlowPal?: H265SlowPal;
    /**
     * Keep the default value, Enabled (ENABLED), to adjust quantization within each frame based on spatial variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas that can sustain more distortion with no noticeable visual degradation and uses more bits on areas where any small distortion will be noticeable. For example, complex textured blocks are encoded with fewer bits and smooth textured blocks are encoded with more bits. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen with a lot of complex texture, you might choose to disable this feature. Related setting: When you enable spatial adaptive quantization, set the value for Adaptive quantization (adaptiveQuantization) depending on your content. For homogeneous content, such as cartoons and video games, set it to Low. For content with a wider variety of textures, set it to High or Higher.
     */
    SpatialAdaptiveQuantization?: H265SpatialAdaptiveQuantization;
    /**
     * This field applies only if the Streams > Advanced > Framerate (framerate) field  is set to 29.970. This field works with the Streams > Advanced > Preprocessors > Deinterlacer  field (deinterlace_mode) and the Streams > Advanced > Interlaced Mode field (interlace_mode)  to identify the scan type for the output: Progressive, Interlaced, Hard Telecine or Soft Telecine. - Hard: produces 29.97i output from 23.976 input. - Soft: produces 23.976; the player converts this output to 29.97i.
     */
    Telecine?: H265Telecine;
    /**
     * Keep the default value, Enabled (ENABLED), to adjust quantization within each frame based on temporal variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas of the frame that aren't moving and uses more bits on complex objects with sharp edges that move a lot. For example, this feature improves the readability of text tickers on newscasts and scoreboards on sports matches. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen that doesn't have moving objects with sharp edges, such as sports athletes' faces, you might choose to disable this feature. Related setting: When you enable temporal quantization, adjust the strength of the filter with the setting Adaptive quantization (adaptiveQuantization).
     */
    TemporalAdaptiveQuantization?: H265TemporalAdaptiveQuantization;
    /**
     * Enables temporal layer identifiers in the encoded bitstream. Up to 3 layers are supported depending on GOP structure: I- and P-frames form one layer, reference B-frames can form a second layer and non-reference b-frames can form a third layer. Decoders can optionally decode only the lower temporal layers to generate a lower frame rate output. For example, given a bitstream with temporal IDs and with b-frames = 1 (i.e. IbPbPb display order), a decoder could decode all the frames for full frame rate output or only the I and P frames (lowest temporal layer) for a half frame rate output.
     */
    TemporalIds?: H265TemporalIds;
    /**
     * Enable use of tiles, allowing horizontal as well as vertical subdivision of the encoded pictures.
     */
    Tiles?: H265Tiles;
    /**
     * Inserts timecode for each frame as 4 bytes of an unregistered SEI message.
     */
    UnregisteredSeiTimecode?: H265UnregisteredSeiTimecode;
    /**
     * If the location of parameter set NAL units doesn't matter in your workflow, ignore this setting. Use this setting only with CMAF or DASH outputs, or with standalone file outputs in an MPEG-4 container (MP4 outputs). Choose HVC1 to mark your output as HVC1. This makes your output compliant with the following specification: ISO IECJTC1 SC29 N13798 Text ISO/IEC FDIS 14496-15 3rd Edition. For these outputs, the service stores parameter set NAL units in the sample headers but not in the samples directly. For MP4 outputs, when you choose HVC1, your output video might not work properly with some downstream systems and video players. The service defaults to marking your output as HEV1. For these outputs, the service writes parameter set NAL units directly into the samples.
     */
    WriteMp4PackagingType?: H265WriteMp4PackagingType;
  }
  export type H265SlowPal = "DISABLED"|"ENABLED"|string;
  export type H265SpatialAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type H265Telecine = "NONE"|"SOFT"|"HARD"|string;
  export type H265TemporalAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type H265TemporalIds = "DISABLED"|"ENABLED"|string;
  export type H265Tiles = "DISABLED"|"ENABLED"|string;
  export type H265UnregisteredSeiTimecode = "DISABLED"|"ENABLED"|string;
  export type H265WriteMp4PackagingType = "HVC1"|"HEV1"|string;
  export interface Hdr10Metadata {
    /**
     * HDR Master Display Information must be provided by a color grader, using color grading tools. Range is 0 to 50,000, each increment represents 0.00002 in CIE1931 color coordinate. Note that this setting is not for color correction.
     */
    BluePrimaryX?: __integerMin0Max50000;
    /**
     * HDR Master Display Information must be provided by a color grader, using color grading tools. Range is 0 to 50,000, each increment represents 0.00002 in CIE1931 color coordinate. Note that this setting is not for color correction.
     */
    BluePrimaryY?: __integerMin0Max50000;
    /**
     * HDR Master Display Information must be provided by a color grader, using color grading tools. Range is 0 to 50,000, each increment represents 0.00002 in CIE1931 color coordinate. Note that this setting is not for color correction.
     */
    GreenPrimaryX?: __integerMin0Max50000;
    /**
     * HDR Master Display Information must be provided by a color grader, using color grading tools. Range is 0 to 50,000, each increment represents 0.00002 in CIE1931 color coordinate. Note that this setting is not for color correction.
     */
    GreenPrimaryY?: __integerMin0Max50000;
    /**
     * Maximum light level among all samples in the coded video sequence, in units of candelas per square meter.  This setting doesn't have a default value; you must specify a value that is suitable for the content.
     */
    MaxContentLightLevel?: __integerMin0Max65535;
    /**
     * Maximum average light level of any frame in the coded video sequence, in units of candelas per square meter. This setting doesn't have a default value; you must specify a value that is suitable for the content.
     */
    MaxFrameAverageLightLevel?: __integerMin0Max65535;
    /**
     * Nominal maximum mastering display luminance in units of of 0.0001 candelas per square meter.
     */
    MaxLuminance?: __integerMin0Max2147483647;
    /**
     * Nominal minimum mastering display luminance in units of of 0.0001 candelas per square meter
     */
    MinLuminance?: __integerMin0Max2147483647;
    /**
     * HDR Master Display Information must be provided by a color grader, using color grading tools. Range is 0 to 50,000, each increment represents 0.00002 in CIE1931 color coordinate. Note that this setting is not for color correction.
     */
    RedPrimaryX?: __integerMin0Max50000;
    /**
     * HDR Master Display Information must be provided by a color grader, using color grading tools. Range is 0 to 50,000, each increment represents 0.00002 in CIE1931 color coordinate. Note that this setting is not for color correction.
     */
    RedPrimaryY?: __integerMin0Max50000;
    /**
     * HDR Master Display Information must be provided by a color grader, using color grading tools. Range is 0 to 50,000, each increment represents 0.00002 in CIE1931 color coordinate. Note that this setting is not for color correction.
     */
    WhitePointX?: __integerMin0Max50000;
    /**
     * HDR Master Display Information must be provided by a color grader, using color grading tools. Range is 0 to 50,000, each increment represents 0.00002 in CIE1931 color coordinate. Note that this setting is not for color correction.
     */
    WhitePointY?: __integerMin0Max50000;
  }
  export interface Hdr10Plus {
    /**
     * Specify the HDR10+ mastering display normalized peak luminance, in nits. This is the normalized actual peak luminance of the mastering display, as defined by ST 2094-40.
     */
    MasteringMonitorNits?: __integerMin0Max4000;
    /**
     * Specify the HDR10+ target display nominal peak luminance, in nits. This is the nominal maximum luminance of the target display as defined by ST 2094-40.
     */
    TargetMonitorNits?: __integerMin0Max4000;
  }
  export type HlsAdMarkers = "ELEMENTAL"|"ELEMENTAL_SCTE35"|string;
  export interface HlsAdditionalManifest {
    /**
     * Specify a name modifier that the service adds to the name of this manifest to make it different from the file names of the other main manifests in the output group. For example, say that the default main manifest for your HLS group is film-name.m3u8. If you enter "-no-premium" for this setting, then the file name the service generates for this top-level manifest is film-name-no-premium.m3u8. For HLS output groups, specify a manifestNameModifier that is different from the nameModifier of the output. The service uses the output name modifier to create unique names for the individual variant manifests.
     */
    ManifestNameModifier?: __stringMin1;
    /**
     * Specify the outputs that you want this additional top-level manifest to reference.
     */
    SelectedOutputs?: __listOf__stringMin1;
  }
  export type HlsAudioOnlyContainer = "AUTOMATIC"|"M2TS"|string;
  export type HlsAudioOnlyHeader = "INCLUDE"|"EXCLUDE"|string;
  export type HlsAudioTrackType = "ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT"|"ALTERNATE_AUDIO_AUTO_SELECT"|"ALTERNATE_AUDIO_NOT_AUTO_SELECT"|"AUDIO_ONLY_VARIANT_STREAM"|string;
  export interface HlsCaptionLanguageMapping {
    /**
     * Caption channel.
     */
    CaptionChannel?: __integerMinNegative2147483648Max2147483647;
    /**
     * Specify the language for this captions channel, using the ISO 639-2 or ISO 639-3 three-letter language code
     */
    CustomLanguageCode?: __stringMin3Max3PatternAZaZ3;
    /**
     * Specify the language, using the ISO 639-2 three-letter code listed at https://www.loc.gov/standards/iso639-2/php/code_list.php.
     */
    LanguageCode?: LanguageCode;
    /**
     * Caption language description.
     */
    LanguageDescription?: __string;
  }
  export type HlsCaptionLanguageSetting = "INSERT"|"OMIT"|"NONE"|string;
  export type HlsClientCache = "DISABLED"|"ENABLED"|string;
  export type HlsCodecSpecification = "RFC_6381"|"RFC_4281"|string;
  export type HlsDescriptiveVideoServiceFlag = "DONT_FLAG"|"FLAG"|string;
  export type HlsDirectoryStructure = "SINGLE_DIRECTORY"|"SUBDIRECTORY_PER_STREAM"|string;
  export interface HlsEncryptionSettings {
    /**
     * This is a 128-bit, 16-byte hex value represented by a 32-character text string. If this parameter is not set then the Initialization Vector will follow the segment number by default.
     */
    ConstantInitializationVector?: __stringMin32Max32Pattern09aFAF32;
    /**
     * Encrypts the segments with the given encryption scheme. Leave blank to disable. Selecting 'Disabled' in the web interface also disables encryption.
     */
    EncryptionMethod?: HlsEncryptionType;
    /**
     * The Initialization Vector is a 128-bit number used in conjunction with the key for encrypting blocks. If set to INCLUDE, Initialization Vector is listed in the manifest. Otherwise Initialization Vector is not in the manifest.
     */
    InitializationVectorInManifest?: HlsInitializationVectorInManifest;
    /**
     * Enable this setting to insert the EXT-X-SESSION-KEY element into the master playlist. This allows for offline Apple HLS FairPlay content protection.
     */
    OfflineEncrypted?: HlsOfflineEncrypted;
    /**
     * If your output group type is HLS, DASH, or Microsoft Smooth, use these settings when doing DRM encryption with a SPEKE-compliant key provider.  If your output group type is CMAF, use the SpekeKeyProviderCmaf settings instead.
     */
    SpekeKeyProvider?: SpekeKeyProvider;
    /**
     * Use these settings to set up encryption with a static key provider.
     */
    StaticKeyProvider?: StaticKeyProvider;
    /**
     * Specify whether your DRM encryption key is static or from a key provider that follows the SPEKE standard. For more information about SPEKE, see https://docs.aws.amazon.com/speke/latest/documentation/what-is-speke.html.
     */
    Type?: HlsKeyProviderType;
  }
  export type HlsEncryptionType = "AES128"|"SAMPLE_AES"|string;
  export interface HlsGroupSettings {
    /**
     * Choose one or more ad marker types to decorate your Apple HLS manifest. This setting does not determine whether SCTE-35 markers appear in the outputs themselves.
     */
    AdMarkers?: __listOfHlsAdMarkers;
    /**
     * By default, the service creates one top-level .m3u8 HLS manifest for each HLS output group in your job. This default manifest references every output in the output group. To create additional top-level manifests that reference a subset of the outputs in the output group, specify a list of them here.
     */
    AdditionalManifests?: __listOfHlsAdditionalManifest;
    /**
     * Ignore this setting unless you are using FairPlay DRM with Verimatrix and you encounter playback issues. Keep the default value, Include (INCLUDE), to output audio-only headers. Choose Exclude (EXCLUDE) to remove the audio-only headers from your audio segments.
     */
    AudioOnlyHeader?: HlsAudioOnlyHeader;
    /**
     * A partial URI prefix that will be prepended to each output in the media .m3u8 file. Can be used if base manifest is delivered from a different URL than the main .m3u8 file.
     */
    BaseUrl?: __string;
    /**
     * Language to be used on Caption outputs
     */
    CaptionLanguageMappings?: __listOfHlsCaptionLanguageMapping;
    /**
     * Applies only to 608 Embedded output captions. Insert: Include CLOSED-CAPTIONS lines in the manifest. Specify at least one language in the CC1 Language Code field. One CLOSED-CAPTION line is added for each Language Code you specify. Make sure to specify the languages in the order in which they appear in the original source (if the source is embedded format) or the order of the caption selectors (if the source is other than embedded). Otherwise, languages in the manifest will not match up properly with the output captions. None: Include CLOSED-CAPTIONS=NONE line in the manifest. Omit: Omit any CLOSED-CAPTIONS line from the manifest.
     */
    CaptionLanguageSetting?: HlsCaptionLanguageSetting;
    /**
     * Disable this setting only when your workflow requires the #EXT-X-ALLOW-CACHE:no tag. Otherwise, keep the default value Enabled (ENABLED) and control caching in your video distribution set up. For example, use the Cache-Control http header.
     */
    ClientCache?: HlsClientCache;
    /**
     * Specification to use (RFC-6381 or the default RFC-4281) during m3u8 playlist generation.
     */
    CodecSpecification?: HlsCodecSpecification;
    /**
     * Use Destination (Destination) to specify the S3 output location and the output filename base. Destination accepts format identifiers. If you do not specify the base filename in the URI, the service will use the filename of the input file. If your job has multiple inputs, the service uses the filename of the first input file.
     */
    Destination?: __stringPatternS3;
    /**
     * Settings associated with the destination. Will vary based on the type of destination
     */
    DestinationSettings?: DestinationSettings;
    /**
     * Indicates whether segments should be placed in subdirectories.
     */
    DirectoryStructure?: HlsDirectoryStructure;
    /**
     * DRM settings.
     */
    Encryption?: HlsEncryptionSettings;
    /**
     * Specify whether MediaConvert generates images for trick play. Keep the default value, None (NONE), to not generate any images. Choose Thumbnail (THUMBNAIL) to generate tiled thumbnails. Choose Thumbnail and full frame (THUMBNAIL_AND_FULLFRAME) to generate tiled thumbnails and full-resolution images of single frames. MediaConvert creates a child manifest for each set of images that you generate and adds corresponding entries to the parent manifest. A common application for these images is Roku trick mode. The thumbnails and full-frame images that MediaConvert creates with this feature are compatible with this Roku specification: https://developer.roku.com/docs/developer-program/media-playback/trick-mode/hls-and-dash.md
     */
    ImageBasedTrickPlay?: HlsImageBasedTrickPlay;
    /**
     * Tile and thumbnail settings applicable when imageBasedTrickPlay is ADVANCED
     */
    ImageBasedTrickPlaySettings?: HlsImageBasedTrickPlaySettings;
    /**
     * When set to GZIP, compresses HLS playlist.
     */
    ManifestCompression?: HlsManifestCompression;
    /**
     * Indicates whether the output manifest should use floating point values for segment duration.
     */
    ManifestDurationFormat?: HlsManifestDurationFormat;
    /**
     * Keep this setting at the default value of 0, unless you are troubleshooting a problem with how devices play back the end of your video asset. If you know that player devices are hanging on the final segment of your video because the length of your final segment is too short, use this setting to specify a minimum final segment length, in seconds. Choose a value that is greater than or equal to 1 and less than your segment length. When you specify a value for this setting, the encoder will combine any final segment that is shorter than the length that you specify with the previous segment. For example, your segment length is 3 seconds and your final segment is .5 seconds without a minimum final segment length; when you set the minimum final segment length to 1, your final segment is 3.5 seconds.
     */
    MinFinalSegmentLength?: __doubleMin0Max2147483647;
    /**
     * When set, Minimum Segment Size is enforced by looking ahead and back within the specified range for a nearby avail and extending the segment size if needed.
     */
    MinSegmentLength?: __integerMin0Max2147483647;
    /**
     * Indicates whether the .m3u8 manifest file should be generated for this HLS output group.
     */
    OutputSelection?: HlsOutputSelection;
    /**
     * Includes or excludes EXT-X-PROGRAM-DATE-TIME tag in .m3u8 manifest files. The value is calculated as follows: either the program date and time are initialized using the input timecode source, or the time is initialized using the input timecode source and the date is initialized using the timestamp_offset.
     */
    ProgramDateTime?: HlsProgramDateTime;
    /**
     * Period of insertion of EXT-X-PROGRAM-DATE-TIME entry, in seconds.
     */
    ProgramDateTimePeriod?: __integerMin0Max3600;
    /**
     * When set to SINGLE_FILE, emits program as a single media resource (.ts) file, uses #EXT-X-BYTERANGE tags to index segment for playback.
     */
    SegmentControl?: HlsSegmentControl;
    /**
     * Specify the length, in whole seconds, of each segment. When you don't specify a value, MediaConvert defaults to 10. Related settings: Use Segment length control (SegmentLengthControl) to specify whether the encoder enforces this value strictly. Use Segment control (HlsSegmentControl) to specify whether MediaConvert creates separate segment files or one content file that has metadata to mark the segment boundaries.
     */
    SegmentLength?: __integerMin1Max2147483647;
    /**
     * Specify how you want MediaConvert to determine the segment length. Choose Exact (EXACT) to have the encoder use the exact length that you specify with the setting Segment length (SegmentLength). This might result in extra I-frames. Choose Multiple of GOP (GOP_MULTIPLE) to have the encoder round up the segment lengths to match the next GOP boundary.
     */
    SegmentLengthControl?: HlsSegmentLengthControl;
    /**
     * Number of segments to write to a subdirectory before starting a new one. directoryStructure must be SINGLE_DIRECTORY for this setting to have an effect.
     */
    SegmentsPerSubdirectory?: __integerMin1Max2147483647;
    /**
     * Include or exclude RESOLUTION attribute for video in EXT-X-STREAM-INF tag of variant manifest.
     */
    StreamInfResolution?: HlsStreamInfResolution;
    /**
     * When set to LEGACY, the segment target duration is always rounded up to the nearest integer value above its current value in seconds. When set to SPEC\\_COMPLIANT, the segment target duration is rounded up to the nearest integer value if fraction seconds are greater than or equal to 0.5 (>= 0.5) and rounded down if less than 0.5 (< 0.5). You may need to use LEGACY if your client needs to ensure that the target duration is always longer than the actual duration of the segment. Some older players may experience interrupted playback when the actual duration of a track in a segment is longer than the target duration.
     */
    TargetDurationCompatibilityMode?: HlsTargetDurationCompatibilityMode;
    /**
     * Indicates ID3 frame that has the timecode.
     */
    TimedMetadataId3Frame?: HlsTimedMetadataId3Frame;
    /**
     * Timed Metadata interval in seconds.
     */
    TimedMetadataId3Period?: __integerMinNegative2147483648Max2147483647;
    /**
     * Provides an extra millisecond delta offset to fine tune the timestamps.
     */
    TimestampDeltaMilliseconds?: __integerMinNegative2147483648Max2147483647;
  }
  export type HlsIFrameOnlyManifest = "INCLUDE"|"EXCLUDE"|string;
  export type HlsImageBasedTrickPlay = "NONE"|"THUMBNAIL"|"THUMBNAIL_AND_FULLFRAME"|"ADVANCED"|string;
  export interface HlsImageBasedTrickPlaySettings {
    /**
     * The cadence MediaConvert follows for generating thumbnails.  If set to FOLLOW_IFRAME, MediaConvert generates thumbnails for each IDR frame in the output (matching the GOP cadence).  If set to FOLLOW_CUSTOM, MediaConvert generates thumbnails according to the interval you specify in thumbnailInterval.
     */
    IntervalCadence?: HlsIntervalCadence;
    /**
     * Height of each thumbnail within each tile image, in pixels.  Leave blank to maintain aspect ratio with thumbnail width.  If following the aspect ratio would lead to a total tile height greater than 4096, then the job will be rejected.  Must be divisible by 2.
     */
    ThumbnailHeight?: __integerMin2Max4096;
    /**
     * Enter the interval, in seconds, that MediaConvert uses to generate thumbnails.  If the interval you enter doesn't align with the output frame rate, MediaConvert automatically rounds the interval to align with the output frame rate.  For example, if the output frame rate is 29.97 frames per second and you enter 5, MediaConvert uses a 150 frame interval to generate thumbnails.
     */
    ThumbnailInterval?: __doubleMin0Max2147483647;
    /**
     * Width of each thumbnail within each tile image, in pixels.  Default is 312.  Must be divisible by 8.
     */
    ThumbnailWidth?: __integerMin8Max4096;
    /**
     * Number of thumbnails in each column of a tile image. Set a value between 2 and 2048. Must be divisible by 2.
     */
    TileHeight?: __integerMin1Max2048;
    /**
     * Number of thumbnails in each row of a tile image.  Set a value between 1 and 512.
     */
    TileWidth?: __integerMin1Max512;
  }
  export type HlsInitializationVectorInManifest = "INCLUDE"|"EXCLUDE"|string;
  export type HlsIntervalCadence = "FOLLOW_IFRAME"|"FOLLOW_CUSTOM"|string;
  export type HlsKeyProviderType = "SPEKE"|"STATIC_KEY"|string;
  export type HlsManifestCompression = "GZIP"|"NONE"|string;
  export type HlsManifestDurationFormat = "FLOATING_POINT"|"INTEGER"|string;
  export type HlsOfflineEncrypted = "ENABLED"|"DISABLED"|string;
  export type HlsOutputSelection = "MANIFESTS_AND_SEGMENTS"|"SEGMENTS_ONLY"|string;
  export type HlsProgramDateTime = "INCLUDE"|"EXCLUDE"|string;
  export interface HlsRenditionGroupSettings {
    /**
     * Optional. Specify alternative group ID
     */
    RenditionGroupId?: __string;
    /**
     * Optional. Specify ISO 639-2 or ISO 639-3 code in the language property
     */
    RenditionLanguageCode?: LanguageCode;
    /**
     * Optional. Specify media name
     */
    RenditionName?: __string;
  }
  export type HlsSegmentControl = "SINGLE_FILE"|"SEGMENTED_FILES"|string;
  export type HlsSegmentLengthControl = "EXACT"|"GOP_MULTIPLE"|string;
  export interface HlsSettings {
    /**
     * Specifies the group to which the audio rendition belongs.
     */
    AudioGroupId?: __string;
    /**
     * Use this setting only in audio-only outputs. Choose MPEG-2 Transport Stream (M2TS) to create a file in an MPEG2-TS container. Keep the default value Automatic (AUTOMATIC) to create an audio-only file in a raw container. Regardless of the value that you specify here, if this output has video, the service will place the output into an MPEG2-TS container.
     */
    AudioOnlyContainer?: HlsAudioOnlyContainer;
    /**
     * List all the audio groups that are used with the video output stream. Input all the audio GROUP-IDs that are associated to the video, separate by ','.
     */
    AudioRenditionSets?: __string;
    /**
     * Four types of audio-only tracks are supported: Audio-Only Variant Stream The client can play back this audio-only stream instead of video in low-bandwidth scenarios. Represented as an EXT-X-STREAM-INF in the HLS manifest. Alternate Audio, Auto Select, Default Alternate rendition that the client should try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=YES, AUTOSELECT=YES Alternate Audio, Auto Select, Not Default Alternate rendition that the client may try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=NO, AUTOSELECT=YES Alternate Audio, not Auto Select Alternate rendition that the client will not try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=NO, AUTOSELECT=NO
     */
    AudioTrackType?: HlsAudioTrackType;
    /**
     * Specify whether to flag this audio track as descriptive video service (DVS) in your HLS parent manifest. When you choose Flag (FLAG), MediaConvert includes the parameter CHARACTERISTICS="public.accessibility.describes-video" in the EXT-X-MEDIA entry for this track. When you keep the default choice, Don't flag (DONT_FLAG), MediaConvert leaves this parameter out. The DVS flag can help with accessibility on Apple devices. For more information, see the Apple documentation.
     */
    DescriptiveVideoServiceFlag?: HlsDescriptiveVideoServiceFlag;
    /**
     * Choose Include (INCLUDE) to have MediaConvert generate a child manifest that lists only the I-frames for this rendition, in addition to your regular manifest for this rendition. You might use this manifest as part of a workflow that creates preview functions for your video. MediaConvert adds both the I-frame only child manifest and the regular child manifest to the parent manifest. When you don't need the I-frame only child manifest, keep the default value Exclude (EXCLUDE).
     */
    IFrameOnlyManifest?: HlsIFrameOnlyManifest;
    /**
     * Use this setting to add an identifying string to the filename of each segment. The service adds this string between the name modifier and segment index number. You can use format identifiers in the string. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/using-variables-in-your-job-settings.html
     */
    SegmentModifier?: __string;
  }
  export type HlsStreamInfResolution = "INCLUDE"|"EXCLUDE"|string;
  export type HlsTargetDurationCompatibilityMode = "LEGACY"|"SPEC_COMPLIANT"|string;
  export type HlsTimedMetadataId3Frame = "NONE"|"PRIV"|"TDRL"|string;
  export interface HopDestination {
    /**
     * Optional. When you set up a job to use queue hopping, you can specify a different relative priority for the job in the destination queue. If you don't specify, the relative priority will remain the same as in the previous queue.
     */
    Priority?: __integerMinNegative50Max50;
    /**
     * Optional unless the job is submitted on the default queue. When you set up a job to use queue hopping, you can specify a destination queue. This queue cannot be the original queue to which the job is submitted. If the original queue isn't the default queue and you don't specify the destination queue, the job will move to the default queue.
     */
    Queue?: __string;
    /**
     * Required for setting up a job to use queue hopping. Minimum wait time in minutes until the job can hop to the destination queue. Valid range is 1 to 1440 minutes, inclusive.
     */
    WaitMinutes?: __integer;
  }
  export interface Id3Insertion {
    /**
     * Use ID3 tag (Id3) to provide a tag value in base64-encode format.
     */
    Id3?: __stringPatternAZaZ0902;
    /**
     * Provide a Timecode (TimeCode) in HH:MM:SS:FF or HH:MM:SS;FF format.
     */
    Timecode?: __stringPattern010920405090509092;
  }
  export interface ImageInserter {
    /**
     * Specify the images that you want to overlay on your video. The images must be PNG or TGA files.
     */
    InsertableImages?: __listOfInsertableImage;
  }
  export interface ImscDestinationSettings {
    /**
     * Keep this setting enabled to have MediaConvert use the font style and position information from the captions source in the output. This option is available only when your input captions are IMSC, SMPTE-TT, or TTML. Disable this setting for simplified output captions.
     */
    StylePassthrough?: ImscStylePassthrough;
  }
  export type ImscStylePassthrough = "ENABLED"|"DISABLED"|string;
  export interface Input {
    /**
     * Use audio selector groups to combine multiple sidecar audio inputs so that you can assign them to a single output audio tab (AudioDescription). Note that, if you're working with embedded audio, it's simpler to assign multiple input tracks into a single audio selector rather than use an audio selector group.
     */
    AudioSelectorGroups?: __mapOfAudioSelectorGroup;
    /**
     * Use Audio selectors (AudioSelectors) to specify a track or set of tracks from the input that you will use in your outputs. You can use multiple Audio selectors per input.
     */
    AudioSelectors?: __mapOfAudioSelector;
    /**
     * Use captions selectors to specify the captions data from your input that you use in your outputs. You can use up to 20 captions selectors per input.
     */
    CaptionSelectors?: __mapOfCaptionSelector;
    /**
     * Use Cropping selection (crop) to specify the video area that the service will include in the output video frame. If you specify a value here, it will override any value that you specify in the output setting Cropping selection (crop).
     */
    Crop?: Rectangle;
    /**
     * Enable Deblock (InputDeblockFilter) to produce smoother motion in the output. Default is disabled. Only manually controllable for MPEG2 and uncompressed video inputs.
     */
    DeblockFilter?: InputDeblockFilter;
    /**
     * Settings for decrypting any input files that you encrypt before you upload them to Amazon S3. MediaConvert can decrypt files only when you use AWS Key Management Service (KMS) to encrypt the data key that you use to encrypt your content.
     */
    DecryptionSettings?: InputDecryptionSettings;
    /**
     * Enable Denoise (InputDenoiseFilter) to filter noise from the input.  Default is disabled. Only applicable to MPEG2, H.264, H.265, and uncompressed video inputs.
     */
    DenoiseFilter?: InputDenoiseFilter;
    /**
     * Specify the source file for your transcoding job. You can use multiple inputs in a single job. The service concatenates these inputs, in the order that you specify them in the job, to create the outputs. If your input format is IMF, specify your input by providing the path to your CPL. For example, "s3://bucket/vf/cpl.xml". If the CPL is in an incomplete IMP, make sure to use *Supplemental IMPs* (SupplementalImps) to specify any supplemental IMPs that contain assets referenced by the CPL.
     */
    FileInput?: __stringPatternS3MM2PPMM2VVMMPPEEGGMMPP3AAVVIIMMPP4FFLLVVMMPPTTMMPPGGMM4VVTTRRPPFF4VVMM2TTSSTTSS264HH264MMKKVVMMKKAAMMOOVVMMTTSSMM2TTWWMMVVaAAASSFFVVOOBB3GGPP3GGPPPPMMXXFFDDIIVVXXXXVVIIDDRRAAWWDDVVGGXXFFMM1VV3GG2VVMMFFMM3UU8WWEEBBMMLLCCHHGGXXFFMMPPEEGG2MMXXFFMMPPEEGG2MMXXFFHHDDWWAAVVYY4MMXXMMLLOOGGGGaAAATTMMOOSSHttpsMM2VVMMPPEEGGMMPP3AAVVIIMMPP4FFLLVVMMPPTTMMPPGGMM4VVTTRRPPFF4VVMM2TTSSTTSS264HH264MMKKVVMMKKAAMMOOVVMMTTSSMM2TTWWMMVVaAAASSFFVVOOBB3GGPP3GGPPPPMMXXFFDDIIVVXXXXVVIIDDRRAAWWDDVVGGXXFFMM1VV3GG2VVMMFFMM3UU8WWEEBBMMLLCCHHGGXXFFMMPPEEGG2MMXXFFMMPPEEGG2MMXXFFHHDDWWAAVVYY4MMXXMMLLOOGGGGaAAATTMMOOSS;
    /**
     * Specify how the transcoding service applies the denoise and deblock filters. You must also enable the filters separately, with Denoise (InputDenoiseFilter) and Deblock (InputDeblockFilter). * Auto - The transcoding service determines whether to apply filtering, depending on input type and quality. * Disable - The input is not filtered. This is true even if you use the API to enable them in (InputDeblockFilter) and (InputDeblockFilter). * Force - The input is filtered regardless of input type.
     */
    FilterEnable?: InputFilterEnable;
    /**
     * Use Filter strength (FilterStrength) to adjust the magnitude the input filter settings (Deblock and Denoise). The range is -5 to 5. Default is 0.
     */
    FilterStrength?: __integerMinNegative5Max5;
    /**
     * Enable the image inserter feature to include a graphic overlay on your video. Enable or disable this feature for each input individually. This setting is disabled by default.
     */
    ImageInserter?: ImageInserter;
    /**
     * (InputClippings) contains sets of start and end times that together specify a portion of the input to be used in the outputs. If you provide only a start time, the clip will be the entire input from that point to the end. If you provide only an end time, it will be the entire input up to that point. When you specify more than one input clip, the transcoding service creates the job outputs by stringing the clips together in the order you specify them.
     */
    InputClippings?: __listOfInputClipping;
    /**
     * When you have a progressive segmented frame (PsF) input, use this setting to flag the input as PsF. MediaConvert doesn't automatically detect PsF. Therefore, flagging your input as PsF results in better preservation of video quality when you do deinterlacing and frame rate conversion. If you don't specify, the default value is Auto (AUTO). Auto is the correct setting for all inputs that are not PsF. Don't set this value to PsF when your input is interlaced. Doing so creates horizontal interlacing artifacts.
     */
    InputScanType?: InputScanType;
    /**
     * Use Selection placement (position) to define the video area in your output frame. The area outside of the rectangle that you specify here is black. If you specify a value here, it will override any value that you specify in the output setting Selection placement (position). If you specify a value here, this will override any AFD values in your input, even if you set Respond to AFD (RespondToAfd) to Respond (RESPOND). If you specify a value here, this will ignore anything that you specify for the setting Scaling Behavior (scalingBehavior).
     */
    Position?: Rectangle;
    /**
     * Use Program (programNumber) to select a specific program from within a multi-program transport stream. Note that Quad 4K is not currently supported. Default is the first program within the transport stream. If the program you specify doesn't exist, the transcoding service will use this default.
     */
    ProgramNumber?: __integerMin1Max2147483647;
    /**
     * Set PSI control (InputPsiControl) for transport stream inputs to specify which data the demux process to scans. * Ignore PSI - Scan all PIDs for audio and video. * Use PSI - Scan only PSI data.
     */
    PsiControl?: InputPsiControl;
    /**
     * Provide a list of any necessary supplemental IMPs. You need supplemental IMPs if the CPL that you're using for your input is in an incomplete IMP. Specify either the supplemental IMP directories with a trailing slash or the ASSETMAP.xml files. For example ["s3://bucket/ov/", "s3://bucket/vf2/ASSETMAP.xml"]. You don't need to specify the IMP that contains your input CPL, because the service automatically detects it.
     */
    SupplementalImps?: __listOf__stringPatternS3ASSETMAPXml;
    /**
     * Use this Timecode source setting, located under the input settings (InputTimecodeSource), to specify how the service counts input video frames. This input frame count affects only the behavior of features that apply to a single input at a time, such as input clipping and synchronizing some captions formats. Choose Embedded (EMBEDDED) to use the timecodes in your input video. Choose Start at zero (ZEROBASED) to start the first frame at zero. Choose Specified start (SPECIFIEDSTART) to start the first frame at the timecode that you specify in the setting Start timecode (timecodeStart). If you don't specify a value for Timecode source, the service will use Embedded by default. For more information about timecodes, see https://docs.aws.amazon.com/console/mediaconvert/timecode.
     */
    TimecodeSource?: InputTimecodeSource;
    /**
     * Specify the timecode that you want the service to use for this input's initial frame. To use this setting, you must set the Timecode source setting, located under the input settings (InputTimecodeSource), to Specified start (SPECIFIEDSTART). For more information about timecodes, see https://docs.aws.amazon.com/console/mediaconvert/timecode.
     */
    TimecodeStart?: __stringMin11Max11Pattern01D20305D205D;
    /**
     * Input video selectors contain the video settings for the input. Each of your inputs can have up to one video selector.
     */
    VideoSelector?: VideoSelector;
  }
  export interface InputClipping {
    /**
     * Set End timecode (EndTimecode) to the end of the portion of the input you are clipping. The frame corresponding to the End timecode value is included in the clip. Start timecode or End timecode may be left blank, but not both. Use the format HH:MM:SS:FF or HH:MM:SS;FF, where HH is the hour, MM is the minute, SS is the second, and FF is the frame number. When choosing this value, take into account your setting for timecode source under input settings (InputTimecodeSource). For example, if you have embedded timecodes that start at 01:00:00:00 and you want your clip to end six minutes into the video, use 01:06:00:00.
     */
    EndTimecode?: __stringPattern010920405090509092;
    /**
     * Set Start timecode (StartTimecode) to the beginning of the portion of the input you are clipping. The frame corresponding to the Start timecode value is included in the clip. Start timecode or End timecode may be left blank, but not both. Use the format HH:MM:SS:FF or HH:MM:SS;FF, where HH is the hour, MM is the minute, SS is the second, and FF is the frame number. When choosing this value, take into account your setting for Input timecode source. For example, if you have embedded timecodes that start at 01:00:00:00 and you want your clip to begin five minutes into the video, use 01:05:00:00.
     */
    StartTimecode?: __stringPattern010920405090509092;
  }
  export type InputDeblockFilter = "ENABLED"|"DISABLED"|string;
  export interface InputDecryptionSettings {
    /**
     * Specify the encryption mode that you used to encrypt your input files.
     */
    DecryptionMode?: DecryptionMode;
    /**
     * Warning! Don't provide your encryption key in plaintext. Your job settings could be intercepted, making your encrypted content vulnerable. Specify the encrypted version of the data key that you used to encrypt your content. The data key must be encrypted by AWS Key Management Service (KMS). The key can be 128, 192, or 256 bits.
     */
    EncryptedDecryptionKey?: __stringMin24Max512PatternAZaZ0902;
    /**
     * Specify the initialization vector that you used when you encrypted your content before uploading it to Amazon S3. You can use a 16-byte initialization vector with any encryption mode. Or, you can use a 12-byte initialization vector with GCM or CTR. MediaConvert accepts only initialization vectors that are base64-encoded.
     */
    InitializationVector?: __stringMin16Max24PatternAZaZ0922AZaZ0916;
    /**
     * Specify the AWS Region for AWS Key Management Service (KMS) that you used to encrypt your data key, if that Region is different from the one you are using for AWS Elemental MediaConvert.
     */
    KmsKeyRegion?: __stringMin9Max19PatternAZ26EastWestCentralNorthSouthEastWest1912;
  }
  export type InputDenoiseFilter = "ENABLED"|"DISABLED"|string;
  export type InputFilterEnable = "AUTO"|"DISABLE"|"FORCE"|string;
  export type InputPolicy = "ALLOWED"|"DISALLOWED"|string;
  export type InputPsiControl = "IGNORE_PSI"|"USE_PSI"|string;
  export type InputRotate = "DEGREE_0"|"DEGREES_90"|"DEGREES_180"|"DEGREES_270"|"AUTO"|string;
  export type InputSampleRange = "FOLLOW"|"FULL_RANGE"|"LIMITED_RANGE"|string;
  export type InputScanType = "AUTO"|"PSF"|string;
  export interface InputTemplate {
    /**
     * Use audio selector groups to combine multiple sidecar audio inputs so that you can assign them to a single output audio tab (AudioDescription). Note that, if you're working with embedded audio, it's simpler to assign multiple input tracks into a single audio selector rather than use an audio selector group.
     */
    AudioSelectorGroups?: __mapOfAudioSelectorGroup;
    /**
     * Use Audio selectors (AudioSelectors) to specify a track or set of tracks from the input that you will use in your outputs. You can use multiple Audio selectors per input.
     */
    AudioSelectors?: __mapOfAudioSelector;
    /**
     * Use captions selectors to specify the captions data from your input that you use in your outputs. You can use up to 20 captions selectors per input.
     */
    CaptionSelectors?: __mapOfCaptionSelector;
    /**
     * Use Cropping selection (crop) to specify the video area that the service will include in the output video frame. If you specify a value here, it will override any value that you specify in the output setting Cropping selection (crop).
     */
    Crop?: Rectangle;
    /**
     * Enable Deblock (InputDeblockFilter) to produce smoother motion in the output. Default is disabled. Only manually controllable for MPEG2 and uncompressed video inputs.
     */
    DeblockFilter?: InputDeblockFilter;
    /**
     * Enable Denoise (InputDenoiseFilter) to filter noise from the input.  Default is disabled. Only applicable to MPEG2, H.264, H.265, and uncompressed video inputs.
     */
    DenoiseFilter?: InputDenoiseFilter;
    /**
     * Specify how the transcoding service applies the denoise and deblock filters. You must also enable the filters separately, with Denoise (InputDenoiseFilter) and Deblock (InputDeblockFilter). * Auto - The transcoding service determines whether to apply filtering, depending on input type and quality. * Disable - The input is not filtered. This is true even if you use the API to enable them in (InputDeblockFilter) and (InputDeblockFilter). * Force - The input is filtered regardless of input type.
     */
    FilterEnable?: InputFilterEnable;
    /**
     * Use Filter strength (FilterStrength) to adjust the magnitude the input filter settings (Deblock and Denoise). The range is -5 to 5. Default is 0.
     */
    FilterStrength?: __integerMinNegative5Max5;
    /**
     * Enable the image inserter feature to include a graphic overlay on your video. Enable or disable this feature for each input individually. This setting is disabled by default.
     */
    ImageInserter?: ImageInserter;
    /**
     * (InputClippings) contains sets of start and end times that together specify a portion of the input to be used in the outputs. If you provide only a start time, the clip will be the entire input from that point to the end. If you provide only an end time, it will be the entire input up to that point. When you specify more than one input clip, the transcoding service creates the job outputs by stringing the clips together in the order you specify them.
     */
    InputClippings?: __listOfInputClipping;
    /**
     * When you have a progressive segmented frame (PsF) input, use this setting to flag the input as PsF. MediaConvert doesn't automatically detect PsF. Therefore, flagging your input as PsF results in better preservation of video quality when you do deinterlacing and frame rate conversion. If you don't specify, the default value is Auto (AUTO). Auto is the correct setting for all inputs that are not PsF. Don't set this value to PsF when your input is interlaced. Doing so creates horizontal interlacing artifacts.
     */
    InputScanType?: InputScanType;
    /**
     * Use Selection placement (position) to define the video area in your output frame. The area outside of the rectangle that you specify here is black. If you specify a value here, it will override any value that you specify in the output setting Selection placement (position). If you specify a value here, this will override any AFD values in your input, even if you set Respond to AFD (RespondToAfd) to Respond (RESPOND). If you specify a value here, this will ignore anything that you specify for the setting Scaling Behavior (scalingBehavior).
     */
    Position?: Rectangle;
    /**
     * Use Program (programNumber) to select a specific program from within a multi-program transport stream. Note that Quad 4K is not currently supported. Default is the first program within the transport stream. If the program you specify doesn't exist, the transcoding service will use this default.
     */
    ProgramNumber?: __integerMin1Max2147483647;
    /**
     * Set PSI control (InputPsiControl) for transport stream inputs to specify which data the demux process to scans. * Ignore PSI - Scan all PIDs for audio and video. * Use PSI - Scan only PSI data.
     */
    PsiControl?: InputPsiControl;
    /**
     * Use this Timecode source setting, located under the input settings (InputTimecodeSource), to specify how the service counts input video frames. This input frame count affects only the behavior of features that apply to a single input at a time, such as input clipping and synchronizing some captions formats. Choose Embedded (EMBEDDED) to use the timecodes in your input video. Choose Start at zero (ZEROBASED) to start the first frame at zero. Choose Specified start (SPECIFIEDSTART) to start the first frame at the timecode that you specify in the setting Start timecode (timecodeStart). If you don't specify a value for Timecode source, the service will use Embedded by default. For more information about timecodes, see https://docs.aws.amazon.com/console/mediaconvert/timecode.
     */
    TimecodeSource?: InputTimecodeSource;
    /**
     * Specify the timecode that you want the service to use for this input's initial frame. To use this setting, you must set the Timecode source setting, located under the input settings (InputTimecodeSource), to Specified start (SPECIFIEDSTART). For more information about timecodes, see https://docs.aws.amazon.com/console/mediaconvert/timecode.
     */
    TimecodeStart?: __stringMin11Max11Pattern01D20305D205D;
    /**
     * Input video selectors contain the video settings for the input. Each of your inputs can have up to one video selector.
     */
    VideoSelector?: VideoSelector;
  }
  export type InputTimecodeSource = "EMBEDDED"|"ZEROBASED"|"SPECIFIEDSTART"|string;
  export interface InsertableImage {
    /**
     * Specify the time, in milliseconds, for the image to remain on the output video. This duration includes fade-in time but not fade-out time.
     */
    Duration?: __integerMin0Max2147483647;
    /**
     * Specify the length of time, in milliseconds, between the Start time that you specify for the image insertion and the time that the image appears at full opacity. Full opacity is the level that you specify for the opacity setting. If you don't specify a value for Fade-in, the image will appear abruptly at the overlay start time.
     */
    FadeIn?: __integerMin0Max2147483647;
    /**
     * Specify the length of time, in milliseconds, between the end of the time that you have specified for the image overlay Duration and when the overlaid image has faded to total transparency. If you don't specify a value for Fade-out, the image will disappear abruptly at the end of the inserted image duration.
     */
    FadeOut?: __integerMin0Max2147483647;
    /**
     * Specify the height of the inserted image in pixels. If you specify a value that's larger than the video resolution height, the service will crop your overlaid image to fit. To use the native height of the image, keep this setting blank.
     */
    Height?: __integerMin0Max2147483647;
    /**
     * Specify the HTTP, HTTPS, or Amazon S3 location of the image that you want to overlay on the video. Use a PNG or TGA file.
     */
    ImageInserterInput?: __stringMin14PatternS3BmpBMPPngPNGTgaTGAHttpsBmpBMPPngPNGTgaTGA;
    /**
     * Specify the distance, in pixels, between the inserted image and the left edge of the video frame. Required for any image overlay that you specify.
     */
    ImageX?: __integerMin0Max2147483647;
    /**
     * Specify the distance, in pixels, between the overlaid image and the top edge of the video frame. Required for any image overlay that you specify.
     */
    ImageY?: __integerMin0Max2147483647;
    /**
     * Specify how overlapping inserted images appear. Images with higher values for Layer appear on top of images with lower values for Layer.
     */
    Layer?: __integerMin0Max99;
    /**
     * Use Opacity (Opacity) to specify how much of the underlying video shows through the inserted image. 0 is transparent and 100 is fully opaque. Default is 50.
     */
    Opacity?: __integerMin0Max100;
    /**
     * Specify the timecode of the frame that you want the overlay to first appear on. This must be in timecode (HH:MM:SS:FF or HH:MM:SS;FF) format. Remember to take into account your timecode source settings.
     */
    StartTime?: __stringPattern01D20305D205D;
    /**
     * Specify the width of the inserted image in pixels. If you specify a value that's larger than the video resolution width, the service will crop your overlaid image to fit. To use the native width of the image, keep this setting blank.
     */
    Width?: __integerMin0Max2147483647;
  }
  export interface Job {
    /**
     * Accelerated transcoding can significantly speed up jobs with long, visually complex content.
     */
    AccelerationSettings?: AccelerationSettings;
    /**
     * Describes whether the current job is running with accelerated transcoding. For jobs that have Acceleration (AccelerationMode) set to DISABLED, AccelerationStatus is always NOT_APPLICABLE. For jobs that have Acceleration (AccelerationMode) set to ENABLED or PREFERRED, AccelerationStatus is one of the other states. AccelerationStatus is IN_PROGRESS initially, while the service determines whether the input files and job settings are compatible with accelerated transcoding. If they are, AcclerationStatus is ACCELERATED. If your input files and job settings aren't compatible with accelerated transcoding, the service either fails your job or runs it without accelerated transcoding, depending on how you set Acceleration (AccelerationMode). When the service runs your job without accelerated transcoding, AccelerationStatus is NOT_ACCELERATED.
     */
    AccelerationStatus?: AccelerationStatus;
    /**
     * An identifier for this resource that is unique within all of AWS.
     */
    Arn?: __string;
    /**
     * The tag type that AWS Billing and Cost Management will use to sort your AWS Elemental MediaConvert costs on any billing report that you set up.
     */
    BillingTagsSource?: BillingTagsSource;
    /**
     * The time, in Unix epoch format in seconds, when the job got created.
     */
    CreatedAt?: __timestampUnix;
    /**
     * A job's phase can be PROBING, TRANSCODING OR UPLOADING
     */
    CurrentPhase?: JobPhase;
    /**
     * Error code for the job
     */
    ErrorCode?: __integer;
    /**
     * Error message of Job
     */
    ErrorMessage?: __string;
    /**
     * Optional list of hop destinations.
     */
    HopDestinations?: __listOfHopDestination;
    /**
     * A portion of the job's ARN, unique within your AWS Elemental MediaConvert resources
     */
    Id?: __string;
    /**
     * An estimate of how far your job has progressed. This estimate is shown as a percentage of the total time from when your job leaves its queue to when your output files appear in your output Amazon S3 bucket. AWS Elemental MediaConvert provides jobPercentComplete in CloudWatch STATUS_UPDATE events and in the response to GetJob and ListJobs requests. The jobPercentComplete estimate is reliable for the following input containers: Quicktime, Transport Stream, MP4, and MXF. For some jobs, the service can't provide information about job progress. In those cases, jobPercentComplete returns a null value.
     */
    JobPercentComplete?: __integer;
    /**
     * The job template that the job is created from, if it is created from a job template.
     */
    JobTemplate?: __string;
    /**
     * Provides messages from the service about jobs that you have already successfully submitted.
     */
    Messages?: JobMessages;
    /**
     * List of output group details
     */
    OutputGroupDetails?: __listOfOutputGroupDetail;
    /**
     * Relative priority on the job.
     */
    Priority?: __integerMinNegative50Max50;
    /**
     * When you create a job, you can specify a queue to send it to. If you don't specify, the job will go to the default queue. For more about queues, see the User Guide topic at https://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
     */
    Queue?: __string;
    /**
     * The job's queue hopping history.
     */
    QueueTransitions?: __listOfQueueTransition;
    /**
     * The number of times that the service automatically attempted to process your job after encountering an error.
     */
    RetryCount?: __integer;
    /**
     * The IAM role you use for creating this job. For details about permissions, see the User Guide topic at the User Guide at https://docs.aws.amazon.com/mediaconvert/latest/ug/iam-role.html
     */
    Role: __string;
    /**
     * JobSettings contains all the transcode settings for a job.
     */
    Settings: JobSettings;
    /**
     * Enable this setting when you run a test job to estimate how many reserved transcoding slots (RTS) you need. When this is enabled, MediaConvert runs your job from an on-demand queue with similar performance to what you will see with one RTS in a reserved queue. This setting is disabled by default.
     */
    SimulateReservedQueue?: SimulateReservedQueue;
    /**
     * A job's status can be SUBMITTED, PROGRESSING, COMPLETE, CANCELED, or ERROR.
     */
    Status?: JobStatus;
    /**
     * Specify how often MediaConvert sends STATUS_UPDATE events to Amazon CloudWatch Events. Set the interval, in seconds, between status updates. MediaConvert sends an update at this interval from the time the service begins processing your job to the time it completes the transcode or encounters an error.
     */
    StatusUpdateInterval?: StatusUpdateInterval;
    /**
     * Information about when jobs are submitted, started, and finished is specified in Unix epoch format in seconds.
     */
    Timing?: Timing;
    /**
     * User-defined metadata that you want to associate with an MediaConvert job. You specify metadata in key/value pairs.
     */
    UserMetadata?: __mapOf__string;
  }
  export interface JobMessages {
    /**
     * List of messages that are informational only and don't indicate a problem with your job.
     */
    Info?: __listOf__string;
    /**
     * List of messages that warn about conditions that might cause your job not to run or to fail.
     */
    Warning?: __listOf__string;
  }
  export type JobPhase = "PROBING"|"TRANSCODING"|"UPLOADING"|string;
  export interface JobSettings {
    /**
     * When specified, this offset (in milliseconds) is added to the input Ad Avail PTS time.
     */
    AdAvailOffset?: __integerMinNegative1000Max1000;
    /**
     * Settings for ad avail blanking.  Video can be blanked or overlaid with an image, and audio muted during SCTE-35 triggered ad avails.
     */
    AvailBlanking?: AvailBlanking;
    /**
     * Settings for Event Signaling And Messaging (ESAM). If you don't do ad insertion, you can ignore these settings.
     */
    Esam?: EsamSettings;
    /**
     * If your source content has EIA-608 Line 21 Data Services, enable this feature to specify what MediaConvert does with the Extended Data Services (XDS) packets. You can choose to pass through XDS packets, or remove them from the output. For more information about XDS, see EIA-608 Line Data Services, section 9.5.1.5 05h Content Advisory.
     */
    ExtendedDataServices?: ExtendedDataServices;
    /**
     * Use Inputs (inputs) to define source file used in the transcode job. There can be multiple inputs add in a job. These inputs will be concantenated together to create the output.
     */
    Inputs?: __listOfInput;
    /**
     * Use these settings only when you use Kantar watermarking. Specify the values that MediaConvert uses to generate and place Kantar watermarks in your output audio. These settings apply to every output in your job. In addition to specifying these values, you also need to store your Kantar credentials in AWS Secrets Manager. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/kantar-watermarking.html.
     */
    KantarWatermark?: KantarWatermarkSettings;
    /**
     * Overlay motion graphics on top of your video. The motion graphics that you specify here appear on all outputs in all output groups. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/motion-graphic-overlay.html.
     */
    MotionImageInserter?: MotionImageInserter;
    /**
     * Settings for your Nielsen configuration. If you don't do Nielsen measurement and analytics, ignore these settings. When you enable Nielsen configuration (nielsenConfiguration), MediaConvert enables PCM to ID3 tagging for all outputs in the job. To enable Nielsen configuration programmatically, include an instance of nielsenConfiguration in your JSON job specification. Even if you don't include any children of nielsenConfiguration, you still enable the setting.
     */
    NielsenConfiguration?: NielsenConfiguration;
    /**
     * Ignore these settings unless you are using Nielsen non-linear watermarking. Specify the values that  MediaConvert uses to generate and place Nielsen watermarks in your output audio. In addition to  specifying these values, you also need to set up your cloud TIC server. These settings apply to  every output in your job. The MediaConvert implementation is currently with the following Nielsen versions: Nielsen Watermark SDK Version 5.2.1 Nielsen NLM Watermark Engine Version 1.2.7 Nielsen Watermark Authenticator [SID_TIC] Version [5.0.0]
     */
    NielsenNonLinearWatermark?: NielsenNonLinearWatermarkSettings;
    /**
     * (OutputGroups) contains one group of settings for each set of outputs that share a common package type. All unpackaged files (MPEG-4, MPEG-2 TS, Quicktime, MXF, and no container) are grouped in a single output group as well. Required in (OutputGroups) is a group of settings that apply to the whole group. This required object depends on the value you set for (Type) under (OutputGroups)>(OutputGroupSettings). Type, settings object pairs are as follows. * FILE_GROUP_SETTINGS, FileGroupSettings * HLS_GROUP_SETTINGS, HlsGroupSettings * DASH_ISO_GROUP_SETTINGS, DashIsoGroupSettings * MS_SMOOTH_GROUP_SETTINGS, MsSmoothGroupSettings * CMAF_GROUP_SETTINGS, CmafGroupSettings
     */
    OutputGroups?: __listOfOutputGroup;
    /**
     * These settings control how the service handles timecodes throughout the job. These settings don't affect input clipping.
     */
    TimecodeConfig?: TimecodeConfig;
    /**
     * Enable Timed metadata insertion (TimedMetadataInsertion) to include ID3 tags in any HLS outputs. To include timed metadata, you must enable it here, enable it in each output container, and specify tags and timecodes in ID3 insertion (Id3Insertion) objects.
     */
    TimedMetadataInsertion?: TimedMetadataInsertion;
  }
  export type JobStatus = "SUBMITTED"|"PROGRESSING"|"COMPLETE"|"CANCELED"|"ERROR"|string;
  export interface JobTemplate {
    /**
     * Accelerated transcoding can significantly speed up jobs with long, visually complex content.
     */
    AccelerationSettings?: AccelerationSettings;
    /**
     * An identifier for this resource that is unique within all of AWS.
     */
    Arn?: __string;
    /**
     * An optional category you create to organize your job templates.
     */
    Category?: __string;
    /**
     * The timestamp in epoch seconds for Job template creation.
     */
    CreatedAt?: __timestampUnix;
    /**
     * An optional description you create for each job template.
     */
    Description?: __string;
    /**
     * Optional list of hop destinations.
     */
    HopDestinations?: __listOfHopDestination;
    /**
     * The timestamp in epoch seconds when the Job template was last updated.
     */
    LastUpdated?: __timestampUnix;
    /**
     * A name you create for each job template. Each name must be unique within your account.
     */
    Name: __string;
    /**
     * Relative priority on the job.
     */
    Priority?: __integerMinNegative50Max50;
    /**
     * Optional. The queue that jobs created from this template are assigned to. If you don't specify this, jobs will go to the default queue.
     */
    Queue?: __string;
    /**
     * JobTemplateSettings contains all the transcode settings saved in the template that will be applied to jobs created from it.
     */
    Settings: JobTemplateSettings;
    /**
     * Specify how often MediaConvert sends STATUS_UPDATE events to Amazon CloudWatch Events. Set the interval, in seconds, between status updates. MediaConvert sends an update at this interval from the time the service begins processing your job to the time it completes the transcode or encounters an error.
     */
    StatusUpdateInterval?: StatusUpdateInterval;
    /**
     * A job template can be of two types: system or custom. System or built-in job templates can't be modified or deleted by the user.
     */
    Type?: Type;
  }
  export type JobTemplateListBy = "NAME"|"CREATION_DATE"|"SYSTEM"|string;
  export interface JobTemplateSettings {
    /**
     * When specified, this offset (in milliseconds) is added to the input Ad Avail PTS time.
     */
    AdAvailOffset?: __integerMinNegative1000Max1000;
    /**
     * Settings for ad avail blanking.  Video can be blanked or overlaid with an image, and audio muted during SCTE-35 triggered ad avails.
     */
    AvailBlanking?: AvailBlanking;
    /**
     * Settings for Event Signaling And Messaging (ESAM). If you don't do ad insertion, you can ignore these settings.
     */
    Esam?: EsamSettings;
    /**
     * If your source content has EIA-608 Line 21 Data Services, enable this feature to specify what MediaConvert does with the Extended Data Services (XDS) packets. You can choose to pass through XDS packets, or remove them from the output. For more information about XDS, see EIA-608 Line Data Services, section 9.5.1.5 05h Content Advisory.
     */
    ExtendedDataServices?: ExtendedDataServices;
    /**
     * Use Inputs (inputs) to define the source file used in the transcode job. There can only be one input in a job template.  Using the API, you can include multiple inputs when referencing a job template.
     */
    Inputs?: __listOfInputTemplate;
    /**
     * Use these settings only when you use Kantar watermarking. Specify the values that MediaConvert uses to generate and place Kantar watermarks in your output audio. These settings apply to every output in your job. In addition to specifying these values, you also need to store your Kantar credentials in AWS Secrets Manager. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/kantar-watermarking.html.
     */
    KantarWatermark?: KantarWatermarkSettings;
    /**
     * Overlay motion graphics on top of your video. The motion graphics that you specify here appear on all outputs in all output groups. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/motion-graphic-overlay.html.
     */
    MotionImageInserter?: MotionImageInserter;
    /**
     * Settings for your Nielsen configuration. If you don't do Nielsen measurement and analytics, ignore these settings. When you enable Nielsen configuration (nielsenConfiguration), MediaConvert enables PCM to ID3 tagging for all outputs in the job. To enable Nielsen configuration programmatically, include an instance of nielsenConfiguration in your JSON job specification. Even if you don't include any children of nielsenConfiguration, you still enable the setting.
     */
    NielsenConfiguration?: NielsenConfiguration;
    /**
     * Ignore these settings unless you are using Nielsen non-linear watermarking. Specify the values that  MediaConvert uses to generate and place Nielsen watermarks in your output audio. In addition to  specifying these values, you also need to set up your cloud TIC server. These settings apply to  every output in your job. The MediaConvert implementation is currently with the following Nielsen versions: Nielsen Watermark SDK Version 5.2.1 Nielsen NLM Watermark Engine Version 1.2.7 Nielsen Watermark Authenticator [SID_TIC] Version [5.0.0]
     */
    NielsenNonLinearWatermark?: NielsenNonLinearWatermarkSettings;
    /**
     * (OutputGroups) contains one group of settings for each set of outputs that share a common package type. All unpackaged files (MPEG-4, MPEG-2 TS, Quicktime, MXF, and no container) are grouped in a single output group as well. Required in (OutputGroups) is a group of settings that apply to the whole group. This required object depends on the value you set for (Type) under (OutputGroups)>(OutputGroupSettings). Type, settings object pairs are as follows. * FILE_GROUP_SETTINGS, FileGroupSettings * HLS_GROUP_SETTINGS, HlsGroupSettings * DASH_ISO_GROUP_SETTINGS, DashIsoGroupSettings * MS_SMOOTH_GROUP_SETTINGS, MsSmoothGroupSettings * CMAF_GROUP_SETTINGS, CmafGroupSettings
     */
    OutputGroups?: __listOfOutputGroup;
    /**
     * These settings control how the service handles timecodes throughout the job. These settings don't affect input clipping.
     */
    TimecodeConfig?: TimecodeConfig;
    /**
     * Enable Timed metadata insertion (TimedMetadataInsertion) to include ID3 tags in any HLS outputs. To include timed metadata, you must enable it here, enable it in each output container, and specify tags and timecodes in ID3 insertion (Id3Insertion) objects.
     */
    TimedMetadataInsertion?: TimedMetadataInsertion;
  }
  export interface KantarWatermarkSettings {
    /**
     * Provide an audio channel name from your Kantar audio license.
     */
    ChannelName?: __stringMin1Max20;
    /**
     * Specify a unique identifier for Kantar to use for this piece of content.
     */
    ContentReference?: __stringMin1Max50PatternAZAZ09;
    /**
     * Provide the name of the AWS Secrets Manager secret where your Kantar credentials are stored. Note that your MediaConvert service role must provide access to this secret. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/granting-permissions-for-mediaconvert-to-access-secrets-manager-secret.html. For instructions on creating a secret, see https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html, in the AWS Secrets Manager User Guide.
     */
    CredentialsSecretName?: __stringMin1Max512PatternAZAZ09;
    /**
     * Optional. Specify an offset, in whole seconds, from the start of your output and the beginning of the watermarking. When you don't specify an offset, Kantar defaults to zero.
     */
    FileOffset?: __doubleMin0;
    /**
     * Provide your Kantar license ID number. You should get this number from Kantar.
     */
    KantarLicenseId?: __integerMin0Max2147483647;
    /**
     * Provide the HTTPS endpoint to the Kantar server. You should get this endpoint from Kantar.
     */
    KantarServerUrl?: __stringPatternHttpsKantarmediaCom;
    /**
     * Optional. Specify the Amazon S3 bucket where you want MediaConvert to store your Kantar watermark XML logs. When you don't specify a bucket, MediaConvert doesn't save these logs. Note that your MediaConvert service role must provide access to this location. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/iam-role.html
     */
    LogDestination?: __stringPatternS3;
    /**
     * You can optionally use this field to specify the first timestamp that Kantar embeds during watermarking. Kantar suggests that you be very cautious when using this Kantar feature, and that you use it only on channels that are managed specifically for use with this feature by your Audience Measurement Operator. For more information about this feature, contact Kantar technical support.
     */
    Metadata3?: __stringMin1Max50;
    /**
     * Additional metadata that MediaConvert sends to Kantar. Maximum length is 50 characters.
     */
    Metadata4?: __stringMin1Max50;
    /**
     * Additional metadata that MediaConvert sends to Kantar. Maximum length is 50 characters.
     */
    Metadata5?: __stringMin1Max50;
    /**
     * Additional metadata that MediaConvert sends to Kantar. Maximum length is 50 characters.
     */
    Metadata6?: __stringMin1Max50;
    /**
     * Additional metadata that MediaConvert sends to Kantar. Maximum length is 50 characters.
     */
    Metadata7?: __stringMin1Max50;
    /**
     * Additional metadata that MediaConvert sends to Kantar. Maximum length is 50 characters.
     */
    Metadata8?: __stringMin1Max50;
  }
  export type LanguageCode = "ENG"|"SPA"|"FRA"|"DEU"|"GER"|"ZHO"|"ARA"|"HIN"|"JPN"|"RUS"|"POR"|"ITA"|"URD"|"VIE"|"KOR"|"PAN"|"ABK"|"AAR"|"AFR"|"AKA"|"SQI"|"AMH"|"ARG"|"HYE"|"ASM"|"AVA"|"AVE"|"AYM"|"AZE"|"BAM"|"BAK"|"EUS"|"BEL"|"BEN"|"BIH"|"BIS"|"BOS"|"BRE"|"BUL"|"MYA"|"CAT"|"KHM"|"CHA"|"CHE"|"NYA"|"CHU"|"CHV"|"COR"|"COS"|"CRE"|"HRV"|"CES"|"DAN"|"DIV"|"NLD"|"DZO"|"ENM"|"EPO"|"EST"|"EWE"|"FAO"|"FIJ"|"FIN"|"FRM"|"FUL"|"GLA"|"GLG"|"LUG"|"KAT"|"ELL"|"GRN"|"GUJ"|"HAT"|"HAU"|"HEB"|"HER"|"HMO"|"HUN"|"ISL"|"IDO"|"IBO"|"IND"|"INA"|"ILE"|"IKU"|"IPK"|"GLE"|"JAV"|"KAL"|"KAN"|"KAU"|"KAS"|"KAZ"|"KIK"|"KIN"|"KIR"|"KOM"|"KON"|"KUA"|"KUR"|"LAO"|"LAT"|"LAV"|"LIM"|"LIN"|"LIT"|"LUB"|"LTZ"|"MKD"|"MLG"|"MSA"|"MAL"|"MLT"|"GLV"|"MRI"|"MAR"|"MAH"|"MON"|"NAU"|"NAV"|"NDE"|"NBL"|"NDO"|"NEP"|"SME"|"NOR"|"NOB"|"NNO"|"OCI"|"OJI"|"ORI"|"ORM"|"OSS"|"PLI"|"FAS"|"POL"|"PUS"|"QUE"|"QAA"|"RON"|"ROH"|"RUN"|"SMO"|"SAG"|"SAN"|"SRD"|"SRB"|"SNA"|"III"|"SND"|"SIN"|"SLK"|"SLV"|"SOM"|"SOT"|"SUN"|"SWA"|"SSW"|"SWE"|"TGL"|"TAH"|"TGK"|"TAM"|"TAT"|"TEL"|"THA"|"BOD"|"TIR"|"TON"|"TSO"|"TSN"|"TUR"|"TUK"|"TWI"|"UIG"|"UKR"|"UZB"|"VEN"|"VOL"|"WLN"|"CYM"|"FRY"|"WOL"|"XHO"|"YID"|"YOR"|"ZHA"|"ZUL"|"ORJ"|"QPC"|"TNG"|string;
  export interface ListJobTemplatesRequest {
    /**
     * Optionally, specify a job template category to limit responses to only job templates from that category.
     */
    Category?: __string;
    /**
     * Optional. When you request a list of job templates, you can choose to list them alphabetically by NAME or chronologically by CREATION_DATE. If you don't specify, the service will list them by name.
     */
    ListBy?: JobTemplateListBy;
    /**
     * Optional. Number of job templates, up to twenty, that will be returned at one time.
     */
    MaxResults?: __integerMin1Max20;
    /**
     * Use this string, provided with the response to a previous request, to request the next batch of job templates.
     */
    NextToken?: __string;
    /**
     * Optional. When you request lists of resources, you can specify whether they are sorted in ASCENDING or DESCENDING order. Default varies by resource.
     */
    Order?: Order;
  }
  export interface ListJobTemplatesResponse {
    /**
     * List of Job templates.
     */
    JobTemplates?: __listOfJobTemplate;
    /**
     * Use this string to request the next batch of job templates.
     */
    NextToken?: __string;
  }
  export interface ListJobsRequest {
    /**
     * Optional. Number of jobs, up to twenty, that will be returned at one time.
     */
    MaxResults?: __integerMin1Max20;
    /**
     * Optional. Use this string, provided with the response to a previous request, to request the next batch of jobs.
     */
    NextToken?: __string;
    /**
     * Optional. When you request lists of resources, you can specify whether they are sorted in ASCENDING or DESCENDING order. Default varies by resource.
     */
    Order?: Order;
    /**
     * Optional. Provide a queue name to get back only jobs from that queue.
     */
    Queue?: __string;
    /**
     * Optional. A job's status can be SUBMITTED, PROGRESSING, COMPLETE, CANCELED, or ERROR.
     */
    Status?: JobStatus;
  }
  export interface ListJobsResponse {
    /**
     * List of jobs
     */
    Jobs?: __listOfJob;
    /**
     * Use this string to request the next batch of jobs.
     */
    NextToken?: __string;
  }
  export interface ListPresetsRequest {
    /**
     * Optionally, specify a preset category to limit responses to only presets from that category.
     */
    Category?: __string;
    /**
     * Optional. When you request a list of presets, you can choose to list them alphabetically by NAME or chronologically by CREATION_DATE. If you don't specify, the service will list them by name.
     */
    ListBy?: PresetListBy;
    /**
     * Optional. Number of presets, up to twenty, that will be returned at one time
     */
    MaxResults?: __integerMin1Max20;
    /**
     * Use this string, provided with the response to a previous request, to request the next batch of presets.
     */
    NextToken?: __string;
    /**
     * Optional. When you request lists of resources, you can specify whether they are sorted in ASCENDING or DESCENDING order. Default varies by resource.
     */
    Order?: Order;
  }
  export interface ListPresetsResponse {
    /**
     * Use this string to request the next batch of presets.
     */
    NextToken?: __string;
    /**
     * List of presets
     */
    Presets?: __listOfPreset;
  }
  export interface ListQueuesRequest {
    /**
     * Optional. When you request a list of queues, you can choose to list them alphabetically by NAME or chronologically by CREATION_DATE. If you don't specify, the service will list them by creation date.
     */
    ListBy?: QueueListBy;
    /**
     * Optional. Number of queues, up to twenty, that will be returned at one time.
     */
    MaxResults?: __integerMin1Max20;
    /**
     * Use this string, provided with the response to a previous request, to request the next batch of queues.
     */
    NextToken?: __string;
    /**
     * Optional. When you request lists of resources, you can specify whether they are sorted in ASCENDING or DESCENDING order. Default varies by resource.
     */
    Order?: Order;
  }
  export interface ListQueuesResponse {
    /**
     * Use this string to request the next batch of queues.
     */
    NextToken?: __string;
    /**
     * List of queues.
     */
    Queues?: __listOfQueue;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to list tags for. To get the ARN, send a GET request with the resource name.
     */
    Arn: __string;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The Amazon Resource Name (ARN) and tags for an AWS Elemental MediaConvert resource.
     */
    ResourceTags?: ResourceTags;
  }
  export type M2tsAudioBufferModel = "DVB"|"ATSC"|string;
  export type M2tsAudioDuration = "DEFAULT_CODEC_DURATION"|"MATCH_VIDEO_DURATION"|string;
  export type M2tsBufferModel = "MULTIPLEX"|"NONE"|string;
  export type M2tsDataPtsControl = "AUTO"|"ALIGN_TO_VIDEO"|string;
  export type M2tsEbpAudioInterval = "VIDEO_AND_FIXED_INTERVALS"|"VIDEO_INTERVAL"|string;
  export type M2tsEbpPlacement = "VIDEO_AND_AUDIO_PIDS"|"VIDEO_PID"|string;
  export type M2tsEsRateInPes = "INCLUDE"|"EXCLUDE"|string;
  export type M2tsForceTsVideoEbpOrder = "FORCE"|"DEFAULT"|string;
  export type M2tsNielsenId3 = "INSERT"|"NONE"|string;
  export type M2tsPcrControl = "PCR_EVERY_PES_PACKET"|"CONFIGURED_PCR_PERIOD"|string;
  export type M2tsRateMode = "VBR"|"CBR"|string;
  export interface M2tsScte35Esam {
    /**
     * Packet Identifier (PID) of the SCTE-35 stream in the transport stream generated by ESAM.
     */
    Scte35EsamPid?: __integerMin32Max8182;
  }
  export type M2tsScte35Source = "PASSTHROUGH"|"NONE"|string;
  export type M2tsSegmentationMarkers = "NONE"|"RAI_SEGSTART"|"RAI_ADAPT"|"PSI_SEGSTART"|"EBP"|"EBP_LEGACY"|string;
  export type M2tsSegmentationStyle = "MAINTAIN_CADENCE"|"RESET_CADENCE"|string;
  export interface M2tsSettings {
    /**
     * Selects between the DVB and ATSC buffer models for Dolby Digital audio.
     */
    AudioBufferModel?: M2tsAudioBufferModel;
    /**
     * Specify this setting only when your output will be consumed by a downstream repackaging workflow that is sensitive to very small duration differences between video and audio. For this situation, choose Match video duration (MATCH_VIDEO_DURATION). In all other cases, keep the default value, Default codec duration (DEFAULT_CODEC_DURATION). When you choose Match video duration, MediaConvert pads the output audio streams with silence or trims them to ensure that the total duration of each audio stream is at least as long as the total duration of the video stream. After padding or trimming, the audio stream duration is no more than one frame longer than the video stream. MediaConvert applies audio padding or trimming only to the end of the last segment of the output. For unsegmented outputs, MediaConvert adds padding only to the end of the file. When you keep the default value, any minor discrepancies between audio and video duration will depend on your output audio codec.
     */
    AudioDuration?: M2tsAudioDuration;
    /**
     * The number of audio frames to insert for each PES packet.
     */
    AudioFramesPerPes?: __integerMin0Max2147483647;
    /**
     * Specify the packet identifiers (PIDs) for any elementary audio streams you include in this output. Specify multiple PIDs as a JSON array. Default is the range 482-492.
     */
    AudioPids?: __listOf__integerMin32Max8182;
    /**
     * Specify the output bitrate of the transport stream in bits per second. Setting to 0 lets the muxer automatically determine the appropriate bitrate. Other common values are 3750000, 7500000, and 15000000.
     */
    Bitrate?: __integerMin0Max2147483647;
    /**
     * Controls what buffer model to use for accurate interleaving. If set to MULTIPLEX, use multiplex  buffer model. If set to NONE, this can lead to lower latency, but low-memory devices may not be able to play back the stream without interruptions.
     */
    BufferModel?: M2tsBufferModel;
    /**
     * If you select ALIGN_TO_VIDEO, MediaConvert writes captions and data packets with Presentation Timestamp (PTS) values greater than or equal to the first video packet PTS (MediaConvert drops captions and data packets with lesser PTS values). Keep the default value (AUTO) to allow all PTS values.
     */
    DataPTSControl?: M2tsDataPtsControl;
    /**
     * Use these settings to insert a DVB Network Information Table (NIT) in the transport stream of this output. When you work directly in your JSON job specification, include this object only when your job has a transport stream output and the container settings contain the object M2tsSettings.
     */
    DvbNitSettings?: DvbNitSettings;
    /**
     * Use these settings to insert a DVB Service Description Table (SDT) in the transport stream of this output. When you work directly in your JSON job specification, include this object only when your job has a transport stream output and the container settings contain the object M2tsSettings.
     */
    DvbSdtSettings?: DvbSdtSettings;
    /**
     * Specify the packet identifiers (PIDs) for DVB subtitle data included in this output. Specify multiple PIDs as a JSON array. Default is the range 460-479.
     */
    DvbSubPids?: __listOf__integerMin32Max8182;
    /**
     * Use these settings to insert a DVB Time and Date Table (TDT) in the transport stream of this output. When you work directly in your JSON job specification, include this object only when your job has a transport stream output and the container settings contain the object M2tsSettings.
     */
    DvbTdtSettings?: DvbTdtSettings;
    /**
     * Specify the packet identifier (PID) for DVB teletext data you include in this output. Default is 499.
     */
    DvbTeletextPid?: __integerMin32Max8182;
    /**
     * When set to VIDEO_AND_FIXED_INTERVALS, audio EBP markers will be added to partitions 3 and 4. The interval between these additional markers will be fixed, and will be slightly shorter than the video EBP marker interval. When set to VIDEO_INTERVAL, these additional markers will not be inserted. Only applicable when EBP segmentation markers are is selected (segmentationMarkers is EBP or EBP_LEGACY).
     */
    EbpAudioInterval?: M2tsEbpAudioInterval;
    /**
     * Selects which PIDs to place EBP markers on. They can either be placed only on the video PID, or on both the video PID and all audio PIDs. Only applicable when EBP segmentation markers are is selected (segmentationMarkers is EBP or EBP_LEGACY).
     */
    EbpPlacement?: M2tsEbpPlacement;
    /**
     * Controls whether to include the ES Rate field in the PES header.
     */
    EsRateInPes?: M2tsEsRateInPes;
    /**
     * Keep the default value (DEFAULT) unless you know that your audio EBP markers are incorrectly appearing before your video EBP markers. To correct this problem, set this value to Force (FORCE).
     */
    ForceTsVideoEbpOrder?: M2tsForceTsVideoEbpOrder;
    /**
     * The length, in seconds, of each fragment. Only used with EBP markers.
     */
    FragmentTime?: __doubleMin0;
    /**
     * Specify the maximum time, in milliseconds, between Program Clock References (PCRs) inserted into the transport stream.
     */
    MaxPcrInterval?: __integerMin0Max500;
    /**
     * When set, enforces that Encoder Boundary Points do not come within the specified time interval of each other by looking ahead at input video. If another EBP is going to come in within the specified time interval, the current EBP is not emitted, and the segment is "stretched" to the next marker. The lookahead value does not add latency to the system. The Live Event must be configured elsewhere to create sufficient latency to make the lookahead accurate.
     */
    MinEbpInterval?: __integerMin0Max10000;
    /**
     * If INSERT, Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output.
     */
    NielsenId3?: M2tsNielsenId3;
    /**
     * Value in bits per second of extra null packets to insert into the transport stream. This can be used if a downstream encryption system requires periodic null packets.
     */
    NullPacketBitrate?: __doubleMin0;
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    PatInterval?: __integerMin0Max1000;
    /**
     * When set to PCR_EVERY_PES_PACKET, a Program Clock Reference value is inserted for every Packetized Elementary Stream (PES) header. This is effective only when the PCR PID is the same as the video or audio elementary stream.
     */
    PcrControl?: M2tsPcrControl;
    /**
     * Specify the packet identifier (PID) for the program clock reference (PCR) in this output. If you do not specify a value, the service will use the value for Video PID (VideoPid).
     */
    PcrPid?: __integerMin32Max8182;
    /**
     * Specify the number of milliseconds between instances of the program map table (PMT) in the output transport stream.
     */
    PmtInterval?: __integerMin0Max1000;
    /**
     * Specify the packet identifier (PID) for the program map table (PMT) itself. Default is 480.
     */
    PmtPid?: __integerMin32Max8182;
    /**
     * Specify the packet identifier (PID) of the private metadata stream. Default is 503.
     */
    PrivateMetadataPid?: __integerMin32Max8182;
    /**
     * Use Program number (programNumber) to specify the program number used in the program map table (PMT) for this output. Default is 1. Program numbers and program map tables are parts of MPEG-2 transport stream containers, used for organizing data.
     */
    ProgramNumber?: __integerMin0Max65535;
    /**
     * When set to CBR, inserts null packets into transport stream to fill specified bitrate. When set to VBR, the bitrate setting acts as the maximum bitrate, but the output will not be padded up to that bitrate.
     */
    RateMode?: M2tsRateMode;
    /**
     * Include this in your job settings to put SCTE-35 markers in your HLS and transport stream outputs at the insertion points that you specify in an ESAM XML document. Provide the document in the setting SCC XML (sccXml).
     */
    Scte35Esam?: M2tsScte35Esam;
    /**
     * Specify the packet identifier (PID) of the SCTE-35 stream in the transport stream.
     */
    Scte35Pid?: __integerMin32Max8182;
    /**
     * For SCTE-35 markers from your input-- Choose Passthrough (PASSTHROUGH) if you want SCTE-35 markers that appear in your input to also appear in this output. Choose None (NONE) if you don't want SCTE-35 markers in this output. For SCTE-35 markers from an ESAM XML document-- Choose None (NONE). Also provide the ESAM XML as a string in the setting Signal processing notification XML (sccXml). Also enable ESAM SCTE-35 (include the property scte35Esam).
     */
    Scte35Source?: M2tsScte35Source;
    /**
     * Inserts segmentation markers at each segmentation_time period. rai_segstart sets the Random Access Indicator bit in the adaptation field. rai_adapt sets the RAI bit and adds the current timecode in the private data bytes. psi_segstart inserts PAT and PMT tables at the start of segments. ebp adds Encoder Boundary Point information to the adaptation field as per OpenCable specification OC-SP-EBP-I01-130118. ebp_legacy adds Encoder Boundary Point information to the adaptation field using a legacy proprietary format.
     */
    SegmentationMarkers?: M2tsSegmentationMarkers;
    /**
     * The segmentation style parameter controls how segmentation markers are inserted into the transport stream. With avails, it is possible that segments may be truncated, which can influence where future segmentation markers are inserted. When a segmentation style of "reset_cadence" is selected and a segment is truncated due to an avail, we will reset the segmentation cadence. This means the subsequent segment will have a duration of of $segmentation_time seconds. When a segmentation style of "maintain_cadence" is selected and a segment is truncated due to an avail, we will not reset the segmentation cadence. This means the subsequent segment will likely be truncated as well. However, all segments after that will have a duration of $segmentation_time seconds. Note that EBP lookahead is a slight exception to this rule.
     */
    SegmentationStyle?: M2tsSegmentationStyle;
    /**
     * Specify the length, in seconds, of each segment. Required unless markers is set to _none_.
     */
    SegmentationTime?: __doubleMin0;
    /**
     * Specify the packet identifier (PID) for timed metadata in this output. Default is 502.
     */
    TimedMetadataPid?: __integerMin32Max8182;
    /**
     * Specify the ID for the transport stream itself in the program map table for this output. Transport stream IDs and program map tables are parts of MPEG-2 transport stream containers, used for organizing data.
     */
    TransportStreamId?: __integerMin0Max65535;
    /**
     * Specify the packet identifier (PID) of the elementary video stream in the transport stream.
     */
    VideoPid?: __integerMin32Max8182;
  }
  export type M3u8AudioDuration = "DEFAULT_CODEC_DURATION"|"MATCH_VIDEO_DURATION"|string;
  export type M3u8DataPtsControl = "AUTO"|"ALIGN_TO_VIDEO"|string;
  export type M3u8NielsenId3 = "INSERT"|"NONE"|string;
  export type M3u8PcrControl = "PCR_EVERY_PES_PACKET"|"CONFIGURED_PCR_PERIOD"|string;
  export type M3u8Scte35Source = "PASSTHROUGH"|"NONE"|string;
  export interface M3u8Settings {
    /**
     * Specify this setting only when your output will be consumed by a downstream repackaging workflow that is sensitive to very small duration differences between video and audio. For this situation, choose Match video duration (MATCH_VIDEO_DURATION). In all other cases, keep the default value, Default codec duration (DEFAULT_CODEC_DURATION). When you choose Match video duration, MediaConvert pads the output audio streams with silence or trims them to ensure that the total duration of each audio stream is at least as long as the total duration of the video stream. After padding or trimming, the audio stream duration is no more than one frame longer than the video stream. MediaConvert applies audio padding or trimming only to the end of the last segment of the output. For unsegmented outputs, MediaConvert adds padding only to the end of the file. When you keep the default value, any minor discrepancies between audio and video duration will depend on your output audio codec.
     */
    AudioDuration?: M3u8AudioDuration;
    /**
     * The number of audio frames to insert for each PES packet.
     */
    AudioFramesPerPes?: __integerMin0Max2147483647;
    /**
     * Packet Identifier (PID) of the elementary audio stream(s) in the transport stream. Multiple values are accepted, and can be entered in ranges and/or by comma separation.
     */
    AudioPids?: __listOf__integerMin32Max8182;
    /**
     * If you select ALIGN_TO_VIDEO, MediaConvert writes captions and data packets with Presentation Timestamp (PTS) values greater than or equal to the first video packet PTS (MediaConvert drops captions and data packets with lesser PTS values). Keep the default value (AUTO) to allow all PTS values.
     */
    DataPTSControl?: M3u8DataPtsControl;
    /**
     * Specify the maximum time, in milliseconds, between Program Clock References (PCRs) inserted into the transport stream.
     */
    MaxPcrInterval?: __integerMin0Max500;
    /**
     * If INSERT, Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output.
     */
    NielsenId3?: M3u8NielsenId3;
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    PatInterval?: __integerMin0Max1000;
    /**
     * When set to PCR_EVERY_PES_PACKET a Program Clock Reference value is inserted for every Packetized Elementary Stream (PES) header. This parameter is effective only when the PCR PID is the same as the video or audio elementary stream.
     */
    PcrControl?: M3u8PcrControl;
    /**
     * Packet Identifier (PID) of the Program Clock Reference (PCR) in the transport stream. When no value is given, the encoder will assign the same value as the Video PID.
     */
    PcrPid?: __integerMin32Max8182;
    /**
     * The number of milliseconds between instances of this table in the output transport stream.
     */
    PmtInterval?: __integerMin0Max1000;
    /**
     * Packet Identifier (PID) for the Program Map Table (PMT) in the transport stream.
     */
    PmtPid?: __integerMin32Max8182;
    /**
     * Packet Identifier (PID) of the private metadata stream in the transport stream.
     */
    PrivateMetadataPid?: __integerMin32Max8182;
    /**
     * The value of the program number field in the Program Map Table.
     */
    ProgramNumber?: __integerMin0Max65535;
    /**
     * Packet Identifier (PID) of the SCTE-35 stream in the transport stream.
     */
    Scte35Pid?: __integerMin32Max8182;
    /**
     * For SCTE-35 markers from your input-- Choose Passthrough (PASSTHROUGH) if you want SCTE-35 markers that appear in your input to also appear in this output. Choose None (NONE) if you don't want SCTE-35 markers in this output. For SCTE-35 markers from an ESAM XML document-- Choose None (NONE) if you don't want manifest conditioning. Choose Passthrough (PASSTHROUGH) and choose Ad markers (adMarkers) if you do want manifest conditioning. In both cases, also provide the ESAM XML as a string in the setting Signal processing notification XML (sccXml).
     */
    Scte35Source?: M3u8Scte35Source;
    /**
     * Applies only to HLS outputs. Use this setting to specify whether the service inserts the ID3 timed metadata from the input in this output.
     */
    TimedMetadata?: TimedMetadata;
    /**
     * Packet Identifier (PID) of the timed metadata stream in the transport stream.
     */
    TimedMetadataPid?: __integerMin32Max8182;
    /**
     * The value of the transport stream ID field in the Program Map Table.
     */
    TransportStreamId?: __integerMin0Max65535;
    /**
     * Packet Identifier (PID) of the elementary video stream in the transport stream.
     */
    VideoPid?: __integerMin32Max8182;
  }
  export interface MotionImageInserter {
    /**
     * If your motion graphic asset is a .mov file, keep this setting unspecified. If your motion graphic asset is a series of .png files, specify the frame rate of the overlay in frames per second, as a fraction. For example, specify 24 fps as 24/1. Make sure that the number of images in your series matches the frame rate and your intended overlay duration. For example, if you want a 30-second overlay at 30 fps, you should have 900 .png images. This overlay frame rate doesn't need to match the frame rate of the underlying video.
     */
    Framerate?: MotionImageInsertionFramerate;
    /**
     * Specify the .mov file or series of .png files that you want to overlay on your video. For .png files, provide the file name of the first file in the series. Make sure that the names of the .png files end with sequential numbers that specify the order that they are played in. For example, overlay_000.png, overlay_001.png, overlay_002.png, and so on. The sequence must start at zero, and each image file name must have the same number of digits. Pad your initial file names with enough zeros to complete the sequence. For example, if the first image is overlay_0.png, there can be only 10 images in the sequence, with the last image being overlay_9.png. But if the first image is overlay_00.png, there can be 100 images in the sequence.
     */
    Input?: __stringMin14PatternS3Mov09PngHttpsMov09Png;
    /**
     * Choose the type of motion graphic asset that you are providing for your overlay. You can choose either a .mov file or a series of .png files.
     */
    InsertionMode?: MotionImageInsertionMode;
    /**
     * Use Offset to specify the placement of your motion graphic overlay on the video frame. Specify in pixels, from the upper-left corner of the frame. If you don't specify an offset, the service scales your overlay to the full size of the frame. Otherwise, the service inserts the overlay at its native resolution and scales the size up or down with any video scaling.
     */
    Offset?: MotionImageInsertionOffset;
    /**
     * Specify whether your motion graphic overlay repeats on a loop or plays only once.
     */
    Playback?: MotionImagePlayback;
    /**
     * Specify when the motion overlay begins. Use timecode format (HH:MM:SS:FF or HH:MM:SS;FF). Make sure that the timecode you provide here takes into account how you have set up your timecode configuration under both job settings and input settings. The simplest way to do that is to set both to start at 0. If you need to set up your job to follow timecodes embedded in your source that don't start at zero, make sure that you specify a start time that is after the first embedded timecode. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/setting-up-timecode.html Find job-wide and input timecode configuration settings in your JSON job settings specification at settings>timecodeConfig>source and settings>inputs>timecodeSource.
     */
    StartTime?: __stringMin11Max11Pattern01D20305D205D;
  }
  export interface MotionImageInsertionFramerate {
    /**
     * The bottom of the fraction that expresses your overlay frame rate. For example, if your frame rate is 24 fps, set this value to 1.
     */
    FramerateDenominator?: __integerMin1Max17895697;
    /**
     * The top of the fraction that expresses your overlay frame rate. For example, if your frame rate is 24 fps, set this value to 24.
     */
    FramerateNumerator?: __integerMin1Max2147483640;
  }
  export type MotionImageInsertionMode = "MOV"|"PNG"|string;
  export interface MotionImageInsertionOffset {
    /**
     * Set the distance, in pixels, between the overlay and the left edge of the video frame.
     */
    ImageX?: __integerMin0Max2147483647;
    /**
     * Set the distance, in pixels, between the overlay and the top edge of the video frame.
     */
    ImageY?: __integerMin0Max2147483647;
  }
  export type MotionImagePlayback = "ONCE"|"REPEAT"|string;
  export type MovClapAtom = "INCLUDE"|"EXCLUDE"|string;
  export type MovCslgAtom = "INCLUDE"|"EXCLUDE"|string;
  export type MovMpeg2FourCCControl = "XDCAM"|"MPEG"|string;
  export type MovPaddingControl = "OMNEON"|"NONE"|string;
  export type MovReference = "SELF_CONTAINED"|"EXTERNAL"|string;
  export interface MovSettings {
    /**
     * When enabled, include 'clap' atom if appropriate for the video output settings.
     */
    ClapAtom?: MovClapAtom;
    /**
     * When enabled, file composition times will start at zero, composition times in the 'ctts' (composition time to sample) box for B-frames will be negative, and a 'cslg' (composition shift least greatest) box will be included per 14496-1 amendment 1. This improves compatibility with Apple players and tools.
     */
    CslgAtom?: MovCslgAtom;
    /**
     * When set to XDCAM, writes MPEG2 video streams into the QuickTime file using XDCAM fourcc codes. This increases compatibility with Apple editors and players, but may decrease compatibility with other players. Only applicable when the video codec is MPEG2.
     */
    Mpeg2FourCCControl?: MovMpeg2FourCCControl;
    /**
     * To make this output compatible with Omenon, keep the default value, OMNEON. Unless you need Omneon compatibility, set this value to NONE. When you keep the default value, OMNEON, MediaConvert increases the length of the edit list atom. This might cause file rejections when a recipient of the output file doesn't expct this extra padding.
     */
    PaddingControl?: MovPaddingControl;
    /**
     * Always keep the default value (SELF_CONTAINED) for this setting.
     */
    Reference?: MovReference;
  }
  export interface Mp2Settings {
    /**
     * Specify the average bitrate in bits per second.
     */
    Bitrate?: __integerMin32000Max384000;
    /**
     * Set Channels to specify the number of channels in this output audio track. Choosing Mono in the console will give you 1 output channel; choosing Stereo will give you 2. In the API, valid values are 1 and 2.
     */
    Channels?: __integerMin1Max2;
    /**
     * Sample rate in hz.
     */
    SampleRate?: __integerMin32000Max48000;
  }
  export type Mp3RateControlMode = "CBR"|"VBR"|string;
  export interface Mp3Settings {
    /**
     * Specify the average bitrate in bits per second.
     */
    Bitrate?: __integerMin16000Max320000;
    /**
     * Specify the number of channels in this output audio track. Choosing Mono on the console gives you 1 output channel; choosing Stereo gives you 2. In the API, valid values are 1 and 2.
     */
    Channels?: __integerMin1Max2;
    /**
     * Specify whether the service encodes this MP3 audio output with a constant bitrate (CBR) or a variable bitrate (VBR).
     */
    RateControlMode?: Mp3RateControlMode;
    /**
     * Sample rate in hz.
     */
    SampleRate?: __integerMin22050Max48000;
    /**
     * Required when you set Bitrate control mode (rateControlMode) to VBR. Specify the audio quality of this MP3 output from 0 (highest quality) to 9 (lowest quality).
     */
    VbrQuality?: __integerMin0Max9;
  }
  export type Mp4CslgAtom = "INCLUDE"|"EXCLUDE"|string;
  export type Mp4FreeSpaceBox = "INCLUDE"|"EXCLUDE"|string;
  export type Mp4MoovPlacement = "PROGRESSIVE_DOWNLOAD"|"NORMAL"|string;
  export interface Mp4Settings {
    /**
     * Specify this setting only when your output will be consumed by a downstream repackaging workflow that is sensitive to very small duration differences between video and audio. For this situation, choose Match video duration (MATCH_VIDEO_DURATION). In all other cases, keep the default value, Default codec duration (DEFAULT_CODEC_DURATION). When you choose Match video duration, MediaConvert pads the output audio streams with silence or trims them to ensure that the total duration of each audio stream is at least as long as the total duration of the video stream. After padding or trimming, the audio stream duration is no more than one frame longer than the video stream. MediaConvert applies audio padding or trimming only to the end of the last segment of the output. For unsegmented outputs, MediaConvert adds padding only to the end of the file. When you keep the default value, any minor discrepancies between audio and video duration will depend on your output audio codec.
     */
    AudioDuration?: CmfcAudioDuration;
    /**
     * When enabled, file composition times will start at zero, composition times in the 'ctts' (composition time to sample) box for B-frames will be negative, and a 'cslg' (composition shift least greatest) box will be included per 14496-1 amendment 1. This improves compatibility with Apple players and tools.
     */
    CslgAtom?: Mp4CslgAtom;
    /**
     * Ignore this setting unless compliance to the CTTS box version specification matters in your workflow. Specify a value of 1 to set your CTTS box version to 1 and make your output compliant with the specification. When you specify a value of 1, you must also set CSLG atom (cslgAtom) to the value INCLUDE. Keep the default value 0 to set your CTTS box version to 0. This can provide backward compatibility for some players and packagers.
     */
    CttsVersion?: __integerMin0Max1;
    /**
     * Inserts a free-space box immediately after the moov box.
     */
    FreeSpaceBox?: Mp4FreeSpaceBox;
    /**
     * If set to PROGRESSIVE_DOWNLOAD, the MOOV atom is relocated to the beginning of the archive as required for progressive downloading. Otherwise it is placed normally at the end.
     */
    MoovPlacement?: Mp4MoovPlacement;
    /**
     * Overrides the "Major Brand" field in the output file. Usually not necessary to specify.
     */
    Mp4MajorBrand?: __string;
  }
  export type MpdAccessibilityCaptionHints = "INCLUDE"|"EXCLUDE"|string;
  export type MpdAudioDuration = "DEFAULT_CODEC_DURATION"|"MATCH_VIDEO_DURATION"|string;
  export type MpdCaptionContainerType = "RAW"|"FRAGMENTED_MP4"|string;
  export type MpdScte35Esam = "INSERT"|"NONE"|string;
  export type MpdScte35Source = "PASSTHROUGH"|"NONE"|string;
  export interface MpdSettings {
    /**
     * Optional. Choose Include (INCLUDE) to have MediaConvert mark up your DASH manifest with  elements for embedded 608 captions. This markup isn't generally required, but some video players require it to discover and play embedded 608 captions. Keep the default value, Exclude (EXCLUDE), to leave these elements out. When you enable this setting, this is the markup that MediaConvert includes in your manifest: 
     */
    AccessibilityCaptionHints?: MpdAccessibilityCaptionHints;
    /**
     * Specify this setting only when your output will be consumed by a downstream repackaging workflow that is sensitive to very small duration differences between video and audio. For this situation, choose Match video duration (MATCH_VIDEO_DURATION). In all other cases, keep the default value, Default codec duration (DEFAULT_CODEC_DURATION). When you choose Match video duration, MediaConvert pads the output audio streams with silence or trims them to ensure that the total duration of each audio stream is at least as long as the total duration of the video stream. After padding or trimming, the audio stream duration is no more than one frame longer than the video stream. MediaConvert applies audio padding or trimming only to the end of the last segment of the output. For unsegmented outputs, MediaConvert adds padding only to the end of the file. When you keep the default value, any minor discrepancies between audio and video duration will depend on your output audio codec.
     */
    AudioDuration?: MpdAudioDuration;
    /**
     * Use this setting only in DASH output groups that include sidecar TTML or IMSC captions.  You specify sidecar captions in a separate output from your audio and video. Choose Raw (RAW) for captions in a single XML file in a raw container. Choose Fragmented MPEG-4 (FRAGMENTED_MP4) for captions in XML format contained within fragmented MP4 files. This set of fragmented MP4 files is separate from your video and audio fragmented MP4 files.
     */
    CaptionContainerType?: MpdCaptionContainerType;
    /**
     * Use this setting only when you specify SCTE-35 markers from ESAM. Choose INSERT to put SCTE-35 markers in this output at the insertion points that you specify in an ESAM XML document. Provide the document in the setting SCC XML (sccXml).
     */
    Scte35Esam?: MpdScte35Esam;
    /**
     * Ignore this setting unless you have SCTE-35 markers in your input video file. Choose Passthrough (PASSTHROUGH) if you want SCTE-35 markers that appear in your input to also appear in this output. Choose None (NONE) if you don't want those SCTE-35 markers in this output.
     */
    Scte35Source?: MpdScte35Source;
  }
  export type Mpeg2AdaptiveQuantization = "OFF"|"LOW"|"MEDIUM"|"HIGH"|string;
  export type Mpeg2CodecLevel = "AUTO"|"LOW"|"MAIN"|"HIGH1440"|"HIGH"|string;
  export type Mpeg2CodecProfile = "MAIN"|"PROFILE_422"|string;
  export type Mpeg2DynamicSubGop = "ADAPTIVE"|"STATIC"|string;
  export type Mpeg2FramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type Mpeg2FramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type Mpeg2GopSizeUnits = "FRAMES"|"SECONDS"|string;
  export type Mpeg2InterlaceMode = "PROGRESSIVE"|"TOP_FIELD"|"BOTTOM_FIELD"|"FOLLOW_TOP_FIELD"|"FOLLOW_BOTTOM_FIELD"|string;
  export type Mpeg2IntraDcPrecision = "AUTO"|"INTRA_DC_PRECISION_8"|"INTRA_DC_PRECISION_9"|"INTRA_DC_PRECISION_10"|"INTRA_DC_PRECISION_11"|string;
  export type Mpeg2ParControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type Mpeg2QualityTuningLevel = "SINGLE_PASS"|"MULTI_PASS"|string;
  export type Mpeg2RateControlMode = "VBR"|"CBR"|string;
  export type Mpeg2ScanTypeConversionMode = "INTERLACED"|"INTERLACED_OPTIMIZE"|string;
  export type Mpeg2SceneChangeDetect = "DISABLED"|"ENABLED"|string;
  export interface Mpeg2Settings {
    /**
     * Specify the strength of any adaptive quantization filters that you enable. The value that you choose here applies to the following settings: Spatial adaptive quantization (spatialAdaptiveQuantization), and Temporal adaptive quantization (temporalAdaptiveQuantization).
     */
    AdaptiveQuantization?: Mpeg2AdaptiveQuantization;
    /**
     * Specify the average bitrate in bits per second. Required for VBR and CBR. For MS Smooth outputs, bitrates must be unique when rounded down to the nearest multiple of 1000.
     */
    Bitrate?: __integerMin1000Max288000000;
    /**
     * Use Level (Mpeg2CodecLevel) to set the MPEG-2 level for the video output.
     */
    CodecLevel?: Mpeg2CodecLevel;
    /**
     * Use Profile (Mpeg2CodecProfile) to set the MPEG-2 profile for the video output.
     */
    CodecProfile?: Mpeg2CodecProfile;
    /**
     * Choose Adaptive to improve subjective video quality for high-motion content. This will cause the service to use fewer B-frames (which infer information based on other frames) for high-motion portions of the video and more B-frames for low-motion portions. The maximum number of B-frames is limited by the value you provide for the setting B frames between reference frames (numberBFramesBetweenReferenceFrames).
     */
    DynamicSubGop?: Mpeg2DynamicSubGop;
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: Mpeg2FramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: Mpeg2FramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max1001;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin24Max60000;
    /**
     * Specify the relative frequency of open to closed GOPs in this output. For example, if you want to allow four open GOPs and then require a closed GOP, set this value to 5. When you create a streaming output, we recommend that you keep the default value, 1, so that players starting mid-stream receive an IDR frame as quickly as possible. Don't set this value to 0; that would break output segmenting.
     */
    GopClosedCadence?: __integerMin0Max2147483647;
    /**
     * Specify the interval between keyframes, in seconds or frames, for this output. Default: 12 Related settings: When you specify the GOP size in seconds, set GOP mode control (GopSizeUnits) to Specified, seconds (SECONDS). The default value for GOP mode control (GopSizeUnits) is Frames (FRAMES).
     */
    GopSize?: __doubleMin0;
    /**
     * Specify the units for GOP size (GopSize). If you don't specify a value here, by default the encoder measures GOP size in frames.
     */
    GopSizeUnits?: Mpeg2GopSizeUnits;
    /**
     * Percentage of the buffer that should initially be filled (HRD buffer model).
     */
    HrdBufferInitialFillPercentage?: __integerMin0Max100;
    /**
     * Size of buffer (HRD buffer model) in bits. For example, enter five megabits as 5000000.
     */
    HrdBufferSize?: __integerMin0Max47185920;
    /**
     * Choose the scan line type for the output. Keep the default value, Progressive (PROGRESSIVE) to create a progressive output, regardless of the scan type of your input. Use Top field first (TOP_FIELD) or Bottom field first (BOTTOM_FIELD) to create an output that's interlaced with the same field polarity throughout. Use Follow, default top (FOLLOW_TOP_FIELD) or Follow, default bottom (FOLLOW_BOTTOM_FIELD) to produce outputs with the same field polarity as the source. For jobs that have multiple inputs, the output field polarity might change over the course of the output. Follow behavior depends on the input scan type. If the source is interlaced, the output will be interlaced with the same polarity as the source. If the source is progressive, the output will be interlaced with top field bottom field first, depending on which of the Follow options you choose.
     */
    InterlaceMode?: Mpeg2InterlaceMode;
    /**
     * Use Intra DC precision (Mpeg2IntraDcPrecision) to set quantization precision for intra-block DC coefficients. If you choose the value auto, the service will automatically select the precision based on the per-frame compression ratio.
     */
    IntraDcPrecision?: Mpeg2IntraDcPrecision;
    /**
     * Maximum bitrate in bits/second. For example, enter five megabits per second as 5000000.
     */
    MaxBitrate?: __integerMin1000Max300000000;
    /**
     * Use this setting only when you also enable Scene change detection (SceneChangeDetect). This setting determines how the encoder manages the spacing between I-frames that it inserts as part of the I-frame cadence and the I-frames that it inserts for Scene change detection. When you specify a value for this setting, the encoder determines whether to skip a cadence-driven I-frame by the value you set. For example, if you set Min I interval (minIInterval) to 5 and a cadence-driven I-frame would fall within 5 frames of a scene-change I-frame, then the encoder skips the cadence-driven I-frame. In this way, one GOP is shrunk slightly and one GOP is stretched slightly. When the cadence-driven I-frames are farther from the scene-change I-frame than the value you set, then the encoder leaves all I-frames in place and the GOPs surrounding the scene change are smaller than the usual cadence GOPs.
     */
    MinIInterval?: __integerMin0Max30;
    /**
     * Specify the number of B-frames that MediaConvert puts between reference frames in this output. Valid values are whole numbers from 0 through 7. When you don't specify a value, MediaConvert defaults to 2.
     */
    NumberBFramesBetweenReferenceFrames?: __integerMin0Max7;
    /**
     * Optional. Specify how the service determines the pixel aspect ratio (PAR) for this output. The default behavior, Follow source (INITIALIZE_FROM_SOURCE), uses the PAR from your input video for your output. To specify a different PAR in the console, choose any value other than Follow source. To specify a different PAR by editing the JSON job specification, choose SPECIFIED. When you choose SPECIFIED for this setting, you must also specify values for the parNumerator and parDenominator settings.
     */
    ParControl?: Mpeg2ParControl;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parDenominator is 33.
     */
    ParDenominator?: __integerMin1Max2147483647;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parNumerator is 40.
     */
    ParNumerator?: __integerMin1Max2147483647;
    /**
     * Optional. Use Quality tuning level (qualityTuningLevel) to choose how you want to trade off encoding speed for output video quality. The default behavior is faster, lower quality, single-pass encoding.
     */
    QualityTuningLevel?: Mpeg2QualityTuningLevel;
    /**
     * Use Rate control mode (Mpeg2RateControlMode) to specify whether the bitrate is variable (vbr) or constant (cbr).
     */
    RateControlMode?: Mpeg2RateControlMode;
    /**
     * Use this setting for interlaced outputs, when your output frame rate is half of your input frame rate. In this situation, choose Optimized interlacing (INTERLACED_OPTIMIZE) to create a better quality interlaced output. In this case, each progressive frame from the input corresponds to an interlaced field in the output. Keep the default value, Basic interlacing (INTERLACED), for all other output frame rates. With basic interlacing, MediaConvert performs any frame rate conversion first and then interlaces the frames. When you choose Optimized interlacing and you set your output frame rate to a value that isn't suitable for optimized interlacing, MediaConvert automatically falls back to basic interlacing. Required settings: To use optimized interlacing, you must set Telecine (telecine) to None (NONE) or Soft (SOFT). You can't use optimized interlacing for hard telecine outputs. You must also set Interlace mode (interlaceMode) to a value other than Progressive (PROGRESSIVE).
     */
    ScanTypeConversionMode?: Mpeg2ScanTypeConversionMode;
    /**
     * Enable this setting to insert I-frames at scene changes that the service automatically detects. This improves video quality and is enabled by default.
     */
    SceneChangeDetect?: Mpeg2SceneChangeDetect;
    /**
     * Ignore this setting unless your input frame rate is 23.976 or 24 frames per second (fps). Enable slow PAL to create a 25 fps output. When you enable slow PAL, MediaConvert relabels the video frames to 25 fps and resamples your audio to keep it synchronized with the video. Note that enabling this setting will slightly reduce the duration of your video. Required settings: You must also set Framerate to 25. In your JSON job specification, set (framerateControl) to (SPECIFIED), (framerateNumerator) to 25 and (framerateDenominator) to 1.
     */
    SlowPal?: Mpeg2SlowPal;
    /**
     * Ignore this setting unless you need to comply with a specification that requires a specific value. If you don't have a specification requirement, we recommend that you adjust the softness of your output by using a lower value for the setting Sharpness (sharpness) or by enabling a noise reducer filter (noiseReducerFilter). The Softness (softness) setting specifies the quantization matrices that the encoder uses. Keep the default value, 0, to use the AWS Elemental default matrices. Choose a value from 17 to 128 to use planar interpolation. Increasing values from 17 to 128 result in increasing reduction of high-frequency data. The value 128 results in the softest video.
     */
    Softness?: __integerMin0Max128;
    /**
     * Keep the default value, Enabled (ENABLED), to adjust quantization within each frame based on spatial variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas that can sustain more distortion with no noticeable visual degradation and uses more bits on areas where any small distortion will be noticeable. For example, complex textured blocks are encoded with fewer bits and smooth textured blocks are encoded with more bits. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen with a lot of complex texture, you might choose to disable this feature. Related setting: When you enable spatial adaptive quantization, set the value for Adaptive quantization (adaptiveQuantization) depending on your content. For homogeneous content, such as cartoons and video games, set it to Low. For content with a wider variety of textures, set it to High or Higher.
     */
    SpatialAdaptiveQuantization?: Mpeg2SpatialAdaptiveQuantization;
    /**
     * Specify whether this output's video uses the D10 syntax. Keep the default value to  not use the syntax. Related settings: When you choose D10 (D_10) for your MXF  profile (profile), you must also set this value to to D10 (D_10).
     */
    Syntax?: Mpeg2Syntax;
    /**
     * When you do frame rate conversion from 23.976 frames per second (fps) to 29.97 fps, and your output scan type is interlaced, you can optionally enable hard or soft telecine to create a smoother picture. Hard telecine (HARD) produces a 29.97i output. Soft telecine (SOFT) produces an output with a 23.976 output that signals to the video player device to do the conversion during play back. When you keep the default value, None (NONE), MediaConvert does a standard frame rate conversion to 29.97 without doing anything with the field polarity to create a smoother picture.
     */
    Telecine?: Mpeg2Telecine;
    /**
     * Keep the default value, Enabled (ENABLED), to adjust quantization within each frame based on temporal variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas of the frame that aren't moving and uses more bits on complex objects with sharp edges that move a lot. For example, this feature improves the readability of text tickers on newscasts and scoreboards on sports matches. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen that doesn't have moving objects with sharp edges, such as sports athletes' faces, you might choose to disable this feature. Related setting: When you enable temporal quantization, adjust the strength of the filter with the setting Adaptive quantization (adaptiveQuantization).
     */
    TemporalAdaptiveQuantization?: Mpeg2TemporalAdaptiveQuantization;
  }
  export type Mpeg2SlowPal = "DISABLED"|"ENABLED"|string;
  export type Mpeg2SpatialAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type Mpeg2Syntax = "DEFAULT"|"D_10"|string;
  export type Mpeg2Telecine = "NONE"|"SOFT"|"HARD"|string;
  export type Mpeg2TemporalAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export interface MsSmoothAdditionalManifest {
    /**
     * Specify a name modifier that the service adds to the name of this manifest to make it different from the file names of the other main manifests in the output group. For example, say that the default main manifest for your Microsoft Smooth group is film-name.ismv. If you enter "-no-premium" for this setting, then the file name the service generates for this top-level manifest is film-name-no-premium.ismv.
     */
    ManifestNameModifier?: __stringMin1;
    /**
     * Specify the outputs that you want this additional top-level manifest to reference.
     */
    SelectedOutputs?: __listOf__stringMin1;
  }
  export type MsSmoothAudioDeduplication = "COMBINE_DUPLICATE_STREAMS"|"NONE"|string;
  export interface MsSmoothEncryptionSettings {
    /**
     * If your output group type is HLS, DASH, or Microsoft Smooth, use these settings when doing DRM encryption with a SPEKE-compliant key provider.  If your output group type is CMAF, use the SpekeKeyProviderCmaf settings instead.
     */
    SpekeKeyProvider?: SpekeKeyProvider;
  }
  export type MsSmoothFragmentLengthControl = "EXACT"|"GOP_MULTIPLE"|string;
  export interface MsSmoothGroupSettings {
    /**
     * By default, the service creates one .ism Microsoft Smooth Streaming manifest for each Microsoft Smooth Streaming output group in your job. This default manifest references every output in the output group. To create additional manifests that reference a subset of the outputs in the output group, specify a list of them here.
     */
    AdditionalManifests?: __listOfMsSmoothAdditionalManifest;
    /**
     * COMBINE_DUPLICATE_STREAMS combines identical audio encoding settings across a Microsoft Smooth output group into a single audio stream.
     */
    AudioDeduplication?: MsSmoothAudioDeduplication;
    /**
     * Use Destination (Destination) to specify the S3 output location and the output filename base. Destination accepts format identifiers. If you do not specify the base filename in the URI, the service will use the filename of the input file. If your job has multiple inputs, the service uses the filename of the first input file.
     */
    Destination?: __stringPatternS3;
    /**
     * Settings associated with the destination. Will vary based on the type of destination
     */
    DestinationSettings?: DestinationSettings;
    /**
     * If you are using DRM, set DRM System (MsSmoothEncryptionSettings) to specify the value SpekeKeyProvider.
     */
    Encryption?: MsSmoothEncryptionSettings;
    /**
     * Specify how you want MediaConvert to determine the fragment length. Choose Exact (EXACT) to have the encoder use the exact length that you specify with the setting Fragment length (FragmentLength). This might result in extra I-frames. Choose Multiple of GOP (GOP_MULTIPLE) to have the encoder round up the segment lengths to match the next GOP boundary.
     */
    FragmentLength?: __integerMin1Max2147483647;
    /**
     * Specify how you want MediaConvert to determine the fragment length. Choose Exact (EXACT) to have the encoder use the exact length that you specify with the setting Fragment length (FragmentLength). This might result in extra I-frames. Choose Multiple of GOP (GOP_MULTIPLE) to have the encoder round up the segment lengths to match the next GOP boundary.
     */
    FragmentLengthControl?: MsSmoothFragmentLengthControl;
    /**
     * Use Manifest encoding (MsSmoothManifestEncoding) to specify the encoding format for the server and client manifest. Valid options are utf8 and utf16.
     */
    ManifestEncoding?: MsSmoothManifestEncoding;
  }
  export type MsSmoothManifestEncoding = "UTF8"|"UTF16"|string;
  export type MxfAfdSignaling = "NO_COPY"|"COPY_FROM_VIDEO"|string;
  export type MxfProfile = "D_10"|"XDCAM"|"OP1A"|"XAVC"|string;
  export interface MxfSettings {
    /**
     * Optional. When you have AFD signaling set up in your output video stream, use this setting to choose whether to also include it in the MXF wrapper. Choose Don't copy (NO_COPY) to exclude AFD signaling from the MXF wrapper. Choose Copy from video stream (COPY_FROM_VIDEO) to copy the AFD values from the video stream for this output to the MXF wrapper. Regardless of which option you choose, the AFD values remain in the video stream. Related settings: To set up your output to include or exclude AFD values, see AfdSignaling, under VideoDescription. On the console, find AFD signaling under the output's video encoding settings.
     */
    AfdSignaling?: MxfAfdSignaling;
    /**
     * Specify the MXF profile, also called shim, for this output. When you choose Auto, MediaConvert chooses a profile based on the video codec and resolution. For a list of codecs supported with each MXF profile, see https://docs.aws.amazon.com/mediaconvert/latest/ug/codecs-supported-with-each-mxf-profile.html. For more information about the automatic selection behavior, see https://docs.aws.amazon.com/mediaconvert/latest/ug/default-automatic-selection-of-mxf-profiles.html.
     */
    Profile?: MxfProfile;
    /**
     * Specify the XAVC profile settings for MXF outputs when you set your MXF profile to XAVC.
     */
    XavcProfileSettings?: MxfXavcProfileSettings;
  }
  export type MxfXavcDurationMode = "ALLOW_ANY_DURATION"|"DROP_FRAMES_FOR_COMPLIANCE"|string;
  export interface MxfXavcProfileSettings {
    /**
     * To create an output that complies with the XAVC file format guidelines for interoperability, keep the default value, Drop frames for compliance (DROP_FRAMES_FOR_COMPLIANCE). To include all frames from your input in this output, keep the default setting, Allow any duration (ALLOW_ANY_DURATION). The number of frames that MediaConvert excludes when you set this to Drop frames for compliance depends on the output frame rate and duration.
     */
    DurationMode?: MxfXavcDurationMode;
    /**
     * Specify a value for this setting only for outputs that you set up with one of these two XAVC profiles: XAVC HD Intra CBG (XAVC_HD_INTRA_CBG) or XAVC 4K Intra CBG (XAVC_4K_INTRA_CBG). Specify the amount of space in each frame that the service reserves for ancillary data, such as teletext captions. The default value for this setting is 1492 bytes per frame. This should be sufficient to prevent overflow unless you have multiple pages of teletext captions data. If you have a large amount of teletext data, specify a larger number.
     */
    MaxAncDataSize?: __integerMin0Max2147483647;
  }
  export interface NexGuardFileMarkerSettings {
    /**
     * Use the base64 license string that Nagra provides you. Enter it directly in your JSON job specification or in the console. Required when you include Nagra NexGuard File Marker watermarking (NexGuardWatermarkingSettings) in your job.
     */
    License?: __stringMin1Max100000;
    /**
     * Specify the payload ID that you want associated with this output. Valid values vary depending on your Nagra NexGuard forensic watermarking workflow. Required when you include Nagra NexGuard File Marker watermarking (NexGuardWatermarkingSettings) in your job. For PreRelease Content (NGPR/G2), specify an integer from 1 through 4,194,303. You must generate a unique ID for each asset you watermark, and keep a record of which ID you have assigned to each asset. Neither Nagra nor MediaConvert keep track of the relationship between output files and your IDs. For OTT Streaming, create two adaptive bitrate (ABR) stacks for each asset. Do this by setting up two output groups. For one output group, set the value of Payload ID (payload) to 0 in every output. For the other output group, set Payload ID (payload) to 1 in every output.
     */
    Payload?: __integerMin0Max4194303;
    /**
     * Enter one of the watermarking preset strings that Nagra provides you. Required when you include Nagra NexGuard File Marker watermarking (NexGuardWatermarkingSettings) in your job.
     */
    Preset?: __stringMin1Max256;
    /**
     * Optional. Ignore this setting unless Nagra support directs you to specify a value. When you don't specify a value here, the Nagra NexGuard library uses its default value.
     */
    Strength?: WatermarkingStrength;
  }
  export type NielsenActiveWatermarkProcessType = "NAES2_AND_NW"|"CBET"|"NAES2_AND_NW_AND_CBET"|string;
  export interface NielsenConfiguration {
    /**
     * Nielsen has discontinued the use of breakout code functionality. If you must include this property, set the value to zero.
     */
    BreakoutCode?: __integerMin0Max0;
    /**
     * Use Distributor ID (DistributorID) to specify the distributor ID that is assigned to your organization by Neilsen.
     */
    DistributorId?: __string;
  }
  export interface NielsenNonLinearWatermarkSettings {
    /**
     * Choose the type of Nielsen watermarks that you want in your outputs. When you choose NAES 2 and NW (NAES2_AND_NW), you must provide a value for the setting SID (sourceId). When you choose CBET (CBET), you must provide a value for the setting CSID (cbetSourceId). When you choose NAES 2, NW, and CBET (NAES2_AND_NW_AND_CBET), you must provide values for both of these settings.
     */
    ActiveWatermarkProcess?: NielsenActiveWatermarkProcessType;
    /**
     * Optional. Use this setting when you want the service to include an ADI file in the Nielsen  metadata .zip file. To provide an ADI file, store it in Amazon S3 and provide a URL to it  here. The URL should be in the following format: S3://bucket/path/ADI-file. For more information about the metadata .zip file, see the setting Metadata destination (metadataDestination).
     */
    AdiFilename?: __stringPatternS3;
    /**
     * Use the asset ID that you provide to Nielsen to uniquely identify this asset. Required for all Nielsen non-linear watermarking.
     */
    AssetId?: __stringMin1Max20;
    /**
     * Use the asset name that you provide to Nielsen for this asset. Required for all Nielsen non-linear watermarking.
     */
    AssetName?: __stringMin1Max50;
    /**
     * Use the CSID that Nielsen provides to you. This CBET source ID should be unique to your Nielsen account but common to all of your output assets that have CBET watermarking. Required when you choose a value for the setting Watermark types (ActiveWatermarkProcess) that includes CBET.
     */
    CbetSourceId?: __stringPattern0xAFaF0908190908;
    /**
     * Optional. If this asset uses an episode ID with Nielsen, provide it here.
     */
    EpisodeId?: __stringMin1Max20;
    /**
     * Specify the Amazon S3 location where you want MediaConvert to save your Nielsen non-linear metadata .zip file. This Amazon S3 bucket must be in the same Region as the one where you do your MediaConvert transcoding. If you want to include an ADI file in this .zip file, use the setting ADI file (adiFilename) to specify it. MediaConvert delivers the Nielsen metadata .zip files only to your metadata destination Amazon S3 bucket. It doesn't deliver the .zip files to Nielsen. You are responsible for delivering the metadata .zip files to Nielsen.
     */
    MetadataDestination?: __stringPatternS3;
    /**
     * Use the SID that Nielsen provides to you. This source ID should be unique to your Nielsen account but common to all of your output assets. Required for all Nielsen non-linear watermarking. This ID should be unique to your Nielsen account but common to all of your output assets. Required for all Nielsen non-linear watermarking.
     */
    SourceId?: __integerMin0Max65534;
    /**
     * Required. Specify whether your source content already contains Nielsen non-linear watermarks. When you set this value to Watermarked (WATERMARKED), the service fails the job. Nielsen requires that you add non-linear watermarking to only clean content that doesn't already  have non-linear Nielsen watermarks.
     */
    SourceWatermarkStatus?: NielsenSourceWatermarkStatusType;
    /**
     * Specify the endpoint for the TIC server that you have deployed and configured in the AWS Cloud. Required for all Nielsen non-linear watermarking. MediaConvert can't connect directly to a TIC server. Instead, you must use API Gateway to provide a RESTful interface between MediaConvert and a TIC server that you deploy in your AWS account. For more information on deploying a TIC server in your AWS account and the required API Gateway, contact Nielsen support.
     */
    TicServerUrl?: __stringPatternHttps;
    /**
     * To create assets that have the same TIC values in each audio track, keep the default value Share TICs (SAME_TICS_PER_TRACK). To create assets that have unique TIC values for each audio track, choose Use unique TICs (RESERVE_UNIQUE_TICS_PER_TRACK).
     */
    UniqueTicPerAudioTrack?: NielsenUniqueTicPerAudioTrackType;
  }
  export type NielsenSourceWatermarkStatusType = "CLEAN"|"WATERMARKED"|string;
  export type NielsenUniqueTicPerAudioTrackType = "RESERVE_UNIQUE_TICS_PER_TRACK"|"SAME_TICS_PER_TRACK"|string;
  export type NoiseFilterPostTemporalSharpening = "DISABLED"|"ENABLED"|"AUTO"|string;
  export interface NoiseReducer {
    /**
     * Use Noise reducer filter (NoiseReducerFilter) to select one of the following spatial image filtering functions. To use this setting, you must also enable Noise reducer (NoiseReducer). * Bilateral preserves edges while reducing noise. * Mean (softest), Gaussian, Lanczos, and Sharpen (sharpest) do convolution filtering. * Conserve does min/max noise reduction. * Spatial does frequency-domain filtering based on JND principles. * Temporal optimizes video quality for complex motion.
     */
    Filter?: NoiseReducerFilter;
    /**
     * Settings for a noise reducer filter
     */
    FilterSettings?: NoiseReducerFilterSettings;
    /**
     * Noise reducer filter settings for spatial filter.
     */
    SpatialFilterSettings?: NoiseReducerSpatialFilterSettings;
    /**
     * Noise reducer filter settings for temporal filter.
     */
    TemporalFilterSettings?: NoiseReducerTemporalFilterSettings;
  }
  export type NoiseReducerFilter = "BILATERAL"|"MEAN"|"GAUSSIAN"|"LANCZOS"|"SHARPEN"|"CONSERVE"|"SPATIAL"|"TEMPORAL"|string;
  export interface NoiseReducerFilterSettings {
    /**
     * Relative strength of noise reducing filter. Higher values produce stronger filtering.
     */
    Strength?: __integerMin0Max3;
  }
  export interface NoiseReducerSpatialFilterSettings {
    /**
     * Specify strength of post noise reduction sharpening filter, with 0 disabling the filter and 3 enabling it at maximum strength.
     */
    PostFilterSharpenStrength?: __integerMin0Max3;
    /**
     * The speed of the filter, from -2 (lower speed) to 3 (higher speed), with 0 being the nominal value.
     */
    Speed?: __integerMinNegative2Max3;
    /**
     * Relative strength of noise reducing filter. Higher values produce stronger filtering.
     */
    Strength?: __integerMin0Max16;
  }
  export interface NoiseReducerTemporalFilterSettings {
    /**
     * Use Aggressive mode for content that has complex motion. Higher values produce stronger temporal filtering. This filters highly complex scenes more aggressively and creates better VQ for low bitrate outputs.
     */
    AggressiveMode?: __integerMin0Max4;
    /**
     * Optional. When you set Noise reducer (noiseReducer) to Temporal (TEMPORAL), you can use this setting to apply sharpening. The default behavior, Auto (AUTO), allows the transcoder to determine whether to apply filtering, depending on input type and quality. When you set Noise reducer to Temporal, your output bandwidth is reduced. When Post temporal sharpening is also enabled, that bandwidth reduction is smaller.
     */
    PostTemporalSharpening?: NoiseFilterPostTemporalSharpening;
    /**
     * The speed of the filter (higher number is faster). Low setting reduces bit rate at the cost of transcode time, high setting improves transcode time at the cost of bit rate.
     */
    Speed?: __integerMinNegative1Max3;
    /**
     * Specify the strength of the noise reducing filter on this output. Higher values produce stronger filtering. We recommend the following value ranges, depending on the result that you want: * 0-2 for complexity reduction with minimal sharpness loss * 2-8 for complexity reduction with image preservation * 8-16 for a high level of complexity reduction
     */
    Strength?: __integerMin0Max16;
  }
  export interface OpusSettings {
    /**
     * Optional. Specify the average bitrate in bits per second. Valid values are multiples of 8000, from 32000 through 192000. The default value is 96000, which we recommend for quality and bandwidth.
     */
    Bitrate?: __integerMin32000Max192000;
    /**
     * Specify the number of channels in this output audio track. Choosing Mono on the console gives you 1 output channel; choosing Stereo gives you 2. In the API, valid values are 1 and 2.
     */
    Channels?: __integerMin1Max2;
    /**
     * Optional. Sample rate in hz. Valid values are 16000, 24000, and 48000. The default value is 48000.
     */
    SampleRate?: __integerMin16000Max48000;
  }
  export type Order = "ASCENDING"|"DESCENDING"|string;
  export interface Output {
    /**
     * (AudioDescriptions) contains groups of audio encoding settings organized by audio codec. Include one instance of (AudioDescriptions) per output. (AudioDescriptions) can contain multiple groups of encoding settings.
     */
    AudioDescriptions?: __listOfAudioDescription;
    /**
     * (CaptionDescriptions) contains groups of captions settings. For each output that has captions, include one instance of (CaptionDescriptions). (CaptionDescriptions) can contain multiple groups of captions settings.
     */
    CaptionDescriptions?: __listOfCaptionDescription;
    /**
     * Container specific settings.
     */
    ContainerSettings?: ContainerSettings;
    /**
     * Use Extension (Extension) to specify the file extension for outputs in File output groups. If you do not specify a value, the service will use default extensions by container type as follows * MPEG-2 transport stream, m2ts * Quicktime, mov * MXF container, mxf * MPEG-4 container, mp4 * WebM container, webm * No Container, the service will use codec extensions (e.g. AAC, H265, H265, AC3)
     */
    Extension?: __string;
    /**
     * Use Name modifier (NameModifier) to have the service add a string to the end of each output filename. You specify the base filename as part of your destination URI. When you create multiple outputs in the same output group, Name modifier (NameModifier) is required. Name modifier also accepts format identifiers. For DASH ISO outputs, if you use the format identifiers $Number$ or $Time$ in one output, you must use them in the same way in all outputs of the output group.
     */
    NameModifier?: __stringMin1;
    /**
     * Specific settings for this type of output.
     */
    OutputSettings?: OutputSettings;
    /**
     * Use Preset (Preset) to specify a preset for your transcoding settings. Provide the system or custom preset name. You can specify either Preset (Preset) or Container settings (ContainerSettings), but not both.
     */
    Preset?: __stringMin0;
    /**
     * VideoDescription contains a group of video encoding settings. The specific video settings depend on the video codec that you choose for the property codec. Include one instance of VideoDescription per output.
     */
    VideoDescription?: VideoDescription;
  }
  export interface OutputChannelMapping {
    /**
     * Use this setting to specify your remix values when they are integers, such as -10, 0, or 4.
     */
    InputChannels?: __listOf__integerMinNegative60Max6;
    /**
     * Use this setting to specify your remix values when they have a decimal component, such as -10.312, 0.08, or 4.9. MediaConvert rounds your remixing values to the nearest thousandth.
     */
    InputChannelsFineTune?: __listOf__doubleMinNegative60Max6;
  }
  export interface OutputDetail {
    /**
     * Duration in milliseconds
     */
    DurationInMs?: __integer;
    /**
     * Contains details about the output's video stream
     */
    VideoDetails?: VideoDetail;
  }
  export interface OutputGroup {
    /**
     * Use automated encoding to have MediaConvert choose your encoding settings for you, based on characteristics of your input video.
     */
    AutomatedEncodingSettings?: AutomatedEncodingSettings;
    /**
     * Use Custom Group Name (CustomName) to specify a name for the output group. This value is displayed on the console and can make your job settings JSON more human-readable. It does not affect your outputs. Use up to twelve characters that are either letters, numbers, spaces, or underscores.
     */
    CustomName?: __string;
    /**
     * Name of the output group
     */
    Name?: __string;
    /**
     * Output Group settings, including type
     */
    OutputGroupSettings?: OutputGroupSettings;
    /**
     * This object holds groups of encoding settings, one group of settings per output.
     */
    Outputs?: __listOfOutput;
  }
  export interface OutputGroupDetail {
    /**
     * Details about the output
     */
    OutputDetails?: __listOfOutputDetail;
  }
  export interface OutputGroupSettings {
    /**
     * Settings related to your CMAF output package. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/outputs-file-ABR.html. When you work directly in your JSON job specification, include this object and any required children when you set Type, under OutputGroupSettings, to CMAF_GROUP_SETTINGS.
     */
    CmafGroupSettings?: CmafGroupSettings;
    /**
     * Settings related to your DASH output package. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/outputs-file-ABR.html. When you work directly in your JSON job specification, include this object and any required children when you set Type, under OutputGroupSettings, to DASH_ISO_GROUP_SETTINGS.
     */
    DashIsoGroupSettings?: DashIsoGroupSettings;
    /**
     * Settings related to your File output group. MediaConvert uses this group of settings to generate a single standalone file, rather than a streaming package. When you work directly in your JSON job specification, include this object and any required children when you set Type, under OutputGroupSettings, to FILE_GROUP_SETTINGS.
     */
    FileGroupSettings?: FileGroupSettings;
    /**
     * Settings related to your HLS output package. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/outputs-file-ABR.html. When you work directly in your JSON job specification, include this object and any required children when you set Type, under OutputGroupSettings, to HLS_GROUP_SETTINGS.
     */
    HlsGroupSettings?: HlsGroupSettings;
    /**
     * Settings related to your Microsoft Smooth Streaming output package. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/outputs-file-ABR.html. When you work directly in your JSON job specification, include this object and any required children when you set Type, under OutputGroupSettings, to MS_SMOOTH_GROUP_SETTINGS.
     */
    MsSmoothGroupSettings?: MsSmoothGroupSettings;
    /**
     * Type of output group (File group, Apple HLS, DASH ISO, Microsoft Smooth Streaming, CMAF)
     */
    Type?: OutputGroupType;
  }
  export type OutputGroupType = "HLS_GROUP_SETTINGS"|"DASH_ISO_GROUP_SETTINGS"|"FILE_GROUP_SETTINGS"|"MS_SMOOTH_GROUP_SETTINGS"|"CMAF_GROUP_SETTINGS"|string;
  export type OutputSdt = "SDT_FOLLOW"|"SDT_FOLLOW_IF_PRESENT"|"SDT_MANUAL"|"SDT_NONE"|string;
  export interface OutputSettings {
    /**
     * Settings for HLS output groups
     */
    HlsSettings?: HlsSettings;
  }
  export interface PartnerWatermarking {
    /**
     * For forensic video watermarking, MediaConvert supports Nagra NexGuard File Marker watermarking. MediaConvert supports both PreRelease Content (NGPR/G2) and OTT Streaming workflows.
     */
    NexguardFileMarkerSettings?: NexGuardFileMarkerSettings;
  }
  export interface Policy {
    /**
     * Allow or disallow jobs that specify HTTP inputs.
     */
    HttpInputs?: InputPolicy;
    /**
     * Allow or disallow jobs that specify HTTPS inputs.
     */
    HttpsInputs?: InputPolicy;
    /**
     * Allow or disallow jobs that specify Amazon S3 inputs.
     */
    S3Inputs?: InputPolicy;
  }
  export interface Preset {
    /**
     * An identifier for this resource that is unique within all of AWS.
     */
    Arn?: __string;
    /**
     * An optional category you create to organize your presets.
     */
    Category?: __string;
    /**
     * The timestamp in epoch seconds for preset creation.
     */
    CreatedAt?: __timestampUnix;
    /**
     * An optional description you create for each preset.
     */
    Description?: __string;
    /**
     * The timestamp in epoch seconds when the preset was last updated.
     */
    LastUpdated?: __timestampUnix;
    /**
     * A name you create for each preset. Each name must be unique within your account.
     */
    Name: __string;
    /**
     * Settings for preset
     */
    Settings: PresetSettings;
    /**
     * A preset can be of two types: system or custom. System or built-in preset can't be modified or deleted by the user.
     */
    Type?: Type;
  }
  export type PresetListBy = "NAME"|"CREATION_DATE"|"SYSTEM"|string;
  export interface PresetSettings {
    /**
     * (AudioDescriptions) contains groups of audio encoding settings organized by audio codec. Include one instance of (AudioDescriptions) per output. (AudioDescriptions) can contain multiple groups of encoding settings.
     */
    AudioDescriptions?: __listOfAudioDescription;
    /**
     * This object holds groups of settings related to captions for one output. For each output that has captions, include one instance of CaptionDescriptions.
     */
    CaptionDescriptions?: __listOfCaptionDescriptionPreset;
    /**
     * Container specific settings.
     */
    ContainerSettings?: ContainerSettings;
    /**
     * VideoDescription contains a group of video encoding settings. The specific video settings depend on the video codec that you choose for the property codec. Include one instance of VideoDescription per output.
     */
    VideoDescription?: VideoDescription;
  }
  export type PricingPlan = "ON_DEMAND"|"RESERVED"|string;
  export type ProresChromaSampling = "PRESERVE_444_SAMPLING"|"SUBSAMPLE_TO_422"|string;
  export type ProresCodecProfile = "APPLE_PRORES_422"|"APPLE_PRORES_422_HQ"|"APPLE_PRORES_422_LT"|"APPLE_PRORES_422_PROXY"|"APPLE_PRORES_4444"|"APPLE_PRORES_4444_XQ"|string;
  export type ProresFramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type ProresFramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type ProresInterlaceMode = "PROGRESSIVE"|"TOP_FIELD"|"BOTTOM_FIELD"|"FOLLOW_TOP_FIELD"|"FOLLOW_BOTTOM_FIELD"|string;
  export type ProresParControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type ProresScanTypeConversionMode = "INTERLACED"|"INTERLACED_OPTIMIZE"|string;
  export interface ProresSettings {
    /**
     * This setting applies only to ProRes 4444 and ProRes 4444 XQ outputs that you create from inputs that use 4:4:4 chroma sampling. Set Preserve 4:4:4 sampling (PRESERVE_444_SAMPLING) to allow outputs to also use 4:4:4 chroma sampling. You must specify a value for this setting when your output codec profile supports 4:4:4 chroma sampling. Related Settings: When you set Chroma sampling to Preserve 4:4:4 sampling (PRESERVE_444_SAMPLING), you must choose an output codec profile that supports 4:4:4 chroma sampling. These values for Profile (CodecProfile) support 4:4:4 chroma sampling: Apple ProRes 4444 (APPLE_PRORES_4444) or Apple ProRes 4444 XQ (APPLE_PRORES_4444_XQ). When you set Chroma sampling to Preserve 4:4:4 sampling, you must disable all video preprocessors except for Nexguard file marker (PartnerWatermarking). When you set Chroma sampling to Preserve 4:4:4 sampling and use framerate conversion, you must set Frame rate conversion algorithm (FramerateConversionAlgorithm) to Drop duplicate (DUPLICATE_DROP).
     */
    ChromaSampling?: ProresChromaSampling;
    /**
     * Use Profile (ProResCodecProfile) to specify the type of Apple ProRes codec to use for this output.
     */
    CodecProfile?: ProresCodecProfile;
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: ProresFramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: ProresFramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max2147483647;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin1Max2147483647;
    /**
     * Choose the scan line type for the output. Keep the default value, Progressive (PROGRESSIVE) to create a progressive output, regardless of the scan type of your input. Use Top field first (TOP_FIELD) or Bottom field first (BOTTOM_FIELD) to create an output that's interlaced with the same field polarity throughout. Use Follow, default top (FOLLOW_TOP_FIELD) or Follow, default bottom (FOLLOW_BOTTOM_FIELD) to produce outputs with the same field polarity as the source. For jobs that have multiple inputs, the output field polarity might change over the course of the output. Follow behavior depends on the input scan type. If the source is interlaced, the output will be interlaced with the same polarity as the source. If the source is progressive, the output will be interlaced with top field bottom field first, depending on which of the Follow options you choose.
     */
    InterlaceMode?: ProresInterlaceMode;
    /**
     * Optional. Specify how the service determines the pixel aspect ratio (PAR) for this output. The default behavior, Follow source (INITIALIZE_FROM_SOURCE), uses the PAR from your input video for your output. To specify a different PAR in the console, choose any value other than Follow source. To specify a different PAR by editing the JSON job specification, choose SPECIFIED. When you choose SPECIFIED for this setting, you must also specify values for the parNumerator and parDenominator settings.
     */
    ParControl?: ProresParControl;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parDenominator is 33.
     */
    ParDenominator?: __integerMin1Max2147483647;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parNumerator is 40.
     */
    ParNumerator?: __integerMin1Max2147483647;
    /**
     * Use this setting for interlaced outputs, when your output frame rate is half of your input frame rate. In this situation, choose Optimized interlacing (INTERLACED_OPTIMIZE) to create a better quality interlaced output. In this case, each progressive frame from the input corresponds to an interlaced field in the output. Keep the default value, Basic interlacing (INTERLACED), for all other output frame rates. With basic interlacing, MediaConvert performs any frame rate conversion first and then interlaces the frames. When you choose Optimized interlacing and you set your output frame rate to a value that isn't suitable for optimized interlacing, MediaConvert automatically falls back to basic interlacing. Required settings: To use optimized interlacing, you must set Telecine (telecine) to None (NONE) or Soft (SOFT). You can't use optimized interlacing for hard telecine outputs. You must also set Interlace mode (interlaceMode) to a value other than Progressive (PROGRESSIVE).
     */
    ScanTypeConversionMode?: ProresScanTypeConversionMode;
    /**
     * Ignore this setting unless your input frame rate is 23.976 or 24 frames per second (fps). Enable slow PAL to create a 25 fps output. When you enable slow PAL, MediaConvert relabels the video frames to 25 fps and resamples your audio to keep it synchronized with the video. Note that enabling this setting will slightly reduce the duration of your video. Required settings: You must also set Framerate to 25. In your JSON job specification, set (framerateControl) to (SPECIFIED), (framerateNumerator) to 25 and (framerateDenominator) to 1.
     */
    SlowPal?: ProresSlowPal;
    /**
     * When you do frame rate conversion from 23.976 frames per second (fps) to 29.97 fps, and your output scan type is interlaced, you can optionally enable hard telecine (HARD) to create a smoother picture. When you keep the default value, None (NONE), MediaConvert does a standard frame rate conversion to 29.97 without doing anything with the field polarity to create a smoother picture.
     */
    Telecine?: ProresTelecine;
  }
  export type ProresSlowPal = "DISABLED"|"ENABLED"|string;
  export type ProresTelecine = "NONE"|"HARD"|string;
  export interface PutPolicyRequest {
    /**
     * A policy configures behavior that you allow or disallow for your account. For information about MediaConvert policies, see the user guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
     */
    Policy: Policy;
  }
  export interface PutPolicyResponse {
    /**
     * A policy configures behavior that you allow or disallow for your account. For information about MediaConvert policies, see the user guide at http://docs.aws.amazon.com/mediaconvert/latest/ug/what-is.html
     */
    Policy?: Policy;
  }
  export interface Queue {
    /**
     * An identifier for this resource that is unique within all of AWS.
     */
    Arn?: __string;
    /**
     * The timestamp in epoch seconds for when you created the queue.
     */
    CreatedAt?: __timestampUnix;
    /**
     * An optional description that you create for each queue.
     */
    Description?: __string;
    /**
     * The timestamp in epoch seconds for when you most recently updated the queue.
     */
    LastUpdated?: __timestampUnix;
    /**
     * A name that you create for each queue. Each name must be unique within your account.
     */
    Name: __string;
    /**
     * Specifies whether the pricing plan for the queue is on-demand or reserved. For on-demand, you pay per minute, billed in increments of .01 minute. For reserved, you pay for the transcoding capacity of the entire queue, regardless of how much or how little you use it. Reserved pricing requires a 12-month commitment.
     */
    PricingPlan?: PricingPlan;
    /**
     * The estimated number of jobs with a PROGRESSING status.
     */
    ProgressingJobsCount?: __integer;
    /**
     * Details about the pricing plan for your reserved queue. Required for reserved queues and not applicable to on-demand queues.
     */
    ReservationPlan?: ReservationPlan;
    /**
     * Queues can be ACTIVE or PAUSED. If you pause a queue, the service won't begin processing jobs in that queue. Jobs that are running when you pause the queue continue to run until they finish or result in an error.
     */
    Status?: QueueStatus;
    /**
     * The estimated number of jobs with a SUBMITTED status.
     */
    SubmittedJobsCount?: __integer;
    /**
     * Specifies whether this on-demand queue is system or custom. System queues are built in. You can't modify or delete system queues. You can create and modify custom queues.
     */
    Type?: Type;
  }
  export type QueueListBy = "NAME"|"CREATION_DATE"|string;
  export type QueueStatus = "ACTIVE"|"PAUSED"|string;
  export interface QueueTransition {
    /**
     * The queue that the job was on after the transition.
     */
    DestinationQueue?: __string;
    /**
     * The queue that the job was on before the transition.
     */
    SourceQueue?: __string;
    /**
     * The time, in Unix epoch format, that the job moved from the source queue to the destination queue.
     */
    Timestamp?: __timestampUnix;
  }
  export interface Rectangle {
    /**
     * Height of rectangle in pixels. Specify only even numbers.
     */
    Height?: __integerMin2Max2147483647;
    /**
     * Width of rectangle in pixels. Specify only even numbers.
     */
    Width?: __integerMin2Max2147483647;
    /**
     * The distance, in pixels, between the rectangle and the left edge of the video frame. Specify only even numbers.
     */
    X?: __integerMin0Max2147483647;
    /**
     * The distance, in pixels, between the rectangle and the top edge of the video frame. Specify only even numbers.
     */
    Y?: __integerMin0Max2147483647;
  }
  export interface RemixSettings {
    /**
     * Channel mapping (ChannelMapping) contains the group of fields that hold the remixing value for each channel, in dB. Specify remix values to indicate how much of the content from your input audio channel you want in your output audio channels. Each instance of the InputChannels or InputChannelsFineTune array specifies these values for one output channel. Use one instance of this array for each output channel. In the console, each array corresponds to a column in the graphical depiction of the mapping matrix. The rows of the graphical matrix correspond to input channels. Valid values are within the range from -60 (mute) through 6. A setting of 0 passes the input channel unchanged to the output channel (no attenuation or amplification). Use InputChannels or InputChannelsFineTune to specify your remix values. Don't use both.
     */
    ChannelMapping?: ChannelMapping;
    /**
     * Specify the number of audio channels from your input that you want to use in your output. With remixing, you might combine or split the data in these channels, so the number of channels in your final output might be different. If you are doing both input channel mapping and output channel mapping, the number of output channels in your input mapping must be the same as the number of input channels in your output mapping.
     */
    ChannelsIn?: __integerMin1Max64;
    /**
     * Specify the number of channels in this output after remixing. Valid values: 1, 2, 4, 6, 8... 64. (1 and even numbers to 64.) If you are doing both input channel mapping and output channel mapping, the number of output channels in your input mapping must be the same as the number of input channels in your output mapping.
     */
    ChannelsOut?: __integerMin1Max64;
  }
  export type RenewalType = "AUTO_RENEW"|"EXPIRE"|string;
  export interface ReservationPlan {
    /**
     * The length of the term of your reserved queue pricing plan commitment.
     */
    Commitment?: Commitment;
    /**
     * The timestamp in epoch seconds for when the current pricing plan term for this reserved queue expires.
     */
    ExpiresAt?: __timestampUnix;
    /**
     * The timestamp in epoch seconds for when you set up the current pricing plan for this reserved queue.
     */
    PurchasedAt?: __timestampUnix;
    /**
     * Specifies whether the term of your reserved queue pricing plan is automatically extended (AUTO_RENEW) or expires (EXPIRE) at the end of the term.
     */
    RenewalType?: RenewalType;
    /**
     * Specifies the number of reserved transcode slots (RTS) for this queue. The number of RTS determines how many jobs the queue can process in parallel; each RTS can process one job at a time. When you increase this number, you extend your existing commitment with a new 12-month commitment for a larger number of RTS. The new commitment begins when you purchase the additional capacity. You can't decrease the number of RTS in your reserved queue.
     */
    ReservedSlots?: __integer;
    /**
     * Specifies whether the pricing plan for your reserved queue is ACTIVE or EXPIRED.
     */
    Status?: ReservationPlanStatus;
  }
  export interface ReservationPlanSettings {
    /**
     * The length of the term of your reserved queue pricing plan commitment.
     */
    Commitment: Commitment;
    /**
     * Specifies whether the term of your reserved queue pricing plan is automatically extended (AUTO_RENEW) or expires (EXPIRE) at the end of the term. When your term is auto renewed, you extend your commitment by 12 months from the auto renew date. You can cancel this commitment.
     */
    RenewalType: RenewalType;
    /**
     * Specifies the number of reserved transcode slots (RTS) for this queue. The number of RTS determines how many jobs the queue can process in parallel; each RTS can process one job at a time. You can't decrease the number of RTS in your reserved queue. You can increase the number of RTS by extending your existing commitment with a new 12-month commitment for the larger number. The new commitment begins when you purchase the additional capacity. You can't cancel your commitment or revert to your original commitment after you increase the capacity.
     */
    ReservedSlots: __integer;
  }
  export type ReservationPlanStatus = "ACTIVE"|"EXPIRED"|string;
  export interface ResourceTags {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: __string;
    /**
     * The tags for the resource.
     */
    Tags?: __mapOf__string;
  }
  export type RespondToAfd = "NONE"|"RESPOND"|"PASSTHROUGH"|string;
  export interface S3DestinationAccessControl {
    /**
     * Choose an Amazon S3 canned ACL for MediaConvert to apply to this output.
     */
    CannedAcl?: S3ObjectCannedAcl;
  }
  export interface S3DestinationSettings {
    /**
     * Optional. Have MediaConvert automatically apply Amazon S3 access control for the outputs in this output group. When you don't use this setting, S3 automatically applies the default access control list PRIVATE.
     */
    AccessControl?: S3DestinationAccessControl;
    /**
     * Settings for how your job outputs are encrypted as they are uploaded to Amazon S3.
     */
    Encryption?: S3EncryptionSettings;
  }
  export interface S3EncryptionSettings {
    /**
     * Specify how you want your data keys managed. AWS uses data keys to encrypt your content. AWS also encrypts the data keys themselves, using a customer master key (CMK), and then stores the encrypted data keys alongside your encrypted content. Use this setting to specify which AWS service manages the CMK. For simplest set up, choose Amazon S3 (SERVER_SIDE_ENCRYPTION_S3). If you want your master key to be managed by AWS Key Management Service (KMS), choose AWS KMS (SERVER_SIDE_ENCRYPTION_KMS). By default, when you choose AWS KMS, KMS uses the AWS managed customer master key (CMK) associated with Amazon S3 to encrypt your data keys. You can optionally choose to specify a different, customer managed CMK. Do so by specifying the Amazon Resource Name (ARN) of the key for the setting  KMS ARN (kmsKeyArn).
     */
    EncryptionType?: S3ServerSideEncryptionType;
    /**
     * Optionally, specify the encryption context that you want to use alongside your KMS key. AWS KMS uses this encryption context as additional authenticated data (AAD) to support authenticated encryption. This value must be a base64-encoded UTF-8 string holding JSON which represents a string-string map. To use this setting, you must also set Server-side encryption (S3ServerSideEncryptionType) to AWS KMS (SERVER_SIDE_ENCRYPTION_KMS). For more information about encryption context, see: https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#encrypt_context.
     */
    KmsEncryptionContext?: __stringPatternAZaZ0902;
    /**
     * Optionally, specify the customer master key (CMK) that you want to use to encrypt the data key that AWS uses to encrypt your output content. Enter the Amazon Resource Name (ARN) of the CMK. To use this setting, you must also set Server-side encryption (S3ServerSideEncryptionType) to AWS KMS (SERVER_SIDE_ENCRYPTION_KMS). If you set Server-side encryption to AWS KMS but don't specify a CMK here, AWS uses the AWS managed CMK associated with Amazon S3.
     */
    KmsKeyArn?: __stringPatternArnAwsUsGovCnKmsAZ26EastWestCentralNorthSouthEastWest1912D12KeyAFAF098AFAF094AFAF094AFAF094AFAF0912;
  }
  export type S3ObjectCannedAcl = "PUBLIC_READ"|"AUTHENTICATED_READ"|"BUCKET_OWNER_READ"|"BUCKET_OWNER_FULL_CONTROL"|string;
  export type S3ServerSideEncryptionType = "SERVER_SIDE_ENCRYPTION_S3"|"SERVER_SIDE_ENCRYPTION_KMS"|string;
  export type SampleRangeConversion = "LIMITED_RANGE_SQUEEZE"|"NONE"|string;
  export type ScalingBehavior = "DEFAULT"|"STRETCH_TO_OUTPUT"|string;
  export type SccDestinationFramerate = "FRAMERATE_23_97"|"FRAMERATE_24"|"FRAMERATE_25"|"FRAMERATE_29_97_DROPFRAME"|"FRAMERATE_29_97_NON_DROPFRAME"|string;
  export interface SccDestinationSettings {
    /**
     * Set Framerate (SccDestinationFramerate) to make sure that the captions and the video are synchronized in the output. Specify a frame rate that matches the frame rate of the associated video. If the video frame rate is 29.97, choose 29.97 dropframe (FRAMERATE_29_97_DROPFRAME) only if the video has video_insertion=true and drop_frame_timecode=true; otherwise, choose 29.97 non-dropframe (FRAMERATE_29_97_NON_DROPFRAME).
     */
    Framerate?: SccDestinationFramerate;
  }
  export type SimulateReservedQueue = "DISABLED"|"ENABLED"|string;
  export interface SpekeKeyProvider {
    /**
     * If you want your key provider to encrypt the content keys that it provides to MediaConvert, set up a certificate with a master key using AWS Certificate Manager. Specify the certificate's Amazon Resource Name (ARN) here.
     */
    CertificateArn?: __stringPatternArnAwsUsGovAcm;
    /**
     * Specify the resource ID that your SPEKE-compliant key provider uses to identify this content.
     */
    ResourceId?: __string;
    /**
     * Relates to SPEKE implementation. DRM system identifiers. DASH output groups support a max of two system ids. Other group types support one system id. See
 https://dashif.org/identifiers/content_protection/ for more details.
     */
    SystemIds?: __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12;
    /**
     * Specify the URL to the key server that your SPEKE-compliant DRM key provider uses to provide keys for encrypting your content.
     */
    Url?: __stringPatternHttps;
  }
  export interface SpekeKeyProviderCmaf {
    /**
     * If you want your key provider to encrypt the content keys that it provides to MediaConvert, set up a certificate with a master key using AWS Certificate Manager. Specify the certificate's Amazon Resource Name (ARN) here.
     */
    CertificateArn?: __stringPatternArnAwsUsGovAcm;
    /**
     * Specify the DRM system IDs that you want signaled in the DASH manifest that MediaConvert creates as part of this CMAF package. The DASH manifest can currently signal up to three system IDs. For more information, see https://dashif.org/identifiers/content_protection/.
     */
    DashSignaledSystemIds?: __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12;
    /**
     * Specify the DRM system ID that you want signaled in the HLS manifest that MediaConvert creates as part of this CMAF package. The HLS manifest can currently signal only one system ID. For more information, see https://dashif.org/identifiers/content_protection/.
     */
    HlsSignaledSystemIds?: __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12;
    /**
     * Specify the resource ID that your SPEKE-compliant key provider uses to identify this content.
     */
    ResourceId?: __stringPatternW;
    /**
     * Specify the URL to the key server that your SPEKE-compliant DRM key provider uses to provide keys for encrypting your content.
     */
    Url?: __stringPatternHttps;
  }
  export interface SrtDestinationSettings {
    /**
     * Set Style passthrough (StylePassthrough) to ENABLED to use the available style, color, and position information from your input captions. MediaConvert uses default settings for any missing style and position information in your input captions. Set Style passthrough to DISABLED, or leave blank, to ignore the style and position information from your input captions and use simplified output captions.
     */
    StylePassthrough?: SrtStylePassthrough;
  }
  export type SrtStylePassthrough = "ENABLED"|"DISABLED"|string;
  export interface StaticKeyProvider {
    /**
     * Relates to DRM implementation. Sets the value of the KEYFORMAT attribute. Must be 'identity' or a reverse DNS string. May be omitted to indicate an implicit value of 'identity'.
     */
    KeyFormat?: __stringPatternIdentityAZaZ26AZaZ09163;
    /**
     * Relates to DRM implementation. Either a single positive integer version value or a slash delimited list of version values (1/2/3).
     */
    KeyFormatVersions?: __stringPatternDD;
    /**
     * Relates to DRM implementation. Use a 32-character hexidecimal string to specify Key Value (StaticKeyValue).
     */
    StaticKeyValue?: __stringPatternAZaZ0932;
    /**
     * Relates to DRM implementation. The location of the license server used for protecting content.
     */
    Url?: __string;
  }
  export type StatusUpdateInterval = "SECONDS_10"|"SECONDS_12"|"SECONDS_15"|"SECONDS_20"|"SECONDS_30"|"SECONDS_60"|"SECONDS_120"|"SECONDS_180"|"SECONDS_240"|"SECONDS_300"|"SECONDS_360"|"SECONDS_420"|"SECONDS_480"|"SECONDS_540"|"SECONDS_600"|string;
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to tag. To get the ARN, send a GET request with the resource name.
     */
    Arn: __string;
    /**
     * The tags that you want to add to the resource. You can tag resources with a key-value pair or with only a key.
     */
    Tags: __mapOf__string;
  }
  export interface TagResourceResponse {
  }
  export interface TeletextDestinationSettings {
    /**
     * Set pageNumber to the Teletext page number for the destination captions for this output. This value must be a three-digit hexadecimal string; strings ending in -FF are invalid. If you are passing through the entire set of Teletext data, do not use this field.
     */
    PageNumber?: __stringMin3Max3Pattern1809aFAF09aEAE;
    /**
     * Specify the page types for this Teletext page. If you don't specify a value here, the service sets the page type to the default value Subtitle (PAGE_TYPE_SUBTITLE). If you pass through the entire set of Teletext data, don't use this field. When you pass through a set of Teletext pages, your output has the same page types as your input.
     */
    PageTypes?: __listOfTeletextPageType;
  }
  export type TeletextPageType = "PAGE_TYPE_INITIAL"|"PAGE_TYPE_SUBTITLE"|"PAGE_TYPE_ADDL_INFO"|"PAGE_TYPE_PROGRAM_SCHEDULE"|"PAGE_TYPE_HEARING_IMPAIRED_SUBTITLE"|string;
  export interface TeletextSourceSettings {
    /**
     * Use Page Number (PageNumber) to specify the three-digit hexadecimal page number that will be used for Teletext captions. Do not use this setting if you are passing through teletext from the input source to output.
     */
    PageNumber?: __stringMin3Max3Pattern1809aFAF09aEAE;
  }
  export interface TimecodeBurnin {
    /**
     * Use Font Size (FontSize) to set the font size of any burned-in timecode. Valid values are 10, 16, 32, 48.
     */
    FontSize?: __integerMin10Max48;
    /**
     * Use Position (Position) under under Timecode burn-in (TimecodeBurnIn) to specify the location the burned-in timecode on output video.
     */
    Position?: TimecodeBurninPosition;
    /**
     * Use Prefix (Prefix) to place ASCII characters before any burned-in timecode. For example, a prefix of "EZ-" will result in the timecode "EZ-00:00:00:00". Provide either the characters themselves or the ASCII code equivalents. The supported range of characters is 0x20 through 0x7e. This includes letters, numbers, and all special characters represented on a standard English keyboard.
     */
    Prefix?: __stringPattern;
  }
  export type TimecodeBurninPosition = "TOP_CENTER"|"TOP_LEFT"|"TOP_RIGHT"|"MIDDLE_LEFT"|"MIDDLE_CENTER"|"MIDDLE_RIGHT"|"BOTTOM_LEFT"|"BOTTOM_CENTER"|"BOTTOM_RIGHT"|string;
  export interface TimecodeConfig {
    /**
     * If you use an editing platform that relies on an anchor timecode, use Anchor Timecode (Anchor) to specify a timecode that will match the input video frame to the output video frame. Use 24-hour format with frame number, (HH:MM:SS:FF) or (HH:MM:SS;FF). This setting ignores frame rate conversion. System behavior for Anchor Timecode varies depending on your setting for Source (TimecodeSource). * If Source (TimecodeSource) is set to Specified Start (SPECIFIEDSTART), the first input frame is the specified value in Start Timecode (Start). Anchor Timecode (Anchor) and Start Timecode (Start) are used calculate output timecode. * If Source (TimecodeSource) is set to Start at 0 (ZEROBASED)  the  first frame is 00:00:00:00. * If Source (TimecodeSource) is set to Embedded (EMBEDDED), the  first frame is the timecode value on the first input frame of the input.
     */
    Anchor?: __stringPattern010920405090509092;
    /**
     * Use Source (TimecodeSource) to set how timecodes are handled within this job. To make sure that your video, audio, captions, and markers are synchronized and that time-based features, such as image inserter, work correctly, choose the Timecode source option that matches your assets. All timecodes are in a 24-hour format with frame number (HH:MM:SS:FF). * Embedded (EMBEDDED) - Use the timecode that is in the input video. If no embedded timecode is in the source, the service will use Start at 0 (ZEROBASED) instead. * Start at 0 (ZEROBASED) - Set the timecode of the initial frame to 00:00:00:00. * Specified Start (SPECIFIEDSTART) - Set the timecode of the initial frame to a value other than zero. You use Start timecode (Start) to provide this value.
     */
    Source?: TimecodeSource;
    /**
     * Only use when you set Source (TimecodeSource) to Specified start (SPECIFIEDSTART). Use Start timecode (Start) to specify the timecode for the initial frame. Use 24-hour format with frame number, (HH:MM:SS:FF) or (HH:MM:SS;FF).
     */
    Start?: __stringPattern010920405090509092;
    /**
     * Only applies to outputs that support program-date-time stamp. Use Timestamp offset (TimestampOffset) to overwrite the timecode date without affecting the time and frame number. Provide the new date as a string in the format "yyyy-mm-dd".  To use Time stamp offset, you must also enable Insert program-date-time (InsertProgramDateTime) in the output settings. For example, if the date part of your timecodes is 2002-1-25 and you want to change it to one year later, set Timestamp offset (TimestampOffset) to 2003-1-25.
     */
    TimestampOffset?: __stringPattern0940191020191209301;
  }
  export type TimecodeSource = "EMBEDDED"|"ZEROBASED"|"SPECIFIEDSTART"|string;
  export type TimedMetadata = "PASSTHROUGH"|"NONE"|string;
  export interface TimedMetadataInsertion {
    /**
     * Id3Insertions contains the array of Id3Insertion instances.
     */
    Id3Insertions?: __listOfId3Insertion;
  }
  export interface Timing {
    /**
     * The time, in Unix epoch format, that the transcoding job finished
     */
    FinishTime?: __timestampUnix;
    /**
     * The time, in Unix epoch format, that transcoding for the job began.
     */
    StartTime?: __timestampUnix;
    /**
     * The time, in Unix epoch format, that you submitted the job.
     */
    SubmitTime?: __timestampUnix;
  }
  export interface TrackSourceSettings {
    /**
     * Use this setting to select a single captions track from a source. Track numbers correspond to the order in the captions source file. For IMF sources, track numbering is based on the order that the captions appear in the CPL. For example, use 1 to select the captions asset that is listed first in the CPL. To include more than one captions track in your job outputs, create multiple input captions selectors. Specify one track per selector.
     */
    TrackNumber?: __integerMin1Max2147483647;
  }
  export interface TtmlDestinationSettings {
    /**
     * Pass through style and position information from a TTML-like input source (TTML, IMSC, SMPTE-TT) to the TTML output.
     */
    StylePassthrough?: TtmlStylePassthrough;
  }
  export type TtmlStylePassthrough = "ENABLED"|"DISABLED"|string;
  export type Type = "SYSTEM"|"CUSTOM"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to remove tags from. To get the ARN, send a GET request with the resource name.
     */
    Arn: __string;
    /**
     * The keys of the tags that you want to remove from the resource.
     */
    TagKeys?: __listOf__string;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateJobTemplateRequest {
    /**
     * Accelerated transcoding can significantly speed up jobs with long, visually complex content. Outputs that use this feature incur pro-tier pricing. For information about feature limitations, see the AWS Elemental MediaConvert User Guide.
     */
    AccelerationSettings?: AccelerationSettings;
    /**
     * The new category for the job template, if you are changing it.
     */
    Category?: __string;
    /**
     * The new description for the job template, if you are changing it.
     */
    Description?: __string;
    /**
     * Optional list of hop destinations.
     */
    HopDestinations?: __listOfHopDestination;
    /**
     * The name of the job template you are modifying
     */
    Name: __string;
    /**
     * Specify the relative priority for this job. In any given queue, the service begins processing the job with the highest value first. When more than one job has the same priority, the service begins processing the job that you submitted first. If you don't specify a priority, the service uses the default value 0.
     */
    Priority?: __integerMinNegative50Max50;
    /**
     * The new queue for the job template, if you are changing it.
     */
    Queue?: __string;
    /**
     * JobTemplateSettings contains all the transcode settings saved in the template that will be applied to jobs created from it.
     */
    Settings?: JobTemplateSettings;
    /**
     * Specify how often MediaConvert sends STATUS_UPDATE events to Amazon CloudWatch Events. Set the interval, in seconds, between status updates. MediaConvert sends an update at this interval from the time the service begins processing your job to the time it completes the transcode or encounters an error.
     */
    StatusUpdateInterval?: StatusUpdateInterval;
  }
  export interface UpdateJobTemplateResponse {
    /**
     * A job template is a pre-made set of encoding instructions that you can use to quickly create a job.
     */
    JobTemplate?: JobTemplate;
  }
  export interface UpdatePresetRequest {
    /**
     * The new category for the preset, if you are changing it.
     */
    Category?: __string;
    /**
     * The new description for the preset, if you are changing it.
     */
    Description?: __string;
    /**
     * The name of the preset you are modifying.
     */
    Name: __string;
    /**
     * Settings for preset
     */
    Settings?: PresetSettings;
  }
  export interface UpdatePresetResponse {
    /**
     * A preset is a collection of preconfigured media conversion settings that you want MediaConvert to apply to the output during the conversion process.
     */
    Preset?: Preset;
  }
  export interface UpdateQueueRequest {
    /**
     * The new description for the queue, if you are changing it.
     */
    Description?: __string;
    /**
     * The name of the queue that you are modifying.
     */
    Name: __string;
    /**
     * The new details of your pricing plan for your reserved queue. When you set up a new pricing plan to replace an expired one, you enter into another 12-month commitment. When you add capacity to your queue by increasing the number of RTS, you extend the term of your commitment to 12 months from when you add capacity. After you make these commitments, you can't cancel them.
     */
    ReservationPlanSettings?: ReservationPlanSettings;
    /**
     * Pause or activate a queue by changing its status between ACTIVE and PAUSED. If you pause a queue, jobs in that queue won't begin. Jobs that are running when you pause the queue continue to run until they finish or result in an error.
     */
    Status?: QueueStatus;
  }
  export interface UpdateQueueResponse {
    /**
     * You can use queues to manage the resources that are available to your AWS account for running multiple transcoding jobs at the same time. If you don't specify a queue, the service sends all jobs through the default queue. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-queues.html.
     */
    Queue?: Queue;
  }
  export type Vc3Class = "CLASS_145_8BIT"|"CLASS_220_8BIT"|"CLASS_220_10BIT"|string;
  export type Vc3FramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type Vc3FramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type Vc3InterlaceMode = "INTERLACED"|"PROGRESSIVE"|string;
  export type Vc3ScanTypeConversionMode = "INTERLACED"|"INTERLACED_OPTIMIZE"|string;
  export interface Vc3Settings {
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: Vc3FramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: Vc3FramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max1001;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin24Max60000;
    /**
     * Optional. Choose the scan line type for this output. If you don't specify a value, MediaConvert will create a progressive output.
     */
    InterlaceMode?: Vc3InterlaceMode;
    /**
     * Use this setting for interlaced outputs, when your output frame rate is half of your input frame rate. In this situation, choose Optimized interlacing (INTERLACED_OPTIMIZE) to create a better quality interlaced output. In this case, each progressive frame from the input corresponds to an interlaced field in the output. Keep the default value, Basic interlacing (INTERLACED), for all other output frame rates. With basic interlacing, MediaConvert performs any frame rate conversion first and then interlaces the frames. When you choose Optimized interlacing and you set your output frame rate to a value that isn't suitable for optimized interlacing, MediaConvert automatically falls back to basic interlacing. Required settings: To use optimized interlacing, you must set Telecine (telecine) to None (NONE) or Soft (SOFT). You can't use optimized interlacing for hard telecine outputs. You must also set Interlace mode (interlaceMode) to a value other than Progressive (PROGRESSIVE).
     */
    ScanTypeConversionMode?: Vc3ScanTypeConversionMode;
    /**
     * Ignore this setting unless your input frame rate is 23.976 or 24 frames per second (fps). Enable slow PAL to create a 25 fps output by relabeling the video frames and resampling your audio. Note that enabling this setting will slightly reduce the duration of your video. Related settings: You must also set Framerate to 25. In your JSON job specification, set (framerateControl) to (SPECIFIED), (framerateNumerator) to 25 and (framerateDenominator) to 1.
     */
    SlowPal?: Vc3SlowPal;
    /**
     * When you do frame rate conversion from 23.976 frames per second (fps) to 29.97 fps, and your output scan type is interlaced, you can optionally enable hard telecine (HARD) to create a smoother picture. When you keep the default value, None (NONE), MediaConvert does a standard frame rate conversion to 29.97 without doing anything with the field polarity to create a smoother picture.
     */
    Telecine?: Vc3Telecine;
    /**
     * Specify the VC3 class to choose the quality characteristics for this output. VC3 class, together with the settings Framerate (framerateNumerator and framerateDenominator) and Resolution (height and width), determine your output bitrate. For example, say that your video resolution is 1920x1080 and your framerate is 29.97. Then Class 145 (CLASS_145) gives you an output with a bitrate of approximately 145 Mbps and Class 220 (CLASS_220) gives you and output with a bitrate of approximately 220 Mbps. VC3 class also specifies the color bit depth of your output.
     */
    Vc3Class?: Vc3Class;
  }
  export type Vc3SlowPal = "DISABLED"|"ENABLED"|string;
  export type Vc3Telecine = "NONE"|"HARD"|string;
  export type VchipAction = "PASSTHROUGH"|"STRIP"|string;
  export type VideoCodec = "AV1"|"AVC_INTRA"|"FRAME_CAPTURE"|"H_264"|"H_265"|"MPEG2"|"PRORES"|"VC3"|"VP8"|"VP9"|"XAVC"|string;
  export interface VideoCodecSettings {
    /**
     * Required when you set Codec, under VideoDescription>CodecSettings to the value AV1.
     */
    Av1Settings?: Av1Settings;
    /**
     * Required when you choose AVC-Intra for your output video codec. For more information about the AVC-Intra settings, see the relevant specification. For detailed information about SD and HD in AVC-Intra, see https://ieeexplore.ieee.org/document/7290936. For information about 4K/2K in AVC-Intra, see https://pro-av.panasonic.net/en/avc-ultra/AVC-ULTRAoverview.pdf.
     */
    AvcIntraSettings?: AvcIntraSettings;
    /**
     * Specifies the video codec. This must be equal to one of the enum values defined by the object  VideoCodec.
     */
    Codec?: VideoCodec;
    /**
     * Required when you set (Codec) under (VideoDescription)>(CodecSettings) to the value FRAME_CAPTURE.
     */
    FrameCaptureSettings?: FrameCaptureSettings;
    /**
     * Required when you set (Codec) under (VideoDescription)>(CodecSettings) to the value H_264.
     */
    H264Settings?: H264Settings;
    /**
     * Settings for H265 codec
     */
    H265Settings?: H265Settings;
    /**
     * Required when you set (Codec) under (VideoDescription)>(CodecSettings) to the value MPEG2.
     */
    Mpeg2Settings?: Mpeg2Settings;
    /**
     * Required when you set (Codec) under (VideoDescription)>(CodecSettings) to the value PRORES.
     */
    ProresSettings?: ProresSettings;
    /**
     * Required when you set (Codec) under (VideoDescription)>(CodecSettings) to the value VC3
     */
    Vc3Settings?: Vc3Settings;
    /**
     * Required when you set (Codec) under (VideoDescription)>(CodecSettings) to the value VP8.
     */
    Vp8Settings?: Vp8Settings;
    /**
     * Required when you set (Codec) under (VideoDescription)>(CodecSettings) to the value VP9.
     */
    Vp9Settings?: Vp9Settings;
    /**
     * Required when you set (Codec) under (VideoDescription)>(CodecSettings) to the value XAVC.
     */
    XavcSettings?: XavcSettings;
  }
  export interface VideoDescription {
    /**
     * This setting only applies to H.264, H.265, and MPEG2 outputs. Use Insert AFD signaling (AfdSignaling) to specify whether the service includes AFD values in the output video data and what those values are. * Choose None to remove all AFD values from this output. * Choose Fixed to ignore input AFD values and instead encode the value specified in the job. * Choose Auto to calculate output AFD values based on the input AFD scaler data.
     */
    AfdSignaling?: AfdSignaling;
    /**
     * The anti-alias filter is automatically applied to all outputs. The service no longer accepts the value DISABLED for AntiAlias. If you specify that in your job, the service will ignore the setting.
     */
    AntiAlias?: AntiAlias;
    /**
     * Video codec settings, (CodecSettings) under (VideoDescription), contains the group of settings related to video encoding. The settings in this group vary depending on the value that you choose for Video codec (Codec). For each codec enum that you choose, define the corresponding settings object. The following lists the codec enum, settings object pairs. * AV1, Av1Settings * AVC_INTRA, AvcIntraSettings * FRAME_CAPTURE, FrameCaptureSettings * H_264, H264Settings * H_265, H265Settings * MPEG2, Mpeg2Settings * PRORES, ProresSettings * VC3, Vc3Settings * VP8, Vp8Settings * VP9, Vp9Settings * XAVC, XavcSettings
     */
    CodecSettings?: VideoCodecSettings;
    /**
     * Choose Insert (INSERT) for this setting to include color metadata in this output. Choose Ignore (IGNORE) to exclude color metadata from this output. If you don't specify a value, the service sets this to Insert by default.
     */
    ColorMetadata?: ColorMetadata;
    /**
     * Use Cropping selection (crop) to specify the video area that the service will include in the output video frame.
     */
    Crop?: Rectangle;
    /**
     * Applies only to 29.97 fps outputs. When this feature is enabled, the service will use drop-frame timecode on outputs. If it is not possible to use drop-frame timecode, the system will fall back to non-drop-frame. This setting is enabled by default when Timecode insertion (TimecodeInsertion) is enabled.
     */
    DropFrameTimecode?: DropFrameTimecode;
    /**
     * Applies only if you set AFD Signaling(AfdSignaling) to Fixed (FIXED). Use Fixed (FixedAfd) to specify a four-bit AFD value which the service will write on all  frames of this video output.
     */
    FixedAfd?: __integerMin0Max15;
    /**
     * Use the Height (Height) setting to define the video resolution height for this output. Specify in pixels. If you don't provide a value here, the service will use the input height.
     */
    Height?: __integerMin32Max8192;
    /**
     * Use Selection placement (position) to define the video area in your output frame. The area outside of the rectangle that you specify here is black.
     */
    Position?: Rectangle;
    /**
     * Use Respond to AFD (RespondToAfd) to specify how the service changes the video itself in response to AFD values in the input. * Choose Respond to clip the input video frame according to the AFD value, input display aspect ratio, and output display aspect ratio. * Choose Passthrough to include the input AFD values. Do not choose this when AfdSignaling is set to (NONE). A preferred implementation of this workflow is to set RespondToAfd to (NONE) and set AfdSignaling to (AUTO). * Choose None to remove all input AFD values from this output.
     */
    RespondToAfd?: RespondToAfd;
    /**
     * Specify how the service handles outputs that have a different aspect ratio from the input aspect ratio. Choose Stretch to output (STRETCH_TO_OUTPUT) to have the service stretch your video image to fit. Keep the setting Default (DEFAULT) to have the service letterbox your video instead. This setting overrides any value that you specify for the setting Selection placement (position) in this output.
     */
    ScalingBehavior?: ScalingBehavior;
    /**
     * Use Sharpness (Sharpness) setting to specify the strength of anti-aliasing. This setting changes the width of the anti-alias filter kernel used for scaling. Sharpness only applies if your output resolution is different from your input resolution. 0 is the softest setting, 100 the sharpest, and 50 recommended for most content.
     */
    Sharpness?: __integerMin0Max100;
    /**
     * Applies only to H.264, H.265, MPEG2, and ProRes outputs. Only enable Timecode insertion when the input frame rate is identical to the output frame rate. To include timecodes in this output, set Timecode insertion (VideoTimecodeInsertion) to PIC_TIMING_SEI. To leave them out, set it to DISABLED. Default is DISABLED. When the service inserts timecodes in an output, by default, it uses any embedded timecodes from the input. If none are present, the service will set the timecode for the first output frame to zero. To change this default behavior, adjust the settings under Timecode configuration (TimecodeConfig). In the console, these settings are located under Job > Job settings > Timecode configuration. Note - Timecode source under input settings (InputTimecodeSource) does not affect the timecodes that are inserted in the output. Source under Job settings > Timecode configuration (TimecodeSource) does.
     */
    TimecodeInsertion?: VideoTimecodeInsertion;
    /**
     * Find additional transcoding features under Preprocessors (VideoPreprocessors). Enable the features at each output individually. These features are disabled by default.
     */
    VideoPreprocessors?: VideoPreprocessor;
    /**
     * Use Width (Width) to define the video resolution width, in pixels, for this output. If you don't provide a value here, the service will use the input width.
     */
    Width?: __integerMin32Max8192;
  }
  export interface VideoDetail {
    /**
     * Height in pixels for the output
     */
    HeightInPx?: __integer;
    /**
     * Width in pixels for the output
     */
    WidthInPx?: __integer;
  }
  export interface VideoPreprocessor {
    /**
     * Use these settings to convert the color space or to modify properties such as hue and contrast for this output. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/converting-the-color-space.html.
     */
    ColorCorrector?: ColorCorrector;
    /**
     * Use the deinterlacer to produce smoother motion and a clearer picture. For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-scan-type.html.
     */
    Deinterlacer?: Deinterlacer;
    /**
     * Enable Dolby Vision feature to produce Dolby Vision compatible video output.
     */
    DolbyVision?: DolbyVision;
    /**
     * Enable HDR10+ analyis and metadata injection. Compatible with HEVC only.
     */
    Hdr10Plus?: Hdr10Plus;
    /**
     * Enable the Image inserter (ImageInserter) feature to include a graphic overlay on your video. Enable or disable this feature for each output individually. This setting is disabled by default.
     */
    ImageInserter?: ImageInserter;
    /**
     * Enable the Noise reducer (NoiseReducer) feature to remove noise from your video output if necessary. Enable or disable this feature for each output individually. This setting is disabled by default.
     */
    NoiseReducer?: NoiseReducer;
    /**
     * If you work with a third party video watermarking partner, use the group of settings that correspond with your watermarking partner to include watermarks in your output.
     */
    PartnerWatermarking?: PartnerWatermarking;
    /**
     * Settings for burning the output timecode and specified prefix into the output.
     */
    TimecodeBurnin?: TimecodeBurnin;
  }
  export interface VideoSelector {
    /**
     * Ignore this setting unless this input is a QuickTime animation with an alpha channel. Use this setting to create separate Key and Fill outputs. In each output, specify which part of the input MediaConvert uses. Leave this setting at the default value DISCARD to delete the alpha channel and preserve the video. Set it to REMAP_TO_LUMA to delete the video and map the alpha channel to the luma channel of your outputs.
     */
    AlphaBehavior?: AlphaBehavior;
    /**
     * If your input video has accurate color space metadata, or if you don't know about color space, leave this set to the default value Follow (FOLLOW). The service will automatically detect your input color space. If your input video has metadata indicating the wrong color space, specify the accurate color space here. If your input video is HDR 10 and the SMPTE ST 2086 Mastering Display Color Volume static metadata isn't present in your video stream, or if that metadata is present but not accurate, choose Force HDR 10 (FORCE_HDR10) here and specify correct values in the input HDR 10 metadata (Hdr10Metadata) settings. For more information about MediaConvert HDR jobs, see https://docs.aws.amazon.com/console/mediaconvert/hdr.
     */
    ColorSpace?: ColorSpace;
    /**
     * There are two sources for color metadata, the input file and the job input settings Color space (ColorSpace) and HDR master display information settings(Hdr10Metadata). The Color space usage setting determines which takes precedence. Choose Force (FORCE) to use color metadata from the input job settings. If you don't specify values for those settings, the service defaults to using metadata from your input. FALLBACK - Choose Fallback (FALLBACK) to use color metadata from the source when it is present. If there's no color metadata in your input file, the service defaults to using values you specify in the input settings.
     */
    ColorSpaceUsage?: ColorSpaceUsage;
    /**
     * Use these settings to provide HDR 10 metadata that is missing or inaccurate in your input video. Appropriate values vary depending on the input video and must be provided by a color grader. The color grader generates these values during the HDR 10 mastering process. The valid range for each of these settings is 0 to 50,000. Each increment represents 0.00002 in CIE1931 color coordinate. Related settings - When you specify these values, you must also set Color space (ColorSpace) to HDR 10 (HDR10). To specify whether the the values you specify here take precedence over the values in the metadata of your input file, set Color space usage (ColorSpaceUsage). To specify whether color metadata is included in an output, set Color metadata (ColorMetadata). For more information about MediaConvert HDR jobs, see https://docs.aws.amazon.com/console/mediaconvert/hdr.
     */
    Hdr10Metadata?: Hdr10Metadata;
    /**
     * Use PID (Pid) to select specific video data from an input file. Specify this value as an integer; the system automatically converts it to the hexidecimal value. For example, 257 selects PID 0x101. A PID, or packet identifier, is an identifier for a set of data in an MPEG-2 transport stream container.
     */
    Pid?: __integerMin1Max2147483647;
    /**
     * Selects a specific program from within a multi-program transport stream. Note that Quad 4K is not currently supported.
     */
    ProgramNumber?: __integerMinNegative2147483648Max2147483647;
    /**
     * Use Rotate (InputRotate) to specify how the service rotates your video. You can choose automatic rotation or specify a rotation. You can specify a clockwise rotation of 0, 90, 180, or 270 degrees. If your input video container is .mov or .mp4 and your input has rotation metadata, you can choose Automatic to have the service rotate your video according to the rotation specified in the metadata. The rotation must be within one degree of 90, 180, or 270 degrees. If the rotation metadata specifies any other rotation, the service will default to no rotation. By default, the service does no rotation, even if your input video has rotation metadata. The service doesn't pass through rotation metadata.
     */
    Rotate?: InputRotate;
    /**
     * If the sample range metadata in your input video is accurate, or if you don't know about sample range, keep the default value, Follow (FOLLOW), for this setting. When you do, the service automatically detects your input sample range. If your input video has metadata indicating the wrong sample range, specify the accurate sample range here. When you do, MediaConvert ignores any sample range information in the input metadata. Regardless of whether MediaConvert uses the input sample range or the sample range that you specify, MediaConvert uses the sample range for transcoding and also writes it to the output metadata.
     */
    SampleRange?: InputSampleRange;
  }
  export type VideoTimecodeInsertion = "DISABLED"|"PIC_TIMING_SEI"|string;
  export interface VorbisSettings {
    /**
     * Optional. Specify the number of channels in this output audio track. Choosing Mono on the console gives you 1 output channel; choosing Stereo gives you 2. In the API, valid values are 1 and 2. The default value is 2.
     */
    Channels?: __integerMin1Max2;
    /**
     * Optional. Specify the audio sample rate in Hz. Valid values are 22050, 32000, 44100, and 48000. The default value is 48000.
     */
    SampleRate?: __integerMin22050Max48000;
    /**
     * Optional. Specify the variable audio quality of this Vorbis output from -1 (lowest quality, ~45 kbit/s) to 10 (highest quality, ~500 kbit/s). The default value is 4 (~128 kbit/s). Values 5 and 6 are approximately 160 and 192 kbit/s, respectively.
     */
    VbrQuality?: __integerMinNegative1Max10;
  }
  export type Vp8FramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type Vp8FramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type Vp8ParControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type Vp8QualityTuningLevel = "MULTI_PASS"|"MULTI_PASS_HQ"|string;
  export type Vp8RateControlMode = "VBR"|string;
  export interface Vp8Settings {
    /**
     * Target bitrate in bits/second. For example, enter five megabits per second as 5000000.
     */
    Bitrate?: __integerMin1000Max1152000000;
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: Vp8FramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: Vp8FramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max2147483647;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin1Max2147483647;
    /**
     * GOP Length (keyframe interval) in frames. Must be greater than zero.
     */
    GopSize?: __doubleMin0;
    /**
     * Optional. Size of buffer (HRD buffer model) in bits. For example, enter five megabits as 5000000.
     */
    HrdBufferSize?: __integerMin0Max47185920;
    /**
     * Ignore this setting unless you set qualityTuningLevel to MULTI_PASS. Optional. Specify the maximum bitrate in bits/second. For example, enter five megabits per second as 5000000. The default behavior uses twice the target bitrate as the maximum bitrate.
     */
    MaxBitrate?: __integerMin1000Max1152000000;
    /**
     * Optional. Specify how the service determines the pixel aspect ratio (PAR) for this output. The default behavior, Follow source (INITIALIZE_FROM_SOURCE), uses the PAR from your input video for your output. To specify a different PAR in the console, choose any value other than Follow source. To specify a different PAR by editing the JSON job specification, choose SPECIFIED. When you choose SPECIFIED for this setting, you must also specify values for the parNumerator and parDenominator settings.
     */
    ParControl?: Vp8ParControl;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parDenominator is 33.
     */
    ParDenominator?: __integerMin1Max2147483647;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parNumerator is 40.
     */
    ParNumerator?: __integerMin1Max2147483647;
    /**
     * Optional. Use Quality tuning level (qualityTuningLevel) to choose how you want to trade off encoding speed for output video quality. The default behavior is faster, lower quality, multi-pass encoding.
     */
    QualityTuningLevel?: Vp8QualityTuningLevel;
    /**
     * With the VP8 codec, you can use only the variable bitrate (VBR) rate control mode.
     */
    RateControlMode?: Vp8RateControlMode;
  }
  export type Vp9FramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type Vp9FramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type Vp9ParControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type Vp9QualityTuningLevel = "MULTI_PASS"|"MULTI_PASS_HQ"|string;
  export type Vp9RateControlMode = "VBR"|string;
  export interface Vp9Settings {
    /**
     * Target bitrate in bits/second. For example, enter five megabits per second as 5000000.
     */
    Bitrate?: __integerMin1000Max480000000;
    /**
     * If you are using the console, use the Framerate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list or choose Custom. The framerates shown in the dropdown list are decimal approximations of fractions. If you choose Custom, specify your frame rate as a fraction. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: Vp9FramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: Vp9FramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max2147483647;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example,  24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin1Max2147483647;
    /**
     * GOP Length (keyframe interval) in frames. Must be greater than zero.
     */
    GopSize?: __doubleMin0;
    /**
     * Size of buffer (HRD buffer model) in bits. For example, enter five megabits as 5000000.
     */
    HrdBufferSize?: __integerMin0Max47185920;
    /**
     * Ignore this setting unless you set qualityTuningLevel to MULTI_PASS. Optional. Specify the maximum bitrate in bits/second. For example, enter five megabits per second as 5000000. The default behavior uses twice the target bitrate as the maximum bitrate.
     */
    MaxBitrate?: __integerMin1000Max480000000;
    /**
     * Optional. Specify how the service determines the pixel aspect ratio for this output. The default behavior is to use the same pixel aspect ratio as your input video.
     */
    ParControl?: Vp9ParControl;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parDenominator is 33.
     */
    ParDenominator?: __integerMin1Max2147483647;
    /**
     * Required when you set Pixel aspect ratio (parControl) to SPECIFIED. On the console, this corresponds to any value other than Follow source. When you specify an output pixel aspect ratio (PAR) that is different from your input video PAR, provide your output PAR as a ratio. For example, for D1/DV NTSC widescreen, you would specify the ratio 40:33. In this example, the value for parNumerator is 40.
     */
    ParNumerator?: __integerMin1Max2147483647;
    /**
     * Optional. Use Quality tuning level (qualityTuningLevel) to choose how you want to trade off encoding speed for output video quality. The default behavior is faster, lower quality, multi-pass encoding.
     */
    QualityTuningLevel?: Vp9QualityTuningLevel;
    /**
     * With the VP9 codec, you can use only the variable bitrate (VBR) rate control mode.
     */
    RateControlMode?: Vp9RateControlMode;
  }
  export type WatermarkingStrength = "LIGHTEST"|"LIGHTER"|"DEFAULT"|"STRONGER"|"STRONGEST"|string;
  export type WavFormat = "RIFF"|"RF64"|string;
  export interface WavSettings {
    /**
     * Specify Bit depth (BitDepth), in bits per sample, to choose the encoding quality for this audio track.
     */
    BitDepth?: __integerMin16Max24;
    /**
     * Specify the number of channels in this output audio track. Valid values are 1 and even numbers up to 64. For example, 1, 2, 4, 6, and so on, up to 64.
     */
    Channels?: __integerMin1Max64;
    /**
     * The service defaults to using RIFF for WAV outputs. If your output audio is likely to exceed 4 GB in file size, or if you otherwise need the extended support of the RF64 format, set your output WAV file format to RF64.
     */
    Format?: WavFormat;
    /**
     * Sample rate in Hz.
     */
    SampleRate?: __integerMin8000Max192000;
  }
  export interface WebvttDestinationSettings {
    /**
     * Set Style passthrough (StylePassthrough) to ENABLED to use the available style, color, and position information from your input captions. MediaConvert uses default settings for any missing style and position information in your input captions. Set Style passthrough to DISABLED, or leave blank, to ignore the style and position information from your input captions and use simplified output captions.
     */
    StylePassthrough?: WebvttStylePassthrough;
  }
  export interface WebvttHlsSourceSettings {
    /**
     * Optional. Specify alternative group ID
     */
    RenditionGroupId?: __string;
    /**
     * Optional. Specify ISO 639-2 or ISO 639-3 code in the language property
     */
    RenditionLanguageCode?: LanguageCode;
    /**
     * Optional. Specify media name
     */
    RenditionName?: __string;
  }
  export type WebvttStylePassthrough = "ENABLED"|"DISABLED"|string;
  export type Xavc4kIntraCbgProfileClass = "CLASS_100"|"CLASS_300"|"CLASS_480"|string;
  export interface Xavc4kIntraCbgProfileSettings {
    /**
     * Specify the XAVC Intra 4k (CBG) Class to set the bitrate of your output. Outputs of the same class have similar image quality over the operating points that are valid for that class.
     */
    XavcClass?: Xavc4kIntraCbgProfileClass;
  }
  export type Xavc4kIntraVbrProfileClass = "CLASS_100"|"CLASS_300"|"CLASS_480"|string;
  export interface Xavc4kIntraVbrProfileSettings {
    /**
     * Specify the XAVC Intra 4k (VBR) Class to set the bitrate of your output. Outputs of the same class have similar image quality over the operating points that are valid for that class.
     */
    XavcClass?: Xavc4kIntraVbrProfileClass;
  }
  export type Xavc4kProfileBitrateClass = "BITRATE_CLASS_100"|"BITRATE_CLASS_140"|"BITRATE_CLASS_200"|string;
  export type Xavc4kProfileCodecProfile = "HIGH"|"HIGH_422"|string;
  export type Xavc4kProfileQualityTuningLevel = "SINGLE_PASS"|"SINGLE_PASS_HQ"|"MULTI_PASS_HQ"|string;
  export interface Xavc4kProfileSettings {
    /**
     * Specify the XAVC 4k (Long GOP) Bitrate Class to set the bitrate of your output. Outputs of the same class have similar image quality over the operating points that are valid for that class.
     */
    BitrateClass?: Xavc4kProfileBitrateClass;
    /**
     * Specify the codec profile for this output. Choose High, 8-bit, 4:2:0 (HIGH) or High, 10-bit, 4:2:2 (HIGH_422). These profiles are specified in ITU-T H.264.
     */
    CodecProfile?: Xavc4kProfileCodecProfile;
    /**
     * The best way to set up adaptive quantization is to keep the default value, Auto (AUTO), for the setting Adaptive quantization (XavcAdaptiveQuantization). When you do so, MediaConvert automatically applies the best types of quantization for your video content. Include this setting in your JSON job specification only when you choose to change the default value for Adaptive quantization. Enable this setting to have the encoder reduce I-frame pop. I-frame pop appears as a visual flicker that can arise when the encoder saves bits by copying some macroblocks many times from frame to frame, and then refreshes them at the I-frame. When you enable this setting, the encoder updates these macroblocks slightly more often to smooth out the flicker. This setting is disabled by default. Related setting: In addition to enabling this setting, you must also set Adaptive quantization (adaptiveQuantization) to a value other than Off (OFF) or Auto (AUTO). Use Adaptive quantization to adjust the degree of smoothing that Flicker adaptive quantization provides.
     */
    FlickerAdaptiveQuantization?: XavcFlickerAdaptiveQuantization;
    /**
     * Specify whether the encoder uses B-frames as reference frames for other pictures in the same GOP. Choose Allow (ENABLED) to allow the encoder to use B-frames as reference frames. Choose Don't allow (DISABLED) to prevent the encoder from using B-frames as reference frames.
     */
    GopBReference?: XavcGopBReference;
    /**
     * Frequency of closed GOPs. In streaming applications, it is recommended that this be set to 1 so a decoder joining mid-stream will receive an IDR frame as quickly as possible. Setting this value to 0 will break output segmenting.
     */
    GopClosedCadence?: __integerMin0Max2147483647;
    /**
     * Specify the size of the buffer that MediaConvert uses in the HRD buffer model for this output. Specify this value in bits; for example, enter five megabits as 5000000. When you don't set this value, or you set it to zero, MediaConvert calculates the default by doubling the bitrate of this output point.
     */
    HrdBufferSize?: __integerMin0Max1152000000;
    /**
     * Optional. Use Quality tuning level (qualityTuningLevel) to choose how you want to trade off encoding speed for output video quality. The default behavior is faster, lower quality, single-pass encoding.
     */
    QualityTuningLevel?: Xavc4kProfileQualityTuningLevel;
    /**
     * Number of slices per picture. Must be less than or equal to the number of macroblock rows for progressive pictures, and less than or equal to half the number of macroblock rows for interlaced pictures.
     */
    Slices?: __integerMin8Max12;
  }
  export type XavcAdaptiveQuantization = "OFF"|"AUTO"|"LOW"|"MEDIUM"|"HIGH"|"HIGHER"|"MAX"|string;
  export type XavcEntropyEncoding = "AUTO"|"CABAC"|"CAVLC"|string;
  export type XavcFlickerAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type XavcFramerateControl = "INITIALIZE_FROM_SOURCE"|"SPECIFIED"|string;
  export type XavcFramerateConversionAlgorithm = "DUPLICATE_DROP"|"INTERPOLATE"|"FRAMEFORMER"|string;
  export type XavcGopBReference = "DISABLED"|"ENABLED"|string;
  export type XavcHdIntraCbgProfileClass = "CLASS_50"|"CLASS_100"|"CLASS_200"|string;
  export interface XavcHdIntraCbgProfileSettings {
    /**
     * Specify the XAVC Intra HD (CBG) Class to set the bitrate of your output. Outputs of the same class have similar image quality over the operating points that are valid for that class.
     */
    XavcClass?: XavcHdIntraCbgProfileClass;
  }
  export type XavcHdProfileBitrateClass = "BITRATE_CLASS_25"|"BITRATE_CLASS_35"|"BITRATE_CLASS_50"|string;
  export type XavcHdProfileQualityTuningLevel = "SINGLE_PASS"|"SINGLE_PASS_HQ"|"MULTI_PASS_HQ"|string;
  export interface XavcHdProfileSettings {
    /**
     * Specify the XAVC HD (Long GOP) Bitrate Class to set the bitrate of your output. Outputs of the same class have similar image quality over the operating points that are valid for that class.
     */
    BitrateClass?: XavcHdProfileBitrateClass;
    /**
     * The best way to set up adaptive quantization is to keep the default value, Auto (AUTO), for the setting Adaptive quantization (XavcAdaptiveQuantization). When you do so, MediaConvert automatically applies the best types of quantization for your video content. Include this setting in your JSON job specification only when you choose to change the default value for Adaptive quantization. Enable this setting to have the encoder reduce I-frame pop. I-frame pop appears as a visual flicker that can arise when the encoder saves bits by copying some macroblocks many times from frame to frame, and then refreshes them at the I-frame. When you enable this setting, the encoder updates these macroblocks slightly more often to smooth out the flicker. This setting is disabled by default. Related setting: In addition to enabling this setting, you must also set Adaptive quantization (adaptiveQuantization) to a value other than Off (OFF) or Auto (AUTO). Use Adaptive quantization to adjust the degree of smoothing that Flicker adaptive quantization provides.
     */
    FlickerAdaptiveQuantization?: XavcFlickerAdaptiveQuantization;
    /**
     * Specify whether the encoder uses B-frames as reference frames for other pictures in the same GOP. Choose Allow (ENABLED) to allow the encoder to use B-frames as reference frames. Choose Don't allow (DISABLED) to prevent the encoder from using B-frames as reference frames.
     */
    GopBReference?: XavcGopBReference;
    /**
     * Frequency of closed GOPs. In streaming applications, it is recommended that this be set to 1 so a decoder joining mid-stream will receive an IDR frame as quickly as possible. Setting this value to 0 will break output segmenting.
     */
    GopClosedCadence?: __integerMin0Max2147483647;
    /**
     * Specify the size of the buffer that MediaConvert uses in the HRD buffer model for this output. Specify this value in bits; for example, enter five megabits as 5000000. When you don't set this value, or you set it to zero, MediaConvert calculates the default by doubling the bitrate of this output point.
     */
    HrdBufferSize?: __integerMin0Max1152000000;
    /**
     * Choose the scan line type for the output. Keep the default value, Progressive (PROGRESSIVE) to create a progressive output, regardless of the scan type of your input. Use Top field first (TOP_FIELD) or Bottom field first (BOTTOM_FIELD) to create an output that's interlaced with the same field polarity throughout. Use Follow, default top (FOLLOW_TOP_FIELD) or Follow, default bottom (FOLLOW_BOTTOM_FIELD) to produce outputs with the same field polarity as the source. For jobs that have multiple inputs, the output field polarity might change over the course of the output. Follow behavior depends on the input scan type. If the source is interlaced, the output will be interlaced with the same polarity as the source. If the source is progressive, the output will be interlaced with top field bottom field first, depending on which of the Follow options you choose.
     */
    InterlaceMode?: XavcInterlaceMode;
    /**
     * Optional. Use Quality tuning level (qualityTuningLevel) to choose how you want to trade off encoding speed for output video quality. The default behavior is faster, lower quality, single-pass encoding.
     */
    QualityTuningLevel?: XavcHdProfileQualityTuningLevel;
    /**
     * Number of slices per picture. Must be less than or equal to the number of macroblock rows for progressive pictures, and less than or equal to half the number of macroblock rows for interlaced pictures.
     */
    Slices?: __integerMin4Max12;
    /**
     * Ignore this setting unless you set Frame rate (framerateNumerator divided by framerateDenominator) to 29.970. If your input framerate is 23.976, choose Hard (HARD). Otherwise, keep the default value None (NONE). For more information, see https://docs.aws.amazon.com/mediaconvert/latest/ug/working-with-telecine-and-inverse-telecine.html.
     */
    Telecine?: XavcHdProfileTelecine;
  }
  export type XavcHdProfileTelecine = "NONE"|"HARD"|string;
  export type XavcInterlaceMode = "PROGRESSIVE"|"TOP_FIELD"|"BOTTOM_FIELD"|"FOLLOW_TOP_FIELD"|"FOLLOW_BOTTOM_FIELD"|string;
  export type XavcProfile = "XAVC_HD_INTRA_CBG"|"XAVC_4K_INTRA_CBG"|"XAVC_4K_INTRA_VBR"|"XAVC_HD"|"XAVC_4K"|string;
  export interface XavcSettings {
    /**
     * Keep the default value, Auto (AUTO), for this setting to have MediaConvert automatically apply the best types of quantization for your video content. When you want to apply your quantization settings manually, you must set Adaptive quantization (adaptiveQuantization) to a value other than Auto (AUTO). Use this setting to specify the strength of any adaptive quantization filters that you enable. If you don't want MediaConvert to do any adaptive quantization in this transcode, set Adaptive quantization to Off (OFF). Related settings: The value that you choose here applies to the following settings: Flicker adaptive quantization (flickerAdaptiveQuantization), Spatial adaptive quantization (spatialAdaptiveQuantization), and Temporal adaptive quantization (temporalAdaptiveQuantization).
     */
    AdaptiveQuantization?: XavcAdaptiveQuantization;
    /**
     * Optional. Choose a specific entropy encoding mode only when you want to override XAVC recommendations. If you choose the value auto, MediaConvert uses the mode that the XAVC file format specifies given this output's operating point.
     */
    EntropyEncoding?: XavcEntropyEncoding;
    /**
     * If you are using the console, use the Frame rate setting to specify the frame rate for this output. If you want to keep the same frame rate as the input video, choose Follow source. If you want to do frame rate conversion, choose a frame rate from the dropdown list. The framerates shown in the dropdown list are decimal approximations of fractions. If you are creating your transcoding job specification as a JSON file without the console, use FramerateControl to specify which value the service uses for the frame rate for this output. Choose INITIALIZE_FROM_SOURCE if you want the service to use the frame rate from the input. Choose SPECIFIED if you want the service to use the frame rate that you specify in the settings FramerateNumerator and FramerateDenominator.
     */
    FramerateControl?: XavcFramerateControl;
    /**
     * Choose the method that you want MediaConvert to use when increasing or decreasing the frame rate. We recommend using drop duplicate (DUPLICATE_DROP) for numerically simple conversions, such as 60 fps to 30 fps. For numerically complex conversions, you can use interpolate (INTERPOLATE) to avoid stutter. This results in a smooth picture, but might introduce undesirable video artifacts. For complex frame rate conversions, especially if your source video has already been converted from its original cadence, use FrameFormer (FRAMEFORMER) to do motion-compensated interpolation. FrameFormer chooses the best conversion method frame by frame. Note that using FrameFormer increases the transcoding time and incurs a significant add-on cost.
     */
    FramerateConversionAlgorithm?: XavcFramerateConversionAlgorithm;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example, 24000 / 1001 = 23.976 fps. Use FramerateDenominator to specify the denominator of this fraction. In this example, use 1001 for the value of FramerateDenominator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Frame rate. In this example, specify 23.976.
     */
    FramerateDenominator?: __integerMin1Max1001;
    /**
     * When you use the API for transcode jobs that use frame rate conversion, specify the frame rate as a fraction. For example, 24000 / 1001 = 23.976 fps. Use FramerateNumerator to specify the numerator of this fraction. In this example, use 24000 for the value of FramerateNumerator. When you use the console for transcode jobs that use frame rate conversion, provide the value as a decimal number for Framerate. In this example, specify 23.976.
     */
    FramerateNumerator?: __integerMin24Max60000;
    /**
     * Specify the XAVC profile for this output. For more information, see the Sony documentation at https://www.xavc-info.org/. Note that MediaConvert doesn't support the interlaced video XAVC operating points for XAVC_HD_INTRA_CBG. To create an interlaced XAVC output, choose the profile XAVC_HD.
     */
    Profile?: XavcProfile;
    /**
     * Ignore this setting unless your input frame rate is 23.976 or 24 frames per second (fps). Enable slow PAL to create a 25 fps output by relabeling the video frames and resampling your audio. Note that enabling this setting will slightly reduce the duration of your video. Related settings: You must also set Frame rate to 25. In your JSON job specification, set (framerateControl) to (SPECIFIED), (framerateNumerator) to 25 and (framerateDenominator) to 1.
     */
    SlowPal?: XavcSlowPal;
    /**
     * Ignore this setting unless your downstream workflow requires that you specify it explicitly. Otherwise, we recommend that you adjust the softness of your output by using a lower value for the setting Sharpness (sharpness) or by enabling a noise reducer filter (noiseReducerFilter). The Softness (softness) setting specifies the quantization matrices that the encoder uses. Keep the default value, 0, for flat quantization. Choose the value 1 or 16 to use the default JVT softening quantization matricies from the H.264 specification. Choose a value from 17 to 128 to use planar interpolation. Increasing values from 17 to 128 result in increasing reduction of high-frequency data. The value 128 results in the softest video.
     */
    Softness?: __integerMin0Max128;
    /**
     * The best way to set up adaptive quantization is to keep the default value, Auto (AUTO), for the setting Adaptive quantization (adaptiveQuantization). When you do so, MediaConvert automatically applies the best types of quantization for your video content. Include this setting in your JSON job specification only when you choose to change the default value for Adaptive quantization. For this setting, keep the default value, Enabled (ENABLED), to adjust quantization within each frame based on spatial variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas that can sustain more distortion with no noticeable visual degradation and uses more bits on areas where any small distortion will be noticeable. For example, complex textured blocks are encoded with fewer bits and smooth textured blocks are encoded with more bits. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen with a lot of complex texture, you might choose to disable this feature. Related setting: When you enable spatial adaptive quantization, set the value for Adaptive quantization (adaptiveQuantization) depending on your content. For homogeneous content, such as cartoons and video games, set it to Low. For content with a wider variety of textures, set it to High or Higher.
     */
    SpatialAdaptiveQuantization?: XavcSpatialAdaptiveQuantization;
    /**
     * The best way to set up adaptive quantization is to keep the default value, Auto (AUTO), for the setting Adaptive quantization (adaptiveQuantization). When you do so, MediaConvert automatically applies the best types of quantization for your video content. Include this setting in your JSON job specification only when you choose to change the default value for Adaptive quantization. For this setting, keep the default value, Enabled (ENABLED), to adjust quantization within each frame based on temporal variation of content complexity. When you enable this feature, the encoder uses fewer bits on areas of the frame that aren't moving and uses more bits on complex objects with sharp edges that move a lot. For example, this feature improves the readability of text tickers on newscasts and scoreboards on sports matches. Enabling this feature will almost always improve your video quality. Note, though, that this feature doesn't take into account where the viewer's attention is likely to be. If viewers are likely to be focusing their attention on a part of the screen that doesn't have moving objects with sharp edges, such as sports athletes' faces, you might choose to disable this feature. Related setting: When you enable temporal adaptive quantization, adjust the strength of the filter with the setting Adaptive quantization (adaptiveQuantization).
     */
    TemporalAdaptiveQuantization?: XavcTemporalAdaptiveQuantization;
    /**
     * Required when you set (Profile) under (VideoDescription)>(CodecSettings)>(XavcSettings) to the value XAVC_4K_INTRA_CBG.
     */
    Xavc4kIntraCbgProfileSettings?: Xavc4kIntraCbgProfileSettings;
    /**
     * Required when you set (Profile) under (VideoDescription)>(CodecSettings)>(XavcSettings) to the value XAVC_4K_INTRA_VBR.
     */
    Xavc4kIntraVbrProfileSettings?: Xavc4kIntraVbrProfileSettings;
    /**
     * Required when you set (Profile) under (VideoDescription)>(CodecSettings)>(XavcSettings) to the value XAVC_4K.
     */
    Xavc4kProfileSettings?: Xavc4kProfileSettings;
    /**
     * Required when you set (Profile) under (VideoDescription)>(CodecSettings)>(XavcSettings) to the value XAVC_HD_INTRA_CBG.
     */
    XavcHdIntraCbgProfileSettings?: XavcHdIntraCbgProfileSettings;
    /**
     * Required when you set (Profile) under (VideoDescription)>(CodecSettings)>(XavcSettings) to the value XAVC_HD.
     */
    XavcHdProfileSettings?: XavcHdProfileSettings;
  }
  export type XavcSlowPal = "DISABLED"|"ENABLED"|string;
  export type XavcSpatialAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type XavcTemporalAdaptiveQuantization = "DISABLED"|"ENABLED"|string;
  export type __doubleMin0 = number;
  export type __doubleMin0Max1 = number;
  export type __doubleMin0Max2147483647 = number;
  export type __doubleMinNegative59Max0 = number;
  export type __doubleMinNegative60Max3 = number;
  export type __doubleMinNegative60Max6 = number;
  export type __doubleMinNegative60MaxNegative1 = number;
  export type __doubleMinNegative6Max3 = number;
  export type __integer = number;
  export type __integerMin0Max0 = number;
  export type __integerMin0Max1 = number;
  export type __integerMin0Max10 = number;
  export type __integerMin0Max100 = number;
  export type __integerMin0Max1000 = number;
  export type __integerMin0Max10000 = number;
  export type __integerMin0Max1152000000 = number;
  export type __integerMin0Max128 = number;
  export type __integerMin0Max1466400000 = number;
  export type __integerMin0Max15 = number;
  export type __integerMin0Max16 = number;
  export type __integerMin0Max2147483647 = number;
  export type __integerMin0Max255 = number;
  export type __integerMin0Max3 = number;
  export type __integerMin0Max30 = number;
  export type __integerMin0Max30000 = number;
  export type __integerMin0Max3600 = number;
  export type __integerMin0Max4 = number;
  export type __integerMin0Max4000 = number;
  export type __integerMin0Max4194303 = number;
  export type __integerMin0Max47185920 = number;
  export type __integerMin0Max500 = number;
  export type __integerMin0Max50000 = number;
  export type __integerMin0Max65534 = number;
  export type __integerMin0Max65535 = number;
  export type __integerMin0Max7 = number;
  export type __integerMin0Max8 = number;
  export type __integerMin0Max9 = number;
  export type __integerMin0Max96 = number;
  export type __integerMin0Max99 = number;
  export type __integerMin100000Max100000000 = number;
  export type __integerMin1000Max1152000000 = number;
  export type __integerMin1000Max1466400000 = number;
  export type __integerMin1000Max288000000 = number;
  export type __integerMin1000Max30000 = number;
  export type __integerMin1000Max300000000 = number;
  export type __integerMin1000Max480000000 = number;
  export type __integerMin10Max48 = number;
  export type __integerMin16000Max320000 = number;
  export type __integerMin16000Max48000 = number;
  export type __integerMin16Max24 = number;
  export type __integerMin1Max1 = number;
  export type __integerMin1Max10 = number;
  export type __integerMin1Max100 = number;
  export type __integerMin1Max10000000 = number;
  export type __integerMin1Max1001 = number;
  export type __integerMin1Max17895697 = number;
  export type __integerMin1Max2 = number;
  export type __integerMin1Max20 = number;
  export type __integerMin1Max2048 = number;
  export type __integerMin1Max2147483640 = number;
  export type __integerMin1Max2147483647 = number;
  export type __integerMin1Max31 = number;
  export type __integerMin1Max32 = number;
  export type __integerMin1Max4 = number;
  export type __integerMin1Max4096 = number;
  export type __integerMin1Max512 = number;
  export type __integerMin1Max6 = number;
  export type __integerMin1Max60000 = number;
  export type __integerMin1Max64 = number;
  export type __integerMin22050Max48000 = number;
  export type __integerMin24Max60000 = number;
  export type __integerMin25Max10000 = number;
  export type __integerMin25Max2000 = number;
  export type __integerMin2Max2147483647 = number;
  export type __integerMin2Max4096 = number;
  export type __integerMin32000Max192000 = number;
  export type __integerMin32000Max384000 = number;
  export type __integerMin32000Max48000 = number;
  export type __integerMin32Max8182 = number;
  export type __integerMin32Max8192 = number;
  export type __integerMin384000Max1024000 = number;
  export type __integerMin3Max15 = number;
  export type __integerMin48000Max48000 = number;
  export type __integerMin4Max12 = number;
  export type __integerMin6000Max1024000 = number;
  export type __integerMin64000Max640000 = number;
  export type __integerMin8000Max192000 = number;
  export type __integerMin8000Max96000 = number;
  export type __integerMin8Max12 = number;
  export type __integerMin8Max4096 = number;
  export type __integerMin96Max600 = number;
  export type __integerMinNegative1000Max1000 = number;
  export type __integerMinNegative180Max180 = number;
  export type __integerMinNegative1Max10 = number;
  export type __integerMinNegative1Max3 = number;
  export type __integerMinNegative2147483648Max2147483647 = number;
  export type __integerMinNegative2Max3 = number;
  export type __integerMinNegative50Max50 = number;
  export type __integerMinNegative5Max5 = number;
  export type __integerMinNegative60Max6 = number;
  export type __integerMinNegative70Max0 = number;
  export type __listOfAudioDescription = AudioDescription[];
  export type __listOfCaptionDescription = CaptionDescription[];
  export type __listOfCaptionDescriptionPreset = CaptionDescriptionPreset[];
  export type __listOfCmafAdditionalManifest = CmafAdditionalManifest[];
  export type __listOfDashAdditionalManifest = DashAdditionalManifest[];
  export type __listOfEndpoint = Endpoint[];
  export type __listOfHlsAdMarkers = HlsAdMarkers[];
  export type __listOfHlsAdditionalManifest = HlsAdditionalManifest[];
  export type __listOfHlsCaptionLanguageMapping = HlsCaptionLanguageMapping[];
  export type __listOfHopDestination = HopDestination[];
  export type __listOfId3Insertion = Id3Insertion[];
  export type __listOfInput = Input[];
  export type __listOfInputClipping = InputClipping[];
  export type __listOfInputTemplate = InputTemplate[];
  export type __listOfInsertableImage = InsertableImage[];
  export type __listOfJob = Job[];
  export type __listOfJobTemplate = JobTemplate[];
  export type __listOfMsSmoothAdditionalManifest = MsSmoothAdditionalManifest[];
  export type __listOfOutput = Output[];
  export type __listOfOutputChannelMapping = OutputChannelMapping[];
  export type __listOfOutputDetail = OutputDetail[];
  export type __listOfOutputGroup = OutputGroup[];
  export type __listOfOutputGroupDetail = OutputGroupDetail[];
  export type __listOfPreset = Preset[];
  export type __listOfQueue = Queue[];
  export type __listOfQueueTransition = QueueTransition[];
  export type __listOfTeletextPageType = TeletextPageType[];
  export type __listOf__doubleMinNegative60Max6 = __doubleMinNegative60Max6[];
  export type __listOf__integerMin1Max2147483647 = __integerMin1Max2147483647[];
  export type __listOf__integerMin32Max8182 = __integerMin32Max8182[];
  export type __listOf__integerMinNegative60Max6 = __integerMinNegative60Max6[];
  export type __listOf__string = __string[];
  export type __listOf__stringMin1 = __stringMin1[];
  export type __listOf__stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12 = __stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12[];
  export type __listOf__stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12 = __stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12[];
  export type __listOf__stringPatternS3ASSETMAPXml = __stringPatternS3ASSETMAPXml[];
  export type __mapOfAudioSelector = {[key: string]: AudioSelector};
  export type __mapOfAudioSelectorGroup = {[key: string]: AudioSelectorGroup};
  export type __mapOfCaptionSelector = {[key: string]: CaptionSelector};
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  export type __stringMin0 = string;
  export type __stringMin1 = string;
  export type __stringMin11Max11Pattern01D20305D205D = string;
  export type __stringMin14PatternS3BmpBMPPngPNGHttpsBmpBMPPngPNG = string;
  export type __stringMin14PatternS3BmpBMPPngPNGTgaTGAHttpsBmpBMPPngPNGTgaTGA = string;
  export type __stringMin14PatternS3Mov09PngHttpsMov09Png = string;
  export type __stringMin14PatternS3SccSCCTtmlTTMLDfxpDFXPStlSTLSrtSRTXmlXMLSmiSMIVttVTTWebvttWEBVTTHttpsSccSCCTtmlTTMLDfxpDFXPStlSTLSrtSRTXmlXMLSmiSMIVttVTTWebvttWEBVTT = string;
  export type __stringMin16Max24PatternAZaZ0922AZaZ0916 = string;
  export type __stringMin1Max100000 = string;
  export type __stringMin1Max20 = string;
  export type __stringMin1Max256 = string;
  export type __stringMin1Max50 = string;
  export type __stringMin1Max50PatternAZAZ09 = string;
  export type __stringMin1Max512PatternAZAZ09 = string;
  export type __stringMin24Max512PatternAZaZ0902 = string;
  export type __stringMin32Max32Pattern09aFAF32 = string;
  export type __stringMin36Max36Pattern09aFAF809aFAF409aFAF409aFAF409aFAF12 = string;
  export type __stringMin3Max3Pattern1809aFAF09aEAE = string;
  export type __stringMin3Max3PatternAZaZ3 = string;
  export type __stringMin6Max8Pattern09aFAF609aFAF2 = string;
  export type __stringMin9Max19PatternAZ26EastWestCentralNorthSouthEastWest1912 = string;
  export type __stringPattern = string;
  export type __stringPattern010920405090509092 = string;
  export type __stringPattern01D20305D205D = string;
  export type __stringPattern0940191020191209301 = string;
  export type __stringPattern09aFAF809aFAF409aFAF409aFAF409aFAF12 = string;
  export type __stringPattern0xAFaF0908190908 = string;
  export type __stringPatternAZaZ0902 = string;
  export type __stringPatternAZaZ0932 = string;
  export type __stringPatternAZaZ23AZaZ = string;
  export type __stringPatternArnAwsUsGovAcm = string;
  export type __stringPatternArnAwsUsGovCnKmsAZ26EastWestCentralNorthSouthEastWest1912D12KeyAFAF098AFAF094AFAF094AFAF094AFAF0912 = string;
  export type __stringPatternDD = string;
  export type __stringPatternHttps = string;
  export type __stringPatternHttpsKantarmediaCom = string;
  export type __stringPatternIdentityAZaZ26AZaZ09163 = string;
  export type __stringPatternS3 = string;
  export type __stringPatternS3ASSETMAPXml = string;
  export type __stringPatternS3MM2PPMM2VVMMPPEEGGMMPP3AAVVIIMMPP4FFLLVVMMPPTTMMPPGGMM4VVTTRRPPFF4VVMM2TTSSTTSS264HH264MMKKVVMMKKAAMMOOVVMMTTSSMM2TTWWMMVVaAAASSFFVVOOBB3GGPP3GGPPPPMMXXFFDDIIVVXXXXVVIIDDRRAAWWDDVVGGXXFFMM1VV3GG2VVMMFFMM3UU8WWEEBBMMLLCCHHGGXXFFMMPPEEGG2MMXXFFMMPPEEGG2MMXXFFHHDDWWAAVVYY4MMXXMMLLOOGGGGaAAATTMMOOSSHttpsMM2VVMMPPEEGGMMPP3AAVVIIMMPP4FFLLVVMMPPTTMMPPGGMM4VVTTRRPPFF4VVMM2TTSSTTSS264HH264MMKKVVMMKKAAMMOOVVMMTTSSMM2TTWWMMVVaAAASSFFVVOOBB3GGPP3GGPPPPMMXXFFDDIIVVXXXXVVIIDDRRAAWWDDVVGGXXFFMM1VV3GG2VVMMFFMM3UU8WWEEBBMMLLCCHHGGXXFFMMPPEEGG2MMXXFFMMPPEEGG2MMXXFFHHDDWWAAVVYY4MMXXMMLLOOGGGGaAAATTMMOOSS = string;
  export type __stringPatternS3MM2PPWWEEBBMMMM2VVMMPPEEGGMMPP3AAVVIIMMPP4FFLLVVMMPPTTMMPPGGMM4VVTTRRPPFF4VVMM2TTSSTTSS264HH264MMKKVVMMKKAAMMOOVVMMTTSSMM2TTWWMMVVaAAASSFFVVOOBB3GGPP3GGPPPPMMXXFFDDIIVVXXXXVVIIDDRRAAWWDDVVGGXXFFMM1VV3GG2VVMMFFMM3UU8LLCCHHGGXXFFMMPPEEGG2MMXXFFMMPPEEGG2MMXXFFHHDDWWAAVVYY4MMAAAACCAAIIFFFFMMPP2AACC3EECC3DDTTSSEEAATTMMOOSSHttpsMM2VVMMPPEEGGMMPP3AAVVIIMMPP4FFLLVVMMPPTTMMPPGGMM4VVTTRRPPFF4VVMM2TTSSTTSS264HH264MMKKVVMMKKAAMMOOVVMMTTSSMM2TTWWMMVVaAAASSFFVVOOBB3GGPP3GGPPPPMMXXFFDDIIVVXXXXVVIIDDRRAAWWDDVVGGXXFFMM1VV3GG2VVMMFFMM3UU8LLCCHHGGXXFFMMPPEEGG2MMXXFFMMPPEEGG2MMXXFFHHDDWWAAVVYY4MMAAAACCAAIIFFFFMMPP2AACC3EECC3DDTTSSEEAATTMMOOSS = string;
  export type __stringPatternSNManifestConfirmConditionNotificationNS = string;
  export type __stringPatternSNSignalProcessingNotificationNS = string;
  export type __stringPatternW = string;
  export type __stringPatternWS = string;
  export type __timestampUnix = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-08-29"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MediaConvert client.
   */
  export import Types = MediaConvert;
}
export = MediaConvert;
