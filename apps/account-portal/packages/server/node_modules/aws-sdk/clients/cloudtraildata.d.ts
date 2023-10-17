import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CloudTrailData extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CloudTrailData.Types.ClientConfiguration)
  config: Config & CloudTrailData.Types.ClientConfiguration;
  /**
   * Ingests your application events into CloudTrail Lake. A required parameter, auditEvents, accepts the JSON records (also called payload) of events that you want CloudTrail to ingest. You can add up to 100 of these events (or up to 1 MB) per PutAuditEvents request.
   */
  putAuditEvents(params: CloudTrailData.Types.PutAuditEventsRequest, callback?: (err: AWSError, data: CloudTrailData.Types.PutAuditEventsResponse) => void): Request<CloudTrailData.Types.PutAuditEventsResponse, AWSError>;
  /**
   * Ingests your application events into CloudTrail Lake. A required parameter, auditEvents, accepts the JSON records (also called payload) of events that you want CloudTrail to ingest. You can add up to 100 of these events (or up to 1 MB) per PutAuditEvents request.
   */
  putAuditEvents(callback?: (err: AWSError, data: CloudTrailData.Types.PutAuditEventsResponse) => void): Request<CloudTrailData.Types.PutAuditEventsResponse, AWSError>;
}
declare namespace CloudTrailData {
  export interface AuditEvent {
    /**
     * The content of an audit event that comes from the event, such as userIdentity, userAgent, and eventSource.
     */
    eventData: String;
    /**
     * A checksum is a base64-SHA256 algorithm that helps you verify that CloudTrail receives the event that matches with the checksum. Calculate the checksum by running a command like the following:  printf %s $eventdata | openssl dgst -binary -sha256 | base64 
     */
    eventDataChecksum?: String;
    /**
     * The original event ID from the source event.
     */
    id: Uuid;
  }
  export type AuditEventResultEntries = AuditEventResultEntry[];
  export interface AuditEventResultEntry {
    /**
     * The event ID assigned by CloudTrail.
     */
    eventID: Uuid;
    /**
     * The original event ID from the source event.
     */
    id: Uuid;
  }
  export type AuditEvents = AuditEvent[];
  export type ChannelArn = string;
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export type ExternalId = string;
  export interface PutAuditEventsRequest {
    /**
     * The JSON payload of events that you want to ingest. You can also point to the JSON event payload in a file.
     */
    auditEvents: AuditEvents;
    /**
     * The ARN or ID (the ARN suffix) of a channel.
     */
    channelArn: ChannelArn;
    /**
     * A unique identifier that is conditionally required when the channel's resource policy includes an external ID. This value can be any string, such as a passphrase or account number.
     */
    externalId?: ExternalId;
  }
  export interface PutAuditEventsResponse {
    /**
     * Lists events in the provided event payload that could not be ingested into CloudTrail, and includes the error code and error message returned for events that could not be ingested.
     */
    failed: ResultErrorEntries;
    /**
     * Lists events in the provided event payload that were successfully ingested into CloudTrail.
     */
    successful: AuditEventResultEntries;
  }
  export type ResultErrorEntries = ResultErrorEntry[];
  export interface ResultErrorEntry {
    /**
     * The error code for events that could not be ingested by CloudTrail. Possible error codes include: FieldTooLong, FieldNotFound, InvalidChecksum, InvalidData, InvalidRecipient, InvalidEventSource, AccountNotSubscribed, Throttling, and InternalFailure.
     */
    errorCode: ErrorCode;
    /**
     * The message that describes the error for events that could not be ingested by CloudTrail.
     */
    errorMessage: ErrorMessage;
    /**
     * The original event ID from the source event that could not be ingested by CloudTrail.
     */
    id: Uuid;
  }
  export type String = string;
  export type Uuid = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-08-11"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CloudTrailData client.
   */
  export import Types = CloudTrailData;
}
export = CloudTrailData;
