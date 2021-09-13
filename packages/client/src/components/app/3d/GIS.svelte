<script>
  import { onMount, getContext, onDestroy } from "svelte"
  import { i18n } from "./cesium/i18n.js"
  import { Select } from "@budibase/bbui"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let modelUris
  export let language
  export let cesiumPath
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
  export let compass
  export let distanceLegend
  export let selectModel
  export let preSelectFeature
  export let firstPerson

  const distances = [
    1, 2, 3, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000, 5000,
    10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000,
    2000000, 3000000, 5000000, 10000000, 20000000, 30000000, 50000000,
  ]
  let el
  let viewer
  let currTilesetValue
  let tilesets
  let cesiumCss
  let cesiumJs
  let cesiumNavigationJs
  let preSelectedFeature
  let selectedFeature
  let loadCesiumAsserts = () =>
    new Promise((resolve, reject) => {
      const cssUrl = `${cesiumPath}/Widgets/widgets.css`
      const jsUrl = `${cesiumPath}/Cesium.js`
      cesiumCss = document.createElement("link")
      cesiumCss.type = "text/css"
      cesiumCss.rel = "stylesheet"
      cesiumCss.href = cssUrl
      cesiumCss.onload = () => {
        cesiumJs = document.createElement("script")
        cesiumJs.setAttribute("type", "text/javascript")
        cesiumJs.setAttribute("src", jsUrl)
        cesiumJs.onload = () => {
          if (compass || distanceLegend) {
            const cesiumNavigationJsUrl = `http://localhost:10000/global/cdn/cesium/viewerCesiumNavigationMixin.min.js`
            cesiumNavigationJs = document.createElement("script")
            cesiumNavigationJs.setAttribute("type", "text/javascript")
            cesiumNavigationJs.setAttribute("src", cesiumNavigationJsUrl)
            cesiumNavigationJs.onload = () => {
              resolve()
            }
            cesiumNavigationJs.onerror = reject
            document.head.appendChild(cesiumNavigationJs)
          } else {
            resolve()
          }
        }
        cesiumJs.onerror = reject
        document.head.appendChild(cesiumJs)
      }
      cesiumCss.onerror = reject
      document.head.appendChild(cesiumCss)
    })
  let unloadCesiumAsserts = () => {
    if (viewer && viewer.destroy) {
      viewer.entities.removeAll()
      if (viewer.cesiumNavigation) {
        viewer.cesiumNavigation.destroy()
      }
      viewer.destroy()
    }
    if (!$builderStore.inBuilder) {
      if (window.Cesium) {
        delete window.Cesium
      }
      if (cesiumJs) {
        document.head.removeChild(cesiumJs)
      }
      if (cesiumCss) {
        document.head.removeChild(cesiumCss)
      }
      if (cesiumNavigationJs) {
        document.head.removeChild(cesiumNavigationJs)
      }
    }
  }
  let initSelectedFeature = () => {
    const Cesium = window.Cesium
    let selectFeature = feature => {
      feature.color = Cesium.Color.clone(
        Cesium.Color.fromBytes(146, 187, 255),
        feature.color
      )
      selectedFeature = feature
    }

    let unselectFeature = feature => {
      if (!Cesium.defined(feature)) {
        return
      }
      feature.color = Cesium.Color.clone(Cesium.Color.WHITE, feature.color)
      if (feature === selectedFeature) {
        selectedFeature = undefined
      }
    }

    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(movement => {
      var feature = viewer.scene.pick(movement.position)
      unselectFeature(selectedFeature)
      if (feature instanceof Cesium.Cesium3DTileFeature) {
        selectFeature(feature)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  let initPreSelectedFeature = () => {
    const Cesium = window.Cesium
    let preSelectFeature = feature => {
      feature.color = Cesium.Color.clone(
        Cesium.Color.fromBytes(146, 187, 255),
        feature.color
      )
      preSelectedFeature = feature
    }

    let unpreSelectFeature = feature => {
      if (!Cesium.defined(feature)) {
        return
      }
      if (preSelectedFeature !== selectedFeature) {
        feature.color = Cesium.Color.clone(Cesium.Color.WHITE, feature.color)
      }
      if (feature === preSelectedFeature) {
        preSelectedFeature = undefined
      }
    }

    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(movement => {
      var feature = viewer.scene.pick(movement.endPosition)
      unpreSelectFeature(preSelectedFeature)
      if (feature instanceof Cesium.Cesium3DTileFeature) {
        preSelectFeature(feature)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  let initModelUris = () => {
    const Cesium = window.Cesium
    tilesets = modelUris.map(uri => {
      return {
        ...uri,
        $: viewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: /^[0-9]+$/.test(uri.value)
              ? Cesium.IonResource.fromAssetId(uri.value)
              : uri.value,
          })
        ),
      }
    })

    currTilesetValue = tilesets[0].label

    tilesets[0].$.readyPromise
      .then(tileset => {
        viewer.flyTo(tileset, { duration: 2.0 })
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
          e => {
            e.cancel = true
            viewer.flyTo(tileset, { duration: 2.0 })
          }
        )
      })
      .otherwise(console.log)
  }
  let initFirstPerson = () => {
    let toolbar = el.querySelector("div.cesium-viewer-toolbar")
    let modeButton = el.querySelector("span.cesium-sceneModePicker-wrapper")
    let firstPersonButton = document.createElement("button")
    firstPersonButton.classList.add("cesium-button", "cesium-toolbar-button")
    firstPersonButton.innerHTML = "F"
    toolbar.insertBefore(firstPersonButton, modeButton)
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
      fullscreenElement: el,
      selectionIndicator,
      timeline,
      animation,
      infoBox,
    })

    if (compass || distanceLegend) {
      viewer.extend(Cesium.viewerCesiumNavigationMixin, {
        enableCompass: compass,
        enableZoomControls: compass,
        enableDistanceLegend: distanceLegend,
        enableCompassOuterRing: true,
      })
    }

    i18n.load(el, language)
    viewer._cesiumWidget._creditContainer.style.display = "none"
    viewer.scene.globe.depthTestAgainstTerrain = true

    if (firstPerson) {
      initFirstPerson()
    }

    if (preSelectFeature) {
      initPreSelectedFeature()
    }

    initSelectedFeature()

    if (modelUris) {
      initModelUris()
    }
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

<div class="gis-container" use:styleable={$component.styles}>
  <div class="cesium-container" bind:this={el} />
  {#if selectModel && currTilesetValue}
    <div class="select-model-container">
      <div style="width: 100%;">
        <Select
          bind:value={currTilesetValue}
          autoWidth
          on:change={({ detail }) => {
            let filter = tilesets.filter(t => t.label === detail)
            if (filter && filter.length > 0) {
              viewer.flyTo(filter[0].$, {
                duration: 2.0,
              })
            }
          }}
          placeholder={null}
          options={(tilesets && tilesets.map(t => t.label)) || []}
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .gis-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .cesium-container {
    width: 100%;
    height: 100%;
  }
  .select-model-container {
    position: absolute;
    z-index: 1001;
    max-width: 200px;
    left: 7px;
    top: 5px;
    width: 100px;
    height: 30px;
    display: flex;
    align-items: normal;
    background: transparent;
    justify-items: start;
  }
</style>
