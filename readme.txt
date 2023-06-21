=== Insecure Content Warning ===
Contributors:      10up, psorensen, adamsilverstein, tlovett, davidrgreen, dkotter, jeffpaul
Tags:              publishing, publishers, secure content, https, ssl
Requires at least: 5.7
Tested up to:      6.2
Requires PHP:      7.4
Stable tag:        1.1.0
License:           GPLv2 or later
License URI:       http://www.gnu.org/licenses/gpl-2.0.html

Prevent editors from adding insecure content in the editor.

== Description ==

Insecure Content Warning helps content creators with secure (HTTPS) websites avoid insecure-content warnings in the browser by flagging any elements in the content editor (such as images, videos, and embeds) that are being delivered or sourced from an insecure (HTTP) web address. All insecure elements are flagged before the content is published, and can be fixed manually or simply by clicking "fix it."

Compatible with the "classic" editor as well as the block editor (aka Gutenberg).

=== Technical Notes ===

* Requires PHP 7.4+.
* Requires WordPress 5.7+.
* Requires a secure / SSL (HTTPS) website, front and back end.

=== Usage ===

This plugin requires no configuration. Simply activate and the plugin will prevent posts with insecure elements from being published, as well as provide a banner with information on the offending assets.

== Optional WP-CLI Commands ==

These are not required for normal usage of the plugin, but are available as a utility for more advanced usage.

= wp icw fix =

Used to fix insecure elements in existing content. Can target specific posts or bulk batches.

`wp icw fix [<id>] [--include] [--all] [--post_type] [--limit] [--offset] [--dry-run]`

Example:
 ```
 $ wp icw fix --all --post_type=page
 Checking post content...
 Total posts checked for insecure URL(s): 10
 +-------------------------------------+
 | URL(s) fixed summary                |
 +-------------------------------------+
 | 0/0 URL(s) fixed in post 98         |
 | 0/0 URL(s) fixed in post 96         |
 | 0/0 URL(s) fixed in post 76         |
 | ...........................         |
 | 0/0 URL(s) fixed in post 6          |
 | 0/0 URL(s) fixed in post 1          |
 +-------------------------------------+
 ```

Run `wp help icw fix` for more information on the command args.

== Screenshots ==

1. Example of attempting to publish a post with insecure content - classic editor.
2. Example of attempting to publish a post with insecure content - block editor.

== Installation ==

1. Install the plugin via the plugin installer, either by searching for it or uploading a .zip file.
2. Activate the plugin.

== Changelog ==

= 1.1.0 - 2023-06-21 =
* **Added:** `View element` link to highlight and auto-scroll to the insecure element (props [@cadic](https://github.com/cadic), [@peterwilsoncc](https://github.com/peterwilsoncc), [@psorensen](https://github.com/psorensen), [@adamsilverstein](https://github.com/adamsilverstein), [@dkotter](https://github.com/dkotter) via [#73](https://github.com/10up/insecure-content-warning/pull/73)).
* **Changed:** Bump WordPress "tested up to" version 6.2 (props [@Sidsector9](https://github.com/Sidsector9), [@iamdharmesh](https://github.com/iamdharmesh) via [#117](hthttps://github.com/10up/insecure-content-warning/pull/117)).
* **Changed:** Update the Dependency Review GitHub Action (props [@jeffpaul](https://github.com/jeffpaul), [@Sidsector9](https://github.com/Sidsector9) via [#122](https://github.com/10up/insecure-content-warning/pull/122)).
* **Fixed:** Update dependencies of javascript assets (props [@cadic](https://github.com/cadic), [@peterwilsoncc](https://github.com/peterwilsoncc), [@psorensen](https://github.com/psorensen), [@adamsilverstein](https://github.com/adamsilverstein), [@dkotter](https://github.com/dkotter) via [#73](https://github.com/10up/insecure-content-warning/pull/73)).
* **Fixed:** Ensure that HTML blocks and converted classic editor blocks are correctly checked for insecure content (props [@nateconley](https://github.com/nateconley), [@Sidsector9](https://github.com/Sidsector9) via [#108](https://github.com/10up/insecure-content-warning/pull/108)).
* **Security:** Bump `simple-git` from 3.15.1 to 3.16.0 (props [@dependabot](https://github.com/apps/dependabot) via [#107](https://github.com/10up/insecure-content-warning/pull/107)).
* **Security:** Bump `json5` from 1.0.1 to 1.0.2 (props [@dependabot](https://github.com/apps/dependabot) via [#110](https://github.com/10up/insecure-content-warning/pull/110)).
* **Security:** Bump `ua-parser-js` from 1.0.2 to 1.0.33 and `browser-sync` from 2.27.11 to 2.28.1 (props [@dependabot](https://github.com/apps/dependabot) via [#111](https://github.com/10up/insecure-content-warning/pull/111)).
* **Security:** Bump `engine.io` from 6.4.1 to 6.4.2 (props [@dependabot](https://github.com/apps/dependabot) via [#119](https://github.com/10up/insecure-content-warning/pull/119)).
* **Security:** Bump `socket.io-parser` from 4.2.2 to 4.2.3 (props [@dependabot](https://github.com/apps/dependabot) via [#121](https://github.com/10up/insecure-content-warning/pull/121)).

= 1.0.3 - 2023-01-09 =
* **Note that this version bumps the minimum PHP version from 7.0 to 7.4 and the minimum WordPress version from 5.3 to 5.7.**

* **Added:** Documentation for our custom WP-CLI commands (props [@csloisel](https://github.com/csloisel), [@iamdharmesh](https://github.com/iamdharmesh) via [#99](https://github.com/10up/insecure-content-warning/pull/99)).
* **Added:** Setup E2E testing using Cypress (props [@cadic](https://github.com/cadic), [@iamdharmesh](https://github.com/iamdharmesh) via [#75](https://github.com/10up/insecure-content-warning/pull/75)).
* **Changed:** Bump minimum PHP version from 7.0 to 7.4 (props [@Sidsector9](https://github.com/Sidsector9), [@iamdharmesh](https://github.com/iamdharmesh), [@vikrampm1](https://github.com/vikrampm1) via [#81](https://github.com/10up/insecure-content-warning/pull/81)).
* **Changed:** Bump minimum WordPress version from 5.3 to 5.7 (props [@Sidsector9](https://github.com/Sidsector9), [@iamdharmesh](https://github.com/iamdharmesh), [@vikrampm1](https://github.com/vikrampm1) via [#81](https://github.com/10up/insecure-content-warning/pull/81)).
* **Changed:** Update Support Level from `Active` to `Stable` (props [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#80](https://github.com/10up/insecure-content-warning/pull/80)).
* **Changed:** Bump WordPress version "tested up to" 6.1 (props [@jayedul](https://github.com/jayedul), [@dkotter](https://github.com/dkotter) via [#97](hthttps://github.com/10up/insecure-content-warning/pull/97)).
* **Security:** Bump `terser` from 4.8.0 to 4.8.1 (props [@dependabot](https://github.com/apps/dependabot) via [#79](https://github.com/10up/insecure-content-warning/pull/79)).
* **Security:** Bump `loader-utils` from 1.4.0 to 1.4.2 (props [@dependabot](https://github.com/apps/dependabot) via [#87](https://github.com/10up/insecure-content-warning/pull/87)).
* **Security:** Bump `minimatch` from 3.0.4 to 3.1.2 (props [@dependabot](https://github.com/apps/dependabot) via [#88](https://github.com/10up/insecure-content-warning/pull/88)).
* **Security:** Bump `engine.io` from 3.2.1 to 6.2.1 (props [@dependabot](https://github.com/apps/dependabot) via [#90](https://github.com/10up/insecure-content-warning/pull/90)).
* **Security:** Bump `browser-sync` from 2.26.12 to 2.27.11 (props [@dependabot](https://github.com/apps/dependabot) via [#90](https://github.com/10up/insecure-content-warning/pull/90), [#104](https://github.com/10up/insecure-content-warning/pull/104)).
* **Security:** Bump `color-string` from 1.5.3 to 1.9.1 (props [@dependabot](https://github.com/apps/dependabot) via [#91](https://github.com/10up/insecure-content-warning/pull/91)).
* **Security:** Bump `is-svg` from 4.2.1 to 4.3.2 and `postcss-svgo` from 4.0.2 to 4.0.3 (props [@dependabot](https://github.com/apps/dependabot) via [#92](https://github.com/10up/insecure-content-warning/pull/92)).
* **Security:** Bump `browserslist` from 4.14.0 to 4.16.5 (props [@dependabot](https://github.com/apps/dependabot) via [#94](https://github.com/10up/insecure-content-warning/pull/94)).
* **Security:** Bump `ini` from 1.3.5 to 1.3.8 (props [@dependabot](https://github.com/apps/dependabot) via [#96](https://github.com/10up/insecure-content-warning/pull/96)).
* **Security:** Bump `decode-uri-component` from 0.2.0 to 0.2.2 (props [@dependabot](https://github.com/apps/dependabot) via [#98](https://github.com/10up/insecure-content-warning/pull/98)).
* **Security:** Bump `json5` from 1.0.1 to 1.0.2 (props [@dependabot](https://github.com/apps/dependabot) via [#102](https://github.com/10up/insecure-content-warning/pull/102)).
* **Security:** Bump `qs` from 6.2.3 to 6.11.0 (props [@dependabot](https://github.com/apps/dependabot) via [#104](https://github.com/10up/insecure-content-warning/pull/104)).

= 1.0.2 - 2022-06-27 =
* **Added:** Dependency security scanning (props [@jeffpaul](https://github.com/jeffpaul) via [#70](https://github.com/10up/insecure-content-warning/pull/70)).
* **Changed:** Bump WordPress version "tested up to" 6.0 (props [@cadic](https://github.com/cadic) via [#74](hthttps://github.com/10up/insecure-content-warning/pull/74)).
* **Security:** Bump `minimist` from 1.2.5 to 1.2.6 (props [@dependabot](https://github.com/apps/dependabot) via [#67](https://github.com/10up/insecure-content-warning/pull/67)).
* **Security:** Bump `postcss` from 7.0.32 to 7.0.39 (props [@dependabot](https://github.com/apps/dependabot) via [#68](https://github.com/10up/insecure-content-warning/pull/68)).

= 1.0.1 - 2022-02-17 =
* **Fixed:** Ensure we support WordPress 5.9 (props [@dkotter](https://github.com/dkotter), [@mohitwp](https://github.com/mohitwp), [@peterwilsoncc](https://github.com/peterwilsoncc)).

= 1.0.0 - 2021-08-24 =
* **Added:** Initial public release! 🎉

== Upgrade Notice ==

= 1.0.3 =
* Note that this version bumps the minimum PHP version from 7.0 to 7.4 and the minimum WordPress version from 5.3 to 5.7.
