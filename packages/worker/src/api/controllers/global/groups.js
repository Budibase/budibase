const {
    generateUserGroupID,
    getUserGroupsParams
} = require("@budibase/backend-core/db")
const { Configs } = require("../../../constants")
const email = require("../../../utilities/email")
const { getGlobalDB, getTenantId } = require("@budibase/backend-core/tenancy")
const env = require("../../../environment")
const {
    withCache,
    CacheKeys,
    bustCache,
} = require("@budibase/backend-core/cache")


exports.save = async function (ctx) {
    const db = getGlobalDB()

    // Config does not exist yet
    if (!ctx.request.body._id) {
        ctx.request.body._id = generateUserGroupID(ctx.request.body.name)
    }

    try {
        const response = await db.put(ctx.request.body)
        ctx.body = {
            _id: response.id,
            _rev: response.rev,
        }
    } catch (err) {
        ctx.throw(400, err)
    }
}

exports.fetch = async function (ctx) {
    const db = getGlobalDB()
    console.log('in here')
    const response = await db.allDocs(
        getUserGroupsParams(null, {
            include_docs: true,
        })
    )
    ctx.body = response.rows.map(row => row.doc)

}


exports.destroy = async function (ctx) {
    const db = getGlobalDB()
    const { id, rev } = ctx.params

    try {
        await db.remove(id, rev)
        ctx.body = { message: "Group deleted successfully" }
    } catch (err) {
        ctx.throw(err.status, err)
    }
}
