import { auth } from "@budibase/backend-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const OPTIONAL_ARRAY = Joi.array().optional().allow(null)

/**
 * Helper function to create auth validation based on tool source type
 */
function getAuthValidation() {
  return Joi.when("type", {
    switch: [
      {
        is: "GITHUB",
        then: Joi.object({
          apiKey: Joi.string().required(),
          baseUrl: OPTIONAL_STRING,
          guidelines: OPTIONAL_STRING,
        }).required(),
      },
      {
        is: "CONFLUENCE",
        then: Joi.object({
          apiKey: Joi.string().required(),
          email: Joi.string().email().required(),
          baseUrl: OPTIONAL_STRING,
          guidelines: OPTIONAL_STRING,
        }).required(),
      },
      {
        is: "BAMBOOHR",
        then: Joi.object({
          apiKey: Joi.string().required(),
          subdomain: Joi.string().required(),
          guidelines: OPTIONAL_STRING,
        }).required(),
      },
      {
        is: "BUDIBASE",
        then: Joi.object({
          guidelines: OPTIONAL_STRING,
        }).optional(),
      },
    ],
  })
}

/**
 * Validator for chat agent requests
 */
export function chatAgentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      title: OPTIONAL_STRING,
      messages: Joi.array()
        .items(
          Joi.object({
            role: Joi.string()
              .valid("system", "user", "assistant", "tool")
              .required(),
            content: Joi.string().allow("").allow(null),
            tool_calls: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().required(),
                  type: Joi.string().valid("function").required(),
                  function: Joi.object({
                    name: Joi.string().required(),
                    arguments: Joi.string().required(),
                  }).required(),
                })
              )
              .optional(),
            tool_call_id: OPTIONAL_STRING,
          })
        )
        .required(),
    })
  )
}

/**
 * Validator for creating tool source requests
 */
export function createToolSourceValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      type: Joi.string()
        .valid("BUDIBASE", "GITHUB", "CONFLUENCE", "BAMBOOHR")
        .required(),
      description: OPTIONAL_STRING,
      disabledTools: OPTIONAL_ARRAY.items(Joi.string()),
      auth: getAuthValidation(),
    }).unknown(true)
  )
}

/**
 * Validator for updating tool source requests
 */
export function updateToolSourceValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: Joi.string().required(),
      _rev: Joi.string().required(),
      type: Joi.string()
        .valid("BUDIBASE", "GITHUB", "CONFLUENCE", "BAMBOOHR")
        .required(),
      description: OPTIONAL_STRING,
      disabledTools: OPTIONAL_ARRAY.items(Joi.string()),
      auth: getAuthValidation(),
    }).unknown(true)
  )
}
