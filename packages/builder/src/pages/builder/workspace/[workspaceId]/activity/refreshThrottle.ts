import { throttle } from "lodash"

export const createRefreshThrottle = (refresh: () => void) =>
  throttle(refresh, 1000, { leading: true, trailing: true })
