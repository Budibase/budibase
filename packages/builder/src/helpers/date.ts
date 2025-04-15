import { processStringSync } from "@budibase/string-templates"

export function durationFromNow(isoDate: string) {
  return processStringSync("{{ durationFromNow time 'millisecond' }} ago", {
    time: isoDate,
  })
}
