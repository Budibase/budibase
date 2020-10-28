import LoadingOverlay from "./LoadingOverlay.svelte"

export default class LoadingOverlayWrapper {
  init(params) {
    this.gui = document.createElement("div")
    new LoadingOverlay({
      target: this.gui,
      props: {
        params,
      },
    })
  }

  getGui() {
    return this.gui
  }
}
