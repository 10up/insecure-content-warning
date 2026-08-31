# Insecure Content Warning

![Insecure Content Warning](https://github.com/10up/insecure-content-warning/blob/develop/.wordpress-org/banner-1544x500.png)

[![Support Level](https://img.shields.io/badge/support-stable-blue.svg)](#support-level) ![Required PHP Version](https://img.shields.io/wordpress/plugin/required-php/insecure-content-warning?label=Requires%20PHP) ![Required WP Version](https://img.shields.io/wordpress/plugin/wp-version/insecure-content-warning?label=Requires%20WordPress)  ![WordPress tested up to version](https://img.shields.io/wordpress/plugin/tested/insecure-content-warning?label=WordPress) [![GPLv2 License](https://img.shields.io/github/license/10up/insecure-content-warning.svg)](https://github.com/10up/insecure-content-warning/blob/develop/LICENSE.md) [![Dependency Review](https://github.com/10up/insecure-content-warning/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/10up/insecure-content-warning/actions/workflows/dependency-review.yml) [![E2E test](https://github.com/10up/insecure-content-warning/actions/workflows/cypress.yml/badge.svg)](https://github.com/10up/insecure-content-warning/actions/workflows/cypress.yml) [![Linting](https://github.com/10up/insecure-content-warning/actions/workflows/lint.yml/badge.svg)](https://github.com/10up/insecure-content-warning/actions/workflows/lint.yml) [![PHP Compatibility](https://github.com/10up/insecure-content-warning/actions/workflows/php-compatibility.yml/badge.svg)](https://github.com/10up/insecure-content-warning/actions/workflows/php-compatibility.yml) [![CodeQL](https://github.com/10up/insecure-content-warning/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/10up/insecure-content-warning/actions/workflows/github-code-scanning/codeql) [![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/insecure-content-warning?logo=wordpress&logoColor=FFFFFF&label=Playground%20Demo&labelColor=3858E9&color=3858E9)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/10up/insecure-content-warning/develop/.wordpress-org/blueprints/blueprint.json)

> Prevent editors from adding insecure content in the editor.

## Description

Insecure Content Warning helps content creators with secure (HTTPS) websites avoid insecure-content warnings in the browser by flagging any elements in the editor (such as images and embeds) that are being delivered or sourced from an insecure (HTTP) web address. All insecure elements are flagged before the content is published, and can be fixed manually or simply by clicking "fix it."

Compatible with both the block and classic editors.

![Example of attempting to publish a post with insecure content - classic editor.](.wordpress-org/screenshot-1.png)

## Requirements

* PHP 7.4+.
* WordPress 6.9+.
* A secure / SSL (HTTPS) website, front and back end.

## Installation

1. Install the plugin via the plugin installer, either by searching for it or uploading a .zip file.
2. Activate the plugin.

## Usage

This plugin requires no configuration. Simply activate and the plugin will prevent posts with insecure elements from being published, as well as provide a banner with information on the offending assets.

![Example of attempting to publish a post with insecure content - block editor.](.wordpress-org/screenshot-2.png)

### Optional WP-CLI Commands

These are not required for normal usage of the plugin, but are available as a utility for more advanced usage.

#### wp icw fix

Used to fix insecure elements in existing content. Can target specific posts or bulk batches.

`wp icw fix [<id>] [--include] [--all] [--post_type] [--limit] [--offset] [--dry-run]`

**Example:**
Fix all page content:
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

Run `wp help icw fix` for more information.

## Frequently Asked Questions

### Where do I report security bugs found in this plugin?

Please report security bugs found in the source code of the Insecure Content Warning plugin through the [Patchstack Vulnerability Disclosure  Program](https://patchstack.com/database/vdp/ce5b1b34-7097-4f7b-9ab0-f96ee3dd9409).  The Patchstack team will assist you with verification, CVE assignment, and notify the developers of this plugin.

## Support Level

**Stable:** 10up is not planning to develop any new features for this, but will still respond to bug reports and security concerns. We welcome PRs, but any that include new features should be small and easy to integrate and should not include breaking changes. We otherwise intend to keep this tested up to the most recent version of WordPress.

## Changelog

A complete listing of all notable changes to Insecure Content Warning are documented in [CHANGELOG.md](https://github.com/10up/insecure-content-warning/blob/develop/CHANGELOG.md).

## Contributing

Please read [CODE_OF_CONDUCT.md](https://github.com/10up/insecure-content-warning/blob/develop/CODE_OF_CONDUCT.md) for details on our code of conduct, [CONTRIBUTING.md](https://github.com/10up/insecure-content-warning/blob/develop/CONTRIBUTING.md) for details on the process for submitting pull requests to us, and [CREDITS.md](https://github.com/10up/insecure-content-warning/blob/develop/CREDITS.md) for a listing of maintainers of, contributors to, and libraries used by Insecure Content Warning.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://github.com/10up/.github/blob/trunk/profile/10up-github-banner.jpg" width="850" alt="Work with the 10up WordPress Practice at Fueled"></a>
