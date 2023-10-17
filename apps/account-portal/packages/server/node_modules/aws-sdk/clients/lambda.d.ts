import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {EventStream} from '../lib/event-stream/event-stream';
import {Readable} from 'stream';
interface Blob {}
declare class Lambda extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Lambda.Types.ClientConfiguration)
  config: Config & Lambda.Types.ClientConfiguration;
  /**
   * Adds permissions to the resource-based policy of a version of an Lambda layer. Use this action to grant layer usage permission to other accounts. You can grant permission to a single account, all accounts in an organization, or all Amazon Web Services accounts.  To revoke permission, call RemoveLayerVersionPermission with the statement ID that you specified when you added it.
   */
  addLayerVersionPermission(params: Lambda.Types.AddLayerVersionPermissionRequest, callback?: (err: AWSError, data: Lambda.Types.AddLayerVersionPermissionResponse) => void): Request<Lambda.Types.AddLayerVersionPermissionResponse, AWSError>;
  /**
   * Adds permissions to the resource-based policy of a version of an Lambda layer. Use this action to grant layer usage permission to other accounts. You can grant permission to a single account, all accounts in an organization, or all Amazon Web Services accounts.  To revoke permission, call RemoveLayerVersionPermission with the statement ID that you specified when you added it.
   */
  addLayerVersionPermission(callback?: (err: AWSError, data: Lambda.Types.AddLayerVersionPermissionResponse) => void): Request<Lambda.Types.AddLayerVersionPermissionResponse, AWSError>;
  /**
   * Grants an Amazon Web Service, Amazon Web Services account, or Amazon Web Services organization permission to use a function. You can apply the policy at the function level, or specify a qualifier to restrict access to a single version or alias. If you use a qualifier, the invoker must use the full Amazon Resource Name (ARN) of that version or alias to invoke the function. Note: Lambda does not support adding policies to version $LATEST. To grant permission to another account, specify the account ID as the Principal. To grant permission to an organization defined in Organizations, specify the organization ID as the PrincipalOrgID. For Amazon Web Services, the principal is a domain-style identifier that the service defines, such as s3.amazonaws.com or sns.amazonaws.com. For Amazon Web Services, you can also specify the ARN of the associated resource as the SourceArn. If you grant permission to a service principal without specifying the source, other accounts could potentially configure resources in their account to invoke your Lambda function. This operation adds a statement to a resource-based permissions policy for the function. For more information about function policies, see Using resource-based policies for Lambda.
   */
  addPermission(params: Lambda.Types.AddPermissionRequest, callback?: (err: AWSError, data: Lambda.Types.AddPermissionResponse) => void): Request<Lambda.Types.AddPermissionResponse, AWSError>;
  /**
   * Grants an Amazon Web Service, Amazon Web Services account, or Amazon Web Services organization permission to use a function. You can apply the policy at the function level, or specify a qualifier to restrict access to a single version or alias. If you use a qualifier, the invoker must use the full Amazon Resource Name (ARN) of that version or alias to invoke the function. Note: Lambda does not support adding policies to version $LATEST. To grant permission to another account, specify the account ID as the Principal. To grant permission to an organization defined in Organizations, specify the organization ID as the PrincipalOrgID. For Amazon Web Services, the principal is a domain-style identifier that the service defines, such as s3.amazonaws.com or sns.amazonaws.com. For Amazon Web Services, you can also specify the ARN of the associated resource as the SourceArn. If you grant permission to a service principal without specifying the source, other accounts could potentially configure resources in their account to invoke your Lambda function. This operation adds a statement to a resource-based permissions policy for the function. For more information about function policies, see Using resource-based policies for Lambda.
   */
  addPermission(callback?: (err: AWSError, data: Lambda.Types.AddPermissionResponse) => void): Request<Lambda.Types.AddPermissionResponse, AWSError>;
  /**
   * Creates an alias for a Lambda function version. Use aliases to provide clients with a function identifier that you can update to invoke a different version. You can also map an alias to split invocation requests between two versions. Use the RoutingConfig parameter to specify a second version and the percentage of invocation requests that it receives.
   */
  createAlias(params: Lambda.Types.CreateAliasRequest, callback?: (err: AWSError, data: Lambda.Types.AliasConfiguration) => void): Request<Lambda.Types.AliasConfiguration, AWSError>;
  /**
   * Creates an alias for a Lambda function version. Use aliases to provide clients with a function identifier that you can update to invoke a different version. You can also map an alias to split invocation requests between two versions. Use the RoutingConfig parameter to specify a second version and the percentage of invocation requests that it receives.
   */
  createAlias(callback?: (err: AWSError, data: Lambda.Types.AliasConfiguration) => void): Request<Lambda.Types.AliasConfiguration, AWSError>;
  /**
   * Creates a code signing configuration. A code signing configuration defines a list of allowed signing profiles and defines the code-signing validation policy (action to be taken if deployment validation checks fail). 
   */
  createCodeSigningConfig(params: Lambda.Types.CreateCodeSigningConfigRequest, callback?: (err: AWSError, data: Lambda.Types.CreateCodeSigningConfigResponse) => void): Request<Lambda.Types.CreateCodeSigningConfigResponse, AWSError>;
  /**
   * Creates a code signing configuration. A code signing configuration defines a list of allowed signing profiles and defines the code-signing validation policy (action to be taken if deployment validation checks fail). 
   */
  createCodeSigningConfig(callback?: (err: AWSError, data: Lambda.Types.CreateCodeSigningConfigResponse) => void): Request<Lambda.Types.CreateCodeSigningConfigResponse, AWSError>;
  /**
   * Creates a mapping between an event source and an Lambda function. Lambda reads items from the event source and invokes the function. For details about how to configure different event sources, see the following topics.      Amazon DynamoDB Streams      Amazon Kinesis      Amazon SQS      Amazon MQ and RabbitMQ      Amazon MSK      Apache Kafka      Amazon DocumentDB    The following error handling options are available only for stream sources (DynamoDB and Kinesis):    BisectBatchOnFunctionError – If the function returns an error, split the batch in two and retry.    DestinationConfig – Send discarded records to an Amazon SQS queue or Amazon SNS topic.    MaximumRecordAgeInSeconds – Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires    MaximumRetryAttempts – Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.    ParallelizationFactor – Process multiple batches from each shard concurrently.   For information about which configuration parameters apply to each event source, see the following topics.     Amazon DynamoDB Streams      Amazon Kinesis      Amazon SQS      Amazon MQ and RabbitMQ      Amazon MSK      Apache Kafka      Amazon DocumentDB   
   */
  createEventSourceMapping(params: Lambda.Types.CreateEventSourceMappingRequest, callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Creates a mapping between an event source and an Lambda function. Lambda reads items from the event source and invokes the function. For details about how to configure different event sources, see the following topics.      Amazon DynamoDB Streams      Amazon Kinesis      Amazon SQS      Amazon MQ and RabbitMQ      Amazon MSK      Apache Kafka      Amazon DocumentDB    The following error handling options are available only for stream sources (DynamoDB and Kinesis):    BisectBatchOnFunctionError – If the function returns an error, split the batch in two and retry.    DestinationConfig – Send discarded records to an Amazon SQS queue or Amazon SNS topic.    MaximumRecordAgeInSeconds – Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires    MaximumRetryAttempts – Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.    ParallelizationFactor – Process multiple batches from each shard concurrently.   For information about which configuration parameters apply to each event source, see the following topics.     Amazon DynamoDB Streams      Amazon Kinesis      Amazon SQS      Amazon MQ and RabbitMQ      Amazon MSK      Apache Kafka      Amazon DocumentDB   
   */
  createEventSourceMapping(callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Creates a Lambda function. To create a function, you need a deployment package and an execution role. The deployment package is a .zip file archive or container image that contains your function code. The execution role grants the function permission to use Amazon Web Services, such as Amazon CloudWatch Logs for log streaming and X-Ray for request tracing. If the deployment package is a container image, then you set the package type to Image. For a container image, the code property must include the URI of a container image in the Amazon ECR registry. You do not need to specify the handler and runtime properties. If the deployment package is a .zip file archive, then you set the package type to Zip. For a .zip file archive, the code property specifies the location of the .zip file. You must also specify the handler and runtime properties. The code in the deployment package must be compatible with the target instruction set architecture of the function (x86-64 or arm64). If you do not specify the architecture, then the default value is x86-64. When you create a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute or so. During this time, you can't invoke or modify the function. The State, StateReason, and StateReasonCode fields in the response from GetFunctionConfiguration indicate when the function is ready to invoke. For more information, see Lambda function states. A function has an unpublished version, and can have published versions and aliases. The unpublished version changes when you update your function's code and configuration. A published version is a snapshot of your function code and configuration that can't be changed. An alias is a named resource that maps to a version, and can be changed to map to a different version. Use the Publish parameter to create version 1 of your function from its initial configuration. The other parameters let you configure version-specific and function-level settings. You can modify version-specific settings later with UpdateFunctionConfiguration. Function-level settings apply to both the unpublished and published versions of the function, and include tags (TagResource) and per-function concurrency limits (PutFunctionConcurrency). You can use code signing if your deployment package is a .zip file archive. To enable code signing for this function, specify the ARN of a code-signing configuration. When a user attempts to deploy a code package with UpdateFunctionCode, Lambda checks that the code package has a valid signature from a trusted publisher. The code-signing configuration includes set of signing profiles, which define the trusted publishers for this function. If another Amazon Web Services account or an Amazon Web Service invokes your function, use AddPermission to grant permission by creating a resource-based Identity and Access Management (IAM) policy. You can grant permissions at the function level, on a version, or on an alias. To invoke your function directly, use Invoke. To invoke your function in response to events in other Amazon Web Services, create an event source mapping (CreateEventSourceMapping), or configure a function trigger in the other service. For more information, see Invoking Lambda functions.
   */
  createFunction(params: Lambda.Types.CreateFunctionRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Creates a Lambda function. To create a function, you need a deployment package and an execution role. The deployment package is a .zip file archive or container image that contains your function code. The execution role grants the function permission to use Amazon Web Services, such as Amazon CloudWatch Logs for log streaming and X-Ray for request tracing. If the deployment package is a container image, then you set the package type to Image. For a container image, the code property must include the URI of a container image in the Amazon ECR registry. You do not need to specify the handler and runtime properties. If the deployment package is a .zip file archive, then you set the package type to Zip. For a .zip file archive, the code property specifies the location of the .zip file. You must also specify the handler and runtime properties. The code in the deployment package must be compatible with the target instruction set architecture of the function (x86-64 or arm64). If you do not specify the architecture, then the default value is x86-64. When you create a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute or so. During this time, you can't invoke or modify the function. The State, StateReason, and StateReasonCode fields in the response from GetFunctionConfiguration indicate when the function is ready to invoke. For more information, see Lambda function states. A function has an unpublished version, and can have published versions and aliases. The unpublished version changes when you update your function's code and configuration. A published version is a snapshot of your function code and configuration that can't be changed. An alias is a named resource that maps to a version, and can be changed to map to a different version. Use the Publish parameter to create version 1 of your function from its initial configuration. The other parameters let you configure version-specific and function-level settings. You can modify version-specific settings later with UpdateFunctionConfiguration. Function-level settings apply to both the unpublished and published versions of the function, and include tags (TagResource) and per-function concurrency limits (PutFunctionConcurrency). You can use code signing if your deployment package is a .zip file archive. To enable code signing for this function, specify the ARN of a code-signing configuration. When a user attempts to deploy a code package with UpdateFunctionCode, Lambda checks that the code package has a valid signature from a trusted publisher. The code-signing configuration includes set of signing profiles, which define the trusted publishers for this function. If another Amazon Web Services account or an Amazon Web Service invokes your function, use AddPermission to grant permission by creating a resource-based Identity and Access Management (IAM) policy. You can grant permissions at the function level, on a version, or on an alias. To invoke your function directly, use Invoke. To invoke your function in response to events in other Amazon Web Services, create an event source mapping (CreateEventSourceMapping), or configure a function trigger in the other service. For more information, see Invoking Lambda functions.
   */
  createFunction(callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Creates a Lambda function URL with the specified configuration parameters. A function URL is a dedicated HTTP(S) endpoint that you can use to invoke your function.
   */
  createFunctionUrlConfig(params: Lambda.Types.CreateFunctionUrlConfigRequest, callback?: (err: AWSError, data: Lambda.Types.CreateFunctionUrlConfigResponse) => void): Request<Lambda.Types.CreateFunctionUrlConfigResponse, AWSError>;
  /**
   * Creates a Lambda function URL with the specified configuration parameters. A function URL is a dedicated HTTP(S) endpoint that you can use to invoke your function.
   */
  createFunctionUrlConfig(callback?: (err: AWSError, data: Lambda.Types.CreateFunctionUrlConfigResponse) => void): Request<Lambda.Types.CreateFunctionUrlConfigResponse, AWSError>;
  /**
   * Deletes a Lambda function alias.
   */
  deleteAlias(params: Lambda.Types.DeleteAliasRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Lambda function alias.
   */
  deleteAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the code signing configuration. You can delete the code signing configuration only if no function is using it. 
   */
  deleteCodeSigningConfig(params: Lambda.Types.DeleteCodeSigningConfigRequest, callback?: (err: AWSError, data: Lambda.Types.DeleteCodeSigningConfigResponse) => void): Request<Lambda.Types.DeleteCodeSigningConfigResponse, AWSError>;
  /**
   * Deletes the code signing configuration. You can delete the code signing configuration only if no function is using it. 
   */
  deleteCodeSigningConfig(callback?: (err: AWSError, data: Lambda.Types.DeleteCodeSigningConfigResponse) => void): Request<Lambda.Types.DeleteCodeSigningConfigResponse, AWSError>;
  /**
   * Deletes an event source mapping. You can get the identifier of a mapping from the output of ListEventSourceMappings. When you delete an event source mapping, it enters a Deleting state and might not be completely deleted for several seconds.
   */
  deleteEventSourceMapping(params: Lambda.Types.DeleteEventSourceMappingRequest, callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Deletes an event source mapping. You can get the identifier of a mapping from the output of ListEventSourceMappings. When you delete an event source mapping, it enters a Deleting state and might not be completely deleted for several seconds.
   */
  deleteEventSourceMapping(callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Deletes a Lambda function. To delete a specific function version, use the Qualifier parameter. Otherwise, all versions and aliases are deleted. This doesn't require the user to have explicit permissions for DeleteAlias. To delete Lambda event source mappings that invoke a function, use DeleteEventSourceMapping. For Amazon Web Services and resources that invoke your function directly, delete the trigger in the service where you originally configured it.
   */
  deleteFunction(params: Lambda.Types.DeleteFunctionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Lambda function. To delete a specific function version, use the Qualifier parameter. Otherwise, all versions and aliases are deleted. This doesn't require the user to have explicit permissions for DeleteAlias. To delete Lambda event source mappings that invoke a function, use DeleteEventSourceMapping. For Amazon Web Services and resources that invoke your function directly, delete the trigger in the service where you originally configured it.
   */
  deleteFunction(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the code signing configuration from the function.
   */
  deleteFunctionCodeSigningConfig(params: Lambda.Types.DeleteFunctionCodeSigningConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the code signing configuration from the function.
   */
  deleteFunctionCodeSigningConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a concurrent execution limit from a function.
   */
  deleteFunctionConcurrency(params: Lambda.Types.DeleteFunctionConcurrencyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a concurrent execution limit from a function.
   */
  deleteFunctionConcurrency(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the configuration for asynchronous invocation for a function, version, or alias. To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
   */
  deleteFunctionEventInvokeConfig(params: Lambda.Types.DeleteFunctionEventInvokeConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the configuration for asynchronous invocation for a function, version, or alias. To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
   */
  deleteFunctionEventInvokeConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Lambda function URL. When you delete a function URL, you can't recover it. Creating a new function URL results in a different URL address.
   */
  deleteFunctionUrlConfig(params: Lambda.Types.DeleteFunctionUrlConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Lambda function URL. When you delete a function URL, you can't recover it. Creating a new function URL results in a different URL address.
   */
  deleteFunctionUrlConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a version of an Lambda layer. Deleted versions can no longer be viewed or added to functions. To avoid breaking functions, a copy of the version remains in Lambda until no functions refer to it.
   */
  deleteLayerVersion(params: Lambda.Types.DeleteLayerVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a version of an Lambda layer. Deleted versions can no longer be viewed or added to functions. To avoid breaking functions, a copy of the version remains in Lambda until no functions refer to it.
   */
  deleteLayerVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the provisioned concurrency configuration for a function.
   */
  deleteProvisionedConcurrencyConfig(params: Lambda.Types.DeleteProvisionedConcurrencyConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the provisioned concurrency configuration for a function.
   */
  deleteProvisionedConcurrencyConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves details about your account's limits and usage in an Amazon Web Services Region.
   */
  getAccountSettings(params: Lambda.Types.GetAccountSettingsRequest, callback?: (err: AWSError, data: Lambda.Types.GetAccountSettingsResponse) => void): Request<Lambda.Types.GetAccountSettingsResponse, AWSError>;
  /**
   * Retrieves details about your account's limits and usage in an Amazon Web Services Region.
   */
  getAccountSettings(callback?: (err: AWSError, data: Lambda.Types.GetAccountSettingsResponse) => void): Request<Lambda.Types.GetAccountSettingsResponse, AWSError>;
  /**
   * Returns details about a Lambda function alias.
   */
  getAlias(params: Lambda.Types.GetAliasRequest, callback?: (err: AWSError, data: Lambda.Types.AliasConfiguration) => void): Request<Lambda.Types.AliasConfiguration, AWSError>;
  /**
   * Returns details about a Lambda function alias.
   */
  getAlias(callback?: (err: AWSError, data: Lambda.Types.AliasConfiguration) => void): Request<Lambda.Types.AliasConfiguration, AWSError>;
  /**
   * Returns information about the specified code signing configuration.
   */
  getCodeSigningConfig(params: Lambda.Types.GetCodeSigningConfigRequest, callback?: (err: AWSError, data: Lambda.Types.GetCodeSigningConfigResponse) => void): Request<Lambda.Types.GetCodeSigningConfigResponse, AWSError>;
  /**
   * Returns information about the specified code signing configuration.
   */
  getCodeSigningConfig(callback?: (err: AWSError, data: Lambda.Types.GetCodeSigningConfigResponse) => void): Request<Lambda.Types.GetCodeSigningConfigResponse, AWSError>;
  /**
   * Returns details about an event source mapping. You can get the identifier of a mapping from the output of ListEventSourceMappings.
   */
  getEventSourceMapping(params: Lambda.Types.GetEventSourceMappingRequest, callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Returns details about an event source mapping. You can get the identifier of a mapping from the output of ListEventSourceMappings.
   */
  getEventSourceMapping(callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Returns information about the function or function version, with a link to download the deployment package that's valid for 10 minutes. If you specify a function version, only details that are specific to that version are returned.
   */
  getFunction(params: Lambda.Types.GetFunctionRequest, callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Returns information about the function or function version, with a link to download the deployment package that's valid for 10 minutes. If you specify a function version, only details that are specific to that version are returned.
   */
  getFunction(callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Returns the code signing configuration for the specified function.
   */
  getFunctionCodeSigningConfig(params: Lambda.Types.GetFunctionCodeSigningConfigRequest, callback?: (err: AWSError, data: Lambda.Types.GetFunctionCodeSigningConfigResponse) => void): Request<Lambda.Types.GetFunctionCodeSigningConfigResponse, AWSError>;
  /**
   * Returns the code signing configuration for the specified function.
   */
  getFunctionCodeSigningConfig(callback?: (err: AWSError, data: Lambda.Types.GetFunctionCodeSigningConfigResponse) => void): Request<Lambda.Types.GetFunctionCodeSigningConfigResponse, AWSError>;
  /**
   * Returns details about the reserved concurrency configuration for a function. To set a concurrency limit for a function, use PutFunctionConcurrency.
   */
  getFunctionConcurrency(params: Lambda.Types.GetFunctionConcurrencyRequest, callback?: (err: AWSError, data: Lambda.Types.GetFunctionConcurrencyResponse) => void): Request<Lambda.Types.GetFunctionConcurrencyResponse, AWSError>;
  /**
   * Returns details about the reserved concurrency configuration for a function. To set a concurrency limit for a function, use PutFunctionConcurrency.
   */
  getFunctionConcurrency(callback?: (err: AWSError, data: Lambda.Types.GetFunctionConcurrencyResponse) => void): Request<Lambda.Types.GetFunctionConcurrencyResponse, AWSError>;
  /**
   * Returns the version-specific settings of a Lambda function or version. The output includes only options that can vary between versions of a function. To modify these settings, use UpdateFunctionConfiguration. To get all of a function's details, including function-level settings, use GetFunction.
   */
  getFunctionConfiguration(params: Lambda.Types.GetFunctionConfigurationRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Returns the version-specific settings of a Lambda function or version. The output includes only options that can vary between versions of a function. To modify these settings, use UpdateFunctionConfiguration. To get all of a function's details, including function-level settings, use GetFunction.
   */
  getFunctionConfiguration(callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Retrieves the configuration for asynchronous invocation for a function, version, or alias. To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
   */
  getFunctionEventInvokeConfig(params: Lambda.Types.GetFunctionEventInvokeConfigRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionEventInvokeConfig) => void): Request<Lambda.Types.FunctionEventInvokeConfig, AWSError>;
  /**
   * Retrieves the configuration for asynchronous invocation for a function, version, or alias. To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
   */
  getFunctionEventInvokeConfig(callback?: (err: AWSError, data: Lambda.Types.FunctionEventInvokeConfig) => void): Request<Lambda.Types.FunctionEventInvokeConfig, AWSError>;
  /**
   * Returns details about a Lambda function URL.
   */
  getFunctionUrlConfig(params: Lambda.Types.GetFunctionUrlConfigRequest, callback?: (err: AWSError, data: Lambda.Types.GetFunctionUrlConfigResponse) => void): Request<Lambda.Types.GetFunctionUrlConfigResponse, AWSError>;
  /**
   * Returns details about a Lambda function URL.
   */
  getFunctionUrlConfig(callback?: (err: AWSError, data: Lambda.Types.GetFunctionUrlConfigResponse) => void): Request<Lambda.Types.GetFunctionUrlConfigResponse, AWSError>;
  /**
   * Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.
   */
  getLayerVersion(params: Lambda.Types.GetLayerVersionRequest, callback?: (err: AWSError, data: Lambda.Types.GetLayerVersionResponse) => void): Request<Lambda.Types.GetLayerVersionResponse, AWSError>;
  /**
   * Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.
   */
  getLayerVersion(callback?: (err: AWSError, data: Lambda.Types.GetLayerVersionResponse) => void): Request<Lambda.Types.GetLayerVersionResponse, AWSError>;
  /**
   * Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.
   */
  getLayerVersionByArn(params: Lambda.Types.GetLayerVersionByArnRequest, callback?: (err: AWSError, data: Lambda.Types.GetLayerVersionResponse) => void): Request<Lambda.Types.GetLayerVersionResponse, AWSError>;
  /**
   * Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.
   */
  getLayerVersionByArn(callback?: (err: AWSError, data: Lambda.Types.GetLayerVersionResponse) => void): Request<Lambda.Types.GetLayerVersionResponse, AWSError>;
  /**
   * Returns the permission policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
   */
  getLayerVersionPolicy(params: Lambda.Types.GetLayerVersionPolicyRequest, callback?: (err: AWSError, data: Lambda.Types.GetLayerVersionPolicyResponse) => void): Request<Lambda.Types.GetLayerVersionPolicyResponse, AWSError>;
  /**
   * Returns the permission policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
   */
  getLayerVersionPolicy(callback?: (err: AWSError, data: Lambda.Types.GetLayerVersionPolicyResponse) => void): Request<Lambda.Types.GetLayerVersionPolicyResponse, AWSError>;
  /**
   * Returns the resource-based IAM policy for a function, version, or alias.
   */
  getPolicy(params: Lambda.Types.GetPolicyRequest, callback?: (err: AWSError, data: Lambda.Types.GetPolicyResponse) => void): Request<Lambda.Types.GetPolicyResponse, AWSError>;
  /**
   * Returns the resource-based IAM policy for a function, version, or alias.
   */
  getPolicy(callback?: (err: AWSError, data: Lambda.Types.GetPolicyResponse) => void): Request<Lambda.Types.GetPolicyResponse, AWSError>;
  /**
   * Retrieves the provisioned concurrency configuration for a function's alias or version.
   */
  getProvisionedConcurrencyConfig(params: Lambda.Types.GetProvisionedConcurrencyConfigRequest, callback?: (err: AWSError, data: Lambda.Types.GetProvisionedConcurrencyConfigResponse) => void): Request<Lambda.Types.GetProvisionedConcurrencyConfigResponse, AWSError>;
  /**
   * Retrieves the provisioned concurrency configuration for a function's alias or version.
   */
  getProvisionedConcurrencyConfig(callback?: (err: AWSError, data: Lambda.Types.GetProvisionedConcurrencyConfigResponse) => void): Request<Lambda.Types.GetProvisionedConcurrencyConfigResponse, AWSError>;
  /**
   * Retrieves the runtime management configuration for a function's version. If the runtime update mode is Manual, this includes the ARN of the runtime version and the runtime update mode. If the runtime update mode is Auto or Function update, this includes the runtime update mode and null is returned for the ARN. For more information, see Runtime updates.
   */
  getRuntimeManagementConfig(params: Lambda.Types.GetRuntimeManagementConfigRequest, callback?: (err: AWSError, data: Lambda.Types.GetRuntimeManagementConfigResponse) => void): Request<Lambda.Types.GetRuntimeManagementConfigResponse, AWSError>;
  /**
   * Retrieves the runtime management configuration for a function's version. If the runtime update mode is Manual, this includes the ARN of the runtime version and the runtime update mode. If the runtime update mode is Auto or Function update, this includes the runtime update mode and null is returned for the ARN. For more information, see Runtime updates.
   */
  getRuntimeManagementConfig(callback?: (err: AWSError, data: Lambda.Types.GetRuntimeManagementConfigResponse) => void): Request<Lambda.Types.GetRuntimeManagementConfigResponse, AWSError>;
  /**
   * Invokes a Lambda function. You can invoke a function synchronously (and wait for the response), or asynchronously. To invoke a function asynchronously, set InvocationType to Event. For synchronous invocation, details about the function response, including errors, are included in the response body and headers. For either invocation type, you can find more information in the execution log and trace. When an error occurs, your function may be invoked multiple times. Retry behavior varies by error type, client, event source, and invocation type. For example, if you invoke a function asynchronously and it returns an error, Lambda executes the function up to two more times. For more information, see Error handling and automatic retries in Lambda. For asynchronous invocation, Lambda adds events to a queue before sending them to your function. If your function does not have enough capacity to keep up with the queue, events may be lost. Occasionally, your function may receive the same event multiple times, even if no error occurs. To retain events that were not processed, configure your function with a dead-letter queue. The status code in the API response doesn't reflect function errors. Error codes are reserved for errors that prevent your function from executing, such as permissions errors, quota errors, or issues with your function's code and configuration. For example, Lambda returns TooManyRequestsException if running the function would cause you to exceed a concurrency limit at either the account level (ConcurrentInvocationLimitExceeded) or function level (ReservedFunctionConcurrentInvocationLimitExceeded). For functions with a long timeout, your client might disconnect during synchronous invocation while it waits for a response. Configure your HTTP client, SDK, firewall, proxy, or operating system to allow for long connections with timeout or keep-alive settings. This operation requires permission for the lambda:InvokeFunction action. For details on how to set up permissions for cross-account invocations, see Granting function access to other accounts.
   */
  invoke(params: Lambda.Types.InvocationRequest, callback?: (err: AWSError, data: Lambda.Types.InvocationResponse) => void): Request<Lambda.Types.InvocationResponse, AWSError>;
  /**
   * Invokes a Lambda function. You can invoke a function synchronously (and wait for the response), or asynchronously. To invoke a function asynchronously, set InvocationType to Event. For synchronous invocation, details about the function response, including errors, are included in the response body and headers. For either invocation type, you can find more information in the execution log and trace. When an error occurs, your function may be invoked multiple times. Retry behavior varies by error type, client, event source, and invocation type. For example, if you invoke a function asynchronously and it returns an error, Lambda executes the function up to two more times. For more information, see Error handling and automatic retries in Lambda. For asynchronous invocation, Lambda adds events to a queue before sending them to your function. If your function does not have enough capacity to keep up with the queue, events may be lost. Occasionally, your function may receive the same event multiple times, even if no error occurs. To retain events that were not processed, configure your function with a dead-letter queue. The status code in the API response doesn't reflect function errors. Error codes are reserved for errors that prevent your function from executing, such as permissions errors, quota errors, or issues with your function's code and configuration. For example, Lambda returns TooManyRequestsException if running the function would cause you to exceed a concurrency limit at either the account level (ConcurrentInvocationLimitExceeded) or function level (ReservedFunctionConcurrentInvocationLimitExceeded). For functions with a long timeout, your client might disconnect during synchronous invocation while it waits for a response. Configure your HTTP client, SDK, firewall, proxy, or operating system to allow for long connections with timeout or keep-alive settings. This operation requires permission for the lambda:InvokeFunction action. For details on how to set up permissions for cross-account invocations, see Granting function access to other accounts.
   */
  invoke(callback?: (err: AWSError, data: Lambda.Types.InvocationResponse) => void): Request<Lambda.Types.InvocationResponse, AWSError>;
  /**
   *  For asynchronous function invocation, use Invoke.  Invokes a function asynchronously.
   */
  invokeAsync(params: Lambda.Types.InvokeAsyncRequest, callback?: (err: AWSError, data: Lambda.Types.InvokeAsyncResponse) => void): Request<Lambda.Types.InvokeAsyncResponse, AWSError>;
  /**
   *  For asynchronous function invocation, use Invoke.  Invokes a function asynchronously.
   */
  invokeAsync(callback?: (err: AWSError, data: Lambda.Types.InvokeAsyncResponse) => void): Request<Lambda.Types.InvokeAsyncResponse, AWSError>;
  /**
   * Configure your Lambda functions to stream response payloads back to clients. For more information, see Configuring a Lambda function to stream responses. This operation requires permission for the lambda:InvokeFunction action. For details on how to set up permissions for cross-account invocations, see Granting function access to other accounts.
   */
  invokeWithResponseStream(params: Lambda.Types.InvokeWithResponseStreamRequest, callback?: (err: AWSError, data: Lambda.Types.InvokeWithResponseStreamResponse) => void): Request<Lambda.Types.InvokeWithResponseStreamResponse, AWSError>;
  /**
   * Configure your Lambda functions to stream response payloads back to clients. For more information, see Configuring a Lambda function to stream responses. This operation requires permission for the lambda:InvokeFunction action. For details on how to set up permissions for cross-account invocations, see Granting function access to other accounts.
   */
  invokeWithResponseStream(callback?: (err: AWSError, data: Lambda.Types.InvokeWithResponseStreamResponse) => void): Request<Lambda.Types.InvokeWithResponseStreamResponse, AWSError>;
  /**
   * Returns a list of aliases for a Lambda function.
   */
  listAliases(params: Lambda.Types.ListAliasesRequest, callback?: (err: AWSError, data: Lambda.Types.ListAliasesResponse) => void): Request<Lambda.Types.ListAliasesResponse, AWSError>;
  /**
   * Returns a list of aliases for a Lambda function.
   */
  listAliases(callback?: (err: AWSError, data: Lambda.Types.ListAliasesResponse) => void): Request<Lambda.Types.ListAliasesResponse, AWSError>;
  /**
   * Returns a list of code signing configurations. A request returns up to 10,000 configurations per call. You can use the MaxItems parameter to return fewer configurations per call. 
   */
  listCodeSigningConfigs(params: Lambda.Types.ListCodeSigningConfigsRequest, callback?: (err: AWSError, data: Lambda.Types.ListCodeSigningConfigsResponse) => void): Request<Lambda.Types.ListCodeSigningConfigsResponse, AWSError>;
  /**
   * Returns a list of code signing configurations. A request returns up to 10,000 configurations per call. You can use the MaxItems parameter to return fewer configurations per call. 
   */
  listCodeSigningConfigs(callback?: (err: AWSError, data: Lambda.Types.ListCodeSigningConfigsResponse) => void): Request<Lambda.Types.ListCodeSigningConfigsResponse, AWSError>;
  /**
   * Lists event source mappings. Specify an EventSourceArn to show only event source mappings for a single event source.
   */
  listEventSourceMappings(params: Lambda.Types.ListEventSourceMappingsRequest, callback?: (err: AWSError, data: Lambda.Types.ListEventSourceMappingsResponse) => void): Request<Lambda.Types.ListEventSourceMappingsResponse, AWSError>;
  /**
   * Lists event source mappings. Specify an EventSourceArn to show only event source mappings for a single event source.
   */
  listEventSourceMappings(callback?: (err: AWSError, data: Lambda.Types.ListEventSourceMappingsResponse) => void): Request<Lambda.Types.ListEventSourceMappingsResponse, AWSError>;
  /**
   * Retrieves a list of configurations for asynchronous invocation for a function. To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
   */
  listFunctionEventInvokeConfigs(params: Lambda.Types.ListFunctionEventInvokeConfigsRequest, callback?: (err: AWSError, data: Lambda.Types.ListFunctionEventInvokeConfigsResponse) => void): Request<Lambda.Types.ListFunctionEventInvokeConfigsResponse, AWSError>;
  /**
   * Retrieves a list of configurations for asynchronous invocation for a function. To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
   */
  listFunctionEventInvokeConfigs(callback?: (err: AWSError, data: Lambda.Types.ListFunctionEventInvokeConfigsResponse) => void): Request<Lambda.Types.ListFunctionEventInvokeConfigsResponse, AWSError>;
  /**
   * Returns a list of Lambda function URLs for the specified function.
   */
  listFunctionUrlConfigs(params: Lambda.Types.ListFunctionUrlConfigsRequest, callback?: (err: AWSError, data: Lambda.Types.ListFunctionUrlConfigsResponse) => void): Request<Lambda.Types.ListFunctionUrlConfigsResponse, AWSError>;
  /**
   * Returns a list of Lambda function URLs for the specified function.
   */
  listFunctionUrlConfigs(callback?: (err: AWSError, data: Lambda.Types.ListFunctionUrlConfigsResponse) => void): Request<Lambda.Types.ListFunctionUrlConfigsResponse, AWSError>;
  /**
   * Returns a list of Lambda functions, with the version-specific configuration of each. Lambda returns up to 50 functions per call. Set FunctionVersion to ALL to include all published versions of each function in addition to the unpublished version.  The ListFunctions operation returns a subset of the FunctionConfiguration fields. To get the additional fields (State, StateReasonCode, StateReason, LastUpdateStatus, LastUpdateStatusReason, LastUpdateStatusReasonCode, RuntimeVersionConfig) for a function or version, use GetFunction. 
   */
  listFunctions(params: Lambda.Types.ListFunctionsRequest, callback?: (err: AWSError, data: Lambda.Types.ListFunctionsResponse) => void): Request<Lambda.Types.ListFunctionsResponse, AWSError>;
  /**
   * Returns a list of Lambda functions, with the version-specific configuration of each. Lambda returns up to 50 functions per call. Set FunctionVersion to ALL to include all published versions of each function in addition to the unpublished version.  The ListFunctions operation returns a subset of the FunctionConfiguration fields. To get the additional fields (State, StateReasonCode, StateReason, LastUpdateStatus, LastUpdateStatusReason, LastUpdateStatusReasonCode, RuntimeVersionConfig) for a function or version, use GetFunction. 
   */
  listFunctions(callback?: (err: AWSError, data: Lambda.Types.ListFunctionsResponse) => void): Request<Lambda.Types.ListFunctionsResponse, AWSError>;
  /**
   * List the functions that use the specified code signing configuration. You can use this method prior to deleting a code signing configuration, to verify that no functions are using it.
   */
  listFunctionsByCodeSigningConfig(params: Lambda.Types.ListFunctionsByCodeSigningConfigRequest, callback?: (err: AWSError, data: Lambda.Types.ListFunctionsByCodeSigningConfigResponse) => void): Request<Lambda.Types.ListFunctionsByCodeSigningConfigResponse, AWSError>;
  /**
   * List the functions that use the specified code signing configuration. You can use this method prior to deleting a code signing configuration, to verify that no functions are using it.
   */
  listFunctionsByCodeSigningConfig(callback?: (err: AWSError, data: Lambda.Types.ListFunctionsByCodeSigningConfigResponse) => void): Request<Lambda.Types.ListFunctionsByCodeSigningConfigResponse, AWSError>;
  /**
   * Lists the versions of an Lambda layer. Versions that have been deleted aren't listed. Specify a runtime identifier to list only versions that indicate that they're compatible with that runtime. Specify a compatible architecture to include only layer versions that are compatible with that architecture.
   */
  listLayerVersions(params: Lambda.Types.ListLayerVersionsRequest, callback?: (err: AWSError, data: Lambda.Types.ListLayerVersionsResponse) => void): Request<Lambda.Types.ListLayerVersionsResponse, AWSError>;
  /**
   * Lists the versions of an Lambda layer. Versions that have been deleted aren't listed. Specify a runtime identifier to list only versions that indicate that they're compatible with that runtime. Specify a compatible architecture to include only layer versions that are compatible with that architecture.
   */
  listLayerVersions(callback?: (err: AWSError, data: Lambda.Types.ListLayerVersionsResponse) => void): Request<Lambda.Types.ListLayerVersionsResponse, AWSError>;
  /**
   * Lists Lambda layers and shows information about the latest version of each. Specify a runtime identifier to list only layers that indicate that they're compatible with that runtime. Specify a compatible architecture to include only layers that are compatible with that instruction set architecture.
   */
  listLayers(params: Lambda.Types.ListLayersRequest, callback?: (err: AWSError, data: Lambda.Types.ListLayersResponse) => void): Request<Lambda.Types.ListLayersResponse, AWSError>;
  /**
   * Lists Lambda layers and shows information about the latest version of each. Specify a runtime identifier to list only layers that indicate that they're compatible with that runtime. Specify a compatible architecture to include only layers that are compatible with that instruction set architecture.
   */
  listLayers(callback?: (err: AWSError, data: Lambda.Types.ListLayersResponse) => void): Request<Lambda.Types.ListLayersResponse, AWSError>;
  /**
   * Retrieves a list of provisioned concurrency configurations for a function.
   */
  listProvisionedConcurrencyConfigs(params: Lambda.Types.ListProvisionedConcurrencyConfigsRequest, callback?: (err: AWSError, data: Lambda.Types.ListProvisionedConcurrencyConfigsResponse) => void): Request<Lambda.Types.ListProvisionedConcurrencyConfigsResponse, AWSError>;
  /**
   * Retrieves a list of provisioned concurrency configurations for a function.
   */
  listProvisionedConcurrencyConfigs(callback?: (err: AWSError, data: Lambda.Types.ListProvisionedConcurrencyConfigsResponse) => void): Request<Lambda.Types.ListProvisionedConcurrencyConfigsResponse, AWSError>;
  /**
   * Returns a function's tags. You can also view tags with GetFunction.
   */
  listTags(params: Lambda.Types.ListTagsRequest, callback?: (err: AWSError, data: Lambda.Types.ListTagsResponse) => void): Request<Lambda.Types.ListTagsResponse, AWSError>;
  /**
   * Returns a function's tags. You can also view tags with GetFunction.
   */
  listTags(callback?: (err: AWSError, data: Lambda.Types.ListTagsResponse) => void): Request<Lambda.Types.ListTagsResponse, AWSError>;
  /**
   * Returns a list of versions, with the version-specific configuration of each. Lambda returns up to 50 versions per call.
   */
  listVersionsByFunction(params: Lambda.Types.ListVersionsByFunctionRequest, callback?: (err: AWSError, data: Lambda.Types.ListVersionsByFunctionResponse) => void): Request<Lambda.Types.ListVersionsByFunctionResponse, AWSError>;
  /**
   * Returns a list of versions, with the version-specific configuration of each. Lambda returns up to 50 versions per call.
   */
  listVersionsByFunction(callback?: (err: AWSError, data: Lambda.Types.ListVersionsByFunctionResponse) => void): Request<Lambda.Types.ListVersionsByFunctionResponse, AWSError>;
  /**
   * Creates an Lambda layer from a ZIP archive. Each time you call PublishLayerVersion with the same layer name, a new version is created. Add layers to your function with CreateFunction or UpdateFunctionConfiguration.
   */
  publishLayerVersion(params: Lambda.Types.PublishLayerVersionRequest, callback?: (err: AWSError, data: Lambda.Types.PublishLayerVersionResponse) => void): Request<Lambda.Types.PublishLayerVersionResponse, AWSError>;
  /**
   * Creates an Lambda layer from a ZIP archive. Each time you call PublishLayerVersion with the same layer name, a new version is created. Add layers to your function with CreateFunction or UpdateFunctionConfiguration.
   */
  publishLayerVersion(callback?: (err: AWSError, data: Lambda.Types.PublishLayerVersionResponse) => void): Request<Lambda.Types.PublishLayerVersionResponse, AWSError>;
  /**
   * Creates a version from the current code and configuration of a function. Use versions to create a snapshot of your function code and configuration that doesn't change. Lambda doesn't publish a version if the function's configuration and code haven't changed since the last version. Use UpdateFunctionCode or UpdateFunctionConfiguration to update the function before publishing a version. Clients can invoke versions directly or with an alias. To create an alias, use CreateAlias.
   */
  publishVersion(params: Lambda.Types.PublishVersionRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Creates a version from the current code and configuration of a function. Use versions to create a snapshot of your function code and configuration that doesn't change. Lambda doesn't publish a version if the function's configuration and code haven't changed since the last version. Use UpdateFunctionCode or UpdateFunctionConfiguration to update the function before publishing a version. Clients can invoke versions directly or with an alias. To create an alias, use CreateAlias.
   */
  publishVersion(callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Update the code signing configuration for the function. Changes to the code signing configuration take effect the next time a user tries to deploy a code package to the function. 
   */
  putFunctionCodeSigningConfig(params: Lambda.Types.PutFunctionCodeSigningConfigRequest, callback?: (err: AWSError, data: Lambda.Types.PutFunctionCodeSigningConfigResponse) => void): Request<Lambda.Types.PutFunctionCodeSigningConfigResponse, AWSError>;
  /**
   * Update the code signing configuration for the function. Changes to the code signing configuration take effect the next time a user tries to deploy a code package to the function. 
   */
  putFunctionCodeSigningConfig(callback?: (err: AWSError, data: Lambda.Types.PutFunctionCodeSigningConfigResponse) => void): Request<Lambda.Types.PutFunctionCodeSigningConfigResponse, AWSError>;
  /**
   * Sets the maximum number of simultaneous executions for a function, and reserves capacity for that concurrency level. Concurrency settings apply to the function as a whole, including all published versions and the unpublished version. Reserving concurrency both ensures that your function has capacity to process the specified number of events simultaneously, and prevents it from scaling beyond that level. Use GetFunction to see the current setting for a function. Use GetAccountSettings to see your Regional concurrency limit. You can reserve concurrency for as many functions as you like, as long as you leave at least 100 simultaneous executions unreserved for functions that aren't configured with a per-function limit. For more information, see Lambda function scaling.
   */
  putFunctionConcurrency(params: Lambda.Types.PutFunctionConcurrencyRequest, callback?: (err: AWSError, data: Lambda.Types.Concurrency) => void): Request<Lambda.Types.Concurrency, AWSError>;
  /**
   * Sets the maximum number of simultaneous executions for a function, and reserves capacity for that concurrency level. Concurrency settings apply to the function as a whole, including all published versions and the unpublished version. Reserving concurrency both ensures that your function has capacity to process the specified number of events simultaneously, and prevents it from scaling beyond that level. Use GetFunction to see the current setting for a function. Use GetAccountSettings to see your Regional concurrency limit. You can reserve concurrency for as many functions as you like, as long as you leave at least 100 simultaneous executions unreserved for functions that aren't configured with a per-function limit. For more information, see Lambda function scaling.
   */
  putFunctionConcurrency(callback?: (err: AWSError, data: Lambda.Types.Concurrency) => void): Request<Lambda.Types.Concurrency, AWSError>;
  /**
   * Configures options for asynchronous invocation on a function, version, or alias. If a configuration already exists for a function, version, or alias, this operation overwrites it. If you exclude any settings, they are removed. To set one option without affecting existing settings for other options, use UpdateFunctionEventInvokeConfig. By default, Lambda retries an asynchronous invocation twice if the function returns an error. It retains events in a queue for up to six hours. When an event fails all processing attempts or stays in the asynchronous invocation queue for too long, Lambda discards it. To retain discarded events, configure a dead-letter queue with UpdateFunctionConfiguration. To send an invocation record to a queue, topic, function, or event bus, specify a destination. You can configure separate destinations for successful invocations (on-success) and events that fail all processing attempts (on-failure). You can configure destinations in addition to or instead of a dead-letter queue.
   */
  putFunctionEventInvokeConfig(params: Lambda.Types.PutFunctionEventInvokeConfigRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionEventInvokeConfig) => void): Request<Lambda.Types.FunctionEventInvokeConfig, AWSError>;
  /**
   * Configures options for asynchronous invocation on a function, version, or alias. If a configuration already exists for a function, version, or alias, this operation overwrites it. If you exclude any settings, they are removed. To set one option without affecting existing settings for other options, use UpdateFunctionEventInvokeConfig. By default, Lambda retries an asynchronous invocation twice if the function returns an error. It retains events in a queue for up to six hours. When an event fails all processing attempts or stays in the asynchronous invocation queue for too long, Lambda discards it. To retain discarded events, configure a dead-letter queue with UpdateFunctionConfiguration. To send an invocation record to a queue, topic, function, or event bus, specify a destination. You can configure separate destinations for successful invocations (on-success) and events that fail all processing attempts (on-failure). You can configure destinations in addition to or instead of a dead-letter queue.
   */
  putFunctionEventInvokeConfig(callback?: (err: AWSError, data: Lambda.Types.FunctionEventInvokeConfig) => void): Request<Lambda.Types.FunctionEventInvokeConfig, AWSError>;
  /**
   * Adds a provisioned concurrency configuration to a function's alias or version.
   */
  putProvisionedConcurrencyConfig(params: Lambda.Types.PutProvisionedConcurrencyConfigRequest, callback?: (err: AWSError, data: Lambda.Types.PutProvisionedConcurrencyConfigResponse) => void): Request<Lambda.Types.PutProvisionedConcurrencyConfigResponse, AWSError>;
  /**
   * Adds a provisioned concurrency configuration to a function's alias or version.
   */
  putProvisionedConcurrencyConfig(callback?: (err: AWSError, data: Lambda.Types.PutProvisionedConcurrencyConfigResponse) => void): Request<Lambda.Types.PutProvisionedConcurrencyConfigResponse, AWSError>;
  /**
   * Sets the runtime management configuration for a function's version. For more information, see Runtime updates.
   */
  putRuntimeManagementConfig(params: Lambda.Types.PutRuntimeManagementConfigRequest, callback?: (err: AWSError, data: Lambda.Types.PutRuntimeManagementConfigResponse) => void): Request<Lambda.Types.PutRuntimeManagementConfigResponse, AWSError>;
  /**
   * Sets the runtime management configuration for a function's version. For more information, see Runtime updates.
   */
  putRuntimeManagementConfig(callback?: (err: AWSError, data: Lambda.Types.PutRuntimeManagementConfigResponse) => void): Request<Lambda.Types.PutRuntimeManagementConfigResponse, AWSError>;
  /**
   * Removes a statement from the permissions policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
   */
  removeLayerVersionPermission(params: Lambda.Types.RemoveLayerVersionPermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a statement from the permissions policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
   */
  removeLayerVersionPermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes function-use permission from an Amazon Web Service or another Amazon Web Services account. You can get the ID of the statement from the output of GetPolicy.
   */
  removePermission(params: Lambda.Types.RemovePermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes function-use permission from an Amazon Web Service or another Amazon Web Services account. You can get the ID of the statement from the output of GetPolicy.
   */
  removePermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds tags to a function.
   */
  tagResource(params: Lambda.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds tags to a function.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from a function.
   */
  untagResource(params: Lambda.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from a function.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the configuration of a Lambda function alias.
   */
  updateAlias(params: Lambda.Types.UpdateAliasRequest, callback?: (err: AWSError, data: Lambda.Types.AliasConfiguration) => void): Request<Lambda.Types.AliasConfiguration, AWSError>;
  /**
   * Updates the configuration of a Lambda function alias.
   */
  updateAlias(callback?: (err: AWSError, data: Lambda.Types.AliasConfiguration) => void): Request<Lambda.Types.AliasConfiguration, AWSError>;
  /**
   * Update the code signing configuration. Changes to the code signing configuration take effect the next time a user tries to deploy a code package to the function. 
   */
  updateCodeSigningConfig(params: Lambda.Types.UpdateCodeSigningConfigRequest, callback?: (err: AWSError, data: Lambda.Types.UpdateCodeSigningConfigResponse) => void): Request<Lambda.Types.UpdateCodeSigningConfigResponse, AWSError>;
  /**
   * Update the code signing configuration. Changes to the code signing configuration take effect the next time a user tries to deploy a code package to the function. 
   */
  updateCodeSigningConfig(callback?: (err: AWSError, data: Lambda.Types.UpdateCodeSigningConfigResponse) => void): Request<Lambda.Types.UpdateCodeSigningConfigResponse, AWSError>;
  /**
   * Updates an event source mapping. You can change the function that Lambda invokes, or pause invocation and resume later from the same location. For details about how to configure different event sources, see the following topics.      Amazon DynamoDB Streams      Amazon Kinesis      Amazon SQS      Amazon MQ and RabbitMQ      Amazon MSK      Apache Kafka      Amazon DocumentDB    The following error handling options are available only for stream sources (DynamoDB and Kinesis):    BisectBatchOnFunctionError – If the function returns an error, split the batch in two and retry.    DestinationConfig – Send discarded records to an Amazon SQS queue or Amazon SNS topic.    MaximumRecordAgeInSeconds – Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires    MaximumRetryAttempts – Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.    ParallelizationFactor – Process multiple batches from each shard concurrently.   For information about which configuration parameters apply to each event source, see the following topics.     Amazon DynamoDB Streams      Amazon Kinesis      Amazon SQS      Amazon MQ and RabbitMQ      Amazon MSK      Apache Kafka      Amazon DocumentDB   
   */
  updateEventSourceMapping(params: Lambda.Types.UpdateEventSourceMappingRequest, callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Updates an event source mapping. You can change the function that Lambda invokes, or pause invocation and resume later from the same location. For details about how to configure different event sources, see the following topics.      Amazon DynamoDB Streams      Amazon Kinesis      Amazon SQS      Amazon MQ and RabbitMQ      Amazon MSK      Apache Kafka      Amazon DocumentDB    The following error handling options are available only for stream sources (DynamoDB and Kinesis):    BisectBatchOnFunctionError – If the function returns an error, split the batch in two and retry.    DestinationConfig – Send discarded records to an Amazon SQS queue or Amazon SNS topic.    MaximumRecordAgeInSeconds – Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires    MaximumRetryAttempts – Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.    ParallelizationFactor – Process multiple batches from each shard concurrently.   For information about which configuration parameters apply to each event source, see the following topics.     Amazon DynamoDB Streams      Amazon Kinesis      Amazon SQS      Amazon MQ and RabbitMQ      Amazon MSK      Apache Kafka      Amazon DocumentDB   
   */
  updateEventSourceMapping(callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Updates a Lambda function's code. If code signing is enabled for the function, the code package must be signed by a trusted publisher. For more information, see Configuring code signing for Lambda. If the function's package type is Image, then you must specify the code package in ImageUri as the URI of a container image in the Amazon ECR registry. If the function's package type is Zip, then you must specify the deployment package as a .zip file archive. Enter the Amazon S3 bucket and key of the code .zip file location. You can also provide the function code inline using the ZipFile field. The code in the deployment package must be compatible with the target instruction set architecture of the function (x86-64 or arm64). The function's code is locked when you publish a version. You can't modify the code of a published version, only the unpublished version.  For a function defined as a container image, Lambda resolves the image tag to an image digest. In Amazon ECR, if you update the image tag to a new image, Lambda does not automatically update the function. 
   */
  updateFunctionCode(params: Lambda.Types.UpdateFunctionCodeRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Updates a Lambda function's code. If code signing is enabled for the function, the code package must be signed by a trusted publisher. For more information, see Configuring code signing for Lambda. If the function's package type is Image, then you must specify the code package in ImageUri as the URI of a container image in the Amazon ECR registry. If the function's package type is Zip, then you must specify the deployment package as a .zip file archive. Enter the Amazon S3 bucket and key of the code .zip file location. You can also provide the function code inline using the ZipFile field. The code in the deployment package must be compatible with the target instruction set architecture of the function (x86-64 or arm64). The function's code is locked when you publish a version. You can't modify the code of a published version, only the unpublished version.  For a function defined as a container image, Lambda resolves the image tag to an image digest. In Amazon ECR, if you update the image tag to a new image, Lambda does not automatically update the function. 
   */
  updateFunctionCode(callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Modify the version-specific settings of a Lambda function. When you update a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute. During this time, you can't modify the function, but you can still invoke it. The LastUpdateStatus, LastUpdateStatusReason, and LastUpdateStatusReasonCode fields in the response from GetFunctionConfiguration indicate when the update is complete and the function is processing events with the new configuration. For more information, see Lambda function states. These settings can vary between versions of a function and are locked when you publish a version. You can't modify the configuration of a published version, only the unpublished version. To configure function concurrency, use PutFunctionConcurrency. To grant invoke permissions to an Amazon Web Services account or Amazon Web Service, use AddPermission.
   */
  updateFunctionConfiguration(params: Lambda.Types.UpdateFunctionConfigurationRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Modify the version-specific settings of a Lambda function. When you update a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute. During this time, you can't modify the function, but you can still invoke it. The LastUpdateStatus, LastUpdateStatusReason, and LastUpdateStatusReasonCode fields in the response from GetFunctionConfiguration indicate when the update is complete and the function is processing events with the new configuration. For more information, see Lambda function states. These settings can vary between versions of a function and are locked when you publish a version. You can't modify the configuration of a published version, only the unpublished version. To configure function concurrency, use PutFunctionConcurrency. To grant invoke permissions to an Amazon Web Services account or Amazon Web Service, use AddPermission.
   */
  updateFunctionConfiguration(callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Updates the configuration for asynchronous invocation for a function, version, or alias. To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
   */
  updateFunctionEventInvokeConfig(params: Lambda.Types.UpdateFunctionEventInvokeConfigRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionEventInvokeConfig) => void): Request<Lambda.Types.FunctionEventInvokeConfig, AWSError>;
  /**
   * Updates the configuration for asynchronous invocation for a function, version, or alias. To configure options for asynchronous invocation, use PutFunctionEventInvokeConfig.
   */
  updateFunctionEventInvokeConfig(callback?: (err: AWSError, data: Lambda.Types.FunctionEventInvokeConfig) => void): Request<Lambda.Types.FunctionEventInvokeConfig, AWSError>;
  /**
   * Updates the configuration for a Lambda function URL.
   */
  updateFunctionUrlConfig(params: Lambda.Types.UpdateFunctionUrlConfigRequest, callback?: (err: AWSError, data: Lambda.Types.UpdateFunctionUrlConfigResponse) => void): Request<Lambda.Types.UpdateFunctionUrlConfigResponse, AWSError>;
  /**
   * Updates the configuration for a Lambda function URL.
   */
  updateFunctionUrlConfig(callback?: (err: AWSError, data: Lambda.Types.UpdateFunctionUrlConfigResponse) => void): Request<Lambda.Types.UpdateFunctionUrlConfigResponse, AWSError>;
  /**
   * Waits for the functionExists state by periodically calling the underlying Lambda.getFunctionoperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "functionExists", params: Lambda.Types.GetFunctionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Waits for the functionExists state by periodically calling the underlying Lambda.getFunctionoperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "functionExists", callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Waits for the functionActive state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 60 times). Waits for the function's State to be Active. This waiter uses GetFunctionConfiguration API. This should be used after new function creation.
   */
  waitFor(state: "functionActive", params: Lambda.Types.GetFunctionConfigurationRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Waits for the functionActive state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 60 times). Waits for the function's State to be Active. This waiter uses GetFunctionConfiguration API. This should be used after new function creation.
   */
  waitFor(state: "functionActive", callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Waits for the functionUpdated state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 60 times). Waits for the function's LastUpdateStatus to be Successful. This waiter uses GetFunctionConfiguration API. This should be used after function updates.
   */
  waitFor(state: "functionUpdated", params: Lambda.Types.GetFunctionConfigurationRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Waits for the functionUpdated state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 60 times). Waits for the function's LastUpdateStatus to be Successful. This waiter uses GetFunctionConfiguration API. This should be used after function updates.
   */
  waitFor(state: "functionUpdated", callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Waits for the functionActiveV2 state by periodically calling the underlying Lambda.getFunctionoperation every 1 seconds (at most 300 times). Waits for the function's State to be Active. This waiter uses GetFunction API. This should be used after new function creation.
   */
  waitFor(state: "functionActiveV2", params: Lambda.Types.GetFunctionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Waits for the functionActiveV2 state by periodically calling the underlying Lambda.getFunctionoperation every 1 seconds (at most 300 times). Waits for the function's State to be Active. This waiter uses GetFunction API. This should be used after new function creation.
   */
  waitFor(state: "functionActiveV2", callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Waits for the functionUpdatedV2 state by periodically calling the underlying Lambda.getFunctionoperation every 1 seconds (at most 300 times). Waits for the function's LastUpdateStatus to be Successful. This waiter uses GetFunction API. This should be used after function updates.
   */
  waitFor(state: "functionUpdatedV2", params: Lambda.Types.GetFunctionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Waits for the functionUpdatedV2 state by periodically calling the underlying Lambda.getFunctionoperation every 1 seconds (at most 300 times). Waits for the function's LastUpdateStatus to be Successful. This waiter uses GetFunction API. This should be used after function updates.
   */
  waitFor(state: "functionUpdatedV2", callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Waits for the publishedVersionActive state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 312 times). Waits for the published version's State to be Active. This waiter uses GetFunctionConfiguration API. This should be used after new version is published.
   */
  waitFor(state: "publishedVersionActive", params: Lambda.Types.GetFunctionConfigurationRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Waits for the publishedVersionActive state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 312 times). Waits for the published version's State to be Active. This waiter uses GetFunctionConfiguration API. This should be used after new version is published.
   */
  waitFor(state: "publishedVersionActive", callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
}
declare namespace Lambda {
  export interface AccountLimit {
    /**
     * The amount of storage space that you can use for all deployment packages and layer archives.
     */
    TotalCodeSize?: Long;
    /**
     * The maximum size of a function's deployment package and layers when they're extracted.
     */
    CodeSizeUnzipped?: Long;
    /**
     * The maximum size of a deployment package when it's uploaded directly to Lambda. Use Amazon S3 for larger files.
     */
    CodeSizeZipped?: Long;
    /**
     * The maximum number of simultaneous function executions.
     */
    ConcurrentExecutions?: Integer;
    /**
     * The maximum number of simultaneous function executions, minus the capacity that's reserved for individual functions with PutFunctionConcurrency.
     */
    UnreservedConcurrentExecutions?: UnreservedConcurrentExecutions;
  }
  export interface AccountUsage {
    /**
     * The amount of storage space, in bytes, that's being used by deployment packages and layer archives.
     */
    TotalCodeSize?: Long;
    /**
     * The number of Lambda functions.
     */
    FunctionCount?: Long;
  }
  export type Action = string;
  export interface AddLayerVersionPermissionRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     */
    LayerName: LayerName;
    /**
     * The version number.
     */
    VersionNumber: LayerVersionNumber;
    /**
     * An identifier that distinguishes the policy from others on the same layer version.
     */
    StatementId: StatementId;
    /**
     * The API action that grants access to the layer. For example, lambda:GetLayerVersion.
     */
    Action: LayerPermissionAllowedAction;
    /**
     * An account ID, or * to grant layer usage permission to all accounts in an organization, or all Amazon Web Services accounts (if organizationId is not specified). For the last case, make sure that you really do want all Amazon Web Services accounts to have usage permission to this layer. 
     */
    Principal: LayerPermissionAllowedPrincipal;
    /**
     * With the principal set to *, grant permission to all accounts in the specified organization.
     */
    OrganizationId?: OrganizationId;
    /**
     * Only update the policy if the revision ID matches the ID specified. Use this option to avoid modifying a policy that has changed since you last read it.
     */
    RevisionId?: String;
  }
  export interface AddLayerVersionPermissionResponse {
    /**
     * The permission statement.
     */
    Statement?: String;
    /**
     * A unique identifier for the current revision of the policy.
     */
    RevisionId?: String;
  }
  export interface AddPermissionRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name – my-function (name-only), my-function:v1 (with alias).    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * A statement identifier that differentiates the statement from others in the same policy.
     */
    StatementId: StatementId;
    /**
     * The action that the principal can use on the function. For example, lambda:InvokeFunction or lambda:GetFunction.
     */
    Action: Action;
    /**
     * The Amazon Web Service or Amazon Web Services account that invokes the function. If you specify a service, use SourceArn or SourceAccount to limit who can invoke the function through that service.
     */
    Principal: Principal;
    /**
     * For Amazon Web Services, the ARN of the Amazon Web Services resource that invokes the function. For example, an Amazon S3 bucket or Amazon SNS topic. Note that Lambda configures the comparison using the StringLike operator.
     */
    SourceArn?: Arn;
    /**
     * For Amazon Web Service, the ID of the Amazon Web Services account that owns the resource. Use this together with SourceArn to ensure that the specified account owns the resource. It is possible for an Amazon S3 bucket to be deleted by its owner and recreated by another account.
     */
    SourceAccount?: SourceOwner;
    /**
     * For Alexa Smart Home functions, a token that the invoker must supply.
     */
    EventSourceToken?: EventSourceToken;
    /**
     * Specify a version or alias to add permissions to a published version of the function.
     */
    Qualifier?: Qualifier;
    /**
     * Update the policy only if the revision ID matches the ID that's specified. Use this option to avoid modifying a policy that has changed since you last read it.
     */
    RevisionId?: String;
    /**
     * The identifier for your organization in Organizations. Use this to grant permissions to all the Amazon Web Services accounts under this organization.
     */
    PrincipalOrgID?: PrincipalOrgID;
    /**
     * The type of authentication that your function URL uses. Set to AWS_IAM if you want to restrict access to authenticated users only. Set to NONE if you want to bypass IAM authentication to create a public endpoint. For more information, see Security and auth model for Lambda function URLs.
     */
    FunctionUrlAuthType?: FunctionUrlAuthType;
  }
  export interface AddPermissionResponse {
    /**
     * The permission statement that's added to the function policy.
     */
    Statement?: String;
  }
  export type AdditionalVersion = string;
  export type AdditionalVersionWeights = {[key: string]: Weight};
  export type Alias = string;
  export interface AliasConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the alias.
     */
    AliasArn?: FunctionArn;
    /**
     * The name of the alias.
     */
    Name?: Alias;
    /**
     * The function version that the alias invokes.
     */
    FunctionVersion?: Version;
    /**
     * A description of the alias.
     */
    Description?: Description;
    /**
     * The routing configuration of the alias.
     */
    RoutingConfig?: AliasRoutingConfiguration;
    /**
     * A unique identifier that changes when you update the alias.
     */
    RevisionId?: String;
  }
  export type AliasList = AliasConfiguration[];
  export interface AliasRoutingConfiguration {
    /**
     * The second version, and the percentage of traffic that's routed to it.
     */
    AdditionalVersionWeights?: AdditionalVersionWeights;
  }
  export type AllowCredentials = boolean;
  export type AllowMethodsList = Method[];
  export type AllowOriginsList = Origin[];
  export interface AllowedPublishers {
    /**
     * The Amazon Resource Name (ARN) for each of the signing profiles. A signing profile defines a trusted user who can sign a code package. 
     */
    SigningProfileVersionArns: SigningProfileVersionArns;
  }
  export interface AmazonManagedKafkaEventSourceConfig {
    /**
     * The identifier for the Kafka consumer group to join. The consumer group ID must be unique among all your Kafka event sources. After creating a Kafka event source mapping with the consumer group ID specified, you cannot update this value. For more information, see Customizable consumer group ID.
     */
    ConsumerGroupId?: URI;
  }
  export type Architecture = "x86_64"|"arm64"|string;
  export type ArchitecturesList = Architecture[];
  export type Arn = string;
  export type BatchSize = number;
  export type BisectBatchOnFunctionError = boolean;
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type BlobStream = Buffer|Uint8Array|Blob|string|Readable;
  export type Boolean = boolean;
  export interface CodeSigningConfig {
    /**
     * Unique identifer for the Code signing configuration.
     */
    CodeSigningConfigId: CodeSigningConfigId;
    /**
     * The Amazon Resource Name (ARN) of the Code signing configuration.
     */
    CodeSigningConfigArn: CodeSigningConfigArn;
    /**
     * Code signing configuration description.
     */
    Description?: Description;
    /**
     * List of allowed publishers.
     */
    AllowedPublishers: AllowedPublishers;
    /**
     * The code signing policy controls the validation failure action for signature mismatch or expiry.
     */
    CodeSigningPolicies: CodeSigningPolicies;
    /**
     * The date and time that the Code signing configuration was last modified, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD). 
     */
    LastModified: Timestamp;
  }
  export type CodeSigningConfigArn = string;
  export type CodeSigningConfigId = string;
  export type CodeSigningConfigList = CodeSigningConfig[];
  export interface CodeSigningPolicies {
    /**
     * Code signing configuration policy for deployment validation failure. If you set the policy to Enforce, Lambda blocks the deployment request if signature validation checks fail. If you set the policy to Warn, Lambda allows the deployment and creates a CloudWatch log.  Default value: Warn 
     */
    UntrustedArtifactOnDeployment?: CodeSigningPolicy;
  }
  export type CodeSigningPolicy = "Warn"|"Enforce"|string;
  export type CollectionName = string;
  export type CompatibleArchitectures = Architecture[];
  export type CompatibleRuntimes = Runtime[];
  export interface Concurrency {
    /**
     * The number of concurrent executions that are reserved for this function. For more information, see Managing Lambda reserved concurrency.
     */
    ReservedConcurrentExecutions?: ReservedConcurrentExecutions;
  }
  export interface Cors {
    /**
     * Whether to allow cookies or other credentials in requests to your function URL. The default is false.
     */
    AllowCredentials?: AllowCredentials;
    /**
     * The HTTP headers that origins can include in requests to your function URL. For example: Date, Keep-Alive, X-Custom-Header.
     */
    AllowHeaders?: HeadersList;
    /**
     * The HTTP methods that are allowed when calling your function URL. For example: GET, POST, DELETE, or the wildcard character (*).
     */
    AllowMethods?: AllowMethodsList;
    /**
     * The origins that can access your function URL. You can list any number of specific origins, separated by a comma. For example: https://www.example.com, http://localhost:60905. Alternatively, you can grant access to all origins using the wildcard character (*).
     */
    AllowOrigins?: AllowOriginsList;
    /**
     * The HTTP headers in your function response that you want to expose to origins that call your function URL. For example: Date, Keep-Alive, X-Custom-Header.
     */
    ExposeHeaders?: HeadersList;
    /**
     * The maximum amount of time, in seconds, that web browsers can cache results of a preflight request. By default, this is set to 0, which means that the browser doesn't cache results.
     */
    MaxAge?: MaxAge;
  }
  export interface CreateAliasRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The name of the alias.
     */
    Name: Alias;
    /**
     * The function version that the alias invokes.
     */
    FunctionVersion: Version;
    /**
     * A description of the alias.
     */
    Description?: Description;
    /**
     * The routing configuration of the alias.
     */
    RoutingConfig?: AliasRoutingConfiguration;
  }
  export interface CreateCodeSigningConfigRequest {
    /**
     * Descriptive name for this code signing configuration.
     */
    Description?: Description;
    /**
     * Signing profiles for this code signing configuration.
     */
    AllowedPublishers: AllowedPublishers;
    /**
     * The code signing policies define the actions to take if the validation checks fail. 
     */
    CodeSigningPolicies?: CodeSigningPolicies;
  }
  export interface CreateCodeSigningConfigResponse {
    /**
     * The code signing configuration.
     */
    CodeSigningConfig: CodeSigningConfig;
  }
  export interface CreateEventSourceMappingRequest {
    /**
     * The Amazon Resource Name (ARN) of the event source.    Amazon Kinesis – The ARN of the data stream or a stream consumer.    Amazon DynamoDB Streams – The ARN of the stream.    Amazon Simple Queue Service – The ARN of the queue.    Amazon Managed Streaming for Apache Kafka – The ARN of the cluster.    Amazon MQ – The ARN of the broker.    Amazon DocumentDB – The ARN of the DocumentDB change stream.  
     */
    EventSourceArn?: Arn;
    /**
     * The name of the Lambda function.  Name formats     Function name – MyFunction.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Version or Alias ARN – arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD.    Partial ARN – 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * When true, the event source mapping is active. When false, Lambda pauses polling and invocation. Default: True
     */
    Enabled?: Enabled;
    /**
     * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function. Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB).    Amazon Kinesis – Default 100. Max 10,000.    Amazon DynamoDB Streams – Default 100. Max 10,000.    Amazon Simple Queue Service – Default 10. For standard queues the max is 10,000. For FIFO queues the max is 10.    Amazon Managed Streaming for Apache Kafka – Default 100. Max 10,000.    Self-managed Apache Kafka – Default 100. Max 10,000.    Amazon MQ (ActiveMQ and RabbitMQ) – Default 100. Max 10,000.    DocumentDB – Default 100. Max 10,000.  
     */
    BatchSize?: BatchSize;
    /**
     * An object that defines the filter criteria that determine whether Lambda should process an event. For more information, see Lambda event filtering.
     */
    FilterCriteria?: FilterCriteria;
    /**
     * The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function. You can configure MaximumBatchingWindowInSeconds to any value from 0 seconds to 300 seconds in increments of seconds. For streams and Amazon SQS event sources, the default batching window is 0 seconds. For Amazon MSK, Self-managed Apache Kafka, Amazon MQ, and DocumentDB event sources, the default batching window is 500 ms. Note that because you can only change MaximumBatchingWindowInSeconds in increments of seconds, you cannot revert back to the 500 ms default batching window after you have changed it. To restore the default batching window, you must create a new event source mapping. Related setting: For streams and Amazon SQS event sources, when you set BatchSize to a value greater than 10, you must set MaximumBatchingWindowInSeconds to at least 1.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Kinesis and DynamoDB Streams only) The number of batches to process from each shard concurrently.
     */
    ParallelizationFactor?: ParallelizationFactor;
    /**
     * The position in a stream from which to start reading. Required for Amazon Kinesis and Amazon DynamoDB Stream event sources. AT_TIMESTAMP is supported only for Amazon Kinesis streams, Amazon DocumentDB, Amazon MSK, and self-managed Apache Kafka.
     */
    StartingPosition?: EventSourcePosition;
    /**
     * With StartingPosition set to AT_TIMESTAMP, the time from which to start reading. StartingPositionTimestamp cannot be in the future.
     */
    StartingPositionTimestamp?: _Date;
    /**
     * (Kinesis and DynamoDB Streams only) A standard Amazon SQS queue or standard Amazon SNS topic destination for discarded records.
     */
    DestinationConfig?: DestinationConfig;
    /**
     * (Kinesis and DynamoDB Streams only) Discard records older than the specified age. The default value is infinite (-1).
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry.
     */
    BisectBatchOnFunctionError?: BisectBatchOnFunctionError;
    /**
     * (Kinesis and DynamoDB Streams only) Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsEventSourceMapping;
    /**
     * (Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources. A value of 0 seconds indicates no tumbling window.
     */
    TumblingWindowInSeconds?: TumblingWindowInSeconds;
    /**
     * The name of the Kafka topic.
     */
    Topics?: Topics;
    /**
     *  (MQ) The name of the Amazon MQ broker destination queue to consume. 
     */
    Queues?: Queues;
    /**
     * An array of authentication protocols or VPC components required to secure your event source.
     */
    SourceAccessConfigurations?: SourceAccessConfigurations;
    /**
     * The self-managed Apache Kafka cluster to receive records from.
     */
    SelfManagedEventSource?: SelfManagedEventSource;
    /**
     * (Kinesis, DynamoDB Streams, and Amazon SQS) A list of current response type enums applied to the event source mapping.
     */
    FunctionResponseTypes?: FunctionResponseTypeList;
    /**
     * Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.
     */
    AmazonManagedKafkaEventSourceConfig?: AmazonManagedKafkaEventSourceConfig;
    /**
     * Specific configuration settings for a self-managed Apache Kafka event source.
     */
    SelfManagedKafkaEventSourceConfig?: SelfManagedKafkaEventSourceConfig;
    /**
     * (Amazon SQS only) The scaling configuration for the event source. For more information, see Configuring maximum concurrency for Amazon SQS event sources.
     */
    ScalingConfig?: ScalingConfig;
    /**
     * Specific configuration settings for a DocumentDB event source.
     */
    DocumentDBEventSourceConfig?: DocumentDBEventSourceConfig;
  }
  export interface CreateFunctionRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The identifier of the function's runtime. Runtime is required if the deployment package is a .zip file archive. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    Runtime?: Runtime;
    /**
     * The Amazon Resource Name (ARN) of the function's execution role.
     */
    Role: RoleArn;
    /**
     * The name of the method within your code that Lambda calls to run your function. Handler is required if the deployment package is a .zip file archive. The format includes the file name. It can also include namespaces and other qualifiers, depending on the runtime. For more information, see Lambda programming model.
     */
    Handler?: Handler;
    /**
     * The code for the function.
     */
    Code: FunctionCode;
    /**
     * A description of the function.
     */
    Description?: Description;
    /**
     * The amount of time (in seconds) that Lambda allows a function to run before stopping it. The default is 3 seconds. The maximum allowed value is 900 seconds. For more information, see Lambda execution environment.
     */
    Timeout?: Timeout;
    /**
     * The amount of memory available to the function at runtime. Increasing the function memory also increases its CPU allocation. The default value is 128 MB. The value can be any multiple of 1 MB.
     */
    MemorySize?: MemorySize;
    /**
     * Set to true to publish the first version of the function during creation.
     */
    Publish?: Boolean;
    /**
     * For network connectivity to Amazon Web Services resources in a VPC, specify a list of security groups and subnets in the VPC. When you connect a function to a VPC, it can access resources and the internet only through that VPC. For more information, see Configuring a Lambda function to access resources in a VPC.
     */
    VpcConfig?: VpcConfig;
    /**
     * The type of deployment package. Set to Image for container image and set to Zip for .zip file archive.
     */
    PackageType?: PackageType;
    /**
     * A dead-letter queue configuration that specifies the queue or topic where Lambda sends asynchronous events when they fail processing. For more information, see Dead-letter queues.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * Environment variables that are accessible from function code during execution.
     */
    Environment?: Environment;
    /**
     * The ARN of the Key Management Service (KMS) customer managed key that's used to encrypt your function's environment variables. When Lambda SnapStart is activated, Lambda also uses this key is to encrypt your function's snapshot. If you deploy your function using a container image, Lambda also uses this key to encrypt your function when it's deployed. Note that this is not the same key that's used to protect your container image in the Amazon Elastic Container Registry (Amazon ECR). If you don't provide a customer managed key, Lambda uses a default service key.
     */
    KMSKeyArn?: KMSKeyArn;
    /**
     * Set Mode to Active to sample and trace a subset of incoming requests with X-Ray.
     */
    TracingConfig?: TracingConfig;
    /**
     * A list of tags to apply to the function.
     */
    Tags?: Tags;
    /**
     * A list of function layers to add to the function's execution environment. Specify each layer by its ARN, including the version.
     */
    Layers?: LayerList;
    /**
     * Connection settings for an Amazon EFS file system.
     */
    FileSystemConfigs?: FileSystemConfigList;
    /**
     * Container image configuration values that override the values in the container image Dockerfile.
     */
    ImageConfig?: ImageConfig;
    /**
     * To enable code signing for this function, specify the ARN of a code-signing configuration. A code-signing configuration includes a set of signing profiles, which define the trusted publishers for this function.
     */
    CodeSigningConfigArn?: CodeSigningConfigArn;
    /**
     * The instruction set architecture that the function supports. Enter a string array with one of the valid values (arm64 or x86_64). The default value is x86_64.
     */
    Architectures?: ArchitecturesList;
    /**
     * The size of the function's /tmp directory in MB. The default value is 512, but can be any whole number between 512 and 10,240 MB.
     */
    EphemeralStorage?: EphemeralStorage;
    /**
     * The function's SnapStart setting.
     */
    SnapStart?: SnapStart;
  }
  export interface CreateFunctionUrlConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The alias name.
     */
    Qualifier?: FunctionUrlQualifier;
    /**
     * The type of authentication that your function URL uses. Set to AWS_IAM if you want to restrict access to authenticated users only. Set to NONE if you want to bypass IAM authentication to create a public endpoint. For more information, see Security and auth model for Lambda function URLs.
     */
    AuthType: FunctionUrlAuthType;
    /**
     * The cross-origin resource sharing (CORS) settings for your function URL.
     */
    Cors?: Cors;
    /**
     * Use one of the following options:    BUFFERED – This is the default option. Lambda invokes your function using the Invoke API operation. Invocation results are available when the payload is complete. The maximum payload size is 6 MB.    RESPONSE_STREAM – Your function streams payload results as they become available. Lambda invokes your function using the InvokeWithResponseStream API operation. The maximum response payload size is 20 MB, however, you can request a quota increase.  
     */
    InvokeMode?: InvokeMode;
  }
  export interface CreateFunctionUrlConfigResponse {
    /**
     * The HTTP URL endpoint for your function.
     */
    FunctionUrl: FunctionUrl;
    /**
     * The Amazon Resource Name (ARN) of your function.
     */
    FunctionArn: FunctionArn;
    /**
     * The type of authentication that your function URL uses. Set to AWS_IAM if you want to restrict access to authenticated users only. Set to NONE if you want to bypass IAM authentication to create a public endpoint. For more information, see Security and auth model for Lambda function URLs.
     */
    AuthType: FunctionUrlAuthType;
    /**
     * The cross-origin resource sharing (CORS) settings for your function URL.
     */
    Cors?: Cors;
    /**
     * When the function URL was created, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    CreationTime: Timestamp;
    /**
     * Use one of the following options:    BUFFERED – This is the default option. Lambda invokes your function using the Invoke API operation. Invocation results are available when the payload is complete. The maximum payload size is 6 MB.    RESPONSE_STREAM – Your function streams payload results as they become available. Lambda invokes your function using the InvokeWithResponseStream API operation. The maximum response payload size is 20 MB, however, you can request a quota increase.  
     */
    InvokeMode?: InvokeMode;
  }
  export type DatabaseName = string;
  export type _Date = Date;
  export interface DeadLetterConfig {
    /**
     * The Amazon Resource Name (ARN) of an Amazon SQS queue or Amazon SNS topic.
     */
    TargetArn?: ResourceArn;
  }
  export interface DeleteAliasRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The name of the alias.
     */
    Name: Alias;
  }
  export interface DeleteCodeSigningConfigRequest {
    /**
     * The The Amazon Resource Name (ARN) of the code signing configuration.
     */
    CodeSigningConfigArn: CodeSigningConfigArn;
  }
  export interface DeleteCodeSigningConfigResponse {
  }
  export interface DeleteEventSourceMappingRequest {
    /**
     * The identifier of the event source mapping.
     */
    UUID: String;
  }
  export interface DeleteFunctionCodeSigningConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
  }
  export interface DeleteFunctionConcurrencyRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
  }
  export interface DeleteFunctionEventInvokeConfigRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * A version number or alias name.
     */
    Qualifier?: Qualifier;
  }
  export interface DeleteFunctionRequest {
    /**
     * The name of the Lambda function or version.  Name formats     Function name – my-function (name-only), my-function:1 (with version).    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Specify a version to delete. You can't delete a version that an alias references.
     */
    Qualifier?: Qualifier;
  }
  export interface DeleteFunctionUrlConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The alias name.
     */
    Qualifier?: FunctionUrlQualifier;
  }
  export interface DeleteLayerVersionRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     */
    LayerName: LayerName;
    /**
     * The version number.
     */
    VersionNumber: LayerVersionNumber;
  }
  export interface DeleteProvisionedConcurrencyConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The version number or alias name.
     */
    Qualifier: Qualifier;
  }
  export type Description = string;
  export type DestinationArn = string;
  export interface DestinationConfig {
    /**
     * The destination configuration for successful invocations.
     */
    OnSuccess?: OnSuccess;
    /**
     * The destination configuration for failed invocations.
     */
    OnFailure?: OnFailure;
  }
  export interface DocumentDBEventSourceConfig {
    /**
     *  The name of the database to consume within the DocumentDB cluster. 
     */
    DatabaseName?: DatabaseName;
    /**
     *  The name of the collection to consume within the database. If you do not specify a collection, Lambda consumes all collections. 
     */
    CollectionName?: CollectionName;
    /**
     *  Determines what DocumentDB sends to your event stream during document update operations. If set to UpdateLookup, DocumentDB sends a delta describing the changes, along with a copy of the entire document. Otherwise, DocumentDB sends only a partial document that contains the changes. 
     */
    FullDocument?: FullDocument;
  }
  export type Enabled = boolean;
  export type EndPointType = "KAFKA_BOOTSTRAP_SERVERS"|string;
  export type Endpoint = string;
  export type EndpointLists = Endpoint[];
  export type Endpoints = {[key: string]: EndpointLists};
  export interface Environment {
    /**
     * Environment variable key-value pairs. For more information, see Using Lambda environment variables.
     */
    Variables?: EnvironmentVariables;
  }
  export interface EnvironmentError {
    /**
     * The error code.
     */
    ErrorCode?: String;
    /**
     * The error message.
     */
    Message?: SensitiveString;
  }
  export interface EnvironmentResponse {
    /**
     * Environment variable key-value pairs. Omitted from CloudTrail logs.
     */
    Variables?: EnvironmentVariables;
    /**
     * Error messages for environment variables that couldn't be applied.
     */
    Error?: EnvironmentError;
  }
  export type EnvironmentVariableName = string;
  export type EnvironmentVariableValue = string;
  export type EnvironmentVariables = {[key: string]: EnvironmentVariableValue};
  export interface EphemeralStorage {
    /**
     * The size of the function's /tmp directory.
     */
    Size: EphemeralStorageSize;
  }
  export type EphemeralStorageSize = number;
  export interface EventSourceMappingConfiguration {
    /**
     * The identifier of the event source mapping.
     */
    UUID?: String;
    /**
     * The position in a stream from which to start reading. Required for Amazon Kinesis and Amazon DynamoDB Stream event sources. AT_TIMESTAMP is supported only for Amazon Kinesis streams, Amazon DocumentDB, Amazon MSK, and self-managed Apache Kafka.
     */
    StartingPosition?: EventSourcePosition;
    /**
     * With StartingPosition set to AT_TIMESTAMP, the time from which to start reading. StartingPositionTimestamp cannot be in the future.
     */
    StartingPositionTimestamp?: _Date;
    /**
     * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function. Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB). Default value: Varies by service. For Amazon SQS, the default is 10. For all other services, the default is 100. Related setting: When you set BatchSize to a value greater than 10, you must set MaximumBatchingWindowInSeconds to at least 1.
     */
    BatchSize?: BatchSize;
    /**
     * The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function. You can configure MaximumBatchingWindowInSeconds to any value from 0 seconds to 300 seconds in increments of seconds. For streams and Amazon SQS event sources, the default batching window is 0 seconds. For Amazon MSK, Self-managed Apache Kafka, Amazon MQ, and DocumentDB event sources, the default batching window is 500 ms. Note that because you can only change MaximumBatchingWindowInSeconds in increments of seconds, you cannot revert back to the 500 ms default batching window after you have changed it. To restore the default batching window, you must create a new event source mapping. Related setting: For streams and Amazon SQS event sources, when you set BatchSize to a value greater than 10, you must set MaximumBatchingWindowInSeconds to at least 1.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Kinesis and DynamoDB Streams only) The number of batches to process concurrently from each shard. The default value is 1.
     */
    ParallelizationFactor?: ParallelizationFactor;
    /**
     * The Amazon Resource Name (ARN) of the event source.
     */
    EventSourceArn?: Arn;
    /**
     * An object that defines the filter criteria that determine whether Lambda should process an event. For more information, see Lambda event filtering.
     */
    FilterCriteria?: FilterCriteria;
    /**
     * The ARN of the Lambda function.
     */
    FunctionArn?: FunctionArn;
    /**
     * The date that the event source mapping was last updated or that its state changed.
     */
    LastModified?: _Date;
    /**
     * The result of the last Lambda invocation of your function.
     */
    LastProcessingResult?: String;
    /**
     * The state of the event source mapping. It can be one of the following: Creating, Enabling, Enabled, Disabling, Disabled, Updating, or Deleting.
     */
    State?: String;
    /**
     * Indicates whether a user or Lambda made the last change to the event source mapping.
     */
    StateTransitionReason?: String;
    /**
     * (Kinesis and DynamoDB Streams only) An Amazon SQS queue or Amazon SNS topic destination for discarded records.
     */
    DestinationConfig?: DestinationConfig;
    /**
     * The name of the Kafka topic.
     */
    Topics?: Topics;
    /**
     *  (Amazon MQ) The name of the Amazon MQ broker destination queue to consume.
     */
    Queues?: Queues;
    /**
     * An array of the authentication protocol, VPC components, or virtual host to secure and define your event source.
     */
    SourceAccessConfigurations?: SourceAccessConfigurations;
    /**
     * The self-managed Apache Kafka cluster for your event source.
     */
    SelfManagedEventSource?: SelfManagedEventSource;
    /**
     * (Kinesis and DynamoDB Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, Lambda never discards old records.  The minimum valid value for maximum record age is 60s. Although values less than 60 and greater than -1 fall within the parameter's absolute range, they are not allowed 
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry. The default value is false.
     */
    BisectBatchOnFunctionError?: BisectBatchOnFunctionError;
    /**
     * (Kinesis and DynamoDB Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, Lambda retries failed records until the record expires in the event source.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsEventSourceMapping;
    /**
     * (Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources. A value of 0 seconds indicates no tumbling window.
     */
    TumblingWindowInSeconds?: TumblingWindowInSeconds;
    /**
     * (Kinesis, DynamoDB Streams, and Amazon SQS) A list of current response type enums applied to the event source mapping.
     */
    FunctionResponseTypes?: FunctionResponseTypeList;
    /**
     * Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.
     */
    AmazonManagedKafkaEventSourceConfig?: AmazonManagedKafkaEventSourceConfig;
    /**
     * Specific configuration settings for a self-managed Apache Kafka event source.
     */
    SelfManagedKafkaEventSourceConfig?: SelfManagedKafkaEventSourceConfig;
    /**
     * (Amazon SQS only) The scaling configuration for the event source. For more information, see Configuring maximum concurrency for Amazon SQS event sources.
     */
    ScalingConfig?: ScalingConfig;
    /**
     * Specific configuration settings for a DocumentDB event source.
     */
    DocumentDBEventSourceConfig?: DocumentDBEventSourceConfig;
  }
  export type EventSourceMappingsList = EventSourceMappingConfiguration[];
  export type EventSourcePosition = "TRIM_HORIZON"|"LATEST"|"AT_TIMESTAMP"|string;
  export type EventSourceToken = string;
  export type FileSystemArn = string;
  export interface FileSystemConfig {
    /**
     * The Amazon Resource Name (ARN) of the Amazon EFS access point that provides access to the file system.
     */
    Arn: FileSystemArn;
    /**
     * The path where the function can access the file system, starting with /mnt/.
     */
    LocalMountPath: LocalMountPath;
  }
  export type FileSystemConfigList = FileSystemConfig[];
  export interface Filter {
    /**
     *  A filter pattern. For more information on the syntax of a filter pattern, see  Filter rule syntax. 
     */
    Pattern?: Pattern;
  }
  export interface FilterCriteria {
    /**
     *  A list of filters. 
     */
    Filters?: FilterList;
  }
  export type FilterList = Filter[];
  export type FullDocument = "UpdateLookup"|"Default"|string;
  export type FunctionArn = string;
  export type FunctionArnList = FunctionArn[];
  export interface FunctionCode {
    /**
     * The base64-encoded contents of the deployment package. Amazon Web Services SDK and CLI clients handle the encoding for you.
     */
    ZipFile?: _Blob;
    /**
     * An Amazon S3 bucket in the same Amazon Web Services Region as your function. The bucket can be in a different Amazon Web Services account.
     */
    S3Bucket?: S3Bucket;
    /**
     * The Amazon S3 key of the deployment package.
     */
    S3Key?: S3Key;
    /**
     * For versioned objects, the version of the deployment package object to use.
     */
    S3ObjectVersion?: S3ObjectVersion;
    /**
     * URI of a container image in the Amazon ECR registry.
     */
    ImageUri?: String;
  }
  export interface FunctionCodeLocation {
    /**
     * The service that's hosting the file.
     */
    RepositoryType?: String;
    /**
     * A presigned URL that you can use to download the deployment package.
     */
    Location?: String;
    /**
     * URI of a container image in the Amazon ECR registry.
     */
    ImageUri?: String;
    /**
     * The resolved URI for the image.
     */
    ResolvedImageUri?: String;
  }
  export interface FunctionConfiguration {
    /**
     * The name of the function.
     */
    FunctionName?: NamespacedFunctionName;
    /**
     * The function's Amazon Resource Name (ARN).
     */
    FunctionArn?: NameSpacedFunctionArn;
    /**
     * The identifier of the function's runtime. Runtime is required if the deployment package is a .zip file archive. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    Runtime?: Runtime;
    /**
     * The function's execution role.
     */
    Role?: RoleArn;
    /**
     * The function that Lambda calls to begin running your function.
     */
    Handler?: Handler;
    /**
     * The size of the function's deployment package, in bytes.
     */
    CodeSize?: Long;
    /**
     * The function's description.
     */
    Description?: Description;
    /**
     * The amount of time in seconds that Lambda allows a function to run before stopping it.
     */
    Timeout?: Timeout;
    /**
     * The amount of memory available to the function at runtime.
     */
    MemorySize?: MemorySize;
    /**
     * The date and time that the function was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModified?: Timestamp;
    /**
     * The SHA256 hash of the function's deployment package.
     */
    CodeSha256?: String;
    /**
     * The version of the Lambda function.
     */
    Version?: Version;
    /**
     * The function's networking configuration.
     */
    VpcConfig?: VpcConfigResponse;
    /**
     * The function's dead letter queue.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The function's environment variables. Omitted from CloudTrail logs.
     */
    Environment?: EnvironmentResponse;
    /**
     * The KMS key that's used to encrypt the function's environment variables. When Lambda SnapStart is activated, this key is also used to encrypt the function's snapshot. This key is returned only if you've configured a customer managed key.
     */
    KMSKeyArn?: KMSKeyArn;
    /**
     * The function's X-Ray tracing configuration.
     */
    TracingConfig?: TracingConfigResponse;
    /**
     * For Lambda@Edge functions, the ARN of the main function.
     */
    MasterArn?: FunctionArn;
    /**
     * The latest updated revision of the function or alias.
     */
    RevisionId?: String;
    /**
     * The function's layers.
     */
    Layers?: LayersReferenceList;
    /**
     * The current state of the function. When the state is Inactive, you can reactivate the function by invoking it.
     */
    State?: State;
    /**
     * The reason for the function's current state.
     */
    StateReason?: StateReason;
    /**
     * The reason code for the function's current state. When the code is Creating, you can't invoke or modify the function.
     */
    StateReasonCode?: StateReasonCode;
    /**
     * The status of the last update that was performed on the function. This is first set to Successful after function creation completes.
     */
    LastUpdateStatus?: LastUpdateStatus;
    /**
     * The reason for the last update that was performed on the function.
     */
    LastUpdateStatusReason?: LastUpdateStatusReason;
    /**
     * The reason code for the last update that was performed on the function.
     */
    LastUpdateStatusReasonCode?: LastUpdateStatusReasonCode;
    /**
     * Connection settings for an Amazon EFS file system.
     */
    FileSystemConfigs?: FileSystemConfigList;
    /**
     * The type of deployment package. Set to Image for container image and set Zip for .zip file archive.
     */
    PackageType?: PackageType;
    /**
     * The function's image configuration values.
     */
    ImageConfigResponse?: ImageConfigResponse;
    /**
     * The ARN of the signing profile version.
     */
    SigningProfileVersionArn?: Arn;
    /**
     * The ARN of the signing job.
     */
    SigningJobArn?: Arn;
    /**
     * The instruction set architecture that the function supports. Architecture is a string array with one of the valid values. The default architecture value is x86_64.
     */
    Architectures?: ArchitecturesList;
    /**
     * The size of the function’s /tmp directory in MB. The default value is 512, but it can be any whole number between 512 and 10,240 MB.
     */
    EphemeralStorage?: EphemeralStorage;
    /**
     * Set ApplyOn to PublishedVersions to create a snapshot of the initialized execution environment when you publish a function version. For more information, see Improving startup performance with Lambda SnapStart.
     */
    SnapStart?: SnapStartResponse;
    /**
     * The ARN of the runtime and any errors that occured.
     */
    RuntimeVersionConfig?: RuntimeVersionConfig;
  }
  export interface FunctionEventInvokeConfig {
    /**
     * The date and time that the configuration was last updated.
     */
    LastModified?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the function.
     */
    FunctionArn?: FunctionArn;
    /**
     * The maximum number of times to retry when the function returns an error.
     */
    MaximumRetryAttempts?: MaximumRetryAttempts;
    /**
     * The maximum age of a request that Lambda sends to a function for processing.
     */
    MaximumEventAgeInSeconds?: MaximumEventAgeInSeconds;
    /**
     * A destination for events after they have been sent to a function for processing.  Destinations     Function - The Amazon Resource Name (ARN) of a Lambda function.    Queue - The ARN of a standard SQS queue.    Topic - The ARN of a standard SNS topic.    Event Bus - The ARN of an Amazon EventBridge event bus.  
     */
    DestinationConfig?: DestinationConfig;
  }
  export type FunctionEventInvokeConfigList = FunctionEventInvokeConfig[];
  export type FunctionList = FunctionConfiguration[];
  export type FunctionName = string;
  export type FunctionResponseType = "ReportBatchItemFailures"|string;
  export type FunctionResponseTypeList = FunctionResponseType[];
  export type FunctionUrl = string;
  export type FunctionUrlAuthType = "NONE"|"AWS_IAM"|string;
  export interface FunctionUrlConfig {
    /**
     * The HTTP URL endpoint for your function.
     */
    FunctionUrl: FunctionUrl;
    /**
     * The Amazon Resource Name (ARN) of your function.
     */
    FunctionArn: FunctionArn;
    /**
     * When the function URL was created, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    CreationTime: Timestamp;
    /**
     * When the function URL configuration was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime: Timestamp;
    /**
     * The cross-origin resource sharing (CORS) settings for your function URL.
     */
    Cors?: Cors;
    /**
     * The type of authentication that your function URL uses. Set to AWS_IAM if you want to restrict access to authenticated users only. Set to NONE if you want to bypass IAM authentication to create a public endpoint. For more information, see Security and auth model for Lambda function URLs.
     */
    AuthType: FunctionUrlAuthType;
    /**
     * Use one of the following options:    BUFFERED – This is the default option. Lambda invokes your function using the Invoke API operation. Invocation results are available when the payload is complete. The maximum payload size is 6 MB.    RESPONSE_STREAM – Your function streams payload results as they become available. Lambda invokes your function using the InvokeWithResponseStream API operation. The maximum response payload size is 20 MB, however, you can request a quota increase.  
     */
    InvokeMode?: InvokeMode;
  }
  export type FunctionUrlConfigList = FunctionUrlConfig[];
  export type FunctionUrlQualifier = string;
  export type FunctionVersion = "ALL"|string;
  export interface GetAccountSettingsRequest {
  }
  export interface GetAccountSettingsResponse {
    /**
     * Limits that are related to concurrency and code storage.
     */
    AccountLimit?: AccountLimit;
    /**
     * The number of functions and amount of storage in use.
     */
    AccountUsage?: AccountUsage;
  }
  export interface GetAliasRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The name of the alias.
     */
    Name: Alias;
  }
  export interface GetCodeSigningConfigRequest {
    /**
     * The The Amazon Resource Name (ARN) of the code signing configuration. 
     */
    CodeSigningConfigArn: CodeSigningConfigArn;
  }
  export interface GetCodeSigningConfigResponse {
    /**
     * The code signing configuration
     */
    CodeSigningConfig: CodeSigningConfig;
  }
  export interface GetEventSourceMappingRequest {
    /**
     * The identifier of the event source mapping.
     */
    UUID: String;
  }
  export interface GetFunctionCodeSigningConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
  }
  export interface GetFunctionCodeSigningConfigResponse {
    /**
     * The The Amazon Resource Name (ARN) of the code signing configuration.
     */
    CodeSigningConfigArn: CodeSigningConfigArn;
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
  }
  export interface GetFunctionConcurrencyRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
  }
  export interface GetFunctionConcurrencyResponse {
    /**
     * The number of simultaneous executions that are reserved for the function.
     */
    ReservedConcurrentExecutions?: ReservedConcurrentExecutions;
  }
  export interface GetFunctionConfigurationRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name – my-function (name-only), my-function:v1 (with alias).    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * Specify a version or alias to get details about a published version of the function.
     */
    Qualifier?: Qualifier;
  }
  export interface GetFunctionEventInvokeConfigRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * A version number or alias name.
     */
    Qualifier?: Qualifier;
  }
  export interface GetFunctionRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name – my-function (name-only), my-function:v1 (with alias).    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * Specify a version or alias to get details about a published version of the function.
     */
    Qualifier?: Qualifier;
  }
  export interface GetFunctionResponse {
    /**
     * The configuration of the function or version.
     */
    Configuration?: FunctionConfiguration;
    /**
     * The deployment package of the function or version.
     */
    Code?: FunctionCodeLocation;
    /**
     * The function's tags.
     */
    Tags?: Tags;
    /**
     * The function's reserved concurrency.
     */
    Concurrency?: Concurrency;
  }
  export interface GetFunctionUrlConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The alias name.
     */
    Qualifier?: FunctionUrlQualifier;
  }
  export interface GetFunctionUrlConfigResponse {
    /**
     * The HTTP URL endpoint for your function.
     */
    FunctionUrl: FunctionUrl;
    /**
     * The Amazon Resource Name (ARN) of your function.
     */
    FunctionArn: FunctionArn;
    /**
     * The type of authentication that your function URL uses. Set to AWS_IAM if you want to restrict access to authenticated users only. Set to NONE if you want to bypass IAM authentication to create a public endpoint. For more information, see Security and auth model for Lambda function URLs.
     */
    AuthType: FunctionUrlAuthType;
    /**
     * The cross-origin resource sharing (CORS) settings for your function URL.
     */
    Cors?: Cors;
    /**
     * When the function URL was created, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    CreationTime: Timestamp;
    /**
     * When the function URL configuration was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime: Timestamp;
    /**
     * Use one of the following options:    BUFFERED – This is the default option. Lambda invokes your function using the Invoke API operation. Invocation results are available when the payload is complete. The maximum payload size is 6 MB.    RESPONSE_STREAM – Your function streams payload results as they become available. Lambda invokes your function using the InvokeWithResponseStream API operation. The maximum response payload size is 20 MB, however, you can request a quota increase.  
     */
    InvokeMode?: InvokeMode;
  }
  export interface GetLayerVersionByArnRequest {
    /**
     * The ARN of the layer version.
     */
    Arn: LayerVersionArn;
  }
  export interface GetLayerVersionPolicyRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     */
    LayerName: LayerName;
    /**
     * The version number.
     */
    VersionNumber: LayerVersionNumber;
  }
  export interface GetLayerVersionPolicyResponse {
    /**
     * The policy document.
     */
    Policy?: String;
    /**
     * A unique identifier for the current revision of the policy.
     */
    RevisionId?: String;
  }
  export interface GetLayerVersionRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     */
    LayerName: LayerName;
    /**
     * The version number.
     */
    VersionNumber: LayerVersionNumber;
  }
  export interface GetLayerVersionResponse {
    /**
     * Details about the layer version.
     */
    Content?: LayerVersionContentOutput;
    /**
     * The ARN of the layer.
     */
    LayerArn?: LayerArn;
    /**
     * The ARN of the layer version.
     */
    LayerVersionArn?: LayerVersionArn;
    /**
     * The description of the version.
     */
    Description?: Description;
    /**
     * The date that the layer version was created, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    CreatedDate?: Timestamp;
    /**
     * The version number.
     */
    Version?: LayerVersionNumber;
    /**
     * The layer's compatible runtimes. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    CompatibleRuntimes?: CompatibleRuntimes;
    /**
     * The layer's software license.
     */
    LicenseInfo?: LicenseInfo;
    /**
     * A list of compatible instruction set architectures.
     */
    CompatibleArchitectures?: CompatibleArchitectures;
  }
  export interface GetPolicyRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name – my-function (name-only), my-function:v1 (with alias).    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * Specify a version or alias to get the policy for that resource.
     */
    Qualifier?: Qualifier;
  }
  export interface GetPolicyResponse {
    /**
     * The resource-based policy.
     */
    Policy?: String;
    /**
     * A unique identifier for the current revision of the policy.
     */
    RevisionId?: String;
  }
  export interface GetProvisionedConcurrencyConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The version number or alias name.
     */
    Qualifier: Qualifier;
  }
  export interface GetProvisionedConcurrencyConfigResponse {
    /**
     * The amount of provisioned concurrency requested.
     */
    RequestedProvisionedConcurrentExecutions?: PositiveInteger;
    /**
     * The amount of provisioned concurrency available.
     */
    AvailableProvisionedConcurrentExecutions?: NonNegativeInteger;
    /**
     * The amount of provisioned concurrency allocated. When a weighted alias is used during linear and canary deployments, this value fluctuates depending on the amount of concurrency that is provisioned for the function versions.
     */
    AllocatedProvisionedConcurrentExecutions?: NonNegativeInteger;
    /**
     * The status of the allocation process.
     */
    Status?: ProvisionedConcurrencyStatusEnum;
    /**
     * For failed allocations, the reason that provisioned concurrency could not be allocated.
     */
    StatusReason?: String;
    /**
     * The date and time that a user last updated the configuration, in ISO 8601 format.
     */
    LastModified?: Timestamp;
  }
  export interface GetRuntimeManagementConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * Specify a version of the function. This can be $LATEST or a published version number. If no value is specified, the configuration for the $LATEST version is returned.
     */
    Qualifier?: Qualifier;
  }
  export interface GetRuntimeManagementConfigResponse {
    /**
     * The current runtime update mode of the function.
     */
    UpdateRuntimeOn?: UpdateRuntimeOn;
    /**
     * The ARN of the runtime the function is configured to use. If the runtime update mode is Manual, the ARN is returned, otherwise null is returned.
     */
    RuntimeVersionArn?: RuntimeVersionArn;
    /**
     * The Amazon Resource Name (ARN) of your function.
     */
    FunctionArn?: NameSpacedFunctionArn;
  }
  export type Handler = string;
  export type Header = string;
  export type HeadersList = Header[];
  export type HttpStatus = number;
  export interface ImageConfig {
    /**
     * Specifies the entry point to their application, which is typically the location of the runtime executable.
     */
    EntryPoint?: StringList;
    /**
     * Specifies parameters that you want to pass in with ENTRYPOINT.
     */
    Command?: StringList;
    /**
     * Specifies the working directory.
     */
    WorkingDirectory?: WorkingDirectory;
  }
  export interface ImageConfigError {
    /**
     * Error code.
     */
    ErrorCode?: String;
    /**
     * Error message.
     */
    Message?: SensitiveString;
  }
  export interface ImageConfigResponse {
    /**
     * Configuration values that override the container image Dockerfile.
     */
    ImageConfig?: ImageConfig;
    /**
     * Error response to GetFunctionConfiguration.
     */
    Error?: ImageConfigError;
  }
  export type Integer = number;
  export interface InvocationRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name – my-function (name-only), my-function:v1 (with alias).    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * Choose from the following options.    RequestResponse (default) – Invoke the function synchronously. Keep the connection open until the function returns a response or times out. The API response includes the function response and additional data.    Event – Invoke the function asynchronously. Send events that fail multiple times to the function's dead-letter queue (if one is configured). The API response only includes a status code.    DryRun – Validate parameter values and verify that the user or role has permission to invoke the function.  
     */
    InvocationType?: InvocationType;
    /**
     * Set to Tail to include the execution log in the response. Applies to synchronously invoked functions only.
     */
    LogType?: LogType;
    /**
     * Up to 3,583 bytes of base64-encoded data about the invoking client to pass to the function in the context object.
     */
    ClientContext?: String;
    /**
     * The JSON that you want to provide to your Lambda function as input. You can enter the JSON directly. For example, --payload '{ "key": "value" }'. You can also specify a file path. For example, --payload file://payload.json.
     */
    Payload?: _Blob;
    /**
     * Specify a version or alias to invoke a published version of the function.
     */
    Qualifier?: Qualifier;
  }
  export interface InvocationResponse {
    /**
     * The HTTP status code is in the 200 range for a successful request. For the RequestResponse invocation type, this status code is 200. For the Event invocation type, this status code is 202. For the DryRun invocation type, the status code is 204.
     */
    StatusCode?: Integer;
    /**
     * If present, indicates that an error occurred during function execution. Details about the error are included in the response payload.
     */
    FunctionError?: String;
    /**
     * The last 4 KB of the execution log, which is base64-encoded.
     */
    LogResult?: String;
    /**
     * The response from the function, or an error object.
     */
    Payload?: _Blob;
    /**
     * The version of the function that executed. When you invoke a function with an alias, this indicates which version the alias resolved to.
     */
    ExecutedVersion?: Version;
  }
  export type InvocationType = "Event"|"RequestResponse"|"DryRun"|string;
  export interface InvokeAsyncRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * The JSON that you want to provide to your Lambda function as input.
     */
    InvokeArgs: BlobStream;
  }
  export interface InvokeAsyncResponse {
    /**
     * The status code.
     */
    Status?: HttpStatus;
  }
  export type InvokeMode = "BUFFERED"|"RESPONSE_STREAM"|string;
  export interface InvokeResponseStreamUpdate {
    /**
     * Data returned by your Lambda function.
     */
    Payload?: Buffer;
  }
  export interface InvokeWithResponseStreamCompleteEvent {
    /**
     * An error code.
     */
    ErrorCode?: String;
    /**
     * The details of any returned error.
     */
    ErrorDetails?: String;
    /**
     * The last 4 KB of the execution log, which is base64-encoded.
     */
    LogResult?: String;
  }
  export interface InvokeWithResponseStreamRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * Use one of the following options:    RequestResponse (default) – Invoke the function synchronously. Keep the connection open until the function returns a response or times out. The API operation response includes the function response and additional data.    DryRun – Validate parameter values and verify that the IAM user or role has permission to invoke the function.  
     */
    InvocationType?: ResponseStreamingInvocationType;
    /**
     * Set to Tail to include the execution log in the response. Applies to synchronously invoked functions only.
     */
    LogType?: LogType;
    /**
     * Up to 3,583 bytes of base64-encoded data about the invoking client to pass to the function in the context object.
     */
    ClientContext?: String;
    /**
     * The alias name.
     */
    Qualifier?: Qualifier;
    /**
     * The JSON that you want to provide to your Lambda function as input. You can enter the JSON directly. For example, --payload '{ "key": "value" }'. You can also specify a file path. For example, --payload file://payload.json.
     */
    Payload?: _Blob;
  }
  export interface InvokeWithResponseStreamResponse {
    /**
     * For a successful request, the HTTP status code is in the 200 range. For the RequestResponse invocation type, this status code is 200. For the DryRun invocation type, this status code is 204.
     */
    StatusCode?: Integer;
    /**
     * The version of the function that executed. When you invoke a function with an alias, this indicates which version the alias resolved to.
     */
    ExecutedVersion?: Version;
    /**
     * The stream of response payloads.
     */
    EventStream?: InvokeWithResponseStreamResponseEvent;
    /**
     * The type of data the stream is returning.
     */
    ResponseStreamContentType?: String;
  }
  export type InvokeWithResponseStreamResponseEvent = EventStream<{PayloadChunk?:InvokeResponseStreamUpdate,InvokeComplete?:InvokeWithResponseStreamCompleteEvent}>;
  export type KMSKeyArn = string;
  export type LastUpdateStatus = "Successful"|"Failed"|"InProgress"|string;
  export type LastUpdateStatusReason = string;
  export type LastUpdateStatusReasonCode = "EniLimitExceeded"|"InsufficientRolePermissions"|"InvalidConfiguration"|"InternalError"|"SubnetOutOfIPAddresses"|"InvalidSubnet"|"InvalidSecurityGroup"|"ImageDeleted"|"ImageAccessDenied"|"InvalidImage"|"KMSKeyAccessDenied"|"KMSKeyNotFound"|"InvalidStateKMSKey"|"DisabledKMSKey"|"EFSIOError"|"EFSMountConnectivityError"|"EFSMountFailure"|"EFSMountTimeout"|"InvalidRuntime"|"InvalidZipFileException"|"FunctionError"|string;
  export interface Layer {
    /**
     * The Amazon Resource Name (ARN) of the function layer.
     */
    Arn?: LayerVersionArn;
    /**
     * The size of the layer archive in bytes.
     */
    CodeSize?: Long;
    /**
     * The Amazon Resource Name (ARN) for a signing profile version.
     */
    SigningProfileVersionArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of a signing job.
     */
    SigningJobArn?: Arn;
  }
  export type LayerArn = string;
  export type LayerList = LayerVersionArn[];
  export type LayerName = string;
  export type LayerPermissionAllowedAction = string;
  export type LayerPermissionAllowedPrincipal = string;
  export type LayerVersionArn = string;
  export interface LayerVersionContentInput {
    /**
     * The Amazon S3 bucket of the layer archive.
     */
    S3Bucket?: S3Bucket;
    /**
     * The Amazon S3 key of the layer archive.
     */
    S3Key?: S3Key;
    /**
     * For versioned objects, the version of the layer archive object to use.
     */
    S3ObjectVersion?: S3ObjectVersion;
    /**
     * The base64-encoded contents of the layer archive. Amazon Web Services SDK and Amazon Web Services CLI clients handle the encoding for you.
     */
    ZipFile?: _Blob;
  }
  export interface LayerVersionContentOutput {
    /**
     * A link to the layer archive in Amazon S3 that is valid for 10 minutes.
     */
    Location?: String;
    /**
     * The SHA-256 hash of the layer archive.
     */
    CodeSha256?: String;
    /**
     * The size of the layer archive in bytes.
     */
    CodeSize?: Long;
    /**
     * The Amazon Resource Name (ARN) for a signing profile version.
     */
    SigningProfileVersionArn?: String;
    /**
     * The Amazon Resource Name (ARN) of a signing job.
     */
    SigningJobArn?: String;
  }
  export type LayerVersionNumber = number;
  export type LayerVersionsList = LayerVersionsListItem[];
  export interface LayerVersionsListItem {
    /**
     * The ARN of the layer version.
     */
    LayerVersionArn?: LayerVersionArn;
    /**
     * The version number.
     */
    Version?: LayerVersionNumber;
    /**
     * The description of the version.
     */
    Description?: Description;
    /**
     * The date that the version was created, in ISO 8601 format. For example, 2018-11-27T15:10:45.123+0000.
     */
    CreatedDate?: Timestamp;
    /**
     * The layer's compatible runtimes. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    CompatibleRuntimes?: CompatibleRuntimes;
    /**
     * The layer's open-source license.
     */
    LicenseInfo?: LicenseInfo;
    /**
     * A list of compatible instruction set architectures.
     */
    CompatibleArchitectures?: CompatibleArchitectures;
  }
  export type LayersList = LayersListItem[];
  export interface LayersListItem {
    /**
     * The name of the layer.
     */
    LayerName?: LayerName;
    /**
     * The Amazon Resource Name (ARN) of the function layer.
     */
    LayerArn?: LayerArn;
    /**
     * The newest version of the layer.
     */
    LatestMatchingVersion?: LayerVersionsListItem;
  }
  export type LayersReferenceList = Layer[];
  export type LicenseInfo = string;
  export interface ListAliasesRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Specify a function version to only list aliases that invoke that version.
     */
    FunctionVersion?: Version;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    Marker?: String;
    /**
     * Limit the number of aliases returned.
     */
    MaxItems?: MaxListItems;
  }
  export interface ListAliasesResponse {
    /**
     * The pagination token that's included if more results are available.
     */
    NextMarker?: String;
    /**
     * A list of aliases.
     */
    Aliases?: AliasList;
  }
  export interface ListCodeSigningConfigsRequest {
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    Marker?: String;
    /**
     * Maximum number of items to return.
     */
    MaxItems?: MaxListItems;
  }
  export interface ListCodeSigningConfigsResponse {
    /**
     * The pagination token that's included if more results are available.
     */
    NextMarker?: String;
    /**
     * The code signing configurations
     */
    CodeSigningConfigs?: CodeSigningConfigList;
  }
  export interface ListEventSourceMappingsRequest {
    /**
     * The Amazon Resource Name (ARN) of the event source.    Amazon Kinesis – The ARN of the data stream or a stream consumer.    Amazon DynamoDB Streams – The ARN of the stream.    Amazon Simple Queue Service – The ARN of the queue.    Amazon Managed Streaming for Apache Kafka – The ARN of the cluster.    Amazon MQ – The ARN of the broker.    Amazon DocumentDB – The ARN of the DocumentDB change stream.  
     */
    EventSourceArn?: Arn;
    /**
     * The name of the Lambda function.  Name formats     Function name – MyFunction.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Version or Alias ARN – arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD.    Partial ARN – 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
     */
    FunctionName?: FunctionName;
    /**
     * A pagination token returned by a previous call.
     */
    Marker?: String;
    /**
     * The maximum number of event source mappings to return. Note that ListEventSourceMappings returns a maximum of 100 items in each response, even if you set the number higher.
     */
    MaxItems?: MaxListItems;
  }
  export interface ListEventSourceMappingsResponse {
    /**
     * A pagination token that's returned when the response doesn't contain all event source mappings.
     */
    NextMarker?: String;
    /**
     * A list of event source mappings.
     */
    EventSourceMappings?: EventSourceMappingsList;
  }
  export interface ListFunctionEventInvokeConfigsRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    Marker?: String;
    /**
     * The maximum number of configurations to return.
     */
    MaxItems?: MaxFunctionEventInvokeConfigListItems;
  }
  export interface ListFunctionEventInvokeConfigsResponse {
    /**
     * A list of configurations.
     */
    FunctionEventInvokeConfigs?: FunctionEventInvokeConfigList;
    /**
     * The pagination token that's included if more results are available.
     */
    NextMarker?: String;
  }
  export interface ListFunctionUrlConfigsRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    Marker?: String;
    /**
     * The maximum number of function URLs to return in the response. Note that ListFunctionUrlConfigs returns a maximum of 50 items in each response, even if you set the number higher.
     */
    MaxItems?: MaxItems;
  }
  export interface ListFunctionUrlConfigsResponse {
    /**
     * A list of function URL configurations.
     */
    FunctionUrlConfigs: FunctionUrlConfigList;
    /**
     * The pagination token that's included if more results are available.
     */
    NextMarker?: String;
  }
  export interface ListFunctionsByCodeSigningConfigRequest {
    /**
     * The The Amazon Resource Name (ARN) of the code signing configuration.
     */
    CodeSigningConfigArn: CodeSigningConfigArn;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    Marker?: String;
    /**
     * Maximum number of items to return.
     */
    MaxItems?: MaxListItems;
  }
  export interface ListFunctionsByCodeSigningConfigResponse {
    /**
     * The pagination token that's included if more results are available.
     */
    NextMarker?: String;
    /**
     * The function ARNs. 
     */
    FunctionArns?: FunctionArnList;
  }
  export interface ListFunctionsRequest {
    /**
     * For Lambda@Edge functions, the Amazon Web Services Region of the master function. For example, us-east-1 filters the list of functions to include only Lambda@Edge functions replicated from a master function in US East (N. Virginia). If specified, you must set FunctionVersion to ALL.
     */
    MasterRegion?: MasterRegion;
    /**
     * Set to ALL to include entries for all published versions of each function.
     */
    FunctionVersion?: FunctionVersion;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    Marker?: String;
    /**
     * The maximum number of functions to return in the response. Note that ListFunctions returns a maximum of 50 items in each response, even if you set the number higher.
     */
    MaxItems?: MaxListItems;
  }
  export interface ListFunctionsResponse {
    /**
     * The pagination token that's included if more results are available.
     */
    NextMarker?: String;
    /**
     * A list of Lambda functions.
     */
    Functions?: FunctionList;
  }
  export interface ListLayerVersionsRequest {
    /**
     * A runtime identifier. For example, go1.x. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    CompatibleRuntime?: Runtime;
    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     */
    LayerName: LayerName;
    /**
     * A pagination token returned by a previous call.
     */
    Marker?: String;
    /**
     * The maximum number of versions to return.
     */
    MaxItems?: MaxLayerListItems;
    /**
     * The compatible instruction set architecture.
     */
    CompatibleArchitecture?: Architecture;
  }
  export interface ListLayerVersionsResponse {
    /**
     * A pagination token returned when the response doesn't contain all versions.
     */
    NextMarker?: String;
    /**
     * A list of versions.
     */
    LayerVersions?: LayerVersionsList;
  }
  export interface ListLayersRequest {
    /**
     * A runtime identifier. For example, go1.x. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    CompatibleRuntime?: Runtime;
    /**
     * A pagination token returned by a previous call.
     */
    Marker?: String;
    /**
     * The maximum number of layers to return.
     */
    MaxItems?: MaxLayerListItems;
    /**
     * The compatible instruction set architecture.
     */
    CompatibleArchitecture?: Architecture;
  }
  export interface ListLayersResponse {
    /**
     * A pagination token returned when the response doesn't contain all layers.
     */
    NextMarker?: String;
    /**
     * A list of function layers.
     */
    Layers?: LayersList;
  }
  export interface ListProvisionedConcurrencyConfigsRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    Marker?: String;
    /**
     * Specify a number to limit the number of configurations returned.
     */
    MaxItems?: MaxProvisionedConcurrencyConfigListItems;
  }
  export interface ListProvisionedConcurrencyConfigsResponse {
    /**
     * A list of provisioned concurrency configurations.
     */
    ProvisionedConcurrencyConfigs?: ProvisionedConcurrencyConfigList;
    /**
     * The pagination token that's included if more results are available.
     */
    NextMarker?: String;
  }
  export interface ListTagsRequest {
    /**
     * The function's Amazon Resource Name (ARN). Note: Lambda does not support adding tags to aliases or versions.
     */
    Resource: FunctionArn;
  }
  export interface ListTagsResponse {
    /**
     * The function's tags.
     */
    Tags?: Tags;
  }
  export interface ListVersionsByFunctionRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    Marker?: String;
    /**
     * The maximum number of versions to return. Note that ListVersionsByFunction returns a maximum of 50 items in each response, even if you set the number higher.
     */
    MaxItems?: MaxListItems;
  }
  export interface ListVersionsByFunctionResponse {
    /**
     * The pagination token that's included if more results are available.
     */
    NextMarker?: String;
    /**
     * A list of Lambda function versions.
     */
    Versions?: FunctionList;
  }
  export type LocalMountPath = string;
  export type LogType = "None"|"Tail"|string;
  export type Long = number;
  export type MasterRegion = string;
  export type MaxAge = number;
  export type MaxFunctionEventInvokeConfigListItems = number;
  export type MaxItems = number;
  export type MaxLayerListItems = number;
  export type MaxListItems = number;
  export type MaxProvisionedConcurrencyConfigListItems = number;
  export type MaximumBatchingWindowInSeconds = number;
  export type MaximumConcurrency = number;
  export type MaximumEventAgeInSeconds = number;
  export type MaximumRecordAgeInSeconds = number;
  export type MaximumRetryAttempts = number;
  export type MaximumRetryAttemptsEventSourceMapping = number;
  export type MemorySize = number;
  export type Method = string;
  export type NameSpacedFunctionArn = string;
  export type NamespacedFunctionName = string;
  export type NamespacedStatementId = string;
  export type NonNegativeInteger = number;
  export type NullableBoolean = boolean;
  export interface OnFailure {
    /**
     * The Amazon Resource Name (ARN) of the destination resource.
     */
    Destination?: DestinationArn;
  }
  export interface OnSuccess {
    /**
     * The Amazon Resource Name (ARN) of the destination resource.
     */
    Destination?: DestinationArn;
  }
  export type OrganizationId = string;
  export type Origin = string;
  export type PackageType = "Zip"|"Image"|string;
  export type ParallelizationFactor = number;
  export type Pattern = string;
  export type PositiveInteger = number;
  export type Principal = string;
  export type PrincipalOrgID = string;
  export type ProvisionedConcurrencyConfigList = ProvisionedConcurrencyConfigListItem[];
  export interface ProvisionedConcurrencyConfigListItem {
    /**
     * The Amazon Resource Name (ARN) of the alias or version.
     */
    FunctionArn?: FunctionArn;
    /**
     * The amount of provisioned concurrency requested.
     */
    RequestedProvisionedConcurrentExecutions?: PositiveInteger;
    /**
     * The amount of provisioned concurrency available.
     */
    AvailableProvisionedConcurrentExecutions?: NonNegativeInteger;
    /**
     * The amount of provisioned concurrency allocated. When a weighted alias is used during linear and canary deployments, this value fluctuates depending on the amount of concurrency that is provisioned for the function versions.
     */
    AllocatedProvisionedConcurrentExecutions?: NonNegativeInteger;
    /**
     * The status of the allocation process.
     */
    Status?: ProvisionedConcurrencyStatusEnum;
    /**
     * For failed allocations, the reason that provisioned concurrency could not be allocated.
     */
    StatusReason?: String;
    /**
     * The date and time that a user last updated the configuration, in ISO 8601 format.
     */
    LastModified?: Timestamp;
  }
  export type ProvisionedConcurrencyStatusEnum = "IN_PROGRESS"|"READY"|"FAILED"|string;
  export interface PublishLayerVersionRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     */
    LayerName: LayerName;
    /**
     * The description of the version.
     */
    Description?: Description;
    /**
     * The function layer archive.
     */
    Content: LayerVersionContentInput;
    /**
     * A list of compatible function runtimes. Used for filtering with ListLayers and ListLayerVersions. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    CompatibleRuntimes?: CompatibleRuntimes;
    /**
     * The layer's software license. It can be any of the following:   An SPDX license identifier. For example, MIT.   The URL of a license hosted on the internet. For example, https://opensource.org/licenses/MIT.   The full text of the license.  
     */
    LicenseInfo?: LicenseInfo;
    /**
     * A list of compatible instruction set architectures.
     */
    CompatibleArchitectures?: CompatibleArchitectures;
  }
  export interface PublishLayerVersionResponse {
    /**
     * Details about the layer version.
     */
    Content?: LayerVersionContentOutput;
    /**
     * The ARN of the layer.
     */
    LayerArn?: LayerArn;
    /**
     * The ARN of the layer version.
     */
    LayerVersionArn?: LayerVersionArn;
    /**
     * The description of the version.
     */
    Description?: Description;
    /**
     * The date that the layer version was created, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    CreatedDate?: Timestamp;
    /**
     * The version number.
     */
    Version?: LayerVersionNumber;
    /**
     * The layer's compatible runtimes. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    CompatibleRuntimes?: CompatibleRuntimes;
    /**
     * The layer's software license.
     */
    LicenseInfo?: LicenseInfo;
    /**
     * A list of compatible instruction set architectures.
     */
    CompatibleArchitectures?: CompatibleArchitectures;
  }
  export interface PublishVersionRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Only publish a version if the hash value matches the value that's specified. Use this option to avoid publishing a version if the function code has changed since you last updated it. You can get the hash for the version that you uploaded from the output of UpdateFunctionCode.
     */
    CodeSha256?: String;
    /**
     * A description for the version to override the description in the function configuration.
     */
    Description?: Description;
    /**
     * Only update the function if the revision ID matches the ID that's specified. Use this option to avoid publishing a version if the function configuration has changed since you last updated it.
     */
    RevisionId?: String;
  }
  export interface PutFunctionCodeSigningConfigRequest {
    /**
     * The The Amazon Resource Name (ARN) of the code signing configuration.
     */
    CodeSigningConfigArn: CodeSigningConfigArn;
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
  }
  export interface PutFunctionCodeSigningConfigResponse {
    /**
     * The The Amazon Resource Name (ARN) of the code signing configuration.
     */
    CodeSigningConfigArn: CodeSigningConfigArn;
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
  }
  export interface PutFunctionConcurrencyRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The number of simultaneous executions to reserve for the function.
     */
    ReservedConcurrentExecutions: ReservedConcurrentExecutions;
  }
  export interface PutFunctionEventInvokeConfigRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * A version number or alias name.
     */
    Qualifier?: Qualifier;
    /**
     * The maximum number of times to retry when the function returns an error.
     */
    MaximumRetryAttempts?: MaximumRetryAttempts;
    /**
     * The maximum age of a request that Lambda sends to a function for processing.
     */
    MaximumEventAgeInSeconds?: MaximumEventAgeInSeconds;
    /**
     * A destination for events after they have been sent to a function for processing.  Destinations     Function - The Amazon Resource Name (ARN) of a Lambda function.    Queue - The ARN of a standard SQS queue.    Topic - The ARN of a standard SNS topic.    Event Bus - The ARN of an Amazon EventBridge event bus.  
     */
    DestinationConfig?: DestinationConfig;
  }
  export interface PutProvisionedConcurrencyConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The version number or alias name.
     */
    Qualifier: Qualifier;
    /**
     * The amount of provisioned concurrency to allocate for the version or alias.
     */
    ProvisionedConcurrentExecutions: PositiveInteger;
  }
  export interface PutProvisionedConcurrencyConfigResponse {
    /**
     * The amount of provisioned concurrency requested.
     */
    RequestedProvisionedConcurrentExecutions?: PositiveInteger;
    /**
     * The amount of provisioned concurrency available.
     */
    AvailableProvisionedConcurrentExecutions?: NonNegativeInteger;
    /**
     * The amount of provisioned concurrency allocated. When a weighted alias is used during linear and canary deployments, this value fluctuates depending on the amount of concurrency that is provisioned for the function versions.
     */
    AllocatedProvisionedConcurrentExecutions?: NonNegativeInteger;
    /**
     * The status of the allocation process.
     */
    Status?: ProvisionedConcurrencyStatusEnum;
    /**
     * For failed allocations, the reason that provisioned concurrency could not be allocated.
     */
    StatusReason?: String;
    /**
     * The date and time that a user last updated the configuration, in ISO 8601 format.
     */
    LastModified?: Timestamp;
  }
  export interface PutRuntimeManagementConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Specify a version of the function. This can be $LATEST or a published version number. If no value is specified, the configuration for the $LATEST version is returned.
     */
    Qualifier?: Qualifier;
    /**
     * Specify the runtime update mode.    Auto (default) - Automatically update to the most recent and secure runtime version using a Two-phase runtime version rollout. This is the best choice for most customers to ensure they always benefit from runtime updates.    Function update - Lambda updates the runtime of your function to the most recent and secure runtime version when you update your function. This approach synchronizes runtime updates with function deployments, giving you control over when runtime updates are applied and allowing you to detect and mitigate rare runtime update incompatibilities early. When using this setting, you need to regularly update your functions to keep their runtime up-to-date.    Manual - You specify a runtime version in your function configuration. The function will use this runtime version indefinitely. In the rare case where a new runtime version is incompatible with an existing function, this allows you to roll back your function to an earlier runtime version. For more information, see Roll back a runtime version.  
     */
    UpdateRuntimeOn: UpdateRuntimeOn;
    /**
     * The ARN of the runtime version you want the function to use.  This is only required if you're using the Manual runtime update mode. 
     */
    RuntimeVersionArn?: RuntimeVersionArn;
  }
  export interface PutRuntimeManagementConfigResponse {
    /**
     * The runtime update mode.
     */
    UpdateRuntimeOn: UpdateRuntimeOn;
    /**
     * The ARN of the function
     */
    FunctionArn: FunctionArn;
    /**
     * The ARN of the runtime the function is configured to use. If the runtime update mode is manual, the ARN is returned, otherwise null is returned.
     */
    RuntimeVersionArn?: RuntimeVersionArn;
  }
  export type Qualifier = string;
  export type Queue = string;
  export type Queues = Queue[];
  export interface RemoveLayerVersionPermissionRequest {
    /**
     * The name or Amazon Resource Name (ARN) of the layer.
     */
    LayerName: LayerName;
    /**
     * The version number.
     */
    VersionNumber: LayerVersionNumber;
    /**
     * The identifier that was specified when the statement was added.
     */
    StatementId: StatementId;
    /**
     * Only update the policy if the revision ID matches the ID specified. Use this option to avoid modifying a policy that has changed since you last read it.
     */
    RevisionId?: String;
  }
  export interface RemovePermissionRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name – my-function (name-only), my-function:v1 (with alias).    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Statement ID of the permission to remove.
     */
    StatementId: NamespacedStatementId;
    /**
     * Specify a version or alias to remove permissions from a published version of the function.
     */
    Qualifier?: Qualifier;
    /**
     * Update the policy only if the revision ID matches the ID that's specified. Use this option to avoid modifying a policy that has changed since you last read it.
     */
    RevisionId?: String;
  }
  export type ReservedConcurrentExecutions = number;
  export type ResourceArn = string;
  export type ResponseStreamingInvocationType = "RequestResponse"|"DryRun"|string;
  export type RoleArn = string;
  export type Runtime = "nodejs"|"nodejs4.3"|"nodejs6.10"|"nodejs8.10"|"nodejs10.x"|"nodejs12.x"|"nodejs14.x"|"nodejs16.x"|"java8"|"java8.al2"|"java11"|"python2.7"|"python3.6"|"python3.7"|"python3.8"|"python3.9"|"dotnetcore1.0"|"dotnetcore2.0"|"dotnetcore2.1"|"dotnetcore3.1"|"dotnet6"|"nodejs4.3-edge"|"go1.x"|"ruby2.5"|"ruby2.7"|"provided"|"provided.al2"|"nodejs18.x"|"python3.10"|"java17"|"ruby3.2"|"python3.11"|string;
  export type RuntimeVersionArn = string;
  export interface RuntimeVersionConfig {
    /**
     * The ARN of the runtime version you want the function to use.
     */
    RuntimeVersionArn?: RuntimeVersionArn;
    /**
     * Error response when Lambda is unable to retrieve the runtime version for a function.
     */
    Error?: RuntimeVersionError;
  }
  export interface RuntimeVersionError {
    /**
     * The error code.
     */
    ErrorCode?: String;
    /**
     * The error message.
     */
    Message?: SensitiveString;
  }
  export type S3Bucket = string;
  export type S3Key = string;
  export type S3ObjectVersion = string;
  export interface ScalingConfig {
    /**
     * Limits the number of concurrent instances that the Amazon SQS event source can invoke.
     */
    MaximumConcurrency?: MaximumConcurrency;
  }
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export interface SelfManagedEventSource {
    /**
     * The list of bootstrap servers for your Kafka brokers in the following format: "KAFKA_BOOTSTRAP_SERVERS": ["abc.xyz.com:xxxx","abc2.xyz.com:xxxx"].
     */
    Endpoints?: Endpoints;
  }
  export interface SelfManagedKafkaEventSourceConfig {
    /**
     * The identifier for the Kafka consumer group to join. The consumer group ID must be unique among all your Kafka event sources. After creating a Kafka event source mapping with the consumer group ID specified, you cannot update this value. For more information, see Customizable consumer group ID.
     */
    ConsumerGroupId?: URI;
  }
  export type SensitiveString = string;
  export type SigningProfileVersionArns = Arn[];
  export interface SnapStart {
    /**
     * Set to PublishedVersions to create a snapshot of the initialized execution environment when you publish a function version.
     */
    ApplyOn?: SnapStartApplyOn;
  }
  export type SnapStartApplyOn = "PublishedVersions"|"None"|string;
  export type SnapStartOptimizationStatus = "On"|"Off"|string;
  export interface SnapStartResponse {
    /**
     * When set to PublishedVersions, Lambda creates a snapshot of the execution environment when you publish a function version.
     */
    ApplyOn?: SnapStartApplyOn;
    /**
     * When you provide a qualified Amazon Resource Name (ARN), this response element indicates whether SnapStart is activated for the specified function version.
     */
    OptimizationStatus?: SnapStartOptimizationStatus;
  }
  export interface SourceAccessConfiguration {
    /**
     * The type of authentication protocol, VPC components, or virtual host for your event source. For example: "Type":"SASL_SCRAM_512_AUTH".    BASIC_AUTH – (Amazon MQ) The Secrets Manager secret that stores your broker credentials.    BASIC_AUTH – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL/PLAIN authentication of your Apache Kafka brokers.    VPC_SUBNET – (Self-managed Apache Kafka) The subnets associated with your VPC. Lambda connects to these subnets to fetch data from your self-managed Apache Kafka cluster.    VPC_SECURITY_GROUP – (Self-managed Apache Kafka) The VPC security group used to manage access to your self-managed Apache Kafka brokers.    SASL_SCRAM_256_AUTH – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL SCRAM-256 authentication of your self-managed Apache Kafka brokers.    SASL_SCRAM_512_AUTH – (Amazon MSK, Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL SCRAM-512 authentication of your self-managed Apache Kafka brokers.    VIRTUAL_HOST –- (RabbitMQ) The name of the virtual host in your RabbitMQ broker. Lambda uses this RabbitMQ host as the event source. This property cannot be specified in an UpdateEventSourceMapping API call.    CLIENT_CERTIFICATE_TLS_AUTH – (Amazon MSK, self-managed Apache Kafka) The Secrets Manager ARN of your secret key containing the certificate chain (X.509 PEM), private key (PKCS#8 PEM), and private key password (optional) used for mutual TLS authentication of your MSK/Apache Kafka brokers.    SERVER_ROOT_CA_CERTIFICATE – (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key containing the root CA certificate (X.509 PEM) used for TLS encryption of your Apache Kafka brokers.   
     */
    Type?: SourceAccessType;
    /**
     * The value for your chosen configuration in Type. For example: "URI": "arn:aws:secretsmanager:us-east-1:01234567890:secret:MyBrokerSecretName".
     */
    URI?: URI;
  }
  export type SourceAccessConfigurations = SourceAccessConfiguration[];
  export type SourceAccessType = "BASIC_AUTH"|"VPC_SUBNET"|"VPC_SECURITY_GROUP"|"SASL_SCRAM_512_AUTH"|"SASL_SCRAM_256_AUTH"|"VIRTUAL_HOST"|"CLIENT_CERTIFICATE_TLS_AUTH"|"SERVER_ROOT_CA_CERTIFICATE"|string;
  export type SourceOwner = string;
  export type State = "Pending"|"Active"|"Inactive"|"Failed"|string;
  export type StateReason = string;
  export type StateReasonCode = "Idle"|"Creating"|"Restoring"|"EniLimitExceeded"|"InsufficientRolePermissions"|"InvalidConfiguration"|"InternalError"|"SubnetOutOfIPAddresses"|"InvalidSubnet"|"InvalidSecurityGroup"|"ImageDeleted"|"ImageAccessDenied"|"InvalidImage"|"KMSKeyAccessDenied"|"KMSKeyNotFound"|"InvalidStateKMSKey"|"DisabledKMSKey"|"EFSIOError"|"EFSMountConnectivityError"|"EFSMountFailure"|"EFSMountTimeout"|"InvalidRuntime"|"InvalidZipFileException"|"FunctionError"|string;
  export type StatementId = string;
  export type String = string;
  export type StringList = String[];
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The function's Amazon Resource Name (ARN).
     */
    Resource: FunctionArn;
    /**
     * A list of tags to apply to the function.
     */
    Tags: Tags;
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export type Timeout = number;
  export type Timestamp = string;
  export type Topic = string;
  export type Topics = Topic[];
  export interface TracingConfig {
    /**
     * The tracing mode.
     */
    Mode?: TracingMode;
  }
  export interface TracingConfigResponse {
    /**
     * The tracing mode.
     */
    Mode?: TracingMode;
  }
  export type TracingMode = "Active"|"PassThrough"|string;
  export type TumblingWindowInSeconds = number;
  export type URI = string;
  export type UnreservedConcurrentExecutions = number;
  export interface UntagResourceRequest {
    /**
     * The function's Amazon Resource Name (ARN).
     */
    Resource: FunctionArn;
    /**
     * A list of tag keys to remove from the function.
     */
    TagKeys: TagKeyList;
  }
  export interface UpdateAliasRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The name of the alias.
     */
    Name: Alias;
    /**
     * The function version that the alias invokes.
     */
    FunctionVersion?: Version;
    /**
     * A description of the alias.
     */
    Description?: Description;
    /**
     * The routing configuration of the alias.
     */
    RoutingConfig?: AliasRoutingConfiguration;
    /**
     * Only update the alias if the revision ID matches the ID that's specified. Use this option to avoid modifying an alias that has changed since you last read it.
     */
    RevisionId?: String;
  }
  export interface UpdateCodeSigningConfigRequest {
    /**
     * The The Amazon Resource Name (ARN) of the code signing configuration.
     */
    CodeSigningConfigArn: CodeSigningConfigArn;
    /**
     * Descriptive name for this code signing configuration.
     */
    Description?: Description;
    /**
     * Signing profiles for this code signing configuration.
     */
    AllowedPublishers?: AllowedPublishers;
    /**
     * The code signing policy.
     */
    CodeSigningPolicies?: CodeSigningPolicies;
  }
  export interface UpdateCodeSigningConfigResponse {
    /**
     * The code signing configuration
     */
    CodeSigningConfig: CodeSigningConfig;
  }
  export interface UpdateEventSourceMappingRequest {
    /**
     * The identifier of the event source mapping.
     */
    UUID: String;
    /**
     * The name of the Lambda function.  Name formats     Function name – MyFunction.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Version or Alias ARN – arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD.    Partial ARN – 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
     */
    FunctionName?: FunctionName;
    /**
     * When true, the event source mapping is active. When false, Lambda pauses polling and invocation. Default: True
     */
    Enabled?: Enabled;
    /**
     * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function. Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB).    Amazon Kinesis – Default 100. Max 10,000.    Amazon DynamoDB Streams – Default 100. Max 10,000.    Amazon Simple Queue Service – Default 10. For standard queues the max is 10,000. For FIFO queues the max is 10.    Amazon Managed Streaming for Apache Kafka – Default 100. Max 10,000.    Self-managed Apache Kafka – Default 100. Max 10,000.    Amazon MQ (ActiveMQ and RabbitMQ) – Default 100. Max 10,000.    DocumentDB – Default 100. Max 10,000.  
     */
    BatchSize?: BatchSize;
    /**
     * An object that defines the filter criteria that determine whether Lambda should process an event. For more information, see Lambda event filtering.
     */
    FilterCriteria?: FilterCriteria;
    /**
     * The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function. You can configure MaximumBatchingWindowInSeconds to any value from 0 seconds to 300 seconds in increments of seconds. For streams and Amazon SQS event sources, the default batching window is 0 seconds. For Amazon MSK, Self-managed Apache Kafka, Amazon MQ, and DocumentDB event sources, the default batching window is 500 ms. Note that because you can only change MaximumBatchingWindowInSeconds in increments of seconds, you cannot revert back to the 500 ms default batching window after you have changed it. To restore the default batching window, you must create a new event source mapping. Related setting: For streams and Amazon SQS event sources, when you set BatchSize to a value greater than 10, you must set MaximumBatchingWindowInSeconds to at least 1.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Kinesis and DynamoDB Streams only) A standard Amazon SQS queue or standard Amazon SNS topic destination for discarded records.
     */
    DestinationConfig?: DestinationConfig;
    /**
     * (Kinesis and DynamoDB Streams only) Discard records older than the specified age. The default value is infinite (-1).
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry.
     */
    BisectBatchOnFunctionError?: BisectBatchOnFunctionError;
    /**
     * (Kinesis and DynamoDB Streams only) Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsEventSourceMapping;
    /**
     * (Kinesis and DynamoDB Streams only) The number of batches to process from each shard concurrently.
     */
    ParallelizationFactor?: ParallelizationFactor;
    /**
     * An array of authentication protocols or VPC components required to secure your event source.
     */
    SourceAccessConfigurations?: SourceAccessConfigurations;
    /**
     * (Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources. A value of 0 seconds indicates no tumbling window.
     */
    TumblingWindowInSeconds?: TumblingWindowInSeconds;
    /**
     * (Kinesis, DynamoDB Streams, and Amazon SQS) A list of current response type enums applied to the event source mapping.
     */
    FunctionResponseTypes?: FunctionResponseTypeList;
    /**
     * (Amazon SQS only) The scaling configuration for the event source. For more information, see Configuring maximum concurrency for Amazon SQS event sources.
     */
    ScalingConfig?: ScalingConfig;
    /**
     * Specific configuration settings for a DocumentDB event source.
     */
    DocumentDBEventSourceConfig?: DocumentDBEventSourceConfig;
  }
  export interface UpdateFunctionCodeRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The base64-encoded contents of the deployment package. Amazon Web Services SDK and CLI clients handle the encoding for you. Use only with a function defined with a .zip file archive deployment package.
     */
    ZipFile?: _Blob;
    /**
     * An Amazon S3 bucket in the same Amazon Web Services Region as your function. The bucket can be in a different Amazon Web Services account. Use only with a function defined with a .zip file archive deployment package.
     */
    S3Bucket?: S3Bucket;
    /**
     * The Amazon S3 key of the deployment package. Use only with a function defined with a .zip file archive deployment package.
     */
    S3Key?: S3Key;
    /**
     * For versioned objects, the version of the deployment package object to use.
     */
    S3ObjectVersion?: S3ObjectVersion;
    /**
     * URI of a container image in the Amazon ECR registry. Do not use for a function defined with a .zip file archive.
     */
    ImageUri?: String;
    /**
     * Set to true to publish a new version of the function after updating the code. This has the same effect as calling PublishVersion separately.
     */
    Publish?: Boolean;
    /**
     * Set to true to validate the request parameters and access permissions without modifying the function code.
     */
    DryRun?: Boolean;
    /**
     * Update the function only if the revision ID matches the ID that's specified. Use this option to avoid modifying a function that has changed since you last read it.
     */
    RevisionId?: String;
    /**
     * The instruction set architecture that the function supports. Enter a string array with one of the valid values (arm64 or x86_64). The default value is x86_64.
     */
    Architectures?: ArchitecturesList;
  }
  export interface UpdateFunctionConfigurationRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The Amazon Resource Name (ARN) of the function's execution role.
     */
    Role?: RoleArn;
    /**
     * The name of the method within your code that Lambda calls to run your function. Handler is required if the deployment package is a .zip file archive. The format includes the file name. It can also include namespaces and other qualifiers, depending on the runtime. For more information, see Lambda programming model.
     */
    Handler?: Handler;
    /**
     * A description of the function.
     */
    Description?: Description;
    /**
     * The amount of time (in seconds) that Lambda allows a function to run before stopping it. The default is 3 seconds. The maximum allowed value is 900 seconds. For more information, see Lambda execution environment.
     */
    Timeout?: Timeout;
    /**
     * The amount of memory available to the function at runtime. Increasing the function memory also increases its CPU allocation. The default value is 128 MB. The value can be any multiple of 1 MB.
     */
    MemorySize?: MemorySize;
    /**
     * For network connectivity to Amazon Web Services resources in a VPC, specify a list of security groups and subnets in the VPC. When you connect a function to a VPC, it can access resources and the internet only through that VPC. For more information, see Configuring a Lambda function to access resources in a VPC.
     */
    VpcConfig?: VpcConfig;
    /**
     * Environment variables that are accessible from function code during execution.
     */
    Environment?: Environment;
    /**
     * The identifier of the function's runtime. Runtime is required if the deployment package is a .zip file archive. The following list includes deprecated runtimes. For more information, see Runtime deprecation policy.
     */
    Runtime?: Runtime;
    /**
     * A dead-letter queue configuration that specifies the queue or topic where Lambda sends asynchronous events when they fail processing. For more information, see Dead-letter queues.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The ARN of the Key Management Service (KMS) customer managed key that's used to encrypt your function's environment variables. When Lambda SnapStart is activated, Lambda also uses this key is to encrypt your function's snapshot. If you deploy your function using a container image, Lambda also uses this key to encrypt your function when it's deployed. Note that this is not the same key that's used to protect your container image in the Amazon Elastic Container Registry (Amazon ECR). If you don't provide a customer managed key, Lambda uses a default service key.
     */
    KMSKeyArn?: KMSKeyArn;
    /**
     * Set Mode to Active to sample and trace a subset of incoming requests with X-Ray.
     */
    TracingConfig?: TracingConfig;
    /**
     * Update the function only if the revision ID matches the ID that's specified. Use this option to avoid modifying a function that has changed since you last read it.
     */
    RevisionId?: String;
    /**
     * A list of function layers to add to the function's execution environment. Specify each layer by its ARN, including the version.
     */
    Layers?: LayerList;
    /**
     * Connection settings for an Amazon EFS file system.
     */
    FileSystemConfigs?: FileSystemConfigList;
    /**
     *  Container image configuration values that override the values in the container image Docker file.
     */
    ImageConfig?: ImageConfig;
    /**
     * The size of the function's /tmp directory in MB. The default value is 512, but can be any whole number between 512 and 10,240 MB.
     */
    EphemeralStorage?: EphemeralStorage;
    /**
     * The function's SnapStart setting.
     */
    SnapStart?: SnapStart;
  }
  export interface UpdateFunctionEventInvokeConfigRequest {
    /**
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * A version number or alias name.
     */
    Qualifier?: Qualifier;
    /**
     * The maximum number of times to retry when the function returns an error.
     */
    MaximumRetryAttempts?: MaximumRetryAttempts;
    /**
     * The maximum age of a request that Lambda sends to a function for processing.
     */
    MaximumEventAgeInSeconds?: MaximumEventAgeInSeconds;
    /**
     * A destination for events after they have been sent to a function for processing.  Destinations     Function - The Amazon Resource Name (ARN) of a Lambda function.    Queue - The ARN of a standard SQS queue.    Topic - The ARN of a standard SNS topic.    Event Bus - The ARN of an Amazon EventBridge event bus.  
     */
    DestinationConfig?: DestinationConfig;
  }
  export interface UpdateFunctionUrlConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name – my-function.    Function ARN – arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN – 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The alias name.
     */
    Qualifier?: FunctionUrlQualifier;
    /**
     * The type of authentication that your function URL uses. Set to AWS_IAM if you want to restrict access to authenticated users only. Set to NONE if you want to bypass IAM authentication to create a public endpoint. For more information, see Security and auth model for Lambda function URLs.
     */
    AuthType?: FunctionUrlAuthType;
    /**
     * The cross-origin resource sharing (CORS) settings for your function URL.
     */
    Cors?: Cors;
    /**
     * Use one of the following options:    BUFFERED – This is the default option. Lambda invokes your function using the Invoke API operation. Invocation results are available when the payload is complete. The maximum payload size is 6 MB.    RESPONSE_STREAM – Your function streams payload results as they become available. Lambda invokes your function using the InvokeWithResponseStream API operation. The maximum response payload size is 20 MB, however, you can request a quota increase.  
     */
    InvokeMode?: InvokeMode;
  }
  export interface UpdateFunctionUrlConfigResponse {
    /**
     * The HTTP URL endpoint for your function.
     */
    FunctionUrl: FunctionUrl;
    /**
     * The Amazon Resource Name (ARN) of your function.
     */
    FunctionArn: FunctionArn;
    /**
     * The type of authentication that your function URL uses. Set to AWS_IAM if you want to restrict access to authenticated users only. Set to NONE if you want to bypass IAM authentication to create a public endpoint. For more information, see Security and auth model for Lambda function URLs.
     */
    AuthType: FunctionUrlAuthType;
    /**
     * The cross-origin resource sharing (CORS) settings for your function URL.
     */
    Cors?: Cors;
    /**
     * When the function URL was created, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    CreationTime: Timestamp;
    /**
     * When the function URL configuration was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.sTZD).
     */
    LastModifiedTime: Timestamp;
    /**
     * Use one of the following options:    BUFFERED – This is the default option. Lambda invokes your function using the Invoke API operation. Invocation results are available when the payload is complete. The maximum payload size is 6 MB.    RESPONSE_STREAM – Your function streams payload results as they become available. Lambda invokes your function using the InvokeWithResponseStream API operation. The maximum response payload size is 20 MB, however, you can request a quota increase.  
     */
    InvokeMode?: InvokeMode;
  }
  export type UpdateRuntimeOn = "Auto"|"Manual"|"FunctionUpdate"|string;
  export type Version = string;
  export interface VpcConfig {
    /**
     * A list of VPC subnet IDs.
     */
    SubnetIds?: SubnetIds;
    /**
     * A list of VPC security group IDs.
     */
    SecurityGroupIds?: SecurityGroupIds;
    /**
     * Allows outbound IPv6 traffic on VPC functions that are connected to dual-stack subnets.
     */
    Ipv6AllowedForDualStack?: NullableBoolean;
  }
  export interface VpcConfigResponse {
    /**
     * A list of VPC subnet IDs.
     */
    SubnetIds?: SubnetIds;
    /**
     * A list of VPC security group IDs.
     */
    SecurityGroupIds?: SecurityGroupIds;
    /**
     * The ID of the VPC.
     */
    VpcId?: VpcId;
    /**
     * Allows outbound IPv6 traffic on VPC functions that are connected to dual-stack subnets.
     */
    Ipv6AllowedForDualStack?: NullableBoolean;
  }
  export type VpcId = string;
  export type Weight = number;
  export type WorkingDirectory = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2014-11-11"|"2015-03-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Lambda client.
   */
  export import Types = Lambda;
}
export = Lambda;
