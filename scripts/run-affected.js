const { execSync } = require("child_process")

const argv = require("yargs").demandOption([
  "task",
  "since",
  "package-name",
]).argv

const { task, since, packageName } = argv

const affectedPackages = execSync(
  `yarn --silent lerna ls --since=${since} --json`,
  {
    encoding: "utf-8",
  }
)

const packages = JSON.parse(affectedPackages)

const isAffected = packages.some(pkg => pkg.name === packageName)

if (isAffected) {
  console.log(`${packageName} is affected. Running ${task}...`)
  execSync(`yarn ${task} --scope=${packageName}`, {
    stdio: "inherit",
  })
} else {
  console.log(`${packageName} is not affected. Skipping ${task}...`)
}
