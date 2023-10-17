import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ChimeSDKIdentity extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ChimeSDKIdentity.Types.ClientConfiguration)
  config: Config & ChimeSDKIdentity.Types.ClientConfiguration;
  /**
   * Creates an Amazon Chime SDK messaging AppInstance under an AWS account. Only SDK messaging customers use this API. CreateAppInstance supports idempotency behavior as described in the AWS API Standard. identity
   */
  createAppInstance(params: ChimeSDKIdentity.Types.CreateAppInstanceRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.CreateAppInstanceResponse) => void): Request<ChimeSDKIdentity.Types.CreateAppInstanceResponse, AWSError>;
  /**
   * Creates an Amazon Chime SDK messaging AppInstance under an AWS account. Only SDK messaging customers use this API. CreateAppInstance supports idempotency behavior as described in the AWS API Standard. identity
   */
  createAppInstance(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.CreateAppInstanceResponse) => void): Request<ChimeSDKIdentity.Types.CreateAppInstanceResponse, AWSError>;
  /**
   * Promotes an AppInstanceUser to an AppInstanceAdmin. The promoted user can perform the following actions.     ChannelModerator actions across all channels in the AppInstance.    DeleteChannelMessage actions.   Only an AppInstanceUser can be promoted to an AppInstanceAdmin role.
   */
  createAppInstanceAdmin(params: ChimeSDKIdentity.Types.CreateAppInstanceAdminRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.CreateAppInstanceAdminResponse) => void): Request<ChimeSDKIdentity.Types.CreateAppInstanceAdminResponse, AWSError>;
  /**
   * Promotes an AppInstanceUser to an AppInstanceAdmin. The promoted user can perform the following actions.     ChannelModerator actions across all channels in the AppInstance.    DeleteChannelMessage actions.   Only an AppInstanceUser can be promoted to an AppInstanceAdmin role.
   */
  createAppInstanceAdmin(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.CreateAppInstanceAdminResponse) => void): Request<ChimeSDKIdentity.Types.CreateAppInstanceAdminResponse, AWSError>;
  /**
   * Creates a user under an Amazon Chime AppInstance. The request consists of a unique appInstanceUserId and Name for that user.
   */
  createAppInstanceUser(params: ChimeSDKIdentity.Types.CreateAppInstanceUserRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.CreateAppInstanceUserResponse) => void): Request<ChimeSDKIdentity.Types.CreateAppInstanceUserResponse, AWSError>;
  /**
   * Creates a user under an Amazon Chime AppInstance. The request consists of a unique appInstanceUserId and Name for that user.
   */
  createAppInstanceUser(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.CreateAppInstanceUserResponse) => void): Request<ChimeSDKIdentity.Types.CreateAppInstanceUserResponse, AWSError>;
  /**
   * Deletes an AppInstance and all associated data asynchronously.
   */
  deleteAppInstance(params: ChimeSDKIdentity.Types.DeleteAppInstanceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AppInstance and all associated data asynchronously.
   */
  deleteAppInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Demotes an AppInstanceAdmin to an AppInstanceUser. This action does not delete the user.
   */
  deleteAppInstanceAdmin(params: ChimeSDKIdentity.Types.DeleteAppInstanceAdminRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Demotes an AppInstanceAdmin to an AppInstanceUser. This action does not delete the user.
   */
  deleteAppInstanceAdmin(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AppInstanceUser.
   */
  deleteAppInstanceUser(params: ChimeSDKIdentity.Types.DeleteAppInstanceUserRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AppInstanceUser.
   */
  deleteAppInstanceUser(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deregisters an AppInstanceUserEndpoint.
   */
  deregisterAppInstanceUserEndpoint(params: ChimeSDKIdentity.Types.DeregisterAppInstanceUserEndpointRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deregisters an AppInstanceUserEndpoint.
   */
  deregisterAppInstanceUserEndpoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns the full details of an AppInstance.
   */
  describeAppInstance(params: ChimeSDKIdentity.Types.DescribeAppInstanceRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.DescribeAppInstanceResponse) => void): Request<ChimeSDKIdentity.Types.DescribeAppInstanceResponse, AWSError>;
  /**
   * Returns the full details of an AppInstance.
   */
  describeAppInstance(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.DescribeAppInstanceResponse) => void): Request<ChimeSDKIdentity.Types.DescribeAppInstanceResponse, AWSError>;
  /**
   * Returns the full details of an AppInstanceAdmin.
   */
  describeAppInstanceAdmin(params: ChimeSDKIdentity.Types.DescribeAppInstanceAdminRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.DescribeAppInstanceAdminResponse) => void): Request<ChimeSDKIdentity.Types.DescribeAppInstanceAdminResponse, AWSError>;
  /**
   * Returns the full details of an AppInstanceAdmin.
   */
  describeAppInstanceAdmin(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.DescribeAppInstanceAdminResponse) => void): Request<ChimeSDKIdentity.Types.DescribeAppInstanceAdminResponse, AWSError>;
  /**
   * Returns the full details of an AppInstanceUser.
   */
  describeAppInstanceUser(params: ChimeSDKIdentity.Types.DescribeAppInstanceUserRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.DescribeAppInstanceUserResponse) => void): Request<ChimeSDKIdentity.Types.DescribeAppInstanceUserResponse, AWSError>;
  /**
   * Returns the full details of an AppInstanceUser.
   */
  describeAppInstanceUser(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.DescribeAppInstanceUserResponse) => void): Request<ChimeSDKIdentity.Types.DescribeAppInstanceUserResponse, AWSError>;
  /**
   * Returns the full details of an AppInstanceUserEndpoint.
   */
  describeAppInstanceUserEndpoint(params: ChimeSDKIdentity.Types.DescribeAppInstanceUserEndpointRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.DescribeAppInstanceUserEndpointResponse) => void): Request<ChimeSDKIdentity.Types.DescribeAppInstanceUserEndpointResponse, AWSError>;
  /**
   * Returns the full details of an AppInstanceUserEndpoint.
   */
  describeAppInstanceUserEndpoint(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.DescribeAppInstanceUserEndpointResponse) => void): Request<ChimeSDKIdentity.Types.DescribeAppInstanceUserEndpointResponse, AWSError>;
  /**
   * Gets the retention settings for an AppInstance.
   */
  getAppInstanceRetentionSettings(params: ChimeSDKIdentity.Types.GetAppInstanceRetentionSettingsRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.GetAppInstanceRetentionSettingsResponse) => void): Request<ChimeSDKIdentity.Types.GetAppInstanceRetentionSettingsResponse, AWSError>;
  /**
   * Gets the retention settings for an AppInstance.
   */
  getAppInstanceRetentionSettings(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.GetAppInstanceRetentionSettingsResponse) => void): Request<ChimeSDKIdentity.Types.GetAppInstanceRetentionSettingsResponse, AWSError>;
  /**
   * Returns a list of the administrators in the AppInstance.
   */
  listAppInstanceAdmins(params: ChimeSDKIdentity.Types.ListAppInstanceAdminsRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListAppInstanceAdminsResponse) => void): Request<ChimeSDKIdentity.Types.ListAppInstanceAdminsResponse, AWSError>;
  /**
   * Returns a list of the administrators in the AppInstance.
   */
  listAppInstanceAdmins(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListAppInstanceAdminsResponse) => void): Request<ChimeSDKIdentity.Types.ListAppInstanceAdminsResponse, AWSError>;
  /**
   * Lists all the AppInstanceUserEndpoints created under a single AppInstanceUser.
   */
  listAppInstanceUserEndpoints(params: ChimeSDKIdentity.Types.ListAppInstanceUserEndpointsRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListAppInstanceUserEndpointsResponse) => void): Request<ChimeSDKIdentity.Types.ListAppInstanceUserEndpointsResponse, AWSError>;
  /**
   * Lists all the AppInstanceUserEndpoints created under a single AppInstanceUser.
   */
  listAppInstanceUserEndpoints(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListAppInstanceUserEndpointsResponse) => void): Request<ChimeSDKIdentity.Types.ListAppInstanceUserEndpointsResponse, AWSError>;
  /**
   * List all AppInstanceUsers created under a single AppInstance.
   */
  listAppInstanceUsers(params: ChimeSDKIdentity.Types.ListAppInstanceUsersRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListAppInstanceUsersResponse) => void): Request<ChimeSDKIdentity.Types.ListAppInstanceUsersResponse, AWSError>;
  /**
   * List all AppInstanceUsers created under a single AppInstance.
   */
  listAppInstanceUsers(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListAppInstanceUsersResponse) => void): Request<ChimeSDKIdentity.Types.ListAppInstanceUsersResponse, AWSError>;
  /**
   * Lists all Amazon Chime AppInstances created under a single AWS account.
   */
  listAppInstances(params: ChimeSDKIdentity.Types.ListAppInstancesRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListAppInstancesResponse) => void): Request<ChimeSDKIdentity.Types.ListAppInstancesResponse, AWSError>;
  /**
   * Lists all Amazon Chime AppInstances created under a single AWS account.
   */
  listAppInstances(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListAppInstancesResponse) => void): Request<ChimeSDKIdentity.Types.ListAppInstancesResponse, AWSError>;
  /**
   * Lists the tags applied to an Amazon Chime SDK identity resource.
   */
  listTagsForResource(params: ChimeSDKIdentity.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKIdentity.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags applied to an Amazon Chime SDK identity resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.ListTagsForResourceResponse) => void): Request<ChimeSDKIdentity.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Sets the amount of time in days that a given AppInstance retains data.
   */
  putAppInstanceRetentionSettings(params: ChimeSDKIdentity.Types.PutAppInstanceRetentionSettingsRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.PutAppInstanceRetentionSettingsResponse) => void): Request<ChimeSDKIdentity.Types.PutAppInstanceRetentionSettingsResponse, AWSError>;
  /**
   * Sets the amount of time in days that a given AppInstance retains data.
   */
  putAppInstanceRetentionSettings(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.PutAppInstanceRetentionSettingsResponse) => void): Request<ChimeSDKIdentity.Types.PutAppInstanceRetentionSettingsResponse, AWSError>;
  /**
   * Registers an endpoint under an Amazon Chime AppInstanceUser. The endpoint receives messages for a user. For push notifications, the endpoint is a mobile device used to receive mobile push notifications for a user.
   */
  registerAppInstanceUserEndpoint(params: ChimeSDKIdentity.Types.RegisterAppInstanceUserEndpointRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.RegisterAppInstanceUserEndpointResponse) => void): Request<ChimeSDKIdentity.Types.RegisterAppInstanceUserEndpointResponse, AWSError>;
  /**
   * Registers an endpoint under an Amazon Chime AppInstanceUser. The endpoint receives messages for a user. For push notifications, the endpoint is a mobile device used to receive mobile push notifications for a user.
   */
  registerAppInstanceUserEndpoint(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.RegisterAppInstanceUserEndpointResponse) => void): Request<ChimeSDKIdentity.Types.RegisterAppInstanceUserEndpointResponse, AWSError>;
  /**
   * Applies the specified tags to the specified Amazon Chime SDK identity resource.
   */
  tagResource(params: ChimeSDKIdentity.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Applies the specified tags to the specified Amazon Chime SDK identity resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified Amazon Chime SDK identity resource.
   */
  untagResource(params: ChimeSDKIdentity.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified tags from the specified Amazon Chime SDK identity resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates AppInstance metadata.
   */
  updateAppInstance(params: ChimeSDKIdentity.Types.UpdateAppInstanceRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.UpdateAppInstanceResponse) => void): Request<ChimeSDKIdentity.Types.UpdateAppInstanceResponse, AWSError>;
  /**
   * Updates AppInstance metadata.
   */
  updateAppInstance(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.UpdateAppInstanceResponse) => void): Request<ChimeSDKIdentity.Types.UpdateAppInstanceResponse, AWSError>;
  /**
   * Updates the details of an AppInstanceUser. You can update names and metadata.
   */
  updateAppInstanceUser(params: ChimeSDKIdentity.Types.UpdateAppInstanceUserRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.UpdateAppInstanceUserResponse) => void): Request<ChimeSDKIdentity.Types.UpdateAppInstanceUserResponse, AWSError>;
  /**
   * Updates the details of an AppInstanceUser. You can update names and metadata.
   */
  updateAppInstanceUser(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.UpdateAppInstanceUserResponse) => void): Request<ChimeSDKIdentity.Types.UpdateAppInstanceUserResponse, AWSError>;
  /**
   * Updates the details of an AppInstanceUserEndpoint. You can update the name and AllowMessage values.
   */
  updateAppInstanceUserEndpoint(params: ChimeSDKIdentity.Types.UpdateAppInstanceUserEndpointRequest, callback?: (err: AWSError, data: ChimeSDKIdentity.Types.UpdateAppInstanceUserEndpointResponse) => void): Request<ChimeSDKIdentity.Types.UpdateAppInstanceUserEndpointResponse, AWSError>;
  /**
   * Updates the details of an AppInstanceUserEndpoint. You can update the name and AllowMessage values.
   */
  updateAppInstanceUserEndpoint(callback?: (err: AWSError, data: ChimeSDKIdentity.Types.UpdateAppInstanceUserEndpointResponse) => void): Request<ChimeSDKIdentity.Types.UpdateAppInstanceUserEndpointResponse, AWSError>;
}
declare namespace ChimeSDKIdentity {
  export type AllowMessages = "ALL"|"NONE"|string;
  export interface AppInstance {
    /**
     * The ARN of the messaging instance.
     */
    AppInstanceArn?: ChimeArn;
    /**
     * The name of an AppInstance.
     */
    Name?: NonEmptyResourceName;
    /**
     * The time at which an AppInstance was created. In epoch milliseconds.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time an AppInstance was last updated. In epoch milliseconds.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * The metadata of an AppInstance.
     */
    Metadata?: Metadata;
  }
  export interface AppInstanceAdmin {
    /**
     * The AppInstanceAdmin data.
     */
    Admin?: Identity;
    /**
     * The ARN of the AppInstance for which the user is an administrator.
     */
    AppInstanceArn?: ChimeArn;
    /**
     * The time at which an administrator was created.
     */
    CreatedTimestamp?: Timestamp;
  }
  export type AppInstanceAdminList = AppInstanceAdminSummary[];
  export interface AppInstanceAdminSummary {
    /**
     * The details of the AppInstanceAdmin.
     */
    Admin?: Identity;
  }
  export type AppInstanceList = AppInstanceSummary[];
  export interface AppInstanceRetentionSettings {
    /**
     * The length of time in days to retain the messages in a channel.
     */
    ChannelRetentionSettings?: ChannelRetentionSettings;
  }
  export interface AppInstanceSummary {
    /**
     * The AppInstance ARN.
     */
    AppInstanceArn?: ChimeArn;
    /**
     * The name of the AppInstance.
     */
    Name?: NonEmptyResourceName;
    /**
     * The metadata of the AppInstance.
     */
    Metadata?: Metadata;
  }
  export interface AppInstanceUser {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn?: ChimeArn;
    /**
     * The name of the AppInstanceUser.
     */
    Name?: UserName;
    /**
     * The metadata of the AppInstanceUser.
     */
    Metadata?: Metadata;
    /**
     * The time at which the AppInstanceUser was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time at which the AppInstanceUser was last updated.
     */
    LastUpdatedTimestamp?: Timestamp;
  }
  export interface AppInstanceUserEndpoint {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn?: SensitiveChimeArn;
    /**
     * The unique identifier of the AppInstanceUserEndpoint.
     */
    EndpointId?: SensitiveString64;
    /**
     * The name of the AppInstanceUserEndpoint.
     */
    Name?: SensitiveString1600;
    /**
     * The type of the AppInstanceUserEndpoint.
     */
    Type?: AppInstanceUserEndpointType;
    /**
     * The ARN of the resource to which the endpoint belongs.
     */
    ResourceArn?: SensitiveChimeArn;
    /**
     * The attributes of an Endpoint.
     */
    EndpointAttributes?: EndpointAttributes;
    /**
     * The time at which an AppInstanceUserEndpoint was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time at which an AppInstanceUserEndpoint was last updated.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * Boolean that controls whether the AppInstanceUserEndpoint is opted in to receive messages. ALL indicates the endpoint will receive all messages. NONE indicates the endpoint will receive no messages.
     */
    AllowMessages?: AllowMessages;
    /**
     * A read-only field that represents the state of an AppInstanceUserEndpoint. Supported values:    ACTIVE: The AppInstanceUserEndpoint is active and able to receive messages. When ACTIVE, the EndpointStatusReason remains empty.    INACTIVE: The AppInstanceUserEndpoint is inactive and can't receive message. When INACTIVE, the corresponding reason will be conveyed through EndpointStatusReason.    INVALID_DEVICE_TOKEN indicates that an AppInstanceUserEndpoint is INACTIVE due to invalid device token    INVALID_PINPOINT_ARN indicates that an AppInstanceUserEndpoint is INACTIVE due to an invalid pinpoint ARN that was input through the ResourceArn field.  
     */
    EndpointState?: EndpointState;
  }
  export interface AppInstanceUserEndpointSummary {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn?: SensitiveChimeArn;
    /**
     * The unique identifier of the AppInstanceUserEndpoint.
     */
    EndpointId?: SensitiveString64;
    /**
     * The name of the AppInstanceUserEndpoint.
     */
    Name?: SensitiveString1600;
    /**
     * The type of the AppInstanceUserEndpoint.
     */
    Type?: AppInstanceUserEndpointType;
    /**
     * BBoolean that controls whether the AppInstanceUserEndpoint is opted in to receive messages. ALL indicates the endpoint will receive all messages. NONE indicates the endpoint will receive no messages.
     */
    AllowMessages?: AllowMessages;
    /**
     * A read-only field that represent the state of an AppInstanceUserEndpoint.
     */
    EndpointState?: EndpointState;
  }
  export type AppInstanceUserEndpointSummaryList = AppInstanceUserEndpointSummary[];
  export type AppInstanceUserEndpointType = "APNS"|"APNS_SANDBOX"|"GCM"|string;
  export type AppInstanceUserList = AppInstanceUserSummary[];
  export interface AppInstanceUserSummary {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn?: ChimeArn;
    /**
     * The name of an AppInstanceUser.
     */
    Name?: UserName;
    /**
     * The metadata of the AppInstanceUser.
     */
    Metadata?: Metadata;
  }
  export interface ChannelRetentionSettings {
    /**
     * The time in days to retain the messages in a channel.
     */
    RetentionDays?: RetentionDays;
  }
  export type ChimeArn = string;
  export type ClientRequestToken = string;
  export interface CreateAppInstanceAdminRequest {
    /**
     * The ARN of the administrator of the current AppInstance.
     */
    AppInstanceAdminArn: ChimeArn;
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
  }
  export interface CreateAppInstanceAdminResponse {
    /**
     * The name and ARN of the admin for the AppInstance.
     */
    AppInstanceAdmin?: Identity;
    /**
     * The ARN of the of the admin for the AppInstance.
     */
    AppInstanceArn?: ChimeArn;
  }
  export interface CreateAppInstanceRequest {
    /**
     * The name of the AppInstance.
     */
    Name: NonEmptyResourceName;
    /**
     * The metadata of the AppInstance. Limited to a 1KB string in UTF-8.
     */
    Metadata?: Metadata;
    /**
     * The ClientRequestToken of the AppInstance.
     */
    ClientRequestToken: ClientRequestToken;
    /**
     * Tags assigned to the AppInstanceUser.
     */
    Tags?: TagList;
  }
  export interface CreateAppInstanceResponse {
    /**
     * The Amazon Resource Number (ARN) of the AppInstance.
     */
    AppInstanceArn?: ChimeArn;
  }
  export interface CreateAppInstanceUserRequest {
    /**
     * The ARN of the AppInstance request.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The user ID of the AppInstance.
     */
    AppInstanceUserId: UserId;
    /**
     * The user's name.
     */
    Name: UserName;
    /**
     * The request's metadata. Limited to a 1KB string in UTF-8.
     */
    Metadata?: Metadata;
    /**
     * The token assigned to the user requesting an AppInstance.
     */
    ClientRequestToken: ClientRequestToken;
    /**
     * Tags assigned to the AppInstanceUser.
     */
    Tags?: TagList;
  }
  export interface CreateAppInstanceUserResponse {
    /**
     * The user's ARN.
     */
    AppInstanceUserArn?: ChimeArn;
  }
  export interface DeleteAppInstanceAdminRequest {
    /**
     * The ARN of the AppInstance's administrator.
     */
    AppInstanceAdminArn: ChimeArn;
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
  }
  export interface DeleteAppInstanceRequest {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
  }
  export interface DeleteAppInstanceUserRequest {
    /**
     * The ARN of the user request being deleted.
     */
    AppInstanceUserArn: ChimeArn;
  }
  export interface DeregisterAppInstanceUserEndpointRequest {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn: SensitiveChimeArn;
    /**
     * The unique identifier of the AppInstanceUserEndpoint.
     */
    EndpointId: SensitiveString64;
  }
  export interface DescribeAppInstanceAdminRequest {
    /**
     * The ARN of the AppInstanceAdmin.
     */
    AppInstanceAdminArn: ChimeArn;
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
  }
  export interface DescribeAppInstanceAdminResponse {
    /**
     * The ARN and name of the AppInstanceUser, the ARN of the AppInstance, and the created and last-updated timestamps. All timestamps use epoch milliseconds.
     */
    AppInstanceAdmin?: AppInstanceAdmin;
  }
  export interface DescribeAppInstanceRequest {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
  }
  export interface DescribeAppInstanceResponse {
    /**
     * The ARN, metadata, created and last-updated timestamps, and the name of the AppInstance. All timestamps use epoch milliseconds.
     */
    AppInstance?: AppInstance;
  }
  export interface DescribeAppInstanceUserEndpointRequest {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn: SensitiveString1600;
    /**
     * The unique identifier of the AppInstanceUserEndpoint.
     */
    EndpointId: SensitiveString64;
  }
  export interface DescribeAppInstanceUserEndpointResponse {
    /**
     * The full details of an AppInstanceUserEndpoint: the AppInstanceUserArn, ID, name, type, resource ARN, attributes, allow messages, state, and created and last updated timestamps. All timestamps use epoch milliseconds.
     */
    AppInstanceUserEndpoint?: AppInstanceUserEndpoint;
  }
  export interface DescribeAppInstanceUserRequest {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn: ChimeArn;
  }
  export interface DescribeAppInstanceUserResponse {
    /**
     * The name of the AppInstanceUser.
     */
    AppInstanceUser?: AppInstanceUser;
  }
  export interface EndpointAttributes {
    /**
     * The device token for the GCM, APNS, and APNS_SANDBOX endpoint types.
     */
    DeviceToken: NonEmptySensitiveString1600;
    /**
     * The VOIP device token for the APNS and APNS_SANDBOX endpoint types.
     */
    VoipDeviceToken?: NonEmptySensitiveString1600;
  }
  export interface EndpointState {
    /**
     * Enum that indicates the Status of an AppInstanceUserEndpoint.
     */
    Status: EndpointStatus;
    /**
     * The reason for the EndpointStatus.
     */
    StatusReason?: EndpointStatusReason;
  }
  export type EndpointStatus = "ACTIVE"|"INACTIVE"|string;
  export type EndpointStatusReason = "INVALID_DEVICE_TOKEN"|"INVALID_PINPOINT_ARN"|string;
  export interface GetAppInstanceRetentionSettingsRequest {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
  }
  export interface GetAppInstanceRetentionSettingsResponse {
    /**
     * The retention settings for the AppInstance.
     */
    AppInstanceRetentionSettings?: AppInstanceRetentionSettings;
    /**
     * The timestamp representing the time at which the specified items are retained, in Epoch Seconds.
     */
    InitiateDeletionTimestamp?: Timestamp;
  }
  export interface Identity {
    /**
     * The ARN in an Identity.
     */
    Arn?: ChimeArn;
    /**
     * The name in an Identity.
     */
    Name?: ResourceName;
  }
  export interface ListAppInstanceAdminsRequest {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The maximum number of administrators that you want to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token returned from previous API requests until the number of administrators is reached.
     */
    NextToken?: NextToken;
  }
  export interface ListAppInstanceAdminsResponse {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn?: ChimeArn;
    /**
     * The information for each administrator.
     */
    AppInstanceAdmins?: AppInstanceAdminList;
    /**
     * The token returned from previous API requests until the number of administrators is reached.
     */
    NextToken?: NextToken;
  }
  export interface ListAppInstanceUserEndpointsRequest {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn: SensitiveChimeArn;
    /**
     * The maximum number of endpoints that you want to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested endpoints are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListAppInstanceUserEndpointsResponse {
    /**
     * The information for each requested AppInstanceUserEndpoint.
     */
    AppInstanceUserEndpoints?: AppInstanceUserEndpointSummaryList;
    /**
     * The token passed by previous API calls until all requested endpoints are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListAppInstanceUsersRequest {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The maximum number of requests that you want returned.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API calls until all requested users are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListAppInstanceUsersResponse {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn?: ChimeArn;
    /**
     * The information for each requested AppInstanceUser.
     */
    AppInstanceUsers?: AppInstanceUserList;
    /**
     * The token passed by previous API calls until all requested users are returned.
     */
    NextToken?: NextToken;
  }
  export interface ListAppInstancesRequest {
    /**
     * The maximum number of AppInstances that you want to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token passed by previous API requests until you reach the maximum number of AppInstances.
     */
    NextToken?: NextToken;
  }
  export interface ListAppInstancesResponse {
    /**
     * The information for each AppInstance.
     */
    AppInstances?: AppInstanceList;
    /**
     * The token passed by previous API requests until the maximum number of AppInstances is reached.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceARN: ChimeArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tag key-value pairs.
     */
    Tags?: TagList;
  }
  export type MaxResults = number;
  export type Metadata = string;
  export type NextToken = string;
  export type NonEmptyResourceName = string;
  export type NonEmptySensitiveString1600 = string;
  export interface PutAppInstanceRetentionSettingsRequest {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The time in days to retain data. Data type: number.
     */
    AppInstanceRetentionSettings: AppInstanceRetentionSettings;
  }
  export interface PutAppInstanceRetentionSettingsResponse {
    /**
     * The time in days to retain data. Data type: number.
     */
    AppInstanceRetentionSettings?: AppInstanceRetentionSettings;
    /**
     * The time at which the API deletes data.
     */
    InitiateDeletionTimestamp?: Timestamp;
  }
  export interface RegisterAppInstanceUserEndpointRequest {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn: SensitiveChimeArn;
    /**
     * The name of the AppInstanceUserEndpoint.
     */
    Name?: SensitiveString1600;
    /**
     * The type of the AppInstanceUserEndpoint. Supported types:    APNS: The mobile notification service for an Apple device.    APNS_SANDBOX: The sandbox environment of the mobile notification service for an Apple device.    GCM: The mobile notification service for an Android device.   Populate the ResourceArn value of each type as PinpointAppArn.
     */
    Type: AppInstanceUserEndpointType;
    /**
     * The ARN of the resource to which the endpoint belongs.
     */
    ResourceArn: SensitiveChimeArn;
    /**
     * The attributes of an Endpoint.
     */
    EndpointAttributes: EndpointAttributes;
    /**
     * The idempotency token for each client request. 
     */
    ClientRequestToken: ClientRequestToken;
    /**
     * Boolean that controls whether the AppInstanceUserEndpoint is opted in to receive messages. ALL indicates the endpoint receives all messages. NONE indicates the endpoint receives no messages.
     */
    AllowMessages?: AllowMessages;
  }
  export interface RegisterAppInstanceUserEndpointResponse {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn?: SensitiveChimeArn;
    /**
     * The unique identifier of the AppInstanceUserEndpoint.
     */
    EndpointId?: SensitiveString64;
  }
  export type ResourceName = string;
  export type RetentionDays = number;
  export type SensitiveChimeArn = string;
  export type SensitiveString1600 = string;
  export type SensitiveString64 = string;
  export interface Tag {
    /**
     * The key in a tag.
     */
    Key: TagKey;
    /**
     * The value in a tag.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The resource ARN.
     */
    ResourceARN: ChimeArn;
    /**
     * The tag key-value pairs.
     */
    Tags: TagList;
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The resource ARN.
     */
    ResourceARN: ChimeArn;
    /**
     * The tag keys.
     */
    TagKeys: TagKeyList;
  }
  export interface UpdateAppInstanceRequest {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn: ChimeArn;
    /**
     * The name that you want to change.
     */
    Name: NonEmptyResourceName;
    /**
     * The metadata that you want to change.
     */
    Metadata: Metadata;
  }
  export interface UpdateAppInstanceResponse {
    /**
     * The ARN of the AppInstance.
     */
    AppInstanceArn?: ChimeArn;
  }
  export interface UpdateAppInstanceUserEndpointRequest {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn: SensitiveChimeArn;
    /**
     * The unique identifier of the AppInstanceUserEndpoint.
     */
    EndpointId: SensitiveString64;
    /**
     * The name of the AppInstanceUserEndpoint.
     */
    Name?: SensitiveString1600;
    /**
     * Boolean that controls whether the AppInstanceUserEndpoint is opted in to receive messages. ALL indicates the endpoint will receive all messages. NONE indicates the endpoint will receive no messages.
     */
    AllowMessages?: AllowMessages;
  }
  export interface UpdateAppInstanceUserEndpointResponse {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn?: SensitiveChimeArn;
    /**
     * The unique identifier of the AppInstanceUserEndpoint.
     */
    EndpointId?: SensitiveString64;
  }
  export interface UpdateAppInstanceUserRequest {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn: ChimeArn;
    /**
     * The name of the AppInstanceUser.
     */
    Name: UserName;
    /**
     * The metadata of the AppInstanceUser.
     */
    Metadata: Metadata;
  }
  export interface UpdateAppInstanceUserResponse {
    /**
     * The ARN of the AppInstanceUser.
     */
    AppInstanceUserArn?: ChimeArn;
  }
  export type UserId = string;
  export type UserName = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-04-20"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ChimeSDKIdentity client.
   */
  export import Types = ChimeSDKIdentity;
}
export = ChimeSDKIdentity;
