import { exec, spawn } from "child_process"
import { promisify } from "util"
import * as crypto from "crypto"
import * as path from "path"
import * as fs from "fs"
import { blue, red } from "chalk"
import ora from "ora"

const execAsync = promisify(exec)

export interface DockerConfig {
  containerName: string
  volumeName: string
  internalApiKey: string
  adminEmail: string
  adminPassword: string
}

export function generateDockerConfig(): DockerConfig {
  const randomSuffix = crypto.randomBytes(4).toString("hex")
  return {
    containerName: `budibase-upgrade-test-${randomSuffix}`,
    volumeName: `budibase-upgrade-data-${randomSuffix}`,
    internalApiKey: "budibase",
    adminEmail: "admin@example.com",
    adminPassword: "admin123!",
  }
}

export async function containerExists(containerName: string): Promise<boolean> {
  try {
    await execAsync(`docker inspect ${containerName}`)
    return true
  } catch {
    return false
  }
}

export async function stopContainer(
  containerName: string,
  silent = false
): Promise<void> {
  if (!silent) {
    const spinner = ora(`Stopping container ${blue(containerName)}`).start()
    try {
      await execAsync(`docker stop ${containerName}`)
      spinner.succeed(`Container ${blue(containerName)} stopped`)
    } catch (error) {
      spinner.warn(`Container ${blue(containerName)} was not running`)
    }
  } else {
    try {
      await execAsync(`docker stop ${containerName}`)
    } catch {
      // Silently ignore
    }
  }
}

export async function removeContainer(
  containerName: string,
  silent = false
): Promise<void> {
  if (!silent) {
    const spinner = ora(`Removing container ${blue(containerName)}`).start()
    try {
      await execAsync(`docker rm ${containerName}`)
      spinner.succeed(`Container ${blue(containerName)} removed`)
    } catch (error) {
      spinner.warn(`Container ${blue(containerName)} did not exist`)
    }
  } else {
    try {
      await execAsync(`docker rm ${containerName}`)
    } catch {
      // Silently ignore
    }
  }
}

export async function removeVolume(
  volumeName: string,
  silent = false
): Promise<void> {
  if (!silent) {
    const spinner = ora(`Removing volume ${blue(volumeName)}`).start()
    try {
      await execAsync(`docker volume rm ${volumeName}`)
      spinner.succeed(`Volume ${blue(volumeName)} removed`)
    } catch (error) {
      spinner.warn(`Volume ${blue(volumeName)} did not exist`)
    }
  } else {
    try {
      await execAsync(`docker volume rm ${volumeName}`)
    } catch {
      // Silently ignore
    }
  }
}

export async function createVolume(volumeName: string): Promise<void> {
  const spinner = ora(`Creating volume ${blue(volumeName)}`).start()
  await execAsync(`docker volume create ${volumeName}`)
  spinner.succeed(`Volume ${blue(volumeName)} created`)
}

export async function getContainerPort(containerName: string): Promise<number> {
  const { stdout } = await execAsync(`docker port ${containerName} 80`)
  const port = stdout.split(":")[1]
  return parseInt(port, 10)
}

export async function getContainerHealth(
  containerName: string
): Promise<string> {
  try {
    const { stdout } = await execAsync(
      `docker inspect --format={{.State.Health.Status}} ${containerName}`
    )
    return stdout.trim()
  } catch {
    return "unknown"
  }
}

export async function getContainerStatus(
  containerName: string
): Promise<string> {
  try {
    const { stdout } = await execAsync(
      `docker inspect --format={{.State.Status}} ${containerName}`
    )
    return stdout.trim()
  } catch {
    return "unknown"
  }
}

export async function getContainerLogs(
  containerName: string,
  lines = 100
): Promise<string> {
  const { stdout } = await execAsync(
    `docker logs --tail ${lines} ${containerName}`
  )
  return stdout
}

export interface RunContainerOptions {
  containerName: string
  volumeName: string
  image: string
  env: Record<string, string>
}

export async function runContainer(
  options: RunContainerOptions
): Promise<void> {
  const args = [
    "run",
    "-d",
    "--name",
    options.containerName,
    "-P", // Publish all exposed ports to random ports
  ]

  // Add environment variables
  for (const [key, value] of Object.entries(options.env)) {
    args.push("-e", `${key}=${value}`)
  }

  // Add volume
  args.push("-v", `${options.volumeName}:/data`)

  // Add image
  args.push(options.image)

  // Use spawn for better control over the command
  return new Promise((resolve, reject) => {
    const dockerProcess = spawn("docker", args)

    let stderr = ""
    dockerProcess.stderr.on("data", data => {
      stderr += data.toString()
    })

    dockerProcess.on("close", code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Docker run failed with code ${code}: ${stderr}`))
      }
    })

    dockerProcess.on("error", reject)
  })
}

export async function buildCurrentVersion(projectRoot: string): Promise<void> {
  // Verify the directory exists
  const dockerfilePath = path.join(projectRoot, "hosting/single/Dockerfile")
  if (!fs.existsSync(dockerfilePath)) {
    throw new Error(
      `Invalid project root: ${projectRoot} - Dockerfile not found at ${dockerfilePath}`
    )
  }

  // Build the project
  const buildSpinner = ora("Building project with yarn").start()

  try {
    await execAsync("yarn build --ignore @budibase/upgrade-tests", {
      cwd: projectRoot,
    })
    buildSpinner.succeed("Project built successfully")
  } catch (error) {
    buildSpinner.fail("Failed to build project")
    throw error
  }

  // Then build the Docker image
  const dockerSpinner = ora("Building Docker image").start()

  const args = [
    "build",
    "-f",
    "hosting/single/Dockerfile",
    "-t",
    "budibase:current",
    "--build-arg",
    "BUDIBASE_VERSION=0.0.0+local",
    "--build-arg",
    "TARGETBUILD=single",
    ".",
  ]

  return new Promise((resolve, reject) => {
    const buildProcess = spawn("docker", args, {
      cwd: projectRoot,
      stdio: ["inherit", "pipe", "pipe"],
    })

    let stderr = ""
    buildProcess.stderr.on("data", data => {
      stderr += data.toString()
    })

    buildProcess.on("close", code => {
      if (code === 0) {
        dockerSpinner.succeed("Docker image built successfully")
        resolve()
      } else {
        dockerSpinner.fail("Failed to build Docker image")
        reject(
          new Error(
            `Command failed with exit code ${code}: docker ${args.join(" ")}\n${stderr}`
          )
        )
      }
    })

    buildProcess.on("error", error => {
      dockerSpinner.fail("Failed to build Docker image")
      reject(error)
    })
  })
}

export async function waitForHealthy(
  containerName: string,
  maxAttempts = 90
): Promise<void> {
  const spinner = ora("Waiting for Budibase to be healthy").start()
  let attempt = 0

  while (attempt < maxAttempts) {
    const health = await getContainerHealth(containerName)

    if (health === "healthy") {
      spinner.succeed("Budibase is healthy!")
      return
    }

    const status = await getContainerStatus(containerName)
    if (status !== "running") {
      spinner.fail(`Container stopped unexpectedly with status: ${status}`)
      const logs = await getContainerLogs(containerName)
      console.error(red("\nContainer logs:"))
      console.error(logs)
      throw new Error("Container failed to start")
    }

    attempt++
    if (attempt % 10 === 0) {
      spinner.text = `Still waiting... (${attempt}/${maxAttempts}) - Health: ${health}`
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  spinner.fail("Budibase failed to become healthy")
  const logs = await getContainerLogs(containerName)
  console.error(red("\nContainer logs:"))
  console.error(logs)
  throw new Error("Container failed to become healthy")
}
