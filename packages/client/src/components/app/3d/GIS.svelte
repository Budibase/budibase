<script>
  import { onMount, getContext, onDestroy } from "svelte"
  import { i18n } from "./cesium/i18n.js"
  import { Select } from "@budibase/bbui"

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
  export let scale
  export let selectModel
  export let preSelectFeature

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
  let distanceLabel
  let barWidth
  let selectedFeature
  let getOutOfRangeLabel = () =>
    language === "zh-hans" ? "超出测量范围" : "Out of range"
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
    }
  }
  let cesiumScale = () => {
    const Cesium = window.Cesium
    let geodesic = new Cesium.EllipsoidGeodesic()
    // Find the distance between two pixels at the bottom center of the screen.
    let scene = viewer.scene
    let width = scene.canvas.clientWidth
    let height = scene.canvas.clientHeight
    let left = scene.camera.getPickRay(
      new Cesium.Cartesian2((width / 2) | 0, height - 1)
    )
    let right = scene.camera.getPickRay(
      new Cesium.Cartesian2((1 + width / 2) | 0, height - 1)
    )
    let globe = scene.globe
    let leftPosition = globe.pick(left, scene)
    let rightPosition = globe.pick(right, scene)
    if (!Cesium.defined(leftPosition) || !Cesium.defined(rightPosition)) {
      barWidth = undefined
      distanceLabel = undefined
      return
    }
    let leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition)
    let rightCartographic =
      globe.ellipsoid.cartesianToCartographic(rightPosition)
    geodesic.setEndPoints(leftCartographic, rightCartographic)
    let pixelDistance = geodesic.surfaceDistance
    // Find the first distance that makes the scale bar less than 100 pixels.
    let maxBarWidth = 100
    let distance
    for (
      let i = distances.length - 1;
      !Cesium.defined(distance) && i >= 0;
      --i
    ) {
      if (distances[i] / pixelDistance < maxBarWidth) {
        distance = distances[i]
      }
    }
    if (Cesium.defined(distance)) {
      var label =
        distance >= 1000
          ? (distance / 1000).toString() + " km"
          : distance.toString() + " m"
      barWidth = (distance / pixelDistance) | 0
      distanceLabel = label
    } else {
      barWidth = undefined
      distanceLabel = undefined
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

    i18n.load(el, language)
    viewer._cesiumWidget._creditContainer.style.display = "none"
    viewer.scene.globe.depthTestAgainstTerrain = true

    if (scale) {
      viewer.scene.postRender.addEventListener(cesiumScale)
    }

    if (preSelectFeature) {
      let selectFeature = feature => {
        feature.color = Cesium.Color.clone(
          Cesium.Color.fromAlpha(feature.color, 0.6),
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
        var feature = viewer.scene.pick(movement.endPosition)
        unselectFeature(selectedFeature)
        if (feature instanceof Cesium.Cesium3DTileFeature) {
          selectFeature(feature)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    if (modelUris) {
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
  {#if scale}
    <div class="scale-container">
      <div class="scale-label">{distanceLabel || getOutOfRangeLabel()}</div>
      {#if barWidth}
        <div class="scale-bar" style="width: {barWidth}px" />
      {/if}
    </div>
  {/if}
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
  .scale-container {
    position: absolute;
    z-index: 1001;
    left: 0;
    bottom: 0;
    width: 100px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
  }
  .scale-label {
    font-size: 12px;
    color: #fff;
    text-align: center;
  }
  .scale-bar {
    position: relative;
    padding-top: 10px;
  }
  .scale-bar::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 10px;
    border: 1px solid #fff;
    border-top: none;
    left: 0;
    bottom: 0;
  }
</style>
