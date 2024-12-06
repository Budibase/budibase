import { context, utils } from "@budibase/backend-core"
import { DeploymentStatus } from "@budibase/types"

/**
 * This is used to pass around information about the deployment that is occurring
 */
export default class Deployment {
  _id: string
  verification: any
  status?: DeploymentStatus
  err?: any
  appUrl?: string

  constructor(id = null) {
    this._id = id || utils.newid()
  }

  setVerification(verification: any) {
    if (!verification) {
      return
    }
    this.verification = verification
  }

  getVerification() {
    return this.verification
  }

  setStatus(status: DeploymentStatus, err?: any) {
    this.status = status
    if (err) {
      this.err = err
    }
  }

  fromJSON(json: any) {
    if (json.verification) {
      this.setVerification(json.verification)
    }
    if (json.status) {
      this.setStatus(json.status, json.err)
    }
  }

  getJSON() {
    const obj: any = {
      _id: this._id,
      appId: context.getAppId(),
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
