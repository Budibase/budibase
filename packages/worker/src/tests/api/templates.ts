import { TestAPI, TestAPIOpts } from "./base"

export class TemplatesAPI extends TestAPI {
  definitions = (opts?: TestAPIOpts) => {
    return this.request
      .get(`/api/global/template/definitions`)
      .set(opts?.headers ? opts.headers : this.config.defaultHeaders())
      .expect(opts?.status ? opts.status : 200)
  }

  getTemplate = (opts?: TestAPIOpts) => {
    return this.request
      .get(`/api/global/template`)
      .set(opts?.headers ? opts.headers : this.config.defaultHeaders())
      .expect(opts?.status ? opts.status : 200)
  }

  saveTemplate = (data: any, opts?: TestAPIOpts) => {
    return this.request
      .post(`/api/global/template`)
      .send(data)
      .set(opts?.headers ? opts.headers : this.config.defaultHeaders())
      .expect(opts?.status ? opts.status : 200)
  }

  exportTemplates = (
    req?: { type?: string; data?: any },
    opts?: TestAPIOpts
  ) => {
    const { type = "email", data } = req || {}
    return this.request
      .post(`/api/global/template/${type}/export`)
      .send(data)
      .set(opts?.headers ? opts.headers : this.config.defaultHeaders())
      .expect(opts?.status ? opts.status : 200)
  }
}
