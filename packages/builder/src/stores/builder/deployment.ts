import { type Writable, get, type Readable, derived } from "svelte/store"
import { API } from "@/api"
import { notifications } from "@budibase/bbui"
import { DeploymentProgressResponse, DeploymentStatus } from "@budibase/types"
import analytics, { Events, EventSource } from "@/analytics"
import { appsStore } from "@/stores/portal/apps"
import { DerivedBudiStore } from "@/stores/BudiStore"
import { appStore } from "./app"
import { processStringSync } from "@budibase/string-templates"
import { selectedAppUrls } from "./appUrls"

interface DeploymentState {
  deployments: DeploymentProgressResponse[]
  isPublishing: boolean
}

interface DerivedDeploymentState extends DeploymentState {
  isPublished: boolean
  lastPublished?: string
}

class DeploymentStore extends DerivedBudiStore<
  DeploymentState,
  DerivedDeploymentState
> {
  constructor() {
    const makeDerivedStore = (
      store: Writable<DeploymentState>
    ): Readable<DerivedDeploymentState> => {
      return derived(
        [store, appStore, appsStore],
        ([$store, $appStore, $appsStore]) => {
          // Determine whether the app is published
          const app = $appsStore.apps.find(app => app.devId === $appStore.appId)
          const deployments = $store.deployments.filter(
            x => x.status === DeploymentStatus.SUCCESS
          )
          const isPublished =
            app?.status === "published" && !!deployments.length

          // Generate last published string
          let lastPublished = undefined
          if (isPublished) {
            lastPublished = processStringSync(
              "Your app was last published {{ duration time 'millisecond' }} ago",
              {
                time:
                  new Date().getTime() -
                  new Date(deployments[0].updatedAt).getTime(),
              }
            )
          }
          return {
            ...$store,
            isPublished,
            lastPublished,
          }
        }
      )
    }
    super(
      {
        deployments: [],
        isPublishing: false,
      },
      makeDerivedStore
    )
    this.load = this.load.bind(this)
    this.publishApp = this.publishApp.bind(this)
    this.completePublish = this.completePublish.bind(this)
    this.unpublishApp = this.unpublishApp.bind(this)
  }

  async load() {
    try {
      const deployments = await API.getAppDeployments()
      this.update(state => ({
        ...state,
        deployments,
      }))
    } catch (err) {
      notifications.error("Error fetching deployments")
    }
  }

  async publishApp(opts?: {
    automationIds?: string[]
    workspaceAppIds?: string[]
  }) {
    try {
      this.update(state => ({ ...state, isPublishing: true }))
      await API.publishAppChanges(get(appStore).appId, opts)
      await this.completePublish()
    } catch (error: any) {
      analytics.captureException(error)
      const message = error?.message ? ` - ${error.message}` : ""
      notifications.error(`Error publishing app${message}`)
    }
    this.update(state => ({ ...state, isPublishing: false }))
  }

  async completePublish() {
    try {
      await appsStore.load()
      await this.load()
    } catch (err) {
      notifications.error("Error refreshing app")
    }
  }

  async unpublishApp() {
    if (!get(this.derivedStore).isPublished) {
      return
    }
    try {
      await API.unpublishApp(get(appStore).appId)
      await appsStore.load()
      notifications.send("App unpublished", {
        type: "success",
        icon: "globe",
      })
    } catch (err) {
      notifications.error("Error unpublishing app")
    }
  }

  viewPublishedApp() {
    const app = get(appStore)
    const { liveUrl } = get(selectedAppUrls)
    analytics.captureEvent(Events.APP_VIEW_PUBLISHED, {
      appId: app.appId,
      eventSource: EventSource.PORTAL,
    })

    window.open(liveUrl)
  }
}

export const deploymentStore = new DeploymentStore()
