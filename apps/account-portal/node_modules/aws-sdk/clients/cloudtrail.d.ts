import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CloudTrail extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CloudTrail.Types.ClientConfiguration)
  config: Config & CloudTrail.Types.ClientConfiguration;
  /**
   * Adds one or more tags to a trail, up to a limit of 50. Overwrites an existing tag's value when a new value is specified for an existing tag key. Tag key names must be unique for a trail; you cannot have two keys with the same name but different values. If you specify a key without a value, the tag will be created with the specified key and a value of null. You can tag a trail that applies to all Amazon Web Services Regions only from the Region in which the trail was created (also known as its home region).
   */
  addTags(params: CloudTrail.Types.AddTagsRequest, callback?: (err: AWSError, data: CloudTrail.Types.AddTagsResponse) => void): Request<CloudTrail.Types.AddTagsResponse, AWSError>;
  /**
   * Adds one or more tags to a trail, up to a limit of 50. Overwrites an existing tag's value when a new value is specified for an existing tag key. Tag key names must be unique for a trail; you cannot have two keys with the same name but different values. If you specify a key without a value, the tag will be created with the specified key and a value of null. You can tag a trail that applies to all Amazon Web Services Regions only from the Region in which the trail was created (also known as its home region).
   */
  addTags(callback?: (err: AWSError, data: CloudTrail.Types.AddTagsResponse) => void): Request<CloudTrail.Types.AddTagsResponse, AWSError>;
  /**
   * Creates a trail that specifies the settings for delivery of log data to an Amazon S3 bucket. 
   */
  createTrail(params: CloudTrail.Types.CreateTrailRequest, callback?: (err: AWSError, data: CloudTrail.Types.CreateTrailResponse) => void): Request<CloudTrail.Types.CreateTrailResponse, AWSError>;
  /**
   * Creates a trail that specifies the settings for delivery of log data to an Amazon S3 bucket. 
   */
  createTrail(callback?: (err: AWSError, data: CloudTrail.Types.CreateTrailResponse) => void): Request<CloudTrail.Types.CreateTrailResponse, AWSError>;
  /**
   * Deletes a trail. This operation must be called from the region in which the trail was created. DeleteTrail cannot be called on the shadow trails (replicated trails in other regions) of a trail that is enabled in all regions.
   */
  deleteTrail(params: CloudTrail.Types.DeleteTrailRequest, callback?: (err: AWSError, data: CloudTrail.Types.DeleteTrailResponse) => void): Request<CloudTrail.Types.DeleteTrailResponse, AWSError>;
  /**
   * Deletes a trail. This operation must be called from the region in which the trail was created. DeleteTrail cannot be called on the shadow trails (replicated trails in other regions) of a trail that is enabled in all regions.
   */
  deleteTrail(callback?: (err: AWSError, data: CloudTrail.Types.DeleteTrailResponse) => void): Request<CloudTrail.Types.DeleteTrailResponse, AWSError>;
  /**
   * Retrieves settings for one or more trails associated with the current region for your account.
   */
  describeTrails(params: CloudTrail.Types.DescribeTrailsRequest, callback?: (err: AWSError, data: CloudTrail.Types.DescribeTrailsResponse) => void): Request<CloudTrail.Types.DescribeTrailsResponse, AWSError>;
  /**
   * Retrieves settings for one or more trails associated with the current region for your account.
   */
  describeTrails(callback?: (err: AWSError, data: CloudTrail.Types.DescribeTrailsResponse) => void): Request<CloudTrail.Types.DescribeTrailsResponse, AWSError>;
  /**
   * Describes the settings for the event selectors that you configured for your trail. The information returned for your event selectors includes the following:   If your event selector includes read-only events, write-only events, or all events. This applies to both management events and data events.   If your event selector includes management events.   If your event selector includes data events, the resources on which you are logging data events.   For more information, see Logging Data and Management Events for Trails  in the CloudTrail User Guide.
   */
  getEventSelectors(params: CloudTrail.Types.GetEventSelectorsRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetEventSelectorsResponse) => void): Request<CloudTrail.Types.GetEventSelectorsResponse, AWSError>;
  /**
   * Describes the settings for the event selectors that you configured for your trail. The information returned for your event selectors includes the following:   If your event selector includes read-only events, write-only events, or all events. This applies to both management events and data events.   If your event selector includes management events.   If your event selector includes data events, the resources on which you are logging data events.   For more information, see Logging Data and Management Events for Trails  in the CloudTrail User Guide.
   */
  getEventSelectors(callback?: (err: AWSError, data: CloudTrail.Types.GetEventSelectorsResponse) => void): Request<CloudTrail.Types.GetEventSelectorsResponse, AWSError>;
  /**
   * Describes the settings for the Insights event selectors that you configured for your trail. GetInsightSelectors shows if CloudTrail Insights event logging is enabled on the trail, and if it is, which insight types are enabled. If you run GetInsightSelectors on a trail that does not have Insights events enabled, the operation throws the exception InsightNotEnabledException  For more information, see Logging CloudTrail Insights Events for Trails  in the CloudTrail User Guide.
   */
  getInsightSelectors(params: CloudTrail.Types.GetInsightSelectorsRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetInsightSelectorsResponse) => void): Request<CloudTrail.Types.GetInsightSelectorsResponse, AWSError>;
  /**
   * Describes the settings for the Insights event selectors that you configured for your trail. GetInsightSelectors shows if CloudTrail Insights event logging is enabled on the trail, and if it is, which insight types are enabled. If you run GetInsightSelectors on a trail that does not have Insights events enabled, the operation throws the exception InsightNotEnabledException  For more information, see Logging CloudTrail Insights Events for Trails  in the CloudTrail User Guide.
   */
  getInsightSelectors(callback?: (err: AWSError, data: CloudTrail.Types.GetInsightSelectorsResponse) => void): Request<CloudTrail.Types.GetInsightSelectorsResponse, AWSError>;
  /**
   * Returns settings information for a specified trail.
   */
  getTrail(params: CloudTrail.Types.GetTrailRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetTrailResponse) => void): Request<CloudTrail.Types.GetTrailResponse, AWSError>;
  /**
   * Returns settings information for a specified trail.
   */
  getTrail(callback?: (err: AWSError, data: CloudTrail.Types.GetTrailResponse) => void): Request<CloudTrail.Types.GetTrailResponse, AWSError>;
  /**
   * Returns a JSON-formatted list of information about the specified trail. Fields include information on delivery errors, Amazon SNS and Amazon S3 errors, and start and stop logging times for each trail. This operation returns trail status from a single region. To return trail status from all regions, you must call the operation on each region.
   */
  getTrailStatus(params: CloudTrail.Types.GetTrailStatusRequest, callback?: (err: AWSError, data: CloudTrail.Types.GetTrailStatusResponse) => void): Request<CloudTrail.Types.GetTrailStatusResponse, AWSError>;
  /**
   * Returns a JSON-formatted list of information about the specified trail. Fields include information on delivery errors, Amazon SNS and Amazon S3 errors, and start and stop logging times for each trail. This operation returns trail status from a single region. To return trail status from all regions, you must call the operation on each region.
   */
  getTrailStatus(callback?: (err: AWSError, data: CloudTrail.Types.GetTrailStatusResponse) => void): Request<CloudTrail.Types.GetTrailStatusResponse, AWSError>;
  /**
   * Returns all public keys whose private keys were used to sign the digest files within the specified time range. The public key is needed to validate digest files that were signed with its corresponding private key.  CloudTrail uses different private and public key pairs per region. Each digest file is signed with a private key unique to its region. When you validate a digest file from a specific region, you must look in the same region for its corresponding public key. 
   */
  listPublicKeys(params: CloudTrail.Types.ListPublicKeysRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListPublicKeysResponse) => void): Request<CloudTrail.Types.ListPublicKeysResponse, AWSError>;
  /**
   * Returns all public keys whose private keys were used to sign the digest files within the specified time range. The public key is needed to validate digest files that were signed with its corresponding private key.  CloudTrail uses different private and public key pairs per region. Each digest file is signed with a private key unique to its region. When you validate a digest file from a specific region, you must look in the same region for its corresponding public key. 
   */
  listPublicKeys(callback?: (err: AWSError, data: CloudTrail.Types.ListPublicKeysResponse) => void): Request<CloudTrail.Types.ListPublicKeysResponse, AWSError>;
  /**
   * Lists the tags for the trail in the current region.
   */
  listTags(params: CloudTrail.Types.ListTagsRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListTagsResponse) => void): Request<CloudTrail.Types.ListTagsResponse, AWSError>;
  /**
   * Lists the tags for the trail in the current region.
   */
  listTags(callback?: (err: AWSError, data: CloudTrail.Types.ListTagsResponse) => void): Request<CloudTrail.Types.ListTagsResponse, AWSError>;
  /**
   * Lists trails that are in the current account.
   */
  listTrails(params: CloudTrail.Types.ListTrailsRequest, callback?: (err: AWSError, data: CloudTrail.Types.ListTrailsResponse) => void): Request<CloudTrail.Types.ListTrailsResponse, AWSError>;
  /**
   * Lists trails that are in the current account.
   */
  listTrails(callback?: (err: AWSError, data: CloudTrail.Types.ListTrailsResponse) => void): Request<CloudTrail.Types.ListTrailsResponse, AWSError>;
  /**
   * Looks up management events or CloudTrail Insights events that are captured by CloudTrail. You can look up events that occurred in a region within the last 90 days. Lookup supports the following attributes for management events:   Amazon Web Services access key   Event ID   Event name   Event source   Read only   Resource name   Resource type   User name   Lookup supports the following attributes for Insights events:   Event ID   Event name   Event source   All attributes are optional. The default number of results returned is 50, with a maximum of 50 possible. The response includes a token that you can use to get the next page of results.  The rate of lookup requests is limited to two per second, per account, per region. If this limit is exceeded, a throttling error occurs. 
   */
  lookupEvents(params: CloudTrail.Types.LookupEventsRequest, callback?: (err: AWSError, data: CloudTrail.Types.LookupEventsResponse) => void): Request<CloudTrail.Types.LookupEventsResponse, AWSError>;
  /**
   * Looks up management events or CloudTrail Insights events that are captured by CloudTrail. You can look up events that occurred in a region within the last 90 days. Lookup supports the following attributes for management events:   Amazon Web Services access key   Event ID   Event name   Event source   Read only   Resource name   Resource type   User name   Lookup supports the following attributes for Insights events:   Event ID   Event name   Event source   All attributes are optional. The default number of results returned is 50, with a maximum of 50 possible. The response includes a token that you can use to get the next page of results.  The rate of lookup requests is limited to two per second, per account, per region. If this limit is exceeded, a throttling error occurs. 
   */
  lookupEvents(callback?: (err: AWSError, data: CloudTrail.Types.LookupEventsResponse) => void): Request<CloudTrail.Types.LookupEventsResponse, AWSError>;
  /**
   * Configures an event selector or advanced event selectors for your trail. Use event selectors or advanced event selectors to specify management and data event settings for your trail. By default, trails created without specific event selectors are configured to log all read and write management events, and no data events. When an event occurs in your account, CloudTrail evaluates the event selectors or advanced event selectors in all trails. For each trail, if the event matches any event selector, the trail processes and logs the event. If the event doesn't match any event selector, the trail doesn't log the event. Example   You create an event selector for a trail and specify that you want write-only events.   The EC2 GetConsoleOutput and RunInstances API operations occur in your account.   CloudTrail evaluates whether the events match your event selectors.   The RunInstances is a write-only event and it matches your event selector. The trail logs the event.   The GetConsoleOutput is a read-only event that doesn't match your event selector. The trail doesn't log the event.    The PutEventSelectors operation must be called from the region in which the trail was created; otherwise, an InvalidHomeRegionException exception is thrown. You can configure up to five event selectors for each trail. For more information, see Logging data and management events for trails  and Quotas in CloudTrail in the CloudTrail User Guide. You can add advanced event selectors, and conditions for your advanced event selectors, up to a maximum of 500 values for all conditions and selectors on a trail. You can use either AdvancedEventSelectors or EventSelectors, but not both. If you apply AdvancedEventSelectors to a trail, any existing EventSelectors are overwritten. For more information about advanced event selectors, see Logging data events for trails in the CloudTrail User Guide.
   */
  putEventSelectors(params: CloudTrail.Types.PutEventSelectorsRequest, callback?: (err: AWSError, data: CloudTrail.Types.PutEventSelectorsResponse) => void): Request<CloudTrail.Types.PutEventSelectorsResponse, AWSError>;
  /**
   * Configures an event selector or advanced event selectors for your trail. Use event selectors or advanced event selectors to specify management and data event settings for your trail. By default, trails created without specific event selectors are configured to log all read and write management events, and no data events. When an event occurs in your account, CloudTrail evaluates the event selectors or advanced event selectors in all trails. For each trail, if the event matches any event selector, the trail processes and logs the event. If the event doesn't match any event selector, the trail doesn't log the event. Example   You create an event selector for a trail and specify that you want write-only events.   The EC2 GetConsoleOutput and RunInstances API operations occur in your account.   CloudTrail evaluates whether the events match your event selectors.   The RunInstances is a write-only event and it matches your event selector. The trail logs the event.   The GetConsoleOutput is a read-only event that doesn't match your event selector. The trail doesn't log the event.    The PutEventSelectors operation must be called from the region in which the trail was created; otherwise, an InvalidHomeRegionException exception is thrown. You can configure up to five event selectors for each trail. For more information, see Logging data and management events for trails  and Quotas in CloudTrail in the CloudTrail User Guide. You can add advanced event selectors, and conditions for your advanced event selectors, up to a maximum of 500 values for all conditions and selectors on a trail. You can use either AdvancedEventSelectors or EventSelectors, but not both. If you apply AdvancedEventSelectors to a trail, any existing EventSelectors are overwritten. For more information about advanced event selectors, see Logging data events for trails in the CloudTrail User Guide.
   */
  putEventSelectors(callback?: (err: AWSError, data: CloudTrail.Types.PutEventSelectorsResponse) => void): Request<CloudTrail.Types.PutEventSelectorsResponse, AWSError>;
  /**
   * Lets you enable Insights event logging by specifying the Insights selectors that you want to enable on an existing trail. You also use PutInsightSelectors to turn off Insights event logging, by passing an empty list of insight types. The valid Insights event type in this release is ApiCallRateInsight.
   */
  putInsightSelectors(params: CloudTrail.Types.PutInsightSelectorsRequest, callback?: (err: AWSError, data: CloudTrail.Types.PutInsightSelectorsResponse) => void): Request<CloudTrail.Types.PutInsightSelectorsResponse, AWSError>;
  /**
   * Lets you enable Insights event logging by specifying the Insights selectors that you want to enable on an existing trail. You also use PutInsightSelectors to turn off Insights event logging, by passing an empty list of insight types. The valid Insights event type in this release is ApiCallRateInsight.
   */
  putInsightSelectors(callback?: (err: AWSError, data: CloudTrail.Types.PutInsightSelectorsResponse) => void): Request<CloudTrail.Types.PutInsightSelectorsResponse, AWSError>;
  /**
   * Removes the specified tags from a trail.
   */
  removeTags(params: CloudTrail.Types.RemoveTagsRequest, callback?: (err: AWSError, data: CloudTrail.Types.RemoveTagsResponse) => void): Request<CloudTrail.Types.RemoveTagsResponse, AWSError>;
  /**
   * Removes the specified tags from a trail.
   */
  removeTags(callback?: (err: AWSError, data: CloudTrail.Types.RemoveTagsResponse) => void): Request<CloudTrail.Types.RemoveTagsResponse, AWSError>;
  /**
   * Starts the recording of Amazon Web Services API calls and log file delivery for a trail. For a trail that is enabled in all regions, this operation must be called from the region in which the trail was created. This operation cannot be called on the shadow trails (replicated trails in other regions) of a trail that is enabled in all regions.
   */
  startLogging(params: CloudTrail.Types.StartLoggingRequest, callback?: (err: AWSError, data: CloudTrail.Types.StartLoggingResponse) => void): Request<CloudTrail.Types.StartLoggingResponse, AWSError>;
  /**
   * Starts the recording of Amazon Web Services API calls and log file delivery for a trail. For a trail that is enabled in all regions, this operation must be called from the region in which the trail was created. This operation cannot be called on the shadow trails (replicated trails in other regions) of a trail that is enabled in all regions.
   */
  startLogging(callback?: (err: AWSError, data: CloudTrail.Types.StartLoggingResponse) => void): Request<CloudTrail.Types.StartLoggingResponse, AWSError>;
  /**
   * Suspends the recording of Amazon Web Services API calls and log file delivery for the specified trail. Under most circumstances, there is no need to use this action. You can update a trail without stopping it first. This action is the only way to stop recording. For a trail enabled in all regions, this operation must be called from the region in which the trail was created, or an InvalidHomeRegionException will occur. This operation cannot be called on the shadow trails (replicated trails in other regions) of a trail enabled in all regions.
   */
  stopLogging(params: CloudTrail.Types.StopLoggingRequest, callback?: (err: AWSError, data: CloudTrail.Types.StopLoggingResponse) => void): Request<CloudTrail.Types.StopLoggingResponse, AWSError>;
  /**
   * Suspends the recording of Amazon Web Services API calls and log file delivery for the specified trail. Under most circumstances, there is no need to use this action. You can update a trail without stopping it first. This action is the only way to stop recording. For a trail enabled in all regions, this operation must be called from the region in which the trail was created, or an InvalidHomeRegionException will occur. This operation cannot be called on the shadow trails (replicated trails in other regions) of a trail enabled in all regions.
   */
  stopLogging(callback?: (err: AWSError, data: CloudTrail.Types.StopLoggingResponse) => void): Request<CloudTrail.Types.StopLoggingResponse, AWSError>;
  /**
   * Updates trail settings that control what events you are logging, and how to handle log files. Changes to a trail do not require stopping the CloudTrail service. Use this action to designate an existing bucket for log delivery. If the existing bucket has previously been a target for CloudTrail log files, an IAM policy exists for the bucket. UpdateTrail must be called from the region in which the trail was created; otherwise, an InvalidHomeRegionException is thrown.
   */
  updateTrail(params: CloudTrail.Types.UpdateTrailRequest, callback?: (err: AWSError, data: CloudTrail.Types.UpdateTrailResponse) => void): Request<CloudTrail.Types.UpdateTrailResponse, AWSError>;
  /**
   * Updates trail settings that control what events you are logging, and how to handle log files. Changes to a trail do not require stopping the CloudTrail service. Use this action to designate an existing bucket for log delivery. If the existing bucket has previously been a target for CloudTrail log files, an IAM policy exists for the bucket. UpdateTrail must be called from the region in which the trail was created; otherwise, an InvalidHomeRegionException is thrown.
   */
  updateTrail(callback?: (err: AWSError, data: CloudTrail.Types.UpdateTrailResponse) => void): Request<CloudTrail.Types.UpdateTrailResponse, AWSError>;
}
declare namespace CloudTrail {
  export interface AddTagsRequest {
    /**
     * Specifies the ARN of the trail to which one or more tags will be added. The format of a trail ARN is:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    ResourceId: String;
    /**
     * Contains a list of tags, up to a limit of 50
     */
    TagsList?: TagsList;
  }
  export interface AddTagsResponse {
  }
  export interface AdvancedEventSelector {
    /**
     * An optional, descriptive name for an advanced event selector, such as "Log data events for only two S3 buckets".
     */
    Name?: SelectorName;
    /**
     * Contains all selector statements in an advanced event selector.
     */
    FieldSelectors: AdvancedFieldSelectors;
  }
  export type AdvancedEventSelectors = AdvancedEventSelector[];
  export interface AdvancedFieldSelector {
    /**
     *  A field in an event record on which to filter events to be logged. Supported fields include readOnly, eventCategory, eventSource (for management events), eventName, resources.type, and resources.ARN.      readOnly  - Optional. Can be set to Equals a value of true or false. A value of false logs both read and write events.     eventSource  - For filtering management events only. This can be set only to NotEquals kms.amazonaws.com.     eventName  - Can use any operator. You can use it to ﬁlter in or ﬁlter out any data event logged to CloudTrail, such as PutBucket or GetSnapshotBlock. You can have multiple values for this ﬁeld, separated by commas.     eventCategory  - This is required. It must be set to Equals, and the value must be Management or Data.     resources.type  - This ﬁeld is required. resources.type can only use the Equals operator, and the value can be one of the following: AWS::S3::Object, AWS::S3::AccessPoint, AWS::Lambda::Function, AWS::DynamoDB::Table, AWS::S3Outposts::Object, AWS::ManagedBlockchain::Node, AWS::S3ObjectLambda::AccessPoint, or AWS::EC2::Snapshot. You can have only one resources.type ﬁeld per selector. To log data events on more than one resource type, add another selector.     resources.ARN  - You can use any operator with resources.ARN, but if you use Equals or NotEquals, the value must exactly match the ARN of a valid resource of the type you've speciﬁed in the template as the value of resources.type. For example, if resources.type equals AWS::S3::Object, the ARN must be in one of the following formats. To log all data events for all objects in a specific S3 bucket, use the StartsWith operator, and include only the bucket ARN as the matching value. The trailing slash is intentional; do not exclude it. Replace the text between less than and greater than symbols (&lt;&gt;) with resource-specific information.     arn:&lt;partition&gt;:s3:::&lt;bucket_name&gt;/     arn:&lt;partition&gt;:s3:::&lt;bucket_name&gt;/&lt;object_path&gt;/    When resources.type equals AWS::S3::AccessPoint, and the operator is set to Equals or NotEquals, the ARN must be in one of the following formats. To log events on all objects in an S3 access point, we recommend that you use only the access point ARN, don’t include the object path, and use the StartsWith or NotStartsWith operators.    arn:&lt;partition&gt;:s3:&lt;region&gt;:&lt;account_ID&gt;:accesspoint/&lt;access_point_name&gt;     arn:&lt;partition&gt;:s3:&lt;region&gt;:&lt;account_ID&gt;:accesspoint/&lt;access_point_name&gt;/object/&lt;object_path&gt;    When resources.type equals AWS::Lambda::Function, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:lambda:&lt;region&gt;:&lt;account_ID&gt;:function:&lt;function_name&gt;    When resources.type equals AWS::DynamoDB::Table, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:dynamodb:&lt;region&gt;:&lt;account_ID&gt;:table:&lt;table_name&gt;    When resources.type equals AWS::S3Outposts::Object, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:s3-outposts:&lt;region&gt;:&lt;account_ID&gt;:&lt;object_path&gt;    When resources.type equals AWS::ManagedBlockchain::Node, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:managedblockchain:&lt;region&gt;:&lt;account_ID&gt;:nodes/&lt;node_ID&gt;    When resources.type equals AWS::S3ObjectLambda::AccessPoint, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:s3-object-lambda:&lt;region&gt;:&lt;account_ID&gt;:accesspoint/&lt;access_point_name&gt;    When resources.type equals AWS::EC2::Snapshot, and the operator is set to Equals or NotEquals, the ARN must be in the following format:    arn:&lt;partition&gt;:ec2:&lt;region&gt;::snapshot/&lt;snapshot_ID&gt;     
     */
    Field: SelectorField;
    /**
     *  An operator that includes events that match the exact value of the event record field specified as the value of Field. This is the only valid operator that you can use with the readOnly, eventCategory, and resources.type fields.
     */
    Equals?: Operator;
    /**
     * An operator that includes events that match the first few characters of the event record field specified as the value of Field.
     */
    StartsWith?: Operator;
    /**
     * An operator that includes events that match the last few characters of the event record field specified as the value of Field.
     */
    EndsWith?: Operator;
    /**
     *  An operator that excludes events that match the exact value of the event record field specified as the value of Field. 
     */
    NotEquals?: Operator;
    /**
     *  An operator that excludes events that match the first few characters of the event record field specified as the value of Field. 
     */
    NotStartsWith?: Operator;
    /**
     *  An operator that excludes events that match the last few characters of the event record field specified as the value of Field. 
     */
    NotEndsWith?: Operator;
  }
  export type AdvancedFieldSelectors = AdvancedFieldSelector[];
  export type Boolean = boolean;
  export type ByteBuffer = Buffer|Uint8Array|Blob|string;
  export interface CreateTrailRequest {
    /**
     * Specifies the name of the trail. The name must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)  
     */
    Name: String;
    /**
     * Specifies the name of the Amazon S3 bucket designated for publishing log files. See Amazon S3 Bucket Naming Requirements.
     */
    S3BucketName: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your CloudTrail Log Files. The maximum length is 200 characters.
     */
    S3KeyPrefix?: String;
    /**
     * Specifies the name of the Amazon SNS topic defined for notification of log file delivery. The maximum length is 256 characters.
     */
    SnsTopicName?: String;
    /**
     * Specifies whether the trail is publishing events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail is created in the current region or in all regions. The default is false, which creates a trail only in the region where you are signed in. As a best practice, consider creating trails that log events in all regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Specifies whether log file integrity validation is enabled. The default is false.  When you disable log file integrity validation, the chain of digest files is broken after one hour. CloudTrail does not create digest files for log files that were delivered during a period in which log file integrity validation was disabled. For example, if you enable log file integrity validation at noon on January 1, disable it at noon on January 2, and re-enable it at noon on January 10, digest files will not be created for the log files delivered from noon on January 2 to noon on January 10. The same applies whenever you stop CloudTrail logging or delete a trail. 
     */
    EnableLogFileValidation?: Boolean;
    /**
     * Specifies a log group name using an Amazon Resource Name (ARN), a unique identifier that represents the log group to which CloudTrail logs will be delivered. Not required unless you specify CloudWatchLogsRoleArn.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID to use to encrypt the logs delivered by CloudTrail. The value can be an alias name prefixed by "alias/", a fully specified ARN to an alias, a fully specified ARN to a key, or a globally unique identifier. CloudTrail also supports KMS multi-Region keys. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. Examples:   alias/MyAliasName   arn:aws:kms:us-east-2:123456789012:alias/MyAliasName   arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012   12345678-1234-1234-1234-123456789012  
     */
    KmsKeyId?: String;
    /**
     * Specifies whether the trail is created for all accounts in an organization in Organizations, or only for the current Amazon Web Services account. The default is false, and cannot be true unless the call is made on behalf of an Amazon Web Services account that is the management account for an organization in Organizations.
     */
    IsOrganizationTrail?: Boolean;
    TagsList?: TagsList;
  }
  export interface CreateTrailResponse {
    /**
     * Specifies the name of the trail.
     */
    Name?: String;
    /**
     * Specifies the name of the Amazon S3 bucket designated for publishing log files.
     */
    S3BucketName?: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your CloudTrail Log Files.
     */
    S3KeyPrefix?: String;
    /**
     * This field is no longer in use. Use SnsTopicARN.
     */
    SnsTopicName?: String;
    /**
     * Specifies the ARN of the Amazon SNS topic that CloudTrail uses to send notifications when log files are delivered. The format of a topic ARN is:  arn:aws:sns:us-east-2:123456789012:MyTopic 
     */
    SnsTopicARN?: String;
    /**
     * Specifies whether the trail is publishing events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail exists in one region or in all regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Specifies the ARN of the trail that was created. The format of a trail ARN is:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailARN?: String;
    /**
     * Specifies whether log file integrity validation is enabled.
     */
    LogFileValidationEnabled?: Boolean;
    /**
     * Specifies the Amazon Resource Name (ARN) of the log group to which CloudTrail logs will be delivered.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID that encrypts the logs delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: String;
    /**
     * Specifies whether the trail is an organization trail.
     */
    IsOrganizationTrail?: Boolean;
  }
  export interface DataResource {
    /**
     * The resource type in which you want to log data events. You can specify AWS::S3::Object, AWS::Lambda::Function, or AWS::DynamoDB::Table resources. The AWS::S3Outposts::Object, AWS::ManagedBlockchain::Node, AWS::S3ObjectLambda::AccessPoint, and AWS::EC2::Snapshot resource types are not valid in basic event selectors. To log data events on these resource types, use advanced event selectors.
     */
    Type?: String;
    /**
     * An array of Amazon Resource Name (ARN) strings or partial ARN strings for the specified objects.   To log data events for all objects in all S3 buckets in your Amazon Web Services account, specify the prefix as arn:aws:s3:::.  This also enables logging of data event activity performed by any user or role in your Amazon Web Services account, even if that activity is performed on a bucket that belongs to another Amazon Web Services account.    To log data events for all objects in an S3 bucket, specify the bucket and an empty object prefix such as arn:aws:s3:::bucket-1/. The trail logs data events for all objects in this S3 bucket.   To log data events for specific objects, specify the S3 bucket and object prefix such as arn:aws:s3:::bucket-1/example-images. The trail logs data events for objects in this S3 bucket that match the prefix.   To log data events for all Lambda functions in your Amazon Web Services account, specify the prefix as arn:aws:lambda.  This also enables logging of Invoke activity performed by any user or role in your Amazon Web Services account, even if that activity is performed on a function that belongs to another Amazon Web Services account.     To log data events for a specific Lambda function, specify the function ARN.  Lambda function ARNs are exact. For example, if you specify a function ARN arn:aws:lambda:us-west-2:111111111111:function:helloworld, data events will only be logged for arn:aws:lambda:us-west-2:111111111111:function:helloworld. They will not be logged for arn:aws:lambda:us-west-2:111111111111:function:helloworld2.    To log data events for all DynamoDB tables in your Amazon Web Services account, specify the prefix as arn:aws:dynamodb.  
     */
    Values?: DataResourceValues;
  }
  export type DataResourceValues = String[];
  export type DataResources = DataResource[];
  export type _Date = Date;
  export interface DeleteTrailRequest {
    /**
     * Specifies the name or the CloudTrail ARN of the trail to be deleted. The following is the format of a trail ARN. arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
  }
  export interface DeleteTrailResponse {
  }
  export interface DescribeTrailsRequest {
    /**
     * Specifies a list of trail names, trail ARNs, or both, of the trails to describe. The format of a trail ARN is:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail  If an empty list is specified, information for the trail in the current region is returned.   If an empty list is specified and IncludeShadowTrails is false, then information for all trails in the current region is returned.   If an empty list is specified and IncludeShadowTrails is null or true, then information for all trails in the current region and any associated shadow trails in other regions is returned.    If one or more trail names are specified, information is returned only if the names match the names of trails belonging only to the current region. To return information about a trail in another region, you must specify its trail ARN. 
     */
    trailNameList?: TrailNameList;
    /**
     * Specifies whether to include shadow trails in the response. A shadow trail is the replication in a region of a trail that was created in a different region, or in the case of an organization trail, the replication of an organization trail in member accounts. If you do not include shadow trails, organization trails in a member account and region replication trails will not be returned. The default is true.
     */
    includeShadowTrails?: Boolean;
  }
  export interface DescribeTrailsResponse {
    /**
     * The list of trail objects. Trail objects with string values are only returned if values for the objects exist in a trail's configuration. For example, SNSTopicName and SNSTopicARN are only returned in results if a trail is configured to send SNS notifications. Similarly, KMSKeyId only appears in results if a trail's log files are encrypted with KMS customer managed keys.
     */
    trailList?: TrailList;
  }
  export interface Event {
    /**
     * The CloudTrail ID of the event returned.
     */
    EventId?: String;
    /**
     * The name of the event returned.
     */
    EventName?: String;
    /**
     * Information about whether the event is a write event or a read event. 
     */
    ReadOnly?: String;
    /**
     * The Amazon Web Services access key ID that was used to sign the request. If the request was made with temporary security credentials, this is the access key ID of the temporary credentials.
     */
    AccessKeyId?: String;
    /**
     * The date and time of the event returned.
     */
    EventTime?: _Date;
    /**
     * The Amazon Web Services service to which the request was made.
     */
    EventSource?: String;
    /**
     * A user name or role name of the requester that called the API in the event returned.
     */
    Username?: String;
    /**
     * A list of resources referenced by the event returned.
     */
    Resources?: ResourceList;
    /**
     * A JSON string that contains a representation of the event returned.
     */
    CloudTrailEvent?: String;
  }
  export type EventCategory = "insight"|string;
  export interface EventSelector {
    /**
     * Specify if you want your trail to log read-only events, write-only events, or all. For example, the EC2 GetConsoleOutput is a read-only API operation and RunInstances is a write-only API operation.  By default, the value is All.
     */
    ReadWriteType?: ReadWriteType;
    /**
     * Specify if you want your event selector to include management events for your trail.  For more information, see Management Events in the CloudTrail User Guide. By default, the value is true. The first copy of management events is free. You are charged for additional copies of management events that you are logging on any subsequent trail in the same region. For more information about CloudTrail pricing, see CloudTrail Pricing.
     */
    IncludeManagementEvents?: Boolean;
    /**
     * CloudTrail supports data event logging for Amazon S3 objects, Lambda functions, and Amazon DynamoDB tables with basic event selectors. You can specify up to 250 resources for an individual event selector, but the total number of data resources cannot exceed 250 across all event selectors in a trail. This limit does not apply if you configure resource logging for all data events. For more information, see Data Events and Limits in CloudTrail in the CloudTrail User Guide.
     */
    DataResources?: DataResources;
    /**
     * An optional list of service event sources from which you do not want management events to be logged on your trail. In this release, the list can be empty (disables the filter), or it can filter out Key Management Service or Amazon RDS Data API events by containing kms.amazonaws.com or rdsdata.amazonaws.com. By default, ExcludeManagementEventSources is empty, and KMS and Amazon RDS Data API events are logged to your trail.
     */
    ExcludeManagementEventSources?: ExcludeManagementEventSources;
  }
  export type EventSelectors = EventSelector[];
  export type EventsList = Event[];
  export type ExcludeManagementEventSources = String[];
  export interface GetEventSelectorsRequest {
    /**
     * Specifies the name of the trail or trail ARN. If you specify a trail name, the string must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)   If you specify a trail ARN, it must be in the format:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailName: String;
  }
  export interface GetEventSelectorsResponse {
    /**
     * The specified trail ARN that has the event selectors.
     */
    TrailARN?: String;
    /**
     * The event selectors that are configured for the trail.
     */
    EventSelectors?: EventSelectors;
    /**
     *  The advanced event selectors that are configured for the trail. 
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
  }
  export interface GetInsightSelectorsRequest {
    /**
     * Specifies the name of the trail or trail ARN. If you specify a trail name, the string must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)   If you specify a trail ARN, it must be in the format:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailName: String;
  }
  export interface GetInsightSelectorsResponse {
    /**
     * The Amazon Resource Name (ARN) of a trail for which you want to get Insights selectors.
     */
    TrailARN?: String;
    /**
     * A JSON string that contains the insight types you want to log on a trail. In this release, only ApiCallRateInsight is supported as an insight type.
     */
    InsightSelectors?: InsightSelectors;
  }
  export interface GetTrailRequest {
    /**
     * The name or the Amazon Resource Name (ARN) of the trail for which you want to retrieve settings information.
     */
    Name: String;
  }
  export interface GetTrailResponse {
    Trail?: Trail;
  }
  export interface GetTrailStatusRequest {
    /**
     * Specifies the name or the CloudTrail ARN of the trail for which you are requesting status. To get the status of a shadow trail (a replication of the trail in another region), you must specify its ARN. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
  }
  export interface GetTrailStatusResponse {
    /**
     * Whether the CloudTrail trail is currently logging Amazon Web Services API calls.
     */
    IsLogging?: Boolean;
    /**
     * Displays any Amazon S3 error that CloudTrail encountered when attempting to deliver log files to the designated bucket. For more information, see Error Responses in the Amazon S3 API Reference.   This error occurs only when there is a problem with the destination S3 bucket, and does not occur for requests that time out. To resolve the issue, create a new bucket, and then call UpdateTrail to specify the new bucket; or fix the existing objects so that CloudTrail can again write to the bucket. 
     */
    LatestDeliveryError?: String;
    /**
     * Displays any Amazon SNS error that CloudTrail encountered when attempting to send a notification. For more information about Amazon SNS errors, see the Amazon SNS Developer Guide. 
     */
    LatestNotificationError?: String;
    /**
     * Specifies the date and time that CloudTrail last delivered log files to an account's Amazon S3 bucket.
     */
    LatestDeliveryTime?: _Date;
    /**
     * Specifies the date and time of the most recent Amazon SNS notification that CloudTrail has written a new log file to an account's Amazon S3 bucket.
     */
    LatestNotificationTime?: _Date;
    /**
     * Specifies the most recent date and time when CloudTrail started recording API calls for an Amazon Web Services account.
     */
    StartLoggingTime?: _Date;
    /**
     * Specifies the most recent date and time when CloudTrail stopped recording API calls for an Amazon Web Services account.
     */
    StopLoggingTime?: _Date;
    /**
     * Displays any CloudWatch Logs error that CloudTrail encountered when attempting to deliver logs to CloudWatch Logs.
     */
    LatestCloudWatchLogsDeliveryError?: String;
    /**
     * Displays the most recent date and time when CloudTrail delivered logs to CloudWatch Logs.
     */
    LatestCloudWatchLogsDeliveryTime?: _Date;
    /**
     * Specifies the date and time that CloudTrail last delivered a digest file to an account's Amazon S3 bucket.
     */
    LatestDigestDeliveryTime?: _Date;
    /**
     * Displays any Amazon S3 error that CloudTrail encountered when attempting to deliver a digest file to the designated bucket. For more information, see Error Responses in the Amazon S3 API Reference.   This error occurs only when there is a problem with the destination S3 bucket, and does not occur for requests that time out. To resolve the issue, create a new bucket, and then call UpdateTrail to specify the new bucket; or fix the existing objects so that CloudTrail can again write to the bucket. 
     */
    LatestDigestDeliveryError?: String;
    /**
     * This field is no longer in use.
     */
    LatestDeliveryAttemptTime?: String;
    /**
     * This field is no longer in use.
     */
    LatestNotificationAttemptTime?: String;
    /**
     * This field is no longer in use.
     */
    LatestNotificationAttemptSucceeded?: String;
    /**
     * This field is no longer in use.
     */
    LatestDeliveryAttemptSucceeded?: String;
    /**
     * This field is no longer in use.
     */
    TimeLoggingStarted?: String;
    /**
     * This field is no longer in use.
     */
    TimeLoggingStopped?: String;
  }
  export interface InsightSelector {
    /**
     * The type of Insights events to log on a trail. The valid Insights type in this release is ApiCallRateInsight.
     */
    InsightType?: InsightType;
  }
  export type InsightSelectors = InsightSelector[];
  export type InsightType = "ApiCallRateInsight"|string;
  export interface ListPublicKeysRequest {
    /**
     * Optionally specifies, in UTC, the start of the time range to look up public keys for CloudTrail digest files. If not specified, the current time is used, and the current public key is returned.
     */
    StartTime?: _Date;
    /**
     * Optionally specifies, in UTC, the end of the time range to look up public keys for CloudTrail digest files. If not specified, the current time is used.
     */
    EndTime?: _Date;
    /**
     * Reserved for future use.
     */
    NextToken?: String;
  }
  export interface ListPublicKeysResponse {
    /**
     * Contains an array of PublicKey objects.  The returned public keys may have validity time ranges that overlap. 
     */
    PublicKeyList?: PublicKeyList;
    /**
     * Reserved for future use.
     */
    NextToken?: String;
  }
  export interface ListTagsRequest {
    /**
     * Specifies a list of trail ARNs whose tags will be listed. The list has a limit of 20 ARNs. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    ResourceIdList: ResourceIdList;
    /**
     * Reserved for future use.
     */
    NextToken?: String;
  }
  export interface ListTagsResponse {
    /**
     * A list of resource tags.
     */
    ResourceTagList?: ResourceTagList;
    /**
     * Reserved for future use.
     */
    NextToken?: String;
  }
  export interface ListTrailsRequest {
    /**
     * The token to use to get the next page of results after a previous API call. This token must be passed in with the same parameters that were specified in the the original call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: String;
  }
  export interface ListTrailsResponse {
    /**
     * Returns the name, ARN, and home region of trails in the current account.
     */
    Trails?: Trails;
    /**
     * The token to use to get the next page of results after a previous API call. If the token does not appear, there are no more results to return. The token must be passed in with the same parameters as the previous call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: String;
  }
  export interface LookupAttribute {
    /**
     * Specifies an attribute on which to filter the events returned.
     */
    AttributeKey: LookupAttributeKey;
    /**
     * Specifies a value for the specified AttributeKey.
     */
    AttributeValue: String;
  }
  export type LookupAttributeKey = "EventId"|"EventName"|"ReadOnly"|"Username"|"ResourceType"|"ResourceName"|"EventSource"|"AccessKeyId"|string;
  export type LookupAttributesList = LookupAttribute[];
  export interface LookupEventsRequest {
    /**
     * Contains a list of lookup attributes. Currently the list can contain only one item.
     */
    LookupAttributes?: LookupAttributesList;
    /**
     * Specifies that only events that occur after or at the specified time are returned. If the specified start time is after the specified end time, an error is returned.
     */
    StartTime?: _Date;
    /**
     * Specifies that only events that occur before or at the specified time are returned. If the specified end time is before the specified start time, an error is returned.
     */
    EndTime?: _Date;
    /**
     * Specifies the event category. If you do not specify an event category, events of the category are not returned in the response. For example, if you do not specify insight as the value of EventCategory, no Insights events are returned.
     */
    EventCategory?: EventCategory;
    /**
     * The number of events to return. Possible values are 1 through 50. The default is 50.
     */
    MaxResults?: MaxResults;
    /**
     * The token to use to get the next page of results after a previous API call. This token must be passed in with the same parameters that were specified in the the original call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: NextToken;
  }
  export interface LookupEventsResponse {
    /**
     * A list of events returned based on the lookup attributes specified and the CloudTrail event. The events list is sorted by time. The most recent event is listed first.
     */
    Events?: EventsList;
    /**
     * The token to use to get the next page of results after a previous API call. If the token does not appear, there are no more results to return. The token must be passed in with the same parameters as the previous call. For example, if the original call specified an AttributeKey of 'Username' with a value of 'root', the call with NextToken should include those same parameters.
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type Operator = OperatorValue[];
  export type OperatorValue = string;
  export interface PublicKey {
    /**
     * The DER encoded public key value in PKCS#1 format.
     */
    Value?: ByteBuffer;
    /**
     * The starting time of validity of the public key.
     */
    ValidityStartTime?: _Date;
    /**
     * The ending time of validity of the public key.
     */
    ValidityEndTime?: _Date;
    /**
     * The fingerprint of the public key.
     */
    Fingerprint?: String;
  }
  export type PublicKeyList = PublicKey[];
  export interface PutEventSelectorsRequest {
    /**
     * Specifies the name of the trail or trail ARN. If you specify a trail name, the string must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)   If you specify a trail ARN, it must be in the following format.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailName: String;
    /**
     * Specifies the settings for your event selectors. You can configure up to five event selectors for a trail. You can use either EventSelectors or AdvancedEventSelectors in a PutEventSelectors request, but not both. If you apply EventSelectors to a trail, any existing AdvancedEventSelectors are overwritten.
     */
    EventSelectors?: EventSelectors;
    /**
     *  Specifies the settings for advanced event selectors. You can add advanced event selectors, and conditions for your advanced event selectors, up to a maximum of 500 values for all conditions and selectors on a trail. You can use either AdvancedEventSelectors or EventSelectors, but not both. If you apply AdvancedEventSelectors to a trail, any existing EventSelectors are overwritten. For more information about advanced event selectors, see Logging data events for trails in the CloudTrail User Guide. 
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
  }
  export interface PutEventSelectorsResponse {
    /**
     * Specifies the ARN of the trail that was updated with event selectors. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailARN?: String;
    /**
     * Specifies the event selectors configured for your trail.
     */
    EventSelectors?: EventSelectors;
    /**
     * Specifies the advanced event selectors configured for your trail.
     */
    AdvancedEventSelectors?: AdvancedEventSelectors;
  }
  export interface PutInsightSelectorsRequest {
    /**
     * The name of the CloudTrail trail for which you want to change or add Insights selectors.
     */
    TrailName: String;
    /**
     * A JSON string that contains the Insights types that you want to log on a trail. The valid Insights type in this release is ApiCallRateInsight.
     */
    InsightSelectors: InsightSelectors;
  }
  export interface PutInsightSelectorsResponse {
    /**
     * The Amazon Resource Name (ARN) of a trail for which you want to change or add Insights selectors.
     */
    TrailARN?: String;
    /**
     * A JSON string that contains the Insights event types that you want to log on a trail. The valid Insights type in this release is ApiCallRateInsight.
     */
    InsightSelectors?: InsightSelectors;
  }
  export type ReadWriteType = "ReadOnly"|"WriteOnly"|"All"|string;
  export interface RemoveTagsRequest {
    /**
     * Specifies the ARN of the trail from which tags should be removed. The format of a trail ARN is:  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    ResourceId: String;
    /**
     * Specifies a list of tags to be removed.
     */
    TagsList?: TagsList;
  }
  export interface RemoveTagsResponse {
  }
  export interface Resource {
    /**
     * The type of a resource referenced by the event returned. When the resource type cannot be determined, null is returned. Some examples of resource types are: Instance for EC2, Trail for CloudTrail, DBInstance for Amazon RDS, and AccessKey for IAM. To learn more about how to look up and filter events by the resource types supported for a service, see Filtering CloudTrail Events.
     */
    ResourceType?: String;
    /**
     * The name of the resource referenced by the event returned. These are user-created names whose values will depend on the environment. For example, the resource name might be "auto-scaling-test-group" for an Auto Scaling Group or "i-1234567" for an EC2 Instance.
     */
    ResourceName?: String;
  }
  export type ResourceIdList = String[];
  export type ResourceList = Resource[];
  export interface ResourceTag {
    /**
     * Specifies the ARN of the resource.
     */
    ResourceId?: String;
    /**
     * A list of tags.
     */
    TagsList?: TagsList;
  }
  export type ResourceTagList = ResourceTag[];
  export type SelectorField = string;
  export type SelectorName = string;
  export interface StartLoggingRequest {
    /**
     * Specifies the name or the CloudTrail ARN of the trail for which CloudTrail logs Amazon Web Services API calls. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
  }
  export interface StartLoggingResponse {
  }
  export interface StopLoggingRequest {
    /**
     * Specifies the name or the CloudTrail ARN of the trail for which CloudTrail will stop logging Amazon Web Services API calls. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
  }
  export interface StopLoggingResponse {
  }
  export type String = string;
  export interface Tag {
    /**
     * The key in a key-value pair. The key must be must be no longer than 128 Unicode characters. The key must be unique for the resource to which it applies.
     */
    Key: String;
    /**
     * The value in a key-value pair of a tag. The value must be no longer than 256 Unicode characters.
     */
    Value?: String;
  }
  export type TagsList = Tag[];
  export interface Trail {
    /**
     * Name of the trail set by calling CreateTrail. The maximum length is 128 characters.
     */
    Name?: String;
    /**
     * Name of the Amazon S3 bucket into which CloudTrail delivers your trail files. See Amazon S3 Bucket Naming Requirements.
     */
    S3BucketName?: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your CloudTrail Log Files. The maximum length is 200 characters.
     */
    S3KeyPrefix?: String;
    /**
     * This field is no longer in use. Use SnsTopicARN.
     */
    SnsTopicName?: String;
    /**
     * Specifies the ARN of the Amazon SNS topic that CloudTrail uses to send notifications when log files are delivered. The following is the format of a topic ARN.  arn:aws:sns:us-east-2:123456789012:MyTopic 
     */
    SnsTopicARN?: String;
    /**
     * Set to True to include Amazon Web Services API calls from Amazon Web Services global services such as IAM. Otherwise, False.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail exists only in one region or exists in all regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * The region in which the trail was created.
     */
    HomeRegion?: String;
    /**
     * Specifies the ARN of the trail. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailARN?: String;
    /**
     * Specifies whether log file validation is enabled.
     */
    LogFileValidationEnabled?: Boolean;
    /**
     * Specifies an Amazon Resource Name (ARN), a unique identifier that represents the log group to which CloudTrail logs will be delivered.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID that encrypts the logs delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: String;
    /**
     * Specifies if the trail has custom event selectors.
     */
    HasCustomEventSelectors?: Boolean;
    /**
     * Specifies whether a trail has insight types specified in an InsightSelector list.
     */
    HasInsightSelectors?: Boolean;
    /**
     * Specifies whether the trail is an organization trail.
     */
    IsOrganizationTrail?: Boolean;
  }
  export interface TrailInfo {
    /**
     * The ARN of a trail.
     */
    TrailARN?: String;
    /**
     * The name of a trail.
     */
    Name?: String;
    /**
     * The Amazon Web Services Region in which a trail was created.
     */
    HomeRegion?: String;
  }
  export type TrailList = Trail[];
  export type TrailNameList = String[];
  export type Trails = TrailInfo[];
  export interface UpdateTrailRequest {
    /**
     * Specifies the name of the trail or trail ARN. If Name is a trail name, the string must meet the following requirements:   Contain only ASCII letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), or dashes (-)   Start with a letter or number, and end with a letter or number   Be between 3 and 128 characters   Have no adjacent periods, underscores or dashes. Names like my-_namespace and my--namespace are not valid.   Not be in IP address format (for example, 192.168.5.4)   If Name is a trail ARN, it must be in the following format.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    Name: String;
    /**
     * Specifies the name of the Amazon S3 bucket designated for publishing log files. See Amazon S3 Bucket Naming Requirements.
     */
    S3BucketName?: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your CloudTrail Log Files. The maximum length is 200 characters.
     */
    S3KeyPrefix?: String;
    /**
     * Specifies the name of the Amazon SNS topic defined for notification of log file delivery. The maximum length is 256 characters.
     */
    SnsTopicName?: String;
    /**
     * Specifies whether the trail is publishing events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail applies only to the current region or to all regions. The default is false. If the trail exists only in the current region and this value is set to true, shadow trails (replications of the trail) will be created in the other regions. If the trail exists in all regions and this value is set to false, the trail will remain in the region where it was created, and its shadow trails in other regions will be deleted. As a best practice, consider using trails that log events in all regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Specifies whether log file validation is enabled. The default is false.  When you disable log file integrity validation, the chain of digest files is broken after one hour. CloudTrail does not create digest files for log files that were delivered during a period in which log file integrity validation was disabled. For example, if you enable log file integrity validation at noon on January 1, disable it at noon on January 2, and re-enable it at noon on January 10, digest files will not be created for the log files delivered from noon on January 2 to noon on January 10. The same applies whenever you stop CloudTrail logging or delete a trail. 
     */
    EnableLogFileValidation?: Boolean;
    /**
     * Specifies a log group name using an Amazon Resource Name (ARN), a unique identifier that represents the log group to which CloudTrail logs are delivered. Not required unless you specify CloudWatchLogsRoleArn.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID to use to encrypt the logs delivered by CloudTrail. The value can be an alias name prefixed by "alias/", a fully specified ARN to an alias, a fully specified ARN to a key, or a globally unique identifier. CloudTrail also supports KMS multi-Region keys. For more information about multi-Region keys, see Using multi-Region keys in the Key Management Service Developer Guide. Examples:   alias/MyAliasName   arn:aws:kms:us-east-2:123456789012:alias/MyAliasName   arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012   12345678-1234-1234-1234-123456789012  
     */
    KmsKeyId?: String;
    /**
     * Specifies whether the trail is applied to all accounts in an organization in Organizations, or only for the current Amazon Web Services account. The default is false, and cannot be true unless the call is made on behalf of an Amazon Web Services account that is the management account for an organization in Organizations. If the trail is not an organization trail and this is set to true, the trail will be created in all Amazon Web Services accounts that belong to the organization. If the trail is an organization trail and this is set to false, the trail will remain in the current Amazon Web Services account but be deleted from all member accounts in the organization.
     */
    IsOrganizationTrail?: Boolean;
  }
  export interface UpdateTrailResponse {
    /**
     * Specifies the name of the trail.
     */
    Name?: String;
    /**
     * Specifies the name of the Amazon S3 bucket designated for publishing log files.
     */
    S3BucketName?: String;
    /**
     * Specifies the Amazon S3 key prefix that comes after the name of the bucket you have designated for log file delivery. For more information, see Finding Your IAM Log Files.
     */
    S3KeyPrefix?: String;
    /**
     * This field is no longer in use. Use UpdateTrailResponse$SnsTopicARN.
     */
    SnsTopicName?: String;
    /**
     * Specifies the ARN of the Amazon SNS topic that CloudTrail uses to send notifications when log files are delivered. The following is the format of a topic ARN.  arn:aws:sns:us-east-2:123456789012:MyTopic 
     */
    SnsTopicARN?: String;
    /**
     * Specifies whether the trail is publishing events from global services such as IAM to the log files.
     */
    IncludeGlobalServiceEvents?: Boolean;
    /**
     * Specifies whether the trail exists in one region or in all regions.
     */
    IsMultiRegionTrail?: Boolean;
    /**
     * Specifies the ARN of the trail that was updated. The following is the format of a trail ARN.  arn:aws:cloudtrail:us-east-2:123456789012:trail/MyTrail 
     */
    TrailARN?: String;
    /**
     * Specifies whether log file integrity validation is enabled.
     */
    LogFileValidationEnabled?: Boolean;
    /**
     * Specifies the Amazon Resource Name (ARN) of the log group to which CloudTrail logs are delivered.
     */
    CloudWatchLogsLogGroupArn?: String;
    /**
     * Specifies the role for the CloudWatch Logs endpoint to assume to write to a user's log group.
     */
    CloudWatchLogsRoleArn?: String;
    /**
     * Specifies the KMS key ID that encrypts the logs delivered by CloudTrail. The value is a fully specified ARN to a KMS key in the following format.  arn:aws:kms:us-east-2:123456789012:key/12345678-1234-1234-1234-123456789012 
     */
    KmsKeyId?: String;
    /**
     * Specifies whether the trail is an organization trail.
     */
    IsOrganizationTrail?: Boolean;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2013-11-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CloudTrail client.
   */
  export import Types = CloudTrail;
}
export = CloudTrail;
