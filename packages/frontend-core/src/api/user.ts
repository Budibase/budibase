import {
  AcceptUserInviteRequest,
  AcceptUserInviteResponse,
  AccountMetadata,
  BulkUserCreated,
  BulkUserDeleted,
  BulkUserRequest,
  BulkUserResponse,
  CreateAdminUserRequest,
  CreateAdminUserResponse,
  DeleteInviteUsersRequest,
  InviteUsersRequest,
  InviteUsersResponse,
  SaveUserResponse,
  SearchUsersRequest,
  UpdateSelfRequest,
  User,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface UserEndpoints {
  getUsers: () => Promise<User[]>
  getUser: (userId: string) => Promise<User>
  updateOwnMetadata: (metadata: UpdateSelfRequest) => Promise<void>
  createAdminUser: (
    user: CreateAdminUserRequest
  ) => Promise<CreateAdminUserResponse>
  saveUser: (user: User) => Promise<SaveUserResponse>
  deleteUser: (userId: string) => Promise<{ message: string }>
  deleteUsers: (
    users: Array<{
      userId: string
      email: string
    }>
  ) => Promise<BulkUserDeleted | undefined>
  onboardUsers: (data: InviteUsersRequest) => Promise<InviteUsersResponse>
  getUserInvite: (code: string) => Promise<{ email: string }>
  getUserInvites: () => Promise<any[]>
  inviteUsers: (users: InviteUsersRequest) => Promise<InviteUsersResponse>
  removeUserInvites: (
    data: DeleteInviteUsersRequest
  ) => Promise<{ message: string }>
  acceptInvite: (
    data: AcceptUserInviteRequest
  ) => Promise<AcceptUserInviteResponse>
  getUserCountByApp: (appId: string) => Promise<number>
  addAppBuilder: (userId: string, appId: string) => Promise<{ message: string }>
  removeAppBuilder: (
    userId: string,
    appId: string
  ) => Promise<{ message: string }>
  getAccountHolder: () => Promise<AccountMetadata | null>

  // Missing request or response types
  searchUsers: (data: SearchUsersRequest) => Promise<any>
  createUsers: (
    users: User[],
    groups: any[]
  ) => Promise<BulkUserCreated | undefined>
  updateUserInvite: (data: any) => Promise<any>
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
    return await API.post<SearchUsersRequest, any>({
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
   * @param invite the invite code sent in the email
   */
  updateUserInvite: async invite => {
    await API.post({
      url: `/api/global/users/invite/update/${invite.code}`,
      body: {
        apps: invite.apps,
        builder: invite.builder,
      },
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
    const res = await API.get<{ userCount: number }>({
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
