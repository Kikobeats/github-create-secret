# github-create-secret

![Last version](https://img.shields.io/github/tag/kikobeats/github-create-secret.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/kikobeats/github-create-secret.svg?style=flat-square)](https://coveralls.io/github/kikobeats/github-create-secret)
[![NPM Status](https://img.shields.io/npm/dm/github-create-secret.svg?style=flat-square)](https://www.npmjs.org/package/github-create-secret)

**github-create-secret** is the simplest way to create a GitHub secret.

Just call it and it will release the latest git tag created:

```
npx github-create-secret --owner Kikobeats --repo test --name MY_SECRET --value MY_VALUE
```

Alternatively, it can be used as Node.js module:

```js
const createSecret = require('github-create-secret')

await createSecret({
  owner: "Kikobeats",
  repo: "test",
  name: "MY_SECRET",
  secret: "MY_VALUE"
})
```

## License

**github-create-secret** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/kikobeats/github-create-secret/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/kikobeats/github-create-secret/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/kikobeats) · Twitter [@kikobeats](https://twitter.com/kikobeats)
