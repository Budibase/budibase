import { events } from "@budibase/backend-core"
import { structures, TestConfiguration, mocks } from "../../../../tests"

describe("/api/global/groups", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
        await config.beforeAll()
    })

    afterAll(async () => {
        await config.afterAll()
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })


    describe("create", () => {
        it("should be able to create a new group", async () => {

            const group = structures.groups.UserGroup()

            let result = await config.api.groups.saveGroup(group)

            expect(events.group.created).toBeCalledTimes(1)
        })
    })

})