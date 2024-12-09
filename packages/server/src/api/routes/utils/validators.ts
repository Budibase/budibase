import { auth, permissions } from "@budibase/backend-core"
import {
  AutomationActionStepId,
  AutomationStep,
  AutomationStepType,
  EmptyFilterOption,
  SearchFilters,
  Table,
  WebhookActionType,
  BuiltinPermissionID,
  ViewV2Type,
  SortOrder,
  SortType,
  UILogicalOperator,
  BasicOperator,
  ArrayOperator,
  RangeOperator,
} from "@budibase/types"
import Joi, { CustomValidator } from "joi"
import { ValidSnippetNameRegex, helpers } from "@budibase/shared-core"
import sdk from "../../../sdk"

const { isRequired } = helpers.schema

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const OPTIONAL_NUMBER = Joi.number().optional().allow(null)
const OPTIONAL_BOOLEAN = Joi.boolean().optional().allow(null)
const APP_NAME_REGEX = /^[\w\s]+$/

const validateViewSchemas: CustomValidator<Table> = (table, joiHelpers) => {
  if (!table.views || Object.keys(table.views).length === 0) {
    return table
  }
  const required = Object.keys(table.schema).filter(key =>
    isRequired(table.schema[key].constraints)
  )
  if (required.length === 0) {
    return table
  }
  for (const view of Object.values(table.views)) {
    if (!sdk.views.isV2(view) || helpers.views.isCalculationView(view)) {
      continue
    }
    const editable = Object.entries(view.schema || {})
      .filter(([_, f]) => f.visible && !f.readonly)
      .map(([key]) => key)
    const missingField = required.find(f => !editable.includes(f))
    if (missingField) {
      return joiHelpers.message({
        custom: `To make field "${missingField}" required, this field must be present and writable in views: ${view.name}.`,
      })
    }
  }
  return table
}

export function tableValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      type: OPTIONAL_STRING.valid("table", "internal", "external"),
      primaryDisplay: OPTIONAL_STRING,
      schema: Joi.object().required(),
      name: Joi.string().required(),
      views: Joi.object(),
      rows: Joi.array(),
    })
      .custom(validateViewSchemas)
      .unknown(true),
    { errorPrefix: "" }
  )
}

function searchUIFilterValidator() {
  const logicalOperator = Joi.string().valid(
    ...Object.values(UILogicalOperator)
  )
  const operators = [
    ...Object.values(BasicOperator),
    ...Object.values(ArrayOperator),
    ...Object.values(RangeOperator),
  ]
  const filters = Joi.array().items(
    Joi.object({
      operator: Joi.string()
        .valid(...operators)
        .required(),
      field: Joi.string().required(),
      // could do with better validation of value based on operator
      value: Joi.any().required(),
    })
  )
  return Joi.object({
    logicalOperator,
    onEmptyFilter: Joi.string().valid(...Object.values(EmptyFilterOption)),
    groups: Joi.array().items(
      Joi.object({
        logicalOperator,
        filters,
        groups: Joi.array().items(
          Joi.object({
            filters,
            logicalOperator,
          })
        ),
      })
    ),
  })
}

export function viewValidator() {
  return auth.joiValidator.body(
    Joi.object({
      id: OPTIONAL_STRING,
      tableId: Joi.string().required(),
      name: Joi.string().required(),
      type: Joi.string().optional().valid(null, ViewV2Type.CALCULATION),
      primaryDisplay: OPTIONAL_STRING,
      schema: Joi.object().required(),
      query: searchUIFilterValidator().optional(),
      sort: Joi.object({
        field: Joi.string().required(),
        order: Joi.string()
          .optional()
          .valid(...Object.values(SortOrder)),
        type: Joi.string()
          .optional()
          .valid(...Object.values(SortType)),
      }).optional(),
    })
  )
}

export function nameValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: OPTIONAL_STRING,
    })
  )
}

export function datasourceValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: Joi.string(),
      _rev: Joi.string(),
      type: OPTIONAL_STRING.allow("datasource_plus"),
      relationships: Joi.array().items(
        Joi.object({
          from: Joi.string().required(),
          to: Joi.string().required(),
          cardinality: Joi.valid("1:N", "1:1", "N:N").required(),
        })
      ),
    }).unknown(true)
  )
}

function searchFiltersValidator() {
  const conditionalFilteringObject = () =>
    Joi.object({
      conditions: Joi.array().items(Joi.link("#schema")).required(),
    })

  const filtersValidators: Record<keyof SearchFilters, any> = {
    string: Joi.object().optional(),
    fuzzy: Joi.object().optional(),
    range: Joi.object().optional(),
    equal: Joi.object().optional(),
    notEqual: Joi.object().optional(),
    empty: Joi.object().optional(),
    notEmpty: Joi.object().optional(),
    oneOf: Joi.object().optional(),
    contains: Joi.object().optional(),
    notContains: Joi.object().optional(),
    containsAny: Joi.object().optional(),
    allOr: Joi.boolean().optional(),
    onEmptyFilter: Joi.string()
      .optional()
      .valid(...Object.values(EmptyFilterOption)),
    $and: conditionalFilteringObject(),
    $or: conditionalFilteringObject(),
    fuzzyOr: Joi.forbidden(),
    documentType: Joi.forbidden(),
  }

  return Joi.object(filtersValidators)
}

function filterObject(opts?: { unknown: boolean }) {
  const { unknown = true } = opts || {}

  return searchFiltersValidator().unknown(unknown).id("schema")
}

export function internalSearchValidator() {
  return auth.joiValidator.body(
    Joi.object({
      tableId: OPTIONAL_STRING,
      query: filterObject(),
      limit: OPTIONAL_NUMBER,
      sort: OPTIONAL_STRING,
      sortOrder: OPTIONAL_STRING,
      sortType: OPTIONAL_STRING,
      paginate: Joi.boolean(),
      countRows: Joi.boolean(),
      bookmark: Joi.alternatives()
        .try(OPTIONAL_STRING, OPTIONAL_NUMBER)
        .optional(),
    })
  )
}

export function externalSearchValidator() {
  return auth.joiValidator.body(
    Joi.object({
      query: filterObject(),
      paginate: Joi.boolean().optional(),
      bookmark: Joi.alternatives()
        .try(OPTIONAL_STRING, OPTIONAL_NUMBER)
        .optional(),
      limit: OPTIONAL_NUMBER,
      sort: Joi.object({
        column: Joi.string(),
        order: OPTIONAL_STRING.valid("ascending", "descending"),
        type: OPTIONAL_STRING.valid("string", "number"),
      }).optional(),
    })
  )
}

export function webhookValidator() {
  return auth.joiValidator.body(
    Joi.object({
      live: Joi.bool(),
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      name: Joi.string().required(),
      bodySchema: Joi.object().optional(),
      action: Joi.object({
        type: Joi.string().required().valid(WebhookActionType.AUTOMATION),
        target: Joi.string().required(),
      }).required(),
    }).unknown(true)
  )
}

export function roleValidator() {
  const permLevelArray = Object.values(permissions.PermissionLevel)
  const permissionString = Joi.string().valid(...permLevelArray)
  return auth.joiValidator.body(
    Joi.object({
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      name: Joi.string()
        .regex(/^[a-zA-Z0-9_]*$/)
        .required(),
      uiMetadata: Joi.object({
        displayName: OPTIONAL_STRING,
        color: OPTIONAL_STRING,
        description: OPTIONAL_STRING,
      }).optional(),
      // this is the base permission ID (for now a built in)
      permissionId: Joi.string()
        .valid(...Object.values(BuiltinPermissionID))
        .optional(),
      permissions: Joi.object()
        .pattern(
          /.*/,
          Joi.alternatives().try(
            Joi.array().items(permissionString),
            permissionString
          )
        )
        .optional(),
      inherits: Joi.alternatives().try(
        OPTIONAL_STRING,
        Joi.array().items(OPTIONAL_STRING)
      ),
    }).unknown(true)
  )
}

export function permissionValidator() {
  const permLevelArray = Object.values(permissions.PermissionLevel)

  return auth.joiValidator.params(
    Joi.object({
      level: Joi.string()
        .valid(...permLevelArray)
        .required(),
      resourceId: Joi.string(),
      roleId: Joi.string(),
    }).unknown(true)
  )
}

export function screenValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
      showNavigation: OPTIONAL_BOOLEAN,
      width: OPTIONAL_STRING,
      routing: Joi.object({
        route: Joi.string().required(),
        roleId: Joi.string().required().allow(""),
        homeScreen: OPTIONAL_BOOLEAN,
      })
        .required()
        .unknown(true),
      props: Joi.object({
        _id: Joi.string().required(),
        _component: Joi.string().required(),
        _children: Joi.array().required(),
        _styles: Joi.object().required(),
        type: OPTIONAL_STRING,
        table: OPTIONAL_STRING,
        layoutId: OPTIONAL_STRING,
      })
        .required()
        .unknown(true),
    }).unknown(true)
  )
}

function generateStepSchema(allowStepTypes: string[]) {
  const branchSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    condition: filterObject({ unknown: false }).required().min(1),
    conditionUI: Joi.object(),
  })

  return Joi.object({
    stepId: Joi.string().required(),
    id: Joi.string().required(),
    description: Joi.string().required(),
    name: Joi.string().required(),
    tagline: Joi.string().required(),
    icon: Joi.string().required(),
    params: Joi.object(),
    inputs: Joi.when("stepId", {
      is: AutomationActionStepId.BRANCH,
      then: Joi.object({
        branches: Joi.array().items(branchSchema).min(1).required(),
        children: Joi.object()
          .pattern(Joi.string(), Joi.array().items(Joi.link("#step")))
          .required(),
      }).required(),
      otherwise: Joi.object(),
    }),

    args: Joi.object(),
    type: Joi.string()
      .required()
      .valid(...allowStepTypes),
  })
    .unknown(true)
    .id("step")
}

const validateStepsArray = (
  steps: AutomationStep[],
  helpers: Joi.CustomHelpers
) => {
  for (const step of steps.slice(0, -1)) {
    if (step.stepId === AutomationActionStepId.BRANCH) {
      return helpers.error("branchStepPosition")
    }
  }
}

export function automationValidator(existing = false) {
  return auth.joiValidator.body(
    Joi.object({
      _id: existing ? Joi.string().required() : OPTIONAL_STRING,
      _rev: existing ? Joi.string().required() : OPTIONAL_STRING,
      name: Joi.string().required(),
      type: Joi.string().valid("automation").required(),
      definition: Joi.object({
        steps: Joi.array()
          .required()
          .items(
            generateStepSchema([
              AutomationStepType.ACTION,
              AutomationStepType.LOGIC,
            ])
          )
          .custom(validateStepsArray)
          .messages({
            branchStepPosition:
              "Branch steps are only allowed as the last step",
          }),
        trigger: generateStepSchema([AutomationStepType.TRIGGER]).allow(null),
      })

        .required()
        .unknown(true),
    }).unknown(true)
  )
}

export function applicationValidator(opts = { isCreate: true }) {
  const base: any = {
    _id: OPTIONAL_STRING,
    _rev: OPTIONAL_STRING,
    url: OPTIONAL_STRING,
    template: Joi.object({}),
  }

  const appNameValidator = Joi.string()
    .pattern(new RegExp(APP_NAME_REGEX))
    .error(new Error("App name must be letters, numbers and spaces only"))
  if (opts.isCreate) {
    base.name = appNameValidator.required()
  } else {
    base.name = appNameValidator.optional()
  }

  const snippetValidator = Joi.array()
    .optional()
    .items(
      Joi.object({
        name: Joi.string()
          .pattern(new RegExp(ValidSnippetNameRegex))
          .error(
            new Error(
              "Snippet name cannot include spaces or special characters, and cannot start with a number"
            )
          ),
        code: OPTIONAL_STRING,
      })
    )

  return auth.joiValidator.body(
    Joi.object({
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      name: appNameValidator,
      url: OPTIONAL_STRING,
      template: Joi.object({}).unknown(true),
      snippets: snippetValidator,
    }).unknown(true)
  )
}
