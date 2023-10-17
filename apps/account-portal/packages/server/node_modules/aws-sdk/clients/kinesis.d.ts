import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Kinesis extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Kinesis.Types.ClientConfiguration)
  config: Config & Kinesis.Types.ClientConfiguration;
  /**
   * Adds or updates tags for the specified Kinesis data stream. You can assign up to 50 tags to a data stream.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  If tags have already been assigned to the stream, AddTagsToStream overwrites any existing tags that correspond to the specified tag keys.  AddTagsToStream has a limit of five transactions per second per account.
   */
  addTagsToStream(params: Kinesis.Types.AddTagsToStreamInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates tags for the specified Kinesis data stream. You can assign up to 50 tags to a data stream.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  If tags have already been assigned to the stream, AddTagsToStream overwrites any existing tags that correspond to the specified tag keys.  AddTagsToStream has a limit of five transactions per second per account.
   */
  addTagsToStream(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a Kinesis data stream. A stream captures and transports data records that are continuously emitted from different data sources or producers. Scale-out within a stream is explicitly supported by means of shards, which are uniquely identified groups of data records in a stream. You can create your data stream using either on-demand or provisioned capacity mode. Data streams with an on-demand mode require no capacity planning and automatically scale to handle gigabytes of write and read throughput per minute. With the on-demand mode, Kinesis Data Streams automatically manages the shards in order to provide the necessary throughput. For the data streams with a provisioned mode, you must specify the number of shards for the data stream. Each shard can support reads up to five transactions per second, up to a maximum data read total of 2 MiB per second. Each shard can support writes up to 1,000 records per second, up to a maximum data write total of 1 MiB per second. If the amount of data input increases or decreases, you can add or remove shards. The stream name identifies the stream. The name is scoped to the Amazon Web Services account used by the application. It is also scoped by Amazon Web Services Region. That is, two streams in two different accounts can have the same name, and two streams in the same account, but in two different Regions, can have the same name.  CreateStream is an asynchronous operation. Upon receiving a CreateStream request, Kinesis Data Streams immediately returns and sets the stream status to CREATING. After the stream is created, Kinesis Data Streams sets the stream status to ACTIVE. You should perform read and write operations only on an ACTIVE stream.  You receive a LimitExceededException when making a CreateStream request when you try to do one of the following:   Have more than five streams in the CREATING state at any point in time.   Create more shards than are authorized for your account.   For the default shard limit for an Amazon Web Services account, see Amazon Kinesis Data Streams Limits in the Amazon Kinesis Data Streams Developer Guide. To increase this limit, contact Amazon Web Services Support. You can use DescribeStreamSummary to check the stream status, which is returned in StreamStatus.  CreateStream has a limit of five transactions per second per account.
   */
  createStream(params: Kinesis.Types.CreateStreamInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a Kinesis data stream. A stream captures and transports data records that are continuously emitted from different data sources or producers. Scale-out within a stream is explicitly supported by means of shards, which are uniquely identified groups of data records in a stream. You can create your data stream using either on-demand or provisioned capacity mode. Data streams with an on-demand mode require no capacity planning and automatically scale to handle gigabytes of write and read throughput per minute. With the on-demand mode, Kinesis Data Streams automatically manages the shards in order to provide the necessary throughput. For the data streams with a provisioned mode, you must specify the number of shards for the data stream. Each shard can support reads up to five transactions per second, up to a maximum data read total of 2 MiB per second. Each shard can support writes up to 1,000 records per second, up to a maximum data write total of 1 MiB per second. If the amount of data input increases or decreases, you can add or remove shards. The stream name identifies the stream. The name is scoped to the Amazon Web Services account used by the application. It is also scoped by Amazon Web Services Region. That is, two streams in two different accounts can have the same name, and two streams in the same account, but in two different Regions, can have the same name.  CreateStream is an asynchronous operation. Upon receiving a CreateStream request, Kinesis Data Streams immediately returns and sets the stream status to CREATING. After the stream is created, Kinesis Data Streams sets the stream status to ACTIVE. You should perform read and write operations only on an ACTIVE stream.  You receive a LimitExceededException when making a CreateStream request when you try to do one of the following:   Have more than five streams in the CREATING state at any point in time.   Create more shards than are authorized for your account.   For the default shard limit for an Amazon Web Services account, see Amazon Kinesis Data Streams Limits in the Amazon Kinesis Data Streams Developer Guide. To increase this limit, contact Amazon Web Services Support. You can use DescribeStreamSummary to check the stream status, which is returned in StreamStatus.  CreateStream has a limit of five transactions per second per account.
   */
  createStream(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Decreases the Kinesis data stream's retention period, which is the length of time data records are accessible after they are added to the stream. The minimum value of a stream's retention period is 24 hours.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  This operation may result in lost data. For example, if the stream's retention period is 48 hours and is decreased to 24 hours, any data already in the stream that is older than 24 hours is inaccessible.
   */
  decreaseStreamRetentionPeriod(params: Kinesis.Types.DecreaseStreamRetentionPeriodInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Decreases the Kinesis data stream's retention period, which is the length of time data records are accessible after they are added to the stream. The minimum value of a stream's retention period is 24 hours.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  This operation may result in lost data. For example, if the stream's retention period is 48 hours and is decreased to 24 hours, any data already in the stream that is older than 24 hours is inaccessible.
   */
  decreaseStreamRetentionPeriod(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Kinesis data stream and all its shards and data. You must shut down any applications that are operating on the stream before you delete the stream. If an application attempts to operate on a deleted stream, it receives the exception ResourceNotFoundException.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  If the stream is in the ACTIVE state, you can delete it. After a DeleteStream request, the specified stream is in the DELETING state until Kinesis Data Streams completes the deletion.  Note: Kinesis Data Streams might continue to accept data read and write operations, such as PutRecord, PutRecords, and GetRecords, on a stream in the DELETING state until the stream deletion is complete. When you delete a stream, any shards in that stream are also deleted, and any tags are dissociated from the stream. You can use the DescribeStreamSummary operation to check the state of the stream, which is returned in StreamStatus.  DeleteStream has a limit of five transactions per second per account.
   */
  deleteStream(params: Kinesis.Types.DeleteStreamInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Kinesis data stream and all its shards and data. You must shut down any applications that are operating on the stream before you delete the stream. If an application attempts to operate on a deleted stream, it receives the exception ResourceNotFoundException.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  If the stream is in the ACTIVE state, you can delete it. After a DeleteStream request, the specified stream is in the DELETING state until Kinesis Data Streams completes the deletion.  Note: Kinesis Data Streams might continue to accept data read and write operations, such as PutRecord, PutRecords, and GetRecords, on a stream in the DELETING state until the stream deletion is complete. When you delete a stream, any shards in that stream are also deleted, and any tags are dissociated from the stream. You can use the DescribeStreamSummary operation to check the state of the stream, which is returned in StreamStatus.  DeleteStream has a limit of five transactions per second per account.
   */
  deleteStream(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * To deregister a consumer, provide its ARN. Alternatively, you can provide the ARN of the data stream and the name you gave the consumer when you registered it. You may also provide all three parameters, as long as they don't conflict with each other. If you don't know the name or ARN of the consumer that you want to deregister, you can use the ListStreamConsumers operation to get a list of the descriptions of all the consumers that are currently registered with a given data stream. The description of a consumer contains its name and ARN. This operation has a limit of five transactions per second per stream.
   */
  deregisterStreamConsumer(params: Kinesis.Types.DeregisterStreamConsumerInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * To deregister a consumer, provide its ARN. Alternatively, you can provide the ARN of the data stream and the name you gave the consumer when you registered it. You may also provide all three parameters, as long as they don't conflict with each other. If you don't know the name or ARN of the consumer that you want to deregister, you can use the ListStreamConsumers operation to get a list of the descriptions of all the consumers that are currently registered with a given data stream. The description of a consumer contains its name and ARN. This operation has a limit of five transactions per second per stream.
   */
  deregisterStreamConsumer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes the shard limits and usage for the account. If you update your account limits, the old limits might be returned for a few minutes. This operation has a limit of one transaction per second per account.
   */
  describeLimits(params: Kinesis.Types.DescribeLimitsInput, callback?: (err: AWSError, data: Kinesis.Types.DescribeLimitsOutput) => void): Request<Kinesis.Types.DescribeLimitsOutput, AWSError>;
  /**
   * Describes the shard limits and usage for the account. If you update your account limits, the old limits might be returned for a few minutes. This operation has a limit of one transaction per second per account.
   */
  describeLimits(callback?: (err: AWSError, data: Kinesis.Types.DescribeLimitsOutput) => void): Request<Kinesis.Types.DescribeLimitsOutput, AWSError>;
  /**
   * Describes the specified Kinesis data stream.  This API has been revised. It's highly recommended that you use the DescribeStreamSummary API to get a summarized description of the specified Kinesis data stream and the ListShards API to list the shards in a specified data stream and obtain information about each shard.    When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  The information returned includes the stream name, Amazon Resource Name (ARN), creation time, enhanced metric configuration, and shard map. The shard map is an array of shard objects. For each shard object, there is the hash key and sequence number ranges that the shard spans, and the IDs of any earlier shards that played in a role in creating the shard. Every record ingested in the stream is identified by a sequence number, which is assigned when the record is put into the stream. You can limit the number of shards returned by each call. For more information, see Retrieving Shards from a Stream in the Amazon Kinesis Data Streams Developer Guide. There are no guarantees about the chronological order shards returned. To process shards in chronological order, use the ID of the parent shard to track the lineage to the oldest shard. This operation has a limit of 10 transactions per second per account.
   */
  describeStream(params: Kinesis.Types.DescribeStreamInput, callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamOutput) => void): Request<Kinesis.Types.DescribeStreamOutput, AWSError>;
  /**
   * Describes the specified Kinesis data stream.  This API has been revised. It's highly recommended that you use the DescribeStreamSummary API to get a summarized description of the specified Kinesis data stream and the ListShards API to list the shards in a specified data stream and obtain information about each shard.    When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  The information returned includes the stream name, Amazon Resource Name (ARN), creation time, enhanced metric configuration, and shard map. The shard map is an array of shard objects. For each shard object, there is the hash key and sequence number ranges that the shard spans, and the IDs of any earlier shards that played in a role in creating the shard. Every record ingested in the stream is identified by a sequence number, which is assigned when the record is put into the stream. You can limit the number of shards returned by each call. For more information, see Retrieving Shards from a Stream in the Amazon Kinesis Data Streams Developer Guide. There are no guarantees about the chronological order shards returned. To process shards in chronological order, use the ID of the parent shard to track the lineage to the oldest shard. This operation has a limit of 10 transactions per second per account.
   */
  describeStream(callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamOutput) => void): Request<Kinesis.Types.DescribeStreamOutput, AWSError>;
  /**
   * To get the description of a registered consumer, provide the ARN of the consumer. Alternatively, you can provide the ARN of the data stream and the name you gave the consumer when you registered it. You may also provide all three parameters, as long as they don't conflict with each other. If you don't know the name or ARN of the consumer that you want to describe, you can use the ListStreamConsumers operation to get a list of the descriptions of all the consumers that are currently registered with a given data stream. This operation has a limit of 20 transactions per second per stream.
   */
  describeStreamConsumer(params: Kinesis.Types.DescribeStreamConsumerInput, callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamConsumerOutput) => void): Request<Kinesis.Types.DescribeStreamConsumerOutput, AWSError>;
  /**
   * To get the description of a registered consumer, provide the ARN of the consumer. Alternatively, you can provide the ARN of the data stream and the name you gave the consumer when you registered it. You may also provide all three parameters, as long as they don't conflict with each other. If you don't know the name or ARN of the consumer that you want to describe, you can use the ListStreamConsumers operation to get a list of the descriptions of all the consumers that are currently registered with a given data stream. This operation has a limit of 20 transactions per second per stream.
   */
  describeStreamConsumer(callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamConsumerOutput) => void): Request<Kinesis.Types.DescribeStreamConsumerOutput, AWSError>;
  /**
   * Provides a summarized description of the specified Kinesis data stream without the shard list.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  The information returned includes the stream name, Amazon Resource Name (ARN), status, record retention period, approximate creation time, monitoring, encryption details, and open shard count.   DescribeStreamSummary has a limit of 20 transactions per second per account.
   */
  describeStreamSummary(params: Kinesis.Types.DescribeStreamSummaryInput, callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamSummaryOutput) => void): Request<Kinesis.Types.DescribeStreamSummaryOutput, AWSError>;
  /**
   * Provides a summarized description of the specified Kinesis data stream without the shard list.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  The information returned includes the stream name, Amazon Resource Name (ARN), status, record retention period, approximate creation time, monitoring, encryption details, and open shard count.   DescribeStreamSummary has a limit of 20 transactions per second per account.
   */
  describeStreamSummary(callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamSummaryOutput) => void): Request<Kinesis.Types.DescribeStreamSummaryOutput, AWSError>;
  /**
   * Disables enhanced monitoring.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter. 
   */
  disableEnhancedMonitoring(params: Kinesis.Types.DisableEnhancedMonitoringInput, callback?: (err: AWSError, data: Kinesis.Types.EnhancedMonitoringOutput) => void): Request<Kinesis.Types.EnhancedMonitoringOutput, AWSError>;
  /**
   * Disables enhanced monitoring.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter. 
   */
  disableEnhancedMonitoring(callback?: (err: AWSError, data: Kinesis.Types.EnhancedMonitoringOutput) => void): Request<Kinesis.Types.EnhancedMonitoringOutput, AWSError>;
  /**
   * Enables enhanced Kinesis data stream monitoring for shard-level metrics.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter. 
   */
  enableEnhancedMonitoring(params: Kinesis.Types.EnableEnhancedMonitoringInput, callback?: (err: AWSError, data: Kinesis.Types.EnhancedMonitoringOutput) => void): Request<Kinesis.Types.EnhancedMonitoringOutput, AWSError>;
  /**
   * Enables enhanced Kinesis data stream monitoring for shard-level metrics.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter. 
   */
  enableEnhancedMonitoring(callback?: (err: AWSError, data: Kinesis.Types.EnhancedMonitoringOutput) => void): Request<Kinesis.Types.EnhancedMonitoringOutput, AWSError>;
  /**
   * Gets data records from a Kinesis data stream's shard.  When invoking this API, it is recommended you use the StreamARN input parameter in addition to the ShardIterator parameter.  Specify a shard iterator using the ShardIterator parameter. The shard iterator specifies the position in the shard from which you want to start reading data records sequentially. If there are no records available in the portion of the shard that the iterator points to, GetRecords returns an empty list. It might take multiple calls to get to a portion of the shard that contains records. You can scale by provisioning multiple shards per stream while considering service limits (for more information, see Amazon Kinesis Data Streams Limits in the Amazon Kinesis Data Streams Developer Guide). Your application should have one thread per shard, each reading continuously from its stream. To read from a stream continually, call GetRecords in a loop. Use GetShardIterator to get the shard iterator to specify in the first GetRecords call. GetRecords returns a new shard iterator in NextShardIterator. Specify the shard iterator returned in NextShardIterator in subsequent calls to GetRecords. If the shard has been closed, the shard iterator can't return more data and GetRecords returns null in NextShardIterator. You can terminate the loop when the shard is closed, or when the shard iterator reaches the record with the sequence number or other attribute that marks it as the last record to process. Each data record can be up to 1 MiB in size, and each shard can read up to 2 MiB per second. You can ensure that your calls don't exceed the maximum supported size or throughput by using the Limit parameter to specify the maximum number of records that GetRecords can return. Consider your average record size when determining this limit. The maximum number of records that can be returned per call is 10,000. The size of the data returned by GetRecords varies depending on the utilization of the shard. It is recommended that consumer applications retrieve records via the GetRecords command using the 5 TPS limit to remain caught up. Retrieving records less frequently can lead to consumer applications falling behind. The maximum size of data that GetRecords can return is 10 MiB. If a call returns this amount of data, subsequent calls made within the next 5 seconds throw ProvisionedThroughputExceededException. If there is insufficient provisioned throughput on the stream, subsequent calls made within the next 1 second throw ProvisionedThroughputExceededException. GetRecords doesn't return any data when it throws an exception. For this reason, we recommend that you wait 1 second between calls to GetRecords. However, it's possible that the application will get exceptions for longer than 1 second. To detect whether the application is falling behind in processing, you can use the MillisBehindLatest response attribute. You can also monitor the stream using CloudWatch metrics and other mechanisms (see Monitoring in the Amazon Kinesis Data Streams Developer Guide). Each Amazon Kinesis record includes a value, ApproximateArrivalTimestamp, that is set when a stream successfully receives and stores a record. This is commonly referred to as a server-side time stamp, whereas a client-side time stamp is set when a data producer creates or sends the record to a stream (a data producer is any data source putting data records into a stream, for example with PutRecords). The time stamp has millisecond precision. There are no guarantees about the time stamp accuracy, or that the time stamp is always increasing. For example, records in a shard or across a stream might have time stamps that are out of order. This operation has a limit of five transactions per second per shard.
   */
  getRecords(params: Kinesis.Types.GetRecordsInput, callback?: (err: AWSError, data: Kinesis.Types.GetRecordsOutput) => void): Request<Kinesis.Types.GetRecordsOutput, AWSError>;
  /**
   * Gets data records from a Kinesis data stream's shard.  When invoking this API, it is recommended you use the StreamARN input parameter in addition to the ShardIterator parameter.  Specify a shard iterator using the ShardIterator parameter. The shard iterator specifies the position in the shard from which you want to start reading data records sequentially. If there are no records available in the portion of the shard that the iterator points to, GetRecords returns an empty list. It might take multiple calls to get to a portion of the shard that contains records. You can scale by provisioning multiple shards per stream while considering service limits (for more information, see Amazon Kinesis Data Streams Limits in the Amazon Kinesis Data Streams Developer Guide). Your application should have one thread per shard, each reading continuously from its stream. To read from a stream continually, call GetRecords in a loop. Use GetShardIterator to get the shard iterator to specify in the first GetRecords call. GetRecords returns a new shard iterator in NextShardIterator. Specify the shard iterator returned in NextShardIterator in subsequent calls to GetRecords. If the shard has been closed, the shard iterator can't return more data and GetRecords returns null in NextShardIterator. You can terminate the loop when the shard is closed, or when the shard iterator reaches the record with the sequence number or other attribute that marks it as the last record to process. Each data record can be up to 1 MiB in size, and each shard can read up to 2 MiB per second. You can ensure that your calls don't exceed the maximum supported size or throughput by using the Limit parameter to specify the maximum number of records that GetRecords can return. Consider your average record size when determining this limit. The maximum number of records that can be returned per call is 10,000. The size of the data returned by GetRecords varies depending on the utilization of the shard. It is recommended that consumer applications retrieve records via the GetRecords command using the 5 TPS limit to remain caught up. Retrieving records less frequently can lead to consumer applications falling behind. The maximum size of data that GetRecords can return is 10 MiB. If a call returns this amount of data, subsequent calls made within the next 5 seconds throw ProvisionedThroughputExceededException. If there is insufficient provisioned throughput on the stream, subsequent calls made within the next 1 second throw ProvisionedThroughputExceededException. GetRecords doesn't return any data when it throws an exception. For this reason, we recommend that you wait 1 second between calls to GetRecords. However, it's possible that the application will get exceptions for longer than 1 second. To detect whether the application is falling behind in processing, you can use the MillisBehindLatest response attribute. You can also monitor the stream using CloudWatch metrics and other mechanisms (see Monitoring in the Amazon Kinesis Data Streams Developer Guide). Each Amazon Kinesis record includes a value, ApproximateArrivalTimestamp, that is set when a stream successfully receives and stores a record. This is commonly referred to as a server-side time stamp, whereas a client-side time stamp is set when a data producer creates or sends the record to a stream (a data producer is any data source putting data records into a stream, for example with PutRecords). The time stamp has millisecond precision. There are no guarantees about the time stamp accuracy, or that the time stamp is always increasing. For example, records in a shard or across a stream might have time stamps that are out of order. This operation has a limit of five transactions per second per shard.
   */
  getRecords(callback?: (err: AWSError, data: Kinesis.Types.GetRecordsOutput) => void): Request<Kinesis.Types.GetRecordsOutput, AWSError>;
  /**
   * Gets an Amazon Kinesis shard iterator. A shard iterator expires 5 minutes after it is returned to the requester.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  A shard iterator specifies the shard position from which to start reading data records sequentially. The position is specified using the sequence number of a data record in a shard. A sequence number is the identifier associated with every record ingested in the stream, and is assigned when a record is put into the stream. Each stream has one or more shards. You must specify the shard iterator type. For example, you can set the ShardIteratorType parameter to read exactly from the position denoted by a specific sequence number by using the AT_SEQUENCE_NUMBER shard iterator type. Alternatively, the parameter can read right after the sequence number by using the AFTER_SEQUENCE_NUMBER shard iterator type, using sequence numbers returned by earlier calls to PutRecord, PutRecords, GetRecords, or DescribeStream. In the request, you can specify the shard iterator type AT_TIMESTAMP to read records from an arbitrary point in time, TRIM_HORIZON to cause ShardIterator to point to the last untrimmed record in the shard in the system (the oldest data record in the shard), or LATEST so that you always read the most recent data in the shard.  When you read repeatedly from a stream, use a GetShardIterator request to get the first shard iterator for use in your first GetRecords request and for subsequent reads use the shard iterator returned by the GetRecords request in NextShardIterator. A new shard iterator is returned by every GetRecords request in NextShardIterator, which you use in the ShardIterator parameter of the next GetRecords request.  If a GetShardIterator request is made too often, you receive a ProvisionedThroughputExceededException. For more information about throughput limits, see GetRecords, and Streams Limits in the Amazon Kinesis Data Streams Developer Guide. If the shard is closed, GetShardIterator returns a valid iterator for the last sequence number of the shard. A shard can be closed as a result of using SplitShard or MergeShards.  GetShardIterator has a limit of five transactions per second per account per open shard.
   */
  getShardIterator(params: Kinesis.Types.GetShardIteratorInput, callback?: (err: AWSError, data: Kinesis.Types.GetShardIteratorOutput) => void): Request<Kinesis.Types.GetShardIteratorOutput, AWSError>;
  /**
   * Gets an Amazon Kinesis shard iterator. A shard iterator expires 5 minutes after it is returned to the requester.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  A shard iterator specifies the shard position from which to start reading data records sequentially. The position is specified using the sequence number of a data record in a shard. A sequence number is the identifier associated with every record ingested in the stream, and is assigned when a record is put into the stream. Each stream has one or more shards. You must specify the shard iterator type. For example, you can set the ShardIteratorType parameter to read exactly from the position denoted by a specific sequence number by using the AT_SEQUENCE_NUMBER shard iterator type. Alternatively, the parameter can read right after the sequence number by using the AFTER_SEQUENCE_NUMBER shard iterator type, using sequence numbers returned by earlier calls to PutRecord, PutRecords, GetRecords, or DescribeStream. In the request, you can specify the shard iterator type AT_TIMESTAMP to read records from an arbitrary point in time, TRIM_HORIZON to cause ShardIterator to point to the last untrimmed record in the shard in the system (the oldest data record in the shard), or LATEST so that you always read the most recent data in the shard.  When you read repeatedly from a stream, use a GetShardIterator request to get the first shard iterator for use in your first GetRecords request and for subsequent reads use the shard iterator returned by the GetRecords request in NextShardIterator. A new shard iterator is returned by every GetRecords request in NextShardIterator, which you use in the ShardIterator parameter of the next GetRecords request.  If a GetShardIterator request is made too often, you receive a ProvisionedThroughputExceededException. For more information about throughput limits, see GetRecords, and Streams Limits in the Amazon Kinesis Data Streams Developer Guide. If the shard is closed, GetShardIterator returns a valid iterator for the last sequence number of the shard. A shard can be closed as a result of using SplitShard or MergeShards.  GetShardIterator has a limit of five transactions per second per account per open shard.
   */
  getShardIterator(callback?: (err: AWSError, data: Kinesis.Types.GetShardIteratorOutput) => void): Request<Kinesis.Types.GetShardIteratorOutput, AWSError>;
  /**
   * Increases the Kinesis data stream's retention period, which is the length of time data records are accessible after they are added to the stream. The maximum value of a stream's retention period is 8760 hours (365 days).  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  If you choose a longer stream retention period, this operation increases the time period during which records that have not yet expired are accessible. However, it does not make previous, expired data (older than the stream's previous retention period) accessible after the operation has been called. For example, if a stream's retention period is set to 24 hours and is increased to 168 hours, any data that is older than 24 hours remains inaccessible to consumer applications.
   */
  increaseStreamRetentionPeriod(params: Kinesis.Types.IncreaseStreamRetentionPeriodInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Increases the Kinesis data stream's retention period, which is the length of time data records are accessible after they are added to the stream. The maximum value of a stream's retention period is 8760 hours (365 days).  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  If you choose a longer stream retention period, this operation increases the time period during which records that have not yet expired are accessible. However, it does not make previous, expired data (older than the stream's previous retention period) accessible after the operation has been called. For example, if a stream's retention period is set to 24 hours and is increased to 168 hours, any data that is older than 24 hours remains inaccessible to consumer applications.
   */
  increaseStreamRetentionPeriod(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Lists the shards in a stream and provides information about each shard. This operation has a limit of 1000 transactions per second per data stream.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  This action does not list expired shards. For information about expired shards, see Data Routing, Data Persistence, and Shard State after a Reshard.   This API is a new operation that is used by the Amazon Kinesis Client Library (KCL). If you have a fine-grained IAM policy that only allows specific operations, you must update your policy to allow calls to this API. For more information, see Controlling Access to Amazon Kinesis Data Streams Resources Using IAM. 
   */
  listShards(params: Kinesis.Types.ListShardsInput, callback?: (err: AWSError, data: Kinesis.Types.ListShardsOutput) => void): Request<Kinesis.Types.ListShardsOutput, AWSError>;
  /**
   * Lists the shards in a stream and provides information about each shard. This operation has a limit of 1000 transactions per second per data stream.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  This action does not list expired shards. For information about expired shards, see Data Routing, Data Persistence, and Shard State after a Reshard.   This API is a new operation that is used by the Amazon Kinesis Client Library (KCL). If you have a fine-grained IAM policy that only allows specific operations, you must update your policy to allow calls to this API. For more information, see Controlling Access to Amazon Kinesis Data Streams Resources Using IAM. 
   */
  listShards(callback?: (err: AWSError, data: Kinesis.Types.ListShardsOutput) => void): Request<Kinesis.Types.ListShardsOutput, AWSError>;
  /**
   * Lists the consumers registered to receive data from a stream using enhanced fan-out, and provides information about each consumer. This operation has a limit of 5 transactions per second per stream.
   */
  listStreamConsumers(params: Kinesis.Types.ListStreamConsumersInput, callback?: (err: AWSError, data: Kinesis.Types.ListStreamConsumersOutput) => void): Request<Kinesis.Types.ListStreamConsumersOutput, AWSError>;
  /**
   * Lists the consumers registered to receive data from a stream using enhanced fan-out, and provides information about each consumer. This operation has a limit of 5 transactions per second per stream.
   */
  listStreamConsumers(callback?: (err: AWSError, data: Kinesis.Types.ListStreamConsumersOutput) => void): Request<Kinesis.Types.ListStreamConsumersOutput, AWSError>;
  /**
   * Lists your Kinesis data streams. The number of streams may be too large to return from a single call to ListStreams. You can limit the number of returned streams using the Limit parameter. If you do not specify a value for the Limit parameter, Kinesis Data Streams uses the default limit, which is currently 100. You can detect if there are more streams available to list by using the HasMoreStreams flag from the returned output. If there are more streams available, you can request more streams by using the name of the last stream returned by the ListStreams request in the ExclusiveStartStreamName parameter in a subsequent request to ListStreams. The group of stream names returned by the subsequent request is then added to the list. You can continue this process until all the stream names have been collected in the list.   ListStreams has a limit of five transactions per second per account.
   */
  listStreams(params: Kinesis.Types.ListStreamsInput, callback?: (err: AWSError, data: Kinesis.Types.ListStreamsOutput) => void): Request<Kinesis.Types.ListStreamsOutput, AWSError>;
  /**
   * Lists your Kinesis data streams. The number of streams may be too large to return from a single call to ListStreams. You can limit the number of returned streams using the Limit parameter. If you do not specify a value for the Limit parameter, Kinesis Data Streams uses the default limit, which is currently 100. You can detect if there are more streams available to list by using the HasMoreStreams flag from the returned output. If there are more streams available, you can request more streams by using the name of the last stream returned by the ListStreams request in the ExclusiveStartStreamName parameter in a subsequent request to ListStreams. The group of stream names returned by the subsequent request is then added to the list. You can continue this process until all the stream names have been collected in the list.   ListStreams has a limit of five transactions per second per account.
   */
  listStreams(callback?: (err: AWSError, data: Kinesis.Types.ListStreamsOutput) => void): Request<Kinesis.Types.ListStreamsOutput, AWSError>;
  /**
   * Lists the tags for the specified Kinesis data stream. This operation has a limit of five transactions per second per account.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter. 
   */
  listTagsForStream(params: Kinesis.Types.ListTagsForStreamInput, callback?: (err: AWSError, data: Kinesis.Types.ListTagsForStreamOutput) => void): Request<Kinesis.Types.ListTagsForStreamOutput, AWSError>;
  /**
   * Lists the tags for the specified Kinesis data stream. This operation has a limit of five transactions per second per account.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter. 
   */
  listTagsForStream(callback?: (err: AWSError, data: Kinesis.Types.ListTagsForStreamOutput) => void): Request<Kinesis.Types.ListTagsForStreamOutput, AWSError>;
  /**
   * Merges two adjacent shards in a Kinesis data stream and combines them into a single shard to reduce the stream's capacity to ingest and transport data. This API is only supported for the data streams with the provisioned capacity mode. Two shards are considered adjacent if the union of the hash key ranges for the two shards form a contiguous set with no gaps. For example, if you have two shards, one with a hash key range of 276...381 and the other with a hash key range of 382...454, then you could merge these two shards into a single shard that would have a hash key range of 276...454. After the merge, the single child shard receives data for all hash key values covered by the two parent shards.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.   MergeShards is called when there is a need to reduce the overall capacity of a stream because of excess capacity that is not being used. You must specify the shard to be merged and the adjacent shard for a stream. For more information about merging shards, see Merge Two Shards in the Amazon Kinesis Data Streams Developer Guide. If the stream is in the ACTIVE state, you can call MergeShards. If a stream is in the CREATING, UPDATING, or DELETING state, MergeShards returns a ResourceInUseException. If the specified stream does not exist, MergeShards returns a ResourceNotFoundException.  You can use DescribeStreamSummary to check the state of the stream, which is returned in StreamStatus.  MergeShards is an asynchronous operation. Upon receiving a MergeShards request, Amazon Kinesis Data Streams immediately returns a response and sets the StreamStatus to UPDATING. After the operation is completed, Kinesis Data Streams sets the StreamStatus to ACTIVE. Read and write operations continue to work while the stream is in the UPDATING state.  You use DescribeStreamSummary and the ListShards APIs to determine the shard IDs that are specified in the MergeShards request.  If you try to operate on too many streams in parallel using CreateStream, DeleteStream, MergeShards, or SplitShard, you receive a LimitExceededException.   MergeShards has a limit of five transactions per second per account.
   */
  mergeShards(params: Kinesis.Types.MergeShardsInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Merges two adjacent shards in a Kinesis data stream and combines them into a single shard to reduce the stream's capacity to ingest and transport data. This API is only supported for the data streams with the provisioned capacity mode. Two shards are considered adjacent if the union of the hash key ranges for the two shards form a contiguous set with no gaps. For example, if you have two shards, one with a hash key range of 276...381 and the other with a hash key range of 382...454, then you could merge these two shards into a single shard that would have a hash key range of 276...454. After the merge, the single child shard receives data for all hash key values covered by the two parent shards.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.   MergeShards is called when there is a need to reduce the overall capacity of a stream because of excess capacity that is not being used. You must specify the shard to be merged and the adjacent shard for a stream. For more information about merging shards, see Merge Two Shards in the Amazon Kinesis Data Streams Developer Guide. If the stream is in the ACTIVE state, you can call MergeShards. If a stream is in the CREATING, UPDATING, or DELETING state, MergeShards returns a ResourceInUseException. If the specified stream does not exist, MergeShards returns a ResourceNotFoundException.  You can use DescribeStreamSummary to check the state of the stream, which is returned in StreamStatus.  MergeShards is an asynchronous operation. Upon receiving a MergeShards request, Amazon Kinesis Data Streams immediately returns a response and sets the StreamStatus to UPDATING. After the operation is completed, Kinesis Data Streams sets the StreamStatus to ACTIVE. Read and write operations continue to work while the stream is in the UPDATING state.  You use DescribeStreamSummary and the ListShards APIs to determine the shard IDs that are specified in the MergeShards request.  If you try to operate on too many streams in parallel using CreateStream, DeleteStream, MergeShards, or SplitShard, you receive a LimitExceededException.   MergeShards has a limit of five transactions per second per account.
   */
  mergeShards(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Writes a single data record into an Amazon Kinesis data stream. Call PutRecord to send data into the stream for real-time ingestion and subsequent processing, one record at a time. Each shard can support writes up to 1,000 records per second, up to a maximum data write total of 1 MiB per second.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  You must specify the name of the stream that captures, stores, and transports the data; a partition key; and the data blob itself. The data blob can be any type of data; for example, a segment from a log file, geographic/location data, website clickstream data, and so on. The partition key is used by Kinesis Data Streams to distribute data across shards. Kinesis Data Streams segregates the data records that belong to a stream into multiple shards, using the partition key associated with each data record to determine the shard to which a given data record belongs. Partition keys are Unicode strings, with a maximum length limit of 256 characters for each key. An MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards using the hash key ranges of the shards. You can override hashing the partition key to determine the shard by explicitly specifying a hash value using the ExplicitHashKey parameter. For more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams Developer Guide.  PutRecord returns the shard ID of where the data record was placed and the sequence number that was assigned to the data record. Sequence numbers increase over time and are specific to a shard within a stream, not across all shards within a stream. To guarantee strictly increasing ordering, write serially to a shard and use the SequenceNumberForOrdering parameter. For more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams Developer Guide.  After you write a record to a stream, you cannot modify that record or its order within the stream.  If a PutRecord request cannot be processed because of insufficient provisioned throughput on the shard involved in the request, PutRecord throws ProvisionedThroughputExceededException.  By default, data records are accessible for 24 hours from the time that they are added to a stream. You can use IncreaseStreamRetentionPeriod or DecreaseStreamRetentionPeriod to modify this retention period.
   */
  putRecord(params: Kinesis.Types.PutRecordInput, callback?: (err: AWSError, data: Kinesis.Types.PutRecordOutput) => void): Request<Kinesis.Types.PutRecordOutput, AWSError>;
  /**
   * Writes a single data record into an Amazon Kinesis data stream. Call PutRecord to send data into the stream for real-time ingestion and subsequent processing, one record at a time. Each shard can support writes up to 1,000 records per second, up to a maximum data write total of 1 MiB per second.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  You must specify the name of the stream that captures, stores, and transports the data; a partition key; and the data blob itself. The data blob can be any type of data; for example, a segment from a log file, geographic/location data, website clickstream data, and so on. The partition key is used by Kinesis Data Streams to distribute data across shards. Kinesis Data Streams segregates the data records that belong to a stream into multiple shards, using the partition key associated with each data record to determine the shard to which a given data record belongs. Partition keys are Unicode strings, with a maximum length limit of 256 characters for each key. An MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards using the hash key ranges of the shards. You can override hashing the partition key to determine the shard by explicitly specifying a hash value using the ExplicitHashKey parameter. For more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams Developer Guide.  PutRecord returns the shard ID of where the data record was placed and the sequence number that was assigned to the data record. Sequence numbers increase over time and are specific to a shard within a stream, not across all shards within a stream. To guarantee strictly increasing ordering, write serially to a shard and use the SequenceNumberForOrdering parameter. For more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams Developer Guide.  After you write a record to a stream, you cannot modify that record or its order within the stream.  If a PutRecord request cannot be processed because of insufficient provisioned throughput on the shard involved in the request, PutRecord throws ProvisionedThroughputExceededException.  By default, data records are accessible for 24 hours from the time that they are added to a stream. You can use IncreaseStreamRetentionPeriod or DecreaseStreamRetentionPeriod to modify this retention period.
   */
  putRecord(callback?: (err: AWSError, data: Kinesis.Types.PutRecordOutput) => void): Request<Kinesis.Types.PutRecordOutput, AWSError>;
  /**
   * Writes multiple data records into a Kinesis data stream in a single call (also referred to as a PutRecords request). Use this operation to send data into the stream for data ingestion and processing.   When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  Each PutRecords request can support up to 500 records. Each record in the request can be as large as 1 MiB, up to a limit of 5 MiB for the entire request, including partition keys. Each shard can support writes up to 1,000 records per second, up to a maximum data write total of 1 MiB per second. You must specify the name of the stream that captures, stores, and transports the data; and an array of request Records, with each record in the array requiring a partition key and data blob. The record size limit applies to the total size of the partition key and data blob. The data blob can be any type of data; for example, a segment from a log file, geographic/location data, website clickstream data, and so on. The partition key is used by Kinesis Data Streams as input to a hash function that maps the partition key and associated data to a specific shard. An MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream. For more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams Developer Guide. Each record in the Records array may include an optional parameter, ExplicitHashKey, which overrides the partition key to shard mapping. This parameter allows a data producer to determine explicitly the shard where the record is stored. For more information, see Adding Multiple Records with PutRecords in the Amazon Kinesis Data Streams Developer Guide. The PutRecords response includes an array of response Records. Each record in the response array directly correlates with a record in the request array using natural ordering, from the top to the bottom of the request and response. The response Records array always includes the same number of records as the request array. The response Records array includes both successfully and unsuccessfully processed records. Kinesis Data Streams attempts to process all records in each PutRecords request. A single record failure does not stop the processing of subsequent records. As a result, PutRecords doesn't guarantee the ordering of records. If you need to read records in the same order they are written to the stream, use PutRecord instead of PutRecords, and write to the same shard. A successfully processed record includes ShardId and SequenceNumber values. The ShardId parameter identifies the shard in the stream where the record is stored. The SequenceNumber parameter is an identifier assigned to the put record, unique to all records in the stream. An unsuccessfully processed record includes ErrorCode and ErrorMessage values. ErrorCode reflects the type of error and can be one of the following values: ProvisionedThroughputExceededException or InternalFailure. ErrorMessage provides more detailed information about the ProvisionedThroughputExceededException exception including the account ID, stream name, and shard ID of the record that was throttled. For more information about partially successful responses, see Adding Multiple Records with PutRecords in the Amazon Kinesis Data Streams Developer Guide.  After you write a record to a stream, you cannot modify that record or its order within the stream.  By default, data records are accessible for 24 hours from the time that they are added to a stream. You can use IncreaseStreamRetentionPeriod or DecreaseStreamRetentionPeriod to modify this retention period.
   */
  putRecords(params: Kinesis.Types.PutRecordsInput, callback?: (err: AWSError, data: Kinesis.Types.PutRecordsOutput) => void): Request<Kinesis.Types.PutRecordsOutput, AWSError>;
  /**
   * Writes multiple data records into a Kinesis data stream in a single call (also referred to as a PutRecords request). Use this operation to send data into the stream for data ingestion and processing.   When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  Each PutRecords request can support up to 500 records. Each record in the request can be as large as 1 MiB, up to a limit of 5 MiB for the entire request, including partition keys. Each shard can support writes up to 1,000 records per second, up to a maximum data write total of 1 MiB per second. You must specify the name of the stream that captures, stores, and transports the data; and an array of request Records, with each record in the array requiring a partition key and data blob. The record size limit applies to the total size of the partition key and data blob. The data blob can be any type of data; for example, a segment from a log file, geographic/location data, website clickstream data, and so on. The partition key is used by Kinesis Data Streams as input to a hash function that maps the partition key and associated data to a specific shard. An MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream. For more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams Developer Guide. Each record in the Records array may include an optional parameter, ExplicitHashKey, which overrides the partition key to shard mapping. This parameter allows a data producer to determine explicitly the shard where the record is stored. For more information, see Adding Multiple Records with PutRecords in the Amazon Kinesis Data Streams Developer Guide. The PutRecords response includes an array of response Records. Each record in the response array directly correlates with a record in the request array using natural ordering, from the top to the bottom of the request and response. The response Records array always includes the same number of records as the request array. The response Records array includes both successfully and unsuccessfully processed records. Kinesis Data Streams attempts to process all records in each PutRecords request. A single record failure does not stop the processing of subsequent records. As a result, PutRecords doesn't guarantee the ordering of records. If you need to read records in the same order they are written to the stream, use PutRecord instead of PutRecords, and write to the same shard. A successfully processed record includes ShardId and SequenceNumber values. The ShardId parameter identifies the shard in the stream where the record is stored. The SequenceNumber parameter is an identifier assigned to the put record, unique to all records in the stream. An unsuccessfully processed record includes ErrorCode and ErrorMessage values. ErrorCode reflects the type of error and can be one of the following values: ProvisionedThroughputExceededException or InternalFailure. ErrorMessage provides more detailed information about the ProvisionedThroughputExceededException exception including the account ID, stream name, and shard ID of the record that was throttled. For more information about partially successful responses, see Adding Multiple Records with PutRecords in the Amazon Kinesis Data Streams Developer Guide.  After you write a record to a stream, you cannot modify that record or its order within the stream.  By default, data records are accessible for 24 hours from the time that they are added to a stream. You can use IncreaseStreamRetentionPeriod or DecreaseStreamRetentionPeriod to modify this retention period.
   */
  putRecords(callback?: (err: AWSError, data: Kinesis.Types.PutRecordsOutput) => void): Request<Kinesis.Types.PutRecordsOutput, AWSError>;
  /**
   * Registers a consumer with a Kinesis data stream. When you use this operation, the consumer you register can then call SubscribeToShard to receive data from the stream using enhanced fan-out, at a rate of up to 2 MiB per second for every shard you subscribe to. This rate is unaffected by the total number of consumers that read from the same stream. You can register up to 20 consumers per stream. A given consumer can only be registered with one stream at a time. For an example of how to use this operations, see Enhanced Fan-Out Using the Kinesis Data Streams API. The use of this operation has a limit of five transactions per second per account. Also, only 5 consumers can be created simultaneously. In other words, you cannot have more than 5 consumers in a CREATING status at the same time. Registering a 6th consumer while there are 5 in a CREATING status results in a LimitExceededException.
   */
  registerStreamConsumer(params: Kinesis.Types.RegisterStreamConsumerInput, callback?: (err: AWSError, data: Kinesis.Types.RegisterStreamConsumerOutput) => void): Request<Kinesis.Types.RegisterStreamConsumerOutput, AWSError>;
  /**
   * Registers a consumer with a Kinesis data stream. When you use this operation, the consumer you register can then call SubscribeToShard to receive data from the stream using enhanced fan-out, at a rate of up to 2 MiB per second for every shard you subscribe to. This rate is unaffected by the total number of consumers that read from the same stream. You can register up to 20 consumers per stream. A given consumer can only be registered with one stream at a time. For an example of how to use this operations, see Enhanced Fan-Out Using the Kinesis Data Streams API. The use of this operation has a limit of five transactions per second per account. Also, only 5 consumers can be created simultaneously. In other words, you cannot have more than 5 consumers in a CREATING status at the same time. Registering a 6th consumer while there are 5 in a CREATING status results in a LimitExceededException.
   */
  registerStreamConsumer(callback?: (err: AWSError, data: Kinesis.Types.RegisterStreamConsumerOutput) => void): Request<Kinesis.Types.RegisterStreamConsumerOutput, AWSError>;
  /**
   * Removes tags from the specified Kinesis data stream. Removed tags are deleted and cannot be recovered after this operation successfully completes.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  If you specify a tag that does not exist, it is ignored.  RemoveTagsFromStream has a limit of five transactions per second per account.
   */
  removeTagsFromStream(params: Kinesis.Types.RemoveTagsFromStreamInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from the specified Kinesis data stream. Removed tags are deleted and cannot be recovered after this operation successfully completes.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  If you specify a tag that does not exist, it is ignored.  RemoveTagsFromStream has a limit of five transactions per second per account.
   */
  removeTagsFromStream(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Splits a shard into two new shards in the Kinesis data stream, to increase the stream's capacity to ingest and transport data. SplitShard is called when there is a need to increase the overall capacity of a stream because of an expected increase in the volume of data records being ingested. This API is only supported for the data streams with the provisioned capacity mode.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  You can also use SplitShard when a shard appears to be approaching its maximum utilization; for example, the producers sending data into the specific shard are suddenly sending more than previously anticipated. You can also call SplitShard to increase stream capacity, so that more Kinesis Data Streams applications can simultaneously read data from the stream for real-time processing.  You must specify the shard to be split and the new hash key, which is the position in the shard where the shard gets split in two. In many cases, the new hash key might be the average of the beginning and ending hash key, but it can be any hash key value in the range being mapped into the shard. For more information, see Split a Shard in the Amazon Kinesis Data Streams Developer Guide. You can use DescribeStreamSummary and the ListShards APIs to determine the shard ID and hash key values for the ShardToSplit and NewStartingHashKey parameters that are specified in the SplitShard request.  SplitShard is an asynchronous operation. Upon receiving a SplitShard request, Kinesis Data Streams immediately returns a response and sets the stream status to UPDATING. After the operation is completed, Kinesis Data Streams sets the stream status to ACTIVE. Read and write operations continue to work while the stream is in the UPDATING state.  You can use DescribeStreamSummary to check the status of the stream, which is returned in StreamStatus. If the stream is in the ACTIVE state, you can call SplitShard.  If the specified stream does not exist, DescribeStreamSummary returns a ResourceNotFoundException. If you try to create more shards than are authorized for your account, you receive a LimitExceededException.  For the default shard limit for an Amazon Web Services account, see Kinesis Data Streams Limits in the Amazon Kinesis Data Streams Developer Guide. To increase this limit, contact Amazon Web Services Support. If you try to operate on too many streams simultaneously using CreateStream, DeleteStream, MergeShards, and/or SplitShard, you receive a LimitExceededException.   SplitShard has a limit of five transactions per second per account.
   */
  splitShard(params: Kinesis.Types.SplitShardInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Splits a shard into two new shards in the Kinesis data stream, to increase the stream's capacity to ingest and transport data. SplitShard is called when there is a need to increase the overall capacity of a stream because of an expected increase in the volume of data records being ingested. This API is only supported for the data streams with the provisioned capacity mode.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  You can also use SplitShard when a shard appears to be approaching its maximum utilization; for example, the producers sending data into the specific shard are suddenly sending more than previously anticipated. You can also call SplitShard to increase stream capacity, so that more Kinesis Data Streams applications can simultaneously read data from the stream for real-time processing.  You must specify the shard to be split and the new hash key, which is the position in the shard where the shard gets split in two. In many cases, the new hash key might be the average of the beginning and ending hash key, but it can be any hash key value in the range being mapped into the shard. For more information, see Split a Shard in the Amazon Kinesis Data Streams Developer Guide. You can use DescribeStreamSummary and the ListShards APIs to determine the shard ID and hash key values for the ShardToSplit and NewStartingHashKey parameters that are specified in the SplitShard request.  SplitShard is an asynchronous operation. Upon receiving a SplitShard request, Kinesis Data Streams immediately returns a response and sets the stream status to UPDATING. After the operation is completed, Kinesis Data Streams sets the stream status to ACTIVE. Read and write operations continue to work while the stream is in the UPDATING state.  You can use DescribeStreamSummary to check the status of the stream, which is returned in StreamStatus. If the stream is in the ACTIVE state, you can call SplitShard.  If the specified stream does not exist, DescribeStreamSummary returns a ResourceNotFoundException. If you try to create more shards than are authorized for your account, you receive a LimitExceededException.  For the default shard limit for an Amazon Web Services account, see Kinesis Data Streams Limits in the Amazon Kinesis Data Streams Developer Guide. To increase this limit, contact Amazon Web Services Support. If you try to operate on too many streams simultaneously using CreateStream, DeleteStream, MergeShards, and/or SplitShard, you receive a LimitExceededException.   SplitShard has a limit of five transactions per second per account.
   */
  splitShard(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables or updates server-side encryption using an Amazon Web Services KMS key for a specified stream.  Starting encryption is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to UPDATING. After the update is complete, Kinesis Data Streams sets the status of the stream back to ACTIVE. Updating or applying encryption normally takes a few seconds to complete, but it can take minutes. You can continue to read and write data to your stream while its status is UPDATING. Once the status of the stream is ACTIVE, encryption begins for records written to the stream.  API Limits: You can successfully apply a new Amazon Web Services KMS key for server-side encryption 25 times in a rolling 24-hour period. Note: It can take up to 5 seconds after the stream is in an ACTIVE status before all records written to the stream are encrypted. After you enable encryption, you can verify that encryption is applied by inspecting the API response from PutRecord or PutRecords.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter. 
   */
  startStreamEncryption(params: Kinesis.Types.StartStreamEncryptionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables or updates server-side encryption using an Amazon Web Services KMS key for a specified stream.  Starting encryption is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to UPDATING. After the update is complete, Kinesis Data Streams sets the status of the stream back to ACTIVE. Updating or applying encryption normally takes a few seconds to complete, but it can take minutes. You can continue to read and write data to your stream while its status is UPDATING. Once the status of the stream is ACTIVE, encryption begins for records written to the stream.  API Limits: You can successfully apply a new Amazon Web Services KMS key for server-side encryption 25 times in a rolling 24-hour period. Note: It can take up to 5 seconds after the stream is in an ACTIVE status before all records written to the stream are encrypted. After you enable encryption, you can verify that encryption is applied by inspecting the API response from PutRecord or PutRecords.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter. 
   */
  startStreamEncryption(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables server-side encryption for a specified stream.   When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  Stopping encryption is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to UPDATING. After the update is complete, Kinesis Data Streams sets the status of the stream back to ACTIVE. Stopping encryption normally takes a few seconds to complete, but it can take minutes. You can continue to read and write data to your stream while its status is UPDATING. Once the status of the stream is ACTIVE, records written to the stream are no longer encrypted by Kinesis Data Streams.  API Limits: You can successfully disable server-side encryption 25 times in a rolling 24-hour period.  Note: It can take up to 5 seconds after the stream is in an ACTIVE status before all records written to the stream are no longer subject to encryption. After you disabled encryption, you can verify that encryption is not applied by inspecting the API response from PutRecord or PutRecords.
   */
  stopStreamEncryption(params: Kinesis.Types.StopStreamEncryptionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables server-side encryption for a specified stream.   When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  Stopping encryption is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to UPDATING. After the update is complete, Kinesis Data Streams sets the status of the stream back to ACTIVE. Stopping encryption normally takes a few seconds to complete, but it can take minutes. You can continue to read and write data to your stream while its status is UPDATING. Once the status of the stream is ACTIVE, records written to the stream are no longer encrypted by Kinesis Data Streams.  API Limits: You can successfully disable server-side encryption 25 times in a rolling 24-hour period.  Note: It can take up to 5 seconds after the stream is in an ACTIVE status before all records written to the stream are no longer subject to encryption. After you disabled encryption, you can verify that encryption is not applied by inspecting the API response from PutRecord or PutRecords.
   */
  stopStreamEncryption(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the shard count of the specified stream to the specified number of shards. This API is only supported for the data streams with the provisioned capacity mode.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  Updating the shard count is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to UPDATING. After the update is complete, Kinesis Data Streams sets the status of the stream back to ACTIVE. Depending on the size of the stream, the scaling action could take a few minutes to complete. You can continue to read and write data to your stream while its status is UPDATING. To update the shard count, Kinesis Data Streams performs splits or merges on individual shards. This can cause short-lived shards to be created, in addition to the final shards. These short-lived shards count towards your total shard limit for your account in the Region. When using this operation, we recommend that you specify a target shard count that is a multiple of 25% (25%, 50%, 75%, 100%). You can specify any target value within your shard limit. However, if you specify a target that isn't a multiple of 25%, the scaling action might take longer to complete.  This operation has the following default limits. By default, you cannot do the following:   Scale more than ten times per rolling 24-hour period per stream   Scale up to more than double your current shard count for a stream   Scale down below half your current shard count for a stream   Scale up to more than 10000 shards in a stream   Scale a stream with more than 10000 shards down unless the result is less than 10000 shards   Scale up to more than the shard limit for your account   For the default limits for an Amazon Web Services account, see Streams Limits in the Amazon Kinesis Data Streams Developer Guide. To request an increase in the call rate limit, the shard limit for this API, or your overall shard limit, use the limits form.
   */
  updateShardCount(params: Kinesis.Types.UpdateShardCountInput, callback?: (err: AWSError, data: Kinesis.Types.UpdateShardCountOutput) => void): Request<Kinesis.Types.UpdateShardCountOutput, AWSError>;
  /**
   * Updates the shard count of the specified stream to the specified number of shards. This API is only supported for the data streams with the provisioned capacity mode.  When invoking this API, it is recommended you use the StreamARN input parameter rather than the StreamName input parameter.  Updating the shard count is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to UPDATING. After the update is complete, Kinesis Data Streams sets the status of the stream back to ACTIVE. Depending on the size of the stream, the scaling action could take a few minutes to complete. You can continue to read and write data to your stream while its status is UPDATING. To update the shard count, Kinesis Data Streams performs splits or merges on individual shards. This can cause short-lived shards to be created, in addition to the final shards. These short-lived shards count towards your total shard limit for your account in the Region. When using this operation, we recommend that you specify a target shard count that is a multiple of 25% (25%, 50%, 75%, 100%). You can specify any target value within your shard limit. However, if you specify a target that isn't a multiple of 25%, the scaling action might take longer to complete.  This operation has the following default limits. By default, you cannot do the following:   Scale more than ten times per rolling 24-hour period per stream   Scale up to more than double your current shard count for a stream   Scale down below half your current shard count for a stream   Scale up to more than 10000 shards in a stream   Scale a stream with more than 10000 shards down unless the result is less than 10000 shards   Scale up to more than the shard limit for your account   For the default limits for an Amazon Web Services account, see Streams Limits in the Amazon Kinesis Data Streams Developer Guide. To request an increase in the call rate limit, the shard limit for this API, or your overall shard limit, use the limits form.
   */
  updateShardCount(callback?: (err: AWSError, data: Kinesis.Types.UpdateShardCountOutput) => void): Request<Kinesis.Types.UpdateShardCountOutput, AWSError>;
  /**
   *  Updates the capacity mode of the data stream. Currently, in Kinesis Data Streams, you can choose between an on-demand capacity mode and a provisioned capacity mode for your data stream. 
   */
  updateStreamMode(params: Kinesis.Types.UpdateStreamModeInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Updates the capacity mode of the data stream. Currently, in Kinesis Data Streams, you can choose between an on-demand capacity mode and a provisioned capacity mode for your data stream. 
   */
  updateStreamMode(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Waits for the streamExists state by periodically calling the underlying Kinesis.describeStreamoperation every 10 seconds (at most 18 times).
   */
  waitFor(state: "streamExists", params: Kinesis.Types.DescribeStreamInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamOutput) => void): Request<Kinesis.Types.DescribeStreamOutput, AWSError>;
  /**
   * Waits for the streamExists state by periodically calling the underlying Kinesis.describeStreamoperation every 10 seconds (at most 18 times).
   */
  waitFor(state: "streamExists", callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamOutput) => void): Request<Kinesis.Types.DescribeStreamOutput, AWSError>;
  /**
   * Waits for the streamNotExists state by periodically calling the underlying Kinesis.describeStreamoperation every 10 seconds (at most 18 times).
   */
  waitFor(state: "streamNotExists", params: Kinesis.Types.DescribeStreamInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamOutput) => void): Request<Kinesis.Types.DescribeStreamOutput, AWSError>;
  /**
   * Waits for the streamNotExists state by periodically calling the underlying Kinesis.describeStreamoperation every 10 seconds (at most 18 times).
   */
  waitFor(state: "streamNotExists", callback?: (err: AWSError, data: Kinesis.Types.DescribeStreamOutput) => void): Request<Kinesis.Types.DescribeStreamOutput, AWSError>;
}
declare namespace Kinesis {
  export interface AddTagsToStreamInput {
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * A set of up to 10 key-value pairs to use to create the tags.
     */
    Tags: TagMap;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type BooleanObject = boolean;
  export interface ChildShard {
    /**
     * The shard ID of the existing child shard of the current shard.
     */
    ShardId: ShardId;
    /**
     * The current shard that is the parent of the existing child shard.
     */
    ParentShards: ShardIdList;
    HashKeyRange: HashKeyRange;
  }
  export type ChildShardList = ChildShard[];
  export interface Consumer {
    /**
     * The name of the consumer is something you choose when you register the consumer.
     */
    ConsumerName: ConsumerName;
    /**
     * When you register a consumer, Kinesis Data Streams generates an ARN for it. You need this ARN to be able to call SubscribeToShard. If you delete a consumer and then create a new one with the same name, it won't have the same ARN. That's because consumer ARNs contain the creation timestamp. This is important to keep in mind if you have IAM policies that reference consumer ARNs.
     */
    ConsumerARN: ConsumerARN;
    /**
     * A consumer can't read data while in the CREATING or DELETING states.
     */
    ConsumerStatus: ConsumerStatus;
    /**
     * 
     */
    ConsumerCreationTimestamp: Timestamp;
  }
  export type ConsumerARN = string;
  export type ConsumerCountObject = number;
  export interface ConsumerDescription {
    /**
     * The name of the consumer is something you choose when you register the consumer.
     */
    ConsumerName: ConsumerName;
    /**
     * When you register a consumer, Kinesis Data Streams generates an ARN for it. You need this ARN to be able to call SubscribeToShard. If you delete a consumer and then create a new one with the same name, it won't have the same ARN. That's because consumer ARNs contain the creation timestamp. This is important to keep in mind if you have IAM policies that reference consumer ARNs.
     */
    ConsumerARN: ConsumerARN;
    /**
     * A consumer can't read data while in the CREATING or DELETING states.
     */
    ConsumerStatus: ConsumerStatus;
    /**
     * 
     */
    ConsumerCreationTimestamp: Timestamp;
    /**
     * The ARN of the stream with which you registered the consumer.
     */
    StreamARN: StreamARN;
  }
  export type ConsumerList = Consumer[];
  export type ConsumerName = string;
  export type ConsumerStatus = "CREATING"|"DELETING"|"ACTIVE"|string;
  export interface CreateStreamInput {
    /**
     * A name to identify the stream. The stream name is scoped to the Amazon Web Services account used by the application that creates the stream. It is also scoped by Amazon Web Services Region. That is, two streams in two different Amazon Web Services accounts can have the same name. Two streams in the same Amazon Web Services account but in two different Regions can also have the same name.
     */
    StreamName: StreamName;
    /**
     * The number of shards that the stream will use. The throughput of the stream is a function of the number of shards; more shards are required for greater provisioned throughput.
     */
    ShardCount?: PositiveIntegerObject;
    /**
     *  Indicates the capacity mode of the data stream. Currently, in Kinesis Data Streams, you can choose between an on-demand capacity mode and a provisioned capacity mode for your data streams.
     */
    StreamModeDetails?: StreamModeDetails;
  }
  export type Data = Buffer|Uint8Array|Blob|string;
  export interface DecreaseStreamRetentionPeriodInput {
    /**
     * The name of the stream to modify.
     */
    StreamName?: StreamName;
    /**
     * The new retention period of the stream, in hours. Must be less than the current retention period.
     */
    RetentionPeriodHours: RetentionPeriodHours;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface DeleteStreamInput {
    /**
     * The name of the stream to delete.
     */
    StreamName?: StreamName;
    /**
     * If this parameter is unset (null) or if you set it to false, and the stream has registered consumers, the call to DeleteStream fails with a ResourceInUseException. 
     */
    EnforceConsumerDeletion?: BooleanObject;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface DeregisterStreamConsumerInput {
    /**
     * The ARN of the Kinesis data stream that the consumer is registered with. For more information, see Amazon Resource Names (ARNs) and Amazon Web Services Service Namespaces.
     */
    StreamARN?: StreamARN;
    /**
     * The name that you gave to the consumer.
     */
    ConsumerName?: ConsumerName;
    /**
     * The ARN returned by Kinesis Data Streams when you registered the consumer. If you don't know the ARN of the consumer that you want to deregister, you can use the ListStreamConsumers operation to get a list of the descriptions of all the consumers that are currently registered with a given data stream. The description of a consumer contains its ARN.
     */
    ConsumerARN?: ConsumerARN;
  }
  export interface DescribeLimitsInput {
  }
  export interface DescribeLimitsOutput {
    /**
     * The maximum number of shards.
     */
    ShardLimit: ShardCountObject;
    /**
     * The number of open shards.
     */
    OpenShardCount: ShardCountObject;
    /**
     *  Indicates the number of data streams with the on-demand capacity mode.
     */
    OnDemandStreamCount: OnDemandStreamCountObject;
    /**
     *  The maximum number of data streams with the on-demand capacity mode. 
     */
    OnDemandStreamCountLimit: OnDemandStreamCountLimitObject;
  }
  export interface DescribeStreamConsumerInput {
    /**
     * The ARN of the Kinesis data stream that the consumer is registered with. For more information, see Amazon Resource Names (ARNs) and Amazon Web Services Service Namespaces.
     */
    StreamARN?: StreamARN;
    /**
     * The name that you gave to the consumer.
     */
    ConsumerName?: ConsumerName;
    /**
     * The ARN returned by Kinesis Data Streams when you registered the consumer.
     */
    ConsumerARN?: ConsumerARN;
  }
  export interface DescribeStreamConsumerOutput {
    /**
     * An object that represents the details of the consumer.
     */
    ConsumerDescription: ConsumerDescription;
  }
  export interface DescribeStreamInput {
    /**
     * The name of the stream to describe.
     */
    StreamName?: StreamName;
    /**
     * The maximum number of shards to return in a single call. The default value is 100. If you specify a value greater than 100, at most 100 results are returned.
     */
    Limit?: DescribeStreamInputLimit;
    /**
     * The shard ID of the shard to start with. Specify this parameter to indicate that you want to describe the stream starting with the shard whose ID immediately follows ExclusiveStartShardId. If you don't specify this parameter, the default behavior for DescribeStream is to describe the stream starting with the first shard in the stream.
     */
    ExclusiveStartShardId?: ShardId;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type DescribeStreamInputLimit = number;
  export interface DescribeStreamOutput {
    /**
     * The current status of the stream, the stream Amazon Resource Name (ARN), an array of shard objects that comprise the stream, and whether there are more shards available.
     */
    StreamDescription: StreamDescription;
  }
  export interface DescribeStreamSummaryInput {
    /**
     * The name of the stream to describe.
     */
    StreamName?: StreamName;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface DescribeStreamSummaryOutput {
    /**
     * A StreamDescriptionSummary containing information about the stream.
     */
    StreamDescriptionSummary: StreamDescriptionSummary;
  }
  export interface DisableEnhancedMonitoringInput {
    /**
     * The name of the Kinesis data stream for which to disable enhanced monitoring.
     */
    StreamName?: StreamName;
    /**
     * List of shard-level metrics to disable. The following are the valid shard-level metrics. The value "ALL" disables every metric.    IncomingBytes     IncomingRecords     OutgoingBytes     OutgoingRecords     WriteProvisionedThroughputExceeded     ReadProvisionedThroughputExceeded     IteratorAgeMilliseconds     ALL    For more information, see Monitoring the Amazon Kinesis Data Streams Service with Amazon CloudWatch in the Amazon Kinesis Data Streams Developer Guide.
     */
    ShardLevelMetrics: MetricsNameList;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface EnableEnhancedMonitoringInput {
    /**
     * The name of the stream for which to enable enhanced monitoring.
     */
    StreamName?: StreamName;
    /**
     * List of shard-level metrics to enable. The following are the valid shard-level metrics. The value "ALL" enables every metric.    IncomingBytes     IncomingRecords     OutgoingBytes     OutgoingRecords     WriteProvisionedThroughputExceeded     ReadProvisionedThroughputExceeded     IteratorAgeMilliseconds     ALL    For more information, see Monitoring the Amazon Kinesis Data Streams Service with Amazon CloudWatch in the Amazon Kinesis Data Streams Developer Guide.
     */
    ShardLevelMetrics: MetricsNameList;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type EncryptionType = "NONE"|"KMS"|string;
  export interface EnhancedMetrics {
    /**
     * List of shard-level metrics. The following are the valid shard-level metrics. The value "ALL" enhances every metric.    IncomingBytes     IncomingRecords     OutgoingBytes     OutgoingRecords     WriteProvisionedThroughputExceeded     ReadProvisionedThroughputExceeded     IteratorAgeMilliseconds     ALL    For more information, see Monitoring the Amazon Kinesis Data Streams Service with Amazon CloudWatch in the Amazon Kinesis Data Streams Developer Guide.
     */
    ShardLevelMetrics?: MetricsNameList;
  }
  export type EnhancedMonitoringList = EnhancedMetrics[];
  export interface EnhancedMonitoringOutput {
    /**
     * The name of the Kinesis data stream.
     */
    StreamName?: StreamName;
    /**
     * Represents the current state of the metrics that are in the enhanced state before the operation.
     */
    CurrentShardLevelMetrics?: MetricsNameList;
    /**
     * Represents the list of all the metrics that would be in the enhanced state after the operation.
     */
    DesiredShardLevelMetrics?: MetricsNameList;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export interface GetRecordsInput {
    /**
     * The position in the shard from which you want to start sequentially reading data records. A shard iterator specifies this position using the sequence number of a data record in the shard.
     */
    ShardIterator: ShardIterator;
    /**
     * The maximum number of records to return. Specify a value of up to 10,000. If you specify a value that is greater than 10,000, GetRecords throws InvalidArgumentException. The default value is 10,000.
     */
    Limit?: GetRecordsInputLimit;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type GetRecordsInputLimit = number;
  export interface GetRecordsOutput {
    /**
     * The data records retrieved from the shard.
     */
    Records: RecordList;
    /**
     * The next position in the shard from which to start sequentially reading data records. If set to null, the shard has been closed and the requested iterator does not return any more data. 
     */
    NextShardIterator?: ShardIterator;
    /**
     * The number of milliseconds the GetRecords response is from the tip of the stream, indicating how far behind current time the consumer is. A value of zero indicates that record processing is caught up, and there are no new records to process at this moment.
     */
    MillisBehindLatest?: MillisBehindLatest;
    /**
     * The list of the current shard's child shards, returned in the GetRecords API's response only when the end of the current shard is reached.
     */
    ChildShards?: ChildShardList;
  }
  export interface GetShardIteratorInput {
    /**
     * The name of the Amazon Kinesis data stream.
     */
    StreamName?: StreamName;
    /**
     * The shard ID of the Kinesis Data Streams shard to get the iterator for.
     */
    ShardId: ShardId;
    /**
     * Determines how the shard iterator is used to start reading data records from the shard. The following are the valid Amazon Kinesis shard iterator types:   AT_SEQUENCE_NUMBER - Start reading from the position denoted by a specific sequence number, provided in the value StartingSequenceNumber.   AFTER_SEQUENCE_NUMBER - Start reading right after the position denoted by a specific sequence number, provided in the value StartingSequenceNumber.   AT_TIMESTAMP - Start reading from the position denoted by a specific time stamp, provided in the value Timestamp.   TRIM_HORIZON - Start reading at the last untrimmed record in the shard in the system, which is the oldest data record in the shard.   LATEST - Start reading just after the most recent record in the shard, so that you always read the most recent data in the shard.  
     */
    ShardIteratorType: ShardIteratorType;
    /**
     * The sequence number of the data record in the shard from which to start reading. Used with shard iterator type AT_SEQUENCE_NUMBER and AFTER_SEQUENCE_NUMBER.
     */
    StartingSequenceNumber?: SequenceNumber;
    /**
     * The time stamp of the data record from which to start reading. Used with shard iterator type AT_TIMESTAMP. A time stamp is the Unix epoch date with precision in milliseconds. For example, 2016-04-04T19:58:46.480-00:00 or 1459799926.480. If a record with this exact time stamp does not exist, the iterator returned is for the next (later) record. If the time stamp is older than the current trim horizon, the iterator returned is for the oldest untrimmed data record (TRIM_HORIZON).
     */
    Timestamp?: Timestamp;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface GetShardIteratorOutput {
    /**
     * The position in the shard from which to start reading data records sequentially. A shard iterator specifies this position using the sequence number of a data record in a shard.
     */
    ShardIterator?: ShardIterator;
  }
  export type HashKey = string;
  export interface HashKeyRange {
    /**
     * The starting hash key of the hash key range.
     */
    StartingHashKey: HashKey;
    /**
     * The ending hash key of the hash key range.
     */
    EndingHashKey: HashKey;
  }
  export interface IncreaseStreamRetentionPeriodInput {
    /**
     * The name of the stream to modify.
     */
    StreamName?: StreamName;
    /**
     * The new retention period of the stream, in hours. Must be more than the current retention period.
     */
    RetentionPeriodHours: RetentionPeriodHours;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type KeyId = string;
  export interface ListShardsInput {
    /**
     * The name of the data stream whose shards you want to list.  You cannot specify this parameter if you specify the NextToken parameter.
     */
    StreamName?: StreamName;
    /**
     * When the number of shards in the data stream is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of shards in the data stream, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListShards to list the next set of shards. Don't specify StreamName or StreamCreationTimestamp if you specify NextToken because the latter unambiguously identifies the stream. You can optionally specify a value for the MaxResults parameter when you specify NextToken. If you specify a MaxResults value that is less than the number of shards that the operation returns if you don't specify MaxResults, the response will contain a new NextToken value. You can use the new NextToken value in a subsequent call to the ListShards operation.  Tokens expire after 300 seconds. When you obtain a value for NextToken in the response to a call to ListShards, you have 300 seconds to use that value. If you specify an expired token in a call to ListShards, you get ExpiredNextTokenException. 
     */
    NextToken?: NextToken;
    /**
     * Specify this parameter to indicate that you want to list the shards starting with the shard whose ID immediately follows ExclusiveStartShardId. If you don't specify this parameter, the default behavior is for ListShards to list the shards starting with the first one in the stream. You cannot specify this parameter if you specify NextToken.
     */
    ExclusiveStartShardId?: ShardId;
    /**
     * The maximum number of shards to return in a single call to ListShards. The maximum number of shards to return in a single call. The default value is 1000. If you specify a value greater than 1000, at most 1000 results are returned.  When the number of shards to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListShards to list the next set of shards.
     */
    MaxResults?: ListShardsInputLimit;
    /**
     * Specify this input parameter to distinguish data streams that have the same name. For example, if you create a data stream and then delete it, and you later create another data stream with the same name, you can use this input parameter to specify which of the two streams you want to list the shards for. You cannot specify this parameter if you specify the NextToken parameter.
     */
    StreamCreationTimestamp?: Timestamp;
    /**
     * Enables you to filter out the response of the ListShards API. You can only specify one filter at a time.  If you use the ShardFilter parameter when invoking the ListShards API, the Type is the required property and must be specified. If you specify the AT_TRIM_HORIZON, FROM_TRIM_HORIZON, or AT_LATEST types, you do not need to specify either the ShardId or the Timestamp optional properties.  If you specify the AFTER_SHARD_ID type, you must also provide the value for the optional ShardId property. The ShardId property is identical in fuctionality to the ExclusiveStartShardId parameter of the ListShards API. When ShardId property is specified, the response includes the shards starting with the shard whose ID immediately follows the ShardId that you provided.  If you specify the AT_TIMESTAMP or FROM_TIMESTAMP_ID type, you must also provide the value for the optional Timestamp property. If you specify the AT_TIMESTAMP type, then all shards that were open at the provided timestamp are returned. If you specify the FROM_TIMESTAMP type, then all shards starting from the provided timestamp to TIP are returned. 
     */
    ShardFilter?: ShardFilter;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type ListShardsInputLimit = number;
  export interface ListShardsOutput {
    /**
     * An array of JSON objects. Each object represents one shard and specifies the IDs of the shard, the shard's parent, and the shard that's adjacent to the shard's parent. Each object also contains the starting and ending hash keys and the starting and ending sequence numbers for the shard.
     */
    Shards?: ShardList;
    /**
     * When the number of shards in the data stream is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of shards in the data stream, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListShards to list the next set of shards. For more information about the use of this pagination token when calling the ListShards operation, see ListShardsInput$NextToken.  Tokens expire after 300 seconds. When you obtain a value for NextToken in the response to a call to ListShards, you have 300 seconds to use that value. If you specify an expired token in a call to ListShards, you get ExpiredNextTokenException. 
     */
    NextToken?: NextToken;
  }
  export interface ListStreamConsumersInput {
    /**
     * The ARN of the Kinesis data stream for which you want to list the registered consumers. For more information, see Amazon Resource Names (ARNs) and Amazon Web Services Service Namespaces.
     */
    StreamARN: StreamARN;
    /**
     * When the number of consumers that are registered with the data stream is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of consumers that are registered with the data stream, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListStreamConsumers to list the next set of registered consumers. Don't specify StreamName or StreamCreationTimestamp if you specify NextToken because the latter unambiguously identifies the stream. You can optionally specify a value for the MaxResults parameter when you specify NextToken. If you specify a MaxResults value that is less than the number of consumers that the operation returns if you don't specify MaxResults, the response will contain a new NextToken value. You can use the new NextToken value in a subsequent call to the ListStreamConsumers operation to list the next set of consumers.  Tokens expire after 300 seconds. When you obtain a value for NextToken in the response to a call to ListStreamConsumers, you have 300 seconds to use that value. If you specify an expired token in a call to ListStreamConsumers, you get ExpiredNextTokenException. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of consumers that you want a single call of ListStreamConsumers to return. The default value is 100. If you specify a value greater than 100, at most 100 results are returned. 
     */
    MaxResults?: ListStreamConsumersInputLimit;
    /**
     * Specify this input parameter to distinguish data streams that have the same name. For example, if you create a data stream and then delete it, and you later create another data stream with the same name, you can use this input parameter to specify which of the two streams you want to list the consumers for.  You can't specify this parameter if you specify the NextToken parameter. 
     */
    StreamCreationTimestamp?: Timestamp;
  }
  export type ListStreamConsumersInputLimit = number;
  export interface ListStreamConsumersOutput {
    /**
     * An array of JSON objects. Each object represents one registered consumer.
     */
    Consumers?: ConsumerList;
    /**
     * When the number of consumers that are registered with the data stream is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of registered consumers, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListStreamConsumers to list the next set of registered consumers. For more information about the use of this pagination token when calling the ListStreamConsumers operation, see ListStreamConsumersInput$NextToken.  Tokens expire after 300 seconds. When you obtain a value for NextToken in the response to a call to ListStreamConsumers, you have 300 seconds to use that value. If you specify an expired token in a call to ListStreamConsumers, you get ExpiredNextTokenException. 
     */
    NextToken?: NextToken;
  }
  export interface ListStreamsInput {
    /**
     * The maximum number of streams to list. The default value is 100. If you specify a value greater than 100, at most 100 results are returned.
     */
    Limit?: ListStreamsInputLimit;
    /**
     * The name of the stream to start the list with.
     */
    ExclusiveStartStreamName?: StreamName;
    /**
     * 
     */
    NextToken?: NextToken;
  }
  export type ListStreamsInputLimit = number;
  export interface ListStreamsOutput {
    /**
     * The names of the streams that are associated with the Amazon Web Services account making the ListStreams request.
     */
    StreamNames: StreamNameList;
    /**
     * If set to true, there are more streams available to list.
     */
    HasMoreStreams: BooleanObject;
    /**
     * 
     */
    NextToken?: NextToken;
    /**
     * 
     */
    StreamSummaries?: StreamSummaryList;
  }
  export interface ListTagsForStreamInput {
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * The key to use as the starting point for the list of tags. If this parameter is set, ListTagsForStream gets all tags that occur after ExclusiveStartTagKey. 
     */
    ExclusiveStartTagKey?: TagKey;
    /**
     * The number of tags to return. If this number is less than the total number of tags associated with the stream, HasMoreTags is set to true. To list additional tags, set ExclusiveStartTagKey to the last key in the response.
     */
    Limit?: ListTagsForStreamInputLimit;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type ListTagsForStreamInputLimit = number;
  export interface ListTagsForStreamOutput {
    /**
     * A list of tags associated with StreamName, starting with the first tag after ExclusiveStartTagKey and up to the specified Limit. 
     */
    Tags: TagList;
    /**
     * If set to true, more tags are available. To request additional tags, set ExclusiveStartTagKey to the key of the last tag returned.
     */
    HasMoreTags: BooleanObject;
  }
  export interface MergeShardsInput {
    /**
     * The name of the stream for the merge.
     */
    StreamName?: StreamName;
    /**
     * The shard ID of the shard to combine with the adjacent shard for the merge.
     */
    ShardToMerge: ShardId;
    /**
     * The shard ID of the adjacent shard for the merge.
     */
    AdjacentShardToMerge: ShardId;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type MetricsName = "IncomingBytes"|"IncomingRecords"|"OutgoingBytes"|"OutgoingRecords"|"WriteProvisionedThroughputExceeded"|"ReadProvisionedThroughputExceeded"|"IteratorAgeMilliseconds"|"ALL"|string;
  export type MetricsNameList = MetricsName[];
  export type MillisBehindLatest = number;
  export type NextToken = string;
  export type OnDemandStreamCountLimitObject = number;
  export type OnDemandStreamCountObject = number;
  export type PartitionKey = string;
  export type PositiveIntegerObject = number;
  export interface PutRecordInput {
    /**
     * The name of the stream to put the data record into.
     */
    StreamName?: StreamName;
    /**
     * The data blob to put into the record, which is base64-encoded when the blob is serialized. When the data blob (the payload before base64-encoding) is added to the partition key size, the total size must not exceed the maximum record size (1 MiB).
     */
    Data: Data;
    /**
     * Determines which shard in the stream the data record is assigned to. Partition keys are Unicode strings with a maximum length limit of 256 characters for each key. Amazon Kinesis Data Streams uses the partition key as input to a hash function that maps the partition key and associated data to a specific shard. Specifically, an MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream.
     */
    PartitionKey: PartitionKey;
    /**
     * The hash value used to explicitly determine the shard the data record is assigned to by overriding the partition key hash.
     */
    ExplicitHashKey?: HashKey;
    /**
     * Guarantees strictly increasing sequence numbers, for puts from the same client and to the same partition key. Usage: set the SequenceNumberForOrdering of record n to the sequence number of record n-1 (as returned in the result when putting record n-1). If this parameter is not set, records are coarsely ordered based on arrival time.
     */
    SequenceNumberForOrdering?: SequenceNumber;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface PutRecordOutput {
    /**
     * The shard ID of the shard where the data record was placed.
     */
    ShardId: ShardId;
    /**
     * The sequence number identifier that was assigned to the put data record. The sequence number for the record is unique across all records in the stream. A sequence number is the identifier associated with every record put into the stream.
     */
    SequenceNumber: SequenceNumber;
    /**
     * The encryption type to use on the record. This parameter can be one of the following values:    NONE: Do not encrypt the records in the stream.    KMS: Use server-side encryption on the records in the stream using a customer-managed Amazon Web Services KMS key.  
     */
    EncryptionType?: EncryptionType;
  }
  export interface PutRecordsInput {
    /**
     * The records associated with the request.
     */
    Records: PutRecordsRequestEntryList;
    /**
     * The stream name associated with the request.
     */
    StreamName?: StreamName;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface PutRecordsOutput {
    /**
     * The number of unsuccessfully processed records in a PutRecords request.
     */
    FailedRecordCount?: PositiveIntegerObject;
    /**
     * An array of successfully and unsuccessfully processed record results. A record that is successfully added to a stream includes SequenceNumber and ShardId in the result. A record that fails to be added to a stream includes ErrorCode and ErrorMessage in the result.
     */
    Records: PutRecordsResultEntryList;
    /**
     * The encryption type used on the records. This parameter can be one of the following values:    NONE: Do not encrypt the records.    KMS: Use server-side encryption on the records using a customer-managed Amazon Web Services KMS key.  
     */
    EncryptionType?: EncryptionType;
  }
  export interface PutRecordsRequestEntry {
    /**
     * The data blob to put into the record, which is base64-encoded when the blob is serialized. When the data blob (the payload before base64-encoding) is added to the partition key size, the total size must not exceed the maximum record size (1 MiB).
     */
    Data: Data;
    /**
     * The hash value used to determine explicitly the shard that the data record is assigned to by overriding the partition key hash.
     */
    ExplicitHashKey?: HashKey;
    /**
     * Determines which shard in the stream the data record is assigned to. Partition keys are Unicode strings with a maximum length limit of 256 characters for each key. Amazon Kinesis Data Streams uses the partition key as input to a hash function that maps the partition key and associated data to a specific shard. Specifically, an MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream.
     */
    PartitionKey: PartitionKey;
  }
  export type PutRecordsRequestEntryList = PutRecordsRequestEntry[];
  export interface PutRecordsResultEntry {
    /**
     * The sequence number for an individual record result.
     */
    SequenceNumber?: SequenceNumber;
    /**
     * The shard ID for an individual record result.
     */
    ShardId?: ShardId;
    /**
     * The error code for an individual record result. ErrorCodes can be either ProvisionedThroughputExceededException or InternalFailure.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message for an individual record result. An ErrorCode value of ProvisionedThroughputExceededException has an error message that includes the account ID, stream name, and shard ID. An ErrorCode value of InternalFailure has the error message "Internal Service Failure".
     */
    ErrorMessage?: ErrorMessage;
  }
  export type PutRecordsResultEntryList = PutRecordsResultEntry[];
  export interface Record {
    /**
     * The unique identifier of the record within its shard.
     */
    SequenceNumber: SequenceNumber;
    /**
     * The approximate time that the record was inserted into the stream.
     */
    ApproximateArrivalTimestamp?: Timestamp;
    /**
     * The data blob. The data in the blob is both opaque and immutable to Kinesis Data Streams, which does not inspect, interpret, or change the data in the blob in any way. When the data blob (the payload before base64-encoding) is added to the partition key size, the total size must not exceed the maximum record size (1 MiB).
     */
    Data: Data;
    /**
     * Identifies which shard in the stream the data record is assigned to.
     */
    PartitionKey: PartitionKey;
    /**
     * The encryption type used on the record. This parameter can be one of the following values:    NONE: Do not encrypt the records in the stream.    KMS: Use server-side encryption on the records in the stream using a customer-managed Amazon Web Services KMS key.  
     */
    EncryptionType?: EncryptionType;
  }
  export type RecordList = Record[];
  export interface RegisterStreamConsumerInput {
    /**
     * The ARN of the Kinesis data stream that you want to register the consumer with. For more info, see Amazon Resource Names (ARNs) and Amazon Web Services Service Namespaces.
     */
    StreamARN: StreamARN;
    /**
     * For a given Kinesis data stream, each consumer must have a unique name. However, consumer names don't have to be unique across data streams.
     */
    ConsumerName: ConsumerName;
  }
  export interface RegisterStreamConsumerOutput {
    /**
     * An object that represents the details of the consumer you registered. When you register a consumer, it gets an ARN that is generated by Kinesis Data Streams.
     */
    Consumer: Consumer;
  }
  export interface RemoveTagsFromStreamInput {
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * A list of tag keys. Each corresponding tag is removed from the stream.
     */
    TagKeys: TagKeyList;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type RetentionPeriodHours = number;
  export type ScalingType = "UNIFORM_SCALING"|string;
  export type SequenceNumber = string;
  export interface SequenceNumberRange {
    /**
     * The starting sequence number for the range.
     */
    StartingSequenceNumber: SequenceNumber;
    /**
     * The ending sequence number for the range. Shards that are in the OPEN state have an ending sequence number of null.
     */
    EndingSequenceNumber?: SequenceNumber;
  }
  export interface Shard {
    /**
     * The unique identifier of the shard within the stream.
     */
    ShardId: ShardId;
    /**
     * The shard ID of the shard's parent.
     */
    ParentShardId?: ShardId;
    /**
     * The shard ID of the shard adjacent to the shard's parent.
     */
    AdjacentParentShardId?: ShardId;
    /**
     * The range of possible hash key values for the shard, which is a set of ordered contiguous positive integers.
     */
    HashKeyRange: HashKeyRange;
    /**
     * The range of possible sequence numbers for the shard.
     */
    SequenceNumberRange: SequenceNumberRange;
  }
  export type ShardCountObject = number;
  export interface ShardFilter {
    /**
     * The shard type specified in the ShardFilter parameter. This is a required property of the ShardFilter parameter. You can specify the following valid values:     AFTER_SHARD_ID - the response includes all the shards, starting with the shard whose ID immediately follows the ShardId that you provided.     AT_TRIM_HORIZON - the response includes all the shards that were open at TRIM_HORIZON.    FROM_TRIM_HORIZON - (default), the response includes all the shards within the retention period of the data stream (trim to tip).    AT_LATEST - the response includes only the currently open shards of the data stream.    AT_TIMESTAMP - the response includes all shards whose start timestamp is less than or equal to the given timestamp and end timestamp is greater than or equal to the given timestamp or still open.     FROM_TIMESTAMP - the response incldues all closed shards whose end timestamp is greater than or equal to the given timestamp and also all open shards. Corrected to TRIM_HORIZON of the data stream if FROM_TIMESTAMP is less than the TRIM_HORIZON value.  
     */
    Type: ShardFilterType;
    /**
     * The exclusive start shardID speified in the ShardFilter parameter. This property can only be used if the AFTER_SHARD_ID shard type is specified.
     */
    ShardId?: ShardId;
    /**
     * The timestamps specified in the ShardFilter parameter. A timestamp is a Unix epoch date with precision in milliseconds. For example, 2016-04-04T19:58:46.480-00:00 or 1459799926.480. This property can only be used if FROM_TIMESTAMP or AT_TIMESTAMP shard types are specified.
     */
    Timestamp?: Timestamp;
  }
  export type ShardFilterType = "AFTER_SHARD_ID"|"AT_TRIM_HORIZON"|"FROM_TRIM_HORIZON"|"AT_LATEST"|"AT_TIMESTAMP"|"FROM_TIMESTAMP"|string;
  export type ShardId = string;
  export type ShardIdList = ShardId[];
  export type ShardIterator = string;
  export type ShardIteratorType = "AT_SEQUENCE_NUMBER"|"AFTER_SEQUENCE_NUMBER"|"TRIM_HORIZON"|"LATEST"|"AT_TIMESTAMP"|string;
  export type ShardList = Shard[];
  export interface SplitShardInput {
    /**
     * The name of the stream for the shard split.
     */
    StreamName?: StreamName;
    /**
     * The shard ID of the shard to split.
     */
    ShardToSplit: ShardId;
    /**
     * A hash key value for the starting hash key of one of the child shards created by the split. The hash key range for a given shard constitutes a set of ordered contiguous positive integers. The value for NewStartingHashKey must be in the range of hash keys being mapped into the shard. The NewStartingHashKey hash key value and all higher hash key values in hash key range are distributed to one of the child shards. All the lower hash key values in the range are distributed to the other child shard.
     */
    NewStartingHashKey: HashKey;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface StartStreamEncryptionInput {
    /**
     * The name of the stream for which to start encrypting records.
     */
    StreamName?: StreamName;
    /**
     * The encryption type to use. The only valid value is KMS.
     */
    EncryptionType: EncryptionType;
    /**
     * The GUID for the customer-managed Amazon Web Services KMS key to use for encryption. This value can be a globally unique identifier, a fully specified Amazon Resource Name (ARN) to either an alias or a key, or an alias name prefixed by "alias/".You can also use a master key owned by Kinesis Data Streams by specifying the alias aws/kinesis.   Key ARN example: arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012    Alias ARN example: arn:aws:kms:us-east-1:123456789012:alias/MyAliasName    Globally unique key ID example: 12345678-1234-1234-1234-123456789012    Alias name example: alias/MyAliasName    Master key owned by Kinesis Data Streams: alias/aws/kinesis   
     */
    KeyId: KeyId;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface StopStreamEncryptionInput {
    /**
     * The name of the stream on which to stop encrypting records.
     */
    StreamName?: StreamName;
    /**
     * The encryption type. The only valid value is KMS.
     */
    EncryptionType: EncryptionType;
    /**
     * The GUID for the customer-managed Amazon Web Services KMS key to use for encryption. This value can be a globally unique identifier, a fully specified Amazon Resource Name (ARN) to either an alias or a key, or an alias name prefixed by "alias/".You can also use a master key owned by Kinesis Data Streams by specifying the alias aws/kinesis.   Key ARN example: arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012    Alias ARN example: arn:aws:kms:us-east-1:123456789012:alias/MyAliasName    Globally unique key ID example: 12345678-1234-1234-1234-123456789012    Alias name example: alias/MyAliasName    Master key owned by Kinesis Data Streams: alias/aws/kinesis   
     */
    KeyId: KeyId;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export type StreamARN = string;
  export interface StreamDescription {
    /**
     * The name of the stream being described.
     */
    StreamName: StreamName;
    /**
     * The Amazon Resource Name (ARN) for the stream being described.
     */
    StreamARN: StreamARN;
    /**
     * The current status of the stream being described. The stream status is one of the following states:    CREATING - The stream is being created. Kinesis Data Streams immediately returns and sets StreamStatus to CREATING.    DELETING - The stream is being deleted. The specified stream is in the DELETING state until Kinesis Data Streams completes the deletion.    ACTIVE - The stream exists and is ready for read and write operations or deletion. You should perform read and write operations only on an ACTIVE stream.    UPDATING - Shards in the stream are being merged or split. Read and write operations continue to work while the stream is in the UPDATING state.  
     */
    StreamStatus: StreamStatus;
    /**
     *  Specifies the capacity mode to which you want to set your data stream. Currently, in Kinesis Data Streams, you can choose between an on-demand capacity mode and a provisioned capacity mode for your data streams. 
     */
    StreamModeDetails?: StreamModeDetails;
    /**
     * The shards that comprise the stream.
     */
    Shards: ShardList;
    /**
     * If set to true, more shards in the stream are available to describe.
     */
    HasMoreShards: BooleanObject;
    /**
     * The current retention period, in hours. Minimum value of 24. Maximum value of 168.
     */
    RetentionPeriodHours: RetentionPeriodHours;
    /**
     * The approximate time that the stream was created.
     */
    StreamCreationTimestamp: Timestamp;
    /**
     * Represents the current enhanced monitoring settings of the stream.
     */
    EnhancedMonitoring: EnhancedMonitoringList;
    /**
     * The server-side encryption type used on the stream. This parameter can be one of the following values:    NONE: Do not encrypt the records in the stream.    KMS: Use server-side encryption on the records in the stream using a customer-managed Amazon Web Services KMS key.  
     */
    EncryptionType?: EncryptionType;
    /**
     * The GUID for the customer-managed Amazon Web Services KMS key to use for encryption. This value can be a globally unique identifier, a fully specified ARN to either an alias or a key, or an alias name prefixed by "alias/".You can also use a master key owned by Kinesis Data Streams by specifying the alias aws/kinesis.   Key ARN example: arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012    Alias ARN example: arn:aws:kms:us-east-1:123456789012:alias/MyAliasName    Globally unique key ID example: 12345678-1234-1234-1234-123456789012    Alias name example: alias/MyAliasName    Master key owned by Kinesis Data Streams: alias/aws/kinesis   
     */
    KeyId?: KeyId;
  }
  export interface StreamDescriptionSummary {
    /**
     * The name of the stream being described.
     */
    StreamName: StreamName;
    /**
     * The Amazon Resource Name (ARN) for the stream being described.
     */
    StreamARN: StreamARN;
    /**
     * The current status of the stream being described. The stream status is one of the following states:    CREATING - The stream is being created. Kinesis Data Streams immediately returns and sets StreamStatus to CREATING.    DELETING - The stream is being deleted. The specified stream is in the DELETING state until Kinesis Data Streams completes the deletion.    ACTIVE - The stream exists and is ready for read and write operations or deletion. You should perform read and write operations only on an ACTIVE stream.    UPDATING - Shards in the stream are being merged or split. Read and write operations continue to work while the stream is in the UPDATING state.  
     */
    StreamStatus: StreamStatus;
    /**
     *  Specifies the capacity mode to which you want to set your data stream. Currently, in Kinesis Data Streams, you can choose between an on-demand ycapacity mode and a provisioned capacity mode for your data streams. 
     */
    StreamModeDetails?: StreamModeDetails;
    /**
     * The current retention period, in hours.
     */
    RetentionPeriodHours: RetentionPeriodHours;
    /**
     * The approximate time that the stream was created.
     */
    StreamCreationTimestamp: Timestamp;
    /**
     * Represents the current enhanced monitoring settings of the stream.
     */
    EnhancedMonitoring: EnhancedMonitoringList;
    /**
     * The encryption type used. This value is one of the following:    KMS     NONE   
     */
    EncryptionType?: EncryptionType;
    /**
     * The GUID for the customer-managed Amazon Web Services KMS key to use for encryption. This value can be a globally unique identifier, a fully specified ARN to either an alias or a key, or an alias name prefixed by "alias/".You can also use a master key owned by Kinesis Data Streams by specifying the alias aws/kinesis.   Key ARN example: arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012    Alias ARN example:  arn:aws:kms:us-east-1:123456789012:alias/MyAliasName    Globally unique key ID example: 12345678-1234-1234-1234-123456789012    Alias name example: alias/MyAliasName    Master key owned by Kinesis Data Streams: alias/aws/kinesis   
     */
    KeyId?: KeyId;
    /**
     * The number of open shards in the stream.
     */
    OpenShardCount: ShardCountObject;
    /**
     * The number of enhanced fan-out consumers registered with the stream.
     */
    ConsumerCount?: ConsumerCountObject;
  }
  export type StreamMode = "PROVISIONED"|"ON_DEMAND"|string;
  export interface StreamModeDetails {
    /**
     *  Specifies the capacity mode to which you want to set your data stream. Currently, in Kinesis Data Streams, you can choose between an on-demand capacity mode and a provisioned capacity mode for your data streams. 
     */
    StreamMode: StreamMode;
  }
  export type StreamName = string;
  export type StreamNameList = StreamName[];
  export type StreamStatus = "CREATING"|"DELETING"|"ACTIVE"|"UPDATING"|string;
  export interface StreamSummary {
    /**
     * The name of a stream.
     */
    StreamName: StreamName;
    /**
     * The ARN of the stream.
     */
    StreamARN: StreamARN;
    /**
     * The status of the stream.
     */
    StreamStatus: StreamStatus;
    StreamModeDetails?: StreamModeDetails;
    /**
     * The timestamp at which the stream was created.
     */
    StreamCreationTimestamp?: Timestamp;
  }
  export type StreamSummaryList = StreamSummary[];
  export interface Tag {
    /**
     * A unique identifier for the tag. Maximum length: 128 characters. Valid characters: Unicode letters, digits, white space, _ . / = + - % @
     */
    Key: TagKey;
    /**
     * An optional string, typically used to describe or define the tag. Maximum length: 256 characters. Valid characters: Unicode letters, digits, white space, _ . / = + - % @
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export type TagMap = {[key: string]: TagValue};
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UpdateShardCountInput {
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * The new number of shards. This value has the following default limits. By default, you cannot do the following:    Set this value to more than double your current shard count for a stream.   Set this value below half your current shard count for a stream.   Set this value to more than 10000 shards in a stream (the default limit for shard count per stream is 10000 per account per region), unless you request a limit increase.   Scale a stream with more than 10000 shards down unless you set this value to less than 10000 shards.  
     */
    TargetShardCount: PositiveIntegerObject;
    /**
     * The scaling type. Uniform scaling creates shards of equal size.
     */
    ScalingType: ScalingType;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface UpdateShardCountOutput {
    /**
     * The name of the stream.
     */
    StreamName?: StreamName;
    /**
     * The current number of shards.
     */
    CurrentShardCount?: PositiveIntegerObject;
    /**
     * The updated number of shards.
     */
    TargetShardCount?: PositiveIntegerObject;
    /**
     * The ARN of the stream.
     */
    StreamARN?: StreamARN;
  }
  export interface UpdateStreamModeInput {
    /**
     *  Specifies the ARN of the data stream whose capacity mode you want to update. 
     */
    StreamARN: StreamARN;
    /**
     *  Specifies the capacity mode to which you want to set your data stream. Currently, in Kinesis Data Streams, you can choose between an on-demand capacity mode and a provisioned capacity mode for your data streams. 
     */
    StreamModeDetails: StreamModeDetails;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2013-12-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Kinesis client.
   */
  export import Types = Kinesis;
}
export = Kinesis;
