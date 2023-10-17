import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
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
   * Grants an Amazon Web Services service or another account permission to use a function. You can apply the policy at the function level, or specify a qualifier to restrict access to a single version or alias. If you use a qualifier, the invoker must use the full Amazon Resource Name (ARN) of that version or alias to invoke the function. Note: Lambda does not support adding policies to version $LATEST. To grant permission to another account, specify the account ID as the Principal. For Amazon Web Services services, the principal is a domain-style identifier defined by the service, like s3.amazonaws.com or sns.amazonaws.com. For Amazon Web Services services, you can also specify the ARN of the associated resource as the SourceArn. If you grant permission to a service principal without specifying the source, other accounts could potentially configure resources in their account to invoke your Lambda function. This action adds a statement to a resource-based permissions policy for the function. For more information about function policies, see Lambda Function Policies. 
   */
  addPermission(params: Lambda.Types.AddPermissionRequest, callback?: (err: AWSError, data: Lambda.Types.AddPermissionResponse) => void): Request<Lambda.Types.AddPermissionResponse, AWSError>;
  /**
   * Grants an Amazon Web Services service or another account permission to use a function. You can apply the policy at the function level, or specify a qualifier to restrict access to a single version or alias. If you use a qualifier, the invoker must use the full Amazon Resource Name (ARN) of that version or alias to invoke the function. Note: Lambda does not support adding policies to version $LATEST. To grant permission to another account, specify the account ID as the Principal. For Amazon Web Services services, the principal is a domain-style identifier defined by the service, like s3.amazonaws.com or sns.amazonaws.com. For Amazon Web Services services, you can also specify the ARN of the associated resource as the SourceArn. If you grant permission to a service principal without specifying the source, other accounts could potentially configure resources in their account to invoke your Lambda function. This action adds a statement to a resource-based permissions policy for the function. For more information about function policies, see Lambda Function Policies. 
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
   * Creates a mapping between an event source and an Lambda function. Lambda reads items from the event source and triggers the function. For details about each event source type, see the following topics.      Configuring a Dynamo DB stream as an event source      Configuring a Kinesis stream as an event source      Configuring an Amazon SQS queue as an event source      Configuring an MQ broker as an event source      Configuring MSK as an event source      Configuring Self-Managed Apache Kafka as an event source    The following error handling options are only available for stream sources (DynamoDB and Kinesis):    BisectBatchOnFunctionError - If the function returns an error, split the batch in two and retry.    DestinationConfig - Send discarded records to an Amazon SQS queue or Amazon SNS topic.    MaximumRecordAgeInSeconds - Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires    MaximumRetryAttempts - Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.    ParallelizationFactor - Process multiple batches from each shard concurrently.  
   */
  createEventSourceMapping(params: Lambda.Types.CreateEventSourceMappingRequest, callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Creates a mapping between an event source and an Lambda function. Lambda reads items from the event source and triggers the function. For details about each event source type, see the following topics.      Configuring a Dynamo DB stream as an event source      Configuring a Kinesis stream as an event source      Configuring an Amazon SQS queue as an event source      Configuring an MQ broker as an event source      Configuring MSK as an event source      Configuring Self-Managed Apache Kafka as an event source    The following error handling options are only available for stream sources (DynamoDB and Kinesis):    BisectBatchOnFunctionError - If the function returns an error, split the batch in two and retry.    DestinationConfig - Send discarded records to an Amazon SQS queue or Amazon SNS topic.    MaximumRecordAgeInSeconds - Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires    MaximumRetryAttempts - Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.    ParallelizationFactor - Process multiple batches from each shard concurrently.  
   */
  createEventSourceMapping(callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Creates a Lambda function. To create a function, you need a deployment package and an execution role. The deployment package is a .zip file archive or container image that contains your function code. The execution role grants the function permission to use Amazon Web Services services, such as Amazon CloudWatch Logs for log streaming and X-Ray for request tracing. You set the package type to Image if the deployment package is a container image. For a container image, the code property must include the URI of a container image in the Amazon ECR registry. You do not need to specify the handler and runtime properties.  You set the package type to Zip if the deployment package is a .zip file archive. For a .zip file archive, the code property specifies the location of the .zip file. You must also specify the handler and runtime properties. The code in the deployment package must be compatible with the target instruction set architecture of the function (x86-64 or arm64). If you do not specify the architecture, the default value is x86-64. When you create a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute or so. During this time, you can't invoke or modify the function. The State, StateReason, and StateReasonCode fields in the response from GetFunctionConfiguration indicate when the function is ready to invoke. For more information, see Function States. A function has an unpublished version, and can have published versions and aliases. The unpublished version changes when you update your function's code and configuration. A published version is a snapshot of your function code and configuration that can't be changed. An alias is a named resource that maps to a version, and can be changed to map to a different version. Use the Publish parameter to create version 1 of your function from its initial configuration. The other parameters let you configure version-specific and function-level settings. You can modify version-specific settings later with UpdateFunctionConfiguration. Function-level settings apply to both the unpublished and published versions of the function, and include tags (TagResource) and per-function concurrency limits (PutFunctionConcurrency). You can use code signing if your deployment package is a .zip file archive. To enable code signing for this function, specify the ARN of a code-signing configuration. When a user attempts to deploy a code package with UpdateFunctionCode, Lambda checks that the code package has a valid signature from a trusted publisher. The code-signing configuration includes set set of signing profiles, which define the trusted publishers for this function. If another account or an Amazon Web Services service invokes your function, use AddPermission to grant permission by creating a resource-based IAM policy. You can grant permissions at the function level, on a version, or on an alias. To invoke your function directly, use Invoke. To invoke your function in response to events in other Amazon Web Services services, create an event source mapping (CreateEventSourceMapping), or configure a function trigger in the other service. For more information, see Invoking Functions.
   */
  createFunction(params: Lambda.Types.CreateFunctionRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Creates a Lambda function. To create a function, you need a deployment package and an execution role. The deployment package is a .zip file archive or container image that contains your function code. The execution role grants the function permission to use Amazon Web Services services, such as Amazon CloudWatch Logs for log streaming and X-Ray for request tracing. You set the package type to Image if the deployment package is a container image. For a container image, the code property must include the URI of a container image in the Amazon ECR registry. You do not need to specify the handler and runtime properties.  You set the package type to Zip if the deployment package is a .zip file archive. For a .zip file archive, the code property specifies the location of the .zip file. You must also specify the handler and runtime properties. The code in the deployment package must be compatible with the target instruction set architecture of the function (x86-64 or arm64). If you do not specify the architecture, the default value is x86-64. When you create a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute or so. During this time, you can't invoke or modify the function. The State, StateReason, and StateReasonCode fields in the response from GetFunctionConfiguration indicate when the function is ready to invoke. For more information, see Function States. A function has an unpublished version, and can have published versions and aliases. The unpublished version changes when you update your function's code and configuration. A published version is a snapshot of your function code and configuration that can't be changed. An alias is a named resource that maps to a version, and can be changed to map to a different version. Use the Publish parameter to create version 1 of your function from its initial configuration. The other parameters let you configure version-specific and function-level settings. You can modify version-specific settings later with UpdateFunctionConfiguration. Function-level settings apply to both the unpublished and published versions of the function, and include tags (TagResource) and per-function concurrency limits (PutFunctionConcurrency). You can use code signing if your deployment package is a .zip file archive. To enable code signing for this function, specify the ARN of a code-signing configuration. When a user attempts to deploy a code package with UpdateFunctionCode, Lambda checks that the code package has a valid signature from a trusted publisher. The code-signing configuration includes set set of signing profiles, which define the trusted publishers for this function. If another account or an Amazon Web Services service invokes your function, use AddPermission to grant permission by creating a resource-based IAM policy. You can grant permissions at the function level, on a version, or on an alias. To invoke your function directly, use Invoke. To invoke your function in response to events in other Amazon Web Services services, create an event source mapping (CreateEventSourceMapping), or configure a function trigger in the other service. For more information, see Invoking Functions.
   */
  createFunction(callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
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
   * Deletes a Lambda function. To delete a specific function version, use the Qualifier parameter. Otherwise, all versions and aliases are deleted. To delete Lambda event source mappings that invoke a function, use DeleteEventSourceMapping. For Amazon Web Services services and resources that invoke your function directly, delete the trigger in the service where you originally configured it.
   */
  deleteFunction(params: Lambda.Types.DeleteFunctionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Lambda function. To delete a specific function version, use the Qualifier parameter. Otherwise, all versions and aliases are deleted. To delete Lambda event source mappings that invoke a function, use DeleteEventSourceMapping. For Amazon Web Services services and resources that invoke your function directly, delete the trigger in the service where you originally configured it.
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
   * Invokes a Lambda function. You can invoke a function synchronously (and wait for the response), or asynchronously. To invoke a function asynchronously, set InvocationType to Event. For synchronous invocation, details about the function response, including errors, are included in the response body and headers. For either invocation type, you can find more information in the execution log and trace. When an error occurs, your function may be invoked multiple times. Retry behavior varies by error type, client, event source, and invocation type. For example, if you invoke a function asynchronously and it returns an error, Lambda executes the function up to two more times. For more information, see Retry Behavior. For asynchronous invocation, Lambda adds events to a queue before sending them to your function. If your function does not have enough capacity to keep up with the queue, events may be lost. Occasionally, your function may receive the same event multiple times, even if no error occurs. To retain events that were not processed, configure your function with a dead-letter queue. The status code in the API response doesn't reflect function errors. Error codes are reserved for errors that prevent your function from executing, such as permissions errors, limit errors, or issues with your function's code and configuration. For example, Lambda returns TooManyRequestsException if executing the function would cause you to exceed a concurrency limit at either the account level (ConcurrentInvocationLimitExceeded) or function level (ReservedFunctionConcurrentInvocationLimitExceeded). For functions with a long timeout, your client might be disconnected during synchronous invocation while it waits for a response. Configure your HTTP client, SDK, firewall, proxy, or operating system to allow for long connections with timeout or keep-alive settings. This operation requires permission for the lambda:InvokeFunction action.
   */
  invoke(params: Lambda.Types.InvocationRequest, callback?: (err: AWSError, data: Lambda.Types.InvocationResponse) => void): Request<Lambda.Types.InvocationResponse, AWSError>;
  /**
   * Invokes a Lambda function. You can invoke a function synchronously (and wait for the response), or asynchronously. To invoke a function asynchronously, set InvocationType to Event. For synchronous invocation, details about the function response, including errors, are included in the response body and headers. For either invocation type, you can find more information in the execution log and trace. When an error occurs, your function may be invoked multiple times. Retry behavior varies by error type, client, event source, and invocation type. For example, if you invoke a function asynchronously and it returns an error, Lambda executes the function up to two more times. For more information, see Retry Behavior. For asynchronous invocation, Lambda adds events to a queue before sending them to your function. If your function does not have enough capacity to keep up with the queue, events may be lost. Occasionally, your function may receive the same event multiple times, even if no error occurs. To retain events that were not processed, configure your function with a dead-letter queue. The status code in the API response doesn't reflect function errors. Error codes are reserved for errors that prevent your function from executing, such as permissions errors, limit errors, or issues with your function's code and configuration. For example, Lambda returns TooManyRequestsException if executing the function would cause you to exceed a concurrency limit at either the account level (ConcurrentInvocationLimitExceeded) or function level (ReservedFunctionConcurrentInvocationLimitExceeded). For functions with a long timeout, your client might be disconnected during synchronous invocation while it waits for a response. Configure your HTTP client, SDK, firewall, proxy, or operating system to allow for long connections with timeout or keep-alive settings. This operation requires permission for the lambda:InvokeFunction action.
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
   * Lists event source mappings. Specify an EventSourceArn to only show event source mappings for a single event source.
   */
  listEventSourceMappings(params: Lambda.Types.ListEventSourceMappingsRequest, callback?: (err: AWSError, data: Lambda.Types.ListEventSourceMappingsResponse) => void): Request<Lambda.Types.ListEventSourceMappingsResponse, AWSError>;
  /**
   * Lists event source mappings. Specify an EventSourceArn to only show event source mappings for a single event source.
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
   * Returns a list of Lambda functions, with the version-specific configuration of each. Lambda returns up to 50 functions per call. Set FunctionVersion to ALL to include all published versions of each function in addition to the unpublished version.   The ListFunctions action returns a subset of the FunctionConfiguration fields. To get the additional fields (State, StateReasonCode, StateReason, LastUpdateStatus, LastUpdateStatusReason, LastUpdateStatusReasonCode) for a function or version, use GetFunction. 
   */
  listFunctions(params: Lambda.Types.ListFunctionsRequest, callback?: (err: AWSError, data: Lambda.Types.ListFunctionsResponse) => void): Request<Lambda.Types.ListFunctionsResponse, AWSError>;
  /**
   * Returns a list of Lambda functions, with the version-specific configuration of each. Lambda returns up to 50 functions per call. Set FunctionVersion to ALL to include all published versions of each function in addition to the unpublished version.   The ListFunctions action returns a subset of the FunctionConfiguration fields. To get the additional fields (State, StateReasonCode, StateReason, LastUpdateStatus, LastUpdateStatusReason, LastUpdateStatusReasonCode) for a function or version, use GetFunction. 
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
   * Sets the maximum number of simultaneous executions for a function, and reserves capacity for that concurrency level. Concurrency settings apply to the function as a whole, including all published versions and the unpublished version. Reserving concurrency both ensures that your function has capacity to process the specified number of events simultaneously, and prevents it from scaling beyond that level. Use GetFunction to see the current setting for a function. Use GetAccountSettings to see your Regional concurrency limit. You can reserve concurrency for as many functions as you like, as long as you leave at least 100 simultaneous executions unreserved for functions that aren't configured with a per-function limit. For more information, see Managing Concurrency.
   */
  putFunctionConcurrency(params: Lambda.Types.PutFunctionConcurrencyRequest, callback?: (err: AWSError, data: Lambda.Types.Concurrency) => void): Request<Lambda.Types.Concurrency, AWSError>;
  /**
   * Sets the maximum number of simultaneous executions for a function, and reserves capacity for that concurrency level. Concurrency settings apply to the function as a whole, including all published versions and the unpublished version. Reserving concurrency both ensures that your function has capacity to process the specified number of events simultaneously, and prevents it from scaling beyond that level. Use GetFunction to see the current setting for a function. Use GetAccountSettings to see your Regional concurrency limit. You can reserve concurrency for as many functions as you like, as long as you leave at least 100 simultaneous executions unreserved for functions that aren't configured with a per-function limit. For more information, see Managing Concurrency.
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
   * Removes a statement from the permissions policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
   */
  removeLayerVersionPermission(params: Lambda.Types.RemoveLayerVersionPermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a statement from the permissions policy for a version of an Lambda layer. For more information, see AddLayerVersionPermission.
   */
  removeLayerVersionPermission(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes function-use permission from an Amazon Web Services service or another account. You can get the ID of the statement from the output of GetPolicy.
   */
  removePermission(params: Lambda.Types.RemovePermissionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Revokes function-use permission from an Amazon Web Services service or another account. You can get the ID of the statement from the output of GetPolicy.
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
   * Updates an event source mapping. You can change the function that Lambda invokes, or pause invocation and resume later from the same location. The following error handling options are only available for stream sources (DynamoDB and Kinesis):    BisectBatchOnFunctionError - If the function returns an error, split the batch in two and retry.    DestinationConfig - Send discarded records to an Amazon SQS queue or Amazon SNS topic.    MaximumRecordAgeInSeconds - Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires    MaximumRetryAttempts - Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.    ParallelizationFactor - Process multiple batches from each shard concurrently.  
   */
  updateEventSourceMapping(params: Lambda.Types.UpdateEventSourceMappingRequest, callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Updates an event source mapping. You can change the function that Lambda invokes, or pause invocation and resume later from the same location. The following error handling options are only available for stream sources (DynamoDB and Kinesis):    BisectBatchOnFunctionError - If the function returns an error, split the batch in two and retry.    DestinationConfig - Send discarded records to an Amazon SQS queue or Amazon SNS topic.    MaximumRecordAgeInSeconds - Discard records older than the specified age. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires    MaximumRetryAttempts - Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records are retried until the record expires.    ParallelizationFactor - Process multiple batches from each shard concurrently.  
   */
  updateEventSourceMapping(callback?: (err: AWSError, data: Lambda.Types.EventSourceMappingConfiguration) => void): Request<Lambda.Types.EventSourceMappingConfiguration, AWSError>;
  /**
   * Updates a Lambda function's code. If code signing is enabled for the function, the code package must be signed by a trusted publisher. For more information, see Configuring code signing. The function's code is locked when you publish a version. You can't modify the code of a published version, only the unpublished version.  For a function defined as a container image, Lambda resolves the image tag to an image digest. In Amazon ECR, if you update the image tag to a new image, Lambda does not automatically update the function. 
   */
  updateFunctionCode(params: Lambda.Types.UpdateFunctionCodeRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Updates a Lambda function's code. If code signing is enabled for the function, the code package must be signed by a trusted publisher. For more information, see Configuring code signing. The function's code is locked when you publish a version. You can't modify the code of a published version, only the unpublished version.  For a function defined as a container image, Lambda resolves the image tag to an image digest. In Amazon ECR, if you update the image tag to a new image, Lambda does not automatically update the function. 
   */
  updateFunctionCode(callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Modify the version-specific settings of a Lambda function. When you update a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute. During this time, you can't modify the function, but you can still invoke it. The LastUpdateStatus, LastUpdateStatusReason, and LastUpdateStatusReasonCode fields in the response from GetFunctionConfiguration indicate when the update is complete and the function is processing events with the new configuration. For more information, see Function States. These settings can vary between versions of a function and are locked when you publish a version. You can't modify the configuration of a published version, only the unpublished version. To configure function concurrency, use PutFunctionConcurrency. To grant invoke permissions to an account or Amazon Web Services service, use AddPermission.
   */
  updateFunctionConfiguration(params: Lambda.Types.UpdateFunctionConfigurationRequest, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Modify the version-specific settings of a Lambda function. When you update a function, Lambda provisions an instance of the function and its supporting resources. If your function connects to a VPC, this process can take a minute. During this time, you can't modify the function, but you can still invoke it. The LastUpdateStatus, LastUpdateStatusReason, and LastUpdateStatusReasonCode fields in the response from GetFunctionConfiguration indicate when the update is complete and the function is processing events with the new configuration. For more information, see Function States. These settings can vary between versions of a function and are locked when you publish a version. You can't modify the configuration of a published version, only the unpublished version. To configure function concurrency, use PutFunctionConcurrency. To grant invoke permissions to an account or Amazon Web Services service, use AddPermission.
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
   * Waits for the functionExists state by periodically calling the underlying Lambda.getFunctionoperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "functionExists", params: Lambda.Types.GetFunctionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Waits for the functionExists state by periodically calling the underlying Lambda.getFunctionoperation every 1 seconds (at most 20 times).
   */
  waitFor(state: "functionExists", callback?: (err: AWSError, data: Lambda.Types.GetFunctionResponse) => void): Request<Lambda.Types.GetFunctionResponse, AWSError>;
  /**
   * Waits for the functionActive state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 60 times). Waits for the function's State to be Active.
   */
  waitFor(state: "functionActive", params: Lambda.Types.GetFunctionConfigurationRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Waits for the functionActive state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 60 times). Waits for the function's State to be Active.
   */
  waitFor(state: "functionActive", callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Waits for the functionUpdated state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 60 times). Waits for the function's LastUpdateStatus to be Successful.
   */
  waitFor(state: "functionUpdated", params: Lambda.Types.GetFunctionConfigurationRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
  /**
   * Waits for the functionUpdated state by periodically calling the underlying Lambda.getFunctionConfigurationoperation every 5 seconds (at most 60 times). Waits for the function's LastUpdateStatus to be Successful.
   */
  waitFor(state: "functionUpdated", callback?: (err: AWSError, data: Lambda.Types.FunctionConfiguration) => void): Request<Lambda.Types.FunctionConfiguration, AWSError>;
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
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * The Amazon Web Services service or account that invokes the function. If you specify a service, use SourceArn or SourceAccount to limit who can invoke the function through that service.
     */
    Principal: Principal;
    /**
     * For Amazon Web Services services, the ARN of the Amazon Web Services resource that invokes the function. For example, an Amazon S3 bucket or Amazon SNS topic. Note that Lambda configures the comparison using the StringLike operator.
     */
    SourceArn?: Arn;
    /**
     * For Amazon S3, the ID of the account that owns the resource. Use this together with SourceArn to ensure that the resource is owned by the specified account. It is possible for an Amazon S3 bucket to be deleted by its owner and recreated by another account.
     */
    SourceAccount?: SourceOwner;
    /**
     * For Alexa Smart Home functions, a token that must be supplied by the invoker.
     */
    EventSourceToken?: EventSourceToken;
    /**
     * Specify a version or alias to add permissions to a published version of the function.
     */
    Qualifier?: Qualifier;
    /**
     * Only update the policy if the revision ID matches the ID that's specified. Use this option to avoid modifying a policy that has changed since you last read it.
     */
    RevisionId?: String;
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
  export interface AllowedPublishers {
    /**
     * The Amazon Resource Name (ARN) for each of the signing profiles. A signing profile defines a trusted user who can sign a code package. 
     */
    SigningProfileVersionArns: SigningProfileVersionArns;
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
  export type CompatibleArchitectures = Architecture[];
  export type CompatibleRuntimes = Runtime[];
  export interface Concurrency {
    /**
     * The number of concurrent executions that are reserved for this function. For more information, see Managing Concurrency.
     */
    ReservedConcurrentExecutions?: ReservedConcurrentExecutions;
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
     * The Amazon Resource Name (ARN) of the event source.    Amazon Kinesis - The ARN of the data stream or a stream consumer.    Amazon DynamoDB Streams - The ARN of the stream.    Amazon Simple Queue Service - The ARN of the queue.    Amazon Managed Streaming for Apache Kafka - The ARN of the cluster.  
     */
    EventSourceArn?: Arn;
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Version or Alias ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * When true, the event source mapping is active. When false, Lambda pauses polling and invocation. Default: True
     */
    Enabled?: Enabled;
    /**
     * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function. Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB).    Amazon Kinesis - Default 100. Max 10,000.    Amazon DynamoDB Streams - Default 100. Max 1,000.    Amazon Simple Queue Service - Default 10. For standard queues the max is 10,000. For FIFO queues the max is 10.    Amazon Managed Streaming for Apache Kafka - Default 100. Max 10,000.    Self-Managed Apache Kafka - Default 100. Max 10,000.  
     */
    BatchSize?: BatchSize;
    /**
     * (Streams and Amazon SQS standard queues) The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function. Default: 0 Related setting: When you set BatchSize to a value greater than 10, you must set MaximumBatchingWindowInSeconds to at least 1.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Streams only) The number of batches to process from each shard concurrently.
     */
    ParallelizationFactor?: ParallelizationFactor;
    /**
     * The position in a stream from which to start reading. Required for Amazon Kinesis, Amazon DynamoDB, and Amazon MSK Streams sources. AT_TIMESTAMP is only supported for Amazon Kinesis streams.
     */
    StartingPosition?: EventSourcePosition;
    /**
     * With StartingPosition set to AT_TIMESTAMP, the time from which to start reading.
     */
    StartingPositionTimestamp?: _Date;
    /**
     * (Streams only) An Amazon SQS queue or Amazon SNS topic destination for discarded records.
     */
    DestinationConfig?: DestinationConfig;
    /**
     * (Streams only) Discard records older than the specified age. The default value is infinite (-1).
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Streams only) If the function returns an error, split the batch in two and retry.
     */
    BisectBatchOnFunctionError?: BisectBatchOnFunctionError;
    /**
     * (Streams only) Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records will be retried until the record expires.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsEventSourceMapping;
    /**
     * (Streams only) The duration in seconds of a processing window. The range is between 1 second up to 900 seconds.
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
     * The Self-Managed Apache Kafka cluster to send records.
     */
    SelfManagedEventSource?: SelfManagedEventSource;
    /**
     * (Streams only) A list of current response type enums applied to the event source mapping.
     */
    FunctionResponseTypes?: FunctionResponseTypeList;
  }
  export interface CreateFunctionRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The identifier of the function's runtime.
     */
    Runtime?: Runtime;
    /**
     * The Amazon Resource Name (ARN) of the function's execution role.
     */
    Role: RoleArn;
    /**
     * The name of the method within your code that Lambda calls to execute your function. The format includes the file name. It can also include namespaces and other qualifiers, depending on the runtime. For more information, see Programming Model.
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
     * The amount of time that Lambda allows a function to run before stopping it. The default is 3 seconds. The maximum allowed value is 900 seconds. For additional information, see Lambda execution environment.
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
     * For network connectivity to Amazon Web Services resources in a VPC, specify a list of security groups and subnets in the VPC. When you connect a function to a VPC, it can only access resources and the internet through that VPC. For more information, see VPC Settings.
     */
    VpcConfig?: VpcConfig;
    /**
     * The type of deployment package. Set to Image for container image and set Zip for ZIP archive.
     */
    PackageType?: PackageType;
    /**
     * A dead letter queue configuration that specifies the queue or topic where Lambda sends asynchronous events when they fail processing. For more information, see Dead Letter Queues.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * Environment variables that are accessible from function code during execution.
     */
    Environment?: Environment;
    /**
     * The ARN of the Amazon Web Services Key Management Service (KMS) key that's used to encrypt your function's environment variables. If it's not provided, Lambda uses a default service key.
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
     * The instruction set architecture that the function supports. Enter a string array with one of the valid values. The default value is x86_64.
     */
    Architectures?: ArchitecturesList;
  }
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
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * The name of the Lambda function or version.  Name formats     Function name - my-function (name-only), my-function:1 (with version).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * Specify a version to delete. You can't delete a version that's referenced by an alias.
     */
    Qualifier?: Qualifier;
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
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * Environment variable key-value pairs.
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
  export interface EventSourceMappingConfiguration {
    /**
     * The identifier of the event source mapping.
     */
    UUID?: String;
    /**
     * The position in a stream from which to start reading. Required for Amazon Kinesis, Amazon DynamoDB, and Amazon MSK stream sources. AT_TIMESTAMP is supported only for Amazon Kinesis streams.
     */
    StartingPosition?: EventSourcePosition;
    /**
     * With StartingPosition set to AT_TIMESTAMP, the time from which to start reading.
     */
    StartingPositionTimestamp?: _Date;
    /**
     * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function. Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB). Default value: Varies by service. For Amazon SQS, the default is 10. For all other services, the default is 100. Related setting: When you set BatchSize to a value greater than 10, you must set MaximumBatchingWindowInSeconds to at least 1.
     */
    BatchSize?: BatchSize;
    /**
     * (Streams and Amazon SQS standard queues) The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function. Default: 0 Related setting: When you set BatchSize to a value greater than 10, you must set MaximumBatchingWindowInSeconds to at least 1.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Streams only) The number of batches to process concurrently from each shard. The default value is 1.
     */
    ParallelizationFactor?: ParallelizationFactor;
    /**
     * The Amazon Resource Name (ARN) of the event source.
     */
    EventSourceArn?: Arn;
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
     * (Streams only) An Amazon SQS queue or Amazon SNS topic destination for discarded records.
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
     * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, Lambda never discards old records. 
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Streams only) If the function returns an error, split the batch in two and retry. The default value is false.
     */
    BisectBatchOnFunctionError?: BisectBatchOnFunctionError;
    /**
     * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, Lambda retries failed records until the record expires in the event source.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsEventSourceMapping;
    /**
     * (Streams only) The duration in seconds of a processing window. The range is 1–900 seconds.
     */
    TumblingWindowInSeconds?: TumblingWindowInSeconds;
    /**
     * (Streams only) A list of current response type enums applied to the event source mapping.
     */
    FunctionResponseTypes?: FunctionResponseTypeList;
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
  export type FunctionArn = string;
  export type FunctionArnList = FunctionArn[];
  export interface FunctionCode {
    /**
     * The base64-encoded contents of the deployment package. Amazon Web Services SDK and Amazon Web Services CLI clients handle the encoding for you.
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
     * The runtime environment for the Lambda function.
     */
    Runtime?: Runtime;
    /**
     * The function's execution role.
     */
    Role?: RoleArn;
    /**
     * The function that Lambda calls to begin executing your function.
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
     * The function's environment variables.
     */
    Environment?: EnvironmentResponse;
    /**
     * The KMS key that's used to encrypt the function's environment variables. This key is only returned if you've configured a customer managed CMK.
     */
    KMSKeyArn?: KMSKeyArn;
    /**
     * The function's X-Ray tracing configuration.
     */
    TracingConfig?: TracingConfigResponse;
    /**
     * For Lambda@Edge functions, the ARN of the master function.
     */
    MasterArn?: FunctionArn;
    /**
     * The latest updated revision of the function or alias.
     */
    RevisionId?: String;
    /**
     * The function's  layers.
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
     * A destination for events after they have been sent to a function for processing.  Destinations     Function - The Amazon Resource Name (ARN) of a Lambda function.    Queue - The ARN of an SQS queue.    Topic - The ARN of an SNS topic.    Event Bus - The ARN of an Amazon EventBridge event bus.  
     */
    DestinationConfig?: DestinationConfig;
  }
  export type FunctionEventInvokeConfigList = FunctionEventInvokeConfig[];
  export type FunctionList = FunctionConfiguration[];
  export type FunctionName = string;
  export type FunctionResponseType = "ReportBatchItemFailures"|string;
  export type FunctionResponseTypeList = FunctionResponseType[];
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
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * The layer's compatible runtimes.
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
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * The amount of provisioned concurrency allocated.
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
  export type Handler = string;
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
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: NamespacedFunctionName;
    /**
     * Choose from the following options.    RequestResponse (default) - Invoke the function synchronously. Keep the connection open until the function returns a response or times out. The API response includes the function response and additional data.    Event - Invoke the function asynchronously. Send events that fail multiple times to the function's dead-letter queue (if it's configured). The API response only includes a status code.    DryRun - Validate parameter values and verify that the user or role has permission to invoke the function.  
     */
    InvocationType?: InvocationType;
    /**
     * Set to Tail to include the execution log in the response. Applies to synchronously invoked functions only.
     */
    LogType?: LogType;
    /**
     * Up to 3583 bytes of base64-encoded data about the invoking client to pass to the function in the context object.
     */
    ClientContext?: String;
    /**
     * The JSON that you want to provide to your Lambda function as input.
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
     * The last 4 KB of the execution log, which is base64 encoded.
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
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
  export type KMSKeyArn = string;
  export type LastUpdateStatus = "Successful"|"Failed"|"InProgress"|string;
  export type LastUpdateStatusReason = string;
  export type LastUpdateStatusReasonCode = "EniLimitExceeded"|"InsufficientRolePermissions"|"InvalidConfiguration"|"InternalError"|"SubnetOutOfIPAddresses"|"InvalidSubnet"|"InvalidSecurityGroup"|"ImageDeleted"|"ImageAccessDenied"|"InvalidImage"|string;
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
     * The layer's compatible runtimes.
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
     * The Amazon Resource Name (ARN) of the event source.    Amazon Kinesis - The ARN of the data stream or a stream consumer.    Amazon DynamoDB Streams - The ARN of the stream.    Amazon Simple Queue Service - The ARN of the queue.    Amazon Managed Streaming for Apache Kafka - The ARN of the cluster.  
     */
    EventSourceArn?: Arn;
    /**
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Version or Alias ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
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
     * For Lambda@Edge functions, the Amazon Web Services Region of the master function. For example, us-east-1 filters the list of functions to only include Lambda@Edge functions replicated from a master function in US East (N. Virginia). If specified, you must set FunctionVersion to ALL.
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
     * A runtime identifier. For example, go1.x.
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
     * A runtime identifier. For example, go1.x.
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
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
  export type MaxFunctionEventInvokeConfigListItems = number;
  export type MaxLayerListItems = number;
  export type MaxListItems = number;
  export type MaxProvisionedConcurrencyConfigListItems = number;
  export type MaximumBatchingWindowInSeconds = number;
  export type MaximumEventAgeInSeconds = number;
  export type MaximumRecordAgeInSeconds = number;
  export type MaximumRetryAttempts = number;
  export type MaximumRetryAttemptsEventSourceMapping = number;
  export type MemorySize = number;
  export type NameSpacedFunctionArn = string;
  export type NamespacedFunctionName = string;
  export type NamespacedStatementId = string;
  export type NonNegativeInteger = number;
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
  export type PackageType = "Zip"|"Image"|string;
  export type ParallelizationFactor = number;
  export type PositiveInteger = number;
  export type Principal = string;
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
     * The amount of provisioned concurrency allocated.
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
     * A list of compatible function runtimes. Used for filtering with ListLayers and ListLayerVersions.
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
     * The layer's compatible runtimes.
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
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * A destination for events after they have been sent to a function for processing.  Destinations     Function - The Amazon Resource Name (ARN) of a Lambda function.    Queue - The ARN of an SQS queue.    Topic - The ARN of an SNS topic.    Event Bus - The ARN of an Amazon EventBridge event bus.  
     */
    DestinationConfig?: DestinationConfig;
  }
  export interface PutProvisionedConcurrencyConfigRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * The amount of provisioned concurrency allocated.
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
     * The name of the Lambda function, version, or alias.  Name formats     Function name - my-function (name-only), my-function:v1 (with alias).    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   You can append a version number or alias to any of the formats. The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
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
     * Only update the policy if the revision ID matches the ID that's specified. Use this option to avoid modifying a policy that has changed since you last read it.
     */
    RevisionId?: String;
  }
  export type ReservedConcurrentExecutions = number;
  export type ResourceArn = string;
  export type RoleArn = string;
  export type Runtime = "nodejs"|"nodejs4.3"|"nodejs6.10"|"nodejs8.10"|"nodejs10.x"|"nodejs12.x"|"nodejs14.x"|"java8"|"java8.al2"|"java11"|"python2.7"|"python3.6"|"python3.7"|"python3.8"|"python3.9"|"dotnetcore1.0"|"dotnetcore2.0"|"dotnetcore2.1"|"dotnetcore3.1"|"nodejs4.3-edge"|"go1.x"|"ruby2.5"|"ruby2.7"|"provided"|"provided.al2"|string;
  export type S3Bucket = string;
  export type S3Key = string;
  export type S3ObjectVersion = string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export interface SelfManagedEventSource {
    /**
     * The list of bootstrap servers for your Kafka brokers in the following format: "KAFKA_BOOTSTRAP_SERVERS": ["abc.xyz.com:xxxx","abc2.xyz.com:xxxx"].
     */
    Endpoints?: Endpoints;
  }
  export type SensitiveString = string;
  export type SigningProfileVersionArns = Arn[];
  export interface SourceAccessConfiguration {
    /**
     * The type of authentication protocol, VPC components, or virtual host for your event source. For example: "Type":"SASL_SCRAM_512_AUTH".    BASIC_AUTH - (Amazon MQ) The Secrets Manager secret that stores your broker credentials.    BASIC_AUTH - (Self-managed Apache Kafka) The Secrets Manager ARN of your secret key used for SASL/PLAIN authentication of your Apache Kafka brokers.    VPC_SUBNET - The subnets associated with your VPC. Lambda connects to these subnets to fetch data from your self-managed Apache Kafka cluster.    VPC_SECURITY_GROUP - The VPC security group used to manage access to your self-managed Apache Kafka brokers.    SASL_SCRAM_256_AUTH - The Secrets Manager ARN of your secret key used for SASL SCRAM-256 authentication of your self-managed Apache Kafka brokers.    SASL_SCRAM_512_AUTH - The Secrets Manager ARN of your secret key used for SASL SCRAM-512 authentication of your self-managed Apache Kafka brokers.    VIRTUAL_HOST - (Amazon MQ) The name of the virtual host in your RabbitMQ broker. Lambda uses this RabbitMQ host as the event source.  
     */
    Type?: SourceAccessType;
    /**
     * The value for your chosen configuration in Type. For example: "URI": "arn:aws:secretsmanager:us-east-1:01234567890:secret:MyBrokerSecretName".
     */
    URI?: URI;
  }
  export type SourceAccessConfigurations = SourceAccessConfiguration[];
  export type SourceAccessType = "BASIC_AUTH"|"VPC_SUBNET"|"VPC_SECURITY_GROUP"|"SASL_SCRAM_512_AUTH"|"SASL_SCRAM_256_AUTH"|"VIRTUAL_HOST"|string;
  export type SourceOwner = string;
  export type State = "Pending"|"Active"|"Inactive"|"Failed"|string;
  export type StateReason = string;
  export type StateReasonCode = "Idle"|"Creating"|"Restoring"|"EniLimitExceeded"|"InsufficientRolePermissions"|"InvalidConfiguration"|"InternalError"|"SubnetOutOfIPAddresses"|"InvalidSubnet"|"InvalidSecurityGroup"|"ImageDeleted"|"ImageAccessDenied"|"InvalidImage"|string;
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
     * The name of the Lambda function.  Name formats     Function name - MyFunction.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction.    Version or Alias ARN - arn:aws:lambda:us-west-2:123456789012:function:MyFunction:PROD.    Partial ARN - 123456789012:function:MyFunction.   The length constraint applies only to the full ARN. If you specify only the function name, it's limited to 64 characters in length.
     */
    FunctionName?: FunctionName;
    /**
     * When true, the event source mapping is active. When false, Lambda pauses polling and invocation. Default: True
     */
    Enabled?: Enabled;
    /**
     * The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function. Lambda passes all of the records in the batch to the function in a single call, up to the payload limit for synchronous invocation (6 MB).    Amazon Kinesis - Default 100. Max 10,000.    Amazon DynamoDB Streams - Default 100. Max 1,000.    Amazon Simple Queue Service - Default 10. For standard queues the max is 10,000. For FIFO queues the max is 10.    Amazon Managed Streaming for Apache Kafka - Default 100. Max 10,000.    Self-Managed Apache Kafka - Default 100. Max 10,000.  
     */
    BatchSize?: BatchSize;
    /**
     * (Streams and Amazon SQS standard queues) The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function. Default: 0 Related setting: When you set BatchSize to a value greater than 10, you must set MaximumBatchingWindowInSeconds to at least 1.
     */
    MaximumBatchingWindowInSeconds?: MaximumBatchingWindowInSeconds;
    /**
     * (Streams only) An Amazon SQS queue or Amazon SNS topic destination for discarded records.
     */
    DestinationConfig?: DestinationConfig;
    /**
     * (Streams only) Discard records older than the specified age. The default value is infinite (-1).
     */
    MaximumRecordAgeInSeconds?: MaximumRecordAgeInSeconds;
    /**
     * (Streams only) If the function returns an error, split the batch in two and retry.
     */
    BisectBatchOnFunctionError?: BisectBatchOnFunctionError;
    /**
     * (Streams only) Discard records after the specified number of retries. The default value is infinite (-1). When set to infinite (-1), failed records will be retried until the record expires.
     */
    MaximumRetryAttempts?: MaximumRetryAttemptsEventSourceMapping;
    /**
     * (Streams only) The number of batches to process from each shard concurrently.
     */
    ParallelizationFactor?: ParallelizationFactor;
    /**
     * An array of authentication protocols or VPC components required to secure your event source.
     */
    SourceAccessConfigurations?: SourceAccessConfigurations;
    /**
     * (Streams only) The duration in seconds of a processing window. The range is between 1 second up to 900 seconds.
     */
    TumblingWindowInSeconds?: TumblingWindowInSeconds;
    /**
     * (Streams only) A list of current response type enums applied to the event source mapping.
     */
    FunctionResponseTypes?: FunctionResponseTypeList;
  }
  export interface UpdateFunctionCodeRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The base64-encoded contents of the deployment package. Amazon Web Services SDK and Amazon Web Services CLI clients handle the encoding for you.
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
    /**
     * Set to true to publish a new version of the function after updating the code. This has the same effect as calling PublishVersion separately.
     */
    Publish?: Boolean;
    /**
     * Set to true to validate the request parameters and access permissions without modifying the function code.
     */
    DryRun?: Boolean;
    /**
     * Only update the function if the revision ID matches the ID that's specified. Use this option to avoid modifying a function that has changed since you last read it.
     */
    RevisionId?: String;
    /**
     * The instruction set architecture that the function supports. Enter a string array with one of the valid values. The default value is x86_64.
     */
    Architectures?: ArchitecturesList;
  }
  export interface UpdateFunctionConfigurationRequest {
    /**
     * The name of the Lambda function.  Name formats     Function name - my-function.    Function ARN - arn:aws:lambda:us-west-2:123456789012:function:my-function.    Partial ARN - 123456789012:function:my-function.   The length constraint applies only to the full ARN. If you specify only the function name, it is limited to 64 characters in length.
     */
    FunctionName: FunctionName;
    /**
     * The Amazon Resource Name (ARN) of the function's execution role.
     */
    Role?: RoleArn;
    /**
     * The name of the method within your code that Lambda calls to execute your function. The format includes the file name. It can also include namespaces and other qualifiers, depending on the runtime. For more information, see Programming Model.
     */
    Handler?: Handler;
    /**
     * A description of the function.
     */
    Description?: Description;
    /**
     * The amount of time that Lambda allows a function to run before stopping it. The default is 3 seconds. The maximum allowed value is 900 seconds. For additional information, see Lambda execution environment.
     */
    Timeout?: Timeout;
    /**
     * The amount of memory available to the function at runtime. Increasing the function memory also increases its CPU allocation. The default value is 128 MB. The value can be any multiple of 1 MB.
     */
    MemorySize?: MemorySize;
    /**
     * For network connectivity to Amazon Web Services resources in a VPC, specify a list of security groups and subnets in the VPC. When you connect a function to a VPC, it can only access resources and the internet through that VPC. For more information, see VPC Settings.
     */
    VpcConfig?: VpcConfig;
    /**
     * Environment variables that are accessible from function code during execution.
     */
    Environment?: Environment;
    /**
     * The identifier of the function's runtime.
     */
    Runtime?: Runtime;
    /**
     * A dead letter queue configuration that specifies the queue or topic where Lambda sends asynchronous events when they fail processing. For more information, see Dead Letter Queues.
     */
    DeadLetterConfig?: DeadLetterConfig;
    /**
     * The ARN of the Amazon Web Services Key Management Service (KMS) key that's used to encrypt your function's environment variables. If it's not provided, Lambda uses a default service key.
     */
    KMSKeyArn?: KMSKeyArn;
    /**
     * Set Mode to Active to sample and trace a subset of incoming requests with X-Ray.
     */
    TracingConfig?: TracingConfig;
    /**
     * Only update the function if the revision ID matches the ID that's specified. Use this option to avoid modifying a function that has changed since you last read it.
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
     * A destination for events after they have been sent to a function for processing.  Destinations     Function - The Amazon Resource Name (ARN) of a Lambda function.    Queue - The ARN of an SQS queue.    Topic - The ARN of an SNS topic.    Event Bus - The ARN of an Amazon EventBridge event bus.  
     */
    DestinationConfig?: DestinationConfig;
  }
  export type Version = string;
  export interface VpcConfig {
    /**
     * A list of VPC subnet IDs.
     */
    SubnetIds?: SubnetIds;
    /**
     * A list of VPC security groups IDs.
     */
    SecurityGroupIds?: SecurityGroupIds;
  }
  export interface VpcConfigResponse {
    /**
     * A list of VPC subnet IDs.
     */
    SubnetIds?: SubnetIds;
    /**
     * A list of VPC security groups IDs.
     */
    SecurityGroupIds?: SecurityGroupIds;
    /**
     * The ID of the VPC.
     */
    VpcId?: VpcId;
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
