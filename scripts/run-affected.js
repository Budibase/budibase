/***
 * Running lerna with since and scope is not working as expected.
 * For example, running the command `yarn test --scope=@budibase/worker --since=master`, with changes only on `@budibase/backend-core` will not work as expected, as it does not analyse the dependencies properly. The actual `@budibase/worker` task will not be triggered.
 *
 * This script is using `lerna ls` to detect all the affected projects from a given commit, and if the scoped package is affected, the actual command will be executed.
 *
 * The current version of the script only supports a single project in the scope.
 */

const { execSync } = require("child_process")

const argv = require("yargs").demandOption(["task", "since", "scope"]).argv

const { task, since, scope } = argv

const affectedPackages = execSync(
  `yarn --silent nx show projects --affected -t ${task} --base=${since} --json`,
  {
    encoding: "utf-8",
  }
)

const packages = JSON.parse(affectedPackages)

const isAffected = packages.includes(scope)

if (isAffected) {
  console.log(`${scope} is affected. Running task "${task}"`)
  execSync(`yarn ${task} --scope=${scope}`, {
    stdio: "inherit",
  })
} else {
  console.log(`${scope} is not affected. Skipping task "${task}"`)
}
