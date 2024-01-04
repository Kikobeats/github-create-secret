/* eslint-disable camelcase */

'use strict'

const sodium = require('libsodium-wrappers')

const createGithubAPI =
  token =>
    async (url, { headers, ...opts } = {}) => {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          ...headers
        },
        ...opts
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const error = new Error(
        `${payload?.message} – See ${payload?.documentation_url}`
        )
        error.name = 'GitHubError'
        throw error
      }

      return payload
    }

const encrypt = async ({ key, value }) => {
  await sodium.ready
  // Convert Secret & Base64 key to Uint8Array.
  const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
  const binsec = sodium.from_string(value)
  // Encrypt the secret using LibSodium
  const encBytes = sodium.crypto_box_seal(binsec, binkey)
  // Convert encrypted Uint8Array to Base64
  return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
}

module.exports = async ({ name, secret: value, owner, repo, token }) => {
  const githubAPI = createGithubAPI(token)
  const { key, key_id } = await githubAPI(
    `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`
  )
  const encrypted_value = await encrypt({ key, value })
  return githubAPI(
    `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${name}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        encrypted_value,
        key_id
      })
    }
  )
}
