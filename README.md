# github-create-secret

![Last version](https://img.shields.io/github/tag/kikobeats/github-create-secret.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/kikobeats/github-create-secret.svg?style=flat-square)](https://coveralls.io/github/kikobeats/github-create-secret)
[![NPM Status](https://img.shields.io/npm/dm/github-create-secret.svg?style=flat-square)](https://www.npmjs.org/package/github-create-secret)

**github-create-secret** is the simplest way to create or refresh a GitHub
Actions secret.

It is especially handy for the boring maintenance task every npm publisher has:
rotating `NPM_TOKEN` across all the GitHub repositories that publish packages.
Instead of opening each repository settings page, encrypting the value yourself,
and replacing the secret manually, this package talks to GitHub's Actions
Secrets API for you.

## Quick Start

Create a repository secret from the command line:

```
GH_TOKEN=ghp_xxx npx github-create-secret \
  --owner Kikobeats \
  --repo test \
  --name NPM_TOKEN \
  --value npm_xxx
```

Refresh an existing secret by enabling `--upsert`:

```
GH_TOKEN=ghp_xxx npx github-create-secret \
  --owner Kikobeats \
  --repo test \
  --name NPM_TOKEN \
  --value npm_xxx \
  --upsert
```

Alternatively, it can be used as Node.js module:

```js
const createSecret = require('github-create-secret')

async function main () {
  await createSecret({
    owner: 'Kikobeats',
    repo: 'test',
    token: process.env.GH_TOKEN,
    name: 'NPM_TOKEN',
    value: process.env.NPM_TOKEN,
    upsert: true
  })
}

main()
```

## Refreshing NPM_TOKEN

The usual workflow is:

1. Create a fresh npm automation token.
2. Export it as `NPM_TOKEN`.
3. Export a GitHub token as `GH_TOKEN`.
4. Update every repository that already depends on that secret.

`github-create-secret` makes step 4 small enough to keep as a script:

```js
import createSecret from 'github-create-secret'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GH_TOKEN })

async function list (username) {
  const repos = await octokit.paginate(
    octokit.rest.repos.listForAuthenticatedUser,
    {
      username,
      per_page: 100,
      type: 'all'
    }
  )

  return repos.filter(repo =>
    !repo.fork &&
    !repo.archived &&
    repo.owner.login === username
  )
}

const updateNpmToken = (repo, opts) =>
  createSecret({
    owner: repo.owner.login,
    repo: repo.name,
    token: process.env.GH_TOKEN,
    name: 'NPM_TOKEN',
    ...opts
  })

async function main () {
  const { data: user } = await octokit.rest.users.getAuthenticated()
  const repositories = await list(user.login)

  console.log(
    `${process.argv.includes('--apply') ? 'Applying' : 'Checking'} ` +
    'NPM_TOKEN for ' +
    `${repositories.length} repositories`
  )

  for (const repo of repositories) {
    if (!await updateNpmToken(repo)) continue

    if (process.argv.includes('--apply')) {
      await updateNpmToken(repo, {
        value: process.env.NPM_TOKEN,
        upsert: true
      })
    }

    console.log(
      `https://github.com/${repo.full_name} ` +
      `${process.argv.includes('--apply') ? 'updated' : 'would be updated'}`
    )
  }
}

main()
```

Run it with:

```
GH_TOKEN=ghp_xxx NPM_TOKEN=npm_xxx node update-npm-token.js
GH_TOKEN=ghp_xxx NPM_TOKEN=npm_xxx node update-npm-token.js --apply
```

When `value` is omitted, `github-create-secret` only checks whether the secret
exists. That lets the script refresh repositories that already publish to npm
without creating `NPM_TOKEN` in unrelated projects. When `upsert` is true, the
same call replaces the encrypted secret value. The script runs as a dry run by
default; pass `--apply` to write the new token to GitHub.

## API

```js
const createSecret = require('github-create-secret')

async function main () {
  await createSecret({
    owner: 'Kikobeats',
    repo: 'test',
    token: process.env.GH_TOKEN,
    name: 'NPM_TOKEN',
    value: process.env.NPM_TOKEN,
    upsert: true
  })
}

main()
```

- `owner`: GitHub user or organization.
- `repo`: Repository name.
- `token`: GitHub token with permission to manage Actions secrets.
- `name`: Secret name.
- `value`: Secret value. If omitted, the call returns whether the secret exists.
- `upsert`: Replace the secret when it already exists.

## License

**github-create-secret** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/kikobeats/github-create-secret/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/kikobeats/github-create-secret/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/kikobeats) · Twitter [@kikobeats](https://twitter.com/kikobeats)
