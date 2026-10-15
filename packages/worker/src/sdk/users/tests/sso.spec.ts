import { auth, cache, context, events, tenancy } from "@budibase/backend-core"
import { groups } from "@budibase/pro"
import { SSOProviderType } from "@budibase/types"
import { mocks, structures } from "../../../tests"
import { db as userDb, saveSSO } from ".."

describe.each([SSOProviderType.GOOGLE, SSOProviderType.OIDC])(
  "%s group persistence",
  providerType => {
    beforeEach(() => {
      jest.clearAllMocks()
      mocks.licenses.useUnlimited()
      mocks.licenses.useGroups()
      jest.spyOn(events.group, "usersAdded").mockResolvedValue(undefined)
      jest.spyOn(events.group, "usersDeleted").mockResolvedValue(undefined)
    })
    afterEach(() => {
      jest.restoreAllMocks()
    })

    const login = async ({ email }: { email: string }) => {
      const done = jest.fn()
      const profile = {
        id: structures.uuid(),
        _json: { email, email_verified: true },
      }
      if (providerType === SSOProviderType.GOOGLE) {
        await auth.google.buildVerifyFn(saveSSO)(
          "updated-token",
          "refresh-token",
          profile,
          done
        )
      } else {
        await Reflect.apply(auth.oidc.buildVerifyFn(saveSSO), undefined, [
          "https://example.com",
          profile,
          profile,
          {},
          "id-token",
          "updated-token",
          "refresh-token",
          {},
          done,
        ])
      }
      return done
    }

    it("preserves existing SCIM memberships after the groups licence expires", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const group = await groups.save({
          ...structures.groups.UserGroup(),
          roles: {},
          scimInfo: { externalId: structures.uuid(), isSync: true },
        })
        const existing = await userDb.save(
          structures.users.user({ userGroups: [group.id], roles: {} })
        )
        mocks.licenses.useCloudFree()
        const done = await login({ email: existing.email })

        expect(done).toHaveBeenCalledWith(
          null,
          expect.objectContaining({
            _id: existing._id,
            userGroups: [group.id],
            providerType,
          })
        )
        expect(await userDb.getUserByEmail(existing.email)).toEqual(
          expect.objectContaining({
            userGroups: [group.id],
            password: existing.password,
            oauth2: {
              accessToken: "updated-token",
              refreshToken: "refresh-token",
            },
          })
        )
        expect(events.group.usersAdded).not.toHaveBeenCalled()
        expect(events.group.usersDeleted).not.toHaveBeenCalled()
      })
    })

    it.each(["malformed", "duplicate"])(
      "rejects %s legacy group IDs without modifying the existing user",
      async kind => {
        await context.doInTenant(structures.tenant.id(), async () => {
          const existing = await userDb.save(
            structures.users.user({ roles: {} })
          )
          const groupId = `gr_${structures.uuid()}`
          const userGroups =
            kind === "malformed" ? ["legacy-group"] : [groupId, groupId]
          const legacyUser = { ...existing, userGroups }
          const result = await tenancy.getGlobalDB().put(legacyUser)
          const done = await login({ email: existing.email })

          expect(done).toHaveBeenCalledWith(expect.any(Error), null, {
            message: "Error saving user",
          })
          expect(await userDb.getUserByEmail(existing.email)).toEqual({
            ...legacyUser,
            _rev: result.rev,
          })
          expect(events.group.usersAdded).not.toHaveBeenCalled()
        })
      }
    )

    it("assigns the default group to an invited user without a groups licence", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const group = await groups.save({
          ...structures.groups.UserGroup(),
          roles: {},
          isDefault: true,
        })
        const email = structures.users.newEmail()
        await cache.invite.createCode(email, { roles: {} })
        mocks.licenses.useCloudFree()
        const done = await login({ email })
        const persisted = await userDb.getUserByEmail(email)

        expect(done).toHaveBeenCalledWith(
          null,
          expect.objectContaining({ userGroups: [group.id] })
        )
        expect(persisted?.userGroups).toEqual([group.id])
        expect(await cache.invite.getExistingInvites([email])).toEqual([])
        expect(events.group.usersAdded).toHaveBeenCalledWith(
          1,
          expect.objectContaining({ _id: group.id }),
          [persisted?._id]
        )
      })
    })

    it("preserves invited groups and records membership only on the first login", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const group = await groups.save({
          ...structures.groups.UserGroup(),
          roles: {},
        })
        await groups.save({
          ...structures.groups.UserGroup(),
          roles: {},
          isDefault: true,
        })
        const email = structures.users.newEmail()
        await cache.invite.createCode(email, {
          userGroups: [group.id],
          apps: { app_test: "BASIC" },
        })
        await login({ email })
        const done = await login({ email })
        const persisted = await userDb.getUserByEmail(email)

        expect(done).toHaveBeenCalledWith(
          null,
          expect.objectContaining({
            userGroups: [group.id],
            roles: { app_test: "BASIC" },
          })
        )
        expect(persisted?.userGroups).toEqual([group.id])
        expect(await cache.invite.getExistingInvites([email])).toEqual([])
        expect(events.group.usersAdded).toHaveBeenCalledTimes(1)
        expect(events.group.usersAdded).toHaveBeenCalledWith(
          1,
          expect.objectContaining({ _id: group.id }),
          [persisted?._id]
        )
      })
    })

    it.each(["missing", "SCIM-managed", "unlicensed"])(
      "rejects an invite with a %s group without creating a user or consuming the invite",
      async kind => {
        await context.doInTenant(structures.tenant.id(), async () => {
          const group = await groups.save({
            ...structures.groups.UserGroup(),
            roles: {},
            ...(kind === "SCIM-managed" && {
              scimInfo: { externalId: structures.uuid(), isSync: true },
            }),
          })
          const email = structures.users.newEmail()
          const code = await cache.invite.createCode(email, {
            userGroups: [group.id],
            roles: {},
          })
          if (kind === "missing") {
            await tenancy.getGlobalDB().remove(group.id, group.rev)
          } else if (kind === "unlicensed") {
            mocks.licenses.useCloudFree()
          }
          const done = await login({ email })

          expect(done).toHaveBeenCalledWith(expect.any(Error), null, {
            message: "Error saving user",
          })
          expect(await userDb.getUserByEmail(email)).toBeUndefined()
          expect(await cache.invite.getExistingInvites([email])).toEqual([
            expect.objectContaining({ code }),
          ])
          expect(events.group.usersAdded).not.toHaveBeenCalled()
        })
      }
    )

    it("leaves the saved user and pending invite when a membership event fails", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const group = await groups.save({
          ...structures.groups.UserGroup(),
          roles: {},
        })
        const email = structures.users.newEmail()
        const code = await cache.invite.createCode(email, {
          userGroups: [group.id],
          roles: {},
        })
        const error = new Error("Membership event unavailable")
        jest.spyOn(events.group, "usersAdded").mockRejectedValueOnce(error)
        const done = await login({ email })

        expect(done).toHaveBeenCalledWith(error, null, {
          message: "Error saving user",
        })
        expect(await userDb.getUserByEmail(email)).toEqual(
          expect.objectContaining({ userGroups: [group.id], providerType })
        )
        expect(await cache.invite.getExistingInvites([email])).toEqual([
          expect.objectContaining({ code }),
        ])
      })
    })
  }
)
