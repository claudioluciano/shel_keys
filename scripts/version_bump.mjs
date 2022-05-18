import fs from 'fs-extra'
import { execSync } from 'child_process'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

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
  execSync(`git commit -m "${nextVersion}"`)
  execSync(`git tag -a ${nextVersion} -m "${nextVersion}"`)
  execSync('git push')
  execSync(`git push origin ${nextVersion} --force`)
  console.log('Publish Successfully...')
}

resolveVersionBump().catch(console.error)
