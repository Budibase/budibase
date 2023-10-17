import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class StepFunctions extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: StepFunctions.Types.ClientConfiguration)
  config: Config & StepFunctions.Types.ClientConfiguration;
  /**
   * Creates an activity. An activity is a task that you write in any programming language and host on any machine that has access to Step Functions. Activities must poll Step Functions using the GetActivityTask API action and respond using SendTask* API actions. This function lets Step Functions know the existence of your activity and returns an identifier for use in a state machine and when polling from the activity.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.    CreateActivity is an idempotent API. Subsequent requests won’t create a duplicate resource if it was already created. CreateActivity's idempotency check is based on the activity name. If a following request has different tags values, Step Functions will ignore these differences and treat it as an idempotent request of the previous. In this case, tags will not be updated, even if they are different. 
   */
  createActivity(params: StepFunctions.Types.CreateActivityInput, callback?: (err: AWSError, data: StepFunctions.Types.CreateActivityOutput) => void): Request<StepFunctions.Types.CreateActivityOutput, AWSError>;
  /**
   * Creates an activity. An activity is a task that you write in any programming language and host on any machine that has access to Step Functions. Activities must poll Step Functions using the GetActivityTask API action and respond using SendTask* API actions. This function lets Step Functions know the existence of your activity and returns an identifier for use in a state machine and when polling from the activity.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.    CreateActivity is an idempotent API. Subsequent requests won’t create a duplicate resource if it was already created. CreateActivity's idempotency check is based on the activity name. If a following request has different tags values, Step Functions will ignore these differences and treat it as an idempotent request of the previous. In this case, tags will not be updated, even if they are different. 
   */
  createActivity(callback?: (err: AWSError, data: StepFunctions.Types.CreateActivityOutput) => void): Request<StepFunctions.Types.CreateActivityOutput, AWSError>;
  /**
   * Creates a state machine. A state machine consists of a collection of states that can do work (Task states), determine to which states to transition next (Choice states), stop an execution with an error (Fail states), and so on. State machines are specified using a JSON-based, structured language. For more information, see Amazon States Language in the Step Functions User Guide. If you set the publish parameter of this API action to true, it publishes version 1 as the first revision of the state machine.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.    CreateStateMachine is an idempotent API. Subsequent requests won’t create a duplicate resource if it was already created. CreateStateMachine's idempotency check is based on the state machine name, definition, type, LoggingConfiguration, and TracingConfiguration. The check is also based on the publish and versionDescription parameters. If a following request has a different roleArn or tags, Step Functions will ignore these differences and treat it as an idempotent request of the previous. In this case, roleArn and tags will not be updated, even if they are different. 
   */
  createStateMachine(params: StepFunctions.Types.CreateStateMachineInput, callback?: (err: AWSError, data: StepFunctions.Types.CreateStateMachineOutput) => void): Request<StepFunctions.Types.CreateStateMachineOutput, AWSError>;
  /**
   * Creates a state machine. A state machine consists of a collection of states that can do work (Task states), determine to which states to transition next (Choice states), stop an execution with an error (Fail states), and so on. State machines are specified using a JSON-based, structured language. For more information, see Amazon States Language in the Step Functions User Guide. If you set the publish parameter of this API action to true, it publishes version 1 as the first revision of the state machine.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.    CreateStateMachine is an idempotent API. Subsequent requests won’t create a duplicate resource if it was already created. CreateStateMachine's idempotency check is based on the state machine name, definition, type, LoggingConfiguration, and TracingConfiguration. The check is also based on the publish and versionDescription parameters. If a following request has a different roleArn or tags, Step Functions will ignore these differences and treat it as an idempotent request of the previous. In this case, roleArn and tags will not be updated, even if they are different. 
   */
  createStateMachine(callback?: (err: AWSError, data: StepFunctions.Types.CreateStateMachineOutput) => void): Request<StepFunctions.Types.CreateStateMachineOutput, AWSError>;
  /**
   * Creates an alias for a state machine that points to one or two versions of the same state machine. You can set your application to call StartExecution with an alias and update the version the alias uses without changing the client's code. You can also map an alias to split StartExecution requests between two versions of a state machine. To do this, add a second RoutingConfig object in the routingConfiguration parameter. You must also specify the percentage of execution run requests each version should receive in both RoutingConfig objects. Step Functions randomly chooses which version runs a given execution based on the percentage you specify. To create an alias that points to a single version, specify a single RoutingConfig object with a weight set to 100. You can create up to 100 aliases for each state machine. You must delete unused aliases using the DeleteStateMachineAlias API action.  CreateStateMachineAlias is an idempotent API. Step Functions bases the idempotency check on the stateMachineArn, description, name, and routingConfiguration parameters. Requests that contain the same values for these parameters return a successful idempotent response without creating a duplicate resource.  Related operations:     DescribeStateMachineAlias     ListStateMachineAliases     UpdateStateMachineAlias     DeleteStateMachineAlias   
   */
  createStateMachineAlias(params: StepFunctions.Types.CreateStateMachineAliasInput, callback?: (err: AWSError, data: StepFunctions.Types.CreateStateMachineAliasOutput) => void): Request<StepFunctions.Types.CreateStateMachineAliasOutput, AWSError>;
  /**
   * Creates an alias for a state machine that points to one or two versions of the same state machine. You can set your application to call StartExecution with an alias and update the version the alias uses without changing the client's code. You can also map an alias to split StartExecution requests between two versions of a state machine. To do this, add a second RoutingConfig object in the routingConfiguration parameter. You must also specify the percentage of execution run requests each version should receive in both RoutingConfig objects. Step Functions randomly chooses which version runs a given execution based on the percentage you specify. To create an alias that points to a single version, specify a single RoutingConfig object with a weight set to 100. You can create up to 100 aliases for each state machine. You must delete unused aliases using the DeleteStateMachineAlias API action.  CreateStateMachineAlias is an idempotent API. Step Functions bases the idempotency check on the stateMachineArn, description, name, and routingConfiguration parameters. Requests that contain the same values for these parameters return a successful idempotent response without creating a duplicate resource.  Related operations:     DescribeStateMachineAlias     ListStateMachineAliases     UpdateStateMachineAlias     DeleteStateMachineAlias   
   */
  createStateMachineAlias(callback?: (err: AWSError, data: StepFunctions.Types.CreateStateMachineAliasOutput) => void): Request<StepFunctions.Types.CreateStateMachineAliasOutput, AWSError>;
  /**
   * Deletes an activity.
   */
  deleteActivity(params: StepFunctions.Types.DeleteActivityInput, callback?: (err: AWSError, data: StepFunctions.Types.DeleteActivityOutput) => void): Request<StepFunctions.Types.DeleteActivityOutput, AWSError>;
  /**
   * Deletes an activity.
   */
  deleteActivity(callback?: (err: AWSError, data: StepFunctions.Types.DeleteActivityOutput) => void): Request<StepFunctions.Types.DeleteActivityOutput, AWSError>;
  /**
   * Deletes a state machine. This is an asynchronous operation: It sets the state machine's status to DELETING and begins the deletion process.  A qualified state machine ARN can either refer to a Distributed Map state defined within a state machine, a version ARN, or an alias ARN. The following are some examples of qualified and unqualified state machine ARNs:   The following qualified state machine ARN refers to a Distributed Map state with a label mapStateLabel in a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel   If you provide a qualified state machine ARN that refers to a Distributed Map state, the request fails with ValidationException.    The following unqualified state machine ARN refers to a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine    This API action also deletes all versions and aliases associated with a state machine.  For EXPRESS state machines, the deletion happens eventually (usually in less than a minute). Running executions may emit logs after DeleteStateMachine API is called. 
   */
  deleteStateMachine(params: StepFunctions.Types.DeleteStateMachineInput, callback?: (err: AWSError, data: StepFunctions.Types.DeleteStateMachineOutput) => void): Request<StepFunctions.Types.DeleteStateMachineOutput, AWSError>;
  /**
   * Deletes a state machine. This is an asynchronous operation: It sets the state machine's status to DELETING and begins the deletion process.  A qualified state machine ARN can either refer to a Distributed Map state defined within a state machine, a version ARN, or an alias ARN. The following are some examples of qualified and unqualified state machine ARNs:   The following qualified state machine ARN refers to a Distributed Map state with a label mapStateLabel in a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel   If you provide a qualified state machine ARN that refers to a Distributed Map state, the request fails with ValidationException.    The following unqualified state machine ARN refers to a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine    This API action also deletes all versions and aliases associated with a state machine.  For EXPRESS state machines, the deletion happens eventually (usually in less than a minute). Running executions may emit logs after DeleteStateMachine API is called. 
   */
  deleteStateMachine(callback?: (err: AWSError, data: StepFunctions.Types.DeleteStateMachineOutput) => void): Request<StepFunctions.Types.DeleteStateMachineOutput, AWSError>;
  /**
   * Deletes a state machine alias. After you delete a state machine alias, you can't use it to start executions. When you delete a state machine alias, Step Functions doesn't delete the state machine versions that alias references.  Related operations:     CreateStateMachineAlias     DescribeStateMachineAlias     ListStateMachineAliases     UpdateStateMachineAlias   
   */
  deleteStateMachineAlias(params: StepFunctions.Types.DeleteStateMachineAliasInput, callback?: (err: AWSError, data: StepFunctions.Types.DeleteStateMachineAliasOutput) => void): Request<StepFunctions.Types.DeleteStateMachineAliasOutput, AWSError>;
  /**
   * Deletes a state machine alias. After you delete a state machine alias, you can't use it to start executions. When you delete a state machine alias, Step Functions doesn't delete the state machine versions that alias references.  Related operations:     CreateStateMachineAlias     DescribeStateMachineAlias     ListStateMachineAliases     UpdateStateMachineAlias   
   */
  deleteStateMachineAlias(callback?: (err: AWSError, data: StepFunctions.Types.DeleteStateMachineAliasOutput) => void): Request<StepFunctions.Types.DeleteStateMachineAliasOutput, AWSError>;
  /**
   * Deletes a state machine version. After you delete a version, you can't call StartExecution using that version's ARN or use the version with a state machine alias.  Deleting a state machine version won't terminate its in-progress executions.   You can't delete a state machine version currently referenced by one or more aliases. Before you delete a version, you must either delete the aliases or update them to point to another state machine version.   Related operations:     PublishStateMachineVersion     ListStateMachineVersions   
   */
  deleteStateMachineVersion(params: StepFunctions.Types.DeleteStateMachineVersionInput, callback?: (err: AWSError, data: StepFunctions.Types.DeleteStateMachineVersionOutput) => void): Request<StepFunctions.Types.DeleteStateMachineVersionOutput, AWSError>;
  /**
   * Deletes a state machine version. After you delete a version, you can't call StartExecution using that version's ARN or use the version with a state machine alias.  Deleting a state machine version won't terminate its in-progress executions.   You can't delete a state machine version currently referenced by one or more aliases. Before you delete a version, you must either delete the aliases or update them to point to another state machine version.   Related operations:     PublishStateMachineVersion     ListStateMachineVersions   
   */
  deleteStateMachineVersion(callback?: (err: AWSError, data: StepFunctions.Types.DeleteStateMachineVersionOutput) => void): Request<StepFunctions.Types.DeleteStateMachineVersionOutput, AWSError>;
  /**
   * Describes an activity.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  describeActivity(params: StepFunctions.Types.DescribeActivityInput, callback?: (err: AWSError, data: StepFunctions.Types.DescribeActivityOutput) => void): Request<StepFunctions.Types.DescribeActivityOutput, AWSError>;
  /**
   * Describes an activity.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  describeActivity(callback?: (err: AWSError, data: StepFunctions.Types.DescribeActivityOutput) => void): Request<StepFunctions.Types.DescribeActivityOutput, AWSError>;
  /**
   * Provides information about a state machine execution, such as the state machine associated with the execution, the execution input and output, and relevant execution metadata. Use this API action to return the Map Run Amazon Resource Name (ARN) if the execution was dispatched by a Map Run. If you specify a version or alias ARN when you call the StartExecution API action, DescribeExecution returns that ARN.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.  Executions of an EXPRESS state machinearen't supported by DescribeExecution unless a Map Run dispatched them.
   */
  describeExecution(params: StepFunctions.Types.DescribeExecutionInput, callback?: (err: AWSError, data: StepFunctions.Types.DescribeExecutionOutput) => void): Request<StepFunctions.Types.DescribeExecutionOutput, AWSError>;
  /**
   * Provides information about a state machine execution, such as the state machine associated with the execution, the execution input and output, and relevant execution metadata. Use this API action to return the Map Run Amazon Resource Name (ARN) if the execution was dispatched by a Map Run. If you specify a version or alias ARN when you call the StartExecution API action, DescribeExecution returns that ARN.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.  Executions of an EXPRESS state machinearen't supported by DescribeExecution unless a Map Run dispatched them.
   */
  describeExecution(callback?: (err: AWSError, data: StepFunctions.Types.DescribeExecutionOutput) => void): Request<StepFunctions.Types.DescribeExecutionOutput, AWSError>;
  /**
   * Provides information about a Map Run's configuration, progress, and results. For more information, see Examining Map Run in the Step Functions Developer Guide.
   */
  describeMapRun(params: StepFunctions.Types.DescribeMapRunInput, callback?: (err: AWSError, data: StepFunctions.Types.DescribeMapRunOutput) => void): Request<StepFunctions.Types.DescribeMapRunOutput, AWSError>;
  /**
   * Provides information about a Map Run's configuration, progress, and results. For more information, see Examining Map Run in the Step Functions Developer Guide.
   */
  describeMapRun(callback?: (err: AWSError, data: StepFunctions.Types.DescribeMapRunOutput) => void): Request<StepFunctions.Types.DescribeMapRunOutput, AWSError>;
  /**
   * Provides information about a state machine's definition, its IAM role Amazon Resource Name (ARN), and configuration. A qualified state machine ARN can either refer to a Distributed Map state defined within a state machine, a version ARN, or an alias ARN. The following are some examples of qualified and unqualified state machine ARNs:   The following qualified state machine ARN refers to a Distributed Map state with a label mapStateLabel in a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel   If you provide a qualified state machine ARN that refers to a Distributed Map state, the request fails with ValidationException.    The following qualified state machine ARN refers to an alias named PROD.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine:PROD&gt;   If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.    The following unqualified state machine ARN refers to a state machine named myStateMachine.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine&gt;    This API action returns the details for a state machine version if the stateMachineArn you specify is a state machine version ARN.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  describeStateMachine(params: StepFunctions.Types.DescribeStateMachineInput, callback?: (err: AWSError, data: StepFunctions.Types.DescribeStateMachineOutput) => void): Request<StepFunctions.Types.DescribeStateMachineOutput, AWSError>;
  /**
   * Provides information about a state machine's definition, its IAM role Amazon Resource Name (ARN), and configuration. A qualified state machine ARN can either refer to a Distributed Map state defined within a state machine, a version ARN, or an alias ARN. The following are some examples of qualified and unqualified state machine ARNs:   The following qualified state machine ARN refers to a Distributed Map state with a label mapStateLabel in a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel   If you provide a qualified state machine ARN that refers to a Distributed Map state, the request fails with ValidationException.    The following qualified state machine ARN refers to an alias named PROD.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine:PROD&gt;   If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.    The following unqualified state machine ARN refers to a state machine named myStateMachine.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine&gt;    This API action returns the details for a state machine version if the stateMachineArn you specify is a state machine version ARN.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  describeStateMachine(callback?: (err: AWSError, data: StepFunctions.Types.DescribeStateMachineOutput) => void): Request<StepFunctions.Types.DescribeStateMachineOutput, AWSError>;
  /**
   * Returns details about a state machine alias.  Related operations:     CreateStateMachineAlias     ListStateMachineAliases     UpdateStateMachineAlias     DeleteStateMachineAlias   
   */
  describeStateMachineAlias(params: StepFunctions.Types.DescribeStateMachineAliasInput, callback?: (err: AWSError, data: StepFunctions.Types.DescribeStateMachineAliasOutput) => void): Request<StepFunctions.Types.DescribeStateMachineAliasOutput, AWSError>;
  /**
   * Returns details about a state machine alias.  Related operations:     CreateStateMachineAlias     ListStateMachineAliases     UpdateStateMachineAlias     DeleteStateMachineAlias   
   */
  describeStateMachineAlias(callback?: (err: AWSError, data: StepFunctions.Types.DescribeStateMachineAliasOutput) => void): Request<StepFunctions.Types.DescribeStateMachineAliasOutput, AWSError>;
  /**
   * Provides information about a state machine's definition, its execution role ARN, and configuration. If a Map Run dispatched the execution, this action returns the Map Run Amazon Resource Name (ARN) in the response. The state machine returned is the state machine associated with the Map Run.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.  This API action is not supported by EXPRESS state machines.
   */
  describeStateMachineForExecution(params: StepFunctions.Types.DescribeStateMachineForExecutionInput, callback?: (err: AWSError, data: StepFunctions.Types.DescribeStateMachineForExecutionOutput) => void): Request<StepFunctions.Types.DescribeStateMachineForExecutionOutput, AWSError>;
  /**
   * Provides information about a state machine's definition, its execution role ARN, and configuration. If a Map Run dispatched the execution, this action returns the Map Run Amazon Resource Name (ARN) in the response. The state machine returned is the state machine associated with the Map Run.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.  This API action is not supported by EXPRESS state machines.
   */
  describeStateMachineForExecution(callback?: (err: AWSError, data: StepFunctions.Types.DescribeStateMachineForExecutionOutput) => void): Request<StepFunctions.Types.DescribeStateMachineForExecutionOutput, AWSError>;
  /**
   * Used by workers to retrieve a task (with the specified activity ARN) which has been scheduled for execution by a running state machine. This initiates a long poll, where the service holds the HTTP connection open and responds as soon as a task becomes available (i.e. an execution of a task of this type is needed.) The maximum time the service holds on to the request before responding is 60 seconds. If no task is available within 60 seconds, the poll returns a taskToken with a null string.  This API action isn't logged in CloudTrail.   Workers should set their client side socket timeout to at least 65 seconds (5 seconds higher than the maximum time the service may hold the poll request). Polling with GetActivityTask can cause latency in some implementations. See Avoid Latency When Polling for Activity Tasks in the Step Functions Developer Guide. 
   */
  getActivityTask(params: StepFunctions.Types.GetActivityTaskInput, callback?: (err: AWSError, data: StepFunctions.Types.GetActivityTaskOutput) => void): Request<StepFunctions.Types.GetActivityTaskOutput, AWSError>;
  /**
   * Used by workers to retrieve a task (with the specified activity ARN) which has been scheduled for execution by a running state machine. This initiates a long poll, where the service holds the HTTP connection open and responds as soon as a task becomes available (i.e. an execution of a task of this type is needed.) The maximum time the service holds on to the request before responding is 60 seconds. If no task is available within 60 seconds, the poll returns a taskToken with a null string.  This API action isn't logged in CloudTrail.   Workers should set their client side socket timeout to at least 65 seconds (5 seconds higher than the maximum time the service may hold the poll request). Polling with GetActivityTask can cause latency in some implementations. See Avoid Latency When Polling for Activity Tasks in the Step Functions Developer Guide. 
   */
  getActivityTask(callback?: (err: AWSError, data: StepFunctions.Types.GetActivityTaskOutput) => void): Request<StepFunctions.Types.GetActivityTaskOutput, AWSError>;
  /**
   * Returns the history of the specified execution as a list of events. By default, the results are returned in ascending order of the timeStamp of the events. Use the reverseOrder parameter to get the latest events first. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error. This API action is not supported by EXPRESS state machines.
   */
  getExecutionHistory(params: StepFunctions.Types.GetExecutionHistoryInput, callback?: (err: AWSError, data: StepFunctions.Types.GetExecutionHistoryOutput) => void): Request<StepFunctions.Types.GetExecutionHistoryOutput, AWSError>;
  /**
   * Returns the history of the specified execution as a list of events. By default, the results are returned in ascending order of the timeStamp of the events. Use the reverseOrder parameter to get the latest events first. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error. This API action is not supported by EXPRESS state machines.
   */
  getExecutionHistory(callback?: (err: AWSError, data: StepFunctions.Types.GetExecutionHistoryOutput) => void): Request<StepFunctions.Types.GetExecutionHistoryOutput, AWSError>;
  /**
   * Lists the existing activities. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  listActivities(params: StepFunctions.Types.ListActivitiesInput, callback?: (err: AWSError, data: StepFunctions.Types.ListActivitiesOutput) => void): Request<StepFunctions.Types.ListActivitiesOutput, AWSError>;
  /**
   * Lists the existing activities. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  listActivities(callback?: (err: AWSError, data: StepFunctions.Types.ListActivitiesOutput) => void): Request<StepFunctions.Types.ListActivitiesOutput, AWSError>;
  /**
   * Lists all executions of a state machine or a Map Run. You can list all executions related to a state machine by specifying a state machine Amazon Resource Name (ARN), or those related to a Map Run by specifying a Map Run ARN. You can also provide a state machine alias ARN or version ARN to list the executions associated with a specific alias or version. Results are sorted by time, with the most recent execution first. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.  This API action is not supported by EXPRESS state machines.
   */
  listExecutions(params: StepFunctions.Types.ListExecutionsInput, callback?: (err: AWSError, data: StepFunctions.Types.ListExecutionsOutput) => void): Request<StepFunctions.Types.ListExecutionsOutput, AWSError>;
  /**
   * Lists all executions of a state machine or a Map Run. You can list all executions related to a state machine by specifying a state machine Amazon Resource Name (ARN), or those related to a Map Run by specifying a Map Run ARN. You can also provide a state machine alias ARN or version ARN to list the executions associated with a specific alias or version. Results are sorted by time, with the most recent execution first. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.  This API action is not supported by EXPRESS state machines.
   */
  listExecutions(callback?: (err: AWSError, data: StepFunctions.Types.ListExecutionsOutput) => void): Request<StepFunctions.Types.ListExecutionsOutput, AWSError>;
  /**
   * Lists all Map Runs that were started by a given state machine execution. Use this API action to obtain Map Run ARNs, and then call DescribeMapRun to obtain more information, if needed.
   */
  listMapRuns(params: StepFunctions.Types.ListMapRunsInput, callback?: (err: AWSError, data: StepFunctions.Types.ListMapRunsOutput) => void): Request<StepFunctions.Types.ListMapRunsOutput, AWSError>;
  /**
   * Lists all Map Runs that were started by a given state machine execution. Use this API action to obtain Map Run ARNs, and then call DescribeMapRun to obtain more information, if needed.
   */
  listMapRuns(callback?: (err: AWSError, data: StepFunctions.Types.ListMapRunsOutput) => void): Request<StepFunctions.Types.ListMapRunsOutput, AWSError>;
  /**
   * Lists aliases for a specified state machine ARN. Results are sorted by time, with the most recently created aliases listed first.  To list aliases that reference a state machine version, you can specify the version ARN in the stateMachineArn parameter. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  Related operations:     CreateStateMachineAlias     DescribeStateMachineAlias     UpdateStateMachineAlias     DeleteStateMachineAlias   
   */
  listStateMachineAliases(params: StepFunctions.Types.ListStateMachineAliasesInput, callback?: (err: AWSError, data: StepFunctions.Types.ListStateMachineAliasesOutput) => void): Request<StepFunctions.Types.ListStateMachineAliasesOutput, AWSError>;
  /**
   * Lists aliases for a specified state machine ARN. Results are sorted by time, with the most recently created aliases listed first.  To list aliases that reference a state machine version, you can specify the version ARN in the stateMachineArn parameter. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  Related operations:     CreateStateMachineAlias     DescribeStateMachineAlias     UpdateStateMachineAlias     DeleteStateMachineAlias   
   */
  listStateMachineAliases(callback?: (err: AWSError, data: StepFunctions.Types.ListStateMachineAliasesOutput) => void): Request<StepFunctions.Types.ListStateMachineAliasesOutput, AWSError>;
  /**
   * Lists versions for the specified state machine Amazon Resource Name (ARN). The results are sorted in descending order of the version creation time. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  Related operations:     PublishStateMachineVersion     DeleteStateMachineVersion   
   */
  listStateMachineVersions(params: StepFunctions.Types.ListStateMachineVersionsInput, callback?: (err: AWSError, data: StepFunctions.Types.ListStateMachineVersionsOutput) => void): Request<StepFunctions.Types.ListStateMachineVersionsOutput, AWSError>;
  /**
   * Lists versions for the specified state machine Amazon Resource Name (ARN). The results are sorted in descending order of the version creation time. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  Related operations:     PublishStateMachineVersion     DeleteStateMachineVersion   
   */
  listStateMachineVersions(callback?: (err: AWSError, data: StepFunctions.Types.ListStateMachineVersionsOutput) => void): Request<StepFunctions.Types.ListStateMachineVersionsOutput, AWSError>;
  /**
   * Lists the existing state machines. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  listStateMachines(params: StepFunctions.Types.ListStateMachinesInput, callback?: (err: AWSError, data: StepFunctions.Types.ListStateMachinesOutput) => void): Request<StepFunctions.Types.ListStateMachinesOutput, AWSError>;
  /**
   * Lists the existing state machines. If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  listStateMachines(callback?: (err: AWSError, data: StepFunctions.Types.ListStateMachinesOutput) => void): Request<StepFunctions.Types.ListStateMachinesOutput, AWSError>;
  /**
   * List tags for a given resource. Tags may only contain Unicode letters, digits, white space, or these symbols: _ . : / = + - @.
   */
  listTagsForResource(params: StepFunctions.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: StepFunctions.Types.ListTagsForResourceOutput) => void): Request<StepFunctions.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * List tags for a given resource. Tags may only contain Unicode letters, digits, white space, or these symbols: _ . : / = + - @.
   */
  listTagsForResource(callback?: (err: AWSError, data: StepFunctions.Types.ListTagsForResourceOutput) => void): Request<StepFunctions.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Creates a version from the current revision of a state machine. Use versions to create immutable snapshots of your state machine. You can start executions from versions either directly or with an alias. To create an alias, use CreateStateMachineAlias. You can publish up to 1000 versions for each state machine. You must manually delete unused versions using the DeleteStateMachineVersion API action.  PublishStateMachineVersion is an idempotent API. It doesn't create a duplicate state machine version if it already exists for the current revision. Step Functions bases PublishStateMachineVersion's idempotency check on the stateMachineArn, name, and revisionId parameters. Requests with the same parameters return a successful idempotent response. If you don't specify a revisionId, Step Functions checks for a previously published version of the state machine's current revision.  Related operations:     DeleteStateMachineVersion     ListStateMachineVersions   
   */
  publishStateMachineVersion(params: StepFunctions.Types.PublishStateMachineVersionInput, callback?: (err: AWSError, data: StepFunctions.Types.PublishStateMachineVersionOutput) => void): Request<StepFunctions.Types.PublishStateMachineVersionOutput, AWSError>;
  /**
   * Creates a version from the current revision of a state machine. Use versions to create immutable snapshots of your state machine. You can start executions from versions either directly or with an alias. To create an alias, use CreateStateMachineAlias. You can publish up to 1000 versions for each state machine. You must manually delete unused versions using the DeleteStateMachineVersion API action.  PublishStateMachineVersion is an idempotent API. It doesn't create a duplicate state machine version if it already exists for the current revision. Step Functions bases PublishStateMachineVersion's idempotency check on the stateMachineArn, name, and revisionId parameters. Requests with the same parameters return a successful idempotent response. If you don't specify a revisionId, Step Functions checks for a previously published version of the state machine's current revision.  Related operations:     DeleteStateMachineVersion     ListStateMachineVersions   
   */
  publishStateMachineVersion(callback?: (err: AWSError, data: StepFunctions.Types.PublishStateMachineVersionOutput) => void): Request<StepFunctions.Types.PublishStateMachineVersionOutput, AWSError>;
  /**
   * Used by activity workers and task states using the callback pattern to report that the task identified by the taskToken failed.
   */
  sendTaskFailure(params: StepFunctions.Types.SendTaskFailureInput, callback?: (err: AWSError, data: StepFunctions.Types.SendTaskFailureOutput) => void): Request<StepFunctions.Types.SendTaskFailureOutput, AWSError>;
  /**
   * Used by activity workers and task states using the callback pattern to report that the task identified by the taskToken failed.
   */
  sendTaskFailure(callback?: (err: AWSError, data: StepFunctions.Types.SendTaskFailureOutput) => void): Request<StepFunctions.Types.SendTaskFailureOutput, AWSError>;
  /**
   * Used by activity workers and task states using the callback pattern to report to Step Functions that the task represented by the specified taskToken is still making progress. This action resets the Heartbeat clock. The Heartbeat threshold is specified in the state machine's Amazon States Language definition (HeartbeatSeconds). This action does not in itself create an event in the execution history. However, if the task times out, the execution history contains an ActivityTimedOut entry for activities, or a TaskTimedOut entry for for tasks using the job run or callback pattern.  The Timeout of a task, defined in the state machine's Amazon States Language definition, is its maximum allowed duration, regardless of the number of SendTaskHeartbeat requests received. Use HeartbeatSeconds to configure the timeout interval for heartbeats. 
   */
  sendTaskHeartbeat(params: StepFunctions.Types.SendTaskHeartbeatInput, callback?: (err: AWSError, data: StepFunctions.Types.SendTaskHeartbeatOutput) => void): Request<StepFunctions.Types.SendTaskHeartbeatOutput, AWSError>;
  /**
   * Used by activity workers and task states using the callback pattern to report to Step Functions that the task represented by the specified taskToken is still making progress. This action resets the Heartbeat clock. The Heartbeat threshold is specified in the state machine's Amazon States Language definition (HeartbeatSeconds). This action does not in itself create an event in the execution history. However, if the task times out, the execution history contains an ActivityTimedOut entry for activities, or a TaskTimedOut entry for for tasks using the job run or callback pattern.  The Timeout of a task, defined in the state machine's Amazon States Language definition, is its maximum allowed duration, regardless of the number of SendTaskHeartbeat requests received. Use HeartbeatSeconds to configure the timeout interval for heartbeats. 
   */
  sendTaskHeartbeat(callback?: (err: AWSError, data: StepFunctions.Types.SendTaskHeartbeatOutput) => void): Request<StepFunctions.Types.SendTaskHeartbeatOutput, AWSError>;
  /**
   * Used by activity workers and task states using the callback pattern to report that the task identified by the taskToken completed successfully.
   */
  sendTaskSuccess(params: StepFunctions.Types.SendTaskSuccessInput, callback?: (err: AWSError, data: StepFunctions.Types.SendTaskSuccessOutput) => void): Request<StepFunctions.Types.SendTaskSuccessOutput, AWSError>;
  /**
   * Used by activity workers and task states using the callback pattern to report that the task identified by the taskToken completed successfully.
   */
  sendTaskSuccess(callback?: (err: AWSError, data: StepFunctions.Types.SendTaskSuccessOutput) => void): Request<StepFunctions.Types.SendTaskSuccessOutput, AWSError>;
  /**
   * Starts a state machine execution. A qualified state machine ARN can either refer to a Distributed Map state defined within a state machine, a version ARN, or an alias ARN. The following are some examples of qualified and unqualified state machine ARNs:   The following qualified state machine ARN refers to a Distributed Map state with a label mapStateLabel in a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel   If you provide a qualified state machine ARN that refers to a Distributed Map state, the request fails with ValidationException.    The following qualified state machine ARN refers to an alias named PROD.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine:PROD&gt;   If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.    The following unqualified state machine ARN refers to a state machine named myStateMachine.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine&gt;    If you start an execution with an unqualified state machine ARN, Step Functions uses the latest revision of the state machine for the execution. To start executions of a state machine version, call StartExecution and provide the version ARN or the ARN of an alias that points to the version.   StartExecution is idempotent for STANDARD workflows. For a STANDARD workflow, if you call StartExecution with the same name and input as a running execution, the call succeeds and return the same response as the original request. If the execution is closed or if the input is different, it returns a 400 ExecutionAlreadyExists error. You can reuse names after 90 days.   StartExecution isn't idempotent for EXPRESS workflows.  
   */
  startExecution(params: StepFunctions.Types.StartExecutionInput, callback?: (err: AWSError, data: StepFunctions.Types.StartExecutionOutput) => void): Request<StepFunctions.Types.StartExecutionOutput, AWSError>;
  /**
   * Starts a state machine execution. A qualified state machine ARN can either refer to a Distributed Map state defined within a state machine, a version ARN, or an alias ARN. The following are some examples of qualified and unqualified state machine ARNs:   The following qualified state machine ARN refers to a Distributed Map state with a label mapStateLabel in a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel   If you provide a qualified state machine ARN that refers to a Distributed Map state, the request fails with ValidationException.    The following qualified state machine ARN refers to an alias named PROD.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine:PROD&gt;   If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.    The following unqualified state machine ARN refers to a state machine named myStateMachine.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine&gt;    If you start an execution with an unqualified state machine ARN, Step Functions uses the latest revision of the state machine for the execution. To start executions of a state machine version, call StartExecution and provide the version ARN or the ARN of an alias that points to the version.   StartExecution is idempotent for STANDARD workflows. For a STANDARD workflow, if you call StartExecution with the same name and input as a running execution, the call succeeds and return the same response as the original request. If the execution is closed or if the input is different, it returns a 400 ExecutionAlreadyExists error. You can reuse names after 90 days.   StartExecution isn't idempotent for EXPRESS workflows.  
   */
  startExecution(callback?: (err: AWSError, data: StepFunctions.Types.StartExecutionOutput) => void): Request<StepFunctions.Types.StartExecutionOutput, AWSError>;
  /**
   * Starts a Synchronous Express state machine execution. StartSyncExecution is not available for STANDARD workflows.   StartSyncExecution will return a 200 OK response, even if your execution fails, because the status code in the API response doesn't reflect function errors. Error codes are reserved for errors that prevent your execution from running, such as permissions errors, limit errors, or issues with your state machine code and configuration.    This API action isn't logged in CloudTrail. 
   */
  startSyncExecution(params: StepFunctions.Types.StartSyncExecutionInput, callback?: (err: AWSError, data: StepFunctions.Types.StartSyncExecutionOutput) => void): Request<StepFunctions.Types.StartSyncExecutionOutput, AWSError>;
  /**
   * Starts a Synchronous Express state machine execution. StartSyncExecution is not available for STANDARD workflows.   StartSyncExecution will return a 200 OK response, even if your execution fails, because the status code in the API response doesn't reflect function errors. Error codes are reserved for errors that prevent your execution from running, such as permissions errors, limit errors, or issues with your state machine code and configuration.    This API action isn't logged in CloudTrail. 
   */
  startSyncExecution(callback?: (err: AWSError, data: StepFunctions.Types.StartSyncExecutionOutput) => void): Request<StepFunctions.Types.StartSyncExecutionOutput, AWSError>;
  /**
   * Stops an execution. This API action is not supported by EXPRESS state machines.
   */
  stopExecution(params: StepFunctions.Types.StopExecutionInput, callback?: (err: AWSError, data: StepFunctions.Types.StopExecutionOutput) => void): Request<StepFunctions.Types.StopExecutionOutput, AWSError>;
  /**
   * Stops an execution. This API action is not supported by EXPRESS state machines.
   */
  stopExecution(callback?: (err: AWSError, data: StepFunctions.Types.StopExecutionOutput) => void): Request<StepFunctions.Types.StopExecutionOutput, AWSError>;
  /**
   * Add a tag to a Step Functions resource. An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide, and Controlling Access Using IAM Tags. Tags may only contain Unicode letters, digits, white space, or these symbols: _ . : / = + - @.
   */
  tagResource(params: StepFunctions.Types.TagResourceInput, callback?: (err: AWSError, data: StepFunctions.Types.TagResourceOutput) => void): Request<StepFunctions.Types.TagResourceOutput, AWSError>;
  /**
   * Add a tag to a Step Functions resource. An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide, and Controlling Access Using IAM Tags. Tags may only contain Unicode letters, digits, white space, or these symbols: _ . : / = + - @.
   */
  tagResource(callback?: (err: AWSError, data: StepFunctions.Types.TagResourceOutput) => void): Request<StepFunctions.Types.TagResourceOutput, AWSError>;
  /**
   * Remove a tag from a Step Functions resource
   */
  untagResource(params: StepFunctions.Types.UntagResourceInput, callback?: (err: AWSError, data: StepFunctions.Types.UntagResourceOutput) => void): Request<StepFunctions.Types.UntagResourceOutput, AWSError>;
  /**
   * Remove a tag from a Step Functions resource
   */
  untagResource(callback?: (err: AWSError, data: StepFunctions.Types.UntagResourceOutput) => void): Request<StepFunctions.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates an in-progress Map Run's configuration to include changes to the settings that control maximum concurrency and Map Run failure.
   */
  updateMapRun(params: StepFunctions.Types.UpdateMapRunInput, callback?: (err: AWSError, data: StepFunctions.Types.UpdateMapRunOutput) => void): Request<StepFunctions.Types.UpdateMapRunOutput, AWSError>;
  /**
   * Updates an in-progress Map Run's configuration to include changes to the settings that control maximum concurrency and Map Run failure.
   */
  updateMapRun(callback?: (err: AWSError, data: StepFunctions.Types.UpdateMapRunOutput) => void): Request<StepFunctions.Types.UpdateMapRunOutput, AWSError>;
  /**
   * Updates an existing state machine by modifying its definition, roleArn, or loggingConfiguration. Running executions will continue to use the previous definition and roleArn. You must include at least one of definition or roleArn or you will receive a MissingRequiredParameter error. A qualified state machine ARN refers to a Distributed Map state defined within a state machine. For example, the qualified state machine ARN arn:partition:states:region:account-id:stateMachine:stateMachineName/mapStateLabel refers to a Distributed Map state with a label mapStateLabel in the state machine named stateMachineName. A qualified state machine ARN can either refer to a Distributed Map state defined within a state machine, a version ARN, or an alias ARN. The following are some examples of qualified and unqualified state machine ARNs:   The following qualified state machine ARN refers to a Distributed Map state with a label mapStateLabel in a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel   If you provide a qualified state machine ARN that refers to a Distributed Map state, the request fails with ValidationException.    The following qualified state machine ARN refers to an alias named PROD.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine:PROD&gt;   If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.    The following unqualified state machine ARN refers to a state machine named myStateMachine.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine&gt;    After you update your state machine, you can set the publish parameter to true in the same action to publish a new version. This way, you can opt-in to strict versioning of your state machine.  Step Functions assigns monotonically increasing integers for state machine versions, starting at version number 1.   All StartExecution calls within a few seconds use the updated definition and roleArn. Executions started immediately after you call UpdateStateMachine may use the previous state machine definition and roleArn.  
   */
  updateStateMachine(params: StepFunctions.Types.UpdateStateMachineInput, callback?: (err: AWSError, data: StepFunctions.Types.UpdateStateMachineOutput) => void): Request<StepFunctions.Types.UpdateStateMachineOutput, AWSError>;
  /**
   * Updates an existing state machine by modifying its definition, roleArn, or loggingConfiguration. Running executions will continue to use the previous definition and roleArn. You must include at least one of definition or roleArn or you will receive a MissingRequiredParameter error. A qualified state machine ARN refers to a Distributed Map state defined within a state machine. For example, the qualified state machine ARN arn:partition:states:region:account-id:stateMachine:stateMachineName/mapStateLabel refers to a Distributed Map state with a label mapStateLabel in the state machine named stateMachineName. A qualified state machine ARN can either refer to a Distributed Map state defined within a state machine, a version ARN, or an alias ARN. The following are some examples of qualified and unqualified state machine ARNs:   The following qualified state machine ARN refers to a Distributed Map state with a label mapStateLabel in a state machine named myStateMachine.  arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel   If you provide a qualified state machine ARN that refers to a Distributed Map state, the request fails with ValidationException.    The following qualified state machine ARN refers to an alias named PROD.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine:PROD&gt;   If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.    The following unqualified state machine ARN refers to a state machine named myStateMachine.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine&gt;    After you update your state machine, you can set the publish parameter to true in the same action to publish a new version. This way, you can opt-in to strict versioning of your state machine.  Step Functions assigns monotonically increasing integers for state machine versions, starting at version number 1.   All StartExecution calls within a few seconds use the updated definition and roleArn. Executions started immediately after you call UpdateStateMachine may use the previous state machine definition and roleArn.  
   */
  updateStateMachine(callback?: (err: AWSError, data: StepFunctions.Types.UpdateStateMachineOutput) => void): Request<StepFunctions.Types.UpdateStateMachineOutput, AWSError>;
  /**
   * Updates the configuration of an existing state machine alias by modifying its description or routingConfiguration. You must specify at least one of the description or routingConfiguration parameters to update a state machine alias.   UpdateStateMachineAlias is an idempotent API. Step Functions bases the idempotency check on the stateMachineAliasArn, description, and routingConfiguration parameters. Requests with the same parameters return an idempotent response.   This operation is eventually consistent. All StartExecution requests made within a few seconds use the latest alias configuration. Executions started immediately after calling UpdateStateMachineAlias may use the previous routing configuration.   Related operations:     CreateStateMachineAlias     DescribeStateMachineAlias     ListStateMachineAliases     DeleteStateMachineAlias   
   */
  updateStateMachineAlias(params: StepFunctions.Types.UpdateStateMachineAliasInput, callback?: (err: AWSError, data: StepFunctions.Types.UpdateStateMachineAliasOutput) => void): Request<StepFunctions.Types.UpdateStateMachineAliasOutput, AWSError>;
  /**
   * Updates the configuration of an existing state machine alias by modifying its description or routingConfiguration. You must specify at least one of the description or routingConfiguration parameters to update a state machine alias.   UpdateStateMachineAlias is an idempotent API. Step Functions bases the idempotency check on the stateMachineAliasArn, description, and routingConfiguration parameters. Requests with the same parameters return an idempotent response.   This operation is eventually consistent. All StartExecution requests made within a few seconds use the latest alias configuration. Executions started immediately after calling UpdateStateMachineAlias may use the previous routing configuration.   Related operations:     CreateStateMachineAlias     DescribeStateMachineAlias     ListStateMachineAliases     DeleteStateMachineAlias   
   */
  updateStateMachineAlias(callback?: (err: AWSError, data: StepFunctions.Types.UpdateStateMachineAliasOutput) => void): Request<StepFunctions.Types.UpdateStateMachineAliasOutput, AWSError>;
}
declare namespace StepFunctions {
  export interface ActivityFailedEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export type ActivityList = ActivityListItem[];
  export interface ActivityListItem {
    /**
     * The Amazon Resource Name (ARN) that identifies the activity.
     */
    activityArn: Arn;
    /**
     * The name of the activity. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name: Name;
    /**
     * The date the activity is created.
     */
    creationDate: Timestamp;
  }
  export interface ActivityScheduleFailedEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface ActivityScheduledEventDetails {
    /**
     * The Amazon Resource Name (ARN) of the scheduled activity.
     */
    resource: Arn;
    /**
     * The JSON data input to the activity task. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveData;
    /**
     * Contains details about the input for an execution history event.
     */
    inputDetails?: HistoryEventExecutionDataDetails;
    /**
     * The maximum allowed duration of the activity task.
     */
    timeoutInSeconds?: TimeoutInSeconds;
    /**
     * The maximum allowed duration between two heartbeats for the activity task.
     */
    heartbeatInSeconds?: TimeoutInSeconds;
  }
  export interface ActivityStartedEventDetails {
    /**
     * The name of the worker that the task is assigned to. These names are provided by the workers when calling GetActivityTask.
     */
    workerName?: Identity;
  }
  export interface ActivitySucceededEventDetails {
    /**
     * The JSON data output by the activity task. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    output?: SensitiveData;
    /**
     * Contains details about the output of an execution history event.
     */
    outputDetails?: HistoryEventExecutionDataDetails;
  }
  export interface ActivityTimedOutEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the timeout.
     */
    cause?: SensitiveCause;
  }
  export type AliasDescription = string;
  export type Arn = string;
  export type BilledDuration = number;
  export type BilledMemoryUsed = number;
  export interface BillingDetails {
    /**
     * Billed memory consumption of your workflow, in MB.
     */
    billedMemoryUsedInMB?: BilledMemoryUsed;
    /**
     * Billed duration of your workflow, in milliseconds.
     */
    billedDurationInMilliseconds?: BilledDuration;
  }
  export type CharacterRestrictedName = string;
  export interface CloudWatchEventsExecutionDataDetails {
    /**
     * Indicates whether input or output was included in the response. Always true for API calls. 
     */
    included?: includedDetails;
  }
  export interface CloudWatchLogsLogGroup {
    /**
     * The ARN of the the CloudWatch log group to which you want your logs emitted to. The ARN must end with :* 
     */
    logGroupArn?: Arn;
  }
  export type ConnectorParameters = string;
  export interface CreateActivityInput {
    /**
     * The name of the activity to create. This name must be unique for your Amazon Web Services account and region for 90 days. For more information, see  Limits Related to State Machine Executions in the Step Functions Developer Guide. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name: Name;
    /**
     * The list of tags to add to a resource. An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide, and Controlling Access Using IAM Tags. Tags may only contain Unicode letters, digits, white space, or these symbols: _ . : / = + - @.
     */
    tags?: TagList;
  }
  export interface CreateActivityOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies the created activity.
     */
    activityArn: Arn;
    /**
     * The date the activity is created.
     */
    creationDate: Timestamp;
  }
  export interface CreateStateMachineAliasInput {
    /**
     * A description for the state machine alias.
     */
    description?: AliasDescription;
    /**
     * The name of the state machine alias. To avoid conflict with version ARNs, don't use an integer in the name of the alias.
     */
    name: CharacterRestrictedName;
    /**
     * The routing configuration of a state machine alias. The routing configuration shifts execution traffic between two state machine versions. routingConfiguration contains an array of RoutingConfig objects that specify up to two state machine versions. Step Functions then randomly choses which version to run an execution with based on the weight assigned to each RoutingConfig.
     */
    routingConfiguration: RoutingConfigurationList;
  }
  export interface CreateStateMachineAliasOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies the created state machine alias.
     */
    stateMachineAliasArn: Arn;
    /**
     * The date the state machine alias was created.
     */
    creationDate: Timestamp;
  }
  export interface CreateStateMachineInput {
    /**
     * The name of the state machine.  A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name: Name;
    /**
     * The Amazon States Language definition of the state machine. See Amazon States Language.
     */
    definition: Definition;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to use for this state machine.
     */
    roleArn: Arn;
    /**
     * Determines whether a Standard or Express state machine is created. The default is STANDARD. You cannot update the type of a state machine once it has been created.
     */
    type?: StateMachineType;
    /**
     * Defines what execution history events are logged and where they are logged.  By default, the level is set to OFF. For more information see Log Levels in the Step Functions User Guide. 
     */
    loggingConfiguration?: LoggingConfiguration;
    /**
     * Tags to be added when creating a state machine. An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide, and Controlling Access Using IAM Tags. Tags may only contain Unicode letters, digits, white space, or these symbols: _ . : / = + - @.
     */
    tags?: TagList;
    /**
     * Selects whether X-Ray tracing is enabled.
     */
    tracingConfiguration?: TracingConfiguration;
    /**
     * Set to true to publish the first version of the state machine during creation. The default is false.
     */
    publish?: Publish;
    /**
     * Sets description about the state machine version. You can only set the description if the publish parameter is set to true. Otherwise, if you set versionDescription, but publish to false, this API action throws ValidationException.
     */
    versionDescription?: VersionDescription;
  }
  export interface CreateStateMachineOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies the created state machine.
     */
    stateMachineArn: Arn;
    /**
     * The date the state machine is created.
     */
    creationDate: Timestamp;
    /**
     * The Amazon Resource Name (ARN) that identifies the created state machine version. If you do not set the publish parameter to true, this field returns null value.
     */
    stateMachineVersionArn?: Arn;
  }
  export type Definition = string;
  export interface DeleteActivityInput {
    /**
     * The Amazon Resource Name (ARN) of the activity to delete.
     */
    activityArn: Arn;
  }
  export interface DeleteActivityOutput {
  }
  export interface DeleteStateMachineAliasInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine alias to delete.
     */
    stateMachineAliasArn: Arn;
  }
  export interface DeleteStateMachineAliasOutput {
  }
  export interface DeleteStateMachineInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine to delete.
     */
    stateMachineArn: Arn;
  }
  export interface DeleteStateMachineOutput {
  }
  export interface DeleteStateMachineVersionInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine version to delete.
     */
    stateMachineVersionArn: LongArn;
  }
  export interface DeleteStateMachineVersionOutput {
  }
  export interface DescribeActivityInput {
    /**
     * The Amazon Resource Name (ARN) of the activity to describe.
     */
    activityArn: Arn;
  }
  export interface DescribeActivityOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies the activity.
     */
    activityArn: Arn;
    /**
     * The name of the activity. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name: Name;
    /**
     * The date the activity is created.
     */
    creationDate: Timestamp;
  }
  export interface DescribeExecutionInput {
    /**
     * The Amazon Resource Name (ARN) of the execution to describe.
     */
    executionArn: Arn;
  }
  export interface DescribeExecutionOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies the execution.
     */
    executionArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the executed stated machine.
     */
    stateMachineArn: Arn;
    /**
     * The name of the execution. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name?: Name;
    /**
     * The current status of the execution.
     */
    status: ExecutionStatus;
    /**
     * The date the execution is started.
     */
    startDate: Timestamp;
    /**
     * If the execution ended, the date the execution stopped.
     */
    stopDate?: Timestamp;
    /**
     * The string that contains the JSON input data of the execution. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveData;
    inputDetails?: CloudWatchEventsExecutionDataDetails;
    /**
     * The JSON output data of the execution. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.  This field is set only if the execution succeeds. If the execution fails, this field is null. 
     */
    output?: SensitiveData;
    outputDetails?: CloudWatchEventsExecutionDataDetails;
    /**
     * The X-Ray trace header that was passed to the execution.
     */
    traceHeader?: TraceHeader;
    /**
     * The Amazon Resource Name (ARN) that identifies a Map Run, which dispatched this execution.
     */
    mapRunArn?: LongArn;
    /**
     * The error string if the state machine execution failed.
     */
    error?: SensitiveError;
    /**
     * The cause string if the state machine execution failed.
     */
    cause?: SensitiveCause;
    /**
     * The Amazon Resource Name (ARN) of the state machine version associated with the execution. The version ARN is a combination of state machine ARN and the version number separated by a colon (:). For example, stateMachineARN:1. If you start an execution from a StartExecution request without specifying a state machine version or alias ARN, Step Functions returns a null value.
     */
    stateMachineVersionArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the state machine alias associated with the execution. The alias ARN is a combination of state machine ARN and the alias name separated by a colon (:). For example, stateMachineARN:PROD. If you start an execution from a StartExecution request with a state machine version ARN, this field will be null.
     */
    stateMachineAliasArn?: Arn;
  }
  export interface DescribeMapRunInput {
    /**
     * The Amazon Resource Name (ARN) that identifies a Map Run.
     */
    mapRunArn: LongArn;
  }
  export interface DescribeMapRunOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies a Map Run.
     */
    mapRunArn: LongArn;
    /**
     * The Amazon Resource Name (ARN) that identifies the execution in which the Map Run was started.
     */
    executionArn: Arn;
    /**
     * The current status of the Map Run.
     */
    status: MapRunStatus;
    /**
     * The date when the Map Run was started.
     */
    startDate: Timestamp;
    /**
     * The date when the Map Run was stopped.
     */
    stopDate?: Timestamp;
    /**
     * The maximum number of child workflow executions configured to run in parallel for the Map Run at the same time.
     */
    maxConcurrency: MaxConcurrency;
    /**
     * The maximum percentage of failed child workflow executions before the Map Run fails.
     */
    toleratedFailurePercentage: ToleratedFailurePercentage;
    /**
     * The maximum number of failed child workflow executions before the Map Run fails.
     */
    toleratedFailureCount: ToleratedFailureCount;
    /**
     * A JSON object that contains information about the total number of items, and the item count for each processing status, such as pending and failed.
     */
    itemCounts: MapRunItemCounts;
    /**
     * A JSON object that contains information about the total number of child workflow executions for the Map Run, and the count of child workflow executions for each status, such as failed and succeeded.
     */
    executionCounts: MapRunExecutionCounts;
  }
  export interface DescribeStateMachineAliasInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine alias.
     */
    stateMachineAliasArn: Arn;
  }
  export interface DescribeStateMachineAliasOutput {
    /**
     * The Amazon Resource Name (ARN) of the state machine alias.
     */
    stateMachineAliasArn?: Arn;
    /**
     * The name of the state machine alias.
     */
    name?: Name;
    /**
     * A description of the alias.
     */
    description?: AliasDescription;
    /**
     * The routing configuration of the alias.
     */
    routingConfiguration?: RoutingConfigurationList;
    /**
     * The date the state machine alias was created.
     */
    creationDate?: Timestamp;
    /**
     * The date the state machine alias was last updated. For a newly created state machine, this is the same as the creation date.
     */
    updateDate?: Timestamp;
  }
  export interface DescribeStateMachineForExecutionInput {
    /**
     * The Amazon Resource Name (ARN) of the execution you want state machine information for.
     */
    executionArn: Arn;
  }
  export interface DescribeStateMachineForExecutionOutput {
    /**
     * The Amazon Resource Name (ARN) of the state machine associated with the execution.
     */
    stateMachineArn: Arn;
    /**
     * The name of the state machine associated with the execution.
     */
    name: Name;
    /**
     * The Amazon States Language definition of the state machine. See Amazon States Language.
     */
    definition: Definition;
    /**
     * The Amazon Resource Name (ARN) of the IAM role of the State Machine for the execution. 
     */
    roleArn: Arn;
    /**
     * The date and time the state machine associated with an execution was updated. For a newly created state machine, this is the creation date.
     */
    updateDate: Timestamp;
    loggingConfiguration?: LoggingConfiguration;
    /**
     * Selects whether X-Ray tracing is enabled.
     */
    tracingConfiguration?: TracingConfiguration;
    /**
     * The Amazon Resource Name (ARN) of the Map Run that started the child workflow execution. This field is returned only if the executionArn is a child workflow execution that was started by a Distributed Map state.
     */
    mapRunArn?: LongArn;
    /**
     * A user-defined or an auto-generated string that identifies a Map state. This ﬁeld is returned only if the executionArn is a child workflow execution that was started by a Distributed Map state.
     */
    label?: MapRunLabel;
    /**
     * The revision identifier for the state machine. The first revision ID when you create the state machine is null. Use the state machine revisionId parameter to compare the revision of a state machine with the configuration of the state machine used for executions without performing a diff of the properties, such as definition and roleArn.
     */
    revisionId?: RevisionId;
  }
  export interface DescribeStateMachineInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine for which you want the information. If you specify a state machine version ARN, this API returns details about that version. The version ARN is a combination of state machine ARN and the version number separated by a colon (:). For example, stateMachineARN:1.
     */
    stateMachineArn: Arn;
  }
  export interface DescribeStateMachineOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies the state machine. If you specified a state machine version ARN in your request, the API returns the version ARN. The version ARN is a combination of state machine ARN and the version number separated by a colon (:). For example, stateMachineARN:1.
     */
    stateMachineArn: Arn;
    /**
     * The name of the state machine. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name: Name;
    /**
     * The current status of the state machine.
     */
    status?: StateMachineStatus;
    /**
     * The Amazon States Language definition of the state machine. See Amazon States Language.
     */
    definition: Definition;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used when creating this state machine. (The IAM role maintains security by granting Step Functions access to Amazon Web Services resources.)
     */
    roleArn: Arn;
    /**
     * The type of the state machine (STANDARD or EXPRESS).
     */
    type: StateMachineType;
    /**
     * The date the state machine is created. For a state machine version, creationDate is the date the version was created.
     */
    creationDate: Timestamp;
    loggingConfiguration?: LoggingConfiguration;
    /**
     * Selects whether X-Ray tracing is enabled.
     */
    tracingConfiguration?: TracingConfiguration;
    /**
     * A user-defined or an auto-generated string that identifies a Map state. This parameter is present only if the stateMachineArn specified in input is a qualified state machine ARN.
     */
    label?: MapRunLabel;
    /**
     * The revision identifier for the state machine. Use the revisionId parameter to compare between versions of a state machine configuration used for executions without performing a diff of the properties, such as definition and roleArn.
     */
    revisionId?: RevisionId;
    /**
     * The description of the state machine version.
     */
    description?: VersionDescription;
  }
  export type Enabled = boolean;
  export type EventId = number;
  export interface ExecutionAbortedEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface ExecutionFailedEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export type ExecutionList = ExecutionListItem[];
  export interface ExecutionListItem {
    /**
     * The Amazon Resource Name (ARN) that identifies the execution.
     */
    executionArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the state machine that ran the execution.
     */
    stateMachineArn: Arn;
    /**
     * The name of the execution. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name: Name;
    /**
     * The current status of the execution.
     */
    status: ExecutionStatus;
    /**
     * The date the execution started.
     */
    startDate: Timestamp;
    /**
     * If the execution already ended, the date the execution stopped.
     */
    stopDate?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of a Map Run. This field is returned only if mapRunArn was specified in the ListExecutions API action. If stateMachineArn was specified in ListExecutions, the mapRunArn isn't returned.
     */
    mapRunArn?: LongArn;
    /**
     * The total number of items processed in a child workflow execution. This field is returned only if mapRunArn was specified in the ListExecutions API action. If stateMachineArn was specified in ListExecutions, the itemCount field isn't returned.
     */
    itemCount?: UnsignedInteger;
    /**
     * The Amazon Resource Name (ARN) of the state machine version associated with the execution. If the state machine execution was started with an unqualified ARN, it returns null. If the execution was started using a stateMachineAliasArn, both the stateMachineAliasArn and stateMachineVersionArn parameters contain the respective values.
     */
    stateMachineVersionArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the state machine alias used to start an execution. If the state machine execution was started with an unqualified ARN or a version ARN, it returns null.
     */
    stateMachineAliasArn?: Arn;
  }
  export interface ExecutionStartedEventDetails {
    /**
     * The JSON data input to the execution. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveData;
    /**
     * Contains details about the input for an execution history event.
     */
    inputDetails?: HistoryEventExecutionDataDetails;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used for executing Lambda tasks.
     */
    roleArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) that identifies a state machine alias used for starting the state machine execution.
     */
    stateMachineAliasArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) that identifies a state machine version used for starting the state machine execution.
     */
    stateMachineVersionArn?: Arn;
  }
  export type ExecutionStatus = "RUNNING"|"SUCCEEDED"|"FAILED"|"TIMED_OUT"|"ABORTED"|string;
  export interface ExecutionSucceededEventDetails {
    /**
     * The JSON data output by the execution. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    output?: SensitiveData;
    /**
     * Contains details about the output of an execution history event.
     */
    outputDetails?: HistoryEventExecutionDataDetails;
  }
  export interface ExecutionTimedOutEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the timeout.
     */
    cause?: SensitiveCause;
  }
  export interface GetActivityTaskInput {
    /**
     * The Amazon Resource Name (ARN) of the activity to retrieve tasks from (assigned when you create the task using CreateActivity.)
     */
    activityArn: Arn;
    /**
     * You can provide an arbitrary name in order to identify the worker that the task is assigned to. This name is used when it is logged in the execution history.
     */
    workerName?: Name;
  }
  export interface GetActivityTaskOutput {
    /**
     * A token that identifies the scheduled task. This token must be copied and included in subsequent calls to SendTaskHeartbeat, SendTaskSuccess or SendTaskFailure in order to report the progress or completion of the task.
     */
    taskToken?: TaskToken;
    /**
     * The string that contains the JSON input data for the task. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveDataJobInput;
  }
  export interface GetExecutionHistoryInput {
    /**
     * The Amazon Resource Name (ARN) of the execution.
     */
    executionArn: Arn;
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. The default is 100 and the maximum allowed page size is 1000. A value of 0 uses the default. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: PageSize;
    /**
     * Lists events in descending order of their timeStamp.
     */
    reverseOrder?: ReverseOrder;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
    /**
     * You can select whether execution data (input or output of a history event) is returned. The default is true.
     */
    includeExecutionData?: IncludeExecutionDataGetExecutionHistory;
  }
  export interface GetExecutionHistoryOutput {
    /**
     * The list of events that occurred in the execution.
     */
    events: HistoryEventList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface HistoryEvent {
    /**
     * The date and time the event occurred.
     */
    timestamp: Timestamp;
    /**
     * The type of the event.
     */
    type: HistoryEventType;
    /**
     * The id of the event. Events are numbered sequentially, starting at one.
     */
    id: EventId;
    /**
     * The id of the previous event.
     */
    previousEventId?: EventId;
    activityFailedEventDetails?: ActivityFailedEventDetails;
    /**
     * Contains details about an activity schedule event that failed during an execution.
     */
    activityScheduleFailedEventDetails?: ActivityScheduleFailedEventDetails;
    activityScheduledEventDetails?: ActivityScheduledEventDetails;
    activityStartedEventDetails?: ActivityStartedEventDetails;
    activitySucceededEventDetails?: ActivitySucceededEventDetails;
    activityTimedOutEventDetails?: ActivityTimedOutEventDetails;
    /**
     * Contains details about the failure of a task.
     */
    taskFailedEventDetails?: TaskFailedEventDetails;
    /**
     * Contains details about a task that was scheduled.
     */
    taskScheduledEventDetails?: TaskScheduledEventDetails;
    /**
     * Contains details about a task that failed to start.
     */
    taskStartFailedEventDetails?: TaskStartFailedEventDetails;
    /**
     * Contains details about a task that was started.
     */
    taskStartedEventDetails?: TaskStartedEventDetails;
    /**
     * Contains details about a task that where the submit failed.
     */
    taskSubmitFailedEventDetails?: TaskSubmitFailedEventDetails;
    /**
     * Contains details about a submitted task.
     */
    taskSubmittedEventDetails?: TaskSubmittedEventDetails;
    /**
     * Contains details about a task that succeeded.
     */
    taskSucceededEventDetails?: TaskSucceededEventDetails;
    /**
     * Contains details about a task that timed out.
     */
    taskTimedOutEventDetails?: TaskTimedOutEventDetails;
    executionFailedEventDetails?: ExecutionFailedEventDetails;
    executionStartedEventDetails?: ExecutionStartedEventDetails;
    executionSucceededEventDetails?: ExecutionSucceededEventDetails;
    executionAbortedEventDetails?: ExecutionAbortedEventDetails;
    executionTimedOutEventDetails?: ExecutionTimedOutEventDetails;
    /**
     * Contains details about Map state that was started.
     */
    mapStateStartedEventDetails?: MapStateStartedEventDetails;
    /**
     * Contains details about an iteration of a Map state that was started.
     */
    mapIterationStartedEventDetails?: MapIterationEventDetails;
    /**
     * Contains details about an iteration of a Map state that succeeded.
     */
    mapIterationSucceededEventDetails?: MapIterationEventDetails;
    /**
     * Contains details about an iteration of a Map state that failed.
     */
    mapIterationFailedEventDetails?: MapIterationEventDetails;
    /**
     * Contains details about an iteration of a Map state that was aborted.
     */
    mapIterationAbortedEventDetails?: MapIterationEventDetails;
    lambdaFunctionFailedEventDetails?: LambdaFunctionFailedEventDetails;
    lambdaFunctionScheduleFailedEventDetails?: LambdaFunctionScheduleFailedEventDetails;
    lambdaFunctionScheduledEventDetails?: LambdaFunctionScheduledEventDetails;
    /**
     * Contains details about a lambda function that failed to start during an execution.
     */
    lambdaFunctionStartFailedEventDetails?: LambdaFunctionStartFailedEventDetails;
    /**
     * Contains details about a Lambda function that terminated successfully during an execution.
     */
    lambdaFunctionSucceededEventDetails?: LambdaFunctionSucceededEventDetails;
    lambdaFunctionTimedOutEventDetails?: LambdaFunctionTimedOutEventDetails;
    stateEnteredEventDetails?: StateEnteredEventDetails;
    stateExitedEventDetails?: StateExitedEventDetails;
    /**
     * Contains details, such as mapRunArn, and the start date and time of a Map Run. mapRunArn is the Amazon Resource Name (ARN) of the Map Run that was started.
     */
    mapRunStartedEventDetails?: MapRunStartedEventDetails;
    /**
     * Contains error and cause details about a Map Run that failed.
     */
    mapRunFailedEventDetails?: MapRunFailedEventDetails;
  }
  export interface HistoryEventExecutionDataDetails {
    /**
     * Indicates whether input or output was truncated in the response. Always false for API calls.
     */
    truncated?: truncated;
  }
  export type HistoryEventList = HistoryEvent[];
  export type HistoryEventType = "ActivityFailed"|"ActivityScheduled"|"ActivityScheduleFailed"|"ActivityStarted"|"ActivitySucceeded"|"ActivityTimedOut"|"ChoiceStateEntered"|"ChoiceStateExited"|"ExecutionAborted"|"ExecutionFailed"|"ExecutionStarted"|"ExecutionSucceeded"|"ExecutionTimedOut"|"FailStateEntered"|"LambdaFunctionFailed"|"LambdaFunctionScheduled"|"LambdaFunctionScheduleFailed"|"LambdaFunctionStarted"|"LambdaFunctionStartFailed"|"LambdaFunctionSucceeded"|"LambdaFunctionTimedOut"|"MapIterationAborted"|"MapIterationFailed"|"MapIterationStarted"|"MapIterationSucceeded"|"MapStateAborted"|"MapStateEntered"|"MapStateExited"|"MapStateFailed"|"MapStateStarted"|"MapStateSucceeded"|"ParallelStateAborted"|"ParallelStateEntered"|"ParallelStateExited"|"ParallelStateFailed"|"ParallelStateStarted"|"ParallelStateSucceeded"|"PassStateEntered"|"PassStateExited"|"SucceedStateEntered"|"SucceedStateExited"|"TaskFailed"|"TaskScheduled"|"TaskStarted"|"TaskStartFailed"|"TaskStateAborted"|"TaskStateEntered"|"TaskStateExited"|"TaskSubmitFailed"|"TaskSubmitted"|"TaskSucceeded"|"TaskTimedOut"|"WaitStateAborted"|"WaitStateEntered"|"WaitStateExited"|"MapRunAborted"|"MapRunFailed"|"MapRunStarted"|"MapRunSucceeded"|string;
  export type Identity = string;
  export type IncludeExecutionData = boolean;
  export type IncludeExecutionDataGetExecutionHistory = boolean;
  export interface LambdaFunctionFailedEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface LambdaFunctionScheduleFailedEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface LambdaFunctionScheduledEventDetails {
    /**
     * The Amazon Resource Name (ARN) of the scheduled Lambda function.
     */
    resource: Arn;
    /**
     * The JSON data input to the Lambda function. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveData;
    /**
     * Contains details about input for an execution history event.
     */
    inputDetails?: HistoryEventExecutionDataDetails;
    /**
     * The maximum allowed duration of the Lambda function.
     */
    timeoutInSeconds?: TimeoutInSeconds;
    /**
     * The credentials that Step Functions uses for the task.
     */
    taskCredentials?: TaskCredentials;
  }
  export interface LambdaFunctionStartFailedEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface LambdaFunctionSucceededEventDetails {
    /**
     * The JSON data output by the Lambda function. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    output?: SensitiveData;
    /**
     * Contains details about the output of an execution history event.
     */
    outputDetails?: HistoryEventExecutionDataDetails;
  }
  export interface LambdaFunctionTimedOutEventDetails {
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the timeout.
     */
    cause?: SensitiveCause;
  }
  export interface ListActivitiesInput {
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. The default is 100 and the maximum allowed page size is 1000. A value of 0 uses the default. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: PageSize;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface ListActivitiesOutput {
    /**
     * The list of activities.
     */
    activities: ActivityList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface ListExecutionsInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine whose executions is listed. You can specify either a mapRunArn or a stateMachineArn, but not both. You can also return a list of executions associated with a specific alias or version, by specifying an alias ARN or a version ARN in the stateMachineArn parameter.
     */
    stateMachineArn?: Arn;
    /**
     * If specified, only list the executions whose current execution status matches the given filter.
     */
    statusFilter?: ExecutionStatus;
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. The default is 100 and the maximum allowed page size is 1000. A value of 0 uses the default. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: PageSize;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: ListExecutionsPageToken;
    /**
     * The Amazon Resource Name (ARN) of the Map Run that started the child workflow executions. If the mapRunArn field is specified, a list of all of the child workflow executions started by a Map Run is returned. For more information, see Examining Map Run in the Step Functions Developer Guide. You can specify either a mapRunArn or a stateMachineArn, but not both.
     */
    mapRunArn?: LongArn;
  }
  export interface ListExecutionsOutput {
    /**
     * The list of matching executions.
     */
    executions: ExecutionList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: ListExecutionsPageToken;
  }
  export type ListExecutionsPageToken = string;
  export interface ListMapRunsInput {
    /**
     * The Amazon Resource Name (ARN) of the execution for which the Map Runs must be listed.
     */
    executionArn: Arn;
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. The default is 100 and the maximum allowed page size is 1000. A value of 0 uses the default. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: PageSize;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface ListMapRunsOutput {
    /**
     * An array that lists information related to a Map Run, such as the Amazon Resource Name (ARN) of the Map Run and the ARN of the state machine that started the Map Run.
     */
    mapRuns: MapRunList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface ListStateMachineAliasesInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine for which you want to list aliases. If you specify a state machine version ARN, this API returns a list of aliases for that version.
     */
    stateMachineArn: Arn;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. The default is 100 and the maximum allowed page size is 1000. A value of 0 uses the default. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: PageSize;
  }
  export interface ListStateMachineAliasesOutput {
    /**
     * Aliases for the state machine.
     */
    stateMachineAliases: StateMachineAliasList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface ListStateMachineVersionsInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine.
     */
    stateMachineArn: Arn;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. The default is 100 and the maximum allowed page size is 1000. A value of 0 uses the default. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: PageSize;
  }
  export interface ListStateMachineVersionsOutput {
    /**
     * Versions for the state machine.
     */
    stateMachineVersions: StateMachineVersionList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface ListStateMachinesInput {
    /**
     * The maximum number of results that are returned per call. You can use nextToken to obtain further pages of results. The default is 100 and the maximum allowed page size is 1000. A value of 0 uses the default. This is only an upper limit. The actual number of results returned per call might be fewer than the specified maximum.
     */
    maxResults?: PageSize;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface ListStateMachinesOutput {
    stateMachines: StateMachineList;
    /**
     * If nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: PageToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) for the Step Functions state machine or activity.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * An array of tags associated with the resource.
     */
    tags?: TagList;
  }
  export interface LogDestination {
    /**
     * An object describing a CloudWatch log group. For more information, see AWS::Logs::LogGroup in the CloudFormation User Guide.
     */
    cloudWatchLogsLogGroup?: CloudWatchLogsLogGroup;
  }
  export type LogDestinationList = LogDestination[];
  export type LogLevel = "ALL"|"ERROR"|"FATAL"|"OFF"|string;
  export interface LoggingConfiguration {
    /**
     * Defines which category of execution history events are logged.
     */
    level?: LogLevel;
    /**
     * Determines whether execution data is included in your log. When set to false, data is excluded.
     */
    includeExecutionData?: IncludeExecutionData;
    /**
     * An array of objects that describes where your execution history events will be logged. Limited to size 1. Required, if your log level is not set to OFF.
     */
    destinations?: LogDestinationList;
  }
  export type LongArn = string;
  export interface MapIterationEventDetails {
    /**
     * The name of the iteration’s parent Map state.
     */
    name?: Name;
    /**
     * The index of the array belonging to the Map state iteration.
     */
    index?: UnsignedInteger;
  }
  export interface MapRunExecutionCounts {
    /**
     * The total number of child workflow executions that were started by a Map Run, but haven't started executing yet. 
     */
    pending: UnsignedLong;
    /**
     * The total number of child workflow executions that were started by a Map Run and are currently in-progress.
     */
    running: UnsignedLong;
    /**
     * The total number of child workflow executions that were started by a Map Run and have completed successfully.
     */
    succeeded: UnsignedLong;
    /**
     * The total number of child workflow executions that were started by a Map Run, but have failed.
     */
    failed: UnsignedLong;
    /**
     * The total number of child workflow executions that were started by a Map Run and have timed out.
     */
    timedOut: UnsignedLong;
    /**
     * The total number of child workflow executions that were started by a Map Run and were running, but were either stopped by the user or by Step Functions because the Map Run failed. 
     */
    aborted: UnsignedLong;
    /**
     * The total number of child workflow executions that were started by a Map Run.
     */
    total: UnsignedLong;
    /**
     * Returns the count of child workflow executions whose results were written by ResultWriter. For more information, see ResultWriter in the Step Functions Developer Guide.
     */
    resultsWritten: UnsignedLong;
  }
  export interface MapRunFailedEventDetails {
    /**
     * The error code of the Map Run failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface MapRunItemCounts {
    /**
     * The total number of items to process in child workflow executions that haven't started running yet.
     */
    pending: UnsignedLong;
    /**
     * The total number of items being processed in child workflow executions that are currently in-progress.
     */
    running: UnsignedLong;
    /**
     * The total number of items processed in child workflow executions that have completed successfully.
     */
    succeeded: UnsignedLong;
    /**
     * The total number of items processed in child workflow executions that have failed.
     */
    failed: UnsignedLong;
    /**
     * The total number of items processed in child workflow executions that have timed out.
     */
    timedOut: UnsignedLong;
    /**
     * The total number of items processed in child workflow executions that were either stopped by the user or by Step Functions, because the Map Run failed.
     */
    aborted: UnsignedLong;
    /**
     * The total number of items processed in all the child workflow executions started by a Map Run.
     */
    total: UnsignedLong;
    /**
     * Returns the count of items whose results were written by ResultWriter. For more information, see ResultWriter in the Step Functions Developer Guide.
     */
    resultsWritten: UnsignedLong;
  }
  export type MapRunLabel = string;
  export type MapRunList = MapRunListItem[];
  export interface MapRunListItem {
    /**
     * The executionArn of the execution from which the Map Run was started.
     */
    executionArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the Map Run.
     */
    mapRunArn: LongArn;
    /**
     * The Amazon Resource Name (ARN) of the executed state machine.
     */
    stateMachineArn: Arn;
    /**
     * The date on which the Map Run started.
     */
    startDate: Timestamp;
    /**
     * The date on which the Map Run stopped.
     */
    stopDate?: Timestamp;
  }
  export interface MapRunStartedEventDetails {
    /**
     * The Amazon Resource Name (ARN) of a Map Run that was started.
     */
    mapRunArn?: LongArn;
  }
  export type MapRunStatus = "RUNNING"|"SUCCEEDED"|"FAILED"|"ABORTED"|string;
  export interface MapStateStartedEventDetails {
    /**
     * The size of the array for Map state iterations.
     */
    length?: UnsignedInteger;
  }
  export type MaxConcurrency = number;
  export type Name = string;
  export type PageSize = number;
  export type PageToken = string;
  export type Publish = boolean;
  export interface PublishStateMachineVersionInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine.
     */
    stateMachineArn: Arn;
    /**
     * Only publish the state machine version if the current state machine's revision ID matches the specified ID. Use this option to avoid publishing a version if the state machine changed since you last updated it. If the specified revision ID doesn't match the state machine's current revision ID, the API returns ConflictException.  To specify an initial revision ID for a state machine with no revision ID assigned, specify the string INITIAL for the revisionId parameter. For example, you can specify a revisionID of INITIAL when you create a state machine using the CreateStateMachine API action. 
     */
    revisionId?: RevisionId;
    /**
     * An optional description of the state machine version.
     */
    description?: VersionDescription;
  }
  export interface PublishStateMachineVersionOutput {
    /**
     * The date the version was created.
     */
    creationDate: Timestamp;
    /**
     * The Amazon Resource Name (ARN) (ARN) that identifies the state machine version.
     */
    stateMachineVersionArn: Arn;
  }
  export type ReverseOrder = boolean;
  export type RevisionId = string;
  export type RoutingConfigurationList = RoutingConfigurationListItem[];
  export interface RoutingConfigurationListItem {
    /**
     * The Amazon Resource Name (ARN) that identifies one or two state machine versions defined in the routing configuration. If you specify the ARN of a second version, it must belong to the same state machine as the first version.
     */
    stateMachineVersionArn: Arn;
    /**
     * The percentage of traffic you want to route to the second state machine version. The sum of the weights in the routing configuration must be equal to 100.
     */
    weight: VersionWeight;
  }
  export interface SendTaskFailureInput {
    /**
     * The token that represents this task. Task tokens are generated by Step Functions when tasks are assigned to a worker, or in the context object when a workflow enters a task state. See GetActivityTaskOutput$taskToken.
     */
    taskToken: TaskToken;
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface SendTaskFailureOutput {
  }
  export interface SendTaskHeartbeatInput {
    /**
     * The token that represents this task. Task tokens are generated by Step Functions when tasks are assigned to a worker, or in the context object when a workflow enters a task state. See GetActivityTaskOutput$taskToken.
     */
    taskToken: TaskToken;
  }
  export interface SendTaskHeartbeatOutput {
  }
  export interface SendTaskSuccessInput {
    /**
     * The token that represents this task. Task tokens are generated by Step Functions when tasks are assigned to a worker, or in the context object when a workflow enters a task state. See GetActivityTaskOutput$taskToken.
     */
    taskToken: TaskToken;
    /**
     * The JSON output of the task. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    output: SensitiveData;
  }
  export interface SendTaskSuccessOutput {
  }
  export type SensitiveCause = string;
  export type SensitiveData = string;
  export type SensitiveDataJobInput = string;
  export type SensitiveError = string;
  export interface StartExecutionInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine to execute. The stateMachineArn parameter accepts one of the following inputs:    An unqualified state machine ARN – Refers to a state machine ARN that isn't qualified with a version or alias ARN. The following is an example of an unqualified state machine ARN.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine&gt;  Step Functions doesn't associate state machine executions that you start with an unqualified ARN with a version. This is true even if that version uses the same revision that the execution used.    A state machine version ARN – Refers to a version ARN, which is a combination of state machine ARN and the version number separated by a colon (:). The following is an example of the ARN for version 10.   arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine&gt;:10  Step Functions doesn't associate executions that you start with a version ARN with any aliases that point to that version.    A state machine alias ARN – Refers to an alias ARN, which is a combination of state machine ARN and the alias name separated by a colon (:). The following is an example of the ARN for an alias named PROD.  arn:&lt;partition&gt;:states:&lt;region&gt;:&lt;account-id&gt;:stateMachine:&lt;myStateMachine:PROD&gt;  Step Functions associates executions that you start with an alias ARN with that alias and the state machine version used for that execution.  
     */
    stateMachineArn: Arn;
    /**
     * Optional name of the execution. This name must be unique for your Amazon Web Services account, Region, and state machine for 90 days. For more information, see  Limits Related to State Machine Executions in the Step Functions Developer Guide. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name?: Name;
    /**
     * The string that contains the JSON input data for the execution, for example:  "input": "{\"first_name\" : \"test\"}"   If you don't include any JSON input data, you still must include the two braces, for example: "input": "{}"   Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveData;
    /**
     * Passes the X-Ray trace header. The trace header can also be passed in the request payload.
     */
    traceHeader?: TraceHeader;
  }
  export interface StartExecutionOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies the execution.
     */
    executionArn: Arn;
    /**
     * The date the execution is started.
     */
    startDate: Timestamp;
  }
  export interface StartSyncExecutionInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine to execute.
     */
    stateMachineArn: Arn;
    /**
     * The name of the execution.
     */
    name?: Name;
    /**
     * The string that contains the JSON input data for the execution, for example:  "input": "{\"first_name\" : \"test\"}"   If you don't include any JSON input data, you still must include the two braces, for example: "input": "{}"   Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveData;
    /**
     * Passes the X-Ray trace header. The trace header can also be passed in the request payload.
     */
    traceHeader?: TraceHeader;
  }
  export interface StartSyncExecutionOutput {
    /**
     * The Amazon Resource Name (ARN) that identifies the execution.
     */
    executionArn: Arn;
    /**
     * The Amazon Resource Name (ARN) that identifies the state machine.
     */
    stateMachineArn?: Arn;
    /**
     * The name of the execution.
     */
    name?: Name;
    /**
     * The date the execution is started.
     */
    startDate: Timestamp;
    /**
     * If the execution has already ended, the date the execution stopped.
     */
    stopDate: Timestamp;
    /**
     * The current status of the execution.
     */
    status: SyncExecutionStatus;
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
    /**
     * The string that contains the JSON input data of the execution. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveData;
    inputDetails?: CloudWatchEventsExecutionDataDetails;
    /**
     * The JSON output data of the execution. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.  This field is set only if the execution succeeds. If the execution fails, this field is null. 
     */
    output?: SensitiveData;
    outputDetails?: CloudWatchEventsExecutionDataDetails;
    /**
     * The X-Ray trace header that was passed to the execution.
     */
    traceHeader?: TraceHeader;
    /**
     * An object that describes workflow billing details, including billed duration and memory use.
     */
    billingDetails?: BillingDetails;
  }
  export interface StateEnteredEventDetails {
    /**
     * The name of the state.
     */
    name: Name;
    /**
     * The string that contains the JSON input data for the state. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    input?: SensitiveData;
    /**
     * Contains details about the input for an execution history event.
     */
    inputDetails?: HistoryEventExecutionDataDetails;
  }
  export interface StateExitedEventDetails {
    /**
     * The name of the state. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name: Name;
    /**
     * The JSON output data of the state. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    output?: SensitiveData;
    /**
     * Contains details about the output of an execution history event.
     */
    outputDetails?: HistoryEventExecutionDataDetails;
  }
  export type StateMachineAliasList = StateMachineAliasListItem[];
  export interface StateMachineAliasListItem {
    /**
     * The Amazon Resource Name (ARN) that identifies a state machine alias. The alias ARN is a combination of state machine ARN and the alias name separated by a colon (:). For example, stateMachineARN:PROD.
     */
    stateMachineAliasArn: LongArn;
    /**
     * The creation date of a state machine alias.
     */
    creationDate: Timestamp;
  }
  export type StateMachineList = StateMachineListItem[];
  export interface StateMachineListItem {
    /**
     * The Amazon Resource Name (ARN) that identifies the state machine.
     */
    stateMachineArn: Arn;
    /**
     * The name of the state machine. A name must not contain:   white space   brackets &lt; &gt; { } [ ]    wildcard characters ? *    special characters " # % \ ^ | ~ ` $ &amp; , ; : /    control characters (U+0000-001F, U+007F-009F)   To enable logging with CloudWatch Logs, the name should only contain 0-9, A-Z, a-z, - and _.
     */
    name: Name;
    /**
     * 
     */
    type: StateMachineType;
    /**
     * The date the state machine is created.
     */
    creationDate: Timestamp;
  }
  export type StateMachineStatus = "ACTIVE"|"DELETING"|string;
  export type StateMachineType = "STANDARD"|"EXPRESS"|string;
  export type StateMachineVersionList = StateMachineVersionListItem[];
  export interface StateMachineVersionListItem {
    /**
     * The Amazon Resource Name (ARN) that identifies a state machine version. The version ARN is a combination of state machine ARN and the version number separated by a colon (:). For example, stateMachineARN:1.
     */
    stateMachineVersionArn: LongArn;
    /**
     * The creation date of a state machine version.
     */
    creationDate: Timestamp;
  }
  export interface StopExecutionInput {
    /**
     * The Amazon Resource Name (ARN) of the execution to stop.
     */
    executionArn: Arn;
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface StopExecutionOutput {
    /**
     * The date the execution is stopped.
     */
    stopDate: Timestamp;
  }
  export type SyncExecutionStatus = "SUCCEEDED"|"FAILED"|"TIMED_OUT"|string;
  export interface Tag {
    /**
     * The key of a tag.
     */
    key?: TagKey;
    /**
     * The value of a tag.
     */
    value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) for the Step Functions state machine or activity.
     */
    resourceArn: Arn;
    /**
     * The list of tags to add to a resource. Tags may only contain Unicode letters, digits, white space, or these symbols: _ . : / = + - @.
     */
    tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export interface TaskCredentials {
    /**
     * The ARN of an IAM role that Step Functions assumes for the task. The role can allow cross-account access to resources.
     */
    roleArn?: LongArn;
  }
  export interface TaskFailedEventDetails {
    /**
     * The service name of the resource in a task state.
     */
    resourceType: Name;
    /**
     * The action of the resource called by a task state.
     */
    resource: Name;
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface TaskScheduledEventDetails {
    /**
     * The service name of the resource in a task state.
     */
    resourceType: Name;
    /**
     * The action of the resource called by a task state.
     */
    resource: Name;
    /**
     * The region of the scheduled task
     */
    region: Name;
    /**
     * The JSON data passed to the resource referenced in a task state. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    parameters: ConnectorParameters;
    /**
     * The maximum allowed duration of the task.
     */
    timeoutInSeconds?: TimeoutInSeconds;
    /**
     * The maximum allowed duration between two heartbeats for the task.
     */
    heartbeatInSeconds?: TimeoutInSeconds;
    /**
     * The credentials that Step Functions uses for the task.
     */
    taskCredentials?: TaskCredentials;
  }
  export interface TaskStartFailedEventDetails {
    /**
     * The service name of the resource in a task state.
     */
    resourceType: Name;
    /**
     * The action of the resource called by a task state.
     */
    resource: Name;
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface TaskStartedEventDetails {
    /**
     * The service name of the resource in a task state.
     */
    resourceType: Name;
    /**
     * The action of the resource called by a task state.
     */
    resource: Name;
  }
  export interface TaskSubmitFailedEventDetails {
    /**
     * The service name of the resource in a task state.
     */
    resourceType: Name;
    /**
     * The action of the resource called by a task state.
     */
    resource: Name;
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export interface TaskSubmittedEventDetails {
    /**
     * The service name of the resource in a task state.
     */
    resourceType: Name;
    /**
     * The action of the resource called by a task state.
     */
    resource: Name;
    /**
     * The response from a resource when a task has started. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    output?: SensitiveData;
    /**
     * Contains details about the output of an execution history event.
     */
    outputDetails?: HistoryEventExecutionDataDetails;
  }
  export interface TaskSucceededEventDetails {
    /**
     * The service name of the resource in a task state.
     */
    resourceType: Name;
    /**
     * The action of the resource called by a task state.
     */
    resource: Name;
    /**
     * The full JSON response from a resource when a task has succeeded. This response becomes the output of the related task. Length constraints apply to the payload size, and are expressed as bytes in UTF-8 encoding.
     */
    output?: SensitiveData;
    /**
     * Contains details about the output of an execution history event.
     */
    outputDetails?: HistoryEventExecutionDataDetails;
  }
  export interface TaskTimedOutEventDetails {
    /**
     * The service name of the resource in a task state.
     */
    resourceType: Name;
    /**
     * The action of the resource called by a task state.
     */
    resource: Name;
    /**
     * The error code of the failure.
     */
    error?: SensitiveError;
    /**
     * A more detailed explanation of the cause of the failure.
     */
    cause?: SensitiveCause;
  }
  export type TaskToken = string;
  export type TimeoutInSeconds = number;
  export type Timestamp = Date;
  export type ToleratedFailureCount = number;
  export type ToleratedFailurePercentage = number;
  export type TraceHeader = string;
  export interface TracingConfiguration {
    /**
     * When set to true, X-Ray tracing is enabled.
     */
    enabled?: Enabled;
  }
  export type UnsignedInteger = number;
  export type UnsignedLong = number;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) for the Step Functions state machine or activity.
     */
    resourceArn: Arn;
    /**
     * The list of tags to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateMapRunInput {
    /**
     * The Amazon Resource Name (ARN) of a Map Run.
     */
    mapRunArn: LongArn;
    /**
     * The maximum number of child workflow executions that can be specified to run in parallel for the Map Run at the same time.
     */
    maxConcurrency?: MaxConcurrency;
    /**
     * The maximum percentage of failed items before the Map Run fails.
     */
    toleratedFailurePercentage?: ToleratedFailurePercentage;
    /**
     * The maximum number of failed items before the Map Run fails.
     */
    toleratedFailureCount?: ToleratedFailureCount;
  }
  export interface UpdateMapRunOutput {
  }
  export interface UpdateStateMachineAliasInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine alias.
     */
    stateMachineAliasArn: Arn;
    /**
     * A description of the state machine alias.
     */
    description?: AliasDescription;
    /**
     * The routing configuration of the state machine alias. An array of RoutingConfig objects that specifies up to two state machine versions that the alias starts executions for.
     */
    routingConfiguration?: RoutingConfigurationList;
  }
  export interface UpdateStateMachineAliasOutput {
    /**
     * The date and time the state machine alias was updated.
     */
    updateDate: Timestamp;
  }
  export interface UpdateStateMachineInput {
    /**
     * The Amazon Resource Name (ARN) of the state machine.
     */
    stateMachineArn: Arn;
    /**
     * The Amazon States Language definition of the state machine. See Amazon States Language.
     */
    definition?: Definition;
    /**
     * The Amazon Resource Name (ARN) of the IAM role of the state machine.
     */
    roleArn?: Arn;
    /**
     * Use the LoggingConfiguration data type to set CloudWatch Logs options.
     */
    loggingConfiguration?: LoggingConfiguration;
    /**
     * Selects whether X-Ray tracing is enabled.
     */
    tracingConfiguration?: TracingConfiguration;
    /**
     * Specifies whether the state machine version is published. The default is false. To publish a version after updating the state machine, set publish to true.
     */
    publish?: Publish;
    /**
     * An optional description of the state machine version to publish. You can only specify the versionDescription parameter if you've set publish to true.
     */
    versionDescription?: VersionDescription;
  }
  export interface UpdateStateMachineOutput {
    /**
     * The date and time the state machine was updated.
     */
    updateDate: Timestamp;
    /**
     * The revision identifier for the updated state machine.
     */
    revisionId?: RevisionId;
    /**
     * The Amazon Resource Name (ARN) of the published state machine version. If the publish parameter isn't set to true, this field returns null.
     */
    stateMachineVersionArn?: Arn;
  }
  export type VersionDescription = string;
  export type VersionWeight = number;
  export type includedDetails = boolean;
  export type truncated = boolean;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-11-23"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the StepFunctions client.
   */
  export import Types = StepFunctions;
}
export = StepFunctions;
