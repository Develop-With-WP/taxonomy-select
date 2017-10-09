<?php

/*
Plugin Name:  Taxonomy Select
Plugin URI:   https://developer.wordpress.org/plugins/the-basics/
Description:  Basic WordPress Plugin Header Comment
Version:      20160911
Author:       WordPress.org
Author URI:   https://developer.wordpress.org/
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  wporg
Domain Path:  /languages
*/

function register_taxonomy_select_metabox() {
  add_meta_box(
    'taxonomy-select-meta-box',
    esc_html__( 'Taxonomy Select', 'text-domain' ),
    'taxonomy_select_meta_box_display',
    'post',
    'side',
    'high'
  );
}
add_action( 'add_meta_boxes', 'register_taxonomy_select_metabox' );

function taxonomy_select_meta_box_display( $post ) {
    wp_nonce_field( basename( __FILE__ ), 'taxonomy_select_nonce' );
    $tax_value = get_post_meta( $post->ID, 'taxonomy-select-list', true );
    $categories = get_terms( [
  		'taxonomy' => 'category',
  		'hide_empty' => false,
  	] );
    ?>
    <div id="taxonomy-select">
      <p class=taxonomy-select-escription>
        <?php esc_html_e( 'Select or Create a new taxonomy', 'text-domain' ); ?>
      </p>
      <select id="taxonomy-select-list" name="taxonomy-select-list">
        <option value=""></option>
        <?php if( ! empty( $categories ) ) :
          foreach( $categories as $category ) : ?>
            <option value="<?php echo esc_attr( $category->term_id ); ?>" <?php selected( $tax_value, $category->term_id ) ?>>
              <?php echo esc_html( $category->name ); ?>
            </option>
          <?php endforeach;
        endif; ?>
      </select>
    </div>
    <?php
}

function save_taxomony_select_value( $post_id ) {
    $is_autosave = wp_is_post_autosave( $post_id );
    $is_revision = wp_is_post_revision( $post_id );
    $is_valid_nonce = ( isset( $_POST[ 'taxonomy_select_nonce' ] ) && wp_verify_nonce( $_POST[ 'taxonomy_select_nonce' ], basename( __FILE__ ) ) ) ? 'true' : 'false';

    if ( isset( $_POST[ 'taxonomy-select-list' ] ) ) {
      update_post_meta( $post_id, 'taxonomy-select-list', absint( $_POST[ 'taxonomy-select-list' ] ) );
    }
}
add_action( 'save_post_post', 'save_taxomony_select_value' );
