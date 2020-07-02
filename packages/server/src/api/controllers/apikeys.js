const CouchDB = require("../../db")
const clientDb = require("../../db/clientDb")
const bcrypt = require("../../utilities/bcrypt")
const getUserId = userName => `user_${userName}`
const {
    POWERUSER_LEVEL_ID,
    ADMIN_LEVEL_ID,
} = require("../../utilities/accessLevels")

exports.fetch = async function (ctx) {
    // Temporary while "real" infrastructure to store keys is created
    ctx.status = 200
    ctx.message = "API Keys"
    ctx.body = {
        budibase: 'testFromBackEnd',
        sendgrid: 'testFromBackEnd'
    }
}

exports.update = async function (ctx) {
    ctx.status = 200
    ctx.message = `Updated ${ctx.params.key} succesfully.`
    ctx.body = {
        [ctx.params.key]: "somethingsomethingsomething"
    }

    ctx.status = 200
    ctx.message = `User ${ctx.request.body.username} updated successfully.`
    ctx.body = response
}

const checkAccessLevel = async (db, accessLevelId) => {
    if (!accessLevelId) return
    if (
        accessLevelId === POWERUSER_LEVEL_ID ||
        accessLevelId === ADMIN_LEVEL_ID
    ) {
        return {
            _id: accessLevelId,
            name: accessLevelId,
            permissions: [],
        }
    }
    return await db.get(accessLevelId)
}
