<?php
/**
 * Template part for displaying a header
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Nxt
 */
?>

<div class="row row_col-middle md-row-col-fw">
	<div class="nxt-header__logo col">
		<?php the_custom_logo(); ?>
	</div>

	<div class="nxt-header__row col">
		<div class="row row_col-middle">
			<nav class="col col_grow <?php echo has_nav_menu('header-right-menu') ? 'nxt-header__nav nxt-header__nav_center' : 'nxt-header__nav'; ?>">
				<?php
				wp_nav_menu(array(
					'theme_location' => 'header-menu',
					'container' => '',
					'menu_class' => 'nxt-menu',
					'walker' => new Custom_Header_Menu()
				)); 
				?>
			</nav>

			<div class="col">
				<div class="nxt-header__mob-menu-logo">
					<?php the_custom_logo(); ?>
				</div>

				<?php
				$nxt_description = get_bloginfo( 'description', 'display' );

				if ( $nxt_description || is_customize_preview() ) :
				?>
				<div class="nxt-header__mob-menu-bloginfo site-description">
					<?php echo $nxt_description; ?>
				</div>
				<?php endif; ?>

				<?php if (has_nav_menu('header-right-menu')) : ?>
				<div class="nxt-header__nav-right">
					<?php 
					wp_nav_menu(array(
						'theme_location' => 'header-right-menu',
						'container' => '',
						'menu_class' => 'nxt-menu',
						'walker' => new Custom_Header_Menu()
					)); 
					?>	
				</div>
				<?php endif; ?>

				<?php if (has_nav_menu('header-mob-bottom-menu')) : ?>
				<div class="nxt-header__mob-nav-bottom">
					<?php 
					wp_nav_menu(array(
						'theme_location' => 'header-mob-bottom-menu',
						'container' => '',
						'menu_class' => 'nxt-menu nxt-menu_nowrap',
						'walker' => new Custom_Header_Menu()
					)); 
					?>	
				</div>
				<?php endif; ?>
			</div>
		</div>
		
		<div class="nxt-header__menu-tit">
			<?php echo esc_html__( 'Menu', 'nxt' ); ?>
		</div>
		<button class="js-close-menu nxt-menu-close-btn"></button>
	</div>
</div>

<button class="js-open-menu nxt-open-menu-btn"><span></span><span></span><span></span><span></span></button>