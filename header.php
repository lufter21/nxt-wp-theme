<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Nxt
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<style>
		@font-face {
			font-display: swap;
			font-family: 'Courier New';
			src: url('<?php echo get_template_directory_uri(); ?>/fonts/courier-webfont.woff2') format('woff2'),
			url('<?php echo get_template_directory_uri(); ?>/fonts/courier-webfont.woff') format('woff');
			font-weight: 400;
			font-style: normal;
		}
		@font-face {
			font-display: swap;
			font-family: 'Montserrat';
			src: url('<?php echo get_template_directory_uri(); ?>/fonts/montserrat-medium-webfont.woff2') format('woff2'),
			url('<?php echo get_template_directory_uri(); ?>/fonts/montserrat-medium-webfont.woff') format('woff');
			font-weight: 500;
			font-style: normal;
		}
		@font-face {
			font-display: swap;
			font-family: 'Montserrat';
			src: url('<?php echo get_template_directory_uri(); ?>/fonts/montserrat-bold-webfont.woff2') format('woff2'),
			url('<?php echo get_template_directory_uri(); ?>/fonts/montserrat-bold-webfont.woff') format('woff');
			font-weight: 700;
			font-style: normal;
		}
	</style>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header id="nxt-header" class="nxt-header">
	<div class="nxt-wrp">
		<?php /* get_template_part( 'template-parts/header', 'block' ); */ ?>
		<?php get_template_part( 'template-parts/header', 'classic' ); ?>
	</div>
</header><!-- #nxt-header -->