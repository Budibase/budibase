jest.mock("nodemailer")
const { config, request, mocks, structures } = require("../../../tests")
const sendMailMock = mocks.email.mock()
const { events } = require("@budibase/backend-core")
describe("/api/global/users", () => {

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  const sendUserInvite = async () => {
    await config.saveSmtpConfig()
    await config.saveSettingsConfig()
    const res = await request
      .post(`/api/global/users/invite`)
      .send({
        email: "invite@test.com",
      })
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)

    const emailCall = sendMailMock.mock.calls[0][0]
    // after this URL there should be a code
    const parts = emailCall.html.split("http://localhost:10000/builder/invite?code=")
    const code = parts[1].split("\"")[0].split("&")[0]
    return { code, res }
  }

  it("should be able to generate an invitation", async () => {
    const { code, res } = await sendUserInvite()

    expect(res.body).toEqual({ message: "Invitation has been sent." })
    expect(sendMailMock).toHaveBeenCalled()
    expect(code).toBeDefined()
    expect(events.user.invited).toBeCalledTimes(1)
  })

  it("should be able to create new user from invite", async () => {
    const { code } = await sendUserInvite()

    const res = await request
      .post(`/api/global/users/invite/accept`)
      .send({
        password: "newpassword",
        inviteCode: code,
      })
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body._id).toBeDefined()
    const user = await config.getUser("invite@test.com")
    expect(user).toBeDefined()
    expect(user._id).toEqual(res.body._id)
    expect(events.user.inviteAccepted).toBeCalledTimes(1)
    expect(events.user.inviteAccepted).toBeCalledWith(user)
  })

  const createUser = async (user) => {
    const existing = await config.getUser(user.email)
    if (existing) {
      await deleteUser(existing._id)
    }
    return saveUser(user)
  }

  const updateUser = async (user) => {
    const existing = await config.getUser(user.email)
    user._id = existing._id
    return saveUser(user)
  }

  const saveUser = async (user) => {
    const res = await request
      .post(`/api/global/users`)
      .send(user)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body
  }


  const bulkCreateUsers = async (users) => {
    const res = await request
      .post(`/api/global/users/bulkCreate`)
      .send(users)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body
  }

  const bulkDeleteUsers = async (users) => {
    const res = await request
      .post(`/api/global/users/bulkDelete`)
      .send(users)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body
  }



  const deleteUser = async (email) => {
    const user = await config.getUser(email)
    if (user) {
      await request
        .delete(`/api/global/users/${user._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
    }
  }

  describe("create", () => {
    it("should be able to create a basic user", async () => {
      jest.clearAllMocks()
      const user = structures.users.user({ email: "basic@test.com" })
      await createUser(user)

      expect(events.user.created).toBeCalledTimes(1)
      expect(events.user.updated).not.toBeCalled()
      expect(events.user.permissionBuilderAssigned).not.toBeCalled()
      expect(events.user.permissionAdminAssigned).not.toBeCalled()
    })

    it("should be able to bulkCreate users with different permissions", async () => {
      jest.clearAllMocks()
      const builder = structures.users.builderUser({ email: "bulkbasic@test.com" })
      const admin = structures.users.adminUser({ email: "bulkadmin@test.com" })
      const user = structures.users.user({ email: "bulkuser@test.com" })

      let toCreate = { users: [builder, admin, user], groups: [] }
      await bulkCreateUsers(toCreate)

      expect(events.user.created).toBeCalledTimes(3)
      expect(events.user.permissionAdminAssigned).toBeCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).toBeCalledTimes(1)
    })


    it("should be able to create an admin user", async () => {
      jest.clearAllMocks()
      const user = structures.users.adminUser({ email: "admin@test.com" })
      await createUser(user)

      expect(events.user.created).toBeCalledTimes(1)
      expect(events.user.updated).not.toBeCalled()
      expect(events.user.permissionBuilderAssigned).not.toBeCalled()
      expect(events.user.permissionAdminAssigned).toBeCalledTimes(1)
    })

    it("should be able to create a builder user", async () => {
      jest.clearAllMocks()
      const user = structures.users.builderUser({ email: "builder@test.com" })
      await createUser(user)

      expect(events.user.created).toBeCalledTimes(1)
      expect(events.user.updated).not.toBeCalled()
      expect(events.user.permissionBuilderAssigned).toBeCalledTimes(1)
      expect(events.user.permissionAdminAssigned).not.toBeCalled()
    })

    it("should be able to assign app roles", async () => {
      jest.clearAllMocks()
      const user = structures.users.user({ email: "assign-roles@test.com" })
      user.roles = {
        "app_123": "role1",
        "app_456": "role2",
      }

      await createUser(user)
      const savedUser = await config.getUser(user.email)

      expect(events.user.created).toBeCalledTimes(1)
      expect(events.user.updated).not.toBeCalled()
      expect(events.role.assigned).toBeCalledTimes(2)
      expect(events.role.assigned).toBeCalledWith(savedUser, "role1")
      expect(events.role.assigned).toBeCalledWith(savedUser, "role2")
    })
  })

  describe("update", () => {
    it("should be able to update a basic user", async () => {
      let user = structures.users.user({ email: "basic-update@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      await updateUser(user)

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).not.toBeCalled()
      expect(events.user.permissionAdminAssigned).not.toBeCalled()
      expect(events.user.passwordForceReset).not.toBeCalled()
    })

    it("should be able to force reset password", async () => {
      let user = structures.users.user({ email: "basic-password-update@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      user.forceResetPassword = true
      user.password = "tempPassword"
      await updateUser(user)

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).not.toBeCalled()
      expect(events.user.permissionAdminAssigned).not.toBeCalled()
      expect(events.user.passwordForceReset).toBeCalledTimes(1)
    })

    it("should be able to update a basic user to an admin user", async () => {
      let user = structures.users.user({ email: "basic-update-admin@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      await updateUser(structures.users.adminUser(user))

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).not.toBeCalled()
      expect(events.user.permissionAdminAssigned).toBeCalledTimes(1)
    })

    it("should be able to update a basic user to a builder user", async () => {
      let user = structures.users.user({ email: "basic-update-builder@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      await updateUser(structures.users.builderUser(user))

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.permissionBuilderAssigned).toBeCalledTimes(1)
      expect(events.user.permissionAdminAssigned).not.toBeCalled()
    })

    it("should be able to update an admin user to a basic user", async () => {
      let user = structures.users.adminUser({ email: "admin-update-basic@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      user.admin.global = false
      await updateUser(user)

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.permissionAdminRemoved).toBeCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).not.toBeCalled()
    })

    it("should be able to update an builder user to a basic user", async () => {
      let user = structures.users.builderUser({ email: "builder-update-basic@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      user.builder.global = false
      await updateUser(user)

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).toBeCalledTimes(1)
      expect(events.user.permissionAdminRemoved).not.toBeCalled()
    })

    it("should be able to assign app roles", async () => {
      const user = structures.users.user({ email: "assign-roles-update@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      user.roles = {
        "app_123": "role1",
        "app_456": "role2",
      }
      await updateUser(user)
      const savedUser = await config.getUser(user.email)

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.role.assigned).toBeCalledTimes(2)
      expect(events.role.assigned).toBeCalledWith(savedUser, "role1")
      expect(events.role.assigned).toBeCalledWith(savedUser, "role2")
    })

    it("should be able to unassign app roles", async () => {
      const user = structures.users.user({ email: "unassign-roles@test.com" })
      user.roles = {
        "app_123": "role1",
        "app_456": "role2",
      }
      await createUser(user)
      jest.clearAllMocks()

      user.roles = {}
      await updateUser(user)
      const savedUser = await config.getUser(user.email)

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.role.unassigned).toBeCalledTimes(2)
      expect(events.role.unassigned).toBeCalledWith(savedUser, "role1")
      expect(events.role.unassigned).toBeCalledWith(savedUser, "role2")
    })

    it("should be able to update existing app roles", async () => {
      const user = structures.users.user({ email: "update-roles@test.com" })
      user.roles = {
        "app_123": "role1",
        "app_456": "role2",
      }
      await createUser(user)
      jest.clearAllMocks()

      user.roles = {
        "app_123": "role1",
        "app_456": "role2-edit",
      }
      await updateUser(user)
      const savedUser = await config.getUser(user.email)

      expect(events.user.created).not.toBeCalled()
      expect(events.user.updated).toBeCalledTimes(1)
      expect(events.role.unassigned).toBeCalledTimes(1)
      expect(events.role.unassigned).toBeCalledWith(savedUser, "role2")
      expect(events.role.assigned).toBeCalledTimes(1)
      expect(events.role.assigned).toBeCalledWith(savedUser, "role2-edit")
    })
  })

  describe("destroy", () => {
    it("should be able to destroy a basic user", async () => {
      let user = structures.users.user({ email: "destroy@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      await deleteUser(user.email)

      expect(events.user.deleted).toBeCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).not.toBeCalled()
      expect(events.user.permissionAdminRemoved).not.toBeCalled()
    })

    it("should be able to destroy an admin user", async () => {
      let user = structures.users.adminUser({ email: "destroy-admin@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      await deleteUser(user.email)

      expect(events.user.deleted).toBeCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).not.toBeCalled()
      expect(events.user.permissionAdminRemoved).toBeCalledTimes(1)
    })

    it("should be able to destroy a builder user", async () => {
      let user = structures.users.builderUser({ email: "destroy-admin@test.com" })
      await createUser(user)
      jest.clearAllMocks()

      await deleteUser(user.email)

      expect(events.user.deleted).toBeCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).toBeCalledTimes(1)
      expect(events.user.permissionAdminRemoved).not.toBeCalled()
    })

    it("should be able to bulk delete users with different permissions", async () => {
      jest.clearAllMocks()
      const builder = structures.users.builderUser({ email: "basic@test.com" })
      const admin = structures.users.adminUser({ email: "admin@test.com" })
      const user = structures.users.user({ email: "user@test.com" })

      let toCreate = { users: [builder, admin, user], groups: [] }
      let createdUsers = await bulkCreateUsers(toCreate)
      await bulkDeleteUsers({ userIds: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id] })
      expect(events.user.deleted).toBeCalledTimes(3)
      expect(events.user.permissionAdminRemoved).toBeCalledTimes(1)
      expect(events.user.permissionBuilderRemoved).toBeCalledTimes(1)

    })

  })
})