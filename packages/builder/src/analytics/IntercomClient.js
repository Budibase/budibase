export default class IntercomClient {
  constructor(token) {
    this.token = token
  }

  //
  /**
   * Instantiate intercom using their provided script.
   */
  init() {
    if (!this.token) return

    const token = this.token

    var w = window
    var ic = w.Intercom
    if (typeof ic === "function") {
      ic("reattach_activator")
      ic("update", w.intercomSettings)
    } else {
      var d = document
      var i = function () {
        i.c(arguments)
      }
      i.q = []
      i.c = function (args) {
        i.q.push(args)
      }
      w.Intercom = i
      var l = function () {
        var s = d.createElement("script")
        s.type = "text/javascript"
        s.async = true
        s.src = "https://widget.intercom.io/widget/" + token
        var x = d.getElementsByTagName("script")[0]
        x.parentNode.insertBefore(s, x)
      }
      if (document.readyState === "complete") {
        l()
      } else if (w.attachEvent) {
        w.attachEvent("onload", l)
      } else {
        w.addEventListener("load", l, false)
      }

      this.initialised = true
    }
  }

  /**
   * Show the intercom chat bubble.
   * @param {Object} user - user to identify
   * @returns Intercom global object
   */
  show(user = {}, enabled) {
    if (!this.initialised || !enabled) return

    return window.Intercom("boot", {
      app_id: this.token,
      ...user,
    })
  }

  /**
   * Update intercom user details and messages.
   * @returns Intercom global object
   */
  update() {
    if (!this.initialised) return

    return window.Intercom("update")
  }

  /**
   * Capture analytics events and send them to intercom.
   * @param {String} event - event identifier
   * @param {Object} props - properties for the event
   * @returns Intercom global object
   */
  captureEvent(event, props = {}) {
    if (!this.initialised) return

    return window.Intercom("trackEvent", event, props)
  }

  /**
   * Disassociate the user from the current session.
   * @returns Intercom global object
   */
  logout() {
    if (!this.initialised) return

    return window.Intercom("shutdown")
  }
}
