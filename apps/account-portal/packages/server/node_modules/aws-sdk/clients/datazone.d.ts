import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class DataZone extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: DataZone.Types.ClientConfiguration)
  config: Config & DataZone.Types.ClientConfiguration;
  /**
   * Accepts automatically generated business-friendly metadata for your Amazon DataZone assets.
   */
  acceptPredictions(params: DataZone.Types.AcceptPredictionsInput, callback?: (err: AWSError, data: DataZone.Types.AcceptPredictionsOutput) => void): Request<DataZone.Types.AcceptPredictionsOutput, AWSError>;
  /**
   * Accepts automatically generated business-friendly metadata for your Amazon DataZone assets.
   */
  acceptPredictions(callback?: (err: AWSError, data: DataZone.Types.AcceptPredictionsOutput) => void): Request<DataZone.Types.AcceptPredictionsOutput, AWSError>;
  /**
   * Accepts a subscription request to a specific asset. 
   */
  acceptSubscriptionRequest(params: DataZone.Types.AcceptSubscriptionRequestInput, callback?: (err: AWSError, data: DataZone.Types.AcceptSubscriptionRequestOutput) => void): Request<DataZone.Types.AcceptSubscriptionRequestOutput, AWSError>;
  /**
   * Accepts a subscription request to a specific asset. 
   */
  acceptSubscriptionRequest(callback?: (err: AWSError, data: DataZone.Types.AcceptSubscriptionRequestOutput) => void): Request<DataZone.Types.AcceptSubscriptionRequestOutput, AWSError>;
  /**
   * Cancels the subscription to the specified asset.
   */
  cancelSubscription(params: DataZone.Types.CancelSubscriptionInput, callback?: (err: AWSError, data: DataZone.Types.CancelSubscriptionOutput) => void): Request<DataZone.Types.CancelSubscriptionOutput, AWSError>;
  /**
   * Cancels the subscription to the specified asset.
   */
  cancelSubscription(callback?: (err: AWSError, data: DataZone.Types.CancelSubscriptionOutput) => void): Request<DataZone.Types.CancelSubscriptionOutput, AWSError>;
  /**
   * Creates an asset in Amazon DataZone catalog.
   */
  createAsset(params: DataZone.Types.CreateAssetInput, callback?: (err: AWSError, data: DataZone.Types.CreateAssetOutput) => void): Request<DataZone.Types.CreateAssetOutput, AWSError>;
  /**
   * Creates an asset in Amazon DataZone catalog.
   */
  createAsset(callback?: (err: AWSError, data: DataZone.Types.CreateAssetOutput) => void): Request<DataZone.Types.CreateAssetOutput, AWSError>;
  /**
   * Creates a revision of the asset.
   */
  createAssetRevision(params: DataZone.Types.CreateAssetRevisionInput, callback?: (err: AWSError, data: DataZone.Types.CreateAssetRevisionOutput) => void): Request<DataZone.Types.CreateAssetRevisionOutput, AWSError>;
  /**
   * Creates a revision of the asset.
   */
  createAssetRevision(callback?: (err: AWSError, data: DataZone.Types.CreateAssetRevisionOutput) => void): Request<DataZone.Types.CreateAssetRevisionOutput, AWSError>;
  /**
   * Creates a custom asset type.
   */
  createAssetType(params: DataZone.Types.CreateAssetTypeInput, callback?: (err: AWSError, data: DataZone.Types.CreateAssetTypeOutput) => void): Request<DataZone.Types.CreateAssetTypeOutput, AWSError>;
  /**
   * Creates a custom asset type.
   */
  createAssetType(callback?: (err: AWSError, data: DataZone.Types.CreateAssetTypeOutput) => void): Request<DataZone.Types.CreateAssetTypeOutput, AWSError>;
  /**
   * Creates an Amazon DataZone data source.
   */
  createDataSource(params: DataZone.Types.CreateDataSourceInput, callback?: (err: AWSError, data: DataZone.Types.CreateDataSourceOutput) => void): Request<DataZone.Types.CreateDataSourceOutput, AWSError>;
  /**
   * Creates an Amazon DataZone data source.
   */
  createDataSource(callback?: (err: AWSError, data: DataZone.Types.CreateDataSourceOutput) => void): Request<DataZone.Types.CreateDataSourceOutput, AWSError>;
  /**
   * Creates an Amazon DataZone domain.
   */
  createDomain(params: DataZone.Types.CreateDomainInput, callback?: (err: AWSError, data: DataZone.Types.CreateDomainOutput) => void): Request<DataZone.Types.CreateDomainOutput, AWSError>;
  /**
   * Creates an Amazon DataZone domain.
   */
  createDomain(callback?: (err: AWSError, data: DataZone.Types.CreateDomainOutput) => void): Request<DataZone.Types.CreateDomainOutput, AWSError>;
  /**
   * Create an Amazon DataZone environment.
   */
  createEnvironment(params: DataZone.Types.CreateEnvironmentInput, callback?: (err: AWSError, data: DataZone.Types.CreateEnvironmentOutput) => void): Request<DataZone.Types.CreateEnvironmentOutput, AWSError>;
  /**
   * Create an Amazon DataZone environment.
   */
  createEnvironment(callback?: (err: AWSError, data: DataZone.Types.CreateEnvironmentOutput) => void): Request<DataZone.Types.CreateEnvironmentOutput, AWSError>;
  /**
   * Creates an Amazon DataZone environment profile.
   */
  createEnvironmentProfile(params: DataZone.Types.CreateEnvironmentProfileInput, callback?: (err: AWSError, data: DataZone.Types.CreateEnvironmentProfileOutput) => void): Request<DataZone.Types.CreateEnvironmentProfileOutput, AWSError>;
  /**
   * Creates an Amazon DataZone environment profile.
   */
  createEnvironmentProfile(callback?: (err: AWSError, data: DataZone.Types.CreateEnvironmentProfileOutput) => void): Request<DataZone.Types.CreateEnvironmentProfileOutput, AWSError>;
  /**
   * Creates a metadata form type.
   */
  createFormType(params: DataZone.Types.CreateFormTypeInput, callback?: (err: AWSError, data: DataZone.Types.CreateFormTypeOutput) => void): Request<DataZone.Types.CreateFormTypeOutput, AWSError>;
  /**
   * Creates a metadata form type.
   */
  createFormType(callback?: (err: AWSError, data: DataZone.Types.CreateFormTypeOutput) => void): Request<DataZone.Types.CreateFormTypeOutput, AWSError>;
  /**
   * Creates an Amazon DataZone business glossary.
   */
  createGlossary(params: DataZone.Types.CreateGlossaryInput, callback?: (err: AWSError, data: DataZone.Types.CreateGlossaryOutput) => void): Request<DataZone.Types.CreateGlossaryOutput, AWSError>;
  /**
   * Creates an Amazon DataZone business glossary.
   */
  createGlossary(callback?: (err: AWSError, data: DataZone.Types.CreateGlossaryOutput) => void): Request<DataZone.Types.CreateGlossaryOutput, AWSError>;
  /**
   * Creates a business glossary term.
   */
  createGlossaryTerm(params: DataZone.Types.CreateGlossaryTermInput, callback?: (err: AWSError, data: DataZone.Types.CreateGlossaryTermOutput) => void): Request<DataZone.Types.CreateGlossaryTermOutput, AWSError>;
  /**
   * Creates a business glossary term.
   */
  createGlossaryTerm(callback?: (err: AWSError, data: DataZone.Types.CreateGlossaryTermOutput) => void): Request<DataZone.Types.CreateGlossaryTermOutput, AWSError>;
  /**
   * Creates a group profile in Amazon DataZone.
   */
  createGroupProfile(params: DataZone.Types.CreateGroupProfileInput, callback?: (err: AWSError, data: DataZone.Types.CreateGroupProfileOutput) => void): Request<DataZone.Types.CreateGroupProfileOutput, AWSError>;
  /**
   * Creates a group profile in Amazon DataZone.
   */
  createGroupProfile(callback?: (err: AWSError, data: DataZone.Types.CreateGroupProfileOutput) => void): Request<DataZone.Types.CreateGroupProfileOutput, AWSError>;
  /**
   * 
   */
  createListingChangeSet(params: DataZone.Types.CreateListingChangeSetInput, callback?: (err: AWSError, data: DataZone.Types.CreateListingChangeSetOutput) => void): Request<DataZone.Types.CreateListingChangeSetOutput, AWSError>;
  /**
   * 
   */
  createListingChangeSet(callback?: (err: AWSError, data: DataZone.Types.CreateListingChangeSetOutput) => void): Request<DataZone.Types.CreateListingChangeSetOutput, AWSError>;
  /**
   * Creates an Amazon DataZone project.
   */
  createProject(params: DataZone.Types.CreateProjectInput, callback?: (err: AWSError, data: DataZone.Types.CreateProjectOutput) => void): Request<DataZone.Types.CreateProjectOutput, AWSError>;
  /**
   * Creates an Amazon DataZone project.
   */
  createProject(callback?: (err: AWSError, data: DataZone.Types.CreateProjectOutput) => void): Request<DataZone.Types.CreateProjectOutput, AWSError>;
  /**
   * Creates a project membership in Amazon DataZone.
   */
  createProjectMembership(params: DataZone.Types.CreateProjectMembershipInput, callback?: (err: AWSError, data: DataZone.Types.CreateProjectMembershipOutput) => void): Request<DataZone.Types.CreateProjectMembershipOutput, AWSError>;
  /**
   * Creates a project membership in Amazon DataZone.
   */
  createProjectMembership(callback?: (err: AWSError, data: DataZone.Types.CreateProjectMembershipOutput) => void): Request<DataZone.Types.CreateProjectMembershipOutput, AWSError>;
  /**
   * Creates a subsscription grant in Amazon DataZone.
   */
  createSubscriptionGrant(params: DataZone.Types.CreateSubscriptionGrantInput, callback?: (err: AWSError, data: DataZone.Types.CreateSubscriptionGrantOutput) => void): Request<DataZone.Types.CreateSubscriptionGrantOutput, AWSError>;
  /**
   * Creates a subsscription grant in Amazon DataZone.
   */
  createSubscriptionGrant(callback?: (err: AWSError, data: DataZone.Types.CreateSubscriptionGrantOutput) => void): Request<DataZone.Types.CreateSubscriptionGrantOutput, AWSError>;
  /**
   * Creates a subscription request in Amazon DataZone.
   */
  createSubscriptionRequest(params: DataZone.Types.CreateSubscriptionRequestInput, callback?: (err: AWSError, data: DataZone.Types.CreateSubscriptionRequestOutput) => void): Request<DataZone.Types.CreateSubscriptionRequestOutput, AWSError>;
  /**
   * Creates a subscription request in Amazon DataZone.
   */
  createSubscriptionRequest(callback?: (err: AWSError, data: DataZone.Types.CreateSubscriptionRequestOutput) => void): Request<DataZone.Types.CreateSubscriptionRequestOutput, AWSError>;
  /**
   * Creates a subscription target in Amazon DataZone.
   */
  createSubscriptionTarget(params: DataZone.Types.CreateSubscriptionTargetInput, callback?: (err: AWSError, data: DataZone.Types.CreateSubscriptionTargetOutput) => void): Request<DataZone.Types.CreateSubscriptionTargetOutput, AWSError>;
  /**
   * Creates a subscription target in Amazon DataZone.
   */
  createSubscriptionTarget(callback?: (err: AWSError, data: DataZone.Types.CreateSubscriptionTargetOutput) => void): Request<DataZone.Types.CreateSubscriptionTargetOutput, AWSError>;
  /**
   * Creates a user profile in Amazon DataZone.
   */
  createUserProfile(params: DataZone.Types.CreateUserProfileInput, callback?: (err: AWSError, data: DataZone.Types.CreateUserProfileOutput) => void): Request<DataZone.Types.CreateUserProfileOutput, AWSError>;
  /**
   * Creates a user profile in Amazon DataZone.
   */
  createUserProfile(callback?: (err: AWSError, data: DataZone.Types.CreateUserProfileOutput) => void): Request<DataZone.Types.CreateUserProfileOutput, AWSError>;
  /**
   * Delets an asset in Amazon DataZone.
   */
  deleteAsset(params: DataZone.Types.DeleteAssetInput, callback?: (err: AWSError, data: DataZone.Types.DeleteAssetOutput) => void): Request<DataZone.Types.DeleteAssetOutput, AWSError>;
  /**
   * Delets an asset in Amazon DataZone.
   */
  deleteAsset(callback?: (err: AWSError, data: DataZone.Types.DeleteAssetOutput) => void): Request<DataZone.Types.DeleteAssetOutput, AWSError>;
  /**
   * Deletes an asset type in Amazon DataZone.
   */
  deleteAssetType(params: DataZone.Types.DeleteAssetTypeInput, callback?: (err: AWSError, data: DataZone.Types.DeleteAssetTypeOutput) => void): Request<DataZone.Types.DeleteAssetTypeOutput, AWSError>;
  /**
   * Deletes an asset type in Amazon DataZone.
   */
  deleteAssetType(callback?: (err: AWSError, data: DataZone.Types.DeleteAssetTypeOutput) => void): Request<DataZone.Types.DeleteAssetTypeOutput, AWSError>;
  /**
   * Deletes a data source in Amazon DataZone.
   */
  deleteDataSource(params: DataZone.Types.DeleteDataSourceInput, callback?: (err: AWSError, data: DataZone.Types.DeleteDataSourceOutput) => void): Request<DataZone.Types.DeleteDataSourceOutput, AWSError>;
  /**
   * Deletes a data source in Amazon DataZone.
   */
  deleteDataSource(callback?: (err: AWSError, data: DataZone.Types.DeleteDataSourceOutput) => void): Request<DataZone.Types.DeleteDataSourceOutput, AWSError>;
  /**
   * Deletes a Amazon DataZone domain.
   */
  deleteDomain(params: DataZone.Types.DeleteDomainInput, callback?: (err: AWSError, data: DataZone.Types.DeleteDomainOutput) => void): Request<DataZone.Types.DeleteDomainOutput, AWSError>;
  /**
   * Deletes a Amazon DataZone domain.
   */
  deleteDomain(callback?: (err: AWSError, data: DataZone.Types.DeleteDomainOutput) => void): Request<DataZone.Types.DeleteDomainOutput, AWSError>;
  /**
   * Deletes an environment in Amazon DataZone.
   */
  deleteEnvironment(params: DataZone.Types.DeleteEnvironmentInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an environment in Amazon DataZone.
   */
  deleteEnvironment(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the blueprint configuration in Amazon DataZone.
   */
  deleteEnvironmentBlueprintConfiguration(params: DataZone.Types.DeleteEnvironmentBlueprintConfigurationInput, callback?: (err: AWSError, data: DataZone.Types.DeleteEnvironmentBlueprintConfigurationOutput) => void): Request<DataZone.Types.DeleteEnvironmentBlueprintConfigurationOutput, AWSError>;
  /**
   * Deletes the blueprint configuration in Amazon DataZone.
   */
  deleteEnvironmentBlueprintConfiguration(callback?: (err: AWSError, data: DataZone.Types.DeleteEnvironmentBlueprintConfigurationOutput) => void): Request<DataZone.Types.DeleteEnvironmentBlueprintConfigurationOutput, AWSError>;
  /**
   * Deletes an environment profile in Amazon DataZone.
   */
  deleteEnvironmentProfile(params: DataZone.Types.DeleteEnvironmentProfileInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an environment profile in Amazon DataZone.
   */
  deleteEnvironmentProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delets and metadata form type in Amazon DataZone.
   */
  deleteFormType(params: DataZone.Types.DeleteFormTypeInput, callback?: (err: AWSError, data: DataZone.Types.DeleteFormTypeOutput) => void): Request<DataZone.Types.DeleteFormTypeOutput, AWSError>;
  /**
   * Delets and metadata form type in Amazon DataZone.
   */
  deleteFormType(callback?: (err: AWSError, data: DataZone.Types.DeleteFormTypeOutput) => void): Request<DataZone.Types.DeleteFormTypeOutput, AWSError>;
  /**
   * Deletes a business glossary in Amazon DataZone.
   */
  deleteGlossary(params: DataZone.Types.DeleteGlossaryInput, callback?: (err: AWSError, data: DataZone.Types.DeleteGlossaryOutput) => void): Request<DataZone.Types.DeleteGlossaryOutput, AWSError>;
  /**
   * Deletes a business glossary in Amazon DataZone.
   */
  deleteGlossary(callback?: (err: AWSError, data: DataZone.Types.DeleteGlossaryOutput) => void): Request<DataZone.Types.DeleteGlossaryOutput, AWSError>;
  /**
   * Deletes a business glossary term in Amazon DataZone.
   */
  deleteGlossaryTerm(params: DataZone.Types.DeleteGlossaryTermInput, callback?: (err: AWSError, data: DataZone.Types.DeleteGlossaryTermOutput) => void): Request<DataZone.Types.DeleteGlossaryTermOutput, AWSError>;
  /**
   * Deletes a business glossary term in Amazon DataZone.
   */
  deleteGlossaryTerm(callback?: (err: AWSError, data: DataZone.Types.DeleteGlossaryTermOutput) => void): Request<DataZone.Types.DeleteGlossaryTermOutput, AWSError>;
  /**
   * 
   */
  deleteListing(params: DataZone.Types.DeleteListingInput, callback?: (err: AWSError, data: DataZone.Types.DeleteListingOutput) => void): Request<DataZone.Types.DeleteListingOutput, AWSError>;
  /**
   * 
   */
  deleteListing(callback?: (err: AWSError, data: DataZone.Types.DeleteListingOutput) => void): Request<DataZone.Types.DeleteListingOutput, AWSError>;
  /**
   * Deletes a project in Amazon DataZone. 
   */
  deleteProject(params: DataZone.Types.DeleteProjectInput, callback?: (err: AWSError, data: DataZone.Types.DeleteProjectOutput) => void): Request<DataZone.Types.DeleteProjectOutput, AWSError>;
  /**
   * Deletes a project in Amazon DataZone. 
   */
  deleteProject(callback?: (err: AWSError, data: DataZone.Types.DeleteProjectOutput) => void): Request<DataZone.Types.DeleteProjectOutput, AWSError>;
  /**
   * Deletes project membership in Amazon DataZone.
   */
  deleteProjectMembership(params: DataZone.Types.DeleteProjectMembershipInput, callback?: (err: AWSError, data: DataZone.Types.DeleteProjectMembershipOutput) => void): Request<DataZone.Types.DeleteProjectMembershipOutput, AWSError>;
  /**
   * Deletes project membership in Amazon DataZone.
   */
  deleteProjectMembership(callback?: (err: AWSError, data: DataZone.Types.DeleteProjectMembershipOutput) => void): Request<DataZone.Types.DeleteProjectMembershipOutput, AWSError>;
  /**
   * Deletes and subscription grant in Amazon DataZone.
   */
  deleteSubscriptionGrant(params: DataZone.Types.DeleteSubscriptionGrantInput, callback?: (err: AWSError, data: DataZone.Types.DeleteSubscriptionGrantOutput) => void): Request<DataZone.Types.DeleteSubscriptionGrantOutput, AWSError>;
  /**
   * Deletes and subscription grant in Amazon DataZone.
   */
  deleteSubscriptionGrant(callback?: (err: AWSError, data: DataZone.Types.DeleteSubscriptionGrantOutput) => void): Request<DataZone.Types.DeleteSubscriptionGrantOutput, AWSError>;
  /**
   * Deletes a subscription request in Amazon DataZone.
   */
  deleteSubscriptionRequest(params: DataZone.Types.DeleteSubscriptionRequestInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a subscription request in Amazon DataZone.
   */
  deleteSubscriptionRequest(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a subscription target in Amazon DataZone.
   */
  deleteSubscriptionTarget(params: DataZone.Types.DeleteSubscriptionTargetInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a subscription target in Amazon DataZone.
   */
  deleteSubscriptionTarget(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets an Amazon DataZone asset.
   */
  getAsset(params: DataZone.Types.GetAssetInput, callback?: (err: AWSError, data: DataZone.Types.GetAssetOutput) => void): Request<DataZone.Types.GetAssetOutput, AWSError>;
  /**
   * Gets an Amazon DataZone asset.
   */
  getAsset(callback?: (err: AWSError, data: DataZone.Types.GetAssetOutput) => void): Request<DataZone.Types.GetAssetOutput, AWSError>;
  /**
   * Gets an Amazon DataZone asset type.
   */
  getAssetType(params: DataZone.Types.GetAssetTypeInput, callback?: (err: AWSError, data: DataZone.Types.GetAssetTypeOutput) => void): Request<DataZone.Types.GetAssetTypeOutput, AWSError>;
  /**
   * Gets an Amazon DataZone asset type.
   */
  getAssetType(callback?: (err: AWSError, data: DataZone.Types.GetAssetTypeOutput) => void): Request<DataZone.Types.GetAssetTypeOutput, AWSError>;
  /**
   * Gets an Amazon DataZone data source.
   */
  getDataSource(params: DataZone.Types.GetDataSourceInput, callback?: (err: AWSError, data: DataZone.Types.GetDataSourceOutput) => void): Request<DataZone.Types.GetDataSourceOutput, AWSError>;
  /**
   * Gets an Amazon DataZone data source.
   */
  getDataSource(callback?: (err: AWSError, data: DataZone.Types.GetDataSourceOutput) => void): Request<DataZone.Types.GetDataSourceOutput, AWSError>;
  /**
   * Gets an Amazon DataZone data source run.
   */
  getDataSourceRun(params: DataZone.Types.GetDataSourceRunInput, callback?: (err: AWSError, data: DataZone.Types.GetDataSourceRunOutput) => void): Request<DataZone.Types.GetDataSourceRunOutput, AWSError>;
  /**
   * Gets an Amazon DataZone data source run.
   */
  getDataSourceRun(callback?: (err: AWSError, data: DataZone.Types.GetDataSourceRunOutput) => void): Request<DataZone.Types.GetDataSourceRunOutput, AWSError>;
  /**
   * Gets an Amazon DataZone domain.
   */
  getDomain(params: DataZone.Types.GetDomainInput, callback?: (err: AWSError, data: DataZone.Types.GetDomainOutput) => void): Request<DataZone.Types.GetDomainOutput, AWSError>;
  /**
   * Gets an Amazon DataZone domain.
   */
  getDomain(callback?: (err: AWSError, data: DataZone.Types.GetDomainOutput) => void): Request<DataZone.Types.GetDomainOutput, AWSError>;
  /**
   * Gets an Amazon DataZone environment.
   */
  getEnvironment(params: DataZone.Types.GetEnvironmentInput, callback?: (err: AWSError, data: DataZone.Types.GetEnvironmentOutput) => void): Request<DataZone.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Gets an Amazon DataZone environment.
   */
  getEnvironment(callback?: (err: AWSError, data: DataZone.Types.GetEnvironmentOutput) => void): Request<DataZone.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Gets an Amazon DataZone blueprint.
   */
  getEnvironmentBlueprint(params: DataZone.Types.GetEnvironmentBlueprintInput, callback?: (err: AWSError, data: DataZone.Types.GetEnvironmentBlueprintOutput) => void): Request<DataZone.Types.GetEnvironmentBlueprintOutput, AWSError>;
  /**
   * Gets an Amazon DataZone blueprint.
   */
  getEnvironmentBlueprint(callback?: (err: AWSError, data: DataZone.Types.GetEnvironmentBlueprintOutput) => void): Request<DataZone.Types.GetEnvironmentBlueprintOutput, AWSError>;
  /**
   * Gets the blueprint configuration in Amazon DataZone.
   */
  getEnvironmentBlueprintConfiguration(params: DataZone.Types.GetEnvironmentBlueprintConfigurationInput, callback?: (err: AWSError, data: DataZone.Types.GetEnvironmentBlueprintConfigurationOutput) => void): Request<DataZone.Types.GetEnvironmentBlueprintConfigurationOutput, AWSError>;
  /**
   * Gets the blueprint configuration in Amazon DataZone.
   */
  getEnvironmentBlueprintConfiguration(callback?: (err: AWSError, data: DataZone.Types.GetEnvironmentBlueprintConfigurationOutput) => void): Request<DataZone.Types.GetEnvironmentBlueprintConfigurationOutput, AWSError>;
  /**
   * Gets an evinronment profile in Amazon DataZone.
   */
  getEnvironmentProfile(params: DataZone.Types.GetEnvironmentProfileInput, callback?: (err: AWSError, data: DataZone.Types.GetEnvironmentProfileOutput) => void): Request<DataZone.Types.GetEnvironmentProfileOutput, AWSError>;
  /**
   * Gets an evinronment profile in Amazon DataZone.
   */
  getEnvironmentProfile(callback?: (err: AWSError, data: DataZone.Types.GetEnvironmentProfileOutput) => void): Request<DataZone.Types.GetEnvironmentProfileOutput, AWSError>;
  /**
   * Gets a metadata form type in Amazon DataZone.
   */
  getFormType(params: DataZone.Types.GetFormTypeInput, callback?: (err: AWSError, data: DataZone.Types.GetFormTypeOutput) => void): Request<DataZone.Types.GetFormTypeOutput, AWSError>;
  /**
   * Gets a metadata form type in Amazon DataZone.
   */
  getFormType(callback?: (err: AWSError, data: DataZone.Types.GetFormTypeOutput) => void): Request<DataZone.Types.GetFormTypeOutput, AWSError>;
  /**
   * Gets a business glossary in Amazon DataZone.
   */
  getGlossary(params: DataZone.Types.GetGlossaryInput, callback?: (err: AWSError, data: DataZone.Types.GetGlossaryOutput) => void): Request<DataZone.Types.GetGlossaryOutput, AWSError>;
  /**
   * Gets a business glossary in Amazon DataZone.
   */
  getGlossary(callback?: (err: AWSError, data: DataZone.Types.GetGlossaryOutput) => void): Request<DataZone.Types.GetGlossaryOutput, AWSError>;
  /**
   * Gets a business glossary term in Amazon DataZone.
   */
  getGlossaryTerm(params: DataZone.Types.GetGlossaryTermInput, callback?: (err: AWSError, data: DataZone.Types.GetGlossaryTermOutput) => void): Request<DataZone.Types.GetGlossaryTermOutput, AWSError>;
  /**
   * Gets a business glossary term in Amazon DataZone.
   */
  getGlossaryTerm(callback?: (err: AWSError, data: DataZone.Types.GetGlossaryTermOutput) => void): Request<DataZone.Types.GetGlossaryTermOutput, AWSError>;
  /**
   * Gets a group profile in Amazon DataZone.
   */
  getGroupProfile(params: DataZone.Types.GetGroupProfileInput, callback?: (err: AWSError, data: DataZone.Types.GetGroupProfileOutput) => void): Request<DataZone.Types.GetGroupProfileOutput, AWSError>;
  /**
   * Gets a group profile in Amazon DataZone.
   */
  getGroupProfile(callback?: (err: AWSError, data: DataZone.Types.GetGroupProfileOutput) => void): Request<DataZone.Types.GetGroupProfileOutput, AWSError>;
  /**
   * Gets the data portal URL for the specified Amazon DataZone domain.
   */
  getIamPortalLoginUrl(params: DataZone.Types.GetIamPortalLoginUrlInput, callback?: (err: AWSError, data: DataZone.Types.GetIamPortalLoginUrlOutput) => void): Request<DataZone.Types.GetIamPortalLoginUrlOutput, AWSError>;
  /**
   * Gets the data portal URL for the specified Amazon DataZone domain.
   */
  getIamPortalLoginUrl(callback?: (err: AWSError, data: DataZone.Types.GetIamPortalLoginUrlOutput) => void): Request<DataZone.Types.GetIamPortalLoginUrlOutput, AWSError>;
  /**
   * 
   */
  getListing(params: DataZone.Types.GetListingInput, callback?: (err: AWSError, data: DataZone.Types.GetListingOutput) => void): Request<DataZone.Types.GetListingOutput, AWSError>;
  /**
   * 
   */
  getListing(callback?: (err: AWSError, data: DataZone.Types.GetListingOutput) => void): Request<DataZone.Types.GetListingOutput, AWSError>;
  /**
   * Gets a project in Amazon DataZone.
   */
  getProject(params: DataZone.Types.GetProjectInput, callback?: (err: AWSError, data: DataZone.Types.GetProjectOutput) => void): Request<DataZone.Types.GetProjectOutput, AWSError>;
  /**
   * Gets a project in Amazon DataZone.
   */
  getProject(callback?: (err: AWSError, data: DataZone.Types.GetProjectOutput) => void): Request<DataZone.Types.GetProjectOutput, AWSError>;
  /**
   * Gets a subscription in Amazon DataZone.
   */
  getSubscription(params: DataZone.Types.GetSubscriptionInput, callback?: (err: AWSError, data: DataZone.Types.GetSubscriptionOutput) => void): Request<DataZone.Types.GetSubscriptionOutput, AWSError>;
  /**
   * Gets a subscription in Amazon DataZone.
   */
  getSubscription(callback?: (err: AWSError, data: DataZone.Types.GetSubscriptionOutput) => void): Request<DataZone.Types.GetSubscriptionOutput, AWSError>;
  /**
   * Gets the subscription grant in Amazon DataZone.
   */
  getSubscriptionGrant(params: DataZone.Types.GetSubscriptionGrantInput, callback?: (err: AWSError, data: DataZone.Types.GetSubscriptionGrantOutput) => void): Request<DataZone.Types.GetSubscriptionGrantOutput, AWSError>;
  /**
   * Gets the subscription grant in Amazon DataZone.
   */
  getSubscriptionGrant(callback?: (err: AWSError, data: DataZone.Types.GetSubscriptionGrantOutput) => void): Request<DataZone.Types.GetSubscriptionGrantOutput, AWSError>;
  /**
   * Gets the details of the specified subscription request.
   */
  getSubscriptionRequestDetails(params: DataZone.Types.GetSubscriptionRequestDetailsInput, callback?: (err: AWSError, data: DataZone.Types.GetSubscriptionRequestDetailsOutput) => void): Request<DataZone.Types.GetSubscriptionRequestDetailsOutput, AWSError>;
  /**
   * Gets the details of the specified subscription request.
   */
  getSubscriptionRequestDetails(callback?: (err: AWSError, data: DataZone.Types.GetSubscriptionRequestDetailsOutput) => void): Request<DataZone.Types.GetSubscriptionRequestDetailsOutput, AWSError>;
  /**
   * Gets the subscription target in Amazon DataZone.
   */
  getSubscriptionTarget(params: DataZone.Types.GetSubscriptionTargetInput, callback?: (err: AWSError, data: DataZone.Types.GetSubscriptionTargetOutput) => void): Request<DataZone.Types.GetSubscriptionTargetOutput, AWSError>;
  /**
   * Gets the subscription target in Amazon DataZone.
   */
  getSubscriptionTarget(callback?: (err: AWSError, data: DataZone.Types.GetSubscriptionTargetOutput) => void): Request<DataZone.Types.GetSubscriptionTargetOutput, AWSError>;
  /**
   * Gets a user profile in Amazon DataZone.
   */
  getUserProfile(params: DataZone.Types.GetUserProfileInput, callback?: (err: AWSError, data: DataZone.Types.GetUserProfileOutput) => void): Request<DataZone.Types.GetUserProfileOutput, AWSError>;
  /**
   * Gets a user profile in Amazon DataZone.
   */
  getUserProfile(callback?: (err: AWSError, data: DataZone.Types.GetUserProfileOutput) => void): Request<DataZone.Types.GetUserProfileOutput, AWSError>;
  /**
   * Lists the revisions for the asset.
   */
  listAssetRevisions(params: DataZone.Types.ListAssetRevisionsInput, callback?: (err: AWSError, data: DataZone.Types.ListAssetRevisionsOutput) => void): Request<DataZone.Types.ListAssetRevisionsOutput, AWSError>;
  /**
   * Lists the revisions for the asset.
   */
  listAssetRevisions(callback?: (err: AWSError, data: DataZone.Types.ListAssetRevisionsOutput) => void): Request<DataZone.Types.ListAssetRevisionsOutput, AWSError>;
  /**
   * Lists data source run activities.
   */
  listDataSourceRunActivities(params: DataZone.Types.ListDataSourceRunActivitiesInput, callback?: (err: AWSError, data: DataZone.Types.ListDataSourceRunActivitiesOutput) => void): Request<DataZone.Types.ListDataSourceRunActivitiesOutput, AWSError>;
  /**
   * Lists data source run activities.
   */
  listDataSourceRunActivities(callback?: (err: AWSError, data: DataZone.Types.ListDataSourceRunActivitiesOutput) => void): Request<DataZone.Types.ListDataSourceRunActivitiesOutput, AWSError>;
  /**
   * Lists data source runs in Amazon DataZone.
   */
  listDataSourceRuns(params: DataZone.Types.ListDataSourceRunsInput, callback?: (err: AWSError, data: DataZone.Types.ListDataSourceRunsOutput) => void): Request<DataZone.Types.ListDataSourceRunsOutput, AWSError>;
  /**
   * Lists data source runs in Amazon DataZone.
   */
  listDataSourceRuns(callback?: (err: AWSError, data: DataZone.Types.ListDataSourceRunsOutput) => void): Request<DataZone.Types.ListDataSourceRunsOutput, AWSError>;
  /**
   * Lists data sources in Amazon DataZone.
   */
  listDataSources(params: DataZone.Types.ListDataSourcesInput, callback?: (err: AWSError, data: DataZone.Types.ListDataSourcesOutput) => void): Request<DataZone.Types.ListDataSourcesOutput, AWSError>;
  /**
   * Lists data sources in Amazon DataZone.
   */
  listDataSources(callback?: (err: AWSError, data: DataZone.Types.ListDataSourcesOutput) => void): Request<DataZone.Types.ListDataSourcesOutput, AWSError>;
  /**
   * Lists Amazon DataZone domains.
   */
  listDomains(params: DataZone.Types.ListDomainsInput, callback?: (err: AWSError, data: DataZone.Types.ListDomainsOutput) => void): Request<DataZone.Types.ListDomainsOutput, AWSError>;
  /**
   * Lists Amazon DataZone domains.
   */
  listDomains(callback?: (err: AWSError, data: DataZone.Types.ListDomainsOutput) => void): Request<DataZone.Types.ListDomainsOutput, AWSError>;
  /**
   * Lists blueprint configurations for a Amazon DataZone environment.
   */
  listEnvironmentBlueprintConfigurations(params: DataZone.Types.ListEnvironmentBlueprintConfigurationsInput, callback?: (err: AWSError, data: DataZone.Types.ListEnvironmentBlueprintConfigurationsOutput) => void): Request<DataZone.Types.ListEnvironmentBlueprintConfigurationsOutput, AWSError>;
  /**
   * Lists blueprint configurations for a Amazon DataZone environment.
   */
  listEnvironmentBlueprintConfigurations(callback?: (err: AWSError, data: DataZone.Types.ListEnvironmentBlueprintConfigurationsOutput) => void): Request<DataZone.Types.ListEnvironmentBlueprintConfigurationsOutput, AWSError>;
  /**
   * Lists blueprints in an Amazon DataZone environment.
   */
  listEnvironmentBlueprints(params: DataZone.Types.ListEnvironmentBlueprintsInput, callback?: (err: AWSError, data: DataZone.Types.ListEnvironmentBlueprintsOutput) => void): Request<DataZone.Types.ListEnvironmentBlueprintsOutput, AWSError>;
  /**
   * Lists blueprints in an Amazon DataZone environment.
   */
  listEnvironmentBlueprints(callback?: (err: AWSError, data: DataZone.Types.ListEnvironmentBlueprintsOutput) => void): Request<DataZone.Types.ListEnvironmentBlueprintsOutput, AWSError>;
  /**
   * Lists Amazon DataZone environment profiles.
   */
  listEnvironmentProfiles(params: DataZone.Types.ListEnvironmentProfilesInput, callback?: (err: AWSError, data: DataZone.Types.ListEnvironmentProfilesOutput) => void): Request<DataZone.Types.ListEnvironmentProfilesOutput, AWSError>;
  /**
   * Lists Amazon DataZone environment profiles.
   */
  listEnvironmentProfiles(callback?: (err: AWSError, data: DataZone.Types.ListEnvironmentProfilesOutput) => void): Request<DataZone.Types.ListEnvironmentProfilesOutput, AWSError>;
  /**
   * Lists Amazon DataZone environments.
   */
  listEnvironments(params: DataZone.Types.ListEnvironmentsInput, callback?: (err: AWSError, data: DataZone.Types.ListEnvironmentsOutput) => void): Request<DataZone.Types.ListEnvironmentsOutput, AWSError>;
  /**
   * Lists Amazon DataZone environments.
   */
  listEnvironments(callback?: (err: AWSError, data: DataZone.Types.ListEnvironmentsOutput) => void): Request<DataZone.Types.ListEnvironmentsOutput, AWSError>;
  /**
   * Lists all Amazon DataZone notifications.
   */
  listNotifications(params: DataZone.Types.ListNotificationsInput, callback?: (err: AWSError, data: DataZone.Types.ListNotificationsOutput) => void): Request<DataZone.Types.ListNotificationsOutput, AWSError>;
  /**
   * Lists all Amazon DataZone notifications.
   */
  listNotifications(callback?: (err: AWSError, data: DataZone.Types.ListNotificationsOutput) => void): Request<DataZone.Types.ListNotificationsOutput, AWSError>;
  /**
   * Lists all members of the specified project.
   */
  listProjectMemberships(params: DataZone.Types.ListProjectMembershipsInput, callback?: (err: AWSError, data: DataZone.Types.ListProjectMembershipsOutput) => void): Request<DataZone.Types.ListProjectMembershipsOutput, AWSError>;
  /**
   * Lists all members of the specified project.
   */
  listProjectMemberships(callback?: (err: AWSError, data: DataZone.Types.ListProjectMembershipsOutput) => void): Request<DataZone.Types.ListProjectMembershipsOutput, AWSError>;
  /**
   * Lists Amazon DataZone projects.
   */
  listProjects(params: DataZone.Types.ListProjectsInput, callback?: (err: AWSError, data: DataZone.Types.ListProjectsOutput) => void): Request<DataZone.Types.ListProjectsOutput, AWSError>;
  /**
   * Lists Amazon DataZone projects.
   */
  listProjects(callback?: (err: AWSError, data: DataZone.Types.ListProjectsOutput) => void): Request<DataZone.Types.ListProjectsOutput, AWSError>;
  /**
   * Lists subscription grants.
   */
  listSubscriptionGrants(params: DataZone.Types.ListSubscriptionGrantsInput, callback?: (err: AWSError, data: DataZone.Types.ListSubscriptionGrantsOutput) => void): Request<DataZone.Types.ListSubscriptionGrantsOutput, AWSError>;
  /**
   * Lists subscription grants.
   */
  listSubscriptionGrants(callback?: (err: AWSError, data: DataZone.Types.ListSubscriptionGrantsOutput) => void): Request<DataZone.Types.ListSubscriptionGrantsOutput, AWSError>;
  /**
   * Lists Amazon DataZone subscription requests.
   */
  listSubscriptionRequests(params: DataZone.Types.ListSubscriptionRequestsInput, callback?: (err: AWSError, data: DataZone.Types.ListSubscriptionRequestsOutput) => void): Request<DataZone.Types.ListSubscriptionRequestsOutput, AWSError>;
  /**
   * Lists Amazon DataZone subscription requests.
   */
  listSubscriptionRequests(callback?: (err: AWSError, data: DataZone.Types.ListSubscriptionRequestsOutput) => void): Request<DataZone.Types.ListSubscriptionRequestsOutput, AWSError>;
  /**
   * Lists subscription targets in Amazon DataZone.
   */
  listSubscriptionTargets(params: DataZone.Types.ListSubscriptionTargetsInput, callback?: (err: AWSError, data: DataZone.Types.ListSubscriptionTargetsOutput) => void): Request<DataZone.Types.ListSubscriptionTargetsOutput, AWSError>;
  /**
   * Lists subscription targets in Amazon DataZone.
   */
  listSubscriptionTargets(callback?: (err: AWSError, data: DataZone.Types.ListSubscriptionTargetsOutput) => void): Request<DataZone.Types.ListSubscriptionTargetsOutput, AWSError>;
  /**
   * Lists subscriptions in Amazon DataZone.
   */
  listSubscriptions(params: DataZone.Types.ListSubscriptionsInput, callback?: (err: AWSError, data: DataZone.Types.ListSubscriptionsOutput) => void): Request<DataZone.Types.ListSubscriptionsOutput, AWSError>;
  /**
   * Lists subscriptions in Amazon DataZone.
   */
  listSubscriptions(callback?: (err: AWSError, data: DataZone.Types.ListSubscriptionsOutput) => void): Request<DataZone.Types.ListSubscriptionsOutput, AWSError>;
  /**
   * Lists tags for the specified resource in Amazon DataZone.
   */
  listTagsForResource(params: DataZone.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: DataZone.Types.ListTagsForResourceResponse) => void): Request<DataZone.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags for the specified resource in Amazon DataZone.
   */
  listTagsForResource(callback?: (err: AWSError, data: DataZone.Types.ListTagsForResourceResponse) => void): Request<DataZone.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Writes the configuration for the specified environment blueprint in Amazon DataZone.
   */
  putEnvironmentBlueprintConfiguration(params: DataZone.Types.PutEnvironmentBlueprintConfigurationInput, callback?: (err: AWSError, data: DataZone.Types.PutEnvironmentBlueprintConfigurationOutput) => void): Request<DataZone.Types.PutEnvironmentBlueprintConfigurationOutput, AWSError>;
  /**
   * Writes the configuration for the specified environment blueprint in Amazon DataZone.
   */
  putEnvironmentBlueprintConfiguration(callback?: (err: AWSError, data: DataZone.Types.PutEnvironmentBlueprintConfigurationOutput) => void): Request<DataZone.Types.PutEnvironmentBlueprintConfigurationOutput, AWSError>;
  /**
   * Rejects automatically generated business-friendly metadata for your Amazon DataZone assets.
   */
  rejectPredictions(params: DataZone.Types.RejectPredictionsInput, callback?: (err: AWSError, data: DataZone.Types.RejectPredictionsOutput) => void): Request<DataZone.Types.RejectPredictionsOutput, AWSError>;
  /**
   * Rejects automatically generated business-friendly metadata for your Amazon DataZone assets.
   */
  rejectPredictions(callback?: (err: AWSError, data: DataZone.Types.RejectPredictionsOutput) => void): Request<DataZone.Types.RejectPredictionsOutput, AWSError>;
  /**
   * Rejects the specified subscription request.
   */
  rejectSubscriptionRequest(params: DataZone.Types.RejectSubscriptionRequestInput, callback?: (err: AWSError, data: DataZone.Types.RejectSubscriptionRequestOutput) => void): Request<DataZone.Types.RejectSubscriptionRequestOutput, AWSError>;
  /**
   * Rejects the specified subscription request.
   */
  rejectSubscriptionRequest(callback?: (err: AWSError, data: DataZone.Types.RejectSubscriptionRequestOutput) => void): Request<DataZone.Types.RejectSubscriptionRequestOutput, AWSError>;
  /**
   * Revokes a specified subscription in Amazon DataZone.
   */
  revokeSubscription(params: DataZone.Types.RevokeSubscriptionInput, callback?: (err: AWSError, data: DataZone.Types.RevokeSubscriptionOutput) => void): Request<DataZone.Types.RevokeSubscriptionOutput, AWSError>;
  /**
   * Revokes a specified subscription in Amazon DataZone.
   */
  revokeSubscription(callback?: (err: AWSError, data: DataZone.Types.RevokeSubscriptionOutput) => void): Request<DataZone.Types.RevokeSubscriptionOutput, AWSError>;
  /**
   * Searches for assets in Amazon DataZone.
   */
  search(params: DataZone.Types.SearchInput, callback?: (err: AWSError, data: DataZone.Types.SearchOutput) => void): Request<DataZone.Types.SearchOutput, AWSError>;
  /**
   * Searches for assets in Amazon DataZone.
   */
  search(callback?: (err: AWSError, data: DataZone.Types.SearchOutput) => void): Request<DataZone.Types.SearchOutput, AWSError>;
  /**
   * Searches group profiles in Amazon DataZone.
   */
  searchGroupProfiles(params: DataZone.Types.SearchGroupProfilesInput, callback?: (err: AWSError, data: DataZone.Types.SearchGroupProfilesOutput) => void): Request<DataZone.Types.SearchGroupProfilesOutput, AWSError>;
  /**
   * Searches group profiles in Amazon DataZone.
   */
  searchGroupProfiles(callback?: (err: AWSError, data: DataZone.Types.SearchGroupProfilesOutput) => void): Request<DataZone.Types.SearchGroupProfilesOutput, AWSError>;
  /**
   * Searches listings in Amazon DataZone.
   */
  searchListings(params: DataZone.Types.SearchListingsInput, callback?: (err: AWSError, data: DataZone.Types.SearchListingsOutput) => void): Request<DataZone.Types.SearchListingsOutput, AWSError>;
  /**
   * Searches listings in Amazon DataZone.
   */
  searchListings(callback?: (err: AWSError, data: DataZone.Types.SearchListingsOutput) => void): Request<DataZone.Types.SearchListingsOutput, AWSError>;
  /**
   * Searches for types in Amazon DataZone.
   */
  searchTypes(params: DataZone.Types.SearchTypesInput, callback?: (err: AWSError, data: DataZone.Types.SearchTypesOutput) => void): Request<DataZone.Types.SearchTypesOutput, AWSError>;
  /**
   * Searches for types in Amazon DataZone.
   */
  searchTypes(callback?: (err: AWSError, data: DataZone.Types.SearchTypesOutput) => void): Request<DataZone.Types.SearchTypesOutput, AWSError>;
  /**
   * Searches user profiles in Amazon DataZone.
   */
  searchUserProfiles(params: DataZone.Types.SearchUserProfilesInput, callback?: (err: AWSError, data: DataZone.Types.SearchUserProfilesOutput) => void): Request<DataZone.Types.SearchUserProfilesOutput, AWSError>;
  /**
   * Searches user profiles in Amazon DataZone.
   */
  searchUserProfiles(callback?: (err: AWSError, data: DataZone.Types.SearchUserProfilesOutput) => void): Request<DataZone.Types.SearchUserProfilesOutput, AWSError>;
  /**
   * Start the run of the specified data source in Amazon DataZone.
   */
  startDataSourceRun(params: DataZone.Types.StartDataSourceRunInput, callback?: (err: AWSError, data: DataZone.Types.StartDataSourceRunOutput) => void): Request<DataZone.Types.StartDataSourceRunOutput, AWSError>;
  /**
   * Start the run of the specified data source in Amazon DataZone.
   */
  startDataSourceRun(callback?: (err: AWSError, data: DataZone.Types.StartDataSourceRunOutput) => void): Request<DataZone.Types.StartDataSourceRunOutput, AWSError>;
  /**
   * Tags a resource in Amazon DataZone.
   */
  tagResource(params: DataZone.Types.TagResourceRequest, callback?: (err: AWSError, data: DataZone.Types.TagResourceResponse) => void): Request<DataZone.Types.TagResourceResponse, AWSError>;
  /**
   * Tags a resource in Amazon DataZone.
   */
  tagResource(callback?: (err: AWSError, data: DataZone.Types.TagResourceResponse) => void): Request<DataZone.Types.TagResourceResponse, AWSError>;
  /**
   * Untags a resource in Amazon DataZone.
   */
  untagResource(params: DataZone.Types.UntagResourceRequest, callback?: (err: AWSError, data: DataZone.Types.UntagResourceResponse) => void): Request<DataZone.Types.UntagResourceResponse, AWSError>;
  /**
   * Untags a resource in Amazon DataZone.
   */
  untagResource(callback?: (err: AWSError, data: DataZone.Types.UntagResourceResponse) => void): Request<DataZone.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified data source in Amazon DataZone.
   */
  updateDataSource(params: DataZone.Types.UpdateDataSourceInput, callback?: (err: AWSError, data: DataZone.Types.UpdateDataSourceOutput) => void): Request<DataZone.Types.UpdateDataSourceOutput, AWSError>;
  /**
   * Updates the specified data source in Amazon DataZone.
   */
  updateDataSource(callback?: (err: AWSError, data: DataZone.Types.UpdateDataSourceOutput) => void): Request<DataZone.Types.UpdateDataSourceOutput, AWSError>;
  /**
   * Updates a Amazon DataZone domain.
   */
  updateDomain(params: DataZone.Types.UpdateDomainInput, callback?: (err: AWSError, data: DataZone.Types.UpdateDomainOutput) => void): Request<DataZone.Types.UpdateDomainOutput, AWSError>;
  /**
   * Updates a Amazon DataZone domain.
   */
  updateDomain(callback?: (err: AWSError, data: DataZone.Types.UpdateDomainOutput) => void): Request<DataZone.Types.UpdateDomainOutput, AWSError>;
  /**
   * Updates the specified environment in Amazon DataZone.
   */
  updateEnvironment(params: DataZone.Types.UpdateEnvironmentInput, callback?: (err: AWSError, data: DataZone.Types.UpdateEnvironmentOutput) => void): Request<DataZone.Types.UpdateEnvironmentOutput, AWSError>;
  /**
   * Updates the specified environment in Amazon DataZone.
   */
  updateEnvironment(callback?: (err: AWSError, data: DataZone.Types.UpdateEnvironmentOutput) => void): Request<DataZone.Types.UpdateEnvironmentOutput, AWSError>;
  /**
   * Updates the specified environment profile in Amazon DataZone.
   */
  updateEnvironmentProfile(params: DataZone.Types.UpdateEnvironmentProfileInput, callback?: (err: AWSError, data: DataZone.Types.UpdateEnvironmentProfileOutput) => void): Request<DataZone.Types.UpdateEnvironmentProfileOutput, AWSError>;
  /**
   * Updates the specified environment profile in Amazon DataZone.
   */
  updateEnvironmentProfile(callback?: (err: AWSError, data: DataZone.Types.UpdateEnvironmentProfileOutput) => void): Request<DataZone.Types.UpdateEnvironmentProfileOutput, AWSError>;
  /**
   * Updates the business glossary in Amazon DataZone.
   */
  updateGlossary(params: DataZone.Types.UpdateGlossaryInput, callback?: (err: AWSError, data: DataZone.Types.UpdateGlossaryOutput) => void): Request<DataZone.Types.UpdateGlossaryOutput, AWSError>;
  /**
   * Updates the business glossary in Amazon DataZone.
   */
  updateGlossary(callback?: (err: AWSError, data: DataZone.Types.UpdateGlossaryOutput) => void): Request<DataZone.Types.UpdateGlossaryOutput, AWSError>;
  /**
   * Updates a business glossary term in Amazon DataZone.
   */
  updateGlossaryTerm(params: DataZone.Types.UpdateGlossaryTermInput, callback?: (err: AWSError, data: DataZone.Types.UpdateGlossaryTermOutput) => void): Request<DataZone.Types.UpdateGlossaryTermOutput, AWSError>;
  /**
   * Updates a business glossary term in Amazon DataZone.
   */
  updateGlossaryTerm(callback?: (err: AWSError, data: DataZone.Types.UpdateGlossaryTermOutput) => void): Request<DataZone.Types.UpdateGlossaryTermOutput, AWSError>;
  /**
   * Updates the specified group profile in Amazon DataZone.
   */
  updateGroupProfile(params: DataZone.Types.UpdateGroupProfileInput, callback?: (err: AWSError, data: DataZone.Types.UpdateGroupProfileOutput) => void): Request<DataZone.Types.UpdateGroupProfileOutput, AWSError>;
  /**
   * Updates the specified group profile in Amazon DataZone.
   */
  updateGroupProfile(callback?: (err: AWSError, data: DataZone.Types.UpdateGroupProfileOutput) => void): Request<DataZone.Types.UpdateGroupProfileOutput, AWSError>;
  /**
   * Updates the specified project in Amazon DataZone.
   */
  updateProject(params: DataZone.Types.UpdateProjectInput, callback?: (err: AWSError, data: DataZone.Types.UpdateProjectOutput) => void): Request<DataZone.Types.UpdateProjectOutput, AWSError>;
  /**
   * Updates the specified project in Amazon DataZone.
   */
  updateProject(callback?: (err: AWSError, data: DataZone.Types.UpdateProjectOutput) => void): Request<DataZone.Types.UpdateProjectOutput, AWSError>;
  /**
   * Updates the status of the specified subscription grant status in Amazon DataZone.
   */
  updateSubscriptionGrantStatus(params: DataZone.Types.UpdateSubscriptionGrantStatusInput, callback?: (err: AWSError, data: DataZone.Types.UpdateSubscriptionGrantStatusOutput) => void): Request<DataZone.Types.UpdateSubscriptionGrantStatusOutput, AWSError>;
  /**
   * Updates the status of the specified subscription grant status in Amazon DataZone.
   */
  updateSubscriptionGrantStatus(callback?: (err: AWSError, data: DataZone.Types.UpdateSubscriptionGrantStatusOutput) => void): Request<DataZone.Types.UpdateSubscriptionGrantStatusOutput, AWSError>;
  /**
   * Updates a specified subscription request in Amazon DataZone.
   */
  updateSubscriptionRequest(params: DataZone.Types.UpdateSubscriptionRequestInput, callback?: (err: AWSError, data: DataZone.Types.UpdateSubscriptionRequestOutput) => void): Request<DataZone.Types.UpdateSubscriptionRequestOutput, AWSError>;
  /**
   * Updates a specified subscription request in Amazon DataZone.
   */
  updateSubscriptionRequest(callback?: (err: AWSError, data: DataZone.Types.UpdateSubscriptionRequestOutput) => void): Request<DataZone.Types.UpdateSubscriptionRequestOutput, AWSError>;
  /**
   * Updates the specified subscription target in Amazon DataZone.
   */
  updateSubscriptionTarget(params: DataZone.Types.UpdateSubscriptionTargetInput, callback?: (err: AWSError, data: DataZone.Types.UpdateSubscriptionTargetOutput) => void): Request<DataZone.Types.UpdateSubscriptionTargetOutput, AWSError>;
  /**
   * Updates the specified subscription target in Amazon DataZone.
   */
  updateSubscriptionTarget(callback?: (err: AWSError, data: DataZone.Types.UpdateSubscriptionTargetOutput) => void): Request<DataZone.Types.UpdateSubscriptionTargetOutput, AWSError>;
  /**
   * Updates the specified user profile in Amazon DataZone.
   */
  updateUserProfile(params: DataZone.Types.UpdateUserProfileInput, callback?: (err: AWSError, data: DataZone.Types.UpdateUserProfileOutput) => void): Request<DataZone.Types.UpdateUserProfileOutput, AWSError>;
  /**
   * Updates the specified user profile in Amazon DataZone.
   */
  updateUserProfile(callback?: (err: AWSError, data: DataZone.Types.UpdateUserProfileOutput) => void): Request<DataZone.Types.UpdateUserProfileOutput, AWSError>;
}
declare namespace DataZone {
  export interface AcceptChoice {
    /**
     * Specifies the prediction (aka, the automatically generated piece of metadata) that can be accepted.
     */
    predictionChoice?: Integer;
    /**
     * Specifies the target (for example, a column name) where a prediction can be accepted.
     */
    predictionTarget?: String;
  }
  export type AcceptChoices = AcceptChoice[];
  export interface AcceptPredictionsInput {
    /**
     * 
     */
    acceptChoices?: AcceptChoices;
    /**
     * Specifies the rule (or the conditions) under which a prediction can be accepted.
     */
    acceptRule?: AcceptRule;
    /**
     * A unique, case-sensitive identifier to ensure idempotency of the request. This field is automatically populated if not provided.
     */
    clientToken?: ClientToken;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * 
     */
    identifier: AssetIdentifier;
    /**
     * 
     */
    revision?: Revision;
  }
  export interface AcceptPredictionsOutput {
    /**
     * 
     */
    assetId: AssetId;
    /**
     * 
     */
    domainId: DomainId;
    /**
     * 
     */
    revision: Revision;
  }
  export interface AcceptRule {
    /**
     * Specifies whether you want to accept the top prediction for all targets or none.
     */
    rule?: AcceptRuleBehavior;
    /**
     * The confidence score that specifies the condition at which a prediction can be accepted.
     */
    threshold?: Float;
  }
  export type AcceptRuleBehavior = "ALL"|"NONE"|string;
  export interface AcceptSubscriptionRequestInput {
    /**
     * A description that specifies the reason for accepting the specified subscription request.
     */
    decisionComment?: DecisionComment;
    /**
     * The Amazon DataZone domain where the specified subscription request is being accepted.
     */
    domainIdentifier: DomainId;
    /**
     * The unique identifier of the subscription request that is to be accepted.
     */
    identifier: SubscriptionRequestId;
  }
  export interface AcceptSubscriptionRequestOutput {
    /**
     * The timestamp that specifies when the subscription request was accepted.
     */
    createdAt: CreatedAt;
    /**
     * Specifies the Amazon DataZone user that accepted the specified subscription request.
     */
    createdBy: CreatedBy;
    /**
     * Specifies the reason for accepting the subscription request.
     */
    decisionComment?: DecisionComment;
    /**
     * The unique identifier of the Amazon DataZone domain where the specified subscription request was accepted.
     */
    domainId: DomainId;
    /**
     * The identifier of the subscription request.
     */
    id: SubscriptionRequestId;
    /**
     * Specifies the reason for requesting a subscription to the asset.
     */
    requestReason: RequestReason;
    /**
     * Specifes the ID of the Amazon DataZone user who reviewed the subscription request.
     */
    reviewerId?: String;
    /**
     * Specifies the status of the subscription request.
     */
    status: SubscriptionRequestStatus;
    /**
     * Specifies the asset for which the subscription request was created.
     */
    subscribedListings: AcceptSubscriptionRequestOutputSubscribedListingsList;
    /**
     * Specifies the Amazon DataZone users who are subscribed to the asset specified in the subscription request.
     */
    subscribedPrincipals: AcceptSubscriptionRequestOutputSubscribedPrincipalsList;
    /**
     * Specifies the timestamp when subscription request was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * Specifies the Amazon DataZone user who updated the subscription request.
     */
    updatedBy?: UpdatedBy;
  }
  export type AcceptSubscriptionRequestOutputSubscribedListingsList = SubscribedListing[];
  export type AcceptSubscriptionRequestOutputSubscribedPrincipalsList = SubscribedPrincipal[];
  export type ActionLink = string;
  export type ApplicableAssetTypes = TypeName[];
  export type AssetId = string;
  export type AssetIdentifier = string;
  export interface AssetItem {
    /**
     * The additional attributes of a Amazon DataZone inventory asset. 
     */
    additionalAttributes?: AssetItemAdditionalAttributes;
    /**
     * The timestamp of when the Amazon DataZone inventory asset was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the inventory asset.
     */
    createdBy?: CreatedBy;
    /**
     * The description of an Amazon DataZone inventory asset.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which the inventory asset exists.
     */
    domainId: DomainId;
    /**
     * The external identifier of the Amazon DataZone inventory asset.
     */
    externalIdentifier?: ExternalIdentifier;
    /**
     * The timestamp of when the first revision of the inventory asset was created.
     */
    firstRevisionCreatedAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the first revision of the inventory asset.
     */
    firstRevisionCreatedBy?: CreatedBy;
    /**
     * The glossary terms attached to the Amazon DataZone inventory asset.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * the identifier of the Amazon DataZone inventory asset.
     */
    identifier: AssetIdentifier;
    /**
     * The name of the Amazon DataZone inventory asset.
     */
    name: AssetName;
    /**
     * The identifier of the Amazon DataZone project that owns the inventory asset.
     */
    owningProjectId: ProjectId;
    /**
     * The identifier of the asset type of the specified Amazon DataZone inventory asset.
     */
    typeIdentifier: AssetTypeIdentifier;
    /**
     * The revision of the inventory asset type.
     */
    typeRevision: Revision;
  }
  export interface AssetItemAdditionalAttributes {
    /**
     * The forms included in the additional attributes of an inventory asset.
     */
    formsOutput?: FormOutputList;
    /**
     * The read-only forms included in the additional attributes of an inventory asset.
     */
    readOnlyFormsOutput?: FormOutputList;
  }
  export interface AssetListing {
    /**
     * The identifier of an asset published in an Amazon DataZone catalog. 
     */
    assetId?: AssetId;
    /**
     * The revision of an asset published in an Amazon DataZone catalog. 
     */
    assetRevision?: Revision;
    /**
     * The type of an asset published in an Amazon DataZone catalog. 
     */
    assetType?: TypeName;
    /**
     * The timestamp of when an asset published in an Amazon DataZone catalog was created. 
     */
    createdAt?: CreatedAt;
    /**
     * The metadata forms attached to an asset published in an Amazon DataZone catalog. 
     */
    forms?: Forms;
    /**
     * The glossary terms attached to an asset published in an Amazon DataZone catalog. 
     */
    glossaryTerms?: DetailedGlossaryTerms;
    /**
     * The identifier of the project where an asset published in an Amazon DataZone catalog exists. 
     */
    owningProjectId?: ProjectId;
  }
  export interface AssetListingDetails {
    /**
     * The identifier of an asset published in an Amazon DataZone catalog. 
     */
    listingId: ListingId;
    /**
     * The status of an asset published in an Amazon DataZone catalog. 
     */
    listingStatus: ListingStatus;
  }
  export interface AssetListingItem {
    /**
     * The additional attributes of an asset published in an Amazon DataZone catalog.
     */
    additionalAttributes?: AssetListingItemAdditionalAttributes;
    /**
     * The timestamp of when an asset published in an Amazon DataZone catalog was created.
     */
    createdAt?: CreatedAt;
    /**
     * The description of an asset published in an Amazon DataZone catalog.
     */
    description?: Description;
    /**
     * The identifier of the inventory asset.
     */
    entityId?: AssetId;
    /**
     * The revision of the inventory asset.
     */
    entityRevision?: Revision;
    /**
     * The type of the inventory asset.
     */
    entityType?: TypeName;
    /**
     * Glossary terms attached to the inventory asset.
     */
    glossaryTerms?: DetailedGlossaryTerms;
    /**
     * The Amazon DataZone user who created the listing.
     */
    listingCreatedBy?: CreatedBy;
    /**
     * The identifier of the listing (asset published in Amazon DataZone catalog).
     */
    listingId?: ListingId;
    /**
     * The revision of the listing (asset published in Amazon DataZone catalog).
     */
    listingRevision?: Revision;
    /**
     * The Amazon DataZone user who updated the listing.
     */
    listingUpdatedBy?: UpdatedBy;
    /**
     * The name of the inventory asset.
     */
    name?: AssetName;
    /**
     * The identifier of the project that owns the inventory asset.
     */
    owningProjectId?: ProjectId;
  }
  export interface AssetListingItemAdditionalAttributes {
    /**
     * The metadata forms that form additional attributes of the metadata asset.
     */
    forms?: Forms;
  }
  export type AssetName = string;
  export interface AssetRevision {
    /**
     * The timestamp of when an inventory asset revison was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the asset revision.
     */
    createdBy?: CreatedBy;
    /**
     * The Amazon DataZone user who created the inventory asset.
     */
    domainId?: DomainId;
    /**
     * The identifier of the inventory asset revision.
     */
    id?: AssetId;
    /**
     * The revision details of the inventory asset.
     */
    revision?: Revision;
  }
  export type AssetRevisions = AssetRevision[];
  export interface AssetTargetNameMap {
    /**
     * The identifier of the inventory asset.
     */
    assetId: AssetId;
    /**
     * The target name in the asset target name map.
     */
    targetName: String;
  }
  export type AssetTargetNames = AssetTargetNameMap[];
  export type AssetTypeIdentifier = string;
  export interface AssetTypeItem {
    /**
     * The timestamp of when the asset type was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the asset type.
     */
    createdBy?: CreatedBy;
    /**
     * The description of the asset type.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain where the asset type exists.
     */
    domainId: DomainId;
    /**
     * The forms included in the details of the asset type.
     */
    formsOutput: FormsOutputMap;
    /**
     * The name of the asset type.
     */
    name: TypeName;
    /**
     * The identifier of the Amazon DataZone domain where the asset type was originally created.
     */
    originDomainId?: DomainId;
    /**
     * The identifier of the Amazon DataZone project where the asset type exists.
     */
    originProjectId?: ProjectId;
    /**
     * The identifier of the Amazon DataZone project that owns the asset type.
     */
    owningProjectId: ProjectId;
    /**
     * The revision of the asset type.
     */
    revision: Revision;
    /**
     * The timestamp of when the asset type was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the asset type.
     */
    updatedBy?: UpdatedBy;
  }
  export type Attribute = string;
  export type AuthType = "IAM_IDC"|"DISABLED"|string;
  export type AuthorizedPrincipalIdentifier = string;
  export type AuthorizedPrincipalIdentifiers = AuthorizedPrincipalIdentifier[];
  export type AwsAccountId = string;
  export type AwsRegion = string;
  export type Boolean = boolean;
  export interface BusinessNameGenerationConfiguration {
    /**
     * Specifies whether the business name generation is enabled.
     */
    enabled?: Boolean;
  }
  export interface CancelSubscriptionInput {
    /**
     * The unique identifier of the Amazon DataZone domain where the subscription request is being cancelled.
     */
    domainIdentifier: DomainId;
    /**
     * The unique identifier of the subscription that is being cancelled.
     */
    identifier: SubscriptionId;
  }
  export interface CancelSubscriptionOutput {
    /**
     * The timestamp that specifies when the request to cancel the subscription was created.
     */
    createdAt: CreatedAt;
    /**
     * Specifies the Amazon DataZone user who is cancelling the subscription.
     */
    createdBy: CreatedBy;
    /**
     * The unique identifier of the Amazon DataZone domain where the subscription is being cancelled.
     */
    domainId: DomainId;
    /**
     * The identifier of the subscription.
     */
    id: SubscriptionId;
    /**
     * Specifies whether the permissions to the asset are retained after the subscription is cancelled.
     */
    retainPermissions?: Boolean;
    /**
     * The status of the request to cancel the subscription.
     */
    status: SubscriptionStatus;
    /**
     * The asset to which a subscription is being cancelled.
     */
    subscribedListing: SubscribedListing;
    /**
     * The Amazon DataZone user who is made a subscriber to the specified asset by the subscription that is being cancelled.
     */
    subscribedPrincipal: SubscribedPrincipal;
    /**
     * The unique ID of the subscripton request for the subscription that is being cancelled.
     */
    subscriptionRequestId?: SubscriptionRequestId;
    /**
     * The timestamp that specifies when the subscription was cancelled.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user that cancelled the subscription.
     */
    updatedBy?: UpdatedBy;
  }
  export type ChangeAction = "PUBLISH"|"UNPUBLISH"|string;
  export type ClientToken = string;
  export interface CloudFormationProperties {
    /**
     * The template URL of the cloud formation provisioning properties of the environment blueprint.
     */
    templateUrl: String;
  }
  export interface ConfigurableActionParameter {
    /**
     * The key of the configurable action parameter.
     */
    key?: String;
    /**
     * The value of the configurable action parameter.
     */
    value?: String;
  }
  export type ConfigurableActionParameterList = ConfigurableActionParameter[];
  export type ConfigurableActionTypeAuthorization = "IAM"|"HTTPS"|string;
  export interface ConfigurableEnvironmentAction {
    /**
     * The authentication type of a configurable action of a Amazon DataZone environment. 
     */
    auth?: ConfigurableActionTypeAuthorization;
    /**
     * The parameters of a configurable action in a Amazon DataZone environment.
     */
    parameters: ConfigurableActionParameterList;
    /**
     * The type of a configurable action in a Amazon DataZone environment.
     */
    type: String;
  }
  export interface CreateAssetInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * Asset description.
     */
    description?: Description;
    /**
     * Amazon DataZone domain where the asset is created.
     */
    domainIdentifier: DomainId;
    /**
     * 
     */
    externalIdentifier?: ExternalIdentifier;
    /**
     * Metadata forms attached to the asset.
     */
    formsInput?: FormInputList;
    /**
     * Glossary terms attached to the asset.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * Asset name.
     */
    name: AssetName;
    /**
     * The unique identifier of the project that owns this asset.
     */
    owningProjectIdentifier: ProjectId;
    /**
     * The configuration of the automatically generated business-friendly metadata for the asset.
     */
    predictionConfiguration?: PredictionConfiguration;
    /**
     * The unique identifier of this asset's type.
     */
    typeIdentifier: AssetTypeIdentifier;
    /**
     * The revision of this asset's type.
     */
    typeRevision?: Revision;
  }
  export interface CreateAssetOutput {
    /**
     * The timestamp of when the asset was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user that created this asset in the catalog.
     */
    createdBy?: CreatedBy;
    /**
     * The description of the created asset.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which the asset was created.
     */
    domainId: DomainId;
    /**
     * 
     */
    externalIdentifier?: ExternalIdentifier;
    /**
     * The timestamp of when the first revision of the asset took place.
     */
    firstRevisionCreatedAt?: CreatedAt;
    /**
     * The Amazon DataZone user that made the first revision of the asset.
     */
    firstRevisionCreatedBy?: CreatedBy;
    /**
     * The metadata forms that are attached to the created asset.
     */
    formsOutput: FormOutputList;
    /**
     * The glossary terms that are attached to the created asset.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The unique identifier of the created asset.
     */
    id: AssetId;
    /**
     * 
     */
    listing?: AssetListingDetails;
    /**
     * The name of the created asset.
     */
    name: AssetName;
    /**
     * The ID of the Amazon DataZone project that owns the created asset. 
     */
    owningProjectId: ProjectId;
    /**
     * The configuration of the automatically generated business-friendly metadata for the asset.
     */
    predictionConfiguration?: PredictionConfiguration;
    /**
     * The read-only metadata forms that are attached to the created asset.
     */
    readOnlyFormsOutput?: FormOutputList;
    /**
     * The revision of the asset.
     */
    revision: Revision;
    /**
     * The identifier of the created asset type.
     */
    typeIdentifier: AssetTypeIdentifier;
    /**
     * The revision type of the asset.
     */
    typeRevision: Revision;
  }
  export interface CreateAssetRevisionInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The revised description of the asset.
     */
    description?: Description;
    /**
     * The unique identifier of the domain where the asset is being revised.
     */
    domainIdentifier: DomainId;
    /**
     * The metadata forms to be attached to the asset as part of asset revision.
     */
    formsInput?: FormInputList;
    /**
     * The glossary terms to be attached to the asset as part of asset revision.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The identifier of the asset.
     */
    identifier: AssetIdentifier;
    /**
     * Te revised name of the asset.
     */
    name: AssetName;
    /**
     * The configuration of the automatically generated business-friendly metadata for the asset.
     */
    predictionConfiguration?: PredictionConfiguration;
    /**
     * The revision type of the asset.
     */
    typeRevision?: Revision;
  }
  export interface CreateAssetRevisionOutput {
    /**
     * The timestamp of when the asset revision occured.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who performed the asset revision.
     */
    createdBy?: CreatedBy;
    /**
     * The revised asset description.
     */
    description?: Description;
    /**
     * The unique identifier of the Amazon DataZone domain where the asset was revised.
     */
    domainId: DomainId;
    /**
     * 
     */
    externalIdentifier?: ExternalIdentifier;
    /**
     * The timestamp of when the first asset revision occured.
     */
    firstRevisionCreatedAt?: CreatedAt;
    /**
     * The Amazon DataZone user who performed the first asset revision.
     */
    firstRevisionCreatedBy?: CreatedBy;
    /**
     * The metadata forms that were attached to the asset as part of the asset revision.
     */
    formsOutput: FormOutputList;
    /**
     * The glossary terms that were attached to the asset as part of asset revision.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The unique identifier of the asset revision.
     */
    id: AssetId;
    /**
     * 
     */
    listing?: AssetListingDetails;
    /**
     * The revised name of the asset.
     */
    name: AssetName;
    /**
     * The unique identifier of the revised project that owns the asset.
     */
    owningProjectId: ProjectId;
    /**
     * The configuration of the automatically generated business-friendly metadata for the asset.
     */
    predictionConfiguration?: PredictionConfiguration;
    /**
     * The read-only metadata forms that were attached to the asset as part of the asset revision.
     */
    readOnlyFormsOutput?: FormOutputList;
    /**
     * The revision of the asset.
     */
    revision: Revision;
    /**
     * The identifier of the revision type.
     */
    typeIdentifier: AssetTypeIdentifier;
    /**
     * The revision type of the asset.
     */
    typeRevision: Revision;
  }
  export interface CreateAssetTypeInput {
    /**
     * The descripton of the custom asset type.
     */
    description?: Description;
    /**
     * The unique identifier of the Amazon DataZone domain where the custom asset type is being created.
     */
    domainIdentifier: DomainId;
    /**
     * The metadata forms that are to be attached to the custom asset type.
     */
    formsInput: FormsInputMap;
    /**
     * The name of the custom asset type.
     */
    name: TypeName;
    /**
     * The identifier of the Amazon DataZone project that is to own the custom asset type.
     */
    owningProjectIdentifier: ProjectId;
  }
  export interface CreateAssetTypeOutput {
    /**
     * The timestamp of when the asset type is to be created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who creates this custom asset type.
     */
    createdBy?: CreatedBy;
    /**
     * The description of the custom asset type.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which the asset type was created.
     */
    domainId: DomainId;
    /**
     * The metadata forms that are attached to the asset type.
     */
    formsOutput: FormsOutputMap;
    /**
     * The name of the asset type.
     */
    name: TypeName;
    /**
     * The ID of the Amazon DataZone domain where the asset type was originally created.
     */
    originDomainId?: DomainId;
    /**
     * The ID of the Amazon DataZone project where the asset type was originally created.
     */
    originProjectId?: ProjectId;
    /**
     * The ID of the Amazon DataZone project that currently owns this asset type.
     */
    owningProjectId?: ProjectId;
    /**
     * The revision of the custom asset type.
     */
    revision: Revision;
    /**
     * The timestamp of when the custom type was created.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user that created the custom asset type.
     */
    updatedBy?: UpdatedBy;
  }
  export interface CreateDataSourceInput {
    /**
     * The metadata forms that are to be attached to the assets that this data source works with.
     */
    assetFormsInput?: FormInputList;
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * Specifies the configuration of the data source. It can be set to either glueRunConfiguration or redshiftRunConfiguration.
     */
    configuration?: DataSourceConfigurationInput;
    /**
     * The description of the data source.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain where the data source is created.
     */
    domainIdentifier: DomainId;
    /**
     * Specifies whether the data source is enabled.
     */
    enableSetting?: EnableSetting;
    /**
     * The unique identifier of the Amazon DataZone environment to which the data source publishes assets. 
     */
    environmentIdentifier: String;
    /**
     * The name of the data source.
     */
    name: Name;
    /**
     * The identifier of the Amazon DataZone project in which you want to add this data source.
     */
    projectIdentifier: String;
    /**
     * Specifies whether the assets that this data source creates in the inventory are to be also automatically published to the catalog.
     */
    publishOnImport?: Boolean;
    /**
     * Specifies whether the business name generation is to be enabled for this data source.
     */
    recommendation?: RecommendationConfiguration;
    /**
     * The schedule of the data source runs.
     */
    schedule?: ScheduleConfiguration;
    /**
     * The type of the data source.
     */
    type: DataSourceType;
  }
  export interface CreateDataSourceOutput {
    /**
     * The metadata forms attached to the assets that this data source creates.
     */
    assetFormsOutput?: FormOutputList;
    /**
     * Specifies the configuration of the data source. It can be set to either glueRunConfiguration or redshiftRunConfiguration.
     */
    configuration?: DataSourceConfigurationOutput;
    /**
     * The timestamp of when the data source was created.
     */
    createdAt?: DateTime;
    /**
     * The description of the data source.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which the data source is created.
     */
    domainId: DomainId;
    /**
     * Specifies whether the data source is enabled.
     */
    enableSetting?: EnableSetting;
    /**
     * The unique identifier of the Amazon DataZone environment to which the data source publishes assets. 
     */
    environmentId: EnvironmentId;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    errorMessage?: DataSourceErrorMessage;
    /**
     * The unique identifier of the data source.
     */
    id: DataSourceId;
    /**
     * The timestamp that specifies when the data source was last run.
     */
    lastRunAt?: DateTime;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    lastRunErrorMessage?: DataSourceErrorMessage;
    /**
     * The status of the last run of this data source.
     */
    lastRunStatus?: DataSourceRunStatus;
    /**
     * The name of the data source.
     */
    name: Name;
    /**
     * The ID of the Amazon DataZone project to which the data source is added.
     */
    projectId: ProjectId;
    /**
     * Specifies whether the assets that this data source creates in the inventory are to be also automatically published to the catalog.
     */
    publishOnImport?: Boolean;
    /**
     * Specifies whether the business name generation is to be enabled for this data source.
     */
    recommendation?: RecommendationConfiguration;
    /**
     * The schedule of the data source runs.
     */
    schedule?: ScheduleConfiguration;
    /**
     * The status of the data source.
     */
    status?: DataSourceStatus;
    /**
     * The type of the data source.
     */
    type?: DataSourceType;
    /**
     * The timestamp of when the data source was updated.
     */
    updatedAt?: DateTime;
  }
  export interface CreateDomainInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The description of the Amazon DataZone domain.
     */
    description?: String;
    /**
     * The domain execution role that is created when an Amazon DataZone domain is created. The domain execution role is created in the Amazon Web Services account that houses the Amazon DataZone domain.
     */
    domainExecutionRole: RoleArn;
    /**
     * The identifier of the Amazon Web Services Key Management Service (KMS) key that is used to encrypt the Amazon DataZone domain, metadata, and reporting data. 
     */
    kmsKeyIdentifier?: KmsKeyArn;
    /**
     * The name of the Amazon DataZone domain.
     */
    name: String;
    /**
     * The single-sign on configuration of the Amazon DataZone domain.
     */
    singleSignOn?: SingleSignOn;
    /**
     * The tags specified for the Amazon DataZone domain.
     */
    tags?: Tags;
  }
  export interface CreateDomainOutput {
    /**
     * The ARN of the Amazon DataZone domain.
     */
    arn?: String;
    /**
     * The description of the Amazon DataZone domain.
     */
    description?: String;
    /**
     * The domain execution role that is created when an Amazon DataZone domain is created. The domain execution role is created in the Amazon Web Services account that houses the Amazon DataZone domain.
     */
    domainExecutionRole?: RoleArn;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    id: DomainId;
    /**
     * The identifier of the Amazon Web Services Key Management Service (KMS) key that is used to encrypt the Amazon DataZone domain, metadata, and reporting data. 
     */
    kmsKeyIdentifier?: KmsKeyArn;
    /**
     * The name of the Amazon DataZone domain.
     */
    name?: String;
    /**
     * The URL of the data portal for this Amazon DataZone domain.
     */
    portalUrl?: String;
    /**
     * The single-sign on configuration of the Amazon DataZone domain.
     */
    singleSignOn?: SingleSignOn;
    /**
     * The status of the Amazon DataZone domain.
     */
    status?: DomainStatus;
    /**
     * The tags specified for the Amazon DataZone domain.
     */
    tags?: Tags;
  }
  export interface CreateEnvironmentInput {
    /**
     * The description of the Amazon DataZone environment.
     */
    description?: String;
    /**
     * The identifier of the Amazon DataZone domain in which the environment is created.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the environment profile that is used to create this Amazon DataZone environment.
     */
    environmentProfileIdentifier: EnvironmentProfileId;
    /**
     * The glossary terms that can be used in this Amazon DataZone environment.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The name of the Amazon DataZone environment.
     */
    name: String;
    /**
     * The identifier of the Amazon DataZone project in which this environment is created.
     */
    projectIdentifier: ProjectId;
    /**
     * The user parameters of this Amazon DataZone environment.
     */
    userParameters?: EnvironmentParametersList;
  }
  export interface CreateEnvironmentOutput {
    /**
     * The Amazon Web Services account in which the Amazon DataZone environment is created.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services region in which the Amazon DataZone environment is created.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The timestamp of when the environment was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created this environment.
     */
    createdBy: String;
    /**
     * The deployment properties of this Amazon DataZone environment.
     */
    deploymentProperties?: DeploymentProperties;
    /**
     * The description of this Amazon DataZone environment.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which the environment is created.
     */
    domainId: DomainId;
    /**
     * The configurable actions of this Amazon DataZone environment.
     */
    environmentActions?: EnvironmentActionList;
    /**
     * The ID of the blueprint with which this Amazon DataZone environment was created.
     */
    environmentBlueprintId?: EnvironmentBlueprintId;
    /**
     * The ID of the environment profile with which this Amazon DataZone environment was created.
     */
    environmentProfileId: EnvironmentProfileId;
    /**
     * The glossary terms that can be used in this Amazon DataZone environment.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The ID of this Amazon DataZone environment.
     */
    id?: EnvironmentId;
    /**
     * The details of the last deployment of this Amazon DataZone environment.
     */
    lastDeployment?: Deployment;
    /**
     * The name of this environment.
     */
    name: EnvironmentName;
    /**
     * The ID of the Amazon DataZone project in which this environment is created.
     */
    projectId: ProjectId;
    /**
     * The provider of this Amazon DataZone environment.
     */
    provider: String;
    /**
     * The provisioned resources of this Amazon DataZone environment.
     */
    provisionedResources?: ResourceList;
    /**
     * The provisioning properties of this Amazon DataZone environment.
     */
    provisioningProperties?: ProvisioningProperties;
    /**
     * The status of this Amazon DataZone environment.
     */
    status?: EnvironmentStatus;
    /**
     * The timestamp of when this environment was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The user parameters of this Amazon DataZone environment.
     */
    userParameters?: CustomParameterList;
  }
  export interface CreateEnvironmentProfileInput {
    /**
     * The Amazon Web Services account in which the Amazon DataZone environment is created.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services region in which this environment profile is created.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The description of this Amazon DataZone environment profile.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which this environment profile is created.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the blueprint with which this environment profile is created.
     */
    environmentBlueprintIdentifier: EnvironmentBlueprintId;
    /**
     * The name of this Amazon DataZone environment profile.
     */
    name: EnvironmentProfileName;
    /**
     * The identifier of the project in which to create the environment profile.
     */
    projectIdentifier: ProjectId;
    /**
     * The user parameters of this Amazon DataZone environment profile.
     */
    userParameters?: EnvironmentParametersList;
  }
  export interface CreateEnvironmentProfileOutput {
    /**
     * The Amazon Web Services account ID in which this Amazon DataZone environment profile is created.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services region in which this Amazon DataZone environment profile is created.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The timestamp of when this environment profile was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created this environment profile.
     */
    createdBy: String;
    /**
     * The description of this Amazon DataZone environment profile.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which this environment profile is created.
     */
    domainId: DomainId;
    /**
     * The ID of the blueprint with which this environment profile is created.
     */
    environmentBlueprintId: EnvironmentBlueprintId;
    /**
     * The ID of this Amazon DataZone environment profile.
     */
    id: EnvironmentProfileId;
    /**
     * The name of this Amazon DataZone environment profile.
     */
    name: EnvironmentProfileName;
    /**
     * The ID of the Amazon DataZone project in which this environment profile is created.
     */
    projectId?: ProjectId;
    /**
     * The timestamp of when this environment profile was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The user parameters of this Amazon DataZone environment profile.
     */
    userParameters?: CustomParameterList;
  }
  export interface CreateFormTypeInput {
    /**
     * The description of this Amazon DataZone metadata form type.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which this metadata form type is created.
     */
    domainIdentifier: DomainId;
    /**
     * The model of this Amazon DataZone metadata form type.
     */
    model: Model;
    /**
     * The name of this Amazon DataZone metadata form type.
     */
    name: FormTypeName;
    /**
     * The ID of the Amazon DataZone project that owns this metadata form type.
     */
    owningProjectIdentifier: ProjectId;
    /**
     * The status of this Amazon DataZone metadata form type.
     */
    status?: FormTypeStatus;
  }
  export interface CreateFormTypeOutput {
    /**
     * The description of this Amazon DataZone metadata form type.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which this metadata form type is created.
     */
    domainId: DomainId;
    /**
     * The name of this Amazon DataZone metadata form type.
     */
    name: FormTypeName;
    /**
     * The ID of the Amazon DataZone domain in which this metadata form type was originally created.
     */
    originDomainId?: DomainId;
    /**
     * The ID of the project in which this Amazon DataZone metadata form type was originally created.
     */
    originProjectId?: ProjectId;
    /**
     * The ID of the project that owns this Amazon DataZone metadata form type.
     */
    owningProjectId?: ProjectId;
    /**
     * The revision of this Amazon DataZone metadata form type.
     */
    revision: Revision;
  }
  export interface CreateGlossaryInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The description of this business glossary.
     */
    description?: GlossaryDescription;
    /**
     * The ID of the Amazon DataZone domain in which this business glossary is created.
     */
    domainIdentifier: DomainId;
    /**
     * The name of this business glossary.
     */
    name: GlossaryName;
    /**
     * The ID of the project that currently owns business glossary.
     */
    owningProjectIdentifier: ProjectId;
    /**
     * The status of this business glossary.
     */
    status?: GlossaryStatus;
  }
  export interface CreateGlossaryOutput {
    /**
     * The description of this business glossary.
     */
    description?: GlossaryDescription;
    /**
     * The ID of the Amazon DataZone domain in which this business glossary is created.
     */
    domainId: DomainId;
    /**
     * The ID of this business glossary.
     */
    id: GlossaryId;
    /**
     * The name of this business glossary.
     */
    name: GlossaryName;
    /**
     * The ID of the project that currently owns this business glossary.
     */
    owningProjectId: ProjectId;
    /**
     * The status of this business glossary.
     */
    status?: GlossaryStatus;
  }
  export interface CreateGlossaryTermInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The ID of the Amazon DataZone domain in which this business glossary term is created.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the business glossary in which this term is created.
     */
    glossaryIdentifier: GlossaryTermId;
    /**
     * The long description of this business glossary term.
     */
    longDescription?: LongDescription;
    /**
     * The name of this business glossary term.
     */
    name: GlossaryTermName;
    /**
     * The short description of this business glossary term.
     */
    shortDescription?: ShortDescription;
    /**
     * The status of this business glossary term.
     */
    status?: GlossaryTermStatus;
    /**
     * The term relations of this business glossary term.
     */
    termRelations?: TermRelations;
  }
  export interface CreateGlossaryTermOutput {
    /**
     * The ID of the Amazon DataZone domain in which this business glossary term is created.
     */
    domainId: DomainId;
    /**
     * The ID of the business glossary in which this term is created.
     */
    glossaryId: GlossaryId;
    /**
     * The ID of this business glossary term.
     */
    id: GlossaryTermId;
    /**
     * The long description of this business glossary term.
     */
    longDescription?: LongDescription;
    /**
     * The name of this business glossary term.
     */
    name: GlossaryTermName;
    /**
     * The short description of this business glossary term.
     */
    shortDescription?: ShortDescription;
    /**
     * The status of this business glossary term.
     */
    status: GlossaryTermStatus;
    /**
     * The term relations of this business glossary term.
     */
    termRelations?: TermRelations;
  }
  export interface CreateGroupProfileInput {
    /**
     *  A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The identifier of the Amazon DataZone domain in which the group profile is created.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the group for which the group profile is created.
     */
    groupIdentifier: GroupIdentifier;
  }
  export interface CreateGroupProfileOutput {
    /**
     * The identifier of the Amazon DataZone domain in which the group profile is created.
     */
    domainId?: DomainId;
    /**
     * The name of the group for which group profile is created.
     */
    groupName?: GroupProfileName;
    /**
     * The identifier of the group profile.
     */
    id?: GroupProfileId;
    /**
     * The status of the group profile.
     */
    status?: GroupProfileStatus;
  }
  export interface CreateListingChangeSetInput {
    /**
     * 
     */
    action: ChangeAction;
    /**
     * 
     */
    clientToken?: ClientToken;
    /**
     * 
     */
    domainIdentifier: DomainId;
    /**
     * 
     */
    entityIdentifier: EntityId;
    /**
     * 
     */
    entityRevision?: Revision;
    /**
     * 
     */
    entityType: EntityType;
  }
  export interface CreateListingChangeSetOutput {
    /**
     * 
     */
    listingId: ListingId;
    /**
     * 
     */
    listingRevision: Revision;
    /**
     * 
     */
    status: ListingStatus;
  }
  export interface CreateProjectInput {
    /**
     * The description of the Amazon DataZone project.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which this project is created.
     */
    domainIdentifier: DomainId;
    /**
     * The glossary terms that can be used in this Amazon DataZone project.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The name of the Amazon DataZone project.
     */
    name: ProjectName;
  }
  export interface CreateProjectMembershipInput {
    /**
     * The designation of the project membership.
     */
    designation: UserDesignation;
    /**
     * The ID of the Amazon DataZone domain in which project membership is created.
     */
    domainIdentifier: DomainId;
    /**
     * The project member whose project membership was created.
     */
    member: Member;
    /**
     * The ID of the project for which this project membership was created.
     */
    projectIdentifier: ProjectId;
  }
  export interface CreateProjectMembershipOutput {
  }
  export interface CreateProjectOutput {
    /**
     * The timestamp of when the project was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the project.
     */
    createdBy: CreatedBy;
    /**
     * The description of the project.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which the project was created.
     */
    domainId: DomainId;
    /**
     * The glossary terms that can be used in the project.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The ID of the Amazon DataZone project.
     */
    id: ProjectId;
    /**
     * The timestamp of when the project was last updated.
     */
    lastUpdatedAt?: SyntheticTimestamp_date_time;
    /**
     * The name of the project.
     */
    name: ProjectName;
  }
  export interface CreateSubscriptionGrantInput {
    /**
     * The names of the assets for which the subscription grant is created.
     */
    assetTargetNames?: AssetTargetNames;
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The ID of the Amazon DataZone domain in which the subscription grant is created.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the environment in which the subscription grant is created.
     */
    environmentIdentifier: EnvironmentId;
    /**
     * The entity to which the subscription is to be granted.
     */
    grantedEntity: GrantedEntityInput;
    /**
     * The ID of the subscription target for which the subscription grant is created.
     */
    subscriptionTargetIdentifier: SubscriptionTargetId;
  }
  export interface CreateSubscriptionGrantOutput {
    /**
     * The assets for which the subscription grant is created.
     */
    assets?: SubscribedAssets;
    /**
     * A timestamp of when the subscription grant is created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription grant.
     */
    createdBy: CreatedBy;
    /**
     * The ID of the Amazon DataZone domain in which the subscription grant is created.
     */
    domainId: DomainId;
    /**
     * The entity to which the subscription is granted.
     */
    grantedEntity: GrantedEntity;
    /**
     * The ID of the subscription grant.
     */
    id: SubscriptionGrantId;
    /**
     * The status of the subscription grant.
     */
    status: SubscriptionGrantOverallStatus;
    /**
     * The identifier of the subscription grant.
     */
    subscriptionId?: SubscriptionId;
    /**
     * The ID of the subscription target for which the subscription grant is created.
     */
    subscriptionTargetId: SubscriptionTargetId;
    /**
     * A timestamp of when the subscription grant was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription grant.
     */
    updatedBy?: UpdatedBy;
  }
  export interface CreateSubscriptionRequestInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The ID of the Amazon DataZone domain in which the subscription request is created.
     */
    domainIdentifier: DomainId;
    /**
     * The reason for the subscription request.
     */
    requestReason: RequestReason;
    /**
     * 
     */
    subscribedListings: SubscribedListingInputs;
    /**
     * The Amazon DataZone principals for whom the subscription request is created.
     */
    subscribedPrincipals: SubscribedPrincipalInputs;
  }
  export interface CreateSubscriptionRequestOutput {
    /**
     * A timestamp of when the subscription request is created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription request.
     */
    createdBy: CreatedBy;
    /**
     * The decision comment of the subscription request.
     */
    decisionComment?: DecisionComment;
    /**
     * The ID of the Amazon DataZone domain in whcih the subscription request is created.
     */
    domainId: DomainId;
    /**
     * The ID of the subscription request.
     */
    id: SubscriptionRequestId;
    /**
     * The reason for the subscription request.
     */
    requestReason: RequestReason;
    /**
     * The ID of the reviewer of the subscription request.
     */
    reviewerId?: String;
    /**
     * The status of the subscription request.
     */
    status: SubscriptionRequestStatus;
    /**
     * 
     */
    subscribedListings: CreateSubscriptionRequestOutputSubscribedListingsList;
    /**
     * The subscribed principals of the subscription request.
     */
    subscribedPrincipals: CreateSubscriptionRequestOutputSubscribedPrincipalsList;
    /**
     * The timestamp of when the subscription request was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription request.
     */
    updatedBy?: UpdatedBy;
  }
  export type CreateSubscriptionRequestOutputSubscribedListingsList = SubscribedListing[];
  export type CreateSubscriptionRequestOutputSubscribedPrincipalsList = SubscribedPrincipal[];
  export interface CreateSubscriptionTargetInput {
    /**
     * The asset types that can be included in the subscription target.
     */
    applicableAssetTypes: ApplicableAssetTypes;
    /**
     * The authorized principals of the subscription target.
     */
    authorizedPrincipals: AuthorizedPrincipalIdentifiers;
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The ID of the Amazon DataZone domain in which subscription target is created.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the environment in which subscription target is created.
     */
    environmentIdentifier: EnvironmentId;
    /**
     * The manage access role that is used to create the subscription target.
     */
    manageAccessRole: String;
    /**
     * The name of the subscription target.
     */
    name: SubscriptionTargetName;
    /**
     * The provider of the subscription target.
     */
    provider?: String;
    /**
     * The configuration of the subscription target.
     */
    subscriptionTargetConfig: SubscriptionTargetForms;
    /**
     * The type of the subscription target.
     */
    type: String;
  }
  export interface CreateSubscriptionTargetOutput {
    /**
     * The asset types that can be included in the subscription target.
     */
    applicableAssetTypes: ApplicableAssetTypes;
    /**
     * The authorised principals of the subscription target.
     */
    authorizedPrincipals: AuthorizedPrincipalIdentifiers;
    /**
     * The timestamp of when the subscription target was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription target.
     */
    createdBy: CreatedBy;
    /**
     * The ID of the Amazon DataZone domain in which the subscription target was created.
     */
    domainId: DomainId;
    /**
     * The ID of the environment in which the subscription target was created.
     */
    environmentId: EnvironmentId;
    /**
     * The ID of the subscription target.
     */
    id: SubscriptionTargetId;
    /**
     * The manage access role with which the subscription target was created.
     */
    manageAccessRole: String;
    /**
     * The name of the subscription target.
     */
    name: SubscriptionTargetName;
    /**
     * ???
     */
    projectId: ProjectId;
    /**
     * The provider of the subscription target.
     */
    provider: String;
    /**
     * The configuration of the subscription target.
     */
    subscriptionTargetConfig: SubscriptionTargetForms;
    /**
     * The type of the subscription target.
     */
    type: String;
    /**
     * The timestamp of when the subscription target was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription target.
     */
    updatedBy?: UpdatedBy;
  }
  export interface CreateUserProfileInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The identifier of the Amazon DataZone domain in which a user profile is created.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the user for which the user profile is created.
     */
    userIdentifier: UserIdentifier;
    /**
     * The user type of the user for which the user profile is created.
     */
    userType?: UserType;
  }
  export interface CreateUserProfileOutput {
    details?: UserProfileDetails;
    /**
     * The identifier of the Amazon DataZone domain in which a user profile is created.
     */
    domainId?: DomainId;
    /**
     * The identifier of the user profile.
     */
    id?: UserProfileId;
    /**
     * The status of the user profile.
     */
    status?: UserProfileStatus;
    /**
     * The type of the user profile.
     */
    type?: UserProfileType;
  }
  export type CreatedAt = Date;
  export type CreatedBy = string;
  export type CronString = string;
  export interface CustomParameter {
    /**
     * The default value of the parameter.
     */
    defaultValue?: String;
    /**
     * The description of the parameter.
     */
    description?: Description;
    /**
     * The filed type of the parameter.
     */
    fieldType: String;
    /**
     * Specifies whether the parameter is editable.
     */
    isEditable?: Boolean;
    /**
     * Specifies whether the custom parameter is optional.
     */
    isOptional?: Boolean;
    /**
     * The key name of the parameter.
     */
    keyName: CustomParameterKeyNameString;
  }
  export type CustomParameterKeyNameString = string;
  export type CustomParameterList = CustomParameter[];
  export type DataAssetActivityStatus = "FAILED"|"PUBLISHING_FAILED"|"SUCCEEDED_CREATED"|"SUCCEEDED_UPDATED"|"SKIPPED_ALREADY_IMPORTED"|"SKIPPED_ARCHIVED"|"SKIPPED_NO_ACCESS"|"UNCHANGED"|string;
  export type DataProductDescription = string;
  export type DataProductId = string;
  export interface DataProductItem {
    /**
     * 
     */
    domainId?: DomainId;
    /**
     * 
     */
    itemId?: DataProductId;
  }
  export type DataProductItems = DataProductItem[];
  export type DataProductName = string;
  export interface DataProductSummary {
    /**
     * 
     */
    createdAt?: CreatedAt;
    /**
     * 
     */
    createdBy?: CreatedBy;
    /**
     * 
     */
    dataProductItems?: DataProductItems;
    /**
     * 
     */
    description?: DataProductDescription;
    /**
     * 
     */
    domainId: DomainId;
    /**
     * 
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * 
     */
    id: DataProductId;
    /**
     * 
     */
    name: DataProductName;
    /**
     * 
     */
    owningProjectId: ProjectId;
    /**
     * 
     */
    updatedAt?: UpdatedAt;
    /**
     * 
     */
    updatedBy?: UpdatedBy;
  }
  export interface DataSourceConfigurationInput {
    /**
     * The configuration of the Amazon Web Services Glue data source.
     */
    glueRunConfiguration?: GlueRunConfigurationInput;
    /**
     * The configuration of the Amazon Redshift data source.
     */
    redshiftRunConfiguration?: RedshiftRunConfigurationInput;
  }
  export interface DataSourceConfigurationOutput {
    /**
     * The configuration of the Amazon Web Services Glue data source.
     */
    glueRunConfiguration?: GlueRunConfigurationOutput;
    /**
     * The configuration of the Amazon Redshift data source.
     */
    redshiftRunConfiguration?: RedshiftRunConfigurationOutput;
  }
  export interface DataSourceErrorMessage {
    /**
     * The details of the error message that is returned if the operation cannot be successfully completed.
     */
    errorDetail?: String;
    /**
     * The type of the error message that is returned if the operation cannot be successfully completed.
     */
    errorType: DataSourceErrorType;
  }
  export type DataSourceErrorType = "ACCESS_DENIED_EXCEPTION"|"CONFLICT_EXCEPTION"|"INTERNAL_SERVER_EXCEPTION"|"RESOURCE_NOT_FOUND_EXCEPTION"|"SERVICE_QUOTA_EXCEEDED_EXCEPTION"|"THROTTLING_EXCEPTION"|"VALIDATION_EXCEPTION"|string;
  export type DataSourceId = string;
  export type DataSourceRunActivities = DataSourceRunActivity[];
  export interface DataSourceRunActivity {
    /**
     * The timestamp of when data source run activity was created.
     */
    createdAt: DateTime;
    /**
     * The identifier of the asset included in the data source run activity.
     */
    dataAssetId?: String;
    /**
     * The status of the asset included in the data source run activity.
     */
    dataAssetStatus: DataAssetActivityStatus;
    /**
     * The identifier of the data source for the data source run activity.
     */
    dataSourceRunId: DataSourceRunId;
    /**
     * The database included in the data source run activity.
     */
    database: Name;
    errorMessage?: DataSourceErrorMessage;
    /**
     * The project ID included in the data source run activity.
     */
    projectId: ProjectId;
    /**
     * The technical description included in the data source run activity.
     */
    technicalDescription?: Description;
    /**
     * The technical name included in the data source run activity.
     */
    technicalName: Name;
    /**
     * The timestamp of when data source run activity was updated.
     */
    updatedAt: DateTime;
  }
  export type DataSourceRunId = string;
  export type DataSourceRunStatus = "REQUESTED"|"RUNNING"|"FAILED"|"PARTIALLY_SUCCEEDED"|"SUCCESS"|string;
  export type DataSourceRunSummaries = DataSourceRunSummary[];
  export interface DataSourceRunSummary {
    /**
     * The timestamp of when a data source run was created.
     */
    createdAt: DateTime;
    /**
     * The identifier of the data source of the data source run.
     */
    dataSourceId: DataSourceId;
    errorMessage?: DataSourceErrorMessage;
    /**
     * The identifier of the data source run.
     */
    id: DataSourceRunId;
    /**
     * The project ID of the data source run.
     */
    projectId: ProjectId;
    runStatisticsForAssets?: RunStatisticsForAssets;
    /**
     * The timestamp of when a data source run was started.
     */
    startedAt?: DateTime;
    /**
     * The status of the data source run.
     */
    status: DataSourceRunStatus;
    /**
     * The timestamp of when a data source run was stopped.
     */
    stoppedAt?: DateTime;
    /**
     * The type of the data source run.
     */
    type: DataSourceRunType;
    /**
     * The timestamp of when a data source run was updated.
     */
    updatedAt: DateTime;
  }
  export type DataSourceRunType = "PRIORITIZED"|"SCHEDULED"|string;
  export type DataSourceStatus = "CREATING"|"FAILED_CREATION"|"READY"|"UPDATING"|"FAILED_UPDATE"|"RUNNING"|"DELETING"|"FAILED_DELETION"|string;
  export type DataSourceSummaries = DataSourceSummary[];
  export interface DataSourceSummary {
    /**
     * The timestamp of when the data source was created.
     */
    createdAt?: DateTime;
    /**
     * The ID of the data source.
     */
    dataSourceId: DataSourceId;
    /**
     * The ID of the Amazon DataZone domain in which the data source exists.
     */
    domainId: DomainId;
    /**
     * Specifies whether the data source is enabled.
     */
    enableSetting?: EnableSetting;
    /**
     * The ID of the environment in which the data source exists.
     */
    environmentId: EnvironmentId;
    /**
     * The count of the assets created during the last data source run.
     */
    lastRunAssetCount?: Integer;
    /**
     * The timestamp of when the data source run was last performed.
     */
    lastRunAt?: DateTime;
    lastRunErrorMessage?: DataSourceErrorMessage;
    /**
     * The status of the last data source run.
     */
    lastRunStatus?: DataSourceRunStatus;
    /**
     * The name of the data source.
     */
    name: Name;
    schedule?: ScheduleConfiguration;
    /**
     * The status of the data source.
     */
    status: DataSourceStatus;
    /**
     * The type of the data source.
     */
    type: String;
    /**
     * The timestamp of when the data source was updated.
     */
    updatedAt?: DateTime;
  }
  export type DataSourceType = string;
  export type DateTime = Date;
  export type DecisionComment = string;
  export interface DeleteAssetInput {
    /**
     * The ID of the Amazon DataZone domain in which the asset is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the asset that is deleted.
     */
    identifier: AssetIdentifier;
  }
  export interface DeleteAssetOutput {
  }
  export interface DeleteAssetTypeInput {
    /**
     * The ID of the Amazon DataZone domain in which the asset type is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the asset type that is deleted.
     */
    identifier: AssetTypeIdentifier;
  }
  export interface DeleteAssetTypeOutput {
  }
  export interface DeleteDataSourceInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The ID of the Amazon DataZone domain in which the data source is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the data source that is deleted.
     */
    identifier: DataSourceId;
  }
  export interface DeleteDataSourceOutput {
    /**
     * The asset data forms associated with this data source.
     */
    assetFormsOutput?: FormOutputList;
    /**
     * The configuration of the data source that is deleted.
     */
    configuration?: DataSourceConfigurationOutput;
    /**
     * The timestamp of when this data source was created.
     */
    createdAt?: DateTime;
    /**
     * The description of the data source that is deleted.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which the data source is deleted.
     */
    domainId: DomainId;
    /**
     * The enable setting of the data source that specifies whether the data source is enabled or disabled.
     */
    enableSetting?: EnableSetting;
    /**
     * The ID of the environemnt associated with this data source.
     */
    environmentId: EnvironmentId;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    errorMessage?: DataSourceErrorMessage;
    /**
     * The ID of the data source that is deleted.
     */
    id: DataSourceId;
    /**
     * The timestamp of when the data source was last run.
     */
    lastRunAt?: DateTime;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    lastRunErrorMessage?: DataSourceErrorMessage;
    /**
     * The status of the last run of this data source.
     */
    lastRunStatus?: DataSourceRunStatus;
    /**
     * The name of the data source that is deleted.
     */
    name: Name;
    /**
     * The ID of the project in which this data source exists and from which it's deleted.
     */
    projectId: ProjectId;
    /**
     * Specifies whether the assets that this data source creates in the inventory are to be also automatically published to the catalog.
     */
    publishOnImport?: Boolean;
    /**
     * The schedule of runs for this data source.
     */
    schedule?: ScheduleConfiguration;
    /**
     * The status of this data source.
     */
    status?: DataSourceStatus;
    /**
     * The type of this data source.
     */
    type?: DataSourceType;
    /**
     * The timestamp of when this data source was updated.
     */
    updatedAt?: DateTime;
  }
  export interface DeleteDomainInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The identifier of the Amazon Web Services domain that is to be deleted.
     */
    identifier: DomainId;
  }
  export interface DeleteDomainOutput {
    /**
     * The status of the domain.
     */
    status: DomainStatus;
  }
  export interface DeleteEnvironmentBlueprintConfigurationInput {
    /**
     * The ID of the Amazon DataZone domain in which the blueprint configuration is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the blueprint the configuration of which is deleted.
     */
    environmentBlueprintIdentifier: EnvironmentBlueprintId;
  }
  export interface DeleteEnvironmentBlueprintConfigurationOutput {
  }
  export interface DeleteEnvironmentInput {
    /**
     * The ID of the Amazon DataZone domain in which the environment is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the environment that is to be deleted.
     */
    identifier: EnvironmentId;
  }
  export interface DeleteEnvironmentProfileInput {
    /**
     * The ID of the Amazon DataZone domain in which the environment profile is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the environment profile that is deleted.
     */
    identifier: EnvironmentProfileId;
  }
  export interface DeleteFormTypeInput {
    /**
     * The ID of the Amazon DataZone domain in which the metadata form type is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the metadata form type that is deleted.
     */
    formTypeIdentifier: FormTypeIdentifier;
  }
  export interface DeleteFormTypeOutput {
  }
  export interface DeleteGlossaryInput {
    /**
     * The ID of the Amazon DataZone domain in which the business glossary is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the business glossary that is deleted.
     */
    identifier: GlossaryId;
  }
  export interface DeleteGlossaryOutput {
  }
  export interface DeleteGlossaryTermInput {
    /**
     * The ID of the Amazon DataZone domain in which the business glossary term is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the business glossary term that is deleted.
     */
    identifier: GlossaryTermId;
  }
  export interface DeleteGlossaryTermOutput {
  }
  export interface DeleteListingInput {
    /**
     * 
     */
    domainIdentifier: DomainId;
    /**
     * 
     */
    identifier: ListingId;
  }
  export interface DeleteListingOutput {
  }
  export interface DeleteProjectInput {
    /**
     * The ID of the Amazon DataZone domain in which the project is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the project that is to be deleted.
     */
    identifier: ProjectId;
  }
  export interface DeleteProjectMembershipInput {
    /**
     * The ID of the Amazon DataZone domain where project membership is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The project member whose project membership is deleted.
     */
    member: Member;
    /**
     * The ID of the Amazon DataZone project the membership to which is deleted.
     */
    projectIdentifier: ProjectId;
  }
  export interface DeleteProjectMembershipOutput {
  }
  export interface DeleteProjectOutput {
  }
  export interface DeleteSubscriptionGrantInput {
    /**
     * The ID of the Amazon DataZone domain where the subscription grant is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the subscription grant that is deleted.
     */
    identifier: SubscriptionGrantId;
  }
  export interface DeleteSubscriptionGrantOutput {
    /**
     * The assets for which the subsctiption grant that is deleted gave access.
     */
    assets?: SubscribedAssets;
    /**
     * The timestamp of when the subscription grant that is deleted was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription grant that is deleted.
     */
    createdBy: CreatedBy;
    /**
     * The ID of the Amazon DataZone domain in which the subscription grant is deleted.
     */
    domainId: DomainId;
    /**
     * The entity to which the subscription is deleted.
     */
    grantedEntity: GrantedEntity;
    /**
     * The ID of the subscription grant that is deleted.
     */
    id: SubscriptionGrantId;
    /**
     * The status of the subscription grant that is deleted.
     */
    status: SubscriptionGrantOverallStatus;
    /**
     * The identifier of the subsctiption whose subscription grant is to be deleted.
     */
    subscriptionId?: SubscriptionId;
    /**
     * The ID of the subscription target associated with the subscription grant that is deleted.
     */
    subscriptionTargetId: SubscriptionTargetId;
    /**
     * The timestamp of when the subscription grant that is deleted was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription grant that is deleted.
     */
    updatedBy?: UpdatedBy;
  }
  export interface DeleteSubscriptionRequestInput {
    /**
     * The ID of the Amazon DataZone domain in which the subscription request is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the subscription request that is deleted.
     */
    identifier: SubscriptionRequestId;
  }
  export interface DeleteSubscriptionTargetInput {
    /**
     * The ID of the Amazon DataZone domain in which the subscription target is deleted.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the Amazon DataZone environment in which the subscription target is deleted.
     */
    environmentIdentifier: EnvironmentId;
    /**
     * The ID of the subscription target that is deleted.
     */
    identifier: SubscriptionTargetId;
  }
  export interface Deployment {
    /**
     * The identifier of the last deployment of the environment.
     */
    deploymentId?: String;
    /**
     * The status of the last deployment of the environment.
     */
    deploymentStatus?: DeploymentStatus;
    /**
     * The type of the last deployment of the environment.
     */
    deploymentType?: DeploymentType;
    /**
     * The failure reason of the last deployment of the environment.
     */
    failureReason?: EnvironmentError;
    /**
     * Specifies whether the last deployment of the environment is complete.
     */
    isDeploymentComplete?: Boolean;
    /**
     * The messages of the last deployment of the environment.
     */
    messages?: DeploymentMessagesList;
  }
  export type DeploymentMessage = string;
  export type DeploymentMessagesList = DeploymentMessage[];
  export interface DeploymentProperties {
    /**
     * The end timeout of the environment blueprint deployment.
     */
    endTimeoutMinutes?: DeploymentPropertiesEndTimeoutMinutesInteger;
    /**
     * The start timeout of the environment blueprint deployment.
     */
    startTimeoutMinutes?: DeploymentPropertiesStartTimeoutMinutesInteger;
  }
  export type DeploymentPropertiesEndTimeoutMinutesInteger = number;
  export type DeploymentPropertiesStartTimeoutMinutesInteger = number;
  export type DeploymentStatus = "IN_PROGRESS"|"SUCCESSFUL"|"FAILED"|"PENDING_DEPLOYMENT"|string;
  export type DeploymentType = "CREATE"|"UPDATE"|"DELETE"|string;
  export type Description = string;
  export interface DetailedGlossaryTerm {
    /**
     * The name of a glossary term attached to the inventory asset.
     */
    name?: GlossaryTermName;
    /**
     * The shoft description of a glossary term attached to the inventory asset.
     */
    shortDescription?: ShortDescription;
  }
  export type DetailedGlossaryTerms = DetailedGlossaryTerm[];
  export type DomainDescription = string;
  export type DomainId = string;
  export type DomainName = string;
  export type DomainStatus = "CREATING"|"AVAILABLE"|"CREATION_FAILED"|"DELETING"|"DELETED"|"DELETION_FAILED"|string;
  export type DomainSummaries = DomainSummary[];
  export interface DomainSummary {
    /**
     * The ARN of the Amazon DataZone domain.
     */
    arn: String;
    /**
     * A timestamp of when a Amazon DataZone domain was created.
     */
    createdAt: CreatedAt;
    /**
     * A description of an Amazon DataZone domain.
     */
    description?: DomainDescription;
    /**
     * The ID of the Amazon DataZone domain.
     */
    id: DomainId;
    /**
     * A timestamp of when a Amazon DataZone domain was last updated.
     */
    lastUpdatedAt?: UpdatedAt;
    /**
     * The identifier of the Amazon Web Services account that manages the domain.
     */
    managedAccountId: String;
    /**
     * A name of an Amazon DataZone domain.
     */
    name: DomainName;
    /**
     * The data portal URL for the Amazon DataZone domain.
     */
    portalUrl?: String;
    /**
     * The status of the Amazon DataZone domain.
     */
    status: DomainStatus;
  }
  export type EnableSetting = "ENABLED"|"DISABLED"|string;
  export type EnabledRegionList = RegionName[];
  export type EntityId = string;
  export type EntityType = "ASSET"|string;
  export type EnvironmentActionList = ConfigurableEnvironmentAction[];
  export interface EnvironmentBlueprintConfigurationItem {
    /**
     * The timestamp of when an environment blueprint was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The identifier of the Amazon DataZone domain in which an environment blueprint exists.
     */
    domainId: DomainId;
    /**
     * The enabled Amazon Web Services Regions specified in a blueprint configuration.
     */
    enabledRegions?: EnabledRegionList;
    /**
     * The identifier of the environment blueprint.
     */
    environmentBlueprintId: EnvironmentBlueprintId;
    /**
     * The ARN of the manage access role specified in the environment blueprint configuration.
     */
    manageAccessRoleArn?: RoleArn;
    /**
     * The ARN of the provisioning role specified in the environment blueprint configuration.
     */
    provisioningRoleArn?: RoleArn;
    /**
     * The regional parameters of the environment blueprint.
     */
    regionalParameters?: RegionalParameterMap;
    /**
     * The timestamp of when the environment blueprint was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export type EnvironmentBlueprintConfigurations = EnvironmentBlueprintConfigurationItem[];
  export type EnvironmentBlueprintId = string;
  export type EnvironmentBlueprintName = string;
  export type EnvironmentBlueprintSummaries = EnvironmentBlueprintSummary[];
  export interface EnvironmentBlueprintSummary {
    /**
     * The timestamp of when an environment blueprint was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The description of a blueprint.
     */
    description?: Description;
    /**
     * The identifier of the blueprint.
     */
    id: EnvironmentBlueprintId;
    /**
     * The name of the blueprint.
     */
    name: EnvironmentBlueprintName;
    /**
     * The provider of the blueprint.
     */
    provider: String;
    /**
     * The provisioning properties of the blueprint.
     */
    provisioningProperties: ProvisioningProperties;
    /**
     * The timestamp of when the blueprint was enabled.
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export interface EnvironmentError {
    /**
     * The error code for the failure reason for the environment deployment.
     */
    code?: String;
    /**
     * The error message for the failure reason for the environment deployment.
     */
    message: String;
  }
  export type EnvironmentId = string;
  export type EnvironmentName = string;
  export interface EnvironmentParameter {
    /**
     * The name of an environment profile parameter.
     */
    name?: String;
    /**
     * The value of an environment profile parameter.
     */
    value?: String;
  }
  export type EnvironmentParametersList = EnvironmentParameter[];
  export type EnvironmentProfileId = string;
  export type EnvironmentProfileName = string;
  export type EnvironmentProfileSummaries = EnvironmentProfileSummary[];
  export interface EnvironmentProfileSummary {
    /**
     * The identifier of an Amazon Web Services account in which an environment profile exists.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services Region in which an environment profile exists.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The timestamp of when an environment profile was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the environment profile.
     */
    createdBy: String;
    /**
     * The description of the environment profile.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which the environment profile exists.
     */
    domainId: DomainId;
    /**
     * The identifier of a blueprint with which an environment profile is created.
     */
    environmentBlueprintId: EnvironmentBlueprintId;
    /**
     * The identifier of the environment profile.
     */
    id: EnvironmentProfileId;
    /**
     * The name of the environment profile.
     */
    name: EnvironmentProfileName;
    /**
     * The identifier of a project in which an environment profile exists.
     */
    projectId?: ProjectId;
    /**
     * The timestamp of when the environment profile was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export type EnvironmentStatus = "ACTIVE"|"CREATING"|"UPDATING"|"DELETING"|"CREATE_FAILED"|"UPDATE_FAILED"|"DELETE_FAILED"|"VALIDATION_FAILED"|"SUSPENDED"|"DISABLED"|"EXPIRED"|"DELETED"|"INACCESSIBLE"|string;
  export type EnvironmentSummaries = EnvironmentSummary[];
  export interface EnvironmentSummary {
    /**
     * The identifier of the Amazon Web Services account in which an environment exists.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services Region in which an environment exists.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The timestamp of when the environment was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the environment.
     */
    createdBy: String;
    /**
     * The description of the environment.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which the environment exists.
     */
    domainId: DomainId;
    /**
     * The identifier of the environment profile with which the environment was created.
     */
    environmentProfileId: EnvironmentProfileId;
    /**
     * The identifier of the environment.
     */
    id?: EnvironmentId;
    /**
     * The name of the environment.
     */
    name: EnvironmentName;
    /**
     * The identifier of the project in which the environment exists.
     */
    projectId: ProjectId;
    /**
     * The provider of the environment.
     */
    provider: String;
    /**
     * The status of the environment.
     */
    status?: EnvironmentStatus;
    /**
     * The timestamp of when the environment was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export type ExternalIdentifier = string;
  export interface FailureCause {
    /**
     * The description of the error message.
     */
    message?: String;
  }
  export interface Filter {
    /**
     * A search filter attribute in Amazon DataZone.
     */
    attribute: Attribute;
    /**
     * A search filter value in Amazon DataZone.
     */
    value: FilterValueString;
  }
  export interface FilterClause {
    /**
     * The 'and' search filter clause in Amazon DataZone.
     */
    and?: FilterList;
    /**
     * A search filter in Amazon DataZone.
     */
    filter?: Filter;
    /**
     * The 'or' search filter clause in Amazon DataZone.
     */
    or?: FilterList;
  }
  export interface FilterExpression {
    /**
     * The search filter expression.
     */
    expression: FilterExpressionExpressionString;
    /**
     * The search filter explresison type.
     */
    type: FilterExpressionType;
  }
  export type FilterExpressionExpressionString = string;
  export type FilterExpressionType = "INCLUDE"|"EXCLUDE"|string;
  export type FilterExpressions = FilterExpression[];
  export type FilterList = FilterClause[];
  export type FilterValueString = string;
  export type FirstName = string;
  export type Float = number;
  export interface FormEntryInput {
    /**
     * Specifies whether a form entry is required.
     */
    required?: Boolean;
    /**
     * The type ID of the form entry.
     */
    typeIdentifier: FormTypeIdentifier;
    /**
     * The type revision of the form entry.
     */
    typeRevision: Revision;
  }
  export interface FormEntryOutput {
    /**
     * Specifies whether a form entry is required.
     */
    required?: Boolean;
    /**
     * The name of the type of the form entry.
     */
    typeName: FormTypeName;
    /**
     * The type revision of the form entry.
     */
    typeRevision: Revision;
  }
  export interface FormInput {
    /**
     * The content of the metadata form.
     */
    content?: FormInputContentString;
    /**
     * The name of the metadata form.
     */
    formName: FormName;
    /**
     * The ID of the metadata form type.
     */
    typeIdentifier?: FormTypeIdentifier;
    /**
     * The revision of the metadata form type.
     */
    typeRevision?: Revision;
  }
  export type FormInputContentString = string;
  export type FormInputList = FormInput[];
  export type FormName = string;
  export interface FormOutput {
    /**
     * The content of the metadata form.
     */
    content?: String;
    /**
     * The name of the metadata form.
     */
    formName: FormName;
    /**
     * The name of the metadata form type.
     */
    typeName?: FormTypeName;
    /**
     * The revision of the metadata form type.
     */
    typeRevision?: Revision;
  }
  export type FormOutputList = FormOutput[];
  export interface FormTypeData {
    /**
     * The timestamp of when the metadata form type was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created teh metadata form type.
     */
    createdBy?: CreatedBy;
    /**
     * The description of the metadata form type.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which the form type exists.
     */
    domainId: DomainId;
    /**
     * The imports specified in the form type.
     */
    imports?: ImportList;
    /**
     * The model of the form type.
     */
    model?: Model;
    /**
     * The name of the form type.
     */
    name: FormTypeName;
    /**
     * The identifier of the Amazon DataZone domain in which the form type was originally created.
     */
    originDomainId?: DomainId;
    /**
     * The identifier of the project in which the form type was originally created.
     */
    originProjectId?: ProjectId;
    /**
     * The identifier of the project that owns the form type.
     */
    owningProjectId?: ProjectId;
    /**
     * The revision of the form type.
     */
    revision: Revision;
    /**
     * The status of the form type.
     */
    status?: FormTypeStatus;
  }
  export type FormTypeIdentifier = string;
  export type FormTypeName = string;
  export type FormTypeStatus = "ENABLED"|"DISABLED"|string;
  export type Forms = string;
  export type FormsInputMap = {[key: string]: FormEntryInput};
  export type FormsOutputMap = {[key: string]: FormEntryOutput};
  export interface GetAssetInput {
    /**
     * The ID of the Amazon DataZone domain to which the asset belongs.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the Amazon DataZone asset.
     */
    identifier: AssetIdentifier;
    /**
     * The revision of the Amazon DataZone asset.
     */
    revision?: Revision;
  }
  export interface GetAssetOutput {
    /**
     * The timestamp of when the asset was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the asset.
     */
    createdBy?: CreatedBy;
    /**
     * The description of the Amazon DataZone asset.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain to which the asset belongs.
     */
    domainId: DomainId;
    /**
     * 
     */
    externalIdentifier?: ExternalIdentifier;
    /**
     * The timestamp of when the first revision of the asset was created.
     */
    firstRevisionCreatedAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the first revision of the asset.
     */
    firstRevisionCreatedBy?: CreatedBy;
    /**
     * The metadata forms attached to the asset.
     */
    formsOutput: FormOutputList;
    /**
     * The business glossary terms attached to the asset.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The ID of the asset.
     */
    id: AssetId;
    /**
     * 
     */
    listing?: AssetListingDetails;
    /**
     * The name of the asset.
     */
    name: AssetName;
    /**
     * The ID of the project that owns the asset.
     */
    owningProjectId: ProjectId;
    /**
     * The read-only metadata forms attached to the asset.
     */
    readOnlyFormsOutput?: FormOutputList;
    /**
     * The revision of the asset.
     */
    revision: Revision;
    /**
     * The ID of the asset type.
     */
    typeIdentifier: AssetTypeIdentifier;
    /**
     * The revision of the asset type.
     */
    typeRevision: Revision;
  }
  export interface GetAssetTypeInput {
    /**
     * The ID of the Amazon DataZone domain in which the asset type exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the asset type.
     */
    identifier: AssetTypeIdentifier;
    /**
     * The revision of the asset type.
     */
    revision?: Revision;
  }
  export interface GetAssetTypeOutput {
    /**
     * The timestamp of when the asset type was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the asset type.
     */
    createdBy?: CreatedBy;
    /**
     * The description of the asset type.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which the asset type exists.
     */
    domainId: DomainId;
    /**
     * The metadata forms attached to the asset type.
     */
    formsOutput: FormsOutputMap;
    /**
     * The name of the asset type.
     */
    name: TypeName;
    /**
     * The ID of the Amazon DataZone domain in which the asset type was originally created.
     */
    originDomainId?: DomainId;
    /**
     * The ID of the Amazon DataZone project in which the asset type was originally created.
     */
    originProjectId?: ProjectId;
    /**
     * The ID of the Amazon DataZone project that owns the asset type.
     */
    owningProjectId: ProjectId;
    /**
     * The revision of the asset type.
     */
    revision: Revision;
    /**
     * The timestamp of when the asset type was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user that updated the asset type.
     */
    updatedBy?: UpdatedBy;
  }
  export interface GetDataSourceInput {
    /**
     * The ID of the Amazon DataZone domain in which the data source exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the Amazon DataZone data source.
     */
    identifier: DataSourceId;
  }
  export interface GetDataSourceOutput {
    /**
     * The metadata forms attached to the assets created by this data source.
     */
    assetFormsOutput?: FormOutputList;
    /**
     * The configuration of the data source.
     */
    configuration?: DataSourceConfigurationOutput;
    /**
     * The timestamp of when the data source was created.
     */
    createdAt?: DateTime;
    /**
     * The description of the data source.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which the data source exists.
     */
    domainId: DomainId;
    /**
     * Specifies whether this data source is enabled or not.
     */
    enableSetting?: EnableSetting;
    /**
     * The ID of the environment where this data source creates and publishes assets,
     */
    environmentId: EnvironmentId;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    errorMessage?: DataSourceErrorMessage;
    /**
     * The ID of the data source.
     */
    id: DataSourceId;
    /**
     * The number of assets created by the data source during its last run.
     */
    lastRunAssetCount?: Integer;
    /**
     * The timestamp of the last run of the data source.
     */
    lastRunAt?: DateTime;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    lastRunErrorMessage?: DataSourceErrorMessage;
    /**
     * The status of the last run of the data source.
     */
    lastRunStatus?: DataSourceRunStatus;
    /**
     * The name of the data source.
     */
    name: Name;
    /**
     * The ID of the project where the data source creates and publishes assets.
     */
    projectId: ProjectId;
    /**
     * Specifies whether the assets that this data source creates in the inventory are to be also automatically published to the catalog.
     */
    publishOnImport?: Boolean;
    /**
     * 
     */
    recommendation?: RecommendationConfiguration;
    /**
     * The schedule of the data source runs.
     */
    schedule?: ScheduleConfiguration;
    /**
     * The status of the data source.
     */
    status?: DataSourceStatus;
    /**
     * The type of the data source.
     */
    type?: DataSourceType;
    /**
     * The timestamp of when the data source was updated.
     */
    updatedAt?: DateTime;
  }
  export interface GetDataSourceRunInput {
    /**
     * The ID of the domain in which this data source run was performed.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the data source run.
     */
    identifier: DataSourceRunId;
  }
  export interface GetDataSourceRunOutput {
    /**
     * The timestamp of when the data source run was created.
     */
    createdAt: DateTime;
    /**
     * The configuration snapshot of the data source run.
     */
    dataSourceConfigurationSnapshot?: String;
    /**
     * The ID of the data source for this data source run.
     */
    dataSourceId: DataSourceId;
    /**
     * The ID of the domain in which this data source run was performed.
     */
    domainId: DomainId;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    errorMessage?: DataSourceErrorMessage;
    /**
     * The ID of the data source run.
     */
    id: DataSourceRunId;
    /**
     * The ID of the project in which this data source run occured.
     */
    projectId: ProjectId;
    /**
     * The asset statistics from this data source run.
     */
    runStatisticsForAssets?: RunStatisticsForAssets;
    /**
     * The timestamp of when this data source run started.
     */
    startedAt?: DateTime;
    /**
     * The status of this data source run.
     */
    status: DataSourceRunStatus;
    /**
     * The timestamp of when this data source run stopped.
     */
    stoppedAt?: DateTime;
    /**
     * The type of this data source run.
     */
    type: DataSourceRunType;
    /**
     * The timestamp of when this data source run was updated.
     */
    updatedAt: DateTime;
  }
  export interface GetDomainInput {
    /**
     * The identifier of the specified Amazon DataZone domain.
     */
    identifier: DomainId;
  }
  export interface GetDomainOutput {
    /**
     * The ARN of the specified Amazon DataZone domain.
     */
    arn?: String;
    /**
     * The timestamp of when the Amazon DataZone domain was created.
     */
    createdAt?: CreatedAt;
    /**
     * The description of the Amazon DataZone domain.
     */
    description?: String;
    /**
     * The domain execution role with which the Amazon DataZone domain is created.
     */
    domainExecutionRole: RoleArn;
    /**
     * The identifier of the specified Amazon DataZone domain.
     */
    id: DomainId;
    /**
     * The identifier of the Amazon Web Services Key Management Service (KMS) key that is used to encrypt the Amazon DataZone domain, metadata, and reporting data. 
     */
    kmsKeyIdentifier?: KmsKeyArn;
    /**
     * The timestamp of when the Amazon DataZone domain was last updated.
     */
    lastUpdatedAt?: UpdatedAt;
    /**
     * The name of the Amazon DataZone domain.
     */
    name?: String;
    /**
     * The URL of the data portal for this Amazon DataZone domain.
     */
    portalUrl?: String;
    /**
     * The single sing-on option of the specified Amazon DataZone domain.
     */
    singleSignOn?: SingleSignOn;
    /**
     * The status of the specified Amazon DataZone domain.
     */
    status: DomainStatus;
    /**
     * The tags specified for the Amazon DataZone domain.
     */
    tags?: Tags;
  }
  export interface GetEnvironmentBlueprintConfigurationInput {
    /**
     * The ID of the Amazon DataZone domain where this blueprint exists.
     */
    domainIdentifier: DomainId;
    /**
     * He ID of the blueprint.
     */
    environmentBlueprintIdentifier: EnvironmentBlueprintId;
  }
  export interface GetEnvironmentBlueprintConfigurationOutput {
    /**
     * The timestamp of when this blueprint was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The ID of the Amazon DataZone domain where this blueprint exists.
     */
    domainId: DomainId;
    /**
     * The Amazon Web Services regions in which this blueprint is enabled.
     */
    enabledRegions?: EnabledRegionList;
    /**
     * The ID of the blueprint.
     */
    environmentBlueprintId: EnvironmentBlueprintId;
    /**
     * The ARN of the manage access role with which this blueprint is created.
     */
    manageAccessRoleArn?: RoleArn;
    /**
     * The ARN of the provisioning role with which this blueprint is created.
     */
    provisioningRoleArn?: RoleArn;
    /**
     * The regional parameters of the blueprint.
     */
    regionalParameters?: RegionalParameterMap;
    /**
     * The timestamp of when this blueprint was upated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export interface GetEnvironmentBlueprintInput {
    /**
     * The identifier of the domain in which this blueprint exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of this Amazon DataZone blueprint.
     */
    identifier: EnvironmentBlueprintId;
  }
  export interface GetEnvironmentBlueprintOutput {
    /**
     * A timestamp of when this blueprint was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The deployment properties of this Amazon DataZone blueprint.
     */
    deploymentProperties?: DeploymentProperties;
    /**
     * The description of this Amazon DataZone blueprint.
     */
    description?: Description;
    /**
     * The glossary terms attached to this Amazon DataZone blueprint.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The ID of this Amazon DataZone blueprint.
     */
    id: EnvironmentBlueprintId;
    /**
     * The name of this Amazon DataZone blueprint.
     */
    name: EnvironmentBlueprintName;
    /**
     * The provider of this Amazon DataZone blueprint.
     */
    provider: String;
    /**
     * The provisioning properties of this Amazon DataZone blueprint.
     */
    provisioningProperties: ProvisioningProperties;
    /**
     * The timestamp of when this blueprint was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The user parameters of this blueprint.
     */
    userParameters?: CustomParameterList;
  }
  export interface GetEnvironmentInput {
    /**
     * The ID of the Amazon DataZone domain where the environment exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the Amazon DataZone environment.
     */
    identifier: EnvironmentId;
  }
  export interface GetEnvironmentOutput {
    /**
     * The ID of the Amazon Web Services account where the environment exists.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services region where the environment exists.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The timestamp of when the environment was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the environment.
     */
    createdBy: String;
    /**
     * The deployment properties of the environment.
     */
    deploymentProperties?: DeploymentProperties;
    /**
     * The description of the environment.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain where the environment exists.
     */
    domainId: DomainId;
    /**
     * The actions of the environment.
     */
    environmentActions?: EnvironmentActionList;
    /**
     * The blueprint with which the environment is created.
     */
    environmentBlueprintId?: EnvironmentBlueprintId;
    /**
     * The ID of the environment profile with which the environment is created.
     */
    environmentProfileId: EnvironmentProfileId;
    /**
     * The business glossary terms that can be used in this environment.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The ID of the environment.
     */
    id?: EnvironmentId;
    /**
     * The details of the last deployment of the environment.
     */
    lastDeployment?: Deployment;
    /**
     * The name of the environment.
     */
    name: EnvironmentName;
    /**
     * The ID of the Amazon DataZone project in which this environment is created.
     */
    projectId: ProjectId;
    /**
     * The provider of this Amazon DataZone environment.
     */
    provider: String;
    /**
     * The provisioned resources of this Amazon DataZone environment.
     */
    provisionedResources?: ResourceList;
    /**
     * The provisioning properties of this Amazon DataZone environment.
     */
    provisioningProperties?: ProvisioningProperties;
    /**
     * The status of this Amazon DataZone environment.
     */
    status?: EnvironmentStatus;
    /**
     * The timestamp of when this environment was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The user parameters of this Amazon DataZone environment.
     */
    userParameters?: CustomParameterList;
  }
  export interface GetEnvironmentProfileInput {
    /**
     * The ID of the Amazon DataZone domain in which this environment profile exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the environment profile.
     */
    identifier: EnvironmentProfileId;
  }
  export interface GetEnvironmentProfileOutput {
    /**
     * The ID of the Amazon Web Services account where this environment profile exists.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services region where this environment profile exists.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The timestamp of when this environment profile was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created this environment profile.
     */
    createdBy: String;
    /**
     * The description of the environment profile.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which this environment profile exists.
     */
    domainId: DomainId;
    /**
     * The ID of the blueprint with which this environment profile is created.
     */
    environmentBlueprintId: EnvironmentBlueprintId;
    /**
     * The ID of the environment profile.
     */
    id: EnvironmentProfileId;
    /**
     * The name of the environment profile.
     */
    name: EnvironmentProfileName;
    /**
     * The ID of the Amazon DataZone project in which this environment profile is created.
     */
    projectId?: ProjectId;
    /**
     * The timestamp of when this environment profile was upated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The user parameters of the environment profile.
     */
    userParameters?: CustomParameterList;
  }
  export interface GetFormTypeInput {
    /**
     * The ID of the Amazon DataZone domain in which this metadata form type exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the metadata form type.
     */
    formTypeIdentifier: FormTypeIdentifier;
    /**
     * The revision of this metadata form type.
     */
    revision?: Revision;
  }
  export interface GetFormTypeOutput {
    /**
     * The timestamp of when this metadata form type was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created this metadata form type.
     */
    createdBy?: CreatedBy;
    /**
     * The description of the metadata form type.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which this metadata form type exists.
     */
    domainId: DomainId;
    /**
     * The imports of the metadata form type.
     */
    imports?: ImportList;
    /**
     * The model of the metadata form type.
     */
    model: Model;
    /**
     * The name of the metadata form type.
     */
    name: FormTypeName;
    /**
     * The ID of the Amazon DataZone domain in which the metadata form type was originally created.
     */
    originDomainId?: DomainId;
    /**
     * The ID of the project in which this metadata form type was originally created.
     */
    originProjectId?: ProjectId;
    /**
     * The ID of the project that owns this metadata form type.
     */
    owningProjectId?: ProjectId;
    /**
     * The revision of the metadata form type.
     */
    revision: Revision;
    /**
     * The status of the metadata form type.
     */
    status?: FormTypeStatus;
  }
  export interface GetGlossaryInput {
    /**
     * The ID of the Amazon DataZone domain in which this business glossary exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the business glossary.
     */
    identifier: GlossaryId;
  }
  export interface GetGlossaryOutput {
    /**
     * The timestamp of when this business glossary was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created this business glossary.
     */
    createdBy?: CreatedBy;
    /**
     * The description of the business glossary.
     */
    description?: GlossaryDescription;
    /**
     * The ID of the Amazon DataZone domain in which this business glossary exists.
     */
    domainId: DomainId;
    /**
     * The ID of the business glossary.
     */
    id: GlossaryId;
    /**
     * The name of the business glossary.
     */
    name: GlossaryName;
    /**
     * The ID of the project that owns this business glossary.
     */
    owningProjectId: ProjectId;
    /**
     * The status of the business glossary.
     */
    status: GlossaryStatus;
    /**
     * The timestamp of when the business glossary was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the business glossary.
     */
    updatedBy?: UpdatedBy;
  }
  export interface GetGlossaryTermInput {
    /**
     * The ID of the Amazon DataZone domain in which this business glossary term exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the business glossary term.
     */
    identifier: GlossaryTermId;
  }
  export interface GetGlossaryTermOutput {
    /**
     * The timestamp of when the business glossary term was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the business glossary.
     */
    createdBy?: CreatedBy;
    /**
     * The ID of the Amazon DataZone domain in which this business glossary term exists.
     */
    domainId: DomainId;
    /**
     * The ID of the business glossary to which this term belongs.
     */
    glossaryId: GlossaryId;
    /**
     * The ID of the business glossary term.
     */
    id: GlossaryTermId;
    /**
     * The long description of the business glossary term.
     */
    longDescription?: LongDescription;
    /**
     * The name of the business glossary term.
     */
    name: GlossaryTermName;
    /**
     * The short decription of the business glossary term.
     */
    shortDescription?: ShortDescription;
    /**
     * The status of the business glossary term.
     */
    status: GlossaryTermStatus;
    /**
     * The relations of the business glossary term.
     */
    termRelations?: TermRelations;
    /**
     * The timestamp of when the business glossary term was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the business glossary term.
     */
    updatedBy?: UpdatedBy;
  }
  export interface GetGroupProfileInput {
    /**
     * The identifier of the Amazon DataZone domain in which the group profile exists.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the group profile.
     */
    groupIdentifier: GroupIdentifier;
  }
  export interface GetGroupProfileOutput {
    /**
     * The identifier of the Amazon DataZone domain in which the group profile exists.
     */
    domainId?: DomainId;
    /**
     * The name of the group for which the specified group profile exists.
     */
    groupName?: GroupProfileName;
    /**
     * The identifier of the group profile.
     */
    id?: GroupProfileId;
    /**
     * The identifier of the group profile.
     */
    status?: GroupProfileStatus;
  }
  export interface GetIamPortalLoginUrlInput {
    /**
     * the ID of the Amazon DataZone domain the data portal of which you want to get.
     */
    domainIdentifier: DomainId;
  }
  export interface GetIamPortalLoginUrlOutput {
    /**
     * The data portal URL of the specified Amazon DataZone domain.
     */
    authCodeUrl?: String;
    /**
     * The ID of the user profile.
     */
    userProfileId: String;
  }
  export interface GetListingInput {
    /**
     * 
     */
    domainIdentifier: DomainId;
    /**
     * 
     */
    identifier: ListingId;
    /**
     * 
     */
    listingRevision?: Revision;
  }
  export interface GetListingOutput {
    /**
     * 
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the listing.
     */
    createdBy?: CreatedBy;
    /**
     * 
     */
    description?: Description;
    /**
     * 
     */
    domainId: DomainId;
    /**
     * 
     */
    id: ListingId;
    /**
     * 
     */
    item?: ListingItem;
    /**
     * 
     */
    listingRevision: Revision;
    /**
     * 
     */
    name?: ListingName;
    /**
     * 
     */
    status?: ListingStatus;
    /**
     * The timestamp of when the listing was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the listing.
     */
    updatedBy?: UpdatedBy;
  }
  export interface GetProjectInput {
    /**
     * The ID of the Amazon DataZone domain in which the project exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the project.
     */
    identifier: ProjectId;
  }
  export interface GetProjectOutput {
    /**
     * The timestamp of when the project was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the project.
     */
    createdBy: CreatedBy;
    /**
     * The description of the project.
     */
    description?: Description;
    /**
     * The ID of the Amazon DataZone domain in which the project exists.
     */
    domainId: DomainId;
    /**
     * The business glossary terms that can be used in the project.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * &gt;The ID of the project.
     */
    id: ProjectId;
    /**
     * The timestamp of when the project was last updated.
     */
    lastUpdatedAt?: SyntheticTimestamp_date_time;
    /**
     * The name of the project.
     */
    name: ProjectName;
  }
  export interface GetSubscriptionGrantInput {
    /**
     * The ID of the Amazon DataZone domain in which the subscription grant exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the subscription grant.
     */
    identifier: SubscriptionGrantId;
  }
  export interface GetSubscriptionGrantOutput {
    /**
     * The assets for which the subscription grant is created.
     */
    assets?: SubscribedAssets;
    /**
     * The timestamp of when the subscription grant is created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription grant.
     */
    createdBy: CreatedBy;
    /**
     * The ID of the Amazon DataZone domain in which the subscription grant exists.
     */
    domainId: DomainId;
    /**
     * The entity to which the subscription is granted.
     */
    grantedEntity: GrantedEntity;
    /**
     * The ID of the subscription grant.
     */
    id: SubscriptionGrantId;
    /**
     * The status of the subscription grant.
     */
    status: SubscriptionGrantOverallStatus;
    /**
     * The identifier of the subscription.
     */
    subscriptionId?: SubscriptionId;
    /**
     * The subscription target ID associated with the subscription grant.
     */
    subscriptionTargetId: SubscriptionTargetId;
    /**
     * The timestamp of when the subscription grant was upated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription grant.
     */
    updatedBy?: UpdatedBy;
  }
  export interface GetSubscriptionInput {
    /**
     * The ID of the Amazon DataZone domain in which the subscription exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the subscription.
     */
    identifier: SubscriptionId;
  }
  export interface GetSubscriptionOutput {
    /**
     * The timestamp of when the subscription was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription.
     */
    createdBy: CreatedBy;
    /**
     * The ID of the Amazon DataZone domain in which the subscription exists.
     */
    domainId: DomainId;
    /**
     * The ID of the subscription.
     */
    id: SubscriptionId;
    /**
     * The retain permissions of the subscription.
     */
    retainPermissions?: Boolean;
    /**
     * The status of the subscription.
     */
    status: SubscriptionStatus;
    /**
     * 
     */
    subscribedListing: SubscribedListing;
    /**
     * The principal that owns the subscription.
     */
    subscribedPrincipal: SubscribedPrincipal;
    /**
     * The ID of the subscription request.
     */
    subscriptionRequestId?: SubscriptionRequestId;
    /**
     * The timestamp of when the subscription was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription.
     */
    updatedBy?: UpdatedBy;
  }
  export interface GetSubscriptionRequestDetailsInput {
    /**
     * The identifier of the Amazon DataZone domain in which to get the subscription request details.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the subscription request the details of which to get.
     */
    identifier: SubscriptionRequestId;
  }
  export interface GetSubscriptionRequestDetailsOutput {
    /**
     * The timestamp of when the specified subscription request was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription request.
     */
    createdBy: CreatedBy;
    /**
     * The decision comment of the subscription request.
     */
    decisionComment?: DecisionComment;
    /**
     * The Amazon DataZone domain of the subscription request.
     */
    domainId: DomainId;
    /**
     * The identifier of the subscription request.
     */
    id: SubscriptionRequestId;
    /**
     * The reason for the subscription request.
     */
    requestReason: RequestReason;
    /**
     * The identifier of the Amazon DataZone user who reviewed the subscription request.
     */
    reviewerId?: String;
    /**
     * The status of the subscription request.
     */
    status: SubscriptionRequestStatus;
    /**
     * The subscribed listings in the subscription request.
     */
    subscribedListings: GetSubscriptionRequestDetailsOutputSubscribedListingsList;
    /**
     * The subscribed principals in the subscription request.
     */
    subscribedPrincipals: GetSubscriptionRequestDetailsOutputSubscribedPrincipalsList;
    /**
     * The timestamp of when the subscription request was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription request.
     */
    updatedBy?: UpdatedBy;
  }
  export type GetSubscriptionRequestDetailsOutputSubscribedListingsList = SubscribedListing[];
  export type GetSubscriptionRequestDetailsOutputSubscribedPrincipalsList = SubscribedPrincipal[];
  export interface GetSubscriptionTargetInput {
    /**
     * The ID of the Amazon DataZone domain in which the subscription target exists.
     */
    domainIdentifier: DomainId;
    /**
     * The ID of the environment associated with the subscription target.
     */
    environmentIdentifier: EnvironmentId;
    /**
     * The ID of the subscription target.
     */
    identifier: SubscriptionTargetId;
  }
  export interface GetSubscriptionTargetOutput {
    /**
     * The asset types associated with the subscription target.
     */
    applicableAssetTypes: ApplicableAssetTypes;
    /**
     * The authorized principals of the subscription target.
     */
    authorizedPrincipals: AuthorizedPrincipalIdentifiers;
    /**
     * The timestamp of when the subscription target was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription target.
     */
    createdBy: CreatedBy;
    /**
     * The ID of the Amazon DataZone domain in which the subscription target exists.
     */
    domainId: DomainId;
    /**
     * The ID of the environment associated with the subscription target.
     */
    environmentId: EnvironmentId;
    /**
     * The ID of the subscription target.
     */
    id: SubscriptionTargetId;
    /**
     * The manage access role with which the subscription target was created.
     */
    manageAccessRole: String;
    /**
     * The name of the subscription target.
     */
    name: SubscriptionTargetName;
    /**
     * The ID of the project associated with the subscription target.
     */
    projectId: ProjectId;
    /**
     * The provider of the subscription target.
     */
    provider: String;
    /**
     * The configuration of teh subscription target.
     */
    subscriptionTargetConfig: SubscriptionTargetForms;
    /**
     * The type of the subscription target.
     */
    type: String;
    /**
     * The timestamp of when the subscription target was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription target.
     */
    updatedBy?: UpdatedBy;
  }
  export interface GetUserProfileInput {
    /**
     * the ID of the Amazon DataZone domain the data portal of which you want to get.
     */
    domainIdentifier: DomainId;
    /**
     * The type of the user profile.
     */
    type?: UserProfileType;
    /**
     * The identifier of the user for which you want to get the user profile.
     */
    userIdentifier: UserIdentifier;
  }
  export interface GetUserProfileOutput {
    details?: UserProfileDetails;
    /**
     * the identifier of the Amazon DataZone domain of which you want to get the user profile.
     */
    domainId?: DomainId;
    /**
     * The identifier of the user profile.
     */
    id?: UserProfileId;
    /**
     * The status of the user profile.
     */
    status?: UserProfileStatus;
    /**
     * The type of the user profile.
     */
    type?: UserProfileType;
  }
  export type GlossaryDescription = string;
  export type GlossaryId = string;
  export interface GlossaryItem {
    /**
     * The timestamp of when the glossary was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the glossary.
     */
    createdBy?: CreatedBy;
    /**
     * The business glossary description.
     */
    description?: GlossaryDescription;
    /**
     * The identifier of the Amazon DataZone domain in which the business glossary exists.
     */
    domainId: DomainId;
    /**
     * The identifier of the glossary.
     */
    id: GlossaryId;
    /**
     * The name of the glossary.
     */
    name: GlossaryName;
    /**
     * The identifier of the project that owns the business glosary.
     */
    owningProjectId: ProjectId;
    /**
     * The business glossary status.
     */
    status: GlossaryStatus;
    /**
     * The timestamp of when the business glossary was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the business glossary.
     */
    updatedBy?: UpdatedBy;
  }
  export type GlossaryName = string;
  export type GlossaryStatus = "DISABLED"|"ENABLED"|string;
  export type GlossaryTermId = string;
  export interface GlossaryTermItem {
    /**
     * The timestamp of when a business glossary term was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon DataZone user who created the business glossary.
     */
    createdBy?: CreatedBy;
    /**
     * The identifier of the Amazon DataZone domain in which the business glossary exists.
     */
    domainId: DomainId;
    /**
     * The identifier of the business glossary to which the term belongs.
     */
    glossaryId: GlossaryId;
    /**
     * The identifier of the business glossary term.
     */
    id: GlossaryTermId;
    /**
     * The long description of the business glossary term.
     */
    longDescription?: LongDescription;
    /**
     * The name of the business glossary term.
     */
    name: GlossaryTermName;
    /**
     * The short description of the business glossary term.
     */
    shortDescription?: ShortDescription;
    /**
     * The status of the business glossary term.
     */
    status: GlossaryTermStatus;
    /**
     * The relations of the business glossary term.
     */
    termRelations?: TermRelations;
    /**
     * The timestamp of when a business glossary term was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the business glossary term.
     */
    updatedBy?: UpdatedBy;
  }
  export type GlossaryTermName = string;
  export type GlossaryTermStatus = "ENABLED"|"DISABLED"|string;
  export type GlossaryTerms = GlossaryTermId[];
  export interface GlueRunConfigurationInput {
    /**
     * The data access role included in the configuration details of the Amazon Web Services Glue data source.
     */
    dataAccessRole?: GlueRunConfigurationInputDataAccessRoleString;
    /**
     * The relational filter configurations included in the configuration details of the Amazon Web Services Glue data source.
     */
    relationalFilterConfigurations: RelationalFilterConfigurations;
  }
  export type GlueRunConfigurationInputDataAccessRoleString = string;
  export interface GlueRunConfigurationOutput {
    /**
     * The Amazon Web Services account ID included in the configuration details of the Amazon Web Services Glue data source. 
     */
    accountId?: GlueRunConfigurationOutputAccountIdString;
    /**
     * The data access role included in the configuration details of the Amazon Web Services Glue data source. 
     */
    dataAccessRole?: GlueRunConfigurationOutputDataAccessRoleString;
    /**
     * The Amazon Web Services region included in the configuration details of the Amazon Web Services Glue data source. 
     */
    region?: GlueRunConfigurationOutputRegionString;
    /**
     * The relational filter configurations included in the configuration details of the Amazon Web Services Glue data source.
     */
    relationalFilterConfigurations: RelationalFilterConfigurations;
  }
  export type GlueRunConfigurationOutputAccountIdString = string;
  export type GlueRunConfigurationOutputDataAccessRoleString = string;
  export type GlueRunConfigurationOutputRegionString = string;
  export interface GrantedEntity {
    /**
     * The listing for which a subscription is granted.
     */
    listing?: ListingRevision;
  }
  export interface GrantedEntityInput {
    /**
     * The listing for which a subscription is to be granted.
     */
    listing?: ListingRevisionInput;
  }
  export interface GroupDetails {
    /**
     * The identifier of the group in Amazon DataZone.
     */
    groupId: String;
  }
  export type GroupIdentifier = string;
  export type GroupProfileId = string;
  export type GroupProfileName = string;
  export type GroupProfileStatus = "ASSIGNED"|"NOT_ASSIGNED"|string;
  export type GroupProfileSummaries = GroupProfileSummary[];
  export interface GroupProfileSummary {
    /**
     * The ID of the Amazon DataZone domain of a group profile.
     */
    domainId?: DomainId;
    /**
     * The group name of a group profile.
     */
    groupName?: GroupProfileName;
    /**
     * The ID of a group profile.
     */
    id?: GroupProfileId;
    /**
     * The status of a group profile.
     */
    status?: GroupProfileStatus;
  }
  export type GroupSearchText = string;
  export type GroupSearchType = "SSO_GROUP"|"DATAZONE_SSO_GROUP"|string;
  export interface IamUserProfileDetails {
    /**
     * The ARN of an IAM user profile in Amazon DataZone.
     */
    arn?: String;
  }
  export interface Import {
    /**
     * The name of the import.
     */
    name: FormTypeName;
    /**
     * The revision of the import.
     */
    revision: Revision;
  }
  export type ImportList = Import[];
  export type Integer = number;
  export type InventorySearchScope = "ASSET"|"GLOSSARY"|"GLOSSARY_TERM"|string;
  export type KmsKeyArn = string;
  export type LastName = string;
  export interface ListAssetRevisionsInput {
    /**
     * The identifier of the domain.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the asset.
     */
    identifier: AssetIdentifier;
    /**
     * The maximum number of revisions to return in a single call to ListAssetRevisions. When the number of revisions to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListAssetRevisions to list the next set of revisions.
     */
    maxResults?: MaxResults;
    /**
     * When the number of revisions is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of revisions, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListAssetRevisions to list the next set of revisions.
     */
    nextToken?: PaginationToken;
  }
  export interface ListAssetRevisionsOutput {
    /**
     * The results of the ListAssetRevisions action.
     */
    items?: AssetRevisions;
    /**
     * When the number of revisions is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of revisions, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListAssetRevisions to list the next set of revisions.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDataSourceRunActivitiesInput {
    /**
     * The identifier of the Amazon DataZone domain in which to list data source run activities.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the data source run.
     */
    identifier: DataSourceRunId;
    /**
     * The maximum number of activities to return in a single call to ListDataSourceRunActivities. When the number of activities to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListDataSourceRunActivities to list the next set of activities.
     */
    maxResults?: MaxResults;
    /**
     * When the number of activities is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of activities, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListDataSourceRunActivities to list the next set of activities.
     */
    nextToken?: PaginationToken;
    /**
     * The status of the data source run.
     */
    status?: DataAssetActivityStatus;
  }
  export interface ListDataSourceRunActivitiesOutput {
    /**
     * The results of the ListDataSourceRunActivities action.
     */
    items: DataSourceRunActivities;
    /**
     * When the number of activities is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of activities, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListDataSourceRunActivities to list the next set of activities.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDataSourceRunsInput {
    /**
     * The identifier of the data source.
     */
    dataSourceIdentifier: DataSourceId;
    /**
     * The identifier of the Amazon DataZone domain in which to invoke the ListDataSourceRuns action.
     */
    domainIdentifier: DomainId;
    /**
     * The maximum number of runs to return in a single call to ListDataSourceRuns. When the number of runs to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListDataSourceRuns to list the next set of runs.
     */
    maxResults?: MaxResults;
    /**
     * When the number of runs is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of runs, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListDataSourceRuns to list the next set of runs.
     */
    nextToken?: PaginationToken;
    /**
     * The status of the data source.
     */
    status?: DataSourceRunStatus;
  }
  export interface ListDataSourceRunsOutput {
    /**
     * The results of the ListDataSourceRuns action.
     */
    items: DataSourceRunSummaries;
    /**
     * When the number of runs is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of runs, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListDataSourceRuns to list the next set of runs.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDataSourcesInput {
    /**
     * The identifier of the Amazon DataZone domain in which to list the data sources.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the environment in which to list the data sources.
     */
    environmentIdentifier?: String;
    /**
     * The maximum number of data sources to return in a single call to ListDataSources. When the number of data sources to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListDataSources to list the next set of data sources.
     */
    maxResults?: MaxResults;
    /**
     * The name of the data source.
     */
    name?: Name;
    /**
     * When the number of data sources is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of data sources, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListDataSources to list the next set of data sources.
     */
    nextToken?: PaginationToken;
    /**
     * The identifier of the project in which to list data sources.
     */
    projectIdentifier: String;
    /**
     * The status of the data source.
     */
    status?: DataSourceStatus;
    /**
     * The type of the data source.
     */
    type?: DataSourceType;
  }
  export interface ListDataSourcesOutput {
    /**
     * The results of the ListDataSources action.
     */
    items: DataSourceSummaries;
    /**
     * When the number of data sources is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of data sources, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListDataSources to list the next set of data sources.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDomainsInput {
    /**
     * The maximum number of domains to return in a single call to ListDomains. When the number of domains to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListDomains to list the next set of domains.
     */
    maxResults?: MaxResultsForListDomains;
    /**
     * When the number of domains is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of domains, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListDomains to list the next set of domains.
     */
    nextToken?: PaginationToken;
    /**
     * The status of the data source.
     */
    status?: DomainStatus;
  }
  export interface ListDomainsOutput {
    /**
     * The results of the ListDomains action.
     */
    items: DomainSummaries;
    /**
     * When the number of domains is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of domains, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListDomains to list the next set of domains.
     */
    nextToken?: PaginationToken;
  }
  export interface ListEnvironmentBlueprintConfigurationsInput {
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The maximum number of blueprint configurations to return in a single call to ListEnvironmentBlueprintConfigurations. When the number of configurations to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListEnvironmentBlueprintConfigurations to list the next set of configurations.
     */
    maxResults?: MaxResults;
    /**
     * When the number of blueprint configurations is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of configurations, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListEnvironmentBlueprintConfigurations to list the next set of configurations.
     */
    nextToken?: PaginationToken;
  }
  export interface ListEnvironmentBlueprintConfigurationsOutput {
    /**
     * The results of the ListEnvironmentBlueprintConfigurations action.
     */
    items?: EnvironmentBlueprintConfigurations;
    /**
     * When the number of blueprint configurations is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of configurations, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListEnvironmentBlueprintConfigurations to list the next set of configurations.
     */
    nextToken?: PaginationToken;
  }
  export interface ListEnvironmentBlueprintsInput {
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * Specifies whether the environment blueprint is managed by Amazon DataZone.
     */
    managed?: Boolean;
    /**
     * The maximum number of blueprints to return in a single call to ListEnvironmentBlueprints. When the number of blueprints to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListEnvironmentBlueprints to list the next set of blueprints.
     */
    maxResults?: MaxResults;
    /**
     * The name of the Amazon DataZone environment.
     */
    name?: EnvironmentBlueprintName;
    /**
     * When the number of blueprints in the environment is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of blueprints in the environment, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListEnvironmentBlueprintsto list the next set of blueprints.
     */
    nextToken?: PaginationToken;
  }
  export interface ListEnvironmentBlueprintsOutput {
    /**
     * The results of the ListEnvironmentBlueprints action.
     */
    items: EnvironmentBlueprintSummaries;
    /**
     * When the number of blueprints in the environment is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of blueprints in the environment, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListEnvironmentBlueprintsto list the next set of blueprints.
     */
    nextToken?: PaginationToken;
  }
  export interface ListEnvironmentProfilesInput {
    /**
     * The identifier of the Amazon Web Services account where you want to list environment profiles.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services region where you want to list environment profiles.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the blueprint that was used to create the environment profiles that you want to list.
     */
    environmentBlueprintIdentifier?: EnvironmentBlueprintId;
    /**
     * The maximum number of environment profiles to return in a single call to ListEnvironmentProfiles. When the number of environment profiles to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListEnvironmentProfiles to list the next set of environment profiles.
     */
    maxResults?: MaxResults;
    /**
     * 
     */
    name?: EnvironmentProfileName;
    /**
     * When the number of environment profiles is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of environment profiles, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListEnvironmentProfiles to list the next set of environment profiles.
     */
    nextToken?: PaginationToken;
    /**
     * The identifier of the Amazon DataZone project.
     */
    projectIdentifier?: ProjectId;
  }
  export interface ListEnvironmentProfilesOutput {
    /**
     * The results of the ListEnvironmentProfiles action. 
     */
    items: EnvironmentProfileSummaries;
    /**
     * When the number of environment profiles is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of environment profiles, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListEnvironmentProfiles to list the next set of environment profiles.
     */
    nextToken?: PaginationToken;
  }
  export interface ListEnvironmentsInput {
    /**
     * The identifier of the Amazon Web Services account where you want to list environments.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services region where you want to list environments.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the Amazon DataZone blueprint.
     */
    environmentBlueprintIdentifier?: EnvironmentBlueprintId;
    /**
     * The identifier of the environment profile.
     */
    environmentProfileIdentifier?: EnvironmentProfileId;
    /**
     * The maximum number of environments to return in a single call to ListEnvironments. When the number of environments to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListEnvironments to list the next set of environments.
     */
    maxResults?: MaxResults;
    /**
     * 
     */
    name?: String;
    /**
     * When the number of environments is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of environments, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListEnvironments to list the next set of environments.
     */
    nextToken?: PaginationToken;
    /**
     * The identifier of the Amazon DataZone project.
     */
    projectIdentifier: ProjectId;
    /**
     * The provider of the environment.
     */
    provider?: String;
    /**
     * The status of the environments that you want to list.
     */
    status?: EnvironmentStatus;
  }
  export interface ListEnvironmentsOutput {
    /**
     * The results of the ListEnvironments action.
     */
    items: EnvironmentSummaries;
    /**
     * When the number of environments is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of environments, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListEnvironments to list the next set of environments.
     */
    nextToken?: PaginationToken;
  }
  export interface ListNotificationsInput {
    /**
     * The time after which you want to list notifications.
     */
    afterTimestamp?: Timestamp;
    /**
     * The time before which you want to list notifications.
     */
    beforeTimestamp?: Timestamp;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The maximum number of notifications to return in a single call to ListNotifications. When the number of notifications to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListNotifications to list the next set of notifications.
     */
    maxResults?: MaxResults;
    /**
     * When the number of notifications is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of notifications, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListNotifications to list the next set of notifications.
     */
    nextToken?: PaginationToken;
    /**
     * The subjects of notifications.
     */
    subjects?: NotificationSubjects;
    /**
     * The task status of notifications.
     */
    taskStatus?: TaskStatus;
    /**
     * The type of notifications.
     */
    type: NotificationType;
  }
  export interface ListNotificationsOutput {
    /**
     * When the number of notifications is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of notifications, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListNotifications to list the next set of notifications.
     */
    nextToken?: PaginationToken;
    /**
     * The results of the ListNotifications action.
     */
    notifications?: NotificationsList;
  }
  export interface ListProjectMembershipsInput {
    /**
     * The identifier of the Amazon DataZone domain in which you want to list project memberships.
     */
    domainIdentifier: DomainId;
    /**
     * The maximum number of memberships to return in a single call to ListProjectMemberships. When the number of memberships to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListProjectMemberships to list the next set of memberships.
     */
    maxResults?: MaxResults;
    /**
     * When the number of memberships is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of memberships, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListProjectMemberships to list the next set of memberships.
     */
    nextToken?: PaginationToken;
    /**
     * The identifier of the project whose memberships you want to list.
     */
    projectIdentifier: ProjectId;
    /**
     * The method by which you want to sort the project memberships.
     */
    sortBy?: SortFieldProject;
    /**
     * The sort order of the project memberships.
     */
    sortOrder?: SortOrder;
  }
  export interface ListProjectMembershipsOutput {
    /**
     * The members of the project.
     */
    members: ProjectMembers;
    /**
     * When the number of memberships is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of memberships, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListProjectMemberships to list the next set of memberships.
     */
    nextToken?: PaginationToken;
  }
  export interface ListProjectsInput {
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of a group.
     */
    groupIdentifier?: String;
    /**
     * The maximum number of projects to return in a single call to ListProjects. When the number of projects to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListProjects to list the next set of projects.
     */
    maxResults?: MaxResults;
    /**
     * 
     */
    name?: ProjectName;
    /**
     * When the number of projects is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of projects, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListProjects to list the next set of projects.
     */
    nextToken?: PaginationToken;
    /**
     * The identifier of the Amazon DataZone user.
     */
    userIdentifier?: String;
  }
  export interface ListProjectsOutput {
    /**
     * The results of the ListProjects action.
     */
    items?: ProjectSummaries;
    /**
     * When the number of projects is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of projects, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListProjects to list the next set of projects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSubscriptionGrantsInput {
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the Amazon DataZone environment.
     */
    environmentId?: EnvironmentId;
    /**
     * The maximum number of subscription grants to return in a single call to ListSubscriptionGrants. When the number of subscription grants to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListSubscriptionGrants to list the next set of subscription grants.
     */
    maxResults?: MaxResults;
    /**
     * When the number of subscription grants is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of subscription grants, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListSubscriptionGrants to list the next set of subscription grants.
     */
    nextToken?: PaginationToken;
    /**
     * Specifies the way of sorting the results of this action.
     */
    sortBy?: SortKey;
    /**
     * Specifies the sort order of this action.
     */
    sortOrder?: SortOrder;
    /**
     * The identifier of the subscribed listing.
     */
    subscribedListingId?: ListingId;
    /**
     * The identifier of the subscription.
     */
    subscriptionId?: SubscriptionId;
    /**
     * The identifier of the subscription target.
     */
    subscriptionTargetId?: SubscriptionTargetId;
  }
  export interface ListSubscriptionGrantsOutput {
    /**
     * The results of the ListSubscriptionGrants action. 
     */
    items: SubscriptionGrants;
    /**
     * When the number of subscription grants is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of subscription grants, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListSubscriptionGrants to list the next set of subscription grants.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSubscriptionRequestsInput {
    /**
     * The identifier of the subscription request approver's project.
     */
    approverProjectId?: ProjectId;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The maximum number of subscription requests to return in a single call to ListSubscriptionRequests. When the number of subscription requests to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListSubscriptionRequests to list the next set of subscription requests.
     */
    maxResults?: MaxResults;
    /**
     * When the number of subscription requests is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of subscription requests, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListSubscriptionRequests to list the next set of subscription requests.
     */
    nextToken?: PaginationToken;
    /**
     * The identifier of the project for the subscription requests.
     */
    owningProjectId?: ProjectId;
    /**
     * Specifies the way to sort the results of this action.
     */
    sortBy?: SortKey;
    /**
     * Specifies the sort order for the results of this action.
     */
    sortOrder?: SortOrder;
    /**
     * Specifies the status of the subscription requests.
     */
    status?: SubscriptionRequestStatus;
    /**
     * The identifier of the subscribed listing.
     */
    subscribedListingId?: ListingId;
  }
  export interface ListSubscriptionRequestsOutput {
    /**
     * The results of the ListSubscriptionRequests action. 
     */
    items: SubscriptionRequests;
    /**
     * When the number of subscription requests is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of subscription requests, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListSubscriptionRequests to list the next set of subscription requests.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSubscriptionTargetsInput {
    /**
     * The identifier of the Amazon DataZone domain where you want to list subscription targets.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the environment where you want to list subscription targets.
     */
    environmentIdentifier: EnvironmentId;
    /**
     * The maximum number of subscription targets to return in a single call to ListSubscriptionTargets. When the number of subscription targets to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListSubscriptionTargets to list the next set of subscription targets. 
     */
    maxResults?: MaxResults;
    /**
     * When the number of subscription targets is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of subscription targets, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListSubscriptionTargets to list the next set of subscription targets.
     */
    nextToken?: PaginationToken;
    /**
     * Specifies the way in which the results of this action are to be sorted.
     */
    sortBy?: SortKey;
    /**
     * Specifies the sort order for the results of this action.
     */
    sortOrder?: SortOrder;
  }
  export interface ListSubscriptionTargetsOutput {
    /**
     * The results of the ListSubscriptionTargets action.
     */
    items: SubscriptionTargets;
    /**
     * When the number of subscription targets is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of subscription targets, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListSubscriptionTargets to list the next set of subscription targets.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSubscriptionsInput {
    /**
     * The identifier of the project for the subscription's approver.
     */
    approverProjectId?: ProjectId;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The maximum number of subscriptions to return in a single call to ListSubscriptions. When the number of subscriptions to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to ListSubscriptions to list the next set of Subscriptions. 
     */
    maxResults?: MaxResults;
    /**
     * When the number of subscriptions is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of subscriptions, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListSubscriptions to list the next set of subscriptions.
     */
    nextToken?: PaginationToken;
    /**
     * The identifier of the owning project.
     */
    owningProjectId?: ProjectId;
    /**
     * Specifies the way in which the results of this action are to be sorted.
     */
    sortBy?: SortKey;
    /**
     * Specifies the sort order for the results of this action.
     */
    sortOrder?: SortOrder;
    /**
     * The status of the subscriptions that you want to list.
     */
    status?: SubscriptionStatus;
    /**
     * The identifier of the subscribed listing for the subscriptions that you want to list.
     */
    subscribedListingId?: ListingId;
    /**
     * The identifier of the subscription request for the subscriptions that you want to list.
     */
    subscriptionRequestIdentifier?: SubscriptionRequestId;
  }
  export interface ListSubscriptionsOutput {
    /**
     * The results of the ListSubscriptions action.
     */
    items: Subscriptions;
    /**
     * When the number of subscriptions is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of subscriptions, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to ListSubscriptions to list the next set of subscriptions.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource whose tags you want to list.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags of the specified resource.
     */
    tags?: Tags;
  }
  export type ListingId = string;
  export interface ListingItem {
    /**
     * An asset published in an Amazon DataZone catalog.
     */
    assetListing?: AssetListing;
  }
  export type ListingName = string;
  export interface ListingRevision {
    /**
     * An identifier of a revision of an asset published in a Amazon DataZone catalog.
     */
    id: ListingId;
    /**
     * The details of a revision of an asset published in a Amazon DataZone catalog.
     */
    revision: Revision;
  }
  export interface ListingRevisionInput {
    /**
     * An identifier of revision to be made to an asset published in a Amazon DataZone catalog.
     */
    identifier: ListingId;
    /**
     * The details of a revision to be made to an asset published in a Amazon DataZone catalog.
     */
    revision: Revision;
  }
  export type ListingStatus = "CREATING"|"ACTIVE"|"INACTIVE"|string;
  export type LongDescription = string;
  export type MaxResults = number;
  export type MaxResultsForListDomains = number;
  export interface Member {
    /**
     * The ID of the group of a project member.
     */
    groupIdentifier?: String;
    /**
     * The user ID of a project member.
     */
    userIdentifier?: String;
  }
  export interface MemberDetails {
    /**
     * The group details of a project member.
     */
    group?: GroupDetails;
    /**
     * The user details of a project member.
     */
    user?: UserDetails;
  }
  export type Message = string;
  export type MetadataMap = {[key: string]: String};
  export interface Model {
    /**
     * 
     */
    smithy?: Smithy;
  }
  export type Name = string;
  export interface NotificationOutput {
    /**
     * The action link included in the notification.
     */
    actionLink: ActionLink;
    /**
     * The timestamp of when a notification was created.
     */
    creationTimestamp: Timestamp;
    /**
     * The identifier of a Amazon DataZone domain in which the notification exists.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the notification.
     */
    identifier: TaskId;
    /**
     * The timestamp of when the notification was last updated.
     */
    lastUpdatedTimestamp: Timestamp;
    /**
     * The message included in the notification.
     */
    message: Message;
    /**
     * The metadata included in the notification.
     */
    metadata?: MetadataMap;
    /**
     * The status included in the notification.
     */
    status?: TaskStatus;
    /**
     * The title of the notification.
     */
    title: Title;
    /**
     * The topic of the notification.
     */
    topic: Topic;
    /**
     * The type of the notification.
     */
    type: NotificationType;
  }
  export interface NotificationResource {
    /**
     * The ID of the resource mentioned in a notification.
     */
    id: String;
    /**
     * The name of the resource mentioned in a notification.
     */
    name?: String;
    /**
     * The type of the resource mentioned in a notification.
     */
    type: NotificationResourceType;
  }
  export type NotificationResourceType = "PROJECT"|string;
  export type NotificationRole = "PROJECT_OWNER"|"PROJECT_CONTRIBUTOR"|"PROJECT_VIEWER"|"DOMAIN_OWNER"|"PROJECT_SUBSCRIBER"|string;
  export type NotificationSubjects = String[];
  export type NotificationType = "TASK"|"EVENT"|string;
  export type NotificationsList = NotificationOutput[];
  export type PaginationToken = string;
  export type PredictionChoices = Integer[];
  export interface PredictionConfiguration {
    /**
     * The business name generation mechanism.
     */
    businessNameGeneration?: BusinessNameGenerationConfiguration;
  }
  export type ProjectId = string;
  export interface ProjectMember {
    /**
     * The designated role of a project member.
     */
    designation: UserDesignation;
    /**
     * The membership details of a project member.
     */
    memberDetails: MemberDetails;
  }
  export type ProjectMembers = ProjectMember[];
  export type ProjectName = string;
  export type ProjectSummaries = ProjectSummary[];
  export interface ProjectSummary {
    /**
     * The timestamp of when a project was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the project.
     */
    createdBy: CreatedBy;
    /**
     * The description of a project.
     */
    description?: Description;
    /**
     * The identifier of a Amazon DataZone domain where the project exists.
     */
    domainId: DomainId;
    /**
     * The identifier of a project.
     */
    id: ProjectId;
    /**
     * The name of a project.
     */
    name: ProjectName;
    /**
     * The timestamp of when the project was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export interface ProvisioningProperties {
    /**
     * The cloud formation properties included as part of the provisioning properties of an environment blueprint.
     */
    cloudFormation?: CloudFormationProperties;
  }
  export interface PutEnvironmentBlueprintConfigurationInput {
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * Specifies the enabled Amazon Web Services Regions.
     */
    enabledRegions: EnabledRegionList;
    /**
     * The identifier of the environment blueprint.
     */
    environmentBlueprintIdentifier: EnvironmentBlueprintId;
    /**
     * The ARN of the manage access role.
     */
    manageAccessRoleArn?: RoleArn;
    /**
     * The ARN of the provisioning role.
     */
    provisioningRoleArn?: RoleArn;
    /**
     * The regional parameters in the environment blueprint.
     */
    regionalParameters?: RegionalParameterMap;
  }
  export interface PutEnvironmentBlueprintConfigurationOutput {
    /**
     * The timestamp of when the environment blueprint was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainId: DomainId;
    /**
     * Specifies the enabled Amazon Web Services Regions.
     */
    enabledRegions?: EnabledRegionList;
    /**
     * The identifier of the environment blueprint.
     */
    environmentBlueprintId: EnvironmentBlueprintId;
    /**
     * The ARN of the manage access role.
     */
    manageAccessRoleArn?: RoleArn;
    /**
     * The ARN of the provisioning role.
     */
    provisioningRoleArn?: RoleArn;
    /**
     * The regional parameters in the environment blueprint.
     */
    regionalParameters?: RegionalParameterMap;
    /**
     * The timestamp of when the environment blueprint was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export interface RecommendationConfiguration {
    /**
     * Specifies whether automatic business name generation is to be enabled or not as part of the recommendation configuration.
     */
    enableBusinessNameGeneration?: Boolean;
  }
  export interface RedshiftClusterStorage {
    /**
     * The name of an Amazon Redshift cluster.
     */
    clusterName: RedshiftClusterStorageClusterNameString;
  }
  export type RedshiftClusterStorageClusterNameString = string;
  export interface RedshiftCredentialConfiguration {
    /**
     * The ARN of a secret manager for an Amazon Redshift cluster.
     */
    secretManagerArn: RedshiftCredentialConfigurationSecretManagerArnString;
  }
  export type RedshiftCredentialConfigurationSecretManagerArnString = string;
  export interface RedshiftRunConfigurationInput {
    /**
     * The data access role included in the configuration details of the Amazon Redshift data source.
     */
    dataAccessRole?: RedshiftRunConfigurationInputDataAccessRoleString;
    redshiftCredentialConfiguration: RedshiftCredentialConfiguration;
    redshiftStorage: RedshiftStorage;
    /**
     * The relational filger configurations included in the configuration details of the Amazon Redshift data source.
     */
    relationalFilterConfigurations: RelationalFilterConfigurations;
  }
  export type RedshiftRunConfigurationInputDataAccessRoleString = string;
  export interface RedshiftRunConfigurationOutput {
    /**
     * The ID of the Amazon Web Services account included in the configuration details of the Amazon Redshift data source.
     */
    accountId?: RedshiftRunConfigurationOutputAccountIdString;
    /**
     * The data access role included in the configuration details of the Amazon Redshift data source.
     */
    dataAccessRole?: RedshiftRunConfigurationOutputDataAccessRoleString;
    redshiftCredentialConfiguration: RedshiftCredentialConfiguration;
    redshiftStorage: RedshiftStorage;
    /**
     * The Amazon Web Services region included in the configuration details of the Amazon Redshift data source.
     */
    region?: RedshiftRunConfigurationOutputRegionString;
    /**
     * The relational filger configurations included in the configuration details of the Amazon Redshift data source.
     */
    relationalFilterConfigurations: RelationalFilterConfigurations;
  }
  export type RedshiftRunConfigurationOutputAccountIdString = string;
  export type RedshiftRunConfigurationOutputDataAccessRoleString = string;
  export type RedshiftRunConfigurationOutputRegionString = string;
  export interface RedshiftServerlessStorage {
    /**
     * The name of the Amazon Redshift Serverless workgroup.
     */
    workgroupName: RedshiftServerlessStorageWorkgroupNameString;
  }
  export type RedshiftServerlessStorageWorkgroupNameString = string;
  export interface RedshiftStorage {
    /**
     * The details of the Amazon Redshift cluster source.
     */
    redshiftClusterSource?: RedshiftClusterStorage;
    /**
     * The details of the Amazon Redshift Serverless workgroup source.
     */
    redshiftServerlessSource?: RedshiftServerlessStorage;
  }
  export type RegionName = string;
  export type RegionalParameter = {[key: string]: String};
  export type RegionalParameterMap = {[key: string]: RegionalParameter};
  export interface RejectChoice {
    /**
     * Specifies the the automatically generated business metadata that can be rejected.
     */
    predictionChoices?: PredictionChoices;
    /**
     * Specifies the target (for example, a column name) where a prediction can be rejected.
     */
    predictionTarget?: String;
  }
  export type RejectChoices = RejectChoice[];
  export interface RejectPredictionsInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the prediction.
     */
    identifier: AssetIdentifier;
    /**
     * 
     */
    rejectChoices?: RejectChoices;
    /**
     * 
     */
    rejectRule?: RejectRule;
    /**
     * 
     */
    revision?: Revision;
  }
  export interface RejectPredictionsOutput {
    /**
     * 
     */
    assetId: AssetId;
    /**
     * 
     */
    assetRevision: Revision;
    /**
     * 
     */
    domainId: DomainId;
  }
  export interface RejectRule {
    /**
     * Specifies whether you want to reject the top prediction for all targets or none.
     */
    rule?: RejectRuleBehavior;
    /**
     * The confidence score that specifies the condition at which a prediction can be rejected.
     */
    threshold?: Float;
  }
  export type RejectRuleBehavior = "ALL"|"NONE"|string;
  export interface RejectSubscriptionRequestInput {
    /**
     * The decision comment of the rejected subscription request.
     */
    decisionComment?: DecisionComment;
    /**
     * The identifier of the Amazon DataZone domain in which the subscription request was rejected.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the subscription request that was rejected.
     */
    identifier: SubscriptionRequestId;
  }
  export interface RejectSubscriptionRequestOutput {
    /**
     * The timestamp of when the subscription request was rejected.
     */
    createdAt: CreatedAt;
    /**
     * The timestamp of when the subscription request was rejected.
     */
    createdBy: CreatedBy;
    /**
     * The decision comment of the rejected subscription request.
     */
    decisionComment?: DecisionComment;
    /**
     * The identifier of the Amazon DataZone domain in which the subscription request was rejected.
     */
    domainId: DomainId;
    /**
     * The identifier of the subscription request that was rejected.
     */
    id: SubscriptionRequestId;
    /**
     * The reason for the subscription request.
     */
    requestReason: RequestReason;
    /**
     * The identifier of the subscription request reviewer.
     */
    reviewerId?: String;
    /**
     * The status of the subscription request.
     */
    status: SubscriptionRequestStatus;
    /**
     * The subscribed listings of the subscription request.
     */
    subscribedListings: RejectSubscriptionRequestOutputSubscribedListingsList;
    /**
     * The subscribed principals of the subscription request.
     */
    subscribedPrincipals: RejectSubscriptionRequestOutputSubscribedPrincipalsList;
    /**
     * The timestamp of when the subscription request was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription request.
     */
    updatedBy?: UpdatedBy;
  }
  export type RejectSubscriptionRequestOutputSubscribedListingsList = SubscribedListing[];
  export type RejectSubscriptionRequestOutputSubscribedPrincipalsList = SubscribedPrincipal[];
  export interface RelationalFilterConfiguration {
    /**
     * The database name specified in the relational filter configuration for the data source.
     */
    databaseName: RelationalFilterConfigurationDatabaseNameString;
    /**
     * The filter expressions specified in the relational filter configuration for the data source.
     */
    filterExpressions?: FilterExpressions;
    /**
     * The schema name specified in the relational filter configuration for the data source.
     */
    schemaName?: RelationalFilterConfigurationSchemaNameString;
  }
  export type RelationalFilterConfigurationDatabaseNameString = string;
  export type RelationalFilterConfigurationSchemaNameString = string;
  export type RelationalFilterConfigurations = RelationalFilterConfiguration[];
  export type RequestReason = string;
  export interface Resource {
    /**
     * The name of a provisioned resource of this Amazon DataZone environment.
     */
    name?: String;
    /**
     * The provider of a provisioned resource of this Amazon DataZone environment.
     */
    provider?: String;
    /**
     * The type of a provisioned resource of this Amazon DataZone environment.
     */
    type: String;
    /**
     * The value of a provisioned resource of this Amazon DataZone environment.
     */
    value: String;
  }
  export type ResourceList = Resource[];
  export type Revision = string;
  export interface RevokeSubscriptionInput {
    /**
     * The identifier of the Amazon DataZone domain where you want to revoke a subscription.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the revoked subscription.
     */
    identifier: SubscriptionId;
    /**
     * Specifies whether permissions are retained when the subscription is revoked.
     */
    retainPermissions?: Boolean;
  }
  export interface RevokeSubscriptionOutput {
    /**
     * The timestamp of when the subscription was revoked.
     */
    createdAt: CreatedAt;
    /**
     * The identifier of the user who revoked the subscription.
     */
    createdBy: CreatedBy;
    /**
     * The identifier of the Amazon DataZone domain where you want to revoke a subscription.
     */
    domainId: DomainId;
    /**
     * The identifier of the revoked subscription.
     */
    id: SubscriptionId;
    /**
     * Specifies whether permissions are retained when the subscription is revoked.
     */
    retainPermissions?: Boolean;
    /**
     * The status of the revoked subscription.
     */
    status: SubscriptionStatus;
    /**
     * The subscribed listing of the revoked subscription.
     */
    subscribedListing: SubscribedListing;
    /**
     * The subscribed principal of the revoked subscription.
     */
    subscribedPrincipal: SubscribedPrincipal;
    /**
     * The identifier of the subscription request for the revoked subscription.
     */
    subscriptionRequestId?: SubscriptionRequestId;
    /**
     * The timestamp of when the subscription was revoked.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who revoked the subscription.
     */
    updatedBy?: UpdatedBy;
  }
  export type RoleArn = string;
  export interface RunStatisticsForAssets {
    /**
     * The added statistic for the data source run.
     */
    added?: Integer;
    /**
     * The failed statistic for the data source run.
     */
    failed?: Integer;
    /**
     * The skipped statistic for the data source run.
     */
    skipped?: Integer;
    /**
     * The unchanged statistic for the data source run.
     */
    unchanged?: Integer;
    /**
     * The updated statistic for the data source run.
     */
    updated?: Integer;
  }
  export interface ScheduleConfiguration {
    /**
     * The schedule of the data source runs.
     */
    schedule?: CronString;
    /**
     * The timezone of the data source run. 
     */
    timezone?: Timezone;
  }
  export interface SearchGroupProfilesInput {
    /**
     * The identifier of the Amazon DataZone domain in which you want to search group profiles.
     */
    domainIdentifier: DomainId;
    /**
     * The group type for which to search.
     */
    groupType: GroupSearchType;
    /**
     * The maximum number of results to return in a single call to SearchGroupProfiles. When the number of results to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to SearchGroupProfiles to list the next set of results. 
     */
    maxResults?: MaxResults;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to SearchGroupProfiles to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * Specifies the text for which to search.
     */
    searchText?: GroupSearchText;
  }
  export interface SearchGroupProfilesOutput {
    /**
     * The results of the SearchGroupProfiles action.
     */
    items?: GroupProfileSummaries;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to SearchGroupProfiles to list the next set of results.
     */
    nextToken?: PaginationToken;
  }
  export interface SearchInItem {
    /**
     * The search attribute.
     */
    attribute: Attribute;
  }
  export type SearchInList = SearchInItem[];
  export interface SearchInput {
    /**
     * Specifies additional attributes for the Search action.
     */
    additionalAttributes?: SearchOutputAdditionalAttributes;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    domainIdentifier: DomainId;
    /**
     * Specifies the search filters.
     */
    filters?: FilterClause;
    /**
     * The maximum number of results to return in a single call to Search. When the number of results to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to Search to list the next set of results.
     */
    maxResults?: MaxResults;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to Search to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * The identifier of the owning project specified for the search.
     */
    owningProjectIdentifier?: ProjectId;
    /**
     * 
     */
    searchIn?: SearchInList;
    /**
     * The scope of the search.
     */
    searchScope: InventorySearchScope;
    /**
     * Specifies the text for which to search.
     */
    searchText?: SearchText;
    /**
     * Specifies the way in which the search results are to be sorted.
     */
    sort?: SearchSort;
  }
  export interface SearchInventoryResultItem {
    /**
     * The asset item included in the search results.
     */
    assetItem?: AssetItem;
    /**
     * The data product item included in the search results.
     */
    dataProductItem?: DataProductSummary;
    /**
     * The glossary item included in the search results.
     */
    glossaryItem?: GlossaryItem;
    /**
     * The glossary term item included in the search results.
     */
    glossaryTermItem?: GlossaryTermItem;
  }
  export type SearchInventoryResultItems = SearchInventoryResultItem[];
  export interface SearchListingsInput {
    /**
     * Specifies additional attributes for the search.
     */
    additionalAttributes?: SearchOutputAdditionalAttributes;
    /**
     * The identifier of the domain in which to search listings.
     */
    domainIdentifier: DomainId;
    /**
     * Specifies the filters for the search of listings.
     */
    filters?: FilterClause;
    /**
     * The maximum number of results to return in a single call to SearchListings. When the number of results to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to SearchListings to list the next set of results. 
     */
    maxResults?: MaxResults;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to SearchListings to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * 
     */
    searchIn?: SearchInList;
    /**
     * Specifies the text for which to search.
     */
    searchText?: String;
    /**
     * Specifies the way for sorting the search results.
     */
    sort?: SearchSort;
  }
  export interface SearchListingsOutput {
    /**
     * The results of the SearchListings action.
     */
    items?: SearchResultItems;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to SearchListings to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * Total number of search results.
     */
    totalMatchCount?: Integer;
  }
  export interface SearchOutput {
    /**
     * The results of the Search action.
     */
    items?: SearchInventoryResultItems;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to Search to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * Total number of search results.
     */
    totalMatchCount?: Integer;
  }
  export type SearchOutputAdditionalAttribute = "FORMS"|string;
  export type SearchOutputAdditionalAttributes = SearchOutputAdditionalAttribute[];
  export interface SearchResultItem {
    /**
     * The asset listing included in the results of the SearchListings action.
     */
    assetListing?: AssetListingItem;
  }
  export type SearchResultItems = SearchResultItem[];
  export interface SearchSort {
    /**
     * The attribute detail of the way to sort search results.
     */
    attribute: Attribute;
    /**
     * The order detail of the wya to sort search results.
     */
    order?: SortOrder;
  }
  export type SearchText = string;
  export interface SearchTypesInput {
    /**
     * The identifier of the Amazon DataZone domain in which to invoke the SearchTypes action.
     */
    domainIdentifier: DomainId;
    /**
     * The filters for the SearchTypes action.
     */
    filters?: FilterClause;
    /**
     * 
     */
    managed: Boolean;
    /**
     * The maximum number of results to return in a single call to SearchTypes. When the number of results to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to SearchTypes to list the next set of results. 
     */
    maxResults?: MaxResults;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to SearchTypes to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * 
     */
    searchIn?: SearchInList;
    /**
     * Specifies the scope of the search for types.
     */
    searchScope: TypesSearchScope;
    /**
     * Specifies the text for which to search.
     */
    searchText?: SearchText;
    /**
     * The specifies the way to sort the SearchTypes results.
     */
    sort?: SearchSort;
  }
  export interface SearchTypesOutput {
    /**
     * The results of the SearchTypes action.
     */
    items?: SearchTypesResultItems;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to SearchTypes to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * Total number of search results.
     */
    totalMatchCount?: Integer;
  }
  export interface SearchTypesResultItem {
    /**
     * The asset type included in the results of the SearchTypes action.
     */
    assetTypeItem?: AssetTypeItem;
    /**
     * The form type included in the results of the SearchTypes action.
     */
    formTypeItem?: FormTypeData;
  }
  export type SearchTypesResultItems = SearchTypesResultItem[];
  export interface SearchUserProfilesInput {
    /**
     * The identifier of the Amazon DataZone domain in which you want to search user profiles.
     */
    domainIdentifier: DomainId;
    /**
     * The maximum number of results to return in a single call to SearchUserProfiles. When the number of results to be listed is greater than the value of MaxResults, the response contains a NextToken value that you can use in a subsequent call to SearchUserProfiles to list the next set of results. 
     */
    maxResults?: MaxResults;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to SearchUserProfiles to list the next set of results.
     */
    nextToken?: PaginationToken;
    /**
     * Specifies the text for which to search.
     */
    searchText?: UserSearchText;
    /**
     * Specifies the user type for the SearchUserProfiles action.
     */
    userType: UserSearchType;
  }
  export interface SearchUserProfilesOutput {
    /**
     * The results of the SearchUserProfiles action.
     */
    items?: UserProfileSummaries;
    /**
     * When the number of results is greater than the default value for the MaxResults parameter, or if you explicitly specify a value for MaxResults that is less than the number of results, the response includes a pagination token named NextToken. You can specify this NextToken value in a subsequent call to SearchUserProfiles to list the next set of results.
     */
    nextToken?: PaginationToken;
  }
  export type ShortDescription = string;
  export interface SingleSignOn {
    /**
     * The type of single sign-on in Amazon DataZone.
     */
    type?: AuthType;
    /**
     * The single sign-on user assignment in Amazon DataZone.
     */
    userAssignment?: UserAssignment;
  }
  export type Smithy = string;
  export type SortFieldProject = "NAME"|string;
  export type SortKey = "CREATED_AT"|"UPDATED_AT"|string;
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export interface SsoUserProfileDetails {
    /**
     * The first name included in the single sign-on details of the user profile.
     */
    firstName?: FirstName;
    /**
     * The last name included in the single sign-on details of the user profile.
     */
    lastName?: LastName;
    /**
     * The username included in the single sign-on details of the user profile.
     */
    username?: UserProfileName;
  }
  export interface StartDataSourceRunInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The identifier of the data source.
     */
    dataSourceIdentifier: DataSourceId;
    /**
     * The identifier of the Amazon DataZone domain in which to start a data source run.
     */
    domainIdentifier: DomainId;
  }
  export interface StartDataSourceRunOutput {
    /**
     * The timestamp of when data source run was created.
     */
    createdAt: DateTime;
    /**
     * The configuration snapshot of the data source that is being run.
     */
    dataSourceConfigurationSnapshot?: String;
    /**
     * The identifier of the data source.
     */
    dataSourceId: DataSourceId;
    /**
     * The identifier of the Amazon DataZone domain in which to start a data source run.
     */
    domainId: DomainId;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    errorMessage?: DataSourceErrorMessage;
    /**
     * The identifier of the data source run.
     */
    id: DataSourceRunId;
    /**
     * The identifier of the project.
     */
    projectId: ProjectId;
    /**
     * Specifies run statistics for assets.
     */
    runStatisticsForAssets?: RunStatisticsForAssets;
    /**
     * The timestamp of when the data source run was started.
     */
    startedAt?: DateTime;
    /**
     * The status of the data source run.
     */
    status: DataSourceRunStatus;
    /**
     * The timestamp of when the data source run was stopped.
     */
    stoppedAt?: DateTime;
    /**
     * The type of the data source run.
     */
    type: DataSourceRunType;
    /**
     * The timestamp of when the data source run was updated.
     */
    updatedAt: DateTime;
  }
  export type String = string;
  export interface SubscribedAsset {
    /**
     * The identifier of the asset for which the subscription grant is created.
     */
    assetId: AssetId;
    /**
     * The revision of the asset for which the subscription grant is created.
     */
    assetRevision: Revision;
    /**
     * The failure cause included in the details of the asset for which the subscription grant is created.
     */
    failureCause?: FailureCause;
    /**
     * The failure timestamp included in the details of the asset for which the subscription grant is created.
     */
    failureTimestamp?: Timestamp;
    /**
     * The timestamp of when the subscription grant to the asset is created.
     */
    grantedTimestamp?: Timestamp;
    /**
     * The status of the asset for which the subscription grant is created.
     */
    status: SubscriptionGrantStatus;
    /**
     * The target name of the asset for which the subscription grant is created.
     */
    targetName?: String;
  }
  export interface SubscribedAssetListing {
    /**
     * The identifier of the published asset for which the subscription grant is created.
     */
    entityId?: AssetId;
    /**
     * The revision of the published asset for which the subscription grant is created.
     */
    entityRevision?: Revision;
    /**
     * The type of the published asset for which the subscription grant is created.
     */
    entityType?: TypeName;
    /**
     * The forms attached to the published asset for which the subscription grant is created.
     */
    forms?: Forms;
    /**
     * The glossary terms attached to the published asset for which the subscription grant is created.
     */
    glossaryTerms?: DetailedGlossaryTerms;
  }
  export type SubscribedAssets = SubscribedAsset[];
  export interface SubscribedListing {
    /**
     * The description of the published asset for which the subscription grant is created.
     */
    description: Description;
    /**
     * The identifier of the published asset for which the subscription grant is created.
     */
    id: ListingId;
    /**
     * The published asset for which the subscription grant is created.
     */
    item: SubscribedListingItem;
    /**
     * The name of the published asset for which the subscription grant is created.
     */
    name: ListingName;
    /**
     * The identifier of the project of the published asset for which the subscription grant is created.
     */
    ownerProjectId: ProjectId;
    /**
     * The name of the project that owns the published asset for which the subscription grant is created.
     */
    ownerProjectName?: String;
    /**
     * The revision of the published asset for which the subscription grant is created.
     */
    revision?: Revision;
  }
  export interface SubscribedListingInput {
    /**
     * The identifier of the published asset for which the subscription grant is to be created.
     */
    identifier: ListingId;
  }
  export type SubscribedListingInputs = SubscribedListingInput[];
  export interface SubscribedListingItem {
    /**
     * The asset for which the subscription grant is created.
     */
    assetListing?: SubscribedAssetListing;
  }
  export interface SubscribedPrincipal {
    /**
     * The project that has the subscription grant.
     */
    project?: SubscribedProject;
  }
  export interface SubscribedPrincipalInput {
    /**
     * The project that is to be given a subscription grant.
     */
    project?: SubscribedProjectInput;
  }
  export type SubscribedPrincipalInputs = SubscribedPrincipalInput[];
  export interface SubscribedProject {
    /**
     * The identifier of the project that has the subscription grant.
     */
    id?: ProjectId;
    /**
     * The name of the project that has the subscription grant.
     */
    name?: ProjectName;
  }
  export interface SubscribedProjectInput {
    /**
     * The identifier of the project that is to be given a subscription grant.
     */
    identifier?: ProjectId;
  }
  export type SubscriptionGrantId = string;
  export type SubscriptionGrantOverallStatus = "PENDING"|"IN_PROGRESS"|"GRANT_FAILED"|"REVOKE_FAILED"|"GRANT_AND_REVOKE_FAILED"|"COMPLETED"|"INACCESSIBLE"|string;
  export type SubscriptionGrantStatus = "GRANT_PENDING"|"REVOKE_PENDING"|"GRANT_IN_PROGRESS"|"REVOKE_IN_PROGRESS"|"GRANTED"|"REVOKED"|"GRANT_FAILED"|"REVOKE_FAILED"|string;
  export interface SubscriptionGrantSummary {
    /**
     * The assets included in the subscription grant.
     */
    assets?: SubscribedAssets;
    /**
     * The timestamp of when a subscription grant was created.
     */
    createdAt: CreatedAt;
    /**
     * The datazone user who created the subscription grant.
     */
    createdBy: CreatedBy;
    /**
     * The identifier of the Amazon DataZone domain in which a subscription grant exists.
     */
    domainId: DomainId;
    /**
     * The entity to which the subscription is granted.
     */
    grantedEntity: GrantedEntity;
    /**
     * The identifier of the subscription grant.
     */
    id: SubscriptionGrantId;
    /**
     * The status of the subscription grant.
     */
    status: SubscriptionGrantOverallStatus;
    /**
     * The ID of the subscription grant.
     */
    subscriptionId?: SubscriptionId;
    /**
     * The identifier of the target of the subscription grant.
     */
    subscriptionTargetId: SubscriptionTargetId;
    /**
     * The timestampf of when the subscription grant was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription grant.
     */
    updatedBy?: UpdatedBy;
  }
  export type SubscriptionGrants = SubscriptionGrantSummary[];
  export type SubscriptionId = string;
  export type SubscriptionRequestId = string;
  export type SubscriptionRequestStatus = "PENDING"|"ACCEPTED"|"REJECTED"|string;
  export interface SubscriptionRequestSummary {
    /**
     * The timestamp of when a subscription request was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription request.
     */
    createdBy: CreatedBy;
    /**
     * The decision comment of the subscription request.
     */
    decisionComment?: DecisionComment;
    /**
     * The identifier of the Amazon DataZone domain in which a subscription request exists.
     */
    domainId: DomainId;
    /**
     * The identifier of the subscription request.
     */
    id: SubscriptionRequestId;
    /**
     * The reason for the subscription request.
     */
    requestReason: RequestReason;
    /**
     * The identifier of the subscription request reviewer.
     */
    reviewerId?: String;
    /**
     * The status of the subscription request.
     */
    status: SubscriptionRequestStatus;
    /**
     * The listings included in the subscription request.
     */
    subscribedListings: SubscriptionRequestSummarySubscribedListingsList;
    /**
     * The principals included in the subscription request. 
     */
    subscribedPrincipals: SubscriptionRequestSummarySubscribedPrincipalsList;
    /**
     * The timestamp of when the subscription request was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The identifier of the Amazon DataZone user who updated the subscription request.
     */
    updatedBy?: UpdatedBy;
  }
  export type SubscriptionRequestSummarySubscribedListingsList = SubscribedListing[];
  export type SubscriptionRequestSummarySubscribedPrincipalsList = SubscribedPrincipal[];
  export type SubscriptionRequests = SubscriptionRequestSummary[];
  export type SubscriptionStatus = "APPROVED"|"REVOKED"|"CANCELLED"|string;
  export interface SubscriptionSummary {
    /**
     * The timestamp of when the subscription was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription.
     */
    createdBy: CreatedBy;
    /**
     * The identifier of the Amazon DataZone domain in which a subscription exists.
     */
    domainId: DomainId;
    /**
     * The identifier of the subscription.
     */
    id: SubscriptionId;
    /**
     * The retain permissions included in the subscription.
     */
    retainPermissions?: Boolean;
    /**
     * The status of the subscription.
     */
    status: SubscriptionStatus;
    /**
     * The listing included in the subscription.
     */
    subscribedListing: SubscribedListing;
    /**
     * The principal included in the subscription.
     */
    subscribedPrincipal: SubscribedPrincipal;
    /**
     * The identifier of the subscription request for the subscription.
     */
    subscriptionRequestId?: SubscriptionRequestId;
    /**
     * The timestamp of when the subscription was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription.
     */
    updatedBy?: UpdatedBy;
  }
  export interface SubscriptionTargetForm {
    /**
     * The content of the subscription target configuration.
     */
    content: String;
    /**
     * The form name included in the subscription target configuration.
     */
    formName: FormName;
  }
  export type SubscriptionTargetForms = SubscriptionTargetForm[];
  export type SubscriptionTargetId = string;
  export type SubscriptionTargetName = string;
  export interface SubscriptionTargetSummary {
    /**
     * The asset types included in the subscription target.
     */
    applicableAssetTypes: ApplicableAssetTypes;
    /**
     * The authorized principals included in the subscription target.
     */
    authorizedPrincipals: AuthorizedPrincipalIdentifiers;
    /**
     * The timestamp of when the subscription target was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription target.
     */
    createdBy: CreatedBy;
    /**
     * The identifier of the Amazon DataZone domain in which the subscription target exists.
     */
    domainId: DomainId;
    /**
     * The identifier of the environment of the subscription target.
     */
    environmentId: EnvironmentId;
    /**
     * The identifier of the subscription target.
     */
    id: SubscriptionTargetId;
    /**
     * The manage access role specified in the subscription target.
     */
    manageAccessRole: String;
    /**
     * The name of the subscription target.
     */
    name: SubscriptionTargetName;
    /**
     * The identifier of the project specified in the subscription target.
     */
    projectId: ProjectId;
    /**
     * The provider of the subscription target.
     */
    provider: String;
    /**
     * The configuration of the subscription target.
     */
    subscriptionTargetConfig: SubscriptionTargetForms;
    /**
     * The type of the subscription target.
     */
    type: String;
    /**
     * The timestamp of when the subscription target was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription target.
     */
    updatedBy?: UpdatedBy;
  }
  export type SubscriptionTargets = SubscriptionTargetSummary[];
  export type Subscriptions = SubscriptionSummary[];
  export type SyntheticTimestamp_date_time = Date;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource to be tagged in Amazon DataZone.
     */
    resourceArn: String;
    /**
     * Specifies the tags for the TagResource action.
     */
    tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export type TaskId = string;
  export type TaskStatus = "ACTIVE"|"INACTIVE"|string;
  export interface TermRelations {
    /**
     * The classifies of the term relations.
     */
    classifies?: TermRelationsClassifiesList;
    /**
     * The isA property of the term relations.
     */
    isA?: TermRelationsIsAList;
  }
  export type TermRelationsClassifiesList = GlossaryTermId[];
  export type TermRelationsIsAList = GlossaryTermId[];
  export type Timestamp = Date;
  export type Timezone = "UTC"|"AFRICA_JOHANNESBURG"|"AMERICA_MONTREAL"|"AMERICA_SAO_PAULO"|"ASIA_BAHRAIN"|"ASIA_BANGKOK"|"ASIA_CALCUTTA"|"ASIA_DUBAI"|"ASIA_HONG_KONG"|"ASIA_JAKARTA"|"ASIA_KUALA_LUMPUR"|"ASIA_SEOUL"|"ASIA_SHANGHAI"|"ASIA_SINGAPORE"|"ASIA_TAIPEI"|"ASIA_TOKYO"|"AUSTRALIA_MELBOURNE"|"AUSTRALIA_SYDNEY"|"CANADA_CENTRAL"|"CET"|"CST6CDT"|"ETC_GMT"|"ETC_GMT0"|"ETC_GMT_ADD_0"|"ETC_GMT_ADD_1"|"ETC_GMT_ADD_10"|"ETC_GMT_ADD_11"|"ETC_GMT_ADD_12"|"ETC_GMT_ADD_2"|"ETC_GMT_ADD_3"|"ETC_GMT_ADD_4"|"ETC_GMT_ADD_5"|"ETC_GMT_ADD_6"|"ETC_GMT_ADD_7"|"ETC_GMT_ADD_8"|"ETC_GMT_ADD_9"|"ETC_GMT_NEG_0"|"ETC_GMT_NEG_1"|"ETC_GMT_NEG_10"|"ETC_GMT_NEG_11"|"ETC_GMT_NEG_12"|"ETC_GMT_NEG_13"|"ETC_GMT_NEG_14"|"ETC_GMT_NEG_2"|"ETC_GMT_NEG_3"|"ETC_GMT_NEG_4"|"ETC_GMT_NEG_5"|"ETC_GMT_NEG_6"|"ETC_GMT_NEG_7"|"ETC_GMT_NEG_8"|"ETC_GMT_NEG_9"|"EUROPE_DUBLIN"|"EUROPE_LONDON"|"EUROPE_PARIS"|"EUROPE_STOCKHOLM"|"EUROPE_ZURICH"|"ISRAEL"|"MEXICO_GENERAL"|"MST7MDT"|"PACIFIC_AUCKLAND"|"US_CENTRAL"|"US_EASTERN"|"US_MOUNTAIN"|"US_PACIFIC"|string;
  export type Title = string;
  export interface Topic {
    resource: NotificationResource;
    /**
     * The role of the resource mentioned in a notification.
     */
    role: NotificationRole;
    /**
     * The subject of the resource mentioned in a notification.
     */
    subject: String;
  }
  export type TypeName = string;
  export type TypesSearchScope = "ASSET_TYPE"|"FORM_TYPE"|string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource to be untagged in Amazon DataZone.
     */
    resourceArn: String;
    /**
     * Specifies the tag keys for the UntagResource action.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDataSourceInput {
    /**
     * The asset forms to be updated as part of the UpdateDataSource action.
     */
    assetFormsInput?: FormInputList;
    /**
     * The configuration to be updated as part of the UpdateDataSource action.
     */
    configuration?: DataSourceConfigurationInput;
    /**
     * The description to be updated as part of the UpdateDataSource action.
     */
    description?: Description;
    /**
     * The identifier of the domain in which to update a data source.
     */
    domainIdentifier: DomainId;
    /**
     * The enable setting to be updated as part of the UpdateDataSource action.
     */
    enableSetting?: EnableSetting;
    /**
     * The identifier of the data source to be updated.
     */
    identifier: DataSourceId;
    /**
     * The name to be updated as part of the UpdateDataSource action.
     */
    name?: Name;
    /**
     * The publish on import setting to be updated as part of the UpdateDataSource action.
     */
    publishOnImport?: Boolean;
    /**
     * The recommendation to be updated as part of the UpdateDataSource action.
     */
    recommendation?: RecommendationConfiguration;
    /**
     * The schedule to be updated as part of the UpdateDataSource action.
     */
    schedule?: ScheduleConfiguration;
  }
  export interface UpdateDataSourceOutput {
    /**
     * The asset forms to be updated as part of the UpdateDataSource action.
     */
    assetFormsOutput?: FormOutputList;
    /**
     * The configuration to be updated as part of the UpdateDataSource action.
     */
    configuration?: DataSourceConfigurationOutput;
    /**
     * The timestamp of when the data source was updated.
     */
    createdAt?: DateTime;
    /**
     * The description to be updated as part of the UpdateDataSource action.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which a data source is to be updated.
     */
    domainId: DomainId;
    /**
     * The enable setting to be updated as part of the UpdateDataSource action.
     */
    enableSetting?: EnableSetting;
    /**
     * The identifier of the environment in which a data source is to be updated.
     */
    environmentId: EnvironmentId;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    errorMessage?: DataSourceErrorMessage;
    /**
     * The identifier of the data source to be updated.
     */
    id: DataSourceId;
    /**
     * The timestamp of when the data source was last run.
     */
    lastRunAt?: DateTime;
    /**
     * The last run error message of the data source.
     */
    lastRunErrorMessage?: DataSourceErrorMessage;
    /**
     * The last run status of the data source.
     */
    lastRunStatus?: DataSourceRunStatus;
    /**
     * The name to be updated as part of the UpdateDataSource action.
     */
    name: Name;
    /**
     * The identifier of the project where data source is to be updated.
     */
    projectId: ProjectId;
    /**
     * The publish on import setting to be updated as part of the UpdateDataSource action.
     */
    publishOnImport?: Boolean;
    /**
     * The recommendation to be updated as part of the UpdateDataSource action.
     */
    recommendation?: RecommendationConfiguration;
    /**
     * The schedule to be updated as part of the UpdateDataSource action.
     */
    schedule?: ScheduleConfiguration;
    /**
     * The status to be updated as part of the UpdateDataSource action.
     */
    status?: DataSourceStatus;
    /**
     * The type to be updated as part of the UpdateDataSource action.
     */
    type?: DataSourceType;
    /**
     * The timestamp of when the data source was updated.
     */
    updatedAt?: DateTime;
  }
  export interface UpdateDomainInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: String;
    /**
     * The description to be updated as part of the UpdateDomain action.
     */
    description?: String;
    /**
     * The domain execution role to be updated as part of the UpdateDomain action.
     */
    domainExecutionRole?: RoleArn;
    /**
     * The ID of the Amazon Web Services domain that is to be updated.
     */
    identifier: DomainId;
    /**
     * The name to be updated as part of the UpdateDomain action.
     */
    name?: String;
    /**
     * The single sign-on option to be updated as part of the UpdateDomain action.
     */
    singleSignOn?: SingleSignOn;
  }
  export interface UpdateDomainOutput {
    /**
     * The description to be updated as part of the UpdateDomain action.
     */
    description?: String;
    /**
     * The domain execution role to be updated as part of the UpdateDomain action.
     */
    domainExecutionRole?: RoleArn;
    /**
     * The identifier of the Amazon DataZone domain.
     */
    id: DomainId;
    /**
     * Specifies the timestamp of when the domain was last updated.
     */
    lastUpdatedAt?: UpdatedAt;
    /**
     * The name to be updated as part of the UpdateDomain action.
     */
    name?: String;
    /**
     * The single sign-on option of the Amazon DataZone domain.
     */
    singleSignOn?: SingleSignOn;
  }
  export interface UpdateEnvironmentInput {
    /**
     * The description to be updated as part of the UpdateEnvironment action.
     */
    description?: String;
    /**
     * The identifier of the domain in which the environment is to be updated.
     */
    domainIdentifier: DomainId;
    /**
     * The glossary terms to be updated as part of the UpdateEnvironment action.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The identifier of the environment that is to be updated.
     */
    identifier: EnvironmentId;
    /**
     * The name to be updated as part of the UpdateEnvironment action.
     */
    name?: String;
  }
  export interface UpdateEnvironmentOutput {
    /**
     * The identifier of the Amazon Web Services account in which the environment is to be updated.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services Region in which the environment is updated.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The timestamp of when the environment was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the environment.
     */
    createdBy: String;
    /**
     * The deployment properties to be updated as part of the UpdateEnvironment action.
     */
    deploymentProperties?: DeploymentProperties;
    /**
     * The description to be updated as part of the UpdateEnvironment action.
     */
    description?: Description;
    /**
     * The identifier of the domain in which the environment is to be updated.
     */
    domainId: DomainId;
    /**
     * The environment actions to be updated as part of the UpdateEnvironment action.
     */
    environmentActions?: EnvironmentActionList;
    /**
     * The blueprint identifier of the environment.
     */
    environmentBlueprintId?: EnvironmentBlueprintId;
    /**
     * The profile identifier of the environment.
     */
    environmentProfileId: EnvironmentProfileId;
    /**
     * The glossary terms to be updated as part of the UpdateEnvironment action.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The identifier of the environment that is to be updated.
     */
    id?: EnvironmentId;
    /**
     * The last deployment of the environment.
     */
    lastDeployment?: Deployment;
    /**
     * The name to be updated as part of the UpdateEnvironment action.
     */
    name: EnvironmentName;
    /**
     * The project identifier of the environment.
     */
    projectId: ProjectId;
    /**
     * The provider identifier of the environment.
     */
    provider: String;
    /**
     * The provisioned resources to be updated as part of the UpdateEnvironment action.
     */
    provisionedResources?: ResourceList;
    /**
     * The provisioning properties to be updated as part of the UpdateEnvironment action.
     */
    provisioningProperties?: ProvisioningProperties;
    /**
     * The status to be updated as part of the UpdateEnvironment action.
     */
    status?: EnvironmentStatus;
    /**
     * The timestamp of when the environment was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The user parameters to be updated as part of the UpdateEnvironment action.
     */
    userParameters?: CustomParameterList;
  }
  export interface UpdateEnvironmentProfileInput {
    /**
     * The Amazon Web Services account in which a specified environment profile is to be udpated.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services Region in which a specified environment profile is to be updated.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The description to be updated as part of the UpdateEnvironmentProfile action.
     */
    description?: String;
    /**
     * The identifier of the Amazon DataZone domain in which an environment profile is to be updated.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the environment profile that is to be updated.
     */
    identifier: EnvironmentProfileId;
    /**
     * The name to be updated as part of the UpdateEnvironmentProfile action.
     */
    name?: EnvironmentProfileName;
    /**
     * The user parameters to be updated as part of the UpdateEnvironmentProfile action.
     */
    userParameters?: EnvironmentParametersList;
  }
  export interface UpdateEnvironmentProfileOutput {
    /**
     * The Amazon Web Services account in which a specified environment profile is to be udpated.
     */
    awsAccountId?: AwsAccountId;
    /**
     * The Amazon Web Services Region in which a specified environment profile is to be updated.
     */
    awsAccountRegion?: AwsRegion;
    /**
     * The timestamp of when the environment profile was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the environment profile.
     */
    createdBy: String;
    /**
     * The description to be updated as part of the UpdateEnvironmentProfile action.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which the environment profile is to be updated.
     */
    domainId: DomainId;
    /**
     * The identifier of the blueprint of the environment profile that is to be updated.
     */
    environmentBlueprintId: EnvironmentBlueprintId;
    /**
     * The identifier of the environment profile that is to be udpated.
     */
    id: EnvironmentProfileId;
    /**
     * The name to be updated as part of the UpdateEnvironmentProfile action.
     */
    name: EnvironmentProfileName;
    /**
     * The identifier of the project of the environment profile that is to be updated.
     */
    projectId?: ProjectId;
    /**
     * The timestamp of when the environment profile was updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The user parameters to be updated as part of the UpdateEnvironmentProfile action.
     */
    userParameters?: CustomParameterList;
  }
  export interface UpdateGlossaryInput {
    /**
     * A unique, case-sensitive identifier that is provided to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The description to be updated as part of the UpdateGlossary action.
     */
    description?: GlossaryDescription;
    /**
     * The identifier of the Amazon DataZone domain in which a business glossary is to be updated.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the business glossary to be updated.
     */
    identifier: GlossaryId;
    /**
     * The name to be updated as part of the UpdateGlossary action.
     */
    name?: GlossaryName;
    /**
     * The status to be updated as part of the UpdateGlossary action.
     */
    status?: GlossaryStatus;
  }
  export interface UpdateGlossaryOutput {
    /**
     * The description to be updated as part of the UpdateGlossary action.
     */
    description?: GlossaryDescription;
    /**
     * The identifier of the Amazon DataZone domain in which a business glossary is to be updated.
     */
    domainId: DomainId;
    /**
     * The identifier of the business glossary that is to be updated.
     */
    id: GlossaryId;
    /**
     * The name to be updated as part of the UpdateGlossary action.
     */
    name: GlossaryName;
    /**
     * The identifier of the project in which to update a business glossary.
     */
    owningProjectId: ProjectId;
    /**
     * The status to be updated as part of the UpdateGlossary action.
     */
    status?: GlossaryStatus;
  }
  export interface UpdateGlossaryTermInput {
    /**
     * The identifier of the Amazon DataZone domain in which a business glossary term is to be updated.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the business glossary in which a term is to be updated.
     */
    glossaryIdentifier?: GlossaryTermId;
    /**
     * The identifier of the business glossary term that is to be updated.
     */
    identifier: GlossaryTermId;
    /**
     * The long description to be updated as part of the UpdateGlossaryTerm action.
     */
    longDescription?: LongDescription;
    /**
     * The name to be updated as part of the UpdateGlossaryTerm action.
     */
    name?: GlossaryTermName;
    /**
     * The short description to be updated as part of the UpdateGlossaryTerm action.
     */
    shortDescription?: ShortDescription;
    /**
     * The status to be updated as part of the UpdateGlossaryTerm action.
     */
    status?: GlossaryTermStatus;
    /**
     * The term relations to be updated as part of the UpdateGlossaryTerm action.
     */
    termRelations?: TermRelations;
  }
  export interface UpdateGlossaryTermOutput {
    /**
     * The identifier of the Amazon DataZone domain in which a business glossary term is to be updated.
     */
    domainId: DomainId;
    /**
     * The identifier of the business glossary in which a term is to be updated.
     */
    glossaryId: GlossaryId;
    /**
     * The identifier of the business glossary term that is to be updated.
     */
    id: GlossaryTermId;
    /**
     * The long description to be updated as part of the UpdateGlossaryTerm action.
     */
    longDescription?: LongDescription;
    /**
     * The name to be updated as part of the UpdateGlossaryTerm action.
     */
    name: GlossaryTermName;
    /**
     * The short description to be updated as part of the UpdateGlossaryTerm action.
     */
    shortDescription?: ShortDescription;
    /**
     * The status to be updated as part of the UpdateGlossaryTerm action.
     */
    status: GlossaryTermStatus;
    /**
     * The term relations to be updated as part of the UpdateGlossaryTerm action.
     */
    termRelations?: TermRelations;
  }
  export interface UpdateGroupProfileInput {
    /**
     * The identifier of the Amazon DataZone domain in which a group profile is updated.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the group profile that is updated.
     */
    groupIdentifier: GroupIdentifier;
    /**
     * The status of the group profile that is updated.
     */
    status: GroupProfileStatus;
  }
  export interface UpdateGroupProfileOutput {
    /**
     * The identifier of the Amazon DataZone domain in which a group profile is updated.
     */
    domainId?: DomainId;
    /**
     * The name of the group profile that is updated.
     */
    groupName?: GroupProfileName;
    /**
     * The identifier of the group profile that is updated.
     */
    id?: GroupProfileId;
    /**
     * The status of the group profile that is updated.
     */
    status?: GroupProfileStatus;
  }
  export interface UpdateProjectInput {
    /**
     * The description to be updated as part of the UpdateProject action.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which a project is to be updated.
     */
    domainIdentifier: DomainId;
    /**
     * The glossary terms to be updated as part of the UpdateProject action.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The identifier of the project that is to be updated.
     */
    identifier: ProjectId;
    /**
     * The name to be updated as part of the UpdateProject action.
     */
    name?: ProjectName;
  }
  export interface UpdateProjectOutput {
    /**
     * The timestamp of when the project was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon DataZone user who created the project.
     */
    createdBy: CreatedBy;
    /**
     * The description of the project that is to be updated.
     */
    description?: Description;
    /**
     * The identifier of the Amazon DataZone domain in which a project is updated.
     */
    domainId: DomainId;
    /**
     * The glossary terms of the project that are to be updated.
     */
    glossaryTerms?: GlossaryTerms;
    /**
     * The identifier of the project that is to be updated.
     */
    id: ProjectId;
    /**
     * The timestamp of when the project was last updated.
     */
    lastUpdatedAt?: SyntheticTimestamp_date_time;
    /**
     * The name of the project that is to be updated.
     */
    name: ProjectName;
  }
  export interface UpdateSubscriptionGrantStatusInput {
    /**
     * The identifier of the asset the subscription grant status of which is to be updated.
     */
    assetIdentifier: AssetId;
    /**
     * The identifier of the Amazon DataZone domain in which a subscription grant status is to be updated.
     */
    domainIdentifier: DomainId;
    /**
     * Specifies the error message that is returned if the operation cannot be successfully completed.
     */
    failureCause?: FailureCause;
    /**
     * The identifier of the subscription grant the status of which is to be updated.
     */
    identifier: SubscriptionGrantId;
    /**
     * The status to be updated as part of the UpdateSubscriptionGrantStatus action.
     */
    status: SubscriptionGrantStatus;
    /**
     * The target name to be updated as part of the UpdateSubscriptionGrantStatus action.
     */
    targetName?: String;
  }
  export interface UpdateSubscriptionGrantStatusOutput {
    /**
     * 
     */
    assets?: SubscribedAssets;
    /**
     * The timestamp of when the subscription grant status was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone domain user who created the subscription grant status.
     */
    createdBy: CreatedBy;
    /**
     * The identifier of the Amazon DataZone domain in which a subscription grant status is to be updated.
     */
    domainId: DomainId;
    /**
     * The granted entity to be updated as part of the UpdateSubscriptionGrantStatus action.
     */
    grantedEntity: GrantedEntity;
    /**
     * The identifier of the subscription grant.
     */
    id: SubscriptionGrantId;
    /**
     * The status to be updated as part of the UpdateSubscriptionGrantStatus action.
     */
    status: SubscriptionGrantOverallStatus;
    /**
     * The identifier of the subscription.
     */
    subscriptionId?: SubscriptionId;
    /**
     * The identifier of the subscription target whose subscription grant status is to be updated.
     */
    subscriptionTargetId: SubscriptionTargetId;
    /**
     * The timestamp of when the subscription grant status is to be updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription grant status.
     */
    updatedBy?: UpdatedBy;
  }
  export interface UpdateSubscriptionRequestInput {
    /**
     * The identifier of the Amazon DataZone domain in which a subscription request is to be updated.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the subscription request that is to be updated.
     */
    identifier: SubscriptionRequestId;
    /**
     * The reason for the UpdateSubscriptionRequest action.
     */
    requestReason: RequestReason;
  }
  export interface UpdateSubscriptionRequestOutput {
    /**
     * The timestamp of when the subscription request was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription request.
     */
    createdBy: CreatedBy;
    /**
     * The decision comment of the UpdateSubscriptionRequest action.
     */
    decisionComment?: DecisionComment;
    /**
     * The identifier of the Amazon DataZone domain in which a subscription request is to be updated.
     */
    domainId: DomainId;
    /**
     * The identifier of the subscription request that is to be updated.
     */
    id: SubscriptionRequestId;
    /**
     * The reason for the UpdateSubscriptionRequest action.
     */
    requestReason: RequestReason;
    /**
     * The identifier of the Amazon DataZone user who reviews the subscription request.
     */
    reviewerId?: String;
    /**
     * The status of the subscription request.
     */
    status: SubscriptionRequestStatus;
    /**
     * The subscribed listings of the subscription request.
     */
    subscribedListings: UpdateSubscriptionRequestOutputSubscribedListingsList;
    /**
     * The subscribed principals of the subscription request.
     */
    subscribedPrincipals: UpdateSubscriptionRequestOutputSubscribedPrincipalsList;
    /**
     * The timestamp of when the subscription request was updated.
     */
    updatedAt: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription request.
     */
    updatedBy?: UpdatedBy;
  }
  export type UpdateSubscriptionRequestOutputSubscribedListingsList = SubscribedListing[];
  export type UpdateSubscriptionRequestOutputSubscribedPrincipalsList = SubscribedPrincipal[];
  export interface UpdateSubscriptionTargetInput {
    /**
     * The applicable asset types to be updated as part of the UpdateSubscriptionTarget action.
     */
    applicableAssetTypes?: ApplicableAssetTypes;
    /**
     * The authorized principals to be updated as part of the UpdateSubscriptionTarget action.
     */
    authorizedPrincipals?: AuthorizedPrincipalIdentifiers;
    /**
     * The identifier of the Amazon DataZone domain in which a subscription target is to be updated.
     */
    domainIdentifier: DomainId;
    /**
     * The identifier of the environment in which a subscription target is to be updated.
     */
    environmentIdentifier: EnvironmentId;
    /**
     * Identifier of the subscription target that is to be updated.
     */
    identifier: SubscriptionTargetId;
    /**
     * The manage access role to be updated as part of the UpdateSubscriptionTarget action.
     */
    manageAccessRole?: String;
    /**
     * The name to be updated as part of the UpdateSubscriptionTarget action.
     */
    name?: SubscriptionTargetName;
    /**
     * The provider to be updated as part of the UpdateSubscriptionTarget action.
     */
    provider?: String;
    /**
     * The configuration to be updated as part of the UpdateSubscriptionTarget action.
     */
    subscriptionTargetConfig?: SubscriptionTargetForms;
  }
  export interface UpdateSubscriptionTargetOutput {
    /**
     * The applicable asset types to be updated as part of the UpdateSubscriptionTarget action.
     */
    applicableAssetTypes: ApplicableAssetTypes;
    /**
     * The authorized principals to be updated as part of the UpdateSubscriptionTarget action.
     */
    authorizedPrincipals: AuthorizedPrincipalIdentifiers;
    /**
     * The timestamp of when a subscription target was created.
     */
    createdAt: CreatedAt;
    /**
     * The Amazon DataZone user who created the subscription target.
     */
    createdBy: CreatedBy;
    /**
     * The identifier of the Amazon DataZone domain in which a subscription target is to be updated.
     */
    domainId: DomainId;
    /**
     * The identifier of the environment in which a subscription target is to be updated.
     */
    environmentId: EnvironmentId;
    /**
     * Identifier of the subscription target that is to be updated.
     */
    id: SubscriptionTargetId;
    /**
     * The manage access role to be updated as part of the UpdateSubscriptionTarget action.
     */
    manageAccessRole: String;
    /**
     * The name to be updated as part of the UpdateSubscriptionTarget action.
     */
    name: SubscriptionTargetName;
    /**
     * The identifier of the project in which a subscription target is to be updated.
     */
    projectId: ProjectId;
    /**
     * The provider to be updated as part of the UpdateSubscriptionTarget action.
     */
    provider: String;
    /**
     * The configuration to be updated as part of the UpdateSubscriptionTarget action.
     */
    subscriptionTargetConfig: SubscriptionTargetForms;
    /**
     * The type to be updated as part of the UpdateSubscriptionTarget action.
     */
    type: String;
    /**
     * The timestamp of when the subscription target was updated.
     */
    updatedAt?: UpdatedAt;
    /**
     * The Amazon DataZone user who updated the subscription target.
     */
    updatedBy?: UpdatedBy;
  }
  export interface UpdateUserProfileInput {
    /**
     * The identifier of the Amazon DataZone domain in which a user profile is updated.
     */
    domainIdentifier: DomainId;
    /**
     * The status of the user profile that are to be updated.
     */
    status: UserProfileStatus;
    /**
     * The type of the user profile that are to be updated.
     */
    type?: UserProfileType;
    /**
     * The identifier of the user whose user profile is to be updated.
     */
    userIdentifier: UserIdentifier;
  }
  export interface UpdateUserProfileOutput {
    details?: UserProfileDetails;
    /**
     * The identifier of the Amazon DataZone domain in which a user profile is updated.
     */
    domainId?: DomainId;
    /**
     * The identifier of the user profile.
     */
    id?: UserProfileId;
    /**
     * The status of the user profile.
     */
    status?: UserProfileStatus;
    /**
     * The type of the user profile.
     */
    type?: UserProfileType;
  }
  export type UpdatedAt = Date;
  export type UpdatedBy = string;
  export type UserAssignment = "AUTOMATIC"|"MANUAL"|string;
  export type UserDesignation = "PROJECT_OWNER"|"PROJECT_CONTRIBUTOR"|string;
  export interface UserDetails {
    /**
     * The identifier of the Amazon DataZone user.
     */
    userId: String;
  }
  export type UserIdentifier = string;
  export interface UserProfileDetails {
    /**
     * The IAM details included in the user profile details.
     */
    iam?: IamUserProfileDetails;
    /**
     * The single sign-on details included in the user profile details.
     */
    sso?: SsoUserProfileDetails;
  }
  export type UserProfileId = string;
  export type UserProfileName = string;
  export type UserProfileStatus = "ASSIGNED"|"NOT_ASSIGNED"|"ACTIVATED"|"DEACTIVATED"|string;
  export type UserProfileSummaries = UserProfileSummary[];
  export interface UserProfileSummary {
    /**
     * The details of the user profile.
     */
    details?: UserProfileDetails;
    /**
     * The ID of the Amazon DataZone domain of the user profile.
     */
    domainId?: DomainId;
    /**
     * The ID of the user profile.
     */
    id?: UserProfileId;
    /**
     * The status of the user profile.
     */
    status?: UserProfileStatus;
    /**
     * The type of the user profile.
     */
    type?: UserProfileType;
  }
  export type UserProfileType = "IAM"|"SSO"|string;
  export type UserSearchText = string;
  export type UserSearchType = "SSO_USER"|"DATAZONE_USER"|"DATAZONE_SSO_USER"|"DATAZONE_IAM_USER"|string;
  export type UserType = "IAM_USER"|"IAM_ROLE"|"SSO_USER"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the DataZone client.
   */
  export import Types = DataZone;
}
export = DataZone;
