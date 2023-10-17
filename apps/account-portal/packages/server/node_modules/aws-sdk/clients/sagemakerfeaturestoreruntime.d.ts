import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SageMakerFeatureStoreRuntime extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SageMakerFeatureStoreRuntime.Types.ClientConfiguration)
  config: Config & SageMakerFeatureStoreRuntime.Types.ClientConfiguration;
  /**
   * Retrieves a batch of Records from a FeatureGroup.
   */
  batchGetRecord(params: SageMakerFeatureStoreRuntime.Types.BatchGetRecordRequest, callback?: (err: AWSError, data: SageMakerFeatureStoreRuntime.Types.BatchGetRecordResponse) => void): Request<SageMakerFeatureStoreRuntime.Types.BatchGetRecordResponse, AWSError>;
  /**
   * Retrieves a batch of Records from a FeatureGroup.
   */
  batchGetRecord(callback?: (err: AWSError, data: SageMakerFeatureStoreRuntime.Types.BatchGetRecordResponse) => void): Request<SageMakerFeatureStoreRuntime.Types.BatchGetRecordResponse, AWSError>;
  /**
   * Deletes a Record from a FeatureGroup in the OnlineStore. Feature Store supports both SoftDelete and HardDelete. For SoftDelete (default), feature columns are set to null and the record is no longer retrievable by GetRecord or BatchGetRecord. For HardDelete, the complete Record is removed from the OnlineStore. In both cases, Feature Store appends the deleted record marker to the OfflineStore with feature values set to null, is_deleted value set to True, and EventTime set to the delete input EventTime. Note that the EventTime specified in DeleteRecord should be set later than the EventTime of the existing record in the OnlineStore for that RecordIdentifer. If it is not, the deletion does not occur:   For SoftDelete, the existing (undeleted) record remains in the OnlineStore, though the delete record marker is still written to the OfflineStore.    HardDelete returns EventTime: 400 ValidationException to indicate that the delete operation failed. No delete record marker is written to the OfflineStore.  
   */
  deleteRecord(params: SageMakerFeatureStoreRuntime.Types.DeleteRecordRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Record from a FeatureGroup in the OnlineStore. Feature Store supports both SoftDelete and HardDelete. For SoftDelete (default), feature columns are set to null and the record is no longer retrievable by GetRecord or BatchGetRecord. For HardDelete, the complete Record is removed from the OnlineStore. In both cases, Feature Store appends the deleted record marker to the OfflineStore with feature values set to null, is_deleted value set to True, and EventTime set to the delete input EventTime. Note that the EventTime specified in DeleteRecord should be set later than the EventTime of the existing record in the OnlineStore for that RecordIdentifer. If it is not, the deletion does not occur:   For SoftDelete, the existing (undeleted) record remains in the OnlineStore, though the delete record marker is still written to the OfflineStore.    HardDelete returns EventTime: 400 ValidationException to indicate that the delete operation failed. No delete record marker is written to the OfflineStore.  
   */
  deleteRecord(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Use for OnlineStore serving from a FeatureStore. Only the latest records stored in the OnlineStore can be retrieved. If no Record with RecordIdentifierValue is found, then an empty result is returned. 
   */
  getRecord(params: SageMakerFeatureStoreRuntime.Types.GetRecordRequest, callback?: (err: AWSError, data: SageMakerFeatureStoreRuntime.Types.GetRecordResponse) => void): Request<SageMakerFeatureStoreRuntime.Types.GetRecordResponse, AWSError>;
  /**
   * Use for OnlineStore serving from a FeatureStore. Only the latest records stored in the OnlineStore can be retrieved. If no Record with RecordIdentifierValue is found, then an empty result is returned. 
   */
  getRecord(callback?: (err: AWSError, data: SageMakerFeatureStoreRuntime.Types.GetRecordResponse) => void): Request<SageMakerFeatureStoreRuntime.Types.GetRecordResponse, AWSError>;
  /**
   * The PutRecord API is used to ingest a list of Records into your feature group.  If a new record’s EventTime is greater, the new record is written to both the OnlineStore and OfflineStore. Otherwise, the record is a historic record and it is written only to the OfflineStore.  You can specify the ingestion to be applied to the OnlineStore, OfflineStore, or both by using the TargetStores request parameter.  You can set the ingested record to expire at a given time to live (TTL) duration after the record’s event time, ExpiresAt = EventTime + TtlDuration, by specifying the TtlDuration parameter. A record level TtlDuration is set when specifying the TtlDuration parameter using the PutRecord API call. If the input TtlDuration is null or unspecified, TtlDuration is set to the default feature group level TtlDuration. A record level TtlDuration supersedes the group level TtlDuration.
   */
  putRecord(params: SageMakerFeatureStoreRuntime.Types.PutRecordRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The PutRecord API is used to ingest a list of Records into your feature group.  If a new record’s EventTime is greater, the new record is written to both the OnlineStore and OfflineStore. Otherwise, the record is a historic record and it is written only to the OfflineStore.  You can specify the ingestion to be applied to the OnlineStore, OfflineStore, or both by using the TargetStores request parameter.  You can set the ingested record to expire at a given time to live (TTL) duration after the record’s event time, ExpiresAt = EventTime + TtlDuration, by specifying the TtlDuration parameter. A record level TtlDuration is set when specifying the TtlDuration parameter using the PutRecord API call. If the input TtlDuration is null or unspecified, TtlDuration is set to the default feature group level TtlDuration. A record level TtlDuration supersedes the group level TtlDuration.
   */
  putRecord(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace SageMakerFeatureStoreRuntime {
  export interface BatchGetRecordError {
    /**
     * The name of the feature group that the record belongs to.
     */
    FeatureGroupName: ValueAsString;
    /**
     * The value for the RecordIdentifier in string format of a Record from a FeatureGroup that is causing an error when attempting to be retrieved.
     */
    RecordIdentifierValueAsString: ValueAsString;
    /**
     * The error code of an error that has occurred when attempting to retrieve a batch of Records. For more information on errors, see Errors.
     */
    ErrorCode: ValueAsString;
    /**
     * The error message of an error that has occurred when attempting to retrieve a record in the batch.
     */
    ErrorMessage: Message;
  }
  export type BatchGetRecordErrors = BatchGetRecordError[];
  export interface BatchGetRecordIdentifier {
    /**
     * The name or Amazon Resource Name (ARN) of the FeatureGroup containing the records you are retrieving in a batch.
     */
    FeatureGroupName: FeatureGroupNameOrArn;
    /**
     * The value for a list of record identifiers in string format.
     */
    RecordIdentifiersValueAsString: RecordIdentifiers;
    /**
     * List of names of Features to be retrieved. If not specified, the latest value for all the Features are returned.
     */
    FeatureNames?: FeatureNames;
  }
  export type BatchGetRecordIdentifiers = BatchGetRecordIdentifier[];
  export interface BatchGetRecordRequest {
    /**
     * A list containing the name or Amazon Resource Name (ARN) of the FeatureGroup, the list of names of Features to be retrieved, and the corresponding RecordIdentifier values as strings.
     */
    Identifiers: BatchGetRecordIdentifiers;
    /**
     * Parameter to request ExpiresAt in response. If Enabled, BatchGetRecord will return the value of ExpiresAt, if it is not null. If Disabled and null, BatchGetRecord will return null.
     */
    ExpirationTimeResponse?: ExpirationTimeResponse;
  }
  export interface BatchGetRecordResponse {
    /**
     * A list of Records you requested to be retrieved in batch.
     */
    Records: BatchGetRecordResultDetails;
    /**
     * A list of errors that have occurred when retrieving a batch of Records.
     */
    Errors: BatchGetRecordErrors;
    /**
     * A unprocessed list of FeatureGroup names, with their corresponding RecordIdentifier value, and Feature name.
     */
    UnprocessedIdentifiers: UnprocessedIdentifiers;
  }
  export interface BatchGetRecordResultDetail {
    /**
     * The FeatureGroupName containing Records you retrieved in a batch.
     */
    FeatureGroupName: ValueAsString;
    /**
     * The value of the record identifier in string format.
     */
    RecordIdentifierValueAsString: ValueAsString;
    /**
     * The Record retrieved.
     */
    Record: Record;
    /**
     * The ExpiresAt ISO string of the requested record.
     */
    ExpiresAt?: ExpiresAt;
  }
  export type BatchGetRecordResultDetails = BatchGetRecordResultDetail[];
  export interface DeleteRecordRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the feature group to delete the record from. 
     */
    FeatureGroupName: FeatureGroupNameOrArn;
    /**
     * The value for the RecordIdentifier that uniquely identifies the record, in string format. 
     */
    RecordIdentifierValueAsString: ValueAsString;
    /**
     * Timestamp indicating when the deletion event occurred. EventTime can be used to query data at a certain point in time.
     */
    EventTime: ValueAsString;
    /**
     * A list of stores from which you're deleting the record. By default, Feature Store deletes the record from all of the stores that you're using for the FeatureGroup.
     */
    TargetStores?: TargetStores;
    /**
     * The name of the deletion mode for deleting the record. By default, the deletion mode is set to SoftDelete.
     */
    DeletionMode?: DeletionMode;
  }
  export type DeletionMode = "SoftDelete"|"HardDelete"|string;
  export type ExpirationTimeResponse = "Enabled"|"Disabled"|string;
  export type ExpiresAt = string;
  export type FeatureGroupNameOrArn = string;
  export type FeatureName = string;
  export type FeatureNames = FeatureName[];
  export interface FeatureValue {
    /**
     * The name of a feature that a feature value corresponds to.
     */
    FeatureName: FeatureName;
    /**
     * The value in string format associated with a feature. Used when your CollectionType is None. Note that features types can be String, Integral, or Fractional. This value represents all three types as a string.
     */
    ValueAsString?: ValueAsString;
    /**
     * The list of values in string format associated with a feature. Used when your CollectionType is a List, Set, or Vector. Note that features types can be String, Integral, or Fractional. These values represents all three types as a string.
     */
    ValueAsStringList?: ValueAsStringList;
  }
  export interface GetRecordRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the feature group from which you want to retrieve a record.
     */
    FeatureGroupName: FeatureGroupNameOrArn;
    /**
     * The value that corresponds to RecordIdentifier type and uniquely identifies the record in the FeatureGroup. 
     */
    RecordIdentifierValueAsString: ValueAsString;
    /**
     * List of names of Features to be retrieved. If not specified, the latest value for all the Features are returned.
     */
    FeatureNames?: FeatureNames;
    /**
     * Parameter to request ExpiresAt in response. If Enabled, GetRecord will return the value of ExpiresAt, if it is not null. If Disabled and null, GetRecord will return null.
     */
    ExpirationTimeResponse?: ExpirationTimeResponse;
  }
  export interface GetRecordResponse {
    /**
     * The record you requested. A list of FeatureValues.
     */
    Record?: Record;
    /**
     * The ExpiresAt ISO string of the requested record.
     */
    ExpiresAt?: ExpiresAt;
  }
  export type Message = string;
  export interface PutRecordRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the feature group that you want to insert the record into.
     */
    FeatureGroupName: FeatureGroupNameOrArn;
    /**
     * List of FeatureValues to be inserted. This will be a full over-write. If you only want to update few of the feature values, do the following:   Use GetRecord to retrieve the latest record.   Update the record returned from GetRecord.    Use PutRecord to update feature values.  
     */
    Record: Record;
    /**
     * A list of stores to which you're adding the record. By default, Feature Store adds the record to all of the stores that you're using for the FeatureGroup.
     */
    TargetStores?: TargetStores;
    /**
     * Time to live duration, where the record is hard deleted after the expiration time is reached; ExpiresAt = EventTime + TtlDuration. For information on HardDelete, see the DeleteRecord API in the Amazon SageMaker API Reference guide.
     */
    TtlDuration?: TtlDuration;
  }
  export type Record = FeatureValue[];
  export type RecordIdentifiers = ValueAsString[];
  export type TargetStore = "OnlineStore"|"OfflineStore"|string;
  export type TargetStores = TargetStore[];
  export interface TtlDuration {
    /**
     *  TtlDuration time unit.
     */
    Unit: TtlDurationUnit;
    /**
     *  TtlDuration time value.
     */
    Value: TtlDurationValue;
  }
  export type TtlDurationUnit = "Seconds"|"Minutes"|"Hours"|"Days"|"Weeks"|string;
  export type TtlDurationValue = number;
  export type UnprocessedIdentifiers = BatchGetRecordIdentifier[];
  export type ValueAsString = string;
  export type ValueAsStringList = ValueAsString[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-07-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SageMakerFeatureStoreRuntime client.
   */
  export import Types = SageMakerFeatureStoreRuntime;
}
export = SageMakerFeatureStoreRuntime;
