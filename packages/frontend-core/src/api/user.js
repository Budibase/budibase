export const buildUserEndpoints = API => ({
  /**
   * Gets a list of users in the current tenant.
   */
  getUsers: async () => {
    return await API.get({
      url: "/api/global/users",
    })
  },

  /**
   * Gets a list of users in the current tenant.
   * @param {string} page The page to retrieve
   * @param {string} search The starts with string to search username/email by.
   * @param {string} appId Facilitate app/role based user searching
   * @param {boolean} paginated Allow the disabling of pagination
   */
  searchUsers: async ({ paginated, page, email, appId } = {}) => {
    const opts = {}
    if (page) {
      opts.page = page
    }
    if (email) {
      opts.email = email
    }
    if (appId) {
      opts.appId = appId
    }
    if (typeof paginated === "boolean") {
      opts.paginated = paginated
    }
    return await API.post({
      url: `/api/global/users/search`,
      body: opts,
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
   * Creates a user for an app.
   * @param user the user to create
   */
  createAppUser: async user => {
    return await API.post({
      url: "/api/users/metadata",
      body: user,
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
   * @param adminUser the admin user to create
   */
  createAdminUser: async adminUser => {
    return await API.post({
      url: "/api/global/users/init",
      body: adminUser,
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
  createUsers: async ({ users, groups }) => {
    const res = await API.post({
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
   * @param userIds the ID of the user to delete
   */
  deleteUsers: async userIds => {
    const res = await API.post({
      url: `/api/global/users/bulk`,
      body: {
        delete: {
          userIds,
        },
      },
    })
    return res.deleted
  },

  /**
   * Invites a user to the current tenant.
   * @param email the email address to send the invitation to
   * @param builder whether the user should be a global builder
   * @param admin whether the user should be a global admin
   */
  inviteUser: async ({ email, builder, admin, apps }) => {
    return await API.post({
      url: "/api/global/users/invite",
      body: {
        email,
        userInfo: {
          admin: admin ? { global: true } : undefined,
          builder: builder ? { global: true } : undefined,
          apps: apps ? apps : undefined,
        },
      },
    })
  },

  onboardUsers: async payload => {
    return await API.post({
      url: "/api/global/users/onboard",
      body: payload.map(invite => {
        const { email, admin, builder, apps } = invite
        return {
          email,
          userInfo: {
            admin: admin ? { global: true } : undefined,
            builder: builder ? { global: true } : undefined,
            apps: apps ? apps : undefined,
          },
        }
      }),
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
      body: users.map(user => ({
        email: user.email,
        userInfo: {
          admin: user.admin ? { global: true } : undefined,
          builder: user.admin || user.builder ? { global: true } : undefined,
          userGroups: user.groups,
          roles: user.apps ? user.apps : undefined,
        },
      })),
    })
  },

  /**
   * Accepts an invite to join the platform and creates a user.
   * @param inviteCode the invite code sent in the email
   * @param password the password for the newly created user
   * @param firstName the first name of the new user
   * @param lastName the last name of the new user
   */
  acceptInvite: async ({ inviteCode, password, firstName, lastName }) => {
    return await API.post({
      url: "/api/global/users/invite/accept",
      body: {
        inviteCode,
        password,
        firstName,
        lastName,
      },
    })
  },

  /**
   * Accepts an invite to join the platform and creates a user.
   * @param inviteCode the invite code sent in the email
   * @param password the password for the newly created user
   */
  getUserCountByApp: async ({ appId }) => {
    return await API.get({
      url: `/api/global/users/count/${appId}`,
    })
  },
})
