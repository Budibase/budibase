import TableHeader from "./TableHeader.svelte"

export default class TableHeaderWrapper {
  constructor() {}

  init(params) {
    this.agParams = params
    this.container = document.createElement("div")
    this.container.style.height = "100%"
    this.container.style.width = "100%"

    this.headerComponent = new TableHeader({
      target: this.container,
      props: params,
    })
    this.gui = this.container
  }

  // can get called more than once, you should return the HTML element
  getGui() {
    return this.gui
  }

  // gets called when a new Column Definition has been set for this header
  refresh(params) {
    this.agParams = params
    this.headerComponent = new TableHeader({
      target: this.container,
      props: params,
    })
  }

  // optional method, gets called once, when component is destroyed
  destroy() {}
}
