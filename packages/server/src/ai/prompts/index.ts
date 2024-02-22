export function generateSQL(prompt: string, tableSchema: string) {
  return `Given the table schema:\n${tableSchema}\n\nGenerate a SQL query for the following request:\n${prompt}.\n Only provide the SQL.`
}

export function generateBudibaseTable(prompt: string) {
  const exampleTable = {
    "_id": "ta_40ccfc10f02f46d9be53551bd121d4c2",
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
    "sourceId": "bb_internal",
    "sourceType": "internal",
    "views": {},
    "createdAt": "2024-01-02T13:29:24.592Z",
    "updatedAt": "2024-01-02T13:29:44.862Z",
    "indexes": [],
    "primaryDisplay": "name"
  }
  return `Given this custom schema as an example:\n ${JSON.stringify(exampleTable, undefined, 2)} \ngenerate me a similar structure based on the following prompt:\n ${prompt}\n Only generate the JSON.`
}

// export const sqlGeneration = () => {
//
// }
