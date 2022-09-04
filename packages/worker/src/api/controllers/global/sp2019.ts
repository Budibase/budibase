const {
    getGlobalDB,
    getTenantId,
    isUserInAppTenant,
  } = require("@budibase/backend-core/tenancy")
  const { sp2019Lists } = require("../../../utilities/sp2019")




  exports.sp2019Lists = async (ctx:any) => {
    let {
        siteUrl,
        username,
        password,
        domain,
    } = ctx.request.body
    /*let user
    if (userId) {
      const db = getGlobalDB()
      user = await db.get(userId)
    }*/
    const response = await sp2019Lists(siteUrl,
        username,
        password,
        domain,
    )
    ctx.body = {
      ...response
    }
  }