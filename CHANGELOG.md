# Changelog

All notable changes to this project will be documented in this file, per [the Keep a Changelog standard](http://keepachangelog.com/), and will adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

## [1.2.2] - 2025-02-03
### Changed
- Bump WordPress minimum supported version from 6.4 to 6.6 (props [@peterwilsoncc](https://github.com/peterwilsoncc) via [#191](https://github.com/10up/insecure-content-warning/pull/191)).

### Security
- Bump `webpack` from 5.89.0 to 5.94.0 (props [@dependabot](https://github.com/apps/dependabot), [@faisal-alvi](https://github.com/faisal-alvi) via [#186](https://github.com/10up/insecure-content-warning/pull/186)).
- Bump `@wordpress/scripts` from 27.1.0 to 30.6.0, `express` from 4.19.2 to 4.21.0 and `serve-static` from 1.15.0 to 1.16.2 (props [@dependabot](https://github.com/apps/dependabot), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#191](https://github.com/10up/insecure-content-warning/pull/191), [#193](https://github.com/10up/insecure-content-warning/pull/193)).
- Bump `ws` from 7.5.10 to 8.18.0 (props [@dependabot](https://github.com/apps/dependabot), [@iamdharmesh](https://github.com/iamdharmesh) via [#193](https://github.com/10up/insecure-content-warning/pull/193)).

### Developer
- Add banner image to README and update badges (props [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#187](https://github.com/10up/insecure-content-warning/pull/187), [#190](https://github.com/10up/insecure-content-warning/pull/190)).

## [1.2.1] - 2024-08-22
**Note that this release bumps the WordPress minimum version from 5.8 to 6.4.**

### Changed
- Bump WordPress "tested up to" version to 6.6 (props [@QAharshalkadu](https://github.com/QAharshalkadu), [@ankitguptaindia](https://github.com/ankitguptaindia), [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#152](https://github.com/10up/insecure-content-warning/pull/152), [#153](https://github.com/10up/insecure-content-warning/pull/153), [#168](https://github.com/10up/insecure-content-warning/pull/168), [#176](https://github.com/10up/insecure-content-warning/pull/176)).
- Bump WordPress minimum supported version from 5.8 to 6.4 (props [@jeffpaul](https://github.com/jeffpaul), [@ankitguptaindia](https://github.com/ankitguptaindia), [@dkotter](https://github.com/dkotter) via [#168](https://github.com/10up/insecure-content-warning/pull/168), [#176](https://github.com/10up/insecure-content-warning/pull/176)).
- Changed import of `PluginPostStatusInfo` component from `@wordpress/edit-post` to `@wordpress/editor` (props [@gabriel-glo](https://github.com/gabriel-glo), [@dkotter](https://github.com/dkotter) via [#178](https://github.com/10up/insecure-content-warning/pull/178)).

### Security
- Bump `@babel/traverse` from 7.22.10 to 7.23.2 (props [@dependabot](https://github.com/apps/dependabot), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#150](https://github.com/10up/insecure-content-warning/pull/150)).
- Bump `axios` from 0.25.0 to 1.7.4 and `@wordpress/scripts` from 26.17.0 to 26.19.0 (props [@dependabot](https://github.com/apps/dependabot), [@ravinderk](https://github.com/ravinderk), [@faisal-alvi](https://github.com/faisal-alvi) via [#155](https://github.com/10up/insecure-content-warning/pull/155), [#179](https://github.com/10up/insecure-content-warning/pull/179)).
- Bump `express` from 4.18.2 to 4.19.2, `follow-redirects` from 1.15.3 to 1.15.6 and `webpack-dev-middleware` from 5.3.3 to 5.3.4 (props [@dependabot](https://github.com/apps/dependabot), [@Sidsector9](https://github.com/Sidsector9) via [#167](https://github.com/10up/insecure-content-warning/pull/167)).
- Bump `braces` from 3.0.2 to 3.0.3, `pac-resolver` from 7.0.0 to 7.0.1, `socks` from 2.7.1 to 2.8.3, `ws` from 7.5.9 to 7.5.10 and removed `ip` (props [@dependabot](https://github.com/apps/dependabot), [@iamdharmesh](https://github.com/iamdharmesh) via [#172](https://github.com/10up/insecure-content-warning/pull/172)).

### Developer
- Support for the WordPress.org plugin preview (props [@dkotter](https://github.com/dkotter), [@jeffpaul](https://github.com/jeffpaul) via [#156](https://github.com/10up/insecure-content-warning/pull/156)).
- Clean up NPM dependencies and update node to v20 (props [@dhanendran](https://github.com/dhanendran), [@iamdharmesh](https://github.com/iamdharmesh), [@Sidsector9](https://github.com/Sidsector9), [@dkotter](https://github.com/dkotter) via [#154](https://github.com/10up/insecure-content-warning/pull/154), [#160](https://github.com/10up/insecure-content-warning/pull/160)).
- Update the users in `CODEOWNERS` (props [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#157](https://github.com/10up/insecure-content-warning/pull/157)).
- Replaced `lee-dohm/no-response` with `actions/stale` to help with closing no-response/stale issues (props [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#165](https://github.com/10up/insecure-content-warning/pull/165)).
- Bumped `actions/upload-artifact` from v3 to v4 (props [@iamdharmesh](https://github.com/iamdharmesh), [@jeffpaul](https://github.com/jeffpaul) via [#169](https://github.com/10up/insecure-content-warning/pull/169)).
- Added a "Testing" section to the `CONTRIBUTING.md` file (props [@kmgalanakis](https://github.com/kmgalanakis), [@jeffpaul](https://github.com/jeffpaul) via [#170](https://github.com/10up/insecure-content-warning/pull/170)).
- Move from `actions/upload-release-asset` to `softprops/action-gh-release` Github action (props [@Sidsector9](https://github.com/Sidsector9), [@jeffpaul](https://github.com/jeffpaul) via [#177](https://github.com/10up/insecure-content-warning/pull/177)).
- Update repo badges, add WordPress Playground badge (props [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#180](https://github.com/10up/insecure-content-warning/pull/180)).
- Run E2E tests on the zip generated by "Build release zip" action and fix failing tests (props [@dkotter](https://github.com/dkotter), [@iamdharmesh](https://github.com/iamdharmesh) via [#182](https://github.com/10up/insecure-content-warning/pull/182)).

## [1.2.0] - 2023-10-16
**Note that this release bumps the WordPress minimum version from 5.7 to 5.8.**

### Added
- Ensure that saving using the keyboard shortcut `Ctrl|Command + S` triggers the insecure content check (props [@Sidsector9](https://github.com/Sidsector9), [@dinhtungdu](https://github.com/dinhtungdu), [@jeffpaul](https://github.com/jeffpaul), [@faisal-alvi](https://github.com/faisal-alvi) via [#56](https://github.com/10up/insecure-content-warning/pull/56)).
- New admin screen to bulk fix insecure content (props [@kmgalanakis](https://github.com/kmgalanakis), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#112](https://github.com/10up/insecure-content-warning/pull/112)).
- Composer, with PHPCBF and PHPCS to aid with coding standards (props [@cameronterry](https://github.com/cameronterry), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#127](https://github.com/10up/insecure-content-warning/pull/127)).
- Check for minimum required PHP version before loading the plugin (props [@kmgalanakis](https://github.com/kmgalanakis), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#135](https://github.com/10up/insecure-content-warning/pull/135)).
- Repo Automater GitHub Action added to automate common repo operations (props [@iamdharmesh](https://github.com/iamdharmesh), [@jeffpaul](https://github.com/jeffpaul) via [#142](https://github.com/10up/insecure-content-warning/pull/142)).

### Changed
- Bump WordPress "tested up to" version to 6.3 (props [@kmgalanakis](https://github.com/kmgalanakis), [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#140](https://github.com/10up/insecure-content-warning/pull/140), [#144](https://github.com/10up/insecure-content-warning/pull/144)).
- Bump WordPress minimum supported version from 5.7 to 5.8 (props [@iamdharmesh](https://github.com/iamdharmesh), [@dkotter](https://github.com/dkotter) via [#145](https://github.com/10up/insecure-content-warning/pull/145)).

### Fixed
- Properly handle fixing of multiple different instances of insecure content (props [@kmgalanakis](https://github.com/kmgalanakis), [@iamdharmesh](https://github.com/iamdharmesh) via [#139](https://github.com/10up/insecure-content-warning/pull/139)).
- Ensure all Cypress E2E tests pass when running on WordPress 6.3 (props [@iamdharmesh](https://github.com/iamdharmesh), [@dkotter](https://github.com/dkotter) via [#145](https://github.com/10up/insecure-content-warning/pull/145)).

### Security
- Bump `stylelint` from 9.10.1 to 15.10.1 (props [@dependabot](https://github.com/apps/dependabot), [@ravinderk](https://github.com/ravinderk) via [#126](https://github.com/10up/insecure-content-warning/pull/126)).
- Bump `cypress` from 11.2.0 to 13.2.0, `@10up/cypress-wp-utils` from 0.1.0 to 0.2.0 and `@wordpress/env` from 5.8.0 to 8.7.0 (props [@iamdharmesh](https://github.com/iamdharmesh), [@dkotter](https://github.com/dkotter) via [#145](https://github.com/10up/insecure-content-warning/pull/145)).
- Bump `postcss` from 8.4.27 to 8.4.31 (props [@dependabot](https://github.com/apps/dependabot), [@Sidsector9](https://github.com/Sidsector9) via [#147](https://github.com/10up/insecure-content-warning/pull/147)).

## [1.1.0] - 2023-06-21
### Added
- `View element` link to highlight and auto-scroll to the insecure element (props [@cadic](https://github.com/cadic), [@peterwilsoncc](https://github.com/peterwilsoncc), [@psorensen](https://github.com/psorensen), [@adamsilverstein](https://github.com/adamsilverstein), [@dkotter](https://github.com/dkotter) via [#73](https://github.com/10up/insecure-content-warning/pull/73)).

### Changed
- Bump WordPress "tested up to" version 6.2 (props [@Sidsector9](https://github.com/Sidsector9), [@iamdharmesh](https://github.com/iamdharmesh) via [#117](hthttps://github.com/10up/insecure-content-warning/pull/117)).
- Update the Dependency Review GitHub Action (props [@jeffpaul](https://github.com/jeffpaul), [@Sidsector9](https://github.com/Sidsector9) via [#122](https://github.com/10up/insecure-content-warning/pull/122)).

### Fixed
- Update dependencies of javascript assets (props [@cadic](https://github.com/cadic), [@peterwilsoncc](https://github.com/peterwilsoncc), [@psorensen](https://github.com/psorensen), [@adamsilverstein](https://github.com/adamsilverstein), [@dkotter](https://github.com/dkotter) via [#73](https://github.com/10up/insecure-content-warning/pull/73)).
- Ensure that HTML blocks and converted classic editor blocks are correctly checked for insecure content (props [@nateconley](https://github.com/nateconley), [@Sidsector9](https://github.com/Sidsector9) via [#108](https://github.com/10up/insecure-content-warning/pull/108)).

### Security
- Bump `simple-git` from 3.15.1 to 3.16.0 (props [@dependabot](https://github.com/apps/dependabot) via [#107](https://github.com/10up/insecure-content-warning/pull/107)).
- Bump `json5` from 1.0.1 to 1.0.2 (props [@dependabot](https://github.com/apps/dependabot) via [#110](https://github.com/10up/insecure-content-warning/pull/110)).
- Bump `ua-parser-js` from 1.0.2 to 1.0.33 and `browser-sync` from 2.27.11 to 2.28.1 (props [@dependabot](https://github.com/apps/dependabot) via [#111](https://github.com/10up/insecure-content-warning/pull/111)).
- Bump `engine.io` from 6.4.1 to 6.4.2 (props [@dependabot](https://github.com/apps/dependabot) via [#119](https://github.com/10up/insecure-content-warning/pull/119)).
- Bump `socket.io-parser` from 4.2.2 to 4.2.3 (props [@dependabot](https://github.com/apps/dependabot) via [#121](https://github.com/10up/insecure-content-warning/pull/121)).

## [1.0.3] - 2023-01-09
**Note that this release bumps the WordPress minimum version from 5.3 to 5.7 and the PHP minimum version from 7.0 to 7.4.**

### Added
- Documentation for our custom WP-CLI commands (props [@csloisel](https://github.com/csloisel), [@iamdharmesh](https://github.com/iamdharmesh) via [#99](https://github.com/10up/insecure-content-warning/pull/99)).
- Setup E2E testing using Cypress (props [@cadic](https://github.com/cadic), [@iamdharmesh](https://github.com/iamdharmesh) via [#75](https://github.com/10up/insecure-content-warning/pull/75)).

### Changed
- Bump minimum PHP version from 7.0 to 7.4 (props [@Sidsector9](https://github.com/Sidsector9), [@iamdharmesh](https://github.com/iamdharmesh), [@vikrampm1](https://github.com/vikrampm1) via [#81](https://github.com/10up/insecure-content-warning/pull/81)).
- Bump minimum WordPress version from 5.3 to 5.7 (props [@Sidsector9](https://github.com/Sidsector9), [@iamdharmesh](https://github.com/iamdharmesh), [@vikrampm1](https://github.com/vikrampm1) via [#81](https://github.com/10up/insecure-content-warning/pull/81)).
- Update Support Level from `Active` to `Stable` (props [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#80](https://github.com/10up/insecure-content-warning/pull/80)).
- Bump WordPress version "tested up to" 6.1 (props [@jayedul](https://github.com/jayedul), [@dkotter](https://github.com/dkotter) via [#97](hthttps://github.com/10up/insecure-content-warning/pull/97)).

### Security
- Bump `terser` from 4.8.0 to 4.8.1 (props [@dependabot](https://github.com/apps/dependabot) via [#79](https://github.com/10up/insecure-content-warning/pull/79)).
- Bump `loader-utils` from 1.4.0 to 1.4.2 (props [@dependabot](https://github.com/apps/dependabot) via [#87](https://github.com/10up/insecure-content-warning/pull/87)).
- Bump `minimatch` from 3.0.4 to 3.1.2 (props [@dependabot](https://github.com/apps/dependabot) via [#88](https://github.com/10up/insecure-content-warning/pull/88)).
- Bump `engine.io` from 3.2.1 to 6.2.1 (props [@dependabot](https://github.com/apps/dependabot) via [#90](https://github.com/10up/insecure-content-warning/pull/90)).
- Bump `browser-sync` from 2.26.12 to 2.27.11 (props [@dependabot](https://github.com/apps/dependabot) via [#90](https://github.com/10up/insecure-content-warning/pull/90), [#104](https://github.com/10up/insecure-content-warning/pull/104)).
- Bump `color-string` from 1.5.3 to 1.9.1 (props [@dependabot](https://github.com/apps/dependabot) via [#91](https://github.com/10up/insecure-content-warning/pull/91)).
- Bump `is-svg` from 4.2.1 to 4.3.2 and `postcss-svgo` from 4.0.2 to 4.0.3 (props [@dependabot](https://github.com/apps/dependabot) via [#92](https://github.com/10up/insecure-content-warning/pull/92)).
- Bump `browserslist` from 4.14.0 to 4.16.5 (props [@dependabot](https://github.com/apps/dependabot) via [#94](https://github.com/10up/insecure-content-warning/pull/94)).
- Bump `ini` from 1.3.5 to 1.3.8 (props [@dependabot](https://github.com/apps/dependabot) via [#96](https://github.com/10up/insecure-content-warning/pull/96)).
- Bump `decode-uri-component` from 0.2.0 to 0.2.2 (props [@dependabot](https://github.com/apps/dependabot) via [#98](https://github.com/10up/insecure-content-warning/pull/98)).
- Bump `json5` from 1.0.1 to 1.0.2 (props [@dependabot](https://github.com/apps/dependabot) via [#102](https://github.com/10up/insecure-content-warning/pull/102)).
- Bump `qs` from 6.2.3 to 6.11.0 (props [@dependabot](https://github.com/apps/dependabot) via [#104](https://github.com/10up/insecure-content-warning/pull/104)).

## [1.0.2] - 2022-06-27
### Added
- Dependency security scanning (props [@jeffpaul](https://github.com/jeffpaul) via [#70](https://github.com/10up/insecure-content-warning/pull/70)).

### Changed
- Bump WordPress version "tested up to" 6.0 (props [@cadic](https://github.com/cadic) via [#74](hthttps://github.com/10up/insecure-content-warning/pull/74)).

### Security
- Bump `minimist` from 1.2.5 to 1.2.6 (props [@dependabot](https://github.com/apps/dependabot) via [#67](https://github.com/10up/insecure-content-warning/pull/67)).
- Bump `postcss` from 7.0.32 to 7.0.39 (props [@dependabot](https://github.com/apps/dependabot) via [#68](https://github.com/10up/insecure-content-warning/pull/68)).

## [1.0.1] - 2022-02-17
### Fixed
- Ensure we support WordPress 5.9 (props [@dkotter](https://github.com/dkotter), [@mohitwp](https://github.com/mohitwp), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#64](https://github.com/10up/insecure-content-warning/pull/64)).

## [1.0.0] - 2021-08-24
### Added
- Initial public release! 🎉

[Unreleased]: https://github.com/10up/insecure-content-warning/compare/trunk...develop
[1.2.2]: https://github.com/10up/insecure-content-warning/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/10up/insecure-content-warning/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/10up/insecure-content-warning/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/10up/insecure-content-warning/compare/1.0.3...1.1.0
[1.0.3]: https://github.com/10up/insecure-content-warning/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/10up/insecure-content-warning/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/10up/insecure-content-warning/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/10up/insecure-content-warning/tree/2b267880164895f9df356c9573c3546ac5673882
