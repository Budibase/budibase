import generator from "../../generator";

export const generateDeveloper = (): Object => {
    const randomId = generator.guid();
    return ({
        create: {
            users: [{
                email: `pedro+${randomId}@budibase.com`,
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
}

export const generateAdmin = (): Object => {
    const randomId = generator.guid();
    return ({
        create: {
            users: [{
                email: `pedro+${randomId}@budibase.com`,
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
}
export const generateAppUser = (): Object => {
    const randomId = generator.guid();
    const user = {
        create: {
            users: [{
                email: `pedro+${randomId}@budibase.com`,
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
    }
    return user
}

export const generateInviteUser = (): Object[] => {
    //const randomId = generator.guid();
    return [{
        email: `pedro+test@budibase.com`,
        userInfo: {
            userGroups: []
        }
    }]

}