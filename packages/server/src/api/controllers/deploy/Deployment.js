const { getAppQuota } = require("./quota")
const env = require("../../../environment")

/**
 * This is used to pass around information about the deployment that is occurring
 */
class Deployment {
  constructor(id, appId) {
    this._id = id
    this.appId = appId
  }

  // purely so that we can do quota stuff outside the main deployment context
  async init() {
    if (!env.SELF_HOSTED) {
      this.setQuota(await getAppQuota(this.appId))
    }
  }

  setQuota(quota) {
    this.quota = quota
  }

  getQuota() {
    return this.quota
  }

  getAppId() {
    return this.appId
  }

  setVerification(verification) {
    this.verification = verification
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
    if (this.verification && this.verification.quota) {
      obj.quota = this.verification.quota
    }
    return obj
  }
}

module.exports = Deployment
