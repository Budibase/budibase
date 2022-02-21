export const buildUserEndpoints = API => ({
  /**
   * Fetches the currently logged-in user object.
   * Used in client apps.
   */
  fetchSelf: async () => {
    return await API.get({
      url: "/api/self",
    })
  },

  /**
   * Fetches the currently logged-in user object.
   * Used in the builder.
   */
  fetchBuilderSelf: async () => {
    return await API.get({
      url: "/api/global/users/self",
    })
  },

  /**
   * Gets a list of users in the current tenant.
   */
  getUsers: async () => {
    return await API.get({
      url: "/api/global/users",
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
   * Updates the current logged-in user.
   * @param user the new user object to save
   */
  updateSelf: async user => {
    return await API.post({
      url: "/api/global/users/self",
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
   * Deletes a user from the curernt tenant.
   * @param userId the ID of the user to delete
   */
  deleteUser: async userId => {
    return await API.delete({
      url: `/api/global/users/${userId}`,
    })
  },

  /**
   * Invites a user to the current tenant.
   * @param email the email address to send the invitation to
   * @param builder whether the user should be a global builder
   * @param admin whether the user should be a global admin
   */
  inviteUser: async ({ email, builder, admin }) => {
    return await API.post({
      url: "/api/global/users/invite",
      body: {
        email,
        userInfo: {
          admin: admin ? { global: true } : undefined,
          builder: builder ? { global: true } : undefined,
        },
      },
    })
  },

  /**
   * Accepts an invite to join the platform and creates a user.
   * @param inviteCode the invite code sent in the email
   * @param password the password for the newly created user
   */
  acceptInvite: async ({ inviteCode, password }) => {
    return await API.post({
      url: "/api/global/users/invite/accept",
      body: {
        inviteCode,
        password,
      },
    })
  },
})
