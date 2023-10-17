import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class KinesisVideoArchivedMedia extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: KinesisVideoArchivedMedia.Types.ClientConfiguration)
  config: Config & KinesisVideoArchivedMedia.Types.ClientConfiguration;
  /**
   * Downloads an MP4 file (clip) containing the archived, on-demand media from the specified video stream over the specified time range.  Both the StreamName and the StreamARN parameters are optional, but you must specify either the StreamName or the StreamARN when invoking this API operation.  As a prerequisite to using GetCLip API, you must obtain an endpoint using GetDataEndpoint, specifying GET_CLIP for the APIName parameter.  An Amazon Kinesis video stream has the following requirements for providing data through MP4:   The media must contain h.264 or h.265 encoded video and, optionally, AAC or G.711 encoded audio. Specifically, the codec ID of track 1 should be V_MPEG/ISO/AVC (for h.264) or V_MPEGH/ISO/HEVC (for H.265). Optionally, the codec ID of track 2 should be A_AAC (for AAC) or A_MS/ACM (for G.711).   Data retention must be greater than 0.   The video track of each fragment must contain codec private data in the Advanced Video Coding (AVC) for H.264 format and HEVC for H.265 format. For more information, see MPEG-4 specification ISO/IEC 14496-15. For information about adapting stream data to a given format, see NAL Adaptation Flags.   The audio track (if present) of each fragment must contain codec private data in the AAC format (AAC specification ISO/IEC 13818-7) or the MS Wave format.   You can monitor the amount of outgoing data by monitoring the GetClip.OutgoingBytes Amazon CloudWatch metric. For information about using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video Streams Pricing and  Amazon Web Services Pricing. Charges for outgoing Amazon Web Services data apply.
   */
  getClip(params: KinesisVideoArchivedMedia.Types.GetClipInput, callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetClipOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetClipOutput, AWSError>;
  /**
   * Downloads an MP4 file (clip) containing the archived, on-demand media from the specified video stream over the specified time range.  Both the StreamName and the StreamARN parameters are optional, but you must specify either the StreamName or the StreamARN when invoking this API operation.  As a prerequisite to using GetCLip API, you must obtain an endpoint using GetDataEndpoint, specifying GET_CLIP for the APIName parameter.  An Amazon Kinesis video stream has the following requirements for providing data through MP4:   The media must contain h.264 or h.265 encoded video and, optionally, AAC or G.711 encoded audio. Specifically, the codec ID of track 1 should be V_MPEG/ISO/AVC (for h.264) or V_MPEGH/ISO/HEVC (for H.265). Optionally, the codec ID of track 2 should be A_AAC (for AAC) or A_MS/ACM (for G.711).   Data retention must be greater than 0.   The video track of each fragment must contain codec private data in the Advanced Video Coding (AVC) for H.264 format and HEVC for H.265 format. For more information, see MPEG-4 specification ISO/IEC 14496-15. For information about adapting stream data to a given format, see NAL Adaptation Flags.   The audio track (if present) of each fragment must contain codec private data in the AAC format (AAC specification ISO/IEC 13818-7) or the MS Wave format.   You can monitor the amount of outgoing data by monitoring the GetClip.OutgoingBytes Amazon CloudWatch metric. For information about using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video Streams Pricing and  Amazon Web Services Pricing. Charges for outgoing Amazon Web Services data apply.
   */
  getClip(callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetClipOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetClipOutput, AWSError>;
  /**
   * Retrieves an MPEG Dynamic Adaptive Streaming over HTTP (DASH) URL for the stream. You can then open the URL in a media player to view the stream contents. Both the StreamName and the StreamARN parameters are optional, but you must specify either the StreamName or the StreamARN when invoking this API operation. An Amazon Kinesis video stream has the following requirements for providing data through MPEG-DASH:   The media must contain h.264 or h.265 encoded video and, optionally, AAC or G.711 encoded audio. Specifically, the codec ID of track 1 should be V_MPEG/ISO/AVC (for h.264) or V_MPEGH/ISO/HEVC (for H.265). Optionally, the codec ID of track 2 should be A_AAC (for AAC) or A_MS/ACM (for G.711).   Data retention must be greater than 0.   The video track of each fragment must contain codec private data in the Advanced Video Coding (AVC) for H.264 format and HEVC for H.265 format. For more information, see MPEG-4 specification ISO/IEC 14496-15. For information about adapting stream data to a given format, see NAL Adaptation Flags.   The audio track (if present) of each fragment must contain codec private data in the AAC format (AAC specification ISO/IEC 13818-7) or the MS Wave format.   The following procedure shows how to use MPEG-DASH with Kinesis Video Streams:   Get an endpoint using GetDataEndpoint, specifying GET_DASH_STREAMING_SESSION_URL for the APIName parameter.   Retrieve the MPEG-DASH URL using GetDASHStreamingSessionURL. Kinesis Video Streams creates an MPEG-DASH streaming session to be used for accessing content in a stream using the MPEG-DASH protocol. GetDASHStreamingSessionURL returns an authenticated URL (that includes an encrypted session token) for the session's MPEG-DASH manifest (the root resource needed for streaming with MPEG-DASH).  Don't share or store this token where an unauthorized entity can access it. The token provides access to the content of the stream. Safeguard the token with the same measures that you use with your Amazon Web Services credentials.  The media that is made available through the manifest consists only of the requested stream, time range, and format. No other media data (such as frames outside the requested window or alternate bitrates) is made available.   Provide the URL (containing the encrypted session token) for the MPEG-DASH manifest to a media player that supports the MPEG-DASH protocol. Kinesis Video Streams makes the initialization fragment and media fragments available through the manifest URL. The initialization fragment contains the codec private data for the stream, and other data needed to set up the video or audio decoder and renderer. The media fragments contain encoded video frames or encoded audio samples.   The media player receives the authenticated URL and requests stream metadata and media data normally. When the media player requests data, it calls the following actions:    GetDASHManifest: Retrieves an MPEG DASH manifest, which contains the metadata for the media that you want to playback.    GetMP4InitFragment: Retrieves the MP4 initialization fragment. The media player typically loads the initialization fragment before loading any media fragments. This fragment contains the "fytp" and "moov" MP4 atoms, and the child atoms that are needed to initialize the media player decoder. The initialization fragment does not correspond to a fragment in a Kinesis video stream. It contains only the codec private data for the stream and respective track, which the media player needs to decode the media frames.    GetMP4MediaFragment: Retrieves MP4 media fragments. These fragments contain the "moof" and "mdat" MP4 atoms and their child atoms, containing the encoded fragment's media frames and their timestamps.   After the first media fragment is made available in a streaming session, any fragments that don't contain the same codec private data cause an error to be returned when those different media fragments are loaded. Therefore, the codec private data should not change between fragments in a session. This also means that the session fails if the fragments in a stream change from having only video to having both audio and video.  Data retrieved with this action is billable. See Pricing for details.      For restrictions that apply to MPEG-DASH sessions, see Kinesis Video Streams Limits.  You can monitor the amount of data that the media player consumes by monitoring the GetMP4MediaFragment.OutgoingBytes Amazon CloudWatch metric. For information about using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video Streams Pricing and Amazon Web Services Pricing. Charges for both HLS sessions and outgoing Amazon Web Services data apply. For more information about HLS, see HTTP Live Streaming on the Apple Developer site.  If an error is thrown after invoking a Kinesis Video Streams archived media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to Amazon Web Services the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  getDASHStreamingSessionURL(params: KinesisVideoArchivedMedia.Types.GetDASHStreamingSessionURLInput, callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetDASHStreamingSessionURLOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetDASHStreamingSessionURLOutput, AWSError>;
  /**
   * Retrieves an MPEG Dynamic Adaptive Streaming over HTTP (DASH) URL for the stream. You can then open the URL in a media player to view the stream contents. Both the StreamName and the StreamARN parameters are optional, but you must specify either the StreamName or the StreamARN when invoking this API operation. An Amazon Kinesis video stream has the following requirements for providing data through MPEG-DASH:   The media must contain h.264 or h.265 encoded video and, optionally, AAC or G.711 encoded audio. Specifically, the codec ID of track 1 should be V_MPEG/ISO/AVC (for h.264) or V_MPEGH/ISO/HEVC (for H.265). Optionally, the codec ID of track 2 should be A_AAC (for AAC) or A_MS/ACM (for G.711).   Data retention must be greater than 0.   The video track of each fragment must contain codec private data in the Advanced Video Coding (AVC) for H.264 format and HEVC for H.265 format. For more information, see MPEG-4 specification ISO/IEC 14496-15. For information about adapting stream data to a given format, see NAL Adaptation Flags.   The audio track (if present) of each fragment must contain codec private data in the AAC format (AAC specification ISO/IEC 13818-7) or the MS Wave format.   The following procedure shows how to use MPEG-DASH with Kinesis Video Streams:   Get an endpoint using GetDataEndpoint, specifying GET_DASH_STREAMING_SESSION_URL for the APIName parameter.   Retrieve the MPEG-DASH URL using GetDASHStreamingSessionURL. Kinesis Video Streams creates an MPEG-DASH streaming session to be used for accessing content in a stream using the MPEG-DASH protocol. GetDASHStreamingSessionURL returns an authenticated URL (that includes an encrypted session token) for the session's MPEG-DASH manifest (the root resource needed for streaming with MPEG-DASH).  Don't share or store this token where an unauthorized entity can access it. The token provides access to the content of the stream. Safeguard the token with the same measures that you use with your Amazon Web Services credentials.  The media that is made available through the manifest consists only of the requested stream, time range, and format. No other media data (such as frames outside the requested window or alternate bitrates) is made available.   Provide the URL (containing the encrypted session token) for the MPEG-DASH manifest to a media player that supports the MPEG-DASH protocol. Kinesis Video Streams makes the initialization fragment and media fragments available through the manifest URL. The initialization fragment contains the codec private data for the stream, and other data needed to set up the video or audio decoder and renderer. The media fragments contain encoded video frames or encoded audio samples.   The media player receives the authenticated URL and requests stream metadata and media data normally. When the media player requests data, it calls the following actions:    GetDASHManifest: Retrieves an MPEG DASH manifest, which contains the metadata for the media that you want to playback.    GetMP4InitFragment: Retrieves the MP4 initialization fragment. The media player typically loads the initialization fragment before loading any media fragments. This fragment contains the "fytp" and "moov" MP4 atoms, and the child atoms that are needed to initialize the media player decoder. The initialization fragment does not correspond to a fragment in a Kinesis video stream. It contains only the codec private data for the stream and respective track, which the media player needs to decode the media frames.    GetMP4MediaFragment: Retrieves MP4 media fragments. These fragments contain the "moof" and "mdat" MP4 atoms and their child atoms, containing the encoded fragment's media frames and their timestamps.   After the first media fragment is made available in a streaming session, any fragments that don't contain the same codec private data cause an error to be returned when those different media fragments are loaded. Therefore, the codec private data should not change between fragments in a session. This also means that the session fails if the fragments in a stream change from having only video to having both audio and video.  Data retrieved with this action is billable. See Pricing for details.      For restrictions that apply to MPEG-DASH sessions, see Kinesis Video Streams Limits.  You can monitor the amount of data that the media player consumes by monitoring the GetMP4MediaFragment.OutgoingBytes Amazon CloudWatch metric. For information about using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video Streams Pricing and Amazon Web Services Pricing. Charges for both HLS sessions and outgoing Amazon Web Services data apply. For more information about HLS, see HTTP Live Streaming on the Apple Developer site.  If an error is thrown after invoking a Kinesis Video Streams archived media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to Amazon Web Services the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  getDASHStreamingSessionURL(callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetDASHStreamingSessionURLOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetDASHStreamingSessionURLOutput, AWSError>;
  /**
   * Retrieves an HTTP Live Streaming (HLS) URL for the stream. You can then open the URL in a browser or media player to view the stream contents. Both the StreamName and the StreamARN parameters are optional, but you must specify either the StreamName or the StreamARN when invoking this API operation. An Amazon Kinesis video stream has the following requirements for providing data through HLS:   For streaming video, the media must contain H.264 or H.265 encoded video and, optionally, AAC encoded audio. Specifically, the codec ID of track 1 should be V_MPEG/ISO/AVC (for H.264) or V_MPEG/ISO/HEVC (for H.265). Optionally, the codec ID of track 2 should be A_AAC. For audio only streaming, the codec ID of track 1 should be A_AAC.   Data retention must be greater than 0.   The video track of each fragment must contain codec private data in the Advanced Video Coding (AVC) for H.264 format or HEVC for H.265 format (MPEG-4 specification ISO/IEC 14496-15). For information about adapting stream data to a given format, see NAL Adaptation Flags.   The audio track (if present) of each fragment must contain codec private data in the AAC format (AAC specification ISO/IEC 13818-7).   Kinesis Video Streams HLS sessions contain fragments in the fragmented MPEG-4 form (also called fMP4 or CMAF) or the MPEG-2 form (also called TS chunks, which the HLS specification also supports). For more information about HLS fragment types, see the HLS specification. The following procedure shows how to use HLS with Kinesis Video Streams:   Get an endpoint using GetDataEndpoint, specifying GET_HLS_STREAMING_SESSION_URL for the APIName parameter.   Retrieve the HLS URL using GetHLSStreamingSessionURL. Kinesis Video Streams creates an HLS streaming session to be used for accessing content in a stream using the HLS protocol. GetHLSStreamingSessionURL returns an authenticated URL (that includes an encrypted session token) for the session's HLS master playlist (the root resource needed for streaming with HLS).  Don't share or store this token where an unauthorized entity could access it. The token provides access to the content of the stream. Safeguard the token with the same measures that you would use with your Amazon Web Services credentials.  The media that is made available through the playlist consists only of the requested stream, time range, and format. No other media data (such as frames outside the requested window or alternate bitrates) is made available.   Provide the URL (containing the encrypted session token) for the HLS master playlist to a media player that supports the HLS protocol. Kinesis Video Streams makes the HLS media playlist, initialization fragment, and media fragments available through the master playlist URL. The initialization fragment contains the codec private data for the stream, and other data needed to set up the video or audio decoder and renderer. The media fragments contain H.264-encoded video frames or AAC-encoded audio samples.   The media player receives the authenticated URL and requests stream metadata and media data normally. When the media player requests data, it calls the following actions:    GetHLSMasterPlaylist: Retrieves an HLS master playlist, which contains a URL for the GetHLSMediaPlaylist action for each track, and additional metadata for the media player, including estimated bitrate and resolution.    GetHLSMediaPlaylist: Retrieves an HLS media playlist, which contains a URL to access the MP4 initialization fragment with the GetMP4InitFragment action, and URLs to access the MP4 media fragments with the GetMP4MediaFragment actions. The HLS media playlist also contains metadata about the stream that the player needs to play it, such as whether the PlaybackMode is LIVE or ON_DEMAND. The HLS media playlist is typically static for sessions with a PlaybackType of ON_DEMAND. The HLS media playlist is continually updated with new fragments for sessions with a PlaybackType of LIVE. There is a distinct HLS media playlist for the video track and the audio track (if applicable) that contains MP4 media URLs for the specific track.     GetMP4InitFragment: Retrieves the MP4 initialization fragment. The media player typically loads the initialization fragment before loading any media fragments. This fragment contains the "fytp" and "moov" MP4 atoms, and the child atoms that are needed to initialize the media player decoder. The initialization fragment does not correspond to a fragment in a Kinesis video stream. It contains only the codec private data for the stream and respective track, which the media player needs to decode the media frames.    GetMP4MediaFragment: Retrieves MP4 media fragments. These fragments contain the "moof" and "mdat" MP4 atoms and their child atoms, containing the encoded fragment's media frames and their timestamps.   For the HLS streaming session, in-track codec private data (CPD) changes are supported. After the first media fragment is made available in a streaming session, fragments can contain CPD changes for each track. Therefore, the fragments in a session can have a different resolution, bit rate, or other information in the CPD without interrupting playback. However, any change made in the track number or track codec format can return an error when those different media fragments are loaded. For example, streaming will fail if the fragments in the stream change from having only video to having both audio and video, or if an AAC audio track is changed to an ALAW audio track. For each streaming session, only 500 CPD changes are allowed.  Data retrieved with this action is billable. For information, see Pricing.    GetTSFragment: Retrieves MPEG TS fragments containing both initialization and media data for all tracks in the stream.  If the ContainerFormat is MPEG_TS, this API is used instead of GetMP4InitFragment and GetMP4MediaFragment to retrieve stream media.  Data retrieved with this action is billable. For more information, see Kinesis Video Streams pricing.     A streaming session URL must not be shared between players. The service might throttle a session if multiple media players are sharing it. For connection limits, see Kinesis Video Streams Limits. You can monitor the amount of data that the media player consumes by monitoring the GetMP4MediaFragment.OutgoingBytes Amazon CloudWatch metric. For information about using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video Streams Pricing and Amazon Web Services Pricing. Charges for both HLS sessions and outgoing Amazon Web Services data apply. For more information about HLS, see HTTP Live Streaming on the Apple Developer site.  If an error is thrown after invoking a Kinesis Video Streams archived media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to Amazon Web Services, the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  getHLSStreamingSessionURL(params: KinesisVideoArchivedMedia.Types.GetHLSStreamingSessionURLInput, callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetHLSStreamingSessionURLOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetHLSStreamingSessionURLOutput, AWSError>;
  /**
   * Retrieves an HTTP Live Streaming (HLS) URL for the stream. You can then open the URL in a browser or media player to view the stream contents. Both the StreamName and the StreamARN parameters are optional, but you must specify either the StreamName or the StreamARN when invoking this API operation. An Amazon Kinesis video stream has the following requirements for providing data through HLS:   For streaming video, the media must contain H.264 or H.265 encoded video and, optionally, AAC encoded audio. Specifically, the codec ID of track 1 should be V_MPEG/ISO/AVC (for H.264) or V_MPEG/ISO/HEVC (for H.265). Optionally, the codec ID of track 2 should be A_AAC. For audio only streaming, the codec ID of track 1 should be A_AAC.   Data retention must be greater than 0.   The video track of each fragment must contain codec private data in the Advanced Video Coding (AVC) for H.264 format or HEVC for H.265 format (MPEG-4 specification ISO/IEC 14496-15). For information about adapting stream data to a given format, see NAL Adaptation Flags.   The audio track (if present) of each fragment must contain codec private data in the AAC format (AAC specification ISO/IEC 13818-7).   Kinesis Video Streams HLS sessions contain fragments in the fragmented MPEG-4 form (also called fMP4 or CMAF) or the MPEG-2 form (also called TS chunks, which the HLS specification also supports). For more information about HLS fragment types, see the HLS specification. The following procedure shows how to use HLS with Kinesis Video Streams:   Get an endpoint using GetDataEndpoint, specifying GET_HLS_STREAMING_SESSION_URL for the APIName parameter.   Retrieve the HLS URL using GetHLSStreamingSessionURL. Kinesis Video Streams creates an HLS streaming session to be used for accessing content in a stream using the HLS protocol. GetHLSStreamingSessionURL returns an authenticated URL (that includes an encrypted session token) for the session's HLS master playlist (the root resource needed for streaming with HLS).  Don't share or store this token where an unauthorized entity could access it. The token provides access to the content of the stream. Safeguard the token with the same measures that you would use with your Amazon Web Services credentials.  The media that is made available through the playlist consists only of the requested stream, time range, and format. No other media data (such as frames outside the requested window or alternate bitrates) is made available.   Provide the URL (containing the encrypted session token) for the HLS master playlist to a media player that supports the HLS protocol. Kinesis Video Streams makes the HLS media playlist, initialization fragment, and media fragments available through the master playlist URL. The initialization fragment contains the codec private data for the stream, and other data needed to set up the video or audio decoder and renderer. The media fragments contain H.264-encoded video frames or AAC-encoded audio samples.   The media player receives the authenticated URL and requests stream metadata and media data normally. When the media player requests data, it calls the following actions:    GetHLSMasterPlaylist: Retrieves an HLS master playlist, which contains a URL for the GetHLSMediaPlaylist action for each track, and additional metadata for the media player, including estimated bitrate and resolution.    GetHLSMediaPlaylist: Retrieves an HLS media playlist, which contains a URL to access the MP4 initialization fragment with the GetMP4InitFragment action, and URLs to access the MP4 media fragments with the GetMP4MediaFragment actions. The HLS media playlist also contains metadata about the stream that the player needs to play it, such as whether the PlaybackMode is LIVE or ON_DEMAND. The HLS media playlist is typically static for sessions with a PlaybackType of ON_DEMAND. The HLS media playlist is continually updated with new fragments for sessions with a PlaybackType of LIVE. There is a distinct HLS media playlist for the video track and the audio track (if applicable) that contains MP4 media URLs for the specific track.     GetMP4InitFragment: Retrieves the MP4 initialization fragment. The media player typically loads the initialization fragment before loading any media fragments. This fragment contains the "fytp" and "moov" MP4 atoms, and the child atoms that are needed to initialize the media player decoder. The initialization fragment does not correspond to a fragment in a Kinesis video stream. It contains only the codec private data for the stream and respective track, which the media player needs to decode the media frames.    GetMP4MediaFragment: Retrieves MP4 media fragments. These fragments contain the "moof" and "mdat" MP4 atoms and their child atoms, containing the encoded fragment's media frames and their timestamps.   For the HLS streaming session, in-track codec private data (CPD) changes are supported. After the first media fragment is made available in a streaming session, fragments can contain CPD changes for each track. Therefore, the fragments in a session can have a different resolution, bit rate, or other information in the CPD without interrupting playback. However, any change made in the track number or track codec format can return an error when those different media fragments are loaded. For example, streaming will fail if the fragments in the stream change from having only video to having both audio and video, or if an AAC audio track is changed to an ALAW audio track. For each streaming session, only 500 CPD changes are allowed.  Data retrieved with this action is billable. For information, see Pricing.    GetTSFragment: Retrieves MPEG TS fragments containing both initialization and media data for all tracks in the stream.  If the ContainerFormat is MPEG_TS, this API is used instead of GetMP4InitFragment and GetMP4MediaFragment to retrieve stream media.  Data retrieved with this action is billable. For more information, see Kinesis Video Streams pricing.     A streaming session URL must not be shared between players. The service might throttle a session if multiple media players are sharing it. For connection limits, see Kinesis Video Streams Limits. You can monitor the amount of data that the media player consumes by monitoring the GetMP4MediaFragment.OutgoingBytes Amazon CloudWatch metric. For information about using CloudWatch to monitor Kinesis Video Streams, see Monitoring Kinesis Video Streams. For pricing information, see Amazon Kinesis Video Streams Pricing and Amazon Web Services Pricing. Charges for both HLS sessions and outgoing Amazon Web Services data apply. For more information about HLS, see HTTP Live Streaming on the Apple Developer site.  If an error is thrown after invoking a Kinesis Video Streams archived media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to Amazon Web Services, the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  getHLSStreamingSessionURL(callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetHLSStreamingSessionURLOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetHLSStreamingSessionURLOutput, AWSError>;
  /**
   * Retrieves a list of Images corresponding to each timestamp for a given time range, sampling interval, and image format configuration.
   */
  getImages(params: KinesisVideoArchivedMedia.Types.GetImagesInput, callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetImagesOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetImagesOutput, AWSError>;
  /**
   * Retrieves a list of Images corresponding to each timestamp for a given time range, sampling interval, and image format configuration.
   */
  getImages(callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetImagesOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetImagesOutput, AWSError>;
  /**
   * Gets media for a list of fragments (specified by fragment number) from the archived data in an Amazon Kinesis video stream.  You must first call the GetDataEndpoint API to get an endpoint. Then send the GetMediaForFragmentList requests to this endpoint using the --endpoint-url parameter.   For limits, see Kinesis Video Streams Limits.  If an error is thrown after invoking a Kinesis Video Streams archived media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to Amazon Web Services, the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  getMediaForFragmentList(params: KinesisVideoArchivedMedia.Types.GetMediaForFragmentListInput, callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetMediaForFragmentListOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetMediaForFragmentListOutput, AWSError>;
  /**
   * Gets media for a list of fragments (specified by fragment number) from the archived data in an Amazon Kinesis video stream.  You must first call the GetDataEndpoint API to get an endpoint. Then send the GetMediaForFragmentList requests to this endpoint using the --endpoint-url parameter.   For limits, see Kinesis Video Streams Limits.  If an error is thrown after invoking a Kinesis Video Streams archived media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to Amazon Web Services, the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  getMediaForFragmentList(callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.GetMediaForFragmentListOutput) => void): Request<KinesisVideoArchivedMedia.Types.GetMediaForFragmentListOutput, AWSError>;
  /**
   * Returns a list of Fragment objects from the specified stream and timestamp range within the archived data. Listing fragments is eventually consistent. This means that even if the producer receives an acknowledgment that a fragment is persisted, the result might not be returned immediately from a request to ListFragments. However, results are typically available in less than one second.  You must first call the GetDataEndpoint API to get an endpoint. Then send the ListFragments requests to this endpoint using the --endpoint-url parameter.    If an error is thrown after invoking a Kinesis Video Streams archived media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to Amazon Web Services, the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  listFragments(params: KinesisVideoArchivedMedia.Types.ListFragmentsInput, callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.ListFragmentsOutput) => void): Request<KinesisVideoArchivedMedia.Types.ListFragmentsOutput, AWSError>;
  /**
   * Returns a list of Fragment objects from the specified stream and timestamp range within the archived data. Listing fragments is eventually consistent. This means that even if the producer receives an acknowledgment that a fragment is persisted, the result might not be returned immediately from a request to ListFragments. However, results are typically available in less than one second.  You must first call the GetDataEndpoint API to get an endpoint. Then send the ListFragments requests to this endpoint using the --endpoint-url parameter.    If an error is thrown after invoking a Kinesis Video Streams archived media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to Amazon Web Services, the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  listFragments(callback?: (err: AWSError, data: KinesisVideoArchivedMedia.Types.ListFragmentsOutput) => void): Request<KinesisVideoArchivedMedia.Types.ListFragmentsOutput, AWSError>;
}
declare namespace KinesisVideoArchivedMedia {
  export interface ClipFragmentSelector {
    /**
     * The origin of the timestamps to use (Server or Producer).
     */
    FragmentSelectorType: ClipFragmentSelectorType;
    /**
     * The range of timestamps to return.
     */
    TimestampRange: ClipTimestampRange;
  }
  export type ClipFragmentSelectorType = "PRODUCER_TIMESTAMP"|"SERVER_TIMESTAMP"|string;
  export interface ClipTimestampRange {
    /**
     * The starting timestamp in the range of timestamps for which to return fragments.  Only fragments that start exactly at or after StartTimestamp are included in the session. Fragments that start before StartTimestamp and continue past it aren't included in the session. If FragmentSelectorType is SERVER_TIMESTAMP, the StartTimestamp must be later than the stream head. 
     */
    StartTimestamp: Timestamp;
    /**
     * The end of the timestamp range for the requested media. This value must be within 24 hours of the specified StartTimestamp, and it must be later than the StartTimestamp value. If FragmentSelectorType for the request is SERVER_TIMESTAMP, this value must be in the past.  This value is inclusive. The EndTimestamp is compared to the (starting) timestamp of the fragment. Fragments that start before the EndTimestamp value and continue past it are included in the session. 
     */
    EndTimestamp: Timestamp;
  }
  export type ContainerFormat = "FRAGMENTED_MP4"|"MPEG_TS"|string;
  export type ContentType = string;
  export type DASHDisplayFragmentNumber = "ALWAYS"|"NEVER"|string;
  export type DASHDisplayFragmentTimestamp = "ALWAYS"|"NEVER"|string;
  export interface DASHFragmentSelector {
    /**
     * The source of the timestamps for the requested media. When FragmentSelectorType is set to PRODUCER_TIMESTAMP and GetDASHStreamingSessionURLInput$PlaybackMode is ON_DEMAND or LIVE_REPLAY, the first fragment ingested with a producer timestamp within the specified FragmentSelector$TimestampRange is included in the media playlist. In addition, the fragments with producer timestamps within the TimestampRange ingested immediately following the first fragment (up to the GetDASHStreamingSessionURLInput$MaxManifestFragmentResults value) are included.  Fragments that have duplicate producer timestamps are deduplicated. This means that if producers are producing a stream of fragments with producer timestamps that are approximately equal to the true clock time, the MPEG-DASH manifest will contain all of the fragments within the requested timestamp range. If some fragments are ingested within the same time range and very different points in time, only the oldest ingested collection of fragments are returned. When FragmentSelectorType is set to PRODUCER_TIMESTAMP and GetDASHStreamingSessionURLInput$PlaybackMode is LIVE, the producer timestamps are used in the MP4 fragments and for deduplication. But the most recently ingested fragments based on server timestamps are included in the MPEG-DASH manifest. This means that even if fragments ingested in the past have producer timestamps with values now, they are not included in the HLS media playlist. The default is SERVER_TIMESTAMP.
     */
    FragmentSelectorType?: DASHFragmentSelectorType;
    /**
     * The start and end of the timestamp range for the requested media. This value should not be present if PlaybackType is LIVE.
     */
    TimestampRange?: DASHTimestampRange;
  }
  export type DASHFragmentSelectorType = "PRODUCER_TIMESTAMP"|"SERVER_TIMESTAMP"|string;
  export type DASHMaxResults = number;
  export type DASHPlaybackMode = "LIVE"|"LIVE_REPLAY"|"ON_DEMAND"|string;
  export type DASHStreamingSessionURL = string;
  export interface DASHTimestampRange {
    /**
     * The start of the timestamp range for the requested media. If the DASHTimestampRange value is specified, the StartTimestamp value is required. Only fragments that start exactly at or after StartTimestamp are included in the session. Fragments that start before StartTimestamp and continue past it aren't included in the session. If FragmentSelectorType is SERVER_TIMESTAMP, the StartTimestamp must be later than the stream head. 
     */
    StartTimestamp?: Timestamp;
    /**
     * The end of the timestamp range for the requested media. This value must be within 24 hours of the specified StartTimestamp, and it must be later than the StartTimestamp value. If FragmentSelectorType for the request is SERVER_TIMESTAMP, this value must be in the past. The EndTimestamp value is required for ON_DEMAND mode, but optional for LIVE_REPLAY mode. If the EndTimestamp is not set for LIVE_REPLAY mode then the session will continue to include newly ingested fragments until the session expires.  This value is inclusive. The EndTimestamp is compared to the (starting) timestamp of the fragment. Fragments that start before the EndTimestamp value and continue past it are included in the session. 
     */
    EndTimestamp?: Timestamp;
  }
  export type Expires = number;
  export type Format = "JPEG"|"PNG"|string;
  export type FormatConfig = {[key: string]: FormatConfigValue};
  export type FormatConfigKey = "JPEGQuality"|string;
  export type FormatConfigValue = string;
  export interface Fragment {
    /**
     * The unique identifier of the fragment. This value monotonically increases based on the ingestion order.
     */
    FragmentNumber?: FragmentNumberString;
    /**
     * The total fragment size, including information about the fragment and contained media data.
     */
    FragmentSizeInBytes?: Long;
    /**
     * The timestamp from the producer corresponding to the fragment.
     */
    ProducerTimestamp?: Timestamp;
    /**
     * The timestamp from the Amazon Web Services server corresponding to the fragment.
     */
    ServerTimestamp?: Timestamp;
    /**
     * The playback duration or other time value associated with the fragment.
     */
    FragmentLengthInMilliseconds?: Long;
  }
  export type FragmentList = Fragment[];
  export type FragmentNumberList = FragmentNumberString[];
  export type FragmentNumberString = string;
  export interface FragmentSelector {
    /**
     * The origin of the timestamps to use (Server or Producer).
     */
    FragmentSelectorType: FragmentSelectorType;
    /**
     * The range of timestamps to return.
     */
    TimestampRange: TimestampRange;
  }
  export type FragmentSelectorType = "PRODUCER_TIMESTAMP"|"SERVER_TIMESTAMP"|string;
  export interface GetClipInput {
    /**
     * The name of the stream for which to retrieve the media clip.  You must specify either the StreamName or the StreamARN. 
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream for which to retrieve the media clip.  You must specify either the StreamName or the StreamARN. 
     */
    StreamARN?: ResourceARN;
    /**
     * The time range of the requested clip and the source of the timestamps.
     */
    ClipFragmentSelector: ClipFragmentSelector;
  }
  export interface GetClipOutput {
    /**
     * The content type of the media in the requested clip.
     */
    ContentType?: ContentType;
    /**
     * Traditional MP4 file that contains the media clip from the specified video stream. The output will contain the first 100 MB or the first 200 fragments from the specified start timestamp. For more information, see Kinesis Video Streams Limits. 
     */
    Payload?: Payload;
  }
  export interface GetDASHStreamingSessionURLInput {
    /**
     * The name of the stream for which to retrieve the MPEG-DASH manifest URL. You must specify either the StreamName or the StreamARN.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream for which to retrieve the MPEG-DASH manifest URL. You must specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
    /**
     * Whether to retrieve live, live replay, or archived, on-demand data. Features of the three types of sessions include the following:     LIVE : For sessions of this type, the MPEG-DASH manifest is continually updated with the latest fragments as they become available. We recommend that the media player retrieve a new manifest on a one-second interval. When this type of session is played in a media player, the user interface typically displays a "live" notification, with no scrubber control for choosing the position in the playback window to display.  In LIVE mode, the newest available fragments are included in an MPEG-DASH manifest, even if there is a gap between fragments (that is, if a fragment is missing). A gap like this might cause a media player to halt or cause a jump in playback. In this mode, fragments are not added to the MPEG-DASH manifest if they are older than the newest fragment in the playlist. If the missing fragment becomes available after a subsequent fragment is added to the manifest, the older fragment is not added, and the gap is not filled.      LIVE_REPLAY : For sessions of this type, the MPEG-DASH manifest is updated similarly to how it is updated for LIVE mode except that it starts by including fragments from a given start time. Instead of fragments being added as they are ingested, fragments are added as the duration of the next fragment elapses. For example, if the fragments in the session are two seconds long, then a new fragment is added to the manifest every two seconds. This mode is useful to be able to start playback from when an event is detected and continue live streaming media that has not yet been ingested as of the time of the session creation. This mode is also useful to stream previously archived media without being limited by the 1,000 fragment limit in the ON_DEMAND mode.      ON_DEMAND : For sessions of this type, the MPEG-DASH manifest contains all the fragments for the session, up to the number that is specified in MaxManifestFragmentResults. The manifest must be retrieved only once for each session. When this type of session is played in a media player, the user interface typically displays a scrubber control for choosing the position in the playback window to display.   In all playback modes, if FragmentSelectorType is PRODUCER_TIMESTAMP, and if there are multiple fragments with the same start timestamp, the fragment that has the larger fragment number (that is, the newer fragment) is included in the MPEG-DASH manifest. The other fragments are not included. Fragments that have different timestamps but have overlapping durations are still included in the MPEG-DASH manifest. This can lead to unexpected behavior in the media player. The default is LIVE.
     */
    PlaybackMode?: DASHPlaybackMode;
    /**
     * Per the MPEG-DASH specification, the wall-clock time of fragments in the manifest file can be derived using attributes in the manifest itself. However, typically, MPEG-DASH compatible media players do not properly handle gaps in the media timeline. Kinesis Video Streams adjusts the media timeline in the manifest file to enable playback of media with discontinuities. Therefore, the wall-clock time derived from the manifest file may be inaccurate. If DisplayFragmentTimestamp is set to ALWAYS, the accurate fragment timestamp is added to each S element in the manifest file with the attribute name “kvs:ts”. A custom MPEG-DASH media player is necessary to leverage this custom attribute. The default value is NEVER. When DASHFragmentSelector is SERVER_TIMESTAMP, the timestamps will be the server start timestamps. Similarly, when DASHFragmentSelector is PRODUCER_TIMESTAMP, the timestamps will be the producer start timestamps. 
     */
    DisplayFragmentTimestamp?: DASHDisplayFragmentTimestamp;
    /**
     * Fragments are identified in the manifest file based on their sequence number in the session. If DisplayFragmentNumber is set to ALWAYS, the Kinesis Video Streams fragment number is added to each S element in the manifest file with the attribute name “kvs:fn”. These fragment numbers can be used for logging or for use with other APIs (e.g. GetMedia and GetMediaForFragmentList). A custom MPEG-DASH media player is necessary to leverage these this custom attribute. The default value is NEVER.
     */
    DisplayFragmentNumber?: DASHDisplayFragmentNumber;
    /**
     * The time range of the requested fragment and the source of the timestamps. This parameter is required if PlaybackMode is ON_DEMAND or LIVE_REPLAY. This parameter is optional if PlaybackMode is LIVE. If PlaybackMode is LIVE, the FragmentSelectorType can be set, but the TimestampRange should not be set. If PlaybackMode is ON_DEMAND or LIVE_REPLAY, both FragmentSelectorType and TimestampRange must be set.
     */
    DASHFragmentSelector?: DASHFragmentSelector;
    /**
     * The time in seconds until the requested session expires. This value can be between 300 (5 minutes) and 43200 (12 hours). When a session expires, no new calls to GetDashManifest, GetMP4InitFragment, or GetMP4MediaFragment can be made for that session. The default is 300 (5 minutes).
     */
    Expires?: Expires;
    /**
     * The maximum number of fragments that are returned in the MPEG-DASH manifest. When the PlaybackMode is LIVE, the most recent fragments are returned up to this value. When the PlaybackMode is ON_DEMAND, the oldest fragments are returned, up to this maximum number. When there are a higher number of fragments available in a live MPEG-DASH manifest, video players often buffer content before starting playback. Increasing the buffer size increases the playback latency, but it decreases the likelihood that rebuffering will occur during playback. We recommend that a live MPEG-DASH manifest have a minimum of 3 fragments and a maximum of 10 fragments. The default is 5 fragments if PlaybackMode is LIVE or LIVE_REPLAY, and 1,000 if PlaybackMode is ON_DEMAND.  The maximum value of 1,000 fragments corresponds to more than 16 minutes of video on streams with 1-second fragments, and more than 2 1/2 hours of video on streams with 10-second fragments.
     */
    MaxManifestFragmentResults?: DASHMaxResults;
  }
  export interface GetDASHStreamingSessionURLOutput {
    /**
     * The URL (containing the session token) that a media player can use to retrieve the MPEG-DASH manifest.
     */
    DASHStreamingSessionURL?: DASHStreamingSessionURL;
  }
  export interface GetHLSStreamingSessionURLInput {
    /**
     * The name of the stream for which to retrieve the HLS master playlist URL. You must specify either the StreamName or the StreamARN.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream for which to retrieve the HLS master playlist URL. You must specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
    /**
     * Whether to retrieve live, live replay, or archived, on-demand data. Features of the three types of sessions include the following:     LIVE : For sessions of this type, the HLS media playlist is continually updated with the latest fragments as they become available. We recommend that the media player retrieve a new playlist on a one-second interval. When this type of session is played in a media player, the user interface typically displays a "live" notification, with no scrubber control for choosing the position in the playback window to display.  In LIVE mode, the newest available fragments are included in an HLS media playlist, even if there is a gap between fragments (that is, if a fragment is missing). A gap like this might cause a media player to halt or cause a jump in playback. In this mode, fragments are not added to the HLS media playlist if they are older than the newest fragment in the playlist. If the missing fragment becomes available after a subsequent fragment is added to the playlist, the older fragment is not added, and the gap is not filled.      LIVE_REPLAY : For sessions of this type, the HLS media playlist is updated similarly to how it is updated for LIVE mode except that it starts by including fragments from a given start time. Instead of fragments being added as they are ingested, fragments are added as the duration of the next fragment elapses. For example, if the fragments in the session are two seconds long, then a new fragment is added to the media playlist every two seconds. This mode is useful to be able to start playback from when an event is detected and continue live streaming media that has not yet been ingested as of the time of the session creation. This mode is also useful to stream previously archived media without being limited by the 1,000 fragment limit in the ON_DEMAND mode.      ON_DEMAND : For sessions of this type, the HLS media playlist contains all the fragments for the session, up to the number that is specified in MaxMediaPlaylistFragmentResults. The playlist must be retrieved only once for each session. When this type of session is played in a media player, the user interface typically displays a scrubber control for choosing the position in the playback window to display.   In all playback modes, if FragmentSelectorType is PRODUCER_TIMESTAMP, and if there are multiple fragments with the same start timestamp, the fragment that has the largest fragment number (that is, the newest fragment) is included in the HLS media playlist. The other fragments are not included. Fragments that have different timestamps but have overlapping durations are still included in the HLS media playlist. This can lead to unexpected behavior in the media player. The default is LIVE.
     */
    PlaybackMode?: HLSPlaybackMode;
    /**
     * The time range of the requested fragment and the source of the timestamps. This parameter is required if PlaybackMode is ON_DEMAND or LIVE_REPLAY. This parameter is optional if PlaybackMode is LIVE. If PlaybackMode is LIVE, the FragmentSelectorType can be set, but the TimestampRange should not be set. If PlaybackMode is ON_DEMAND or LIVE_REPLAY, both FragmentSelectorType and TimestampRange must be set.
     */
    HLSFragmentSelector?: HLSFragmentSelector;
    /**
     * Specifies which format should be used for packaging the media. Specifying the FRAGMENTED_MP4 container format packages the media into MP4 fragments (fMP4 or CMAF). This is the recommended packaging because there is minimal packaging overhead. The other container format option is MPEG_TS. HLS has supported MPEG TS chunks since it was released and is sometimes the only supported packaging on older HLS players. MPEG TS typically has a 5-25 percent packaging overhead. This means MPEG TS typically requires 5-25 percent more bandwidth and cost than fMP4. The default is FRAGMENTED_MP4.
     */
    ContainerFormat?: ContainerFormat;
    /**
     * Specifies when flags marking discontinuities between fragments are added to the media playlists. Media players typically build a timeline of media content to play, based on the timestamps of each fragment. This means that if there is any overlap or gap between fragments (as is typical if HLSFragmentSelector is set to SERVER_TIMESTAMP), the media player timeline will also have small gaps between fragments in some places, and will overwrite frames in other places. Gaps in the media player timeline can cause playback to stall and overlaps can cause playback to be jittery. When there are discontinuity flags between fragments, the media player is expected to reset the timeline, resulting in the next fragment being played immediately after the previous fragment.  The following modes are supported:    ALWAYS: a discontinuity marker is placed between every fragment in the HLS media playlist. It is recommended to use a value of ALWAYS if the fragment timestamps are not accurate.    NEVER: no discontinuity markers are placed anywhere. It is recommended to use a value of NEVER to ensure the media player timeline most accurately maps to the producer timestamps.     ON_DISCONTINUITY: a discontinuity marker is placed between fragments that have a gap or overlap of more than 50 milliseconds. For most playback scenarios, it is recommended to use a value of ON_DISCONTINUITY so that the media player timeline is only reset when there is a significant issue with the media timeline (e.g. a missing fragment).   The default is ALWAYS when HLSFragmentSelector is set to SERVER_TIMESTAMP, and NEVER when it is set to PRODUCER_TIMESTAMP.
     */
    DiscontinuityMode?: HLSDiscontinuityMode;
    /**
     * Specifies when the fragment start timestamps should be included in the HLS media playlist. Typically, media players report the playhead position as a time relative to the start of the first fragment in the playback session. However, when the start timestamps are included in the HLS media playlist, some media players might report the current playhead as an absolute time based on the fragment timestamps. This can be useful for creating a playback experience that shows viewers the wall-clock time of the media. The default is NEVER. When HLSFragmentSelector is SERVER_TIMESTAMP, the timestamps will be the server start timestamps. Similarly, when HLSFragmentSelector is PRODUCER_TIMESTAMP, the timestamps will be the producer start timestamps. 
     */
    DisplayFragmentTimestamp?: HLSDisplayFragmentTimestamp;
    /**
     * The time in seconds until the requested session expires. This value can be between 300 (5 minutes) and 43200 (12 hours). When a session expires, no new calls to GetHLSMasterPlaylist, GetHLSMediaPlaylist, GetMP4InitFragment, GetMP4MediaFragment, or GetTSFragment can be made for that session. The default is 300 (5 minutes).
     */
    Expires?: Expires;
    /**
     * The maximum number of fragments that are returned in the HLS media playlists. When the PlaybackMode is LIVE, the most recent fragments are returned up to this value. When the PlaybackMode is ON_DEMAND, the oldest fragments are returned, up to this maximum number. When there are a higher number of fragments available in a live HLS media playlist, video players often buffer content before starting playback. Increasing the buffer size increases the playback latency, but it decreases the likelihood that rebuffering will occur during playback. We recommend that a live HLS media playlist have a minimum of 3 fragments and a maximum of 10 fragments. The default is 5 fragments if PlaybackMode is LIVE or LIVE_REPLAY, and 1,000 if PlaybackMode is ON_DEMAND.  The maximum value of 5,000 fragments corresponds to more than 80 minutes of video on streams with 1-second fragments, and more than 13 hours of video on streams with 10-second fragments.
     */
    MaxMediaPlaylistFragmentResults?: HLSMaxResults;
  }
  export interface GetHLSStreamingSessionURLOutput {
    /**
     * The URL (containing the session token) that a media player can use to retrieve the HLS master playlist.
     */
    HLSStreamingSessionURL?: HLSStreamingSessionURL;
  }
  export interface GetImagesInput {
    /**
     * The name of the stream from which to retrieve the images. You must specify either the StreamName or the StreamARN.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream from which to retrieve the images. You must specify either the StreamName or the StreamARN.
     */
    StreamARN?: ResourceARN;
    /**
     * The origin of the Server or Producer timestamps to use to generate the images.
     */
    ImageSelectorType: ImageSelectorType;
    /**
     * The starting point from which the images should be generated. This StartTimestamp must be within an inclusive range of timestamps for an image to be returned.
     */
    StartTimestamp: Timestamp;
    /**
     * The end timestamp for the range of images to be generated. If the time range between StartTimestamp and EndTimestamp is more than 300 seconds above StartTimestamp, you will receive an IllegalArgumentException.
     */
    EndTimestamp: Timestamp;
    /**
     * The time interval in milliseconds (ms) at which the images need to be generated from the stream, with a default of 3000 ms. The minimum value that can be provided is 200 ms. If the timestamp range is less than the sampling interval, the Image from the startTimestamp will be returned if available.   The minimum value of 200 ms is a hard limit. 
     */
    SamplingInterval?: SamplingInterval;
    /**
     * The format that will be used to encode the image.
     */
    Format: Format;
    /**
     * The list of a key-value pair structure that contains extra parameters that can be applied when the image is generated. The FormatConfig key is the JPEGQuality, which indicates the JPEG quality key to be used to generate the image. The FormatConfig value accepts ints from 1 to 100. If the value is 1, the image will be generated with less quality and the best compression. If the value is 100, the image will be generated with the best quality and less compression. If no value is provided, the default value of the JPEGQuality key will be set to 80.
     */
    FormatConfig?: FormatConfig;
    /**
     * The width of the output image that is used in conjunction with the HeightPixels parameter. When both WidthPixels and HeightPixels parameters are provided, the image will be stretched to fit the specified aspect ratio. If only the WidthPixels parameter is provided or if only the HeightPixels is provided, a ValidationException will be thrown. If neither parameter is provided, the original image size from the stream will be returned.
     */
    WidthPixels?: WidthPixels;
    /**
     * The height of the output image that is used in conjunction with the WidthPixels parameter. When both HeightPixels and WidthPixels parameters are provided, the image will be stretched to fit the specified aspect ratio. If only the HeightPixels parameter is provided, its original aspect ratio will be used to calculate the WidthPixels ratio. If neither parameter is provided, the original image size will be returned.
     */
    HeightPixels?: HeightPixels;
    /**
     * The maximum number of images to be returned by the API.   The default limit is 25 images per API response. Providing a MaxResults greater than this value will result in a page size of 25. Any additional results will be paginated.  
     */
    MaxResults?: GetImagesMaxResults;
    /**
     * A token that specifies where to start paginating the next set of Images. This is the GetImages:NextToken from a previously truncated response.
     */
    NextToken?: NextToken;
  }
  export type GetImagesMaxResults = number;
  export interface GetImagesOutput {
    /**
     * The list of images generated from the video stream. If there is no media available for the given timestamp, the NO_MEDIA error will be listed in the output. If an error occurs while the image is being generated, the MEDIA_ERROR will be listed in the output as the cause of the missing image. 
     */
    Images?: Images;
    /**
     * The encrypted token that was used in the request to get more images.
     */
    NextToken?: NextToken;
  }
  export interface GetMediaForFragmentListInput {
    /**
     * The name of the stream from which to retrieve fragment media. Specify either this parameter or the StreamARN parameter.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream from which to retrieve fragment media. Specify either this parameter or the StreamName parameter.
     */
    StreamARN?: ResourceARN;
    /**
     * A list of the numbers of fragments for which to retrieve media. You retrieve these values with ListFragments.
     */
    Fragments: FragmentNumberList;
  }
  export interface GetMediaForFragmentListOutput {
    /**
     * The content type of the requested media.
     */
    ContentType?: ContentType;
    /**
     * The payload that Kinesis Video Streams returns is a sequence of chunks from the specified stream. For information about the chunks, see PutMedia. The chunks that Kinesis Video Streams returns in the GetMediaForFragmentList call also include the following additional Matroska (MKV) tags:    AWS_KINESISVIDEO_FRAGMENT_NUMBER - Fragment number returned in the chunk.   AWS_KINESISVIDEO_SERVER_SIDE_TIMESTAMP - Server-side timestamp of the fragment.   AWS_KINESISVIDEO_PRODUCER_SIDE_TIMESTAMP - Producer-side timestamp of the fragment.   The following tags will be included if an exception occurs:   AWS_KINESISVIDEO_FRAGMENT_NUMBER - The number of the fragment that threw the exception    AWS_KINESISVIDEO_EXCEPTION_ERROR_CODE - The integer code of the    AWS_KINESISVIDEO_EXCEPTION_MESSAGE - A text description of the exception   
     */
    Payload?: Payload;
  }
  export type HLSDiscontinuityMode = "ALWAYS"|"NEVER"|"ON_DISCONTINUITY"|string;
  export type HLSDisplayFragmentTimestamp = "ALWAYS"|"NEVER"|string;
  export interface HLSFragmentSelector {
    /**
     * The source of the timestamps for the requested media. When FragmentSelectorType is set to PRODUCER_TIMESTAMP and GetHLSStreamingSessionURLInput$PlaybackMode is ON_DEMAND or LIVE_REPLAY, the first fragment ingested with a producer timestamp within the specified FragmentSelector$TimestampRange is included in the media playlist. In addition, the fragments with producer timestamps within the TimestampRange ingested immediately following the first fragment (up to the GetHLSStreamingSessionURLInput$MaxMediaPlaylistFragmentResults value) are included.  Fragments that have duplicate producer timestamps are deduplicated. This means that if producers are producing a stream of fragments with producer timestamps that are approximately equal to the true clock time, the HLS media playlists will contain all of the fragments within the requested timestamp range. If some fragments are ingested within the same time range and very different points in time, only the oldest ingested collection of fragments are returned. When FragmentSelectorType is set to PRODUCER_TIMESTAMP and GetHLSStreamingSessionURLInput$PlaybackMode is LIVE, the producer timestamps are used in the MP4 fragments and for deduplication. But the most recently ingested fragments based on server timestamps are included in the HLS media playlist. This means that even if fragments ingested in the past have producer timestamps with values now, they are not included in the HLS media playlist. The default is SERVER_TIMESTAMP.
     */
    FragmentSelectorType?: HLSFragmentSelectorType;
    /**
     * The start and end of the timestamp range for the requested media. This value should not be present if PlaybackType is LIVE.
     */
    TimestampRange?: HLSTimestampRange;
  }
  export type HLSFragmentSelectorType = "PRODUCER_TIMESTAMP"|"SERVER_TIMESTAMP"|string;
  export type HLSMaxResults = number;
  export type HLSPlaybackMode = "LIVE"|"LIVE_REPLAY"|"ON_DEMAND"|string;
  export type HLSStreamingSessionURL = string;
  export interface HLSTimestampRange {
    /**
     * The start of the timestamp range for the requested media. If the HLSTimestampRange value is specified, the StartTimestamp value is required.  Only fragments that start exactly at or after StartTimestamp are included in the session. Fragments that start before StartTimestamp and continue past it aren't included in the session. If FragmentSelectorType is SERVER_TIMESTAMP, the StartTimestamp must be later than the stream head. 
     */
    StartTimestamp?: Timestamp;
    /**
     * The end of the timestamp range for the requested media. This value must be within 24 hours of the specified StartTimestamp, and it must be later than the StartTimestamp value. If FragmentSelectorType for the request is SERVER_TIMESTAMP, this value must be in the past. The EndTimestamp value is required for ON_DEMAND mode, but optional for LIVE_REPLAY mode. If the EndTimestamp is not set for LIVE_REPLAY mode then the session will continue to include newly ingested fragments until the session expires.  This value is inclusive. The EndTimestamp is compared to the (starting) timestamp of the fragment. Fragments that start before the EndTimestamp value and continue past it are included in the session. 
     */
    EndTimestamp?: Timestamp;
  }
  export type HeightPixels = number;
  export interface Image {
    /**
     * An attribute of the Image object that is used to extract an image from the video stream. This field is used to manage gaps on images or to better understand the pagination window.
     */
    TimeStamp?: Timestamp;
    /**
     * The error message shown when the image for the provided timestamp was not extracted due to a non-tryable error. An error will be returned if:    There is no media that exists for the specified Timestamp.     The media for the specified time does not allow an image to be extracted. In this case the media is audio only, or the incorrect media has been ingested.  
     */
    Error?: ImageError;
    /**
     * An attribute of the Image object that is Base64 encoded.
     */
    ImageContent?: ImageContent;
  }
  export type ImageContent = string;
  export type ImageError = "NO_MEDIA"|"MEDIA_ERROR"|string;
  export type ImageSelectorType = "PRODUCER_TIMESTAMP"|"SERVER_TIMESTAMP"|string;
  export type Images = Image[];
  export interface ListFragmentsInput {
    /**
     * The name of the stream from which to retrieve a fragment list. Specify either this parameter or the StreamARN parameter.
     */
    StreamName?: StreamName;
    /**
     * The Amazon Resource Name (ARN) of the stream from which to retrieve a fragment list. Specify either this parameter or the StreamName parameter.
     */
    StreamARN?: ResourceARN;
    /**
     * The total number of fragments to return. If the total number of fragments available is more than the value specified in max-results, then a ListFragmentsOutput$NextToken is provided in the output that you can use to resume pagination.
     */
    MaxResults?: ListFragmentsMaxResults;
    /**
     * A token to specify where to start paginating. This is the ListFragmentsOutput$NextToken from a previously truncated response.
     */
    NextToken?: NextToken;
    /**
     * Describes the timestamp range and timestamp origin for the range of fragments to return.
     */
    FragmentSelector?: FragmentSelector;
  }
  export type ListFragmentsMaxResults = number;
  export interface ListFragmentsOutput {
    /**
     * A list of archived Fragment objects from the stream that meet the selector criteria. Results are in no specific order, even across pages.
     */
    Fragments?: FragmentList;
    /**
     * If the returned list is truncated, the operation returns this token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export type Long = number;
  export type NextToken = string;
  export type Payload = Buffer|Uint8Array|Blob|string|Readable;
  export type ResourceARN = string;
  export type SamplingInterval = number;
  export type StreamName = string;
  export type Timestamp = Date;
  export interface TimestampRange {
    /**
     * The starting timestamp in the range of timestamps for which to return fragments.
     */
    StartTimestamp: Timestamp;
    /**
     * The ending timestamp in the range of timestamps for which to return fragments.
     */
    EndTimestamp: Timestamp;
  }
  export type WidthPixels = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-09-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the KinesisVideoArchivedMedia client.
   */
  export import Types = KinesisVideoArchivedMedia;
}
export = KinesisVideoArchivedMedia;
