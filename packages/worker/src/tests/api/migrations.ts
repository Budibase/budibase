import { TestAPI, TestAPIOpts } from "./base"

export class MigrationAPI extends TestAPI {
  runMigrations = (opts?: TestAPIOpts) => {
    return this.request
      .post(`/api/system/migrations/run`)
      .set(opts?.headers ? opts.headers : this.config.internalAPIHeaders())
      .expect(opts?.status ? opts.status : 200)
  }

  getMigrationDefinitions = (opts?: TestAPIOpts) => {
    return this.request
      .get(`/api/system/migrations/definitions`)
      .set(opts?.headers ? opts.headers : this.config.internalAPIHeaders())
      .expect(opts?.status ? opts.status : 200)
  }
}
