=== Insecure Content Warning ===
Contributors: 10up, psorensen, adamsilverstein, tlovett, davidrgreen
Author URI: http://10up.com
Plugin URI: https://github.com/10up/insecure-content-warning
Tags: publishing, publishers, secure content, https
Requires at least: 4.6
Tested up to: 4.9.6
Requires PHP: 5.3
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: insecure-content-warning

Helps prevent mixed-content browser warnings by flagging elements (images, videos, embeds) in the editor sourced from insecure web addresses, before a post is published.

== Description ==

Insecure Content Warning helps content creators with secure (HTTPS) websites avoid insecure-content warnings in the browser by flagging any elements in the content editor (such as images and embeds) that are being delivered or sourced from an insecure (HTTP) web address. All insecure elements are flagged before the content is published, and can be fixed manually or simply by clicking "fix it."

Compatible with the "classic" editor as well as Gutenberg, the next generation WordPress editor. Gutenberg compatibility is considered "in beta", until Gutenberg itself becomes part of WordPress core.

=== Technical Notes ===

* Requires PHP 5.3+.
* Requires WordPress 4.6+.
* Gutenberg support is in beta.
* Requires a secure / SSL (HTTPS) website, front and back end.


== Screenshots ==

1. Example of attempting to publish a post with insecure content - classic editor.
2. Example of attempting to publish a post with insecure content - Gutenberg.


== Installation ==
1. Install the plugin via the plugin installer, either by searching for it or uploading a .zip file.
2. Activate the plugin.


== Changelog ==

= 1.0 =
* Initial plugin release.
