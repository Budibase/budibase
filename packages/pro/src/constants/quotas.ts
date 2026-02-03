import {
  ConstantQuotaName,
  MonthlyQuotaName,
  StaticQuotaName,
} from "@budibase/types"

export const UNLIMITED = -1

// Static

export const rows = (value: number) => {
  return {
    [StaticQuotaName.ROWS]: {
      name: "Rows",
      value,
      triggers: [90, 100],
    },
  }
}

export const apps = (value: number) => {
  return {
    [StaticQuotaName.WORKSPACES]: {
      name: "Workspaces",
      value,
      triggers: [100],
    },
  }
}

export const users = (value: number) => {
  return {
    [StaticQuotaName.USERS]: {
      name: "Users",
      value,
      triggers: [80, 100],
    },
  }
}

export const creators = (value: number) => {
  return {
    [StaticQuotaName.CREATORS]: {
      name: "Creators",
      value,
      triggers: [],
    },
  }
}

export const userGroups = (value: number) => {
  return {
    [StaticQuotaName.USER_GROUPS]: {
      name: "User Groups",
      value,
      triggers: [80, 100],
    },
  }
}

export const plugins = (value: number) => {
  return {
    [StaticQuotaName.PLUGINS]: {
      name: "Plugins",
      value,
      triggers: [90, 100],
    },
  }
}

// Monthly

export const queries = (value: number) => {
  return {
    [MonthlyQuotaName.QUERIES]: {
      name: "Queries",
      value,
      triggers: [],
    },
  }
}

export const automations = (value: number) => {
  return {
    [MonthlyQuotaName.AUTOMATIONS]: {
      name: "Automations",
      value,
      triggers: [80, 90, 100],
    },
  }
}

export const budibaseAICredits = (value: number) => {
  return {
    [MonthlyQuotaName.BUDIBASE_AI_CREDITS]: {
      name: "Budibase AI Credits",
      value,
      triggers: [80, 90, 100],
    },
  }
}

export const actions = (value: number) => {
  return {
    [MonthlyQuotaName.ACTIONS]: {
      name: "Actions",
      value,
      triggers: [80, 90, 100],
    },
  }
}

// Constant

export const automationLogRetentionDays = (value: number) => {
  return {
    [ConstantQuotaName.AUTOMATION_LOG_RETENTION_DAYS]: {
      name: "Automation Logs",
      value,
      triggers: [], // n/a
    },
  }
}

export const appBackupRetentionDays = (value: number) => {
  return {
    [ConstantQuotaName.APP_BACKUPS_RETENTION_DAYS]: {
      name: "App Backups",
      value,
      triggers: [], // n/a
    },
  }
}

export const customAIConfigurations = (value: number) => {
  return {
    [StaticQuotaName.AI_CUSTOM_CONFIGS]: {
      name: "Custom AI Configuration",
      value,
      triggers: [], // n/a
    },
  }
}
