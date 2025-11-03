<script>
  import { Helpers } from "@budibase/bbui"

  export let size
  export let svgHtml

  function substituteSize(svg) {
    if (svg.includes("height=")) {
      svg = svg.replace(/height="[^"]+"/, `height="${size}"`)
    }
    if (svg.includes("width=")) {
      svg = svg.replace(/width="[^"]+"/, `width="${size}"`)
    }
    if (svg.includes("id=")) {
      const escapeRegExp = value =>
        value.replace(/([\\^$.*+?()[\]{}|-])/g, "\\$1")
      const idRegex = /id=(["'])([^"']+)\1/g
      const replacements = new Map()

      for (let [, , originalId] of svg.matchAll(idRegex)) {
        if (!replacements.has(originalId)) {
          replacements.set(originalId, Helpers.uuid())
        }
      }

      const rewriteReferences = (fromId, toId) => {
        const escapedId = escapeRegExp(fromId)
        const patterns = [
          {
            regex: new RegExp(`(id=)(["'])${escapedId}\\2`, "g"),
            replace: (_match, attribute, quote) =>
              `${attribute}${quote}${toId}${quote}`,
          },
          {
            regex: new RegExp(`((?:xlink:)?href=)(["'])#${escapedId}\\2`, "g"),
            replace: (_match, attribute, quote) =>
              `${attribute}${quote}#${toId}${quote}`,
          },
          {
            regex: new RegExp(`(url\\()(["']?)#${escapedId}\\2\\)`, "g"),
            replace: (_match, prefix, quote) =>
              `${prefix}${quote}#${toId}${quote})`,
          },
        ]

        for (let { regex, replace } of patterns) {
          svg = svg.replace(regex, replace)
        }
      }

      for (let [originalId, newId] of replacements) {
        rewriteReferences(originalId, newId)
      }
    }
    return svg
  }
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags-->
{@html substituteSize(svgHtml)}
