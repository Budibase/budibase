#!/usr/bin/env node
const { Client } = require("pg")

let client

// Connect
async function connect() {
  client = new Client({
    host: "localhost",
    port: 5432,
    database: "test",
    user: "postgres",
    password: "root",
  })
  await client.connect()
}

async function insertData() {
  const data = [{ id: 1 }, { id: 3 }]
  let sql = ""
  for (let item of data) {
    sql += `INSERT INTO test(id) VALUES(${item.id}); \n`
  }
  console.log(sql)
  await client.query(sql)
}

// Fills up a postgres database
async function run() {
  await connect()

  // Drops table
  await client.query("DROP TABLE IF EXISTS test")

  // Creates new table
  await client.query(`CREATE TABLE "test" ("id" serial, PRIMARY KEY ("id"))`)

  // Insert some data
  await insertData()

  const res = await client.query("SELECT * from test")
  console.log(res.rows)
  await client.end()
}

run()
