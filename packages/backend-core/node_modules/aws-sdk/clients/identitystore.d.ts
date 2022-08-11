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
   * Retrieves the group metadata and attributes from GroupId in an identity store.
   */
  describeGroup(params: IdentityStore.Types.DescribeGroupRequest, callback?: (err: AWSError, data: IdentityStore.Types.DescribeGroupResponse) => void): Request<IdentityStore.Types.DescribeGroupResponse, AWSError>;
  /**
   * Retrieves the group metadata and attributes from GroupId in an identity store.
   */
  describeGroup(callback?: (err: AWSError, data: IdentityStore.Types.DescribeGroupResponse) => void): Request<IdentityStore.Types.DescribeGroupResponse, AWSError>;
  /**
   * Retrieves the user metadata and attributes from UserId in an identity store.
   */
  describeUser(params: IdentityStore.Types.DescribeUserRequest, callback?: (err: AWSError, data: IdentityStore.Types.DescribeUserResponse) => void): Request<IdentityStore.Types.DescribeUserResponse, AWSError>;
  /**
   * Retrieves the user metadata and attributes from UserId in an identity store.
   */
  describeUser(callback?: (err: AWSError, data: IdentityStore.Types.DescribeUserResponse) => void): Request<IdentityStore.Types.DescribeUserResponse, AWSError>;
  /**
   * Lists the attribute name and value of the group that you specified in the search. We only support DisplayName as a valid filter attribute path currently, and filter is required. This API returns minimum attributes, including GroupId and group DisplayName in the response.
   */
  listGroups(params: IdentityStore.Types.ListGroupsRequest, callback?: (err: AWSError, data: IdentityStore.Types.ListGroupsResponse) => void): Request<IdentityStore.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists the attribute name and value of the group that you specified in the search. We only support DisplayName as a valid filter attribute path currently, and filter is required. This API returns minimum attributes, including GroupId and group DisplayName in the response.
   */
  listGroups(callback?: (err: AWSError, data: IdentityStore.Types.ListGroupsResponse) => void): Request<IdentityStore.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists the attribute name and value of the user that you specified in the search. We only support UserName as a valid filter attribute path currently, and filter is required. This API returns minimum attributes, including UserId and UserName in the response.
   */
  listUsers(params: IdentityStore.Types.ListUsersRequest, callback?: (err: AWSError, data: IdentityStore.Types.ListUsersResponse) => void): Request<IdentityStore.Types.ListUsersResponse, AWSError>;
  /**
   * Lists the attribute name and value of the user that you specified in the search. We only support UserName as a valid filter attribute path currently, and filter is required. This API returns minimum attributes, including UserId and UserName in the response.
   */
  listUsers(callback?: (err: AWSError, data: IdentityStore.Types.ListUsersResponse) => void): Request<IdentityStore.Types.ListUsersResponse, AWSError>;
}
declare namespace IdentityStore {
  export type AttributePath = string;
  export interface DescribeGroupRequest {
    /**
     * The globally unique identifier for the identity store, such as d-1234567890. In this example, d- is a fixed prefix, and 1234567890 is a randomly generated string that contains number and lower case letters. This value is generated at the time that a new identity store is created.
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
     * Contains the group’s display name value. The length limit is 1,024 characters. This value can consist of letters, accented characters, symbols, numbers, punctuation, tab, new line, carriage return, space, and nonbreaking space in this attribute. The characters &lt;&gt;;:% are excluded. This value is specified at the time that the group is created and stored as an attribute of the group object in the identity store.
     */
    DisplayName: GroupDisplayName;
  }
  export interface DescribeUserRequest {
    /**
     * The globally unique identifier for the identity store, such as d-1234567890. In this example, d- is a fixed prefix, and 1234567890 is a randomly generated string that contains number and lower case letters. This value is generated at the time that a new identity store is created.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
  }
  export interface DescribeUserResponse {
    /**
     * Contains the user’s user name value. The length limit is 128 characters. This value can consist of letters, accented characters, symbols, numbers, and punctuation. The characters &lt;&gt;;:% are excluded. This value is specified at the time the user is created and stored as an attribute of the user object in the identity store.
     */
    UserName: UserName;
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
  }
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
  export interface Group {
    /**
     * The identifier for a group in the identity store.
     */
    GroupId: ResourceId;
    /**
     * Contains the group’s display name value. The length limit is 1,024 characters. This value can consist of letters, accented characters, symbols, numbers, punctuation, tab, new line, carriage return, space, and nonbreaking space in this attribute. The characters &lt;&gt;;:% are excluded. This value is specified at the time the group is created and stored as an attribute of the group object in the identity store.
     */
    DisplayName: GroupDisplayName;
  }
  export type GroupDisplayName = string;
  export type Groups = Group[];
  export type IdentityStoreId = string;
  export interface ListGroupsRequest {
    /**
     * The globally unique identifier for the identity store, such as d-1234567890. In this example, d- is a fixed prefix, and 1234567890 is a randomly generated string that contains number and lower case letters. This value is generated at the time that a new identity store is created.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The maximum number of results to be returned per request. This parameter is used in the ListUsers and ListGroups request to specify how many results to return in one page. The length limit is 50 characters.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token used for the ListUsers and ListGroups API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
    /**
     * A list of Filter objects, which is used in the ListUsers and ListGroups request. 
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
     * The globally unique identifier for the identity store, such as d-1234567890. In this example, d- is a fixed prefix, and 1234567890 is a randomly generated string that contains number and lower case letters. This value is generated at the time that a new identity store is created.
     */
    IdentityStoreId: IdentityStoreId;
    /**
     * The maximum number of results to be returned per request. This parameter is used in the ListUsers and ListGroups request to specify how many results to return in one page. The length limit is 50 characters.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token used for the ListUsers and ListGroups API operations. This value is generated by the identity store service. It is returned in the API response if the total results are more than the size of one page. This token is also returned when it is used in the API request to search for the next page.
     */
    NextToken?: NextToken;
    /**
     * A list of Filter objects, which is used in the ListUsers and ListGroups request. 
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
  export type NextToken = string;
  export type ResourceId = string;
  export type SensitiveStringType = string;
  export interface User {
    /**
     * Contains the user’s user name value. The length limit is 128 characters. This value can consist of letters, accented characters, symbols, numbers, and punctuation. The characters &lt;&gt;;:% are excluded. This value is specified at the time the user is created and stored as an attribute of the user object in the identity store.
     */
    UserName: UserName;
    /**
     * The identifier for a user in the identity store.
     */
    UserId: ResourceId;
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
