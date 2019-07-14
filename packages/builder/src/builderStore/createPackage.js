import {createNewHierarchy} from "../common/core";

export const createPackage = (packageInfo, database) => {
    packageInfo.createNewPackage("");
    const root = createNewHierarchy();
    database.importAppDefinition({
      hierarchy:root,
      actions:[],
      triggers:[],
      accessLevels: [],
      accessLevelsVersion: 0
    });
};

const testroot = {
  "name": "root",
  "type": "root",
  "children": [
    {
      "name": "settings",
      "type": "record",
      "fields": [
        {
          "name": "appName",
          "type": "string",
          "typeOptions": {
            "maxLength": null,
            "values": null,
            "allowDeclaredValuesOnly": false
          },
          "label": "appName",
          "getInitialValue": "default",
          "getUndefinedValue": "default"
        }
      ],
      "children": [],
      "validationRules": [],
      "nodeId": 1,
      "indexes": [],
      "allidsShardFactor": 64,
      "collectionName": "",
      "isSingle": true
    },
    {
      "name": "customer",
      "type": "record",
      "fields": [
        {
          "name": "surname",
          "type": "string",
          "typeOptions": {
            "maxLength": null,
            "values": null,
            "allowDeclaredValuesOnly": false
          },
          "label": "surname",
          "getInitialValue": "default",
          "getUndefinedValue": "default"
        },
        {
          "name": "isalive",
          "type": "bool",
          "typeOptions": {
            "allowNulls": true
          },
          "label": "isalive",
          "getInitialValue": "true",
          "getUndefinedValue": "default"
        },
        {
          "name": "createddate",
          "type": "datetime",
          "typeOptions": {
            "maxValue": "+275760-09-13T00:00:00.000Z",
            "minValue": "-271821-04-20T00:00:00.000Z"
          },
          "label": "createddate",
          "getInitialValue": "default",
          "getUndefinedValue": "default"
        },
        {
          "name": "age",
          "type": "number",
          "typeOptions": {
            "maxValue": 9007199254740991,
            "minValue": -9007199254740991,
            "decimalPlaces": 0
          },
          "label": "age",
          "getInitialValue": "default",
          "getUndefinedValue": "default"
        },
        {
          "name": "profilepic",
          "type": "file",
          "typeOptions": {},
          "label": "profilepic",
          "getInitialValue": "default",
          "getUndefinedValue": "default"
        },
        {
          "name": "partner",
          "type": "reference",
          "typeOptions": {
            "indexNodeKey": "/partnersReference",
            "displayValue": "name",
            "reverseIndexNodeKeys": [
              "/partners/4-{id}/partnerCustomers"
            ]
          },
          "label": "partner",
          "getInitialValue": "default",
          "getUndefinedValue": "default"
        },
        {
          "name": "referredBy",
          "type": "reference",
          "typeOptions": {
            "indexNodeKey": "/customer_index",
            "displayValue": "surname",
            "reverseIndexNodeKeys": [
              "/customers/2-{id}/referredToCustomers"
            ]
          },
          "label": "referredBy",
          "getInitialValue": "default",
          "getUndefinedValue": "default"
        }
      ],
      "children": [
        {
          "name": "invoice",
          "type": "record",
          "fields": [
            {
              "name": "totalIncVat",
              "type": "number",
              "typeOptions": {
                "maxValue": 9007199254740991,
                "minValue": -9007199254740991,
                "decimalPlaces": 2
              },
              "label": "totalIncVat",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            },
            {
              "name": "createdDate",
              "type": "datetime",
              "typeOptions": {
                "maxValue": "+275760-09-13T00:00:00.000Z",
                "minValue": "-271821-04-20T00:00:00.000Z"
              },
              "label": "createdDate",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            },
            {
              "name": "paidAmount",
              "type": "number",
              "typeOptions": {
                "maxValue": 9007199254740991,
                "minValue": -9007199254740991,
                "decimalPlaces": 0
              },
              "label": "paidAmount",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            },
            {
              "name": "invoiceType",
              "type": "string",
              "typeOptions": {
                "maxLength": null,
                "values": null,
                "allowDeclaredValuesOnly": false
              },
              "label": "invoiceType",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            },
            {
              "name": "isWrittenOff",
              "type": "bool",
              "typeOptions": {
                "allowNulls": true
              },
              "label": "isWrittenOff",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            },
            {
              "name": "customer",
              "type": "reference",
              "typeOptions": {
                "indexNodeKey": "/customersReference",
                "reverseIndexNodeKeys": [
                  "/customers/2-{id}/invoice_index"
                ],
                "displayValue": "name"
              },
              "label": "customer",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            }
          ],
          "children": [
            {
              "name": "charge",
              "type": "record",
              "fields": [
                {
                  "name": "amount",
                  "type": "number",
                  "typeOptions": {
                    "maxValue": 9007199254740991,
                    "minValue": -9007199254740991,
                    "decimalPlaces": 0
                  },
                  "label": "amount",
                  "getInitialValue": "default",
                  "getUndefinedValue": "default"
                },
                {
                  "name": "partnerInvoice",
                  "type": "reference",
                  "typeOptions": {
                    "reverseIndexNodeKeys": [
                      "/partners/4-{id}/invoices/6-{id}/partnerCharges"
                    ],
                    "displayValue": "createdDate",
                    "indexNodeKey": "/partners/4-{id}/partnerInvoices_index"
                  },
                  "label": "partnerInvoice",
                  "getInitialValue": "default",
                  "getUndefinedValue": "default"
                }
              ],
              "children": [],
              "validationRules": [],
              "nodeId": 10,
              "indexes": [],
              "allidsShardFactor": 1,
              "collectionName": "charges",
              "isSingle": false
            }
          ],
          "validationRules": [],
          "nodeId": 8,
          "indexes": [
            {
              "name": "charge_index",
              "type": "index",
              "map": "return {...record};",
              "filter": "",
              "indexType": "ancestor",
              "getShardName": "",
              "getSortKey": "record.id",
              "aggregateGroups": [],
              "allowedRecordNodeIds": [
                10
              ],
              "nodeId": 11
            }
          ],
          "allidsShardFactor": 1,
          "collectionName": "invoices",
          "isSingle": false
        }
      ],
      "validationRules": [],
      "nodeId": 2,
      "indexes": [
        {
          "name": "invoice_index",
          "type": "index",
          "map": "return {createdDate: record.createdDate, totalIncVat: record.totalIncVat};",
          "filter": "",
          "indexType": "ancestor",
          "getShardName": "",
          "getSortKey": "record.id",
          "aggregateGroups": [],
          "allowedRecordNodeIds": [
            8
          ],
          "nodeId": 9
        },
        {
          "name": "referredToCustomers",
          "type": "index",
          "map": "return {...record};",
          "filter": "",
          "indexType": "reference",
          "getShardName": "return !record.surname ? 'null' : record.surname.substring(0,1);",
          "getSortKey": "record.id",
          "aggregateGroups": [],
          "allowedRecordNodeIds": [
            2
          ],
          "nodeId": 14
        },
        {
          "name": "invoicesByOutstanding",
          "type": "index",
          "map": "return {...record};",
          "filter": "",
          "indexType": "ancestor",
          "getShardName": "return (record.totalIncVat > record.paidAmount ? 'outstanding' : 'paid');",
          "getSortKey": "record.id",
          "aggregateGroups": [
            {
              "name": "all_invoices_by_type",
              "type": "aggregateGroup",
              "groupBy": "return record.invoiceType",
              "aggregates": [
                {
                  "name": "totalIncVat",
                  "aggregatedValue": "return record.totalIncVat"
                }
              ],
              "condition": "",
              "nodeId": 26
            }
          ],
          "allowedRecordNodeIds": [
            6,
            8
          ],
          "nodeId": 25
        }
      ],
      "allidsShardFactor": 64,
      "collectionName": "customers",
      "isSingle": false
    },
    {
      "name": "partner",
      "type": "record",
      "fields": [
        {
          "name": "businessName",
          "type": "string",
          "typeOptions": {
            "maxLength": null,
            "values": null,
            "allowDeclaredValuesOnly": false
          },
          "label": "businessName",
          "getInitialValue": "default",
          "getUndefinedValue": "default"
        }
      ],
      "children": [
        {
          "name": "invoice",
          "type": "record",
          "fields": [
            {
              "name": "totalIncVat",
              "type": "number",
              "typeOptions": {
                "maxValue": 9007199254740991,
                "minValue": -9007199254740991,
                "decimalPlaces": 2
              },
              "label": "totalIncVat",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            },
            {
              "name": "createdDate",
              "type": "datetime",
              "typeOptions": {
                "maxValue": "+275760-09-13T00:00:00.000Z",
                "minValue": "-271821-04-20T00:00:00.000Z"
              },
              "label": "createdDate",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            },
            {
              "name": "paidAmount",
              "type": "number",
              "typeOptions": {
                "maxValue": 9007199254740991,
                "minValue": -9007199254740991,
                "decimalPlaces": 0
              },
              "label": "paidAmount",
              "getInitialValue": "default",
              "getUndefinedValue": "default"
            }
          ],
          "children": [],
          "validationRules": [],
          "nodeId": 6,
          "indexes": [
            {
              "name": "partnerCharges",
              "type": "index",
              "map": "return {...record};",
              "filter": "",
              "indexType": "reference",
              "getShardName": "",
              "getSortKey": "record.id",
              "aggregateGroups": [],
              "allowedRecordNodeIds": [
                {
                  "name": "charge",
                  "type": "record",
                  "fields": [
                    {
                      "name": "amount",
                      "type": "number",
                      "typeOptions": {
                        "maxValue": 9007199254740991,
                        "minValue": -9007199254740991,
                        "decimalPlaces": 0
                      },
                      "label": "amount",
                      "getInitialValue": "default",
                      "getUndefinedValue": "default"
                    },
                    {
                      "name": "partnerInvoice",
                      "type": "reference",
                      "typeOptions": {
                        "reverseIndexNodeKeys": [
                          "/partners/4-{id}/invoices/6-{id}/partnerCharges"
                        ],
                        "displayValue": "createdDate",
                        "indexNodeKey": "/partners/4-{id}/partnerInvoices_index"
                      },
                      "label": "partnerInvoice",
                      "getInitialValue": "default",
                      "getUndefinedValue": "default"
                    }
                  ],
                  "children": [],
                  "validationRules": [],
                  "nodeId": 10,
                  "indexes": [],
                  "allidsShardFactor": 1,
                  "collectionName": "charges",
                  "isSingle": false
                }
              ],
              "nodeId": 15
            }
          ],
          "allidsShardFactor": 1,
          "collectionName": "invoices",
          "isSingle": false
        }
      ],
      "validationRules": [],
      "nodeId": 4,
      "indexes": [
        {
          "name": "partnerInvoices_index",
          "type": "index",
          "map": "return {...record};",
          "filter": "",
          "indexType": "ancestor",
          "getShardName": "",
          "getSortKey": "record.id",
          "aggregateGroups": [],
          "allowedRecordNodeIds": [
            6
          ],
          "nodeId": 7
        },
        {
          "name": "partnerCustomers",
          "type": "index",
          "map": "return {...record};",
          "filter": "record.isalive === true",
          "indexType": "reference",
          "getShardName": "",
          "getSortKey": "record.id",
          "aggregateGroups": [],
          "allowedRecordNodeIds": [
            2
          ],
          "nodeId": 13
        }
      ],
      "allidsShardFactor": 64,
      "collectionName": "partners",
      "isSingle": false
    }
  ],
  "pathMaps": [],
  "indexes": [
    {
      "name": "customer_index",
      "type": "index",
      "map": "return record;",
      "filter": "",
      "indexType": "ancestor",
      "getShardName": "",
      "getSortKey": "record.id",
      "aggregateGroups": [
        {
          "name": "Customers Summary",
          "type": "aggregateGroup",
          "groupBy": "",
          "aggregates": [
            {
              "name": "all customers - age breakdown",
              "aggregatedValue": "return record.age"
            }
          ],
          "condition": "",
          "nodeId": 24
        }
      ],
      "allowedRecordNodeIds": [
        2
      ],
      "nodeId": 3
    },
    {
      "name": "partner_index",
      "type": "index",
      "map": "return {...record};",
      "filter": "",
      "indexType": "ancestor",
      "getShardName": "",
      "getSortKey": "record.id",
      "aggregateGroups": [],
      "allowedRecordNodeIds": [
        4
      ],
      "nodeId": 5
    },
    {
      "name": "partnersReference",
      "type": "index",
      "map": "return {name:record.businessName};",
      "filter": "",
      "indexType": "ancestor",
      "getShardName": "",
      "getSortKey": "record.id",
      "aggregateGroups": [],
      "allowedRecordNodeIds": [
        4
      ],
      "nodeId": 12
    },
    {
      "name": "customersReference",
      "type": "index",
      "map": "return {name:record.surname}",
      "filter": "record.isalive === true",
      "indexType": "ancestor",
      "getShardName": "",
      "getSortKey": "record.id",
      "aggregateGroups": [],
      "allowedRecordNodeIds": [
        2
      ],
      "nodeId": 16
    },
    {
      "name": "deceased",
      "type": "index",
      "map": "return {surname: record.surname, age:record.age};",
      "filter": "record.isalive === false",
      "indexType": "ancestor",
      "getShardName": "",
      "getSortKey": "record.id",
      "aggregateGroups": [],
      "allowedRecordNodeIds": [
        2
      ],
      "nodeId": 17
    },
    {
      "name": "customer_invoices",
      "type": "index",
      "map": "return record;",
      "filter": "record.type === 'invoice'",
      "indexType": "ancestor",
      "getShardName": "",
      "getSortKey": "record.id",
      "aggregateGroups": [],
      "allowedRecordNodeIds": [
        8
      ],
      "nodeId": 18
    },
    {
      "name": "Outstanding Invoices",
      "type": "index",
      "map": "return {...record};",
      "filter": "record.type === 'invoice' && record.paidAmount < record.totalIncVat",
      "indexType": "ancestor",
      "getShardName": "",
      "getSortKey": "record.id",
      "aggregateGroups": [
        {
          "name": "all_invoices",
          "type": "aggregateGroup",
          "groupBy": "",
          "aggregates": [],
          "condition": "",
          "nodeId": 20
        },
        {
          "name": "all_invoices_by_type",
          "type": "aggregateGroup",
          "groupBy": "return record.invoiceType",
          "aggregates": [
            {
              "name": "totalIncVat",
              "aggregatedValue": "return record.totalIncVat"
            },
            {
              "name": "paidAmount",
              "aggregatedValue": "return record.paidAmount"
            }
          ],
          "condition": "",
          "nodeId": 21
        },
        {
          "name": "written_off",
          "type": "aggregateGroup",
          "groupBy": "return record.invoiceType",
          "aggregates": [
            {
              "name": "totalIncVat",
              "aggregatedValue": "return record.totalIncVat"
            }
          ],
          "condition": "record.isWrittenOff === true",
          "nodeId": 22
        }
      ],
      "allowedRecordNodeIds": [
        8,
        6
      ],
      "nodeId": 19
    },
    {
      "name": "customersBySurname",
      "type": "index",
      "map": "return {...record};",
      "filter": "",
      "indexType": "ancestor",
      "getShardName": "return !record.surname ? 'null' : record.surname.substring(0,1);",
      "getSortKey": "record.id",
      "aggregateGroups": [],
      "allowedRecordNodeIds": [
        2
      ],
      "nodeId": 23
    }
  ],
  "nodeId": 0
}