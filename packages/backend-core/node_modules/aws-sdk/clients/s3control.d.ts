import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {UseDualstackConfigOptions} from '../lib/config_use_dualstack';
interface Blob {}
declare class S3Control extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: S3Control.Types.ClientConfiguration)
  config: Config & S3Control.Types.ClientConfiguration;
  /**
   * Creates an access point and associates it with the specified bucket. For more information, see Managing Data Access with Amazon S3 Access Points in the Amazon S3 User Guide.   S3 on Outposts only supports VPC-style access points.  For more information, see  Accessing Amazon S3 on Outposts using virtual private cloud (VPC) only access points in the Amazon S3 User Guide.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section.  The following actions are related to CreateAccessPoint:    GetAccessPoint     DeleteAccessPoint     ListAccessPoints   
   */
  createAccessPoint(params: S3Control.Types.CreateAccessPointRequest, callback?: (err: AWSError, data: S3Control.Types.CreateAccessPointResult) => void): Request<S3Control.Types.CreateAccessPointResult, AWSError>;
  /**
   * Creates an access point and associates it with the specified bucket. For more information, see Managing Data Access with Amazon S3 Access Points in the Amazon S3 User Guide.   S3 on Outposts only supports VPC-style access points.  For more information, see  Accessing Amazon S3 on Outposts using virtual private cloud (VPC) only access points in the Amazon S3 User Guide.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section.  The following actions are related to CreateAccessPoint:    GetAccessPoint     DeleteAccessPoint     ListAccessPoints   
   */
  createAccessPoint(callback?: (err: AWSError, data: S3Control.Types.CreateAccessPointResult) => void): Request<S3Control.Types.CreateAccessPointResult, AWSError>;
  /**
   * Creates an Object Lambda Access Point. For more information, see Transforming objects with Object Lambda Access Points in the Amazon S3 User Guide. The following actions are related to CreateAccessPointForObjectLambda:    DeleteAccessPointForObjectLambda     GetAccessPointForObjectLambda     ListAccessPointsForObjectLambda   
   */
  createAccessPointForObjectLambda(params: S3Control.Types.CreateAccessPointForObjectLambdaRequest, callback?: (err: AWSError, data: S3Control.Types.CreateAccessPointForObjectLambdaResult) => void): Request<S3Control.Types.CreateAccessPointForObjectLambdaResult, AWSError>;
  /**
   * Creates an Object Lambda Access Point. For more information, see Transforming objects with Object Lambda Access Points in the Amazon S3 User Guide. The following actions are related to CreateAccessPointForObjectLambda:    DeleteAccessPointForObjectLambda     GetAccessPointForObjectLambda     ListAccessPointsForObjectLambda   
   */
  createAccessPointForObjectLambda(callback?: (err: AWSError, data: S3Control.Types.CreateAccessPointForObjectLambdaResult) => void): Request<S3Control.Types.CreateAccessPointForObjectLambdaResult, AWSError>;
  /**
   *  This action creates an Amazon S3 on Outposts bucket. To create an S3 bucket, see Create Bucket in the Amazon S3 API Reference.   Creates a new Outposts bucket. By creating the bucket, you become the bucket owner. To create an Outposts bucket, you must have S3 on Outposts. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. Not every string is an acceptable bucket name. For information on bucket naming restrictions, see Working with Amazon S3 Buckets. S3 on Outposts buckets support:   Tags   LifecycleConfigurations for deleting expired objects   For a complete list of restrictions and Amazon S3 feature limitations on S3 on Outposts, see  Amazon S3 on Outposts Restrictions and Limitations. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and x-amz-outpost-id in your API request, see the Examples section. The following actions are related to CreateBucket for Amazon S3 on Outposts:    PutObject     GetBucket     DeleteBucket     CreateAccessPoint     PutAccessPointPolicy   
   */
  createBucket(params: S3Control.Types.CreateBucketRequest, callback?: (err: AWSError, data: S3Control.Types.CreateBucketResult) => void): Request<S3Control.Types.CreateBucketResult, AWSError>;
  /**
   *  This action creates an Amazon S3 on Outposts bucket. To create an S3 bucket, see Create Bucket in the Amazon S3 API Reference.   Creates a new Outposts bucket. By creating the bucket, you become the bucket owner. To create an Outposts bucket, you must have S3 on Outposts. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. Not every string is an acceptable bucket name. For information on bucket naming restrictions, see Working with Amazon S3 Buckets. S3 on Outposts buckets support:   Tags   LifecycleConfigurations for deleting expired objects   For a complete list of restrictions and Amazon S3 feature limitations on S3 on Outposts, see  Amazon S3 on Outposts Restrictions and Limitations. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and x-amz-outpost-id in your API request, see the Examples section. The following actions are related to CreateBucket for Amazon S3 on Outposts:    PutObject     GetBucket     DeleteBucket     CreateAccessPoint     PutAccessPointPolicy   
   */
  createBucket(callback?: (err: AWSError, data: S3Control.Types.CreateBucketResult) => void): Request<S3Control.Types.CreateBucketResult, AWSError>;
  /**
   * You can use S3 Batch Operations to perform large-scale batch actions on Amazon S3 objects. Batch Operations can run a single action on lists of Amazon S3 objects that you specify. For more information, see S3 Batch Operations in the Amazon S3 User Guide. This action creates a S3 Batch Operations job.  Related actions include:    DescribeJob     ListJobs     UpdateJobPriority     UpdateJobStatus     JobOperation   
   */
  createJob(params: S3Control.Types.CreateJobRequest, callback?: (err: AWSError, data: S3Control.Types.CreateJobResult) => void): Request<S3Control.Types.CreateJobResult, AWSError>;
  /**
   * You can use S3 Batch Operations to perform large-scale batch actions on Amazon S3 objects. Batch Operations can run a single action on lists of Amazon S3 objects that you specify. For more information, see S3 Batch Operations in the Amazon S3 User Guide. This action creates a S3 Batch Operations job.  Related actions include:    DescribeJob     ListJobs     UpdateJobPriority     UpdateJobStatus     JobOperation   
   */
  createJob(callback?: (err: AWSError, data: S3Control.Types.CreateJobResult) => void): Request<S3Control.Types.CreateJobResult, AWSError>;
  /**
   * Creates a Multi-Region Access Point and associates it with the specified buckets. For more information about creating Multi-Region Access Points, see Creating Multi-Region Access Points in the Amazon S3 User Guide. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. This request is asynchronous, meaning that you might receive a response before the command has completed. When this request provides a response, it provides a token that you can use to monitor the status of the request with DescribeMultiRegionAccessPointOperation. The following actions are related to CreateMultiRegionAccessPoint:    DeleteMultiRegionAccessPoint     DescribeMultiRegionAccessPointOperation     GetMultiRegionAccessPoint     ListMultiRegionAccessPoints   
   */
  createMultiRegionAccessPoint(params: S3Control.Types.CreateMultiRegionAccessPointRequest, callback?: (err: AWSError, data: S3Control.Types.CreateMultiRegionAccessPointResult) => void): Request<S3Control.Types.CreateMultiRegionAccessPointResult, AWSError>;
  /**
   * Creates a Multi-Region Access Point and associates it with the specified buckets. For more information about creating Multi-Region Access Points, see Creating Multi-Region Access Points in the Amazon S3 User Guide. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. This request is asynchronous, meaning that you might receive a response before the command has completed. When this request provides a response, it provides a token that you can use to monitor the status of the request with DescribeMultiRegionAccessPointOperation. The following actions are related to CreateMultiRegionAccessPoint:    DeleteMultiRegionAccessPoint     DescribeMultiRegionAccessPointOperation     GetMultiRegionAccessPoint     ListMultiRegionAccessPoints   
   */
  createMultiRegionAccessPoint(callback?: (err: AWSError, data: S3Control.Types.CreateMultiRegionAccessPointResult) => void): Request<S3Control.Types.CreateMultiRegionAccessPointResult, AWSError>;
  /**
   * Deletes the specified access point. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to DeleteAccessPoint:    CreateAccessPoint     GetAccessPoint     ListAccessPoints   
   */
  deleteAccessPoint(params: S3Control.Types.DeleteAccessPointRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified access point. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to DeleteAccessPoint:    CreateAccessPoint     GetAccessPoint     ListAccessPoints   
   */
  deleteAccessPoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Object Lambda Access Point. The following actions are related to DeleteAccessPointForObjectLambda:    CreateAccessPointForObjectLambda     GetAccessPointForObjectLambda     ListAccessPointsForObjectLambda   
   */
  deleteAccessPointForObjectLambda(params: S3Control.Types.DeleteAccessPointForObjectLambdaRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Object Lambda Access Point. The following actions are related to DeleteAccessPointForObjectLambda:    CreateAccessPointForObjectLambda     GetAccessPointForObjectLambda     ListAccessPointsForObjectLambda   
   */
  deleteAccessPointForObjectLambda(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the access point policy for the specified access point.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to DeleteAccessPointPolicy:    PutAccessPointPolicy     GetAccessPointPolicy   
   */
  deleteAccessPointPolicy(params: S3Control.Types.DeleteAccessPointPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the access point policy for the specified access point.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to DeleteAccessPointPolicy:    PutAccessPointPolicy     GetAccessPointPolicy   
   */
  deleteAccessPointPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the resource policy for an Object Lambda Access Point. The following actions are related to DeleteAccessPointPolicyForObjectLambda:    GetAccessPointPolicyForObjectLambda     PutAccessPointPolicyForObjectLambda   
   */
  deleteAccessPointPolicyForObjectLambda(params: S3Control.Types.DeleteAccessPointPolicyForObjectLambdaRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the resource policy for an Object Lambda Access Point. The following actions are related to DeleteAccessPointPolicyForObjectLambda:    GetAccessPointPolicyForObjectLambda     PutAccessPointPolicyForObjectLambda   
   */
  deleteAccessPointPolicyForObjectLambda(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action deletes an Amazon S3 on Outposts bucket. To delete an S3 bucket, see DeleteBucket in the Amazon S3 API Reference.   Deletes the Amazon S3 on Outposts bucket. All objects (including all object versions and delete markers) in the bucket must be deleted before the bucket itself can be deleted. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section.  Related Resources     CreateBucket     GetBucket     DeleteObject   
   */
  deleteBucket(params: S3Control.Types.DeleteBucketRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action deletes an Amazon S3 on Outposts bucket. To delete an S3 bucket, see DeleteBucket in the Amazon S3 API Reference.   Deletes the Amazon S3 on Outposts bucket. All objects (including all object versions and delete markers) in the bucket must be deleted before the bucket itself can be deleted. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section.  Related Resources     CreateBucket     GetBucket     DeleteObject   
   */
  deleteBucket(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action deletes an Amazon S3 on Outposts bucket's lifecycle configuration. To delete an S3 bucket's lifecycle configuration, see DeleteBucketLifecycle in the Amazon S3 API Reference.   Deletes the lifecycle configuration from the specified Outposts bucket. Amazon S3 on Outposts removes all the lifecycle configuration rules in the lifecycle subresource associated with the bucket. Your objects never expire, and Amazon S3 on Outposts no longer automatically deletes any objects on the basis of rules contained in the deleted lifecycle configuration. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. To use this action, you must have permission to perform the s3-outposts:DeleteLifecycleConfiguration action. By default, the bucket owner has this permission and the Outposts bucket owner can grant this permission to others. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. For more information about object expiration, see Elements to Describe Lifecycle Actions. Related actions include:    PutBucketLifecycleConfiguration     GetBucketLifecycleConfiguration   
   */
  deleteBucketLifecycleConfiguration(params: S3Control.Types.DeleteBucketLifecycleConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action deletes an Amazon S3 on Outposts bucket's lifecycle configuration. To delete an S3 bucket's lifecycle configuration, see DeleteBucketLifecycle in the Amazon S3 API Reference.   Deletes the lifecycle configuration from the specified Outposts bucket. Amazon S3 on Outposts removes all the lifecycle configuration rules in the lifecycle subresource associated with the bucket. Your objects never expire, and Amazon S3 on Outposts no longer automatically deletes any objects on the basis of rules contained in the deleted lifecycle configuration. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. To use this action, you must have permission to perform the s3-outposts:DeleteLifecycleConfiguration action. By default, the bucket owner has this permission and the Outposts bucket owner can grant this permission to others. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. For more information about object expiration, see Elements to Describe Lifecycle Actions. Related actions include:    PutBucketLifecycleConfiguration     GetBucketLifecycleConfiguration   
   */
  deleteBucketLifecycleConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action deletes an Amazon S3 on Outposts bucket policy. To delete an S3 bucket policy, see DeleteBucketPolicy in the Amazon S3 API Reference.   This implementation of the DELETE action uses the policy subresource to delete the policy of a specified Amazon S3 on Outposts bucket. If you are using an identity other than the root user of the Amazon Web Services account that owns the bucket, the calling identity must have the s3-outposts:DeleteBucketPolicy permissions on the specified Outposts bucket and belong to the bucket owner's account to use this action. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. If you don't have DeleteBucketPolicy permissions, Amazon S3 returns a 403 Access Denied error. If you have the correct permissions, but you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a 405 Method Not Allowed error.   As a security precaution, the root user of the Amazon Web Services account that owns a bucket can always use this action, even if the policy explicitly denies the root user the ability to perform this action.  For more information about bucket policies, see Using Bucket Policies and User Policies.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to DeleteBucketPolicy:    GetBucketPolicy     PutBucketPolicy   
   */
  deleteBucketPolicy(params: S3Control.Types.DeleteBucketPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action deletes an Amazon S3 on Outposts bucket policy. To delete an S3 bucket policy, see DeleteBucketPolicy in the Amazon S3 API Reference.   This implementation of the DELETE action uses the policy subresource to delete the policy of a specified Amazon S3 on Outposts bucket. If you are using an identity other than the root user of the Amazon Web Services account that owns the bucket, the calling identity must have the s3-outposts:DeleteBucketPolicy permissions on the specified Outposts bucket and belong to the bucket owner's account to use this action. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. If you don't have DeleteBucketPolicy permissions, Amazon S3 returns a 403 Access Denied error. If you have the correct permissions, but you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a 405 Method Not Allowed error.   As a security precaution, the root user of the Amazon Web Services account that owns a bucket can always use this action, even if the policy explicitly denies the root user the ability to perform this action.  For more information about bucket policies, see Using Bucket Policies and User Policies.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to DeleteBucketPolicy:    GetBucketPolicy     PutBucketPolicy   
   */
  deleteBucketPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action deletes an Amazon S3 on Outposts bucket's tags. To delete an S3 bucket tags, see DeleteBucketTagging in the Amazon S3 API Reference.   Deletes the tags from the Outposts bucket. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. To use this action, you must have permission to perform the PutBucketTagging action. By default, the bucket owner has this permission and can grant this permission to others.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to DeleteBucketTagging:    GetBucketTagging     PutBucketTagging   
   */
  deleteBucketTagging(params: S3Control.Types.DeleteBucketTaggingRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action deletes an Amazon S3 on Outposts bucket's tags. To delete an S3 bucket tags, see DeleteBucketTagging in the Amazon S3 API Reference.   Deletes the tags from the Outposts bucket. For more information, see Using Amazon S3 on Outposts in Amazon S3 User Guide. To use this action, you must have permission to perform the PutBucketTagging action. By default, the bucket owner has this permission and can grant this permission to others.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to DeleteBucketTagging:    GetBucketTagging     PutBucketTagging   
   */
  deleteBucketTagging(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the entire tag set from the specified S3 Batch Operations job. To use this operation, you must have permission to perform the s3:DeleteJobTagging action. For more information, see Controlling access and labeling jobs using tags in the Amazon S3 User Guide.  Related actions include:    CreateJob     GetJobTagging     PutJobTagging   
   */
  deleteJobTagging(params: S3Control.Types.DeleteJobTaggingRequest, callback?: (err: AWSError, data: S3Control.Types.DeleteJobTaggingResult) => void): Request<S3Control.Types.DeleteJobTaggingResult, AWSError>;
  /**
   * Removes the entire tag set from the specified S3 Batch Operations job. To use this operation, you must have permission to perform the s3:DeleteJobTagging action. For more information, see Controlling access and labeling jobs using tags in the Amazon S3 User Guide.  Related actions include:    CreateJob     GetJobTagging     PutJobTagging   
   */
  deleteJobTagging(callback?: (err: AWSError, data: S3Control.Types.DeleteJobTaggingResult) => void): Request<S3Control.Types.DeleteJobTaggingResult, AWSError>;
  /**
   * Deletes a Multi-Region Access Point. This action does not delete the buckets associated with the Multi-Region Access Point, only the Multi-Region Access Point itself. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. This request is asynchronous, meaning that you might receive a response before the command has completed. When this request provides a response, it provides a token that you can use to monitor the status of the request with DescribeMultiRegionAccessPointOperation. The following actions are related to DeleteMultiRegionAccessPoint:    CreateMultiRegionAccessPoint     DescribeMultiRegionAccessPointOperation     GetMultiRegionAccessPoint     ListMultiRegionAccessPoints   
   */
  deleteMultiRegionAccessPoint(params: S3Control.Types.DeleteMultiRegionAccessPointRequest, callback?: (err: AWSError, data: S3Control.Types.DeleteMultiRegionAccessPointResult) => void): Request<S3Control.Types.DeleteMultiRegionAccessPointResult, AWSError>;
  /**
   * Deletes a Multi-Region Access Point. This action does not delete the buckets associated with the Multi-Region Access Point, only the Multi-Region Access Point itself. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. This request is asynchronous, meaning that you might receive a response before the command has completed. When this request provides a response, it provides a token that you can use to monitor the status of the request with DescribeMultiRegionAccessPointOperation. The following actions are related to DeleteMultiRegionAccessPoint:    CreateMultiRegionAccessPoint     DescribeMultiRegionAccessPointOperation     GetMultiRegionAccessPoint     ListMultiRegionAccessPoints   
   */
  deleteMultiRegionAccessPoint(callback?: (err: AWSError, data: S3Control.Types.DeleteMultiRegionAccessPointResult) => void): Request<S3Control.Types.DeleteMultiRegionAccessPointResult, AWSError>;
  /**
   * Removes the PublicAccessBlock configuration for an Amazon Web Services account. For more information, see  Using Amazon S3 block public access. Related actions include:    GetPublicAccessBlock     PutPublicAccessBlock   
   */
  deletePublicAccessBlock(params: S3Control.Types.DeletePublicAccessBlockRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the PublicAccessBlock configuration for an Amazon Web Services account. For more information, see  Using Amazon S3 block public access. Related actions include:    GetPublicAccessBlock     PutPublicAccessBlock   
   */
  deletePublicAccessBlock(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:DeleteStorageLensConfiguration action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  deleteStorageLensConfiguration(params: S3Control.Types.DeleteStorageLensConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:DeleteStorageLensConfiguration action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  deleteStorageLensConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the Amazon S3 Storage Lens configuration tags. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:DeleteStorageLensConfigurationTagging action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  deleteStorageLensConfigurationTagging(params: S3Control.Types.DeleteStorageLensConfigurationTaggingRequest, callback?: (err: AWSError, data: S3Control.Types.DeleteStorageLensConfigurationTaggingResult) => void): Request<S3Control.Types.DeleteStorageLensConfigurationTaggingResult, AWSError>;
  /**
   * Deletes the Amazon S3 Storage Lens configuration tags. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:DeleteStorageLensConfigurationTagging action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  deleteStorageLensConfigurationTagging(callback?: (err: AWSError, data: S3Control.Types.DeleteStorageLensConfigurationTaggingResult) => void): Request<S3Control.Types.DeleteStorageLensConfigurationTaggingResult, AWSError>;
  /**
   * Retrieves the configuration parameters and status for a Batch Operations job. For more information, see S3 Batch Operations in the Amazon S3 User Guide.  Related actions include:    CreateJob     ListJobs     UpdateJobPriority     UpdateJobStatus   
   */
  describeJob(params: S3Control.Types.DescribeJobRequest, callback?: (err: AWSError, data: S3Control.Types.DescribeJobResult) => void): Request<S3Control.Types.DescribeJobResult, AWSError>;
  /**
   * Retrieves the configuration parameters and status for a Batch Operations job. For more information, see S3 Batch Operations in the Amazon S3 User Guide.  Related actions include:    CreateJob     ListJobs     UpdateJobPriority     UpdateJobStatus   
   */
  describeJob(callback?: (err: AWSError, data: S3Control.Types.DescribeJobResult) => void): Request<S3Control.Types.DescribeJobResult, AWSError>;
  /**
   * Retrieves the status of an asynchronous request to manage a Multi-Region Access Point. For more information about managing Multi-Region Access Points and how asynchronous requests work, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to GetMultiRegionAccessPoint:    CreateMultiRegionAccessPoint     DeleteMultiRegionAccessPoint     GetMultiRegionAccessPoint     ListMultiRegionAccessPoints   
   */
  describeMultiRegionAccessPointOperation(params: S3Control.Types.DescribeMultiRegionAccessPointOperationRequest, callback?: (err: AWSError, data: S3Control.Types.DescribeMultiRegionAccessPointOperationResult) => void): Request<S3Control.Types.DescribeMultiRegionAccessPointOperationResult, AWSError>;
  /**
   * Retrieves the status of an asynchronous request to manage a Multi-Region Access Point. For more information about managing Multi-Region Access Points and how asynchronous requests work, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to GetMultiRegionAccessPoint:    CreateMultiRegionAccessPoint     DeleteMultiRegionAccessPoint     GetMultiRegionAccessPoint     ListMultiRegionAccessPoints   
   */
  describeMultiRegionAccessPointOperation(callback?: (err: AWSError, data: S3Control.Types.DescribeMultiRegionAccessPointOperationResult) => void): Request<S3Control.Types.DescribeMultiRegionAccessPointOperationResult, AWSError>;
  /**
   * Returns configuration information about the specified access point.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to GetAccessPoint:    CreateAccessPoint     DeleteAccessPoint     ListAccessPoints   
   */
  getAccessPoint(params: S3Control.Types.GetAccessPointRequest, callback?: (err: AWSError, data: S3Control.Types.GetAccessPointResult) => void): Request<S3Control.Types.GetAccessPointResult, AWSError>;
  /**
   * Returns configuration information about the specified access point.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to GetAccessPoint:    CreateAccessPoint     DeleteAccessPoint     ListAccessPoints   
   */
  getAccessPoint(callback?: (err: AWSError, data: S3Control.Types.GetAccessPointResult) => void): Request<S3Control.Types.GetAccessPointResult, AWSError>;
  /**
   * Returns configuration for an Object Lambda Access Point. The following actions are related to GetAccessPointConfigurationForObjectLambda:    PutAccessPointConfigurationForObjectLambda   
   */
  getAccessPointConfigurationForObjectLambda(params: S3Control.Types.GetAccessPointConfigurationForObjectLambdaRequest, callback?: (err: AWSError, data: S3Control.Types.GetAccessPointConfigurationForObjectLambdaResult) => void): Request<S3Control.Types.GetAccessPointConfigurationForObjectLambdaResult, AWSError>;
  /**
   * Returns configuration for an Object Lambda Access Point. The following actions are related to GetAccessPointConfigurationForObjectLambda:    PutAccessPointConfigurationForObjectLambda   
   */
  getAccessPointConfigurationForObjectLambda(callback?: (err: AWSError, data: S3Control.Types.GetAccessPointConfigurationForObjectLambdaResult) => void): Request<S3Control.Types.GetAccessPointConfigurationForObjectLambdaResult, AWSError>;
  /**
   * Returns configuration information about the specified Object Lambda Access Point The following actions are related to GetAccessPointForObjectLambda:    CreateAccessPointForObjectLambda     DeleteAccessPointForObjectLambda     ListAccessPointsForObjectLambda   
   */
  getAccessPointForObjectLambda(params: S3Control.Types.GetAccessPointForObjectLambdaRequest, callback?: (err: AWSError, data: S3Control.Types.GetAccessPointForObjectLambdaResult) => void): Request<S3Control.Types.GetAccessPointForObjectLambdaResult, AWSError>;
  /**
   * Returns configuration information about the specified Object Lambda Access Point The following actions are related to GetAccessPointForObjectLambda:    CreateAccessPointForObjectLambda     DeleteAccessPointForObjectLambda     ListAccessPointsForObjectLambda   
   */
  getAccessPointForObjectLambda(callback?: (err: AWSError, data: S3Control.Types.GetAccessPointForObjectLambdaResult) => void): Request<S3Control.Types.GetAccessPointForObjectLambdaResult, AWSError>;
  /**
   * Returns the access point policy associated with the specified access point. The following actions are related to GetAccessPointPolicy:    PutAccessPointPolicy     DeleteAccessPointPolicy   
   */
  getAccessPointPolicy(params: S3Control.Types.GetAccessPointPolicyRequest, callback?: (err: AWSError, data: S3Control.Types.GetAccessPointPolicyResult) => void): Request<S3Control.Types.GetAccessPointPolicyResult, AWSError>;
  /**
   * Returns the access point policy associated with the specified access point. The following actions are related to GetAccessPointPolicy:    PutAccessPointPolicy     DeleteAccessPointPolicy   
   */
  getAccessPointPolicy(callback?: (err: AWSError, data: S3Control.Types.GetAccessPointPolicyResult) => void): Request<S3Control.Types.GetAccessPointPolicyResult, AWSError>;
  /**
   * Returns the resource policy for an Object Lambda Access Point. The following actions are related to GetAccessPointPolicyForObjectLambda:    DeleteAccessPointPolicyForObjectLambda     PutAccessPointPolicyForObjectLambda   
   */
  getAccessPointPolicyForObjectLambda(params: S3Control.Types.GetAccessPointPolicyForObjectLambdaRequest, callback?: (err: AWSError, data: S3Control.Types.GetAccessPointPolicyForObjectLambdaResult) => void): Request<S3Control.Types.GetAccessPointPolicyForObjectLambdaResult, AWSError>;
  /**
   * Returns the resource policy for an Object Lambda Access Point. The following actions are related to GetAccessPointPolicyForObjectLambda:    DeleteAccessPointPolicyForObjectLambda     PutAccessPointPolicyForObjectLambda   
   */
  getAccessPointPolicyForObjectLambda(callback?: (err: AWSError, data: S3Control.Types.GetAccessPointPolicyForObjectLambdaResult) => void): Request<S3Control.Types.GetAccessPointPolicyForObjectLambdaResult, AWSError>;
  /**
   * Indicates whether the specified access point currently has a policy that allows public access. For more information about public access through access points, see Managing Data Access with Amazon S3 access points in the Amazon S3 User Guide.
   */
  getAccessPointPolicyStatus(params: S3Control.Types.GetAccessPointPolicyStatusRequest, callback?: (err: AWSError, data: S3Control.Types.GetAccessPointPolicyStatusResult) => void): Request<S3Control.Types.GetAccessPointPolicyStatusResult, AWSError>;
  /**
   * Indicates whether the specified access point currently has a policy that allows public access. For more information about public access through access points, see Managing Data Access with Amazon S3 access points in the Amazon S3 User Guide.
   */
  getAccessPointPolicyStatus(callback?: (err: AWSError, data: S3Control.Types.GetAccessPointPolicyStatusResult) => void): Request<S3Control.Types.GetAccessPointPolicyStatusResult, AWSError>;
  /**
   * Returns the status of the resource policy associated with an Object Lambda Access Point.
   */
  getAccessPointPolicyStatusForObjectLambda(params: S3Control.Types.GetAccessPointPolicyStatusForObjectLambdaRequest, callback?: (err: AWSError, data: S3Control.Types.GetAccessPointPolicyStatusForObjectLambdaResult) => void): Request<S3Control.Types.GetAccessPointPolicyStatusForObjectLambdaResult, AWSError>;
  /**
   * Returns the status of the resource policy associated with an Object Lambda Access Point.
   */
  getAccessPointPolicyStatusForObjectLambda(callback?: (err: AWSError, data: S3Control.Types.GetAccessPointPolicyStatusForObjectLambdaResult) => void): Request<S3Control.Types.GetAccessPointPolicyStatusForObjectLambdaResult, AWSError>;
  /**
   * Gets an Amazon S3 on Outposts bucket. For more information, see  Using Amazon S3 on Outposts in the Amazon S3 User Guide. If you are using an identity other than the root user of the Amazon Web Services account that owns the Outposts bucket, the calling identity must have the s3-outposts:GetBucket permissions on the specified Outposts bucket and belong to the Outposts bucket owner's account in order to use this action. Only users from Outposts bucket owner account with the right permissions can perform actions on an Outposts bucket.   If you don't have s3-outposts:GetBucket permissions or you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a 403 Access Denied error. The following actions are related to GetBucket for Amazon S3 on Outposts: All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section.    PutObject     CreateBucket     DeleteBucket   
   */
  getBucket(params: S3Control.Types.GetBucketRequest, callback?: (err: AWSError, data: S3Control.Types.GetBucketResult) => void): Request<S3Control.Types.GetBucketResult, AWSError>;
  /**
   * Gets an Amazon S3 on Outposts bucket. For more information, see  Using Amazon S3 on Outposts in the Amazon S3 User Guide. If you are using an identity other than the root user of the Amazon Web Services account that owns the Outposts bucket, the calling identity must have the s3-outposts:GetBucket permissions on the specified Outposts bucket and belong to the Outposts bucket owner's account in order to use this action. Only users from Outposts bucket owner account with the right permissions can perform actions on an Outposts bucket.   If you don't have s3-outposts:GetBucket permissions or you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a 403 Access Denied error. The following actions are related to GetBucket for Amazon S3 on Outposts: All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section.    PutObject     CreateBucket     DeleteBucket   
   */
  getBucket(callback?: (err: AWSError, data: S3Control.Types.GetBucketResult) => void): Request<S3Control.Types.GetBucketResult, AWSError>;
  /**
   *  This action gets an Amazon S3 on Outposts bucket's lifecycle configuration. To get an S3 bucket's lifecycle configuration, see GetBucketLifecycleConfiguration in the Amazon S3 API Reference.   Returns the lifecycle configuration information set on the Outposts bucket. For more information, see Using Amazon S3 on Outposts and for information about lifecycle configuration, see  Object Lifecycle Management in Amazon S3 User Guide. To use this action, you must have permission to perform the s3-outposts:GetLifecycleConfiguration action. The Outposts bucket owner has this permission, by default. The bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3 Resources. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section.  GetBucketLifecycleConfiguration has the following special error:   Error code: NoSuchLifecycleConfiguration    Description: The lifecycle configuration does not exist.   HTTP Status Code: 404 Not Found   SOAP Fault Code Prefix: Client     The following actions are related to GetBucketLifecycleConfiguration:    PutBucketLifecycleConfiguration     DeleteBucketLifecycleConfiguration   
   */
  getBucketLifecycleConfiguration(params: S3Control.Types.GetBucketLifecycleConfigurationRequest, callback?: (err: AWSError, data: S3Control.Types.GetBucketLifecycleConfigurationResult) => void): Request<S3Control.Types.GetBucketLifecycleConfigurationResult, AWSError>;
  /**
   *  This action gets an Amazon S3 on Outposts bucket's lifecycle configuration. To get an S3 bucket's lifecycle configuration, see GetBucketLifecycleConfiguration in the Amazon S3 API Reference.   Returns the lifecycle configuration information set on the Outposts bucket. For more information, see Using Amazon S3 on Outposts and for information about lifecycle configuration, see  Object Lifecycle Management in Amazon S3 User Guide. To use this action, you must have permission to perform the s3-outposts:GetLifecycleConfiguration action. The Outposts bucket owner has this permission, by default. The bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3 Resources. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section.  GetBucketLifecycleConfiguration has the following special error:   Error code: NoSuchLifecycleConfiguration    Description: The lifecycle configuration does not exist.   HTTP Status Code: 404 Not Found   SOAP Fault Code Prefix: Client     The following actions are related to GetBucketLifecycleConfiguration:    PutBucketLifecycleConfiguration     DeleteBucketLifecycleConfiguration   
   */
  getBucketLifecycleConfiguration(callback?: (err: AWSError, data: S3Control.Types.GetBucketLifecycleConfigurationResult) => void): Request<S3Control.Types.GetBucketLifecycleConfigurationResult, AWSError>;
  /**
   *  This action gets a bucket policy for an Amazon S3 on Outposts bucket. To get a policy for an S3 bucket, see GetBucketPolicy in the Amazon S3 API Reference.   Returns the policy of a specified Outposts bucket. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. If you are using an identity other than the root user of the Amazon Web Services account that owns the bucket, the calling identity must have the GetBucketPolicy permissions on the specified bucket and belong to the bucket owner's account in order to use this action. Only users from Outposts bucket owner account with the right permissions can perform actions on an Outposts bucket. If you don't have s3-outposts:GetBucketPolicy permissions or you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a 403 Access Denied error.  As a security precaution, the root user of the Amazon Web Services account that owns a bucket can always use this action, even if the policy explicitly denies the root user the ability to perform this action.  For more information about bucket policies, see Using Bucket Policies and User Policies. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to GetBucketPolicy:    GetObject     PutBucketPolicy     DeleteBucketPolicy   
   */
  getBucketPolicy(params: S3Control.Types.GetBucketPolicyRequest, callback?: (err: AWSError, data: S3Control.Types.GetBucketPolicyResult) => void): Request<S3Control.Types.GetBucketPolicyResult, AWSError>;
  /**
   *  This action gets a bucket policy for an Amazon S3 on Outposts bucket. To get a policy for an S3 bucket, see GetBucketPolicy in the Amazon S3 API Reference.   Returns the policy of a specified Outposts bucket. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. If you are using an identity other than the root user of the Amazon Web Services account that owns the bucket, the calling identity must have the GetBucketPolicy permissions on the specified bucket and belong to the bucket owner's account in order to use this action. Only users from Outposts bucket owner account with the right permissions can perform actions on an Outposts bucket. If you don't have s3-outposts:GetBucketPolicy permissions or you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a 403 Access Denied error.  As a security precaution, the root user of the Amazon Web Services account that owns a bucket can always use this action, even if the policy explicitly denies the root user the ability to perform this action.  For more information about bucket policies, see Using Bucket Policies and User Policies. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to GetBucketPolicy:    GetObject     PutBucketPolicy     DeleteBucketPolicy   
   */
  getBucketPolicy(callback?: (err: AWSError, data: S3Control.Types.GetBucketPolicyResult) => void): Request<S3Control.Types.GetBucketPolicyResult, AWSError>;
  /**
   *  This action gets an Amazon S3 on Outposts bucket's tags. To get an S3 bucket tags, see GetBucketTagging in the Amazon S3 API Reference.   Returns the tag set associated with the Outposts bucket. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. To use this action, you must have permission to perform the GetBucketTagging action. By default, the bucket owner has this permission and can grant this permission to others.  GetBucketTagging has the following special error:   Error code: NoSuchTagSetError    Description: There is no tag set associated with the bucket.     All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to GetBucketTagging:    PutBucketTagging     DeleteBucketTagging   
   */
  getBucketTagging(params: S3Control.Types.GetBucketTaggingRequest, callback?: (err: AWSError, data: S3Control.Types.GetBucketTaggingResult) => void): Request<S3Control.Types.GetBucketTaggingResult, AWSError>;
  /**
   *  This action gets an Amazon S3 on Outposts bucket's tags. To get an S3 bucket tags, see GetBucketTagging in the Amazon S3 API Reference.   Returns the tag set associated with the Outposts bucket. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. To use this action, you must have permission to perform the GetBucketTagging action. By default, the bucket owner has this permission and can grant this permission to others.  GetBucketTagging has the following special error:   Error code: NoSuchTagSetError    Description: There is no tag set associated with the bucket.     All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to GetBucketTagging:    PutBucketTagging     DeleteBucketTagging   
   */
  getBucketTagging(callback?: (err: AWSError, data: S3Control.Types.GetBucketTaggingResult) => void): Request<S3Control.Types.GetBucketTaggingResult, AWSError>;
  /**
   * Returns the tags on an S3 Batch Operations job. To use this operation, you must have permission to perform the s3:GetJobTagging action. For more information, see Controlling access and labeling jobs using tags in the Amazon S3 User Guide.  Related actions include:    CreateJob     PutJobTagging     DeleteJobTagging   
   */
  getJobTagging(params: S3Control.Types.GetJobTaggingRequest, callback?: (err: AWSError, data: S3Control.Types.GetJobTaggingResult) => void): Request<S3Control.Types.GetJobTaggingResult, AWSError>;
  /**
   * Returns the tags on an S3 Batch Operations job. To use this operation, you must have permission to perform the s3:GetJobTagging action. For more information, see Controlling access and labeling jobs using tags in the Amazon S3 User Guide.  Related actions include:    CreateJob     PutJobTagging     DeleteJobTagging   
   */
  getJobTagging(callback?: (err: AWSError, data: S3Control.Types.GetJobTaggingResult) => void): Request<S3Control.Types.GetJobTaggingResult, AWSError>;
  /**
   * Returns configuration information about the specified Multi-Region Access Point. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to GetMultiRegionAccessPoint:    CreateMultiRegionAccessPoint     DeleteMultiRegionAccessPoint     DescribeMultiRegionAccessPointOperation     ListMultiRegionAccessPoints   
   */
  getMultiRegionAccessPoint(params: S3Control.Types.GetMultiRegionAccessPointRequest, callback?: (err: AWSError, data: S3Control.Types.GetMultiRegionAccessPointResult) => void): Request<S3Control.Types.GetMultiRegionAccessPointResult, AWSError>;
  /**
   * Returns configuration information about the specified Multi-Region Access Point. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to GetMultiRegionAccessPoint:    CreateMultiRegionAccessPoint     DeleteMultiRegionAccessPoint     DescribeMultiRegionAccessPointOperation     ListMultiRegionAccessPoints   
   */
  getMultiRegionAccessPoint(callback?: (err: AWSError, data: S3Control.Types.GetMultiRegionAccessPointResult) => void): Request<S3Control.Types.GetMultiRegionAccessPointResult, AWSError>;
  /**
   * Returns the access control policy of the specified Multi-Region Access Point. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to GetMultiRegionAccessPointPolicy:    GetMultiRegionAccessPointPolicyStatus     PutMultiRegionAccessPointPolicy   
   */
  getMultiRegionAccessPointPolicy(params: S3Control.Types.GetMultiRegionAccessPointPolicyRequest, callback?: (err: AWSError, data: S3Control.Types.GetMultiRegionAccessPointPolicyResult) => void): Request<S3Control.Types.GetMultiRegionAccessPointPolicyResult, AWSError>;
  /**
   * Returns the access control policy of the specified Multi-Region Access Point. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to GetMultiRegionAccessPointPolicy:    GetMultiRegionAccessPointPolicyStatus     PutMultiRegionAccessPointPolicy   
   */
  getMultiRegionAccessPointPolicy(callback?: (err: AWSError, data: S3Control.Types.GetMultiRegionAccessPointPolicyResult) => void): Request<S3Control.Types.GetMultiRegionAccessPointPolicyResult, AWSError>;
  /**
   * Indicates whether the specified Multi-Region Access Point has an access control policy that allows public access. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to GetMultiRegionAccessPointPolicyStatus:    GetMultiRegionAccessPointPolicy     PutMultiRegionAccessPointPolicy   
   */
  getMultiRegionAccessPointPolicyStatus(params: S3Control.Types.GetMultiRegionAccessPointPolicyStatusRequest, callback?: (err: AWSError, data: S3Control.Types.GetMultiRegionAccessPointPolicyStatusResult) => void): Request<S3Control.Types.GetMultiRegionAccessPointPolicyStatusResult, AWSError>;
  /**
   * Indicates whether the specified Multi-Region Access Point has an access control policy that allows public access. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to GetMultiRegionAccessPointPolicyStatus:    GetMultiRegionAccessPointPolicy     PutMultiRegionAccessPointPolicy   
   */
  getMultiRegionAccessPointPolicyStatus(callback?: (err: AWSError, data: S3Control.Types.GetMultiRegionAccessPointPolicyStatusResult) => void): Request<S3Control.Types.GetMultiRegionAccessPointPolicyStatusResult, AWSError>;
  /**
   * Retrieves the PublicAccessBlock configuration for an Amazon Web Services account. For more information, see  Using Amazon S3 block public access. Related actions include:    DeletePublicAccessBlock     PutPublicAccessBlock   
   */
  getPublicAccessBlock(params: S3Control.Types.GetPublicAccessBlockRequest, callback?: (err: AWSError, data: S3Control.Types.GetPublicAccessBlockOutput) => void): Request<S3Control.Types.GetPublicAccessBlockOutput, AWSError>;
  /**
   * Retrieves the PublicAccessBlock configuration for an Amazon Web Services account. For more information, see  Using Amazon S3 block public access. Related actions include:    DeletePublicAccessBlock     PutPublicAccessBlock   
   */
  getPublicAccessBlock(callback?: (err: AWSError, data: S3Control.Types.GetPublicAccessBlockOutput) => void): Request<S3Control.Types.GetPublicAccessBlockOutput, AWSError>;
  /**
   * Gets the Amazon S3 Storage Lens configuration. For more information, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:GetStorageLensConfiguration action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  getStorageLensConfiguration(params: S3Control.Types.GetStorageLensConfigurationRequest, callback?: (err: AWSError, data: S3Control.Types.GetStorageLensConfigurationResult) => void): Request<S3Control.Types.GetStorageLensConfigurationResult, AWSError>;
  /**
   * Gets the Amazon S3 Storage Lens configuration. For more information, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:GetStorageLensConfiguration action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  getStorageLensConfiguration(callback?: (err: AWSError, data: S3Control.Types.GetStorageLensConfigurationResult) => void): Request<S3Control.Types.GetStorageLensConfigurationResult, AWSError>;
  /**
   * Gets the tags of Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:GetStorageLensConfigurationTagging action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  getStorageLensConfigurationTagging(params: S3Control.Types.GetStorageLensConfigurationTaggingRequest, callback?: (err: AWSError, data: S3Control.Types.GetStorageLensConfigurationTaggingResult) => void): Request<S3Control.Types.GetStorageLensConfigurationTaggingResult, AWSError>;
  /**
   * Gets the tags of Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:GetStorageLensConfigurationTagging action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  getStorageLensConfigurationTagging(callback?: (err: AWSError, data: S3Control.Types.GetStorageLensConfigurationTaggingResult) => void): Request<S3Control.Types.GetStorageLensConfigurationTaggingResult, AWSError>;
  /**
   * Returns a list of the access points currently associated with the specified bucket. You can retrieve up to 1000 access points per call. If the specified bucket has more than 1,000 access points (or the number specified in maxResults, whichever is less), the response will include a continuation token that you can use to list the additional access points.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to ListAccessPoints:    CreateAccessPoint     DeleteAccessPoint     GetAccessPoint   
   */
  listAccessPoints(params: S3Control.Types.ListAccessPointsRequest, callback?: (err: AWSError, data: S3Control.Types.ListAccessPointsResult) => void): Request<S3Control.Types.ListAccessPointsResult, AWSError>;
  /**
   * Returns a list of the access points currently associated with the specified bucket. You can retrieve up to 1000 access points per call. If the specified bucket has more than 1,000 access points (or the number specified in maxResults, whichever is less), the response will include a continuation token that you can use to list the additional access points.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to ListAccessPoints:    CreateAccessPoint     DeleteAccessPoint     GetAccessPoint   
   */
  listAccessPoints(callback?: (err: AWSError, data: S3Control.Types.ListAccessPointsResult) => void): Request<S3Control.Types.ListAccessPointsResult, AWSError>;
  /**
   * Returns a list of the access points associated with the Object Lambda Access Point. You can retrieve up to 1000 access points per call. If there are more than 1,000 access points (or the number specified in maxResults, whichever is less), the response will include a continuation token that you can use to list the additional access points. The following actions are related to ListAccessPointsForObjectLambda:    CreateAccessPointForObjectLambda     DeleteAccessPointForObjectLambda     GetAccessPointForObjectLambda   
   */
  listAccessPointsForObjectLambda(params: S3Control.Types.ListAccessPointsForObjectLambdaRequest, callback?: (err: AWSError, data: S3Control.Types.ListAccessPointsForObjectLambdaResult) => void): Request<S3Control.Types.ListAccessPointsForObjectLambdaResult, AWSError>;
  /**
   * Returns a list of the access points associated with the Object Lambda Access Point. You can retrieve up to 1000 access points per call. If there are more than 1,000 access points (or the number specified in maxResults, whichever is less), the response will include a continuation token that you can use to list the additional access points. The following actions are related to ListAccessPointsForObjectLambda:    CreateAccessPointForObjectLambda     DeleteAccessPointForObjectLambda     GetAccessPointForObjectLambda   
   */
  listAccessPointsForObjectLambda(callback?: (err: AWSError, data: S3Control.Types.ListAccessPointsForObjectLambdaResult) => void): Request<S3Control.Types.ListAccessPointsForObjectLambdaResult, AWSError>;
  /**
   * Lists current S3 Batch Operations jobs and jobs that have ended within the last 30 days for the Amazon Web Services account making the request. For more information, see S3 Batch Operations in the Amazon S3 User Guide. Related actions include:     CreateJob     DescribeJob     UpdateJobPriority     UpdateJobStatus   
   */
  listJobs(params: S3Control.Types.ListJobsRequest, callback?: (err: AWSError, data: S3Control.Types.ListJobsResult) => void): Request<S3Control.Types.ListJobsResult, AWSError>;
  /**
   * Lists current S3 Batch Operations jobs and jobs that have ended within the last 30 days for the Amazon Web Services account making the request. For more information, see S3 Batch Operations in the Amazon S3 User Guide. Related actions include:     CreateJob     DescribeJob     UpdateJobPriority     UpdateJobStatus   
   */
  listJobs(callback?: (err: AWSError, data: S3Control.Types.ListJobsResult) => void): Request<S3Control.Types.ListJobsResult, AWSError>;
  /**
   * Returns a list of the Multi-Region Access Points currently associated with the specified Amazon Web Services account. Each call can return up to 100 Multi-Region Access Points, the maximum number of Multi-Region Access Points that can be associated with a single account. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to ListMultiRegionAccessPoint:    CreateMultiRegionAccessPoint     DeleteMultiRegionAccessPoint     DescribeMultiRegionAccessPointOperation     GetMultiRegionAccessPoint   
   */
  listMultiRegionAccessPoints(params: S3Control.Types.ListMultiRegionAccessPointsRequest, callback?: (err: AWSError, data: S3Control.Types.ListMultiRegionAccessPointsResult) => void): Request<S3Control.Types.ListMultiRegionAccessPointsResult, AWSError>;
  /**
   * Returns a list of the Multi-Region Access Points currently associated with the specified Amazon Web Services account. Each call can return up to 100 Multi-Region Access Points, the maximum number of Multi-Region Access Points that can be associated with a single account. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to ListMultiRegionAccessPoint:    CreateMultiRegionAccessPoint     DeleteMultiRegionAccessPoint     DescribeMultiRegionAccessPointOperation     GetMultiRegionAccessPoint   
   */
  listMultiRegionAccessPoints(callback?: (err: AWSError, data: S3Control.Types.ListMultiRegionAccessPointsResult) => void): Request<S3Control.Types.ListMultiRegionAccessPointsResult, AWSError>;
  /**
   * Returns a list of all Outposts buckets in an Outpost that are owned by the authenticated sender of the request. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and x-amz-outpost-id in your request, see the Examples section.
   */
  listRegionalBuckets(params: S3Control.Types.ListRegionalBucketsRequest, callback?: (err: AWSError, data: S3Control.Types.ListRegionalBucketsResult) => void): Request<S3Control.Types.ListRegionalBucketsResult, AWSError>;
  /**
   * Returns a list of all Outposts buckets in an Outpost that are owned by the authenticated sender of the request. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and x-amz-outpost-id in your request, see the Examples section.
   */
  listRegionalBuckets(callback?: (err: AWSError, data: S3Control.Types.ListRegionalBucketsResult) => void): Request<S3Control.Types.ListRegionalBucketsResult, AWSError>;
  /**
   * Gets a list of Amazon S3 Storage Lens configurations. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:ListStorageLensConfigurations action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  listStorageLensConfigurations(params: S3Control.Types.ListStorageLensConfigurationsRequest, callback?: (err: AWSError, data: S3Control.Types.ListStorageLensConfigurationsResult) => void): Request<S3Control.Types.ListStorageLensConfigurationsResult, AWSError>;
  /**
   * Gets a list of Amazon S3 Storage Lens configurations. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:ListStorageLensConfigurations action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  listStorageLensConfigurations(callback?: (err: AWSError, data: S3Control.Types.ListStorageLensConfigurationsResult) => void): Request<S3Control.Types.ListStorageLensConfigurationsResult, AWSError>;
  /**
   * Replaces configuration for an Object Lambda Access Point. The following actions are related to PutAccessPointConfigurationForObjectLambda:    GetAccessPointConfigurationForObjectLambda   
   */
  putAccessPointConfigurationForObjectLambda(params: S3Control.Types.PutAccessPointConfigurationForObjectLambdaRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Replaces configuration for an Object Lambda Access Point. The following actions are related to PutAccessPointConfigurationForObjectLambda:    GetAccessPointConfigurationForObjectLambda   
   */
  putAccessPointConfigurationForObjectLambda(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates an access policy with the specified access point. Each access point can have only one policy, so a request made to this API replaces any existing policy associated with the specified access point.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to PutAccessPointPolicy:    GetAccessPointPolicy     DeleteAccessPointPolicy   
   */
  putAccessPointPolicy(params: S3Control.Types.PutAccessPointPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates an access policy with the specified access point. Each access point can have only one policy, so a request made to this API replaces any existing policy associated with the specified access point.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to PutAccessPointPolicy:    GetAccessPointPolicy     DeleteAccessPointPolicy   
   */
  putAccessPointPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or replaces resource policy for an Object Lambda Access Point. For an example policy, see Creating Object Lambda Access Points in the Amazon S3 User Guide. The following actions are related to PutAccessPointPolicyForObjectLambda:    DeleteAccessPointPolicyForObjectLambda     GetAccessPointPolicyForObjectLambda   
   */
  putAccessPointPolicyForObjectLambda(params: S3Control.Types.PutAccessPointPolicyForObjectLambdaRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or replaces resource policy for an Object Lambda Access Point. For an example policy, see Creating Object Lambda Access Points in the Amazon S3 User Guide. The following actions are related to PutAccessPointPolicyForObjectLambda:    DeleteAccessPointPolicyForObjectLambda     GetAccessPointPolicyForObjectLambda   
   */
  putAccessPointPolicyForObjectLambda(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action puts a lifecycle configuration to an Amazon S3 on Outposts bucket. To put a lifecycle configuration to an S3 bucket, see PutBucketLifecycleConfiguration in the Amazon S3 API Reference.   Creates a new lifecycle configuration for the S3 on Outposts bucket or replaces an existing lifecycle configuration. Outposts buckets only support lifecycle configurations that delete/expire objects after a certain period of time and abort incomplete multipart uploads.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to PutBucketLifecycleConfiguration:    GetBucketLifecycleConfiguration     DeleteBucketLifecycleConfiguration   
   */
  putBucketLifecycleConfiguration(params: S3Control.Types.PutBucketLifecycleConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action puts a lifecycle configuration to an Amazon S3 on Outposts bucket. To put a lifecycle configuration to an S3 bucket, see PutBucketLifecycleConfiguration in the Amazon S3 API Reference.   Creates a new lifecycle configuration for the S3 on Outposts bucket or replaces an existing lifecycle configuration. Outposts buckets only support lifecycle configurations that delete/expire objects after a certain period of time and abort incomplete multipart uploads.  All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to PutBucketLifecycleConfiguration:    GetBucketLifecycleConfiguration     DeleteBucketLifecycleConfiguration   
   */
  putBucketLifecycleConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action puts a bucket policy to an Amazon S3 on Outposts bucket. To put a policy on an S3 bucket, see PutBucketPolicy in the Amazon S3 API Reference.   Applies an Amazon S3 bucket policy to an Outposts bucket. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. If you are using an identity other than the root user of the Amazon Web Services account that owns the Outposts bucket, the calling identity must have the PutBucketPolicy permissions on the specified Outposts bucket and belong to the bucket owner's account in order to use this action. If you don't have PutBucketPolicy permissions, Amazon S3 returns a 403 Access Denied error. If you have the correct permissions, but you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a 405 Method Not Allowed error.   As a security precaution, the root user of the Amazon Web Services account that owns a bucket can always use this action, even if the policy explicitly denies the root user the ability to perform this action.   For more information about bucket policies, see Using Bucket Policies and User Policies. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to PutBucketPolicy:    GetBucketPolicy     DeleteBucketPolicy   
   */
  putBucketPolicy(params: S3Control.Types.PutBucketPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action puts a bucket policy to an Amazon S3 on Outposts bucket. To put a policy on an S3 bucket, see PutBucketPolicy in the Amazon S3 API Reference.   Applies an Amazon S3 bucket policy to an Outposts bucket. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. If you are using an identity other than the root user of the Amazon Web Services account that owns the Outposts bucket, the calling identity must have the PutBucketPolicy permissions on the specified Outposts bucket and belong to the bucket owner's account in order to use this action. If you don't have PutBucketPolicy permissions, Amazon S3 returns a 403 Access Denied error. If you have the correct permissions, but you're not using an identity that belongs to the bucket owner's account, Amazon S3 returns a 405 Method Not Allowed error.   As a security precaution, the root user of the Amazon Web Services account that owns a bucket can always use this action, even if the policy explicitly denies the root user the ability to perform this action.   For more information about bucket policies, see Using Bucket Policies and User Policies. All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to PutBucketPolicy:    GetBucketPolicy     DeleteBucketPolicy   
   */
  putBucketPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action puts tags on an Amazon S3 on Outposts bucket. To put tags on an S3 bucket, see PutBucketTagging in the Amazon S3 API Reference.   Sets the tags for an S3 on Outposts bucket. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. Use tags to organize your Amazon Web Services bill to reflect your own cost structure. To do this, sign up to get your Amazon Web Services account bill with tag key values included. Then, to see the cost of combined resources, organize your billing information according to resources with the same tag key values. For example, you can tag several resources with a specific application name, and then organize your billing information to see the total cost of that application across several services. For more information, see Cost allocation and tagging.  Within a bucket, if you add a tag that has the same key as an existing tag, the new value overwrites the old value. For more information, see  Using cost allocation in Amazon S3 bucket tags.  To use this action, you must have permissions to perform the s3-outposts:PutBucketTagging action. The Outposts bucket owner has this permission by default and can grant this permission to others. For more information about permissions, see  Permissions Related to Bucket Subresource Operations and Managing access permissions to your Amazon S3 resources.  PutBucketTagging has the following special errors:   Error code: InvalidTagError    Description: The tag provided was not a valid tag. This error can occur if the tag did not pass input validation. For information about tag restrictions, see  User-Defined Tag Restrictions and  Amazon Web Services-Generated Cost Allocation Tag Restrictions.     Error code: MalformedXMLError    Description: The XML provided does not match the schema.     Error code: OperationAbortedError     Description: A conflicting conditional action is currently in progress against this resource. Try again.     Error code: InternalError    Description: The service was unable to apply the provided tag to the bucket.     All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to PutBucketTagging:    GetBucketTagging     DeleteBucketTagging   
   */
  putBucketTagging(params: S3Control.Types.PutBucketTaggingRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This action puts tags on an Amazon S3 on Outposts bucket. To put tags on an S3 bucket, see PutBucketTagging in the Amazon S3 API Reference.   Sets the tags for an S3 on Outposts bucket. For more information, see Using Amazon S3 on Outposts in the Amazon S3 User Guide. Use tags to organize your Amazon Web Services bill to reflect your own cost structure. To do this, sign up to get your Amazon Web Services account bill with tag key values included. Then, to see the cost of combined resources, organize your billing information according to resources with the same tag key values. For example, you can tag several resources with a specific application name, and then organize your billing information to see the total cost of that application across several services. For more information, see Cost allocation and tagging.  Within a bucket, if you add a tag that has the same key as an existing tag, the new value overwrites the old value. For more information, see  Using cost allocation in Amazon S3 bucket tags.  To use this action, you must have permissions to perform the s3-outposts:PutBucketTagging action. The Outposts bucket owner has this permission by default and can grant this permission to others. For more information about permissions, see  Permissions Related to Bucket Subresource Operations and Managing access permissions to your Amazon S3 resources.  PutBucketTagging has the following special errors:   Error code: InvalidTagError    Description: The tag provided was not a valid tag. This error can occur if the tag did not pass input validation. For information about tag restrictions, see  User-Defined Tag Restrictions and  Amazon Web Services-Generated Cost Allocation Tag Restrictions.     Error code: MalformedXMLError    Description: The XML provided does not match the schema.     Error code: OperationAbortedError     Description: A conflicting conditional action is currently in progress against this resource. Try again.     Error code: InternalError    Description: The service was unable to apply the provided tag to the bucket.     All Amazon S3 on Outposts REST API requests for this action require an additional parameter of x-amz-outpost-id to be passed with the request and an S3 on Outposts endpoint hostname prefix instead of s3-control. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the x-amz-outpost-id derived using the access point ARN, see the Examples section. The following actions are related to PutBucketTagging:    GetBucketTagging     DeleteBucketTagging   
   */
  putBucketTagging(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the supplied tag-set on an S3 Batch Operations job. A tag is a key-value pair. You can associate S3 Batch Operations tags with any job by sending a PUT request against the tagging subresource that is associated with the job. To modify the existing tag set, you can either replace the existing tag set entirely, or make changes within the existing tag set by retrieving the existing tag set using GetJobTagging, modify that tag set, and use this action to replace the tag set with the one you modified. For more information, see Controlling access and labeling jobs using tags in the Amazon S3 User Guide.      If you send this request with an empty tag set, Amazon S3 deletes the existing tag set on the Batch Operations job. If you use this method, you are charged for a Tier 1 Request (PUT). For more information, see Amazon S3 pricing.   For deleting existing tags for your Batch Operations job, a DeleteJobTagging request is preferred because it achieves the same result without incurring charges.   A few things to consider about using tags:   Amazon S3 limits the maximum number of tags to 50 tags per job.   You can associate up to 50 tags with a job as long as they have unique tag keys.   A tag key can be up to 128 Unicode characters in length, and tag values can be up to 256 Unicode characters in length.   The key and values are case sensitive.   For tagging-related restrictions related to characters and encodings, see User-Defined Tag Restrictions in the Billing and Cost Management User Guide.       To use this action, you must have permission to perform the s3:PutJobTagging action. Related actions include:    CreatJob     GetJobTagging     DeleteJobTagging   
   */
  putJobTagging(params: S3Control.Types.PutJobTaggingRequest, callback?: (err: AWSError, data: S3Control.Types.PutJobTaggingResult) => void): Request<S3Control.Types.PutJobTaggingResult, AWSError>;
  /**
   * Sets the supplied tag-set on an S3 Batch Operations job. A tag is a key-value pair. You can associate S3 Batch Operations tags with any job by sending a PUT request against the tagging subresource that is associated with the job. To modify the existing tag set, you can either replace the existing tag set entirely, or make changes within the existing tag set by retrieving the existing tag set using GetJobTagging, modify that tag set, and use this action to replace the tag set with the one you modified. For more information, see Controlling access and labeling jobs using tags in the Amazon S3 User Guide.      If you send this request with an empty tag set, Amazon S3 deletes the existing tag set on the Batch Operations job. If you use this method, you are charged for a Tier 1 Request (PUT). For more information, see Amazon S3 pricing.   For deleting existing tags for your Batch Operations job, a DeleteJobTagging request is preferred because it achieves the same result without incurring charges.   A few things to consider about using tags:   Amazon S3 limits the maximum number of tags to 50 tags per job.   You can associate up to 50 tags with a job as long as they have unique tag keys.   A tag key can be up to 128 Unicode characters in length, and tag values can be up to 256 Unicode characters in length.   The key and values are case sensitive.   For tagging-related restrictions related to characters and encodings, see User-Defined Tag Restrictions in the Billing and Cost Management User Guide.       To use this action, you must have permission to perform the s3:PutJobTagging action. Related actions include:    CreatJob     GetJobTagging     DeleteJobTagging   
   */
  putJobTagging(callback?: (err: AWSError, data: S3Control.Types.PutJobTaggingResult) => void): Request<S3Control.Types.PutJobTaggingResult, AWSError>;
  /**
   * Associates an access control policy with the specified Multi-Region Access Point. Each Multi-Region Access Point can have only one policy, so a request made to this action replaces any existing policy that is associated with the specified Multi-Region Access Point. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to PutMultiRegionAccessPointPolicy:    GetMultiRegionAccessPointPolicy     GetMultiRegionAccessPointPolicyStatus   
   */
  putMultiRegionAccessPointPolicy(params: S3Control.Types.PutMultiRegionAccessPointPolicyRequest, callback?: (err: AWSError, data: S3Control.Types.PutMultiRegionAccessPointPolicyResult) => void): Request<S3Control.Types.PutMultiRegionAccessPointPolicyResult, AWSError>;
  /**
   * Associates an access control policy with the specified Multi-Region Access Point. Each Multi-Region Access Point can have only one policy, so a request made to this action replaces any existing policy that is associated with the specified Multi-Region Access Point. This action will always be routed to the US West (Oregon) Region. For more information about the restrictions around managing Multi-Region Access Points, see Managing Multi-Region Access Points in the Amazon S3 User Guide. The following actions are related to PutMultiRegionAccessPointPolicy:    GetMultiRegionAccessPointPolicy     GetMultiRegionAccessPointPolicyStatus   
   */
  putMultiRegionAccessPointPolicy(callback?: (err: AWSError, data: S3Control.Types.PutMultiRegionAccessPointPolicyResult) => void): Request<S3Control.Types.PutMultiRegionAccessPointPolicyResult, AWSError>;
  /**
   * Creates or modifies the PublicAccessBlock configuration for an Amazon Web Services account. For more information, see  Using Amazon S3 block public access. Related actions include:    GetPublicAccessBlock     DeletePublicAccessBlock   
   */
  putPublicAccessBlock(params: S3Control.Types.PutPublicAccessBlockRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or modifies the PublicAccessBlock configuration for an Amazon Web Services account. For more information, see  Using Amazon S3 block public access. Related actions include:    GetPublicAccessBlock     DeletePublicAccessBlock   
   */
  putPublicAccessBlock(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Puts an Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Working with Amazon S3 Storage Lens in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:PutStorageLensConfiguration action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  putStorageLensConfiguration(params: S3Control.Types.PutStorageLensConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Puts an Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Working with Amazon S3 Storage Lens in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:PutStorageLensConfiguration action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  putStorageLensConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Put or replace tags on an existing Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:PutStorageLensConfigurationTagging action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  putStorageLensConfigurationTagging(params: S3Control.Types.PutStorageLensConfigurationTaggingRequest, callback?: (err: AWSError, data: S3Control.Types.PutStorageLensConfigurationTaggingResult) => void): Request<S3Control.Types.PutStorageLensConfigurationTaggingResult, AWSError>;
  /**
   * Put or replace tags on an existing Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens  in the Amazon S3 User Guide.  To use this action, you must have permission to perform the s3:PutStorageLensConfigurationTagging action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the Amazon S3 User Guide. 
   */
  putStorageLensConfigurationTagging(callback?: (err: AWSError, data: S3Control.Types.PutStorageLensConfigurationTaggingResult) => void): Request<S3Control.Types.PutStorageLensConfigurationTaggingResult, AWSError>;
  /**
   * Updates an existing S3 Batch Operations job's priority. For more information, see S3 Batch Operations in the Amazon S3 User Guide.  Related actions include:    CreateJob     ListJobs     DescribeJob     UpdateJobStatus   
   */
  updateJobPriority(params: S3Control.Types.UpdateJobPriorityRequest, callback?: (err: AWSError, data: S3Control.Types.UpdateJobPriorityResult) => void): Request<S3Control.Types.UpdateJobPriorityResult, AWSError>;
  /**
   * Updates an existing S3 Batch Operations job's priority. For more information, see S3 Batch Operations in the Amazon S3 User Guide.  Related actions include:    CreateJob     ListJobs     DescribeJob     UpdateJobStatus   
   */
  updateJobPriority(callback?: (err: AWSError, data: S3Control.Types.UpdateJobPriorityResult) => void): Request<S3Control.Types.UpdateJobPriorityResult, AWSError>;
  /**
   * Updates the status for the specified job. Use this action to confirm that you want to run a job or to cancel an existing job. For more information, see S3 Batch Operations in the Amazon S3 User Guide.  Related actions include:    CreateJob     ListJobs     DescribeJob     UpdateJobStatus   
   */
  updateJobStatus(params: S3Control.Types.UpdateJobStatusRequest, callback?: (err: AWSError, data: S3Control.Types.UpdateJobStatusResult) => void): Request<S3Control.Types.UpdateJobStatusResult, AWSError>;
  /**
   * Updates the status for the specified job. Use this action to confirm that you want to run a job or to cancel an existing job. For more information, see S3 Batch Operations in the Amazon S3 User Guide.  Related actions include:    CreateJob     ListJobs     DescribeJob     UpdateJobStatus   
   */
  updateJobStatus(callback?: (err: AWSError, data: S3Control.Types.UpdateJobStatusResult) => void): Request<S3Control.Types.UpdateJobStatusResult, AWSError>;
}
declare namespace S3Control {
  export interface AbortIncompleteMultipartUpload {
    /**
     * Specifies the number of days after which Amazon S3 aborts an incomplete multipart upload to the Outposts bucket.
     */
    DaysAfterInitiation?: DaysAfterInitiation;
  }
  export interface AccessPoint {
    /**
     * The name of this access point.
     */
    Name: AccessPointName;
    /**
     * Indicates whether this access point allows access from the public internet. If VpcConfiguration is specified for this access point, then NetworkOrigin is VPC, and the access point doesn't allow access from the public internet. Otherwise, NetworkOrigin is Internet, and the access point allows access from the public internet, subject to the access point and bucket access policies.
     */
    NetworkOrigin: NetworkOrigin;
    /**
     * The virtual private cloud (VPC) configuration for this access point, if one exists.  This element is empty if this access point is an Amazon S3 on Outposts access point that is used by other Amazon Web Services. 
     */
    VpcConfiguration?: VpcConfiguration;
    /**
     * The name of the bucket associated with this access point.
     */
    Bucket: BucketName;
    /**
     * The ARN for the access point.
     */
    AccessPointArn?: S3AccessPointArn;
    /**
     * The name or alias of the access point.
     */
    Alias?: Alias;
  }
  export type AccessPointList = AccessPoint[];
  export type AccessPointName = string;
  export type AccountId = string;
  export interface AccountLevel {
    /**
     * A container for the S3 Storage Lens activity metrics.
     */
    ActivityMetrics?: ActivityMetrics;
    /**
     * A container for the S3 Storage Lens bucket-level configuration.
     */
    BucketLevel: BucketLevel;
  }
  export interface ActivityMetrics {
    /**
     * A container for whether the activity metrics are enabled.
     */
    IsEnabled?: IsEnabled;
  }
  export type Alias = string;
  export type AsyncCreationTimestamp = Date;
  export interface AsyncErrorDetails {
    /**
     * A string that uniquely identifies the error condition.
     */
    Code?: MaxLength1024String;
    /**
     * A generic descritpion of the error condition in English.
     */
    Message?: MaxLength1024String;
    /**
     * The identifier of the resource associated with the error.
     */
    Resource?: MaxLength1024String;
    /**
     * The ID of the request associated with the error.
     */
    RequestId?: MaxLength1024String;
  }
  export interface AsyncOperation {
    /**
     * The time that the request was sent to the service.
     */
    CreationTime?: AsyncCreationTimestamp;
    /**
     * The specific operation for the asynchronous request.
     */
    Operation?: AsyncOperationName;
    /**
     * The request token associated with the request.
     */
    RequestTokenARN?: AsyncRequestTokenARN;
    /**
     * The parameters associated with the request.
     */
    RequestParameters?: AsyncRequestParameters;
    /**
     * The current status of the request.
     */
    RequestStatus?: AsyncRequestStatus;
    /**
     * The details of the response.
     */
    ResponseDetails?: AsyncResponseDetails;
  }
  export type AsyncOperationName = "CreateMultiRegionAccessPoint"|"DeleteMultiRegionAccessPoint"|"PutMultiRegionAccessPointPolicy"|string;
  export interface AsyncRequestParameters {
    /**
     * A container of the parameters for a CreateMultiRegionAccessPoint request.
     */
    CreateMultiRegionAccessPointRequest?: CreateMultiRegionAccessPointInput;
    /**
     * A container of the parameters for a DeleteMultiRegionAccessPoint request.
     */
    DeleteMultiRegionAccessPointRequest?: DeleteMultiRegionAccessPointInput;
    /**
     * A container of the parameters for a PutMultiRegionAccessPoint request.
     */
    PutMultiRegionAccessPointPolicyRequest?: PutMultiRegionAccessPointPolicyInput;
  }
  export type AsyncRequestStatus = string;
  export type AsyncRequestTokenARN = string;
  export interface AsyncResponseDetails {
    /**
     * The details for the Multi-Region Access Point.
     */
    MultiRegionAccessPointDetails?: MultiRegionAccessPointsAsyncResponse;
    /**
     * Error details for an asynchronous request.
     */
    ErrorDetails?: AsyncErrorDetails;
  }
  export interface AwsLambdaTransformation {
    /**
     * The Amazon Resource Name (ARN) of the Lambda function.
     */
    FunctionArn: FunctionArnString;
    /**
     * Additional JSON that provides supplemental data to the Lambda function used to transform objects.
     */
    FunctionPayload?: AwsLambdaTransformationPayload;
  }
  export type AwsLambdaTransformationPayload = string;
  export type AwsOrgArn = string;
  export type Boolean = boolean;
  export type BucketCannedACL = "private"|"public-read"|"public-read-write"|"authenticated-read"|string;
  export interface BucketLevel {
    /**
     * A container for the bucket-level activity metrics for Amazon S3 Storage Lens
     */
    ActivityMetrics?: ActivityMetrics;
    /**
     * A container for the bucket-level prefix-level metrics for S3 Storage Lens
     */
    PrefixLevel?: PrefixLevel;
  }
  export type BucketLocationConstraint = "EU"|"eu-west-1"|"us-west-1"|"us-west-2"|"ap-south-1"|"ap-southeast-1"|"ap-southeast-2"|"ap-northeast-1"|"sa-east-1"|"cn-north-1"|"eu-central-1"|string;
  export type BucketName = string;
  export type Buckets = S3BucketArnString[];
  export type ConfigId = string;
  export type ConfirmRemoveSelfBucketAccess = boolean;
  export type ConfirmationRequired = boolean;
  export type ContinuationToken = string;
  export interface CreateAccessPointForObjectLambdaRequest {
    /**
     * The Amazon Web Services account ID for owner of the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name you want to assign to this Object Lambda Access Point.
     */
    Name: ObjectLambdaAccessPointName;
    /**
     * Object Lambda Access Point configuration as a JSON document.
     */
    Configuration: ObjectLambdaConfiguration;
  }
  export interface CreateAccessPointForObjectLambdaResult {
    /**
     * Specifies the ARN for the Object Lambda Access Point.
     */
    ObjectLambdaAccessPointArn?: ObjectLambdaAccessPointArn;
  }
  export interface CreateAccessPointRequest {
    /**
     * The Amazon Web Services account ID for the owner of the bucket for which you want to create an access point.
     */
    AccountId: AccountId;
    /**
     * The name you want to assign to this access point.
     */
    Name: AccessPointName;
    /**
     * The name of the bucket that you want to associate this access point with. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
    /**
     * If you include this field, Amazon S3 restricts access to this access point to requests from the specified virtual private cloud (VPC).  This is required for creating an access point for Amazon S3 on Outposts buckets. 
     */
    VpcConfiguration?: VpcConfiguration;
    /**
     *  The PublicAccessBlock configuration that you want to apply to the access point. 
     */
    PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
  }
  export interface CreateAccessPointResult {
    /**
     * The ARN of the access point.  This is only supported by Amazon S3 on Outposts. 
     */
    AccessPointArn?: S3AccessPointArn;
    /**
     * The name or alias of the access point.
     */
    Alias?: Alias;
  }
  export interface CreateBucketConfiguration {
    /**
     * Specifies the Region where the bucket will be created. If you are creating a bucket on the US East (N. Virginia) Region (us-east-1), you do not need to specify the location.   This is not supported by Amazon S3 on Outposts buckets. 
     */
    LocationConstraint?: BucketLocationConstraint;
  }
  export interface CreateBucketRequest {
    /**
     * The canned ACL to apply to the bucket.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    ACL?: BucketCannedACL;
    /**
     * The name of the bucket.
     */
    Bucket: BucketName;
    /**
     * The configuration information for the bucket.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    CreateBucketConfiguration?: CreateBucketConfiguration;
    /**
     * Allows grantee the read, write, read ACP, and write ACP permissions on the bucket.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    GrantFullControl?: GrantFullControl;
    /**
     * Allows grantee to list the objects in the bucket.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    GrantRead?: GrantRead;
    /**
     * Allows grantee to read the bucket ACL.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    GrantReadACP?: GrantReadACP;
    /**
     * Allows grantee to create, overwrite, and delete any object in the bucket.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    GrantWrite?: GrantWrite;
    /**
     * Allows grantee to write the ACL for the applicable bucket.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    GrantWriteACP?: GrantWriteACP;
    /**
     * Specifies whether you want S3 Object Lock to be enabled for the new bucket.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    ObjectLockEnabledForBucket?: ObjectLockEnabledForBucket;
    /**
     * The ID of the Outposts where the bucket is being created.  This is required by Amazon S3 on Outposts buckets. 
     */
    OutpostId?: NonEmptyMaxLength64String;
  }
  export interface CreateBucketResult {
    /**
     * The location of the bucket.
     */
    Location?: Location;
    /**
     * The Amazon Resource Name (ARN) of the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    BucketArn?: S3RegionalBucketArn;
  }
  export interface CreateJobRequest {
    /**
     * The Amazon Web Services account ID that creates the job.
     */
    AccountId: AccountId;
    /**
     * Indicates whether confirmation is required before Amazon S3 runs the job. Confirmation is only required for jobs created through the Amazon S3 console.
     */
    ConfirmationRequired?: ConfirmationRequired;
    /**
     * The action that you want this job to perform on every object listed in the manifest. For more information about the available actions, see Operations in the Amazon S3 User Guide.
     */
    Operation: JobOperation;
    /**
     * Configuration parameters for the optional job-completion report.
     */
    Report: JobReport;
    /**
     * An idempotency token to ensure that you don't accidentally submit the same request twice. You can use any string up to the maximum length.
     */
    ClientRequestToken: NonEmptyMaxLength64String;
    /**
     * Configuration parameters for the manifest.
     */
    Manifest: JobManifest;
    /**
     * A description for this job. You can use any string within the permitted length. Descriptions don't need to be unique and can be used for multiple jobs.
     */
    Description?: NonEmptyMaxLength256String;
    /**
     * The numerical priority for this job. Higher numbers indicate higher priority.
     */
    Priority: JobPriority;
    /**
     * The Amazon Resource Name (ARN) for the Identity and Access Management (IAM) role that Batch Operations will use to run this job's action on every object in the manifest.
     */
    RoleArn: IAMRoleArn;
    /**
     * A set of tags to associate with the S3 Batch Operations job. This is an optional parameter. 
     */
    Tags?: S3TagSet;
  }
  export interface CreateJobResult {
    /**
     * The ID for this job. Amazon S3 generates this ID automatically and returns it after a successful Create Job request.
     */
    JobId?: JobId;
  }
  export interface CreateMultiRegionAccessPointInput {
    /**
     * The name of the Multi-Region Access Point associated with this request.
     */
    Name: MultiRegionAccessPointName;
    PublicAccessBlock?: PublicAccessBlockConfiguration;
    /**
     * The buckets in different Regions that are associated with the Multi-Region Access Point.
     */
    Regions: RegionCreationList;
  }
  export interface CreateMultiRegionAccessPointRequest {
    /**
     * The Amazon Web Services account ID for the owner of the Multi-Region Access Point. The owner of the Multi-Region Access Point also must own the underlying buckets.
     */
    AccountId: AccountId;
    /**
     * An idempotency token used to identify the request and guarantee that requests are unique.
     */
    ClientToken: MultiRegionAccessPointClientToken;
    /**
     * A container element containing details about the Multi-Region Access Point.
     */
    Details: CreateMultiRegionAccessPointInput;
  }
  export interface CreateMultiRegionAccessPointResult {
    /**
     * The request token associated with the request. You can use this token with DescribeMultiRegionAccessPointOperation to determine the status of asynchronous requests.
     */
    RequestTokenARN?: AsyncRequestTokenARN;
  }
  export type CreationDate = Date;
  export type CreationTimestamp = Date;
  export type _Date = Date;
  export type Days = number;
  export type DaysAfterInitiation = number;
  export interface DeleteAccessPointForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the access point you want to delete.
     */
    Name: ObjectLambdaAccessPointName;
  }
  export interface DeleteAccessPointPolicyForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the Object Lambda Access Point you want to delete the policy for.
     */
    Name: ObjectLambdaAccessPointName;
  }
  export interface DeleteAccessPointPolicyRequest {
    /**
     * The account ID for the account that owns the specified access point.
     */
    AccountId: AccountId;
    /**
     * The name of the access point whose policy you want to delete. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the access point accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/accesspoint/&lt;my-accesspoint-name&gt;. For example, to access the access point reports-ap through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/accesspoint/reports-ap. The value must be URL encoded. 
     */
    Name: AccessPointName;
  }
  export interface DeleteAccessPointRequest {
    /**
     * The account ID for the account that owns the specified access point.
     */
    AccountId: AccountId;
    /**
     * The name of the access point you want to delete. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the access point accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/accesspoint/&lt;my-accesspoint-name&gt;. For example, to access the access point reports-ap through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/accesspoint/reports-ap. The value must be URL encoded. 
     */
    Name: AccessPointName;
  }
  export interface DeleteBucketLifecycleConfigurationRequest {
    /**
     * The account ID of the lifecycle configuration to delete.
     */
    AccountId: AccountId;
    /**
     * Specifies the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
  }
  export interface DeleteBucketPolicyRequest {
    /**
     * The account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * Specifies the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
  }
  export interface DeleteBucketRequest {
    /**
     * The account ID that owns the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * Specifies the bucket being deleted. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
  }
  export interface DeleteBucketTaggingRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket tag set to be removed.
     */
    AccountId: AccountId;
    /**
     * The bucket ARN that has the tag set to be removed. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
  }
  export interface DeleteJobTaggingRequest {
    /**
     * The Amazon Web Services account ID associated with the S3 Batch Operations job.
     */
    AccountId: AccountId;
    /**
     * The ID for the S3 Batch Operations job whose tags you want to delete.
     */
    JobId: JobId;
  }
  export interface DeleteJobTaggingResult {
  }
  export interface DeleteMultiRegionAccessPointInput {
    /**
     * The name of the Multi-Region Access Point associated with this request.
     */
    Name: MultiRegionAccessPointName;
  }
  export interface DeleteMultiRegionAccessPointRequest {
    /**
     * The Amazon Web Services account ID for the owner of the Multi-Region Access Point.
     */
    AccountId: AccountId;
    /**
     * An idempotency token used to identify the request and guarantee that requests are unique.
     */
    ClientToken: MultiRegionAccessPointClientToken;
    /**
     * A container element containing details about the Multi-Region Access Point.
     */
    Details: DeleteMultiRegionAccessPointInput;
  }
  export interface DeleteMultiRegionAccessPointResult {
    /**
     * The request token associated with the request. You can use this token with DescribeMultiRegionAccessPointOperation to determine the status of asynchronous requests.
     */
    RequestTokenARN?: AsyncRequestTokenARN;
  }
  export interface DeletePublicAccessBlockRequest {
    /**
     * The account ID for the Amazon Web Services account whose PublicAccessBlock configuration you want to remove.
     */
    AccountId: AccountId;
  }
  export interface DeleteStorageLensConfigurationRequest {
    /**
     * The ID of the S3 Storage Lens configuration.
     */
    ConfigId: ConfigId;
    /**
     * The account ID of the requester.
     */
    AccountId: AccountId;
  }
  export interface DeleteStorageLensConfigurationTaggingRequest {
    /**
     * The ID of the S3 Storage Lens configuration.
     */
    ConfigId: ConfigId;
    /**
     * The account ID of the requester.
     */
    AccountId: AccountId;
  }
  export interface DeleteStorageLensConfigurationTaggingResult {
  }
  export interface DescribeJobRequest {
    /**
     * The Amazon Web Services account ID associated with the S3 Batch Operations job.
     */
    AccountId: AccountId;
    /**
     * The ID for the job whose information you want to retrieve.
     */
    JobId: JobId;
  }
  export interface DescribeJobResult {
    /**
     * Contains the configuration parameters and status for the job specified in the Describe Job request.
     */
    Job?: JobDescriptor;
  }
  export interface DescribeMultiRegionAccessPointOperationRequest {
    /**
     * The Amazon Web Services account ID for the owner of the Multi-Region Access Point.
     */
    AccountId: AccountId;
    /**
     * The request token associated with the request you want to know about. This request token is returned as part of the response when you make an asynchronous request. You provide this token to query about the status of the asynchronous action.
     */
    RequestTokenARN: AsyncRequestTokenARN;
  }
  export interface DescribeMultiRegionAccessPointOperationResult {
    /**
     * A container element containing the details of the asynchronous operation.
     */
    AsyncOperation?: AsyncOperation;
  }
  export type Endpoints = {[key: string]: NonEmptyMaxLength1024String};
  export interface EstablishedMultiRegionAccessPointPolicy {
    /**
     * The details of the last established policy.
     */
    Policy?: Policy;
  }
  export interface Exclude {
    /**
     * A container for the S3 Storage Lens bucket excludes.
     */
    Buckets?: Buckets;
    /**
     * A container for the S3 Storage Lens Region excludes.
     */
    Regions?: Regions;
  }
  export type ExpirationStatus = "Enabled"|"Disabled"|string;
  export type ExpiredObjectDeleteMarker = boolean;
  export type Format = "CSV"|"Parquet"|string;
  export type FunctionArnString = string;
  export interface GetAccessPointConfigurationForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the Object Lambda Access Point you want to return the configuration for.
     */
    Name: ObjectLambdaAccessPointName;
  }
  export interface GetAccessPointConfigurationForObjectLambdaResult {
    /**
     * Object Lambda Access Point configuration document.
     */
    Configuration?: ObjectLambdaConfiguration;
  }
  export interface GetAccessPointForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the Object Lambda Access Point.
     */
    Name: ObjectLambdaAccessPointName;
  }
  export interface GetAccessPointForObjectLambdaResult {
    /**
     * The name of the Object Lambda Access Point.
     */
    Name?: ObjectLambdaAccessPointName;
    /**
     * Configuration to block all public access. This setting is turned on and can not be edited. 
     */
    PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
    /**
     * The date and time when the specified Object Lambda Access Point was created.
     */
    CreationDate?: CreationDate;
  }
  export interface GetAccessPointPolicyForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the Object Lambda Access Point.
     */
    Name: ObjectLambdaAccessPointName;
  }
  export interface GetAccessPointPolicyForObjectLambdaResult {
    /**
     * Object Lambda Access Point resource policy document.
     */
    Policy?: ObjectLambdaPolicy;
  }
  export interface GetAccessPointPolicyRequest {
    /**
     * The account ID for the account that owns the specified access point.
     */
    AccountId: AccountId;
    /**
     * The name of the access point whose policy you want to retrieve. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the access point accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/accesspoint/&lt;my-accesspoint-name&gt;. For example, to access the access point reports-ap through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/accesspoint/reports-ap. The value must be URL encoded. 
     */
    Name: AccessPointName;
  }
  export interface GetAccessPointPolicyResult {
    /**
     * The access point policy associated with the specified access point.
     */
    Policy?: Policy;
  }
  export interface GetAccessPointPolicyStatusForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the Object Lambda Access Point.
     */
    Name: ObjectLambdaAccessPointName;
  }
  export interface GetAccessPointPolicyStatusForObjectLambdaResult {
    PolicyStatus?: PolicyStatus;
  }
  export interface GetAccessPointPolicyStatusRequest {
    /**
     * The account ID for the account that owns the specified access point.
     */
    AccountId: AccountId;
    /**
     * The name of the access point whose policy status you want to retrieve.
     */
    Name: AccessPointName;
  }
  export interface GetAccessPointPolicyStatusResult {
    /**
     * Indicates the current policy status of the specified access point.
     */
    PolicyStatus?: PolicyStatus;
  }
  export interface GetAccessPointRequest {
    /**
     * The account ID for the account that owns the specified access point.
     */
    AccountId: AccountId;
    /**
     * The name of the access point whose configuration information you want to retrieve. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the access point accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/accesspoint/&lt;my-accesspoint-name&gt;. For example, to access the access point reports-ap through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/accesspoint/reports-ap. The value must be URL encoded. 
     */
    Name: AccessPointName;
  }
  export interface GetAccessPointResult {
    /**
     * The name of the specified access point.
     */
    Name?: AccessPointName;
    /**
     * The name of the bucket associated with the specified access point.
     */
    Bucket?: BucketName;
    /**
     * Indicates whether this access point allows access from the public internet. If VpcConfiguration is specified for this access point, then NetworkOrigin is VPC, and the access point doesn't allow access from the public internet. Otherwise, NetworkOrigin is Internet, and the access point allows access from the public internet, subject to the access point and bucket access policies. This will always be true for an Amazon S3 on Outposts access point
     */
    NetworkOrigin?: NetworkOrigin;
    /**
     * Contains the virtual private cloud (VPC) configuration for the specified access point.  This element is empty if this access point is an Amazon S3 on Outposts access point that is used by other Amazon Web Services. 
     */
    VpcConfiguration?: VpcConfiguration;
    PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
    /**
     * The date and time when the specified access point was created.
     */
    CreationDate?: CreationDate;
    /**
     * The name or alias of the access point.
     */
    Alias?: Alias;
    /**
     * The ARN of the access point.
     */
    AccessPointArn?: S3AccessPointArn;
    /**
     * The VPC endpoint for the access point.
     */
    Endpoints?: Endpoints;
  }
  export interface GetBucketLifecycleConfigurationRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
  }
  export interface GetBucketLifecycleConfigurationResult {
    /**
     * Container for the lifecycle rule of the Outposts bucket.
     */
    Rules?: LifecycleRules;
  }
  export interface GetBucketPolicyRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * Specifies the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
  }
  export interface GetBucketPolicyResult {
    /**
     * The policy of the Outposts bucket.
     */
    Policy?: Policy;
  }
  export interface GetBucketRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * Specifies the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
  }
  export interface GetBucketResult {
    /**
     * The Outposts bucket requested.
     */
    Bucket?: BucketName;
    /**
     * 
     */
    PublicAccessBlockEnabled?: PublicAccessBlockEnabled;
    /**
     * The creation date of the Outposts bucket.
     */
    CreationDate?: CreationDate;
  }
  export interface GetBucketTaggingRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * Specifies the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
  }
  export interface GetBucketTaggingResult {
    /**
     * The tags set of the Outposts bucket.
     */
    TagSet: S3TagSet;
  }
  export interface GetJobTaggingRequest {
    /**
     * The Amazon Web Services account ID associated with the S3 Batch Operations job.
     */
    AccountId: AccountId;
    /**
     * The ID for the S3 Batch Operations job whose tags you want to retrieve.
     */
    JobId: JobId;
  }
  export interface GetJobTaggingResult {
    /**
     * The set of tags associated with the S3 Batch Operations job.
     */
    Tags?: S3TagSet;
  }
  export interface GetMultiRegionAccessPointPolicyRequest {
    /**
     * The Amazon Web Services account ID for the owner of the Multi-Region Access Point.
     */
    AccountId: AccountId;
    /**
     * Specifies the Multi-Region Access Point. The name of the Multi-Region Access Point is different from the alias. For more information about the distinction between the name and the alias of an Multi-Region Access Point, see Managing Multi-Region Access Points in the Amazon S3 User Guide.
     */
    Name: MultiRegionAccessPointName;
  }
  export interface GetMultiRegionAccessPointPolicyResult {
    /**
     * The policy associated with the specified Multi-Region Access Point.
     */
    Policy?: MultiRegionAccessPointPolicyDocument;
  }
  export interface GetMultiRegionAccessPointPolicyStatusRequest {
    /**
     * The Amazon Web Services account ID for the owner of the Multi-Region Access Point.
     */
    AccountId: AccountId;
    /**
     * Specifies the Multi-Region Access Point. The name of the Multi-Region Access Point is different from the alias. For more information about the distinction between the name and the alias of an Multi-Region Access Point, see Managing Multi-Region Access Points in the Amazon S3 User Guide.
     */
    Name: MultiRegionAccessPointName;
  }
  export interface GetMultiRegionAccessPointPolicyStatusResult {
    Established?: PolicyStatus;
  }
  export interface GetMultiRegionAccessPointRequest {
    /**
     * The Amazon Web Services account ID for the owner of the Multi-Region Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the Multi-Region Access Point whose configuration information you want to receive. The name of the Multi-Region Access Point is different from the alias. For more information about the distinction between the name and the alias of an Multi-Region Access Point, see Managing Multi-Region Access Points in the Amazon S3 User Guide.
     */
    Name: MultiRegionAccessPointName;
  }
  export interface GetMultiRegionAccessPointResult {
    /**
     * A container element containing the details of the requested Multi-Region Access Point.
     */
    AccessPoint?: MultiRegionAccessPointReport;
  }
  export interface GetPublicAccessBlockOutput {
    /**
     * The PublicAccessBlock configuration currently in effect for this Amazon Web Services account.
     */
    PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
  }
  export interface GetPublicAccessBlockRequest {
    /**
     * The account ID for the Amazon Web Services account whose PublicAccessBlock configuration you want to retrieve.
     */
    AccountId: AccountId;
  }
  export interface GetStorageLensConfigurationRequest {
    /**
     * The ID of the Amazon S3 Storage Lens configuration.
     */
    ConfigId: ConfigId;
    /**
     * The account ID of the requester.
     */
    AccountId: AccountId;
  }
  export interface GetStorageLensConfigurationResult {
    /**
     * The S3 Storage Lens configuration requested.
     */
    StorageLensConfiguration?: StorageLensConfiguration;
  }
  export interface GetStorageLensConfigurationTaggingRequest {
    /**
     * The ID of the Amazon S3 Storage Lens configuration.
     */
    ConfigId: ConfigId;
    /**
     * The account ID of the requester.
     */
    AccountId: AccountId;
  }
  export interface GetStorageLensConfigurationTaggingResult {
    /**
     * The tags of S3 Storage Lens configuration requested.
     */
    Tags?: StorageLensTags;
  }
  export type GrantFullControl = string;
  export type GrantRead = string;
  export type GrantReadACP = string;
  export type GrantWrite = string;
  export type GrantWriteACP = string;
  export type IAMRoleArn = string;
  export type ID = string;
  export interface Include {
    /**
     * A container for the S3 Storage Lens bucket includes.
     */
    Buckets?: Buckets;
    /**
     * A container for the S3 Storage Lens Region includes.
     */
    Regions?: Regions;
  }
  export type IsEnabled = boolean;
  export type IsPublic = boolean;
  export type JobArn = string;
  export type JobCreationTime = Date;
  export interface JobDescriptor {
    /**
     * The ID for the specified job.
     */
    JobId?: JobId;
    /**
     * Indicates whether confirmation is required before Amazon S3 begins running the specified job. Confirmation is required only for jobs created through the Amazon S3 console.
     */
    ConfirmationRequired?: ConfirmationRequired;
    /**
     * The description for this job, if one was provided in this job's Create Job request.
     */
    Description?: NonEmptyMaxLength256String;
    /**
     * The Amazon Resource Name (ARN) for this job.
     */
    JobArn?: JobArn;
    /**
     * The current status of the specified job.
     */
    Status?: JobStatus;
    /**
     * The configuration information for the specified job's manifest object.
     */
    Manifest?: JobManifest;
    /**
     * The operation that the specified job is configured to run on the objects listed in the manifest.
     */
    Operation?: JobOperation;
    /**
     * The priority of the specified job.
     */
    Priority?: JobPriority;
    /**
     * Describes the total number of tasks that the specified job has run, the number of tasks that succeeded, and the number of tasks that failed.
     */
    ProgressSummary?: JobProgressSummary;
    /**
     * The reason for updating the job.
     */
    StatusUpdateReason?: JobStatusUpdateReason;
    /**
     * If the specified job failed, this field contains information describing the failure.
     */
    FailureReasons?: JobFailureList;
    /**
     * Contains the configuration information for the job-completion report if you requested one in the Create Job request.
     */
    Report?: JobReport;
    /**
     * A timestamp indicating when this job was created.
     */
    CreationTime?: JobCreationTime;
    /**
     * A timestamp indicating when this job terminated. A job's termination date is the date and time when it succeeded, failed, or was canceled.
     */
    TerminationDate?: JobTerminationDate;
    /**
     * The Amazon Resource Name (ARN) for the Identity and Access Management (IAM) role assigned to run the tasks for this job.
     */
    RoleArn?: IAMRoleArn;
    /**
     * The timestamp when this job was suspended, if it has been suspended.
     */
    SuspendedDate?: SuspendedDate;
    /**
     * The reason why the specified job was suspended. A job is only suspended if you create it through the Amazon S3 console. When you create the job, it enters the Suspended state to await confirmation before running. After you confirm the job, it automatically exits the Suspended state.
     */
    SuspendedCause?: SuspendedCause;
  }
  export interface JobFailure {
    /**
     * The failure code, if any, for the specified job.
     */
    FailureCode?: JobFailureCode;
    /**
     * The failure reason, if any, for the specified job.
     */
    FailureReason?: JobFailureReason;
  }
  export type JobFailureCode = string;
  export type JobFailureList = JobFailure[];
  export type JobFailureReason = string;
  export type JobId = string;
  export interface JobListDescriptor {
    /**
     * The ID for the specified job.
     */
    JobId?: JobId;
    /**
     * The user-specified description that was included in the specified job's Create Job request.
     */
    Description?: NonEmptyMaxLength256String;
    /**
     * The operation that the specified job is configured to run on every object listed in the manifest.
     */
    Operation?: OperationName;
    /**
     * The current priority for the specified job.
     */
    Priority?: JobPriority;
    /**
     * The specified job's current status.
     */
    Status?: JobStatus;
    /**
     * A timestamp indicating when the specified job was created.
     */
    CreationTime?: JobCreationTime;
    /**
     * A timestamp indicating when the specified job terminated. A job's termination date is the date and time when it succeeded, failed, or was canceled.
     */
    TerminationDate?: JobTerminationDate;
    /**
     * Describes the total number of tasks that the specified job has run, the number of tasks that succeeded, and the number of tasks that failed.
     */
    ProgressSummary?: JobProgressSummary;
  }
  export type JobListDescriptorList = JobListDescriptor[];
  export interface JobManifest {
    /**
     * Describes the format of the specified job's manifest. If the manifest is in CSV format, also describes the columns contained within the manifest.
     */
    Spec: JobManifestSpec;
    /**
     * Contains the information required to locate the specified job's manifest.
     */
    Location: JobManifestLocation;
  }
  export type JobManifestFieldList = JobManifestFieldName[];
  export type JobManifestFieldName = "Ignore"|"Bucket"|"Key"|"VersionId"|string;
  export type JobManifestFormat = "S3BatchOperations_CSV_20180820"|"S3InventoryReport_CSV_20161130"|string;
  export interface JobManifestLocation {
    /**
     * The Amazon Resource Name (ARN) for a manifest object.  Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see  XML related object key constraints. 
     */
    ObjectArn: S3KeyArnString;
    /**
     * The optional version ID to identify a specific version of the manifest object.
     */
    ObjectVersionId?: S3ObjectVersionId;
    /**
     * The ETag for the specified manifest object.
     */
    ETag: NonEmptyMaxLength1024String;
  }
  export interface JobManifestSpec {
    /**
     * Indicates which of the available formats the specified manifest uses.
     */
    Format: JobManifestFormat;
    /**
     * If the specified manifest object is in the S3BatchOperations_CSV_20180820 format, this element describes which columns contain the required data.
     */
    Fields?: JobManifestFieldList;
  }
  export type JobNumberOfTasksFailed = number;
  export type JobNumberOfTasksSucceeded = number;
  export interface JobOperation {
    /**
     * Directs the specified job to invoke an Lambda function on every object in the manifest.
     */
    LambdaInvoke?: LambdaInvokeOperation;
    /**
     * Directs the specified job to run a PUT Copy object call on every object in the manifest.
     */
    S3PutObjectCopy?: S3CopyObjectOperation;
    /**
     * Directs the specified job to run a PUT Object acl call on every object in the manifest.
     */
    S3PutObjectAcl?: S3SetObjectAclOperation;
    /**
     * Directs the specified job to run a PUT Object tagging call on every object in the manifest.
     */
    S3PutObjectTagging?: S3SetObjectTaggingOperation;
    /**
     * Directs the specified job to execute a DELETE Object tagging call on every object in the manifest.
     */
    S3DeleteObjectTagging?: S3DeleteObjectTaggingOperation;
    /**
     * Directs the specified job to initiate restore requests for every archived object in the manifest.
     */
    S3InitiateRestoreObject?: S3InitiateRestoreObjectOperation;
    S3PutObjectLegalHold?: S3SetObjectLegalHoldOperation;
    S3PutObjectRetention?: S3SetObjectRetentionOperation;
  }
  export type JobPriority = number;
  export interface JobProgressSummary {
    /**
     * 
     */
    TotalNumberOfTasks?: JobTotalNumberOfTasks;
    /**
     * 
     */
    NumberOfTasksSucceeded?: JobNumberOfTasksSucceeded;
    /**
     * 
     */
    NumberOfTasksFailed?: JobNumberOfTasksFailed;
  }
  export interface JobReport {
    /**
     * The Amazon Resource Name (ARN) for the bucket where specified job-completion report will be stored.
     */
    Bucket?: S3BucketArnString;
    /**
     * The format of the specified job-completion report.
     */
    Format?: JobReportFormat;
    /**
     * Indicates whether the specified job will generate a job-completion report.
     */
    Enabled: Boolean;
    /**
     * An optional prefix to describe where in the specified bucket the job-completion report will be stored. Amazon S3 stores the job-completion report at &lt;prefix&gt;/job-&lt;job-id&gt;/report.json.
     */
    Prefix?: ReportPrefixString;
    /**
     * Indicates whether the job-completion report will include details of all tasks or only failed tasks.
     */
    ReportScope?: JobReportScope;
  }
  export type JobReportFormat = "Report_CSV_20180820"|string;
  export type JobReportScope = "AllTasks"|"FailedTasksOnly"|string;
  export type JobStatus = "Active"|"Cancelled"|"Cancelling"|"Complete"|"Completing"|"Failed"|"Failing"|"New"|"Paused"|"Pausing"|"Preparing"|"Ready"|"Suspended"|string;
  export type JobStatusList = JobStatus[];
  export type JobStatusUpdateReason = string;
  export type JobTerminationDate = Date;
  export type JobTotalNumberOfTasks = number;
  export type KmsKeyArnString = string;
  export interface LambdaInvokeOperation {
    /**
     * The Amazon Resource Name (ARN) for the Lambda function that the specified job will invoke on every object in the manifest.
     */
    FunctionArn?: FunctionArnString;
  }
  export interface LifecycleConfiguration {
    /**
     * A lifecycle rule for individual objects in an Outposts bucket. 
     */
    Rules?: LifecycleRules;
  }
  export interface LifecycleExpiration {
    /**
     * Indicates at what date the object is to be deleted. Should be in GMT ISO 8601 format.
     */
    Date?: _Date;
    /**
     * Indicates the lifetime, in days, of the objects that are subject to the rule. The value must be a non-zero positive integer.
     */
    Days?: Days;
    /**
     * Indicates whether Amazon S3 will remove a delete marker with no noncurrent versions. If set to true, the delete marker will be expired. If set to false, the policy takes no action. This cannot be specified with Days or Date in a Lifecycle Expiration Policy.
     */
    ExpiredObjectDeleteMarker?: ExpiredObjectDeleteMarker;
  }
  export interface LifecycleRule {
    /**
     * Specifies the expiration for the lifecycle of the object in the form of date, days and, whether the object has a delete marker.
     */
    Expiration?: LifecycleExpiration;
    /**
     * Unique identifier for the rule. The value cannot be longer than 255 characters.
     */
    ID?: ID;
    /**
     * The container for the filter of lifecycle rule.
     */
    Filter?: LifecycleRuleFilter;
    /**
     * If 'Enabled', the rule is currently being applied. If 'Disabled', the rule is not currently being applied.
     */
    Status: ExpirationStatus;
    /**
     * Specifies when an Amazon S3 object transitions to a specified storage class.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    Transitions?: TransitionList;
    /**
     *  Specifies the transition rule for the lifecycle rule that describes when noncurrent objects transition to a specific storage class. If your bucket is versioning-enabled (or versioning is suspended), you can set this action to request that Amazon S3 transition noncurrent object versions to a specific storage class at a set period in the object's lifetime.   This is not supported by Amazon S3 on Outposts buckets. 
     */
    NoncurrentVersionTransitions?: NoncurrentVersionTransitionList;
    /**
     * The noncurrent version expiration of the lifecycle rule.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    NoncurrentVersionExpiration?: NoncurrentVersionExpiration;
    /**
     * Specifies the days since the initiation of an incomplete multipart upload that Amazon S3 waits before permanently removing all parts of the upload. For more information, see  Aborting Incomplete Multipart Uploads Using a Bucket Lifecycle Policy in the Amazon S3 User Guide.
     */
    AbortIncompleteMultipartUpload?: AbortIncompleteMultipartUpload;
  }
  export interface LifecycleRuleAndOperator {
    /**
     * Prefix identifying one or more objects to which the rule applies.
     */
    Prefix?: Prefix;
    /**
     * All of these tags must exist in the object's tag set in order for the rule to apply.
     */
    Tags?: S3TagSet;
  }
  export interface LifecycleRuleFilter {
    /**
     * Prefix identifying one or more objects to which the rule applies.  Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see  XML related object key constraints. 
     */
    Prefix?: Prefix;
    Tag?: S3Tag;
    /**
     * The container for the AND condition for the lifecycle rule.
     */
    And?: LifecycleRuleAndOperator;
  }
  export type LifecycleRules = LifecycleRule[];
  export interface ListAccessPointsForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * If the list has more access points than can be returned in one call to this API, this field contains a continuation token that you can provide in subsequent calls to this API to retrieve additional access points.
     */
    NextToken?: NonEmptyMaxLength1024String;
    /**
     * The maximum number of access points that you want to include in the list. If there are more than this number of access points, then the response will include a continuation token in the NextToken field that you can use to retrieve the next page of access points.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAccessPointsForObjectLambdaResult {
    /**
     * Returns list of Object Lambda Access Points.
     */
    ObjectLambdaAccessPointList?: ObjectLambdaAccessPointList;
    /**
     * If the list has more access points than can be returned in one call to this API, this field contains a continuation token that you can provide in subsequent calls to this API to retrieve additional access points.
     */
    NextToken?: NonEmptyMaxLength1024String;
  }
  export interface ListAccessPointsRequest {
    /**
     * The Amazon Web Services account ID for owner of the bucket whose access points you want to list.
     */
    AccountId: AccountId;
    /**
     * The name of the bucket whose associated access points you want to list. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket?: BucketName;
    /**
     * A continuation token. If a previous call to ListAccessPoints returned a continuation token in the NextToken field, then providing that value here causes Amazon S3 to retrieve the next page of results.
     */
    NextToken?: NonEmptyMaxLength1024String;
    /**
     * The maximum number of access points that you want to include in the list. If the specified bucket has more than this number of access points, then the response will include a continuation token in the NextToken field that you can use to retrieve the next page of access points.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAccessPointsResult {
    /**
     * Contains identification and configuration information for one or more access points associated with the specified bucket.
     */
    AccessPointList?: AccessPointList;
    /**
     * If the specified bucket has more access points than can be returned in one call to this API, this field contains a continuation token that you can provide in subsequent calls to this API to retrieve additional access points.
     */
    NextToken?: NonEmptyMaxLength1024String;
  }
  export interface ListJobsRequest {
    /**
     * The Amazon Web Services account ID associated with the S3 Batch Operations job.
     */
    AccountId: AccountId;
    /**
     * The List Jobs request returns jobs that match the statuses listed in this element.
     */
    JobStatuses?: JobStatusList;
    /**
     * A pagination token to request the next page of results. Use the token that Amazon S3 returned in the NextToken element of the ListJobsResult from the previous List Jobs request.
     */
    NextToken?: StringForNextToken;
    /**
     * The maximum number of jobs that Amazon S3 will include in the List Jobs response. If there are more jobs than this number, the response will include a pagination token in the NextToken field to enable you to retrieve the next page of results.
     */
    MaxResults?: MaxResults;
  }
  export interface ListJobsResult {
    /**
     * If the List Jobs request produced more than the maximum number of results, you can pass this value into a subsequent List Jobs request in order to retrieve the next page of results.
     */
    NextToken?: StringForNextToken;
    /**
     * The list of current jobs and jobs that have ended within the last 30 days.
     */
    Jobs?: JobListDescriptorList;
  }
  export interface ListMultiRegionAccessPointsRequest {
    /**
     * The Amazon Web Services account ID for the owner of the Multi-Region Access Point.
     */
    AccountId: AccountId;
    /**
     * Not currently used. Do not use this parameter.
     */
    NextToken?: NonEmptyMaxLength1024String;
    /**
     * Not currently used. Do not use this parameter.
     */
    MaxResults?: MaxResults;
  }
  export interface ListMultiRegionAccessPointsResult {
    /**
     * The list of Multi-Region Access Points associated with the user.
     */
    AccessPoints?: MultiRegionAccessPointReportList;
    /**
     * If the specified bucket has more Multi-Region Access Points than can be returned in one call to this action, this field contains a continuation token. You can use this token tin subsequent calls to this action to retrieve additional Multi-Region Access Points.
     */
    NextToken?: NonEmptyMaxLength1024String;
  }
  export interface ListRegionalBucketsRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * 
     */
    NextToken?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    MaxResults?: MaxResults;
    /**
     * The ID of the Outposts.  This is required by Amazon S3 on Outposts buckets. 
     */
    OutpostId?: NonEmptyMaxLength64String;
  }
  export interface ListRegionalBucketsResult {
    /**
     * 
     */
    RegionalBucketList?: RegionalBucketList;
    /**
     *  NextToken is sent when isTruncated is true, which means there are more buckets that can be listed. The next list requests to Amazon S3 can be continued with this NextToken. NextToken is obfuscated and is not a real key.
     */
    NextToken?: NonEmptyMaxLength1024String;
  }
  export interface ListStorageLensConfigurationEntry {
    /**
     * A container for the S3 Storage Lens configuration ID.
     */
    Id: ConfigId;
    /**
     * The ARN of the S3 Storage Lens configuration. This property is read-only.
     */
    StorageLensArn: StorageLensArn;
    /**
     * A container for the S3 Storage Lens home Region. Your metrics data is stored and retained in your designated S3 Storage Lens home Region.
     */
    HomeRegion: S3AWSRegion;
    /**
     * A container for whether the S3 Storage Lens configuration is enabled. This property is required.
     */
    IsEnabled?: IsEnabled;
  }
  export interface ListStorageLensConfigurationsRequest {
    /**
     * The account ID of the requester.
     */
    AccountId: AccountId;
    /**
     * A pagination token to request the next page of results.
     */
    NextToken?: ContinuationToken;
  }
  export interface ListStorageLensConfigurationsResult {
    /**
     * If the request produced more than the maximum number of S3 Storage Lens configuration results, you can pass this value into a subsequent request to retrieve the next page of results.
     */
    NextToken?: ContinuationToken;
    /**
     * A list of S3 Storage Lens configurations.
     */
    StorageLensConfigurationList?: StorageLensConfigurationList;
  }
  export type Location = string;
  export type MaxLength1024String = string;
  export type MaxResults = number;
  export type MinStorageBytesPercentage = number;
  export type MultiRegionAccessPointAlias = string;
  export type MultiRegionAccessPointClientToken = string;
  export type MultiRegionAccessPointName = string;
  export interface MultiRegionAccessPointPolicyDocument {
    /**
     * The last established policy for the Multi-Region Access Point.
     */
    Established?: EstablishedMultiRegionAccessPointPolicy;
    /**
     * The proposed policy for the Multi-Region Access Point.
     */
    Proposed?: ProposedMultiRegionAccessPointPolicy;
  }
  export interface MultiRegionAccessPointRegionalResponse {
    /**
     * The name of the Region in the Multi-Region Access Point.
     */
    Name?: RegionName;
    /**
     * The current status of the Multi-Region Access Point in this Region.
     */
    RequestStatus?: AsyncRequestStatus;
  }
  export type MultiRegionAccessPointRegionalResponseList = MultiRegionAccessPointRegionalResponse[];
  export interface MultiRegionAccessPointReport {
    /**
     * The name of the Multi-Region Access Point.
     */
    Name?: MultiRegionAccessPointName;
    /**
     * The alias for the Multi-Region Access Point. For more information about the distinction between the name and the alias of an Multi-Region Access Point, see Managing Multi-Region Access Points.
     */
    Alias?: MultiRegionAccessPointAlias;
    /**
     * When the Multi-Region Access Point create request was received.
     */
    CreatedAt?: CreationTimestamp;
    PublicAccessBlock?: PublicAccessBlockConfiguration;
    /**
     * The current status of the Multi-Region Access Point.  CREATING and DELETING are temporary states that exist while the request is propogating and being completed. If a Multi-Region Access Point has a status of PARTIALLY_CREATED, you can retry creation or send a request to delete the Multi-Region Access Point. If a Multi-Region Access Point has a status of PARTIALLY_DELETED, you can retry a delete request to finish the deletion of the Multi-Region Access Point.
     */
    Status?: MultiRegionAccessPointStatus;
    /**
     * A collection of the Regions and buckets associated with the Multi-Region Access Point.
     */
    Regions?: RegionReportList;
  }
  export type MultiRegionAccessPointReportList = MultiRegionAccessPointReport[];
  export type MultiRegionAccessPointStatus = "READY"|"INCONSISTENT_ACROSS_REGIONS"|"CREATING"|"PARTIALLY_CREATED"|"PARTIALLY_DELETED"|"DELETING"|string;
  export interface MultiRegionAccessPointsAsyncResponse {
    /**
     * A collection of status information for the different Regions that a Multi-Region Access Point supports.
     */
    Regions?: MultiRegionAccessPointRegionalResponseList;
  }
  export type NetworkOrigin = "Internet"|"VPC"|string;
  export type NonEmptyMaxLength1024String = string;
  export type NonEmptyMaxLength2048String = string;
  export type NonEmptyMaxLength256String = string;
  export type NonEmptyMaxLength64String = string;
  export interface NoncurrentVersionExpiration {
    /**
     * Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action. For information about the noncurrent days calculations, see How Amazon S3 Calculates When an Object Became Noncurrent in the Amazon S3 User Guide.
     */
    NoncurrentDays?: Days;
  }
  export interface NoncurrentVersionTransition {
    /**
     * Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action. For information about the noncurrent days calculations, see  How Amazon S3 Calculates How Long an Object Has Been Noncurrent in the Amazon S3 User Guide.
     */
    NoncurrentDays?: Days;
    /**
     * The class of storage used to store the object.
     */
    StorageClass?: TransitionStorageClass;
  }
  export type NoncurrentVersionTransitionList = NoncurrentVersionTransition[];
  export interface ObjectLambdaAccessPoint {
    /**
     * The name of the Object Lambda Access Point.
     */
    Name: ObjectLambdaAccessPointName;
    /**
     * Specifies the ARN for the Object Lambda Access Point.
     */
    ObjectLambdaAccessPointArn?: ObjectLambdaAccessPointArn;
  }
  export type ObjectLambdaAccessPointArn = string;
  export type ObjectLambdaAccessPointList = ObjectLambdaAccessPoint[];
  export type ObjectLambdaAccessPointName = string;
  export type ObjectLambdaAllowedFeature = "GetObject-Range"|"GetObject-PartNumber"|string;
  export type ObjectLambdaAllowedFeaturesList = ObjectLambdaAllowedFeature[];
  export interface ObjectLambdaConfiguration {
    /**
     * Standard access point associated with the Object Lambda Access Point.
     */
    SupportingAccessPoint: ObjectLambdaSupportingAccessPointArn;
    /**
     * A container for whether the CloudWatch metrics configuration is enabled.
     */
    CloudWatchMetricsEnabled?: Boolean;
    /**
     * A container for allowed features. Valid inputs are GetObject-Range and GetObject-PartNumber.
     */
    AllowedFeatures?: ObjectLambdaAllowedFeaturesList;
    /**
     * A container for transformation configurations for an Object Lambda Access Point.
     */
    TransformationConfigurations: ObjectLambdaTransformationConfigurationsList;
  }
  export interface ObjectLambdaContentTransformation {
    /**
     * A container for an Lambda function.
     */
    AwsLambda?: AwsLambdaTransformation;
  }
  export type ObjectLambdaPolicy = string;
  export type ObjectLambdaSupportingAccessPointArn = string;
  export interface ObjectLambdaTransformationConfiguration {
    /**
     * A container for the action of an Object Lambda Access Point configuration. Valid input is GetObject.
     */
    Actions: ObjectLambdaTransformationConfigurationActionsList;
    /**
     * A container for the content transformation of an Object Lambda Access Point configuration.
     */
    ContentTransformation: ObjectLambdaContentTransformation;
  }
  export type ObjectLambdaTransformationConfigurationAction = "GetObject"|string;
  export type ObjectLambdaTransformationConfigurationActionsList = ObjectLambdaTransformationConfigurationAction[];
  export type ObjectLambdaTransformationConfigurationsList = ObjectLambdaTransformationConfiguration[];
  export type ObjectLockEnabledForBucket = boolean;
  export type OperationName = "LambdaInvoke"|"S3PutObjectCopy"|"S3PutObjectAcl"|"S3PutObjectTagging"|"S3DeleteObjectTagging"|"S3InitiateRestoreObject"|"S3PutObjectLegalHold"|"S3PutObjectRetention"|string;
  export type OutputSchemaVersion = "V_1"|string;
  export type Policy = string;
  export interface PolicyStatus {
    /**
     * 
     */
    IsPublic?: IsPublic;
  }
  export type Prefix = string;
  export interface PrefixLevel {
    /**
     * A container for the prefix-level storage metrics for S3 Storage Lens.
     */
    StorageMetrics: PrefixLevelStorageMetrics;
  }
  export interface PrefixLevelStorageMetrics {
    /**
     * A container for whether prefix-level storage metrics are enabled.
     */
    IsEnabled?: IsEnabled;
    SelectionCriteria?: SelectionCriteria;
  }
  export interface ProposedMultiRegionAccessPointPolicy {
    /**
     * The details of the proposed policy.
     */
    Policy?: Policy;
  }
  export interface PublicAccessBlockConfiguration {
    /**
     * Specifies whether Amazon S3 should block public access control lists (ACLs) for buckets in this account. Setting this element to TRUE causes the following behavior:   PUT Bucket acl and PUT Object acl calls fail if the specified ACL is public.   PUT Object calls fail if the request includes a public ACL.   PUT Bucket calls fail if the request includes a public ACL.   Enabling this setting doesn't affect existing policies or ACLs. This is not supported for Amazon S3 on Outposts.
     */
    BlockPublicAcls?: Setting;
    /**
     * Specifies whether Amazon S3 should ignore public ACLs for buckets in this account. Setting this element to TRUE causes Amazon S3 to ignore all public ACLs on buckets in this account and any objects that they contain.  Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set. This is not supported for Amazon S3 on Outposts.
     */
    IgnorePublicAcls?: Setting;
    /**
     * Specifies whether Amazon S3 should block public bucket policies for buckets in this account. Setting this element to TRUE causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access.  Enabling this setting doesn't affect existing bucket policies. This is not supported for Amazon S3 on Outposts.
     */
    BlockPublicPolicy?: Setting;
    /**
     * Specifies whether Amazon S3 should restrict public bucket policies for buckets in this account. Setting this element to TRUE restricts access to buckets with public policies to only Amazon Web Service principals and authorized users within this account. Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked. This is not supported for Amazon S3 on Outposts.
     */
    RestrictPublicBuckets?: Setting;
  }
  export type PublicAccessBlockEnabled = boolean;
  export interface PutAccessPointConfigurationForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the Object Lambda Access Point.
     */
    Name: ObjectLambdaAccessPointName;
    /**
     * Object Lambda Access Point configuration document.
     */
    Configuration: ObjectLambdaConfiguration;
  }
  export interface PutAccessPointPolicyForObjectLambdaRequest {
    /**
     * The account ID for the account that owns the specified Object Lambda Access Point.
     */
    AccountId: AccountId;
    /**
     * The name of the Object Lambda Access Point.
     */
    Name: ObjectLambdaAccessPointName;
    /**
     * Object Lambda Access Point resource policy document.
     */
    Policy: ObjectLambdaPolicy;
  }
  export interface PutAccessPointPolicyRequest {
    /**
     * The Amazon Web Services account ID for owner of the bucket associated with the specified access point.
     */
    AccountId: AccountId;
    /**
     * The name of the access point that you want to associate with the specified policy. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the access point accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/accesspoint/&lt;my-accesspoint-name&gt;. For example, to access the access point reports-ap through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/accesspoint/reports-ap. The value must be URL encoded. 
     */
    Name: AccessPointName;
    /**
     * The policy that you want to apply to the specified access point. For more information about access point policies, see Managing data access with Amazon S3 access points in the Amazon S3 User Guide.
     */
    Policy: Policy;
  }
  export interface PutBucketLifecycleConfigurationRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * The name of the bucket for which to set the configuration.
     */
    Bucket: BucketName;
    /**
     * Container for lifecycle rules. You can add as many as 1,000 rules.
     */
    LifecycleConfiguration?: LifecycleConfiguration;
  }
  export interface PutBucketPolicyRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * Specifies the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
    /**
     * Set this parameter to true to confirm that you want to remove your permissions to change this bucket policy in the future.  This is not supported by Amazon S3 on Outposts buckets. 
     */
    ConfirmRemoveSelfBucketAccess?: ConfirmRemoveSelfBucketAccess;
    /**
     * The bucket policy as a JSON document.
     */
    Policy: Policy;
  }
  export interface PutBucketTaggingRequest {
    /**
     * The Amazon Web Services account ID of the Outposts bucket.
     */
    AccountId: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the bucket. For using this parameter with Amazon S3 on Outposts with the REST API, you must specify the name and the x-amz-outpost-id as well. For using this parameter with S3 on Outposts with the Amazon Web Services SDK and CLI, you must specify the ARN of the bucket accessed in the format arn:aws:s3-outposts:&lt;Region&gt;:&lt;account-id&gt;:outpost/&lt;outpost-id&gt;/bucket/&lt;my-bucket-name&gt;. For example, to access the bucket reports through outpost my-outpost owned by account 123456789012 in Region us-west-2, use the URL encoding of arn:aws:s3-outposts:us-west-2:123456789012:outpost/my-outpost/bucket/reports. The value must be URL encoded. 
     */
    Bucket: BucketName;
    /**
     * 
     */
    Tagging: Tagging;
  }
  export interface PutJobTaggingRequest {
    /**
     * The Amazon Web Services account ID associated with the S3 Batch Operations job.
     */
    AccountId: AccountId;
    /**
     * The ID for the S3 Batch Operations job whose tags you want to replace.
     */
    JobId: JobId;
    /**
     * The set of tags to associate with the S3 Batch Operations job.
     */
    Tags: S3TagSet;
  }
  export interface PutJobTaggingResult {
  }
  export interface PutMultiRegionAccessPointPolicyInput {
    /**
     * The name of the Multi-Region Access Point associated with the request.
     */
    Name: MultiRegionAccessPointName;
    /**
     * The policy details for the PutMultiRegionAccessPoint request.
     */
    Policy: Policy;
  }
  export interface PutMultiRegionAccessPointPolicyRequest {
    /**
     * The Amazon Web Services account ID for the owner of the Multi-Region Access Point.
     */
    AccountId: AccountId;
    /**
     * An idempotency token used to identify the request and guarantee that requests are unique.
     */
    ClientToken: MultiRegionAccessPointClientToken;
    /**
     * A container element containing the details of the policy for the Multi-Region Access Point.
     */
    Details: PutMultiRegionAccessPointPolicyInput;
  }
  export interface PutMultiRegionAccessPointPolicyResult {
    /**
     * The request token associated with the request. You can use this token with DescribeMultiRegionAccessPointOperation to determine the status of asynchronous requests.
     */
    RequestTokenARN?: AsyncRequestTokenARN;
  }
  export interface PutPublicAccessBlockRequest {
    /**
     * The PublicAccessBlock configuration that you want to apply to the specified Amazon Web Services account.
     */
    PublicAccessBlockConfiguration: PublicAccessBlockConfiguration;
    /**
     * The account ID for the Amazon Web Services account whose PublicAccessBlock configuration you want to set.
     */
    AccountId: AccountId;
  }
  export interface PutStorageLensConfigurationRequest {
    /**
     * The ID of the S3 Storage Lens configuration.
     */
    ConfigId: ConfigId;
    /**
     * The account ID of the requester.
     */
    AccountId: AccountId;
    /**
     * The S3 Storage Lens configuration.
     */
    StorageLensConfiguration: StorageLensConfiguration;
    /**
     * The tag set of the S3 Storage Lens configuration.  You can set up to a maximum of 50 tags. 
     */
    Tags?: StorageLensTags;
  }
  export interface PutStorageLensConfigurationTaggingRequest {
    /**
     * The ID of the S3 Storage Lens configuration.
     */
    ConfigId: ConfigId;
    /**
     * The account ID of the requester.
     */
    AccountId: AccountId;
    /**
     * The tag set of the S3 Storage Lens configuration.  You can set up to a maximum of 50 tags. 
     */
    Tags: StorageLensTags;
  }
  export interface PutStorageLensConfigurationTaggingResult {
  }
  export interface Region {
    /**
     * The name of the associated bucket for the Region.
     */
    Bucket: BucketName;
  }
  export type RegionCreationList = Region[];
  export type RegionName = string;
  export interface RegionReport {
    /**
     * The name of the bucket.
     */
    Bucket?: BucketName;
    /**
     * The name of the Region.
     */
    Region?: RegionName;
  }
  export type RegionReportList = RegionReport[];
  export interface RegionalBucket {
    /**
     * 
     */
    Bucket: BucketName;
    /**
     * The Amazon Resource Name (ARN) for the regional bucket.
     */
    BucketArn?: S3RegionalBucketArn;
    /**
     * 
     */
    PublicAccessBlockEnabled: PublicAccessBlockEnabled;
    /**
     * The creation date of the regional bucket
     */
    CreationDate: CreationDate;
    /**
     * The Outposts ID of the regional bucket.
     */
    OutpostId?: NonEmptyMaxLength64String;
  }
  export type RegionalBucketList = RegionalBucket[];
  export type Regions = S3AWSRegion[];
  export type ReportPrefixString = string;
  export type RequestedJobStatus = "Cancelled"|"Ready"|string;
  export type S3AWSRegion = string;
  export interface S3AccessControlList {
    /**
     * 
     */
    Owner: S3ObjectOwner;
    /**
     * 
     */
    Grants?: S3GrantList;
  }
  export interface S3AccessControlPolicy {
    /**
     * 
     */
    AccessControlList?: S3AccessControlList;
    /**
     * 
     */
    CannedAccessControlList?: S3CannedAccessControlList;
  }
  export type S3AccessPointArn = string;
  export type S3BucketArnString = string;
  export interface S3BucketDestination {
    /**
     * 
     */
    Format: Format;
    /**
     * The schema version of the export file.
     */
    OutputSchemaVersion: OutputSchemaVersion;
    /**
     * The account ID of the owner of the S3 Storage Lens metrics export bucket.
     */
    AccountId: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the bucket. This property is read-only and follows the following format:  arn:aws:s3:us-east-1:example-account-id:bucket/your-destination-bucket-name  
     */
    Arn: S3BucketArnString;
    /**
     * The prefix of the destination bucket where the metrics export will be delivered.
     */
    Prefix?: Prefix;
    /**
     * The container for the type encryption of the metrics exports in this bucket.
     */
    Encryption?: StorageLensDataExportEncryption;
  }
  export type S3CannedAccessControlList = "private"|"public-read"|"public-read-write"|"aws-exec-read"|"authenticated-read"|"bucket-owner-read"|"bucket-owner-full-control"|string;
  export type S3ContentLength = number;
  export interface S3CopyObjectOperation {
    /**
     * Specifies the destination bucket ARN for the batch copy operation. For example, to copy objects to a bucket named "destinationBucket", set the TargetResource to "arn:aws:s3:::destinationBucket".
     */
    TargetResource?: S3BucketArnString;
    /**
     * 
     */
    CannedAccessControlList?: S3CannedAccessControlList;
    /**
     * 
     */
    AccessControlGrants?: S3GrantList;
    /**
     * 
     */
    MetadataDirective?: S3MetadataDirective;
    /**
     * 
     */
    ModifiedSinceConstraint?: TimeStamp;
    /**
     * 
     */
    NewObjectMetadata?: S3ObjectMetadata;
    /**
     * 
     */
    NewObjectTagging?: S3TagSet;
    /**
     * Specifies an optional metadata property for website redirects, x-amz-website-redirect-location. Allows webpage redirects if the object is accessed through a website endpoint.
     */
    RedirectLocation?: NonEmptyMaxLength2048String;
    /**
     * 
     */
    RequesterPays?: Boolean;
    /**
     * 
     */
    StorageClass?: S3StorageClass;
    /**
     * 
     */
    UnModifiedSinceConstraint?: TimeStamp;
    /**
     * 
     */
    SSEAwsKmsKeyId?: KmsKeyArnString;
    /**
     * Specifies the folder prefix into which you would like the objects to be copied. For example, to copy objects into a folder named "Folder1" in the destination bucket, set the TargetKeyPrefix to "Folder1/".
     */
    TargetKeyPrefix?: NonEmptyMaxLength1024String;
    /**
     * The legal hold status to be applied to all objects in the Batch Operations job.
     */
    ObjectLockLegalHoldStatus?: S3ObjectLockLegalHoldStatus;
    /**
     * The retention mode to be applied to all objects in the Batch Operations job.
     */
    ObjectLockMode?: S3ObjectLockMode;
    /**
     * The date when the applied object retention configuration expires on all objects in the Batch Operations job.
     */
    ObjectLockRetainUntilDate?: TimeStamp;
    /**
     * Specifies whether Amazon S3 should use an S3 Bucket Key for object encryption with server-side encryption using Amazon Web Services KMS (SSE-KMS). Setting this header to true causes Amazon S3 to use an S3 Bucket Key for object encryption with SSE-KMS. Specifying this header with an object action doesn’t affect bucket-level settings for S3 Bucket Key.
     */
    BucketKeyEnabled?: Boolean;
  }
  export interface S3DeleteObjectTaggingOperation {
  }
  export type S3ExpirationInDays = number;
  export type S3GlacierJobTier = "BULK"|"STANDARD"|string;
  export interface S3Grant {
    /**
     * 
     */
    Grantee?: S3Grantee;
    /**
     * 
     */
    Permission?: S3Permission;
  }
  export type S3GrantList = S3Grant[];
  export interface S3Grantee {
    /**
     * 
     */
    TypeIdentifier?: S3GranteeTypeIdentifier;
    /**
     * 
     */
    Identifier?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    DisplayName?: NonEmptyMaxLength1024String;
  }
  export type S3GranteeTypeIdentifier = "id"|"emailAddress"|"uri"|string;
  export interface S3InitiateRestoreObjectOperation {
    /**
     * This argument specifies how long the S3 Glacier or S3 Glacier Deep Archive object remains available in Amazon S3. S3 Initiate Restore Object jobs that target S3 Glacier and S3 Glacier Deep Archive objects require ExpirationInDays set to 1 or greater. Conversely, do not set ExpirationInDays when creating S3 Initiate Restore Object jobs that target S3 Intelligent-Tiering Archive Access and Deep Archive Access tier objects. Objects in S3 Intelligent-Tiering archive access tiers are not subject to restore expiry, so specifying ExpirationInDays results in restore request failure. S3 Batch Operations jobs can operate either on S3 Glacier and S3 Glacier Deep Archive storage class objects or on S3 Intelligent-Tiering Archive Access and Deep Archive Access storage tier objects, but not both types in the same job. If you need to restore objects of both types you must create separate Batch Operations jobs. 
     */
    ExpirationInDays?: S3ExpirationInDays;
    /**
     * S3 Batch Operations supports STANDARD and BULK retrieval tiers, but not the EXPEDITED retrieval tier.
     */
    GlacierJobTier?: S3GlacierJobTier;
  }
  export type S3KeyArnString = string;
  export type S3MetadataDirective = "COPY"|"REPLACE"|string;
  export interface S3ObjectLockLegalHold {
    /**
     * The Object Lock legal hold status to be applied to all objects in the Batch Operations job.
     */
    Status: S3ObjectLockLegalHoldStatus;
  }
  export type S3ObjectLockLegalHoldStatus = "OFF"|"ON"|string;
  export type S3ObjectLockMode = "COMPLIANCE"|"GOVERNANCE"|string;
  export type S3ObjectLockRetentionMode = "COMPLIANCE"|"GOVERNANCE"|string;
  export interface S3ObjectMetadata {
    /**
     * 
     */
    CacheControl?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    ContentDisposition?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    ContentEncoding?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    ContentLanguage?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    UserMetadata?: S3UserMetadata;
    /**
     * 
     */
    ContentLength?: S3ContentLength;
    /**
     * 
     */
    ContentMD5?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    ContentType?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    HttpExpiresDate?: TimeStamp;
    /**
     * 
     */
    RequesterCharged?: Boolean;
    /**
     * 
     */
    SSEAlgorithm?: S3SSEAlgorithm;
  }
  export interface S3ObjectOwner {
    /**
     * 
     */
    ID?: NonEmptyMaxLength1024String;
    /**
     * 
     */
    DisplayName?: NonEmptyMaxLength1024String;
  }
  export type S3ObjectVersionId = string;
  export type S3Permission = "FULL_CONTROL"|"READ"|"WRITE"|"READ_ACP"|"WRITE_ACP"|string;
  export type S3RegionalBucketArn = string;
  export interface S3Retention {
    /**
     * The date when the applied Object Lock retention will expire on all objects set by the Batch Operations job.
     */
    RetainUntilDate?: TimeStamp;
    /**
     * The Object Lock retention mode to be applied to all objects in the Batch Operations job.
     */
    Mode?: S3ObjectLockRetentionMode;
  }
  export type S3SSEAlgorithm = "AES256"|"KMS"|string;
  export interface S3SetObjectAclOperation {
    /**
     * 
     */
    AccessControlPolicy?: S3AccessControlPolicy;
  }
  export interface S3SetObjectLegalHoldOperation {
    /**
     * Contains the Object Lock legal hold status to be applied to all objects in the Batch Operations job.
     */
    LegalHold: S3ObjectLockLegalHold;
  }
  export interface S3SetObjectRetentionOperation {
    /**
     * Indicates if the action should be applied to objects in the Batch Operations job even if they have Object Lock  GOVERNANCE type in place.
     */
    BypassGovernanceRetention?: Boolean;
    /**
     * Contains the Object Lock retention mode to be applied to all objects in the Batch Operations job. For more information, see Using S3 Object Lock retention with S3 Batch Operations in the Amazon S3 User Guide.
     */
    Retention: S3Retention;
  }
  export interface S3SetObjectTaggingOperation {
    /**
     * 
     */
    TagSet?: S3TagSet;
  }
  export type S3StorageClass = "STANDARD"|"STANDARD_IA"|"ONEZONE_IA"|"GLACIER"|"INTELLIGENT_TIERING"|"DEEP_ARCHIVE"|string;
  export interface S3Tag {
    /**
     * 
     */
    Key: TagKeyString;
    /**
     * 
     */
    Value: TagValueString;
  }
  export type S3TagSet = S3Tag[];
  export type S3UserMetadata = {[key: string]: MaxLength1024String};
  export interface SSEKMS {
    /**
     * A container for the ARN of the SSE-KMS encryption. This property is read-only and follows the following format:  arn:aws:kms:us-east-1:example-account-id:key/example-9a73-4afc-8d29-8f5900cef44e  
     */
    KeyId: SSEKMSKeyId;
  }
  export type SSEKMSKeyId = string;
  export interface SSES3 {
  }
  export interface SelectionCriteria {
    /**
     * A container for the delimiter of the selection criteria being used.
     */
    Delimiter?: StorageLensPrefixLevelDelimiter;
    /**
     * The max depth of the selection criteria
     */
    MaxDepth?: StorageLensPrefixLevelMaxDepth;
    /**
     * The minimum number of storage bytes percentage whose metrics will be selected.  You must choose a value greater than or equal to 1.0. 
     */
    MinStorageBytesPercentage?: MinStorageBytesPercentage;
  }
  export type Setting = boolean;
  export type StorageLensArn = string;
  export interface StorageLensAwsOrg {
    /**
     * A container for the Amazon Resource Name (ARN) of the Amazon Web Services organization. This property is read-only and follows the following format:  arn:aws:organizations:us-east-1:example-account-id:organization/o-ex2l495dck  
     */
    Arn: AwsOrgArn;
  }
  export interface StorageLensConfiguration {
    /**
     * A container for the Amazon S3 Storage Lens configuration ID.
     */
    Id: ConfigId;
    /**
     * A container for all the account-level configurations of your S3 Storage Lens configuration.
     */
    AccountLevel: AccountLevel;
    /**
     * A container for what is included in this configuration. This container can only be valid if there is no Exclude container submitted, and it's not empty. 
     */
    Include?: Include;
    /**
     * A container for what is excluded in this configuration. This container can only be valid if there is no Include container submitted, and it's not empty. 
     */
    Exclude?: Exclude;
    /**
     * A container to specify the properties of your S3 Storage Lens metrics export including, the destination, schema and format.
     */
    DataExport?: StorageLensDataExport;
    /**
     * A container for whether the S3 Storage Lens configuration is enabled.
     */
    IsEnabled: IsEnabled;
    /**
     * A container for the Amazon Web Services organization for this S3 Storage Lens configuration.
     */
    AwsOrg?: StorageLensAwsOrg;
    /**
     * The Amazon Resource Name (ARN) of the S3 Storage Lens configuration. This property is read-only and follows the following format:  arn:aws:s3:us-east-1:example-account-id:storage-lens/your-dashboard-name  
     */
    StorageLensArn?: StorageLensArn;
  }
  export type StorageLensConfigurationList = ListStorageLensConfigurationEntry[];
  export interface StorageLensDataExport {
    /**
     * A container for the bucket where the S3 Storage Lens metrics export will be located.  This bucket must be located in the same Region as the storage lens configuration.  
     */
    S3BucketDestination: S3BucketDestination;
  }
  export interface StorageLensDataExportEncryption {
    /**
     * 
     */
    SSES3?: SSES3;
    /**
     * 
     */
    SSEKMS?: SSEKMS;
  }
  export type StorageLensPrefixLevelDelimiter = string;
  export type StorageLensPrefixLevelMaxDepth = number;
  export interface StorageLensTag {
    /**
     * 
     */
    Key: TagKeyString;
    /**
     * 
     */
    Value: TagValueString;
  }
  export type StorageLensTags = StorageLensTag[];
  export type StringForNextToken = string;
  export type SuspendedCause = string;
  export type SuspendedDate = Date;
  export type TagKeyString = string;
  export type TagValueString = string;
  export interface Tagging {
    /**
     * A collection for a set of tags.
     */
    TagSet: S3TagSet;
  }
  export type TimeStamp = Date;
  export interface Transition {
    /**
     * Indicates when objects are transitioned to the specified storage class. The date value must be in ISO 8601 format. The time is always midnight UTC.
     */
    Date?: _Date;
    /**
     * Indicates the number of days after creation when objects are transitioned to the specified storage class. The value must be a positive integer.
     */
    Days?: Days;
    /**
     * The storage class to which you want the object to transition.
     */
    StorageClass?: TransitionStorageClass;
  }
  export type TransitionList = Transition[];
  export type TransitionStorageClass = "GLACIER"|"STANDARD_IA"|"ONEZONE_IA"|"INTELLIGENT_TIERING"|"DEEP_ARCHIVE"|string;
  export interface UpdateJobPriorityRequest {
    /**
     * The Amazon Web Services account ID associated with the S3 Batch Operations job.
     */
    AccountId: AccountId;
    /**
     * The ID for the job whose priority you want to update.
     */
    JobId: JobId;
    /**
     * The priority you want to assign to this job.
     */
    Priority: JobPriority;
  }
  export interface UpdateJobPriorityResult {
    /**
     * The ID for the job whose priority Amazon S3 updated.
     */
    JobId: JobId;
    /**
     * The new priority assigned to the specified job.
     */
    Priority: JobPriority;
  }
  export interface UpdateJobStatusRequest {
    /**
     * The Amazon Web Services account ID associated with the S3 Batch Operations job.
     */
    AccountId: AccountId;
    /**
     * The ID of the job whose status you want to update.
     */
    JobId: JobId;
    /**
     * The status that you want to move the specified job to.
     */
    RequestedJobStatus: RequestedJobStatus;
    /**
     * A description of the reason why you want to change the specified job's status. This field can be any string up to the maximum length.
     */
    StatusUpdateReason?: JobStatusUpdateReason;
  }
  export interface UpdateJobStatusResult {
    /**
     * The ID for the job whose status was updated.
     */
    JobId?: JobId;
    /**
     * The current status for the specified job.
     */
    Status?: JobStatus;
    /**
     * The reason that the specified job's status was updated.
     */
    StatusUpdateReason?: JobStatusUpdateReason;
  }
  export interface VpcConfiguration {
    /**
     * If this field is specified, this access point will only allow connections from the specified VPC ID.
     */
    VpcId: VpcId;
  }
  export type VpcId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-08-20"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & UseDualstackConfigOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the S3Control client.
   */
  export import Types = S3Control;
}
export = S3Control;
