// import api from 'builderStore/api'

// jest.mock('builderStore/api');

// const PERMISSIONS_FOR_RESOURCE = {
//     "write": "BASIC",
//     "read": "BASIC"
// }

// import { createQueriesStore } from "../queries"

// describe("Queries Store", () => {
//   const store = createQueriesStore()

//   it("fetches permissions for specific resource", async () => {
//     api.get.mockReturnValueOnce({ json: () => PERMISSIONS_FOR_RESOURCE})

//     const resourceId = "ta_013657543b4043b89dbb17e9d3a4723a"

//     const permissions = await store.forResource(resourceId)

//     expect(api.get).toBeCalledWith(`/api/permission/${resourceId}`)
//     expect(permissions).toEqual(PERMISSIONS_FOR_RESOURCE)
    
//   })
// })