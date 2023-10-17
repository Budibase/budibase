import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ServiceCatalog extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ServiceCatalog.Types.ClientConfiguration)
  config: Config & ServiceCatalog.Types.ClientConfiguration;
  /**
   * Accepts an offer to share the specified portfolio.
   */
  acceptPortfolioShare(params: ServiceCatalog.Types.AcceptPortfolioShareInput, callback?: (err: AWSError, data: ServiceCatalog.Types.AcceptPortfolioShareOutput) => void): Request<ServiceCatalog.Types.AcceptPortfolioShareOutput, AWSError>;
  /**
   * Accepts an offer to share the specified portfolio.
   */
  acceptPortfolioShare(callback?: (err: AWSError, data: ServiceCatalog.Types.AcceptPortfolioShareOutput) => void): Request<ServiceCatalog.Types.AcceptPortfolioShareOutput, AWSError>;
  /**
   * Associates the specified budget with the specified resource.
   */
  associateBudgetWithResource(params: ServiceCatalog.Types.AssociateBudgetWithResourceInput, callback?: (err: AWSError, data: ServiceCatalog.Types.AssociateBudgetWithResourceOutput) => void): Request<ServiceCatalog.Types.AssociateBudgetWithResourceOutput, AWSError>;
  /**
   * Associates the specified budget with the specified resource.
   */
  associateBudgetWithResource(callback?: (err: AWSError, data: ServiceCatalog.Types.AssociateBudgetWithResourceOutput) => void): Request<ServiceCatalog.Types.AssociateBudgetWithResourceOutput, AWSError>;
  /**
   * Associates the specified principal ARN with the specified portfolio.
   */
  associatePrincipalWithPortfolio(params: ServiceCatalog.Types.AssociatePrincipalWithPortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.AssociatePrincipalWithPortfolioOutput) => void): Request<ServiceCatalog.Types.AssociatePrincipalWithPortfolioOutput, AWSError>;
  /**
   * Associates the specified principal ARN with the specified portfolio.
   */
  associatePrincipalWithPortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.AssociatePrincipalWithPortfolioOutput) => void): Request<ServiceCatalog.Types.AssociatePrincipalWithPortfolioOutput, AWSError>;
  /**
   * Associates the specified product with the specified portfolio. A delegated admin is authorized to invoke this command.
   */
  associateProductWithPortfolio(params: ServiceCatalog.Types.AssociateProductWithPortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.AssociateProductWithPortfolioOutput) => void): Request<ServiceCatalog.Types.AssociateProductWithPortfolioOutput, AWSError>;
  /**
   * Associates the specified product with the specified portfolio. A delegated admin is authorized to invoke this command.
   */
  associateProductWithPortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.AssociateProductWithPortfolioOutput) => void): Request<ServiceCatalog.Types.AssociateProductWithPortfolioOutput, AWSError>;
  /**
   * Associates a self-service action with a provisioning artifact.
   */
  associateServiceActionWithProvisioningArtifact(params: ServiceCatalog.Types.AssociateServiceActionWithProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.AssociateServiceActionWithProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.AssociateServiceActionWithProvisioningArtifactOutput, AWSError>;
  /**
   * Associates a self-service action with a provisioning artifact.
   */
  associateServiceActionWithProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.AssociateServiceActionWithProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.AssociateServiceActionWithProvisioningArtifactOutput, AWSError>;
  /**
   * Associate the specified TagOption with the specified portfolio or product.
   */
  associateTagOptionWithResource(params: ServiceCatalog.Types.AssociateTagOptionWithResourceInput, callback?: (err: AWSError, data: ServiceCatalog.Types.AssociateTagOptionWithResourceOutput) => void): Request<ServiceCatalog.Types.AssociateTagOptionWithResourceOutput, AWSError>;
  /**
   * Associate the specified TagOption with the specified portfolio or product.
   */
  associateTagOptionWithResource(callback?: (err: AWSError, data: ServiceCatalog.Types.AssociateTagOptionWithResourceOutput) => void): Request<ServiceCatalog.Types.AssociateTagOptionWithResourceOutput, AWSError>;
  /**
   * Associates multiple self-service actions with provisioning artifacts.
   */
  batchAssociateServiceActionWithProvisioningArtifact(params: ServiceCatalog.Types.BatchAssociateServiceActionWithProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.BatchAssociateServiceActionWithProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.BatchAssociateServiceActionWithProvisioningArtifactOutput, AWSError>;
  /**
   * Associates multiple self-service actions with provisioning artifacts.
   */
  batchAssociateServiceActionWithProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.BatchAssociateServiceActionWithProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.BatchAssociateServiceActionWithProvisioningArtifactOutput, AWSError>;
  /**
   * Disassociates a batch of self-service actions from the specified provisioning artifact.
   */
  batchDisassociateServiceActionFromProvisioningArtifact(params: ServiceCatalog.Types.BatchDisassociateServiceActionFromProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.BatchDisassociateServiceActionFromProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.BatchDisassociateServiceActionFromProvisioningArtifactOutput, AWSError>;
  /**
   * Disassociates a batch of self-service actions from the specified provisioning artifact.
   */
  batchDisassociateServiceActionFromProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.BatchDisassociateServiceActionFromProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.BatchDisassociateServiceActionFromProvisioningArtifactOutput, AWSError>;
  /**
   * Copies the specified source product to the specified target product or a new product. You can copy a product to the same account or another account. You can copy a product to the same region or another region. This operation is performed asynchronously. To track the progress of the operation, use DescribeCopyProductStatus.
   */
  copyProduct(params: ServiceCatalog.Types.CopyProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CopyProductOutput) => void): Request<ServiceCatalog.Types.CopyProductOutput, AWSError>;
  /**
   * Copies the specified source product to the specified target product or a new product. You can copy a product to the same account or another account. You can copy a product to the same region or another region. This operation is performed asynchronously. To track the progress of the operation, use DescribeCopyProductStatus.
   */
  copyProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.CopyProductOutput) => void): Request<ServiceCatalog.Types.CopyProductOutput, AWSError>;
  /**
   * Creates a constraint. A delegated admin is authorized to invoke this command.
   */
  createConstraint(params: ServiceCatalog.Types.CreateConstraintInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CreateConstraintOutput) => void): Request<ServiceCatalog.Types.CreateConstraintOutput, AWSError>;
  /**
   * Creates a constraint. A delegated admin is authorized to invoke this command.
   */
  createConstraint(callback?: (err: AWSError, data: ServiceCatalog.Types.CreateConstraintOutput) => void): Request<ServiceCatalog.Types.CreateConstraintOutput, AWSError>;
  /**
   * Creates a portfolio. A delegated admin is authorized to invoke this command.
   */
  createPortfolio(params: ServiceCatalog.Types.CreatePortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CreatePortfolioOutput) => void): Request<ServiceCatalog.Types.CreatePortfolioOutput, AWSError>;
  /**
   * Creates a portfolio. A delegated admin is authorized to invoke this command.
   */
  createPortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.CreatePortfolioOutput) => void): Request<ServiceCatalog.Types.CreatePortfolioOutput, AWSError>;
  /**
   * Shares the specified portfolio with the specified account or organization node. Shares to an organization node can only be created by the management account of an organization or by a delegated administrator. You can share portfolios to an organization, an organizational unit, or a specific account. Note that if a delegated admin is de-registered, they can no longer create portfolio shares.  AWSOrganizationsAccess must be enabled in order to create a portfolio share to an organization node. You can't share a shared resource, including portfolios that contain a shared product. If the portfolio share with the specified account or organization node already exists, this action will have no effect and will not return an error. To update an existing share, you must use the  UpdatePortfolioShare API instead.
   */
  createPortfolioShare(params: ServiceCatalog.Types.CreatePortfolioShareInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CreatePortfolioShareOutput) => void): Request<ServiceCatalog.Types.CreatePortfolioShareOutput, AWSError>;
  /**
   * Shares the specified portfolio with the specified account or organization node. Shares to an organization node can only be created by the management account of an organization or by a delegated administrator. You can share portfolios to an organization, an organizational unit, or a specific account. Note that if a delegated admin is de-registered, they can no longer create portfolio shares.  AWSOrganizationsAccess must be enabled in order to create a portfolio share to an organization node. You can't share a shared resource, including portfolios that contain a shared product. If the portfolio share with the specified account or organization node already exists, this action will have no effect and will not return an error. To update an existing share, you must use the  UpdatePortfolioShare API instead.
   */
  createPortfolioShare(callback?: (err: AWSError, data: ServiceCatalog.Types.CreatePortfolioShareOutput) => void): Request<ServiceCatalog.Types.CreatePortfolioShareOutput, AWSError>;
  /**
   * Creates a product. A delegated admin is authorized to invoke this command. The user or role that performs this operation must have the cloudformation:GetTemplate IAM policy permission. This policy permission is required when using the ImportFromPhysicalId template source in the information data section.
   */
  createProduct(params: ServiceCatalog.Types.CreateProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CreateProductOutput) => void): Request<ServiceCatalog.Types.CreateProductOutput, AWSError>;
  /**
   * Creates a product. A delegated admin is authorized to invoke this command. The user or role that performs this operation must have the cloudformation:GetTemplate IAM policy permission. This policy permission is required when using the ImportFromPhysicalId template source in the information data section.
   */
  createProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.CreateProductOutput) => void): Request<ServiceCatalog.Types.CreateProductOutput, AWSError>;
  /**
   * Creates a plan. A plan includes the list of resources to be created (when provisioning a new product) or modified (when updating a provisioned product) when the plan is executed. You can create one plan per provisioned product. To create a plan for an existing provisioned product, the product status must be AVAILBLE or TAINTED. To view the resource changes in the change set, use DescribeProvisionedProductPlan. To create or modify the provisioned product, use ExecuteProvisionedProductPlan.
   */
  createProvisionedProductPlan(params: ServiceCatalog.Types.CreateProvisionedProductPlanInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CreateProvisionedProductPlanOutput) => void): Request<ServiceCatalog.Types.CreateProvisionedProductPlanOutput, AWSError>;
  /**
   * Creates a plan. A plan includes the list of resources to be created (when provisioning a new product) or modified (when updating a provisioned product) when the plan is executed. You can create one plan per provisioned product. To create a plan for an existing provisioned product, the product status must be AVAILBLE or TAINTED. To view the resource changes in the change set, use DescribeProvisionedProductPlan. To create or modify the provisioned product, use ExecuteProvisionedProductPlan.
   */
  createProvisionedProductPlan(callback?: (err: AWSError, data: ServiceCatalog.Types.CreateProvisionedProductPlanOutput) => void): Request<ServiceCatalog.Types.CreateProvisionedProductPlanOutput, AWSError>;
  /**
   * Creates a provisioning artifact (also known as a version) for the specified product. You cannot create a provisioning artifact for a product that was shared with you. The user or role that performs this operation must have the cloudformation:GetTemplate IAM policy permission. This policy permission is required when using the ImportFromPhysicalId template source in the information data section.
   */
  createProvisioningArtifact(params: ServiceCatalog.Types.CreateProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CreateProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.CreateProvisioningArtifactOutput, AWSError>;
  /**
   * Creates a provisioning artifact (also known as a version) for the specified product. You cannot create a provisioning artifact for a product that was shared with you. The user or role that performs this operation must have the cloudformation:GetTemplate IAM policy permission. This policy permission is required when using the ImportFromPhysicalId template source in the information data section.
   */
  createProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.CreateProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.CreateProvisioningArtifactOutput, AWSError>;
  /**
   * Creates a self-service action.
   */
  createServiceAction(params: ServiceCatalog.Types.CreateServiceActionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CreateServiceActionOutput) => void): Request<ServiceCatalog.Types.CreateServiceActionOutput, AWSError>;
  /**
   * Creates a self-service action.
   */
  createServiceAction(callback?: (err: AWSError, data: ServiceCatalog.Types.CreateServiceActionOutput) => void): Request<ServiceCatalog.Types.CreateServiceActionOutput, AWSError>;
  /**
   * Creates a TagOption.
   */
  createTagOption(params: ServiceCatalog.Types.CreateTagOptionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.CreateTagOptionOutput) => void): Request<ServiceCatalog.Types.CreateTagOptionOutput, AWSError>;
  /**
   * Creates a TagOption.
   */
  createTagOption(callback?: (err: AWSError, data: ServiceCatalog.Types.CreateTagOptionOutput) => void): Request<ServiceCatalog.Types.CreateTagOptionOutput, AWSError>;
  /**
   * Deletes the specified constraint. A delegated admin is authorized to invoke this command.
   */
  deleteConstraint(params: ServiceCatalog.Types.DeleteConstraintInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteConstraintOutput) => void): Request<ServiceCatalog.Types.DeleteConstraintOutput, AWSError>;
  /**
   * Deletes the specified constraint. A delegated admin is authorized to invoke this command.
   */
  deleteConstraint(callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteConstraintOutput) => void): Request<ServiceCatalog.Types.DeleteConstraintOutput, AWSError>;
  /**
   * Deletes the specified portfolio. You cannot delete a portfolio if it was shared with you or if it has associated products, users, constraints, or shared accounts. A delegated admin is authorized to invoke this command.
   */
  deletePortfolio(params: ServiceCatalog.Types.DeletePortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DeletePortfolioOutput) => void): Request<ServiceCatalog.Types.DeletePortfolioOutput, AWSError>;
  /**
   * Deletes the specified portfolio. You cannot delete a portfolio if it was shared with you or if it has associated products, users, constraints, or shared accounts. A delegated admin is authorized to invoke this command.
   */
  deletePortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.DeletePortfolioOutput) => void): Request<ServiceCatalog.Types.DeletePortfolioOutput, AWSError>;
  /**
   * Stops sharing the specified portfolio with the specified account or organization node. Shares to an organization node can only be deleted by the management account of an organization or by a delegated administrator. Note that if a delegated admin is de-registered, portfolio shares created from that account are removed.
   */
  deletePortfolioShare(params: ServiceCatalog.Types.DeletePortfolioShareInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DeletePortfolioShareOutput) => void): Request<ServiceCatalog.Types.DeletePortfolioShareOutput, AWSError>;
  /**
   * Stops sharing the specified portfolio with the specified account or organization node. Shares to an organization node can only be deleted by the management account of an organization or by a delegated administrator. Note that if a delegated admin is de-registered, portfolio shares created from that account are removed.
   */
  deletePortfolioShare(callback?: (err: AWSError, data: ServiceCatalog.Types.DeletePortfolioShareOutput) => void): Request<ServiceCatalog.Types.DeletePortfolioShareOutput, AWSError>;
  /**
   * Deletes the specified product. You cannot delete a product if it was shared with you or is associated with a portfolio. A delegated admin is authorized to invoke this command.
   */
  deleteProduct(params: ServiceCatalog.Types.DeleteProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteProductOutput) => void): Request<ServiceCatalog.Types.DeleteProductOutput, AWSError>;
  /**
   * Deletes the specified product. You cannot delete a product if it was shared with you or is associated with a portfolio. A delegated admin is authorized to invoke this command.
   */
  deleteProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteProductOutput) => void): Request<ServiceCatalog.Types.DeleteProductOutput, AWSError>;
  /**
   * Deletes the specified plan.
   */
  deleteProvisionedProductPlan(params: ServiceCatalog.Types.DeleteProvisionedProductPlanInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteProvisionedProductPlanOutput) => void): Request<ServiceCatalog.Types.DeleteProvisionedProductPlanOutput, AWSError>;
  /**
   * Deletes the specified plan.
   */
  deleteProvisionedProductPlan(callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteProvisionedProductPlanOutput) => void): Request<ServiceCatalog.Types.DeleteProvisionedProductPlanOutput, AWSError>;
  /**
   * Deletes the specified provisioning artifact (also known as a version) for the specified product. You cannot delete a provisioning artifact associated with a product that was shared with you. You cannot delete the last provisioning artifact for a product, because a product must have at least one provisioning artifact.
   */
  deleteProvisioningArtifact(params: ServiceCatalog.Types.DeleteProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.DeleteProvisioningArtifactOutput, AWSError>;
  /**
   * Deletes the specified provisioning artifact (also known as a version) for the specified product. You cannot delete a provisioning artifact associated with a product that was shared with you. You cannot delete the last provisioning artifact for a product, because a product must have at least one provisioning artifact.
   */
  deleteProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.DeleteProvisioningArtifactOutput, AWSError>;
  /**
   * Deletes a self-service action.
   */
  deleteServiceAction(params: ServiceCatalog.Types.DeleteServiceActionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteServiceActionOutput) => void): Request<ServiceCatalog.Types.DeleteServiceActionOutput, AWSError>;
  /**
   * Deletes a self-service action.
   */
  deleteServiceAction(callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteServiceActionOutput) => void): Request<ServiceCatalog.Types.DeleteServiceActionOutput, AWSError>;
  /**
   * Deletes the specified TagOption. You cannot delete a TagOption if it is associated with a product or portfolio.
   */
  deleteTagOption(params: ServiceCatalog.Types.DeleteTagOptionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteTagOptionOutput) => void): Request<ServiceCatalog.Types.DeleteTagOptionOutput, AWSError>;
  /**
   * Deletes the specified TagOption. You cannot delete a TagOption if it is associated with a product or portfolio.
   */
  deleteTagOption(callback?: (err: AWSError, data: ServiceCatalog.Types.DeleteTagOptionOutput) => void): Request<ServiceCatalog.Types.DeleteTagOptionOutput, AWSError>;
  /**
   * Gets information about the specified constraint.
   */
  describeConstraint(params: ServiceCatalog.Types.DescribeConstraintInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeConstraintOutput) => void): Request<ServiceCatalog.Types.DescribeConstraintOutput, AWSError>;
  /**
   * Gets information about the specified constraint.
   */
  describeConstraint(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeConstraintOutput) => void): Request<ServiceCatalog.Types.DescribeConstraintOutput, AWSError>;
  /**
   * Gets the status of the specified copy product operation.
   */
  describeCopyProductStatus(params: ServiceCatalog.Types.DescribeCopyProductStatusInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeCopyProductStatusOutput) => void): Request<ServiceCatalog.Types.DescribeCopyProductStatusOutput, AWSError>;
  /**
   * Gets the status of the specified copy product operation.
   */
  describeCopyProductStatus(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeCopyProductStatusOutput) => void): Request<ServiceCatalog.Types.DescribeCopyProductStatusOutput, AWSError>;
  /**
   * Gets information about the specified portfolio. A delegated admin is authorized to invoke this command.
   */
  describePortfolio(params: ServiceCatalog.Types.DescribePortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribePortfolioOutput) => void): Request<ServiceCatalog.Types.DescribePortfolioOutput, AWSError>;
  /**
   * Gets information about the specified portfolio. A delegated admin is authorized to invoke this command.
   */
  describePortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribePortfolioOutput) => void): Request<ServiceCatalog.Types.DescribePortfolioOutput, AWSError>;
  /**
   * Gets the status of the specified portfolio share operation. This API can only be called by the management account in the organization or by a delegated admin.
   */
  describePortfolioShareStatus(params: ServiceCatalog.Types.DescribePortfolioShareStatusInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribePortfolioShareStatusOutput) => void): Request<ServiceCatalog.Types.DescribePortfolioShareStatusOutput, AWSError>;
  /**
   * Gets the status of the specified portfolio share operation. This API can only be called by the management account in the organization or by a delegated admin.
   */
  describePortfolioShareStatus(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribePortfolioShareStatusOutput) => void): Request<ServiceCatalog.Types.DescribePortfolioShareStatusOutput, AWSError>;
  /**
   * Returns a summary of each of the portfolio shares that were created for the specified portfolio. You can use this API to determine which accounts or organizational nodes this portfolio have been shared, whether the recipient entity has imported the share, and whether TagOptions are included with the share. The PortfolioId and Type parameters are both required.
   */
  describePortfolioShares(params: ServiceCatalog.Types.DescribePortfolioSharesInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribePortfolioSharesOutput) => void): Request<ServiceCatalog.Types.DescribePortfolioSharesOutput, AWSError>;
  /**
   * Returns a summary of each of the portfolio shares that were created for the specified portfolio. You can use this API to determine which accounts or organizational nodes this portfolio have been shared, whether the recipient entity has imported the share, and whether TagOptions are included with the share. The PortfolioId and Type parameters are both required.
   */
  describePortfolioShares(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribePortfolioSharesOutput) => void): Request<ServiceCatalog.Types.DescribePortfolioSharesOutput, AWSError>;
  /**
   * Gets information about the specified product.
   */
  describeProduct(params: ServiceCatalog.Types.DescribeProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProductOutput) => void): Request<ServiceCatalog.Types.DescribeProductOutput, AWSError>;
  /**
   * Gets information about the specified product.
   */
  describeProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProductOutput) => void): Request<ServiceCatalog.Types.DescribeProductOutput, AWSError>;
  /**
   * Gets information about the specified product. This operation is run with administrator access.
   */
  describeProductAsAdmin(params: ServiceCatalog.Types.DescribeProductAsAdminInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProductAsAdminOutput) => void): Request<ServiceCatalog.Types.DescribeProductAsAdminOutput, AWSError>;
  /**
   * Gets information about the specified product. This operation is run with administrator access.
   */
  describeProductAsAdmin(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProductAsAdminOutput) => void): Request<ServiceCatalog.Types.DescribeProductAsAdminOutput, AWSError>;
  /**
   * Gets information about the specified product.
   */
  describeProductView(params: ServiceCatalog.Types.DescribeProductViewInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProductViewOutput) => void): Request<ServiceCatalog.Types.DescribeProductViewOutput, AWSError>;
  /**
   * Gets information about the specified product.
   */
  describeProductView(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProductViewOutput) => void): Request<ServiceCatalog.Types.DescribeProductViewOutput, AWSError>;
  /**
   * Gets information about the specified provisioned product.
   */
  describeProvisionedProduct(params: ServiceCatalog.Types.DescribeProvisionedProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProvisionedProductOutput) => void): Request<ServiceCatalog.Types.DescribeProvisionedProductOutput, AWSError>;
  /**
   * Gets information about the specified provisioned product.
   */
  describeProvisionedProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProvisionedProductOutput) => void): Request<ServiceCatalog.Types.DescribeProvisionedProductOutput, AWSError>;
  /**
   * Gets information about the resource changes for the specified plan.
   */
  describeProvisionedProductPlan(params: ServiceCatalog.Types.DescribeProvisionedProductPlanInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProvisionedProductPlanOutput) => void): Request<ServiceCatalog.Types.DescribeProvisionedProductPlanOutput, AWSError>;
  /**
   * Gets information about the resource changes for the specified plan.
   */
  describeProvisionedProductPlan(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProvisionedProductPlanOutput) => void): Request<ServiceCatalog.Types.DescribeProvisionedProductPlanOutput, AWSError>;
  /**
   * Gets information about the specified provisioning artifact (also known as a version) for the specified product.
   */
  describeProvisioningArtifact(params: ServiceCatalog.Types.DescribeProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.DescribeProvisioningArtifactOutput, AWSError>;
  /**
   * Gets information about the specified provisioning artifact (also known as a version) for the specified product.
   */
  describeProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.DescribeProvisioningArtifactOutput, AWSError>;
  /**
   * Gets information about the configuration required to provision the specified product using the specified provisioning artifact. If the output contains a TagOption key with an empty list of values, there is a TagOption conflict for that key. The end user cannot take action to fix the conflict, and launch is not blocked. In subsequent calls to ProvisionProduct, do not include conflicted TagOption keys as tags, or this causes the error "Parameter validation failed: Missing required parameter in Tags[N]:Value". Tag the provisioned product with the value sc-tagoption-conflict-portfolioId-productId.
   */
  describeProvisioningParameters(params: ServiceCatalog.Types.DescribeProvisioningParametersInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProvisioningParametersOutput) => void): Request<ServiceCatalog.Types.DescribeProvisioningParametersOutput, AWSError>;
  /**
   * Gets information about the configuration required to provision the specified product using the specified provisioning artifact. If the output contains a TagOption key with an empty list of values, there is a TagOption conflict for that key. The end user cannot take action to fix the conflict, and launch is not blocked. In subsequent calls to ProvisionProduct, do not include conflicted TagOption keys as tags, or this causes the error "Parameter validation failed: Missing required parameter in Tags[N]:Value". Tag the provisioned product with the value sc-tagoption-conflict-portfolioId-productId.
   */
  describeProvisioningParameters(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeProvisioningParametersOutput) => void): Request<ServiceCatalog.Types.DescribeProvisioningParametersOutput, AWSError>;
  /**
   * Gets information about the specified request operation. Use this operation after calling a request operation (for example, ProvisionProduct, TerminateProvisionedProduct, or UpdateProvisionedProduct).   If a provisioned product was transferred to a new owner using UpdateProvisionedProductProperties, the new owner will be able to describe all past records for that product. The previous owner will no longer be able to describe the records, but will be able to use ListRecordHistory to see the product's history from when he was the owner. 
   */
  describeRecord(params: ServiceCatalog.Types.DescribeRecordInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeRecordOutput) => void): Request<ServiceCatalog.Types.DescribeRecordOutput, AWSError>;
  /**
   * Gets information about the specified request operation. Use this operation after calling a request operation (for example, ProvisionProduct, TerminateProvisionedProduct, or UpdateProvisionedProduct).   If a provisioned product was transferred to a new owner using UpdateProvisionedProductProperties, the new owner will be able to describe all past records for that product. The previous owner will no longer be able to describe the records, but will be able to use ListRecordHistory to see the product's history from when he was the owner. 
   */
  describeRecord(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeRecordOutput) => void): Request<ServiceCatalog.Types.DescribeRecordOutput, AWSError>;
  /**
   * Describes a self-service action.
   */
  describeServiceAction(params: ServiceCatalog.Types.DescribeServiceActionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeServiceActionOutput) => void): Request<ServiceCatalog.Types.DescribeServiceActionOutput, AWSError>;
  /**
   * Describes a self-service action.
   */
  describeServiceAction(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeServiceActionOutput) => void): Request<ServiceCatalog.Types.DescribeServiceActionOutput, AWSError>;
  /**
   * Finds the default parameters for a specific self-service action on a specific provisioned product and returns a map of the results to the user.
   */
  describeServiceActionExecutionParameters(params: ServiceCatalog.Types.DescribeServiceActionExecutionParametersInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeServiceActionExecutionParametersOutput) => void): Request<ServiceCatalog.Types.DescribeServiceActionExecutionParametersOutput, AWSError>;
  /**
   * Finds the default parameters for a specific self-service action on a specific provisioned product and returns a map of the results to the user.
   */
  describeServiceActionExecutionParameters(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeServiceActionExecutionParametersOutput) => void): Request<ServiceCatalog.Types.DescribeServiceActionExecutionParametersOutput, AWSError>;
  /**
   * Gets information about the specified TagOption.
   */
  describeTagOption(params: ServiceCatalog.Types.DescribeTagOptionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeTagOptionOutput) => void): Request<ServiceCatalog.Types.DescribeTagOptionOutput, AWSError>;
  /**
   * Gets information about the specified TagOption.
   */
  describeTagOption(callback?: (err: AWSError, data: ServiceCatalog.Types.DescribeTagOptionOutput) => void): Request<ServiceCatalog.Types.DescribeTagOptionOutput, AWSError>;
  /**
   * Disable portfolio sharing through AWS Organizations feature. This feature will not delete your current shares but it will prevent you from creating new shares throughout your organization. Current shares will not be in sync with your organization structure if it changes after calling this API. This API can only be called by the management account in the organization. This API can't be invoked if there are active delegated administrators in the organization. Note that a delegated administrator is not authorized to invoke DisableAWSOrganizationsAccess.
   */
  disableAWSOrganizationsAccess(params: ServiceCatalog.Types.DisableAWSOrganizationsAccessInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DisableAWSOrganizationsAccessOutput) => void): Request<ServiceCatalog.Types.DisableAWSOrganizationsAccessOutput, AWSError>;
  /**
   * Disable portfolio sharing through AWS Organizations feature. This feature will not delete your current shares but it will prevent you from creating new shares throughout your organization. Current shares will not be in sync with your organization structure if it changes after calling this API. This API can only be called by the management account in the organization. This API can't be invoked if there are active delegated administrators in the organization. Note that a delegated administrator is not authorized to invoke DisableAWSOrganizationsAccess.
   */
  disableAWSOrganizationsAccess(callback?: (err: AWSError, data: ServiceCatalog.Types.DisableAWSOrganizationsAccessOutput) => void): Request<ServiceCatalog.Types.DisableAWSOrganizationsAccessOutput, AWSError>;
  /**
   * Disassociates the specified budget from the specified resource.
   */
  disassociateBudgetFromResource(params: ServiceCatalog.Types.DisassociateBudgetFromResourceInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociateBudgetFromResourceOutput) => void): Request<ServiceCatalog.Types.DisassociateBudgetFromResourceOutput, AWSError>;
  /**
   * Disassociates the specified budget from the specified resource.
   */
  disassociateBudgetFromResource(callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociateBudgetFromResourceOutput) => void): Request<ServiceCatalog.Types.DisassociateBudgetFromResourceOutput, AWSError>;
  /**
   * Disassociates a previously associated principal ARN from a specified portfolio.
   */
  disassociatePrincipalFromPortfolio(params: ServiceCatalog.Types.DisassociatePrincipalFromPortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociatePrincipalFromPortfolioOutput) => void): Request<ServiceCatalog.Types.DisassociatePrincipalFromPortfolioOutput, AWSError>;
  /**
   * Disassociates a previously associated principal ARN from a specified portfolio.
   */
  disassociatePrincipalFromPortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociatePrincipalFromPortfolioOutput) => void): Request<ServiceCatalog.Types.DisassociatePrincipalFromPortfolioOutput, AWSError>;
  /**
   * Disassociates the specified product from the specified portfolio.  A delegated admin is authorized to invoke this command.
   */
  disassociateProductFromPortfolio(params: ServiceCatalog.Types.DisassociateProductFromPortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociateProductFromPortfolioOutput) => void): Request<ServiceCatalog.Types.DisassociateProductFromPortfolioOutput, AWSError>;
  /**
   * Disassociates the specified product from the specified portfolio.  A delegated admin is authorized to invoke this command.
   */
  disassociateProductFromPortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociateProductFromPortfolioOutput) => void): Request<ServiceCatalog.Types.DisassociateProductFromPortfolioOutput, AWSError>;
  /**
   * Disassociates the specified self-service action association from the specified provisioning artifact.
   */
  disassociateServiceActionFromProvisioningArtifact(params: ServiceCatalog.Types.DisassociateServiceActionFromProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociateServiceActionFromProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.DisassociateServiceActionFromProvisioningArtifactOutput, AWSError>;
  /**
   * Disassociates the specified self-service action association from the specified provisioning artifact.
   */
  disassociateServiceActionFromProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociateServiceActionFromProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.DisassociateServiceActionFromProvisioningArtifactOutput, AWSError>;
  /**
   * Disassociates the specified TagOption from the specified resource.
   */
  disassociateTagOptionFromResource(params: ServiceCatalog.Types.DisassociateTagOptionFromResourceInput, callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociateTagOptionFromResourceOutput) => void): Request<ServiceCatalog.Types.DisassociateTagOptionFromResourceOutput, AWSError>;
  /**
   * Disassociates the specified TagOption from the specified resource.
   */
  disassociateTagOptionFromResource(callback?: (err: AWSError, data: ServiceCatalog.Types.DisassociateTagOptionFromResourceOutput) => void): Request<ServiceCatalog.Types.DisassociateTagOptionFromResourceOutput, AWSError>;
  /**
   * Enable portfolio sharing feature through AWS Organizations. This API will allow Service Catalog to receive updates on your organization in order to sync your shares with the current structure. This API can only be called by the management account in the organization. By calling this API Service Catalog will make a call to organizations:EnableAWSServiceAccess on your behalf so that your shares can be in sync with any changes in your AWS Organizations structure. Note that a delegated administrator is not authorized to invoke EnableAWSOrganizationsAccess.
   */
  enableAWSOrganizationsAccess(params: ServiceCatalog.Types.EnableAWSOrganizationsAccessInput, callback?: (err: AWSError, data: ServiceCatalog.Types.EnableAWSOrganizationsAccessOutput) => void): Request<ServiceCatalog.Types.EnableAWSOrganizationsAccessOutput, AWSError>;
  /**
   * Enable portfolio sharing feature through AWS Organizations. This API will allow Service Catalog to receive updates on your organization in order to sync your shares with the current structure. This API can only be called by the management account in the organization. By calling this API Service Catalog will make a call to organizations:EnableAWSServiceAccess on your behalf so that your shares can be in sync with any changes in your AWS Organizations structure. Note that a delegated administrator is not authorized to invoke EnableAWSOrganizationsAccess.
   */
  enableAWSOrganizationsAccess(callback?: (err: AWSError, data: ServiceCatalog.Types.EnableAWSOrganizationsAccessOutput) => void): Request<ServiceCatalog.Types.EnableAWSOrganizationsAccessOutput, AWSError>;
  /**
   * Provisions or modifies a product based on the resource changes for the specified plan.
   */
  executeProvisionedProductPlan(params: ServiceCatalog.Types.ExecuteProvisionedProductPlanInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ExecuteProvisionedProductPlanOutput) => void): Request<ServiceCatalog.Types.ExecuteProvisionedProductPlanOutput, AWSError>;
  /**
   * Provisions or modifies a product based on the resource changes for the specified plan.
   */
  executeProvisionedProductPlan(callback?: (err: AWSError, data: ServiceCatalog.Types.ExecuteProvisionedProductPlanOutput) => void): Request<ServiceCatalog.Types.ExecuteProvisionedProductPlanOutput, AWSError>;
  /**
   * Executes a self-service action against a provisioned product.
   */
  executeProvisionedProductServiceAction(params: ServiceCatalog.Types.ExecuteProvisionedProductServiceActionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ExecuteProvisionedProductServiceActionOutput) => void): Request<ServiceCatalog.Types.ExecuteProvisionedProductServiceActionOutput, AWSError>;
  /**
   * Executes a self-service action against a provisioned product.
   */
  executeProvisionedProductServiceAction(callback?: (err: AWSError, data: ServiceCatalog.Types.ExecuteProvisionedProductServiceActionOutput) => void): Request<ServiceCatalog.Types.ExecuteProvisionedProductServiceActionOutput, AWSError>;
  /**
   * Get the Access Status for AWS Organization portfolio share feature. This API can only be called by the management account in the organization or by a delegated admin.
   */
  getAWSOrganizationsAccessStatus(params: ServiceCatalog.Types.GetAWSOrganizationsAccessStatusInput, callback?: (err: AWSError, data: ServiceCatalog.Types.GetAWSOrganizationsAccessStatusOutput) => void): Request<ServiceCatalog.Types.GetAWSOrganizationsAccessStatusOutput, AWSError>;
  /**
   * Get the Access Status for AWS Organization portfolio share feature. This API can only be called by the management account in the organization or by a delegated admin.
   */
  getAWSOrganizationsAccessStatus(callback?: (err: AWSError, data: ServiceCatalog.Types.GetAWSOrganizationsAccessStatusOutput) => void): Request<ServiceCatalog.Types.GetAWSOrganizationsAccessStatusOutput, AWSError>;
  /**
   * This API takes either a ProvisonedProductId or a ProvisionedProductName, along with a list of one or more output keys, and responds with the key/value pairs of those outputs.
   */
  getProvisionedProductOutputs(params: ServiceCatalog.Types.GetProvisionedProductOutputsInput, callback?: (err: AWSError, data: ServiceCatalog.Types.GetProvisionedProductOutputsOutput) => void): Request<ServiceCatalog.Types.GetProvisionedProductOutputsOutput, AWSError>;
  /**
   * This API takes either a ProvisonedProductId or a ProvisionedProductName, along with a list of one or more output keys, and responds with the key/value pairs of those outputs.
   */
  getProvisionedProductOutputs(callback?: (err: AWSError, data: ServiceCatalog.Types.GetProvisionedProductOutputsOutput) => void): Request<ServiceCatalog.Types.GetProvisionedProductOutputsOutput, AWSError>;
  /**
   * Requests the import of a resource as a Service Catalog provisioned product that is associated to a Service Catalog product and provisioning artifact. Once imported, all supported Service Catalog governance actions are supported on the provisioned product. Resource import only supports CloudFormation stack ARNs. CloudFormation StackSets and non-root nested stacks are not supported. The CloudFormation stack must have one of the following statuses to be imported: CREATE_COMPLETE, UPDATE_COMPLETE, UPDATE_ROLLBACK_COMPLETE, IMPORT_COMPLETE, IMPORT_ROLLBACK_COMPLETE. Import of the resource requires that the CloudFormation stack template matches the associated Service Catalog product provisioning artifact.  The user or role that performs this operation must have the cloudformation:GetTemplate and cloudformation:DescribeStacks IAM policy permissions. 
   */
  importAsProvisionedProduct(params: ServiceCatalog.Types.ImportAsProvisionedProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ImportAsProvisionedProductOutput) => void): Request<ServiceCatalog.Types.ImportAsProvisionedProductOutput, AWSError>;
  /**
   * Requests the import of a resource as a Service Catalog provisioned product that is associated to a Service Catalog product and provisioning artifact. Once imported, all supported Service Catalog governance actions are supported on the provisioned product. Resource import only supports CloudFormation stack ARNs. CloudFormation StackSets and non-root nested stacks are not supported. The CloudFormation stack must have one of the following statuses to be imported: CREATE_COMPLETE, UPDATE_COMPLETE, UPDATE_ROLLBACK_COMPLETE, IMPORT_COMPLETE, IMPORT_ROLLBACK_COMPLETE. Import of the resource requires that the CloudFormation stack template matches the associated Service Catalog product provisioning artifact.  The user or role that performs this operation must have the cloudformation:GetTemplate and cloudformation:DescribeStacks IAM policy permissions. 
   */
  importAsProvisionedProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.ImportAsProvisionedProductOutput) => void): Request<ServiceCatalog.Types.ImportAsProvisionedProductOutput, AWSError>;
  /**
   * Lists all portfolios for which sharing was accepted by this account.
   */
  listAcceptedPortfolioShares(params: ServiceCatalog.Types.ListAcceptedPortfolioSharesInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListAcceptedPortfolioSharesOutput) => void): Request<ServiceCatalog.Types.ListAcceptedPortfolioSharesOutput, AWSError>;
  /**
   * Lists all portfolios for which sharing was accepted by this account.
   */
  listAcceptedPortfolioShares(callback?: (err: AWSError, data: ServiceCatalog.Types.ListAcceptedPortfolioSharesOutput) => void): Request<ServiceCatalog.Types.ListAcceptedPortfolioSharesOutput, AWSError>;
  /**
   * Lists all the budgets associated to the specified resource.
   */
  listBudgetsForResource(params: ServiceCatalog.Types.ListBudgetsForResourceInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListBudgetsForResourceOutput) => void): Request<ServiceCatalog.Types.ListBudgetsForResourceOutput, AWSError>;
  /**
   * Lists all the budgets associated to the specified resource.
   */
  listBudgetsForResource(callback?: (err: AWSError, data: ServiceCatalog.Types.ListBudgetsForResourceOutput) => void): Request<ServiceCatalog.Types.ListBudgetsForResourceOutput, AWSError>;
  /**
   * Lists the constraints for the specified portfolio and product.
   */
  listConstraintsForPortfolio(params: ServiceCatalog.Types.ListConstraintsForPortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListConstraintsForPortfolioOutput) => void): Request<ServiceCatalog.Types.ListConstraintsForPortfolioOutput, AWSError>;
  /**
   * Lists the constraints for the specified portfolio and product.
   */
  listConstraintsForPortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.ListConstraintsForPortfolioOutput) => void): Request<ServiceCatalog.Types.ListConstraintsForPortfolioOutput, AWSError>;
  /**
   * Lists the paths to the specified product. A path is how the user has access to a specified product, and is necessary when provisioning a product. A path also determines the constraints put on the product.
   */
  listLaunchPaths(params: ServiceCatalog.Types.ListLaunchPathsInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListLaunchPathsOutput) => void): Request<ServiceCatalog.Types.ListLaunchPathsOutput, AWSError>;
  /**
   * Lists the paths to the specified product. A path is how the user has access to a specified product, and is necessary when provisioning a product. A path also determines the constraints put on the product.
   */
  listLaunchPaths(callback?: (err: AWSError, data: ServiceCatalog.Types.ListLaunchPathsOutput) => void): Request<ServiceCatalog.Types.ListLaunchPathsOutput, AWSError>;
  /**
   * Lists the organization nodes that have access to the specified portfolio. This API can only be called by the management account in the organization or by a delegated admin. If a delegated admin is de-registered, they can no longer perform this operation.
   */
  listOrganizationPortfolioAccess(params: ServiceCatalog.Types.ListOrganizationPortfolioAccessInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListOrganizationPortfolioAccessOutput) => void): Request<ServiceCatalog.Types.ListOrganizationPortfolioAccessOutput, AWSError>;
  /**
   * Lists the organization nodes that have access to the specified portfolio. This API can only be called by the management account in the organization or by a delegated admin. If a delegated admin is de-registered, they can no longer perform this operation.
   */
  listOrganizationPortfolioAccess(callback?: (err: AWSError, data: ServiceCatalog.Types.ListOrganizationPortfolioAccessOutput) => void): Request<ServiceCatalog.Types.ListOrganizationPortfolioAccessOutput, AWSError>;
  /**
   * Lists the account IDs that have access to the specified portfolio. A delegated admin can list the accounts that have access to the shared portfolio. Note that if a delegated admin is de-registered, they can no longer perform this operation.
   */
  listPortfolioAccess(params: ServiceCatalog.Types.ListPortfolioAccessInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListPortfolioAccessOutput) => void): Request<ServiceCatalog.Types.ListPortfolioAccessOutput, AWSError>;
  /**
   * Lists the account IDs that have access to the specified portfolio. A delegated admin can list the accounts that have access to the shared portfolio. Note that if a delegated admin is de-registered, they can no longer perform this operation.
   */
  listPortfolioAccess(callback?: (err: AWSError, data: ServiceCatalog.Types.ListPortfolioAccessOutput) => void): Request<ServiceCatalog.Types.ListPortfolioAccessOutput, AWSError>;
  /**
   * Lists all portfolios in the catalog.
   */
  listPortfolios(params: ServiceCatalog.Types.ListPortfoliosInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListPortfoliosOutput) => void): Request<ServiceCatalog.Types.ListPortfoliosOutput, AWSError>;
  /**
   * Lists all portfolios in the catalog.
   */
  listPortfolios(callback?: (err: AWSError, data: ServiceCatalog.Types.ListPortfoliosOutput) => void): Request<ServiceCatalog.Types.ListPortfoliosOutput, AWSError>;
  /**
   * Lists all portfolios that the specified product is associated with.
   */
  listPortfoliosForProduct(params: ServiceCatalog.Types.ListPortfoliosForProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListPortfoliosForProductOutput) => void): Request<ServiceCatalog.Types.ListPortfoliosForProductOutput, AWSError>;
  /**
   * Lists all portfolios that the specified product is associated with.
   */
  listPortfoliosForProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.ListPortfoliosForProductOutput) => void): Request<ServiceCatalog.Types.ListPortfoliosForProductOutput, AWSError>;
  /**
   * Lists all principal ARNs associated with the specified portfolio.
   */
  listPrincipalsForPortfolio(params: ServiceCatalog.Types.ListPrincipalsForPortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListPrincipalsForPortfolioOutput) => void): Request<ServiceCatalog.Types.ListPrincipalsForPortfolioOutput, AWSError>;
  /**
   * Lists all principal ARNs associated with the specified portfolio.
   */
  listPrincipalsForPortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.ListPrincipalsForPortfolioOutput) => void): Request<ServiceCatalog.Types.ListPrincipalsForPortfolioOutput, AWSError>;
  /**
   * Lists the plans for the specified provisioned product or all plans to which the user has access.
   */
  listProvisionedProductPlans(params: ServiceCatalog.Types.ListProvisionedProductPlansInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListProvisionedProductPlansOutput) => void): Request<ServiceCatalog.Types.ListProvisionedProductPlansOutput, AWSError>;
  /**
   * Lists the plans for the specified provisioned product or all plans to which the user has access.
   */
  listProvisionedProductPlans(callback?: (err: AWSError, data: ServiceCatalog.Types.ListProvisionedProductPlansOutput) => void): Request<ServiceCatalog.Types.ListProvisionedProductPlansOutput, AWSError>;
  /**
   * Lists all provisioning artifacts (also known as versions) for the specified product.
   */
  listProvisioningArtifacts(params: ServiceCatalog.Types.ListProvisioningArtifactsInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListProvisioningArtifactsOutput) => void): Request<ServiceCatalog.Types.ListProvisioningArtifactsOutput, AWSError>;
  /**
   * Lists all provisioning artifacts (also known as versions) for the specified product.
   */
  listProvisioningArtifacts(callback?: (err: AWSError, data: ServiceCatalog.Types.ListProvisioningArtifactsOutput) => void): Request<ServiceCatalog.Types.ListProvisioningArtifactsOutput, AWSError>;
  /**
   * Lists all provisioning artifacts (also known as versions) for the specified self-service action.
   */
  listProvisioningArtifactsForServiceAction(params: ServiceCatalog.Types.ListProvisioningArtifactsForServiceActionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListProvisioningArtifactsForServiceActionOutput) => void): Request<ServiceCatalog.Types.ListProvisioningArtifactsForServiceActionOutput, AWSError>;
  /**
   * Lists all provisioning artifacts (also known as versions) for the specified self-service action.
   */
  listProvisioningArtifactsForServiceAction(callback?: (err: AWSError, data: ServiceCatalog.Types.ListProvisioningArtifactsForServiceActionOutput) => void): Request<ServiceCatalog.Types.ListProvisioningArtifactsForServiceActionOutput, AWSError>;
  /**
   * Lists the specified requests or all performed requests.
   */
  listRecordHistory(params: ServiceCatalog.Types.ListRecordHistoryInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListRecordHistoryOutput) => void): Request<ServiceCatalog.Types.ListRecordHistoryOutput, AWSError>;
  /**
   * Lists the specified requests or all performed requests.
   */
  listRecordHistory(callback?: (err: AWSError, data: ServiceCatalog.Types.ListRecordHistoryOutput) => void): Request<ServiceCatalog.Types.ListRecordHistoryOutput, AWSError>;
  /**
   * Lists the resources associated with the specified TagOption.
   */
  listResourcesForTagOption(params: ServiceCatalog.Types.ListResourcesForTagOptionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListResourcesForTagOptionOutput) => void): Request<ServiceCatalog.Types.ListResourcesForTagOptionOutput, AWSError>;
  /**
   * Lists the resources associated with the specified TagOption.
   */
  listResourcesForTagOption(callback?: (err: AWSError, data: ServiceCatalog.Types.ListResourcesForTagOptionOutput) => void): Request<ServiceCatalog.Types.ListResourcesForTagOptionOutput, AWSError>;
  /**
   * Lists all self-service actions.
   */
  listServiceActions(params: ServiceCatalog.Types.ListServiceActionsInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListServiceActionsOutput) => void): Request<ServiceCatalog.Types.ListServiceActionsOutput, AWSError>;
  /**
   * Lists all self-service actions.
   */
  listServiceActions(callback?: (err: AWSError, data: ServiceCatalog.Types.ListServiceActionsOutput) => void): Request<ServiceCatalog.Types.ListServiceActionsOutput, AWSError>;
  /**
   * Returns a paginated list of self-service actions associated with the specified Product ID and Provisioning Artifact ID.
   */
  listServiceActionsForProvisioningArtifact(params: ServiceCatalog.Types.ListServiceActionsForProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListServiceActionsForProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.ListServiceActionsForProvisioningArtifactOutput, AWSError>;
  /**
   * Returns a paginated list of self-service actions associated with the specified Product ID and Provisioning Artifact ID.
   */
  listServiceActionsForProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.ListServiceActionsForProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.ListServiceActionsForProvisioningArtifactOutput, AWSError>;
  /**
   * Returns summary information about stack instances that are associated with the specified CFN_STACKSET type provisioned product. You can filter for stack instances that are associated with a specific AWS account name or region. 
   */
  listStackInstancesForProvisionedProduct(params: ServiceCatalog.Types.ListStackInstancesForProvisionedProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListStackInstancesForProvisionedProductOutput) => void): Request<ServiceCatalog.Types.ListStackInstancesForProvisionedProductOutput, AWSError>;
  /**
   * Returns summary information about stack instances that are associated with the specified CFN_STACKSET type provisioned product. You can filter for stack instances that are associated with a specific AWS account name or region. 
   */
  listStackInstancesForProvisionedProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.ListStackInstancesForProvisionedProductOutput) => void): Request<ServiceCatalog.Types.ListStackInstancesForProvisionedProductOutput, AWSError>;
  /**
   * Lists the specified TagOptions or all TagOptions.
   */
  listTagOptions(params: ServiceCatalog.Types.ListTagOptionsInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ListTagOptionsOutput) => void): Request<ServiceCatalog.Types.ListTagOptionsOutput, AWSError>;
  /**
   * Lists the specified TagOptions or all TagOptions.
   */
  listTagOptions(callback?: (err: AWSError, data: ServiceCatalog.Types.ListTagOptionsOutput) => void): Request<ServiceCatalog.Types.ListTagOptionsOutput, AWSError>;
  /**
   * Provisions the specified product. A provisioned product is a resourced instance of a product. For example, provisioning a product based on a CloudFormation template launches a CloudFormation stack and its underlying resources. You can check the status of this request using DescribeRecord. If the request contains a tag key with an empty list of values, there is a tag conflict for that key. Do not include conflicted keys as tags, or this causes the error "Parameter validation failed: Missing required parameter in Tags[N]:Value".
   */
  provisionProduct(params: ServiceCatalog.Types.ProvisionProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ProvisionProductOutput) => void): Request<ServiceCatalog.Types.ProvisionProductOutput, AWSError>;
  /**
   * Provisions the specified product. A provisioned product is a resourced instance of a product. For example, provisioning a product based on a CloudFormation template launches a CloudFormation stack and its underlying resources. You can check the status of this request using DescribeRecord. If the request contains a tag key with an empty list of values, there is a tag conflict for that key. Do not include conflicted keys as tags, or this causes the error "Parameter validation failed: Missing required parameter in Tags[N]:Value".
   */
  provisionProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.ProvisionProductOutput) => void): Request<ServiceCatalog.Types.ProvisionProductOutput, AWSError>;
  /**
   * Rejects an offer to share the specified portfolio.
   */
  rejectPortfolioShare(params: ServiceCatalog.Types.RejectPortfolioShareInput, callback?: (err: AWSError, data: ServiceCatalog.Types.RejectPortfolioShareOutput) => void): Request<ServiceCatalog.Types.RejectPortfolioShareOutput, AWSError>;
  /**
   * Rejects an offer to share the specified portfolio.
   */
  rejectPortfolioShare(callback?: (err: AWSError, data: ServiceCatalog.Types.RejectPortfolioShareOutput) => void): Request<ServiceCatalog.Types.RejectPortfolioShareOutput, AWSError>;
  /**
   * Lists the provisioned products that are available (not terminated). To use additional filtering, see SearchProvisionedProducts.
   */
  scanProvisionedProducts(params: ServiceCatalog.Types.ScanProvisionedProductsInput, callback?: (err: AWSError, data: ServiceCatalog.Types.ScanProvisionedProductsOutput) => void): Request<ServiceCatalog.Types.ScanProvisionedProductsOutput, AWSError>;
  /**
   * Lists the provisioned products that are available (not terminated). To use additional filtering, see SearchProvisionedProducts.
   */
  scanProvisionedProducts(callback?: (err: AWSError, data: ServiceCatalog.Types.ScanProvisionedProductsOutput) => void): Request<ServiceCatalog.Types.ScanProvisionedProductsOutput, AWSError>;
  /**
   * Gets information about the products to which the caller has access.
   */
  searchProducts(params: ServiceCatalog.Types.SearchProductsInput, callback?: (err: AWSError, data: ServiceCatalog.Types.SearchProductsOutput) => void): Request<ServiceCatalog.Types.SearchProductsOutput, AWSError>;
  /**
   * Gets information about the products to which the caller has access.
   */
  searchProducts(callback?: (err: AWSError, data: ServiceCatalog.Types.SearchProductsOutput) => void): Request<ServiceCatalog.Types.SearchProductsOutput, AWSError>;
  /**
   * Gets information about the products for the specified portfolio or all products.
   */
  searchProductsAsAdmin(params: ServiceCatalog.Types.SearchProductsAsAdminInput, callback?: (err: AWSError, data: ServiceCatalog.Types.SearchProductsAsAdminOutput) => void): Request<ServiceCatalog.Types.SearchProductsAsAdminOutput, AWSError>;
  /**
   * Gets information about the products for the specified portfolio or all products.
   */
  searchProductsAsAdmin(callback?: (err: AWSError, data: ServiceCatalog.Types.SearchProductsAsAdminOutput) => void): Request<ServiceCatalog.Types.SearchProductsAsAdminOutput, AWSError>;
  /**
   * Gets information about the provisioned products that meet the specified criteria.
   */
  searchProvisionedProducts(params: ServiceCatalog.Types.SearchProvisionedProductsInput, callback?: (err: AWSError, data: ServiceCatalog.Types.SearchProvisionedProductsOutput) => void): Request<ServiceCatalog.Types.SearchProvisionedProductsOutput, AWSError>;
  /**
   * Gets information about the provisioned products that meet the specified criteria.
   */
  searchProvisionedProducts(callback?: (err: AWSError, data: ServiceCatalog.Types.SearchProvisionedProductsOutput) => void): Request<ServiceCatalog.Types.SearchProvisionedProductsOutput, AWSError>;
  /**
   * Terminates the specified provisioned product. This operation does not delete any records associated with the provisioned product. You can check the status of this request using DescribeRecord.
   */
  terminateProvisionedProduct(params: ServiceCatalog.Types.TerminateProvisionedProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.TerminateProvisionedProductOutput) => void): Request<ServiceCatalog.Types.TerminateProvisionedProductOutput, AWSError>;
  /**
   * Terminates the specified provisioned product. This operation does not delete any records associated with the provisioned product. You can check the status of this request using DescribeRecord.
   */
  terminateProvisionedProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.TerminateProvisionedProductOutput) => void): Request<ServiceCatalog.Types.TerminateProvisionedProductOutput, AWSError>;
  /**
   * Updates the specified constraint.
   */
  updateConstraint(params: ServiceCatalog.Types.UpdateConstraintInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateConstraintOutput) => void): Request<ServiceCatalog.Types.UpdateConstraintOutput, AWSError>;
  /**
   * Updates the specified constraint.
   */
  updateConstraint(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateConstraintOutput) => void): Request<ServiceCatalog.Types.UpdateConstraintOutput, AWSError>;
  /**
   * Updates the specified portfolio. You cannot update a product that was shared with you.
   */
  updatePortfolio(params: ServiceCatalog.Types.UpdatePortfolioInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdatePortfolioOutput) => void): Request<ServiceCatalog.Types.UpdatePortfolioOutput, AWSError>;
  /**
   * Updates the specified portfolio. You cannot update a product that was shared with you.
   */
  updatePortfolio(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdatePortfolioOutput) => void): Request<ServiceCatalog.Types.UpdatePortfolioOutput, AWSError>;
  /**
   * Updates the specified portfolio share. You can use this API to enable or disable TagOptions sharing for an existing portfolio share.  The portfolio share cannot be updated if the  CreatePortfolioShare operation is IN_PROGRESS, as the share is not available to recipient entities. In this case, you must wait for the portfolio share to be COMPLETED. You must provide the accountId or organization node in the input, but not both. If the portfolio is shared to both an external account and an organization node, and both shares need to be updated, you must invoke UpdatePortfolioShare separately for each share type.  This API cannot be used for removing the portfolio share. You must use DeletePortfolioShare API for that action. 
   */
  updatePortfolioShare(params: ServiceCatalog.Types.UpdatePortfolioShareInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdatePortfolioShareOutput) => void): Request<ServiceCatalog.Types.UpdatePortfolioShareOutput, AWSError>;
  /**
   * Updates the specified portfolio share. You can use this API to enable or disable TagOptions sharing for an existing portfolio share.  The portfolio share cannot be updated if the  CreatePortfolioShare operation is IN_PROGRESS, as the share is not available to recipient entities. In this case, you must wait for the portfolio share to be COMPLETED. You must provide the accountId or organization node in the input, but not both. If the portfolio is shared to both an external account and an organization node, and both shares need to be updated, you must invoke UpdatePortfolioShare separately for each share type.  This API cannot be used for removing the portfolio share. You must use DeletePortfolioShare API for that action. 
   */
  updatePortfolioShare(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdatePortfolioShareOutput) => void): Request<ServiceCatalog.Types.UpdatePortfolioShareOutput, AWSError>;
  /**
   * Updates the specified product.
   */
  updateProduct(params: ServiceCatalog.Types.UpdateProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateProductOutput) => void): Request<ServiceCatalog.Types.UpdateProductOutput, AWSError>;
  /**
   * Updates the specified product.
   */
  updateProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateProductOutput) => void): Request<ServiceCatalog.Types.UpdateProductOutput, AWSError>;
  /**
   * Requests updates to the configuration of the specified provisioned product. If there are tags associated with the object, they cannot be updated or added. Depending on the specific updates requested, this operation can update with no interruption, with some interruption, or replace the provisioned product entirely. You can check the status of this request using DescribeRecord.
   */
  updateProvisionedProduct(params: ServiceCatalog.Types.UpdateProvisionedProductInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateProvisionedProductOutput) => void): Request<ServiceCatalog.Types.UpdateProvisionedProductOutput, AWSError>;
  /**
   * Requests updates to the configuration of the specified provisioned product. If there are tags associated with the object, they cannot be updated or added. Depending on the specific updates requested, this operation can update with no interruption, with some interruption, or replace the provisioned product entirely. You can check the status of this request using DescribeRecord.
   */
  updateProvisionedProduct(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateProvisionedProductOutput) => void): Request<ServiceCatalog.Types.UpdateProvisionedProductOutput, AWSError>;
  /**
   * Requests updates to the properties of the specified provisioned product.
   */
  updateProvisionedProductProperties(params: ServiceCatalog.Types.UpdateProvisionedProductPropertiesInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateProvisionedProductPropertiesOutput) => void): Request<ServiceCatalog.Types.UpdateProvisionedProductPropertiesOutput, AWSError>;
  /**
   * Requests updates to the properties of the specified provisioned product.
   */
  updateProvisionedProductProperties(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateProvisionedProductPropertiesOutput) => void): Request<ServiceCatalog.Types.UpdateProvisionedProductPropertiesOutput, AWSError>;
  /**
   * Updates the specified provisioning artifact (also known as a version) for the specified product. You cannot update a provisioning artifact for a product that was shared with you.
   */
  updateProvisioningArtifact(params: ServiceCatalog.Types.UpdateProvisioningArtifactInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.UpdateProvisioningArtifactOutput, AWSError>;
  /**
   * Updates the specified provisioning artifact (also known as a version) for the specified product. You cannot update a provisioning artifact for a product that was shared with you.
   */
  updateProvisioningArtifact(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateProvisioningArtifactOutput) => void): Request<ServiceCatalog.Types.UpdateProvisioningArtifactOutput, AWSError>;
  /**
   * Updates a self-service action.
   */
  updateServiceAction(params: ServiceCatalog.Types.UpdateServiceActionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateServiceActionOutput) => void): Request<ServiceCatalog.Types.UpdateServiceActionOutput, AWSError>;
  /**
   * Updates a self-service action.
   */
  updateServiceAction(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateServiceActionOutput) => void): Request<ServiceCatalog.Types.UpdateServiceActionOutput, AWSError>;
  /**
   * Updates the specified TagOption.
   */
  updateTagOption(params: ServiceCatalog.Types.UpdateTagOptionInput, callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateTagOptionOutput) => void): Request<ServiceCatalog.Types.UpdateTagOptionOutput, AWSError>;
  /**
   * Updates the specified TagOption.
   */
  updateTagOption(callback?: (err: AWSError, data: ServiceCatalog.Types.UpdateTagOptionOutput) => void): Request<ServiceCatalog.Types.UpdateTagOptionOutput, AWSError>;
}
declare namespace ServiceCatalog {
  export type AcceptLanguage = string;
  export interface AcceptPortfolioShareInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The type of shared portfolios to accept. The default is to accept imported portfolios.    AWS_ORGANIZATIONS - Accept portfolios shared by the management account of your organization.    IMPORTED - Accept imported portfolios.    AWS_SERVICECATALOG - Not supported. (Throws ResourceNotFoundException.)   For example, aws servicecatalog accept-portfolio-share --portfolio-id "port-2qwzkwxt3y5fk" --portfolio-share-type AWS_ORGANIZATIONS 
     */
    PortfolioShareType?: PortfolioShareType;
  }
  export interface AcceptPortfolioShareOutput {
  }
  export interface AccessLevelFilter {
    /**
     * The access level.    Account - Filter results based on the account.    Role - Filter results based on the federated role of the specified user.    User - Filter results based on the specified user.  
     */
    Key?: AccessLevelFilterKey;
    /**
     * The user to which the access level applies. The only supported value is Self.
     */
    Value?: AccessLevelFilterValue;
  }
  export type AccessLevelFilterKey = "Account"|"Role"|"User"|string;
  export type AccessLevelFilterValue = string;
  export type AccessStatus = "ENABLED"|"UNDER_CHANGE"|"DISABLED"|string;
  export type AccountId = string;
  export type AccountIds = AccountId[];
  export type AddTags = Tag[];
  export type AllowedValues = String[];
  export type ApproximateCount = number;
  export interface AssociateBudgetWithResourceInput {
    /**
     * The name of the budget you want to associate.
     */
    BudgetName: BudgetName;
    /**
     *  The resource identifier. Either a portfolio-id or a product-id.
     */
    ResourceId: Id;
  }
  export interface AssociateBudgetWithResourceOutput {
  }
  export interface AssociatePrincipalWithPortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The ARN of the principal (IAM user, role, or group).
     */
    PrincipalARN: PrincipalARN;
    /**
     * The principal type. The supported value is IAM.
     */
    PrincipalType: PrincipalType;
  }
  export interface AssociatePrincipalWithPortfolioOutput {
  }
  export interface AssociateProductWithPortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The identifier of the source portfolio.
     */
    SourcePortfolioId?: Id;
  }
  export interface AssociateProductWithPortfolioOutput {
  }
  export interface AssociateServiceActionWithProvisioningArtifactInput {
    /**
     * The product identifier. For example, prod-abcdzk7xy33qa.
     */
    ProductId: Id;
    /**
     * The identifier of the provisioning artifact. For example, pa-4abcdjnxjj6ne.
     */
    ProvisioningArtifactId: Id;
    /**
     * The self-service action identifier. For example, act-fs7abcd89wxyz.
     */
    ServiceActionId: Id;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface AssociateServiceActionWithProvisioningArtifactOutput {
  }
  export interface AssociateTagOptionWithResourceInput {
    /**
     * The resource identifier.
     */
    ResourceId: ResourceId;
    /**
     * The TagOption identifier.
     */
    TagOptionId: TagOptionId;
  }
  export interface AssociateTagOptionWithResourceOutput {
  }
  export type AttributeValue = string;
  export interface BatchAssociateServiceActionWithProvisioningArtifactInput {
    /**
     * One or more associations, each consisting of the Action ID, the Product ID, and the Provisioning Artifact ID.
     */
    ServiceActionAssociations: ServiceActionAssociations;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface BatchAssociateServiceActionWithProvisioningArtifactOutput {
    /**
     * An object that contains a list of errors, along with information to help you identify the self-service action.
     */
    FailedServiceActionAssociations?: FailedServiceActionAssociations;
  }
  export interface BatchDisassociateServiceActionFromProvisioningArtifactInput {
    /**
     * One or more associations, each consisting of the Action ID, the Product ID, and the Provisioning Artifact ID.
     */
    ServiceActionAssociations: ServiceActionAssociations;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface BatchDisassociateServiceActionFromProvisioningArtifactOutput {
    /**
     * An object that contains a list of errors, along with information to help you identify the self-service action.
     */
    FailedServiceActionAssociations?: FailedServiceActionAssociations;
  }
  export type Boolean = boolean;
  export interface BudgetDetail {
    /**
     * Name of the associated budget.
     */
    BudgetName?: BudgetName;
  }
  export type BudgetName = string;
  export type Budgets = BudgetDetail[];
  export type CausingEntity = string;
  export type ChangeAction = "ADD"|"MODIFY"|"REMOVE"|string;
  export interface CloudWatchDashboard {
    /**
     * The name of the CloudWatch dashboard.
     */
    Name?: CloudWatchDashboardName;
  }
  export type CloudWatchDashboardName = string;
  export type CloudWatchDashboards = CloudWatchDashboard[];
  export type ConstraintDescription = string;
  export interface ConstraintDetail {
    /**
     * The identifier of the constraint.
     */
    ConstraintId?: Id;
    /**
     * The type of constraint.    LAUNCH     NOTIFICATION    STACKSET    TEMPLATE   
     */
    Type?: ConstraintType;
    /**
     * The description of the constraint.
     */
    Description?: ConstraintDescription;
    /**
     * The owner of the constraint.
     */
    Owner?: AccountId;
    /**
     * The identifier of the product the constraint applies to. Note that a constraint applies to a specific instance of a product within a certain portfolio.
     */
    ProductId?: Id;
    /**
     * The identifier of the portfolio the product resides in. The constraint applies only to the instance of the product that lives within this portfolio.
     */
    PortfolioId?: Id;
  }
  export type ConstraintDetails = ConstraintDetail[];
  export type ConstraintParameters = string;
  export type ConstraintSummaries = ConstraintSummary[];
  export interface ConstraintSummary {
    /**
     * The type of constraint.    LAUNCH     NOTIFICATION    STACKSET    TEMPLATE   
     */
    Type?: ConstraintType;
    /**
     * The description of the constraint.
     */
    Description?: ConstraintDescription;
  }
  export type ConstraintType = string;
  export type CopyOption = "CopyTags"|string;
  export type CopyOptions = CopyOption[];
  export interface CopyProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The Amazon Resource Name (ARN) of the source product.
     */
    SourceProductArn: ProductArn;
    /**
     * The identifier of the target product. By default, a new product is created.
     */
    TargetProductId?: Id;
    /**
     * A name for the target product. The default is the name of the source product.
     */
    TargetProductName?: ProductViewName;
    /**
     * The identifiers of the provisioning artifacts (also known as versions) of the product to copy. By default, all provisioning artifacts are copied.
     */
    SourceProvisioningArtifactIdentifiers?: SourceProvisioningArtifactProperties;
    /**
     * The copy options. If the value is CopyTags, the tags from the source product are copied to the target product.
     */
    CopyOptions?: CopyOptions;
    /**
     *  A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request. 
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CopyProductOutput {
    /**
     * The token to use to track the progress of the operation.
     */
    CopyProductToken?: Id;
  }
  export type CopyProductStatus = "SUCCEEDED"|"IN_PROGRESS"|"FAILED"|string;
  export interface CreateConstraintInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The constraint parameters, in JSON format. The syntax depends on the constraint type as follows:  LAUNCH  You are required to specify either the RoleArn or the LocalRoleName but can't use both. Specify the RoleArn property as follows:  {"RoleArn" : "arn:aws:iam::123456789012:role/LaunchRole"}  Specify the LocalRoleName property as follows:  {"LocalRoleName": "SCBasicLaunchRole"}  If you specify the LocalRoleName property, when an account uses the launch constraint, the IAM role with that name in the account will be used. This allows launch-role constraints to be account-agnostic so the administrator can create fewer resources per shared account.  The given role name must exist in the account used to create the launch constraint and the account of the user who launches a product with this launch constraint.  You cannot have both a LAUNCH and a STACKSET constraint. You also cannot have more than one LAUNCH constraint on a product and portfolio.  NOTIFICATION  Specify the NotificationArns property as follows:  {"NotificationArns" : ["arn:aws:sns:us-east-1:123456789012:Topic"]}   RESOURCE_UPDATE  Specify the TagUpdatesOnProvisionedProduct property as follows:  {"Version":"2.0","Properties":{"TagUpdateOnProvisionedProduct":"String"}}  The TagUpdatesOnProvisionedProduct property accepts a string value of ALLOWED or NOT_ALLOWED.  STACKSET  Specify the Parameters property as follows:  {"Version": "String", "Properties": {"AccountList": [ "String" ], "RegionList": [ "String" ], "AdminRole": "String", "ExecutionRole": "String"}}  You cannot have both a LAUNCH and a STACKSET constraint. You also cannot have more than one STACKSET constraint on a product and portfolio. Products with a STACKSET constraint will launch an AWS CloudFormation stack set.  TEMPLATE  Specify the Rules property. For more information, see Template Constraint Rules.  
     */
    Parameters: ConstraintParameters;
    /**
     * The type of constraint.    LAUNCH     NOTIFICATION     RESOURCE_UPDATE     STACKSET     TEMPLATE   
     */
    Type: ConstraintType;
    /**
     * The description of the constraint.
     */
    Description?: ConstraintDescription;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CreateConstraintOutput {
    /**
     * Information about the constraint.
     */
    ConstraintDetail?: ConstraintDetail;
    /**
     * The constraint parameters.
     */
    ConstraintParameters?: ConstraintParameters;
    /**
     * The status of the current request.
     */
    Status?: Status;
  }
  export interface CreatePortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The name to use for display purposes.
     */
    DisplayName: PortfolioDisplayName;
    /**
     * The description of the portfolio.
     */
    Description?: PortfolioDescription;
    /**
     * The name of the portfolio provider.
     */
    ProviderName: ProviderName;
    /**
     * One or more tags.
     */
    Tags?: AddTags;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CreatePortfolioOutput {
    /**
     * Information about the portfolio.
     */
    PortfolioDetail?: PortfolioDetail;
    /**
     * Information about the tags associated with the portfolio.
     */
    Tags?: Tags;
  }
  export interface CreatePortfolioShareInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The AWS account ID. For example, 123456789012.
     */
    AccountId?: AccountId;
    /**
     * The organization node to whom you are going to share. If OrganizationNode is passed in, PortfolioShare will be created for the node an ListOrganizationPortfolioAccessd its children (when applies), and a PortfolioShareToken will be returned in the output in order for the administrator to monitor the status of the PortfolioShare creation process.
     */
    OrganizationNode?: OrganizationNode;
    /**
     * Enables or disables TagOptions  sharing when creating the portfolio share. If this flag is not provided, TagOptions sharing is disabled.
     */
    ShareTagOptions?: Boolean;
  }
  export interface CreatePortfolioShareOutput {
    /**
     * The portfolio shares a unique identifier that only returns if the portfolio is shared to an organization node.
     */
    PortfolioShareToken?: Id;
  }
  export interface CreateProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The name of the product.
     */
    Name: ProductViewName;
    /**
     * The owner of the product.
     */
    Owner: ProductViewOwner;
    /**
     * The description of the product.
     */
    Description?: ProductViewShortDescription;
    /**
     * The distributor of the product.
     */
    Distributor?: ProductViewOwner;
    /**
     * The support information about the product.
     */
    SupportDescription?: SupportDescription;
    /**
     * The contact email for product support.
     */
    SupportEmail?: SupportEmail;
    /**
     * The contact URL for product support.  ^https?:\/\// / is the pattern used to validate SupportUrl.
     */
    SupportUrl?: SupportUrl;
    /**
     * The type of product.
     */
    ProductType: ProductType;
    /**
     * One or more tags.
     */
    Tags?: AddTags;
    /**
     * The configuration of the provisioning artifact. 
     */
    ProvisioningArtifactParameters: ProvisioningArtifactProperties;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CreateProductOutput {
    /**
     * Information about the product view.
     */
    ProductViewDetail?: ProductViewDetail;
    /**
     * Information about the provisioning artifact. 
     */
    ProvisioningArtifactDetail?: ProvisioningArtifactDetail;
    /**
     * Information about the tags associated with the product.
     */
    Tags?: Tags;
  }
  export interface CreateProvisionedProductPlanInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The name of the plan.
     */
    PlanName: ProvisionedProductPlanName;
    /**
     * The plan type.
     */
    PlanType: ProvisionedProductPlanType;
    /**
     * Passed to CloudFormation. The SNS topic ARNs to which to publish stack-related events.
     */
    NotificationArns?: NotificationArns;
    /**
     * The path identifier of the product. This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use ListLaunchPaths.
     */
    PathId?: Id;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * A user-friendly name for the provisioned product. This value must be unique for the AWS account and cannot be updated after the product is provisioned.
     */
    ProvisionedProductName: ProvisionedProductName;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId: Id;
    /**
     * Parameters specified by the administrator that are required for provisioning the product.
     */
    ProvisioningParameters?: UpdateProvisioningParameters;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken: IdempotencyToken;
    /**
     * One or more tags. If the plan is for an existing provisioned product, the product must have a RESOURCE_UPDATE constraint with TagUpdatesOnProvisionedProduct set to ALLOWED to allow tag updates.
     */
    Tags?: Tags;
  }
  export interface CreateProvisionedProductPlanOutput {
    /**
     * The name of the plan.
     */
    PlanName?: ProvisionedProductPlanName;
    /**
     * The plan identifier.
     */
    PlanId?: Id;
    /**
     * The product identifier.
     */
    ProvisionProductId?: Id;
    /**
     * The user-friendly name of the provisioned product.
     */
    ProvisionedProductName?: ProvisionedProductName;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId?: Id;
  }
  export interface CreateProvisioningArtifactInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The configuration for the provisioning artifact.
     */
    Parameters: ProvisioningArtifactProperties;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CreateProvisioningArtifactOutput {
    /**
     * Information about the provisioning artifact.
     */
    ProvisioningArtifactDetail?: ProvisioningArtifactDetail;
    /**
     * Specify the template source with one of the following options, but not both. Keys accepted: [ LoadTemplateFromURL, ImportFromPhysicalId ]. The URL of the CloudFormation template in Amazon S3, in JSON format.   LoadTemplateFromURL  Use the URL of the CloudFormation template in Amazon S3 in JSON format.  ImportFromPhysicalId  Use the physical id of the resource that contains the template; currently supports CloudFormation stack ARN.
     */
    Info?: ProvisioningArtifactInfo;
    /**
     * The status of the current request.
     */
    Status?: Status;
  }
  export interface CreateServiceActionInput {
    /**
     * The self-service action name.
     */
    Name: ServiceActionName;
    /**
     * The service action definition type. For example, SSM_AUTOMATION.
     */
    DefinitionType: ServiceActionDefinitionType;
    /**
     * The self-service action definition. Can be one of the following:  Name  The name of the AWS Systems Manager document (SSM document). For example, AWS-RestartEC2Instance. If you are using a shared SSM document, you must provide the ARN instead of the name.  Version  The AWS Systems Manager automation document version. For example, "Version": "1"   AssumeRole  The Amazon Resource Name (ARN) of the role that performs the self-service actions on your behalf. For example, "AssumeRole": "arn:aws:iam::12345678910:role/ActionRole". To reuse the provisioned product launch role, set to "AssumeRole": "LAUNCH_ROLE".  Parameters  The list of parameters in JSON format. For example: [{\"Name\":\"InstanceId\",\"Type\":\"TARGET\"}] or [{\"Name\":\"InstanceId\",\"Type\":\"TEXT_VALUE\"}].  
     */
    Definition: ServiceActionDefinitionMap;
    /**
     * The self-service action description.
     */
    Description?: ServiceActionDescription;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CreateServiceActionOutput {
    /**
     * An object containing information about the self-service action.
     */
    ServiceActionDetail?: ServiceActionDetail;
  }
  export interface CreateTagOptionInput {
    /**
     * The TagOption key.
     */
    Key: TagOptionKey;
    /**
     * The TagOption value.
     */
    Value: TagOptionValue;
  }
  export interface CreateTagOptionOutput {
    /**
     * Information about the TagOption.
     */
    TagOptionDetail?: TagOptionDetail;
  }
  export type CreatedTime = Date;
  export type CreationTime = Date;
  export type DefaultValue = string;
  export interface DeleteConstraintInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The identifier of the constraint.
     */
    Id: Id;
  }
  export interface DeleteConstraintOutput {
  }
  export interface DeletePortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    Id: Id;
  }
  export interface DeletePortfolioOutput {
  }
  export interface DeletePortfolioShareInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The AWS account ID.
     */
    AccountId?: AccountId;
    /**
     * The organization node to whom you are going to stop sharing.
     */
    OrganizationNode?: OrganizationNode;
  }
  export interface DeletePortfolioShareOutput {
    /**
     * The portfolio share unique identifier. This will only be returned if delete is made to an organization node.
     */
    PortfolioShareToken?: Id;
  }
  export interface DeleteProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    Id: Id;
  }
  export interface DeleteProductOutput {
  }
  export interface DeleteProvisionedProductPlanInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The plan identifier.
     */
    PlanId: Id;
    /**
     * If set to true, AWS Service Catalog stops managing the specified provisioned product even if it cannot delete the underlying resources.
     */
    IgnoreErrors?: IgnoreErrors;
  }
  export interface DeleteProvisionedProductPlanOutput {
  }
  export interface DeleteProvisioningArtifactInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId: Id;
  }
  export interface DeleteProvisioningArtifactOutput {
  }
  export interface DeleteServiceActionInput {
    /**
     * The self-service action identifier. For example, act-fs7abcd89wxyz.
     */
    Id: Id;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface DeleteServiceActionOutput {
  }
  export interface DeleteTagOptionInput {
    /**
     * The TagOption identifier.
     */
    Id: TagOptionId;
  }
  export interface DeleteTagOptionOutput {
  }
  export interface DescribeConstraintInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The identifier of the constraint.
     */
    Id: Id;
  }
  export interface DescribeConstraintOutput {
    /**
     * Information about the constraint.
     */
    ConstraintDetail?: ConstraintDetail;
    /**
     * The constraint parameters.
     */
    ConstraintParameters?: ConstraintParameters;
    /**
     * The status of the current request.
     */
    Status?: Status;
  }
  export interface DescribeCopyProductStatusInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The token for the copy product operation. This token is returned by CopyProduct.
     */
    CopyProductToken: Id;
  }
  export interface DescribeCopyProductStatusOutput {
    /**
     * The status of the copy product operation.
     */
    CopyProductStatus?: CopyProductStatus;
    /**
     * The identifier of the copied product.
     */
    TargetProductId?: Id;
    /**
     * The status message.
     */
    StatusDetail?: StatusDetail;
  }
  export interface DescribePortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    Id: Id;
  }
  export interface DescribePortfolioOutput {
    /**
     * Information about the portfolio.
     */
    PortfolioDetail?: PortfolioDetail;
    /**
     * Information about the tags associated with the portfolio.
     */
    Tags?: Tags;
    /**
     * Information about the TagOptions associated with the portfolio.
     */
    TagOptions?: TagOptionDetails;
    /**
     * Information about the associated budgets.
     */
    Budgets?: Budgets;
  }
  export interface DescribePortfolioShareStatusInput {
    /**
     * The token for the portfolio share operation. This token is returned either by CreatePortfolioShare or by DeletePortfolioShare.
     */
    PortfolioShareToken: Id;
  }
  export interface DescribePortfolioShareStatusOutput {
    /**
     * The token for the portfolio share operation. For example, share-6v24abcdefghi.
     */
    PortfolioShareToken?: Id;
    /**
     * The portfolio identifier.
     */
    PortfolioId?: Id;
    /**
     * Organization node identifier. It can be either account id, organizational unit id or organization id.
     */
    OrganizationNodeValue?: OrganizationNodeValue;
    /**
     * Status of the portfolio share operation.
     */
    Status?: ShareStatus;
    /**
     * Information about the portfolio share operation.
     */
    ShareDetails?: ShareDetails;
  }
  export type DescribePortfolioShareType = "ACCOUNT"|"ORGANIZATION"|"ORGANIZATIONAL_UNIT"|"ORGANIZATION_MEMBER_ACCOUNT"|string;
  export interface DescribePortfolioSharesInput {
    /**
     * The unique identifier of the portfolio for which shares will be retrieved.
     */
    PortfolioId: Id;
    /**
     * The type of portfolio share to summarize. This field acts as a filter on the type of portfolio share, which can be one of the following: 1. ACCOUNT - Represents an external account to account share. 2. ORGANIZATION - Represents a share to an organization. This share is available to every account in the organization. 3. ORGANIZATIONAL_UNIT - Represents a share to an organizational unit. 4. ORGANIZATION_MEMBER_ACCOUNT - Represents a share to an account in the organization.
     */
    Type: DescribePortfolioShareType;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSizeMax100;
  }
  export interface DescribePortfolioSharesOutput {
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
    /**
     * Summaries about each of the portfolio shares.
     */
    PortfolioShareDetails?: PortfolioShareDetails;
  }
  export interface DescribeProductAsAdminInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    Id?: Id;
    /**
     * The product name.
     */
    Name?: ProductViewName;
    /**
     * The unique identifier of the shared portfolio that the specified product is associated with. You can provide this parameter to retrieve the shared TagOptions associated with the product. If this parameter is provided and if TagOptions sharing is enabled in the portfolio share, the API returns both local and shared TagOptions associated with the product. Otherwise only local TagOptions will be returned. 
     */
    SourcePortfolioId?: Id;
  }
  export interface DescribeProductAsAdminOutput {
    /**
     * Information about the product view.
     */
    ProductViewDetail?: ProductViewDetail;
    /**
     * Information about the provisioning artifacts (also known as versions) for the specified product.
     */
    ProvisioningArtifactSummaries?: ProvisioningArtifactSummaries;
    /**
     * Information about the tags associated with the product.
     */
    Tags?: Tags;
    /**
     * Information about the TagOptions associated with the product.
     */
    TagOptions?: TagOptionDetails;
    /**
     * Information about the associated budgets.
     */
    Budgets?: Budgets;
  }
  export interface DescribeProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    Id?: Id;
    /**
     * The product name.
     */
    Name?: ProductViewName;
  }
  export interface DescribeProductOutput {
    /**
     * Summary information about the product view.
     */
    ProductViewSummary?: ProductViewSummary;
    /**
     * Information about the provisioning artifacts for the specified product.
     */
    ProvisioningArtifacts?: ProvisioningArtifacts;
    /**
     * Information about the associated budgets.
     */
    Budgets?: Budgets;
    /**
     * Information about the associated launch paths.
     */
    LaunchPaths?: LaunchPaths;
  }
  export interface DescribeProductViewInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product view identifier.
     */
    Id: Id;
  }
  export interface DescribeProductViewOutput {
    /**
     * Summary information about the product.
     */
    ProductViewSummary?: ProductViewSummary;
    /**
     * Information about the provisioning artifacts for the product.
     */
    ProvisioningArtifacts?: ProvisioningArtifacts;
  }
  export interface DescribeProvisionedProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The provisioned product identifier. You must provide the name or ID, but not both. If you do not provide a name or ID, or you provide both name and ID, an InvalidParametersException will occur.
     */
    Id?: Id;
    /**
     * The name of the provisioned product. You must provide the name or ID, but not both. If you do not provide a name or ID, or you provide both name and ID, an InvalidParametersException will occur.
     */
    Name?: ProvisionedProductName;
  }
  export interface DescribeProvisionedProductOutput {
    /**
     * Information about the provisioned product.
     */
    ProvisionedProductDetail?: ProvisionedProductDetail;
    /**
     * Any CloudWatch dashboards that were created when provisioning the product.
     */
    CloudWatchDashboards?: CloudWatchDashboards;
  }
  export interface DescribeProvisionedProductPlanInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The plan identifier.
     */
    PlanId: Id;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface DescribeProvisionedProductPlanOutput {
    /**
     * Information about the plan.
     */
    ProvisionedProductPlanDetails?: ProvisionedProductPlanDetails;
    /**
     * Information about the resource changes that will occur when the plan is executed.
     */
    ResourceChanges?: ResourceChanges;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface DescribeProvisioningArtifactInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The product identifier.
     */
    ProductId?: Id;
    /**
     * The provisioning artifact name.
     */
    ProvisioningArtifactName?: ProvisioningArtifactName;
    /**
     * The product name.
     */
    ProductName?: ProductViewName;
    /**
     * Indicates whether a verbose level of detail is enabled.
     */
    Verbose?: Verbose;
  }
  export interface DescribeProvisioningArtifactOutput {
    /**
     * Information about the provisioning artifact.
     */
    ProvisioningArtifactDetail?: ProvisioningArtifactDetail;
    /**
     * The URL of the CloudFormation template in Amazon S3.
     */
    Info?: ProvisioningArtifactInfo;
    /**
     * The status of the current request.
     */
    Status?: Status;
  }
  export interface DescribeProvisioningParametersInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier. You must provide the product name or ID, but not both.
     */
    ProductId?: Id;
    /**
     * The name of the product. You must provide the name or ID, but not both.
     */
    ProductName?: ProductViewName;
    /**
     * The identifier of the provisioning artifact. You must provide the name or ID, but not both.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The name of the provisioning artifact. You must provide the name or ID, but not both.
     */
    ProvisioningArtifactName?: ProvisioningArtifactName;
    /**
     * The path identifier of the product. This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use ListLaunchPaths. You must provide the name or ID, but not both.
     */
    PathId?: Id;
    /**
     * The name of the path. You must provide the name or ID, but not both.
     */
    PathName?: PortfolioDisplayName;
  }
  export interface DescribeProvisioningParametersOutput {
    /**
     * Information about the parameters used to provision the product.
     */
    ProvisioningArtifactParameters?: ProvisioningArtifactParameters;
    /**
     * Information about the constraints used to provision the product.
     */
    ConstraintSummaries?: ConstraintSummaries;
    /**
     * Any additional metadata specifically related to the provisioning of the product. For example, see the Version field of the CloudFormation template.
     */
    UsageInstructions?: UsageInstructions;
    /**
     * Information about the TagOptions associated with the resource.
     */
    TagOptions?: TagOptionSummaries;
    /**
     * An object that contains information about preferences, such as regions and accounts, for the provisioning artifact.
     */
    ProvisioningArtifactPreferences?: ProvisioningArtifactPreferences;
    /**
     * The output of the provisioning artifact.
     */
    ProvisioningArtifactOutputs?: ProvisioningArtifactOutputs;
  }
  export interface DescribeRecordInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The record identifier of the provisioned product. This identifier is returned by the request operation.
     */
    Id: Id;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface DescribeRecordOutput {
    /**
     * Information about the product.
     */
    RecordDetail?: RecordDetail;
    /**
     * Information about the product created as the result of a request. For example, the output for a CloudFormation-backed product that creates an S3 bucket would include the S3 bucket URL.
     */
    RecordOutputs?: RecordOutputs;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface DescribeServiceActionExecutionParametersInput {
    /**
     * The identifier of the provisioned product.
     */
    ProvisionedProductId: Id;
    /**
     * The self-service action identifier.
     */
    ServiceActionId: Id;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface DescribeServiceActionExecutionParametersOutput {
    /**
     * The parameters of the self-service action.
     */
    ServiceActionParameters?: ExecutionParameters;
  }
  export interface DescribeServiceActionInput {
    /**
     * The self-service action identifier.
     */
    Id: Id;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface DescribeServiceActionOutput {
    /**
     * Detailed information about the self-service action.
     */
    ServiceActionDetail?: ServiceActionDetail;
  }
  export interface DescribeTagOptionInput {
    /**
     * The TagOption identifier.
     */
    Id: TagOptionId;
  }
  export interface DescribeTagOptionOutput {
    /**
     * Information about the TagOption.
     */
    TagOptionDetail?: TagOptionDetail;
  }
  export type Description = string;
  export interface DisableAWSOrganizationsAccessInput {
  }
  export interface DisableAWSOrganizationsAccessOutput {
  }
  export type DisableTemplateValidation = boolean;
  export interface DisassociateBudgetFromResourceInput {
    /**
     * The name of the budget you want to disassociate.
     */
    BudgetName: BudgetName;
    /**
     * The resource identifier you want to disassociate from. Either a portfolio-id or a product-id.
     */
    ResourceId: Id;
  }
  export interface DisassociateBudgetFromResourceOutput {
  }
  export interface DisassociatePrincipalFromPortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The ARN of the principal (IAM user, role, or group).
     */
    PrincipalARN: PrincipalARN;
  }
  export interface DisassociatePrincipalFromPortfolioOutput {
  }
  export interface DisassociateProductFromPortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
  }
  export interface DisassociateProductFromPortfolioOutput {
  }
  export interface DisassociateServiceActionFromProvisioningArtifactInput {
    /**
     * The product identifier. For example, prod-abcdzk7xy33qa.
     */
    ProductId: Id;
    /**
     * The identifier of the provisioning artifact. For example, pa-4abcdjnxjj6ne.
     */
    ProvisioningArtifactId: Id;
    /**
     * The self-service action identifier. For example, act-fs7abcd89wxyz.
     */
    ServiceActionId: Id;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface DisassociateServiceActionFromProvisioningArtifactOutput {
  }
  export interface DisassociateTagOptionFromResourceInput {
    /**
     * The resource identifier.
     */
    ResourceId: ResourceId;
    /**
     * The TagOption identifier.
     */
    TagOptionId: TagOptionId;
  }
  export interface DisassociateTagOptionFromResourceOutput {
  }
  export interface EnableAWSOrganizationsAccessInput {
  }
  export interface EnableAWSOrganizationsAccessOutput {
  }
  export type Error = string;
  export type ErrorCode = string;
  export type ErrorDescription = string;
  export type EvaluationType = "STATIC"|"DYNAMIC"|string;
  export interface ExecuteProvisionedProductPlanInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The plan identifier.
     */
    PlanId: Id;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface ExecuteProvisionedProductPlanOutput {
    /**
     * Information about the result of provisioning the product.
     */
    RecordDetail?: RecordDetail;
  }
  export interface ExecuteProvisionedProductServiceActionInput {
    /**
     * The identifier of the provisioned product.
     */
    ProvisionedProductId: Id;
    /**
     * The self-service action identifier. For example, act-fs7abcd89wxyz.
     */
    ServiceActionId: Id;
    /**
     * An idempotency token that uniquely identifies the execute request.
     */
    ExecuteToken: IdempotencyToken;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * A map of all self-service action parameters and their values. If a provided parameter is of a special type, such as TARGET, the provided value will override the default value generated by AWS Service Catalog. If the parameters field is not provided, no additional parameters are passed and default values will be used for any special parameters such as TARGET.
     */
    Parameters?: ExecutionParameterMap;
  }
  export interface ExecuteProvisionedProductServiceActionOutput {
    /**
     * An object containing detailed information about the result of provisioning the product.
     */
    RecordDetail?: RecordDetail;
  }
  export interface ExecutionParameter {
    /**
     * The name of the execution parameter.
     */
    Name?: ExecutionParameterKey;
    /**
     * The execution parameter type.
     */
    Type?: ExecutionParameterType;
    /**
     * The default values for the execution parameter.
     */
    DefaultValues?: ExecutionParameterValueList;
  }
  export type ExecutionParameterKey = string;
  export type ExecutionParameterMap = {[key: string]: ExecutionParameterValueList};
  export type ExecutionParameterType = string;
  export type ExecutionParameterValue = string;
  export type ExecutionParameterValueList = ExecutionParameterValue[];
  export type ExecutionParameters = ExecutionParameter[];
  export interface FailedServiceActionAssociation {
    /**
     * The self-service action identifier. For example, act-fs7abcd89wxyz.
     */
    ServiceActionId?: Id;
    /**
     * The product identifier. For example, prod-abcdzk7xy33qa.
     */
    ProductId?: Id;
    /**
     * The identifier of the provisioning artifact. For example, pa-4abcdjnxjj6ne.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The error code. Valid values are listed below.
     */
    ErrorCode?: ServiceActionAssociationErrorCode;
    /**
     * A text description of the error.
     */
    ErrorMessage?: ServiceActionAssociationErrorMessage;
  }
  export type FailedServiceActionAssociations = FailedServiceActionAssociation[];
  export interface GetAWSOrganizationsAccessStatusInput {
  }
  export interface GetAWSOrganizationsAccessStatusOutput {
    /**
     * The status of the portfolio share feature.
     */
    AccessStatus?: AccessStatus;
  }
  export interface GetProvisionedProductOutputsInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The identifier of the provisioned product that you want the outputs from.
     */
    ProvisionedProductId?: Id;
    /**
     * The name of the provisioned product that you want the outputs from.
     */
    ProvisionedProductName?: ProvisionedProductName;
    /**
     * The list of keys that the API should return with their values. If none are provided, the API will return all outputs of the provisioned product.
     */
    OutputKeys?: OutputKeys;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface GetProvisionedProductOutputsOutput {
    /**
     * Information about the product created as the result of a request. For example, the output for a CloudFormation-backed product that creates an S3 bucket would include the S3 bucket URL. 
     */
    Outputs?: RecordOutputs;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export type HasDefaultPath = boolean;
  export type Id = string;
  export type IdempotencyToken = string;
  export type IgnoreErrors = boolean;
  export interface ImportAsProvisionedProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId: Id;
    /**
     * The user-friendly name of the provisioned product. The value must be unique for the AWS account. The name cannot be updated after the product is provisioned. 
     */
    ProvisionedProductName: ProvisionedProductName;
    /**
     * The unique identifier of the resource to be imported. It only currently supports CloudFormation stack IDs.
     */
    PhysicalId: PhysicalId;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface ImportAsProvisionedProductOutput {
    RecordDetail?: RecordDetail;
  }
  export type InstructionType = string;
  export type InstructionValue = string;
  export type LastRequestId = string;
  export interface LaunchPath {
    /**
     * The identifier of the launch path.
     */
    Id?: Id;
    /**
     * The name of the launch path.
     */
    Name?: PortfolioName;
  }
  export type LaunchPathSummaries = LaunchPathSummary[];
  export interface LaunchPathSummary {
    /**
     * The identifier of the product path.
     */
    Id?: Id;
    /**
     * The constraints on the portfolio-product relationship.
     */
    ConstraintSummaries?: ConstraintSummaries;
    /**
     * The tags associated with this product path.
     */
    Tags?: Tags;
    /**
     * The name of the portfolio to which the user was assigned.
     */
    Name?: PortfolioName;
  }
  export type LaunchPaths = LaunchPath[];
  export interface ListAcceptedPortfolioSharesInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSizeMax100;
    /**
     * The type of shared portfolios to list. The default is to list imported portfolios.    AWS_ORGANIZATIONS - List portfolios shared by the management account of your organization    AWS_SERVICECATALOG - List default portfolios    IMPORTED - List imported portfolios  
     */
    PortfolioShareType?: PortfolioShareType;
  }
  export interface ListAcceptedPortfolioSharesOutput {
    /**
     * Information about the portfolios.
     */
    PortfolioDetails?: PortfolioDetails;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListBudgetsForResourceInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The resource identifier.
     */
    ResourceId: Id;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListBudgetsForResourceOutput {
    /**
     * Information about the associated budgets.
     */
    Budgets?: Budgets;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListConstraintsForPortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The product identifier.
     */
    ProductId?: Id;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListConstraintsForPortfolioOutput {
    /**
     * Information about the constraints.
     */
    ConstraintDetails?: ConstraintDetails;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListLaunchPathsInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListLaunchPathsOutput {
    /**
     * Information about the launch path.
     */
    LaunchPathSummaries?: LaunchPathSummaries;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListOrganizationPortfolioAccessInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier. For example, port-2abcdext3y5fk.
     */
    PortfolioId: Id;
    /**
     * The organization node type that will be returned in the output.    ORGANIZATION - Organization that has access to the portfolio.     ORGANIZATIONAL_UNIT - Organizational unit that has access to the portfolio within your organization.    ACCOUNT - Account that has access to the portfolio within your organization.  
     */
    OrganizationNodeType: OrganizationNodeType;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface ListOrganizationPortfolioAccessOutput {
    /**
     * Displays information about the organization nodes.
     */
    OrganizationNodes?: OrganizationNodes;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListPortfolioAccessInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The ID of an organization node the portfolio is shared with. All children of this node with an inherited portfolio share will be returned.
     */
    OrganizationParentId?: Id;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSizeMax100;
  }
  export interface ListPortfolioAccessOutput {
    /**
     * Information about the AWS accounts with access to the portfolio.
     */
    AccountIds?: AccountIds;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListPortfoliosForProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSizeMax100;
  }
  export interface ListPortfoliosForProductOutput {
    /**
     * Information about the portfolios.
     */
    PortfolioDetails?: PortfolioDetails;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListPortfoliosInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSizeMax100;
  }
  export interface ListPortfoliosOutput {
    /**
     * Information about the portfolios.
     */
    PortfolioDetails?: PortfolioDetails;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListPrincipalsForPortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListPrincipalsForPortfolioOutput {
    /**
     * The IAM principals (users or roles) associated with the portfolio.
     */
    Principals?: Principals;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListProvisionedProductPlansInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProvisionProductId?: Id;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The access level to use to obtain results. The default is User.
     */
    AccessLevelFilter?: AccessLevelFilter;
  }
  export interface ListProvisionedProductPlansOutput {
    /**
     * Information about the plans.
     */
    ProvisionedProductPlans?: ProvisionedProductPlans;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListProvisioningArtifactsForServiceActionInput {
    /**
     * The self-service action identifier. For example, act-fs7abcd89wxyz.
     */
    ServiceActionId: Id;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface ListProvisioningArtifactsForServiceActionOutput {
    /**
     * An array of objects with information about product views and provisioning artifacts.
     */
    ProvisioningArtifactViews?: ProvisioningArtifactViews;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListProvisioningArtifactsInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
  }
  export interface ListProvisioningArtifactsOutput {
    /**
     * Information about the provisioning artifacts.
     */
    ProvisioningArtifactDetails?: ProvisioningArtifactDetails;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListRecordHistoryInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The access level to use to obtain results. The default is User.
     */
    AccessLevelFilter?: AccessLevelFilter;
    /**
     * The search filter to scope the results.
     */
    SearchFilter?: ListRecordHistorySearchFilter;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListRecordHistoryOutput {
    /**
     * The records, in reverse chronological order.
     */
    RecordDetails?: RecordDetails;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListRecordHistorySearchFilter {
    /**
     * The filter key.    product - Filter results based on the specified product identifier.    provisionedproduct - Filter results based on the provisioned product identifier.  
     */
    Key?: SearchFilterKey;
    /**
     * The filter value.
     */
    Value?: SearchFilterValue;
  }
  export interface ListResourcesForTagOptionInput {
    /**
     * The TagOption identifier.
     */
    TagOptionId: TagOptionId;
    /**
     * The resource type.    Portfolio     Product   
     */
    ResourceType?: ResourceType;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListResourcesForTagOptionOutput {
    /**
     * Information about the resources.
     */
    ResourceDetails?: ResourceDetails;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListServiceActionsForProvisioningArtifactInput {
    /**
     * The product identifier. For example, prod-abcdzk7xy33qa.
     */
    ProductId: Id;
    /**
     * The identifier of the provisioning artifact. For example, pa-4abcdjnxjj6ne.
     */
    ProvisioningArtifactId: Id;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface ListServiceActionsForProvisioningArtifactOutput {
    /**
     * An object containing information about the self-service actions associated with the provisioning artifact.
     */
    ServiceActionSummaries?: ServiceActionSummaries;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListServiceActionsInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListServiceActionsOutput {
    /**
     * An object containing information about the service actions associated with the provisioning artifact.
     */
    ServiceActionSummaries?: ServiceActionSummaries;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListStackInstancesForProvisionedProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The identifier of the provisioned product.
     */
    ProvisionedProductId: Id;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface ListStackInstancesForProvisionedProductOutput {
    /**
     * List of stack instances.
     */
    StackInstances?: StackInstances;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface ListTagOptionsFilters {
    /**
     * The TagOption key.
     */
    Key?: TagOptionKey;
    /**
     * The TagOption value.
     */
    Value?: TagOptionValue;
    /**
     * The active state.
     */
    Active?: TagOptionActive;
  }
  export interface ListTagOptionsInput {
    /**
     * The search filters. If no search filters are specified, the output includes all TagOptions.
     */
    Filters?: ListTagOptionsFilters;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ListTagOptionsOutput {
    /**
     * Information about the TagOptions.
     */
    TagOptionDetails?: TagOptionDetails;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export type LogicalResourceId = string;
  export type Message = string;
  export type Namespaces = AccountId[];
  export type NoEcho = boolean;
  export type NotificationArn = string;
  export type NotificationArns = NotificationArn[];
  export type NullableBoolean = boolean;
  export interface OrganizationNode {
    /**
     * The organization node type.
     */
    Type?: OrganizationNodeType;
    /**
     * The identifier of the organization node.
     */
    Value?: OrganizationNodeValue;
  }
  export type OrganizationNodeType = "ORGANIZATION"|"ORGANIZATIONAL_UNIT"|"ACCOUNT"|string;
  export type OrganizationNodeValue = string;
  export type OrganizationNodes = OrganizationNode[];
  export type OutputDescription = string;
  export type OutputKey = string;
  export type OutputKeys = OutputKey[];
  export type OutputValue = string;
  export type Owner = string;
  export type PageSize = number;
  export type PageSizeMax100 = number;
  export type PageToken = string;
  export interface ParameterConstraints {
    /**
     * The values that the administrator has allowed for the parameter.
     */
    AllowedValues?: AllowedValues;
    /**
     * A regular expression that represents the patterns that allow for String types. The pattern must match the entire parameter value provided.
     */
    AllowedPattern?: String;
    /**
     * A string that explains a constraint when the constraint is violated. For example, without a constraint description, a parameter that has an allowed pattern of [A-Za-z0-9]+ displays the following error message when the user specifies an invalid value:  Malformed input-Parameter MyParameter must match pattern [A-Za-z0-9]+  By adding a constraint description, such as must only contain letters (uppercase and lowercase) and numbers, you can display the following customized error message:  Malformed input-Parameter MyParameter must only contain uppercase and lowercase letters and numbers. 
     */
    ConstraintDescription?: String;
    /**
     * An integer value that determines the largest number of characters you want to allow for String types. 
     */
    MaxLength?: String;
    /**
     * An integer value that determines the smallest number of characters you want to allow for String types.
     */
    MinLength?: String;
    /**
     * A numeric value that determines the largest numeric value you want to allow for Number types.
     */
    MaxValue?: String;
    /**
     * A numeric value that determines the smallest numeric value you want to allow for Number types. 
     */
    MinValue?: String;
  }
  export type ParameterKey = string;
  export type ParameterType = string;
  export type ParameterValue = string;
  export type PhysicalId = string;
  export type PhysicalResourceId = string;
  export type PlanResourceType = string;
  export type PortfolioDescription = string;
  export interface PortfolioDetail {
    /**
     * The portfolio identifier.
     */
    Id?: Id;
    /**
     * The ARN assigned to the portfolio.
     */
    ARN?: ResourceARN;
    /**
     * The name to use for display purposes.
     */
    DisplayName?: PortfolioDisplayName;
    /**
     * The description of the portfolio.
     */
    Description?: PortfolioDescription;
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: CreationTime;
    /**
     * The name of the portfolio provider.
     */
    ProviderName?: ProviderName;
  }
  export type PortfolioDetails = PortfolioDetail[];
  export type PortfolioDisplayName = string;
  export type PortfolioName = string;
  export interface PortfolioShareDetail {
    /**
     * The identifier of the recipient entity that received the portfolio share. The recipient entities can be one of the following:  1. An external account. 2. An organziation member account. 3. An organzational unit (OU). 4. The organization itself. (This shares with every account in the organization).
     */
    PrincipalId?: Id;
    /**
     * The type of the portfolio share.
     */
    Type?: DescribePortfolioShareType;
    /**
     * Indicates whether the shared portfolio is imported by the recipient account. If the recipient is in an organization node, the share is automatically imported, and the field is always set to true.
     */
    Accepted?: Boolean;
    /**
     * Indicates whether TagOptions sharing is enabled or disabled for the portfolio share.
     */
    ShareTagOptions?: Boolean;
  }
  export type PortfolioShareDetails = PortfolioShareDetail[];
  export type PortfolioShareType = "IMPORTED"|"AWS_SERVICECATALOG"|"AWS_ORGANIZATIONS"|string;
  export interface Principal {
    /**
     * The ARN of the principal (IAM user, role, or group).
     */
    PrincipalARN?: PrincipalARN;
    /**
     * The principal type. The supported value is IAM.
     */
    PrincipalType?: PrincipalType;
  }
  export type PrincipalARN = string;
  export type PrincipalType = "IAM"|string;
  export type Principals = Principal[];
  export type ProductArn = string;
  export type ProductSource = "ACCOUNT"|string;
  export type ProductType = "CLOUD_FORMATION_TEMPLATE"|"MARKETPLACE"|string;
  export type ProductViewAggregationType = string;
  export interface ProductViewAggregationValue {
    /**
     * The value of the product view aggregation.
     */
    Value?: AttributeValue;
    /**
     * An approximate count of the products that match the value.
     */
    ApproximateCount?: ApproximateCount;
  }
  export type ProductViewAggregationValues = ProductViewAggregationValue[];
  export type ProductViewAggregations = {[key: string]: ProductViewAggregationValues};
  export interface ProductViewDetail {
    /**
     * Summary information about the product view.
     */
    ProductViewSummary?: ProductViewSummary;
    /**
     * The status of the product.    AVAILABLE - The product is ready for use.    CREATING - Product creation has started; the product is not ready for use.    FAILED - An action failed.  
     */
    Status?: Status;
    /**
     * The ARN of the product.
     */
    ProductARN?: ResourceARN;
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: CreatedTime;
  }
  export type ProductViewDetails = ProductViewDetail[];
  export type ProductViewDistributor = string;
  export type ProductViewFilterBy = "FullTextSearch"|"Owner"|"ProductType"|"SourceProductId"|string;
  export type ProductViewFilterValue = string;
  export type ProductViewFilterValues = ProductViewFilterValue[];
  export type ProductViewFilters = {[key: string]: ProductViewFilterValues};
  export type ProductViewName = string;
  export type ProductViewOwner = string;
  export type ProductViewShortDescription = string;
  export type ProductViewSortBy = "Title"|"VersionCount"|"CreationDate"|string;
  export type ProductViewSummaries = ProductViewSummary[];
  export interface ProductViewSummary {
    /**
     * The product view identifier.
     */
    Id?: Id;
    /**
     * The product identifier.
     */
    ProductId?: Id;
    /**
     * The name of the product.
     */
    Name?: ProductViewName;
    /**
     * The owner of the product. Contact the product administrator for the significance of this value.
     */
    Owner?: ProductViewOwner;
    /**
     * Short description of the product.
     */
    ShortDescription?: ProductViewShortDescription;
    /**
     * The product type. Contact the product administrator for the significance of this value. If this value is MARKETPLACE, the product was created by AWS Marketplace.
     */
    Type?: ProductType;
    /**
     * The distributor of the product. Contact the product administrator for the significance of this value.
     */
    Distributor?: ProductViewDistributor;
    /**
     * Indicates whether the product has a default path. If the product does not have a default path, call ListLaunchPaths to disambiguate between paths. Otherwise, ListLaunchPaths is not required, and the output of ProductViewSummary can be used directly with DescribeProvisioningParameters.
     */
    HasDefaultPath?: HasDefaultPath;
    /**
     * The email contact information to obtain support for this Product.
     */
    SupportEmail?: SupportEmail;
    /**
     * The description of the support for this Product.
     */
    SupportDescription?: SupportDescription;
    /**
     * The URL information to obtain support for this Product.
     */
    SupportUrl?: SupportUrl;
  }
  export type PropertyKey = "OWNER"|"LAUNCH_ROLE"|string;
  export type PropertyName = string;
  export type PropertyValue = string;
  export type ProviderName = string;
  export interface ProvisionProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier. You must provide the name or ID, but not both.
     */
    ProductId?: Id;
    /**
     * The name of the product. You must provide the name or ID, but not both.
     */
    ProductName?: ProductViewName;
    /**
     * The identifier of the provisioning artifact. You must provide the name or ID, but not both.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The name of the provisioning artifact. You must provide the name or ID, but not both.
     */
    ProvisioningArtifactName?: ProvisioningArtifactName;
    /**
     * The path identifier of the product. This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use ListLaunchPaths. You must provide the name or ID, but not both.
     */
    PathId?: Id;
    /**
     * The name of the path. You must provide the name or ID, but not both.
     */
    PathName?: PortfolioDisplayName;
    /**
     * A user-friendly name for the provisioned product. This value must be unique for the AWS account and cannot be updated after the product is provisioned.
     */
    ProvisionedProductName: ProvisionedProductName;
    /**
     * Parameters specified by the administrator that are required for provisioning the product.
     */
    ProvisioningParameters?: ProvisioningParameters;
    /**
     * An object that contains information about the provisioning preferences for a stack set.
     */
    ProvisioningPreferences?: ProvisioningPreferences;
    /**
     * One or more tags.
     */
    Tags?: Tags;
    /**
     * Passed to CloudFormation. The SNS topic ARNs to which to publish stack-related events.
     */
    NotificationArns?: NotificationArns;
    /**
     * An idempotency token that uniquely identifies the provisioning request.
     */
    ProvisionToken: IdempotencyToken;
  }
  export interface ProvisionProductOutput {
    /**
     * Information about the result of provisioning the product.
     */
    RecordDetail?: RecordDetail;
  }
  export interface ProvisionedProductAttribute {
    /**
     * The user-friendly name of the provisioned product.
     */
    Name?: ProvisionedProductNameOrArn;
    /**
     * The ARN of the provisioned product.
     */
    Arn?: ProvisionedProductNameOrArn;
    /**
     * The type of provisioned product. The supported values are CFN_STACK and CFN_STACKSET.
     */
    Type?: ProvisionedProductType;
    /**
     * The identifier of the provisioned product.
     */
    Id?: Id;
    /**
     * The current status of the provisioned product.    AVAILABLE - Stable state, ready to perform any operation. The most recent operation succeeded and completed.    UNDER_CHANGE - Transitive state. Operations performed might not have valid results. Wait for an AVAILABLE status before performing operations.    TAINTED - Stable state, ready to perform any operation. The stack has completed the requested operation but is not exactly what was requested. For example, a request to update to a new version failed and the stack rolled back to the current version.    ERROR - An unexpected error occurred. The provisioned product exists but the stack is not running. For example, CloudFormation received a parameter value that was not valid and could not launch the stack.    PLAN_IN_PROGRESS - Transitive state. The plan operations were performed to provision a new product, but resources have not yet been created. After reviewing the list of resources to be created, execute the plan. Wait for an AVAILABLE status before performing operations.  
     */
    Status?: ProvisionedProductStatus;
    /**
     * The current status message of the provisioned product.
     */
    StatusMessage?: ProvisionedProductStatusMessage;
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: CreatedTime;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken?: IdempotencyToken;
    /**
     * The record identifier of the last request performed on this provisioned product.
     */
    LastRecordId?: Id;
    /**
     * The record identifier of the last request performed on this provisioned product of the following types:    ProvisionedProduct     UpdateProvisionedProduct     ExecuteProvisionedProductPlan     TerminateProvisionedProduct   
     */
    LastProvisioningRecordId?: Id;
    /**
     * The record identifier of the last successful request performed on this provisioned product of the following types:    ProvisionedProduct     UpdateProvisionedProduct     ExecuteProvisionedProductPlan     TerminateProvisionedProduct   
     */
    LastSuccessfulProvisioningRecordId?: Id;
    /**
     * One or more tags.
     */
    Tags?: Tags;
    /**
     * The assigned identifier for the resource, such as an EC2 instance ID or an S3 bucket name.
     */
    PhysicalId?: PhysicalId;
    /**
     * The product identifier.
     */
    ProductId?: Id;
    /**
     * The name of the product.
     */
    ProductName?: ProductViewName;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The name of the provisioning artifact.
     */
    ProvisioningArtifactName?: ProvisioningArtifactName;
    /**
     * The Amazon Resource Name (ARN) of the IAM user.
     */
    UserArn?: UserArn;
    /**
     * The ARN of the IAM user in the session. This ARN might contain a session ID.
     */
    UserArnSession?: UserArnSession;
  }
  export type ProvisionedProductAttributes = ProvisionedProductAttribute[];
  export interface ProvisionedProductDetail {
    /**
     * The user-friendly name of the provisioned product.
     */
    Name?: ProvisionedProductNameOrArn;
    /**
     * The ARN of the provisioned product.
     */
    Arn?: ProvisionedProductNameOrArn;
    /**
     * The type of provisioned product. The supported values are CFN_STACK and CFN_STACKSET.
     */
    Type?: ProvisionedProductType;
    /**
     * The identifier of the provisioned product.
     */
    Id?: ProvisionedProductId;
    /**
     * The current status of the provisioned product.    AVAILABLE - Stable state, ready to perform any operation. The most recent operation succeeded and completed.    UNDER_CHANGE - Transitive state. Operations performed might not have valid results. Wait for an AVAILABLE status before performing operations.    TAINTED - Stable state, ready to perform any operation. The stack has completed the requested operation but is not exactly what was requested. For example, a request to update to a new version failed and the stack rolled back to the current version.    ERROR - An unexpected error occurred. The provisioned product exists but the stack is not running. For example, CloudFormation received a parameter value that was not valid and could not launch the stack.    PLAN_IN_PROGRESS - Transitive state. The plan operations were performed to provision a new product, but resources have not yet been created. After reviewing the list of resources to be created, execute the plan. Wait for an AVAILABLE status before performing operations.  
     */
    Status?: ProvisionedProductStatus;
    /**
     * The current status message of the provisioned product.
     */
    StatusMessage?: ProvisionedProductStatusMessage;
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: CreatedTime;
    /**
     * A unique identifier that you provide to ensure idempotency. If multiple requests differ only by the idempotency token, the same response is returned for each repeated request.
     */
    IdempotencyToken?: IdempotencyToken;
    /**
     * The record identifier of the last request performed on this provisioned product.
     */
    LastRecordId?: LastRequestId;
    /**
     * The record identifier of the last request performed on this provisioned product of the following types:    ProvisionedProduct     UpdateProvisionedProduct     ExecuteProvisionedProductPlan     TerminateProvisionedProduct   
     */
    LastProvisioningRecordId?: Id;
    /**
     * The record identifier of the last successful request performed on this provisioned product of the following types:    ProvisionedProduct     UpdateProvisionedProduct     ExecuteProvisionedProductPlan     TerminateProvisionedProduct   
     */
    LastSuccessfulProvisioningRecordId?: Id;
    /**
     * The product identifier. For example, prod-abcdzk7xy33qa.
     */
    ProductId?: Id;
    /**
     * The identifier of the provisioning artifact. For example, pa-4abcdjnxjj6ne.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The ARN of the launch role associated with the provisioned product.
     */
    LaunchRoleArn?: RoleArn;
  }
  export type ProvisionedProductDetails = ProvisionedProductDetail[];
  export type ProvisionedProductFilters = {[key: string]: ProvisionedProductViewFilterValues};
  export type ProvisionedProductId = string;
  export type ProvisionedProductName = string;
  export type ProvisionedProductNameOrArn = string;
  export interface ProvisionedProductPlanDetails {
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: CreatedTime;
    /**
     * The path identifier of the product. This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use ListLaunchPaths.
     */
    PathId?: Id;
    /**
     * The product identifier.
     */
    ProductId?: Id;
    /**
     * The name of the plan.
     */
    PlanName?: ProvisionedProductPlanName;
    /**
     * The plan identifier.
     */
    PlanId?: Id;
    /**
     * The product identifier.
     */
    ProvisionProductId?: Id;
    /**
     * The user-friendly name of the provisioned product.
     */
    ProvisionProductName?: ProvisionedProductName;
    /**
     * The plan type.
     */
    PlanType?: ProvisionedProductPlanType;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The status.
     */
    Status?: ProvisionedProductPlanStatus;
    /**
     * The time when the plan was last updated.
     */
    UpdatedTime?: UpdatedTime;
    /**
     * Passed to CloudFormation. The SNS topic ARNs to which to publish stack-related events.
     */
    NotificationArns?: NotificationArns;
    /**
     * Parameters specified by the administrator that are required for provisioning the product.
     */
    ProvisioningParameters?: UpdateProvisioningParameters;
    /**
     * One or more tags.
     */
    Tags?: Tags;
    /**
     * The status message.
     */
    StatusMessage?: StatusMessage;
  }
  export type ProvisionedProductPlanName = string;
  export type ProvisionedProductPlanStatus = "CREATE_IN_PROGRESS"|"CREATE_SUCCESS"|"CREATE_FAILED"|"EXECUTE_IN_PROGRESS"|"EXECUTE_SUCCESS"|"EXECUTE_FAILED"|string;
  export interface ProvisionedProductPlanSummary {
    /**
     * The name of the plan.
     */
    PlanName?: ProvisionedProductPlanName;
    /**
     * The plan identifier.
     */
    PlanId?: Id;
    /**
     * The product identifier.
     */
    ProvisionProductId?: Id;
    /**
     * The user-friendly name of the provisioned product.
     */
    ProvisionProductName?: ProvisionedProductName;
    /**
     * The plan type.
     */
    PlanType?: ProvisionedProductPlanType;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId?: Id;
  }
  export type ProvisionedProductPlanType = "CLOUDFORMATION"|string;
  export type ProvisionedProductPlans = ProvisionedProductPlanSummary[];
  export type ProvisionedProductProperties = {[key: string]: PropertyValue};
  export type ProvisionedProductStatus = "AVAILABLE"|"UNDER_CHANGE"|"TAINTED"|"ERROR"|"PLAN_IN_PROGRESS"|string;
  export type ProvisionedProductStatusMessage = string;
  export type ProvisionedProductType = string;
  export type ProvisionedProductViewFilterBy = "SearchQuery"|string;
  export type ProvisionedProductViewFilterValue = string;
  export type ProvisionedProductViewFilterValues = ProvisionedProductViewFilterValue[];
  export interface ProvisioningArtifact {
    /**
     * The identifier of the provisioning artifact.
     */
    Id?: Id;
    /**
     * The name of the provisioning artifact.
     */
    Name?: ProvisioningArtifactName;
    /**
     * The description of the provisioning artifact.
     */
    Description?: ProvisioningArtifactDescription;
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: ProvisioningArtifactCreatedTime;
    /**
     * Information set by the administrator to provide guidance to end users about which provisioning artifacts to use.
     */
    Guidance?: ProvisioningArtifactGuidance;
  }
  export type ProvisioningArtifactActive = boolean;
  export type ProvisioningArtifactCreatedTime = Date;
  export type ProvisioningArtifactDescription = string;
  export interface ProvisioningArtifactDetail {
    /**
     * The identifier of the provisioning artifact.
     */
    Id?: Id;
    /**
     * The name of the provisioning artifact.
     */
    Name?: ProvisioningArtifactName;
    /**
     * The description of the provisioning artifact.
     */
    Description?: ProvisioningArtifactName;
    /**
     * The type of provisioning artifact.    CLOUD_FORMATION_TEMPLATE - AWS CloudFormation template    MARKETPLACE_AMI - AWS Marketplace AMI    MARKETPLACE_CAR - AWS Marketplace Clusters and AWS Resources  
     */
    Type?: ProvisioningArtifactType;
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: CreationTime;
    /**
     * Indicates whether the product version is active.
     */
    Active?: ProvisioningArtifactActive;
    /**
     * Information set by the administrator to provide guidance to end users about which provisioning artifacts to use.
     */
    Guidance?: ProvisioningArtifactGuidance;
  }
  export type ProvisioningArtifactDetails = ProvisioningArtifactDetail[];
  export type ProvisioningArtifactGuidance = "DEFAULT"|"DEPRECATED"|string;
  export type ProvisioningArtifactInfo = {[key: string]: ProvisioningArtifactInfoValue};
  export type ProvisioningArtifactInfoKey = string;
  export type ProvisioningArtifactInfoValue = string;
  export type ProvisioningArtifactName = string;
  export interface ProvisioningArtifactOutput {
    /**
     * The provisioning artifact output key.
     */
    Key?: ProvisioningArtifactOutputKey;
    /**
     * Description of the provisioning artifact output key.
     */
    Description?: OutputDescription;
  }
  export type ProvisioningArtifactOutputKey = string;
  export type ProvisioningArtifactOutputs = ProvisioningArtifactOutput[];
  export interface ProvisioningArtifactParameter {
    /**
     * The parameter key.
     */
    ParameterKey?: ParameterKey;
    /**
     * The default value.
     */
    DefaultValue?: DefaultValue;
    /**
     * The parameter type.
     */
    ParameterType?: ParameterType;
    /**
     * If this value is true, the value for this parameter is obfuscated from view when the parameter is retrieved. This parameter is used to hide sensitive information.
     */
    IsNoEcho?: NoEcho;
    /**
     * The description of the parameter.
     */
    Description?: Description;
    /**
     * Constraints that the administrator has put on a parameter.
     */
    ParameterConstraints?: ParameterConstraints;
  }
  export type ProvisioningArtifactParameters = ProvisioningArtifactParameter[];
  export interface ProvisioningArtifactPreferences {
    /**
     * One or more AWS accounts where stack instances are deployed from the stack set. These accounts can be scoped in ProvisioningPreferences$StackSetAccounts and UpdateProvisioningPreferences$StackSetAccounts. Applicable only to a CFN_STACKSET provisioned product type.
     */
    StackSetAccounts?: StackSetAccounts;
    /**
     * One or more AWS Regions where stack instances are deployed from the stack set. These regions can be scoped in ProvisioningPreferences$StackSetRegions and UpdateProvisioningPreferences$StackSetRegions. Applicable only to a CFN_STACKSET provisioned product type.
     */
    StackSetRegions?: StackSetRegions;
  }
  export interface ProvisioningArtifactProperties {
    /**
     * The name of the provisioning artifact (for example, v1 v2beta). No spaces are allowed.
     */
    Name?: ProvisioningArtifactName;
    /**
     * The description of the provisioning artifact, including how it differs from the previous provisioning artifact.
     */
    Description?: ProvisioningArtifactDescription;
    /**
     * Specify the template source with one of the following options, but not both. Keys accepted: [ LoadTemplateFromURL, ImportFromPhysicalId ] The URL of the CloudFormation template in Amazon S3. Specify the URL in JSON format as follows:  "LoadTemplateFromURL": "https://s3.amazonaws.com/cf-templates-ozkq9d3hgiq2-us-east-1/..."   ImportFromPhysicalId: The physical id of the resource that contains the template. Currently only supports CloudFormation stack arn. Specify the physical id in JSON format as follows: ImportFromPhysicalId: “arn:aws:cloudformation:[us-east-1]:[accountId]:stack/[StackName]/[resourceId] 
     */
    Info: ProvisioningArtifactInfo;
    /**
     * The type of provisioning artifact.    CLOUD_FORMATION_TEMPLATE - AWS CloudFormation template    MARKETPLACE_AMI - AWS Marketplace AMI    MARKETPLACE_CAR - AWS Marketplace Clusters and AWS Resources  
     */
    Type?: ProvisioningArtifactType;
    /**
     * If set to true, AWS Service Catalog stops validating the specified provisioning artifact even if it is invalid.
     */
    DisableTemplateValidation?: DisableTemplateValidation;
  }
  export type ProvisioningArtifactPropertyName = "Id"|string;
  export type ProvisioningArtifactPropertyValue = string;
  export type ProvisioningArtifactSummaries = ProvisioningArtifactSummary[];
  export interface ProvisioningArtifactSummary {
    /**
     * The identifier of the provisioning artifact.
     */
    Id?: Id;
    /**
     * The name of the provisioning artifact.
     */
    Name?: ProvisioningArtifactName;
    /**
     * The description of the provisioning artifact.
     */
    Description?: ProvisioningArtifactDescription;
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: ProvisioningArtifactCreatedTime;
    /**
     * The metadata for the provisioning artifact. This is used with AWS Marketplace products.
     */
    ProvisioningArtifactMetadata?: ProvisioningArtifactInfo;
  }
  export type ProvisioningArtifactType = "CLOUD_FORMATION_TEMPLATE"|"MARKETPLACE_AMI"|"MARKETPLACE_CAR"|string;
  export interface ProvisioningArtifactView {
    /**
     * Summary information about a product view.
     */
    ProductViewSummary?: ProductViewSummary;
    /**
     * Information about a provisioning artifact. A provisioning artifact is also known as a product version.
     */
    ProvisioningArtifact?: ProvisioningArtifact;
  }
  export type ProvisioningArtifactViews = ProvisioningArtifactView[];
  export type ProvisioningArtifacts = ProvisioningArtifact[];
  export interface ProvisioningParameter {
    /**
     * The parameter key.
     */
    Key?: ParameterKey;
    /**
     * The parameter value.
     */
    Value?: ParameterValue;
  }
  export type ProvisioningParameters = ProvisioningParameter[];
  export interface ProvisioningPreferences {
    /**
     * One or more AWS accounts where the provisioned product will be available. Applicable only to a CFN_STACKSET provisioned product type. The specified accounts should be within the list of accounts from the STACKSET constraint. To get the list of accounts in the STACKSET constraint, use the DescribeProvisioningParameters operation. If no values are specified, the default value is all acounts from the STACKSET constraint.
     */
    StackSetAccounts?: StackSetAccounts;
    /**
     * One or more AWS Regions where the provisioned product will be available. Applicable only to a CFN_STACKSET provisioned product type. The specified regions should be within the list of regions from the STACKSET constraint. To get the list of regions in the STACKSET constraint, use the DescribeProvisioningParameters operation. If no values are specified, the default value is all regions from the STACKSET constraint.
     */
    StackSetRegions?: StackSetRegions;
    /**
     * The number of accounts, per region, for which this operation can fail before AWS Service Catalog stops the operation in that region. If the operation is stopped in a region, AWS Service Catalog doesn't attempt the operation in any subsequent regions. Applicable only to a CFN_STACKSET provisioned product type. Conditional: You must specify either StackSetFailureToleranceCount or StackSetFailureTolerancePercentage, but not both. The default value is 0 if no value is specified.
     */
    StackSetFailureToleranceCount?: StackSetFailureToleranceCount;
    /**
     * The percentage of accounts, per region, for which this stack operation can fail before AWS Service Catalog stops the operation in that region. If the operation is stopped in a region, AWS Service Catalog doesn't attempt the operation in any subsequent regions. When calculating the number of accounts based on the specified percentage, AWS Service Catalog rounds down to the next whole number. Applicable only to a CFN_STACKSET provisioned product type. Conditional: You must specify either StackSetFailureToleranceCount or StackSetFailureTolerancePercentage, but not both.
     */
    StackSetFailureTolerancePercentage?: StackSetFailureTolerancePercentage;
    /**
     * The maximum number of accounts in which to perform this operation at one time. This is dependent on the value of StackSetFailureToleranceCount. StackSetMaxConcurrentCount is at most one more than the StackSetFailureToleranceCount. Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling. Applicable only to a CFN_STACKSET provisioned product type. Conditional: You must specify either StackSetMaxConcurrentCount or StackSetMaxConcurrentPercentage, but not both.
     */
    StackSetMaxConcurrencyCount?: StackSetMaxConcurrencyCount;
    /**
     * The maximum percentage of accounts in which to perform this operation at one time. When calculating the number of accounts based on the specified percentage, AWS Service Catalog rounds down to the next whole number. This is true except in cases where rounding down would result is zero. In this case, AWS Service Catalog sets the number as 1 instead. Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling. Applicable only to a CFN_STACKSET provisioned product type. Conditional: You must specify either StackSetMaxConcurrentCount or StackSetMaxConcurrentPercentage, but not both.
     */
    StackSetMaxConcurrencyPercentage?: StackSetMaxConcurrencyPercentage;
  }
  export interface RecordDetail {
    /**
     * The identifier of the record.
     */
    RecordId?: Id;
    /**
     * The user-friendly name of the provisioned product.
     */
    ProvisionedProductName?: ProvisionedProductName;
    /**
     * The status of the provisioned product.    CREATED - The request was created but the operation has not started.    IN_PROGRESS - The requested operation is in progress.    IN_PROGRESS_IN_ERROR - The provisioned product is under change but the requested operation failed and some remediation is occurring. For example, a rollback.    SUCCEEDED - The requested operation has successfully completed.    FAILED - The requested operation has unsuccessfully completed. Investigate using the error messages returned.  
     */
    Status?: RecordStatus;
    /**
     * The UTC time stamp of the creation time.
     */
    CreatedTime?: CreatedTime;
    /**
     * The time when the record was last updated.
     */
    UpdatedTime?: UpdatedTime;
    /**
     * The type of provisioned product. The supported values are CFN_STACK and CFN_STACKSET.
     */
    ProvisionedProductType?: ProvisionedProductType;
    /**
     * The record type.    PROVISION_PRODUCT     UPDATE_PROVISIONED_PRODUCT     TERMINATE_PROVISIONED_PRODUCT   
     */
    RecordType?: RecordType;
    /**
     * The identifier of the provisioned product.
     */
    ProvisionedProductId?: Id;
    /**
     * The product identifier.
     */
    ProductId?: Id;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The path identifier.
     */
    PathId?: Id;
    /**
     * The errors that occurred.
     */
    RecordErrors?: RecordErrors;
    /**
     * One or more tags.
     */
    RecordTags?: RecordTags;
    /**
     * The ARN of the launch role associated with the provisioned product.
     */
    LaunchRoleArn?: RoleArn;
  }
  export type RecordDetails = RecordDetail[];
  export interface RecordError {
    /**
     * The numeric value of the error.
     */
    Code?: ErrorCode;
    /**
     * The description of the error.
     */
    Description?: ErrorDescription;
  }
  export type RecordErrors = RecordError[];
  export interface RecordOutput {
    /**
     * The output key.
     */
    OutputKey?: OutputKey;
    /**
     * The output value.
     */
    OutputValue?: OutputValue;
    /**
     * The description of the output.
     */
    Description?: Description;
  }
  export type RecordOutputs = RecordOutput[];
  export type RecordStatus = "CREATED"|"IN_PROGRESS"|"IN_PROGRESS_IN_ERROR"|"SUCCEEDED"|"FAILED"|string;
  export interface RecordTag {
    /**
     * The key for this tag.
     */
    Key?: RecordTagKey;
    /**
     * The value for this tag.
     */
    Value?: RecordTagValue;
  }
  export type RecordTagKey = string;
  export type RecordTagValue = string;
  export type RecordTags = RecordTag[];
  export type RecordType = string;
  export type Region = string;
  export interface RejectPortfolioShareInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId: Id;
    /**
     * The type of shared portfolios to reject. The default is to reject imported portfolios.    AWS_ORGANIZATIONS - Reject portfolios shared by the management account of your organization.    IMPORTED - Reject imported portfolios.    AWS_SERVICECATALOG - Not supported. (Throws ResourceNotFoundException.)   For example, aws servicecatalog reject-portfolio-share --portfolio-id "port-2qwzkwxt3y5fk" --portfolio-share-type AWS_ORGANIZATIONS 
     */
    PortfolioShareType?: PortfolioShareType;
  }
  export interface RejectPortfolioShareOutput {
  }
  export type Replacement = "TRUE"|"FALSE"|"CONDITIONAL"|string;
  export type RequiresRecreation = "NEVER"|"CONDITIONALLY"|"ALWAYS"|string;
  export type ResourceARN = string;
  export type ResourceAttribute = "PROPERTIES"|"METADATA"|"CREATIONPOLICY"|"UPDATEPOLICY"|"DELETIONPOLICY"|"TAGS"|string;
  export interface ResourceChange {
    /**
     * The change action.
     */
    Action?: ChangeAction;
    /**
     * The ID of the resource, as defined in the CloudFormation template.
     */
    LogicalResourceId?: LogicalResourceId;
    /**
     * The ID of the resource, if it was already created.
     */
    PhysicalResourceId?: PhysicalResourceId;
    /**
     * The type of resource.
     */
    ResourceType?: PlanResourceType;
    /**
     * If the change type is Modify, indicates whether the existing resource is deleted and replaced with a new one.
     */
    Replacement?: Replacement;
    /**
     * The change scope.
     */
    Scope?: Scope;
    /**
     * Information about the resource changes.
     */
    Details?: ResourceChangeDetails;
  }
  export interface ResourceChangeDetail {
    /**
     * Information about the resource attribute to be modified.
     */
    Target?: ResourceTargetDefinition;
    /**
     * For static evaluations, the value of the resource attribute will change and the new value is known. For dynamic evaluations, the value might change, and any new value will be determined when the plan is updated.
     */
    Evaluation?: EvaluationType;
    /**
     * The ID of the entity that caused the change.
     */
    CausingEntity?: CausingEntity;
  }
  export type ResourceChangeDetails = ResourceChangeDetail[];
  export type ResourceChanges = ResourceChange[];
  export interface ResourceDetail {
    /**
     * The identifier of the resource.
     */
    Id?: ResourceDetailId;
    /**
     * The ARN of the resource.
     */
    ARN?: ResourceDetailARN;
    /**
     * The name of the resource.
     */
    Name?: ResourceDetailName;
    /**
     * The description of the resource.
     */
    Description?: ResourceDetailDescription;
    /**
     * The creation time of the resource.
     */
    CreatedTime?: ResourceDetailCreatedTime;
  }
  export type ResourceDetailARN = string;
  export type ResourceDetailCreatedTime = Date;
  export type ResourceDetailDescription = string;
  export type ResourceDetailId = string;
  export type ResourceDetailName = string;
  export type ResourceDetails = ResourceDetail[];
  export type ResourceId = string;
  export interface ResourceTargetDefinition {
    /**
     * The attribute to be changed.
     */
    Attribute?: ResourceAttribute;
    /**
     * If the attribute is Properties, the value is the name of the property. Otherwise, the value is null.
     */
    Name?: PropertyName;
    /**
     * If the attribute is Properties, indicates whether a change to this property causes the resource to be re-created.
     */
    RequiresRecreation?: RequiresRecreation;
  }
  export type ResourceType = string;
  export type RetainPhysicalResources = boolean;
  export type RoleArn = string;
  export interface ScanProvisionedProductsInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The access level to use to obtain results. The default is User.
     */
    AccessLevelFilter?: AccessLevelFilter;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface ScanProvisionedProductsOutput {
    /**
     * Information about the provisioned products.
     */
    ProvisionedProducts?: ProvisionedProductDetails;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export type Scope = ResourceAttribute[];
  export type SearchFilterKey = string;
  export type SearchFilterValue = string;
  export interface SearchProductsAsAdminInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    PortfolioId?: Id;
    /**
     * The search filters. If no search filters are specified, the output includes all products to which the administrator has access.
     */
    Filters?: ProductViewFilters;
    /**
     * The sort field. If no value is specified, the results are not sorted.
     */
    SortBy?: ProductViewSortBy;
    /**
     * The sort order. If no value is specified, the results are not sorted.
     */
    SortOrder?: SortOrder;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSize;
    /**
     * Access level of the source of the product.
     */
    ProductSource?: ProductSource;
  }
  export interface SearchProductsAsAdminOutput {
    /**
     * Information about the product views.
     */
    ProductViewDetails?: ProductViewDetails;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface SearchProductsInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The search filters. If no search filters are specified, the output includes all products to which the caller has access.
     */
    Filters?: ProductViewFilters;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: PageSizeMax100;
    /**
     * The sort field. If no value is specified, the results are not sorted.
     */
    SortBy?: ProductViewSortBy;
    /**
     * The sort order. If no value is specified, the results are not sorted.
     */
    SortOrder?: SortOrder;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface SearchProductsOutput {
    /**
     * Information about the product views.
     */
    ProductViewSummaries?: ProductViewSummaries;
    /**
     * The product view aggregations.
     */
    ProductViewAggregations?: ProductViewAggregations;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export interface SearchProvisionedProductsInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The access level to use to obtain results. The default is User.
     */
    AccessLevelFilter?: AccessLevelFilter;
    /**
     * The search filters. When the key is SearchQuery, the searchable fields are arn, createdTime, id, lastRecordId, idempotencyToken, name, physicalId, productId, provisioningArtifact, type, status, tags, userArn, userArnSession, lastProvisioningRecordId, lastSuccessfulProvisioningRecordId, productName, and provisioningArtifactName. Example: "SearchQuery":["status:AVAILABLE"] 
     */
    Filters?: ProvisionedProductFilters;
    /**
     * The sort field. If no value is specified, the results are not sorted. The valid values are arn, id, name, and lastRecordId.
     */
    SortBy?: SortField;
    /**
     * The sort order. If no value is specified, the results are not sorted.
     */
    SortOrder?: SortOrder;
    /**
     * The maximum number of items to return with this call.
     */
    PageSize?: SearchProvisionedProductsPageSize;
    /**
     * The page token for the next set of results. To retrieve the first set of results, use null.
     */
    PageToken?: PageToken;
  }
  export interface SearchProvisionedProductsOutput {
    /**
     * Information about the provisioned products.
     */
    ProvisionedProducts?: ProvisionedProductAttributes;
    /**
     * The number of provisioned products found.
     */
    TotalResultsCount?: TotalResultsCount;
    /**
     * The page token to use to retrieve the next set of results. If there are no additional results, this value is null.
     */
    NextPageToken?: PageToken;
  }
  export type SearchProvisionedProductsPageSize = number;
  export interface ServiceActionAssociation {
    /**
     * The self-service action identifier. For example, act-fs7abcd89wxyz.
     */
    ServiceActionId: Id;
    /**
     * The product identifier. For example, prod-abcdzk7xy33qa.
     */
    ProductId: Id;
    /**
     * The identifier of the provisioning artifact. For example, pa-4abcdjnxjj6ne.
     */
    ProvisioningArtifactId: Id;
  }
  export type ServiceActionAssociationErrorCode = "DUPLICATE_RESOURCE"|"INTERNAL_FAILURE"|"LIMIT_EXCEEDED"|"RESOURCE_NOT_FOUND"|"THROTTLING"|string;
  export type ServiceActionAssociationErrorMessage = string;
  export type ServiceActionAssociations = ServiceActionAssociation[];
  export type ServiceActionDefinitionKey = "Name"|"Version"|"AssumeRole"|"Parameters"|string;
  export type ServiceActionDefinitionMap = {[key: string]: ServiceActionDefinitionValue};
  export type ServiceActionDefinitionType = "SSM_AUTOMATION"|string;
  export type ServiceActionDefinitionValue = string;
  export type ServiceActionDescription = string;
  export interface ServiceActionDetail {
    /**
     * Summary information about the self-service action.
     */
    ServiceActionSummary?: ServiceActionSummary;
    /**
     * A map that defines the self-service action.
     */
    Definition?: ServiceActionDefinitionMap;
  }
  export type ServiceActionName = string;
  export type ServiceActionSummaries = ServiceActionSummary[];
  export interface ServiceActionSummary {
    /**
     * The self-service action identifier.
     */
    Id?: Id;
    /**
     * The self-service action name.
     */
    Name?: ServiceActionName;
    /**
     * The self-service action description.
     */
    Description?: ServiceActionDescription;
    /**
     * The self-service action definition type. For example, SSM_AUTOMATION.
     */
    DefinitionType?: ServiceActionDefinitionType;
  }
  export interface ShareDetails {
    /**
     * List of accounts for whom the operation succeeded.
     */
    SuccessfulShares?: SuccessfulShares;
    /**
     * List of errors.
     */
    ShareErrors?: ShareErrors;
  }
  export interface ShareError {
    /**
     * List of accounts impacted by the error.
     */
    Accounts?: Namespaces;
    /**
     * Information about the error.
     */
    Message?: Message;
    /**
     * Error type that happened when processing the operation.
     */
    Error?: Error;
  }
  export type ShareErrors = ShareError[];
  export type ShareStatus = "NOT_STARTED"|"IN_PROGRESS"|"COMPLETED"|"COMPLETED_WITH_ERRORS"|"ERROR"|string;
  export type SortField = string;
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export type SourceProvisioningArtifactProperties = SourceProvisioningArtifactPropertiesMap[];
  export type SourceProvisioningArtifactPropertiesMap = {[key: string]: ProvisioningArtifactPropertyValue};
  export interface StackInstance {
    /**
     * The name of the AWS account that the stack instance is associated with.
     */
    Account?: AccountId;
    /**
     * The name of the AWS region that the stack instance is associated with.
     */
    Region?: Region;
    /**
     * The status of the stack instance, in terms of its synchronization with its associated stack set.     INOPERABLE: A DeleteStackInstances operation has failed and left the stack in an unstable state. Stacks in this state are excluded from further UpdateStackSet operations. You might need to perform a DeleteStackInstances operation, with RetainStacks set to true, to delete the stack instance, and then delete the stack manually.     OUTDATED: The stack isn't currently up to date with the stack set because either the associated stack failed during a CreateStackSet or UpdateStackSet operation, or the stack was part of a CreateStackSet or UpdateStackSet operation that failed or was stopped before the stack was created or updated.    CURRENT: The stack is currently up to date with the stack set.  
     */
    StackInstanceStatus?: StackInstanceStatus;
  }
  export type StackInstanceStatus = "CURRENT"|"OUTDATED"|"INOPERABLE"|string;
  export type StackInstances = StackInstance[];
  export type StackSetAccounts = AccountId[];
  export type StackSetFailureToleranceCount = number;
  export type StackSetFailureTolerancePercentage = number;
  export type StackSetMaxConcurrencyCount = number;
  export type StackSetMaxConcurrencyPercentage = number;
  export type StackSetOperationType = "CREATE"|"UPDATE"|"DELETE"|string;
  export type StackSetRegions = Region[];
  export type Status = "AVAILABLE"|"CREATING"|"FAILED"|string;
  export type StatusDetail = string;
  export type StatusMessage = string;
  export type String = string;
  export type SuccessfulShares = AccountId[];
  export type SupportDescription = string;
  export type SupportEmail = string;
  export type SupportUrl = string;
  export interface Tag {
    /**
     * The tag key.
     */
    Key: TagKey;
    /**
     * The value for this key.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagOptionActive = boolean;
  export interface TagOptionDetail {
    /**
     * The TagOption key.
     */
    Key?: TagOptionKey;
    /**
     * The TagOption value.
     */
    Value?: TagOptionValue;
    /**
     * The TagOption active state.
     */
    Active?: TagOptionActive;
    /**
     * The TagOption identifier.
     */
    Id?: TagOptionId;
    /**
     * The AWS account Id of the owner account that created the TagOption.
     */
    Owner?: Owner;
  }
  export type TagOptionDetails = TagOptionDetail[];
  export type TagOptionId = string;
  export type TagOptionKey = string;
  export type TagOptionSummaries = TagOptionSummary[];
  export interface TagOptionSummary {
    /**
     * The TagOption key.
     */
    Key?: TagOptionKey;
    /**
     * The TagOption value.
     */
    Values?: TagOptionValues;
  }
  export type TagOptionValue = string;
  export type TagOptionValues = TagOptionValue[];
  export type TagValue = string;
  export type Tags = Tag[];
  export interface TerminateProvisionedProductInput {
    /**
     * The name of the provisioned product. You cannot specify both ProvisionedProductName and ProvisionedProductId.
     */
    ProvisionedProductName?: ProvisionedProductNameOrArn;
    /**
     * The identifier of the provisioned product. You cannot specify both ProvisionedProductName and ProvisionedProductId.
     */
    ProvisionedProductId?: Id;
    /**
     * An idempotency token that uniquely identifies the termination request. This token is only valid during the termination process. After the provisioned product is terminated, subsequent requests to terminate the same provisioned product always return ResourceNotFound.
     */
    TerminateToken: IdempotencyToken;
    /**
     * If set to true, AWS Service Catalog stops managing the specified provisioned product even if it cannot delete the underlying resources.
     */
    IgnoreErrors?: IgnoreErrors;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * When this boolean parameter is set to true, the TerminateProvisionedProduct API deletes the Service Catalog provisioned product. However, it does not remove the CloudFormation stack, stack set, or the underlying resources of the deleted provisioned product. The default value is false.
     */
    RetainPhysicalResources?: RetainPhysicalResources;
  }
  export interface TerminateProvisionedProductOutput {
    /**
     * Information about the result of this request.
     */
    RecordDetail?: RecordDetail;
  }
  export type TotalResultsCount = number;
  export interface UpdateConstraintInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The identifier of the constraint.
     */
    Id: Id;
    /**
     * The updated description of the constraint.
     */
    Description?: ConstraintDescription;
    /**
     * The constraint parameters, in JSON format. The syntax depends on the constraint type as follows:  LAUNCH  You are required to specify either the RoleArn or the LocalRoleName but can't use both. Specify the RoleArn property as follows:  {"RoleArn" : "arn:aws:iam::123456789012:role/LaunchRole"}  Specify the LocalRoleName property as follows:  {"LocalRoleName": "SCBasicLaunchRole"}  If you specify the LocalRoleName property, when an account uses the launch constraint, the IAM role with that name in the account will be used. This allows launch-role constraints to be account-agnostic so the administrator can create fewer resources per shared account.  The given role name must exist in the account used to create the launch constraint and the account of the user who launches a product with this launch constraint.  You cannot have both a LAUNCH and a STACKSET constraint. You also cannot have more than one LAUNCH constraint on a product and portfolio.  NOTIFICATION  Specify the NotificationArns property as follows:  {"NotificationArns" : ["arn:aws:sns:us-east-1:123456789012:Topic"]}   RESOURCE_UPDATE  Specify the TagUpdatesOnProvisionedProduct property as follows:  {"Version":"2.0","Properties":{"TagUpdateOnProvisionedProduct":"String"}}  The TagUpdatesOnProvisionedProduct property accepts a string value of ALLOWED or NOT_ALLOWED.  STACKSET  Specify the Parameters property as follows:  {"Version": "String", "Properties": {"AccountList": [ "String" ], "RegionList": [ "String" ], "AdminRole": "String", "ExecutionRole": "String"}}  You cannot have both a LAUNCH and a STACKSET constraint. You also cannot have more than one STACKSET constraint on a product and portfolio. Products with a STACKSET constraint will launch an AWS CloudFormation stack set.  TEMPLATE  Specify the Rules property. For more information, see Template Constraint Rules.  
     */
    Parameters?: ConstraintParameters;
  }
  export interface UpdateConstraintOutput {
    /**
     * Information about the constraint.
     */
    ConstraintDetail?: ConstraintDetail;
    /**
     * The constraint parameters.
     */
    ConstraintParameters?: ConstraintParameters;
    /**
     * The status of the current request.
     */
    Status?: Status;
  }
  export interface UpdatePortfolioInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The portfolio identifier.
     */
    Id: Id;
    /**
     * The name to use for display purposes.
     */
    DisplayName?: PortfolioDisplayName;
    /**
     * The updated description of the portfolio.
     */
    Description?: PortfolioDescription;
    /**
     * The updated name of the portfolio provider.
     */
    ProviderName?: ProviderName;
    /**
     * The tags to add.
     */
    AddTags?: AddTags;
    /**
     * The tags to remove.
     */
    RemoveTags?: TagKeys;
  }
  export interface UpdatePortfolioOutput {
    /**
     * Information about the portfolio.
     */
    PortfolioDetail?: PortfolioDetail;
    /**
     * Information about the tags associated with the portfolio.
     */
    Tags?: Tags;
  }
  export interface UpdatePortfolioShareInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The unique identifier of the portfolio for which the share will be updated.
     */
    PortfolioId: Id;
    /**
     * The AWS Account Id of the recipient account. This field is required when updating an external account to account type share.
     */
    AccountId?: AccountId;
    OrganizationNode?: OrganizationNode;
    /**
     * A flag to enable or disable TagOptions sharing for the portfolio share. If this field is not provided, the current state of TagOptions sharing on the portfolio share will not be modified.
     */
    ShareTagOptions?: NullableBoolean;
  }
  export interface UpdatePortfolioShareOutput {
    /**
     * The token that tracks the status of the UpdatePortfolioShare operation for external account to account or organizational type sharing.
     */
    PortfolioShareToken?: Id;
    /**
     * The status of UpdatePortfolioShare operation. You can also obtain the operation status using DescribePortfolioShareStatus API. 
     */
    Status?: ShareStatus;
  }
  export interface UpdateProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    Id: Id;
    /**
     * The updated product name.
     */
    Name?: ProductViewName;
    /**
     * The updated owner of the product.
     */
    Owner?: ProductViewOwner;
    /**
     * The updated description of the product.
     */
    Description?: ProductViewShortDescription;
    /**
     * The updated distributor of the product.
     */
    Distributor?: ProductViewOwner;
    /**
     * The updated support description for the product.
     */
    SupportDescription?: SupportDescription;
    /**
     * The updated support email for the product.
     */
    SupportEmail?: SupportEmail;
    /**
     * The updated support URL for the product.
     */
    SupportUrl?: SupportUrl;
    /**
     * The tags to add to the product.
     */
    AddTags?: AddTags;
    /**
     * The tags to remove from the product.
     */
    RemoveTags?: TagKeys;
  }
  export interface UpdateProductOutput {
    /**
     * Information about the product view.
     */
    ProductViewDetail?: ProductViewDetail;
    /**
     * Information about the tags associated with the product.
     */
    Tags?: Tags;
  }
  export interface UpdateProvisionedProductInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The name of the provisioned product. You cannot specify both ProvisionedProductName and ProvisionedProductId.
     */
    ProvisionedProductName?: ProvisionedProductNameOrArn;
    /**
     * The identifier of the provisioned product. You must provide the name or ID, but not both.
     */
    ProvisionedProductId?: Id;
    /**
     * The identifier of the product. You must provide the name or ID, but not both.
     */
    ProductId?: Id;
    /**
     * The name of the product. You must provide the name or ID, but not both.
     */
    ProductName?: ProductViewName;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId?: Id;
    /**
     * The name of the provisioning artifact. You must provide the name or ID, but not both.
     */
    ProvisioningArtifactName?: ProvisioningArtifactName;
    /**
     * The path identifier. This value is optional if the product has a default path, and required if the product has more than one path. You must provide the name or ID, but not both.
     */
    PathId?: Id;
    /**
     * The name of the path. You must provide the name or ID, but not both.
     */
    PathName?: PortfolioDisplayName;
    /**
     * The new parameters.
     */
    ProvisioningParameters?: UpdateProvisioningParameters;
    /**
     * An object that contains information about the provisioning preferences for a stack set.
     */
    ProvisioningPreferences?: UpdateProvisioningPreferences;
    /**
     * One or more tags. Requires the product to have RESOURCE_UPDATE constraint with TagUpdatesOnProvisionedProduct set to ALLOWED to allow tag updates.
     */
    Tags?: Tags;
    /**
     * The idempotency token that uniquely identifies the provisioning update request.
     */
    UpdateToken: IdempotencyToken;
  }
  export interface UpdateProvisionedProductOutput {
    /**
     * Information about the result of the request.
     */
    RecordDetail?: RecordDetail;
  }
  export interface UpdateProvisionedProductPropertiesInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The identifier of the provisioned product.
     */
    ProvisionedProductId: Id;
    /**
     * A map that contains the provisioned product properties to be updated. The LAUNCH_ROLE key accepts role ARNs. This key allows an administrator to call UpdateProvisionedProductProperties to update the launch role that is associated with a provisioned product. This role is used when an end user calls a provisioning operation such as UpdateProvisionedProduct, TerminateProvisionedProduct, or ExecuteProvisionedProductServiceAction. Only a role ARN is valid. A user ARN is invalid.  The OWNER key accepts user ARNs and role ARNs. The owner is the user that has permission to see, update, terminate, and execute service actions in the provisioned product. The administrator can change the owner of a provisioned product to another IAM user within the same account. Both end user owners and administrators can see ownership history of the provisioned product using the ListRecordHistory API. The new owner can describe all past records for the provisioned product using the DescribeRecord API. The previous owner can no longer use DescribeRecord, but can still see the product's history from when he was an owner using ListRecordHistory. If a provisioned product ownership is assigned to an end user, they can see and perform any action through the API or Service Catalog console such as update, terminate, and execute service actions. If an end user provisions a product and the owner is updated to someone else, they will no longer be able to see or perform any actions through API or the Service Catalog console on that provisioned product.
     */
    ProvisionedProductProperties: ProvisionedProductProperties;
    /**
     * The idempotency token that uniquely identifies the provisioning product update request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface UpdateProvisionedProductPropertiesOutput {
    /**
     * The provisioned product identifier.
     */
    ProvisionedProductId?: Id;
    /**
     * A map that contains the properties updated.
     */
    ProvisionedProductProperties?: ProvisionedProductProperties;
    /**
     * The identifier of the record.
     */
    RecordId?: Id;
    /**
     * The status of the request.
     */
    Status?: RecordStatus;
  }
  export interface UpdateProvisioningArtifactInput {
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
    /**
     * The product identifier.
     */
    ProductId: Id;
    /**
     * The identifier of the provisioning artifact.
     */
    ProvisioningArtifactId: Id;
    /**
     * The updated name of the provisioning artifact.
     */
    Name?: ProvisioningArtifactName;
    /**
     * The updated description of the provisioning artifact.
     */
    Description?: ProvisioningArtifactDescription;
    /**
     * Indicates whether the product version is active. Inactive provisioning artifacts are invisible to end users. End users cannot launch or update a provisioned product from an inactive provisioning artifact.
     */
    Active?: ProvisioningArtifactActive;
    /**
     * Information set by the administrator to provide guidance to end users about which provisioning artifacts to use. The DEFAULT value indicates that the product version is active. The administrator can set the guidance to DEPRECATED to inform users that the product version is deprecated. Users are able to make updates to a provisioned product of a deprecated version but cannot launch new provisioned products using a deprecated version.
     */
    Guidance?: ProvisioningArtifactGuidance;
  }
  export interface UpdateProvisioningArtifactOutput {
    /**
     * Information about the provisioning artifact.
     */
    ProvisioningArtifactDetail?: ProvisioningArtifactDetail;
    /**
     * The URL of the CloudFormation template in Amazon S3.
     */
    Info?: ProvisioningArtifactInfo;
    /**
     * The status of the current request.
     */
    Status?: Status;
  }
  export interface UpdateProvisioningParameter {
    /**
     * The parameter key.
     */
    Key?: ParameterKey;
    /**
     * The parameter value.
     */
    Value?: ParameterValue;
    /**
     * If set to true, Value is ignored and the previous parameter value is kept.
     */
    UsePreviousValue?: UsePreviousValue;
  }
  export type UpdateProvisioningParameters = UpdateProvisioningParameter[];
  export interface UpdateProvisioningPreferences {
    /**
     * One or more AWS accounts that will have access to the provisioned product. Applicable only to a CFN_STACKSET provisioned product type. The AWS accounts specified should be within the list of accounts in the STACKSET constraint. To get the list of accounts in the STACKSET constraint, use the DescribeProvisioningParameters operation. If no values are specified, the default value is all accounts from the STACKSET constraint.
     */
    StackSetAccounts?: StackSetAccounts;
    /**
     * One or more AWS Regions where the provisioned product will be available. Applicable only to a CFN_STACKSET provisioned product type. The specified regions should be within the list of regions from the STACKSET constraint. To get the list of regions in the STACKSET constraint, use the DescribeProvisioningParameters operation. If no values are specified, the default value is all regions from the STACKSET constraint.
     */
    StackSetRegions?: StackSetRegions;
    /**
     * The number of accounts, per region, for which this operation can fail before AWS Service Catalog stops the operation in that region. If the operation is stopped in a region, AWS Service Catalog doesn't attempt the operation in any subsequent regions. Applicable only to a CFN_STACKSET provisioned product type. Conditional: You must specify either StackSetFailureToleranceCount or StackSetFailureTolerancePercentage, but not both. The default value is 0 if no value is specified.
     */
    StackSetFailureToleranceCount?: StackSetFailureToleranceCount;
    /**
     * The percentage of accounts, per region, for which this stack operation can fail before AWS Service Catalog stops the operation in that region. If the operation is stopped in a region, AWS Service Catalog doesn't attempt the operation in any subsequent regions. When calculating the number of accounts based on the specified percentage, AWS Service Catalog rounds down to the next whole number. Applicable only to a CFN_STACKSET provisioned product type. Conditional: You must specify either StackSetFailureToleranceCount or StackSetFailureTolerancePercentage, but not both.
     */
    StackSetFailureTolerancePercentage?: StackSetFailureTolerancePercentage;
    /**
     * The maximum number of accounts in which to perform this operation at one time. This is dependent on the value of StackSetFailureToleranceCount. StackSetMaxConcurrentCount is at most one more than the StackSetFailureToleranceCount. Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling. Applicable only to a CFN_STACKSET provisioned product type. Conditional: You must specify either StackSetMaxConcurrentCount or StackSetMaxConcurrentPercentage, but not both.
     */
    StackSetMaxConcurrencyCount?: StackSetMaxConcurrencyCount;
    /**
     * The maximum percentage of accounts in which to perform this operation at one time. When calculating the number of accounts based on the specified percentage, AWS Service Catalog rounds down to the next whole number. This is true except in cases where rounding down would result is zero. In this case, AWS Service Catalog sets the number as 1 instead. Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling. Applicable only to a CFN_STACKSET provisioned product type. Conditional: You must specify either StackSetMaxConcurrentCount or StackSetMaxConcurrentPercentage, but not both.
     */
    StackSetMaxConcurrencyPercentage?: StackSetMaxConcurrencyPercentage;
    /**
     * Determines what action AWS Service Catalog performs to a stack set or a stack instance represented by the provisioned product. The default value is UPDATE if nothing is specified. Applicable only to a CFN_STACKSET provisioned product type.  CREATE  Creates a new stack instance in the stack set represented by the provisioned product. In this case, only new stack instances are created based on accounts and regions; if new ProductId or ProvisioningArtifactID are passed, they will be ignored.  UPDATE  Updates the stack set represented by the provisioned product and also its stack instances.  DELETE  Deletes a stack instance in the stack set represented by the provisioned product.  
     */
    StackSetOperationType?: StackSetOperationType;
  }
  export interface UpdateServiceActionInput {
    /**
     * The self-service action identifier.
     */
    Id: Id;
    /**
     * The self-service action name.
     */
    Name?: ServiceActionName;
    /**
     * A map that defines the self-service action.
     */
    Definition?: ServiceActionDefinitionMap;
    /**
     * The self-service action description.
     */
    Description?: ServiceActionDescription;
    /**
     * The language code.    en - English (default)    jp - Japanese    zh - Chinese  
     */
    AcceptLanguage?: AcceptLanguage;
  }
  export interface UpdateServiceActionOutput {
    /**
     * Detailed information about the self-service action.
     */
    ServiceActionDetail?: ServiceActionDetail;
  }
  export interface UpdateTagOptionInput {
    /**
     * The TagOption identifier.
     */
    Id: TagOptionId;
    /**
     * The updated value.
     */
    Value?: TagOptionValue;
    /**
     * The updated active state.
     */
    Active?: TagOptionActive;
  }
  export interface UpdateTagOptionOutput {
    /**
     * Information about the TagOption.
     */
    TagOptionDetail?: TagOptionDetail;
  }
  export type UpdatedTime = Date;
  export interface UsageInstruction {
    /**
     * The usage instruction type for the value.
     */
    Type?: InstructionType;
    /**
     * The usage instruction value for this type.
     */
    Value?: InstructionValue;
  }
  export type UsageInstructions = UsageInstruction[];
  export type UsePreviousValue = boolean;
  export type UserArn = string;
  export type UserArnSession = string;
  export type Verbose = boolean;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-12-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ServiceCatalog client.
   */
  export import Types = ServiceCatalog;
}
export = ServiceCatalog;
