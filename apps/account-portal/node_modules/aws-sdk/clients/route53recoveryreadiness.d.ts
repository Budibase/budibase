import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Route53RecoveryReadiness extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Route53RecoveryReadiness.Types.ClientConfiguration)
  config: Config & Route53RecoveryReadiness.Types.ClientConfiguration;
  /**
   * Creates a new Cell.
   */
  createCell(params: Route53RecoveryReadiness.Types.CreateCellRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateCellResponse) => void): Request<Route53RecoveryReadiness.Types.CreateCellResponse, AWSError>;
  /**
   * Creates a new Cell.
   */
  createCell(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateCellResponse) => void): Request<Route53RecoveryReadiness.Types.CreateCellResponse, AWSError>;
  /**
   * Create a new cross account readiness authorization.
   */
  createCrossAccountAuthorization(params: Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationResponse) => void): Request<Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationResponse, AWSError>;
  /**
   * Create a new cross account readiness authorization.
   */
  createCrossAccountAuthorization(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationResponse) => void): Request<Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationResponse, AWSError>;
  /**
   * Creates a new Readiness Check.
   */
  createReadinessCheck(params: Route53RecoveryReadiness.Types.CreateReadinessCheckRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.CreateReadinessCheckResponse, AWSError>;
  /**
   * Creates a new Readiness Check.
   */
  createReadinessCheck(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.CreateReadinessCheckResponse, AWSError>;
  /**
   * Creates a new Recovery Group.
   */
  createRecoveryGroup(params: Route53RecoveryReadiness.Types.CreateRecoveryGroupRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.CreateRecoveryGroupResponse, AWSError>;
  /**
   * Creates a new Recovery Group.
   */
  createRecoveryGroup(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.CreateRecoveryGroupResponse, AWSError>;
  /**
   * Creates a new Resource Set.
   */
  createResourceSet(params: Route53RecoveryReadiness.Types.CreateResourceSetRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.CreateResourceSetResponse, AWSError>;
  /**
   * Creates a new Resource Set.
   */
  createResourceSet(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.CreateResourceSetResponse, AWSError>;
  /**
   * Deletes an existing Cell.
   */
  deleteCell(params: Route53RecoveryReadiness.Types.DeleteCellRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing Cell.
   */
  deleteCell(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete cross account readiness authorization
   */
  deleteCrossAccountAuthorization(params: Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationResponse) => void): Request<Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationResponse, AWSError>;
  /**
   * Delete cross account readiness authorization
   */
  deleteCrossAccountAuthorization(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationResponse) => void): Request<Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationResponse, AWSError>;
  /**
   * Deletes an existing Readiness Check.
   */
  deleteReadinessCheck(params: Route53RecoveryReadiness.Types.DeleteReadinessCheckRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing Readiness Check.
   */
  deleteReadinessCheck(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing Recovery Group.
   */
  deleteRecoveryGroup(params: Route53RecoveryReadiness.Types.DeleteRecoveryGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing Recovery Group.
   */
  deleteRecoveryGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing Resource Set.
   */
  deleteResourceSet(params: Route53RecoveryReadiness.Types.DeleteResourceSetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing Resource Set.
   */
  deleteResourceSet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns a collection of recommendations to improve resilliance and readiness check quality for a Recovery Group.
   */
  getArchitectureRecommendations(params: Route53RecoveryReadiness.Types.GetArchitectureRecommendationsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetArchitectureRecommendationsResponse) => void): Request<Route53RecoveryReadiness.Types.GetArchitectureRecommendationsResponse, AWSError>;
  /**
   * Returns a collection of recommendations to improve resilliance and readiness check quality for a Recovery Group.
   */
  getArchitectureRecommendations(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetArchitectureRecommendationsResponse) => void): Request<Route53RecoveryReadiness.Types.GetArchitectureRecommendationsResponse, AWSError>;
  /**
   * Returns information about a Cell.
   */
  getCell(params: Route53RecoveryReadiness.Types.GetCellRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetCellResponse) => void): Request<Route53RecoveryReadiness.Types.GetCellResponse, AWSError>;
  /**
   * Returns information about a Cell.
   */
  getCell(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetCellResponse) => void): Request<Route53RecoveryReadiness.Types.GetCellResponse, AWSError>;
  /**
   * Returns information about readiness of a Cell.
   */
  getCellReadinessSummary(params: Route53RecoveryReadiness.Types.GetCellReadinessSummaryRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetCellReadinessSummaryResponse) => void): Request<Route53RecoveryReadiness.Types.GetCellReadinessSummaryResponse, AWSError>;
  /**
   * Returns information about readiness of a Cell.
   */
  getCellReadinessSummary(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetCellReadinessSummaryResponse) => void): Request<Route53RecoveryReadiness.Types.GetCellReadinessSummaryResponse, AWSError>;
  /**
   * Returns information about a ReadinessCheck.
   */
  getReadinessCheck(params: Route53RecoveryReadiness.Types.GetReadinessCheckRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckResponse, AWSError>;
  /**
   * Returns information about a ReadinessCheck.
   */
  getReadinessCheck(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckResponse, AWSError>;
  /**
   * Returns detailed information about the status of an individual resource within a Readiness Check's Resource Set.
   */
  getReadinessCheckResourceStatus(params: Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusResponse, AWSError>;
  /**
   * Returns detailed information about the status of an individual resource within a Readiness Check's Resource Set.
   */
  getReadinessCheckResourceStatus(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusResponse, AWSError>;
  /**
   * Returns information about the status of a Readiness Check.
   */
  getReadinessCheckStatus(params: Route53RecoveryReadiness.Types.GetReadinessCheckStatusRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckStatusResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckStatusResponse, AWSError>;
  /**
   * Returns information about the status of a Readiness Check.
   */
  getReadinessCheckStatus(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckStatusResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckStatusResponse, AWSError>;
  /**
   * Returns information about a Recovery Group.
   */
  getRecoveryGroup(params: Route53RecoveryReadiness.Types.GetRecoveryGroupRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.GetRecoveryGroupResponse, AWSError>;
  /**
   * Returns information about a Recovery Group.
   */
  getRecoveryGroup(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.GetRecoveryGroupResponse, AWSError>;
  /**
   * Returns information about a Recovery Group.
   */
  getRecoveryGroupReadinessSummary(params: Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryResponse) => void): Request<Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryResponse, AWSError>;
  /**
   * Returns information about a Recovery Group.
   */
  getRecoveryGroupReadinessSummary(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryResponse) => void): Request<Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryResponse, AWSError>;
  /**
   * Returns information about a Resource Set.
   */
  getResourceSet(params: Route53RecoveryReadiness.Types.GetResourceSetRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.GetResourceSetResponse, AWSError>;
  /**
   * Returns information about a Resource Set.
   */
  getResourceSet(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.GetResourceSetResponse, AWSError>;
  /**
   * Returns a collection of Cells.
   */
  listCells(params: Route53RecoveryReadiness.Types.ListCellsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListCellsResponse) => void): Request<Route53RecoveryReadiness.Types.ListCellsResponse, AWSError>;
  /**
   * Returns a collection of Cells.
   */
  listCells(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListCellsResponse) => void): Request<Route53RecoveryReadiness.Types.ListCellsResponse, AWSError>;
  /**
   * Returns a collection of cross account readiness authorizations.
   */
  listCrossAccountAuthorizations(params: Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsResponse) => void): Request<Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsResponse, AWSError>;
  /**
   * Returns a collection of cross account readiness authorizations.
   */
  listCrossAccountAuthorizations(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsResponse) => void): Request<Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsResponse, AWSError>;
  /**
   * Returns a collection of Readiness Checks.
   */
  listReadinessChecks(params: Route53RecoveryReadiness.Types.ListReadinessChecksRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListReadinessChecksResponse) => void): Request<Route53RecoveryReadiness.Types.ListReadinessChecksResponse, AWSError>;
  /**
   * Returns a collection of Readiness Checks.
   */
  listReadinessChecks(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListReadinessChecksResponse) => void): Request<Route53RecoveryReadiness.Types.ListReadinessChecksResponse, AWSError>;
  /**
   * Returns a collection of Recovery Groups.
   */
  listRecoveryGroups(params: Route53RecoveryReadiness.Types.ListRecoveryGroupsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListRecoveryGroupsResponse) => void): Request<Route53RecoveryReadiness.Types.ListRecoveryGroupsResponse, AWSError>;
  /**
   * Returns a collection of Recovery Groups.
   */
  listRecoveryGroups(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListRecoveryGroupsResponse) => void): Request<Route53RecoveryReadiness.Types.ListRecoveryGroupsResponse, AWSError>;
  /**
   * Returns a collection of Resource Sets.
   */
  listResourceSets(params: Route53RecoveryReadiness.Types.ListResourceSetsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListResourceSetsResponse) => void): Request<Route53RecoveryReadiness.Types.ListResourceSetsResponse, AWSError>;
  /**
   * Returns a collection of Resource Sets.
   */
  listResourceSets(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListResourceSetsResponse) => void): Request<Route53RecoveryReadiness.Types.ListResourceSetsResponse, AWSError>;
  /**
   * Returns a collection of rules that are applied as part of Readiness Checks.
   */
  listRules(params: Route53RecoveryReadiness.Types.ListRulesRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListRulesResponse) => void): Request<Route53RecoveryReadiness.Types.ListRulesResponse, AWSError>;
  /**
   * Returns a collection of rules that are applied as part of Readiness Checks.
   */
  listRules(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListRulesResponse) => void): Request<Route53RecoveryReadiness.Types.ListRulesResponse, AWSError>;
  /**
   * Returns a list of the tags assigned to the specified resource.
   */
  listTagsForResources(params: Route53RecoveryReadiness.Types.ListTagsForResourcesRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListTagsForResourcesResponse) => void): Request<Route53RecoveryReadiness.Types.ListTagsForResourcesResponse, AWSError>;
  /**
   * Returns a list of the tags assigned to the specified resource.
   */
  listTagsForResources(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListTagsForResourcesResponse) => void): Request<Route53RecoveryReadiness.Types.ListTagsForResourcesResponse, AWSError>;
  /**
   * Adds tags to the specified resource. You can specify one or more tags to add.
   */
  tagResource(params: Route53RecoveryReadiness.Types.TagResourceRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.TagResourceResponse) => void): Request<Route53RecoveryReadiness.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to the specified resource. You can specify one or more tags to add.
   */
  tagResource(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.TagResourceResponse) => void): Request<Route53RecoveryReadiness.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from the specified resource. You can specify one or more tags to remove.
   */
  untagResource(params: Route53RecoveryReadiness.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from the specified resource. You can specify one or more tags to remove.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an existing Cell.
   */
  updateCell(params: Route53RecoveryReadiness.Types.UpdateCellRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateCellResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateCellResponse, AWSError>;
  /**
   * Updates an existing Cell.
   */
  updateCell(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateCellResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateCellResponse, AWSError>;
  /**
   * Updates an exisiting Readiness Check.
   */
  updateReadinessCheck(params: Route53RecoveryReadiness.Types.UpdateReadinessCheckRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateReadinessCheckResponse, AWSError>;
  /**
   * Updates an exisiting Readiness Check.
   */
  updateReadinessCheck(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateReadinessCheckResponse, AWSError>;
  /**
   * Updates an existing Recovery Group.
   */
  updateRecoveryGroup(params: Route53RecoveryReadiness.Types.UpdateRecoveryGroupRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateRecoveryGroupResponse, AWSError>;
  /**
   * Updates an existing Recovery Group.
   */
  updateRecoveryGroup(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateRecoveryGroupResponse, AWSError>;
  /**
   * Updates an existing Resource Set.
   */
  updateResourceSet(params: Route53RecoveryReadiness.Types.UpdateResourceSetRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateResourceSetResponse, AWSError>;
  /**
   * Updates an existing Resource Set.
   */
  updateResourceSet(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateResourceSetResponse, AWSError>;
}
declare namespace Route53RecoveryReadiness {
  export interface CellOutput {
    /**
     * The arn for the Cell
     */
    CellArn: __stringMax256;
    /**
     * The name of the Cell
     */
    CellName: __stringMax64PatternAAZAZ09Z;
    /**
     * A list of Cell arns
     */
    Cells: __listOf__string;
    /**
     * A list of Cell ARNs and/or RecoveryGroup ARNs
     */
    ParentReadinessScopes: __listOf__string;
    Tags?: Tags;
  }
  export interface CreateCellRequest {
    /**
     * The name of the Cell to create
     */
    CellName: __string;
    /**
     * A list of Cell arns contained within this Cell (for use in nested Cells, e.g. regions within which AZs)
     */
    Cells?: __listOf__string;
    Tags?: Tags;
  }
  export interface CreateCellResponse {
    /**
     * The arn for the Cell
     */
    CellArn?: __stringMax256;
    /**
     * The name of the Cell
     */
    CellName?: __stringMax64PatternAAZAZ09Z;
    /**
     * A list of Cell arns
     */
    Cells?: __listOf__string;
    /**
     * A list of Cell ARNs and/or RecoveryGroup ARNs
     */
    ParentReadinessScopes?: __listOf__string;
    Tags?: Tags;
  }
  export interface CreateCrossAccountAuthorizationRequest {
    /**
     * The cross account authorization
     */
    CrossAccountAuthorization: CrossAccountAuthorization;
  }
  export interface CreateCrossAccountAuthorizationResponse {
    /**
     * The cross account authorization
     */
    CrossAccountAuthorization?: CrossAccountAuthorization;
  }
  export interface CreateReadinessCheckRequest {
    /**
     * The name of the ReadinessCheck to create
     */
    ReadinessCheckName: __string;
    /**
     * The name of the ResourceSet to check
     */
    ResourceSetName: __string;
    Tags?: Tags;
  }
  export interface CreateReadinessCheckResponse {
    /**
     * Arn associated with ReadinessCheck
     */
    ReadinessCheckArn?: __stringMax256;
    /**
     * Name for a ReadinessCheck
     */
    ReadinessCheckName?: __stringMax64PatternAAZAZ09Z;
    /**
     * Name of the ResourceSet to be checked
     */
    ResourceSet?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface CreateRecoveryGroupRequest {
    /**
     * A list of Cell arns
     */
    Cells?: __listOf__string;
    /**
     * The name of the RecoveryGroup to create
     */
    RecoveryGroupName: __string;
    Tags?: Tags;
  }
  export interface CreateRecoveryGroupResponse {
    /**
     * A list of Cell arns
     */
    Cells?: __listOf__string;
    /**
     * The arn for the RecoveryGroup
     */
    RecoveryGroupArn?: __stringMax256;
    /**
     * The name of the RecoveryGroup
     */
    RecoveryGroupName?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface CreateResourceSetRequest {
    /**
     * The name of the ResourceSet to create
     */
    ResourceSetName: __string;
    /**
     * AWS Resource type of the resources in the ResourceSet
     */
    ResourceSetType: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of Resource objects
     */
    Resources: __listOfResource;
    Tags?: Tags;
  }
  export interface CreateResourceSetResponse {
    /**
     * The arn for the ResourceSet
     */
    ResourceSetArn?: __stringMax256;
    /**
     * The name of the ResourceSet
     */
    ResourceSetName?: __stringMax64PatternAAZAZ09Z;
    /**
     * AWS Resource Type of the resources in the ResourceSet
     */
    ResourceSetType?: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of Resource objects
     */
    Resources?: __listOfResource;
    Tags?: Tags;
  }
  export type CrossAccountAuthorization = string;
  export interface DNSTargetResource {
    /**
     * The DNS Name that acts as ingress point to a portion of application
     */
    DomainName?: __string;
    /**
     * The Hosted Zone ARN that contains the DNS record with the provided name of target resource.
     */
    HostedZoneArn?: __string;
    /**
     * The R53 Set Id to uniquely identify a record given a Name and a Type
     */
    RecordSetId?: __string;
    /**
     * The Type of DNS Record of target resource
     */
    RecordType?: __string;
    TargetResource?: TargetResource;
  }
  export interface DeleteCellRequest {
    /**
     * The Cell to delete
     */
    CellName: __string;
  }
  export interface DeleteCrossAccountAuthorizationRequest {
    /**
     * The cross account authorization
     */
    CrossAccountAuthorization: __string;
  }
  export interface DeleteCrossAccountAuthorizationResponse {
  }
  export interface DeleteReadinessCheckRequest {
    /**
     * The ReadinessCheck to delete
     */
    ReadinessCheckName: __string;
  }
  export interface DeleteRecoveryGroupRequest {
    /**
     * The RecoveryGroup to delete
     */
    RecoveryGroupName: __string;
  }
  export interface DeleteResourceSetRequest {
    /**
     * The ResourceSet to delete
     */
    ResourceSetName: __string;
  }
  export interface GetArchitectureRecommendationsRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * Name of RecoveryGroup (top level resource) to be analyzed.
     */
    RecoveryGroupName: __string;
  }
  export interface GetArchitectureRecommendationsResponse {
    /**
     * The time a Recovery Group was last assessed for recommendations in UTC ISO-8601 format.
     */
    LastAuditTimestamp?: LastAuditTimestamp;
    /**
     * A token that can be used to resume pagination from the end of the collection
     */
    NextToken?: __string;
    /**
     * A list of recommendations for the customer's application
     */
    Recommendations?: __listOfRecommendation;
  }
  export interface GetCellReadinessSummaryRequest {
    /**
     * The name of the Cell
     */
    CellName: __string;
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface GetCellReadinessSummaryResponse {
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * The readiness at Cell level.
     */
    Readiness?: Readiness;
    /**
     * Summaries for the ReadinessChecks making up the Cell
     */
    ReadinessChecks?: __listOfReadinessCheckSummary;
  }
  export interface GetCellRequest {
    /**
     * The Cell to get
     */
    CellName: __string;
  }
  export interface GetCellResponse {
    /**
     * The arn for the Cell
     */
    CellArn?: __stringMax256;
    /**
     * The name of the Cell
     */
    CellName?: __stringMax64PatternAAZAZ09Z;
    /**
     * A list of Cell arns
     */
    Cells?: __listOf__string;
    /**
     * A list of Cell ARNs and/or RecoveryGroup ARNs
     */
    ParentReadinessScopes?: __listOf__string;
    Tags?: Tags;
  }
  export interface GetReadinessCheckRequest {
    /**
     * The ReadinessCheck to get
     */
    ReadinessCheckName: __string;
  }
  export interface GetReadinessCheckResourceStatusRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
    /**
     * The ReadinessCheck to get
     */
    ReadinessCheckName: __string;
    /**
     * The resource ARN or component Id to get
     */
    ResourceIdentifier: __string;
  }
  export interface GetReadinessCheckResourceStatusResponse {
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * The readiness at rule level.
     */
    Readiness?: Readiness;
    /**
     * Details of the rules's results
     */
    Rules?: __listOfRuleResult;
  }
  export interface GetReadinessCheckResponse {
    /**
     * Arn associated with ReadinessCheck
     */
    ReadinessCheckArn?: __stringMax256;
    /**
     * Name for a ReadinessCheck
     */
    ReadinessCheckName?: __stringMax64PatternAAZAZ09Z;
    /**
     * Name of the ResourceSet to be checked
     */
    ResourceSet?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface GetReadinessCheckStatusRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
    /**
     * The ReadinessCheck to get
     */
    ReadinessCheckName: __string;
  }
  export interface GetReadinessCheckStatusResponse {
    /**
     * Top level messages for readiness check status
     */
    Messages?: __listOfMessage;
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * The readiness at rule level.
     */
    Readiness?: Readiness;
    /**
     * Summary of resources's readiness
     */
    Resources?: __listOfResourceResult;
  }
  export interface GetRecoveryGroupReadinessSummaryRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
    /**
     * The name of the RecoveryGroup
     */
    RecoveryGroupName: __string;
  }
  export interface GetRecoveryGroupReadinessSummaryResponse {
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * The readiness at RecoveryGroup level.
     */
    Readiness?: Readiness;
    /**
     * Summaries for the ReadinessChecks making up the RecoveryGroup
     */
    ReadinessChecks?: __listOfReadinessCheckSummary;
  }
  export interface GetRecoveryGroupRequest {
    /**
     * The RecoveryGroup to get
     */
    RecoveryGroupName: __string;
  }
  export interface GetRecoveryGroupResponse {
    /**
     * A list of Cell arns
     */
    Cells?: __listOf__string;
    /**
     * The arn for the RecoveryGroup
     */
    RecoveryGroupArn?: __stringMax256;
    /**
     * The name of the RecoveryGroup
     */
    RecoveryGroupName?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface GetResourceSetRequest {
    /**
     * The ResourceSet to get
     */
    ResourceSetName: __string;
  }
  export interface GetResourceSetResponse {
    /**
     * The arn for the ResourceSet
     */
    ResourceSetArn?: __stringMax256;
    /**
     * The name of the ResourceSet
     */
    ResourceSetName?: __stringMax64PatternAAZAZ09Z;
    /**
     * AWS Resource Type of the resources in the ResourceSet
     */
    ResourceSetType?: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of Resource objects
     */
    Resources?: __listOfResource;
    Tags?: Tags;
  }
  export type LastAuditTimestamp = Date;
  export interface ListCellsRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface ListCellsResponse {
    /**
     * A list of Cells
     */
    Cells?: __listOfCellOutput;
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
  }
  export interface ListCrossAccountAuthorizationsRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface ListCrossAccountAuthorizationsResponse {
    /**
     * A list of CrossAccountAuthorizations
     */
    CrossAccountAuthorizations?: __listOfCrossAccountAuthorization;
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
  }
  export interface ListReadinessChecksRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface ListReadinessChecksResponse {
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * A list of ReadinessCheck associated with the account
     */
    ReadinessChecks?: __listOfReadinessCheckOutput;
  }
  export interface ListRecoveryGroupsRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface ListRecoveryGroupsResponse {
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * A list of RecoveryGroups
     */
    RecoveryGroups?: __listOfRecoveryGroupOutput;
  }
  export interface ListResourceSetsRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
  }
  export interface ListResourceSetsResponse {
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * A list of ResourceSets associated with the account
     */
    ResourceSets?: __listOfResourceSetOutput;
  }
  export interface ListRulesOutput {
    /**
     * The resource type the rule applies to.
     */
    ResourceType: __stringMax64;
    /**
     * A description of the rule
     */
    RuleDescription: __stringMax256;
    /**
     * The Rule's ID.
     */
    RuleId: __stringMax64;
  }
  export interface ListRulesRequest {
    /**
     * Upper bound on number of records to return.
     */
    MaxResults?: MaxResults;
    /**
     * A token used to resume pagination from the end of a previous request.
     */
    NextToken?: __string;
    /**
     * Filter parameter which specifies the rules to return given a resource type.
     */
    ResourceType?: __string;
  }
  export interface ListRulesResponse {
    /**
     * A token that can be used to resume pagination from the end of the collection.
     */
    NextToken?: __string;
    /**
     * A list of rules
     */
    Rules?: __listOfListRulesOutput;
  }
  export interface ListTagsForResourcesRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource. You can get this from the response to any request to the resource.
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourcesResponse {
    Tags?: Tags;
  }
  export type MaxResults = number;
  export interface Message {
    /**
     * The text of a readiness check message
     */
    MessageText?: __string;
  }
  export interface NLBResource {
    /**
     * An NLB resource arn
     */
    Arn?: __string;
  }
  export interface R53ResourceRecord {
    /**
     * The DNS target name
     */
    DomainName?: __string;
    /**
     * The Resource Record set id
     */
    RecordSetId?: __string;
  }
  export type Readiness = "READY"|"NOT_READY"|"UNKNOWN"|"NOT_AUTHORIZED"|string;
  export interface ReadinessCheckOutput {
    /**
     * Arn associated with ReadinessCheck
     */
    ReadinessCheckArn: __stringMax256;
    /**
     * Name for a ReadinessCheck
     */
    ReadinessCheckName?: __stringMax64PatternAAZAZ09Z;
    /**
     * Name of the ResourceSet to be checked
     */
    ResourceSet: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface ReadinessCheckSummary {
    /**
     * The readiness of this ReadinessCheck
     */
    Readiness?: Readiness;
    /**
     * The name of a ReadinessCheck which is part of the given RecoveryGroup or Cell
     */
    ReadinessCheckName?: __string;
  }
  export type ReadinessCheckTimestamp = Date;
  export interface Recommendation {
    /**
     * Guidance text for recommendation
     */
    RecommendationText: __string;
  }
  export interface RecoveryGroupOutput {
    /**
     * A list of Cell arns
     */
    Cells: __listOf__string;
    /**
     * The arn for the RecoveryGroup
     */
    RecoveryGroupArn: __stringMax256;
    /**
     * The name of the RecoveryGroup
     */
    RecoveryGroupName: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface Resource {
    /**
     * The component id of the resource, generated by the service when dnsTargetResource is used
     */
    ComponentId?: __string;
    DnsTargetResource?: DNSTargetResource;
    /**
     * A list of RecoveryGroup ARNs and/or Cell ARNs that this resource is contained within.
     */
    ReadinessScopes?: __listOf__string;
    /**
     * The ARN of the AWS resource, can be skipped if dnsTargetResource is used
     */
    ResourceArn?: __string;
  }
  export interface ResourceResult {
    /**
     * The component id of the resource
     */
    ComponentId?: __string;
    /**
     * The time the resource was last checked for readiness, in ISO-8601 format, UTC.
     */
    LastCheckedTimestamp: ReadinessCheckTimestamp;
    /**
     * The readiness of the resource.
     */
    Readiness: Readiness;
    /**
     * The ARN of the resource
     */
    ResourceArn?: __string;
  }
  export interface ResourceSetOutput {
    /**
     * The arn for the ResourceSet
     */
    ResourceSetArn: __stringMax256;
    /**
     * The name of the ResourceSet
     */
    ResourceSetName: __stringMax64PatternAAZAZ09Z;
    /**
     * AWS Resource Type of the resources in the ResourceSet
     */
    ResourceSetType: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of Resource objects
     */
    Resources: __listOfResource;
    Tags?: Tags;
  }
  export interface RuleResult {
    /**
     * The time the resource was last checked for readiness, in ISO-8601 format, UTC.
     */
    LastCheckedTimestamp: ReadinessCheckTimestamp;
    /**
     * Details about the resource's readiness
     */
    Messages: __listOfMessage;
    /**
     * The readiness at rule level.
     */
    Readiness: Readiness;
    /**
     * The identifier of the rule.
     */
    RuleId: __string;
  }
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource. You can get this from the response to any request to the resource.
     */
    ResourceArn: __string;
    Tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type Tags = {[key: string]: __string};
  export interface TargetResource {
    NLBResource?: NLBResource;
    R53Resource?: R53ResourceRecord;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource. You can get this from the response to any request to the resource.
     */
    ResourceArn: __string;
    /**
     * A comma-separated list of the tag keys to remove from the resource.
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateCellRequest {
    /**
     * The Cell to update
     */
    CellName: __string;
    /**
     * A list of Cell arns, completely replaces previous list
     */
    Cells: __listOf__string;
  }
  export interface UpdateCellResponse {
    /**
     * The arn for the Cell
     */
    CellArn?: __stringMax256;
    /**
     * The name of the Cell
     */
    CellName?: __stringMax64PatternAAZAZ09Z;
    /**
     * A list of Cell arns
     */
    Cells?: __listOf__string;
    /**
     * A list of Cell ARNs and/or RecoveryGroup ARNs
     */
    ParentReadinessScopes?: __listOf__string;
    Tags?: Tags;
  }
  export interface UpdateReadinessCheckRequest {
    /**
     * The ReadinessCheck to update
     */
    ReadinessCheckName: __string;
    /**
     * The name of the ResourceSet to check
     */
    ResourceSetName: __string;
  }
  export interface UpdateReadinessCheckResponse {
    /**
     * Arn associated with ReadinessCheck
     */
    ReadinessCheckArn?: __stringMax256;
    /**
     * Name for a ReadinessCheck
     */
    ReadinessCheckName?: __stringMax64PatternAAZAZ09Z;
    /**
     * Name of the ResourceSet to be checked
     */
    ResourceSet?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface UpdateRecoveryGroupRequest {
    /**
     * A list of Cell arns, completely replaces previous list
     */
    Cells: __listOf__string;
    /**
     * The RecoveryGroup to update
     */
    RecoveryGroupName: __string;
  }
  export interface UpdateRecoveryGroupResponse {
    /**
     * A list of Cell arns
     */
    Cells?: __listOf__string;
    /**
     * The arn for the RecoveryGroup
     */
    RecoveryGroupArn?: __stringMax256;
    /**
     * The name of the RecoveryGroup
     */
    RecoveryGroupName?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface UpdateResourceSetRequest {
    /**
     * The ResourceSet to update
     */
    ResourceSetName: __string;
    /**
     * AWS Resource Type of the resources in the ResourceSet
     */
    ResourceSetType: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of Resource objects
     */
    Resources: __listOfResource;
  }
  export interface UpdateResourceSetResponse {
    /**
     * The arn for the ResourceSet
     */
    ResourceSetArn?: __stringMax256;
    /**
     * The name of the ResourceSet
     */
    ResourceSetName?: __stringMax64PatternAAZAZ09Z;
    /**
     * AWS Resource Type of the resources in the ResourceSet
     */
    ResourceSetType?: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of Resource objects
     */
    Resources?: __listOfResource;
    Tags?: Tags;
  }
  export type __listOfCellOutput = CellOutput[];
  export type __listOfCrossAccountAuthorization = CrossAccountAuthorization[];
  export type __listOfListRulesOutput = ListRulesOutput[];
  export type __listOfMessage = Message[];
  export type __listOfReadinessCheckOutput = ReadinessCheckOutput[];
  export type __listOfReadinessCheckSummary = ReadinessCheckSummary[];
  export type __listOfRecommendation = Recommendation[];
  export type __listOfRecoveryGroupOutput = RecoveryGroupOutput[];
  export type __listOfResource = Resource[];
  export type __listOfResourceResult = ResourceResult[];
  export type __listOfResourceSetOutput = ResourceSetOutput[];
  export type __listOfRuleResult = RuleResult[];
  export type __listOf__string = __string[];
  export type __string = string;
  export type __stringMax256 = string;
  export type __stringMax64 = string;
  export type __stringMax64PatternAAZAZ09Z = string;
  export type __stringPatternAWSAZaZ09AZaZ09 = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-12-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Route53RecoveryReadiness client.
   */
  export import Types = Route53RecoveryReadiness;
}
export = Route53RecoveryReadiness;
