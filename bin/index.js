#!/usr/bin/env node

const mri = require('mri')

const { _, ...flags } = mri(process.argv.slice(2), {
  boolean: ['upsert'],
  default: {
    token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
    upsert: false
  }
})

if (flags.help) {
  console.log(require('fs').readFileSync('./help.txt', 'utf8'))
  process.exit(0)
}

const required = ['name', 'owner', 'repo', 'token']
const missing = required.filter(key => flags[key] === undefined)
if (missing.length > 0) {
  throw new TypeError(`Missing flags: ${missing.join(', ')}`)
}

Promise.resolve(require('../src')(flags))
  .then(result => {
    if (flags.value === undefined) {
      console.log(result)
    }
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
