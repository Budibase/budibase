import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CleanRooms extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CleanRooms.Types.ClientConfiguration)
  config: Config & CleanRooms.Types.ClientConfiguration;
  /**
   * Retrieves multiple analysis templates within a collaboration by their Amazon Resource Names (ARNs).
   */
  batchGetCollaborationAnalysisTemplate(params: CleanRooms.Types.BatchGetCollaborationAnalysisTemplateInput, callback?: (err: AWSError, data: CleanRooms.Types.BatchGetCollaborationAnalysisTemplateOutput) => void): Request<CleanRooms.Types.BatchGetCollaborationAnalysisTemplateOutput, AWSError>;
  /**
   * Retrieves multiple analysis templates within a collaboration by their Amazon Resource Names (ARNs).
   */
  batchGetCollaborationAnalysisTemplate(callback?: (err: AWSError, data: CleanRooms.Types.BatchGetCollaborationAnalysisTemplateOutput) => void): Request<CleanRooms.Types.BatchGetCollaborationAnalysisTemplateOutput, AWSError>;
  /**
   * Retrieves multiple schemas by their identifiers.
   */
  batchGetSchema(params: CleanRooms.Types.BatchGetSchemaInput, callback?: (err: AWSError, data: CleanRooms.Types.BatchGetSchemaOutput) => void): Request<CleanRooms.Types.BatchGetSchemaOutput, AWSError>;
  /**
   * Retrieves multiple schemas by their identifiers.
   */
  batchGetSchema(callback?: (err: AWSError, data: CleanRooms.Types.BatchGetSchemaOutput) => void): Request<CleanRooms.Types.BatchGetSchemaOutput, AWSError>;
  /**
   * Creates a new analysis template.
   */
  createAnalysisTemplate(params: CleanRooms.Types.CreateAnalysisTemplateInput, callback?: (err: AWSError, data: CleanRooms.Types.CreateAnalysisTemplateOutput) => void): Request<CleanRooms.Types.CreateAnalysisTemplateOutput, AWSError>;
  /**
   * Creates a new analysis template.
   */
  createAnalysisTemplate(callback?: (err: AWSError, data: CleanRooms.Types.CreateAnalysisTemplateOutput) => void): Request<CleanRooms.Types.CreateAnalysisTemplateOutput, AWSError>;
  /**
   * Creates a new collaboration.
   */
  createCollaboration(params: CleanRooms.Types.CreateCollaborationInput, callback?: (err: AWSError, data: CleanRooms.Types.CreateCollaborationOutput) => void): Request<CleanRooms.Types.CreateCollaborationOutput, AWSError>;
  /**
   * Creates a new collaboration.
   */
  createCollaboration(callback?: (err: AWSError, data: CleanRooms.Types.CreateCollaborationOutput) => void): Request<CleanRooms.Types.CreateCollaborationOutput, AWSError>;
  /**
   * Creates a new configured table resource.
   */
  createConfiguredTable(params: CleanRooms.Types.CreateConfiguredTableInput, callback?: (err: AWSError, data: CleanRooms.Types.CreateConfiguredTableOutput) => void): Request<CleanRooms.Types.CreateConfiguredTableOutput, AWSError>;
  /**
   * Creates a new configured table resource.
   */
  createConfiguredTable(callback?: (err: AWSError, data: CleanRooms.Types.CreateConfiguredTableOutput) => void): Request<CleanRooms.Types.CreateConfiguredTableOutput, AWSError>;
  /**
   * Creates a new analysis rule for a configured table. Currently, only one analysis rule can be created for a given configured table.
   */
  createConfiguredTableAnalysisRule(params: CleanRooms.Types.CreateConfiguredTableAnalysisRuleInput, callback?: (err: AWSError, data: CleanRooms.Types.CreateConfiguredTableAnalysisRuleOutput) => void): Request<CleanRooms.Types.CreateConfiguredTableAnalysisRuleOutput, AWSError>;
  /**
   * Creates a new analysis rule for a configured table. Currently, only one analysis rule can be created for a given configured table.
   */
  createConfiguredTableAnalysisRule(callback?: (err: AWSError, data: CleanRooms.Types.CreateConfiguredTableAnalysisRuleOutput) => void): Request<CleanRooms.Types.CreateConfiguredTableAnalysisRuleOutput, AWSError>;
  /**
   * Creates a configured table association. A configured table association links a configured table with a collaboration.
   */
  createConfiguredTableAssociation(params: CleanRooms.Types.CreateConfiguredTableAssociationInput, callback?: (err: AWSError, data: CleanRooms.Types.CreateConfiguredTableAssociationOutput) => void): Request<CleanRooms.Types.CreateConfiguredTableAssociationOutput, AWSError>;
  /**
   * Creates a configured table association. A configured table association links a configured table with a collaboration.
   */
  createConfiguredTableAssociation(callback?: (err: AWSError, data: CleanRooms.Types.CreateConfiguredTableAssociationOutput) => void): Request<CleanRooms.Types.CreateConfiguredTableAssociationOutput, AWSError>;
  /**
   * Creates a membership for a specific collaboration identifier and joins the collaboration.
   */
  createMembership(params: CleanRooms.Types.CreateMembershipInput, callback?: (err: AWSError, data: CleanRooms.Types.CreateMembershipOutput) => void): Request<CleanRooms.Types.CreateMembershipOutput, AWSError>;
  /**
   * Creates a membership for a specific collaboration identifier and joins the collaboration.
   */
  createMembership(callback?: (err: AWSError, data: CleanRooms.Types.CreateMembershipOutput) => void): Request<CleanRooms.Types.CreateMembershipOutput, AWSError>;
  /**
   * Deletes an analysis template.
   */
  deleteAnalysisTemplate(params: CleanRooms.Types.DeleteAnalysisTemplateInput, callback?: (err: AWSError, data: CleanRooms.Types.DeleteAnalysisTemplateOutput) => void): Request<CleanRooms.Types.DeleteAnalysisTemplateOutput, AWSError>;
  /**
   * Deletes an analysis template.
   */
  deleteAnalysisTemplate(callback?: (err: AWSError, data: CleanRooms.Types.DeleteAnalysisTemplateOutput) => void): Request<CleanRooms.Types.DeleteAnalysisTemplateOutput, AWSError>;
  /**
   * Deletes a collaboration. It can only be called by the collaboration owner.
   */
  deleteCollaboration(params: CleanRooms.Types.DeleteCollaborationInput, callback?: (err: AWSError, data: CleanRooms.Types.DeleteCollaborationOutput) => void): Request<CleanRooms.Types.DeleteCollaborationOutput, AWSError>;
  /**
   * Deletes a collaboration. It can only be called by the collaboration owner.
   */
  deleteCollaboration(callback?: (err: AWSError, data: CleanRooms.Types.DeleteCollaborationOutput) => void): Request<CleanRooms.Types.DeleteCollaborationOutput, AWSError>;
  /**
   * Deletes a configured table.
   */
  deleteConfiguredTable(params: CleanRooms.Types.DeleteConfiguredTableInput, callback?: (err: AWSError, data: CleanRooms.Types.DeleteConfiguredTableOutput) => void): Request<CleanRooms.Types.DeleteConfiguredTableOutput, AWSError>;
  /**
   * Deletes a configured table.
   */
  deleteConfiguredTable(callback?: (err: AWSError, data: CleanRooms.Types.DeleteConfiguredTableOutput) => void): Request<CleanRooms.Types.DeleteConfiguredTableOutput, AWSError>;
  /**
   * Deletes a configured table analysis rule.
   */
  deleteConfiguredTableAnalysisRule(params: CleanRooms.Types.DeleteConfiguredTableAnalysisRuleInput, callback?: (err: AWSError, data: CleanRooms.Types.DeleteConfiguredTableAnalysisRuleOutput) => void): Request<CleanRooms.Types.DeleteConfiguredTableAnalysisRuleOutput, AWSError>;
  /**
   * Deletes a configured table analysis rule.
   */
  deleteConfiguredTableAnalysisRule(callback?: (err: AWSError, data: CleanRooms.Types.DeleteConfiguredTableAnalysisRuleOutput) => void): Request<CleanRooms.Types.DeleteConfiguredTableAnalysisRuleOutput, AWSError>;
  /**
   * Deletes a configured table association.
   */
  deleteConfiguredTableAssociation(params: CleanRooms.Types.DeleteConfiguredTableAssociationInput, callback?: (err: AWSError, data: CleanRooms.Types.DeleteConfiguredTableAssociationOutput) => void): Request<CleanRooms.Types.DeleteConfiguredTableAssociationOutput, AWSError>;
  /**
   * Deletes a configured table association.
   */
  deleteConfiguredTableAssociation(callback?: (err: AWSError, data: CleanRooms.Types.DeleteConfiguredTableAssociationOutput) => void): Request<CleanRooms.Types.DeleteConfiguredTableAssociationOutput, AWSError>;
  /**
   * Removes the specified member from a collaboration. The removed member is placed in the Removed status and can't interact with the collaboration. The removed member's data is inaccessible to active members of the collaboration.
   */
  deleteMember(params: CleanRooms.Types.DeleteMemberInput, callback?: (err: AWSError, data: CleanRooms.Types.DeleteMemberOutput) => void): Request<CleanRooms.Types.DeleteMemberOutput, AWSError>;
  /**
   * Removes the specified member from a collaboration. The removed member is placed in the Removed status and can't interact with the collaboration. The removed member's data is inaccessible to active members of the collaboration.
   */
  deleteMember(callback?: (err: AWSError, data: CleanRooms.Types.DeleteMemberOutput) => void): Request<CleanRooms.Types.DeleteMemberOutput, AWSError>;
  /**
   * Deletes a specified membership. All resources under a membership must be deleted.
   */
  deleteMembership(params: CleanRooms.Types.DeleteMembershipInput, callback?: (err: AWSError, data: CleanRooms.Types.DeleteMembershipOutput) => void): Request<CleanRooms.Types.DeleteMembershipOutput, AWSError>;
  /**
   * Deletes a specified membership. All resources under a membership must be deleted.
   */
  deleteMembership(callback?: (err: AWSError, data: CleanRooms.Types.DeleteMembershipOutput) => void): Request<CleanRooms.Types.DeleteMembershipOutput, AWSError>;
  /**
   * Retrieves an analysis template.
   */
  getAnalysisTemplate(params: CleanRooms.Types.GetAnalysisTemplateInput, callback?: (err: AWSError, data: CleanRooms.Types.GetAnalysisTemplateOutput) => void): Request<CleanRooms.Types.GetAnalysisTemplateOutput, AWSError>;
  /**
   * Retrieves an analysis template.
   */
  getAnalysisTemplate(callback?: (err: AWSError, data: CleanRooms.Types.GetAnalysisTemplateOutput) => void): Request<CleanRooms.Types.GetAnalysisTemplateOutput, AWSError>;
  /**
   * Returns metadata about a collaboration.
   */
  getCollaboration(params: CleanRooms.Types.GetCollaborationInput, callback?: (err: AWSError, data: CleanRooms.Types.GetCollaborationOutput) => void): Request<CleanRooms.Types.GetCollaborationOutput, AWSError>;
  /**
   * Returns metadata about a collaboration.
   */
  getCollaboration(callback?: (err: AWSError, data: CleanRooms.Types.GetCollaborationOutput) => void): Request<CleanRooms.Types.GetCollaborationOutput, AWSError>;
  /**
   * Retrieves an analysis template within a collaboration.
   */
  getCollaborationAnalysisTemplate(params: CleanRooms.Types.GetCollaborationAnalysisTemplateInput, callback?: (err: AWSError, data: CleanRooms.Types.GetCollaborationAnalysisTemplateOutput) => void): Request<CleanRooms.Types.GetCollaborationAnalysisTemplateOutput, AWSError>;
  /**
   * Retrieves an analysis template within a collaboration.
   */
  getCollaborationAnalysisTemplate(callback?: (err: AWSError, data: CleanRooms.Types.GetCollaborationAnalysisTemplateOutput) => void): Request<CleanRooms.Types.GetCollaborationAnalysisTemplateOutput, AWSError>;
  /**
   * Retrieves a configured table.
   */
  getConfiguredTable(params: CleanRooms.Types.GetConfiguredTableInput, callback?: (err: AWSError, data: CleanRooms.Types.GetConfiguredTableOutput) => void): Request<CleanRooms.Types.GetConfiguredTableOutput, AWSError>;
  /**
   * Retrieves a configured table.
   */
  getConfiguredTable(callback?: (err: AWSError, data: CleanRooms.Types.GetConfiguredTableOutput) => void): Request<CleanRooms.Types.GetConfiguredTableOutput, AWSError>;
  /**
   * Retrieves a configured table analysis rule.
   */
  getConfiguredTableAnalysisRule(params: CleanRooms.Types.GetConfiguredTableAnalysisRuleInput, callback?: (err: AWSError, data: CleanRooms.Types.GetConfiguredTableAnalysisRuleOutput) => void): Request<CleanRooms.Types.GetConfiguredTableAnalysisRuleOutput, AWSError>;
  /**
   * Retrieves a configured table analysis rule.
   */
  getConfiguredTableAnalysisRule(callback?: (err: AWSError, data: CleanRooms.Types.GetConfiguredTableAnalysisRuleOutput) => void): Request<CleanRooms.Types.GetConfiguredTableAnalysisRuleOutput, AWSError>;
  /**
   * Retrieves a configured table association.
   */
  getConfiguredTableAssociation(params: CleanRooms.Types.GetConfiguredTableAssociationInput, callback?: (err: AWSError, data: CleanRooms.Types.GetConfiguredTableAssociationOutput) => void): Request<CleanRooms.Types.GetConfiguredTableAssociationOutput, AWSError>;
  /**
   * Retrieves a configured table association.
   */
  getConfiguredTableAssociation(callback?: (err: AWSError, data: CleanRooms.Types.GetConfiguredTableAssociationOutput) => void): Request<CleanRooms.Types.GetConfiguredTableAssociationOutput, AWSError>;
  /**
   * Retrieves a specified membership for an identifier.
   */
  getMembership(params: CleanRooms.Types.GetMembershipInput, callback?: (err: AWSError, data: CleanRooms.Types.GetMembershipOutput) => void): Request<CleanRooms.Types.GetMembershipOutput, AWSError>;
  /**
   * Retrieves a specified membership for an identifier.
   */
  getMembership(callback?: (err: AWSError, data: CleanRooms.Types.GetMembershipOutput) => void): Request<CleanRooms.Types.GetMembershipOutput, AWSError>;
  /**
   * Returns query processing metadata.
   */
  getProtectedQuery(params: CleanRooms.Types.GetProtectedQueryInput, callback?: (err: AWSError, data: CleanRooms.Types.GetProtectedQueryOutput) => void): Request<CleanRooms.Types.GetProtectedQueryOutput, AWSError>;
  /**
   * Returns query processing metadata.
   */
  getProtectedQuery(callback?: (err: AWSError, data: CleanRooms.Types.GetProtectedQueryOutput) => void): Request<CleanRooms.Types.GetProtectedQueryOutput, AWSError>;
  /**
   * Retrieves the schema for a relation within a collaboration.
   */
  getSchema(params: CleanRooms.Types.GetSchemaInput, callback?: (err: AWSError, data: CleanRooms.Types.GetSchemaOutput) => void): Request<CleanRooms.Types.GetSchemaOutput, AWSError>;
  /**
   * Retrieves the schema for a relation within a collaboration.
   */
  getSchema(callback?: (err: AWSError, data: CleanRooms.Types.GetSchemaOutput) => void): Request<CleanRooms.Types.GetSchemaOutput, AWSError>;
  /**
   * Retrieves a schema analysis rule.
   */
  getSchemaAnalysisRule(params: CleanRooms.Types.GetSchemaAnalysisRuleInput, callback?: (err: AWSError, data: CleanRooms.Types.GetSchemaAnalysisRuleOutput) => void): Request<CleanRooms.Types.GetSchemaAnalysisRuleOutput, AWSError>;
  /**
   * Retrieves a schema analysis rule.
   */
  getSchemaAnalysisRule(callback?: (err: AWSError, data: CleanRooms.Types.GetSchemaAnalysisRuleOutput) => void): Request<CleanRooms.Types.GetSchemaAnalysisRuleOutput, AWSError>;
  /**
   * Lists analysis templates that the caller owns.
   */
  listAnalysisTemplates(params: CleanRooms.Types.ListAnalysisTemplatesInput, callback?: (err: AWSError, data: CleanRooms.Types.ListAnalysisTemplatesOutput) => void): Request<CleanRooms.Types.ListAnalysisTemplatesOutput, AWSError>;
  /**
   * Lists analysis templates that the caller owns.
   */
  listAnalysisTemplates(callback?: (err: AWSError, data: CleanRooms.Types.ListAnalysisTemplatesOutput) => void): Request<CleanRooms.Types.ListAnalysisTemplatesOutput, AWSError>;
  /**
   * Lists analysis templates within a collaboration.
   */
  listCollaborationAnalysisTemplates(params: CleanRooms.Types.ListCollaborationAnalysisTemplatesInput, callback?: (err: AWSError, data: CleanRooms.Types.ListCollaborationAnalysisTemplatesOutput) => void): Request<CleanRooms.Types.ListCollaborationAnalysisTemplatesOutput, AWSError>;
  /**
   * Lists analysis templates within a collaboration.
   */
  listCollaborationAnalysisTemplates(callback?: (err: AWSError, data: CleanRooms.Types.ListCollaborationAnalysisTemplatesOutput) => void): Request<CleanRooms.Types.ListCollaborationAnalysisTemplatesOutput, AWSError>;
  /**
   * Lists collaborations the caller owns, is active in, or has been invited to.
   */
  listCollaborations(params: CleanRooms.Types.ListCollaborationsInput, callback?: (err: AWSError, data: CleanRooms.Types.ListCollaborationsOutput) => void): Request<CleanRooms.Types.ListCollaborationsOutput, AWSError>;
  /**
   * Lists collaborations the caller owns, is active in, or has been invited to.
   */
  listCollaborations(callback?: (err: AWSError, data: CleanRooms.Types.ListCollaborationsOutput) => void): Request<CleanRooms.Types.ListCollaborationsOutput, AWSError>;
  /**
   * Lists configured table associations for a membership.
   */
  listConfiguredTableAssociations(params: CleanRooms.Types.ListConfiguredTableAssociationsInput, callback?: (err: AWSError, data: CleanRooms.Types.ListConfiguredTableAssociationsOutput) => void): Request<CleanRooms.Types.ListConfiguredTableAssociationsOutput, AWSError>;
  /**
   * Lists configured table associations for a membership.
   */
  listConfiguredTableAssociations(callback?: (err: AWSError, data: CleanRooms.Types.ListConfiguredTableAssociationsOutput) => void): Request<CleanRooms.Types.ListConfiguredTableAssociationsOutput, AWSError>;
  /**
   * Lists configured tables.
   */
  listConfiguredTables(params: CleanRooms.Types.ListConfiguredTablesInput, callback?: (err: AWSError, data: CleanRooms.Types.ListConfiguredTablesOutput) => void): Request<CleanRooms.Types.ListConfiguredTablesOutput, AWSError>;
  /**
   * Lists configured tables.
   */
  listConfiguredTables(callback?: (err: AWSError, data: CleanRooms.Types.ListConfiguredTablesOutput) => void): Request<CleanRooms.Types.ListConfiguredTablesOutput, AWSError>;
  /**
   * Lists all members within a collaboration.
   */
  listMembers(params: CleanRooms.Types.ListMembersInput, callback?: (err: AWSError, data: CleanRooms.Types.ListMembersOutput) => void): Request<CleanRooms.Types.ListMembersOutput, AWSError>;
  /**
   * Lists all members within a collaboration.
   */
  listMembers(callback?: (err: AWSError, data: CleanRooms.Types.ListMembersOutput) => void): Request<CleanRooms.Types.ListMembersOutput, AWSError>;
  /**
   * Lists all memberships resources within the caller's account.
   */
  listMemberships(params: CleanRooms.Types.ListMembershipsInput, callback?: (err: AWSError, data: CleanRooms.Types.ListMembershipsOutput) => void): Request<CleanRooms.Types.ListMembershipsOutput, AWSError>;
  /**
   * Lists all memberships resources within the caller's account.
   */
  listMemberships(callback?: (err: AWSError, data: CleanRooms.Types.ListMembershipsOutput) => void): Request<CleanRooms.Types.ListMembershipsOutput, AWSError>;
  /**
   * Lists protected queries, sorted by the most recent query.
   */
  listProtectedQueries(params: CleanRooms.Types.ListProtectedQueriesInput, callback?: (err: AWSError, data: CleanRooms.Types.ListProtectedQueriesOutput) => void): Request<CleanRooms.Types.ListProtectedQueriesOutput, AWSError>;
  /**
   * Lists protected queries, sorted by the most recent query.
   */
  listProtectedQueries(callback?: (err: AWSError, data: CleanRooms.Types.ListProtectedQueriesOutput) => void): Request<CleanRooms.Types.ListProtectedQueriesOutput, AWSError>;
  /**
   * Lists the schemas for relations within a collaboration.
   */
  listSchemas(params: CleanRooms.Types.ListSchemasInput, callback?: (err: AWSError, data: CleanRooms.Types.ListSchemasOutput) => void): Request<CleanRooms.Types.ListSchemasOutput, AWSError>;
  /**
   * Lists the schemas for relations within a collaboration.
   */
  listSchemas(callback?: (err: AWSError, data: CleanRooms.Types.ListSchemasOutput) => void): Request<CleanRooms.Types.ListSchemasOutput, AWSError>;
  /**
   * Lists all of the tags that have been added to a resource.
   */
  listTagsForResource(params: CleanRooms.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: CleanRooms.Types.ListTagsForResourceOutput) => void): Request<CleanRooms.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists all of the tags that have been added to a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: CleanRooms.Types.ListTagsForResourceOutput) => void): Request<CleanRooms.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Creates a protected query that is started by Clean Rooms.
   */
  startProtectedQuery(params: CleanRooms.Types.StartProtectedQueryInput, callback?: (err: AWSError, data: CleanRooms.Types.StartProtectedQueryOutput) => void): Request<CleanRooms.Types.StartProtectedQueryOutput, AWSError>;
  /**
   * Creates a protected query that is started by Clean Rooms.
   */
  startProtectedQuery(callback?: (err: AWSError, data: CleanRooms.Types.StartProtectedQueryOutput) => void): Request<CleanRooms.Types.StartProtectedQueryOutput, AWSError>;
  /**
   * Tags a resource.
   */
  tagResource(params: CleanRooms.Types.TagResourceInput, callback?: (err: AWSError, data: CleanRooms.Types.TagResourceOutput) => void): Request<CleanRooms.Types.TagResourceOutput, AWSError>;
  /**
   * Tags a resource.
   */
  tagResource(callback?: (err: AWSError, data: CleanRooms.Types.TagResourceOutput) => void): Request<CleanRooms.Types.TagResourceOutput, AWSError>;
  /**
   * Removes a tag or list of tags from a resource.
   */
  untagResource(params: CleanRooms.Types.UntagResourceInput, callback?: (err: AWSError, data: CleanRooms.Types.UntagResourceOutput) => void): Request<CleanRooms.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes a tag or list of tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: CleanRooms.Types.UntagResourceOutput) => void): Request<CleanRooms.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates the analysis template metadata.
   */
  updateAnalysisTemplate(params: CleanRooms.Types.UpdateAnalysisTemplateInput, callback?: (err: AWSError, data: CleanRooms.Types.UpdateAnalysisTemplateOutput) => void): Request<CleanRooms.Types.UpdateAnalysisTemplateOutput, AWSError>;
  /**
   * Updates the analysis template metadata.
   */
  updateAnalysisTemplate(callback?: (err: AWSError, data: CleanRooms.Types.UpdateAnalysisTemplateOutput) => void): Request<CleanRooms.Types.UpdateAnalysisTemplateOutput, AWSError>;
  /**
   * Updates collaboration metadata and can only be called by the collaboration owner.
   */
  updateCollaboration(params: CleanRooms.Types.UpdateCollaborationInput, callback?: (err: AWSError, data: CleanRooms.Types.UpdateCollaborationOutput) => void): Request<CleanRooms.Types.UpdateCollaborationOutput, AWSError>;
  /**
   * Updates collaboration metadata and can only be called by the collaboration owner.
   */
  updateCollaboration(callback?: (err: AWSError, data: CleanRooms.Types.UpdateCollaborationOutput) => void): Request<CleanRooms.Types.UpdateCollaborationOutput, AWSError>;
  /**
   * Updates a configured table.
   */
  updateConfiguredTable(params: CleanRooms.Types.UpdateConfiguredTableInput, callback?: (err: AWSError, data: CleanRooms.Types.UpdateConfiguredTableOutput) => void): Request<CleanRooms.Types.UpdateConfiguredTableOutput, AWSError>;
  /**
   * Updates a configured table.
   */
  updateConfiguredTable(callback?: (err: AWSError, data: CleanRooms.Types.UpdateConfiguredTableOutput) => void): Request<CleanRooms.Types.UpdateConfiguredTableOutput, AWSError>;
  /**
   * Updates a configured table analysis rule.
   */
  updateConfiguredTableAnalysisRule(params: CleanRooms.Types.UpdateConfiguredTableAnalysisRuleInput, callback?: (err: AWSError, data: CleanRooms.Types.UpdateConfiguredTableAnalysisRuleOutput) => void): Request<CleanRooms.Types.UpdateConfiguredTableAnalysisRuleOutput, AWSError>;
  /**
   * Updates a configured table analysis rule.
   */
  updateConfiguredTableAnalysisRule(callback?: (err: AWSError, data: CleanRooms.Types.UpdateConfiguredTableAnalysisRuleOutput) => void): Request<CleanRooms.Types.UpdateConfiguredTableAnalysisRuleOutput, AWSError>;
  /**
   * Updates a configured table association.
   */
  updateConfiguredTableAssociation(params: CleanRooms.Types.UpdateConfiguredTableAssociationInput, callback?: (err: AWSError, data: CleanRooms.Types.UpdateConfiguredTableAssociationOutput) => void): Request<CleanRooms.Types.UpdateConfiguredTableAssociationOutput, AWSError>;
  /**
   * Updates a configured table association.
   */
  updateConfiguredTableAssociation(callback?: (err: AWSError, data: CleanRooms.Types.UpdateConfiguredTableAssociationOutput) => void): Request<CleanRooms.Types.UpdateConfiguredTableAssociationOutput, AWSError>;
  /**
   * Updates a membership.
   */
  updateMembership(params: CleanRooms.Types.UpdateMembershipInput, callback?: (err: AWSError, data: CleanRooms.Types.UpdateMembershipOutput) => void): Request<CleanRooms.Types.UpdateMembershipOutput, AWSError>;
  /**
   * Updates a membership.
   */
  updateMembership(callback?: (err: AWSError, data: CleanRooms.Types.UpdateMembershipOutput) => void): Request<CleanRooms.Types.UpdateMembershipOutput, AWSError>;
  /**
   * Updates the processing of a currently running query.
   */
  updateProtectedQuery(params: CleanRooms.Types.UpdateProtectedQueryInput, callback?: (err: AWSError, data: CleanRooms.Types.UpdateProtectedQueryOutput) => void): Request<CleanRooms.Types.UpdateProtectedQueryOutput, AWSError>;
  /**
   * Updates the processing of a currently running query.
   */
  updateProtectedQuery(callback?: (err: AWSError, data: CleanRooms.Types.UpdateProtectedQueryOutput) => void): Request<CleanRooms.Types.UpdateProtectedQueryOutput, AWSError>;
}
declare namespace CleanRooms {
  export type AccountId = string;
  export interface AggregateColumn {
    /**
     * Column names in configured table of aggregate columns.
     */
    columnNames: AggregateColumnColumnNamesList;
    /**
     * Aggregation function that can be applied to aggregate column in query.
     */
    function: AggregateFunctionName;
  }
  export type AggregateColumnColumnNamesList = AnalysisRuleColumnName[];
  export type AggregateFunctionName = "SUM"|"SUM_DISTINCT"|"COUNT"|"COUNT_DISTINCT"|"AVG"|string;
  export interface AggregationConstraint {
    /**
     * Column in aggregation constraint for which there must be a minimum number of distinct values in an output row for it to be in the query output.
     */
    columnName: AnalysisRuleColumnName;
    /**
     * The minimum number of distinct values that an output row must be an aggregation of. Minimum threshold of distinct values for a specified column that must exist in an output row for it to be in the query output.
     */
    minimum: AggregationConstraintMinimumInteger;
    /**
     * The type of aggregation the constraint allows. The only valid value is currently `COUNT_DISTINCT`.
     */
    type: AggregationType;
  }
  export type AggregationConstraintMinimumInteger = number;
  export type AggregationConstraints = AggregationConstraint[];
  export type AggregationType = "COUNT_DISTINCT"|string;
  export type AllowedColumnList = ColumnName[];
  export type AnalysisFormat = "SQL"|string;
  export type AnalysisMethod = "DIRECT_QUERY"|string;
  export interface AnalysisParameter {
    /**
     * The name of the parameter. The name must use only alphanumeric, underscore (_), or hyphen (-) characters but cannot start or end with a hyphen.
     */
    name: ParameterName;
    /**
     * The type of parameter.
     */
    type: ParameterType;
    /**
     * Optional. The default value that is applied in the analysis template. The member who can query can override this value in the query editor.
     */
    defaultValue?: ParameterValue;
  }
  export type AnalysisParameterList = AnalysisParameter[];
  export interface AnalysisRule {
    /**
     * The unique ID for the associated collaboration.
     */
    collaborationId: CollaborationIdentifier;
    /**
     * The type of analysis rule.
     */
    type: AnalysisRuleType;
    /**
     * The name for the analysis rule.
     */
    name: TableAlias;
    /**
     * The time the analysis rule was created.
     */
    createTime: Timestamp;
    /**
     * The time the analysis rule was last updated.
     */
    updateTime: Timestamp;
    /**
     * A policy that describes the associated data usage limitations.
     */
    policy: AnalysisRulePolicy;
  }
  export interface AnalysisRuleAggregation {
    /**
     * The columns that query runners are allowed to use in aggregation queries.
     */
    aggregateColumns: AnalysisRuleAggregationAggregateColumnsList;
    /**
     * Columns in configured table that can be used in join statements and/or as aggregate columns. They can never be outputted directly.
     */
    joinColumns: AnalysisRuleColumnList;
    /**
     * Control that requires member who runs query to do a join with their configured table and/or other configured table in query.
     */
    joinRequired?: JoinRequiredOption;
    /**
     * Which logical operators (if any) are to be used in an INNER JOIN match condition. Default is AND.
     */
    allowedJoinOperators?: JoinOperatorsList;
    /**
     * The columns that query runners are allowed to select, group by, or filter by.
     */
    dimensionColumns: AnalysisRuleColumnList;
    /**
     * Set of scalar functions that are allowed to be used on dimension columns and the output of aggregation of metrics.
     */
    scalarFunctions: ScalarFunctionsList;
    /**
     * Columns that must meet a specific threshold value (after an aggregation function is applied to it) for each output row to be returned.
     */
    outputConstraints: AggregationConstraints;
  }
  export type AnalysisRuleAggregationAggregateColumnsList = AggregateColumn[];
  export type AnalysisRuleColumnList = AnalysisRuleColumnName[];
  export type AnalysisRuleColumnName = string;
  export interface AnalysisRuleCustom {
    /**
     * The analysis templates that are allowed by the custom analysis rule.
     */
    allowedAnalyses: AnalysisRuleCustomAllowedAnalysesList;
    /**
     * The Amazon Web Services accounts that are allowed to query by the custom analysis rule. Required when allowedAnalyses is ANY_QUERY.
     */
    allowedAnalysisProviders?: AnalysisRuleCustomAllowedAnalysisProvidersList;
  }
  export type AnalysisRuleCustomAllowedAnalysesList = AnalysisTemplateArnOrQueryWildcard[];
  export type AnalysisRuleCustomAllowedAnalysisProvidersList = AccountId[];
  export interface AnalysisRuleList {
    /**
     * Columns that can be used to join a configured table with the table of the member who can query and other members' configured tables.
     */
    joinColumns: AnalysisRuleListJoinColumnsList;
    /**
     * The logical operators (if any) that are to be used in an INNER JOIN match condition. Default is AND.
     */
    allowedJoinOperators?: JoinOperatorsList;
    /**
     * Columns that can be listed in the output.
     */
    listColumns: AnalysisRuleColumnList;
  }
  export type AnalysisRuleListJoinColumnsList = AnalysisRuleColumnName[];
  export interface AnalysisRulePolicy {
    /**
     * Controls on the query specifications that can be run on configured table.
     */
    v1?: AnalysisRulePolicyV1;
  }
  export interface AnalysisRulePolicyV1 {
    /**
     * Analysis rule type that enables only list queries on a configured table.
     */
    list?: AnalysisRuleList;
    /**
     * Analysis rule type that enables only aggregation queries on a configured table.
     */
    aggregation?: AnalysisRuleAggregation;
    /**
     * Analysis rule type that enables custom SQL queries on a configured table.
     */
    custom?: AnalysisRuleCustom;
  }
  export type AnalysisRuleType = "AGGREGATION"|"LIST"|"CUSTOM"|string;
  export type AnalysisRuleTypeList = AnalysisRuleType[];
  export interface AnalysisSchema {
    /**
     * The tables referenced in the analysis schema.
     */
    referencedTables?: QueryTables;
  }
  export interface AnalysisSource {
    /**
     * The query text.
     */
    text?: AnalysisTemplateText;
  }
  export interface AnalysisTemplate {
    /**
     * The identifier for the analysis template.
     */
    id: AnalysisTemplateIdentifier;
    /**
     * The Amazon Resource Name (ARN) of the analysis template.
     */
    arn: AnalysisTemplateArn;
    /**
     * The unique ID for the associated collaboration of the analysis template.
     */
    collaborationId: UUID;
    /**
     * The unique ARN for the analysis template’s associated collaboration.
     */
    collaborationArn: CollaborationArn;
    /**
     * The identifier of a member who created the analysis template.
     */
    membershipId: UUID;
    /**
     * The Amazon Resource Name (ARN) of the member who created the analysis template.
     */
    membershipArn: MembershipArn;
    /**
     * The description of the analysis template.
     */
    description?: ResourceDescription;
    /**
     * The name of the analysis template.
     */
    name: ResourceAlias;
    /**
     * The time that the analysis template was created.
     */
    createTime: Timestamp;
    /**
     * The time that the analysis template was last updated.
     */
    updateTime: Timestamp;
    /**
     * The entire schema object.
     */
    schema: AnalysisSchema;
    /**
     * The format of the analysis template.
     */
    format: AnalysisFormat;
    /**
     * The source of the analysis template.
     */
    source: AnalysisSource;
    /**
     * The parameters of the analysis template.
     */
    analysisParameters?: AnalysisParameterList;
  }
  export type AnalysisTemplateArn = string;
  export type AnalysisTemplateArnList = AnalysisTemplateArn[];
  export type AnalysisTemplateArnOrQueryWildcard = string;
  export type AnalysisTemplateIdentifier = string;
  export interface AnalysisTemplateSummary {
    /**
     * The Amazon Resource Name (ARN) of the analysis template.
     */
    arn: AnalysisTemplateArn;
    /**
     * The time that the analysis template summary was created.
     */
    createTime: Timestamp;
    /**
     * The identifier of the analysis template.
     */
    id: AnalysisTemplateIdentifier;
    /**
     * The name of the analysis template. 
     */
    name: ResourceAlias;
    /**
     * The time that the analysis template summary was last updated.
     */
    updateTime: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the member who created the analysis template.
     */
    membershipArn: MembershipArn;
    /**
     * The identifier for a membership resource.
     */
    membershipId: UUID;
    /**
     * The unique ARN for the analysis template summary’s associated collaboration.
     */
    collaborationArn: CollaborationArn;
    /**
     * A unique identifier for the collaboration that the analysis template summary belongs to. Currently accepts collaboration ID.
     */
    collaborationId: UUID;
    /**
     * The description of the analysis template.
     */
    description?: ResourceDescription;
  }
  export type AnalysisTemplateSummaryList = AnalysisTemplateSummary[];
  export type AnalysisTemplateText = string;
  export interface BatchGetCollaborationAnalysisTemplateError {
    /**
     * The Amazon Resource Name (ARN) of the analysis template.
     */
    arn: AnalysisTemplateArn;
    /**
     * An error code for the error.
     */
    code: String;
    /**
     * A description of why the call failed.
     */
    message: String;
  }
  export type BatchGetCollaborationAnalysisTemplateErrorList = BatchGetCollaborationAnalysisTemplateError[];
  export interface BatchGetCollaborationAnalysisTemplateInput {
    /**
     * A unique identifier for the collaboration that the analysis templates belong to. Currently accepts collaboration ID.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * The Amazon Resource Name (ARN) associated with the analysis template within a collaboration.
     */
    analysisTemplateArns: AnalysisTemplateArnList;
  }
  export interface BatchGetCollaborationAnalysisTemplateOutput {
    /**
     * The retrieved list of analysis templates within a collaboration.
     */
    collaborationAnalysisTemplates: CollaborationAnalysisTemplateList;
    /**
     * Error reasons for collaboration analysis templates that could not be retrieved. One error is returned for every collaboration analysis template that could not be retrieved.
     */
    errors: BatchGetCollaborationAnalysisTemplateErrorList;
  }
  export interface BatchGetSchemaError {
    /**
     * An error name for the error.
     */
    name: TableAlias;
    /**
     * An error code for the error. 
     */
    code: String;
    /**
     * An error message for the error.
     */
    message: String;
  }
  export type BatchGetSchemaErrorList = BatchGetSchemaError[];
  export interface BatchGetSchemaInput {
    /**
     * A unique identifier for the collaboration that the schemas belong to. Currently accepts collaboration ID.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * The names for the schema objects to retrieve.&gt;
     */
    names: TableAliasList;
  }
  export interface BatchGetSchemaOutput {
    /**
     * The retrieved list of schemas.
     */
    schemas: SchemaList;
    /**
     * Error reasons for schemas that could not be retrieved. One error is returned for every schema that could not be retrieved.
     */
    errors: BatchGetSchemaErrorList;
  }
  export type Boolean = boolean;
  export type CleanroomsArn = string;
  export interface Collaboration {
    /**
     * The unique ID for the collaboration.
     */
    id: UUID;
    /**
     * The unique ARN for the collaboration.
     */
    arn: CollaborationArn;
    /**
     * A human-readable identifier provided by the collaboration owner. Display names are not unique.
     */
    name: CollaborationName;
    /**
     * A description of the collaboration provided by the collaboration owner.
     */
    description?: CollaborationDescription;
    /**
     * The identifier used to reference members of the collaboration. Currently only supports Amazon Web Services account ID.
     */
    creatorAccountId: AccountId;
    /**
     * A display name of the collaboration creator.
     */
    creatorDisplayName: DisplayName;
    /**
     * The time when the collaboration was created.
     */
    createTime: Timestamp;
    /**
     * The time the collaboration metadata was last updated.
     */
    updateTime: Timestamp;
    /**
     * The status of a member in a collaboration.
     */
    memberStatus: MemberStatus;
    /**
     * The unique ID for your membership within the collaboration.
     */
    membershipId?: UUID;
    /**
     * The unique ARN for your membership within the collaboration.
     */
    membershipArn?: MembershipArn;
    /**
     * The settings for client-side encryption for cryptographic computing.
     */
    dataEncryptionMetadata?: DataEncryptionMetadata;
    /**
     * An indicator as to whether query logging has been enabled or disabled for the collaboration.
     */
    queryLogStatus: CollaborationQueryLogStatus;
  }
  export interface CollaborationAnalysisTemplate {
    /**
     * The identifier of the analysis template.
     */
    id: AnalysisTemplateIdentifier;
    /**
     * The Amazon Resource Name (ARN) of the analysis template.
     */
    arn: AnalysisTemplateArn;
    /**
     * A unique identifier for the collaboration that the analysis templates belong to. Currently accepts collaboration ID.
     */
    collaborationId: UUID;
    /**
     * The unique ARN for the analysis template’s associated collaboration.
     */
    collaborationArn: CollaborationArn;
    /**
     * The description of the analysis template.
     */
    description?: ResourceDescription;
    /**
     * The identifier used to reference members of the collaboration. Currently only supports Amazon Web Services account ID.
     */
    creatorAccountId: AccountId;
    /**
     * The name of the analysis template.
     */
    name: ResourceAlias;
    /**
     * The time that the analysis template within a collaboration was created.
     */
    createTime: Timestamp;
    /**
     * The time that the analysis template in the collaboration was last updated.
     */
    updateTime: Timestamp;
    /**
     * The entire schema object.
     */
    schema: AnalysisSchema;
    /**
     * The format of the analysis template in the collaboration.
     */
    format: AnalysisFormat;
    /**
     * The source of the analysis template within a collaboration.
     */
    source: AnalysisSource;
    /**
     * The analysis parameters that have been specified in the analysis template.
     */
    analysisParameters?: AnalysisParameterList;
  }
  export type CollaborationAnalysisTemplateList = CollaborationAnalysisTemplate[];
  export interface CollaborationAnalysisTemplateSummary {
    /**
     * The Amazon Resource Name (ARN) of the analysis template.
     */
    arn: AnalysisTemplateArn;
    /**
     * The time that the summary of the analysis template in a collaboration was created.
     */
    createTime: Timestamp;
    /**
     * The identifier of the analysis template.
     */
    id: AnalysisTemplateIdentifier;
    /**
     * The name of the analysis template.
     */
    name: ResourceAlias;
    /**
     * The time that the summary of the analysis template in the collaboration was last updated.
     */
    updateTime: Timestamp;
    /**
     * The unique ARN for the analysis template’s associated collaboration.
     */
    collaborationArn: CollaborationArn;
    /**
     * A unique identifier for the collaboration that the analysis templates belong to. Currently accepts collaboration ID.
     */
    collaborationId: UUID;
    /**
     * The identifier used to reference members of the collaboration. Currently only supports Amazon Web Services account ID.
     */
    creatorAccountId: AccountId;
    /**
     * The description of the analysis template.
     */
    description?: ResourceDescription;
  }
  export type CollaborationAnalysisTemplateSummaryList = CollaborationAnalysisTemplateSummary[];
  export type CollaborationArn = string;
  export type CollaborationDescription = string;
  export type CollaborationIdentifier = string;
  export type CollaborationName = string;
  export type CollaborationQueryLogStatus = "ENABLED"|"DISABLED"|string;
  export interface CollaborationSummary {
    /**
     * The identifier for the collaboration.
     */
    id: UUID;
    /**
     * The ARN of the collaboration.
     */
    arn: CollaborationArn;
    /**
     * A human-readable identifier provided by the collaboration owner. Display names are not unique.
     */
    name: CollaborationName;
    /**
     * The identifier used to reference members of the collaboration. Currently only supports Amazon Web Services account ID.
     */
    creatorAccountId: AccountId;
    /**
     * The display name of the collaboration creator.
     */
    creatorDisplayName: DisplayName;
    /**
     * The time when the collaboration was created.
     */
    createTime: Timestamp;
    /**
     * The time the collaboration metadata was last updated.
     */
    updateTime: Timestamp;
    /**
     * The status of a member in a collaboration.
     */
    memberStatus: MemberStatus;
    /**
     * The identifier of a member in a collaboration.
     */
    membershipId?: UUID;
    /**
     * The ARN of a member in a collaboration.
     */
    membershipArn?: MembershipArn;
  }
  export type CollaborationSummaryList = CollaborationSummary[];
  export interface Column {
    /**
     * The name of the column.
     */
    name: ColumnName;
    /**
     * The type of the column.
     */
    type: ColumnTypeString;
  }
  export type ColumnList = Column[];
  export type ColumnName = string;
  export type ColumnTypeString = string;
  export interface ConfiguredTable {
    /**
     * The unique ID for the configured table.
     */
    id: UUID;
    /**
     * The unique ARN for the configured table.
     */
    arn: ConfiguredTableArn;
    /**
     * A name for the configured table.
     */
    name: DisplayName;
    /**
     * A description for the configured table.
     */
    description?: TableDescription;
    /**
     * The Glue table that this configured table represents.
     */
    tableReference: TableReference;
    /**
     * The time the configured table was created.
     */
    createTime: Timestamp;
    /**
     * The time the configured table was last updated
     */
    updateTime: Timestamp;
    /**
     * The types of analysis rules associated with this configured table. Currently, only one analysis rule may be associated with a configured table.
     */
    analysisRuleTypes: ConfiguredTableAnalysisRuleTypeList;
    /**
     * The analysis method for the configured table. The only valid value is currently `DIRECT_QUERY`.
     */
    analysisMethod: AnalysisMethod;
    /**
     * The columns within the underlying Glue table that can be utilized within collaborations.
     */
    allowedColumns: AllowedColumnList;
  }
  export interface ConfiguredTableAnalysisRule {
    /**
     * The unique ID for the configured table.
     */
    configuredTableId: UUID;
    /**
     * The unique ARN for the configured table.
     */
    configuredTableArn: ConfiguredTableArn;
    /**
     * The policy that controls SQL query rules.
     */
    policy: ConfiguredTableAnalysisRulePolicy;
    /**
     * The type of configured table analysis rule.
     */
    type: ConfiguredTableAnalysisRuleType;
    /**
     * The time the configured table analysis rule was created.
     */
    createTime: Timestamp;
    /**
     * The time the configured table analysis rule was last updated.
     */
    updateTime: Timestamp;
  }
  export interface ConfiguredTableAnalysisRulePolicy {
    /**
     * Controls on the query specifications that can be run on a configured table.
     */
    v1?: ConfiguredTableAnalysisRulePolicyV1;
  }
  export interface ConfiguredTableAnalysisRulePolicyV1 {
    /**
     * Analysis rule type that enables only list queries on a configured table.
     */
    list?: AnalysisRuleList;
    /**
     * Analysis rule type that enables only aggregation queries on a configured table.
     */
    aggregation?: AnalysisRuleAggregation;
    custom?: AnalysisRuleCustom;
  }
  export type ConfiguredTableAnalysisRuleType = "AGGREGATION"|"LIST"|"CUSTOM"|string;
  export type ConfiguredTableAnalysisRuleTypeList = ConfiguredTableAnalysisRuleType[];
  export type ConfiguredTableArn = string;
  export interface ConfiguredTableAssociation {
    /**
     * The unique ARN for the configured table association.
     */
    arn: ConfiguredTableAssociationArn;
    /**
     * The unique ID for the configured table association.
     */
    id: UUID;
    /**
     * The unique ID for the configured table that the association refers to.
     */
    configuredTableId: UUID;
    /**
     * The unique ARN for the configured table that the association refers to.
     */
    configuredTableArn: ConfiguredTableArn;
    /**
     * The unique ID for the membership this configured table association belongs to.
     */
    membershipId: UUID;
    /**
     * The unique ARN for the membership this configured table association belongs to.
     */
    membershipArn: MembershipArn;
    /**
     * The service will assume this role to access catalog metadata and query the table.
     */
    roleArn: RoleArn;
    /**
     * The name of the configured table association, in lowercase. The table is identified by this name when running protected queries against the underlying data.
     */
    name: TableAlias;
    /**
     * A description of the configured table association.
     */
    description?: TableDescription;
    /**
     * The time the configured table association was created.
     */
    createTime: Timestamp;
    /**
     * The time the configured table association was last updated.
     */
    updateTime: Timestamp;
  }
  export type ConfiguredTableAssociationArn = string;
  export type ConfiguredTableAssociationIdentifier = string;
  export interface ConfiguredTableAssociationSummary {
    /**
     * The unique configured table ID that this configured table association refers to.
     */
    configuredTableId: UUID;
    /**
     * The unique ID for the membership that the configured table association belongs to.
     */
    membershipId: MembershipIdentifier;
    /**
     * The unique ARN for the membership that the configured table association belongs to.
     */
    membershipArn: MembershipArn;
    /**
     * The name of the configured table association. The table is identified by this name when running Protected Queries against the underlying data.
     */
    name: TableAlias;
    /**
     * The time the configured table association was created.
     */
    createTime: Timestamp;
    /**
     * The time the configured table association was last updated.
     */
    updateTime: Timestamp;
    /**
     * The unique ID for the configured table association.
     */
    id: UUID;
    /**
     * The unique ARN for the configured table association.
     */
    arn: ConfiguredTableAssociationArn;
  }
  export type ConfiguredTableAssociationSummaryList = ConfiguredTableAssociationSummary[];
  export type ConfiguredTableIdentifier = string;
  export interface ConfiguredTableSummary {
    /**
     * The unique ID of the configured table.
     */
    id: ConfiguredTableIdentifier;
    /**
     * The unique ARN of the configured table.
     */
    arn: ConfiguredTableArn;
    /**
     * The name of the configured table.
     */
    name: DisplayName;
    /**
     * The time the configured table was created.
     */
    createTime: Timestamp;
    /**
     * The time the configured table was last updated.
     */
    updateTime: Timestamp;
    /**
     * The types of analysis rules associated with this configured table.
     */
    analysisRuleTypes: ConfiguredTableAnalysisRuleTypeList;
    /**
     * The analysis method for the configured tables. The only valid value is currently `DIRECT_QUERY`.
     */
    analysisMethod: AnalysisMethod;
  }
  export type ConfiguredTableSummaryList = ConfiguredTableSummary[];
  export interface CreateAnalysisTemplateInput {
    /**
     * The description of the analysis template.
     */
    description?: ResourceDescription;
    /**
     * The identifier for a membership resource.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The name of the analysis template.
     */
    name: TableAlias;
    /**
     * The format of the analysis template.
     */
    format: AnalysisFormat;
    /**
     * The information in the analysis template. Currently supports text, the query text for the analysis template.
     */
    source: AnalysisSource;
    /**
     * An optional label that you can assign to a resource when you create it. Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
     */
    tags?: TagMap;
    /**
     * The parameters of the analysis template.
     */
    analysisParameters?: AnalysisParameterList;
  }
  export interface CreateAnalysisTemplateOutput {
    /**
     * The analysis template.
     */
    analysisTemplate: AnalysisTemplate;
  }
  export interface CreateCollaborationInput {
    /**
     * A list of initial members, not including the creator. This list is immutable.
     */
    members: MemberList;
    /**
     * The display name for a collaboration.
     */
    name: CollaborationName;
    /**
     * A description of the collaboration provided by the collaboration owner.
     */
    description: CollaborationDescription;
    /**
     * The abilities granted to the collaboration creator.
     */
    creatorMemberAbilities: MemberAbilities;
    /**
     * The display name of the collaboration creator.
     */
    creatorDisplayName: DisplayName;
    /**
     * The settings for client-side encryption with Cryptographic Computing for Clean Rooms.
     */
    dataEncryptionMetadata?: DataEncryptionMetadata;
    /**
     * An indicator as to whether query logging has been enabled or disabled for the collaboration.
     */
    queryLogStatus: CollaborationQueryLogStatus;
    /**
     * An optional label that you can assign to a resource when you create it. Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
     */
    tags?: TagMap;
  }
  export interface CreateCollaborationOutput {
    /**
     * The entire created collaboration object.
     */
    collaboration: Collaboration;
  }
  export interface CreateConfiguredTableAnalysisRuleInput {
    /**
     * The identifier for the configured table to create the analysis rule for. Currently accepts the configured table ID. 
     */
    configuredTableIdentifier: ConfiguredTableIdentifier;
    /**
     * The type of analysis rule.
     */
    analysisRuleType: ConfiguredTableAnalysisRuleType;
    /**
     * The entire created configured table analysis rule object.
     */
    analysisRulePolicy: ConfiguredTableAnalysisRulePolicy;
  }
  export interface CreateConfiguredTableAnalysisRuleOutput {
    /**
     * The entire created analysis rule.
     */
    analysisRule: ConfiguredTableAnalysisRule;
  }
  export interface CreateConfiguredTableAssociationInput {
    /**
     * The name of the configured table association. This name is used to query the underlying configured table.
     */
    name: TableAlias;
    /**
     * A description for the configured table association.
     */
    description?: TableDescription;
    /**
     * A unique identifier for one of your memberships for a collaboration. The configured table is associated to the collaboration that this membership belongs to. Currently accepts a membership ID.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * A unique identifier for the configured table to be associated to. Currently accepts a configured table ID.
     */
    configuredTableIdentifier: ConfiguredTableIdentifier;
    /**
     * The service will assume this role to access catalog metadata and query the table.
     */
    roleArn: RoleArn;
    /**
     * An optional label that you can assign to a resource when you create it. Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
     */
    tags?: TagMap;
  }
  export interface CreateConfiguredTableAssociationOutput {
    /**
     * The entire configured table association object.
     */
    configuredTableAssociation: ConfiguredTableAssociation;
  }
  export interface CreateConfiguredTableInput {
    /**
     * The name of the configured table.
     */
    name: DisplayName;
    /**
     * A description for the configured table.
     */
    description?: TableDescription;
    /**
     * A reference to the Glue table being configured.
     */
    tableReference: TableReference;
    /**
     * The columns of the underlying table that can be used by collaborations or analysis rules.
     */
    allowedColumns: AllowedColumnList;
    /**
     * The analysis method for the configured tables. The only valid value is currently `DIRECT_QUERY`.
     */
    analysisMethod: AnalysisMethod;
    /**
     * An optional label that you can assign to a resource when you create it. Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
     */
    tags?: TagMap;
  }
  export interface CreateConfiguredTableOutput {
    /**
     * The created configured table.
     */
    configuredTable: ConfiguredTable;
  }
  export interface CreateMembershipInput {
    /**
     * The unique ID for the associated collaboration.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * An indicator as to whether query logging has been enabled or disabled for the collaboration.
     */
    queryLogStatus: MembershipQueryLogStatus;
    /**
     * An optional label that you can assign to a resource when you create it. Each tag consists of a key and an optional value, both of which you define. When you use tagging, you can also use tag-based access control in IAM policies to control access to this resource.
     */
    tags?: TagMap;
    /**
     * The default protected query result configuration as specified by the member who can receive results.
     */
    defaultResultConfiguration?: MembershipProtectedQueryResultConfiguration;
  }
  export interface CreateMembershipOutput {
    /**
     * The membership that was created.
     */
    membership: Membership;
  }
  export interface DataEncryptionMetadata {
    /**
     * Indicates whether encrypted tables can contain cleartext data (true) or are to cryptographically process every column (false).
     */
    allowCleartext: Boolean;
    /**
     * Indicates whether Fingerprint columns can contain duplicate entries (true) or are to contain only non-repeated values (false).
     */
    allowDuplicates: Boolean;
    /**
     * Indicates whether Fingerprint columns can be joined on any other Fingerprint column with a different name (true) or can only be joined on Fingerprint columns of the same name (false).
     */
    allowJoinsOnColumnsWithDifferentNames: Boolean;
    /**
     * Indicates whether NULL values are to be copied as NULL to encrypted tables (true) or cryptographically processed (false).
     */
    preserveNulls: Boolean;
  }
  export interface DeleteAnalysisTemplateInput {
    /**
     * The identifier for a membership resource.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The identifier for the analysis template resource.
     */
    analysisTemplateIdentifier: AnalysisTemplateIdentifier;
  }
  export interface DeleteAnalysisTemplateOutput {
  }
  export interface DeleteCollaborationInput {
    /**
     * The identifier for the collaboration.
     */
    collaborationIdentifier: CollaborationIdentifier;
  }
  export interface DeleteCollaborationOutput {
  }
  export interface DeleteConfiguredTableAnalysisRuleInput {
    /**
     * The unique identifier for the configured table that the analysis rule applies to. Currently accepts the configured table ID.
     */
    configuredTableIdentifier: ConfiguredTableIdentifier;
    /**
     * The analysis rule type to be deleted. Configured table analysis rules are uniquely identified by their configured table identifier and analysis rule type.
     */
    analysisRuleType: ConfiguredTableAnalysisRuleType;
  }
  export interface DeleteConfiguredTableAnalysisRuleOutput {
  }
  export interface DeleteConfiguredTableAssociationInput {
    /**
     * The unique ID for the configured table association to be deleted. Currently accepts the configured table ID.
     */
    configuredTableAssociationIdentifier: ConfiguredTableAssociationIdentifier;
    /**
     * A unique identifier for the membership that the configured table association belongs to. Currently accepts the membership ID.
     */
    membershipIdentifier: MembershipIdentifier;
  }
  export interface DeleteConfiguredTableAssociationOutput {
  }
  export interface DeleteConfiguredTableInput {
    /**
     * The unique ID for the configured table to delete.
     */
    configuredTableIdentifier: ConfiguredTableIdentifier;
  }
  export interface DeleteConfiguredTableOutput {
  }
  export interface DeleteMemberInput {
    /**
     * The unique identifier for the associated collaboration.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * The account ID of the member to remove.
     */
    accountId: AccountId;
  }
  export interface DeleteMemberOutput {
  }
  export interface DeleteMembershipInput {
    /**
     * The identifier for a membership resource.
     */
    membershipIdentifier: MembershipIdentifier;
  }
  export interface DeleteMembershipOutput {
  }
  export type DisplayName = string;
  export type FilterableMemberStatus = "INVITED"|"ACTIVE"|string;
  export interface GetAnalysisTemplateInput {
    /**
     * The identifier for a membership resource.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The identifier for the analysis template resource.
     */
    analysisTemplateIdentifier: AnalysisTemplateIdentifier;
  }
  export interface GetAnalysisTemplateOutput {
    /**
     * The analysis template.
     */
    analysisTemplate: AnalysisTemplate;
  }
  export interface GetCollaborationAnalysisTemplateInput {
    /**
     * A unique identifier for the collaboration that the analysis templates belong to. Currently accepts collaboration ID.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * The Amazon Resource Name (ARN) associated with the analysis template within a collaboration.
     */
    analysisTemplateArn: AnalysisTemplateArn;
  }
  export interface GetCollaborationAnalysisTemplateOutput {
    /**
     * The analysis template within a collaboration.
     */
    collaborationAnalysisTemplate: CollaborationAnalysisTemplate;
  }
  export interface GetCollaborationInput {
    /**
     * The identifier for the collaboration.
     */
    collaborationIdentifier: CollaborationIdentifier;
  }
  export interface GetCollaborationOutput {
    /**
     * The entire collaboration for this identifier.
     */
    collaboration: Collaboration;
  }
  export interface GetConfiguredTableAnalysisRuleInput {
    /**
     * The unique identifier for the configured table to retrieve. Currently accepts the configured table ID.
     */
    configuredTableIdentifier: ConfiguredTableIdentifier;
    /**
     * The analysis rule to be retrieved. Configured table analysis rules are uniquely identified by their configured table identifier and analysis rule type.
     */
    analysisRuleType: ConfiguredTableAnalysisRuleType;
  }
  export interface GetConfiguredTableAnalysisRuleOutput {
    /**
     * The entire analysis rule output.
     */
    analysisRule: ConfiguredTableAnalysisRule;
  }
  export interface GetConfiguredTableAssociationInput {
    /**
     * The unique ID for the configured table association to retrieve. Currently accepts the configured table ID.
     */
    configuredTableAssociationIdentifier: ConfiguredTableAssociationIdentifier;
    /**
     * A unique identifier for the membership that the configured table association belongs to. Currently accepts the membership ID.
     */
    membershipIdentifier: MembershipIdentifier;
  }
  export interface GetConfiguredTableAssociationOutput {
    /**
     * The entire configured table association object.
     */
    configuredTableAssociation: ConfiguredTableAssociation;
  }
  export interface GetConfiguredTableInput {
    /**
     * The unique ID for the configured table to retrieve.
     */
    configuredTableIdentifier: ConfiguredTableIdentifier;
  }
  export interface GetConfiguredTableOutput {
    /**
     * The retrieved configured table.
     */
    configuredTable: ConfiguredTable;
  }
  export interface GetMembershipInput {
    /**
     * The identifier for a membership resource.
     */
    membershipIdentifier: MembershipIdentifier;
  }
  export interface GetMembershipOutput {
    /**
     * The membership retrieved for the provided identifier.
     */
    membership: Membership;
  }
  export interface GetProtectedQueryInput {
    /**
     * The identifier for a membership in a protected query instance.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The identifier for a protected query instance.
     */
    protectedQueryIdentifier: ProtectedQueryIdentifier;
  }
  export interface GetProtectedQueryOutput {
    /**
     * The query processing metadata.
     */
    protectedQuery: ProtectedQuery;
  }
  export interface GetSchemaAnalysisRuleInput {
    /**
     * A unique identifier for the collaboration that the schema belongs to. Currently accepts a collaboration ID.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * The name of the schema to retrieve the analysis rule for.
     */
    name: TableAlias;
    /**
     * The type of the schema analysis rule to retrieve. Schema analysis rules are uniquely identified by a combination of the collaboration, the schema name, and their type.
     */
    type: AnalysisRuleType;
  }
  export interface GetSchemaAnalysisRuleOutput {
    /**
     * A specification about how data from the configured table can be used.
     */
    analysisRule: AnalysisRule;
  }
  export interface GetSchemaInput {
    /**
     * A unique identifier for the collaboration that the schema belongs to. Currently accepts a collaboration ID.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * The name of the relation to retrieve the schema for.
     */
    name: TableAlias;
  }
  export interface GetSchemaOutput {
    /**
     * The entire schema object.
     */
    schema: Schema;
  }
  export type GlueDatabaseName = string;
  export type GlueTableName = string;
  export interface GlueTableReference {
    /**
     * The name of the Glue table.
     */
    tableName: GlueTableName;
    /**
     * The name of the database the Glue table belongs to.
     */
    databaseName: GlueDatabaseName;
  }
  export type JoinOperator = "OR"|"AND"|string;
  export type JoinOperatorsList = JoinOperator[];
  export type JoinRequiredOption = "QUERY_RUNNER"|string;
  export type KeyPrefix = string;
  export interface ListAnalysisTemplatesInput {
    /**
     * The identifier for a membership resource.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call.
     */
    maxResults?: MaxResults;
  }
  export interface ListAnalysisTemplatesOutput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * Lists analysis template metadata.
     */
    analysisTemplateSummaries: AnalysisTemplateSummaryList;
  }
  export interface ListCollaborationAnalysisTemplatesInput {
    /**
     * A unique identifier for the collaboration that the analysis templates belong to. Currently accepts collaboration ID.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call.
     */
    maxResults?: MaxResults;
  }
  export interface ListCollaborationAnalysisTemplatesOutput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The metadata of the analysis template within a collaboration.
     */
    collaborationAnalysisTemplateSummaries: CollaborationAnalysisTemplateSummaryList;
  }
  export interface ListCollaborationsInput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call. Service chooses a default if it has not been set. Service may return a nextToken even if the maximum results has not been met.
     */
    maxResults?: MaxResults;
    /**
     * The caller's status in a collaboration.
     */
    memberStatus?: FilterableMemberStatus;
  }
  export interface ListCollaborationsOutput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The list of collaborations.
     */
    collaborationList: CollaborationSummaryList;
  }
  export interface ListConfiguredTableAssociationsInput {
    /**
     * A unique identifier for the membership to list configured table associations for. Currently accepts the membership ID.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call.
     */
    maxResults?: MaxResults;
  }
  export interface ListConfiguredTableAssociationsOutput {
    /**
     * The retrieved list of configured table associations.
     */
    configuredTableAssociationSummaries: ConfiguredTableAssociationSummaryList;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListConfiguredTablesInput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call.
     */
    maxResults?: MaxResults;
  }
  export interface ListConfiguredTablesOutput {
    /**
     * The configured tables listed by the request.
     */
    configuredTableSummaries: ConfiguredTableSummaryList;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListMembersInput {
    /**
     * The identifier of the collaboration in which the members are listed.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call.
     */
    maxResults?: MaxResults;
  }
  export interface ListMembersOutput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The list of members returned by the ListMembers operation.
     */
    memberSummaries: MemberSummaryList;
  }
  export interface ListMembershipsInput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call.
     */
    maxResults?: MaxResults;
    /**
     * A filter which will return only memberships in the specified status.
     */
    status?: MembershipStatus;
  }
  export interface ListMembershipsOutput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The list of memberships returned from the ListMemberships operation.
     */
    membershipSummaries: MembershipSummaryList;
  }
  export interface ListProtectedQueriesInput {
    /**
     * The identifier for the membership in the collaboration.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * A filter on the status of the protected query.
     */
    status?: ProtectedQueryStatus;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call. Service chooses a default if it has not been set. Service can return a nextToken even if the maximum results has not been met. 
     */
    maxResults?: MaxResults;
  }
  export interface ListProtectedQueriesOutput {
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * A list of protected queries.
     */
    protectedQueries: ProtectedQuerySummaryList;
  }
  export interface ListSchemasInput {
    /**
     * A unique identifier for the collaboration that the schema belongs to. Currently accepts a collaboration ID.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * If present, filter schemas by schema type. The only valid schema type is currently `TABLE`.
     */
    schemaType?: SchemaType;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum size of the results that is returned per call.
     */
    maxResults?: MaxResults;
  }
  export interface ListSchemasOutput {
    /**
     * The retrieved list of schemas.
     */
    schemaSummaries: SchemaSummaryList;
    /**
     * The token value retrieved from a previous call to access the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) associated with the resource you want to list tags on.
     */
    resourceArn: CleanroomsArn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * A map of objects specifying each key name and value.
     */
    tags: TagMap;
  }
  export type Long = number;
  export type MaxResults = number;
  export type MemberAbilities = MemberAbility[];
  export type MemberAbility = "CAN_QUERY"|"CAN_RECEIVE_RESULTS"|string;
  export type MemberList = MemberSpecification[];
  export interface MemberSpecification {
    /**
     * The identifier used to reference members of the collaboration. Currently only supports Amazon Web Services account ID.
     */
    accountId: AccountId;
    /**
     * The abilities granted to the collaboration member.
     */
    memberAbilities: MemberAbilities;
    /**
     * The member's display name.
     */
    displayName: DisplayName;
  }
  export type MemberStatus = "INVITED"|"ACTIVE"|"LEFT"|"REMOVED"|string;
  export interface MemberSummary {
    /**
     * The identifier used to reference members of the collaboration. Currently only supports Amazon Web Services account ID.
     */
    accountId: AccountId;
    /**
     * The status of the member. Valid values are `INVITED`, `ACTIVE`, `LEFT`, and `REMOVED`.
     */
    status: MemberStatus;
    /**
     * The member's display name.
     */
    displayName: DisplayName;
    /**
     * The abilities granted to the collaboration member.
     */
    abilities: MemberAbilities;
    /**
     * The time when the member was created.
     */
    createTime: Timestamp;
    /**
     * The time the member metadata was last updated.
     */
    updateTime: Timestamp;
    /**
     * The unique ID for the member's associated membership, if present.
     */
    membershipId?: UUID;
    /**
     * The unique ARN for the member's associated membership, if present.
     */
    membershipArn?: MembershipArn;
  }
  export type MemberSummaryList = MemberSummary[];
  export interface Membership {
    /**
     * The unique ID of the membership.
     */
    id: UUID;
    /**
     * The unique ARN for the membership.
     */
    arn: MembershipArn;
    /**
     * The unique ARN for the membership's associated collaboration.
     */
    collaborationArn: CollaborationArn;
    /**
     * The unique ID for the membership's collaboration.
     */
    collaborationId: UUID;
    /**
     * The identifier used to reference members of the collaboration. Currently only supports Amazon Web Services account ID.
     */
    collaborationCreatorAccountId: AccountId;
    /**
     * The display name of the collaboration creator.
     */
    collaborationCreatorDisplayName: DisplayName;
    /**
     * The name of the membership's collaboration.
     */
    collaborationName: CollaborationName;
    /**
     * The time when the membership was created.
     */
    createTime: Timestamp;
    /**
     * The time the membership metadata was last updated.
     */
    updateTime: Timestamp;
    /**
     * The status of the membership. Valid values are `ACTIVE`, `REMOVED`, and `COLLABORATION_DELETED`.
     */
    status: MembershipStatus;
    /**
     * The abilities granted to the collaboration member.
     */
    memberAbilities: MemberAbilities;
    /**
     * An indicator as to whether query logging has been enabled or disabled for the collaboration.
     */
    queryLogStatus: MembershipQueryLogStatus;
    /**
     * The default protected query result configuration as specified by the member who can receive results.
     */
    defaultResultConfiguration?: MembershipProtectedQueryResultConfiguration;
  }
  export type MembershipArn = string;
  export type MembershipIdentifier = string;
  export interface MembershipProtectedQueryOutputConfiguration {
    s3?: ProtectedQueryS3OutputConfiguration;
  }
  export interface MembershipProtectedQueryResultConfiguration {
    /**
     * Configuration for protected query results.
     */
    outputConfiguration: MembershipProtectedQueryOutputConfiguration;
    /**
     * The unique ARN for an IAM role that is used by Clean Rooms to write protected query results to the result location, given by the member who can receive results.
     */
    roleArn?: RoleArn;
  }
  export type MembershipQueryLogStatus = "ENABLED"|"DISABLED"|string;
  export type MembershipStatus = "ACTIVE"|"REMOVED"|"COLLABORATION_DELETED"|string;
  export interface MembershipSummary {
    /**
     * The unique ID for the membership's collaboration.
     */
    id: UUID;
    /**
     * The unique ARN for the membership.
     */
    arn: MembershipArn;
    /**
     * The unique ARN for the membership's associated collaboration.
     */
    collaborationArn: CollaborationArn;
    /**
     * The unique ID for the membership's collaboration.
     */
    collaborationId: CollaborationIdentifier;
    /**
     * The identifier of the Amazon Web Services principal that created the collaboration. Currently only supports Amazon Web Services account ID.
     */
    collaborationCreatorAccountId: AccountId;
    /**
     * The display name of the collaboration creator.
     */
    collaborationCreatorDisplayName: DisplayName;
    /**
     * The name for the membership's collaboration.
     */
    collaborationName: CollaborationName;
    /**
     * The time when the membership was created.
     */
    createTime: Timestamp;
    /**
     * The time the membership metadata was last updated.
     */
    updateTime: Timestamp;
    /**
     * The status of the membership. Valid values are `ACTIVE`, `REMOVED`, and `COLLABORATION_DELETED`.
     */
    status: MembershipStatus;
    /**
     * The abilities granted to the collaboration member.
     */
    memberAbilities: MemberAbilities;
  }
  export type MembershipSummaryList = MembershipSummary[];
  export type PaginationToken = string;
  export type ParameterMap = {[key: string]: ParameterValue};
  export type ParameterName = string;
  export type ParameterType = "SMALLINT"|"INTEGER"|"BIGINT"|"DECIMAL"|"REAL"|"DOUBLE_PRECISION"|"BOOLEAN"|"CHAR"|"VARCHAR"|"DATE"|"TIMESTAMP"|"TIMESTAMPTZ"|"TIME"|"TIMETZ"|"VARBYTE"|string;
  export type ParameterValue = string;
  export interface ProtectedQuery {
    /**
     * The identifier for a protected query instance.
     */
    id: UUID;
    /**
     * The identifier for the membership.
     */
    membershipId: UUID;
    /**
     * The ARN of the membership.
     */
    membershipArn: MembershipArn;
    /**
     * The time at which the protected query was created.
     */
    createTime: Timestamp;
    /**
     * The protected query SQL parameters.
     */
    sqlParameters?: ProtectedQuerySQLParameters;
    /**
     * The status of the query.
     */
    status: ProtectedQueryStatus;
    /**
     * Contains any details needed to write the query results.
     */
    resultConfiguration?: ProtectedQueryResultConfiguration;
    /**
     * Statistics about protected query execution.
     */
    statistics?: ProtectedQueryStatistics;
    /**
     * The result of the protected query.
     */
    result?: ProtectedQueryResult;
    /**
     * An error thrown by the protected query.
     */
    error?: ProtectedQueryError;
  }
  export interface ProtectedQueryError {
    /**
     * A description of why the query failed.
     */
    message: String;
    /**
     * An error code for the error.
     */
    code: String;
  }
  export type ProtectedQueryIdentifier = string;
  export type ProtectedQueryMemberOutputList = ProtectedQuerySingleMemberOutput[];
  export interface ProtectedQueryOutput {
    /**
     * If present, the output for a protected query with an `S3` output type.
     */
    s3?: ProtectedQueryS3Output;
    /**
     * The list of member Amazon Web Services account(s) that received the results of the query. 
     */
    memberList?: ProtectedQueryMemberOutputList;
  }
  export interface ProtectedQueryOutputConfiguration {
    /**
     * Required configuration for a protected query with an `S3` output type.
     */
    s3?: ProtectedQueryS3OutputConfiguration;
  }
  export interface ProtectedQueryResult {
    /**
     * The output of the protected query.
     */
    output: ProtectedQueryOutput;
  }
  export interface ProtectedQueryResultConfiguration {
    /**
     * Configuration for protected query results.
     */
    outputConfiguration: ProtectedQueryOutputConfiguration;
  }
  export interface ProtectedQueryS3Output {
    /**
     * The S3 location of the result.
     */
    location: String;
  }
  export interface ProtectedQueryS3OutputConfiguration {
    /**
     * Intended file format of the result.
     */
    resultFormat: ResultFormat;
    /**
     * The S3 bucket to unload the protected query results.
     */
    bucket: ProtectedQueryS3OutputConfigurationBucketString;
    /**
     * The S3 prefix to unload the protected query results.
     */
    keyPrefix?: KeyPrefix;
  }
  export type ProtectedQueryS3OutputConfigurationBucketString = string;
  export interface ProtectedQuerySQLParameters {
    /**
     * The query string to be submitted.
     */
    queryString?: ProtectedQuerySQLParametersQueryStringString;
    /**
     * The Amazon Resource Name (ARN) associated with the analysis template within a collaboration.
     */
    analysisTemplateArn?: AnalysisTemplateArn;
    /**
     * The protected query SQL parameters.
     */
    parameters?: ParameterMap;
  }
  export type ProtectedQuerySQLParametersQueryStringString = string;
  export interface ProtectedQuerySingleMemberOutput {
    /**
     * The Amazon Web Services account ID of the member in the collaboration who can receive results for the query.
     */
    accountId: AccountId;
  }
  export interface ProtectedQueryStatistics {
    /**
     * The duration of the Protected Query, from creation until query completion.
     */
    totalDurationInMillis?: Long;
  }
  export type ProtectedQueryStatus = "SUBMITTED"|"STARTED"|"CANCELLED"|"CANCELLING"|"FAILED"|"SUCCESS"|"TIMED_OUT"|string;
  export interface ProtectedQuerySummary {
    /**
     * The unique ID of the protected query.
     */
    id: UUID;
    /**
     * The unique ID for the membership that initiated the protected query.
     */
    membershipId: UUID;
    /**
     * The unique ARN for the membership that initiated the protected query.
     */
    membershipArn: MembershipArn;
    /**
     * The time the protected query was created.
     */
    createTime: Timestamp;
    /**
     * The status of the protected query. Value values are `SUBMITTED`, `STARTED`, `CANCELLED`, `CANCELLING`, `FAILED`, `SUCCESS`, `TIMED_OUT`.
     */
    status: ProtectedQueryStatus;
  }
  export type ProtectedQuerySummaryList = ProtectedQuerySummary[];
  export type ProtectedQueryType = "SQL"|string;
  export type QueryTables = TableAlias[];
  export type ResourceAlias = string;
  export type ResourceDescription = string;
  export type ResultFormat = "CSV"|"PARQUET"|string;
  export type RoleArn = string;
  export type ScalarFunctions = "TRUNC"|"ABS"|"CEILING"|"FLOOR"|"LN"|"LOG"|"ROUND"|"SQRT"|"CAST"|"LOWER"|"RTRIM"|"UPPER"|"COALESCE"|string;
  export type ScalarFunctionsList = ScalarFunctions[];
  export interface Schema {
    /**
     * The columns for the relation this schema represents.
     */
    columns: ColumnList;
    /**
     * The partition keys for the dataset underlying this schema.
     */
    partitionKeys: ColumnList;
    /**
     * The analysis rule types associated with the schema. Currently, only one entry is present.
     */
    analysisRuleTypes: AnalysisRuleTypeList;
    /**
     * The analysis method for the schema. The only valid value is currently DIRECT_QUERY.
     */
    analysisMethod?: AnalysisMethod;
    /**
     * The unique account ID for the Amazon Web Services account that owns the schema.
     */
    creatorAccountId: AccountId;
    /**
     * A name for the schema. The schema relation is referred to by this name when queried by a protected query.
     */
    name: TableAlias;
    /**
     * The unique ID for the collaboration that the schema belongs to.
     */
    collaborationId: UUID;
    /**
     * The unique ARN for the collaboration that the schema belongs to.
     */
    collaborationArn: CollaborationArn;
    /**
     * A description for the schema.
     */
    description: TableDescription;
    /**
     * The time the schema was created.
     */
    createTime: Timestamp;
    /**
     * The time the schema was last updated.
     */
    updateTime: Timestamp;
    /**
     * The type of schema. The only valid value is currently `TABLE`.
     */
    type: SchemaType;
  }
  export type SchemaList = Schema[];
  export interface SchemaSummary {
    /**
     * The name for the schema object.
     */
    name: TableAlias;
    /**
     * The type of schema object. The only valid schema type is currently `TABLE`.
     */
    type: SchemaType;
    /**
     * The unique account ID for the Amazon Web Services account that owns the schema.
     */
    creatorAccountId: AccountId;
    /**
     * The time the schema object was created.
     */
    createTime: Timestamp;
    /**
     * The time the schema object was last updated.
     */
    updateTime: Timestamp;
    /**
     * The unique ID for the collaboration that the schema belongs to.
     */
    collaborationId: UUID;
    /**
     * The unique ARN for the collaboration that the schema belongs to.
     */
    collaborationArn: CollaborationArn;
    /**
     * The types of analysis rules that are associated with this schema object.
     */
    analysisRuleTypes: AnalysisRuleTypeList;
    /**
     * The analysis method for the associated schema. The only valid value is currently `DIRECT_QUERY`.
     */
    analysisMethod?: AnalysisMethod;
  }
  export type SchemaSummaryList = SchemaSummary[];
  export type SchemaType = "TABLE"|string;
  export interface StartProtectedQueryInput {
    /**
     * The type of the protected query to be started.
     */
    type: ProtectedQueryType;
    /**
     * A unique identifier for the membership to run this query against. Currently accepts a membership ID.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The protected SQL query parameters.
     */
    sqlParameters: ProtectedQuerySQLParameters;
    /**
     * The details needed to write the query results.
     */
    resultConfiguration?: ProtectedQueryResultConfiguration;
  }
  export interface StartProtectedQueryOutput {
    /**
     * The protected query.
     */
    protectedQuery: ProtectedQuery;
  }
  export type String = string;
  export type TableAlias = string;
  export type TableAliasList = TableAlias[];
  export type TableDescription = string;
  export interface TableReference {
    /**
     * If present, a reference to the Glue table referred to by this table reference.
     */
    glue?: GlueTableReference;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) associated with the resource you want to tag.
     */
    resourceArn: CleanroomsArn;
    /**
     * A map of objects specifying each key name and value.
     */
    tags: TagMap;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type TargetProtectedQueryStatus = "CANCELLED"|string;
  export type Timestamp = Date;
  export type UUID = string;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) associated with the resource you want to remove the tag from.
     */
    resourceArn: CleanroomsArn;
    /**
     * A list of key names of tags to be removed.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateAnalysisTemplateInput {
    /**
     * The identifier for a membership resource.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The identifier for the analysis template resource.
     */
    analysisTemplateIdentifier: AnalysisTemplateIdentifier;
    /**
     * A new description for the analysis template.
     */
    description?: ResourceDescription;
  }
  export interface UpdateAnalysisTemplateOutput {
    /**
     * The analysis template.
     */
    analysisTemplate: AnalysisTemplate;
  }
  export interface UpdateCollaborationInput {
    /**
     * The identifier for the collaboration.
     */
    collaborationIdentifier: CollaborationIdentifier;
    /**
     * A human-readable identifier provided by the collaboration owner. Display names are not unique.
     */
    name?: CollaborationName;
    /**
     * A description of the collaboration.
     */
    description?: CollaborationDescription;
  }
  export interface UpdateCollaborationOutput {
    /**
     * The entire collaboration that has been updated.
     */
    collaboration: Collaboration;
  }
  export interface UpdateConfiguredTableAnalysisRuleInput {
    /**
     * The unique identifier for the configured table that the analysis rule applies to. Currently accepts the configured table ID.
     */
    configuredTableIdentifier: ConfiguredTableIdentifier;
    /**
     * The analysis rule type to be updated. Configured table analysis rules are uniquely identified by their configured table identifier and analysis rule type.
     */
    analysisRuleType: ConfiguredTableAnalysisRuleType;
    /**
     * The new analysis rule policy for the configured table analysis rule.
     */
    analysisRulePolicy: ConfiguredTableAnalysisRulePolicy;
  }
  export interface UpdateConfiguredTableAnalysisRuleOutput {
    /**
     * The entire updated analysis rule.
     */
    analysisRule: ConfiguredTableAnalysisRule;
  }
  export interface UpdateConfiguredTableAssociationInput {
    /**
     * The unique identifier for the configured table association to update. Currently accepts the configured table association ID.
     */
    configuredTableAssociationIdentifier: ConfiguredTableAssociationIdentifier;
    /**
     * The unique ID for the membership that the configured table association belongs to.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * A new description for the configured table association.
     */
    description?: TableDescription;
    /**
     * The service will assume this role to access catalog metadata and query the table.
     */
    roleArn?: RoleArn;
  }
  export interface UpdateConfiguredTableAssociationOutput {
    /**
     * The entire updated configured table association.
     */
    configuredTableAssociation: ConfiguredTableAssociation;
  }
  export interface UpdateConfiguredTableInput {
    /**
     * The identifier for the configured table to update. Currently accepts the configured table ID.
     */
    configuredTableIdentifier: ConfiguredTableIdentifier;
    /**
     * A new name for the configured table.
     */
    name?: DisplayName;
    /**
     * A new description for the configured table.
     */
    description?: TableDescription;
  }
  export interface UpdateConfiguredTableOutput {
    /**
     * The updated configured table.
     */
    configuredTable: ConfiguredTable;
  }
  export interface UpdateMembershipInput {
    /**
     * The unique identifier of the membership.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * An indicator as to whether query logging has been enabled or disabled for the collaboration.
     */
    queryLogStatus?: MembershipQueryLogStatus;
    /**
     * The default protected query result configuration as specified by the member who can receive results.
     */
    defaultResultConfiguration?: MembershipProtectedQueryResultConfiguration;
  }
  export interface UpdateMembershipOutput {
    membership: Membership;
  }
  export interface UpdateProtectedQueryInput {
    /**
     * The identifier for a member of a protected query instance.
     */
    membershipIdentifier: MembershipIdentifier;
    /**
     * The identifier for a protected query instance.
     */
    protectedQueryIdentifier: ProtectedQueryIdentifier;
    /**
     * The target status of a query. Used to update the execution status of a currently running query.
     */
    targetStatus: TargetProtectedQueryStatus;
  }
  export interface UpdateProtectedQueryOutput {
    /**
     * The protected query output.
     */
    protectedQuery: ProtectedQuery;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-02-17"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CleanRooms client.
   */
  export import Types = CleanRooms;
}
export = CleanRooms;
