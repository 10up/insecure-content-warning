=== Insecure Content Warning ===
Contributors:      10up, psorensen, adamsilverstein, tlovett, davidrgreen, dkotter
Tags:              publishing, publishers, secure content, https, ssl
Requires at least: 5.3
Tested up to:      5.9
Requires PHP:      7.0
Stable tag:        1.0.0
License:           GPLv2 or later
License URI:       http://www.gnu.org/licenses/gpl-2.0.html

Prevent editors from adding insecure content in the editor.

== Description ==

Insecure Content Warning helps content creators with secure (HTTPS) websites avoid insecure-content warnings in the browser by flagging any elements in the content editor (such as images, videos, and embeds) that are being delivered or sourced from an insecure (HTTP) web address. All insecure elements are flagged before the content is published, and can be fixed manually or simply by clicking "fix it."

Compatible with the "classic" editor as well as the block editor (aka Gutenberg).

=== Technical Notes ===

* Requires PHP 7.0+.
* Requires WordPress 5.3+.
* Requires a secure / SSL (HTTPS) website, front and back end.

=== Usage ===

This plugin requires no configuration. Simply activate and the plugin will prevent posts with insecure elements from being published, as well as provide a banner with information on the offending assets.

== Screenshots ==

1. Example of attempting to publish a post with insecure content - classic editor.
2. Example of attempting to publish a post with insecure content - block editor.

== Installation ==

1. Install the plugin via the plugin installer, either by searching for it or uploading a .zip file.
2. Activate the plugin.

== Changelog ==

= 1.0.0 =
* **Added:** Initial public release! 🎉
