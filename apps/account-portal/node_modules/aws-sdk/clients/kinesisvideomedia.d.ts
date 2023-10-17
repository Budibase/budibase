import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class KinesisVideoMedia extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: KinesisVideoMedia.Types.ClientConfiguration)
  config: Config & KinesisVideoMedia.Types.ClientConfiguration;
  /**
   *  Use this API to retrieve media content from a Kinesis video stream. In the request, you identify the stream name or stream Amazon Resource Name (ARN), and the starting chunk. Kinesis Video Streams then returns a stream of chunks in order by fragment number.  You must first call the GetDataEndpoint API to get an endpoint. Then send the GetMedia requests to this endpoint using the --endpoint-url parameter.   When you put media data (fragments) on a stream, Kinesis Video Streams stores each incoming fragment and related metadata in what is called a "chunk." For more information, see PutMedia. The GetMedia API returns a stream of these chunks starting from the chunk that you specify in the request.  The following limits apply when using the GetMedia API:   A client can call GetMedia up to five times per second per stream.    Kinesis Video Streams sends media data at a rate of up to 25 megabytes per second (or 200 megabits per second) during a GetMedia session.     If an error is thrown after invoking a Kinesis Video Streams media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to AWS, the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  getMedia(params: KinesisVideoMedia.Types.GetMediaInput, callback?: (err: AWSError, data: KinesisVideoMedia.Types.GetMediaOutput) => void): Request<KinesisVideoMedia.Types.GetMediaOutput, AWSError>;
  /**
   *  Use this API to retrieve media content from a Kinesis video stream. In the request, you identify the stream name or stream Amazon Resource Name (ARN), and the starting chunk. Kinesis Video Streams then returns a stream of chunks in order by fragment number.  You must first call the GetDataEndpoint API to get an endpoint. Then send the GetMedia requests to this endpoint using the --endpoint-url parameter.   When you put media data (fragments) on a stream, Kinesis Video Streams stores each incoming fragment and related metadata in what is called a "chunk." For more information, see PutMedia. The GetMedia API returns a stream of these chunks starting from the chunk that you specify in the request.  The following limits apply when using the GetMedia API:   A client can call GetMedia up to five times per second per stream.    Kinesis Video Streams sends media data at a rate of up to 25 megabytes per second (or 200 megabits per second) during a GetMedia session.     If an error is thrown after invoking a Kinesis Video Streams media API, in addition to the HTTP status code and the response body, it includes the following pieces of information:     x-amz-ErrorType HTTP header – contains a more specific error type in addition to what the HTTP status code provides.     x-amz-RequestId HTTP header – if you want to report an issue to AWS, the support team can better diagnose the problem if given the Request Id.   Both the HTTP status code and the ErrorType header can be utilized to make programmatic decisions about whether errors are retry-able and under what conditions, as well as provide information on what actions the client programmer might need to take in order to successfully try again. For more information, see the Errors section at the bottom of this topic, as well as Common Errors.  
   */
  getMedia(callback?: (err: AWSError, data: KinesisVideoMedia.Types.GetMediaOutput) => void): Request<KinesisVideoMedia.Types.GetMediaOutput, AWSError>;
}
declare namespace KinesisVideoMedia {
  export type ContentType = string;
  export type ContinuationToken = string;
  export type FragmentNumberString = string;
  export interface GetMediaInput {
    /**
     * The Kinesis video stream name from where you want to get the media content. If you don't specify the streamName, you must specify the streamARN.
     */
    StreamName?: StreamName;
    /**
     * The ARN of the stream from where you want to get the media content. If you don't specify the streamARN, you must specify the streamName.
     */
    StreamARN?: ResourceARN;
    /**
     * Identifies the starting chunk to get from the specified stream. 
     */
    StartSelector: StartSelector;
  }
  export interface GetMediaOutput {
    /**
     * The content type of the requested media.
     */
    ContentType?: ContentType;
    /**
     *  The payload Kinesis Video Streams returns is a sequence of chunks from the specified stream. For information about the chunks, see . The chunks that Kinesis Video Streams returns in the GetMedia call also include the following additional Matroska (MKV) tags:    AWS_KINESISVIDEO_CONTINUATION_TOKEN (UTF-8 string) - In the event your GetMedia call terminates, you can use this continuation token in your next request to get the next chunk where the last request terminated.   AWS_KINESISVIDEO_MILLIS_BEHIND_NOW (UTF-8 string) - Client applications can use this tag value to determine how far behind the chunk returned in the response is from the latest chunk on the stream.    AWS_KINESISVIDEO_FRAGMENT_NUMBER - Fragment number returned in the chunk.   AWS_KINESISVIDEO_SERVER_TIMESTAMP - Server timestamp of the fragment.   AWS_KINESISVIDEO_PRODUCER_TIMESTAMP - Producer timestamp of the fragment.   The following tags will be present if an error occurs:   AWS_KINESISVIDEO_ERROR_CODE - String description of an error that caused GetMedia to stop.   AWS_KINESISVIDEO_ERROR_ID: Integer code of the error.   The error codes are as follows:   3002 - Error writing to the stream   4000 - Requested fragment is not found   4500 - Access denied for the stream's KMS key   4501 - Stream's KMS key is disabled   4502 - Validation error on the stream's KMS key   4503 - KMS key specified in the stream is unavailable   4504 - Invalid usage of the KMS key specified in the stream   4505 - Invalid state of the KMS key specified in the stream   4506 - Unable to find the KMS key specified in the stream   5000 - Internal error  
     */
    Payload?: Payload;
  }
  export type Payload = Buffer|Uint8Array|Blob|string|Readable;
  export type ResourceARN = string;
  export interface StartSelector {
    /**
     * Identifies the fragment on the Kinesis video stream where you want to start getting the data from.   NOW - Start with the latest chunk on the stream.   EARLIEST - Start with earliest available chunk on the stream.   FRAGMENT_NUMBER - Start with the chunk after a specific fragment. You must also specify the AfterFragmentNumber parameter.   PRODUCER_TIMESTAMP or SERVER_TIMESTAMP - Start with the chunk containing a fragment with the specified producer or server timestamp. You specify the timestamp by adding StartTimestamp.    CONTINUATION_TOKEN - Read using the specified continuation token.     If you choose the NOW, EARLIEST, or CONTINUATION_TOKEN as the startSelectorType, you don't provide any additional information in the startSelector. 
     */
    StartSelectorType: StartSelectorType;
    /**
     * Specifies the fragment number from where you want the GetMedia API to start returning the fragments. 
     */
    AfterFragmentNumber?: FragmentNumberString;
    /**
     * A timestamp value. This value is required if you choose the PRODUCER_TIMESTAMP or the SERVER_TIMESTAMP as the startSelectorType. The GetMedia API then starts with the chunk containing the fragment that has the specified timestamp.
     */
    StartTimestamp?: Timestamp;
    /**
     * Continuation token that Kinesis Video Streams returned in the previous GetMedia response. The GetMedia API then starts with the chunk identified by the continuation token.
     */
    ContinuationToken?: ContinuationToken;
  }
  export type StartSelectorType = "FRAGMENT_NUMBER"|"SERVER_TIMESTAMP"|"PRODUCER_TIMESTAMP"|"NOW"|"EARLIEST"|"CONTINUATION_TOKEN"|string;
  export type StreamName = string;
  export type Timestamp = Date;
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
   * Contains interfaces for use with the KinesisVideoMedia client.
   */
  export import Types = KinesisVideoMedia;
}
export = KinesisVideoMedia;
