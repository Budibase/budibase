import storage from "../localStorage"

const localStorage = (ctx: any, next: any) => {
  return storage.run({ ctx }, next)
}

export default localStorage
