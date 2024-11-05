import { DATASOURCE_TEST_FILES } from "."

export default (paths: string[]) => {
  return {
    filtered: paths
      .filter(path => !DATASOURCE_TEST_FILES.includes(path))
      .map(path => ({ test: path })),
  }
}
