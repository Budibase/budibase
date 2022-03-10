<script>
  import L from "leaflet"
  import "leaflet/dist/leaflet.css"
  import { Helpers } from "@budibase/bbui"
  import { getContext } from "svelte"
  import {
    FullScreenControl,
    LocationControl,
    initMapControls,
  } from "./EmbeddedMapControls"

  initMapControls()

  export let dataProvider
  export let error
  export let zoomLevel
  export let zoomEnabled = true
  export let latitudeKey = null
  export let longitudeKey = null
  export let titleKey = null
  export let fullScreenEnabled = true
  export let locationEnabled = true
  export let defaultLocation
  export let tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  export let mapAttribution

  const { styleable, notificationStore } = getContext("sdk")
  const component = getContext("component")
  const embeddedMapId = `${Helpers.uuid()}-wrapper`

  let cachedDeviceCoordinates
  const fallbackCoordinates = [51.5072, -0.1276] //London

  let mapInstance
  let mapMarkerGroup = new L.FeatureGroup()
  let mapMarkers = []

  let minZoomLevel = 0
  let maxZoomLevel = 18
  let adjustedZoomLevel = !Number.isInteger(zoomLevel)
    ? 72
    : Math.round(zoomLevel * (maxZoomLevel / 100))

  $: zoomControlUpdated(mapInstance, zoomEnabled)
  $: locationControlUpdated(mapInstance, locationEnabled)
  $: fullScreenControlUpdated(mapInstance, fullScreenEnabled)
  $: updateMapDimensions(
    mapInstance,
    $component.styles.normal.width,
    $component.styles.normal.height
  )
  $: addMapMarkers(
    mapInstance,
    dataProvider?.rows,
    latitudeKey,
    longitudeKey,
    titleKey
  )
  $: if (typeof mapInstance === "object" && mapMarkers.length > 0) {
    mapInstance.setZoom(0)
    mapInstance.fitBounds(mapMarkerGroup.getBounds(), {
      paddingTopLeft: [0, 24],
    })
  }

  const updateMapDimensions = mapInstance => {
    if (typeof mapInstance !== "object") {
      return
    }
    mapInstance.invalidateSize()
  }

  let isValidLatitude = value => {
    return !isNaN(value) && value > -90 && value < 90
  }

  let isValidLongitude = value => {
    return !isNaN(value) && value > -180 && value < 180
  }

  const parseDefaultLocation = defaultLocation => {
    if (typeof defaultLocation !== "string") {
      return fallbackCoordinates
    }
    let defaultLocationParts = defaultLocation.split(",")
    if (defaultLocationParts.length !== 2) {
      return fallbackCoordinates
    }

    let parsedDefaultLatitude = parseFloat(defaultLocationParts[0].trim())
    let parsedDefaultLongitude = parseFloat(defaultLocationParts[1].trim())

    return isValidLatitude(parsedDefaultLatitude) === true &&
      isValidLongitude(parsedDefaultLongitude) === true
      ? [parsedDefaultLatitude, parsedDefaultLongitude]
      : fallbackCoordinates
  }

  $: defaultCoordinates =
    mapMarkers.length > 0
      ? parseDefaultLocation(defaultLocation)
      : fallbackCoordinates

  // Map Button Controls
  let locationControl = new LocationControl({
    position: "bottomright",
    onLocationFail: err => {
      if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
        notificationStore.actions.error(
          "Location requests not permitted. Ensure location is enabled"
        )
      } else if (err.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
        notificationStore.actions.warning(
          "Location could not be retrieved. Try again"
        )
      } else if (err.code === GeolocationPositionError.TIMEOUT) {
        notificationStore.actions.warning(
          "Location request timed out. Try again"
        )
      } else {
        notificationStore.actions.error("Unknown location error")
      }
    },
    onLocationSuccess: pos => {
      cachedDeviceCoordinates = pos
      if (typeof mapInstance === "object") {
        mapInstance.setView(cachedDeviceCoordinates, 15)
      }
    },
  })
  let fullScreenControl = new FullScreenControl({
    position: "topright",
  })
  let zoomControl = L.control.zoom({
    position: "bottomright",
  })

  const locationControlUpdated = (mapInstance, locationEnabled) => {
    if (typeof mapInstance !== "object") {
      return
    }
    if (locationEnabled) {
      locationControl.addTo(mapInstance)
    } else {
      mapInstance.removeControl(locationControl)
    }
  }

  const fullScreenControlUpdated = (mapInstance, fullScreenEnabled) => {
    if (typeof mapInstance !== "object") {
      return
    }
    if (fullScreenEnabled) {
      fullScreenControl.addTo(mapInstance)
    } else {
      mapInstance.removeControl(fullScreenControl)
    }
  }

  const zoomControlUpdated = (mapInstance, zoomEnabled) => {
    if (typeof mapInstance !== "object") {
      return
    }
    if (zoomEnabled) {
      zoomControl.addTo(mapInstance)
      mapInstance.scrollWheelZoom.enable()
    } else {
      mapInstance.removeControl(zoomControl)
      mapInstance.scrollWheelZoom.disable()
    }
  }

  //Map icon and marker configuration
  const mapIconMarkup =
    '<div><svg width="26px" height="26px" class="spectrum-Icon" focusable="false" stroke="#b12b27" stroke-width="1%">' +
    '<use xlink:href="#spectrum-icon-18-Location" /></svg></div>'
  const mapIcon = L.divIcon({
    html: mapIconMarkup,
    className: "embedded-map-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -13],
  })
  const mapMarkerOptions = {
    icon: mapIcon,
    draggable: false,
    alt: "Location Marker",
  }
  let mapOptions = {
    fullScreen: false,
    zoomControl: false,
    scrollWheelZoom: zoomEnabled,
    minZoomLevel,
    maxZoomLevel,
  }

  const addMapMarkers = (mapInstance, rows, latKey, lngKey, titleKey) => {
    if (typeof mapInstance !== "object" || !rows || !latKey || !lngKey) {
      return
    }

    mapMarkerGroup.clearLayers()

    const validRows = rows.filter(row => {
      return isValidLatitude(row[latKey]) && isValidLongitude(row[lngKey])
    })

    validRows.forEach(row => {
      let markerCoords = [row[latKey], row[lngKey]]

      let marker = L.marker(markerCoords, mapMarkerOptions).addTo(mapInstance)
      let markerContent = generateMarkerPopupContent(
        row[latKey],
        row[lngKey],
        row[titleKey]
      )

      marker.bindPopup(markerContent).addTo(mapMarkerGroup)

      //https://github.com/Leaflet/Leaflet/issues/7331
      marker.on("click", function () {
        this.openPopup()
      })

      mapMarkers = [...mapMarkers, marker]
    })
  }

  const generateMarkerPopupContent = (latitude, longitude, text) => {
    return text || latitude + "," + longitude
  }

  const initMap = () => {
    const initCoords = defaultCoordinates

    mapInstance = L.map(embeddedMapId, mapOptions)
    mapMarkerGroup.addTo(mapInstance)

    L.tileLayer(tileURL, {
      attribution: "&copy; " + mapAttribution, //No attribution, warning?
      zoom: adjustedZoomLevel,
    }).addTo(mapInstance)

    //Initialise the map
    mapInstance.setView(initCoords, adjustedZoomLevel)
  }

  const mapAction = () => {
    initMap()
    return {
      destroy() {
        mapInstance.remove()
        mapInstance = undefined
      },
    }
  }
</script>

<div class="embedded-map-wrapper map-default" use:styleable={$component.styles}>
  {#if error}
    <div>{error}</div>
  {/if}

  <div id={embeddedMapId} class="embedded embedded-map" use:mapAction />
</div>

<style>
  .embedded-map-wrapper {
    background-color: #f1f1f1;
  }
  .map-default {
    min-height: 180px;
    min-width: 200px;
  }
  .embedded-map :global(.leaflet-top),
  .embedded-map :global(.leaflet-bottom) {
    z-index: 998;
  }
  .embedded-map :global(.embedded-map-marker) {
    color: #ee3b35;
  }
  .embedded-map :global(.embedded-map-control) {
    font-size: 22px;
  }
  .embedded-map {
    height: 100%;
    width: 100%;
  }
</style>
