import { get } from "svelte/store"
import { store } from "builderStore"
import { users, auth } from "stores/portal"
import analytics from "analytics"
import { OnboardingData, OnboardingDesign, OnboardingPublish } from "./steps"
const ONBOARDING_EVENT_PREFIX = "onboarding"

export const TOUR_STEP_KEYS = {
  BUILDER_APP_PUBLISH: "builder-app-publish",
  BUILDER_DATA_SECTION: "builder-data-section",
  BUILDER_DESIGN_SECTION: "builder-design-section",
  BUILDER_AUTOMATE_SECTION: "builder-automate-section",
}

export const TOUR_KEYS = {
  TOUR_BUILDER_ONBOARDING: "builder-onboarding",
}

const tourEvent = eventKey => {
  console.log("Emitting EVENT ", eventKey)
  analytics.captureEvent(`${ONBOARDING_EVENT_PREFIX}:${eventKey}`, {
    eventSource: EventSource.PORTAL,
  })
}

const getTours = () => {
  return {
    [TOUR_KEYS.TOUR_BUILDER_ONBOARDING]: [
      {
        id: TOUR_STEP_KEYS.BUILDER_DATA_SECTION,
        title: "Data",
        route: "/builder/app/:application/data",
        layout: OnboardingData,
        query: ".topcenternav .spectrum-Tabs-item#builder-data-tab",
        onLoad: async () => {
          tourEvent(TOUR_STEP_KEYS.BUILDER_DATA_SECTION)
        },
      },
      {
        id: TOUR_STEP_KEYS.BUILDER_DESIGN_SECTION,
        title: "Design",
        route: "/builder/app/:application/design",
        layout: OnboardingDesign,
        query: ".topcenternav .spectrum-Tabs-item#builder-design-tab",
        onLoad: () => {
          tourEvent(TOUR_STEP_KEYS.BUILDER_DESIGN_SECTION)
        },
      },
      {
        id: TOUR_STEP_KEYS.BUILDER_AUTOMATE_SECTION,
        title: "Automations",
        route: "/builder/app/:application/automate",
        query: ".topcenternav .spectrum-Tabs-item#builder-automate-tab",
        body: "Once you have your app screens made, you can set up automations to fit in with your current workflow",
        onLoad: () => {
          tourEvent(TOUR_STEP_KEYS.BUILDER_AUTOMATE_SECTION)
        },
      },
      {
        id: TOUR_STEP_KEYS.BUILDER_APP_PUBLISH,
        title: "Publish",
        layout: OnboardingPublish,
        query: ".toprightnav #builder-app-publish-button",
        onLoad: () => {
          tourEvent(TOUR_STEP_KEYS.BUILDER_APP_PUBLISH)
        },
        onComplete: async () => {
          // Mark the users onboarding as complete
          // Clear all tour related state
          if (get(auth).user) {
            await users.save({
              ...get(auth).user,
              onboardedAt: new Date().toISOString(),
            })

            store.update(state => ({
              ...state,
              tourNodes: null,
              tourKey: null,
              tourKeyStep: null,
              onboarding: false,
            }))
          }
        },
      },
    ],
  }
}

export const TOURS = getTours()
