let { merge } = require("lodash")
let env = require("../environment")

const AWS_REGION = env.AWS_REGION ? env.AWS_REGION : "eu-west-1"

const TableInfo = {
  API_KEYS: {
    name: "beta-api-key-table",
    primary: "pk",
  },
  USERS: {
    name: "prod-budi-table",
    primary: "pk",
    sort: "sk",
  },
}

let docClient = null

class Table {
  constructor(tableInfo) {
    if (!tableInfo.name || !tableInfo.primary) {
      throw "Table info must specify a name and a primary key"
    }
    this._name = tableInfo.name
    this._primary = tableInfo.primary
    this._sort = tableInfo.sort
  }

  async get({ primary, sort, otherProps }) {
    let params = {
      TableName: this._name,
      Key: {
        [this._primary]: primary,
      },
    }
    if (this._sort && sort) {
      params.Key[this._sort] = sort
    }
    if (otherProps) {
      params = merge(params, otherProps)
    }
    let response = await docClient.get(params).promise()
    return response.Item
  }

  async update({
    primary,
    sort,
    expression,
    condition,
    names,
    values,
    exists,
    otherProps,
  }) {
    let params = {
      TableName: this._name,
      Key: {
        [this._primary]: primary,
      },
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      UpdateExpression: expression,
    }
    if (condition) {
      params.ConditionExpression = condition
    }
    if (this._sort && sort) {
      params.Key[this._sort] = sort
    }
    if (exists) {
      params.ExpressionAttributeNames["#PRIMARY"] = this._primary
      if (params.ConditionExpression) {
        params.ConditionExpression += " AND "
      }
      params.ConditionExpression += "attribute_exists(#PRIMARY)"
    }
    if (otherProps) {
      params = merge(params, otherProps)
    }
    return docClient.update(params).promise()
  }

  async put({ item, otherProps }) {
    if (
      item[this._primary] == null ||
      (this._sort && item[this._sort] == null)
    ) {
      throw "Cannot put item without primary and sort key (if required)"
    }
    let params = {
      TableName: this._name,
      Item: item,
    }
    if (otherProps) {
      params = merge(params, otherProps)
    }
    return docClient.put(params).promise()
  }
}

exports.init = endpoint => {
  let AWS = require("aws-sdk")
  AWS.config.update({
    region: AWS_REGION,
  })
  let docClientParams = {
    correctClockSkew: true,
  }
  if (endpoint) {
    docClientParams.endpoint = endpoint
  } else if (env.DYNAMO_ENDPOINT) {
    docClientParams.endpoint = env.DYNAMO_ENDPOINT
  }
  docClient = new AWS.DynamoDB.DocumentClient(docClientParams)
}

exports.apiKeyTable = new Table(TableInfo.API_KEYS)
exports.userTable = new Table(TableInfo.USERS)

if (env.isProd()) {
  exports.init(`https://dynamodb.${AWS_REGION}.amazonaws.com`)
} else {
  env._set("AWS_ACCESS_KEY_ID", "KEY_ID")
  env._set("AWS_SECRET_ACCESS_KEY", "SECRET_KEY")
  exports.init("http://localhost:8333")
}
