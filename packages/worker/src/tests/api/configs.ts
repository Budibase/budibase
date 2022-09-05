import TestConfiguration from "../TestConfiguration"

export class ConfigAPI {
  config: TestConfiguration
  request: any

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }

  getConfigChecklist = () => {
    return this.request
      .get(`/api/global/configs/checklist`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  saveConfig = (data: any) => {
    return this.request
      .post(`/api/global/configs`)
      .send(data)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  OIDCCallback = (configId: string) => {
    return this.request
      .get(`/api/global/auth/${this.config.getTenantId()}/oidc/callback`)
      .set(this.config.getOIDConfigCookie(configId))
  }

  getOIDCConfig = (configId: string) => {
    return this.request.get(
      `/api/global/auth/${this.config.getTenantId()}/oidc/configs/${configId}`
    )
  }
}
