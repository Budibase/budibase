import type { ParsedUrlQuery } from "querystring"
import { auth, HTTPError } from "@budibase/backend-core"
import {
  PLATFORM_ACTION_CONTAINER_STATUSES,
  PLATFORM_ACTION_ENVIRONMENTS,
  PLATFORM_ACTION_SOURCE_TYPES,
} from "@budibase/types"
import type {
  FetchActionSessionEventsParams,
  FetchActionSessionEventsQuery,
  FetchActionSessionsQuery,
} from "@budibase/types"
import Joi from "joi"

const ENVIRONMENT = Joi.string().valid(...PLATFORM_ACTION_ENVIRONMENTS)
const BOOKMARK = Joi.string().min(1).optional()
const LIMIT = Joi.number().integer().min(1).max(100).optional()

const SESSIONS_QUERY = Joi.object<FetchActionSessionsQuery>({
  env: ENVIRONMENT.optional(),
  status: Joi.string()
    .valid(...PLATFORM_ACTION_CONTAINER_STATUSES)
    .optional(),
  bookmark: BOOKMARK,
  limit: LIMIT,
})

const SESSION_EVENTS_QUERY = Joi.object<FetchActionSessionEventsQuery>({
  env: ENVIRONMENT.required(),
  bookmark: BOOKMARK,
  limit: LIMIT,
})

function validateQuery<T>(schema: Joi.ObjectSchema<T>, query: ParsedUrlQuery) {
  const { value, error } = schema.validate(query)
  if (error) {
    throw new HTTPError(`Invalid query - ${error.message}`, 400)
  }
  return value
}

export const parseActionSessionsQuery = (query: ParsedUrlQuery) =>
  validateQuery(SESSIONS_QUERY, query)

export const parseActionSessionEventsQuery = (query: ParsedUrlQuery) =>
  validateQuery(SESSION_EVENTS_QUERY, query)

export function fetchActionSessionEventsParamsValidator() {
  return auth.joiValidator.params(
    Joi.object<FetchActionSessionEventsParams>({
      sourceType: Joi.string()
        .valid(...PLATFORM_ACTION_SOURCE_TYPES)
        .required(),
      sourceId: Joi.string().min(1).required(),
    })
  )
}
