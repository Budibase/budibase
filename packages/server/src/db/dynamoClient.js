let _ = require("lodash")
let environment = require("../environment")

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
      params = _.merge(params, otherProps)
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
    if (otherProps) {
      params = _.merge(params, otherProps)
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
      params = _.merge(params, otherProps)
    }
    return docClient.put(params).promise()
  }
}

exports.init = () => {
  if (!environment.CLOUD) {
    return
  }
  let AWS = require("aws-sdk")
  let docClientParams = {
    correctClockSkew: true,
  }
  if (environment.DYNAMO_ENDPOINT) {
    docClientParams.endpoint = environment.DYNAMO_ENDPOINT
  }
  docClient = new AWS.DynamoDB.DocumentClient(docClientParams)
}

exports.apiKeyTable = new Table(TableInfo.API_KEYS)
exports.userTable = new Table(TableInfo.USERS)
