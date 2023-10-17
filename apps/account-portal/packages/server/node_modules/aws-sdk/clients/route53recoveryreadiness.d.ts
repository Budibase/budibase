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
   * Creates a cell in an account.
   */
  createCell(params: Route53RecoveryReadiness.Types.CreateCellRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateCellResponse) => void): Request<Route53RecoveryReadiness.Types.CreateCellResponse, AWSError>;
  /**
   * Creates a cell in an account.
   */
  createCell(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateCellResponse) => void): Request<Route53RecoveryReadiness.Types.CreateCellResponse, AWSError>;
  /**
   * Creates a cross-account readiness authorization. This lets you authorize another account to work with Route 53 Application Recovery Controller, for example, to check the readiness status of resources in a separate account.
   */
  createCrossAccountAuthorization(params: Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationResponse) => void): Request<Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationResponse, AWSError>;
  /**
   * Creates a cross-account readiness authorization. This lets you authorize another account to work with Route 53 Application Recovery Controller, for example, to check the readiness status of resources in a separate account.
   */
  createCrossAccountAuthorization(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationResponse) => void): Request<Route53RecoveryReadiness.Types.CreateCrossAccountAuthorizationResponse, AWSError>;
  /**
   * Creates a readiness check in an account. A readiness check monitors a resource set in your application, such as a set of Amazon Aurora instances, that Application Recovery Controller is auditing recovery readiness for. The audits run once every minute on every resource that's associated with a readiness check.
   */
  createReadinessCheck(params: Route53RecoveryReadiness.Types.CreateReadinessCheckRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.CreateReadinessCheckResponse, AWSError>;
  /**
   * Creates a readiness check in an account. A readiness check monitors a resource set in your application, such as a set of Amazon Aurora instances, that Application Recovery Controller is auditing recovery readiness for. The audits run once every minute on every resource that's associated with a readiness check.
   */
  createReadinessCheck(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.CreateReadinessCheckResponse, AWSError>;
  /**
   * Creates a recovery group in an account. A recovery group corresponds to an application and includes a list of the cells that make up the application.
   */
  createRecoveryGroup(params: Route53RecoveryReadiness.Types.CreateRecoveryGroupRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.CreateRecoveryGroupResponse, AWSError>;
  /**
   * Creates a recovery group in an account. A recovery group corresponds to an application and includes a list of the cells that make up the application.
   */
  createRecoveryGroup(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.CreateRecoveryGroupResponse, AWSError>;
  /**
   * Creates a resource set. A resource set is a set of resources of one type that span multiple cells. You can associate a resource set with a readiness check to monitor the resources for failover readiness.
   */
  createResourceSet(params: Route53RecoveryReadiness.Types.CreateResourceSetRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.CreateResourceSetResponse, AWSError>;
  /**
   * Creates a resource set. A resource set is a set of resources of one type that span multiple cells. You can associate a resource set with a readiness check to monitor the resources for failover readiness.
   */
  createResourceSet(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.CreateResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.CreateResourceSetResponse, AWSError>;
  /**
   * Delete a cell. When successful, the response code is 204, with no response body.
   */
  deleteCell(params: Route53RecoveryReadiness.Types.DeleteCellRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a cell. When successful, the response code is 204, with no response body.
   */
  deleteCell(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes cross account readiness authorization.
   */
  deleteCrossAccountAuthorization(params: Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationResponse) => void): Request<Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationResponse, AWSError>;
  /**
   * Deletes cross account readiness authorization.
   */
  deleteCrossAccountAuthorization(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationResponse) => void): Request<Route53RecoveryReadiness.Types.DeleteCrossAccountAuthorizationResponse, AWSError>;
  /**
   * Deletes a readiness check.
   */
  deleteReadinessCheck(params: Route53RecoveryReadiness.Types.DeleteReadinessCheckRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a readiness check.
   */
  deleteReadinessCheck(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a recovery group.
   */
  deleteRecoveryGroup(params: Route53RecoveryReadiness.Types.DeleteRecoveryGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a recovery group.
   */
  deleteRecoveryGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a resource set.
   */
  deleteResourceSet(params: Route53RecoveryReadiness.Types.DeleteResourceSetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a resource set.
   */
  deleteResourceSet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets recommendations about architecture designs for improving resiliency for an application, based on a recovery group.
   */
  getArchitectureRecommendations(params: Route53RecoveryReadiness.Types.GetArchitectureRecommendationsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetArchitectureRecommendationsResponse) => void): Request<Route53RecoveryReadiness.Types.GetArchitectureRecommendationsResponse, AWSError>;
  /**
   * Gets recommendations about architecture designs for improving resiliency for an application, based on a recovery group.
   */
  getArchitectureRecommendations(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetArchitectureRecommendationsResponse) => void): Request<Route53RecoveryReadiness.Types.GetArchitectureRecommendationsResponse, AWSError>;
  /**
   * Gets information about a cell including cell name, cell Amazon Resource Name (ARN), ARNs of nested cells for this cell, and a list of those cell ARNs with their associated recovery group ARNs.
   */
  getCell(params: Route53RecoveryReadiness.Types.GetCellRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetCellResponse) => void): Request<Route53RecoveryReadiness.Types.GetCellResponse, AWSError>;
  /**
   * Gets information about a cell including cell name, cell Amazon Resource Name (ARN), ARNs of nested cells for this cell, and a list of those cell ARNs with their associated recovery group ARNs.
   */
  getCell(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetCellResponse) => void): Request<Route53RecoveryReadiness.Types.GetCellResponse, AWSError>;
  /**
   * Gets readiness for a cell. Aggregates the readiness of all the resources that are associated with the cell into a single value.
   */
  getCellReadinessSummary(params: Route53RecoveryReadiness.Types.GetCellReadinessSummaryRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetCellReadinessSummaryResponse) => void): Request<Route53RecoveryReadiness.Types.GetCellReadinessSummaryResponse, AWSError>;
  /**
   * Gets readiness for a cell. Aggregates the readiness of all the resources that are associated with the cell into a single value.
   */
  getCellReadinessSummary(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetCellReadinessSummaryResponse) => void): Request<Route53RecoveryReadiness.Types.GetCellReadinessSummaryResponse, AWSError>;
  /**
   * Gets details about a readiness check.
   */
  getReadinessCheck(params: Route53RecoveryReadiness.Types.GetReadinessCheckRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckResponse, AWSError>;
  /**
   * Gets details about a readiness check.
   */
  getReadinessCheck(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckResponse, AWSError>;
  /**
   * Gets individual readiness status for a readiness check. To see the overall readiness status for a recovery group, that considers the readiness status for all the readiness checks in the recovery group, use GetRecoveryGroupReadinessSummary.
   */
  getReadinessCheckResourceStatus(params: Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusResponse, AWSError>;
  /**
   * Gets individual readiness status for a readiness check. To see the overall readiness status for a recovery group, that considers the readiness status for all the readiness checks in the recovery group, use GetRecoveryGroupReadinessSummary.
   */
  getReadinessCheckResourceStatus(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckResourceStatusResponse, AWSError>;
  /**
   * Gets the readiness status for an individual readiness check. To see the overall readiness status for a recovery group, that considers the readiness status for all the readiness checks in a recovery group, use GetRecoveryGroupReadinessSummary.
   */
  getReadinessCheckStatus(params: Route53RecoveryReadiness.Types.GetReadinessCheckStatusRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckStatusResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckStatusResponse, AWSError>;
  /**
   * Gets the readiness status for an individual readiness check. To see the overall readiness status for a recovery group, that considers the readiness status for all the readiness checks in a recovery group, use GetRecoveryGroupReadinessSummary.
   */
  getReadinessCheckStatus(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetReadinessCheckStatusResponse) => void): Request<Route53RecoveryReadiness.Types.GetReadinessCheckStatusResponse, AWSError>;
  /**
   * Gets details about a recovery group, including a list of the cells that are included in it.
   */
  getRecoveryGroup(params: Route53RecoveryReadiness.Types.GetRecoveryGroupRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.GetRecoveryGroupResponse, AWSError>;
  /**
   * Gets details about a recovery group, including a list of the cells that are included in it.
   */
  getRecoveryGroup(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.GetRecoveryGroupResponse, AWSError>;
  /**
   * Displays a summary of information about a recovery group's readiness status. Includes the readiness checks for resources in the recovery group and the readiness status of each one.
   */
  getRecoveryGroupReadinessSummary(params: Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryResponse) => void): Request<Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryResponse, AWSError>;
  /**
   * Displays a summary of information about a recovery group's readiness status. Includes the readiness checks for resources in the recovery group and the readiness status of each one.
   */
  getRecoveryGroupReadinessSummary(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryResponse) => void): Request<Route53RecoveryReadiness.Types.GetRecoveryGroupReadinessSummaryResponse, AWSError>;
  /**
   * Displays the details about a resource set, including a list of the resources in the set.
   */
  getResourceSet(params: Route53RecoveryReadiness.Types.GetResourceSetRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.GetResourceSetResponse, AWSError>;
  /**
   * Displays the details about a resource set, including a list of the resources in the set.
   */
  getResourceSet(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.GetResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.GetResourceSetResponse, AWSError>;
  /**
   * Lists the cells for an account.
   */
  listCells(params: Route53RecoveryReadiness.Types.ListCellsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListCellsResponse) => void): Request<Route53RecoveryReadiness.Types.ListCellsResponse, AWSError>;
  /**
   * Lists the cells for an account.
   */
  listCells(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListCellsResponse) => void): Request<Route53RecoveryReadiness.Types.ListCellsResponse, AWSError>;
  /**
   * Lists the cross-account readiness authorizations that are in place for an account.
   */
  listCrossAccountAuthorizations(params: Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsResponse) => void): Request<Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsResponse, AWSError>;
  /**
   * Lists the cross-account readiness authorizations that are in place for an account.
   */
  listCrossAccountAuthorizations(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsResponse) => void): Request<Route53RecoveryReadiness.Types.ListCrossAccountAuthorizationsResponse, AWSError>;
  /**
   * Lists the readiness checks for an account.
   */
  listReadinessChecks(params: Route53RecoveryReadiness.Types.ListReadinessChecksRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListReadinessChecksResponse) => void): Request<Route53RecoveryReadiness.Types.ListReadinessChecksResponse, AWSError>;
  /**
   * Lists the readiness checks for an account.
   */
  listReadinessChecks(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListReadinessChecksResponse) => void): Request<Route53RecoveryReadiness.Types.ListReadinessChecksResponse, AWSError>;
  /**
   * Lists the recovery groups in an account.
   */
  listRecoveryGroups(params: Route53RecoveryReadiness.Types.ListRecoveryGroupsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListRecoveryGroupsResponse) => void): Request<Route53RecoveryReadiness.Types.ListRecoveryGroupsResponse, AWSError>;
  /**
   * Lists the recovery groups in an account.
   */
  listRecoveryGroups(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListRecoveryGroupsResponse) => void): Request<Route53RecoveryReadiness.Types.ListRecoveryGroupsResponse, AWSError>;
  /**
   * Lists the resource sets in an account.
   */
  listResourceSets(params: Route53RecoveryReadiness.Types.ListResourceSetsRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListResourceSetsResponse) => void): Request<Route53RecoveryReadiness.Types.ListResourceSetsResponse, AWSError>;
  /**
   * Lists the resource sets in an account.
   */
  listResourceSets(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListResourceSetsResponse) => void): Request<Route53RecoveryReadiness.Types.ListResourceSetsResponse, AWSError>;
  /**
   * Lists all readiness rules, or lists the readiness rules for a specific resource type.
   */
  listRules(params: Route53RecoveryReadiness.Types.ListRulesRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListRulesResponse) => void): Request<Route53RecoveryReadiness.Types.ListRulesResponse, AWSError>;
  /**
   * Lists all readiness rules, or lists the readiness rules for a specific resource type.
   */
  listRules(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListRulesResponse) => void): Request<Route53RecoveryReadiness.Types.ListRulesResponse, AWSError>;
  /**
   * Lists the tags for a resource.
   */
  listTagsForResources(params: Route53RecoveryReadiness.Types.ListTagsForResourcesRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListTagsForResourcesResponse) => void): Request<Route53RecoveryReadiness.Types.ListTagsForResourcesResponse, AWSError>;
  /**
   * Lists the tags for a resource.
   */
  listTagsForResources(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.ListTagsForResourcesResponse) => void): Request<Route53RecoveryReadiness.Types.ListTagsForResourcesResponse, AWSError>;
  /**
   * Adds a tag to a resource.
   */
  tagResource(params: Route53RecoveryReadiness.Types.TagResourceRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.TagResourceResponse) => void): Request<Route53RecoveryReadiness.Types.TagResourceResponse, AWSError>;
  /**
   * Adds a tag to a resource.
   */
  tagResource(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.TagResourceResponse) => void): Request<Route53RecoveryReadiness.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag from a resource.
   */
  untagResource(params: Route53RecoveryReadiness.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a tag from a resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a cell to replace the list of nested cells with a new list of nested cells.
   */
  updateCell(params: Route53RecoveryReadiness.Types.UpdateCellRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateCellResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateCellResponse, AWSError>;
  /**
   * Updates a cell to replace the list of nested cells with a new list of nested cells.
   */
  updateCell(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateCellResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateCellResponse, AWSError>;
  /**
   * Updates a readiness check.
   */
  updateReadinessCheck(params: Route53RecoveryReadiness.Types.UpdateReadinessCheckRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateReadinessCheckResponse, AWSError>;
  /**
   * Updates a readiness check.
   */
  updateReadinessCheck(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateReadinessCheckResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateReadinessCheckResponse, AWSError>;
  /**
   * Updates a recovery group.
   */
  updateRecoveryGroup(params: Route53RecoveryReadiness.Types.UpdateRecoveryGroupRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateRecoveryGroupResponse, AWSError>;
  /**
   * Updates a recovery group.
   */
  updateRecoveryGroup(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateRecoveryGroupResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateRecoveryGroupResponse, AWSError>;
  /**
   * Updates a resource set.
   */
  updateResourceSet(params: Route53RecoveryReadiness.Types.UpdateResourceSetRequest, callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateResourceSetResponse, AWSError>;
  /**
   * Updates a resource set.
   */
  updateResourceSet(callback?: (err: AWSError, data: Route53RecoveryReadiness.Types.UpdateResourceSetResponse) => void): Request<Route53RecoveryReadiness.Types.UpdateResourceSetResponse, AWSError>;
}
declare namespace Route53RecoveryReadiness {
  export interface CellOutput {
    /**
     * The Amazon Resource Name (ARN) for the cell.
     */
    CellArn: __stringMax256;
    /**
     * The name of the cell.
     */
    CellName: __stringMax64PatternAAZAZ09Z;
    /**
     * A list of cell ARNs.
     */
    Cells: __listOf__string;
    /**
     * The readiness scope for the cell, which can be a cell Amazon Resource Name (ARN) or a recovery group ARN. This is a list but currently can have only one element.
     */
    ParentReadinessScopes: __listOf__string;
    /**
     * Tags on the resources.
     */
    Tags?: Tags;
  }
  export interface CreateCellRequest {
    /**
     * The name of the cell to create.
     */
    CellName: __string;
    /**
     * A list of cell Amazon Resource Names (ARNs) contained within this cell, for use in nested cells. For example, Availability Zones within specific Amazon Web Services Regions.
     */
    Cells?: __listOf__string;
    Tags?: Tags;
  }
  export interface CreateCellResponse {
    /**
     * The Amazon Resource Name (ARN) for the cell.
     */
    CellArn?: __stringMax256;
    /**
     * The name of the cell.
     */
    CellName?: __stringMax64PatternAAZAZ09Z;
    /**
     * A list of cell ARNs.
     */
    Cells?: __listOf__string;
    /**
     * The readiness scope for the cell, which can be a cell Amazon Resource Name (ARN) or a recovery group ARN. This is a list but currently can have only one element.
     */
    ParentReadinessScopes?: __listOf__string;
    /**
     * Tags on the resources.
     */
    Tags?: Tags;
  }
  export interface CreateCrossAccountAuthorizationRequest {
    /**
     * The cross-account authorization.
     */
    CrossAccountAuthorization: CrossAccountAuthorization;
  }
  export interface CreateCrossAccountAuthorizationResponse {
    /**
     * The cross-account authorization.
     */
    CrossAccountAuthorization?: CrossAccountAuthorization;
  }
  export interface CreateReadinessCheckRequest {
    /**
     * The name of the readiness check to create.
     */
    ReadinessCheckName: __string;
    /**
     * The name of the resource set to check.
     */
    ResourceSetName: __string;
    Tags?: Tags;
  }
  export interface CreateReadinessCheckResponse {
    /**
     * The Amazon Resource Name (ARN) associated with a readiness check.
     */
    ReadinessCheckArn?: __stringMax256;
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName?: __stringMax64PatternAAZAZ09Z;
    /**
     * Name of the resource set to be checked.
     */
    ResourceSet?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface CreateRecoveryGroupRequest {
    /**
     * A list of the cell Amazon Resource Names (ARNs) in the recovery group.
     */
    Cells?: __listOf__string;
    /**
     * The name of the recovery group to create.
     */
    RecoveryGroupName: __string;
    Tags?: Tags;
  }
  export interface CreateRecoveryGroupResponse {
    /**
     * A list of a cell's Amazon Resource Names (ARNs).
     */
    Cells?: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) for the recovery group.
     */
    RecoveryGroupArn?: __stringMax256;
    /**
     * The name of the recovery group.
     */
    RecoveryGroupName?: __stringMax64PatternAAZAZ09Z;
    /**
     * The tags associated with the recovery group.
     */
    Tags?: Tags;
  }
  export interface CreateResourceSetRequest {
    /**
     * The name of the resource set to create.
     */
    ResourceSetName: __string;
    /**
     * The resource type of the resources in the resource set. Enter one of the following values for resource type: AWS::ApiGateway::Stage, AWS::ApiGatewayV2::Stage, AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::Lambda::Function, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource
     */
    ResourceSetType: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of resource objects in the resource set.
     */
    Resources: __listOfResource;
    /**
     * A tag to associate with the parameters for a resource set.
     */
    Tags?: Tags;
  }
  export interface CreateResourceSetResponse {
    /**
     * The Amazon Resource Name (ARN) for the resource set.
     */
    ResourceSetArn?: __stringMax256;
    /**
     * The name of the resource set.
     */
    ResourceSetName?: __stringMax64PatternAAZAZ09Z;
    /**
     * The resource type of the resources in the resource set. Enter one of the following values for resource type: AWS::ApiGateway::Stage, AWS::ApiGatewayV2::Stage, AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::Lambda::Function, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource
     */
    ResourceSetType?: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of resource objects.
     */
    Resources?: __listOfResource;
    Tags?: Tags;
  }
  export type CrossAccountAuthorization = string;
  export interface DNSTargetResource {
    /**
     * The domain name that acts as an ingress point to a portion of the customer application.
     */
    DomainName?: __string;
    /**
     * The hosted zone Amazon Resource Name (ARN) that contains the DNS record with the provided name of the target resource.
     */
    HostedZoneArn?: __string;
    /**
     * The Route 53 record set ID that uniquely identifies a DNS record, given a name and a type.
     */
    RecordSetId?: __string;
    /**
     * The type of DNS record of the target resource.
     */
    RecordType?: __string;
    /**
     * The target resource of the DNS target resource.
     */
    TargetResource?: TargetResource;
  }
  export interface DeleteCellRequest {
    /**
     * The name of the cell.
     */
    CellName: __string;
  }
  export interface DeleteCrossAccountAuthorizationRequest {
    /**
     * The cross-account authorization.
     */
    CrossAccountAuthorization: __string;
  }
  export interface DeleteCrossAccountAuthorizationResponse {
  }
  export interface DeleteReadinessCheckRequest {
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName: __string;
  }
  export interface DeleteRecoveryGroupRequest {
    /**
     * The name of a recovery group.
     */
    RecoveryGroupName: __string;
  }
  export interface DeleteResourceSetRequest {
    /**
     * Name of a resource set.
     */
    ResourceSetName: __string;
  }
  export interface GetArchitectureRecommendationsRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * The name of a recovery group.
     */
    RecoveryGroupName: __string;
  }
  export interface GetArchitectureRecommendationsResponse {
    /**
     * The time that a recovery group was last assessed for recommendations, in UTC ISO-8601 format.
     */
    LastAuditTimestamp?: LastAuditTimestamp;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * A list of the recommendations for the customer's application.
     */
    Recommendations?: __listOfRecommendation;
  }
  export interface GetCellReadinessSummaryRequest {
    /**
     * The name of the cell.
     */
    CellName: __string;
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface GetCellReadinessSummaryResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * The readiness at a cell level.
     */
    Readiness?: Readiness;
    /**
     * Summaries for the readiness checks that make up the cell.
     */
    ReadinessChecks?: __listOfReadinessCheckSummary;
  }
  export interface GetCellRequest {
    /**
     * The name of the cell.
     */
    CellName: __string;
  }
  export interface GetCellResponse {
    /**
     * The Amazon Resource Name (ARN) for the cell.
     */
    CellArn?: __stringMax256;
    /**
     * The name of the cell.
     */
    CellName?: __stringMax64PatternAAZAZ09Z;
    /**
     * A list of cell ARNs.
     */
    Cells?: __listOf__string;
    /**
     * The readiness scope for the cell, which can be a cell Amazon Resource Name (ARN) or a recovery group ARN. This is a list but currently can have only one element.
     */
    ParentReadinessScopes?: __listOf__string;
    /**
     * Tags on the resources.
     */
    Tags?: Tags;
  }
  export interface GetReadinessCheckRequest {
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName: __string;
  }
  export interface GetReadinessCheckResourceStatusRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName: __string;
    /**
     * The resource identifier, which is the Amazon Resource Name (ARN) or the identifier generated for the resource by Application Recovery Controller (for example, for a DNS target resource).
     */
    ResourceIdentifier: __string;
  }
  export interface GetReadinessCheckResourceStatusResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * The readiness at a rule level.
     */
    Readiness?: Readiness;
    /**
     * Details of the rule's results.
     */
    Rules?: __listOfRuleResult;
  }
  export interface GetReadinessCheckResponse {
    /**
     * The Amazon Resource Name (ARN) associated with a readiness check.
     */
    ReadinessCheckArn?: __stringMax256;
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName?: __stringMax64PatternAAZAZ09Z;
    /**
     * Name of the resource set to be checked.
     */
    ResourceSet?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface GetReadinessCheckStatusRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName: __string;
  }
  export interface GetReadinessCheckStatusResponse {
    /**
     * Top level messages for readiness check status
     */
    Messages?: __listOfMessage;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * The readiness at rule level.
     */
    Readiness?: Readiness;
    /**
     * Summary of the readiness of resources.
     */
    Resources?: __listOfResourceResult;
  }
  export interface GetRecoveryGroupReadinessSummaryRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * The name of a recovery group.
     */
    RecoveryGroupName: __string;
  }
  export interface GetRecoveryGroupReadinessSummaryResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * The readiness status at a recovery group level.
     */
    Readiness?: Readiness;
    /**
     * Summaries of the readiness checks for the recovery group.
     */
    ReadinessChecks?: __listOfReadinessCheckSummary;
  }
  export interface GetRecoveryGroupRequest {
    /**
     * The name of a recovery group.
     */
    RecoveryGroupName: __string;
  }
  export interface GetRecoveryGroupResponse {
    /**
     * A list of a cell's Amazon Resource Names (ARNs).
     */
    Cells?: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) for the recovery group.
     */
    RecoveryGroupArn?: __stringMax256;
    /**
     * The name of the recovery group.
     */
    RecoveryGroupName?: __stringMax64PatternAAZAZ09Z;
    /**
     * The tags associated with the recovery group.
     */
    Tags?: Tags;
  }
  export interface GetResourceSetRequest {
    /**
     * Name of a resource set.
     */
    ResourceSetName: __string;
  }
  export interface GetResourceSetResponse {
    /**
     * The Amazon Resource Name (ARN) for the resource set.
     */
    ResourceSetArn?: __stringMax256;
    /**
     * The name of the resource set.
     */
    ResourceSetName?: __stringMax64PatternAAZAZ09Z;
    /**
     * The resource type of the resources in the resource set. Enter one of the following values for resource type: AWS::ApiGateway::Stage, AWS::ApiGatewayV2::Stage, AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::Lambda::Function, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource
     */
    ResourceSetType?: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of resource objects.
     */
    Resources?: __listOfResource;
    Tags?: Tags;
  }
  export type LastAuditTimestamp = Date;
  export interface ListCellsRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListCellsResponse {
    /**
     * A list of cells.
     */
    Cells?: __listOfCellOutput;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListCrossAccountAuthorizationsRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListCrossAccountAuthorizationsResponse {
    /**
     * A list of cross-account authorizations.
     */
    CrossAccountAuthorizations?: __listOfCrossAccountAuthorization;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListReadinessChecksRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListReadinessChecksResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * A list of readiness checks associated with the account.
     */
    ReadinessChecks?: __listOfReadinessCheckOutput;
  }
  export interface ListRecoveryGroupsRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListRecoveryGroupsResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * A list of recovery groups.
     */
    RecoveryGroups?: __listOfRecoveryGroupOutput;
  }
  export interface ListResourceSetsRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListResourceSetsResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * A list of resource sets associated with the account.
     */
    ResourceSets?: __listOfResourceSetOutput;
  }
  export interface ListRulesOutput {
    /**
     * The resource type that the readiness rule applies to.
     */
    ResourceType: __stringMax64;
    /**
     * The description of a readiness rule.
     */
    RuleDescription: __stringMax256;
    /**
     * The ID for the readiness rule.
     */
    RuleId: __stringMax64;
  }
  export interface ListRulesRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * The resource type that a readiness rule applies to.
     */
    ResourceType?: __string;
  }
  export interface ListRulesResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * A list of readiness rules for a specific resource type.
     */
    Rules?: __listOfListRulesOutput;
  }
  export interface ListTagsForResourcesRequest {
    /**
     * The Amazon Resource Name (ARN) for a resource.
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourcesResponse {
    /**
     * 
     */
    Tags?: Tags;
  }
  export type MaxResults = number;
  export interface Message {
    /**
     * The text of a readiness check message.
     */
    MessageText?: __string;
  }
  export interface NLBResource {
    /**
     * The Network Load Balancer resource Amazon Resource Name (ARN).
     */
    Arn?: __string;
  }
  export interface R53ResourceRecord {
    /**
     * The DNS target domain name.
     */
    DomainName?: __string;
    /**
     * The Route 53 Resource Record Set ID.
     */
    RecordSetId?: __string;
  }
  export type Readiness = "READY"|"NOT_READY"|"UNKNOWN"|"NOT_AUTHORIZED"|string;
  export interface ReadinessCheckOutput {
    /**
     * The Amazon Resource Name (ARN) associated with a readiness check.
     */
    ReadinessCheckArn: __stringMax256;
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName?: __stringMax64PatternAAZAZ09Z;
    /**
     * Name of the resource set to be checked.
     */
    ResourceSet: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface ReadinessCheckSummary {
    /**
     * The readiness status of this readiness check.
     */
    Readiness?: Readiness;
    /**
     * The name of a readiness check.
     */
    ReadinessCheckName?: __string;
  }
  export type ReadinessCheckTimestamp = Date;
  export interface Recommendation {
    /**
     * Text of the recommendations that are provided to make an application more recovery resilient.
     */
    RecommendationText: __string;
  }
  export interface RecoveryGroupOutput {
    /**
     * A list of a cell's Amazon Resource Names (ARNs).
     */
    Cells: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) for the recovery group.
     */
    RecoveryGroupArn: __stringMax256;
    /**
     * The name of the recovery group.
     */
    RecoveryGroupName: __stringMax64PatternAAZAZ09Z;
    /**
     * The tags associated with the recovery group.
     */
    Tags?: Tags;
  }
  export interface Resource {
    /**
     * The component identifier of the resource, generated when DNS target resource is used.
     */
    ComponentId?: __string;
    /**
     * The DNS target resource.
     */
    DnsTargetResource?: DNSTargetResource;
    /**
     * A list of recovery group Amazon Resource Names (ARNs) and cell ARNs that this resource is contained within.
     */
    ReadinessScopes?: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services resource.
     */
    ResourceArn?: __string;
  }
  export interface ResourceResult {
    /**
     * The component id of the resource.
     */
    ComponentId?: __string;
    /**
     * The time (UTC) that the resource was last checked for readiness, in ISO-8601 format.
     */
    LastCheckedTimestamp: ReadinessCheckTimestamp;
    /**
     * The readiness of a resource.
     */
    Readiness: Readiness;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn?: __string;
  }
  export interface ResourceSetOutput {
    /**
     * The Amazon Resource Name (ARN) for the resource set.
     */
    ResourceSetArn: __stringMax256;
    /**
     * The name of the resource set.
     */
    ResourceSetName: __stringMax64PatternAAZAZ09Z;
    /**
     * The resource type of the resources in the resource set. Enter one of the following values for resource type: AWS::ApiGateway::Stage, AWS::ApiGatewayV2::Stage, AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::Lambda::Function, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource
     */
    ResourceSetType: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of resource objects.
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
     * Details about the resource's readiness.
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
     * The Amazon Resource Name (ARN) for a resource.
     */
    ResourceArn: __string;
    /**
     * 
     */
    Tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type Tags = {[key: string]: __string};
  export interface TargetResource {
    /**
     * The Network Load Balancer Resource.
     */
    NLBResource?: NLBResource;
    /**
     * The Route 53 resource.
     */
    R53Resource?: R53ResourceRecord;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for a resource.
     */
    ResourceArn: __string;
    /**
     * The keys for tags you add to resources.
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateCellRequest {
    /**
     * The name of the cell.
     */
    CellName: __string;
    /**
     * A list of cell Amazon Resource Names (ARNs), which completely replaces the previous list.
     */
    Cells: __listOf__string;
  }
  export interface UpdateCellResponse {
    /**
     * The Amazon Resource Name (ARN) for the cell.
     */
    CellArn?: __stringMax256;
    /**
     * The name of the cell.
     */
    CellName?: __stringMax64PatternAAZAZ09Z;
    /**
     * A list of cell ARNs.
     */
    Cells?: __listOf__string;
    /**
     * The readiness scope for the cell, which can be a cell Amazon Resource Name (ARN) or a recovery group ARN. This is a list but currently can have only one element.
     */
    ParentReadinessScopes?: __listOf__string;
    /**
     * Tags on the resources.
     */
    Tags?: Tags;
  }
  export interface UpdateReadinessCheckRequest {
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName: __string;
    /**
     * The name of the resource set to be checked.
     */
    ResourceSetName: __string;
  }
  export interface UpdateReadinessCheckResponse {
    /**
     * The Amazon Resource Name (ARN) associated with a readiness check.
     */
    ReadinessCheckArn?: __stringMax256;
    /**
     * Name of a readiness check.
     */
    ReadinessCheckName?: __stringMax64PatternAAZAZ09Z;
    /**
     * Name of the resource set to be checked.
     */
    ResourceSet?: __stringMax64PatternAAZAZ09Z;
    Tags?: Tags;
  }
  export interface UpdateRecoveryGroupRequest {
    /**
     * A list of cell Amazon Resource Names (ARNs). This list completely replaces the previous list.
     */
    Cells: __listOf__string;
    /**
     * The name of a recovery group.
     */
    RecoveryGroupName: __string;
  }
  export interface UpdateRecoveryGroupResponse {
    /**
     * A list of a cell's Amazon Resource Names (ARNs).
     */
    Cells?: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) for the recovery group.
     */
    RecoveryGroupArn?: __stringMax256;
    /**
     * The name of the recovery group.
     */
    RecoveryGroupName?: __stringMax64PatternAAZAZ09Z;
    /**
     * The tags associated with the recovery group.
     */
    Tags?: Tags;
  }
  export interface UpdateResourceSetRequest {
    /**
     * Name of a resource set.
     */
    ResourceSetName: __string;
    /**
     * The resource type of the resources in the resource set. Enter one of the following values for resource type: AWS::ApiGateway::Stage, AWS::ApiGatewayV2::Stage, AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::Lambda::Function, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource
     */
    ResourceSetType: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of resource objects.
     */
    Resources: __listOfResource;
  }
  export interface UpdateResourceSetResponse {
    /**
     * The Amazon Resource Name (ARN) for the resource set.
     */
    ResourceSetArn?: __stringMax256;
    /**
     * The name of the resource set.
     */
    ResourceSetName?: __stringMax64PatternAAZAZ09Z;
    /**
     * The resource type of the resources in the resource set. Enter one of the following values for resource type: AWS::ApiGateway::Stage, AWS::ApiGatewayV2::Stage, AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::Lambda::Function, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource
     */
    ResourceSetType?: __stringPatternAWSAZaZ09AZaZ09;
    /**
     * A list of resource objects.
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
