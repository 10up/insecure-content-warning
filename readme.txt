=== Insecure Content Warning ===
Contributors:      10up, psorensen, adamsilverstein, tlovett, davidrgreen, dkotter, jeffpaul
Tags:              publishing, publishers, secure content, https, ssl
Tested up to:      6.6
Stable tag:        1.2.1
License:           GPLv2 or later
License URI:       http://www.gnu.org/licenses/gpl-2.0.html

Prevent editors from adding insecure content in the editor.

== Description ==

Insecure Content Warning helps content creators with secure (HTTPS) websites avoid insecure-content warnings in the browser by flagging any elements in the content editor (such as images, videos, and embeds) that are being delivered or sourced from an insecure (HTTP) web address. All insecure elements are flagged before the content is published, and can be fixed manually or simply by clicking "fix it."

Compatible with the "classic" editor as well as the block editor (aka Gutenberg).

=== Technical Notes ===

* Requires PHP 7.4+.
* Requires WordPress 5.8+.
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

= 1.2.1 - 2024-08-22 =

**Note that this release bumps the WordPress minimum version from 5.8 to 6.4.**

* **Changed:** Bump WordPress "tested up to" version to 6.4 (props [@QAharshalkadu](https://github.com/QAharshalkadu), [@ankitguptaindia](https://github.com/ankitguptaindia), [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#152](https://github.com/10up/insecure-content-warning/pull/152), [#153](https://github.com/10up/insecure-content-warning/pull/153), [#168](https://github.com/10up/insecure-content-warning/pull/168), [#176](https://github.com/10up/insecure-content-warning/pull/176)).
* **Changed:** Bump WordPress minimum supported version from 5.8 to 6.4 (props [@jeffpaul](https://github.com/jeffpaul), [@ankitguptaindia](https://github.com/ankitguptaindia), [@dkotter](https://github.com/dkotter) via [#168](https://github.com/10up/insecure-content-warning/pull/168), [#176](https://github.com/10up/insecure-content-warning/pull/176)).
* **Changed:** Import of `PluginPostStatusInfo` component from `@wordpress/edit-post` to `@wordpress/editor` (props [@gabriel-glo](https://github.com/gabriel-glo), [@dkotter](https://github.com/dkotter) via [#178](https://github.com/10up/insecure-content-warning/pull/178)).
* **Security:** Bump `@babel/traverse` from 7.22.10 to 7.23.2 (props [@dependabot](https://github.com/apps/dependabot), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#150](https://github.com/10up/insecure-content-warning/pull/150)).
* **Security:** Bump `axios` from 0.25.0 to 1.7.4 and `@wordpress/scripts` from 26.17.0 to 26.19.0 (props [@dependabot](https://github.com/apps/dependabot), [@ravinderk](https://github.com/ravinderk), [@faisal-alvi](https://github.com/faisal-alvi) via [#155](https://github.com/10up/insecure-content-warning/pull/155), [#179](https://github.com/10up/insecure-content-warning/pull/179)).
* **Security:** Bump `express` from 4.18.2 to 4.19.2, `follow-redirects` from 1.15.3 to 1.15.6 and `webpack-dev-middleware` from 5.3.3 to 5.3.4 (props [@dependabot](https://github.com/apps/dependabot), [@Sidsector9](https://github.com/Sidsector9) via [#167](https://github.com/10up/insecure-content-warning/pull/167)).
* **Security:** Bump `braces` from 3.0.2 to 3.0.3, `pac-resolver` from 7.0.0 to 7.0.1, `socks` from 2.7.1 to 2.8.3, `ws` from 7.5.9 to 7.5.10 and removed `ip` (props [@dependabot](https://github.com/apps/dependabot), [@iamdharmesh](https://github.com/iamdharmesh) via [#172](https://github.com/10up/insecure-content-warning/pull/172)).

= 1.2.0 - 2023-10-16 =

* **Note that this version bumps the minimum WordPress version from 5.7 to 5.8.**

* **Added:** Ensure that saving using the keyboard shortcut `Ctrl|Command + S` triggers the insecure content check (props [@Sidsector9](https://github.com/Sidsector9), [@dinhtungdu](https://github.com/dinhtungdu), [@jeffpaul](https://github.com/jeffpaul), [@faisal-alvi](https://github.com/faisal-alvi) via [#56](https://github.com/10up/insecure-content-warning/pull/56)).
* **Added:** New admin screen to bulk fix insecure content (props [@kmgalanakis](https://github.com/kmgalanakis), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#112](https://github.com/10up/insecure-content-warning/pull/112)).
* **Added:** Composer, with PHPCBF and PHPCS to aid with coding standards (props [@cameronterry](https://github.com/cameronterry), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#127](https://github.com/10up/insecure-content-warning/pull/127)).
* **Added:** Check for minimum required PHP version before loading the plugin (props [@kmgalanakis](https://github.com/kmgalanakis), [@peterwilsoncc](https://github.com/peterwilsoncc) via [#135](https://github.com/10up/insecure-content-warning/pull/135)).
* **Added:** Repo Automater GitHub Action added to automate common repo operations (props [@iamdharmesh](https://github.com/iamdharmesh), [@jeffpaul](https://github.com/jeffpaul) via [#142](https://github.com/10up/insecure-content-warning/pull/142)).
* **Changed:** Bump WordPress "tested up to" version to 6.3 (props [@kmgalanakis](https://github.com/kmgalanakis), [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter) via [#140](https://github.com/10up/insecure-content-warning/pull/140), [#144](https://github.com/10up/insecure-content-warning/pull/144)).
* **Changed:** Bump WordPress minimum supported version from 5.7 to 5.8 (props [@iamdharmesh](https://github.com/iamdharmesh), [@dkotter](https://github.com/dkotter) via [#145](https://github.com/10up/insecure-content-warning/pull/145)).
* **Fixed:** Properly handle fixing of multiple different instances of insecure content (props [@kmgalanakis](https://github.com/kmgalanakis), [@iamdharmesh](https://github.com/iamdharmesh) via [#139](https://github.com/10up/insecure-content-warning/pull/139)).
* **Fixed:** Ensure all Cypress E2E tests pass when running on WordPress 6.3 (props [@iamdharmesh](https://github.com/iamdharmesh), [@dkotter](https://github.com/dkotter) via [#145](https://github.com/10up/insecure-content-warning/pull/145)).
* **Security:** Bump `stylelint` from 9.10.1 to 15.10.1 (props [@dependabot](https://github.com/apps/dependabot), [@ravinderk](https://github.com/ravinderk) via [#126](https://github.com/10up/insecure-content-warning/pull/126)).
* **Security:** Bump `cypress` from 11.2.0 to 13.2.0, `@10up/cypress-wp-utils` from 0.1.0 to 0.2.0 and `@wordpress/env` from 5.8.0 to 8.7.0 (props [@iamdharmesh](https://github.com/iamdharmesh), [@dkotter](https://github.com/dkotter) via [#145](https://github.com/10up/insecure-content-warning/pull/145)).
* **Security:** Bump `postcss` from 8.4.27 to 8.4.31 (props [@dependabot](https://github.com/apps/dependabot), [@Sidsector9](https://github.com/Sidsector9) via [#147](https://github.com/10up/insecure-content-warning/pull/147)).

[View historical changelog details here](https://github.com/10up/insecure-content-warning/blob/develop/CHANGELOG.md).

== Upgrade Notice ==

= 1.2.1 =
* Note that this version bumps the minimum WordPress version from 5.8 to 6.4.

= 1.2.0 =
* Note that this version bumps the minimum WordPress version from 5.7 to 5.8.

= 1.0.3 =
* Note that this version bumps the minimum PHP version from 7.0 to 7.4 and the minimum WordPress version from 5.3 to 5.7.
