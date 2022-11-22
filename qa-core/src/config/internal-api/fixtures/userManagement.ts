import generator from "../../generator";

const randomId = generator.guid;
export const generateDeveloper = (): any => ({
    create: {
        users: [{
            email: `pedro+${randomId()}@budibase.com`,
            password: randomId,
            roles: {},
            forceResetPassword: true,
            builder: {
                global: true
            }
        }],
        groups: []
    }
})

export const generateAdmin = (): any => ({
    create: {
        users: [{
            email: `pedro+${randomId()}@budibase.com`,
            password: randomId,
            roles: {},
            forceResetPassword: true,
            admin: {
                global: true
            },
            builder: {
                global: true
            }
        }],
        groups: []
    }
})
export const generateAppUser = (): any => ({
    create: {
        users: [{
            email: `pedro+${randomId()}@budibase.com`,
            password: randomId,
            roles: {},
            forceResetPassword: true,
            admin: {
                global: false
            },
            builder: {
                global: false
            }
        }],
        groups: []
    }
})

export const generateInviteUser = (): any => (
    [{
        email: `pedro+${randomId()}@budibase.com`,
        userInfo: {
            admin: {
                global: true
            },
            builder: {
                global: true
            },
            userGroups: []
        }
    }]
)