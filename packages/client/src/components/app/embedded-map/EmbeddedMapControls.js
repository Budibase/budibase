import L from "leaflet"
import screenfull from "screenfull"

const createButton = function (html, title, className, container, fn) {
  let link = L.DomUtil.create("a", className, container)
  link.innerHTML = html
  link.href = "#"
  link.title = title

  link.setAttribute("role", "button")
  link.setAttribute("aria-label", title)

  L.DomEvent.disableClickPropagation(link)
  L.DomEvent.on(link, "click", L.DomEvent.stop)
  L.DomEvent.on(link, "click", fn, this)
  L.DomEvent.on(link, "click", this._refocusOnMap, this)

  return link
}

// Full Screen Control

const FullScreenControl = L.Control.extend({
  options: {
    position: "topright",
    fullScreenContent:
      '<span class="embedded-map-control embedded-map-location-icon">' +
      '<svg width="16px" height="16px" class="spectrum-Icon" focusable="false">' +
      '<use xlink:href="#spectrum-icon-18-FullScreen" /></svg><span>',
    fullScreenTitle: "Enter Fullscreen",
  },
  onAdd: function () {
    let fullScreenClassName = "leaflet-control-fullscreen",
      container = L.DomUtil.create("div", fullScreenClassName + " leaflet-bar"),
      options = this.options

    this._fullScreenButton = this._createButton(
      options.fullScreenContent,
      options.fullScreenTitle,
      "map-fullscreen map-svg-button",
      container,
      this._fullScreen
    )

    return container
  },
  _fullScreen: function () {
    let map = this._map
    if (screenfull.isEnabled) {
      screenfull.toggle(map.getContainer())
    }
  },
  _createButton: createButton,
})

const initFullScreenControl = () => {
  L.Map.mergeOptions({
    fullScreen: false,
  })

  L.Map.addInitHook(function () {
    if (this.options.fullScreen) {
      this.fullScreenControl = new FullScreenControl()
      this.addControl(this.fullScreenControl)
    } else {
      this.fullScreenControl = null
    }
  })
}

// Location Control

const LocationControl = L.Control.extend({
  options: {
    position: "topright",
    locationContent:
      '<span class="embedded-map-control embedded-map-location-icon">' +
      '<svg width="16px" height="16px" class="spectrum-Icon" focusable="false">' +
      '<use xlink:href="#spectrum-icon-18-Campaign" /></svg><span>',
    locationTitle: "Show Your Location",
  },
  onAdd: function () {
    let locationClassName = "leaflet-control-location",
      container = L.DomUtil.create("div", locationClassName + " leaflet-bar"),
      options = this.options

    this._locationButton = this._createButton(
      options.locationContent,
      options.locationTitle,
      "map-location map-svg-button",
      container,
      this._location
    )

    this._updateDisabled()

    return container
  },
  disable: function () {
    this._disabled = true
    this._updateDisabled()
    return this
  },
  enable: function () {
    this._disabled = false
    this._updateDisabled()
    return this
  },
  _location: function () {
    if (this._disabled == true) {
      return
    }
    this.disable()

    const success = pos => {
      this._map.closePopup()
      if (typeof this.options.onLocationSuccess === "function") {
        this.options.onLocationSuccess({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      }
    }

    const error = err => {
      if (typeof this.options.onLocationFail === "function") {
        this.options.onLocationFail(err)
      }
    }

    this._getPosition()
      .then(success)
      .catch(error)
      .finally(() => {
        this.enable()
      })
  },
  _getPosition: function () {
    let options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 30000,
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  },

  _createButton: createButton,

  _updateDisabled: function () {
    let disabledClassName = "leaflet-disabled"
    L.DomUtil.removeClass(this._locationButton, disabledClassName)
    this._locationButton.setAttribute("aria-disabled", "false")

    if (this._disabled) {
      L.DomUtil.addClass(this._locationButton, disabledClassName)
      this._locationButton.setAttribute("aria-disabled", "true")
    }
  },
})

const initLocationControl = () => {
  L.Map.mergeOptions({
    location: false,
    onLocationFail: null,
    onLocationSuccess: null,
  })

  L.Map.addInitHook(function () {
    if (this.options.location) {
      this.localControl = new LocationControl()
      this.addControl(this.LocationControl)
    } else {
      this.localControl = null
    }
  })
}

const initMapControls = () => {
  initFullScreenControl()
  initLocationControl()
}

export {
  initFullScreenControl,
  initLocationControl,
  initMapControls,
  FullScreenControl,
  LocationControl,
}
