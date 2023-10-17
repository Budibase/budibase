import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IdentityStore extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IdentityStore.Types.ClientConfiguration)
  config: Config & IdentityStore.Types.ClientConfiguration;
  /**
   * Creates a group within the specified identity store.
   */
  createGroup(params: IdentityStore.Types.CreateGroupRequest, callback?: (err: AWSError, data: IdentityStore.Types.CreateGroupResponse) => void): Request<IdentityStore.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates a group within the specified identity store.
   */
  createGroup(callback?: (err: AWSError, data: IdentityStore.Types.CreateGroupResponse) => void): Request<IdentityStore.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates a relationship between a member and a group. The following identifiers must be specified: GroupId, IdentityStoreId, and MemberId.
   */
  createGroupMembership(params: IdentityStore.Types.CreateGroupMembershipRequest, callback?: (err: AWSError, data: IdentityStore.Types.CreateGroupMembershipResponse) => void): Request<IdentityStore.Types.CreateGroupMembershipResponse, AWSError>;
  /**
   * Creates a relationship between a member and a group. The following identifiers must be specified: GroupId, IdentityStoreId, and MemberId.
   */
  createGroupMembership(callback?: (err: AWSError, data: IdentityStore.Types.CreateGroupMembershipResponse) => void): Request<IdentityStore.Types.CreateGroupMembershipResponse, AWSError>;
  /**
   * Creates a user within the specified identity store.
   */
  createUser(params: IdentityStore.Types.CreateUserRequest, callback?: (err: AWSError, data: IdentityStore.Types.CreateUserResponse) => void): Request<IdentityStore.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a user within the specified identity store.
   */
  createUser(callback?: (err: AWSError, data: IdentityStore.Types.CreateUserResponse) => void): Request<IdentityStore.Types.CreateUserResponse, AWSError>;
  /**
   * Delete a group within an identity store given GroupId.
   */
  deleteGroup(params: IdentityStore.Types.DeleteGroupRequest, callback?: (err: AWSError, data: IdentityStore.Types.DeleteGroupResponse) => void): Request<IdentityStore.Types.DeleteGroupResponse, AWSError>;
  /**
   * Delete a group within an identity store given GroupId.
   */
  deleteGroup(callback?: (err: AWSError, data: IdentityStore.Types.DeleteGroupResponse) => void): Request<IdentityStore.Types.DeleteGroupResponse, AWSError>;
  /**
   * Delete a membership within a group given MembershipId.
   */
  deleteGroupMembership(params: IdentityStore.Types.DeleteGroupMembershipRequest, callback?: (err: AWSError, data: IdentityStore.Types.DeleteGroupMembershipResponse) => void): Request<IdentityStore.Types.DeleteGroupMembershipResponse, AWSError>;
  /**
   * Delete a membership within a group given MembershipId.
   */
  deleteGroupMembership(callback?: (err: AWSError, data: IdentityStore.Types.DeleteGroupMembershipResponse) => void): Request<IdentityStore.Types.DeleteGroupMembershipResponse, AWSError>;
  /**
   * Deletes a user within an identity store given UserId.
   */
  deleteUser(params: IdentityStore.Types.DeleteUserRequest, callback?: (err: AWSError, data: IdentityStore.Types.DeleteUserResponse) => void): Request<IdentityStore.Types.DeleteUserResponse, AWSError>;
  /**
   * Deletes a user within an identity store given UserId.
   */
  deleteUser(callback?: (err: AWSError, data: IdentityStore.Types.DeleteUserResponse) => void): Request<IdentityStore.Types.DeleteUserResponse, AWSError>;
  /**
   * Retrieves the group metadata and attributes from GroupId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  describeGroup(params: IdentityStore.Types.DescribeGroupRequest, callback?: (err: AWSError, data: IdentityStore.Types.DescribeGroupResponse) => void): Request<IdentityStore.Types.DescribeGroupResponse, AWSError>;
  /**
   * Retrieves the group metadata and attributes from GroupId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  describeGroup(callback?: (err: AWSError, data: IdentityStore.Types.DescribeGroupResponse) => void): Request<IdentityStore.Types.DescribeGroupResponse, AWSError>;
  /**
   * Retrieves membership metadata and attributes from MembershipId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  describeGroupMembership(params: IdentityStore.Types.DescribeGroupMembershipRequest, callback?: (err: AWSError, data: IdentityStore.Types.DescribeGroupMembershipResponse) => void): Request<IdentityStore.Types.DescribeGroupMembershipResponse, AWSError>;
  /**
   * Retrieves membership metadata and attributes from MembershipId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  describeGroupMembership(callback?: (err: AWSError, data: IdentityStore.Types.DescribeGroupMembershipResponse) => void): Request<IdentityStore.Types.DescribeGroupMembershipResponse, AWSError>;
  /**
   * Retrieves the user metadata and attributes from the UserId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  describeUser(params: IdentityStore.Types.DescribeUserRequest, callback?: (err: AWSError, data: IdentityStore.Types.DescribeUserResponse) => void): Request<IdentityStore.Types.DescribeUserResponse, AWSError>;
  /**
   * Retrieves the user metadata and attributes from the UserId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  describeUser(callback?: (err: AWSError, data: IdentityStore.Types.DescribeUserResponse) => void): Request<IdentityStore.Types.DescribeUserResponse, AWSError>;
  /**
   * Retrieves GroupId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  getGroupId(params: IdentityStore.Types.GetGroupIdRequest, callback?: (err: AWSError, data: IdentityStore.Types.GetGroupIdResponse) => void): Request<IdentityStore.Types.GetGroupIdResponse, AWSError>;
  /**
   * Retrieves GroupId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  getGroupId(callback?: (err: AWSError, data: IdentityStore.Types.GetGroupIdResponse) => void): Request<IdentityStore.Types.GetGroupIdResponse, AWSError>;
  /**
   * Retrieves the MembershipId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  getGroupMembershipId(params: IdentityStore.Types.GetGroupMembershipIdRequest, callback?: (err: AWSError, data: IdentityStore.Types.GetGroupMembershipIdResponse) => void): Request<IdentityStore.Types.GetGroupMembershipIdResponse, AWSError>;
  /**
   * Retrieves the MembershipId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  getGroupMembershipId(callback?: (err: AWSError, data: IdentityStore.Types.GetGroupMembershipIdResponse) => void): Request<IdentityStore.Types.GetGroupMembershipIdResponse, AWSError>;
  /**
   * Retrieves the UserId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  getUserId(params: IdentityStore.Types.GetUserIdRequest, callback?: (err: AWSError, data: IdentityStore.Types.GetUserIdResponse) => void): Request<IdentityStore.Types.GetUserIdResponse, AWSError>;
  /**
   * Retrieves the UserId in an identity store.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  getUserId(callback?: (err: AWSError, data: IdentityStore.Types.GetUserIdResponse) => void): Request<IdentityStore.Types.GetUserIdResponse, AWSError>;
  /**
   * Checks the user's membership in all requested groups and returns if the member exists in all queried groups.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  isMemberInGroups(params: IdentityStore.Types.IsMemberInGroupsRequest, callback?: (err: AWSError, data: IdentityStore.Types.IsMemberInGroupsResponse) => void): Request<IdentityStore.Types.IsMemberInGroupsResponse, AWSError>;
  /**
   * Checks the user's membership in all requested groups and returns if the member exists in all queried groups.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  isMemberInGroups(callback?: (err: AWSError, data: IdentityStore.Types.IsMemberInGroupsResponse) => void): Request<IdentityStore.Types.IsMemberInGroupsResponse, AWSError>;
  /**
   * For the specified group in the specified identity store, returns the list of all GroupMembership objects and returns results in paginated form.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  listGroupMemberships(params: IdentityStore.Types.ListGroupMembershipsRequest, callback?: (err: AWSError, data: IdentityStore.Types.ListGroupMembershipsResponse) => void): Request<IdentityStore.Types.ListGroupMembershipsResponse, AWSError>;
  /**
   * For the specified group in the specified identity store, returns the list of all GroupMembership objects and returns results in paginated form.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  listGroupMemberships(callback?: (err: AWSError, data: IdentityStore.Types.ListGroupMembershipsResponse) => void): Request<IdentityStore.Types.ListGroupMembershipsResponse, AWSError>;
  /**
   * For the specified member in the specified identity store, returns the list of all GroupMembership objects and returns results in paginated form.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  listGroupMembershipsForMember(params: IdentityStore.Types.ListGroupMembershipsForMemberRequest, callback?: (err: AWSError, data: IdentityStore.Types.ListGroupMembershipsForMemberResponse) => void): Request<IdentityStore.Types.ListGroupMembershipsForMemberResponse, AWSError>;
  /**
   * For the specified member in the specified identity store, returns the list of all GroupMembership objects and returns results in paginated form.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  listGroupMembershipsForMember(callback?: (err: AWSError, data: IdentityStore.Types.ListGroupMembershipsForMemberResponse) => void): Request<IdentityStore.Types.ListGroupMembershipsForMemberResponse, AWSError>;
  /**
   * Lists all groups in the identity store. Returns a paginated list of complete Group objects. Filtering for a Group by the DisplayName attribute is deprecated. Instead, use the GetGroupId API action.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  listGroups(params: IdentityStore.Types.ListGroupsRequest, callback?: (err: AWSError, data: IdentityStore.Types.ListGroupsResponse) => void): Request<IdentityStore.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists all groups in the identity store. Returns a paginated list of complete Group objects. Filtering for a Group by the DisplayName attribute is deprecated. Instead, use the GetGroupId API action.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide.  
   */
  listGroups(callback?: (err: AWSError, data: IdentityStore.Types.ListGroupsResponse) => void): Request<IdentityStore.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists all users in the identity store. Returns a paginated list of complete User objects. Filtering for a User by the UserName attribute is deprecated. Instead, use the GetUserId API action.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide. 
   */
  listUsers(params: IdentityStore.Types.ListUsersRequest, callback?: (err: AWSError, data: IdentityStore.Types.ListUsersResponse) => void): Request<IdentityStore.Types.ListUsersResponse, AWSError>;
  /**
   * Lists all users in the identity store. Returns a paginated list of complete User objects. Filtering for a User by the UserName attribute is deprecated. Instead, use the GetUserId API action.  If you have administrator access to a member account, you can use this API from the member account. Read about member accounts in the Organizations User Guide. 
   */
  listUsers(callback?: (err: AWSError, data: IdentityStore.Types.ListUsersResponse) => void): Request<IdentityStore.Types.ListUsersResponse, AWSError>;
  /**
   * For the specified group in the specified identity store, updates the group metadata and attributes.
   */
  updateGroup(params: IdentityStore.Types.UpdateGroupRequest, callback?: (err: AWSError, data: IdentityStore.Types.UpdateGroupResponse) => void): Request<IdentityStore.Types.UpdateGroupResponse, AWSError>;
  /**
   * For the specified group in the specified identity store, updates the group metadata and attributes.
   */
  updateGroup(callback?: (err: AWSError, data: IdentityStore.Types.UpdateGroupResponse) => void): Request<IdentityStore.Types.UpdateGroupResponse, AWSError>;
  /**
   * For the specified user in the specified identity store, updates the user metadata and attributes.
   */
  updateUser(params: IdentityStore.Types.UpdateUserRequest, callback?: (err: AWSError, data: IdentityStore.Types.UpdateUserResponse) => void): Request<IdentityStore.Types.UpdateUserResponse, AWSError>;
  /**
   * For the specified user in the specified identity store, updates the user metadata and attributes.
   */
  updateUser(callback?: (err: AWSError, data: IdentityStore.Types.UpdateUserResponse) => void): Request<IdentityStore.Types.UpdateUserResponse, AWSError>;
}
declare namespace IdentityStore {
  export interface Address {
    /**
     * The street of the address.
     */
    StreetAddress?: SensitiveStringType;
    /**
     * A string of the address locality.
     */
    Locality?: SensitiveStringType;
    /**
     * The region of the address.
     */
    Region?: SensitiveStringType;
    /**
     * The postal code of the address.
     */
    PostalCode?: SensitiveStringType;
    /**
     * The country of the address.
     */
    Country?: SensitiveStringType;
    /**
     * A string containing a formatted version of the address for display.
     */
    Formatted?: SensitiveStringType;
    /**
     * A string representing the type of address. For example, "Home."
     */
    Type?: SensitiveStringType;
    /**
     * A Boolean value representing whether this is the primary address for the associated resource.
     */
    Primary?: SensitiveBooleanType;
  }
  export type Addresses = Address[];
  export interface AlternateIdentifier {
    /**
     * The identifier issued to this resource by an external identity provider.
     */
    ExternalId?: ExternalId;
    /**
     * An entity attribute that's unique to a specific entity.
     */
    UniqueAttribute?: UniqueAttribute;
  }
  export interface AttributeOperation {
    /**
     * A string representation of the path to a given attribute or sub-attribute. Supports JMESPath.
     */
    AttributePath: AttributePath;
    /**
     * The value of the attribute. This is a Document type. This type is not supported by Java V1, Go V1, and older versions of the CLI.
     */
    AttributeValue?: AttributeValue;
  }
  export type AttributeOperations = AttributeOperation[];
  export type AttributePath = string;
  export interface AttributeValue {
  }
  export interface CreateGroupMembershipRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * An object that contains the identifier of a group member. Setting the UserID field to the specific identifier for a user indicates that the user is a member of the group.
     */
    MemberId: MemberId;
  }
  export interface CreateGroupMembershipResponse {
    /**
     * The identifier for a newly created GroupMembership in an identity store.
     */
    MembershipId: ResourceId;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export interface CreateGroupRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * A string containing the name of the group. This value is commonly displayed when the group is referenced. Administrator and AWSAdministrators are reserved names and can't be used for users or groups.
     */
    DisplayName?: GroupDisplayName;
    /**
     * A string containing the description of the group.
     */
    Description?: SensitiveStringType;
  }
  export interface CreateGroupResponse {
    /**
     * The identifier of the newly created group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export interface CreateUserRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * A unique string used to identify the user. The length limit is 128 characters. This value can consist of letters, accented characters, symbols, numbers, and punctuation. This value is specified at the time the user is created and stored as an attribute of the user object in the identity store. Administrator and AWSAdministrators are reserved names and can't be used for users or groups.
     */
    UserName?: UserName;
    /**
     * An object containing the name of the user.
     */
    Name?: Name;
    /**
     * A string containing the name of the user. This value is typically formatted for display when the user is referenced. For example, "John Doe." 
     */
    DisplayName?: SensitiveStringType;
    /**
     * A string containing an alternate name for the user.
     */
    NickName?: SensitiveStringType;
    /**
     * A string containing a URL that might be associated with the user.
     */
    ProfileUrl?: SensitiveStringType;
    /**
     * A list of Email objects containing email addresses associated with the user.
     */
    Emails?: Emails;
    /**
     * A list of Address objects containing addresses associated with the user.
     */
    Addresses?: Addresses;
    /**
     * A list of PhoneNumber objects containing phone numbers associated with the user.
     */
    PhoneNumbers?: PhoneNumbers;
    /**
     * A string indicating the type of user. Possible values are left unspecified. The value can vary based on your specific use case.
     */
    UserType?: SensitiveStringType;
    /**
     * A string containing the title of the user. Possible values are left unspecified. The value can vary based on your specific use case.
     */
    Title?: SensitiveStringType;
    /**
     * A string containing the preferred language of the user. For example, "American English" or "en-us."
     */
    PreferredLanguage?: SensitiveStringType;
    /**
     * A string containing the geographical region or location of the user.
     */
    Locale?: SensitiveStringType;
    /**
     * A string containing the time zone of the user.
     */
    Timezone?: SensitiveStringType;
  }
  export interface CreateUserResponse {
    /**
     * The identifier of the newly created user in the identity store.
     */
    UserId: ResourceId;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export interface DeleteGroupMembershipRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a GroupMembership in an identity store.
     */
    MembershipId: ResourceId;
  }
  export interface DeleteGroupMembershipResponse {
  }
  export interface DeleteGroupRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
  }
  export interface DeleteGroupResponse {
  }
  export interface DeleteUserRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
  }
  export interface DeleteUserResponse {
  }
  export interface DescribeGroupMembershipRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a GroupMembership in an identity store.
     */
    MembershipId: ResourceId;
  }
  export interface DescribeGroupMembershipResponse {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a GroupMembership in an identity store.
     */
    MembershipId: ResourceId;
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    MemberId: MemberId;
  }
  export interface DescribeGroupRequest {
    /**
     * The globally unique identifier for the identity store, such as d-1234567890. In this example, d- is a fixed prefix, and 1234567890 is a randomly generated string that contains numbers and lower case letters. This value is generated at the time that a new identity store is created.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
  }
  export interface DescribeGroupResponse {
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * The group’s display name value. The length limit is 1,024 characters. This value can consist of letters, accented characters, symbols, numbers, punctuation, tab, new line, carriage return, space, and nonbreaking space in this attribute. This value is specified at the time that the group is created and stored as an attribute of the group object in the identity store.
     */
    DisplayName?: GroupDisplayName;
    /**
     * A list of ExternalId objects that contains the identifiers issued to this resource by an external identity provider.
     */
    ExternalIds?: ExternalIds;
    /**
     * A string containing a description of the group.
     */
    Description?: SensitiveStringType;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export interface DescribeUserRequest {
    /**
     * The globally unique identifier for the identity store, such as d-1234567890. In this example, d- is a fixed prefix, and 1234567890 is a randomly generated string that contains numbers and lower case letters. This value is generated at the time that a new identity store is created.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
  }
  export interface DescribeUserResponse {
    /**
     * A unique string used to identify the user. The length limit is 128 characters. This value can consist of letters, accented characters, symbols, numbers, and punctuation. This value is specified at the time the user is created and stored as an attribute of the user object in the identity store.
     */
    UserName?: UserName;
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
    /**
     * A list of ExternalId objects that contains the identifiers issued to this resource by an external identity provider.
     */
    ExternalIds?: ExternalIds;
    /**
     * The name of the user.
     */
    Name?: Name;
    /**
     * The display name of the user.
     */
    DisplayName?: SensitiveStringType;
    /**
     * An alternative descriptive name for the user.
     */
    NickName?: SensitiveStringType;
    /**
     * A URL link for the user's profile.
     */
    ProfileUrl?: SensitiveStringType;
    /**
     * The email address of the user.
     */
    Emails?: Emails;
    /**
     * The physical address of the user.
     */
    Addresses?: Addresses;
    /**
     * A list of PhoneNumber objects associated with a user.
     */
    PhoneNumbers?: PhoneNumbers;
    /**
     * A string indicating the type of user.
     */
    UserType?: SensitiveStringType;
    /**
     * A string containing the title of the user.
     */
    Title?: SensitiveStringType;
    /**
     * The preferred language of the user.
     */
    PreferredLanguage?: SensitiveStringType;
    /**
     * A string containing the geographical region or location of the user.
     */
    Locale?: SensitiveStringType;
    /**
     * The time zone for a user.
     */
    Timezone?: SensitiveStringType;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export interface Email {
    /**
     * A string containing an email address. For example, "johndoe@amazon.com."
     */
    Value?: SensitiveStringType;
    /**
     * A string representing the type of address. For example, "Work."
     */
    Type?: SensitiveStringType;
    /**
     * A Boolean value representing whether this is the primary email address for the associated resource.
     */
    Primary?: SensitiveBooleanType;
  }
  export type Emails = Email[];
  export interface ExternalId {
    /**
     * The issuer for an external identifier.
     */
    Issuer: ExternalIdIssuer;
    /**
     * The identifier issued to this resource by an external identity provider.
     */
    Id: ExternalIdIdentifier;
  }
  export type ExternalIdIdentifier = string;
  export type ExternalIdIssuer = string;
  export type ExternalIds = ExternalId[];
  export interface Filter {
    /**
     * The attribute path that is used to specify which attribute name to search. Length limit is 255 characters. For example, UserName is a valid attribute path for the ListUsers API, and DisplayName is a valid attribute path for the ListGroups API.
     */
    AttributePath: AttributePath;
    /**
     * Represents the data for an attribute. Each attribute value is described as a name-value pair. 
     */
    AttributeValue: SensitiveStringType;
  }
  export type Filters = Filter[];
  export interface GetGroupIdRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * A unique identifier for a user or group that is not the primary identifier. This value can be an identifier from an external identity provider (IdP) that is associated with the user, the group, or a unique attribute. For the unique attribute, the only valid path is displayName.
     */
    AlternateIdentifier: AlternateIdentifier;
  }
  export interface GetGroupIdResponse {
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export interface GetGroupMembershipIdRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * An object that contains the identifier of a group member. Setting the UserID field to the specific identifier for a user indicates that the user is a member of the group.
     */
    MemberId: MemberId;
  }
  export interface GetGroupMembershipIdResponse {
    /**
     * The identifier for a GroupMembership in an identity store.
     */
    MembershipId: ResourceId;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export interface GetUserIdRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * A unique identifier for a user or group that is not the primary identifier. This value can be an identifier from an external identity provider (IdP) that is associated with the user, the group, or a unique attribute. For the unique attribute, the only valid paths are userName and emails.value.
     */
    AlternateIdentifier: AlternateIdentifier;
  }
  export interface GetUserIdResponse {
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export interface Group {
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * The display name value for the group. The length limit is 1,024 characters. This value can consist of letters, accented characters, symbols, numbers, punctuation, tab, new line, carriage return, space, and nonbreaking space in this attribute. This value is specified at the time the group is created and stored as an attribute of the group object in the identity store.
     */
    DisplayName?: GroupDisplayName;
    /**
     * A list of ExternalId objects that contains the identifiers issued to this resource by an external identity provider.
     */
    ExternalIds?: ExternalIds;
    /**
     * A string containing a description of the specified group.
     */
    Description?: SensitiveStringType;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export type GroupDisplayName = string;
  export type GroupIds = ResourceId[];
  export interface GroupMembership {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a GroupMembership object in an identity store.
     */
    MembershipId?: ResourceId;
    /**
     * The identifier for a group in the identity store.
     */
    GroupId?: ResourceId;
    /**
     * An object that contains the identifier of a group member. Setting the UserID field to the specific identifier for a user indicates that the user is a member of the group.
     */
    MemberId?: MemberId;
  }
  export interface GroupMembershipExistenceResult {
    /**
     * The identifier for a group in the identity store.
     */
    GroupId?: ResourceId;
    /**
     * An object that contains the identifier of a group member. Setting the UserID field to the specific identifier for a user indicates that the user is a member of the group.
     */
    MemberId?: MemberId;
    /**
     * Indicates whether a membership relation exists or not.
     */
    MembershipExists?: SensitiveBooleanType;
  }
  export type GroupMembershipExistenceResults = GroupMembershipExistenceResult[];
  export type GroupMemberships = GroupMembership[];
  export type Groups = Group[];
  export type IdentityStoreId = string;
  export interface IsMemberInGroupsRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * An object containing the identifier of a group member.
     */
    MemberId: MemberId;
    /**
     * A list of identifiers for groups in the identity store.
     */
    GroupIds: GroupIds;
  }
  export interface IsMemberInGroupsResponse {
    /**
     * A list containing the results of membership existence checks.
     */
    Results: GroupMembershipExistenceResults;
  }
  export interface ListGroupMembershipsForMemberRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * An object that contains the identifier of a group member. Setting the UserID field to the specific identifier for a user indicates that the user is a member of the group.
     */
    MemberId: MemberId;
    /**
     * The maximum number of results to be returned per request. This parameter is used in the ListUsers and ListGroups requests to specify how many results to return in one page. The length limit is 50 characters.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token used for the ListUsers, ListGroups, and ListGroupMemberships API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListGroupMembershipsForMemberResponse {
    /**
     * A list of GroupMembership objects in the group for a specified member.
     */
    GroupMemberships: GroupMemberships;
    /**
     * The pagination token used for the ListUsers, ListGroups, and ListGroupMemberships API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page. 
     */
    NextToken?: NextToken;
  }
  export interface ListGroupMembershipsRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * The maximum number of results to be returned per request. This parameter is used in all List requests to specify how many results to return in one page.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token used for the ListUsers, ListGroups and ListGroupMemberships API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListGroupMembershipsResponse {
    /**
     * A list of GroupMembership objects in the group.
     */
    GroupMemberships: GroupMemberships;
    /**
     * The pagination token used for the ListUsers, ListGroups, and ListGroupMemberships API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListGroupsRequest {
    /**
     * The globally unique identifier for the identity store, such as d-1234567890. In this example, d- is a fixed prefix, and 1234567890 is a randomly generated string that contains numbers and lower case letters. This value is generated at the time that a new identity store is created.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The maximum number of results to be returned per request. This parameter is used in the ListUsers and ListGroups requests to specify how many results to return in one page. The length limit is 50 characters.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token used for the ListUsers and ListGroups API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
    /**
     * A list of Filter objects, which is used in the ListUsers and ListGroups requests.
     */
    Filters?: Filters;
  }
  export interface ListGroupsResponse {
    /**
     * A list of Group objects in the identity store.
     */
    Groups: Groups;
    /**
     * The pagination token used for the ListUsers and ListGroups API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it1 is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
  }
  export interface ListUsersRequest {
    /**
     * The globally unique identifier for the identity store, such as d-1234567890. In this example, d- is a fixed prefix, and 1234567890 is a randomly generated string that contains numbers and lower case letters. This value is generated at the time that a new identity store is created.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The maximum number of results to be returned per request. This parameter is used in the ListUsers and ListGroups requests to specify how many results to return in one page. The length limit is 50 characters.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token used for the ListUsers and ListGroups API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
    /**
     * A list of Filter objects, which is used in the ListUsers and ListGroups requests. 
     */
    Filters?: Filters;
  }
  export interface ListUsersResponse {
    /**
     * A list of User objects in the identity store.
     */
    Users: Users;
    /**
     * The pagination token used for the ListUsers and ListGroups API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export interface MemberId {
    /**
     * An object containing the identifiers of resources that can be members.
     */
    UserId?: ResourceId;
  }
  export interface Name {
    /**
     * A string containing a formatted version of the name for display.
     */
    Formatted?: SensitiveStringType;
    /**
     * The family name of the user.
     */
    FamilyName?: SensitiveStringType;
    /**
     * The given name of the user.
     */
    GivenName?: SensitiveStringType;
    /**
     * The middle name of the user.
     */
    MiddleName?: SensitiveStringType;
    /**
     * The honorific prefix of the user. For example, "Dr."
     */
    HonorificPrefix?: SensitiveStringType;
    /**
     * The honorific suffix of the user. For example, "M.D."
     */
    HonorificSuffix?: SensitiveStringType;
  }
  export type NextToken = string;
  export interface PhoneNumber {
    /**
     * A string containing a phone number. For example, "8675309" or "+1 (800) 123-4567".
     */
    Value?: SensitiveStringType;
    /**
     * A string representing the type of a phone number. For example, "Mobile."
     */
    Type?: SensitiveStringType;
    /**
     * A Boolean value representing whether this is the primary phone number for the associated resource.
     */
    Primary?: SensitiveBooleanType;
  }
  export type PhoneNumbers = PhoneNumber[];
  export type ResourceId = string;
  export type SensitiveBooleanType = boolean;
  export type SensitiveStringType = string;
  export interface UniqueAttribute {
    /**
     * A string representation of the path to a given attribute or sub-attribute. Supports JMESPath.
     */
    AttributePath: AttributePath;
    /**
     * The value of the attribute. This is a Document type. This type is not supported by Java V1, Go V1, and older versions of the CLI.
     */
    AttributeValue: AttributeValue;
  }
  export interface UpdateGroupRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * A list of AttributeOperation objects to apply to the requested group. These operations might add, replace, or remove an attribute.
     */
    Operations: AttributeOperations;
  }
  export interface UpdateGroupResponse {
  }
  export interface UpdateUserRequest {
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
    /**
     * A list of AttributeOperation objects to apply to the requested user. These operations might add, replace, or remove an attribute.
     */
    Operations: AttributeOperations;
  }
  export interface UpdateUserResponse {
  }
  export interface User {
    /**
     * A unique string used to identify the user. The length limit is 128 characters. This value can consist of letters, accented characters, symbols, numbers, and punctuation. This value is specified at the time the user is created and stored as an attribute of the user object in the identity store.
     */
    UserName?: UserName;
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
    /**
     * A list of ExternalId objects that contains the identifiers issued to this resource by an external identity provider.
     */
    ExternalIds?: ExternalIds;
    /**
     * An object containing the name of the user.
     */
    Name?: Name;
    /**
     * A string containing the name of the user that is formatted for display when the user is referenced. For example, "John Doe."
     */
    DisplayName?: SensitiveStringType;
    /**
     * A string containing an alternate name for the user.
     */
    NickName?: SensitiveStringType;
    /**
     * A string containing a URL that might be associated with the user.
     */
    ProfileUrl?: SensitiveStringType;
    /**
     * A list of Email objects containing email addresses associated with the user.
     */
    Emails?: Emails;
    /**
     * A list of Address objects containing addresses associated with the user.
     */
    Addresses?: Addresses;
    /**
     * A list of PhoneNumber objects containing phone numbers associated with the user.
     */
    PhoneNumbers?: PhoneNumbers;
    /**
     * A string indicating the type of user. Possible values are left unspecified. The value can vary based on your specific use case.
     */
    UserType?: SensitiveStringType;
    /**
     * A string containing the title of the user. Possible values are left unspecified. The value can vary based on your specific use case.
     */
    Title?: SensitiveStringType;
    /**
     * A string containing the preferred language of the user. For example, "American English" or "en-us."
     */
    PreferredLanguage?: SensitiveStringType;
    /**
     * A string containing the geographical region or location of the user.
     */
    Locale?: SensitiveStringType;
    /**
     * A string containing the time zone of the user.
     */
    Timezone?: SensitiveStringType;
    /**
     * The globally unique identifier for the identity store.
     */
    IdentityStoreId: IdentityStoreId;
  }
  export type UserName = string;
  export type Users = User[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-06-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IdentityStore client.
   */
  export import Types = IdentityStore;
}
export = IdentityStore;
