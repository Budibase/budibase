const yaml = require("js-yaml") 
const fs = require("fs")
const path = require("path")

const CHART_PATH = path.join(__dirname, "../", "charts", "budibase", "Chart.yaml")
const UPGRADE_VERSION = process.env.BUDIBASE_RELEASE_VERSION

if (!UPGRADE_VERSION) {
	throw new Error("BUDIBASE_RELEASE_VERSION env var must be set.")
}

try {
	const chartFile = fs.readFileSync(CHART_PATH, "utf-8")
	const chart = yaml.load(chartFile)

	// Upgrade app version in chart to match budibase release version
	chart.appVersion = UPGRADE_VERSION

	// semantically version the chart
	const [major, minor, patch] = chart.version.split(".")
	const newPatch = parseInt(patch) + 1
	chart.version = [major, minor, newPatch].join(".")
	const updatedChartYaml = yaml.dump(chart)
	fs.writeFileSync(CHART_PATH, updatedChartYaml)
} catch (err) {
	console.error("Error releasing helm chart")
	throw err
}
