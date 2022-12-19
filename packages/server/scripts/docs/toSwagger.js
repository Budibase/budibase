let _ = require("lodash")
let { pathToRegexp } = require("path-to-regexp")

/********************************************************
 * Based on: https://github.com/fsbahman/apidoc-swagger *
 ********************************************************/

let swagger = {
  swagger: "2.0",
  info: {},
  paths: {},
  definitions: {},
}

function toSwagger(apidocJson, projectJson) {
  swagger.info = addInfo(projectJson)
  swagger.paths = extractPaths(apidocJson)
  return swagger
}

let tagsRegex = /(<([^>]+)>)/gi
// Removes <p> </p> tags from text
function removeTags(text) {
  return text ? text.replace(tagsRegex, "") : text
}

function addInfo(projectJson) {
  let info = {}
  info["title"] = projectJson.title || projectJson.name
  info["version"] = projectJson.version
  info["description"] = projectJson.description
  return info
}

/**
 * Extracts paths provided in json format
 * post, patch, put request parameters are extracted in body
 * get and delete are extracted to path parameters
 * @param apidocJson
 * @returns {{}}
 */
function extractPaths(apidocJson) {
  let apiPaths = groupByUrl(apidocJson)
  let paths = {}
  for (let i = 0; i < apiPaths.length; i++) {
    let verbs = apiPaths[i].verbs
    let url = verbs[0].url
    let pattern = pathToRegexp(url, null)
    let matches = pattern.exec(url)

    // Surrounds URL parameters with curly brackets -> :email with {email}
    let pathKeys = []
    for (let j = 1; j < matches.length; j++) {
      let key = matches[j].slice(1)
      url = url.replace(matches[j], "{" + key + "}")
      pathKeys.push(key)
    }

    for (let j = 0; j < verbs.length; j++) {
      let verb = verbs[j]
      let type = verb.type

      let obj = (paths[url] = paths[url] || {})

      if (type === "post" || type === "patch" || type === "put") {
        _.extend(
          obj,
          createPostPushPutOutput(verb, swagger.definitions, pathKeys)
        )
      } else {
        _.extend(obj, createGetDeleteOutput(verb, swagger.definitions))
      }
    }
  }
  return paths
}

function createPostPushPutOutput(verbs, definitions, pathKeys) {
  let pathItemObject = {}
  let verbDefinitionResult = createVerbDefinitions(verbs, definitions)

  let params = []
  let pathParams = createPathParameters(verbs, pathKeys)
  pathParams = _.filter(pathParams, function (param) {
    let hasKey = pathKeys.indexOf(param.name) !== -1
    return !(param.in === "path" && !hasKey)
  })

  params = params.concat(pathParams)
  let required =
    verbs.parameter &&
    verbs.parameter.fields &&
    verbs.parameter.fields.Parameter &&
    verbs.parameter.fields.Parameter.length > 0

  params.push({
    in: "body",
    name: "body",
    description: removeTags(verbs.description),
    required: required,
    schema: {
      $ref: "#/definitions/" + verbDefinitionResult.topLevelParametersRef,
    },
  })

  pathItemObject[verbs.type] = {
    tags: [verbs.group],
    summary: removeTags(verbs.description),
    consumes: ["application/json"],
    produces: ["application/json"],
    parameters: params,
  }

  if (verbDefinitionResult.topLevelSuccessRef) {
    pathItemObject[verbs.type].responses = {
      200: {
        description: "successful operation",
        schema: {
          type: verbDefinitionResult.topLevelSuccessRefType,
          items: {
            $ref: "#/definitions/" + verbDefinitionResult.topLevelSuccessRef,
          },
        },
      },
    }
  }

  return pathItemObject
}

function createVerbDefinitions(verbs, definitions) {
  let result = {
    topLevelParametersRef: null,
    topLevelSuccessRef: null,
    topLevelSuccessRefType: null,
  }
  let defaultObjectName = verbs.name

  let fieldArrayResult = {}
  if (verbs && verbs.parameter && verbs.parameter.fields) {
    fieldArrayResult = createFieldArrayDefinitions(
      verbs.parameter.fields.Parameter,
      definitions,
      verbs.name,
      defaultObjectName
    )
    result.topLevelParametersRef = fieldArrayResult.topLevelRef
  }

  if (verbs && verbs.success && verbs.success.fields) {
    fieldArrayResult = createFieldArrayDefinitions(
      verbs.success.fields["Success 200"],
      definitions,
      verbs.name,
      defaultObjectName
    )
    result.topLevelSuccessRef = fieldArrayResult.topLevelRef
    result.topLevelSuccessRefType = fieldArrayResult.topLevelRefType
  }

  return result
}

function createFieldArrayDefinitions(
  fieldArray,
  definitions,
  topLevelRef,
  defaultObjectName
) {
  let result = {
    topLevelRef: topLevelRef,
    topLevelRefType: null,
  }

  if (!fieldArray) {
    return result
  }

  for (let i = 0; i < fieldArray.length; i++) {
    let parameter = fieldArray[i]

    let nestedName = createNestedName(parameter.field)
    let objectName = nestedName.objectName
    if (!objectName) {
      objectName = defaultObjectName
    }
    let type = parameter.type
    if (i === 0) {
      result.topLevelRefType = type
      if (parameter.type === "Object") {
        objectName = nestedName.propertyName
        nestedName.propertyName = null
      } else if (parameter.type === "Array") {
        objectName = nestedName.propertyName
        nestedName.propertyName = null
        result.topLevelRefType = "array"
      }
      result.topLevelRef = objectName
    }

    definitions[objectName] = definitions[objectName] || {
      properties: {},
      required: [],
    }

    if (nestedName.propertyName) {
      let prop = {
        type: (parameter.type || "").toLowerCase(),
        description: removeTags(parameter.description),
      }
      if (parameter.type === "Object") {
        prop.$ref = "#/definitions/" + parameter.field
      }

      let typeIndex = type.indexOf("[]")
      if (typeIndex !== -1 && typeIndex === type.length - 2) {
        prop.type = "array"
        prop.items = {
          type: type.slice(0, type.length - 2),
        }
      }

      definitions[objectName]["properties"][nestedName.propertyName] = prop
      if (!parameter.optional) {
        let arr = definitions[objectName]["required"]
        if (arr.indexOf(nestedName.propertyName) === -1) {
          arr.push(nestedName.propertyName)
        }
      }
    }
  }

  return result
}

function createNestedName(field) {
  let propertyName = field
  let objectName
  let propertyNames = field.split(".")
  if (propertyNames && propertyNames.length > 1) {
    propertyName = propertyNames[propertyNames.length - 1]
    propertyNames.pop()
    objectName = propertyNames.join(".")
  }

  return {
    propertyName: propertyName,
    objectName: objectName,
  }
}

/**
 * Generate get, delete method output
 * @param verbs
 * @param definitions
 * @returns {{}}
 */
function createGetDeleteOutput(verbs, definitions) {
  let pathItemObject = {}
  verbs.type = verbs.type === "del" ? "delete" : verbs.type

  let verbDefinitionResult = createVerbDefinitions(verbs, definitions)
  pathItemObject[verbs.type] = {
    tags: [verbs.group],
    summary: removeTags(verbs.description),
    consumes: ["application/json"],
    produces: ["application/json"],
    parameters: createPathParameters(verbs),
  }
  if (verbDefinitionResult.topLevelSuccessRef) {
    pathItemObject[verbs.type].responses = {
      200: {
        description: "successful operation",
        schema: {
          type: verbDefinitionResult.topLevelSuccessRefType,
          items: {
            $ref: "#/definitions/" + verbDefinitionResult.topLevelSuccessRef,
          },
        },
      },
    }
  }
  return pathItemObject
}

/**
 * Iterate through all method parameters and create array of parameter objects which are stored as path parameters
 * @param verbs
 * @returns {Array}
 */
function createPathParameters(verbs) {
  let pathItemObject = []
  if (verbs.parameter && verbs.parameter.fields.Parameter) {
    for (let i = 0; i < verbs.parameter.fields.Parameter.length; i++) {
      let param = verbs.parameter.fields.Parameter[i]
      let field = param.field
      let type = param.type
      pathItemObject.push({
        name: field,
        in: type === "file" ? "formData" : "path",
        required: !param.optional,
        type: param.type.toLowerCase(),
        description: removeTags(param.description),
      })
    }
  }
  return pathItemObject
}

function groupByUrl(apidocJson) {
  return _.chain(apidocJson)
    .groupBy("url")
    .toPairs()
    .map(function (element) {
      return _.zipObject(["url", "verbs"], element)
    })
    .value()
}

module.exports = toSwagger
