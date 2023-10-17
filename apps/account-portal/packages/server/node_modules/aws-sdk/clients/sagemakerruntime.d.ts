import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {EventStream} from '../lib/event-stream/event-stream';
interface Blob {}
declare class SageMakerRuntime extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SageMakerRuntime.Types.ClientConfiguration)
  config: Config & SageMakerRuntime.Types.ClientConfiguration;
  /**
   * After you deploy a model into production using Amazon SageMaker hosting services, your client applications use this API to get inferences from the model hosted at the specified endpoint.  For an overview of Amazon SageMaker, see How It Works.  Amazon SageMaker strips all POST headers except those supported by the API. Amazon SageMaker might add additional headers. You should not rely on the behavior of headers outside those enumerated in the request syntax.  Calls to InvokeEndpoint are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the Amazon S3 API Reference. A customer's model containers must respond to requests within 60 seconds. The model itself can have a maximum processing time of 60 seconds before responding to invocations. If your model is going to take 50-60 seconds of processing time, the SDK socket timeout should be set to be 70 seconds.  Endpoints are scoped to an individual account, and are not public. The URL does not contain the account ID, but Amazon SageMaker determines the account ID from the authentication token that is supplied by the caller. 
   */
  invokeEndpoint(params: SageMakerRuntime.Types.InvokeEndpointInput, callback?: (err: AWSError, data: SageMakerRuntime.Types.InvokeEndpointOutput) => void): Request<SageMakerRuntime.Types.InvokeEndpointOutput, AWSError>;
  /**
   * After you deploy a model into production using Amazon SageMaker hosting services, your client applications use this API to get inferences from the model hosted at the specified endpoint.  For an overview of Amazon SageMaker, see How It Works.  Amazon SageMaker strips all POST headers except those supported by the API. Amazon SageMaker might add additional headers. You should not rely on the behavior of headers outside those enumerated in the request syntax.  Calls to InvokeEndpoint are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the Amazon S3 API Reference. A customer's model containers must respond to requests within 60 seconds. The model itself can have a maximum processing time of 60 seconds before responding to invocations. If your model is going to take 50-60 seconds of processing time, the SDK socket timeout should be set to be 70 seconds.  Endpoints are scoped to an individual account, and are not public. The URL does not contain the account ID, but Amazon SageMaker determines the account ID from the authentication token that is supplied by the caller. 
   */
  invokeEndpoint(callback?: (err: AWSError, data: SageMakerRuntime.Types.InvokeEndpointOutput) => void): Request<SageMakerRuntime.Types.InvokeEndpointOutput, AWSError>;
  /**
   * After you deploy a model into production using Amazon SageMaker hosting services, your client applications use this API to get inferences from the model hosted at the specified endpoint in an asynchronous manner. Inference requests sent to this API are enqueued for asynchronous processing. The processing of the inference request may or may not complete before you receive a response from this API. The response from this API will not contain the result of the inference request but contain information about where you can locate it. Amazon SageMaker strips all POST headers except those supported by the API. Amazon SageMaker might add additional headers. You should not rely on the behavior of headers outside those enumerated in the request syntax.  Calls to InvokeEndpointAsync are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the Amazon S3 API Reference.
   */
  invokeEndpointAsync(params: SageMakerRuntime.Types.InvokeEndpointAsyncInput, callback?: (err: AWSError, data: SageMakerRuntime.Types.InvokeEndpointAsyncOutput) => void): Request<SageMakerRuntime.Types.InvokeEndpointAsyncOutput, AWSError>;
  /**
   * After you deploy a model into production using Amazon SageMaker hosting services, your client applications use this API to get inferences from the model hosted at the specified endpoint in an asynchronous manner. Inference requests sent to this API are enqueued for asynchronous processing. The processing of the inference request may or may not complete before you receive a response from this API. The response from this API will not contain the result of the inference request but contain information about where you can locate it. Amazon SageMaker strips all POST headers except those supported by the API. Amazon SageMaker might add additional headers. You should not rely on the behavior of headers outside those enumerated in the request syntax.  Calls to InvokeEndpointAsync are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the Amazon S3 API Reference.
   */
  invokeEndpointAsync(callback?: (err: AWSError, data: SageMakerRuntime.Types.InvokeEndpointAsyncOutput) => void): Request<SageMakerRuntime.Types.InvokeEndpointAsyncOutput, AWSError>;
  /**
   * Invokes a model at the specified endpoint to return the inference response as a stream. The inference stream provides the response payload incrementally as a series of parts. Before you can get an inference stream, you must have access to a model that's deployed using Amazon SageMaker hosting services, and the container for that model must support inference streaming. For more information that can help you use this API, see the following sections in the Amazon SageMaker Developer Guide:   For information about how to add streaming support to a model, see How Containers Serve Requests.   For information about how to process the streaming response, see Invoke real-time endpoints.   Amazon SageMaker strips all POST headers except those supported by the API. Amazon SageMaker might add additional headers. You should not rely on the behavior of headers outside those enumerated in the request syntax.  Calls to InvokeEndpointWithResponseStream are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the Amazon S3 API Reference.
   */
  invokeEndpointWithResponseStream(params: SageMakerRuntime.Types.InvokeEndpointWithResponseStreamInput, callback?: (err: AWSError, data: SageMakerRuntime.Types.InvokeEndpointWithResponseStreamOutput) => void): Request<SageMakerRuntime.Types.InvokeEndpointWithResponseStreamOutput, AWSError>;
  /**
   * Invokes a model at the specified endpoint to return the inference response as a stream. The inference stream provides the response payload incrementally as a series of parts. Before you can get an inference stream, you must have access to a model that's deployed using Amazon SageMaker hosting services, and the container for that model must support inference streaming. For more information that can help you use this API, see the following sections in the Amazon SageMaker Developer Guide:   For information about how to add streaming support to a model, see How Containers Serve Requests.   For information about how to process the streaming response, see Invoke real-time endpoints.   Amazon SageMaker strips all POST headers except those supported by the API. Amazon SageMaker might add additional headers. You should not rely on the behavior of headers outside those enumerated in the request syntax.  Calls to InvokeEndpointWithResponseStream are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the Amazon S3 API Reference.
   */
  invokeEndpointWithResponseStream(callback?: (err: AWSError, data: SageMakerRuntime.Types.InvokeEndpointWithResponseStreamOutput) => void): Request<SageMakerRuntime.Types.InvokeEndpointWithResponseStreamOutput, AWSError>;
}
declare namespace SageMakerRuntime {
  export type BodyBlob = Buffer|Uint8Array|Blob|string;
  export type CustomAttributesHeader = string;
  export type EnableExplanationsHeader = string;
  export type EndpointName = string;
  export type ErrorCode = string;
  export type Header = string;
  export type InferenceId = string;
  export type InputLocationHeader = string;
  export interface InternalStreamFailure {
    Message?: Message;
  }
  export type InvocationTimeoutSecondsHeader = number;
  export interface InvokeEndpointAsyncInput {
    /**
     * The name of the endpoint that you specified when you created the endpoint using the CreateEndpoint API.
     */
    EndpointName: EndpointName;
    /**
     * The MIME type of the input data in the request body.
     */
    ContentType?: Header;
    /**
     * The desired MIME type of the inference response from the model container.
     */
    Accept?: Header;
    /**
     * Provides additional information about a request for an inference submitted to a model hosted at an Amazon SageMaker endpoint. The information is an opaque value that is forwarded verbatim. You could use this value, for example, to provide an ID that you can use to track a request or to provide other metadata that a service endpoint was programmed to process. The value must consist of no more than 1024 visible US-ASCII characters as specified in Section 3.3.6. Field Value Components of the Hypertext Transfer Protocol (HTTP/1.1).  The code in your model is responsible for setting or updating any custom attributes in the response. If your code does not set this value in the response, an empty value is returned. For example, if a custom attribute represents the trace ID, your model can prepend the custom attribute with Trace ID: in your post-processing function.  This feature is currently supported in the Amazon Web Services SDKs but not in the Amazon SageMaker Python SDK. 
     */
    CustomAttributes?: CustomAttributesHeader;
    /**
     * The identifier for the inference request. Amazon SageMaker will generate an identifier for you if none is specified. 
     */
    InferenceId?: InferenceId;
    /**
     * The Amazon S3 URI where the inference request payload is stored.
     */
    InputLocation: InputLocationHeader;
    /**
     * Maximum age in seconds a request can be in the queue before it is marked as expired. The default is 6 hours, or 21,600 seconds.
     */
    RequestTTLSeconds?: RequestTTLSecondsHeader;
    /**
     * Maximum amount of time in seconds a request can be processed before it is marked as expired. The default is 15 minutes, or 900 seconds.
     */
    InvocationTimeoutSeconds?: InvocationTimeoutSecondsHeader;
  }
  export interface InvokeEndpointAsyncOutput {
    /**
     * Identifier for an inference request. This will be the same as the InferenceId specified in the input. Amazon SageMaker will generate an identifier for you if you do not specify one.
     */
    InferenceId?: Header;
    /**
     * The Amazon S3 URI where the inference response payload is stored.
     */
    OutputLocation?: Header;
    /**
     * The Amazon S3 URI where the inference failure response payload is stored.
     */
    FailureLocation?: Header;
  }
  export interface InvokeEndpointInput {
    /**
     * The name of the endpoint that you specified when you created the endpoint using the CreateEndpoint API.
     */
    EndpointName: EndpointName;
    /**
     * Provides input data, in the format specified in the ContentType request header. Amazon SageMaker passes all of the data in the body to the model.  For information about the format of the request body, see Common Data Formats-Inference.
     */
    Body: BodyBlob;
    /**
     * The MIME type of the input data in the request body.
     */
    ContentType?: Header;
    /**
     * The desired MIME type of the inference response from the model container.
     */
    Accept?: Header;
    /**
     * Provides additional information about a request for an inference submitted to a model hosted at an Amazon SageMaker endpoint. The information is an opaque value that is forwarded verbatim. You could use this value, for example, to provide an ID that you can use to track a request or to provide other metadata that a service endpoint was programmed to process. The value must consist of no more than 1024 visible US-ASCII characters as specified in Section 3.3.6. Field Value Components of the Hypertext Transfer Protocol (HTTP/1.1).  The code in your model is responsible for setting or updating any custom attributes in the response. If your code does not set this value in the response, an empty value is returned. For example, if a custom attribute represents the trace ID, your model can prepend the custom attribute with Trace ID: in your post-processing function.  This feature is currently supported in the Amazon Web Services SDKs but not in the Amazon SageMaker Python SDK. 
     */
    CustomAttributes?: CustomAttributesHeader;
    /**
     * The model to request for inference when invoking a multi-model endpoint.
     */
    TargetModel?: TargetModelHeader;
    /**
     * Specify the production variant to send the inference request to when invoking an endpoint that is running two or more variants. Note that this parameter overrides the default behavior for the endpoint, which is to distribute the invocation traffic based on the variant weights. For information about how to use variant targeting to perform a/b testing, see Test models in production 
     */
    TargetVariant?: TargetVariantHeader;
    /**
     * If the endpoint hosts multiple containers and is configured to use direct invocation, this parameter specifies the host name of the container to invoke.
     */
    TargetContainerHostname?: TargetContainerHostnameHeader;
    /**
     * If you provide a value, it is added to the captured data when you enable data capture on the endpoint. For information about data capture, see Capture Data.
     */
    InferenceId?: InferenceId;
    /**
     * An optional JMESPath expression used to override the EnableExplanations parameter of the ClarifyExplainerConfig API. See the EnableExplanations section in the developer guide for more information. 
     */
    EnableExplanations?: EnableExplanationsHeader;
  }
  export interface InvokeEndpointOutput {
    /**
     * Includes the inference provided by the model.  For information about the format of the response body, see Common Data Formats-Inference. If the explainer is activated, the body includes the explanations provided by the model. For more information, see the Response section under Invoke the Endpoint in the Developer Guide.
     */
    Body: BodyBlob;
    /**
     * The MIME type of the inference returned from the model container.
     */
    ContentType?: Header;
    /**
     * Identifies the production variant that was invoked.
     */
    InvokedProductionVariant?: Header;
    /**
     * Provides additional information in the response about the inference returned by a model hosted at an Amazon SageMaker endpoint. The information is an opaque value that is forwarded verbatim. You could use this value, for example, to return an ID received in the CustomAttributes header of a request or other metadata that a service endpoint was programmed to produce. The value must consist of no more than 1024 visible US-ASCII characters as specified in Section 3.3.6. Field Value Components of the Hypertext Transfer Protocol (HTTP/1.1). If the customer wants the custom attribute returned, the model must set the custom attribute to be included on the way back.  The code in your model is responsible for setting or updating any custom attributes in the response. If your code does not set this value in the response, an empty value is returned. For example, if a custom attribute represents the trace ID, your model can prepend the custom attribute with Trace ID: in your post-processing function. This feature is currently supported in the Amazon Web Services SDKs but not in the Amazon SageMaker Python SDK.
     */
    CustomAttributes?: CustomAttributesHeader;
  }
  export interface InvokeEndpointWithResponseStreamInput {
    /**
     * The name of the endpoint that you specified when you created the endpoint using the CreateEndpoint API.
     */
    EndpointName: EndpointName;
    /**
     * Provides input data, in the format specified in the ContentType request header. Amazon SageMaker passes all of the data in the body to the model.  For information about the format of the request body, see Common Data Formats-Inference.
     */
    Body: BodyBlob;
    /**
     * The MIME type of the input data in the request body.
     */
    ContentType?: Header;
    /**
     * The desired MIME type of the inference response from the model container.
     */
    Accept?: Header;
    /**
     * Provides additional information about a request for an inference submitted to a model hosted at an Amazon SageMaker endpoint. The information is an opaque value that is forwarded verbatim. You could use this value, for example, to provide an ID that you can use to track a request or to provide other metadata that a service endpoint was programmed to process. The value must consist of no more than 1024 visible US-ASCII characters as specified in Section 3.3.6. Field Value Components of the Hypertext Transfer Protocol (HTTP/1.1).  The code in your model is responsible for setting or updating any custom attributes in the response. If your code does not set this value in the response, an empty value is returned. For example, if a custom attribute represents the trace ID, your model can prepend the custom attribute with Trace ID: in your post-processing function.  This feature is currently supported in the Amazon Web Services SDKs but not in the Amazon SageMaker Python SDK. 
     */
    CustomAttributes?: CustomAttributesHeader;
    /**
     * Specify the production variant to send the inference request to when invoking an endpoint that is running two or more variants. Note that this parameter overrides the default behavior for the endpoint, which is to distribute the invocation traffic based on the variant weights. For information about how to use variant targeting to perform a/b testing, see Test models in production 
     */
    TargetVariant?: TargetVariantHeader;
    /**
     * If the endpoint hosts multiple containers and is configured to use direct invocation, this parameter specifies the host name of the container to invoke.
     */
    TargetContainerHostname?: TargetContainerHostnameHeader;
    /**
     * An identifier that you assign to your request.
     */
    InferenceId?: InferenceId;
  }
  export interface InvokeEndpointWithResponseStreamOutput {
    Body: ResponseStream;
    /**
     * The MIME type of the inference returned from the model container.
     */
    ContentType?: Header;
    /**
     * Identifies the production variant that was invoked.
     */
    InvokedProductionVariant?: Header;
    /**
     * Provides additional information in the response about the inference returned by a model hosted at an Amazon SageMaker endpoint. The information is an opaque value that is forwarded verbatim. You could use this value, for example, to return an ID received in the CustomAttributes header of a request or other metadata that a service endpoint was programmed to produce. The value must consist of no more than 1024 visible US-ASCII characters as specified in Section 3.3.6. Field Value Components of the Hypertext Transfer Protocol (HTTP/1.1). If the customer wants the custom attribute returned, the model must set the custom attribute to be included on the way back.  The code in your model is responsible for setting or updating any custom attributes in the response. If your code does not set this value in the response, an empty value is returned. For example, if a custom attribute represents the trace ID, your model can prepend the custom attribute with Trace ID: in your post-processing function. This feature is currently supported in the Amazon Web Services SDKs but not in the Amazon SageMaker Python SDK.
     */
    CustomAttributes?: CustomAttributesHeader;
  }
  export type Message = string;
  export interface ModelStreamError {
    Message?: Message;
    /**
     * This error can have the following error codes:  ModelInvocationTimeExceeded  The model failed to finish sending the response within the timeout period allowed by Amazon SageMaker.  StreamBroken  The Transmission Control Protocol (TCP) connection between the client and the model was reset or closed.  
     */
    ErrorCode?: ErrorCode;
  }
  export type PartBlob = Buffer|Uint8Array|Blob|string;
  export interface PayloadPart {
    /**
     * A blob that contains part of the response for your streaming inference request.
     */
    Bytes?: Buffer;
  }
  export type RequestTTLSecondsHeader = number;
  export type ResponseStream = EventStream<{PayloadPart?:PayloadPart,ModelStreamError?:ModelStreamError,InternalStreamFailure?:InternalStreamFailure}>;
  export type TargetContainerHostnameHeader = string;
  export type TargetModelHeader = string;
  export type TargetVariantHeader = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-05-13"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SageMakerRuntime client.
   */
  export import Types = SageMakerRuntime;
}
export = SageMakerRuntime;
