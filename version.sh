#!/bin/bash
grep -q '## \[Unreleased\]' CHANGELOG.md &&
  sed -i "s/## \[Unreleased\]/&\n\n## v$npm_package_version - $(date -u '+%F')/" CHANGELOG.md &&
  git add -A CHANGELOG.md
