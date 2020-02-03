import { eventsList } from "@budibase/core"
import { filter, union, has, map } from "lodash/fp"
import records from "./records"

const allEventsOfType = type => filter(e => e.endsWith(`:${type}`))(eventsList)

const getEventNamespace = ev => {
  const parts = ev.split(":")
  return `${parts[0]}:${parts[1]}`
}

const hasRecord = has("record")

export const register = (app, logTimeElapsed, eventNamespaces = []) => {
  const onCompleteEvents =
    eventNamespaces.length === 0
      ? allEventsOfType("onComplete")
      : map(e => `${e}:onComplete`)(eventNamespaces)

  const onErrorEvents =
    eventNamespaces.length === 0
      ? allEventsOfType("onError")
      : map(e => `${e}:onError`)(eventNamespaces)

  for (let ev of union(onCompleteEvents)(onErrorEvents)) {
    app.subscribe(ev, (_, ctx) => {
      const info = hasRecord(ctx) ? ctx.record.type() : ""

      logTimeElapsed(ev, ctx.elapsed, info)
    })
  }
}
