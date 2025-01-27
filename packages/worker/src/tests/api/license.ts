import { TestAPI } from "./base"
import {
  ActivateLicenseKeyRequest,
  ActivateOfflineLicenseTokenRequest,
} from "@budibase/types"

export class LicenseAPI extends TestAPI {
  refresh = async () => {
    return this.request
      .post("/api/global/license/refresh")
      .set(this.config.defaultHeaders())
  }
  getUsage = async () => {
    return this.request
      .get("/api/global/license/usage")
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
  activateLicenseKey = async (body: ActivateLicenseKeyRequest) => {
    return this.request
      .post("/api/global/license/key")
      .send(body)
      .set(this.config.defaultHeaders())
  }
  getLicenseKey = async () => {
    return this.request
      .get("/api/global/license/key")
      .set(this.config.defaultHeaders())
  }
  deleteLicenseKey = async () => {
    return this.request
      .delete("/api/global/license/key")
      .set(this.config.defaultHeaders())
  }
  activateOfflineLicense = async (body: ActivateOfflineLicenseTokenRequest) => {
    return this.request
      .post("/api/global/license/offline")
      .send(body)
      .set(this.config.defaultHeaders())
  }
  getOfflineLicense = async () => {
    return this.request
      .get("/api/global/license/offline")
      .set(this.config.defaultHeaders())
  }
  deleteOfflineLicense = async () => {
    return this.request
      .delete("/api/global/license/offline")
      .set(this.config.defaultHeaders())
  }
  getOfflineLicenseIdentifier = async () => {
    return this.request
      .get("/api/global/license/offline/identifier")
      .set(this.config.defaultHeaders())
  }
}
