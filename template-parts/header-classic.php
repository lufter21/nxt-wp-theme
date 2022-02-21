<?php
/**
 * Template part for displaying a header
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Nxt
 */
?>

<div class="nxt-header__row row row_col-middle sm-row-col-fw">
	<div class="nxt-header__logo col">
		<?php the_custom_logo(); ?>
	</div>

	<nav class="col">
		<?php 
		wp_nav_menu(array(
			'theme_location' => 'header-menu',
			'container' => '',
			'menu_class' => 'menu',
			'walker' => new Custom_Header_Menu()
		)); 
		?>
	</nav>

	<?php if (has_nav_menu('header-right-menu')) : ?>
		<div class="col">
			<?php 
			wp_nav_menu(array(
				'theme_location' => 'header-right-menu',
				'container' => '',
				'menu_class' => 'menu',
				'walker' => new Custom_Header_Menu()
			)); 
			?>	
		</div>
	<?php endif; ?>

	<button class="js-close-menu menu-close-btn"></button>
</div>

<button class="js-open-menu open-menu-btn"><span></span><span></span><span></span><span></span></button>