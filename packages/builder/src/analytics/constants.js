export const Events = {
  // TODO: Remove most UI events
  BUILDER: {
    STARTED: "Builder Started",
  },
  COMPONENT: {
    CREATED: "Added Component",
  },
  DATASOURCE: {
    CREATED: "Datasource Created",
    UPDATED: "Datasource Updated",
  },
  QUERIES: {
    REST: "REST Queries Imported",
  },
  TABLE: {
    CREATED: "Table Created",
  },
  VIEW: {
    CREATED: "View Created",
    ADDED_FILTER: "Added View Filter",
    ADDED_CALCULATE: "Added View Calculate",
  },
  SCREEN: {
    CREATED: "Screen Created",
    CREATE_ROLE_UPDATED: "Changed Role On Screen Creation",
  },
  AUTOMATION: {
    CREATED: "Automation Created",
    SAVED: "Automation Saved",
    BLOCK_ADDED: "Added Automation Block",
  },
  NPS: {
    SUBMITTED: "budibase:feedback_submitted",
  },
  APP: {
    CREATED: "budibase:app_created",
    PUBLISHED: "budibase:app_published",
    UNPUBLISHED: "budibase:app_unpublished",
    VIEW_PUBLISHED: "budibase:view_published_app",
  },
  ANALYTICS: {
    OPT_IN: "budibase:analytics_opt_in",
    OPT_OUT: "budibase:analytics_opt_out",
  },
  USER: {
    INVITE: "budibase:portal_user_invite",
  },
  SMTP: {
    SAVED: "budibase:smtp_saved",
  },
  SSO: {
    SAVED: "budibase:sso_saved",
  },
}

export const EventSource = {
  PORTAL: "portal",
  URL: "url",
  NOTIFICATION: "notification",
}
