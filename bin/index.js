#!/usr/bin/env node

const mri = require('mri')

const { _, ...flags } = mri(process.argv.slice(2), {
  default: {
    token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN
  }
})

if (flags.help) {
  console.log(require('fs').readFileSync('./help.txt', 'utf8'))
  process.exit(0)
}

const required = ['name', 'value', 'owner', 'repo', 'token']
const missing = required.filter(key => process.env[key] === undefined)
if (missing.length > 0) { throw new TypeError(`Missing flags: ${missing.join(', ')}`) }

Promise.resolve(require('..')(flags))
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
