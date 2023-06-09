import { get } from "svelte/store"
import { store } from "builderStore"
import { auth } from "stores/portal"
import analytics from "analytics"
import { OnboardingData, OnboardingDesign, OnboardingPublish } from "./steps"
import { API } from "api"
const ONBOARDING_EVENT_PREFIX = "onboarding"

export const TOUR_STEP_KEYS = {
  BUILDER_APP_PUBLISH: "builder-app-publish",
  BUILDER_DATA_SECTION: "builder-data-section",
  BUILDER_DESIGN_SECTION: "builder-design-section",
  BUILDER_USER_MANAGEMENT: "builder-user-management",
  BUILDER_AUTOMATE_SECTION: "builder-automate-section",
  FEATURE_USER_MANAGEMENT: "feature-user-management",
}

export const TOUR_KEYS = {
  TOUR_BUILDER_ONBOARDING: "builder-onboarding",
  FEATURE_ONBOARDING: "feature-onboarding",
}

const tourEvent = eventKey => {
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
        align: "left",
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
        align: "left",
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
        align: "left",
      },
      {
        id: TOUR_STEP_KEYS.BUILDER_USER_MANAGEMENT,
        title: "Users",
        query: ".toprightnav #builder-app-users-button",
        body: "Add users to your app and control what level of access they have.",
        onLoad: () => {
          tourEvent(TOUR_STEP_KEYS.BUILDER_USER_MANAGEMENT)
        },
      },
      {
        id: TOUR_STEP_KEYS.BUILDER_APP_PUBLISH,
        title: "Publish",
        layout: OnboardingPublish,
        route: "/builder/app/:application/design",
        endRoute: "/builder/app/:application/data",
        query: ".toprightnav #builder-app-publish-button",
        onLoad: () => {
          tourEvent(TOUR_STEP_KEYS.BUILDER_APP_PUBLISH)
        },
        onComplete: async () => {
          // Mark the users onboarding as complete
          // Clear all tour related state
          if (get(auth).user) {
            await API.updateSelf({
              onboardedAt: new Date().toISOString(),
            })

            // Update the cached user
            await auth.getSelf()

            store.update(state => ({
              ...state,
              tourNodes: undefined,
              tourKey: undefined,
              tourKeyStep: undefined,
              onboarding: false,
            }))
          }
        },
      },
    ],
    [TOUR_KEYS.FEATURE_ONBOARDING]: [
      {
        id: TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT,
        title: "Users",
        query: ".toprightnav #builder-app-users-button",
        body: "Add users to your app and control what level of access they have.",
        onLoad: () => {
          tourEvent(TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT)
        },
        onComplete: async () => {
          // Push the onboarding forward
          if (get(auth).user) {
            await API.updateSelf({
              onboardedAt: new Date().toISOString(),
            })

            // Update the cached user
            await auth.getSelf()

            store.update(state => ({
              ...state,
              tourNodes: undefined,
              tourKey: undefined,
              tourKeyStep: undefined,
              onboarding: false,
            }))
          }
        },
      },
    ],
  }
}

export const TOURS = getTours()
