# Contributing to Marpit

Thank you for taking the time to read how to contribute to Marpit! This is the guideline for contributing to Marpit.

We are following [the contributing guideline of marp-team projects](https://github.com/marp-team/marp/blob/master/.github/CONTRIBUTING.md). Please read this before starting work.

- [**Code of Conduct**](https://github.com/marp-team/marp/blob/master/.github/CODE_OF_CONDUCT.md)
- [**Report issue**](https://github.com/marp-team/marp/blob/master/.github/CONTRIBUTING.md#report-issue)
- [**Pull request**](https://github.com/marp-team/marp/blob/master/.github/CONTRIBUTING.md#pull-request)

## Development

### Pull request

When sending pull request updated the interface of public class, it's better to mind to these resources.

- JSDoc (for [API documentation](https://marpit-api.marp.app/))
- [Documents](https://marpit.marp.app/) (at [`/docs/`](https://github.com/marp-team/marpit/blob/master/docs))
- [`/index.d.ts`](https://github.com/marp-team/marpit/blob/master/index.d.ts) (Type definition for TypeScript)

## Release

The core maintainer can release package to [npm](https://npmjs.com/package/@marp-team/marpit). For the security reason, we are not planned to automate release. [We require two-factor authentication to release](https://blog.npmjs.org/post/175861857230/two-factor-authentication-protection-for-packages).

In a release process, you have to use `npm` command instead of `yarn`.

1. Run `npm version [major|minor|patch]` at latest `master` branch. It adds tag and updates [CHANGELOG.md](../CHANGELOG.md).
2. Push branch and tag by `git push && git push --tags`.
3. Release package to npm by `npm release`.
4. Update [GitHub release](https://github.com/marp-team/marpit/releases) if possible.

> :information_source: In running important commands, code styling and tests are checked again through `preversion` and `prepack` scripts.
