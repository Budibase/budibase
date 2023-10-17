import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ConfigService extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ConfigService.Types.ClientConfiguration)
  config: Config & ConfigService.Types.ClientConfiguration;
  /**
   * Returns the current configuration items for resources that are present in your Config aggregator. The operation also returns a list of resources that are not processed in the current request. If there are no unprocessed resources, the operation returns an empty unprocessedResourceIdentifiers list.     The API does not return results for deleted resources.    The API does not return tags and relationships.   
   */
  batchGetAggregateResourceConfig(params: ConfigService.Types.BatchGetAggregateResourceConfigRequest, callback?: (err: AWSError, data: ConfigService.Types.BatchGetAggregateResourceConfigResponse) => void): Request<ConfigService.Types.BatchGetAggregateResourceConfigResponse, AWSError>;
  /**
   * Returns the current configuration items for resources that are present in your Config aggregator. The operation also returns a list of resources that are not processed in the current request. If there are no unprocessed resources, the operation returns an empty unprocessedResourceIdentifiers list.     The API does not return results for deleted resources.    The API does not return tags and relationships.   
   */
  batchGetAggregateResourceConfig(callback?: (err: AWSError, data: ConfigService.Types.BatchGetAggregateResourceConfigResponse) => void): Request<ConfigService.Types.BatchGetAggregateResourceConfigResponse, AWSError>;
  /**
   * Returns the BaseConfigurationItem for one or more requested resources. The operation also returns a list of resources that are not processed in the current request. If there are no unprocessed resources, the operation returns an empty unprocessedResourceKeys list.     The API does not return results for deleted resources.    The API does not return any tags for the requested resources. This information is filtered out of the supplementaryConfiguration section of the API response.   
   */
  batchGetResourceConfig(params: ConfigService.Types.BatchGetResourceConfigRequest, callback?: (err: AWSError, data: ConfigService.Types.BatchGetResourceConfigResponse) => void): Request<ConfigService.Types.BatchGetResourceConfigResponse, AWSError>;
  /**
   * Returns the BaseConfigurationItem for one or more requested resources. The operation also returns a list of resources that are not processed in the current request. If there are no unprocessed resources, the operation returns an empty unprocessedResourceKeys list.     The API does not return results for deleted resources.    The API does not return any tags for the requested resources. This information is filtered out of the supplementaryConfiguration section of the API response.   
   */
  batchGetResourceConfig(callback?: (err: AWSError, data: ConfigService.Types.BatchGetResourceConfigResponse) => void): Request<ConfigService.Types.BatchGetResourceConfigResponse, AWSError>;
  /**
   * Deletes the authorization granted to the specified configuration aggregator account in a specified region.
   */
  deleteAggregationAuthorization(params: ConfigService.Types.DeleteAggregationAuthorizationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the authorization granted to the specified configuration aggregator account in a specified region.
   */
  deleteAggregationAuthorization(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Config rule and all of its evaluation results. Config sets the state of a rule to DELETING until the deletion is complete. You cannot update a rule while it is in this state. If you make a PutConfigRule or DeleteConfigRule request for the rule, you will receive a ResourceInUseException. You can check the state of a rule by using the DescribeConfigRules request.
   */
  deleteConfigRule(params: ConfigService.Types.DeleteConfigRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Config rule and all of its evaluation results. Config sets the state of a rule to DELETING until the deletion is complete. You cannot update a rule while it is in this state. If you make a PutConfigRule or DeleteConfigRule request for the rule, you will receive a ResourceInUseException. You can check the state of a rule by using the DescribeConfigRules request.
   */
  deleteConfigRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified configuration aggregator and the aggregated data associated with the aggregator.
   */
  deleteConfigurationAggregator(params: ConfigService.Types.DeleteConfigurationAggregatorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified configuration aggregator and the aggregated data associated with the aggregator.
   */
  deleteConfigurationAggregator(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the configuration recorder. After the configuration recorder is deleted, Config will not record resource configuration changes until you create a new configuration recorder. This action does not delete the configuration information that was previously recorded. You will be able to access the previously recorded information by using the GetResourceConfigHistory action, but you will not be able to access this information in the Config console until you create a new configuration recorder.
   */
  deleteConfigurationRecorder(params: ConfigService.Types.DeleteConfigurationRecorderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the configuration recorder. After the configuration recorder is deleted, Config will not record resource configuration changes until you create a new configuration recorder. This action does not delete the configuration information that was previously recorded. You will be able to access the previously recorded information by using the GetResourceConfigHistory action, but you will not be able to access this information in the Config console until you create a new configuration recorder.
   */
  deleteConfigurationRecorder(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified conformance pack and all the Config rules, remediation actions, and all evaluation results within that conformance pack. Config sets the conformance pack to DELETE_IN_PROGRESS until the deletion is complete. You cannot update a conformance pack while it is in this state.
   */
  deleteConformancePack(params: ConfigService.Types.DeleteConformancePackRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified conformance pack and all the Config rules, remediation actions, and all evaluation results within that conformance pack. Config sets the conformance pack to DELETE_IN_PROGRESS until the deletion is complete. You cannot update a conformance pack while it is in this state.
   */
  deleteConformancePack(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the delivery channel. Before you can delete the delivery channel, you must stop the configuration recorder by using the StopConfigurationRecorder action.
   */
  deleteDeliveryChannel(params: ConfigService.Types.DeleteDeliveryChannelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the delivery channel. Before you can delete the delivery channel, you must stop the configuration recorder by using the StopConfigurationRecorder action.
   */
  deleteDeliveryChannel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the evaluation results for the specified Config rule. You can specify one Config rule per request. After you delete the evaluation results, you can call the StartConfigRulesEvaluation API to start evaluating your Amazon Web Services resources against the rule.
   */
  deleteEvaluationResults(params: ConfigService.Types.DeleteEvaluationResultsRequest, callback?: (err: AWSError, data: ConfigService.Types.DeleteEvaluationResultsResponse) => void): Request<ConfigService.Types.DeleteEvaluationResultsResponse, AWSError>;
  /**
   * Deletes the evaluation results for the specified Config rule. You can specify one Config rule per request. After you delete the evaluation results, you can call the StartConfigRulesEvaluation API to start evaluating your Amazon Web Services resources against the rule.
   */
  deleteEvaluationResults(callback?: (err: AWSError, data: ConfigService.Types.DeleteEvaluationResultsResponse) => void): Request<ConfigService.Types.DeleteEvaluationResultsResponse, AWSError>;
  /**
   * Deletes the specified organization config rule and all of its evaluation results from all member accounts in that organization.  Only a master account and a delegated administrator account can delete an organization config rule. When calling this API with a delegated administrator, you must ensure Organizations ListDelegatedAdministrator permissions are added. Config sets the state of a rule to DELETE_IN_PROGRESS until the deletion is complete. You cannot update a rule while it is in this state.
   */
  deleteOrganizationConfigRule(params: ConfigService.Types.DeleteOrganizationConfigRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified organization config rule and all of its evaluation results from all member accounts in that organization.  Only a master account and a delegated administrator account can delete an organization config rule. When calling this API with a delegated administrator, you must ensure Organizations ListDelegatedAdministrator permissions are added. Config sets the state of a rule to DELETE_IN_PROGRESS until the deletion is complete. You cannot update a rule while it is in this state.
   */
  deleteOrganizationConfigRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified organization conformance pack and all of the config rules and remediation actions from all member accounts in that organization.   Only a master account or a delegated administrator account can delete an organization conformance pack. When calling this API with a delegated administrator, you must ensure Organizations ListDelegatedAdministrator permissions are added. Config sets the state of a conformance pack to DELETE_IN_PROGRESS until the deletion is complete. You cannot update a conformance pack while it is in this state. 
   */
  deleteOrganizationConformancePack(params: ConfigService.Types.DeleteOrganizationConformancePackRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified organization conformance pack and all of the config rules and remediation actions from all member accounts in that organization.   Only a master account or a delegated administrator account can delete an organization conformance pack. When calling this API with a delegated administrator, you must ensure Organizations ListDelegatedAdministrator permissions are added. Config sets the state of a conformance pack to DELETE_IN_PROGRESS until the deletion is complete. You cannot update a conformance pack while it is in this state. 
   */
  deleteOrganizationConformancePack(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes pending authorization requests for a specified aggregator account in a specified region.
   */
  deletePendingAggregationRequest(params: ConfigService.Types.DeletePendingAggregationRequestRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes pending authorization requests for a specified aggregator account in a specified region.
   */
  deletePendingAggregationRequest(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the remediation configuration.
   */
  deleteRemediationConfiguration(params: ConfigService.Types.DeleteRemediationConfigurationRequest, callback?: (err: AWSError, data: ConfigService.Types.DeleteRemediationConfigurationResponse) => void): Request<ConfigService.Types.DeleteRemediationConfigurationResponse, AWSError>;
  /**
   * Deletes the remediation configuration.
   */
  deleteRemediationConfiguration(callback?: (err: AWSError, data: ConfigService.Types.DeleteRemediationConfigurationResponse) => void): Request<ConfigService.Types.DeleteRemediationConfigurationResponse, AWSError>;
  /**
   * Deletes one or more remediation exceptions mentioned in the resource keys.  Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource. Remediation exceptions blocks auto-remediation until the exception is cleared. 
   */
  deleteRemediationExceptions(params: ConfigService.Types.DeleteRemediationExceptionsRequest, callback?: (err: AWSError, data: ConfigService.Types.DeleteRemediationExceptionsResponse) => void): Request<ConfigService.Types.DeleteRemediationExceptionsResponse, AWSError>;
  /**
   * Deletes one or more remediation exceptions mentioned in the resource keys.  Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource. Remediation exceptions blocks auto-remediation until the exception is cleared. 
   */
  deleteRemediationExceptions(callback?: (err: AWSError, data: ConfigService.Types.DeleteRemediationExceptionsResponse) => void): Request<ConfigService.Types.DeleteRemediationExceptionsResponse, AWSError>;
  /**
   * Records the configuration state for a custom resource that has been deleted. This API records a new ConfigurationItem with a ResourceDeleted status. You can retrieve the ConfigurationItems recorded for this resource in your Config History. 
   */
  deleteResourceConfig(params: ConfigService.Types.DeleteResourceConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Records the configuration state for a custom resource that has been deleted. This API records a new ConfigurationItem with a ResourceDeleted status. You can retrieve the ConfigurationItems recorded for this resource in your Config History. 
   */
  deleteResourceConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the retention configuration.
   */
  deleteRetentionConfiguration(params: ConfigService.Types.DeleteRetentionConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the retention configuration.
   */
  deleteRetentionConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the stored query for a single Amazon Web Services account and a single Amazon Web Services Region.
   */
  deleteStoredQuery(params: ConfigService.Types.DeleteStoredQueryRequest, callback?: (err: AWSError, data: ConfigService.Types.DeleteStoredQueryResponse) => void): Request<ConfigService.Types.DeleteStoredQueryResponse, AWSError>;
  /**
   * Deletes the stored query for a single Amazon Web Services account and a single Amazon Web Services Region.
   */
  deleteStoredQuery(callback?: (err: AWSError, data: ConfigService.Types.DeleteStoredQueryResponse) => void): Request<ConfigService.Types.DeleteStoredQueryResponse, AWSError>;
  /**
   * Schedules delivery of a configuration snapshot to the Amazon S3 bucket in the specified delivery channel. After the delivery has started, Config sends the following notifications using an Amazon SNS topic that you have specified.   Notification of the start of the delivery.   Notification of the completion of the delivery, if the delivery was successfully completed.   Notification of delivery failure, if the delivery failed.  
   */
  deliverConfigSnapshot(params: ConfigService.Types.DeliverConfigSnapshotRequest, callback?: (err: AWSError, data: ConfigService.Types.DeliverConfigSnapshotResponse) => void): Request<ConfigService.Types.DeliverConfigSnapshotResponse, AWSError>;
  /**
   * Schedules delivery of a configuration snapshot to the Amazon S3 bucket in the specified delivery channel. After the delivery has started, Config sends the following notifications using an Amazon SNS topic that you have specified.   Notification of the start of the delivery.   Notification of the completion of the delivery, if the delivery was successfully completed.   Notification of delivery failure, if the delivery failed.  
   */
  deliverConfigSnapshot(callback?: (err: AWSError, data: ConfigService.Types.DeliverConfigSnapshotResponse) => void): Request<ConfigService.Types.DeliverConfigSnapshotResponse, AWSError>;
  /**
   * Returns a list of compliant and noncompliant rules with the number of resources for compliant and noncompliant rules. Does not display rules that do not have compliance results.   The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page. 
   */
  describeAggregateComplianceByConfigRules(params: ConfigService.Types.DescribeAggregateComplianceByConfigRulesRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeAggregateComplianceByConfigRulesResponse) => void): Request<ConfigService.Types.DescribeAggregateComplianceByConfigRulesResponse, AWSError>;
  /**
   * Returns a list of compliant and noncompliant rules with the number of resources for compliant and noncompliant rules. Does not display rules that do not have compliance results.   The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page. 
   */
  describeAggregateComplianceByConfigRules(callback?: (err: AWSError, data: ConfigService.Types.DescribeAggregateComplianceByConfigRulesResponse) => void): Request<ConfigService.Types.DescribeAggregateComplianceByConfigRulesResponse, AWSError>;
  /**
   * Returns a list of the conformance packs and their associated compliance status with the count of compliant and noncompliant Config rules within each conformance pack. Also returns the total rule count which includes compliant rules, noncompliant rules, and rules that cannot be evaluated due to insufficient data.  The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page. 
   */
  describeAggregateComplianceByConformancePacks(params: ConfigService.Types.DescribeAggregateComplianceByConformancePacksRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeAggregateComplianceByConformancePacksResponse) => void): Request<ConfigService.Types.DescribeAggregateComplianceByConformancePacksResponse, AWSError>;
  /**
   * Returns a list of the conformance packs and their associated compliance status with the count of compliant and noncompliant Config rules within each conformance pack. Also returns the total rule count which includes compliant rules, noncompliant rules, and rules that cannot be evaluated due to insufficient data.  The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page. 
   */
  describeAggregateComplianceByConformancePacks(callback?: (err: AWSError, data: ConfigService.Types.DescribeAggregateComplianceByConformancePacksResponse) => void): Request<ConfigService.Types.DescribeAggregateComplianceByConformancePacksResponse, AWSError>;
  /**
   * Returns a list of authorizations granted to various aggregator accounts and regions.
   */
  describeAggregationAuthorizations(params: ConfigService.Types.DescribeAggregationAuthorizationsRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeAggregationAuthorizationsResponse) => void): Request<ConfigService.Types.DescribeAggregationAuthorizationsResponse, AWSError>;
  /**
   * Returns a list of authorizations granted to various aggregator accounts and regions.
   */
  describeAggregationAuthorizations(callback?: (err: AWSError, data: ConfigService.Types.DescribeAggregationAuthorizationsResponse) => void): Request<ConfigService.Types.DescribeAggregationAuthorizationsResponse, AWSError>;
  /**
   * Indicates whether the specified Config rules are compliant. If a rule is noncompliant, this action returns the number of Amazon Web Services resources that do not comply with the rule. A rule is compliant if all of the evaluated resources comply with it. It is noncompliant if any of these resources do not comply. If Config has no current evaluation results for the rule, it returns INSUFFICIENT_DATA. This result might indicate one of the following conditions:   Config has never invoked an evaluation for the rule. To check whether it has, use the DescribeConfigRuleEvaluationStatus action to get the LastSuccessfulInvocationTime and LastFailedInvocationTime.   The rule's Lambda function is failing to send evaluation results to Config. Verify that the role you assigned to your configuration recorder includes the config:PutEvaluations permission. If the rule is a custom rule, verify that the Lambda execution role includes the config:PutEvaluations permission.   The rule's Lambda function has returned NOT_APPLICABLE for all evaluation results. This can occur if the resources were deleted or removed from the rule's scope.  
   */
  describeComplianceByConfigRule(params: ConfigService.Types.DescribeComplianceByConfigRuleRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeComplianceByConfigRuleResponse) => void): Request<ConfigService.Types.DescribeComplianceByConfigRuleResponse, AWSError>;
  /**
   * Indicates whether the specified Config rules are compliant. If a rule is noncompliant, this action returns the number of Amazon Web Services resources that do not comply with the rule. A rule is compliant if all of the evaluated resources comply with it. It is noncompliant if any of these resources do not comply. If Config has no current evaluation results for the rule, it returns INSUFFICIENT_DATA. This result might indicate one of the following conditions:   Config has never invoked an evaluation for the rule. To check whether it has, use the DescribeConfigRuleEvaluationStatus action to get the LastSuccessfulInvocationTime and LastFailedInvocationTime.   The rule's Lambda function is failing to send evaluation results to Config. Verify that the role you assigned to your configuration recorder includes the config:PutEvaluations permission. If the rule is a custom rule, verify that the Lambda execution role includes the config:PutEvaluations permission.   The rule's Lambda function has returned NOT_APPLICABLE for all evaluation results. This can occur if the resources were deleted or removed from the rule's scope.  
   */
  describeComplianceByConfigRule(callback?: (err: AWSError, data: ConfigService.Types.DescribeComplianceByConfigRuleResponse) => void): Request<ConfigService.Types.DescribeComplianceByConfigRuleResponse, AWSError>;
  /**
   * Indicates whether the specified Amazon Web Services resources are compliant. If a resource is noncompliant, this action returns the number of Config rules that the resource does not comply with. A resource is compliant if it complies with all the Config rules that evaluate it. It is noncompliant if it does not comply with one or more of these rules. If Config has no current evaluation results for the resource, it returns INSUFFICIENT_DATA. This result might indicate one of the following conditions about the rules that evaluate the resource:   Config has never invoked an evaluation for the rule. To check whether it has, use the DescribeConfigRuleEvaluationStatus action to get the LastSuccessfulInvocationTime and LastFailedInvocationTime.   The rule's Lambda function is failing to send evaluation results to Config. Verify that the role that you assigned to your configuration recorder includes the config:PutEvaluations permission. If the rule is a custom rule, verify that the Lambda execution role includes the config:PutEvaluations permission.   The rule's Lambda function has returned NOT_APPLICABLE for all evaluation results. This can occur if the resources were deleted or removed from the rule's scope.  
   */
  describeComplianceByResource(params: ConfigService.Types.DescribeComplianceByResourceRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeComplianceByResourceResponse) => void): Request<ConfigService.Types.DescribeComplianceByResourceResponse, AWSError>;
  /**
   * Indicates whether the specified Amazon Web Services resources are compliant. If a resource is noncompliant, this action returns the number of Config rules that the resource does not comply with. A resource is compliant if it complies with all the Config rules that evaluate it. It is noncompliant if it does not comply with one or more of these rules. If Config has no current evaluation results for the resource, it returns INSUFFICIENT_DATA. This result might indicate one of the following conditions about the rules that evaluate the resource:   Config has never invoked an evaluation for the rule. To check whether it has, use the DescribeConfigRuleEvaluationStatus action to get the LastSuccessfulInvocationTime and LastFailedInvocationTime.   The rule's Lambda function is failing to send evaluation results to Config. Verify that the role that you assigned to your configuration recorder includes the config:PutEvaluations permission. If the rule is a custom rule, verify that the Lambda execution role includes the config:PutEvaluations permission.   The rule's Lambda function has returned NOT_APPLICABLE for all evaluation results. This can occur if the resources were deleted or removed from the rule's scope.  
   */
  describeComplianceByResource(callback?: (err: AWSError, data: ConfigService.Types.DescribeComplianceByResourceResponse) => void): Request<ConfigService.Types.DescribeComplianceByResourceResponse, AWSError>;
  /**
   * Returns status information for each of your Config managed rules. The status includes information such as the last time Config invoked the rule, the last time Config failed to invoke the rule, and the related error for the last failure.
   */
  describeConfigRuleEvaluationStatus(params: ConfigService.Types.DescribeConfigRuleEvaluationStatusRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigRuleEvaluationStatusResponse) => void): Request<ConfigService.Types.DescribeConfigRuleEvaluationStatusResponse, AWSError>;
  /**
   * Returns status information for each of your Config managed rules. The status includes information such as the last time Config invoked the rule, the last time Config failed to invoke the rule, and the related error for the last failure.
   */
  describeConfigRuleEvaluationStatus(callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigRuleEvaluationStatusResponse) => void): Request<ConfigService.Types.DescribeConfigRuleEvaluationStatusResponse, AWSError>;
  /**
   * Returns details about your Config rules.
   */
  describeConfigRules(params: ConfigService.Types.DescribeConfigRulesRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigRulesResponse) => void): Request<ConfigService.Types.DescribeConfigRulesResponse, AWSError>;
  /**
   * Returns details about your Config rules.
   */
  describeConfigRules(callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigRulesResponse) => void): Request<ConfigService.Types.DescribeConfigRulesResponse, AWSError>;
  /**
   * Returns status information for sources within an aggregator. The status includes information about the last time Config verified authorization between the source account and an aggregator account. In case of a failure, the status contains the related error code or message. 
   */
  describeConfigurationAggregatorSourcesStatus(params: ConfigService.Types.DescribeConfigurationAggregatorSourcesStatusRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigurationAggregatorSourcesStatusResponse) => void): Request<ConfigService.Types.DescribeConfigurationAggregatorSourcesStatusResponse, AWSError>;
  /**
   * Returns status information for sources within an aggregator. The status includes information about the last time Config verified authorization between the source account and an aggregator account. In case of a failure, the status contains the related error code or message. 
   */
  describeConfigurationAggregatorSourcesStatus(callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigurationAggregatorSourcesStatusResponse) => void): Request<ConfigService.Types.DescribeConfigurationAggregatorSourcesStatusResponse, AWSError>;
  /**
   * Returns the details of one or more configuration aggregators. If the configuration aggregator is not specified, this action returns the details for all the configuration aggregators associated with the account. 
   */
  describeConfigurationAggregators(params: ConfigService.Types.DescribeConfigurationAggregatorsRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigurationAggregatorsResponse) => void): Request<ConfigService.Types.DescribeConfigurationAggregatorsResponse, AWSError>;
  /**
   * Returns the details of one or more configuration aggregators. If the configuration aggregator is not specified, this action returns the details for all the configuration aggregators associated with the account. 
   */
  describeConfigurationAggregators(callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigurationAggregatorsResponse) => void): Request<ConfigService.Types.DescribeConfigurationAggregatorsResponse, AWSError>;
  /**
   * Returns the current status of the specified configuration recorder. If a configuration recorder is not specified, this action returns the status of all configuration recorders associated with the account.  Currently, you can specify only one configuration recorder per region in your account. 
   */
  describeConfigurationRecorderStatus(params: ConfigService.Types.DescribeConfigurationRecorderStatusRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigurationRecorderStatusResponse) => void): Request<ConfigService.Types.DescribeConfigurationRecorderStatusResponse, AWSError>;
  /**
   * Returns the current status of the specified configuration recorder. If a configuration recorder is not specified, this action returns the status of all configuration recorders associated with the account.  Currently, you can specify only one configuration recorder per region in your account. 
   */
  describeConfigurationRecorderStatus(callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigurationRecorderStatusResponse) => void): Request<ConfigService.Types.DescribeConfigurationRecorderStatusResponse, AWSError>;
  /**
   * Returns the details for the specified configuration recorders. If the configuration recorder is not specified, this action returns the details for all configuration recorders associated with the account.  Currently, you can specify only one configuration recorder per region in your account. 
   */
  describeConfigurationRecorders(params: ConfigService.Types.DescribeConfigurationRecordersRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigurationRecordersResponse) => void): Request<ConfigService.Types.DescribeConfigurationRecordersResponse, AWSError>;
  /**
   * Returns the details for the specified configuration recorders. If the configuration recorder is not specified, this action returns the details for all configuration recorders associated with the account.  Currently, you can specify only one configuration recorder per region in your account. 
   */
  describeConfigurationRecorders(callback?: (err: AWSError, data: ConfigService.Types.DescribeConfigurationRecordersResponse) => void): Request<ConfigService.Types.DescribeConfigurationRecordersResponse, AWSError>;
  /**
   * Returns compliance details for each rule in that conformance pack.  You must provide exact rule names. 
   */
  describeConformancePackCompliance(params: ConfigService.Types.DescribeConformancePackComplianceRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConformancePackComplianceResponse) => void): Request<ConfigService.Types.DescribeConformancePackComplianceResponse, AWSError>;
  /**
   * Returns compliance details for each rule in that conformance pack.  You must provide exact rule names. 
   */
  describeConformancePackCompliance(callback?: (err: AWSError, data: ConfigService.Types.DescribeConformancePackComplianceResponse) => void): Request<ConfigService.Types.DescribeConformancePackComplianceResponse, AWSError>;
  /**
   * Provides one or more conformance packs deployment status.  If there are no conformance packs then you will see an empty result. 
   */
  describeConformancePackStatus(params: ConfigService.Types.DescribeConformancePackStatusRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConformancePackStatusResponse) => void): Request<ConfigService.Types.DescribeConformancePackStatusResponse, AWSError>;
  /**
   * Provides one or more conformance packs deployment status.  If there are no conformance packs then you will see an empty result. 
   */
  describeConformancePackStatus(callback?: (err: AWSError, data: ConfigService.Types.DescribeConformancePackStatusResponse) => void): Request<ConfigService.Types.DescribeConformancePackStatusResponse, AWSError>;
  /**
   * Returns a list of one or more conformance packs.
   */
  describeConformancePacks(params: ConfigService.Types.DescribeConformancePacksRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeConformancePacksResponse) => void): Request<ConfigService.Types.DescribeConformancePacksResponse, AWSError>;
  /**
   * Returns a list of one or more conformance packs.
   */
  describeConformancePacks(callback?: (err: AWSError, data: ConfigService.Types.DescribeConformancePacksResponse) => void): Request<ConfigService.Types.DescribeConformancePacksResponse, AWSError>;
  /**
   * Returns the current status of the specified delivery channel. If a delivery channel is not specified, this action returns the current status of all delivery channels associated with the account.  Currently, you can specify only one delivery channel per region in your account. 
   */
  describeDeliveryChannelStatus(params: ConfigService.Types.DescribeDeliveryChannelStatusRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeDeliveryChannelStatusResponse) => void): Request<ConfigService.Types.DescribeDeliveryChannelStatusResponse, AWSError>;
  /**
   * Returns the current status of the specified delivery channel. If a delivery channel is not specified, this action returns the current status of all delivery channels associated with the account.  Currently, you can specify only one delivery channel per region in your account. 
   */
  describeDeliveryChannelStatus(callback?: (err: AWSError, data: ConfigService.Types.DescribeDeliveryChannelStatusResponse) => void): Request<ConfigService.Types.DescribeDeliveryChannelStatusResponse, AWSError>;
  /**
   * Returns details about the specified delivery channel. If a delivery channel is not specified, this action returns the details of all delivery channels associated with the account.  Currently, you can specify only one delivery channel per region in your account. 
   */
  describeDeliveryChannels(params: ConfigService.Types.DescribeDeliveryChannelsRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeDeliveryChannelsResponse) => void): Request<ConfigService.Types.DescribeDeliveryChannelsResponse, AWSError>;
  /**
   * Returns details about the specified delivery channel. If a delivery channel is not specified, this action returns the details of all delivery channels associated with the account.  Currently, you can specify only one delivery channel per region in your account. 
   */
  describeDeliveryChannels(callback?: (err: AWSError, data: ConfigService.Types.DescribeDeliveryChannelsResponse) => void): Request<ConfigService.Types.DescribeDeliveryChannelsResponse, AWSError>;
  /**
   * Provides organization config rule deployment status for an organization.  The status is not considered successful until organization config rule is successfully deployed in all the member accounts with an exception of excluded accounts. When you specify the limit and the next token, you receive a paginated response. Limit and next token are not applicable if you specify organization config rule names. It is only applicable, when you request all the organization config rules. 
   */
  describeOrganizationConfigRuleStatuses(params: ConfigService.Types.DescribeOrganizationConfigRuleStatusesRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeOrganizationConfigRuleStatusesResponse) => void): Request<ConfigService.Types.DescribeOrganizationConfigRuleStatusesResponse, AWSError>;
  /**
   * Provides organization config rule deployment status for an organization.  The status is not considered successful until organization config rule is successfully deployed in all the member accounts with an exception of excluded accounts. When you specify the limit and the next token, you receive a paginated response. Limit and next token are not applicable if you specify organization config rule names. It is only applicable, when you request all the organization config rules. 
   */
  describeOrganizationConfigRuleStatuses(callback?: (err: AWSError, data: ConfigService.Types.DescribeOrganizationConfigRuleStatusesResponse) => void): Request<ConfigService.Types.DescribeOrganizationConfigRuleStatusesResponse, AWSError>;
  /**
   * Returns a list of organization config rules.   When you specify the limit and the next token, you receive a paginated response. Limit and next token are not applicable if you specify organization config rule names. It is only applicable, when you request all the organization config rules. 
   */
  describeOrganizationConfigRules(params: ConfigService.Types.DescribeOrganizationConfigRulesRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeOrganizationConfigRulesResponse) => void): Request<ConfigService.Types.DescribeOrganizationConfigRulesResponse, AWSError>;
  /**
   * Returns a list of organization config rules.   When you specify the limit and the next token, you receive a paginated response. Limit and next token are not applicable if you specify organization config rule names. It is only applicable, when you request all the organization config rules. 
   */
  describeOrganizationConfigRules(callback?: (err: AWSError, data: ConfigService.Types.DescribeOrganizationConfigRulesResponse) => void): Request<ConfigService.Types.DescribeOrganizationConfigRulesResponse, AWSError>;
  /**
   * Provides organization conformance pack deployment status for an organization.   The status is not considered successful until organization conformance pack is successfully deployed in all the member accounts with an exception of excluded accounts. When you specify the limit and the next token, you receive a paginated response. Limit and next token are not applicable if you specify organization conformance pack names. They are only applicable, when you request all the organization conformance packs. 
   */
  describeOrganizationConformancePackStatuses(params: ConfigService.Types.DescribeOrganizationConformancePackStatusesRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeOrganizationConformancePackStatusesResponse) => void): Request<ConfigService.Types.DescribeOrganizationConformancePackStatusesResponse, AWSError>;
  /**
   * Provides organization conformance pack deployment status for an organization.   The status is not considered successful until organization conformance pack is successfully deployed in all the member accounts with an exception of excluded accounts. When you specify the limit and the next token, you receive a paginated response. Limit and next token are not applicable if you specify organization conformance pack names. They are only applicable, when you request all the organization conformance packs. 
   */
  describeOrganizationConformancePackStatuses(callback?: (err: AWSError, data: ConfigService.Types.DescribeOrganizationConformancePackStatusesResponse) => void): Request<ConfigService.Types.DescribeOrganizationConformancePackStatusesResponse, AWSError>;
  /**
   * Returns a list of organization conformance packs.   When you specify the limit and the next token, you receive a paginated response.  Limit and next token are not applicable if you specify organization conformance packs names. They are only applicable, when you request all the organization conformance packs.  
   */
  describeOrganizationConformancePacks(params: ConfigService.Types.DescribeOrganizationConformancePacksRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeOrganizationConformancePacksResponse) => void): Request<ConfigService.Types.DescribeOrganizationConformancePacksResponse, AWSError>;
  /**
   * Returns a list of organization conformance packs.   When you specify the limit and the next token, you receive a paginated response.  Limit and next token are not applicable if you specify organization conformance packs names. They are only applicable, when you request all the organization conformance packs.  
   */
  describeOrganizationConformancePacks(callback?: (err: AWSError, data: ConfigService.Types.DescribeOrganizationConformancePacksResponse) => void): Request<ConfigService.Types.DescribeOrganizationConformancePacksResponse, AWSError>;
  /**
   * Returns a list of all pending aggregation requests.
   */
  describePendingAggregationRequests(params: ConfigService.Types.DescribePendingAggregationRequestsRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribePendingAggregationRequestsResponse) => void): Request<ConfigService.Types.DescribePendingAggregationRequestsResponse, AWSError>;
  /**
   * Returns a list of all pending aggregation requests.
   */
  describePendingAggregationRequests(callback?: (err: AWSError, data: ConfigService.Types.DescribePendingAggregationRequestsResponse) => void): Request<ConfigService.Types.DescribePendingAggregationRequestsResponse, AWSError>;
  /**
   * Returns the details of one or more remediation configurations.
   */
  describeRemediationConfigurations(params: ConfigService.Types.DescribeRemediationConfigurationsRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeRemediationConfigurationsResponse) => void): Request<ConfigService.Types.DescribeRemediationConfigurationsResponse, AWSError>;
  /**
   * Returns the details of one or more remediation configurations.
   */
  describeRemediationConfigurations(callback?: (err: AWSError, data: ConfigService.Types.DescribeRemediationConfigurationsResponse) => void): Request<ConfigService.Types.DescribeRemediationConfigurationsResponse, AWSError>;
  /**
   * Returns the details of one or more remediation exceptions. A detailed view of a remediation exception for a set of resources that includes an explanation of an exception and the time when the exception will be deleted. When you specify the limit and the next token, you receive a paginated response.   Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource. Remediation exceptions blocks auto-remediation until the exception is cleared. When you specify the limit and the next token, you receive a paginated response.  Limit and next token are not applicable if you request resources in batch. It is only applicable, when you request all resources. 
   */
  describeRemediationExceptions(params: ConfigService.Types.DescribeRemediationExceptionsRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeRemediationExceptionsResponse) => void): Request<ConfigService.Types.DescribeRemediationExceptionsResponse, AWSError>;
  /**
   * Returns the details of one or more remediation exceptions. A detailed view of a remediation exception for a set of resources that includes an explanation of an exception and the time when the exception will be deleted. When you specify the limit and the next token, you receive a paginated response.   Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource. Remediation exceptions blocks auto-remediation until the exception is cleared. When you specify the limit and the next token, you receive a paginated response.  Limit and next token are not applicable if you request resources in batch. It is only applicable, when you request all resources. 
   */
  describeRemediationExceptions(callback?: (err: AWSError, data: ConfigService.Types.DescribeRemediationExceptionsResponse) => void): Request<ConfigService.Types.DescribeRemediationExceptionsResponse, AWSError>;
  /**
   * Provides a detailed view of a Remediation Execution for a set of resources including state, timestamps for when steps for the remediation execution occur, and any error messages for steps that have failed. When you specify the limit and the next token, you receive a paginated response.
   */
  describeRemediationExecutionStatus(params: ConfigService.Types.DescribeRemediationExecutionStatusRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeRemediationExecutionStatusResponse) => void): Request<ConfigService.Types.DescribeRemediationExecutionStatusResponse, AWSError>;
  /**
   * Provides a detailed view of a Remediation Execution for a set of resources including state, timestamps for when steps for the remediation execution occur, and any error messages for steps that have failed. When you specify the limit and the next token, you receive a paginated response.
   */
  describeRemediationExecutionStatus(callback?: (err: AWSError, data: ConfigService.Types.DescribeRemediationExecutionStatusResponse) => void): Request<ConfigService.Types.DescribeRemediationExecutionStatusResponse, AWSError>;
  /**
   * Returns the details of one or more retention configurations. If the retention configuration name is not specified, this action returns the details for all the retention configurations for that account.  Currently, Config supports only one retention configuration per region in your account. 
   */
  describeRetentionConfigurations(params: ConfigService.Types.DescribeRetentionConfigurationsRequest, callback?: (err: AWSError, data: ConfigService.Types.DescribeRetentionConfigurationsResponse) => void): Request<ConfigService.Types.DescribeRetentionConfigurationsResponse, AWSError>;
  /**
   * Returns the details of one or more retention configurations. If the retention configuration name is not specified, this action returns the details for all the retention configurations for that account.  Currently, Config supports only one retention configuration per region in your account. 
   */
  describeRetentionConfigurations(callback?: (err: AWSError, data: ConfigService.Types.DescribeRetentionConfigurationsResponse) => void): Request<ConfigService.Types.DescribeRetentionConfigurationsResponse, AWSError>;
  /**
   * Returns the evaluation results for the specified Config rule for a specific resource in a rule. The results indicate which Amazon Web Services resources were evaluated by the rule, when each resource was last evaluated, and whether each resource complies with the rule.   The results can return an empty result page. But if you have a nextToken, the results are displayed on the next page. 
   */
  getAggregateComplianceDetailsByConfigRule(params: ConfigService.Types.GetAggregateComplianceDetailsByConfigRuleRequest, callback?: (err: AWSError, data: ConfigService.Types.GetAggregateComplianceDetailsByConfigRuleResponse) => void): Request<ConfigService.Types.GetAggregateComplianceDetailsByConfigRuleResponse, AWSError>;
  /**
   * Returns the evaluation results for the specified Config rule for a specific resource in a rule. The results indicate which Amazon Web Services resources were evaluated by the rule, when each resource was last evaluated, and whether each resource complies with the rule.   The results can return an empty result page. But if you have a nextToken, the results are displayed on the next page. 
   */
  getAggregateComplianceDetailsByConfigRule(callback?: (err: AWSError, data: ConfigService.Types.GetAggregateComplianceDetailsByConfigRuleResponse) => void): Request<ConfigService.Types.GetAggregateComplianceDetailsByConfigRuleResponse, AWSError>;
  /**
   * Returns the number of compliant and noncompliant rules for one or more accounts and regions in an aggregator.  The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page. 
   */
  getAggregateConfigRuleComplianceSummary(params: ConfigService.Types.GetAggregateConfigRuleComplianceSummaryRequest, callback?: (err: AWSError, data: ConfigService.Types.GetAggregateConfigRuleComplianceSummaryResponse) => void): Request<ConfigService.Types.GetAggregateConfigRuleComplianceSummaryResponse, AWSError>;
  /**
   * Returns the number of compliant and noncompliant rules for one or more accounts and regions in an aggregator.  The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page. 
   */
  getAggregateConfigRuleComplianceSummary(callback?: (err: AWSError, data: ConfigService.Types.GetAggregateConfigRuleComplianceSummaryResponse) => void): Request<ConfigService.Types.GetAggregateConfigRuleComplianceSummaryResponse, AWSError>;
  /**
   * Returns the count of compliant and noncompliant conformance packs across all Amazon Web Services accounts and Amazon Web Services Regions in an aggregator. You can filter based on Amazon Web Services account ID or Amazon Web Services Region.  The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page. 
   */
  getAggregateConformancePackComplianceSummary(params: ConfigService.Types.GetAggregateConformancePackComplianceSummaryRequest, callback?: (err: AWSError, data: ConfigService.Types.GetAggregateConformancePackComplianceSummaryResponse) => void): Request<ConfigService.Types.GetAggregateConformancePackComplianceSummaryResponse, AWSError>;
  /**
   * Returns the count of compliant and noncompliant conformance packs across all Amazon Web Services accounts and Amazon Web Services Regions in an aggregator. You can filter based on Amazon Web Services account ID or Amazon Web Services Region.  The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page. 
   */
  getAggregateConformancePackComplianceSummary(callback?: (err: AWSError, data: ConfigService.Types.GetAggregateConformancePackComplianceSummaryResponse) => void): Request<ConfigService.Types.GetAggregateConformancePackComplianceSummaryResponse, AWSError>;
  /**
   * Returns the resource counts across accounts and regions that are present in your Config aggregator. You can request the resource counts by providing filters and GroupByKey. For example, if the input contains accountID 12345678910 and region us-east-1 in filters, the API returns the count of resources in account ID 12345678910 and region us-east-1. If the input contains ACCOUNT_ID as a GroupByKey, the API returns resource counts for all source accounts that are present in your aggregator.
   */
  getAggregateDiscoveredResourceCounts(params: ConfigService.Types.GetAggregateDiscoveredResourceCountsRequest, callback?: (err: AWSError, data: ConfigService.Types.GetAggregateDiscoveredResourceCountsResponse) => void): Request<ConfigService.Types.GetAggregateDiscoveredResourceCountsResponse, AWSError>;
  /**
   * Returns the resource counts across accounts and regions that are present in your Config aggregator. You can request the resource counts by providing filters and GroupByKey. For example, if the input contains accountID 12345678910 and region us-east-1 in filters, the API returns the count of resources in account ID 12345678910 and region us-east-1. If the input contains ACCOUNT_ID as a GroupByKey, the API returns resource counts for all source accounts that are present in your aggregator.
   */
  getAggregateDiscoveredResourceCounts(callback?: (err: AWSError, data: ConfigService.Types.GetAggregateDiscoveredResourceCountsResponse) => void): Request<ConfigService.Types.GetAggregateDiscoveredResourceCountsResponse, AWSError>;
  /**
   * Returns configuration item that is aggregated for your specific resource in a specific source account and region.
   */
  getAggregateResourceConfig(params: ConfigService.Types.GetAggregateResourceConfigRequest, callback?: (err: AWSError, data: ConfigService.Types.GetAggregateResourceConfigResponse) => void): Request<ConfigService.Types.GetAggregateResourceConfigResponse, AWSError>;
  /**
   * Returns configuration item that is aggregated for your specific resource in a specific source account and region.
   */
  getAggregateResourceConfig(callback?: (err: AWSError, data: ConfigService.Types.GetAggregateResourceConfigResponse) => void): Request<ConfigService.Types.GetAggregateResourceConfigResponse, AWSError>;
  /**
   * Returns the evaluation results for the specified Config rule. The results indicate which Amazon Web Services resources were evaluated by the rule, when each resource was last evaluated, and whether each resource complies with the rule.
   */
  getComplianceDetailsByConfigRule(params: ConfigService.Types.GetComplianceDetailsByConfigRuleRequest, callback?: (err: AWSError, data: ConfigService.Types.GetComplianceDetailsByConfigRuleResponse) => void): Request<ConfigService.Types.GetComplianceDetailsByConfigRuleResponse, AWSError>;
  /**
   * Returns the evaluation results for the specified Config rule. The results indicate which Amazon Web Services resources were evaluated by the rule, when each resource was last evaluated, and whether each resource complies with the rule.
   */
  getComplianceDetailsByConfigRule(callback?: (err: AWSError, data: ConfigService.Types.GetComplianceDetailsByConfigRuleResponse) => void): Request<ConfigService.Types.GetComplianceDetailsByConfigRuleResponse, AWSError>;
  /**
   * Returns the evaluation results for the specified Amazon Web Services resource. The results indicate which Config rules were used to evaluate the resource, when each rule was last used, and whether the resource complies with each rule.
   */
  getComplianceDetailsByResource(params: ConfigService.Types.GetComplianceDetailsByResourceRequest, callback?: (err: AWSError, data: ConfigService.Types.GetComplianceDetailsByResourceResponse) => void): Request<ConfigService.Types.GetComplianceDetailsByResourceResponse, AWSError>;
  /**
   * Returns the evaluation results for the specified Amazon Web Services resource. The results indicate which Config rules were used to evaluate the resource, when each rule was last used, and whether the resource complies with each rule.
   */
  getComplianceDetailsByResource(callback?: (err: AWSError, data: ConfigService.Types.GetComplianceDetailsByResourceResponse) => void): Request<ConfigService.Types.GetComplianceDetailsByResourceResponse, AWSError>;
  /**
   * Returns the number of Config rules that are compliant and noncompliant, up to a maximum of 25 for each.
   */
  getComplianceSummaryByConfigRule(callback?: (err: AWSError, data: ConfigService.Types.GetComplianceSummaryByConfigRuleResponse) => void): Request<ConfigService.Types.GetComplianceSummaryByConfigRuleResponse, AWSError>;
  /**
   * Returns the number of resources that are compliant and the number that are noncompliant. You can specify one or more resource types to get these numbers for each resource type. The maximum number returned is 100.
   */
  getComplianceSummaryByResourceType(params: ConfigService.Types.GetComplianceSummaryByResourceTypeRequest, callback?: (err: AWSError, data: ConfigService.Types.GetComplianceSummaryByResourceTypeResponse) => void): Request<ConfigService.Types.GetComplianceSummaryByResourceTypeResponse, AWSError>;
  /**
   * Returns the number of resources that are compliant and the number that are noncompliant. You can specify one or more resource types to get these numbers for each resource type. The maximum number returned is 100.
   */
  getComplianceSummaryByResourceType(callback?: (err: AWSError, data: ConfigService.Types.GetComplianceSummaryByResourceTypeResponse) => void): Request<ConfigService.Types.GetComplianceSummaryByResourceTypeResponse, AWSError>;
  /**
   * Returns compliance details of a conformance pack for all Amazon Web Services resources that are monitered by conformance pack.
   */
  getConformancePackComplianceDetails(params: ConfigService.Types.GetConformancePackComplianceDetailsRequest, callback?: (err: AWSError, data: ConfigService.Types.GetConformancePackComplianceDetailsResponse) => void): Request<ConfigService.Types.GetConformancePackComplianceDetailsResponse, AWSError>;
  /**
   * Returns compliance details of a conformance pack for all Amazon Web Services resources that are monitered by conformance pack.
   */
  getConformancePackComplianceDetails(callback?: (err: AWSError, data: ConfigService.Types.GetConformancePackComplianceDetailsResponse) => void): Request<ConfigService.Types.GetConformancePackComplianceDetailsResponse, AWSError>;
  /**
   * Returns compliance details for the conformance pack based on the cumulative compliance results of all the rules in that conformance pack.
   */
  getConformancePackComplianceSummary(params: ConfigService.Types.GetConformancePackComplianceSummaryRequest, callback?: (err: AWSError, data: ConfigService.Types.GetConformancePackComplianceSummaryResponse) => void): Request<ConfigService.Types.GetConformancePackComplianceSummaryResponse, AWSError>;
  /**
   * Returns compliance details for the conformance pack based on the cumulative compliance results of all the rules in that conformance pack.
   */
  getConformancePackComplianceSummary(callback?: (err: AWSError, data: ConfigService.Types.GetConformancePackComplianceSummaryResponse) => void): Request<ConfigService.Types.GetConformancePackComplianceSummaryResponse, AWSError>;
  /**
   * Returns the resource types, the number of each resource type, and the total number of resources that Config is recording in this region for your Amazon Web Services account.   Example    Config is recording three resource types in the US East (Ohio) Region for your account: 25 EC2 instances, 20 IAM users, and 15 S3 buckets.   You make a call to the GetDiscoveredResourceCounts action and specify that you want all resource types.    Config returns the following:   The resource types (EC2 instances, IAM users, and S3 buckets).   The number of each resource type (25, 20, and 15).   The total number of all resources (60).     The response is paginated. By default, Config lists 100 ResourceCount objects on each page. You can customize this number with the limit parameter. The response includes a nextToken string. To get the next page of results, run the request again and specify the string for the nextToken parameter.  If you make a call to the GetDiscoveredResourceCounts action, you might not immediately receive resource counts in the following situations:   You are a new Config customer.   You just enabled resource recording.   It might take a few minutes for Config to record and count your resources. Wait a few minutes and then retry the GetDiscoveredResourceCounts action.  
   */
  getDiscoveredResourceCounts(params: ConfigService.Types.GetDiscoveredResourceCountsRequest, callback?: (err: AWSError, data: ConfigService.Types.GetDiscoveredResourceCountsResponse) => void): Request<ConfigService.Types.GetDiscoveredResourceCountsResponse, AWSError>;
  /**
   * Returns the resource types, the number of each resource type, and the total number of resources that Config is recording in this region for your Amazon Web Services account.   Example    Config is recording three resource types in the US East (Ohio) Region for your account: 25 EC2 instances, 20 IAM users, and 15 S3 buckets.   You make a call to the GetDiscoveredResourceCounts action and specify that you want all resource types.    Config returns the following:   The resource types (EC2 instances, IAM users, and S3 buckets).   The number of each resource type (25, 20, and 15).   The total number of all resources (60).     The response is paginated. By default, Config lists 100 ResourceCount objects on each page. You can customize this number with the limit parameter. The response includes a nextToken string. To get the next page of results, run the request again and specify the string for the nextToken parameter.  If you make a call to the GetDiscoveredResourceCounts action, you might not immediately receive resource counts in the following situations:   You are a new Config customer.   You just enabled resource recording.   It might take a few minutes for Config to record and count your resources. Wait a few minutes and then retry the GetDiscoveredResourceCounts action.  
   */
  getDiscoveredResourceCounts(callback?: (err: AWSError, data: ConfigService.Types.GetDiscoveredResourceCountsResponse) => void): Request<ConfigService.Types.GetDiscoveredResourceCountsResponse, AWSError>;
  /**
   * Returns detailed status for each member account within an organization for a given organization config rule.
   */
  getOrganizationConfigRuleDetailedStatus(params: ConfigService.Types.GetOrganizationConfigRuleDetailedStatusRequest, callback?: (err: AWSError, data: ConfigService.Types.GetOrganizationConfigRuleDetailedStatusResponse) => void): Request<ConfigService.Types.GetOrganizationConfigRuleDetailedStatusResponse, AWSError>;
  /**
   * Returns detailed status for each member account within an organization for a given organization config rule.
   */
  getOrganizationConfigRuleDetailedStatus(callback?: (err: AWSError, data: ConfigService.Types.GetOrganizationConfigRuleDetailedStatusResponse) => void): Request<ConfigService.Types.GetOrganizationConfigRuleDetailedStatusResponse, AWSError>;
  /**
   * Returns detailed status for each member account within an organization for a given organization conformance pack.
   */
  getOrganizationConformancePackDetailedStatus(params: ConfigService.Types.GetOrganizationConformancePackDetailedStatusRequest, callback?: (err: AWSError, data: ConfigService.Types.GetOrganizationConformancePackDetailedStatusResponse) => void): Request<ConfigService.Types.GetOrganizationConformancePackDetailedStatusResponse, AWSError>;
  /**
   * Returns detailed status for each member account within an organization for a given organization conformance pack.
   */
  getOrganizationConformancePackDetailedStatus(callback?: (err: AWSError, data: ConfigService.Types.GetOrganizationConformancePackDetailedStatusResponse) => void): Request<ConfigService.Types.GetOrganizationConformancePackDetailedStatusResponse, AWSError>;
  /**
   * Returns a list of ConfigurationItems for the specified resource. The list contains details about each state of the resource during the specified time interval. If you specified a retention period to retain your ConfigurationItems between a minimum of 30 days and a maximum of 7 years (2557 days), Config returns the ConfigurationItems for the specified retention period.  The response is paginated. By default, Config returns a limit of 10 configuration items per page. You can customize this number with the limit parameter. The response includes a nextToken string. To get the next page of results, run the request again and specify the string for the nextToken parameter.  Each call to the API is limited to span a duration of seven days. It is likely that the number of records returned is smaller than the specified limit. In such cases, you can make another call, using the nextToken. 
   */
  getResourceConfigHistory(params: ConfigService.Types.GetResourceConfigHistoryRequest, callback?: (err: AWSError, data: ConfigService.Types.GetResourceConfigHistoryResponse) => void): Request<ConfigService.Types.GetResourceConfigHistoryResponse, AWSError>;
  /**
   * Returns a list of ConfigurationItems for the specified resource. The list contains details about each state of the resource during the specified time interval. If you specified a retention period to retain your ConfigurationItems between a minimum of 30 days and a maximum of 7 years (2557 days), Config returns the ConfigurationItems for the specified retention period.  The response is paginated. By default, Config returns a limit of 10 configuration items per page. You can customize this number with the limit parameter. The response includes a nextToken string. To get the next page of results, run the request again and specify the string for the nextToken parameter.  Each call to the API is limited to span a duration of seven days. It is likely that the number of records returned is smaller than the specified limit. In such cases, you can make another call, using the nextToken. 
   */
  getResourceConfigHistory(callback?: (err: AWSError, data: ConfigService.Types.GetResourceConfigHistoryResponse) => void): Request<ConfigService.Types.GetResourceConfigHistoryResponse, AWSError>;
  /**
   * Returns the details of a specific stored query.
   */
  getStoredQuery(params: ConfigService.Types.GetStoredQueryRequest, callback?: (err: AWSError, data: ConfigService.Types.GetStoredQueryResponse) => void): Request<ConfigService.Types.GetStoredQueryResponse, AWSError>;
  /**
   * Returns the details of a specific stored query.
   */
  getStoredQuery(callback?: (err: AWSError, data: ConfigService.Types.GetStoredQueryResponse) => void): Request<ConfigService.Types.GetStoredQueryResponse, AWSError>;
  /**
   * Accepts a resource type and returns a list of resource identifiers that are aggregated for a specific resource type across accounts and regions. A resource identifier includes the resource type, ID, (if available) the custom resource name, source account, and source region. You can narrow the results to include only resources that have specific resource IDs, or a resource name, or source account ID, or source region. For example, if the input consists of accountID 12345678910 and the region is us-east-1 for resource type AWS::EC2::Instance then the API returns all the EC2 instance identifiers of accountID 12345678910 and region us-east-1.
   */
  listAggregateDiscoveredResources(params: ConfigService.Types.ListAggregateDiscoveredResourcesRequest, callback?: (err: AWSError, data: ConfigService.Types.ListAggregateDiscoveredResourcesResponse) => void): Request<ConfigService.Types.ListAggregateDiscoveredResourcesResponse, AWSError>;
  /**
   * Accepts a resource type and returns a list of resource identifiers that are aggregated for a specific resource type across accounts and regions. A resource identifier includes the resource type, ID, (if available) the custom resource name, source account, and source region. You can narrow the results to include only resources that have specific resource IDs, or a resource name, or source account ID, or source region. For example, if the input consists of accountID 12345678910 and the region is us-east-1 for resource type AWS::EC2::Instance then the API returns all the EC2 instance identifiers of accountID 12345678910 and region us-east-1.
   */
  listAggregateDiscoveredResources(callback?: (err: AWSError, data: ConfigService.Types.ListAggregateDiscoveredResourcesResponse) => void): Request<ConfigService.Types.ListAggregateDiscoveredResourcesResponse, AWSError>;
  /**
   * Accepts a resource type and returns a list of resource identifiers for the resources of that type. A resource identifier includes the resource type, ID, and (if available) the custom resource name. The results consist of resources that Config has discovered, including those that Config is not currently recording. You can narrow the results to include only resources that have specific resource IDs or a resource name.  You can specify either resource IDs or a resource name, but not both, in the same request.  The response is paginated. By default, Config lists 100 resource identifiers on each page. You can customize this number with the limit parameter. The response includes a nextToken string. To get the next page of results, run the request again and specify the string for the nextToken parameter.
   */
  listDiscoveredResources(params: ConfigService.Types.ListDiscoveredResourcesRequest, callback?: (err: AWSError, data: ConfigService.Types.ListDiscoveredResourcesResponse) => void): Request<ConfigService.Types.ListDiscoveredResourcesResponse, AWSError>;
  /**
   * Accepts a resource type and returns a list of resource identifiers for the resources of that type. A resource identifier includes the resource type, ID, and (if available) the custom resource name. The results consist of resources that Config has discovered, including those that Config is not currently recording. You can narrow the results to include only resources that have specific resource IDs or a resource name.  You can specify either resource IDs or a resource name, but not both, in the same request.  The response is paginated. By default, Config lists 100 resource identifiers on each page. You can customize this number with the limit parameter. The response includes a nextToken string. To get the next page of results, run the request again and specify the string for the nextToken parameter.
   */
  listDiscoveredResources(callback?: (err: AWSError, data: ConfigService.Types.ListDiscoveredResourcesResponse) => void): Request<ConfigService.Types.ListDiscoveredResourcesResponse, AWSError>;
  /**
   * Lists the stored queries for a single Amazon Web Services account and a single Amazon Web Services Region. The default is 100. 
   */
  listStoredQueries(params: ConfigService.Types.ListStoredQueriesRequest, callback?: (err: AWSError, data: ConfigService.Types.ListStoredQueriesResponse) => void): Request<ConfigService.Types.ListStoredQueriesResponse, AWSError>;
  /**
   * Lists the stored queries for a single Amazon Web Services account and a single Amazon Web Services Region. The default is 100. 
   */
  listStoredQueries(callback?: (err: AWSError, data: ConfigService.Types.ListStoredQueriesResponse) => void): Request<ConfigService.Types.ListStoredQueriesResponse, AWSError>;
  /**
   * List the tags for Config resource.
   */
  listTagsForResource(params: ConfigService.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ConfigService.Types.ListTagsForResourceResponse) => void): Request<ConfigService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List the tags for Config resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ConfigService.Types.ListTagsForResourceResponse) => void): Request<ConfigService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Authorizes the aggregator account and region to collect data from the source account and region. 
   */
  putAggregationAuthorization(params: ConfigService.Types.PutAggregationAuthorizationRequest, callback?: (err: AWSError, data: ConfigService.Types.PutAggregationAuthorizationResponse) => void): Request<ConfigService.Types.PutAggregationAuthorizationResponse, AWSError>;
  /**
   * Authorizes the aggregator account and region to collect data from the source account and region. 
   */
  putAggregationAuthorization(callback?: (err: AWSError, data: ConfigService.Types.PutAggregationAuthorizationResponse) => void): Request<ConfigService.Types.PutAggregationAuthorizationResponse, AWSError>;
  /**
   * Adds or updates an Config rule for evaluating whether your Amazon Web Services resources comply with your desired configurations. You can use this action for custom Config rules and Config managed rules. A custom Config rule is a rule that you develop and maintain. An Config managed rule is a customizable, predefined rule that Config provides. If you are adding a new custom Config rule, you must first create the Lambda function that the rule invokes to evaluate your resources. When you use the PutConfigRule action to add the rule to Config, you must specify the Amazon Resource Name (ARN) that Lambda assigns to the function. Specify the ARN for the SourceIdentifier key. This key is part of the Source object, which is part of the ConfigRule object.  If you are adding an Config managed rule, specify the rule's identifier for the SourceIdentifier key. To reference Config managed rule identifiers, see About Config managed rules. For any new rule that you add, specify the ConfigRuleName in the ConfigRule object. Do not specify the ConfigRuleArn or the ConfigRuleId. These values are generated by Config for new rules. If you are updating a rule that you added previously, you can specify the rule by ConfigRuleName, ConfigRuleId, or ConfigRuleArn in the ConfigRule data type that you use in this request. The maximum number of rules that Config supports is 150. For information about requesting a rule limit increase, see Config Limits in the Amazon Web Services General Reference Guide. For more information about developing and using Config rules, see Evaluating Amazon Web Services resource Configurations with Config in the Config Developer Guide.
   */
  putConfigRule(params: ConfigService.Types.PutConfigRuleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates an Config rule for evaluating whether your Amazon Web Services resources comply with your desired configurations. You can use this action for custom Config rules and Config managed rules. A custom Config rule is a rule that you develop and maintain. An Config managed rule is a customizable, predefined rule that Config provides. If you are adding a new custom Config rule, you must first create the Lambda function that the rule invokes to evaluate your resources. When you use the PutConfigRule action to add the rule to Config, you must specify the Amazon Resource Name (ARN) that Lambda assigns to the function. Specify the ARN for the SourceIdentifier key. This key is part of the Source object, which is part of the ConfigRule object.  If you are adding an Config managed rule, specify the rule's identifier for the SourceIdentifier key. To reference Config managed rule identifiers, see About Config managed rules. For any new rule that you add, specify the ConfigRuleName in the ConfigRule object. Do not specify the ConfigRuleArn or the ConfigRuleId. These values are generated by Config for new rules. If you are updating a rule that you added previously, you can specify the rule by ConfigRuleName, ConfigRuleId, or ConfigRuleArn in the ConfigRule data type that you use in this request. The maximum number of rules that Config supports is 150. For information about requesting a rule limit increase, see Config Limits in the Amazon Web Services General Reference Guide. For more information about developing and using Config rules, see Evaluating Amazon Web Services resource Configurations with Config in the Config Developer Guide.
   */
  putConfigRule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates and updates the configuration aggregator with the selected source accounts and regions. The source account can be individual account(s) or an organization.  accountIds that are passed will be replaced with existing accounts. If you want to add additional accounts into the aggregator, call DescribeAggregator to get the previous accounts and then append new ones.  Config should be enabled in source accounts and regions you want to aggregate. If your source type is an organization, you must be signed in to the management account or a registered delegated administrator and all the features must be enabled in your organization. If the caller is a management account, Config calls EnableAwsServiceAccess API to enable integration between Config and Organizations. If the caller is a registered delegated administrator, Config calls ListDelegatedAdministrators API to verify whether the caller is a valid delegated administrator. To register a delegated administrator, see Register a Delegated Administrator in the Config developer guide.  
   */
  putConfigurationAggregator(params: ConfigService.Types.PutConfigurationAggregatorRequest, callback?: (err: AWSError, data: ConfigService.Types.PutConfigurationAggregatorResponse) => void): Request<ConfigService.Types.PutConfigurationAggregatorResponse, AWSError>;
  /**
   * Creates and updates the configuration aggregator with the selected source accounts and regions. The source account can be individual account(s) or an organization.  accountIds that are passed will be replaced with existing accounts. If you want to add additional accounts into the aggregator, call DescribeAggregator to get the previous accounts and then append new ones.  Config should be enabled in source accounts and regions you want to aggregate. If your source type is an organization, you must be signed in to the management account or a registered delegated administrator and all the features must be enabled in your organization. If the caller is a management account, Config calls EnableAwsServiceAccess API to enable integration between Config and Organizations. If the caller is a registered delegated administrator, Config calls ListDelegatedAdministrators API to verify whether the caller is a valid delegated administrator. To register a delegated administrator, see Register a Delegated Administrator in the Config developer guide.  
   */
  putConfigurationAggregator(callback?: (err: AWSError, data: ConfigService.Types.PutConfigurationAggregatorResponse) => void): Request<ConfigService.Types.PutConfigurationAggregatorResponse, AWSError>;
  /**
   * Creates a new configuration recorder to record the selected resource configurations. You can use this action to change the role roleARN or the recordingGroup of an existing recorder. To change the role, call the action on the existing configuration recorder and specify a role.  Currently, you can specify only one configuration recorder per region in your account. If ConfigurationRecorder does not have the recordingGroup parameter specified, the default is to record all supported resource types. 
   */
  putConfigurationRecorder(params: ConfigService.Types.PutConfigurationRecorderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a new configuration recorder to record the selected resource configurations. You can use this action to change the role roleARN or the recordingGroup of an existing recorder. To change the role, call the action on the existing configuration recorder and specify a role.  Currently, you can specify only one configuration recorder per region in your account. If ConfigurationRecorder does not have the recordingGroup parameter specified, the default is to record all supported resource types. 
   */
  putConfigurationRecorder(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates a conformance pack. A conformance pack is a collection of Config rules that can be easily deployed in an account and a region and across Amazon Web Services Organization. This API creates a service linked role AWSServiceRoleForConfigConforms in your account. The service linked role is created only when the role does not exist in your account.   You must specify either the TemplateS3Uri or the TemplateBody parameter, but not both. If you provide both Config uses the TemplateS3Uri parameter and ignores the TemplateBody parameter. 
   */
  putConformancePack(params: ConfigService.Types.PutConformancePackRequest, callback?: (err: AWSError, data: ConfigService.Types.PutConformancePackResponse) => void): Request<ConfigService.Types.PutConformancePackResponse, AWSError>;
  /**
   * Creates or updates a conformance pack. A conformance pack is a collection of Config rules that can be easily deployed in an account and a region and across Amazon Web Services Organization. This API creates a service linked role AWSServiceRoleForConfigConforms in your account. The service linked role is created only when the role does not exist in your account.   You must specify either the TemplateS3Uri or the TemplateBody parameter, but not both. If you provide both Config uses the TemplateS3Uri parameter and ignores the TemplateBody parameter. 
   */
  putConformancePack(callback?: (err: AWSError, data: ConfigService.Types.PutConformancePackResponse) => void): Request<ConfigService.Types.PutConformancePackResponse, AWSError>;
  /**
   * Creates a delivery channel object to deliver configuration information to an Amazon S3 bucket and Amazon SNS topic. Before you can create a delivery channel, you must create a configuration recorder. You can use this action to change the Amazon S3 bucket or an Amazon SNS topic of the existing delivery channel. To change the Amazon S3 bucket or an Amazon SNS topic, call this action and specify the changed values for the S3 bucket and the SNS topic. If you specify a different value for either the S3 bucket or the SNS topic, this action will keep the existing value for the parameter that is not changed.  You can have only one delivery channel per region in your account. 
   */
  putDeliveryChannel(params: ConfigService.Types.PutDeliveryChannelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a delivery channel object to deliver configuration information to an Amazon S3 bucket and Amazon SNS topic. Before you can create a delivery channel, you must create a configuration recorder. You can use this action to change the Amazon S3 bucket or an Amazon SNS topic of the existing delivery channel. To change the Amazon S3 bucket or an Amazon SNS topic, call this action and specify the changed values for the S3 bucket and the SNS topic. If you specify a different value for either the S3 bucket or the SNS topic, this action will keep the existing value for the parameter that is not changed.  You can have only one delivery channel per region in your account. 
   */
  putDeliveryChannel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Used by an Lambda function to deliver evaluation results to Config. This action is required in every Lambda function that is invoked by an Config rule.
   */
  putEvaluations(params: ConfigService.Types.PutEvaluationsRequest, callback?: (err: AWSError, data: ConfigService.Types.PutEvaluationsResponse) => void): Request<ConfigService.Types.PutEvaluationsResponse, AWSError>;
  /**
   * Used by an Lambda function to deliver evaluation results to Config. This action is required in every Lambda function that is invoked by an Config rule.
   */
  putEvaluations(callback?: (err: AWSError, data: ConfigService.Types.PutEvaluationsResponse) => void): Request<ConfigService.Types.PutEvaluationsResponse, AWSError>;
  /**
   * Add or updates the evaluations for process checks. This API checks if the rule is a process check when the name of the Config rule is provided.
   */
  putExternalEvaluation(params: ConfigService.Types.PutExternalEvaluationRequest, callback?: (err: AWSError, data: ConfigService.Types.PutExternalEvaluationResponse) => void): Request<ConfigService.Types.PutExternalEvaluationResponse, AWSError>;
  /**
   * Add or updates the evaluations for process checks. This API checks if the rule is a process check when the name of the Config rule is provided.
   */
  putExternalEvaluation(callback?: (err: AWSError, data: ConfigService.Types.PutExternalEvaluationResponse) => void): Request<ConfigService.Types.PutExternalEvaluationResponse, AWSError>;
  /**
   * Adds or updates organization config rule for your entire organization evaluating whether your Amazon Web Services resources comply with your desired configurations.  Only a master account and a delegated administrator can create or update an organization config rule. When calling this API with a delegated administrator, you must ensure Organizations ListDelegatedAdministrator permissions are added.  This API enables organization service access through the EnableAWSServiceAccess action and creates a service linked role AWSServiceRoleForConfigMultiAccountSetup in the master or delegated administrator account of your organization. The service linked role is created only when the role does not exist in the caller account. Config verifies the existence of role with GetRole action. To use this API with delegated administrator, register a delegated administrator by calling Amazon Web Services Organization register-delegated-administrator for config-multiaccountsetup.amazonaws.com.  You can use this action to create both custom Config rules and Config managed rules. If you are adding a new custom Config rule, you must first create Lambda function in the master account or a delegated administrator that the rule invokes to evaluate your resources. You also need to create an IAM role in the managed-account that can be assumed by the Lambda function. When you use the PutOrganizationConfigRule action to add the rule to Config, you must specify the Amazon Resource Name (ARN) that Lambda assigns to the function. If you are adding an Config managed rule, specify the rule's identifier for the RuleIdentifier key. The maximum number of organization config rules that Config supports is 150 and 3 delegated administrator per organization.   Prerequisite: Ensure you call EnableAllFeatures API to enable all features in an organization. Specify either OrganizationCustomRuleMetadata or OrganizationManagedRuleMetadata. 
   */
  putOrganizationConfigRule(params: ConfigService.Types.PutOrganizationConfigRuleRequest, callback?: (err: AWSError, data: ConfigService.Types.PutOrganizationConfigRuleResponse) => void): Request<ConfigService.Types.PutOrganizationConfigRuleResponse, AWSError>;
  /**
   * Adds or updates organization config rule for your entire organization evaluating whether your Amazon Web Services resources comply with your desired configurations.  Only a master account and a delegated administrator can create or update an organization config rule. When calling this API with a delegated administrator, you must ensure Organizations ListDelegatedAdministrator permissions are added.  This API enables organization service access through the EnableAWSServiceAccess action and creates a service linked role AWSServiceRoleForConfigMultiAccountSetup in the master or delegated administrator account of your organization. The service linked role is created only when the role does not exist in the caller account. Config verifies the existence of role with GetRole action. To use this API with delegated administrator, register a delegated administrator by calling Amazon Web Services Organization register-delegated-administrator for config-multiaccountsetup.amazonaws.com.  You can use this action to create both custom Config rules and Config managed rules. If you are adding a new custom Config rule, you must first create Lambda function in the master account or a delegated administrator that the rule invokes to evaluate your resources. You also need to create an IAM role in the managed-account that can be assumed by the Lambda function. When you use the PutOrganizationConfigRule action to add the rule to Config, you must specify the Amazon Resource Name (ARN) that Lambda assigns to the function. If you are adding an Config managed rule, specify the rule's identifier for the RuleIdentifier key. The maximum number of organization config rules that Config supports is 150 and 3 delegated administrator per organization.   Prerequisite: Ensure you call EnableAllFeatures API to enable all features in an organization. Specify either OrganizationCustomRuleMetadata or OrganizationManagedRuleMetadata. 
   */
  putOrganizationConfigRule(callback?: (err: AWSError, data: ConfigService.Types.PutOrganizationConfigRuleResponse) => void): Request<ConfigService.Types.PutOrganizationConfigRuleResponse, AWSError>;
  /**
   * Deploys conformance packs across member accounts in an Amazon Web Services Organization. Only a master account and a delegated administrator can call this API. When calling this API with a delegated administrator, you must ensure Organizations ListDelegatedAdministrator permissions are added. This API enables organization service access for config-multiaccountsetup.amazonaws.com through the EnableAWSServiceAccess action and creates a service linked role AWSServiceRoleForConfigMultiAccountSetup in the master or delegated administrator account of your organization. The service linked role is created only when the role does not exist in the caller account. To use this API with delegated administrator, register a delegated administrator by calling Amazon Web Services Organization register-delegate-admin for config-multiaccountsetup.amazonaws.com.  Prerequisite: Ensure you call EnableAllFeatures API to enable all features in an organization. You must specify either the TemplateS3Uri or the TemplateBody parameter, but not both. If you provide both Config uses the TemplateS3Uri parameter and ignores the TemplateBody parameter. Config sets the state of a conformance pack to CREATE_IN_PROGRESS and UPDATE_IN_PROGRESS until the conformance pack is created or updated. You cannot update a conformance pack while it is in this state. You can create 50 conformance packs with 25 Config rules in each pack and 3 delegated administrator per organization.  
   */
  putOrganizationConformancePack(params: ConfigService.Types.PutOrganizationConformancePackRequest, callback?: (err: AWSError, data: ConfigService.Types.PutOrganizationConformancePackResponse) => void): Request<ConfigService.Types.PutOrganizationConformancePackResponse, AWSError>;
  /**
   * Deploys conformance packs across member accounts in an Amazon Web Services Organization. Only a master account and a delegated administrator can call this API. When calling this API with a delegated administrator, you must ensure Organizations ListDelegatedAdministrator permissions are added. This API enables organization service access for config-multiaccountsetup.amazonaws.com through the EnableAWSServiceAccess action and creates a service linked role AWSServiceRoleForConfigMultiAccountSetup in the master or delegated administrator account of your organization. The service linked role is created only when the role does not exist in the caller account. To use this API with delegated administrator, register a delegated administrator by calling Amazon Web Services Organization register-delegate-admin for config-multiaccountsetup.amazonaws.com.  Prerequisite: Ensure you call EnableAllFeatures API to enable all features in an organization. You must specify either the TemplateS3Uri or the TemplateBody parameter, but not both. If you provide both Config uses the TemplateS3Uri parameter and ignores the TemplateBody parameter. Config sets the state of a conformance pack to CREATE_IN_PROGRESS and UPDATE_IN_PROGRESS until the conformance pack is created or updated. You cannot update a conformance pack while it is in this state. You can create 50 conformance packs with 25 Config rules in each pack and 3 delegated administrator per organization.  
   */
  putOrganizationConformancePack(callback?: (err: AWSError, data: ConfigService.Types.PutOrganizationConformancePackResponse) => void): Request<ConfigService.Types.PutOrganizationConformancePackResponse, AWSError>;
  /**
   * Adds or updates the remediation configuration with a specific Config rule with the selected target or action. The API creates the RemediationConfiguration object for the Config rule. The Config rule must already exist for you to add a remediation configuration. The target (SSM document) must exist and have permissions to use the target.   If you make backward incompatible changes to the SSM document, you must call this again to ensure the remediations can run. This API does not support adding remediation configurations for service-linked Config Rules such as Organization Config rules, the rules deployed by conformance packs, and rules deployed by Amazon Web Services Security Hub. 
   */
  putRemediationConfigurations(params: ConfigService.Types.PutRemediationConfigurationsRequest, callback?: (err: AWSError, data: ConfigService.Types.PutRemediationConfigurationsResponse) => void): Request<ConfigService.Types.PutRemediationConfigurationsResponse, AWSError>;
  /**
   * Adds or updates the remediation configuration with a specific Config rule with the selected target or action. The API creates the RemediationConfiguration object for the Config rule. The Config rule must already exist for you to add a remediation configuration. The target (SSM document) must exist and have permissions to use the target.   If you make backward incompatible changes to the SSM document, you must call this again to ensure the remediations can run. This API does not support adding remediation configurations for service-linked Config Rules such as Organization Config rules, the rules deployed by conformance packs, and rules deployed by Amazon Web Services Security Hub. 
   */
  putRemediationConfigurations(callback?: (err: AWSError, data: ConfigService.Types.PutRemediationConfigurationsResponse) => void): Request<ConfigService.Types.PutRemediationConfigurationsResponse, AWSError>;
  /**
   * A remediation exception is when a specific resource is no longer considered for auto-remediation. This API adds a new exception or updates an existing exception for a specific resource with a specific Config rule.   Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource. Remediation exceptions blocks auto-remediation until the exception is cleared. 
   */
  putRemediationExceptions(params: ConfigService.Types.PutRemediationExceptionsRequest, callback?: (err: AWSError, data: ConfigService.Types.PutRemediationExceptionsResponse) => void): Request<ConfigService.Types.PutRemediationExceptionsResponse, AWSError>;
  /**
   * A remediation exception is when a specific resource is no longer considered for auto-remediation. This API adds a new exception or updates an existing exception for a specific resource with a specific Config rule.   Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource. Remediation exceptions blocks auto-remediation until the exception is cleared. 
   */
  putRemediationExceptions(callback?: (err: AWSError, data: ConfigService.Types.PutRemediationExceptionsResponse) => void): Request<ConfigService.Types.PutRemediationExceptionsResponse, AWSError>;
  /**
   * Records the configuration state for the resource provided in the request. The configuration state of a resource is represented in Config as Configuration Items. Once this API records the configuration item, you can retrieve the list of configuration items for the custom resource type using existing Config APIs.   The custom resource type must be registered with CloudFormation. This API accepts the configuration item registered with CloudFormation. When you call this API, Config only stores configuration state of the resource provided in the request. This API does not change or remediate the configuration of the resource.  Write-only schema properites are not recorded as part of the published configuration item. 
   */
  putResourceConfig(params: ConfigService.Types.PutResourceConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Records the configuration state for the resource provided in the request. The configuration state of a resource is represented in Config as Configuration Items. Once this API records the configuration item, you can retrieve the list of configuration items for the custom resource type using existing Config APIs.   The custom resource type must be registered with CloudFormation. This API accepts the configuration item registered with CloudFormation. When you call this API, Config only stores configuration state of the resource provided in the request. This API does not change or remediate the configuration of the resource.  Write-only schema properites are not recorded as part of the published configuration item. 
   */
  putResourceConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates and updates the retention configuration with details about retention period (number of days) that Config stores your historical information. The API creates the RetentionConfiguration object and names the object as default. When you have a RetentionConfiguration object named default, calling the API modifies the default object.   Currently, Config supports only one retention configuration per region in your account. 
   */
  putRetentionConfiguration(params: ConfigService.Types.PutRetentionConfigurationRequest, callback?: (err: AWSError, data: ConfigService.Types.PutRetentionConfigurationResponse) => void): Request<ConfigService.Types.PutRetentionConfigurationResponse, AWSError>;
  /**
   * Creates and updates the retention configuration with details about retention period (number of days) that Config stores your historical information. The API creates the RetentionConfiguration object and names the object as default. When you have a RetentionConfiguration object named default, calling the API modifies the default object.   Currently, Config supports only one retention configuration per region in your account. 
   */
  putRetentionConfiguration(callback?: (err: AWSError, data: ConfigService.Types.PutRetentionConfigurationResponse) => void): Request<ConfigService.Types.PutRetentionConfigurationResponse, AWSError>;
  /**
   * Saves a new query or updates an existing saved query. The QueryName must be unique for a single Amazon Web Services account and a single Amazon Web Services Region. You can create upto 300 queries in a single Amazon Web Services account and a single Amazon Web Services Region.
   */
  putStoredQuery(params: ConfigService.Types.PutStoredQueryRequest, callback?: (err: AWSError, data: ConfigService.Types.PutStoredQueryResponse) => void): Request<ConfigService.Types.PutStoredQueryResponse, AWSError>;
  /**
   * Saves a new query or updates an existing saved query. The QueryName must be unique for a single Amazon Web Services account and a single Amazon Web Services Region. You can create upto 300 queries in a single Amazon Web Services account and a single Amazon Web Services Region.
   */
  putStoredQuery(callback?: (err: AWSError, data: ConfigService.Types.PutStoredQueryResponse) => void): Request<ConfigService.Types.PutStoredQueryResponse, AWSError>;
  /**
   * Accepts a structured query language (SQL) SELECT command and an aggregator to query configuration state of Amazon Web Services resources across multiple accounts and regions, performs the corresponding search, and returns resource configurations matching the properties. For more information about query components, see the  Query Components  section in the Config Developer Guide.  If you run an aggregation query (i.e., using GROUP BY or using aggregate functions such as COUNT; e.g., SELECT resourceId, COUNT(*) WHERE resourceType = 'AWS::IAM::Role' GROUP BY resourceId) and do not specify the MaxResults or the Limit query parameters, the default page size is set to 500. If you run a non-aggregation query (i.e., not using GROUP BY or aggregate function; e.g., SELECT * WHERE resourceType = 'AWS::IAM::Role') and do not specify the MaxResults or the Limit query parameters, the default page size is set to 25. 
   */
  selectAggregateResourceConfig(params: ConfigService.Types.SelectAggregateResourceConfigRequest, callback?: (err: AWSError, data: ConfigService.Types.SelectAggregateResourceConfigResponse) => void): Request<ConfigService.Types.SelectAggregateResourceConfigResponse, AWSError>;
  /**
   * Accepts a structured query language (SQL) SELECT command and an aggregator to query configuration state of Amazon Web Services resources across multiple accounts and regions, performs the corresponding search, and returns resource configurations matching the properties. For more information about query components, see the  Query Components  section in the Config Developer Guide.  If you run an aggregation query (i.e., using GROUP BY or using aggregate functions such as COUNT; e.g., SELECT resourceId, COUNT(*) WHERE resourceType = 'AWS::IAM::Role' GROUP BY resourceId) and do not specify the MaxResults or the Limit query parameters, the default page size is set to 500. If you run a non-aggregation query (i.e., not using GROUP BY or aggregate function; e.g., SELECT * WHERE resourceType = 'AWS::IAM::Role') and do not specify the MaxResults or the Limit query parameters, the default page size is set to 25. 
   */
  selectAggregateResourceConfig(callback?: (err: AWSError, data: ConfigService.Types.SelectAggregateResourceConfigResponse) => void): Request<ConfigService.Types.SelectAggregateResourceConfigResponse, AWSError>;
  /**
   * Accepts a structured query language (SQL) SELECT command, performs the corresponding search, and returns resource configurations matching the properties. For more information about query components, see the  Query Components  section in the Config Developer Guide.
   */
  selectResourceConfig(params: ConfigService.Types.SelectResourceConfigRequest, callback?: (err: AWSError, data: ConfigService.Types.SelectResourceConfigResponse) => void): Request<ConfigService.Types.SelectResourceConfigResponse, AWSError>;
  /**
   * Accepts a structured query language (SQL) SELECT command, performs the corresponding search, and returns resource configurations matching the properties. For more information about query components, see the  Query Components  section in the Config Developer Guide.
   */
  selectResourceConfig(callback?: (err: AWSError, data: ConfigService.Types.SelectResourceConfigResponse) => void): Request<ConfigService.Types.SelectResourceConfigResponse, AWSError>;
  /**
   * Runs an on-demand evaluation for the specified Config rules against the last known configuration state of the resources. Use StartConfigRulesEvaluation when you want to test that a rule you updated is working as expected. StartConfigRulesEvaluation does not re-record the latest configuration state for your resources. It re-runs an evaluation against the last known state of your resources.  You can specify up to 25 Config rules per request.  An existing StartConfigRulesEvaluation call for the specified rules must complete before you can call the API again. If you chose to have Config stream to an Amazon SNS topic, you will receive a ConfigRuleEvaluationStarted notification when the evaluation starts.  You don't need to call the StartConfigRulesEvaluation API to run an evaluation for a new rule. When you create a rule, Config evaluates your resources against the rule automatically.   The StartConfigRulesEvaluation API is useful if you want to run on-demand evaluations, such as the following example:   You have a custom rule that evaluates your IAM resources every 24 hours.   You update your Lambda function to add additional conditions to your rule.   Instead of waiting for the next periodic evaluation, you call the StartConfigRulesEvaluation API.   Config invokes your Lambda function and evaluates your IAM resources.   Your custom rule will still run periodic evaluations every 24 hours.  
   */
  startConfigRulesEvaluation(params: ConfigService.Types.StartConfigRulesEvaluationRequest, callback?: (err: AWSError, data: ConfigService.Types.StartConfigRulesEvaluationResponse) => void): Request<ConfigService.Types.StartConfigRulesEvaluationResponse, AWSError>;
  /**
   * Runs an on-demand evaluation for the specified Config rules against the last known configuration state of the resources. Use StartConfigRulesEvaluation when you want to test that a rule you updated is working as expected. StartConfigRulesEvaluation does not re-record the latest configuration state for your resources. It re-runs an evaluation against the last known state of your resources.  You can specify up to 25 Config rules per request.  An existing StartConfigRulesEvaluation call for the specified rules must complete before you can call the API again. If you chose to have Config stream to an Amazon SNS topic, you will receive a ConfigRuleEvaluationStarted notification when the evaluation starts.  You don't need to call the StartConfigRulesEvaluation API to run an evaluation for a new rule. When you create a rule, Config evaluates your resources against the rule automatically.   The StartConfigRulesEvaluation API is useful if you want to run on-demand evaluations, such as the following example:   You have a custom rule that evaluates your IAM resources every 24 hours.   You update your Lambda function to add additional conditions to your rule.   Instead of waiting for the next periodic evaluation, you call the StartConfigRulesEvaluation API.   Config invokes your Lambda function and evaluates your IAM resources.   Your custom rule will still run periodic evaluations every 24 hours.  
   */
  startConfigRulesEvaluation(callback?: (err: AWSError, data: ConfigService.Types.StartConfigRulesEvaluationResponse) => void): Request<ConfigService.Types.StartConfigRulesEvaluationResponse, AWSError>;
  /**
   * Starts recording configurations of the Amazon Web Services resources you have selected to record in your Amazon Web Services account. You must have created at least one delivery channel to successfully start the configuration recorder.
   */
  startConfigurationRecorder(params: ConfigService.Types.StartConfigurationRecorderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts recording configurations of the Amazon Web Services resources you have selected to record in your Amazon Web Services account. You must have created at least one delivery channel to successfully start the configuration recorder.
   */
  startConfigurationRecorder(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Runs an on-demand remediation for the specified Config rules against the last known remediation configuration. It runs an execution against the current state of your resources. Remediation execution is asynchronous. You can specify up to 100 resource keys per request. An existing StartRemediationExecution call for the specified resource keys must complete before you can call the API again.
   */
  startRemediationExecution(params: ConfigService.Types.StartRemediationExecutionRequest, callback?: (err: AWSError, data: ConfigService.Types.StartRemediationExecutionResponse) => void): Request<ConfigService.Types.StartRemediationExecutionResponse, AWSError>;
  /**
   * Runs an on-demand remediation for the specified Config rules against the last known remediation configuration. It runs an execution against the current state of your resources. Remediation execution is asynchronous. You can specify up to 100 resource keys per request. An existing StartRemediationExecution call for the specified resource keys must complete before you can call the API again.
   */
  startRemediationExecution(callback?: (err: AWSError, data: ConfigService.Types.StartRemediationExecutionResponse) => void): Request<ConfigService.Types.StartRemediationExecutionResponse, AWSError>;
  /**
   * Stops recording configurations of the Amazon Web Services resources you have selected to record in your Amazon Web Services account.
   */
  stopConfigurationRecorder(params: ConfigService.Types.StopConfigurationRecorderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops recording configurations of the Amazon Web Services resources you have selected to record in your Amazon Web Services account.
   */
  stopConfigurationRecorder(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are deleted as well.
   */
  tagResource(params: ConfigService.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are deleted as well.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes specified tags from a resource.
   */
  untagResource(params: ConfigService.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes specified tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace ConfigService {
  export type ARN = string;
  export interface AccountAggregationSource {
    /**
     * The 12-digit account ID of the account being aggregated. 
     */
    AccountIds: AccountAggregationSourceAccountList;
    /**
     * If true, aggregate existing Config regions and future regions.
     */
    AllAwsRegions?: Boolean;
    /**
     * The source regions being aggregated.
     */
    AwsRegions?: AggregatorRegionList;
  }
  export type AccountAggregationSourceAccountList = AccountId[];
  export type AccountAggregationSourceList = AccountAggregationSource[];
  export type AccountId = string;
  export interface AggregateComplianceByConfigRule {
    /**
     * The name of the Config rule.
     */
    ConfigRuleName?: ConfigRuleName;
    /**
     * Indicates whether an Amazon Web Services resource or Config rule is compliant and provides the number of contributors that affect the compliance.
     */
    Compliance?: Compliance;
    /**
     * The 12-digit account ID of the source account.
     */
    AccountId?: AccountId;
    /**
     * The source region from where the data is aggregated.
     */
    AwsRegion?: AwsRegion;
  }
  export type AggregateComplianceByConfigRuleList = AggregateComplianceByConfigRule[];
  export interface AggregateComplianceByConformancePack {
    /**
     * The name of the conformance pack.
     */
    ConformancePackName?: ConformancePackName;
    /**
     * The compliance status of the conformance pack.
     */
    Compliance?: AggregateConformancePackCompliance;
    /**
     * The 12-digit Amazon Web Services account ID of the source account.
     */
    AccountId?: AccountId;
    /**
     * The source Amazon Web Services Region from where the data is aggregated.
     */
    AwsRegion?: AwsRegion;
  }
  export type AggregateComplianceByConformancePackList = AggregateComplianceByConformancePack[];
  export interface AggregateComplianceCount {
    /**
     * The 12-digit account ID or region based on the GroupByKey value.
     */
    GroupName?: StringWithCharLimit256;
    /**
     * The number of compliant and noncompliant Config rules.
     */
    ComplianceSummary?: ComplianceSummary;
  }
  export type AggregateComplianceCountList = AggregateComplianceCount[];
  export interface AggregateConformancePackCompliance {
    /**
     * The compliance status of the conformance pack.
     */
    ComplianceType?: ConformancePackComplianceType;
    /**
     * The number of compliant Config Rules.
     */
    CompliantRuleCount?: Integer;
    /**
     * The number of noncompliant Config Rules.
     */
    NonCompliantRuleCount?: Integer;
    /**
     * Total number of compliant rules, noncompliant rules, and the rules that do not have any applicable resources to evaluate upon resulting in insufficient data.
     */
    TotalRuleCount?: Integer;
  }
  export interface AggregateConformancePackComplianceCount {
    /**
     * Number of compliant conformance packs.
     */
    CompliantConformancePackCount?: Integer;
    /**
     * Number of noncompliant conformance packs.
     */
    NonCompliantConformancePackCount?: Integer;
  }
  export interface AggregateConformancePackComplianceFilters {
    /**
     * The name of the conformance pack.
     */
    ConformancePackName?: ConformancePackName;
    /**
     * The compliance status of the conformance pack.
     */
    ComplianceType?: ConformancePackComplianceType;
    /**
     * The 12-digit Amazon Web Services account ID of the source account.
     */
    AccountId?: AccountId;
    /**
     * The source Amazon Web Services Region from where the data is aggregated.
     */
    AwsRegion?: AwsRegion;
  }
  export interface AggregateConformancePackComplianceSummary {
    /**
     * Returns an AggregateConformancePackComplianceCount object. 
     */
    ComplianceSummary?: AggregateConformancePackComplianceCount;
    /**
     * Groups the result based on Amazon Web Services account ID or Amazon Web Services Region.
     */
    GroupName?: StringWithCharLimit256;
  }
  export interface AggregateConformancePackComplianceSummaryFilters {
    /**
     * The 12-digit Amazon Web Services account ID of the source account.
     */
    AccountId?: AccountId;
    /**
     * The source Amazon Web Services Region from where the data is aggregated.
     */
    AwsRegion?: AwsRegion;
  }
  export type AggregateConformancePackComplianceSummaryGroupKey = "ACCOUNT_ID"|"AWS_REGION"|string;
  export type AggregateConformancePackComplianceSummaryList = AggregateConformancePackComplianceSummary[];
  export interface AggregateEvaluationResult {
    /**
     * Uniquely identifies the evaluation result.
     */
    EvaluationResultIdentifier?: EvaluationResultIdentifier;
    /**
     * The resource compliance status. For the AggregationEvaluationResult data type, Config supports only the COMPLIANT and NON_COMPLIANT. Config does not support the NOT_APPLICABLE and INSUFFICIENT_DATA value.
     */
    ComplianceType?: ComplianceType;
    /**
     * The time when Config recorded the aggregate evaluation result.
     */
    ResultRecordedTime?: _Date;
    /**
     * The time when the Config rule evaluated the Amazon Web Services resource.
     */
    ConfigRuleInvokedTime?: _Date;
    /**
     * Supplementary information about how the agrregate evaluation determined the compliance.
     */
    Annotation?: StringWithCharLimit256;
    /**
     * The 12-digit account ID of the source account.
     */
    AccountId?: AccountId;
    /**
     * The source region from where the data is aggregated.
     */
    AwsRegion?: AwsRegion;
  }
  export type AggregateEvaluationResultList = AggregateEvaluationResult[];
  export interface AggregateResourceIdentifier {
    /**
     * The 12-digit account ID of the source account.
     */
    SourceAccountId: AccountId;
    /**
     * The source region where data is aggregated.
     */
    SourceRegion: AwsRegion;
    /**
     * The ID of the Amazon Web Services resource.
     */
    ResourceId: ResourceId;
    /**
     * The type of the Amazon Web Services resource.
     */
    ResourceType: ResourceType;
    /**
     * The name of the Amazon Web Services resource.
     */
    ResourceName?: ResourceName;
  }
  export interface AggregatedSourceStatus {
    /**
     * The source account ID or an organization.
     */
    SourceId?: String;
    /**
     * The source account or an organization.
     */
    SourceType?: AggregatedSourceType;
    /**
     * The region authorized to collect aggregated data.
     */
    AwsRegion?: AwsRegion;
    /**
     * Filters the last updated status type.   Valid value FAILED indicates errors while moving data.   Valid value SUCCEEDED indicates the data was successfully moved.   Valid value OUTDATED indicates the data is not the most recent.  
     */
    LastUpdateStatus?: AggregatedSourceStatusType;
    /**
     * The time of the last update.
     */
    LastUpdateTime?: _Date;
    /**
     * The error code that Config returned when the source account aggregation last failed.
     */
    LastErrorCode?: String;
    /**
     * The message indicating that the source account aggregation failed due to an error.
     */
    LastErrorMessage?: String;
  }
  export type AggregatedSourceStatusList = AggregatedSourceStatus[];
  export type AggregatedSourceStatusType = "FAILED"|"SUCCEEDED"|"OUTDATED"|string;
  export type AggregatedSourceStatusTypeList = AggregatedSourceStatusType[];
  export type AggregatedSourceType = "ACCOUNT"|"ORGANIZATION"|string;
  export interface AggregationAuthorization {
    /**
     * The Amazon Resource Name (ARN) of the aggregation object.
     */
    AggregationAuthorizationArn?: String;
    /**
     * The 12-digit account ID of the account authorized to aggregate data.
     */
    AuthorizedAccountId?: AccountId;
    /**
     * The region authorized to collect aggregated data.
     */
    AuthorizedAwsRegion?: AwsRegion;
    /**
     * The time stamp when the aggregation authorization was created.
     */
    CreationTime?: _Date;
  }
  export type AggregationAuthorizationList = AggregationAuthorization[];
  export type AggregatorRegionList = String[];
  export type AllSupported = boolean;
  export type AmazonResourceName = string;
  export type Annotation = string;
  export type AutoRemediationAttemptSeconds = number;
  export type AutoRemediationAttempts = number;
  export type AvailabilityZone = string;
  export type AwsRegion = string;
  export interface BaseConfigurationItem {
    /**
     * The version number of the resource configuration.
     */
    version?: Version;
    /**
     * The 12-digit Amazon Web Services account ID associated with the resource.
     */
    accountId?: AccountId;
    /**
     * The time when the configuration recording was initiated.
     */
    configurationItemCaptureTime?: ConfigurationItemCaptureTime;
    /**
     * The configuration item status. The valid values are:   OK – The resource configuration has been updated   ResourceDiscovered – The resource was newly discovered   ResourceNotRecorded – The resource was discovered but its configuration was not recorded since the recorder excludes the recording of resources of this type   ResourceDeleted – The resource was deleted   ResourceDeletedNotRecorded – The resource was deleted but its configuration was not recorded since the recorder excludes the recording of resources of this type    The CIs do not incur any cost. 
     */
    configurationItemStatus?: ConfigurationItemStatus;
    /**
     * An identifier that indicates the ordering of the configuration items of a resource.
     */
    configurationStateId?: ConfigurationStateId;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    arn?: ARN;
    /**
     * The type of Amazon Web Services resource.
     */
    resourceType?: ResourceType;
    /**
     * The ID of the resource (for example., sg-xxxxxx).
     */
    resourceId?: ResourceId;
    /**
     * The custom name of the resource, if available.
     */
    resourceName?: ResourceName;
    /**
     * The region where the resource resides.
     */
    awsRegion?: AwsRegion;
    /**
     * The Availability Zone associated with the resource.
     */
    availabilityZone?: AvailabilityZone;
    /**
     * The time stamp when the resource was created.
     */
    resourceCreationTime?: ResourceCreationTime;
    /**
     * The description of the resource configuration.
     */
    configuration?: Configuration;
    /**
     * Configuration attributes that Config returns for certain resource types to supplement the information returned for the configuration parameter.
     */
    supplementaryConfiguration?: SupplementaryConfiguration;
  }
  export type BaseConfigurationItems = BaseConfigurationItem[];
  export type BaseResourceId = string;
  export interface BatchGetAggregateResourceConfigRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * A list of aggregate ResourceIdentifiers objects. 
     */
    ResourceIdentifiers: ResourceIdentifiersList;
  }
  export interface BatchGetAggregateResourceConfigResponse {
    /**
     * A list that contains the current configuration of one or more resources.
     */
    BaseConfigurationItems?: BaseConfigurationItems;
    /**
     * A list of resource identifiers that were not processed with current scope. The list is empty if all the resources are processed.
     */
    UnprocessedResourceIdentifiers?: UnprocessedResourceIdentifierList;
  }
  export interface BatchGetResourceConfigRequest {
    /**
     * A list of resource keys to be processed with the current request. Each element in the list consists of the resource type and resource ID.
     */
    resourceKeys: ResourceKeys;
  }
  export interface BatchGetResourceConfigResponse {
    /**
     * A list that contains the current configuration of one or more resources.
     */
    baseConfigurationItems?: BaseConfigurationItems;
    /**
     * A list of resource keys that were not processed with the current response. The unprocessesResourceKeys value is in the same form as ResourceKeys, so the value can be directly provided to a subsequent BatchGetResourceConfig operation. If there are no unprocessed resource keys, the response contains an empty unprocessedResourceKeys list. 
     */
    unprocessedResourceKeys?: ResourceKeys;
  }
  export type Boolean = boolean;
  export type ChannelName = string;
  export type ChronologicalOrder = "Reverse"|"Forward"|string;
  export interface Compliance {
    /**
     * Indicates whether an Amazon Web Services resource or Config rule is compliant. A resource is compliant if it complies with all of the Config rules that evaluate it. A resource is noncompliant if it does not comply with one or more of these rules. A rule is compliant if all of the resources that the rule evaluates comply with it. A rule is noncompliant if any of these resources do not comply. Config returns the INSUFFICIENT_DATA value when no evaluation results are available for the Amazon Web Services resource or Config rule. For the Compliance data type, Config supports only COMPLIANT, NON_COMPLIANT, and INSUFFICIENT_DATA values. Config does not support the NOT_APPLICABLE value for the Compliance data type.
     */
    ComplianceType?: ComplianceType;
    /**
     * The number of Amazon Web Services resources or Config rules that cause a result of NON_COMPLIANT, up to a maximum number.
     */
    ComplianceContributorCount?: ComplianceContributorCount;
  }
  export interface ComplianceByConfigRule {
    /**
     * The name of the Config rule.
     */
    ConfigRuleName?: StringWithCharLimit64;
    /**
     * Indicates whether the Config rule is compliant.
     */
    Compliance?: Compliance;
  }
  export type ComplianceByConfigRules = ComplianceByConfigRule[];
  export interface ComplianceByResource {
    /**
     * The type of the Amazon Web Services resource that was evaluated.
     */
    ResourceType?: StringWithCharLimit256;
    /**
     * The ID of the Amazon Web Services resource that was evaluated.
     */
    ResourceId?: BaseResourceId;
    /**
     * Indicates whether the Amazon Web Services resource complies with all of the Config rules that evaluated it.
     */
    Compliance?: Compliance;
  }
  export type ComplianceByResources = ComplianceByResource[];
  export interface ComplianceContributorCount {
    /**
     * The number of Amazon Web Services resources or Config rules responsible for the current compliance of the item.
     */
    CappedCount?: Integer;
    /**
     * Indicates whether the maximum count is reached.
     */
    CapExceeded?: Boolean;
  }
  export type ComplianceResourceTypes = StringWithCharLimit256[];
  export type ComplianceSummariesByResourceType = ComplianceSummaryByResourceType[];
  export interface ComplianceSummary {
    /**
     * The number of Config rules or Amazon Web Services resources that are compliant, up to a maximum of 25 for rules and 100 for resources.
     */
    CompliantResourceCount?: ComplianceContributorCount;
    /**
     * The number of Config rules or Amazon Web Services resources that are noncompliant, up to a maximum of 25 for rules and 100 for resources.
     */
    NonCompliantResourceCount?: ComplianceContributorCount;
    /**
     * The time that Config created the compliance summary.
     */
    ComplianceSummaryTimestamp?: _Date;
  }
  export interface ComplianceSummaryByResourceType {
    /**
     * The type of Amazon Web Services resource.
     */
    ResourceType?: StringWithCharLimit256;
    /**
     * The number of Amazon Web Services resources that are compliant or noncompliant, up to a maximum of 100 for each.
     */
    ComplianceSummary?: ComplianceSummary;
  }
  export type ComplianceType = "COMPLIANT"|"NON_COMPLIANT"|"NOT_APPLICABLE"|"INSUFFICIENT_DATA"|string;
  export type ComplianceTypes = ComplianceType[];
  export interface ConfigExportDeliveryInfo {
    /**
     * Status of the last attempted delivery.
     */
    lastStatus?: DeliveryStatus;
    /**
     * The error code from the last attempted delivery.
     */
    lastErrorCode?: String;
    /**
     * The error message from the last attempted delivery.
     */
    lastErrorMessage?: String;
    /**
     * The time of the last attempted delivery.
     */
    lastAttemptTime?: _Date;
    /**
     * The time of the last successful delivery.
     */
    lastSuccessfulTime?: _Date;
    /**
     * The time that the next delivery occurs.
     */
    nextDeliveryTime?: _Date;
  }
  export interface ConfigRule {
    /**
     * The name that you assign to the Config rule. The name is required if you are adding a new rule.
     */
    ConfigRuleName?: ConfigRuleName;
    /**
     * The Amazon Resource Name (ARN) of the Config rule.
     */
    ConfigRuleArn?: StringWithCharLimit256;
    /**
     * The ID of the Config rule.
     */
    ConfigRuleId?: StringWithCharLimit64;
    /**
     * The description that you provide for the Config rule.
     */
    Description?: EmptiableStringWithCharLimit256;
    /**
     * Defines which resources can trigger an evaluation for the rule. The scope can include one or more resource types, a combination of one resource type and one resource ID, or a combination of a tag key and value. Specify a scope to constrain the resources that can trigger an evaluation for the rule. If you do not specify a scope, evaluations are triggered when any resource in the recording group changes.  The scope can be empty.  
     */
    Scope?: Scope;
    /**
     * Provides the rule owner (Amazon Web Services or customer), the rule identifier, and the notifications that cause the function to evaluate your Amazon Web Services resources.
     */
    Source: Source;
    /**
     * A string, in JSON format, that is passed to the Config rule Lambda function.
     */
    InputParameters?: StringWithCharLimit1024;
    /**
     * The maximum frequency with which Config runs evaluations for a rule. You can specify a value for MaximumExecutionFrequency when:   You are using an Config managed rule that is triggered at a periodic frequency.   Your custom rule is triggered when Config delivers the configuration snapshot. For more information, see ConfigSnapshotDeliveryProperties.    By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the MaximumExecutionFrequency parameter. 
     */
    MaximumExecutionFrequency?: MaximumExecutionFrequency;
    /**
     * Indicates whether the Config rule is active or is currently being deleted by Config. It can also indicate the evaluation status for the Config rule. Config sets the state of the rule to EVALUATING temporarily after you use the StartConfigRulesEvaluation request to evaluate your resources against the Config rule. Config sets the state of the rule to DELETING_RESULTS temporarily after you use the DeleteEvaluationResults request to delete the current evaluation results for the Config rule. Config temporarily sets the state of a rule to DELETING after you use the DeleteConfigRule request to delete the rule. After Config deletes the rule, the rule and all of its evaluations are erased and are no longer available.
     */
    ConfigRuleState?: ConfigRuleState;
    /**
     * Service principal name of the service that created the rule.  The field is populated only if the service linked rule is created by a service. The field is empty if you create your own rule. 
     */
    CreatedBy?: StringWithCharLimit256;
  }
  export interface ConfigRuleComplianceFilters {
    /**
     * The name of the Config rule.
     */
    ConfigRuleName?: ConfigRuleName;
    /**
     * The rule compliance status. For the ConfigRuleComplianceFilters data type, Config supports only COMPLIANT and NON_COMPLIANT. Config does not support the NOT_APPLICABLE and the INSUFFICIENT_DATA values.
     */
    ComplianceType?: ComplianceType;
    /**
     * The 12-digit account ID of the source account. 
     */
    AccountId?: AccountId;
    /**
     * The source region where the data is aggregated. 
     */
    AwsRegion?: AwsRegion;
  }
  export interface ConfigRuleComplianceSummaryFilters {
    /**
     * The 12-digit account ID of the source account.
     */
    AccountId?: AccountId;
    /**
     * The source region where the data is aggregated.
     */
    AwsRegion?: AwsRegion;
  }
  export type ConfigRuleComplianceSummaryGroupKey = "ACCOUNT_ID"|"AWS_REGION"|string;
  export interface ConfigRuleEvaluationStatus {
    /**
     * The name of the Config rule.
     */
    ConfigRuleName?: ConfigRuleName;
    /**
     * The Amazon Resource Name (ARN) of the Config rule.
     */
    ConfigRuleArn?: String;
    /**
     * The ID of the Config rule.
     */
    ConfigRuleId?: String;
    /**
     * The time that Config last successfully invoked the Config rule to evaluate your Amazon Web Services resources.
     */
    LastSuccessfulInvocationTime?: _Date;
    /**
     * The time that Config last failed to invoke the Config rule to evaluate your Amazon Web Services resources.
     */
    LastFailedInvocationTime?: _Date;
    /**
     * The time that Config last successfully evaluated your Amazon Web Services resources against the rule.
     */
    LastSuccessfulEvaluationTime?: _Date;
    /**
     * The time that Config last failed to evaluate your Amazon Web Services resources against the rule.
     */
    LastFailedEvaluationTime?: _Date;
    /**
     * The time that you first activated the Config rule.
     */
    FirstActivatedTime?: _Date;
    /**
     * The time that you last turned off the Config rule.
     */
    LastDeactivatedTime?: _Date;
    /**
     * The error code that Config returned when the rule last failed.
     */
    LastErrorCode?: String;
    /**
     * The error message that Config returned when the rule last failed.
     */
    LastErrorMessage?: String;
    /**
     * Indicates whether Config has evaluated your resources against the rule at least once.    true - Config has evaluated your Amazon Web Services resources against the rule at least once.    false - Config has not once finished evaluating your Amazon Web Services resources against the rule.  
     */
    FirstEvaluationStarted?: Boolean;
  }
  export type ConfigRuleEvaluationStatusList = ConfigRuleEvaluationStatus[];
  export type ConfigRuleName = string;
  export type ConfigRuleNames = ConfigRuleName[];
  export type ConfigRuleState = "ACTIVE"|"DELETING"|"DELETING_RESULTS"|"EVALUATING"|string;
  export type ConfigRules = ConfigRule[];
  export interface ConfigSnapshotDeliveryProperties {
    /**
     * The frequency with which Config delivers configuration snapshots.
     */
    deliveryFrequency?: MaximumExecutionFrequency;
  }
  export interface ConfigStreamDeliveryInfo {
    /**
     * Status of the last attempted delivery.  Note Providing an SNS topic on a DeliveryChannel for Config is optional. If the SNS delivery is turned off, the last status will be Not_Applicable.
     */
    lastStatus?: DeliveryStatus;
    /**
     * The error code from the last attempted delivery.
     */
    lastErrorCode?: String;
    /**
     * The error message from the last attempted delivery.
     */
    lastErrorMessage?: String;
    /**
     * The time from the last status change.
     */
    lastStatusChangeTime?: _Date;
  }
  export type Configuration = string;
  export interface ConfigurationAggregator {
    /**
     * The name of the aggregator.
     */
    ConfigurationAggregatorName?: ConfigurationAggregatorName;
    /**
     * The Amazon Resource Name (ARN) of the aggregator.
     */
    ConfigurationAggregatorArn?: ConfigurationAggregatorArn;
    /**
     * Provides a list of source accounts and regions to be aggregated.
     */
    AccountAggregationSources?: AccountAggregationSourceList;
    /**
     * Provides an organization and list of regions to be aggregated.
     */
    OrganizationAggregationSource?: OrganizationAggregationSource;
    /**
     * The time stamp when the configuration aggregator was created.
     */
    CreationTime?: _Date;
    /**
     * The time of the last update.
     */
    LastUpdatedTime?: _Date;
    /**
     * Amazon Web Services service that created the configuration aggregator.
     */
    CreatedBy?: StringWithCharLimit256;
  }
  export type ConfigurationAggregatorArn = string;
  export type ConfigurationAggregatorList = ConfigurationAggregator[];
  export type ConfigurationAggregatorName = string;
  export type ConfigurationAggregatorNameList = ConfigurationAggregatorName[];
  export interface ConfigurationItem {
    /**
     * The version number of the resource configuration.
     */
    version?: Version;
    /**
     * The 12-digit Amazon Web Services account ID associated with the resource.
     */
    accountId?: AccountId;
    /**
     * The time when the configuration recording was initiated.
     */
    configurationItemCaptureTime?: ConfigurationItemCaptureTime;
    /**
     * The configuration item status. The valid values are:   OK – The resource configuration has been updated   ResourceDiscovered – The resource was newly discovered   ResourceNotRecorded – The resource was discovered but its configuration was not recorded since the recorder excludes the recording of resources of this type   ResourceDeleted – The resource was deleted   ResourceDeletedNotRecorded – The resource was deleted but its configuration was not recorded since the recorder excludes the recording of resources of this type    The CIs do not incur any cost. 
     */
    configurationItemStatus?: ConfigurationItemStatus;
    /**
     * An identifier that indicates the ordering of the configuration items of a resource.
     */
    configurationStateId?: ConfigurationStateId;
    /**
     * Unique MD5 hash that represents the configuration item's state. You can use MD5 hash to compare the states of two or more configuration items that are associated with the same resource.
     */
    configurationItemMD5Hash?: ConfigurationItemMD5Hash;
    /**
     * Amazon Resource Name (ARN) associated with the resource.
     */
    arn?: ARN;
    /**
     * The type of Amazon Web Services resource.
     */
    resourceType?: ResourceType;
    /**
     * The ID of the resource (for example, sg-xxxxxx).
     */
    resourceId?: ResourceId;
    /**
     * The custom name of the resource, if available.
     */
    resourceName?: ResourceName;
    /**
     * The region where the resource resides.
     */
    awsRegion?: AwsRegion;
    /**
     * The Availability Zone associated with the resource.
     */
    availabilityZone?: AvailabilityZone;
    /**
     * The time stamp when the resource was created.
     */
    resourceCreationTime?: ResourceCreationTime;
    /**
     * A mapping of key value tags associated with the resource.
     */
    tags?: Tags;
    /**
     * A list of CloudTrail event IDs. A populated field indicates that the current configuration was initiated by the events recorded in the CloudTrail log. For more information about CloudTrail, see What Is CloudTrail. An empty field indicates that the current configuration was not initiated by any event. As of Version 1.3, the relatedEvents field is empty. You can access the LookupEvents API in the CloudTrail API Reference to retrieve the events for the resource.
     */
    relatedEvents?: RelatedEventList;
    /**
     * A list of related Amazon Web Services resources.
     */
    relationships?: RelationshipList;
    /**
     * The description of the resource configuration.
     */
    configuration?: Configuration;
    /**
     * Configuration attributes that Config returns for certain resource types to supplement the information returned for the configuration parameter.
     */
    supplementaryConfiguration?: SupplementaryConfiguration;
  }
  export type ConfigurationItemCaptureTime = Date;
  export type ConfigurationItemList = ConfigurationItem[];
  export type ConfigurationItemMD5Hash = string;
  export type ConfigurationItemStatus = "OK"|"ResourceDiscovered"|"ResourceNotRecorded"|"ResourceDeleted"|"ResourceDeletedNotRecorded"|string;
  export interface ConfigurationRecorder {
    /**
     * The name of the recorder. By default, Config automatically assigns the name "default" when creating the configuration recorder. You cannot change the assigned name.
     */
    name?: RecorderName;
    /**
     * Amazon Resource Name (ARN) of the IAM role used to describe the Amazon Web Services resources associated with the account.
     */
    roleARN?: String;
    /**
     * Specifies the types of Amazon Web Services resources for which Config records configuration changes.
     */
    recordingGroup?: RecordingGroup;
  }
  export type ConfigurationRecorderList = ConfigurationRecorder[];
  export type ConfigurationRecorderNameList = RecorderName[];
  export interface ConfigurationRecorderStatus {
    /**
     * The name of the configuration recorder.
     */
    name?: String;
    /**
     * The time the recorder was last started.
     */
    lastStartTime?: _Date;
    /**
     * The time the recorder was last stopped.
     */
    lastStopTime?: _Date;
    /**
     * Specifies whether or not the recorder is currently recording.
     */
    recording?: Boolean;
    /**
     * The last (previous) status of the recorder.
     */
    lastStatus?: RecorderStatus;
    /**
     * The error code indicating that the recording failed.
     */
    lastErrorCode?: String;
    /**
     * The message indicating that the recording failed due to an error.
     */
    lastErrorMessage?: String;
    /**
     * The time when the status was last changed.
     */
    lastStatusChangeTime?: _Date;
  }
  export type ConfigurationRecorderStatusList = ConfigurationRecorderStatus[];
  export type ConfigurationStateId = string;
  export type ConformancePackArn = string;
  export interface ConformancePackComplianceFilters {
    /**
     * Filters the results by Config rule names.
     */
    ConfigRuleNames?: ConformancePackConfigRuleNames;
    /**
     * Filters the results by compliance. The allowed values are COMPLIANT and NON_COMPLIANT. INSUFFICIENT_DATA is not supported.
     */
    ComplianceType?: ConformancePackComplianceType;
  }
  export type ConformancePackComplianceResourceIds = StringWithCharLimit256[];
  export interface ConformancePackComplianceSummary {
    /**
     * The name of the conformance pack name.
     */
    ConformancePackName: ConformancePackName;
    /**
     * The status of the conformance pack. The allowed values are COMPLIANT, NON_COMPLIANT and INSUFFICIENT_DATA.
     */
    ConformancePackComplianceStatus: ConformancePackComplianceType;
  }
  export type ConformancePackComplianceSummaryList = ConformancePackComplianceSummary[];
  export type ConformancePackComplianceType = "COMPLIANT"|"NON_COMPLIANT"|"INSUFFICIENT_DATA"|string;
  export type ConformancePackConfigRuleNames = StringWithCharLimit64[];
  export interface ConformancePackDetail {
    /**
     * Name of the conformance pack.
     */
    ConformancePackName: ConformancePackName;
    /**
     * Amazon Resource Name (ARN) of the conformance pack.
     */
    ConformancePackArn: ConformancePackArn;
    /**
     * ID of the conformance pack.
     */
    ConformancePackId: ConformancePackId;
    /**
     * The name of the Amazon S3 bucket where Config stores conformance pack templates.   This field is optional. 
     */
    DeliveryS3Bucket?: DeliveryS3Bucket;
    /**
     * The prefix for the Amazon S3 bucket.  This field is optional. 
     */
    DeliveryS3KeyPrefix?: DeliveryS3KeyPrefix;
    /**
     * A list of ConformancePackInputParameter objects.
     */
    ConformancePackInputParameters?: ConformancePackInputParameters;
    /**
     * Last time when conformation pack update was requested. 
     */
    LastUpdateRequestedTime?: _Date;
    /**
     * Amazon Web Services service that created the conformance pack.
     */
    CreatedBy?: StringWithCharLimit256;
  }
  export type ConformancePackDetailList = ConformancePackDetail[];
  export interface ConformancePackEvaluationFilters {
    /**
     * Filters the results by Config rule names.
     */
    ConfigRuleNames?: ConformancePackConfigRuleNames;
    /**
     * Filters the results by compliance. The allowed values are COMPLIANT and NON_COMPLIANT. INSUFFICIENT_DATA is not supported.
     */
    ComplianceType?: ConformancePackComplianceType;
    /**
     * Filters the results by the resource type (for example, "AWS::EC2::Instance"). 
     */
    ResourceType?: StringWithCharLimit256;
    /**
     * Filters the results by resource IDs.  This is valid only when you provide resource type. If there is no resource type, you will see an error. 
     */
    ResourceIds?: ConformancePackComplianceResourceIds;
  }
  export interface ConformancePackEvaluationResult {
    /**
     * The compliance type. The allowed values are COMPLIANT and NON_COMPLIANT. INSUFFICIENT_DATA is not supported.
     */
    ComplianceType: ConformancePackComplianceType;
    EvaluationResultIdentifier: EvaluationResultIdentifier;
    /**
     * The time when Config rule evaluated Amazon Web Services resource.
     */
    ConfigRuleInvokedTime: _Date;
    /**
     * The time when Config recorded the evaluation result. 
     */
    ResultRecordedTime: _Date;
    /**
     * Supplementary information about how the evaluation determined the compliance. 
     */
    Annotation?: Annotation;
  }
  export type ConformancePackId = string;
  export interface ConformancePackInputParameter {
    /**
     * One part of a key-value pair.
     */
    ParameterName: ParameterName;
    /**
     * Another part of the key-value pair. 
     */
    ParameterValue: ParameterValue;
  }
  export type ConformancePackInputParameters = ConformancePackInputParameter[];
  export type ConformancePackName = string;
  export type ConformancePackNamesList = ConformancePackName[];
  export type ConformancePackNamesToSummarizeList = ConformancePackName[];
  export interface ConformancePackRuleCompliance {
    /**
     * Name of the config rule.
     */
    ConfigRuleName?: ConfigRuleName;
    /**
     * Compliance of the Config rule. The allowed values are COMPLIANT, NON_COMPLIANT, and INSUFFICIENT_DATA.
     */
    ComplianceType?: ConformancePackComplianceType;
    /**
     * Controls for the conformance pack. A control is a process to prevent or detect problems while meeting objectives. A control can align with a specific compliance regime or map to internal controls defined by an organization.
     */
    Controls?: ControlsList;
  }
  export type ConformancePackRuleComplianceList = ConformancePackRuleCompliance[];
  export type ConformancePackRuleEvaluationResultsList = ConformancePackEvaluationResult[];
  export type ConformancePackState = "CREATE_IN_PROGRESS"|"CREATE_COMPLETE"|"CREATE_FAILED"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|string;
  export interface ConformancePackStatusDetail {
    /**
     * Name of the conformance pack.
     */
    ConformancePackName: ConformancePackName;
    /**
     * ID of the conformance pack.
     */
    ConformancePackId: ConformancePackId;
    /**
     * Amazon Resource Name (ARN) of comformance pack.
     */
    ConformancePackArn: ConformancePackArn;
    /**
     * Indicates deployment status of conformance pack. Config sets the state of the conformance pack to:   CREATE_IN_PROGRESS when a conformance pack creation is in progress for an account.   CREATE_COMPLETE when a conformance pack has been successfully created in your account.   CREATE_FAILED when a conformance pack creation failed in your account.   DELETE_IN_PROGRESS when a conformance pack deletion is in progress.    DELETE_FAILED when a conformance pack deletion failed in your account.  
     */
    ConformancePackState: ConformancePackState;
    /**
     * Amazon Resource Name (ARN) of CloudFormation stack. 
     */
    StackArn: StackArn;
    /**
     * The reason of conformance pack creation failure.
     */
    ConformancePackStatusReason?: ConformancePackStatusReason;
    /**
     * Last time when conformation pack creation and update was requested.
     */
    LastUpdateRequestedTime: _Date;
    /**
     * Last time when conformation pack creation and update was successful.
     */
    LastUpdateCompletedTime?: _Date;
  }
  export type ConformancePackStatusDetailsList = ConformancePackStatusDetail[];
  export type ConformancePackStatusReason = string;
  export type ControlsList = StringWithCharLimit128[];
  export type CosmosPageLimit = number;
  export type _Date = Date;
  export interface DeleteAggregationAuthorizationRequest {
    /**
     * The 12-digit account ID of the account authorized to aggregate data.
     */
    AuthorizedAccountId: AccountId;
    /**
     * The region authorized to collect aggregated data.
     */
    AuthorizedAwsRegion: AwsRegion;
  }
  export interface DeleteConfigRuleRequest {
    /**
     * The name of the Config rule that you want to delete.
     */
    ConfigRuleName: ConfigRuleName;
  }
  export interface DeleteConfigurationAggregatorRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
  }
  export interface DeleteConfigurationRecorderRequest {
    /**
     * The name of the configuration recorder to be deleted. You can retrieve the name of your configuration recorder by using the DescribeConfigurationRecorders action.
     */
    ConfigurationRecorderName: RecorderName;
  }
  export interface DeleteConformancePackRequest {
    /**
     * Name of the conformance pack you want to delete.
     */
    ConformancePackName: ConformancePackName;
  }
  export interface DeleteDeliveryChannelRequest {
    /**
     * The name of the delivery channel to delete.
     */
    DeliveryChannelName: ChannelName;
  }
  export interface DeleteEvaluationResultsRequest {
    /**
     * The name of the Config rule for which you want to delete the evaluation results.
     */
    ConfigRuleName: StringWithCharLimit64;
  }
  export interface DeleteEvaluationResultsResponse {
  }
  export interface DeleteOrganizationConfigRuleRequest {
    /**
     * The name of organization config rule that you want to delete.
     */
    OrganizationConfigRuleName: OrganizationConfigRuleName;
  }
  export interface DeleteOrganizationConformancePackRequest {
    /**
     * The name of organization conformance pack that you want to delete.
     */
    OrganizationConformancePackName: OrganizationConformancePackName;
  }
  export interface DeletePendingAggregationRequestRequest {
    /**
     * The 12-digit account ID of the account requesting to aggregate data.
     */
    RequesterAccountId: AccountId;
    /**
     * The region requesting to aggregate data.
     */
    RequesterAwsRegion: AwsRegion;
  }
  export interface DeleteRemediationConfigurationRequest {
    /**
     * The name of the Config rule for which you want to delete remediation configuration.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * The type of a resource.
     */
    ResourceType?: String;
  }
  export interface DeleteRemediationConfigurationResponse {
  }
  export interface DeleteRemediationExceptionsRequest {
    /**
     * The name of the Config rule for which you want to delete remediation exception configuration.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * An exception list of resource exception keys to be processed with the current request. Config adds exception for each resource key. For example, Config adds 3 exceptions for 3 resource keys. 
     */
    ResourceKeys: RemediationExceptionResourceKeys;
  }
  export interface DeleteRemediationExceptionsResponse {
    /**
     * Returns a list of failed delete remediation exceptions batch objects. Each object in the batch consists of a list of failed items and failure messages.
     */
    FailedBatches?: FailedDeleteRemediationExceptionsBatches;
  }
  export interface DeleteResourceConfigRequest {
    /**
     * The type of the resource.
     */
    ResourceType: ResourceTypeString;
    /**
     * Unique identifier of the resource.
     */
    ResourceId: ResourceId;
  }
  export interface DeleteRetentionConfigurationRequest {
    /**
     * The name of the retention configuration to delete.
     */
    RetentionConfigurationName: RetentionConfigurationName;
  }
  export interface DeleteStoredQueryRequest {
    /**
     * The name of the query that you want to delete.
     */
    QueryName: QueryName;
  }
  export interface DeleteStoredQueryResponse {
  }
  export interface DeliverConfigSnapshotRequest {
    /**
     * The name of the delivery channel through which the snapshot is delivered.
     */
    deliveryChannelName: ChannelName;
  }
  export interface DeliverConfigSnapshotResponse {
    /**
     * The ID of the snapshot that is being created.
     */
    configSnapshotId?: String;
  }
  export interface DeliveryChannel {
    /**
     * The name of the delivery channel. By default, Config assigns the name "default" when creating the delivery channel. To change the delivery channel name, you must use the DeleteDeliveryChannel action to delete your current delivery channel, and then you must use the PutDeliveryChannel command to create a delivery channel that has the desired name.
     */
    name?: ChannelName;
    /**
     * The name of the Amazon S3 bucket to which Config delivers configuration snapshots and configuration history files. If you specify a bucket that belongs to another Amazon Web Services account, that bucket must have policies that grant access permissions to Config. For more information, see Permissions for the Amazon S3 Bucket in the Config Developer Guide.
     */
    s3BucketName?: String;
    /**
     * The prefix for the specified Amazon S3 bucket.
     */
    s3KeyPrefix?: String;
    /**
     * The Amazon Resource Name (ARN) of the Key Management Service (KMS ) KMS key (KMS key) used to encrypt objects delivered by Config. Must belong to the same Region as the destination S3 bucket.
     */
    s3KmsKeyArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to which Config sends notifications about configuration changes. If you choose a topic from another account, the topic must have policies that grant access permissions to Config. For more information, see Permissions for the Amazon SNS Topic in the Config Developer Guide.
     */
    snsTopicARN?: String;
    /**
     * The options for how often Config delivers configuration snapshots to the Amazon S3 bucket.
     */
    configSnapshotDeliveryProperties?: ConfigSnapshotDeliveryProperties;
  }
  export type DeliveryChannelList = DeliveryChannel[];
  export type DeliveryChannelNameList = ChannelName[];
  export interface DeliveryChannelStatus {
    /**
     * The name of the delivery channel.
     */
    name?: String;
    /**
     * A list containing the status of the delivery of the snapshot to the specified Amazon S3 bucket.
     */
    configSnapshotDeliveryInfo?: ConfigExportDeliveryInfo;
    /**
     * A list that contains the status of the delivery of the configuration history to the specified Amazon S3 bucket.
     */
    configHistoryDeliveryInfo?: ConfigExportDeliveryInfo;
    /**
     * A list containing the status of the delivery of the configuration stream notification to the specified Amazon SNS topic.
     */
    configStreamDeliveryInfo?: ConfigStreamDeliveryInfo;
  }
  export type DeliveryChannelStatusList = DeliveryChannelStatus[];
  export type DeliveryS3Bucket = string;
  export type DeliveryS3KeyPrefix = string;
  export type DeliveryStatus = "Success"|"Failure"|"Not_Applicable"|string;
  export interface DescribeAggregateComplianceByConfigRulesRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * Filters the results by ConfigRuleComplianceFilters object. 
     */
    Filters?: ConfigRuleComplianceFilters;
    /**
     * The maximum number of evaluation results returned on each page. The default is maximum. If you specify 0, Config uses the default.
     */
    Limit?: GroupByAPILimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeAggregateComplianceByConfigRulesResponse {
    /**
     * Returns a list of AggregateComplianceByConfigRule object.
     */
    AggregateComplianceByConfigRules?: AggregateComplianceByConfigRuleList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeAggregateComplianceByConformancePacksRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * Filters the result by AggregateConformancePackComplianceFilters object.
     */
    Filters?: AggregateConformancePackComplianceFilters;
    /**
     * The maximum number of conformance packs compliance details returned on each page. The default is maximum. If you specify 0, Config uses the default. 
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeAggregateComplianceByConformancePacksResponse {
    /**
     * Returns the AggregateComplianceByConformancePack object.
     */
    AggregateComplianceByConformancePacks?: AggregateComplianceByConformancePackList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeAggregationAuthorizationsRequest {
    /**
     * The maximum number of AggregationAuthorizations returned on each page. The default is maximum. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeAggregationAuthorizationsResponse {
    /**
     * Returns a list of authorizations granted to various aggregator accounts and regions.
     */
    AggregationAuthorizations?: AggregationAuthorizationList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeComplianceByConfigRuleRequest {
    /**
     * Specify one or more Config rule names to filter the results by rule.
     */
    ConfigRuleNames?: ConfigRuleNames;
    /**
     * Filters the results by compliance. The allowed values are COMPLIANT and NON_COMPLIANT.
     */
    ComplianceTypes?: ComplianceTypes;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeComplianceByConfigRuleResponse {
    /**
     * Indicates whether each of the specified Config rules is compliant.
     */
    ComplianceByConfigRules?: ComplianceByConfigRules;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeComplianceByResourceRequest {
    /**
     * The types of Amazon Web Services resources for which you want compliance information (for example, AWS::EC2::Instance). For this action, you can specify that the resource type is an Amazon Web Services account by specifying AWS::::Account.
     */
    ResourceType?: StringWithCharLimit256;
    /**
     * The ID of the Amazon Web Services resource for which you want compliance information. You can specify only one resource ID. If you specify a resource ID, you must also specify a type for ResourceType.
     */
    ResourceId?: BaseResourceId;
    /**
     * Filters the results by compliance. The allowed values are COMPLIANT, NON_COMPLIANT, and INSUFFICIENT_DATA.
     */
    ComplianceTypes?: ComplianceTypes;
    /**
     * The maximum number of evaluation results returned on each page. The default is 10. You cannot specify a number greater than 100. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeComplianceByResourceResponse {
    /**
     * Indicates whether the specified Amazon Web Services resource complies with all of the Config rules that evaluate it.
     */
    ComplianceByResources?: ComplianceByResources;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeConfigRuleEvaluationStatusRequest {
    /**
     * The name of the Config managed rules for which you want status information. If you do not specify any names, Config returns status information for all Config managed rules that you use.
     */
    ConfigRuleNames?: ConfigRuleNames;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
    /**
     * The number of rule evaluation results that you want returned. This parameter is required if the rule limit for your account is more than the default of 150 rules. For information about requesting a rule limit increase, see Config Limits in the Amazon Web Services General Reference Guide.
     */
    Limit?: RuleLimit;
  }
  export interface DescribeConfigRuleEvaluationStatusResponse {
    /**
     * Status information about your Config managed rules.
     */
    ConfigRulesEvaluationStatus?: ConfigRuleEvaluationStatusList;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeConfigRulesRequest {
    /**
     * The names of the Config rules for which you want details. If you do not specify any names, Config returns details for all your rules.
     */
    ConfigRuleNames?: ConfigRuleNames;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeConfigRulesResponse {
    /**
     * The details about your Config rules.
     */
    ConfigRules?: ConfigRules;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeConfigurationAggregatorSourcesStatusRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * Filters the status type.   Valid value FAILED indicates errors while moving data.   Valid value SUCCEEDED indicates the data was successfully moved.   Valid value OUTDATED indicates the data is not the most recent.  
     */
    UpdateStatus?: AggregatedSourceStatusTypeList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
    /**
     * The maximum number of AggregatorSourceStatus returned on each page. The default is maximum. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
  }
  export interface DescribeConfigurationAggregatorSourcesStatusResponse {
    /**
     * Returns an AggregatedSourceStatus object. 
     */
    AggregatedSourceStatusList?: AggregatedSourceStatusList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeConfigurationAggregatorsRequest {
    /**
     * The name of the configuration aggregators.
     */
    ConfigurationAggregatorNames?: ConfigurationAggregatorNameList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
    /**
     * The maximum number of configuration aggregators returned on each page. The default is maximum. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
  }
  export interface DescribeConfigurationAggregatorsResponse {
    /**
     * Returns a ConfigurationAggregators object.
     */
    ConfigurationAggregators?: ConfigurationAggregatorList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeConfigurationRecorderStatusRequest {
    /**
     * The name(s) of the configuration recorder. If the name is not specified, the action returns the current status of all the configuration recorders associated with the account.
     */
    ConfigurationRecorderNames?: ConfigurationRecorderNameList;
  }
  export interface DescribeConfigurationRecorderStatusResponse {
    /**
     * A list that contains status of the specified recorders.
     */
    ConfigurationRecordersStatus?: ConfigurationRecorderStatusList;
  }
  export interface DescribeConfigurationRecordersRequest {
    /**
     * A list of configuration recorder names.
     */
    ConfigurationRecorderNames?: ConfigurationRecorderNameList;
  }
  export interface DescribeConfigurationRecordersResponse {
    /**
     * A list that contains the descriptions of the specified configuration recorders.
     */
    ConfigurationRecorders?: ConfigurationRecorderList;
  }
  export type DescribeConformancePackComplianceLimit = number;
  export interface DescribeConformancePackComplianceRequest {
    /**
     * Name of the conformance pack.
     */
    ConformancePackName: ConformancePackName;
    /**
     * A ConformancePackComplianceFilters object.
     */
    Filters?: ConformancePackComplianceFilters;
    /**
     * The maximum number of Config rules within a conformance pack are returned on each page.
     */
    Limit?: DescribeConformancePackComplianceLimit;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeConformancePackComplianceResponse {
    /**
     * Name of the conformance pack.
     */
    ConformancePackName: ConformancePackName;
    /**
     * Returns a list of ConformancePackRuleCompliance objects.
     */
    ConformancePackRuleComplianceList: ConformancePackRuleComplianceList;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeConformancePackStatusRequest {
    /**
     * Comma-separated list of conformance pack names.
     */
    ConformancePackNames?: ConformancePackNamesList;
    /**
     * The maximum number of conformance packs status returned on each page.
     */
    Limit?: PageSizeLimit;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeConformancePackStatusResponse {
    /**
     * A list of ConformancePackStatusDetail objects.
     */
    ConformancePackStatusDetails?: ConformancePackStatusDetailsList;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeConformancePacksRequest {
    /**
     * Comma-separated list of conformance pack names for which you want details. If you do not specify any names, Config returns details for all your conformance packs. 
     */
    ConformancePackNames?: ConformancePackNamesList;
    /**
     * The maximum number of conformance packs returned on each page.
     */
    Limit?: PageSizeLimit;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeConformancePacksResponse {
    /**
     * Returns a list of ConformancePackDetail objects.
     */
    ConformancePackDetails?: ConformancePackDetailList;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface DescribeDeliveryChannelStatusRequest {
    /**
     * A list of delivery channel names.
     */
    DeliveryChannelNames?: DeliveryChannelNameList;
  }
  export interface DescribeDeliveryChannelStatusResponse {
    /**
     * A list that contains the status of a specified delivery channel.
     */
    DeliveryChannelsStatus?: DeliveryChannelStatusList;
  }
  export interface DescribeDeliveryChannelsRequest {
    /**
     * A list of delivery channel names.
     */
    DeliveryChannelNames?: DeliveryChannelNameList;
  }
  export interface DescribeDeliveryChannelsResponse {
    /**
     * A list that contains the descriptions of the specified delivery channel.
     */
    DeliveryChannels?: DeliveryChannelList;
  }
  export interface DescribeOrganizationConfigRuleStatusesRequest {
    /**
     * The names of organization config rules for which you want status details. If you do not specify any names, Config returns details for all your organization Config rules.
     */
    OrganizationConfigRuleNames?: OrganizationConfigRuleNames;
    /**
     * The maximum number of OrganizationConfigRuleStatuses returned on each page. If you do no specify a number, Config uses the default. The default is 100.
     */
    Limit?: CosmosPageLimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConfigRuleStatusesResponse {
    /**
     * A list of OrganizationConfigRuleStatus objects.
     */
    OrganizationConfigRuleStatuses?: OrganizationConfigRuleStatuses;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConfigRulesRequest {
    /**
     * The names of organization config rules for which you want details. If you do not specify any names, Config returns details for all your organization config rules.
     */
    OrganizationConfigRuleNames?: OrganizationConfigRuleNames;
    /**
     * The maximum number of organization config rules returned on each page. If you do no specify a number, Config uses the default. The default is 100.
     */
    Limit?: CosmosPageLimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConfigRulesResponse {
    /**
     * Returns a list of OrganizationConfigRule objects.
     */
    OrganizationConfigRules?: OrganizationConfigRules;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConformancePackStatusesRequest {
    /**
     * The names of organization conformance packs for which you want status details. If you do not specify any names, Config returns details for all your organization conformance packs. 
     */
    OrganizationConformancePackNames?: OrganizationConformancePackNames;
    /**
     * The maximum number of OrganizationConformancePackStatuses returned on each page. If you do no specify a number, Config uses the default. The default is 100. 
     */
    Limit?: CosmosPageLimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConformancePackStatusesResponse {
    /**
     * A list of OrganizationConformancePackStatus objects. 
     */
    OrganizationConformancePackStatuses?: OrganizationConformancePackStatuses;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConformancePacksRequest {
    /**
     * The name that you assign to an organization conformance pack.
     */
    OrganizationConformancePackNames?: OrganizationConformancePackNames;
    /**
     * The maximum number of organization config packs returned on each page. If you do no specify a number, Config uses the default. The default is 100.
     */
    Limit?: CosmosPageLimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeOrganizationConformancePacksResponse {
    /**
     * Returns a list of OrganizationConformancePacks objects.
     */
    OrganizationConformancePacks?: OrganizationConformancePacks;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export type DescribePendingAggregationRequestsLimit = number;
  export interface DescribePendingAggregationRequestsRequest {
    /**
     * The maximum number of evaluation results returned on each page. The default is maximum. If you specify 0, Config uses the default.
     */
    Limit?: DescribePendingAggregationRequestsLimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribePendingAggregationRequestsResponse {
    /**
     * Returns a PendingAggregationRequests object.
     */
    PendingAggregationRequests?: PendingAggregationRequestList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeRemediationConfigurationsRequest {
    /**
     * A list of Config rule names of remediation configurations for which you want details. 
     */
    ConfigRuleNames: ConfigRuleNames;
  }
  export interface DescribeRemediationConfigurationsResponse {
    /**
     * Returns a remediation configuration object.
     */
    RemediationConfigurations?: RemediationConfigurations;
  }
  export interface DescribeRemediationExceptionsRequest {
    /**
     * The name of the Config rule.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * An exception list of resource exception keys to be processed with the current request. Config adds exception for each resource key. For example, Config adds 3 exceptions for 3 resource keys. 
     */
    ResourceKeys?: RemediationExceptionResourceKeys;
    /**
     * The maximum number of RemediationExceptionResourceKey returned on each page. The default is 25. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeRemediationExceptionsResponse {
    /**
     * Returns a list of remediation exception objects.
     */
    RemediationExceptions?: RemediationExceptions;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeRemediationExecutionStatusRequest {
    /**
     * A list of Config rule names.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * A list of resource keys to be processed with the current request. Each element in the list consists of the resource type and resource ID. 
     */
    ResourceKeys?: ResourceKeys;
    /**
     * The maximum number of RemediationExecutionStatuses returned on each page. The default is maximum. If you specify 0, Config uses the default. 
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeRemediationExecutionStatusResponse {
    /**
     * Returns a list of remediation execution statuses objects.
     */
    RemediationExecutionStatuses?: RemediationExecutionStatuses;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface DescribeRetentionConfigurationsRequest {
    /**
     * A list of names of retention configurations for which you want details. If you do not specify a name, Config returns details for all the retention configurations for that account.  Currently, Config supports only one retention configuration per region in your account. 
     */
    RetentionConfigurationNames?: RetentionConfigurationNameList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export interface DescribeRetentionConfigurationsResponse {
    /**
     * Returns a retention configuration object.
     */
    RetentionConfigurations?: RetentionConfigurationList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export type DiscoveredResourceIdentifierList = AggregateResourceIdentifier[];
  export type EarlierTime = Date;
  export type EmptiableStringWithCharLimit256 = string;
  export interface Evaluation {
    /**
     * The type of Amazon Web Services resource that was evaluated.
     */
    ComplianceResourceType: StringWithCharLimit256;
    /**
     * The ID of the Amazon Web Services resource that was evaluated.
     */
    ComplianceResourceId: BaseResourceId;
    /**
     * Indicates whether the Amazon Web Services resource complies with the Config rule that it was evaluated against. For the Evaluation data type, Config supports only the COMPLIANT, NON_COMPLIANT, and NOT_APPLICABLE values. Config does not support the INSUFFICIENT_DATA value for this data type. Similarly, Config does not accept INSUFFICIENT_DATA as the value for ComplianceType from a PutEvaluations request. For example, an Lambda function for a custom Config rule cannot pass an INSUFFICIENT_DATA value to Config.
     */
    ComplianceType: ComplianceType;
    /**
     * Supplementary information about how the evaluation determined the compliance.
     */
    Annotation?: StringWithCharLimit256;
    /**
     * The time of the event in Config that triggered the evaluation. For event-based evaluations, the time indicates when Config created the configuration item that triggered the evaluation. For periodic evaluations, the time indicates when Config triggered the evaluation at the frequency that you specified (for example, every 24 hours).
     */
    OrderingTimestamp: OrderingTimestamp;
  }
  export interface EvaluationResult {
    /**
     * Uniquely identifies the evaluation result.
     */
    EvaluationResultIdentifier?: EvaluationResultIdentifier;
    /**
     * Indicates whether the Amazon Web Services resource complies with the Config rule that evaluated it. For the EvaluationResult data type, Config supports only the COMPLIANT, NON_COMPLIANT, and NOT_APPLICABLE values. Config does not support the INSUFFICIENT_DATA value for the EvaluationResult data type.
     */
    ComplianceType?: ComplianceType;
    /**
     * The time when Config recorded the evaluation result.
     */
    ResultRecordedTime?: _Date;
    /**
     * The time when the Config rule evaluated the Amazon Web Services resource.
     */
    ConfigRuleInvokedTime?: _Date;
    /**
     * Supplementary information about how the evaluation determined the compliance.
     */
    Annotation?: StringWithCharLimit256;
    /**
     * An encrypted token that associates an evaluation with an Config rule. The token identifies the rule, the Amazon Web Services resource being evaluated, and the event that triggered the evaluation.
     */
    ResultToken?: String;
  }
  export interface EvaluationResultIdentifier {
    /**
     * Identifies an Config rule used to evaluate an Amazon Web Services resource, and provides the type and ID of the evaluated resource.
     */
    EvaluationResultQualifier?: EvaluationResultQualifier;
    /**
     * The time of the event that triggered the evaluation of your Amazon Web Services resources. The time can indicate when Config delivered a configuration item change notification, or it can indicate when Config delivered the configuration snapshot, depending on which event triggered the evaluation.
     */
    OrderingTimestamp?: _Date;
  }
  export interface EvaluationResultQualifier {
    /**
     * The name of the Config rule that was used in the evaluation.
     */
    ConfigRuleName?: ConfigRuleName;
    /**
     * The type of Amazon Web Services resource that was evaluated.
     */
    ResourceType?: StringWithCharLimit256;
    /**
     * The ID of the evaluated Amazon Web Services resource.
     */
    ResourceId?: BaseResourceId;
  }
  export type EvaluationResults = EvaluationResult[];
  export type Evaluations = Evaluation[];
  export type EventSource = "aws.config"|string;
  export type ExcludedAccounts = AccountId[];
  export interface ExecutionControls {
    /**
     * A SsmControls object.
     */
    SsmControls?: SsmControls;
  }
  export type Expression = string;
  export interface ExternalEvaluation {
    /**
     * The evaluated compliance resource type. Config accepts AWS::::Account resource type.
     */
    ComplianceResourceType: StringWithCharLimit256;
    /**
     * The evaluated compliance resource ID. Config accepts only Amazon Web Services account ID.
     */
    ComplianceResourceId: BaseResourceId;
    /**
     * The compliance of the Amazon Web Services resource. The valid values are COMPLIANT, NON_COMPLIANT,  and NOT_APPLICABLE.
     */
    ComplianceType: ComplianceType;
    /**
     * Supplementary information about the reason of compliance. For example, this task was completed on a specific date.
     */
    Annotation?: StringWithCharLimit256;
    /**
     * The time when the compliance was recorded. 
     */
    OrderingTimestamp: OrderingTimestamp;
  }
  export interface FailedDeleteRemediationExceptionsBatch {
    /**
     * Returns a failure message for delete remediation exception. For example, Config creates an exception due to an internal error.
     */
    FailureMessage?: String;
    /**
     * Returns remediation exception resource key object of the failed items.
     */
    FailedItems?: RemediationExceptionResourceKeys;
  }
  export type FailedDeleteRemediationExceptionsBatches = FailedDeleteRemediationExceptionsBatch[];
  export interface FailedRemediationBatch {
    /**
     * Returns a failure message. For example, the resource is already compliant.
     */
    FailureMessage?: String;
    /**
     * Returns remediation configurations of the failed items.
     */
    FailedItems?: RemediationConfigurations;
  }
  export type FailedRemediationBatches = FailedRemediationBatch[];
  export interface FailedRemediationExceptionBatch {
    /**
     * Returns a failure message. For example, the auto-remediation has failed.
     */
    FailureMessage?: String;
    /**
     * Returns remediation exception resource key object of the failed items.
     */
    FailedItems?: RemediationExceptions;
  }
  export type FailedRemediationExceptionBatches = FailedRemediationExceptionBatch[];
  export interface FieldInfo {
    /**
     * Name of the field.
     */
    Name?: FieldName;
  }
  export type FieldInfoList = FieldInfo[];
  export type FieldName = string;
  export interface GetAggregateComplianceDetailsByConfigRuleRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * The name of the Config rule for which you want compliance information.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * The 12-digit account ID of the source account.
     */
    AccountId: AccountId;
    /**
     * The source region from where the data is aggregated.
     */
    AwsRegion: AwsRegion;
    /**
     * The resource compliance status.  For the GetAggregateComplianceDetailsByConfigRuleRequest data type, Config supports only the COMPLIANT and NON_COMPLIANT. Config does not support the NOT_APPLICABLE and INSUFFICIENT_DATA values. 
     */
    ComplianceType?: ComplianceType;
    /**
     * The maximum number of evaluation results returned on each page. The default is 50. You cannot specify a number greater than 100. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetAggregateComplianceDetailsByConfigRuleResponse {
    /**
     * Returns an AggregateEvaluationResults object.
     */
    AggregateEvaluationResults?: AggregateEvaluationResultList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetAggregateConfigRuleComplianceSummaryRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * Filters the results based on the ConfigRuleComplianceSummaryFilters object.
     */
    Filters?: ConfigRuleComplianceSummaryFilters;
    /**
     * Groups the result based on ACCOUNT_ID or AWS_REGION.
     */
    GroupByKey?: ConfigRuleComplianceSummaryGroupKey;
    /**
     * The maximum number of evaluation results returned on each page. The default is 1000. You cannot specify a number greater than 1000. If you specify 0, Config uses the default.
     */
    Limit?: GroupByAPILimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetAggregateConfigRuleComplianceSummaryResponse {
    /**
     * Groups the result based on ACCOUNT_ID or AWS_REGION.
     */
    GroupByKey?: StringWithCharLimit256;
    /**
     * Returns a list of AggregateComplianceCounts object.
     */
    AggregateComplianceCounts?: AggregateComplianceCountList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetAggregateConformancePackComplianceSummaryRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * Filters the results based on the AggregateConformancePackComplianceSummaryFilters object.
     */
    Filters?: AggregateConformancePackComplianceSummaryFilters;
    /**
     * Groups the result based on Amazon Web Services account ID or Amazon Web Services Region.
     */
    GroupByKey?: AggregateConformancePackComplianceSummaryGroupKey;
    /**
     * The maximum number of results returned on each page. The default is maximum. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetAggregateConformancePackComplianceSummaryResponse {
    /**
     * Returns a list of AggregateConformancePackComplianceSummary object.
     */
    AggregateConformancePackComplianceSummaries?: AggregateConformancePackComplianceSummaryList;
    /**
     * Groups the result based on Amazon Web Services account ID or Amazon Web Services Region.
     */
    GroupByKey?: StringWithCharLimit256;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetAggregateDiscoveredResourceCountsRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * Filters the results based on the ResourceCountFilters object.
     */
    Filters?: ResourceCountFilters;
    /**
     * The key to group the resource counts.
     */
    GroupByKey?: ResourceCountGroupKey;
    /**
     * The maximum number of GroupedResourceCount objects returned on each page. The default is 1000. You cannot specify a number greater than 1000. If you specify 0, Config uses the default.
     */
    Limit?: GroupByAPILimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export interface GetAggregateDiscoveredResourceCountsResponse {
    /**
     * The total number of resources that are present in an aggregator with the filters that you provide.
     */
    TotalDiscoveredResources: Long;
    /**
     * The key passed into the request object. If GroupByKey is not provided, the result will be empty.
     */
    GroupByKey?: StringWithCharLimit256;
    /**
     * Returns a list of GroupedResourceCount objects.
     */
    GroupedResourceCounts?: GroupedResourceCountList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetAggregateResourceConfigRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * An object that identifies aggregate resource.
     */
    ResourceIdentifier: AggregateResourceIdentifier;
  }
  export interface GetAggregateResourceConfigResponse {
    /**
     * Returns a ConfigurationItem object.
     */
    ConfigurationItem?: ConfigurationItem;
  }
  export interface GetComplianceDetailsByConfigRuleRequest {
    /**
     * The name of the Config rule for which you want compliance information.
     */
    ConfigRuleName: StringWithCharLimit64;
    /**
     * Filters the results by compliance. The allowed values are COMPLIANT, NON_COMPLIANT, and NOT_APPLICABLE.
     */
    ComplianceTypes?: ComplianceTypes;
    /**
     * The maximum number of evaluation results returned on each page. The default is 10. You cannot specify a number greater than 100. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetComplianceDetailsByConfigRuleResponse {
    /**
     * Indicates whether the Amazon Web Services resource complies with the specified Config rule.
     */
    EvaluationResults?: EvaluationResults;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetComplianceDetailsByResourceRequest {
    /**
     * The type of the Amazon Web Services resource for which you want compliance information.
     */
    ResourceType: StringWithCharLimit256;
    /**
     * The ID of the Amazon Web Services resource for which you want compliance information.
     */
    ResourceId: BaseResourceId;
    /**
     * Filters the results by compliance. The allowed values are COMPLIANT, NON_COMPLIANT, and NOT_APPLICABLE.
     */
    ComplianceTypes?: ComplianceTypes;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface GetComplianceDetailsByResourceResponse {
    /**
     * Indicates whether the specified Amazon Web Services resource complies each Config rule.
     */
    EvaluationResults?: EvaluationResults;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    NextToken?: String;
  }
  export interface GetComplianceSummaryByConfigRuleResponse {
    /**
     * The number of Config rules that are compliant and the number that are noncompliant, up to a maximum of 25 for each.
     */
    ComplianceSummary?: ComplianceSummary;
  }
  export interface GetComplianceSummaryByResourceTypeRequest {
    /**
     * Specify one or more resource types to get the number of resources that are compliant and the number that are noncompliant for each resource type. For this request, you can specify an Amazon Web Services resource type such as AWS::EC2::Instance. You can specify that the resource type is an Amazon Web Services account by specifying AWS::::Account.
     */
    ResourceTypes?: ResourceTypes;
  }
  export interface GetComplianceSummaryByResourceTypeResponse {
    /**
     * The number of resources that are compliant and the number that are noncompliant. If one or more resource types were provided with the request, the numbers are returned for each resource type. The maximum number returned is 100.
     */
    ComplianceSummariesByResourceType?: ComplianceSummariesByResourceType;
  }
  export type GetConformancePackComplianceDetailsLimit = number;
  export interface GetConformancePackComplianceDetailsRequest {
    /**
     * Name of the conformance pack.
     */
    ConformancePackName: ConformancePackName;
    /**
     * A ConformancePackEvaluationFilters object.
     */
    Filters?: ConformancePackEvaluationFilters;
    /**
     * The maximum number of evaluation results returned on each page. If you do no specify a number, Config uses the default. The default is 100.
     */
    Limit?: GetConformancePackComplianceDetailsLimit;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetConformancePackComplianceDetailsResponse {
    /**
     * Name of the conformance pack.
     */
    ConformancePackName: ConformancePackName;
    /**
     * Returns a list of ConformancePackEvaluationResult objects.
     */
    ConformancePackRuleEvaluationResults?: ConformancePackRuleEvaluationResultsList;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetConformancePackComplianceSummaryRequest {
    /**
     * Names of conformance packs.
     */
    ConformancePackNames: ConformancePackNamesToSummarizeList;
    /**
     * The maximum number of conformance packs returned on each page.
     */
    Limit?: PageSizeLimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetConformancePackComplianceSummaryResponse {
    /**
     * A list of ConformancePackComplianceSummary objects. 
     */
    ConformancePackComplianceSummaryList?: ConformancePackComplianceSummaryList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface GetDiscoveredResourceCountsRequest {
    /**
     * The comma-separated list that specifies the resource types that you want Config to return (for example, "AWS::EC2::Instance", "AWS::IAM::User"). If a value for resourceTypes is not specified, Config returns all resource types that Config is recording in the region for your account.  If the configuration recorder is turned off, Config returns an empty list of ResourceCount objects. If the configuration recorder is not recording a specific resource type (for example, S3 buckets), that resource type is not returned in the list of ResourceCount objects. 
     */
    resourceTypes?: ResourceTypes;
    /**
     * The maximum number of ResourceCount objects returned on each page. The default is 100. You cannot specify a number greater than 100. If you specify 0, Config uses the default.
     */
    limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    nextToken?: NextToken;
  }
  export interface GetDiscoveredResourceCountsResponse {
    /**
     * The total number of resources that Config is recording in the region for your account. If you specify resource types in the request, Config returns only the total number of resources for those resource types.  Example    Config is recording three resource types in the US East (Ohio) Region for your account: 25 EC2 instances, 20 IAM users, and 15 S3 buckets, for a total of 60 resources.   You make a call to the GetDiscoveredResourceCounts action and specify the resource type, "AWS::EC2::Instances", in the request.   Config returns 25 for totalDiscoveredResources.  
     */
    totalDiscoveredResources?: Long;
    /**
     * The list of ResourceCount objects. Each object is listed in descending order by the number of resources.
     */
    resourceCounts?: ResourceCounts;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    nextToken?: NextToken;
  }
  export interface GetOrganizationConfigRuleDetailedStatusRequest {
    /**
     * The name of organization config rule for which you want status details for member accounts.
     */
    OrganizationConfigRuleName: OrganizationConfigRuleName;
    /**
     * A StatusDetailFilters object.
     */
    Filters?: StatusDetailFilters;
    /**
     * The maximum number of OrganizationConfigRuleDetailedStatus returned on each page. If you do not specify a number, Config uses the default. The default is 100.
     */
    Limit?: CosmosPageLimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface GetOrganizationConfigRuleDetailedStatusResponse {
    /**
     * A list of MemberAccountStatus objects.
     */
    OrganizationConfigRuleDetailedStatus?: OrganizationConfigRuleDetailedStatus;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface GetOrganizationConformancePackDetailedStatusRequest {
    /**
     * The name of organization conformance pack for which you want status details for member accounts.
     */
    OrganizationConformancePackName: OrganizationConformancePackName;
    /**
     * An OrganizationResourceDetailedStatusFilters object.
     */
    Filters?: OrganizationResourceDetailedStatusFilters;
    /**
     * The maximum number of OrganizationConformancePackDetailedStatuses returned on each page. If you do not specify a number, Config uses the default. The default is 100. 
     */
    Limit?: CosmosPageLimit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface GetOrganizationConformancePackDetailedStatusResponse {
    /**
     * A list of OrganizationConformancePackDetailedStatus objects. 
     */
    OrganizationConformancePackDetailedStatuses?: OrganizationConformancePackDetailedStatuses;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: String;
  }
  export interface GetResourceConfigHistoryRequest {
    /**
     * The resource type.
     */
    resourceType: ResourceType;
    /**
     * The ID of the resource (for example., sg-xxxxxx).
     */
    resourceId: ResourceId;
    /**
     * The time stamp that indicates a later time. If not specified, current time is taken.
     */
    laterTime?: LaterTime;
    /**
     * The time stamp that indicates an earlier time. If not specified, the action returns paginated results that contain configuration items that start when the first configuration item was recorded.
     */
    earlierTime?: EarlierTime;
    /**
     * The chronological order for configuration items listed. By default, the results are listed in reverse chronological order.
     */
    chronologicalOrder?: ChronologicalOrder;
    /**
     * The maximum number of configuration items returned on each page. The default is 10. You cannot specify a number greater than 100. If you specify 0, Config uses the default.
     */
    limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    nextToken?: NextToken;
  }
  export interface GetResourceConfigHistoryResponse {
    /**
     * A list that contains the configuration history of one or more resources.
     */
    configurationItems?: ConfigurationItemList;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    nextToken?: NextToken;
  }
  export interface GetStoredQueryRequest {
    /**
     * The name of the query.
     */
    QueryName: QueryName;
  }
  export interface GetStoredQueryResponse {
    /**
     * Returns a StoredQuery object.
     */
    StoredQuery?: StoredQuery;
  }
  export type GroupByAPILimit = number;
  export interface GroupedResourceCount {
    /**
     * The name of the group that can be region, account ID, or resource type. For example, region1, region2 if the region was chosen as GroupByKey.
     */
    GroupName: StringWithCharLimit256;
    /**
     * The number of resources in the group.
     */
    ResourceCount: Long;
  }
  export type GroupedResourceCountList = GroupedResourceCount[];
  export type IncludeGlobalResourceTypes = boolean;
  export type Integer = number;
  export type LaterTime = Date;
  export type Limit = number;
  export interface ListAggregateDiscoveredResourcesRequest {
    /**
     * The name of the configuration aggregator. 
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * The type of resources that you want Config to list in the response.
     */
    ResourceType: ResourceType;
    /**
     * Filters the results based on the ResourceFilters object.
     */
    Filters?: ResourceFilters;
    /**
     * The maximum number of resource identifiers returned on each page. You cannot specify a number greater than 100. If you specify 0, Config uses the default.
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface ListAggregateDiscoveredResourcesResponse {
    /**
     * Returns a list of ResourceIdentifiers objects.
     */
    ResourceIdentifiers?: DiscoveredResourceIdentifierList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    NextToken?: NextToken;
  }
  export interface ListDiscoveredResourcesRequest {
    /**
     * The type of resources that you want Config to list in the response.
     */
    resourceType: ResourceType;
    /**
     * The IDs of only those resources that you want Config to list in the response. If you do not specify this parameter, Config lists all resources of the specified type that it has discovered.
     */
    resourceIds?: ResourceIdList;
    /**
     * The custom name of only those resources that you want Config to list in the response. If you do not specify this parameter, Config lists all resources of the specified type that it has discovered.
     */
    resourceName?: ResourceName;
    /**
     * The maximum number of resource identifiers returned on each page. The default is 100. You cannot specify a number greater than 100. If you specify 0, Config uses the default.
     */
    limit?: Limit;
    /**
     * Specifies whether Config includes deleted resources in the results. By default, deleted resources are not included.
     */
    includeDeletedResources?: Boolean;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response.
     */
    nextToken?: NextToken;
  }
  export interface ListDiscoveredResourcesResponse {
    /**
     * The details that identify a resource that is discovered by Config, including the resource type, ID, and (if available) the custom resource name.
     */
    resourceIdentifiers?: ResourceIdentifierList;
    /**
     * The string that you use in a subsequent request to get the next page of results in a paginated response.
     */
    nextToken?: NextToken;
  }
  export interface ListStoredQueriesRequest {
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned with a single call.
     */
    MaxResults?: Limit;
  }
  export interface ListStoredQueriesResponse {
    /**
     * A list of StoredQueryMetadata objects.
     */
    StoredQueryMetadata?: StoredQueryMetadataList;
    /**
     * If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. Currently, the supported resources are ConfigRule, ConfigurationAggregator and AggregatorAuthorization.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The maximum number of tags returned on each page. The limit maximum is 50. You cannot specify a number greater than 50. If you specify 0, Config uses the default. 
     */
    Limit?: Limit;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    Tags?: TagList;
    /**
     * The nextToken string returned on a previous page that you use to get the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export type Long = number;
  export type MaximumExecutionFrequency = "One_Hour"|"Three_Hours"|"Six_Hours"|"Twelve_Hours"|"TwentyFour_Hours"|string;
  export type MemberAccountRuleStatus = "CREATE_SUCCESSFUL"|"CREATE_IN_PROGRESS"|"CREATE_FAILED"|"DELETE_SUCCESSFUL"|"DELETE_FAILED"|"DELETE_IN_PROGRESS"|"UPDATE_SUCCESSFUL"|"UPDATE_IN_PROGRESS"|"UPDATE_FAILED"|string;
  export interface MemberAccountStatus {
    /**
     * The 12-digit account ID of a member account.
     */
    AccountId: AccountId;
    /**
     * The name of config rule deployed in the member account.
     */
    ConfigRuleName: StringWithCharLimit64;
    /**
     * Indicates deployment status for config rule in the member account. When master account calls PutOrganizationConfigRule action for the first time, config rule status is created in the member account. When master account calls PutOrganizationConfigRule action for the second time, config rule status is updated in the member account. Config rule status is deleted when the master account deletes OrganizationConfigRule and disables service access for config-multiaccountsetup.amazonaws.com.   Config sets the state of the rule to:    CREATE_SUCCESSFUL when config rule has been created in the member account.     CREATE_IN_PROGRESS when config rule is being created in the member account.    CREATE_FAILED when config rule creation has failed in the member account.    DELETE_FAILED when config rule deletion has failed in the member account.    DELETE_IN_PROGRESS when config rule is being deleted in the member account.    DELETE_SUCCESSFUL when config rule has been deleted in the member account.     UPDATE_SUCCESSFUL when config rule has been updated in the member account.    UPDATE_IN_PROGRESS when config rule is being updated in the member account.    UPDATE_FAILED when config rule deletion has failed in the member account.  
     */
    MemberAccountRuleStatus: MemberAccountRuleStatus;
    /**
     * An error code that is returned when config rule creation or deletion failed in the member account.
     */
    ErrorCode?: String;
    /**
     * An error message indicating that config rule account creation or deletion has failed due to an error in the member account.
     */
    ErrorMessage?: String;
    /**
     * The timestamp of the last status update.
     */
    LastUpdateTime?: _Date;
  }
  export type MessageType = "ConfigurationItemChangeNotification"|"ConfigurationSnapshotDeliveryCompleted"|"ScheduledNotification"|"OversizedConfigurationItemChangeNotification"|string;
  export type Name = string;
  export type NextToken = string;
  export type OrderingTimestamp = Date;
  export interface OrganizationAggregationSource {
    /**
     * ARN of the IAM role used to retrieve Amazon Web Services Organization details associated with the aggregator account.
     */
    RoleArn: String;
    /**
     * The source regions being aggregated.
     */
    AwsRegions?: AggregatorRegionList;
    /**
     * If true, aggregate existing Config regions and future regions.
     */
    AllAwsRegions?: Boolean;
  }
  export interface OrganizationConfigRule {
    /**
     * The name that you assign to organization config rule.
     */
    OrganizationConfigRuleName: OrganizationConfigRuleName;
    /**
     * Amazon Resource Name (ARN) of organization config rule.
     */
    OrganizationConfigRuleArn: StringWithCharLimit256;
    /**
     * An OrganizationManagedRuleMetadata object.
     */
    OrganizationManagedRuleMetadata?: OrganizationManagedRuleMetadata;
    /**
     * An OrganizationCustomRuleMetadata object.
     */
    OrganizationCustomRuleMetadata?: OrganizationCustomRuleMetadata;
    /**
     * A comma-separated list of accounts excluded from organization config rule.
     */
    ExcludedAccounts?: ExcludedAccounts;
    /**
     * The timestamp of the last update.
     */
    LastUpdateTime?: _Date;
  }
  export type OrganizationConfigRuleDetailedStatus = MemberAccountStatus[];
  export type OrganizationConfigRuleName = string;
  export type OrganizationConfigRuleNames = StringWithCharLimit64[];
  export interface OrganizationConfigRuleStatus {
    /**
     * The name that you assign to organization config rule.
     */
    OrganizationConfigRuleName: OrganizationConfigRuleName;
    /**
     * Indicates deployment status of an organization config rule. When master account calls PutOrganizationConfigRule action for the first time, config rule status is created in all the member accounts. When master account calls PutOrganizationConfigRule action for the second time, config rule status is updated in all the member accounts. Additionally, config rule status is updated when one or more member accounts join or leave an organization. Config rule status is deleted when the master account deletes OrganizationConfigRule in all the member accounts and disables service access for config-multiaccountsetup.amazonaws.com. Config sets the state of the rule to:    CREATE_SUCCESSFUL when an organization config rule has been successfully created in all the member accounts.     CREATE_IN_PROGRESS when an organization config rule creation is in progress.    CREATE_FAILED when an organization config rule creation failed in one or more member accounts within that organization.    DELETE_FAILED when an organization config rule deletion failed in one or more member accounts within that organization.    DELETE_IN_PROGRESS when an organization config rule deletion is in progress.    DELETE_SUCCESSFUL when an organization config rule has been successfully deleted from all the member accounts.    UPDATE_SUCCESSFUL when an organization config rule has been successfully updated in all the member accounts.    UPDATE_IN_PROGRESS when an organization config rule update is in progress.    UPDATE_FAILED when an organization config rule update failed in one or more member accounts within that organization.  
     */
    OrganizationRuleStatus: OrganizationRuleStatus;
    /**
     * An error code that is returned when organization config rule creation or deletion has failed.
     */
    ErrorCode?: String;
    /**
     * An error message indicating that organization config rule creation or deletion failed due to an error.
     */
    ErrorMessage?: String;
    /**
     * The timestamp of the last update.
     */
    LastUpdateTime?: _Date;
  }
  export type OrganizationConfigRuleStatuses = OrganizationConfigRuleStatus[];
  export type OrganizationConfigRuleTriggerType = "ConfigurationItemChangeNotification"|"OversizedConfigurationItemChangeNotification"|"ScheduledNotification"|string;
  export type OrganizationConfigRuleTriggerTypes = OrganizationConfigRuleTriggerType[];
  export type OrganizationConfigRules = OrganizationConfigRule[];
  export interface OrganizationConformancePack {
    /**
     * The name you assign to an organization conformance pack.
     */
    OrganizationConformancePackName: OrganizationConformancePackName;
    /**
     * Amazon Resource Name (ARN) of organization conformance pack.
     */
    OrganizationConformancePackArn: StringWithCharLimit256;
    /**
     * The name of the Amazon S3 bucket where Config stores conformance pack templates.   This field is optional. 
     */
    DeliveryS3Bucket?: DeliveryS3Bucket;
    /**
     * Any folder structure you want to add to an Amazon S3 bucket.  This field is optional. 
     */
    DeliveryS3KeyPrefix?: DeliveryS3KeyPrefix;
    /**
     * A list of ConformancePackInputParameter objects.
     */
    ConformancePackInputParameters?: ConformancePackInputParameters;
    /**
     * A comma-separated list of accounts excluded from organization conformance pack.
     */
    ExcludedAccounts?: ExcludedAccounts;
    /**
     * Last time when organization conformation pack was updated.
     */
    LastUpdateTime: _Date;
  }
  export interface OrganizationConformancePackDetailedStatus {
    /**
     * The 12-digit account ID of a member account.
     */
    AccountId: AccountId;
    /**
     * The name of conformance pack deployed in the member account.
     */
    ConformancePackName: StringWithCharLimit256;
    /**
     * Indicates deployment status for conformance pack in a member account. When master account calls PutOrganizationConformancePack action for the first time, conformance pack status is created in the member account. When master account calls PutOrganizationConformancePack action for the second time, conformance pack status is updated in the member account. Conformance pack status is deleted when the master account deletes OrganizationConformancePack and disables service access for config-multiaccountsetup.amazonaws.com.   Config sets the state of the conformance pack to:    CREATE_SUCCESSFUL when conformance pack has been created in the member account.     CREATE_IN_PROGRESS when conformance pack is being created in the member account.    CREATE_FAILED when conformance pack creation has failed in the member account.    DELETE_FAILED when conformance pack deletion has failed in the member account.    DELETE_IN_PROGRESS when conformance pack is being deleted in the member account.    DELETE_SUCCESSFUL when conformance pack has been deleted in the member account.     UPDATE_SUCCESSFUL when conformance pack has been updated in the member account.    UPDATE_IN_PROGRESS when conformance pack is being updated in the member account.    UPDATE_FAILED when conformance pack deletion has failed in the member account.  
     */
    Status: OrganizationResourceDetailedStatus;
    /**
     * An error code that is returned when conformance pack creation or deletion failed in the member account. 
     */
    ErrorCode?: String;
    /**
     * An error message indicating that conformance pack account creation or deletion has failed due to an error in the member account. 
     */
    ErrorMessage?: String;
    /**
     * The timestamp of the last status update.
     */
    LastUpdateTime?: _Date;
  }
  export type OrganizationConformancePackDetailedStatuses = OrganizationConformancePackDetailedStatus[];
  export type OrganizationConformancePackName = string;
  export type OrganizationConformancePackNames = OrganizationConformancePackName[];
  export interface OrganizationConformancePackStatus {
    /**
     * The name that you assign to organization conformance pack.
     */
    OrganizationConformancePackName: OrganizationConformancePackName;
    /**
     * Indicates deployment status of an organization conformance pack. When master account calls PutOrganizationConformancePack for the first time, conformance pack status is created in all the member accounts. When master account calls PutOrganizationConformancePack for the second time, conformance pack status is updated in all the member accounts. Additionally, conformance pack status is updated when one or more member accounts join or leave an organization. Conformance pack status is deleted when the master account deletes OrganizationConformancePack in all the member accounts and disables service access for config-multiaccountsetup.amazonaws.com. Config sets the state of the conformance pack to:    CREATE_SUCCESSFUL when an organization conformance pack has been successfully created in all the member accounts.     CREATE_IN_PROGRESS when an organization conformance pack creation is in progress.    CREATE_FAILED when an organization conformance pack creation failed in one or more member accounts within that organization.    DELETE_FAILED when an organization conformance pack deletion failed in one or more member accounts within that organization.    DELETE_IN_PROGRESS when an organization conformance pack deletion is in progress.    DELETE_SUCCESSFUL when an organization conformance pack has been successfully deleted from all the member accounts.    UPDATE_SUCCESSFUL when an organization conformance pack has been successfully updated in all the member accounts.    UPDATE_IN_PROGRESS when an organization conformance pack update is in progress.    UPDATE_FAILED when an organization conformance pack update failed in one or more member accounts within that organization.  
     */
    Status: OrganizationResourceStatus;
    /**
     * An error code that is returned when organization conformance pack creation or deletion has failed in a member account. 
     */
    ErrorCode?: String;
    /**
     * An error message indicating that organization conformance pack creation or deletion failed due to an error. 
     */
    ErrorMessage?: String;
    /**
     * The timestamp of the last update.
     */
    LastUpdateTime?: _Date;
  }
  export type OrganizationConformancePackStatuses = OrganizationConformancePackStatus[];
  export type OrganizationConformancePacks = OrganizationConformancePack[];
  export interface OrganizationCustomRuleMetadata {
    /**
     * The description that you provide for organization config rule.
     */
    Description?: StringWithCharLimit256Min0;
    /**
     * The lambda function ARN.
     */
    LambdaFunctionArn: StringWithCharLimit256;
    /**
     * The type of notification that triggers Config to run an evaluation for a rule. You can specify the following notification types:    ConfigurationItemChangeNotification - Triggers an evaluation when Config delivers a configuration item as a result of a resource change.    OversizedConfigurationItemChangeNotification - Triggers an evaluation when Config delivers an oversized configuration item. Config may generate this notification type when a resource changes and the notification exceeds the maximum size allowed by Amazon SNS.    ScheduledNotification - Triggers a periodic evaluation at the frequency specified for MaximumExecutionFrequency.  
     */
    OrganizationConfigRuleTriggerTypes: OrganizationConfigRuleTriggerTypes;
    /**
     * A string, in JSON format, that is passed to organization config rule Lambda function.
     */
    InputParameters?: StringWithCharLimit2048;
    /**
     * The maximum frequency with which Config runs evaluations for a rule. Your custom rule is triggered when Config delivers the configuration snapshot. For more information, see ConfigSnapshotDeliveryProperties.  By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the MaximumExecutionFrequency parameter. 
     */
    MaximumExecutionFrequency?: MaximumExecutionFrequency;
    /**
     * The type of the Amazon Web Services resource that was evaluated.
     */
    ResourceTypesScope?: ResourceTypesScope;
    /**
     * The ID of the Amazon Web Services resource that was evaluated.
     */
    ResourceIdScope?: StringWithCharLimit768;
    /**
     * One part of a key-value pair that make up a tag. A key is a general label that acts like a category for more specific tag values. 
     */
    TagKeyScope?: StringWithCharLimit128;
    /**
     * The optional part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key). 
     */
    TagValueScope?: StringWithCharLimit256;
  }
  export interface OrganizationManagedRuleMetadata {
    /**
     * The description that you provide for organization config rule.
     */
    Description?: StringWithCharLimit256Min0;
    /**
     * For organization config managed rules, a predefined identifier from a list. For example, IAM_PASSWORD_POLICY is a managed rule. To reference a managed rule, see Using Config managed rules.
     */
    RuleIdentifier: StringWithCharLimit256;
    /**
     * A string, in JSON format, that is passed to organization config rule Lambda function.
     */
    InputParameters?: StringWithCharLimit2048;
    /**
     * The maximum frequency with which Config runs evaluations for a rule. You are using an Config managed rule that is triggered at a periodic frequency.  By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the MaximumExecutionFrequency parameter. 
     */
    MaximumExecutionFrequency?: MaximumExecutionFrequency;
    /**
     * The type of the Amazon Web Services resource that was evaluated.
     */
    ResourceTypesScope?: ResourceTypesScope;
    /**
     * The ID of the Amazon Web Services resource that was evaluated.
     */
    ResourceIdScope?: StringWithCharLimit768;
    /**
     * One part of a key-value pair that make up a tag. A key is a general label that acts like a category for more specific tag values. 
     */
    TagKeyScope?: StringWithCharLimit128;
    /**
     * The optional part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key).
     */
    TagValueScope?: StringWithCharLimit256;
  }
  export type OrganizationResourceDetailedStatus = "CREATE_SUCCESSFUL"|"CREATE_IN_PROGRESS"|"CREATE_FAILED"|"DELETE_SUCCESSFUL"|"DELETE_FAILED"|"DELETE_IN_PROGRESS"|"UPDATE_SUCCESSFUL"|"UPDATE_IN_PROGRESS"|"UPDATE_FAILED"|string;
  export interface OrganizationResourceDetailedStatusFilters {
    /**
     * The 12-digit account ID of the member account within an organization.
     */
    AccountId?: AccountId;
    /**
     * Indicates deployment status for conformance pack in a member account. When master account calls PutOrganizationConformancePack action for the first time, conformance pack status is created in the member account. When master account calls PutOrganizationConformancePack action for the second time, conformance pack status is updated in the member account. Conformance pack status is deleted when the master account deletes OrganizationConformancePack and disables service access for config-multiaccountsetup.amazonaws.com.   Config sets the state of the conformance pack to:    CREATE_SUCCESSFUL when conformance pack has been created in the member account.     CREATE_IN_PROGRESS when conformance pack is being created in the member account.    CREATE_FAILED when conformance pack creation has failed in the member account.    DELETE_FAILED when conformance pack deletion has failed in the member account.    DELETE_IN_PROGRESS when conformance pack is being deleted in the member account.    DELETE_SUCCESSFUL when conformance pack has been deleted in the member account.     UPDATE_SUCCESSFUL when conformance pack has been updated in the member account.    UPDATE_IN_PROGRESS when conformance pack is being updated in the member account.    UPDATE_FAILED when conformance pack deletion has failed in the member account.  
     */
    Status?: OrganizationResourceDetailedStatus;
  }
  export type OrganizationResourceStatus = "CREATE_SUCCESSFUL"|"CREATE_IN_PROGRESS"|"CREATE_FAILED"|"DELETE_SUCCESSFUL"|"DELETE_FAILED"|"DELETE_IN_PROGRESS"|"UPDATE_SUCCESSFUL"|"UPDATE_IN_PROGRESS"|"UPDATE_FAILED"|string;
  export type OrganizationRuleStatus = "CREATE_SUCCESSFUL"|"CREATE_IN_PROGRESS"|"CREATE_FAILED"|"DELETE_SUCCESSFUL"|"DELETE_FAILED"|"DELETE_IN_PROGRESS"|"UPDATE_SUCCESSFUL"|"UPDATE_IN_PROGRESS"|"UPDATE_FAILED"|string;
  export type Owner = "CUSTOM_LAMBDA"|"AWS"|string;
  export type PageSizeLimit = number;
  export type ParameterName = string;
  export type ParameterValue = string;
  export interface PendingAggregationRequest {
    /**
     * The 12-digit account ID of the account requesting to aggregate data.
     */
    RequesterAccountId?: AccountId;
    /**
     * The region requesting to aggregate data. 
     */
    RequesterAwsRegion?: AwsRegion;
  }
  export type PendingAggregationRequestList = PendingAggregationRequest[];
  export type Percentage = number;
  export interface PutAggregationAuthorizationRequest {
    /**
     * The 12-digit account ID of the account authorized to aggregate data.
     */
    AuthorizedAccountId: AccountId;
    /**
     * The region authorized to collect aggregated data.
     */
    AuthorizedAwsRegion: AwsRegion;
    /**
     * An array of tag object.
     */
    Tags?: TagsList;
  }
  export interface PutAggregationAuthorizationResponse {
    /**
     * Returns an AggregationAuthorization object. 
     */
    AggregationAuthorization?: AggregationAuthorization;
  }
  export interface PutConfigRuleRequest {
    /**
     * The rule that you want to add to your account.
     */
    ConfigRule: ConfigRule;
    /**
     * An array of tag object.
     */
    Tags?: TagsList;
  }
  export interface PutConfigurationAggregatorRequest {
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * A list of AccountAggregationSource object. 
     */
    AccountAggregationSources?: AccountAggregationSourceList;
    /**
     * An OrganizationAggregationSource object.
     */
    OrganizationAggregationSource?: OrganizationAggregationSource;
    /**
     * An array of tag object.
     */
    Tags?: TagsList;
  }
  export interface PutConfigurationAggregatorResponse {
    /**
     * Returns a ConfigurationAggregator object.
     */
    ConfigurationAggregator?: ConfigurationAggregator;
  }
  export interface PutConfigurationRecorderRequest {
    /**
     * The configuration recorder object that records each configuration change made to the resources.
     */
    ConfigurationRecorder: ConfigurationRecorder;
  }
  export interface PutConformancePackRequest {
    /**
     * Name of the conformance pack you want to create.
     */
    ConformancePackName: ConformancePackName;
    /**
     * Location of file containing the template body (s3://bucketname/prefix). The uri must point to the conformance pack template (max size: 300 KB) that is located in an Amazon S3 bucket in the same region as the conformance pack.   You must have access to read Amazon S3 bucket. 
     */
    TemplateS3Uri?: TemplateS3Uri;
    /**
     * A string containing full conformance pack template body. Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.  You can only use a YAML template with one resource type, that is, config rule and a remediation action.  
     */
    TemplateBody?: TemplateBody;
    /**
     * The name of the Amazon S3 bucket where Config stores conformance pack templates.  This field is optional. 
     */
    DeliveryS3Bucket?: DeliveryS3Bucket;
    /**
     * The prefix for the Amazon S3 bucket.   This field is optional. 
     */
    DeliveryS3KeyPrefix?: DeliveryS3KeyPrefix;
    /**
     * A list of ConformancePackInputParameter objects.
     */
    ConformancePackInputParameters?: ConformancePackInputParameters;
  }
  export interface PutConformancePackResponse {
    /**
     * ARN of the conformance pack.
     */
    ConformancePackArn?: ConformancePackArn;
  }
  export interface PutDeliveryChannelRequest {
    /**
     * The configuration delivery channel object that delivers the configuration information to an Amazon S3 bucket and to an Amazon SNS topic.
     */
    DeliveryChannel: DeliveryChannel;
  }
  export interface PutEvaluationsRequest {
    /**
     * The assessments that the Lambda function performs. Each evaluation identifies an Amazon Web Services resource and indicates whether it complies with the Config rule that invokes the Lambda function.
     */
    Evaluations?: Evaluations;
    /**
     * An encrypted token that associates an evaluation with an Config rule. Identifies the rule and the event that triggered the evaluation.
     */
    ResultToken: String;
    /**
     * Use this parameter to specify a test run for PutEvaluations. You can verify whether your Lambda function will deliver evaluation results to Config. No updates occur to your existing evaluations, and evaluation results are not sent to Config.  When TestMode is true, PutEvaluations doesn't require a valid value for the ResultToken parameter, but the value cannot be null. 
     */
    TestMode?: Boolean;
  }
  export interface PutEvaluationsResponse {
    /**
     * Requests that failed because of a client or server error.
     */
    FailedEvaluations?: Evaluations;
  }
  export interface PutExternalEvaluationRequest {
    /**
     * The name of the Config rule.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * An ExternalEvaluation object that provides details about compliance.
     */
    ExternalEvaluation: ExternalEvaluation;
  }
  export interface PutExternalEvaluationResponse {
  }
  export interface PutOrganizationConfigRuleRequest {
    /**
     * The name that you assign to an organization config rule.
     */
    OrganizationConfigRuleName: OrganizationConfigRuleName;
    /**
     * An OrganizationManagedRuleMetadata object. 
     */
    OrganizationManagedRuleMetadata?: OrganizationManagedRuleMetadata;
    /**
     * An OrganizationCustomRuleMetadata object.
     */
    OrganizationCustomRuleMetadata?: OrganizationCustomRuleMetadata;
    /**
     * A comma-separated list of accounts that you want to exclude from an organization config rule.
     */
    ExcludedAccounts?: ExcludedAccounts;
  }
  export interface PutOrganizationConfigRuleResponse {
    /**
     * The Amazon Resource Name (ARN) of an organization config rule.
     */
    OrganizationConfigRuleArn?: StringWithCharLimit256;
  }
  export interface PutOrganizationConformancePackRequest {
    /**
     * Name of the organization conformance pack you want to create.
     */
    OrganizationConformancePackName: OrganizationConformancePackName;
    /**
     * Location of file containing the template body. The uri must point to the conformance pack template (max size: 300 KB).  You must have access to read Amazon S3 bucket. 
     */
    TemplateS3Uri?: TemplateS3Uri;
    /**
     * A string containing full conformance pack template body. Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.
     */
    TemplateBody?: TemplateBody;
    /**
     * The name of the Amazon S3 bucket where Config stores conformance pack templates.  This field is optional. If used, it must be prefixed with awsconfigconforms. 
     */
    DeliveryS3Bucket?: DeliveryS3Bucket;
    /**
     * The prefix for the Amazon S3 bucket.  This field is optional. 
     */
    DeliveryS3KeyPrefix?: DeliveryS3KeyPrefix;
    /**
     * A list of ConformancePackInputParameter objects.
     */
    ConformancePackInputParameters?: ConformancePackInputParameters;
    /**
     * A list of Amazon Web Services accounts to be excluded from an organization conformance pack while deploying a conformance pack.
     */
    ExcludedAccounts?: ExcludedAccounts;
  }
  export interface PutOrganizationConformancePackResponse {
    /**
     * ARN of the organization conformance pack.
     */
    OrganizationConformancePackArn?: StringWithCharLimit256;
  }
  export interface PutRemediationConfigurationsRequest {
    /**
     * A list of remediation configuration objects.
     */
    RemediationConfigurations: RemediationConfigurations;
  }
  export interface PutRemediationConfigurationsResponse {
    /**
     * Returns a list of failed remediation batch objects.
     */
    FailedBatches?: FailedRemediationBatches;
  }
  export interface PutRemediationExceptionsRequest {
    /**
     * The name of the Config rule for which you want to create remediation exception.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * An exception list of resource exception keys to be processed with the current request. Config adds exception for each resource key. For example, Config adds 3 exceptions for 3 resource keys. 
     */
    ResourceKeys: RemediationExceptionResourceKeys;
    /**
     * The message contains an explanation of the exception.
     */
    Message?: StringWithCharLimit1024;
    /**
     * The exception is automatically deleted after the expiration date.
     */
    ExpirationTime?: _Date;
  }
  export interface PutRemediationExceptionsResponse {
    /**
     * Returns a list of failed remediation exceptions batch objects. Each object in the batch consists of a list of failed items and failure messages.
     */
    FailedBatches?: FailedRemediationExceptionBatches;
  }
  export interface PutResourceConfigRequest {
    /**
     * The type of the resource. The custom resource type must be registered with CloudFormation.   You cannot use the organization names “amzn”, “amazon”, “alexa”, “custom” with custom resource types. It is the first part of the ResourceType up to the first ::. 
     */
    ResourceType: ResourceTypeString;
    /**
     * Version of the schema registered for the ResourceType in CloudFormation.
     */
    SchemaVersionId: SchemaVersionId;
    /**
     * Unique identifier of the resource.
     */
    ResourceId: ResourceId;
    /**
     * Name of the resource.
     */
    ResourceName?: ResourceName;
    /**
     * The configuration object of the resource in valid JSON format. It must match the schema registered with CloudFormation.  The configuration JSON must not exceed 64 KB. 
     */
    Configuration: Configuration;
    /**
     * Tags associated with the resource.
     */
    Tags?: Tags;
  }
  export interface PutRetentionConfigurationRequest {
    /**
     * Number of days Config stores your historical information.  Currently, only applicable to the configuration item history. 
     */
    RetentionPeriodInDays: RetentionPeriodInDays;
  }
  export interface PutRetentionConfigurationResponse {
    /**
     * Returns a retention configuration object.
     */
    RetentionConfiguration?: RetentionConfiguration;
  }
  export interface PutStoredQueryRequest {
    /**
     * A list of StoredQuery objects. The mandatory fields are QueryName and Expression.  When you are creating a query, you must provide a query name and an expression. When you are updating a query, you must provide a query name but updating the description is optional. 
     */
    StoredQuery: StoredQuery;
    /**
     * A list of Tags object.
     */
    Tags?: TagsList;
  }
  export interface PutStoredQueryResponse {
    /**
     * Amazon Resource Name (ARN) of the query. For example, arn:partition:service:region:account-id:resource-type/resource-name/resource-id.
     */
    QueryArn?: QueryArn;
  }
  export type QueryArn = string;
  export type QueryDescription = string;
  export type QueryExpression = string;
  export type QueryId = string;
  export interface QueryInfo {
    /**
     * Returns a FieldInfo object.
     */
    SelectFields?: FieldInfoList;
  }
  export type QueryName = string;
  export type RecorderName = string;
  export type RecorderStatus = "Pending"|"Success"|"Failure"|string;
  export interface RecordingGroup {
    /**
     * Specifies whether Config records configuration changes for every supported type of regional resource. If you set this option to true, when Config adds support for a new type of regional resource, it starts recording resources of that type automatically. If you set this option to true, you cannot enumerate a list of resourceTypes.
     */
    allSupported?: AllSupported;
    /**
     * Specifies whether Config includes all supported types of global resources (for example, IAM resources) with the resources that it records. Before you can set this option to true, you must set the allSupported option to true. If you set this option to true, when Config adds support for a new type of global resource, it starts recording resources of that type automatically. The configuration details for any global resource are the same in all regions. To prevent duplicate configuration items, you should consider customizing Config in only one region to record global resources.
     */
    includeGlobalResourceTypes?: IncludeGlobalResourceTypes;
    /**
     * A comma-separated list that specifies the types of Amazon Web Services resources for which Config records configuration changes (for example, AWS::EC2::Instance or AWS::CloudTrail::Trail). To record all configuration changes, you must set the allSupported option to true. If you set this option to false, when Config adds support for a new type of resource, it will not record resources of that type unless you manually add that type to your recording group. For a list of valid resourceTypes values, see the resourceType Value column in Supported Amazon Web Services resource Types.
     */
    resourceTypes?: ResourceTypeList;
  }
  export type ReevaluateConfigRuleNames = ConfigRuleName[];
  export type RelatedEvent = string;
  export type RelatedEventList = RelatedEvent[];
  export interface Relationship {
    /**
     * The resource type of the related resource.
     */
    resourceType?: ResourceType;
    /**
     * The ID of the related resource (for example, sg-xxxxxx).
     */
    resourceId?: ResourceId;
    /**
     * The custom name of the related resource, if available.
     */
    resourceName?: ResourceName;
    /**
     * The type of relationship with the related resource.
     */
    relationshipName?: RelationshipName;
  }
  export type RelationshipList = Relationship[];
  export type RelationshipName = string;
  export interface RemediationConfiguration {
    /**
     * The name of the Config rule.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * The type of the target. Target executes remediation. For example, SSM document.
     */
    TargetType: RemediationTargetType;
    /**
     * Target ID is the name of the public document.
     */
    TargetId: StringWithCharLimit256;
    /**
     * Version of the target. For example, version of the SSM document.  If you make backward incompatible changes to the SSM document, you must call PutRemediationConfiguration API again to ensure the remediations can run. 
     */
    TargetVersion?: String;
    /**
     * An object of the RemediationParameterValue.
     */
    Parameters?: RemediationParameters;
    /**
     * The type of a resource. 
     */
    ResourceType?: String;
    /**
     * The remediation is triggered automatically.
     */
    Automatic?: Boolean;
    /**
     * An ExecutionControls object.
     */
    ExecutionControls?: ExecutionControls;
    /**
     * The maximum number of failed attempts for auto-remediation. If you do not select a number, the default is 5. For example, if you specify MaximumAutomaticAttempts as 5 with RetryAttemptSeconds as 50 seconds, Config will put a RemediationException on your behalf for the failing resource after the 5th failed attempt within 50 seconds.
     */
    MaximumAutomaticAttempts?: AutoRemediationAttempts;
    /**
     * Maximum time in seconds that Config runs auto-remediation. If you do not select a number, the default is 60 seconds.  For example, if you specify RetryAttemptSeconds as 50 seconds and MaximumAutomaticAttempts as 5, Config will run auto-remediations 5 times within 50 seconds before throwing an exception.
     */
    RetryAttemptSeconds?: AutoRemediationAttemptSeconds;
    /**
     * Amazon Resource Name (ARN) of remediation configuration.
     */
    Arn?: StringWithCharLimit1024;
    /**
     * Name of the service that owns the service linked rule, if applicable.
     */
    CreatedByService?: StringWithCharLimit1024;
  }
  export type RemediationConfigurations = RemediationConfiguration[];
  export interface RemediationException {
    /**
     * The name of the Config rule.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * The type of a resource.
     */
    ResourceType: StringWithCharLimit256;
    /**
     * The ID of the resource (for example., sg-xxxxxx).
     */
    ResourceId: StringWithCharLimit1024;
    /**
     * An explanation of an remediation exception.
     */
    Message?: StringWithCharLimit1024;
    /**
     * The time when the remediation exception will be deleted.
     */
    ExpirationTime?: _Date;
  }
  export interface RemediationExceptionResourceKey {
    /**
     * The type of a resource.
     */
    ResourceType?: StringWithCharLimit256;
    /**
     * The ID of the resource (for example., sg-xxxxxx).
     */
    ResourceId?: StringWithCharLimit1024;
  }
  export type RemediationExceptionResourceKeys = RemediationExceptionResourceKey[];
  export type RemediationExceptions = RemediationException[];
  export type RemediationExecutionState = "QUEUED"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export interface RemediationExecutionStatus {
    ResourceKey?: ResourceKey;
    /**
     * ENUM of the values.
     */
    State?: RemediationExecutionState;
    /**
     * Details of every step.
     */
    StepDetails?: RemediationExecutionSteps;
    /**
     * Start time when the remediation was executed.
     */
    InvocationTime?: _Date;
    /**
     * The time when the remediation execution was last updated.
     */
    LastUpdatedTime?: _Date;
  }
  export type RemediationExecutionStatuses = RemediationExecutionStatus[];
  export interface RemediationExecutionStep {
    /**
     * The details of the step.
     */
    Name?: String;
    /**
     * The valid status of the step.
     */
    State?: RemediationExecutionStepState;
    /**
     * An error message if the step was interrupted during execution.
     */
    ErrorMessage?: String;
    /**
     * The time when the step started.
     */
    StartTime?: _Date;
    /**
     * The time when the step stopped.
     */
    StopTime?: _Date;
  }
  export type RemediationExecutionStepState = "SUCCEEDED"|"PENDING"|"FAILED"|string;
  export type RemediationExecutionSteps = RemediationExecutionStep[];
  export interface RemediationParameterValue {
    /**
     * The value is dynamic and changes at run-time.
     */
    ResourceValue?: ResourceValue;
    /**
     * The value is static and does not change at run-time.
     */
    StaticValue?: StaticValue;
  }
  export type RemediationParameters = {[key: string]: RemediationParameterValue};
  export type RemediationTargetType = "SSM_DOCUMENT"|string;
  export interface ResourceCount {
    /**
     * The resource type (for example, "AWS::EC2::Instance").
     */
    resourceType?: ResourceType;
    /**
     * The number of resources.
     */
    count?: Long;
  }
  export interface ResourceCountFilters {
    /**
     * The type of the Amazon Web Services resource.
     */
    ResourceType?: ResourceType;
    /**
     * The 12-digit ID of the account.
     */
    AccountId?: AccountId;
    /**
     * The region where the account is located.
     */
    Region?: AwsRegion;
  }
  export type ResourceCountGroupKey = "RESOURCE_TYPE"|"ACCOUNT_ID"|"AWS_REGION"|string;
  export type ResourceCounts = ResourceCount[];
  export type ResourceCreationTime = Date;
  export type ResourceDeletionTime = Date;
  export interface ResourceFilters {
    /**
     * The 12-digit source account ID.
     */
    AccountId?: AccountId;
    /**
     * The ID of the resource.
     */
    ResourceId?: ResourceId;
    /**
     * The name of the resource.
     */
    ResourceName?: ResourceName;
    /**
     * The source region.
     */
    Region?: AwsRegion;
  }
  export type ResourceId = string;
  export type ResourceIdList = ResourceId[];
  export interface ResourceIdentifier {
    /**
     * The type of resource.
     */
    resourceType?: ResourceType;
    /**
     * The ID of the resource (for example, sg-xxxxxx).
     */
    resourceId?: ResourceId;
    /**
     * The custom name of the resource (if available).
     */
    resourceName?: ResourceName;
    /**
     * The time that the resource was deleted.
     */
    resourceDeletionTime?: ResourceDeletionTime;
  }
  export type ResourceIdentifierList = ResourceIdentifier[];
  export type ResourceIdentifiersList = AggregateResourceIdentifier[];
  export interface ResourceKey {
    /**
     * The resource type.
     */
    resourceType: ResourceType;
    /**
     * The ID of the resource (for example., sg-xxxxxx). 
     */
    resourceId: ResourceId;
  }
  export type ResourceKeys = ResourceKey[];
  export type ResourceName = string;
  export type ResourceType = "AWS::EC2::CustomerGateway"|"AWS::EC2::EIP"|"AWS::EC2::Host"|"AWS::EC2::Instance"|"AWS::EC2::InternetGateway"|"AWS::EC2::NetworkAcl"|"AWS::EC2::NetworkInterface"|"AWS::EC2::RouteTable"|"AWS::EC2::SecurityGroup"|"AWS::EC2::Subnet"|"AWS::CloudTrail::Trail"|"AWS::EC2::Volume"|"AWS::EC2::VPC"|"AWS::EC2::VPNConnection"|"AWS::EC2::VPNGateway"|"AWS::EC2::RegisteredHAInstance"|"AWS::EC2::NatGateway"|"AWS::EC2::EgressOnlyInternetGateway"|"AWS::EC2::VPCEndpoint"|"AWS::EC2::VPCEndpointService"|"AWS::EC2::FlowLog"|"AWS::EC2::VPCPeeringConnection"|"AWS::Elasticsearch::Domain"|"AWS::IAM::Group"|"AWS::IAM::Policy"|"AWS::IAM::Role"|"AWS::IAM::User"|"AWS::ElasticLoadBalancingV2::LoadBalancer"|"AWS::ACM::Certificate"|"AWS::RDS::DBInstance"|"AWS::RDS::DBSubnetGroup"|"AWS::RDS::DBSecurityGroup"|"AWS::RDS::DBSnapshot"|"AWS::RDS::DBCluster"|"AWS::RDS::DBClusterSnapshot"|"AWS::RDS::EventSubscription"|"AWS::S3::Bucket"|"AWS::S3::AccountPublicAccessBlock"|"AWS::Redshift::Cluster"|"AWS::Redshift::ClusterSnapshot"|"AWS::Redshift::ClusterParameterGroup"|"AWS::Redshift::ClusterSecurityGroup"|"AWS::Redshift::ClusterSubnetGroup"|"AWS::Redshift::EventSubscription"|"AWS::SSM::ManagedInstanceInventory"|"AWS::CloudWatch::Alarm"|"AWS::CloudFormation::Stack"|"AWS::ElasticLoadBalancing::LoadBalancer"|"AWS::AutoScaling::AutoScalingGroup"|"AWS::AutoScaling::LaunchConfiguration"|"AWS::AutoScaling::ScalingPolicy"|"AWS::AutoScaling::ScheduledAction"|"AWS::DynamoDB::Table"|"AWS::CodeBuild::Project"|"AWS::WAF::RateBasedRule"|"AWS::WAF::Rule"|"AWS::WAF::RuleGroup"|"AWS::WAF::WebACL"|"AWS::WAFRegional::RateBasedRule"|"AWS::WAFRegional::Rule"|"AWS::WAFRegional::RuleGroup"|"AWS::WAFRegional::WebACL"|"AWS::CloudFront::Distribution"|"AWS::CloudFront::StreamingDistribution"|"AWS::Lambda::Function"|"AWS::NetworkFirewall::Firewall"|"AWS::NetworkFirewall::FirewallPolicy"|"AWS::NetworkFirewall::RuleGroup"|"AWS::ElasticBeanstalk::Application"|"AWS::ElasticBeanstalk::ApplicationVersion"|"AWS::ElasticBeanstalk::Environment"|"AWS::WAFv2::WebACL"|"AWS::WAFv2::RuleGroup"|"AWS::WAFv2::IPSet"|"AWS::WAFv2::RegexPatternSet"|"AWS::WAFv2::ManagedRuleSet"|"AWS::XRay::EncryptionConfig"|"AWS::SSM::AssociationCompliance"|"AWS::SSM::PatchCompliance"|"AWS::Shield::Protection"|"AWS::ShieldRegional::Protection"|"AWS::Config::ConformancePackCompliance"|"AWS::Config::ResourceCompliance"|"AWS::ApiGateway::Stage"|"AWS::ApiGateway::RestApi"|"AWS::ApiGatewayV2::Stage"|"AWS::ApiGatewayV2::Api"|"AWS::CodePipeline::Pipeline"|"AWS::ServiceCatalog::CloudFormationProvisionedProduct"|"AWS::ServiceCatalog::CloudFormationProduct"|"AWS::ServiceCatalog::Portfolio"|"AWS::SQS::Queue"|"AWS::KMS::Key"|"AWS::QLDB::Ledger"|"AWS::SecretsManager::Secret"|"AWS::SNS::Topic"|"AWS::SSM::FileData"|"AWS::Backup::BackupPlan"|"AWS::Backup::BackupSelection"|"AWS::Backup::BackupVault"|"AWS::Backup::RecoveryPoint"|"AWS::ECR::Repository"|"AWS::ECS::Cluster"|"AWS::ECS::Service"|"AWS::ECS::TaskDefinition"|"AWS::EFS::AccessPoint"|"AWS::EFS::FileSystem"|"AWS::EKS::Cluster"|"AWS::OpenSearch::Domain"|string;
  export type ResourceTypeList = ResourceType[];
  export type ResourceTypeString = string;
  export type ResourceTypes = StringWithCharLimit256[];
  export type ResourceTypesScope = StringWithCharLimit256[];
  export interface ResourceValue {
    /**
     * The value is a resource ID.
     */
    Value: ResourceValueType;
  }
  export type ResourceValueType = "RESOURCE_ID"|string;
  export type Results = String[];
  export interface RetentionConfiguration {
    /**
     * The name of the retention configuration object.
     */
    Name: RetentionConfigurationName;
    /**
     * Number of days Config stores your historical information.  Currently, only applicable to the configuration item history. 
     */
    RetentionPeriodInDays: RetentionPeriodInDays;
  }
  export type RetentionConfigurationList = RetentionConfiguration[];
  export type RetentionConfigurationName = string;
  export type RetentionConfigurationNameList = RetentionConfigurationName[];
  export type RetentionPeriodInDays = number;
  export type RuleLimit = number;
  export type SchemaVersionId = string;
  export interface Scope {
    /**
     * The resource types of only those Amazon Web Services resources that you want to trigger an evaluation for the rule. You can only specify one type if you also specify a resource ID for ComplianceResourceId.
     */
    ComplianceResourceTypes?: ComplianceResourceTypes;
    /**
     * The tag key that is applied to only those Amazon Web Services resources that you want to trigger an evaluation for the rule.
     */
    TagKey?: StringWithCharLimit128;
    /**
     * The tag value applied to only those Amazon Web Services resources that you want to trigger an evaluation for the rule. If you specify a value for TagValue, you must also specify a value for TagKey.
     */
    TagValue?: StringWithCharLimit256;
    /**
     * The ID of the only Amazon Web Services resource that you want to trigger an evaluation for the rule. If you specify a resource ID, you must specify one resource type for ComplianceResourceTypes.
     */
    ComplianceResourceId?: BaseResourceId;
  }
  export interface SelectAggregateResourceConfigRequest {
    /**
     * The SQL query SELECT command. 
     */
    Expression: Expression;
    /**
     * The name of the configuration aggregator.
     */
    ConfigurationAggregatorName: ConfigurationAggregatorName;
    /**
     * The maximum number of query results returned on each page. 
     */
    Limit?: Limit;
    /**
     * The maximum number of query results returned on each page. Config also allows the Limit request parameter.
     */
    MaxResults?: Limit;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export interface SelectAggregateResourceConfigResponse {
    /**
     * Returns the results for the SQL query.
     */
    Results?: Results;
    QueryInfo?: QueryInfo;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export interface SelectResourceConfigRequest {
    /**
     * The SQL query SELECT command.
     */
    Expression: Expression;
    /**
     * The maximum number of query results returned on each page. 
     */
    Limit?: Limit;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export interface SelectResourceConfigResponse {
    /**
     * Returns the results for the SQL query.
     */
    Results?: Results;
    /**
     * Returns the QueryInfo object.
     */
    QueryInfo?: QueryInfo;
    /**
     * The nextToken string returned in a previous request that you use to request the next page of results in a paginated response. 
     */
    NextToken?: NextToken;
  }
  export interface Source {
    /**
     * Indicates whether Amazon Web Services or the customer owns and manages the Config rule.
     */
    Owner: Owner;
    /**
     * For Config managed rules, a predefined identifier from a list. For example, IAM_PASSWORD_POLICY is a managed rule. To reference a managed rule, see Using Config managed rules. For custom rules, the identifier is the Amazon Resource Name (ARN) of the rule's Lambda function, such as arn:aws:lambda:us-east-2:123456789012:function:custom_rule_name.
     */
    SourceIdentifier: StringWithCharLimit256;
    /**
     * Provides the source and type of the event that causes Config to evaluate your Amazon Web Services resources.
     */
    SourceDetails?: SourceDetails;
  }
  export interface SourceDetail {
    /**
     * The source of the event, such as an Amazon Web Services service, that triggers Config to evaluate your Amazon Web Services resources.
     */
    EventSource?: EventSource;
    /**
     * The type of notification that triggers Config to run an evaluation for a rule. You can specify the following notification types:    ConfigurationItemChangeNotification - Triggers an evaluation when Config delivers a configuration item as a result of a resource change.    OversizedConfigurationItemChangeNotification - Triggers an evaluation when Config delivers an oversized configuration item. Config may generate this notification type when a resource changes and the notification exceeds the maximum size allowed by Amazon SNS.    ScheduledNotification - Triggers a periodic evaluation at the frequency specified for MaximumExecutionFrequency.    ConfigurationSnapshotDeliveryCompleted - Triggers a periodic evaluation when Config delivers a configuration snapshot.   If you want your custom rule to be triggered by configuration changes, specify two SourceDetail objects, one for ConfigurationItemChangeNotification and one for OversizedConfigurationItemChangeNotification.
     */
    MessageType?: MessageType;
    /**
     * The frequency at which you want Config to run evaluations for a custom rule with a periodic trigger. If you specify a value for MaximumExecutionFrequency, then MessageType must use the ScheduledNotification value.  By default, rules with a periodic trigger are evaluated every 24 hours. To change the frequency, specify a valid value for the MaximumExecutionFrequency parameter. Based on the valid value you choose, Config runs evaluations once for each valid value. For example, if you choose Three_Hours, Config runs evaluations once every three hours. In this case, Three_Hours is the frequency of this rule.  
     */
    MaximumExecutionFrequency?: MaximumExecutionFrequency;
  }
  export type SourceDetails = SourceDetail[];
  export interface SsmControls {
    /**
     * The maximum percentage of remediation actions allowed to run in parallel on the non-compliant resources for that specific rule. You can specify a percentage, such as 10%. The default value is 10. 
     */
    ConcurrentExecutionRatePercentage?: Percentage;
    /**
     * The percentage of errors that are allowed before SSM stops running automations on non-compliant resources for that specific rule. You can specify a percentage of errors, for example 10%. If you do not specifiy a percentage, the default is 50%. For example, if you set the ErrorPercentage to 40% for 10 non-compliant resources, then SSM stops running the automations when the fifth error is received. 
     */
    ErrorPercentage?: Percentage;
  }
  export type StackArn = string;
  export interface StartConfigRulesEvaluationRequest {
    /**
     * The list of names of Config rules that you want to run evaluations for.
     */
    ConfigRuleNames?: ReevaluateConfigRuleNames;
  }
  export interface StartConfigRulesEvaluationResponse {
  }
  export interface StartConfigurationRecorderRequest {
    /**
     * The name of the recorder object that records each configuration change made to the resources.
     */
    ConfigurationRecorderName: RecorderName;
  }
  export interface StartRemediationExecutionRequest {
    /**
     * The list of names of Config rules that you want to run remediation execution for.
     */
    ConfigRuleName: ConfigRuleName;
    /**
     * A list of resource keys to be processed with the current request. Each element in the list consists of the resource type and resource ID. 
     */
    ResourceKeys: ResourceKeys;
  }
  export interface StartRemediationExecutionResponse {
    /**
     * Returns a failure message. For example, the resource is already compliant.
     */
    FailureMessage?: String;
    /**
     * For resources that have failed to start execution, the API returns a resource key object.
     */
    FailedItems?: ResourceKeys;
  }
  export type StaticParameterValues = StringWithCharLimit256[];
  export interface StaticValue {
    /**
     * A list of values. For example, the ARN of the assumed role. 
     */
    Values: StaticParameterValues;
  }
  export interface StatusDetailFilters {
    /**
     * The 12-digit account ID of the member account within an organization.
     */
    AccountId?: AccountId;
    /**
     * Indicates deployment status for config rule in the member account. When master account calls PutOrganizationConfigRule action for the first time, config rule status is created in the member account. When master account calls PutOrganizationConfigRule action for the second time, config rule status is updated in the member account. Config rule status is deleted when the master account deletes OrganizationConfigRule and disables service access for config-multiaccountsetup.amazonaws.com.  Config sets the state of the rule to:    CREATE_SUCCESSFUL when config rule has been created in the member account.    CREATE_IN_PROGRESS when config rule is being created in the member account.    CREATE_FAILED when config rule creation has failed in the member account.    DELETE_FAILED when config rule deletion has failed in the member account.    DELETE_IN_PROGRESS when config rule is being deleted in the member account.    DELETE_SUCCESSFUL when config rule has been deleted in the member account.    UPDATE_SUCCESSFUL when config rule has been updated in the member account.    UPDATE_IN_PROGRESS when config rule is being updated in the member account.    UPDATE_FAILED when config rule deletion has failed in the member account.  
     */
    MemberAccountRuleStatus?: MemberAccountRuleStatus;
  }
  export interface StopConfigurationRecorderRequest {
    /**
     * The name of the recorder object that records each configuration change made to the resources.
     */
    ConfigurationRecorderName: RecorderName;
  }
  export interface StoredQuery {
    /**
     * The ID of the query.
     */
    QueryId?: QueryId;
    /**
     * Amazon Resource Name (ARN) of the query. For example, arn:partition:service:region:account-id:resource-type/resource-name/resource-id.
     */
    QueryArn?: QueryArn;
    /**
     * The name of the query.
     */
    QueryName: QueryName;
    /**
     * A unique description for the query.
     */
    Description?: QueryDescription;
    /**
     * The expression of the query. For example, SELECT resourceId, resourceType, supplementaryConfiguration.BucketVersioningConfiguration.status WHERE resourceType = 'AWS::S3::Bucket' AND supplementaryConfiguration.BucketVersioningConfiguration.status = 'Off'. 
     */
    Expression?: QueryExpression;
  }
  export interface StoredQueryMetadata {
    /**
     * The ID of the query. 
     */
    QueryId: QueryId;
    /**
     * Amazon Resource Name (ARN) of the query. For example, arn:partition:service:region:account-id:resource-type/resource-name/resource-id.
     */
    QueryArn: QueryArn;
    /**
     * The name of the query.
     */
    QueryName: QueryName;
    /**
     * A unique description for the query.
     */
    Description?: QueryDescription;
  }
  export type StoredQueryMetadataList = StoredQueryMetadata[];
  export type String = string;
  export type StringWithCharLimit1024 = string;
  export type StringWithCharLimit128 = string;
  export type StringWithCharLimit2048 = string;
  export type StringWithCharLimit256 = string;
  export type StringWithCharLimit256Min0 = string;
  export type StringWithCharLimit64 = string;
  export type StringWithCharLimit768 = string;
  export type SupplementaryConfiguration = {[key: string]: SupplementaryConfigurationValue};
  export type SupplementaryConfigurationName = string;
  export type SupplementaryConfigurationValue = string;
  export interface Tag {
    /**
     * One part of a key-value pair that make up a tag. A key is a general label that acts like a category for more specific tag values.
     */
    Key?: TagKey;
    /**
     * The optional part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key).
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. Currently, the supported resources are ConfigRule, ConfigurationAggregator and AggregatorAuthorization.
     */
    ResourceArn: AmazonResourceName;
    /**
     * An array of tag object.
     */
    Tags: TagList;
  }
  export type TagValue = string;
  export type Tags = {[key: string]: Value};
  export type TagsList = Tag[];
  export type TemplateBody = string;
  export type TemplateS3Uri = string;
  export type UnprocessedResourceIdentifierList = AggregateResourceIdentifier[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. Currently, the supported resources are ConfigRule, ConfigurationAggregator and AggregatorAuthorization.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The keys of the tags to be removed.
     */
    TagKeys: TagKeyList;
  }
  export type Value = string;
  export type Version = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2014-11-12"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ConfigService client.
   */
  export import Types = ConfigService;
}
export = ConfigService;
