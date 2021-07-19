const env = require("../../../environment")

exports.multiTenancyEnabled = async ctx => {
  ctx.body = {
    enabled: !!env.MULTI_TENANCY,
  }
}

exports.exists = async ctx => {

}

exports.fetch = async ctx => {

}
