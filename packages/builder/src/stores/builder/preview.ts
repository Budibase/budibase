import { get } from "svelte/store"
import { BudiStore } from "../BudiStore"
import { PreviewDevice, ComponentContext, AppContext } from "@budibase/types"

type PreviewEventHandler = (name: string, payload?: any) => void

interface PreviewState {
  previewDevice: PreviewDevice
  previewEventHandler: PreviewEventHandler | null
  showPreview: boolean
  selectedComponentContext: AppContext | null
}

const INITIAL_PREVIEW_STATE: PreviewState = {
  previewDevice: "desktop",
  previewEventHandler: null,
  showPreview: false,
  selectedComponentContext: null,
}

export class PreviewStore extends BudiStore<PreviewState> {
  constructor() {
    super(INITIAL_PREVIEW_STATE)

    this.setDevice = this.setDevice.bind(this)
    this.sendEvent = this.sendEvent.bind(this)
    this.registerEventHandler = this.registerEventHandler.bind(this)
    this.startDrag = this.startDrag.bind(this)
    this.stopDrag = this.stopDrag.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.setSelectedComponentContext =
      this.setSelectedComponentContext.bind(this)
    this.requestComponentContext = this.requestComponentContext.bind(this)
  }

  setDevice(device: PreviewDevice) {
    this.update(state => ({
      ...state,
      previewDevice: device,
    }))
  }

  // Potential evt names "eject-block", "dragging-new-component"
  sendEvent(name: string, payload?: any) {
    const { previewEventHandler } = get(this.store)
    previewEventHandler?.(name, payload)
  }

  registerEventHandler(handler: PreviewEventHandler) {
    this.update(state => ({
      ...state,
      previewEventHandler: handler,
    }))
  }

  async startDrag(component: string) {
    this.sendEvent("dragging-new-component", {
      dragging: true,
      component,
    })
  }

  stopDrag() {
    this.sendEvent("dragging-new-component", {
      dragging: false,
    })
  }

  //load preview?
  showPreview(isVisible: boolean) {
    this.update(state => ({
      ...state,
      showPreview: isVisible,
    }))
  }

  setSelectedComponentContext(context: ComponentContext) {
    this.update(state => ({
      ...state,
      selectedComponentContext: context,
    }))
  }

  updateState(data: Record<string, any>) {
    this.sendEvent("builder-state", data)
  }

  setUrlTestData(data: Record<string, any>) {
    this.sendEvent("builder-url-test-data", data)
  }

  requestComponentContext() {
    this.sendEvent("request-context")
  }
}

export const previewStore = new PreviewStore()
