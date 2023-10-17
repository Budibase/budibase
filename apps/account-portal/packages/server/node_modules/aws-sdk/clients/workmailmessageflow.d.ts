import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class WorkMailMessageFlow extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: WorkMailMessageFlow.Types.ClientConfiguration)
  config: Config & WorkMailMessageFlow.Types.ClientConfiguration;
  /**
   * Retrieves the raw content of an in-transit email message, in MIME format.
   */
  getRawMessageContent(params: WorkMailMessageFlow.Types.GetRawMessageContentRequest, callback?: (err: AWSError, data: WorkMailMessageFlow.Types.GetRawMessageContentResponse) => void): Request<WorkMailMessageFlow.Types.GetRawMessageContentResponse, AWSError>;
  /**
   * Retrieves the raw content of an in-transit email message, in MIME format.
   */
  getRawMessageContent(callback?: (err: AWSError, data: WorkMailMessageFlow.Types.GetRawMessageContentResponse) => void): Request<WorkMailMessageFlow.Types.GetRawMessageContentResponse, AWSError>;
  /**
   * Updates the raw content of an in-transit email message, in MIME format. This example describes how to update in-transit email message. For more information and examples for using this API, see  Updating message content with AWS Lambda.  Updates to an in-transit message only appear when you call PutRawMessageContent from an AWS Lambda function configured with a synchronous  Run Lambda rule. If you call PutRawMessageContent on a delivered or sent message, the message remains unchanged, even though GetRawMessageContent returns an updated message.  
   */
  putRawMessageContent(params: WorkMailMessageFlow.Types.PutRawMessageContentRequest, callback?: (err: AWSError, data: WorkMailMessageFlow.Types.PutRawMessageContentResponse) => void): Request<WorkMailMessageFlow.Types.PutRawMessageContentResponse, AWSError>;
  /**
   * Updates the raw content of an in-transit email message, in MIME format. This example describes how to update in-transit email message. For more information and examples for using this API, see  Updating message content with AWS Lambda.  Updates to an in-transit message only appear when you call PutRawMessageContent from an AWS Lambda function configured with a synchronous  Run Lambda rule. If you call PutRawMessageContent on a delivered or sent message, the message remains unchanged, even though GetRawMessageContent returns an updated message.  
   */
  putRawMessageContent(callback?: (err: AWSError, data: WorkMailMessageFlow.Types.PutRawMessageContentResponse) => void): Request<WorkMailMessageFlow.Types.PutRawMessageContentResponse, AWSError>;
}
declare namespace WorkMailMessageFlow {
  export interface GetRawMessageContentRequest {
    /**
     * The identifier of the email message to retrieve.
     */
    messageId: messageIdType;
  }
  export interface GetRawMessageContentResponse {
    /**
     * The raw content of the email message, in MIME format.
     */
    messageContent: messageContentBlob;
  }
  export interface PutRawMessageContentRequest {
    /**
     * The identifier of the email message being updated.
     */
    messageId: messageIdType;
    /**
     * Describes the raw message content of the updated email message.
     */
    content: RawMessageContent;
  }
  export interface PutRawMessageContentResponse {
  }
  export interface RawMessageContent {
    /**
     * The S3 reference of an email message.
     */
    s3Reference: S3Reference;
  }
  export interface S3Reference {
    /**
     * The S3 bucket name.
     */
    bucket: s3BucketIdType;
    /**
     * The S3 key object name.
     */
    key: s3KeyIdType;
    /**
     * If you enable versioning for the bucket, you can specify the object version.
     */
    objectVersion?: s3VersionType;
  }
  export type messageContentBlob = Buffer|Uint8Array|Blob|string|Readable;
  export type messageIdType = string;
  export type s3BucketIdType = string;
  export type s3KeyIdType = string;
  export type s3VersionType = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-05-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the WorkMailMessageFlow client.
   */
  export import Types = WorkMailMessageFlow;
}
export = WorkMailMessageFlow;
