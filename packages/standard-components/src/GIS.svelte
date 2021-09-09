<script>
  import { onMount, getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let url

  let el
  let viewer
  let loadCesiumAsserts = () =>
    new Promise((resolve, reject) => {
      const cssUrl =
        "https://cdn.bootcdn.net/ajax/libs/cesium/1.83.0/Widgets/widgets.css"
      const jsUrl = "https://cdn.bootcdn.net/ajax/libs/cesium/1.83.0/Cesium.js"
      let link = document.createElement("link")
      link.type = "text/css"
      link.rel = "stylesheet"
      link.href = cssUrl
      link.onload = () => {
        let script = document.createElement("script")
        script.setAttribute("type", "text/javascript")
        script.setAttribute("src", jsUrl)
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      }
      link.onerror = reject
      document.head.appendChild(link)
    })
  let initViewer = () => {
    viewer = new window.Cesium.Viewer(el, {
      terrainProvider: window.Cesium.createWorldTerrain(),
    })
    console.log("sadkll")
  }

  onMount(() => {
    if (el) {
      if (!window.Cesium) {
        loadCesiumAsserts().then(initViewer).catch(console.log)
      } else {
        initViewer()
      }
    }
  })
</script>

{#if url}
  <div class="gis-container" bind:this={el} />
{:else if $builderStore.inBuilder}
  <div
    class="placeholder"
    use:styleable={{ ...$component.styles, empty: true }}
  >
    <Placeholder />
  </div>
{/if}

<style>
  .placeholder {
    display: grid;
    place-items: center;
  }
</style>
