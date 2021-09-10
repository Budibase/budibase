<script>
  import { onMount, getContext, onDestroy } from "svelte"
  import Placeholder from "../Placeholder.svelte"
  import { i18n } from "./cesium/i18n.js"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let modelUris
  export let language
  export let cesiumToken
  export let geocoder
  export let homeButton
  export let baseLayerPicker
  export let sceneModePicker
  export let navigationHelpButton
  export let fullscreenButton
  export let selectionIndicator
  export let timeline
  export let animation
  export let infoBox

  let el
  let viewer
  let tilesets
  let cesiumCss
  let cesiumJs
  let loadCesiumAsserts = () =>
    new Promise((resolve, reject) => {
      const cssUrl =
        "https://cdn.bootcdn.net/ajax/libs/cesium/1.83.0/Widgets/widgets.css"
      const jsUrl = "https://cdn.bootcdn.net/ajax/libs/cesium/1.83.0/Cesium.js"
      cesiumCss = document.createElement("link")
      cesiumCss.type = "text/css"
      cesiumCss.rel = "stylesheet"
      cesiumCss.href = cssUrl
      cesiumCss.onload = () => {
        cesiumJs = document.createElement("script")
        cesiumJs.setAttribute("type", "text/javascript")
        cesiumJs.setAttribute("src", jsUrl)
        cesiumJs.onload = resolve
        cesiumJs.onerror = reject
        document.head.appendChild(cesiumJs)
      }
      cesiumCss.onerror = reject
      document.head.appendChild(cesiumCss)
    })
  let unloadCesiumAsserts = () => {
    if (viewer && viewer.destroy) {
      viewer.entities.removeAll()
      viewer.destroy()
    }
    if (cesiumJs) {
      document.head.removeChild(cesiumJs)
    }
    if (cesiumCss) {
      document.head.removeChild(cesiumCss)
    }
  }
  let initViewer = () => {
    const Cesium = window.Cesium

    Cesium.Ion.defaultAccessToken = cesiumToken

    viewer = new Cesium.Viewer(el, {
      geocoder,
      homeButton,
      baseLayerPicker,
      sceneModePicker,
      navigationHelpButton,
      fullscreenButton,
      selectionIndicator,
      timeline,
      animation,
      infoBox,
    })

    viewer._cesiumWidget._creditContainer.style.display = "none"
    viewer.scene.globe.depthTestAgainstTerrain = true

    i18n.load(el, language)

    tilesets = modelUris.map(uri =>
      viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({ url: uri.value })
      )
    )

    tilesets[0].readyPromise
      .then(tileset => {
        viewer.zoomTo(tileset)
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
          e => {
            e.cancel = true
            viewer.zoomTo(tileset)
          }
        )
      })
      .otherwise(console.log)
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
  onDestroy(unloadCesiumAsserts)
</script>

{#if modelUris}
  <div class="gis-container" bind:this={el} use:styleable={$component.styles} />
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
