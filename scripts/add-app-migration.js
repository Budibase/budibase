const fs = require("fs")
const path = require("path")

const argv = require("yargs").demandOption(
  ["title"],
  "Please provide the required parameter: --title=[title]"
).argv

const { title } = argv

const generateTimestamp = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

const createMigrationFile = () => {
  const migrationFilename = `${generateTimestamp()}_${title
    .replace(/-/g, "_")
    .replace(/ /g, "_")}`
  const migrationsDir = "../packages/server/src/appMigrations"

  const template = `const migration = async () => {
  // Add your migration logic here
}

export default migration
`

  const newMigrationPath = path.join(
    migrationsDir,
    "migrations",
    `${migrationFilename}.ts`
  )
  fs.writeFileSync(path.resolve(__dirname, newMigrationPath), template)

  console.log(`New migration created: ${newMigrationPath}`)

  // Append the new migration to the main migrations file
  const migrationsFilePath = path.join(migrationsDir, "migrations.ts")

  const migrationDir = fs.readdirSync(
    path.join(__dirname, migrationsDir, "migrations")
  )
  const migrations = migrationDir
    .filter(m => m.endsWith(".ts"))
    .map(m => m.substring(0, m.length - 3))

  let migrationFileContent =
    '// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one\n\nimport { AppMigration } from "."\n\n'

  for (const migration of migrations) {
    migrationFileContent += `import m${migration} from "./migrations/${migration}"\n`
  }

  migrationFileContent += `\nexport const MIGRATIONS: AppMigration[] = [
  // Migrations will be executed sorted by id\n`

  for (const migration of migrations) {
    migrationFileContent += `  {
    id: "${migration}",
    func: m${migration}
  },\n`
  }

  migrationFileContent += `]\n`

  fs.writeFileSync(
    path.resolve(__dirname, migrationsFilePath),
    migrationFileContent
  )

  console.log(`Main migrations file updated: ${migrationsFilePath}`)
}

createMigrationFile()
