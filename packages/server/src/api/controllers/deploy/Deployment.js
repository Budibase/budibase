const newid = require("../../../db/newid")

/**
 * This is used to pass around information about the deployment that is occurring
 */
class Deployment {
  constructor(appId, id = null) {
    this.appId = appId
    this._id = id || newid()
  }

  getAppId() {
    return this.appId
  }

  setVerification(verification) {
    if (!verification) {
      return
    }
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

  fromJSON(json) {
    if (json.verification) {
      this.setVerification(json.verification)
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
    return obj
  }
}

module.exports = Deployment
