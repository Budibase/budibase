<script>
  import L from "leaflet"
  import sanitizeHtml from "sanitize-html"
  import "leaflet/dist/leaflet.css"
  import { Helpers, Button } from "@budibase/bbui"
  import { onMount, getContext } from "svelte"
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
  export let creationEnabled = false
  export let onClickMarker
  export let onCreateMarker

  const { styleable, notificationStore } = getContext("sdk")
  const component = getContext("component")
  const embeddedMapId = `${Helpers.uuid()}-wrapper`

  // Map Button Controls
  const locationControl = new LocationControl({
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
  const fullScreenControl = new FullScreenControl({
    position: "topright",
  })
  const zoomControl = L.control.zoom({
    position: "bottomright",
  })

  // Map and marker configuration
  const defaultMarkerOptions = {
    html:
      '<div><svg width="26px" height="26px" class="spectrum-Icon" focusable="false" stroke="#b12b27" stroke-width="1%">' +
      '<use xlink:href="#spectrum-icon-18-Location" /></svg></div>',
    className: "embedded-map-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -13],
  }
  const mapMarkerOptions = {
    icon: L.divIcon(defaultMarkerOptions),
    draggable: false,
    alt: "Location Marker",
  }
  const candidateMarkerOptions = {
    icon: L.divIcon({
      ...defaultMarkerOptions,
      className: "embedded-map-marker--candidate",
    }),
    draggable: false,
    alt: "Location Marker",
  }
  const mapOptions = {
    fullScreen: false,
    zoomControl: false,
    scrollWheelZoom: zoomEnabled,
    minZoomLevel,
    maxZoomLevel,
  }
  const fallbackCoordinates = [51.5072, -0.1276] //London

  let mapInstance
  let mapMarkerGroup = new L.FeatureGroup()
  let candidateMarkerGroup = new L.FeatureGroup()
  let candidateMarkerPosition
  let mounted = false
  let initialMarkerZoomCompleted = false
  let minZoomLevel = 0
  let maxZoomLevel = 18
  let cachedDeviceCoordinates

  $: validRows = getValidRows(dataProvider?.rows, latitudeKey, longitudeKey)
  $: safeZoomLevel = parseZoomLevel(zoomLevel)
  $: defaultCoordinates = parseDefaultLocation(defaultLocation)
  $: initMap(tileURL, mapAttribution, safeZoomLevel)
  $: zoomControlUpdated(mapInstance, zoomEnabled)
  $: locationControlUpdated(mapInstance, locationEnabled)
  $: fullScreenControlUpdated(mapInstance, fullScreenEnabled)
  $: width = $component.styles.normal.width
  $: height = $component.styles.normal.height
  $: width, height, mapInstance?.invalidateSize()
  $: defaultCoordinates, resetView()
  $: addMapMarkers(
    mapInstance,
    validRows,
    latitudeKey,
    longitudeKey,
    titleKey,
    onClickMarker
  )

  const isValidLatitude = value => {
    return !isNaN(value) && value > -90 && value < 90
  }

  const isValidLongitude = value => {
    return !isNaN(value) && value > -180 && value < 180
  }

  const getValidRows = (rows, latKey, lngKey) => {
    if (!rows?.length || !latKey || !lngKey) {
      return []
    }
    return rows.filter(row => {
      return isValidLatitude(row[latKey]) && isValidLongitude(row[lngKey])
    })
  }

  const parseZoomLevel = zoomLevel => {
    let zoom = zoomLevel
    if (zoom == null || isNaN(zoom)) {
      zoom = 50
    } else {
      zoom = parseFloat(zoom)
      zoom = Math.max(0, Math.min(100, zoom))
    }
    return Math.round((zoom * maxZoomLevel) / 100)
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

  const resetView = () => {
    if (!mapInstance) {
      return
    }
    if (mapMarkerGroup.getLayers().length) {
      mapInstance.setZoom(0)
      mapInstance.fitBounds(mapMarkerGroup.getBounds(), {
        paddingTopLeft: [0, 24],
      })
    } else {
      mapInstance.setView(defaultCoordinates, safeZoomLevel)
    }
  }

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

  const addMapMarkers = (
    mapInstance,
    validRows,
    latKey,
    lngKey,
    titleKey,
    onClick
  ) => {
    if (!mapInstance) {
      return
    }

    mapMarkerGroup.clearLayers()
    if (!validRows?.length) {
      return
    }

    validRows.forEach(row => {
      let markerCoords = [row[latKey], row[lngKey]]
      let marker = L.marker(markerCoords, mapMarkerOptions).addTo(mapInstance)
      let markerContent = generateMarkerPopupContent(
        row[latKey],
        row[lngKey],
        row[titleKey]
      )

      marker
        .bindTooltip(markerContent, {
          direction: "top",
          offset: [0, -25],
        })
        .addTo(mapMarkerGroup)

      if (onClick) {
        marker.on("click", () => {
          onClick({
            marker: row,
          })
        })
      }
    })

    // Zoom to markers if this is the first time
    if (!initialMarkerZoomCompleted) {
      resetView()
      initialMarkerZoomCompleted = true
    }
  }

  const generateMarkerPopupContent = (latitude, longitude, text) => {
    return text || latitude + "," + longitude
  }

  const initMap = (tileURL, attribution, zoom) => {
    if (!mounted) {
      return
    }
    if (mapInstance) {
      mapInstance.remove()
    }

    try {
      mapInstance = L.map(embeddedMapId, mapOptions)
      mapMarkerGroup.addTo(mapInstance)
      candidateMarkerGroup.addTo(mapInstance)

      // Add attribution
      const cleanAttribution = sanitizeHtml(attribution, {
        allowedTags: ["a"],
        allowedAttributes: {
          a: ["href", "target"],
        },
      })
      L.tileLayer(tileURL, {
        attribution: "&copy; " + cleanAttribution,
        zoom,
      }).addTo(mapInstance)

      // Add click handler
      mapInstance.on("click", handleMapClick)

      // Reset view
      resetView()
    } catch (e) {
      console.log("There was a problem with the map", e)
    }
  }

  const handleMapClick = e => {
    if (!creationEnabled) {
      return
    }
    candidateMarkerGroup.clearLayers()
    candidateMarkerPosition = [e.latlng.lat, e.latlng.lng]
    let candidateMarker = L.marker(
      candidateMarkerPosition,
      candidateMarkerOptions
    )
    candidateMarker
      .bindTooltip("New marker", {
        permanent: true,
        direction: "top",
        offset: [0, -25],
      })
      .addTo(candidateMarkerGroup)
      .on("click", clearCandidateMarker)
  }

  const createMarker = async () => {
    if (!onCreateMarker) {
      return
    }
    const res = await onCreateMarker({
      lat: candidateMarkerPosition[0],
      lng: candidateMarkerPosition[1],
    })
    if (res !== false) {
      clearCandidateMarker()
    }
  }

  const clearCandidateMarker = () => {
    candidateMarkerGroup.clearLayers()
    candidateMarkerPosition = null
  }

  onMount(() => {
    mounted = true
    initMap(tileURL, mapAttribution, safeZoomLevel)
  })
</script>

<div class="embedded-map-wrapper map-default" use:styleable={$component.styles}>
  {#if error}
    <div>{error}</div>
  {/if}

  <div id={embeddedMapId} class="embedded embedded-map" />

  {#if candidateMarkerPosition}
    <div class="button-container">
      <Button secondary quiet on:click={clearCandidateMarker}>Cancel</Button>
      <Button cta on:click={createMarker}>Create marker</Button>
    </div>
  {/if}
</div>

<style>
  .embedded-map-wrapper {
    background-color: #f1f1f1;
    height: 320px;
  }
  .map-default {
    min-height: 180px;
    min-width: 200px;
  }
  .embedded-map :global(a.map-svg-button) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .embedded-map :global(.leaflet-top),
  .embedded-map :global(.leaflet-bottom) {
    z-index: 998;
  }
  .embedded-map :global(.embedded-map-marker) {
    color: #ee3b35;
  }
  .embedded-map :global(.embedded-map-marker--candidate) {
    color: var(--primaryColor);
  }
  .embedded-map :global(.embedded-map-control) {
    font-size: 22px;
  }
  .embedded-map {
    height: 100%;
    width: 100%;
  }
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }
</style>
