<?php
/**
 * Template part for displaying a block header
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Nxt
 */

$get_posts_result = get_posts( array(
	'numberposts' => 1,
	'include'     => array(48),
	'post_type'   => 'wp_block'
) );

echo $get_posts_result[0]->post_content;

wp_reset_postdata();