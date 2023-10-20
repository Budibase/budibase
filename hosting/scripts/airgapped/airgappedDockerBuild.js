const fs = require("fs")
const { execSync } = require("child_process")
const path = require("path")

const IS_SINGLE_IMAGE = process.env.SINGLE_IMAGE

let IMAGES = {
	worker: "budibase/worker",
	apps: "budibase/apps",
	proxy: "budibase/proxy",
	minio: "minio/minio",
	couch: "ibmcom/couchdb3",
	curl: "curlimages/curl",
	redis: "redis",
	watchtower: "containrrr/watchtower",
}

if (IS_SINGLE_IMAGE) {
	IMAGES = {
		budibase: "budibase/budibase"
	}
}

const FILES = {
	COMPOSE: "docker-compose.yaml",
	ENV: ".env"
}

const OUTPUT_DIR = path.join(__dirname, "../", "bb-airgapped")

function copyFile(file) {
	fs.copyFileSync(
		path.join(__dirname, "../", "../", file), 
		path.join(OUTPUT_DIR, file)
	)
}

// create output dir
console.log(`Creating ${OUTPUT_DIR} for build..`)
fs.rmdirSync(OUTPUT_DIR, { recursive: true })
fs.mkdirSync(OUTPUT_DIR)

// package images into tar files
for (let image in IMAGES) {
	console.log(`Creating tar for ${image}..`)
	execSync(`docker save ${IMAGES[image]} -o ${OUTPUT_DIR}/${image}.tar`)
}

// copy config files
if (!IS_SINGLE_IMAGE) {
	copyFile(FILES.COMPOSE)
}
copyFile(FILES.ENV)

// compress
execSync(`tar -czf bb-airgapped.tar.gz hosting/scripts/bb-airgapped`)