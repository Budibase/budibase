<script>
  import { store } from "../builderStore"
  import { map, join } from "lodash/fp"
  import { pipe } from "../common/core"
  import { buildPropsHierarchy } from "./pagesParsing/buildPropsHierarchy"

  let iframe

  $: iframe &&
    console.log(
      iframe.contentDocument.head.insertAdjacentHTML(
        "beforeend",
        '<style ✂prettier:content✂=""></style>'
      )
    )
  $: hasComponent = !!$store.currentFrontEndItem
  $: styles = hasComponent ? $store.currentFrontEndItem._css : ""

  $: stylesheetLinks = pipe($store.pages.stylesheets, [
    map(s => `<link rel="stylesheet" href="${s}"/>`),
    join("\n"),
  ])

  $: appDefinition = {
    componentLibraries: $store.loadLibraryUrls(),
    props: buildPropsHierarchy(
      $store.components,
      $store.screens,
      $store.currentFrontEndItem
    ),
    hierarchy: $store.hierarchy,
    appRootPath: "",
  }
</script>

<div class="component-container">
  {#if hasComponent}
    <iframe
      style="height: 100%; width: 100%"
      title="componentPreview"
      bind:this={iframe}
      srcdoc={`<html>

<head>
    ${stylesheetLinks}
    <script ✂prettier:content✂="CiAgICAgICAgd2luZG93WyIjI0JVRElCQVNFX0FQUERFRklOSVRJT04jIyJdID0gJHtKU09OLnN0cmluZ2lmeShhcHBEZWZpbml0aW9uKX07CiAgICAgICAgd2luZG93WyIjI0JVRElCQVNFX1VJRlVOQ1RJT05TIl0gPSAkeyRzdG9yZS5jdXJyZW50U2NyZWVuRnVuY3Rpb25zfTsKICAgICAgICAKICAgICAgICBpbXBvcnQoJy9fYnVpbGRlci9idWRpYmFzZS1jbGllbnQuZXNtLm1qcycpCiAgICAgICAgLnRoZW4obW9kdWxlID0+IHsKICAgICAgICAgICAgbW9kdWxlLmxvYWRCdWRpYmFzZSh7IHdpbmRvdywgbG9jYWxTdG9yYWdlIH0pOwogICAgICAgIH0pCiAgICA=">{}</script>    <style ✂prettier:content✂="CgogICAgICAgIGJvZHkgewogICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OwogICAgICAgICAgICBwYWRkaW5nOiAyMHB4OwogICAgICAgIH0KICAgICR7c3R5bGVzfQogICAg"></style></head>
<body>
</body>
</html>`} />
  {/if}
</div>

<style>
  .component-container {
    grid-row-start: middle;
    grid-column-start: middle;
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;
    margin: auto;
  }

  .component-container iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
