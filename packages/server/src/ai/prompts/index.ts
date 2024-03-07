export function generateSQL(prompt: string, tableSchema: string) {
  return `Given the table schema:\n${tableSchema}\n\nGenerate a SQL query for the following request:\n${prompt}.\n Only provide the SQL.`
}

export function generateCode(prompt: string) {
  return `Generate JavaScript code for the following request:\n${prompt}.\n Only provide the JS and nothing else.`
}

export function generateBudibaseTable(prompt: string) {
  const exampleTable = {
    "name": "test",
    "schema": {
      "name": {
        "type": "string",
        "constraints": {
          "type": "string",
          "length": {
            "maximum": null
          },
          "presence": false
        },
        "name": "name"
      },
      "age": {
        "type": "number",
        "name": "age",
        "constraints": {
          "type": "number",
          "presence": false,
          "numericality": {
            "greaterThanOrEqualTo": "",
            "lessThanOrEqualTo": ""
          }
        }
      }
    },
    "type": "table",
    "views": {},
    "indexes": [],
    "primaryDisplay": "name"
  }
  // return {
  //   system: `Your sole purpose is to genenerate JSON schemas based off prompts, with a structure like the following: \n ${JSON.stringify(exampleTable, undefined, 2)}. Only return the JSON`,
  //   user:
  // }
  return `Given this custom schema as an example:\n ${JSON.stringify(exampleTable, undefined, 2)} \ngenerate me a similar structure based on the following prompt:\n ${prompt}\n Only return the parseable output JSON, and nothing else.`
}

export function generateForm(prompt: string) {
  const formFields = [
    {
      "_id": "c7a746dd9e23642e193a03bb7a5f23f78",
      "_component": "@budibase/standard-components/stringfield",
      "_styles": {
        "normal": {},
        "hover": {},
        "active": {}
      },
      "_instanceName": "New Text Field",
      "disabled": false,
      "readonly": false,
      "align": "left",
      "span": 6,
      "field": "field1",
      "label": "Field1 Label"
    },
    {
      "_id": "cfcb1aebcaa21413f9fd11e20e9cc6f37",
      "_component": "@budibase/standard-components/stringfield",
      "_styles": {
        "normal": {},
        "hover": {},
        "active": {}
      },
      "_instanceName": "New Text Field",
      "disabled": false,
      "readonly": false,
      "align": "left",
      "span": 6,
      "field": "field2",
      "label": "Field2 Label"
    },
    {
      "_id": "c107659967b1d4ef4a6ae58e874f3c6b5",
      "_component": "@budibase/standard-components/numberfield",
      "_styles": {
        "normal": {},
        "hover": {},
        "active": {}
      },
      "_instanceName": "New Number Field",
      "disabled": false,
      "readonly": false,
      "span": 6,
      "label": "Field3",
      "placeholder": "",
      "field": "field3"
    }
  ]
  return `Given this array as an example:\n ${JSON.stringify(formFields, undefined, 2)} \ngenerate me a similar structure based on the following prompt:\n ${prompt}\n Only generate the JSON array.`
}