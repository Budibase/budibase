import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Billingconductor extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Billingconductor.Types.ClientConfiguration)
  config: Config & Billingconductor.Types.ClientConfiguration;
  /**
   * Connects an array of account IDs in a consolidated billing family to a predefined billing group. The account IDs must be a part of the consolidated billing family during the current month, and not already associated with another billing group. The maximum number of accounts that can be associated in one call is 30. 
   */
  associateAccounts(params: Billingconductor.Types.AssociateAccountsInput, callback?: (err: AWSError, data: Billingconductor.Types.AssociateAccountsOutput) => void): Request<Billingconductor.Types.AssociateAccountsOutput, AWSError>;
  /**
   * Connects an array of account IDs in a consolidated billing family to a predefined billing group. The account IDs must be a part of the consolidated billing family during the current month, and not already associated with another billing group. The maximum number of accounts that can be associated in one call is 30. 
   */
  associateAccounts(callback?: (err: AWSError, data: Billingconductor.Types.AssociateAccountsOutput) => void): Request<Billingconductor.Types.AssociateAccountsOutput, AWSError>;
  /**
   * Connects an array of PricingRuleArns to a defined PricingPlan. The maximum number PricingRuleArn that can be associated in one call is 30. 
   */
  associatePricingRules(params: Billingconductor.Types.AssociatePricingRulesInput, callback?: (err: AWSError, data: Billingconductor.Types.AssociatePricingRulesOutput) => void): Request<Billingconductor.Types.AssociatePricingRulesOutput, AWSError>;
  /**
   * Connects an array of PricingRuleArns to a defined PricingPlan. The maximum number PricingRuleArn that can be associated in one call is 30. 
   */
  associatePricingRules(callback?: (err: AWSError, data: Billingconductor.Types.AssociatePricingRulesOutput) => void): Request<Billingconductor.Types.AssociatePricingRulesOutput, AWSError>;
  /**
   *  Associates a batch of resources to a percentage custom line item. 
   */
  batchAssociateResourcesToCustomLineItem(params: Billingconductor.Types.BatchAssociateResourcesToCustomLineItemInput, callback?: (err: AWSError, data: Billingconductor.Types.BatchAssociateResourcesToCustomLineItemOutput) => void): Request<Billingconductor.Types.BatchAssociateResourcesToCustomLineItemOutput, AWSError>;
  /**
   *  Associates a batch of resources to a percentage custom line item. 
   */
  batchAssociateResourcesToCustomLineItem(callback?: (err: AWSError, data: Billingconductor.Types.BatchAssociateResourcesToCustomLineItemOutput) => void): Request<Billingconductor.Types.BatchAssociateResourcesToCustomLineItemOutput, AWSError>;
  /**
   *  Disassociates a batch of resources from a percentage custom line item. 
   */
  batchDisassociateResourcesFromCustomLineItem(params: Billingconductor.Types.BatchDisassociateResourcesFromCustomLineItemInput, callback?: (err: AWSError, data: Billingconductor.Types.BatchDisassociateResourcesFromCustomLineItemOutput) => void): Request<Billingconductor.Types.BatchDisassociateResourcesFromCustomLineItemOutput, AWSError>;
  /**
   *  Disassociates a batch of resources from a percentage custom line item. 
   */
  batchDisassociateResourcesFromCustomLineItem(callback?: (err: AWSError, data: Billingconductor.Types.BatchDisassociateResourcesFromCustomLineItemOutput) => void): Request<Billingconductor.Types.BatchDisassociateResourcesFromCustomLineItemOutput, AWSError>;
  /**
   *  Creates a billing group that resembles a consolidated billing family that Amazon Web Services charges, based off of the predefined pricing plan computation. 
   */
  createBillingGroup(params: Billingconductor.Types.CreateBillingGroupInput, callback?: (err: AWSError, data: Billingconductor.Types.CreateBillingGroupOutput) => void): Request<Billingconductor.Types.CreateBillingGroupOutput, AWSError>;
  /**
   *  Creates a billing group that resembles a consolidated billing family that Amazon Web Services charges, based off of the predefined pricing plan computation. 
   */
  createBillingGroup(callback?: (err: AWSError, data: Billingconductor.Types.CreateBillingGroupOutput) => void): Request<Billingconductor.Types.CreateBillingGroupOutput, AWSError>;
  /**
   *  Creates a custom line item that can be used to create a one-time fixed charge that can be applied to a single billing group for the current or previous billing period. The one-time fixed charge is either a fee or discount. 
   */
  createCustomLineItem(params: Billingconductor.Types.CreateCustomLineItemInput, callback?: (err: AWSError, data: Billingconductor.Types.CreateCustomLineItemOutput) => void): Request<Billingconductor.Types.CreateCustomLineItemOutput, AWSError>;
  /**
   *  Creates a custom line item that can be used to create a one-time fixed charge that can be applied to a single billing group for the current or previous billing period. The one-time fixed charge is either a fee or discount. 
   */
  createCustomLineItem(callback?: (err: AWSError, data: Billingconductor.Types.CreateCustomLineItemOutput) => void): Request<Billingconductor.Types.CreateCustomLineItemOutput, AWSError>;
  /**
   * Creates a pricing plan that is used for computing Amazon Web Services charges for billing groups. 
   */
  createPricingPlan(params: Billingconductor.Types.CreatePricingPlanInput, callback?: (err: AWSError, data: Billingconductor.Types.CreatePricingPlanOutput) => void): Request<Billingconductor.Types.CreatePricingPlanOutput, AWSError>;
  /**
   * Creates a pricing plan that is used for computing Amazon Web Services charges for billing groups. 
   */
  createPricingPlan(callback?: (err: AWSError, data: Billingconductor.Types.CreatePricingPlanOutput) => void): Request<Billingconductor.Types.CreatePricingPlanOutput, AWSError>;
  /**
   *  Creates a pricing rule can be associated to a pricing plan, or a set of pricing plans. 
   */
  createPricingRule(params: Billingconductor.Types.CreatePricingRuleInput, callback?: (err: AWSError, data: Billingconductor.Types.CreatePricingRuleOutput) => void): Request<Billingconductor.Types.CreatePricingRuleOutput, AWSError>;
  /**
   *  Creates a pricing rule can be associated to a pricing plan, or a set of pricing plans. 
   */
  createPricingRule(callback?: (err: AWSError, data: Billingconductor.Types.CreatePricingRuleOutput) => void): Request<Billingconductor.Types.CreatePricingRuleOutput, AWSError>;
  /**
   *  Deletes a billing group. 
   */
  deleteBillingGroup(params: Billingconductor.Types.DeleteBillingGroupInput, callback?: (err: AWSError, data: Billingconductor.Types.DeleteBillingGroupOutput) => void): Request<Billingconductor.Types.DeleteBillingGroupOutput, AWSError>;
  /**
   *  Deletes a billing group. 
   */
  deleteBillingGroup(callback?: (err: AWSError, data: Billingconductor.Types.DeleteBillingGroupOutput) => void): Request<Billingconductor.Types.DeleteBillingGroupOutput, AWSError>;
  /**
   *  Deletes the custom line item identified by the given ARN in the current, or previous billing period. 
   */
  deleteCustomLineItem(params: Billingconductor.Types.DeleteCustomLineItemInput, callback?: (err: AWSError, data: Billingconductor.Types.DeleteCustomLineItemOutput) => void): Request<Billingconductor.Types.DeleteCustomLineItemOutput, AWSError>;
  /**
   *  Deletes the custom line item identified by the given ARN in the current, or previous billing period. 
   */
  deleteCustomLineItem(callback?: (err: AWSError, data: Billingconductor.Types.DeleteCustomLineItemOutput) => void): Request<Billingconductor.Types.DeleteCustomLineItemOutput, AWSError>;
  /**
   * Deletes a pricing plan. The pricing plan must not be associated with any billing groups to delete successfully.
   */
  deletePricingPlan(params: Billingconductor.Types.DeletePricingPlanInput, callback?: (err: AWSError, data: Billingconductor.Types.DeletePricingPlanOutput) => void): Request<Billingconductor.Types.DeletePricingPlanOutput, AWSError>;
  /**
   * Deletes a pricing plan. The pricing plan must not be associated with any billing groups to delete successfully.
   */
  deletePricingPlan(callback?: (err: AWSError, data: Billingconductor.Types.DeletePricingPlanOutput) => void): Request<Billingconductor.Types.DeletePricingPlanOutput, AWSError>;
  /**
   *  Deletes the pricing rule that's identified by the input Amazon Resource Name (ARN). 
   */
  deletePricingRule(params: Billingconductor.Types.DeletePricingRuleInput, callback?: (err: AWSError, data: Billingconductor.Types.DeletePricingRuleOutput) => void): Request<Billingconductor.Types.DeletePricingRuleOutput, AWSError>;
  /**
   *  Deletes the pricing rule that's identified by the input Amazon Resource Name (ARN). 
   */
  deletePricingRule(callback?: (err: AWSError, data: Billingconductor.Types.DeletePricingRuleOutput) => void): Request<Billingconductor.Types.DeletePricingRuleOutput, AWSError>;
  /**
   * Removes the specified list of account IDs from the given billing group. 
   */
  disassociateAccounts(params: Billingconductor.Types.DisassociateAccountsInput, callback?: (err: AWSError, data: Billingconductor.Types.DisassociateAccountsOutput) => void): Request<Billingconductor.Types.DisassociateAccountsOutput, AWSError>;
  /**
   * Removes the specified list of account IDs from the given billing group. 
   */
  disassociateAccounts(callback?: (err: AWSError, data: Billingconductor.Types.DisassociateAccountsOutput) => void): Request<Billingconductor.Types.DisassociateAccountsOutput, AWSError>;
  /**
   *  Disassociates a list of pricing rules from a pricing plan. 
   */
  disassociatePricingRules(params: Billingconductor.Types.DisassociatePricingRulesInput, callback?: (err: AWSError, data: Billingconductor.Types.DisassociatePricingRulesOutput) => void): Request<Billingconductor.Types.DisassociatePricingRulesOutput, AWSError>;
  /**
   *  Disassociates a list of pricing rules from a pricing plan. 
   */
  disassociatePricingRules(callback?: (err: AWSError, data: Billingconductor.Types.DisassociatePricingRulesOutput) => void): Request<Billingconductor.Types.DisassociatePricingRulesOutput, AWSError>;
  /**
   *  This is a paginated call to list linked accounts that are linked to the payer account for the specified time period. If no information is provided, the current billing period is used. The response will optionally include the billing group that's associated with the linked account.
   */
  listAccountAssociations(params: Billingconductor.Types.ListAccountAssociationsInput, callback?: (err: AWSError, data: Billingconductor.Types.ListAccountAssociationsOutput) => void): Request<Billingconductor.Types.ListAccountAssociationsOutput, AWSError>;
  /**
   *  This is a paginated call to list linked accounts that are linked to the payer account for the specified time period. If no information is provided, the current billing period is used. The response will optionally include the billing group that's associated with the linked account.
   */
  listAccountAssociations(callback?: (err: AWSError, data: Billingconductor.Types.ListAccountAssociationsOutput) => void): Request<Billingconductor.Types.ListAccountAssociationsOutput, AWSError>;
  /**
   * A paginated call to retrieve a summary report of actual Amazon Web Services charges and the calculated Amazon Web Services charges based on the associated pricing plan of a billing group.
   */
  listBillingGroupCostReports(params: Billingconductor.Types.ListBillingGroupCostReportsInput, callback?: (err: AWSError, data: Billingconductor.Types.ListBillingGroupCostReportsOutput) => void): Request<Billingconductor.Types.ListBillingGroupCostReportsOutput, AWSError>;
  /**
   * A paginated call to retrieve a summary report of actual Amazon Web Services charges and the calculated Amazon Web Services charges based on the associated pricing plan of a billing group.
   */
  listBillingGroupCostReports(callback?: (err: AWSError, data: Billingconductor.Types.ListBillingGroupCostReportsOutput) => void): Request<Billingconductor.Types.ListBillingGroupCostReportsOutput, AWSError>;
  /**
   * A paginated call to retrieve a list of billing groups for the given billing period. If you don't provide a billing group, the current billing period is used.
   */
  listBillingGroups(params: Billingconductor.Types.ListBillingGroupsInput, callback?: (err: AWSError, data: Billingconductor.Types.ListBillingGroupsOutput) => void): Request<Billingconductor.Types.ListBillingGroupsOutput, AWSError>;
  /**
   * A paginated call to retrieve a list of billing groups for the given billing period. If you don't provide a billing group, the current billing period is used.
   */
  listBillingGroups(callback?: (err: AWSError, data: Billingconductor.Types.ListBillingGroupsOutput) => void): Request<Billingconductor.Types.ListBillingGroupsOutput, AWSError>;
  /**
   * A paginated call to get a list of all custom line item versions.
   */
  listCustomLineItemVersions(params: Billingconductor.Types.ListCustomLineItemVersionsInput, callback?: (err: AWSError, data: Billingconductor.Types.ListCustomLineItemVersionsOutput) => void): Request<Billingconductor.Types.ListCustomLineItemVersionsOutput, AWSError>;
  /**
   * A paginated call to get a list of all custom line item versions.
   */
  listCustomLineItemVersions(callback?: (err: AWSError, data: Billingconductor.Types.ListCustomLineItemVersionsOutput) => void): Request<Billingconductor.Types.ListCustomLineItemVersionsOutput, AWSError>;
  /**
   *  A paginated call to get a list of all custom line items (FFLIs) for the given billing period. If you don't provide a billing period, the current billing period is used. 
   */
  listCustomLineItems(params: Billingconductor.Types.ListCustomLineItemsInput, callback?: (err: AWSError, data: Billingconductor.Types.ListCustomLineItemsOutput) => void): Request<Billingconductor.Types.ListCustomLineItemsOutput, AWSError>;
  /**
   *  A paginated call to get a list of all custom line items (FFLIs) for the given billing period. If you don't provide a billing period, the current billing period is used. 
   */
  listCustomLineItems(callback?: (err: AWSError, data: Billingconductor.Types.ListCustomLineItemsOutput) => void): Request<Billingconductor.Types.ListCustomLineItemsOutput, AWSError>;
  /**
   * A paginated call to get pricing plans for the given billing period. If you don't provide a billing period, the current billing period is used. 
   */
  listPricingPlans(params: Billingconductor.Types.ListPricingPlansInput, callback?: (err: AWSError, data: Billingconductor.Types.ListPricingPlansOutput) => void): Request<Billingconductor.Types.ListPricingPlansOutput, AWSError>;
  /**
   * A paginated call to get pricing plans for the given billing period. If you don't provide a billing period, the current billing period is used. 
   */
  listPricingPlans(callback?: (err: AWSError, data: Billingconductor.Types.ListPricingPlansOutput) => void): Request<Billingconductor.Types.ListPricingPlansOutput, AWSError>;
  /**
   *  A list of the pricing plans that are associated with a pricing rule. 
   */
  listPricingPlansAssociatedWithPricingRule(params: Billingconductor.Types.ListPricingPlansAssociatedWithPricingRuleInput, callback?: (err: AWSError, data: Billingconductor.Types.ListPricingPlansAssociatedWithPricingRuleOutput) => void): Request<Billingconductor.Types.ListPricingPlansAssociatedWithPricingRuleOutput, AWSError>;
  /**
   *  A list of the pricing plans that are associated with a pricing rule. 
   */
  listPricingPlansAssociatedWithPricingRule(callback?: (err: AWSError, data: Billingconductor.Types.ListPricingPlansAssociatedWithPricingRuleOutput) => void): Request<Billingconductor.Types.ListPricingPlansAssociatedWithPricingRuleOutput, AWSError>;
  /**
   *  Describes a pricing rule that can be associated to a pricing plan, or set of pricing plans. 
   */
  listPricingRules(params: Billingconductor.Types.ListPricingRulesInput, callback?: (err: AWSError, data: Billingconductor.Types.ListPricingRulesOutput) => void): Request<Billingconductor.Types.ListPricingRulesOutput, AWSError>;
  /**
   *  Describes a pricing rule that can be associated to a pricing plan, or set of pricing plans. 
   */
  listPricingRules(callback?: (err: AWSError, data: Billingconductor.Types.ListPricingRulesOutput) => void): Request<Billingconductor.Types.ListPricingRulesOutput, AWSError>;
  /**
   *  Lists the pricing rules that are associated with a pricing plan. 
   */
  listPricingRulesAssociatedToPricingPlan(params: Billingconductor.Types.ListPricingRulesAssociatedToPricingPlanInput, callback?: (err: AWSError, data: Billingconductor.Types.ListPricingRulesAssociatedToPricingPlanOutput) => void): Request<Billingconductor.Types.ListPricingRulesAssociatedToPricingPlanOutput, AWSError>;
  /**
   *  Lists the pricing rules that are associated with a pricing plan. 
   */
  listPricingRulesAssociatedToPricingPlan(callback?: (err: AWSError, data: Billingconductor.Types.ListPricingRulesAssociatedToPricingPlanOutput) => void): Request<Billingconductor.Types.ListPricingRulesAssociatedToPricingPlanOutput, AWSError>;
  /**
   *  List the resources that are associated to a custom line item. 
   */
  listResourcesAssociatedToCustomLineItem(params: Billingconductor.Types.ListResourcesAssociatedToCustomLineItemInput, callback?: (err: AWSError, data: Billingconductor.Types.ListResourcesAssociatedToCustomLineItemOutput) => void): Request<Billingconductor.Types.ListResourcesAssociatedToCustomLineItemOutput, AWSError>;
  /**
   *  List the resources that are associated to a custom line item. 
   */
  listResourcesAssociatedToCustomLineItem(callback?: (err: AWSError, data: Billingconductor.Types.ListResourcesAssociatedToCustomLineItemOutput) => void): Request<Billingconductor.Types.ListResourcesAssociatedToCustomLineItemOutput, AWSError>;
  /**
   *  A list the tags for a resource. 
   */
  listTagsForResource(params: Billingconductor.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Billingconductor.Types.ListTagsForResourceResponse) => void): Request<Billingconductor.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  A list the tags for a resource. 
   */
  listTagsForResource(callback?: (err: AWSError, data: Billingconductor.Types.ListTagsForResourceResponse) => void): Request<Billingconductor.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. 
   */
  tagResource(params: Billingconductor.Types.TagResourceRequest, callback?: (err: AWSError, data: Billingconductor.Types.TagResourceResponse) => void): Request<Billingconductor.Types.TagResourceResponse, AWSError>;
  /**
   *  Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. 
   */
  tagResource(callback?: (err: AWSError, data: Billingconductor.Types.TagResourceResponse) => void): Request<Billingconductor.Types.TagResourceResponse, AWSError>;
  /**
   *  Deletes specified tags from a resource. 
   */
  untagResource(params: Billingconductor.Types.UntagResourceRequest, callback?: (err: AWSError, data: Billingconductor.Types.UntagResourceResponse) => void): Request<Billingconductor.Types.UntagResourceResponse, AWSError>;
  /**
   *  Deletes specified tags from a resource. 
   */
  untagResource(callback?: (err: AWSError, data: Billingconductor.Types.UntagResourceResponse) => void): Request<Billingconductor.Types.UntagResourceResponse, AWSError>;
  /**
   * This updates an existing billing group. 
   */
  updateBillingGroup(params: Billingconductor.Types.UpdateBillingGroupInput, callback?: (err: AWSError, data: Billingconductor.Types.UpdateBillingGroupOutput) => void): Request<Billingconductor.Types.UpdateBillingGroupOutput, AWSError>;
  /**
   * This updates an existing billing group. 
   */
  updateBillingGroup(callback?: (err: AWSError, data: Billingconductor.Types.UpdateBillingGroupOutput) => void): Request<Billingconductor.Types.UpdateBillingGroupOutput, AWSError>;
  /**
   *  Update an existing custom line item in the current or previous billing period. 
   */
  updateCustomLineItem(params: Billingconductor.Types.UpdateCustomLineItemInput, callback?: (err: AWSError, data: Billingconductor.Types.UpdateCustomLineItemOutput) => void): Request<Billingconductor.Types.UpdateCustomLineItemOutput, AWSError>;
  /**
   *  Update an existing custom line item in the current or previous billing period. 
   */
  updateCustomLineItem(callback?: (err: AWSError, data: Billingconductor.Types.UpdateCustomLineItemOutput) => void): Request<Billingconductor.Types.UpdateCustomLineItemOutput, AWSError>;
  /**
   * This updates an existing pricing plan. 
   */
  updatePricingPlan(params: Billingconductor.Types.UpdatePricingPlanInput, callback?: (err: AWSError, data: Billingconductor.Types.UpdatePricingPlanOutput) => void): Request<Billingconductor.Types.UpdatePricingPlanOutput, AWSError>;
  /**
   * This updates an existing pricing plan. 
   */
  updatePricingPlan(callback?: (err: AWSError, data: Billingconductor.Types.UpdatePricingPlanOutput) => void): Request<Billingconductor.Types.UpdatePricingPlanOutput, AWSError>;
  /**
   *  Updates an existing pricing rule. 
   */
  updatePricingRule(params: Billingconductor.Types.UpdatePricingRuleInput, callback?: (err: AWSError, data: Billingconductor.Types.UpdatePricingRuleOutput) => void): Request<Billingconductor.Types.UpdatePricingRuleOutput, AWSError>;
  /**
   *  Updates an existing pricing rule. 
   */
  updatePricingRule(callback?: (err: AWSError, data: Billingconductor.Types.UpdatePricingRuleOutput) => void): Request<Billingconductor.Types.UpdatePricingRuleOutput, AWSError>;
}
declare namespace Billingconductor {
  export type AWSCost = string;
  export type AccountAssociationsList = AccountAssociationsListElement[];
  export interface AccountAssociationsListElement {
    /**
     * The associating array of account IDs.
     */
    AccountId?: AccountId;
    /**
     * The Billing Group Arn that the linked account is associated to.
     */
    BillingGroupArn?: BillingGroupArn;
    /**
     * The Amazon Web Services account name.
     */
    AccountName?: AccountName;
    /**
     * The Amazon Web Services account email.
     */
    AccountEmail?: AccountEmail;
  }
  export type AccountEmail = string;
  export interface AccountGrouping {
    /**
     * The account IDs that make up the billing group. Account IDs must be a part of the consolidated billing family, and not associated with another billing group.
     */
    LinkedAccountIds: AccountIdList;
    /**
     * Specifies if this billing group will automatically associate newly added Amazon Web Services accounts that join your consolidated billing family.
     */
    AutoAssociate?: Boolean;
  }
  export type AccountId = string;
  export type AccountIdFilterList = AccountId[];
  export type AccountIdList = AccountId[];
  export type AccountName = string;
  export type Arn = string;
  export interface AssociateAccountsInput {
    /**
     *  The Amazon Resource Name (ARN) of the billing group that associates the array of account IDs. 
     */
    Arn: BillingGroupArn;
    /**
     *  The associating array of account IDs. 
     */
    AccountIds: AccountIdList;
  }
  export interface AssociateAccountsOutput {
    /**
     *  The Amazon Resource Name (ARN) of the billing group that associates the array of account IDs. 
     */
    Arn?: BillingGroupArn;
  }
  export interface AssociatePricingRulesInput {
    /**
     *  The PricingPlanArn that the PricingRuleArns are associated with. 
     */
    Arn: PricingPlanArn;
    /**
     *  The PricingRuleArns that are associated with the Pricing Plan. 
     */
    PricingRuleArns: PricingRuleArnsNonEmptyInput;
  }
  export interface AssociatePricingRulesOutput {
    /**
     *  The PricingPlanArn that the PricingRuleArns are associated with. 
     */
    Arn?: PricingPlanArn;
  }
  export interface AssociateResourceError {
    /**
     * The reason why the resource association failed.
     */
    Message?: String;
    /**
     * A static error code that's used to classify the type of failure.
     */
    Reason?: AssociateResourceErrorReason;
  }
  export type AssociateResourceErrorReason = "INVALID_ARN"|"SERVICE_LIMIT_EXCEEDED"|"ILLEGAL_CUSTOMLINEITEM"|"INTERNAL_SERVER_EXCEPTION"|"INVALID_BILLING_PERIOD_RANGE"|string;
  export interface AssociateResourceResponseElement {
    /**
     * The resource ARN that was associated to the custom line item.
     */
    Arn?: CustomLineItemAssociationElement;
    /**
     * An AssociateResourceError that will populate if the resource association fails.
     */
    Error?: AssociateResourceError;
  }
  export type AssociateResourcesResponseList = AssociateResourceResponseElement[];
  export type Association = string;
  export interface BatchAssociateResourcesToCustomLineItemInput {
    /**
     *  A percentage custom line item ARN to associate the resources to. 
     */
    TargetArn: CustomLineItemArn;
    /**
     *  A list containing the ARNs of the resources to be associated. 
     */
    ResourceArns: CustomLineItemBatchAssociationsList;
    BillingPeriodRange?: CustomLineItemBillingPeriodRange;
  }
  export interface BatchAssociateResourcesToCustomLineItemOutput {
    /**
     *  A list of AssociateResourceResponseElement for each resource that's been associated to a percentage custom line item successfully. 
     */
    SuccessfullyAssociatedResources?: AssociateResourcesResponseList;
    /**
     *  A list of AssociateResourceResponseElement for each resource that failed association to a percentage custom line item. 
     */
    FailedAssociatedResources?: AssociateResourcesResponseList;
  }
  export interface BatchDisassociateResourcesFromCustomLineItemInput {
    /**
     *  A percentage custom line item ARN to disassociate the resources from. 
     */
    TargetArn: CustomLineItemArn;
    /**
     *  A list containing the ARNs of resources to be disassociated. 
     */
    ResourceArns: CustomLineItemBatchDisassociationsList;
    BillingPeriodRange?: CustomLineItemBillingPeriodRange;
  }
  export interface BatchDisassociateResourcesFromCustomLineItemOutput {
    /**
     *  A list of DisassociateResourceResponseElement for each resource that's been disassociated from a percentage custom line item successfully. 
     */
    SuccessfullyDisassociatedResources?: DisassociateResourcesResponseList;
    /**
     *  A list of DisassociateResourceResponseElement for each resource that failed disassociation from a percentage custom line item. 
     */
    FailedDisassociatedResources?: DisassociateResourcesResponseList;
  }
  export type BillingEntity = string;
  export type BillingGroupArn = string;
  export type BillingGroupArnList = BillingGroupArn[];
  export interface BillingGroupCostReportElement {
    /**
     * The Amazon Resource Name (ARN) of a billing group.
     */
    Arn?: BillingGroupArn;
    /**
     * The actual Amazon Web Services charges for the billing group.
     */
    AWSCost?: AWSCost;
    /**
     * The hypothetical Amazon Web Services charges based on the associated pricing plan of a billing group.
     */
    ProformaCost?: ProformaCost;
    /**
     * The billing group margin.
     */
    Margin?: Margin;
    /**
     * The percentage of billing group margin.
     */
    MarginPercentage?: MarginPercentage;
    /**
     * The displayed currency.
     */
    Currency?: Currency;
  }
  export type BillingGroupCostReportList = BillingGroupCostReportElement[];
  export type BillingGroupDescription = string;
  export type BillingGroupFullArn = string;
  export type BillingGroupList = BillingGroupListElement[];
  export interface BillingGroupListElement {
    /**
     * The name of the billing group.
     */
    Name?: BillingGroupName;
    /**
     * The Amazon Resource Number (ARN) that can be used to uniquely identify the billing group.
     */
    Arn?: BillingGroupArn;
    /**
     * The description of the billing group.
     */
    Description?: BillingGroupDescription;
    /**
     * The account ID that serves as the main account in a billing group.
     */
    PrimaryAccountId?: AccountId;
    ComputationPreference?: ComputationPreference;
    /**
     * The number of accounts in the particular billing group.
     */
    Size?: NumberOfAccounts;
    /**
     * The time when the billing group was created.
     */
    CreationTime?: Instant;
    /**
     * The most recent time when the billing group was modified.
     */
    LastModifiedTime?: Instant;
    /**
     * The billing group status. Only one of the valid values can be used.
     */
    Status?: BillingGroupStatus;
    /**
     * The reason why the billing group is in its current status.
     */
    StatusReason?: BillingGroupStatusReason;
    /**
     * Specifies if the billing group has automatic account association (AutoAssociate) enabled.
     */
    AccountGrouping?: ListBillingGroupAccountGrouping;
  }
  export type BillingGroupName = string;
  export type BillingGroupStatus = "ACTIVE"|"PRIMARY_ACCOUNT_MISSING"|string;
  export type BillingGroupStatusList = BillingGroupStatus[];
  export type BillingGroupStatusReason = string;
  export type BillingPeriod = string;
  export type Boolean = boolean;
  export type ClientToken = string;
  export interface ComputationPreference {
    /**
     *  The Amazon Resource Name (ARN) of the pricing plan that's used to compute the Amazon Web Services charges for a billing group. 
     */
    PricingPlanArn: PricingPlanFullArn;
  }
  export interface CreateBillingGroupInput {
    /**
     *  The token that is needed to support idempotency. Idempotency isn't currently supported, but will be implemented in a future update. 
     */
    ClientToken?: ClientToken;
    /**
     *  The billing group name. The names must be unique. 
     */
    Name: BillingGroupName;
    /**
     *  The set of accounts that will be under the billing group. The set of accounts resemble the linked accounts in a consolidated billing family. 
     */
    AccountGrouping: AccountGrouping;
    /**
     *  The preferences and settings that will be used to compute the Amazon Web Services charges for a billing group. 
     */
    ComputationPreference: ComputationPreference;
    /**
     *  The account ID that serves as the main account in a billing group. 
     */
    PrimaryAccountId?: AccountId;
    /**
     * The description of the billing group. 
     */
    Description?: BillingGroupDescription;
    /**
     *  A map that contains tag keys and tag values that are attached to a billing group. This feature isn't available during the beta. 
     */
    Tags?: TagMap;
  }
  export interface CreateBillingGroupOutput {
    /**
     * The Amazon Resource Name (ARN) of the created billing group. 
     */
    Arn?: BillingGroupArn;
  }
  export interface CreateCustomLineItemInput {
    /**
     *  The token that is needed to support idempotency. Idempotency isn't currently supported, but will be implemented in a future update. 
     */
    ClientToken?: ClientToken;
    /**
     *  The name of the custom line item. 
     */
    Name: CustomLineItemName;
    /**
     *  The description of the custom line item. This is shown on the Bills page in association with the charge value. 
     */
    Description: CustomLineItemDescription;
    /**
     *  The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to. 
     */
    BillingGroupArn: BillingGroupArn;
    /**
     *  A time range for which the custom line item is effective. 
     */
    BillingPeriodRange?: CustomLineItemBillingPeriodRange;
    /**
     *  A map that contains tag keys and tag values that are attached to a custom line item. 
     */
    Tags?: TagMap;
    /**
     *  A CustomLineItemChargeDetails that describes the charge details for a custom line item. 
     */
    ChargeDetails: CustomLineItemChargeDetails;
  }
  export interface CreateCustomLineItemOutput {
    /**
     *  The Amazon Resource Name (ARN) of the created custom line item. 
     */
    Arn?: CustomLineItemArn;
  }
  export interface CreateFreeTierConfig {
    /**
     *  Activate or deactivate Amazon Web Services Free Tier. 
     */
    Activated: TieringActivated;
  }
  export interface CreatePricingPlanInput {
    /**
     *  The token that is needed to support idempotency. Idempotency isn't currently supported, but will be implemented in a future update. 
     */
    ClientToken?: ClientToken;
    /**
     * The name of the pricing plan. The names must be unique to each pricing plan. 
     */
    Name: PricingPlanName;
    /**
     * The description of the pricing plan. 
     */
    Description?: PricingPlanDescription;
    /**
     *  A list of Amazon Resource Names (ARNs) that define the pricing plan parameters. 
     */
    PricingRuleArns?: PricingRuleArnsInput;
    /**
     *  A map that contains tag keys and tag values that are attached to a pricing plan. 
     */
    Tags?: TagMap;
  }
  export interface CreatePricingPlanOutput {
    /**
     * The Amazon Resource Name (ARN) of the created pricing plan.
     */
    Arn?: PricingPlanArn;
  }
  export interface CreatePricingRuleInput {
    /**
     *  The token that's needed to support idempotency. Idempotency isn't currently supported, but will be implemented in a future update. 
     */
    ClientToken?: ClientToken;
    /**
     *  The pricing rule name. The names must be unique to each pricing rule. 
     */
    Name: PricingRuleName;
    /**
     *  The pricing rule description. 
     */
    Description?: PricingRuleDescription;
    /**
     *  The scope of pricing rule that indicates if it's globally applicable, or it's service-specific. 
     */
    Scope: PricingRuleScope;
    /**
     *  The type of pricing rule. 
     */
    Type: PricingRuleType;
    /**
     *  A percentage modifier that's applied on the public pricing rates. 
     */
    ModifierPercentage?: ModifierPercentage;
    /**
     *  If the Scope attribute is set to SERVICE or SKU, the attribute indicates which service the PricingRule is applicable for. 
     */
    Service?: Service;
    /**
     *  A map that contains tag keys and tag values that are attached to a pricing rule. 
     */
    Tags?: TagMap;
    /**
     *  The seller of services provided by Amazon Web Services, their affiliates, or third-party providers selling services via Amazon Web Services Marketplace. 
     */
    BillingEntity?: BillingEntity;
    /**
     *  The set of tiering configurations for the pricing rule. 
     */
    Tiering?: CreateTieringInput;
    /**
     *  Usage type is the unit that each service uses to measure the usage of a specific type of resource. If the Scope attribute is set to SKU, this attribute indicates which usage type the PricingRule is modifying. For example, USW2-BoxUsage:m2.2xlarge describes an M2 High Memory Double Extra Large instance in the US West (Oregon) Region. &lt;/p&gt; 
     */
    UsageType?: UsageType;
    /**
     *  Operation is the specific Amazon Web Services action covered by this line item. This describes the specific usage of the line item.  If the Scope attribute is set to SKU, this attribute indicates which operation the PricingRule is modifying. For example, a value of RunInstances:0202 indicates the operation of running an Amazon EC2 instance.
     */
    Operation?: Operation;
  }
  export interface CreatePricingRuleOutput {
    /**
     *  The Amazon Resource Name (ARN) of the created pricing rule. 
     */
    Arn?: PricingRuleArn;
  }
  export interface CreateTieringInput {
    /**
     *  The possible Amazon Web Services Free Tier configurations. 
     */
    FreeTier: CreateFreeTierConfig;
  }
  export type Currency = string;
  export type CurrencyCode = "USD"|"CNY"|string;
  export type CustomLineItemArn = string;
  export type CustomLineItemArns = CustomLineItemArn[];
  export type CustomLineItemAssociationElement = string;
  export type CustomLineItemAssociationsList = CustomLineItemAssociationElement[];
  export type CustomLineItemBatchAssociationsList = CustomLineItemAssociationElement[];
  export type CustomLineItemBatchDisassociationsList = CustomLineItemAssociationElement[];
  export interface CustomLineItemBillingPeriodRange {
    /**
     * The inclusive start billing period that defines a billing period range where a custom line is applied.
     */
    InclusiveStartBillingPeriod: BillingPeriod;
    /**
     * The inclusive end billing period that defines a billing period range where a custom line is applied.
     */
    ExclusiveEndBillingPeriod?: BillingPeriod;
  }
  export interface CustomLineItemChargeDetails {
    /**
     * A CustomLineItemFlatChargeDetails that describes the charge details of a flat custom line item.
     */
    Flat?: CustomLineItemFlatChargeDetails;
    /**
     * A CustomLineItemPercentageChargeDetails that describes the charge details of a percentage custom line item.
     */
    Percentage?: CustomLineItemPercentageChargeDetails;
    /**
     * The type of the custom line item that indicates whether the charge is a fee or credit.
     */
    Type: CustomLineItemType;
    /**
     * A representation of the line item filter.
     */
    LineItemFilters?: LineItemFiltersList;
  }
  export type CustomLineItemChargeValue = number;
  export type CustomLineItemDescription = string;
  export interface CustomLineItemFlatChargeDetails {
    /**
     * The custom line item's fixed charge value in USD.
     */
    ChargeValue: CustomLineItemChargeValue;
  }
  export type CustomLineItemList = CustomLineItemListElement[];
  export interface CustomLineItemListElement {
    /**
     * The Amazon Resource Names (ARNs) for custom line items.
     */
    Arn?: CustomLineItemArn;
    /**
     * The custom line item's name.
     */
    Name?: CustomLineItemName;
    /**
     * A ListCustomLineItemChargeDetails that describes the charge details of a custom line item.
     */
    ChargeDetails?: ListCustomLineItemChargeDetails;
    /**
     * The custom line item's charge value currency. Only one of the valid values can be used.
     */
    CurrencyCode?: CurrencyCode;
    /**
     * The custom line item's description. This is shown on the Bills page in association with the charge value.
     */
    Description?: CustomLineItemDescription;
    /**
     * The product code that's associated with the custom line item.
     */
    ProductCode?: CustomLineItemProductCode;
    /**
     * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
     */
    BillingGroupArn?: BillingGroupArn;
    /**
     * The time created.
     */
    CreationTime?: Instant;
    /**
     * The most recent time when the custom line item was modified.
     */
    LastModifiedTime?: Instant;
    /**
     * The number of resources that are associated to the custom line item.
     */
    AssociationSize?: NumberOfAssociations;
  }
  export type CustomLineItemName = string;
  export type CustomLineItemNameList = CustomLineItemName[];
  export interface CustomLineItemPercentageChargeDetails {
    /**
     * The custom line item's percentage value. This will be multiplied against the combined value of its associated resources to determine its charge value. 
     */
    PercentageValue: CustomLineItemPercentageChargeValue;
    /**
     * A list of resource ARNs to associate to the percentage custom line item.
     */
    AssociatedValues?: CustomLineItemAssociationsList;
  }
  export type CustomLineItemPercentageChargeValue = number;
  export type CustomLineItemProductCode = string;
  export type CustomLineItemRelationship = "PARENT"|"CHILD"|string;
  export type CustomLineItemType = "CREDIT"|"FEE"|string;
  export type CustomLineItemVersionList = CustomLineItemVersionListElement[];
  export interface CustomLineItemVersionListElement {
    /**
     * The name of the custom line item.
     */
    Name?: CustomLineItemName;
    ChargeDetails?: ListCustomLineItemChargeDetails;
    /**
     * The charge value currency of the custom line item.
     */
    CurrencyCode?: CurrencyCode;
    /**
     * The description of the custom line item.
     */
    Description?: CustomLineItemDescription;
    /**
     * The product code that’s associated with the custom line item.
     */
    ProductCode?: CustomLineItemProductCode;
    /**
     * The Amazon Resource Name (ARN) of the billing group that the custom line item applies to.
     */
    BillingGroupArn?: BillingGroupArn;
    /**
     * The time when the custom line item version was created.
     */
    CreationTime?: Instant;
    /**
     * The most recent time that the custom line item version was modified.
     */
    LastModifiedTime?: Instant;
    /**
     * The number of resources that are associated with the custom line item.
     */
    AssociationSize?: NumberOfAssociations;
    /**
     * The start billing period of the custom line item version.
     */
    StartBillingPeriod?: BillingPeriod;
    /**
     * The end billing period of the custom line item version.
     */
    EndBillingPeriod?: BillingPeriod;
    /**
     *  A list of custom line item Amazon Resource Names (ARNs) to retrieve information. 
     */
    Arn?: CustomLineItemArn;
    /**
     *  The inclusive start time. 
     */
    StartTime?: Instant;
  }
  export interface DeleteBillingGroupInput {
    /**
     * The Amazon Resource Name (ARN) of the billing group that you're deleting.
     */
    Arn: BillingGroupArn;
  }
  export interface DeleteBillingGroupOutput {
    /**
     * The Amazon Resource Name (ARN) of the deleted billing group.
     */
    Arn?: BillingGroupArn;
  }
  export interface DeleteCustomLineItemInput {
    /**
     *  The ARN of the custom line item to be deleted. 
     */
    Arn: CustomLineItemArn;
    BillingPeriodRange?: CustomLineItemBillingPeriodRange;
  }
  export interface DeleteCustomLineItemOutput {
    /**
     *  Then ARN of the deleted custom line item. 
     */
    Arn?: CustomLineItemArn;
  }
  export interface DeletePricingPlanInput {
    /**
     * The Amazon Resource Name (ARN) of the pricing plan that you're deleting. 
     */
    Arn: PricingPlanArn;
  }
  export interface DeletePricingPlanOutput {
    /**
     *  The Amazon Resource Name (ARN) of the deleted pricing plan. 
     */
    Arn?: PricingPlanArn;
  }
  export interface DeletePricingRuleInput {
    /**
     *  The Amazon Resource Name (ARN) of the pricing rule that you are deleting. 
     */
    Arn: PricingRuleArn;
  }
  export interface DeletePricingRuleOutput {
    /**
     *  The Amazon Resource Name (ARN) of the deleted pricing rule. 
     */
    Arn?: PricingRuleArn;
  }
  export interface DisassociateAccountsInput {
    /**
     * The Amazon Resource Name (ARN) of the billing group that the array of account IDs will disassociate from. 
     */
    Arn: BillingGroupArn;
    /**
     * The array of account IDs to disassociate. 
     */
    AccountIds: AccountIdList;
  }
  export interface DisassociateAccountsOutput {
    /**
     * The Amazon Resource Name (ARN) of the billing group that the array of account IDs is disassociated from. 
     */
    Arn?: BillingGroupArn;
  }
  export interface DisassociatePricingRulesInput {
    /**
     *  The pricing plan Amazon Resource Name (ARN) to disassociate pricing rules from. 
     */
    Arn: PricingPlanArn;
    /**
     *  A list containing the Amazon Resource Name (ARN) of the pricing rules that will be disassociated. 
     */
    PricingRuleArns: PricingRuleArnsNonEmptyInput;
  }
  export interface DisassociatePricingRulesOutput {
    /**
     *  The Amazon Resource Name (ARN) of the pricing plan that the pricing rules successfully disassociated from. 
     */
    Arn?: PricingPlanArn;
  }
  export interface DisassociateResourceResponseElement {
    /**
     * The resource ARN that was disassociated from the custom line item. 
     */
    Arn?: CustomLineItemAssociationElement;
    /**
     *  An AssociateResourceError that's shown if the resource disassociation fails. 
     */
    Error?: AssociateResourceError;
  }
  export type DisassociateResourcesResponseList = DisassociateResourceResponseElement[];
  export interface FreeTierConfig {
    /**
     *  Activate or deactivate Amazon Web Services Free Tier application. 
     */
    Activated: TieringActivated;
  }
  export type Instant = number;
  export interface LineItemFilter {
    /**
     * The attribute of the line item filter. This specifies what attribute that you can filter on.
     */
    Attribute: LineItemFilterAttributeName;
    /**
     * The match criteria of the line item filter. This parameter specifies whether not to include the resource value from the billing group total cost.
     */
    MatchOption: MatchOption;
    /**
     * The values of the line item filter. This specifies the values to filter on. Currently, you can only exclude Savings Plan discounts.
     */
    Values: LineItemFilterValuesList;
  }
  export type LineItemFilterAttributeName = "LINE_ITEM_TYPE"|string;
  export type LineItemFilterValue = "SAVINGS_PLAN_NEGATION"|string;
  export type LineItemFilterValuesList = LineItemFilterValue[];
  export type LineItemFiltersList = LineItemFilter[];
  export interface ListAccountAssociationsFilter {
    /**
     *  MONITORED: linked accounts that are associated to billing groups.  UNMONITORED: linked accounts that are not associated to billing groups.  Billing Group Arn: linked accounts that are associated to the provided Billing Group Arn.
     */
    Association?: Association;
    /**
     * The Amazon Web Services account ID to filter on.
     */
    AccountId?: AccountId;
    /**
     *  The list of Amazon Web Services IDs to retrieve their associated billing group for a given time range. 
     */
    AccountIds?: AccountIdFilterList;
  }
  export interface ListAccountAssociationsInput {
    /**
     *  The preferred billing period to get account associations. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     * The filter on the account ID of the linked account, or any of the following:  MONITORED: linked accounts that are associated to billing groups.  UNMONITORED: linked accounts that aren't associated to billing groups.  Billing Group Arn: linked accounts that are associated to the provided billing group Arn. 
     */
    Filters?: ListAccountAssociationsFilter;
    /**
     *  The pagination token that's used on subsequent calls to retrieve accounts. 
     */
    NextToken?: Token;
  }
  export interface ListAccountAssociationsOutput {
    /**
     *  The list of linked accounts in the payer account. 
     */
    LinkedAccounts?: AccountAssociationsList;
    /**
     *  The pagination token that's used on subsequent calls to get accounts. 
     */
    NextToken?: Token;
  }
  export interface ListBillingGroupAccountGrouping {
    /**
     * Specifies if this billing group will automatically associate newly added Amazon Web Services accounts that join your consolidated billing family.
     */
    AutoAssociate?: Boolean;
  }
  export interface ListBillingGroupCostReportsFilter {
    /**
     * The list of Amazon Resource Names (ARNs) used to filter billing groups to retrieve reports. 
     */
    BillingGroupArns?: BillingGroupArnList;
  }
  export interface ListBillingGroupCostReportsInput {
    /**
     * The preferred billing period for your report. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     * The maximum number of reports to retrieve. 
     */
    MaxResults?: MaxBillingGroupResults;
    /**
     * The pagination token that's used on subsequent calls to get reports. 
     */
    NextToken?: Token;
    /**
     * A ListBillingGroupCostReportsFilter to specify billing groups to retrieve reports from. 
     */
    Filters?: ListBillingGroupCostReportsFilter;
  }
  export interface ListBillingGroupCostReportsOutput {
    /**
     * A list of BillingGroupCostReportElement retrieved. 
     */
    BillingGroupCostReports?: BillingGroupCostReportList;
    /**
     * The pagination token that's used on subsequent calls to get reports. 
     */
    NextToken?: Token;
  }
  export interface ListBillingGroupsFilter {
    /**
     * The list of billing group Amazon Resource Names (ARNs) to retrieve information.
     */
    Arns?: BillingGroupArnList;
    /**
     * The pricing plan Amazon Resource Names (ARNs) to retrieve information.
     */
    PricingPlan?: PricingPlanFullArn;
    /**
     *  A list of billing groups to retrieve their current status for a specific time range 
     */
    Statuses?: BillingGroupStatusList;
    /**
     * Specifies if this billing group will automatically associate newly added Amazon Web Services accounts that join your consolidated billing family.
     */
    AutoAssociate?: Boolean;
  }
  export interface ListBillingGroupsInput {
    /**
     * The preferred billing period to get billing groups. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     * The maximum number of billing groups to retrieve. 
     */
    MaxResults?: MaxBillingGroupResults;
    /**
     * The pagination token that's used on subsequent calls to get billing groups. 
     */
    NextToken?: Token;
    /**
     * A ListBillingGroupsFilter that specifies the billing group and pricing plan to retrieve billing group information. 
     */
    Filters?: ListBillingGroupsFilter;
  }
  export interface ListBillingGroupsOutput {
    /**
     * A list of BillingGroupListElement retrieved. 
     */
    BillingGroups?: BillingGroupList;
    /**
     * The pagination token that's used on subsequent calls to get billing groups. 
     */
    NextToken?: Token;
  }
  export interface ListCustomLineItemChargeDetails {
    /**
     *  A ListCustomLineItemFlatChargeDetails that describes the charge details of a flat custom line item. 
     */
    Flat?: ListCustomLineItemFlatChargeDetails;
    /**
     *  A ListCustomLineItemPercentageChargeDetails that describes the charge details of a percentage custom line item. 
     */
    Percentage?: ListCustomLineItemPercentageChargeDetails;
    /**
     *  The type of the custom line item that indicates whether the charge is a fee or credit. 
     */
    Type: CustomLineItemType;
    /**
     * A representation of the line item filter.
     */
    LineItemFilters?: LineItemFiltersList;
  }
  export interface ListCustomLineItemFlatChargeDetails {
    /**
     *  The custom line item's fixed charge value in USD. 
     */
    ChargeValue: CustomLineItemChargeValue;
  }
  export interface ListCustomLineItemPercentageChargeDetails {
    /**
     *  The custom line item's percentage value. This will be multiplied against the combined value of its associated resources to determine its charge value. 
     */
    PercentageValue: CustomLineItemPercentageChargeValue;
  }
  export interface ListCustomLineItemVersionsBillingPeriodRangeFilter {
    /**
     * The inclusive start billing period that defines a billing period range where a custom line item version is applied.
     */
    StartBillingPeriod?: BillingPeriod;
    /**
     * The exclusive end billing period that defines a billing period range where a custom line item version is applied.
     */
    EndBillingPeriod?: BillingPeriod;
  }
  export interface ListCustomLineItemVersionsFilter {
    /**
     * The billing period range in which the custom line item version is applied.
     */
    BillingPeriodRange?: ListCustomLineItemVersionsBillingPeriodRangeFilter;
  }
  export interface ListCustomLineItemVersionsInput {
    /**
     * The Amazon Resource Name (ARN) for the custom line item.
     */
    Arn: CustomLineItemArn;
    /**
     * The maximum number of custom line item versions to retrieve.
     */
    MaxResults?: MaxCustomLineItemResults;
    /**
     * The pagination token that's used on subsequent calls to retrieve custom line item versions.
     */
    NextToken?: Token;
    /**
     * A ListCustomLineItemVersionsFilter that specifies the billing period range in which the custom line item versions are applied.
     */
    Filters?: ListCustomLineItemVersionsFilter;
  }
  export interface ListCustomLineItemVersionsOutput {
    /**
     * A list of CustomLineItemVersionListElements that are received.
     */
    CustomLineItemVersions?: CustomLineItemVersionList;
    /**
     * The pagination token that's used on subsequent calls to retrieve custom line item versions.
     */
    NextToken?: Token;
  }
  export interface ListCustomLineItemsFilter {
    /**
     * A list of custom line items to retrieve information.
     */
    Names?: CustomLineItemNameList;
    /**
     * The billing group Amazon Resource Names (ARNs) to retrieve information.
     */
    BillingGroups?: BillingGroupArnList;
    /**
     * A list of custom line item ARNs to retrieve information.
     */
    Arns?: CustomLineItemArns;
  }
  export interface ListCustomLineItemsInput {
    /**
     *  The preferred billing period to get custom line items (FFLIs). 
     */
    BillingPeriod?: BillingPeriod;
    /**
     *  The maximum number of billing groups to retrieve. 
     */
    MaxResults?: MaxCustomLineItemResults;
    /**
     *  The pagination token that's used on subsequent calls to get custom line items (FFLIs). 
     */
    NextToken?: Token;
    /**
     * A ListCustomLineItemsFilter that specifies the custom line item names and/or billing group Amazon Resource Names (ARNs) to retrieve FFLI information.
     */
    Filters?: ListCustomLineItemsFilter;
  }
  export interface ListCustomLineItemsOutput {
    /**
     *  A list of FreeFormLineItemListElements received. 
     */
    CustomLineItems?: CustomLineItemList;
    /**
     *  The pagination token that's used on subsequent calls to get custom line items (FFLIs). 
     */
    NextToken?: Token;
  }
  export interface ListPricingPlansAssociatedWithPricingRuleInput {
    /**
     *  The pricing plan billing period for which associations will be listed. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     *  The pricing rule Amazon Resource Name (ARN) for which associations will be listed. 
     */
    PricingRuleArn: PricingRuleArn;
    /**
     *  The optional maximum number of pricing rule associations to retrieve. 
     */
    MaxResults?: MaxPricingRuleResults;
    /**
     *  The optional pagination token returned by a previous call. 
     */
    NextToken?: Token;
  }
  export interface ListPricingPlansAssociatedWithPricingRuleOutput {
    /**
     *  The pricing plan billing period for which associations will be listed. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     *  The pricing rule Amazon Resource Name (ARN) for which associations will be listed. 
     */
    PricingRuleArn?: PricingRuleArn;
    /**
     *  The list containing pricing plans that are associated with the requested pricing rule. 
     */
    PricingPlanArns?: PricingPlanArns;
    /**
     *  The pagination token to be used on subsequent calls. 
     */
    NextToken?: Token;
  }
  export interface ListPricingPlansFilter {
    /**
     * A list of pricing plan Amazon Resource Names (ARNs) to retrieve information.
     */
    Arns?: PricingPlanArns;
  }
  export interface ListPricingPlansInput {
    /**
     * The preferred billing period to get pricing plan. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     * A ListPricingPlansFilter that specifies the Amazon Resource Name (ARNs) of pricing plans to retrieve pricing plans information.
     */
    Filters?: ListPricingPlansFilter;
    /**
     * The maximum number of pricing plans to retrieve.
     */
    MaxResults?: MaxPricingPlanResults;
    /**
     * The pagination token that's used on subsequent call to get pricing plans. 
     */
    NextToken?: Token;
  }
  export interface ListPricingPlansOutput {
    /**
     *  The billing period for which the described pricing plans are applicable. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     * A list of PricingPlanListElement retrieved. 
     */
    PricingPlans?: PricingPlanList;
    /**
     * The pagination token that's used on subsequent calls to get pricing plans. 
     */
    NextToken?: Token;
  }
  export interface ListPricingRulesAssociatedToPricingPlanInput {
    /**
     *  The billing period for which the pricing rule associations are to be listed. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     *  The Amazon Resource Name (ARN) of the pricing plan for which associations are to be listed.
     */
    PricingPlanArn: PricingPlanArn;
    /**
     * The optional maximum number of pricing rule associations to retrieve.
     */
    MaxResults?: MaxPricingPlanResults;
    /**
     *  The optional pagination token returned by a previous call. 
     */
    NextToken?: Token;
  }
  export interface ListPricingRulesAssociatedToPricingPlanOutput {
    /**
     *  The billing period for which the pricing rule associations are listed. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     *  The Amazon Resource Name (ARN) of the pricing plan for which associations are listed.
     */
    PricingPlanArn?: PricingPlanArn;
    /**
     *  A list containing pricing rules that are associated with the requested pricing plan. 
     */
    PricingRuleArns?: PricingRuleArns;
    /**
     *  The pagination token to be used on subsequent calls. 
     */
    NextToken?: Token;
  }
  export interface ListPricingRulesFilter {
    /**
     * A list containing the pricing rule Amazon Resource Names (ARNs) to include in the API response.
     */
    Arns?: PricingRuleArns;
  }
  export interface ListPricingRulesInput {
    /**
     *  The preferred billing period to get the pricing plan. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     *  A DescribePricingRuleFilter that specifies the Amazon Resource Name (ARNs) of pricing rules to retrieve pricing rules information. 
     */
    Filters?: ListPricingRulesFilter;
    /**
     *  The maximum number of pricing rules to retrieve. 
     */
    MaxResults?: MaxPricingRuleResults;
    /**
     *  The pagination token that's used on subsequent call to get pricing rules. 
     */
    NextToken?: Token;
  }
  export interface ListPricingRulesOutput {
    /**
     *  The billing period for which the described pricing rules are applicable. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     *  A list containing the described pricing rules. 
     */
    PricingRules?: PricingRuleList;
    /**
     *  The pagination token that's used on subsequent calls to get pricing rules. 
     */
    NextToken?: Token;
  }
  export interface ListResourcesAssociatedToCustomLineItemFilter {
    /**
     *  The type of relationship between the custom line item and the associated resource. 
     */
    Relationship?: CustomLineItemRelationship;
  }
  export interface ListResourcesAssociatedToCustomLineItemInput {
    /**
     *  The billing period for which the resource associations will be listed. 
     */
    BillingPeriod?: BillingPeriod;
    /**
     *  The ARN of the custom line item for which the resource associations will be listed. 
     */
    Arn: CustomLineItemArn;
    /**
     *  (Optional) The maximum number of resource associations to be retrieved. 
     */
    MaxResults?: MaxCustomLineItemResults;
    /**
     *  (Optional) The pagination token that's returned by a previous request. 
     */
    NextToken?: Token;
    /**
     *  (Optional) A ListResourcesAssociatedToCustomLineItemFilter that can specify the types of resources that should be retrieved. 
     */
    Filters?: ListResourcesAssociatedToCustomLineItemFilter;
  }
  export interface ListResourcesAssociatedToCustomLineItemOutput {
    /**
     *  The custom line item ARN for which the resource associations are listed. 
     */
    Arn?: CustomLineItemArn;
    /**
     *  A list of ListResourcesAssociatedToCustomLineItemResponseElement for each resource association retrieved. 
     */
    AssociatedResources?: ListResourcesAssociatedToCustomLineItemResponseList;
    /**
     *  The pagination token to be used in subsequent requests to retrieve additional results. 
     */
    NextToken?: Token;
  }
  export interface ListResourcesAssociatedToCustomLineItemResponseElement {
    /**
     *  The ARN of the associated resource. 
     */
    Arn?: CustomLineItemAssociationElement;
    /**
     *  The type of relationship between the custom line item and the associated resource. 
     */
    Relationship?: CustomLineItemRelationship;
    /**
     * The end billing period of the associated resource.
     */
    EndBillingPeriod?: BillingPeriod;
  }
  export type ListResourcesAssociatedToCustomLineItemResponseList = ListResourcesAssociatedToCustomLineItemResponseElement[];
  export interface ListTagsForResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) that identifies the resource to list the tags. 
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  The tags for the resource. 
     */
    Tags?: TagMap;
  }
  export type Margin = string;
  export type MarginPercentage = string;
  export type MatchOption = "NOT_EQUAL"|string;
  export type MaxBillingGroupResults = number;
  export type MaxCustomLineItemResults = number;
  export type MaxPricingPlanResults = number;
  export type MaxPricingRuleResults = number;
  export type ModifierPercentage = number;
  export type NumberOfAccounts = number;
  export type NumberOfAssociatedPricingRules = number;
  export type NumberOfAssociations = number;
  export type NumberOfPricingPlansAssociatedWith = number;
  export type Operation = string;
  export type PricingPlanArn = string;
  export type PricingPlanArns = PricingPlanArn[];
  export type PricingPlanDescription = string;
  export type PricingPlanFullArn = string;
  export type PricingPlanList = PricingPlanListElement[];
  export interface PricingPlanListElement {
    /**
     * The name of a pricing plan.
     */
    Name?: PricingPlanName;
    /**
     * The pricing plan Amazon Resource Names (ARN). This can be used to uniquely identify a pricing plan.
     */
    Arn?: PricingPlanArn;
    /**
     * The pricing plan description.
     */
    Description?: PricingPlanDescription;
    /**
     * The pricing rules count that's currently associated with this pricing plan list element.
     */
    Size?: NumberOfAssociatedPricingRules;
    /**
     * The time when the pricing plan was created.
     */
    CreationTime?: Instant;
    /**
     * The most recent time when the pricing plan was modified.
     */
    LastModifiedTime?: Instant;
  }
  export type PricingPlanName = string;
  export type PricingRuleArn = string;
  export type PricingRuleArns = PricingRuleArn[];
  export type PricingRuleArnsInput = PricingRuleArn[];
  export type PricingRuleArnsNonEmptyInput = PricingRuleArn[];
  export type PricingRuleDescription = string;
  export type PricingRuleList = PricingRuleListElement[];
  export interface PricingRuleListElement {
    /**
     * The name of a pricing rule.
     */
    Name?: PricingRuleName;
    /**
     * The Amazon Resource Name (ARN) used to uniquely identify a pricing rule.
     */
    Arn?: PricingRuleArn;
    /**
     * The pricing rule description.
     */
    Description?: PricingRuleDescription;
    /**
     * The scope of pricing rule that indicates if it is globally applicable, or if it is service-specific.
     */
    Scope?: PricingRuleScope;
    /**
     * The type of pricing rule.
     */
    Type?: PricingRuleType;
    /**
     * A percentage modifier applied on the public pricing rates.
     */
    ModifierPercentage?: ModifierPercentage;
    /**
     * If the Scope attribute is SERVICE, this attribute indicates which service the PricingRule is applicable for.
     */
    Service?: Service;
    /**
     * The pricing plans count that this pricing rule is associated with.
     */
    AssociatedPricingPlanCount?: NumberOfPricingPlansAssociatedWith;
    /**
     * The time when the pricing rule was created.
     */
    CreationTime?: Instant;
    /**
     *  The most recent time when the pricing rule was modified.
     */
    LastModifiedTime?: Instant;
    /**
     *  The seller of services provided by Amazon Web Services, their affiliates, or third-party providers selling services via Amazon Web Services Marketplace. 
     */
    BillingEntity?: BillingEntity;
    /**
     *  The set of tiering configurations for the pricing rule. 
     */
    Tiering?: Tiering;
    /**
     *  Usage type is the unit that each service uses to measure the usage of a specific type of resource. If the Scope attribute is set to SKU, this attribute indicates which usage type the PricingRule is modifying. For example, USW2-BoxUsage:m2.2xlarge describes an M2 High Memory Double Extra Large instance in the US West (Oregon) Region. &lt;/p&gt; 
     */
    UsageType?: UsageType;
    /**
     *  Operation is the specific Amazon Web Services action covered by this line item. This describes the specific usage of the line item.  If the Scope attribute is set to SKU, this attribute indicates which operation the PricingRule is modifying. For example, a value of RunInstances:0202 indicates the operation of running an Amazon EC2 instance.
     */
    Operation?: Operation;
  }
  export type PricingRuleName = string;
  export type PricingRuleScope = "GLOBAL"|"SERVICE"|"BILLING_ENTITY"|"SKU"|string;
  export type PricingRuleType = "MARKUP"|"DISCOUNT"|"TIERING"|string;
  export type ProformaCost = string;
  export type Service = string;
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the resource to which to add tags. 
     */
    ResourceArn: Arn;
    /**
     *  The tags to add to the resource as a list of key-value pairs. 
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface Tiering {
    /**
     *  The possible Amazon Web Services Free Tier configurations. 
     */
    FreeTier: FreeTierConfig;
  }
  export type TieringActivated = boolean;
  export type Token = string;
  export interface UntagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the resource to which to delete tags. 
     */
    ResourceArn: Arn;
    /**
     *  The tags to delete from the resource as a list of key-value pairs. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateBillingGroupAccountGrouping {
    /**
     * Specifies if this billing group will automatically associate newly added Amazon Web Services accounts that join your consolidated billing family.
     */
    AutoAssociate?: Boolean;
  }
  export interface UpdateBillingGroupInput {
    /**
     * The Amazon Resource Name (ARN) of the billing group being updated. 
     */
    Arn: BillingGroupArn;
    /**
     * The name of the billing group. The names must be unique to each billing group. 
     */
    Name?: BillingGroupName;
    /**
     * The status of the billing group. Only one of the valid values can be used. 
     */
    Status?: BillingGroupStatus;
    /**
     *  The preferences and settings that will be used to compute the Amazon Web Services charges for a billing group. 
     */
    ComputationPreference?: ComputationPreference;
    /**
     * A description of the billing group. 
     */
    Description?: BillingGroupDescription;
    /**
     * Specifies if the billing group has automatic account association (AutoAssociate) enabled.
     */
    AccountGrouping?: UpdateBillingGroupAccountGrouping;
  }
  export interface UpdateBillingGroupOutput {
    /**
     * The Amazon Resource Name (ARN) of the billing group that was updated. 
     */
    Arn?: BillingGroupArn;
    /**
     *  The name of the billing group. The names must be unique to each billing group. 
     */
    Name?: BillingGroupName;
    /**
     *  A description of the billing group. 
     */
    Description?: BillingGroupDescription;
    /**
     *  The account ID that serves as the main account in a billing group. 
     */
    PrimaryAccountId?: AccountId;
    /**
     *  The Amazon Resource Name (ARN) of the pricing plan to compute Amazon Web Services charges for the billing group. 
     */
    PricingPlanArn?: PricingPlanArn;
    /**
     *  The number of accounts in the particular billing group. 
     */
    Size?: NumberOfAccounts;
    /**
     *  The most recent time when the billing group was modified. 
     */
    LastModifiedTime?: Instant;
    /**
     *  The status of the billing group. Only one of the valid values can be used. 
     */
    Status?: BillingGroupStatus;
    /**
     *  The reason why the billing group is in its current status. 
     */
    StatusReason?: BillingGroupStatusReason;
    /**
     * Specifies if the billing group has automatic account association (AutoAssociate) enabled.
     */
    AccountGrouping?: UpdateBillingGroupAccountGrouping;
  }
  export interface UpdateCustomLineItemChargeDetails {
    /**
     *  An UpdateCustomLineItemFlatChargeDetails that describes the new charge details of a flat custom line item. 
     */
    Flat?: UpdateCustomLineItemFlatChargeDetails;
    /**
     *  An UpdateCustomLineItemPercentageChargeDetails that describes the new charge details of a percentage custom line item. 
     */
    Percentage?: UpdateCustomLineItemPercentageChargeDetails;
    /**
     * A representation of the line item filter.
     */
    LineItemFilters?: LineItemFiltersList;
  }
  export interface UpdateCustomLineItemFlatChargeDetails {
    /**
     *  The custom line item's new fixed charge value in USD. 
     */
    ChargeValue: CustomLineItemChargeValue;
  }
  export interface UpdateCustomLineItemInput {
    /**
     *  The ARN of the custom line item to be updated. 
     */
    Arn: CustomLineItemArn;
    /**
     *  The new name for the custom line item. 
     */
    Name?: CustomLineItemName;
    /**
     *  The new line item description of the custom line item. 
     */
    Description?: CustomLineItemDescription;
    /**
     *  A ListCustomLineItemChargeDetails containing the new charge details for the custom line item. 
     */
    ChargeDetails?: UpdateCustomLineItemChargeDetails;
    BillingPeriodRange?: CustomLineItemBillingPeriodRange;
  }
  export interface UpdateCustomLineItemOutput {
    /**
     *  The ARN of the successfully updated custom line item. 
     */
    Arn?: CustomLineItemArn;
    /**
     *  The ARN of the billing group that the custom line item is applied to. 
     */
    BillingGroupArn?: BillingGroupFullArn;
    /**
     *  The name of the successfully updated custom line item. 
     */
    Name?: CustomLineItemName;
    /**
     *  The description of the successfully updated custom line item. 
     */
    Description?: CustomLineItemDescription;
    /**
     *  A ListCustomLineItemChargeDetails containing the charge details of the successfully updated custom line item. 
     */
    ChargeDetails?: ListCustomLineItemChargeDetails;
    /**
     *  The most recent time when the custom line item was modified. 
     */
    LastModifiedTime?: Instant;
    /**
     *  The number of resources that are associated to the custom line item. 
     */
    AssociationSize?: NumberOfAssociations;
  }
  export interface UpdateCustomLineItemPercentageChargeDetails {
    /**
     *  The custom line item's new percentage value. This will be multiplied against the combined value of its associated resources to determine its charge value. 
     */
    PercentageValue: CustomLineItemPercentageChargeValue;
  }
  export interface UpdateFreeTierConfig {
    /**
     *  Activate or deactivate application of Amazon Web Services Free Tier. 
     */
    Activated: TieringActivated;
  }
  export interface UpdatePricingPlanInput {
    /**
     * The Amazon Resource Name (ARN) of the pricing plan that you're updating. 
     */
    Arn: PricingPlanArn;
    /**
     * The name of the pricing plan. The name must be unique to each pricing plan. 
     */
    Name?: PricingPlanName;
    /**
     * The description of the pricing plan. 
     */
    Description?: PricingPlanDescription;
  }
  export interface UpdatePricingPlanOutput {
    /**
     * The Amazon Resource Name (ARN) of the updated pricing plan. 
     */
    Arn?: PricingPlanArn;
    /**
     *  The name of the pricing plan. The name must be unique to each pricing plan. 
     */
    Name?: PricingPlanName;
    /**
     *  The new description for the pricing rule. 
     */
    Description?: PricingPlanDescription;
    /**
     *  The pricing rules count that's currently associated with this pricing plan list. 
     */
    Size?: NumberOfAssociatedPricingRules;
    /**
     *  The most recent time when the pricing plan was modified. 
     */
    LastModifiedTime?: Instant;
  }
  export interface UpdatePricingRuleInput {
    /**
     *  The Amazon Resource Name (ARN) of the pricing rule to update. 
     */
    Arn: PricingRuleArn;
    /**
     *  The new name of the pricing rule. The name must be unique to each pricing rule. 
     */
    Name?: PricingRuleName;
    /**
     *  The new description for the pricing rule. 
     */
    Description?: PricingRuleDescription;
    /**
     *  The new pricing rule type. 
     */
    Type?: PricingRuleType;
    /**
     *  The new modifier to show pricing plan rates as a percentage. 
     */
    ModifierPercentage?: ModifierPercentage;
    /**
     *  The set of tiering configurations for the pricing rule. 
     */
    Tiering?: UpdateTieringInput;
  }
  export interface UpdatePricingRuleOutput {
    /**
     *  The Amazon Resource Name (ARN) of the successfully updated pricing rule. 
     */
    Arn?: PricingRuleArn;
    /**
     *  The new name of the pricing rule. The name must be unique to each pricing rule. 
     */
    Name?: PricingRuleName;
    /**
     *  The new description for the pricing rule. 
     */
    Description?: PricingRuleDescription;
    /**
     *  The scope of pricing rule that indicates if it's globally applicable, or it's service-specific. 
     */
    Scope?: PricingRuleScope;
    /**
     *  The new pricing rule type. 
     */
    Type?: PricingRuleType;
    /**
     *  The new modifier to show pricing plan rates as a percentage. 
     */
    ModifierPercentage?: ModifierPercentage;
    /**
     *  If the Scope attribute is set to SERVICE, the attribute indicates which service the PricingRule is applicable for. 
     */
    Service?: Service;
    /**
     *  The pricing plans count that this pricing rule is associated with. 
     */
    AssociatedPricingPlanCount?: NumberOfPricingPlansAssociatedWith;
    /**
     *  The most recent time the pricing rule was modified. 
     */
    LastModifiedTime?: Instant;
    /**
     *  The seller of services provided by Amazon Web Services, their affiliates, or third-party providers selling services via Amazon Web Services Marketplace. 
     */
    BillingEntity?: BillingEntity;
    /**
     *  The set of tiering configurations for the pricing rule. 
     */
    Tiering?: UpdateTieringInput;
    /**
     * Usage type is the unit that each service uses to measure the usage of a specific type of resource. If the Scope attribute is set to SKU, this attribute indicates which usage type the PricingRule is modifying. For example, USW2-BoxUsage:m2.2xlarge describes an M2 High Memory Double Extra Large instance in the US West (Oregon) Region. 
     */
    UsageType?: UsageType;
    /**
     * Operation refers to the specific Amazon Web Services covered by this line item. This describes the specific usage of the line item.  If the Scope attribute is set to SKU, this attribute indicates which operation the PricingRule is modifying. For example, a value of RunInstances:0202 indicates the operation of running an Amazon EC2 instance.
     */
    Operation?: Operation;
  }
  export interface UpdateTieringInput {
    /**
     *  The possible Amazon Web Services Free Tier configurations. 
     */
    FreeTier: UpdateFreeTierConfig;
  }
  export type UsageType = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-07-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Billingconductor client.
   */
  export import Types = Billingconductor;
}
export = Billingconductor;
