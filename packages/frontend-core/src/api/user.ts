import {
  AcceptUserInviteRequest,
  AcceptUserInviteResponse,
  BulkUserCreated,
  BulkUserDeleted,
  BulkUserRequest,
  BulkUserResponse,
  CheckInviteResponse,
  CountUserResponse,
  CreateAdminUserRequest,
  CreateAdminUserResponse,
  DeleteInviteUsersRequest,
  DeleteInviteUsersResponse,
  DeleteUserResponse,
  FetchUsersResponse,
  FindUserResponse,
  GetUserInvitesResponse,
  InviteUsersRequest,
  InviteUsersResponse,
  LookupAccountHolderResponse,
  SaveUserResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UnsavedUser,
  UpdateInviteRequest,
  UpdateInviteResponse,
  UpdateSelfMetadataRequest,
  UpdateSelfMetadataResponse,
  UserIdentifier,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface UserEndpoints {
  getUsers: () => Promise<FetchUsersResponse>
  getUser: (userId: string) => Promise<FindUserResponse>
  updateOwnMetadata: (
    metadata: UpdateSelfMetadataRequest
  ) => Promise<UpdateSelfMetadataResponse>
  createAdminUser: (
    user: CreateAdminUserRequest
  ) => Promise<CreateAdminUserResponse>
  saveUser: (user: UnsavedUser) => Promise<SaveUserResponse>
  deleteUser: (userId: string) => Promise<DeleteUserResponse>
  deleteUsers: (users: UserIdentifier[]) => Promise<BulkUserDeleted | undefined>
  onboardUsers: (data: InviteUsersRequest) => Promise<InviteUsersResponse>
  getUserInvite: (code: string) => Promise<CheckInviteResponse>
  getUserInvites: () => Promise<GetUserInvitesResponse>
  inviteUsers: (users: InviteUsersRequest) => Promise<InviteUsersResponse>
  removeUserInvites: (
    data: DeleteInviteUsersRequest
  ) => Promise<DeleteInviteUsersResponse>
  acceptInvite: (
    data: AcceptUserInviteRequest
  ) => Promise<AcceptUserInviteResponse>
  getUserCountByApp: (appId: string) => Promise<number>
  getAccountHolder: () => Promise<LookupAccountHolderResponse>
  searchUsers: (data: SearchUsersRequest) => Promise<SearchUsersResponse>
  createUsers: (
    users: UnsavedUser[],
    groups: any[]
  ) => Promise<BulkUserCreated | undefined>
  updateUserInvite: (
    code: string,
    data: UpdateInviteRequest
  ) => Promise<UpdateInviteResponse>

  // Missing request or response types
  addAppBuilder: (userId: string, appId: string) => Promise<{ message: string }>
  removeAppBuilder: (
    userId: string,
    appId: string
  ) => Promise<{ message: string }>
}

export const buildUserEndpoints = (API: BaseAPIClient): UserEndpoints => ({
  /**
   * Gets a list of users in the current tenant.
   */
  getUsers: async () => {
    return await API.get({
      url: "/api/global/users",
    })
  },

  /**
   * Searches a list of users in the current tenant.
   */
  searchUsers: async data => {
    return await API.post({
      url: `/api/global/users/search`,
      body: data,
    })
  },

  /**
   * Get a single user by ID.
   */
  getUser: async userId => {
    return await API.get({
      url: `/api/global/users/${userId}`,
    })
  },

  /**
   * Updates the current user metadata.
   * @param metadata the metadata to save
   */
  updateOwnMetadata: async metadata => {
    return await API.post({
      url: "/api/users/metadata/self",
      body: metadata,
    })
  },

  /**
   * Creates an admin user.
   * @param user the admin user to create
   */
  createAdminUser: async user => {
    return await API.post({
      url: "/api/global/users/init",
      body: user,
    })
  },

  /**
   * Creates or updates a user in the current tenant.
   * @param user the new user to create
   */
  saveUser: async user => {
    return await API.post({
      url: "/api/global/users",
      body: user,
    })
  },

  /**
   * Creates multiple users.
   * @param users the array of user objects to create
   * @param groups the array of group ids to add all users to
   */
  createUsers: async (users, groups) => {
    const res = await API.post<BulkUserRequest, BulkUserResponse>({
      url: "/api/global/users/bulk",
      body: {
        create: {
          users,
          groups,
        },
      },
    })
    return res.created
  },

  /**
   * Deletes a user from the curernt tenant.
   * @param userId the ID of the user to delete
   */
  deleteUser: async userId => {
    return await API.delete({
      url: `/api/global/users/${userId}`,
    })
  },

  /**
   * Deletes multiple users
   * @param users the ID/email pair of the user to delete
   */
  deleteUsers: async users => {
    const res = await API.post<BulkUserRequest, BulkUserResponse>({
      url: `/api/global/users/bulk`,
      body: {
        delete: {
          users,
        },
      },
    })
    return res.deleted
  },

  /**
   * Onboards multiple users
   */
  onboardUsers: async data => {
    return await API.post({
      url: "/api/global/users/onboard",
      body: data,
    })
  },

  /**
   * Accepts a user invite as a body and will update the associated app roles.
   * for an existing invite
   */
  updateUserInvite: async (code, data) => {
    return await API.post<UpdateInviteRequest, UpdateInviteResponse>({
      url: `/api/global/users/invite/update/${code}`,
      body: data,
    })
  },

  /**
   * Retrieves the invitation associated with a provided code.
   * @param code The unique code for the target invite
   */
  getUserInvite: async code => {
    return await API.get({
      url: `/api/global/users/invite/${code}`,
    })
  },

  /**
   * Retrieves all user invitations for the current tenant.
   */
  getUserInvites: async () => {
    return await API.get({
      url: `/api/global/users/invites`,
    })
  },

  /**
   * Invites multiple users to the current tenant.
   * @param users An array of users to invite
   */
  inviteUsers: async users => {
    return await API.post({
      url: "/api/global/users/multi/invite",
      body: users,
    })
  },

  /**
   * Removes multiple user invites from Redis cache
   */
  removeUserInvites: async data => {
    return await API.post({
      url: "/api/global/users/multi/invite/delete",
      body: data,
    })
  },

  /**
   * Accepts an invite to join the platform and creates a user.
   */
  acceptInvite: async data => {
    return await API.post({
      url: "/api/global/users/invite/accept",
      body: data,
    })
  },

  /**
   * Counts the number of users in an app
   */
  getUserCountByApp: async appId => {
    const res = await API.get<CountUserResponse>({
      url: `/api/global/users/count/${appId}`,
    })
    return res.userCount
  },

  /**
   * Adds a per app builder to the selected app
   * @param userId The id of the user to add as a builder
   * @param appId the applications id
   */
  addAppBuilder: async (userId, appId) => {
    return await API.post({
      url: `/api/global/users/${userId}/app/${appId}/builder`,
    })
  },

  /**
   * Removes a per app builder to the selected app
   * @param userId The id of the user to remove as a builder
   * @param appId the applications id
   */
  removeAppBuilder: async (userId, appId) => {
    return await API.delete({
      url: `/api/global/users/${userId}/app/${appId}/builder`,
    })
  },

  /**
   * Gets the account holder of the current tenant
   */
  getAccountHolder: async () => {
    return await API.get({
      url: `/api/global/users/accountholder`,
    })
  },
})
