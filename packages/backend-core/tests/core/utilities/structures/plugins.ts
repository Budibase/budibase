import { generator } from "."
import type { Plugin } from "@budibase/types"
import { PluginSource, PluginType } from "@budibase/types"

export function plugin(): Plugin {
  return {
    description: generator.word(),
    name: generator.word(),
    version: "1.0.0",
    source: PluginSource.FILE,
    package: {
      name: generator.word,
    },
    hash: generator.hash(),
    schema: {
      type: PluginType.DATASOURCE,
    },
    iconFileName: "icon.svg",
  }
}
