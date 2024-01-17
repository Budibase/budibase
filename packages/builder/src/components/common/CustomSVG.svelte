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
      const matches = svg.match(/id="([^"]+)"/g)
      for (let match of matches) {
        svg = svg.replace(new RegExp(match, "g"), Helpers.uuid())
      }
    }
    return svg
  }
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags-->
{@html substituteSize(svgHtml)}
