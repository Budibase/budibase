import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {EventStream} from '../lib/event-stream/event-stream';
interface Blob {}
declare class BedrockRuntime extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: BedrockRuntime.Types.ClientConfiguration)
  config: Config & BedrockRuntime.Types.ClientConfiguration;
  /**
   * Invokes the specified Bedrock model to run inference using the input provided in the request body. You use InvokeModel to run inference for text models, image models, and embedding models. For more information, see Run inference in the Bedrock User Guide. For example requests, see Examples (after the Errors section).
   */
  invokeModel(params: BedrockRuntime.Types.InvokeModelRequest, callback?: (err: AWSError, data: BedrockRuntime.Types.InvokeModelResponse) => void): Request<BedrockRuntime.Types.InvokeModelResponse, AWSError>;
  /**
   * Invokes the specified Bedrock model to run inference using the input provided in the request body. You use InvokeModel to run inference for text models, image models, and embedding models. For more information, see Run inference in the Bedrock User Guide. For example requests, see Examples (after the Errors section).
   */
  invokeModel(callback?: (err: AWSError, data: BedrockRuntime.Types.InvokeModelResponse) => void): Request<BedrockRuntime.Types.InvokeModelResponse, AWSError>;
  /**
   * Invoke the specified Bedrock model to run inference using the input provided. Return the response in a stream. For more information, see Run inference in the Bedrock User Guide. For an example request and response, see Examples (after the Errors section).
   */
  invokeModelWithResponseStream(params: BedrockRuntime.Types.InvokeModelWithResponseStreamRequest, callback?: (err: AWSError, data: BedrockRuntime.Types.InvokeModelWithResponseStreamResponse) => void): Request<BedrockRuntime.Types.InvokeModelWithResponseStreamResponse, AWSError>;
  /**
   * Invoke the specified Bedrock model to run inference using the input provided. Return the response in a stream. For more information, see Run inference in the Bedrock User Guide. For an example request and response, see Examples (after the Errors section).
   */
  invokeModelWithResponseStream(callback?: (err: AWSError, data: BedrockRuntime.Types.InvokeModelWithResponseStreamResponse) => void): Request<BedrockRuntime.Types.InvokeModelWithResponseStreamResponse, AWSError>;
}
declare namespace BedrockRuntime {
  export type Body = Buffer|Uint8Array|Blob|string;
  export interface InternalServerException {
    message?: NonBlankString;
  }
  export type InvokeModelIdentifier = string;
  export interface InvokeModelRequest {
    /**
     * The desired MIME type of the inference body in the response. The default value is application/json.
     */
    accept?: MimeType;
    /**
     * Input data in the format specified in the content-type request header. To see the format and content of this field for different models, refer to Inference parameters.
     */
    body: Body;
    /**
     * The MIME type of the input data in the request. The default value is application/json.
     */
    contentType?: MimeType;
    /**
     * Identifier of the model. 
     */
    modelId: InvokeModelIdentifier;
  }
  export interface InvokeModelResponse {
    /**
     * Inference response from the model in the format specified in the content-type header field. To see the format and content of this field for different models, refer to Inference parameters.
     */
    body: Body;
    /**
     * The MIME type of the inference result.
     */
    contentType: MimeType;
  }
  export interface InvokeModelWithResponseStreamRequest {
    /**
     * The desired MIME type of the inference body in the response. The default value is application/json.
     */
    accept?: MimeType;
    /**
     * Inference input in the format specified by the content-type. To see the format and content of this field for different models, refer to Inference parameters.
     */
    body: Body;
    /**
     * The MIME type of the input data in the request. The default value is application/json.
     */
    contentType?: MimeType;
    /**
     * Id of the model to invoke using the streaming request.
     */
    modelId: InvokeModelIdentifier;
  }
  export interface InvokeModelWithResponseStreamResponse {
    /**
     * Inference response from the model in the format specified by Content-Type. To see the format and content of this field for different models, refer to Inference parameters.
     */
    body: ResponseStream;
    /**
     * The MIME type of the inference result.
     */
    contentType: MimeType;
  }
  export type MimeType = string;
  export interface ModelStreamErrorException {
    message?: NonBlankString;
    /**
     * The original message.
     */
    originalMessage?: NonBlankString;
    /**
     * The original status code.
     */
    originalStatusCode?: StatusCode;
  }
  export interface ModelTimeoutException {
    message?: NonBlankString;
  }
  export type NonBlankString = string;
  export type PartBody = Buffer|Uint8Array|Blob|string;
  export interface PayloadPart {
    /**
     * Base64-encoded bytes of payload data.
     */
    bytes?: PartBody;
  }
  export type ResponseStream = EventStream<{chunk?:PayloadPart,internalServerException?:InternalServerException,modelStreamErrorException?:ModelStreamErrorException,modelTimeoutException?:ModelTimeoutException,throttlingException?:ThrottlingException,validationException?:ValidationException}>;
  export type StatusCode = number;
  export interface ThrottlingException {
    message?: NonBlankString;
  }
  export interface ValidationException {
    message?: NonBlankString;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2023-09-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the BedrockRuntime client.
   */
  export import Types = BedrockRuntime;
}
export = BedrockRuntime;
