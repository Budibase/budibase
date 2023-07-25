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
  BUILDER_AUTOMATION_SECTION: "builder-automation-section",
  FEATURE_USER_MANAGEMENT: "feature-user-management",
}

export const TOUR_KEYS = {
  TOUR_BUILDER_ONBOARDING: "builder-onboarding",
  FEATURE_ONBOARDING: "feature-onboarding",
}

const endUserOnboarding = async ({ skipped = false } = {}) => {
  // Mark the users onboarding as complete
  // Clear all tour related state
  if (get(auth).user) {
    try {
      await API.updateSelf({
        onboardedAt: new Date().toISOString(),
      })

      if (skipped) {
        tourEvent("skipped")
      }

      // Update the cached user
      await auth.getSelf()

      store.update(state => ({
        ...state,
        tourNodes: undefined,
        tourKey: undefined,
        tourKeyStep: undefined,
        onboarding: false,
      }))
    } catch (e) {
      console.log("Onboarding failed", e)
      return false
    }
    return true
  }
}

const tourEvent = eventKey => {
  analytics.captureEvent(`${ONBOARDING_EVENT_PREFIX}:${eventKey}`, {
    eventSource: EventSource.PORTAL,
  })
}

const getTours = () => {
  return {
    [TOUR_KEYS.TOUR_BUILDER_ONBOARDING]: {
      steps: [
        {
          id: TOUR_STEP_KEYS.BUILDER_DATA_SECTION,
          title: "Data",
          route: "/builder/app/:application/data",
          layout: OnboardingData,
          query: ".topleftnav .spectrum-Tabs-item#builder-data-tab",
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
          query: ".topleftnav .spectrum-Tabs-item#builder-design-tab",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_DESIGN_SECTION)
          },
          align: "left",
        },
        {
          id: TOUR_STEP_KEYS.BUILDER_AUTOMATION_SECTION,
          title: "Automations",
          route: "/builder/app/:application/automation",
          query: ".topleftnav .spectrum-Tabs-item#builder-automation-tab",
          body: "Once you have your app screens made, you can set up automations to fit in with your current workflow",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_AUTOMATION_SECTION)
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
          query: ".toprightnav #builder-app-publish-button",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_APP_PUBLISH)
          },
          onComplete: endUserOnboarding,
        },
      ],
      onSkip: async () => {
        await endUserOnboarding({ skipped: true })
      },
      endRoute: "/builder/app/:application/data",
    },
    [TOUR_KEYS.FEATURE_ONBOARDING]: {
      steps: [
        {
          id: TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT,
          title: "Users",
          query: ".toprightnav #builder-app-users-button",
          body: "Add users to your app and control what level of access they have.",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT)
          },
          onComplete: endUserOnboarding,
        },
      ],
    },
  }
}

export const TOURS = getTours()
