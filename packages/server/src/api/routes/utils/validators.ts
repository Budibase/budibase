import { auth, permissions } from "@budibase/backend-core"
import { DataSourceOperation } from "../../../constants"
import { Table, WebhookActionType } from "@budibase/types"
import Joi, { CustomValidator } from "joi"
import { ValidSnippetNameRegex, helpers } from "@budibase/shared-core"
import sdk from "../../../sdk"

const { isRequired } = helpers.schema

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const OPTIONAL_NUMBER = Joi.number().optional().allow(null)
const OPTIONAL_BOOLEAN = Joi.boolean().optional().allow(null)
const APP_NAME_REGEX = /^[\w\s]+$/

const validateViewSchemas: CustomValidator<Table> = (table, helpers) => {
  if (table.views && Object.entries(table.views).length) {
    const requiredFields = Object.entries(table.schema)
      .filter(([_, v]) => isRequired(v.constraints))
      .map(([key]) => key)
    if (requiredFields.length) {
      for (const view of Object.values(table.views)) {
        if (!sdk.views.isV2(view)) {
          continue
        }

        const editableViewFields = Object.entries(view.schema || {})
          .filter(([_, f]) => f.visible && !f.readonly)
          .map(([key]) => key)
        const missingField = requiredFields.find(
          f => !editableViewFields.includes(f)
        )
        if (missingField) {
          return helpers.message({
            custom: `To make field "${missingField}" required, this field must be present and writable in views: ${view.name}.`,
          })
        }
      }
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

function filterObject() {
  return Joi.object({
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
    allOr: Joi.boolean().optional(),
  }).unknown(true)
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

export function datasourceQueryValidator() {
  return auth.joiValidator.body(
    Joi.object({
      endpoint: Joi.object({
        datasourceId: Joi.string().required(),
        operation: Joi.string()
          .required()
          .valid(...Object.values(DataSourceOperation)),
        entityId: Joi.string().required(),
      }).required(),
      resource: Joi.object({
        fields: Joi.array().items(Joi.string()).optional(),
      }).optional(),
      body: Joi.object().optional(),
      sort: Joi.object().optional(),
      filters: filterObject().optional(),
      paginate: Joi.object({
        page: Joi.string().alphanum().optional(),
        limit: Joi.number().optional(),
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

  return auth.joiValidator.body(
    Joi.object({
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      name: Joi.string()
        .regex(/^[a-zA-Z0-9_]*$/)
        .required(),
      // this is the base permission ID (for now a built in)
      permissionId: Joi.string()
        .valid(...Object.values(permissions.BuiltinPermissionID))
        .required(),
      permissions: Joi.object()
        .pattern(/.*/, [Joi.string().valid(...permLevelArray)])
        .optional(),
      inherits: OPTIONAL_STRING,
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
  return Joi.object({
    stepId: Joi.string().required(),
    id: Joi.string().required(),
    description: Joi.string().required(),
    name: Joi.string().required(),
    tagline: Joi.string().required(),
    icon: Joi.string().required(),
    params: Joi.object(),
    args: Joi.object(),
    type: Joi.string()
      .required()
      .valid(...allowStepTypes),
  }).unknown(true)
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
          .items(generateStepSchema(["ACTION", "LOGIC"])),
        trigger: generateStepSchema(["TRIGGER"]).allow(null),
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
    template: Joi.object({
      templateString: OPTIONAL_STRING,
    }),
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
      template: Joi.object({
        templateString: OPTIONAL_STRING,
      }).unknown(true),
      snippets: snippetValidator,
    }).unknown(true)
  )
}
