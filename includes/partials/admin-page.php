<?php
/**
 * The admin page template.
 *
 * @package ICW
 */

use ICW\FIX\FixInsecureContent;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$fix_insecure_content_class = FixInsecureContent::get_instance();
$post_types                 = get_post_types( $fix_insecure_content_class->get_wp_query_post_type_args(), 'objects' );
?>

<div class="wrap">
	<h2><?php esc_html_e( 'Insecure Content Warning', 'insecure-content-warning' ); ?></h2>

	<h3><?php esc_html_e( 'Fix insecure content', 'insecure-content-warning' ); ?></h3>

	<table class="form-table">
		<tbody>
			<tr>
				<th scope="row"><label for="icw-post-selection"><?php esc_html_e( 'Post selection', 'insecure-content-warning' ); ?></label></th>
				<td>
					<select name="post_selection" id="icw-post-selection">
						<option selected="selected" value="all"><?php esc_html_e( 'All', 'insecure-content-warning' ); ?></option>
						<option value="posts"><?php esc_html_e( 'Individual post(s)', 'insecure-content-warning' ); ?></option>
						<option value="all_from_post_type"><?php esc_html_e( 'All from post type', 'insecure-content-warning' ); ?></option>
					</select>
				</td>
			</tr>

			<tr id="icw-post-ids-row" class="hidden" aria-hidden="true">
				<th scope="row"><label for="icw-post-ids"><?php esc_html_e( 'Post ID(s)', 'insecure-content-warning' ); ?></label></th>
				<td>
					<input name="post_ids" type="text" id="icw-post-ids" class="regular-text" placeholder="<?php echo esc_attr__( 'Comma-separated list of post IDs', 'insecure-content-warning' ); ?>">
				</td>
			</tr>

			<tr id="icw-post-type-row" class="hidden" aria-hidden="true">
				<th scope="row"><label for="icw-post-type"><?php esc_html_e( 'Post type', 'insecure-content-warning' ); ?></label></th>
				<td>
					<select name="post_type" id="icw-post-type">
						<?php foreach ( $post_types as $pt ) : ?>
							<?php if ( array_values( $post_types )[0] === $pt ) : ?>
								<option selected="selected" value="<?php echo esc_attr( $pt->name ); ?>"><?php echo esc_html( $pt->label ); ?></option>
							<?php else : ?>
								<option value="<?php echo esc_attr( $pt->name ); ?>"><?php echo esc_html( $pt->label ); ?></option>
							<?php endif; ?>
						<?php endforeach; ?>
					</select>
				</td>
			</tr>

			<tr>
				<th scope="row"><label for="icw-batch-size"><?php esc_html_e( 'Items to scan at a time', 'insecure-content-warning' ); ?></label></th>
				<td>
					<input name="limit" type="number" id="icw-batch-size" class="small-text" value="10">
				</td>
			</tr>

			<tr>
				<th scope="row"><?php esc_html_e( 'Dry-run', 'insecure-content-warning' ); ?></th>
				<td>
					<fieldset>
						<legend class="screen-reader-text">
							<span><?php esc_html_e( 'Dry-run', 'insecure-content-warning' ); ?></span>
						</legend>
						<label for="dry_run">
							<input name="dry_run" type="checkbox" id="icw-dry-run" value="1" checked>
						</label>
					</fieldset>
				</td>
			</tr>
		</tbody>
	</table>

	<div style="display: flex; flex-direction: row; align-items: center; gap: 10px; ">
		<a id="icw-fix-content-btn" href="#" class="button button-primary"><?php esc_html_e( 'Fix', 'insecure-content-warning' ); ?></a>
		<img id="icw-loading-spinner" class="hidden" src="<?php echo esc_url( admin_url( '/images/wpspin_light.gif' ) ); ?>" />
	</div>

	<div id="icw-fix-log" class="icw-fix-log hidden" aria-hidden="true"></div>
</div>
