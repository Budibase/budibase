export const buildGroupsEndpoints = API => ({
    /**
     * Creates or updates a user in the current tenant.
     * @param user the new user to create
     */
    saveGroup: async group => {
        return await API.post({
            url: "/api/global/groups",
            body: group,
        })
    },
    getGroups: async () => {
        return await API.get({
            url: "/api/global/groups",
        })

    }
})
