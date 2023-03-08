import TestConfiguration from "../TestConfiguration"
import { TestAPI, TestAPIOpts } from "./base"

export class TemplatesAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

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
}
