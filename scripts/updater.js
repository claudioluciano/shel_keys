/* eslint-disable camelcase */
const fetch = require('node-fetch')
const { getOctokit, context } = require('@actions/github')
const { resolveUpdateLog } = require('./update_log')

const UPDATE_TAG_NAME = 'updater'
const UPDATE_JSON_FILE = 'update.json'

async function resolveUpdater () {
  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error('GITHUB_TOKEN is required')
  }

  const options = { owner: context.repo.owner, repo: context.repo.repo }
  const github = getOctokit(process.env.GITHUB_TOKEN)

  const { data: tags } = await github.rest.repos.listTags({
    ...options,
    per_page: 10,
    page: 1
  })

  // get the latest publish tag
  const tag = tags.find((t) => t.name.startsWith('v'))

  const { data: latestRelease } = await github.rest.repos.getReleaseByTag({
    ...options,
    tag: tag.name
  })

  const updateData = {
    name: tag.name,
    notes: await resolveUpdateLog(tag.name), // use updatelog.md
    pub_date: new Date().toISOString(),
    platforms: {
      'darwin-intel': { signature: '', url: '' },
      'linux-x86_64': { signature: '', url: '' },
      'windows-x86_64': { signature: '', url: '' }
    }
  }

  const promises = latestRelease.assets.map(async (asset) => {
    const { name, browser_download_url } = asset

    // win64 url
    if (name.endsWith('.msi.zip')) {
      updateData.platforms.win64.url = browser_download_url
      updateData.platforms['windows-x86_64'].url = browser_download_url
    }
    // win64 signature
    if (name.endsWith('.msi.zip.sig')) {
      const sig = await getSignature(browser_download_url)
      updateData.platforms.win64.signature = sig
      updateData.platforms['windows-x86_64'].signature = sig
    }

    // darwin url (intel)
    if (name.endsWith('.app.tar.gz') && !name.includes('aarch')) {
      updateData.platforms.darwin.url = browser_download_url
      updateData.platforms['darwin-intel'].url = browser_download_url
    }
    // darwin signature (intel)
    if (name.endsWith('.app.tar.gz.sig') && !name.includes('aarch')) {
      const sig = await getSignature(browser_download_url)
      updateData.platforms.darwin.signature = sig
      updateData.platforms['darwin-intel'].signature = sig
    }

    // darwin url (aarch)
    if (name.endsWith('aarch.app.tar.gz')) {
      updateData.platforms['darwin-aarch64'].url = browser_download_url
    }
    // darwin signature (aarch)
    if (name.endsWith('aarch.app.tar.gz.sig')) {
      const sig = await getSignature(browser_download_url)
      updateData.platforms['darwin-aarch64'].signature = sig
    }

    // linux url
    if (name.endsWith('.AppImage.tar.gz')) {
      updateData.platforms.linux.url = browser_download_url
      updateData.platforms['linux-x86_64'].url = browser_download_url
    }
    // linux signature
    if (name.endsWith('.AppImage.tar.gz.sig')) {
      const sig = await getSignature(browser_download_url)
      updateData.platforms.linux.signature = sig
      updateData.platforms['linux-x86_64'].signature = sig
    }
  })

  await Promise.allSettled(promises)
  console.log(updateData)

  // maybe should test the signature as well
  // delete the null field
  Object.entries(updateData.platforms).forEach(([key, value]) => {
    if (!value.url) {
      console.log(`[Error]: failed to parse release for "${key}"`)
      delete updateData.platforms[key]
    }
  })

  let updateRelease = {}
  try {
    const { data } = await github.rest.repos.getReleaseByTag({
      ...options,
      tag: UPDATE_TAG_NAME
    })

    updateRelease = data
  } catch (error) {
    await github.rest.repos.createRelease({
      ...options,
      tag_name: UPDATE_TAG_NAME,
      name: 'Updater'
    })
  }

  // delete the old assets
  for (const asset of updateRelease.assets) {
    if (asset.name === UPDATE_JSON_FILE) {
      await github.rest.repos.deleteReleaseAsset({
        ...options,
        asset_id: asset.id
      })
    }
  }

  // upload new assets
  await github.rest.repos.uploadReleaseAsset({
    ...options,
    release_id: updateRelease.id,
    name: UPDATE_JSON_FILE,
    data: JSON.stringify(updateData, null, 2)
  })
}

// get the signature file content
async function getSignature (url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/octet-stream' }
  })

  return response.text()
}

resolveUpdater().catch(console.error)