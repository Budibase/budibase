const { masterAppPackage } = require("../utilities/createAppPackage")
const { mkdir, remove, pathExists, copy } = require("fs-extra")
const { runtimePackagesDirectory } = require("../utilities/runtimePackages")

const copyfolder = (source, destination) =>
  new Promise((resolve, reject) => {
    copy(source, destination, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

module.exports = async (context, bbMaster, latestAppsFolder) => {
  // create runtime folder
  // copy master into /master/latest
  if (await pathExists(runtimePackagesDirectory)) {
    try {
      await remove(runtimePackagesDirectory)
    } catch (err) {
      console.log(err)
    }
  }

  await mkdir(runtimePackagesDirectory)

  /*
    const allApps = await bbMaster
                            .indexApi
                            .listItems("/all_applications");    
    
    for(let app of allApps) {
        app.
    }
    */

  const apps = {
    _master: masterAppPackage(context),
  }

  return (appName, versionId) => {
    if (appName === "_master") {
      return apps[appName]
    }

    return apps[appName][versionId]
  }
}
