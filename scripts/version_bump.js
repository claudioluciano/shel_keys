const fs = require('fs-extra')
const { execSync } = require('child_process')

async function resolveVersionBump () {
  const nextVersion = process.argv[2]

  const packageJson = require('../package.json')
  const tauriJson = require('../src-tauri/tauri.conf.json')

  packageJson.version = nextVersion
  tauriJson.package.version = nextVersion.replace('v', '')

  await fs.writeFile(
    './package.json',
    JSON.stringify(packageJson, undefined, 2)
  )
  await fs.writeFile(
    './src-tauri/tauri.conf.json',
    JSON.stringify(tauriJson, undefined, 2)
  )

  execSync('git add ./package.json')
  execSync('git add ./src-tauri/tauri.conf.json')
  execSync(`git commit -m "v${nextVersion}"`)
  execSync(`git tag -a ${nextVersion} -m "${nextVersion}"`)
  execSync('git push')
  execSync(`git push origin ${nextVersion}`)
  console.log('Publish Successfully...')
}

resolveVersionBump()
