const { getAppQuota } = require("./quota")
const env = require("../../../environment")
const newid = require("../../../db/newid")

/**
 * This is used to pass around information about the deployment that is occurring
 */
class Deployment {
  constructor(appId, id = null) {
    this.appId = appId
    this._id = id || newid()
  }

  // purely so that we can do quota stuff outside the main deployment context
  async init() {
    if (!env.SELF_HOSTED) {
      this.setQuota(await getAppQuota(this.appId))
    }
  }

  setQuota(quota) {
    if (!quota) {
      return
    }
    this.quota = quota
  }

  getQuota() {
    return this.quota
  }

  getAppId() {
    return this.appId
  }

  setVerification(verification) {
    if (!verification) {
      return
    }
    this.verification = verification
    if (this.verification.quota) {
      this.quota = this.verification.quota
    }
  }

  getVerification() {
    return this.verification
  }

  setStatus(status, err = null) {
    this.status = status
    if (err) {
      this.err = err
    }
  }

  fromJSON(json) {
    if (json.verification) {
      this.setVerification(json.verification)
    }
    if (json.quota) {
      this.setQuota(json.quota)
    }
    if (json.status) {
      this.setStatus(json.status, json.err)
    }
  }

  getJSON() {
    const obj = {
      _id: this._id,
      appId: this.appId,
      status: this.status,
    }
    if (this.err) {
      obj.err = this.err
    }
    if (this.verification && this.verification.cfDistribution) {
      obj.cfDistribution = this.verification.cfDistribution
    }
    if (this.quota) {
      obj.quota = this.quota
    }
    return obj
  }
}

module.exports = Deployment
