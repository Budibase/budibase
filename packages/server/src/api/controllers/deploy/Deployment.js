const newid = require("../../../db/newid")
const { getAppId } = require("@budibase/backend-core/context")

/**
 * This is used to pass around information about the deployment that is occurring
 */
class Deployment {
  constructor(id = null) {
    this._id = id || newid()
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
      appId: getAppId(),
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
