import { flow } from "lodash/fp";

export const pipe = (arg, funcs) => flow(funcs)(arg)
