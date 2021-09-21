export default class IntercomClient {
  constructor(token) {
    this.token = token
  }

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

  show(user = {}) {
    if (!this.initialised) return

    return window.Intercom("boot", {
      app_id: this.token,
      ...user,
    })
  }

  update() {
    if (!this.initialised) return

    return window.Intercom("update")
  }

  captureEvent(event, props = {}) {
    if (!this.initialised) return

    window.Intercom("trackEvent", event, props)
  }

  logout() {
    if (!this.initialised) return

    window.Intercom("shutdown")
  }
}
