/*

const { config, request, structures } = require("../../../tests")
const { events } = require("@budibase/backend-core")
describe("/api/global/groups", () => {

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    const createGroup = async (group) => {
        const existing = await config.getGroup(group.name)
        if (existing) {
            await deleteGroup(existing._id)
        }
        return config.saveGroup(group)
    }

    const updateGroup = async (group) => {
        const existing = await config.getGroup(group._id)
        group._id = existing._id
        return config.saveGroup(group)
    }


    const deleteGroup = async (group) => {
        const oldGroup = await config.getGroup(group._id)
        if (oldGroup) {
            await request
                .delete(`/api/global/users/${oldGroup._id}`)
                .set(config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(200)
        }
    }

    describe("create", () => {
        it("should be able to create a basic group", async () => {
            jest.clearAllMocks()
            const group = structures.groups.UserGroup()
            await createGroup(group)

            expect(events.group.created).toBeCalledTimes(1)
            expect(events.group.updated).not.toBeCalled()
            expect(events.group.permissionsEdited).not.toBeCalled()
        })
    })
    describe("update", () => {
        it("should be able to update a basic group", async () => {
            jest.clearAllMocks()
            const group = structures.groups.UserGroup()
            let oldGroup = await createGroup(group)

            let groupToSend = {
                ...group,
                ...oldGroup,
                name: "New Name"
            }
            await updateGroup(groupToSend)

            expect(events.group.updated).toBeCalledTimes(1)
            expect(events.group.permissionsEdited).not.toBeCalled()
        })
        it("should be able to update permissions on a group", async () => {
            jest.clearAllMocks()
            const group = structures.groups.UserGroup()
            let oldGroup = await createGroup(group)

            let groupToSend = {
                ...group,
                ...oldGroup,
                roles: { app_1234345345: "BASIC" }
            }
            await updateGroup(groupToSend)

            expect(events.group.updated).toBeCalledTimes(1)
            expect(events.group.permissionsEdited).toBeCalledTimes(1)
        })
    })

    describe("destroy", () => {
        it("should be able to destroy a basic group", async () => {
            const group = structures.groups.UserGroup()
            let oldGroup = await createGroup(group)
            jest.clearAllMocks()
            await deleteGroup(oldGroup)

            expect(events.user.deleted).toBeCalledTimes(1)
        })
    })
})
*/