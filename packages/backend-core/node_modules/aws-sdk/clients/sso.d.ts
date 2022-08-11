import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SSO extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SSO.Types.ClientConfiguration)
  config: Config & SSO.Types.ClientConfiguration;
  /**
   * Returns the STS short-term credentials for a given role name that is assigned to the user.
   */
  getRoleCredentials(params: SSO.Types.GetRoleCredentialsRequest, callback?: (err: AWSError, data: SSO.Types.GetRoleCredentialsResponse) => void): Request<SSO.Types.GetRoleCredentialsResponse, AWSError>;
  /**
   * Returns the STS short-term credentials for a given role name that is assigned to the user.
   */
  getRoleCredentials(callback?: (err: AWSError, data: SSO.Types.GetRoleCredentialsResponse) => void): Request<SSO.Types.GetRoleCredentialsResponse, AWSError>;
  /**
   * Lists all roles that are assigned to the user for a given AWS account.
   */
  listAccountRoles(params: SSO.Types.ListAccountRolesRequest, callback?: (err: AWSError, data: SSO.Types.ListAccountRolesResponse) => void): Request<SSO.Types.ListAccountRolesResponse, AWSError>;
  /**
   * Lists all roles that are assigned to the user for a given AWS account.
   */
  listAccountRoles(callback?: (err: AWSError, data: SSO.Types.ListAccountRolesResponse) => void): Request<SSO.Types.ListAccountRolesResponse, AWSError>;
  /**
   * Lists all AWS accounts assigned to the user. These AWS accounts are assigned by the administrator of the account. For more information, see Assign User Access in the AWS SSO User Guide. This operation returns a paginated response.
   */
  listAccounts(params: SSO.Types.ListAccountsRequest, callback?: (err: AWSError, data: SSO.Types.ListAccountsResponse) => void): Request<SSO.Types.ListAccountsResponse, AWSError>;
  /**
   * Lists all AWS accounts assigned to the user. These AWS accounts are assigned by the administrator of the account. For more information, see Assign User Access in the AWS SSO User Guide. This operation returns a paginated response.
   */
  listAccounts(callback?: (err: AWSError, data: SSO.Types.ListAccountsResponse) => void): Request<SSO.Types.ListAccountsResponse, AWSError>;
  /**
   * Removes the client- and server-side session that is associated with the user.
   */
  logout(params: SSO.Types.LogoutRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the client- and server-side session that is associated with the user.
   */
  logout(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace SSO {
  export type AccessKeyType = string;
  export type AccessTokenType = string;
  export type AccountIdType = string;
  export interface AccountInfo {
    /**
     * The identifier of the AWS account that is assigned to the user.
     */
    accountId?: AccountIdType;
    /**
     * The display name of the AWS account that is assigned to the user.
     */
    accountName?: AccountNameType;
    /**
     * The email address of the AWS account that is assigned to the user.
     */
    emailAddress?: EmailAddressType;
  }
  export type AccountListType = AccountInfo[];
  export type AccountNameType = string;
  export type EmailAddressType = string;
  export type ExpirationTimestampType = number;
  export interface GetRoleCredentialsRequest {
    /**
     * The friendly name of the role that is assigned to the user.
     */
    roleName: RoleNameType;
    /**
     * The identifier for the AWS account that is assigned to the user.
     */
    accountId: AccountIdType;
    /**
     * The token issued by the CreateToken API call. For more information, see CreateToken in the AWS SSO OIDC API Reference Guide.
     */
    accessToken: AccessTokenType;
  }
  export interface GetRoleCredentialsResponse {
    /**
     * The credentials for the role that is assigned to the user.
     */
    roleCredentials?: RoleCredentials;
  }
  export interface ListAccountRolesRequest {
    /**
     * The page token from the previous response output when you request subsequent pages.
     */
    nextToken?: NextTokenType;
    /**
     * The number of items that clients can request per page.
     */
    maxResults?: MaxResultType;
    /**
     * The token issued by the CreateToken API call. For more information, see CreateToken in the AWS SSO OIDC API Reference Guide.
     */
    accessToken: AccessTokenType;
    /**
     * The identifier for the AWS account that is assigned to the user.
     */
    accountId: AccountIdType;
  }
  export interface ListAccountRolesResponse {
    /**
     * The page token client that is used to retrieve the list of accounts.
     */
    nextToken?: NextTokenType;
    /**
     * A paginated response with the list of roles and the next token if more results are available.
     */
    roleList?: RoleListType;
  }
  export interface ListAccountsRequest {
    /**
     * (Optional) When requesting subsequent pages, this is the page token from the previous response output.
     */
    nextToken?: NextTokenType;
    /**
     * This is the number of items clients can request per page.
     */
    maxResults?: MaxResultType;
    /**
     * The token issued by the CreateToken API call. For more information, see CreateToken in the AWS SSO OIDC API Reference Guide.
     */
    accessToken: AccessTokenType;
  }
  export interface ListAccountsResponse {
    /**
     * The page token client that is used to retrieve the list of accounts.
     */
    nextToken?: NextTokenType;
    /**
     * A paginated response with the list of account information and the next token if more results are available.
     */
    accountList?: AccountListType;
  }
  export interface LogoutRequest {
    /**
     * The token issued by the CreateToken API call. For more information, see CreateToken in the AWS SSO OIDC API Reference Guide.
     */
    accessToken: AccessTokenType;
  }
  export type MaxResultType = number;
  export type NextTokenType = string;
  export interface RoleCredentials {
    /**
     * The identifier used for the temporary security credentials. For more information, see Using Temporary Security Credentials to Request Access to AWS Resources in the AWS IAM User Guide.
     */
    accessKeyId?: AccessKeyType;
    /**
     * The key that is used to sign the request. For more information, see Using Temporary Security Credentials to Request Access to AWS Resources in the AWS IAM User Guide.
     */
    secretAccessKey?: SecretAccessKeyType;
    /**
     * The token used for temporary credentials. For more information, see Using Temporary Security Credentials to Request Access to AWS Resources in the AWS IAM User Guide.
     */
    sessionToken?: SessionTokenType;
    /**
     * The date on which temporary security credentials expire.
     */
    expiration?: ExpirationTimestampType;
  }
  export interface RoleInfo {
    /**
     * The friendly name of the role that is assigned to the user.
     */
    roleName?: RoleNameType;
    /**
     * The identifier of the AWS account assigned to the user.
     */
    accountId?: AccountIdType;
  }
  export type RoleListType = RoleInfo[];
  export type RoleNameType = string;
  export type SecretAccessKeyType = string;
  export type SessionTokenType = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-06-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SSO client.
   */
  export import Types = SSO;
}
export = SSO;
