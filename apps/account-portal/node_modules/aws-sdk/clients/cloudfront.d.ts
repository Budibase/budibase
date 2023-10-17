import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {CloudFrontCustomizations} from '../lib/services/cloudfront';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Signer as signer} from '../lib/cloudfront/signer';
interface Blob {}
declare class CloudFront extends CloudFrontCustomizations {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CloudFront.Types.ClientConfiguration)
  config: Config & CloudFront.Types.ClientConfiguration;
  /**
   * Associates an alias (also known as a CNAME or an alternate domain name) with a CloudFront distribution. With this operation you can move an alias that’s already in use on a CloudFront distribution to a different distribution in one step. This prevents the downtime that could occur if you first remove the alias from one distribution and then separately add the alias to another distribution. To use this operation to associate an alias with a distribution, you provide the alias and the ID of the target distribution for the alias. For more information, including how to set up the target distribution, prerequisites that you must complete, and other restrictions, see Moving an alternate domain name to a different distribution in the Amazon CloudFront Developer Guide.
   */
  associateAlias(params: CloudFront.Types.AssociateAliasRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates an alias (also known as a CNAME or an alternate domain name) with a CloudFront distribution. With this operation you can move an alias that’s already in use on a CloudFront distribution to a different distribution in one step. This prevents the downtime that could occur if you first remove the alias from one distribution and then separately add the alias to another distribution. To use this operation to associate an alias with a distribution, you provide the alias and the ID of the target distribution for the alias. For more information, including how to set up the target distribution, prerequisites that you must complete, and other restrictions, see Moving an alternate domain name to a different distribution in the Amazon CloudFront Developer Guide.
   */
  associateAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a cache policy. After you create a cache policy, you can attach it to one or more cache behaviors. When it’s attached to a cache behavior, the cache policy determines the following:   The values that CloudFront includes in the cache key. These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.   The default, minimum, and maximum time to live (TTL) values that you want objects to stay in the CloudFront cache.   The headers, cookies, and query strings that are included in the cache key are automatically included in requests that CloudFront sends to the origin. CloudFront sends a request when it can’t find an object in its cache that matches the request’s cache key. If you want to send values to the origin but not include them in the cache key, use OriginRequestPolicy. For more information about cache policies, see Controlling the cache key in the Amazon CloudFront Developer Guide.
   */
  createCachePolicy(params: CloudFront.Types.CreateCachePolicyRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateCachePolicyResult) => void): Request<CloudFront.Types.CreateCachePolicyResult, AWSError>;
  /**
   * Creates a cache policy. After you create a cache policy, you can attach it to one or more cache behaviors. When it’s attached to a cache behavior, the cache policy determines the following:   The values that CloudFront includes in the cache key. These values can include HTTP headers, cookies, and URL query strings. CloudFront uses the cache key to find an object in its cache that it can return to the viewer.   The default, minimum, and maximum time to live (TTL) values that you want objects to stay in the CloudFront cache.   The headers, cookies, and query strings that are included in the cache key are automatically included in requests that CloudFront sends to the origin. CloudFront sends a request when it can’t find an object in its cache that matches the request’s cache key. If you want to send values to the origin but not include them in the cache key, use OriginRequestPolicy. For more information about cache policies, see Controlling the cache key in the Amazon CloudFront Developer Guide.
   */
  createCachePolicy(callback?: (err: AWSError, data: CloudFront.Types.CreateCachePolicyResult) => void): Request<CloudFront.Types.CreateCachePolicyResult, AWSError>;
  /**
   * Creates a new origin access identity. If you're using Amazon S3 for your origin, you can use an origin access identity to require users to access your content using a CloudFront URL instead of the Amazon S3 URL. For more information about how to use origin access identities, see Serving Private Content through CloudFront in the Amazon CloudFront Developer Guide.
   */
  createCloudFrontOriginAccessIdentity(params: CloudFront.Types.CreateCloudFrontOriginAccessIdentityRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateCloudFrontOriginAccessIdentityResult) => void): Request<CloudFront.Types.CreateCloudFrontOriginAccessIdentityResult, AWSError>;
  /**
   * Creates a new origin access identity. If you're using Amazon S3 for your origin, you can use an origin access identity to require users to access your content using a CloudFront URL instead of the Amazon S3 URL. For more information about how to use origin access identities, see Serving Private Content through CloudFront in the Amazon CloudFront Developer Guide.
   */
  createCloudFrontOriginAccessIdentity(callback?: (err: AWSError, data: CloudFront.Types.CreateCloudFrontOriginAccessIdentityResult) => void): Request<CloudFront.Types.CreateCloudFrontOriginAccessIdentityResult, AWSError>;
  /**
   * Creates a new web distribution. You create a CloudFront distribution to tell CloudFront where you want content to be delivered from, and the details about how to track and manage content delivery. Send a POST request to the /CloudFront API version/distribution/distribution ID resource.  When you update a distribution, there are more required fields than when you create a distribution. When you update your distribution by using UpdateDistribution, follow the steps included in the documentation to get the current configuration and then make your updates. This helps to make sure that you include all of the required fields. To view a summary, see Required Fields for Create Distribution and Update Distribution in the Amazon CloudFront Developer Guide. 
   */
  createDistribution(params: CloudFront.Types.CreateDistributionRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateDistributionResult) => void): Request<CloudFront.Types.CreateDistributionResult, AWSError>;
  /**
   * Creates a new web distribution. You create a CloudFront distribution to tell CloudFront where you want content to be delivered from, and the details about how to track and manage content delivery. Send a POST request to the /CloudFront API version/distribution/distribution ID resource.  When you update a distribution, there are more required fields than when you create a distribution. When you update your distribution by using UpdateDistribution, follow the steps included in the documentation to get the current configuration and then make your updates. This helps to make sure that you include all of the required fields. To view a summary, see Required Fields for Create Distribution and Update Distribution in the Amazon CloudFront Developer Guide. 
   */
  createDistribution(callback?: (err: AWSError, data: CloudFront.Types.CreateDistributionResult) => void): Request<CloudFront.Types.CreateDistributionResult, AWSError>;
  /**
   * Create a new distribution with tags.
   */
  createDistributionWithTags(params: CloudFront.Types.CreateDistributionWithTagsRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateDistributionWithTagsResult) => void): Request<CloudFront.Types.CreateDistributionWithTagsResult, AWSError>;
  /**
   * Create a new distribution with tags.
   */
  createDistributionWithTags(callback?: (err: AWSError, data: CloudFront.Types.CreateDistributionWithTagsResult) => void): Request<CloudFront.Types.CreateDistributionWithTagsResult, AWSError>;
  /**
   * Create a new field-level encryption configuration.
   */
  createFieldLevelEncryptionConfig(params: CloudFront.Types.CreateFieldLevelEncryptionConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateFieldLevelEncryptionConfigResult) => void): Request<CloudFront.Types.CreateFieldLevelEncryptionConfigResult, AWSError>;
  /**
   * Create a new field-level encryption configuration.
   */
  createFieldLevelEncryptionConfig(callback?: (err: AWSError, data: CloudFront.Types.CreateFieldLevelEncryptionConfigResult) => void): Request<CloudFront.Types.CreateFieldLevelEncryptionConfigResult, AWSError>;
  /**
   * Create a field-level encryption profile.
   */
  createFieldLevelEncryptionProfile(params: CloudFront.Types.CreateFieldLevelEncryptionProfileRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateFieldLevelEncryptionProfileResult) => void): Request<CloudFront.Types.CreateFieldLevelEncryptionProfileResult, AWSError>;
  /**
   * Create a field-level encryption profile.
   */
  createFieldLevelEncryptionProfile(callback?: (err: AWSError, data: CloudFront.Types.CreateFieldLevelEncryptionProfileResult) => void): Request<CloudFront.Types.CreateFieldLevelEncryptionProfileResult, AWSError>;
  /**
   * Creates a CloudFront function. To create a function, you provide the function code and some configuration information about the function. The response contains an Amazon Resource Name (ARN) that uniquely identifies the function. When you create a function, it’s in the DEVELOPMENT stage. In this stage, you can test the function with TestFunction, and update it with UpdateFunction. When you’re ready to use your function with a CloudFront distribution, use PublishFunction to copy the function from the DEVELOPMENT stage to LIVE. When it’s live, you can attach the function to a distribution’s cache behavior, using the function’s ARN.
   */
  createFunction(params: CloudFront.Types.CreateFunctionRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateFunctionResult) => void): Request<CloudFront.Types.CreateFunctionResult, AWSError>;
  /**
   * Creates a CloudFront function. To create a function, you provide the function code and some configuration information about the function. The response contains an Amazon Resource Name (ARN) that uniquely identifies the function. When you create a function, it’s in the DEVELOPMENT stage. In this stage, you can test the function with TestFunction, and update it with UpdateFunction. When you’re ready to use your function with a CloudFront distribution, use PublishFunction to copy the function from the DEVELOPMENT stage to LIVE. When it’s live, you can attach the function to a distribution’s cache behavior, using the function’s ARN.
   */
  createFunction(callback?: (err: AWSError, data: CloudFront.Types.CreateFunctionResult) => void): Request<CloudFront.Types.CreateFunctionResult, AWSError>;
  /**
   * Create a new invalidation. 
   */
  createInvalidation(params: CloudFront.Types.CreateInvalidationRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateInvalidationResult) => void): Request<CloudFront.Types.CreateInvalidationResult, AWSError>;
  /**
   * Create a new invalidation. 
   */
  createInvalidation(callback?: (err: AWSError, data: CloudFront.Types.CreateInvalidationResult) => void): Request<CloudFront.Types.CreateInvalidationResult, AWSError>;
  /**
   * Creates a key group that you can use with CloudFront signed URLs and signed cookies. To create a key group, you must specify at least one public key for the key group. After you create a key group, you can reference it from one or more cache behaviors. When you reference a key group in a cache behavior, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see Serving private content in the Amazon CloudFront Developer Guide.
   */
  createKeyGroup(params: CloudFront.Types.CreateKeyGroupRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateKeyGroupResult) => void): Request<CloudFront.Types.CreateKeyGroupResult, AWSError>;
  /**
   * Creates a key group that you can use with CloudFront signed URLs and signed cookies. To create a key group, you must specify at least one public key for the key group. After you create a key group, you can reference it from one or more cache behaviors. When you reference a key group in a cache behavior, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see Serving private content in the Amazon CloudFront Developer Guide.
   */
  createKeyGroup(callback?: (err: AWSError, data: CloudFront.Types.CreateKeyGroupResult) => void): Request<CloudFront.Types.CreateKeyGroupResult, AWSError>;
  /**
   * Enables additional CloudWatch metrics for the specified CloudFront distribution. The additional metrics incur an additional cost. For more information, see Viewing additional CloudFront distribution metrics in the Amazon CloudFront Developer Guide.
   */
  createMonitoringSubscription(params: CloudFront.Types.CreateMonitoringSubscriptionRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateMonitoringSubscriptionResult) => void): Request<CloudFront.Types.CreateMonitoringSubscriptionResult, AWSError>;
  /**
   * Enables additional CloudWatch metrics for the specified CloudFront distribution. The additional metrics incur an additional cost. For more information, see Viewing additional CloudFront distribution metrics in the Amazon CloudFront Developer Guide.
   */
  createMonitoringSubscription(callback?: (err: AWSError, data: CloudFront.Types.CreateMonitoringSubscriptionResult) => void): Request<CloudFront.Types.CreateMonitoringSubscriptionResult, AWSError>;
  /**
   * Creates an origin request policy. After you create an origin request policy, you can attach it to one or more cache behaviors. When it’s attached to a cache behavior, the origin request policy determines the values that CloudFront includes in requests that it sends to the origin. Each request that CloudFront sends to the origin includes the following:   The request body and the URL path (without the domain name) from the viewer request.   The headers that CloudFront automatically includes in every origin request, including Host, User-Agent, and X-Amz-Cf-Id.   All HTTP headers, cookies, and URL query strings that are specified in the cache policy or the origin request policy. These can include items from the viewer request and, in the case of headers, additional ones that are added by CloudFront.   CloudFront sends a request when it can’t find a valid object in its cache that matches the request. If you want to send values to the origin and also include them in the cache key, use CachePolicy. For more information about origin request policies, see Controlling origin requests in the Amazon CloudFront Developer Guide.
   */
  createOriginRequestPolicy(params: CloudFront.Types.CreateOriginRequestPolicyRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateOriginRequestPolicyResult) => void): Request<CloudFront.Types.CreateOriginRequestPolicyResult, AWSError>;
  /**
   * Creates an origin request policy. After you create an origin request policy, you can attach it to one or more cache behaviors. When it’s attached to a cache behavior, the origin request policy determines the values that CloudFront includes in requests that it sends to the origin. Each request that CloudFront sends to the origin includes the following:   The request body and the URL path (without the domain name) from the viewer request.   The headers that CloudFront automatically includes in every origin request, including Host, User-Agent, and X-Amz-Cf-Id.   All HTTP headers, cookies, and URL query strings that are specified in the cache policy or the origin request policy. These can include items from the viewer request and, in the case of headers, additional ones that are added by CloudFront.   CloudFront sends a request when it can’t find a valid object in its cache that matches the request. If you want to send values to the origin and also include them in the cache key, use CachePolicy. For more information about origin request policies, see Controlling origin requests in the Amazon CloudFront Developer Guide.
   */
  createOriginRequestPolicy(callback?: (err: AWSError, data: CloudFront.Types.CreateOriginRequestPolicyResult) => void): Request<CloudFront.Types.CreateOriginRequestPolicyResult, AWSError>;
  /**
   * Uploads a public key to CloudFront that you can use with signed URLs and signed cookies, or with field-level encryption.
   */
  createPublicKey(params: CloudFront.Types.CreatePublicKeyRequest, callback?: (err: AWSError, data: CloudFront.Types.CreatePublicKeyResult) => void): Request<CloudFront.Types.CreatePublicKeyResult, AWSError>;
  /**
   * Uploads a public key to CloudFront that you can use with signed URLs and signed cookies, or with field-level encryption.
   */
  createPublicKey(callback?: (err: AWSError, data: CloudFront.Types.CreatePublicKeyResult) => void): Request<CloudFront.Types.CreatePublicKeyResult, AWSError>;
  /**
   * Creates a real-time log configuration. After you create a real-time log configuration, you can attach it to one or more cache behaviors to send real-time log data to the specified Amazon Kinesis data stream. For more information about real-time log configurations, see Real-time logs in the Amazon CloudFront Developer Guide.
   */
  createRealtimeLogConfig(params: CloudFront.Types.CreateRealtimeLogConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateRealtimeLogConfigResult) => void): Request<CloudFront.Types.CreateRealtimeLogConfigResult, AWSError>;
  /**
   * Creates a real-time log configuration. After you create a real-time log configuration, you can attach it to one or more cache behaviors to send real-time log data to the specified Amazon Kinesis data stream. For more information about real-time log configurations, see Real-time logs in the Amazon CloudFront Developer Guide.
   */
  createRealtimeLogConfig(callback?: (err: AWSError, data: CloudFront.Types.CreateRealtimeLogConfigResult) => void): Request<CloudFront.Types.CreateRealtimeLogConfigResult, AWSError>;
  /**
   * This API is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, read the announcement on the Amazon CloudFront discussion forum.
   */
  createStreamingDistribution(params: CloudFront.Types.CreateStreamingDistributionRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateStreamingDistributionResult) => void): Request<CloudFront.Types.CreateStreamingDistributionResult, AWSError>;
  /**
   * This API is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, read the announcement on the Amazon CloudFront discussion forum.
   */
  createStreamingDistribution(callback?: (err: AWSError, data: CloudFront.Types.CreateStreamingDistributionResult) => void): Request<CloudFront.Types.CreateStreamingDistributionResult, AWSError>;
  /**
   * This API is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, read the announcement on the Amazon CloudFront discussion forum.
   */
  createStreamingDistributionWithTags(params: CloudFront.Types.CreateStreamingDistributionWithTagsRequest, callback?: (err: AWSError, data: CloudFront.Types.CreateStreamingDistributionWithTagsResult) => void): Request<CloudFront.Types.CreateStreamingDistributionWithTagsResult, AWSError>;
  /**
   * This API is deprecated. Amazon CloudFront is deprecating real-time messaging protocol (RTMP) distributions on December 31, 2020. For more information, read the announcement on the Amazon CloudFront discussion forum.
   */
  createStreamingDistributionWithTags(callback?: (err: AWSError, data: CloudFront.Types.CreateStreamingDistributionWithTagsResult) => void): Request<CloudFront.Types.CreateStreamingDistributionWithTagsResult, AWSError>;
  /**
   * Deletes a cache policy. You cannot delete a cache policy if it’s attached to a cache behavior. First update your distributions to remove the cache policy from all cache behaviors, then delete the cache policy. To delete a cache policy, you must provide the policy’s identifier and version. To get these values, you can use ListCachePolicies or GetCachePolicy.
   */
  deleteCachePolicy(params: CloudFront.Types.DeleteCachePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a cache policy. You cannot delete a cache policy if it’s attached to a cache behavior. First update your distributions to remove the cache policy from all cache behaviors, then delete the cache policy. To delete a cache policy, you must provide the policy’s identifier and version. To get these values, you can use ListCachePolicies or GetCachePolicy.
   */
  deleteCachePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an origin access identity. 
   */
  deleteCloudFrontOriginAccessIdentity(params: CloudFront.Types.DeleteCloudFrontOriginAccessIdentityRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an origin access identity. 
   */
  deleteCloudFrontOriginAccessIdentity(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a distribution. 
   */
  deleteDistribution(params: CloudFront.Types.DeleteDistributionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a distribution. 
   */
  deleteDistribution(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove a field-level encryption configuration.
   */
  deleteFieldLevelEncryptionConfig(params: CloudFront.Types.DeleteFieldLevelEncryptionConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove a field-level encryption configuration.
   */
  deleteFieldLevelEncryptionConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove a field-level encryption profile.
   */
  deleteFieldLevelEncryptionProfile(params: CloudFront.Types.DeleteFieldLevelEncryptionProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove a field-level encryption profile.
   */
  deleteFieldLevelEncryptionProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a CloudFront function. You cannot delete a function if it’s associated with a cache behavior. First, update your distributions to remove the function association from all cache behaviors, then delete the function. To delete a function, you must provide the function’s name and version (ETag value). To get these values, you can use ListFunctions and DescribeFunction.
   */
  deleteFunction(params: CloudFront.Types.DeleteFunctionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a CloudFront function. You cannot delete a function if it’s associated with a cache behavior. First, update your distributions to remove the function association from all cache behaviors, then delete the function. To delete a function, you must provide the function’s name and version (ETag value). To get these values, you can use ListFunctions and DescribeFunction.
   */
  deleteFunction(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a key group. You cannot delete a key group that is referenced in a cache behavior. First update your distributions to remove the key group from all cache behaviors, then delete the key group. To delete a key group, you must provide the key group’s identifier and version. To get these values, use ListKeyGroups followed by GetKeyGroup or GetKeyGroupConfig.
   */
  deleteKeyGroup(params: CloudFront.Types.DeleteKeyGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a key group. You cannot delete a key group that is referenced in a cache behavior. First update your distributions to remove the key group from all cache behaviors, then delete the key group. To delete a key group, you must provide the key group’s identifier and version. To get these values, use ListKeyGroups followed by GetKeyGroup or GetKeyGroupConfig.
   */
  deleteKeyGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables additional CloudWatch metrics for the specified CloudFront distribution.
   */
  deleteMonitoringSubscription(params: CloudFront.Types.DeleteMonitoringSubscriptionRequest, callback?: (err: AWSError, data: CloudFront.Types.DeleteMonitoringSubscriptionResult) => void): Request<CloudFront.Types.DeleteMonitoringSubscriptionResult, AWSError>;
  /**
   * Disables additional CloudWatch metrics for the specified CloudFront distribution.
   */
  deleteMonitoringSubscription(callback?: (err: AWSError, data: CloudFront.Types.DeleteMonitoringSubscriptionResult) => void): Request<CloudFront.Types.DeleteMonitoringSubscriptionResult, AWSError>;
  /**
   * Deletes an origin request policy. You cannot delete an origin request policy if it’s attached to any cache behaviors. First update your distributions to remove the origin request policy from all cache behaviors, then delete the origin request policy. To delete an origin request policy, you must provide the policy’s identifier and version. To get the identifier, you can use ListOriginRequestPolicies or GetOriginRequestPolicy.
   */
  deleteOriginRequestPolicy(params: CloudFront.Types.DeleteOriginRequestPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an origin request policy. You cannot delete an origin request policy if it’s attached to any cache behaviors. First update your distributions to remove the origin request policy from all cache behaviors, then delete the origin request policy. To delete an origin request policy, you must provide the policy’s identifier and version. To get the identifier, you can use ListOriginRequestPolicies or GetOriginRequestPolicy.
   */
  deleteOriginRequestPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove a public key you previously added to CloudFront.
   */
  deletePublicKey(params: CloudFront.Types.DeletePublicKeyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove a public key you previously added to CloudFront.
   */
  deletePublicKey(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a real-time log configuration. You cannot delete a real-time log configuration if it’s attached to a cache behavior. First update your distributions to remove the real-time log configuration from all cache behaviors, then delete the real-time log configuration. To delete a real-time log configuration, you can provide the configuration’s name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to delete.
   */
  deleteRealtimeLogConfig(params: CloudFront.Types.DeleteRealtimeLogConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a real-time log configuration. You cannot delete a real-time log configuration if it’s attached to a cache behavior. First update your distributions to remove the real-time log configuration from all cache behaviors, then delete the real-time log configuration. To delete a real-time log configuration, you can provide the configuration’s name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to delete.
   */
  deleteRealtimeLogConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a streaming distribution. To delete an RTMP distribution using the CloudFront API, perform the following steps.  To delete an RTMP distribution using the CloudFront API:   Disable the RTMP distribution.   Submit a GET Streaming Distribution Config request to get the current configuration and the Etag header for the distribution.    Update the XML document that was returned in the response to your GET Streaming Distribution Config request to change the value of Enabled to false.   Submit a PUT Streaming Distribution Config request to update the configuration for your distribution. In the request body, include the XML document that you updated in Step 3. Then set the value of the HTTP If-Match header to the value of the ETag header that CloudFront returned when you submitted the GET Streaming Distribution Config request in Step 2.   Review the response to the PUT Streaming Distribution Config request to confirm that the distribution was successfully disabled.   Submit a GET Streaming Distribution Config request to confirm that your changes have propagated. When propagation is complete, the value of Status is Deployed.   Submit a DELETE Streaming Distribution request. Set the value of the HTTP If-Match header to the value of the ETag header that CloudFront returned when you submitted the GET Streaming Distribution Config request in Step 2.   Review the response to your DELETE Streaming Distribution request to confirm that the distribution was successfully deleted.   For information about deleting a distribution using the CloudFront console, see Deleting a Distribution in the Amazon CloudFront Developer Guide.
   */
  deleteStreamingDistribution(params: CloudFront.Types.DeleteStreamingDistributionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a streaming distribution. To delete an RTMP distribution using the CloudFront API, perform the following steps.  To delete an RTMP distribution using the CloudFront API:   Disable the RTMP distribution.   Submit a GET Streaming Distribution Config request to get the current configuration and the Etag header for the distribution.    Update the XML document that was returned in the response to your GET Streaming Distribution Config request to change the value of Enabled to false.   Submit a PUT Streaming Distribution Config request to update the configuration for your distribution. In the request body, include the XML document that you updated in Step 3. Then set the value of the HTTP If-Match header to the value of the ETag header that CloudFront returned when you submitted the GET Streaming Distribution Config request in Step 2.   Review the response to the PUT Streaming Distribution Config request to confirm that the distribution was successfully disabled.   Submit a GET Streaming Distribution Config request to confirm that your changes have propagated. When propagation is complete, the value of Status is Deployed.   Submit a DELETE Streaming Distribution request. Set the value of the HTTP If-Match header to the value of the ETag header that CloudFront returned when you submitted the GET Streaming Distribution Config request in Step 2.   Review the response to your DELETE Streaming Distribution request to confirm that the distribution was successfully deleted.   For information about deleting a distribution using the CloudFront console, see Deleting a Distribution in the Amazon CloudFront Developer Guide.
   */
  deleteStreamingDistribution(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets configuration information and metadata about a CloudFront function, but not the function’s code. To get a function’s code, use GetFunction. To get configuration information and metadata about a function, you must provide the function’s name and stage. To get these values, you can use ListFunctions.
   */
  describeFunction(params: CloudFront.Types.DescribeFunctionRequest, callback?: (err: AWSError, data: CloudFront.Types.DescribeFunctionResult) => void): Request<CloudFront.Types.DescribeFunctionResult, AWSError>;
  /**
   * Gets configuration information and metadata about a CloudFront function, but not the function’s code. To get a function’s code, use GetFunction. To get configuration information and metadata about a function, you must provide the function’s name and stage. To get these values, you can use ListFunctions.
   */
  describeFunction(callback?: (err: AWSError, data: CloudFront.Types.DescribeFunctionResult) => void): Request<CloudFront.Types.DescribeFunctionResult, AWSError>;
  /**
   * Gets a cache policy, including the following metadata:   The policy’s identifier.   The date and time when the policy was last modified.   To get a cache policy, you must provide the policy’s identifier. If the cache policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the cache policy is not attached to a cache behavior, you can get the identifier using ListCachePolicies.
   */
  getCachePolicy(params: CloudFront.Types.GetCachePolicyRequest, callback?: (err: AWSError, data: CloudFront.Types.GetCachePolicyResult) => void): Request<CloudFront.Types.GetCachePolicyResult, AWSError>;
  /**
   * Gets a cache policy, including the following metadata:   The policy’s identifier.   The date and time when the policy was last modified.   To get a cache policy, you must provide the policy’s identifier. If the cache policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the cache policy is not attached to a cache behavior, you can get the identifier using ListCachePolicies.
   */
  getCachePolicy(callback?: (err: AWSError, data: CloudFront.Types.GetCachePolicyResult) => void): Request<CloudFront.Types.GetCachePolicyResult, AWSError>;
  /**
   * Gets a cache policy configuration. To get a cache policy configuration, you must provide the policy’s identifier. If the cache policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the cache policy is not attached to a cache behavior, you can get the identifier using ListCachePolicies.
   */
  getCachePolicyConfig(params: CloudFront.Types.GetCachePolicyConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetCachePolicyConfigResult) => void): Request<CloudFront.Types.GetCachePolicyConfigResult, AWSError>;
  /**
   * Gets a cache policy configuration. To get a cache policy configuration, you must provide the policy’s identifier. If the cache policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the cache policy is not attached to a cache behavior, you can get the identifier using ListCachePolicies.
   */
  getCachePolicyConfig(callback?: (err: AWSError, data: CloudFront.Types.GetCachePolicyConfigResult) => void): Request<CloudFront.Types.GetCachePolicyConfigResult, AWSError>;
  /**
   * Get the information about an origin access identity. 
   */
  getCloudFrontOriginAccessIdentity(params: CloudFront.Types.GetCloudFrontOriginAccessIdentityRequest, callback?: (err: AWSError, data: CloudFront.Types.GetCloudFrontOriginAccessIdentityResult) => void): Request<CloudFront.Types.GetCloudFrontOriginAccessIdentityResult, AWSError>;
  /**
   * Get the information about an origin access identity. 
   */
  getCloudFrontOriginAccessIdentity(callback?: (err: AWSError, data: CloudFront.Types.GetCloudFrontOriginAccessIdentityResult) => void): Request<CloudFront.Types.GetCloudFrontOriginAccessIdentityResult, AWSError>;
  /**
   * Get the configuration information about an origin access identity. 
   */
  getCloudFrontOriginAccessIdentityConfig(params: CloudFront.Types.GetCloudFrontOriginAccessIdentityConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetCloudFrontOriginAccessIdentityConfigResult) => void): Request<CloudFront.Types.GetCloudFrontOriginAccessIdentityConfigResult, AWSError>;
  /**
   * Get the configuration information about an origin access identity. 
   */
  getCloudFrontOriginAccessIdentityConfig(callback?: (err: AWSError, data: CloudFront.Types.GetCloudFrontOriginAccessIdentityConfigResult) => void): Request<CloudFront.Types.GetCloudFrontOriginAccessIdentityConfigResult, AWSError>;
  /**
   * Get the information about a distribution.
   */
  getDistribution(params: CloudFront.Types.GetDistributionRequest, callback?: (err: AWSError, data: CloudFront.Types.GetDistributionResult) => void): Request<CloudFront.Types.GetDistributionResult, AWSError>;
  /**
   * Get the information about a distribution.
   */
  getDistribution(callback?: (err: AWSError, data: CloudFront.Types.GetDistributionResult) => void): Request<CloudFront.Types.GetDistributionResult, AWSError>;
  /**
   * Get the configuration information about a distribution. 
   */
  getDistributionConfig(params: CloudFront.Types.GetDistributionConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetDistributionConfigResult) => void): Request<CloudFront.Types.GetDistributionConfigResult, AWSError>;
  /**
   * Get the configuration information about a distribution. 
   */
  getDistributionConfig(callback?: (err: AWSError, data: CloudFront.Types.GetDistributionConfigResult) => void): Request<CloudFront.Types.GetDistributionConfigResult, AWSError>;
  /**
   * Get the field-level encryption configuration information.
   */
  getFieldLevelEncryption(params: CloudFront.Types.GetFieldLevelEncryptionRequest, callback?: (err: AWSError, data: CloudFront.Types.GetFieldLevelEncryptionResult) => void): Request<CloudFront.Types.GetFieldLevelEncryptionResult, AWSError>;
  /**
   * Get the field-level encryption configuration information.
   */
  getFieldLevelEncryption(callback?: (err: AWSError, data: CloudFront.Types.GetFieldLevelEncryptionResult) => void): Request<CloudFront.Types.GetFieldLevelEncryptionResult, AWSError>;
  /**
   * Get the field-level encryption configuration information.
   */
  getFieldLevelEncryptionConfig(params: CloudFront.Types.GetFieldLevelEncryptionConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetFieldLevelEncryptionConfigResult) => void): Request<CloudFront.Types.GetFieldLevelEncryptionConfigResult, AWSError>;
  /**
   * Get the field-level encryption configuration information.
   */
  getFieldLevelEncryptionConfig(callback?: (err: AWSError, data: CloudFront.Types.GetFieldLevelEncryptionConfigResult) => void): Request<CloudFront.Types.GetFieldLevelEncryptionConfigResult, AWSError>;
  /**
   * Get the field-level encryption profile information.
   */
  getFieldLevelEncryptionProfile(params: CloudFront.Types.GetFieldLevelEncryptionProfileRequest, callback?: (err: AWSError, data: CloudFront.Types.GetFieldLevelEncryptionProfileResult) => void): Request<CloudFront.Types.GetFieldLevelEncryptionProfileResult, AWSError>;
  /**
   * Get the field-level encryption profile information.
   */
  getFieldLevelEncryptionProfile(callback?: (err: AWSError, data: CloudFront.Types.GetFieldLevelEncryptionProfileResult) => void): Request<CloudFront.Types.GetFieldLevelEncryptionProfileResult, AWSError>;
  /**
   * Get the field-level encryption profile configuration information.
   */
  getFieldLevelEncryptionProfileConfig(params: CloudFront.Types.GetFieldLevelEncryptionProfileConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetFieldLevelEncryptionProfileConfigResult) => void): Request<CloudFront.Types.GetFieldLevelEncryptionProfileConfigResult, AWSError>;
  /**
   * Get the field-level encryption profile configuration information.
   */
  getFieldLevelEncryptionProfileConfig(callback?: (err: AWSError, data: CloudFront.Types.GetFieldLevelEncryptionProfileConfigResult) => void): Request<CloudFront.Types.GetFieldLevelEncryptionProfileConfigResult, AWSError>;
  /**
   * Gets the code of a CloudFront function. To get configuration information and metadata about a function, use DescribeFunction. To get a function’s code, you must provide the function’s name and stage. To get these values, you can use ListFunctions.
   */
  getFunction(params: CloudFront.Types.GetFunctionRequest, callback?: (err: AWSError, data: CloudFront.Types.GetFunctionResult) => void): Request<CloudFront.Types.GetFunctionResult, AWSError>;
  /**
   * Gets the code of a CloudFront function. To get configuration information and metadata about a function, use DescribeFunction. To get a function’s code, you must provide the function’s name and stage. To get these values, you can use ListFunctions.
   */
  getFunction(callback?: (err: AWSError, data: CloudFront.Types.GetFunctionResult) => void): Request<CloudFront.Types.GetFunctionResult, AWSError>;
  /**
   * Get the information about an invalidation. 
   */
  getInvalidation(params: CloudFront.Types.GetInvalidationRequest, callback?: (err: AWSError, data: CloudFront.Types.GetInvalidationResult) => void): Request<CloudFront.Types.GetInvalidationResult, AWSError>;
  /**
   * Get the information about an invalidation. 
   */
  getInvalidation(callback?: (err: AWSError, data: CloudFront.Types.GetInvalidationResult) => void): Request<CloudFront.Types.GetInvalidationResult, AWSError>;
  /**
   * Gets a key group, including the date and time when the key group was last modified. To get a key group, you must provide the key group’s identifier. If the key group is referenced in a distribution’s cache behavior, you can get the key group’s identifier using ListDistributions or GetDistribution. If the key group is not referenced in a cache behavior, you can get the identifier using ListKeyGroups.
   */
  getKeyGroup(params: CloudFront.Types.GetKeyGroupRequest, callback?: (err: AWSError, data: CloudFront.Types.GetKeyGroupResult) => void): Request<CloudFront.Types.GetKeyGroupResult, AWSError>;
  /**
   * Gets a key group, including the date and time when the key group was last modified. To get a key group, you must provide the key group’s identifier. If the key group is referenced in a distribution’s cache behavior, you can get the key group’s identifier using ListDistributions or GetDistribution. If the key group is not referenced in a cache behavior, you can get the identifier using ListKeyGroups.
   */
  getKeyGroup(callback?: (err: AWSError, data: CloudFront.Types.GetKeyGroupResult) => void): Request<CloudFront.Types.GetKeyGroupResult, AWSError>;
  /**
   * Gets a key group configuration. To get a key group configuration, you must provide the key group’s identifier. If the key group is referenced in a distribution’s cache behavior, you can get the key group’s identifier using ListDistributions or GetDistribution. If the key group is not referenced in a cache behavior, you can get the identifier using ListKeyGroups.
   */
  getKeyGroupConfig(params: CloudFront.Types.GetKeyGroupConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetKeyGroupConfigResult) => void): Request<CloudFront.Types.GetKeyGroupConfigResult, AWSError>;
  /**
   * Gets a key group configuration. To get a key group configuration, you must provide the key group’s identifier. If the key group is referenced in a distribution’s cache behavior, you can get the key group’s identifier using ListDistributions or GetDistribution. If the key group is not referenced in a cache behavior, you can get the identifier using ListKeyGroups.
   */
  getKeyGroupConfig(callback?: (err: AWSError, data: CloudFront.Types.GetKeyGroupConfigResult) => void): Request<CloudFront.Types.GetKeyGroupConfigResult, AWSError>;
  /**
   * Gets information about whether additional CloudWatch metrics are enabled for the specified CloudFront distribution.
   */
  getMonitoringSubscription(params: CloudFront.Types.GetMonitoringSubscriptionRequest, callback?: (err: AWSError, data: CloudFront.Types.GetMonitoringSubscriptionResult) => void): Request<CloudFront.Types.GetMonitoringSubscriptionResult, AWSError>;
  /**
   * Gets information about whether additional CloudWatch metrics are enabled for the specified CloudFront distribution.
   */
  getMonitoringSubscription(callback?: (err: AWSError, data: CloudFront.Types.GetMonitoringSubscriptionResult) => void): Request<CloudFront.Types.GetMonitoringSubscriptionResult, AWSError>;
  /**
   * Gets an origin request policy, including the following metadata:   The policy’s identifier.   The date and time when the policy was last modified.   To get an origin request policy, you must provide the policy’s identifier. If the origin request policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the origin request policy is not attached to a cache behavior, you can get the identifier using ListOriginRequestPolicies.
   */
  getOriginRequestPolicy(params: CloudFront.Types.GetOriginRequestPolicyRequest, callback?: (err: AWSError, data: CloudFront.Types.GetOriginRequestPolicyResult) => void): Request<CloudFront.Types.GetOriginRequestPolicyResult, AWSError>;
  /**
   * Gets an origin request policy, including the following metadata:   The policy’s identifier.   The date and time when the policy was last modified.   To get an origin request policy, you must provide the policy’s identifier. If the origin request policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the origin request policy is not attached to a cache behavior, you can get the identifier using ListOriginRequestPolicies.
   */
  getOriginRequestPolicy(callback?: (err: AWSError, data: CloudFront.Types.GetOriginRequestPolicyResult) => void): Request<CloudFront.Types.GetOriginRequestPolicyResult, AWSError>;
  /**
   * Gets an origin request policy configuration. To get an origin request policy configuration, you must provide the policy’s identifier. If the origin request policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the origin request policy is not attached to a cache behavior, you can get the identifier using ListOriginRequestPolicies.
   */
  getOriginRequestPolicyConfig(params: CloudFront.Types.GetOriginRequestPolicyConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetOriginRequestPolicyConfigResult) => void): Request<CloudFront.Types.GetOriginRequestPolicyConfigResult, AWSError>;
  /**
   * Gets an origin request policy configuration. To get an origin request policy configuration, you must provide the policy’s identifier. If the origin request policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the origin request policy is not attached to a cache behavior, you can get the identifier using ListOriginRequestPolicies.
   */
  getOriginRequestPolicyConfig(callback?: (err: AWSError, data: CloudFront.Types.GetOriginRequestPolicyConfigResult) => void): Request<CloudFront.Types.GetOriginRequestPolicyConfigResult, AWSError>;
  /**
   * Gets a public key.
   */
  getPublicKey(params: CloudFront.Types.GetPublicKeyRequest, callback?: (err: AWSError, data: CloudFront.Types.GetPublicKeyResult) => void): Request<CloudFront.Types.GetPublicKeyResult, AWSError>;
  /**
   * Gets a public key.
   */
  getPublicKey(callback?: (err: AWSError, data: CloudFront.Types.GetPublicKeyResult) => void): Request<CloudFront.Types.GetPublicKeyResult, AWSError>;
  /**
   * Gets a public key configuration.
   */
  getPublicKeyConfig(params: CloudFront.Types.GetPublicKeyConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetPublicKeyConfigResult) => void): Request<CloudFront.Types.GetPublicKeyConfigResult, AWSError>;
  /**
   * Gets a public key configuration.
   */
  getPublicKeyConfig(callback?: (err: AWSError, data: CloudFront.Types.GetPublicKeyConfigResult) => void): Request<CloudFront.Types.GetPublicKeyConfigResult, AWSError>;
  /**
   * Gets a real-time log configuration. To get a real-time log configuration, you can provide the configuration’s name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to get.
   */
  getRealtimeLogConfig(params: CloudFront.Types.GetRealtimeLogConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetRealtimeLogConfigResult) => void): Request<CloudFront.Types.GetRealtimeLogConfigResult, AWSError>;
  /**
   * Gets a real-time log configuration. To get a real-time log configuration, you can provide the configuration’s name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to get.
   */
  getRealtimeLogConfig(callback?: (err: AWSError, data: CloudFront.Types.GetRealtimeLogConfigResult) => void): Request<CloudFront.Types.GetRealtimeLogConfigResult, AWSError>;
  /**
   * Gets information about a specified RTMP distribution, including the distribution configuration.
   */
  getStreamingDistribution(params: CloudFront.Types.GetStreamingDistributionRequest, callback?: (err: AWSError, data: CloudFront.Types.GetStreamingDistributionResult) => void): Request<CloudFront.Types.GetStreamingDistributionResult, AWSError>;
  /**
   * Gets information about a specified RTMP distribution, including the distribution configuration.
   */
  getStreamingDistribution(callback?: (err: AWSError, data: CloudFront.Types.GetStreamingDistributionResult) => void): Request<CloudFront.Types.GetStreamingDistributionResult, AWSError>;
  /**
   * Get the configuration information about a streaming distribution. 
   */
  getStreamingDistributionConfig(params: CloudFront.Types.GetStreamingDistributionConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.GetStreamingDistributionConfigResult) => void): Request<CloudFront.Types.GetStreamingDistributionConfigResult, AWSError>;
  /**
   * Get the configuration information about a streaming distribution. 
   */
  getStreamingDistributionConfig(callback?: (err: AWSError, data: CloudFront.Types.GetStreamingDistributionConfigResult) => void): Request<CloudFront.Types.GetStreamingDistributionConfigResult, AWSError>;
  /**
   * Gets a list of cache policies. You can optionally apply a filter to return only the managed policies created by Amazon Web Services, or only the custom policies created in your account. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listCachePolicies(params: CloudFront.Types.ListCachePoliciesRequest, callback?: (err: AWSError, data: CloudFront.Types.ListCachePoliciesResult) => void): Request<CloudFront.Types.ListCachePoliciesResult, AWSError>;
  /**
   * Gets a list of cache policies. You can optionally apply a filter to return only the managed policies created by Amazon Web Services, or only the custom policies created in your account. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listCachePolicies(callback?: (err: AWSError, data: CloudFront.Types.ListCachePoliciesResult) => void): Request<CloudFront.Types.ListCachePoliciesResult, AWSError>;
  /**
   * Lists origin access identities.
   */
  listCloudFrontOriginAccessIdentities(params: CloudFront.Types.ListCloudFrontOriginAccessIdentitiesRequest, callback?: (err: AWSError, data: CloudFront.Types.ListCloudFrontOriginAccessIdentitiesResult) => void): Request<CloudFront.Types.ListCloudFrontOriginAccessIdentitiesResult, AWSError>;
  /**
   * Lists origin access identities.
   */
  listCloudFrontOriginAccessIdentities(callback?: (err: AWSError, data: CloudFront.Types.ListCloudFrontOriginAccessIdentitiesResult) => void): Request<CloudFront.Types.ListCloudFrontOriginAccessIdentitiesResult, AWSError>;
  /**
   * Gets a list of aliases (also called CNAMEs or alternate domain names) that conflict or overlap with the provided alias, and the associated CloudFront distributions and Amazon Web Services accounts for each conflicting alias. In the returned list, the distribution and account IDs are partially hidden, which allows you to identify the distributions and accounts that you own, but helps to protect the information of ones that you don’t own. Use this operation to find aliases that are in use in CloudFront that conflict or overlap with the provided alias. For example, if you provide www.example.com as input, the returned list can include www.example.com and the overlapping wildcard alternate domain name (*.example.com), if they exist. If you provide *.example.com as input, the returned list can include *.example.com and any alternate domain names covered by that wildcard (for example, www.example.com, test.example.com, dev.example.com, and so on), if they exist. To list conflicting aliases, you provide the alias to search and the ID of a distribution in your account that has an attached SSL/TLS certificate that includes the provided alias. For more information, including how to set up the distribution and certificate, see Moving an alternate domain name to a different distribution in the Amazon CloudFront Developer Guide. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listConflictingAliases(params: CloudFront.Types.ListConflictingAliasesRequest, callback?: (err: AWSError, data: CloudFront.Types.ListConflictingAliasesResult) => void): Request<CloudFront.Types.ListConflictingAliasesResult, AWSError>;
  /**
   * Gets a list of aliases (also called CNAMEs or alternate domain names) that conflict or overlap with the provided alias, and the associated CloudFront distributions and Amazon Web Services accounts for each conflicting alias. In the returned list, the distribution and account IDs are partially hidden, which allows you to identify the distributions and accounts that you own, but helps to protect the information of ones that you don’t own. Use this operation to find aliases that are in use in CloudFront that conflict or overlap with the provided alias. For example, if you provide www.example.com as input, the returned list can include www.example.com and the overlapping wildcard alternate domain name (*.example.com), if they exist. If you provide *.example.com as input, the returned list can include *.example.com and any alternate domain names covered by that wildcard (for example, www.example.com, test.example.com, dev.example.com, and so on), if they exist. To list conflicting aliases, you provide the alias to search and the ID of a distribution in your account that has an attached SSL/TLS certificate that includes the provided alias. For more information, including how to set up the distribution and certificate, see Moving an alternate domain name to a different distribution in the Amazon CloudFront Developer Guide. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listConflictingAliases(callback?: (err: AWSError, data: CloudFront.Types.ListConflictingAliasesResult) => void): Request<CloudFront.Types.ListConflictingAliasesResult, AWSError>;
  /**
   * List CloudFront distributions.
   */
  listDistributions(params: CloudFront.Types.ListDistributionsRequest, callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsResult) => void): Request<CloudFront.Types.ListDistributionsResult, AWSError>;
  /**
   * List CloudFront distributions.
   */
  listDistributions(callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsResult) => void): Request<CloudFront.Types.ListDistributionsResult, AWSError>;
  /**
   * Gets a list of distribution IDs for distributions that have a cache behavior that’s associated with the specified cache policy. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listDistributionsByCachePolicyId(params: CloudFront.Types.ListDistributionsByCachePolicyIdRequest, callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByCachePolicyIdResult) => void): Request<CloudFront.Types.ListDistributionsByCachePolicyIdResult, AWSError>;
  /**
   * Gets a list of distribution IDs for distributions that have a cache behavior that’s associated with the specified cache policy. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listDistributionsByCachePolicyId(callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByCachePolicyIdResult) => void): Request<CloudFront.Types.ListDistributionsByCachePolicyIdResult, AWSError>;
  /**
   * Gets a list of distribution IDs for distributions that have a cache behavior that references the specified key group. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listDistributionsByKeyGroup(params: CloudFront.Types.ListDistributionsByKeyGroupRequest, callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByKeyGroupResult) => void): Request<CloudFront.Types.ListDistributionsByKeyGroupResult, AWSError>;
  /**
   * Gets a list of distribution IDs for distributions that have a cache behavior that references the specified key group. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listDistributionsByKeyGroup(callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByKeyGroupResult) => void): Request<CloudFront.Types.ListDistributionsByKeyGroupResult, AWSError>;
  /**
   * Gets a list of distribution IDs for distributions that have a cache behavior that’s associated with the specified origin request policy. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listDistributionsByOriginRequestPolicyId(params: CloudFront.Types.ListDistributionsByOriginRequestPolicyIdRequest, callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByOriginRequestPolicyIdResult) => void): Request<CloudFront.Types.ListDistributionsByOriginRequestPolicyIdResult, AWSError>;
  /**
   * Gets a list of distribution IDs for distributions that have a cache behavior that’s associated with the specified origin request policy. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listDistributionsByOriginRequestPolicyId(callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByOriginRequestPolicyIdResult) => void): Request<CloudFront.Types.ListDistributionsByOriginRequestPolicyIdResult, AWSError>;
  /**
   * Gets a list of distributions that have a cache behavior that’s associated with the specified real-time log configuration. You can specify the real-time log configuration by its name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to list distributions for. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request. 
   */
  listDistributionsByRealtimeLogConfig(params: CloudFront.Types.ListDistributionsByRealtimeLogConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByRealtimeLogConfigResult) => void): Request<CloudFront.Types.ListDistributionsByRealtimeLogConfigResult, AWSError>;
  /**
   * Gets a list of distributions that have a cache behavior that’s associated with the specified real-time log configuration. You can specify the real-time log configuration by its name or its Amazon Resource Name (ARN). You must provide at least one. If you provide both, CloudFront uses the name to identify the real-time log configuration to list distributions for. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request. 
   */
  listDistributionsByRealtimeLogConfig(callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByRealtimeLogConfigResult) => void): Request<CloudFront.Types.ListDistributionsByRealtimeLogConfigResult, AWSError>;
  /**
   * List the distributions that are associated with a specified WAF web ACL.
   */
  listDistributionsByWebACLId(params: CloudFront.Types.ListDistributionsByWebACLIdRequest, callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByWebACLIdResult) => void): Request<CloudFront.Types.ListDistributionsByWebACLIdResult, AWSError>;
  /**
   * List the distributions that are associated with a specified WAF web ACL.
   */
  listDistributionsByWebACLId(callback?: (err: AWSError, data: CloudFront.Types.ListDistributionsByWebACLIdResult) => void): Request<CloudFront.Types.ListDistributionsByWebACLIdResult, AWSError>;
  /**
   * List all field-level encryption configurations that have been created in CloudFront for this account.
   */
  listFieldLevelEncryptionConfigs(params: CloudFront.Types.ListFieldLevelEncryptionConfigsRequest, callback?: (err: AWSError, data: CloudFront.Types.ListFieldLevelEncryptionConfigsResult) => void): Request<CloudFront.Types.ListFieldLevelEncryptionConfigsResult, AWSError>;
  /**
   * List all field-level encryption configurations that have been created in CloudFront for this account.
   */
  listFieldLevelEncryptionConfigs(callback?: (err: AWSError, data: CloudFront.Types.ListFieldLevelEncryptionConfigsResult) => void): Request<CloudFront.Types.ListFieldLevelEncryptionConfigsResult, AWSError>;
  /**
   * Request a list of field-level encryption profiles that have been created in CloudFront for this account.
   */
  listFieldLevelEncryptionProfiles(params: CloudFront.Types.ListFieldLevelEncryptionProfilesRequest, callback?: (err: AWSError, data: CloudFront.Types.ListFieldLevelEncryptionProfilesResult) => void): Request<CloudFront.Types.ListFieldLevelEncryptionProfilesResult, AWSError>;
  /**
   * Request a list of field-level encryption profiles that have been created in CloudFront for this account.
   */
  listFieldLevelEncryptionProfiles(callback?: (err: AWSError, data: CloudFront.Types.ListFieldLevelEncryptionProfilesResult) => void): Request<CloudFront.Types.ListFieldLevelEncryptionProfilesResult, AWSError>;
  /**
   * Gets a list of all CloudFront functions in your account. You can optionally apply a filter to return only the functions that are in the specified stage, either DEVELOPMENT or LIVE. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listFunctions(params: CloudFront.Types.ListFunctionsRequest, callback?: (err: AWSError, data: CloudFront.Types.ListFunctionsResult) => void): Request<CloudFront.Types.ListFunctionsResult, AWSError>;
  /**
   * Gets a list of all CloudFront functions in your account. You can optionally apply a filter to return only the functions that are in the specified stage, either DEVELOPMENT or LIVE. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listFunctions(callback?: (err: AWSError, data: CloudFront.Types.ListFunctionsResult) => void): Request<CloudFront.Types.ListFunctionsResult, AWSError>;
  /**
   * Lists invalidation batches. 
   */
  listInvalidations(params: CloudFront.Types.ListInvalidationsRequest, callback?: (err: AWSError, data: CloudFront.Types.ListInvalidationsResult) => void): Request<CloudFront.Types.ListInvalidationsResult, AWSError>;
  /**
   * Lists invalidation batches. 
   */
  listInvalidations(callback?: (err: AWSError, data: CloudFront.Types.ListInvalidationsResult) => void): Request<CloudFront.Types.ListInvalidationsResult, AWSError>;
  /**
   * Gets a list of key groups. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listKeyGroups(params: CloudFront.Types.ListKeyGroupsRequest, callback?: (err: AWSError, data: CloudFront.Types.ListKeyGroupsResult) => void): Request<CloudFront.Types.ListKeyGroupsResult, AWSError>;
  /**
   * Gets a list of key groups. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listKeyGroups(callback?: (err: AWSError, data: CloudFront.Types.ListKeyGroupsResult) => void): Request<CloudFront.Types.ListKeyGroupsResult, AWSError>;
  /**
   * Gets a list of origin request policies. You can optionally apply a filter to return only the managed policies created by Amazon Web Services, or only the custom policies created in your account. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listOriginRequestPolicies(params: CloudFront.Types.ListOriginRequestPoliciesRequest, callback?: (err: AWSError, data: CloudFront.Types.ListOriginRequestPoliciesResult) => void): Request<CloudFront.Types.ListOriginRequestPoliciesResult, AWSError>;
  /**
   * Gets a list of origin request policies. You can optionally apply a filter to return only the managed policies created by Amazon Web Services, or only the custom policies created in your account. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request.
   */
  listOriginRequestPolicies(callback?: (err: AWSError, data: CloudFront.Types.ListOriginRequestPoliciesResult) => void): Request<CloudFront.Types.ListOriginRequestPoliciesResult, AWSError>;
  /**
   * List all public keys that have been added to CloudFront for this account.
   */
  listPublicKeys(params: CloudFront.Types.ListPublicKeysRequest, callback?: (err: AWSError, data: CloudFront.Types.ListPublicKeysResult) => void): Request<CloudFront.Types.ListPublicKeysResult, AWSError>;
  /**
   * List all public keys that have been added to CloudFront for this account.
   */
  listPublicKeys(callback?: (err: AWSError, data: CloudFront.Types.ListPublicKeysResult) => void): Request<CloudFront.Types.ListPublicKeysResult, AWSError>;
  /**
   * Gets a list of real-time log configurations. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request. 
   */
  listRealtimeLogConfigs(params: CloudFront.Types.ListRealtimeLogConfigsRequest, callback?: (err: AWSError, data: CloudFront.Types.ListRealtimeLogConfigsResult) => void): Request<CloudFront.Types.ListRealtimeLogConfigsResult, AWSError>;
  /**
   * Gets a list of real-time log configurations. You can optionally specify the maximum number of items to receive in the response. If the total number of items in the list exceeds the maximum that you specify, or the default maximum, the response is paginated. To get the next page of items, send a subsequent request that specifies the NextMarker value from the current response as the Marker value in the subsequent request. 
   */
  listRealtimeLogConfigs(callback?: (err: AWSError, data: CloudFront.Types.ListRealtimeLogConfigsResult) => void): Request<CloudFront.Types.ListRealtimeLogConfigsResult, AWSError>;
  /**
   * List streaming distributions. 
   */
  listStreamingDistributions(params: CloudFront.Types.ListStreamingDistributionsRequest, callback?: (err: AWSError, data: CloudFront.Types.ListStreamingDistributionsResult) => void): Request<CloudFront.Types.ListStreamingDistributionsResult, AWSError>;
  /**
   * List streaming distributions. 
   */
  listStreamingDistributions(callback?: (err: AWSError, data: CloudFront.Types.ListStreamingDistributionsResult) => void): Request<CloudFront.Types.ListStreamingDistributionsResult, AWSError>;
  /**
   * List tags for a CloudFront resource.
   */
  listTagsForResource(params: CloudFront.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CloudFront.Types.ListTagsForResourceResult) => void): Request<CloudFront.Types.ListTagsForResourceResult, AWSError>;
  /**
   * List tags for a CloudFront resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: CloudFront.Types.ListTagsForResourceResult) => void): Request<CloudFront.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Publishes a CloudFront function by copying the function code from the DEVELOPMENT stage to LIVE. This automatically updates all cache behaviors that are using this function to use the newly published copy in the LIVE stage. When a function is published to the LIVE stage, you can attach the function to a distribution’s cache behavior, using the function’s Amazon Resource Name (ARN). To publish a function, you must provide the function’s name and version (ETag value). To get these values, you can use ListFunctions and DescribeFunction.
   */
  publishFunction(params: CloudFront.Types.PublishFunctionRequest, callback?: (err: AWSError, data: CloudFront.Types.PublishFunctionResult) => void): Request<CloudFront.Types.PublishFunctionResult, AWSError>;
  /**
   * Publishes a CloudFront function by copying the function code from the DEVELOPMENT stage to LIVE. This automatically updates all cache behaviors that are using this function to use the newly published copy in the LIVE stage. When a function is published to the LIVE stage, you can attach the function to a distribution’s cache behavior, using the function’s Amazon Resource Name (ARN). To publish a function, you must provide the function’s name and version (ETag value). To get these values, you can use ListFunctions and DescribeFunction.
   */
  publishFunction(callback?: (err: AWSError, data: CloudFront.Types.PublishFunctionResult) => void): Request<CloudFront.Types.PublishFunctionResult, AWSError>;
  /**
   * Add tags to a CloudFront resource.
   */
  tagResource(params: CloudFront.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Add tags to a CloudFront resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Tests a CloudFront function. To test a function, you provide an event object that represents an HTTP request or response that your CloudFront distribution could receive in production. CloudFront runs the function, passing it the event object that you provided, and returns the function’s result (the modified event object) in the response. The response also contains function logs and error messages, if any exist. For more information about testing functions, see Testing functions in the Amazon CloudFront Developer Guide. To test a function, you provide the function’s name and version (ETag value) along with the event object. To get the function’s name and version, you can use ListFunctions and DescribeFunction.
   */
  testFunction(params: CloudFront.Types.TestFunctionRequest, callback?: (err: AWSError, data: CloudFront.Types.TestFunctionResult) => void): Request<CloudFront.Types.TestFunctionResult, AWSError>;
  /**
   * Tests a CloudFront function. To test a function, you provide an event object that represents an HTTP request or response that your CloudFront distribution could receive in production. CloudFront runs the function, passing it the event object that you provided, and returns the function’s result (the modified event object) in the response. The response also contains function logs and error messages, if any exist. For more information about testing functions, see Testing functions in the Amazon CloudFront Developer Guide. To test a function, you provide the function’s name and version (ETag value) along with the event object. To get the function’s name and version, you can use ListFunctions and DescribeFunction.
   */
  testFunction(callback?: (err: AWSError, data: CloudFront.Types.TestFunctionResult) => void): Request<CloudFront.Types.TestFunctionResult, AWSError>;
  /**
   * Remove tags from a CloudFront resource.
   */
  untagResource(params: CloudFront.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove tags from a CloudFront resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a cache policy configuration. When you update a cache policy configuration, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update a cache policy configuration:   Use GetCachePolicyConfig to get the current configuration.   Locally modify the fields in the cache policy configuration that you want to update.   Call UpdateCachePolicy by providing the entire cache policy configuration, including the fields that you modified and those that you didn’t.  
   */
  updateCachePolicy(params: CloudFront.Types.UpdateCachePolicyRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateCachePolicyResult) => void): Request<CloudFront.Types.UpdateCachePolicyResult, AWSError>;
  /**
   * Updates a cache policy configuration. When you update a cache policy configuration, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update a cache policy configuration:   Use GetCachePolicyConfig to get the current configuration.   Locally modify the fields in the cache policy configuration that you want to update.   Call UpdateCachePolicy by providing the entire cache policy configuration, including the fields that you modified and those that you didn’t.  
   */
  updateCachePolicy(callback?: (err: AWSError, data: CloudFront.Types.UpdateCachePolicyResult) => void): Request<CloudFront.Types.UpdateCachePolicyResult, AWSError>;
  /**
   * Update an origin access identity. 
   */
  updateCloudFrontOriginAccessIdentity(params: CloudFront.Types.UpdateCloudFrontOriginAccessIdentityRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateCloudFrontOriginAccessIdentityResult) => void): Request<CloudFront.Types.UpdateCloudFrontOriginAccessIdentityResult, AWSError>;
  /**
   * Update an origin access identity. 
   */
  updateCloudFrontOriginAccessIdentity(callback?: (err: AWSError, data: CloudFront.Types.UpdateCloudFrontOriginAccessIdentityResult) => void): Request<CloudFront.Types.UpdateCloudFrontOriginAccessIdentityResult, AWSError>;
  /**
   * Updates the configuration for a web distribution.   When you update a distribution, there are more required fields than when you create a distribution. When you update your distribution by using this API action, follow the steps here to get the current configuration and then make your updates, to make sure that you include all of the required fields. To view a summary, see Required Fields for Create Distribution and Update Distribution in the Amazon CloudFront Developer Guide.  The update process includes getting the current distribution configuration, updating the XML document that is returned to make your changes, and then submitting an UpdateDistribution request to make the updates. For information about updating a distribution using the CloudFront console instead, see Creating a Distribution in the Amazon CloudFront Developer Guide.  To update a web distribution using the CloudFront API    Submit a GetDistributionConfig request to get the current configuration and an Etag header for the distribution.  If you update the distribution again, you must get a new Etag header.    Update the XML document that was returned in the response to your GetDistributionConfig request to include your changes.   When you edit the XML file, be aware of the following:   You must strip out the ETag parameter that is returned.   Additional fields are required when you update a distribution. There may be fields included in the XML file for features that you haven't configured for your distribution. This is expected and required to successfully update the distribution.   You can't change the value of CallerReference. If you try to change this value, CloudFront returns an IllegalUpdate error.    The new configuration replaces the existing configuration; the values that you specify in an UpdateDistribution request are not merged into your existing configuration. When you add, delete, or replace values in an element that allows multiple values (for example, CNAME), you must specify all of the values that you want to appear in the updated distribution. In addition, you must update the corresponding Quantity element.      Submit an UpdateDistribution request to update the configuration for your distribution:   In the request body, include the XML document that you updated in Step 2. The request body must include an XML document with a DistributionConfig element.   Set the value of the HTTP If-Match header to the value of the ETag header that CloudFront returned when you submitted the GetDistributionConfig request in Step 1.     Review the response to the UpdateDistribution request to confirm that the configuration was successfully updated.   Optional: Submit a GetDistribution request to confirm that your changes have propagated. When propagation is complete, the value of Status is Deployed.  
   */
  updateDistribution(params: CloudFront.Types.UpdateDistributionRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateDistributionResult) => void): Request<CloudFront.Types.UpdateDistributionResult, AWSError>;
  /**
   * Updates the configuration for a web distribution.   When you update a distribution, there are more required fields than when you create a distribution. When you update your distribution by using this API action, follow the steps here to get the current configuration and then make your updates, to make sure that you include all of the required fields. To view a summary, see Required Fields for Create Distribution and Update Distribution in the Amazon CloudFront Developer Guide.  The update process includes getting the current distribution configuration, updating the XML document that is returned to make your changes, and then submitting an UpdateDistribution request to make the updates. For information about updating a distribution using the CloudFront console instead, see Creating a Distribution in the Amazon CloudFront Developer Guide.  To update a web distribution using the CloudFront API    Submit a GetDistributionConfig request to get the current configuration and an Etag header for the distribution.  If you update the distribution again, you must get a new Etag header.    Update the XML document that was returned in the response to your GetDistributionConfig request to include your changes.   When you edit the XML file, be aware of the following:   You must strip out the ETag parameter that is returned.   Additional fields are required when you update a distribution. There may be fields included in the XML file for features that you haven't configured for your distribution. This is expected and required to successfully update the distribution.   You can't change the value of CallerReference. If you try to change this value, CloudFront returns an IllegalUpdate error.    The new configuration replaces the existing configuration; the values that you specify in an UpdateDistribution request are not merged into your existing configuration. When you add, delete, or replace values in an element that allows multiple values (for example, CNAME), you must specify all of the values that you want to appear in the updated distribution. In addition, you must update the corresponding Quantity element.      Submit an UpdateDistribution request to update the configuration for your distribution:   In the request body, include the XML document that you updated in Step 2. The request body must include an XML document with a DistributionConfig element.   Set the value of the HTTP If-Match header to the value of the ETag header that CloudFront returned when you submitted the GetDistributionConfig request in Step 1.     Review the response to the UpdateDistribution request to confirm that the configuration was successfully updated.   Optional: Submit a GetDistribution request to confirm that your changes have propagated. When propagation is complete, the value of Status is Deployed.  
   */
  updateDistribution(callback?: (err: AWSError, data: CloudFront.Types.UpdateDistributionResult) => void): Request<CloudFront.Types.UpdateDistributionResult, AWSError>;
  /**
   * Update a field-level encryption configuration. 
   */
  updateFieldLevelEncryptionConfig(params: CloudFront.Types.UpdateFieldLevelEncryptionConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateFieldLevelEncryptionConfigResult) => void): Request<CloudFront.Types.UpdateFieldLevelEncryptionConfigResult, AWSError>;
  /**
   * Update a field-level encryption configuration. 
   */
  updateFieldLevelEncryptionConfig(callback?: (err: AWSError, data: CloudFront.Types.UpdateFieldLevelEncryptionConfigResult) => void): Request<CloudFront.Types.UpdateFieldLevelEncryptionConfigResult, AWSError>;
  /**
   * Update a field-level encryption profile. 
   */
  updateFieldLevelEncryptionProfile(params: CloudFront.Types.UpdateFieldLevelEncryptionProfileRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateFieldLevelEncryptionProfileResult) => void): Request<CloudFront.Types.UpdateFieldLevelEncryptionProfileResult, AWSError>;
  /**
   * Update a field-level encryption profile. 
   */
  updateFieldLevelEncryptionProfile(callback?: (err: AWSError, data: CloudFront.Types.UpdateFieldLevelEncryptionProfileResult) => void): Request<CloudFront.Types.UpdateFieldLevelEncryptionProfileResult, AWSError>;
  /**
   * Updates a CloudFront function. You can update a function’s code or the comment that describes the function. You cannot update a function’s name. To update a function, you provide the function’s name and version (ETag value) along with the updated function code. To get the name and version, you can use ListFunctions and DescribeFunction.
   */
  updateFunction(params: CloudFront.Types.UpdateFunctionRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateFunctionResult) => void): Request<CloudFront.Types.UpdateFunctionResult, AWSError>;
  /**
   * Updates a CloudFront function. You can update a function’s code or the comment that describes the function. You cannot update a function’s name. To update a function, you provide the function’s name and version (ETag value) along with the updated function code. To get the name and version, you can use ListFunctions and DescribeFunction.
   */
  updateFunction(callback?: (err: AWSError, data: CloudFront.Types.UpdateFunctionResult) => void): Request<CloudFront.Types.UpdateFunctionResult, AWSError>;
  /**
   * Updates a key group. When you update a key group, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update a key group:   Get the current key group with GetKeyGroup or GetKeyGroupConfig.   Locally modify the fields in the key group that you want to update. For example, add or remove public key IDs.   Call UpdateKeyGroup with the entire key group object, including the fields that you modified and those that you didn’t.  
   */
  updateKeyGroup(params: CloudFront.Types.UpdateKeyGroupRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateKeyGroupResult) => void): Request<CloudFront.Types.UpdateKeyGroupResult, AWSError>;
  /**
   * Updates a key group. When you update a key group, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update a key group:   Get the current key group with GetKeyGroup or GetKeyGroupConfig.   Locally modify the fields in the key group that you want to update. For example, add or remove public key IDs.   Call UpdateKeyGroup with the entire key group object, including the fields that you modified and those that you didn’t.  
   */
  updateKeyGroup(callback?: (err: AWSError, data: CloudFront.Types.UpdateKeyGroupResult) => void): Request<CloudFront.Types.UpdateKeyGroupResult, AWSError>;
  /**
   * Updates an origin request policy configuration. When you update an origin request policy configuration, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update an origin request policy configuration:   Use GetOriginRequestPolicyConfig to get the current configuration.   Locally modify the fields in the origin request policy configuration that you want to update.   Call UpdateOriginRequestPolicy by providing the entire origin request policy configuration, including the fields that you modified and those that you didn’t.  
   */
  updateOriginRequestPolicy(params: CloudFront.Types.UpdateOriginRequestPolicyRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateOriginRequestPolicyResult) => void): Request<CloudFront.Types.UpdateOriginRequestPolicyResult, AWSError>;
  /**
   * Updates an origin request policy configuration. When you update an origin request policy configuration, all the fields are updated with the values provided in the request. You cannot update some fields independent of others. To update an origin request policy configuration:   Use GetOriginRequestPolicyConfig to get the current configuration.   Locally modify the fields in the origin request policy configuration that you want to update.   Call UpdateOriginRequestPolicy by providing the entire origin request policy configuration, including the fields that you modified and those that you didn’t.  
   */
  updateOriginRequestPolicy(callback?: (err: AWSError, data: CloudFront.Types.UpdateOriginRequestPolicyResult) => void): Request<CloudFront.Types.UpdateOriginRequestPolicyResult, AWSError>;
  /**
   * Update public key information. Note that the only value you can change is the comment.
   */
  updatePublicKey(params: CloudFront.Types.UpdatePublicKeyRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdatePublicKeyResult) => void): Request<CloudFront.Types.UpdatePublicKeyResult, AWSError>;
  /**
   * Update public key information. Note that the only value you can change is the comment.
   */
  updatePublicKey(callback?: (err: AWSError, data: CloudFront.Types.UpdatePublicKeyResult) => void): Request<CloudFront.Types.UpdatePublicKeyResult, AWSError>;
  /**
   * Updates a real-time log configuration. When you update a real-time log configuration, all the parameters are updated with the values provided in the request. You cannot update some parameters independent of others. To update a real-time log configuration:   Call GetRealtimeLogConfig to get the current real-time log configuration.   Locally modify the parameters in the real-time log configuration that you want to update.   Call this API (UpdateRealtimeLogConfig) by providing the entire real-time log configuration, including the parameters that you modified and those that you didn’t.   You cannot update a real-time log configuration’s Name or ARN.
   */
  updateRealtimeLogConfig(params: CloudFront.Types.UpdateRealtimeLogConfigRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateRealtimeLogConfigResult) => void): Request<CloudFront.Types.UpdateRealtimeLogConfigResult, AWSError>;
  /**
   * Updates a real-time log configuration. When you update a real-time log configuration, all the parameters are updated with the values provided in the request. You cannot update some parameters independent of others. To update a real-time log configuration:   Call GetRealtimeLogConfig to get the current real-time log configuration.   Locally modify the parameters in the real-time log configuration that you want to update.   Call this API (UpdateRealtimeLogConfig) by providing the entire real-time log configuration, including the parameters that you modified and those that you didn’t.   You cannot update a real-time log configuration’s Name or ARN.
   */
  updateRealtimeLogConfig(callback?: (err: AWSError, data: CloudFront.Types.UpdateRealtimeLogConfigResult) => void): Request<CloudFront.Types.UpdateRealtimeLogConfigResult, AWSError>;
  /**
   * Update a streaming distribution. 
   */
  updateStreamingDistribution(params: CloudFront.Types.UpdateStreamingDistributionRequest, callback?: (err: AWSError, data: CloudFront.Types.UpdateStreamingDistributionResult) => void): Request<CloudFront.Types.UpdateStreamingDistributionResult, AWSError>;
  /**
   * Update a streaming distribution. 
   */
  updateStreamingDistribution(callback?: (err: AWSError, data: CloudFront.Types.UpdateStreamingDistributionResult) => void): Request<CloudFront.Types.UpdateStreamingDistributionResult, AWSError>;
  /**
   * Waits for the distributionDeployed state by periodically calling the underlying CloudFront.getDistributionoperation every 60 seconds (at most 35 times). Wait until a distribution is deployed.
   */
  waitFor(state: "distributionDeployed", params: CloudFront.Types.GetDistributionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFront.Types.GetDistributionResult) => void): Request<CloudFront.Types.GetDistributionResult, AWSError>;
  /**
   * Waits for the distributionDeployed state by periodically calling the underlying CloudFront.getDistributionoperation every 60 seconds (at most 35 times). Wait until a distribution is deployed.
   */
  waitFor(state: "distributionDeployed", callback?: (err: AWSError, data: CloudFront.Types.GetDistributionResult) => void): Request<CloudFront.Types.GetDistributionResult, AWSError>;
  /**
   * Waits for the invalidationCompleted state by periodically calling the underlying CloudFront.getInvalidationoperation every 20 seconds (at most 30 times). Wait until an invalidation has completed.
   */
  waitFor(state: "invalidationCompleted", params: CloudFront.Types.GetInvalidationRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFront.Types.GetInvalidationResult) => void): Request<CloudFront.Types.GetInvalidationResult, AWSError>;
  /**
   * Waits for the invalidationCompleted state by periodically calling the underlying CloudFront.getInvalidationoperation every 20 seconds (at most 30 times). Wait until an invalidation has completed.
   */
  waitFor(state: "invalidationCompleted", callback?: (err: AWSError, data: CloudFront.Types.GetInvalidationResult) => void): Request<CloudFront.Types.GetInvalidationResult, AWSError>;
  /**
   * Waits for the streamingDistributionDeployed state by periodically calling the underlying CloudFront.getStreamingDistributionoperation every 60 seconds (at most 25 times). Wait until a streaming distribution is deployed.
   */
  waitFor(state: "streamingDistributionDeployed", params: CloudFront.Types.GetStreamingDistributionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFront.Types.GetStreamingDistributionResult) => void): Request<CloudFront.Types.GetStreamingDistributionResult, AWSError>;
  /**
   * Waits for the streamingDistributionDeployed state by periodically calling the underlying CloudFront.getStreamingDistributionoperation every 60 seconds (at most 25 times). Wait until a streaming distribution is deployed.
   */
  waitFor(state: "streamingDistributionDeployed", callback?: (err: AWSError, data: CloudFront.Types.GetStreamingDistributionResult) => void): Request<CloudFront.Types.GetStreamingDistributionResult, AWSError>;
}
declare namespace CloudFront {
  export import Signer = signer;
}
declare namespace CloudFront {
  export interface ActiveTrustedKeyGroups {
    /**
     * This field is true if any of the key groups have public keys that CloudFront can use to verify the signatures of signed URLs and signed cookies. If not, this field is false.
     */
    Enabled: boolean;
    /**
     * The number of key groups in the list.
     */
    Quantity: integer;
    /**
     * A list of key groups, including the identifiers of the public keys in each key group that CloudFront can use to verify the signatures of signed URLs and signed cookies.
     */
    Items?: KGKeyPairIdsList;
  }
  export interface ActiveTrustedSigners {
    /**
     * This field is true if any of the accounts in the list have active CloudFront key pairs that CloudFront can use to verify the signatures of signed URLs and signed cookies. If not, this field is false.
     */
    Enabled: boolean;
    /**
     * The number of accounts in the list.
     */
    Quantity: integer;
    /**
     * A list of accounts and the identifiers of active CloudFront key pairs in each account that CloudFront can use to verify the signatures of signed URLs and signed cookies.
     */
    Items?: SignerList;
  }
  export interface AliasICPRecordal {
    /**
     * A domain name associated with a distribution. 
     */
    CNAME?: string;
    /**
     * The Internet Content Provider (ICP) recordal status for a CNAME. The ICPRecordalStatus is set to APPROVED for all CNAMEs (aliases) in regions outside of China.  The status values returned are the following:    APPROVED indicates that the associated CNAME has a valid ICP recordal number. Multiple CNAMEs can be associated with a distribution, and CNAMEs can correspond to different ICP recordals. To be marked as APPROVED, that is, valid to use with China region, a CNAME must have one ICP recordal number associated with it.    SUSPENDED indicates that the associated CNAME does not have a valid ICP recordal number.    PENDING indicates that CloudFront can't determine the ICP recordal status of the CNAME associated with the distribution because there was an error in trying to determine the status. You can try again to see if the error is resolved in which case CloudFront returns an APPROVED or SUSPENDED status.  
     */
    ICPRecordalStatus?: ICPRecordalStatus;
  }
  export type AliasICPRecordals = AliasICPRecordal[];
  export type AliasList = string[];
  export interface Aliases {
    /**
     * The number of CNAME aliases, if any, that you want to associate with this distribution.
     */
    Quantity: integer;
    /**
     * A complex type that contains the CNAME aliases, if any, that you want to associate with this distribution.
     */
    Items?: AliasList;
  }
  export interface AllowedMethods {
    /**
     * The number of HTTP methods that you want CloudFront to forward to your origin. Valid values are 2 (for GET and HEAD requests), 3 (for GET, HEAD, and OPTIONS requests) and 7 (for GET, HEAD, OPTIONS, PUT, PATCH, POST, and DELETE requests).
     */
    Quantity: integer;
    /**
     * A complex type that contains the HTTP methods that you want CloudFront to process and forward to your origin.
     */
    Items: MethodsList;
    CachedMethods?: CachedMethods;
  }
  export interface AssociateAliasRequest {
    /**
     * The ID of the distribution that you’re associating the alias with.
     */
    TargetDistributionId: string;
    /**
     * The alias (also known as a CNAME) to add to the target distribution.
     */
    Alias: string;
  }
  export type AwsAccountNumberList = string[];
  export interface CacheBehavior {
    /**
     * The pattern (for example, images/*.jpg) that specifies which requests to apply the behavior to. When CloudFront receives a viewer request, the requested path is compared with path patterns in the order in which cache behaviors are listed in the distribution.  You can optionally include a slash (/) at the beginning of the path pattern. For example, /images/*.jpg. CloudFront behavior is the same with or without the leading /.  The path pattern for the default cache behavior is * and cannot be changed. If the request for an object does not match the path pattern for any cache behaviors, CloudFront applies the behavior in the default cache behavior. For more information, see Path Pattern in the  Amazon CloudFront Developer Guide.
     */
    PathPattern: string;
    /**
     * The value of ID for the origin that you want CloudFront to route requests to when they match this cache behavior.
     */
    TargetOriginId: string;
    /**
     *  We recommend using TrustedKeyGroups instead of TrustedSigners.  A list of account IDs whose public keys CloudFront can use to validate signed URLs or signed cookies. When a cache behavior contains trusted signers, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with the private key of a CloudFront key pair in the trusted signer’s account. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see Serving private content in the Amazon CloudFront Developer Guide.
     */
    TrustedSigners?: TrustedSigners;
    /**
     * A list of key groups that CloudFront can use to validate signed URLs or signed cookies. When a cache behavior contains trusted key groups, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see Serving private content in the Amazon CloudFront Developer Guide.
     */
    TrustedKeyGroups?: TrustedKeyGroups;
    /**
     * The protocol that viewers can use to access the files in the origin specified by TargetOriginId when a request matches the path pattern in PathPattern. You can specify the following options:    allow-all: Viewers can use HTTP or HTTPS.    redirect-to-https: If a viewer submits an HTTP request, CloudFront returns an HTTP status code of 301 (Moved Permanently) to the viewer along with the HTTPS URL. The viewer then resubmits the request using the new URL.     https-only: If a viewer sends an HTTP request, CloudFront returns an HTTP status code of 403 (Forbidden).    For more information about requiring the HTTPS protocol, see Requiring HTTPS Between Viewers and CloudFront in the Amazon CloudFront Developer Guide.  The only way to guarantee that viewers retrieve an object that was fetched from the origin using HTTPS is never to use any other protocol to fetch the object. If you have recently changed from HTTP to HTTPS, we recommend that you clear your objects’ cache because cached objects are protocol agnostic. That means that an edge location will return an object from the cache regardless of whether the current request protocol matches the protocol used previously. For more information, see Managing Cache Expiration in the Amazon CloudFront Developer Guide. 
     */
    ViewerProtocolPolicy: ViewerProtocolPolicy;
    AllowedMethods?: AllowedMethods;
    /**
     * Indicates whether you want to distribute media files in the Microsoft Smooth Streaming format using the origin that is associated with this cache behavior. If so, specify true; if not, specify false. If you specify true for SmoothStreaming, you can still distribute other content using this cache behavior if the content matches the value of PathPattern. 
     */
    SmoothStreaming?: boolean;
    /**
     * Whether you want CloudFront to automatically compress certain files for this cache behavior. If so, specify true; if not, specify false. For more information, see Serving Compressed Files in the Amazon CloudFront Developer Guide.
     */
    Compress?: boolean;
    /**
     * A complex type that contains zero or more Lambda@Edge function associations for a cache behavior.
     */
    LambdaFunctionAssociations?: LambdaFunctionAssociations;
    /**
     * A list of CloudFront functions that are associated with this cache behavior. CloudFront functions must be published to the LIVE stage to associate them with a cache behavior.
     */
    FunctionAssociations?: FunctionAssociations;
    /**
     * The value of ID for the field-level encryption configuration that you want CloudFront to use for encrypting specific fields of data for this cache behavior.
     */
    FieldLevelEncryptionId?: string;
    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration that is attached to this cache behavior. For more information, see Real-time logs in the Amazon CloudFront Developer Guide.
     */
    RealtimeLogConfigArn?: string;
    /**
     * The unique identifier of the cache policy that is attached to this cache behavior. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. A CacheBehavior must include either a CachePolicyId or ForwardedValues. We recommend that you use a CachePolicyId.
     */
    CachePolicyId?: string;
    /**
     * The unique identifier of the origin request policy that is attached to this cache behavior. For more information, see Creating origin request policies or Using the managed origin request policies in the Amazon CloudFront Developer Guide.
     */
    OriginRequestPolicyId?: string;
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. For more information, see Working with policies in the Amazon CloudFront Developer Guide. If you want to include values in the cache key, use a cache policy. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. If you want to send values to the origin but not include them in the cache key, use an origin request policy. For more information, see Creating origin request policies or Using the managed origin request policies in the Amazon CloudFront Developer Guide. A CacheBehavior must include either a CachePolicyId or ForwardedValues. We recommend that you use a CachePolicyId. A complex type that specifies how CloudFront handles query strings, cookies, and HTTP headers.
     */
    ForwardedValues?: ForwardedValues;
    /**
     * This field is deprecated. We recommend that you use the MinTTL field in a cache policy instead of this field. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. The minimum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. For more information, see  Managing How Long Content Stays in an Edge Cache (Expiration) in the  Amazon CloudFront Developer Guide. You must specify 0 for MinTTL if you configure CloudFront to forward all headers to your origin (under Headers, if you specify 1 for Quantity and * for Name).
     */
    MinTTL?: long;
    /**
     * This field is deprecated. We recommend that you use the DefaultTTL field in a cache policy instead of this field. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. The default amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin does not add HTTP headers such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects. For more information, see Managing How Long Content Stays in an Edge Cache (Expiration) in the Amazon CloudFront Developer Guide.
     */
    DefaultTTL?: long;
    /**
     * This field is deprecated. We recommend that you use the MaxTTL field in a cache policy instead of this field. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. The maximum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin adds HTTP headers such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects. For more information, see Managing How Long Content Stays in an Edge Cache (Expiration) in the Amazon CloudFront Developer Guide.
     */
    MaxTTL?: long;
  }
  export type CacheBehaviorList = CacheBehavior[];
  export interface CacheBehaviors {
    /**
     * The number of cache behaviors for this distribution. 
     */
    Quantity: integer;
    /**
     * Optional: A complex type that contains cache behaviors for this distribution. If Quantity is 0, you can omit Items.
     */
    Items?: CacheBehaviorList;
  }
  export interface CachePolicy {
    /**
     * The unique identifier for the cache policy.
     */
    Id: string;
    /**
     * The date and time when the cache policy was last modified.
     */
    LastModifiedTime: timestamp;
    /**
     * The cache policy configuration.
     */
    CachePolicyConfig: CachePolicyConfig;
  }
  export interface CachePolicyConfig {
    /**
     * A comment to describe the cache policy. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
    /**
     * A unique name to identify the cache policy.
     */
    Name: string;
    /**
     * The default amount of time, in seconds, that you want objects to stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated. CloudFront uses this value as the object’s time to live (TTL) only when the origin does not send Cache-Control or Expires headers with the object. For more information, see Managing How Long Content Stays in an Edge Cache (Expiration) in the Amazon CloudFront Developer Guide. The default value for this field is 86400 seconds (one day). If the value of MinTTL is more than 86400 seconds, then the default value for this field is the same as the value of MinTTL.
     */
    DefaultTTL?: long;
    /**
     * The maximum amount of time, in seconds, that objects stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated. CloudFront uses this value only when the origin sends Cache-Control or Expires headers with the object. For more information, see Managing How Long Content Stays in an Edge Cache (Expiration) in the Amazon CloudFront Developer Guide. The default value for this field is 31536000 seconds (one year). If the value of MinTTL or DefaultTTL is more than 31536000 seconds, then the default value for this field is the same as the value of DefaultTTL.
     */
    MaxTTL?: long;
    /**
     * The minimum amount of time, in seconds, that you want objects to stay in the CloudFront cache before CloudFront sends another request to the origin to see if the object has been updated. For more information, see Managing How Long Content Stays in an Edge Cache (Expiration) in the Amazon CloudFront Developer Guide.
     */
    MinTTL: long;
    /**
     * The HTTP headers, cookies, and URL query strings to include in the cache key. The values included in the cache key are automatically included in requests that CloudFront sends to the origin.
     */
    ParametersInCacheKeyAndForwardedToOrigin?: ParametersInCacheKeyAndForwardedToOrigin;
  }
  export type CachePolicyCookieBehavior = "none"|"whitelist"|"allExcept"|"all"|string;
  export interface CachePolicyCookiesConfig {
    /**
     * Determines whether any cookies in viewer requests are included in the cache key and automatically included in requests that CloudFront sends to the origin. Valid values are:    none – Cookies in viewer requests are not included in the cache key and are not automatically included in requests that CloudFront sends to the origin. Even when this field is set to none, any cookies that are listed in an OriginRequestPolicy are included in origin requests.    whitelist – The cookies in viewer requests that are listed in the CookieNames type are included in the cache key and automatically included in requests that CloudFront sends to the origin.    allExcept – All cookies in viewer requests that are  not  listed in the CookieNames type are included in the cache key and automatically included in requests that CloudFront sends to the origin.    all – All cookies in viewer requests are included in the cache key and are automatically included in requests that CloudFront sends to the origin.  
     */
    CookieBehavior: CachePolicyCookieBehavior;
    Cookies?: CookieNames;
  }
  export type CachePolicyHeaderBehavior = "none"|"whitelist"|string;
  export interface CachePolicyHeadersConfig {
    /**
     * Determines whether any HTTP headers are included in the cache key and automatically included in requests that CloudFront sends to the origin. Valid values are:    none – HTTP headers are not included in the cache key and are not automatically included in requests that CloudFront sends to the origin. Even when this field is set to none, any headers that are listed in an OriginRequestPolicy are included in origin requests.    whitelist – The HTTP headers that are listed in the Headers type are included in the cache key and are automatically included in requests that CloudFront sends to the origin.  
     */
    HeaderBehavior: CachePolicyHeaderBehavior;
    Headers?: Headers;
  }
  export interface CachePolicyList {
    /**
     * If there are more items in the list than are in this response, this element is present. It contains the value that you should use in the Marker field of a subsequent request to continue listing cache policies where you left off.
     */
    NextMarker?: string;
    /**
     * The maximum number of cache policies requested.
     */
    MaxItems: integer;
    /**
     * The total number of cache policies returned in the response.
     */
    Quantity: integer;
    /**
     * Contains the cache policies in the list.
     */
    Items?: CachePolicySummaryList;
  }
  export type CachePolicyQueryStringBehavior = "none"|"whitelist"|"allExcept"|"all"|string;
  export interface CachePolicyQueryStringsConfig {
    /**
     * Determines whether any URL query strings in viewer requests are included in the cache key and automatically included in requests that CloudFront sends to the origin. Valid values are:    none – Query strings in viewer requests are not included in the cache key and are not automatically included in requests that CloudFront sends to the origin. Even when this field is set to none, any query strings that are listed in an OriginRequestPolicy are included in origin requests.    whitelist – The query strings in viewer requests that are listed in the QueryStringNames type are included in the cache key and automatically included in requests that CloudFront sends to the origin.    allExcept – All query strings in viewer requests that are  not  listed in the QueryStringNames type are included in the cache key and automatically included in requests that CloudFront sends to the origin.    all – All query strings in viewer requests are included in the cache key and are automatically included in requests that CloudFront sends to the origin.  
     */
    QueryStringBehavior: CachePolicyQueryStringBehavior;
    /**
     * Contains the specific query strings in viewer requests that either  are  or  are not  included in the cache key and automatically included in requests that CloudFront sends to the origin. The behavior depends on whether the QueryStringBehavior field in the CachePolicyQueryStringsConfig type is set to whitelist (the listed query strings  are  included) or allExcept (the listed query strings  are not  included, but all other query strings are).
     */
    QueryStrings?: QueryStringNames;
  }
  export interface CachePolicySummary {
    /**
     * The type of cache policy, either managed (created by Amazon Web Services) or custom (created in this account).
     */
    Type: CachePolicyType;
    /**
     * The cache policy.
     */
    CachePolicy: CachePolicy;
  }
  export type CachePolicySummaryList = CachePolicySummary[];
  export type CachePolicyType = "managed"|"custom"|string;
  export interface CachedMethods {
    /**
     * The number of HTTP methods for which you want CloudFront to cache responses. Valid values are 2 (for caching responses to GET and HEAD requests) and 3 (for caching responses to GET, HEAD, and OPTIONS requests).
     */
    Quantity: integer;
    /**
     * A complex type that contains the HTTP methods that you want CloudFront to cache responses to.
     */
    Items: MethodsList;
  }
  export type CertificateSource = "cloudfront"|"iam"|"acm"|string;
  export interface CloudFrontOriginAccessIdentity {
    /**
     * The ID for the origin access identity, for example, E74FTE3AJFJ256A. 
     */
    Id: string;
    /**
     * The Amazon S3 canonical user ID for the origin access identity, used when giving the origin access identity read permission to an object in Amazon S3. 
     */
    S3CanonicalUserId: string;
    /**
     * The current configuration information for the identity. 
     */
    CloudFrontOriginAccessIdentityConfig?: CloudFrontOriginAccessIdentityConfig;
  }
  export interface CloudFrontOriginAccessIdentityConfig {
    /**
     * A unique value (for example, a date-time stamp) that ensures that the request can't be replayed. If the value of CallerReference is new (regardless of the content of the CloudFrontOriginAccessIdentityConfig object), a new origin access identity is created. If the CallerReference is a value already sent in a previous identity request, and the content of the CloudFrontOriginAccessIdentityConfig is identical to the original request (ignoring white space), the response includes the same information returned to the original request.  If the CallerReference is a value you already sent in a previous request to create an identity, but the content of the CloudFrontOriginAccessIdentityConfig is different from the original request, CloudFront returns a CloudFrontOriginAccessIdentityAlreadyExists error. 
     */
    CallerReference: string;
    /**
     * A comment to describe the origin access identity. The comment cannot be longer than 128 characters.
     */
    Comment: string;
  }
  export interface CloudFrontOriginAccessIdentityList {
    /**
     * Use this when paginating results to indicate where to begin in your list of origin access identities. The results include identities in the list that occur after the marker. To get the next page of results, set the Marker to the value of the NextMarker from the current page's response (which is also the ID of the last identity on that page). 
     */
    Marker: string;
    /**
     * If IsTruncated is true, this element is present and contains the value you can use for the Marker request parameter to continue listing your origin access identities where they left off. 
     */
    NextMarker?: string;
    /**
     * The maximum number of origin access identities you want in the response body. 
     */
    MaxItems: integer;
    /**
     * A flag that indicates whether more origin access identities remain to be listed. If your results were truncated, you can make a follow-up pagination request using the Marker request parameter to retrieve more items in the list.
     */
    IsTruncated: boolean;
    /**
     * The number of CloudFront origin access identities that were created by the current account.
     */
    Quantity: integer;
    /**
     * A complex type that contains one CloudFrontOriginAccessIdentitySummary element for each origin access identity that was created by the current account.
     */
    Items?: CloudFrontOriginAccessIdentitySummaryList;
  }
  export interface CloudFrontOriginAccessIdentitySummary {
    /**
     * The ID for the origin access identity. For example: E74FTE3AJFJ256A.
     */
    Id: string;
    /**
     * The Amazon S3 canonical user ID for the origin access identity, which you use when giving the origin access identity read permission to an object in Amazon S3.
     */
    S3CanonicalUserId: string;
    /**
     * The comment for this origin access identity, as originally specified when created.
     */
    Comment: string;
  }
  export type CloudFrontOriginAccessIdentitySummaryList = CloudFrontOriginAccessIdentitySummary[];
  export type CommentType = string;
  export interface ConflictingAlias {
    /**
     * An alias (also called a CNAME).
     */
    Alias?: string;
    /**
     * The (partially hidden) ID of the CloudFront distribution associated with the alias.
     */
    DistributionId?: string;
    /**
     * The (partially hidden) ID of the Amazon Web Services account that owns the distribution that’s associated with the alias.
     */
    AccountId?: string;
  }
  export type ConflictingAliases = ConflictingAlias[];
  export interface ConflictingAliasesList {
    /**
     * If there are more items in the list than are in this response, this element is present. It contains the value that you should use in the Marker field of a subsequent request to continue listing conflicting aliases where you left off.
     */
    NextMarker?: string;
    /**
     * The maximum number of conflicting aliases requested.
     */
    MaxItems?: integer;
    /**
     * The number of conflicting aliases returned in the response.
     */
    Quantity?: integer;
    /**
     * Contains the conflicting aliases in the list.
     */
    Items?: ConflictingAliases;
  }
  export interface ContentTypeProfile {
    /**
     * The format for a field-level encryption content type-profile mapping. 
     */
    Format: Format;
    /**
     * The profile ID for a field-level encryption content type-profile mapping. 
     */
    ProfileId?: string;
    /**
     * The content type for a field-level encryption content type-profile mapping. 
     */
    ContentType: string;
  }
  export interface ContentTypeProfileConfig {
    /**
     * The setting in a field-level encryption content type-profile mapping that specifies what to do when an unknown content type is provided for the profile. If true, content is forwarded without being encrypted when the content type is unknown. If false (the default), an error is returned when the content type is unknown. 
     */
    ForwardWhenContentTypeIsUnknown: boolean;
    /**
     * The configuration for a field-level encryption content type-profile. 
     */
    ContentTypeProfiles?: ContentTypeProfiles;
  }
  export type ContentTypeProfileList = ContentTypeProfile[];
  export interface ContentTypeProfiles {
    /**
     * The number of field-level encryption content type-profile mappings. 
     */
    Quantity: integer;
    /**
     * Items in a field-level encryption content type-profile mapping. 
     */
    Items?: ContentTypeProfileList;
  }
  export type CookieNameList = string[];
  export interface CookieNames {
    /**
     * The number of cookie names in the Items list.
     */
    Quantity: integer;
    /**
     * A list of cookie names.
     */
    Items?: CookieNameList;
  }
  export interface CookiePreference {
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. If you want to include cookies in the cache key, use a cache policy. For more information, see Creating cache policies in the Amazon CloudFront Developer Guide. If you want to send cookies to the origin but not include them in the cache key, use origin request policy. For more information, see Creating origin request policies in the Amazon CloudFront Developer Guide. Specifies which cookies to forward to the origin for this cache behavior: all, none, or the list of cookies specified in the WhitelistedNames complex type. Amazon S3 doesn't process cookies. When the cache behavior is forwarding requests to an Amazon S3 origin, specify none for the Forward element.
     */
    Forward: ItemSelection;
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. If you want to include cookies in the cache key, use a cache policy. For more information, see Creating cache policies in the Amazon CloudFront Developer Guide. If you want to send cookies to the origin but not include them in the cache key, use an origin request policy. For more information, see Creating origin request policies in the Amazon CloudFront Developer Guide. Required if you specify whitelist for the value of Forward. A complex type that specifies how many different cookies you want CloudFront to forward to the origin for this cache behavior and, if you want to forward selected cookies, the names of those cookies. If you specify all or none for the value of Forward, omit WhitelistedNames. If you change the value of Forward from whitelist to all or none and you don't delete the WhitelistedNames element and its child elements, CloudFront deletes them automatically. For the current limit on the number of cookie names that you can whitelist for each cache behavior, see  CloudFront Limits in the Amazon Web Services General Reference.
     */
    WhitelistedNames?: CookieNames;
  }
  export interface CreateCachePolicyRequest {
    /**
     * A cache policy configuration.
     */
    CachePolicyConfig: CachePolicyConfig;
  }
  export interface CreateCachePolicyResult {
    /**
     * A cache policy.
     */
    CachePolicy?: CachePolicy;
    /**
     * The fully qualified URI of the cache policy just created.
     */
    Location?: string;
    /**
     * The current version of the cache policy.
     */
    ETag?: string;
  }
  export interface CreateCloudFrontOriginAccessIdentityRequest {
    /**
     * The current configuration information for the identity.
     */
    CloudFrontOriginAccessIdentityConfig: CloudFrontOriginAccessIdentityConfig;
  }
  export interface CreateCloudFrontOriginAccessIdentityResult {
    /**
     * The origin access identity's information.
     */
    CloudFrontOriginAccessIdentity?: CloudFrontOriginAccessIdentity;
    /**
     * The fully qualified URI of the new origin access identity just created.
     */
    Location?: string;
    /**
     * The current version of the origin access identity created.
     */
    ETag?: string;
  }
  export interface CreateDistributionRequest {
    /**
     * The distribution's configuration information.
     */
    DistributionConfig: DistributionConfig;
  }
  export interface CreateDistributionResult {
    /**
     * The distribution's information.
     */
    Distribution?: Distribution;
    /**
     * The fully qualified URI of the new distribution resource just created.
     */
    Location?: string;
    /**
     * The current version of the distribution created.
     */
    ETag?: string;
  }
  export interface CreateDistributionWithTagsRequest {
    /**
     * The distribution's configuration information. 
     */
    DistributionConfigWithTags: DistributionConfigWithTags;
  }
  export interface CreateDistributionWithTagsResult {
    /**
     * The distribution's information. 
     */
    Distribution?: Distribution;
    /**
     * The fully qualified URI of the new distribution resource just created.
     */
    Location?: string;
    /**
     * The current version of the distribution created.
     */
    ETag?: string;
  }
  export interface CreateFieldLevelEncryptionConfigRequest {
    /**
     * The request to create a new field-level encryption configuration.
     */
    FieldLevelEncryptionConfig: FieldLevelEncryptionConfig;
  }
  export interface CreateFieldLevelEncryptionConfigResult {
    /**
     * Returned when you create a new field-level encryption configuration.
     */
    FieldLevelEncryption?: FieldLevelEncryption;
    /**
     * The fully qualified URI of the new configuration resource just created.
     */
    Location?: string;
    /**
     * The current version of the field level encryption configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface CreateFieldLevelEncryptionProfileRequest {
    /**
     * The request to create a field-level encryption profile.
     */
    FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig;
  }
  export interface CreateFieldLevelEncryptionProfileResult {
    /**
     * Returned when you create a new field-level encryption profile.
     */
    FieldLevelEncryptionProfile?: FieldLevelEncryptionProfile;
    /**
     * The fully qualified URI of the new profile resource just created.
     */
    Location?: string;
    /**
     * The current version of the field level encryption profile. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface CreateFunctionRequest {
    /**
     * A name to identify the function.
     */
    Name: FunctionName;
    /**
     * Configuration information about the function, including an optional comment and the function’s runtime.
     */
    FunctionConfig: FunctionConfig;
    /**
     * The function code. For more information about writing a CloudFront function, see Writing function code for CloudFront Functions in the Amazon CloudFront Developer Guide.
     */
    FunctionCode: FunctionBlob;
  }
  export interface CreateFunctionResult {
    /**
     * Contains configuration information and metadata about a CloudFront function.
     */
    FunctionSummary?: FunctionSummary;
    /**
     * The URL of the CloudFront function. Use the URL to manage the function with the CloudFront API.
     */
    Location?: string;
    /**
     * The version identifier for the current version of the CloudFront function.
     */
    ETag?: string;
  }
  export interface CreateInvalidationRequest {
    /**
     * The distribution's id.
     */
    DistributionId: string;
    /**
     * The batch information for the invalidation.
     */
    InvalidationBatch: InvalidationBatch;
  }
  export interface CreateInvalidationResult {
    /**
     * The fully qualified URI of the distribution and invalidation batch request, including the Invalidation ID.
     */
    Location?: string;
    /**
     * The invalidation's information.
     */
    Invalidation?: Invalidation;
  }
  export interface CreateKeyGroupRequest {
    /**
     * A key group configuration.
     */
    KeyGroupConfig: KeyGroupConfig;
  }
  export interface CreateKeyGroupResult {
    /**
     * The key group that was just created.
     */
    KeyGroup?: KeyGroup;
    /**
     * The URL of the key group.
     */
    Location?: string;
    /**
     * The identifier for this version of the key group.
     */
    ETag?: string;
  }
  export interface CreateMonitoringSubscriptionRequest {
    /**
     * The ID of the distribution that you are enabling metrics for.
     */
    DistributionId: string;
    /**
     * A monitoring subscription. This structure contains information about whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
     */
    MonitoringSubscription: MonitoringSubscription;
  }
  export interface CreateMonitoringSubscriptionResult {
    /**
     * A monitoring subscription. This structure contains information about whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
     */
    MonitoringSubscription?: MonitoringSubscription;
  }
  export interface CreateOriginRequestPolicyRequest {
    /**
     * An origin request policy configuration.
     */
    OriginRequestPolicyConfig: OriginRequestPolicyConfig;
  }
  export interface CreateOriginRequestPolicyResult {
    /**
     * An origin request policy.
     */
    OriginRequestPolicy?: OriginRequestPolicy;
    /**
     * The fully qualified URI of the origin request policy just created.
     */
    Location?: string;
    /**
     * The current version of the origin request policy.
     */
    ETag?: string;
  }
  export interface CreatePublicKeyRequest {
    /**
     * A CloudFront public key configuration.
     */
    PublicKeyConfig: PublicKeyConfig;
  }
  export interface CreatePublicKeyResult {
    /**
     * The public key.
     */
    PublicKey?: PublicKey;
    /**
     * The URL of the public key.
     */
    Location?: string;
    /**
     * The identifier for this version of the public key.
     */
    ETag?: string;
  }
  export interface CreateRealtimeLogConfigRequest {
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
     */
    EndPoints: EndPointList;
    /**
     * A list of fields to include in each real-time log record. For more information about fields, see Real-time log configuration fields in the Amazon CloudFront Developer Guide.
     */
    Fields: FieldList;
    /**
     * A unique name to identify this real-time log configuration.
     */
    Name: string;
    /**
     * The sampling rate for this real-time log configuration. The sampling rate determines the percentage of viewer requests that are represented in the real-time log data. You must provide an integer between 1 and 100, inclusive.
     */
    SamplingRate: long;
  }
  export interface CreateRealtimeLogConfigResult {
    /**
     * A real-time log configuration.
     */
    RealtimeLogConfig?: RealtimeLogConfig;
  }
  export interface CreateStreamingDistributionRequest {
    /**
     * The streaming distribution's configuration information.
     */
    StreamingDistributionConfig: StreamingDistributionConfig;
  }
  export interface CreateStreamingDistributionResult {
    /**
     * The streaming distribution's information.
     */
    StreamingDistribution?: StreamingDistribution;
    /**
     * The fully qualified URI of the new streaming distribution resource just created.
     */
    Location?: string;
    /**
     * The current version of the streaming distribution created.
     */
    ETag?: string;
  }
  export interface CreateStreamingDistributionWithTagsRequest {
    /**
     *  The streaming distribution's configuration information. 
     */
    StreamingDistributionConfigWithTags: StreamingDistributionConfigWithTags;
  }
  export interface CreateStreamingDistributionWithTagsResult {
    /**
     * The streaming distribution's information. 
     */
    StreamingDistribution?: StreamingDistribution;
    /**
     * The fully qualified URI of the new streaming distribution resource just created.
     */
    Location?: string;
    /**
     * The current version of the distribution created.
     */
    ETag?: string;
  }
  export interface CustomErrorResponse {
    /**
     * The HTTP status code for which you want to specify a custom error page and/or a caching duration.
     */
    ErrorCode: integer;
    /**
     * The path to the custom error page that you want CloudFront to return to a viewer when your origin returns the HTTP status code specified by ErrorCode, for example, /4xx-errors/403-forbidden.html. If you want to store your objects and your custom error pages in different locations, your distribution must include a cache behavior for which the following is true:   The value of PathPattern matches the path to your custom error messages. For example, suppose you saved custom error pages for 4xx errors in an Amazon S3 bucket in a directory named /4xx-errors. Your distribution must include a cache behavior for which the path pattern routes requests for your custom error pages to that location, for example, /4xx-errors/*.    The value of TargetOriginId specifies the value of the ID element for the origin that contains your custom error pages.   If you specify a value for ResponsePagePath, you must also specify a value for ResponseCode. We recommend that you store custom error pages in an Amazon S3 bucket. If you store custom error pages on an HTTP server and the server starts to return 5xx errors, CloudFront can't get the files that you want to return to viewers because the origin server is unavailable.
     */
    ResponsePagePath?: string;
    /**
     * The HTTP status code that you want CloudFront to return to the viewer along with the custom error page. There are a variety of reasons that you might want CloudFront to return a status code different from the status code that your origin returned to CloudFront, for example:   Some Internet devices (some firewalls and corporate proxies, for example) intercept HTTP 4xx and 5xx and prevent the response from being returned to the viewer. If you substitute 200, the response typically won't be intercepted.   If you don't care about distinguishing among different client errors or server errors, you can specify 400 or 500 as the ResponseCode for all 4xx or 5xx errors.   You might want to return a 200 status code (OK) and static website so your customers don't know that your website is down.   If you specify a value for ResponseCode, you must also specify a value for ResponsePagePath.
     */
    ResponseCode?: string;
    /**
     * The minimum amount of time, in seconds, that you want CloudFront to cache the HTTP status code specified in ErrorCode. When this time period has elapsed, CloudFront queries your origin to see whether the problem that caused the error has been resolved and the requested object is now available. For more information, see Customizing Error Responses in the Amazon CloudFront Developer Guide.
     */
    ErrorCachingMinTTL?: long;
  }
  export type CustomErrorResponseList = CustomErrorResponse[];
  export interface CustomErrorResponses {
    /**
     * The number of HTTP status codes for which you want to specify a custom error page and/or a caching duration. If Quantity is 0, you can omit Items.
     */
    Quantity: integer;
    /**
     * A complex type that contains a CustomErrorResponse element for each HTTP status code for which you want to specify a custom error page and/or a caching duration. 
     */
    Items?: CustomErrorResponseList;
  }
  export interface CustomHeaders {
    /**
     * The number of custom headers, if any, for this distribution.
     */
    Quantity: integer;
    /**
     *  Optional: A list that contains one OriginCustomHeader element for each custom header that you want CloudFront to forward to the origin. If Quantity is 0, omit Items.
     */
    Items?: OriginCustomHeadersList;
  }
  export interface CustomOriginConfig {
    /**
     * The HTTP port that CloudFront uses to connect to the origin. Specify the HTTP port that the origin listens on.
     */
    HTTPPort: integer;
    /**
     * The HTTPS port that CloudFront uses to connect to the origin. Specify the HTTPS port that the origin listens on.
     */
    HTTPSPort: integer;
    /**
     * Specifies the protocol (HTTP or HTTPS) that CloudFront uses to connect to the origin. Valid values are:    http-only – CloudFront always uses HTTP to connect to the origin.    match-viewer – CloudFront connects to the origin using the same protocol that the viewer used to connect to CloudFront.    https-only – CloudFront always uses HTTPS to connect to the origin.  
     */
    OriginProtocolPolicy: OriginProtocolPolicy;
    /**
     * Specifies the minimum SSL/TLS protocol that CloudFront uses when connecting to your origin over HTTPS. Valid values include SSLv3, TLSv1, TLSv1.1, and TLSv1.2. For more information, see Minimum Origin SSL Protocol in the Amazon CloudFront Developer Guide.
     */
    OriginSslProtocols?: OriginSslProtocols;
    /**
     * Specifies how long, in seconds, CloudFront waits for a response from the origin. This is also known as the origin response timeout. The minimum timeout is 1 second, the maximum is 60 seconds, and the default (if you don’t specify otherwise) is 30 seconds. For more information, see Origin Response Timeout in the Amazon CloudFront Developer Guide.
     */
    OriginReadTimeout?: integer;
    /**
     * Specifies how long, in seconds, CloudFront persists its connection to the origin. The minimum timeout is 1 second, the maximum is 60 seconds, and the default (if you don’t specify otherwise) is 5 seconds. For more information, see Origin Keep-alive Timeout in the Amazon CloudFront Developer Guide.
     */
    OriginKeepaliveTimeout?: integer;
  }
  export interface DefaultCacheBehavior {
    /**
     * The value of ID for the origin that you want CloudFront to route requests to when they use the default cache behavior.
     */
    TargetOriginId: string;
    /**
     *  We recommend using TrustedKeyGroups instead of TrustedSigners.  A list of account IDs whose public keys CloudFront can use to validate signed URLs or signed cookies. When a cache behavior contains trusted signers, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with the private key of a CloudFront key pair in a trusted signer’s account. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see Serving private content in the Amazon CloudFront Developer Guide.
     */
    TrustedSigners?: TrustedSigners;
    /**
     * A list of key groups that CloudFront can use to validate signed URLs or signed cookies. When a cache behavior contains trusted key groups, CloudFront requires signed URLs or signed cookies for all requests that match the cache behavior. The URLs or cookies must be signed with a private key whose corresponding public key is in the key group. The signed URL or cookie contains information about which public key CloudFront should use to verify the signature. For more information, see Serving private content in the Amazon CloudFront Developer Guide.
     */
    TrustedKeyGroups?: TrustedKeyGroups;
    /**
     * The protocol that viewers can use to access the files in the origin specified by TargetOriginId when a request matches the path pattern in PathPattern. You can specify the following options:    allow-all: Viewers can use HTTP or HTTPS.    redirect-to-https: If a viewer submits an HTTP request, CloudFront returns an HTTP status code of 301 (Moved Permanently) to the viewer along with the HTTPS URL. The viewer then resubmits the request using the new URL.    https-only: If a viewer sends an HTTP request, CloudFront returns an HTTP status code of 403 (Forbidden).   For more information about requiring the HTTPS protocol, see Requiring HTTPS Between Viewers and CloudFront in the Amazon CloudFront Developer Guide.  The only way to guarantee that viewers retrieve an object that was fetched from the origin using HTTPS is never to use any other protocol to fetch the object. If you have recently changed from HTTP to HTTPS, we recommend that you clear your objects’ cache because cached objects are protocol agnostic. That means that an edge location will return an object from the cache regardless of whether the current request protocol matches the protocol used previously. For more information, see Managing Cache Expiration in the Amazon CloudFront Developer Guide. 
     */
    ViewerProtocolPolicy: ViewerProtocolPolicy;
    AllowedMethods?: AllowedMethods;
    /**
     * Indicates whether you want to distribute media files in the Microsoft Smooth Streaming format using the origin that is associated with this cache behavior. If so, specify true; if not, specify false. If you specify true for SmoothStreaming, you can still distribute other content using this cache behavior if the content matches the value of PathPattern. 
     */
    SmoothStreaming?: boolean;
    /**
     * Whether you want CloudFront to automatically compress certain files for this cache behavior. If so, specify true; if not, specify false. For more information, see Serving Compressed Files in the Amazon CloudFront Developer Guide.
     */
    Compress?: boolean;
    /**
     * A complex type that contains zero or more Lambda@Edge function associations for a cache behavior.
     */
    LambdaFunctionAssociations?: LambdaFunctionAssociations;
    /**
     * A list of CloudFront functions that are associated with this cache behavior. CloudFront functions must be published to the LIVE stage to associate them with a cache behavior.
     */
    FunctionAssociations?: FunctionAssociations;
    /**
     * The value of ID for the field-level encryption configuration that you want CloudFront to use for encrypting specific fields of data for the default cache behavior.
     */
    FieldLevelEncryptionId?: string;
    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration that is attached to this cache behavior. For more information, see Real-time logs in the Amazon CloudFront Developer Guide.
     */
    RealtimeLogConfigArn?: string;
    /**
     * The unique identifier of the cache policy that is attached to the default cache behavior. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. A DefaultCacheBehavior must include either a CachePolicyId or ForwardedValues. We recommend that you use a CachePolicyId.
     */
    CachePolicyId?: string;
    /**
     * The unique identifier of the origin request policy that is attached to the default cache behavior. For more information, see Creating origin request policies or Using the managed origin request policies in the Amazon CloudFront Developer Guide.
     */
    OriginRequestPolicyId?: string;
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. For more information, see Working with policies in the Amazon CloudFront Developer Guide. If you want to include values in the cache key, use a cache policy. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. If you want to send values to the origin but not include them in the cache key, use an origin request policy. For more information, see Creating origin request policies or Using the managed origin request policies in the Amazon CloudFront Developer Guide. A DefaultCacheBehavior must include either a CachePolicyId or ForwardedValues. We recommend that you use a CachePolicyId. A complex type that specifies how CloudFront handles query strings, cookies, and HTTP headers.
     */
    ForwardedValues?: ForwardedValues;
    /**
     * This field is deprecated. We recommend that you use the MinTTL field in a cache policy instead of this field. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. The minimum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. For more information, see Managing How Long Content Stays in an Edge Cache (Expiration) in the Amazon CloudFront Developer Guide. You must specify 0 for MinTTL if you configure CloudFront to forward all headers to your origin (under Headers, if you specify 1 for Quantity and * for Name).
     */
    MinTTL?: long;
    /**
     * This field is deprecated. We recommend that you use the DefaultTTL field in a cache policy instead of this field. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. The default amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin does not add HTTP headers such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects. For more information, see Managing How Long Content Stays in an Edge Cache (Expiration) in the Amazon CloudFront Developer Guide.
     */
    DefaultTTL?: long;
    /**
     * This field is deprecated. We recommend that you use the MaxTTL field in a cache policy instead of this field. For more information, see Creating cache policies or Using the managed cache policies in the Amazon CloudFront Developer Guide. The maximum amount of time that you want objects to stay in CloudFront caches before CloudFront forwards another request to your origin to determine whether the object has been updated. The value that you specify applies only when your origin adds HTTP headers such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects. For more information, see Managing How Long Content Stays in an Edge Cache (Expiration) in the Amazon CloudFront Developer Guide.
     */
    MaxTTL?: long;
  }
  export interface DeleteCachePolicyRequest {
    /**
     * The unique identifier for the cache policy that you are deleting. To get the identifier, you can use ListCachePolicies.
     */
    Id: string;
    /**
     * The version of the cache policy that you are deleting. The version is the cache policy’s ETag value, which you can get using ListCachePolicies, GetCachePolicy, or GetCachePolicyConfig.
     */
    IfMatch?: string;
  }
  export interface DeleteCloudFrontOriginAccessIdentityRequest {
    /**
     * The origin access identity's ID.
     */
    Id: string;
    /**
     * The value of the ETag header you received from a previous GET or PUT request. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface DeleteDistributionRequest {
    /**
     * The distribution ID. 
     */
    Id: string;
    /**
     * The value of the ETag header that you received when you disabled the distribution. For example: E2QWRUHAPOMQZL. 
     */
    IfMatch?: string;
  }
  export interface DeleteFieldLevelEncryptionConfigRequest {
    /**
     * The ID of the configuration you want to delete from CloudFront.
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the configuration identity to delete. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface DeleteFieldLevelEncryptionProfileRequest {
    /**
     * Request the ID of the profile you want to delete from CloudFront.
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the profile to delete. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface DeleteFunctionRequest {
    /**
     * The name of the function that you are deleting.
     */
    Name: string;
    /**
     * The current version (ETag value) of the function that you are deleting, which you can get using DescribeFunction.
     */
    IfMatch: string;
  }
  export interface DeleteKeyGroupRequest {
    /**
     * The identifier of the key group that you are deleting. To get the identifier, use ListKeyGroups.
     */
    Id: string;
    /**
     * The version of the key group that you are deleting. The version is the key group’s ETag value. To get the ETag, use GetKeyGroup or GetKeyGroupConfig.
     */
    IfMatch?: string;
  }
  export interface DeleteMonitoringSubscriptionRequest {
    /**
     * The ID of the distribution that you are disabling metrics for.
     */
    DistributionId: string;
  }
  export interface DeleteMonitoringSubscriptionResult {
  }
  export interface DeleteOriginRequestPolicyRequest {
    /**
     * The unique identifier for the origin request policy that you are deleting. To get the identifier, you can use ListOriginRequestPolicies.
     */
    Id: string;
    /**
     * The version of the origin request policy that you are deleting. The version is the origin request policy’s ETag value, which you can get using ListOriginRequestPolicies, GetOriginRequestPolicy, or GetOriginRequestPolicyConfig.
     */
    IfMatch?: string;
  }
  export interface DeletePublicKeyRequest {
    /**
     * The ID of the public key you want to remove from CloudFront.
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the public key identity to delete. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface DeleteRealtimeLogConfigRequest {
    /**
     * The name of the real-time log configuration to delete.
     */
    Name?: string;
    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration to delete.
     */
    ARN?: string;
  }
  export interface DeleteStreamingDistributionRequest {
    /**
     * The distribution ID. 
     */
    Id: string;
    /**
     * The value of the ETag header that you received when you disabled the streaming distribution. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface DescribeFunctionRequest {
    /**
     * The name of the function that you are getting information about.
     */
    Name: string;
    /**
     * The function’s stage, either DEVELOPMENT or LIVE.
     */
    Stage?: FunctionStage;
  }
  export interface DescribeFunctionResult {
    /**
     * Contains configuration information and metadata about a CloudFront function.
     */
    FunctionSummary?: FunctionSummary;
    /**
     * The version identifier for the current version of the CloudFront function.
     */
    ETag?: string;
  }
  export interface Distribution {
    /**
     * The identifier for the distribution. For example: EDFDVBD632BHDS5. 
     */
    Id: string;
    /**
     * The ARN (Amazon Resource Name) for the distribution. For example: arn:aws:cloudfront::123456789012:distribution/EDFDVBD632BHDS5, where 123456789012 is your account ID.
     */
    ARN: string;
    /**
     * This response element indicates the current status of the distribution. When the status is Deployed, the distribution's information is fully propagated to all CloudFront edge locations. 
     */
    Status: string;
    /**
     * The date and time the distribution was last modified. 
     */
    LastModifiedTime: timestamp;
    /**
     * The number of invalidation batches currently in progress. 
     */
    InProgressInvalidationBatches: integer;
    /**
     * The domain name corresponding to the distribution, for example, d111111abcdef8.cloudfront.net. 
     */
    DomainName: string;
    /**
     *  We recommend using TrustedKeyGroups instead of TrustedSigners.  CloudFront automatically adds this field to the response if you’ve configured a cache behavior in this distribution to serve private content using trusted signers. This field contains a list of account IDs and the active CloudFront key pairs in each account that CloudFront can use to verify the signatures of signed URLs or signed cookies.
     */
    ActiveTrustedSigners?: ActiveTrustedSigners;
    /**
     * CloudFront automatically adds this field to the response if you’ve configured a cache behavior in this distribution to serve private content using key groups. This field contains a list of key groups and the public keys in each key group that CloudFront can use to verify the signatures of signed URLs or signed cookies.
     */
    ActiveTrustedKeyGroups?: ActiveTrustedKeyGroups;
    /**
     * The current configuration information for the distribution. Send a GET request to the /CloudFront API version/distribution ID/config resource.
     */
    DistributionConfig: DistributionConfig;
    /**
     * Amazon Web Services services in China customers must file for an Internet Content Provider (ICP) recordal if they want to serve content publicly on an alternate domain name, also known as a CNAME, that they've added to CloudFront. AliasICPRecordal provides the ICP recordal status for CNAMEs associated with distributions. For more information about ICP recordals, see  Signup, Accounts, and Credentials in Getting Started with Amazon Web Services services in China.
     */
    AliasICPRecordals?: AliasICPRecordals;
  }
  export interface DistributionConfig {
    /**
     * A unique value (for example, a date-time stamp) that ensures that the request can't be replayed. If the value of CallerReference is new (regardless of the content of the DistributionConfig object), CloudFront creates a new distribution. If CallerReference is a value that you already sent in a previous request to create a distribution, CloudFront returns a DistributionAlreadyExists error.
     */
    CallerReference: string;
    /**
     * A complex type that contains information about CNAMEs (alternate domain names), if any, for this distribution.
     */
    Aliases?: Aliases;
    /**
     * The object that you want CloudFront to request from your origin (for example, index.html) when a viewer requests the root URL for your distribution (http://www.example.com) instead of an object in your distribution (http://www.example.com/product-description.html). Specifying a default root object avoids exposing the contents of your distribution. Specify only the object name, for example, index.html. Don't add a / before the object name. If you don't want to specify a default root object when you create a distribution, include an empty DefaultRootObject element. To delete the default root object from an existing distribution, update the distribution configuration and include an empty DefaultRootObject element. To replace the default root object, update the distribution configuration and specify the new object. For more information about the default root object, see Creating a Default Root Object in the Amazon CloudFront Developer Guide.
     */
    DefaultRootObject?: string;
    /**
     * A complex type that contains information about origins for this distribution. 
     */
    Origins: Origins;
    /**
     *  A complex type that contains information about origin groups for this distribution.
     */
    OriginGroups?: OriginGroups;
    /**
     * A complex type that describes the default cache behavior if you don't specify a CacheBehavior element or if files don't match any of the values of PathPattern in CacheBehavior elements. You must create exactly one default cache behavior.
     */
    DefaultCacheBehavior: DefaultCacheBehavior;
    /**
     * A complex type that contains zero or more CacheBehavior elements. 
     */
    CacheBehaviors?: CacheBehaviors;
    /**
     * A complex type that controls the following:   Whether CloudFront replaces HTTP status codes in the 4xx and 5xx range with custom error messages before returning the response to the viewer.   How long CloudFront caches HTTP status codes in the 4xx and 5xx range.   For more information about custom error pages, see Customizing Error Responses in the Amazon CloudFront Developer Guide.
     */
    CustomErrorResponses?: CustomErrorResponses;
    /**
     * An optional comment to describe the distribution. The comment cannot be longer than 128 characters.
     */
    Comment: CommentType;
    /**
     * A complex type that controls whether access logs are written for the distribution. For more information about logging, see Access Logs in the Amazon CloudFront Developer Guide.
     */
    Logging?: LoggingConfig;
    /**
     * The price class that corresponds with the maximum price that you want to pay for CloudFront service. If you specify PriceClass_All, CloudFront responds to requests for your objects from all CloudFront edge locations. If you specify a price class other than PriceClass_All, CloudFront serves your objects from the CloudFront edge location that has the lowest latency among the edge locations in your price class. Viewers who are in or near regions that are excluded from your specified price class may encounter slower performance. For more information about price classes, see Choosing the Price Class for a CloudFront Distribution in the Amazon CloudFront Developer Guide. For information about CloudFront pricing, including how price classes (such as Price Class 100) map to CloudFront regions, see Amazon CloudFront Pricing.
     */
    PriceClass?: PriceClass;
    /**
     * From this field, you can enable or disable the selected distribution.
     */
    Enabled: boolean;
    /**
     * A complex type that determines the distribution’s SSL/TLS configuration for communicating with viewers.
     */
    ViewerCertificate?: ViewerCertificate;
    /**
     * A complex type that identifies ways in which you want to restrict distribution of your content.
     */
    Restrictions?: Restrictions;
    /**
     * A unique identifier that specifies the WAF web ACL, if any, to associate with this distribution. To specify a web ACL created using the latest version of WAF, use the ACL ARN, for example arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a. To specify a web ACL created using WAF Classic, use the ACL ID, for example 473e64fd-f30b-4765-81a0-62ad96dd167a. WAF is a web application firewall that lets you monitor the HTTP and HTTPS requests that are forwarded to CloudFront, and lets you control access to your content. Based on conditions that you specify, such as the IP addresses that requests originate from or the values of query strings, CloudFront responds to requests either with the requested content or with an HTTP 403 status code (Forbidden). You can also configure CloudFront to return a custom error page when a request is blocked. For more information about WAF, see the WAF Developer Guide. 
     */
    WebACLId?: string;
    /**
     * (Optional) Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront. The default value for new web distributions is http2. Viewers that don't support HTTP/2 automatically use an earlier HTTP version. For viewers and CloudFront to use HTTP/2, viewers must support TLS 1.2 or later, and must support Server Name Identification (SNI). In general, configuring CloudFront to communicate with viewers using HTTP/2 reduces latency. You can improve performance by optimizing for HTTP/2. For more information, do an Internet search for "http/2 optimization." 
     */
    HttpVersion?: HttpVersion;
    /**
     * If you want CloudFront to respond to IPv6 DNS requests with an IPv6 address for your distribution, specify true. If you specify false, CloudFront responds to IPv6 DNS requests with the DNS response code NOERROR and with no IP addresses. This allows viewers to submit a second request, for an IPv4 address for your distribution.  In general, you should enable IPv6 if you have users on IPv6 networks who want to access your content. However, if you're using signed URLs or signed cookies to restrict access to your content, and if you're using a custom policy that includes the IpAddress parameter to restrict the IP addresses that can access your content, don't enable IPv6. If you want to restrict access to some content by IP address and not restrict access to other content (or restrict access but not by IP address), you can create two distributions. For more information, see Creating a Signed URL Using a Custom Policy in the Amazon CloudFront Developer Guide. If you're using an Route 53 Amazon Web Services Integration alias resource record set to route traffic to your CloudFront distribution, you need to create a second alias resource record set when both of the following are true:   You enable IPv6 for the distribution   You're using alternate domain names in the URLs for your objects   For more information, see Routing Traffic to an Amazon CloudFront Web Distribution by Using Your Domain Name in the Route 53 Amazon Web Services Integration Developer Guide. If you created a CNAME resource record set, either with Route 53 Amazon Web Services Integration or with another DNS service, you don't need to make any changes. A CNAME record will route traffic to your distribution regardless of the IP address format of the viewer request.
     */
    IsIPV6Enabled?: boolean;
  }
  export interface DistributionConfigWithTags {
    /**
     * A distribution configuration.
     */
    DistributionConfig: DistributionConfig;
    /**
     * A complex type that contains zero or more Tag elements.
     */
    Tags: Tags;
  }
  export interface DistributionIdList {
    /**
     * The value provided in the Marker request field.
     */
    Marker: string;
    /**
     * Contains the value that you should use in the Marker field of a subsequent request to continue listing distribution IDs where you left off.
     */
    NextMarker?: string;
    /**
     * The maximum number of distribution IDs requested.
     */
    MaxItems: integer;
    /**
     * A flag that indicates whether more distribution IDs remain to be listed. If your results were truncated, you can make a subsequent request using the Marker request field to retrieve more distribution IDs in the list.
     */
    IsTruncated: boolean;
    /**
     * The total number of distribution IDs returned in the response.
     */
    Quantity: integer;
    /**
     * Contains the distribution IDs in the list.
     */
    Items?: DistributionIdListSummary;
  }
  export type DistributionIdListSummary = string[];
  export interface DistributionList {
    /**
     * The value you provided for the Marker request parameter.
     */
    Marker: string;
    /**
     * If IsTruncated is true, this element is present and contains the value you can use for the Marker request parameter to continue listing your distributions where they left off. 
     */
    NextMarker?: string;
    /**
     * The value you provided for the MaxItems request parameter.
     */
    MaxItems: integer;
    /**
     * A flag that indicates whether more distributions remain to be listed. If your results were truncated, you can make a follow-up pagination request using the Marker request parameter to retrieve more distributions in the list.
     */
    IsTruncated: boolean;
    /**
     * The number of distributions that were created by the current account.
     */
    Quantity: integer;
    /**
     * A complex type that contains one DistributionSummary element for each distribution that was created by the current account.
     */
    Items?: DistributionSummaryList;
  }
  export interface DistributionSummary {
    /**
     * The identifier for the distribution. For example: EDFDVBD632BHDS5.
     */
    Id: string;
    /**
     * The ARN (Amazon Resource Name) for the distribution. For example: arn:aws:cloudfront::123456789012:distribution/EDFDVBD632BHDS5, where 123456789012 is your account ID.
     */
    ARN: string;
    /**
     * The current status of the distribution. When the status is Deployed, the distribution's information is propagated to all CloudFront edge locations.
     */
    Status: string;
    /**
     * The date and time the distribution was last modified.
     */
    LastModifiedTime: timestamp;
    /**
     * The domain name that corresponds to the distribution, for example, d111111abcdef8.cloudfront.net.
     */
    DomainName: string;
    /**
     * A complex type that contains information about CNAMEs (alternate domain names), if any, for this distribution.
     */
    Aliases: Aliases;
    /**
     * A complex type that contains information about origins for this distribution.
     */
    Origins: Origins;
    /**
     *  A complex type that contains information about origin groups for this distribution.
     */
    OriginGroups?: OriginGroups;
    /**
     * A complex type that describes the default cache behavior if you don't specify a CacheBehavior element or if files don't match any of the values of PathPattern in CacheBehavior elements. You must create exactly one default cache behavior.
     */
    DefaultCacheBehavior: DefaultCacheBehavior;
    /**
     * A complex type that contains zero or more CacheBehavior elements.
     */
    CacheBehaviors: CacheBehaviors;
    /**
     * A complex type that contains zero or more CustomErrorResponses elements.
     */
    CustomErrorResponses: CustomErrorResponses;
    /**
     * The comment originally specified when this distribution was created.
     */
    Comment: string;
    /**
     * A complex type that contains information about price class for this streaming distribution. 
     */
    PriceClass: PriceClass;
    /**
     * Whether the distribution is enabled to accept user requests for content.
     */
    Enabled: boolean;
    /**
     * A complex type that determines the distribution’s SSL/TLS configuration for communicating with viewers.
     */
    ViewerCertificate: ViewerCertificate;
    /**
     * A complex type that identifies ways in which you want to restrict distribution of your content.
     */
    Restrictions: Restrictions;
    /**
     * The Web ACL Id (if any) associated with the distribution.
     */
    WebACLId: string;
    /**
     *  Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront. The default value for new web distributions is http2. Viewers that don't support HTTP/2 will automatically use an earlier version.
     */
    HttpVersion: HttpVersion;
    /**
     * Whether CloudFront responds to IPv6 DNS requests with an IPv6 address for your distribution.
     */
    IsIPV6Enabled: boolean;
    /**
     * Amazon Web Services services in China customers must file for an Internet Content Provider (ICP) recordal if they want to serve content publicly on an alternate domain name, also known as a CNAME, that they've added to CloudFront. AliasICPRecordal provides the ICP recordal status for CNAMEs associated with distributions. For more information about ICP recordals, see  Signup, Accounts, and Credentials in Getting Started with Amazon Web Services services in China.
     */
    AliasICPRecordals?: AliasICPRecordals;
  }
  export type DistributionSummaryList = DistributionSummary[];
  export interface EncryptionEntities {
    /**
     * Number of field pattern items in a field-level encryption content type-profile mapping. 
     */
    Quantity: integer;
    /**
     * An array of field patterns in a field-level encryption content type-profile mapping. 
     */
    Items?: EncryptionEntityList;
  }
  export interface EncryptionEntity {
    /**
     * The public key associated with a set of field-level encryption patterns, to be used when encrypting the fields that match the patterns. 
     */
    PublicKeyId: string;
    /**
     * The provider associated with the public key being used for encryption. This value must also be provided with the private key for applications to be able to decrypt data.
     */
    ProviderId: string;
    /**
     * Field patterns in a field-level encryption content type profile specify the fields that you want to be encrypted. You can provide the full field name, or any beginning characters followed by a wildcard (*). You can't overlap field patterns. For example, you can't have both ABC* and AB*. Note that field patterns are case-sensitive. 
     */
    FieldPatterns: FieldPatterns;
  }
  export type EncryptionEntityList = EncryptionEntity[];
  export interface EndPoint {
    /**
     * The type of data stream where you are sending real-time log data. The only valid value is Kinesis.
     */
    StreamType: string;
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
     */
    KinesisStreamConfig?: KinesisStreamConfig;
  }
  export type EndPointList = EndPoint[];
  export type EventType = "viewer-request"|"viewer-response"|"origin-request"|"origin-response"|string;
  export interface FieldLevelEncryption {
    /**
     * The configuration ID for a field-level encryption configuration which includes a set of profiles that specify certain selected data fields to be encrypted by specific public keys.
     */
    Id: string;
    /**
     * The last time the field-level encryption configuration was changed. 
     */
    LastModifiedTime: timestamp;
    /**
     * A complex data type that includes the profile configurations specified for field-level encryption. 
     */
    FieldLevelEncryptionConfig: FieldLevelEncryptionConfig;
  }
  export interface FieldLevelEncryptionConfig {
    /**
     * A unique number that ensures the request can't be replayed.
     */
    CallerReference: string;
    /**
     * An optional comment about the configuration. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
    /**
     * A complex data type that specifies when to forward content if a profile isn't found and the profile that can be provided as a query argument in a request.
     */
    QueryArgProfileConfig?: QueryArgProfileConfig;
    /**
     * A complex data type that specifies when to forward content if a content type isn't recognized and profiles to use as by default in a request if a query argument doesn't specify a profile to use.
     */
    ContentTypeProfileConfig?: ContentTypeProfileConfig;
  }
  export interface FieldLevelEncryptionList {
    /**
     * If there are more elements to be listed, this element is present and contains the value that you can use for the Marker request parameter to continue listing your configurations where you left off.
     */
    NextMarker?: string;
    /**
     * The maximum number of elements you want in the response body. 
     */
    MaxItems: integer;
    /**
     * The number of field-level encryption items.
     */
    Quantity: integer;
    /**
     * An array of field-level encryption items.
     */
    Items?: FieldLevelEncryptionSummaryList;
  }
  export interface FieldLevelEncryptionProfile {
    /**
     * The ID for a field-level encryption profile configuration which includes a set of profiles that specify certain selected data fields to be encrypted by specific public keys.
     */
    Id: string;
    /**
     * The last time the field-level encryption profile was updated.
     */
    LastModifiedTime: timestamp;
    /**
     * A complex data type that includes the profile name and the encryption entities for the field-level encryption profile.
     */
    FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig;
  }
  export interface FieldLevelEncryptionProfileConfig {
    /**
     * Profile name for the field-level encryption profile.
     */
    Name: string;
    /**
     * A unique number that ensures that the request can't be replayed.
     */
    CallerReference: string;
    /**
     * An optional comment for the field-level encryption profile. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
    /**
     * A complex data type of encryption entities for the field-level encryption profile that include the public key ID, provider, and field patterns for specifying which fields to encrypt with this key.
     */
    EncryptionEntities: EncryptionEntities;
  }
  export interface FieldLevelEncryptionProfileList {
    /**
     * If there are more elements to be listed, this element is present and contains the value that you can use for the Marker request parameter to continue listing your profiles where you left off.
     */
    NextMarker?: string;
    /**
     * The maximum number of field-level encryption profiles you want in the response body. 
     */
    MaxItems: integer;
    /**
     * The number of field-level encryption profiles.
     */
    Quantity: integer;
    /**
     * The field-level encryption profile items.
     */
    Items?: FieldLevelEncryptionProfileSummaryList;
  }
  export interface FieldLevelEncryptionProfileSummary {
    /**
     * ID for the field-level encryption profile summary.
     */
    Id: string;
    /**
     * The time when the the field-level encryption profile summary was last updated.
     */
    LastModifiedTime: timestamp;
    /**
     * Name for the field-level encryption profile summary.
     */
    Name: string;
    /**
     * A complex data type of encryption entities for the field-level encryption profile that include the public key ID, provider, and field patterns for specifying which fields to encrypt with this key.
     */
    EncryptionEntities: EncryptionEntities;
    /**
     * An optional comment for the field-level encryption profile summary. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
  }
  export type FieldLevelEncryptionProfileSummaryList = FieldLevelEncryptionProfileSummary[];
  export interface FieldLevelEncryptionSummary {
    /**
     * The unique ID of a field-level encryption item.
     */
    Id: string;
    /**
     * The last time that the summary of field-level encryption items was modified.
     */
    LastModifiedTime: timestamp;
    /**
     * An optional comment about the field-level encryption item. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
    /**
     *  A summary of a query argument-profile mapping. 
     */
    QueryArgProfileConfig?: QueryArgProfileConfig;
    /**
     *  A summary of a content type-profile mapping. 
     */
    ContentTypeProfileConfig?: ContentTypeProfileConfig;
  }
  export type FieldLevelEncryptionSummaryList = FieldLevelEncryptionSummary[];
  export type FieldList = string[];
  export type FieldPatternList = string[];
  export interface FieldPatterns {
    /**
     * The number of field-level encryption field patterns.
     */
    Quantity: integer;
    /**
     * An array of the field-level encryption field patterns.
     */
    Items?: FieldPatternList;
  }
  export type Format = "URLEncoded"|string;
  export interface ForwardedValues {
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. If you want to include query strings in the cache key, use a cache policy. For more information, see Creating cache policies in the Amazon CloudFront Developer Guide. If you want to send query strings to the origin but not include them in the cache key, use an origin request policy. For more information, see Creating origin request policies in the Amazon CloudFront Developer Guide. Indicates whether you want CloudFront to forward query strings to the origin that is associated with this cache behavior and cache based on the query string parameters. CloudFront behavior depends on the value of QueryString and on the values that you specify for QueryStringCacheKeys, if any: If you specify true for QueryString and you don't specify any values for QueryStringCacheKeys, CloudFront forwards all query string parameters to the origin and caches based on all query string parameters. Depending on how many query string parameters and values you have, this can adversely affect performance because CloudFront must forward more requests to the origin. If you specify true for QueryString and you specify one or more values for QueryStringCacheKeys, CloudFront forwards all query string parameters to the origin, but it only caches based on the query string parameters that you specify. If you specify false for QueryString, CloudFront doesn't forward any query string parameters to the origin, and doesn't cache based on query string parameters. For more information, see Configuring CloudFront to Cache Based on Query String Parameters in the Amazon CloudFront Developer Guide.
     */
    QueryString: boolean;
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. If you want to include cookies in the cache key, use a cache policy. For more information, see Creating cache policies in the Amazon CloudFront Developer Guide. If you want to send cookies to the origin but not include them in the cache key, use an origin request policy. For more information, see Creating origin request policies in the Amazon CloudFront Developer Guide. A complex type that specifies whether you want CloudFront to forward cookies to the origin and, if so, which ones. For more information about forwarding cookies to the origin, see How CloudFront Forwards, Caches, and Logs Cookies in the Amazon CloudFront Developer Guide.
     */
    Cookies: CookiePreference;
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. If you want to include headers in the cache key, use a cache policy. For more information, see Creating cache policies in the Amazon CloudFront Developer Guide. If you want to send headers to the origin but not include them in the cache key, use an origin request policy. For more information, see Creating origin request policies in the Amazon CloudFront Developer Guide. A complex type that specifies the Headers, if any, that you want CloudFront to forward to the origin for this cache behavior (whitelisted headers). For the headers that you specify, CloudFront also caches separate versions of a specified object that is based on the header values in viewer requests. For more information, see  Caching Content Based on Request Headers in the Amazon CloudFront Developer Guide.
     */
    Headers?: Headers;
    /**
     * This field is deprecated. We recommend that you use a cache policy or an origin request policy instead of this field. If you want to include query strings in the cache key, use a cache policy. For more information, see Creating cache policies in the Amazon CloudFront Developer Guide. If you want to send query strings to the origin but not include them in the cache key, use an origin request policy. For more information, see Creating origin request policies in the Amazon CloudFront Developer Guide. A complex type that contains information about the query string parameters that you want CloudFront to use for caching for this cache behavior.
     */
    QueryStringCacheKeys?: QueryStringCacheKeys;
  }
  export type FunctionARN = string;
  export interface FunctionAssociation {
    /**
     * The Amazon Resource Name (ARN) of the function.
     */
    FunctionARN: FunctionARN;
    /**
     * The event type of the function, either viewer-request or viewer-response. You cannot use origin-facing event types (origin-request and origin-response) with a CloudFront function.
     */
    EventType: EventType;
  }
  export type FunctionAssociationList = FunctionAssociation[];
  export interface FunctionAssociations {
    /**
     * The number of CloudFront functions in the list.
     */
    Quantity: integer;
    /**
     * The CloudFront functions that are associated with a cache behavior in a CloudFront distribution. CloudFront functions must be published to the LIVE stage to associate them with a cache behavior.
     */
    Items?: FunctionAssociationList;
  }
  export type FunctionBlob = Buffer|Uint8Array|Blob|string;
  export interface FunctionConfig {
    /**
     * A comment to describe the function.
     */
    Comment: string;
    /**
     * The function’s runtime environment. The only valid value is cloudfront-js-1.0.
     */
    Runtime: FunctionRuntime;
  }
  export type FunctionEventObject = Buffer|Uint8Array|Blob|string;
  export type FunctionExecutionLogList = string[];
  export interface FunctionList {
    /**
     * If there are more items in the list than are in this response, this element is present. It contains the value that you should use in the Marker field of a subsequent request to continue listing functions where you left off.
     */
    NextMarker?: string;
    /**
     * The maximum number of functions requested.
     */
    MaxItems: integer;
    /**
     * The number of functions returned in the response.
     */
    Quantity: integer;
    /**
     * Contains the functions in the list.
     */
    Items?: FunctionSummaryList;
  }
  export interface FunctionMetadata {
    /**
     * The Amazon Resource Name (ARN) of the function. The ARN uniquely identifies the function.
     */
    FunctionARN: string;
    /**
     * The stage that the function is in, either DEVELOPMENT or LIVE. When a function is in the DEVELOPMENT stage, you can test the function with TestFunction, and update it with UpdateFunction. When a function is in the LIVE stage, you can attach the function to a distribution’s cache behavior, using the function’s ARN.
     */
    Stage?: FunctionStage;
    /**
     * The date and time when the function was created.
     */
    CreatedTime?: timestamp;
    /**
     * The date and time when the function was most recently updated.
     */
    LastModifiedTime: timestamp;
  }
  export type FunctionName = string;
  export type FunctionRuntime = "cloudfront-js-1.0"|string;
  export type FunctionStage = "DEVELOPMENT"|"LIVE"|string;
  export interface FunctionSummary {
    /**
     * The name of the CloudFront function.
     */
    Name: FunctionName;
    /**
     * The status of the CloudFront function.
     */
    Status?: string;
    /**
     * Contains configuration information about a CloudFront function.
     */
    FunctionConfig: FunctionConfig;
    /**
     * Contains metadata about a CloudFront function.
     */
    FunctionMetadata: FunctionMetadata;
  }
  export type FunctionSummaryList = FunctionSummary[];
  export interface GeoRestriction {
    /**
     * The method that you want to use to restrict distribution of your content by country:    none: No geo restriction is enabled, meaning access to content is not restricted by client geo location.    blacklist: The Location elements specify the countries in which you don't want CloudFront to distribute your content.    whitelist: The Location elements specify the countries in which you want CloudFront to distribute your content.  
     */
    RestrictionType: GeoRestrictionType;
    /**
     * When geo restriction is enabled, this is the number of countries in your whitelist or blacklist. Otherwise, when it is not enabled, Quantity is 0, and you can omit Items.
     */
    Quantity: integer;
    /**
     *  A complex type that contains a Location element for each country in which you want CloudFront either to distribute your content (whitelist) or not distribute your content (blacklist). The Location element is a two-letter, uppercase country code for a country that you want to include in your blacklist or whitelist. Include one Location element for each country. CloudFront and MaxMind both use ISO 3166 country codes. For the current list of countries and the corresponding codes, see ISO 3166-1-alpha-2 code on the International Organization for Standardization website. You can also refer to the country list on the CloudFront console, which includes both country names and codes.
     */
    Items?: LocationList;
  }
  export type GeoRestrictionType = "blacklist"|"whitelist"|"none"|string;
  export interface GetCachePolicyConfigRequest {
    /**
     * The unique identifier for the cache policy. If the cache policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the cache policy is not attached to a cache behavior, you can get the identifier using ListCachePolicies.
     */
    Id: string;
  }
  export interface GetCachePolicyConfigResult {
    /**
     * The cache policy configuration.
     */
    CachePolicyConfig?: CachePolicyConfig;
    /**
     * The current version of the cache policy.
     */
    ETag?: string;
  }
  export interface GetCachePolicyRequest {
    /**
     * The unique identifier for the cache policy. If the cache policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the cache policy is not attached to a cache behavior, you can get the identifier using ListCachePolicies.
     */
    Id: string;
  }
  export interface GetCachePolicyResult {
    /**
     * The cache policy.
     */
    CachePolicy?: CachePolicy;
    /**
     * The current version of the cache policy.
     */
    ETag?: string;
  }
  export interface GetCloudFrontOriginAccessIdentityConfigRequest {
    /**
     * The identity's ID. 
     */
    Id: string;
  }
  export interface GetCloudFrontOriginAccessIdentityConfigResult {
    /**
     * The origin access identity's configuration information. 
     */
    CloudFrontOriginAccessIdentityConfig?: CloudFrontOriginAccessIdentityConfig;
    /**
     * The current version of the configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface GetCloudFrontOriginAccessIdentityRequest {
    /**
     * The identity's ID.
     */
    Id: string;
  }
  export interface GetCloudFrontOriginAccessIdentityResult {
    /**
     * The origin access identity's information.
     */
    CloudFrontOriginAccessIdentity?: CloudFrontOriginAccessIdentity;
    /**
     * The current version of the origin access identity's information. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface GetDistributionConfigRequest {
    /**
     * The distribution's ID. If the ID is empty, an empty distribution configuration is returned.
     */
    Id: string;
  }
  export interface GetDistributionConfigResult {
    /**
     * The distribution's configuration information.
     */
    DistributionConfig?: DistributionConfig;
    /**
     * The current version of the configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface GetDistributionRequest {
    /**
     * The distribution's ID. If the ID is empty, an empty distribution configuration is returned.
     */
    Id: string;
  }
  export interface GetDistributionResult {
    /**
     * The distribution's information.
     */
    Distribution?: Distribution;
    /**
     * The current version of the distribution's information. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface GetFieldLevelEncryptionConfigRequest {
    /**
     * Request the ID for the field-level encryption configuration information.
     */
    Id: string;
  }
  export interface GetFieldLevelEncryptionConfigResult {
    /**
     * Return the field-level encryption configuration information.
     */
    FieldLevelEncryptionConfig?: FieldLevelEncryptionConfig;
    /**
     * The current version of the field level encryption configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface GetFieldLevelEncryptionProfileConfigRequest {
    /**
     * Get the ID for the field-level encryption profile configuration information.
     */
    Id: string;
  }
  export interface GetFieldLevelEncryptionProfileConfigResult {
    /**
     * Return the field-level encryption profile configuration information.
     */
    FieldLevelEncryptionProfileConfig?: FieldLevelEncryptionProfileConfig;
    /**
     * The current version of the field-level encryption profile configuration result. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface GetFieldLevelEncryptionProfileRequest {
    /**
     * Get the ID for the field-level encryption profile information.
     */
    Id: string;
  }
  export interface GetFieldLevelEncryptionProfileResult {
    /**
     * Return the field-level encryption profile information.
     */
    FieldLevelEncryptionProfile?: FieldLevelEncryptionProfile;
    /**
     * The current version of the field level encryption profile. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface GetFieldLevelEncryptionRequest {
    /**
     * Request the ID for the field-level encryption configuration information.
     */
    Id: string;
  }
  export interface GetFieldLevelEncryptionResult {
    /**
     * Return the field-level encryption configuration information.
     */
    FieldLevelEncryption?: FieldLevelEncryption;
    /**
     * The current version of the field level encryption configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface GetFunctionRequest {
    /**
     * The name of the function whose code you are getting.
     */
    Name: string;
    /**
     * The function’s stage, either DEVELOPMENT or LIVE.
     */
    Stage?: FunctionStage;
  }
  export interface GetFunctionResult {
    /**
     * The function code of a CloudFront function.
     */
    FunctionCode?: FunctionBlob;
    /**
     * The version identifier for the current version of the CloudFront function.
     */
    ETag?: string;
    /**
     * The content type (media type) of the response.
     */
    ContentType?: string;
  }
  export interface GetInvalidationRequest {
    /**
     * The distribution's ID.
     */
    DistributionId: string;
    /**
     * The identifier for the invalidation request, for example, IDFDVBD632BHDS5.
     */
    Id: string;
  }
  export interface GetInvalidationResult {
    /**
     * The invalidation's information. For more information, see Invalidation Complex Type. 
     */
    Invalidation?: Invalidation;
  }
  export interface GetKeyGroupConfigRequest {
    /**
     * The identifier of the key group whose configuration you are getting. To get the identifier, use ListKeyGroups.
     */
    Id: string;
  }
  export interface GetKeyGroupConfigResult {
    /**
     * The key group configuration.
     */
    KeyGroupConfig?: KeyGroupConfig;
    /**
     * The identifier for this version of the key group.
     */
    ETag?: string;
  }
  export interface GetKeyGroupRequest {
    /**
     * The identifier of the key group that you are getting. To get the identifier, use ListKeyGroups.
     */
    Id: string;
  }
  export interface GetKeyGroupResult {
    /**
     * The key group.
     */
    KeyGroup?: KeyGroup;
    /**
     * The identifier for this version of the key group.
     */
    ETag?: string;
  }
  export interface GetMonitoringSubscriptionRequest {
    /**
     * The ID of the distribution that you are getting metrics information for.
     */
    DistributionId: string;
  }
  export interface GetMonitoringSubscriptionResult {
    /**
     * A monitoring subscription. This structure contains information about whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
     */
    MonitoringSubscription?: MonitoringSubscription;
  }
  export interface GetOriginRequestPolicyConfigRequest {
    /**
     * The unique identifier for the origin request policy. If the origin request policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the origin request policy is not attached to a cache behavior, you can get the identifier using ListOriginRequestPolicies.
     */
    Id: string;
  }
  export interface GetOriginRequestPolicyConfigResult {
    /**
     * The origin request policy configuration.
     */
    OriginRequestPolicyConfig?: OriginRequestPolicyConfig;
    /**
     * The current version of the origin request policy.
     */
    ETag?: string;
  }
  export interface GetOriginRequestPolicyRequest {
    /**
     * The unique identifier for the origin request policy. If the origin request policy is attached to a distribution’s cache behavior, you can get the policy’s identifier using ListDistributions or GetDistribution. If the origin request policy is not attached to a cache behavior, you can get the identifier using ListOriginRequestPolicies.
     */
    Id: string;
  }
  export interface GetOriginRequestPolicyResult {
    /**
     * The origin request policy.
     */
    OriginRequestPolicy?: OriginRequestPolicy;
    /**
     * The current version of the origin request policy.
     */
    ETag?: string;
  }
  export interface GetPublicKeyConfigRequest {
    /**
     * The identifier of the public key whose configuration you are getting.
     */
    Id: string;
  }
  export interface GetPublicKeyConfigResult {
    /**
     * A public key configuration.
     */
    PublicKeyConfig?: PublicKeyConfig;
    /**
     * The identifier for this version of the public key configuration.
     */
    ETag?: string;
  }
  export interface GetPublicKeyRequest {
    /**
     * The identifier of the public key you are getting.
     */
    Id: string;
  }
  export interface GetPublicKeyResult {
    /**
     * The public key.
     */
    PublicKey?: PublicKey;
    /**
     * The identifier for this version of the public key.
     */
    ETag?: string;
  }
  export interface GetRealtimeLogConfigRequest {
    /**
     * The name of the real-time log configuration to get.
     */
    Name?: string;
    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration to get.
     */
    ARN?: string;
  }
  export interface GetRealtimeLogConfigResult {
    /**
     * A real-time log configuration.
     */
    RealtimeLogConfig?: RealtimeLogConfig;
  }
  export interface GetStreamingDistributionConfigRequest {
    /**
     * The streaming distribution's ID.
     */
    Id: string;
  }
  export interface GetStreamingDistributionConfigResult {
    /**
     * The streaming distribution's configuration information.
     */
    StreamingDistributionConfig?: StreamingDistributionConfig;
    /**
     * The current version of the configuration. For example: E2QWRUHAPOMQZL. 
     */
    ETag?: string;
  }
  export interface GetStreamingDistributionRequest {
    /**
     * The streaming distribution's ID.
     */
    Id: string;
  }
  export interface GetStreamingDistributionResult {
    /**
     * The streaming distribution's information.
     */
    StreamingDistribution?: StreamingDistribution;
    /**
     * The current version of the streaming distribution's information. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export type HeaderList = string[];
  export interface Headers {
    /**
     * The number of header names in the Items list.
     */
    Quantity: integer;
    /**
     * A list of HTTP header names.
     */
    Items?: HeaderList;
  }
  export type HttpVersion = "http1.1"|"http2"|string;
  export type ICPRecordalStatus = "APPROVED"|"SUSPENDED"|"PENDING"|string;
  export interface Invalidation {
    /**
     * The identifier for the invalidation request. For example: IDFDVBD632BHDS5.
     */
    Id: string;
    /**
     * The status of the invalidation request. When the invalidation batch is finished, the status is Completed.
     */
    Status: string;
    /**
     * The date and time the invalidation request was first made. 
     */
    CreateTime: timestamp;
    /**
     * The current invalidation information for the batch request. 
     */
    InvalidationBatch: InvalidationBatch;
  }
  export interface InvalidationBatch {
    /**
     * A complex type that contains information about the objects that you want to invalidate. For more information, see Specifying the Objects to Invalidate in the Amazon CloudFront Developer Guide. 
     */
    Paths: Paths;
    /**
     * A value that you specify to uniquely identify an invalidation request. CloudFront uses the value to prevent you from accidentally resubmitting an identical request. Whenever you create a new invalidation request, you must specify a new value for CallerReference and change other values in the request as applicable. One way to ensure that the value of CallerReference is unique is to use a timestamp, for example, 20120301090000. If you make a second invalidation request with the same value for CallerReference, and if the rest of the request is the same, CloudFront doesn't create a new invalidation request. Instead, CloudFront returns information about the invalidation request that you previously created with the same CallerReference. If CallerReference is a value you already sent in a previous invalidation batch request but the content of any Path is different from the original request, CloudFront returns an InvalidationBatchAlreadyExists error.
     */
    CallerReference: string;
  }
  export interface InvalidationList {
    /**
     * The value that you provided for the Marker request parameter.
     */
    Marker: string;
    /**
     * If IsTruncated is true, this element is present and contains the value that you can use for the Marker request parameter to continue listing your invalidation batches where they left off.
     */
    NextMarker?: string;
    /**
     * The value that you provided for the MaxItems request parameter.
     */
    MaxItems: integer;
    /**
     * A flag that indicates whether more invalidation batch requests remain to be listed. If your results were truncated, you can make a follow-up pagination request using the Marker request parameter to retrieve more invalidation batches in the list.
     */
    IsTruncated: boolean;
    /**
     * The number of invalidation batches that were created by the current account. 
     */
    Quantity: integer;
    /**
     * A complex type that contains one InvalidationSummary element for each invalidation batch created by the current account.
     */
    Items?: InvalidationSummaryList;
  }
  export interface InvalidationSummary {
    /**
     * The unique ID for an invalidation request.
     */
    Id: string;
    /**
     * The time that an invalidation request was created.
     */
    CreateTime: timestamp;
    /**
     * The status of an invalidation request.
     */
    Status: string;
  }
  export type InvalidationSummaryList = InvalidationSummary[];
  export type ItemSelection = "none"|"whitelist"|"all"|string;
  export interface KGKeyPairIds {
    /**
     * The identifier of the key group that contains the public keys.
     */
    KeyGroupId?: string;
    KeyPairIds?: KeyPairIds;
  }
  export type KGKeyPairIdsList = KGKeyPairIds[];
  export interface KeyGroup {
    /**
     * The identifier for the key group.
     */
    Id: string;
    /**
     * The date and time when the key group was last modified.
     */
    LastModifiedTime: timestamp;
    /**
     * The key group configuration.
     */
    KeyGroupConfig: KeyGroupConfig;
  }
  export interface KeyGroupConfig {
    /**
     * A name to identify the key group.
     */
    Name: string;
    /**
     * A list of the identifiers of the public keys in the key group.
     */
    Items: PublicKeyIdList;
    /**
     * A comment to describe the key group. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
  }
  export interface KeyGroupList {
    /**
     * If there are more items in the list than are in this response, this element is present. It contains the value that you should use in the Marker field of a subsequent request to continue listing key groups.
     */
    NextMarker?: string;
    /**
     * The maximum number of key groups requested.
     */
    MaxItems: integer;
    /**
     * The number of key groups returned in the response.
     */
    Quantity: integer;
    /**
     * A list of key groups.
     */
    Items?: KeyGroupSummaryList;
  }
  export interface KeyGroupSummary {
    /**
     * A key group.
     */
    KeyGroup: KeyGroup;
  }
  export type KeyGroupSummaryList = KeyGroupSummary[];
  export type KeyPairIdList = string[];
  export interface KeyPairIds {
    /**
     * The number of key pair identifiers in the list.
     */
    Quantity: integer;
    /**
     * A list of CloudFront key pair identifiers.
     */
    Items?: KeyPairIdList;
  }
  export interface KinesisStreamConfig {
    /**
     * The Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that CloudFront can use to send real-time log data to your Kinesis data stream. For more information the IAM role, see Real-time log configuration IAM role in the Amazon CloudFront Developer Guide.
     */
    RoleARN: string;
    /**
     * The Amazon Resource Name (ARN) of the Kinesis data stream where you are sending real-time log data.
     */
    StreamARN: string;
  }
  export type LambdaFunctionARN = string;
  export interface LambdaFunctionAssociation {
    /**
     * The ARN of the Lambda@Edge function. You must specify the ARN of a function version; you can't specify an alias or $LATEST.
     */
    LambdaFunctionARN: LambdaFunctionARN;
    /**
     * Specifies the event type that triggers a Lambda@Edge function invocation. You can specify the following values:    viewer-request: The function executes when CloudFront receives a request from a viewer and before it checks to see whether the requested object is in the edge cache.     origin-request: The function executes only when CloudFront sends a request to your origin. When the requested object is in the edge cache, the function doesn't execute.    origin-response: The function executes after CloudFront receives a response from the origin and before it caches the object in the response. When the requested object is in the edge cache, the function doesn't execute.    viewer-response: The function executes before CloudFront returns the requested object to the viewer. The function executes regardless of whether the object was already in the edge cache. If the origin returns an HTTP status code other than HTTP 200 (OK), the function doesn't execute.  
     */
    EventType: EventType;
    /**
     * A flag that allows a Lambda@Edge function to have read access to the body content. For more information, see Accessing the Request Body by Choosing the Include Body Option in the Amazon CloudFront Developer Guide.
     */
    IncludeBody?: boolean;
  }
  export type LambdaFunctionAssociationList = LambdaFunctionAssociation[];
  export interface LambdaFunctionAssociations {
    /**
     * The number of Lambda@Edge function associations for this cache behavior.
     */
    Quantity: integer;
    /**
     *  Optional: A complex type that contains LambdaFunctionAssociation items for this cache behavior. If Quantity is 0, you can omit Items.
     */
    Items?: LambdaFunctionAssociationList;
  }
  export interface ListCachePoliciesRequest {
    /**
     * A filter to return only the specified kinds of cache policies. Valid values are:    managed – Returns only the managed policies created by Amazon Web Services.    custom – Returns only the custom policies created in your account.  
     */
    Type?: CachePolicyType;
    /**
     * Use this field when paginating results to indicate where to begin in your list of cache policies. The response includes cache policies in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of cache policies that you want in the response.
     */
    MaxItems?: string;
  }
  export interface ListCachePoliciesResult {
    /**
     * A list of cache policies.
     */
    CachePolicyList?: CachePolicyList;
  }
  export interface ListCloudFrontOriginAccessIdentitiesRequest {
    /**
     * Use this when paginating results to indicate where to begin in your list of origin access identities. The results include identities in the list that occur after the marker. To get the next page of results, set the Marker to the value of the NextMarker from the current page's response (which is also the ID of the last identity on that page).
     */
    Marker?: string;
    /**
     * The maximum number of origin access identities you want in the response body. 
     */
    MaxItems?: string;
  }
  export interface ListCloudFrontOriginAccessIdentitiesResult {
    /**
     * The CloudFrontOriginAccessIdentityList type. 
     */
    CloudFrontOriginAccessIdentityList?: CloudFrontOriginAccessIdentityList;
  }
  export interface ListConflictingAliasesRequest {
    /**
     * The ID of a distribution in your account that has an attached SSL/TLS certificate that includes the provided alias.
     */
    DistributionId: distributionIdString;
    /**
     * The alias (also called a CNAME) to search for conflicting aliases.
     */
    Alias: aliasString;
    /**
     * Use this field when paginating results to indicate where to begin in the list of conflicting aliases. The response includes conflicting aliases in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of conflicting aliases that you want in the response.
     */
    MaxItems?: listConflictingAliasesMaxItemsInteger;
  }
  export interface ListConflictingAliasesResult {
    /**
     * A list of conflicting aliases.
     */
    ConflictingAliasesList?: ConflictingAliasesList;
  }
  export interface ListDistributionsByCachePolicyIdRequest {
    /**
     * Use this field when paginating results to indicate where to begin in your list of distribution IDs. The response includes distribution IDs in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of distribution IDs that you want in the response.
     */
    MaxItems?: string;
    /**
     * The ID of the cache policy whose associated distribution IDs you want to list.
     */
    CachePolicyId: string;
  }
  export interface ListDistributionsByCachePolicyIdResult {
    /**
     * A list of distribution IDs.
     */
    DistributionIdList?: DistributionIdList;
  }
  export interface ListDistributionsByKeyGroupRequest {
    /**
     * Use this field when paginating results to indicate where to begin in your list of distribution IDs. The response includes distribution IDs in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of distribution IDs that you want in the response.
     */
    MaxItems?: string;
    /**
     * The ID of the key group whose associated distribution IDs you are listing.
     */
    KeyGroupId: string;
  }
  export interface ListDistributionsByKeyGroupResult {
    DistributionIdList?: DistributionIdList;
  }
  export interface ListDistributionsByOriginRequestPolicyIdRequest {
    /**
     * Use this field when paginating results to indicate where to begin in your list of distribution IDs. The response includes distribution IDs in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of distribution IDs that you want in the response.
     */
    MaxItems?: string;
    /**
     * The ID of the origin request policy whose associated distribution IDs you want to list.
     */
    OriginRequestPolicyId: string;
  }
  export interface ListDistributionsByOriginRequestPolicyIdResult {
    /**
     * A list of distribution IDs.
     */
    DistributionIdList?: DistributionIdList;
  }
  export interface ListDistributionsByRealtimeLogConfigRequest {
    /**
     * Use this field when paginating results to indicate where to begin in your list of distributions. The response includes distributions in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of distributions that you want in the response.
     */
    MaxItems?: string;
    /**
     * The name of the real-time log configuration whose associated distributions you want to list.
     */
    RealtimeLogConfigName?: string;
    /**
     * The Amazon Resource Name (ARN) of the real-time log configuration whose associated distributions you want to list.
     */
    RealtimeLogConfigArn?: string;
  }
  export interface ListDistributionsByRealtimeLogConfigResult {
    DistributionList?: DistributionList;
  }
  export interface ListDistributionsByWebACLIdRequest {
    /**
     * Use Marker and MaxItems to control pagination of results. If you have more than MaxItems distributions that satisfy the request, the response includes a NextMarker element. To get the next page of results, submit another request. For the value of Marker, specify the value of NextMarker from the last response. (For the first request, omit Marker.) 
     */
    Marker?: string;
    /**
     * The maximum number of distributions that you want CloudFront to return in the response body. The maximum and default values are both 100.
     */
    MaxItems?: string;
    /**
     * The ID of the WAF web ACL that you want to list the associated distributions. If you specify "null" for the ID, the request returns a list of the distributions that aren't associated with a web ACL.
     */
    WebACLId: string;
  }
  export interface ListDistributionsByWebACLIdResult {
    /**
     * The DistributionList type. 
     */
    DistributionList?: DistributionList;
  }
  export interface ListDistributionsRequest {
    /**
     * Use this when paginating results to indicate where to begin in your list of distributions. The results include distributions in the list that occur after the marker. To get the next page of results, set the Marker to the value of the NextMarker from the current page's response (which is also the ID of the last distribution on that page).
     */
    Marker?: string;
    /**
     * The maximum number of distributions you want in the response body.
     */
    MaxItems?: string;
  }
  export interface ListDistributionsResult {
    /**
     * The DistributionList type. 
     */
    DistributionList?: DistributionList;
  }
  export interface ListFieldLevelEncryptionConfigsRequest {
    /**
     * Use this when paginating results to indicate where to begin in your list of configurations. The results include configurations in the list that occur after the marker. To get the next page of results, set the Marker to the value of the NextMarker from the current page's response (which is also the ID of the last configuration on that page). 
     */
    Marker?: string;
    /**
     * The maximum number of field-level encryption configurations you want in the response body. 
     */
    MaxItems?: string;
  }
  export interface ListFieldLevelEncryptionConfigsResult {
    /**
     * Returns a list of all field-level encryption configurations that have been created in CloudFront for this account.
     */
    FieldLevelEncryptionList?: FieldLevelEncryptionList;
  }
  export interface ListFieldLevelEncryptionProfilesRequest {
    /**
     * Use this when paginating results to indicate where to begin in your list of profiles. The results include profiles in the list that occur after the marker. To get the next page of results, set the Marker to the value of the NextMarker from the current page's response (which is also the ID of the last profile on that page). 
     */
    Marker?: string;
    /**
     * The maximum number of field-level encryption profiles you want in the response body. 
     */
    MaxItems?: string;
  }
  export interface ListFieldLevelEncryptionProfilesResult {
    /**
     * Returns a list of the field-level encryption profiles that have been created in CloudFront for this account.
     */
    FieldLevelEncryptionProfileList?: FieldLevelEncryptionProfileList;
  }
  export interface ListFunctionsRequest {
    /**
     * Use this field when paginating results to indicate where to begin in your list of functions. The response includes functions in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of functions that you want in the response.
     */
    MaxItems?: string;
    /**
     * An optional filter to return only the functions that are in the specified stage, either DEVELOPMENT or LIVE.
     */
    Stage?: FunctionStage;
  }
  export interface ListFunctionsResult {
    /**
     * A list of CloudFront functions.
     */
    FunctionList?: FunctionList;
  }
  export interface ListInvalidationsRequest {
    /**
     * The distribution's ID.
     */
    DistributionId: string;
    /**
     * Use this parameter when paginating results to indicate where to begin in your list of invalidation batches. Because the results are returned in decreasing order from most recent to oldest, the most recent results are on the first page, the second page will contain earlier results, and so on. To get the next page of results, set Marker to the value of the NextMarker from the current page's response. This value is the same as the ID of the last invalidation batch on that page. 
     */
    Marker?: string;
    /**
     * The maximum number of invalidation batches that you want in the response body.
     */
    MaxItems?: string;
  }
  export interface ListInvalidationsResult {
    /**
     * Information about invalidation batches. 
     */
    InvalidationList?: InvalidationList;
  }
  export interface ListKeyGroupsRequest {
    /**
     * Use this field when paginating results to indicate where to begin in your list of key groups. The response includes key groups in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of key groups that you want in the response.
     */
    MaxItems?: string;
  }
  export interface ListKeyGroupsResult {
    /**
     * A list of key groups.
     */
    KeyGroupList?: KeyGroupList;
  }
  export interface ListOriginRequestPoliciesRequest {
    /**
     * A filter to return only the specified kinds of origin request policies. Valid values are:    managed – Returns only the managed policies created by Amazon Web Services.    custom – Returns only the custom policies created in your account.  
     */
    Type?: OriginRequestPolicyType;
    /**
     * Use this field when paginating results to indicate where to begin in your list of origin request policies. The response includes origin request policies in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
    /**
     * The maximum number of origin request policies that you want in the response.
     */
    MaxItems?: string;
  }
  export interface ListOriginRequestPoliciesResult {
    /**
     * A list of origin request policies.
     */
    OriginRequestPolicyList?: OriginRequestPolicyList;
  }
  export interface ListPublicKeysRequest {
    /**
     * Use this when paginating results to indicate where to begin in your list of public keys. The results include public keys in the list that occur after the marker. To get the next page of results, set the Marker to the value of the NextMarker from the current page's response (which is also the ID of the last public key on that page). 
     */
    Marker?: string;
    /**
     * The maximum number of public keys you want in the response body. 
     */
    MaxItems?: string;
  }
  export interface ListPublicKeysResult {
    /**
     * Returns a list of all public keys that have been added to CloudFront for this account.
     */
    PublicKeyList?: PublicKeyList;
  }
  export interface ListRealtimeLogConfigsRequest {
    /**
     * The maximum number of real-time log configurations that you want in the response.
     */
    MaxItems?: string;
    /**
     * Use this field when paginating results to indicate where to begin in your list of real-time log configurations. The response includes real-time log configurations in the list that occur after the marker. To get the next page of the list, set this field’s value to the value of NextMarker from the current page’s response.
     */
    Marker?: string;
  }
  export interface ListRealtimeLogConfigsResult {
    /**
     * A list of real-time log configurations.
     */
    RealtimeLogConfigs?: RealtimeLogConfigs;
  }
  export interface ListStreamingDistributionsRequest {
    /**
     * The value that you provided for the Marker request parameter.
     */
    Marker?: string;
    /**
     * The value that you provided for the MaxItems request parameter.
     */
    MaxItems?: string;
  }
  export interface ListStreamingDistributionsResult {
    /**
     * The StreamingDistributionList type. 
     */
    StreamingDistributionList?: StreamingDistributionList;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  An ARN of a CloudFront resource.
     */
    Resource: ResourceARN;
  }
  export interface ListTagsForResourceResult {
    /**
     *  A complex type that contains zero or more Tag elements.
     */
    Tags: Tags;
  }
  export type LocationList = string[];
  export interface LoggingConfig {
    /**
     * Specifies whether you want CloudFront to save access logs to an Amazon S3 bucket. If you don't want to enable logging when you create a distribution or if you want to disable logging for an existing distribution, specify false for Enabled, and specify empty Bucket and Prefix elements. If you specify false for Enabled but you specify values for Bucket, prefix, and IncludeCookies, the values are automatically deleted.
     */
    Enabled: boolean;
    /**
     * Specifies whether you want CloudFront to include cookies in access logs, specify true for IncludeCookies. If you choose to include cookies in logs, CloudFront logs all cookies regardless of how you configure the cache behaviors for this distribution. If you don't want to include cookies when you create a distribution or if you want to disable include cookies for an existing distribution, specify false for IncludeCookies.
     */
    IncludeCookies: boolean;
    /**
     * The Amazon S3 bucket to store the access logs in, for example, myawslogbucket.s3.amazonaws.com.
     */
    Bucket: string;
    /**
     * An optional string that you want CloudFront to prefix to the access log filenames for this distribution, for example, myprefix/. If you want to enable logging, but you don't want to specify a prefix, you still must include an empty Prefix element in the Logging element.
     */
    Prefix: string;
  }
  export type Method = "GET"|"HEAD"|"POST"|"PUT"|"PATCH"|"OPTIONS"|"DELETE"|string;
  export type MethodsList = Method[];
  export type MinimumProtocolVersion = "SSLv3"|"TLSv1"|"TLSv1_2016"|"TLSv1.1_2016"|"TLSv1.2_2018"|"TLSv1.2_2019"|"TLSv1.2_2021"|string;
  export interface MonitoringSubscription {
    /**
     * A subscription configuration for additional CloudWatch metrics.
     */
    RealtimeMetricsSubscriptionConfig?: RealtimeMetricsSubscriptionConfig;
  }
  export interface Origin {
    /**
     * A unique identifier for the origin. This value must be unique within the distribution. Use this value to specify the TargetOriginId in a CacheBehavior or DefaultCacheBehavior.
     */
    Id: string;
    /**
     * The domain name for the origin. For more information, see Origin Domain Name in the Amazon CloudFront Developer Guide.
     */
    DomainName: string;
    /**
     * An optional path that CloudFront appends to the origin domain name when CloudFront requests content from the origin. For more information, see Origin Path in the Amazon CloudFront Developer Guide.
     */
    OriginPath?: string;
    /**
     * A list of HTTP header names and values that CloudFront adds to the requests that it sends to the origin. For more information, see Adding Custom Headers to Origin Requests in the Amazon CloudFront Developer Guide.
     */
    CustomHeaders?: CustomHeaders;
    /**
     * Use this type to specify an origin that is an Amazon S3 bucket that is not configured with static website hosting. To specify any other type of origin, including an Amazon S3 bucket that is configured with static website hosting, use the CustomOriginConfig type instead.
     */
    S3OriginConfig?: S3OriginConfig;
    /**
     * Use this type to specify an origin that is not an Amazon S3 bucket, with one exception. If the Amazon S3 bucket is configured with static website hosting, use this type. If the Amazon S3 bucket is not configured with static website hosting, use the S3OriginConfig type instead.
     */
    CustomOriginConfig?: CustomOriginConfig;
    /**
     * The number of times that CloudFront attempts to connect to the origin. The minimum number is 1, the maximum is 3, and the default (if you don’t specify otherwise) is 3. For a custom origin (including an Amazon S3 bucket that’s configured with static website hosting), this value also specifies the number of times that CloudFront attempts to get a response from the origin, in the case of an Origin Response Timeout. For more information, see Origin Connection Attempts in the Amazon CloudFront Developer Guide.
     */
    ConnectionAttempts?: integer;
    /**
     * The number of seconds that CloudFront waits when trying to establish a connection to the origin. The minimum timeout is 1 second, the maximum is 10 seconds, and the default (if you don’t specify otherwise) is 10 seconds. For more information, see Origin Connection Timeout in the Amazon CloudFront Developer Guide.
     */
    ConnectionTimeout?: integer;
    /**
     * CloudFront Origin Shield. Using Origin Shield can help reduce the load on your origin. For more information, see Using Origin Shield in the Amazon CloudFront Developer Guide.
     */
    OriginShield?: OriginShield;
  }
  export interface OriginCustomHeader {
    /**
     * The name of a header that you want CloudFront to send to your origin. For more information, see Adding Custom Headers to Origin Requests in the  Amazon CloudFront Developer Guide.
     */
    HeaderName: string;
    /**
     * The value for the header that you specified in the HeaderName field.
     */
    HeaderValue: string;
  }
  export type OriginCustomHeadersList = OriginCustomHeader[];
  export interface OriginGroup {
    /**
     * The origin group's ID.
     */
    Id: string;
    /**
     * A complex type that contains information about the failover criteria for an origin group.
     */
    FailoverCriteria: OriginGroupFailoverCriteria;
    /**
     * A complex type that contains information about the origins in an origin group.
     */
    Members: OriginGroupMembers;
  }
  export interface OriginGroupFailoverCriteria {
    /**
     * The status codes that, when returned from the primary origin, will trigger CloudFront to failover to the second origin.
     */
    StatusCodes: StatusCodes;
  }
  export type OriginGroupList = OriginGroup[];
  export interface OriginGroupMember {
    /**
     * The ID for an origin in an origin group.
     */
    OriginId: string;
  }
  export type OriginGroupMemberList = OriginGroupMember[];
  export interface OriginGroupMembers {
    /**
     * The number of origins in an origin group.
     */
    Quantity: integer;
    /**
     * Items (origins) in an origin group.
     */
    Items: OriginGroupMemberList;
  }
  export interface OriginGroups {
    /**
     * The number of origin groups.
     */
    Quantity: integer;
    /**
     * The items (origin groups) in a distribution.
     */
    Items?: OriginGroupList;
  }
  export type OriginList = Origin[];
  export type OriginProtocolPolicy = "http-only"|"match-viewer"|"https-only"|string;
  export interface OriginRequestPolicy {
    /**
     * The unique identifier for the origin request policy.
     */
    Id: string;
    /**
     * The date and time when the origin request policy was last modified.
     */
    LastModifiedTime: timestamp;
    /**
     * The origin request policy configuration.
     */
    OriginRequestPolicyConfig: OriginRequestPolicyConfig;
  }
  export interface OriginRequestPolicyConfig {
    /**
     * A comment to describe the origin request policy. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
    /**
     * A unique name to identify the origin request policy.
     */
    Name: string;
    /**
     * The HTTP headers to include in origin requests. These can include headers from viewer requests and additional headers added by CloudFront.
     */
    HeadersConfig: OriginRequestPolicyHeadersConfig;
    /**
     * The cookies from viewer requests to include in origin requests.
     */
    CookiesConfig: OriginRequestPolicyCookiesConfig;
    /**
     * The URL query strings from viewer requests to include in origin requests.
     */
    QueryStringsConfig: OriginRequestPolicyQueryStringsConfig;
  }
  export type OriginRequestPolicyCookieBehavior = "none"|"whitelist"|"all"|string;
  export interface OriginRequestPolicyCookiesConfig {
    /**
     * Determines whether cookies in viewer requests are included in requests that CloudFront sends to the origin. Valid values are:    none – Cookies in viewer requests are not included in requests that CloudFront sends to the origin. Even when this field is set to none, any cookies that are listed in a CachePolicy are included in origin requests.    whitelist – The cookies in viewer requests that are listed in the CookieNames type are included in requests that CloudFront sends to the origin.    all – All cookies in viewer requests are included in requests that CloudFront sends to the origin.  
     */
    CookieBehavior: OriginRequestPolicyCookieBehavior;
    Cookies?: CookieNames;
  }
  export type OriginRequestPolicyHeaderBehavior = "none"|"whitelist"|"allViewer"|"allViewerAndWhitelistCloudFront"|string;
  export interface OriginRequestPolicyHeadersConfig {
    /**
     * Determines whether any HTTP headers are included in requests that CloudFront sends to the origin. Valid values are:    none – HTTP headers are not included in requests that CloudFront sends to the origin. Even when this field is set to none, any headers that are listed in a CachePolicy are included in origin requests.    whitelist – The HTTP headers that are listed in the Headers type are included in requests that CloudFront sends to the origin.    allViewer – All HTTP headers in viewer requests are included in requests that CloudFront sends to the origin.    allViewerAndWhitelistCloudFront – All HTTP headers in viewer requests and the additional CloudFront headers that are listed in the Headers type are included in requests that CloudFront sends to the origin. The additional headers are added by CloudFront.  
     */
    HeaderBehavior: OriginRequestPolicyHeaderBehavior;
    Headers?: Headers;
  }
  export interface OriginRequestPolicyList {
    /**
     * If there are more items in the list than are in this response, this element is present. It contains the value that you should use in the Marker field of a subsequent request to continue listing origin request policies where you left off.
     */
    NextMarker?: string;
    /**
     * The maximum number of origin request policies requested.
     */
    MaxItems: integer;
    /**
     * The total number of origin request policies returned in the response.
     */
    Quantity: integer;
    /**
     * Contains the origin request policies in the list.
     */
    Items?: OriginRequestPolicySummaryList;
  }
  export type OriginRequestPolicyQueryStringBehavior = "none"|"whitelist"|"all"|string;
  export interface OriginRequestPolicyQueryStringsConfig {
    /**
     * Determines whether any URL query strings in viewer requests are included in requests that CloudFront sends to the origin. Valid values are:    none – Query strings in viewer requests are not included in requests that CloudFront sends to the origin. Even when this field is set to none, any query strings that are listed in a CachePolicy are included in origin requests.    whitelist – The query strings in viewer requests that are listed in the QueryStringNames type are included in requests that CloudFront sends to the origin.    all – All query strings in viewer requests are included in requests that CloudFront sends to the origin.  
     */
    QueryStringBehavior: OriginRequestPolicyQueryStringBehavior;
    /**
     * Contains a list of the query strings in viewer requests that are included in requests that CloudFront sends to the origin.
     */
    QueryStrings?: QueryStringNames;
  }
  export interface OriginRequestPolicySummary {
    /**
     * The type of origin request policy, either managed (created by Amazon Web Services) or custom (created in this account).
     */
    Type: OriginRequestPolicyType;
    /**
     * The origin request policy.
     */
    OriginRequestPolicy: OriginRequestPolicy;
  }
  export type OriginRequestPolicySummaryList = OriginRequestPolicySummary[];
  export type OriginRequestPolicyType = "managed"|"custom"|string;
  export interface OriginShield {
    /**
     * A flag that specifies whether Origin Shield is enabled. When it’s enabled, CloudFront routes all requests through Origin Shield, which can help protect your origin. When it’s disabled, CloudFront might send requests directly to your origin from multiple edge locations or regional edge caches.
     */
    Enabled: boolean;
    /**
     * The Region for Origin Shield. Specify the Region that has the lowest latency to your origin. To specify a region, use the region code, not the region name. For example, specify the US East (Ohio) region as us-east-2. When you enable CloudFront Origin Shield, you must specify the Region for Origin Shield. For the list of Regions that you can specify, and for help choosing the best Region for your origin, see Choosing the Region for Origin Shield in the Amazon CloudFront Developer Guide.
     */
    OriginShieldRegion?: OriginShieldRegion;
  }
  export type OriginShieldRegion = string;
  export interface OriginSslProtocols {
    /**
     * The number of SSL/TLS protocols that you want to allow CloudFront to use when establishing an HTTPS connection with this origin. 
     */
    Quantity: integer;
    /**
     * A list that contains allowed SSL/TLS protocols for this distribution.
     */
    Items: SslProtocolsList;
  }
  export interface Origins {
    /**
     * The number of origins for this distribution.
     */
    Quantity: integer;
    /**
     * A list of origins.
     */
    Items: OriginList;
  }
  export interface ParametersInCacheKeyAndForwardedToOrigin {
    /**
     * A flag that can affect whether the Accept-Encoding HTTP header is included in the cache key and included in requests that CloudFront sends to the origin. This field is related to the EnableAcceptEncodingBrotli field. If one or both of these fields is true and the viewer request includes the Accept-Encoding header, then CloudFront does the following:   Normalizes the value of the viewer’s Accept-Encoding header   Includes the normalized header in the cache key   Includes the normalized header in the request to the origin, if a request is necessary   For more information, see Compression support in the Amazon CloudFront Developer Guide. If you set this value to true, and this cache behavior also has an origin request policy attached, do not include the Accept-Encoding header in the origin request policy. CloudFront always includes the Accept-Encoding header in origin requests when the value of this field is true, so including this header in an origin request policy has no effect. If both of these fields are false, then CloudFront treats the Accept-Encoding header the same as any other HTTP header in the viewer request. By default, it’s not included in the cache key and it’s not included in origin requests. In this case, you can manually add Accept-Encoding to the headers whitelist like any other HTTP header.
     */
    EnableAcceptEncodingGzip: boolean;
    /**
     * A flag that can affect whether the Accept-Encoding HTTP header is included in the cache key and included in requests that CloudFront sends to the origin. This field is related to the EnableAcceptEncodingGzip field. If one or both of these fields is true and the viewer request includes the Accept-Encoding header, then CloudFront does the following:   Normalizes the value of the viewer’s Accept-Encoding header   Includes the normalized header in the cache key   Includes the normalized header in the request to the origin, if a request is necessary   For more information, see Compression support in the Amazon CloudFront Developer Guide. If you set this value to true, and this cache behavior also has an origin request policy attached, do not include the Accept-Encoding header in the origin request policy. CloudFront always includes the Accept-Encoding header in origin requests when the value of this field is true, so including this header in an origin request policy has no effect. If both of these fields are false, then CloudFront treats the Accept-Encoding header the same as any other HTTP header in the viewer request. By default, it’s not included in the cache key and it’s not included in origin requests. In this case, you can manually add Accept-Encoding to the headers whitelist like any other HTTP header.
     */
    EnableAcceptEncodingBrotli?: boolean;
    /**
     * An object that determines whether any HTTP headers (and if so, which headers) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     */
    HeadersConfig: CachePolicyHeadersConfig;
    /**
     * An object that determines whether any cookies in viewer requests (and if so, which cookies) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     */
    CookiesConfig: CachePolicyCookiesConfig;
    /**
     * An object that determines whether any URL query strings in viewer requests (and if so, which query strings) are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     */
    QueryStringsConfig: CachePolicyQueryStringsConfig;
  }
  export type PathList = string[];
  export interface Paths {
    /**
     * The number of invalidation paths specified for the objects that you want to invalidate.
     */
    Quantity: integer;
    /**
     * A complex type that contains a list of the paths that you want to invalidate.
     */
    Items?: PathList;
  }
  export type PriceClass = "PriceClass_100"|"PriceClass_200"|"PriceClass_All"|string;
  export interface PublicKey {
    /**
     * The identifier of the public key.
     */
    Id: string;
    /**
     * The date and time when the public key was uploaded.
     */
    CreatedTime: timestamp;
    /**
     * Configuration information about a public key that you can use with signed URLs and signed cookies, or with field-level encryption.
     */
    PublicKeyConfig: PublicKeyConfig;
  }
  export interface PublicKeyConfig {
    /**
     * A string included in the request to help make sure that the request can’t be replayed.
     */
    CallerReference: string;
    /**
     * A name to help identify the public key.
     */
    Name: string;
    /**
     * The public key that you can use with signed URLs and signed cookies, or with field-level encryption.
     */
    EncodedKey: string;
    /**
     * A comment to describe the public key. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
  }
  export type PublicKeyIdList = string[];
  export interface PublicKeyList {
    /**
     * If there are more elements to be listed, this element is present and contains the value that you can use for the Marker request parameter to continue listing your public keys where you left off.
     */
    NextMarker?: string;
    /**
     * The maximum number of public keys you want in the response.
     */
    MaxItems: integer;
    /**
     * The number of public keys in the list.
     */
    Quantity: integer;
    /**
     * A list of public keys.
     */
    Items?: PublicKeySummaryList;
  }
  export interface PublicKeySummary {
    /**
     * The identifier of the public key.
     */
    Id: string;
    /**
     * A name to help identify the public key.
     */
    Name: string;
    /**
     * The date and time when the public key was uploaded.
     */
    CreatedTime: timestamp;
    /**
     * The public key.
     */
    EncodedKey: string;
    /**
     * A comment to describe the public key. The comment cannot be longer than 128 characters.
     */
    Comment?: string;
  }
  export type PublicKeySummaryList = PublicKeySummary[];
  export interface PublishFunctionRequest {
    /**
     * The name of the function that you are publishing.
     */
    Name: string;
    /**
     * The current version (ETag value) of the function that you are publishing, which you can get using DescribeFunction.
     */
    IfMatch: string;
  }
  export interface PublishFunctionResult {
    /**
     * Contains configuration information and metadata about a CloudFront function.
     */
    FunctionSummary?: FunctionSummary;
  }
  export interface QueryArgProfile {
    /**
     * Query argument for field-level encryption query argument-profile mapping.
     */
    QueryArg: string;
    /**
     * ID of profile to use for field-level encryption query argument-profile mapping
     */
    ProfileId: string;
  }
  export interface QueryArgProfileConfig {
    /**
     * Flag to set if you want a request to be forwarded to the origin even if the profile specified by the field-level encryption query argument, fle-profile, is unknown.
     */
    ForwardWhenQueryArgProfileIsUnknown: boolean;
    /**
     * Profiles specified for query argument-profile mapping for field-level encryption.
     */
    QueryArgProfiles?: QueryArgProfiles;
  }
  export type QueryArgProfileList = QueryArgProfile[];
  export interface QueryArgProfiles {
    /**
     * Number of profiles for query argument-profile mapping for field-level encryption.
     */
    Quantity: integer;
    /**
     * Number of items for query argument-profile mapping for field-level encryption.
     */
    Items?: QueryArgProfileList;
  }
  export interface QueryStringCacheKeys {
    /**
     * The number of whitelisted query string parameters for a cache behavior.
     */
    Quantity: integer;
    /**
     * A list that contains the query string parameters that you want CloudFront to use as a basis for caching for a cache behavior. If Quantity is 0, you can omit Items. 
     */
    Items?: QueryStringCacheKeysList;
  }
  export type QueryStringCacheKeysList = string[];
  export interface QueryStringNames {
    /**
     * The number of query string names in the Items list.
     */
    Quantity: integer;
    /**
     * A list of query string names.
     */
    Items?: QueryStringNamesList;
  }
  export type QueryStringNamesList = string[];
  export interface RealtimeLogConfig {
    /**
     * The Amazon Resource Name (ARN) of this real-time log configuration.
     */
    ARN: string;
    /**
     * The unique name of this real-time log configuration.
     */
    Name: string;
    /**
     * The sampling rate for this real-time log configuration. The sampling rate determines the percentage of viewer requests that are represented in the real-time log data. The sampling rate is an integer between 1 and 100, inclusive.
     */
    SamplingRate: long;
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data for this real-time log configuration.
     */
    EndPoints: EndPointList;
    /**
     * A list of fields that are included in each real-time log record. In an API response, the fields are provided in the same order in which they are sent to the Amazon Kinesis data stream. For more information about fields, see Real-time log configuration fields in the Amazon CloudFront Developer Guide.
     */
    Fields: FieldList;
  }
  export type RealtimeLogConfigList = RealtimeLogConfig[];
  export interface RealtimeLogConfigs {
    /**
     * The maximum number of real-time log configurations requested.
     */
    MaxItems: integer;
    /**
     * Contains the list of real-time log configurations.
     */
    Items?: RealtimeLogConfigList;
    /**
     * A flag that indicates whether there are more real-time log configurations than are contained in this list.
     */
    IsTruncated: boolean;
    /**
     * This parameter indicates where this list of real-time log configurations begins. This list includes real-time log configurations that occur after the marker.
     */
    Marker: string;
    /**
     * If there are more items in the list than are in this response, this element is present. It contains the value that you should use in the Marker field of a subsequent request to continue listing real-time log configurations where you left off. 
     */
    NextMarker?: string;
  }
  export interface RealtimeMetricsSubscriptionConfig {
    /**
     * A flag that indicates whether additional CloudWatch metrics are enabled for a given CloudFront distribution.
     */
    RealtimeMetricsSubscriptionStatus: RealtimeMetricsSubscriptionStatus;
  }
  export type RealtimeMetricsSubscriptionStatus = "Enabled"|"Disabled"|string;
  export type ResourceARN = string;
  export interface Restrictions {
    /**
     * A complex type that controls the countries in which your content is distributed. CloudFront determines the location of your users using MaxMind GeoIP databases.
     */
    GeoRestriction: GeoRestriction;
  }
  export interface S3Origin {
    /**
     * The DNS name of the Amazon S3 origin. 
     */
    DomainName: string;
    /**
     * The CloudFront origin access identity to associate with the distribution. Use an origin access identity to configure the distribution so that end users can only access objects in an Amazon S3 bucket through CloudFront. If you want end users to be able to access objects using either the CloudFront URL or the Amazon S3 URL, specify an empty OriginAccessIdentity element. To delete the origin access identity from an existing distribution, update the distribution configuration and include an empty OriginAccessIdentity element. To replace the origin access identity, update the distribution configuration and specify the new origin access identity. For more information, see Using an Origin Access Identity to Restrict Access to Your Amazon S3 Content in the  Amazon CloudFront Developer Guide.
     */
    OriginAccessIdentity: string;
  }
  export interface S3OriginConfig {
    /**
     * The CloudFront origin access identity to associate with the origin. Use an origin access identity to configure the origin so that viewers can only access objects in an Amazon S3 bucket through CloudFront. The format of the value is: origin-access-identity/cloudfront/ID-of-origin-access-identity  where  ID-of-origin-access-identity  is the value that CloudFront returned in the ID element when you created the origin access identity. If you want viewers to be able to access objects using either the CloudFront URL or the Amazon S3 URL, specify an empty OriginAccessIdentity element. To delete the origin access identity from an existing distribution, update the distribution configuration and include an empty OriginAccessIdentity element. To replace the origin access identity, update the distribution configuration and specify the new origin access identity. For more information about the origin access identity, see Serving Private Content through CloudFront in the Amazon CloudFront Developer Guide.
     */
    OriginAccessIdentity: string;
  }
  export type SSLSupportMethod = "sni-only"|"vip"|"static-ip"|string;
  export interface _Signer {
    /**
     * An account number that contains active CloudFront key pairs that CloudFront can use to verify the signatures of signed URLs and signed cookies. If the account that owns the key pairs is the same account that owns the CloudFront distribution, the value of this field is self.
     */
    AwsAccountNumber?: string;
    /**
     * A list of CloudFront key pair identifiers.
     */
    KeyPairIds?: KeyPairIds;
  }
  export type SignerList = _Signer[];
  export type SslProtocol = "SSLv3"|"TLSv1"|"TLSv1.1"|"TLSv1.2"|string;
  export type SslProtocolsList = SslProtocol[];
  export type StatusCodeList = integer[];
  export interface StatusCodes {
    /**
     * The number of status codes.
     */
    Quantity: integer;
    /**
     * The items (status codes) for an origin group.
     */
    Items: StatusCodeList;
  }
  export interface StreamingDistribution {
    /**
     * The identifier for the RTMP distribution. For example: EGTXBD79EXAMPLE.
     */
    Id: string;
    /**
     * The ARN (Amazon Resource Name) for the distribution. For example: arn:aws:cloudfront::123456789012:distribution/EDFDVBD632BHDS5, where 123456789012 is your account ID.
     */
    ARN: string;
    /**
     * The current status of the RTMP distribution. When the status is Deployed, the distribution's information is propagated to all CloudFront edge locations.
     */
    Status: string;
    /**
     * The date and time that the distribution was last modified. 
     */
    LastModifiedTime?: timestamp;
    /**
     * The domain name that corresponds to the streaming distribution, for example, s5c39gqb8ow64r.cloudfront.net. 
     */
    DomainName: string;
    /**
     * A complex type that lists the accounts, if any, that you included in the TrustedSigners complex type for this distribution. These are the accounts that you want to allow to create signed URLs for private content. The Signer complex type lists the account number of the trusted signer or self if the signer is the account that created the distribution. The Signer element also includes the IDs of any active CloudFront key pairs that are associated with the trusted signer's account. If no KeyPairId element appears for a Signer, that signer can't create signed URLs. For more information, see Serving Private Content through CloudFront in the Amazon CloudFront Developer Guide. 
     */
    ActiveTrustedSigners: ActiveTrustedSigners;
    /**
     * The current configuration information for the RTMP distribution.
     */
    StreamingDistributionConfig: StreamingDistributionConfig;
  }
  export interface StreamingDistributionConfig {
    /**
     * A unique value (for example, a date-time stamp) that ensures that the request can't be replayed. If the value of CallerReference is new (regardless of the content of the StreamingDistributionConfig object), CloudFront creates a new distribution. If CallerReference is a value that you already sent in a previous request to create a distribution, CloudFront returns a DistributionAlreadyExists error.
     */
    CallerReference: string;
    /**
     * A complex type that contains information about the Amazon S3 bucket from which you want CloudFront to get your media files for distribution. 
     */
    S3Origin: S3Origin;
    /**
     * A complex type that contains information about CNAMEs (alternate domain names), if any, for this streaming distribution. 
     */
    Aliases?: Aliases;
    /**
     * Any comments you want to include about the streaming distribution. 
     */
    Comment: string;
    /**
     * A complex type that controls whether access logs are written for the streaming distribution. 
     */
    Logging?: StreamingLoggingConfig;
    /**
     * A complex type that specifies any accounts that you want to permit to create signed URLs for private content. If you want the distribution to use signed URLs, include this element; if you want the distribution to use public URLs, remove this element. For more information, see Serving Private Content through CloudFront in the Amazon CloudFront Developer Guide. 
     */
    TrustedSigners: TrustedSigners;
    /**
     * A complex type that contains information about price class for this streaming distribution. 
     */
    PriceClass?: PriceClass;
    /**
     * Whether the streaming distribution is enabled to accept user requests for content.
     */
    Enabled: boolean;
  }
  export interface StreamingDistributionConfigWithTags {
    /**
     * A streaming distribution Configuration.
     */
    StreamingDistributionConfig: StreamingDistributionConfig;
    /**
     * A complex type that contains zero or more Tag elements.
     */
    Tags: Tags;
  }
  export interface StreamingDistributionList {
    /**
     * The value you provided for the Marker request parameter. 
     */
    Marker: string;
    /**
     * If IsTruncated is true, this element is present and contains the value you can use for the Marker request parameter to continue listing your RTMP distributions where they left off. 
     */
    NextMarker?: string;
    /**
     * The value you provided for the MaxItems request parameter. 
     */
    MaxItems: integer;
    /**
     * A flag that indicates whether more streaming distributions remain to be listed. If your results were truncated, you can make a follow-up pagination request using the Marker request parameter to retrieve more distributions in the list. 
     */
    IsTruncated: boolean;
    /**
     * The number of streaming distributions that were created by the current account. 
     */
    Quantity: integer;
    /**
     * A complex type that contains one StreamingDistributionSummary element for each distribution that was created by the current account.
     */
    Items?: StreamingDistributionSummaryList;
  }
  export interface StreamingDistributionSummary {
    /**
     * The identifier for the distribution, for example, EDFDVBD632BHDS5.
     */
    Id: string;
    /**
     *  The ARN (Amazon Resource Name) for the streaming distribution. For example: arn:aws:cloudfront::123456789012:streaming-distribution/EDFDVBD632BHDS5, where 123456789012 is your account ID.
     */
    ARN: string;
    /**
     *  Indicates the current status of the distribution. When the status is Deployed, the distribution's information is fully propagated throughout the Amazon CloudFront system.
     */
    Status: string;
    /**
     * The date and time the distribution was last modified.
     */
    LastModifiedTime: timestamp;
    /**
     * The domain name corresponding to the distribution, for example, d111111abcdef8.cloudfront.net.
     */
    DomainName: string;
    /**
     * A complex type that contains information about the Amazon S3 bucket from which you want CloudFront to get your media files for distribution.
     */
    S3Origin: S3Origin;
    /**
     * A complex type that contains information about CNAMEs (alternate domain names), if any, for this streaming distribution.
     */
    Aliases: Aliases;
    /**
     * A complex type that specifies the accounts, if any, that you want to allow to create signed URLs for private content. If you want to require signed URLs in requests for objects in the target origin that match the PathPattern for this cache behavior, specify true for Enabled, and specify the applicable values for Quantity and Items.If you don't want to require signed URLs in requests for objects that match PathPattern, specify false for Enabled and 0 for Quantity. Omit Items. To add, change, or remove one or more trusted signers, change Enabled to true (if it's currently false), change Quantity as applicable, and specify all of the trusted signers that you want to include in the updated distribution. For more information, see Serving Private Content through CloudFront in the Amazon CloudFront Developer Guide. 
     */
    TrustedSigners: TrustedSigners;
    /**
     * The comment originally specified when this distribution was created.
     */
    Comment: string;
    /**
     * A complex type that contains information about price class for this streaming distribution. 
     */
    PriceClass: PriceClass;
    /**
     * Whether the distribution is enabled to accept end user requests for content.
     */
    Enabled: boolean;
  }
  export type StreamingDistributionSummaryList = StreamingDistributionSummary[];
  export interface StreamingLoggingConfig {
    /**
     * Specifies whether you want CloudFront to save access logs to an Amazon S3 bucket. If you don't want to enable logging when you create a streaming distribution or if you want to disable logging for an existing streaming distribution, specify false for Enabled, and specify empty Bucket and Prefix elements. If you specify false for Enabled but you specify values for Bucket and Prefix, the values are automatically deleted. 
     */
    Enabled: boolean;
    /**
     * The Amazon S3 bucket to store the access logs in, for example, myawslogbucket.s3.amazonaws.com.
     */
    Bucket: string;
    /**
     * An optional string that you want CloudFront to prefix to the access log filenames for this streaming distribution, for example, myprefix/. If you want to enable logging, but you don't want to specify a prefix, you still must include an empty Prefix element in the Logging element.
     */
    Prefix: string;
  }
  export interface Tag {
    /**
     *  A string that contains Tag key. The string length should be between 1 and 128 characters. Valid characters include a-z, A-Z, 0-9, space, and the special characters _ - . : / = + @.
     */
    Key: TagKey;
    /**
     *  A string that contains an optional Tag value. The string length should be between 0 and 256 characters. Valid characters include a-z, A-Z, 0-9, space, and the special characters _ - . : / = + @.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagKeys {
    /**
     *  A complex type that contains Tag key elements.
     */
    Items?: TagKeyList;
  }
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     *  An ARN of a CloudFront resource.
     */
    Resource: ResourceARN;
    /**
     *  A complex type that contains zero or more Tag elements.
     */
    Tags: Tags;
  }
  export type TagValue = string;
  export interface Tags {
    /**
     *  A complex type that contains Tag elements.
     */
    Items?: TagList;
  }
  export interface TestFunctionRequest {
    /**
     * The name of the function that you are testing.
     */
    Name: string;
    /**
     * The current version (ETag value) of the function that you are testing, which you can get using DescribeFunction.
     */
    IfMatch: string;
    /**
     * The stage of the function that you are testing, either DEVELOPMENT or LIVE.
     */
    Stage?: FunctionStage;
    /**
     * The event object to test the function with. For more information about the structure of the event object, see Testing functions in the Amazon CloudFront Developer Guide.
     */
    EventObject: FunctionEventObject;
  }
  export interface TestFunctionResult {
    /**
     * An object that represents the result of running the function with the provided event object.
     */
    TestResult?: TestResult;
  }
  export interface TestResult {
    /**
     * Contains configuration information and metadata about the CloudFront function that was tested.
     */
    FunctionSummary?: FunctionSummary;
    /**
     * The amount of time that the function took to run as a percentage of the maximum allowed time. For example, a compute utilization of 35 means that the function completed in 35% of the maximum allowed time.
     */
    ComputeUtilization?: string;
    /**
     * Contains the log lines that the function wrote (if any) when running the test.
     */
    FunctionExecutionLogs?: FunctionExecutionLogList;
    /**
     * If the result of testing the function was an error, this field contains the error message.
     */
    FunctionErrorMessage?: string;
    /**
     * The event object returned by the function. For more information about the structure of the event object, see Event object structure in the Amazon CloudFront Developer Guide.
     */
    FunctionOutput?: string;
  }
  export type TrustedKeyGroupIdList = string[];
  export interface TrustedKeyGroups {
    /**
     * This field is true if any of the key groups in the list have public keys that CloudFront can use to verify the signatures of signed URLs and signed cookies. If not, this field is false.
     */
    Enabled: boolean;
    /**
     * The number of key groups in the list.
     */
    Quantity: integer;
    /**
     * A list of key groups identifiers.
     */
    Items?: TrustedKeyGroupIdList;
  }
  export interface TrustedSigners {
    /**
     * This field is true if any of the accounts have public keys that CloudFront can use to verify the signatures of signed URLs and signed cookies. If not, this field is false.
     */
    Enabled: boolean;
    /**
     * The number of accounts in the list.
     */
    Quantity: integer;
    /**
     * A list of account identifiers.
     */
    Items?: AwsAccountNumberList;
  }
  export interface UntagResourceRequest {
    /**
     *  An ARN of a CloudFront resource.
     */
    Resource: ResourceARN;
    /**
     *  A complex type that contains zero or more Tag key elements.
     */
    TagKeys: TagKeys;
  }
  export interface UpdateCachePolicyRequest {
    /**
     * A cache policy configuration.
     */
    CachePolicyConfig: CachePolicyConfig;
    /**
     * The unique identifier for the cache policy that you are updating. The identifier is returned in a cache behavior’s CachePolicyId field in the response to GetDistributionConfig.
     */
    Id: string;
    /**
     * The version of the cache policy that you are updating. The version is returned in the cache policy’s ETag field in the response to GetCachePolicyConfig.
     */
    IfMatch?: string;
  }
  export interface UpdateCachePolicyResult {
    /**
     * A cache policy.
     */
    CachePolicy?: CachePolicy;
    /**
     * The current version of the cache policy.
     */
    ETag?: string;
  }
  export interface UpdateCloudFrontOriginAccessIdentityRequest {
    /**
     * The identity's configuration information.
     */
    CloudFrontOriginAccessIdentityConfig: CloudFrontOriginAccessIdentityConfig;
    /**
     * The identity's id.
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the identity's configuration. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface UpdateCloudFrontOriginAccessIdentityResult {
    /**
     * The origin access identity's information.
     */
    CloudFrontOriginAccessIdentity?: CloudFrontOriginAccessIdentity;
    /**
     * The current version of the configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface UpdateDistributionRequest {
    /**
     * The distribution's configuration information.
     */
    DistributionConfig: DistributionConfig;
    /**
     * The distribution's id.
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the distribution's configuration. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface UpdateDistributionResult {
    /**
     * The distribution's information.
     */
    Distribution?: Distribution;
    /**
     * The current version of the configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface UpdateFieldLevelEncryptionConfigRequest {
    /**
     * Request to update a field-level encryption configuration. 
     */
    FieldLevelEncryptionConfig: FieldLevelEncryptionConfig;
    /**
     * The ID of the configuration you want to update.
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the configuration identity to update. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface UpdateFieldLevelEncryptionConfigResult {
    /**
     * Return the results of updating the configuration.
     */
    FieldLevelEncryption?: FieldLevelEncryption;
    /**
     * The value of the ETag header that you received when updating the configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface UpdateFieldLevelEncryptionProfileRequest {
    /**
     * Request to update a field-level encryption profile. 
     */
    FieldLevelEncryptionProfileConfig: FieldLevelEncryptionProfileConfig;
    /**
     * The ID of the field-level encryption profile request. 
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the profile identity to update. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface UpdateFieldLevelEncryptionProfileResult {
    /**
     * Return the results of updating the profile.
     */
    FieldLevelEncryptionProfile?: FieldLevelEncryptionProfile;
    /**
     * The result of the field-level encryption profile request. 
     */
    ETag?: string;
  }
  export interface UpdateFunctionRequest {
    /**
     * The name of the function that you are updating.
     */
    Name: string;
    /**
     * The current version (ETag value) of the function that you are updating, which you can get using DescribeFunction.
     */
    IfMatch: string;
    /**
     * Configuration information about the function.
     */
    FunctionConfig: FunctionConfig;
    /**
     * The function code. For more information about writing a CloudFront function, see Writing function code for CloudFront Functions in the Amazon CloudFront Developer Guide.
     */
    FunctionCode: FunctionBlob;
  }
  export interface UpdateFunctionResult {
    /**
     * Contains configuration information and metadata about a CloudFront function.
     */
    FunctionSummary?: FunctionSummary;
    /**
     * The version identifier for the current version of the CloudFront function.
     */
    ETag?: string;
  }
  export interface UpdateKeyGroupRequest {
    /**
     * The key group configuration.
     */
    KeyGroupConfig: KeyGroupConfig;
    /**
     * The identifier of the key group that you are updating.
     */
    Id: string;
    /**
     * The version of the key group that you are updating. The version is the key group’s ETag value.
     */
    IfMatch?: string;
  }
  export interface UpdateKeyGroupResult {
    /**
     * The key group that was just updated.
     */
    KeyGroup?: KeyGroup;
    /**
     * The identifier for this version of the key group.
     */
    ETag?: string;
  }
  export interface UpdateOriginRequestPolicyRequest {
    /**
     * An origin request policy configuration.
     */
    OriginRequestPolicyConfig: OriginRequestPolicyConfig;
    /**
     * The unique identifier for the origin request policy that you are updating. The identifier is returned in a cache behavior’s OriginRequestPolicyId field in the response to GetDistributionConfig.
     */
    Id: string;
    /**
     * The version of the origin request policy that you are updating. The version is returned in the origin request policy’s ETag field in the response to GetOriginRequestPolicyConfig.
     */
    IfMatch?: string;
  }
  export interface UpdateOriginRequestPolicyResult {
    /**
     * An origin request policy.
     */
    OriginRequestPolicy?: OriginRequestPolicy;
    /**
     * The current version of the origin request policy.
     */
    ETag?: string;
  }
  export interface UpdatePublicKeyRequest {
    /**
     * A public key configuration.
     */
    PublicKeyConfig: PublicKeyConfig;
    /**
     * The identifier of the public key that you are updating.
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the public key to update. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface UpdatePublicKeyResult {
    /**
     * The public key.
     */
    PublicKey?: PublicKey;
    /**
     * The identifier of the current version of the public key.
     */
    ETag?: string;
  }
  export interface UpdateRealtimeLogConfigRequest {
    /**
     * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
     */
    EndPoints?: EndPointList;
    /**
     * A list of fields to include in each real-time log record. For more information about fields, see Real-time log configuration fields in the Amazon CloudFront Developer Guide.
     */
    Fields?: FieldList;
    /**
     * The name for this real-time log configuration.
     */
    Name?: string;
    /**
     * The Amazon Resource Name (ARN) for this real-time log configuration.
     */
    ARN?: string;
    /**
     * The sampling rate for this real-time log configuration. The sampling rate determines the percentage of viewer requests that are represented in the real-time log data. You must provide an integer between 1 and 100, inclusive.
     */
    SamplingRate?: long;
  }
  export interface UpdateRealtimeLogConfigResult {
    /**
     * A real-time log configuration.
     */
    RealtimeLogConfig?: RealtimeLogConfig;
  }
  export interface UpdateStreamingDistributionRequest {
    /**
     * The streaming distribution's configuration information.
     */
    StreamingDistributionConfig: StreamingDistributionConfig;
    /**
     * The streaming distribution's id.
     */
    Id: string;
    /**
     * The value of the ETag header that you received when retrieving the streaming distribution's configuration. For example: E2QWRUHAPOMQZL.
     */
    IfMatch?: string;
  }
  export interface UpdateStreamingDistributionResult {
    /**
     * The streaming distribution's information.
     */
    StreamingDistribution?: StreamingDistribution;
    /**
     * The current version of the configuration. For example: E2QWRUHAPOMQZL.
     */
    ETag?: string;
  }
  export interface ViewerCertificate {
    /**
     * If the distribution uses the CloudFront domain name such as d111111abcdef8.cloudfront.net, set this field to true. If the distribution uses Aliases (alternate domain names or CNAMEs), set this field to false and specify values for the following fields:    ACMCertificateArn or IAMCertificateId (specify a value for one, not both)    MinimumProtocolVersion     SSLSupportMethod   
     */
    CloudFrontDefaultCertificate?: boolean;
    /**
     * If the distribution uses Aliases (alternate domain names or CNAMEs) and the SSL/TLS certificate is stored in Identity and Access Management (IAM), provide the ID of the IAM certificate. If you specify an IAM certificate ID, you must also specify values for MinimumProtocolVersion and SSLSupportMethod. 
     */
    IAMCertificateId?: string;
    /**
     * If the distribution uses Aliases (alternate domain names or CNAMEs) and the SSL/TLS certificate is stored in Certificate Manager (ACM), provide the Amazon Resource Name (ARN) of the ACM certificate. CloudFront only supports ACM certificates in the US East (N. Virginia) Region (us-east-1). If you specify an ACM certificate ARN, you must also specify values for MinimumProtocolVersion and SSLSupportMethod.
     */
    ACMCertificateArn?: string;
    /**
     * If the distribution uses Aliases (alternate domain names or CNAMEs), specify which viewers the distribution accepts HTTPS connections from.    sni-only – The distribution accepts HTTPS connections from only viewers that support server name indication (SNI). This is recommended. Most browsers and clients support SNI.    vip – The distribution accepts HTTPS connections from all viewers including those that don’t support SNI. This is not recommended, and results in additional monthly charges from CloudFront.    static-ip - Do not specify this value unless your distribution has been enabled for this feature by the CloudFront team. If you have a use case that requires static IP addresses for a distribution, contact CloudFront through the Amazon Web Services Support Center.   If the distribution uses the CloudFront domain name such as d111111abcdef8.cloudfront.net, don’t set a value for this field.
     */
    SSLSupportMethod?: SSLSupportMethod;
    /**
     * If the distribution uses Aliases (alternate domain names or CNAMEs), specify the security policy that you want CloudFront to use for HTTPS connections with viewers. The security policy determines two settings:   The minimum SSL/TLS protocol that CloudFront can use to communicate with viewers.   The ciphers that CloudFront can use to encrypt the content that it returns to viewers.   For more information, see Security Policy and Supported Protocols and Ciphers Between Viewers and CloudFront in the Amazon CloudFront Developer Guide.  On the CloudFront console, this setting is called Security Policy.  When you’re using SNI only (you set SSLSupportMethod to sni-only), you must specify TLSv1 or higher. If the distribution uses the CloudFront domain name such as d111111abcdef8.cloudfront.net (you set CloudFrontDefaultCertificate to true), CloudFront automatically sets the security policy to TLSv1 regardless of the value that you set here.
     */
    MinimumProtocolVersion?: MinimumProtocolVersion;
    /**
     * This field is deprecated. Use one of the following fields instead:    ACMCertificateArn     IAMCertificateId     CloudFrontDefaultCertificate   
     */
    Certificate?: string;
    /**
     * This field is deprecated. Use one of the following fields instead:    ACMCertificateArn     IAMCertificateId     CloudFrontDefaultCertificate   
     */
    CertificateSource?: CertificateSource;
  }
  export type ViewerProtocolPolicy = "allow-all"|"https-only"|"redirect-to-https"|string;
  export type aliasString = string;
  export type distributionIdString = string;
  export type integer = number;
  export type listConflictingAliasesMaxItemsInteger = number;
  export type long = number;
  export type timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2013-05-12"|"2013-11-11"|"2014-05-31"|"2014-10-21"|"2014-11-06"|"2015-04-17"|"2015-07-27"|"2015-09-17"|"2016-01-13"|"2016-01-28"|"2016-08-01"|"2016-08-20"|"2016-09-07"|"2016-09-29"|"2016-11-25"|"2016-11-25"|"2017-03-25"|"2017-03-25"|"2017-10-30"|"2017-10-30"|"2018-06-18"|"2018-06-18"|"2018-11-05"|"2018-11-05"|"2019-03-26"|"2019-03-26"|"2020-05-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CloudFront client.
   */
  export import Types = CloudFront;
}
export = CloudFront;
