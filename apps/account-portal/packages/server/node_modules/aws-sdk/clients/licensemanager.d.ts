import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class LicenseManager extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LicenseManager.Types.ClientConfiguration)
  config: Config & LicenseManager.Types.ClientConfiguration;
  /**
   * Accepts the specified grant.
   */
  acceptGrant(params: LicenseManager.Types.AcceptGrantRequest, callback?: (err: AWSError, data: LicenseManager.Types.AcceptGrantResponse) => void): Request<LicenseManager.Types.AcceptGrantResponse, AWSError>;
  /**
   * Accepts the specified grant.
   */
  acceptGrant(callback?: (err: AWSError, data: LicenseManager.Types.AcceptGrantResponse) => void): Request<LicenseManager.Types.AcceptGrantResponse, AWSError>;
  /**
   * Checks in the specified license. Check in a license when it is no longer in use.
   */
  checkInLicense(params: LicenseManager.Types.CheckInLicenseRequest, callback?: (err: AWSError, data: LicenseManager.Types.CheckInLicenseResponse) => void): Request<LicenseManager.Types.CheckInLicenseResponse, AWSError>;
  /**
   * Checks in the specified license. Check in a license when it is no longer in use.
   */
  checkInLicense(callback?: (err: AWSError, data: LicenseManager.Types.CheckInLicenseResponse) => void): Request<LicenseManager.Types.CheckInLicenseResponse, AWSError>;
  /**
   * Checks out the specified license for offline use.
   */
  checkoutBorrowLicense(params: LicenseManager.Types.CheckoutBorrowLicenseRequest, callback?: (err: AWSError, data: LicenseManager.Types.CheckoutBorrowLicenseResponse) => void): Request<LicenseManager.Types.CheckoutBorrowLicenseResponse, AWSError>;
  /**
   * Checks out the specified license for offline use.
   */
  checkoutBorrowLicense(callback?: (err: AWSError, data: LicenseManager.Types.CheckoutBorrowLicenseResponse) => void): Request<LicenseManager.Types.CheckoutBorrowLicenseResponse, AWSError>;
  /**
   * Checks out the specified license.  If the account that created the license is the same that is performing the check out, you must specify the account as the beneficiary. 
   */
  checkoutLicense(params: LicenseManager.Types.CheckoutLicenseRequest, callback?: (err: AWSError, data: LicenseManager.Types.CheckoutLicenseResponse) => void): Request<LicenseManager.Types.CheckoutLicenseResponse, AWSError>;
  /**
   * Checks out the specified license.  If the account that created the license is the same that is performing the check out, you must specify the account as the beneficiary. 
   */
  checkoutLicense(callback?: (err: AWSError, data: LicenseManager.Types.CheckoutLicenseResponse) => void): Request<LicenseManager.Types.CheckoutLicenseResponse, AWSError>;
  /**
   * Creates a grant for the specified license. A grant shares the use of license entitlements with a specific Amazon Web Services account, an organization, or an organizational unit (OU). For more information, see Granted licenses in License Manager in the License Manager User Guide.
   */
  createGrant(params: LicenseManager.Types.CreateGrantRequest, callback?: (err: AWSError, data: LicenseManager.Types.CreateGrantResponse) => void): Request<LicenseManager.Types.CreateGrantResponse, AWSError>;
  /**
   * Creates a grant for the specified license. A grant shares the use of license entitlements with a specific Amazon Web Services account, an organization, or an organizational unit (OU). For more information, see Granted licenses in License Manager in the License Manager User Guide.
   */
  createGrant(callback?: (err: AWSError, data: LicenseManager.Types.CreateGrantResponse) => void): Request<LicenseManager.Types.CreateGrantResponse, AWSError>;
  /**
   * Creates a new version of the specified grant. For more information, see Granted licenses in License Manager in the License Manager User Guide.
   */
  createGrantVersion(params: LicenseManager.Types.CreateGrantVersionRequest, callback?: (err: AWSError, data: LicenseManager.Types.CreateGrantVersionResponse) => void): Request<LicenseManager.Types.CreateGrantVersionResponse, AWSError>;
  /**
   * Creates a new version of the specified grant. For more information, see Granted licenses in License Manager in the License Manager User Guide.
   */
  createGrantVersion(callback?: (err: AWSError, data: LicenseManager.Types.CreateGrantVersionResponse) => void): Request<LicenseManager.Types.CreateGrantVersionResponse, AWSError>;
  /**
   * Creates a license.
   */
  createLicense(params: LicenseManager.Types.CreateLicenseRequest, callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseResponse) => void): Request<LicenseManager.Types.CreateLicenseResponse, AWSError>;
  /**
   * Creates a license.
   */
  createLicense(callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseResponse) => void): Request<LicenseManager.Types.CreateLicenseResponse, AWSError>;
  /**
   * Creates a license configuration. A license configuration is an abstraction of a customer license agreement that can be consumed and enforced by License Manager. Components include specifications for the license type (licensing by instance, socket, CPU, or vCPU), allowed tenancy (shared tenancy, Dedicated Instance, Dedicated Host, or all of these), license affinity to host (how long a license must be associated with a host), and the number of licenses purchased and used.
   */
  createLicenseConfiguration(params: LicenseManager.Types.CreateLicenseConfigurationRequest, callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseConfigurationResponse) => void): Request<LicenseManager.Types.CreateLicenseConfigurationResponse, AWSError>;
  /**
   * Creates a license configuration. A license configuration is an abstraction of a customer license agreement that can be consumed and enforced by License Manager. Components include specifications for the license type (licensing by instance, socket, CPU, or vCPU), allowed tenancy (shared tenancy, Dedicated Instance, Dedicated Host, or all of these), license affinity to host (how long a license must be associated with a host), and the number of licenses purchased and used.
   */
  createLicenseConfiguration(callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseConfigurationResponse) => void): Request<LicenseManager.Types.CreateLicenseConfigurationResponse, AWSError>;
  /**
   * Creates a new license conversion task.
   */
  createLicenseConversionTaskForResource(params: LicenseManager.Types.CreateLicenseConversionTaskForResourceRequest, callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseConversionTaskForResourceResponse) => void): Request<LicenseManager.Types.CreateLicenseConversionTaskForResourceResponse, AWSError>;
  /**
   * Creates a new license conversion task.
   */
  createLicenseConversionTaskForResource(callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseConversionTaskForResourceResponse) => void): Request<LicenseManager.Types.CreateLicenseConversionTaskForResourceResponse, AWSError>;
  /**
   * Creates a report generator.
   */
  createLicenseManagerReportGenerator(params: LicenseManager.Types.CreateLicenseManagerReportGeneratorRequest, callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseManagerReportGeneratorResponse) => void): Request<LicenseManager.Types.CreateLicenseManagerReportGeneratorResponse, AWSError>;
  /**
   * Creates a report generator.
   */
  createLicenseManagerReportGenerator(callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseManagerReportGeneratorResponse) => void): Request<LicenseManager.Types.CreateLicenseManagerReportGeneratorResponse, AWSError>;
  /**
   * Creates a new version of the specified license.
   */
  createLicenseVersion(params: LicenseManager.Types.CreateLicenseVersionRequest, callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseVersionResponse) => void): Request<LicenseManager.Types.CreateLicenseVersionResponse, AWSError>;
  /**
   * Creates a new version of the specified license.
   */
  createLicenseVersion(callback?: (err: AWSError, data: LicenseManager.Types.CreateLicenseVersionResponse) => void): Request<LicenseManager.Types.CreateLicenseVersionResponse, AWSError>;
  /**
   * Creates a long-lived token. A refresh token is a JWT token used to get an access token. With an access token, you can call AssumeRoleWithWebIdentity to get role credentials that you can use to call License Manager to manage the specified license.
   */
  createToken(params: LicenseManager.Types.CreateTokenRequest, callback?: (err: AWSError, data: LicenseManager.Types.CreateTokenResponse) => void): Request<LicenseManager.Types.CreateTokenResponse, AWSError>;
  /**
   * Creates a long-lived token. A refresh token is a JWT token used to get an access token. With an access token, you can call AssumeRoleWithWebIdentity to get role credentials that you can use to call License Manager to manage the specified license.
   */
  createToken(callback?: (err: AWSError, data: LicenseManager.Types.CreateTokenResponse) => void): Request<LicenseManager.Types.CreateTokenResponse, AWSError>;
  /**
   * Deletes the specified grant.
   */
  deleteGrant(params: LicenseManager.Types.DeleteGrantRequest, callback?: (err: AWSError, data: LicenseManager.Types.DeleteGrantResponse) => void): Request<LicenseManager.Types.DeleteGrantResponse, AWSError>;
  /**
   * Deletes the specified grant.
   */
  deleteGrant(callback?: (err: AWSError, data: LicenseManager.Types.DeleteGrantResponse) => void): Request<LicenseManager.Types.DeleteGrantResponse, AWSError>;
  /**
   * Deletes the specified license.
   */
  deleteLicense(params: LicenseManager.Types.DeleteLicenseRequest, callback?: (err: AWSError, data: LicenseManager.Types.DeleteLicenseResponse) => void): Request<LicenseManager.Types.DeleteLicenseResponse, AWSError>;
  /**
   * Deletes the specified license.
   */
  deleteLicense(callback?: (err: AWSError, data: LicenseManager.Types.DeleteLicenseResponse) => void): Request<LicenseManager.Types.DeleteLicenseResponse, AWSError>;
  /**
   * Deletes the specified license configuration. You cannot delete a license configuration that is in use.
   */
  deleteLicenseConfiguration(params: LicenseManager.Types.DeleteLicenseConfigurationRequest, callback?: (err: AWSError, data: LicenseManager.Types.DeleteLicenseConfigurationResponse) => void): Request<LicenseManager.Types.DeleteLicenseConfigurationResponse, AWSError>;
  /**
   * Deletes the specified license configuration. You cannot delete a license configuration that is in use.
   */
  deleteLicenseConfiguration(callback?: (err: AWSError, data: LicenseManager.Types.DeleteLicenseConfigurationResponse) => void): Request<LicenseManager.Types.DeleteLicenseConfigurationResponse, AWSError>;
  /**
   * Deletes the specified report generator. This action deletes the report generator, which stops it from generating future reports. The action cannot be reversed. It has no effect on the previous reports from this generator.
   */
  deleteLicenseManagerReportGenerator(params: LicenseManager.Types.DeleteLicenseManagerReportGeneratorRequest, callback?: (err: AWSError, data: LicenseManager.Types.DeleteLicenseManagerReportGeneratorResponse) => void): Request<LicenseManager.Types.DeleteLicenseManagerReportGeneratorResponse, AWSError>;
  /**
   * Deletes the specified report generator. This action deletes the report generator, which stops it from generating future reports. The action cannot be reversed. It has no effect on the previous reports from this generator.
   */
  deleteLicenseManagerReportGenerator(callback?: (err: AWSError, data: LicenseManager.Types.DeleteLicenseManagerReportGeneratorResponse) => void): Request<LicenseManager.Types.DeleteLicenseManagerReportGeneratorResponse, AWSError>;
  /**
   * Deletes the specified token. Must be called in the license home Region.
   */
  deleteToken(params: LicenseManager.Types.DeleteTokenRequest, callback?: (err: AWSError, data: LicenseManager.Types.DeleteTokenResponse) => void): Request<LicenseManager.Types.DeleteTokenResponse, AWSError>;
  /**
   * Deletes the specified token. Must be called in the license home Region.
   */
  deleteToken(callback?: (err: AWSError, data: LicenseManager.Types.DeleteTokenResponse) => void): Request<LicenseManager.Types.DeleteTokenResponse, AWSError>;
  /**
   * Extends the expiration date for license consumption.
   */
  extendLicenseConsumption(params: LicenseManager.Types.ExtendLicenseConsumptionRequest, callback?: (err: AWSError, data: LicenseManager.Types.ExtendLicenseConsumptionResponse) => void): Request<LicenseManager.Types.ExtendLicenseConsumptionResponse, AWSError>;
  /**
   * Extends the expiration date for license consumption.
   */
  extendLicenseConsumption(callback?: (err: AWSError, data: LicenseManager.Types.ExtendLicenseConsumptionResponse) => void): Request<LicenseManager.Types.ExtendLicenseConsumptionResponse, AWSError>;
  /**
   * Gets a temporary access token to use with AssumeRoleWithWebIdentity. Access tokens are valid for one hour.
   */
  getAccessToken(params: LicenseManager.Types.GetAccessTokenRequest, callback?: (err: AWSError, data: LicenseManager.Types.GetAccessTokenResponse) => void): Request<LicenseManager.Types.GetAccessTokenResponse, AWSError>;
  /**
   * Gets a temporary access token to use with AssumeRoleWithWebIdentity. Access tokens are valid for one hour.
   */
  getAccessToken(callback?: (err: AWSError, data: LicenseManager.Types.GetAccessTokenResponse) => void): Request<LicenseManager.Types.GetAccessTokenResponse, AWSError>;
  /**
   * Gets detailed information about the specified grant.
   */
  getGrant(params: LicenseManager.Types.GetGrantRequest, callback?: (err: AWSError, data: LicenseManager.Types.GetGrantResponse) => void): Request<LicenseManager.Types.GetGrantResponse, AWSError>;
  /**
   * Gets detailed information about the specified grant.
   */
  getGrant(callback?: (err: AWSError, data: LicenseManager.Types.GetGrantResponse) => void): Request<LicenseManager.Types.GetGrantResponse, AWSError>;
  /**
   * Gets detailed information about the specified license.
   */
  getLicense(params: LicenseManager.Types.GetLicenseRequest, callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseResponse) => void): Request<LicenseManager.Types.GetLicenseResponse, AWSError>;
  /**
   * Gets detailed information about the specified license.
   */
  getLicense(callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseResponse) => void): Request<LicenseManager.Types.GetLicenseResponse, AWSError>;
  /**
   * Gets detailed information about the specified license configuration.
   */
  getLicenseConfiguration(params: LicenseManager.Types.GetLicenseConfigurationRequest, callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseConfigurationResponse) => void): Request<LicenseManager.Types.GetLicenseConfigurationResponse, AWSError>;
  /**
   * Gets detailed information about the specified license configuration.
   */
  getLicenseConfiguration(callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseConfigurationResponse) => void): Request<LicenseManager.Types.GetLicenseConfigurationResponse, AWSError>;
  /**
   * Gets information about the specified license type conversion task.
   */
  getLicenseConversionTask(params: LicenseManager.Types.GetLicenseConversionTaskRequest, callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseConversionTaskResponse) => void): Request<LicenseManager.Types.GetLicenseConversionTaskResponse, AWSError>;
  /**
   * Gets information about the specified license type conversion task.
   */
  getLicenseConversionTask(callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseConversionTaskResponse) => void): Request<LicenseManager.Types.GetLicenseConversionTaskResponse, AWSError>;
  /**
   * Gets information about the specified report generator.
   */
  getLicenseManagerReportGenerator(params: LicenseManager.Types.GetLicenseManagerReportGeneratorRequest, callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseManagerReportGeneratorResponse) => void): Request<LicenseManager.Types.GetLicenseManagerReportGeneratorResponse, AWSError>;
  /**
   * Gets information about the specified report generator.
   */
  getLicenseManagerReportGenerator(callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseManagerReportGeneratorResponse) => void): Request<LicenseManager.Types.GetLicenseManagerReportGeneratorResponse, AWSError>;
  /**
   * Gets detailed information about the usage of the specified license.
   */
  getLicenseUsage(params: LicenseManager.Types.GetLicenseUsageRequest, callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseUsageResponse) => void): Request<LicenseManager.Types.GetLicenseUsageResponse, AWSError>;
  /**
   * Gets detailed information about the usage of the specified license.
   */
  getLicenseUsage(callback?: (err: AWSError, data: LicenseManager.Types.GetLicenseUsageResponse) => void): Request<LicenseManager.Types.GetLicenseUsageResponse, AWSError>;
  /**
   * Gets the License Manager settings for the current Region.
   */
  getServiceSettings(params: LicenseManager.Types.GetServiceSettingsRequest, callback?: (err: AWSError, data: LicenseManager.Types.GetServiceSettingsResponse) => void): Request<LicenseManager.Types.GetServiceSettingsResponse, AWSError>;
  /**
   * Gets the License Manager settings for the current Region.
   */
  getServiceSettings(callback?: (err: AWSError, data: LicenseManager.Types.GetServiceSettingsResponse) => void): Request<LicenseManager.Types.GetServiceSettingsResponse, AWSError>;
  /**
   * Lists the resource associations for the specified license configuration. Resource associations need not consume licenses from a license configuration. For example, an AMI or a stopped instance might not consume a license (depending on the license rules).
   */
  listAssociationsForLicenseConfiguration(params: LicenseManager.Types.ListAssociationsForLicenseConfigurationRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListAssociationsForLicenseConfigurationResponse) => void): Request<LicenseManager.Types.ListAssociationsForLicenseConfigurationResponse, AWSError>;
  /**
   * Lists the resource associations for the specified license configuration. Resource associations need not consume licenses from a license configuration. For example, an AMI or a stopped instance might not consume a license (depending on the license rules).
   */
  listAssociationsForLicenseConfiguration(callback?: (err: AWSError, data: LicenseManager.Types.ListAssociationsForLicenseConfigurationResponse) => void): Request<LicenseManager.Types.ListAssociationsForLicenseConfigurationResponse, AWSError>;
  /**
   * Lists the grants distributed for the specified license.
   */
  listDistributedGrants(params: LicenseManager.Types.ListDistributedGrantsRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListDistributedGrantsResponse) => void): Request<LicenseManager.Types.ListDistributedGrantsResponse, AWSError>;
  /**
   * Lists the grants distributed for the specified license.
   */
  listDistributedGrants(callback?: (err: AWSError, data: LicenseManager.Types.ListDistributedGrantsResponse) => void): Request<LicenseManager.Types.ListDistributedGrantsResponse, AWSError>;
  /**
   * Lists the license configuration operations that failed.
   */
  listFailuresForLicenseConfigurationOperations(params: LicenseManager.Types.ListFailuresForLicenseConfigurationOperationsRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListFailuresForLicenseConfigurationOperationsResponse) => void): Request<LicenseManager.Types.ListFailuresForLicenseConfigurationOperationsResponse, AWSError>;
  /**
   * Lists the license configuration operations that failed.
   */
  listFailuresForLicenseConfigurationOperations(callback?: (err: AWSError, data: LicenseManager.Types.ListFailuresForLicenseConfigurationOperationsResponse) => void): Request<LicenseManager.Types.ListFailuresForLicenseConfigurationOperationsResponse, AWSError>;
  /**
   * Lists the license configurations for your account.
   */
  listLicenseConfigurations(params: LicenseManager.Types.ListLicenseConfigurationsRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseConfigurationsResponse) => void): Request<LicenseManager.Types.ListLicenseConfigurationsResponse, AWSError>;
  /**
   * Lists the license configurations for your account.
   */
  listLicenseConfigurations(callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseConfigurationsResponse) => void): Request<LicenseManager.Types.ListLicenseConfigurationsResponse, AWSError>;
  /**
   * Lists the license type conversion tasks for your account.
   */
  listLicenseConversionTasks(params: LicenseManager.Types.ListLicenseConversionTasksRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseConversionTasksResponse) => void): Request<LicenseManager.Types.ListLicenseConversionTasksResponse, AWSError>;
  /**
   * Lists the license type conversion tasks for your account.
   */
  listLicenseConversionTasks(callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseConversionTasksResponse) => void): Request<LicenseManager.Types.ListLicenseConversionTasksResponse, AWSError>;
  /**
   * Lists the report generators for your account.
   */
  listLicenseManagerReportGenerators(params: LicenseManager.Types.ListLicenseManagerReportGeneratorsRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseManagerReportGeneratorsResponse) => void): Request<LicenseManager.Types.ListLicenseManagerReportGeneratorsResponse, AWSError>;
  /**
   * Lists the report generators for your account.
   */
  listLicenseManagerReportGenerators(callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseManagerReportGeneratorsResponse) => void): Request<LicenseManager.Types.ListLicenseManagerReportGeneratorsResponse, AWSError>;
  /**
   * Describes the license configurations for the specified resource.
   */
  listLicenseSpecificationsForResource(params: LicenseManager.Types.ListLicenseSpecificationsForResourceRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseSpecificationsForResourceResponse) => void): Request<LicenseManager.Types.ListLicenseSpecificationsForResourceResponse, AWSError>;
  /**
   * Describes the license configurations for the specified resource.
   */
  listLicenseSpecificationsForResource(callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseSpecificationsForResourceResponse) => void): Request<LicenseManager.Types.ListLicenseSpecificationsForResourceResponse, AWSError>;
  /**
   * Lists all versions of the specified license.
   */
  listLicenseVersions(params: LicenseManager.Types.ListLicenseVersionsRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseVersionsResponse) => void): Request<LicenseManager.Types.ListLicenseVersionsResponse, AWSError>;
  /**
   * Lists all versions of the specified license.
   */
  listLicenseVersions(callback?: (err: AWSError, data: LicenseManager.Types.ListLicenseVersionsResponse) => void): Request<LicenseManager.Types.ListLicenseVersionsResponse, AWSError>;
  /**
   * Lists the licenses for your account.
   */
  listLicenses(params: LicenseManager.Types.ListLicensesRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListLicensesResponse) => void): Request<LicenseManager.Types.ListLicensesResponse, AWSError>;
  /**
   * Lists the licenses for your account.
   */
  listLicenses(callback?: (err: AWSError, data: LicenseManager.Types.ListLicensesResponse) => void): Request<LicenseManager.Types.ListLicensesResponse, AWSError>;
  /**
   * Lists grants that are received. Received grants are grants created while specifying the recipient as this Amazon Web Services account, your organization, or an organizational unit (OU) to which this member account belongs.
   */
  listReceivedGrants(params: LicenseManager.Types.ListReceivedGrantsRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListReceivedGrantsResponse) => void): Request<LicenseManager.Types.ListReceivedGrantsResponse, AWSError>;
  /**
   * Lists grants that are received. Received grants are grants created while specifying the recipient as this Amazon Web Services account, your organization, or an organizational unit (OU) to which this member account belongs.
   */
  listReceivedGrants(callback?: (err: AWSError, data: LicenseManager.Types.ListReceivedGrantsResponse) => void): Request<LicenseManager.Types.ListReceivedGrantsResponse, AWSError>;
  /**
   * Lists the grants received for all accounts in the organization.
   */
  listReceivedGrantsForOrganization(params: LicenseManager.Types.ListReceivedGrantsForOrganizationRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListReceivedGrantsForOrganizationResponse) => void): Request<LicenseManager.Types.ListReceivedGrantsForOrganizationResponse, AWSError>;
  /**
   * Lists the grants received for all accounts in the organization.
   */
  listReceivedGrantsForOrganization(callback?: (err: AWSError, data: LicenseManager.Types.ListReceivedGrantsForOrganizationResponse) => void): Request<LicenseManager.Types.ListReceivedGrantsForOrganizationResponse, AWSError>;
  /**
   * Lists received licenses.
   */
  listReceivedLicenses(params: LicenseManager.Types.ListReceivedLicensesRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListReceivedLicensesResponse) => void): Request<LicenseManager.Types.ListReceivedLicensesResponse, AWSError>;
  /**
   * Lists received licenses.
   */
  listReceivedLicenses(callback?: (err: AWSError, data: LicenseManager.Types.ListReceivedLicensesResponse) => void): Request<LicenseManager.Types.ListReceivedLicensesResponse, AWSError>;
  /**
   * Lists the licenses received for all accounts in the organization.
   */
  listReceivedLicensesForOrganization(params: LicenseManager.Types.ListReceivedLicensesForOrganizationRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListReceivedLicensesForOrganizationResponse) => void): Request<LicenseManager.Types.ListReceivedLicensesForOrganizationResponse, AWSError>;
  /**
   * Lists the licenses received for all accounts in the organization.
   */
  listReceivedLicensesForOrganization(callback?: (err: AWSError, data: LicenseManager.Types.ListReceivedLicensesForOrganizationResponse) => void): Request<LicenseManager.Types.ListReceivedLicensesForOrganizationResponse, AWSError>;
  /**
   * Lists resources managed using Systems Manager inventory.
   */
  listResourceInventory(params: LicenseManager.Types.ListResourceInventoryRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListResourceInventoryResponse) => void): Request<LicenseManager.Types.ListResourceInventoryResponse, AWSError>;
  /**
   * Lists resources managed using Systems Manager inventory.
   */
  listResourceInventory(callback?: (err: AWSError, data: LicenseManager.Types.ListResourceInventoryResponse) => void): Request<LicenseManager.Types.ListResourceInventoryResponse, AWSError>;
  /**
   * Lists the tags for the specified license configuration.
   */
  listTagsForResource(params: LicenseManager.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListTagsForResourceResponse) => void): Request<LicenseManager.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified license configuration.
   */
  listTagsForResource(callback?: (err: AWSError, data: LicenseManager.Types.ListTagsForResourceResponse) => void): Request<LicenseManager.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists your tokens.
   */
  listTokens(params: LicenseManager.Types.ListTokensRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListTokensResponse) => void): Request<LicenseManager.Types.ListTokensResponse, AWSError>;
  /**
   * Lists your tokens.
   */
  listTokens(callback?: (err: AWSError, data: LicenseManager.Types.ListTokensResponse) => void): Request<LicenseManager.Types.ListTokensResponse, AWSError>;
  /**
   * Lists all license usage records for a license configuration, displaying license consumption details by resource at a selected point in time. Use this action to audit the current license consumption for any license inventory and configuration.
   */
  listUsageForLicenseConfiguration(params: LicenseManager.Types.ListUsageForLicenseConfigurationRequest, callback?: (err: AWSError, data: LicenseManager.Types.ListUsageForLicenseConfigurationResponse) => void): Request<LicenseManager.Types.ListUsageForLicenseConfigurationResponse, AWSError>;
  /**
   * Lists all license usage records for a license configuration, displaying license consumption details by resource at a selected point in time. Use this action to audit the current license consumption for any license inventory and configuration.
   */
  listUsageForLicenseConfiguration(callback?: (err: AWSError, data: LicenseManager.Types.ListUsageForLicenseConfigurationResponse) => void): Request<LicenseManager.Types.ListUsageForLicenseConfigurationResponse, AWSError>;
  /**
   * Rejects the specified grant.
   */
  rejectGrant(params: LicenseManager.Types.RejectGrantRequest, callback?: (err: AWSError, data: LicenseManager.Types.RejectGrantResponse) => void): Request<LicenseManager.Types.RejectGrantResponse, AWSError>;
  /**
   * Rejects the specified grant.
   */
  rejectGrant(callback?: (err: AWSError, data: LicenseManager.Types.RejectGrantResponse) => void): Request<LicenseManager.Types.RejectGrantResponse, AWSError>;
  /**
   * Adds the specified tags to the specified license configuration.
   */
  tagResource(params: LicenseManager.Types.TagResourceRequest, callback?: (err: AWSError, data: LicenseManager.Types.TagResourceResponse) => void): Request<LicenseManager.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified license configuration.
   */
  tagResource(callback?: (err: AWSError, data: LicenseManager.Types.TagResourceResponse) => void): Request<LicenseManager.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified license configuration.
   */
  untagResource(params: LicenseManager.Types.UntagResourceRequest, callback?: (err: AWSError, data: LicenseManager.Types.UntagResourceResponse) => void): Request<LicenseManager.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified license configuration.
   */
  untagResource(callback?: (err: AWSError, data: LicenseManager.Types.UntagResourceResponse) => void): Request<LicenseManager.Types.UntagResourceResponse, AWSError>;
  /**
   * Modifies the attributes of an existing license configuration.
   */
  updateLicenseConfiguration(params: LicenseManager.Types.UpdateLicenseConfigurationRequest, callback?: (err: AWSError, data: LicenseManager.Types.UpdateLicenseConfigurationResponse) => void): Request<LicenseManager.Types.UpdateLicenseConfigurationResponse, AWSError>;
  /**
   * Modifies the attributes of an existing license configuration.
   */
  updateLicenseConfiguration(callback?: (err: AWSError, data: LicenseManager.Types.UpdateLicenseConfigurationResponse) => void): Request<LicenseManager.Types.UpdateLicenseConfigurationResponse, AWSError>;
  /**
   * Updates a report generator. After you make changes to a report generator, it starts generating new reports within 60 minutes of being updated.
   */
  updateLicenseManagerReportGenerator(params: LicenseManager.Types.UpdateLicenseManagerReportGeneratorRequest, callback?: (err: AWSError, data: LicenseManager.Types.UpdateLicenseManagerReportGeneratorResponse) => void): Request<LicenseManager.Types.UpdateLicenseManagerReportGeneratorResponse, AWSError>;
  /**
   * Updates a report generator. After you make changes to a report generator, it starts generating new reports within 60 minutes of being updated.
   */
  updateLicenseManagerReportGenerator(callback?: (err: AWSError, data: LicenseManager.Types.UpdateLicenseManagerReportGeneratorResponse) => void): Request<LicenseManager.Types.UpdateLicenseManagerReportGeneratorResponse, AWSError>;
  /**
   * Adds or removes the specified license configurations for the specified Amazon Web Services resource. You can update the license specifications of AMIs, instances, and hosts. You cannot update the license specifications for launch templates and CloudFormation templates, as they send license configurations to the operation that creates the resource.
   */
  updateLicenseSpecificationsForResource(params: LicenseManager.Types.UpdateLicenseSpecificationsForResourceRequest, callback?: (err: AWSError, data: LicenseManager.Types.UpdateLicenseSpecificationsForResourceResponse) => void): Request<LicenseManager.Types.UpdateLicenseSpecificationsForResourceResponse, AWSError>;
  /**
   * Adds or removes the specified license configurations for the specified Amazon Web Services resource. You can update the license specifications of AMIs, instances, and hosts. You cannot update the license specifications for launch templates and CloudFormation templates, as they send license configurations to the operation that creates the resource.
   */
  updateLicenseSpecificationsForResource(callback?: (err: AWSError, data: LicenseManager.Types.UpdateLicenseSpecificationsForResourceResponse) => void): Request<LicenseManager.Types.UpdateLicenseSpecificationsForResourceResponse, AWSError>;
  /**
   * Updates License Manager settings for the current Region.
   */
  updateServiceSettings(params: LicenseManager.Types.UpdateServiceSettingsRequest, callback?: (err: AWSError, data: LicenseManager.Types.UpdateServiceSettingsResponse) => void): Request<LicenseManager.Types.UpdateServiceSettingsResponse, AWSError>;
  /**
   * Updates License Manager settings for the current Region.
   */
  updateServiceSettings(callback?: (err: AWSError, data: LicenseManager.Types.UpdateServiceSettingsResponse) => void): Request<LicenseManager.Types.UpdateServiceSettingsResponse, AWSError>;
}
declare namespace LicenseManager {
  export interface AcceptGrantRequest {
    /**
     * Amazon Resource Name (ARN) of the grant.
     */
    GrantArn: Arn;
  }
  export interface AcceptGrantResponse {
    /**
     * Grant ARN.
     */
    GrantArn?: Arn;
    /**
     * Grant status.
     */
    Status?: GrantStatus;
    /**
     * Grant version.
     */
    Version?: String;
  }
  export type ActivationOverrideBehavior = "DISTRIBUTED_GRANTS_ONLY"|"ALL_GRANTS_PERMITTED_BY_ISSUER"|string;
  export type AllowedOperation = "CreateGrant"|"CheckoutLicense"|"CheckoutBorrowLicense"|"CheckInLicense"|"ExtendConsumptionLicense"|"ListPurchasedLicenses"|"CreateToken"|string;
  export type AllowedOperationList = AllowedOperation[];
  export type Arn = string;
  export type ArnList = Arn[];
  export interface AutomatedDiscoveryInformation {
    /**
     * Time that automated discovery last ran.
     */
    LastRunTime?: DateTime;
  }
  export type Boolean = boolean;
  export interface BorrowConfiguration {
    /**
     * Indicates whether early check-ins are allowed.
     */
    AllowEarlyCheckIn: BoxBoolean;
    /**
     * Maximum time for the borrow configuration, in minutes.
     */
    MaxTimeToLiveInMinutes: BoxInteger;
  }
  export type BoxBoolean = boolean;
  export type BoxInteger = number;
  export type BoxLong = number;
  export interface CheckInLicenseRequest {
    /**
     * License consumption token.
     */
    LicenseConsumptionToken: String;
    /**
     * License beneficiary.
     */
    Beneficiary?: String;
  }
  export interface CheckInLicenseResponse {
  }
  export interface CheckoutBorrowLicenseRequest {
    /**
     * Amazon Resource Name (ARN) of the license. The license must use the borrow consumption configuration.
     */
    LicenseArn: Arn;
    /**
     * License entitlements. Partial checkouts are not supported.
     */
    Entitlements: EntitlementDataList;
    /**
     * Digital signature method. The possible value is JSON Web Signature (JWS) algorithm PS384. For more information, see RFC 7518 Digital Signature with RSASSA-PSS.
     */
    DigitalSignatureMethod: DigitalSignatureMethod;
    /**
     * Node ID.
     */
    NodeId?: String;
    /**
     * Information about constraints.
     */
    CheckoutMetadata?: MetadataList;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientToken;
  }
  export interface CheckoutBorrowLicenseResponse {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn?: Arn;
    /**
     * License consumption token.
     */
    LicenseConsumptionToken?: String;
    /**
     * Allowed license entitlements.
     */
    EntitlementsAllowed?: EntitlementDataList;
    /**
     * Node ID.
     */
    NodeId?: String;
    /**
     * Signed token.
     */
    SignedToken?: SignedToken;
    /**
     * Date and time at which the license checkout is issued.
     */
    IssuedAt?: ISO8601DateTime;
    /**
     * Date and time at which the license checkout expires.
     */
    Expiration?: ISO8601DateTime;
    /**
     * Information about constraints.
     */
    CheckoutMetadata?: MetadataList;
  }
  export interface CheckoutLicenseRequest {
    /**
     * Product SKU.
     */
    ProductSKU: String;
    /**
     * Checkout type.
     */
    CheckoutType: CheckoutType;
    /**
     * Key fingerprint identifying the license.
     */
    KeyFingerprint: String;
    /**
     * License entitlements.
     */
    Entitlements: EntitlementDataList;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientToken;
    /**
     * License beneficiary.
     */
    Beneficiary?: String;
    /**
     * Node ID.
     */
    NodeId?: String;
  }
  export interface CheckoutLicenseResponse {
    /**
     * Checkout type.
     */
    CheckoutType?: CheckoutType;
    /**
     * License consumption token.
     */
    LicenseConsumptionToken?: String;
    /**
     * Allowed license entitlements.
     */
    EntitlementsAllowed?: EntitlementDataList;
    /**
     * Signed token.
     */
    SignedToken?: SignedToken;
    /**
     * Node ID.
     */
    NodeId?: String;
    /**
     * Date and time at which the license checkout is issued.
     */
    IssuedAt?: ISO8601DateTime;
    /**
     * Date and time at which the license checkout expires.
     */
    Expiration?: ISO8601DateTime;
    /**
     * Amazon Resource Name (ARN) of the checkout license.
     */
    LicenseArn?: String;
  }
  export type CheckoutType = "PROVISIONAL"|"PERPETUAL"|string;
  export type ClientRequestToken = string;
  export type ClientToken = string;
  export interface ConsumedLicenseSummary {
    /**
     * Resource type of the resource consuming a license.
     */
    ResourceType?: ResourceType;
    /**
     * Number of licenses consumed by the resource.
     */
    ConsumedLicenses?: BoxLong;
  }
  export type ConsumedLicenseSummaryList = ConsumedLicenseSummary[];
  export interface ConsumptionConfiguration {
    /**
     * Renewal frequency.
     */
    RenewType?: RenewType;
    /**
     * Details about a provisional configuration.
     */
    ProvisionalConfiguration?: ProvisionalConfiguration;
    /**
     * Details about a borrow configuration.
     */
    BorrowConfiguration?: BorrowConfiguration;
  }
  export interface CreateGrantRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientToken;
    /**
     * Grant name.
     */
    GrantName: String;
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn: Arn;
    /**
     * The grant principals. You can specify one of the following as an Amazon Resource Name (ARN):   An Amazon Web Services account, which includes only the account specified.     An organizational unit (OU), which includes all accounts in the OU.     An organization, which will include all accounts across your organization.  
     */
    Principals: PrincipalArnList;
    /**
     * Home Region of the grant.
     */
    HomeRegion: String;
    /**
     * Allowed operations for the grant.
     */
    AllowedOperations: AllowedOperationList;
  }
  export interface CreateGrantResponse {
    /**
     * Grant ARN.
     */
    GrantArn?: Arn;
    /**
     * Grant status.
     */
    Status?: GrantStatus;
    /**
     * Grant version.
     */
    Version?: String;
  }
  export interface CreateGrantVersionRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientToken;
    /**
     * Amazon Resource Name (ARN) of the grant.
     */
    GrantArn: Arn;
    /**
     * Grant name.
     */
    GrantName?: String;
    /**
     * Allowed operations for the grant.
     */
    AllowedOperations?: AllowedOperationList;
    /**
     * Grant status.
     */
    Status?: GrantStatus;
    /**
     * Grant status reason.
     */
    StatusReason?: StatusReasonMessage;
    /**
     * Current version of the grant.
     */
    SourceVersion?: String;
    /**
     * The options specified for the grant.
     */
    Options?: Options;
  }
  export interface CreateGrantVersionResponse {
    /**
     * Grant ARN.
     */
    GrantArn?: Arn;
    /**
     * Grant status.
     */
    Status?: GrantStatus;
    /**
     * New version of the grant.
     */
    Version?: String;
  }
  export interface CreateLicenseConfigurationRequest {
    /**
     * Name of the license configuration.
     */
    Name: String;
    /**
     * Description of the license configuration.
     */
    Description?: String;
    /**
     * Dimension used to track the license inventory.
     */
    LicenseCountingType: LicenseCountingType;
    /**
     * Number of licenses managed by the license configuration.
     */
    LicenseCount?: BoxLong;
    /**
     * Indicates whether hard or soft license enforcement is used. Exceeding a hard limit blocks the launch of new instances.
     */
    LicenseCountHardLimit?: BoxBoolean;
    /**
     * License rules. The syntax is #name=value (for example, #allowedTenancy=EC2-DedicatedHost). The available rules vary by dimension, as follows.    Cores dimension: allowedTenancy | licenseAffinityToHost | maximumCores | minimumCores     Instances dimension: allowedTenancy | maximumCores | minimumCores | maximumSockets | minimumSockets | maximumVcpus | minimumVcpus     Sockets dimension: allowedTenancy | licenseAffinityToHost | maximumSockets | minimumSockets     vCPUs dimension: allowedTenancy | honorVcpuOptimization | maximumVcpus | minimumVcpus    The unit for licenseAffinityToHost is days and the range is 1 to 180. The possible values for allowedTenancy are EC2-Default, EC2-DedicatedHost, and EC2-DedicatedInstance. The possible values for honorVcpuOptimization are True and False.
     */
    LicenseRules?: StringList;
    /**
     * Tags to add to the license configuration.
     */
    Tags?: TagList;
    /**
     * When true, disassociates a resource when software is uninstalled.
     */
    DisassociateWhenNotFound?: BoxBoolean;
    /**
     * Product information.
     */
    ProductInformationList?: ProductInformationList;
  }
  export interface CreateLicenseConfigurationResponse {
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    LicenseConfigurationArn?: String;
  }
  export interface CreateLicenseConversionTaskForResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the resource you are converting the license type for.
     */
    ResourceArn: Arn;
    /**
     * Information that identifies the license type you are converting from. For the structure of the source license, see Convert a license type using the CLI  in the License Manager User Guide.
     */
    SourceLicenseContext: LicenseConversionContext;
    /**
     * Information that identifies the license type you are converting to. For the structure of the destination license, see Convert a license type using the CLI  in the License Manager User Guide.
     */
    DestinationLicenseContext: LicenseConversionContext;
  }
  export interface CreateLicenseConversionTaskForResourceResponse {
    /**
     * The ID of the created license type conversion task.
     */
    LicenseConversionTaskId?: LicenseConversionTaskId;
  }
  export interface CreateLicenseManagerReportGeneratorRequest {
    /**
     * Name of the report generator.
     */
    ReportGeneratorName: ReportGeneratorName;
    /**
     * Type of reports to generate. The following report types an be generated:   License configuration report - Reports the number and details of consumed licenses for a license configuration.   Resource report - Reports the tracked licenses and resource consumption for a license configuration.  
     */
    Type: ReportTypeList;
    /**
     * Defines the type of license configuration the report generator tracks.
     */
    ReportContext: ReportContext;
    /**
     * Frequency by which reports are generated. Reports can be generated daily, monthly, or weekly.
     */
    ReportFrequency: ReportFrequency;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientRequestToken;
    /**
     * Description of the report generator.
     */
    Description?: String;
    /**
     * Tags to add to the report generator.
     */
    Tags?: TagList;
  }
  export interface CreateLicenseManagerReportGeneratorResponse {
    /**
     * The Amazon Resource Name (ARN) of the new report generator.
     */
    LicenseManagerReportGeneratorArn?: String;
  }
  export interface CreateLicenseRequest {
    /**
     * License name.
     */
    LicenseName: String;
    /**
     * Product name.
     */
    ProductName: String;
    /**
     * Product SKU.
     */
    ProductSKU: String;
    /**
     * License issuer.
     */
    Issuer: Issuer;
    /**
     * Home Region for the license.
     */
    HomeRegion: String;
    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     */
    Validity: DatetimeRange;
    /**
     * License entitlements.
     */
    Entitlements: EntitlementList;
    /**
     * License beneficiary.
     */
    Beneficiary: String;
    /**
     * Configuration for consumption of the license. Choose a provisional configuration for workloads running with continuous connectivity. Choose a borrow configuration for workloads with offline usage.
     */
    ConsumptionConfiguration: ConsumptionConfiguration;
    /**
     * Information about the license.
     */
    LicenseMetadata?: MetadataList;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientToken;
  }
  export interface CreateLicenseResponse {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn?: Arn;
    /**
     * License status.
     */
    Status?: LicenseStatus;
    /**
     * License version.
     */
    Version?: String;
  }
  export interface CreateLicenseVersionRequest {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn: Arn;
    /**
     * License name.
     */
    LicenseName: String;
    /**
     * Product name.
     */
    ProductName: String;
    /**
     * License issuer.
     */
    Issuer: Issuer;
    /**
     * Home Region of the license.
     */
    HomeRegion: String;
    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     */
    Validity: DatetimeRange;
    /**
     * Information about the license.
     */
    LicenseMetadata?: MetadataList;
    /**
     * License entitlements.
     */
    Entitlements: EntitlementList;
    /**
     * Configuration for consumption of the license. Choose a provisional configuration for workloads running with continuous connectivity. Choose a borrow configuration for workloads with offline usage.
     */
    ConsumptionConfiguration: ConsumptionConfiguration;
    /**
     * License status.
     */
    Status: LicenseStatus;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientToken;
    /**
     * Current version of the license.
     */
    SourceVersion?: String;
  }
  export interface CreateLicenseVersionResponse {
    /**
     * License ARN.
     */
    LicenseArn?: Arn;
    /**
     * New version of the license.
     */
    Version?: String;
    /**
     * License status.
     */
    Status?: LicenseStatus;
  }
  export interface CreateTokenRequest {
    /**
     * Amazon Resource Name (ARN) of the license. The ARN is mapped to the aud claim of the JWT token.
     */
    LicenseArn: Arn;
    /**
     * Amazon Resource Name (ARN) of the IAM roles to embed in the token. License Manager does not check whether the roles are in use.
     */
    RoleArns?: ArnList;
    /**
     * Token expiration, in days, counted from token creation. The default is 365 days.
     */
    ExpirationInDays?: Integer;
    /**
     * Data specified by the caller to be included in the JWT token. The data is mapped to the amr claim of the JWT token.
     */
    TokenProperties?: MaxSize3StringList;
    /**
     * Idempotency token, valid for 10 minutes.
     */
    ClientToken: ClientToken;
  }
  export interface CreateTokenResponse {
    /**
     * Token ID.
     */
    TokenId?: String;
    /**
     * Token type.
     */
    TokenType?: TokenType;
    /**
     * Refresh token, encoded as a JWT token.
     */
    Token?: TokenString;
  }
  export type DateTime = Date;
  export interface DatetimeRange {
    /**
     * Start of the time range.
     */
    Begin: ISO8601DateTime;
    /**
     * End of the time range.
     */
    End?: ISO8601DateTime;
  }
  export interface DeleteGrantRequest {
    /**
     * Amazon Resource Name (ARN) of the grant.
     */
    GrantArn: Arn;
    /**
     * The Status reason for the delete request.
     */
    StatusReason?: StatusReasonMessage;
    /**
     * Current version of the grant.
     */
    Version: String;
  }
  export interface DeleteGrantResponse {
    /**
     * Grant ARN.
     */
    GrantArn?: Arn;
    /**
     * Grant status.
     */
    Status?: GrantStatus;
    /**
     * Grant version.
     */
    Version?: String;
  }
  export interface DeleteLicenseConfigurationRequest {
    /**
     * ID of the license configuration.
     */
    LicenseConfigurationArn: String;
  }
  export interface DeleteLicenseConfigurationResponse {
  }
  export interface DeleteLicenseManagerReportGeneratorRequest {
    /**
     * Amazon Resource Name (ARN) of the report generator to be deleted.
     */
    LicenseManagerReportGeneratorArn: String;
  }
  export interface DeleteLicenseManagerReportGeneratorResponse {
  }
  export interface DeleteLicenseRequest {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn: Arn;
    /**
     * Current version of the license.
     */
    SourceVersion: String;
  }
  export interface DeleteLicenseResponse {
    /**
     * License status.
     */
    Status?: LicenseDeletionStatus;
    /**
     * Date when the license is deleted.
     */
    DeletionDate?: ISO8601DateTime;
  }
  export interface DeleteTokenRequest {
    /**
     * Token ID.
     */
    TokenId: String;
  }
  export interface DeleteTokenResponse {
  }
  export type DigitalSignatureMethod = "JWT_PS384"|string;
  export interface Entitlement {
    /**
     * Entitlement name.
     */
    Name: String;
    /**
     * Entitlement resource. Use only if the unit is None.
     */
    Value?: String;
    /**
     * Maximum entitlement count. Use if the unit is not None.
     */
    MaxCount?: Long;
    /**
     * Indicates whether overages are allowed.
     */
    Overage?: BoxBoolean;
    /**
     * Entitlement unit.
     */
    Unit: EntitlementUnit;
    /**
     * Indicates whether check-ins are allowed.
     */
    AllowCheckIn?: BoxBoolean;
  }
  export interface EntitlementData {
    /**
     * Entitlement data name.
     */
    Name: String;
    /**
     * Entitlement data value.
     */
    Value?: String;
    /**
     * Entitlement data unit.
     */
    Unit: EntitlementDataUnit;
  }
  export type EntitlementDataList = EntitlementData[];
  export type EntitlementDataUnit = "Count"|"None"|"Seconds"|"Microseconds"|"Milliseconds"|"Bytes"|"Kilobytes"|"Megabytes"|"Gigabytes"|"Terabytes"|"Bits"|"Kilobits"|"Megabits"|"Gigabits"|"Terabits"|"Percent"|"Bytes/Second"|"Kilobytes/Second"|"Megabytes/Second"|"Gigabytes/Second"|"Terabytes/Second"|"Bits/Second"|"Kilobits/Second"|"Megabits/Second"|"Gigabits/Second"|"Terabits/Second"|"Count/Second"|string;
  export type EntitlementList = Entitlement[];
  export type EntitlementUnit = "Count"|"None"|"Seconds"|"Microseconds"|"Milliseconds"|"Bytes"|"Kilobytes"|"Megabytes"|"Gigabytes"|"Terabytes"|"Bits"|"Kilobits"|"Megabits"|"Gigabits"|"Terabits"|"Percent"|"Bytes/Second"|"Kilobytes/Second"|"Megabytes/Second"|"Gigabytes/Second"|"Terabytes/Second"|"Bits/Second"|"Kilobits/Second"|"Megabits/Second"|"Gigabits/Second"|"Terabits/Second"|"Count/Second"|string;
  export interface EntitlementUsage {
    /**
     * Entitlement usage name.
     */
    Name: String;
    /**
     * Resource usage consumed.
     */
    ConsumedValue: String;
    /**
     * Maximum entitlement usage count.
     */
    MaxCount?: String;
    /**
     * Entitlement usage unit.
     */
    Unit: EntitlementDataUnit;
  }
  export type EntitlementUsageList = EntitlementUsage[];
  export interface ExtendLicenseConsumptionRequest {
    /**
     * License consumption token.
     */
    LicenseConsumptionToken: String;
    /**
     * Checks whether you have the required permissions for the action, without actually making the request. Provides an error response if you do not have the required permissions.
     */
    DryRun?: Boolean;
  }
  export interface ExtendLicenseConsumptionResponse {
    /**
     * License consumption token.
     */
    LicenseConsumptionToken?: String;
    /**
     * Date and time at which the license consumption expires.
     */
    Expiration?: ISO8601DateTime;
  }
  export interface Filter {
    /**
     * Name of the filter. Filter names are case-sensitive.
     */
    Name?: FilterName;
    /**
     * The value of the filter, which is case-sensitive. You can only specify one value for the filter.
     */
    Values?: FilterValues;
  }
  export type FilterList = Filter[];
  export type FilterName = string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export type Filters = Filter[];
  export interface GetAccessTokenRequest {
    /**
     * Refresh token, encoded as a JWT token.
     */
    Token: TokenString;
    /**
     * Token properties to validate against those present in the JWT token.
     */
    TokenProperties?: MaxSize3StringList;
  }
  export interface GetAccessTokenResponse {
    /**
     * Temporary access token.
     */
    AccessToken?: TokenString;
  }
  export interface GetGrantRequest {
    /**
     * Amazon Resource Name (ARN) of the grant.
     */
    GrantArn: Arn;
    /**
     * Grant version.
     */
    Version?: String;
  }
  export interface GetGrantResponse {
    /**
     * Grant details.
     */
    Grant?: Grant;
  }
  export interface GetLicenseConfigurationRequest {
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    LicenseConfigurationArn: String;
  }
  export interface GetLicenseConfigurationResponse {
    /**
     * Unique ID for the license configuration.
     */
    LicenseConfigurationId?: String;
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    LicenseConfigurationArn?: String;
    /**
     * Name of the license configuration.
     */
    Name?: String;
    /**
     * Description of the license configuration.
     */
    Description?: String;
    /**
     * Dimension for which the licenses are counted.
     */
    LicenseCountingType?: LicenseCountingType;
    /**
     * License rules.
     */
    LicenseRules?: StringList;
    /**
     * Number of available licenses.
     */
    LicenseCount?: BoxLong;
    /**
     * Sets the number of available licenses as a hard limit.
     */
    LicenseCountHardLimit?: BoxBoolean;
    /**
     * Number of licenses assigned to resources.
     */
    ConsumedLicenses?: BoxLong;
    /**
     * License configuration status.
     */
    Status?: String;
    /**
     * Account ID of the owner of the license configuration.
     */
    OwnerAccountId?: String;
    /**
     * Summaries of the licenses consumed by resources.
     */
    ConsumedLicenseSummaryList?: ConsumedLicenseSummaryList;
    /**
     * Summaries of the managed resources.
     */
    ManagedResourceSummaryList?: ManagedResourceSummaryList;
    /**
     * Tags for the license configuration.
     */
    Tags?: TagList;
    /**
     * Product information.
     */
    ProductInformationList?: ProductInformationList;
    /**
     * Automated discovery information.
     */
    AutomatedDiscoveryInformation?: AutomatedDiscoveryInformation;
    /**
     * When true, disassociates a resource when software is uninstalled.
     */
    DisassociateWhenNotFound?: BoxBoolean;
  }
  export interface GetLicenseConversionTaskRequest {
    /**
     * ID of the license type conversion task to retrieve information on.
     */
    LicenseConversionTaskId: LicenseConversionTaskId;
  }
  export interface GetLicenseConversionTaskResponse {
    /**
     * ID of the license type conversion task.
     */
    LicenseConversionTaskId?: LicenseConversionTaskId;
    /**
     * Amazon Resource Names (ARN) of the resources the license conversion task is associated with.
     */
    ResourceArn?: String;
    /**
     * Information about the license type converted from.
     */
    SourceLicenseContext?: LicenseConversionContext;
    /**
     * Information about the license type converted to.
     */
    DestinationLicenseContext?: LicenseConversionContext;
    /**
     * The status message for the conversion task.
     */
    StatusMessage?: String;
    /**
     * Status of the license type conversion task.
     */
    Status?: LicenseConversionTaskStatus;
    /**
     * Time at which the license type conversion task was started .
     */
    StartTime?: DateTime;
    /**
     * Amount of time to complete the license type conversion.
     */
    LicenseConversionTime?: DateTime;
    /**
     * Time at which the license type conversion task was completed.
     */
    EndTime?: DateTime;
  }
  export interface GetLicenseManagerReportGeneratorRequest {
    /**
     * Amazon Resource Name (ARN) of the report generator.
     */
    LicenseManagerReportGeneratorArn: String;
  }
  export interface GetLicenseManagerReportGeneratorResponse {
    /**
     * A report generator that creates periodic reports about your license configurations.
     */
    ReportGenerator?: ReportGenerator;
  }
  export interface GetLicenseRequest {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn: Arn;
    /**
     * License version.
     */
    Version?: String;
  }
  export interface GetLicenseResponse {
    /**
     * License details.
     */
    License?: License;
  }
  export interface GetLicenseUsageRequest {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn: Arn;
  }
  export interface GetLicenseUsageResponse {
    /**
     * License usage details.
     */
    LicenseUsage?: LicenseUsage;
  }
  export interface GetServiceSettingsRequest {
  }
  export interface GetServiceSettingsResponse {
    /**
     * Regional S3 bucket path for storing reports, license trail event data, discovery data, and so on.
     */
    S3BucketArn?: String;
    /**
     * SNS topic configured to receive notifications from License Manager.
     */
    SnsTopicArn?: String;
    /**
     * Indicates whether Organizations is integrated with License Manager for cross-account discovery.
     */
    OrganizationConfiguration?: OrganizationConfiguration;
    /**
     * Indicates whether cross-account discovery is enabled.
     */
    EnableCrossAccountsDiscovery?: BoxBoolean;
    /**
     * Amazon Resource Name (ARN) of the resource share. The License Manager management account provides member accounts with access to this share.
     */
    LicenseManagerResourceShareArn?: String;
  }
  export interface Grant {
    /**
     * Amazon Resource Name (ARN) of the grant.
     */
    GrantArn: Arn;
    /**
     * Grant name.
     */
    GrantName: String;
    /**
     * Parent ARN.
     */
    ParentArn: Arn;
    /**
     * License ARN.
     */
    LicenseArn: Arn;
    /**
     * The grantee principal ARN.
     */
    GranteePrincipalArn: Arn;
    /**
     * Home Region of the grant.
     */
    HomeRegion: String;
    /**
     * Grant status.
     */
    GrantStatus: GrantStatus;
    /**
     * Grant status reason.
     */
    StatusReason?: StatusReasonMessage;
    /**
     * Grant version.
     */
    Version: String;
    /**
     * Granted operations.
     */
    GrantedOperations: AllowedOperationList;
    /**
     * The options specified for the grant.
     */
    Options?: Options;
  }
  export type GrantList = Grant[];
  export type GrantStatus = "PENDING_WORKFLOW"|"PENDING_ACCEPT"|"REJECTED"|"ACTIVE"|"FAILED_WORKFLOW"|"DELETED"|"PENDING_DELETE"|"DISABLED"|"WORKFLOW_COMPLETED"|string;
  export interface GrantedLicense {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn?: Arn;
    /**
     * License name.
     */
    LicenseName?: String;
    /**
     * Product name.
     */
    ProductName?: String;
    /**
     * Product SKU.
     */
    ProductSKU?: String;
    /**
     * Granted license issuer.
     */
    Issuer?: IssuerDetails;
    /**
     * Home Region of the granted license.
     */
    HomeRegion?: String;
    /**
     * Granted license status.
     */
    Status?: LicenseStatus;
    /**
     * Date and time range during which the granted license is valid, in ISO8601-UTC format.
     */
    Validity?: DatetimeRange;
    /**
     * Granted license beneficiary.
     */
    Beneficiary?: String;
    /**
     * License entitlements.
     */
    Entitlements?: EntitlementList;
    /**
     * Configuration for consumption of the license.
     */
    ConsumptionConfiguration?: ConsumptionConfiguration;
    /**
     * Granted license metadata.
     */
    LicenseMetadata?: MetadataList;
    /**
     * Creation time of the granted license.
     */
    CreateTime?: ISO8601DateTime;
    /**
     * Version of the granted license.
     */
    Version?: String;
    /**
     * Granted license received metadata.
     */
    ReceivedMetadata?: ReceivedMetadata;
  }
  export type GrantedLicenseList = GrantedLicense[];
  export type ISO8601DateTime = string;
  export type Integer = number;
  export interface InventoryFilter {
    /**
     * Name of the filter.
     */
    Name: String;
    /**
     * Condition of the filter.
     */
    Condition: InventoryFilterCondition;
    /**
     * Value of the filter.
     */
    Value?: String;
  }
  export type InventoryFilterCondition = "EQUALS"|"NOT_EQUALS"|"BEGINS_WITH"|"CONTAINS"|string;
  export type InventoryFilterList = InventoryFilter[];
  export interface Issuer {
    /**
     * Issuer name.
     */
    Name: String;
    /**
     * Asymmetric KMS key from Key Management Service. The KMS key must have a key usage of sign and verify, and support the RSASSA-PSS SHA-256 signing algorithm.
     */
    SignKey?: String;
  }
  export interface IssuerDetails {
    /**
     * Issuer name.
     */
    Name?: String;
    /**
     * Asymmetric KMS key from Key Management Service. The KMS key must have a key usage of sign and verify, and support the RSASSA-PSS SHA-256 signing algorithm.
     */
    SignKey?: String;
    /**
     * Issuer key fingerprint.
     */
    KeyFingerprint?: String;
  }
  export interface License {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn?: Arn;
    /**
     * License name.
     */
    LicenseName?: String;
    /**
     * Product name.
     */
    ProductName?: String;
    /**
     * Product SKU.
     */
    ProductSKU?: String;
    /**
     * License issuer.
     */
    Issuer?: IssuerDetails;
    /**
     * Home Region of the license.
     */
    HomeRegion?: String;
    /**
     * License status.
     */
    Status?: LicenseStatus;
    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     */
    Validity?: DatetimeRange;
    /**
     * License beneficiary.
     */
    Beneficiary?: String;
    /**
     * License entitlements.
     */
    Entitlements?: EntitlementList;
    /**
     * Configuration for consumption of the license.
     */
    ConsumptionConfiguration?: ConsumptionConfiguration;
    /**
     * License metadata.
     */
    LicenseMetadata?: MetadataList;
    /**
     * License creation time.
     */
    CreateTime?: ISO8601DateTime;
    /**
     * License version.
     */
    Version?: String;
  }
  export interface LicenseConfiguration {
    /**
     * Unique ID of the license configuration.
     */
    LicenseConfigurationId?: String;
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    LicenseConfigurationArn?: String;
    /**
     * Name of the license configuration.
     */
    Name?: String;
    /**
     * Description of the license configuration.
     */
    Description?: String;
    /**
     * Dimension to use to track the license inventory.
     */
    LicenseCountingType?: LicenseCountingType;
    /**
     * License rules.
     */
    LicenseRules?: StringList;
    /**
     * Number of licenses managed by the license configuration.
     */
    LicenseCount?: BoxLong;
    /**
     * Number of available licenses as a hard limit.
     */
    LicenseCountHardLimit?: BoxBoolean;
    /**
     * When true, disassociates a resource when software is uninstalled.
     */
    DisassociateWhenNotFound?: BoxBoolean;
    /**
     * Number of licenses consumed. 
     */
    ConsumedLicenses?: BoxLong;
    /**
     * Status of the license configuration.
     */
    Status?: String;
    /**
     * Account ID of the license configuration's owner.
     */
    OwnerAccountId?: String;
    /**
     * Summaries for licenses consumed by various resources.
     */
    ConsumedLicenseSummaryList?: ConsumedLicenseSummaryList;
    /**
     * Summaries for managed resources.
     */
    ManagedResourceSummaryList?: ManagedResourceSummaryList;
    /**
     * Product information.
     */
    ProductInformationList?: ProductInformationList;
    /**
     * Automated discovery information.
     */
    AutomatedDiscoveryInformation?: AutomatedDiscoveryInformation;
  }
  export interface LicenseConfigurationAssociation {
    /**
     * Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn?: String;
    /**
     * Type of server resource.
     */
    ResourceType?: ResourceType;
    /**
     * ID of the Amazon Web Services account that owns the resource consuming licenses.
     */
    ResourceOwnerId?: String;
    /**
     * Time when the license configuration was associated with the resource.
     */
    AssociationTime?: DateTime;
    /**
     * Scope of AMI associations. The possible value is cross-account.
     */
    AmiAssociationScope?: String;
  }
  export type LicenseConfigurationAssociations = LicenseConfigurationAssociation[];
  export type LicenseConfigurationStatus = "AVAILABLE"|"DISABLED"|string;
  export interface LicenseConfigurationUsage {
    /**
     * Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn?: String;
    /**
     * Type of resource.
     */
    ResourceType?: ResourceType;
    /**
     * Status of the resource.
     */
    ResourceStatus?: String;
    /**
     * ID of the account that owns the resource.
     */
    ResourceOwnerId?: String;
    /**
     * Time when the license configuration was initially associated with the resource.
     */
    AssociationTime?: DateTime;
    /**
     * Number of licenses consumed by the resource.
     */
    ConsumedLicenses?: BoxLong;
  }
  export type LicenseConfigurationUsageList = LicenseConfigurationUsage[];
  export type LicenseConfigurations = LicenseConfiguration[];
  export interface LicenseConversionContext {
    /**
     * The Usage operation value that corresponds to the license type you are converting your resource from. For more information about which platforms correspond to which usage operation values see Sample data: usage operation by platform  
     */
    UsageOperation?: UsageOperation;
  }
  export interface LicenseConversionTask {
    /**
     * The ID of the license type conversion task.
     */
    LicenseConversionTaskId?: LicenseConversionTaskId;
    /**
     * The Amazon Resource Name (ARN) of the resource associated with the license type conversion task.
     */
    ResourceArn?: String;
    /**
     * Information about the license type this conversion task converted from.
     */
    SourceLicenseContext?: LicenseConversionContext;
    /**
     * Information about the license type this conversion task converted to.
     */
    DestinationLicenseContext?: LicenseConversionContext;
    /**
     * The status of the conversion task.
     */
    Status?: LicenseConversionTaskStatus;
    /**
     * The status message for the conversion task.
     */
    StatusMessage?: String;
    /**
     * The time the conversion task was started at.
     */
    StartTime?: DateTime;
    /**
     * The time the usage operation value of the resource was changed.
     */
    LicenseConversionTime?: DateTime;
    /**
     * The time the conversion task was completed.
     */
    EndTime?: DateTime;
  }
  export type LicenseConversionTaskId = string;
  export type LicenseConversionTaskStatus = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export type LicenseConversionTasks = LicenseConversionTask[];
  export type LicenseCountingType = "vCPU"|"Instance"|"Core"|"Socket"|string;
  export type LicenseDeletionStatus = "PENDING_DELETE"|"DELETED"|string;
  export type LicenseList = License[];
  export interface LicenseOperationFailure {
    /**
     * Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn?: String;
    /**
     * Resource type.
     */
    ResourceType?: ResourceType;
    /**
     * Error message.
     */
    ErrorMessage?: String;
    /**
     * Failure time.
     */
    FailureTime?: DateTime;
    /**
     * Name of the operation.
     */
    OperationName?: String;
    /**
     * ID of the Amazon Web Services account that owns the resource.
     */
    ResourceOwnerId?: String;
    /**
     * The requester is "License Manager Automated Discovery".
     */
    OperationRequestedBy?: String;
    /**
     * Reserved.
     */
    MetadataList?: MetadataList;
  }
  export type LicenseOperationFailureList = LicenseOperationFailure[];
  export interface LicenseSpecification {
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    LicenseConfigurationArn: String;
    /**
     * Scope of AMI associations. The possible value is cross-account.
     */
    AmiAssociationScope?: String;
  }
  export type LicenseSpecifications = LicenseSpecification[];
  export type LicenseStatus = "AVAILABLE"|"PENDING_AVAILABLE"|"DEACTIVATED"|"SUSPENDED"|"EXPIRED"|"PENDING_DELETE"|"DELETED"|string;
  export interface LicenseUsage {
    /**
     * License entitlement usages.
     */
    EntitlementUsages?: EntitlementUsageList;
  }
  export interface ListAssociationsForLicenseConfigurationRequest {
    /**
     * Amazon Resource Name (ARN) of a license configuration.
     */
    LicenseConfigurationArn: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListAssociationsForLicenseConfigurationResponse {
    /**
     * Information about the associations for the license configuration.
     */
    LicenseConfigurationAssociations?: LicenseConfigurationAssociations;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListDistributedGrantsRequest {
    /**
     * Amazon Resource Names (ARNs) of the grants.
     */
    GrantArns?: ArnList;
    /**
     * Filters to scope the results. The following filters are supported:    LicenseArn     GrantStatus     GranteePrincipalARN     ProductSKU     LicenseIssuerName   
     */
    Filters?: FilterList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListDistributedGrantsResponse {
    /**
     * Distributed grant details.
     */
    Grants?: GrantList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListFailuresForLicenseConfigurationOperationsRequest {
    /**
     * Amazon Resource Name of the license configuration.
     */
    LicenseConfigurationArn: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListFailuresForLicenseConfigurationOperationsResponse {
    /**
     * License configuration operations that failed.
     */
    LicenseOperationFailureList?: LicenseOperationFailureList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListLicenseConfigurationsRequest {
    /**
     * Amazon Resource Names (ARN) of the license configurations.
     */
    LicenseConfigurationArns?: StringList;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Filters to scope the results. The following filters and logical operators are supported:    licenseCountingType - The dimension for which licenses are counted. Possible values are vCPU | Instance | Core | Socket. Logical operators are EQUALS | NOT_EQUALS.    enforceLicenseCount - A Boolean value that indicates whether hard license enforcement is used. Logical operators are EQUALS | NOT_EQUALS.    usagelimitExceeded - A Boolean value that indicates whether the available licenses have been exceeded. Logical operators are EQUALS | NOT_EQUALS.  
     */
    Filters?: Filters;
  }
  export interface ListLicenseConfigurationsResponse {
    /**
     * Information about the license configurations.
     */
    LicenseConfigurations?: LicenseConfigurations;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListLicenseConversionTasksRequest {
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     *  Filters to scope the results. Valid filters are ResourceArns and Status. 
     */
    Filters?: Filters;
  }
  export interface ListLicenseConversionTasksResponse {
    /**
     * Information about the license configuration tasks for your account.
     */
    LicenseConversionTasks?: LicenseConversionTasks;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListLicenseManagerReportGeneratorsRequest {
    /**
     * Filters to scope the results. The following filters are supported:     LicenseConfigurationArn   
     */
    Filters?: FilterList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListLicenseManagerReportGeneratorsResponse {
    /**
     * A report generator that creates periodic reports about your license configurations.
     */
    ReportGenerators?: ReportGeneratorList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListLicenseSpecificationsForResourceRequest {
    /**
     * Amazon Resource Name (ARN) of a resource that has an associated license configuration.
     */
    ResourceArn: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListLicenseSpecificationsForResourceResponse {
    /**
     * License configurations associated with a resource.
     */
    LicenseSpecifications?: LicenseSpecifications;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListLicenseVersionsRequest {
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn: Arn;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListLicenseVersionsResponse {
    /**
     * License details.
     */
    Licenses?: LicenseList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListLicensesRequest {
    /**
     * Amazon Resource Names (ARNs) of the licenses.
     */
    LicenseArns?: ArnList;
    /**
     * Filters to scope the results. The following filters are supported:    Beneficiary     ProductSKU     Fingerprint     Status   
     */
    Filters?: FilterList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListLicensesResponse {
    /**
     * License details.
     */
    Licenses?: LicenseList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListReceivedGrantsForOrganizationRequest {
    /**
     * The Amazon Resource Name (ARN) of the received license.
     */
    LicenseArn: Arn;
    /**
     * Filters to scope the results. The following filters are supported:    ParentArn     GranteePrincipalArn   
     */
    Filters?: FilterList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListReceivedGrantsForOrganizationResponse {
    /**
     * Lists the grants the organization has received.
     */
    Grants?: GrantList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListReceivedGrantsRequest {
    /**
     * Amazon Resource Names (ARNs) of the grants.
     */
    GrantArns?: ArnList;
    /**
     * Filters to scope the results. The following filters are supported:    ProductSKU     LicenseIssuerName     LicenseArn     GrantStatus     GranterAccountId   
     */
    Filters?: FilterList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListReceivedGrantsResponse {
    /**
     * Received grant details.
     */
    Grants?: GrantList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListReceivedLicensesForOrganizationRequest {
    /**
     * Filters to scope the results. The following filters are supported:    Beneficiary     ProductSKU   
     */
    Filters?: FilterList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListReceivedLicensesForOrganizationResponse {
    /**
     * Lists the licenses the organization has received.
     */
    Licenses?: GrantedLicenseList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListReceivedLicensesRequest {
    /**
     * Amazon Resource Names (ARNs) of the licenses.
     */
    LicenseArns?: ArnList;
    /**
     * Filters to scope the results. The following filters are supported:    ProductSKU     Status     Fingerprint     IssuerName     Beneficiary   
     */
    Filters?: FilterList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListReceivedLicensesResponse {
    /**
     * Received license details.
     */
    Licenses?: GrantedLicenseList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListResourceInventoryRequest {
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Filters to scope the results. The following filters and logical operators are supported:    account_id - The ID of the Amazon Web Services account that owns the resource. Logical operators are EQUALS | NOT_EQUALS.    application_name - The name of the application. Logical operators are EQUALS | BEGINS_WITH.    license_included - The type of license included. Logical operators are EQUALS | NOT_EQUALS. Possible values are sql-server-enterprise | sql-server-standard | sql-server-web | windows-server-datacenter.    platform - The platform of the resource. Logical operators are EQUALS | BEGINS_WITH.    resource_id - The ID of the resource. Logical operators are EQUALS | NOT_EQUALS.    tag:&lt;key&gt; - The key/value combination of a tag assigned to the resource. Logical operators are EQUALS (single account) or EQUALS | NOT_EQUALS (cross account).  
     */
    Filters?: InventoryFilterList;
  }
  export interface ListResourceInventoryResponse {
    /**
     * Information about the resources.
     */
    ResourceInventoryList?: ResourceInventoryList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    ResourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Information about the tags.
     */
    Tags?: TagList;
  }
  export interface ListTokensRequest {
    /**
     * Token IDs.
     */
    TokenIds?: StringList;
    /**
     * Filters to scope the results. The following filter is supported:    LicenseArns   
     */
    Filters?: FilterList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: MaxSize100;
  }
  export interface ListTokensResponse {
    /**
     * Received token details.
     */
    Tokens?: TokenList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export interface ListUsageForLicenseConfigurationRequest {
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    LicenseConfigurationArn: String;
    /**
     * Maximum number of results to return in a single call.
     */
    MaxResults?: BoxInteger;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
    /**
     * Filters to scope the results. The following filters and logical operators are supported:    resourceArn - The ARN of the license configuration resource. Logical operators are EQUALS | NOT_EQUALS.    resourceType - The resource type (EC2_INSTANCE | EC2_HOST | EC2_AMI | SYSTEMS_MANAGER_MANAGED_INSTANCE). Logical operators are EQUALS | NOT_EQUALS.    resourceAccount - The ID of the account that owns the resource. Logical operators are EQUALS | NOT_EQUALS.  
     */
    Filters?: Filters;
  }
  export interface ListUsageForLicenseConfigurationResponse {
    /**
     * Information about the license configurations.
     */
    LicenseConfigurationUsageList?: LicenseConfigurationUsageList;
    /**
     * Token for the next set of results.
     */
    NextToken?: String;
  }
  export type Long = number;
  export interface ManagedResourceSummary {
    /**
     * Type of resource associated with a license.
     */
    ResourceType?: ResourceType;
    /**
     * Number of resources associated with licenses.
     */
    AssociationCount?: BoxLong;
  }
  export type ManagedResourceSummaryList = ManagedResourceSummary[];
  export type MaxSize100 = number;
  export type MaxSize3StringList = String[];
  export interface Metadata {
    /**
     * The key name.
     */
    Name?: String;
    /**
     * The value.
     */
    Value?: String;
  }
  export type MetadataList = Metadata[];
  export interface Options {
    /**
     * An activation option for your grant that determines the behavior of activating a grant. Activation options can only be used with granted licenses sourced from the Amazon Web Services Marketplace. Additionally, the operation must specify the value of ACTIVE for the Status parameter.   As a license administrator, you can optionally specify an ActivationOverrideBehavior when activating a grant.   As a grantor, you can optionally specify an ActivationOverrideBehavior when you activate a grant for a grantee account in your organization.   As a grantee, if the grantor creating the distributed grant doesn’t specify an ActivationOverrideBehavior, you can optionally specify one when you are activating the grant.    DISTRIBUTED_GRANTS_ONLY  Use this value to activate a grant without replacing any member account’s active grants for the same product.  ALL_GRANTS_PERMITTED_BY_ISSUER  Use this value to activate a grant and disable other active grants in any member accounts for the same product. This action will also replace their previously activated grants with this activated grant.  
     */
    ActivationOverrideBehavior?: ActivationOverrideBehavior;
  }
  export interface OrganizationConfiguration {
    /**
     * Enables Organizations integration.
     */
    EnableIntegration: Boolean;
  }
  export type PrincipalArnList = Arn[];
  export interface ProductInformation {
    /**
     * Resource type. The possible values are SSM_MANAGED | RDS.
     */
    ResourceType: String;
    /**
     * A Product information filter consists of a ProductInformationFilterComparator which is a logical operator, a ProductInformationFilterName which specifies the type of filter being declared, and a ProductInformationFilterValue that specifies the value to filter on.  Accepted values for ProductInformationFilterName are listed here along with descriptions and valid options for ProductInformationFilterComparator.  The following filters and are supported when the resource type is SSM_MANAGED:    Application Name - The name of the application. Logical operator is EQUALS.    Application Publisher - The publisher of the application. Logical operator is EQUALS.    Application Version - The version of the application. Logical operator is EQUALS.    Platform Name - The name of the platform. Logical operator is EQUALS.    Platform Type - The platform type. Logical operator is EQUALS.    Tag:key - The key of a tag attached to an Amazon Web Services resource you wish to exclude from automated discovery. Logical operator is NOT_EQUALS. The key for your tag must be appended to Tag: following the example: Tag:name-of-your-key. ProductInformationFilterValue is optional if you are not using values for the key.     AccountId - The 12-digit ID of an Amazon Web Services account you wish to exclude from automated discovery. Logical operator is NOT_EQUALS.    License Included - The type of license included. Logical operators are EQUALS and NOT_EQUALS. Possible values are: sql-server-enterprise | sql-server-standard | sql-server-web | windows-server-datacenter.   The following filters and logical operators are supported when the resource type is RDS:    Engine Edition - The edition of the database engine. Logical operator is EQUALS. Possible values are: oracle-ee | oracle-se | oracle-se1 | oracle-se2.    License Pack - The license pack. Logical operator is EQUALS. Possible values are: data guard | diagnostic pack sqlt | tuning pack sqlt | ols | olap.  
     */
    ProductInformationFilterList: ProductInformationFilterList;
  }
  export interface ProductInformationFilter {
    /**
     * Filter name.
     */
    ProductInformationFilterName: String;
    /**
     * Filter value.
     */
    ProductInformationFilterValue?: StringList;
    /**
     * Logical operator.
     */
    ProductInformationFilterComparator: String;
  }
  export type ProductInformationFilterList = ProductInformationFilter[];
  export type ProductInformationList = ProductInformation[];
  export interface ProvisionalConfiguration {
    /**
     * Maximum time for the provisional configuration, in minutes.
     */
    MaxTimeToLiveInMinutes: BoxInteger;
  }
  export interface ReceivedMetadata {
    /**
     * Received status.
     */
    ReceivedStatus?: ReceivedStatus;
    /**
     * Received status reason.
     */
    ReceivedStatusReason?: StatusReasonMessage;
    /**
     * Allowed operations.
     */
    AllowedOperations?: AllowedOperationList;
  }
  export type ReceivedStatus = "PENDING_WORKFLOW"|"PENDING_ACCEPT"|"REJECTED"|"ACTIVE"|"FAILED_WORKFLOW"|"DELETED"|"DISABLED"|"WORKFLOW_COMPLETED"|string;
  export interface RejectGrantRequest {
    /**
     * Amazon Resource Name (ARN) of the grant.
     */
    GrantArn: Arn;
  }
  export interface RejectGrantResponse {
    /**
     * Grant ARN.
     */
    GrantArn?: Arn;
    /**
     * Grant status.
     */
    Status?: GrantStatus;
    /**
     * Grant version.
     */
    Version?: String;
  }
  export type RenewType = "None"|"Weekly"|"Monthly"|string;
  export interface ReportContext {
    /**
     * Amazon Resource Name (ARN) of the license configuration that this generator reports on.
     */
    licenseConfigurationArns: ArnList;
  }
  export interface ReportFrequency {
    /**
     * Number of times within the frequency period that a report is generated. The only supported value is 1.
     */
    value?: Integer;
    /**
     * Time period between each report. The period can be daily, weekly, or monthly.
     */
    period?: ReportFrequencyType;
  }
  export type ReportFrequencyType = "DAY"|"WEEK"|"MONTH"|string;
  export interface ReportGenerator {
    /**
     * Name of the report generator.
     */
    ReportGeneratorName?: String;
    /**
     * Type of reports that are generated.
     */
    ReportType?: ReportTypeList;
    /**
     * License configuration type for this generator.
     */
    ReportContext?: ReportContext;
    /**
     * Details about how frequently reports are generated.
     */
    ReportFrequency?: ReportFrequency;
    /**
     * Amazon Resource Name (ARN) of the report generator.
     */
    LicenseManagerReportGeneratorArn?: String;
    /**
     * Status of the last report generation attempt.
     */
    LastRunStatus?: String;
    /**
     * Failure message for the last report generation attempt.
     */
    LastRunFailureReason?: String;
    /**
     * Time the last report was generated at.
     */
    LastReportGenerationTime?: String;
    /**
     * The Amazon Web Services account ID used to create the report generator.
     */
    ReportCreatorAccount?: String;
    /**
     * Description of the report generator.
     */
    Description?: String;
    /**
     * Details of the S3 bucket that report generator reports are published to.
     */
    S3Location?: S3Location;
    /**
     * Time the report was created.
     */
    CreateTime?: String;
    /**
     * Tags associated with the report generator.
     */
    Tags?: TagList;
  }
  export type ReportGeneratorList = ReportGenerator[];
  export type ReportGeneratorName = string;
  export type ReportType = "LicenseConfigurationSummaryReport"|"LicenseConfigurationUsageReport"|string;
  export type ReportTypeList = ReportType[];
  export interface ResourceInventory {
    /**
     * ID of the resource.
     */
    ResourceId?: String;
    /**
     * Type of resource.
     */
    ResourceType?: ResourceType;
    /**
     * Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn?: String;
    /**
     * Platform of the resource.
     */
    Platform?: String;
    /**
     * Platform version of the resource in the inventory.
     */
    PlatformVersion?: String;
    /**
     * ID of the account that owns the resource.
     */
    ResourceOwningAccountId?: String;
  }
  export type ResourceInventoryList = ResourceInventory[];
  export type ResourceType = "EC2_INSTANCE"|"EC2_HOST"|"EC2_AMI"|"RDS"|"SYSTEMS_MANAGER_MANAGED_INSTANCE"|string;
  export interface S3Location {
    /**
     * Name of the S3 bucket reports are published to.
     */
    bucket?: String;
    /**
     * Prefix of the S3 bucket reports are published to.
     */
    keyPrefix?: String;
  }
  export type SignedToken = string;
  export type StatusReasonMessage = string;
  export type String = string;
  export type StringList = String[];
  export interface Tag {
    /**
     * Tag key.
     */
    Key?: String;
    /**
     * Tag value.
     */
    Value?: String;
  }
  export type TagKeyList = String[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    ResourceArn: String;
    /**
     * One or more tags.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export interface TokenData {
    /**
     * Token ID.
     */
    TokenId?: String;
    /**
     * Type of token generated. The supported value is REFRESH_TOKEN.
     */
    TokenType?: String;
    /**
     * Amazon Resource Name (ARN) of the license.
     */
    LicenseArn?: String;
    /**
     * Token expiration time, in ISO8601-UTC format.
     */
    ExpirationTime?: ISO8601DateTime;
    /**
     * Data specified by the caller.
     */
    TokenProperties?: MaxSize3StringList;
    /**
     * Amazon Resource Names (ARN) of the roles included in the token.
     */
    RoleArns?: ArnList;
    /**
     * Token status. The possible values are AVAILABLE and DELETED.
     */
    Status?: String;
  }
  export type TokenList = TokenData[];
  export type TokenString = string;
  export type TokenType = "REFRESH_TOKEN"|string;
  export interface UntagResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    ResourceArn: String;
    /**
     * Keys identifying the tags to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateLicenseConfigurationRequest {
    /**
     * Amazon Resource Name (ARN) of the license configuration.
     */
    LicenseConfigurationArn: String;
    /**
     * New status of the license configuration.
     */
    LicenseConfigurationStatus?: LicenseConfigurationStatus;
    /**
     * New license rule. The only rule that you can add after you create a license configuration is licenseAffinityToHost.
     */
    LicenseRules?: StringList;
    /**
     * New number of licenses managed by the license configuration.
     */
    LicenseCount?: BoxLong;
    /**
     * New hard limit of the number of available licenses.
     */
    LicenseCountHardLimit?: BoxBoolean;
    /**
     * New name of the license configuration.
     */
    Name?: String;
    /**
     * New description of the license configuration.
     */
    Description?: String;
    /**
     * New product information.
     */
    ProductInformationList?: ProductInformationList;
    /**
     * When true, disassociates a resource when software is uninstalled.
     */
    DisassociateWhenNotFound?: BoxBoolean;
  }
  export interface UpdateLicenseConfigurationResponse {
  }
  export interface UpdateLicenseManagerReportGeneratorRequest {
    /**
     * Amazon Resource Name (ARN) of the report generator to update.
     */
    LicenseManagerReportGeneratorArn: String;
    /**
     * Name of the report generator.
     */
    ReportGeneratorName: ReportGeneratorName;
    /**
     * Type of reports to generate. The following report types are supported:   License configuration report - Reports the number and details of consumed licenses for a license configuration.   Resource report - Reports the tracked licenses and resource consumption for a license configuration.  
     */
    Type: ReportTypeList;
    /**
     * The report context.
     */
    ReportContext: ReportContext;
    /**
     * Frequency by which reports are generated.
     */
    ReportFrequency: ReportFrequency;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    ClientToken: ClientRequestToken;
    /**
     * Description of the report generator.
     */
    Description?: String;
  }
  export interface UpdateLicenseManagerReportGeneratorResponse {
  }
  export interface UpdateLicenseSpecificationsForResourceRequest {
    /**
     * Amazon Resource Name (ARN) of the Amazon Web Services resource.
     */
    ResourceArn: String;
    /**
     * ARNs of the license configurations to add.
     */
    AddLicenseSpecifications?: LicenseSpecifications;
    /**
     * ARNs of the license configurations to remove.
     */
    RemoveLicenseSpecifications?: LicenseSpecifications;
  }
  export interface UpdateLicenseSpecificationsForResourceResponse {
  }
  export interface UpdateServiceSettingsRequest {
    /**
     * Amazon Resource Name (ARN) of the Amazon S3 bucket where the License Manager information is stored.
     */
    S3BucketArn?: String;
    /**
     * Amazon Resource Name (ARN) of the Amazon SNS topic used for License Manager alerts.
     */
    SnsTopicArn?: String;
    /**
     * Enables integration with Organizations for cross-account discovery.
     */
    OrganizationConfiguration?: OrganizationConfiguration;
    /**
     * Activates cross-account discovery.
     */
    EnableCrossAccountsDiscovery?: BoxBoolean;
  }
  export interface UpdateServiceSettingsResponse {
  }
  export type UsageOperation = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-08-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LicenseManager client.
   */
  export import Types = LicenseManager;
}
export = LicenseManager;
