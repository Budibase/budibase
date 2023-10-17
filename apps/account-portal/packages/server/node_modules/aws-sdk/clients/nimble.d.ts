import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Nimble extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Nimble.Types.ClientConfiguration)
  config: Config & Nimble.Types.ClientConfiguration;
  /**
   * Accept EULAs.
   */
  acceptEulas(params: Nimble.Types.AcceptEulasRequest, callback?: (err: AWSError, data: Nimble.Types.AcceptEulasResponse) => void): Request<Nimble.Types.AcceptEulasResponse, AWSError>;
  /**
   * Accept EULAs.
   */
  acceptEulas(callback?: (err: AWSError, data: Nimble.Types.AcceptEulasResponse) => void): Request<Nimble.Types.AcceptEulasResponse, AWSError>;
  /**
   * Create a launch profile.
   */
  createLaunchProfile(params: Nimble.Types.CreateLaunchProfileRequest, callback?: (err: AWSError, data: Nimble.Types.CreateLaunchProfileResponse) => void): Request<Nimble.Types.CreateLaunchProfileResponse, AWSError>;
  /**
   * Create a launch profile.
   */
  createLaunchProfile(callback?: (err: AWSError, data: Nimble.Types.CreateLaunchProfileResponse) => void): Request<Nimble.Types.CreateLaunchProfileResponse, AWSError>;
  /**
   * Creates a streaming image resource in a studio.
   */
  createStreamingImage(params: Nimble.Types.CreateStreamingImageRequest, callback?: (err: AWSError, data: Nimble.Types.CreateStreamingImageResponse) => void): Request<Nimble.Types.CreateStreamingImageResponse, AWSError>;
  /**
   * Creates a streaming image resource in a studio.
   */
  createStreamingImage(callback?: (err: AWSError, data: Nimble.Types.CreateStreamingImageResponse) => void): Request<Nimble.Types.CreateStreamingImageResponse, AWSError>;
  /**
   * Creates a streaming session in a studio. After invoking this operation, you must poll GetStreamingSession until the streaming session is in the READY state.
   */
  createStreamingSession(params: Nimble.Types.CreateStreamingSessionRequest, callback?: (err: AWSError, data: Nimble.Types.CreateStreamingSessionResponse) => void): Request<Nimble.Types.CreateStreamingSessionResponse, AWSError>;
  /**
   * Creates a streaming session in a studio. After invoking this operation, you must poll GetStreamingSession until the streaming session is in the READY state.
   */
  createStreamingSession(callback?: (err: AWSError, data: Nimble.Types.CreateStreamingSessionResponse) => void): Request<Nimble.Types.CreateStreamingSessionResponse, AWSError>;
  /**
   * Creates a streaming session stream for a streaming session. After invoking this API, invoke GetStreamingSessionStream with the returned streamId to poll the resource until it is in the READY state.
   */
  createStreamingSessionStream(params: Nimble.Types.CreateStreamingSessionStreamRequest, callback?: (err: AWSError, data: Nimble.Types.CreateStreamingSessionStreamResponse) => void): Request<Nimble.Types.CreateStreamingSessionStreamResponse, AWSError>;
  /**
   * Creates a streaming session stream for a streaming session. After invoking this API, invoke GetStreamingSessionStream with the returned streamId to poll the resource until it is in the READY state.
   */
  createStreamingSessionStream(callback?: (err: AWSError, data: Nimble.Types.CreateStreamingSessionStreamResponse) => void): Request<Nimble.Types.CreateStreamingSessionStreamResponse, AWSError>;
  /**
   * Create a new studio. When creating a studio, two IAM roles must be provided: the admin role and the user role. These roles are assumed by your users when they log in to the Nimble Studio portal. The user role must have the AmazonNimbleStudio-StudioUser managed policy attached for the portal to function properly. The admin role must have the AmazonNimbleStudio-StudioAdmin managed policy attached for the portal to function properly. You may optionally specify a KMS key in the StudioEncryptionConfiguration. In Nimble Studio, resource names, descriptions, initialization scripts, and other data you provide are always encrypted at rest using an KMS key. By default, this key is owned by Amazon Web Services and managed on your behalf. You may provide your own KMS key when calling CreateStudio to encrypt this data using a key you own and manage. When providing an KMS key during studio creation, Nimble Studio creates KMS grants in your account to provide your studio user and admin roles access to these KMS keys. If you delete this grant, the studio will no longer be accessible to your portal users. If you delete the studio KMS key, your studio will no longer be accessible.
   */
  createStudio(params: Nimble.Types.CreateStudioRequest, callback?: (err: AWSError, data: Nimble.Types.CreateStudioResponse) => void): Request<Nimble.Types.CreateStudioResponse, AWSError>;
  /**
   * Create a new studio. When creating a studio, two IAM roles must be provided: the admin role and the user role. These roles are assumed by your users when they log in to the Nimble Studio portal. The user role must have the AmazonNimbleStudio-StudioUser managed policy attached for the portal to function properly. The admin role must have the AmazonNimbleStudio-StudioAdmin managed policy attached for the portal to function properly. You may optionally specify a KMS key in the StudioEncryptionConfiguration. In Nimble Studio, resource names, descriptions, initialization scripts, and other data you provide are always encrypted at rest using an KMS key. By default, this key is owned by Amazon Web Services and managed on your behalf. You may provide your own KMS key when calling CreateStudio to encrypt this data using a key you own and manage. When providing an KMS key during studio creation, Nimble Studio creates KMS grants in your account to provide your studio user and admin roles access to these KMS keys. If you delete this grant, the studio will no longer be accessible to your portal users. If you delete the studio KMS key, your studio will no longer be accessible.
   */
  createStudio(callback?: (err: AWSError, data: Nimble.Types.CreateStudioResponse) => void): Request<Nimble.Types.CreateStudioResponse, AWSError>;
  /**
   * Creates a studio component resource.
   */
  createStudioComponent(params: Nimble.Types.CreateStudioComponentRequest, callback?: (err: AWSError, data: Nimble.Types.CreateStudioComponentResponse) => void): Request<Nimble.Types.CreateStudioComponentResponse, AWSError>;
  /**
   * Creates a studio component resource.
   */
  createStudioComponent(callback?: (err: AWSError, data: Nimble.Types.CreateStudioComponentResponse) => void): Request<Nimble.Types.CreateStudioComponentResponse, AWSError>;
  /**
   * Permanently delete a launch profile.
   */
  deleteLaunchProfile(params: Nimble.Types.DeleteLaunchProfileRequest, callback?: (err: AWSError, data: Nimble.Types.DeleteLaunchProfileResponse) => void): Request<Nimble.Types.DeleteLaunchProfileResponse, AWSError>;
  /**
   * Permanently delete a launch profile.
   */
  deleteLaunchProfile(callback?: (err: AWSError, data: Nimble.Types.DeleteLaunchProfileResponse) => void): Request<Nimble.Types.DeleteLaunchProfileResponse, AWSError>;
  /**
   * Delete a user from launch profile membership.
   */
  deleteLaunchProfileMember(params: Nimble.Types.DeleteLaunchProfileMemberRequest, callback?: (err: AWSError, data: Nimble.Types.DeleteLaunchProfileMemberResponse) => void): Request<Nimble.Types.DeleteLaunchProfileMemberResponse, AWSError>;
  /**
   * Delete a user from launch profile membership.
   */
  deleteLaunchProfileMember(callback?: (err: AWSError, data: Nimble.Types.DeleteLaunchProfileMemberResponse) => void): Request<Nimble.Types.DeleteLaunchProfileMemberResponse, AWSError>;
  /**
   * Delete streaming image.
   */
  deleteStreamingImage(params: Nimble.Types.DeleteStreamingImageRequest, callback?: (err: AWSError, data: Nimble.Types.DeleteStreamingImageResponse) => void): Request<Nimble.Types.DeleteStreamingImageResponse, AWSError>;
  /**
   * Delete streaming image.
   */
  deleteStreamingImage(callback?: (err: AWSError, data: Nimble.Types.DeleteStreamingImageResponse) => void): Request<Nimble.Types.DeleteStreamingImageResponse, AWSError>;
  /**
   * Deletes streaming session resource. After invoking this operation, use GetStreamingSession to poll the resource until it transitions to a DELETED state. A streaming session will count against your streaming session quota until it is marked DELETED.
   */
  deleteStreamingSession(params: Nimble.Types.DeleteStreamingSessionRequest, callback?: (err: AWSError, data: Nimble.Types.DeleteStreamingSessionResponse) => void): Request<Nimble.Types.DeleteStreamingSessionResponse, AWSError>;
  /**
   * Deletes streaming session resource. After invoking this operation, use GetStreamingSession to poll the resource until it transitions to a DELETED state. A streaming session will count against your streaming session quota until it is marked DELETED.
   */
  deleteStreamingSession(callback?: (err: AWSError, data: Nimble.Types.DeleteStreamingSessionResponse) => void): Request<Nimble.Types.DeleteStreamingSessionResponse, AWSError>;
  /**
   * Delete a studio resource.
   */
  deleteStudio(params: Nimble.Types.DeleteStudioRequest, callback?: (err: AWSError, data: Nimble.Types.DeleteStudioResponse) => void): Request<Nimble.Types.DeleteStudioResponse, AWSError>;
  /**
   * Delete a studio resource.
   */
  deleteStudio(callback?: (err: AWSError, data: Nimble.Types.DeleteStudioResponse) => void): Request<Nimble.Types.DeleteStudioResponse, AWSError>;
  /**
   * Deletes a studio component resource.
   */
  deleteStudioComponent(params: Nimble.Types.DeleteStudioComponentRequest, callback?: (err: AWSError, data: Nimble.Types.DeleteStudioComponentResponse) => void): Request<Nimble.Types.DeleteStudioComponentResponse, AWSError>;
  /**
   * Deletes a studio component resource.
   */
  deleteStudioComponent(callback?: (err: AWSError, data: Nimble.Types.DeleteStudioComponentResponse) => void): Request<Nimble.Types.DeleteStudioComponentResponse, AWSError>;
  /**
   * Delete a user from studio membership.
   */
  deleteStudioMember(params: Nimble.Types.DeleteStudioMemberRequest, callback?: (err: AWSError, data: Nimble.Types.DeleteStudioMemberResponse) => void): Request<Nimble.Types.DeleteStudioMemberResponse, AWSError>;
  /**
   * Delete a user from studio membership.
   */
  deleteStudioMember(callback?: (err: AWSError, data: Nimble.Types.DeleteStudioMemberResponse) => void): Request<Nimble.Types.DeleteStudioMemberResponse, AWSError>;
  /**
   * Get EULA.
   */
  getEula(params: Nimble.Types.GetEulaRequest, callback?: (err: AWSError, data: Nimble.Types.GetEulaResponse) => void): Request<Nimble.Types.GetEulaResponse, AWSError>;
  /**
   * Get EULA.
   */
  getEula(callback?: (err: AWSError, data: Nimble.Types.GetEulaResponse) => void): Request<Nimble.Types.GetEulaResponse, AWSError>;
  /**
   * Get a launch profile.
   */
  getLaunchProfile(params: Nimble.Types.GetLaunchProfileRequest, callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileResponse) => void): Request<Nimble.Types.GetLaunchProfileResponse, AWSError>;
  /**
   * Get a launch profile.
   */
  getLaunchProfile(callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileResponse) => void): Request<Nimble.Types.GetLaunchProfileResponse, AWSError>;
  /**
   * Launch profile details include the launch profile resource and summary information of resources that are used by, or available to, the launch profile. This includes the name and description of all studio components used by the launch profiles, and the name and description of streaming images that can be used with this launch profile.
   */
  getLaunchProfileDetails(params: Nimble.Types.GetLaunchProfileDetailsRequest, callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileDetailsResponse) => void): Request<Nimble.Types.GetLaunchProfileDetailsResponse, AWSError>;
  /**
   * Launch profile details include the launch profile resource and summary information of resources that are used by, or available to, the launch profile. This includes the name and description of all studio components used by the launch profiles, and the name and description of streaming images that can be used with this launch profile.
   */
  getLaunchProfileDetails(callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileDetailsResponse) => void): Request<Nimble.Types.GetLaunchProfileDetailsResponse, AWSError>;
  /**
   * Get a launch profile initialization.
   */
  getLaunchProfileInitialization(params: Nimble.Types.GetLaunchProfileInitializationRequest, callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileInitializationResponse) => void): Request<Nimble.Types.GetLaunchProfileInitializationResponse, AWSError>;
  /**
   * Get a launch profile initialization.
   */
  getLaunchProfileInitialization(callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileInitializationResponse) => void): Request<Nimble.Types.GetLaunchProfileInitializationResponse, AWSError>;
  /**
   * Get a user persona in launch profile membership.
   */
  getLaunchProfileMember(params: Nimble.Types.GetLaunchProfileMemberRequest, callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileMemberResponse) => void): Request<Nimble.Types.GetLaunchProfileMemberResponse, AWSError>;
  /**
   * Get a user persona in launch profile membership.
   */
  getLaunchProfileMember(callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileMemberResponse) => void): Request<Nimble.Types.GetLaunchProfileMemberResponse, AWSError>;
  /**
   * Get streaming image.
   */
  getStreamingImage(params: Nimble.Types.GetStreamingImageRequest, callback?: (err: AWSError, data: Nimble.Types.GetStreamingImageResponse) => void): Request<Nimble.Types.GetStreamingImageResponse, AWSError>;
  /**
   * Get streaming image.
   */
  getStreamingImage(callback?: (err: AWSError, data: Nimble.Types.GetStreamingImageResponse) => void): Request<Nimble.Types.GetStreamingImageResponse, AWSError>;
  /**
   * Gets StreamingSession resource. Invoke this operation to poll for a streaming session state while creating or deleting a session.
   */
  getStreamingSession(params: Nimble.Types.GetStreamingSessionRequest, callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionResponse) => void): Request<Nimble.Types.GetStreamingSessionResponse, AWSError>;
  /**
   * Gets StreamingSession resource. Invoke this operation to poll for a streaming session state while creating or deleting a session.
   */
  getStreamingSession(callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionResponse) => void): Request<Nimble.Types.GetStreamingSessionResponse, AWSError>;
  /**
   * Gets StreamingSessionBackup resource. Invoke this operation to poll for a streaming session backup while stopping a streaming session.
   */
  getStreamingSessionBackup(params: Nimble.Types.GetStreamingSessionBackupRequest, callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionBackupResponse) => void): Request<Nimble.Types.GetStreamingSessionBackupResponse, AWSError>;
  /**
   * Gets StreamingSessionBackup resource. Invoke this operation to poll for a streaming session backup while stopping a streaming session.
   */
  getStreamingSessionBackup(callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionBackupResponse) => void): Request<Nimble.Types.GetStreamingSessionBackupResponse, AWSError>;
  /**
   * Gets a StreamingSessionStream for a streaming session. Invoke this operation to poll the resource after invoking CreateStreamingSessionStream. After the StreamingSessionStream changes to the READY state, the url property will contain a stream to be used with the DCV streaming client.
   */
  getStreamingSessionStream(params: Nimble.Types.GetStreamingSessionStreamRequest, callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionStreamResponse) => void): Request<Nimble.Types.GetStreamingSessionStreamResponse, AWSError>;
  /**
   * Gets a StreamingSessionStream for a streaming session. Invoke this operation to poll the resource after invoking CreateStreamingSessionStream. After the StreamingSessionStream changes to the READY state, the url property will contain a stream to be used with the DCV streaming client.
   */
  getStreamingSessionStream(callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionStreamResponse) => void): Request<Nimble.Types.GetStreamingSessionStreamResponse, AWSError>;
  /**
   * Get a studio resource.
   */
  getStudio(params: Nimble.Types.GetStudioRequest, callback?: (err: AWSError, data: Nimble.Types.GetStudioResponse) => void): Request<Nimble.Types.GetStudioResponse, AWSError>;
  /**
   * Get a studio resource.
   */
  getStudio(callback?: (err: AWSError, data: Nimble.Types.GetStudioResponse) => void): Request<Nimble.Types.GetStudioResponse, AWSError>;
  /**
   * Gets a studio component resource.
   */
  getStudioComponent(params: Nimble.Types.GetStudioComponentRequest, callback?: (err: AWSError, data: Nimble.Types.GetStudioComponentResponse) => void): Request<Nimble.Types.GetStudioComponentResponse, AWSError>;
  /**
   * Gets a studio component resource.
   */
  getStudioComponent(callback?: (err: AWSError, data: Nimble.Types.GetStudioComponentResponse) => void): Request<Nimble.Types.GetStudioComponentResponse, AWSError>;
  /**
   * Get a user's membership in a studio.
   */
  getStudioMember(params: Nimble.Types.GetStudioMemberRequest, callback?: (err: AWSError, data: Nimble.Types.GetStudioMemberResponse) => void): Request<Nimble.Types.GetStudioMemberResponse, AWSError>;
  /**
   * Get a user's membership in a studio.
   */
  getStudioMember(callback?: (err: AWSError, data: Nimble.Types.GetStudioMemberResponse) => void): Request<Nimble.Types.GetStudioMemberResponse, AWSError>;
  /**
   * List EULA acceptances.
   */
  listEulaAcceptances(params: Nimble.Types.ListEulaAcceptancesRequest, callback?: (err: AWSError, data: Nimble.Types.ListEulaAcceptancesResponse) => void): Request<Nimble.Types.ListEulaAcceptancesResponse, AWSError>;
  /**
   * List EULA acceptances.
   */
  listEulaAcceptances(callback?: (err: AWSError, data: Nimble.Types.ListEulaAcceptancesResponse) => void): Request<Nimble.Types.ListEulaAcceptancesResponse, AWSError>;
  /**
   * List EULAs.
   */
  listEulas(params: Nimble.Types.ListEulasRequest, callback?: (err: AWSError, data: Nimble.Types.ListEulasResponse) => void): Request<Nimble.Types.ListEulasResponse, AWSError>;
  /**
   * List EULAs.
   */
  listEulas(callback?: (err: AWSError, data: Nimble.Types.ListEulasResponse) => void): Request<Nimble.Types.ListEulasResponse, AWSError>;
  /**
   * Get all users in a given launch profile membership.
   */
  listLaunchProfileMembers(params: Nimble.Types.ListLaunchProfileMembersRequest, callback?: (err: AWSError, data: Nimble.Types.ListLaunchProfileMembersResponse) => void): Request<Nimble.Types.ListLaunchProfileMembersResponse, AWSError>;
  /**
   * Get all users in a given launch profile membership.
   */
  listLaunchProfileMembers(callback?: (err: AWSError, data: Nimble.Types.ListLaunchProfileMembersResponse) => void): Request<Nimble.Types.ListLaunchProfileMembersResponse, AWSError>;
  /**
   * List all the launch profiles a studio.
   */
  listLaunchProfiles(params: Nimble.Types.ListLaunchProfilesRequest, callback?: (err: AWSError, data: Nimble.Types.ListLaunchProfilesResponse) => void): Request<Nimble.Types.ListLaunchProfilesResponse, AWSError>;
  /**
   * List all the launch profiles a studio.
   */
  listLaunchProfiles(callback?: (err: AWSError, data: Nimble.Types.ListLaunchProfilesResponse) => void): Request<Nimble.Types.ListLaunchProfilesResponse, AWSError>;
  /**
   * List the streaming image resources available to this studio. This list will contain both images provided by Amazon Web Services, as well as streaming images that you have created in your studio.
   */
  listStreamingImages(params: Nimble.Types.ListStreamingImagesRequest, callback?: (err: AWSError, data: Nimble.Types.ListStreamingImagesResponse) => void): Request<Nimble.Types.ListStreamingImagesResponse, AWSError>;
  /**
   * List the streaming image resources available to this studio. This list will contain both images provided by Amazon Web Services, as well as streaming images that you have created in your studio.
   */
  listStreamingImages(callback?: (err: AWSError, data: Nimble.Types.ListStreamingImagesResponse) => void): Request<Nimble.Types.ListStreamingImagesResponse, AWSError>;
  /**
   * Lists the backups of a streaming session in a studio.
   */
  listStreamingSessionBackups(params: Nimble.Types.ListStreamingSessionBackupsRequest, callback?: (err: AWSError, data: Nimble.Types.ListStreamingSessionBackupsResponse) => void): Request<Nimble.Types.ListStreamingSessionBackupsResponse, AWSError>;
  /**
   * Lists the backups of a streaming session in a studio.
   */
  listStreamingSessionBackups(callback?: (err: AWSError, data: Nimble.Types.ListStreamingSessionBackupsResponse) => void): Request<Nimble.Types.ListStreamingSessionBackupsResponse, AWSError>;
  /**
   * Lists the streaming sessions in a studio.
   */
  listStreamingSessions(params: Nimble.Types.ListStreamingSessionsRequest, callback?: (err: AWSError, data: Nimble.Types.ListStreamingSessionsResponse) => void): Request<Nimble.Types.ListStreamingSessionsResponse, AWSError>;
  /**
   * Lists the streaming sessions in a studio.
   */
  listStreamingSessions(callback?: (err: AWSError, data: Nimble.Types.ListStreamingSessionsResponse) => void): Request<Nimble.Types.ListStreamingSessionsResponse, AWSError>;
  /**
   * Lists the StudioComponents in a studio.
   */
  listStudioComponents(params: Nimble.Types.ListStudioComponentsRequest, callback?: (err: AWSError, data: Nimble.Types.ListStudioComponentsResponse) => void): Request<Nimble.Types.ListStudioComponentsResponse, AWSError>;
  /**
   * Lists the StudioComponents in a studio.
   */
  listStudioComponents(callback?: (err: AWSError, data: Nimble.Types.ListStudioComponentsResponse) => void): Request<Nimble.Types.ListStudioComponentsResponse, AWSError>;
  /**
   * Get all users in a given studio membership.   ListStudioMembers only returns admin members. 
   */
  listStudioMembers(params: Nimble.Types.ListStudioMembersRequest, callback?: (err: AWSError, data: Nimble.Types.ListStudioMembersResponse) => void): Request<Nimble.Types.ListStudioMembersResponse, AWSError>;
  /**
   * Get all users in a given studio membership.   ListStudioMembers only returns admin members. 
   */
  listStudioMembers(callback?: (err: AWSError, data: Nimble.Types.ListStudioMembersResponse) => void): Request<Nimble.Types.ListStudioMembersResponse, AWSError>;
  /**
   * List studios in your Amazon Web Services accounts in the requested Amazon Web Services Region.
   */
  listStudios(params: Nimble.Types.ListStudiosRequest, callback?: (err: AWSError, data: Nimble.Types.ListStudiosResponse) => void): Request<Nimble.Types.ListStudiosResponse, AWSError>;
  /**
   * List studios in your Amazon Web Services accounts in the requested Amazon Web Services Region.
   */
  listStudios(callback?: (err: AWSError, data: Nimble.Types.ListStudiosResponse) => void): Request<Nimble.Types.ListStudiosResponse, AWSError>;
  /**
   * Gets the tags for a resource, given its Amazon Resource Names (ARN). This operation supports ARNs for all resource types in Nimble Studio that support tags, including studio, studio component, launch profile, streaming image, and streaming session. All resources that can be tagged will contain an ARN property, so you do not have to create this ARN yourself.
   */
  listTagsForResource(params: Nimble.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Nimble.Types.ListTagsForResourceResponse) => void): Request<Nimble.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets the tags for a resource, given its Amazon Resource Names (ARN). This operation supports ARNs for all resource types in Nimble Studio that support tags, including studio, studio component, launch profile, streaming image, and streaming session. All resources that can be tagged will contain an ARN property, so you do not have to create this ARN yourself.
   */
  listTagsForResource(callback?: (err: AWSError, data: Nimble.Types.ListTagsForResourceResponse) => void): Request<Nimble.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Add/update users with given persona to launch profile membership.
   */
  putLaunchProfileMembers(params: Nimble.Types.PutLaunchProfileMembersRequest, callback?: (err: AWSError, data: Nimble.Types.PutLaunchProfileMembersResponse) => void): Request<Nimble.Types.PutLaunchProfileMembersResponse, AWSError>;
  /**
   * Add/update users with given persona to launch profile membership.
   */
  putLaunchProfileMembers(callback?: (err: AWSError, data: Nimble.Types.PutLaunchProfileMembersResponse) => void): Request<Nimble.Types.PutLaunchProfileMembersResponse, AWSError>;
  /**
   * Add/update users with given persona to studio membership.
   */
  putStudioMembers(params: Nimble.Types.PutStudioMembersRequest, callback?: (err: AWSError, data: Nimble.Types.PutStudioMembersResponse) => void): Request<Nimble.Types.PutStudioMembersResponse, AWSError>;
  /**
   * Add/update users with given persona to studio membership.
   */
  putStudioMembers(callback?: (err: AWSError, data: Nimble.Types.PutStudioMembersResponse) => void): Request<Nimble.Types.PutStudioMembersResponse, AWSError>;
  /**
   * Transitions sessions from the STOPPED state into the READY state. The START_IN_PROGRESS state is the intermediate state between the STOPPED and READY states.
   */
  startStreamingSession(params: Nimble.Types.StartStreamingSessionRequest, callback?: (err: AWSError, data: Nimble.Types.StartStreamingSessionResponse) => void): Request<Nimble.Types.StartStreamingSessionResponse, AWSError>;
  /**
   * Transitions sessions from the STOPPED state into the READY state. The START_IN_PROGRESS state is the intermediate state between the STOPPED and READY states.
   */
  startStreamingSession(callback?: (err: AWSError, data: Nimble.Types.StartStreamingSessionResponse) => void): Request<Nimble.Types.StartStreamingSessionResponse, AWSError>;
  /**
   * Repairs the IAM Identity Center configuration for a given studio. If the studio has a valid IAM Identity Center configuration currently associated with it, this operation will fail with a validation error. If the studio does not have a valid IAM Identity Center configuration currently associated with it, then a new IAM Identity Center application is created for the studio and the studio is changed to the READY state. After the IAM Identity Center application is repaired, you must use the Amazon Nimble Studio console to add administrators and users to your studio.
   */
  startStudioSSOConfigurationRepair(params: Nimble.Types.StartStudioSSOConfigurationRepairRequest, callback?: (err: AWSError, data: Nimble.Types.StartStudioSSOConfigurationRepairResponse) => void): Request<Nimble.Types.StartStudioSSOConfigurationRepairResponse, AWSError>;
  /**
   * Repairs the IAM Identity Center configuration for a given studio. If the studio has a valid IAM Identity Center configuration currently associated with it, this operation will fail with a validation error. If the studio does not have a valid IAM Identity Center configuration currently associated with it, then a new IAM Identity Center application is created for the studio and the studio is changed to the READY state. After the IAM Identity Center application is repaired, you must use the Amazon Nimble Studio console to add administrators and users to your studio.
   */
  startStudioSSOConfigurationRepair(callback?: (err: AWSError, data: Nimble.Types.StartStudioSSOConfigurationRepairResponse) => void): Request<Nimble.Types.StartStudioSSOConfigurationRepairResponse, AWSError>;
  /**
   * Transitions sessions from the READY state into the STOPPED state. The STOP_IN_PROGRESS state is the intermediate state between the READY and STOPPED states.
   */
  stopStreamingSession(params: Nimble.Types.StopStreamingSessionRequest, callback?: (err: AWSError, data: Nimble.Types.StopStreamingSessionResponse) => void): Request<Nimble.Types.StopStreamingSessionResponse, AWSError>;
  /**
   * Transitions sessions from the READY state into the STOPPED state. The STOP_IN_PROGRESS state is the intermediate state between the READY and STOPPED states.
   */
  stopStreamingSession(callback?: (err: AWSError, data: Nimble.Types.StopStreamingSessionResponse) => void): Request<Nimble.Types.StopStreamingSessionResponse, AWSError>;
  /**
   * Creates tags for a resource, given its ARN.
   */
  tagResource(params: Nimble.Types.TagResourceRequest, callback?: (err: AWSError, data: Nimble.Types.TagResourceResponse) => void): Request<Nimble.Types.TagResourceResponse, AWSError>;
  /**
   * Creates tags for a resource, given its ARN.
   */
  tagResource(callback?: (err: AWSError, data: Nimble.Types.TagResourceResponse) => void): Request<Nimble.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes the tags for a resource.
   */
  untagResource(params: Nimble.Types.UntagResourceRequest, callback?: (err: AWSError, data: Nimble.Types.UntagResourceResponse) => void): Request<Nimble.Types.UntagResourceResponse, AWSError>;
  /**
   * Deletes the tags for a resource.
   */
  untagResource(callback?: (err: AWSError, data: Nimble.Types.UntagResourceResponse) => void): Request<Nimble.Types.UntagResourceResponse, AWSError>;
  /**
   * Update a launch profile.
   */
  updateLaunchProfile(params: Nimble.Types.UpdateLaunchProfileRequest, callback?: (err: AWSError, data: Nimble.Types.UpdateLaunchProfileResponse) => void): Request<Nimble.Types.UpdateLaunchProfileResponse, AWSError>;
  /**
   * Update a launch profile.
   */
  updateLaunchProfile(callback?: (err: AWSError, data: Nimble.Types.UpdateLaunchProfileResponse) => void): Request<Nimble.Types.UpdateLaunchProfileResponse, AWSError>;
  /**
   * Update a user persona in launch profile membership.
   */
  updateLaunchProfileMember(params: Nimble.Types.UpdateLaunchProfileMemberRequest, callback?: (err: AWSError, data: Nimble.Types.UpdateLaunchProfileMemberResponse) => void): Request<Nimble.Types.UpdateLaunchProfileMemberResponse, AWSError>;
  /**
   * Update a user persona in launch profile membership.
   */
  updateLaunchProfileMember(callback?: (err: AWSError, data: Nimble.Types.UpdateLaunchProfileMemberResponse) => void): Request<Nimble.Types.UpdateLaunchProfileMemberResponse, AWSError>;
  /**
   * Update streaming image.
   */
  updateStreamingImage(params: Nimble.Types.UpdateStreamingImageRequest, callback?: (err: AWSError, data: Nimble.Types.UpdateStreamingImageResponse) => void): Request<Nimble.Types.UpdateStreamingImageResponse, AWSError>;
  /**
   * Update streaming image.
   */
  updateStreamingImage(callback?: (err: AWSError, data: Nimble.Types.UpdateStreamingImageResponse) => void): Request<Nimble.Types.UpdateStreamingImageResponse, AWSError>;
  /**
   * Update a Studio resource. Currently, this operation only supports updating the displayName of your studio.
   */
  updateStudio(params: Nimble.Types.UpdateStudioRequest, callback?: (err: AWSError, data: Nimble.Types.UpdateStudioResponse) => void): Request<Nimble.Types.UpdateStudioResponse, AWSError>;
  /**
   * Update a Studio resource. Currently, this operation only supports updating the displayName of your studio.
   */
  updateStudio(callback?: (err: AWSError, data: Nimble.Types.UpdateStudioResponse) => void): Request<Nimble.Types.UpdateStudioResponse, AWSError>;
  /**
   * Updates a studio component resource.
   */
  updateStudioComponent(params: Nimble.Types.UpdateStudioComponentRequest, callback?: (err: AWSError, data: Nimble.Types.UpdateStudioComponentResponse) => void): Request<Nimble.Types.UpdateStudioComponentResponse, AWSError>;
  /**
   * Updates a studio component resource.
   */
  updateStudioComponent(callback?: (err: AWSError, data: Nimble.Types.UpdateStudioComponentResponse) => void): Request<Nimble.Types.UpdateStudioComponentResponse, AWSError>;
  /**
   * Waits for the launchProfileDeleted state by periodically calling the underlying Nimble.getLaunchProfileoperation every 5 seconds (at most 150 times). Wait until a LaunchProfile is Deleted. Use this after invoking DeleteLaunchProfile
   */
  waitFor(state: "launchProfileDeleted", params: Nimble.Types.GetLaunchProfileRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileResponse) => void): Request<Nimble.Types.GetLaunchProfileResponse, AWSError>;
  /**
   * Waits for the launchProfileDeleted state by periodically calling the underlying Nimble.getLaunchProfileoperation every 5 seconds (at most 150 times). Wait until a LaunchProfile is Deleted. Use this after invoking DeleteLaunchProfile
   */
  waitFor(state: "launchProfileDeleted", callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileResponse) => void): Request<Nimble.Types.GetLaunchProfileResponse, AWSError>;
  /**
   * Waits for the launchProfileReady state by periodically calling the underlying Nimble.getLaunchProfileoperation every 5 seconds (at most 150 times). Wait until a LaunchProfile is Ready. Use this after invoking CreateLaunchProfile or UpdateLaunchProfile
   */
  waitFor(state: "launchProfileReady", params: Nimble.Types.GetLaunchProfileRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileResponse) => void): Request<Nimble.Types.GetLaunchProfileResponse, AWSError>;
  /**
   * Waits for the launchProfileReady state by periodically calling the underlying Nimble.getLaunchProfileoperation every 5 seconds (at most 150 times). Wait until a LaunchProfile is Ready. Use this after invoking CreateLaunchProfile or UpdateLaunchProfile
   */
  waitFor(state: "launchProfileReady", callback?: (err: AWSError, data: Nimble.Types.GetLaunchProfileResponse) => void): Request<Nimble.Types.GetLaunchProfileResponse, AWSError>;
  /**
   * Waits for the streamingImageDeleted state by periodically calling the underlying Nimble.getStreamingImageoperation every 2 seconds (at most 60 times). Wait until a StreamingImage Deleted. Use this after invoking DeleteStreamingImage
   */
  waitFor(state: "streamingImageDeleted", params: Nimble.Types.GetStreamingImageRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStreamingImageResponse) => void): Request<Nimble.Types.GetStreamingImageResponse, AWSError>;
  /**
   * Waits for the streamingImageDeleted state by periodically calling the underlying Nimble.getStreamingImageoperation every 2 seconds (at most 60 times). Wait until a StreamingImage Deleted. Use this after invoking DeleteStreamingImage
   */
  waitFor(state: "streamingImageDeleted", callback?: (err: AWSError, data: Nimble.Types.GetStreamingImageResponse) => void): Request<Nimble.Types.GetStreamingImageResponse, AWSError>;
  /**
   * Waits for the streamingImageReady state by periodically calling the underlying Nimble.getStreamingImageoperation every 2 seconds (at most 60 times). Wait until a StreamingImage is Ready. Use this after invoking CreateStreamingImage or UpdateStreamingImage
   */
  waitFor(state: "streamingImageReady", params: Nimble.Types.GetStreamingImageRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStreamingImageResponse) => void): Request<Nimble.Types.GetStreamingImageResponse, AWSError>;
  /**
   * Waits for the streamingImageReady state by periodically calling the underlying Nimble.getStreamingImageoperation every 2 seconds (at most 60 times). Wait until a StreamingImage is Ready. Use this after invoking CreateStreamingImage or UpdateStreamingImage
   */
  waitFor(state: "streamingImageReady", callback?: (err: AWSError, data: Nimble.Types.GetStreamingImageResponse) => void): Request<Nimble.Types.GetStreamingImageResponse, AWSError>;
  /**
   * Waits for the streamingSessionDeleted state by periodically calling the underlying Nimble.getStreamingSessionoperation every 5 seconds (at most 180 times). Wait until a StreamingSessionDeleted. Use this after invoking DeleteStreamingSession
   */
  waitFor(state: "streamingSessionDeleted", params: Nimble.Types.GetStreamingSessionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionResponse) => void): Request<Nimble.Types.GetStreamingSessionResponse, AWSError>;
  /**
   * Waits for the streamingSessionDeleted state by periodically calling the underlying Nimble.getStreamingSessionoperation every 5 seconds (at most 180 times). Wait until a StreamingSessionDeleted. Use this after invoking DeleteStreamingSession
   */
  waitFor(state: "streamingSessionDeleted", callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionResponse) => void): Request<Nimble.Types.GetStreamingSessionResponse, AWSError>;
  /**
   * Waits for the streamingSessionReady state by periodically calling the underlying Nimble.getStreamingSessionoperation every 10 seconds (at most 180 times). Wait until a StreamingSession is ready. Use this after invoking CreateStreamingSession, StartStreamingSession
   */
  waitFor(state: "streamingSessionReady", params: Nimble.Types.GetStreamingSessionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionResponse) => void): Request<Nimble.Types.GetStreamingSessionResponse, AWSError>;
  /**
   * Waits for the streamingSessionReady state by periodically calling the underlying Nimble.getStreamingSessionoperation every 10 seconds (at most 180 times). Wait until a StreamingSession is ready. Use this after invoking CreateStreamingSession, StartStreamingSession
   */
  waitFor(state: "streamingSessionReady", callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionResponse) => void): Request<Nimble.Types.GetStreamingSessionResponse, AWSError>;
  /**
   * Waits for the streamingSessionStopped state by periodically calling the underlying Nimble.getStreamingSessionoperation every 5 seconds (at most 180 times). Wait until a StreamingSessionStopped. Use this after invoking StopStreamingSession
   */
  waitFor(state: "streamingSessionStopped", params: Nimble.Types.GetStreamingSessionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionResponse) => void): Request<Nimble.Types.GetStreamingSessionResponse, AWSError>;
  /**
   * Waits for the streamingSessionStopped state by periodically calling the underlying Nimble.getStreamingSessionoperation every 5 seconds (at most 180 times). Wait until a StreamingSessionStopped. Use this after invoking StopStreamingSession
   */
  waitFor(state: "streamingSessionStopped", callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionResponse) => void): Request<Nimble.Types.GetStreamingSessionResponse, AWSError>;
  /**
   * Waits for the streamingSessionStreamReady state by periodically calling the underlying Nimble.getStreamingSessionStreamoperation every 5 seconds (at most 30 times). Wait until a StreamingSessionStream is ready. Use this after invoking CreateStreamingSessionStream
   */
  waitFor(state: "streamingSessionStreamReady", params: Nimble.Types.GetStreamingSessionStreamRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionStreamResponse) => void): Request<Nimble.Types.GetStreamingSessionStreamResponse, AWSError>;
  /**
   * Waits for the streamingSessionStreamReady state by periodically calling the underlying Nimble.getStreamingSessionStreamoperation every 5 seconds (at most 30 times). Wait until a StreamingSessionStream is ready. Use this after invoking CreateStreamingSessionStream
   */
  waitFor(state: "streamingSessionStreamReady", callback?: (err: AWSError, data: Nimble.Types.GetStreamingSessionStreamResponse) => void): Request<Nimble.Types.GetStreamingSessionStreamResponse, AWSError>;
  /**
   * Waits for the studioComponentDeleted state by periodically calling the underlying Nimble.getStudioComponentoperation every 1 seconds (at most 120 times). Wait until a StudioComponent Deleted. Use this after invoking DeleteStudioComponent
   */
  waitFor(state: "studioComponentDeleted", params: Nimble.Types.GetStudioComponentRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStudioComponentResponse) => void): Request<Nimble.Types.GetStudioComponentResponse, AWSError>;
  /**
   * Waits for the studioComponentDeleted state by periodically calling the underlying Nimble.getStudioComponentoperation every 1 seconds (at most 120 times). Wait until a StudioComponent Deleted. Use this after invoking DeleteStudioComponent
   */
  waitFor(state: "studioComponentDeleted", callback?: (err: AWSError, data: Nimble.Types.GetStudioComponentResponse) => void): Request<Nimble.Types.GetStudioComponentResponse, AWSError>;
  /**
   * Waits for the studioComponentReady state by periodically calling the underlying Nimble.getStudioComponentoperation every 2 seconds (at most 60 times). Wait until a StudioComponent is Ready. Use this after invoking CreateStudioComponent or UpdateStudioComponent
   */
  waitFor(state: "studioComponentReady", params: Nimble.Types.GetStudioComponentRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStudioComponentResponse) => void): Request<Nimble.Types.GetStudioComponentResponse, AWSError>;
  /**
   * Waits for the studioComponentReady state by periodically calling the underlying Nimble.getStudioComponentoperation every 2 seconds (at most 60 times). Wait until a StudioComponent is Ready. Use this after invoking CreateStudioComponent or UpdateStudioComponent
   */
  waitFor(state: "studioComponentReady", callback?: (err: AWSError, data: Nimble.Types.GetStudioComponentResponse) => void): Request<Nimble.Types.GetStudioComponentResponse, AWSError>;
  /**
   * Waits for the studioDeleted state by periodically calling the underlying Nimble.getStudiooperation every 2 seconds (at most 60 times). Wait until a Studio is Deleted. Use this after invoking DeleteStudio.
   */
  waitFor(state: "studioDeleted", params: Nimble.Types.GetStudioRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStudioResponse) => void): Request<Nimble.Types.GetStudioResponse, AWSError>;
  /**
   * Waits for the studioDeleted state by periodically calling the underlying Nimble.getStudiooperation every 2 seconds (at most 60 times). Wait until a Studio is Deleted. Use this after invoking DeleteStudio.
   */
  waitFor(state: "studioDeleted", callback?: (err: AWSError, data: Nimble.Types.GetStudioResponse) => void): Request<Nimble.Types.GetStudioResponse, AWSError>;
  /**
   * Waits for the studioReady state by periodically calling the underlying Nimble.getStudiooperation every 2 seconds (at most 60 times). Wait until a Studio is Ready. Use this after invoking CreateStudio, UpdateStudio, or StartStudioSSOConfigurationRepair
   */
  waitFor(state: "studioReady", params: Nimble.Types.GetStudioRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Nimble.Types.GetStudioResponse) => void): Request<Nimble.Types.GetStudioResponse, AWSError>;
  /**
   * Waits for the studioReady state by periodically calling the underlying Nimble.getStudiooperation every 2 seconds (at most 60 times). Wait until a Studio is Ready. Use this after invoking CreateStudio, UpdateStudio, or StartStudioSSOConfigurationRepair
   */
  waitFor(state: "studioReady", callback?: (err: AWSError, data: Nimble.Types.GetStudioResponse) => void): Request<Nimble.Types.GetStudioResponse, AWSError>;
}
declare namespace Nimble {
  export interface AcceptEulasRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The EULA ID.
     */
    eulaIds?: EulaIdList;
    /**
     * The studio ID.
     */
    studioId: String;
  }
  export interface AcceptEulasResponse {
    /**
     * A collection of EULA acceptances.
     */
    eulaAcceptances?: EulaAcceptanceList;
  }
  export interface ActiveDirectoryComputerAttribute {
    /**
     * The name for the LDAP attribute.
     */
    name?: ActiveDirectoryComputerAttributeName;
    /**
     * The value for the LDAP attribute.
     */
    value?: ActiveDirectoryComputerAttributeValue;
  }
  export type ActiveDirectoryComputerAttributeList = ActiveDirectoryComputerAttribute[];
  export type ActiveDirectoryComputerAttributeName = string;
  export type ActiveDirectoryComputerAttributeValue = string;
  export interface ActiveDirectoryConfiguration {
    /**
     * A collection of custom attributes for an Active Directory computer.
     */
    computerAttributes?: ActiveDirectoryComputerAttributeList;
    /**
     * The directory ID of the Directory Service for Microsoft Active Directory to access using this studio component.
     */
    directoryId?: DirectoryId;
    /**
     * The distinguished name (DN) and organizational unit (OU) of an Active Directory computer.
     */
    organizationalUnitDistinguishedName?: ActiveDirectoryOrganizationalUnitDistinguishedName;
  }
  export type ActiveDirectoryDnsIpAddress = string;
  export type ActiveDirectoryDnsIpAddressList = ActiveDirectoryDnsIpAddress[];
  export type ActiveDirectoryOrganizationalUnitDistinguishedName = string;
  export type AutomaticTerminationMode = "DEACTIVATED"|"ACTIVATED"|string;
  export type ClientToken = string;
  export interface ComputeFarmConfiguration {
    /**
     * The name of an Active Directory user that is used on ComputeFarm worker instances.
     */
    activeDirectoryUser?: String;
    /**
     * The endpoint of the ComputeFarm that is accessed by the studio component resource.
     */
    endpoint?: SensitiveString;
  }
  export interface CreateLaunchProfileRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The description.
     */
    description?: LaunchProfileDescription;
    /**
     * Specifies the IDs of the EC2 subnets where streaming sessions will be accessible from. These subnets must support the specified instance types. 
     */
    ec2SubnetIds: EC2SubnetIdList;
    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     */
    launchProfileProtocolVersions: LaunchProfileProtocolVersionList;
    /**
     * The name for the launch profile.
     */
    name: LaunchProfileName;
    /**
     * A configuration for a streaming session.
     */
    streamConfiguration: StreamConfigurationCreate;
    /**
     * Unique identifiers for a collection of studio components that can be used with this launch profile.
     */
    studioComponentIds: LaunchProfileStudioComponentIdList;
    /**
     * The studio ID. 
     */
    studioId: String;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
  }
  export interface CreateLaunchProfileResponse {
    /**
     * The launch profile.
     */
    launchProfile?: LaunchProfile;
  }
  export interface CreateStreamingImageRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * A human-readable description of the streaming image.
     */
    description?: StreamingImageDescription;
    /**
     * The ID of an EC2 machine image with which to create this streaming image.
     */
    ec2ImageId: EC2ImageId;
    /**
     * A friendly name for a streaming image resource.
     */
    name: StreamingImageName;
    /**
     * The studio ID. 
     */
    studioId: String;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
  }
  export interface CreateStreamingImageResponse {
    /**
     * The streaming image.
     */
    streamingImage?: StreamingImage;
  }
  export interface CreateStreamingSessionRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The EC2 Instance type used for the streaming session.
     */
    ec2InstanceType?: StreamingInstanceType;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The user ID of the user that owns the streaming session. The user that owns the session will be logging into the session and interacting with the virtual workstation.
     */
    ownedBy?: String;
    /**
     * The ID of the streaming image.
     */
    streamingImageId?: StreamingImageId;
    /**
     * The studio ID. 
     */
    studioId: String;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
  }
  export interface CreateStreamingSessionResponse {
    /**
     * The session.
     */
    session?: StreamingSession;
  }
  export interface CreateStreamingSessionStreamRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The expiration time in seconds.
     */
    expirationInSeconds?: StreamingSessionStreamExpirationInSeconds;
    /**
     * The streaming session ID.
     */
    sessionId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface CreateStreamingSessionStreamResponse {
    /**
     * The stream.
     */
    stream?: StreamingSessionStream;
  }
  export interface CreateStudioComponentRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The configuration of the studio component, based on component type.
     */
    configuration?: StudioComponentConfiguration;
    /**
     * The description.
     */
    description?: StudioComponentDescription;
    /**
     * The EC2 security groups that control access to the studio component.
     */
    ec2SecurityGroupIds?: StudioComponentSecurityGroupIdList;
    /**
     * Initialization scripts for studio components.
     */
    initializationScripts?: StudioComponentInitializationScriptList;
    /**
     * The name for the studio component.
     */
    name: StudioComponentName;
    /**
     * An IAM role attached to a Studio Component that gives the studio component access to Amazon Web Services resources at anytime while the instance is running. 
     */
    runtimeRoleArn?: RoleArn;
    /**
     * Parameters for the studio component scripts.
     */
    scriptParameters?: StudioComponentScriptParameterKeyValueList;
    /**
     * An IAM role attached to Studio Component when the system initialization script runs which give the studio component access to Amazon Web Services resources when the system initialization script runs.
     */
    secureInitializationRoleArn?: RoleArn;
    /**
     * The studio ID. 
     */
    studioId: String;
    /**
     * The specific subtype of a studio component.
     */
    subtype?: StudioComponentSubtype;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
    /**
     * The type of the studio component.
     */
    type: StudioComponentType;
  }
  export interface CreateStudioComponentResponse {
    /**
     * Information about the studio component.
     */
    studioComponent?: StudioComponent;
  }
  export interface CreateStudioRequest {
    /**
     * The IAM role that studio admins will assume when logging in to the Nimble Studio portal.
     */
    adminRoleArn: RoleArn;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * A friendly name for the studio.
     */
    displayName: StudioDisplayName;
    /**
     * The studio encryption configuration.
     */
    studioEncryptionConfiguration?: StudioEncryptionConfiguration;
    /**
     * The studio name that is used in the URL of the Nimble Studio portal when accessed by Nimble Studio users.
     */
    studioName: StudioName;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
    /**
     * The IAM role that studio users will assume when logging in to the Nimble Studio portal.
     */
    userRoleArn: RoleArn;
  }
  export interface CreateStudioResponse {
    /**
     * Information about a studio.
     */
    studio?: Studio;
  }
  export interface DeleteLaunchProfileMemberRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The principal ID. This currently supports a IAM Identity Center UserId. 
     */
    principalId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface DeleteLaunchProfileMemberResponse {
  }
  export interface DeleteLaunchProfileRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface DeleteLaunchProfileResponse {
    /**
     * The launch profile.
     */
    launchProfile?: LaunchProfile;
  }
  export interface DeleteStreamingImageRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The streaming image ID.
     */
    streamingImageId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface DeleteStreamingImageResponse {
    /**
     * The streaming image.
     */
    streamingImage?: StreamingImage;
  }
  export interface DeleteStreamingSessionRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The streaming session ID.
     */
    sessionId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface DeleteStreamingSessionResponse {
    /**
     * The session.
     */
    session?: StreamingSession;
  }
  export interface DeleteStudioComponentRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The studio component ID.
     */
    studioComponentId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface DeleteStudioComponentResponse {
    /**
     * Information about the studio component.
     */
    studioComponent?: StudioComponent;
  }
  export interface DeleteStudioMemberRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The principal ID. This currently supports a IAM Identity Center UserId. 
     */
    principalId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface DeleteStudioMemberResponse {
  }
  export interface DeleteStudioRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface DeleteStudioResponse {
    /**
     * Information about a studio.
     */
    studio: Studio;
  }
  export type DirectoryId = string;
  export type EC2ImageId = string;
  export type EC2SubnetId = string;
  export type EC2SubnetIdList = EC2SubnetId[];
  export interface Eula {
    /**
     * The EULA content.
     */
    content?: String;
    /**
     * The ISO timestamp in seconds for when the resource was created.
     */
    createdAt?: Timestamp;
    /**
     * The EULA ID.
     */
    eulaId?: EulaId;
    /**
     * The name for the EULA.
     */
    name?: EulaName;
    /**
     * The ISO timestamp in seconds for when the resource was updated.
     */
    updatedAt?: Timestamp;
  }
  export interface EulaAcceptance {
    /**
     * The ISO timestamp in seconds for when the EULA was accepted.
     */
    acceptedAt?: Timestamp;
    /**
     * The ID of the person who accepted the EULA.
     */
    acceptedBy?: String;
    /**
     * The ID of the acceptee.
     */
    accepteeId?: String;
    /**
     * The EULA acceptance ID.
     */
    eulaAcceptanceId?: EulaAcceptanceId;
    /**
     * The EULA ID.
     */
    eulaId?: EulaId;
  }
  export type EulaAcceptanceId = string;
  export type EulaAcceptanceList = EulaAcceptance[];
  export type EulaId = string;
  export type EulaIdList = String[];
  export type EulaList = Eula[];
  export type EulaName = string;
  export interface GetEulaRequest {
    /**
     * The EULA ID.
     */
    eulaId: String;
  }
  export interface GetEulaResponse {
    /**
     * The EULA.
     */
    eula?: Eula;
  }
  export interface GetLaunchProfileDetailsRequest {
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetLaunchProfileDetailsResponse {
    /**
     * The launch profile.
     */
    launchProfile?: LaunchProfile;
    /**
     * A collection of streaming images.
     */
    streamingImages?: StreamingImageList;
    /**
     * A collection of studio component summaries.
     */
    studioComponentSummaries?: StudioComponentSummaryList;
  }
  export interface GetLaunchProfileInitializationRequest {
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The launch profile protocol versions supported by the client.
     */
    launchProfileProtocolVersions: StringList;
    /**
     * The launch purpose.
     */
    launchPurpose: String;
    /**
     * The platform where this Launch Profile will be used, either Windows or Linux.
     */
    platform: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetLaunchProfileInitializationResponse {
    /**
     * The launch profile initialization.
     */
    launchProfileInitialization?: LaunchProfileInitialization;
  }
  export interface GetLaunchProfileMemberRequest {
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The principal ID. This currently supports a IAM Identity Center UserId. 
     */
    principalId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetLaunchProfileMemberResponse {
    /**
     * The member.
     */
    member?: LaunchProfileMembership;
  }
  export interface GetLaunchProfileRequest {
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetLaunchProfileResponse {
    /**
     * The launch profile.
     */
    launchProfile?: LaunchProfile;
  }
  export interface GetStreamingImageRequest {
    /**
     * The streaming image ID.
     */
    streamingImageId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetStreamingImageResponse {
    /**
     * The streaming image.
     */
    streamingImage?: StreamingImage;
  }
  export interface GetStreamingSessionBackupRequest {
    /**
     * The ID of the backup.
     */
    backupId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetStreamingSessionBackupResponse {
    /**
     * Information about the streaming session backup.
     */
    streamingSessionBackup?: StreamingSessionBackup;
  }
  export interface GetStreamingSessionRequest {
    /**
     * The streaming session ID.
     */
    sessionId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetStreamingSessionResponse {
    /**
     * The session.
     */
    session?: StreamingSession;
  }
  export interface GetStreamingSessionStreamRequest {
    /**
     * The streaming session ID.
     */
    sessionId: String;
    /**
     * The streaming session stream ID.
     */
    streamId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetStreamingSessionStreamResponse {
    /**
     * The stream.
     */
    stream?: StreamingSessionStream;
  }
  export interface GetStudioComponentRequest {
    /**
     * The studio component ID.
     */
    studioComponentId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetStudioComponentResponse {
    /**
     * Information about the studio component.
     */
    studioComponent?: StudioComponent;
  }
  export interface GetStudioMemberRequest {
    /**
     * The principal ID. This currently supports a IAM Identity Center UserId. 
     */
    principalId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetStudioMemberResponse {
    /**
     * The member.
     */
    member?: StudioMembership;
  }
  export interface GetStudioRequest {
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface GetStudioResponse {
    /**
     * Information about a studio.
     */
    studio: Studio;
  }
  export interface LaunchProfile {
    /**
     * The Amazon Resource Name (ARN) that is assigned to a studio resource and uniquely identifies it. ARNs are unique across all Regions.
     */
    arn?: String;
    /**
     * The ISO timestamp in seconds for when the resource was created.
     */
    createdAt?: Timestamp;
    /**
     * The user ID of the user that created the launch profile.
     */
    createdBy?: String;
    /**
     * A human-readable description of the launch profile.
     */
    description?: LaunchProfileDescription;
    /**
     * Unique identifiers for a collection of EC2 subnets.
     */
    ec2SubnetIds?: EC2SubnetIdList;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId?: LaunchProfileId;
    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     */
    launchProfileProtocolVersions?: LaunchProfileProtocolVersionList;
    /**
     * A friendly name for the launch profile.
     */
    name?: LaunchProfileName;
    /**
     * The current state.
     */
    state?: LaunchProfileState;
    /**
     * The status code.
     */
    statusCode?: LaunchProfileStatusCode;
    /**
     * The status message for the launch profile.
     */
    statusMessage?: String;
    /**
     * A configuration for a streaming session.
     */
    streamConfiguration?: StreamConfiguration;
    /**
     * Unique identifiers for a collection of studio components that can be used with this launch profile.
     */
    studioComponentIds?: LaunchProfileStudioComponentIdList;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
    /**
     * The ISO timestamp in seconds for when the resource was updated.
     */
    updatedAt?: Timestamp;
    /**
     * The user ID of the user that most recently updated the resource.
     */
    updatedBy?: String;
    /**
     * The list of the latest validation results.
     */
    validationResults?: ValidationResults;
  }
  export type LaunchProfileDescription = string;
  export type LaunchProfileId = string;
  export interface LaunchProfileInitialization {
    /**
     * A LaunchProfileInitializationActiveDirectory resource.
     */
    activeDirectory?: LaunchProfileInitializationActiveDirectory;
    /**
     * The EC2 security groups that control access to the studio component.
     */
    ec2SecurityGroupIds?: LaunchProfileSecurityGroupIdList;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId?: LaunchProfileId;
    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     */
    launchProfileProtocolVersion?: LaunchProfileProtocolVersion;
    /**
     * The launch purpose.
     */
    launchPurpose?: LaunchPurpose;
    /**
     * The name for the launch profile.
     */
    name?: LaunchProfileName;
    /**
     * The platform of the launch platform, either Windows or Linux.
     */
    platform?: LaunchProfilePlatform;
    /**
     * The system initializtion scripts.
     */
    systemInitializationScripts?: LaunchProfileInitializationScriptList;
    /**
     * The user initializtion scripts.
     */
    userInitializationScripts?: LaunchProfileInitializationScriptList;
  }
  export interface LaunchProfileInitializationActiveDirectory {
    /**
     * A collection of custom attributes for an Active Directory computer.
     */
    computerAttributes?: ActiveDirectoryComputerAttributeList;
    /**
     * The directory ID of the Directory Service for Microsoft Active Directory to access using this launch profile.
     */
    directoryId?: DirectoryId;
    /**
     * The directory name.
     */
    directoryName?: String;
    /**
     * The DNS IP address.
     */
    dnsIpAddresses?: ActiveDirectoryDnsIpAddressList;
    /**
     * The name for the organizational unit distinguished name.
     */
    organizationalUnitDistinguishedName?: ActiveDirectoryOrganizationalUnitDistinguishedName;
    /**
     * The unique identifier for a studio component resource.
     */
    studioComponentId?: StudioComponentId;
    /**
     * The name for the studio component.
     */
    studioComponentName?: StudioComponentName;
  }
  export interface LaunchProfileInitializationScript {
    /**
     * An IAM role attached to a Studio Component that gives the studio component access to Amazon Web Services resources at anytime while the instance is running. 
     */
    runtimeRoleArn?: RoleArn;
    /**
     * The initialization script.
     */
    script?: StudioComponentInitializationScriptContent;
    /**
     * An IAM role attached to Studio Component when the system initialization script runs which give the studio component access to Amazon Web Services resources when the system initialization script runs.
     */
    secureInitializationRoleArn?: RoleArn;
    /**
     * The unique identifier for a studio component resource.
     */
    studioComponentId?: StudioComponentId;
    /**
     * The name for the studio component.
     */
    studioComponentName?: StudioComponentName;
  }
  export type LaunchProfileInitializationScriptList = LaunchProfileInitializationScript[];
  export type LaunchProfileList = LaunchProfile[];
  export interface LaunchProfileMembership {
    /**
     * The ID of the identity store.
     */
    identityStoreId?: String;
    /**
     * The persona.
     */
    persona?: LaunchProfilePersona;
    /**
     * The principal ID.
     */
    principalId?: String;
    /**
     * The Active Directory Security Identifier for this user, if available.
     */
    sid?: String;
  }
  export type LaunchProfileMembershipList = LaunchProfileMembership[];
  export type LaunchProfileName = string;
  export type LaunchProfilePersona = "USER"|string;
  export type LaunchProfilePlatform = "LINUX"|"WINDOWS"|string;
  export type LaunchProfileProtocolVersion = string;
  export type LaunchProfileProtocolVersionList = LaunchProfileProtocolVersion[];
  export type LaunchProfileSecurityGroupIdList = SecurityGroupId[];
  export type LaunchProfileState = "CREATE_IN_PROGRESS"|"READY"|"UPDATE_IN_PROGRESS"|"DELETE_IN_PROGRESS"|"DELETED"|"DELETE_FAILED"|"CREATE_FAILED"|"UPDATE_FAILED"|string;
  export type LaunchProfileStateList = LaunchProfileState[];
  export type LaunchProfileStatusCode = "LAUNCH_PROFILE_CREATED"|"LAUNCH_PROFILE_UPDATED"|"LAUNCH_PROFILE_DELETED"|"LAUNCH_PROFILE_CREATE_IN_PROGRESS"|"LAUNCH_PROFILE_UPDATE_IN_PROGRESS"|"LAUNCH_PROFILE_DELETE_IN_PROGRESS"|"INTERNAL_ERROR"|"STREAMING_IMAGE_NOT_FOUND"|"STREAMING_IMAGE_NOT_READY"|"LAUNCH_PROFILE_WITH_STREAM_SESSIONS_NOT_DELETED"|"ENCRYPTION_KEY_ACCESS_DENIED"|"ENCRYPTION_KEY_NOT_FOUND"|"INVALID_SUBNETS_PROVIDED"|"INVALID_INSTANCE_TYPES_PROVIDED"|"INVALID_SUBNETS_COMBINATION"|string;
  export type LaunchProfileStudioComponentIdList = String[];
  export type LaunchProfileValidationState = "VALIDATION_NOT_STARTED"|"VALIDATION_IN_PROGRESS"|"VALIDATION_SUCCESS"|"VALIDATION_FAILED"|"VALIDATION_FAILED_INTERNAL_SERVER_ERROR"|string;
  export type LaunchProfileValidationStatusCode = "VALIDATION_NOT_STARTED"|"VALIDATION_IN_PROGRESS"|"VALIDATION_SUCCESS"|"VALIDATION_FAILED_INVALID_SUBNET_ROUTE_TABLE_ASSOCIATION"|"VALIDATION_FAILED_SUBNET_NOT_FOUND"|"VALIDATION_FAILED_INVALID_SECURITY_GROUP_ASSOCIATION"|"VALIDATION_FAILED_INVALID_ACTIVE_DIRECTORY"|"VALIDATION_FAILED_UNAUTHORIZED"|"VALIDATION_FAILED_INTERNAL_SERVER_ERROR"|string;
  export type LaunchProfileValidationStatusMessage = string;
  export type LaunchProfileValidationType = "VALIDATE_ACTIVE_DIRECTORY_STUDIO_COMPONENT"|"VALIDATE_SUBNET_ASSOCIATION"|"VALIDATE_NETWORK_ACL_ASSOCIATION"|"VALIDATE_SECURITY_GROUP_ASSOCIATION"|string;
  export type LaunchPurpose = string;
  export interface LicenseServiceConfiguration {
    /**
     * The endpoint of the license service that is accessed by the studio component resource.
     */
    endpoint?: SensitiveString;
  }
  export type LinuxMountPoint = string;
  export interface ListEulaAcceptancesRequest {
    /**
     * The list of EULA IDs that have been previously accepted.
     */
    eulaIds?: StringList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface ListEulaAcceptancesResponse {
    /**
     * A collection of EULA acceptances.
     */
    eulaAcceptances?: EulaAcceptanceList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
  }
  export interface ListEulasRequest {
    /**
     * The list of EULA IDs that should be returned
     */
    eulaIds?: StringList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
  }
  export interface ListEulasResponse {
    /**
     * A collection of EULA resources.
     */
    eulas?: EulaList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
  }
  export interface ListLaunchProfileMembersRequest {
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The max number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface ListLaunchProfileMembersResponse {
    /**
     * A list of members.
     */
    members?: LaunchProfileMembershipList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
  }
  export interface ListLaunchProfilesRequest {
    /**
     * The max number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * The principal ID. This currently supports a IAM Identity Center UserId. 
     */
    principalId?: String;
    /**
     * Filter this request to launch profiles in any of the given states.
     */
    states?: LaunchProfileStateList;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface ListLaunchProfilesResponse {
    /**
     * A collection of launch profiles.
     */
    launchProfiles?: LaunchProfileList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
  }
  export interface ListStreamingImagesRequest {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * Filter this request to streaming images with the given owner
     */
    owner?: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface ListStreamingImagesResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * A collection of streaming images.
     */
    streamingImages?: StreamingImageList;
  }
  export interface ListStreamingSessionBackupsRequest {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * The user ID of the user that owns the streaming session.
     */
    ownedBy?: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface ListStreamingSessionBackupsResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * Information about the streaming session backups.
     */
    streamingSessionBackups?: StreamingSessionBackupList;
  }
  export interface ListStreamingSessionsRequest {
    /**
     * Filters the request to streaming sessions created by the given user.
     */
    createdBy?: String;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * Filters the request to streaming session owned by the given user
     */
    ownedBy?: String;
    /**
     * Filters the request to only the provided session IDs.
     */
    sessionIds?: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface ListStreamingSessionsResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * A collection of streaming sessions.
     */
    sessions?: StreamingSessionList;
  }
  export interface ListStudioComponentsRequest {
    /**
     * The max number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * Filters the request to studio components that are in one of the given states. 
     */
    states?: StudioComponentStateList;
    /**
     * The studio ID. 
     */
    studioId: String;
    /**
     * Filters the request to studio components that are of one of the given types.
     */
    types?: StudioComponentTypeList;
  }
  export interface ListStudioComponentsResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * A collection of studio components.
     */
    studioComponents?: StudioComponentList;
  }
  export interface ListStudioMembersRequest {
    /**
     * The max number of results to return in the response.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface ListStudioMembersResponse {
    /**
     * A list of admin members.
     */
    members?: StudioMembershipList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
  }
  export interface ListStudiosRequest {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
  }
  export interface ListStudiosResponse {
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    nextToken?: String;
    /**
     * A collection of studios.
     */
    studios: StudioList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want to list tags.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
  }
  export type MaxResults = number;
  export interface NewLaunchProfileMember {
    /**
     * The persona.
     */
    persona: LaunchProfilePersona;
    /**
     * The principal ID.
     */
    principalId: String;
  }
  export type NewLaunchProfileMemberList = NewLaunchProfileMember[];
  export interface NewStudioMember {
    /**
     * The persona.
     */
    persona: StudioPersona;
    /**
     * The principal ID.
     */
    principalId: String;
  }
  export type NewStudioMemberList = NewStudioMember[];
  export interface PutLaunchProfileMembersRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The ID of the identity store.
     */
    identityStoreId: String;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * A list of members.
     */
    members: NewLaunchProfileMemberList;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface PutLaunchProfileMembersResponse {
  }
  export interface PutStudioMembersRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The ID of the identity store.
     */
    identityStoreId: String;
    /**
     * A list of members.
     */
    members: NewStudioMemberList;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface PutStudioMembersResponse {
  }
  export type Region = string;
  export type RoleArn = string;
  export type ScriptParameterKey = string;
  export interface ScriptParameterKeyValue {
    /**
     * A script parameter key.
     */
    key?: ScriptParameterKey;
    /**
     * A script parameter value.
     */
    value?: ScriptParameterValue;
  }
  export type ScriptParameterValue = string;
  export type SecurityGroupId = string;
  export type SensitiveString = string;
  export type SessionBackupMode = "AUTOMATIC"|"DEACTIVATED"|string;
  export type SessionPersistenceMode = "DEACTIVATED"|"ACTIVATED"|string;
  export interface SharedFileSystemConfiguration {
    /**
     * The endpoint of the shared file system that is accessed by the studio component resource.
     */
    endpoint?: SensitiveString;
    /**
     * The unique identifier for a file system.
     */
    fileSystemId?: String;
    /**
     * The mount location for a shared file system on a Linux virtual workstation.
     */
    linuxMountPoint?: LinuxMountPoint;
    /**
     * The name of the file share.
     */
    shareName?: SensitiveString;
    /**
     * The mount location for a shared file system on a Windows virtual workstation.
     */
    windowsMountDrive?: WindowsMountDrive;
  }
  export interface StartStreamingSessionRequest {
    /**
     * The ID of the backup.
     */
    backupId?: String;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The streaming session ID for the StartStreamingSessionRequest.
     */
    sessionId: String;
    /**
     * The studio ID for the StartStreamingSessionRequest.
     */
    studioId: String;
  }
  export interface StartStreamingSessionResponse {
    session?: StreamingSession;
  }
  export interface StartStudioSSOConfigurationRepairRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface StartStudioSSOConfigurationRepairResponse {
    /**
     * Information about a studio.
     */
    studio: Studio;
  }
  export interface StopStreamingSessionRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The streaming session ID for the StopStreamingSessionRequest.
     */
    sessionId: String;
    /**
     * The studioId for the StopStreamingSessionRequest.
     */
    studioId: String;
    /**
     * Adds additional instructions to a streaming session stop action to either retain the EBS volumes or delete the EBS volumes.
     */
    volumeRetentionMode?: VolumeRetentionMode;
  }
  export interface StopStreamingSessionResponse {
    session?: StreamingSession;
  }
  export interface StreamConfiguration {
    /**
     * Indicates if a streaming session created from this launch profile should be terminated automatically or retained without termination after being in a STOPPED state.   When ACTIVATED, the streaming session is scheduled for termination after being in the STOPPED state for the time specified in maxStoppedSessionLengthInMinutes.   When DEACTIVATED, the streaming session can remain in the STOPPED state indefinitely.   This parameter is only allowed when sessionPersistenceMode is ACTIVATED. When allowed, the default value for this parameter is DEACTIVATED.
     */
    automaticTerminationMode?: AutomaticTerminationMode;
    /**
     * Allows or deactivates the use of the system clipboard to copy and paste between the streaming session and streaming client.
     */
    clipboardMode: StreamingClipboardMode;
    /**
     * The EC2 instance types that users can select from when launching a streaming session with this launch profile.
     */
    ec2InstanceTypes: StreamingInstanceTypeList;
    /**
     * The length of time, in minutes, that a streaming session can be active before it is stopped or terminated. After this point, Nimble Studio automatically terminates or stops the session. The default length of time is 690 minutes, and the maximum length of time is 30 days.
     */
    maxSessionLengthInMinutes?: StreamConfigurationMaxSessionLengthInMinutes;
    /**
     * Integer that determines if you can start and stop your sessions and how long a session can stay in the STOPPED state. The default value is 0. The maximum value is 5760. This field is allowed only when sessionPersistenceMode is ACTIVATED and automaticTerminationMode is ACTIVATED. If the value is set to 0, your sessions can’t be STOPPED. If you then call StopStreamingSession, the session fails. If the time that a session stays in the READY state exceeds the maxSessionLengthInMinutes value, the session will automatically be terminated (instead of STOPPED). If the value is set to a positive number, the session can be stopped. You can call StopStreamingSession to stop sessions in the READY state. If the time that a session stays in the READY state exceeds the maxSessionLengthInMinutes value, the session will automatically be stopped (instead of terminated).
     */
    maxStoppedSessionLengthInMinutes?: StreamConfigurationMaxStoppedSessionLengthInMinutes;
    /**
     * Information about the streaming session backup.
     */
    sessionBackup?: StreamConfigurationSessionBackup;
    /**
     * Determine if a streaming session created from this launch profile can configure persistent storage. This means that volumeConfiguration and automaticTerminationMode are configured.
     */
    sessionPersistenceMode?: SessionPersistenceMode;
    /**
     * The upload storage for a streaming session.
     */
    sessionStorage?: StreamConfigurationSessionStorage;
    /**
     * The streaming images that users can select from when launching a streaming session with this launch profile.
     */
    streamingImageIds: StreamingImageIdList;
    /**
     * Custom volume configuration for the root volumes that are attached to streaming sessions. This parameter is only allowed when sessionPersistenceMode is ACTIVATED.
     */
    volumeConfiguration?: VolumeConfiguration;
  }
  export interface StreamConfigurationCreate {
    /**
     * Indicates if a streaming session created from this launch profile should be terminated automatically or retained without termination after being in a STOPPED state.   When ACTIVATED, the streaming session is scheduled for termination after being in the STOPPED state for the time specified in maxStoppedSessionLengthInMinutes.   When DEACTIVATED, the streaming session can remain in the STOPPED state indefinitely.   This parameter is only allowed when sessionPersistenceMode is ACTIVATED. When allowed, the default value for this parameter is DEACTIVATED.
     */
    automaticTerminationMode?: AutomaticTerminationMode;
    /**
     * Allows or deactivates the use of the system clipboard to copy and paste between the streaming session and streaming client.
     */
    clipboardMode: StreamingClipboardMode;
    /**
     * The EC2 instance types that users can select from when launching a streaming session with this launch profile.
     */
    ec2InstanceTypes: StreamingInstanceTypeList;
    /**
     * The length of time, in minutes, that a streaming session can be active before it is stopped or terminated. After this point, Nimble Studio automatically terminates or stops the session. The default length of time is 690 minutes, and the maximum length of time is 30 days.
     */
    maxSessionLengthInMinutes?: StreamConfigurationMaxSessionLengthInMinutes;
    /**
     * Integer that determines if you can start and stop your sessions and how long a session can stay in the STOPPED state. The default value is 0. The maximum value is 5760. This field is allowed only when sessionPersistenceMode is ACTIVATED and automaticTerminationMode is ACTIVATED. If the value is set to 0, your sessions can’t be STOPPED. If you then call StopStreamingSession, the session fails. If the time that a session stays in the READY state exceeds the maxSessionLengthInMinutes value, the session will automatically be terminated (instead of STOPPED). If the value is set to a positive number, the session can be stopped. You can call StopStreamingSession to stop sessions in the READY state. If the time that a session stays in the READY state exceeds the maxSessionLengthInMinutes value, the session will automatically be stopped (instead of terminated).
     */
    maxStoppedSessionLengthInMinutes?: StreamConfigurationMaxStoppedSessionLengthInMinutes;
    /**
     * Configures how streaming sessions are backed up when launched from this launch profile.
     */
    sessionBackup?: StreamConfigurationSessionBackup;
    /**
     * Determine if a streaming session created from this launch profile can configure persistent storage. This means that volumeConfiguration and automaticTerminationMode are configured.
     */
    sessionPersistenceMode?: SessionPersistenceMode;
    /**
     * The upload storage for a streaming workstation that is created using this launch profile.
     */
    sessionStorage?: StreamConfigurationSessionStorage;
    /**
     * The streaming images that users can select from when launching a streaming session with this launch profile.
     */
    streamingImageIds: StreamingImageIdList;
    /**
     * Custom volume configuration for the root volumes that are attached to streaming sessions. This parameter is only allowed when sessionPersistenceMode is ACTIVATED.
     */
    volumeConfiguration?: VolumeConfiguration;
  }
  export type StreamConfigurationMaxBackupsToRetain = number;
  export type StreamConfigurationMaxSessionLengthInMinutes = number;
  export type StreamConfigurationMaxStoppedSessionLengthInMinutes = number;
  export interface StreamConfigurationSessionBackup {
    /**
     * The maximum number of backups that each streaming session created from this launch profile can have.
     */
    maxBackupsToRetain?: StreamConfigurationMaxBackupsToRetain;
    /**
     * Specifies how artists sessions are backed up. Configures backups for streaming sessions launched with this launch profile. The default value is DEACTIVATED, which means that backups are deactivated. To allow backups, set this value to AUTOMATIC.
     */
    mode?: SessionBackupMode;
  }
  export interface StreamConfigurationSessionStorage {
    /**
     * Allows artists to upload files to their workstations. The only valid option is UPLOAD.
     */
    mode: StreamingSessionStorageModeList;
    /**
     * The configuration for the upload storage root of the streaming session.
     */
    root?: StreamingSessionStorageRoot;
  }
  export type StreamingClipboardMode = "ENABLED"|"DISABLED"|string;
  export interface StreamingImage {
    /**
     * The Amazon Resource Name (ARN) that is assigned to a studio resource and uniquely identifies it. ARNs are unique across all Regions.
     */
    arn?: String;
    /**
     * A human-readable description of the streaming image.
     */
    description?: StreamingImageDescription;
    /**
     * The ID of an EC2 machine image with which to create the streaming image.
     */
    ec2ImageId?: EC2ImageId;
    /**
     * The encryption configuration.
     */
    encryptionConfiguration?: StreamingImageEncryptionConfiguration;
    /**
     * The list of EULAs that must be accepted before a Streaming Session can be started using this streaming image.
     */
    eulaIds?: EulaIdList;
    /**
     * A friendly name for a streaming image resource.
     */
    name?: StreamingImageName;
    /**
     * The owner of the streaming image, either the studioId that contains the streaming image, or amazon for images that are provided by Amazon Nimble Studio.
     */
    owner?: StreamingImageOwner;
    /**
     * The platform of the streaming image, either Windows or Linux.
     */
    platform?: StreamingImagePlatform;
    /**
     * The current state.
     */
    state?: StreamingImageState;
    /**
     * The status code.
     */
    statusCode?: StreamingImageStatusCode;
    /**
     * The status message for the streaming image.
     */
    statusMessage?: String;
    /**
     * The ID of the streaming image.
     */
    streamingImageId?: StreamingImageId;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
  }
  export type StreamingImageDescription = string;
  export interface StreamingImageEncryptionConfiguration {
    /**
     * The ARN for a KMS key that is used to encrypt studio data.
     */
    keyArn?: StreamingImageEncryptionConfigurationKeyArn;
    /**
     * The type of KMS key that is used to encrypt studio data.
     */
    keyType: StreamingImageEncryptionConfigurationKeyType;
  }
  export type StreamingImageEncryptionConfigurationKeyArn = string;
  export type StreamingImageEncryptionConfigurationKeyType = "CUSTOMER_MANAGED_KEY"|string;
  export type StreamingImageId = string;
  export type StreamingImageIdList = StreamingImageId[];
  export type StreamingImageList = StreamingImage[];
  export type StreamingImageName = string;
  export type StreamingImageOwner = string;
  export type StreamingImagePlatform = string;
  export type StreamingImageState = "CREATE_IN_PROGRESS"|"READY"|"DELETE_IN_PROGRESS"|"DELETED"|"UPDATE_IN_PROGRESS"|"UPDATE_FAILED"|"CREATE_FAILED"|"DELETE_FAILED"|string;
  export type StreamingImageStatusCode = "STREAMING_IMAGE_CREATE_IN_PROGRESS"|"STREAMING_IMAGE_READY"|"STREAMING_IMAGE_DELETE_IN_PROGRESS"|"STREAMING_IMAGE_DELETED"|"STREAMING_IMAGE_UPDATE_IN_PROGRESS"|"INTERNAL_ERROR"|"ACCESS_DENIED"|string;
  export type StreamingInstanceType = "g4dn.xlarge"|"g4dn.2xlarge"|"g4dn.4xlarge"|"g4dn.8xlarge"|"g4dn.12xlarge"|"g4dn.16xlarge"|"g3.4xlarge"|"g3s.xlarge"|"g5.xlarge"|"g5.2xlarge"|"g5.4xlarge"|"g5.8xlarge"|"g5.16xlarge"|string;
  export type StreamingInstanceTypeList = StreamingInstanceType[];
  export interface StreamingSession {
    /**
     * The Amazon Resource Name (ARN) that is assigned to a studio resource and uniquely identifies it. ARNs are unique across all Regions.
     */
    arn?: String;
    /**
     * Indicates if a streaming session created from this launch profile should be terminated automatically or retained without termination after being in a STOPPED state.   When ACTIVATED, the streaming session is scheduled for termination after being in the STOPPED state for the time specified in maxStoppedSessionLengthInMinutes.   When DEACTIVATED, the streaming session can remain in the STOPPED state indefinitely.   This parameter is only allowed when sessionPersistenceMode is ACTIVATED. When allowed, the default value for this parameter is DEACTIVATED.
     */
    automaticTerminationMode?: AutomaticTerminationMode;
    /**
     * Shows the current backup setting of the session.
     */
    backupMode?: SessionBackupMode;
    /**
     * The ISO timestamp in seconds for when the resource was created.
     */
    createdAt?: Timestamp;
    /**
     * The user ID of the user that created the streaming session.
     */
    createdBy?: String;
    /**
     * The EC2 Instance type used for the streaming session.
     */
    ec2InstanceType?: String;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId?: String;
    /**
     * The maximum number of backups of a streaming session that you can have. When the maximum number of backups is reached, the oldest backup is deleted.
     */
    maxBackupsToRetain?: StreamConfigurationMaxBackupsToRetain;
    /**
     * The user ID of the user that owns the streaming session. The user that owns the session will be logging into the session and interacting with the virtual workstation.
     */
    ownedBy?: String;
    /**
     * The session ID.
     */
    sessionId?: StreamingSessionId;
    /**
     * Determine if a streaming session created from this launch profile can configure persistent storage. This means that volumeConfiguration and automaticTerminationMode are configured.
     */
    sessionPersistenceMode?: SessionPersistenceMode;
    /**
     * The time the session entered START_IN_PROGRESS state.
     */
    startedAt?: Timestamp;
    /**
     * The user ID of the user that started the streaming session.
     */
    startedBy?: String;
    /**
     * The backup ID used to restore a streaming session.
     */
    startedFromBackupId?: String;
    /**
     * The current state.
     */
    state?: StreamingSessionState;
    /**
     * The status code.
     */
    statusCode?: StreamingSessionStatusCode;
    /**
     * The status message for the streaming session.
     */
    statusMessage?: String;
    /**
     * The time the streaming session will automatically be stopped if the user doesn’t stop the session themselves. 
     */
    stopAt?: Timestamp;
    /**
     * The time the session entered STOP_IN_PROGRESS state.
     */
    stoppedAt?: Timestamp;
    /**
     * The user ID of the user that stopped the streaming session.
     */
    stoppedBy?: String;
    /**
     * The ID of the streaming image.
     */
    streamingImageId?: StreamingImageId;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
    /**
     * The time the streaming session will automatically terminate if not terminated by the user.
     */
    terminateAt?: Timestamp;
    /**
     * The ISO timestamp in seconds for when the resource was updated.
     */
    updatedAt?: Timestamp;
    /**
     * The user ID of the user that most recently updated the resource.
     */
    updatedBy?: String;
    /**
     * Custom volume configuration for the root volumes that are attached to streaming sessions. This parameter is only allowed when sessionPersistenceMode is ACTIVATED.
     */
    volumeConfiguration?: VolumeConfiguration;
    /**
     * Determine if an EBS volume created from this streaming session will be backed up.
     */
    volumeRetentionMode?: VolumeRetentionMode;
  }
  export interface StreamingSessionBackup {
    /**
     * The Amazon Resource Name (ARN) that is assigned to a studio resource and uniquely identifies it. ARNs are unique across all Regions.
     */
    arn?: String;
    /**
     * The ID of the backup.
     */
    backupId?: String;
    /**
     * The ISO timestamp in for when the resource was created.
     */
    createdAt?: Timestamp;
    /**
     * The ID of the launch profile which allowed the backups for the streaming session.
     */
    launchProfileId?: String;
    /**
     * The user ID of the user that owns the streaming session.
     */
    ownedBy?: String;
    /**
     * The streaming session ID for the StreamingSessionBackup.
     */
    sessionId?: StreamingSessionId;
    state?: StreamingSessionState;
    /**
     * The status code.
     */
    statusCode?: StreamingSessionStatusCode;
    /**
     * The status message for the streaming session backup.
     */
    statusMessage?: String;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
  }
  export type StreamingSessionBackupList = StreamingSessionBackup[];
  export type StreamingSessionId = string;
  export type StreamingSessionList = StreamingSession[];
  export type StreamingSessionState = "CREATE_IN_PROGRESS"|"DELETE_IN_PROGRESS"|"READY"|"DELETED"|"CREATE_FAILED"|"DELETE_FAILED"|"STOP_IN_PROGRESS"|"START_IN_PROGRESS"|"STOPPED"|"STOP_FAILED"|"START_FAILED"|string;
  export type StreamingSessionStatusCode = "STREAMING_SESSION_READY"|"STREAMING_SESSION_DELETED"|"STREAMING_SESSION_CREATE_IN_PROGRESS"|"STREAMING_SESSION_DELETE_IN_PROGRESS"|"INTERNAL_ERROR"|"INSUFFICIENT_CAPACITY"|"ACTIVE_DIRECTORY_DOMAIN_JOIN_ERROR"|"NETWORK_CONNECTION_ERROR"|"INITIALIZATION_SCRIPT_ERROR"|"DECRYPT_STREAMING_IMAGE_ERROR"|"NETWORK_INTERFACE_ERROR"|"STREAMING_SESSION_STOPPED"|"STREAMING_SESSION_STARTED"|"STREAMING_SESSION_STOP_IN_PROGRESS"|"STREAMING_SESSION_START_IN_PROGRESS"|"AMI_VALIDATION_ERROR"|string;
  export type StreamingSessionStorageMode = "UPLOAD"|string;
  export type StreamingSessionStorageModeList = StreamingSessionStorageMode[];
  export interface StreamingSessionStorageRoot {
    /**
     * The folder path in Linux workstations where files are uploaded.
     */
    linux?: StreamingSessionStorageRootPathLinux;
    /**
     * The folder path in Windows workstations where files are uploaded.
     */
    windows?: StreamingSessionStorageRootPathWindows;
  }
  export type StreamingSessionStorageRootPathLinux = string;
  export type StreamingSessionStorageRootPathWindows = string;
  export interface StreamingSessionStream {
    /**
     * The ISO timestamp in seconds for when the resource was created.
     */
    createdAt?: Timestamp;
    /**
     * The user ID of the user that created the streaming session stream.
     */
    createdBy?: String;
    /**
     * The ISO timestamp in seconds for when the resource expires.
     */
    expiresAt?: Timestamp;
    /**
     * The user ID of the user that owns the streaming session. The user that owns the session will be logging into the session and interacting with the virtual workstation.
     */
    ownedBy?: String;
    /**
     * The current state.
     */
    state?: StreamingSessionStreamState;
    /**
     * The streaming session stream status code.
     */
    statusCode?: StreamingSessionStreamStatusCode;
    /**
     * The stream ID.
     */
    streamId?: String;
    /**
     * The URL to connect to this stream using the DCV client.
     */
    url?: SensitiveString;
  }
  export type StreamingSessionStreamExpirationInSeconds = number;
  export type StreamingSessionStreamState = "READY"|"CREATE_IN_PROGRESS"|"DELETE_IN_PROGRESS"|"DELETED"|"CREATE_FAILED"|"DELETE_FAILED"|string;
  export type StreamingSessionStreamStatusCode = "STREAM_CREATE_IN_PROGRESS"|"STREAM_READY"|"STREAM_DELETE_IN_PROGRESS"|"STREAM_DELETED"|"INTERNAL_ERROR"|"NETWORK_CONNECTION_ERROR"|string;
  export type String = string;
  export type StringList = String[];
  export interface Studio {
    /**
     * The IAM role that studio admins assume when logging in to the Nimble Studio portal.
     */
    adminRoleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a studio resource and uniquely identifies it. ARNs are unique across all Regions.
     */
    arn?: String;
    /**
     * The ISO timestamp in seconds for when the resource was created.
     */
    createdAt?: Timestamp;
    /**
     * A friendly name for the studio.
     */
    displayName?: StudioDisplayName;
    /**
     * The Amazon Web Services Region where the studio resource is located.
     */
    homeRegion?: Region;
    /**
     * The IAM Identity Center application client ID used to integrate with IAM Identity Center. This ID allows IAM Identity Center users to log in to Nimble Studio portal.
     */
    ssoClientId?: String;
    /**
     * The current state of the studio resource.
     */
    state?: StudioState;
    /**
     * Status codes that provide additional detail on the studio state.
     */
    statusCode?: StudioStatusCode;
    /**
     * Additional detail on the studio state.
     */
    statusMessage?: String;
    /**
     * Configuration of the encryption method that is used for the studio.
     */
    studioEncryptionConfiguration?: StudioEncryptionConfiguration;
    /**
     * The unique identifier for a studio resource. In Nimble Studio, all other resources are contained in a studio resource.
     */
    studioId?: String;
    /**
     * The name of the studio, as included in the URL when accessing it in the Nimble Studio portal.
     */
    studioName?: StudioName;
    /**
     * The address of the web page for the studio.
     */
    studioUrl?: String;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
    /**
     * The ISO timestamp in seconds for when the resource was updated.
     */
    updatedAt?: Timestamp;
    /**
     * The IAM role that studio users assume when logging in to the Nimble Studio portal.
     */
    userRoleArn?: RoleArn;
  }
  export interface StudioComponent {
    /**
     * The Amazon Resource Name (ARN) that is assigned to a studio resource and uniquely identifies it. ARNs are unique across all Regions.
     */
    arn?: String;
    /**
     * The configuration of the studio component, based on component type.
     */
    configuration?: StudioComponentConfiguration;
    /**
     * The ISO timestamp in seconds for when the resource was created.
     */
    createdAt?: Timestamp;
    /**
     * The user ID of the user that created the studio component.
     */
    createdBy?: String;
    /**
     * A human-readable description for the studio component resource.
     */
    description?: StudioComponentDescription;
    /**
     * The EC2 security groups that control access to the studio component.
     */
    ec2SecurityGroupIds?: StudioComponentSecurityGroupIdList;
    /**
     * Initialization scripts for studio components.
     */
    initializationScripts?: StudioComponentInitializationScriptList;
    /**
     * A friendly name for the studio component resource.
     */
    name?: StudioComponentName;
    /**
     * An IAM role attached to a Studio Component that gives the studio component access to Amazon Web Services resources at anytime while the instance is running. 
     */
    runtimeRoleArn?: RoleArn;
    /**
     * Parameters for the studio component scripts.
     */
    scriptParameters?: StudioComponentScriptParameterKeyValueList;
    /**
     * An IAM role attached to Studio Component when the system initialization script runs which give the studio component access to Amazon Web Services resources when the system initialization script runs.
     */
    secureInitializationRoleArn?: RoleArn;
    /**
     * The current state.
     */
    state?: StudioComponentState;
    /**
     * The status code.
     */
    statusCode?: StudioComponentStatusCode;
    /**
     * The status message for the studio component.
     */
    statusMessage?: String;
    /**
     * The unique identifier for a studio component resource.
     */
    studioComponentId?: StudioComponentId;
    /**
     * The specific subtype of a studio component.
     */
    subtype?: StudioComponentSubtype;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
    /**
     * The type of the studio component.
     */
    type?: StudioComponentType;
    /**
     * The ISO timestamp in seconds for when the resource was updated.
     */
    updatedAt?: Timestamp;
    /**
     * The user ID of the user that most recently updated the resource.
     */
    updatedBy?: String;
  }
  export interface StudioComponentConfiguration {
    /**
     * The configuration for a Directory Service for Microsoft Active Directory studio resource.
     */
    activeDirectoryConfiguration?: ActiveDirectoryConfiguration;
    /**
     * The configuration for a render farm that is associated with a studio resource.
     */
    computeFarmConfiguration?: ComputeFarmConfiguration;
    /**
     * The configuration for a license service that is associated with a studio resource.
     */
    licenseServiceConfiguration?: LicenseServiceConfiguration;
    /**
     * The configuration for a shared file storage system that is associated with a studio resource.
     */
    sharedFileSystemConfiguration?: SharedFileSystemConfiguration;
  }
  export type StudioComponentDescription = string;
  export type StudioComponentId = string;
  export interface StudioComponentInitializationScript {
    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     */
    launchProfileProtocolVersion?: LaunchProfileProtocolVersion;
    /**
     * The platform of the initialization script, either Windows or Linux.
     */
    platform?: LaunchProfilePlatform;
    /**
     * The method to use when running the initialization script.
     */
    runContext?: StudioComponentInitializationScriptRunContext;
    /**
     * The initialization script.
     */
    script?: StudioComponentInitializationScriptContent;
  }
  export type StudioComponentInitializationScriptContent = string;
  export type StudioComponentInitializationScriptList = StudioComponentInitializationScript[];
  export type StudioComponentInitializationScriptRunContext = "SYSTEM_INITIALIZATION"|"USER_INITIALIZATION"|string;
  export type StudioComponentList = StudioComponent[];
  export type StudioComponentName = string;
  export type StudioComponentScriptParameterKeyValueList = ScriptParameterKeyValue[];
  export type StudioComponentSecurityGroupIdList = SecurityGroupId[];
  export type StudioComponentState = "CREATE_IN_PROGRESS"|"READY"|"UPDATE_IN_PROGRESS"|"DELETE_IN_PROGRESS"|"DELETED"|"DELETE_FAILED"|"CREATE_FAILED"|"UPDATE_FAILED"|string;
  export type StudioComponentStateList = StudioComponentState[];
  export type StudioComponentStatusCode = "ACTIVE_DIRECTORY_ALREADY_EXISTS"|"STUDIO_COMPONENT_CREATED"|"STUDIO_COMPONENT_UPDATED"|"STUDIO_COMPONENT_DELETED"|"ENCRYPTION_KEY_ACCESS_DENIED"|"ENCRYPTION_KEY_NOT_FOUND"|"STUDIO_COMPONENT_CREATE_IN_PROGRESS"|"STUDIO_COMPONENT_UPDATE_IN_PROGRESS"|"STUDIO_COMPONENT_DELETE_IN_PROGRESS"|"INTERNAL_ERROR"|string;
  export type StudioComponentSubtype = "AWS_MANAGED_MICROSOFT_AD"|"AMAZON_FSX_FOR_WINDOWS"|"AMAZON_FSX_FOR_LUSTRE"|"CUSTOM"|string;
  export interface StudioComponentSummary {
    /**
     * The ISO timestamp in seconds for when the resource was created.
     */
    createdAt?: Timestamp;
    /**
     * The user ID of the user that created the studio component.
     */
    createdBy?: String;
    /**
     * The description.
     */
    description?: StudioComponentDescription;
    /**
     * The name for the studio component.
     */
    name?: StudioComponentName;
    /**
     * The unique identifier for a studio component resource.
     */
    studioComponentId?: StudioComponentId;
    /**
     * The specific subtype of a studio component.
     */
    subtype?: StudioComponentSubtype;
    /**
     * The type of the studio component.
     */
    type?: StudioComponentType;
    /**
     * The ISO timestamp in seconds for when the resource was updated.
     */
    updatedAt?: Timestamp;
    /**
     * The user ID of the user that most recently updated the resource.
     */
    updatedBy?: String;
  }
  export type StudioComponentSummaryList = StudioComponentSummary[];
  export type StudioComponentType = "ACTIVE_DIRECTORY"|"SHARED_FILE_SYSTEM"|"COMPUTE_FARM"|"LICENSE_SERVICE"|"CUSTOM"|string;
  export type StudioComponentTypeList = StudioComponentType[];
  export type StudioDisplayName = string;
  export interface StudioEncryptionConfiguration {
    /**
     * The ARN for a KMS key that is used to encrypt studio data.
     */
    keyArn?: StudioEncryptionConfigurationKeyArn;
    /**
     * The type of KMS key that is used to encrypt studio data.
     */
    keyType: StudioEncryptionConfigurationKeyType;
  }
  export type StudioEncryptionConfigurationKeyArn = string;
  export type StudioEncryptionConfigurationKeyType = "AWS_OWNED_KEY"|"CUSTOMER_MANAGED_KEY"|string;
  export type StudioList = Studio[];
  export interface StudioMembership {
    /**
     * The ID of the identity store.
     */
    identityStoreId?: String;
    /**
     * The persona.
     */
    persona?: StudioPersona;
    /**
     * The principal ID.
     */
    principalId?: String;
    /**
     * The Active Directory Security Identifier for this user, if available.
     */
    sid?: String;
  }
  export type StudioMembershipList = StudioMembership[];
  export type StudioName = string;
  export type StudioPersona = "ADMINISTRATOR"|string;
  export type StudioState = "CREATE_IN_PROGRESS"|"READY"|"UPDATE_IN_PROGRESS"|"DELETE_IN_PROGRESS"|"DELETED"|"DELETE_FAILED"|"CREATE_FAILED"|"UPDATE_FAILED"|string;
  export type StudioStatusCode = "STUDIO_CREATED"|"STUDIO_DELETED"|"STUDIO_UPDATED"|"STUDIO_CREATE_IN_PROGRESS"|"STUDIO_UPDATE_IN_PROGRESS"|"STUDIO_DELETE_IN_PROGRESS"|"STUDIO_WITH_LAUNCH_PROFILES_NOT_DELETED"|"STUDIO_WITH_STUDIO_COMPONENTS_NOT_DELETED"|"STUDIO_WITH_STREAMING_IMAGES_NOT_DELETED"|"AWS_SSO_NOT_ENABLED"|"AWS_SSO_ACCESS_DENIED"|"ROLE_NOT_OWNED_BY_STUDIO_OWNER"|"ROLE_COULD_NOT_BE_ASSUMED"|"INTERNAL_ERROR"|"ENCRYPTION_KEY_NOT_FOUND"|"ENCRYPTION_KEY_ACCESS_DENIED"|"AWS_SSO_CONFIGURATION_REPAIRED"|"AWS_SSO_CONFIGURATION_REPAIR_IN_PROGRESS"|"AWS_STS_REGION_DISABLED"|string;
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource you want to add tags to. 
     */
    resourceArn: String;
    /**
     * A collection of labels, in the form of key-value pairs, that apply to this resource.
     */
    tags?: Tags;
  }
  export interface TagResourceResponse {
  }
  export type Tags = {[key: string]: String};
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * Identifies the Amazon Resource Name(ARN) key from which you are removing tags. 
     */
    resourceArn: String;
    /**
     * One or more tag keys. Specify only the tag keys, not the tag values.
     */
    tagKeys: StringList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateLaunchProfileMemberRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The persona.
     */
    persona: LaunchProfilePersona;
    /**
     * The principal ID. This currently supports a IAM Identity Center UserId. 
     */
    principalId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface UpdateLaunchProfileMemberResponse {
    /**
     * The updated member. 
     */
    member?: LaunchProfileMembership;
  }
  export interface UpdateLaunchProfileRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The description.
     */
    description?: LaunchProfileDescription;
    /**
     * The ID of the launch profile used to control access from the streaming session.
     */
    launchProfileId: String;
    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     */
    launchProfileProtocolVersions?: LaunchProfileProtocolVersionList;
    /**
     * The name for the launch profile.
     */
    name?: LaunchProfileName;
    /**
     * A configuration for a streaming session.
     */
    streamConfiguration?: StreamConfigurationCreate;
    /**
     * Unique identifiers for a collection of studio components that can be used with this launch profile.
     */
    studioComponentIds?: LaunchProfileStudioComponentIdList;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface UpdateLaunchProfileResponse {
    /**
     * The launch profile.
     */
    launchProfile?: LaunchProfile;
  }
  export interface UpdateStreamingImageRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The description.
     */
    description?: StreamingImageDescription;
    /**
     * The name for the streaming image.
     */
    name?: StreamingImageName;
    /**
     * The streaming image ID.
     */
    streamingImageId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
  }
  export interface UpdateStreamingImageResponse {
    streamingImage?: StreamingImage;
  }
  export interface UpdateStudioComponentRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The configuration of the studio component, based on component type.
     */
    configuration?: StudioComponentConfiguration;
    /**
     * The description.
     */
    description?: StudioComponentDescription;
    /**
     * The EC2 security groups that control access to the studio component.
     */
    ec2SecurityGroupIds?: StudioComponentSecurityGroupIdList;
    /**
     * Initialization scripts for studio components.
     */
    initializationScripts?: StudioComponentInitializationScriptList;
    /**
     * The name for the studio component.
     */
    name?: StudioComponentName;
    /**
     * An IAM role attached to a Studio Component that gives the studio component access to Amazon Web Services resources at anytime while the instance is running. 
     */
    runtimeRoleArn?: RoleArn;
    /**
     * Parameters for the studio component scripts.
     */
    scriptParameters?: StudioComponentScriptParameterKeyValueList;
    /**
     * An IAM role attached to Studio Component when the system initialization script runs which give the studio component access to Amazon Web Services resources when the system initialization script runs.
     */
    secureInitializationRoleArn?: RoleArn;
    /**
     * The studio component ID.
     */
    studioComponentId: String;
    /**
     * The studio ID. 
     */
    studioId: String;
    /**
     * The specific subtype of a studio component.
     */
    subtype?: StudioComponentSubtype;
    /**
     * The type of the studio component.
     */
    type?: StudioComponentType;
  }
  export interface UpdateStudioComponentResponse {
    /**
     * Information about the studio component.
     */
    studioComponent?: StudioComponent;
  }
  export interface UpdateStudioRequest {
    /**
     * The IAM role that Studio Admins will assume when logging in to the Nimble Studio portal.
     */
    adminRoleArn?: RoleArn;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you don’t specify a client token, the Amazon Web Services SDK automatically generates a client token and uses it for the request to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * A friendly name for the studio.
     */
    displayName?: StudioDisplayName;
    /**
     * The studio ID. 
     */
    studioId: String;
    /**
     * The IAM role that Studio Users will assume when logging in to the Nimble Studio portal.
     */
    userRoleArn?: RoleArn;
  }
  export interface UpdateStudioResponse {
    /**
     * Information about a studio.
     */
    studio: Studio;
  }
  export interface ValidationResult {
    /**
     * The current state.
     */
    state: LaunchProfileValidationState;
    /**
     * The status code. This will contain the failure reason if the state is VALIDATION_FAILED.
     */
    statusCode: LaunchProfileValidationStatusCode;
    /**
     * The status message for the validation result.
     */
    statusMessage: LaunchProfileValidationStatusMessage;
    /**
     * The type of the validation result.
     */
    type: LaunchProfileValidationType;
  }
  export type ValidationResults = ValidationResult[];
  export interface VolumeConfiguration {
    /**
     * The number of I/O operations per second for the root volume that is attached to streaming session.
     */
    iops?: VolumeIops;
    /**
     * The size of the root volume that is attached to the streaming session. The root volume size is measured in GiBs.
     */
    size?: VolumeSizeInGiB;
    /**
     * The throughput to provision for the root volume that is attached to the streaming session. The throughput is measured in MiB/s.
     */
    throughput?: VolumeThroughputInMiBs;
  }
  export type VolumeIops = number;
  export type VolumeRetentionMode = "RETAIN"|"DELETE"|string;
  export type VolumeSizeInGiB = number;
  export type VolumeThroughputInMiBs = number;
  export type WindowsMountDrive = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Nimble client.
   */
  export import Types = Nimble;
}
export = Nimble;
